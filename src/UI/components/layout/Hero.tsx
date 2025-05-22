'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDownCircle, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/client';

const Hero = () => {
  const { t } = useTranslation();
  return (
    <div className='relative min-h-screen w-full flex items-center justify-center overflow-hidden font-[family-name:var(--font-geist-sans)]'>
      {/* Background image with overlay */}
      <div className='absolute inset-0 bg-cover bg-center z-0'>
        {/* Cambia a una imagen más elegante y de mayor calidad */}
        <div className='hero-img absolute inset-0 bg-cover bg-center' />
        {/* Overlay con gradiente más sofisticado */}
        <div className='absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70 z-10'></div>
      </div>

      {/* Content */}
      <div className='container mx-auto px-6 relative z-20 text-center max-w-5xl'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className='space-y-8'
        >
          {/* Pill badge para añadir exclusividad */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <span className='inline-block bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium border border-white/20'>
              Luxury Experience in Dominican Republic
            </span>
          </motion.div>

          <h1 className='text-6xl md:text-8xl font-bold text-white mb-6 tracking-tight leading-tight'>
            Punta Cana <span className='text-amber-400'>Plan</span>
          </h1>

          <p className='text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed'>
            {t('home.hero.subtitle')}
            <span className='block mt-2 text-amber-300 font-medium'>
              Exclusivity • Luxury • Unforgettable
            </span>
          </p>

          <div className='flex flex-col sm:flex-row gap-6 justify-center pt-4'>
            <Link href='/custom-package'>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className='px-8 py-5 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition-all duration-300 text-lg shadow-lg flex items-center'
              >
                {t('common.button.explore')}
                <ChevronRight className='ml-2' size={20} />
              </motion.button>
            </Link>

            <Link href='/contact'>
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 0 15px rgba(255, 205, 97, 0.5)',
                }}
                whileTap={{ scale: 0.98 }}
                className='px-8 py-5 bg-transparent border-2 border-white hover:border-amber-400 hover:text-amber-400 text-white font-semibold rounded-lg transition-all duration-300 text-lg'
              >
                {t('common.button.contactUs')}
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className='absolute bottom-12 left-0 right-0 flex justify-center z-20'>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <Link href='#packages'>
            <ArrowDownCircle
              size={48}
              className='text-white/80 hover:text-amber-400 cursor-pointer transition-colors duration-300'
            />
          </Link>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className='absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black to-transparent z-10'></div>
    </div>
  );
};

export default Hero;
