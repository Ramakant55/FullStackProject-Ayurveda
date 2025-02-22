import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrashIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        loadCartItems();
    }, []);

    const loadCartItems = () => {
        const items = JSON.parse(localStorage.getItem('cartItems')) || [];
        console.log('Cart Items:', items);
        setCartItems(items);
        calculateTotal(items);
    };

    const calculateTotal = (items) => {
        const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        setTotal(total);
    };

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) return;

        const updatedItems = cartItems.map(item => 
            item._id === productId ? { ...item, quantity: newQuantity } : item
        );

        setCartItems(updatedItems);
        localStorage.setItem('cartItems', JSON.stringify(updatedItems));
        calculateTotal(updatedItems);
        window.dispatchEvent(new Event('storage'));
    };

    const removeItem = (productId) => {
        const updatedItems = cartItems.filter(item => item._id !== productId);
        setCartItems(updatedItems);
        localStorage.setItem('cartItems', JSON.stringify(updatedItems));
        calculateTotal(updatedItems);
        window.dispatchEvent(new Event('storage'));
    };

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem('cartItems');
        calculateTotal([]);
        window.dispatchEvent(new Event('storage'));
    };

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
                        <button 
                            onClick={clearCart}
                            className="text-red-600 hover:text-red-800"
                        >
                            Clear Cart
                        </button>
                    </div>

                    <div className="space-y-4">
                        {cartItems.map((item) => {
                            console.log('Item image:', item.image);
                            return (
                                <motion.div 
                                    key={item._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex flex-col sm:flex-row items-center p-4 border rounded-lg hover:shadow-md transition-shadow"
                                >
                                    <div className="w-full sm:w-20 h-40 sm:h-20 rounded-md overflow-hidden mb-4 sm:mb-0">
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
                                    <div className="flex-1 ml-4">
                                        <h3 className="text-lg font-semibold">{item.name}</h3>
                                        <p className="text-gray-600">₹{item.price}</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button 
                                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                            className="p-1 rounded-full hover:bg-gray-100"
                                        >
                                            <MinusIcon className="h-5 w-5" />
                                        </button>
                                        <span className="w-8 text-center">{item.quantity}</span>
                                        <button 
                                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                            className="p-1 rounded-full hover:bg-gray-100"
                                        >
                                            <PlusIcon className="h-5 w-5" />
                                        </button>
                                        <button 
                                            onClick={() => removeItem(item._id)}
                                            className="p-1 text-red-600 hover:text-red-800"
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    <div className="mt-6 border-t pt-4">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-lg font-semibold">Total:</span>
                            <span className="text-2xl font-bold text-emerald-600">₹{total}</span>
                        </div>
                        <div className="flex justify-end space-x-4">
                            <Link 
                                to="/products" 
                                className="px-6 py-2 border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50"
                            >
                                Continue Shopping
                            </Link>
                            <button 
                                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                                onClick={() => {
                                    const token = localStorage.getItem('token');
                                    const user = JSON.parse(localStorage.getItem('userProfile'));
                                    
                                    console.log('Debug - Cart Token:', token);
                                    console.log('Debug - Cart User:', user);
                                    
                                    if (!token || !user) {
                                        toast.error('Please login first');
                                        navigate('/login');
                                        return;
                                    }
                                    
                                    navigate('/checkout');
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