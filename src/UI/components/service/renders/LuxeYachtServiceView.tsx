import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from 'react';
import {
  Anchor,
  Users,
  Star,
  Clock,
  Wifi,
  Utensils,
  Calendar,
  CheckCircle,
  Camera,
  X,
  Check,
  Shirt,
  Sun,
  Shield,
  Award,
  Sunset,
  Navigation,
  Info,
  Wind,
  Eye,
  Minus,
  Plus,
  Music,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/client';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Play,
  Pause,
  Diamond,
  Waves,
  Crown,
  Heart,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import {
  CTABannerProps,
  Yacht,
  YachtCardProps,
} from '@/constants/yacht/yachts';
import YachtDetailsModal from '../yacht/YachtDetailsModal';
import UnifiedBookingForm from '../yacht/UnifiedBookingForm';
import CinematicHero from '../yacht/CinematicHero';

// Animated Background Component
const AnimatedBackground = () => {
  return (
    <div className='absolute inset-0 overflow-hidden pointer-events-none'>
      <div className='absolute top-0 left-0 w-96 h-96 bg-cyan-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob' />
      <div className='absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000' />
      <div className='absolute bottom-0 left-1/2 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000' />
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon: Icon, label, description, index }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className='bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden'
    >
      {/* Header - Clickable */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='w-full p-4 flex items-center gap-3 hover:bg-gray-50/50 transition-colors'
      >
        <div className='w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0'>
          <Icon className='w-5 h-5 text-white' />
        </div>
        <span className='text-gray-700 font-medium text-sm flex-1 text-left'>
          {label}
        </span>
        <div className='w-6 h-6 flex items-center justify-center text-cyan-600'>
          {isOpen ? (
            <Minus className='w-5 h-5' />
          ) : (
            <Plus className='w-5 h-5' />
          )}
        </div>
      </button>

      {/* Accordion Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className='overflow-hidden'
          >
            <div className='px-4 pb-4 pt-2 border-t border-gray-100'>
              <div className='prose prose-sm max-w-none text-gray-600'>
                {description}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Video Player Component
const VideoPlayer = ({ isPlaying, onToggle }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      const playPromise = video.play();

      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error('Error al reproducir:', error);
          onToggle();
        });
      }
    } else {
      video.pause();
    }
  }, [isPlaying, onToggle]);

  const handleClick = () => {
    onToggle();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className='relative group'
    >
      <div className='absolute -inset-4 bg-gradient-to-r from-cyan-200 via-blue-200 to-purple-200 rounded-3xl opacity-30 blur-xl group-hover:opacity-50 transition-opacity duration-300' />

      <div className='relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100'>
        <div className='relative aspect-video'>
          <video
            ref={videoRef}
            className='w-full h-full object-cover'
            poster='https://res.cloudinary.com/ddg92xar5/image/upload/v1754600018/2_dc7fry.jpg'
            preload='metadata'
            playsInline
          >
            <source
              src='https://res.cloudinary.com/ddg92xar5/video/upload/v1759669338/yate_m7z3ve.mp4'
              type='video/mp4'
            />
          </video>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isPlaying ? 0 : 1 }}
            transition={{ duration: 0.2 }}
            className='absolute inset-0 flex items-center justify-center bg-gradient-to-br from-black/30 to-black/50 backdrop-blur-sm cursor-pointer'
            onClick={handleClick}
            style={{ pointerEvents: isPlaying ? 'none' : 'auto' }}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className='w-20 h-20 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl'
            >
              <Play className='w-10 h-10 text-cyan-600 ml-1' />
            </motion.div>
          </motion.div>

          {isPlaying && (
            <div
              className='absolute inset-0 cursor-pointer group/video'
              onClick={handleClick}
            >
              <div className='absolute inset-0 bg-black/0 group-hover/video:bg-black/10 transition-colors duration-200 flex items-center justify-center'>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className='w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-xl'
                >
                  <Pause className='w-8 h-8 text-cyan-600' />
                </motion.div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Promo Video Section
const PromoVideoSection = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const { t } = useTranslation();
  const features = [
    {
      icon: Diamond,
      label: t(
        'services.premium.luxYachtView.promoVideoSection.features.provisioning.title'
      ),
      description: t(
        'services.premium.luxYachtView.promoVideoSection.features.provisioning.description'
      ),
    },
    {
      icon: Heart,
      label: t(
        'services.premium.luxYachtView.promoVideoSection.features.wellness.title'
      ),
      description: t(
        'services.premium.luxYachtView.promoVideoSection.features.wellness.description'
      ),
    },
    {
      icon: Waves,
      label: t(
        'services.premium.luxYachtView.promoVideoSection.features.photography.title'
      ),
      description: t(
        'services.premium.luxYachtView.promoVideoSection.features.photography.description'
      ),
    },
    {
      icon: Crown,
      label: t(
        'services.premium.luxYachtView.promoVideoSection.features.specialOccasion.title'
      ),
      description: t(
        'services.premium.luxYachtView.promoVideoSection.features.specialOccasion.description'
      ),
    },
    {
      icon: Music,
      label: t(
        'services.premium.luxYachtView.promoVideoSection.features.liveEntertainment.title'
      ),
      description: t(
        'services.premium.luxYachtView.promoVideoSection.features.liveEntertainment.description'
      ),
    },
  ];

  return (
    <section className='relative py-20 bg-white overflow-hidden'>
      <AnimatedBackground />

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
        <div className='grid lg:grid-cols-2 gap-12 lg:gap-16 items-center'>
          <div className='space-y-8'>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className='inline-flex items-center gap-2 bg-gradient-to-r from-cyan-50 to-blue-50 px-5 py-2.5 rounded-full mb-6 border border-cyan-100'>
                <Play className='w-4 h-4 text-cyan-600' />
                <span className='text-cyan-800 text-sm font-semibold tracking-wide'>
                  WATCH NOW
                </span>
              </div>

              <h2 className='text-4xl sm:text-5xl lg:text-6xl font-light text-gray-900 mb-6 leading-tight'>
                Experience{' '}
                <span className='font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent'>
                  Luxury
                </span>
              </h2>

              <p className='text-lg text-gray-600 leading-relaxed'>
                Discover our exclusive fleet of premium yachts. Immerse yourself
                in an unparalleled experience of luxury and comfort on the open
                seas.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className='grid grid-cols-2 gap-4'
            >
              {features.map((feature, index) => (
                <FeatureCard
                  key={index}
                  icon={feature.icon}
                  label={feature.label}
                  description={feature.description}
                  index={index}
                />
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className='flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-gradient-to-r from-gray-50 to-cyan-50 rounded-2xl p-6 border border-gray-100'
            >
              <div className='flex items-center gap-3 flex-1'>
                <div className='w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0'>
                  <Sparkles className='w-6 h-6 text-white' />
                </div>
                <div>
                  <p className='text-gray-900 font-semibold'>Ready to sail?</p>
                  <p className='text-gray-600 text-sm'>
                    Explore our premium fleet
                  </p>
                </div>
              </div>
              <motion.a
                href='#fleet'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className='px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 w-full sm:w-auto justify-center'
              >
                View Fleet
                <ArrowRight className='w-5 h-5' />
              </motion.a>
            </motion.div>
          </div>

          <div>
            <VideoPlayer
              isPlaying={isPlaying}
              onToggle={() => setIsPlaying(!isPlaying)}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

// Yacht Card Component
const PhotoOnlyYachtCard: React.FC<YachtCardProps> = ({ yacht, onSelect }) => {
  const { t } = useTranslation();

  return (
    <div className='group relative h-64 lg:h-80 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500'>
      <img
        src={yacht.mainImage}
        alt={yacht.name}
        className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
      />

      <div className='absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/40 to-transparent' />

      {yacht.isPremium && (
        <div className='absolute top-4 right-4 bg-gradient-to-r from-coral-400 to-orange-400 text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg z-10'>
          <Crown className='w-3 h-3' />
          {t('services.premium.luxYachtView.yachtGrid.cardPremiumBadge')}
        </div>
      )}

      <div className='absolute bottom-0 left-0 right-0 p-4 md:p-5 text-white'>
        <div className='flex items-center justify-between mb-3'>
          <h3 className='text-lg md:text-xl lg:text-2xl font-semibold group-hover:text-teal-300 transition-colors'>
            {yacht.name}
          </h3>
          <div className='flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full'>
            <Users className='w-4 h-4' />
            <span className='text-sm font-medium'>
              {yacht.specifications.maxGuests}
            </span>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(yacht);
          }}
          className='w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white py-2.5 md:py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] group/button'
        >
          <Eye className='w-4 h-4 group-hover/button:scale-110 transition-transform' />
          <span>View Details</span>
          <ArrowRight className='w-4 h-4 group-hover/button:translate-x-1 transition-transform' />
        </button>
      </div>
    </div>
  );
};

// Sunset CTA Banner
const SunsetCTABanner: React.FC<CTABannerProps> = ({ onOpenBooking }) => {
  const { t } = useTranslation();

  return (
    <section className='relative py-24 overflow-hidden'>
      <div className='absolute inset-0'>
        <img
          src='https://res.cloudinary.com/ddg92xar5/image/upload/v1754600018/2_dc7fry.jpg'
          alt='Sunset yacht'
          className='w-full h-full object-cover'
        />
        <div className='absolute inset-0 bg-gradient-to-r from-orange-900/90 via-pink-900/80 to-purple-900/90' />
      </div>

      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className='absolute w-2 h-2 bg-white/30 rounded-full'
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className='relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className='inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/30 rounded-full px-6 py-3 mb-8'>
            <Sunset className='w-5 h-5 text-orange-300' />
            <span className='text-white text-sm font-semibold tracking-wide'>
              {t('services.premium.luxYachtView.yachtCta.cta1Badge')}
            </span>
          </div>

          <h2 className='text-4xl sm:text-5xl lg:text-6xl font-light text-white mb-6 leading-tight'>
            {t('services.premium.luxYachtView.yachtCta.cta1Title')}{' '}
            <span className='block font-bold bg-gradient-to-r from-orange-300 via-pink-300 to-purple-300 bg-clip-text text-transparent'>
              {t('services.premium.luxYachtView.yachtCta.cta1TitleHighlight')}
            </span>
          </h2>

          <p className='text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed'>
            {t('services.premium.luxYachtView.yachtCta.cta1Description')}
          </p>

          <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
            <motion.button
              onClick={onOpenBooking}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className='px-8 py-4 bg-white text-orange-600 rounded-xl font-bold text-lg transition-all duration-300 shadow-2xl hover:shadow-orange-500/50 flex items-center gap-3 group'
            >
              <Calendar className='w-6 h-6 group-hover:rotate-12 transition-transform' />
              {t('services.premium.luxYachtView.yachtCta.cta1Button')}
              <ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform' />
            </motion.button>

            <motion.a
              href='#fleet'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className='px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white/50 text-white rounded-xl font-semibold text-lg transition-all duration-300 hover:bg-white/20 flex items-center gap-2'
            >
              <Anchor className='w-5 h-5' />
              {t('services.premium.luxYachtView.yachtCta.cta1SecondaryButton')}
            </motion.a>
          </div>

          <div className='mt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto'>
            {[
              {
                icon: Users,
                value: '500+',
                label: t('services.premium.luxYachtView.yachtCta.stat1'),
              },
              {
                icon: Star,
                value: '5.0',
                label: t('services.premium.luxYachtView.yachtCta.stat2'),
              },
              {
                icon: Award,
                value: '4',
                label: t('services.premium.luxYachtView.yachtCta.stat3'),
              },
            ].map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className='text-white'
                >
                  <IconComponent className='w-8 h-8 mx-auto mb-2 text-orange-300' />
                  <div className='text-3xl font-bold mb-1'>{stat.value}</div>
                  <div className='text-sm text-white/80'>{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const TropicalCTABanner: React.FC<{ onOpenBooking: () => void }> = ({
  onOpenBooking,
}) => {
  const { t } = useTranslation();

  return (
    <section className='relative py-16 sm:py-20 bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500 overflow-hidden'>
      <div className='relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
        <div className='inline-flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-4 sm:px-5 py-2 sm:py-2.5 mb-4 sm:mb-6'>
          <Waves className='w-4 h-4 text-white' />
          <span className='text-xs sm:text-sm font-semibold tracking-wide text-white'>
            BOOK YOUR ADVENTURE
          </span>
        </div>

        <h2 className='text-3xl sm:text-4xl lg:text-5xl font-light mb-4 sm:mb-6 leading-tight text-white'>
          Ready for an{' '}
          <span className='block font-bold text-yellow-300'>
            Unforgettable Experience?
          </span>
        </h2>

        <p className='text-base sm:text-lg text-white/90 mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto'>
          Create memories that last a lifetime aboard our luxury yachts
        </p>

        <button
          onClick={onOpenBooking}
          className='px-8 sm:px-12 py-4 sm:py-5 bg-white text-teal-600 rounded-2xl font-bold text-lg sm:text-xl transition-all duration-300 shadow-2xl hover:shadow-white/30 inline-flex items-center gap-3 group hover:scale-105'
        >
          <Sparkles className='w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-12 transition-transform' />
          Get Started
          <ArrowRight className='w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform' />
        </button>
      </div>
    </section>
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

        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 md:gap-6'>
          {filteredYachts.map((yacht) => (
            <PhotoOnlyYachtCard
              key={yacht.id}
              yacht={yacht}
              onSelect={onYachtSelect}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

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

// Private Service Info Section
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

// ============================================
// MAIN COMPONENT
// ============================================
const LuxeYachtServiceView: React.FC = () => {
  const { t } = useTranslation();

  const [selectedYacht, setSelectedYacht] = useState<Yacht | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const fleetRef = useRef<HTMLDivElement>(null);

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

  // ============================================
  // EVENT HANDLERS
  // ============================================
  const handleExploreFleet = useCallback(() => {
    fleetRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleYachtSelect = useCallback((yacht: Yacht) => {
    setSelectedYacht(yacht);
    setShowDetailsModal(true);
  }, []);

  const handleOpenBooking = useCallback((yacht?: Yacht) => {
    if (yacht) {
      setSelectedYacht(yacht);
    }
    setShowDetailsModal(false);
    setShowBookingForm(true);
  }, []);

  const handleCloseAll = useCallback(() => {
    setSelectedYacht(null);
    setShowBookingForm(false);
    setShowDetailsModal(false);
  }, []);

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className='min-h-screen bg-white'>
      {!showBookingForm ? (
        <>
          <CinematicHero
            onExploreFleet={handleExploreFleet}
            onOpenBooking={() => handleOpenBooking()}
          />
          <div ref={fleetRef}>
            <CaribbeanYachtGrid
              onYachtSelect={handleYachtSelect}
              yachtData={YACHT_DATA}
            />
          </div>

          <PromoVideoSection />

          <TropicalCTABanner onOpenBooking={() => handleOpenBooking()} />

          <CaribbeanWhatToBring />
          <PrivateServiceInfo />

          <SunsetCTABanner
            onExploreFleet={handleExploreFleet}
            onOpenBooking={() => handleOpenBooking()}
          />

          <YachtImportantInfo />

          {selectedYacht && showDetailsModal && (
            <YachtDetailsModal
              yacht={selectedYacht}
              onClose={handleCloseAll}
              onBookYacht={handleOpenBooking}
            />
          )}
        </>
      ) : (
        <UnifiedBookingForm yacht={selectedYacht} onClose={handleCloseAll} />
      )}
    </div>
  );
};

export default LuxeYachtServiceView;
