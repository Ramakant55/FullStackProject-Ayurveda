import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrashIcon, MinusIcon, PlusIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);
    const navigate = useNavigate();

    // Load cart items from localStorage
    const loadCartItems = () => {
        try {
            const items = JSON.parse(localStorage.getItem('cartItems') || '[]');
            setCartItems(items);
            calculateTotal(items);
        } catch (error) {
            console.error('Error loading cart:', error);
            setCartItems([]);
            setTotal(0);
        }
    };

    // Calculate total price
    const calculateTotal = (items) => {
        const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        setTotal(total);
    };

    // Update quantity
    const updateQuantity = (productId, newQuantity) => {
        try {
            if (newQuantity < 1) {
                toast.error('Quantity cannot be less than 1');
                return;
            }

            const updatedItems = cartItems.map(item =>
                item._id === productId ? { ...item, quantity: newQuantity } : item
            );

            setCartItems(updatedItems);
            localStorage.setItem('cartItems', JSON.stringify(updatedItems));
            calculateTotal(updatedItems);
            toast.success('Cart updated');
        } catch (error) {
            console.error('Error updating quantity:', error);
            toast.error('Failed to update quantity');
        }
    };

    // Remove item from cart
    const removeItem = (productId) => {
        try {
            const updatedItems = cartItems.filter(item => item._id !== productId);
            setCartItems(updatedItems);
            localStorage.setItem('cartItems', JSON.stringify(updatedItems));
            calculateTotal(updatedItems);
            toast.success('Item removed from cart');
        } catch (error) {
            console.error('Error removing item:', error);
            toast.error('Failed to remove item');
        }
    };

    // Clear entire cart
    const clearCart = () => {
        try {
            setCartItems([]);
            localStorage.setItem('cartItems', '[]');
            setTotal(0);
            toast.success('Cart cleared');
        } catch (error) {
            console.error('Error clearing cart:', error);
            toast.error('Failed to clear cart');
        }
    };

    // Handle checkout
    const handleCheckout = () => {
        if (cartItems.length === 0) {
            toast.error('Your cart is empty');
            return;
        }
        navigate('/checkout');
    };

    // Load cart items on component mount and when storage changes
    useEffect(() => {
        loadCartItems();

        // Listen for storage events (when cart is updated from other components)
        const handleStorageChange = () => {
            loadCartItems();
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    // Empty cart view
    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen pt-20 px-4">
                <div className="max-w-4xl mx-auto mt-8 text-center">
                    <ShoppingBagIcon className="h-24 w-24 mx-auto text-gray-400 mb-4" />
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Cart is Empty</h2>
                    <p className="text-gray-600 mb-4">Add some products to your cart and start shopping!</p>
                    <Link 
                        to="/products" 
                        className="inline-block bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-20 px-4 bg-gray-50">
            <div className="max-w-4xl mx-auto mt-8">
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold text-gray-800">
                            Shopping Cart ({cartItems.length} items)
                        </h2>
                        <button 
                            onClick={clearCart}
                            className="text-red-600 hover:text-red-800 transition-colors flex items-center"
                        >
                            <TrashIcon className="h-5 w-5 mr-1" />
                            Clear Cart
                        </button>
                    </div>

                    <div className="space-y-4">
                        {cartItems.map((item) => (
                            <motion.div 
                                key={item._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col sm:flex-row items-center p-4 border rounded-xl hover:shadow-md transition-all bg-white"
                            >
                                <div className="w-full sm:w-24 h-24 rounded-lg overflow-hidden mb-4 sm:mb-0">
                                    <img 
                                        src={item.imageurl}
                                        alt={item.name} 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 ml-4">
                                    <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                                    <p className="text-emerald-600 font-medium">₹{item.price}</p>
                                    <p className="text-gray-500 text-sm">
                                        Total: ₹{(item.price * item.quantity).toFixed(2)}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button 
                                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                                    >
                                        <MinusIcon className="h-5 w-5" />
                                    </button>
                                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                                    <button 
                                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                                    >
                                        <PlusIcon className="h-5 w-5" />
                                    </button>
                                    <button 
                                        onClick={() => removeItem(item._id)}
                                        className="p-1 text-red-600 hover:text-red-800 transition-colors"
                                    >
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-6 border-t pt-4">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <p className="text-gray-600">Subtotal: ₹{total.toFixed(2)}</p>
                                <p className="text-gray-600">Delivery: FREE</p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-emerald-600">₹{total.toFixed(2)}</p>
                            </div>
                        </div>
                        <div className="flex justify-end space-x-4">
                            <Link 
                                to="/products" 
                                className="px-6 py-2 border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors"
                            >
                                Continue Shopping
                            </Link>
                            <button 
                                onClick={handleCheckout}
                                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;