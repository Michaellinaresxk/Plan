import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

// Componente para el contenido principal
const HeroContent = ({ scrollY, t }) => {
  return (
    <div className='flex items-start justify-center px-4 sm:px-6 lg:px-8 pt-8 md:pt-12'>
      <div className='max-w-7xl mx-auto text-center relative'>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1.5 }}
          className='relative'
          style={{
            transform: `translateY(${scrollY * 0.2}px)`,
          }}
        >
          {/* Foreground Content */}
          <div className='relative z-10 pt-8'>
            {/* Título principal LUX */}
            <motion.div
              initial={{ opacity: 0, y: 60, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 1.2, duration: 1.2, ease: 'easeOut' }}
              style={{
                textShadow: '0 0 40px rgba(0, 0, 0, 0.7)',
                transform: `translateY(${scrollY * 0.1}px)`,
              }}
            >
              {/* LUX - Centrado en todos los dispositivos */}
              {/* <div className='mb-5 flex justify-center'>
                <img
                  src='/img/logo.png'
                  alt='Lux puntacana logo'
                  className='max-w-30 md:max-w-40 w-full h-auto object-contain opacity-80'
                />
              </div> */}
              {/* <motion.h1
                initial={{ opacity: 0, y: 60, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 1.2, duration: 1.2, ease: 'easeOut' }}
                className='text-white text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight mb-4'
                style={{
                  textShadow: '0 0 40px rgba(0, 0, 0, 0.7)',
                  transform: `translateY(${scrollY * 0.1}px)`,
                }}
              >
                Lux
              </motion.h1> */}
            </motion.div>

            {/* Línea amarilla elegante */}
            {/* <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.8, duration: 1.2, ease: 'easeOut' }}
              className='h-1 mb-5 rounded-full mx-auto max-w-xs'
              style={{
                background:
                  'linear-gradient(to right, transparent, #e2cd8c, transparent)',
                transform: `translateY(${scrollY * 0.1}px)`,
              }}
            /> */}

            {/* Punta Cana y elementos decorativos */}
            {/* <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.2, duration: 0.8 }}
              className='space-y-4'
              style={{
                transform: `translateY(${scrollY * 0.15}px)`,
              }}
            >
              <div
                className='text-2xl sm:text-3xl md:text-4xl font-light text-white/90 tracking-[0.1em]'
                style={{ fontFamily: 'Pacifico, cursive' }}
              >
                Punta Cana
              </div>

              <div className='flex items-center justify-center gap-6'>
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 2.6, duration: 1 }}
                  className='w-20 h-px'
                  style={{
                    background:
                      'linear-gradient(to right, transparent, #e2cd8c)',
                  }}
                />
                <Sparkles size={24} className='text-[#e2cd8c]' />
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 2.6, duration: 1 }}
                  className='w-20 h-px'
                  style={{
                    background:
                      'linear-gradient(to left, transparent, #e2cd8c)',
                  }}
                />
              </div>
            </motion.div> */}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroContent;
