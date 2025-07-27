import React, { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Ship,
  Users,
  Utensils,
  Camera,
  ArrowRight,
  Star,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Check,
  Fish,
  Clock,
  Waves,
  Heart,
  Zap,
  PartyPopper,
  Sparkles,
  Calendar,
  MapPin,
  Palmtree,
  Sun,
  Book,
} from 'lucide-react';
import BookingModal from '../../modal/BookingModal';
import { useBooking } from '@/context/BookingContext';
import { BookingDate, Service } from '@/constants/formFields';

// Constants
const GALLERY_IMAGES = [
  {
    src: '/img/saona-island/saona-4.jpg',
    caption: 'Paradise Found: White Sand Beaches & Crystal Waters',
    mood: 'Peaceful Paradise',
  },
  {
    src: 'https://images.unsplash.com/photo-1502402772916-f8a62ea50180?q=80&w=2940&auto=format&fit=crop',
    caption: 'Sail Away to Paradise on Our Luxury Catamaran',
    mood: 'Adventure Awaits',
  },
  {
    src: 'https://images.unsplash.com/photo-1514907283155-ea5f4094c70c?q=80&w=2940&auto=format&fit=crop',
    caption: 'Swim with Starfish in Natural Pools',
    mood: 'Magical Moments',
  },
];

// Experience cards data
const EXPERIENCES = [
  {
    icon: Ship,
    title: 'Luxury Catamaran',
    subtitle: 'Sail in Style',
    description: 'Premium sailing experience with open bar',
    duration: '1.5 hrs',
    highlight: 'Premium',
  },
  {
    icon: Fish,
    title: 'Natural Pools',
    subtitle: 'Starfish Encounter',
    description: 'Swim with gentle starfish in crystal waters',
    duration: '45 min',
    highlight: 'Unique',
  },
  {
    icon: Palmtree,
    title: 'Paradise Beach',
    subtitle: 'Pristine Sands',
    description: 'Relax on endless white sand beaches',
    duration: '3+ hrs',
    highlight: 'Relaxing',
  },
  {
    icon: Utensils,
    title: 'Island Feast',
    subtitle: 'Caribbean Buffet',
    description: 'Authentic Dominican cuisine & tropical fruits',
    duration: '1 hr',
    highlight: 'Delicious',
  },
];

const QUICK_STATS = [
  { label: 'Full Day', value: '8+ Hours', icon: Clock },
  { label: 'Max Group', value: '40 People', icon: Users },
  { label: 'Rating', value: '4.9/5', icon: Star },
  { label: 'All Inclusive', value: '$89', icon: Check },
];

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const slideIn = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

interface SaonaIslandTourServiceProps {
  service: Service;
}

const SaonaIslandTourServiceView = ({
  service,
}: SaonaIslandTourServiceProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { bookService } = useBooking();

  const navigate = useCallback((direction) => {
    setCurrentIndex((prev) => {
      const newIndex = prev + direction;
      if (newIndex < 0) return GALLERY_IMAGES.length - 1;
      if (newIndex >= GALLERY_IMAGES.length) return 0;
      return newIndex;
    });
  }, []);

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
    <div className='bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 min-h-screen'>
      {/* Compact Hero with Side Content */}
      <div className='relative overflow-hidden'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16'>
          <div className='grid lg:grid-cols-2 gap-8 lg:gap-12 items-center'>
            {/* Left Content */}
            <motion.div
              className='space-y-6 sm:space-y-8 order-2 lg:order-1'
              initial='hidden'
              animate='visible'
              variants={fadeIn}
            >
              <div className='space-y-4'>
                <motion.div
                  className='inline-flex items-center bg-cyan-100 text-cyan-800 px-4 py-2 rounded-full text-sm font-semibold'
                  variants={slideIn}
                >
                  <MapPin className='w-4 h-4 mr-2' />
                  Dominican Republic • Caribbean
                </motion.div>

                <motion.h1
                  className='text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight'
                  variants={fadeIn}
                >
                  Saona Island
                  <span className='block text-3xl sm:text-4xl lg:text-5xl text-cyan-600 mt-2'>
                    Paradise Tour
                  </span>
                </motion.h1>

                <motion.p
                  className='text-lg sm:text-xl text-gray-600 leading-relaxed max-w-lg'
                  variants={fadeIn}
                >
                  Experience the Caribbean's most stunning island paradise with
                  luxury catamaran sailing, pristine beaches, and unforgettable
                  memories.
                </motion.p>
              </div>

              {/* Quick Stats Grid */}
              <motion.div className='grid grid-cols-2 gap-4' variants={fadeIn}>
                {QUICK_STATS.map((stat, index) => (
                  <motion.div
                    key={index}
                    className='bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50 hover:shadow-lg transition-all duration-300'
                    variants={scaleIn}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className='flex items-center justify-between'>
                      <div>
                        <div className='text-2xl font-bold text-gray-900'>
                          {stat.value}
                        </div>
                        <div className='text-sm text-gray-600'>
                          {stat.label}
                        </div>
                      </div>
                      <stat.icon className='w-6 h-6 text-cyan-600' />
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                className='flex flex-col sm:flex-row gap-4'
                variants={slideIn}
              >
                <button
                  onClick={() => setIsModalOpen(true)}
                  className='bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 hover:scale-105 shadow-xl flex-1 sm:flex-none'
                >
                  <Sparkles className='w-5 h-5' />
                  Book Paradise Tour
                  <ArrowRight className='w-5 h-5' />
                </button>
              </motion.div>
            </motion.div>

            {/* Right - Hero Image Gallery */}
            <motion.div
              className='relative order-1 lg:order-2'
              initial='hidden'
              animate='visible'
              variants={fadeIn}
            >
              <div className='relative h-[50vh] sm:h-[60vh] lg:h-[70vh] rounded-3xl overflow-hidden shadow-2xl'>
                <img
                  src={GALLERY_IMAGES[currentIndex].src}
                  alt='Saona Island Paradise'
                  className='absolute inset-0 w-full h-full object-cover transition-all duration-1000'
                />

                {/* Overlay */}
                <div className='absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20' />

                {/* Navigation */}
                <button
                  onClick={() => navigate(-1)}
                  className='absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-all border border-white/30'
                >
                  <ChevronLeft className='w-5 h-5 sm:w-6 sm:h-6 text-white' />
                </button>
                <button
                  onClick={() => navigate(1)}
                  className='absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-all border border-white/30'
                >
                  <ChevronRight className='w-5 h-5 sm:w-6 sm:h-6 text-white' />
                </button>

                {/* Image indicators */}
                <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2'>
                  {GALLERY_IMAGES.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        index === currentIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>

                {/* Caption */}
                <div className='absolute bottom-6 left-6 right-6 text-white'>
                  <div className='bg-black/40 backdrop-blur-sm rounded-2xl p-4'>
                    <p className='text-sm sm:text-base font-medium'>
                      {GALLERY_IMAGES[currentIndex].caption}
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <div className='absolute -top-4 -right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg'>
                ⭐ Best Seller
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Responsive Gallery for Saona Island Tour */}
      <div className='py-12 sm:py-16 lg:py-20'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          {/* Gallery Header */}
          <motion.div
            className='text-center mb-12 sm:mb-16'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className='inline-flex items-center bg-cyan-100 text-cyan-800 px-4 py-2 rounded-full text-sm font-semibold mb-4'>
              <Camera className='w-4 h-4 mr-2' />
              Photo Gallery
            </div>
            <h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4'>
              Experience Paradise
            </h2>
            <p className='text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto'>
              Discover the breathtaking beauty of Saona Island through our
              curated collection of moments
            </p>
          </motion.div>

          {/* Masonry-style Gallery Grid */}
          <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6'>
            {/* Large Featured Image - Spans 2 columns on larger screens */}
            <motion.div
              className='col-span-2 row-span-2 group relative overflow-hidden rounded-2xl lg:rounded-3xl cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500'
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.02 }}
            >
              <img
                src='https://images.unsplash.com/photo-1615787421738-e980903b0640?q=80&w=800'
                alt='Saona Island Paradise Beach'
                className='w-full h-full object-cover transition-all duration-700 group-hover:scale-110'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />

              {/* Image Badge */}
              <div className='absolute top-4 left-4 bg-cyan-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold'>
                🏝️ Featured
              </div>

              {/* Image Caption */}
              <div className='absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300'>
                <h3 className='text-lg sm:text-xl font-bold mb-1'>
                  Paradise Beach
                </h3>
                <p className='text-sm text-white/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100'>
                  Pristine white sand beaches stretch endlessly
                </p>
              </div>
            </motion.div>
            <motion.div
              className='group relative overflow-hidden rounded-2xl cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 aspect-square'
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
            >
              <img
                src='https://images.unsplash.com/photo-1514907283155-ea5f4094c70c?q=80&w=400'
                alt='Natural Pools'
                className='w-full h-full object-cover transition-all duration-700 group-hover:scale-110'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
              <div className='absolute top-3 left-3 bg-cyan-500/90 text-white px-2 py-1 rounded-full text-xs font-medium'>
                ⭐ Unique
              </div>
              <div className='absolute bottom-3 left-3 right-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                <p className='text-sm font-semibold'>Natural Pools</p>
              </div>
            </motion.div>
            {/* Caribbean Food - Taller */}
            <motion.div
              className='row-span-2 group relative overflow-hidden rounded-2xl cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500'
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
            >
              <img
                src='https://images.unsplash.com/photo-1518169640858-0d622b058e5c?q=80&w=400'
                alt='Caribbean Buffet'
                className='w-full h-full object-cover transition-all duration-700 group-hover:scale-110'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
              <div className='absolute top-4 left-4 bg-orange-500/90 text-white px-3 py-1 rounded-full text-xs font-bold'>
                🍽️ Delicious
              </div>
              <div className='absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300'>
                <h3 className='text-base font-bold mb-1'>Caribbean Feast</h3>
                <p className='text-sm text-white/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100'>
                  Authentic Dominican buffet with tropical flavors
                </p>
              </div>
            </motion.div>
            {/* Palm Trees */}
            <motion.div
              className='group relative overflow-hidden rounded-2xl cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 aspect-square'
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
            >
              <img
                src='https://images.unsplash.com/photo-1551918120-9739cb430c6d?q=80&w=400'
                alt='Tropical Paradise'
                className='w-full h-full object-cover transition-all duration-700 group-hover:scale-110'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
              <div className='absolute top-3 left-3 bg-green-500/90 text-white px-2 py-1 rounded-full text-xs font-medium'>
                🌴 Relax
              </div>
              <div className='absolute bottom-3 left-3 right-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                <p className='text-sm font-semibold'>Tropical Paradise</p>
              </div>
            </motion.div>
            {/* Snorkeling */}
            <motion.div
              className='group relative overflow-hidden rounded-2xl cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 aspect-square'
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
            >
              <img
                src='https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=400'
                alt='Snorkeling Adventure'
                className='w-full h-full object-cover transition-all duration-700 group-hover:scale-110'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
              <div className='absolute top-3 left-3 bg-purple-500/90 text-white px-2 py-1 rounded-full text-xs font-medium'>
                🐠 Adventure
              </div>
              <div className='absolute bottom-3 left-3 right-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                <p className='text-sm font-semibold'>Snorkeling</p>
              </div>
            </motion.div>
            {/* Sunset Vibes */}
            <motion.div
              className='col-span-2 group relative overflow-hidden rounded-2xl cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 aspect-video'
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              whileHover={{ scale: 1.02 }}
            >
              <img
                src='https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800'
                alt='Sunset Paradise'
                className='w-full h-full object-cover transition-all duration-700 group-hover:scale-110'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
              <div className='absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold'>
                🌅 Magical
              </div>
              <div className='absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300'>
                <h3 className='text-lg font-bold mb-1'>Golden Hour Paradise</h3>
                <p className='text-sm text-white/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100'>
                  Experience breathtaking Caribbean sunsets
                </p>
              </div>
            </motion.div>
          </div>

          {/* Gallery CTA */}
          <motion.div
            className='text-center mt-12'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <button
              onClick={() => setIsModalOpen(true)}
              className='inline-flex items-center bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg'
            >
              <Calendar className='w-5 h-5 mr-3' />
              Book Your Tour
              <ArrowRight className='w-5 h-5 ml-3' />
            </button>
            <p className='text-gray-500 text-sm mt-3'>
              Check availability to see starting times
            </p>
          </motion.div>
        </div>
      </div>

      {/* Experience Cards - Horizontal Scroll Design */}
      <div className='py-16 sm:py-20 lg:py-24'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <motion.div
            className='text-center mb-12'
            initial='hidden'
            animate='visible'
            variants={fadeIn}
          >
            <h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4'>
              Your Island Adventure
            </h2>
            <p className='text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto'>
              Four incredible experiences that will create memories to last a
              lifetime
            </p>
          </motion.div>

          {/* Cards Grid */}
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8'>
            {EXPERIENCES.map((experience, index) => (
              <motion.div
                key={index}
                className='group relative bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500'
                variants={scaleIn}
                initial='hidden'
                animate='visible'
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                {/* Highlight badge */}
                <div className='absolute -top-3 -right-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold'>
                  {experience.highlight}
                </div>

                {/* Icon */}
                <div className='w-16 h-16 bg-gradient-to-r from-cyan-100 to-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300'>
                  <experience.icon className='w-8 h-8 text-cyan-600' />
                </div>

                {/* Content */}
                <div className='space-y-3'>
                  <div>
                    <h3 className='text-xl font-bold text-gray-900 group-hover:text-cyan-600 transition-colors'>
                      {experience.title}
                    </h3>
                    <p className='text-sm text-cyan-600 font-semibold'>
                      {experience.subtitle}
                    </p>
                  </div>

                  <p className='text-gray-600 leading-relaxed'>
                    {experience.description}
                  </p>

                  <div className='flex items-center justify-between pt-2'>
                    <span className='text-sm text-gray-500'>Duration</span>
                    <span className='text-sm font-semibold text-gray-900 bg-gray-100 px-3 py-1 rounded-full'>
                      {experience.duration}
                    </span>
                  </div>
                </div>

                {/* Hover effect overlay */}
                <div className='absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Social Proof Section */}
      <div className='bg-gradient-to-r from-cyan-500 to-blue-600 py-16 sm:py-20'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <motion.div
            className='text-center text-white'
            initial='hidden'
            animate='visible'
            variants={fadeIn}
          >
            <h2 className='text-3xl sm:text-4xl font-bold mb-6'>
              Join Thousands of Happy Travelers
            </h2>
            <p className='text-xl text-white/90 mb-12 max-w-3xl mx-auto'>
              Experience the magic that has made Saona Island the #1 rated tour
              in the Caribbean
            </p>

            <div className='grid grid-cols-2 lg:grid-cols-4 gap-8'>
              {[
                { number: '5,000+', label: 'Happy Guests' },
                { number: '4.9/5', label: 'Average Rating' },
                { number: '98%', label: 'Would Recommend' },
                { number: '50+', label: 'Daily Tours' },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className='text-center'
                  variants={scaleIn}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className='text-4xl sm:text-5xl font-bold mb-2'>
                    {stat.number}
                  </div>
                  <div className='text-white/80 font-medium'>{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Final CTA */}
      <div className='py-16 sm:py-20 lg:py-24'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <motion.div
            className='space-y-8'
            initial='hidden'
            animate='visible'
            variants={fadeIn}
          >
            <div className='space-y-4'>
              <h2 className='text-4xl sm:text-5xl font-bold text-gray-900'>
                Ready for Paradise?
              </h2>
              <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
                Don't just dream about paradise – live it. Book your Saona
                Island adventure today and create memories that will last
                forever.
              </p>
            </div>

            <div className='bg-white rounded-3xl p-8 shadow-2xl border border-gray-200/50'>
              <div className='flex flex-col sm:flex-row items-center justify-between gap-6'>
                <div className='text-center sm:text-left'>
                  <div className='text-4xl font-bold text-gray-900 mb-2'>
                    $89
                  </div>
                  <div className='text-lg text-gray-600'>
                    per person • All inclusive
                  </div>
                  <div className='flex items-center justify-center sm:justify-start gap-4 mt-3 text-sm text-gray-500'>
                    <span className='flex items-center gap-1'>
                      <Check className='w-4 h-4' /> Free pickup
                    </span>
                    <span className='flex items-center gap-1'>
                      <Check className='w-4 h-4' /> Full day
                    </span>
                    <span className='flex items-center gap-1'>
                      <Check className='w-4 h-4' /> Open bar
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className='bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-10 py-4 rounded-2xl font-bold text-lg flex items-center gap-3 transition-all duration-300 hover:scale-105 shadow-xl whitespace-nowrap'
                >
                  <Calendar className='w-5 h-5' />
                  Book Your Spot
                  <ArrowRight className='w-5 h-5' />
                </button>
              </div>
            </div>

            <p className='text-sm text-gray-500'>
              ⚡ Book now and pay later • Free cancellation up to 24 hours
              before
            </p>
          </motion.div>
        </div>
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

export default SaonaIslandTourServiceView;
