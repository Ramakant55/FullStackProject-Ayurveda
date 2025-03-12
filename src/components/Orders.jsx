import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await fetch('https://expressjs-zpto.onrender.com/api/my-orders', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();
            if (data.success) {
                setOrders(data.orders);
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered':
                return 'text-green-600 bg-green-100';
            case 'Shipped':
                return 'text-blue-600 bg-blue-100';
            case 'Processing':
                return 'text-yellow-600 bg-yellow-100';
            case 'Cancelled':
                return 'text-red-600 bg-red-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-20 px-4 bg-gray-50">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-emerald-600 mb-8">My Orders</h1>

                {orders.length === 0 ? (
                    <div className="text-center py-8">
                        <h2 className="text-xl text-gray-600">No orders found</h2>
                        <button
                            onClick={() => navigate('/products')}
                            className="mt-4 bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700"
                        >
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <motion.div
                                key={order._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-lg shadow-md overflow-hidden"
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Order ID: {order._id}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Placed on: {new Date(order.orderAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </div>

                                    <div className="space-y-4">
                                        {order.items.map((item, index) => (
                                            <div key={index} className="flex items-center space-x-4 border-b pb-4">
                                                <div className="w-20 h-20">
                                                    {item.product && (
                                                        <img 
                                                            src={item.product.imageurl || item.imageurl} 
                                                            alt="Product" 
                                                            className="w-full h-full object-cover rounded"
                                                        />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-medium">
                                                        {item.product ? item.product.name : 'Product'}
                                                    </h3>
                                                    <p className="text-gray-500">
                                                        Quantity: {item.quantity}
                                                    </p>
                                                    <p className="text-emerald-600 font-medium">
                                                        ₹{item.product ? item.product.price : 0} x {item.quantity}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-6 pt-6 border-t">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-gray-600">Delivery Address:</p>
                                                <p className="text-sm text-gray-500">
                                                    {order.address}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-gray-600">Total Amount:</p>
                                                <p className="text-xl font-bold text-emerald-600">
                                                    ₹{order.totalAmount}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <p className="text-gray-600">Payment Method:</p>
                                            <p className="text-sm text-gray-500">{order.paymentMethod}</p>
                                            <p className="text-sm text-gray-500">Status: {order.paymentStatus}</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders; 