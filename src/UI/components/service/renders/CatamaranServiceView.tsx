import React, { useState, useMemo, useCallback } from 'react';
import {
  Star,
  Check,
  ArrowRight,
  X,
  Calendar,
  Clock,
  Info,
  Send,
  CheckCircle,
  AlertCircle,
  Users,
  Anchor,
  Waves,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import {
  CATAMARAN_DATA,
  features,
  reviews,
} from '@/constants/catamaran/catamaran';
import { useTranslation } from '@/lib/i18n/client';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const calculatePrice = (cat: any, size: number) => {
  const { minimumRate, baseGroupSize, additionalPersonRate } = cat.pricing;
  if (size <= baseGroupSize) return minimumRate;
  return minimumRate + (size - baseGroupSize) * additionalPersonRate;
};

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

// ─── Inquiry Modal ────────────────────────────────────────────────────────────

const InquiryModal: React.FC<{ catamaran: any; onClose: () => void }> = ({
  catamaran,
  onClose,
}) => {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    date: '',
    guests: 2,
    timeSlot: catamaran.timeSlots?.[0]?.id || 'morning',
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const inputBase =
    'w-full p-3 border rounded-none bg-stone-50 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900 transition-colors';

  const handleSubmit = async () => {
    if (!form.date || !form.name || !form.email || !form.phone) {
      setError('Please complete all required fields.');
      return;
    }
    setError('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/services/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceName: catamaran.name,
          serviceType: 'catamaran',
          customerName: form.name,
          customerEmail: form.email,
          customerPhone: form.phone,
          tourDate: form.date,
          timeSlot: form.timeSlot,
          totalGuests: form.guests,
          message: form.message,
        }),
      });
      if (!res.ok) throw new Error('Failed to send');
      setSuccess(true);
      setTimeout(onClose, 2000);
    } catch {
      setError('Unable to send inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className='fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4'
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='bg-white border border-stone-200 max-w-xl w-full max-h-[90vh] overflow-y-auto'
      >
        <div className='bg-stone-900 px-6 py-5 flex items-center justify-between'>
          <div>
            <h2 className='text-white text-base font-medium'>
              {catamaran.name}
            </h2>
            <p className='text-stone-400 text-xs mt-0.5'>Send an inquiry</p>
          </div>
          <button
            onClick={onClose}
            className='w-8 h-8 bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors'
          >
            <X className='w-3.5 h-3.5' />
          </button>
        </div>

        {success ? (
          <div className='p-10 text-center'>
            <CheckCircle className='w-10 h-10 text-emerald-500 mx-auto mb-3' />
            <p className='text-stone-900 text-sm font-medium'>
              Inquiry sent successfully
            </p>
            <p className='text-stone-400 text-xs mt-1'>
              We'll be in touch shortly.
            </p>
          </div>
        ) : (
          <div className='p-6 space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='block text-xs font-medium text-stone-700 mb-1.5'>
                  Date <span className='text-amber-600'>*</span>
                </label>
                <input
                  type='date'
                  min={new Date().toISOString().split('T')[0]}
                  value={form.date}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, date: e.target.value }))
                  }
                  className={`${inputBase} border-stone-300`}
                />
              </div>
              <div>
                <label className='block text-xs font-medium text-stone-700 mb-1.5'>
                  Guests <span className='text-amber-600'>*</span>
                </label>
                <select
                  value={form.guests}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, guests: +e.target.value }))
                  }
                  className={`${inputBase} border-stone-300`}
                >
                  {Array.from(
                    { length: catamaran.capacity || 30 },
                    (_, i) => i + 1,
                  ).map((n) => (
                    <option key={n} value={n}>
                      {n} {n > 1 ? 'guests' : 'guest'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {catamaran.timeSlots?.length > 0 && (
              <div>
                <label className='block text-xs font-medium text-stone-700 mb-1.5'>
                  Time Slot <span className='text-amber-600'>*</span>
                </label>
                <div className='grid grid-cols-2 gap-2'>
                  {catamaran.timeSlots.map((slot: any) => (
                    <button
                      key={slot.id}
                      type='button'
                      onClick={() =>
                        setForm((p) => ({ ...p, timeSlot: slot.id }))
                      }
                      className={`flex items-center justify-center gap-1.5 border p-3 text-xs transition-colors ${
                        form.timeSlot === slot.id
                          ? 'border-stone-900 bg-stone-50'
                          : 'border-stone-200 hover:border-stone-400'
                      }`}
                    >
                      <Clock className='w-3 h-3' />
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className='block text-xs font-medium text-stone-700 mb-1.5'>
                Full Name <span className='text-amber-600'>*</span>
              </label>
              <input
                type='text'
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                placeholder='Your name'
                className={`${inputBase} border-stone-300`}
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='block text-xs font-medium text-stone-700 mb-1.5'>
                  Email <span className='text-amber-600'>*</span>
                </label>
                <input
                  type='email'
                  value={form.email}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, email: e.target.value }))
                  }
                  placeholder='you@email.com'
                  className={`${inputBase} border-stone-300`}
                />
              </div>
              <div>
                <label className='block text-xs font-medium text-stone-700 mb-1.5'>
                  Phone <span className='text-amber-600'>*</span>
                </label>
                <input
                  type='tel'
                  value={form.phone}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, phone: e.target.value }))
                  }
                  placeholder='+1 (555) 000-0000'
                  className={`${inputBase} border-stone-300`}
                />
              </div>
            </div>

            <div>
              <label className='block text-xs font-medium text-stone-700 mb-1.5'>
                Message
              </label>
              <textarea
                value={form.message}
                onChange={(e) =>
                  setForm((p) => ({ ...p, message: e.target.value }))
                }
                rows={2}
                placeholder='Special requests...'
                className={`${inputBase} border-stone-300 resize-none`}
              />
            </div>

            {error && (
              <div className='flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-xs text-red-800'>
                <AlertCircle className='w-3.5 h-3.5 flex-shrink-0' />
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className='w-full bg-stone-900 text-white py-3 text-xs font-medium tracking-wide uppercase hover:bg-stone-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2'
            >
              {isSubmitting ? (
                <div className='w-4 h-4 border-2 border-stone-600 border-t-white rounded-full animate-spin' />
              ) : (
                <Send className='w-3.5 h-3.5' />
              )}
              {isSubmitting ? 'Sending...' : 'Send Inquiry'}
            </button>

            <p className='text-[10px] text-stone-400 text-center'>
              Our team will confirm availability and pricing within 24 hours.
            </p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const CatamaranServiceView: React.FC = () => {
  const { t } = useTranslation();
  const [selectedCatamaran, setSelectedCatamaran] = useState<any>(null);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const catamarans = useMemo(() => Object.values(CATAMARAN_DATA), []);

  const openInquiry = useCallback((cat: any) => {
    const enriched = {
      ...cat,
      pricing: cat.pricing || {
        minimumRate: cat.price * 4,
        baseGroupSize: 5,
        additionalPersonRate: cat.price,
        currency: 'USD',
      },
      includes: cat.includes || [],
      timeSlots: cat.timeSlots || [
        { id: 'morning', time: '8:30 AM – 11:30 AM' },
        { id: 'midday', time: '11:30 AM – 2:30 PM' },
        { id: 'afternoon', time: '2:30 PM – 5:30 PM' },
      ],
      capacity: cat.capacity || 30,
    };
    setSelectedCatamaran(enriched);
    setIsInquiryOpen(true);
  }, []);

  const galleryImages = useMemo(
    () => [
      {
        src: 'https://res.cloudinary.com/ddg92xar5/image/upload/v1756802356/3_syxzqo.jpg',
        alt: 'Crystal waters',
      },
      {
        src: 'https://res.cloudinary.com/ddg92xar5/image/upload/v1756802334/1_wvnp2r.jpg',
        alt: 'Snorkel adventure',
      },
      {
        src: 'https://res.cloudinary.com/ddg92xar5/image/upload/v1756802334/2_vrbyj2.jpg',
        alt: 'Water activities',
      },
      {
        src: 'https://res.cloudinary.com/ddg92xar5/image/upload/v1756802312/3_cz2ios.jpg',
        alt: 'Sunset views',
      },
    ],
    [],
  );

  return (
    <div className='min-h-screen bg-stone-50'>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <motion.section
        className='relative w-full h-[55vh] sm:h-[60vh] lg:h-[70vh]'
        initial='hidden'
        animate='visible'
        variants={fadeIn}
      >
        <Image
          src={
            catamarans[0]?.heroImage ||
            catamarans[0]?.image ||
            '/img/catamaran.jpg'
          }
          alt='Catamaran experience'
          fill
          className='object-cover'
          priority
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent' />

        <div className='relative z-10 h-full flex items-end'>
          <div className='w-full px-5 sm:px-8 lg:px-12 pb-10 sm:pb-14 lg:pb-16'>
            <div className='max-w-3xl'>
              <p className='text-amber-300 uppercase tracking-[0.3em] text-[11px] sm:text-xs font-medium mb-3'>
                Catamaran Experience
              </p>
              <h1 className='text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-light text-white leading-[1.1] tracking-tight mb-3'>
                Sail the <span className='font-semibold'>Caribbean</span>
              </h1>
              <p className='text-white/55 text-sm sm:text-base max-w-md leading-relaxed font-light mb-5'>
                Crystal-clear waters, pristine beaches, and unforgettable
                moments aboard our premium catamarans.
              </p>
              <div className='flex flex-wrap gap-5 mb-7'>
                {[
                  { icon: Anchor, text: `${catamarans.length} Catamarans` },
                  { icon: Star, text: '5.0 Rating' },
                  { icon: Users, text: 'Up to 30 Guests' },
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
              <a
                href='#fleet'
                className='group inline-flex items-center gap-2.5 bg-white text-stone-900 px-6 py-3 text-xs font-medium tracking-wide uppercase hover:bg-amber-50 transition-colors duration-300'
              >
                Explore Fleet{' '}
                <ArrowRight className='w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform' />
              </a>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── Fleet Selection ───────────────────────────────────── */}
      <motion.section
        id='fleet'
        className='px-5 sm:px-8 lg:px-12 py-14 sm:py-18 lg:py-20'
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, margin: '-60px' }}
        variants={stagger}
      >
        <motion.div className='mb-10' variants={fadeIn}>
          <p className='text-amber-600 uppercase tracking-[0.25em] text-[11px] font-medium mb-2'>
            Our Fleet
          </p>
          <h2 className='text-2xl sm:text-3xl lg:text-4xl font-light text-stone-900 tracking-tight'>
            Choose Your <span className='font-semibold'>Catamaran</span>
          </h2>
        </motion.div>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          {catamarans.map((cat: any) => (
            <motion.div
              key={cat.id}
              variants={fadeIn}
              className='group relative overflow-hidden cursor-pointer'
              onClick={() => openInquiry(cat)}
            >
              <div className='relative aspect-[3/2]'>
                <Image
                  src={cat.image || cat.heroImage}
                  alt={cat.name}
                  fill
                  className='object-cover transition-transform duration-700 group-hover:scale-105'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent' />
                {cat.premium && (
                  <div className='absolute top-2 right-2'>
                    <span className='bg-black/50 backdrop-blur-sm text-amber-400 border border-amber-500/30 px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.1em]'>
                      Premium
                    </span>
                  </div>
                )}
                <div className='absolute bottom-0 left-0 right-0 p-4 sm:p-5'>
                  <div className='flex items-end justify-between'>
                    <div>
                      <h3 className='text-white text-base sm:text-lg font-medium mb-0.5'>
                        {cat.name}
                      </h3>
                      <p className='text-white/50 text-xs'>{cat.mood}</p>
                    </div>
                    <div className='text-right'>
                      <span className='text-white text-lg font-light'>
                        ${cat.price}
                      </span>
                      <span className='text-white/50 text-[11px] block'>
                        /person
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── Gallery ──────────────────────────────────────────── */}
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
          {galleryImages.map((img, i) => (
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

      {/* ── Reviews ──────────────────────────────────────────── */}
      <motion.section
        className='px-5 sm:px-8 lg:px-12 pb-14 sm:pb-18 lg:pb-20'
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, margin: '-60px' }}
        variants={stagger}
      >
        <motion.div className='mb-10' variants={fadeIn}>
          <p className='text-amber-600 uppercase tracking-[0.25em] text-[11px] font-medium mb-2'>
            Reviews
          </p>
          <h2 className='text-2xl sm:text-3xl lg:text-4xl font-light text-stone-900 tracking-tight'>
            Guest <span className='font-semibold'>Stories</span>
          </h2>
        </motion.div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          {reviews.map((review: any, i: number) => (
            <motion.div
              key={i}
              className='bg-white border border-stone-200 p-6'
              variants={fadeIn}
            >
              <div className='flex gap-0.5 mb-4'>
                {Array.from({ length: review.rating }).map((_, j) => (
                  <Star
                    key={j}
                    className='w-3 h-3 text-amber-500 fill-amber-500'
                  />
                ))}
              </div>
              <p className='text-stone-500 text-sm leading-relaxed mb-4'>
                {review.text}
              </p>
              <div className='border-t border-stone-100 pt-4'>
                <p className='text-stone-900 text-sm font-medium'>
                  {review.name}
                </p>
                <p className='text-stone-400 text-xs'>{review.experience}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className='relative w-full'>
        <Image
          src='https://images.pexels.com/photos/4784342/pexels-photo-4784342.jpeg'
          alt='Caribbean'
          fill
          className='object-cover'
        />
        <div className='absolute inset-0 bg-stone-900/85' />
        <div className='relative z-10 py-14 sm:py-18 lg:py-22 px-5 sm:px-8 lg:px-12 text-center'>
          <p className='text-amber-400 uppercase tracking-[0.3em] text-[11px] font-medium mb-4'>
            Book Today
          </p>
          <h2 className='text-2xl sm:text-3xl lg:text-4xl font-light text-white mb-4 tracking-tight'>
            {t('services.standard.catamaranServiceView.cta.title')}
          </h2>
          <p className='text-white/40 text-sm max-w-md mx-auto leading-relaxed mb-8'>
            {t('services.standard.catamaranServiceView.cta.subtitle')}
          </p>
          <a
            href='#fleet'
            className='group inline-flex items-center gap-2.5 bg-white text-stone-900 px-8 py-3.5 text-xs font-medium tracking-wide uppercase hover:bg-amber-50 transition-colors duration-300'
          >
            {t('services.standard.catamaranServiceView.cta.button')}
            <ArrowRight className='w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform' />
          </a>
        </div>
      </section>

      {/* ── Inquiry Modal ────────────────────────────────────── */}
      <AnimatePresence>
        {isInquiryOpen && selectedCatamaran && (
          <InquiryModal
            catamaran={selectedCatamaran}
            onClose={() => {
              setIsInquiryOpen(false);
              setSelectedCatamaran(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CatamaranServiceView;
