import React, { useState } from 'react';
import { motion } from "framer-motion";
import { 
    EnvelopeIcon, 
    LockClosedIcon, 
    EyeIcon, 
    EyeSlashIcon 
} from "@heroicons/react/24/outline";
import { FaGoogle, FaFacebook, FaGithub } from 'react-icons/fa';
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
        const response = await fetch("https://expressjs-zpto.onrender.com/api/user/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        // First check if user exists
        if (data.message === "User not found" || data.message === "User does not exist") {
            toast.error("User not registered! Please sign up first");
            setTimeout(() => {
                navigate('/register');
            }, 1500);
            return;
        }

        // Then check for other errors
        if (!response.ok) {
            if (data.message === "Invalid password") {
                toast.error("Invalid password");
            } else {
                toast.error(data.message || "Login failed");
            }
            return;
        }

        // If everything is ok, proceed with login
        localStorage.setItem('token', data.token);
        localStorage.setItem('userProfile', JSON.stringify(data.user));
        window.dispatchEvent(new Event('storage'));

        toast.success("Login successful!");
        setTimeout(() => {
            navigate('/');
        }, 1000);

    } catch (error) {
        console.error("Login error:", error);
        toast.error("Something went wrong. Please try again.");
    } finally {
        setIsLoading(false);
    }
};


  const handleSocialLogin = (platform) => {
    toast.success(`${platform} login coming soon!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 flex items-center justify-center p-4 relative overflow-hidden">
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
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
          <p className="text-white/80 mt-2">Login to access Ayurvedic products</p>
        </motion.div>

        {/* Social Login Buttons */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSocialLogin('Google')}
            className="flex items-center justify-center p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
          >
            <FaGoogle className="text-white text-xl" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSocialLogin('Facebook')}
            className="flex items-center justify-center p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
          >
            <FaFacebook className="text-white text-xl" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSocialLogin('GitHub')}
            className="flex items-center justify-center p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
          >
            <FaGithub className="text-white text-xl" />
          </motion.button>
        </div>

        <div className="relative flex items-center justify-center mb-6">
          <div className="border-t border-white/20 w-full"></div>
          <span className="bg-transparent px-4 text-white/60 text-sm">Or continue with</span>
          <div className="border-t border-white/20 w-full"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/70" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter Your Email"
              className={`w-full bg-white/10 border ${errors.email ? 'border-red-400' : 'border-white/20'} rounded-lg px-10 py-3 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all`}
              required
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email}</p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="relative"
          >
            <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/70" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter Your Password"
              className={`w-full bg-white/10 border ${errors.password ? 'border-red-400' : 'border-white/20'} rounded-lg px-10 py-3 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all`}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white"
            >
              {showPassword ? (
                <EyeSlashIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </button>
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">{errors.password}</p>
            )}
          </motion.div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center text-white/80">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="mr-2 rounded"
              />
              Remember me
            </label>
            <motion.a
              whileHover={{ scale: 1.05 }}
              href="/forgot-password"
              className="text-white/80 hover:text-white"
            >
              Forgot Password?
            </motion.a>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-white text-emerald-600 py-3 rounded-lg font-semibold hover:bg-white/90 transition-colors relative"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-600"></div>
                <span className="ml-2">Logging in...</span>
              </div>
            ) : (
              "Login"
            )}
          </motion.button>
        </form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-6"
        >
          <p className="text-white/80">
            Don't have an account?{" "}
            <motion.a
              whileHover={{ scale: 1.05 }}
              href="/register"
              className="text-white font-semibold hover:text-white/80"
            >
              Sign Up
            </motion.a>
          </p>
        </motion.div>
      </motion.div>
      <Toaster position="top-right" />
    </div>
  );
};

export default Login;