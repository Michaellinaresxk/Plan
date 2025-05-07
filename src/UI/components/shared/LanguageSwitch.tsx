'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage, useTranslation } from '@/lib/i18n/client';

interface LanguageSwitchProps {
  className?: string;
  isExpanded?: boolean;
}

const LanguageSwitch: React.FC<LanguageSwitchProps> = ({
  className = '',
  isExpanded = false,
}) => {
  const [language, setLanguage] = useLanguage();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Para evitar errores de hidratación, cargaremos las traducciones solo en el lado del cliente
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Cerrar el dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Manejar cambio de idioma
  const handleLanguageChange = (newLanguage: 'en' | 'es') => {
    if (newLanguage !== language) {
      setLanguage(newLanguage);
      setIsOpen(false);

      // Opcional: Mostrar una notificación de cambio de idioma
      const event = new CustomEvent('languageChanged', {
        detail: { language: newLanguage },
      });
      document.dispatchEvent(event);
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {isExpanded ? (
        // Versión expandida para menú móvil
        <div className='flex flex-col space-y-2'>
          <button
            onClick={() => handleLanguageChange('en')}
            className={`flex items-center justify-between px-4 py-2 rounded-lg transition-colors ${
              language === 'en'
                ? 'bg-amber-100 text-amber-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <div className='flex items-center'>
              <span className='mr-2'>🇺🇸</span>
              <span>English</span>
            </div>
            {language === 'en' && (
              <svg
                className='h-5 w-5 text-amber-500'
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path
                  fillRule='evenodd'
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                  clipRule='evenodd'
                />
              </svg>
            )}
          </button>

          <button
            onClick={() => handleLanguageChange('es')}
            className={`flex items-center justify-between px-4 py-2 rounded-lg transition-colors ${
              language === 'es'
                ? 'bg-amber-100 text-amber-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <div className='flex items-center'>
              <span className='mr-2'>🇪🇸</span>
              <span>Español</span>
            </div>
            {language === 'es' && (
              <svg
                className='h-5 w-5 text-amber-500'
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path
                  fillRule='evenodd'
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                  clipRule='evenodd'
                />
              </svg>
            )}
          </button>
        </div>
      ) : (
        // Versión compacta para navbar
        <>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`flex items-center space-x-1 transition-colors px-2 py-1 rounded-lg focus:outline-none ${className}`}
            aria-expanded={isOpen}
            // Usar el idioma actual en lugar de un valor estático
            aria-label={t('common.nav.selectLanguage', {
              fallback: 'Select Language',
            })}
          >
            <Globe size={18} />
            <span className='text-sm font-medium uppercase'>{language}</span>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className={`h-4 w-4 transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`}
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M19 9l-7 7-7-7'
              />
            </svg>
          </button>

          {/* Dropdown del selector de idioma - solo lo renderizamos en el cliente */}
          {isClient && (
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className='absolute right-0 mt-2 w-36 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50'
                >
                  <div className='py-1' role='menu' aria-orientation='vertical'>
                    <button
                      onClick={() => handleLanguageChange('en')}
                      className={`w-full text-left px-4 py-2 text-sm ${
                        language === 'en'
                          ? 'bg-gray-100 text-amber-500 font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      role='menuitem'
                    >
                      <div className='flex items-center'>
                        <span className='mr-2'>🇺🇸</span> English
                      </div>
                    </button>
                    <button
                      onClick={() => handleLanguageChange('es')}
                      className={`w-full text-left px-4 py-2 text-sm ${
                        language === 'es'
                          ? 'bg-gray-100 text-amber-500 font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      role='menuitem'
                    >
                      <div className='flex items-center'>
                        <span className='mr-2'>🇪🇸</span> Español
                      </div>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </>
      )}
    </div>
  );
};

export default LanguageSwitch;
