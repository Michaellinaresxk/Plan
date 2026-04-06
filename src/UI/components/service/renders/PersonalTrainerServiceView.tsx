import React, { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import {
  Clock,
  Star,
  MapPin,
  Target,
  Award,
  Users,
  CheckCircle,
  ArrowRight,
  AlertTriangle,
  Quote,
  Check,
  X,
} from 'lucide-react';
import BookingModal from '../../modal/BookingModal';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Service {
  id: string;
  name: string;
  price: number;
}
interface ServiceData {
  metaData?: { sessionDuration?: number };
}

interface PersonalTrainerServiceViewProps {
  service: Service;
  serviceData?: ServiceData;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SPECIALTIES = [
  {
    title: 'Strength & Conditioning',
    desc: 'Build lean muscle and functional strength',
    tag: 'Muscle',
    image:
      'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800&auto=format&fit=crop',
  },
  {
    title: 'HIIT & Cardio',
    desc: 'High-intensity workouts for fat loss and endurance',
    tag: 'Cardio',
    image:
      'https://images.unsplash.com/photo-1549476464-37392f717541?q=80&w=800&auto=format&fit=crop',
  },
  {
    title: 'Functional Movement',
    desc: 'Improve mobility and everyday movement patterns',
    tag: 'Mobility',
    image:
      'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?q=80&w=800&auto=format&fit=crop',
  },
  {
    title: 'Wellness & Recovery',
    desc: 'Holistic approach to fitness and well-being',
    tag: 'Recovery',
    image:
      'https://images.unsplash.com/photo-1506629905607-4d0ee439d067?q=80&w=800&auto=format&fit=crop',
  },
] as const;

const GALLERY = [
  {
    src: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800&auto=format&fit=crop',
    alt: 'Strength training',
  },
  {
    src: 'https://images.unsplash.com/photo-1549476464-37392f717541?q=80&w=800&auto=format&fit=crop',
    alt: 'Cardio session',
  },
  {
    src: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800&auto=format&fit=crop',
    alt: 'Functional training',
  },
  {
    src: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800&auto=format&fit=crop',
    alt: 'Beach training',
  },
] as const;

const INCLUDED = [
  'Certified personal trainer',
  'Custom workout plan',
  'Professional equipment',
  'Progress tracking',
  'Nutrition guidance',
  'Recovery techniques',
] as const;

const BENEFITS = [
  {
    icon: Target,
    title: 'Personalized Programs',
    desc: 'Custom workouts for your goals and fitness level',
  },
  {
    icon: Award,
    title: 'Certified Expertise',
    desc: 'Internationally certified trainers with proven results',
  },
  {
    icon: MapPin,
    title: 'Your Space, Your Pace',
    desc: 'Train at your villa, beach, gym, or outdoor locations',
  },
  {
    icon: Users,
    title: 'All Levels Welcome',
    desc: 'From complete beginners to advanced athletes',
  },
] as const;

const TESTIMONIALS = [
  {
    quote:
      'The personalized approach made all the difference. Every workout was tailored to my goals.',
    author: 'James C.',
    result: 'Gained 12kg muscle mass',
  },
  {
    quote:
      "At 42, I'm in the best shape of my life. Challenging but so rewarding.",
    author: 'Sarah K.',
    result: 'Improved strength by 150%',
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

const PersonalTrainerServiceView: React.FC<PersonalTrainerServiceViewProps> = ({
  service,
  serviceData,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const sessionDuration = serviceData?.metaData?.sessionDuration || 60;

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

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
          src='https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1400&auto=format&fit=crop'
          alt='Personal training session'
          fill
          className='object-cover'
          priority
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent' />

        <div className='relative z-10 h-full flex items-end'>
          <div className='w-full px-5 sm:px-8 lg:px-12 pb-10 sm:pb-14 lg:pb-16'>
            <div className='max-w-3xl'>
              <p className='text-amber-300 uppercase tracking-[0.3em] text-[11px] sm:text-xs font-medium mb-3'>
                Personal Training
              </p>
              <h1 className='text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-light text-white leading-[1.1] tracking-tight mb-3'>
                Your Fitness
                <br />
                <span className='font-semibold'>Journey Starts Here</span>
              </h1>
              <p className='text-white/55 text-sm sm:text-base max-w-md leading-relaxed font-light mb-5'>
                Certified trainers, personalized programs, and results that
                speak for themselves. Train anywhere — your villa, the beach, or
                a private gym.
              </p>

              <div className='flex flex-wrap gap-5 mb-7'>
                {[
                  { icon: Clock, text: `${sessionDuration} min` },
                  { icon: Star, text: '4.9 Rating' },
                  { icon: Users, text: '500+ Clients' },
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
                Book a Session
                <ArrowRight className='w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform' />
              </button>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── Specialties — 2×2 image grid with overlay ──────────── */}
      <motion.section
        className='px-5 sm:px-8 lg:px-12 py-14 sm:py-18 lg:py-20'
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, margin: '-60px' }}
        variants={stagger}
      >
        <motion.div className='mb-10' variants={fadeIn}>
          <p className='text-amber-600 uppercase tracking-[0.25em] text-[11px] font-medium mb-2'>
            Specialties
          </p>
          <h2 className='text-2xl sm:text-3xl lg:text-4xl font-light text-stone-900 tracking-tight'>
            Training <span className='font-semibold'>Programs</span>
          </h2>
        </motion.div>

        <div className='grid grid-cols-2 lg:grid-cols-4 gap-1.5 sm:gap-2'>
          {SPECIALTIES.map((s, i) => (
            <motion.div
              key={i}
              className='relative aspect-[3/4] overflow-hidden group'
              variants={fadeIn}
            >
              <Image
                src={s.image}
                alt={s.title}
                fill
                className='object-cover transition-transform duration-700 group-hover:scale-105'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent' />
              <div className='absolute top-2 left-2'>
                <span className='bg-white/90 text-stone-700 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wider'>
                  {s.tag}
                </span>
              </div>
              <div className='absolute bottom-0 left-0 right-0 p-4'>
                <h3 className='text-white text-sm font-medium mb-0.5'>
                  {s.title}
                </h3>
                <p className='text-white/50 text-[11px] leading-relaxed hidden sm:block'>
                  {s.desc}
                </p>
              </div>
            </motion.div>
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
            Training <span className='font-semibold'>Sessions</span>
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

      {/* ── Details — included + benefits + testimonials consolidated ── */}
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
            What You <span className='font-semibold'>Get</span>
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
                Each Session Includes
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
          </motion.div>

          {/* Benefits */}
          <motion.div
            className='border border-stone-200 bg-white p-6'
            variants={fadeIn}
          >
            <h3 className='text-xs font-semibold text-stone-900 uppercase tracking-[0.1em] mb-5'>
              Why Choose Us
            </h3>
            <div className='space-y-4'>
              {BENEFITS.map(({ icon: Icon, title, desc }, i) => (
                <div key={i} className='flex items-start gap-3'>
                  <Icon className='w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0' />
                  <div>
                    <p className='text-stone-900 text-xs font-medium'>
                      {title}
                    </p>
                    <p className='text-stone-400 text-[11px] leading-relaxed'>
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Testimonials */}
          <motion.div
            className='border border-stone-200 bg-white p-6'
            variants={fadeIn}
          >
            <h3 className='text-xs font-semibold text-stone-900 uppercase tracking-[0.1em] mb-5'>
              Client Stories
            </h3>
            <div className='space-y-5'>
              {TESTIMONIALS.map((t, i) => (
                <div
                  key={i}
                  className={i > 0 ? 'pt-5 border-t border-stone-100' : ''}
                >
                  <Quote className='w-4 h-4 text-stone-200 mb-2' />
                  <p className='text-stone-500 text-xs leading-relaxed mb-3'>
                    {t.quote}
                  </p>
                  <div>
                    <p className='text-stone-900 text-xs font-medium'>
                      {t.author}
                    </p>
                    <p className='text-amber-600 text-[11px]'>{t.result}</p>
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
          src='https://images.unsplash.com/photo-1549476464-37392f717541?q=80&w=1400&auto=format&fit=crop'
          alt='Training motivation'
          fill
          className='object-cover'
        />
        <div className='absolute inset-0 bg-stone-900/85' />
        <div className='relative z-10 py-14 sm:py-18 lg:py-22 px-5 sm:px-8 lg:px-12 text-center'>
          <p className='text-amber-400 uppercase tracking-[0.3em] text-[11px] font-medium mb-4'>
            Start Today
          </p>
          <h2 className='text-2xl sm:text-3xl lg:text-4xl font-light text-white mb-4 tracking-tight'>
            Your Transformation Begins with One Step
          </h2>
          <p className='text-white/40 text-sm max-w-md mx-auto leading-relaxed mb-8'>
            Join hundreds of clients who invested in themselves. Your future
            self will thank you.
          </p>
          <button
            onClick={openModal}
            className='group inline-flex items-center gap-2.5 bg-white text-stone-900 px-8 py-3.5 text-xs font-medium tracking-wide uppercase hover:bg-amber-50 transition-colors duration-300'
          >
            Book a Session
            <ArrowRight className='w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform' />
          </button>
        </div>
      </motion.section>

      {/* ── Disclaimer ─────────────────────────────────────────── */}
      <section className='px-5 sm:px-8 lg:px-12 py-5 bg-amber-50/50 border-t border-amber-200/40'>
        <div className='max-w-3xl mx-auto flex items-center gap-2.5'>
          <AlertTriangle className='w-3.5 h-3.5 text-amber-500 flex-shrink-0' />
          <p className='text-[11px] text-amber-700'>
            Please consult your physician before starting any fitness program.
            Sessions are adapted to your level and limitations.
          </p>
        </div>
      </section>

      {/* ── Modal ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {isModalOpen && (
          <BookingModal
            isOpen={isModalOpen}
            onClose={closeModal}
            onConfirm={openModal}
            service={service}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default PersonalTrainerServiceView;
