'use client';

import React from 'react';
import { motion } from 'framer-motion';

import { useTranslation } from '@/lib/i18n/client';
import HeroContent from './HeroContent';
import HeroActions from './HeroActions';
import AnimatedParticles from './AnimatedParticles';
import useScrollParallax from '@/hooks/useScrollParallax';

// Función para scroll suave a la siguiente sección

const Hero = () => {
  const { t } = useTranslation();
  const scrollY = useScrollParallax();

  return (
    <div className='relative min-h-screen w-full overflow-hidden font-[family-name:var(--font-outfit)]'>
      {/* Parallax Background */}
      <motion.div
        className='absolute inset-0 z-0'
        style={{
          transform: `translateY(${scrollY * 0.5}px)`,
        }}
      >
        <img
          src='/img/beach-bg.jpg'
          alt='Luxury Background'
          className='absolute inset-0 w-full h-[120%] object-cover'
        />
        <div className='absolute inset-0 bg-gradient-to-br from-black/30 via-black/20 to-black/40 z-10'></div>
      </motion.div>

      {/* Componente separado para partículas con parallax */}
      <AnimatedParticles scrollY={scrollY} />

      {/* Main Content */}
      <div className='relative z-20 min-h-screen flex flex-col'>
        {/* Contenido principal */}
        <HeroContent scrollY={scrollY} t={t} />

        {/* Spacer para empujar contenido hacia abajo */}
        <div className='flex-1'></div>

        {/* Sección inferior con botones */}
        <HeroActions scrollY={scrollY} t={t} />
      </div>
    </div>
  );
};

export default Hero;
