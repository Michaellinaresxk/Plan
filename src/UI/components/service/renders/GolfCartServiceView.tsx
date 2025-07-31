import React, { useState, useEffect, useRef } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from 'framer-motion';
import {
  Car,
  Users,
  Clock,
  Zap,
  MapPin,
  Star,
  Shield,
  Battery,
  Navigation,
  CheckCircle,
  Sparkles,
  Crown,
  Diamond,
  Globe,
  Calendar,
  Phone,
  Mail,
  Award,
  Heart,
  Play,
  ArrowRight,
  X,
  ChevronLeft,
  ChevronRight,
  Filter,
  Eye,
  Share2,
  Bookmark,
  Compass,
  Sun,
  Moon,
  Camera,
  CreditCard,
  AlertCircle,
  Fuel,
  Route,
  Mountain,
} from 'lucide-react';

// Types
interface GolfCartSpecification {
  seats: number;
  maxSpeed: string;
  batteryLife: string;
  range: string;
  features: string[];
  type: 'electric' | 'gas';
}

interface GolfCartFeature {
  icon: React.ReactNode;
  name: string;
  description: string;
}

interface GolfCart {
  id: string;
  name: string;
  category: 'standard' | 'premium' | 'luxury';
  price: number;
  priceUnit: 'day' | 'hour';
  description: string;
  shortDescription: string;
  mainImage: string;
  gallery: string[];
  specifications: GolfCartSpecification;
  features: GolfCartFeature[];
  highlights: string[];
  isPremium: boolean;
  isAvailable: boolean;
  rating: number;
  gradient: string;
}

interface BookingFormData {
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  duration: number;
  specialRequests: string;
}

interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  comment: string;
  image: string;
  cartType: string;
}

interface Experience {
  id: string;
  title: string;
  description: string;
  image: string;
  duration: string;
  highlights: string[];
  price: number;
}

// Data
const GOLF_CART_DATA: GolfCart[] = [
  {
    id: 'standard-4-seater',
    name: 'Classic 4-Seater',
    category: 'standard',
    price: 45,
    priceUnit: 'day',
    description:
      'Perfect for couples or small families. Our standard 4-seater golf cart offers comfort and reliability for exploring your resort or local area.',
    shortDescription: 'Comfortable 4-seater for resort exploration',
    mainImage:
      'https://images.unsplash.com/photo-1551058622-5d7b4f0c6e6a?w=800&h=600&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1551058622-5d7b4f0c6e6a?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1612838006830-bf35ed6ba7f6?w=800&h=600&fit=crop',
    ],
    specifications: {
      seats: 4,
      maxSpeed: '25 mph',
      batteryLife: '8-10 hours',
      range: '40-50 miles',
      features: [
        'LED headlights',
        'USB charging ports',
        'Weather protection',
        'Storage compartment',
      ],
      type: 'electric',
    },
    features: [
      {
        icon: <Battery className='w-5 h-5' />,
        name: 'Long Battery Life',
        description: 'Up to 10 hours of continuous use',
      },
      {
        icon: <Shield className='w-5 h-5' />,
        name: 'Safety First',
        description: 'Full safety equipment included',
      },
    ],
    highlights: [
      'Fully charged delivery',
      'Free pickup & drop-off',
      '24/7 support included',
    ],
    isPremium: false,
    isAvailable: true,
    rating: 4.8,
    gradient: 'from-blue-600 via-cyan-600 to-teal-700',
  },
  {
    id: 'premium-6-seater',
    name: 'Premium 6-Seater',
    category: 'premium',
    price: 65,
    priceUnit: 'day',
    description:
      'Ideal for larger groups and families. Our premium 6-seater offers extra space, enhanced comfort, and premium features for the ultimate golf cart experience.',
    shortDescription: 'Spacious premium cart for larger groups',
    mainImage:
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1612838006830-bf35ed6ba7f6?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1551058622-5d7b4f0c6e6a?w=800&h=600&fit=crop',
    ],
    specifications: {
      seats: 6,
      maxSpeed: '25 mph',
      batteryLife: '8-12 hours',
      range: '50-60 miles',
      features: [
        'Premium sound system',
        'Cooler included',
        'GPS navigation',
        'Custom seating',
        'All-weather canopy',
      ],
      type: 'electric',
    },
    features: [
      {
        icon: <Users className='w-5 h-5' />,
        name: 'Group Friendly',
        description: 'Comfortable seating for 6 people',
      },
      {
        icon: <Navigation className='w-5 h-5' />,
        name: 'GPS Navigation',
        description: 'Never get lost exploring',
      },
    ],
    highlights: [
      'Premium sound system',
      'Complimentary cooler',
      'Priority support',
    ],
    isPremium: true,
    isAvailable: true,
    rating: 4.9,
    gradient: 'from-emerald-600 via-teal-600 to-cyan-700',
  },
  {
    id: 'luxury-executive',
    name: 'Executive Luxury',
    category: 'luxury',
    price: 95,
    priceUnit: 'day',
    description:
      'The ultimate in golf cart luxury. Features leather seating, advanced technology, and premium amenities for the most discerning guests.',
    shortDescription: 'Ultimate luxury with premium amenities',
    mainImage:
      'https://images.unsplash.com/photo-1612838006830-bf35ed6ba7f6?w=800&h=600&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1612838006830-bf35ed6ba7f6?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1551058622-5d7b4f0c6e6a?w=800&h=600&fit=crop',
    ],
    specifications: {
      seats: 4,
      maxSpeed: '25 mph',
      batteryLife: '10-12 hours',
      range: '60-70 miles',
      features: [
        'Leather seats',
        'Climate control',
        'Premium audio',
        'Phone charging',
        'LED package',
        'Luxury finishes',
      ],
      type: 'electric',
    },
    features: [
      {
        icon: <Crown className='w-5 h-5' />,
        name: 'Luxury Interior',
        description: 'Premium leather and finishes',
      },
      {
        icon: <Zap className='w-5 h-5' />,
        name: 'Advanced Tech',
        description: 'Latest technology features',
      },
    ],
    highlights: ['Leather seating', 'Climate control', 'VIP concierge service'],
    isPremium: true,
    isAvailable: true,
    rating: 5.0,
    gradient: 'from-amber-500 via-orange-600 to-red-600',
  },
];

const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah & Mike Johnson',
    location: 'Cap Cana Resort',
    rating: 5,
    comment:
      'Amazing service! The golf cart was delivered right to our resort room. Made exploring so much easier and fun!',
    image:
      'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=100&h=100&fit=crop&crop=face',
    cartType: 'Premium 6-Seater',
  },
  {
    id: '2',
    name: 'Carlos Rodriguez',
    location: 'Bavaro Beach',
    rating: 5,
    comment:
      'Perfect for our family vacation! The kids loved riding around the resort. Excellent condition and service.',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    cartType: 'Classic 4-Seater',
  },
];

const EXPERIENCES: Experience[] = [
  {
    id: '1',
    title: 'Resort Explorer',
    description: 'Discover every corner of your resort with ease and comfort.',
    image:
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
    duration: 'Full day',
    highlights: ['All resort areas', 'Restaurant hopping', 'Beach access'],
    price: 45,
  },
  {
    id: '2',
    title: 'Beach Adventure',
    description: 'Cruise along beautiful beach towns and hidden coastal gems.',
    image:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    duration: 'Half day',
    highlights: [
      'Scenic coastal routes',
      'Local beach spots',
      'Photo opportunities',
    ],
    price: 65,
  },
  {
    id: '3',
    title: 'Villa Community Tour',
    description: 'Explore luxury villa communities and private neighborhoods.',
    image:
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop',
    duration: '4 hours',
    highlights: ['Private communities', 'Luxury amenities', 'Exclusive areas'],
    price: 95,
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
        <div className='absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/70' />
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
          <source src='/video/golfCart-promo.mp4' type='video/mp4' />
        </video>
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
                  PREMIUM MOBILITY COLLECTION
                </span>
                <Diamond className='w-5 h-5 text-cyan-400' />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className='text-5xl lg:text-7xl font-thin mb-6 leading-tight'
              >
                Move
                <span className='block font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent'>
                  Freely
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
                className='text-xl lg:text-2xl text-gray-300 mb-8 leading-relaxed max-w-lg'
              >
                Explore Punta Cana in style with our luxury golf cart
                collection. Freedom on wheels, delivered to your door.
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
                  <Car className='w-6 h-6' />
                  <span>Explore Fleet</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className='border-2 border-white/60 text-white px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center space-x-3 backdrop-blur-sm hover:bg-white/10 transition-all duration-300'
                >
                  <Play className='w-6 h-6' />
                  <span>Watch Tour</span>
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
                  { number: '50+', label: 'Premium Carts' },
                  { number: '500+', label: 'Happy Guests' },
                  { number: '24/7', label: 'Support' },
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
                      <Car className='w-8 h-8 text-white' />
                    </div>
                    <div>
                      <h3 className='text-2xl font-bold text-white'>
                        Premium Service
                      </h3>
                      <p className='text-gray-300'>Door-to-Door Delivery</p>
                    </div>
                  </div>

                  <p className='text-gray-300 mb-6'>
                    Experience hassle-free mobility with our premium golf cart
                    service. Delivered fully charged and ready to explore.
                  </p>

                  <div className='grid grid-cols-2 gap-4'>
                    {[
                      {
                        icon: <Shield className='w-5 h-5' />,
                        text: 'Fully Insured',
                      },
                      {
                        icon: <Battery className='w-5 h-5' />,
                        text: 'Fully Charged',
                      },
                      {
                        icon: <Clock className='w-5 h-5' />,
                        text: '24/7 Support',
                      },
                      {
                        icon: <MapPin className='w-5 h-5' />,
                        text: 'Free Delivery',
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

// Golf Cart Grid
const GolfCartGrid: React.FC<{
  onCartSelect: (cart: GolfCart) => void;
}> = ({ onCartSelect }) => {
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredCarts =
    filter === 'all'
      ? GOLF_CART_DATA
      : GOLF_CART_DATA.filter((cart) => cart.category === filter);

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
            <Car className='w-5 h-5 text-blue-600' />
            <span className='text-blue-900 font-semibold'>PREMIUM FLEET</span>
          </motion.div>

          <h2 className='text-5xl lg:text-6xl font-thin text-gray-900 mb-6'>
            Luxury{' '}
            <span className='font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent'>
              Mobility
            </span>
          </h2>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
            Every golf cart in our fleet represents comfort, style, and
            reliability
          </p>
        </motion.div>

        {/* Filter & Controls */}
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
                name: 'All Carts',
                icon: <Car className='w-4 h-4' />,
              },
              {
                id: 'standard',
                name: 'Standard',
                icon: <Users className='w-4 h-4' />,
              },
              {
                id: 'premium',
                name: 'Premium',
                icon: <Crown className='w-4 h-4' />,
              },
              {
                id: 'luxury',
                name: 'Luxury',
                icon: <Diamond className='w-4 h-4' />,
              },
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

          {/* View Controls */}
          <div className='flex items-center space-x-4'>
            <div className='flex bg-gray-100 rounded-2xl p-1'>
              {[
                {
                  mode: 'grid',
                  icon: (
                    <div className='grid grid-cols-2 gap-1'>
                      <div className='w-1 h-1 bg-current rounded-full'></div>
                      <div className='w-1 h-1 bg-current rounded-full'></div>
                      <div className='w-1 h-1 bg-current rounded-full'></div>
                      <div className='w-1 h-1 bg-current rounded-full'></div>
                    </div>
                  ),
                },
                {
                  mode: 'list',
                  icon: (
                    <div className='space-y-1'>
                      <div className='h-1 w-4 bg-current rounded'></div>
                      <div className='h-1 w-4 bg-current rounded'></div>
                      <div className='h-1 w-4 bg-current rounded'></div>
                    </div>
                  ),
                },
              ].map((view) => (
                <motion.button
                  key={view.mode}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode(view.mode as any)}
                  className={`p-3 rounded-xl transition-all duration-300 ${
                    viewMode === view.mode
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {view.icon}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Cart Grid */}
        <motion.div
          layout
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8'
              : 'space-y-6'
          }
        >
          <AnimatePresence>
            {filteredCarts.map((cart, index) => (
              <motion.div
                key={cart.id}
                layout
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                {viewMode === 'grid' ? (
                  <GolfCartCard
                    cart={cart}
                    onSelect={() => onCartSelect(cart)}
                  />
                ) : (
                  <GolfCartListItem
                    cart={cart}
                    onSelect={() => onCartSelect(cart)}
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

// Golf Cart Card Component
const GolfCartCard: React.FC<{ cart: GolfCart; onSelect: () => void }> = ({
  cart,
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
          src={cart.mainImage}
          alt={cart.name}
          className='w-full h-full object-cover'
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.7 }}
        />

        {/* Overlay Gradient */}
        <div className='absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent' />

        {/* Premium Badge */}
        {cart.isPremium && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className='absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center space-x-2'
          >
            <Crown className='w-4 h-4' />
            <span>Premium</span>
          </motion.div>
        )}

        {/* Actions */}
        <div className='absolute top-4 right-4 flex space-x-2'>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className='w-10 h-10 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all'
          >
            <Heart className='w-5 h-5' />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className='w-10 h-10 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all'
          >
            <Share2 className='w-5 h-5' />
          </motion.button>
        </div>

        {/* Rating */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className='absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 flex items-center space-x-1'
        >
          <Star className='w-4 h-4 text-amber-500 fill-current' />
          <span className='text-sm font-bold text-gray-900'>{cart.rating}</span>
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
                {cart.specifications.seats}
              </span>
            </div>
            <div className='flex flex-col items-center'>
              <Battery className='w-4 h-4 mb-1' />
              <span className='text-xs font-medium'>
                {cart.specifications.batteryLife}
              </span>
            </div>
            <div className='flex flex-col items-center'>
              <Zap className='w-4 h-4 mb-1' />
              <span className='text-xs font-medium'>
                {cart.specifications.maxSpeed}
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
              {cart.name}
            </h3>
            <p className='text-gray-500 text-sm font-medium uppercase tracking-wider'>
              {cart.category} • {cart.specifications.seats} seats
            </p>
          </div>
          <div className='text-right'>
            <div className='text-2xl font-bold text-gray-900'>
              ${cart.price}
            </div>
            <div className='text-sm text-gray-500'>per {cart.priceUnit}</div>
          </div>
        </div>

        <p className='text-gray-600 mb-6 line-clamp-2'>
          {cart.shortDescription}
        </p>

        {/* Features */}
        <div className='grid grid-cols-2 gap-3 mb-6'>
          {[
            {
              icon: <Users className='w-4 h-4' />,
              text: `${cart.specifications.seats} seats`,
            },
            {
              icon: <Battery className='w-4 h-4' />,
              text: `${cart.specifications.batteryLife}`,
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
          className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-3 bg-gradient-to-r ${cart.gradient} text-white hover:shadow-lg relative overflow-hidden group`}
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

// Golf Cart List Item Component
const GolfCartListItem: React.FC<{ cart: GolfCart; onSelect: () => void }> = ({
  cart,
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
            src={cart.mainImage}
            alt={cart.name}
            className='w-full h-full object-cover'
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5 }}
          />
          {cart.isPremium && (
            <div className='absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1'>
              <Crown className='w-3 h-3' />
              <span>Premium</span>
            </div>
          )}
          <div className='absolute top-4 right-4 bg-white/90 rounded-lg px-2 py-1 flex items-center space-x-1'>
            <Star className='w-3 h-3 text-amber-500 fill-current' />
            <span className='text-xs font-bold'>{cart.rating}</span>
          </div>
        </div>

        {/* Content */}
        <div className='flex-1 p-8 flex justify-between'>
          <div>
            <div className='flex items-center space-x-3 mb-2'>
              <h3 className='text-3xl font-bold text-gray-900'>{cart.name}</h3>
              <span className='bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium uppercase'>
                {cart.category}
              </span>
            </div>

            <p className='text-gray-600 mb-4 text-lg max-w-2xl'>
              {cart.description.slice(0, 150)}...
            </p>

            {/* Specs Grid */}
            <div className='grid grid-cols-4 gap-6'>
              {[
                {
                  icon: <Users className='w-5 h-5' />,
                  label: 'Seats',
                  value: cart.specifications.seats,
                },
                {
                  icon: <Battery className='w-5 h-5' />,
                  label: 'Battery',
                  value: cart.specifications.batteryLife,
                },
                {
                  icon: <Zap className='w-5 h-5' />,
                  label: 'Speed',
                  value: cart.specifications.maxSpeed,
                },
                {
                  icon: <Route className='w-5 h-5' />,
                  label: 'Range',
                  value: cart.specifications.range,
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
                ${cart.price}
              </div>
              <div className='text-gray-500 mb-6'>per {cart.priceUnit}</div>
            </div>

            <div className='space-y-3'>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-8 py-3 rounded-2xl font-bold text-white bg-gradient-to-r ${cart.gradient} hover:shadow-lg transition-all duration-300`}
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

// Experiences Section
const ExperiencesSection: React.FC = () => {
  const [activeExperience, setActiveExperience] = useState(0);

  return (
    <section
      id='experiences'
      className='py-32 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden'
    >
      {/* Background Image */}
      <div className='absolute inset-0'>
        <div
          className='w-full h-full bg-cover bg-center opacity-20'
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop)',
          }}
        />
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
            Explore{' '}
            <span className='font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent'>
              Paradise
            </span>
          </h2>
          <p className='text-xl text-blue-100 max-w-3xl mx-auto'>
            Discover Punta Cana's hidden gems and popular destinations with our
            curated experiences
          </p>
        </motion.div>

        {/* Experience Cards */}
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

                  {/* Price Badge */}
                  <div className='absolute top-4 right-4 bg-cyan-500/80 backdrop-blur-sm px-4 py-2 rounded-full'>
                    <span className='font-bold'>${experience.price}/day</span>
                  </div>

                  {/* Sparkle Effect */}
                  <motion.div
                    animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className='absolute bottom-4 right-4'
                  >
                    <Sparkles className='w-6 h-6 text-cyan-400' />
                  </motion.div>
                </div>

                {/* Content */}
                <div className='p-8'>
                  {/* <h3 className='text-2xl font-bold mb-4 group-hover:text-cyan-400 transition-colors'>
                    {experience.title}
                  </h3> */}

                  {/* CTA */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className='w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-3 hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 relative overflow-hidden group'
                  >
                    <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000' />
                    <span>Book Experience</span>
                    <ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform' />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Testimonials Section
const TestimonialsSection: React.FC = () => {
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
            Happy{' '}
            <span className='font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent'>
              Adventures
            </span>
          </h2>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
            Discover why travelers choose our premium golf cart service for
            their Punta Cana adventures
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
                    <Car className='w-5 h-5 text-blue-600' />
                    <span className='text-blue-900 font-semibold'>
                      Experience: {testimonial.cartType}
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

// Contact Section
const ContactSection: React.FC<{ onBookingClick: () => void }> = ({
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
              <span className='font-semibold'>START YOUR ADVENTURE</span>
            </motion.div>

            <h2 className='text-5xl lg:text-6xl font-thin mb-6'>
              Ready to{' '}
              <span className='font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent'>
                Explore?
              </span>
            </h2>

            <p className='text-xl text-blue-100 mb-8 leading-relaxed'>
              Our premium golf cart service is ready to enhance your Punta Cana
              experience. Door-to-door delivery, 24/7 support, and the freedom
              to explore at your pace.
            </p>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12'>
              {[
                {
                  icon: <Shield className='w-6 h-6' />,
                  title: 'Fully Insured',
                  desc: 'Complete protection',
                },
                {
                  icon: <Battery className='w-6 h-6' />,
                  title: 'Fully Charged',
                  desc: 'Ready to explore',
                },
                {
                  icon: <Clock className='w-6 h-6' />,
                  title: '24/7 Support',
                  desc: 'Always available',
                },
                {
                  icon: <MapPin className='w-6 h-6' />,
                  title: 'Free Delivery',
                  desc: 'Door-to-door service',
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
                <span>Book Now</span>
              </motion.button>

              <motion.a
                href='tel:+18095551234'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className='border-2 border-white/60 text-white px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center space-x-3 backdrop-blur-sm hover:bg-white/10 transition-all duration-300'
              >
                <Phone className='w-6 h-6' />
                <span>Call Support</span>
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
                  <Car className='w-10 h-10 text-white' />
                </div>
                <h3 className='text-2xl font-bold mb-2'>Premium Service</h3>
                <p className='text-blue-200'>Delivered to your door</p>
              </div>

              <div className='space-y-6'>
                {[
                  {
                    icon: <Phone className='w-5 h-5' />,
                    label: 'Phone',
                    value: '+1 (809) 555-CART',
                  },
                  {
                    icon: <Mail className='w-5 h-5' />,
                    label: 'Email',
                    value: 'rentals@golfcartlux.com',
                  },
                  {
                    icon: <Clock className='w-5 h-5' />,
                    label: 'Hours',
                    value: '24/7 Service Available',
                  },
                  {
                    icon: <MapPin className='w-5 h-5' />,
                    label: 'Coverage',
                    value: 'All Punta Cana Area',
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
                <p className='font-bold text-cyan-400'>Under 30 minutes</p>
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

// Golf Cart Modal
const GolfCartModal: React.FC<{
  cart: GolfCart;
  onClose: () => void;
  onBook: () => void;
}> = ({ cart, onClose, onBook }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showBookingForm, setShowBookingForm] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % cart.gallery.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + cart.gallery.length) % cart.gallery.length
    );
  };

  if (showBookingForm) {
    return (
      <GolfCartBookingForm
        cart={cart}
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
        {/* Header */}
        <div
          className={`relative p-8 bg-gradient-to-r ${cart.gradient} text-white overflow-hidden`}
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
              <span className='text-sm font-bold'>PREMIUM BOOKING</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className='text-4xl font-bold mb-2'
            >
              Reserve {cart.name}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className='text-white/90 text-lg'
            >
              Your premium mobility experience awaits
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
                    When do you need the golf cart?
                  </h3>

                  <div className='space-y-6'>
                    <div>
                      <label className='block text-sm font-semibold text-gray-700 mb-3'>
                        Rental Date *
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
                          Pickup Time *
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
                          Return Time (Optional)
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

                    {/* Duration Selector */}
                    <div>
                      <label className='block text-sm font-semibold text-gray-700 mb-4'>
                        Rental Duration (Days)
                      </label>
                      <div className='flex items-center justify-center max-w-xs mx-auto'>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          type='button'
                          onClick={() => updateDuration(false)}
                          className='w-14 h-14 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all duration-300 text-2xl font-bold'
                        >
                          -
                        </motion.button>
                        <div className='mx-8 text-center'>
                          <div className='text-4xl font-bold text-blue-600'>
                            {formData.duration}
                          </div>
                          <div className='text-sm text-gray-600'>
                            {formData.duration === 1 ? 'day' : 'days'}
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          type='button'
                          onClick={() => updateDuration(true)}
                          className='w-14 h-14 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all duration-300 text-2xl font-bold'
                        >
                          +
                        </motion.button>
                      </div>
                      <p className='text-sm text-gray-500 mt-3 text-center'>
                        Maximum: 7 days rental period
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Location & Details */}
              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className='text-2xl font-bold text-gray-900 mb-6 flex items-center'>
                    <MapPin className='w-7 h-7 mr-3 text-blue-600' />
                    Delivery & pickup details
                  </h3>

                  <div className='space-y-8'>
                    <div>
                      <label className='block text-sm font-semibold text-gray-700 mb-3'>
                        Delivery Location *
                      </label>
                      <select
                        name='location'
                        value={formData.location}
                        onChange={handleInputChange}
                        className={`w-full p-4 border-2 rounded-2xl text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                          errors.location ? 'border-red-300' : 'border-gray-300'
                        }`}
                      >
                        <option value=''>Choose delivery location</option>
                        <option value='punta-cana-resort'>
                          Punta Cana Resort
                        </option>
                        <option value='cap-cana-resort'>Cap Cana Resort</option>
                        <option value='bavaro-beach-hotels'>
                          Bavaro Beach Hotels
                        </option>
                        <option value='hard-rock-hotel'>Hard Rock Hotel</option>
                        <option value='dreams-resort'>Dreams Resort</option>
                        <option value='iberostar-resort'>
                          Iberostar Resort
                        </option>
                        <option value='private-villa'>
                          Private Villa/Residence
                        </option>
                        <option value='other-location'>Other Location</option>
                      </select>
                      {errors.location && (
                        <p className='text-red-500 text-sm mt-2'>
                          {errors.location}
                        </p>
                      )}
                    </div>

                    {/* Special Requests */}
                    <div>
                      <label className='block text-sm font-semibold text-gray-700 mb-3'>
                        Special Requests & Instructions
                      </label>
                      <textarea
                        name='specialRequests'
                        value={formData.specialRequests}
                        onChange={handleInputChange}
                        rows={6}
                        placeholder='Any special delivery instructions, accessibility needs, additional equipment requests, or other preferences...'
                        className='w-full p-4 border-2 border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all duration-300'
                      />
                    </div>

                    {/* Service Information */}
                    <div className='bg-blue-50 p-6 rounded-2xl border border-blue-200'>
                      <h4 className='font-bold text-blue-900 mb-4 flex items-center'>
                        <Car className='w-5 h-5 mr-2' />
                        What's Included
                      </h4>
                      <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                        {[
                          'Fully charged battery',
                          'Full fuel tank (if applicable)',
                          'Free delivery & pickup',
                          '24/7 support hotline',
                          'Safety equipment included',
                          'Quick orientation session',
                        ].map((item, index) => (
                          <div
                            key={index}
                            className='flex items-center space-x-2'
                          >
                            <CheckCircle className='w-4 h-4 text-emerald-500 flex-shrink-0' />
                            <span className='text-blue-800 text-sm'>
                              {item}
                            </span>
                          </div>
                        ))}
                      </div>
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
                        <div className='text-sm text-gray-600'>Rental Date</div>
                        <div className='font-semibold'>
                          {formData.date
                            ? new Date(formData.date).toLocaleDateString()
                            : 'Not selected'}
                        </div>
                      </div>
                      <div>
                        <div className='text-sm text-gray-600'>Duration</div>
                        <div className='font-semibold'>
                          {formData.duration}{' '}
                          {formData.duration === 1 ? 'day' : 'days'}
                        </div>
                      </div>
                      <div>
                        <div className='text-sm text-gray-600'>Pickup Time</div>
                        <div className='font-semibold'>
                          {formData.startTime || 'Not selected'}
                        </div>
                      </div>
                      <div>
                        <div className='text-sm text-gray-600'>Return Time</div>
                        <div className='font-semibold'>
                          {formData.endTime || 'Flexible'}
                        </div>
                      </div>
                      <div className='col-span-2'>
                        <div className='text-sm text-gray-600'>
                          Delivery Location
                        </div>
                        <div className='font-semibold'>
                          {formData.location.replace('-', ' ') ||
                            'Not selected'}
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
                            • Driver must be 18+ with valid driver's license
                          </li>
                          <li>
                            • Golf cart will be delivered fully charged and
                            ready
                          </li>
                          <li>
                            • Follow all resort and local driving regulations
                          </li>
                          <li>• Our team will contact you within 30 minutes</li>
                          <li>
                            • Free cancellation up to 24 hours before rental
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
                        : `bg-gradient-to-r ${cart.gradient} text-white hover:shadow-lg`
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
              {/* Cart Summary */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className='bg-gray-50 p-6 rounded-2xl border border-gray-200'
              >
                <h4 className='font-bold text-gray-900 mb-4'>Your Selection</h4>
                <div className='flex items-center mb-4'>
                  <img
                    src={cart.mainImage}
                    alt={cart.name}
                    className='w-20 h-20 object-cover rounded-xl mr-4'
                  />
                  <div>
                    <h5 className='font-bold'>{cart.name}</h5>
                    <p className='text-sm text-gray-600'>
                      {cart.specifications.seats} seats •{' '}
                      {cart.specifications.type}
                    </p>
                    <div className='flex items-center mt-1'>
                      <Star className='w-4 h-4 text-amber-500 fill-current mr-1' />
                      <span className='text-sm font-semibold'>
                        {cart.rating}
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
                      Daily rate × {formData.duration}{' '}
                      {formData.duration === 1 ? 'day' : 'days'}
                    </span>
                    <span className='font-semibold'>${totalPrice}</span>
                  </div>
                  <div className='flex justify-between text-sm text-gray-500'>
                    <span>Delivery & pickup</span>
                    <span>FREE</span>
                  </div>
                  <div className='flex justify-between text-sm text-gray-500'>
                    <span>24/7 Support</span>
                    <span>Included</span>
                  </div>
                  <div className='border-t pt-3'>
                    <div className='flex justify-between text-xl font-bold'>
                      <span>Total</span>
                      <span className='text-blue-600'>${totalPrice}</span>
                    </div>
                  </div>
                </div>

                <div className='mt-4 p-4 bg-white rounded-xl'>
                  <h5 className='font-semibold text-sm mb-2'>
                    What's Included:
                  </h5>
                  <ul className='text-xs text-gray-600 space-y-1'>
                    <li>• Fully charged & ready to drive</li>
                    <li>• Complete safety equipment</li>
                    <li>• Free door-to-door service</li>
                    <li>• 24/7 emergency support</li>
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
                  Need Help?
                </h4>
                <p className='text-sm text-gray-600 mb-4'>
                  Our support team is available 24/7 for any questions
                </p>
                <div className='space-y-2 text-sm'>
                  <div className='flex items-center'>
                    <Phone className='w-4 h-4 mr-2 text-blue-600' />
                    <span>+1 (809) 555-CART</span>
                  </div>
                  <div className='flex items-center'>
                    <Mail className='w-4 h-4 mr-2 text-blue-600' />
                    <span>support@golfcartlux.com</span>
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
const GolfCartServiceView: React.FC = () => {
  const [selectedCart, setSelectedCart] = useState<GolfCart | null>(null);

  return (
    <div className='min-h-screen bg-white'>
      <CinematicHero
        onBookingClick={() => {
          document.getElementById('fleet')?.scrollIntoView({
            behavior: 'smooth',
          });
        }}
      />
      <GolfCartGrid onCartSelect={setSelectedCart} />
      <ExperiencesSection />
      <TestimonialsSection />
      <ContactSection
        onBookingClick={() => {
          document.getElementById('fleet')?.scrollIntoView({
            behavior: 'smooth',
          });
        }}
      />

      {/* Modal System */}
      <AnimatePresence>
        {selectedCart && (
          <GolfCartModal
            cart={selectedCart}
            onClose={() => setSelectedCart(null)}
            onBook={() => {}}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Golf Cart Booking Form
const GolfCartBookingForm: React.FC<{
  cart: GolfCart;
  onClose: () => void;
  onBack: () => void;
}> = ({ cart, onClose, onBack }) => {
  const [formData, setFormData] = useState<BookingFormData>({
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    duration: 1,
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

  const updateDuration = (increment: boolean) => {
    setFormData((prev) => ({
      ...prev,
      duration: increment
        ? Math.min(7, prev.duration + 1)
        : Math.max(1, prev.duration - 1),
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
        'Booking request submitted successfully! Our team will contact you within 30 minutes to confirm delivery details.'
      );
      setIsSubmitting(false);
      onClose();
    }, 2000);
  };

  const totalPrice = cart.price * formData.duration;

  const steps = [
    { number: 1, title: 'Date & Time', icon: <Calendar className='w-5 h-5' /> },
    { number: 2, title: 'Details', icon: <MapPin className='w-5 h-5' /> },
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
        {/* Header */}
        <div
          className={`relative p-8 bg-gradient-to-r ${cart.gradient} text-white overflow-hidden`}
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
              <span className='text-sm font-bold'>PREMIUM BOOKING</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className='text-4xl font-bold mb-2'
            >
              Reserve {cart.name}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className='text-white/90 text-lg'
            >
              Your premium mobility experience awaits
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
                    When do you need the golf cart?
                  </h3>

                  <div className='space-y-6'>
                    <div>
                      <label className='block text-sm font-semibold text-gray-700 mb-3'>
                        Rental Date *
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
                          Pickup Time *
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
                          Return Time (Optional)
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

                    {/* Duration Selector */}
                    <div>
                      <label className='block text-sm font-semibold text-gray-700 mb-4'>
                        Rental Duration (Days)
                      </label>
                      <div className='flex items-center justify-center max-w-xs mx-auto'>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          type='button'
                          onClick={() => updateDuration(false)}
                          className='w-14 h-14 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all duration-300 text-2xl font-bold'
                        >
                          -
                        </motion.button>
                        <div className='mx-8 text-center'>
                          <div className='text-4xl font-bold text-blue-600'>
                            {formData.duration}
                          </div>
                          <div className='text-sm text-gray-600'>
                            {formData.duration === 1 ? 'day' : 'days'}
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          type='button'
                          onClick={() => updateDuration(true)}
                          className='w-14 h-14 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all duration-300 text-2xl font-bold'
                        >
                          +
                        </motion.button>
                      </div>
                      <p className='text-sm text-gray-500 mt-3 text-center'>
                        Maximum: 7 days rental period
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Location & Details */}
              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className='text-2xl font-bold text-gray-900 mb-6 flex items-center'>
                    <MapPin className='w-7 h-7 mr-3 text-blue-600' />
                    Delivery & pickup details
                  </h3>

                  <div className='space-y-8'>
                    <div>
                      <label className='block text-sm font-semibold text-gray-700 mb-3'>
                        Delivery Location *
                      </label>
                      <select
                        name='location'
                        value={formData.location}
                        onChange={handleInputChange}
                        className={`w-full p-4 border-2 rounded-2xl text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                          errors.location ? 'border-red-300' : 'border-gray-300'
                        }`}
                      >
                        <option value=''>Choose delivery location</option>
                        <option value='punta-cana-resort'>
                          Punta Cana Resort
                        </option>
                        <option value='cap-cana-resort'>Cap Cana Resort</option>
                        <option value='bavaro-beach-hotels'>
                          Bavaro Beach Hotels
                        </option>
                        <option value='hard-rock-hotel'>Hard Rock Hotel</option>
                        <option value='dreams-resort'>Dreams Resort</option>
                        <option value='iberostar-resort'>
                          Iberostar Resort
                        </option>
                        <option value='private-villa'>
                          Private Villa/Residence
                        </option>
                        <option value='other-location'>Other Location</option>
                      </select>
                      {errors.location && (
                        <p className='text-red-500 text-sm mt-2'>
                          {errors.location}
                        </p>
                      )}
                    </div>

                    {/* Special Requests */}
                    <div>
                      <label className='block text-sm font-semibold text-gray-700 mb-3'>
                        Special Requests & Instructions
                      </label>
                      <textarea
                        name='specialRequests'
                        value={formData.specialRequests}
                        onChange={handleInputChange}
                        rows={6}
                        placeholder='Any special delivery instructions, accessibility needs, additional equipment requests, or other preferences...'
                        className='w-full p-4 border-2 border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all duration-300'
                      />
                    </div>

                    {/* Service Information */}
                    <div className='bg-blue-50 p-6 rounded-2xl border border-blue-200'>
                      <h4 className='font-bold text-blue-900 mb-4 flex items-center'>
                        <Car className='w-5 h-5 mr-2' />
                        What's Included
                      </h4>
                      <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                        {[
                          'Fully charged battery',
                          'Full fuel tank (if applicable)',
                          'Free delivery & pickup',
                          '24/7 support hotline',
                          'Safety equipment included',
                          'Quick orientation session',
                        ].map((item, index) => (
                          <div
                            key={index}
                            className='flex items-center space-x-2'
                          >
                            <CheckCircle className='w-4 h-4 text-emerald-500 flex-shrink-0' />
                            <span className='text-blue-800 text-sm'>
                              {item}
                            </span>
                          </div>
                        ))}
                      </div>
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
                        <div className='text-sm text-gray-600'>Rental Date</div>
                        <div className='font-semibold'>
                          {formData.date
                            ? new Date(formData.date).toLocaleDateString()
                            : 'Not selected'}
                        </div>
                      </div>
                      <div>
                        <div className='text-sm text-gray-600'>Duration</div>
                        <div className='font-semibold'>
                          {formData.duration}{' '}
                          {formData.duration === 1 ? 'day' : 'days'}
                        </div>
                      </div>
                      <div>
                        <div className='text-sm text-gray-600'>Pickup Time</div>
                        <div className='font-semibold'>
                          {formData.startTime || 'Not selected'}
                        </div>
                      </div>
                      <div>
                        <div className='text-sm text-gray-600'>Return Time</div>
                        <div className='font-semibold'>
                          {formData.endTime || 'Flexible'}
                        </div>
                      </div>
                      <div className='col-span-2'>
                        <div className='text-sm text-gray-600'>
                          Delivery Location
                        </div>
                        <div className='font-semibold'>
                          {formData.location.replace('-', ' ') ||
                            'Not selected'}
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
                            • Driver must be 18+ with valid driver's license
                          </li>
                          <li>
                            • Golf cart will be delivered fully charged and
                            ready
                          </li>
                          <li>
                            • Follow all resort and local driving regulations
                          </li>
                          <li>• Our team will contact you within 30 minutes</li>
                          <li>
                            • Free cancellation up to 24 hours before rental
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
                        : `bg-gradient-to-r ${cart.gradient} text-white hover:shadow-lg`
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
              {/* Cart Summary */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className='bg-gray-50 p-6 rounded-2xl border border-gray-200'
              >
                <h4 className='font-bold text-gray-900 mb-4'>Your Selection</h4>
                <div className='flex items-center mb-4'>
                  <img
                    src={cart.mainImage}
                    alt={cart.name}
                    className='w-20 h-20 object-cover rounded-xl mr-4'
                  />
                  <div>
                    <h5 className='font-bold'>{cart.name}</h5>
                    <p className='text-sm text-gray-600'>
                      {cart.specifications.seats} seats •{' '}
                      {cart.specifications.type}
                    </p>
                    <div className='flex items-center mt-1'>
                      <Star className='w-4 h-4 text-amber-500 fill-current mr-1' />
                      <span className='text-sm font-semibold'>
                        {cart.rating}
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
                      Daily rate × {formData.duration}{' '}
                      {formData.duration === 1 ? 'day' : 'days'}
                    </span>
                    <span className='font-semibold'>${totalPrice}</span>
                  </div>
                  <div className='flex justify-between text-sm text-gray-500'>
                    <span>Delivery & pickup</span>
                    <span>FREE</span>
                  </div>
                  <div className='flex justify-between text-sm text-gray-500'>
                    <span>24/7 Support</span>
                    <span>Included</span>
                  </div>
                  <div className='border-t pt-3'>
                    <div className='flex justify-between text-xl font-bold'>
                      <span>Total</span>
                      <span className='text-blue-600'>${totalPrice}</span>
                    </div>
                  </div>
                </div>

                <div className='mt-4 p-4 bg-white rounded-xl'>
                  <h5 className='font-semibold text-sm mb-2'>
                    What's Included:
                  </h5>
                  <ul className='text-xs text-gray-600 space-y-1'>
                    <li>• Fully charged & ready to drive</li>
                    <li>• Complete safety equipment</li>
                    <li>• Free door-to-door service</li>
                    <li>• 24/7 emergency support</li>
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
                  Need Help?
                </h4>
                <p className='text-sm text-gray-600 mb-4'>
                  Our support team is available 24/7 for any questions
                </p>
                <div className='space-y-2 text-sm'>
                  <div className='flex items-center'>
                    <Phone className='w-4 h-4 mr-2 text-blue-600' />
                    <span>+1 (809) 555-CART</span>
                  </div>
                  <div className='flex items-center'>
                    <Mail className='w-4 h-4 mr-2 text-blue-600' />
                    <span>support@golfcartlux.com</span>
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

export default GolfCartServiceView;
