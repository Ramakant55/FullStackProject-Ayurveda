import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    HomeIcon, 
    ShoppingBagIcon, 
    UserIcon, 
    PhoneIcon, 
    Bars3Icon, 
    XMarkIcon,
    ShoppingCartIcon,
    ChevronDownIcon,
    CogIcon,
    ArrowRightStartOnRectangleIcon as ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        checkAuthStatus();
        updateCartCount();

        const handleCartUpdate = () => {
            const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
            const totalCount = cartItems.reduce((sum, item) => {
                return sum + (item?.quantity || 0);
            }, 0);
            setCartCount(totalCount);
            // Refresh the page
            window.location.reload();
        };

        window.addEventListener('cartUpdated', handleCartUpdate);
        window.addEventListener('cartItemRemoved', handleCartUpdate);
        window.addEventListener('userLogin', checkAuthStatus);
        window.addEventListener('userLogout', handleLogout);
        
        return () => {
            window.removeEventListener('cartUpdated', handleCartUpdate);
            window.removeEventListener('cartItemRemoved', handleCartUpdate);
            window.removeEventListener('userLogin', checkAuthStatus);
            window.removeEventListener('userLogout', handleLogout);
        };
    }, []);

    const updateCartCount = () => {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const totalCount = cartItems.reduce((sum, item) => {
            return sum + (item?.quantity || 0);
        }, 0);
        setCartCount(totalCount);
    };

    const checkAuthStatus = () => {
        const token = localStorage.getItem('token');
        const savedProfile = localStorage.getItem('userProfile');
        
        if (token && savedProfile) {
            setIsAuthenticated(true);
            setUserProfile(JSON.parse(savedProfile));
            updateCartCount();
        } else {
            setIsAuthenticated(false);
            setUserProfile(null);
            setCartCount(0);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userProfile');
        localStorage.removeItem('cartItems');
        setIsAuthenticated(false);
        setUserProfile(null);
        setCartCount(0);
        setShowProfileMenu(false);
        navigate('/login');
    };

    const navItems = [
        { name: 'Home', path: '/', icon: HomeIcon },
        { name: 'Products', path: '/products', icon: ShoppingBagIcon },
        { name: 'Contact', path: '/contact', icon: PhoneIcon },
    ];

    const ProfileDropdown = () => (
        <div className="relative">
            <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 text-gray-600 hover:text-emerald-600 focus:outline-none"
            >
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-500">
                    {userProfile?.avatar ? (
                        <img 
                            src={userProfile.avatar} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-emerald-200 flex items-center justify-center">
                            <UserIcon className="h-6 w-6 text-emerald-600" />
                        </div>
                    )}
                </div>
                {userProfile && (
                    <div className="hidden md:flex flex-col items-start">
                        <span className="text-sm font-semibold">{userProfile.name}</span>
                        <span className="text-xs text-gray-500">{userProfile.phone}</span>
                    </div>
                )}
                <ChevronDownIcon className="h-4 w-4" />
            </motion.button>

            <AnimatePresence>
                {showProfileMenu && userProfile && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50"
                    >
                        <div className="px-4 py-2 border-b">
                            <p className="text-sm font-semibold text-gray-900">{userProfile.name}</p>
                            <p className="text-xs text-gray-500">{userProfile.email}</p>
                            <p className="text-xs text-gray-500">{userProfile.phone}</p>
                        </div>
                        
                        <Link 
                            to="/profile"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setShowProfileMenu(false)}
                        >
                            <CogIcon className="h-4 w-4 mr-2" />
                            Profile Settings
                        </Link>
                        
                        <button
                            onClick={() => {
                                handleLogout();
                                setShowProfileMenu(false);
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
                            Logout
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );

    const removeFromCart = (productId) => {
        // Your existing remove logic
        const updatedCartItems = // ... your update logic
        
        // Update localStorage
        localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
        
        // Dispatch event WITHOUT any detail
        window.dispatchEvent(new CustomEvent('cartUpdated'));
    };

    return (
        <nav className="bg-white shadow-lg fixed w-full z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        {/* Logo */}
                        <Link to="/">
                            <motion.div 
                                whileHover={{ scale: 1.05 }}
                                className="flex items-center"
                            >
                                <img 
                                    src="/ayurveda-logo.png" 
                                    alt="Ayurveda Logo" 
                                    className="h-10 w-10 mr-2"
                                />
                                <span className="text-2xl font-bold text-emerald-600">Ayurveda</span>
                            </motion.div>
                        </Link>

                        {/* Desktop Navigation Links */}
                        <div className="hidden md:flex items-center ml-40 space-x-10">
                            {navItems.map((item) => (
                                (!item.protected || isAuthenticated) && (
                                    <motion.div
                                        key={item.name}
                                        whileHover={{ scale: 1.1 }}
                                    >
                                        <Link
                                            to={item.path}
                                            className="flex items-center text-gray-600 hover:text-emerald-600 transition-colors"
                                        >
                                            <item.icon className="h-5 w-5 mr-1" />
                                            {item.name}
                                        </Link>
                                    </motion.div>
                                )
                            ))}
                        </div>
                    </div>

                    {/* Right Side Navigation */}
                    <div className="hidden md:flex items-center space-x-4">
                        {isAuthenticated ? (
                            <div className="flex items-center space-x-4">
                                {/* Cart Icon */}
                                <motion.div whileHover={{ scale: 1.1 }} className="relative">
                                    <Link to="/cart" className="text-gray-600 hover:text-emerald-600">
                                        <ShoppingCartIcon className="h-6 w-6" />
                                        {cartCount > 0 ? (
                                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                                {cartCount}
                                            </span>
                                        ) : null}
                                    </Link>
                                </motion.div>
                                {/* Profile Dropdown */}
                                <ProfileDropdown />
                            </div>
                        ) : (
                            <div className="flex space-x-4">
                                <motion.div whileHover={{ scale: 1.1 }}>
                                    <Link
                                        to="/login"
                                        className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                                    >
                                        Login
                                    </Link>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.1 }}>
                                    <Link
                                        to="/register"
                                        className="bg-white text-emerald-600 border border-emerald-600 px-4 py-2 rounded-lg hover:bg-emerald-50 transition-colors"
                                    >
                                        Register
                                    </Link>
                                </motion.div>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center space-x-4">
                        {isAuthenticated && (
                            <Link
                                to="/cart"
                                className="relative text-gray-600 hover:text-emerald-600"
                            >
                                <ShoppingCartIcon className="h-6 w-6" />
                                {cartCount > 0 ? (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                ) : null}
                            </Link>
                        )}
                        
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-600 hover:text-emerald-600 focus:outline-none"
                        >
                            {isOpen ? (
                                <XMarkIcon className="h-6 w-6" />
                            ) : (
                                <Bars3Icon className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white shadow-lg overflow-hidden"
                    >
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            {isAuthenticated && (
                                <div className="flex items-center space-x-3 px-3 py-2 border-b border-gray-200">
                                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-500">
                                        {userProfile?.avatar ? (
                                            <img 
                                                src={userProfile.avatar} 
                                                alt="Profile" 
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-emerald-200 flex items-center justify-center">
                                                <UserIcon className="h-6 w-6 text-emerald-600" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-gray-900">{userProfile?.name}</span>
                                        <span className="text-xs text-gray-500">{userProfile?.phone}</span>
                                    </div>
                                </div>
                            )}

                            {navItems.map((item) => (
                                (!item.protected || isAuthenticated) && (
                                    <Link
                                        key={item.name}
                                        to={item.path}
                                        className="flex items-center text-gray-600 hover:text-emerald-600 px-3 py-2 rounded-md text-base font-medium"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <item.icon className="h-5 w-5 mr-2" />
                                        {item.name}
                                    </Link>
                                )
                            ))}
                            
                            {isAuthenticated ? (
                                <>
                                    <Link
                                        to="/profile"
                                        className="flex items-center text-gray-600 hover:text-emerald-600 px-3 py-2 rounded-md text-base font-medium"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <CogIcon className="h-5 w-5 mr-2" />
                                        Profile Settings
                                    </Link>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setIsOpen(false);
                                        }}
                                        className="w-full text-left flex items-center text-gray-600 hover:text-emerald-600 px-3 py-2 rounded-md text-base font-medium"
                                    >
                                        <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                    to="/login"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-white bg-emerald-600 hover:bg-emerald-700"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-emerald-600 border border-emerald-600 hover:bg-emerald-50 mt-2"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Register
                                </Link>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;