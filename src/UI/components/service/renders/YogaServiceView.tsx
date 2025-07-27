import React, { useState } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { Service } from '@/types/type';
import { ServiceData } from '@/types/services';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useBooking } from '@/context/BookingContext';
import { BookingDate } from '@/types/type';
import BookingModal from '../../modal/BookingModal';
import {
  User,
  MapPin,
  Leaf,
  Shield,
  Clock,
  CalendarDays,
  Heart,
  Award,
  Sparkles,
  Star,
  ArrowRight,
  Instagram,
  Sunrise,
  Wind,
  Waves,
  Mountain,
  CheckCircle,
  Play,
  Quote,
  Zap,
  Moon,
  Sun,
} from 'lucide-react';

interface YogaServiceViewProps {
  service: Service;
  serviceData?: ServiceData;
  primaryColor: string;
  viewContext?: 'standard-view' | 'premium-view';
}

// Enhanced data structures
const YOGA_STYLES = [
  {
    id: 'hatha',
    name: 'Hatha Yoga',
    description: 'Gentle, slow-paced practice focusing on basic postures',
    icon: <Mountain className='w-6 h-6' />,
    level: 'Beginner',
    duration: '60-75 min',
    benefits: ['Flexibility', 'Balance', 'Stress Relief'],
    accentColor: 'slate',
    gradient: 'from-green-50 via-emerald-50 to-teal-50',
  },
  {
    id: 'vinyasa',
    name: 'Vinyasa Flow',
    description: 'Dynamic sequences linking breath with movement',
    icon: <Wind className='w-6 h-6' />,
    level: 'Intermediate',
    duration: '60-90 min',
    benefits: ['Strength', 'Cardio', 'Mindfulness'],
    accentColor: 'stone',
    gradient: 'from-slate-50 via-blue-50 to-indigo-50',
  },
  {
    id: 'ashtanga',
    name: 'Ashtanga',
    description: 'Traditional, vigorous style with set sequences',
    icon: <Zap className='w-6 h-6' />,
    level: 'Advanced',
    duration: '75-90 min',
    benefits: ['Power', 'Discipline', 'Purification'],
    accentColor: 'amber',
    gradient: 'from-stone-50 via-amber-50 to-orange-50',
  },
  {
    id: 'yin',
    name: 'Yin Yoga',
    description: 'Passive poses held for extended periods',
    icon: <Moon className='w-6 h-6' />,
    level: 'All Levels',
    duration: '60-75 min',
    benefits: ['Deep Stretch', 'Relaxation', 'Meditation'],
    accentColor: 'emerald',
    gradient: 'from-neutral-50 via-stone-100 to-amber-50',
  },
  {
    id: 'restorative',
    name: 'Restorative',
    description: 'Deeply relaxing poses with props support',
    icon: <Heart className='w-6 h-6' />,
    level: 'All Levels',
    duration: '60-75 min',
    benefits: ['Recovery', 'Stress Relief', 'Sleep Quality'],
    accentColor: 'slate',
    gradient: 'from-green-50 via-emerald-50 to-teal-50',
  },
  {
    id: 'sunrise',
    name: 'Sunrise Session',
    description: 'Energizing morning practice to start your day',
    icon: <Sunrise className='w-6 h-6' />,
    level: 'All Levels',
    duration: '45-60 min',
    benefits: ['Energy', 'Clarity', 'Vitality'],
    accentColor: 'emerald',
    gradient: 'from-green-50 via-emerald-50 to-teal-50',
  },
];

const LOCATIONS = [
  {
    id: 'beach',
    name: 'Beach Yoga',
    description: 'Practice with the sound of waves and ocean breeze',
    image:
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800',
    icon: <Waves className='w-5 h-5' />,
    ambiance: 'Peaceful • Natural • Grounding',
  },
  {
    id: 'pool',
    name: 'Poolside Serenity',
    description: 'Tranquil practice by the water with tropical views',
    image:
      'https://images.unsplash.com/photo-1588286840104-8957b019727f?auto=format&fit=crop&q=80&w=800',
    icon: <Sparkles className='w-5 h-5' />,
    ambiance: 'Luxurious • Refreshing • Inspiring',
  },
  {
    id: 'garden',
    name: 'Garden Sanctuary',
    description: 'Immerse yourself in nature surrounded by tropical plants',
    image:
      'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?auto=format&fit=crop&q=80&w=800',
    icon: <Leaf className='w-5 h-5' />,
    ambiance: 'Natural • Harmonious • Rejuvenating',
  },
  {
    id: 'villa',
    name: 'Private Villa',
    description:
      'Intimate setting in your own space with personalized attention',
    image:
      'https://images.unsplash.com/photo-1591228127791-8e2eaef098d3?auto=format&fit=crop&q=80&w=800',
    icon: <User className='w-5 h-5' />,
    ambiance: 'Private • Comfortable • Focused',
  },
];

const BENEFITS = [
  {
    icon: <Heart className='w-6 h-6' />,
    title: 'Mind-Body Connection',
    description:
      'Develop awareness and harmony between physical movement and mental clarity',
    color: 'from-rose-500 to-pink-500',
  },
  {
    icon: <Leaf className='w-6 h-6' />,
    title: 'Flexibility & Strength',
    description:
      'Improve range of motion while building functional strength and stability',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: <Wind className='w-6 h-6' />,
    title: 'Stress Relief',
    description:
      'Release tension and find inner peace through breathwork and meditation',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: <Sunrise className='w-6 h-6' />,
    title: 'Energy & Vitality',
    description: 'Boost natural energy levels and enhance overall well-being',
    color: 'from-amber-500 to-orange-500',
  },
];

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const slideIn = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const YogaServiceView: React.FC<YogaServiceViewProps> = ({
  service,
  serviceData,
  viewContext,
}) => {
  const { t } = useTranslation();
  const { bookService } = useBooking();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  const handleBookingConfirm = (
    service: Service,
    dates: BookingDate,
    guests: number
  ) => {
    bookService(service, dates, guests);
    setIsModalOpen(false);
  };

  const getAccentColors = (color) => {
    const colors = {
      slate: 'ring-slate-300 bg-slate-50 text-slate-700 bg-slate-400',
      stone: 'ring-stone-300 bg-stone-50 text-stone-700 bg-stone-400',
      amber: 'ring-amber-300 bg-amber-50 text-amber-700 bg-amber-400',
      emerald: 'ring-emerald-300 bg-emerald-50 text-emerald-700 bg-emerald-400',
    };
    return colors[color] || colors.emerald;
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-blue-50'>
      <div className='max-w-8xl mx-auto space-y-16 pb-16'>
        {/* Hero Section */}
        <motion.div
          className='relative overflow-hidden w-full my-6 sm:my-8 lg:my-12'
          initial='hidden'
          animate='visible'
          variants={fadeInUp}
        >
          <div className='relative h-[70vh] sm:h-[80vh] lg:h-[85vh] bg-gradient-to-r from-emerald-900/80 via-teal-800/70 to-cyan-900/80'>
            {/* Overlay adicional para mejor contraste */}
            <div className='absolute inset-0 bg-black/30 z-[1]' />
            <Image
              src='https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1200'
              alt='Serene yoga practice at sunset'
              fill
              className='object-cover mix-blend-overlay opacity-60'
              priority
            />

            {/* Overlay adicional para mejor contraste */}
            <div className='absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 z-[2]' />

            {/* Floating Elements */}
            <motion.div
              className='absolute top-8 right-4 sm:top-12 sm:right-8 lg:top-20 lg:right-20 w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-white/10 rounded-full backdrop-blur-sm border border-white/20 hidden sm:block'
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div
              className='absolute bottom-16 left-4 sm:bottom-24 sm:left-8 lg:bottom-32 lg:left-16 w-12 h-12 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-emerald-500/20 rounded-full backdrop-blur-sm hidden sm:block'
              animate={{ y: [10, -10, 10] }}
              transition={{ duration: 6, repeat: Infinity }}
            />

            <div className='relative z-10 h-full flex items-center justify-center text-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16'>
              <div className='max-w-5xl w-full space-y-6 sm:space-y-8 lg:space-y-10'>
                <motion.h1
                  className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-8xl font-bold text-white leading-tight'
                  variants={fadeInUp}
                >
                  Yoga
                  <br />
                  <span className='bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent'>
                    Meditation
                  </span>
                </motion.h1>

                <motion.p
                  className='text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-white/90 max-w-4xl mx-auto leading-relaxed px-2'
                  variants={fadeInUp}
                >
                  Embark on a transformative journey of self-discovery through
                  ancient practices in paradise settings
                </motion.p>

                <motion.div
                  className='flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-8 max-w-4xl mx-auto justify-center'
                  variants={slideIn}
                >
                  <div className='flex items-center bg-white/10 backdrop-blur-sm px-3 py-3 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl border border-white/20 min-w-0 flex-1 sm:flex-none'>
                    <Clock className='w-4 h-4 sm:w-6 sm:h-6 text-white mr-2 sm:mr-3 flex-shrink-0' />
                    <div className='text-left min-w-0'>
                      <div className='text-white font-semibold text-sm sm:text-base truncate'>
                        60-90 Minutes
                      </div>
                      <div className='text-white/70 text-xs sm:text-sm truncate'>
                        Flexible Duration
                      </div>
                    </div>
                  </div>
                  <div className='flex items-center bg-white/10 backdrop-blur-sm px-3 py-3 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl border border-white/20 min-w-0 flex-1 sm:flex-none'>
                    <User className='w-4 h-4 sm:w-6 sm:h-6 text-white mr-2 sm:mr-3 flex-shrink-0' />
                    <div className='text-left min-w-0'>
                      <div className='text-white font-semibold text-sm sm:text-base truncate'>
                        All Levels
                      </div>
                      <div className='text-white/70 text-xs sm:text-sm truncate'>
                        Personalized Practice
                      </div>
                    </div>
                  </div>
                  <div className='flex items-center bg-white/10 backdrop-blur-sm px-3 py-3 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl border border-white/20 min-w-0 flex-1 sm:flex-none'>
                    <MapPin className='w-4 h-4 sm:w-6 sm:h-6 text-white mr-2 sm:mr-3 flex-shrink-0' />
                    <div className='text-left min-w-0'>
                      <div className='text-white font-semibold text-sm sm:text-base truncate'>
                        Your Choice
                      </div>
                      <div className='text-white/70 text-xs sm:text-sm truncate'>
                        Beach, Pool, Garden, Villa
                      </div>
                    </div>
                  </div>
                </motion.div>

                <div className='pt-4 sm:pt-6 lg:pt-8'>
                  <motion.button
                    onClick={() => setIsModalOpen(true)}
                    className='group bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-3 sm:px-8 sm:py-4 lg:px-12 lg:py-5 rounded-xl lg:rounded-2xl font-bold text-base sm:text-lg lg:text-xl flex items-center gap-2 sm:gap-3 mx-auto transition-all duration-300 hover:scale-105 shadow-2xl max-w-xs sm:max-w-none'
                    variants={slideIn}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Play
                      className='w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7'
                      fill='currentColor'
                    />
                    <span className='whitespace-nowrap'>
                      Begin Your Journey
                    </span>
                    <ArrowRight className='w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 group-hover:translate-x-1 transition-transform' />
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Benefits Section */}
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
              Transform Your Well-Being
            </motion.h2>
            <motion.p
              className='text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed'
              variants={fadeInUp}
            >
              Discover the profound benefits of yoga practice in stunning
              natural settings
            </motion.p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {BENEFITS.map((benefit, index) => (
              <motion.div
                key={index}
                className='group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 overflow-hidden'
                variants={fadeInUp}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${benefit.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                />

                <div
                  className={`w-16 h-16 bg-gradient-to-br ${benefit.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 text-white`}
                >
                  {benefit.icon}
                </div>

                <h3 className='text-xl font-bold text-gray-800 mb-4'>
                  {benefit.title}
                </h3>
                <p className='text-gray-600 leading-relaxed'>
                  {benefit.description}
                </p>

                <div className='absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                  <div
                    className={`w-3 h-3 bg-gradient-to-br ${benefit.color} rounded-full`}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Yoga Styles Showcase */}
        <motion.div
          className='px-4'
          initial='hidden'
          animate='visible'
          variants={fadeInUp}
        >
          <div className='text-center mb-16'>
            <h2 className='text-5xl font-bold text-gray-800 mb-6'>
              Choose Your Practice
            </h2>
            <p className='text-2xl text-gray-600 max-w-3xl mx-auto'>
              From gentle Hatha to dynamic Vinyasa, find the perfect style for
              your journey
            </p>
          </div>

          <div className='py-12 px-4 max-w-6xl mx-auto'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              {YOGA_STYLES.map((service, index) => {
                const accentColors = getAccentColors(service.accentColor);

                return (
                  <motion.div
                    key={service.id}
                    className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 cursor-pointer overflow-hidden ${
                      selectedStyle === service.id
                        ? `ring-2 ${accentColors.split(' ')[0]} shadow-lg`
                        : ''
                    }`}
                    onClick={() =>
                      setSelectedStyle(
                        selectedStyle === service.id ? '' : service.id
                      )
                    }
                    variants={fadeInUp}
                    initial='hidden'
                    animate='visible'
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    {/* Header visual con gradiente */}
                    <div
                      className={`relative h-32 bg-gradient-to-r ${service.gradient} p-6 flex items-center justify-between`}
                    >
                      {/* Patrón decorativo sutil */}
                      <div className='absolute inset-0 opacity-10'>
                        <div className='absolute top-4 right-4 w-16 h-16 border border-gray-300/40 rounded-full'></div>
                        <div className='absolute bottom-2 left-8 w-8 h-8 border border-gray-300/40 rounded-full'></div>
                        <div className='absolute top-8 left-1/3 w-4 h-4 bg-gray-400/30 rounded-full'></div>
                      </div>

                      {/* Icono principal */}
                      <div className='relative z-10 text-gray-600 bg-white/70 backdrop-blur-sm p-3 rounded-full shadow-sm'>
                        {service.icon}
                      </div>

                      {/* Precio */}
                      <div className='relative z-10 bg-white/95 backdrop-blur-sm text-gray-800 font-bold px-4 py-2 rounded-full shadow-sm border border-gray-200/50'>
                        {service.price}
                      </div>
                    </div>

                    {/* Contenido */}
                    <div className='p-6'>
                      <div className='flex flex-wrap items-center gap-2 mb-3'>
                        <h3 className='text-xl font-bold text-gray-800 flex-1'>
                          {service.name}
                        </h3>
                        <div className='flex gap-2'>
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-medium ${
                              accentColors.split(' ')[1]
                            } ${accentColors.split(' ')[2]}`}
                          >
                            {service.level}
                          </span>
                          <span className='text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium flex items-center gap-1'>
                            <Clock className='w-3 h-3' />
                            {service.duration}
                          </span>
                        </div>
                      </div>

                      <p className='text-gray-600 mb-4 leading-relaxed'>
                        {service.description}
                      </p>

                      {/* Beneficios en formato compacto */}
                      <div className='space-y-2 mb-6'>
                        <h4 className='text-xs font-semibold text-gray-500 uppercase tracking-wide'>
                          Benefits
                        </h4>
                        <div className='flex flex-wrap gap-1'>
                          {service.benefits.map((benefit, idx) => (
                            <span
                              key={idx}
                              className='text-xs bg-gray-50 text-gray-700 px-2 py-1 rounded-full border flex items-center gap-1'
                            >
                              <CheckCircle className='w-3 h-3 text-green-500' />
                              {benefit}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* CTA */}
                      <motion.button
                        className={`w-full text-white px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                          accentColors.split(' ')[3]
                        } hover:shadow-lg`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Sparkles className='w-4 h-4' />
                        Book {service.name}
                      </motion.button>
                    </div>

                    {/* Indicador de selección */}
                    {selectedStyle === service.id && (
                      <motion.div
                        className={`absolute inset-0 bg-gradient-to-r ${service.gradient} opacity-20 rounded-2xl pointer-events-none border-2 border-gray-300/30`}
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Location Selection */}
        <motion.div
          className='px-4'
          initial='hidden'
          animate='visible'
          variants={fadeInUp}
        >
          <div className='bg-gradient-to-r from-emerald-50 to-teal-50 rounded-3xl p-12'>
            <div className='text-center mb-16'>
              <h2 className='text-5xl font-bold text-gray-800 mb-6'>
                Sacred Spaces
              </h2>
              <p className='text-2xl text-gray-600 max-w-3xl mx-auto'>
                Choose your perfect sanctuary for practice and meditation
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              {LOCATIONS.map((location, index) => (
                <motion.div
                  key={location.id}
                  className={`relative overflow-hidden rounded-3xl cursor-pointer group ${
                    selectedLocation === location.id
                      ? 'ring-4 ring-emerald-500'
                      : ''
                  }`}
                  onClick={() =>
                    setSelectedLocation(
                      selectedLocation === location.id ? '' : location.id
                    )
                  }
                  variants={fadeInUp}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className='relative h-80'>
                    <Image
                      src={location.image}
                      alt={location.name}
                      fill
                      className='object-cover transition-transform duration-700 group-hover:scale-110'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent' />

                    <div className='absolute top-6 left-6'>
                      <div className='flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white border border-white/30'>
                        {location.icon}
                        <span className='ml-2 font-medium'>
                          {location.name}
                        </span>
                      </div>
                    </div>

                    <div className='absolute bottom-6 left-6 right-6 text-white'>
                      <h3 className='text-2xl font-bold mb-2'>
                        {location.name}
                      </h3>
                      <p className='text-white/90 mb-3 leading-relaxed'>
                        {location.description}
                      </p>
                      <div className='text-sm font-medium text-emerald-300'>
                        {location.ambiance}
                      </div>
                    </div>

                    {selectedLocation === location.id && (
                      <motion.div
                        className='absolute inset-0 border-4 border-emerald-500 rounded-3xl'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* What's Included Section */}
        <motion.div
          className='px-4'
          initial='hidden'
          animate='visible'
          variants={fadeInUp}
        >
          <div className='bg-white rounded-3xl shadow-2xl overflow-hidden'>
            <div className='bg-gradient-to-r from-emerald-600 to-teal-600 p-12 text-white text-center'>
              <h2 className='text-4xl font-bold mb-4'>
                Complete Yoga Experience
              </h2>
              <p className='text-xl opacity-90 max-w-2xl mx-auto'>
                Everything you need for a transformative practice is provided
              </p>
            </div>

            <div className='p-12'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-12'>
                <div className='space-y-8'>
                  {[
                    {
                      icon: Shield,
                      text: 'Certified Yoga Instructor',
                      desc: 'Experienced practitioners with 500+ hour certifications',
                    },
                    {
                      icon: Sparkles,
                      text: 'Premium Equipment',
                      desc: 'Eco-friendly mats, blocks, straps, and meditation cushions',
                    },
                    {
                      icon: Heart,
                      text: 'Breathwork & Meditation',
                      desc: 'Guided pranayama and mindfulness practices',
                    },
                    {
                      icon: Leaf,
                      text: 'Essential Oils & Aromatherapy',
                      desc: 'Natural scents to enhance your practice experience',
                    },
                  ].map((item, index) => (
                    <div key={index} className='flex items-start space-x-4'>
                      <div className='w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center flex-shrink-0'>
                        <item.icon className='w-6 h-6 text-emerald-600' />
                      </div>
                      <div>
                        <h4 className='text-lg font-bold text-gray-800 mb-1'>
                          {item.text}
                        </h4>
                        <p className='text-gray-600'>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className='relative h-96 rounded-3xl overflow-hidden'>
                  <Image
                    src='https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&q=80&w=800'
                    alt='Premium yoga equipment and setup'
                    fill
                    className='object-cover'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end'>
                    <div className='p-6 text-white'>
                      <h4 className='text-xl font-bold mb-2'>Premium Setup</h4>
                      <p className='text-white/90'>
                        All equipment sanitized and prepared for your exclusive
                        use
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        {/* Final CTA */}
        <motion.div
          className='px-4'
          initial='hidden'
          animate='visible'
          variants={fadeInUp}
        >
          <div className='relative overflow-hidden rounded-3xl'>
            <div className='absolute inset-0'>
              <Image
                src='https://images.unsplash.com/photo-1588286840104-8957b019727f?auto=format&fit=crop&q=80&w=1200'
                alt='Peaceful yoga meditation'
                fill
                className='object-cover'
              />
              <div className='absolute inset-0 bg-gradient-to-r from-emerald-900/90 to-teal-900/80' />
            </div>

            <div className='relative z-10 p-16 text-center text-white'>
              <motion.h2
                className='text-5xl md:text-6xl font-bold mb-6'
                variants={fadeInUp}
              >
                Ready to Transform?
              </motion.h2>
              <motion.p
                className='text-2xl opacity-90 mb-12 max-w-3xl mx-auto leading-relaxed'
                variants={fadeInUp}
              >
                Begin your journey to inner peace, strength, and vitality in
                paradise. Your transformation awaits.
              </motion.p>

              <motion.div
                className='flex flex-col sm:flex-row gap-6 justify-center items-center'
                variants={fadeInUp}
              >
                <button
                  onClick={() => setIsModalOpen(true)}
                  className='group bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-12 py-5 rounded-2xl font-bold text-xl flex items-center gap-3 transition-all duration-300 hover:scale-105 shadow-2xl'
                >
                  <Sparkles className='w-6 h-6' />
                  Book Your Experience
                  <ArrowRight className='w-6 h-6 group-hover:translate-x-1 transition-transform' />
                </button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Floating Action Elements */}
        <motion.div
          className='fixed bottom-8 right-8 z-50'
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 2, duration: 0.5 }}
        >
          <button
            onClick={() => setIsModalOpen(true)}
            className='group bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white p-4 rounded-full shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-110'
          >
            <Heart className='w-6 h-6 group-hover:scale-110 transition-transform' />
          </button>
        </motion.div>

        {/* Mindfulness Quote Banner */}
        <motion.div
          className='px-4'
          initial='hidden'
          animate='visible'
          variants={fadeInUp}
        >
          <div className='bg-gradient-to-r from-emerald-100 via-teal-50 to-cyan-100 rounded-3xl p-12 text-center relative overflow-hidden'>
            <motion.div
              className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500'
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 2, delay: 0.5 }}
            />

            <Quote className='w-12 h-12 text-emerald-500 mx-auto mb-6' />
            <blockquote className='text-3xl md:text-4xl font-light text-gray-800 mb-6 italic leading-relaxed'>
              "Yoga is not about touching your toes. It is about what you learn
              on the way down."
            </blockquote>
            <cite className='text-xl text-emerald-600 font-medium'>
              - Judith Hanson Lasater
            </cite>
          </div>
        </motion.div>

        {/* Health & Safety Information */}
        <motion.div
          className='px-4'
          initial='hidden'
          animate='visible'
          variants={fadeInUp}
        >
          <div className='bg-amber-50 border border-amber-200 rounded-3xl p-8'>
            <div className='flex items-start'>
              <Shield className='w-8 h-8 text-amber-600 mr-4 flex-shrink-0 mt-1' />
              <div>
                <h3 className='font-bold text-amber-800 mb-4 text-xl'>
                  Health & Wellness Guidelines
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 text-amber-700'>
                  <div>
                    <h4 className='font-semibold mb-2'>Before Your Session:</h4>
                    <ul className='space-y-1 text-sm'>
                      <li>
                        • Inform instructor of any injuries or limitations
                      </li>
                      <li>• Avoid heavy meals 2-3 hours before practice</li>
                      <li>• Stay hydrated throughout the day</li>
                      <li>• Wear comfortable, breathable clothing</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className='font-semibold mb-2'>During Practice:</h4>
                    <ul className='space-y-1 text-sm'>
                      <li>• Listen to your body and honor its limits</li>
                      <li>• Breathe deeply and stay present</li>
                      <li>• Communicate with your instructor</li>
                      <li>• Focus on your own practice, not others</li>
                    </ul>
                  </div>
                </div>
                <p className='text-amber-700 mt-4 text-sm'>
                  <strong>Note:</strong> Please consult your healthcare provider
                  before beginning any new exercise program, especially if you
                  have medical conditions or concerns.
                </p>
              </div>
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

export default YogaServiceView;
