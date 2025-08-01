'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowDownCircle, ChevronRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/client';

// Custom Hook para window dimensions (componente reutilizable)
const useWindowDimensions = () => {
  const [windowDimensions, setWindowDimensions] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        setWindowDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };

      // Set initial dimensions
      handleResize();

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  return windowDimensions;
};

// Componente separado para las partículas (mejor arquitectura)
const AnimatedParticles = () => {
  const { width, height } = useWindowDimensions();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // No renderizar hasta que esté en el cliente
  if (!isClient || width === 0 || height === 0) {
    return null;
  }

  return (
    <div className='absolute inset-0 z-15 pointer-events-none overflow-hidden'>
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          initial={{
            opacity: 0,
            scale: 0,
            x: Math.random() * width,
            y: Math.random() * height,
          }}
          animate={{
            opacity: [0, 0.6, 0],
            scale: [0, 1, 0],
            y: [Math.random() * height, -100],
          }}
          transition={{
            duration: Math.random() * 3 + 4,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: 'easeInOut',
          }}
          className='absolute w-1 h-1 bg-amber-400 rounded-full'
        />
      ))}
    </div>
  );
};

const Hero = () => {
  const { t } = useTranslation();

  return (
    <div className='relative min-h-screen w-full overflow-hidden font-[family-name:var(--font-outfit)]'>
      {/* Luxury Background */}
      <div className='absolute inset-0 z-0'>
        <div className='hero-img absolute inset-0 bg-cover bg-center' />
        <div className='absolute inset-0 bg-gradient-to-br from-black/20 via-black/10 to-black/50 z-10'></div>
        <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/50 z-10'></div>
        <div className='absolute inset-0 bg-black/9 z-10'></div>
      </div>

      {/* Componente separado para partículas */}
      <AnimatedParticles />

      {/* Main Content */}
      <div className='relative z-20 min-h-screen flex flex-col'>
        {/* Top Section */}
        <div className='flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8'>
          <div className='max-w-6xl mx-auto text-center'>
            {/* Revolutionary Title Design */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1.2 }}
              className='space-y-4'
            >
              <div className='relative'>
                {/* Main Brand */}
                <motion.h1
                  initial={{ opacity: 0, y: 60, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 1, duration: 1.2, ease: 'easeOut' }}
                  className='text-white text-7xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tighter relative'
                >
                  <span className='relative inline-block'>
                    <span className='relative'>Lux</span>
                  </span>
                </motion.h1>

                {/* Elegant underline */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1.8, duration: 1.2, ease: 'easeOut' }}
                  className='h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent mt-2 rounded-full'
                />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.8 }}
                className='space-y-2'
              >
                <div className='subtitle text-xl sm:text-2xl md:text-3xl font-light text-white/50 tracking-[0.3em] uppercase'>
                  Punta Cana
                </div>
                <div className='flex items-center justify-center gap-4'>
                  <div className='w-16 h-px bg-gradient-to-r from-transparent to-amber-400'></div>
                  <Sparkles size={20} className='text-amber-400' />
                  <div className='w-16 h-px bg-gradient-to-l from-transparent to-amber-400'></div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Section with Scroll */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3, duration: 1 }}
          className='pb-32 flex flex-col items-center space-y-4'
        >
          <div className='flex mt-30 flex-col sm:flex-row gap-6 justify-center'>
            <Link href='/custom-package'>
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 25px 50px rgba(245, 158, 11, 0.4)',
                  y: -5,
                }}
                whileTap={{ scale: 0.95 }}
                className='main-button group relative px-7 py-3 bg-gradient-to-r  text-white font-bold  shadow-2xl overflow-hidden'
              >
                <span className=' relative z-10 flex items-center justify-center'>
                  {t('common.button.explore')}
                  <ChevronRight
                    className='transition-transform group-hover:translate-x-2'
                    size={22}
                  />
                </span>
                <div className='absolute inset-0 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                <div className='absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12'></div>
              </motion.button>
            </Link>
          </div>
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          >
            <Link href='#packages'>
              <div className='w-12 h-12 border-2 border-white/30 rounded-full flex items-center justify-center hover:border-amber-400/60 transition-all duration-300 group'>
                <ArrowDownCircle
                  size={24}
                  className='text-white/60 group-hover:text-amber-400/80 transition-colors duration-300'
                />
              </div>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Elegant bottom fade */}
      <div className='absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-black to-transparent z-10'></div>
    </div>
  );
};

export default Hero;
