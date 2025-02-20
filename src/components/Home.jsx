import React from 'react';
import { motion } from 'framer-motion';
import { StarIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';
const Home = () => {
  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Wellness Enthusiast",
      content: "Ayurvedic products have transformed my daily wellness routine. The natural healing approach is incredible!",
      image: "https://randomuser.me/api/portraits/women/1.jpg"
    },
    {
      name: "Rahul Verma",
      role: "Yoga Instructor",
      content: "As a yoga instructor, I highly recommend these authentic Ayurvedic products. They complement my practice perfectly.",
      image: "https://randomuser.me/api/portraits/men/1.jpg"
    },
    {
      name: "Anita Patel",
      role: "Holistic Health Coach",
      content: "The quality and authenticity of these Ayurvedic products are unmatched. My clients love the results!",
      image: "https://randomuser.me/api/portraits/women/2.jpg"
    }
  ];

  const ayurvedaFacts = [
    "5000+ years of ancient wisdom",
    "Natural healing approach",
    "Personalized wellness solutions",
    "Balance of mind, body & spirit",
    "Sustainable health practices",
    "Preventive health care"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 p-8 relative overflow-hidden">
      {/* Floating Elements */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/10 backdrop-blur-sm"
          style={{
            width: Math.random() * 100 + 20,
            height: Math.random() * 100 + 20,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, Math.random() * 100 - 50],
            x: [0, Math.random() * 100 - 50],
            rotate: [0, 360],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto text-center text-white relative z-10"
      >
        <h1 className="text-6xl font-bold mb-6">Welcome to Ayurveda</h1>
        <p className="text-2xl mb-12">Discover the ancient wisdom of natural healing</p>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-white/20 backdrop-blur-sm p-6 rounded-lg"
          >
            <h3 className="text-2xl font-semibold mb-4">Natural Products</h3>
            <p>Pure and authentic Ayurvedic products for your well-being</p>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-white/20 backdrop-blur-sm p-6 rounded-lg"
          >
            <h3 className="text-2xl font-semibold mb-4">Expert Guidance</h3>
            <p>Professional advice from experienced Ayurvedic practitioners</p>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-white/20 backdrop-blur-sm p-6 rounded-lg"
          >
            <h3 className="text-2xl font-semibold mb-4">Holistic Health</h3>
            <p>Comprehensive approach to mind, body, and spirit wellness</p>
          </motion.div>
        </div>

        {/* About Ayurveda Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold mb-8">The Science of Life</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {ayurvedaFacts.map((fact, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-sm p-4 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {fact}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Testimonials Section */}
        <h2 className="text-4xl font-bold mb-12">What Our Customers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white/20 backdrop-blur-sm p-6 rounded-lg text-left"
            >
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-white/80">{testimonial.role}</p>
                </div>
              </div>
              <p className="mb-4">{testimonial.content}</p>
              <div className="flex text-yellow-300">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="h-5 w-5" />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-20"
        >
          <h2 className="text-4xl font-bold mb-6">Begin Your Wellness Journey</h2>
          <p className="text-xl mb-8">Experience the transformative power of Ayurveda</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-emerald-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-white/90 transition-colors"
          >
           <Link to="/products"> Explore Products</Link>
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Home;