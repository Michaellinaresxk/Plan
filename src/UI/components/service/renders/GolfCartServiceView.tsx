import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Car,
  Users,
  Star,
  CheckCircle,
  ArrowRight,
  X,
  Camera,
  Quote,
  AlertTriangle,
  FileText,
} from 'lucide-react';
import BookingModal from '../../modal/BookingModal';
import { useBooking } from '@/context/BookingContext';
import { useTranslation } from '@/lib/i18n/client';

// Types
interface GolfCartOption {
  id: string;
  seats: number;
  price: number;
  image: string;
  detailImages: string[];
  isPopular: boolean;
}

const GOLF_CART_OPTIONS: GolfCartOption[] = [
  {
    id: '4-seater',
    seats: 4,
    price: 60,
    image:
      'https://images.pexels.com/photos/9207174/pexels-photo-9207174.jpeg?_gl=1*1gvkela*_ga*MTQzOTE0OTkxMS4xNzUzMjcxMDk0*_ga_8JE65Q40S6*czE3NTQ3MjkzMzQkbzIwJGcxJHQxNzU0NzI5ODY0JGoyMSRsMCRoMA..',
    detailImages: [
      'https://images.pexels.com/photos/9207175/pexels-photo-9207175.jpeg?_gl=1*1fk3hn7*_ga*MTQzOTE0OTkxMS4xNzUzMjcxMDk0*_ga_8JE65Q40S6*czE3NTQ3MjkzMzQkbzIwJGcxJHQxNzU0NzI5OTY2JGo1OSRsMCRoMA..',
      'https://res.cloudinary.com/ddg92xar5/image/upload/v1756102920/14_l4wro8.jpg',
    ],
    isPopular: false,
  },
  {
    id: '6-seater',
    seats: 6,
    price: 80,
    image:
      'https://res.cloudinary.com/ddg92xar5/image/upload/v1755947007/IMG_3224_he26bm.jpg',
    detailImages: [
      'https://res.cloudinary.com/ddg92xar5/image/upload/v1755947017/IMG_3227_gktf9e.jpg',
      'https://res.cloudinary.com/ddg92xar5/image/upload/v1755947007/IMG_3224_he26bm.jpg',
      'https://res.cloudinary.com/ddg92xar5/image/upload/v1756103011/IMG_3217_ep7kyr.jpg',
    ],
    isPopular: true,
  },
];

const GALLERY_IMAGES = [
  {
    id: 1,
    src: 'https://images.pexels.com/photos/9207175/pexels-photo-9207175.jpeg?_gl=1*1fk3hn7*_ga*MTQzOTE0OTkxMS4xNzUzMjcxMDk0*_ga_8JE65Q40S6*czE3NTQ3MjkzMzQkbzIwJGcxJHQxNzU0NzI5OTY2JGo1OSRsMCRoMA..',
    alt: 'Golf cart on tropical beach',
  },
  {
    id: 2,
    src: 'https://res.cloudinary.com/ddg92xar5/image/upload/v1755947017/IMG_3227_gktf9e.jpg',
    alt: 'Resort exploration',
  },
  {
    id: 3,
    src: 'https://res.cloudinary.com/ddg92xar5/image/upload/v1756103062/IMG_3212_ncjcc6.jpg',
    alt: 'Family fun',
  },
  {
    id: 4,
    src: 'https://res.cloudinary.com/ddg92xar5/image/upload/v1756102920/14_l4wro8.jpg',
    alt: 'Sunset rides',
  },
];

// Hero Section
const HeroSection = ({ onExploreClick, t }) => {
  return (
    <div className='relative min-h-screen overflow-hidden bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50'>
      <div className='absolute inset-0'>
        <img
          src='https://res.cloudinary.com/ddg92xar5/image/upload/v1756103062/IMG_3212_ncjcc6.jpg'
          alt='Golf cart paradise'
          className='w-full h-full object-cover opacity-20'
        />
        <div className='absolute inset-0 bg-gradient-to-br from-teal-900/20 via-transparent to-blue-900/20' />
      </div>

      <div className='relative z-10 flex flex-col justify-center min-h-screen px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto w-full'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className='text-center lg:text-left'
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className='inline-flex items-center bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-teal-700 mb-6 shadow-sm'
              >
                <Car className='w-4 h-4 mr-2' />
                {t('services.standard.golfCartRentalView.hero.badge')}
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className='text-5xl lg:text-7xl font-light text-slate-800 mb-4'
              >
                {t('services.standard.golfCartRentalView.hero.title')}
                <br />
                <span className='font-bold text-teal-600'>
                  {t('services.standard.golfCartRentalView.hero.subtitle')}
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className='text-lg text-slate-600 mb-8 max-w-md mx-auto lg:mx-0 leading-relaxed'
              >
                {t('services.standard.golfCartRentalView.hero.description')}
              </motion.p>

              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                onClick={onExploreClick}
                className='group bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white px-8 py-4 rounded-2xl font-medium text-lg flex items-center gap-3 mx-auto lg:mx-0 transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl'
              >
                {t('services.standard.golfCartRentalView.hero.cta')}
                <ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform' />
              </motion.button>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className='flex flex-wrap justify-center lg:justify-start gap-6 mt-8'
              >
                {[1, 2, 3].map((num) => (
                  <div
                    key={num}
                    className='flex items-center gap-2 text-sm text-slate-600'
                  >
                    <CheckCircle className='w-4 h-4 text-teal-500' />
                    <span>
                      {t(
                        `services.standard.golfCartRentalView.hero.feature${num}`
                      )}
                    </span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

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
                    src='https://res.cloudinary.com/ddg92xar5/image/upload/v1756103011/IMG_3217_ep7kyr.jpg'
                    alt='Premium golf cart'
                    className='w-full h-64 object-cover rounded-2xl'
                  />
                  <div className='mt-6'>
                    <div className='flex items-center justify-between mb-4'>
                      <h3 className='text-xl font-bold text-slate-800'>
                        {t(
                          'services.standard.golfCartRentalView.carts.6seater.name'
                        )}
                      </h3>
                      <div className='flex items-center gap-1 text-amber-500'>
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className='w-4 h-4 fill-current' />
                        ))}
                      </div>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-2xl font-bold text-teal-600'>
                        $80
                        {t(
                          'services.standard.golfCartRentalView.carts.perNight'
                        )}
                      </span>
                      <div className='flex items-center gap-2 text-sm text-slate-600'>
                        <Users className='w-4 h-4' />
                        <span>
                          6{' '}
                          {t(
                            'services.standard.golfCartRentalView.carts.seats'
                          )}
                        </span>
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

// Cart Card
const CartCard = ({ cart, onClick, t }) => {
  const cartKey = cart.id === '4-seater' ? '4seater' : '6seater';

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      className='group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer'
      onClick={onClick}
    >
      {cart.isPopular && (
        <div className='absolute top-4 left-4 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold z-10'>
          {t('services.standard.golfCartRentalView.carts.popular')}
        </div>
      )}

      <div className='relative h-64 overflow-hidden'>
        <motion.img
          src={cart.image}
          alt={t(`services.standard.golfCartRentalView.carts.${cartKey}.name`)}
          className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-700'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent' />

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

      <div className='p-6'>
        <h3 className='text-xl font-bold text-slate-800 mb-2 group-hover:text-teal-600 transition-colors'>
          {t(`services.standard.golfCartRentalView.carts.${cartKey}.name`)}
        </h3>
        <div className='flex items-center justify-between'>
          <span className='text-2xl font-bold text-teal-600'>
            ${cart.price}
            {t('services.standard.golfCartRentalView.carts.perNight')}
          </span>
          <div className='flex items-center gap-2 text-slate-600'>
            <Users className='w-4 h-4' />
            <span className='text-sm'>
              {cart.seats}{' '}
              {t('services.standard.golfCartRentalView.carts.seats')}
            </span>
          </div>
        </div>
      </div>
      <button
        className='mt-5 w-full text-white rounded-lg transition flex items-center disabled:opacity-50'
        onClick={onClick}
      >
        <span className=' w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white py-4 px-8 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg'>
          {t('common.button.details')}
        </span>
      </button>
    </motion.div>
  );
};

// Sidebar Component
const CartDetailsSidebar = ({ cart, isOpen, onClose, t, onBookNow }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  if (!cart) return null;

  const cartKey = cart.id === '4-seater' ? '4seater' : '6seater';
  const featureCount = cart.id === '4-seater' ? 3 : 6;

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
      setCurrentImageIndex((prev) => (prev + 1) % cart.detailImages.length);
    }

    if (isRightSwipe) {
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 bg-black/50 backdrop-blur-sm z-40'
            onClick={onClose}
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className='fixed right-0 top-0 h-full w-full max-w-lg bg-white shadow-2xl z-50 overflow-y-auto'
          >
            <div className='sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between'>
              <h2 className='text-2xl font-bold text-gray-900'>
                {t(
                  `services.standard.golfCartRentalView.carts.${cartKey}.name`
                )}
              </h2>
              <button
                onClick={onClose}
                className='p-2 hover:bg-gray-100 rounded-full transition-colors'
              >
                <X className='w-6 h-6' />
              </button>
            </div>

            <div
              className='relative h-64 overflow-hidden cursor-grab active:cursor-grabbing'
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <motion.img
                key={currentImageIndex}
                src={cart.detailImages[currentImageIndex]}
                alt={t(
                  `services.standard.golfCartRentalView.carts.${cartKey}.name`
                )}
                className='w-full h-full object-cover select-none'
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                draggable={false}
              />

              <div className='absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2'>
                <span>
                  {t('services.standard.golfCartRentalView.sidebar.swipeHint')}
                </span>
              </div>

              <div className='absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-xs font-medium'>
                {currentImageIndex + 1} / {cart.detailImages.length}
              </div>

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

            <div className='p-6 space-y-6'>
              <div className='flex items-center justify-between'>
                <span className='text-3xl font-bold text-teal-600'>
                  ${cart.price}
                  {t('services.standard.golfCartRentalView.carts.perNight')}
                </span>
                <div className='flex items-center gap-2 text-gray-600'>
                  <Users className='w-5 h-5' />
                  <span>
                    {cart.seats}{' '}
                    {t('services.standard.golfCartRentalView.carts.seats')}
                  </span>
                </div>
              </div>

              <p className='text-gray-600 leading-relaxed'>
                {t(
                  `services.standard.golfCartRentalView.carts.${cartKey}.description`
                )}
              </p>

              <div>
                <h3 className='font-bold text-gray-900 mb-3'>
                  {t('services.standard.golfCartRentalView.sidebar.features')}
                </h3>
                <div className='space-y-2'>
                  {Array.from({ length: featureCount }, (_, i) => i + 1).map(
                    (num) => (
                      <div key={num} className='flex items-center gap-3'>
                        <CheckCircle className='w-4 h-4 text-teal-500 flex-shrink-0' />
                        <span className='text-sm text-gray-600'>
                          {t(
                            `services.standard.golfCartRentalView.carts.${cartKey}.feature${num}`
                          )}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>

              <button
                onClick={onBookNow}
                className='w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white py-4 px-8 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg'
              >
                {t('services.standard.golfCartRentalView.sidebar.bookNow')}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Gallery Section
const GallerySection = ({ t }) => {
  const [selectedImage, setSelectedImage] = useState(null);

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
            {t('services.standard.golfCartRentalView.gallery.title')}
          </h2>
          <p className='text-xl text-slate-600'>
            {t('services.standard.golfCartRentalView.gallery.subtitle')}
          </p>
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
                  {t(
                    `services.standard.golfCartRentalView.gallery.image${image.id}Title`
                  )}
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
const CTABanner = ({ t, onGetStartedClick }) => {
  return (
    <section className='relative py-20 overflow-hidden'>
      <div className='absolute inset-0'>
        <img
          src='https://res.cloudinary.com/ddg92xar5/image/upload/v1755947017/IMG_3227_gktf9e.jpg'
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
            {t('services.standard.golfCartRentalView.ctaBanner.title')}
          </h2>
          <p className='text-xl mb-8 max-w-2xl mx-auto opacity-90'>
            {t('services.standard.golfCartRentalView.ctaBanner.subtitle')}
          </p>

          <button
            onClick={onGetStartedClick}
            className='group bg-white text-slate-800 hover:bg-slate-100 px-8 py-4 rounded-2xl font-bold text-lg flex items-center gap-3 mx-auto transition-all duration-300 hover:scale-105 shadow-xl'
          >
            {t('services.standard.golfCartRentalView.ctaBanner.cta')}
            <ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform' />
          </button>

          <div className='flex flex-wrap justify-center gap-8 mt-12'>
            {[1, 2, 3].map((num) => (
              <div key={num} className='flex items-center gap-2 text-white/80'>
                <CheckCircle className='w-5 h-5 text-cyan-300' />
                <span>
                  {t(
                    `services.standard.golfCartRentalView.ctaBanner.feature${num}`
                  )}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Main Component
const GolfCartServiceView = () => {
  const { t } = useTranslation();
  const [selectedCart, setSelectedCart] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const { bookService } = useBooking();

  const getServiceForCart = (cart) => {
    return {
      id: 'golf-cart-rental',
      name: 'Golf Cart Rental',
      type: 'transportation',
      packageType: cart?.seats === 6 ? 'premium' : 'standard',
      description: 'Premium golf cart rental service for resort exploration',
      category: 'mobility',
      duration: 'flexible',
      selectedCartInfo: cart
        ? {
            id: cart.id,
            seats: cart.seats,
            price: cart.price,
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

  const handleCartClick = (cart) => {
    setSelectedCart(cart);
    setIsSidebarOpen(true);
  };

  const handleBookNow = () => {
    setIsSidebarOpen(false);
    setIsBookingModalOpen(true);
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

  return (
    <div className='min-h-screen bg-white'>
      <HeroSection onExploreClick={handleExploreClick} t={t} />

      <section id='cart-selection' className='py-20 bg-white'>
        <div className='max-w-7xl mx-auto px-6'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='text-center mb-16'
          >
            <h2 className='text-4xl lg:text-5xl font-light text-slate-800 mb-4'>
              {t('services.standard.golfCartRentalView.fleet.title')}
            </h2>
            <p className='text-xl text-slate-600'>
              {t('services.standard.golfCartRentalView.fleet.subtitle')}
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
                  onClick={() => handleCartClick(cart)}
                  t={t}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <GallerySection t={t} />

      <CTABanner t={t} onGetStartedClick={handleGetStartedClick} />

      <motion.div
        className='px-4 mt-10 mb-10'
        initial='hidden'
        animate='visible'
      >
        <div className='mb-20 mt-20 text-center relative overflow-hidden'>
          <motion.div
            className='absolute '
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 2, delay: 0.5 }}
          />

          <Quote className='w-12 h-12 text-emerald-500 mx-auto mb-6' />
          <blockquote className='text-3xl md:text-4xl font-light text-gray-800 mb-6 italic leading-relaxed'>
            "{t('services.standard.golfCartRentalView.quote.text')}"
          </blockquote>
          <cite className='text-xl text-emerald-600 font-medium'>
            - {t('services.standard.golfCartRentalView.quote.author')}
          </cite>
        </div>
      </motion.div>

      <div className='max-w-7xl mx-auto px-6 mb-10'>
        <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
          <div className='flex items-start'>
            <FileText className='w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5' />
            <div>
              <h4 className='font-medium text-blue-800 mb-2'>
                {t('services.standard.golfCartRentalView.requirements.title')}
              </h4>
              <ul className='text-sm text-blue-700 space-y-1'>
                <li>
                  •{' '}
                  {t(
                    'services.standard.golfCartRentalView.requirements.requirement1'
                  )}
                </li>
                <li>
                  •{' '}
                  {t(
                    'services.standard.golfCartRentalView.requirements.requirement2'
                  )}
                </li>
                <li>
                  •{' '}
                  {t(
                    'services.standard.golfCartRentalView.requirements.requirement3'
                  )}
                </li>
                <li>
                  •{' '}
                  {t(
                    'services.standard.golfCartRentalView.requirements.requirement4'
                  )}
                </li>
                <li>
                  •{' '}
                  {t(
                    'services.standard.golfCartRentalView.requirements.requirement5'
                  )}
                </li>
                <li>
                  •{' '}
                  {t(
                    'services.standard.golfCartRentalView.requirements.requirement6'
                  )}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className='bg-amber-50 border border-amber-200 rounded-lg p-4 mt-6'>
          <div className='flex items-start'>
            <AlertTriangle className='w-5 h-5 text-amber-600 mr-3 flex-shrink-0 mt-0.5' />
            <div>
              <h4 className='font-medium text-amber-800 mb-2'>
                {t('services.standard.golfCartRentalView.disclaimer.title')}
              </h4>
              <p className='text-sm text-amber-700'>
                <strong>
                  {
                    t(
                      'services.standard.golfCartRentalView.disclaimer.text'
                    ).split('.')[0]
                  }
                  .
                </strong>{' '}
                {t('services.standard.golfCartRentalView.disclaimer.text')
                  .split('.')
                  .slice(1)
                  .join('.')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <CartDetailsSidebar
        cart={selectedCart}
        isOpen={isSidebarOpen}
        onClose={() => {
          setIsSidebarOpen(false);
          setSelectedCart(null);
        }}
        t={t}
        onBookNow={handleBookNow}
      />

      {isBookingModalOpen && (
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          onConfirm={handleBookingConfirm}
          service={getServiceForCart(selectedCart)}
        />
      )}
    </div>
  );
};

export default GolfCartServiceView;
