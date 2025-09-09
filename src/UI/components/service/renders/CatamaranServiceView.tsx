import React, { useState, useMemo, useEffect } from 'react';
import {
  MapPin,
  Clock,
  Shield,
  Star,
  Check,
  ArrowRight,
  X,
  Sparkles,
  Users,
  Anchor,
  Sun,
  Music,
  LifeBuoy,
  Calendar,
  DollarSign,
  AlertCircle,
  Camera,
  Waves,
  Play,
  Heart,
  Award,
  ChevronDown,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Twitter,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import BookingModal from '../../modal/BookingModal';

// ==================== DATA LAYER ====================
const CATAMARAN_DATA = {
  destiny: {
    id: 'destiny',
    name: 'Destiny',
    category: 'party',
    description: 'High-energy party cruise experience',
    mood: 'Energetic & Fun',
    vibe: 'Party all day on crystal waters',
    heroImage:
      'https://res.cloudinary.com/ddg92xar5/image/upload/v1756802334/4_vg6qwh.jpg',
    videoUrl:
      'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    image:
      'https://res.cloudinary.com/ddg92xar5/image/upload/v1756802334/4_vg6qwh.jpg',
    gallery: [
      'https://res.cloudinary.com/ddg92xar5/image/upload/v1756802334/1_wvnp2r.jpg',
      'https://res.cloudinary.com/ddg92xar5/image/upload/v1756802335/3_oahsqo.jpg',
      'https://res.cloudinary.com/ddg92xar5/image/upload/v1756802334/4_vg6qwh.jpg',
      'https://res.cloudinary.com/ddg92xar5/image/upload/v1756802334/2_vrbyj2.jpg',
    ],
    pricing: {
      minimumRate: 350,
      baseGroupSize: 5,
      additionalPersonRate: 25,
      currency: 'USD',
    },
    timeSlots: [
      { id: 'morning', time: '8:30 AM - 11:30 AM' },
      { id: 'midday', time: '11:30 AM - 2:30 PM' },
      { id: 'afternoon', time: '2:30 PM - 5:30 PM' },
    ],
    duration: '3 hours',
    capacity: 50,
    premium: false,
    price: 89,
    features: [
      'DJ & Sound System',
      'Dance Floor',
      'Party Games',
      'Premium Open Bar',
      'Party Snacks',
      'Water Sports',
    ],
    highlights: ['DJ music', 'Dance party', 'Water activities'],
    includes: [
      'Catamarán y gasolina',
      'Transporte privado de ida y vuelta desde su hotel o villa',
      'Open Bar Cócteles variados: vodka cranberry, gin tonic, Ron punch, Cuba libre, mojito y piña colada (elegir 4 tipos)',
      'Hielo, agua, refrescos',
      'Frutas tropicales',
      'Nachos con salsa',
      'Equipos de esnorquel',
    ],
    destinations: [
      'Piscinas Naturales (bancos de arena)',
      'Zona de esnorquel',
      'Visita el delfinario para ver a los delfines desde el exterior',
    ],
    notes: 'El cliente puede llevar su propia bebida y comida si lo desea.',
    primaryColor: 'from-purple-600 to-pink-600',
    accentColor: 'purple-500',
  },
  liberty: {
    id: 'liberty',
    name: 'Liberty',
    category: 'classic',
    description: 'Perfect introduction to Caribbean sailing',
    mood: 'Classic & Adventurous',
    vibe: 'Discover paradise with authentic Caribbean vibes',
    heroImage:
      'https://res.cloudinary.com/ddg92xar5/image/upload/v1756802312/2_je7e48.jpg',
    image:
      'https://res.cloudinary.com/ddg92xar5/image/upload/v1756802312/2_je7e48.jpg',
    gallery: [
      'https://res.cloudinary.com/ddg92xar5/image/upload/v1756802312/1_sqzbhj.jpg',
      'https://res.cloudinary.com/ddg92xar5/image/upload/v1756802312/4_v3oped.jpg',
      'https://res.cloudinary.com/ddg92xar5/image/upload/v1756802312/2_je7e48.jpg',
    ],
    pricing: {
      minimumRate: 400,
      baseGroupSize: 5,
      additionalPersonRate: 25,
      currency: 'USD',
    },
    timeSlots: [
      { id: 'morning', time: '8:30 AM - 11:30 AM' },
      { id: 'midday', time: '11:30 AM - 2:30 PM' },
      { id: 'afternoon', time: '2:30 PM - 5:30 PM' },
    ],
    duration: '3 hours',
    capacity: 40,
    premium: false,
    price: 89,
    features: [
      'Open Bar',
      'Buffet Lunch',
      'Snorkeling Equipment',
      'Professional Crew',
      'Music System',
    ],
    highlights: ['Beach stops', 'Snorkeling', 'Local cuisine'],
    includes: [
      'Catamarán y gasolina',
      'Transporte privado de ida y vuelta desde su hotel o villa',
      'Open Bar Cócteles variados: vodka cranberry, gin tonic, Ron punch, Cuba libre, mojito y piña colada (elegir 4 tipos)',
      'Hielo, agua, refrescos',
      'Frutas tropicales',
      'Nachos con salsa',
      'Equipos de esnorquel',
    ],
    destinations: [
      'Piscinas Naturales (bancos de arena)',
      'Zona de esnorkel',
      'Visita el delfinario para ver a los delfines desde el exterior',
    ],
    notes: 'El cliente puede llevar su propia bebida y comida si lo desea.',
    primaryColor: 'from-blue-600 to-cyan-600',
    accentColor: 'blue-500',
  },
  '45': {
    id: '45',
    name: '45',
    category: 'sunset',
    description: 'Romantic evening cruise for couples',
    mood: 'Romantic & Intimate',
    vibe: 'Fall in love with Caribbean sunsets',
    heroImage:
      'https://res.cloudinary.com/ddg92xar5/image/upload/v1756802373/6_r2h1ei.jpg',
    image:
      'https://res.cloudinary.com/ddg92xar5/image/upload/v1756802373/6_r2h1ei.jpg',
    gallery: [
      'https://res.cloudinary.com/ddg92xar5/image/upload/v1756802373/5_srdzk8.jpg',
      'https://res.cloudinary.com/ddg92xar5/image/upload/v1756802372/4_onfvkv.jpg',
      'https://res.cloudinary.com/ddg92xar5/image/upload/v1756802371/3_wwn9g3.jpg',
      'https://res.cloudinary.com/ddg92xar5/image/upload/v1756802371/2_d9a9ye.jpg',
    ],
    pricing: {
      minimumRate: 400,
      baseGroupSize: 5,
      additionalPersonRate: 25,
      currency: 'USD',
    },
    timeSlots: [
      { id: 'morning', time: '8:30 AM - 11:30 AM' },
      { id: 'midday', time: '11:30 AM - 2:30 PM' },
      { id: 'afternoon', time: '2:30 PM - 5:30 PM' },
    ],
    duration: '3 hours',
    capacity: 20,
    premium: true,
    price: 159,
    features: [
      'Champagne Service',
      'Romantic Dinner',
      'Live Music',
      'Sunset Views',
      'Couples Massage',
      'Photography',
    ],
    highlights: ['Romantic ambiance', 'Sunset views', 'Couples experience'],
    includes: [
      'Catamarán y gasolina',
      'Transporte privado de ida y vuelta desde su hotel o villa',
      'Open Bar Cócteles variados: vodka cranberry, gin tonic, Ron punch, Cuba libre, mojito y piña colada (elegir 4 tipos)',
      'Hielo, agua, refrescos',
      'Frutas tropicales',
      'Nachos con salsa',
      'Equipos de esnorkel',
    ],
    destinations: [
      'Piscinas Naturales (bancos de arena)',
      'Zona de esnorkel',
      'Visita el delfinario para ver a los delfines desde el exterior',
    ],
    notes: 'El cliente puede llevar su propia bebida y comida si lo desea.',
    primaryColor: 'from-orange-600 to-red-600',
    accentColor: 'orange-500',
  },
  trinity: {
    id: 'trinity',
    name: 'Trinity',
    category: 'premium',
    description: 'Luxury sailing with premium amenities',
    mood: 'Luxury & Exclusive',
    vibe: 'Experience the ultimate Caribbean luxury',
    heroImage:
      'https://res.cloudinary.com/ddg92xar5/image/upload/v1756802359/7_vmobhk.jpg',
    image:
      'https://res.cloudinary.com/ddg92xar5/image/upload/v1756802359/7_vmobhk.jpg',
    gallery: [
      'https://res.cloudinary.com/ddg92xar5/image/upload/v1756802356/3_syxzqo.jpg',
      'https://res.cloudinary.com/ddg92xar5/image/upload/v1756802356/1_wshnpg.jpg',
      'https://res.cloudinary.com/ddg92xar5/image/upload/v1756802357/2_axcixv.jpg',
      'https://res.cloudinary.com/ddg92xar5/image/upload/v1756802358/5_jmqruo.jpg',
    ],
    pricing: {
      minimumRate: 600,
      baseGroupSize: 15,
      additionalPersonRate: 35,
      currency: 'USD',
    },
    timeSlots: [
      { id: 'morning', time: '8:30 AM - 11:30 AM' },
      { id: 'midday', time: '11:30 AM - 2:30 PM' },
      { id: 'afternoon', time: '2:30 PM - 5:30 PM' },
    ],
    duration: '3 hours',
    capacity: 30,
    premium: true,
    price: 129,
    features: [
      'Premium Bar',
      'Gourmet Buffet',
      'Water Slide',
      'VIP Service',
      'Photo Package',
      'Floating Mats',
    ],
    highlights: ['Water slide', 'Premium drinks', 'VIP treatment'],
    includes: [
      'Catamarán y gasolina',
      'Transporte privado de ida y vuelta desde su hotel o villa',
      'Open Bar Cócteles variados: vodka cranberry, gin tonic, Ron punch, Cuba libre, mojito y piña colada (elegir 4 tipos)',
      'Hielo, agua, refrescos',
      'Frutas tropicales',
      'Nachos con salsa',
      'Equipos de esnorkel',
    ],
    destinations: [
      'Piscinas Naturales (bancos de arena)',
      'Zona de esnorkel',
      'Visita el delfinario para ver a los delfines desde el exterior',
    ],
    notes: 'El cliente puede llevar su propia bebida y comida si lo desea.',
    primaryColor: 'from-amber-600 to-yellow-600',
    accentColor: 'amber-500',
  },
};

const CANCELLATION_POLICY = [
  'No Show - Non refundable',
  'Cancellation with less than 48 hours of notification - No refund',
  'Cancellation notified 48 hours before the pick-up time - 50% refund',
  'Cancellation notified 72 hours before the pick-up time - 100% refund',
];

const WEATHER_POLICY =
  'In case of bad weather and the excursion cannot be done, we will look for an alternative date to do the excursion, in case it cannot be done on another date, 100% of the money paid will be refunded.';

// ==================== UTILITY FUNCTIONS ====================
const calculatePrice = (catamaran, groupSize) => {
  const { minimumRate, baseGroupSize, additionalPersonRate } =
    catamaran.pricing;
  if (groupSize <= baseGroupSize) {
    return minimumRate;
  }
  const additionalPeople = groupSize - baseGroupSize;
  return minimumRate + additionalPeople * additionalPersonRate;
};

// ==================== IMMERSIVE HERO SECTION ====================
const ImmersiveHero = ({ selectedCatamaran, onCatamaranSelect }) => {
  const [currentCatamaranIndex, setCurrentCatamaranIndex] = useState(0);
  const catamarans = Object.values(CATAMARAN_DATA);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCatamaranIndex((prev) => (prev + 1) % catamarans.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [catamarans.length]);

  const currentCatamaran =
    selectedCatamaran || catamarans[currentCatamaranIndex];

  return (
    <div className='relative h-screen overflow-hidden'>
      {/* Background with Ken Burns Effect */}
      <AnimatePresence mode='wait'>
        <motion.div
          key={currentCatamaran.id}
          className='absolute inset-0'
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        >
          <div className='absolute inset-0 overflow-hidden'>
            <img
              src={currentCatamaran.heroImage}
              alt={currentCatamaran.name}
              className='w-full h-full object-cover scale-110'
            />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Dynamic Gradient Based on Catamaran */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${currentCatamaran.primaryColor} opacity-70`}
        animate={{ opacity: [0.6, 0.8, 0.6] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/40' />

      {/* Floating Particles */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className='absolute w-2 h-2 bg-white/20 rounded-full'
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, -100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className='absolute inset-0 flex items-center justify-center z-10'>
        <div className='text-center text-white max-w-6xl px-8'>
          <AnimatePresence mode='wait'>
            <motion.div
              key={currentCatamaran.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.8 }}
            >
              <motion.h1
                className='text-7xl md:text-9xl font-black mb-6 leading-none'
                style={{
                  background: `linear-gradient(135deg, white, #e0f2fe, white)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {currentCatamaran.name}
              </motion.h1>

              <motion.p
                className='text-2xl md:text-4xl mb-4 font-light opacity-90'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {currentCatamaran.mood}
              </motion.p>

              <motion.p
                className='text-lg md:text-xl mb-8 max-w-3xl mx-auto opacity-80'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {currentCatamaran.vibe}
              </motion.p>

              <motion.div
                className='flex flex-wrap justify-center gap-4 mb-12'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                {currentCatamaran.highlights.map((highlight, index) => (
                  <span
                    key={index}
                    className='px-6 py-3 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-sm font-medium'
                  >
                    {highlight}
                  </span>
                ))}
              </motion.div>

              <motion.button
                className='group bg-white text-gray-900 px-12 py-6 rounded-full text-xl font-bold shadow-2xl hover:shadow-white/25 transition-all duration-300'
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onCatamaranSelect(currentCatamaran)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <span className='flex items-center gap-3'>
                  Start Your Adventure
                  <ArrowRight className='w-6 h-6 group-hover:translate-x-2 transition-transform' />
                </span>
              </motion.button>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Catamaran Selector */}
      <div className='absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4'>
        {catamarans.map((catamaran, index) => (
          <motion.button
            key={catamaran.id}
            className={`w-16 h-16 rounded-full border-2 overflow-hidden transition-all duration-300 ${
              index === currentCatamaranIndex
                ? 'border-white scale-110'
                : 'border-white/50 hover:border-white/80'
            }`}
            onClick={() => {
              setCurrentCatamaranIndex(index);
              onCatamaranSelect(catamaran);
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <img
              src={catamaran.image}
              alt={catamaran.name}
              className='w-full h-full object-cover'
            />
          </motion.button>
        ))}
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className='absolute bottom-8 right-8 text-white/70'
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown className='w-8 h-8' />
      </motion.div>
    </div>
  );
};

// ==================== IMMERSIVE EXPERIENCE SHOWCASE ====================
const ExperienceShowcase = ({ catamaran }) => {
  const [activeExperience, setActiveExperience] = useState(0);

  const experiences = [
    {
      title: 'Crystal Waters',
      description: 'Sail through the most pristine Caribbean waters',
      image: catamaran.gallery[0],
      icon: Waves,
    },
    {
      title: 'Adventure Awaits',
      description: 'Snorkel, swim, and explore hidden coves',
      image: catamaran.gallery[1] || catamaran.gallery[0],
      icon: Camera,
    },
    {
      title: 'Pure Paradise',
      description: 'Create memories that last a lifetime',
      image: catamaran.gallery[2] || catamaran.gallery[0],
      icon: Heart,
    },
  ];

  return (
    <section className='relative py-32 overflow-hidden'>
      <div className='absolute inset-0 bg-gradient-to-br from-slate-900 to-gray-900' />

      {/* Background Pattern */}
      <div className='absolute inset-0 opacity-10'>
        <div
          className='absolute inset-0'
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className='relative max-w-7xl mx-auto px-8'>
        <motion.div
          className='text-center mb-20'
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className='text-6xl md:text-7xl font-black text-white mb-6'>
            Your{' '}
            <span
              className={`text-transparent bg-clip-text bg-gradient-to-r ${catamaran.primaryColor}`}
            >
              {catamaran.name}
            </span>{' '}
            Experience
          </h2>
          <p className='text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed'>
            Every moment aboard {catamaran.name} is designed to create
            unforgettable memories in Caribbean paradise.
          </p>
        </motion.div>

        <div className='grid lg:grid-cols-2 gap-16 items-center'>
          {/* Experience Content */}
          <div className='space-y-8'>
            {experiences.map((experience, index) => (
              <motion.div
                key={index}
                className={`cursor-pointer transition-all duration-500 ${
                  activeExperience === index
                    ? 'opacity-100'
                    : 'opacity-40 hover:opacity-70'
                }`}
                onClick={() => setActiveExperience(index)}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{
                  opacity: activeExperience === index ? 1 : 0.4,
                  x: 0,
                }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className='flex items-center gap-6 p-6 rounded-2xl hover:bg-white/5 transition-colors'>
                  <div
                    className={`p-4 rounded-xl bg-gradient-to-r ${catamaran.primaryColor}`}
                  >
                    <experience.icon className='w-8 h-8 text-white' />
                  </div>
                  <div>
                    <h3 className='text-2xl font-bold text-white mb-2'>
                      {experience.title}
                    </h3>
                    <p className='text-gray-300 text-lg'>
                      {experience.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Experience Image */}
          <div className='relative'>
            <AnimatePresence mode='wait'>
              <motion.div
                key={activeExperience}
                className='relative rounded-3xl overflow-hidden shadow-2xl'
                initial={{ opacity: 0, scale: 0.9, rotateY: 90 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 1.1, rotateY: -90 }}
                transition={{ duration: 0.6 }}
              >
                <img
                  src={experiences[activeExperience].image}
                  alt={experiences[activeExperience].title}
                  className='w-full h-96 object-cover'
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t from-black/50 to-transparent`}
                />
                <div className='absolute bottom-6 left-6'>
                  <h4 className='text-white text-xl font-bold'>
                    {experiences[activeExperience].title}
                  </h4>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

// ==================== ENHANCED TOUCH GALLERY ====================
const TouchGallery = ({ images, currentIndex, onIndexChange }) => {
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      onIndexChange((currentIndex + 1) % images.length);
    }
    if (isRightSwipe) {
      onIndexChange(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
    }
  };

  return (
    <div className='relative group'>
      <div
        className='relative h-96 overflow-hidden rounded-3xl cursor-pointer shadow-2xl'
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onClick={() => onIndexChange((currentIndex + 1) % images.length)}
      >
        <AnimatePresence mode='wait'>
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt={`Gallery ${currentIndex + 1}`}
            className='w-full h-full object-cover'
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
          />
        </AnimatePresence>

        {/* Navigation Dots */}
        <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2'>
          {images.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-white w-8'
                  : 'bg-white/50 hover:bg-white/80'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                onIndexChange(index);
              }}
            />
          ))}
        </div>

        {/* Touch Indicator */}
        <div className='absolute top-4 left-4 bg-black/30 backdrop-blur-md text-white px-3 py-1 rounded-full text-sm opacity-0 group-hover:opacity-100 transition-opacity'>
          Tap or swipe
        </div>
      </div>
    </div>
  );
};

// ==================== PRICING CALCULATOR ====================
const PricingCalculator = ({ catamaran, groupSize, onGroupSizeChange }) => {
  const price = calculatePrice(catamaran, groupSize);

  return (
    <motion.div
      className={`relative overflow-hidden bg-gradient-to-br ${catamaran.primaryColor} rounded-3xl p-8 text-white shadow-2xl`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className='absolute inset-0 bg-white/10 backdrop-blur-sm' />
      <div className='relative'>
        <h4 className='text-2xl font-bold mb-6 flex items-center'>
          <DollarSign className='w-7 h-7 mr-3' />
          Calculate Your Price
        </h4>

        <div className='space-y-6'>
          <div className='flex items-center justify-between'>
            <span className='text-lg font-medium'>Group Size:</span>
            <div className='flex items-center gap-4'>
              <button
                onClick={() => onGroupSizeChange(Math.max(1, groupSize - 1))}
                className='w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center font-bold text-xl transition-colors'
              >
                -
              </button>
              <span className='text-2xl font-bold w-16 text-center'>
                {groupSize}
              </span>
              <button
                onClick={() => onGroupSizeChange(groupSize + 1)}
                className='w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center font-bold text-xl transition-colors'
              >
                +
              </button>
            </div>
          </div>

          <div className='border-t border-white/20 pt-6'>
            <div className='text-center'>
              <div className='text-sm opacity-80 mb-2'>Total Price</div>
              <motion.div
                className='text-5xl font-black'
                key={price}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                ${price}
              </motion.div>
              <div className='text-sm opacity-80'>
                USD for {groupSize} people
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ==================== CATAMARAN DETAILS MODAL ====================
const CatamaranDetailsModal = ({ catamaran, isOpen, onClose, onBook }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [groupSize, setGroupSize] = useState(2);

  if (!isOpen || !catamaran) return null;

  return (
    <AnimatePresence>
      <div className='fixed inset-0 z-50'>
        <motion.div
          className='absolute inset-0 bg-black/80 backdrop-blur-sm'
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        <motion.div
          className='absolute right-0 top-0 h-full w-full max-w-4xl bg-white shadow-2xl overflow-y-auto'
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        >
          {/* Header */}
          <div
            className={`sticky top-0 bg-gradient-to-r ${catamaran.primaryColor} text-white p-8 z-10`}
          >
            <div className='flex justify-between items-start'>
              <div>
                <h2 className='text-4xl font-black mb-2'>{catamaran.name}</h2>
                <p className='text-xl opacity-90'>{catamaran.description}</p>
              </div>
              <button
                onClick={onClose}
                className='p-3 hover:bg-white/20 rounded-full transition-colors'
              >
                <X className='w-8 h-8' />
              </button>
            </div>
          </div>

          <div className='p-8 space-y-12'>
            {/* Gallery */}
            <section>
              <h3 className='text-3xl font-bold mb-6'>Experience Gallery</h3>
              <TouchGallery
                images={catamaran.gallery}
                currentIndex={currentImageIndex}
                onIndexChange={setCurrentImageIndex}
              />
            </section>

            {/* Pricing */}
            <section>
              <PricingCalculator
                catamaran={catamaran}
                groupSize={groupSize}
                onGroupSizeChange={setGroupSize}
              />
            </section>

            {/* Features Grid */}
            <section>
              <h3 className='text-3xl font-bold mb-6'>What's Included</h3>
              <div className='grid md:grid-cols-2 gap-4'>
                {catamaran.includes.map((item, index) => (
                  <div
                    key={index}
                    className='flex items-center gap-3 p-4 bg-gray-50 rounded-xl'
                  >
                    <Check className='w-5 h-5 text-green-500 flex-shrink-0' />
                    <span className='text-gray-700'>{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Time Slots */}
            <section>
              <h3 className='text-3xl font-bold mb-6'>Available Times</h3>
              <div className='grid gap-4'>
                {catamaran.timeSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className='flex justify-between items-center p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer'
                  >
                    <span className='text-lg font-semibold'>{slot.time}</span>
                    <span className='text-gray-600'>{catamaran.duration}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className='sticky bottom-0 bg-white border-t p-8'>
            <button
              onClick={() => onBook(catamaran, groupSize)}
              className={`w-full bg-gradient-to-r ${catamaran.primaryColor} text-white py-6 rounded-2xl text-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-3`}
            >
              <Calendar className='w-6 h-6' />
              Book {catamaran.name} - ${calculatePrice(catamaran, groupSize)}{' '}
              USD
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// ==================== CATAMARAN SELECTION GRID ====================
const CatamaranSelection = ({ onCatamaranViewDetails }) => {
  return (
    <section className='py-24 px-8'>
      <div className='max-w-7xl mx-auto'>
        <motion.div
          className='text-center mb-16'
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className='text-5xl md:text-6xl font-black text-gray-900 mb-6'>
            Choose Your{' '}
            <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600'>
              Adventure
            </span>
          </h2>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
            Four unique experiences, each designed to create unforgettable
            Caribbean memories.
          </p>
        </motion.div>

        <div
          className='grid md:grid-cols-2 gap-8'
          data-section='catamaran-selection'
        >
          {Object.values(CATAMARAN_DATA).map((catamaran, index) => (
            <motion.div
              key={catamaran.id}
              className='group relative overflow-hidden rounded-3xl cursor-pointer shadow-2xl hover:shadow-3xl transition-all duration-700'
              onClick={() => onCatamaranViewDetails(catamaran)}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <div className='relative h-80 overflow-hidden'>
                <img
                  src={catamaran.image}
                  alt={catamaran.name}
                  className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${catamaran.primaryColor} opacity-60 group-hover:opacity-40 transition-opacity`}
                />

                {catamaran.premium && (
                  <div className='absolute top-6 right-6 bg-white text-gray-900 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2'>
                    <Award className='w-4 h-4' />
                    Premium
                  </div>
                )}
              </div>

              <div className='absolute inset-0 flex flex-col justify-end p-8 text-white'>
                <h3 className='text-4xl font-black mb-2'>{catamaran.name}</h3>
                <p className='text-lg mb-4 opacity-90'>{catamaran.mood}</p>
                <div className='flex justify-between items-end'>
                  <span className='text-3xl font-bold'>
                    ${catamaran.price}
                    <span className='text-lg opacity-80'>/person</span>
                  </span>
                  <ArrowRight className='w-6 h-6 transform group-hover:translate-x-2 transition-transform' />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ==================== FEATURES COMPARISON ====================
const FeaturesComparison = () => {
  const features = [
    {
      name: 'Open Bar',
      liberty: true,
      trinity: true,
      '45': true,
      destiny: true,
    },
    {
      name: 'Food Service',
      liberty: 'Buffet',
      trinity: 'Gourmet',
      '45': 'Dinner',
      destiny: 'Snacks',
    },
    {
      name: 'Water Slide',
      liberty: false,
      trinity: true,
      '45': false,
      destiny: true,
    },
    {
      name: 'Live Music',
      liberty: false,
      trinity: false,
      '45': true,
      destiny: 'DJ',
    },
    {
      name: 'Dance Floor',
      liberty: false,
      trinity: false,
      '45': false,
      destiny: true,
    },
    {
      name: 'Photography',
      liberty: false,
      trinity: true,
      '45': true,
      destiny: false,
    },
  ];

  return (
    <section className='py-24 bg-gray-50'>
      <div className='max-w-6xl mx-auto px-8'>
        <motion.div
          className='text-center mb-16'
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className='text-5xl font-black text-gray-900 mb-6'>
            Compare{' '}
            <span className='text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600'>
              Experiences
            </span>
          </h2>
        </motion.div>

        <motion.div
          className='overflow-hidden rounded-3xl shadow-2xl'
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          viewport={{ once: true }}
        >
          <table className='w-full bg-white'>
            <thead className='bg-gradient-to-r from-gray-900 to-gray-800 text-white'>
              <tr>
                <th className='px-8 py-6 text-left text-lg font-bold'>
                  Features
                </th>
                <th className='px-8 py-6 text-center text-lg font-bold'>
                  Liberty
                </th>
                <th className='px-8 py-6 text-center text-lg font-bold'>
                  Destiny
                </th>
                <th className='px-8 py-6 text-center text-lg font-bold'>45</th>
                <th className='px-8 py-6 text-center text-lg font-bold'>
                  Trinity
                </th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, index) => (
                <tr
                  key={feature.name}
                  className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                >
                  <td className='px-8 py-6 font-semibold text-gray-900'>
                    {feature.name}
                  </td>
                  {['liberty', 'destiny', '45', 'trinity'].map((catamaran) => (
                    <td key={catamaran} className='px-8 py-6 text-center'>
                      {typeof feature[catamaran] === 'boolean' ? (
                        feature[catamaran] ? (
                          <Check className='w-6 h-6 text-green-500 mx-auto' />
                        ) : (
                          <X className='w-6 h-6 text-red-500 mx-auto' />
                        )
                      ) : (
                        <span className='px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold'>
                          {feature[catamaran]}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  );
};

// ==================== GALLERY SECTION ====================
const GallerySection = () => {
  const images = [
    {
      src: 'https://res.cloudinary.com/ddg92xar5/image/upload/v1756802356/3_syxzqo.jpg',
      title: 'Crystal Waters',
    },
    {
      src: 'https://res.cloudinary.com/ddg92xar5/image/upload/v1756802334/1_wvnp2r.jpg',
      title: 'Snorkel Adventure',
    },
    {
      src: 'https://res.cloudinary.com/ddg92xar5/image/upload/v1756802334/2_vrbyj2.jpg',
      title: 'Water Slide Fun',
    },
    {
      src: 'https://res.cloudinary.com/ddg92xar5/image/upload/v1756802312/3_cz2ios.jpg',
      title: 'Sunset Views',
    },
  ];

  return (
    <section className='py-24 bg-gray-900'>
      <div className='max-w-7xl mx-auto px-8'>
        <motion.div
          className='text-center mb-16'
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className='text-5xl font-black text-white mb-6'>
            Experience{' '}
            <span className='text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400'>
              Paradise
            </span>
          </h2>
        </motion.div>

        <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {images.map((image, index) => (
            <motion.div
              key={index}
              className='group relative overflow-hidden rounded-2xl aspect-square cursor-pointer'
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
            >
              <img
                src={image.src}
                alt={image.title}
                className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity' />
              <div className='absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity'>
                <h3 className='text-lg font-bold'>{image.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ==================== REVIEWS SECTION ====================
const ReviewsSection = () => {
  const reviews = [
    {
      name: 'Maria González',
      rating: 5,
      text: 'The premium catamaran was incredible! The water slide and gourmet food made it unforgettable.',
      date: '2 days ago',
      experience: 'Premium Experience',
    },
    {
      name: 'James Wilson',
      rating: 5,
      text: 'Perfect sunset cruise for our anniversary. The romantic dinner and live music were magical.',
      date: '1 week ago',
      experience: 'Sunset Romance',
    },
    {
      name: 'Sophie Martin',
      rating: 5,
      text: 'The party catamaran was amazing! Great DJ, dancing, and the best open bar in Punta Cana.',
      date: '2 weeks ago',
      experience: 'Party Catamaran',
    },
  ];

  return (
    <section className='py-24 px-8 bg-white'>
      <div className='max-w-6xl mx-auto'>
        <motion.div
          className='text-center mb-16'
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className='text-5xl font-black text-gray-900 mb-6'>
            Guest{' '}
            <span className='text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600'>
              Stories
            </span>
          </h2>
          <div className='flex justify-center items-center gap-2 mb-4'>
            {[...Array(5)].map((_, i) => (
              <Star key={i} className='w-6 h-6 fill-amber-400 text-amber-400' />
            ))}
            <span className='ml-3 text-xl text-gray-600 font-semibold'>
              4.9 from 2,500+ adventures
            </span>
          </div>
        </motion.div>

        <div className='grid md:grid-cols-3 gap-8'>
          {reviews.map((review, idx) => (
            <motion.div
              key={idx}
              className='bg-gray-50 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow'
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className='flex gap-1 mb-4'>
                {[...Array(review.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className='w-5 h-5 fill-amber-400 text-amber-400'
                  />
                ))}
              </div>
              <p className='text-gray-700 mb-6 text-lg leading-relaxed'>
                "{review.text}"
              </p>
              <div className='flex justify-between items-center'>
                <div>
                  <p className='font-bold text-gray-900'>{review.name}</p>
                  <p className='text-cyan-600 text-sm font-semibold'>
                    {review.experience}
                  </p>
                </div>
                <span className='text-gray-500 text-sm'>{review.date}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ==================== MAIN COMPONENT ====================
const CatamaranServiceView = () => {
  const [selectedCatamaran, setSelectedCatamaran] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [heroSelectedCatamaran, setHeroSelectedCatamaran] = useState(null);

  const createServiceFromCatamaran = (catamaran) => ({
    id: `catamaran-${catamaran.id}`,
    name: `Catamaran ${catamaran.name}`,
    type: 'CATAMARAN_CRUISE',
    description: catamaran.description,
    duration: catamaran.duration,
    price: catamaran.price,
    included: catamaran.includes,
    packageType: catamaran.premium ? 'premium' : 'standard',
    catamaranType: catamaran.id,
    maxParticipants: catamaran.capacity,
    catamaranSpecifics: {
      minimumRate: catamaran.pricing.minimumRate,
      baseGroupSize: catamaran.pricing.baseGroupSize,
      additionalPersonRate: catamaran.pricing.additionalPersonRate,
      timeSlots: catamaran.timeSlots,
      destinations: catamaran.destinations,
      gallery: catamaran.gallery,
      notes: catamaran.notes,
      realPricing: catamaran.pricing,
    },
  });

  const service = selectedCatamaran
    ? createServiceFromCatamaran(selectedCatamaran)
    : null;

  const handleBookingConfirm = (service, dates, guests) => {
    setIsModalOpen(false);
    console.log('Booking confirmed:', { service, dates, guests });
  };

  const handleCatamaranViewDetails = (catamaran) => {
    setSelectedCatamaran(catamaran);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsModalOpen(false);
    setSelectedCatamaran(null);
  };

  const handleBookFromDetails = (catamaran, groupSize) => {
    // Ensure the catamaran object has all required properties for CatamaranForm
    const enrichedCatamaran = {
      ...catamaran,
      // Ensure pricing always exists
      pricing: catamaran.pricing || {
        minimumRate: catamaran.price * 4, // Fallback based on display price
        baseGroupSize: 5,
        additionalPersonRate: catamaran.price,
        currency: 'USD',
      },
      // Ensure other required properties exist
      includes: catamaran.includes || [],
      destinations: catamaran.destinations || [],
      features: catamaran.features || [],
      highlights: catamaran.highlights || [],
      timeSlots: catamaran.timeSlots || [
        { id: 'morning', time: '8:30 AM - 11:30 AM' },
        { id: 'midday', time: '11:30 AM - 2:30 PM' },
        { id: 'afternoon', time: '2:30 PM - 5:30 PM' },
      ],
      duration: catamaran.duration || '3 hours',
      notes: catamaran.notes || '',
    };

    setSelectedCatamaran(enrichedCatamaran);
    setIsDetailsModalOpen(false);
    setIsModalOpen(true);
  };

  const handleHeroCatamaranSelect = (catamaran) => {
    setHeroSelectedCatamaran(catamaran);
    handleCatamaranViewDetails(catamaran);
  };

  return (
    <div className='min-h-screen bg-white'>
      {/* Immersive Hero */}
      <ImmersiveHero
        selectedCatamaran={heroSelectedCatamaran}
        onCatamaranSelect={handleHeroCatamaranSelect}
      />

      {/* Experience Showcase */}
      {heroSelectedCatamaran && (
        <ExperienceShowcase catamaran={heroSelectedCatamaran} />
      )}

      {/* Catamaran Selection */}
      <CatamaranSelection onCatamaranViewDetails={handleCatamaranViewDetails} />

      {/* Features Comparison */}
      <FeaturesComparison />

      {/* Gallery */}
      <GallerySection />

      {/* Reviews */}
      <ReviewsSection />

      {/* CTA Section */}
      <section className='relative py-32 overflow-hidden'>
        <div className='absolute inset-0'>
          <img
            src='https://images.pexels.com/photos/4784342/pexels-photo-4784342.jpeg'
            alt='Caribbean Adventure'
            className='w-full h-full object-cover'
          />
          <div className='absolute inset-0 bg-gradient-to-r from-blue-900/90 to-cyan-900/90' />
        </div>

        <div className='relative text-center text-white px-8'>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className='text-5xl md:text-6xl font-black mb-8'>
              Ready for Your <span className='text-cyan-300'>Adventure?</span>
            </h2>
            <p className='text-xl mb-12 max-w-3xl mx-auto'>
              Book your perfect catamaran experience today and create memories
              that will last a lifetime.
            </p>
            <button
              onClick={() => {
                document
                  .querySelector('[data-section="catamaran-selection"]')
                  .scrollIntoView({ behavior: 'smooth' });
              }}
              className='bg-white text-gray-900 px-12 py-6 rounded-full text-xl font-bold shadow-2xl hover:shadow-white/25 transition-all hover:scale-105'
            >
              Book Your Adventure
            </button>
          </motion.div>
        </div>
      </section>

      {/* Catamaran Details Modal */}
      <CatamaranDetailsModal
        catamaran={selectedCatamaran}
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetails}
        onBook={handleBookFromDetails}
      />

      {/* Booking Modal */}
      <AnimatePresence>
        {isModalOpen && service && selectedCatamaran && (
          <BookingModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConfirm={handleBookingConfirm}
            service={service}
            selectedCatamaran={selectedCatamaran}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CatamaranServiceView;
