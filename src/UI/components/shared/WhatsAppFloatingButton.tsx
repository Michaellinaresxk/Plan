'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Phone } from 'lucide-react';

interface FloatingActionButtonProps {
  phoneNumber?: string;
  message?: string;
  position?: 'bottom-right' | 'bottom-left';
  className?: string;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  phoneNumber = '13027248080',
  message = 'Hello! I would like to know more about your services.',
  position = 'bottom-right',
  className = '',
}) => {
  const handleWhatsAppClick = () => {
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, '_blank');
  };

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
  };

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleWhatsAppClick}
      className={`
        fixed ${positionClasses[position]} z-50
        w-14 h-14 bg-green-500 hover:bg-green-600
        text-white rounded-full shadow-lg hover:shadow-xl
        flex items-center justify-center
        transition-colors duration-200
        focus:outline-none focus:ring-4 focus:ring-green-500/30
        ${className}
      `}
      type='button'
    >
      <Phone className='w-6 h-6' />
    </motion.button>
  );
};

export default FloatingActionButton;
