import React from 'react';
import { motion } from 'framer-motion';
import { 
    PhoneIcon, 
    EnvelopeIcon, 
    MapPinIcon,
    ShoppingBagIcon,
    HeartIcon,
    UserGroupIcon,
    GlobeAltIcon
} from '@heroicons/react/24/outline';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="relative bg-gradient-to-t from-green-500 via-emerald-500 to-teal-500 relative overflow-hidden">
            {/* Background Pattern */}
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

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        { title: "About Us", icon: HeartIcon, content: "Experience the ancient wisdom of Ayurveda through our carefully curated collection of authentic products. We're dedicated to bringing wellness and balance to your life naturally." },
                        { title: "Quick Links", icon: GlobeAltIcon, content: "Our Products", links: [{ href: "/products", label: "Our Products" }, { href: "/about", label: "About Us" }, { href: "/contact", label: "Contact" }] },
                        { title: "Contact Us", icon: UserGroupIcon, content: "info@ayurveda.com", details: [{ label: "+91 123 456 7890", icon: PhoneIcon }, { label: "123, Ayurveda Street, Delhi", icon: MapPinIcon }] },
                        { title: "Connect With Us", icon: null, content: "Connect With Us", icons: [FaTwitter, FaFacebook, FaInstagram, FaLinkedin] }
                    ].map((card, index) => (
                        <motion.div 
                            key={index}
                            initial={{ 
                                opacity: 0, 
                                x: index % 2 === 0 ? -50 : 50,
                                y: 20 
                            }}
                            animate={{ 
                                opacity: 1, 
                                x: 0,
                                y: 0 
                            }}
                            transition={{ 
                                duration: 0.6,
                                delay: index * 0.15,
                                type: "spring",
                                stiffness: 100
                            }}
                            whileHover={{ 
                                scale: 1.05,
                                transition: {
                                    duration: 0.2
                                }
                            }}
                            whileTap={{ scale: 0.98 }}
                            className="relative p-6 rounded-xl bg-white/95 backdrop-blur-sm
                                      shadow-[0_0_15px_rgba(0,0,0,0.1)]
                                      before:absolute before:inset-0 before:rounded-xl
                                      before:p-[2px] before:bg-gradient-to-r 
                                      before:from-emerald-500 before:via-teal-500 before:to-green-500
                                      before:opacity-0 hover:before:opacity-100
                                      before:transition-opacity before:duration-300
                                      overflow-hidden group"
                        >
                            <div className="relative z-10 h-full bg-white/95 rounded-lg p-4">
                                <h3 className="text-xl font-bold mb-4 text-emerald-800 flex items-center">
                                    {card.icon && <card.icon className="w-6 h-6 mr-2 text-emerald-600" />}
                                    {card.title}
                                </h3>
                                {card.content && <p className="text-emerald-700 text-sm leading-relaxed">{card.content}</p>}
                                {card.links && (
                                    <ul className="space-y-2 text-emerald-700">
                                        {card.links.map((link, index) => (
                                            <motion.li whileHover={{ x: 5 }} key={index}>
                                                <a href={link.href} className="hover:text-emerald-500 transition-colors flex items-center">
                                                    {link.label}
                                                </a>
                                            </motion.li>
                                        ))}
                                    </ul>
                                )}
                                {card.details && (
                                    <div className="space-y-3 text-emerald-700">
                                        {card.details.map((detail, index) => (
                                            <motion.p 
                                                className="flex items-center"
                                                whileHover={{ x: 5 }}
                                                key={index}
                                            >
                                                <detail.icon className="w-4 h-4 mr-2 text-emerald-600" />
                                                {detail.label}
                                            </motion.p>
                                        ))}
                                    </div>
                                )}
                                {card.icons && (
                                    <div className="flex space-x-4">
                                        {card.icons.map((Icon, index) => (
                                            <motion.a
                                                key={index}
                                                href="#"
                                                className="bg-emerald-100 p-3 rounded-full text-emerald-600 hover:bg-emerald-200 transition-colors transform-gpu"
                                                whileHover={{ 
                                                    scale: 1.2,
                                                    rotate: 360,
                                                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
                                                }}
                                                transition={{
                                                    type: "spring",
                                                    stiffness: 300,
                                                    damping: 15
                                                }}
                                            >
                                                <Icon size={20} />
                                            </motion.a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Copyright Section */}
                <div className="mt-12 pt-8 border-t border-emerald-200 text-center">
                    <p className="text-emerald-700 text-sm">
                        © {new Date().getFullYear()} Ayurveda. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;