import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Car,
  Users,
  Battery,
  Star,
  CheckCircle,
  Phone,
  Calendar,
  ArrowRight,
  X,
  MapPin,
  Clock,
  Shield,
  Award,
  Camera,
  ChevronLeft,
  ChevronRight,
  Zap,
  Navigation,
  Heart,
  Quote,
  AlertTriangle,
  FileText,
} from 'lucide-react';
import BookingModal from '../../modal/BookingModal';
import { BookingDate, Service } from '@/constants/formFields';
import { useBooking } from '@/context/BookingContext';

// Types
interface GolfCartOption {
  id: string;
  name: string;
  spanishName: string;
  seats: number;
  price: number;
  description: string;
  spanishDescription: string;
  image: string;
  features: string[];
  spanishFeatures: string[];
  isPopular: boolean;
  detailImages: string[];
}

const GOLF_CART_OPTIONS: GolfCartOption[] = [
  {
    id: '4-seater',
    name: '4-Seater Cart',
    spanishName: 'Carrito de 4 Plazas',
    seats: 4,
    price: 60,
    description:
      'Perfect for couples or small families. Compact and efficient for resort exploration.',
    spanishDescription:
      'Perfecto para parejas o familias pequeñas. Compacto y eficiente para explorar el resort.',
    image:
      'https://images.pexels.com/photos/9207174/pexels-photo-9207174.jpeg?_gl=1*1gvkela*_ga*MTQzOTE0OTkxMS4xNzUzMjcxMDk0*_ga_8JE65Q40S6*czE3NTQ3MjkzMzQkbzIwJGcxJHQxNzU0NzI5ODY0JGoyMSRsMCRoMA..',
    detailImages: [
      'https://images.pexels.com/photos/9207175/pexels-photo-9207175.jpeg?_gl=1*1fk3hn7*_ga*MTQzOTE0OTkxMS4xNzUzMjcxMDk0*_ga_8JE65Q40S6*czE3NTQ3MjkzMzQkbzIwJGcxJHQxNzU0NzI5OTY2JGo1OSRsMCRoMA..',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    ],
    features: [
      'Free delivery & pickup',
      '24/7 support included',
      'Quick orientation',
    ],
    spanishFeatures: [
      'Entrega y recogida gratis',
      'Soporte 24/7 incluido',
      'Orientación rápida',
    ],
    isPopular: false,
  },
  {
    id: '6-seater',
    name: '6-Seater Cart',
    spanishName: 'Carrito de 6 Plazas',
    seats: 6,
    price: 80,
    description:
      'Ideal for larger groups and families. More space and comfort for extended exploration.',
    spanishDescription:
      'Ideal para grupos grandes y familias. Más espacio y comodidad para exploración extendida.',
    image:
      'https://images.pexels.com/photos/9207175/pexels-photo-9207175.jpeg?_gl=1*1fk3hn7*_ga*MTQzOTE0OTkxMS4xNzUzMjcxMDk0*_ga_8JE65Q40S6*czE3NTQ3MjkzMzQkbzIwJGcxJHQxNzU0NzI5OTY2JGo1OSRsMCRoMA..',
    detailImages: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1551058622-5d7b4f0c6e6a?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    ],
    features: [
      'Fully charged battery',
      'Free delivery & pickup',
      '24/7 support included',
      'Safety equipment',
      'Quick orientation',
      'Extra storage space',
    ],
    spanishFeatures: [
      'Batería completamente cargada',
      'Entrega y recogida gratis',
      'Soporte 24/7 incluido',
      'Equipo de seguridad',
      'Orientación rápida',
      'Espacio extra de almacenamiento',
    ],
    isPopular: true,
  },
];

const GALLERY_IMAGES = [
  {
    id: 1,
    src: 'https://images.pexels.com/photos/9207175/pexels-photo-9207175.jpeg?_gl=1*1fk3hn7*_ga*MTQzOTE0OTkxMS4xNzUzMjcxMDk0*_ga_8JE65Q40S6*czE3NTQ3MjkzMzQkbzIwJGcxJHQxNzU0NzI5OTY2JGo1OSRsMCRoMA..',
    alt: 'Golf cart on tropical beach',
    title: 'Beach Adventures',
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1551058622-5d7b4f0c6e6a?w=1200&h=800&fit=crop',
    alt: 'Resort exploration',
    title: 'Resort Exploration',
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=800&fit=crop',
    alt: 'Family fun',
    title: 'Family Adventures',
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=1200&h=800&fit=crop',
    alt: 'Sunset rides',
    title: 'Sunset Rides',
  },
];

// Hero Section
const HeroSection = ({ onExploreClick }) => {
  const [language, setLanguage] = useState('en');

  const content = {
    en: {
      badge: 'LUXURY MOBILITY',
      title: 'Explore Paradise',
      subtitle: 'Your Way',
      description:
        "Experience the ultimate freedom with our premium golf carts. Perfect for exploring Punta Cana's beautiful resorts, beaches, and hidden gems.",
      cta: 'Explore Our Fleet',
      features: ['Free Delivery', '24/7 Support', 'Luxury Experience'],
    },
    es: {
      badge: 'MOVILIDAD DE LUJO',
      title: 'Explora el Paraíso',
      subtitle: 'A Tu Manera',
      description:
        'Experimenta la libertad total con nuestros carritos premium. Perfectos para explorar los hermosos resorts de Punta Cana, playas y joyas escondidas.',
      cta: 'Explorar Nuestra Flota',
      features: ['Entrega Gratis', 'Soporte 24/7', 'Experiencia de Lujo'],
    },
  };

  const currentContent = content[language];

  return (
    <div className='relative min-h-screen overflow-hidden bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50'>
      {/* Background Image */}
      <div className='absolute inset-0'>
        <img
          src='https://images.pexels.com/photos/9207198/pexels-photo-9207198.jpeg?_gl=1*1qg0m6r*_ga*MTQzOTE0OTkxMS4xNzUzMjcxMDk0*_ga_8JE65Q40S6*czE3NTQ3MjkzMzQkbzIwJGcxJHQxNzU0NzI5NDgxJGoyNyRsMCRoMA..'
          alt='Golf cart paradise'
          className='w-full h-full object-cover opacity-20'
        />
        <div className='absolute inset-0 bg-gradient-to-br from-teal-900/20 via-transparent to-blue-900/20' />
      </div>

      {/* Content */}
      <div className='relative z-10 flex flex-col justify-center min-h-screen px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto w-full'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className='text-center lg:text-left'
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className='inline-flex items-center bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-teal-700 mb-6 shadow-sm'
              >
                <Car className='w-4 h-4 mr-2' />
                {currentContent.badge}
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className='text-5xl lg:text-7xl font-light text-slate-800 mb-4'
              >
                {currentContent.title}
                <br />
                <span className='font-bold text-teal-600'>
                  {currentContent.subtitle}
                </span>
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className='text-lg text-slate-600 mb-8 max-w-md mx-auto lg:mx-0 leading-relaxed'
              >
                {currentContent.description}
              </motion.p>

              {/* CTA Button */}
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                onClick={onExploreClick}
                className='group bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white px-8 py-4 rounded-2xl font-medium text-lg flex items-center gap-3 mx-auto lg:mx-0 transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl'
              >
                {currentContent.cta}
                <ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform' />
              </motion.button>

              {/* Features */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className='flex flex-wrap justify-center lg:justify-start gap-6 mt-8'
              >
                {currentContent.features.map((feature, index) => (
                  <div
                    key={index}
                    className='flex items-center gap-2 text-sm text-slate-600'
                  >
                    <CheckCircle className='w-4 h-4 text-teal-500' />
                    <span>{feature}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Content - Floating Cart */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className='relative hidden lg:block'
            >
              <div className='relative'>
                <motion.div
                  animate={{
                    y: [-10, 10, -10],
                    rotate: [0, 2, 0, -2, 0],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className='bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl'
                >
                  <img
                    src='https://images.pexels.com/photos/9207198/pexels-photo-9207198.jpeg?_gl=1*1qg0m6r*_ga*MTQzOTE0OTkxMS4xNzUzMjcxMDk0*_ga_8JE65Q40S6*czE3NTQ3MjkzMzQkbzIwJGcxJHQxNzU0NzI5NDgxJGoyNyRsMCRoMA..'
                    alt='Premium golf cart'
                    className='w-full h-64 object-cover rounded-2xl'
                  />
                  <div className='mt-6'>
                    <div className='flex items-center justify-between mb-4'>
                      <h3 className='text-xl font-bold text-slate-800'>
                        Premium 6-Seater
                      </h3>
                      <div className='flex items-center gap-1 text-amber-500'>
                        <Star className='w-4 h-4 fill-current' />
                        <Star className='w-4 h-4 fill-current' />
                        <Star className='w-4 h-4 fill-current' />
                        <Star className='w-4 h-4 fill-current' />
                        <Star className='w-4 h-4 fill-current' />
                      </div>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-2xl font-bold text-teal-600'>
                        $80/night
                      </span>
                      <div className='flex items-center gap-2 text-sm text-slate-600'>
                        <Users className='w-4 h-4' />
                        <span>6 seats</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple Cart Card
const CartCard = ({ cart, onClick, language }) => {
  const displayName = language === 'es' ? cart.spanishName : cart.name;

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      className='group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer'
      onClick={onClick}
    >
      {/* Popular Badge */}
      {cart.isPopular && (
        <div className='absolute top-4 left-4 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold z-10'>
          {language === 'es' ? 'Popular' : 'Popular'}
        </div>
      )}

      {/* Image */}
      <div className='relative h-64 overflow-hidden'>
        <motion.img
          src={cart.image}
          alt={displayName}
          className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-700'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent' />

        {/* Hover Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className='absolute inset-0 bg-teal-600/20 flex items-center justify-center'
        >
          <div className='bg-white/90 backdrop-blur-sm rounded-full p-3'>
            <ArrowRight className='w-6 h-6 text-teal-600' />
          </div>
        </motion.div>
      </div>

      {/* Content */}
      <div className='p-6'>
        <h3 className='text-xl font-bold text-slate-800 mb-2 group-hover:text-teal-600 transition-colors'>
          {displayName}
        </h3>
        <div className='flex items-center justify-between'>
          <span className='text-2xl font-bold text-teal-600'>
            ${cart.price}/night
          </span>
          <div className='flex items-center gap-2 text-slate-600'>
            <Users className='w-4 h-4' />
            <span className='text-sm'>{cart.seats} seats</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// SIDEBAR COMPONENT - NEW
const CartDetailsSidebar = ({ cart, isOpen, onClose, language, onBookNow }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  if (!cart) return null;

  const displayName = language === 'es' ? cart.spanishName : cart.name;
  const displayDescription =
    language === 'es' ? cart.spanishDescription : cart.description;
  const displayFeatures =
    language === 'es' ? cart.spanishFeatures : cart.features;

  const content = {
    en: {
      features: 'Features',
      bookNow: 'Book Now',
    },
    es: {
      features: 'Características',
      bookNow: 'Reservar',
    },
  };

  const currentContent = content[language];

  // Swipe detection
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
      // Swipe left - next image
      setCurrentImageIndex((prev) => (prev + 1) % cart.detailImages.length);
    }

    if (isRightSwipe) {
      // Swipe right - previous image
      setCurrentImageIndex(
        (prev) =>
          (prev - 1 + cart.detailImages.length) % cart.detailImages.length
      );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 bg-black/50 backdrop-blur-sm z-40'
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className='fixed right-0 top-0 h-full w-full max-w-lg bg-white shadow-2xl z-50 overflow-y-auto'
          >
            {/* Header */}
            <div className='sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between'>
              <h2 className='text-2xl font-bold text-gray-900'>
                {displayName}
              </h2>
              <button
                onClick={onClose}
                className='p-2 hover:bg-gray-100 rounded-full transition-colors'
              >
                <X className='w-6 h-6' />
              </button>
            </div>

            {/* Swipeable Image Gallery */}
            <div
              className='relative h-64 overflow-hidden cursor-grab active:cursor-grabbing'
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <motion.img
                key={currentImageIndex}
                src={cart.detailImages[currentImageIndex]}
                alt={displayName}
                className='w-full h-full object-cover select-none'
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                draggable={false}
              />

              {/* Swipe Indicator */}
              <div className='absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2'>
                <span>👈 Swipe 👉</span>
              </div>

              {/* Image Counter */}
              <div className='absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-xs font-medium'>
                {currentImageIndex + 1} / {cart.detailImages.length}
              </div>

              {/* Image Indicators - Clickable */}
              <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2'>
                {cart.detailImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentImageIndex
                        ? 'bg-white shadow-lg scale-125'
                        : 'bg-white/50 hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Content */}
            <div className='p-6 space-y-6'>
              {/* Price & Info */}
              <div className='flex items-center justify-between'>
                <span className='text-3xl font-bold text-teal-600'>
                  ${cart.price}/night
                </span>
                <div className='flex items-center gap-2 text-gray-600'>
                  <Users className='w-5 h-5' />
                  <span>{cart.seats} seats</span>
                </div>
              </div>

              {/* Description */}
              <p className='text-gray-600 leading-relaxed'>
                {displayDescription}
              </p>

              {/* Features */}
              <div>
                <h3 className='font-bold text-gray-900 mb-3'>
                  {currentContent.features}
                </h3>
                <div className='space-y-2'>
                  {displayFeatures.map((feature, index) => (
                    <div key={index} className='flex items-center gap-3'>
                      <CheckCircle className='w-4 h-4 text-teal-500 flex-shrink-0' />
                      <span className='text-sm text-gray-600'>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Book Now Button */}
              <button
                onClick={onBookNow}
                className='w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white py-4 px-8 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg'
              >
                {currentContent.bookNow}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Gallery Section
const GallerySection = ({ language }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const content = {
    en: {
      title: 'Experience Paradise',
      subtitle: 'Where luxury meets adventure',
    },
    es: {
      title: 'Experimenta el Paraíso',
      subtitle: 'Donde el lujo se encuentra con la aventura',
    },
  };

  const currentContent = content[language];

  return (
    <section className='py-20 bg-gradient-to-br from-slate-50 to-teal-50'>
      <div className='max-w-7xl mx-auto px-6'>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className='text-center mb-16'
        >
          <h2 className='text-4xl lg:text-5xl font-light text-slate-800 mb-4'>
            {currentContent.title}
          </h2>
          <p className='text-xl text-slate-600'>{currentContent.subtitle}</p>
        </motion.div>

        <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6'>
          {GALLERY_IMAGES.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className='group relative cursor-pointer overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300'
              onClick={() => setSelectedImage(index)}
            >
              <div className='aspect-square overflow-hidden'>
                <img
                  src={image.src}
                  alt={image.alt}
                  className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-700'
                />
              </div>
              <div className='absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
              <div className='absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                <h3 className='font-bold text-sm md:text-base'>
                  {image.title}
                </h3>
              </div>
              <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                <div className='bg-white/20 backdrop-blur-sm rounded-full p-2 md:p-3'>
                  <Camera className='w-4 h-4 md:w-6 md:h-6 text-white' />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Gallery Modal */}
        <AnimatePresence>
          {selectedImage !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50'
              onClick={() => setSelectedImage(null)}
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className='relative max-w-4xl w-full'
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={GALLERY_IMAGES[selectedImage].src}
                  alt={GALLERY_IMAGES[selectedImage].alt}
                  className='w-full h-auto rounded-2xl'
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className='absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2 text-white hover:bg-white/30 transition-colors'
                >
                  <X className='w-6 h-6' />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

// CTA Banner
const CTABanner = ({ language, onGetStartedClick }) => {
  const content = {
    en: {
      title: 'Ready for Your Adventure?',
      subtitle: 'Book your luxury golf cart experience today',
      cta: 'Get Started',
      features: ['Free Delivery', 'Premium Service', '24/7 Support'],
    },
    es: {
      title: '¿Listo para tu Aventura?',
      subtitle: 'Reserva tu experiencia de lujo en carrito de golf hoy',
      cta: 'Comenzar',
      features: ['Entrega Gratis', 'Servicio Premium', 'Soporte 24/7'],
    },
  };

  const currentContent = content[language];

  return (
    <section className='relative py-20 overflow-hidden'>
      <div className='absolute inset-0'>
        <img
          src='https://images.pexels.com/photos/9207174/pexels-photo-9207174.jpeg?_gl=1*1gvkela*_ga*MTQzOTE0OTkxMS4xNzUzMjcxMDk0*_ga_8JE65Q40S6*czE3NTQ3MjkzMzQkbzIwJGcxJHQxNzU0NzI5ODY0JGoyMSRsMCRoMA..'
          alt='Sunset golf cart'
          className='w-full h-full object-cover'
        />
        <div className='absolute inset-0 bg-gradient-to-r from-teal-900/80 via-cyan-900/60 to-blue-900/80' />
      </div>

      <div className='relative z-10 max-w-7xl mx-auto px-6 text-center text-white'>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className='text-4xl lg:text-5xl font-light mb-6'>
            {currentContent.title}
          </h2>
          <p className='text-xl mb-8 max-w-2xl mx-auto opacity-90'>
            {currentContent.subtitle}
          </p>

          <button
            onClick={onGetStartedClick}
            className='group bg-white text-slate-800 hover:bg-slate-100 px-8 py-4 rounded-2xl font-bold text-lg flex items-center gap-3 mx-auto transition-all duration-300 hover:scale-105 shadow-xl'
          >
            {currentContent.cta}
            <ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform' />
          </button>

          <div className='flex flex-wrap justify-center gap-8 mt-12'>
            {currentContent.features.map((feature, index) => (
              <div
                key={index}
                className='flex items-center gap-2 text-white/80'
              >
                <CheckCircle className='w-5 h-5 text-cyan-300' />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// MAIN COMPONENT - UPDATED WITH SIDEBAR APPROACH
const GolfCartServiceView = () => {
  const [language, setLanguage] = useState('en');
  const [selectedCart, setSelectedCart] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // ← SIDEBAR STATE
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const { bookService } = useBooking();

  // ← DYNAMIC SERVICE OBJECT with preselected cart
  const getServiceForCart = (cart) => {
    return {
      id: 'golf-cart-rental',
      name: 'Golf Cart Rental',
      type: 'transportation',
      packageType: cart?.seats === 6 ? 'premium' : 'standard',
      description: 'Premium golf cart rental service for resort exploration',
      category: 'mobility',
      duration: 'flexible',
      // ← PASS SELECTED CART INFO TO FORM (MAKES FORM HIDE CART SELECTION)
      selectedCartInfo: cart
        ? {
            id: cart.id,
            name: cart.name,
            spanishName: cart.spanishName,
            seats: cart.seats,
            price: cart.price,
            features: cart.features,
            spanishFeatures: cart.spanishFeatures,
            description: cart.description,
            spanishDescription: cart.spanishDescription,
          }
        : null,
    };
  };

  const handleExploreClick = () => {
    const cartSection = document.getElementById('cart-selection');
    cartSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleGetStartedClick = () => {
    const cartSection = document.getElementById('cart-selection');
    cartSection?.scrollIntoView({ behavior: 'smooth' });
  };

  // ← UPDATED: Opens sidebar instead of modal
  const handleCartClick = (cart) => {
    setSelectedCart(cart);
    setIsSidebarOpen(true);
  };

  // ← NEW: Close sidebar and open booking modal with preselected cart
  const handleBookNow = () => {
    setIsSidebarOpen(false); // Close sidebar
    setIsBookingModalOpen(true); // Open booking modal
  };

  const handleBookingConfirm = (service, dates, guests) => {
    console.log('Booking confirmed:', {
      service,
      dates,
      guests,
      cart: selectedCart,
    });
    setIsBookingModalOpen(false);
    setSelectedCart(null);
  };

  const content = {
    en: {
      fleetTitle: 'Our Luxury Fleet',
      fleetSubtitle: 'Choose your perfect ride',
    },
    es: {
      fleetTitle: 'Nuestra Flota de Lujo',
      fleetSubtitle: 'Elige tu viaje perfecto',
    },
  };

  const currentContent = content[language];

  const RENTAL_REQUIREMENTS = [
    "Must be 18+ years old with a valid driver's license",
    'Basic driving experience recommended',
    'Drive responsibly and follow resort/community rules',
    'Respect local driving laws and speed limits',
    'Children must be supervised at all times while in cart',
    'Available throughout Puntacana area',
  ];

  return (
    <div className='min-h-screen bg-white'>
      {/* Hero Section */}
      <HeroSection onExploreClick={handleExploreClick} />

      {/* Cart Selection */}
      <section id='cart-selection' className='py-20 bg-white'>
        <div className='max-w-7xl mx-auto px-6'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='text-center mb-16'
          >
            <h2 className='text-4xl lg:text-5xl font-light text-slate-800 mb-4'>
              {currentContent.fleetTitle}
            </h2>
            <p className='text-xl text-slate-600'>
              {currentContent.fleetSubtitle}
            </p>
          </motion.div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto'>
            {GOLF_CART_OPTIONS.map((cart, index) => (
              <motion.div
                key={cart.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <CartCard
                  cart={cart}
                  onClick={() => handleCartClick(cart)} // ← OPENS SIDEBAR
                  language={language}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <GallerySection language={language} />

      {/* CTA Banner */}
      <CTABanner
        language={language}
        onGetStartedClick={handleGetStartedClick}
      />

      {/* Mindfulness Quote Banner */}
      <motion.div
        className='px-4 mt-10 mb-10'
        initial='hidden'
        animate='visible'
      >
        <div className='rounded-3xl p-12 text-center relative overflow-hidden'>
          <motion.div
            className='absolute '
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 2, delay: 0.5 }}
          />

          <Quote className='w-12 h-12 text-emerald-500 mx-auto mb-6' />
          <blockquote className='text-3xl md:text-4xl font-light text-gray-800 mb-6 italic leading-relaxed'>
            "Success in this game depends less on strength of body than strength
            of mind and character."
          </blockquote>
          <cite className='text-xl text-emerald-600 font-medium'>
            - Arnold Palmer
          </cite>
        </div>
      </motion.div>

      {/* Requirements List */}
      <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mt-10 mb-10 '>
        <div className='flex items-start'>
          <FileText className='w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5' />
          <div>
            <h4 className='font-medium text-blue-800 mb-2'>
              Driver Requirements
            </h4>
            <ul className='text-sm text-blue-700 space-y-1'>
              {RENTAL_REQUIREMENTS.map((requirement, index) => (
                <li key={index}>• {requirement}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className='bg-amber-50 border border-amber-200 rounded-lg p-4'>
        <div className='flex items-start'>
          <AlertTriangle className='w-5 h-5 text-amber-600 mr-3 flex-shrink-0 mt-0.5' />
          <div>
            <h4 className='font-medium text-amber-800 mb-2'>
              Important Disclaimer
            </h4>
            <p className='text-sm text-amber-700'>
              <strong>Drive at your own discretion.</strong> Please follow all
              community or resort rules and respect local driving laws. You are
              responsible for the safe operation of the vehicle during the
              rental period. Our carts are more than transportation—they're
              freedom on wheels.
            </p>
          </div>
        </div>
      </div>

      {/* SIDEBAR - SHOWS CART DETAILS */}
      <CartDetailsSidebar
        cart={selectedCart}
        isOpen={isSidebarOpen}
        onClose={() => {
          setIsSidebarOpen(false);
          setSelectedCart(null);
        }}
        language={language}
        onBookNow={handleBookNow}
      />

      {/* BOOKING MODAL - ONLY ONE MODAL NOW, WITH PRESELECTED CART */}
      {isBookingModalOpen && (
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          onConfirm={handleBookingConfirm}
          service={getServiceForCart(selectedCart)} // ← PASSES CART INFO TO FORM
        />
      )}
    </div>
  );
};

export default GolfCartServiceView;
