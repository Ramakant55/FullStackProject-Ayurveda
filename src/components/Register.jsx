import { React, useState } from "react";
import { motion } from "framer-motion";
import { UserIcon, EnvelopeIcon, LockClosedIcon, PhoneIcon, CalendarIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
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
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    // Validation functions for each field
    const validateName = (name) => {
        if (!name) return "Name is required";
        if (!/^[A-Za-z\s]{3,30}$/.test(name)) {
            return "Name should only contain letters and be 3-30 characters long";
        }
        return "";
    };

    const validateEmail = (email) => {
        if (!email) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return "Please enter a valid email address";
        }
        return "";
    };

    const validatePassword = (password) => {
        if (!password) return "Password is required";
        if (password.length < 8) return "Password must be at least 8 characters long";
        if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter";
        if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter";
        if (!/[0-9]/.test(password)) return "Password must contain at least one number";
        if (!/[!@#$%^&*]/.test(password)) return "Password must contain at least one special character (!@#$%^&*)";
        return "";
    };

    const validatePhone = (phone) => {
        if (!phone) return "Phone number is required";
        if (!/^[6-9]\d{9}$/.test(phone)) {
            return "Please enter a valid 10-digit Indian phone number";
        }
        return "";
    };

    const validateDob = (dob) => {
        if (!dob) return "Date of birth is required";
        const birthDate = new Date(dob);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        if (age < 10) return "You must be at least 10 years old";
        if (age > 100) return "Please enter a valid date of birth";
        return "";
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Real-time validation based on field type
        let error = "";
        switch (name) {
            case "name":
                if (!/^[A-Za-z\s]*$/.test(value)) return; // Only allow letters and spaces
                error = validateName(value);
                break;
            case "email":
                // Only show email error when user stops typing
                if (value.includes('@')) {
                    error = validateEmail(value);
                }
                break;
            case "password":
                error = validatePassword(value);
                break;
            case "phone":
                if (!/^\d*$/.test(value)) return; // Only allow numbers
                error = validatePhone(value);
                break;
            case "dob":
                error = validateDob(value);
                break;
            default:
                break;
        }

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Update errors state
        setErrors(prev => ({
            ...prev,
            [name]: error
        }));

        // Show toast only if there's a new error and it's different from the previous one
        if (error && error !== errors[name]) {
            toast.error(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate all fields before submission
        const nameError = validateName(formData.name);
        const emailError = validateEmail(formData.email);
        const passwordError = validatePassword(formData.password);
        const phoneError = validatePhone(formData.phone);
        const dobError = validateDob(formData.dob);

        if (nameError || emailError || passwordError || phoneError || dobError) {
            toast.error(nameError || emailError || passwordError || phoneError || dobError);
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
                toast.success("Registration successful!");
                setTimeout(() => {
                    navigate('/verify-otp');
                }, 1500);
            } else {
                throw new Error(data.message || "Registration failed");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error(error.message || "Registration failed");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Add this style tag to hide default password toggle */}
            <style>
                {`
                    input[type="password"]::-ms-reveal,
                    input[type="password"]::-ms-clear {
                        display: none;
                    }
                    input[type="password"]::-webkit-contacts-auto-fill-button,
                    input[type="password"]::-webkit-credentials-auto-fill-button {
                        visibility: hidden;
                        display: none !important;
                        pointer-events: none;
                        height: 0;
                        width: 0;
                        margin: 0;
                    }
                `}
            </style>

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
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter Your Password"
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-10 py-3 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                            autoComplete="off"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors"
                        >
                            {showPassword ? (
                                <EyeSlashIcon className="w-5 h-5" />
                            ) : (
                                <EyeIcon className="w-5 h-5" />
                            )}
                        </button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="relative"
                    >
                        <style>
                            {`
                                input[type="date"]::-webkit-calendar-picker-indicator {
                                    opacity: 0;
                                    position: absolute;
                                    right: 0;
                                    top: 0;
                                    width: 100%;
                                    height: 100%;
                                    cursor: pointer;
                                }
                            `}
                        </style>
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