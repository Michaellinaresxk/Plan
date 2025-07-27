import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Music,
  Users,
  Clock,
  Star,
  ArrowRight,
  CheckCircle,
  Play,
  Volume2,
  Mic,
  Guitar,
  Piano,
  MapPin,
  Zap,
  Settings,
  Heart,
  Waves,
  Crown,
  Calendar,
  ArrowLeft,
} from 'lucide-react';
import BookingModal from '../../modal/BookingModal';
import { BookingDate, Service } from '@/constants/formFields';
import { useBooking } from '@/context/BookingContext';
import { useTranslation } from '@/lib/i18n/client';
import { ServiceData, ServiceExtendedDetails } from '@/types/services';
import { useRouter } from 'next/navigation';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

// Professional data structures
const ENSEMBLE_OPTIONS = [
  {
    id: 'soloist-acoustic',
    name: 'Acoustic Soloist',
    description: 'Intimate acoustic guitar and vocals for romantic ambiance',
    musicians: 1,
    price: 180,
    duration: '2-3 hours',
    icon: <Mic className='w-6 h-6' />,
    image:
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=800',
    instruments: ['Acoustic Guitar', 'Vocals'],
    bestFor: ['Romantic dinners', 'Sunset sessions', 'Intimate gatherings'],
    luxury: true,
  },
  {
    id: 'soloist-piano',
    name: 'Piano Virtuoso',
    description: 'Elegant piano performances for sophisticated events',
    musicians: 1,
    price: 220,
    duration: '2-3 hours',
    icon: <Piano className='w-6 h-6' />,
    image:
      'https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&q=80&w=800',
    instruments: ['Grand Piano', 'Vocals'],
    bestFor: ['Cocktail hours', 'Elegant dinners', 'Corporate events'],
    luxury: true,
  },
  {
    id: 'duo-acoustic',
    name: 'Acoustic Duo',
    description:
      'Perfect harmony with guitar, vocals and complementary instruments',
    musicians: 2,
    price: 320,
    duration: '2-4 hours',
    icon: <Users className='w-6 h-6' />,
    image:
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800',
    instruments: ['Guitar & Vocals', 'Cajon/Percussion'],
    bestFor: ['Wedding ceremonies', 'Private parties', 'Villa events'],
    luxury: true,
  },
  {
    id: 'trio-jazz',
    name: 'Jazz Trio',
    description: 'Sophisticated jazz ensemble for premium entertainment',
    musicians: 3,
    price: 480,
    duration: '3-4 hours',
    icon: <Music className='w-6 h-6' />,
    image:
      'https://images.unsplash.com/photo-1571266028243-d220c9856446?auto=format&fit=crop&q=80&w=800',
    instruments: ['Piano', 'Bass', 'Vocals'],
    bestFor: ['Dinner parties', 'Corporate events', 'Luxury gatherings'],
    featured: true,
  },
  {
    id: 'quartet-premium',
    name: 'Premium Quartet',
    description: 'Full band experience with professional sound and lighting',
    musicians: 4,
    price: 680,
    duration: '3-5 hours',
    icon: <Guitar className='w-6 h-6' />,
    image:
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800',
    instruments: ['Guitar', 'Bass', 'Drums', 'Vocals'],
    bestFor: ['Large celebrations', 'Dance parties', 'Premium events'],
    featured: true,
  },
  {
    id: 'quintet-luxury',
    name: 'Luxury Quintet',
    description: 'Ultimate musical experience with full production setup',
    musicians: 5,
    price: 920,
    duration: '4-6 hours',
    icon: <Crown className='w-6 h-6' />,
    image:
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800',
    instruments: ['Full Band', 'Keys', 'Horns'],
    bestFor: ['Luxury events', 'Grand celebrations', 'VIP experiences'],
    premium: true,
  },
];

const MUSIC_STYLES = [
  {
    id: 'acoustic-chill',
    name: 'Acoustic & Chill',
    description: 'Relaxing acoustic covers and original compositions',
    vibe: 'Relaxing',
    genres: ['Acoustic Pop', 'Folk', 'Indie'],
    color: 'from-green-400 to-emerald-600',
  },
  {
    id: 'jazz-lounge',
    name: 'Jazz & Lounge',
    description: 'Sophisticated jazz standards and modern interpretations',
    vibe: 'Sophisticated',
    genres: ['Jazz Standards', 'Smooth Jazz', 'Bossa Nova'],
    color: 'from-purple-400 to-indigo-600',
  },
  {
    id: 'latin-tropical',
    name: 'Latin & Tropical',
    description: 'Vibrant Latin rhythms and Caribbean influences',
    vibe: 'Energetic',
    genres: ['Salsa', 'Reggaeton', 'Bachata'],
    color: 'from-orange-400 to-red-600',
  },
  {
    id: 'pop-hits',
    name: 'Pop & Contemporary',
    description: 'Popular hits and contemporary covers everyone knows',
    vibe: 'Familiar',
    genres: ['Top 40', 'Pop Covers', 'Contemporary'],
    color: 'from-blue-400 to-cyan-600',
  },
  {
    id: 'rock-classics',
    name: 'Rock & Classics',
    description: 'Timeless rock anthems and classic favorites',
    vibe: 'Dynamic',
    genres: ['Classic Rock', 'Alternative', 'Rock Ballads'],
    color: 'from-gray-400 to-gray-700',
  },
  {
    id: 'world-fusion',
    name: 'World & Fusion',
    description: 'International sounds and cross-cultural musical fusion',
    vibe: 'Unique',
    genres: ['World Music', 'Fusion', 'Mediterranean'],
    color: 'from-amber-400 to-yellow-600',
  },
];

interface LiveMusicServiceViewProps {
  service: Service;
  serviceData?: ServiceData;
  extendedDetails?: ServiceExtendedDetails;
  primaryColor: string;
}

const LiveMusicServiceView = ({ service }: LiveMusicServiceViewProps) => {
  const router = useRouter();
  const { t } = useTranslation();
  const { bookService } = useBooking();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedStyle, setSelectedStyle] = useState('');
  const [selectedEnsemble, setSelectedEnsemble] = useState('soloist-acoustic');

  const handleBookingConfirm = (
    service: Service,
    dates: BookingDate,
    guests: number
  ) => {
    bookService(service, dates, guests);
    setIsModalOpen(false);
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50'>
      {/* Hero Section */}
      <motion.div
        className='relative overflow-hidden'
        initial='hidden'
        animate='visible'
        variants={fadeInUp}
      >
        <div className='relative h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black'>
          <div className='absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/40' />

          {/* Background Video Placeholder */}
          <div
            className='absolute inset-0 bg-cover bg-center opacity-40'
            style={{
              backgroundImage:
                'url(https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=1920)',
            }}
          />

          {/* Floating Music Notes */}
          <motion.div
            className='absolute top-20 right-20 w-16 h-16 bg-white/10 rounded-full backdrop-blur-sm border border-white/20 flex items-center justify-center'
            animate={{ y: [-10, 10, -10], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
          >
            <Music className='w-8 h-8 text-white' />
          </motion.div>

          <motion.div
            className='absolute bottom-32 left-16 w-12 h-12 bg-white/10 rounded-full backdrop-blur-sm border border-white/20 flex items-center justify-center'
            animate={{ y: [10, -10, 10], rotate: [0, -5, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity, delay: 2 }}
          >
            <Waves className='w-6 h-6 text-white' />
          </motion.div>

          <div className='relative z-10 h-full flex items-center justify-center text-center px-8'>
            <div className='max-w-6xl space-y-8'>
              <motion.h1
                className='text-7xl md:text-8xl lg:text-9xl font-bold text-white leading-tight'
                variants={fadeInUp}
              >
                Live Music
                <br />
                <span className='bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent'>
                  Perfection
                </span>
              </motion.h1>

              <motion.p
                className='text-2xl md:text-3xl text-white/80 max-w-4xl mx-auto leading-relaxed'
                variants={fadeInUp}
              >
                Transform your celebration with world-class musicians and
                unforgettable performances
              </motion.p>

              <motion.div
                className='flex flex-col sm:flex-row gap-6 justify-center pt-8'
                variants={stagger}
              >
                <motion.button
                  onClick={() => setIsModalOpen(true)}
                  className='group bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-12 py-5 rounded-2xl font-bold text-xl flex items-center gap-3 transition-all duration-300 hover:scale-105 shadow-2xl'
                  variants={scaleIn}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className='w-6 h-6' />
                  Book Experience
                  <ArrowRight className='w-6 h-6 group-hover:translate-x-1 transition-transform' />
                </motion.button>
              </motion.div>

              {/* Quick Stats */}
              <motion.div
                className='flex flex-wrap justify-center gap-8 pt-12 text-white/80'
                variants={stagger}
              >
                <div className='flex items-center bg-white/5 backdrop-blur-sm px-6 py-4 rounded-xl border border-white/10'>
                  <Users className='w-6 h-6 mr-3' />
                  <div className='text-left'>
                    <div className='font-bold text-white'>1-5 Musicians</div>
                    <div className='text-sm'>Any ensemble size</div>
                  </div>
                </div>
                <div className='flex items-center bg-white/5 backdrop-blur-sm px-6 py-4 rounded-xl border border-white/10'>
                  <Clock className='w-6 h-6 mr-3' />
                  <div className='text-left'>
                    <div className='font-bold text-white'>2-6 Hours</div>
                    <div className='text-sm'>Flexible duration</div>
                  </div>
                </div>
                <div className='flex items-center bg-white/5 backdrop-blur-sm px-6 py-4 rounded-xl border border-white/10'>
                  <MapPin className='w-6 h-6 mr-3' />
                  <div className='text-left'>
                    <div className='font-bold text-white'>Any Location</div>
                    <div className='text-sm'>Villa, beach, venue</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className='max-w-7xl mx-auto space-y-20 py-20'>
        {/* Ensemble Selection */}

        <motion.div
          className='px-8'
          initial='hidden'
          animate='visible'
          variants={stagger}
        >
          <div className='text-center mb-16'>
            <motion.h2
              className='text-6xl font-bold bg-gradient-to-r from-slate-800 to-gray-600 bg-clip-text text-transparent mb-6'
              variants={fadeInUp}
            >
              Choose Your Ensemble
            </motion.h2>
            <motion.p
              className='text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed'
              variants={fadeInUp}
            >
              From intimate acoustic sessions to full luxury productions
            </motion.p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {ENSEMBLE_OPTIONS.map((ensemble, index) => (
              <motion.div
                key={ensemble.id}
                className={`relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer group ${
                  selectedEnsemble === ensemble.id
                    ? 'ring-4 ring-amber-500 shadow-2xl scale-105'
                    : ''
                } ${ensemble.premium ? 'border-2 border-amber-200' : ''}`}
                onClick={() => setSelectedEnsemble(ensemble.id)}
                variants={fadeInUp}
                whileHover={{ y: -8 }}
              >
                {/* Premium Badge */}
                {ensemble.premium && (
                  <div className='absolute top-4 left-4 z-20 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1'>
                    <Crown className='w-3 h-3' />
                    LUXURY
                  </div>
                )}

                {/* Featured Badge */}
                {ensemble.featured && (
                  <div className='absolute top-4 left-4 z-20 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1'>
                    <Star className='w-3 h-3' />
                    POPULAR
                  </div>
                )}

                <div className='relative h-64 overflow-hidden'>
                  <img
                    src={ensemble.image}
                    alt={ensemble.name}
                    className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent' />

                  {/* Ensemble Icon */}
                  <div className='absolute top-4 right-4'>
                    <div className='w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30 text-white'>
                      {ensemble.icon}
                    </div>
                  </div>

                  {/* Selection Indicator */}
                  {selectedEnsemble === ensemble.id && (
                    <motion.div
                      className='absolute inset-0 bg-amber-500/20 border-4 border-amber-500 rounded-3xl'
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}

                  {/* Bottom Info */}
                  <div className='absolute bottom-4 left-4 right-4 text-white'>
                    <h3 className='text-xl font-bold mb-1'>{ensemble.name}</h3>
                    <p className='text-sm text-white/90 mb-2'>
                      {ensemble.musicians} musician
                      {ensemble.musicians > 1 ? 's' : ''} • {ensemble.duration}
                    </p>
                    <div className='flex items-center justify-between'>
                      <span className='text-2xl font-bold'>
                        ${ensemble.price}
                      </span>
                      <div className='flex items-center bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-xs'>
                        <Clock className='w-3 h-3 mr-1' />
                        {ensemble.duration}
                      </div>
                    </div>
                  </div>
                </div>

                <div className='p-6'>
                  <p className='text-gray-600 mb-4 leading-relaxed'>
                    {ensemble.description}
                  </p>

                  <div className='space-y-3'>
                    <div>
                      <h5 className='font-bold text-gray-800 text-xs uppercase tracking-wide mb-2'>
                        Instruments
                      </h5>
                      <div className='flex flex-wrap gap-1'>
                        {ensemble.instruments.map((instrument, idx) => (
                          <span
                            key={idx}
                            className='text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full'
                          >
                            {instrument}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h5 className='font-bold text-gray-800 text-xs uppercase tracking-wide mb-2'>
                        Perfect For
                      </h5>
                      <div className='flex flex-wrap gap-1'>
                        {ensemble.bestFor.slice(0, 2).map((use, idx) => (
                          <span
                            key={idx}
                            className='text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full'
                          >
                            {use}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Music Styles */}
        <motion.div
          className='px-8'
          initial='hidden'
          animate='visible'
          variants={fadeInUp}
        >
          <div className=''>
            <div className='text-center mb-16'>
              <h2 className='text-5xl font-bold text-gray-800 mb-6'>
                Musical Styles & Vibes
              </h2>
              <p className='text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed'>
                Choose the perfect musical atmosphere for your celebration
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {MUSIC_STYLES.map((style, index) => (
                <motion.div
                  key={style.id}
                  className={`relative p-8 rounded-2xl cursor-pointer transition-all duration-300 group overflow-hidden ${
                    selectedStyle === style.id
                      ? 'ring-4 ring-amber-500 shadow-xl scale-105'
                      : 'hover:shadow-lg hover:scale-102'
                  }`}
                  onClick={() => setSelectedStyle(style.id)}
                  variants={fadeInUp}
                  whileHover={{ y: -4 }}
                >
                  {/* Gradient Background */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${style.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}
                  />

                  <div className='relative z-10'>
                    <div className='flex items-center justify-between mb-4'>
                      <h3 className='text-xl font-bold text-gray-800'>
                        {style.name}
                      </h3>
                      <div className='text-sm font-bold bg-gray-100 text-gray-600 px-3 py-1 rounded-full'>
                        {style.vibe}
                      </div>
                    </div>

                    <p className='text-gray-600 mb-4 leading-relaxed'>
                      {style.description}
                    </p>

                    <div className='flex flex-wrap gap-2'>
                      {style.genres.map((genre, idx) => (
                        <span
                          key={idx}
                          className='text-xs bg-white border border-gray-200 text-gray-600 px-2 py-1 rounded'
                        >
                          {genre}
                        </span>
                      ))}
                    </div>

                    {selectedStyle === style.id && (
                      <motion.div
                        className='absolute top-4 right-4 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center'
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <CheckCircle className='w-4 h-4 text-white' />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Experience Timeline */}
        <motion.div
          className='px-8'
          initial='hidden'
          animate='visible'
          variants={fadeInUp}
        >
          <div className='bg-gradient-to-br from-slate-800 to-gray-900 rounded-3xl p-16 text-white'>
            <div className='text-center mb-16'>
              <h2 className='text-5xl font-bold mb-6'>
                The Complete Experience
              </h2>
              <p className='text-xl opacity-90 max-w-3xl mx-auto'>
                From consultation to performance, every detail is carefully
                crafted
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
              {[
                {
                  step: '01',
                  title: 'Consultation',
                  desc: 'Discuss your vision and preferences',
                  icon: <Settings className='w-8 h-8' />,
                },
                {
                  step: '02',
                  title: 'Customization',
                  desc: 'Tailor the perfect musical program',
                  icon: <Heart className='w-8 h-8' />,
                },
                {
                  step: '03',
                  title: 'Setup',
                  desc: 'Professional equipment and sound check',
                  icon: <Zap className='w-8 h-8' />,
                },
                {
                  step: '04',
                  title: 'Performance',
                  desc: 'Unforgettable live music experience',
                  icon: <Music className='w-8 h-8' />,
                },
              ].map((step, index) => (
                <motion.div
                  key={index}
                  className='text-center'
                  variants={fadeInUp}
                >
                  <div className='w-20 h-20 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 font-bold text-2xl'>
                    {step.step}
                  </div>
                  <div className='mb-4 text-amber-400'>{step.icon}</div>
                  <h3 className='text-xl font-bold mb-3'>{step.title}</h3>
                  <p className='text-white/80 leading-relaxed'>{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          className='px-8'
          initial='hidden'
          animate='visible'
          variants={fadeInUp}
        >
          <div className='relative overflow-hidden rounded-3xl'>
            <div className='absolute inset-0 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500' />

            <div className='relative z-10 p-20 text-center text-white'>
              <motion.h2
                className='text-6xl md:text-7xl font-bold mb-8'
                variants={fadeInUp}
              >
                Ready to Begin?
              </motion.h2>
              <motion.p
                className='text-2xl opacity-90 mb-12 max-w-3xl mx-auto leading-relaxed'
                variants={fadeInUp}
              >
                Let's create an unforgettable musical experience that will be
                remembered for years to come.
              </motion.p>

              <motion.div
                className='flex flex-col sm:flex-row gap-6 justify-center items-center'
                variants={fadeInUp}
              >
                <button
                  onClick={() => setIsModalOpen(true)}
                  className='group bg-white text-orange-600 hover:bg-gray-100 px-12 py-5 rounded-2xl font-bold text-xl flex items-center gap-3 transition-all duration-300 hover:scale-105 shadow-2xl'
                >
                  <Calendar className='w-6 h-6' />
                  Book Your Experience
                  <ArrowRight className='w-6 h-6 group-hover:translate-x-1 transition-transform' />
                </button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
      {/* Booking Modal */}
      {isModalOpen && (
        <BookingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleBookingConfirm}
          service={service}
        />
      )}
    </div>
  );
};

export default LiveMusicServiceView;
