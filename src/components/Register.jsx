import { React, useState } from "react";
import { motion } from "framer-motion";
import { UserIcon, EnvelopeIcon, LockClosedIcon, PhoneIcon, CalendarIcon } from "@heroicons/react/24/outline";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        dob: "",
        phone: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Add password validation
    const validatePassword = (password) => {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (password.length < minLength) {
            return "Password must be at least 8 characters long";
        }
        if (!hasUpperCase) {
            return "Password must contain at least one uppercase letter";
        }
        if (!hasLowerCase) {
            return "Password must contain at least one lowercase letter";
        }
        if (!hasNumber) {
            return "Password must contain at least one number";
        }
        if (!hasSpecialChar) {
            return "Password must contain at least one special character";
        }
        return "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate password before submission
        const passwordError = validatePassword(formData.password);
        if (passwordError) {
            toast.error(passwordError);
            return;
        }

        try {
            const response = await fetch("https://expressjs-zpto.onrender.com/api/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            
            if (response.ok) {
                localStorage.setItem('token', data.token);
                console.log("Registration successful, Token stored:", data.token);
                toast.success("Registration successful!");
                // Automatically navigate to verify-otp page after successful registration
                setTimeout(() => {
                    navigate('/verify-otp');
                }, 1500);
            } else {
                throw new Error(data.message || "Registration failed");
            }
        } catch (error) {
            console.error("Error:", error.toString());
            toast.error("Registration failed: " + error.message);
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
                    Register
                </motion.h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="relative"
                    >
                        <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/70" />
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter Your Name"
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-10 py-3 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="relative"
                    >
                        <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/70" />
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter Your Email"
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-10 py-3 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="relative"
                    >
                        <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/70" />
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter Your Password"
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-10 py-3 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="relative"
                    >
                        <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/70" />
                        <input
                            type="date"
                            name="dob"
                            value={formData.dob}
                            onChange={handleChange}
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-10 py-3 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="relative"
                    >
                        <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/70" />
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Enter Your Phone"
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-10 py-3 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                        />
                    </motion.div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full bg-white text-purple-600 py-3 rounded-lg font-semibold hover:bg-white/90 transition-colors"
                    >
                        Register
                    </motion.button>
                </form>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-white/80 text-center mt-6"
                >
                    Already have an account?{" "}
                    <a href="/login" className="text-white font-semibold hover:text-white/80">
                        Login
                    </a>
                </motion.p>
            </motion.div>
            <Toaster position="top-right" />
        </div>
    );
};

export default Register;