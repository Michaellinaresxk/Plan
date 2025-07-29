import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Anchor,
  Users,
  Ruler,
  Zap,
  Waves,
  Camera,
  Star,
  MapPin,
  Clock,
  Fuel,
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
} from 'lucide-react';

// Types (mantener los originales)
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

// Form Data Interface (mantener original)
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

// Custom hook para intersection observer
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

// MANTENER TUS DATOS ORIGINALES DE YATES
const YACHT_DATA: Yacht[] = [
  {
    id: 'sport-yacht-42',
    name: 'Fairline 43',
    category: 'sport',
    price: 2500,
    priceUnit: 'day',
    description:
      'The Fairline 43 yacht is one of the most popular and valued sports yachts in the yachting industry. This elegant Punta Cana charter yacht is designed for both socializing and speed, the Targa 43 yacht does both exceptionally well and has a capacity of up to 10 guests. It has a maximum speed of 30 knots and this yacht is a pleasure to drive thanks to its two powerful Volvo engines of 480 hp each. The space is cleverly designed both inside and out for entertaining and pleasure. This Fairline 43 Yacht is fully equipped and with an optimized space to offer you the comfort you require to enjoy a fascinating trip on the waters of the Caribbean Sea. On board this yacht you can take a private tour with a crew to Saona Island, Palmilla Beach or Catalina Island. On the way back you can enjoy the beautiful sunsets that the Dominican Republic has for you.',
    shortDescription: 'High-performance yacht with sleek design',
    mainImage:
      'https://res.cloudinary.com/michaelxk-com/image/upload/v1624139762/galeria/Drone_22_dedjhu.jpg',
    gallery: [
      'https://res.cloudinary.com/michaelxk-com/image/upload/v1625505556/nuestra%20flota/fairline/aiconfly_htqnwr.jpg',
      'https://res.cloudinary.com/michaelxk-com/image/upload/v1625505617/nuestra%20flota/fairline/drone_i8cbut.jpg',
      'https://res.cloudinary.com/michaelxk-com/image/upload/v1624144151/nuestra%20flota/fairline/1_vhop5t.jpg',
      'https://res.cloudinary.com/michaelxk-com/image/upload/v1624144150/nuestra%20flota/fairline/c_p0tlap.jpg',
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
      {
        icon: <Utensils className='w-5 h-5' />,
        name: 'Galley',
        description: 'Fully equipped kitchen',
      },
      {
        icon: <Droplets className='w-5 h-5' />,
        name: 'Fresh Water',
        description: 'Shower facilities',
      },
    ],
    highlights: [
      'Water sports equipment',
      'Professional crew',
      'Premium sound system',
      'Air conditioning',
    ],
    isPremium: false,
    isAvailable: true,
    rating: 4.8,
    gradient: 'from-cyan-500 to-blue-600',
  },
  {
    id: 'luxury-yacht-85',
    name: 'Aicon fly 60',
    category: 'luxury',
    price: 5500,
    priceUnit: 'day',
    description:
      'The motor yacht, Acion Fly 56 is a fine example of Italian design. It has two meticulously arranged cabins and a double room for children or guests. It also has a crew cabin, 3 bathrooms/showers, a living and dining room and a kitchen. It has air conditioning throughout the boat and its two 800Hp CAT diesel engines give it great power that will take you far to the places you have been dreaming of. Live an unforgettable experience with your partner, family or friends and discover the beauty of the Dominican Republic aboard this magnificent yacht for rent. This powerboat is available for charter at spectacular value for money.',
    shortDescription: 'Ultra-luxury yacht with premium amenities',
    mainImage:
      'https://res.cloudinary.com/michaelxk-com/image/upload/v1624143983/nuestra%20flota/aicon-fly-56/Aicon%20fly%2056.jpg',
    gallery: [
      'https://res.cloudinary.com/michaelxk-com/image/upload/v1624143983/nuestra%20flota/aicon-fly-56/Aicon%20fly%2056.jpg',
      'https://puntacanayachtrentals.com/nuestra-flota/yates/aiconfly-56.html#pid=3',
      'https://puntacanayachtrentals.com/nuestra-flota/yates/aiconfly-56.html#pid=4',
      'https://puntacanayachtrentals.com/nuestra-flota/yates/aiconfly-56.html#pid=2',
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
        icon: <Music className='w-5 h-5' />,
        name: 'Entertainment',
        description: 'Cinema system',
      },
      {
        icon: <Utensils className='w-5 h-5' />,
        name: 'Chef Service',
        description: 'Professional chef',
      },
      {
        icon: <BedDouble className='w-5 h-5' />,
        name: 'Luxury Suites',
        description: 'Master suites',
      },
    ],
    highlights: [
      'Professional chef',
      'Jacuzzi on deck',
      'Water toys included',
      'Butler service',
    ],
    isPremium: true,
    isAvailable: true,
    rating: 4.9,
    gradient: 'from-green-600 to-pink-600',
  },
  {
    id: 'mega-yacht-120',
    name: 'Sunseeker 120',
    category: 'mega',
    price: 12000,
    priceUnit: 'day',
    description:
      'The pinnacle of luxury yachting. This mega yacht offers an unmatched experience with every conceivable amenity.',
    shortDescription: 'Superyacht with ultimate luxury and space',
    mainImage:
      'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=800&h=600&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1564001443772-b8b4b5b5b5b5?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1571675019871-42a7b1c13ba5?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
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
        icon: <Music className='w-5 h-5' />,
        name: 'Theater Room',
        description: 'Private cinema',
      },
      {
        icon: <Utensils className='w-5 h-5' />,
        name: 'Michelin Chef',
        description: 'World-class dining',
      },
      {
        icon: <BedDouble className='w-5 h-5' />,
        name: 'Master Suite',
        description: 'Presidential suite',
      },
    ],
    highlights: [
      'Helipad',
      'Spa & wellness center',
      'Private beach club',
      'Submarine garage',
    ],
    isPremium: true,
    isAvailable: true,
    rating: 5.0,
    gradient: 'from-amber-500 to-orange-600',
  },
];

// Datos adicionales para las mejoras
const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah & Michael Chen',
    location: 'New York, USA',
    rating: 5,
    comment:
      "Absolutely magical experience! The crew was exceptional, and every detail was perfect. Our anniversary celebration couldn't have been more romantic.",
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
      'The Sunseeker exceeded all expectations. From the moment we stepped aboard, it was pure luxury. The crew anticipated our every need.',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    yacht: 'Sunseeker 120',
  },
  {
    id: '3',
    name: 'Isabella Martinez',
    location: 'Miami, USA',
    rating: 5,
    comment:
      'Perfect for our family vacation. The kids loved the water sports, and we adults enjoyed the sophisticated amenities. Highly recommend!',
    image:
      'https://images.unsplash.com/photo-1494790108755-2616b612b6c5?w=100&h=100&fit=crop&crop=face',
    yacht: 'Fairline 43',
  },
];

const EXPERIENCES: Experience[] = [
  {
    id: '1',
    title: 'Sunset Romance Package',
    description:
      "Experience the Caribbean's most breathtaking sunsets with champagne service and gourmet dining.",
    image:
      'https://res.cloudinary.com/michaelxk-com/image/upload/v1625505556/nuestra%20flota/fairline/aiconfly_htqnwr.jpg',
    duration: '4 hours',
    highlights: [
      'Private chef',
      'Champagne service',
      'Couples massage',
      'Photography session',
    ],
  },
  {
    id: '2',
    title: 'Island Hopping Adventure',
    description:
      'Discover hidden coves and pristine beaches across multiple Caribbean islands.',
    image:
      'https://res.cloudinary.com/michaelxk-com/image/upload/v1624139770/galeria/galeria3_fm9utt.jpg',
    duration: 'Full day',
    highlights: [
      'Multiple destinations',
      'Water sports',
      'Beach picnic',
      'Local guide',
    ],
  },
  {
    id: '3',
    title: 'Corporate Excellence',
    description:
      'Impress clients and reward your team with an unforgettable corporate experience.',
    image:
      'https://res.cloudinary.com/michaelxk-com/image/upload/v1624400431/galeria/things-to-do-on-a-boat_ainijy.jpg',
    duration: 'A lot of Fun',
    highlights: [
      'Meeting facilities',
      'Catering service',
      'Team activities',
      'Professional support',
    ],
  },
];

// Floating CTA Button
const FloatingBookingButton: React.FC<{ onClick: () => void }> = ({
  onClick,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClick}
          className='fixed bottom-8 right-8 z-40 bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300'
        >
          <div className='flex items-center space-x-2'>
            <Calendar className='w-6 h-6' />
            <span className='hidden sm:block font-medium'>Book Now</span>
          </div>
          <div className='absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse'></div>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

// Enhanced Hero Section
const VideoHeroSection: React.FC<{ onBookingClick: () => void }> = ({
  onBookingClick,
}) => {
  return (
    <div className='relative h-screen overflow-hidden'>
      {/* Video Background */}
      <div className='absolute inset-0'>
        <img
          src='https://images.pexels.com/photos/32995074/pexels-photo-32995074.jpeg?_gl=1*2ithyz*_ga*MTQzOTE0OTkxMS4xNzUzMjcxMDk0*_ga_8JE65Q40S6*czE3NTM3OTIwMDYkbzckZzEkdDE3NTM3OTIzNjkkajU5JGwwJGgw'
          alt='Luxury Yacht'
          className='w-full h-full object-cover'
        />
        <div className='absolute inset-0 bg-black/40'></div>
      </div>

      {/* Floating Elements */}
      <div className='absolute inset-0 overflow-hidden'>
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className='absolute top-20 left-10 w-4 h-4 bg-white/20 rounded-full'
        />
        <motion.div
          animate={{ y: [0, -30, 0] }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
          className='absolute top-40 right-20 w-6 h-6 bg-cyan-400/30 rounded-full'
        />
        <motion.div
          animate={{ y: [0, -25, 0] }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 4,
          }}
          className='absolute bottom-40 left-20 w-5 h-5 bg-blue-400/20 rounded-full'
        />
      </div>

      {/* Content */}
      <div className='relative z-10 h-full flex items-center justify-center text-white'>
        <div className='text-center max-w-6xl mx-auto px-4'>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className='mb-8'
          >
            <h1 className='text-6xl md:text-8xl font-light mb-6 tracking-wide'>
              Escape to
              <span className='block bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent font-bold'>
                Paradise
              </span>
            </h1>
            <p className='text-2xl md:text-3xl text-blue-100 font-light mb-8 leading-relaxed max-w-4xl mx-auto'>
              Where luxury meets the endless horizon. Create unforgettable
              memories aboard our exclusive yacht collection.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className='flex flex-col sm:flex-row items-center justify-center gap-6 mb-12'
          >
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              }}
              whileTap={{ scale: 0.95 }}
              onClick={onBookingClick}
              className='bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-12 py-5 rounded-full text-xl font-semibold shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 flex items-center space-x-3 border border-white/20'
            >
              <Calendar className='w-6 h-6' />
              <span>Reserve Your Experience</span>
            </motion.button>

            <motion.button
              whileHover={{
                scale: 1.05,
                backgroundColor: 'rgba(255,255,255,1)',
                color: '#1f2937',
              }}
              whileTap={{ scale: 0.95 }}
              className='border-2 border-white text-white px-12 py-5 rounded-full text-xl font-semibold hover:bg-white hover:text-gray-900 transition-all duration-300 flex items-center space-x-3 backdrop-blur-sm bg-white/10'
            >
              <Play className='w-6 h-6' />
              <span>Watch Experience</span>
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className='flex flex-wrap items-center justify-center gap-8 md:gap-12 text-blue-200'
          >
            <div className='flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3'>
              <Award className='w-6 h-6 text-amber-400' />
              <span className='text-lg font-medium'>5-Star Rated</span>
            </div>
            <div className='flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3'>
              <Shield className='w-6 h-6 text-green-400' />
              <span className='text-lg font-medium'>Fully Insured</span>
            </div>
            <div className='flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3'>
              <Heart className='w-6 h-6 text-red-400' />
              <span className='text-lg font-medium'>500+ Happy Clients</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className='absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white'
      >
        <div className='w-6 h-10 border-2 border-white rounded-full flex justify-center'>
          <div className='w-1 h-3 bg-white rounded-full mt-2'></div>
        </div>
      </motion.div>
    </div>
  );
};

// Experience Section
const ExperienceSection: React.FC = () => {
  const [ref, isInView] = useInView();

  return (
    <section
      ref={ref}
      className='py-24 bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden'
    >
      <div className='absolute inset-0'>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
          className='absolute -top-40 -right-40 w-80 h-80 border border-blue-200/30 rounded-full'
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          className='absolute -bottom-40 -left-40 w-96 h-96 border border-cyan-200/20 rounded-full'
        />
      </div>

      <div className='max-w-7xl mx-auto px-4 relative'>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className='text-center mb-16'
        >
          <h2 className='text-5xl md:text-6xl font-light text-gray-900 mb-6'>
            Curated{' '}
            <span className='font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent'>
              Experiences
            </span>
          </h2>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed'>
            Every journey is tailored to create moments that last a lifetime.
            Choose your perfect escape.
          </p>
        </motion.div>

        <div className='grid md:grid-cols-3 gap-8'>
          {EXPERIENCES.map((experience, index) => (
            <motion.div
              key={experience.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className='group'
            >
              <div className='relative overflow-hidden rounded-3xl bg-white shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2'>
                <div className='relative h-64 overflow-hidden'>
                  <img
                    src={experience.image}
                    alt={experience.title}
                    className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent'></div>
                  <div className='absolute bottom-4 left-4 text-white'>
                    <div className='bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium border border-white/30'>
                      <Clock className='w-4 h-4 inline mr-1' />
                      {experience.duration}
                    </div>
                  </div>

                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className='absolute top-4 right-4 text-white'
                  >
                    <Sparkles className='w-6 h-6' />
                  </motion.div>
                </div>

                {/* <div className='p-8'>
                  <h3 className='text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors'>
                    {experience.title}
                  </h3>
                  <p className='text-gray-600 mb-6 leading-relaxed'>
                    {experience.description}
                  </p>

                  <div className='space-y-3 mb-6'>
                    {experience.highlights.map((highlight, idx) => (
                      <div
                        key={idx}
                        className='flex items-center text-sm text-gray-600'
                      >
                        <CheckCircle className='w-4 h-4 text-green-500 mr-3 flex-shrink-0' />
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>

                  <motion.button
                    whileHover={{
                      scale: 1.02,
                      boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                    }}
                    whileTap={{ scale: 0.98 }}
                    className='w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2'
                  >
                    <span>Discover More</span>
                    <ArrowRight className='w-4 h-4' />
                  </motion.button>
                </div> */}
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
  const [ref, isInView] = useInView();

  return (
    <section
      ref={ref}
      className='py-24 bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-900 text-white relative overflow-hidden'
    >
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920&h=1080&fit=crop')] bg-cover bg-center opacity-10"></div>

      <div className='absolute inset-0'>
        <motion.div
          animate={{ x: [0, 100, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className='absolute top-20 left-10 w-2 h-2 bg-cyan-400 rounded-full opacity-60'
        />
        <motion.div
          animate={{ x: [0, -80, 0] }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 5,
          }}
          className='absolute bottom-20 right-20 w-3 h-3 bg-blue-400 rounded-full opacity-40'
        />
      </div>

      <div className='relative max-w-7xl mx-auto px-4'>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className='text-center mb-16'
        >
          <h2 className='text-5xl md:text-6xl font-light mb-6'>
            Guest <span className='font-bold'>Stories</span>
          </h2>
          <p className='text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed'>
            Discover why our guests choose us for their most special moments
          </p>
        </motion.div>

        <div className='grid md:grid-cols-3 gap-8'>
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className='group'
            >
              <div className='bg-white/10 backdrop-blur-sm rounded-3xl p-8 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2 border border-white/10'>
                <div className='flex items-center mb-6'>
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className='w-16 h-16 rounded-full object-cover mr-4 border-2 border-white/30'
                  />
                  <div>
                    <h4 className='text-xl font-semibold'>
                      {testimonial.name}
                    </h4>
                    <p className='text-blue-200 text-sm'>
                      {testimonial.location}
                    </p>
                    <div className='flex items-center mt-2'>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className='w-4 h-4 text-yellow-400 fill-current'
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <p className='text-blue-100 leading-relaxed mb-4 italic text-lg'>
                  "{testimonial.comment}"
                </p>

                <div className='text-sm text-blue-300 bg-white/5 rounded-lg p-3'>
                  <span className='font-medium'>Experience:</span>{' '}
                  {testimonial.yacht}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// MANTENER TU YACHT CARD ORIGINAL CON MEJORAS VISUALES
const YachtCard: React.FC<{ yacht: Yacht; onSelect: () => void }> = ({
  yacht,
  onSelect,
}) => {
  return (
    <motion.div
      whileHover={{ y: -12, scale: 1.02 }}
      className='relative overflow-hidden rounded-3xl shadow-xl bg-white border border-gray-100 group cursor-pointer transform transition-all duration-500'
      onClick={onSelect}
    >
      {/* Enhanced Image */}
      <div className='relative h-80 overflow-hidden'>
        <img
          src={yacht.mainImage}
          alt={yacht.name}
          className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
        />

        {/* Enhanced Badges */}
        <div className='absolute top-4 left-4 flex gap-2'>
          <span className='bg-black/30 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-semibold border border-white/20'>
            {yacht.specifications.length}
          </span>
        </div>

        {/* Enhanced Rating */}
        <div className='absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 flex items-center shadow-lg'>
          <Star className='w-5 h-5 text-amber-500 fill-current mr-1' />
          <span className='text-sm font-bold text-gray-900'>
            {yacht.rating}
          </span>
        </div>

        {/* Enhanced Quick Specs Overlay */}
        <div className='absolute bottom-4 left-4 right-4 bg-white/10 backdrop-blur-md rounded-2xl p-4 text-white opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0'>
          <div className='grid grid-cols-3 gap-4 text-center'>
            <div className='flex flex-col items-center'>
              <Users className='w-5 h-5 mb-2' />
              <div className='text-sm font-medium'>
                {yacht.specifications.maxGuests} guests
              </div>
            </div>
            <div className='flex flex-col items-center'>
              <BedDouble className='w-5 h-5 mb-2' />
              <div className='text-sm font-medium'>
                {yacht.specifications.cabins} cabins
              </div>
            </div>
            <div className='flex flex-col items-center'>
              <Zap className='w-5 h-5 mb-2' />
              <div className='text-sm font-medium'>
                {yacht.specifications.maxSpeed}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Content */}
      <div className='p-8'>
        <div className='flex justify-between items-start mb-4'>
          <div>
            <h3 className='text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2'>
              {yacht.name}
            </h3>
            <p className='text-gray-500 text-sm font-medium uppercase tracking-wide'>
              {yacht.category} yacht
            </p>
          </div>
          <div className='text-right'>
            <div className='text-3xl font-bold text-gray-900'>
              ${yacht.price.toLocaleString()}
            </div>
            <div className='text-sm text-gray-500'>per {yacht.priceUnit}</div>
          </div>
        </div>

        <p className='text-gray-600 mb-6 line-clamp-2 leading-relaxed'>
          {yacht.shortDescription}
        </p>

        {/* Enhanced Key Features */}
        <div className='grid grid-cols-2 gap-4 mb-6'>
          <div className='flex items-center text-sm text-gray-600 bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors'>
            <Users className='w-4 h-4 mr-3 text-blue-500' />
            <span className='font-medium'>
              Up to {yacht.specifications.maxGuests} guests
            </span>
          </div>
          <div className='flex items-center text-sm text-gray-600 bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors'>
            <Ruler className='w-4 h-4 mr-3 text-blue-500' />
            <span className='font-medium'>{yacht.specifications.length}</span>
          </div>
          <div className='flex items-center text-sm text-gray-600 bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors'>
            <BedDouble className='w-4 h-4 mr-3 text-blue-500' />
            <span className='font-medium'>
              {yacht.specifications.cabins} cabins
            </span>
          </div>
          <div className='flex items-center text-sm text-gray-600 bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors'>
            <Zap className='w-4 h-4 mr-3 text-blue-500' />
            <span className='font-medium'>{yacht.specifications.maxSpeed}</span>
          </div>
        </div>

        {/* Enhanced CTA Button */}
        <motion.button
          whileHover={{
            scale: 1.02,
            boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
          }}
          whileTap={{ scale: 0.98 }}
          className={`w-full py-4 rounded-2xl text-white font-semibold transition-all duration-300 bg-gradient-to-r ${yacht.gradient} hover:shadow-xl hover:shadow-blue-500/25 flex items-center justify-center space-x-2`}
        >
          <span>View Details & Book</span>
          <ArrowRight className='w-5 h-5' />
        </motion.button>
      </div>
    </motion.div>
  );
};

// MANTENER TU YACHT MODAL ORIGINAL
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
      <YachtBookingForm
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
      className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50'
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className='bg-white rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-y-auto'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={`relative p-8 bg-gradient-to-r ${yacht.gradient} text-white`}
        >
          <button
            onClick={onClose}
            className='absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors'
          >
            <X className='w-6 h-6' />
          </button>

          <div className='flex items-center justify-between'>
            <div>
              <h2 className='text-3xl font-bold mb-2'>{yacht.name}</h2>
              <p className='text-white/90 text-lg'>{yacht.shortDescription}</p>
            </div>
            <div className='text-right'>
              <div className='text-4xl font-bold'>
                ${yacht.price.toLocaleString()}
              </div>
              <div className='text-white/80'>per {yacht.priceUnit}</div>
            </div>
          </div>
        </div>

        <div className='p-8'>
          {/* Gallery */}
          <div className='mb-8'>
            <h3 className='text-2xl font-bold text-gray-900 mb-4'>Gallery</h3>
            <div className='relative rounded-2xl overflow-hidden'>
              <img
                src={yacht.gallery[currentImageIndex]}
                alt={`${yacht.name} - Image ${currentImageIndex + 1}`}
                className='w-full h-96 object-cover'
              />

              {/* Navigation */}
              <button
                onClick={prevImage}
                className='absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/30 hover:bg-black/50 rounded-full text-white transition-colors'
              >
                <ChevronLeft className='w-6 h-6' />
              </button>
              <button
                onClick={nextImage}
                className='absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/30 hover:bg-black/50 rounded-full text-white transition-colors'
              >
                <ChevronRight className='w-6 h-6' />
              </button>

              {/* Indicators */}
              <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2'>
                {yacht.gallery.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className='grid lg:grid-cols-2 gap-8'>
            {/* Specifications */}
            <div>
              <h3 className='text-2xl font-bold text-gray-900 mb-4'>
                Technical Specifications
              </h3>
              <div className='space-y-4'>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='bg-gray-50 p-4 rounded-xl'>
                    <div className='flex items-center mb-2'>
                      <Ruler className='w-5 h-5 text-blue-600 mr-2' />
                      <span className='font-medium'>Length</span>
                    </div>
                    <div className='text-2xl font-bold text-gray-900'>
                      {yacht.specifications.length}
                    </div>
                  </div>
                  <div className='bg-gray-50 p-4 rounded-xl'>
                    <div className='flex items-center mb-2'>
                      <Users className='w-5 h-5 text-blue-600 mr-2' />
                      <span className='font-medium'>Max Guests</span>
                    </div>
                    <div className='text-2xl font-bold text-gray-900'>
                      {yacht.specifications.maxGuests}
                    </div>
                  </div>
                  <div className='bg-gray-50 p-4 rounded-xl'>
                    <div className='flex items-center mb-2'>
                      <BedDouble className='w-5 h-5 text-blue-600 mr-2' />
                      <span className='font-medium'>Cabins</span>
                    </div>
                    <div className='text-2xl font-bold text-gray-900'>
                      {yacht.specifications.cabins}
                    </div>
                  </div>
                  <div className='bg-gray-50 p-4 rounded-xl'>
                    <div className='flex items-center mb-2'>
                      <Zap className='w-5 h-5 text-blue-600 mr-2' />
                      <span className='font-medium'>Max Speed</span>
                    </div>
                    <div className='text-2xl font-bold text-gray-900'>
                      {yacht.specifications.maxSpeed}
                    </div>
                  </div>
                </div>

                <div className='bg-gray-50 p-4 rounded-xl'>
                  <h4 className='font-medium mb-3'>Additional Details</h4>
                  <div className='grid grid-cols-2 gap-3 text-sm'>
                    <div>
                      <span className='text-gray-600'>Manufacturer:</span>{' '}
                      <span className='font-medium'>
                        {yacht.specifications.manufacturer}
                      </span>
                    </div>
                    <div>
                      <span className='text-gray-600'>Year:</span>{' '}
                      <span className='font-medium'>
                        {yacht.specifications.year}
                      </span>
                    </div>
                    <div>
                      <span className='text-gray-600'>Bathrooms:</span>{' '}
                      <span className='font-medium'>
                        {yacht.specifications.bathrooms}
                      </span>
                    </div>
                    <div>
                      <span className='text-gray-600'>Crew:</span>{' '}
                      <span className='font-medium'>
                        {yacht.specifications.crew}
                      </span>
                    </div>
                    <div>
                      <span className='text-gray-600'>Fuel Capacity:</span>{' '}
                      <span className='font-medium'>
                        {yacht.specifications.fuelCapacity}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Amenities & Highlights */}
            <div>
              <h3 className='text-2xl font-bold text-gray-900 mb-4'>
                Amenities & Features
              </h3>

              <div className='space-y-6'>
                <div>
                  <h4 className='font-medium mb-3'>Premium Amenities</h4>
                  <div className='grid gap-3'>
                    {yacht.amenities.map((amenity, index) => (
                      <div
                        key={index}
                        className='flex items-center p-3 bg-gray-50 rounded-xl'
                      >
                        <div className='text-blue-600 mr-3'>{amenity.icon}</div>
                        <div>
                          <div className='font-medium'>{amenity.name}</div>
                          <div className='text-sm text-gray-600'>
                            {amenity.description}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className='font-medium mb-3'>Highlights</h4>
                  <div className='space-y-2'>
                    {yacht.highlights.map((highlight, index) => (
                      <div key={index} className='flex items-center text-sm'>
                        <Star className='w-4 h-4 text-amber-500 mr-2' />
                        {highlight}
                      </div>
                    ))}
                  </div>
                </div>

                <div className='bg-blue-50 p-4 rounded-xl'>
                  <h4 className='font-medium text-blue-900 mb-2'>
                    Professional Service Included
                  </h4>
                  <p className='text-sm text-blue-800'>
                    Experienced captain and crew, fuel, insurance, safety
                    equipment, and all necessary permits included in the price.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className='mt-8'>
            <h3 className='text-2xl font-bold text-gray-900 mb-4'>
              About This Yacht
            </h3>
            <p className='text-gray-600 leading-relaxed'>{yacht.description}</p>
          </div>

          {/* Booking CTA */}
          <div className='mt-8 p-6 bg-gray-50 rounded-2xl'>
            <div className='flex items-center justify-between'>
              <div>
                <h4 className='text-xl font-bold text-gray-900'>
                  Ready to Book?
                </h4>
                <p className='text-gray-600'>
                  Reserve your luxury yacht experience today
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowBookingForm(true)}
                className={`px-8 py-4 rounded-xl text-white font-medium bg-gradient-to-r ${yacht.gradient} hover:shadow-lg transition-shadow`}
              >
                Book Now
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// MANTENER TU YACHT BOOKING FORM ORIGINAL
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

    // Simulate API call
    setTimeout(() => {
      alert('Booking request submitted successfully!');
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50'
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className='bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={`relative p-8 bg-gradient-to-r ${yacht.gradient} text-white`}
        >
          <button
            onClick={onClose}
            className='absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors'
          >
            <X className='w-6 h-6' />
          </button>

          <button
            onClick={onBack}
            className='absolute top-4 left-4 p-2 hover:bg-white/20 rounded-full transition-colors'
          >
            <ChevronLeft className='w-6 h-6' />
          </button>

          <div className='text-center'>
            <h2 className='text-3xl font-bold mb-2'>Book {yacht.name}</h2>
            <p className='text-white/90'>
              Reserve your luxury yacht experience
            </p>
          </div>
        </div>

        <div className='p-8'>
          <div className='grid lg:grid-cols-2 gap-8'>
            {/* Left Column - Form Fields */}
            <div className='space-y-6'>
              {/* Date & Time */}
              <div>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                  When
                </h3>
                <div className='grid gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      <Calendar className='w-4 h-4 inline mr-2' />
                      Date *
                    </label>
                    <input
                      type='date'
                      name='date'
                      value={formData.date}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 ${
                        errors.date ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.date && (
                      <p className='text-red-500 text-sm mt-1'>{errors.date}</p>
                    )}
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        <Clock className='w-4 h-4 inline mr-2' />
                        Start Time *
                      </label>
                      <input
                        type='time'
                        name='startTime'
                        value={formData.startTime}
                        onChange={handleInputChange}
                        className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 ${
                          errors.startTime
                            ? 'border-red-300'
                            : 'border-gray-300'
                        }`}
                      />
                      {errors.startTime && (
                        <p className='text-red-500 text-sm mt-1'>
                          {errors.startTime}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        End Time
                      </label>
                      <input
                        type='time'
                        name='endTime'
                        value={formData.endTime}
                        onChange={handleInputChange}
                        className='w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500'
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                  Where
                </h3>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    <MapPin className='w-4 h-4 inline mr-2' />
                    Departure Location *
                  </label>
                  <select
                    name='location'
                    value={formData.location}
                    onChange={handleInputChange}
                    className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 ${
                      errors.location ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value=''>Select departure location</option>
                    <option value='punta-cana-marina'>Punta Cana Marina</option>
                    <option value='cap-cana-marina'>Cap Cana Marina</option>
                    <option value='bavaro-beach'>Bavaro Beach</option>
                    <option value='hotel-pickup'>Hotel Pickup</option>
                  </select>
                  {errors.location && (
                    <p className='text-red-500 text-sm mt-1'>
                      {errors.location}
                    </p>
                  )}
                </div>
              </div>

              {/* Guest Count */}
              <div>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                  Guests
                </h3>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-3'>
                    <Users className='w-4 h-4 inline mr-2' />
                    Number of Guests
                  </label>
                  <div className='flex items-center justify-center max-w-xs'>
                    <button
                      type='button'
                      onClick={() => updateGuestCount(false)}
                      className='w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors'
                    >
                      -
                    </button>
                    <div className='mx-6 text-center'>
                      <div className='text-2xl font-bold'>
                        {formData.guestCount}
                      </div>
                      <div className='text-sm text-gray-600'>guests</div>
                    </div>
                    <button
                      type='button'
                      onClick={() => updateGuestCount(true)}
                      className='w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors'
                    >
                      +
                    </button>
                  </div>
                  <p className='text-sm text-gray-500 mt-2 text-center'>
                    Maximum: {yacht.specifications.maxGuests} guests
                  </p>
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                  Special Requests
                </h3>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    <MessageSquare className='w-4 h-4 inline mr-2' />
                    Additional Requirements
                  </label>
                  <textarea
                    name='specialRequests'
                    value={formData.specialRequests}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder='Special occasions, dietary requirements, water sports preferences, etc.'
                    className='w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 resize-none'
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Summary */}
            <div className='space-y-6'>
              {/* Yacht Summary */}
              <div className='bg-gray-50 p-6 rounded-2xl'>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                  Your Selection
                </h3>
                <div className='flex items-center mb-4'>
                  <img
                    src={yacht.mainImage}
                    alt={yacht.name}
                    className='w-20 h-20 object-cover rounded-xl mr-4'
                  />
                  <div>
                    <h4 className='font-semibold'>{yacht.name}</h4>
                    <p className='text-sm text-gray-600'>
                      {yacht.specifications.length} •{' '}
                      {yacht.specifications.maxGuests} guests
                    </p>
                  </div>
                </div>

                {formData.date && (
                  <div className='space-y-2 text-sm'>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>Date:</span>
                      <span className='font-medium'>
                        {new Date(formData.date).toLocaleDateString()}
                      </span>
                    </div>
                    {formData.startTime && (
                      <div className='flex justify-between'>
                        <span className='text-gray-600'>Time:</span>
                        <span className='font-medium'>
                          {formData.startTime}{' '}
                          {formData.endTime && `- ${formData.endTime}`}
                        </span>
                      </div>
                    )}
                    {formData.location && (
                      <div className='flex justify-between'>
                        <span className='text-gray-600'>Location:</span>
                        <span className='font-medium'>
                          {formData.location.replace('-', ' ')}
                        </span>
                      </div>
                    )}
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>Guests:</span>
                      <span className='font-medium'>{formData.guestCount}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Price Summary */}
              <div className='bg-blue-50 p-6 rounded-2xl'>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                  Price Summary
                </h3>
                <div className='space-y-2'>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>
                      {yacht.priceUnit === 'day'
                        ? 'Daily rate'
                        : `Hourly rate (${calculateDuration()}h)`}
                    </span>
                    <span className='font-medium'>
                      ${totalPrice.toLocaleString()}
                    </span>
                  </div>
                  <div className='border-t pt-2'>
                    <div className='flex justify-between text-lg font-bold'>
                      <span>Total</span>
                      <span>${totalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className='mt-4 p-3 bg-white rounded-xl'>
                  <h4 className='font-medium text-sm mb-2'>Included:</h4>
                  <ul className='text-xs text-gray-600 space-y-1'>
                    <li>• Professional captain & crew</li>
                    <li>• Fuel & insurance</li>
                    <li>• Safety equipment</li>
                    <li>• Basic refreshments</li>
                  </ul>
                </div>
              </div>

              {/* Important Notes */}
              <div className='bg-amber-50 p-4 rounded-xl'>
                <div className='flex items-start'>
                  <AlertCircle className='w-5 h-5 text-amber-600 mr-2 mt-0.5 flex-shrink-0' />
                  <div className='text-sm text-amber-800'>
                    <p className='font-medium mb-1'>Important Notes:</p>
                    <ul className='space-y-1'>
                      <li>• Weather conditions may affect departure</li>
                      <li>• Final confirmation within 24 hours</li>
                      <li>• Cancellation policy applies</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className='mt-8 pt-6 border-t'>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`w-full py-4 rounded-xl text-white font-medium transition-all bg-gradient-to-r ${yacht.gradient} hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center`}
            >
              {isSubmitting ? (
                <>
                  <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2'></div>
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className='w-5 h-5 mr-2' />
                  Confirm Booking - ${totalPrice.toLocaleString()}
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// COMPONENTE PRINCIPAL CON MEJORAS VISUALES
const LuxeYachtServiceView: React.FC = () => {
  const [selectedYacht, setSelectedYacht] = useState<Yacht | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'All Yachts', icon: <Anchor className='w-5 h-5' /> },
    { id: 'sport', name: 'Sport Yachts', icon: <Zap className='w-5 h-5' /> },
    { id: 'luxury', name: 'Luxury Yachts', icon: <Star className='w-5 h-5' /> },
    { id: 'mega', name: 'Mega Yachts', icon: <Waves className='w-5 h-5' /> },
  ];

  const filteredYachts =
    categoryFilter === 'all'
      ? YACHT_DATA
      : YACHT_DATA.filter((yacht) => yacht.category === categoryFilter);

  return (
    <div className='min-h-screen'>
      {/* Enhanced Hero */}
      <VideoHeroSection onBookingClick={() => {}} />

      {/* Fleet Section with your original functionality */}
      <section className='py-24 bg-white relative overflow-hidden'>
        <div className='absolute inset-0'>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 100, repeat: Infinity, ease: 'linear' }}
            className='absolute top-10 right-10 w-64 h-64 border border-blue-100 rounded-full opacity-30'
          />
        </div>

        <div className='max-w-7xl mx-auto px-4 relative'>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className='text-center mb-16'
          >
            <h2 className='text-5xl md:text-6xl font-light text-gray-900 mb-6'>
              Our{' '}
              <span className='font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent'>
                Fleet
              </span>
            </h2>
            <p className='text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed'>
              Each yacht in our collection represents the pinnacle of luxury and
              performance, carefully selected to exceed your expectations.
            </p>
          </motion.div>

          {/* Enhanced Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className='flex flex-wrap justify-center gap-4 mb-16'
          >
            {categories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCategoryFilter(category.id)}
                className={`flex items-center gap-3 px-8 py-4 rounded-full font-semibold transition-all duration-300 ${
                  categoryFilter === category.id
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-xl shadow-blue-500/25'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-blue-300 shadow-lg'
                }`}
              >
                {category.icon}
                <span>{category.name}</span>
              </motion.button>
            ))}
          </motion.div>

          {/* TU YACHT GRID ORIGINAL */}
          <motion.div
            layout
            className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10'
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
                  <YachtCard
                    yacht={yacht}
                    onSelect={() => setSelectedYacht(yacht)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Experience Section */}
      <ExperienceSection />

      {/* Contact CTA Section */}
      <section className='py-24 bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden'>
        <div className='absolute inset-0'>
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className='absolute top-20 left-10 w-6 h-6 bg-blue-300/30 rounded-full'
          />
          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 3,
            }}
            className='absolute bottom-20 right-20 w-4 h-4 bg-cyan-300/40 rounded-full'
          />
        </div>

        <div className='max-w-4xl mx-auto px-4 text-center relative'>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className='text-5xl md:text-6xl font-light text-gray-900 mb-6'>
              Ready to{' '}
              <span className='font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent'>
                Set Sail?
              </span>
            </h2>
            <p className='text-xl text-gray-600 mb-12 leading-relaxed'>
              Our luxury yacht specialists are standing by to create your
              perfect maritime experience. Contact us today for personalized
              service and exclusive offers.
            </p>

            <div className='flex flex-col sm:flex-row items-center justify-center gap-6'>
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                }}
                whileTap={{ scale: 0.95 }}
                className='bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-12 py-5 rounded-full text-xl font-semibold shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 flex items-center space-x-3'
              >
                <Calendar className='w-6 h-6' />
                <span>Book Your Experience</span>
              </motion.button>

              <motion.a
                whileHover={{
                  scale: 1.05,
                  backgroundColor: '#2563eb',
                  color: 'white',
                }}
                whileTap={{ scale: 0.95 }}
                href='tel:+1234567890'
                className='border-2 border-blue-600 text-blue-600 px-12 py-5 rounded-full text-xl font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300 flex items-center space-x-3 shadow-lg'
              >
                <Phone className='w-6 h-6' />
                <span>Call Now</span>
              </motion.a>
            </div>

            <div className='mt-12 flex items-center justify-center gap-8 text-gray-500'>
              <div className='flex items-center gap-2'>
                <Mail className='w-5 h-5' />
                <span>info@luxuryyachts.com</span>
              </div>
              <div className='flex items-center gap-2'>
                <Phone className='w-5 h-5' />
                <span>+1 (555) 123-4567</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialsSection />
      {/* Floating CTA */}
      <FloatingBookingButton onClick={() => {}} />

      {/* TUS MODALES ORIGINALES */}
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
