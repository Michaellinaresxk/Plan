import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { Service } from '@/types/type';
import { ServiceData } from '@/types/services';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useBooking } from '@/context/BookingContext';
import { BookingDate } from '@/types/type';
import BookingModal from '../../modal/BookingModal';
import {
  Music,
  Mic,
  Speaker,
  Clock,
  Users,
  PartyPopper,
  Star,
  ArrowRight,
  Play,
  ChevronLeft,
  ChevronRight,
  Heart,
  CheckCircle,
  Sparkles,
  Zap,
  Volume2,
  Disc3,
  Trophy,
  Gift,
  AlertTriangle,
  Monitor,
  Power,
  Home,
  Timer,
  Calendar,
  MapPin,
  X,
  Info,
  Phone,
  MessageCircle,
} from 'lucide-react';

// ===== TYPES =====
interface KaraokeServiceViewProps {
  service: Service;
  serviceData?: ServiceData;
  primaryColor?: string;
  viewContext?: 'standard-view' | 'premium-view';
}

interface KaraokeExperience {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  vibe: string;
  duration?: string;
  minGuests?: number;
  maxGuests?: number;
}

interface GalleryImage {
  src: string;
  alt: string;
  caption: string;
  loading?: 'lazy' | 'eager';
}

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  occasion: string;
  rating: number;
  emoji: string;
  location?: string;
  date?: string;
}

interface SongCategory {
  genre: string;
  icon: string;
  color: string;
  examples: string;
  songCount?: number;
}

interface PartyTip {
  icon: React.ComponentType<any>;
  title: string;
  tip: string;
  detail: string;
  color: string;
}

// ===== CONSTANTS =====
const KARAOKE_EXPERIENCES: KaraokeExperience[] = [
  {
    id: 'classic',
    name: 'Classic Karaoke',
    icon: '🎤',
    color: 'from-slate-700 to-slate-600',
    description: 'Traditional karaoke fun with all your favorite hits',
    vibe: 'Timeless hits & sing-alongs',
    duration: '2-4 hours',
    minGuests: 2,
    maxGuests: 20,
  },
  {
    id: 'family',
    name: 'Family-Friendly Sessions',
    icon: '👨‍👩‍👧‍👦',
    color: 'from-emerald-700 to-emerald-600',
    description: 'Kid-safe songs perfect for family bonding time',
    vibe: 'Disney classics & clean favorites',
    duration: '1-3 hours',
    minGuests: 4,
    maxGuests: 15,
  },
  {
    id: 'bachelorette',
    name: 'Bachelorette Parties',
    icon: '💃',
    color: 'from-rose-700 to-rose-600',
    description: 'Ultimate girls night with empowering anthems',
    vibe: 'Girl power & dance hits',
    duration: '3-5 hours',
    minGuests: 6,
    maxGuests: 25,
  },
  {
    id: 'throwback',
    name: 'Throwback Nights',
    icon: '📻',
    color: 'from-amber-700 to-amber-600',
    description: 'Nostalgic hits from the 80s, 90s, and 2000s',
    vibe: 'Retro vibes & nostalgia',
    duration: '2-4 hours',
    minGuests: 4,
    maxGuests: 30,
  },
  {
    id: 'beach',
    name: 'Beach or Terrace Setups',
    icon: '🏖️',
    color: 'from-teal-700 to-teal-600',
    description: 'Open-air karaoke with ocean breeze vibes',
    vibe: 'Tropical & chill atmosphere',
    duration: '2-6 hours',
    minGuests: 6,
    maxGuests: 40,
  },
  {
    id: 'themed',
    name: 'Themed Song Nights',
    icon: '🎭',
    color: 'from-indigo-700 to-indigo-600',
    description: 'Curated playlists for specific genres or decades',
    vibe: 'Custom themes & special requests',
    duration: '2-4 hours',
    minGuests: 8,
    maxGuests: 35,
  },
];

const KARAOKE_GALLERY: GalleryImage[] = [
  {
    src: 'https://images.pexels.com/photos/2531728/pexels-photo-2531728.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&dpr=2',
    alt: 'Friends singing karaoke together',
    caption: 'SING, LAUGH & MAKE MEMORIES',
    loading: 'eager',
  },
  {
    src: 'https://images.pexels.com/photos/7097462/pexels-photo-7097462.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&dpr=2',
    alt: 'Professional karaoke setup',
    caption: 'Professional Equipment for Maximum Fun',
    loading: 'lazy',
  },
  {
    src: 'https://images.pexels.com/photos/1154189/pexels-photo-1154189.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&dpr=2',
    alt: 'Family karaoke party',
    caption: 'Perfect for All Ages & Occasions',
    loading: 'lazy',
  },
  {
    src: 'https://images.pexels.com/photos/5257587/pexels-photo-5257587.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&dpr=2',
    alt: 'Villa karaoke party setup',
    caption: 'Transform Your Villa into a Concert Stage',
    loading: 'lazy',
  },
];

const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    quote:
      "OMG! This was THE highlight of our bachelorette weekend! The girls are still talking about Sarah's epic rendition of 'I Will Survive'. Worth every penny!",
    author: 'Jessica M.',
    occasion: 'Bachelorette Party',
    rating: 5,
    emoji: '💃',
    location: 'Villa Marina',
    date: 'March 2024',
  },
  {
    id: '2',
    quote:
      'Our kids had the time of their lives! Even grandma joined in for some Disney classics. The setup was so easy and the song selection was perfect for all ages.',
    author: 'Carlos R.',
    occasion: 'Family Reunion',
    rating: 5,
    emoji: '👨‍👩‍👧‍👦',
    location: 'Casa Blanca',
    date: 'February 2024',
  },
  {
    id: '3',
    quote:
      'Best birthday party EVER! We sang until midnight and the neighbors even asked to join. The wireless mics were a game-changer - no tangled cables!',
    author: 'Amanda K.',
    occasion: '30th Birthday',
    rating: 5,
    emoji: '🎂',
    location: 'Villa Sunset',
    date: 'January 2024',
  },
];

const SONG_CATEGORIES: SongCategory[] = [
  {
    genre: 'Pop Hits',
    icon: '🎵',
    color: 'from-slate-700 to-slate-600',
    examples: 'Dua Lipa, Ed Sheeran, Taylor Swift',
    songCount: 850,
  },
  {
    genre: 'Rock Classics',
    icon: '🤘',
    color: 'from-slate-800 to-slate-700',
    examples: 'Queen, AC/DC, Bon Jovi',
    songCount: 720,
  },
  {
    genre: 'Latin Fire',
    icon: '🔥',
    color: 'from-amber-700 to-amber-600',
    examples: 'Bad Bunny, Shakira, Manu Chao',
    songCount: 650,
  },
  {
    genre: 'R&B Soul',
    icon: '💖',
    color: 'from-purple-700 to-purple-600',
    examples: 'Beyoncé, Bruno Mars, Alicia Keys',
    songCount: 580,
  },
  {
    genre: 'Country Vibes',
    icon: '🤠',
    color: 'from-amber-800 to-amber-700',
    examples: 'Shania Twain, Keith Urban',
    songCount: 420,
  },
  {
    genre: 'Disney Magic',
    icon: '✨',
    color: 'from-indigo-700 to-indigo-600',
    examples: 'Frozen, Moana, Lion King',
    songCount: 180,
  },
  {
    genre: '80s Retro',
    icon: '🕺',
    color: 'from-slate-600 to-slate-500',
    examples: 'Madonna, Michael Jackson',
    songCount: 340,
  },
  {
    genre: '90s Nostalgia',
    icon: '📻',
    color: 'from-stone-700 to-stone-600',
    examples: 'Backstreet Boys, Spice Girls',
    songCount: 380,
  },
  {
    genre: 'Dance Floor',
    icon: '💃',
    color: 'from-purple-800 to-purple-700',
    examples: 'David Guetta, Calvin Harris',
    songCount: 290,
  },
  {
    genre: 'Duets',
    icon: '👫',
    color: 'from-rose-800 to-rose-700',
    examples: 'Perfect duet songs for couples',
    songCount: 150,
  },
  {
    genre: 'Rap Battles',
    icon: '🎤',
    color: 'from-gray-800 to-gray-700',
    examples: 'Eminem, Drake, Kendrick',
    songCount: 460,
  },
  {
    genre: 'Karaoke Gold',
    icon: '🏆',
    color: 'from-amber-600 to-amber-700',
    examples: "Sweet Caroline, Don't Stop",
    songCount: 200,
  },
];

const PARTY_TIPS: PartyTip[] = [
  {
    icon: Heart,
    title: 'Warm-Up Playlist',
    tip: 'Start with crowd favorites everyone knows',
    detail:
      'Get the energy flowing with songs like "Sweet Caroline" or "Don\'t Stop Believin\'"',
    color: 'from-rose-700 to-rose-600',
  },
  {
    icon: Users,
    title: 'Group Songs',
    tip: 'Plan duets and group performances',
    detail:
      'Include classics like "Bohemian Rhapsody" or "Friends in Low Places"',
    color: 'from-indigo-700 to-indigo-600',
  },
  {
    icon: Monitor,
    title: 'Perfect Setup',
    tip: 'Arrange seating for the best view',
    detail: 'Leave open space for performers to move and dance freely',
    color: 'from-emerald-700 to-emerald-600',
  },
  {
    icon: Zap,
    title: 'Keep It Rolling',
    tip: 'Have the next singer ready',
    detail: 'Avoid downtime by queuing up songs and encouraging participation',
    color: 'from-amber-700 to-amber-600',
  },
];

// ===== ANIMATION VARIANTS =====
const animationVariants = {
  bounceIn: {
    hidden: { opacity: 0, scale: 0.3 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 260,
        damping: 20,
        duration: 0.6,
      },
    },
  },
  slideUp: {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  },
  stagger: {
    visible: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  },
  pulse: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.6 },
    },
  },
  slideLeft: {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6 },
    },
  },
  slideRight: {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6 },
    },
  },
};

// ===== CUSTOM HOOKS =====
const useGalleryNavigation = (imagesLength: number) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const navigate = useCallback(
    (direction: number) => {
      setCurrentIndex((prev) => {
        const newIndex = prev + direction;
        if (newIndex < 0) return imagesLength - 1;
        if (newIndex >= imagesLength) return 0;
        return newIndex;
      });
    },
    [imagesLength]
  );

  const goToSlide = useCallback(
    (index: number) => {
      if (index >= 0 && index < imagesLength) {
        setCurrentIndex(index);
      }
    },
    [imagesLength]
  );

  return { currentIndex, navigate, goToSlide };
};

const useAutoSlide = (
  callback: () => void,
  delay: number,
  paused: boolean = false
) => {
  useEffect(() => {
    if (paused) return;

    const interval = setInterval(callback, delay);
    return () => clearInterval(interval);
  }, [callback, delay, paused]);
};

// ===== COMPONENTS =====
const LoadingSpinner: React.FC = () => (
  <div className='flex items-center justify-center p-8'>
    <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600'></div>
  </div>
);

const ErrorBoundary: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({
  children,
  fallback = (
    <div className='text-center p-8 text-red-500'>Something went wrong</div>
  ),
}) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = () => setHasError(true);
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) return <>{fallback}</>;
  return <>{children}</>;
};

const ContactInfo: React.FC = () => (
  <motion.div
    className='fixed bottom-6 right-6 z-50'
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ delay: 1, type: 'spring' }}
  >
    <div className='bg-white/10 backdrop-blur-md rounded-full p-4 border border-white/20'>
      <div className='flex gap-3'>
        <button
          className='w-12 h-12 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors'
          title='WhatsApp'
        >
          <MessageCircle className='w-6 h-6 text-white' />
        </button>
        <button
          className='w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors'
          title='Call us'
        >
          <Phone className='w-6 h-6 text-white' />
        </button>
      </div>
    </div>
  </motion.div>
);

const ImageGallery: React.FC<{
  images: GalleryImage[];
  currentIndex: number;
  onNavigate: (direction: number) => void;
  onSlideClick: (index: number) => void;
}> = ({ images, currentIndex, onNavigate, onSlideClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-slide functionality
  useAutoSlide(
    () => {
      onNavigate(1);
    },
    5000,
    isPaused
  );

  return (
    <div
      className='relative h-screen overflow-hidden'
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode='wait'>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className='absolute inset-0'
        >
          <Image
            src={images[currentIndex].src}
            alt={images[currentIndex].alt}
            fill
            className='object-cover'
            priority={images[currentIndex].loading === 'eager'}
            onLoad={() => setImageLoaded(true)}
          />
          {!imageLoaded && <LoadingSpinner />}
          <div className='absolute inset-0 bg-gradient-to-b from-purple-900/80 via-pink-900/70 to-indigo-900/80' />
        </motion.div>
      </AnimatePresence>

      {/* Navigation arrows */}
      <div className='absolute inset-0 flex items-center justify-between px-8 z-10'>
        <button
          onClick={() => onNavigate(-1)}
          className='h-16 w-16 rounded-full flex items-center justify-center backdrop-blur-md border border-white/30 bg-white/20 text-white hover:bg-white hover:text-purple-600 transition-all duration-300'
          aria-label='Previous image'
        >
          <ChevronLeft className='h-8 w-8' />
        </button>

        <button
          onClick={() => onNavigate(1)}
          className='h-16 w-16 rounded-full flex items-center justify-center backdrop-blur-md border border-white/30 bg-white/20 text-white hover:bg-white hover:text-purple-600 transition-all duration-300'
          aria-label='Next image'
        >
          <ChevronRight className='h-8 w-8' />
        </button>
      </div>

      {/* Slide indicators */}
      <div className='absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20'>
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => onSlideClick(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-white scale-125'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

const ExperienceCard: React.FC<{
  experience: KaraokeExperience;
  isSelected: boolean;
  onSelect: (id: string) => void;
}> = ({ experience, isSelected, onSelect }) => (
  <motion.div
    className={`bg-gradient-to-br ${
      experience.color
    } rounded-3xl p-8 text-white cursor-pointer transition-all duration-300 ${
      isSelected ? 'ring-4 ring-white scale-105' : 'hover:scale-105'
    }`}
    variants={animationVariants.bounceIn}
    whileHover={{ y: -8 }}
    onClick={() => onSelect(experience.id)}
  >
    <div className='text-6xl mb-4 text-center'>{experience.icon}</div>
    <h3 className='text-2xl font-bold mb-4 text-center'>{experience.name}</h3>
    <p className='text-lg mb-4 leading-relaxed'>{experience.description}</p>
    <div className='border-t border-white/20 pt-4'>
      <p className='text-sm font-medium opacity-90'>{experience.vibe}</p>
      {experience.duration && (
        <p className='text-sm opacity-75 mt-1'>
          Duration: {experience.duration}
        </p>
      )}
      {experience.minGuests && experience.maxGuests && (
        <p className='text-sm opacity-75 mt-1'>
          Guests: {experience.minGuests}-{experience.maxGuests} people
        </p>
      )}
    </div>
  </motion.div>
);

// ===== MAIN COMPONENT =====
const KaraokeServiceView: React.FC<KaraokeServiceViewProps> = ({
  service,
  serviceData,
  primaryColor = 'purple',
  viewContext = 'standard-view',
}) => {
  const { t } = useTranslation();
  const { bookService } = useBooking();

  // State management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);

  // Custom hooks
  const { currentIndex, navigate, goToSlide } = useGalleryNavigation(
    KARAOKE_GALLERY.length
  );

  // Memoized calculations
  const totalSongs = useMemo(
    () =>
      SONG_CATEGORIES.reduce(
        (total, category) => total + (category.songCount || 0),
        0
      ),
    []
  );

  const averageRating = useMemo(
    () =>
      TESTIMONIALS.reduce((sum, testimonial) => sum + testimonial.rating, 0) /
      TESTIMONIALS.length,
    []
  );

  // Event handlers
  const handleBooking = useCallback(
    async (service: Service, dates: BookingDate, guests: number) => {
      try {
        setIsLoading(true);
        await bookService(service, dates, guests);
        setIsModalOpen(false);
      } catch (error) {
        console.error('Booking failed:', error);
        // Handle error (show toast, etc.)
      } finally {
        setIsLoading(false);
      }
    },
    [bookService]
  );

  const handleExperienceSelect = useCallback((experienceId: string) => {
    setSelectedExperience((prev) =>
      prev === experienceId ? '' : experienceId
    );
  }, []);

  const handleContactClick = useCallback(() => {
    setShowContactInfo(true);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
      if (e.key === 'Escape') setIsModalOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return (
    <ErrorBoundary>
      <div className='min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900'>
        <div className='max-w-7xl mx-auto'>
          {/* Hero Section */}
          <motion.section
            className='relative h-screen flex items-center justify-center px-6 overflow-hidden'
            initial='hidden'
            animate='visible'
            variants={animationVariants.slideUp}
          >
            <ImageGallery
              images={KARAOKE_GALLERY}
              currentIndex={currentIndex}
              onNavigate={navigate}
              onSlideClick={goToSlide}
            />

            {/* Floating decorative elements */}
            <div className='absolute inset-0 overflow-hidden pointer-events-none'>
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className='absolute text-white/10'
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    fontSize: `${Math.random() * 3 + 2}rem`,
                  }}
                  animate={{
                    y: [-20, 20],
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: Math.random() * 10 + 5,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                >
                  {
                    ['🎵', '🎶', '🎤', '⭐', '💫'][
                      Math.floor(Math.random() * 5)
                    ]
                  }
                </motion.div>
              ))}
            </div>

            {/* Main content */}
            <div className='relative z-20 text-center max-w-5xl'>
              <motion.div
                className='inline-flex items-center bg-white/10 backdrop-blur-md px-8 py-4 rounded-full border border-white/30 mb-8'
                variants={animationVariants.bounceIn}
              >
                <PartyPopper className='w-6 h-6 text-white mr-4' />
                <span className='text-white font-bold text-lg tracking-wide'>
                  {KARAOKE_GALLERY[currentIndex].caption}
                </span>
              </motion.div>

              <motion.h1
                className='text-5xl md:text-7xl font-bold text-white mb-6 leading-tight'
                variants={animationVariants.slideUp}
              >
                Bring the Magic of
                <br />
                <span className='bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent'>
                  Karaoke Home
                </span>
              </motion.h1>

              <motion.div
                className='text-2xl md:text-4xl font-bold text-white/90 mb-8'
                variants={animationVariants.slideUp}
              >
                Professional • Personal • Unforgettable
              </motion.div>

              <motion.p
                className='text-xl md:text-2xl text-white/90 mb-12 leading-relaxed max-w-4xl mx-auto'
                variants={animationVariants.slideUp}
              >
                Bring the party to your villa with a private karaoke session,
                perfect for birthdays, family nights, bachelorette parties, or
                just some carefree fun. Our mobile setup includes everything you
                need for an unforgettable night of music and good vibes.
              </motion.p>

              <motion.div
                className='flex flex-col sm:flex-row gap-6 justify-center items-center'
                variants={animationVariants.slideUp}
              >
                <button
                  onClick={() => setIsModalOpen(true)}
                  disabled={isLoading}
                  className='bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 text-white px-16 py-6 rounded-2xl font-bold text-2xl flex items-center gap-4 transition-all duration-300 hover:scale-105 shadow-2xl group disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {isLoading ? (
                    <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-white'></div>
                  ) : (
                    <>
                      <PartyPopper className='w-8 h-8 group-hover:rotate-12 transition-transform' />
                      Book Your Karaoke Party
                      <ArrowRight className='w-8 h-8 group-hover:translate-x-2 transition-transform' />
                    </>
                  )}
                </button>

                <button
                  onClick={handleContactClick}
                  className='border-2 border-white/30 hover:border-white text-white px-12 py-6 rounded-2xl font-bold text-xl flex items-center gap-3 transition-all duration-300 hover:bg-white/10'
                >
                  <Info className='w-6 h-6' />
                  Get More Info
                </button>
              </motion.div>

              {/* Quick stats */}
              <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mt-16'>
                <motion.div
                  className='text-center'
                  variants={animationVariants.fadeIn}
                >
                  <div className='w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4'>
                    <Users className='w-8 h-8 text-pink-400' />
                  </div>
                  <h3 className='text-xl font-bold text-white mb-2'>
                    Unlimited Guests
                  </h3>
                  <p className='text-white/70'>
                    Perfect for groups of any size
                  </p>
                </motion.div>

                <motion.div
                  className='text-center'
                  variants={animationVariants.fadeIn}
                >
                  <div className='w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4'>
                    <Heart className='w-8 h-8 text-red-400' />
                  </div>
                  <h3 className='text-xl font-bold text-white mb-2'>
                    {averageRating.toFixed(1)} ⭐ Rating
                  </h3>
                  <p className='text-white/70'>
                    From {TESTIMONIALS.length} verified reviews
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.section>

          {/* Experience Selection Section */}
          <motion.section
            className='py-32 px-6 bg-gradient-to-b from-purple-900 via-indigo-900 to-pink-900'
            initial='hidden'
            animate='visible'
            variants={animationVariants.stagger}
          >
            <motion.div
              className='text-center mb-20'
              variants={animationVariants.slideUp}
            >
              <h2 className='text-5xl md:text-6xl font-bold text-white mb-8'>
                Choose Your Experience
              </h2>
              <p className='text-2xl text-white/80 max-w-4xl mx-auto'>
                Every celebration is unique. Pick the perfect karaoke experience
                for your group
              </p>
            </motion.div>

            <div className='max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {KARAOKE_EXPERIENCES.map((experience) => (
                <ExperienceCard
                  key={experience.id}
                  experience={experience}
                  isSelected={selectedExperience === experience.id}
                  onSelect={handleExperienceSelect}
                />
              ))}
            </div>

            {selectedExperience && (
              <motion.div
                className='mt-16 text-center'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className='bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 max-w-2xl mx-auto'>
                  <h3 className='text-2xl font-bold text-white mb-4'>
                    Perfect Choice! 🎉
                  </h3>
                  <p className='text-white/90 mb-6'>
                    You've selected{' '}
                    <span className='font-bold text-yellow-400'>
                      {
                        KARAOKE_EXPERIENCES.find(
                          (exp) => exp.id === selectedExperience
                        )?.name
                      }
                    </span>
                    . Ready to book your unforgettable karaoke experience?
                  </p>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className='bg-gradient-to-r from-amber-600 to-amber-700 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-transform'
                  >
                    Book This Experience
                  </button>
                </div>
              </motion.div>
            )}
          </motion.section>

          {/* Success Stories / Testimonials */}
          <motion.section
            className='py-32 px-6 bg-gradient-to-b from-pink-900 via-purple-900 to-indigo-900'
            initial='hidden'
            animate='visible'
            variants={animationVariants.stagger}
          >
            <motion.div
              className='text-center mb-20'
              variants={animationVariants.slideUp}
            >
              <h2 className='text-5xl md:text-6xl font-bold text-white mb-8'>
                Epic Karaoke Moments
              </h2>
              <p className='text-2xl text-white/80 max-w-3xl mx-auto'>
                Real stories from real parties that became legendary
              </p>
            </motion.div>

            <div className='max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {TESTIMONIALS.map((testimonial) => (
                <motion.div
                  key={testimonial.id}
                  className='bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300'
                  variants={animationVariants.bounceIn}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  <div className='text-6xl mb-6 text-center'>
                    {testimonial.emoji}
                  </div>

                  <div className='flex justify-center mb-6'>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className='w-6 h-6 text-yellow-400 fill-current'
                      />
                    ))}
                  </div>

                  <blockquote className='text-white/90 text-lg italic leading-relaxed mb-6'>
                    "{testimonial.quote}"
                  </blockquote>

                  <div className='text-center'>
                    <cite className='text-white font-bold text-lg block'>
                      {testimonial.author}
                    </cite>
                    <span className='text-purple-300 text-sm block'>
                      {testimonial.occasion}
                    </span>
                    {testimonial.location && testimonial.date && (
                      <div className='text-white/60 text-xs mt-2'>
                        {testimonial.location} • {testimonial.date}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Trust indicators */}
            <motion.div
              className='text-center mt-16'
              variants={animationVariants.slideUp}
            >
              <div className='inline-block bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20'>
                <h3 className='text-3xl font-bold text-white mb-4'>
                  🏆 Trusted by 500+ Happy Customers
                </h3>
                <div className='flex justify-center items-center gap-8 text-white/80'>
                  <div className='text-center'>
                    <div className='text-2xl font-bold text-yellow-400'>
                      {averageRating.toFixed(1)}/5
                    </div>
                    <div className='text-sm'>Average Rating</div>
                  </div>
                  <div className='text-center'>
                    <div className='text-2xl font-bold text-green-400'>98%</div>
                    <div className='text-sm'>Satisfaction Rate</div>
                  </div>
                  <div className='text-center'>
                    <div className='text-2xl font-bold text-blue-400'>24/7</div>
                    <div className='text-sm'>Customer Support</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.section>

          {/* Song Categories Preview */}
          <motion.section
            className='py-32 px-6 bg-gradient-to-b from-indigo-900 via-purple-900 to-pink-900'
            initial='hidden'
            animate='visible'
            variants={animationVariants.stagger}
          >
            <motion.div
              className='text-center mb-20'
              variants={animationVariants.slideUp}
            >
              <h2 className='text-5xl md:text-6xl font-bold text-white mb-8'>
                Your Soundtrack Awaits
              </h2>
              <p className='text-2xl text-white/80 max-w-4xl mx-auto'>
                From chart-topping hits to guilty pleasure classics, we've got
                the perfect song for every moment
              </p>
            </motion.div>

            <div className='max-w-7xl mx-auto'>
              <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6'>
                {SONG_CATEGORIES.map((category, index) => (
                  <motion.div
                    key={index}
                    className={`bg-gradient-to-br ${category.color} rounded-2xl p-6 text-white text-center hover:scale-105 transition-all duration-300 cursor-pointer group`}
                    variants={animationVariants.bounceIn}
                    whileHover={{ y: -8 }}
                  >
                    <div className='text-4xl mb-4 group-hover:scale-110 transition-transform'>
                      {category.icon}
                    </div>
                    <h3 className='font-bold text-lg mb-2'>{category.genre}</h3>
                    <p className='text-sm opacity-90 leading-tight mb-2'>
                      {category.examples}
                    </p>
                    {category.songCount && (
                      <div className='text-xs opacity-75 font-medium'>
                        {category.songCount} songs
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              <motion.div
                className='text-center mt-16'
                variants={animationVariants.slideUp}
              >
                <div className='inline-block bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20'>
                  <h3 className='text-3xl font-bold text-white mb-4'>
                    🎶 {totalSongs.toLocaleString()}+ Songs & Growing
                  </h3>
                  <p className='text-white/80 text-lg'>
                    English • Spanish • Chart Hits • Timeless Classics • Kids
                    Favorites • Party Anthems
                  </p>
                  <div className='mt-4 text-sm text-white/60'>
                    Updated weekly with the latest hits
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.section>

          {/* Interactive Features Showcase */}
          <motion.section
            className='py-32 px-6 bg-gradient-to-b from-pink-900 via-indigo-900 to-black'
            initial='hidden'
            animate='visible'
            variants={animationVariants.stagger}
          >
            <motion.div
              className='text-center mb-20'
              variants={animationVariants.slideUp}
            >
              <h2 className='text-5xl md:text-6xl font-bold text-white mb-8'>
                Beyond Just Singing
              </h2>
              <p className='text-2xl text-white/80 max-w-4xl mx-auto'>
                Interactive features that make your karaoke party unforgettable
              </p>
            </motion.div>

            <div className='max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12'>
              <motion.div
                className='bg-gradient-to-br from-slate-700 to-slate-600 rounded-3xl p-10 text-white'
                variants={animationVariants.slideLeft}
                whileHover={{ scale: 1.02 }}
              >
                <div className='flex items-center mb-8'>
                  <div className='w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mr-6'>
                    <Volume2 className='w-8 h-8' />
                  </div>
                  <h3 className='text-3xl font-bold'>Pro Audio Experience</h3>
                </div>

                <div className='space-y-4'>
                  <div className='flex items-center'>
                    <CheckCircle className='w-6 h-6 mr-3 text-green-300 flex-shrink-0' />
                    <span className='text-lg'>
                      Echo & reverb effects for that concert feel
                    </span>
                  </div>
                  <div className='flex items-center'>
                    <CheckCircle className='w-6 h-6 mr-3 text-green-300 flex-shrink-0' />
                    <span className='text-lg'>
                      Auto-tune option for confidence boost
                    </span>
                  </div>
                  <div className='flex items-center'>
                    <CheckCircle className='w-6 h-6 mr-3 text-green-300 flex-shrink-0' />
                    <span className='text-lg'>
                      Multiple mic channels for group performances
                    </span>
                  </div>
                  <div className='flex items-center'>
                    <CheckCircle className='w-6 h-6 mr-3 text-green-300 flex-shrink-0' />
                    <span className='text-lg'>
                      Professional sound mixing with bass boost
                    </span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className='bg-gradient-to-br from-slate-800 to-slate-700 rounded-3xl p-10 text-white'
                variants={animationVariants.slideRight}
                whileHover={{ scale: 1.02 }}
              >
                <div className='flex items-center mb-8'>
                  <div className='w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mr-6'>
                    <Monitor className='w-8 h-8' />
                  </div>
                  <h3 className='text-3xl font-bold'>Smart Features</h3>
                </div>

                <div className='space-y-4'>
                  <div className='flex items-center'>
                    <CheckCircle className='w-6 h-6 mr-3 text-green-300 flex-shrink-0' />
                    <span className='text-lg'>
                      65" 4K display with scrolling lyrics
                    </span>
                  </div>
                  <div className='flex items-center'>
                    <CheckCircle className='w-6 h-6 mr-3 text-green-300 flex-shrink-0' />
                    <span className='text-lg'>
                      AI-powered song recommendations
                    </span>
                  </div>
                  <div className='flex items-center'>
                    <CheckCircle className='w-6 h-6 mr-3 text-green-300 flex-shrink-0' />
                    <span className='text-lg'>
                      Voice recording & instant playback
                    </span>
                  </div>
                  <div className='flex items-center'>
                    <CheckCircle className='w-6 h-6 mr-3 text-green-300 flex-shrink-0' />
                    <span className='text-lg'>
                      Real-time scoring with leaderboards
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div
              className='text-center mt-16'
              variants={animationVariants.slideUp}
            >
              <div className='inline-block bg-gradient-to-r from-amber-600 to-amber-700 text-white px-12 py-6 rounded-2xl font-bold text-2xl'>
                🎤 Ready in 15 Minutes • 🎵 Singing in 16!
              </div>
            </motion.div>
          </motion.section>

          {/* Party Planning Tips */}
          <motion.section
            className='py-32 px-6 bg-gradient-to-b from-black via-purple-900 to-pink-900'
            initial='hidden'
            animate='visible'
            variants={animationVariants.stagger}
          >
            <motion.div
              className='text-center mb-20'
              variants={animationVariants.slideUp}
            >
              <h2 className='text-5xl md:text-6xl font-bold text-white mb-8'>
                Level Up Your Party
              </h2>
              <p className='text-2xl text-white/80 max-w-4xl mx-auto'>
                Pro tips from our karaoke experts to make your night legendary
              </p>
            </motion.div>

            <div className='max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
              {PARTY_TIPS.map((tip, index) => (
                <motion.div
                  key={index}
                  className={`bg-gradient-to-br ${tip.color} rounded-3xl p-8 text-white hover:scale-105 transition-all duration-300`}
                  variants={animationVariants.bounceIn}
                  whileHover={{ y: -8 }}
                >
                  <div className='w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6'>
                    <tip.icon className='w-8 h-8' />
                  </div>
                  <h3 className='text-xl font-bold mb-4 text-center'>
                    {tip.title}
                  </h3>
                  <p className='text-lg font-medium mb-4 text-center'>
                    {tip.tip}
                  </p>
                  <p className='text-sm leading-relaxed text-center opacity-90'>
                    {tip.detail}
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.div
              className='text-center mt-16'
              variants={animationVariants.slideUp}
            >
              <div className='bg-white/10 backdrop-blur-md rounded-3xl p-12 border border-white/20 max-w-4xl mx-auto'>
                <h3 className='text-3xl font-bold text-white mb-6'>
                  🎪 Create Your Perfect Karaoke Night
                </h3>
                <p className='text-white/90 text-xl leading-relaxed mb-8'>
                  Whether it's an intimate family gathering or an epic
                  celebration with friends, our karaoke experience adapts to
                  your group's energy and style. From shy singers to karaoke
                  superstars, everyone leaves with a smile and unforgettable
                  memories.
                </p>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                  <div className='text-center'>
                    <div className='text-4xl mb-3'>🎵</div>
                    <div className='text-white font-bold'>15 Min Setup</div>
                    <div className='text-white/70 text-sm'>
                      Quick & professional
                    </div>
                  </div>
                  <div className='text-center'>
                    <div className='text-4xl mb-3'>🎤</div>
                    <div className='text-white font-bold'>Unlimited Fun</div>
                    <div className='text-white/70 text-sm'>
                      Sing all night long
                    </div>
                  </div>
                  <div className='text-center'>
                    <div className='text-4xl mb-3'>💫</div>
                    <div className='text-white font-bold'>Zero Cleanup</div>
                    <div className='text-white/70 text-sm'>
                      We handle everything
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.section>

          {/* Final Call-to-Action */}
          <motion.section
            className='py-32 px-6 bg-gradient-to-t from-purple-900 via-pink-900 to-indigo-900 relative overflow-hidden'
            initial='hidden'
            animate='visible'
            variants={animationVariants.slideUp}
          >
            {/* Background pattern */}
            <div className='absolute inset-0 opacity-10'>
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className='absolute text-white text-6xl'
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    rotate: [0, 360],
                    scale: [0.8, 1.2, 0.8],
                  }}
                  transition={{
                    duration: Math.random() * 8 + 4,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                >
                  🎤
                </motion.div>
              ))}
            </div>

            <div className='relative z-10 max-w-5xl mx-auto text-center'>
              <motion.div
                className='text-8xl mb-8'
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                🎉🎤✨
              </motion.div>

              <h2 className='text-6xl md:text-7xl font-bold text-white mb-8'>
                Tonight Could Be
                <br />
                <span className='bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent'>
                  LEGENDARY
                </span>
              </h2>

              <p className='text-2xl md:text-3xl text-white/90 mb-16 leading-relaxed'>
                Don't let another night pass without creating those epic moments
                your friends will talk about for years. Your stage is waiting.
              </p>

              {/* Features grid final */}
              <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-16'>
                <motion.div
                  className='bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20'
                  whileHover={{ scale: 1.05, y: -8 }}
                >
                  <Trophy className='w-12 h-12 text-yellow-400 mx-auto mb-4' />
                  <h3 className='text-2xl font-bold text-white mb-2'>
                    {totalSongs.toLocaleString()}+ Songs
                  </h3>
                  <p className='text-white/80'>
                    Every genre, every decade, every mood
                  </p>
                </motion.div>

                <motion.div
                  className='bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20'
                  whileHover={{ scale: 1.05, y: -8 }}
                >
                  <Sparkles className='w-12 h-12 text-pink-400 mx-auto mb-4' />
                  <h3 className='text-2xl font-bold text-white mb-2'>
                    Pro Experience
                  </h3>
                  <p className='text-white/80'>
                    Concert-quality sound & lighting
                  </p>
                </motion.div>

                <motion.div
                  className='bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20'
                  whileHover={{ scale: 1.05, y: -8 }}
                >
                  <Heart className='w-12 h-12 text-red-400 mx-auto mb-4' />
                  <h3 className='text-2xl font-bold text-white mb-2'>
                    Pure Joy
                  </h3>
                  <p className='text-white/80'>Memories that last a lifetime</p>
                </motion.div>
              </div>

              {/* Ultimate CTA */}
              <div className='flex flex-col lg:flex-row gap-8 justify-center items-center'>
                <div className='text-center'>
                  <div className='text-5xl font-bold text-white mb-2'>
                    ${service.price || 'Contact for pricing'}
                  </div>
                  <div className='text-white/70 text-lg'>
                    Complete karaoke party setup
                  </div>
                  <div className='text-yellow-400 font-bold mt-2'>
                    🎵 Unlimited songs • 🎤 Pro equipment • ✨ Unforgettable fun
                  </div>
                </div>

                <motion.button
                  onClick={() => setIsModalOpen(true)}
                  disabled={isLoading}
                  className='bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-700 hover:via-amber-800 hover:to-amber-900 text-white px-16 py-8 rounded-3xl font-bold text-2xl flex items-center gap-4 transition-all duration-300 shadow-2xl group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed'
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Shimmer effect */}
                  <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000' />

                  {isLoading ? (
                    <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-white'></div>
                  ) : (
                    <>
                      <PartyPopper className='w-8 h-8 group-hover:rotate-12 transition-transform' />
                      <span>BOOK MY KARAOKE PARTY</span>
                      <ArrowRight className='w-8 h-8 group-hover:translate-x-2 transition-transform' />
                    </>
                  )}
                </motion.button>
              </div>

              {/* Quick guarantee */}
              <motion.div
                className='mt-12 flex flex-wrap justify-center gap-8 text-white/80'
                variants={animationVariants.slideUp}
              >
                <div className='flex items-center gap-2'>
                  <CheckCircle className='w-5 h-5 text-green-400' />
                  <span>Setup in 15 minutes</span>
                </div>
                <div className='flex items-center gap-2'>
                  <CheckCircle className='w-5 h-5 text-green-400' />
                  <span>Flexible cancellation</span>
                </div>
                <div className='flex items-center gap-2'>
                  <CheckCircle className='w-5 h-5 text-green-400' />
                  <span>100% fun guaranteed</span>
                </div>
              </motion.div>
            </div>
          </motion.section>
        </div>

        {/* Contact Info Component */}
        {showContactInfo && <ContactInfo />}

        {/* Booking Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <BookingModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onConfirm={handleBooking}
              service={service}
              selectedExperience={selectedExperience}
              isLoading={isLoading}
            />
          )}
        </AnimatePresence>
      </div>
    </ErrorBoundary>
  );
};

export default KaraokeServiceView;
