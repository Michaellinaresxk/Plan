'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { luxuryImages } from '@/constants/gallery';
import { useTranslation } from '@/lib/i18n/client';

const LuxeGallery = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Abrir lightbox
  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    document.body.style.overflow = 'hidden';
  };

  // Cerrar lightbox
  const closeLightbox = () => {
    setSelectedIndex(null);
    document.body.style.overflow = 'auto';
  };

  // Navegación de imágenes
  const navigateImage = (direction: 'prev' | 'next', e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (selectedIndex === null) return;

    const newIndex =
      direction === 'next'
        ? (selectedIndex + 1) % luxuryImages.length
        : (selectedIndex - 1 + luxuryImages.length) % luxuryImages.length;

    setSelectedIndex(newIndex);
  };

  // Manejar teclas en el lightbox
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') navigateImage('next');
    if (e.key === 'ArrowLeft') navigateImage('prev');
    if (e.key === 'Escape') closeLightbox();
  };

  // Variantes de animación para la página de carga
  const loaderVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { duration: 0.5 },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.5 },
    },
  };

  // Variantes de animación para las imágenes
  const imageVariants = {
    initial: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: i * 0.15,
        ease: [0.645, 0.045, 0.355, 1.0],
      },
    }),
  };

  // Variantes para elementos del lightbox
  const lightboxVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className='relative mt-10 mb-10'>
      {/* Section title and description */}
      <div className='text-center mb-10'>
        {/* <h2 className='text-3xl md:text-4xl font-light text-gray-900 mb-4'> */}
        <h2 className='text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight'>
          {t('common.gallery.title')}
        </h2>
        <div className='w-16 h-px bg-amber-400 mx-auto mb-4'></div>
        {/* <p className='max-w-2xl mx-auto text-gray-600'> */}
        <p className='max-w-2xl mx-auto text-white'>
          {' '}
          {t('common.gallery.subtitle')}
        </p>
      </div>

      {/* Loader elegante */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            variants={loaderVariants}
            initial='initial'
            animate='animate'
            exit='exit'
            className='absolute inset-0 bg-white z-10 flex items-center justify-center'
          >
            <div className='flex flex-col items-center'>
              <div className='w-12 h-12 rounded-full border-2 border-transparent border-t-gray-500 border-r-gray-500 animate-spin mb-4'></div>
              <span className='text-gray-500 font-light tracking-wider uppercase text-sm'>
                Curating Experiences
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* More compact grid with reduced height */}
      <div className='grid grid-cols-1 md:grid-cols-6 gap-3 md:gap-3 auto-rows-auto'>
        {luxuryImages.slice(0, 6).map(
          (
            image,
            index // Only showing first 6 images for a more compact layout
          ) => (
            <motion.div
              key={index}
              custom={index}
              variants={imageVariants}
              initial='initial'
              whileInView='visible'
              viewport={{ once: true, margin: '-50px' }}
              className={`
              relative group cursor-pointer overflow-hidden rounded-sm bg-gray-50
              transition-transform duration-700 ease-out
              ${
                index === 0
                  ? 'md:col-span-3 md:row-span-1 aspect-[3/1.5]'
                  : index === 1
                  ? 'md:col-span-3 md:row-span-1 aspect-[3/1.5]'
                  : index === 2
                  ? 'md:col-span-2 md:row-span-1 aspect-[2/1.5]'
                  : index === 3
                  ? 'md:col-span-2 md:row-span-1 aspect-[2/1.5]'
                  : index === 4
                  ? 'md:col-span-2 md:row-span-1 aspect-[2/1.5]'
                  : 'md:col-span-2 md:row-span-1 aspect-[2/1.5]'
              }
              ${index === 0 ? 'md:col-start-1' : ''}
              ${index === 1 ? 'md:col-start-4' : ''}
              ${index === 2 ? 'md:col-start-1' : ''}
              ${index === 3 ? 'md:col-start-3' : ''}
              ${index === 4 ? 'md:col-start-5' : ''}
            `}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => openLightbox(index)}
            >
              {/* Efecto de carga sutil para cada imagen */}
              <div
                className='absolute inset-0 bg-gray-100 animate-pulse'
                style={{
                  animationDuration: '2s',
                  opacity: isLoading ? 1 : 0,
                  transition: 'opacity 0.5s ease-out',
                }}
              ></div>

              {/* Imagen con ratio de aspecto apropiado */}
              <div className='relative w-full h-full'>
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                  className={`
                  object-cover transition-transform duration-1000 ease-out
                  ${hoveredIndex === index ? 'scale-[1.05]' : 'scale-100'}
                `}
                  priority={index < 2}
                />

                {/* Overlay sofisticado */}
                <div
                  className={`
                absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent
                transition-opacity duration-500 
                ${hoveredIndex === index ? 'opacity-100' : 'opacity-0'}
              `}
                ></div>

                {/* Información de imagen con efecto fade */}
                <div
                  className={`
                absolute bottom-0 left-0 right-0 p-4 z-10
                transform transition-all duration-500 ease-out
                ${
                  hoveredIndex === index
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-4 opacity-0'
                }
              `}
                >
                  <div className='text-white'>
                    {image.category && (
                      <span className='block text-xs uppercase tracking-wider text-white/70 mb-1 font-light'>
                        {image.category}
                      </span>
                    )}
                    <h3 className='text-lg font-light mb-1 line-clamp-1'>
                      {image.alt}
                    </h3>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        )}
      </div>

      {/* Lightbox mejorado - sin cambios */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            variants={lightboxVariants}
            initial='initial'
            animate='animate'
            exit='exit'
            className='fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center'
            onClick={closeLightbox}
            onKeyDown={handleKeyDown}
            tabIndex={0}
          >
            <div
              className='relative max-w-6xl w-full h-full flex flex-col items-center justify-center px-4 sm:px-10'
              onClick={(e) => e.stopPropagation()}
            >
              {/* Imagen actual con animación mejorada */}
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 30,
                }}
                className='relative w-full max-h-[75vh] h-auto'
              >
                <div className='relative w-full h-full overflow-hidden'>
                  <Image
                    src={luxuryImages[selectedIndex].src}
                    alt={luxuryImages[selectedIndex].alt}
                    width={1920}
                    height={1080}
                    className='mx-auto max-h-[75vh] w-auto h-auto object-contain'
                  />
                </div>

                {/* Efecto de borde sutil */}
                <div className='absolute inset-0 border border-white/10 pointer-events-none'></div>
              </motion.div>

              {/* Información de imagen mejorada */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ delay: 0.2 }}
                className='mt-8 text-white text-center max-w-2xl'
              >
                {luxuryImages[selectedIndex].category && (
                  <span className='block text-sm uppercase tracking-wider text-white/60 mb-2 font-light'>
                    {luxuryImages[selectedIndex].category}
                  </span>
                )}
                <h3 className='text-2xl font-light mb-2'>
                  {luxuryImages[selectedIndex].alt}
                </h3>
                <p className='text-base text-white/80 font-extralight'>
                  {luxuryImages[selectedIndex].description}
                </p>
              </motion.div>

              {/* Controles de navegación mejorados */}
              <div className='absolute inset-x-0 top-1/2 transform -translate-y-1/2 flex justify-between px-4 sm:px-10'>
                <button
                  onClick={(e) => navigateImage('prev', e)}
                  className='w-12 h-12 flex items-center justify-center text-white/70 hover:text-white transition-colors bg-black/20 backdrop-blur-sm hover:bg-black/30 rounded-full'
                  aria-label='Previous image'
                >
                  <ChevronLeft size={28} />
                </button>
                <button
                  onClick={(e) => navigateImage('next', e)}
                  className='w-12 h-12 flex items-center justify-center text-white/70 hover:text-white transition-colors bg-black/20 backdrop-blur-sm hover:bg-black/30 rounded-full'
                  aria-label='Next image'
                >
                  <ChevronRight size={28} />
                </button>
              </div>

              {/* Botón de cierre refinado */}
              <button
                onClick={closeLightbox}
                className='absolute top-6 right-6 w-10 h-10 flex items-center justify-center text-white/70 hover:text-white transition-colors bg-black/20 backdrop-blur-sm hover:bg-black/30 rounded-full'
                aria-label='Close'
              >
                <X size={20} />
              </button>

              {/* Navegación de miniaturas en la parte inferior */}
              <div className='absolute bottom-6 left-0 right-0 flex justify-center space-x-2 overflow-x-auto py-4 px-6'>
                {luxuryImages.map((image, index) => (
                  <div
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedIndex(index);
                    }}
                    className={`
                      relative w-16 h-10 cursor-pointer overflow-hidden rounded-sm transition-all duration-300
                      ${
                        selectedIndex === index
                          ? 'ring-2 ring-white'
                          : 'opacity-50 hover:opacity-80'
                      }
                    `}
                  >
                    <Image
                      src={image.src}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      sizes='64px'
                      className='object-cover'
                    />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LuxeGallery;
