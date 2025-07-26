import React, { useState } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { Service } from '@/types/type';
import { ServiceData } from '@/types/services';
import Image from 'next/image';
import { motion, AnimatePresence, stagger } from 'framer-motion';
import { useBooking } from '@/context/BookingContext';
import { BookingDate } from '@/types/type';
import BookingModal from '../../modal/BookingModal';
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
  Quote,
  X,
  Gift,
  AlertTriangle,
  Timer,
  Waves,
} from 'lucide-react';
import {
  fadeInUp,
  GOOD_TO_KNOW_INFO,
  LiveMusicServiceViewProps,
  MUSIC_STYLES,
  NOT_INCLUDED,
  slideIn,
  TESTIMONIALS,
  WHAT_TO_EXPECT_STEPS,
  WHATS_INCLUDED,
} from '@/constants/liveMusic';

// Professional data structures
const ENSEMBLE_OPTIONS = [
  {
    id: 'soloist',
    name: 'Soloist',
    description:
      'Intimate performances perfect for romantic dinners or quiet gatherings',
    musicians: 1,
    icon: <Mic className='w-6 h-6' />,
    image:
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=800',
    instruments: ['Acoustic Guitar', 'Vocals', 'Piano'],
    bestFor: ['Romantic dinners', 'Background ambiance', 'Intimate settings'],
  },
  {
    id: 'duo',
    name: 'Duo',
    description: 'Perfect harmony for sophisticated events and celebrations',
    musicians: 2,
    icon: <Users className='w-6 h-6' />,
    image:
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800',
    instruments: ['Vocals & Guitar', 'Piano & Vocals', 'Acoustic Duo'],
    bestFor: ['Cocktail hours', 'Wedding ceremonies', 'Private parties'],
  },
  {
    id: 'trio',
    name: 'Trio',
    description: 'Rich musical arrangements for memorable occasions',
    musicians: 3,
    icon: <Music className='w-6 h-6' />,
    image:
      'https://images.unsplash.com/photo-1571266028243-d220c9856446?auto=format&fit=crop&q=80&w=800',
    instruments: ['Guitar, Bass, Vocals', 'Piano Trio', 'Jazz Ensemble'],
    bestFor: ['Dinner parties', 'Corporate events', 'Celebrations'],
  },
  {
    id: 'quartet',
    name: 'Quartet',
    description: 'Full ensemble sound for sophisticated entertainment',
    musicians: 4,
    icon: <Guitar className='w-6 h-6' />,
    image:
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800',
    instruments: ['Full Band Setup', 'String Quartet', 'Jazz Quartet'],
    bestFor: ['Large gatherings', 'Dance events', 'Special celebrations'],
  },
  {
    id: 'quintet',
    name: 'Quintet',
    description: 'Complete musical experience for grand celebrations',
    musicians: 5,
    icon: <Piano className='w-6 h-6' />,
    image:
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800',
    instruments: ['Full Band', 'Extended Jazz', 'Chamber Ensemble'],
    bestFor: ['Large parties', 'Dancing events', 'Premium celebrations'],
  },
];

const LiveMusicServiceView: React.FC<LiveMusicServiceViewProps> = ({
  service,
  serviceData,
  primaryColor = 'slate',
  viewContext,
}) => {
  const { t } = useTranslation();
  const { bookService } = useBooking();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEnsemble, setSelectedEnsemble] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');

  const handleBookingConfirm = (
    service: Service,
    dates: BookingDate,
    guests: number
  ) => {
    bookService(service, dates, guests);
    setIsModalOpen(false);
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-gray-100'>
      <div className='max-w-8xl mx-auto space-y-16 pb-16'>
        {/* Hero Section */}
        <motion.div
          className='relative overflow-hidden w-full my-6 sm:my-8 lg:my-12'
          initial='hidden'
          animate='visible'
          variants={fadeInUp}
        >
          <div className='relative h-[70vh] sm:h-[80vh] lg:h-[85vh] bg-gradient-to-r from-slate-900/90 via-gray-800/80 to-slate-900/90'>
            {/* Overlay adicional para mejor contraste */}
            <div className='absolute inset-0 bg-black/20 z-[1]' />
            <Image
              src='https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=1200'
              alt='Professional live music performance'
              fill
              className='object-cover mix-blend-overlay opacity-60'
              priority
            />

            {/* Overlay adicional para mejor contraste */}
            <div className='absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 z-[2]' />

            {/* Subtle floating elements */}
            <motion.div
              className='absolute top-8 right-4 sm:top-12 sm:right-8 lg:top-20 lg:right-20 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-white/10 rounded-full backdrop-blur-sm border border-white/20 flex items-center justify-center hidden sm:flex'
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 6, repeat: Infinity }}
            >
              <Music className='w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white' />
            </motion.div>
            <motion.div
              className='absolute bottom-16 left-4 sm:bottom-24 sm:left-8 lg:bottom-32 lg:left-16 w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 bg-white/10 rounded-full backdrop-blur-sm border border-white/20 flex items-center justify-center hidden sm:flex'
              animate={{ y: [10, -10, 10] }}
              transition={{ duration: 8, repeat: Infinity }}
            >
              <Waves className='w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white' />
            </motion.div>

            <div className='relative z-10 h-full flex items-center justify-center text-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16'>
              <div className='max-w-5xl w-full space-y-6 sm:space-y-8 lg:space-y-10'>
                <motion.h1
                  className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-8xl font-bold text-white leading-tight'
                  variants={fadeInUp}
                >
                  Live Music
                  <br />
                  <span className='text-gray-300 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-7xl'>
                    Entertainment
                  </span>
                </motion.h1>

                <motion.p
                  className='text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-white/90 max-w-4xl mx-auto leading-relaxed px-2'
                  variants={fadeInUp}
                >
                  Create unforgettable memories with live music at your villa,
                  beach gathering, or private event
                </motion.p>

                <motion.div
                  className='flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-8 max-w-4xl mx-auto justify-center'
                  variants={slideIn}
                >
                  <div className='flex items-center bg-white/10 backdrop-blur-sm px-3 py-3 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl border border-white/20 min-w-0 flex-1 sm:flex-none'>
                    <Users className='w-4 h-4 sm:w-6 sm:h-6 text-white mr-2 sm:mr-3 flex-shrink-0' />
                    <div className='text-left min-w-0'>
                      <div className='text-white font-semibold text-sm sm:text-base truncate'>
                        1-5 Musicians
                      </div>
                      <div className='text-white/70 text-xs sm:text-sm truncate'>
                        Soloist to Quintet
                      </div>
                    </div>
                  </div>
                  <div className='flex items-center bg-white/10 backdrop-blur-sm px-3 py-3 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl border border-white/20 min-w-0 flex-1 sm:flex-none'>
                    <Clock className='w-4 h-4 sm:w-6 sm:h-6 text-white mr-2 sm:mr-3 flex-shrink-0' />
                    <div className='text-left min-w-0'>
                      <div className='text-white font-semibold text-sm sm:text-base truncate'>
                        60-90 Minutes
                      </div>
                      <div className='text-white/70 text-xs sm:text-sm truncate'>
                        Customizable Sets
                      </div>
                    </div>
                  </div>
                  <div className='flex items-center bg-white/10 backdrop-blur-sm px-3 py-3 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl border border-white/20 min-w-0 flex-1 sm:flex-none'>
                    <MapPin className='w-4 h-4 sm:w-6 sm:h-6 text-white mr-2 sm:mr-3 flex-shrink-0' />
                    <div className='text-left min-w-0'>
                      <div className='text-white font-semibold text-sm sm:text-base truncate'>
                        Any Location
                      </div>
                      <div className='text-white/70 text-xs sm:text-sm truncate'>
                        Villa, Beach, Event
                      </div>
                    </div>
                  </div>
                </motion.div>

                <div className='pt-4 sm:pt-6 lg:pt-8'>
                  <motion.button
                    onClick={() => setIsModalOpen(true)}
                    className='group bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 sm:px-8 sm:py-4 lg:px-12 lg:py-5 rounded-xl lg:rounded-2xl font-semibold text-base sm:text-lg lg:text-xl flex items-center gap-2 sm:gap-3 mx-auto transition-all duration-300 hover:scale-105 shadow-2xl border border-slate-600 max-w-xs sm:max-w-none'
                    variants={slideIn}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Play className='w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6' />
                    <span className='whitespace-nowrap'>Book Live Music</span>
                    <ArrowRight className='w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 group-hover:translate-x-1 transition-transform' />
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Ensemble Options */}
        <motion.div
          className='px-4'
          initial='hidden'
          animate='visible'
          variants={stagger}
        >
          <div className='text-center mb-16'>
            <motion.h2
              className='text-5xl font-bold text-gray-800 mb-6'
              variants={fadeInUp}
            >
              Choose Your Ensemble
            </motion.h2>
            <motion.p
              className='text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed'
              variants={fadeInUp}
            >
              From intimate soloists to full quintets, we tailor the perfect
              musical experience for your celebration
            </motion.p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {ENSEMBLE_OPTIONS.map((ensemble, index) => (
              <motion.div
                key={ensemble.id}
                className={`relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group border-2 ${
                  selectedEnsemble === ensemble.id
                    ? 'border-slate-600 shadow-xl'
                    : 'border-gray-200'
                }`}
                onClick={() =>
                  setSelectedEnsemble(
                    selectedEnsemble === ensemble.id ? '' : ensemble.id
                  )
                }
                variants={fadeInUp}
                whileHover={{ y: -4 }}
              >
                <div className='relative h-48'>
                  <Image
                    src={ensemble.image}
                    alt={ensemble.name}
                    fill
                    className='object-cover transition-transform duration-500 group-hover:scale-105'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent' />

                  <div className='absolute top-4 left-4'>
                    <div className='w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30 text-white'>
                      {ensemble.icon}
                    </div>
                  </div>

                  <div className='absolute bottom-4 left-4 right-4 text-white'>
                    <h3 className='text-lg font-bold mb-1'>{ensemble.name}</h3>
                    <p className='text-sm text-white/90'>
                      {ensemble.musicians} musician
                      {ensemble.musicians > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                <div className='p-4'>
                  <p className='text-gray-600 text-sm mb-3 leading-relaxed'>
                    {ensemble.description}
                  </p>

                  <div className='space-y-2'>
                    <div>
                      <h5 className='font-medium text-gray-800 text-xs uppercase tracking-wide mb-1'>
                        Instruments
                      </h5>
                      <div className='flex flex-wrap gap-1'>
                        {ensemble.instruments
                          .slice(0, 2)
                          .map((instrument, idx) => (
                            <span
                              key={idx}
                              className='text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded'
                            >
                              {instrument}
                            </span>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>

                {selectedEnsemble === ensemble.id && (
                  <motion.div
                    className='absolute inset-0 bg-slate-600/10 border-2 border-slate-600 rounded-2xl'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Music Styles */}
        <motion.div
          className='px-4'
          initial='hidden'
          animate='visible'
          variants={fadeInUp}
        >
          <div className='bg-white rounded-3xl shadow-xl p-12'>
            <div className='text-center mb-12'>
              <h2 className='text-4xl font-bold text-gray-800 mb-4'>
                Musical Styles
              </h2>
              <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
                Whether you want smooth acoustic tunes, tropical beats, or
                lively music for dancing, we tailor the vibe perfectly to your
                occasion
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {MUSIC_STYLES.map((style, index) => (
                <motion.div
                  key={style.id}
                  className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 group ${
                    selectedStyle === style.id
                      ? 'border-slate-600 bg-slate-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  }`}
                  onClick={() =>
                    setSelectedStyle(selectedStyle === style.id ? '' : style.id)
                  }
                  variants={fadeInUp}
                  whileHover={{ y: -2 }}
                >
                  <h3 className='text-xl font-bold text-gray-800 mb-2'>
                    {style.name}
                  </h3>
                  <p className='text-gray-600 mb-3 leading-relaxed'>
                    {style.description}
                  </p>
                  <div className='text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-full inline-block'>
                    {style.vibe}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* What's Included */}
        <motion.div
          className='px-4'
          initial='hidden'
          animate='visible'
          variants={fadeInUp}
        >
          <div className='bg-white rounded-3xl shadow-xl overflow-hidden'>
            <div className='bg-slate-800 p-8 text-white text-center'>
              <h2 className='text-3xl font-bold mb-4'>What's Included</h2>
              <p className='text-xl opacity-90'>
                Professional service from consultation to performance
              </p>
            </div>

            <div className='p-8'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                <div className='space-y-6'>
                  {WHATS_INCLUDED.map((item, index) => (
                    <div key={index} className='flex items-start space-x-4'>
                      <div className='w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0'>
                        <item.icon className='w-5 h-5 text-green-600' />
                      </div>
                      <div>
                        <h4 className='text-lg font-semibold text-gray-800 mb-1'>
                          {item.text}
                        </h4>
                        <p className='text-gray-600 text-sm'>{item.desc}</p>
                      </div>
                    </div>
                  ))}

                  {/* Not Included */}
                  <div className='mt-8 pt-6 border-t border-gray-200'>
                    <h4 className='font-bold text-gray-800 mb-4 flex items-center'>
                      <X className='w-5 h-5 text-red-500 mr-2' />
                      Not Included
                    </h4>
                    {NOT_INCLUDED.map((item, index) => (
                      <div key={index} className='flex items-center'>
                        <div className='w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center mr-4'>
                          <item.icon className='w-5 h-5 text-red-600' />
                        </div>
                        <span className='text-gray-600'>{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className='relative h-80 rounded-2xl overflow-hidden'>
                  <Image
                    src='https://images.unsplash.com/photo-1571266028243-d220c9856446?auto=format&fit=crop&q=80&w=600'
                    alt='Professional musicians performing'
                    fill
                    className='object-cover'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end'>
                    <div className='p-6 text-white'>
                      <h4 className='text-xl font-bold mb-2'>
                        Professional Musicians
                      </h4>
                      <p className='text-white/90'>
                        Experienced performers dedicated to making your event
                        special
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* What to Expect */}
        <motion.div
          className='px-4'
          initial='hidden'
          animate='visible'
          variants={fadeInUp}
        >
          <div className='bg-white rounded-3xl shadow-xl p-12'>
            <div className='text-center mb-12'>
              <h2 className='text-4xl font-bold text-gray-800 mb-4'>
                What to Expect
              </h2>
              <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
                Music transforms moments. Our curated performances are designed
                to enhance your celebration
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
              {WHAT_TO_EXPECT_STEPS.map((step, index) => (
                <div key={index} className='text-center'>
                  <div className='w-16 h-16 bg-slate-800 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 font-bold text-xl'>
                    {step.step}
                  </div>
                  <div className='mb-4'>
                    <step.icon className='w-8 h-8 text-slate-600 mx-auto' />
                  </div>
                  <h3 className='text-lg font-bold text-gray-800 mb-2'>
                    {step.title}
                  </h3>
                  <p className='text-gray-600 text-sm leading-relaxed'>
                    {step.description}
                  </p>
                </div>
              ))}
            </div>

            <div className='text-center mt-12 p-6 bg-slate-50 rounded-2xl'>
              <p className='text-lg text-slate-700 italic'>
                "Feel the rhythm, dance, and make memories that last forever.{' '}
                <strong>Let the music play!</strong>"
              </p>
            </div>
          </div>
        </motion.div>

        {/* Good to Know */}
        <motion.div
          className='px-4'
          initial='hidden'
          animate='visible'
          variants={fadeInUp}
        >
          <div className='bg-white rounded-3xl shadow-xl p-8'>
            <h2 className='text-3xl font-bold text-gray-800 mb-8 text-center'>
              Good to Know
            </h2>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='flex items-start space-x-4 p-4 bg-slate-50 rounded-xl'>
                <div className='w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0'>
                  <Timer className='w-5 h-5 text-slate-600' />
                </div>
                <div>
                  <h3 className='font-bold text-gray-800 mb-1'>
                    Recommended Booking Time
                  </h3>
                  <p className='text-gray-600 text-sm'>
                    {GOOD_TO_KNOW_INFO.bookingTime}
                  </p>
                </div>
              </div>

              <div className='flex items-start space-x-4 p-4 bg-slate-50 rounded-xl'>
                <div className='w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0'>
                  <Clock className='w-5 h-5 text-slate-600' />
                </div>
                <div>
                  <h3 className='font-bold text-gray-800 mb-1'>Duration</h3>
                  <p className='text-gray-600 text-sm'>
                    {GOOD_TO_KNOW_INFO.duration}
                  </p>
                </div>
              </div>

              <div className='flex items-start space-x-4 p-4 bg-slate-50 rounded-xl'>
                <div className='w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0'>
                  <Zap className='w-5 h-5 text-slate-600' />
                </div>
                <div>
                  <h3 className='font-bold text-gray-800 mb-1'>
                    Setup Requirements
                  </h3>
                  <p className='text-gray-600 text-sm'>
                    {GOOD_TO_KNOW_INFO.setupRequirements}
                  </p>
                </div>
              </div>

              <div className='flex items-start space-x-4 p-4 bg-slate-50 rounded-xl'>
                <div className='w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0'>
                  <Heart className='w-5 h-5 text-slate-600' />
                </div>
                <div>
                  <h3 className='font-bold text-gray-800 mb-1'>
                    Customization
                  </h3>
                  <p className='text-gray-600 text-sm'>
                    {GOOD_TO_KNOW_INFO.customization}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className='px-4'
          initial='hidden'
          animate='visible'
          variants={fadeInUp}
        >
          <div className='relative overflow-hidden rounded-3xl'>
            <div className='absolute inset-0'>
              <Image
                src='https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=1200'
                alt='Live music performance ambiance'
                fill
                className='object-cover'
              />
              <div className='absolute inset-0 bg-slate-900/80' />
            </div>

            <div className='relative z-10 p-16 text-center text-white'>
              <motion.h2
                className='text-5xl md:text-6xl font-bold mb-6'
                variants={fadeInUp}
              >
                Bring Your Event to Life
              </motion.h2>
              <motion.p
                className='text-2xl opacity-90 mb-12 max-w-3xl mx-auto leading-relaxed'
                variants={fadeInUp}
              >
                Whether it's a romantic dinner, family gathering, or lively
                party night, let professional live music create the perfect
                atmosphere for your celebration.
              </motion.p>

              <motion.div
                className='flex flex-col sm:flex-row gap-6 justify-center items-center'
                variants={fadeInUp}
              >
                <div className='text-center'>
                  <div className='text-4xl font-bold'>${service.price}</div>
                  <div className='text-white/70'>
                    Starting price per performance
                  </div>
                </div>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className='group bg-white text-slate-900 hover:bg-gray-100 px-10 py-4 rounded-xl font-semibold text-lg flex items-center gap-3 transition-all duration-300 hover:scale-105 shadow-xl'
                >
                  <Music className='w-5 h-5' />
                  Book Live Music
                  <ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform' />
                </button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Important Disclaimer */}
        <motion.div
          className='px-4'
          initial='hidden'
          animate='visible'
          variants={fadeInUp}
        >
          <div className='bg-amber-50 border border-amber-200 rounded-2xl p-6'>
            <div className='flex items-start'>
              <AlertTriangle className='w-6 h-6 text-amber-600 mr-3 flex-shrink-0 mt-0.5' />
              <div>
                <h3 className='font-bold text-amber-800 mb-2'>
                  Important Notice
                </h3>
                <p className='text-amber-700'>
                  Please coordinate music timing with your event planner or
                  villa host to respect local noise policies. Our team will work
                  with you to ensure compliance with all venue requirements and
                  local regulations.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Why Choose Us */}
        <motion.div
          className='px-4'
          initial='hidden'
          animate='visible'
          variants={fadeInUp}
        >
          <div className='bg-gradient-to-r from-slate-100 to-gray-100 rounded-3xl p-12 text-center'>
            <div className='bg-white rounded-2xl p-8 max-w-4xl mx-auto'>
              <Quote className='w-10 h-10 text-slate-500 mx-auto mb-4' />
              <blockquote className='text-2xl font-medium text-gray-800 mb-4 italic leading-relaxed'>
                "Music transforms moments into memories. Whether it's a romantic
                dinner, a family gathering, or a lively party night, our
                performances create the perfect soundtrack for your
                celebration."
              </blockquote>
              <p className='text-lg text-slate-600 font-medium'>
                Let the music play!
              </p>
            </div>
          </div>
        </motion.div>
      </div>

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
    </div>
  );
};

export default LiveMusicServiceView;
