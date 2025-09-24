'use client';

import React from 'react';
import { motion } from 'framer-motion';

// Ícono oficial de WhatsApp
const WhatsAppIcon: React.FC<{ className?: string }> = ({
  className = 'w-6 h-6',
}) => (
  <svg className={className} viewBox='0 0 24 24' fill='currentColor'>
    <path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.516' />
  </svg>
);

interface WhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
  position?: 'bottom-right' | 'bottom-left';
  className?: string;
}

const WhatsAppFloatingButton: React.FC<WhatsAppButtonProps> = ({
  phoneNumber = '13027248080',
  message = 'Hello! I would like to know more about your services.',
  position = 'bottom-right',
  className = '',
}) => {
  const handleWhatsAppClick = () => {
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const positionClass =
    position === 'bottom-left' ? 'bottom-6 left-6' : 'bottom-6 right-6';

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleWhatsAppClick}
      className={`
        fixed ${positionClass} z-50
        w-14 h-14 bg-green-500 hover:bg-green-600
        text-white rounded-full shadow-lg hover:shadow-xl
        flex items-center justify-center
        transition-all duration-200
        focus:outline-none focus:ring-4 focus:ring-green-500/30
        ${className}
      `}
      type='button'
      aria-label='Contact us on WhatsApp'
    >
      <WhatsAppIcon />
    </motion.button>
  );
};

// Demo simple
const Demo: React.FC = () => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center'>
      <div className='text-center'>
        <h1 className='text-4xl font-bold text-gray-800 mb-4'>
          WhatsApp Button
        </h1>
        <p className='text-gray-600 mb-8'>
          Versión limpia y optimizada con el ícono oficial
        </p>

        {/* El botón aparecerá en la esquina */}
        <WhatsAppFloatingButton
          phoneNumber='13027248080'
          message='¡Hola! Me interesa conocer más sobre sus servicios.'
        />

        {/* Ejemplo en posición izquierda para demo */}
        <div className='relative w-80 h-40 mx-auto bg-white rounded-lg shadow-lg'>
          <p className='pt-16 text-gray-500'>Vista previa del sitio web</p>
          <WhatsAppFloatingButton position='bottom-left' className='relative' />
        </div>
      </div>
    </div>
  );
};

export default Demo;
