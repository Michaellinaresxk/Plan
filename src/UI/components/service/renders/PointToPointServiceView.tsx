import React, { useState, useCallback } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { Service } from '@/types/type';
import { ServiceData, ServiceExtendedDetails } from '@/types/services';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  Car,
  MapPin,
  ArrowRight,
  Shield,
  Route,
  Check,
  Star,
  CheckCircle,
  Clock,
  X,
} from 'lucide-react';
import { useBooking } from '@/context/BookingContext';
import { BookingDate } from '@/types/type';
import BookingModal from '../../modal/BookingModal';
import {
  POPULAR_ROUTES,
  TRANSFER_GALLERY,
  TRANSFER_PROCESS,
  VEHICLE_FEATURES,
  WHATS_INCLUDED,
  WHATS_NOT_INCLUDED,
} from '@/constants/pointToPoint';
import { TRANSPORT_ZONES } from '@/constants/zone';

// ─── Types ────────────────────────────────────────────────────────────────────

interface PointToPointServiceViewProps {
  service: Service;
  serviceData?: ServiceData;
  extendedDetails?: ServiceExtendedDetails;
  primaryColor?: string;
}

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

const PointToPointServiceView: React.FC<PointToPointServiceViewProps> = ({
  service,
  serviceData,
  extendedDetails,
}) => {
  const { t } = useTranslation();
  const { bookService } = useBooking();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  const handleBooking = useCallback(
    (svc: Service, dates: BookingDate, guests: number) => {
      bookService(svc, dates, guests);
      setIsModalOpen(false);
    },
    [bookService],
  );

  const popularZones = TRANSPORT_ZONES.filter((z) => z.isPopular);

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
          src={service.img || TRANSFER_GALLERY[0]?.src || '/img/transfer.jpg'}
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
                Private Transportation
              </p>
              <h1 className='text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-light text-white leading-[1.1] tracking-tight mb-3'>
                Go Anywhere
                <br />
                <span className='font-semibold'>In Comfort</span>
              </h1>
              <p className='text-white/55 text-sm sm:text-base max-w-md leading-relaxed font-light mb-5'>
                Professional point-to-point transportation between any location.
                Hotels, attractions, restaurants — we get you there safely.
              </p>

              <div className='flex flex-wrap gap-5 mb-7'>
                {[
                  { icon: Route, text: '50+ Destinations' },
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
                Book Your Ride
                <ArrowRight className='w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform' />
              </button>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── Popular Routes ─────────────────────────────────────── */}
      <motion.section
        className='px-5 sm:px-8 lg:px-12 py-14 sm:py-18 lg:py-20'
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, margin: '-60px' }}
        variants={stagger}
      >
        <motion.div className='mb-10' variants={fadeIn}>
          <p className='text-amber-600 uppercase tracking-[0.25em] text-[11px] font-medium mb-2'>
            Routes
          </p>
          <h2 className='text-2xl sm:text-3xl lg:text-4xl font-light text-stone-900 tracking-tight'>
            Popular <span className='font-semibold'>Destinations</span>
          </h2>
        </motion.div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl'>
          {POPULAR_ROUTES.map((route, i) => (
            <motion.button
              key={i}
              type='button'
              onClick={openModal}
              variants={fadeIn}
              className='border border-stone-200 bg-white p-5 text-left hover:border-stone-400 transition-colors group'
            >
              <div className='flex items-center justify-between mb-3'>
                <span className='text-lg font-light text-stone-900'>
                  ${route.price}
                </span>
                <span className='text-[11px] text-stone-400'>{route.time}</span>
              </div>
              <div className='flex items-center gap-2 text-xs text-stone-600 mb-1'>
                <div className='w-2 h-2 bg-stone-900 rounded-full' />
                <span>{route.from}</span>
              </div>
              <div className='flex items-center gap-2 text-xs text-stone-600 mb-3'>
                <div className='w-2 h-2 bg-amber-500 rounded-full' />
                <span>{route.to}</span>
              </div>
              <p className='text-[11px] text-stone-400 leading-relaxed'>
                {route.description}
              </p>
            </motion.button>
          ))}
        </div>
      </motion.section>

      {/* ── Gallery — compact ──────────────────────────────────── */}
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
          {TRANSFER_GALLERY.map((img, i) => (
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

      {/* ── Process + Included + Coverage — consolidated ────────── */}
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
            How It <span className='font-semibold'>Works</span>
          </h2>
        </motion.div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
          {/* Process steps */}
          <motion.div
            className='border border-stone-200 bg-white p-6'
            variants={fadeIn}
          >
            <h3 className='text-xs font-semibold text-stone-900 uppercase tracking-[0.1em] mb-5'>
              Process
            </h3>
            <div className='space-y-4'>
              {TRANSFER_PROCESS.map((step, i) => (
                <div key={i} className='flex items-start gap-3'>
                  <span className='text-[10px] font-semibold text-amber-600 mt-0.5 w-4 flex-shrink-0'>
                    {String(step.step).padStart(2, '0')}
                  </span>
                  <div>
                    <p className='text-stone-900 text-xs font-medium'>
                      {step.title}
                    </p>
                    <p className='text-stone-400 text-[11px] leading-relaxed'>
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

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
              {WHATS_INCLUDED.map((item, i) => (
                <div key={i} className='flex items-start gap-2.5'>
                  <Check className='w-3 h-3 text-emerald-500 mt-0.5 flex-shrink-0' />
                  <span className='text-stone-600 text-xs leading-relaxed'>
                    {item}
                  </span>
                </div>
              ))}
            </div>
            <div className='border-t border-stone-100 mt-5 pt-4 space-y-2'>
              {WHATS_NOT_INCLUDED.map((item, i) => (
                <div key={i} className='flex items-start gap-2.5'>
                  <X className='w-3 h-3 text-stone-300 mt-0.5 flex-shrink-0' />
                  <span className='text-stone-400 text-xs'>{item}</span>
                </div>
              ))}
            </div>
            {VEHICLE_FEATURES.length > 0 && (
              <div className='border-t border-stone-100 mt-5 pt-4'>
                <p className='text-[10px] font-semibold text-stone-500 uppercase tracking-wider mb-3'>
                  Vehicle Features
                </p>
                <div className='grid grid-cols-2 gap-2'>
                  {VEHICLE_FEATURES.map((f, i) => (
                    <div key={i} className='flex items-center gap-1.5'>
                      <f.icon className='w-3 h-3 text-stone-400' />
                      <span className='text-[11px] text-stone-500'>
                        {f.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Coverage */}
          <motion.div
            className='border border-stone-200 bg-white p-6'
            variants={fadeIn}
          >
            <h3 className='text-xs font-semibold text-stone-900 uppercase tracking-[0.1em] mb-5'>
              Coverage Areas
            </h3>
            <div className='space-y-3'>
              {popularZones.map((zone) => (
                <div key={zone.id} className='flex items-start gap-2.5'>
                  <MapPin className='w-3 h-3 text-amber-500 mt-0.5 flex-shrink-0' />
                  <div>
                    <p className='text-stone-900 text-xs font-medium'>
                      {zone.displayName}
                    </p>
                    <p className='text-stone-400 text-[11px]'>
                      {zone.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <p className='text-[11px] text-stone-400 mt-4 pt-3 border-t border-stone-100'>
              Extended: La Romana, Santo Domingo, Samaná — premium long-distance
              available.
            </p>
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
          src={TRANSFER_GALLERY[1]?.src || '/img/transfer.jpg'}
          alt='Professional driver'
          fill
          className='object-cover'
        />
        <div className='absolute inset-0 bg-stone-900/85' />
        <div className='relative z-10 py-14 sm:py-18 lg:py-22 px-5 sm:px-8 lg:px-12 text-center'>
          <p className='text-amber-400 uppercase tracking-[0.3em] text-[11px] font-medium mb-4'>
            Reserve Today
          </p>
          <h2 className='text-2xl sm:text-3xl lg:text-4xl font-light text-white mb-4 tracking-tight'>
            Your Driver, Wherever You Go
          </h2>
          <p className='text-white/40 text-sm max-w-md mx-auto leading-relaxed mb-8'>
            Professional, punctual, and always comfortable. Book your private
            transfer now.
          </p>
          <button
            onClick={openModal}
            className='group inline-flex items-center gap-2.5 bg-white text-stone-900 px-8 py-3.5 text-xs font-medium tracking-wide uppercase hover:bg-amber-50 transition-colors duration-300'
          >
            Book Your Ride
            <ArrowRight className='w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform' />
          </button>
        </div>
      </motion.section>

      {/* ── Disclaimer ─────────────────────────────────────────── */}
      <section className='px-5 sm:px-8 lg:px-12 py-5 bg-amber-50/50 border-t border-amber-200/40'>
        <div className='max-w-3xl mx-auto flex items-center gap-2.5'>
          <Shield className='w-3.5 h-3.5 text-amber-500 flex-shrink-0' />
          <p className='text-[11px] text-amber-700'>
            Please provide accurate addresses. Custom quotes may apply for
            locations outside standard coverage. 24h cancellation policy.
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

export default PointToPointServiceView;
