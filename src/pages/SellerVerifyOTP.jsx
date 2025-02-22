import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { BuildingStorefrontIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const SellerVerifyOTP = () => {
    const navigate = useNavigate();
    const [otp, setOtp] = useState('');
    const [email, setEmail] = useState('');
    const [timer, setTimer] = useState(30);
    const [otpToken, setOtpToken] = useState('');

    useEffect(() => {
        const tempEmail = localStorage.getItem('tempSellerEmail');
        if (!tempEmail) {
            toast.error('Please register first');
            navigate('/seller');
            return;
        }
        setEmail(tempEmail);
    }, [navigate]);

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        try {
            // Get the otpToken that was stored during registration
            const otpToken = localStorage.getItem('tempSellerOTPToken');
            
            const response = await fetch('https://expressjs-zpto.onrender.com/api/seller/verify-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    otpToken,
                    otp: otp.toString()
                })
            });

            const data = await response.json();
            console.log('Verification response:', data); // Debug log

            if (response.ok) {
                localStorage.removeItem('tempSellerEmail');
                localStorage.removeItem('tempSellerOTPToken');
                toast.success('Email verified successfully');
                navigate('/seller/login');
            } else {
                toast.error(data.message || 'Invalid OTP');
            }
        } catch (error) {
            console.error('OTP verification error:', error);
            toast.error('Server Error');
        }
    };

    const handleResendOTP = async () => {
        if (timer > 0) return;
        
        try {
            const response = await fetch('https://expressjs-zpto.onrender.com/api/seller/resend-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('OTP resent successfully');
                setTimer(30);
            } else {
                toast.error(data.message || 'Failed to resend OTP');
            }
        } catch (error) {
            toast.error('Server Error');
        }
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
                        <ShieldCheckIcon className="h-12 w-12 text-emerald-600" />
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Verify OTP
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Please enter the OTP sent to your email
                    </p>
                </motion.div>

                <form className="mt-8 space-y-6" onSubmit={handleVerifyOTP}>
                    <div className="rounded-md shadow-sm space-y-4">
                        <div>
                            <label className="sr-only">OTP</label>
                            <input
                                type="text"
                                required
                                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                                placeholder="Enter OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                maxLength={6}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                        >
                            Verify OTP
                        </button>
                    </div>

                    <div className="text-center">
                        <button
                            type="button"
                            onClick={handleResendOTP}
                            className={`text-sm font-medium ${
                                timer > 0 
                                    ? 'text-gray-400 cursor-not-allowed' 
                                    : 'text-emerald-600 hover:text-emerald-500'
                            }`}
                            disabled={timer > 0}
                        >
                            {timer > 0 
                                ? `Resend OTP in ${timer}s` 
                                : 'Resend OTP'}
                        </button>
                    </div>
                </form>
            </div>
        </motion.div>
    );
};

export default SellerVerifyOTP; 