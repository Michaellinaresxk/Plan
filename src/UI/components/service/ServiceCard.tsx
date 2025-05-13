'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Service, BookingDate } from '@/types/type';
import {
  ArrowUpRight,
  Clock,
  DollarSign,
  Sparkles,
  Star,
  Plus,
  Diamond,
  CalendarDays,
  Check,
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
  const [imageLoaded, setImageLoaded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, {
    once: true,
    margin: '0px 0px -100px 0px',
  });

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

  // Format price with commas for thousands
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(service.price);

  // Get colors based on whether it's premium or standard
  const mainColor = isPremiumStyle ? 'amber' : 'blue';
  const gradientDirection = isPremiumStyle ? 'to-tr' : 'to-r';

  // Render the premium luxury card
  if (isPremiumStyle) {
    return (
      <>
        <motion.div
          ref={cardRef}
          initial={{ opacity: 0, y: 40 }}
          animate={
            isInView
              ? {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] },
                }
              : { opacity: 0, y: 40 }
          }
          whileHover={{ y: -12, transition: { duration: 0.3 } }}
          className='relative group overflow-hidden cursor-pointer'
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
        >
          {/* Card body with luxury gold border and effect */}
          <div className='relative isolate rounded-2xl overflow-hidden p-0.5 z-10'>
            {/* Animated gradient border */}
            <div
              className='absolute inset-0 bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 opacity-60 group-hover:opacity-100 transition-opacity duration-700 z-0'
              style={{
                background: `linear-gradient(${
                  isHovered ? '120deg' : '45deg'
                }, rgba(251, 191, 36, 0.4), rgba(245, 158, 11, 0.5), rgba(202, 138, 4, 0.6), rgba(245, 158, 11, 0.5), rgba(251, 191, 36, 0.4))`,
                backgroundSize: '400% 400%',
                animation: isHovered
                  ? 'gradient-shift 3s ease infinite'
                  : 'none',
              }}
            />

            {/* Card inner content */}
            <div className='relative h-full bg-gradient-to-br from-gray-900 to-black p-px rounded-2xl overflow-hidden z-10'>
              <div className='h-full bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden'>
                {/* Service image */}
                <div className='relative h-64 overflow-hidden'>
                  {/* Premium badge */}
                  <div className='absolute top-5 right-5 z-30 pointer-events-none'>
                    <div className='flex items-center px-4 py-2 rounded-full bg-black/20 backdrop-blur-2xl border border-amber-500/20 shadow-xl'>
                      <Diamond className='text-amber-400 mr-2 h-4 w-4' />
                      <span className='text-xs font-semibold uppercase tracking-widest text-amber-300'>
                        Premium
                      </span>
                    </div>
                  </div>

                  {/* Image loading placeholder */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 z-10 transition-opacity duration-1000 ${
                      imageLoaded ? 'opacity-0' : 'opacity-100'
                    }`}
                  ></div>

                  <Image
                    src={service.img || `/images/services/${service.id}.jpg`}
                    alt={t(`${translationPath}.name`, {
                      fallback: service.name,
                    })}
                    fill
                    sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                    className={`object-cover transition-all duration-1000 ease-out z-20 ${
                      isHovered
                        ? 'scale-110 filter contrast-125 brightness-110'
                        : 'scale-100'
                    }`}
                    onLoad={() => setImageLoaded(true)}
                    onError={handleImageError}
                    quality={90}
                    priority={true}
                  />

                  {/* Overlay for text contrast */}
                  <div className='absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-30'></div>
                </div>

                {/* Service details */}
                <div className='p-8 relative'>
                  {/* Selection indicator */}
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className='absolute -top-12 right-8 h-24 w-24'
                    >
                      <div className='relative h-full w-full'>
                        <div className='absolute inset-0 bg-amber-500 rounded-full opacity-20 animate-ping'></div>
                        <div className='absolute inset-[30%] bg-amber-500 rounded-full flex items-center justify-center'>
                          <Check className='text-black h-5 w-5' />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Rating stars and details */}
                  <div className='flex justify-between items-start mb-4'>
                    <div className='flex items-center'>
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <Star
                          key={rating}
                          size={16}
                          className='text-amber-400 fill-amber-400 mr-0.5'
                        />
                      ))}
                      <span className='text-amber-300 text-xs ml-2 font-medium'>
                        (5.0)
                      </span>
                    </div>
                    <div className='flex items-center text-amber-400'>
                      <DollarSign className='h-4 w-4 mr-0.5' />
                      <span className='font-bold text-lg'>
                        {formattedPrice}
                      </span>
                    </div>
                  </div>

                  {/* Service title */}
                  <h3 className='text-2xl font-bold mb-3 text-white tracking-tight'>
                    {t(`${translationPath}.name`, { fallback: service.name })}
                  </h3>

                  {/* Service details */}
                  <div className='flex items-center text-gray-400 mb-4'>
                    <div className='flex items-center mr-4'>
                      <Clock className='h-4 w-4 mr-1.5 text-amber-500/70' />
                      <span className='text-xs font-medium'>
                        {service.duration}h Experience
                      </span>
                    </div>
                    <div className='flex items-center'>
                      <CalendarDays className='h-4 w-4 mr-1.5 text-amber-500/70' />
                      <span className='text-xs font-medium'>
                        Flexible Scheduling
                      </span>
                    </div>
                  </div>

                  {/* Service description */}
                  <p className='mb-6 text-gray-300 leading-relaxed text-sm line-clamp-2'>
                    {t(`${translationPath}.short`, {
                      fallback: service.description,
                    })}
                  </p>

                  {/* Action buttons */}
                  <div className='grid grid-cols-2 gap-4'>
                    <Link
                      href={`/service/${service.id}`}
                      className='py-3 px-5 flex items-center justify-center bg-black/40 hover:bg-black/70 backdrop-blur-md font-medium text-white rounded-lg transition-all duration-300 border border-amber-500/30 group overflow-hidden relative'
                    >
                      <span className='relative z-10 flex items-center'>
                        {t('services.actions.details', { fallback: 'Details' })}
                        <ArrowUpRight
                          size={16}
                          className='ml-1.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform'
                        />
                      </span>
                      <span className='absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/0 to-amber-500/0 group-hover:from-amber-500/20 group-hover:via-amber-500/20 group-hover:to-amber-500/0 transition-all duration-500'></span>
                    </Link>

                    <button
                      onClick={() => setIsModalOpen(true)}
                      className={`relative overflow-hidden py-3 px-5 flex items-center justify-center ${
                        isSelected ? 'bg-amber-600' : 'bg-amber-500'
                      } hover:bg-amber-600 text-black font-medium rounded-lg transition-all duration-300 shadow-lg shadow-amber-500/20`}
                    >
                      <span className='relative z-10 flex items-center'>
                        {isSelected ? (
                          <>
                            <Check size={16} className='mr-1.5' />
                            <span>
                              {t('services.actions.selected', {
                                fallback: 'Selected',
                              })}
                            </span>
                          </>
                        ) : (
                          <>
                            <Plus size={16} className='mr-1.5' />
                            <span>
                              {t('services.actions.book', {
                                fallback: 'Book Now',
                              })}
                            </span>
                          </>
                        )}
                      </span>
                      <span className='absolute inset-0 bg-gradient-to-r from-amber-400/0 via-amber-400/0 to-amber-400/0 hover:from-amber-400/30 hover:via-amber-400/30 hover:to-amber-400/0 transition-all duration-500'></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Light effect when selected */}
          {isSelected && (
            <div className='absolute inset-0 -z-10'>
              <div className='absolute inset-x-0 -bottom-10 h-20 bg-amber-500/20 blur-3xl'></div>
            </div>
          )}
        </motion.div>

        {/* Booking Modal */}
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

  // Render the standard card
  return (
    <>
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 40 }}
        animate={
          isInView
            ? {
                opacity: 1,
                y: 0,
                transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] },
              }
            : { opacity: 0, y: 40 }
        }
        whileHover={{ y: -12, transition: { duration: 0.3 } }}
        className='relative group overflow-hidden cursor-pointer'
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        {/* Card body with gradient border effect */}
        <div className='relative isolate rounded-2xl overflow-hidden p-0.5 z-10'>
          {/* Gradient border */}
          <div
            className='absolute inset-0 bg-gradient-to-br from-blue-300 via-blue-500 to-blue-700 opacity-40 group-hover:opacity-80 transition-opacity duration-700 z-0'
            style={{
              background: `linear-gradient(${
                isHovered ? '120deg' : '45deg'
              }, rgba(59, 130, 246, 0.3), rgba(37, 99, 235, 0.4), rgba(29, 78, 216, 0.5), rgba(37, 99, 235, 0.4), rgba(59, 130, 246, 0.3))`,
              backgroundSize: '400% 400%',
              animation: isHovered ? 'gradient-shift 3s ease infinite' : 'none',
            }}
          />

          {/* Card inner content */}
          <div className='relative h-full bg-gradient-to-b from-white to-gray-100 p-px rounded-2xl overflow-hidden z-10'>
            <div className='h-full bg-gradient-to-b from-white to-gray-100 rounded-2xl overflow-hidden'>
              {/* Service image */}
              <div className='relative h-64 overflow-hidden'>
                {/* Standard badge */}
                <div className='absolute top-5 right-5 z-30 pointer-events-none'>
                  <div className='flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-2xl border border-blue-400/20 shadow-xl'>
                    <Star className='text-blue-500 mr-2 h-4 w-4' />
                    <span className='text-xs font-semibold uppercase tracking-wider text-blue-600'>
                      Standard
                    </span>
                  </div>
                </div>

                {/* Image loading placeholder */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-100 z-10 transition-opacity duration-1000 ${
                    imageLoaded ? 'opacity-0' : 'opacity-100'
                  }`}
                ></div>

                <Image
                  src={service.img || `/images/services/${service.id}.jpg`}
                  alt={t(`${translationPath}.name`, { fallback: service.name })}
                  fill
                  sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                  className={`object-cover transition-all duration-1000 ease-out z-20 ${
                    isHovered ? 'scale-110' : 'scale-100'
                  }`}
                  onLoad={() => setImageLoaded(true)}
                  onError={handleImageError}
                  priority={true}
                />

                {/* Overlay for text contrast */}
                <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent z-30'></div>
              </div>

              {/* Service details */}
              <div className='p-8 relative'>
                {/* Selection indicator */}
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className='absolute -top-12 right-8 h-24 w-24'
                  >
                    <div className='relative h-full w-full'>
                      <div className='absolute inset-0 bg-blue-500 rounded-full opacity-20 animate-ping'></div>
                      <div className='absolute inset-[30%] bg-blue-500 rounded-full flex items-center justify-center'>
                        <Check className='text-white h-5 w-5' />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Rating stars and details */}
                <div className='flex justify-between items-start mb-4'>
                  <div className='flex items-center'>
                    {[1, 2, 3, 4].map((rating) => (
                      <Star
                        key={rating}
                        size={16}
                        className='text-blue-500 fill-blue-500 mr-0.5'
                      />
                    ))}
                    <Star key={5} size={16} className='text-gray-300 mr-0.5' />
                    <span className='text-gray-500 text-xs ml-2 font-medium'>
                      (4.0)
                    </span>
                  </div>
                  <div className='flex items-center text-blue-600'>
                    <DollarSign className='h-4 w-4 mr-0.5' />
                    <span className='font-bold text-lg'>{formattedPrice}</span>
                  </div>
                </div>

                {/* Service title */}
                <h3 className='text-2xl font-bold mb-3 text-gray-900 tracking-tight'>
                  {t(`${translationPath}.name`, { fallback: service.name })}
                </h3>

                {/* Service details */}
                <div className='flex items-center text-gray-500 mb-4'>
                  <div className='flex items-center mr-4'>
                    <Clock className='h-4 w-4 mr-1.5 text-blue-500/70' />
                    <span className='text-xs font-medium'>
                      {service.duration}h Experience
                    </span>
                  </div>
                  <div className='flex items-center'>
                    <CalendarDays className='h-4 w-4 mr-1.5 text-blue-500/70' />
                    <span className='text-xs font-medium'>
                      Flexible Scheduling
                    </span>
                  </div>
                </div>

                {/* Service description */}
                <p className='mb-6 text-gray-600 leading-relaxed text-sm line-clamp-2'>
                  {t(`${translationPath}.short`, {
                    fallback: service.description,
                  })}
                </p>

                {/* Action buttons */}
                <div className='grid grid-cols-2 gap-4'>
                  <Link
                    href={`/service/${service.id}`}
                    className='py-3 px-5 flex items-center justify-center bg-gray-100 hover:bg-gray-200 font-medium text-gray-800 rounded-lg transition-all duration-300 border border-gray-200 group'
                  >
                    <span className='flex items-center'>
                      {t('services.actions.details', { fallback: 'Details' })}
                      <ArrowUpRight
                        size={16}
                        className='ml-1.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform'
                      />
                    </span>
                  </Link>

                  <button
                    onClick={() => setIsModalOpen(true)}
                    className={`py-3 px-5 flex items-center justify-center ${
                      isSelected ? 'bg-blue-600' : 'bg-blue-500'
                    } hover:bg-blue-600 text-white font-medium rounded-lg transition-all duration-300 shadow-md shadow-blue-500/20`}
                  >
                    {isSelected ? (
                      <>
                        <Check size={16} className='mr-1.5' />
                        <span>
                          {t('services.actions.selected', {
                            fallback: 'Selected',
                          })}
                        </span>
                      </>
                    ) : (
                      <>
                        <Plus size={16} className='mr-1.5' />
                        <span>
                          {t('services.actions.book', { fallback: 'Book Now' })}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Light effect when selected */}
        {isSelected && (
          <div className='absolute inset-0 -z-10'>
            <div className='absolute inset-x-0 -bottom-10 h-20 bg-blue-500/20 blur-3xl'></div>
          </div>
        )}
      </motion.div>

      {/* Booking Modal */}
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

// Add this to your global CSS
// /*
// @keyframes gradient-shift {
//   0% {
//     background-position: 0% 50%;
//   }
//   50% {
//     background-position: 100% 50%;
//   }
//   100% {
//     background-position: 0% 50%;
//   }
// }
// */
