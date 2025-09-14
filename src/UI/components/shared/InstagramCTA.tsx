'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, Heart, Users } from 'lucide-react';

interface InstagramCTAProps {
  variant?: 'default' | 'compact' | 'hero';
  className?: string;
  showStats?: boolean;
}

const InstagramCTA: React.FC<InstagramCTAProps> = ({
  variant = 'default',
  className = '',
  showStats = true,
}) => {
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
              ¡Síguenos en Instagram!
            </h3>

            <p className='text-white/90 mb-6 text-lg leading-relaxed'>
              Descubre las mejores experiencias en Punta Cana, fotos exclusivas
              y ofertas especiales solo para nuestros seguidores.
            </p>

            {/* Stats (solo en variante default y hero) */}
            {showStats && (variant === 'default' || variant === 'hero') && (
              <div className='flex justify-center md:justify-start gap-6 mb-6'>
                <motion.div
                  className='flex items-center gap-2'
                  whileHover={{ scale: 1.05 }}
                >
                  <Heart className='w-5 h-5 text-red-300' />
                  <span className='text-sm font-medium'>+2.5k seguidores</span>
                </motion.div>
                <motion.div
                  className='flex items-center gap-2'
                  whileHover={{ scale: 1.05 }}
                >
                  <Users className='w-5 h-5 text-blue-300' />
                  <span className='text-sm font-medium'>Contenido diario</span>
                </motion.div>
              </div>
            )}
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
            <span>Seguir Ahora</span>
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

// 2. Integración en tu ContactPage - Agregar DESPUÉS de la sección del formulario
// Reemplaza tu CTASection actual con esto:

// En tu ContactPage.tsx, importa el componente:
// import InstagramCTA from '@/components/ui/InstagramCTA';

// Y reemplaza tu <CTASection /> con:
const InstagramSection = () => (
  <section className='py-20 bg-gray-50'>
    <div className='container mx-auto px-6'>
      <div className='max-w-4xl mx-auto'>
        {/* Instagram CTA Principal */}
        <InstagramCTA variant='default' className='mb-12' />

        {/* Grid de beneficios */}
        <div className='grid md:grid-cols-3 gap-8 mt-12'>
          <motion.div
            className='text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300'
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className='w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <Instagram className='w-8 h-8 text-purple-600' />
            </div>
            <h3 className='text-xl font-semibold text-gray-900 mb-3'>
              Fotos Exclusivas
            </h3>
            <p className='text-gray-600'>
              Ve los lugares más hermosos de Punta Cana desde una perspectiva
              única.
            </p>
          </motion.div>

          <motion.div
            className='text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300'
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className='w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <Heart className='w-8 h-8 text-pink-600' />
            </div>
            <h3 className='text-xl font-semibold text-gray-900 mb-3'>
              Ofertas Especiales
            </h3>
            <p className='text-gray-600'>
              Accede a promociones exclusivas solo para nuestros seguidores de
              Instagram.
            </p>
          </motion.div>

          <motion.div
            className='text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300'
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className='w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <Users className='w-8 h-8 text-orange-600' />
            </div>
            <h3 className='text-xl font-semibold text-gray-900 mb-3'>
              Comunidad Activa
            </h3>
            <p className='text-gray-600'>
              Conecta con otros viajeros y comparte tus mejores momentos.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  </section>
);
