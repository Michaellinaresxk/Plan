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
  Info,
  XCircle,
  Gift,
} from 'lucide-react';

interface YogaServiceViewProps {
  service: Service;
  serviceData?: ServiceData;
  primaryColor: string;
  viewContext?: 'standard-view' | 'premium-view';
}

// Simple yoga styles matching PDF
const YOGA_STYLES = [
  {
    id: 'hatha',
    name: 'Hatha',
    gradient: 'from-stone-100 via-stone-200 to-stone-300',
  },
  {
    id: 'vinyasa',
    name: 'Vinyasa',
    gradient: 'from-slate-100 via-slate-200 to-slate-300',
  },
  {
    id: 'ashtanga',
    name: 'Ashtanga',
    gradient: 'from-gray-100 via-gray-200 to-gray-300',
  },
  {
    id: 'yin',
    name: 'Yin (Estiramientos)',
    gradient: 'from-neutral-100 via-neutral-200 to-neutral-300',
  },
  {
    id: 'restorative',
    name: 'Restaurativo',
    gradient: 'from-zinc-100 via-zinc-200 to-zinc-300',
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
            <div className='absolute inset-0 bg-black/30 z-[1]' />
            <Image
              src='https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1200'
              alt='Serene yoga practice at sunset'
              fill
              className='object-cover mix-blend-overlay opacity-60'
              priority
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 z-[2]' />

            {/* Floating Elements */}
            <motion.div
              className='absolute top-8 right-4 sm:top-12 sm:right-8 lg:top-20 lg:right-20 w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-white/10 rounded-full backdrop-blur-sm border border-white/20 hidden sm:block'
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 4, repeat: Infinity }}
            />

            <div className='relative z-10 h-full flex items-center justify-center text-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16'>
              <div className='max-w-5xl w-full space-y-6 sm:space-y-8 lg:space-y-10'>
                <motion.h1
                  className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-8xl font-bold text-white leading-tight'
                  variants={fadeInUp}
                >
                  Private Yoga
                  <br />
                  <span className='bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent'>
                    Session
                  </span>
                </motion.h1>

                <motion.p
                  className='text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-white/90 max-w-4xl mx-auto leading-relaxed px-2'
                  variants={fadeInUp}
                >
                  Your Space. Your Flow. Personalized yoga practice in the
                  comfort of your vacation rental.
                </motion.p>

                <motion.div
                  className='flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-8 max-w-4xl mx-auto justify-center'
                  variants={slideIn}
                >
                  <div className='flex items-center bg-white/10 backdrop-blur-sm px-3 py-3 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl border border-white/20 min-w-0 flex-1 sm:flex-none'>
                    <Clock className='w-4 h-4 sm:w-6 sm:h-6 text-white mr-2 sm:mr-3 flex-shrink-0' />
                    <div className='text-left min-w-0'>
                      <div className='text-white font-semibold text-sm sm:text-base truncate'>
                        60 Minutes
                      </div>
                      <div className='text-white/70 text-xs sm:text-sm truncate'>
                        Duration
                      </div>
                    </div>
                  </div>
                  <div className='flex items-center bg-white/10 backdrop-blur-sm px-3 py-3 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl border border-white/20 min-w-0 flex-1 sm:flex-none'>
                    <User className='w-4 h-4 sm:w-6 sm:h-6 text-white mr-2 sm:mr-3 flex-shrink-0' />
                    <div className='text-left min-w-0'>
                      <div className='text-white font-semibold text-sm sm:text-base truncate'>
                        Age 9+
                      </div>
                      <div className='text-white/70 text-xs sm:text-sm truncate'>
                        All Levels Welcome
                      </div>
                    </div>
                  </div>
                  <div className='flex items-center bg-white/10 backdrop-blur-sm px-3 py-3 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl border border-white/20 min-w-0 flex-1 sm:flex-none'>
                    <MapPin className='w-4 h-4 sm:w-6 sm:h-6 text-white mr-2 sm:mr-3 flex-shrink-0' />
                    <div className='text-left min-w-0'>
                      <div className='text-white font-semibold text-sm sm:text-base truncate'>
                        Your Rental
                      </div>
                      <div className='text-white/70 text-xs sm:text-sm truncate'>
                        We Come to You
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

        {/* Yoga Styles - Simplified as requested */}
        <motion.div
          className='px-4'
          initial='hidden'
          animate='visible'
          variants={fadeInUp}
        >
          <div className='text-center mb-16'>
            <h2 className='text-4xl font-bold text-gray-800 mb-6'>
              Choose Your Practice Style
            </h2>
            <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
              Select from these traditional yoga practices, each tailored to
              your experience level
            </p>
          </div>

          {/* Simple grid of yoga styles */}
          <div className='grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-6xl mx-auto'>
            {YOGA_STYLES.map((style, index) => (
              <motion.div
                key={style.id}
                className='group cursor-pointer'
                variants={fadeInUp}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className='bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden'>
                  {/* Hero Image with centered text */}
                  <div
                    className={`relative h-30 :h-50 bg-gradient-to-br ${style.gradient} overflow-hidden`}
                  >
                    {/* Background pattern */}
                    <div className='absolute inset-0 bg-gradient-to-br from-white/10 to-transparent'></div>

                    {/* Centered name */}
                    <div className='absolute inset-0 flex items-center justify-center'>
                      <div className='text-center'>
                        <h3 className='text-1xl md:text-2xl font-light text-gray-700 mb-2'>
                          {style.name}
                        </h3>
                        <div className='w-12 h-px bg-gray-500 mx-auto'></div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className='text-center mt-12'>
            <p className='text-gray-600 max-w-2xl mx-auto'>
              Whether you're new to yoga or deepening your practice, our
              internationally certified instructors tailor each session to your
              goals and preferred style.
            </p>
          </div>
        </motion.div>

        {/* What's Included Section - Enhanced from PDF */}
        <motion.div
          className='px-4'
          initial='hidden'
          animate='visible'
          variants={fadeInUp}
        >
          <div className='bg-white rounded-3xl shadow-2xl overflow-hidden'>
            <div className='bg-gradient-to-r from-emerald-600 to-teal-600 p-12 text-white text-center'>
              <h2 className='text-4xl font-bold mb-4'>What's Included</h2>
              <p className='text-xl opacity-90 max-w-2xl mx-auto'>
                Everything you need for a transformative practice is provided
              </p>
            </div>

            <div className='p-12'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-12'>
                <div className='space-y-8'>
                  <h3 className='text-2xl font-bold text-gray-800 mb-6'>
                    Included:
                  </h3>
                  {[
                    {
                      icon: CheckCircle,
                      text: 'Yoga Mats',
                      desc: 'Premium, eco-friendly mats for your practice',
                    },
                    {
                      icon: CheckCircle,
                      text: 'Props & Supports',
                      desc: 'Blocks, straps, and bolsters as needed',
                    },
                    {
                      icon: Shield,
                      text: 'Certified Instructor',
                      desc: 'Internationally certified with personalized guidance',
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

                <div className='space-y-8'>
                  <h3 className='text-2xl font-bold text-gray-800 mb-6'>
                    Not Included:
                  </h3>
                  <div className='flex items-start space-x-4'>
                    <div className='w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center flex-shrink-0'>
                      <Gift className='w-6 h-6 text-amber-600' />
                    </div>
                    <div>
                      <h4 className='text-lg font-bold text-gray-800 mb-1'>
                        Gratuity
                      </h4>
                      <p className='text-gray-600'>
                        Optional but appreciated by our instructors
                      </p>
                    </div>
                  </div>

                  <div className='bg-gray-50 rounded-2xl p-6'>
                    <h4 className='text-lg font-semibold text-gray-800 mb-3'>
                      Good to Know:
                    </h4>
                    <ul className='space-y-2 text-gray-600 text-sm'>
                      <li>
                        • <strong>Start & End Time:</strong> Promptly at
                        scheduled hour
                      </li>
                      <li>
                        • <strong>What to Wear:</strong> Stretch-friendly
                        clothing
                      </li>
                      <li>
                        • <strong>Adaptability:</strong> Sessions can be adapted
                        for pregnancy or mobility needs
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* What to Expect Section - From PDF */}
        <motion.div
          className='px-2'
          initial='hidden'
          animate='visible'
          variants={fadeInUp}
        >
          <div className='text-center mb-16'>
            <h2 className='text-4xl font-bold text-gray-800 mb-6'>
              What to Expect
            </h2>
            <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
              Your personalized yoga journey in four simple steps
            </p>
          </div>

          <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {[
              {
                step: '1',
                title: 'Setup & Arrival',
                description: 'Instructor arrives & sets the space',
                icon: <Sparkles className='w-8 h-8' />,
                color: 'from-emerald-500 to-teal-500',
              },
              {
                step: '2',
                title: 'Welcome Discussion',
                description: 'Quick welcome and goal discussion',
                icon: <Heart className='w-8 h-8' />,
                color: 'from-teal-500 to-cyan-500',
              },
              {
                step: '3',
                title: 'Practice Time',
                description: 'Move, breathe, and flow',
                icon: <Wind className='w-8 h-8' />,
                color: 'from-cyan-500 to-blue-500',
              },
              {
                step: '4',
                title: 'Grounding Relaxation',
                description: 'Finish with a grounding relaxation',
                icon: <Moon className='w-8 h-8' />,
                color: 'from-blue-500 to-indigo-500',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className='text-center'
                variants={fadeInUp}
                transition={{ delay: index * 0.1 }}
              >
                <div
                  className={`w-20 h-20 bg-gradient-to-r ${item.color} rounded-full flex items-center justify-center mx-auto mb-6 text-white shadow-lg`}
                >
                  {item.icon}
                </div>
                <div className='mb-3'>
                  <span className='text-3xl font-bold text-gray-300 mr-2'>
                    {item.step}
                  </span>
                  <h3 className='text-xl font-bold text-gray-800 inline'>
                    {item.title}
                  </h3>
                </div>
                <p className='text-gray-600'>{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Location Selection */}
        <motion.div
          className='px-2'
          initial='hidden'
          animate='visible'
          variants={fadeInUp}
        >
          <div className='bg-gradient-to-r from-emerald-50 to-teal-50 rounded-3xl p-2'>
            <div className='text-center mb-16'>
              <h2 className='text-4xl font-bold text-gray-800 mb-6'>
                Sacred Spaces
              </h2>
              <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
                Choose your perfect sanctuary for practice within your vacation
                rental
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
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Service Overview Section - From PDF */}
        <motion.div
          className='px-2'
          initial='hidden'
          animate='visible'
          variants={fadeInUp}
        >
          <div className='bg-white rounded-3xl shadow-xl p-8 md:p-12'>
            <div className='text-center mb-12'>
              <h2 className='text-4xl font-bold text-gray-800 mb-4'>
                Service Overview
              </h2>
              <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
                Enjoy a 60-minute private yoga class in the serene comfort of
                your vacation rental
              </p>
            </div>

            <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8'>
              <div className='text-center'>
                <div className='w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <Clock className='w-8 h-8 text-emerald-600' />
                </div>
                <h3 className='text-lg font-semibold text-gray-800 mb-2'>
                  Duration
                </h3>
                <p className='text-gray-600'>60 minutes</p>
              </div>

              <div className='text-center'>
                <div className='w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <MapPin className='w-8 h-8 text-emerald-600' />
                </div>
                <h3 className='text-lg font-semibold text-gray-800 mb-2'>
                  Meeting Point
                </h3>
                <p className='text-gray-600'>Your Vacation Rental</p>
              </div>

              <div className='text-center'>
                <div className='w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <User className='w-8 h-8 text-emerald-600' />
                </div>
                <h3 className='text-lg font-semibold text-gray-800 mb-2'>
                  Age
                </h3>
                <p className='text-gray-600'>
                  9+ (Minors with adult supervision)
                </p>
              </div>

              <div className='text-center'>
                <div className='w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <XCircle className='w-8 h-8 text-emerald-600' />
                </div>
                <h3 className='text-lg font-semibold text-gray-800 mb-2'>
                  Cancellations
                </h3>
                <p className='text-gray-600'>24+ hours allowed</p>
              </div>
            </div>

            {/* Cancellation Policy Details */}
            <div className='bg-amber-50 border border-amber-200 rounded-2xl p-6 mt-8'>
              <div className='flex items-start'>
                <Info className='w-5 h-5 text-amber-600 mr-3 mt-0.5 flex-shrink-0' />
                <div>
                  <h4 className='font-semibold text-amber-800 mb-2'>
                    Cancellation Policy
                  </h4>
                  <p className='text-amber-700 text-sm'>
                    Cancellations made more than 24 hours before the start time
                    are allowed. However, during the holiday season (Dec 20th -
                    Jan 4th), all bookings are final and non-refundable.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          className='px-2'
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

            <div className='relative z-10 p-6 text-center text-white'>
              <motion.h2
                className='text-4xl md:text-6xl font-bold mb-6'
                variants={fadeInUp}
              >
                Ready to Transform?
              </motion.h2>
              <motion.p
                className='text-xl opacity-90 mb-12 max-w-3xl mx-auto leading-relaxed'
                variants={fadeInUp}
              >
                Begin your journey to inner peace, strength, and vitality. Your
                personalized transformation awaits in your own space.
              </motion.p>

              <motion.div
                className='flex flex-col sm:flex-row gap-6 justify-center items-center'
                variants={fadeInUp}
              >
                <button
                  onClick={() => setIsModalOpen(true)}
                  className='group bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-10 py-3 rounded-2xl font-bold text-1xl flex items-center gap-3 transition-all duration-300 hover:scale-105 shadow-2xl'
                >
                  <Sparkles className='w-6 h-6' />
                  Book Now
                  <ArrowRight className='w-6 h-6 group-hover:translate-x-1 transition-transform' />
                </button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Mindfulness Quote Banner */}
        <motion.div
          className='px-2'
          initial='hidden'
          animate='visible'
          variants={fadeInUp}
        >
          <div className='bg-gradient-to-r from-emerald-100 via-teal-50 to-cyan-100 rounded-3xl p-6 text-center relative overflow-hidden'>
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
      </div>

      {/* Health & Safety Information - Enhanced */}
      <motion.div
        className='px-4'
        initial='hidden'
        animate='visible'
        variants={fadeInUp}
      >
        <div className='bg-amber-50 border border-amber-200 rounded-3xl p-8'>
          <div className='flex items-start'>
            <Shield className='w-8 h-8 text-amber-600 mr-4 flex-shrink-0 mt-1' />
            <div className='flex-1'>
              <h3 className='font-bold text-amber-800 mb-6 text-2xl'>
                Health & Wellness Guidelines
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-8 text-amber-700'>
                <div>
                  <h4 className='font-semibold mb-3 text-lg'>
                    Before Your Session:
                  </h4>
                  <ul className='space-y-2'>
                    <li>• Inform instructor of any injuries or limitations</li>
                    <li>• Avoid heavy meals 2-3 hours before practice</li>
                    <li>• Stay hydrated throughout the day</li>
                    <li>• Wear comfortable, breathable clothing</li>
                  </ul>
                </div>
                <div>
                  <h4 className='font-semibold mb-3 text-lg'>
                    During Practice:
                  </h4>
                  <ul className='space-y-2'>
                    <li>• Listen to your body and honor its limits</li>
                    <li>• Breathe deeply and stay present</li>
                    <li>• Communicate with your instructor</li>
                    <li>• Focus on your own practice, not others</li>
                  </ul>
                </div>
              </div>

              <div className='bg-amber-100 rounded-2xl p-6 mt-6'>
                <h4 className='font-bold text-amber-800 mb-3'>DISCLAIMER</h4>
                <p className='text-amber-700'>
                  <strong>For your safety and peace of mind,</strong> we
                  recommend consulting with your physician before beginning any
                  new physical activity—especially if pregnant, recovering from
                  an injury, or managing a health condition. Participation is at
                  your own discretion.
                </p>
                <p className='text-amber-700 mt-3 italic'>
                  <strong>Listen to your body.</strong>
                  <br />
                  This is your time. Your space. Your pace.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

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
