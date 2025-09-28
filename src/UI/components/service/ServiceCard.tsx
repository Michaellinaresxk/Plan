'use client';
import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  ArrowUpRight,
  Clock,
  Star,
  Plus,
  CalendarDays,
  Check,
  Crown,
} from 'lucide-react';
import Image from 'next/image';
import BookingModal from '../modal/BookingModal';
import { useTranslation } from '@/lib/i18n/client';

// Custom hooks for cleaner component logic
const useServiceCard = (service: ServiceCardProps['service']) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const isInView = useInView(cardRef, {
    once: true,
    margin: '0px 0px -50px 0px',
  });

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(service.price);

  return {
    isModalOpen,
    setIsModalOpen,
    isHovered,
    setIsHovered,
    imageLoaded,
    setImageLoaded,
    cardRef,
    isInView,
    formattedPrice,
  };
};

// Animation configurations
const ANIMATIONS = {
  card: {
    initial: { opacity: 0, y: 30, scale: 0.95 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
    },
    hover: {
      y: -8,
      scale: 1.01,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
  },
  image: {
    hover: { scale: 1.05, transition: { duration: 0.6 } },
    normal: { scale: 1, transition: { duration: 0.6 } },
  },
  glow: {
    animate: (isActive: boolean) => ({
      opacity: isActive ? 1 : 0,
      scale: isActive ? 1 : 0.9,
      transition: { duration: 0.4 },
    }),
  },
};

// Size configurations
const SIZES = {
  compact: {
    imageHeight: 'h-48',
    padding: 'p-6',
    title: 'text-xl',
    description: 'text-sm',
    button: 'py-2.5 px-4 text-sm',
  },
  standard: {
    imageHeight: 'h-56',
    padding: 'p-6',
    title: 'text-xl',
    description: 'text-base',
    button: 'py-3 px-5',
  },
  large: {
    imageHeight: 'h-64',
    padding: 'p-8',
    title: 'text-2xl',
    description: 'text-base',
    button: 'py-4 px-6',
  },
};

interface ServiceCardProps {
  service: {
    id: string;
    name: string;
    description: string;
    img?: string;
    price: number;
    duration: number;
  };
  servicePath: string;
  isSelected: boolean;
  packageType: 'standard' | 'premium';
  onToggle: (service: any) => void;
  onBookService: (service: any, dates: any, guests: number) => void;
  viewContext?: 'standard-view' | 'premium-view';
  size?: 'compact' | 'standard' | 'large';
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  servicePath,
  isSelected,
  packageType,
  onBookService,
  viewContext,
  size = 'standard',
}) => {
  const { t } = useTranslation();
  const {
    isModalOpen,
    setIsModalOpen,
    isHovered,
    setIsHovered,
    imageLoaded,
    setImageLoaded,
    cardRef,
    isInView,
  } = useServiceCard(service);

  const sizeConfig = SIZES[size];
  const isPremiumStyle =
    viewContext === 'premium-view' || packageType === 'premium';

  const getTranslationPath = (serviceId: string) => {
    const type = serviceId.startsWith('luxe-') ? 'premium' : 'standard';
    let key = serviceId.replace(/^luxe-/, '');
    key = key.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    return `services.${type}.${key}`;
  };

  const translationPath = getTranslationPath(service.id);

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    e.currentTarget.src = '/images/placeholder-service.jpg';
  };

  const handleBookingConfirm = (service: any, dates: any, guests: number) => {
    onBookService(service, dates, guests);
    setIsModalOpen(false);
  };

  if (isPremiumStyle) {
    return (
      <>
        <motion.div
          ref={cardRef}
          {...ANIMATIONS.card}
          animate={isInView ? ANIMATIONS.card.animate : ANIMATIONS.card.initial}
          whileHover={ANIMATIONS.card.hover}
          className='relative group overflow-hidden cursor-pointer'
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
        >
          {/* Simplified Glow Effect - NO MORE SPINNING! */}
          <motion.div
            {...ANIMATIONS.glow}
            animate={ANIMATIONS.glow.animate(isSelected || isHovered)}
            className='absolute -inset-3 bg-gradient-to-r from-amber-500/20 via-orange-500/30 to-amber-500/20 rounded-2xl blur-lg'
          />

          <Link href={`/${servicePath}/${service.id}`}>
            {/* Main Card Container - Smaller size */}
            <div className='relative bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl overflow-hidden border border-amber-500/20 shadow-xl'>
              {/* Service Image - Reduced height */}
              <div
                className={`relative ${sizeConfig.imageHeight} overflow-hidden`}
              >
                {/* Premium Badge - Smaller */}
                <motion.div
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: 'spring', damping: 15 }}
                  className='absolute top-4 right-4 z-30'
                >
                  <div className='flex items-center px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-amber-400/40'>
                    <Crown className='text-amber-400 mr-1.5 h-3 w-3' />
                    <span className='text-xs font-bold uppercase tracking-wider text-amber-300'>
                      Premium
                    </span>
                  </div>
                </motion.div>

                {/* Loading State */}
                <motion.div
                  animate={{ opacity: imageLoaded ? 0 : 1 }}
                  className='absolute inset-0 bg-gradient-to-br from-gray-800 to-black z-10 flex items-center justify-center'
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                    className='w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full'
                  />
                </motion.div>

                {/* Main Image */}
                <motion.div
                  animate={
                    isHovered ? ANIMATIONS.image.hover : ANIMATIONS.image.normal
                  }
                  className='relative w-full h-full'
                >
                  <Link href={`/${servicePath}/${service.id}`}>
                    <Image
                      src={service.img || `/images/services/${service.id}.jpg`}
                      alt={t(`${translationPath}.name`, {
                        fallback: service.name,
                      })}
                      fill
                      sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                      className='object-cover z-20'
                      onLoad={() => setImageLoaded(true)}
                      onError={handleImageError}
                      priority={true}
                    />
                  </Link>
                </motion.div>

                {/* Simplified gradient overlay */}
                <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-25' />

                {/* Subtle hover effect */}
                <motion.div
                  animate={{ opacity: isHovered ? 0.15 : 0 }}
                  transition={{ duration: 0.4 }}
                  className='absolute inset-0 bg-gradient-to-br from-amber-500/30 to-orange-500/20 z-24'
                />
              </div>

              {/* Service Content - Reduced padding */}
              <div className={sizeConfig.padding}>
                {/* Selection Indicator - Smaller */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      transition={{ type: 'spring', damping: 15 }}
                      className='absolute -top-10 right-6 z-40'
                    >
                      <div className='w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg'>
                        <Check className='text-black h-4 w-4 font-bold' />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Service Title - Smaller */}
                <h3
                  className={`${sizeConfig.title} font-bold mb-3 text-white tracking-tight group-hover:text-amber-100 transition-colors duration-300`}
                >
                  {t(`${translationPath}.name`, { fallback: service.name })}
                </h3>

                {/* Service Details - Compact */}
                <div className='flex items-center text-gray-400 mb-4 space-x-3'>
                  <div className='flex items-center bg-amber-500/10 rounded-full px-3 py-1.5 border border-amber-500/20'>
                    <Clock className='h-3 w-3 mr-1.5 text-amber-400' />
                    <span className='text-xs font-semibold text-amber-300'>
                      {service.duration}h
                    </span>
                  </div>
                  <div className='flex items-center bg-amber-500/10 rounded-full px-3 py-1.5 border border-amber-500/20'>
                    <CalendarDays className='h-3 w-3 mr-1.5 text-amber-400' />
                    <span className='text-xs font-semibold text-amber-300'>
                      Flexible
                    </span>
                  </div>
                </div>

                {/* Service Description - Compact */}
                <p
                  className={`mb-5 text-gray-300 leading-relaxed line-clamp-2 ${sizeConfig.description}`}
                >
                  {t(`${translationPath}.short`, {
                    fallback: service.description,
                  })}
                </p>

                {/* Action Buttons - Compact */}
                <div className='grid grid-cols-1 gap-3'>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`${
                      sizeConfig.button
                    } flex items-center justify-center font-semibold rounded-xl transition-all duration-300 shadow-lg ${
                      isSelected
                        ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-black'
                        : 'bg-gradient-to-r from-amber-500 to-orange-500 text-black'
                    }`}
                  >
                    {/* <span className='flex items-center'>
                      Details
                      <ArrowUpRight size={14} className='ml-1.5' />
                    </span> */}
                    <span className='flex items-center'>
                      Details
                      <ArrowUpRight size={14} className='ml-1.5' />
                    </span>
                  </motion.div>
                </div>
              </div>

              {/* Bottom accent */}
              <div className='absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-500/60 to-transparent' />
            </div>
          </Link>
        </motion.div>

        <AnimatePresence>
          {isModalOpen && (
            <BookingModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onConfirm={handleBookingConfirm}
              service={service}
            />
          )}
        </AnimatePresence>
      </>
    );
  }

  // Standard card design - Also more compact
  return (
    <>
      <motion.div
        ref={cardRef}
        {...ANIMATIONS.card}
        animate={isInView ? ANIMATIONS.card.animate : ANIMATIONS.card.initial}
        whileHover={ANIMATIONS.card.hover}
        className='relative group overflow-hidden cursor-pointer'
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        {/* Glow Effect */}
        <motion.div
          {...ANIMATIONS.glow}
          animate={ANIMATIONS.glow.animate(isSelected || isHovered)}
          className='absolute -inset-3 bg-gradient-to-r from-blue-500/15 via-cyan-500/20 to-blue-500/15 rounded-2xl blur-lg'
        />
        <Link href={`/${servicePath}/${service.id}`}>
          {/* Main Card */}
          <div className='relative bg-gradient-to-br from-white to-gray-50 rounded-2xl overflow-hidden border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-400'>
            {/* Service Image */}
            <div
              className={`relative ${sizeConfig.imageHeight} overflow-hidden`}
            >
              {/* Standard Badge
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring' }}
              className='absolute top-4 right-4 z-30'
            >
              <div className='flex items-center px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm border border-blue-200 shadow-md'>
                <Star className='text-blue-500 mr-1.5 h-3 w-3' />
                <span className='text-xs font-bold uppercase tracking-wider text-blue-600'>
                  Standard
                </span>
              </div>
            </motion.div> */}

              {/* Loading State */}
              <motion.div
                animate={{ opacity: imageLoaded ? 0 : 1 }}
                className='absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-100 z-10 flex items-center justify-center'
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  className='w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full'
                />
              </motion.div>

              {/* Main Image */}

              <motion.div
                animate={
                  isHovered ? ANIMATIONS.image.hover : ANIMATIONS.image.normal
                }
                className='relative w-full h-full'
              >
                <Image
                  src={service.img || `/images/services/${service.id}.jpg`}
                  alt={t(`${translationPath}.name`, { fallback: service.name })}
                  fill
                  sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                  className='object-cover z-20'
                  onLoad={() => setImageLoaded(true)}
                  onError={handleImageError}
                  priority={true}
                />
              </motion.div>

              {/* Overlay */}
              <div className='absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent z-25' />
            </div>

            {/* Service Content */}
            <div className={sizeConfig.padding}>
              {/* Selection Indicator */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    className='absolute -top-8 right-6 z-40'
                  >
                    <div className='w-7 h-7 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center shadow-md'>
                      <Check className='text-white h-3 w-3' />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Service Title */}
              <h3
                className={`${sizeConfig.title} font-bold mb-3 text-gray-900 tracking-tight group-hover:text-blue-600 transition-colors duration-300`}
              >
                {t(`${translationPath}.name`, { fallback: service.name })}
              </h3>

              {/* Service Details */}
              <div className='flex items-center text-gray-500 mb-4 space-x-3'>
                <div className='flex items-center bg-blue-50 rounded-full px-3 py-1.5 border border-blue-100'>
                  <Clock className='h-3 w-3 mr-1.5 text-blue-500' />
                  <span className='text-xs font-semibold text-blue-600'>
                    {service.duration}h
                  </span>
                </div>
                <div className='flex items-center bg-blue-50 rounded-full px-3 py-1.5 border border-blue-100'>
                  <CalendarDays className='h-3 w-3 mr-1.5 text-blue-500' />
                  <span className='text-xs font-semibold text-blue-600'>
                    Flexible
                  </span>
                </div>
              </div>

              {/* Service Description */}
              <p
                className={`mb-5 text-gray-600 leading-relaxed line-clamp-2 ${sizeConfig.description}`}
              >
                {t(`${translationPath}.short`, {
                  fallback: service.description,
                })}
              </p>

              {/* Action Buttons */}
              <div className='grid grid-cols-1 gap-3'>
                <Link href={`/${servicePath}/${service.id}`}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`${
                      sizeConfig.button
                    } flex items-center justify-center font-semibold rounded-xl transition-all duration-300 shadow-md ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    <span className='flex items-center'>
                      {t(`common.button.details`)}
                      <ArrowUpRight size={14} className='ml-1.5' />
                    </span>
                  </motion.div>
                </Link>

                {/* <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsModalOpen(true)}
                className={`${
                  sizeConfig.button
                } flex items-center justify-center font-semibold rounded-xl transition-all duration-300 shadow-md ${
                  isSelected
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {isSelected ? (
                  <>
                    <Check size={14} className='mr-1.5' />
                    <span>Selected</span>
                  </>
                ) : (
                  <>
                    <Plus size={14} className='mr-1.5' />
                    <span>Book</span>
                  </>
                )}
              </motion.button> */}
              </div>
            </div>

            {/* Bottom accent */}
            {/* <div className='absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500/60 to-transparent' /> */}
          </div>
        </Link>
      </motion.div>

      <AnimatePresence>
        {isModalOpen && (
          <BookingModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConfirm={handleBookingConfirm}
            service={service}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default ServiceCard;
