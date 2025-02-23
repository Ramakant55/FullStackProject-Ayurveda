import React from 'react';
import { motion } from 'framer-motion';

const AboutUs = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  // Add floating circles component
  const FloatingCircles = () => {
    return (
      <>
        {/* Top left circle */}
        <motion.div 
          className="absolute top-0 left-0 w-20 h-20 bg-green-200 rounded-full opacity-20"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360] 
          }}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Top right circle */}
        <motion.div 
          className="absolute top-10 right-20 w-32 h-32 bg-emerald-200 rounded-full opacity-20"
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [360, 0, 360] 
          }}
          transition={{ 
            duration: 7,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Middle left circle */}
        <motion.div 
          className="absolute top-1/3 left-10 w-24 h-24 bg-teal-200 rounded-full opacity-20"
          animate={{ 
            scale: [1, 1.3, 1],
            x: [10, 30, 0] 
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Middle right circle */}
        <motion.div 
          className="absolute top-1/2 right-10 w-28 h-28 bg-green-200 rounded-full opacity-20"
          animate={{ 
            scale: [1.2, 1, 1.2],
            y: [0, -30, 0] 
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Bottom left circle */}
        <motion.div 
          className="absolute bottom-20 left-20 w-36 h-36 bg-emerald-200 rounded-full opacity-20"
          animate={{ 
            scale: [1, 1.4, 1],
            rotate: [0, -180, -360] 
          }}
          transition={{ 
            duration: 9,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Bottom right circle */}
        <motion.div 
          className="absolute bottom-10 right-10 w-24 h-24 bg-teal-200 rounded-full opacity-20"
          animate={{ 
            scale: [1.2, 1, 1.2],
            x: [0, -20, 0],
            y: [0, -20, 0] 
          }}
          transition={{ 
            duration: 7,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </>
    );
  };

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-b from-green-500 via-emerald-500 to-teal-500 relative overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Add the floating circles */}
      <FloatingCircles />
      
      <div className="max-w-6xl mx-auto px-4 py-10 relative z-10">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-16 relative"
          variants={itemVariants}
        >
          <h1 className="text-4xl font-bold mb-6 text-black">About Ayurveda</h1>
          <p className="text-lg italic text-black">
            We believe in providing the <strong>best</strong> and most effective <strong>Ayurvedic</strong>, 
            natural and long-term <strong>treatment</strong> to help individuals become the 
            <strong> best version of themselves</strong>.
          </p>
        </motion.div>

        {/* About Section */}
        <motion.div 
          className="mb-12 bg-white/95 p-8 rounded-lg shadow-lg shadow-black"
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
        >
          <p className="mb-4 text-black">
            Trusted since 1992, Ayurveda is a leading manufacturer of ayurvedic medicines and over-the-counter products. 
            Ayurveda's classical and proprietary range of products have been developed after decades of extensive research 
            and development studies.
          </p>
          
          <p className="mb-4 text-black">
            Our company is registered by the name- Ayurveda Kalp Private Limited. As the name suggests, 'Ayurveda' meaning 
            the best and 'Kalp' meaning treatment, Ayurveda products are made using the best quality ingredients and herbs.
          </p>
        </motion.div>

        {/* Experts Section */}
        <motion.div className="mb-12" variants={itemVariants}>
          <h2 className="text-3xl font-semibold mb-8 text-black">Our Panel of Experts</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {['Prof. Dr. Abhishek Joshi', 'Dr. Aparna'].map((expert, index) => (
              <motion.div
                key={index}
                className="text-center p-6 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg"
                whileHover={{ scale: 1.05, rotate: 2 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <h3 className="text-xl font-semibold mb-2 text-black">{expert}</h3>
                <p className="text-black">
                  {index === 0 ? 'BAMS, MD, PhD (Ayurveda)' : 'YIC, PGDYTD certified Yog Meditation teacher'}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CSR Initiatives Section */}
        <motion.div className="mb-12" variants={itemVariants}>
          <h2 className="text-3xl font-semibold mb-8 text-black">Our CSR Initiatives</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {['Education', 'Hygiene', 'Healthcare'].map((initiative, index) => (
              <motion.div
                key={index}
                className="p-6 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <h3 className="text-xl font-semibold mb-3 text-black">{initiative}</h3>
                <p className="text-black">
                  {initiative === 'Education' && "25 paise per pouch sold of Ayurveda is donated towards the education of needy children."}
                  {initiative === 'Hygiene' && "We believe in the Clean India Mission and have made efforts to promote basic hygiene in rural parts of the country."}
                  {initiative === 'Healthcare' && "We support various NGOs that provide necessary help to patients with medical needs and burn victims."}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact Information */}
        <motion.div 
          className="bg-white/95 backdrop-blur-sm p-8 rounded-lg shadow-lg"
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
        >
          <h2 className="text-3xl font-semibold mb-6 text-black">Contact Information</h2>
          <div className="space-y-3">
            {[
              { label: 'Customer Care Email', value: 'customercare@ayurveda.com' },
              { label: 'Customer Care Number', value: '+91 982 878 4436' },
              { label: 'Address', value: 'B8 & B16, Sector-3, New Delhi, India' },
              { label: 'Working Hours', value: '9am to 6pm (Mon to Sat)' }
            ].map((item, index) => (
              <motion.p 
                key={index}
                className="text-black"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <span className="font-medium">{item.label}:</span> {item.value}
              </motion.p>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AboutUs; 