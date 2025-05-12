import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock, Users } from 'lucide-react';
import { Service } from '@/types/type';
import { DailyActivity } from '@/constants/dayplanner';
import Image from 'next/image';

interface ServiceSliderProps {
  services: Service[];
  currentDayActivities: DailyActivity[];
  onServiceSelect: (service: Service) => void;
  title: React.ReactNode; // Cambiado a ReactNode para permitir JSX
  className?: string;
}

export const ServiceSlider: React.FC<ServiceSliderProps> = ({
  services,
  currentDayActivities,
  onServiceSelect,
  title,
  className = '',
}) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3); // Número de tarjetas visibles

  const checkScrollButtons = () => {
    const slider = sliderRef.current;
    if (!slider) return;

    setCanScrollLeft(slider.scrollLeft > 10);
    setCanScrollRight(
      slider.scrollLeft < slider.scrollWidth - slider.clientWidth - 10
    );

    // Calcular cuántas tarjetas son visibles basado en el ancho
    const cardWidth = slider.querySelector('.service-card')?.clientWidth || 272;
    const visibleCards = Math.floor(slider.clientWidth / cardWidth);
    setVisibleCount(Math.max(1, visibleCards));
  };

  useEffect(() => {
    checkScrollButtons();
    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener('scroll', checkScrollButtons);
    }

    window.addEventListener('resize', checkScrollButtons);

    return () => {
      if (slider) {
        slider.removeEventListener('scroll', checkScrollButtons);
      }
      window.removeEventListener('resize', checkScrollButtons);
    };
  }, [services]);

  useEffect(() => {
    checkScrollButtons();
  }, [services]);

  const scroll = (direction: 'left' | 'right') => {
    if (!sliderRef.current) return;

    const slider = sliderRef.current;
    const cardWidth = slider.querySelector('.service-card')?.clientWidth || 272;
    const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;

    slider.scrollBy({
      left: scrollAmount * Math.max(1, visibleCount - 1),
      behavior: 'smooth',
    });
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/img/placeholder-service.jpg';
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25,
      },
    },
    hover: {
      y: -10,
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
      transition: { duration: 0.3 },
    },
  };

  const isServiceAdded = (serviceId: string) => {
    return currentDayActivities.some(
      (activity) => activity.serviceId === serviceId
    );
  };

  if (services.length === 0) {
    return null; // No mostrar el slider si no hay servicios
  }

  return (
    <div className={`relative mb-10 ${className}`}>
      {/* Header con título y botones de navegación */}
      <div className='flex justify-between items-center mb-5'>
        <h3 className='text-xl font-semibold text-gray-800'>{title}</h3>

        <div className='flex space-x-2'>
          <motion.button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={`p-2 rounded-full ${
              canScrollLeft
                ? 'bg-white text-gray-700 shadow-md hover:bg-gray-50'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
            whileHover={canScrollLeft ? { scale: 1.05 } : {}}
            whileTap={canScrollLeft ? { scale: 0.95 } : {}}
          >
            <ChevronLeft className='h-5 w-5' />
          </motion.button>

          <motion.button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={`p-2 rounded-full ${
              canScrollRight
                ? 'bg-white text-gray-700 shadow-md hover:bg-gray-50'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
            whileHover={canScrollRight ? { scale: 1.05 } : {}}
            whileTap={canScrollRight ? { scale: 0.95 } : {}}
          >
            <ChevronRight className='h-5 w-5' />
          </motion.button>
        </div>
      </div>

      {/* Contador de servicios */}
      <div className='absolute top-0 right-24 bg-blue-100 text-blue-800 text-xs font-medium rounded-full px-2.5 py-0.5'>
        {services.length} {services.length === 1 ? 'servicio' : 'servicios'}
      </div>

      {/* Slider de tarjetas de servicios */}
      <div
        ref={sliderRef}
        className='flex overflow-x-auto pb-4 scrollbar-hide scroll-smooth'
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className='flex space-x-4 px-1'>
          {services.map((service) => {
            const isAdded = isServiceAdded(service.id);

            return (
              <motion.div
                key={service.id}
                className='service-card flex-shrink-0 w-72 rounded-xl overflow-hidden shadow-md bg-white border border-gray-100'
                variants={cardVariants}
                initial='hidden'
                animate='visible'
                whileHover='hover'
                onClick={() => onServiceSelect(service)}
              >
                <div className='h-40 relative overflow-hidden'>
                  <Image
                    src={service.img || `/images/services/${service.id}.jpg`}
                    alt={service.name}
                    fill
                    className='object-cover transform transition-transform hover:scale-105 duration-500'
                    onError={handleImageError}
                    unoptimized={service.img?.startsWith('http')}
                  />

                  {isAdded && (
                    <div className='absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 rounded-bl-lg font-medium text-sm'>
                      Agregado
                    </div>
                  )}

                  {service.packageType.includes('premium') && (
                    <div className='absolute top-0 left-0 bg-amber-500 text-white px-3 py-1 rounded-br-lg font-medium text-sm'>
                      Premium
                    </div>
                  )}
                </div>

                <div className='p-4'>
                  <h4 className='font-semibold text-lg text-gray-900 mb-1'>
                    {service.name}
                  </h4>
                  <p className='text-gray-600 text-sm mb-3 line-clamp-2'>
                    {service.description}
                  </p>

                  <div className='flex justify-between items-center'>
                    <div className='flex space-x-2 text-xs text-gray-500'>
                      <span className='flex items-center'>
                        <Clock className='h-3 w-3 mr-1 text-blue-500' />
                        {service.duration}h
                      </span>
                      <span className='flex items-center'>
                        <Users className='h-3 w-3 mr-1 text-purple-500' />
                        {service.maxGuests || 10}
                      </span>
                    </div>
                    <span className='text-blue-600 font-bold'>
                      ${service.price}
                    </span>
                  </div>

                  <button
                    className={`w-full mt-3 px-4 py-1.5 rounded-lg text-sm font-medium ${
                      isAdded
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    {isAdded ? 'Ya agregado' : 'Seleccionar'}
                  </button>
                </div>
              </motion.div>
            );
          })}

          {/* Tarjeta para mostrar cuando no hay suficientes servicios */}
          {services.length < 3 && (
            <motion.div
              className='service-card flex-shrink-0 w-72 h-64 rounded-xl overflow-hidden shadow-md bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 flex items-center justify-center'
              variants={cardVariants}
              initial='hidden'
              animate='visible'
            >
              <div className='text-center p-6'>
                <div className='bg-white h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm'>
                  <ChevronRight className='h-6 w-6 text-blue-500' />
                </div>
                <h4 className='font-semibold text-lg text-blue-700 mb-2'>
                  Más servicios
                </h4>
                <p className='text-blue-600 text-sm'>
                  Explora más categorías para descubrir experiencias adicionales
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
