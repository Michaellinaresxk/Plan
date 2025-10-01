import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Clock,
  Shield,
  Star,
  Check,
  ArrowRight,
  X,
  Sparkles,
  Heart,
  Users,
  Eye,
  Shirt,
  Waves,
  Coffee,
  Camera,
  Info,
  AlertTriangle,
  Mountain,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import BookingModal from '../../modal/BookingModal';
import { useBooking } from '@/context/BookingContext';
import { useTranslation } from '@/lib/i18n/client';
import { BookingDate, Service } from '@/constants/formFields';

// Vehicle Selection Section
const VehicleSelection = ({ onVehicleSelect }) => {
  const { t } = useTranslation();

  // Vehicle Types with translated content
  const VEHICLE_TYPES = {
    BUGGY: {
      id: 'buggy',
      name: t('services.standard.atvService.vehicles.buggy.name'),
      image:
        'https://res.cloudinary.com/ddg92xar5/image/upload/v1754597118/9_m5fya0.jpg',
      description: t('services.standard.atvService.vehicles.buggy.description'),
      features: [
        t('services.standard.atvService.vehicles.buggy.features.capacity'),
        t('services.standard.atvService.vehicles.buggy.features.sideBySide'),
        t('services.standard.atvService.vehicles.buggy.features.couples'),
      ],
      price: 65,
      duration: t('services.standard.atvService.vehicles.duration'),
      maxParticipants: 2,
    },
    ATV: {
      id: 'atv',
      name: t('services.standard.atvService.vehicles.atv.name'),
      image:
        'https://res.cloudinary.com/ddg92xar5/image/upload/v1754595961/7_x4rptj.jpg',
      description: t('services.standard.atvService.vehicles.atv.description'),
      features: [
        t('services.standard.atvService.vehicles.atv.features.solo'),
        t('services.standard.atvService.vehicles.atv.features.handling'),
        t('services.standard.atvService.vehicles.atv.features.beginners'),
      ],
      price: 85,
      duration: t('services.standard.atvService.vehicles.duration'),
      maxParticipants: 2,
    },
    POLARIS: {
      id: 'polaris-rzr',
      name: t('services.standard.atvService.vehicles.polaris.name'),
      image:
        'https://res.cloudinary.com/ddg92xar5/image/upload/v1755946908/polaris1_kfwgbw.jpg',
      description: t(
        'services.standard.atvService.vehicles.polaris.description'
      ),
      features: [
        t('services.standard.atvService.vehicles.polaris.features.performance'),
        t('services.standard.atvService.vehicles.polaris.features.suspension'),
        t('services.standard.atvService.vehicles.polaris.features.thrill'),
      ],
      price: 160,
      duration: t('services.standard.atvService.vehicles.duration'),
      maxParticipants: 2,
    },
    POLARIS_FAMILIAR: {
      id: 'polaris-familiar',
      name: t('services.standard.atvService.vehicles.polarisFamiliar.name'),
      image:
        'https://res.cloudinary.com/ddg92xar5/image/upload/v1758048523/caption_1_e1y8cs.jpg',
      description: t(
        'services.standard.atvService.vehicles.polarisFamiliar.description'
      ),
      features: [
        t(
          'services.standard.atvService.vehicles.polarisFamiliar.features.performance'
        ),
        t(
          'services.standard.atvService.vehicles.polarisFamiliar.features.suspension'
        ),
        t(
          'services.standard.atvService.vehicles.polarisFamiliar.features.thrill'
        ),
      ],
      price: 215,
      duration: t('services.standard.atvService.vehicles.duration'),
      maxParticipants: 4,
    },
  };

  return (
    <section className='py-20 px-4 bg-gradient-to-br from-green-50 to-amber-50'>
      <div className='max-w-6xl mx-auto'>
        <div className='text-center mb-12'>
          <div className='inline-flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full mb-4'>
            <Sparkles className='w-4 h-4 text-green-600' />
            <span className='text-green-700 font-medium'>
              {t('services.standard.atvService.vehicleSelection.badge')}
            </span>
          </div>
          <h2 className='text-3xl md:text-4xl font-bold text-gray-800 mb-4'>
            {t('services.standard.atvService.vehicleSelection.title')}{' '}
            <span className='text-amber-500'>
              {t(
                'services.standard.atvService.vehicleSelection.titleHighlight'
              )}
            </span>
          </h2>
          <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
            {t('services.standard.atvService.vehicleSelection.subtitle')}
          </p>
        </div>

        <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-3'>
          {Object.values(VEHICLE_TYPES).map((vehicle) => (
            <div
              key={vehicle.id}
              className='group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer'
              onClick={() => onVehicleSelect(vehicle)}
            >
              <div className='relative h-50 overflow-hidden'>
                <img
                  src={vehicle.image}
                  alt={vehicle.name}
                  className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                />
                <div className='absolute top-4 right-4 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-semibold'>
                  {vehicle.price
                    ? `$${vehicle.price}`
                    : t(
                        'services.standard.atvService.vehicleSelection.contactUs'
                      )}
                </div>
                <div className='absolute inset-0 bg-gradient-to-t from-black/30 to-transparent group-hover:from-black/40 transition-all duration-300' />
              </div>

              <div className='p-6'>
                <h3 className='text-xl font-bold text-gray-800 mb-2'>
                  {vehicle.name}
                </h3>
                <p className='text-gray-600 mb-4'>{vehicle.description}</p>

                <div className='space-y-2 mb-4'>
                  {vehicle.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className='flex items-center text-sm text-gray-600'
                    >
                      <Check className='w-4 h-4 text-green-500 mr-2' />
                      {feature}
                    </div>
                  ))}
                </div>

                <div className='flex items-center justify-between text-sm text-gray-500'>
                  <span className='flex items-center'>
                    <Clock className='w-4 h-4 mr-1' />
                    {vehicle.duration}
                  </span>
                  <span className='flex items-center'>
                    <Users className='w-4 h-4 mr-1' />
                    {t(
                      'services.standard.atvService.vehicleSelection.maxParticipants'
                    )}{' '}
                    {vehicle.maxParticipants}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className='mt-12 text-center'>
          <div className='inline-flex items-center gap-6 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg'>
            <div className='flex items-center gap-2 text-sm text-gray-700'>
              <Shield className='w-4 h-4 text-green-500' />
              <span>
                {t('services.standard.atvService.vehicleSelection.info.safety')}
              </span>
            </div>
            <div className='flex items-center gap-2 text-sm text-gray-700'>
              <Clock className='w-4 h-4 text-blue-500' />
              <span>
                {t(
                  'services.standard.atvService.vehicleSelection.info.adventure'
                )}
              </span>
            </div>
            <div className='flex items-center gap-2 text-sm text-gray-700'>
              <MapPin className='w-4 h-4 text-red-500' />
              <span>
                {t('services.standard.atvService.vehicleSelection.info.trails')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Updated Hero Section for ATV Adventures
const HeroSection = ({ onBookNow }) => {
  const { t } = useTranslation();

  return (
    <div className='relative h-screen min-h-[600px] md:min-h-[700px] overflow-hidden'>
      <div className='absolute inset-0'>
        <img
          src='https://res.cloudinary.com/ddg92xar5/image/upload/v1754595140/2_fhmcnt.jpg'
          alt={t('services.standard.atvService.hero.imageAlt')}
          className='w-full h-full object-cover'
        />
        <div className='absolute inset-0 bg-black/40' />
        <div className='absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/70' />
      </div>

      <div className='relative z-10 h-full flex flex-col justify-end px-4 md:px-8 pb-10'>
        <div className='max-w-4xl mx-auto w-full'>
          <div className='inline-flex items-center gap-2 bg-green-500/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-green-400/30'>
            <Sparkles className='w-4 h-4 text-green-400' />
            <span className='text-green-200 text-sm font-medium'>
              {t('services.standard.atvService.hero.badge')}
            </span>
          </div>

          <h1 className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 text-white'>
            {t('services.standard.atvService.hero.title')}
            <span className='block text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-amber-400 mt-2'>
              {t('services.standard.atvService.hero.subtitle')}
            </span>
          </h1>

          <p className='text-base sm:text-lg md:text-xl text-white/90 mb-8 md:mb-10 max-w-2xl'>
            {t('services.standard.atvService.hero.description')}
          </p>

          <div className='flex flex-col sm:flex-row gap-4 mb-8'>
            <button
              onClick={onBookNow}
              className='group bg-amber-500 hover:bg-amber-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold transition-all transform hover:scale-105 shadow-2xl inline-flex items-center justify-center gap-2'
            >
              {t('services.standard.atvService.hero.ctaButton')}
              <ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform' />
            </button>
          </div>

          <div className='flex flex-wrap gap-6 text-white/80 text-sm sm:text-base'>
            <div className='flex items-center gap-2'>
              <Star className='w-4 h-4 text-amber-400 fill-amber-400' />
              <span>
                {' '}
                {t('services.standard.atvService.hero.stats.rating')}
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <Clock className='w-4 h-4' />
              <span>
                {' '}
                {t('services.standard.atvService.hero.stats.duration')}
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <Users className='w-4 h-4' />
              <span>
                {' '}
                {t('services.standard.atvService.hero.stats.groups')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Updated Photo Gallery for ATV Adventures
const PhotoGallery = () => {
  const { t } = useTranslation();
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  const photos = [
    {
      src: 'https://res.cloudinary.com/ddg92xar5/image/upload/v1754595136/6_xkqjqa.jpg',
      alt: t('services.standard.atvService.gallery.photos.jungle.alt'),
      caption: t('services.standard.atvService.gallery.photos.jungle.caption'),
      category: 'atv',
    },
    {
      src: 'https://res.cloudinary.com/ddg92xar5/image/upload/v1754595137/5_qkapnv.jpg',
      alt: t('services.standard.atvService.gallery.photos.beach.alt'),
      caption: t('services.standard.atvService.gallery.photos.beach.caption'),
      category: 'buggies',
    },
    {
      src: 'https://res.cloudinary.com/ddg92xar5/image/upload/v1755946926/polaris-2_rrtt3b.jpg',
      alt: t('services.standard.atvService.gallery.photos.cenotes.alt'),
      caption: t('services.standard.atvService.gallery.photos.cenotes.caption'),
      category: 'polaris',
    },
    {
      src: 'https://res.cloudinary.com/ddg92xar5/image/upload/v1754596293/4_enh3k1.jpg',
      alt: t('services.standard.atvService.gallery.photos.polarisSunset.alt'),
      caption: t(
        'services.standard.atvService.gallery.photos.polarisSunset.caption'
      ),
      category: 'buggies',
    },
    {
      src: 'https://res.cloudinary.com/ddg92xar5/image/upload/v1758048524/caption_yf0et6.jpg',
      alt: t('services.standard.atvService.gallery.photos.polarisFamiliar.alt'),
      caption: t(
        'services.standard.atvService.gallery.photos.polarisFamiliar.caption'
      ),
      category: 'polaris',
    },
  ];

  const categories = [
    {
      id: 'all',
      label: t('services.standard.atvService.gallery.categories.all'),
      count: photos.length,
    },
    {
      id: 'atv',
      label: t('services.standard.atvService.gallery.categories.atv'),
      count: photos.filter((p) => p.category === 'atv').length,
    },
    {
      id: 'buggies',
      label: t('services.standard.atvService.gallery.categories.buggies'),
      count: photos.filter((p) => p.category === 'buggies').length,
    },
    {
      id: 'polaris',
      label: t('services.standard.atvService.gallery.categories.polaris'),
      count: photos.filter((p) => p.category === 'polaris').length,
    },
  ];

  const filteredPhotos = useMemo(() => {
    return activeCategory === 'all'
      ? photos
      : photos.filter((photo) => photo.category === activeCategory);
  }, [activeCategory, photos]);

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
  };

  const handleImageClick = (photo) => {
    setSelectedImage(photo);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  return (
    <section className='py-16 bg-white'>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl md:text-4xl font-bold text-gray-800 mb-4'>
            {t('services.standard.atvService.gallery.title')}{' '}
            <span className='text-green-500'>
              {t('services.standard.atvService.gallery.titleHighlight')}
            </span>
          </h2>
          <p className='text-lg text-gray-600 mb-8'>
            {t('services.standard.atvService.gallery.subtitle')}
          </p>

          <div className='flex flex-wrap justify-center gap-2 md:gap-4'>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`
                  px-4 py-2 rounded-full text-sm md:text-base font-medium transition-all duration-300
                  ${
                    activeCategory === category.id
                      ? 'bg-green-500 text-white shadow-lg transform scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                  }
                `}
                aria-pressed={activeCategory === category.id}
              >
                {category.label}
                <span className='ml-2 text-xs opacity-75'>
                  ({category.count})
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className='grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4'>
          {filteredPhotos.map((photo, idx) => (
            <div
              key={`${photo.category}-${idx}`}
              className={`
                group relative overflow-hidden rounded-xl cursor-pointer
                transition-all duration-300 hover:shadow-xl
                ${
                  idx === 0 && filteredPhotos.length > 3
                    ? 'md:col-span-2 md:row-span-2'
                    : ''
                }
              `}
              onClick={() => handleImageClick(photo)}
            >
              <div
                className={`
                  ${
                    idx === 0 && filteredPhotos.length > 3
                      ? 'h-full min-h-[200px] md:min-h-[300px]'
                      : 'aspect-square'
                  }
                `}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
                  loading='lazy'
                />
              </div>

              <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                <div className='absolute bottom-4 left-4 text-white'>
                  <p className='font-semibold text-xs md:text-base'>
                    {photo.caption}
                  </p>
                  <p className='text-xs opacity-80 mt-1 capitalize'>
                    {photo.category.replace('_', ' ')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPhotos.length === 0 && (
          <div className='text-center py-12'>
            <p className='text-gray-500 text-lg'>
              {t('services.standard.atvService.gallery.noPhotos')}
            </p>
          </div>
        )}
      </div>

      {selectedImage && (
        <div
          className='fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4'
          onClick={closeLightbox}
          role='dialog'
          aria-modal='true'
          aria-labelledby='lightbox-title'
        >
          <button
            className='absolute top-4 right-4 text-white hover:text-gray-300 z-50 p-2 rounded-full hover:bg-white/10 transition-colors'
            onClick={closeLightbox}
            aria-label={t('services.standard.atvService.gallery.closeImage')}
          >
            <X className='w-8 h-8' />
          </button>

          <div className='relative'>
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className='max-w-full max-h-[90vh] rounded-lg'
              onClick={(e) => e.stopPropagation()}
            />

            <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg'>
              <h3
                id='lightbox-title'
                className='text-white font-semibold text-lg mb-2'
              >
                {selectedImage.caption}
              </h3>
              <p className='text-gray-300 capitalize'>
                {selectedImage.category.replace('_', ' ')}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

// Compact Itinerary Section
const ItinerarySection = () => {
  const { t } = useTranslation();

  const ITINERARY_STEPS = [
    {
      id: 1,
      icon: Waves,
      title: t('services.standard.atvService.itinerary.steps.playaMacao.title'),
      description: t(
        'services.standard.atvService.itinerary.steps.playaMacao.description'
      ),
    },
    {
      id: 2,
      icon: Mountain,
      title: t('services.standard.atvService.itinerary.steps.cuevaTaina.title'),
      description: t(
        'services.standard.atvService.itinerary.steps.cuevaTaina.description'
      ),
    },
    {
      id: 3,
      icon: Coffee,
      title: t('services.standard.atvService.itinerary.steps.casaTipica.title'),
      description: t(
        'services.standard.atvService.itinerary.steps.casaTipica.description'
      ),
    },
    {
      id: 4,
      icon: ArrowRight,
      title: t(
        'services.standard.atvService.itinerary.steps.returnRanch.title'
      ),
      description: t(
        'services.standard.atvService.itinerary.steps.returnRanch.description'
      ),
    },
  ];

  return (
    <section className='py-16 bg-gradient-to-br from-green-50 to-amber-50'>
      <div className='max-w-6xl mx-auto px-4'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl font-bold text-gray-800 mb-4'>
            {t('services.standard.atvService.itinerary.title')}{' '}
            <span className='text-green-500'>
              {t('services.standard.atvService.itinerary.titleHighlight')}
            </span>
          </h2>
          <p className='text-gray-600'>
            {t('services.standard.atvService.itinerary.subtitle')}
          </p>
          <p className='text-sm text-blue-600 mt-2 font-medium'>
            {t('services.standard.atvService.itinerary.route')}
          </p>
        </div>

        <div className='grid grid-cols-2 md:grid-cols-2 gap-6'>
          {ITINERARY_STEPS.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className='flex items-center gap-4 bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300'
              >
                <div className='w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0'>
                  <IconComponent className='w-6 h-6 text-green-600' />
                </div>

                <div className='flex-grow'>
                  <div className='flex items-center gap-2 mb-1'>
                    <span className='bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full'>
                      {t('services.standard.atvService.itinerary.stopLabel')}{' '}
                      {step.id}
                    </span>
                  </div>
                  <h3 className='font-semibold text-gray-800 text-sm mb-1'>
                    {step.title}
                  </h3>
                  <p className='text-gray-600 text-xs'>{step.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className='mt-8 text-center space-y-3'>
          <div className='inline-flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full'>
            <Clock className='w-4 h-4 text-green-600' />
            <span className='text-green-800 font-medium text-sm'>
              {t('services.standard.atvService.itinerary.totalDuration')}
            </span>
          </div>

          <div className='inline-flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full ml-3'>
            <Waves className='w-4 h-4 text-blue-600' />
            <span className='text-blue-800 font-medium text-sm'>
              {t('services.standard.atvService.itinerary.lifeVests')}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

// Compact What to Bring & Schedule Info Section
const InfoSection = () => {
  const { t } = useTranslation();

  const WHAT_TO_BRING = [
    {
      icon: Eye,
      title: t('services.standard.atvService.whatToBring.sunglasses.title'),
      description: t(
        'services.standard.atvService.whatToBring.sunglasses.description'
      ),
    },
    {
      icon: Shirt,
      title: t('services.standard.atvService.whatToBring.bandanas.title'),
      description: t(
        'services.standard.atvService.whatToBring.bandanas.description'
      ),
    },
    {
      icon: Waves,
      title: t('services.standard.atvService.whatToBring.swimwear.title'),
      description: t(
        'services.standard.atvService.whatToBring.swimwear.description'
      ),
    },
    {
      icon: AlertTriangle,
      title: t('services.standard.atvService.whatToBring.oldClothes.title'),
      description: t(
        'services.standard.atvService.whatToBring.oldClothes.description'
      ),
    },
  ];

  // Helper function to ensure we always get an array
  const getArrayFromTranslation = (key, fallback = []) => {
    const result = t(key, { returnObjects: true });
    return Array.isArray(result) ? result : fallback;
  };

  const SCHEDULE_INFO = [
    {
      icon: Clock,
      title: t('services.standard.atvService.scheduleInfo.pickupTimes.title'),
      items: getArrayFromTranslation(
        'standard.atvService.scheduleInfo.pickupTimes.items',
        ['7:30 AM', '10:30 AM', '1:30 PM']
      ),
    },
    {
      icon: Waves,
      title: t(
        'services.standard.atvService.scheduleInfo.cenoteImportant.title'
      ),
      items: getArrayFromTranslation(
        'standard.atvService.scheduleInfo.cenoteImportant.items',
        [
          'Life vests NOT included',
          'Available as additional paid service',
          'Swimming is optional',
        ]
      ),
    },
    {
      icon: Shield,
      title: t('services.standard.atvService.scheduleInfo.weatherPolicy.title'),
      items: getArrayFromTranslation(
        'atvService.scheduleInfo.weatherPolicy.items',
        [
          'Excursion does NOT cancel for rain',
          'Only cancelled in extreme weather conditions',
          'Come prepared for adventure!',
        ]
      ),
    },
  ];

  return (
    <section className='py-16 bg-white'>
      <div className='max-w-6xl mx-auto px-4'>
        <div className='grid lg:grid-cols-2 gap-12'>
          <div>
            <h2 className='text-2xl font-bold text-gray-800 mb-6'>
              {t('services.standard.atvService.whatToBring.title')}{' '}
              <span className='text-green-500'>
                {t('services.standard.atvService.whatToBring.titleHighlight')}
              </span>
            </h2>
            <div className='grid grid-cols-2 gap-4'>
              {WHAT_TO_BRING.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className='text-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors'
                  >
                    <div className='w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3'>
                      <IconComponent className='w-6 h-6 text-green-600' />
                    </div>
                    <h3 className='font-semibold text-gray-800 text-sm mb-2'>
                      {item.title}
                    </h3>
                    <p className='text-gray-600 text-xs'>{item.description}</p>
                  </motion.div>
                );
              })}
            </div>

            <div className='mt-6 bg-red-50 rounded-xl p-4 border border-red-200'>
              <div className='flex items-start gap-3'>
                <AlertTriangle className='w-5 h-5 text-red-600 flex-shrink-0 mt-0.5' />
                <div>
                  <h3 className='font-semibold text-red-800 mb-2'>
                    {t(
                      'services.standard.atvService.importantObservation.title'
                    )}
                  </h3>
                  <p className='text-red-700 text-sm font-medium'>
                    {t(
                      'services.standard.atvService.importantObservation.description'
                    )}
                  </p>
                  <p className='text-red-600 text-xs mt-2'>
                    {t(
                      'services.standard.atvService.importantObservation.note'
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className='text-2xl font-bold text-gray-800 mb-6'>
              {t('services.standard.atvService.scheduleInfo.title')}{' '}
              <span className='text-blue-500'>
                {t('services.standard.atvService.scheduleInfo.titleHighlight')}
              </span>
            </h2>
            <div className='grid grid-cols-2 md:grid-cols-2 gap-4'>
              {SCHEDULE_INFO.map((category, index) => {
                const IconComponent = category.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className='bg-gray-50 rounded-xl p-4'
                  >
                    <div className='flex items-center gap-3 mb-3'>
                      <div className='w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center'>
                        <IconComponent className='w-4 h-4 text-blue-600' />
                      </div>
                      <h3 className='font-semibold text-gray-800 text-sm'>
                        {category.title}
                      </h3>
                    </div>
                    <ul className='space-y-1'>
                      {category.items.map((item, itemIndex) => (
                        <li key={itemIndex} className='flex items-start gap-2'>
                          <Check className='w-3 h-3 text-green-500 flex-shrink-0 mt-0.5' />
                          <span className='text-gray-600 text-xs'>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        <div className='mt-12 grid md:grid-cols-2 gap-6'>
          <div className='bg-amber-50 rounded-2xl p-6 border border-amber-200'>
            <div className='flex items-start gap-4'>
              <Shield className='w-6 h-6 text-amber-600 flex-shrink-0 mt-1' />
              <div>
                <h3 className='text-lg font-semibold text-amber-800 mb-3'>
                  {t('services.standard.atvService.policies.weather.title')}
                </h3>
                <p className='text-amber-700 text-sm leading-relaxed'>
                  {t(
                    'services.standard.atvService.policies.weather.description'
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className='bg-blue-50 rounded-2xl p-6 border border-blue-200'>
            <div className='flex items-start gap-4'>
              <Camera className='w-6 h-6 text-blue-600 flex-shrink-0 mt-1' />
              <div>
                <h3 className='text-lg font-semibold text-blue-800 mb-3'>
                  {t('services.standard.atvService.policies.photo.title')}
                </h3>
                <p className='text-blue-700 text-sm leading-relaxed'>
                  {t('services.standard.atvService.policies.photo.description')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Quick Info Section Component
const QuickInfoSection = () => {
  const { t } = useTranslation();

  const cards = [
    {
      icon: <MapPin className='w-5 h-5' />,
      title: t('services.standard.atvService.quickInfo.cards.location.title'),
      description: t(
        'services.standard.atvService.quickInfo.cards.location.description'
      ),
    },
    {
      icon: <Shield className='w-5 h-5' />,
      title: t('services.standard.atvService.quickInfo.cards.safety.title'),
      description: t(
        'services.standard.atvService.quickInfo.cards.safety.description'
      ),
    },
    {
      icon: <Clock className='w-5 h-5' />,
      title: t('services.standard.atvService.quickInfo.cards.duration.title'),
      description: t(
        'services.standard.atvService.quickInfo.cards.duration.description'
      ),
    },
    {
      icon: <Star className='w-5 h-5' />,
      title: t('services.standard.atvService.quickInfo.cards.rating.title'),
      description: t(
        'services.standard.atvService.quickInfo.cards.rating.description'
      ),
    },
  ];

  return (
    <section className='py-16 px-4 bg-gray-50'>
      <div className='max-w-5xl mx-auto'>
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6'>
          {cards.map((card, idx) => (
            <div
              key={idx}
              className='text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow'
            >
              <div className='inline-flex p-3 rounded-full bg-gradient-to-br from-amber-100 to-green-100 text-amber-600 mb-3'>
                {card.icon}
              </div>
              <h3 className='font-semibold text-gray-800 mb-1'>{card.title}</h3>
              <p className='text-sm text-gray-600'>{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Updated Includes Section
const IncludesSection = () => {
  const { t } = useTranslation();

  // Keys for included items
  const includedKeys = [
    'transportation',
    'atvRental',
    'safetyEquipment',
    'bilingualGuide',
    'beachAccess',
    'cenoteExploration',
    'traditionalHouse',
    'tasting',
  ];

  // Keys for not included items
  const notIncludedKeys = [
    'lifeVests',
    'sunglasses',
    'bandanas',
    'personalItems',
  ];

  const includes = includedKeys.map((key) =>
    t(`services.standard.atvService.includes.items.${key}`)
  );

  const notIncluded = notIncludedKeys.map((key) =>
    t(`services.standard.atvService.includes.items.${key}`)
  );

  return (
    <section className='py-16 px-4 bg-white'>
      <div className='max-w-4xl mx-auto'>
        <h2 className='text-3xl font-bold text-center mb-10 text-gray-800'>
          {t('services.standard.atvService.includes.title')}{' '}
          <span className='text-green-500'>
            {t('services.standard.atvService.includes.titleHighlight')}
          </span>
        </h2>

        <div className='grid md:grid-cols-2 gap-8'>
          <div>
            <h3 className='text-lg font-semibold text-green-600 mb-4 flex items-center'>
              <Check className='w-5 h-5 mr-2' />
              {t('services.standard.atvService.includes.includedTitle')}
            </h3>
            <div className='space-y-3'>
              {includes.map((item, idx) => (
                <div
                  key={idx}
                  className='flex items-center gap-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors'
                >
                  <Check className='w-4 h-4 text-green-500 flex-shrink-0' />
                  <span className='text-gray-700 font-medium'>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className='text-lg font-semibold text-orange-600 mb-4 flex items-center'>
              <X className='w-5 h-5 mr-2' />
              {t('services.standard.atvService.includes.notIncludedTitle')}
            </h3>
            <div className='space-y-3'>
              {notIncluded.map((item, idx) => {
                const isLifeVest = notIncludedKeys[idx] === 'lifeVests';

                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      isLifeVest
                        ? 'bg-red-50 border border-red-200'
                        : 'bg-orange-50'
                    }`}
                  >
                    <X
                      className={`w-4 h-4 flex-shrink-0 ${
                        isLifeVest ? 'text-red-500' : 'text-orange-500'
                      }`}
                    />
                    <span
                      className={`${
                        isLifeVest
                          ? 'text-red-700 font-semibold'
                          : 'text-gray-700'
                      }`}
                    >
                      {item}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Updated Special Banner
const SpecialBanner = ({ onBookNow }) => {
  const { t } = useTranslation();

  return (
    <section className='relative py-32 overflow-hidden'>
      <div className='absolute inset-0'>
        <img
          src='https://res.cloudinary.com/ddg92xar5/image/upload/v1754596123/8_y6xwml.jpg'
          alt={t('services.standard.atvService.specialBanner.imageAlt')}
          className='w-full h-full object-cover'
        />
        <div className='absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent' />
      </div>

      <div className='relative z-10 max-w-6xl mx-auto px-4'>
        <div className='max-w-2xl'>
          <div className='inline-flex items-center gap-2 bg-green-500/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-green-400/30'>
            <Sparkles className='w-4 h-4 text-green-400' />
            <span className='text-green-200 text-sm font-medium'>
              {t('services.standard.atvService.specialBanner.badge')}
            </span>
          </div>

          <h2 className='text-4xl md:text-5xl font-bold text-white mb-6'>
            {t('services.standard.atvService.specialBanner.title')}
            <span className='block text-amber-400'>
              {t('services.standard.atvService.specialBanner.subtitle')}
            </span>
          </h2>

          <p className='text-lg text-white/90 mb-8'>
            {t('services.standard.atvService.specialBanner.description')}
          </p>

          <div className='flex flex-wrap gap-6 mb-8'>
            <div className='flex items-center gap-2 text-white'>
              <Heart className='w-5 h-5 text-red-400' />
              <span>
                {t(
                  'services.standard.atvService.specialBanner.features.ecoFriendly'
                )}
              </span>
            </div>
            <div className='flex items-center gap-2 text-white'>
              <Shield className='w-5 h-5 text-green-400' />
              <span>
                {t(
                  'services.standard.atvService.specialBanner.features.guides'
                )}
              </span>
            </div>
            <div className='flex items-center gap-2 text-white'>
              <Star className='w-5 h-5 text-amber-400' />
              <span>
                {t(
                  'services.standard.atvService.specialBanner.features.equipment'
                )}
              </span>
            </div>
          </div>

          <button
            onClick={onBookNow}
            className='bg-gradient-to-r from-amber-500 to-green-500 hover:from-amber-600 hover:to-green-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all transform hover:scale-105 shadow-2xl'
          >
            {t('services.standard.atvService.specialBanner.ctaButton')}
          </button>
        </div>
      </div>
    </section>
  );
};

// Updated Adventure Banner
const AdventureBanner = () => {
  const { t } = useTranslation();

  return (
    <section className='relative py-24 overflow-hidden bg-gradient-to-br from-green-50 to-amber-50'>
      <div className='max-w-6xl mx-auto px-4'>
        <div className='grid lg:grid-cols-2 gap-12 items-center'>
          <div>
            <h2 className='text-3xl md:text-4xl font-bold text-gray-800 mb-6'>
              {t('services.standard.atvService.adventureBanner.title')}
              <span className='text-green-500'>
                {' '}
                {t(
                  'services.standard.atvService.adventureBanner.titleHighlight'
                )}
              </span>
            </h2>

            <div className='space-y-6'>
              <div className='flex items-start gap-4'>
                <div className='w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0'>
                  <Check className='w-5 h-5 text-green-600' />
                </div>
                <div>
                  <h3 className='font-semibold text-gray-800 mb-2'>
                    {t(
                      'services.standard.atvService.adventureBanner.features.terrain.title'
                    )}
                  </h3>
                  <p className='text-gray-600'>
                    {t(
                      'services.standard.atvService.adventureBanner.features.terrain.description'
                    )}
                  </p>
                </div>
              </div>

              <div className='flex items-start gap-4'>
                <div className='w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0'>
                  <Check className='w-5 h-5 text-amber-600' />
                </div>
                <div>
                  <h3 className='font-semibold text-gray-800 mb-2'>
                    {t(
                      'services.standard.atvService.adventureBanner.features.equipment.title'
                    )}
                  </h3>
                  <p className='text-gray-600'>
                    {t(
                      'services.standard.atvService.adventureBanner.features.equipment.description'
                    )}
                  </p>
                </div>
              </div>

              <div className='flex items-start gap-4'>
                <div className='w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0'>
                  <Check className='w-5 h-5 text-blue-600' />
                </div>
                <div>
                  <h3 className='font-semibold text-gray-800 mb-2'>
                    {t(
                      'services.standard.atvService.adventureBanner.features.ecoTourism.title'
                    )}
                  </h3>
                  <p className='text-gray-600'>
                    {t(
                      'services.standard.atvService.adventureBanner.features.ecoTourism.description'
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className='relative'>
            <div className='rounded-2xl overflow-hidden shadow-2xl'>
              <img
                src='https://res.cloudinary.com/ddg92xar5/image/upload/v1754595138/3_xanwzg.jpg'
                alt={t('servicces.standard.tvService.adventureBanner.imageAlt')}
                className='w-full h-[400px] object-cover'
              />
            </div>
            <div className='absolute -bottom-6 -right-6 bg-white rounded-xl shadow-lg p-4'>
              <div className='flex items-center gap-3'>
                <div className='w-12 h-12 bg-gradient-to-br from-green-100 to-amber-100 rounded-full flex items-center justify-center'>
                  <Sparkles className='w-6 h-6 text-green-600' />
                </div>
                <div>
                  <p className='text-xl font-bold text-gray-800'>
                    {t(
                      'services.standard.atvService.adventureBanner.badge.title'
                    )}
                  </p>
                  <p className='text-xs text-gray-600'>
                    {t(
                      'services.standard.atvService.adventureBanner.badge.subtitle'
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Updated Reviews for ATV theme
const ReviewsSection = () => {
  const { t } = useTranslation();

  const reviews = [
    {
      name: t('services.standard.atvService.reviews.items.carlos.name'),
      rating: 5,
      text: t('services.standard.atvService.reviews.items.carlos.text'),
      date: t('services.standard.atvService.reviews.items.carlos.date'),
      vehicle: t('services.standard.atvService.reviews.items.carlos.vehicle'),
    },
    {
      name: t('services.standard.atvService.reviews.items.jennifer.name'),
      rating: 5,
      text: t('services.standard.atvService.reviews.items.jennifer.text'),
      date: t('services.standard.atvService.reviews.items.jennifer.date'),
      vehicle: t('services.standard.atvService.reviews.items.jennifer.vehicle'),
    },
    {
      name: t('services.standard.atvService.reviews.items.alex.name'),
      rating: 5,
      text: t('services.standard.atvService.reviews.items.alex.text'),
      date: t('services.standard.atvService.reviews.items.alex.date'),
      vehicle: t('services.standard.atvService.reviews.items.alex.vehicle'),
    },
  ];

  return (
    <section className='py-16 px-4 bg-gray-50'>
      <div className='max-w-5xl mx-auto'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl md:text-4xl font-bold mb-4 text-gray-800'>
            {t('services.standard.atvService.reviews.title')}{' '}
            <span className='text-green-500'>
              {t('services.standard.atvService.reviews.titleHighlight')}
            </span>
          </h2>
          <div className='flex justify-center items-center gap-1'>
            {[...Array(5)].map((_, i) => (
              <Star key={i} className='w-5 h-5 fill-amber-400 text-amber-400' />
            ))}
            <span className='ml-2 text-gray-600'>
              {t('services.standard.atvService.reviews.subtitle')}
            </span>
          </div>
        </div>

        <div className='grid md:grid-cols-3 gap-6'>
          {reviews.map((review, idx) => (
            <div
              key={idx}
              className='bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow'
            >
              <div className='flex gap-1 mb-3'>
                {[...Array(review.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className='w-4 h-4 fill-amber-400 text-amber-400'
                  />
                ))}
              </div>
              <p className='text-gray-700 mb-4'>"{review.text}"</p>
              <div className='flex justify-between items-center text-sm'>
                <div>
                  <p className='font-medium text-gray-800'>{review.name}</p>
                  <p className='text-green-600 text-xs'>{review.vehicle}</p>
                </div>
                <span className='text-gray-500'>{review.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Main Component with State Management
const AtvRideServiceView = () => {
  const { t } = useTranslation();
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { bookService } = useBooking();

  // Helper function to ensure we always get an array
  const getArrayFromTranslation = (key, fallback = []) => {
    const result = t(key, { returnObjects: true });
    return Array.isArray(result) ? result : fallback;
  };

  const service = {
    id: 'atv-adventure',
    name: t('services.standard.atvService.service.name'),
    type: 'ATV_EXPERIENCE',
    description: t('services.standard.atvService.service.description'),
    duration: t('services.standard.atvService.service.duration'),
    price: selectedVehicle?.price || 50,
    included: getArrayFromTranslation('atvService.service.included', [
      'Round-trip transportation',
      'Safety equipment',
      'Expert guide',
      'Photos',
    ]),
    packageType: selectedVehicle?.id?.includes('polaris')
      ? 'premium'
      : 'standard',
    vehicleType: selectedVehicle?.id || 'atv',
    maxParticipants: selectedVehicle?.maxParticipants || 2,
  };

  const handleBookingConfirm = (
    service: Service,
    dates: BookingDate,
    guests: number
  ) => {
    bookService(service, dates, guests);
    setIsModalOpen(false);
  };

  const handleBookNow = () => {
    setIsModalOpen(true);
  };

  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsModalOpen(true);
  };

  return (
    <div className='min-h-screen bg-white'>
      <HeroSection onBookNow={handleBookNow} />
      <QuickInfoSection />

      <div data-section='vehicle-selection'>
        <VehicleSelection onVehicleSelect={handleVehicleSelect} />
      </div>

      <PhotoGallery />
      <ItinerarySection />
      <InfoSection />
      <IncludesSection />

      <SpecialBanner onBookNow={handleBookNow} />

      <AdventureBanner />

      <ReviewsSection />

      {/* Cenote Important Notice */}
      <div className='mt-8   bg-red-50 border-2 border-red-300 rounded-xl p-6 mx-4 max-w-4xl lg:mx-auto'>
        <div className='flex items-start gap-4'>
          <Waves className='w-8 h-8 text-red-600 flex-shrink-0 mt-1' />
          <div>
            <h3 className='text-xl font-bold text-red-800 mb-3'>
              {t('services.standard.atvService.cenoteNotice.title')}
            </h3>
            <p className='text-red-700 font-medium mb-2'>
              {t('services.standard.atvService.cenoteNotice.description')}
            </p>
            <p className='text-red-600 text-sm'>
              {t('services.standard.atvService.cenoteNotice.note')}
            </p>
          </div>
        </div>
      </div>

      <div className='mt-6 text-center mx-4 max-w-4xl lg:mx-auto'>
        <div className='inline-flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full'>
          <Info className='w-4 h-4 text-blue-600' />
          <span className='text-blue-800 font-medium text-sm'>
            {t('services.standard.atvService.safetyNotice')}
          </span>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <BookingModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedVehicle(null);
            }}
            onConfirm={handleBookingConfirm}
            service={service}
            selectedVehicle={selectedVehicle}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AtvRideServiceView;
