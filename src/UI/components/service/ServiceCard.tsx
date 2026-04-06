'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Clock, CalendarDays, Check } from 'lucide-react';
import Image from 'next/image';
import BookingModal from '../modal/BookingModal';
import { useTranslation } from '@/lib/i18n/client';

// ─── Types ────────────────────────────────────────────────────────────────────

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
  onToggle: (service: ServiceCardProps['service']) => void;
  onBookService: (
    service: ServiceCardProps['service'],
    dates: unknown,
    guests: number,
  ) => void;
  viewContext?: 'standard-view' | 'premium-view';
  size?: 'compact' | 'standard' | 'large';
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SIZE_CONFIG = {
  compact: {
    imageHeight: 'h-48',
    padding: 'p-5',
    title: 'text-lg',
    description: 'text-sm',
    button: 'py-2.5 px-4 text-xs',
  },
  standard: {
    imageHeight: 'h-52',
    padding: 'p-6',
    title: 'text-lg',
    description: 'text-sm',
    button: 'py-3 px-5 text-xs',
  },
  large: {
    imageHeight: 'h-60',
    padding: 'p-7',
    title: 'text-xl',
    description: 'text-sm',
    button: 'py-3.5 px-6 text-xs',
  },
} as const;

const PLACEHOLDER_IMAGE = '/images/placeholder-service.jpg';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getTranslationPath(serviceId: string): string {
  const specialMappings: Record<string, string> = {
    'yoga-standard': 'yoga',
    'luxe-yoga': 'luxeYoga',
  };

  if (specialMappings[serviceId]) {
    const mappedKey = specialMappings[serviceId];
    const type = serviceId.startsWith('luxe') ? 'premium' : 'standard';
    return `services.${type}.${mappedKey}`;
  }

  const camelCaseKey = serviceId.replace(/-([a-z])/g, (_, letter: string) =>
    letter.toUpperCase(),
  );
  const type = camelCaseKey.startsWith('luxe') ? 'premium' : 'standard';
  return `services.${type}.${camelCaseKey}`;
}

// ─── Component ────────────────────────────────────────────────────────────────

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const config = SIZE_CONFIG[size];
  const isPremium = viewContext === 'premium-view' || packageType === 'premium';
  const translationPath = getTranslationPath(service.id);

  const handleImageError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      e.currentTarget.src = PLACEHOLDER_IMAGE;
    },
    [],
  );

  const handleBookingConfirm = useCallback(
    (svc: ServiceCardProps['service'], dates: unknown, guests: number) => {
      onBookService(svc, dates, guests);
      setIsModalOpen(false);
    },
    [onBookService],
  );

  const serviceName = t(`${translationPath}.name`, { fallback: service.name });
  const serviceDescription = t(`${translationPath}.short`, {
    fallback: service.description,
  });

  return (
    <>
      <Link href={`/${servicePath}/${service.id}`} className='block group'>
        <motion.article
          whileHover={{ y: -4 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={`
            relative overflow-hidden
            ${
              isPremium
                ? 'bg-stone-900 border border-stone-800'
                : 'bg-white border border-stone-200'
            }
          `}
        >
          {/* ── Image ──────────────────────────────────────────────── */}
          <div className={`relative ${config.imageHeight} overflow-hidden`}>
            {/* Loading skeleton */}
            <div
              className={`
                absolute inset-0 z-10 flex items-center justify-center transition-opacity duration-500
                ${imageLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'}
                ${isPremium ? 'bg-stone-800' : 'bg-stone-100'}
              `}
            >
              <div
                className={`
                  w-5 h-5 border-2 rounded-full animate-spin
                  ${
                    isPremium
                      ? 'border-stone-600 border-t-amber-500'
                      : 'border-stone-300 border-t-stone-600'
                  }
                `}
              />
            </div>

            <motion.div
              className='relative w-full h-full'
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <Image
                src={service.img || `/images/services/${service.id}.jpg`}
                alt={serviceName}
                fill
                sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                className='object-cover'
                onLoad={() => setImageLoaded(true)}
                onError={handleImageError}
              />
            </motion.div>

            {/* Gradient overlay */}
            <div
              className={`
                absolute inset-0 z-20
                ${
                  isPremium
                    ? 'bg-gradient-to-t from-stone-900 via-stone-900/20 to-transparent'
                    : 'bg-gradient-to-t from-white via-transparent to-transparent'
                }
              `}
            />

            {/* Premium badge */}
            {isPremium && (
              <div className='absolute top-3 right-3 z-30'>
                <span className='px-2.5 py-1 bg-black/50 backdrop-blur-sm border border-amber-500/30 text-amber-400 text-[10px] font-medium uppercase tracking-[0.15em]'>
                  {t('common.mainText.xclusive')}
                </span>
              </div>
            )}

            {/* Selected indicator */}
            <AnimatePresence>
              {isSelected && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                  className='absolute top-3 left-3 z-30'
                >
                  <div
                    className={`
                      w-6 h-6 flex items-center justify-center
                      ${isPremium ? 'bg-amber-500 text-stone-900' : 'bg-stone-900 text-white'}
                    `}
                  >
                    <Check className='w-3.5 h-3.5' strokeWidth={2.5} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Content ────────────────────────────────────────────── */}
          <div className={config.padding}>
            <h3
              className={`
                ${config.title} font-semibold tracking-tight mb-2
                transition-colors duration-300
                ${
                  isPremium
                    ? 'text-white group-hover:text-amber-200'
                    : 'text-stone-900 group-hover:text-stone-600'
                }
              `}
            >
              {serviceName}
            </h3>

            {/* Meta */}
            <div className='flex items-center gap-3 mb-3'>
              <span
                className={`
                  inline-flex items-center gap-1 text-[11px] tracking-wide
                  ${isPremium ? 'text-stone-500' : 'text-stone-400'}
                `}
              >
                <Clock className='w-3 h-3' />
                {service.duration}h
              </span>
              <span
                className={`
                  inline-flex items-center gap-1 text-[11px] tracking-wide
                  ${isPremium ? 'text-stone-500' : 'text-stone-400'}
                `}
              >
                <CalendarDays className='w-3 h-3' />
                Flexible
              </span>
            </div>

            <p
              className={`
                ${config.description} leading-relaxed line-clamp-2 mb-5
                ${isPremium ? 'text-stone-400' : 'text-stone-500'}
              `}
            >
              {serviceDescription}
            </p>

            {/* CTA */}
            <div
              className={`
                ${config.button}
                inline-flex items-center gap-1.5 font-medium uppercase tracking-[0.1em]
                transition-colors duration-300
                ${
                  isPremium
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:bg-amber-500/20'
                    : 'bg-stone-900 text-white group-hover:bg-stone-800'
                }
              `}
            >
              {t('common.button.details')}
              <ArrowUpRight className='w-3.5 h-3.5' />
            </div>
          </div>

          {/* Bottom accent line (premium only) */}
          {isPremium && (
            <div className='h-px w-full bg-gradient-to-r from-transparent via-amber-500/40 to-transparent' />
          )}
        </motion.article>
      </Link>

      {/* ── Booking Modal ────────────────────────────────────────── */}
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
