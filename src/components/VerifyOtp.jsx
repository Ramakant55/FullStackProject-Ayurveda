import React, { useState } from 'react';
import { motion } from "framer-motion";
import { KeyIcon } from "@heroicons/react/24/outline";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from 'react-router-dom';

const VerifyOtp = () => {
    const navigate = useNavigate();
    const [otp, setOtp] = useState("");
    const [token, setToken] = useState(localStorage.getItem('token') || "");

    const handleOtpChange = (e) => {
        setOtp(e.target.value);
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://expressjs-zpto.onrender.com/api/users/verify-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userOtp: otp, token: token }),
            });
            const data = await response.json();
            
            if (response.ok) {
                toast.success("OTP verified successfully");
                // Add a small delay before navigation for better UX
                setTimeout(() => {
                    navigate('/login');
                }, 1500);
            } else {
                throw new Error(data.message || "OTP verification failed");
            }
        } catch (error) {
            toast.error("OTP verification failed");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated background circles */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full bg-white/10 backdrop-blur-sm"
                        style={{
                            width: Math.random() * 200 + 50,
                            height: Math.random() * 200 + 50,
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            x: [0, Math.random() * 100 - 50],
                            y: [0, Math.random() * 100 - 50],
                            scale: [1, 1.2, 1],
                        }}
                        transition={{
                            duration: Math.random() * 10 + 5,
                            repeat: Infinity,
                            repeatType: "reverse",
                        }}
                    />
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full bg-white/20 backdrop-blur-md p-8 rounded-2xl shadow-2xl relative z-10"
            >
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-bold text-white text-center mb-8"
                >
                    Verify OTP
                </motion.h2>

                <form onSubmit={handleVerifyOTP} className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="relative"
                    >
                        <KeyIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/70" />
                        <input
                            type="text"
                            value={otp}
                            onChange={handleOtpChange}
                            placeholder="Enter your OTP"
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-10 py-3 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all text-center text-2xl tracking-wider"
                            maxLength="6"
                        />
                    </motion.div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full bg-white text-purple-600 py-3 rounded-lg font-semibold hover:bg-white/90 transition-colors"
                    >
                        Verify OTP
                    </motion.button>
                </form>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center mt-6 space-y-2"
                >
                    <p className="text-white/80">
                        Didn't receive OTP?{" "}
                        <button 
                            onClick={() => toast.success("New OTP sent!")}
                            className="text-white font-semibold hover:text-white/80 underline"
                        >
                            Resend
                        </button>
                    </p>
                    <p className="text-white/80">
                        Back to{" "}
                        <motion.a
                            whileHover={{ scale: 1.05 }}
                            href="/login"
                            className="text-white font-semibold hover:text-white/80"
                        >
                            Login
                        </motion.a>
                    </p>
                </motion.div>
            </motion.div>
            <Toaster position="top-right" />
        </div>
    );
};

export default VerifyOtp;