import React, { useState, useCallback } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { Service } from '@/types/type';
import { ServiceData, ServiceExtendedDetails } from '@/types/services';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  Car,
  Clock,
  MapPin,
  CheckCircle,
  ArrowRight,
  Shield,
  Plane,
  Repeat,
  Check,
  Star,
  Baby,
  Calendar,
  AlertTriangle,
  X,
} from 'lucide-react';
import { useBooking } from '@/context/BookingContext';
import { BookingDate } from '@/types/type';
import BookingModal from '../../modal/BookingModal';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AirportServiceViewProps {
  service: Service;
  serviceData?: ServiceData;
  extendedDetails?: ServiceExtendedDetails;
  primaryColor?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const GALLERY = [
  {
    src: 'https://res.cloudinary.com/ddg92xar5/image/upload/v1756210032/6_skprwd.jpg',
    alt: 'Luxury van transfer',
  },
  {
    src: 'https://res.cloudinary.com/ddg92xar5/image/upload/v1756210026/8_bkndzo.jpg',
    alt: 'Professional driver',
  },
  {
    src: 'https://res.cloudinary.com/ddg92xar5/image/upload/v1757095741/5_gj861l.jpg',
    alt: 'Airport terminal',
  },
  {
    src: 'https://res.cloudinary.com/ddg92xar5/image/upload/v1757095756/7_nsflgz.jpg',
    alt: 'Punta Cana destination',
  },
] as const;

const INCLUDED = [
  'Meet & Greet at airport exit',
  'Professional driver service',
  'Luggage assistance',
  'Air-conditioned vehicle',
  'Bottled water on board',
  'Flight tracking service',
] as const;

const TIPS = [
  {
    icon: Calendar,
    title: 'Book in Advance',
    text: 'Reserve at least 24 hours before your flight for guaranteed availability.',
  },
  {
    icon: Plane,
    title: 'Provide Flight Details',
    text: 'Include flight number, arrival time, and accommodation address for perfect coordination.',
  },
  {
    icon: Clock,
    title: 'Allow Buffer Time',
    text: 'For departures, schedule pickup 3 hours before international flights.',
  },
] as const;

const INFO_ITEMS = [
  {
    icon: Plane,
    title: 'Flight Tracking',
    text: 'We monitor delays and adjust automatically',
  },
  { icon: Clock, title: 'Travel Time', label: 'travelTime' },
  {
    icon: Baby,
    title: 'Child Safety',
    text: 'Child seats available upon request',
  },
  {
    icon: Car,
    title: '24/7 Service',
    text: 'Available with advance reservation',
  },
] as const;

// ─── Animation ────────────────────────────────────────────────────────────────

const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

// ─── Component ────────────────────────────────────────────────────────────────

const AirportServiceView: React.FC<AirportServiceViewProps> = ({
  service,
  serviceData,
  extendedDetails,
}) => {
  const { t } = useTranslation();
  const { bookService } = useBooking();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const travelTime =
    extendedDetails?.travelTime ||
    serviceData?.metaData?.travelTime ||
    '20–40 min';

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  const handleBooking = useCallback(
    (svc: Service, dates: BookingDate, guests: number) => {
      bookService(svc, dates, guests);
      setIsModalOpen(false);
    },
    [bookService],
  );

  return (
    <div className='min-h-screen bg-stone-50'>
      {/* ── Hero — full bleed ──────────────────────────────────── */}
      <motion.section
        className='relative w-full h-[55vh] sm:h-[60vh] lg:h-[70vh]'
        initial='hidden'
        animate='visible'
        variants={fadeIn}
      >
        <Image
          src={service.img || GALLERY[0].src}
          alt={service.name}
          fill
          className='object-cover'
          priority
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent' />

        <div className='relative z-10 h-full flex items-end'>
          <div className='w-full px-5 sm:px-8 lg:px-12 pb-10 sm:pb-14 lg:pb-16'>
            <div className='max-w-3xl'>
              <p className='text-amber-300 uppercase tracking-[0.3em] text-[11px] sm:text-xs font-medium mb-3'>
                Airport Transfer
              </p>
              <h1 className='text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-light text-white leading-[1.1] tracking-tight mb-3'>
                Start Your Vacation
                <br />
                <span className='font-semibold'>Stress-Free</span>
              </h1>
              <p className='text-white/55 text-sm sm:text-base max-w-md leading-relaxed font-light mb-5'>
                Private transfer from Punta Cana airport to your accommodation.
                Skip the lines — your driver will be waiting.
              </p>

              <div className='flex flex-wrap gap-5 mb-7'>
                {[
                  { icon: Clock, text: travelTime },
                  { icon: Star, text: '4.9 Rating' },
                  { icon: Car, text: '24/7' },
                ].map(({ icon: Icon, text }) => (
                  <span
                    key={text}
                    className='flex items-center gap-1.5 text-white/45 text-xs'
                  >
                    <Icon className='w-3.5 h-3.5' />
                    {text}
                  </span>
                ))}
              </div>

              <button
                onClick={openModal}
                className='group inline-flex items-center gap-2.5 bg-white text-stone-900 px-6 py-3 text-xs font-medium tracking-wide uppercase hover:bg-amber-50 transition-colors duration-300'
              >
                Book Your Transfer
                <ArrowRight className='w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform' />
              </button>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── Transfer Options ───────────────────────────────────── */}
      <motion.section
        className='px-5 sm:px-8 lg:px-12 py-14 sm:py-18 lg:py-20'
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, margin: '-60px' }}
        variants={stagger}
      >
        <motion.div className='mb-10' variants={fadeIn}>
          <p className='text-amber-600 uppercase tracking-[0.25em] text-[11px] font-medium mb-2'>
            Options
          </p>
          <h2 className='text-2xl sm:text-3xl lg:text-4xl font-light text-stone-900 tracking-tight'>
            Choose Your <span className='font-semibold'>Transfer</span>
          </h2>
        </motion.div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl'>
          {[
            {
              key: 'oneWay',
              icon: ArrowRight,
              title: 'One Way',
              desc: 'Single transfer to or from the airport',
              price: 'Base price',
            },
            {
              key: 'roundTrip',
              icon: Repeat,
              title: 'Round Trip',
              desc: 'Arrival and departure transfers included',
              price: '2× base',
            },
          ].map(({ key, icon: Icon, title, desc, price }) => (
            <motion.button
              key={key}
              type='button'
              onClick={openModal}
              variants={fadeIn}
              className='border border-stone-200 bg-white p-6 text-left hover:border-stone-400 transition-colors group'
            >
              <div className='flex items-center gap-3 mb-3'>
                <Icon className='w-4 h-4 text-stone-400' />
                <h3 className='text-stone-900 font-medium text-base'>
                  {title}
                </h3>
              </div>
              <p className='text-stone-400 text-sm mb-4'>{desc}</p>
              <div className='flex items-center justify-between'>
                <span className='text-xs text-stone-500'>{price}</span>
                <span className='text-xs text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity'>
                  Select →
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.section>

      {/* ── Gallery — compact 2×2 ──────────────────────────────── */}
      <motion.section
        className='px-5 sm:px-8 lg:px-12 pb-14 sm:pb-18 lg:pb-20'
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, margin: '-60px' }}
        variants={stagger}
      >
        <motion.div className='mb-8' variants={fadeIn}>
          <p className='text-amber-600 uppercase tracking-[0.25em] text-[11px] font-medium mb-2'>
            Gallery
          </p>
          <h2 className='text-2xl sm:text-3xl lg:text-4xl font-light text-stone-900 tracking-tight'>
            The <span className='font-semibold'>Experience</span>
          </h2>
        </motion.div>

        <div className='grid grid-cols-2 lg:grid-cols-4 gap-1.5 sm:gap-2'>
          {GALLERY.map((img, i) => (
            <motion.div
              key={i}
              className='relative aspect-square overflow-hidden group'
              variants={fadeIn}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className='object-cover transition-transform duration-700 group-hover:scale-105'
              />
              <div className='absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500' />
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── Good to Know + Included — consolidated ─────────────── */}
      <motion.section
        className='px-5 sm:px-8 lg:px-12 pb-14 sm:pb-18 lg:pb-20'
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, margin: '-60px' }}
        variants={stagger}
      >
        <motion.div className='mb-10' variants={fadeIn}>
          <p className='text-amber-600 uppercase tracking-[0.25em] text-[11px] font-medium mb-2'>
            Details
          </p>
          <h2 className='text-2xl sm:text-3xl lg:text-4xl font-light text-stone-900 tracking-tight'>
            Everything You <span className='font-semibold'>Need to Know</span>
          </h2>
        </motion.div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
          {/* Included */}
          <motion.div
            className='border border-stone-200 bg-white p-6'
            variants={fadeIn}
          >
            <div className='flex items-center gap-2 mb-5'>
              <CheckCircle className='w-3.5 h-3.5 text-emerald-600' />
              <h3 className='text-xs font-semibold text-stone-900 uppercase tracking-[0.1em]'>
                Included
              </h3>
            </div>
            <div className='space-y-2.5'>
              {INCLUDED.map((item, i) => (
                <div key={i} className='flex items-start gap-2.5'>
                  <Check className='w-3 h-3 text-emerald-500 mt-0.5 flex-shrink-0' />
                  <span className='text-stone-600 text-xs leading-relaxed'>
                    {item}
                  </span>
                </div>
              ))}
            </div>
            <div className='border-t border-stone-100 mt-5 pt-4'>
              <div className='flex items-start gap-2.5'>
                <X className='w-3 h-3 text-stone-300 mt-0.5 flex-shrink-0' />
                <span className='text-stone-400 text-xs'>
                  Gratuity (optional)
                </span>
              </div>
            </div>
          </motion.div>

          {/* Quick Info */}
          <motion.div
            className='border border-stone-200 bg-white p-6'
            variants={fadeIn}
          >
            <h3 className='text-xs font-semibold text-stone-900 uppercase tracking-[0.1em] mb-5'>
              Quick Info
            </h3>
            <div className='space-y-4'>
              {INFO_ITEMS.map(({ icon: Icon, title, text, label }) => (
                <div key={title} className='flex items-start gap-3'>
                  <Icon className='w-4 h-4 text-stone-400 mt-0.5 flex-shrink-0' />
                  <div>
                    <p className='text-stone-900 text-xs font-medium'>
                      {title}
                    </p>
                    <p className='text-stone-400 text-[11px]'>
                      {label === 'travelTime'
                        ? `Approximately ${travelTime} within Punta Cana`
                        : text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Tips */}
          <motion.div
            className='border border-stone-200 bg-white p-6'
            variants={fadeIn}
          >
            <h3 className='text-xs font-semibold text-stone-900 uppercase tracking-[0.1em] mb-5'>
              Traveler Tips
            </h3>
            <div className='space-y-4'>
              {TIPS.map(({ icon: Icon, title, text }) => (
                <div key={title} className='flex items-start gap-3'>
                  <Icon className='w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0' />
                  <div>
                    <p className='text-stone-900 text-xs font-medium'>
                      {title}
                    </p>
                    <p className='text-stone-400 text-[11px] leading-relaxed'>
                      {text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* ── CTA Banner — single, full bleed ────────────────────── */}
      <motion.section
        className='relative w-full'
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, margin: '-60px' }}
        variants={fadeIn}
      >
        <Image
          src={GALLERY[1].src}
          alt='Transfer service'
          fill
          className='object-cover'
        />
        <div className='absolute inset-0 bg-stone-900/85' />
        <div className='relative z-10 py-14 sm:py-18 lg:py-22 px-5 sm:px-8 lg:px-12 text-center'>
          <p className='text-amber-400 uppercase tracking-[0.3em] text-[11px] font-medium mb-4'>
            Reserve Today
          </p>
          <h2 className='text-2xl sm:text-3xl lg:text-4xl font-light text-white mb-4 tracking-tight'>
            Ready to Travel in Comfort?
          </h2>
          <p className='text-white/40 text-sm max-w-md mx-auto leading-relaxed mb-8'>
            Secure your private transfer now. No stress, no delays — just
            comfort from the moment you land.
          </p>
          <button
            onClick={openModal}
            className='group inline-flex items-center gap-2.5 bg-white text-stone-900 px-8 py-3.5 text-xs font-medium tracking-wide uppercase hover:bg-amber-50 transition-colors duration-300'
          >
            Book Your Transfer
            <ArrowRight className='w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform' />
          </button>
        </div>
      </motion.section>

      {/* ── Disclaimer ─────────────────────────────────────────── */}
      <section className='px-5 sm:px-8 lg:px-12 py-5 bg-amber-50/50 border-t border-amber-200/40'>
        <div className='max-w-3xl mx-auto flex items-center gap-2.5'>
          <Shield className='w-3.5 h-3.5 text-amber-500 flex-shrink-0' />
          <p className='text-[11px] text-amber-700'>
            Please provide accurate flight details and contact information.
            Changes should be made 24 hours in advance.
          </p>
        </div>
      </section>

      {/* ── Modal ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {isModalOpen && (
          <BookingModal
            isOpen={isModalOpen}
            onClose={closeModal}
            onConfirm={handleBooking}
            service={service}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AirportServiceView;
