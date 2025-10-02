import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  MapPin,
  Users,
  Clock,
  Utensils,
  Camera,
  ArrowRight,
  Star,
  Check,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Calendar,
  Sun,
  Fish,
  Waves,
  Anchor,
  AlertCircle,
  Heart,
  Award,
  Shield,
  ChevronLeft,
  ChevronRight,
  X,
  Palmtree,
  Compass,
  Sparkles,
  Car,
  ShoppingBag,
  Music,
  Timer,
  Sunset,
  CloudRain,
  AlertTriangle,
  Shirt,
  DollarSign,
  Camera as CameraIcon,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import BookingModal from '../../modal/BookingModal';
import { BookingDate, Service } from '@/constants/formFields';
import { useTranslation } from '@/lib/i18n/client';
import { useBooking } from '@/context/BookingContext';

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
}

interface ItineraryStep {
  time: string;
  icon: React.ElementType;
  duration?: string;
}

const ITINERARY_STEPS: ItineraryStep[] = [
  { time: '7:00 - 7:45 AM', icon: Car, duration: '30-45 min' },
  { time: '8:00 - 8:30 AM', icon: MapPin },
  { time: '8:30 - 9:00 AM', icon: ShoppingBag, duration: '15-20 min' },
  { time: '9:30 - 11:00 AM', icon: Music, duration: '1.5 horas' },
  { time: '11:00 - 11:15 AM', icon: Waves, duration: '15 min' },
  { time: '11:30 AM - 3:00 PM', icon: Palmtree, duration: '3.5 horas' },
  { time: '3:00 - 4:30 PM', icon: Anchor, duration: '1.5 horas' },
  { time: '5:00 - 6:00 PM', icon: Sunset, duration: '30-60 min' },
];

const galleryImages: GalleryImage[] = [
  {
    id: 1,
    src: 'https://res.cloudinary.com/ddg92xar5/image/upload/v1755946732/WhatsApp_Image_2021-08-11_at_10.08.08_PM_1_r8bxkd.jpg',
    alt: 'Playa Isla Saona',
  },
  {
    id: 2,
    src: 'https://res.cloudinary.com/ddg92xar5/image/upload/v1755946716/playa_isla_saona_wti2ri.jpg',
    alt: 'Piscina Natural',
  },
  {
    id: 3,
    src: 'https://res.cloudinary.com/ddg92xar5/image/upload/v1755946768/Saona_island_rvgcvb.jpg',
    alt: 'Estrellas de Mar',
  },
  {
    id: 4,
    src: 'https://puntacanaexcursions.online/wp-content/uploads/2024/09/saona-island-2-scaled.jpg',
    alt: 'Lancha',
  },
];

const IslandHero: React.FC<{ onBookClick: () => void }> = ({ onBookClick }) => {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {
        setIsPlaying(false);
      });
    }
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (video) {
      video.muted = !video.muted;
      setIsMuted(video.muted);
    }
  };

  return (
    <div className='relative h-screen w-full overflow-hidden'>
      <video
        ref={videoRef}
        className='absolute inset-0 w-full h-full object-cover'
        loop
        muted={isMuted}
        playsInline
        poster='https://res.cloudinary.com/ddg92xar5/image/upload/v1755946732/WhatsApp_Image_2021-08-11_at_10.08.08_PM_1_r8bxkd.jpg'
      >
        <source
          src='https://res.cloudinary.com/ddg92xar5/image/upload/v1755946763/WhatsApp_Image_2021-08-11_at_10.08.09_PM_2_bx0kcz.jpg'
          type='video/mp4'
        />
      </video>

      {/* <div className='absolute top-4 right-4 flex gap-2'>
        <button
          onClick={togglePlay}
          className='w-10 h-10 bg-black/30 rounded-lg flex items-center justify-center hover:bg-black/50 transition-colors text-white'
        >
          {isPlaying ? (
            <Pause className='w-5 h-5' />
          ) : (
            <Play className='w-5 h-5' />
          )}
        </button>
        <button
          onClick={toggleMute}
          className='w-10 h-10 bg-black/30 rounded-lg flex items-center justify-center hover:bg-black/50 transition-colors text-white'
        >
          {isMuted ? (
            <VolumeX className='w-5 h-5' />
          ) : (
            <Volume2 className='w-5 h-5' />
          )}
        </button>
      </div> */}

      <div className='absolute inset-0 bg-black/30' />

      <div className='absolute inset-0 flex items-end text-center text-white p-4'>
        <div className='w-full'>
          <div className='inline-flex items-center bg-white/20 px-4 py-2 rounded-full mb-6'>
            <MapPin className='w-4 h-4 mr-2' />
            <span className='font-medium'>
              {t('services.standard.saonaIslandView.hero.locationBadge')}
            </span>
          </div>

          <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight'>
            {t('services.standard.saonaIslandView.hero.title')}
          </h1>

          <p className='text-sm sm:text-base md:text-lg text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed'>
            {t('services.standard.saonaIslandView.hero.description')}
          </p>

          <div className='bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6 inline-block'>
            <p className='text-white text-lg'>
              {t('services.standard.saonaIslandView.hero.priceFrom')}{' '}
              <span className='text-3xl font-bold text-cyan-400'>$75</span>
              <span className='text-sm text-white/80 ml-1'>
                {t('services.standard.saonaIslandView.hero.priceNote')}
              </span>
            </p>
            <p className='text-xs text-white/70 mt-1'>
              {t('services.standard.saonaIslandView.hero.pricingDetails')}
            </p>
          </div>

          <button
            onClick={onBookClick}
            className='bg-cyan-600 hover:bg-cyan-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg flex items-center gap-3 mx-auto transition-all duration-300 shadow-lg'
          >
            <Anchor className='w-5 h-5' />
            {t('services.standard.saonaIslandView.hero.bookButton')}
            <ArrowRight className='w-5 h-5' />
          </button>

          <div className='flex flex-wrap justify-center items-center gap-4 mt-6 text-white/70 text-sm'>
            <div className='flex items-center gap-1'>
              <Star className='w-4 h-4 text-yellow-400 fill-current' />
              <span>{t('services.standard.saonaIslandView.hero.rating')}</span>
            </div>
            <span>•</span>
            <span>
              {t('services.standard.saonaIslandView.hero.excursionists')}
            </span>
            <span>•</span>
            <span>{t('services.standard.saonaIslandView.hero.guides')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ItinerarySection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className='w-full py-12'>
      <div className='text-center mb-10'>
        <h2 className='text-2xl sm:text-3xl font-bold text-slate-800 mb-3'>
          {t('services.standard.saonaIslandView.itinerary.title')}
        </h2>
        <p className='text-slate-600'>
          {t('services.standard.saonaIslandView.itinerary.subtitle')}
        </p>
      </div>

      <div className='max-w-4xl mx-auto'>
        <div className='relative'>
          <div className='absolute left-4 md:left-1/2 md:transform md:-translate-x-1/2 top-0 bottom-0 w-0.5 bg-blue-200'></div>

          {ITINERARY_STEPS.map((step, index) => {
            const Icon = step.icon;
            const isEven = index % 2 === 0;
            const stepNum = index + 1;

            return (
              <div
                key={index}
                className={`relative flex items-start mb-8 ${
                  isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                <div className='absolute left-4 md:left-1/2 md:transform md:-translate-x-1/2 w-3 h-3 bg-blue-600 rounded-full border-4 border-white shadow-lg z-10'></div>

                <div
                  className={`ml-12 md:ml-0 md:w-1/2 ${
                    isEven ? 'md:pr-8' : 'md:pl-8'
                  }`}
                >
                  <div
                    className={`bg-white rounded-lg shadow-lg p-6 border border-blue-100 ${
                      !isEven ? 'md:text-right' : ''
                    }`}
                  >
                    <div
                      className={`flex items-center mb-3 ${
                        !isEven ? 'md:justify-end' : ''
                      }`}
                    >
                      <div
                        className={`w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center ${
                          !isEven ? 'md:order-2 md:ml-3' : 'mr-3'
                        }`}
                      >
                        <Icon className='w-5 h-5 text-blue-600' />
                      </div>
                      <div>
                        <h3 className='font-semibold text-gray-800 text-lg'>
                          {t(
                            `services.standard.saonaIslandView.itinerary.step${stepNum}.title`
                          )}
                        </h3>
                        <div className='flex items-center gap-2 text-sm text-blue-600'>
                          <Clock className='w-3 h-3' />
                          <span>{step.time}</span>
                          {step.duration && (
                            <>
                              <span>•</span>
                              <span>{step.duration}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <p className='text-gray-600 mb-4 leading-relaxed'>
                      {t(
                        `services.standard.saonaIslandView.itinerary.step${stepNum}.description`
                      )}
                    </p>

                    <div className='space-y-1'>
                      {[1, 2, 3, 4, 5].map((highlightNum) => {
                        const key = `services.standard.saonaIslandView.itinerary.step${stepNum}.highlight${highlightNum}`;
                        const highlight = t(key);
                        // Only render if translation exists (not the key itself)
                        if (highlight === key) return null;

                        return (
                          <div
                            key={highlightNum}
                            className={`flex items-center text-sm text-green-700 ${
                              !isEven ? 'md:justify-end' : ''
                            }`}
                          >
                            <Check className='w-3 h-3 mr-2 text-green-500 flex-shrink-0' />
                            <span>{highlight}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const WhatToBringSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className='w-full py-12 bg-blue-50'>
      <div className='text-center mb-10'>
        <h2 className='text-2xl sm:text-3xl font-bold text-slate-800 mb-3'>
          {t('services.standard.saonaIslandView.whatToBring.title')}
        </h2>
        <p className='text-slate-600'>
          {t('services.standard.saonaIslandView.whatToBring.subtitle')}
        </p>
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto'>
        {[1, 2, 3, 4, 5, 6].map((num) => (
          <div
            key={num}
            className='bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300'
          >
            <h3 className='text-lg font-semibold text-slate-800 mb-2'>
              {t(
                `services.standard.saonaIslandView.whatToBring.item${num}.title`
              )}
            </h3>
            <p className='text-slate-600 text-sm leading-relaxed'>
              {t(
                `services.standard.saonaIslandView.whatToBring.item${num}.description`
              )}
            </p>
          </div>
        ))}
      </div>

      <div className='mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg max-w-2xl mx-auto'>
        <div className='flex items-start'>
          <Sun className='w-5 h-5 text-yellow-600 mr-3 flex-shrink-0 mt-0.5' />
          <div>
            <h4 className='font-medium text-yellow-800 mb-1'>
              {t(
                'services.standard.saonaIslandView.whatToBring.importantTip.title'
              )}
            </h4>
            <p className='text-sm text-yellow-700'>
              {t(
                'services.standard.saonaIslandView.whatToBring.importantTip.text'
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

const WeatherDisclaimerSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className='w-full py-8'>
      <div className='bg-slate-100 border border-slate-200 rounded-lg p-6'>
        <div className='flex items-start'>
          <div className='w-12 h-12 bg-slate-200 rounded-lg flex items-center justify-center mr-4 flex-shrink-0'>
            <CloudRain className='w-6 h-6 text-slate-600' />
          </div>
          <div className='flex-1'>
            <h3 className='font-semibold text-slate-800 mb-3 text-lg flex items-center'>
              <AlertTriangle className='w-5 h-5 text-slate-600 mr-2' />
              {t('services.standard.saonaIslandView.weatherDisclaimer.title')}
            </h3>
            <div className='space-y-3 text-slate-700'>
              <p className='leading-relaxed'>
                <strong>
                  {t(
                    'services.standard.saonaIslandView.weatherDisclaimer.noRainCancel'
                  )}
                </strong>{' '}
                {t(
                  'services.standard.saonaIslandView.weatherDisclaimer.description'
                )}
              </p>
              <p className='leading-relaxed'>
                {t(
                  'services.standard.saonaIslandView.weatherDisclaimer.onlyCancelled'
                )}{' '}
                <strong>
                  {t(
                    'services.standard.saonaIslandView.weatherDisclaimer.extremeConditions'
                  )}
                </strong>{' '}
                {t(
                  'services.standard.saonaIslandView.weatherDisclaimer.safetyRisk'
                )}
              </p>
              <ul className='list-disc list-inside space-y-1 ml-4 text-sm'>
                <li>
                  {t(
                    'services.standard.saonaIslandView.weatherDisclaimer.condition1'
                  )}
                </li>
                <li>
                  {t(
                    'services.standard.saonaIslandView.weatherDisclaimer.condition2'
                  )}
                </li>
                <li>
                  {t(
                    'services.standard.saonaIslandView.weatherDisclaimer.condition3'
                  )}
                </li>
              </ul>
              <div className='mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg'>
                <p className='text-blue-800 text-sm'>
                  <strong>
                    {t(
                      'services.standard.saonaIslandView.weatherDisclaimer.guarantee'
                    )}
                  </strong>{' '}
                  {t(
                    'services.standard.saonaIslandView.weatherDisclaimer.guaranteeText'
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const SimpleGallery: React.FC = () => {
  const { t } = useTranslation();
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % galleryImages.length);
    }
  };

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage(
        (selectedImage - 1 + galleryImages.length) % galleryImages.length
      );
    }
  };

  return (
    <section className='w-full rounded-lg p-4 sm:p-6'>
      <div className='text-center mb-6'>
        <h2 className='text-2xl sm:text-3xl font-bold text-slate-800 mb-2'>
          {t('services.standard.saonaIslandView.gallery.title')}
        </h2>
        <p className='text-slate-600'>
          {t('services.standard.saonaIslandView.gallery.subtitle')}
        </p>
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4'>
        {galleryImages.map((image, index) => (
          <div
            key={image.id}
            className='group relative overflow-hidden rounded-lg cursor-pointer shadow-sm hover:shadow-md transition-all duration-300 aspect-square'
            onClick={() => setSelectedImage(index)}
          >
            <img
              src={image.src}
              alt={image.alt}
              className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
            />

            <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300' />

            <div className='absolute bottom-0 left-0 right-0 p-2 sm:p-3 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300'>
              <h3 className='font-medium text-sm'>
                {t(
                  `services.standard.saonaIslandView.gallery.image${image.id}`
                )}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {selectedImage !== null && (
        <div className='fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4'>
          <button
            onClick={() => setSelectedImage(null)}
            className='absolute top-4 right-4 w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors text-white'
          >
            <X className='w-5 h-5' />
          </button>

          <button
            onClick={prevImage}
            className='absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors text-white'
          >
            <ChevronLeft className='w-5 h-5' />
          </button>

          <button
            onClick={nextImage}
            className='absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors text-white'
          >
            <ChevronRight className='w-5 h-5' />
          </button>

          <div className='relative max-w-4xl max-h-[80vh] w-full'>
            <img
              src={galleryImages[selectedImage].src}
              alt={galleryImages[selectedImage].alt}
              className='w-full h-full object-contain rounded-lg'
            />

            <div className='absolute bottom-0 left-0 right-0 bg-black/60 p-4 rounded-b-lg'>
              <h3 className='text-lg font-semibold text-white'>
                {t(
                  `services.standard.saonaIslandView.gallery.image${
                    selectedImage + 1
                  }`
                )}
              </h3>
            </div>
          </div>

          <div className='absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/20 px-3 py-1 rounded-full text-white text-sm'>
            {selectedImage + 1} / {galleryImages.length}
          </div>
        </div>
      )}
    </section>
  );
};

const IslandExperience: React.FC = () => {
  const { t } = useTranslation();
  const experiences = [
    { icon: Waves },
    { icon: Fish },
    { icon: Utensils },
    { icon: Palmtree },
  ];

  return (
    <section className='w-full'>
      <div className='text-center mb-8'>
        <h2 className='text-2xl sm:text-3xl font-bold text-slate-800 mb-3'>
          {t('services.standard.saonaIslandView.experience.title')}
        </h2>
        <p className='text-slate-600'>
          {t('services.standard.saonaIslandView.experience.subtitle')}
        </p>
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6'>
        {experiences.map((exp, index) => {
          const Icon = exp.icon;
          const featureNum = index + 1;
          return (
            <div
              key={index}
              className='bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300'
            >
              <div className='w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4'>
                <Icon className='w-6 h-6 text-teal-600' />
              </div>
              <h3 className='text-lg font-semibold text-slate-800 mb-2'>
                {t(
                  `services.standard.saonaIslandView.experience.feature${featureNum}.title`
                )}
              </h3>
              <p className='text-slate-600 text-sm leading-relaxed'>
                {t(
                  `services.standard.saonaIslandView.experience.feature${featureNum}.description`
                )}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

const TourInformation: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className='w-full bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6'>
      <div className='flex items-start gap-4'>
        <div className='w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0'>
          <AlertCircle className='w-5 h-5 text-blue-600' />
        </div>
        <div className='flex-1'>
          <h3 className='font-semibold text-blue-800 mb-3 text-lg'>
            {t('services.standard.saonaIslandView.practicalInfo.title')}
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-3 text-blue-700 text-sm'>
            <div className='space-y-2'>
              <p>
                • {t('services.standard.saonaIslandView.practicalInfo.info1')}
              </p>
              <p>
                • {t('services.standard.saonaIslandView.practicalInfo.info2')}
              </p>
              <p>
                • {t('services.standard.saonaIslandView.practicalInfo.info3')}
              </p>
              <p>
                • {t('services.standard.saonaIslandView.practicalInfo.info4')}
              </p>
            </div>
            <div className='space-y-2'>
              <p>
                • {t('services.standard.saonaIslandView.practicalInfo.info5')}
              </p>
              <p>
                • {t('services.standard.saonaIslandView.practicalInfo.info6')}
              </p>
              <p>
                • {t('services.standard.saonaIslandView.practicalInfo.info7')}
              </p>
              <p>
                • {t('services.standard.saonaIslandView.practicalInfo.info8')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const SpecialBanner = ({ onBookClick }) => {
  const { t } = useTranslation();

  return (
    <section className='relative py-32 overflow-hidden'>
      <div className='absolute inset-0'>
        <img
          src='https://res.cloudinary.com/ddg92xar5/image/upload/v1755946736/saona_sky_ax2yol.jpg'
          alt='Saona Island experience'
          className='w-full h-full object-cover'
        />
        <div className='absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent' />
      </div>

      <div className='relative z-10 max-w-6xl mx-auto px-4'>
        <div className='max-w-2xl'>
          <div className='inline-flex items-center gap-2 bg-cyan-500/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-cyan-400/30'>
            <Sparkles className='w-4 h-4 text-cyan-400' />
            <span className='text-cyan-200 text-sm font-medium'>
              {t('services.standard.saonaIslandView.specialBanner.badge')}
            </span>
          </div>

          <h2 className='text-4xl md:text-5xl font-bold text-white mb-6'>
            {t('services.standard.saonaIslandView.specialBanner.title')}
            <span className='block text-cyan-400'>
              {t(
                'services.standard.saonaIslandView.specialBanner.titleHighlight'
              )}
            </span>
          </h2>

          <p className='text-lg text-white/90 mb-8'>
            {t('services.standard.saonaIslandView.specialBanner.description')}
          </p>

          <div className='flex flex-wrap gap-6 mb-8'>
            <div className='flex items-center gap-2 text-white'>
              <Heart className='w-5 h-5 text-red-400' />
              <span>
                {t('services.standard.saonaIslandView.specialBanner.badge1')}
              </span>
            </div>
            <div className='flex items-center gap-2 text-white'>
              <Shield className='w-5 h-5 text-green-400' />
              <span>
                {t('services.standard.saonaIslandView.specialBanner.badge2')}
              </span>
            </div>
            <div className='flex items-center gap-2 text-white'>
              <Star className='w-5 h-5 text-amber-400' />
              <span>
                {t('services.standard.saonaIslandView.specialBanner.badge3')}
              </span>
            </div>
          </div>

          <button
            onClick={onBookClick}
            className='bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all transform hover:scale-105 shadow-2xl'
          >
            {t('services.standard.saonaIslandView.specialBanner.button')}
          </button>
        </div>
      </div>
    </section>
  );
};

const BannersSection: React.FC<{
  onBookClick: () => void;
}> = ({ onBookClick }) => {
  const { t } = useTranslation();

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const DECORATION_BANNERS = [
    {
      id: 1,
      image:
        'https://puntacanaexcursions.online/wp-content/uploads/2024/09/saaoaaa.jpeg',
    },
    {
      id: 2,
      image:
        'https://res.cloudinary.com/ddg92xar5/image/upload/v1755946768/Saona_island_rvgcvb.jpg',
    },
    {
      id: 3,
      image:
        'https://res.cloudinary.com/ddg92xar5/image/upload/v1755946763/WhatsApp_Image_2021-08-11_at_10.08.09_PM_2_bx0kcz.jpg',
    },
  ] as const;

  const BannerCard: React.FC<{
    bannerId: number;
    image: string;
    reverse: boolean;
    onBookClick: () => void;
  }> = ({ bannerId, image, reverse, onBookClick }) => (
    <motion.div
      className={`grid lg:grid-cols-2 gap-12 items-center ${
        reverse ? 'lg:grid-flow-col-dense' : ''
      }`}
    >
      <div
        className={`relative h-96 rounded-2xl overflow-hidden ${
          reverse ? 'lg:col-start-2' : ''
        }`}
      >
        <img
          src={image}
          alt={t(
            `services.standard.saonaIslandView.decorationBanners.banner${bannerId}.title`
          )}
          className='w-full h-full object-cover'
        />
      </div>

      <div
        className={`space-y-6 ${reverse ? 'lg:col-start-1 lg:text-right' : ''}`}
      >
        <h2 className='text-4xl md:text-5xl font-light text-stone-800'>
          {t(
            `services.standard.saonaIslandView.decorationBanners.banner${bannerId}.title`
          )}
        </h2>
        <p className='text-xl text-stone-600 leading-relaxed'>
          {t(
            `services.standard.saonaIslandView.decorationBanners.banner${bannerId}.subtitle`
          )}
        </p>
      </div>
    </motion.div>
  );

  return (
    <motion.section
      className='py-20 px-2'
      initial='hidden'
      whileInView='visible'
      viewport={{ once: true }}
      variants={staggerChildren}
    >
      <div className='max-w-7xl mx-auto space-y-16'>
        {DECORATION_BANNERS.map((banner, index) => (
          <BannerCard
            key={banner.id}
            bannerId={banner.id}
            image={banner.image}
            reverse={index % 2 === 1}
            onBookClick={onBookClick}
          />
        ))}
      </div>
    </motion.section>
  );
};

const SaonaIslandTourServiceView: React.FC = ({ service }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const { bookService } = useBooking();

  const handleBookNow = () => {
    setIsModalOpen(true);
  };

  const handleBooking = useCallback(
    async (service: Service, dates: BookingDate, guests: number) => {
      try {
        setIsLoading(true);
        await bookService(service, dates, guests);
        setIsModalOpen(false);
      } catch (error) {
        console.error('Booking failed:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [bookService]
  );

  return (
    <div className='min-h-screen w-full bg-slate-50'>
      <IslandHero onBookClick={handleBookNow} />

      <div className='w-full px-2 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 sm:space-y-12 mx-auto'>
        <SimpleGallery />
        <IslandExperience />
        <WhatToBringSection />
        <BannersSection onBookClick={handleBookNow} />
        <SpecialBanner onBookClick={handleBookNow} />
        <ItinerarySection />
        <TourInformation />
        <WeatherDisclaimerSection />
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <BookingModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConfirm={handleBooking}
            service={service}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default SaonaIslandTourServiceView;
