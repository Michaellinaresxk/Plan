import React, { useState, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useReservation } from '@/context/BookingContext';
import {
  ArrowRight,
  Clock,
  Star,
  Users,
  Shield,
  CheckCircle,
  Check,
  Quote,
  AlertTriangle,
} from 'lucide-react';
import MassageConfigModal from '../massage/MassageConfigModal';
import FilterBar from '../massage/FilterBar';
import MassageCard from '../massage/MassageCard';
import { useTranslation } from '@/lib/i18n/client';

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

// ─── Constants ────────────────────────────────────────────────────────────────

const INCLUDED = [
  'Licensed massage therapist',
  'Premium organic oils',
  'Customized pressure',
  'At your location',
  'Flexible scheduling',
  'Post-session guidance',
] as const;

const TESTIMONIALS = [
  {
    quote:
      'The best massage experience we had on vacation. Professional and perfectly tailored.',
    author: 'Maria L.',
    result: 'Couples deep tissue session',
  },
  {
    quote:
      'Having a licensed therapist come to our villa was incredibly convenient and relaxing.',
    author: 'David R.',
    result: 'Swedish massage at villa',
  },
] as const;

const GALLERY = [
  {
    src: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=800&auto=format&fit=crop',
    alt: 'Swedish massage',
  },
  {
    src: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=800&auto=format&fit=crop',
    alt: 'Deep tissue therapy',
  },
  {
    src: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?q=80&w=800&auto=format&fit=crop',
    alt: 'Aromatherapy session',
  },
  {
    src: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?q=80&w=800&auto=format&fit=crop',
    alt: 'Thai massage',
  },
] as const;

// ─── Component ────────────────────────────────────────────────────────────────

const MassageServiceView = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { setReservationData } = useReservation();

  const [currentMassage, setCurrentMassage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    intensity: '',
    priceRange: '',
    premiumOnly: false,
  });

  // Build massage services from translations
  const SPA_SERVICES = useMemo(
    () => ({
      massages: [
        {
          id: 'swedish',
          name: t('services.standard.massageView.massages.swedish.name'),
          description: t(
            'services.standard.massageView.massages.swedish.description',
          ),
          longDescription: t(
            'services.standard.massageView.massages.swedish.longDescription',
          ),
          category: 'relaxation',
          durations: [
            { duration: 60, price: 120, popular: false },
            { duration: 90, price: 160, popular: true },
          ],
          emoji: t('services.standard.massageView.massages.swedish.emoji'),
          maxPersons: 4,
          intensity: 'gentle',
          isPremium: false,
          imageUrl:
            'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800',
          benefits: [
            t('services.standard.massageView.massages.swedish.benefits.stress'),
            t(
              'services.standard.massageView.massages.swedish.benefits.circulation',
            ),
            t('services.standard.massageView.massages.swedish.benefits.sleep'),
            t(
              'services.standard.massageView.massages.swedish.benefits.relaxation',
            ),
          ],
          perfectFor: [
            t(
              'services.standard.massageView.massages.swedish.perfectFor.firstTime',
            ),
            t(
              'services.standard.massageView.massages.swedish.perfectFor.stress',
            ),
            t(
              'services.standard.massageView.massages.swedish.perfectFor.wellness',
            ),
          ],
          techniques: [
            t(
              'services.standard.massageView.massages.swedish.techniques.strokes',
            ),
            t(
              'services.standard.massageView.massages.swedish.techniques.kneading',
            ),
            t(
              'services.standard.massageView.massages.swedish.techniques.aromatherapy',
            ),
          ],
        },
        {
          id: 'deep-tissue',
          name: t('services.standard.massageView.massages.deepTissue.name'),
          description: t(
            'services.standard.massageView.massages.deepTissue.description',
          ),
          longDescription: t(
            'services.standard.massageView.massages.deepTissue.longDescription',
          ),
          category: 'therapeutic',
          durations: [
            { duration: 60, price: 140, popular: false },
            { duration: 90, price: 180, popular: true },
          ],
          emoji: t('services.standard.massageView.massages.deepTissue.emoji'),
          maxPersons: 2,
          intensity: 'strong',
          isPremium: true,
          imageUrl:
            'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800',
          benefits: [
            t(
              'services.standard.massageView.massages.deepTissue.benefits.pain',
            ),
            t(
              'services.standard.massageView.massages.deepTissue.benefits.tension',
            ),
            t(
              'services.standard.massageView.massages.deepTissue.benefits.mobility',
            ),
            t(
              'services.standard.massageView.massages.deepTissue.benefits.recovery',
            ),
          ],
          perfectFor: [
            t(
              'services.standard.massageView.massages.deepTissue.perfectFor.athletes',
            ),
            t(
              'services.standard.massageView.massages.deepTissue.perfectFor.pain',
            ),
            t(
              'services.standard.massageView.massages.deepTissue.perfectFor.injury',
            ),
          ],
          techniques: [
            t(
              'services.standard.massageView.massages.deepTissue.techniques.pressure',
            ),
            t(
              'services.standard.massageView.massages.deepTissue.techniques.trigger',
            ),
            t(
              'services.standard.massageView.massages.deepTissue.techniques.myofascial',
            ),
          ],
        },
        {
          id: 'hot-stone',
          name: t('services.standard.massageView.massages.hotStone.name'),
          description: t(
            'services.standard.massageView.massages.hotStone.description',
          ),
          longDescription: t(
            'services.standard.massageView.massages.hotStone.longDescription',
          ),
          category: 'signature',
          durations: [{ duration: 90, price: 200, popular: true }],
          emoji: t('services.standard.massageView.massages.hotStone.emoji'),
          maxPersons: 2,
          intensity: 'medium',
          isPremium: true,
          imageUrl:
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
          benefits: [
            t(
              'services.standard.massageView.massages.hotStone.benefits.relaxation',
            ),
            t('services.standard.massageView.massages.hotStone.benefits.blood'),
            t(
              'services.standard.massageView.massages.hotStone.benefits.tension',
            ),
            t(
              'services.standard.massageView.massages.hotStone.benefits.spiritual',
            ),
          ],
          perfectFor: [
            t(
              'services.standard.massageView.massages.hotStone.perfectFor.relaxation',
            ),
            t(
              'services.standard.massageView.massages.hotStone.perfectFor.weather',
            ),
            t(
              'services.standard.massageView.massages.hotStone.perfectFor.spiritual',
            ),
          ],
          techniques: [
            t(
              'services.standard.massageView.massages.hotStone.techniques.placement',
            ),
            t(
              'services.standard.massageView.massages.hotStone.techniques.massage',
            ),
            t(
              'services.standard.massageView.massages.hotStone.techniques.energy',
            ),
          ],
        },
        {
          id: 'aromatherapy',
          name: t('services.standard.massageView.massages.aromatherapy.name'),
          description: t(
            'services.standard.massageView.massages.aromatherapy.description',
          ),
          longDescription: t(
            'services.standard.massageView.massages.aromatherapy.longDescription',
          ),
          category: 'relaxation',
          durations: [
            { duration: 60, price: 130, popular: false },
            { duration: 90, price: 170, popular: true },
          ],
          emoji: t('services.standard.massageView.massages.aromatherapy.emoji'),
          maxPersons: 3,
          intensity: 'gentle',
          isPremium: false,
          imageUrl:
            'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=800',
          benefits: [
            t(
              'services.standard.massageView.massages.aromatherapy.benefits.clarity',
            ),
            t(
              'services.standard.massageView.massages.aromatherapy.benefits.balance',
            ),
            t(
              'services.standard.massageView.massages.aromatherapy.benefits.stress',
            ),
            t(
              'services.standard.massageView.massages.aromatherapy.benefits.mood',
            ),
          ],
          perfectFor: [
            t(
              'services.standard.massageView.massages.aromatherapy.perfectFor.emotional',
            ),
            t(
              'services.standard.massageView.massages.aromatherapy.perfectFor.lovers',
            ),
            t(
              'services.standard.massageView.massages.aromatherapy.perfectFor.holistic',
            ),
          ],
          techniques: [
            t(
              'services.standard.massageView.massages.aromatherapy.techniques.blending',
            ),
            t(
              'services.standard.massageView.massages.aromatherapy.techniques.lymphatic',
            ),
            t(
              'services.standard.massageView.massages.aromatherapy.techniques.chakra',
            ),
          ],
        },
        {
          id: 'prenatal',
          name: t('services.standard.massageView.massages.prenatal.name'),
          description: t(
            'services.standard.massageView.massages.prenatal.description',
          ),
          longDescription: t(
            'standard.massageView.massages.prenatal.longDescription',
          ),
          category: 'therapeutic',
          durations: [{ duration: 60, price: 150, popular: true }],
          emoji: t('standard.massageView.massages.prenatal.emoji'),
          maxPersons: 1,
          intensity: 'gentle',
          isPremium: true,
          imageUrl:
            'https://images.unsplash.com/photo-1527196850338-c9e2cfac4d5a?w=800',
          benefits: [
            t(
              'services.standard.massageView.massages.prenatal.benefits.comfort',
            ),
            t(
              'services.standard.massageView.massages.prenatal.benefits.swelling',
            ),
            t('services.standard.massageView.massages.prenatal.benefits.pain'),
            t('services.standard.massageView.massages.prenatal.benefits.sleep'),
          ],
          perfectFor: [
            t(
              'services.standard.massageView.massages.prenatal.perfectFor.pregnant',
            ),
            t(
              'services.standard.massageView.massages.prenatal.perfectFor.pain',
            ),
            t(
              'services.standard.massageView.massages.prenatal.perfectFor.support',
            ),
          ],
          techniques: [
            t(
              'services.standard.massageView.massages.prenatal.techniques.positioning',
            ),
            t(
              'services.standard.massageView.massages.prenatal.techniques.pressure',
            ),
            t(
              'services.standard.massageView.massages.prenatal.techniques.safe',
            ),
          ],
        },
        {
          id: 'sports',
          name: t('services.standard.massageView.massages.sports.name'),
          description: t(
            'services.standard.massageView.massages.sports.description',
          ),
          longDescription: t(
            'services.standard.massageView.massages.sports.longDescription',
          ),
          category: 'therapeutic',
          durations: [
            { duration: 60, price: 155, popular: false },
            { duration: 90, price: 195, popular: true },
          ],
          emoji: t('sservices.tandard.massageView.massages.sports.emoji'),
          maxPersons: 2,
          intensity: 'strong',
          isPremium: false,
          imageUrl:
            'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
          benefits: [
            t(
              'services.standard.massageView.massages.sports.benefits.performance',
            ),
            t(
              'services.standard.massageView.massages.sports.benefits.prevention',
            ),
            t(
              'services.standard.massageView.massages.sports.benefits.recovery',
            ),
            t(
              'services.standard.massageView.massages.sports.benefits.flexibility',
            ),
          ],
          perfectFor: [
            t(
              'services.standard.massageView.massages.sports.perfectFor.athletes',
            ),
            t(
              'services.standard.massageView.massages.sports.perfectFor.active',
            ),
            t(
              'services.standard.massageView.massages.sports.perfectFor.performance',
            ),
          ],
          techniques: [
            t(
              'services.standard.massageView.massages.sports.techniques.massage',
            ),
            t(
              'services.standard.massageView.massages.sports.techniques.stretching',
            ),
            t(
              'services.standard.massageView.massages.sports.techniques.compression',
            ),
          ],
        },
        {
          id: 'couples',
          name: t('standard.massageView.massages.couples.name'),
          description: t('standard.massageView.massages.couples.description'),
          longDescription: t(
            'services.standard.massageView.massages.couples.longDescription',
          ),
          category: 'signature',
          durations: [
            { duration: 60, price: 240, popular: false },
            { duration: 90, price: 320, popular: true },
          ],
          emoji: t('services.standard.massageView.massages.couples.emoji'),
          maxPersons: 2,
          intensity: 'gentle',
          isPremium: true,
          imageUrl:
            'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=800',
          benefits: [
            t(
              'services.standard.massageView.massages.couples.benefits.romantic',
            ),
            t('services.standard.massageView.massages.couples.benefits.shared'),
            t(
              'services.standard.massageView.massages.couples.benefits.bonding',
            ),
            t('services.standard.massageView.massages.couples.benefits.stress'),
          ],
          perfectFor: [
            t(
              'services.standard.massageView.massages.couples.perfectFor.couples',
            ),
            t(
              'services.standard.massageView.massages.couples.perfectFor.anniversaries',
            ),
            t(
              'services.standard.massageView.massages.couples.perfectFor.dates',
            ),
          ],
          techniques: [
            t(
              'services.standard.massageView.massages.couples.techniques.synchronized',
            ),
            t(
              'services.standard.massageView.massages.couples.techniques.aromatherapy',
            ),
            t(
              'services.standard.massageView.massages.couples.techniques.ambiance',
            ),
          ],
        },
        {
          id: 'thai',
          name: t('services.standard.massageView.massages.thai.name'),
          description: t(
            'services.standard.massageView.massages.thai.description',
          ),
          longDescription: t(
            'services.standard.massageView.massages.thai.longDescription',
          ),
          category: 'signature',
          durations: [
            { duration: 90, price: 180, popular: true },
            { duration: 120, price: 220, popular: false },
          ],
          emoji: t('services.standard.massageView.massages.thai.emoji'),
          maxPersons: 1,
          intensity: 'medium',
          isPremium: true,
          imageUrl:
            'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=800',
          benefits: [
            t(
              'services.standard.massageView.massages.thai.benefits.flexibility',
            ),
            t('services.standard.massageView.massages.thai.benefits.energy'),
            t('services.standard.massageView.massages.thai.benefits.stress'),
            t('services.standard.massageView.massages.thai.benefits.spiritual'),
          ],
          perfectFor: [
            t(
              'services.standard.massageView.massages.thai.perfectFor.flexibility',
            ),
            t('services.standard.massageView.massages.thai.perfectFor.energy'),
            t(
              'services.standard.massageView.massages.thai.perfectFor.traditional',
            ),
          ],
          techniques: [
            t(
              'services.standard.massageView.massages.thai.techniques.stretching',
            ),
            t(
              'services.standard.massageView.massages.thai.techniques.pressure',
            ),
            t('services.standard.massageView.massages.thai.techniques.energy'),
          ],
        },
      ],
    }),
    [t],
  );

  const filteredMassages = useMemo(() => {
    return SPA_SERVICES.massages.filter((massage) => {
      if (
        filters.search &&
        !massage.name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !massage.description
          .toLowerCase()
          .includes(filters.search.toLowerCase())
      ) {
        return false;
      }
      if (filters.category && massage.category !== filters.category)
        return false;
      if (filters.intensity && massage.intensity !== filters.intensity)
        return false;
      if (filters.priceRange) {
        const minPrice = Math.min(...massage.durations.map((d) => d.price));
        switch (filters.priceRange) {
          case '0-120':
            if (minPrice > 120) return false;
            break;
          case '120-180':
            if (minPrice < 120 || minPrice > 180) return false;
            break;
          case '180-250':
            if (minPrice < 180 || minPrice > 250) return false;
            break;
          case '250+':
            if (minPrice < 250) return false;
            break;
        }
      }
      if (filters.premiumOnly && !massage.isPremium) return false;
      return true;
    });
  }, [filters, SPA_SERVICES.massages]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      category: '',
      intensity: '',
      priceRange: '',
      premiumOnly: false,
    });
  };

  const handleMassageSelect = useCallback((massage) => {
    setCurrentMassage(massage);
    setShowModal(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setShowModal(false);
    setCurrentMassage(null);
  }, []);

  const handleMassageConfirm = useCallback(
    async (reservationData) => {
      try {
        setReservationData(reservationData);
        router.push('/reservation-confirmation');
        setShowModal(false);
        setCurrentMassage(null);
      } catch (error) {
        console.error('Error processing massage booking:', error);
        alert(t('services.standard.massageView.errors.booking'));
      }
    },
    [setReservationData, router, t],
  );

  const totalFilteredCount = filteredMassages.length;
  const totalMassagesCount = SPA_SERVICES.massages.length;

  return (
    <div className='min-h-screen bg-stone-50'>
      {/* ── Hero — full bleed, matching PersonalTrainerServiceView ── */}
      <motion.section
        className='relative w-full h-[55vh] sm:h-[60vh] lg:h-[70vh]'
        initial='hidden'
        animate='visible'
        variants={fadeIn}
      >
        <Image
          src='https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=1400&auto=format&fit=crop'
          alt='Massage therapy'
          fill
          className='object-cover'
          priority
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent' />

        <div className='relative z-10 h-full flex items-end'>
          <div className='w-full px-5 sm:px-8 lg:px-12 pb-10 sm:pb-14 lg:pb-16'>
            <div className='max-w-3xl'>
              <p className='text-amber-300 uppercase tracking-[0.3em] text-[11px] sm:text-xs font-medium mb-3'>
                Massage Therapy
              </p>
              <h1 className='text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-light text-white leading-[1.1] tracking-tight mb-3'>
                {t('services.standard.massageView.hero.title.line1')}
                <br />
                <span className='font-semibold'>
                  {t('services.standard.massageView.hero.title.line2')}
                </span>
              </h1>
              <p className='text-white/55 text-sm sm:text-base max-w-md leading-relaxed font-light mb-5'>
                {t('services.standard.massageView.hero.subtitle', {
                  count: totalMassagesCount,
                })}
              </p>

              <div className='flex flex-wrap gap-5 mb-7'>
                {[
                  {
                    icon: Shield,
                    text: t(
                      'services.standard.massageView.hero.features.licensed',
                    ),
                  },
                  { icon: Clock, text: '60–120 min' },
                  {
                    icon: Star,
                    text: t(
                      'services.standard.massageView.hero.features.premium',
                    ),
                  },
                  {
                    icon: Users,
                    text: t('services.standard.massageView.hero.features.home'),
                  },
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
                onClick={() =>
                  document
                    .getElementById('massage-services')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }
                className='group inline-flex items-center gap-2.5 bg-white text-stone-900 px-6 py-3 text-xs font-medium tracking-wide uppercase hover:bg-amber-50 transition-colors duration-300'
              >
                Browse Treatments
                <ArrowRight className='w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform' />
              </button>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── Gallery — compact grid ──────────────────────────────── */}
      <motion.section
        className='px-5 sm:px-8 lg:px-12 py-14 sm:py-18 lg:py-20'
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
            Our <span className='font-semibold'>Sessions</span>
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

      {/* ── Details — included + testimonials ───────────────────── */}
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

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
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

          {/* Testimonials */}
          <motion.div
            className='border border-stone-200 bg-white p-6'
            variants={fadeIn}
          >
            <h3 className='text-xs font-semibold text-stone-900 uppercase tracking-[0.1em] mb-5'>
              Client Stories
            </h3>
            <div className='space-y-5'>
              {TESTIMONIALS.map((testimonial, i) => (
                <div
                  key={i}
                  className={i > 0 ? 'pt-5 border-t border-stone-100' : ''}
                >
                  <Quote className='w-4 h-4 text-stone-200 mb-2' />
                  <p className='text-stone-500 text-xs leading-relaxed mb-3'>
                    {testimonial.quote}
                  </p>
                  <div>
                    <p className='text-stone-900 text-xs font-medium'>
                      {testimonial.author}
                    </p>
                    <p className='text-amber-600 text-[11px]'>
                      {testimonial.result}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* ── Services Grid ──────────────────────────────────────── */}
      <section
        id='massage-services'
        className='px-5 sm:px-8 lg:px-12 pb-14 sm:pb-18 lg:pb-20'
      >
        <div className='max-w-7xl mx-auto'>
          <motion.div
            className='mb-10'
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <p className='text-amber-600 uppercase tracking-[0.25em] text-[11px] font-medium mb-2'>
              Treatments
            </p>
            <h2 className='text-2xl sm:text-3xl lg:text-4xl font-light text-stone-900 tracking-tight mb-3'>
              {t('services.standard.massageView.services.title.line1')}{' '}
              <span className='font-semibold'>
                {t('services.standard.massageView.services.title.line2')}
              </span>
            </h2>
            <p className='text-stone-500 text-sm max-w-xl leading-relaxed'>
              {t('services.standard.massageView.services.subtitle')}
            </p>
          </motion.div>

          <FilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />

          <div className='mb-6'>
            <p className='text-stone-500 text-sm'>
              {t('services.standard.massageView.services.count.available', {
                count: totalFilteredCount,
              })}
              {totalFilteredCount !== totalMassagesCount && (
                <button
                  onClick={handleClearFilters}
                  className='ml-2 text-stone-900 hover:text-amber-600 underline text-sm font-medium'
                >
                  {t('services.standard.massageView.services.count.viewAll')}
                </button>
              )}
            </p>
          </div>

          {totalFilteredCount > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16'>
              {filteredMassages.map((massage, index) => (
                <motion.div
                  key={massage.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06 }}
                >
                  <MassageCard
                    massage={massage}
                    isSelected={false}
                    onSelect={() => handleMassageSelect(massage)}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className='text-center py-16'
            >
              <h3 className='text-xl font-light text-stone-800 mb-3'>
                {t('services.standard.massageView.services.noResults.title')}
              </h3>
              <p className='text-stone-500 mb-6 text-sm'>
                {t(
                  'services.standard.massageView.services.noResults.description',
                )}
              </p>
              <button
                onClick={handleClearFilters}
                className='px-6 py-3 bg-stone-900 text-white text-xs font-medium tracking-wide uppercase hover:bg-stone-800 transition-colors'
              >
                {t('services.standard.massageView.services.noResults.button')}
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* ── CTA Banner — full bleed image ──────────────────────── */}
      <motion.section
        className='relative w-full'
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, margin: '-60px' }}
        variants={fadeIn}
      >
        <Image
          src='https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=1400&auto=format&fit=crop'
          alt='Spa experience'
          fill
          className='object-cover'
        />
        <div className='absolute inset-0 bg-stone-900/85' />
        <div className='relative z-10 py-14 sm:py-18 lg:py-22 px-5 sm:px-8 lg:px-12 text-center'>
          <p className='text-amber-400 uppercase tracking-[0.3em] text-[11px] font-medium mb-4'>
            {t('services.standard.massageView.cta.title.line1')}
          </p>
          <h2 className='text-2xl sm:text-3xl lg:text-4xl font-light text-white mb-4 tracking-tight'>
            {t('services.standard.massageView.cta.title.line2')}
          </h2>
          <p className='text-white/40 text-sm max-w-md mx-auto leading-relaxed mb-8'>
            {t('services.standard.massageView.cta.description')}
          </p>
          <button
            onClick={() =>
              document
                .getElementById('massage-services')
                ?.scrollIntoView({ behavior: 'smooth' })
            }
            className='group inline-flex items-center gap-2.5 bg-white text-stone-900 px-8 py-3.5 text-xs font-medium tracking-wide uppercase hover:bg-amber-50 transition-colors duration-300'
          >
            Browse Treatments
            <ArrowRight className='w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform' />
          </button>
        </div>
      </motion.section>

      {/* ── Disclaimer ─────────────────────────────────────────── */}
      <section className='px-5 sm:px-8 lg:px-12 py-5 bg-amber-50/50 border-t border-amber-200/40'>
        <div className='max-w-3xl mx-auto flex items-center gap-2.5'>
          <AlertTriangle className='w-3.5 h-3.5 text-amber-500 flex-shrink-0' />
          <p className='text-[11px] text-amber-700'>
            Please inform your therapist about any medical conditions, injuries,
            or allergies before the session begins.
          </p>
        </div>
      </section>

      {/* ── Modal ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {showModal && currentMassage && (
          <MassageConfigModal
            massage={currentMassage}
            isOpen={showModal}
            onClose={handleModalClose}
            onConfirm={handleMassageConfirm}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MassageServiceView;
