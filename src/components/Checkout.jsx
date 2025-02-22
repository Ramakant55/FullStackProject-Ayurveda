import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

const Checkout = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        address: '',
        paymentMethod: 'Cash On Delivery',
        quantity: '1'  // Added quantity field
    });

    // For testing, you can remove these later
    const [productId, setProductId] = useState('');
    const [sellerId, setSellerId] = useState('');

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

            // Exact same structure as Postman
            const orderData = {
                items: [{
                    product: productId,
                    seller: sellerId,
                    quantity: formData.quantity
                }],
                paymentMethod: formData.paymentMethod,
                address: formData.address
            };

            console.log('Sending order data:', orderData);

            const response = await fetch('https://expressjs-zpto.onrender.com/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(orderData)
            });

            const data = await response.json();
            console.log('Response:', data);

            if (response.ok) {
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

    return (
        <div className="min-h-screen pt-20 px-4">
            <div className="max-w-4xl mx-auto mt-8">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white rounded-lg shadow-lg p-6"
                >
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Checkout</h2>

                    {/* Checkout Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* For testing - you can remove these later */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Product ID *
                            </label>
                            <input
                                type="text"
                                value={productId}
                                onChange={(e) => setProductId(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg"
                                placeholder="Enter product ID"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Seller ID *
                            </label>
                            <input
                                type="text"
                                value={sellerId}
                                onChange={(e) => setSellerId(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg"
                                placeholder="Enter seller ID"
                                required
                            />
                        </div>

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