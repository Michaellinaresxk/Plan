import React, { useState, useCallback } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { Service } from '@/types/type';
import { ServiceData } from '@/types/services';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useBooking } from '@/context/BookingContext';
import { BookingDate } from '@/types/type';
import BookingModal from '../../modal/BookingModal';
import {
  Music,
  Users,
  Clock,
  Star,
  ArrowRight,
  Mic,
  Disc3,
  Quote,
} from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────────────────────

const TESTIMONIALS = [
  {
    id: '1',
    quote:
      'An impeccable karaoke experience — the sound quality rivaled a recording studio. Every detail was handled with care.',
    author: 'Maria R.',
    event: 'Private Villa Event',
    rating: 5,
  },
  {
    id: '2',
    quote:
      'Our guests were thoroughly impressed. The wireless setup was seamless and the song library covered everything.',
    author: 'David C.',
    event: 'Anniversary Celebration',
    rating: 5,
  },
  {
    id: '3',
    quote:
      'The multilingual catalog was perfect for our international guests. Professional, discreet, and world-class.',
    author: 'Sarah & James W.',
    event: 'Wedding Reception',
    rating: 5,
  },
] as const;

const GALLERY_IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=600',
    alt: 'Live performance atmosphere',
  },
  {
    src: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=600',
    alt: 'Professional karaoke setup',
  },
  {
    src: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=600',
    alt: 'Concert lighting and stage',
  },
  {
    src: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&q=80&w=600',
    alt: 'Crowd enjoying music',
  },
] as const;

const FEATURES = [
  { icon: Disc3, stat: '5 000+', label: 'Songs Curated' },
  { icon: Users, stat: '500+', label: 'Events Hosted' },
  { icon: Music, stat: '12', label: 'Languages' },
  { icon: Clock, stat: '15 min', label: 'Setup Time' },
] as const;

const FAQ_ITEMS = [
  {
    q: 'How long does setup take?',
    a: 'Our team arrives in advance and completes the full installation in approximately 15 minutes, ensuring everything is calibrated before your event begins.',
  },
  {
    q: 'Can performances be recorded?',
    a: 'Yes. Our system includes high-quality audio and video capture so you can revisit the evening at your leisure.',
  },
  {
    q: 'What languages are available?',
    a: 'We maintain a catalog spanning 12+ languages including Spanish, French, Italian, Portuguese, Japanese, and Korean.',
  },
  {
    q: 'Is additional equipment available?',
    a: 'Our standard configuration includes two wireless microphones. Additional microphones, monitors, or lighting can be arranged upon request.',
  },
  {
    q: 'Is the experience suitable for all ages?',
    a: 'Absolutely. We curate age-appropriate selections including Disney classics, contemporary hits, and timeless standards.',
  },
  {
    q: 'What about on-site support?',
    a: 'A dedicated technician handles setup and remains available throughout your event to ensure a flawless experience.',
  },
] as const;

// ─── Animation ────────────────────────────────────────────────────────────────

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

// ─── Component ────────────────────────────────────────────────────────────────

interface KaraokeServiceViewProps {
  service: Service;
  serviceData?: ServiceData;
  primaryColor?: string;
  viewContext?: 'standard-view' | 'premium-view';
}

const KaraokeServiceView: React.FC<KaraokeServiceViewProps> = ({ service }) => {
  const { t } = useTranslation();
  const { bookService } = useBooking();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  const handleBooking = useCallback(
    async (service: Service, dates: BookingDate, guests: number) => {
      try {
        setIsLoading(true);
        await bookService(service, dates, guests);
        setIsModalOpen(false);
      } catch (error) {
        console.error('Booking failed:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [bookService],
  );

  return (
    <div className='min-h-screen bg-stone-50'>
      {/* ══════════════════════════════════════════════════════════════
          HERO — full bleed, edge to edge, no container constraints
      ══════════════════════════════════════════════════════════════ */}
      <motion.section
        className='relative w-full h-[55vh] sm:h-[60vh] lg:h-[70vh]'
        initial='hidden'
        animate='visible'
        variants={fadeIn}
      >
        <Image
          src='https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=1400'
          alt='Private karaoke experience'
          fill
          className='object-cover'
          priority
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent' />

        <div className='relative z-10 h-full flex items-end'>
          <div className='w-full px-5 sm:px-8 lg:px-12 pb-10 sm:pb-12 lg:pb-16'>
            <p className='text-amber-300 uppercase tracking-[0.3em] text-[11px] sm:text-xs font-medium mb-3'>
              Private Entertainment
            </p>

            <h1 className='text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-light text-white leading-[1.1] tracking-tight mb-3'>
              Karaoke
              <br />
              <span className='font-semibold'>Experience</span>
            </h1>

            <p className='text-white/55 text-sm sm:text-base max-w-md leading-relaxed font-light mb-5'>
              Professional-grade sound, over 5 000 curated songs, and seamless
              setup — brought directly to your venue.
            </p>

            <div className='flex flex-wrap gap-4 sm:gap-5 mb-7'>
              {[
                { icon: Users, text: '2–25 Guests' },
                { icon: Disc3, text: '5 000+ Songs' },
                { icon: Clock, text: '15 min Setup' },
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
              <Mic className='w-3.5 h-3.5' />
              Reserve This Experience
              <ArrowRight className='w-3.5 h-3.5 group-hover:translate-x-1 transition-transform' />
            </button>
          </div>
        </div>
      </motion.section>

      {/* ══════════════════════════════════════════════════════════════
          GALLERY — 2 cols always, compact photos, purely decorative
      ══════════════════════════════════════════════════════════════ */}
      <motion.section
        className='px-5 sm:px-8 lg:px-12 mt-12 sm:mt-16 lg:mt-20'
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, margin: '-60px' }}
        variants={stagger}
      >
        <motion.div className='mb-8' variants={fadeIn}>
          <p className='text-amber-600 uppercase tracking-[0.25em] text-[11px] font-medium mb-2'>
            Gallery
          </p>
          <h2 className='text-xl sm:text-2xl lg:text-3xl font-light text-stone-900 tracking-tight'>
            Moments Worth <span className='font-semibold'>Remembering</span>
          </h2>
        </motion.div>

        <div className='grid grid-cols-2 gap-1.5 sm:gap-2'>
          {GALLERY_IMAGES.map((img, index) => (
            <motion.div
              key={index}
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

      {/* ══════════════════════════════════════════════════════════════
          FEATURES
      ══════════════════════════════════════════════════════════════ */}
      <motion.section
        className='px-5 sm:px-8 lg:px-12 mt-12 sm:mt-16 lg:mt-20'
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, margin: '-60px' }}
        variants={stagger}
      >
        <div className='border border-stone-200 bg-white p-7 sm:p-10'>
          <div className='grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4'>
            {FEATURES.map(({ icon: Icon, stat, label }, index) => (
              <motion.div key={index} className='text-center' variants={fadeIn}>
                <Icon className='w-4 h-4 text-amber-600 mx-auto mb-2.5' />
                <div className='text-lg sm:text-xl font-light text-stone-900 mb-0.5'>
                  {stat}
                </div>
                <div className='text-stone-400 text-[11px] tracking-wide uppercase'>
                  {label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ══════════════════════════════════════════════════════════════
          CTA BANNER — full bleed, edge to edge
      ══════════════════════════════════════════════════════════════ */}
      <motion.section
        className='relative w-full mt-12 sm:mt-16 lg:mt-20'
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, margin: '-60px' }}
        variants={fadeIn}
      >
        <div className='relative w-full'>
          <Image
            src='https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=1400'
            alt='Karaoke atmosphere'
            fill
            className='object-cover'
          />
          <div className='absolute inset-0 bg-stone-900/85' />

          <div className='relative z-10 py-14 sm:py-18 lg:py-22 px-5 sm:px-8 lg:px-12 text-center'>
            <p className='text-amber-400 uppercase tracking-[0.3em] text-[11px] font-medium mb-4'>
              Book Your Evening
            </p>
            <h2 className='text-xl sm:text-2xl lg:text-3xl font-light text-white mb-4 tracking-tight'>
              An Experience Tailored to You
            </h2>
            <p className='text-white/45 text-sm max-w-md mx-auto leading-relaxed font-light mb-8'>
              From intimate gatherings to elegant celebrations — our team
              handles every detail so you can enjoy the moment.
            </p>

            <button
              onClick={openModal}
              disabled={isLoading}
              className='group inline-flex items-center gap-2.5 bg-white text-stone-900 px-7 py-3 text-xs font-medium tracking-wide uppercase hover:bg-amber-50 transition-colors duration-300 disabled:opacity-50 mb-10'
            >
              {isLoading ? (
                <div className='w-4 h-4 border-2 border-stone-300 border-t-stone-900 rounded-full animate-spin' />
              ) : (
                <>
                  <Mic className='w-3.5 h-3.5' />
                  Reserve Now
                  <ArrowRight className='w-3.5 h-3.5 group-hover:translate-x-1 transition-transform' />
                </>
              )}
            </button>

            <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-lg sm:max-w-2xl mx-auto'>
              {[
                { label: 'Quick Setup', detail: 'Ready in 15 min' },
                { label: 'Studio Quality', detail: 'Professional grade' },
                { label: 'Vast Library', detail: '5 000+ songs' },
                { label: 'Full Recording', detail: 'Capture every moment' },
              ].map((item) => (
                <div key={item.label} className='text-left'>
                  <div className='text-white text-xs font-medium mb-0.5'>
                    {item.label}
                  </div>
                  <div className='text-white/30 text-[11px]'>{item.detail}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* ══════════════════════════════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════════════════════════════ */}
      <motion.section
        className='px-5 sm:px-8 lg:px-12 mt-12 sm:mt-16 lg:mt-20'
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, margin: '-60px' }}
        variants={stagger}
      >
        <motion.div className='mb-8' variants={fadeIn}>
          <p className='text-amber-600 uppercase tracking-[0.25em] text-[11px] font-medium mb-2'>
            Client Stories
          </p>
          <h2 className='text-xl sm:text-2xl lg:text-3xl font-light text-stone-900 tracking-tight'>
            In Their <span className='font-semibold'>Words</span>
          </h2>
        </motion.div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          {TESTIMONIALS.map((item) => (
            <motion.div
              key={item.id}
              className='bg-white border border-stone-200 p-6 flex flex-col'
              variants={fadeIn}
            >
              <div className='flex gap-0.5 mb-4'>
                {Array.from({ length: item.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className='w-3 h-3 text-amber-500 fill-amber-500'
                  />
                ))}
              </div>

              <Quote className='w-4 h-4 text-stone-200 mb-3' />

              <p className='text-stone-500 leading-relaxed text-sm flex-1 mb-5'>
                {item.quote}
              </p>

              <div className='border-t border-stone-100 pt-4'>
                <p className='text-stone-900 text-sm font-medium'>
                  {item.author}
                </p>
                <p className='text-stone-400 text-xs mt-0.5'>{item.event}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ══════════════════════════════════════════════════════════════
          FAQ
      ══════════════════════════════════════════════════════════════ */}
      <motion.section
        className='px-5 sm:px-8 lg:px-12 mt-12 sm:mt-16 lg:mt-20 pb-20'
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, margin: '-60px' }}
        variants={stagger}
      >
        <motion.div className='mb-8' variants={fadeIn}>
          <p className='text-amber-600 uppercase tracking-[0.25em] text-[11px] font-medium mb-2'>
            Information
          </p>
          <h2 className='text-xl sm:text-2xl lg:text-3xl font-light text-stone-900 tracking-tight'>
            Common <span className='font-semibold'>Questions</span>
          </h2>
        </motion.div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6'>
          {FAQ_ITEMS.map((faq, index) => (
            <motion.div
              key={index}
              className='border-b border-stone-200 pb-5'
              variants={fadeIn}
            >
              <h4 className='text-stone-900 font-medium text-sm mb-1.5'>
                {faq.q}
              </h4>
              <p className='text-stone-400 text-sm leading-relaxed'>{faq.a}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ══════════════════════════════════════════════════════════════
          FLOATING CTA
      ══════════════════════════════════════════════════════════════ */}
      <motion.div
        className='fixed bottom-5 right-5 z-50'
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5, duration: 0.4 }}
      >
        <button
          onClick={openModal}
          className='bg-stone-900 hover:bg-stone-800 text-white p-3 shadow-lg transition-colors duration-300'
          aria-label='Reserve karaoke experience'
        >
          <Mic className='w-4 h-4' />
        </button>
      </motion.div>

      {/* ── Modal ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isModalOpen && (
          <BookingModal
            isOpen={isModalOpen}
            onClose={closeModal}
            onConfirm={handleBooking}
            service={service}
            selectedExperience=''
            isLoading={isLoading}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default KaraokeServiceView;
