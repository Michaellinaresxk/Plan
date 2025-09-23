'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu } from 'lucide-react';
import LanguageSwitch from '@/UI/components/shared/LanguageSwitch';
import { useTranslation } from '@/lib/i18n/client';
import {
  hamburgerVariants,
  menuItemVariants,
  menuVariants,
} from '@/constants/menuVariants';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { t } = useTranslation();

  const menuItems = [
    { text: t('common.nav.home'), href: '/' },
    { text: t('common.nav.standard'), href: '/standard-package' },
    { text: t('common.nav.premium'), href: '/premium-package' },
    { text: t('common.nav.contact'), href: '/contact' },
    { text: t('common.nav.about'), href: '/about' },
  ];

  // Controlar el scroll para cambiar la apariencia del navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 font-[family-name:var(--font-geist-sans)] transition-all duration-300 ${
        isScrolled ? 'bg-black shadow-md' : 'bg-transparent'
      }`}
    >
      <div className='container mx-auto px-4'>
        <div className='flex items-center justify-between h-16'>
          {/* Logo con animación */}
          <motion.div
            className='flex-shrink-0'
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href='/'
              className={`font-bold text-xl transition-colors duration-300 ${
                isScrolled ? 'text-amber-500' : 'text-white'
              }`}
            >
              <img className='w-13' src='/img/gratis.png' alt='' />
            </Link>
          </motion.div>

          <motion.div
            className='flex items-center space-x-4'
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <LanguageSwitch
              className={isScrolled ? 'text-amber-500' : 'text-white'}
            />

            {/* Menú Hamburguesa con texto y animación */}
            <button
              onClick={toggleMenu}
              className={`inline-flex items-center justify-center p-2 rounded-md focus:outline-none transition duration-300 ease-in-out ${
                isScrolled
                  ? 'text-white hover:text-[#e2cd8c]'
                  : 'text-white hover:text-[#e2cd8c]'
              }`}
              aria-expanded={isOpen}
            >
              {/* <span className='mr-2'>{t('common.nav.menu')}</span> */}
              <motion.div
                variants={hamburgerVariants}
                animate={isOpen ? 'open' : 'closed'}
                transition={{ duration: 0.3 }}
              >
                <Menu className='h-7 w-7' />
              </motion.div>
            </button>
          </motion.div>
        </div>
      </div>

      {/* Menú lateral con animación */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay que cubre la pantalla */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className='fixed inset-0 bg-black z-40'
              onClick={toggleMenu}
            />

            {/* Menú deslizable */}
            <motion.div
              className='fixed top-0 left-0 bottom-0 w-72 bg-white shadow-xl z-50 overflow-y-auto'
              initial='closed'
              animate='open'
              exit='closed'
              variants={menuVariants}
            >
              <div className='p-6'>
                <div className='flex items-center justify-between mb-8'>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Link href='/'>
                      {/* LUX - Centrado en todos los dispositivos */}
                      <div className='flex justify-center'>
                        <img
                          src='/img/logo.png'
                          alt='Lux puntacana logo'
                          className='max-w-15 md:max-w-20 w-full h-auto object-contain'
                        />
                      </div>
                    </Link>
                  </motion.div>
                  <motion.button
                    onClick={toggleMenu}
                    className='text-gray-700 hover:text-gray-900 focus:outline-none'
                    whileHover={{ rotate: 180 }}
                    transition={{ duration: 0.3 }}
                  >
                    <svg
                      className='h-6 w-6'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M6 18L18 6M6 6l12 12'
                      />
                    </svg>
                  </motion.button>
                </div>

                <nav>
                  <ul className='space-y-4'>
                    {menuItems.map((item, index) => (
                      <motion.li
                        key={index}
                        variants={menuItemVariants}
                        whileHover={{ x: 5 }}
                      >
                        <Link
                          href={item.href}
                          className='block py-2 text-gray-700 hover:text-amber-500 transition duration-150 ease-in-out border-b border-gray-100'
                          onClick={toggleMenu}
                        >
                          {item.text}
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </nav>

                {/* Language switcher en el menú móvil */}
                <motion.div
                  className='mt-8 p-4 bg-gray-50 rounded-lg'
                  variants={menuItemVariants}
                >
                  <p className='text-gray-700 text-sm mb-3'>
                    {t('common.nav.selectLanguage')}
                  </p>
                  <LanguageSwitch className='w-full' isExpanded={true} />
                </motion.div>

                <motion.div
                  className='mt-8 p-4 bg-amber-50 rounded-lg'
                  variants={menuItemVariants}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <p className='text-gray-700 text-sm mb-3'>
                    {t('common.nav.needHelp')}
                  </p>
                  <a
                    href='tel:+13027248080'
                    className='flex items-center text-amber-500 font-medium'
                  >
                    <svg
                      className='h-4 w-4 mr-2'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
                      />
                    </svg>
                    +1 302-724-8080
                  </a>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
