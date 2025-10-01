import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { useBooking } from '@/context/BookingContext';
import { Service } from '@/types/type';
import { ServiceData } from '@/types/services';
import { BookingDate } from '@/types/type';
import BookingModal from '../../modal/BookingModal';
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
  Baby,
  Mountain,
  Sun,
  Waves,
  Calendar,
  Play,
  Camera,
  Coffee,
  Trees,
  Shirt,
  Eye,
  Bug,
  AlertTriangle,
  Info,
  Scale,
  Globe,
  Droplets,
  Navigation,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface HorseBackRidingServiceViewProps {
  service: Service;
  serviceData?: ServiceData;
  primaryColor: string;
  viewContext?: 'standard-view' | 'premium-view';
}

interface BookingActions {
  onBookClick: () => void;
  service: Service;
}

// Solo IDs y componentes no traducibles
const ITINERARY_STEPS = [
  { id: 1, icon: Info },
  { id: 2, icon: Coffee },
  { id: 3, icon: Trees },
  { id: 4, icon: Waves },
  { id: 5, icon: Sun },
  { id: 6, icon: Droplets },
  { id: 7, icon: Navigation },
];

const WHAT_TO_BRING_ICONS = [Shirt, Shield, Bug, Eye];
const RESTRICTIONS_ICONS = [Baby, Scale, AlertTriangle, Globe];

// Hero Section Component
const HeroSection: React.FC<BookingActions & { t: any }> = ({
  onBookClick,
  t,
}) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className='relative h-screen min-h-[600px] md:min-h-[700px] overflow-hidden'>
      <div
        className='absolute inset-0'
        style={{ transform: `translateY(${scrollY * 0.3}px)` }}
      >
        <img
          src='https://res.cloudinary.com/ddg92xar5/image/upload/v1755946813/Imagen_de_WhatsApp_2024-06-03_a_las_15.47.17_45e97ed7_uoutrp.jpg'
          alt='Horseback riding at Macao Beach'
          className='w-full h-full object-cover'
        />
        <div className='absolute inset-0 bg-black/40' />
        <div className='absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/70' />
      </div>

      <div className='relative z-10 h-full flex flex-col justify-end px-4 md:px-8 pb-30'>
        <div className='max-w-4xl mx-auto w-full'>
          <h1 className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 text-white'>
            {t('services.standard.horsebackRidingServiceView.hero.title')}
            <span className='block text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-amber-400 mt-2'>
              {t('services.standard.horsebackRidingServiceView.hero.subtitle')}
            </span>
          </h1>

          <p className='text-base sm:text-lg md:text-xl text-white/90 mb-8 md:mb-10 max-w-2xl'>
            {t('services.standard.horsebackRidingServiceView.hero.description')}
          </p>

          <div className='flex flex-col sm:flex-row gap-4 mb-8'>
            <button
              onClick={onBookClick}
              className='group bg-amber-500 hover:bg-amber-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold transition-all transform hover:scale-105 shadow-2xl inline-flex items-center justify-center gap-2'
            >
              <Play
                className='w-5 h-5 group-hover:translate-x-1 transition-transform'
                fill='currentColor'
              />
              {t(
                'services.standard.horsebackRidingServiceView.hero.bookButton'
              )}
              <ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform' />
            </button>
          </div>

          <div className='flex flex-wrap gap-6 text-white/80 text-sm sm:text-base'>
            <div className='flex items-center gap-2'>
              <Star className='w-4 h-4 text-amber-400 fill-amber-400' />
              <span>
                {t('services.standard.horsebackRidingServiceView.hero.rating')}
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <Clock className='w-4 h-4' />
              <span>
                {t(
                  'services.standard.horsebackRidingServiceView.hero.duration'
                )}
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <Users className='w-4 h-4' />
              <span>
                {t('services.standard.horsebackRidingServiceView.hero.level')}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className='absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/50 animate-bounce'>
        <ChevronRight className='w-6 h-6 rotate-90' />
      </div>
    </div>
  );
};

// Gallery Section
const PhotoGallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const GALLERY_IMAGES = [
    {
      id: 1,
      src: 'https://puntacanaexcursions.online/wp-content/uploads/2024/08/image00011-1536x1017.jpeg',
      alt: 'Horse riding on tropical beach',
    },
    {
      id: 2,
      src: 'https://res.cloudinary.com/ddg92xar5/image/upload/v1755946814/Imagen_de_WhatsApp_2024-06-03_a_las_15.47.17_f9b60a74_l7xtfu.jpg',
      alt: 'Riders in tropical forest',
    },
    {
      id: 3,
      src: 'https://res.cloudinary.com/ddg92xar5/image/upload/v1755946811/image00043_s1jla3.jpg',
      alt: 'Beach horseback experience',
    },
    {
      id: 4,
      src: 'https://res.cloudinary.com/ddg92xar5/image/upload/v1755946864/image00002_krjl52.jpg',
      alt: 'Family horseback adventure',
    },
  ];

  return (
    <section className='py-20 bg-gradient-to-br from-slate-50 to-teal-50'>
      <div className='max-w-7xl mx-auto px-6'>
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

// Quick Info Section Component
const QuickInfoSection: React.FC<{ t: any }> = ({ t }) => {
  const cards = [
    {
      icon: <MapPin className='w-5 h-5' />,
      titleKey: 'location.title',
      descriptionKey: 'location.description',
    },
    {
      icon: <Shield className='w-5 h-5' />,
      titleKey: 'safety.title',
      descriptionKey: 'safety.description',
    },
    {
      icon: <Clock className='w-5 h-5' />,
      titleKey: 'duration.title',
      descriptionKey: 'duration.description',
    },
    {
      icon: <Star className='w-5 h-5' />,
      titleKey: 'rating.title',
      descriptionKey: 'rating.description',
    },
  ];

  return (
    <section className='py-16 px-4 bg-gray-50'>
      <div className='max-w-5xl mx-auto'>
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6'>
          {cards.map((card, idx) => (
            <div key={idx} className='text-center p-6'>
              <div className='inline-flex p-3 rounded-full bg-amber-100 text-amber-600 mb-3'>
                {card.icon}
              </div>
              <h3 className='font-semibold text-gray-800 mb-1'>
                {t(
                  `services.standard.horsebackRidingServiceView.quickInfo.cards.${card.titleKey}`
                )}
              </h3>
              <p className='text-sm text-gray-600'>
                {t(
                  `services.standard.horsebackRidingServiceView.quickInfo.cards.${card.descriptionKey}`
                )}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Trust Badges Component
const TrustBadges: React.FC<{ t: any }> = ({ t }) => {
  const badges = [
    { key: 'riders', valueKey: 'value', labelKey: 'label' },
    { key: 'rating', valueKey: 'value', labelKey: 'label' },
    { key: 'years', valueKey: 'value', labelKey: 'label' },
    { key: 'safe', valueKey: 'value', labelKey: 'label' },
  ];

  return (
    <section className='py-16 px-4 bg-amber-500'>
      <div className='max-w-5xl mx-auto'>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white'>
          {badges.map((badge) => (
            <div key={badge.key}>
              <div className='text-3xl font-bold'>
                {t(
                  `services.standard.horsebackRidingServiceView.trustBadges.${badge.key}.${badge.valueKey}`
                )}
              </div>
              <div className='text-sm opacity-90'>
                {t(
                  `services.standard.horsebackRidingServiceView.trustBadges.${badge.key}.${badge.labelKey}`
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Includes Section Component
const IncludesSection: React.FC<{ t: any }> = ({ t }) => {
  const includeKeys = [
    'item1',
    'item2',
    'item3',
    'item4',
    'item5',
    'item6',
    'item7',
    'item8',
  ];

  return (
    <section className='py-16 px-4 bg-white'>
      <div className='max-w-3xl mx-auto'>
        <h2 className='text-3xl font-bold text-center mb-10 text-gray-800'>
          {t('services.standard.horsebackRidingServiceView.includes.title')}
        </h2>
        <div className='grid grid-cols-2 gap-4'>
          {includeKeys.map((key, idx) => (
            <div key={idx} className='flex items-center gap-3'>
              <Check className='w-5 h-5 text-amber-500 flex-shrink-0' />
              <span className='text-gray-700'>
                {t(
                  `services.standard.horsebackRidingServiceView.includes.${key}`
                )}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Itinerary Section
const ItinerarySection: React.FC<{ t: any }> = ({ t }) => {
  return (
    <section className='py-16 bg-gradient-to-br from-amber-50 to-orange-50'>
      <div className='max-w-6xl mx-auto px-4'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl font-bold text-gray-800 mb-4'>
            {t('services.standard.horsebackRidingServiceView.itinerary.title')}{' '}
            <span className='text-amber-500'>
              {t(
                'services.standard.horsebackRidingServiceView.itinerary.titleHighlight'
              )}
            </span>
          </h2>
          <p className='text-gray-600'>
            {t(
              'services.standard.horsebackRidingServiceView.itinerary.subtitle'
            )}
          </p>
        </div>
        <div className='space-y-6'>
          <div className='grid grid-cols-2 gap-6'>
            {ITINERARY_STEPS.slice(0, -1).map((step, index) => {
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
                  <div className='w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0'>
                    <IconComponent className='w-6 h-6 text-amber-600' />
                  </div>
                  <div className='flex-grow'>
                    <div className='flex items-center gap-2 mb-1'>
                      <span className='bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full'>
                        {step.id}
                      </span>
                    </div>
                    <h3 className='font-semibold text-gray-800 text-sm mb-1'>
                      {t(
                        `services.standard.horsebackRidingServiceView.itinerary.step${step.id}.title`
                      )}
                    </h3>
                    <p className='text-gray-600 text-xs'>
                      {t(
                        `services.standard.horsebackRidingServiceView.itinerary.step${step.id}.description`
                      )}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {(() => {
            const lastStep = ITINERARY_STEPS[ITINERARY_STEPS.length - 1];
            const IconComponent = lastStep.icon;
            return (
              <motion.div
                key={lastStep.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (ITINERARY_STEPS.length - 1) * 0.1 }}
                className='flex items-center gap-4 bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 max-w-md mx-auto'
              >
                <div className='w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0'>
                  <IconComponent className='w-6 h-6 text-amber-600' />
                </div>
                <div className='flex-grow text-center'>
                  <div className='flex items-center gap-2 mb-1 justify-center'>
                    <span className='bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full'>
                      {lastStep.id}
                    </span>
                  </div>
                  <h3 className='font-semibold text-gray-800 text-sm mb-1'>
                    {t(
                      `services.standard.horsebackRidingServiceView.itinerary.step${lastStep.id}.title`
                    )}
                  </h3>
                  <p className='text-gray-600 text-xs'>
                    {t(
                      `services.standard.horsebackRidingServiceView.itinerary.step${lastStep.id}.description`
                    )}
                  </p>
                </div>
              </motion.div>
            );
          })()}
        </div>
        <div className='mt-8 text-center'>
          <div className='inline-flex items-center gap-2 bg-amber-100 px-4 py-2 rounded-full'>
            <Clock className='w-4 h-4 text-amber-600' />
            <span className='text-amber-800 font-medium text-sm'>
              {t(
                'services.standard.horsebackRidingServiceView.itinerary.totalDuration'
              )}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

// Info Section (What to Bring & Restrictions)
const InfoSection: React.FC<{ t: any }> = ({ t }) => {
  return (
    <section className='py-16 bg-white'>
      <div className='max-w-6xl mx-auto px-4'>
        <div className='grid lg:grid-cols-2 gap-12'>
          {/* What to Bring */}
          <div>
            <h2 className='text-2xl font-bold text-gray-800 mb-6'>
              {t(
                'services.standard.horsebackRidingServiceView.whatToBring.title'
              )}{' '}
              <span className='text-amber-500'>
                {t(
                  'services.standard.horsebackRidingServiceView.whatToBring.titleHighlight'
                )}
              </span>
            </h2>
            <div className='grid grid-cols-2 gap-4'>
              {[1, 2, 3, 4].map((num, index) => {
                const IconComponent = WHAT_TO_BRING_ICONS[index];
                return (
                  <motion.div
                    key={num}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className='text-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors'
                  >
                    <div className='w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3'>
                      <IconComponent className='w-6 h-6 text-amber-600' />
                    </div>
                    <h3 className='font-semibold text-gray-800 text-sm mb-2'>
                      {t(
                        `services.standard.horsebackRidingServiceView.whatToBring.item${num}.title`
                      )}
                    </h3>
                    <p className='text-gray-600 text-xs'>
                      {t(
                        `services.standard.horsebackRidingServiceView.whatToBring.item${num}.description`
                      )}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Restrictions */}
          <div>
            <h2 className='text-2xl font-bold text-gray-800 mb-6'>
              {t(
                'services.standard.horsebackRidingServiceView.restrictions.title'
              )}{' '}
              <span className='text-red-500'>
                {t(
                  'services.standard.horsebackRidingServiceView.restrictions.titleHighlight'
                )}
              </span>
            </h2>
            <div className='grid grid-cols-2 md:grid-cols-2 gap-4'>
              {['age', 'weight', 'health', 'language'].map(
                (category, index) => {
                  const IconComponent = RESTRICTIONS_ICONS[index];
                  const itemCount =
                    category === 'age' || category === 'health' ? 3 : 2;
                  return (
                    <motion.div
                      key={category}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className='bg-gray-50 rounded-xl p-4'
                    >
                      <div className='flex items-center gap-3 mb-3'>
                        <div className='w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center'>
                          <IconComponent className='w-4 h-4 text-red-600' />
                        </div>
                        <h3 className='font-semibold text-gray-800 text-sm'>
                          {t(
                            `services.standard.horsebackRidingServiceView.restrictions.${category}.title`
                          )}
                        </h3>
                      </div>
                      <ul className='space-y-1'>
                        {Array.from({ length: itemCount }, (_, i) => i + 1).map(
                          (itemNum) => (
                            <li
                              key={itemNum}
                              className='flex items-start gap-2'
                            >
                              <Check className='w-3 h-3 text-green-500 flex-shrink-0 mt-0.5' />
                              <span className='text-gray-600 text-xs'>
                                {t(
                                  `services.standard.horsebackRidingServiceView.restrictions.${category}.item${itemNum}`
                                )}
                              </span>
                            </li>
                          )
                        )}
                      </ul>
                    </motion.div>
                  );
                }
              )}
            </div>
          </div>
        </div>

        {/* Horse Disclaimer */}
        <div className='mt-12 bg-amber-50 rounded-2xl p-6 border border-amber-200'>
          <div className='flex items-start gap-4'>
            <Heart className='w-6 h-6 text-amber-600 flex-shrink-0 mt-1' />
            <div>
              <h3 className='text-lg font-semibold text-amber-800 mb-3'>
                {t(
                  'services.standard.horsebackRidingServiceView.horseDisclaimer.title'
                )}
              </h3>
              <p className='text-amber-700 text-sm leading-relaxed mb-3'>
                {t(
                  'services.standard.horsebackRidingServiceView.horseDisclaimer.paragraph1'
                )}
              </p>
              <p className='text-amber-700 text-sm'>
                {t(
                  'services.standard.horsebackRidingServiceView.horseDisclaimer.paragraph2'
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Weather Note */}
        <div className='mt-6 bg-blue-50 rounded-xl p-4 border border-blue-200'>
          <div className='flex items-start gap-3'>
            <Info className='w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5' />
            <div>
              <h3 className='font-semibold text-blue-800 mb-1'>
                {t(
                  'services.standard.horsebackRidingServiceView.weatherPolicy.title'
                )}
              </h3>
              <p className='text-blue-700 text-sm'>
                {t(
                  'services.standard.horsebackRidingServiceView.weatherPolicy.description'
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Reviews Section Component
const ReviewsSection: React.FC<{ t: any }> = ({ t }) => {
  return (
    <section className='py-16 px-4 bg-gray-50'>
      <div className='max-w-5xl mx-auto'>
        <div className='text-center mb-10'>
          <h2 className='text-3xl font-bold mb-3 text-gray-800'>
            {t('services.standard.horsebackRidingServiceView.reviews.title')}
          </h2>
          <div className='flex justify-center items-center gap-1'>
            {[...Array(5)].map((_, i) => (
              <Star key={i} className='w-5 h-5 fill-amber-400 text-amber-400' />
            ))}
            <span className='ml-2 text-gray-600'>
              {t(
                'services.standard.horsebackRidingServiceView.reviews.subtitle'
              )}
            </span>
          </div>
        </div>

        <div className='grid md:grid-cols-3 gap-6'>
          {[1, 2, 3].map((num) => (
            <div key={num} className='bg-white rounded-xl p-6'>
              <div className='flex gap-1 mb-3'>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className='w-4 h-4 fill-amber-400 text-amber-400'
                  />
                ))}
              </div>
              <p className='text-gray-700 mb-4'>
                "
                {t(
                  `services.standard.horsebackRidingServiceView.reviews.review${num}.text`
                )}
                "
              </p>
              <div className='flex justify-between items-center text-sm'>
                <span className='font-medium text-gray-800'>
                  {t(
                    `services.standard.horsebackRidingServiceView.reviews.review${num}.name`
                  )}
                </span>
                <span className='text-gray-500'>
                  {t(
                    `services.standard.horsebackRidingServiceView.reviews.review${num}.date`
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Adventure Banner Component
const AdventureBanner: React.FC<BookingActions & { t: any }> = ({
  onBookClick,
  t,
}) => {
  return (
    <section className='relative py-24 overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50'>
      <div className='max-w-6xl mx-auto px-4'>
        <div className='grid lg:grid-cols-2 gap-12 items-center'>
          <div>
            <h2 className='text-3xl md:text-4xl font-bold text-gray-800 mb-6'>
              {t(
                'services.standard.horsebackRidingServiceView.adventureBanner.title'
              )}
              <span className='text-amber-500'>
                {' '}
                {t(
                  'services.standard.horsebackRidingServiceView.adventureBanner.titleHighlight'
                )}
              </span>
            </h2>

            <div className='space-y-4'>
              {[1, 2, 3, 4].map((num) => (
                <div key={num} className='flex items-start gap-3'>
                  <div className='w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-1'>
                    <Check className='w-4 h-4 text-amber-600' />
                  </div>
                  <div>
                    <h3 className='font-semibold text-gray-800 mb-1'>
                      {t(
                        `services.standard.horsebackRidingServiceView.adventureBanner.benefit${num}.title`
                      )}
                    </h3>
                    <p className='text-gray-600'>
                      {t(
                        `services.standard.horsebackRidingServiceView.adventureBanner.benefit${num}.description`
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={onBookClick}
              className='mt-8 bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105'
            >
              {t(
                'services.standard.horsebackRidingServiceView.adventureBanner.button'
              )}
            </button>
          </div>

          <div className='relative'>
            <div className='rounded-2xl overflow-hidden shadow-2xl'>
              <img
                src='https://puntacanaexcursions.online/wp-content/uploads/2024/07/image00014-scaled.jpeg'
                alt='Happy rider with horse'
                className='w-full h-[400px] object-cover'
              />
            </div>
            <div className='absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-4'>
              <div className='flex items-center gap-3'>
                <div className='w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center'>
                  <Star className='w-6 h-6 text-amber-500' />
                </div>
                <div>
                  <p className='text-2xl font-bold text-gray-800'>4.9</p>
                  <p className='text-xs text-gray-600'>
                    {t(
                      'services.standard.horsebackRidingServiceView.adventureBanner.statsLabel'
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

// Special Banner Component
const SpecialBanner: React.FC<BookingActions & { t: any }> = ({
  onBookClick,
  t,
}) => {
  return (
    <section className='relative py-32 overflow-hidden'>
      <div className='absolute inset-0'>
        <img
          src='https://res.cloudinary.com/ddg92xar5/image/upload/v1755946864/image00002_krjl52.jpg'
          alt='Horseback riding experience'
          className='w-full h-full object-cover'
        />
        <div className='absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent' />
      </div>

      <div className='relative z-10 max-w-6xl mx-auto px-4'>
        <div className='max-w-2xl'>
          <div className='inline-flex items-center gap-2 bg-amber-500/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-amber-400/30'>
            <Sparkles className='w-4 h-4 text-amber-400' />
            <span className='text-amber-200 text-sm font-medium'>
              {t(
                'services.standard.horsebackRidingServiceView.specialBanner.badge'
              )}
            </span>
          </div>

          <h2 className='text-4xl md:text-5xl font-bold text-white mb-6'>
            {t(
              'services.standard.horsebackRidingServiceView.specialBanner.title'
            )}
            <span className='block text-amber-400'>
              {t(
                'services.standard.horsebackRidingServiceView.specialBanner.titleHighlight'
              )}
            </span>
          </h2>

          <p className='text-lg text-white/90 mb-8'>
            {t(
              'services.standard.horsebackRidingServiceView.specialBanner.description'
            )}
          </p>

          <div className='flex flex-wrap gap-6 mb-8'>
            <div className='flex items-center gap-2 text-white'>
              <Heart className='w-5 h-5 text-red-400' />
              <span>
                {t(
                  'services.standard.horsebackRidingServiceView.specialBanner.tag1'
                )}
              </span>
            </div>
            <div className='flex items-center gap-2 text-white'>
              <Shield className='w-5 h-5 text-green-400' />
              <span>
                {t(
                  'services.standard.horsebackRidingServiceView.specialBanner.tag2'
                )}
              </span>
            </div>
            <div className='flex items-center gap-2 text-white'>
              <Star className='w-5 h-5 text-amber-400' />
              <span>
                {t(
                  'services.standard.horsebackRidingServiceView.specialBanner.tag3'
                )}
              </span>
            </div>
          </div>

          <button
            onClick={onBookClick}
            className='bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all transform hover:scale-105 shadow-2xl'
          >
            {t(
              'services.standard.horsebackRidingServiceView.specialBanner.button'
            )}
          </button>
        </div>
      </div>
    </section>
  );
};

// Floating Action Button Component
const FloatingActionButton: React.FC<BookingActions> = ({ onBookClick }) => {
  return (
    <div className='fixed bottom-8 right-8 z-50'>
      <button
        onClick={onBookClick}
        className='group bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white p-4 rounded-full shadow-2xl hover:shadow-amber-500/25 transition-all duration-300 hover:scale-110'
      >
        <Mountain className='w-6 h-6 group-hover:scale-110 transition-transform' />
      </button>
    </div>
  );
};

// Main Component
const HorseBackRidingServiceView: React.FC<HorseBackRidingServiceViewProps> = ({
  service,
  serviceData,
  viewContext,
}) => {
  const { t } = useTranslation();
  const { bookService } = useBooking();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBookNow = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleBookingConfirm = useCallback(
    (service: Service, dates: BookingDate, guests: number) => {
      bookService(service, dates, guests);
      setIsModalOpen(false);
    },
    [bookService]
  );

  const bookingActions: BookingActions = {
    onBookClick: handleBookNow,
    service,
  };

  return (
    <div className='min-h-screen bg-white'>
      <HeroSection {...bookingActions} t={t} />
      <PhotoGallery />
      <QuickInfoSection t={t} />
      <IncludesSection t={t} />
      <ItinerarySection t={t} />
      <InfoSection t={t} />
      <SpecialBanner {...bookingActions} t={t} />
      <AdventureBanner {...bookingActions} t={t} />
      <TrustBadges t={t} />
      <ReviewsSection t={t} />

      <FloatingActionButton {...bookingActions} />

      {isModalOpen && (
        <BookingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleBookingConfirm}
          service={service}
        />
      )}
    </div>
  );
};

export default HorseBackRidingServiceView;
