'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Globe } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/client';

const LanguageNotification = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { t, language } = useTranslation();

  useEffect(() => {
    // Listener para el evento de cambio de idioma
    const handleLanguageChange = () => {
      setIsVisible(true);

      // Ocultar después de 3 segundos
      setTimeout(() => {
        setIsVisible(false);
      }, 3000);
    };

    // Agregar event listener
    document.addEventListener('languageChanged', handleLanguageChange);

    // Limpiar event listener
    return () => {
      document.removeEventListener('languageChanged', handleLanguageChange);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className='fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50'
        >
          <div className='bg-green-50 border border-green-200 shadow-lg rounded-lg py-3 px-4 flex items-center'>
            <div className='bg-green-100 rounded-full p-1 mr-3'>
              <Check size={16} className='text-green-600' />
            </div>
            <div className='flex items-center'>
              <Globe size={16} className='mr-2 text-gray-600' />
              <span className='text-gray-800'>
                {language === 'en'
                  ? 'Language changed to English'
                  : 'Idioma cambiado a Español'}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LanguageNotification;
