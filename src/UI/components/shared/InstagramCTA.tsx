'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, Heart, Users } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/client';

interface InstagramCTAProps {
  variant?: 'default' | 'compact' | 'hero';
  className?: string;
  showStats?: boolean;
}

const InstagramCTA: React.FC<InstagramCTAProps> = ({
  variant = 'default',
  className = '',
}) => {
  const { t } = useTranslation();

  const instagramUrl =
    'https://www.instagram.com/lxpuntacana?igsh=bnp1NGtnbWpna3I4&utm_source=qr';

  // Variantes del componente
  const variants = {
    default: {
      container:
        'bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 rounded-2xl p-8 text-white shadow-2xl',
      content: 'flex flex-col md:flex-row items-center gap-6',
      text: 'flex-1 text-center md:text-left',
    },
    compact: {
      container:
        'bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white shadow-lg',
      content: 'flex items-center gap-4',
      text: 'flex-1',
    },
    hero: {
      container:
        'bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 rounded-3xl p-12 text-white shadow-2xl',
      content: 'text-center',
      text: '',
    },
  };

  const currentVariant = variants[variant];

  return (
    <motion.div
      className={`${currentVariant.container} ${className}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      whileHover={{ y: -5 }}
    >
      <div className={currentVariant.content}>
        {/* Contenido principal */}
        <div className={currentVariant.text}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className='flex items-center justify-center md:justify-start gap-3 mb-4'>
              <div className='relative'>
                <Instagram className='w-8 h-8' />
                <motion.div
                  className='absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full'
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              </div>
              <span className='text-lg font-semibold'>@lxpuntacana</span>
            </div>

            <h3 className='text-2xl md:text-3xl font-bold mb-3'>
              {t('common.instagram.followUs')}
            </h3>

            <p className='text-white/90 mb-6 text-lg leading-relaxed'>
              {t('common.instagram.description')}
            </p>
          </motion.div>
        </div>

        {/* Botón CTA */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className={variant === 'hero' ? 'mt-8' : ''}
        >
          <motion.a
            href={instagramUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='group inline-flex items-center gap-3 bg-white text-purple-600 px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300'
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Instagram className='w-6 h-6 group-hover:rotate-12 transition-transform duration-300' />
            <span> {t('common.instagram.button')}</span>
            <motion.div
              className='w-2 h-2 bg-purple-600 rounded-full'
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
          </motion.a>

          {variant === 'compact' && (
            <p className='text-white/80 text-sm mt-2'>
              ¡Únete a nuestra comunidad!
            </p>
          )}
        </motion.div>
      </div>

      {/* Decoración - Solo en variante default y hero */}
      {(variant === 'default' || variant === 'hero') && (
        <>
          <motion.div
            className='absolute top-4 right-4 w-16 h-16 bg-white/10 rounded-full'
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
          />
          <motion.div
            className='absolute bottom-4 left-4 w-8 h-8 bg-white/5 rounded-full'
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 3 }}
          />
        </>
      )}
    </motion.div>
  );
};

export default InstagramCTA;
