import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

const Checkout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [orderDetails, setOrderDetails] = useState(null);
    const [formData, setFormData] = useState({
        address: '',
        paymentMethod: 'Cash On Delivery',
        quantity: '1'
    });

    useEffect(() => {
        // Get order details from location state or localStorage
        const details = location.state?.orderDetails || JSON.parse(localStorage.getItem('orderDetails'));
        if (!details) {
            toast.error('No order details found');
            navigate('/');
            return;
        }
        setOrderDetails(details);
    }, []);

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

            // Use the order details we received
            const orderData = {
                items: [{
                    product: orderDetails.productId,
                    seller: orderDetails.sellerId,
                    quantity: parseInt(formData.quantity)
                }],
                paymentMethod: formData.paymentMethod,
                address: formData.address
            };

            const response = await fetch('https://expressjs-zpto.onrender.com/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(orderData)
            });

            const data = await response.json();

            if (response.ok) {
                // Clear the stored order details
                localStorage.removeItem('orderDetails');
                toast.success('Order placed successfully!');
                navigate('/orders');
            } else {
                toast.error(data.message || 'Error placing order');
            }
        } catch (error) {
            console.error('Order error:', error);
            toast.error('Error placing order');
        } finally {
            setLoading(false);
        }
    };

    if (!orderDetails) {
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
                        <div className="flex items-center space-x-4">
                            <img 
                                src={orderDetails.imageurl} 
                                alt={orderDetails.name} 
                                className="w-20 h-20 object-cover rounded-lg"
                            />
                            <div>
                                <h4 className="font-semibold">{orderDetails.name}</h4>
                                <p className="text-emerald-600 font-semibold">₹{orderDetails.price}</p>
                            </div>
                        </div>
                    </div>

                    {/* Checkout Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Quantity *
                            </label>
                            <input
                                type="number"
                                value={formData.quantity}
                                onChange={(e) => setFormData({...formData, quantity: e.target.value.toString()})}
                                className="w-full px-3 py-2 border rounded-lg"
                                placeholder="Enter quantity"
                                required
                                min="1"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Delivery Address *
                            </label>
                            <textarea
                                required
                                value={formData.address}
                                onChange={(e) => setFormData({...formData, address: e.target.value})}
                                className="w-full px-3 py-2 border rounded-lg"
                                rows="4"
                                placeholder="Enter your full delivery address"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Payment Method *
                            </label>
                            <select
                                required
                                value={formData.paymentMethod}
                                onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                                className="w-full px-3 py-2 border rounded-lg"
                            >
                                <option value="Cash On Delivery">Cash On Delivery</option>
                                <option value="Online Payment">Online Payment</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 px-4 text-white rounded-lg ${
                                loading 
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-emerald-600 hover:bg-emerald-700'
                            }`}
                        >
                            {loading ? 'Placing Order...' : 'Place Order'}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default Checkout;