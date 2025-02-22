import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { BuildingStorefrontIcon, UserPlusIcon } from '@heroicons/react/24/outline';

const SellerRegister = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        storename: '',
        contact: '',
        address: ''
    });

    const validateForm = () => {
        if (!formData.email.includes('@')) {
            toast.error('Please enter a valid email');
            return false;
        }
        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return false;
        }
        if (!formData.contact || formData.contact.length < 10) {
            toast.error('Please enter a valid contact number');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setIsLoading(true);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

        try {
            const response = await fetch('https://expressjs-zpto.onrender.com/api/seller', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Registration failed');
            }

            const data = await response.json();
            console.log('Registration response:', data);

            if (!data.token && !data.otpToken) {
                throw new Error('Registration successful but verification data missing');
            }

            const token = data.token || data.otpToken;
            const otp = data.otp;

            // Store registration data
            localStorage.setItem('tempSellerEmail', formData.email);
            localStorage.setItem('tempSellerPassword', formData.password);
            localStorage.setItem('tempSellerOTPToken', token);
            localStorage.setItem('tempSellerOTP', otp);

            toast.success('Registration successful! Proceeding to verification...');
            navigate('/seller/verify-otp');

        } catch (error) {
            if (error.name === 'AbortError') {
                toast.error('Registration request timed out. Please try again.');
            } else {
                console.error('Registration error:', error);
                toast.error(error.message || 'Registration failed. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value.trim()
        }));
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 py-12 px-4 sm:px-6 lg:px-8"
        >
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
                <motion.div
                    initial={{ y: -20 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex justify-center">
                        <BuildingStorefrontIcon className="h-12 w-12 text-emerald-600" />
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Register as a Seller
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Already registered?{' '}
                        <Link to="/seller/login" className="font-medium text-emerald-600 hover:text-emerald-500">
                            Sign in
                        </Link>
                    </p>
                </motion.div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm space-y-4">
                        {[
                            { name: 'name', type: 'text', placeholder: 'Full Name', required: true },
                            { name: 'storename', type: 'text', placeholder: 'Shop Name', required: true },
                            { name: 'email', type: 'email', placeholder: 'Email address', required: true },
                            { name: 'contact', type: 'tel', placeholder: 'Phone Number', required: true },
                            { name: 'address', type: 'text', placeholder: 'Shop Address', required: true },
                            { name: 'password', type: 'password', placeholder: 'Password', required: true }
                        ].map((field) => (
                            <motion.div
                                key={field.name}
                                whileHover={{ scale: 1.01 }}
                                className="relative"
                            >
                                <input
                                    name={field.name}
                                    type={field.type}
                                    required={field.required}
                                    className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    placeholder={field.placeholder}
                                    onChange={handleInputChange}
                                    disabled={isLoading}
                                />
                            </motion.div>
                        ))}
                    </div>

                    <motion.button
                        whileHover={{ scale: isLoading ? 1 : 1.02 }}
                        whileTap={{ scale: isLoading ? 1 : 0.98 }}
                        type="submit"
                        disabled={isLoading}
                        className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white ${
                            isLoading ? 'bg-emerald-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'
                        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500`}
                    >
                        <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                            {isLoading ? (
                                <svg className="animate-spin h-5 w-5 text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <UserPlusIcon className="h-5 w-5 text-emerald-500 group-hover:text-emerald-400" />
                            )}
                        </span>
                        {isLoading ? 'Registering...' : 'Register'}
                    </motion.button>
                </form>
            </div>
        </motion.div>
    );
};

export default SellerRegister;