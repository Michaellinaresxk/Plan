import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Crown,
  Eye,
  Compass,
  Gem,
  Feather,
  Palette,
  Music,
  Coffee,
  X,
  ChevronLeft,
  ChevronRight,
  Users,
  MessageSquare,
  CreditCard,
  AlertCircle,
  Phone,
  Mail,
} from 'lucide-react';
import BookingModal from '../../modal/BookingModal';
import { BookingDate, Service } from '@/constants/formFields';

interface PremiunYogaServiceProps {
  service: Service;
}
// Custom hook for intersection observer
const useInView = (options = {}) => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      {
        threshold: 0.1,
        ...options,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return [ref, isInView];
};

// Enhanced data structures for premium experience
const PREMIUM_YOGA_STYLES = [
  {
    id: 'private-sunrise',
    name: 'Private Sunrise Flow',
    description:
      'Exclusive one-on-one session as the sun rises over the Caribbean waters',
    icon: <Sunrise className='w-6 h-6' />,
    level: 'Personalized',
    duration: '90 min',
    price: '$180',
    benefits: ['Complete Privacy', 'Custom Sequences', 'Sunrise Meditation'],
    accentColor: 'amber',
    gradient: 'from-amber-100 via-orange-50 to-yellow-50',
    personalizedFeatures: [
      'Pre-session consultation to understand your goals',
      'Customized sequence based on your experience level',
      'Personal aromatherapy blend selection',
      'Private photography session during golden hour',
    ],
  },
  {
    id: 'couples-luxury',
    name: 'Couples Luxury Retreat',
    description:
      'Intimate partner yoga experience with champagne and premium amenities',
    icon: <Heart className='w-6 h-6' />,
    level: 'All Levels',
    duration: '120 min',
    price: '$320',
    benefits: [
      'Partner Connection',
      'Luxury Amenities',
      'Relationship Building',
    ],
    accentColor: 'rose',
    gradient: 'from-rose-100 via-pink-50 to-red-50',
    personalizedFeatures: [
      'Relationship goals assessment and tailored practice',
      'Premium champagne service post-session',
      'Couples massage add-on available',
      'Personalized keepsake photo album',
    ],
  },
  {
    id: 'executive-wellness',
    name: 'Executive Wellness Session',
    description:
      'High-performance yoga designed for busy professionals and executives',
    icon: <Crown className='w-6 h-6' />,
    level: 'Executive',
    duration: '75 min',
    price: '$250',
    benefits: ['Stress Management', 'Mental Clarity', 'Peak Performance'],
    accentColor: 'slate',
    gradient: 'from-slate-100 via-gray-50 to-blue-50',
    personalizedFeatures: [
      'Stress assessment and targeted relief techniques',
      'Executive-focused breathing techniques for meetings',
      'Productivity-enhancing meditation practices',
      'Take-home wellness kit with executive tools',
    ],
  },
  {
    id: 'therapeutic-healing',
    name: 'Therapeutic Healing Journey',
    description:
      'Specialized therapeutic yoga targeting specific physical or emotional needs',
    icon: <Feather className='w-6 h-6' />,
    level: 'Therapeutic',
    duration: '105 min',
    price: '$280',
    benefits: ['Pain Relief', 'Emotional Healing', 'Restoration'],
    accentColor: 'emerald',
    gradient: 'from-emerald-100 via-green-50 to-teal-50',
    personalizedFeatures: [
      'Comprehensive health and wellness assessment',
      'Customized therapeutic sequences for your needs',
      'Integration with spa treatments if desired',
      'Ongoing wellness plan and home practice guide',
    ],
  },
  {
    id: 'master-class',
    name: 'Master Class Experience',
    description:
      'Advanced practice with renowned yoga masters and exclusive techniques',
    icon: <Gem className='w-6 h-6' />,
    level: 'Master',
    duration: '150 min',
    price: '$450',
    benefits: ['Advanced Techniques', 'Master Teaching', 'Exclusive Access'],
    accentColor: 'purple',
    gradient: 'from-purple-100 via-violet-50 to-indigo-50',
    personalizedFeatures: [
      'Access to internationally certified master instructors',
      'Exclusive advanced techniques not taught in regular classes',
      'Personal yoga philosophy discussion and guidance',
      'Certificate of completion for advanced practice',
    ],
  },
  {
    id: 'yacht-deck-session',
    name: 'Yacht Deck Serenity',
    description:
      'Exclusive yoga practice aboard your luxury yacht on open waters',
    icon: <Waves className='w-6 h-6' />,
    level: 'Nautical',
    duration: '90 min',
    price: '$350',
    benefits: ['Ocean Energy', 'Ultimate Privacy', 'Unique Experience'],
    accentColor: 'cyan',
    gradient: 'from-cyan-100 via-blue-50 to-teal-50',
    personalizedFeatures: [
      'Practice synchronized with ocean rhythms',
      'Weather-adaptive sequences for deck conditions',
      'Marine-safe equipment and setup',
      'Post-session refreshments prepared by yacht crew',
    ],
  },
];

const PREMIUM_LOCATIONS = [
  {
    id: 'private-beach',
    name: 'Private Beach Sanctuary',
    description:
      'Exclusive beach section with premium setup and complete privacy',
    image:
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800',
    icon: <Waves className='w-5 h-5' />,
    ambiance: 'Exclusive • Pristine • Transformative',
    premiumFeatures: [
      'Private beach section reserved exclusively for you',
      'Luxury cabana setup with premium amenities',
      'Dedicated staff for refreshments and towel service',
      'Professional photographer available upon request',
    ],
  },
  {
    id: 'infinity-pool',
    name: 'Infinity Pool Oasis',
    description:
      'Luxury poolside practice with panoramic ocean views and premium service',
    image:
      'https://images.unsplash.com/photo-1588286840104-8957b019727f?auto=format&fit=crop&q=80&w=800',
    icon: <Sparkles className='w-5 h-5' />,
    ambiance: 'Luxurious • Serene • Inspiring',
    premiumFeatures: [
      'Poolside setup with floating meditation platforms',
      'Chilled eucalyptus towels and premium water service',
      'Ambient sound system with nature soundscapes',
      'Post-session pool access with fresh fruit platter',
    ],
  },
  {
    id: 'rooftop-garden',
    name: 'Rooftop Garden Paradise',
    description:
      'Elevated practice space surrounded by tropical gardens and city views',
    image:
      'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?auto=format&fit=crop&q=80&w=800',
    icon: <Leaf className='w-5 h-5' />,
    ambiance: 'Elevated • Lush • Harmonious',
    premiumFeatures: [
      'Curated garden space with aromatic herbs and flowers',
      'Climate-controlled environment with natural ventilation',
      'Organic herbal tea ceremony post-practice',
      'Access to rooftop meditation garden throughout the day',
    ],
  },
  {
    id: 'yacht-deck',
    name: 'Luxury Yacht Deck',
    description:
      'Ultimate privacy aboard your floating sanctuary on crystal waters',
    image:
      'https://images.unsplash.com/photo-1540946485063-a40da27545f8?auto=format&fit=crop&q=80&w=800',
    icon: <Crown className='w-5 h-5' />,
    ambiance: 'Exclusive • Maritime • Extraordinary',
    premiumFeatures: [
      'Complete yacht privacy with 360-degree ocean views',
      'Marine-grade yoga equipment and safety measures',
      'Captain and crew coordination for optimal experience',
      'Champagne celebration and gourmet breakfast included',
    ],
  },
];

const PERSONALIZATION_BENEFITS = [
  {
    icon: <Eye className='w-6 h-6' />,
    title: 'Personal Assessment',
    description:
      'Comprehensive wellness evaluation to create your perfect practice journey',
    color: 'from-blue-500 to-cyan-500',
    details: [
      'Physical fitness and flexibility assessment',
      'Stress level and lifestyle analysis',
      'Personal goals and intention setting',
      'Customized practice plan development',
    ],
  },
  {
    icon: <Palette className='w-6 h-6' />,
    title: 'Bespoke Experience Design',
    description:
      'Every element tailored to your preferences, from music to aromatherapy',
    color: 'from-purple-500 to-violet-500',
    details: [
      'Personalized playlist creation',
      'Custom aromatherapy blend selection',
      'Preferred practice intensity and style',
      'Special dietary requirements accommodation',
    ],
  },
  {
    icon: <Compass className='w-6 h-6' />,
    title: 'Progress Tracking',
    description:
      'Detailed tracking of your wellness journey with measurable outcomes',
    color: 'from-emerald-500 to-teal-500',
    details: [
      'Digital wellness journal and progress photos',
      'Flexibility and strength improvement metrics',
      'Stress reduction and mindfulness tracking',
      'Personalized home practice recommendations',
    ],
  },
  {
    icon: <Crown className='w-6 h-6' />,
    title: 'VIP Concierge Service',
    description:
      'Dedicated concierge ensuring every detail exceeds your expectations',
    color: 'from-amber-500 to-orange-500',
    details: [
      '24/7 concierge availability for requests',
      'Coordination with other luxury services',
      'Transportation and timing coordination',
      'Special occasion and celebration planning',
    ],
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

// Main Component
const LuxeYogaExperience = ({ service }: PremiunYogaServiceProps) => {
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ref, isInView] = useInView();

  const handleBookNow = (style) => {
    setSelectedStyle(style);
    setIsModalOpen(true);
  };

  const getAccentColors = (color) => {
    const colors = {
      slate: 'ring-slate-300 bg-slate-50 text-slate-700 bg-slate-600',
      amber: 'ring-amber-300 bg-amber-50 text-amber-700 bg-amber-600',
      emerald: 'ring-emerald-300 bg-emerald-50 text-emerald-700 bg-emerald-600',
      rose: 'ring-rose-300 bg-rose-50 text-rose-700 bg-rose-600',
      purple: 'ring-purple-300 bg-purple-50 text-purple-700 bg-purple-600',
      cyan: 'ring-cyan-300 bg-cyan-50 text-cyan-700 bg-cyan-600',
    };
    return colors[color] || colors.emerald;
  };

  // Manejar la confirmación de reserva
  const handleBookingConfirm = (
    bookingService: Service,
    dates: BookingDate,
    guests: number
  ) => {
    bookService(bookingService, dates, guests);
    setIsModalOpen(false);
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50'>
      <div className='max-w-8xl mx-auto space-y-20 pb-16'>
        {/* Hero Section */}
        <motion.section
          className='relative h-screen flex items-center justify-center px-4 sm:px-6 overflow-hidden'
          initial='hidden'
          animate='visible'
          variants={fadeInUp}
        >
          {/* Background Image and Overlays */}
          <div className='absolute inset-0 z-0'>
            <img
              src='https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1200'
              alt='Premium yoga experience'
              className='w-full h-full object-cover'
            />
            <div className='absolute inset-0 bg-gradient-to-br from-slate-900/90 via-gray-800/80 to-blue-900/90' />
            <div className='absolute inset-0 bg-black/20' />
          </div>

          {/* Floating Decorative Elements */}
          <div className='absolute inset-0 overflow-hidden'>
            <motion.div
              animate={{ y: [-15, 15, -15], rotate: [0, 5, 0] }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className='absolute top-20 right-10 w-24 h-24 sm:w-32 sm:h-32 sm:right-20 border-2 border-white/20 rounded-full backdrop-blur-sm'
            />
            <motion.div
              animate={{ y: [20, -20, 20], rotate: [0, -3, 0] }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className='absolute bottom-32 left-10 sm:left-16 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-full backdrop-blur-sm'
            />
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 6, repeat: Infinity }}
              className='absolute top-1/2 left-6 sm:left-10 w-12 h-12 sm:w-16 sm:h-16 bg-white/10 rounded-full backdrop-blur-sm'
            />
          </div>

          {/* Main Content */}
          <div className='relative z-20 text-center max-w-5xl'>
            {/* Premium Badge */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className='inline-flex items-center bg-white/10 backdrop-blur-md px-4 py-2 sm:px-6 sm:py-3 rounded-full border border-white/20 mb-6 sm:mb-8 shadow-lg'
            >
              <Crown className='w-4 h-4 sm:w-5 sm:h-5 text-amber-400 mr-2 sm:mr-3' />
              <span className='text-white font-medium text-sm sm:text-base'>
                Luxury Wellness • Premium Yoga Sanctuary
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className='text-4xl sm:text-5xl lg:text-7xl font-light text-white mb-4 sm:mb-6 leading-tight'
            >
              Premium
              <span className='block bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent font-normal'>
                Yoga Experience
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className='text-lg sm:text-xl lg:text-2xl text-white/90 mb-8 sm:mb-12 leading-relaxed font-light max-w-4xl mx-auto px-2'
            >
              Bespoke wellness journeys crafted exclusively for the discerning
              individual. Where ancient wisdom meets modern luxury.
            </motion.p>

            {/* Features Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className='grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 text-white/80 text-xs sm:text-sm mb-8 sm:mb-12'
            >
              <div className='flex items-center gap-2 bg-white/5 backdrop-blur-sm px-3 py-2 sm:px-4 sm:py-3 rounded-lg border border-white/10'>
                <Crown className='w-3 h-3 sm:w-4 sm:h-4 text-amber-300 flex-shrink-0' />
                <span className='text-center sm:text-left'>
                  Exclusive Access
                </span>
              </div>
              <div className='flex items-center gap-2 bg-white/5 backdrop-blur-sm px-3 py-2 sm:px-4 sm:py-3 rounded-lg border border-white/10'>
                <Eye className='w-3 h-3 sm:w-4 sm:h-4 text-emerald-300 flex-shrink-0' />
                <span className='text-center sm:text-left'>
                  Personal Assessment
                </span>
              </div>
              <div className='flex items-center gap-2 bg-white/5 backdrop-blur-sm px-3 py-2 sm:px-4 sm:py-3 rounded-lg border border-white/10'>
                <Gem className='w-3 h-3 sm:w-4 sm:h-4 text-purple-300 flex-shrink-0' />
                <span className='text-center sm:text-left'>
                  Master Instructors
                </span>
              </div>
              <div className='flex items-center gap-2 bg-white/5 backdrop-blur-sm px-3 py-2 sm:px-4 sm:py-3 rounded-lg border border-white/10'>
                <Sparkles className='w-3 h-3 sm:w-4 sm:h-4 text-cyan-300 flex-shrink-0' />
                <span className='text-center sm:text-left'>
                  Luxury Amenities
                </span>
              </div>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <button
                onClick={() => setIsModalOpen(true)}
                className='group bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white px-6 py-3 sm:px-8 sm:py-4 lg:px-12 lg:py-5 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg lg:text-xl flex items-center gap-2 sm:gap-3 mx-auto transition-all duration-300 hover:scale-105 shadow-2xl'
              >
                <Crown className='w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7' />
                <span>Design Your Experience</span>
                <ArrowRight className='w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 group-hover:translate-x-1 transition-transform' />
              </button>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className='absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2'
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className='w-5 h-8 sm:w-6 sm:h-10 border-2 border-white/50 rounded-full flex justify-center'
            >
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className='w-0.5 h-2 sm:w-1 sm:h-3 bg-white/70 rounded-full mt-1 sm:mt-2'
              />
            </motion.div>
          </motion.div>
        </motion.section>

        {/* Personalization Benefits */}
        <motion.div
          ref={ref}
          className='px-8'
          initial='hidden'
          animate={isInView ? 'visible' : 'hidden'}
          variants={stagger}
        >
          <div className='text-center mb-16'>
            <motion.h2
              className='text-6xl font-light text-gray-800 mb-6'
              variants={fadeInUp}
            >
              Crafted for
              <span className='font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent'>
                {' '}
                You
              </span>
            </motion.h2>
            <motion.p
              className='text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed'
              variants={fadeInUp}
            >
              Every element is personalized to create your perfect wellness
              sanctuary
            </motion.p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-12 max-w-7xl mx-auto'>
            {PERSONALIZATION_BENEFITS.map((benefit, index) => (
              <motion.div
                key={index}
                className='group relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden'
                variants={fadeInUp}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${benefit.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                />

                <div
                  className={`w-16 h-16 bg-gradient-to-br ${benefit.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 text-white`}
                >
                  {benefit.icon}
                </div>

                <h3 className='text-2xl font-bold text-gray-800 mb-4'>
                  {benefit.title}
                </h3>
                <p className='text-gray-600 leading-relaxed mb-6'>
                  {benefit.description}
                </p>

                <div className='space-y-2'>
                  {benefit.details.map((detail, idx) => (
                    <div
                      key={idx}
                      className='flex items-start text-sm text-gray-600'
                    >
                      <CheckCircle className='w-4 h-4 text-emerald-500 mr-2 mt-0.5 flex-shrink-0' />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>

                <div className='absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                  <div
                    className={`w-3 h-3 bg-gradient-to-br ${benefit.color} rounded-full`}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Premium Yoga Styles */}
        <motion.div
          className='px-8'
          initial='hidden'
          whileInView='visible'
          variants={fadeInUp}
          viewport={{ once: true }}
        >
          <div className='text-center mb-16'>
            <h2 className='text-6xl font-light text-gray-800 mb-6'>
              Signature
              <span className='font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent'>
                {' '}
                Experiences
              </span>
            </h2>
            <p className='text-2xl text-gray-600 max-w-4xl mx-auto'>
              Meticulously crafted sessions designed for the ultimate in
              personalized wellness
            </p>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto'>
            {PREMIUM_YOGA_STYLES.map((style, index) => {
              const accentColors = getAccentColors(style.accentColor);

              return (
                <motion.div
                  key={style.id}
                  className='group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden hover:-translate-y-2'
                  variants={fadeInUp}
                  initial='hidden'
                  whileInView='visible'
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  {/* Premium header */}
                  <div
                    className={`relative h-40 bg-gradient-to-br ${style.gradient} p-6`}
                  >
                    <div className='absolute inset-0 bg-black/5' />

                    {/* Decorative elements */}
                    <div className='absolute top-4 right-4 w-20 h-20 border border-gray-300/30 rounded-full opacity-20' />
                    <div className='absolute bottom-4 left-6 w-12 h-12 bg-white/20 rounded-full opacity-40' />

                    <div className='relative z-10 flex items-center justify-between h-full'>
                      <div className='text-gray-700 bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-sm'>
                        {style.icon}
                      </div>
                      <div className='text-right'>
                        <div className='bg-white/95 backdrop-blur-sm text-gray-800 font-bold px-4 py-2 rounded-full shadow-sm text-lg'>
                          {style.price}
                        </div>
                        <div className='text-xs text-gray-600 mt-1 font-medium'>
                          {style.duration}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className='p-8'>
                    <div className='flex items-start justify-between mb-4'>
                      <h3 className='text-xl font-bold text-gray-800 leading-tight'>
                        {style.name}
                      </h3>
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-semibold ${
                          accentColors.split(' ')[1]
                        } ${accentColors.split(' ')[2]}`}
                      >
                        {style.level}
                      </span>
                    </div>

                    <p className='text-gray-600 mb-6 leading-relaxed'>
                      {style.description}
                    </p>

                    {/* Benefits */}
                    <div className='space-y-2 mb-6'>
                      <h4 className='text-xs font-semibold text-gray-500 uppercase tracking-wide'>
                        Core Benefits
                      </h4>
                      <div className='flex flex-wrap gap-2'>
                        {style.benefits.map((benefit, idx) => (
                          <span
                            key={idx}
                            className='text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full border'
                          >
                            {benefit}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Personalized features */}
                    <div className='space-y-2 mb-6'>
                      <h4 className='text-xs font-semibold text-gray-500 uppercase tracking-wide'>
                        Personalized Features
                      </h4>
                      <div className='space-y-1'>
                        {style.personalizedFeatures
                          .slice(0, 2)
                          .map((feature, idx) => (
                            <div
                              key={idx}
                              className='flex items-start text-xs text-gray-600'
                            >
                              <Sparkles className='w-3 h-3 text-amber-500 mr-2 mt-0.5 flex-shrink-0' />
                              <span>{feature}</span>
                            </div>
                          ))}
                        <div className='text-xs text-gray-500 italic'>
                          +{style.personalizedFeatures.length - 2} more
                          personalized touches...
                        </div>
                      </div>
                    </div>

                    {/* CTA */}
                    <motion.button
                      onClick={() => handleBookNow(style)}
                      className={`w-full text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                        accentColors.split(' ')[3]
                      } hover:shadow-xl hover:scale-105`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Crown className='w-4 h-4' />
                      Reserve Experience
                    </motion.button>
                  </div>

                  {/* Premium indicator */}
                  <div className='absolute top-6 left-6'>
                    <div className='bg-gradient-to-r from-amber-400 to-orange-400 text-white text-xs font-bold px-2 py-1 rounded-full'>
                      PREMIUM
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Final Luxury CTA */}
        <motion.div
          className='px-8'
          initial='hidden'
          whileInView='visible'
          variants={fadeInUp}
          viewport={{ once: true }}
        >
          <div className='relative overflow-hidden rounded-3xl'>
            <div className='absolute inset-0'>
              <img
                src='https://images.unsplash.com/photo-1588286840104-8957b019727f?auto=format&fit=crop&q=80&w=1200'
                alt='Luxury yoga experience'
                className='w-full h-full object-cover'
                style={{ objectFit: 'cover' }}
              />
              <div className='absolute inset-0 bg-gradient-to-r from-slate-900/95 via-gray-800/90 to-blue-900/95' />
            </div>

            <div className='relative z-10 p-20 text-center text-white'>
              <motion.div className='space-y-8' variants={fadeInUp}>
                <div className='flex items-center justify-center mb-6'>
                  <Gem className='w-12 h-12 text-amber-400 mr-4' />
                  <span className='text-amber-400 font-semibold text-2xl tracking-wider uppercase'>
                    Your Transformation Awaits
                  </span>
                </div>

                <h2 className='text-6xl md:text-7xl font-light mb-8'>
                  Begin Your
                  <br />
                  <span className='font-bold bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent'>
                    Premium Journey
                  </span>
                </h2>

                <p className='text-2xl opacity-90 mb-12 max-w-4xl mx-auto leading-relaxed'>
                  Experience the ultimate in personalized wellness. Where every
                  breath, every movement, and every moment is crafted
                  exclusively for you.
                </p>

                <motion.div
                  className='flex flex-col sm:flex-row gap-6 justify-center items-center'
                  variants={fadeInUp}
                >
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className='group bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white px-12 py-6 rounded-2xl font-bold text-xl flex items-center gap-3 transition-all duration-300 hover:scale-105 shadow-2xl'
                  >
                    <Crown className='w-7 h-7' />
                    Reserve Your Sanctuary
                    <ArrowRight className='w-6 h-6 group-hover:translate-x-1 transition-transform' />
                  </button>

                  <div className='flex items-center gap-8 text-white/80'>
                    <div className='flex items-center gap-2'>
                      <Phone className='w-5 h-5' />
                      <span>VIP Concierge</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <MessageSquare className='w-5 h-5' />
                      <span>24/7 Support</span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Booking modal */}
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

export default LuxeYogaExperience;
