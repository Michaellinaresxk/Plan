import React, { useState } from 'react';
import {
  CheckCircle,
  Star,
  Calendar,
  MapPin,
  X,
  Camera,
  Music,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
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

interface CustomDecorationsServiceViewProps {
  service: Service;
  serviceData?: ServiceData;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  {
    title: 'Setups',
    subtitle: 'Candlelit elegance for intimate celebrations',
    image:
      'https://res.cloudinary.com/ddg92xar5/image/upload/v1755948162/15_wb6sud.jpg',
  },
  {
    title: 'Birthday Themes',
    subtitle: 'Custom themes for all ages',
    image:
      'https://res.cloudinary.com/ddg92xar5/image/upload/v1755947783/12_gvtwpq.jpg',
  },
  {
    title: 'Custom Decorations',
    subtitle: 'Balloon arrangements and beach setups',
    image:
      'https://res.cloudinary.com/ddg92xar5/image/upload/v1755947354/6_ynxqug.jpg',
  },
  {
    title: 'Outdoor',
    subtitle: 'Elegant outdoor dining experiences',
    image:
      'https://res.cloudinary.com/ddg92xar5/image/upload/v1755947876/5_dqdkjs.jpg',
  },
] as const;

const GALLERY = [
  {
    src: 'https://res.cloudinary.com/ddg92xar5/image/upload/v1755947286/10_m1ilvn.jpg',
    alt: 'Bride setup',
    tag: 'Bride',
  },
  {
    src: 'https://res.cloudinary.com/ddg92xar5/image/upload/v1755947306/13_x2egzu.jpg',
    alt: 'Birthday theme',
    tag: 'Birthday',
  },
  {
    src: 'https://res.cloudinary.com/ddg92xar5/image/upload/v1755947289/7_ux3z8d.jpg',
    alt: 'Anniversary',
    tag: 'Anniversary',
  },
  {
    src: 'https://res.cloudinary.com/ddg92xar5/image/upload/v1755947332/17_shvrpj.jpg',
    alt: 'Dinner setup',
    tag: 'Dinner',
  },
  {
    src: 'https://res.cloudinary.com/ddg92xar5/image/upload/v1755947279/9_kvn1mw.jpg',
    alt: 'Celebration',
    tag: 'Celebration',
  },
  {
    src: 'https://res.cloudinary.com/ddg92xar5/image/upload/v1755947273/2_c49vqp.jpg',
    alt: 'Balloons',
    tag: 'Balloons',
  },
] as const;

const INCLUDED = [
  'Custom Design Consultation',
  'Full Setup & Breakdown',
  'Decor Materials & Styling',
  'Lighting (if needed)',
  'Optional Add-ons: Cake, Flowers, Welcome Signs',
] as const;

const PROCESS = [
  { step: '01', text: 'Theme & color palette consultation' },
  { step: '02', text: 'On-site setup before your event' },
  { step: '03', text: 'Beautiful decor tailored to you' },
  { step: '04', text: 'Timely breakdown & clean-up' },
] as const;

const EXTRAS = [
  { icon: Camera, name: 'Photography' },
  { icon: Music, name: 'Live Music' },
  { icon: Star, name: 'Catering' },
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

const CustomDecorationsServiceView: React.FC<
  CustomDecorationsServiceViewProps
> = ({ service }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className='min-h-screen bg-stone-50'>
      {/* ══════════════════════════════════════════════════════════
          HERO (kept as-is)
      ══════════════════════════════════════════════════════════ */}
      <motion.section
        className='relative w-full h-[55vh] sm:h-[60vh] lg:h-[70vh]'
        initial='hidden'
        animate='visible'
        variants={fadeIn}
      >
        <Image
          src='https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=1400'
          alt='Custom Decoration Service'
          fill
          className='object-cover'
          priority
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent' />

        <div className='relative z-10 h-full flex items-end'>
          <div className='w-full px-5 sm:px-8 lg:px-12 pb-10 sm:pb-14 lg:pb-16'>
            <div className='max-w-3xl'>
              <p className='text-amber-300 uppercase tracking-[0.3em] text-[11px] sm:text-xs font-medium mb-3'>
                Decoration Service
              </p>
              <h1 className='text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-light text-white leading-[1.1] tracking-tight mb-3'>
                Create a<br />
                <span className='font-semibold'>Memorable Setting</span>
              </h1>
              <p className='text-white/55 text-sm sm:text-base max-w-md leading-relaxed font-light mb-7'>
                Transform any space into a celebration with personalized
                decoration — elegance and creativity, delivered.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className='group inline-flex items-center gap-2.5 bg-white text-stone-900 px-6 py-3 text-xs font-medium tracking-wide uppercase hover:bg-amber-50 transition-colors duration-300'
              >
                Plan My Decoration
                <ArrowRight className='w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform' />
              </button>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ══════════════════════════════════════════════════════════
          CATEGORIES — 2x2 compact grid with text overlay
      ══════════════════════════════════════════════════════════ */}
      <motion.section
        className='px-5 sm:px-8 lg:px-12 py-14 sm:py-18 lg:py-20'
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, margin: '-60px' }}
        variants={stagger}
      >
        <motion.div className='mb-10' variants={fadeIn}>
          <p className='text-amber-600 uppercase tracking-[0.25em] text-[11px] font-medium mb-2'>
            Our Craft
          </p>
          <h2 className='text-2xl sm:text-3xl lg:text-4xl font-light text-stone-900 tracking-tight'>
            Let's Create Something{' '}
            <span className='font-semibold'>Beautiful</span>
          </h2>
        </motion.div>

        <div className='grid grid-cols-2 lg:grid-cols-4 gap-1.5 sm:gap-2'>
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={i}
              className='relative aspect-[3/4] overflow-hidden group'
              variants={fadeIn}
            >
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                className='object-cover transition-transform duration-700 group-hover:scale-105'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent' />

              <div className='absolute bottom-0 left-0 right-0 p-4 sm:p-5'>
                <h3 className='text-white text-sm sm:text-base font-medium mb-0.5'>
                  {cat.title}
                </h3>
                <p className='text-white/50 text-[11px] sm:text-xs leading-relaxed hidden sm:block'>
                  {cat.subtitle}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ══════════════════════════════════════════════════════════
          GALLERY — 3 cols, compact landscape ratio
      ══════════════════════════════════════════════════════════ */}
      <motion.section
        className='px-5 sm:px-8 lg:px-12 pb-14 sm:pb-18 lg:pb-20'
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, margin: '-60px' }}
        variants={stagger}
      >
        <motion.div className='mb-8' variants={fadeIn}>
          <p className='text-amber-600 uppercase tracking-[0.25em] text-[11px] font-medium mb-2'>
            Portfolio
          </p>
          <h2 className='text-2xl sm:text-3xl lg:text-4xl font-light text-stone-900 tracking-tight'>
            Our <span className='font-semibold'>Work</span>
          </h2>
        </motion.div>

        <div className='grid grid-cols-2 sm:grid-cols-3 gap-1.5 sm:gap-2'>
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

              <div className='absolute top-2 left-2'>
                <span className='bg-white/90 backdrop-blur-sm text-stone-700 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wider'>
                  {img.tag}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ══════════════════════════════════════════════════════════
          SERVICE DETAILS — consolidated: included + process + extras
          Split layout: left info, right process
      ══════════════════════════════════════════════════════════ */}
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
          {/* Column 1 — What's Included */}
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
                  <CheckCircle className='w-3 h-3 text-emerald-500 mt-0.5 flex-shrink-0' />
                  <span className='text-stone-600 text-xs leading-relaxed'>
                    {item}
                  </span>
                </div>
              ))}
            </div>

            {/* Not included */}
            <div className='border-t border-stone-100 mt-5 pt-5'>
              <div className='flex items-start gap-2.5'>
                <X className='w-3 h-3 text-stone-300 mt-0.5 flex-shrink-0' />
                <span className='text-stone-400 text-xs'>
                  Gratuity (optional)
                </span>
              </div>
            </div>
          </motion.div>

          {/* Column 2 — Process */}
          <motion.div
            className='border border-stone-200 bg-white p-6'
            variants={fadeIn}
          >
            <h3 className='text-xs font-semibold text-stone-900 uppercase tracking-[0.1em] mb-5'>
              Process
            </h3>

            <div className='space-y-4'>
              {PROCESS.map(({ step, text }) => (
                <div key={step} className='flex items-start gap-3'>
                  <span className='text-[10px] font-semibold text-amber-600 mt-0.5 w-4 flex-shrink-0'>
                    {step}
                  </span>
                  <p className='text-stone-600 text-xs leading-relaxed'>
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Column 3 — Extras + Logistics */}
          <motion.div
            className='border border-stone-200 bg-white p-6'
            variants={fadeIn}
          >
            <h3 className='text-xs font-semibold text-stone-900 uppercase tracking-[0.1em] mb-5'>
              Extras Available
            </h3>

            <div className='space-y-3 mb-6'>
              {EXTRAS.map(({ icon: Icon, name }, i) => (
                <div key={i} className='flex items-center gap-3'>
                  <div className='w-7 h-7 bg-stone-100 flex items-center justify-center flex-shrink-0'>
                    <Icon className='w-3.5 h-3.5 text-stone-500' />
                  </div>
                  <span className='text-stone-600 text-xs'>{name}</span>
                </div>
              ))}
            </div>

            <div className='border-t border-stone-100 pt-5 space-y-3'>
              <div className='flex items-start gap-2.5'>
                <Calendar className='w-3.5 h-3.5 text-stone-400 mt-0.5 flex-shrink-0' />
                <div>
                  <p className='text-stone-900 text-xs font-medium'>
                    48h advance notice
                  </p>
                  <p className='text-stone-400 text-[11px]'>
                    Required for all bookings
                  </p>
                </div>
              </div>
              <div className='flex items-start gap-2.5'>
                <MapPin className='w-3.5 h-3.5 text-stone-400 mt-0.5 flex-shrink-0' />
                <div>
                  <p className='text-stone-900 text-xs font-medium'>
                    Indoor or Outdoor
                  </p>
                  <p className='text-stone-400 text-[11px]'>
                    We adapt to your venue
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* ══════════════════════════════════════════════════════════
          TESTIMONIAL — compact full-bleed
      ══════════════════════════════════════════════════════════ */}
      <section className='relative w-full bg-stone-900 py-12 sm:py-16 px-5 sm:px-8 lg:px-12'>
        <div className='max-w-xl mx-auto text-center'>
          <div className='flex justify-center gap-0.5 mb-5'>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className='w-3 h-3 text-amber-500 fill-amber-500' />
            ))}
          </div>
          <blockquote className='text-white/70 text-base sm:text-lg font-light leading-relaxed mb-4'>
            "Every celebration deserves a personal touch. We handle every detail
            so you can focus on enjoying the moment."
          </blockquote>
          <p className='text-stone-600 text-[10px] uppercase tracking-[0.2em]'>
            Why Choose Us
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          CTA — book now strip
      ══════════════════════════════════════════════════════════ */}
      <section className='px-5 sm:px-8 lg:px-12 py-10 sm:py-12 bg-white border-t border-stone-200'>
        <div className='max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6'>
          <div>
            <h3 className='text-stone-900 text-base sm:text-lg font-light tracking-tight'>
              Ready to create your{' '}
              <span className='font-semibold'>setting</span>?
            </h3>
            <p className='text-stone-400 text-xs mt-1'>
              Minimum 48 hours notice — we adapt to space, weather, and personal
              style
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className='group inline-flex items-center gap-2.5 bg-stone-900 text-white px-7 py-3 text-xs font-medium tracking-wide uppercase hover:bg-stone-800 transition-colors duration-300 flex-shrink-0'
          >
            Book Now
            <ArrowRight className='w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform' />
          </button>
        </div>
      </section>

      {/* ── Notice ───────────────────────────────────────────────── */}
      <section className='px-5 sm:px-8 lg:px-12 py-4 bg-amber-50/50 border-t border-amber-200/40'>
        <div className='max-w-3xl mx-auto flex items-center gap-2.5'>
          <AlertTriangle className='w-3.5 h-3.5 text-amber-500 flex-shrink-0' />
          <p className='text-[11px] text-amber-700'>
            Please provide accurate setup location details and timing. Minimum
            48 hours advance notice required.
          </p>
        </div>
      </section>

      {/* ── Modal ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isModalOpen && (
          <BookingModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConfirm={() => setIsModalOpen(true)}
            service={service}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomDecorationsServiceView;
