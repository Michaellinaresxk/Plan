import React, { useState, useEffect, useMemo } from 'react';
import {
  ChevronRight,
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
} from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import BookingModal from '../../modal/BookingModal';
import { useBooking } from '@/context/BookingContext';
import { BookingDate, Service } from '@/constants/formFields';

// Vehicle Selection Types
const VEHICLE_TYPES = {
  ATV: {
    id: 'atv',
    name: 'ATV Quad',
    image:
      'https://res.cloudinary.com/ddg92xar5/image/upload/v1754595961/7_x4rptj.jpg',
    description: 'Single rider adventure',
    features: ['Solo riding', 'Easy handling', 'Perfect for beginners'],
    price: 89,
    duration: '3 hours',
    maxParticipants: 1,
  },
  BUGGY: {
    id: 'buggy',
    name: 'Dune Buggy',
    image:
      'https://res.cloudinary.com/ddg92xar5/image/upload/v1754597118/9_m5fya0.jpg',
    description: 'Shared adventure for couples',
    features: ['2-person capacity', 'Side by side', 'Great for couples'],
    price: 129,
    duration: '3 hours',
    maxParticipants: 2,
  },
  POLARIS: {
    id: 'polaris',
    name: 'Polaris RZR',
    image:
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    description: 'Premium off-road experience',
    features: ['High performance', 'Advanced suspension', 'Thrill seekers'],
    price: 159,
    duration: '3 hours',
    maxParticipants: 2,
  },
};

// Vehicle Selection Section
const VehicleSelection = ({ onVehicleSelect }) => {
  return (
    <section className='py-20 px-4 bg-gradient-to-br from-green-50 to-amber-50'>
      <div className='max-w-6xl mx-auto'>
        <div className='text-center mb-12'>
          <div className='inline-flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full mb-4'>
            <Sparkles className='w-4 h-4 text-green-600' />
            <span className='text-green-700 font-medium'>
              Choose Your Adventure
            </span>
          </div>
          <h2 className='text-3xl md:text-4xl font-bold text-gray-800 mb-4'>
            Select Your <span className='text-amber-500'>Off-Road Vehicle</span>
          </h2>
          <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
            Each vehicle offers a unique way to explore the tropical wilderness.
            Choose the perfect ride for your adventure level.
          </p>
        </div>

        <div className='grid md:grid-cols-3 gap-8'>
          {Object.values(VEHICLE_TYPES).map((vehicle) => (
            <div
              key={vehicle.id}
              className='group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer'
              onClick={() => onVehicleSelect(vehicle)}
            >
              {/* Vehicle Image */}
              <div className='relative h-48 overflow-hidden'>
                <img
                  src={vehicle.image}
                  alt={vehicle.name}
                  className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                />
                <div className='absolute top-4 right-4 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-semibold'>
                  ${vehicle.price}
                </div>
                <div className='absolute inset-0 bg-gradient-to-t from-black/30 to-transparent group-hover:from-black/40 transition-all duration-300' />
              </div>

              {/* Card Content */}
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
                    Max {vehicle.maxParticipants}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className='mt-12 text-center'>
          <div className='inline-flex items-center gap-6 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg'>
            <div className='flex items-center gap-2 text-sm text-gray-700'>
              <Shield className='w-4 h-4 text-green-500' />
              <span>All safety gear included</span>
            </div>
            <div className='flex items-center gap-2 text-sm text-gray-700'>
              <Clock className='w-4 h-4 text-blue-500' />
              <span>3-hour adventure</span>
            </div>
            <div className='flex items-center gap-2 text-sm text-gray-700'>
              <MapPin className='w-4 h-4 text-red-500' />
              <span>Tropical trails & beaches</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Updated Hero Section for ATV Adventures
const HeroSection = ({ onBookNow }) => {
  return (
    <div className='relative h-screen min-h-[600px] md:min-h-[700px] overflow-hidden'>
      {/* Parallax Background */}
      <div className='absolute inset-0'>
        <img
          src='https://res.cloudinary.com/ddg92xar5/image/upload/v1754595140/2_fhmcnt.jpg'
          alt='ATV adventures in tropical paradise'
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
              #1 Tropical Adventure
            </span>
          </div>

          <h1 className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 text-white'>
            ATV Adventures
            <span className='block text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-amber-400 mt-2'>
              Tropical Paradise
            </span>
          </h1>

          <p className='text-base sm:text-lg md:text-xl text-white/90 mb-8 md:mb-10 max-w-2xl'>
            Explore hidden beaches, jungle trails, and crystal-clear cenotes on
            the ultimate off-road adventure.
          </p>

          <div className='flex flex-col sm:flex-row gap-4 mb-8'>
            <button
              onClick={onBookNow}
              className='group bg-amber-500 hover:bg-amber-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold transition-all transform hover:scale-105 shadow-2xl inline-flex items-center justify-center gap-2'
            >
              Start Your Adventure
              <ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform' />
            </button>
          </div>

          <div className='flex flex-wrap gap-6 text-white/80 text-sm sm:text-base'>
            <div className='flex items-center gap-2'>
              <Star className='w-4 h-4 text-amber-400 fill-amber-400' />
              <span>4.9 Rating</span>
            </div>
            <div className='flex items-center gap-2'>
              <Clock className='w-4 h-4' />
              <span>3 Hours</span>
            </div>
            <div className='flex items-center gap-2'>
              <Users className='w-4 h-4' />
              <span>Small Groups</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Updated Photo Gallery for ATV Adventures
const PhotoGallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  const photos = [
    {
      src: 'https://res.cloudinary.com/ddg92xar5/image/upload/v1754595136/6_xkqjqa.jpg',
      alt: 'ATV jungle adventure',
      caption: 'Explore lush jungle trails',
      category: 'atv',
    },
    {
      src: 'https://res.cloudinary.com/ddg92xar5/image/upload/v1754595137/5_qkapnv.jpg',
      alt: 'Beach ATV riding',
      caption: 'Race along pristine beaches',
      category: 'buggies',
    },
    {
      src: 'https://res.cloudinary.com/ddg92xar5/image/upload/v1754595138/3_xanwzg.jpg',
      alt: 'Buggy adventure',
      caption: 'Discover hidden cenotes',
      category: '',
    },
    {
      src: 'https://res.cloudinary.com/ddg92xar5/image/upload/v1754596293/4_enh3k1.jpg',
      alt: 'Polaris sunset',
      caption: 'Sunset adventures',
      category: 'buggies',
    },
    {
      src: 'https://res.cloudinary.com/ddg92xar5/image/upload/v1754595961/7_x4rptj.jpg',
      alt: 'Polaris landscape',
      caption: 'Breathtaking landscapes',
      category: 'atv',
    },
  ];

  // Configuración de categorías
  const categories = [
    { id: 'all', label: 'All Vehicles', count: photos.length },
    {
      id: 'atv',
      label: 'ATV',
      count: photos.filter((p) => p.category === 'atv').length,
    },
    {
      id: 'buggies',
      label: 'Buggies',
      count: photos.filter((p) => p.category === 'buggies').length,
    },
    {
      id: 'polaris',
      label: 'Polaris',
      count: photos.filter((p) => p.category === 'polaris').length,
    },
  ];

  // Filtrar fotos según categoría activa
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
        {/* Header */}
        <div className='text-center mb-12'>
          <h2 className='text-3xl md:text-4xl font-bold text-gray-800 mb-4'>
            Adventure <span className='text-green-500'>Gallery</span>
          </h2>
          <p className='text-lg text-gray-600 mb-8'>
            See what awaits you on this tropical adventure
          </p>

          {/* Filtros */}
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

        {/* Grid de fotos - 2 columnas en móvil, 4 en desktop */}
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

              {/* Overlay con caption */}
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

        {/* Mensaje cuando no hay fotos */}
        {filteredPhotos.length === 0 && (
          <div className='text-center py-12'>
            <p className='text-gray-500 text-lg'>
              No photos found for this category
            </p>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
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
            aria-label='Close image'
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

            {/* Info overlay en lightbox */}
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

// Updated Quick Info for ATV Adventures
const QuickInfoSection = () => {
  const cards = [
    {
      icon: <MapPin className='w-5 h-5' />,
      title: 'Jungle & Beach',
      description: 'Explore diverse tropical terrain',
    },
    {
      icon: <Shield className='w-5 h-5' />,
      title: 'Safety First',
      description: 'Professional guides & gear',
    },
    {
      icon: <Clock className='w-5 h-5' />,
      title: '3 Hours',
      description: 'Action-packed adventure',
    },
    {
      icon: <Star className='w-5 h-5' />,
      title: '4.9 Rating',
      description: 'From 1,200+ adventurers',
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

// Updated Special Banner - Recibe onBookNow como prop
const SpecialBanner = ({ onBookNow }) => {
  return (
    <section className='relative py-32 overflow-hidden'>
      <div className='absolute inset-0'>
        <img
          src='https://res.cloudinary.com/ddg92xar5/image/upload/v1754596123/8_y6xwml.jpg'
          alt='ATV adventure through tropical paradise'
          className='w-full h-full object-cover'
        />
        <div className='absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent' />
      </div>

      <div className='relative z-10 max-w-6xl mx-auto px-4'>
        <div className='max-w-2xl'>
          <div className='inline-flex items-center gap-2 bg-green-500/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-green-400/30'>
            <Sparkles className='w-4 h-4 text-green-400' />
            <span className='text-green-200 text-sm font-medium'>
              Eco-Adventure Experience
            </span>
          </div>

          <h2 className='text-4xl md:text-5xl font-bold text-white mb-6'>
            Off-Road Adventure
            <span className='block text-amber-400'>Through Paradise</span>
          </h2>

          <p className='text-lg text-white/90 mb-8'>
            Navigate through tropical jungles, splash through crystal-clear
            rivers, and discover hidden beaches on the ultimate ATV adventure.
            Our eco-friendly tours respect nature while delivering maximum
            thrills.
          </p>

          <div className='flex flex-wrap gap-6 mb-8'>
            <div className='flex items-center gap-2 text-white'>
              <Heart className='w-5 h-5 text-red-400' />
              <span>Eco-Friendly</span>
            </div>
            <div className='flex items-center gap-2 text-white'>
              <Shield className='w-5 h-5 text-green-400' />
              <span>Certified Guides</span>
            </div>
            <div className='flex items-center gap-2 text-white'>
              <Star className='w-5 h-5 text-amber-400' />
              <span>Premium Equipment</span>
            </div>
          </div>

          <button
            onClick={onBookNow}
            className='bg-gradient-to-r from-amber-500 to-green-500 hover:from-amber-600 hover:to-green-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all transform hover:scale-105 shadow-2xl'
          >
            Book Your ATV Adventure
          </button>
        </div>
      </div>
    </section>
  );
};

// Updated Includes Section
const IncludesSection = () => {
  const includes = [
    'Round-trip hotel transportation',
    'Professional ATV/Buggy/Polaris',
    'Safety equipment & briefing',
    'Expert bilingual guide',
    'Jungle & beach exploration',
    'Cenote swimming opportunity',
    'Tropical fruit tasting',
    'Action photos included',
  ];

  return (
    <section className='py-16 px-4 bg-white'>
      <div className='max-w-4xl mx-auto'>
        <h2 className='text-3xl font-bold text-center mb-10 text-gray-800'>
          Everything <span className='text-green-500'>Included</span>
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {includes.map((item, idx) => (
            <div
              key={idx}
              className='flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'
            >
              <Check className='w-5 h-5 text-green-500 flex-shrink-0' />
              <span className='text-gray-700 font-medium'>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Updated Adventure Banner
const AdventureBanner = () => {
  return (
    <section className='relative py-24 overflow-hidden bg-gradient-to-br from-green-50 to-amber-50'>
      <div className='max-w-6xl mx-auto px-4'>
        <div className='grid lg:grid-cols-2 gap-12 items-center'>
          <div>
            <h2 className='text-3xl md:text-4xl font-bold text-gray-800 mb-6'>
              Why Choose Our
              <span className='text-green-500'> ATV Adventures?</span>
            </h2>

            <div className='space-y-6'>
              <div className='flex items-start gap-4'>
                <div className='w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0'>
                  <Check className='w-5 h-5 text-green-600' />
                </div>
                <div>
                  <h3 className='font-semibold text-gray-800 mb-2'>
                    Diverse Terrain Exploration
                  </h3>
                  <p className='text-gray-600'>
                    From dense jungle trails to pristine beaches and refreshing
                    cenotes, experience the full spectrum of tropical paradise.
                  </p>
                </div>
              </div>

              <div className='flex items-start gap-4'>
                <div className='w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0'>
                  <Check className='w-5 h-5 text-amber-600' />
                </div>
                <div>
                  <h3 className='font-semibold text-gray-800 mb-2'>
                    Premium Equipment Fleet
                  </h3>
                  <p className='text-gray-600'>
                    Choose from ATVs, Buggies, or Polaris RZRs - all regularly
                    maintained and equipped with latest safety features.
                  </p>
                </div>
              </div>

              <div className='flex items-start gap-4'>
                <div className='w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0'>
                  <Check className='w-5 h-5 text-blue-600' />
                </div>
                <div>
                  <h3 className='font-semibold text-gray-800 mb-2'>
                    Eco-Responsible Tourism
                  </h3>
                  <p className='text-gray-600'>
                    We follow strict environmental guidelines to preserve the
                    natural beauty for future generations.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className='relative'>
            <div className='rounded-2xl overflow-hidden shadow-2xl'>
              <img
                src='https://res.cloudinary.com/ddg92xar5/image/upload/v1754595140/2_fhmcnt.jpg'
                alt='ATV adventure group'
                className='w-full h-[400px] object-cover'
              />
            </div>
            <div className='absolute -bottom-6 -right-6 bg-white rounded-xl shadow-lg p-4'>
              <div className='flex items-center gap-3'>
                <div className='w-12 h-12 bg-gradient-to-br from-green-100 to-amber-100 rounded-full flex items-center justify-center'>
                  <Sparkles className='w-6 h-6 text-green-600' />
                </div>
                <div>
                  <p className='text-xl font-bold text-gray-800'>Premium</p>
                  <p className='text-xs text-gray-600'>Adventure</p>
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
  const reviews = [
    {
      name: 'Carlos Rodriguez',
      rating: 5,
      text: 'Incredible ATV adventure! The jungle trails were amazing and the cenote swim was refreshing.',
      date: '3 days ago',
      vehicle: 'Polaris RZR',
    },
    {
      name: 'Jennifer Smith',
      rating: 5,
      text: 'Perfect for beginners! Our guide was patient and the buggy was easy to handle. Loved every minute!',
      date: '1 week ago',
      vehicle: 'Dune Buggy',
    },
    {
      name: 'Alex Thompson',
      rating: 5,
      text: 'Best excursion in Punta Cana! The ATV was powerful and the routes were thrilling but safe.',
      date: '2 weeks ago',
      vehicle: 'ATV Quad',
    },
  ];

  return (
    <section className='py-16 px-4 bg-gray-50'>
      <div className='max-w-5xl mx-auto'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl md:text-4xl font-bold mb-4 text-gray-800'>
            Adventure <span className='text-green-500'>Stories</span>
          </h2>
          <div className='flex justify-center items-center gap-1'>
            {[...Array(5)].map((_, i) => (
              <Star key={i} className='w-5 h-5 fill-amber-400 text-amber-400' />
            ))}
            <span className='ml-2 text-gray-600'>
              4.9 from 1,200+ adventures
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

// Main Component with State Management - IGUAL QUE YOGA
const AtvRideServiceView = () => {
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { bookService } = useBooking();

  const service = {
    id: 'atv-adventure',
    name: 'ATV Adventure',
    type: 'ATV_EXPERIENCE',
    description: 'Tropical paradise off-road adventure',
    duration: '3 hours',
    price: selectedVehicle?.price || 89, // Precio dinámico basado en vehículo seleccionado
    included: [
      'Round-trip transportation',
      'Safety equipment',
      'Expert guide',
      'Photos',
    ],
    packageType: selectedVehicle?.id === 'polaris' ? 'premium' : 'standard',
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

  // Función para abrir el modal - IGUAL QUE YOGA
  const handleBookNow = () => {
    setIsModalOpen(true);
  };

  // Handle vehicle selection - ACTUALIZADO
  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsModalOpen(true);
  };

  return (
    <div className='min-h-screen bg-white'>
      <HeroSection onBookNow={handleBookNow} />
      <QuickInfoSection />

      {/* Vehicle Selection Section */}
      <div data-section='vehicle-selection'>
        <VehicleSelection onVehicleSelect={handleVehicleSelect} />
      </div>

      <PhotoGallery />
      <IncludesSection />

      {/* CORREGIDO: Pasar handleBookNow como prop */}
      <SpecialBanner onBookNow={handleBookNow} />

      <AdventureBanner />
      <ReviewsSection />

      {/* Booking Modal - IGUAL QUE YOGA */}
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
