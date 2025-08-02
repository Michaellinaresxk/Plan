import React, { useState, useEffect, useRef } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useViewportScroll,
} from 'framer-motion';
import {
  Anchor,
  Users,
  Ruler,
  Zap,
  Waves,
  Star,
  MapPin,
  Clock,
  Wifi,
  Music,
  Utensils,
  BedDouble,
  Droplets,
  X,
  ChevronLeft,
  ChevronRight,
  Calendar,
  MessageSquare,
  CreditCard,
  AlertCircle,
  Phone,
  Mail,
  Award,
  Shield,
  Heart,
  Play,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Crown,
  Diamond,
  Globe,
  Menu,
  Search,
  Filter,
  Eye,
  Share2,
  Bookmark,
  Navigation,
  Compass,
  Sun,
  Moon,
  Camera,
} from 'lucide-react';
import LuxeYachtForm from '../../forms/LuxeYachtForm';

// Types
interface YachtSpecification {
  length: string;
  maxGuests: number;
  cabins: number;
  bathrooms: number;
  crew: number;
  maxSpeed: string;
  fuelCapacity: string;
  manufacturer: string;
  year: number;
}

interface YachtAmenity {
  icon: React.ReactNode;
  name: string;
  description: string;
}

interface Yacht {
  id: string;
  name: string;
  category: 'sport' | 'luxury' | 'mega' | 'sailing';
  price: number;
  priceUnit: 'day' | 'hour';
  description: string;
  shortDescription: string;
  mainImage: string;
  gallery: string[];
  specifications: YachtSpecification;
  amenities: YachtAmenity[];
  highlights: string[];
  isPremium: boolean;
  isAvailable: boolean;
  rating: number;
  gradient: string;
}

interface YachtFormData {
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  guestCount: number;
  specialRequests: string;
}

interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  comment: string;
  image: string;
  yacht: string;
}

interface Experience {
  id: string;
  title: string;
  description: string;
  image: string;
  duration: string;
  highlights: string[];
}

// Data
const YACHT_DATA: Yacht[] = [
  {
    id: 'sport-yacht-42',
    name: 'Fairline 43',
    category: 'sport',
    price: 2500,
    priceUnit: 'day',
    description:
      'The Fairline 43 yacht is one of the most popular and valued sports yachts in the yachting industry. This elegant yacht is designed for both socializing and speed. On board this yacht you can take a private tour with a crew to Saona Island, Palmilla Beach or Catalina Island. On the way back you can enjoy the beautiful sunsets that the Dominican Republic has for you.',
    shortDescription: 'High-performance yacht with sleek design',
    mainImage:
      'https://res.cloudinary.com/michaelxk-com/image/upload/v1624139762/galeria/Drone_22_dedjhu.jpg',
    gallery: [
      'https://res.cloudinary.com/michaelxk-com/image/upload/v1625505556/nuestra%20flota/fairline/aiconfly_htqnwr.jpg',
      'https://res.cloudinary.com/michaelxk-com/image/upload/v1625505617/nuestra%20flota/fairline/drone_i8cbut.jpg',
      'https://res.cloudinary.com/michaelxk-com/image/upload/v1624144151/nuestra%20flota/fairline/1_vhop5t.jpg',
    ],
    specifications: {
      length: '43 ft',
      maxGuests: 11,
      cabins: 2,
      bathrooms: 2,
      crew: 2,
      maxSpeed: '30 knots',
      fuelCapacity: '2,200 L',
      manufacturer: 'Fairline',
      year: 2019,
    },
    amenities: [
      {
        icon: <Wifi className='w-5 h-5' />,
        name: 'WiFi',
        description: 'High-speed internet',
      },
      {
        icon: <Music className='w-5 h-5' />,
        name: 'Sound System',
        description: 'Premium audio',
      },
    ],
    highlights: [
      'Water sports equipment',
      'Professional crew',
      'Premium sound system',
    ],
    isPremium: false,
    isAvailable: true,
    rating: 4.8,
    gradient: 'from-cyan-600 via-blue-600 to-indigo-700',
  },
  {
    id: 'luxury-yacht-85',
    name: 'Aicon fly 60',
    category: 'luxury',
    price: 5500,
    priceUnit: 'day',
    description:
      'The motor yacht, Aicon Fly  is a fine example of Italian design. It has two meticulously arranged cabins and a double room for children or guests. It also has a crew cabin, 3 bathrooms/showers, a living and dining room and a kitchen. It has air conditioning throughout the boat and its two 800Hp CAT diesel engines give it great power that will take you far to the places you have been dreaming of.',
    shortDescription: 'Ultra-luxury yacht with premium amenities',
    mainImage:
      'https://res.cloudinary.com/michaelxk-com/image/upload/v1624143983/nuestra%20flota/aicon-fly-56/Aicon%20fly%2056.jpg',
    gallery: [
      'https://res.cloudinary.com/michaelxk-com/image/upload/v1624143983/nuestra%20flota/aicon-fly-56/Aicon%20fly%2056.jpg',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop',
    ],
    specifications: {
      length: '60 ft',
      maxGuests: 16,
      cabins: 3,
      bathrooms: 2,
      crew: 4,
      maxSpeed: '30 knots',
      fuelCapacity: '4,500 L',
      manufacturer: 'Aicon fly',
      year: 2008,
    },
    amenities: [
      {
        icon: <Wifi className='w-5 h-5' />,
        name: 'WiFi',
        description: 'Satellite internet',
      },
      {
        icon: <Utensils className='w-5 h-5' />,
        name: 'Chef Service',
        description: 'Professional chef',
      },
    ],
    highlights: ['Professional chef', 'Jacuzzi on deck', 'Water toys included'],
    isPremium: true,
    isAvailable: true,
    rating: 4.9,
    gradient: 'from-emerald-600 via-teal-600 to-cyan-700',
  },
  {
    id: 'mega-yacht-120',
    name: 'Sunseeker 120',
    category: 'mega',
    price: 12000,
    priceUnit: 'day',
    description:
      'The pinnacle of luxury yachting. This mega yacht offers an unmatched experience.',
    shortDescription: 'Superyacht with ultimate luxury and space',
    mainImage:
      'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=800&h=600&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1564001443772-b8b4b5b5b5b5?w=800&h=600&fit=crop',
    ],
    specifications: {
      length: '120 ft',
      maxGuests: 24,
      cabins: 6,
      bathrooms: 6,
      crew: 8,
      maxSpeed: '28 knots',
      fuelCapacity: '8,000 L',
      manufacturer: 'Sunseeker',
      year: 2024,
    },
    amenities: [
      {
        icon: <Wifi className='w-5 h-5' />,
        name: 'Starlink WiFi',
        description: 'Global connectivity',
      },
      {
        icon: <Utensils className='w-5 h-5' />,
        name: 'Michelin Chef',
        description: 'World-class dining',
      },
    ],
    highlights: ['Helipad', 'Spa & wellness center', 'Private beach club'],
    isPremium: true,
    isAvailable: true,
    rating: 5.0,
    gradient: 'from-amber-500 via-orange-600 to-red-600',
  },
];

const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah & Michael Chen',
    location: 'New York, USA',
    rating: 5,
    comment:
      'Absolutely magical experience! The crew was exceptional, and every detail was perfect.',
    image:
      'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=100&h=100&fit=crop&crop=face',
    yacht: 'Aicon Fly 60',
  },
  {
    id: '2',
    name: 'James Richardson',
    location: 'London, UK',
    rating: 5,
    comment:
      'The Sunseeker exceeded all expectations. Pure luxury from start to finish.',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    yacht: 'Sunseeker 120',
  },
];

const EXPERIENCES: Experience[] = [
  {
    id: '1',
    title: 'Sunset Romance',
    description:
      "Caribbean's most breathtaking sunsets with champagne service.",
    image:
      'https://images.pexels.com/photos/4664670/pexels-photo-4664670.jpeg?_gl=1*16vo5c5*_ga*MTQzOTE0OTkxMS4xNzUzMjcxMDk0*_ga_8JE65Q40S6*czE3NTQwNDYyMDMkbzExJGcxJHQxNzU0MDQ2MzM5JGoyNCRsMCRoMA..',
    duration: '4 hours',
    highlights: ['Private chef', 'Champagne service', 'Couples massage'],
  },
  {
    id: '2',
    title: 'Island Adventure',
    description: 'Discover hidden coves and pristine beaches.',
    image:
      'https://res.cloudinary.com/michaelxk-com/image/upload/v1624139770/galeria/galeria3_fm9utt.jpg',
    duration: 'Full day',
    highlights: ['Multiple destinations', 'Water sports', 'Beach picnic'],
  },
  {
    id: '3',
    title: 'Island Adventure',
    description: 'Discover hidden coves and pristine beaches.',
    image:
      'https://res.cloudinary.com/michaelxk-com/image/upload/v1624139770/galeria/galeria3_fm9utt.jpg',
    duration: 'Full day',
    highlights: ['Multiple destinations', 'Water sports', 'Beach picnic'],
  },
];

// Cinematic Hero Section
const CinematicHero: React.FC<{ onBookingClick: () => void }> = ({
  onBookingClick,
}) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, 200]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const scale = useTransform(scrollY, [0, 400], [1, 1.1]);

  return (
    <div className='relative h-screen overflow-hidden'>
      {/* Video Background */}
      <motion.div style={{ y, scale }} className='absolute inset-0'>
        <video
          autoPlay
          muted
          loop
          playsInline
          className='absolute inset-0 w-full h-full object-cover'
          poster='https://images.pexels.com/photos/32995074/pexels-photo-32995074.jpeg'
        >
          {/* <source
            src='https://videos.pexels.com/video-files/1093662/1093662-hd_1920_1080_30fps.mp4'
            type='video/mp4'
          /> */}
          <source src='/video/yates-promo.mp4' type='video/mp4' />
        </video>
        <div className='absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/70' />
      </motion.div>

      {/* Floating Elements */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className='absolute w-1 h-1 bg-white/40 rounded-full'
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.4, 0.8, 0.4],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Hero Content */}
      <motion.div
        style={{ opacity }}
        className='relative z-10 h-full flex items-center'
      >
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full'>
          <div className='grid lg:grid-cols-2 gap-12 items-center'>
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className='text-white'
            >
              {/* Premium Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className='inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-8'
              >
                <Diamond className='w-5 h-5 text-cyan-400' />
                <span className='text-sm font-semibold'>
                  ULTRA LUXURY COLLECTION
                </span>
                <Diamond className='w-5 h-5 text-cyan-400' />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className='text-5xl lg:text-7xl font-thin mb-6 leading-tight'
              >
                Beyond
                <span className='block font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent'>
                  Expectations
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
                className='text-xl lg:text-2xl text-gray-300 mb-8 leading-relaxed max-w-lg'
              >
                Discover the world's most exclusive yacht collection. Where
                every journey becomes an unforgettable masterpiece.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3, duration: 0.8 }}
                className='flex flex-col sm:flex-row gap-4 mb-12'
              >
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow: '0 20px 40px rgba(6, 182, 212, 0.3)',
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onBookingClick}
                  className='group bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center space-x-3 relative overflow-hidden'
                >
                  <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000' />
                  <Calendar className='w-6 h-6' />
                  <span>Explore Collection</span>
                </motion.button>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6, duration: 0.8 }}
                className='grid grid-cols-3 gap-6'
              >
                {[
                  { number: '50+', label: 'Luxury Yachts' },
                  { number: '1000+', label: 'Happy Guests' },
                  { number: '15+', label: 'Years Experience' },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.8 + index * 0.1 }}
                    className='text-center'
                  >
                    <div className='text-3xl font-bold text-cyan-400'>
                      {stat.number}
                    </div>
                    <div className='text-sm text-gray-400 uppercase tracking-wider'>
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Content - Modern Card */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
              className='hidden lg:block'
            >
              <div className='relative'>
                {/* Main Card */}
                <motion.div
                  whileHover={{ y: -10, rotateY: 5 }}
                  className='bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 transform perspective-1000'
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <div className='flex items-center space-x-4 mb-6'>
                    <div className='w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center'>
                      <Crown className='w-8 h-8 text-white' />
                    </div>
                    <div>
                      <h3 className='text-2xl font-bold text-white'>
                        Premium Concierge
                      </h3>
                      <p className='text-gray-300'>24/7 Luxury Service</p>
                    </div>
                  </div>

                  <p className='text-gray-300 mb-6'>
                    Experience personalized service that anticipates your every
                    need. From arrival to departure, every detail is crafted to
                    perfection.
                  </p>

                  <div className='grid grid-cols-2 gap-4'>
                    {[
                      {
                        icon: <Shield className='w-5 h-5' />,
                        text: 'Fully Insured',
                      },
                      {
                        icon: <Award className='w-5 h-5' />,
                        text: '5-Star Service',
                      },
                      {
                        icon: <Globe className='w-5 h-5' />,
                        text: 'Destination Experts',
                      },
                      {
                        icon: <Heart className='w-5 h-5' />,
                        text: 'Trusted by 1000+',
                      },
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.2 + index * 0.1 }}
                        className='flex items-center space-x-2 text-gray-300'
                      >
                        {item.icon}
                        <span className='text-sm font-medium'>{item.text}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Floating Elements */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  className='absolute -top-4 -right-4 w-8 h-8 border-2 border-cyan-400/50 rounded-full'
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className='absolute -bottom-4 -left-4 w-6 h-6 bg-purple-500/50 rounded-full'
                />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className='absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/80'
      >
        <div className='flex flex-col items-center space-y-2'>
          <div className='w-6 h-10 border-2 border-white/60 rounded-full flex justify-center'>
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className='w-1 h-3 bg-white rounded-full mt-2'
            />
          </div>
          <span className='text-xs uppercase tracking-wider'>
            Scroll to explore
          </span>
        </div>
      </motion.div>
    </div>
  );
};

// Revolutionary Yacht Grid
const RevolutionaryYachtGrid: React.FC<{
  onYachtSelect: (yacht: Yacht) => void;
}> = ({ onYachtSelect }) => {
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredYachts =
    filter === 'all'
      ? YACHT_DATA
      : YACHT_DATA.filter((yacht) => yacht.category === filter);

  return (
    <section
      id='fleet'
      className='py-32 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden'
    >
      {/* Background Elements */}
      <div className='absolute inset-0'>
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{
            rotate: { duration: 60, repeat: Infinity, ease: 'linear' },
            scale: { duration: 8, repeat: Infinity },
          }}
          className='absolute top-20 right-20 w-64 h-64 border border-blue-200/30 rounded-full'
        />
        <motion.div
          animate={{ rotate: -360, opacity: [0.1, 0.3, 0.1] }}
          transition={{
            rotate: { duration: 80, repeat: Infinity, ease: 'linear' },
            opacity: { duration: 6, repeat: Infinity },
          }}
          className='absolute bottom-20 left-20 w-48 h-48 border-2 border-cyan-200/20 rounded-full'
        />
      </div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className='text-center mb-16'
        >
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className='inline-flex items-center space-x-2 bg-blue-50 border border-blue-200 rounded-full px-6 py-3 mb-8'
          >
            <Anchor className='w-5 h-5 text-blue-600' />
            <span className='text-blue-900 font-semibold'>EXCLUSIVE FLEET</span>
          </motion.div>

          <h2 className='text-5xl lg:text-6xl font-thin text-gray-900 mb-6'>
            Masterpiece{' '}
            <span className='font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent'>
              Collection
            </span>
          </h2>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
            Every yacht in our fleet represents the pinnacle of naval
            architecture and luxury design
          </p>
        </motion.div>

        {/* Modern Filter & Controls */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className='flex flex-col lg:flex-row justify-between items-center mb-12 gap-6'
        >
          {/* Filter Pills */}
          <div className='flex flex-wrap gap-3'>
            {[
              {
                id: 'all',
                name: 'All Yachts',
                icon: <Anchor className='w-4 h-4' />,
              },
              { id: 'sport', name: 'Sport', icon: <Zap className='w-4 h-4' /> },
              {
                id: 'luxury',
                name: 'Luxury',
                icon: <Crown className='w-4 h-4' />,
              },
              { id: 'mega', name: 'Mega', icon: <Waves className='w-4 h-4' /> },
            ].map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter(category.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                  filter === category.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {category.icon}
                <span>{category.name}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Yacht Grid */}
        <motion.div
          layout
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8'
              : 'space-y-6'
          }
        >
          <AnimatePresence>
            {filteredYachts.map((yacht, index) => (
              <motion.div
                key={yacht.id}
                layout
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                {viewMode === 'grid' ? (
                  <ModernYachtCard
                    yacht={yacht}
                    onSelect={() => onYachtSelect(yacht)}
                  />
                ) : (
                  <ModernYachtListItem
                    yacht={yacht}
                    onSelect={() => onYachtSelect(yacht)}
                  />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

// Modern Yacht Card Component
const ModernYachtCard: React.FC<{ yacht: Yacht; onSelect: () => void }> = ({
  yacht,
  onSelect,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className='group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 overflow-hidden cursor-pointer border border-gray-100'
      onClick={onSelect}
    >
      {/* Image Container */}
      <div className='relative h-72 overflow-hidden'>
        <motion.img
          src={yacht.mainImage}
          alt={yacht.name}
          className='w-full h-full object-cover'
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.7 }}
        />

        {/* Overlay Gradient */}
        <div className='absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent' />

        {/* Premium Badge */}
        {yacht.isPremium && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className='absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center space-x-2'
          >
            <Crown className='w-4 h-4' />
            <span>Premium</span>
          </motion.div>
        )}

        {/* Rating */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className='absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 flex items-center space-x-1'
        >
          <Star className='w-4 h-4 text-amber-500 fill-current' />
          <span className='text-sm font-bold text-gray-900'>
            {yacht.rating}
          </span>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
          transition={{ duration: 0.3 }}
          className='absolute bottom-4 left-4 bg-white/10 backdrop-blur-md rounded-2xl p-3 text-white border border-white/20'
        >
          <div className='grid grid-cols-3 gap-3 text-center'>
            <div className='flex flex-col items-center'>
              <Users className='w-4 h-4 mb-1' />
              <span className='text-xs font-medium'>
                {yacht.specifications.maxGuests}
              </span>
            </div>
            <div className='flex flex-col items-center'>
              <BedDouble className='w-4 h-4 mb-1' />
              <span className='text-xs font-medium'>
                {yacht.specifications.cabins}
              </span>
            </div>
            <div className='flex flex-col items-center'>
              <Zap className='w-4 h-4 mb-1' />
              <span className='text-xs font-medium'>
                {yacht.specifications.maxSpeed}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Content */}
      <div className='p-6'>
        <div className='flex justify-between items-start mb-4'>
          <div>
            <h3 className='text-2xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors'>
              {yacht.name}
            </h3>
            <p className='text-gray-500 text-sm font-medium uppercase tracking-wider'>
              {yacht.category} • {yacht.specifications.length}
            </p>
          </div>
          <div className='text-right'>
            <div className='text-2xl font-bold text-gray-900'>
              ${yacht.price.toLocaleString()}
            </div>
            <div className='text-sm text-gray-500'>per {yacht.priceUnit}</div>
          </div>
        </div>

        {/* Features */}
        <div className='grid grid-cols-2 gap-3 mb-6'>
          {[
            {
              icon: <Users className='w-4 h-4' />,
              text: `${yacht.specifications.maxGuests} guests`,
            },
            {
              icon: <BedDouble className='w-4 h-4' />,
              text: `${yacht.specifications.cabins} cabins`,
            },
          ].map((feature, index) => (
            <div
              key={index}
              className='flex items-center space-x-2 text-sm text-gray-600'
            >
              <div className='w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-blue-600'>
                {feature.icon}
              </div>
              <span className='font-medium'>{feature.text}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-3 bg-gradient-to-r ${yacht.gradient} text-white hover:shadow-lg relative overflow-hidden group`}
        >
          <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000' />
          <Eye className='w-5 h-5' />
          <span>View Details</span>
          <ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform' />
        </motion.button>
      </div>
    </motion.div>
  );
};

// Modern List View Component
const ModernYachtListItem: React.FC<{ yacht: Yacht; onSelect: () => void }> = ({
  yacht,
  onSelect,
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.01, x: 5 }}
      className='bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden cursor-pointer border border-gray-100'
      onClick={onSelect}
    >
      <div className='flex'>
        {/* Image */}
        <div className='w-80 h-48 relative overflow-hidden'>
          <motion.img
            src={yacht.mainImage}
            alt={yacht.name}
            className='w-full h-full object-cover'
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5 }}
          />
          {yacht.isPremium && (
            <div className='absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1'>
              <Crown className='w-3 h-3' />
              <span>Premium</span>
            </div>
          )}
          <div className='absolute top-4 right-4 bg-white/90 rounded-lg px-2 py-1 flex items-center space-x-1'>
            <Star className='w-3 h-3 text-amber-500 fill-current' />
            <span className='text-xs font-bold'>{yacht.rating}</span>
          </div>
        </div>

        {/* Content */}
        <div className='flex-1 p-8 flex justify-between'>
          <div>
            <div className='flex items-center space-x-3 mb-2'>
              <h3 className='text-3xl font-bold text-gray-900'>{yacht.name}</h3>
              <span className='bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium uppercase'>
                {yacht.category}
              </span>
            </div>

            <p className='text-gray-600 mb-4 text-lg max-w-2xl'>
              {yacht.description.slice(0, 150)}...
            </p>

            {/* Specs Grid */}
            <div className='grid grid-cols-4 gap-6'>
              {[
                {
                  icon: <Ruler className='w-5 h-5' />,
                  label: 'Length',
                  value: yacht.specifications.length,
                },
                {
                  icon: <Users className='w-5 h-5' />,
                  label: 'Guests',
                  value: yacht.specifications.maxGuests,
                },
                {
                  icon: <BedDouble className='w-5 h-5' />,
                  label: 'Cabins',
                  value: yacht.specifications.cabins,
                },
                {
                  icon: <Zap className='w-5 h-5' />,
                  label: 'Speed',
                  value: yacht.specifications.maxSpeed,
                },
              ].map((spec, index) => (
                <div key={index} className='flex items-center space-x-3'>
                  <div className='w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600'>
                    {spec.icon}
                  </div>
                  <div>
                    <div className='font-bold text-gray-900'>{spec.value}</div>
                    <div className='text-sm text-gray-500'>{spec.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Price & CTA */}
          <div className='text-right flex flex-col justify-between'>
            <div>
              <div className='text-4xl font-bold text-gray-900 mb-1'>
                ${yacht.price.toLocaleString()}
              </div>
              <div className='text-gray-500 mb-6'>per {yacht.priceUnit}</div>
            </div>

            <div className='space-y-3'>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-8 py-3 rounded-2xl font-bold text-white bg-gradient-to-r ${yacht.gradient} hover:shadow-lg transition-all duration-300`}
              >
                View Details
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className='px-8 py-3 rounded-2xl font-bold text-blue-600 border-2 border-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300'
              >
                Quick Book
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Immersive Experience Section
const ImmersiveExperiences: React.FC = () => {
  const [activeExperience, setActiveExperience] = useState(0);

  return (
    <section
      id='experiences'
      className='py-32 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden'
    >
      {/* Background Video */}
      <div className='absolute inset-0'>
        <video
          autoPlay
          muted
          loop
          playsInline
          className='w-full h-full object-cover opacity-20'
        >
          <source
            src='https://videos.pexels.com/video-files/1093662/1093662-hd_1920_1080_30fps.mp4'
            type='video/mp4'
          />
        </video>
      </div>

      <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className='text-center mb-20'
        >
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className='inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-8'
          >
            <Compass className='w-5 h-5 text-cyan-400' />
            <span className='font-semibold'>CURATED EXPERIENCES</span>
            <Compass className='w-5 h-5 text-cyan-400' />
          </motion.div>

          <h2 className='text-5xl lg:text-6xl font-thin mb-6'>
            Crafted{' '}
            <span className='font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent'>
              Adventures
            </span>
          </h2>
          <p className='text-xl text-blue-100 max-w-3xl mx-auto'>
            Every journey is a masterpiece designed to create memories that
            transcend the ordinary
          </p>
        </motion.div>

        {/* Experience Tabs */}
        <div className='grid lg:grid-cols-3 gap-8'>
          {EXPERIENCES.map((experience, index) => (
            <motion.div
              key={experience.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className={`relative cursor-pointer transition-all duration-500 ${
                activeExperience === index ? 'scale-105' : ''
              }`}
              onClick={() => setActiveExperience(index)}
            >
              <div className='bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl overflow-hidden group'>
                {/* Image */}
                <div className='relative h-64 overflow-hidden'>
                  <motion.img
                    src={experience.image}
                    alt={experience.title}
                    className='w-full h-full object-cover'
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.7 }}
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent' />

                  {/* Duration Badge */}
                  <div className='absolute top-4 left-4 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30'>
                    <Clock className='w-4 h-4 inline mr-2' />
                    <span className='font-semibold'>{experience.duration}</span>
                  </div>

                  {/* Sparkle Effect */}
                  <motion.div
                    animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className='absolute top-4 right-4'
                  >
                    <Sparkles className='w-6 h-6 text-cyan-400' />
                  </motion.div>
                </div>

                {/* Content */}
                <div className='p-8'>
                  <h3 className='text-2xl font-bold mb-4 group-hover:text-cyan-400 transition-colors'>
                    {experience.title}
                  </h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Premium Testimonials
const PremiumTestimonials: React.FC = () => {
  return (
    <section className='py-32 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className='text-center mb-20'
        >
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className='inline-flex items-center space-x-2 bg-amber-50 border border-amber-200 rounded-full px-6 py-3 mb-8'
          >
            <Heart className='w-5 h-5 text-amber-600' />
            <span className='text-amber-900 font-semibold'>CLIENT STORIES</span>
          </motion.div>

          <h2 className='text-5xl lg:text-6xl font-thin text-gray-900 mb-6'>
            Exceptional{' '}
            <span className='font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent'>
              Moments
            </span>
          </h2>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
            Discover why discerning guests choose us for their most treasured
            celebrations
          </p>
        </motion.div>

        <div className='grid lg:grid-cols-2 gap-8'>
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className='bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100'
            >
              <div className='p-8'>
                <div className='flex items-center mb-6'>
                  <motion.img
                    whileHover={{ scale: 1.1 }}
                    src={testimonial.image}
                    alt={testimonial.name}
                    className='w-16 h-16 rounded-full object-cover mr-4 border-4 border-gray-100'
                  />
                  <div>
                    <h4 className='text-xl font-bold text-gray-900'>
                      {testimonial.name}
                    </h4>
                    <p className='text-gray-500'>{testimonial.location}</p>
                    <div className='flex items-center mt-2'>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.2 + i * 0.1 }}
                        >
                          <Star className='w-4 h-4 text-amber-500 fill-current' />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                <blockquote className='text-gray-700 text-lg leading-relaxed mb-6 italic'>
                  "{testimonial.comment}"
                </blockquote>

                <div className='bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-4 border border-blue-100'>
                  <div className='flex items-center space-x-2'>
                    <Anchor className='w-5 h-5 text-blue-600' />
                    <span className='text-blue-900 font-semibold'>
                      Experience: {testimonial.yacht}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Ultra-Premium Contact Section
const UltraPremiumContact: React.FC<{ onBookingClick: () => void }> = ({
  onBookingClick,
}) => {
  return (
    <section className='py-32 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden'>
      {/* Background Effects */}
      <div className='absolute inset-0'>
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{
            rotate: { duration: 100, repeat: Infinity, ease: 'linear' },
            scale: { duration: 8, repeat: Infinity },
          }}
          className='absolute top-20 right-20 w-96 h-96 border border-cyan-400/20 rounded-full'
        />
        <motion.div
          animate={{ rotate: -360, opacity: [0.1, 0.3, 0.1] }}
          transition={{
            rotate: { duration: 120, repeat: Infinity, ease: 'linear' },
            opacity: { duration: 6, repeat: Infinity },
          }}
          className='absolute bottom-20 left-20 w-80 h-80 border-2 border-blue-400/20 rounded-full'
        />
      </div>

      <div className='relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='grid lg:grid-cols-2 gap-16 items-center'>
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className='inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-8'
            >
              <Navigation className='w-5 h-5 text-cyan-400' />
              <span className='font-semibold'>BEGIN YOUR JOURNEY</span>
            </motion.div>

            <h2 className='text-5xl lg:text-6xl font-thin mb-6'>
              Ready to{' '}
              <span className='font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent'>
                Set Sail?
              </span>
            </h2>

            <p className='text-xl text-blue-100 mb-8 leading-relaxed'>
              Our luxury yacht concierge team is standing by to create your
              perfect maritime experience. Every detail, meticulously crafted to
              exceed your expectations.
            </p>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12'>
              {[
                {
                  icon: <Shield className='w-6 h-6' />,
                  title: 'Fully Insured',
                  desc: 'Complete protection',
                },
                {
                  icon: <Award className='w-6 h-6' />,
                  title: '5-Star Service',
                  desc: 'Unmatched quality',
                },
                {
                  icon: <Clock className='w-6 h-6' />,
                  title: '24/7 Support',
                  desc: 'Always available',
                },
                {
                  icon: <Globe className='w-6 h-6' />,
                  title: 'Destination Experts',
                  desc: 'Unforgettable journeys',
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className='flex items-center space-x-3'
                >
                  <div className='w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl flex items-center justify-center text-cyan-400'>
                    {feature.icon}
                  </div>
                  <div>
                    <div className='font-bold'>{feature.title}</div>
                    <div className='text-blue-200 text-sm'>{feature.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className='flex flex-col sm:flex-row gap-4'>
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 20px 40px rgba(6, 182, 212, 0.3)',
                }}
                whileTap={{ scale: 0.95 }}
                onClick={onBookingClick}
                className='group bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center space-x-3 relative overflow-hidden'
              >
                <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000' />
                <Calendar className='w-6 h-6' />
                <span>Book Experience</span>
              </motion.button>

              <motion.a
                href='tel:+1234567890'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className='border-2 border-white/60 text-white px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center space-x-3 backdrop-blur-sm hover:bg-white/10 transition-all duration-300'
              >
                <Phone className='w-6 h-6' />
                <span>Call Concierge</span>
              </motion.a>
            </div>
          </motion.div>

          {/* Right Content - Contact Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className='relative'
          >
            <div className='bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8'>
              <div className='text-center mb-8'>
                <div className='w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-4'>
                  <Crown className='w-10 h-10 text-white' />
                </div>
                <h3 className='text-2xl font-bold mb-2'>Premium Concierge</h3>
                <p className='text-blue-200'>
                  Dedicated to your perfect experience
                </p>
              </div>

              <div className='space-y-6'>
                {[
                  {
                    icon: <Phone className='w-5 h-5' />,
                    label: 'Phone',
                    value: '+1 (555) 000000',
                  },
                  {
                    icon: <Mail className='w-5 h-5' />,
                    label: 'Email',
                    value: 'info@luxpuntacana.com',
                  },
                  {
                    icon: <Clock className='w-5 h-5' />,
                    label: 'Hours',
                    value: '24/7 Premium Support',
                  },
                  {
                    icon: <MapPin className='w-5 h-5' />,
                    label: 'Locations',
                    value: 'Premium Destinations',
                  },
                ].map((contact, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className='flex items-center space-x-4 p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300'
                  >
                    <div className='w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-cyan-400'>
                      {contact.icon}
                    </div>
                    <div>
                      <div className='text-sm text-blue-200'>
                        {contact.label}
                      </div>
                      <div className='font-semibold'>{contact.value}</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1 }}
                className='mt-8 p-4 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-400/30 rounded-2xl text-center'
              >
                <p className='text-sm text-cyan-200 mb-2'>Response time</p>
                <p className='font-bold text-cyan-400'>Under 15 minutes</p>
              </motion.div>
            </div>

            {/* Floating decorative elements */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className='absolute -top-4 -right-4 w-8 h-8 border-2 border-cyan-400/50 rounded-full'
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className='absolute -bottom-4 -left-4 w-6 h-6 bg-purple-500/50 rounded-full'
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Ultra-Premium Yacht Modal
const YachtModal: React.FC<{
  yacht: Yacht;
  onClose: () => void;
  onBook: () => void;
}> = ({ yacht, onClose, onBook }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showBookingForm, setShowBookingForm] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % yacht.gallery.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + yacht.gallery.length) % yacht.gallery.length
    );
  };

  if (showBookingForm) {
    return (
      <LuxeYachtForm
        yacht={yacht}
        onClose={onClose}
        onBack={() => setShowBookingForm(false)}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50'
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 50 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className='bg-white rounded-3xl max-w-7xl w-full max-h-[95vh] overflow-y-auto shadow-2xl'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Enhanced Header */}
        <div
          className={`relative p-8 bg-gradient-to-r ${yacht.gradient} text-white overflow-hidden`}
        >
          {/* Background Pattern */}
          <div className='absolute inset-0 opacity-10'>
            <div className='absolute inset-0 bg-gradient-to-br from-white/20 to-transparent' />
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className='absolute w-1 h-1 bg-white/30 rounded-full'
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.3, 0.7, 0.3],
                }}
                transition={{
                  duration: 2 + Math.random(),
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          {/* Close Button */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className='absolute top-6 right-6 w-12 h-12 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 z-10'
          >
            <X className='w-6 h-6' />
          </motion.button>

          <div className='relative z-10'>
            <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6'>
              <div className='flex-1'>
                {/* Premium Badge */}
                {yacht.isPremium && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className='inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 mb-4'
                  >
                    <Crown className='w-4 h-4 text-amber-300' />
                    <span className='text-sm font-bold'>
                      PREMIUM COLLECTION
                    </span>
                  </motion.div>
                )}

                <motion.h2
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className='text-4xl lg:text-5xl font-bold mb-3'
                >
                  {yacht.name}
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className='text-xl text-white/90 mb-4'
                >
                  {yacht.shortDescription}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className='flex items-center space-x-6'
                >
                  <div className='flex items-center space-x-2'>
                    <Star className='w-5 h-5 text-amber-300 fill-current' />
                    <span className='font-bold'>{yacht.rating}</span>
                    <span className='text-white/80'>Rating</span>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <Users className='w-5 h-5' />
                    <span className='font-bold'>
                      {yacht.specifications.maxGuests}
                    </span>
                    <span className='text-white/80'>Guests</span>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <Ruler className='w-5 h-5' />
                    <span className='font-bold'>
                      {yacht.specifications.length}
                    </span>
                  </div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className='text-center lg:text-right'
              >
                <div className='text-5xl lg:text-6xl font-bold mb-2'>
                  ${yacht.price.toLocaleString()}
                </div>
                <div className='text-white/80 text-lg'>
                  per {yacht.priceUnit}
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowBookingForm(true)}
                  className='mt-4 bg-white text-gray-900 px-8 py-3 rounded-2xl font-bold hover:bg-white/90 transition-all duration-300 flex items-center space-x-2 mx-auto lg:mx-0'
                >
                  <Calendar className='w-5 h-5' />
                  <span>Book Now</span>
                </motion.button>
              </motion.div>
            </div>
          </div>
        </div>

        <div className='p-8'>
          {/* Enhanced Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className='mb-12'
          >
            <h3 className='text-3xl font-bold text-gray-900 mb-6 flex items-center'>
              <Camera className='w-8 h-8 mr-3 text-blue-600' />
              Gallery
            </h3>
            <div className='relative rounded-3xl overflow-hidden shadow-2xl'>
              <motion.img
                key={currentImageIndex}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                src={yacht.gallery[currentImageIndex]}
                alt={`${yacht.name} - Image ${currentImageIndex + 1}`}
                className='w-full h-96 lg:h-[500px] object-cover'
              />

              {/* Navigation */}
              <motion.button
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(0,0,0,0.7)' }}
                whileTap={{ scale: 0.9 }}
                onClick={prevImage}
                className='absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 backdrop-blur-sm border border-white/20 rounded-full text-white transition-all duration-300 flex items-center justify-center'
              >
                <ChevronLeft className='w-6 h-6' />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(0,0,0,0.7)' }}
                whileTap={{ scale: 0.9 }}
                onClick={nextImage}
                className='absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 backdrop-blur-sm border border-white/20 rounded-full text-white transition-all duration-300 flex items-center justify-center'
              >
                <ChevronRight className='w-6 h-6' />
              </motion.button>

              {/* Indicators */}
              <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2'>
                {yacht.gallery.map((_, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.2 }}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentImageIndex
                        ? 'bg-white shadow-lg'
                        : 'bg-white/50 hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          <div className='grid lg:grid-cols-2 gap-12'>
            {/* Specifications */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className='text-3xl font-bold text-gray-900 mb-6 flex items-center'>
                <Ruler className='w-8 h-8 mr-3 text-blue-600' />
                Specifications
              </h3>

              <div className='grid grid-cols-2 gap-4 mb-8'>
                {[
                  {
                    icon: <Ruler className='w-6 h-6' />,
                    label: 'Length',
                    value: yacht.specifications.length,
                  },
                  {
                    icon: <Users className='w-6 h-6' />,
                    label: 'Max Guests',
                    value: yacht.specifications.maxGuests,
                  },
                  {
                    icon: <BedDouble className='w-6 h-6' />,
                    label: 'Cabins',
                    value: yacht.specifications.cabins,
                  },
                  {
                    icon: <Zap className='w-6 h-6' />,
                    label: 'Max Speed',
                    value: yacht.specifications.maxSpeed,
                  },
                ].map((spec, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className='bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl border border-blue-100 hover:shadow-lg transition-all duration-300'
                  >
                    <div className='flex items-center mb-3'>
                      <div className='w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white mr-3'>
                        {spec.icon}
                      </div>
                      <span className='font-semibold text-gray-700'>
                        {spec.label}
                      </span>
                    </div>
                    <div className='text-2xl font-bold text-gray-900'>
                      {spec.value}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className='bg-gray-50 p-6 rounded-2xl'>
                <h4 className='font-bold text-gray-900 mb-4'>
                  Additional Details
                </h4>
                <div className='grid grid-cols-2 gap-4 text-sm'>
                  <div>
                    <span className='text-gray-600'>Manufacturer:</span>{' '}
                    <span className='font-semibold'>
                      {yacht.specifications.manufacturer}
                    </span>
                  </div>
                  <div>
                    <span className='text-gray-600'>Year:</span>{' '}
                    <span className='font-semibold'>
                      {yacht.specifications.year}
                    </span>
                  </div>
                  <div>
                    <span className='text-gray-600'>Bathrooms:</span>{' '}
                    <span className='font-semibold'>
                      {yacht.specifications.bathrooms}
                    </span>
                  </div>
                  <div>
                    <span className='text-gray-600'>Crew:</span>{' '}
                    <span className='font-semibold'>
                      {yacht.specifications.crew}
                    </span>
                  </div>
                  <div>
                    <span className='text-gray-600'>Fuel Capacity:</span>{' '}
                    <span className='font-semibold'>
                      {yacht.specifications.fuelCapacity}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Amenities & Highlights */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className='text-3xl font-bold text-gray-900 mb-6 flex items-center'>
                <Star className='w-8 h-8 mr-3 text-blue-600' />
                Amenities & Features
              </h3>

              <div className='space-y-6'>
                <div>
                  <h4 className='font-bold text-gray-900 mb-4'>
                    Premium Amenities
                  </h4>
                  <div className='space-y-3'>
                    {yacht.amenities.map((amenity, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        whileHover={{ scale: 1.02, x: 5 }}
                        className='flex items-center p-4 bg-white border border-gray-200 rounded-2xl hover:shadow-md hover:border-blue-300 transition-all duration-300'
                      >
                        <div className='w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white mr-4'>
                          {amenity.icon}
                        </div>
                        <div>
                          <div className='font-semibold text-gray-900'>
                            {amenity.name}
                          </div>
                          <div className='text-gray-600'>
                            {amenity.description}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className='font-bold text-gray-900 mb-4'>Highlights</h4>
                  <div className='space-y-3'>
                    {yacht.highlights.map((highlight, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        className='flex items-center text-gray-700'
                      >
                        <CheckCircle className='w-5 h-5 text-emerald-500 mr-3' />
                        <span className='font-medium'>{highlight}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className='bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-2xl border border-blue-200'>
                  <h4 className='font-bold text-blue-900 mb-3 flex items-center'>
                    <Shield className='w-5 h-5 mr-2' />
                    Professional Service Included
                  </h4>
                  <p className='text-blue-800 leading-relaxed'>
                    Experienced captain and crew, fuel, insurance, safety
                    equipment, and all necessary permits included in the price.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className='mt-12'
          >
            <h3 className='text-3xl font-bold text-gray-900 mb-6'>
              About This Yacht
            </h3>
            <div className='bg-gray-50 p-8 rounded-3xl'>
              <p className='text-gray-700 leading-relaxed text-lg'>
                {yacht.description}
              </p>
            </div>
          </motion.div>

          {/* Enhanced Booking CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className='mt-12 p-8 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-3xl border border-blue-200'
          >
            <div className='flex flex-col lg:flex-row items-center justify-between gap-6'>
              <div>
                <h4 className='text-2xl font-bold text-gray-900 mb-2'>
                  Ready to Experience Luxury?
                </h4>
                <p className='text-gray-600 text-lg'>
                  Reserve your exclusive yacht experience today
                </p>
              </div>
              <div className='flex flex-col sm:flex-row gap-4'>
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow: '0 10px 30px rgba(37, 99, 235, 0.3)',
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowBookingForm(true)}
                  className={`px-8 py-4 rounded-2xl text-white font-bold text-lg bg-gradient-to-r ${yacht.gradient} hover:shadow-xl transition-all duration-300 flex items-center space-x-3`}
                >
                  <Calendar className='w-6 h-6' />
                  <span>Book Experience</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Ultra-Premium Yacht Booking Form
const YachtBookingForm: React.FC<{
  yacht: Yacht;
  onClose: () => void;
  onBack: () => void;
}> = ({ yacht, onClose, onBack }) => {
  const [formData, setFormData] = useState<YachtFormData>({
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    guestCount: 1,
    specialRequests: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const updateGuestCount = (increment: boolean) => {
    setFormData((prev) => ({
      ...prev,
      guestCount: increment
        ? Math.min(yacht.specifications.maxGuests, prev.guestCount + 1)
        : Math.max(1, prev.guestCount - 1),
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.startTime) newErrors.startTime = 'Start time is required';
    if (!formData.location) newErrors.location = 'Location is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      alert(
        'Booking request submitted successfully! Our concierge team will contact you within 15 minutes.'
      );
      setIsSubmitting(false);
      onClose();
    }, 2000);
  };

  const calculateDuration = () => {
    if (!formData.startTime || !formData.endTime) return 0;
    const start = new Date(`2000-01-01T${formData.startTime}`);
    const end = new Date(`2000-01-01T${formData.endTime}`);
    let hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    if (hours < 0) hours += 24;
    return hours;
  };

  const totalPrice =
    yacht.priceUnit === 'day' ? yacht.price : yacht.price * calculateDuration();

  const steps = [
    { number: 1, title: 'Date & Time', icon: <Calendar className='w-5 h-5' /> },
    { number: 2, title: 'Details', icon: <Users className='w-5 h-5' /> },
    {
      number: 3,
      title: 'Confirmation',
      icon: <CheckCircle className='w-5 h-5' />,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50'
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 50 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className='bg-white rounded-3xl max-w-5xl w-full max-h-[95vh] overflow-y-auto shadow-2xl'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Enhanced Header */}
        <div
          className={`relative p-8 bg-gradient-to-r ${yacht.gradient} text-white overflow-hidden`}
        >
          {/* Background Pattern */}
          <div className='absolute inset-0 opacity-10'>
            <div className='absolute inset-0 bg-gradient-to-br from-white/20 to-transparent' />
          </div>

          {/* Navigation */}
          <div className='relative z-10 flex items-center justify-between mb-6'>
            <motion.button
              whileHover={{ scale: 1.1, x: -5 }}
              whileTap={{ scale: 0.9 }}
              onClick={onBack}
              className='w-12 h-12 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300'
            >
              <ChevronLeft className='w-6 h-6' />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className='w-12 h-12 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300'
            >
              <X className='w-6 h-6' />
            </motion.button>
          </div>

          <div className='relative z-10 text-center'>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className='inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-6 py-2 mb-4'
            >
              <Crown className='w-4 h-4 text-amber-300' />
              <span className='text-sm font-bold'>EXCLUSIVE BOOKING</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className='text-4xl font-bold mb-2'
            >
              Reserve {yacht.name}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className='text-white/90 text-lg'
            >
              Your luxury yacht experience awaits
            </motion.p>
          </div>

          {/* Progress Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className='relative z-10 flex justify-center mt-8'
          >
            <div className='flex items-center space-x-4'>
              {steps.map((step, index) => (
                <div key={step.number} className='flex items-center'>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                      currentStep >= step.number
                        ? 'bg-white text-blue-600'
                        : 'bg-white/20 border border-white/30 text-white'
                    }`}
                  >
                    {currentStep > step.number ? (
                      <CheckCircle className='w-6 h-6' />
                    ) : (
                      step.icon
                    )}
                  </motion.div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-16 h-0.5 mx-4 transition-all duration-300 ${
                        currentStep > step.number ? 'bg-white' : 'bg-white/30'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className='p-8'>
          <div className='grid lg:grid-cols-3 gap-8'>
            {/* Form Section */}
            <div className='lg:col-span-2 space-y-8'>
              {/* Step 1: Date & Time */}
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className='text-2xl font-bold text-gray-900 mb-6 flex items-center'>
                    <Calendar className='w-7 h-7 mr-3 text-blue-600' />
                    When would you like to sail?
                  </h3>

                  <div className='space-y-6'>
                    <div>
                      <label className='block text-sm font-semibold text-gray-700 mb-3'>
                        Select Date *
                      </label>
                      <input
                        type='date'
                        name='date'
                        value={formData.date}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split('T')[0]}
                        className={`w-full p-4 border-2 rounded-2xl text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                          errors.date ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {errors.date && (
                        <p className='text-red-500 text-sm mt-2'>
                          {errors.date}
                        </p>
                      )}
                    </div>

                    <div className='grid grid-cols-2 gap-4'>
                      <div>
                        <label className='block text-sm font-semibold text-gray-700 mb-3'>
                          Start Time *
                        </label>
                        <input
                          type='time'
                          name='startTime'
                          value={formData.startTime}
                          onChange={handleInputChange}
                          className={`w-full p-4 border-2 rounded-2xl text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                            errors.startTime
                              ? 'border-red-300'
                              : 'border-gray-300'
                          }`}
                        />
                        {errors.startTime && (
                          <p className='text-red-500 text-sm mt-2'>
                            {errors.startTime}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className='block text-sm font-semibold text-gray-700 mb-3'>
                          End Time
                        </label>
                        <input
                          type='time'
                          name='endTime'
                          value={formData.endTime}
                          onChange={handleInputChange}
                          className='w-full p-4 border-2 border-gray-300 rounded-2xl text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300'
                        />
                      </div>
                    </div>

                    <div>
                      <label className='block text-sm font-semibold text-gray-700 mb-3'>
                        Departure Location *
                      </label>
                      <select
                        name='location'
                        value={formData.location}
                        onChange={handleInputChange}
                        className={`w-full p-4 border-2 rounded-2xl text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                          errors.location ? 'border-red-300' : 'border-gray-300'
                        }`}
                      >
                        <option value=''>Choose departure location</option>
                        <option value='punta-cana-marina'>
                          Punta Cana Marina
                        </option>
                        <option value='cap-cana-marina'>Cap Cana Marina</option>
                        <option value='bavaro-beach'>Bavaro Beach</option>
                        <option value='hotel-pickup'>
                          Hotel Pickup Available
                        </option>
                      </select>
                      {errors.location && (
                        <p className='text-red-500 text-sm mt-2'>
                          {errors.location}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Details */}
              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className='text-2xl font-bold text-gray-900 mb-6 flex items-center'>
                    <Users className='w-7 h-7 mr-3 text-blue-600' />
                    Tell us about your group
                  </h3>

                  <div className='space-y-8'>
                    {/* Guest Count */}
                    <div>
                      <label className='block text-sm font-semibold text-gray-700 mb-4'>
                        Number of Guests
                      </label>
                      <div className='flex items-center justify-center max-w-xs mx-auto'>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          type='button'
                          onClick={() => updateGuestCount(false)}
                          className='w-14 h-14 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all duration-300 text-2xl font-bold'
                        >
                          -
                        </motion.button>
                        <div className='mx-8 text-center'>
                          <div className='text-4xl font-bold text-blue-600'>
                            {formData.guestCount}
                          </div>
                          <div className='text-sm text-gray-600'>guests</div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          type='button'
                          onClick={() => updateGuestCount(true)}
                          className='w-14 h-14 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all duration-300 text-2xl font-bold'
                        >
                          +
                        </motion.button>
                      </div>
                      <p className='text-sm text-gray-500 mt-3 text-center'>
                        Maximum: {yacht.specifications.maxGuests} guests
                      </p>
                    </div>

                    {/* Special Requests */}
                    <div>
                      <label className='block text-sm font-semibold text-gray-700 mb-3'>
                        Special Requests & Preferences
                      </label>
                      <textarea
                        name='specialRequests'
                        value={formData.specialRequests}
                        onChange={handleInputChange}
                        rows={6}
                        placeholder='Tell us about any special occasions, dietary requirements, water sports preferences, or other requests...'
                        className='w-full p-4 border-2 border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all duration-300'
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Confirmation */}
              {currentStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className='text-2xl font-bold text-gray-900 mb-6 flex items-center'>
                    <CheckCircle className='w-7 h-7 mr-3 text-blue-600' />
                    Review your booking
                  </h3>

                  <div className='bg-gray-50 p-6 rounded-2xl space-y-4'>
                    <div className='grid grid-cols-2 gap-4'>
                      <div>
                        <div className='text-sm text-gray-600'>Date</div>
                        <div className='font-semibold'>
                          {formData.date
                            ? new Date(formData.date).toLocaleDateString()
                            : 'Not selected'}
                        </div>
                      </div>
                      <div>
                        <div className='text-sm text-gray-600'>Time</div>
                        <div className='font-semibold'>
                          {formData.startTime}{' '}
                          {formData.endTime && `- ${formData.endTime}`}
                        </div>
                      </div>
                      <div>
                        <div className='text-sm text-gray-600'>Location</div>
                        <div className='font-semibold'>
                          {formData.location.replace('-', ' ') ||
                            'Not selected'}
                        </div>
                      </div>
                      <div>
                        <div className='text-sm text-gray-600'>Guests</div>
                        <div className='font-semibold'>
                          {formData.guestCount} guests
                        </div>
                      </div>
                    </div>
                    {formData.specialRequests && (
                      <div>
                        <div className='text-sm text-gray-600'>
                          Special Requests
                        </div>
                        <div className='font-semibold'>
                          {formData.specialRequests}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className='bg-blue-50 p-6 rounded-2xl mt-6 border border-blue-200'>
                    <div className='flex items-start'>
                      <AlertCircle className='w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0' />
                      <div className='text-sm text-blue-800'>
                        <p className='font-semibold mb-2'>
                          Important Information:
                        </p>
                        <ul className='space-y-1'>
                          <li>
                            • Final confirmation within 24 hours via phone or
                            email
                          </li>
                          <li>
                            • Weather conditions may affect departure times
                          </li>
                          <li>
                            • Cancellation policy: 48 hours notice required
                          </li>
                          <li>
                            • Our concierge team will contact you within 15
                            minutes
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Navigation Buttons */}
              <div className='flex justify-between pt-6'>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() =>
                    currentStep > 1 ? setCurrentStep(currentStep - 1) : onBack()
                  }
                  className='px-6 py-3 text-gray-600 border-2 border-gray-300 rounded-2xl font-semibold hover:bg-gray-50 transition-all duration-300'
                >
                  {currentStep === 1 ? 'Back to Details' : 'Previous'}
                </motion.button>

                {currentStep < 3 ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentStep(currentStep + 1)}
                    className='px-8 py-3 bg-blue-600 text-white rounded-2xl font-semibold hover:bg-blue-700 transition-all duration-300 flex items-center space-x-2'
                  >
                    <span>Continue</span>
                    <ArrowRight className='w-5 h-5' />
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={`px-8 py-3 rounded-2xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                      isSubmitting
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : `bg-gradient-to-r ${yacht.gradient} text-white hover:shadow-lg`
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white' />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className='w-5 h-5' />
                        <span>Confirm Booking</span>
                      </>
                    )}
                  </motion.button>
                )}
              </div>
            </div>

            {/* Summary Sidebar */}
            <div className='space-y-6'>
              {/* Yacht Summary */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className='bg-gray-50 p-6 rounded-2xl border border-gray-200'
              >
                <h4 className='font-bold text-gray-900 mb-4'>Your Selection</h4>
                <div className='flex items-center mb-4'>
                  <img
                    src={yacht.mainImage}
                    alt={yacht.name}
                    className='w-20 h-20 object-cover rounded-xl mr-4'
                  />
                  <div>
                    <h5 className='font-bold'>{yacht.name}</h5>
                    <p className='text-sm text-gray-600'>
                      {yacht.specifications.length} •{' '}
                      {yacht.specifications.maxGuests} guests
                    </p>
                    <div className='flex items-center mt-1'>
                      <Star className='w-4 h-4 text-amber-500 fill-current mr-1' />
                      <span className='text-sm font-semibold'>
                        {yacht.rating}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Price Summary */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className='bg-blue-50 p-6 rounded-2xl border border-blue-200'
              >
                <h4 className='font-bold text-gray-900 mb-4'>Price Summary</h4>
                <div className='space-y-3'>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>
                      {yacht.priceUnit === 'day'
                        ? 'Daily rate'
                        : `Hourly rate (${calculateDuration()}h)`}
                    </span>
                    <span className='font-semibold'>
                      ${totalPrice.toLocaleString()}
                    </span>
                  </div>
                  <div className='border-t pt-3'>
                    <div className='flex justify-between text-xl font-bold'>
                      <span>Total</span>
                      <span className='text-blue-600'>
                        ${totalPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className='mt-4 p-4 bg-white rounded-xl'>
                  <h5 className='font-semibold text-sm mb-2'>Included:</h5>
                  <ul className='text-xs text-gray-600 space-y-1'>
                    <li>• Professional captain & crew</li>
                    <li>• Fuel & insurance coverage</li>
                    <li>• Safety equipment & permits</li>
                    <li>• Welcome refreshments</li>
                  </ul>
                </div>
              </motion.div>

              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className='bg-gradient-to-br from-cyan-50 to-blue-50 p-6 rounded-2xl border border-cyan-200'
              >
                <h4 className='font-bold text-gray-900 mb-4 flex items-center'>
                  <Phone className='w-5 h-5 mr-2 text-blue-600' />
                  Need Assistance?
                </h4>
                <p className='text-sm text-gray-600 mb-4'>
                  Our concierge team is available 24/7 to help with your booking
                </p>
                <div className='space-y-2 text-sm'>
                  <div className='flex items-center'>
                    <Phone className='w-4 h-4 mr-2 text-blue-600' />
                    <span>+1 (555) 0000000</span>
                  </div>
                  <div className='flex items-center'>
                    <Mail className='w-4 h-4 mr-2 text-blue-600' />
                    <span>info@luxpuntacana.com</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Main Component
const LuxeYachtServiceView: React.FC = () => {
  const [selectedYacht, setSelectedYacht] = useState<Yacht | null>(null);

  return (
    <div className='min-h-screen bg-white'>
      {/* <ModernNavigation /> */}
      <CinematicHero
        onBookingClick={function (): void {
          throw new Error('Function not implemented.');
        }}
      />
      <RevolutionaryYachtGrid onYachtSelect={setSelectedYacht} />
      <ImmersiveExperiences />
      <PremiumTestimonials />
      <UltraPremiumContact
        onBookingClick={function (): void {
          throw new Error('Function not implemented.');
        }}
      />

      {/* Modal System */}
      <AnimatePresence>
        {selectedYacht && (
          <YachtModal
            yacht={selectedYacht}
            onClose={() => setSelectedYacht(null)}
            onBook={() => {}}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default LuxeYachtServiceView;
