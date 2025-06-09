import React, { useState } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { Service } from '@/types/type';
import { ServiceData } from '@/types/services';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  ChefHat,
  Clock,
  Calendar,
  Users,
  Check,
  Star,
  Utensils,
  Menu,
  AlertCircle,
  ArrowRight,
  Heart,
  GlassWater,
  ShoppingBag,
  Sparkles,
  Crown,
  Flame,
  Trophy,
  Coffee,
  Wine,
  Quote,
  Play,
  MapPin,
  Award,
  Shield,
  Zap,
} from 'lucide-react';
import BookingModal from '@/UI/components/modal/BookingModal';
import { useBooking } from '@/context/BookingContext';
import { BookingDate } from '@/types/type';

interface ChefServiceViewProps {
  service: Service;
  serviceData?: ServiceData;
  primaryColor: string;
}

// Enhanced data structures
const CHEF_SPECIALTIES = [
  {
    id: 'fine-dining',
    name: 'Fine Dining',
    description: 'Michelin-starred techniques with exquisite presentation',
    icon: <Crown className='w-6 h-6' />,
    image:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=800',
    features: [
      'Molecular Gastronomy',
      'Premium Ingredients',
      'Artistic Plating',
    ],
  },
  {
    id: 'comfort-gourmet',
    name: 'Comfort Gourmet',
    description: 'Elevated comfort food with sophisticated twists',
    icon: <Heart className='w-6 h-6' />,
    image:
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?auto=format&fit=crop&q=80&w=800',
    features: ['Local Flavors', 'Modern Techniques', 'Nostalgic Appeal'],
  },
  {
    id: 'international-fusion',
    name: 'International Fusion',
    description: 'Global cuisines with creative contemporary interpretations',
    icon: <Sparkles className='w-6 h-6' />,
    image:
      'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=800',
    features: ['Cultural Blend', 'Innovation', 'Authentic Spices'],
  },
  {
    id: 'healthy-luxury',
    name: 'Healthy Luxury',
    description:
      'Nutritious cuisine without compromising on flavor or elegance',
    icon: <Trophy className='w-6 h-6' />,
    image:
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800',
    features: [
      'Organic Ingredients',
      'Nutritionist Approved',
      'Beautiful Presentation',
    ],
  },
];

const CUISINE_TYPES = [
  {
    id: 'italian',
    name: 'Italian Mastery',
    description:
      "Authentic techniques from nonna's kitchen to modern interpretations",
    image:
      'https://images.unsplash.com/photo-1595295333158-4742f28fbd85?auto=format&fit=crop&q=80&w=800',
    signature: 'Handmade pasta, risotto perfection',
    color: 'from-green-500 to-red-500',
  },
  {
    id: 'french',
    name: 'French Cuisine',
    description:
      'Classic techniques and refined flavors from the heart of France',
    image:
      'https://images.unsplash.com/photo-1608855238293-a8853e7f7c98?auto=format&fit=crop&q=80&w=800',
    signature: 'Sauces, soufflés, and sophistication',
    color: 'from-blue-500 to-red-500',
  },
  {
    id: 'asian',
    name: 'Asian Fusion',
    description: 'Balance of flavors from across Asia with modern presentation',
    image:
      'https://images.unsplash.com/photo-1580442151529-343f2f6e0e27?auto=format&fit=crop&q=80&w=800',
    signature: 'Umami depth, fresh ingredients',
    color: 'from-orange-500 to-red-600',
  },
  {
    id: 'mediterranean',
    name: 'Mediterranean',
    description:
      'Sun-kissed flavors celebrating the bounty of the Mediterranean',
    image:
      'https://images.unsplash.com/photo-1559598467-f8b76c8155d0?auto=format&fit=crop&q=80&w=800',
    signature: 'Olive oil, herbs, fresh seafood',
    color: 'from-blue-400 to-green-500',
  },
  {
    id: 'latin',
    name: 'Latin American',
    description: 'Vibrant spices and bold flavors from across Latin America',
    image:
      'https://images.unsplash.com/photo-1613514785940-daed07799d9b?auto=format&fit=crop&q=80&w=800',
    signature: 'Bold spices, fresh citrus',
    color: 'from-yellow-500 to-orange-600',
  },
  {
    id: 'plant-based',
    name: 'Plant-Based Excellence',
    description: 'Innovative plant-based cuisine that satisfies every palate',
    image:
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800',
    signature: 'Creative vegetables, protein alternatives',
    color: 'from-green-400 to-emerald-600',
  },
];

const DINING_EXPERIENCES = [
  {
    id: 'intimate-dinner',
    name: 'Intimate Dinner',
    description: 'Perfect for romantic occasions or special celebrations',
    guests: '2-4 guests',
    duration: '3-4 hours',
    icon: <Heart className='w-5 h-5' />,
    features: ['Personalized menu', 'Romantic ambiance', 'Wine pairing'],
  },
  {
    id: 'family-feast',
    name: 'Family Feast',
    description: 'Bring the family together with a memorable dining experience',
    guests: '5-8 guests',
    duration: '2-3 hours',
    icon: <Users className='w-5 h-5' />,
    features: [
      'Family-style service',
      'Interactive cooking',
      'Kid-friendly options',
    ],
  },
  {
    id: 'dinner-party',
    name: 'Dinner Party',
    description: 'Impress your guests with a sophisticated evening',
    guests: '6-12 guests',
    duration: '4-5 hours',
    icon: <Sparkles className='w-5 h-5' />,
    features: ['Multi-course menu', 'Professional service', 'Custom cocktails'],
  },
  {
    id: 'celebration',
    name: 'Special Celebration',
    description: 'Make your milestone moments unforgettable',
    guests: '8-20 guests',
    duration: '4-6 hours',
    icon: <Trophy className='w-5 h-5' />,
    features: ['Themed menus', 'Special decorations', 'Photography moments'],
  },
];

const TESTIMONIALS = [
  {
    text: 'Chef Maria transformed our anniversary into an absolutely magical evening. Every dish was a masterpiece, and the attention to detail was extraordinary.',
    author: 'Elena & Carlos Rodriguez',
    event: 'Anniversary Dinner',
    image:
      'https://images.unsplash.com/photo-1494790108755-2616b612b593?auto=format&fit=crop&q=80&w=150',
    rating: 5,
    cuisine: 'Italian • Romantic Setting',
  },
  {
    text: 'Having Chef Antoine prepare our dinner party was the best decision. Our guests are still talking about the incredible flavors and presentation.',
    author: 'Michael Thompson',
    event: 'Corporate Dinner',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    rating: 5,
    cuisine: 'French • 12 Guests',
  },
  {
    text: 'The plant-based menu exceeded all expectations. Even our most skeptical guests were amazed by the creativity and incredible flavors.',
    author: 'Sarah Chen',
    event: 'Family Celebration',
    image:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',
    rating: 5,
    cuisine: 'Plant-Based • 8 Guests',
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

const ChefServiceView: React.FC<ChefServiceViewProps> = ({
  service,
  serviceData,
  primaryColor,
}) => {
  const { t } = useTranslation();
  const { bookService } = useBooking();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [selectedExperience, setSelectedExperience] = useState('');

  const isPremium = service.packageType.includes('premium');
  const maxPeople = serviceData?.metaData?.maxPeople || 12;

  const handleBookingConfirm = (
    service: Service,
    dates: BookingDate,
    guests: number
  ) => {
    bookService(service, dates, guests);
    setIsModalOpen(false);
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50'>
      <div className='max-w-8xl mx-auto space-y-16 pb-16'>
        {/* Hero Section */}
        <motion.div
          className='relative overflow-hidden rounded-3xl mx-4 mt-8'
          initial='hidden'
          animate='visible'
          variants={fadeInUp}
        >
          <div className='relative h-[85vh] bg-gradient-to-r from-amber-900/90 via-orange-800/80 to-red-900/90'>
            <Image
              src='https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1200'
              alt='Professional chef preparing gourmet cuisine'
              fill
              className='object-cover mix-blend-overlay opacity-70'
              priority
            />

            {/* Floating Culinary Elements */}
            <motion.div
              className='absolute top-20 right-20 w-20 h-20 bg-amber-500/20 rounded-full backdrop-blur-sm border border-amber-500/30 flex items-center justify-center'
              animate={{ y: [-10, 10, -10], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 6, repeat: Infinity }}
            >
              <ChefHat className='w-8 h-8 text-white' />
            </motion.div>
            <motion.div
              className='absolute bottom-32 left-16 w-16 h-16 bg-orange-500/20 rounded-full backdrop-blur-sm border border-orange-500/30 flex items-center justify-center'
              animate={{ y: [10, -10, 10], rotate: [0, -5, 5, 0] }}
              transition={{ duration: 8, repeat: Infinity }}
            >
              <Utensils className='w-6 h-6 text-white' />
            </motion.div>

            <div className='relative z-10 h-full flex items-center justify-center text-center px-8'>
              <div className='max-w-6xl'>
                <motion.div
                  className='inline-flex items-center bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20 mb-8'
                  variants={slideIn}
                >
                  {isPremium && (
                    <Crown className='w-5 h-5 text-amber-300 mr-3' />
                  )}
                  <ChefHat className='w-5 h-5 text-white mr-3' />
                  <span className='text-white font-medium text-lg'>
                    {isPremium
                      ? 'Michelin-Level Excellence'
                      : 'Culinary Artistry at Home'}
                  </span>
                </motion.div>

                <motion.h1
                  className='text-6xl md:text-8xl font-bold text-white mb-8 leading-tight'
                  variants={fadeInUp}
                >
                  Private Chef
                  <br />
                  <span className='bg-gradient-to-r from-amber-300 via-orange-300 to-red-300 bg-clip-text text-transparent'>
                    Experience
                  </span>
                </motion.h1>

                <motion.p
                  className='text-2xl md:text-3xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed'
                  variants={fadeInUp}
                >
                  Transform your dining into an extraordinary culinary journey
                  with world-class chefs in the comfort of your space
                </motion.p>

                <motion.div
                  className='flex flex-wrap justify-center gap-8 mb-12'
                  variants={slideIn}
                >
                  <div className='flex items-center bg-white/10 backdrop-blur-sm px-6 py-4 rounded-2xl border border-white/20'>
                    <Users className='w-6 h-6 text-white mr-3' />
                    <div className='text-left'>
                      <div className='text-white font-semibold'>
                        Up to {maxPeople} Guests
                      </div>
                      <div className='text-white/70 text-sm'>
                        Intimate to Celebration
                      </div>
                    </div>
                  </div>
                  <div className='flex items-center bg-white/10 backdrop-blur-sm px-6 py-4 rounded-2xl border border-white/20'>
                    <Clock className='w-6 h-6 text-white mr-3' />
                    <div className='text-left'>
                      <div className='text-white font-semibold'>3-6 Hours</div>
                      <div className='text-white/70 text-sm'>
                        Full Experience
                      </div>
                    </div>
                  </div>
                  <div className='flex items-center bg-white/10 backdrop-blur-sm px-6 py-4 rounded-2xl border border-white/20'>
                    <Award className='w-6 h-6 text-white mr-3' />
                    <div className='text-left'>
                      <div className='text-white font-semibold'>
                        Certified Chefs
                      </div>
                      <div className='text-white/70 text-sm'>
                        Professional Service
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.button
                  onClick={() => setIsModalOpen(true)}
                  className='group bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:via-orange-600 hover:to-red-600 text-white px-12 py-5 rounded-2xl font-bold text-xl flex items-center gap-3 mx-auto transition-all duration-300 hover:scale-105 shadow-2xl'
                  variants={slideIn}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className='w-7 h-7' fill='currentColor' />
                  Book Your Chef
                  <ArrowRight className='w-6 h-6 group-hover:translate-x-1 transition-transform' />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Chef Specialties */}
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
              Culinary Excellence
            </motion.h2>
            <motion.p
              className='text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed'
              variants={fadeInUp}
            >
              Our chefs master diverse culinary arts to create unforgettable
              dining experiences
            </motion.p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {CHEF_SPECIALTIES.map((specialty, index) => (
              <motion.div
                key={specialty.id}
                className='group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-4'
                variants={fadeInUp}
              >
                <div className='relative h-48'>
                  <Image
                    src={specialty.image}
                    alt={specialty.name}
                    fill
                    className='object-cover transition-transform duration-700 group-hover:scale-110'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent' />

                  <div className='absolute top-4 left-4'>
                    <div className='w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30 text-white'>
                      {specialty.icon}
                    </div>
                  </div>
                </div>

                <div className='p-6'>
                  <h3 className='text-xl font-bold text-gray-800 mb-3'>
                    {specialty.name}
                  </h3>
                  <p className='text-gray-600 mb-4 leading-relaxed'>
                    {specialty.description}
                  </p>

                  <div className='space-y-2'>
                    {specialty.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className='flex items-center text-sm text-gray-500'
                      >
                        <Check className='w-4 h-4 text-orange-500 mr-2' />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                <div className='absolute inset-0 border-2 border-transparent group-hover:border-orange-500/50 rounded-3xl transition-all duration-300' />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Cuisine Selection */}
        <motion.div
          className='px-4'
          initial='hidden'
          animate='visible'
          variants={fadeInUp}
        >
          <div className='text-center mb-16'>
            <h2 className='text-5xl font-bold text-gray-800 mb-6'>
              Global Cuisine Mastery
            </h2>
            <p className='text-2xl text-gray-600 max-w-3xl mx-auto'>
              Explore authentic flavors from around the world, expertly crafted
              by our culinary artists
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {CUISINE_TYPES.map((cuisine, index) => (
              <motion.div
                key={cuisine.id}
                className={`relative overflow-hidden rounded-3xl cursor-pointer group ${
                  selectedCuisine === cuisine.id
                    ? 'ring-4 ring-orange-500 scale-105'
                    : ''
                }`}
                onClick={() =>
                  setSelectedCuisine(
                    selectedCuisine === cuisine.id ? '' : cuisine.id
                  )
                }
                variants={fadeInUp}
                whileHover={{ y: -8 }}
              >
                <div className='relative h-80'>
                  <Image
                    src={cuisine.image}
                    alt={cuisine.name}
                    fill
                    className='object-cover transition-transform duration-700 group-hover:scale-110'
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:bg-gradient-to-t group-hover:from-black/90 group-hover:via-black/50 group-hover:to-black/20 transition-all duration-500`}
                  />

                  <div className='absolute top-6 left-6'>
                    <div
                      className={`px-4 py-2 rounded-full bg-gradient-to-r ${cuisine.color} text-white text-sm font-semibold backdrop-blur-sm`}
                    >
                      Signature Cuisine
                    </div>
                  </div>

                  <div className='absolute bottom-6 left-6 right-6 text-white'>
                    <h3 className='text-2xl font-bold mb-2'>{cuisine.name}</h3>
                    <p className='text-white/90 mb-3 leading-relaxed'>
                      {cuisine.description}
                    </p>
                    <div className='text-sm font-medium text-orange-300'>
                      {cuisine.signature}
                    </div>
                  </div>

                  {selectedCuisine === cuisine.id && (
                    <motion.div
                      className='absolute inset-0 border-4 border-orange-500 rounded-3xl'
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Dining Experiences */}
        <motion.div
          className='px-4'
          initial='hidden'
          animate='visible'
          variants={fadeInUp}
        >
          <div className='bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl p-12'>
            <div className='text-center mb-16'>
              <h2 className='text-5xl font-bold text-gray-800 mb-6'>
                Tailored Experiences
              </h2>
              <p className='text-2xl text-gray-600 max-w-3xl mx-auto'>
                Choose the perfect dining experience for your occasion and group
                size
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              {DINING_EXPERIENCES.map((experience, index) => (
                <motion.div
                  key={experience.id}
                  className={`relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer group ${
                    selectedExperience === experience.id
                      ? 'ring-4 ring-orange-500'
                      : ''
                  }`}
                  onClick={() =>
                    setSelectedExperience(
                      selectedExperience === experience.id ? '' : experience.id
                    )
                  }
                  variants={fadeInUp}
                  whileHover={{ y: -4 }}
                >
                  <div className='flex items-center mb-6'>
                    <div className='w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center text-white mr-4 group-hover:scale-110 transition-transform'>
                      {experience.icon}
                    </div>
                    <div>
                      <h3 className='text-2xl font-bold text-gray-800'>
                        {experience.name}
                      </h3>
                      <div className='flex items-center space-x-4 text-sm text-gray-500 mt-1'>
                        <span className='flex items-center'>
                          <Users className='w-4 h-4 mr-1' />
                          {experience.guests}
                        </span>
                        <span className='flex items-center'>
                          <Clock className='w-4 h-4 mr-1' />
                          {experience.duration}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className='text-gray-600 mb-6 leading-relaxed'>
                    {experience.description}
                  </p>

                  <div className='space-y-3'>
                    {experience.features.map((feature, idx) => (
                      <div key={idx} className='flex items-center'>
                        <Check className='w-5 h-5 text-orange-500 mr-3' />
                        <span className='text-gray-700'>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {selectedExperience === experience.id && (
                    <motion.div
                      className='absolute inset-0 bg-orange-500/5 border-4 border-orange-500 rounded-3xl'
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* The Chef Experience Process */}
        <motion.div
          className='px-4'
          initial='hidden'
          animate='visible'
          variants={fadeInUp}
        >
          <div className='bg-white rounded-3xl shadow-2xl overflow-hidden'>
            <div className='bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 p-12 text-white text-center'>
              <h2 className='text-4xl font-bold mb-4'>
                The Chef Experience Journey
              </h2>
              <p className='text-xl opacity-90 max-w-2xl mx-auto'>
                From consultation to cleanup, every detail is crafted for your
                ultimate satisfaction
              </p>
            </div>

            <div className='p-12'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-12'>
                <div className='space-y-8'>
                  {[
                    {
                      icon: Calendar,
                      title: 'Personal Consultation',
                      desc: 'Discuss your vision, preferences, and dietary requirements',
                      step: '1',
                    },
                    {
                      icon: Menu,
                      title: 'Custom Menu Design',
                      desc: 'Receive a personalized menu tailored to your taste and occasion',
                      step: '2',
                    },
                    {
                      icon: ShoppingBag,
                      title: 'Premium Ingredient Sourcing',
                      desc: 'Fresh, high-quality ingredients selected and prepared',
                      step: '3',
                    },
                    {
                      icon: ChefHat,
                      title: 'Culinary Excellence',
                      desc: 'Professional preparation, cooking, and elegant presentation',
                      step: '4',
                    },
                    {
                      icon: Utensils,
                      title: 'Exceptional Service',
                      desc: 'Enjoy restaurant-quality service in your own space',
                      step: '5',
                    },
                    {
                      icon: Sparkles,
                      title: 'Complete Cleanup',
                      desc: 'Relax while we handle all cleanup and kitchen restoration',
                      step: '6',
                    },
                  ].map((item, index) => (
                    <div key={index} className='flex items-start space-x-4'>
                      <div className='relative'>
                        <div className='w-14 h-14 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg'>
                          {item.step}
                        </div>
                        {index < 5 && (
                          <div className='absolute top-14 left-1/2 transform -translate-x-1/2 w-0.5 h-8 bg-gradient-to-b from-orange-500 to-orange-300' />
                        )}
                      </div>
                      <div className='flex-1'>
                        <div className='flex items-center mb-2'>
                          <item.icon className='w-5 h-5 text-orange-500 mr-2' />
                          <h4 className='text-lg font-bold text-gray-800'>
                            {item.title}
                          </h4>
                        </div>
                        <p className='text-gray-600'>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className='space-y-6'>
                  <div className='relative h-64 rounded-3xl overflow-hidden'>
                    <Image
                      src='https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=800'
                      alt='Elegant dining presentation'
                      fill
                      className='object-cover'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end'>
                      <div className='p-6 text-white'>
                        <h4 className='text-xl font-bold mb-2'>
                          Exquisite Presentation
                        </h4>
                        <p className='text-white/90'>
                          Restaurant-quality plating and service
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className='bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-orange-200'>
                    <div className='flex items-center mb-3'>
                      <Trophy className='w-6 h-6 text-orange-600 mr-2' />
                      <h4 className='font-bold text-orange-800'>
                        Premium Service Guarantee
                      </h4>
                    </div>
                    <p className='text-orange-700 text-sm'>
                      Our chefs are certified professionals with extensive
                      experience in fine dining establishments. Every ingredient
                      is carefully sourced, and each dish is prepared to
                      perfection.
                    </p>
                  </div>
                </div>
              </div>
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
          <div className='grid grid-cols-1 md:grid-cols-2 gap-12'>
            <div className='bg-white rounded-3xl shadow-lg p-8'>
              <h2 className='text-3xl font-bold text-gray-800 mb-8 flex items-center'>
                <Shield className='w-8 h-8 text-green-600 mr-3' />
                What's Included
              </h2>

              <div className='space-y-6'>
                {[
                  {
                    icon: ChefHat,
                    text: 'Professional Chef & Assistant',
                    desc: 'Certified culinary professionals',
                  },
                  {
                    icon: Menu,
                    text: 'Custom Menu Planning',
                    desc: 'Personalized to your preferences',
                  },
                  {
                    icon: ShoppingBag,
                    text: 'Premium Ingredient Sourcing',
                    desc: 'Freshest, highest quality ingredients',
                  },
                  {
                    icon: Utensils,
                    text: 'Complete Table Service',
                    desc: 'Professional plating and presentation',
                  },
                  {
                    icon: Wine,
                    text: 'Wine Pairing Consultation',
                    desc: 'Expert beverage recommendations',
                  },
                  {
                    icon: Sparkles,
                    text: 'Full Kitchen Cleanup',
                    desc: 'Leave the mess to us',
                  },
                ].map((item, index) => (
                  <div key={index} className='flex items-start space-x-4'>
                    <div className='w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center flex-shrink-0'>
                      <item.icon className='w-6 h-6 text-green-600' />
                    </div>
                    <div>
                      <h4 className='text-lg font-bold text-gray-800 mb-1'>
                        {item.text}
                      </h4>
                      <p className='text-gray-600 text-sm'>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className='bg-white rounded-3xl shadow-lg p-8'>
              <h2 className='text-3xl font-bold text-gray-800 mb-8 flex items-center'>
                <Heart className='w-8 h-8 text-red-600 mr-3' />
                Dietary Accommodations
              </h2>

              <div className='grid grid-cols-2 gap-4 mb-6'>
                {[
                  'Vegetarian',
                  'Vegan',
                  'Gluten-Free',
                  'Dairy-Free',
                  'Keto Friendly',
                  'Paleo',
                  'Low Sodium',
                  'Nut-Free',
                ].map((diet) => (
                  <div
                    key={diet}
                    className='flex items-center p-3 bg-red-50 rounded-lg border border-red-100'
                  >
                    <Check className='w-5 h-5 text-red-500 mr-2' />
                    <span className='text-gray-800 text-sm font-medium'>
                      {diet}
                    </span>
                  </div>
                ))}
              </div>

              <div className='bg-amber-50 border border-amber-200 rounded-2xl p-4'>
                <div className='flex items-start'>
                  <AlertCircle className='w-5 h-5 text-amber-600 mr-3 mt-0.5' />
                  <div>
                    <h4 className='font-bold text-amber-800 mb-1'>
                      Allergy Notice
                    </h4>
                    <p className='text-amber-700 text-sm'>
                      Please inform us of any food allergies or special dietary
                      requirements during booking. Our chefs will ensure safe
                      preparation and handling.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Testimonials */}
        <motion.div
          className='px-4'
          initial='hidden'
          animate='visible'
          variants={fadeInUp}
        >
          <div className='text-center mb-16'>
            <h2 className='text-5xl font-bold text-gray-800 mb-6'>
              Culinary Success Stories
            </h2>
            <p className='text-2xl text-gray-600 max-w-3xl mx-auto'>
              Hear from guests who experienced extraordinary dining moments
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {TESTIMONIALS.map((testimonial, index) => (
              <motion.div
                key={index}
                className='bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 group relative overflow-hidden'
                variants={fadeInUp}
                whileHover={{ y: -4 }}
              >
                <div className='absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-bl-full' />

                <div className='flex items-center mb-6'>
                  <div className='relative w-16 h-16 rounded-full overflow-hidden mr-4'>
                    <Image
                      src={testimonial.image}
                      alt={testimonial.author}
                      fill
                      className='object-cover'
                    />
                  </div>
                  <div>
                    <h4 className='font-bold text-gray-800'>
                      {testimonial.author}
                    </h4>
                    <p className='text-gray-500 text-sm'>{testimonial.event}</p>
                    <div className='flex mt-1'>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className='w-4 h-4 text-yellow-400 fill-current'
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <Quote className='w-8 h-8 text-orange-500 mb-4' />
                <p className='text-gray-700 mb-4 leading-relaxed italic'>
                  "{testimonial.text}"
                </p>

                <div className='text-sm text-orange-600 font-medium bg-orange-50 px-3 py-1 rounded-full inline-block'>
                  {testimonial.cuisine}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Pricing & CTA */}
        <motion.div
          className='px-4'
          initial='hidden'
          animate='visible'
          variants={fadeInUp}
        >
          <div className='relative overflow-hidden rounded-3xl'>
            <div className='absolute inset-0'>
              <Image
                src='https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80&w=1200'
                alt='Elegant dining setup'
                fill
                className='object-cover'
              />
              <div className='absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/80' />
            </div>

            <div className='relative z-10 p-16 text-center text-white'>
              <motion.h2
                className='text-5xl md:text-6xl font-bold mb-6'
                variants={fadeInUp}
              >
                Ready to Indulge?
              </motion.h2>
              <motion.p
                className='text-2xl opacity-90 mb-12 max-w-3xl mx-auto leading-relaxed'
                variants={fadeInUp}
              >
                Transform your next gathering into an unforgettable culinary
                experience. Book your private chef today and taste the
                extraordinary.
              </motion.p>

              <motion.div
                className='flex flex-col sm:flex-row gap-8 justify-center items-center'
                variants={fadeInUp}
              >
                <div className='text-center'>
                  <div className='text-5xl font-bold mb-2'>
                    ${service.price}
                  </div>
                  <div className='text-white/70 text-lg'>
                    Starting price per experience
                  </div>
                  <div className='text-white/60 text-sm mt-1'>
                    + ingredients & customizations
                  </div>
                </div>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className='group bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:via-orange-600 hover:to-red-600 text-white px-12 py-5 rounded-2xl font-bold text-xl flex items-center gap-3 transition-all duration-300 hover:scale-105 shadow-2xl'
                >
                  <ChefHat className='w-6 h-6' />
                  Book Your Chef Experience
                  <ArrowRight className='w-6 h-6 group-hover:translate-x-1 transition-transform' />
                </button>
              </motion.div>

              <motion.div
                className='mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center'
                variants={stagger}
              >
                <motion.div
                  variants={fadeInUp}
                  className='bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20'
                >
                  <Zap className='w-8 h-8 text-yellow-400 mx-auto mb-3' />
                  <h4 className='font-bold mb-2'>Instant Booking</h4>
                  <p className='text-white/80 text-sm'>
                    Quick confirmation & scheduling
                  </p>
                </motion.div>
                <motion.div
                  variants={fadeInUp}
                  className='bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20'
                >
                  <Shield className='w-8 h-8 text-green-400 mx-auto mb-3' />
                  <h4 className='font-bold mb-2'>Satisfaction Guaranteed</h4>
                  <p className='text-white/80 text-sm'>
                    100% satisfaction or money back
                  </p>
                </motion.div>
                <motion.div
                  variants={fadeInUp}
                  className='bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20'
                >
                  <Award className='w-8 h-8 text-purple-400 mx-auto mb-3' />
                  <h4 className='font-bold mb-2'>Premium Service</h4>
                  <p className='text-white/80 text-sm'>
                    Michelin-level culinary expertise
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Inspirational Quote */}
        <motion.div
          className='px-4'
          initial='hidden'
          animate='visible'
          variants={fadeInUp}
        >
          <div className='bg-gradient-to-r from-amber-100 via-orange-50 to-red-100 rounded-3xl p-12 text-center relative overflow-hidden'>
            <motion.div
              className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500'
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 2, delay: 0.5 }}
            />

            <Quote className='w-12 h-12 text-orange-500 mx-auto mb-6' />
            <blockquote className='text-3xl md:text-4xl font-light text-gray-800 mb-6 italic leading-relaxed'>
              "Cooking is not about convenience. It's about love, culture, and
              the beauty of transformation."
            </blockquote>
            <cite className='text-xl text-orange-600 font-medium'>
              - Chef Auguste Escoffier
            </cite>
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

export default ChefServiceView;
