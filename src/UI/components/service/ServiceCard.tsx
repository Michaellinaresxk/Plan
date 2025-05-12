'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Service, BookingDate } from '@/types/type';
import {
  Plus,
  Check,
  ArrowRight,
  Clock,
  DollarSign,
  Sparkles,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/client';
import { useLanguage } from '@/lib/i18n/client';
import Image from 'next/image';
import BookingModal from '../modal/BookingModal';

interface ServiceCardProps {
  service: Service;
  isSelected: boolean;
  packageType: 'standard' | 'premium';
  onToggle: (service: Service) => void;
  onBookService: (service: Service, dates: BookingDate, guests: number) => void;
  viewContext?: 'standard-view' | 'premium-view';
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  isSelected,
  packageType,
  onToggle,
  onBookService,
  viewContext,
}) => {
  const { t } = useTranslation();
  const [language] = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Determine the style context
  const styleContext =
    viewContext ||
    (packageType === 'premium' ? 'premium-view' : 'standard-view');
  const isPremiumStyle = styleContext === 'premium-view';

  // Helper function to get translation path
  const getTranslationPath = (serviceId: string) => {
    const type = serviceId.startsWith('luxe-') ? 'premium' : 'standard';
    let key = serviceId.replace(/^luxe-/, '');
    key = key.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    return `services.${type}.${key}`;
  };

  // Get the translation path for this service
  const translationPath = getTranslationPath(service.id);

  // Handle potential image errors
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    e.currentTarget.src = '/images/placeholder-service.jpg';
  };

  // Handle booking a service
  const handleBookingConfirm = (
    service: Service,
    dates: BookingDate,
    guests: number
  ) => {
    onBookService(service, dates, guests);
    setIsModalOpen(false);
  };

  // ESTILO PREMIUM (LUXURY)
  if (isPremiumStyle) {
    return (
      <>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{
            y: -8,
            transition: { duration: 0.3 },
          }}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          className='relative rounded-xl overflow-hidden transition-all duration-300 border border-amber-500/30 shadow-[0_10px_40px_-5px_rgba(0,0,0,0.5),0_0_15px_-3px_rgba(251,191,36,0.4)]'
        >
          {/* Dark elegant background */}
          <div className='absolute inset-0 bg-gradient-to-br from-gray-900/90 via-gray-800/90 to-gray-900/90 z-0'></div>

          {/* Luxury accent glows */}
          <div className='absolute -top-24 -right-24 w-48 h-48 rounded-full bg-amber-500/20 blur-3xl z-0'></div>
          <div className='absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-amber-500/10 blur-3xl z-0'></div>
          <div className='absolute top-1/4 left-0 w-full h-32 bg-gradient-to-r from-amber-500/0 via-amber-500/10 to-amber-500/0 rotate-12 blur-3xl z-0'></div>

          {/* Subtle animated shine effect */}
          <motion.div
            className='absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent z-0'
            animate={{
              x: ['-100%', '200%'],
              opacity: [0, 0.05, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 5,
              ease: 'linear',
            }}
          />

          {/* Glow effect when selected */}
          {isSelected && (
            <div className='absolute inset-0 z-0 blur-3xl rounded-full scale-75 opacity-60 bg-amber-400/40' />
          )}

          {/* Image Section */}
          <div className='h-64 relative overflow-hidden'>
            {/* Loading placeholder */}
            <div className='absolute inset-0 bg-gray-200 animate-pulse z-10'></div>

            {/* Main image */}
            <Image
              src={service.img || `/images/services/${service.id}.jpg`}
              alt={t(`${translationPath}.name`, { fallback: service.name })}
              width={400}
              height={240}
              className={`w-full h-full object-cover transition-transform duration-700 relative z-20 ${
                isHovered ? 'scale-110' : 'scale-100'
              }`}
              onError={handleImageError}
              unoptimized={service.img?.startsWith('http')}
              priority={true}
            />

            {/* Gradient overlay for text contrast */}
            <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-30'></div>

            {/* Premium badge */}
            <div className='absolute top-4 right-4 z-50'>
              <div className='flex items-center px-3 py-1.5 rounded-full backdrop-blur-xl bg-amber-500/40 border border-amber-400/30 shadow-lg'>
                <Sparkles size={14} className='text-amber-300 mr-1.5' />
                <span className='text-xs font-semibold tracking-wide text-white'>
                  PREMIUM
                </span>
              </div>
            </div>

            {/* Service badge */}
            <div className='absolute top-4 left-4 z-50'>
              <span className='px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-xl bg-black/40 text-amber-300 border border-amber-500/30 shadow-lg'>
                {service.duration > 0 && (
                  <Clock size={12} className='inline-block mr-1.5' />
                )}
                {service.duration > 0
                  ? `${service.duration}h Experience`
                  : 'Experience'}
              </span>
            </div>

            {/* Price tag */}
            <div className='absolute bottom-4 right-4 z-50'>
              <span className='px-3 py-1.5 rounded-full text-sm font-bold backdrop-blur-xl flex items-center bg-amber-600/50 text-white border border-amber-500/50 shadow-lg'>
                <DollarSign size={14} className='mr-0.5' />
                {service.price}
              </span>
            </div>
          </div>

          {/* Title and description with premium blur overlay */}
          <div className='relative z-40 px-1 -mt-12'>
            <div className='mx-4 p-5 rounded-xl backdrop-blur-xl border bg-black/40 border-amber-500/20 shadow-lg'>
              <h3 className='text-xl font-bold mb-2 text-white'>
                {t(`${translationPath}.name`, { fallback: service.name })}
              </h3>

              <p className='mb-4 h-12 line-clamp-2 text-sm text-gray-200'>
                {t(`${translationPath}.short`, {
                  fallback: service.description,
                })}
              </p>

              <div className='flex flex-col gap-3 mt-6'>
                <Link
                  href={`/service/${service.id}`}
                  className='group inline-flex items-center justify-center w-full py-2.5 px-4 rounded-lg font-medium transition-all duration-300 text-sm bg-amber-500 text-white hover:bg-amber-600 shadow-md'
                >
                  {t('services.actions.details', { fallback: 'View Details' })}
                  <ArrowRight
                    size={16}
                    className='ml-2 transition-transform duration-300 group-hover:translate-x-1'
                  />
                </Link>

                {/* Book service button */}
                <button
                  onClick={() => setIsModalOpen(true)}
                  className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center transition-all duration-300 
                    ${
                      isSelected
                        ? 'bg-amber-500 text-white hover:bg-amber-600 border border-amber-400/30'
                        : 'bg-amber-500 text-white hover:bg-amber-600 border border-amber-400/30'
                    }`}
                >
                  {isSelected ? (
                    <>
                      <Check size={18} className='mr-2' />
                      {t('services.actions.selected', {
                        fallback: 'Update Booking',
                      })}
                    </>
                  ) : (
                    <>
                      <Plus size={18} className='mr-2' />
                      {t('services.actions.addToBooking', {
                        fallback: 'Book Now',
                      })}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Booking Modal */}
        <BookingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleBookingConfirm}
          service={service}
        />
      </>
    );
  }
  // ESTILO STANDARD
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{
          y: -8,
          transition: { duration: 0.3 },
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className='relative rounded-xl overflow-hidden transition-all duration-300 shadow-lg'
        style={{
          background:
            'linear-gradient(135deg, rgba(255, 255, 255, 0.65), rgba(255, 255, 255, 0.35))',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.7)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
        }}
      >
        {/* Color highlight effects */}
        <>
          <div className='absolute -top-20 -right-20 w-40 h-40 rounded-full bg-blue-500/20 blur-3xl'></div>
          <div className='absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-blue-400/10 blur-3xl'></div>
        </>

        {/* Glow effect when selected */}
        {isSelected && (
          <div className='absolute inset-0 -z-10 blur-3xl rounded-full scale-75 opacity-60 bg-blue-400/40' />
        )}

        {/* Image Section */}
        <div className='h-56 relative overflow-hidden'>
          {/* Loading placeholder */}
          <div className='absolute inset-0 bg-gray-200 animate-pulse'></div>

          {/* Main image */}
          <Image
            src={service.img || `/images/services/${service.id}.jpg`}
            alt={t(`${translationPath}.name`, { fallback: service.name })}
            width={400}
            height={240}
            className={`w-full h-full object-cover transition-transform duration-700 relative z-10 ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
            onError={handleImageError}
            unoptimized={service.img?.startsWith('http')}
            priority={true}
          />

          {/* Gradient overlay for text contrast */}
          <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-20'></div>

          {/* Service badge */}
          <div className='absolute top-3 left-3 z-30'>
            <span className='px-3 py-1 rounded-full text-xs font-medium bg-blue-500/50 backdrop-blur-xl text-white border border-blue-400/30'>
              Standard
            </span>
          </div>

          {/* Price and duration info */}
          <div className='absolute top-3 right-3 z-30 flex space-x-2'>
            <span className='px-2 py-1 rounded-full text-xs font-medium bg-black/30 backdrop-blur-xl border border-white/10 text-white flex items-center'>
              <DollarSign size={12} className='mr-0.5' />
              {service.price}
            </span>

            {service.duration > 0 && (
              <span className='px-2 py-1 rounded-full text-xs font-medium bg-black/30 backdrop-blur-xl border border-white/10 text-white flex items-center'>
                <Clock size={12} className='mr-0.5' />
                {service.duration}h
              </span>
            )}
          </div>

          {/* Service name overlay */}
          <div className='absolute bottom-0 left-0 right-0 p-4 z-30'>
            <h3 className='text-xl font-bold text-white drop-shadow-md'>
              {t(`${translationPath}.name`, { fallback: service.name })}
            </h3>
          </div>
        </div>

        {/* Content section with styled blur background */}
        <div className='p-5 relative backdrop-blur-md z-20 text-gray-800'>
          <p className='mb-4 h-12 line-clamp-2 text-sm text-gray-700'>
            {t(`${translationPath}.short`, { fallback: service.description })}
          </p>

          <div className='flex flex-col gap-3 mt-6'>
            {/* View details button */}
            <Link
              href={`/service/${service.id}`}
              className='inline-flex items-center justify-center w-full py-2.5 px-4 rounded-lg font-medium transition-all duration-300 text-sm bg-white/30 hover:bg-white/50 text-gray-900 backdrop-blur-md border border-white/50'
            >
              {t('services.actions.details', { fallback: 'View Details' })}
              <ArrowRight
                size={16}
                className='ml-2 transition-transform duration-300'
              />
            </Link>

            {/* Book service button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center transition-all duration-300 backdrop-blur-md
                ${
                  isSelected
                    ? 'bg-blue-500/90 text-white hover:bg-blue-600/90 border border-blue-400/50'
                    : 'bg-gray-900/90 text-white hover:bg-black/90 border border-gray-700/50'
                }`}
            >
              {isSelected ? (
                <>
                  <Check size={18} className='mr-2' />
                  {t('services.actions.selected', {
                    fallback: 'Update Booking',
                  })}
                </>
              ) : (
                <>
                  <Plus size={18} className='mr-2' />
                  {t('services.actions.addToBooking', {
                    fallback: 'Book Now',
                  })}
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleBookingConfirm}
        service={service}
      />
    </>
  );
};

export default ServiceCard;
