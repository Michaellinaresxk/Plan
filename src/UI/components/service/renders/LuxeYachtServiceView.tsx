import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Anchor,
  Users,
  Star,
  MapPin,
  Clock,
  Wifi,
  Utensils,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Phone,
  Mail,
  ArrowRight,
  CheckCircle,
  Crown,
  Diamond,
  Camera,
  X,
  Check,
  Shirt,
  Sun,
  Heart,
  Shield,
  Award,
  Waves,
  Coffee,
  Fish,
  Sunset,
  Navigation,
  Play,
  Eye,
  Share2,
  Sparkles,
  Info,
  Palmtree,
  Wind,
  BedDouble,
  Zap,
  Music,
  Droplets,
  Globe,
} from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/client';

// Types
interface Yacht {
  id: string;
  name: string;
  category: 'catamaran' | 'luxury';
  shortDescription: string;
  mainImage: string;
  gallery: string[];
  specifications: {
    length: string;
    maxGuests: number;
    cabins: number;
    bathrooms: number;
    crew: number;
    maxSpeed: string;
    manufacturer: string;
    year: number;
  };
  amenities: Array<{
    icon: React.ReactNode;
    name: string;
    description: string;
  }>;
  highlights: string[];
  isPremium: boolean;
  rating: number;
  reviews: number;
  location: string;
  itinerary: string[];
}

// Caribbean Hero with Yacht Background
const CinematicHero: React.FC<{ onBookingClick: () => void }> = ({
  onBookingClick,
}) => {
  const { t } = useTranslation();
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
          poster='https://res.cloudinary.com/ddg92xar5/image/upload/v1754600018/2_dc7fry.jpg'
        >
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
        className='relative z-10 h-full flex items-end'
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
                  {t('services.premium.luxYachtView.hero.badgeLabel')}
                </span>
                <Diamond className='w-5 h-5 text-cyan-400' />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className='text-5xl lg:text-7xl font-thin mb-6 leading-tight'
              >
                {t('services.premium.luxYachtView.hero.titleLine1')}
                <span className='block font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent'>
                  {t('services.premium.luxYachtView.hero.titleLine2')}
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
                className='text-xl lg:text-2xl text-gray-300 mb-8 leading-relaxed max-w-lg'
              >
                {t('services.premium.luxYachtView.hero.description')}
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
              className='hidden lg:block'
            >
              <div className='relative'>
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
    </div>
  );
};

// Minimalist Photo-Only Cards
const PhotoOnlyYachtCard: React.FC<{ yacht: Yacht; onSelect: () => void }> = ({
  yacht,
  onSelect,
}) => {
  const { t } = useTranslation();

  return (
    <div
      className='group relative h-50 lg:h-80 rounded-3xl overflow-hidden cursor-pointer transform transition-all duration-500 hover:scale-[1.02] hover:shadow-xl'
      onClick={onSelect}
    >
      {/* Background Image */}
      <img
        src={yacht.mainImage}
        alt={yacht.name}
        className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
      />

      {/* Gradient Overlay */}
      <div className='absolute inset-0 bg-gradient-to-t from-blue-900/70 via-transparent to-transparent' />

      {/* Premium Badge */}
      {yacht.isPremium && (
        <div className='absolute top-4 right-4 bg-gradient-to-r from-coral-400 to-orange-400 text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1'>
          <Crown className='w-3 h-3' />
          {t('services.premium.luxYachtView.yachtGrid.cardPremiumBadge')}
        </div>
      )}

      {/* Text Content Inside */}
      <div className='absolute bottom-0 left-0 right-0 p-5 text-white'>
        <div className='flex items-center justify-between'>
          <h3 className='text-1xl md:text-2xl font-semibold mb-2 group-hover:text-teal-300 transition-colors'>
            {yacht.name}
          </h3>
          <div className='text-right'>
            <div className='flex items-center gap-1'>
              <Users className='w-4 h-4' />
              <span>{yacht.specifications.maxGuests}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Yacht Grid Section
const CaribbeanYachtGrid: React.FC<{
  onYachtSelect: (yacht: Yacht) => void;
  yachtData: Yacht[];
}> = ({ onYachtSelect, yachtData }) => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState('all');

  const filteredYachts = useMemo(() => {
    return filter === 'all'
      ? yachtData
      : yachtData.filter((yacht) => yacht.category === filter);
  }, [filter, yachtData]);

  return (
    <section
      id='fleet'
      className='py-24 bg-gradient-to-br from-teal-50/30 to-blue-50/30'
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='text-center mb-16'>
          <div className='inline-flex items-center gap-2 bg-teal-100/50 backdrop-blur-sm px-6 py-3 rounded-full mb-8 border border-teal-200/50'>
            <Anchor className='w-5 h-5 text-teal-700' />
            <span className='text-teal-800 text-sm font-medium tracking-wide'>
              {t('services.premium.luxYachtView.yachtGrid.badgeLabel')}
            </span>
          </div>

          <h2 className='text-3xl sm:text-5xl font-light text-gray-900 mb-6'>
            {t('services.premium.luxYachtView.yachtGrid.titlePrefix')}{' '}
            <span className='font-normal text-teal-600'>
              {t('services.premium.luxYachtView.yachtGrid.titleSuffix')}
            </span>
          </h2>
          <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
            {t('services.premium.luxYachtView.yachtGrid.description')}
          </p>
        </div>

        {/* Filters */}
        <div className='flex justify-center mb-12'>
          <div className='inline-flex bg-white/70 backdrop-blur-sm rounded-full p-1 shadow-sm border border-white/50'>
            {[
              {
                id: 'all',
                name: t('services.premium.luxYachtView.yachtGrid.filterAll'),
              },
              {
                id: 'catamaran',
                name: t(
                  'services.premium.luxYachtView.yachtGrid.filterCatamaran'
                ),
              },
              {
                id: 'luxury',
                name: t('services.premium.luxYachtView.yachtGrid.filterLuxury'),
              },
            ].map((category) => (
              <button
                key={category.id}
                onClick={() => setFilter(category.id)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                  filter === category.id
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Yacht Grid */}
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 md:gap-6'>
          {filteredYachts.map((yacht) => (
            <PhotoOnlyYachtCard
              key={yacht.id}
              yacht={yacht}
              onSelect={() => onYachtSelect(yacht)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// Real Gallery Section with Lightbox
const CaribbeanGallery: React.FC = () => {
  const { t } = useTranslation();
  const [selectedImage, setSelectedImage] = useState<{
    src: string;
    caption: string;
  } | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');

  const galleryImages = [
    {
      src: 'https://res.cloudinary.com/ddg92xar5/image/upload/v1754600018/2_dc7fry.jpg',
      category: 'yachts',
      caption: 'Luxury yacht at sunset',
    },
    {
      src: 'https://res.cloudinary.com/ddg92xar5/image/upload/v1754600017/3_eapwql.jpg',
      category: 'destinations',
      caption: 'Crystal clear Caribbean waters',
    },
    {
      src: 'https://res.cloudinary.com/ddg92xar5/image/upload/v1754600209/3_dvbeqw.jpg',
      category: 'experiences',
      caption: 'Snorkeling in paradise',
    },
    {
      src: 'https://res.cloudinary.com/ddg92xar5/image/upload/v1755956399/3380551b-f82f-4fdc-86e2-47cf2ad3a6dc_foh9sp.jpg',
      category: 'yachts',
      caption: 'Princess yacht interior',
    },
    {
      src: 'https://res.cloudinary.com/ddg92xar5/image/upload/v1754600208/2_k72tfn.jpg',
      category: 'experiences',
      caption: 'Water sports adventure',
    },
  ];

  const categories = [
    {
      id: 'all',
      label: t('services.premium.luxYachtView.gallery.categoryAll'),
      count: galleryImages.length,
    },
    {
      id: 'yachts',
      label: t('services.premium.luxYachtView.gallery.categoryYachts'),
      count: galleryImages.filter((img) => img.category === 'yachts').length,
    },
    {
      id: 'experiences',
      label: t('services.premium.luxYachtView.gallery.categoryExperiences'),
      count: galleryImages.filter((img) => img.category === 'experiences')
        .length,
    },
    {
      id: 'destinations',
      label: t('services.premium.luxYachtView.gallery.categoryDestinations'),
      count: galleryImages.filter((img) => img.category === 'destinations')
        .length,
    },
  ];

  const filteredImages = useMemo(() => {
    return activeCategory === 'all'
      ? galleryImages
      : galleryImages.filter((img) => img.category === activeCategory);
  }, [activeCategory]);

  return (
    <section className='py-24 bg-white'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='text-center mb-16'>
          <div className='inline-flex items-center gap-2 bg-blue-100/50 backdrop-blur-sm px-6 py-3 rounded-full mb-8 border border-blue-200/50'>
            <Camera className='w-5 h-5 text-blue-700' />
            <span className='text-blue-800 text-sm font-medium tracking-wide'>
              {t('services.premium.luxYachtView.gallery.badgeLabel')}
            </span>
          </div>

          <h2 className='text-3xl sm:text-5xl font-light text-gray-900 mb-6'>
            {t('services.premium.luxYachtView.gallery.titlePrefix')}{' '}
            <span className='font-normal text-blue-600'>
              {t('services.premium.luxYachtView.gallery.titleSuffix')}
            </span>
          </h2>
          <p className='text-lg text-gray-600 mb-8'>
            {t('services.premium.luxYachtView.gallery.description')}
          </p>

          {/* Category Filters */}
          <div className='flex flex-wrap justify-center gap-3'>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === category.id
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.label}{' '}
                <span className='opacity-70'>({category.count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Image Grid */}
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
          {filteredImages.map((image, index) => (
            <div
              key={`${image.category}-${index}`}
              className={`group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
                index === 0 ? 'md:col-span-2 md:row-span-2' : ''
              }`}
              onClick={() => setSelectedImage(image)}
            >
              <div
                className={`${
                  index === 0
                    ? 'h-full min-h-[200px] md:min-h-[350px]'
                    : 'aspect-square'
                } bg-gray-100`}
              >
                <img
                  src={image.src}
                  alt={image.caption}
                  className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
                />
              </div>

              {/* Overlay */}
              <div className='absolute inset-0 bg-gradient-to-t from-blue-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                <div className='absolute bottom-4 left-4 text-white'>
                  <p className='font-medium text-sm md:text-base'>
                    {image.caption}
                  </p>
                  <p className='text-xs opacity-80 capitalize'>
                    {image.category}
                  </p>
                </div>
                <div className='absolute top-4 right-4'>
                  <div className='w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center'>
                    <Eye className='w-4 h-4 text-white' />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className='fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4'
          onClick={() => setSelectedImage(null)}
        >
          <button
            className='absolute top-6 right-6 text-white hover:text-gray-300 z-50 p-2 rounded-full hover:bg-white/10 transition-colors'
            onClick={() => setSelectedImage(null)}
          >
            <X className='w-8 h-8' />
          </button>

          <div className='relative'>
            <img
              src={selectedImage.src}
              alt={selectedImage.caption}
              className='max-w-full max-h-[85vh] rounded-lg'
              onClick={(e) => e.stopPropagation()}
            />
            <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg'>
              <h3 className='text-white font-semibold text-lg'>
                {selectedImage.caption}
              </h3>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

// What to Bring - Caribbean Style
const CaribbeanWhatToBring: React.FC = () => {
  const { t } = useTranslation();

  const whatToBringItems = [
    {
      icon: Sun,
      title: t('services.premium.luxYachtView.whatToBring.sunProtectionTitle'),
      description: t(
        'services.premium.luxYachtView.whatToBring.sunProtectionDesc'
      ),
    },
    {
      icon: Shirt,
      title: t('services.premium.luxYachtView.whatToBring.clothingTitle'),
      description: t('services.premium.luxYachtView.whatToBring.clothingDesc'),
    },
    {
      icon: Camera,
      title: t('services.premium.luxYachtView.whatToBring.cameraTitle'),
      description: t('services.premium.luxYachtView.whatToBring.cameraDesc'),
    },
    {
      icon: Wind,
      title: t('services.premium.luxYachtView.whatToBring.jacketTitle'),
      description: t('services.premium.luxYachtView.whatToBring.jacketDesc'),
    },
  ];

  return (
    <section className='py-24 bg-gradient-to-br from-teal-50/50 to-blue-50/50'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center mb-16'>
          <div className='inline-flex items-center gap-2 bg-teal-100/50 backdrop-blur-sm px-6 py-3 rounded-full mb-8 border border-teal-200/50'>
            <Shirt className='w-5 h-5 text-teal-700' />
            <span className='text-teal-800 text-sm font-medium tracking-wide'>
              {t('services.premium.luxYachtView.whatToBring.badgeLabel')}
            </span>
          </div>

          <h2 className='text-3xl sm:text-5xl font-light text-gray-900 mb-6'>
            {t('services.premium.luxYachtView.whatToBring.titlePrefix')}{' '}
            <span className='font-normal text-teal-600'>
              {t('services.premium.luxYachtView.whatToBring.titleSuffix')}
            </span>
          </h2>
          <p className='text-lg text-gray-600'>
            {t('services.premium.luxYachtView.whatToBring.description')}
          </p>
        </div>

        <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
          {whatToBringItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div
                key={index}
                className='text-center p-6 bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 border border-white/50'
              >
                <div className='w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <IconComponent className='w-8 h-8 text-teal-600' />
                </div>
                <h3 className='font-semibold text-gray-900 mb-2'>
                  {item.title}
                </h3>
                <p className='text-gray-600 text-sm leading-relaxed'>
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* We Provide Section */}
        <div className='mt-16 bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/50'>
          <div className='flex items-start gap-4'>
            <div className='w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0'>
              <Check className='w-5 h-5 text-teal-600' />
            </div>
            <div>
              <h4 className='font-semibold text-gray-900 mb-3'>
                {t('services.premium.luxYachtView.whatToBring.weProvideTitle')}
              </h4>
              <p className='text-gray-700 leading-relaxed'>
                {t('services.premium.luxYachtView.whatToBring.weProvideDesc')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Updated Private Service Info Section
const PrivateServiceInfo: React.FC = () => {
  const { t } = useTranslation();

  const serviceInfo = [
    {
      id: 1,
      icon: Clock,
      title: t('services.premium.luxYachtView.privateService.flexibleTitle'),
      time: t('services.premium.luxYachtView.privateService.flexibleTime'),
      description: t(
        'services.premium.luxYachtView.privateService.flexibleDesc'
      ),
    },
    {
      id: 2,
      icon: Users,
      title: t('services.premium.luxYachtView.privateService.privateTitle'),
      time: t('services.premium.luxYachtView.privateService.privateTime'),
      description: t(
        'services.premium.luxYachtView.privateService.privateDesc'
      ),
    },
    {
      id: 3,
      icon: Navigation,
      title: t('services.premium.luxYachtView.privateService.customTitle'),
      time: t('services.premium.luxYachtView.privateService.customTime'),
      description: t('services.premium.luxYachtView.privateService.customDesc'),
    },
    {
      id: 4,
      icon: Utensils,
      title: t('services.premium.luxYachtView.privateService.gourmetTitle'),
      time: t('services.premium.luxYachtView.privateService.gourmetTime'),
      description: t(
        'services.premium.luxYachtView.privateService.gourmetDesc'
      ),
    },
    {
      id: 5,
      icon: Waves,
      title: t('services.premium.luxYachtView.privateService.activitiesTitle'),
      time: t('services.premium.luxYachtView.privateService.activitiesTime'),
      description: t(
        'services.premium.luxYachtView.privateService.activitiesDesc'
      ),
    },
    {
      id: 6,
      icon: Calendar,
      title: t('services.premium.luxYachtView.privateService.bookingTitle'),
      time: t('services.premium.luxYachtView.privateService.bookingTime'),
      description: t(
        'services.premium.luxYachtView.privateService.bookingDesc'
      ),
    },
  ];

  return (
    <section className='py-24 bg-white'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center mb-16'>
          <div className='inline-flex items-center gap-2 bg-blue-100/50 backdrop-blur-sm px-6 py-3 rounded-full mb-8 border border-blue-200/50'>
            <Users className='w-5 h-5 text-blue-700' />
            <span className='text-blue-800 text-sm font-medium tracking-wide'>
              {t('services.premium.luxYachtView.privateService.badgeLabel')}
            </span>
          </div>

          <h2 className='text-3xl sm:text-5xl font-light text-gray-900 mb-6'>
            {t('services.premium.luxYachtView.privateService.titlePrefix')}{' '}
            <span className='font-normal text-blue-600'>
              {t('services.premium.luxYachtView.privateService.titleSuffix')}
            </span>
          </h2>
          <p className='text-lg text-gray-600 mb-4'>
            {t('services.premium.luxYachtView.privateService.description')}
          </p>
          <p className='text-sm text-teal-600 font-medium'>
            {t('services.premium.luxYachtView.privateService.subtitle')}
          </p>
        </div>

        {/* Two Column Grid */}
        <div className='grid grid-cols-2 gap-4 md:gap-6'>
          {serviceInfo.map((info) => {
            const IconComponent = info.icon;
            return (
              <div
                key={info.id}
                className='bg-gradient-to-br from-white/80 to-teal-50/30 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-white/50 shadow-sm hover:shadow-md transition-all duration-300'
              >
                <div className='flex items-start gap-3 md:gap-4'>
                  <div className='w-10 h-10 md:w-12 md:h-12 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0'>
                    <IconComponent className='w-5 h-5 md:w-6 md:h-6 text-teal-600' />
                  </div>

                  <div className='flex-1 min-w-0'>
                    <div className='flex flex-col md:flex-row md:items-center md:justify-between mb-2'>
                      <h3 className='font-semibold text-gray-900 text-sm md:text-base'>
                        {info.title}
                      </h3>
                      <span className='text-xs md:text-sm font-mono text-teal-600 bg-teal-100 px-2 py-1 rounded-full mt-1 md:mt-0 self-start'>
                        {info.time}
                      </span>
                    </div>
                    <p className='text-gray-600 text-xs md:text-sm leading-relaxed'>
                      {info.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Customization Note */}
        <div className='mt-16 text-center'>
          <div className='inline-flex items-center gap-3 bg-gradient-to-r from-teal-50 to-blue-50 rounded-2xl px-8 py-4 border border-teal-100'>
            <Sparkles className='w-5 h-5 text-teal-600' />
            <span className='text-gray-700 font-medium'>
              {t('services.premium.luxYachtView.privateService.noteText')}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

// Important Info Section
const YachtImportantInfo: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className='py-24 bg-gradient-to-br from-blue-50/50 to-teal-50/50'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/50 shadow-lg'>
          <div className='flex items-start gap-4 mb-8'>
            <div className='w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0'>
              <Info className='w-6 h-6 text-blue-600' />
            </div>
            <div>
              <h3 className='text-2xl font-semibold text-gray-900 mb-2'>
                {t('services.premium.luxYachtView.importantInfo.title')}
              </h3>
              <p className='text-gray-600'>
                {t('services.premium.luxYachtView.importantInfo.subtitle')}
              </p>
            </div>
          </div>

          <div className='space-y-6'>
            {/* Availability */}
            <div className='flex items-start gap-3'>
              <Calendar className='w-5 h-5 text-teal-600 mt-1 flex-shrink-0' />
              <div>
                <h4 className='font-semibold text-gray-900 mb-1'>
                  {t(
                    'services.premium.luxYachtView.importantInfo.availabilityTitle'
                  )}
                </h4>
                <p className='text-gray-700 leading-relaxed'>
                  {t(
                    'services.premium.luxYachtView.importantInfo.availabilityDesc'
                  )}
                </p>
              </div>
            </div>

            {/* Confirmation */}
            <div className='flex items-start gap-3'>
              <CheckCircle className='w-5 h-5 text-teal-600 mt-1 flex-shrink-0' />
              <div>
                <h4 className='font-semibold text-gray-900 mb-1'>
                  {t(
                    'services.premium.luxYachtView.importantInfo.confirmationTitle'
                  )}
                </h4>
                <p className='text-gray-700 leading-relaxed'>
                  {t(
                    'services.premium.luxYachtView.importantInfo.confirmationDesc'
                  )}
                </p>
              </div>
            </div>

            {/* Additional Services */}
            <div className='flex items-start gap-3'>
              <Sparkles className='w-5 h-5 text-teal-600 mt-1 flex-shrink-0' />
              <div>
                <h4 className='font-semibold text-gray-900 mb-1'>
                  {t(
                    'services.premium.luxYachtView.importantInfo.servicesTitle'
                  )}
                </h4>
                <p className='text-gray-700 leading-relaxed mb-3'>
                  {t(
                    'services.premium.luxYachtView.importantInfo.servicesDesc'
                  )}
                </p>
                <div className='flex flex-wrap gap-2'>
                  <span className='px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium'>
                    {t(
                      'services.premium.luxYachtView.importantInfo.serviceFood'
                    )}
                  </span>
                  <span className='px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium'>
                    {t(
                      'services.premium.luxYachtView.importantInfo.serviceDecoration'
                    )}
                  </span>
                  <span className='px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium'>
                    {t(
                      'services.premium.luxYachtView.importantInfo.serviceEntertainment'
                    )}
                  </span>
                  <span className='px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium'>
                    {t(
                      'services.premium.luxYachtView.importantInfo.serviceRefreshments'
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className='flex items-start gap-3'>
              <Shield className='w-5 h-5 text-teal-600 mt-1 flex-shrink-0' />
              <div>
                <h4 className='font-semibold text-gray-900 mb-1'>
                  {t(
                    'services.premium.luxYachtView.importantInfo.paymentTitle'
                  )}
                </h4>
                <p className='text-gray-700 leading-relaxed'>
                  {t('services.premium.luxYachtView.importantInfo.paymentDesc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Enhanced Modal for Yacht Details
const YachtDetailsModal: React.FC<{
  yacht: Yacht;
  onClose: () => void;
  onBook: () => void;
}> = ({ yacht, onClose, onBook }) => {
  const { t } = useTranslation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className='fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
      <div className='bg-white rounded-3xl max-w-6xl w-full h-[95vh] overflow-hidden shadow-2xl flex flex-col lg:flex-row'>
        {/* Left Side - Gallery */}
        <div className='lg:w-3/5 flex flex-col min-h-0'>
          {/* Header */}
          <div className='p-6 border-b border-gray-200 flex justify-between items-center flex-shrink-0'>
            <div>
              <h2 className='text-2xl font-semibold text-gray-900'>
                {yacht.name}
              </h2>
              <div className='flex items-center gap-4 mt-1'>
                <span className='text-gray-500'>
                  {yacht.specifications.length}
                </span>
                <span className='text-gray-300'>•</span>
                <div className='flex items-center gap-1'>
                  <Star className='w-4 h-4 text-yellow-400 fill-yellow-400' />
                  <span className='text-gray-600'>
                    {yacht.rating} ({yacht.reviews})
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className='w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors'
            >
              <X className='w-5 h-5' />
            </button>
          </div>

          {/* Gallery */}
          <div className='relative flex-1 bg-gray-100 min-h-0'>
            <img
              src={yacht.gallery[currentImageIndex]}
              alt={`${yacht.name} - Image ${currentImageIndex + 1}`}
              className='w-full h-full object-cover'
            />

            {/* Image Counter */}
            <div className='absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm'>
              {currentImageIndex + 1} / {yacht.gallery.length}
            </div>

            {/* Thumbnails */}
            <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2'>
              {yacht.gallery.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-12 h-8 rounded-md overflow-hidden border-2 transition-all ${
                    index === currentImageIndex
                      ? 'border-white'
                      : 'border-white/50'
                  }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className='w-full h-full object-cover'
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Details */}
        <div className='lg:w-2/5 flex flex-col min-h-0'>
          {/* Availability Info */}
          <div className='p-6 border-b border-gray-200 bg-gradient-to-br from-teal-50/50 to-blue-50/50 flex-shrink-0'>
            <div className='text-center mb-4'>
              <div className='inline-flex items-center gap-2 bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-semibold mb-3'>
                <Calendar className='w-4 h-4' />
                {t('services.premium.luxYachtView.modal.availableOnRequest')}
              </div>
              <p className='text-gray-600 text-sm'>
                {t('services.premium.luxYachtView.modal.availabilityNote')}
              </p>
            </div>

            {yacht.isPremium && (
              <div className='flex justify-center mb-4'>
                <div className='bg-gradient-to-r from-coral-400 to-orange-400 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1'>
                  <Crown className='w-3 h-3' />
                  {t(
                    'services.premium.luxYachtView.yachtGrid.cardPremiumBadge'
                  )}
                </div>
              </div>
            )}

            <button
              onClick={onBook}
              className='w-full bg-teal-600 hover:bg-teal-700 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2'
            >
              <Calendar className='w-5 h-5' />
              {t('services.premium.luxYachtView.modal.ctaBook')}
            </button>
          </div>

          {/* Tabs */}
          <div className='border-b border-gray-200 bg-gray-50 flex-shrink-0'>
            <div className='flex'>
              {[
                {
                  id: 'overview',
                  name: t('services.premium.luxYachtView.modal.tabOverview'),
                },
                {
                  id: 'itinerary',
                  name: t('services.premium.luxYachtView.modal.tabItinerary'),
                },
                {
                  id: 'amenities',
                  name: t('services.premium.luxYachtView.modal.tabAmenities'),
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-teal-600 text-teal-600 bg-white'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className='flex-1 min-h-0 overflow-y-auto p-6 pb-30'>
            {activeTab === 'overview' && (
              <div className='space-y-6'>
                <div>
                  <h3 className='font-semibold text-gray-900 mb-3'>
                    {t('services.premium.luxYachtView.modal.overviewTitle')}
                  </h3>
                  <p className='text-gray-600 leading-relaxed'>
                    {yacht.shortDescription}
                  </p>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  {[
                    {
                      label: t(
                        'services.premium.luxYachtView.modal.specLength'
                      ),
                      value: yacht.specifications.length,
                      icon: <Anchor className='w-4 h-4' />,
                    },
                    {
                      label: t(
                        'services.premium.luxYachtView.modal.specGuests'
                      ),
                      value: yacht.specifications.maxGuests,
                      icon: <Users className='w-4 h-4' />,
                    },
                    {
                      label: t(
                        'services.premium.luxYachtView.modal.specCabins'
                      ),
                      value: yacht.specifications.cabins,
                      icon: <BedDouble className='w-4 h-4' />,
                    },
                    {
                      label: t('services.premium.luxYachtView.modal.specSpeed'),
                      value: yacht.specifications.maxSpeed,
                      icon: <Zap className='w-4 h-4' />,
                    },
                  ].map((spec, index) => (
                    <div
                      key={index}
                      className='text-center p-3 bg-teal-50 rounded-lg'
                    >
                      <div className='flex justify-center mb-2 text-teal-600'>
                        {spec.icon}
                      </div>
                      <div className='font-bold text-gray-900'>
                        {spec.value}
                      </div>
                      <div className='text-xs text-gray-500'>{spec.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'itinerary' && (
              <div>
                <h3 className='font-semibold text-gray-900 mb-4'>
                  {t('services.premium.luxYachtView.modal.itineraryTitle')}
                </h3>
                <div className='space-y-4 mb-6'>
                  <div className='p-4 bg-teal-50 rounded-lg'>
                    <h4 className='font-semibold text-teal-900 mb-2'>
                      {t(
                        'services.premium.luxYachtView.modal.itineraryScheduleTitle'
                      )}
                    </h4>
                    <p className='text-teal-700 text-sm'>
                      {t(
                        'services.premium.luxYachtView.modal.itineraryScheduleDesc'
                      )}
                    </p>
                  </div>
                  <div className='p-4 bg-blue-50 rounded-lg'>
                    <h4 className='font-semibold text-blue-900 mb-2'>
                      {t(
                        'services.premium.luxYachtView.modal.itineraryPrivateTitle'
                      )}
                    </h4>
                    <p className='text-blue-700 text-sm'>
                      {t(
                        'services.premium.luxYachtView.modal.itineraryPrivateDesc'
                      )}
                    </p>
                  </div>
                  <div className='p-4 bg-green-50 rounded-lg'>
                    <h4 className='font-semibold text-green-900 mb-2'>
                      {t(
                        'services.premium.luxYachtView.modal.itineraryBookingTitle'
                      )}
                    </h4>
                    <p className='text-green-700 text-sm'>
                      {t(
                        'services.premium.luxYachtView.modal.itineraryBookingDesc'
                      )}
                    </p>
                  </div>
                </div>
                <div className='space-y-3'>
                  <h4 className='font-semibold text-gray-900'>
                    {t(
                      'services.premium.luxYachtView.modal.itineraryOptionsLabel'
                    )}
                  </h4>
                  {yacht.itinerary.map((item, index) => (
                    <div
                      key={index}
                      className='flex items-start gap-3 p-3 bg-gray-50 rounded-lg'
                    >
                      <div className='w-6 h-6 bg-teal-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5'>
                        <span className='text-xs font-bold text-teal-700'>
                          {index + 1}
                        </span>
                      </div>
                      <span className='text-gray-700 text-sm'>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'amenities' && (
              <div className='space-y-4'>
                <h3 className='font-semibold text-gray-900 mb-4'>
                  {t('services.premium.luxYachtView.modal.amenitiesTitle')}
                </h3>
                {yacht.amenities.map((amenity, index) => (
                  <div
                    key={index}
                    className='p-4 border border-gray-200 rounded-xl bg-white'
                  >
                    <div className='flex items-start gap-3'>
                      <div className='w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600'>
                        {amenity.icon}
                      </div>
                      <div>
                        <h4 className='font-semibold text-gray-900 mb-1'>
                          {amenity.name}
                        </h4>
                        <p className='text-gray-600 text-sm'>
                          {amenity.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple Booking Modal
const CaribbeanBookingModal: React.FC<{
  yacht: Yacht;
  onClose: () => void;
}> = ({ yacht, onClose }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    date: '',
    guests: 2,
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);

    setTimeout(() => {
      alert(t('services.premium.luxYachtView.booking.successMessage'));
      setIsSubmitting(false);
      onClose();
    }, 2000);
  };

  return (
    <div className='fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
      <div className='bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl'>
        {/* Header with Yacht Image */}
        <div className='relative h-32 overflow-hidden'>
          <img
            src={yacht.mainImage}
            alt={yacht.name}
            className='w-full h-full object-cover'
          />
          <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent' />
          <button
            onClick={onClose}
            className='absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30'
          >
            <X className='w-4 h-4' />
          </button>
          <div className='absolute bottom-4 left-4 text-white'>
            <h2 className='text-lg font-semibold'>{yacht.name}</h2>
            <p className='text-white/80 text-sm'>
              {t('services.premium.luxYachtView.booking.modalTitle')}
            </p>
          </div>
        </div>

        {/* Form */}
        <div className='p-6 space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                {t('services.premium.luxYachtView.booking.labelDate')}
              </label>
              <input
                type='date'
                required
                min={new Date().toISOString().split('T')[0]}
                value={formData.date}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, date: e.target.value }))
                }
                className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                {t('services.premium.luxYachtView.booking.labelGuests')}
              </label>
              <select
                value={formData.guests}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    guests: parseInt(e.target.value),
                  }))
                }
                className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors'
              >
                {Array.from(
                  { length: yacht.specifications.maxGuests },
                  (_, i) => i + 1
                ).map((num) => (
                  <option key={num} value={num}>
                    {num}{' '}
                    {num > 1
                      ? t('services.premium.luxYachtView.booking.guestPlural')
                      : t(
                          'services.premium.luxYachtView.booking.guestSingular'
                        )}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              {t('services.premium.luxYachtView.booking.labelName')}
            </label>
            <input
              type='text'
              required
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors'
              placeholder={t(
                'services.premium.luxYachtView.booking.placeholderName'
              )}
            />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                {t('services.premium.luxYachtView.booking.labelEmail')}
              </label>
              <input
                type='email'
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors'
                placeholder={t(
                  'services.premium.luxYachtView.booking.placeholderEmail'
                )}
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                {t('services.premium.luxYachtView.booking.labelPhone')}
              </label>
              <input
                type='tel'
                required
                value={formData.phone}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, phone: e.target.value }))
                }
                className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors'
                placeholder={t(
                  'services.premium.luxYachtView.booking.placeholderPhone'
                )}
              />
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              {t('services.premium.luxYachtView.booking.labelMessage')}
            </label>
            <textarea
              value={formData.message}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, message: e.target.value }))
              }
              rows={3}
              className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors resize-none'
              placeholder={t(
                'services.premium.luxYachtView.booking.placeholderMessage'
              )}
            />
          </div>

          {/* Info Display */}
          <div className='bg-teal-50 rounded-lg p-4 border border-teal-200'>
            <div className='flex items-start gap-2 mb-2'>
              <Info className='w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5' />
              <p className='text-sm text-teal-800 font-medium'>
                {t('services.premium.luxYachtView.booking.infoTitle')}
              </p>
            </div>
            <p className='text-sm text-teal-700 leading-relaxed'>
              {t('services.premium.luxYachtView.booking.infoDesc')}
            </p>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`w-full py-4 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
              isSubmitting
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-teal-600 text-white hover:bg-teal-700 shadow-md hover:shadow-lg'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white' />
                {t('services.premium.luxYachtView.booking.ctaSubmitting')}
              </>
            ) : (
              <>
                <Waves className='w-5 h-5' />
                {t('services.premium.luxYachtView.booking.ctaSubmit')}
              </>
            )}
          </button>

          <p className='text-xs text-gray-500 text-center'>
            {t('services.premium.luxYachtView.booking.note')}
          </p>
        </div>
      </div>
    </div>
  );
};

// Main Component
const LuxeYachtServiceView: React.FC = () => {
  const { t } = useTranslation();
  const [selectedYacht, setSelectedYacht] = useState<Yacht | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const fleetRef = useRef<HTMLDivElement>(null);

  // Enhanced Yacht Data with translations
  const YACHT_DATA: Yacht[] = useMemo(
    () => [
      {
        id: 'aiconFly-60',
        name: t('services.premium.luxYachtView.yachts.aiconfly.name'),
        category: 'luxury',
        shortDescription: t(
          'services.premium.luxYachtView.yachts.aiconfly.shortDesc'
        ),
        mainImage:
          'https://res.cloudinary.com/ddg92xar5/image/upload/v1754600019/1_nyrndv.jpg',
        gallery: [
          'https://res.cloudinary.com/ddg92xar5/image/upload/v1754600017/5_ryceky.jpg',
          'https://res.cloudinary.com/ddg92xar5/image/upload/v1754600017/3_eapwql.jpg',
          'https://res.cloudinary.com/ddg92xar5/image/upload/v1754600018/2_dc7fry.jpg',
          'https://res.cloudinary.com/ddg92xar5/image/upload/v1754600016/7_mkxuiy.jpg',
          'https://res.cloudinary.com/ddg92xar5/image/upload/v1754600019/1_nyrndv.jpg',
        ],
        specifications: {
          length: '60 ft',
          maxGuests: 16,
          cabins: 3,
          bathrooms: 2,
          crew: 3,
          maxSpeed: '30 knots',
          manufacturer: 'AiconFly',
          year: 2008,
        },
        amenities: [
          {
            icon: <Wifi className='w-5 h-5' />,
            name: t(
              'services.premium.luxYachtView.yachts.aiconfly.amenityWifiName'
            ),
            description: t(
              'services.premium.luxYachtView.yachts.aiconfly.amenityWifiDesc'
            ),
          },
          {
            icon: <Utensils className='w-5 h-5' />,
            name: t(
              'services.premium.luxYachtView.yachts.aiconfly.amenityChefName'
            ),
            description: t(
              'services.premium.luxYachtView.yachts.aiconfly.amenityChefDesc'
            ),
          },
          {
            icon: <Waves className='w-5 h-5' />,
            name: t(
              'services.premium.luxYachtView.yachts.aiconfly.amenitySportsName'
            ),
            description: t(
              'services.premium.luxYachtView.yachts.aiconfly.amenitySportsDesc'
            ),
          },
        ],
        highlights: [
          t('services.premium.luxYachtView.yachts.aiconfly.highlight1'),
          t('services.premium.luxYachtView.yachts.aiconfly.highlight2'),
          t('services.premium.luxYachtView.yachts.aiconfly.highlight3'),
        ],
        isPremium: false,
        rating: 5,
        reviews: 128,
        location: t('services.premium.luxYachtView.yachts.aiconfly.location'),
        itinerary: [
          t('services.premium.luxYachtView.yachts.aiconfly.itinerary1'),
          t('services.premium.luxYachtView.yachts.aiconfly.itinerary2'),
          t('services.premium.luxYachtView.yachts.aiconfly.itinerary3'),
          t('services.premium.luxYachtView.yachts.aiconfly.itinerary4'),
          t('services.premium.luxYachtView.yachts.aiconfly.itinerary5'),
        ],
      },
      {
        id: 'fairline-43',
        name: t('services.premium.luxYachtView.yachts.fairline.name'),
        category: 'luxury',
        shortDescription: t(
          'services.premium.luxYachtView.yachts.fairline.shortDesc'
        ),
        mainImage:
          'https://res.cloudinary.com/ddg92xar5/image/upload/v1754600208/2_k72tfn.jpg',
        gallery: [
          'https://res.cloudinary.com/ddg92xar5/image/upload/v1754600211/1_k81g6k.jpg',
          'https://res.cloudinary.com/ddg92xar5/image/upload/v1754600209/3_dvbeqw.jpg',
          'https://res.cloudinary.com/ddg92xar5/image/upload/v1754600212/4_yj68bm.jpg',
          'https://res.cloudinary.com/ddg92xar5/image/upload/v1754600213/5_uvzjqd.jpg',
          'https://res.cloudinary.com/ddg92xar5/image/upload/v1754600209/3_dvbeqw.jpg',
        ],
        specifications: {
          length: '85 ft',
          maxGuests: 18,
          cabins: 4,
          bathrooms: 4,
          crew: 5,
          maxSpeed: '28 knots',
          manufacturer: 'Princess',
          year: 2024,
        },
        amenities: [
          {
            icon: <Wifi className='w-5 h-5' />,
            name: t(
              'services.premium.luxYachtView.yachts.fairline.amenityWifiName'
            ),
            description: t(
              'services.premium.luxYachtView.yachts.fairline.amenityWifiDesc'
            ),
          },
          {
            icon: <Utensils className='w-5 h-5' />,
            name: t(
              'services.premium.luxYachtView.yachts.fairline.amenityChefName'
            ),
            description: t(
              'services.premium.luxYachtView.yachts.fairline.amenityChefDesc'
            ),
          },
          {
            icon: <Waves className='w-5 h-5' />,
            name: t(
              'services.premium.luxYachtView.yachts.fairline.amenitySpaName'
            ),
            description: t(
              'services.premium.luxYachtView.yachts.fairline.amenitySpaDesc'
            ),
          },
        ],
        highlights: [
          t('services.premium.luxYachtView.yachts.fairline.highlight1'),
          t('services.premium.luxYachtView.yachts.fairline.highlight2'),
          t('services.premium.luxYachtView.yachts.fairline.highlight3'),
        ],
        isPremium: true,
        rating: 4.95,
        reviews: 89,
        location: t('services.premium.luxYachtView.yachts.fairline.location'),
        itinerary: [
          t('services.premium.luxYachtView.yachts.fairline.itinerary1'),
          t('services.premium.luxYachtView.yachts.fairline.itinerary2'),
          t('services.premium.luxYachtView.yachts.fairline.itinerary3'),
          t('services.premium.luxYachtView.yachts.fairline.itinerary4'),
          t('services.premium.luxYachtView.yachts.fairline.itinerary5'),
          t('services.premium.luxYachtView.yachts.fairline.itinerary6'),
          t('services.premium.luxYachtView.yachts.fairline.itinerary7'),
        ],
      },
      {
        id: 'catamaran',
        name: t('services.premium.luxYachtView.yachts.lagoon.name'),
        category: 'catamaran',
        shortDescription: t(
          'services.premium.luxYachtView.yachts.lagoon.shortDesc'
        ),
        mainImage:
          'https://res.cloudinary.com/ddg92xar5/image/upload/v1755956164/7030fcbb-7da3-4676-9abb-d22177efab14_qdk2ac.jpg',
        gallery: [
          'https://res.cloudinary.com/ddg92xar5/image/upload/v1755956159/4f5f3743-f52d-4d85-b023-fb4be38f833f_n70bbg.jpg',
          'https://res.cloudinary.com/ddg92xar5/image/upload/v1755956399/3380551b-f82f-4fdc-86e2-47cf2ad3a6dc_foh9sp.jpg',
          'https://res.cloudinary.com/ddg92xar5/image/upload/v1755956172/c3b072ee-3a35-497c-8aa0-1942c9044a3b_q5xht7.jpg',
          'https://res.cloudinary.com/ddg92xar5/image/upload/v1755956193/d21ad3c2-f7eb-41e2-921d-3ae1be25c7a5_edwn0e.jpg',
          'https://res.cloudinary.com/ddg92xar5/image/upload/v1755956396/5ad4be2d-9122-45fe-bd48-0dec7b77a8b5_ymmrx8.jpg',
        ],
        specifications: {
          length: '13,71 m',
          maxGuests: 20,
          cabins: 4,
          bathrooms: 3,
          crew: 3,
          maxSpeed: '26 knots',
          manufacturer: 'Lagoon',
          year: 2013,
        },
        amenities: [
          {
            icon: <Wifi className='w-5 h-5' />,
            name: t(
              'services.premium.luxYachtView.yachts.lagoon.amenityWifiName'
            ),
            description: t(
              'services.premium.luxYachtView.yachts.lagoon.amenityWifiDesc'
            ),
          },
          {
            icon: <Utensils className='w-5 h-5' />,
            name: t(
              'services.premium.luxYachtView.yachts.lagoon.amenityChefName'
            ),
            description: t(
              'services.premium.luxYachtView.yachts.lagoon.amenityChefDesc'
            ),
          },
          {
            icon: <Waves className='w-5 h-5' />,
            name: t(
              'services.premium.luxYachtView.yachts.lagoon.amenityPoolName'
            ),
            description: t(
              'services.premium.luxYachtView.yachts.lagoon.amenityPoolDesc'
            ),
          },
        ],
        highlights: [
          t('services.premium.luxYachtView.yachts.lagoon.highlight1'),
          t('services.premium.luxYachtView.yachts.lagoon.highlight2'),
          t('services.premium.luxYachtView.yachts.lagoon.highlight3'),
        ],
        isPremium: true,
        rating: 5.0,
        reviews: 156,
        location: t('services.premium.luxYachtView.yachts.lagoon.location'),
        itinerary: [
          t('services.premium.luxYachtView.yachts.lagoon.itinerary1'),
          t('services.premium.luxYachtView.yachts.lagoon.itinerary2'),
          t('services.premium.luxYachtView.yachts.lagoon.itinerary3'),
          t('services.premium.luxYachtView.yachts.lagoon.itinerary4'),
        ],
      },
      {
        id: 'tiara-38',
        name: t('services.premium.luxYachtView.yachts.tiara.name'),
        category: 'luxury',
        shortDescription: t(
          'services.premium.luxYachtView.yachts.tiara.shortDesc'
        ),
        mainImage:
          'https://res.cloudinary.com/ddg92xar5/image/upload/v1755956761/ac955cf2-03ad-4c8c-87c6-36c0ec0cb3a9_ymvcuc.jpg',
        gallery: [
          'https://res.cloudinary.com/ddg92xar5/image/upload/v1755956770/3e8353e4-c87b-4ce6-9781-151e4bcc0245_usext6.jpg',
          'https://res.cloudinary.com/ddg92xar5/image/upload/v1755956766/28d661b1-e505-4bbe-98b9-66354d9e3112_gzt0ku.jpg',
          'https://res.cloudinary.com/ddg92xar5/image/upload/v1755956782/5ac1f830-2a76-4d82-8666-37bef3104a87_i810fb.jpg',
          'https://res.cloudinary.com/ddg92xar5/image/upload/v1755957154/f87b013c-affa-4058-8723-e62f49f7643d_fjzbpv.jpg',
          'https://res.cloudinary.com/ddg92xar5/image/upload/v1755956815/f46a7e9a-3093-404d-825d-138155d275e7_lwjmri.jpg',
          'https://res.cloudinary.com/ddg92xar5/image/upload/v1755956761/ac955cf2-03ad-4c8c-87c6-36c0ec0cb3a9_ymvcuc.jpg',
        ],
        specifications: {
          length: '60 ft',
          maxGuests: 16,
          cabins: 3,
          bathrooms: 2,
          crew: 3,
          maxSpeed: '30 knots',
          manufacturer: 'AiconFly',
          year: 2008,
        },
        amenities: [
          {
            icon: <Wifi className='w-5 h-5' />,
            name: t(
              'services.premium.luxYachtView.yachts.tiara.amenityWifiName'
            ),
            description: t(
              'services.premium.luxYachtView.yachts.tiara.amenityWifiDesc'
            ),
          },
          {
            icon: <Utensils className='w-5 h-5' />,
            name: t(
              'services.premium.luxYachtView.yachts.tiara.amenityChefName'
            ),
            description: t(
              'services.premium.luxYachtView.yachts.tiara.amenityChefDesc'
            ),
          },
          {
            icon: <Waves className='w-5 h-5' />,
            name: t(
              'services.premium.luxYachtView.yachts.tiara.amenitySportsName'
            ),
            description: t(
              'services.premium.luxYachtView.yachts.tiara.amenitySportsDesc'
            ),
          },
        ],
        highlights: [
          t('services.premium.luxYachtView.yachts.tiara.highlight1'),
          t('services.premium.luxYachtView.yachts.tiara.highlight2'),
          t('services.premium.luxYachtView.yachts.tiara.highlight3'),
        ],
        isPremium: false,
        rating: 5,
        reviews: 128,
        location: t('services.premium.luxYachtView.yachts.tiara.location'),
        itinerary: [
          t('services.premium.luxYachtView.yachts.tiara.itinerary1'),
          t('services.premium.luxYachtView.yachts.tiara.itinerary2'),
          t('services.premium.luxYachtView.yachts.tiara.itinerary3'),
          t('services.premium.luxYachtView.yachts.tiara.itinerary4'),
          t('services.premium.luxYachtView.yachts.tiara.itinerary5'),
        ],
      },
    ],
    [t]
  );

  const handleExploreFleet = () => {
    fleetRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleYachtSelect = (yacht: Yacht) => {
    setSelectedYacht(yacht);
  };

  const handleBookNow = () => {
    setShowBookingModal(true);
  };

  const handleCloseModal = () => {
    setSelectedYacht(null);
    setShowBookingModal(false);
  };

  return (
    <div className='min-h-screen bg-white'>
      <CinematicHero onBookingClick={handleExploreFleet} />
      <div ref={fleetRef}>
        <CaribbeanYachtGrid
          onYachtSelect={handleYachtSelect}
          yachtData={YACHT_DATA}
        />
      </div>
      <CaribbeanGallery />
      <CaribbeanWhatToBring />
      <PrivateServiceInfo />
      <YachtImportantInfo />

      {/* Modals */}
      {selectedYacht && !showBookingModal && (
        <YachtDetailsModal
          yacht={selectedYacht}
          onClose={handleCloseModal}
          onBook={handleBookNow}
        />
      )}

      {selectedYacht && showBookingModal && (
        <CaribbeanBookingModal
          yacht={selectedYacht}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default LuxeYachtServiceView;
