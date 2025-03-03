import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

const loadRazorpay = () => {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

const Checkout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [locationLoading, setLocationLoading] = useState(false);
    const [checkoutItems, setCheckoutItems] = useState([]);
    const [formData, setFormData] = useState({
        address: '',
        paymentMethod: 'Cash On Delivery',
        latitude: '',
        longitude: '',
        verified: false
    });

    useEffect(() => {
        // Check if it's a Buy Now purchase or Cart checkout
        const isBuyNow = location.state?.isBuyNow;
        
        if (isBuyNow) {
            // Get the buy now item
            const buyNowItem = JSON.parse(localStorage.getItem('buyNowItem'));
            if (!buyNowItem) {
                toast.error('Product details not found');
                navigate('/');
                return;
            }
            setCheckoutItems([buyNowItem]);
        } else {
            // Get cart items
            const cartItems = JSON.parse(localStorage.getItem('checkoutItems') || '[]');
            if (cartItems.length === 0) {
                toast.error('No items in cart');
                navigate('/cart');
                return;
            }
            setCheckoutItems(cartItems);
        }
    }, [location.state]);

    // Calculate total amount
    const calculateTotal = () => {
        return checkoutItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    // Function to get current location
    const getCurrentLocation = () => {
        setLocationLoading(true);
        if (!navigator.geolocation) {
            toast.error('Geolocation is not supported by your browser');
            setLocationLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    // Use reverse geocoding to get address from coordinates
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`
                    );
                    const data = await response.json();
                    
                    setFormData({
                        ...formData,
                        address: data.display_name,
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        verified: true
                    });
                    toast.success('Location detected successfully');
                } catch (error) {
                    console.error('Error getting address:', error);
                    toast.error('Failed to get address details');
                } finally {
                    setLocationLoading(false);
                }
            },
            (error) => {
                console.error('Error getting location:', error);
                toast.error('Failed to get your location. Please try again or enter manually.');
                setLocationLoading(false);
            }
        );
    };

    // Function to verify entered address
    const verifyAddress = async () => {
        if (!formData.address.trim()) {
            toast.error('Please enter an address first');
            return;
        }

        setLocationLoading(true);
        try {
            // Use geocoding to verify and standardize the address
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formData.address)}`
            );
            const data = await response.json();

            if (data && data[0]) {
                setFormData({
                    ...formData,
                    address: data[0].display_name,
                    latitude: data[0].lat,
                    longitude: data[0].lon,
                    verified: true
                });
                toast.success('Address verified successfully');
            } else {
                toast.error('Could not verify this address. Please check and try again.');
            }
        } catch (error) {
            console.error('Error verifying address:', error);
            toast.error('Failed to verify address');
        } finally {
            setLocationLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            
            if (!token) {
                toast.error('Please login first');
                navigate('/login');
                return;
            }

            if (formData.paymentMethod === 'Online Payment') {
                const isLoaded = await loadRazorpay();
                if (!isLoaded) {
                    toast.error('Razorpay failed to load. Please try again.');
                    return;
                }

                const totalAmount = calculateTotal();
                
                // Create order on backend
                const response = await fetch('https://expressjs-zpto.onrender.com/api/create-order', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        amount: totalAmount * 100, // amount in paise
                        currency: 'INR'
                    })
                });

                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.message || 'Failed to create order');
                }

                const options = {
                    key: 'rzp_test_mTvqmsIEl3SpFj',
                    amount: data.amount,
                    currency: data.currency,
                    name: 'Ayurveda Store',
                    description: `Payment for ${checkoutItems.length} items`,
                    order_id: data.id,
                    handler: async (response) => {
                        try {
                            // Prepare items for order
                            const orderItems = checkoutItems.map(item => ({
                                product: item._id,
                                seller: item.sellerId,
                                quantity: item.quantity
                            }));

                            // Verify payment and create order
                            const verifyResponse = await fetch('https://expressjs-zpto.onrender.com/api/verify-payment', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${token}`
                                },
                                body: JSON.stringify({
                                    razorpay_order_id: response.razorpay_order_id,
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    razorpay_signature: response.razorpay_signature,
                                    orderData: {
                                        items: orderItems,
                                        address: formData.address,
                                        location: {
                                            latitude: formData.latitude,
                                            longitude: formData.longitude
                                        }
                                    }
                                })
                            });

                            const verifyData = await verifyResponse.json();

                            if (verifyResponse.ok) {
                                // Clear relevant storage based on checkout type
                                localStorage.removeItem('buyNowItem');
                                localStorage.removeItem('checkoutItems');
                                localStorage.removeItem('cartItems');
                                toast.success('Payment successful! Order placed.');
                                navigate('/orders');
                            } else {
                                throw new Error(verifyData.message);
                            }
                        } catch (error) {
                            toast.error('Payment verification failed');
                            console.error('Payment verification error:', error);
                        }
                    },
                    prefill: {
                        name: JSON.parse(localStorage.getItem('userProfile'))?.name || '',
                        email: JSON.parse(localStorage.getItem('userProfile'))?.email || '',
                    },
                    theme: {
                        color: '#059669'
                    }
                };

                const razorpay = new window.Razorpay(options);
                razorpay.open();
                setLoading(false);
                return;
            } else {
                // Prepare items for order
                const orderItems = checkoutItems.map(item => ({
                    product: item._id,
                    seller: item.sellerId,
                    quantity: item.quantity
                }));

                // Create order with Cash on Delivery
                const response = await fetch('https://expressjs-zpto.onrender.com/api/orders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        items: orderItems,
                        paymentMethod: formData.paymentMethod,
                        address: formData.address,
                        location: {
                            latitude: formData.latitude,
                            longitude: formData.longitude
                        }
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    // Clear relevant storage based on checkout type
                    localStorage.removeItem('buyNowItem');
                    localStorage.removeItem('checkoutItems');
                    localStorage.removeItem('cartItems');
                    toast.success('Order placed successfully!');
                    navigate('/orders');
                } else {
                    toast.error(data.message || 'Error placing order');
                }
            }
        } catch (error) {
            console.error('Order error:', error);
            toast.error('Error placing order');
        } finally {
            setLoading(false);
        }
    };

    if (checkoutItems.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-20 px-4">
            <div className="max-w-4xl mx-auto mt-8">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white rounded-lg shadow-lg p-6"
                >
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Checkout</h2>

                    {/* Order Summary */}
                    <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                        <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                        {checkoutItems.map((item, index) => (
                            <div key={index} className="flex items-center space-x-4 mb-4">
                                <img 
                                    src={item.imageurl} 
                                    alt={item.name} 
                                    className="w-20 h-20 object-cover rounded-lg"
                                />
                                <div className="flex-1">
                                    <h4 className="font-medium">{item.name}</h4>
                                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                                    <p className="text-emerald-600">₹{item.price * item.quantity}</p>
                                </div>
                            </div>
                        ))}
                        <div className="mt-4 pt-4 border-t">
                            <div className="flex justify-between">
                                <span className="font-medium">Total Amount:</span>
                                <span className="font-bold text-emerald-600">₹{calculateTotal()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Checkout Form */}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label className="block text-gray-700 mb-2">Delivery Address</label>
                            <div className="space-y-2">
                                <textarea
                                    required
                                    value={formData.address}
                                    onChange={(e) => setFormData({ 
                                        ...formData, 
                                        address: e.target.value,
                                        verified: false 
                                    })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    rows="3"
                                    placeholder="Enter your delivery address"
                                />
                                <div className="flex space-x-2">
                                    <button
                                        type="button"
                                        onClick={getCurrentLocation}
                                        disabled={locationLoading}
                                        className={`flex-1 py-2 px-4 rounded-lg text-white font-medium ${
                                            locationLoading 
                                                ? 'bg-gray-400 cursor-not-allowed' 
                                                : 'bg-blue-600 hover:bg-blue-700'
                                        }`}
                                    >
                                        {locationLoading ? 'Getting Location...' : 'Use My Location'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={verifyAddress}
                                        disabled={locationLoading || !formData.address.trim()}
                                        className={`flex-1 py-2 px-4 rounded-lg text-white font-medium ${
                                            locationLoading || !formData.address.trim()
                                                ? 'bg-gray-400 cursor-not-allowed' 
                                                : 'bg-yellow-600 hover:bg-yellow-700'
                                        }`}
                                    >
                                        {locationLoading ? 'Verifying...' : 'Verify Location'}
                                    </button>
                                </div>
                                {formData.verified && (
                                    <div className="flex items-center text-green-600">
                                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Location Verified</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 mb-2">Payment Method</label>
                            <select
                                value={formData.paymentMethod}
                                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            >
                                <option value="Cash On Delivery">Cash On Delivery</option>
                                <option value="Online Payment">Online Payment</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 rounded-lg text-white font-medium ${
                                loading 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-emerald-600 hover:bg-emerald-700'
                            }`}
                        >
                            {loading ? 'Processing...' : 'Place Order'}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default Checkout;