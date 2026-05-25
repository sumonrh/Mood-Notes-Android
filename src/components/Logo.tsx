import React from 'react';
import { motion } from 'motion/react';

export const Logo: React.FC<{ size?: number; className?: string }> = ({ size = 40, className = "" }) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Main House Shape */}
      <svg 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <g transform="translate(50, 50) scale(0.65) translate(-50, -50)">
          {/* Soft Rounded Background */}
          <rect x="10" y="30" width="80" height="60" rx="25" fill="#E8F5E9" />
          
          {/* Roof */}
          <path 
            d="M10 45L50 10L90 45" 
            stroke="#4CAF50" 
            strokeWidth="8" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          
          {/* Door */}
          <rect x="40" y="65" width="20" height="25" rx="5" fill="#4CAF50" />
          
          {/* Window */}
          <circle cx="50" cy="45" r="8" fill="white" />
          <circle cx="50" cy="45" r="4" fill="#4CAF50" />

          {/* Cute Leaf Accent */}
          <motion.path 
            initial={{ rotate: -10 }}
            animate={{ rotate: 10 }}
            transition={{ repeat: Infinity, duration: 2, repeatType: "reverse", ease: "easeInOut" }}
            d="M75 20C75 20 85 10 95 20C95 30 85 35 75 35C65 35 60 30 60 20C60 10 70 10 75 20Z" 
            fill="#8BC34A" 
            style={{ originX: "75px", originY: "35px" }}
          />

          {/* Sparkles */}
          <motion.circle 
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5, delay: 0.5 }}
            cx="20" cy="20" r="3" fill="#FFD700" 
          />
          <motion.circle 
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5, delay: 1 }}
            cx="85" cy="50" r="2" fill="#FFD700" 
          />
        </g>
      </svg>
    </motion.div>
  );
};
