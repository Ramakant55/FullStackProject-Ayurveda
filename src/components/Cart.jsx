import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { TrashIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const Cart = () => {
    const { cartItems, updateQuantity, removeItem, loading } = useContext(CartContext);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        calculateTotal(cartItems);
    }, [cartItems]);

    const calculateTotal = (items) => {
        const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        setTotal(total);
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-20 px-4 flex items-center justify-center">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen pt-20 px-4">
                <div className="max-w-4xl mx-auto mt-8 text-center">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Cart is Empty</h2>
                    <Link 
                        to="/products" 
                        className="inline-block bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-20 px-4">
            <div className="max-w-4xl mx-auto mt-8">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold text-gray-800">Shopping Cart</h2>
                    </div>

                    <div className="space-y-4">
                        {cartItems.map((item) => (
                            <motion.div 
                                key={item.productId}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col md:flex-row items-center p-4 border rounded-lg gap-4"
                            >
                                <div className="w-32 h-32 md:w-24 md:h-24 rounded-md overflow-hidden">
                                    {item.imageurl ? (
                                        <img 
                                            src={item.imageurl}
                                            alt={item.name} 
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = '/placeholder-image.png';
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                            <span className="text-gray-400">No image</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 text-center md:text-left">
                                    <h3 className="text-lg font-semibold">{item.name}</h3>
                                    <p className="text-gray-600">₹{item.price}</p>
                                </div>
                                <div className="flex items-center space-x-4 md:space-x-2">
                                    <button 
                                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                        className="p-2 md:p-1 rounded-full hover:bg-gray-100"
                                    >
                                        <MinusIcon className="h-6 w-6 md:h-5 md:w-5" />
                                    </button>
                                    <span className="w-8 text-center text-lg md:text-base">{item.quantity}</span>
                                    <button 
                                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                        className="p-2 md:p-1 rounded-full hover:bg-gray-100"
                                    >
                                        <PlusIcon className="h-6 w-6 md:h-5 md:w-5" />
                                    </button>
                                    <button 
                                        onClick={() => removeItem(item.productId)}
                                        className="p-2 md:p-1 text-red-600 hover:text-red-800"
                                    >
                                        <TrashIcon className="h-6 w-6 md:h-5 md:w-5" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-6 border-t pt-4">
                        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                            <span className="text-lg font-semibold mb-2 md:mb-0">Total:</span>
                            <span className="text-2xl font-bold text-emerald-600">₹{total}</span>
                        </div>
                        <div className="flex flex-col md:flex-row justify-center md:justify-end space-y-3 md:space-y-0 md:space-x-4">
                            <Link 
                                to="/products" 
                                className="w-full md:w-auto px-6 py-3 md:py-2 border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 text-center"
                            >
                                Continue Shopping
                            </Link>
                            <button 
                                className="w-full md:w-auto px-6 py-3 md:py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                                onClick={() => {
                                    // Add checkout logic here
                                    alert('Proceeding to checkout...');
                                }}
                            >
                                Checkout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;