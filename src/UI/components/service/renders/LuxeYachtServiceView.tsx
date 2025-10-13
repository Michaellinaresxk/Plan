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
  MapPin,
  Clock,
  Wifi,
  Utensils,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Phone,
  Mail,
  CheckCircle,
  Camera,
  X,
  Check,
  Shirt,
  Sun,
  Shield,
  Award,
  Coffee,
  Fish,
  Sunset,
  Navigation,
  Eye,
  Share2,
  Info,
  Palmtree,
  Wind,
  BedDouble,
  Zap,
  Music,
  Droplets,
  Globe,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/client';
import { motion } from 'framer-motion';
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

// ============================================
// TYPES & INTERFACES
// ============================================
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

interface BookingFormData {
  date: string;
  guests: number;
  duration: 'half-day' | 'full-day';
  name: string;
  email: string;
  phone: string;
  message: string;
  addons: string[];
}

interface HeroProps {
  onExploreFleet: () => void;
  onOpenBooking: () => void;
}

interface CTABannerProps {
  onExploreFleet: () => void;
  onOpenBooking: () => void;
}

interface BookingFormProps {
  yacht: Yacht | null;
  onClose: () => void;
}

interface YachtDetailsModalProps {
  yacht: Yacht;
  onClose: () => void;
  onBookYacht: (yacht: Yacht) => void;
}

interface YachtCardProps {
  yacht: Yacht;
  onSelect: (yacht: Yacht) => void;
}

// ============================================
// UNIFIED BOOKING FORM COMPONENT
// ============================================
const UnifiedBookingForm: React.FC<BookingFormProps> = ({ yacht, onClose }) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<BookingFormData>({
    date: '',
    guests: 2,
    duration: 'full-day',
    name: '',
    email: '',
    phone: '',
    message: '',
    addons: [],
  });

  const handleAddonToggle = (addonId: string) => {
    setFormData((prev) => ({
      ...prev,
      addons: prev.addons.includes(addonId)
        ? prev.addons.filter((id) => id !== addonId)
        : [...prev.addons, addonId],
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    setTimeout(() => {
      alert('Booking request submitted successfully!');
      setIsSubmitting(false);
      onClose();
      setFormData({
        date: '',
        guests: 2,
        duration: 'full-day',
        name: '',
        email: '',
        phone: '',
        message: '',
        addons: [],
      });
    }, 2000);
  };

  const maxGuests = yacht?.specifications?.maxGuests || 20;

  return (
    <section className='relative py-10 sm:py-20 bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500 overflow-hidden min-h-screen flex items-center'>
      <div className='relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full'>
        <div className='bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden'>
          <div className='bg-gradient-to-r from-teal-600 to-cyan-600 px-4 sm:px-8 py-4 sm:py-6 flex justify-between items-center'>
            <div>
              <h3 className='text-xl sm:text-2xl font-bold text-white'>
                {yacht ? `Book ${yacht.name}` : 'Request Your Yacht Experience'}
              </h3>
              <p className='text-teal-100 text-xs sm:text-sm mt-1'>
                Fill out the form below
              </p>
            </div>
            <button
              onClick={onClose}
              className='text-white hover:bg-white/20 rounded-full p-2 transition-colors'
              aria-label='Close form'
            >
              <X className='w-5 h-5 sm:w-6 sm:h-6' />
            </button>
          </div>

          <div className='p-4 sm:p-8 max-h-[70vh] overflow-y-auto'>
            <div className='space-y-4 sm:space-y-5'>
              <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4'>
                <div>
                  <label className='block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2'>
                    Date <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='date'
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={formData.date}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, date: e.target.value }))
                    }
                    className='w-full px-3 py-2 sm:px-4 sm:py-3 text-sm border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all'
                  />
                </div>

                <div>
                  <label className='block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2'>
                    Guests <span className='text-red-500'>*</span>
                  </label>
                  <select
                    value={formData.guests}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        guests: parseInt(e.target.value),
                      }))
                    }
                    className='w-full px-3 py-2 sm:px-4 sm:py-3 text-sm border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all'
                  >
                    {Array.from({ length: maxGuests }, (_, i) => i + 1).map(
                      (num) => (
                        <option key={num} value={num}>
                          {num} {num > 1 ? 'Guests' : 'Guest'}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <label className='block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2'>
                    Duration <span className='text-red-500'>*</span>
                  </label>
                  <select
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        duration: e.target.value as 'half-day' | 'full-day',
                      }))
                    }
                    className='w-full px-3 py-2 sm:px-4 sm:py-3 text-sm border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all'
                  >
                    <option value='half-day'>Half Day (4h)</option>
                    <option value='full-day'>Full Day (8h)</option>
                  </select>
                </div>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4'>
                <div>
                  <label className='block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2'>
                    Name <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='text'
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className='w-full px-3 py-2 sm:px-4 sm:py-3 text-sm border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all'
                    placeholder='John Doe'
                  />
                </div>

                <div>
                  <label className='block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2'>
                    Email <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='email'
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className='w-full px-3 py-2 sm:px-4 sm:py-3 text-sm border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all'
                    placeholder='john@example.com'
                  />
                </div>

                <div>
                  <label className='block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2'>
                    Phone <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='tel'
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    className='w-full px-3 py-2 sm:px-4 sm:py-3 text-sm border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all'
                    placeholder='+1 234 567 8900'
                  />
                </div>
              </div>

              <div>
                <h4 className='text-sm sm:text-base font-bold text-gray-900 mb-2'>
                  Additional Services (Optional)
                </h4>
                <div className='grid grid-cols-2 sm:grid-cols-3 gap-2'>
                  {[
                    { id: 'catering', label: 'Catering', icon: Coffee },
                    { id: 'massage', label: 'Massage', icon: Sparkles },
                    { id: 'yoga', label: 'Yoga', icon: Heart },
                    { id: 'photography', label: 'Photography', icon: Camera },
                    { id: 'dj', label: 'DJ', icon: Music },
                    { id: 'celebration', label: 'Celebration', icon: Sparkles },
                  ].map((addon) => {
                    const IconComponent = addon.icon;
                    return (
                      <label
                        key={addon.id}
                        className='flex items-center gap-2 p-2 sm:p-3 rounded-lg border-2 border-gray-200 hover:border-teal-300 cursor-pointer transition-all text-xs sm:text-sm'
                      >
                        <input
                          type='checkbox'
                          checked={formData.addons.includes(addon.id)}
                          onChange={() => handleAddonToggle(addon.id)}
                          className='w-4 h-4 text-teal-600 rounded focus:ring-teal-500'
                        />
                        <IconComponent className='w-3 h-3 sm:w-4 sm:h-4 text-teal-600 flex-shrink-0' />
                        <span className='text-gray-700 font-medium truncate'>
                          {addon.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className='block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2'>
                  Special Requests
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      message: e.target.value,
                    }))
                  }
                  rows={2}
                  className='w-full px-3 py-2 sm:px-4 sm:py-3 text-sm border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all resize-none'
                  placeholder='Any special requests or questions?'
                />
              </div>

              <div className='bg-teal-50 rounded-xl p-3 sm:p-4 border border-teal-200'>
                <div className='flex gap-2 sm:gap-3'>
                  <Info className='w-4 h-4 sm:w-5 sm:h-5 text-teal-600 flex-shrink-0 mt-0.5' />
                  <div>
                    <p className='text-xs sm:text-sm font-medium text-teal-900'>
                      Response Time: 24-48 hours
                    </p>
                    <p className='text-xs sm:text-sm text-teal-700 mt-1'>
                      We'll contact you to confirm availability and finalize
                      details.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`w-full py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 shadow-lg hover:shadow-xl'
                } text-white`}
              >
                {isSubmitting ? (
                  <>
                    <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white' />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Sparkles className='w-5 h-5' />
                    Submit Request
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================
// HERO COMPONENT
// ============================================
const CinematicHero: React.FC<HeroProps> = ({
  onExploreFleet,
  onOpenBooking,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log('Autoplay prevented:', error);
        });
      }
    }
  }, []);

  return (
    <div className='relative min-h-screen bg-black'>
      <div className='absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950'>
        <div className='absolute inset-0 opacity-30 bg-gradient-radial' />
      </div>

      <div className='relative mt-20 z-10 min-h-screen'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12'>
          <div className='grid lg:grid-cols-2 gap-8 lg:gap-12 items-center'>
            <div className='order-2 lg:order-1 space-y-6 lg:space-y-8'>
              <div>
                <div className='flex items-center space-x-3 mb-4'>
                  <div className='h-px w-12 bg-gradient-to-r from-transparent to-cyan-400'></div>
                  <Anchor className='w-5 h-5 text-cyan-400' />
                </div>

                <h1 className='text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-light text-white mb-4 leading-tight'>
                  Where
                  <span className='block font-black text-5xl sm:text-6xl lg:text-7xl xl:text-8xl mt-2 mb-3'>
                    <span className='bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-400 bg-clip-text text-transparent'>
                      LUXURY
                    </span>
                  </span>
                  Meets the Sea
                </h1>

                <p className='text-base sm:text-lg lg:text-xl text-gray-300 leading-relaxed max-w-xl'>
                  Embark on an unforgettable journey aboard our meticulously
                  curated fleet of premium yachts.
                </p>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                {[
                  { icon: Diamond, label: 'Premium Fleet', value: '50+' },
                  { icon: Waves, label: 'Destinations', value: '120+' },
                  { icon: Star, label: 'Rating', value: '5.0' },
                  { icon: Anchor, label: 'Experience', value: '15Y' },
                ].map((item, index) => (
                  <div
                    key={index}
                    className='bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all duration-300 group cursor-pointer'
                  >
                    <item.icon className='w-6 h-6 text-cyan-400 mb-2 group-hover:scale-110 transition-transform' />
                    <div className='text-2xl font-bold text-white mb-1'>
                      {item.value}
                    </div>
                    <div className='text-xs text-gray-400'>{item.label}</div>
                  </div>
                ))}
              </div>

              <div className='flex flex-col sm:flex-row gap-4'>
                <button
                  onClick={onOpenBooking}
                  className='relative overflow-hidden bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-600 px-8 py-4 rounded-full font-bold text-white shadow-xl shadow-cyan-500/30 group hover:scale-105 transition-transform'
                >
                  <span className='relative z-10 flex items-center justify-center space-x-2'>
                    <span>Book Your Voyage</span>
                    <Diamond className='w-5 h-5 group-hover:rotate-180 transition-transform duration-500' />
                  </span>
                </button>

                <button
                  onClick={onExploreFleet}
                  className='px-8 py-4 rounded-full font-bold text-white border-2 border-white/20 backdrop-blur-sm hover:bg-white/10 transition-all'
                >
                  Explore Fleet
                </button>
              </div>
            </div>

            <div className='order-1 lg:order-2'>
              <div className='relative'>
                <div className='absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-purple-500/30 blur-3xl scale-105' />

                <div className='relative rounded-3xl overflow-hidden border border-white/20 shadow-2xl backdrop-blur-sm bg-gradient-to-br from-white/10 to-white/5'>
                  <div className='absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-amber-400 rounded-tl-3xl z-10' />
                  <div className='absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-cyan-400 rounded-br-3xl z-10' />

                  <div className='relative aspect-[9/16] sm:aspect-video lg:aspect-[4/5]'>
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className='absolute inset-0 w-full h-full object-cover'
                      poster='https://res.cloudinary.com/ddg92xar5/image/upload/v1754600018/2_dc7fry.jpg'
                    >
                      <source
                        src='https://res.cloudinary.com/ddg92xar5/video/upload/v1759669338/yate_m7z3ve.mp4'
                        type='video/mp4'
                      />
                    </video>

                    <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20' />

                    <div className='absolute top-6 left-6 bg-black/60 backdrop-blur-xl border border-amber-400/50 rounded-2xl px-4 py-2'>
                      <div className='flex items-center space-x-2'>
                        <div className='w-2 h-2 bg-amber-400 rounded-full animate-pulse' />
                        <span className='text-xs font-bold text-amber-300'>
                          LIVE PREVIEW
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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
const FeatureCard = ({ icon: Icon, label, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.05 }}
      className='bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300'
    >
      <div className='flex items-center gap-3'>
        <div className='w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0'>
          <Icon className='w-5 h-5 text-white' />
        </div>
        <span className='text-gray-700 font-medium text-sm'>{label}</span>
      </div>
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

  const features = [
    { icon: Diamond, label: 'Luxury Yachts' },
    { icon: Waves, label: 'Premium Experience' },
    { icon: Crown, label: 'Exclusive Service' },
    { icon: Heart, label: 'Unforgettable Moments' },
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
    <div
      className='group relative h-50 lg:h-80 rounded-3xl overflow-hidden cursor-pointer transform transition-all duration-500 hover:scale-[1.02] hover:shadow-xl'
      onClick={() => onSelect(yacht)}
    >
      <img
        src={yacht.mainImage}
        alt={yacht.name}
        className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
      />

      <div className='absolute inset-0 bg-gradient-to-t from-blue-900/70 via-transparent to-transparent' />

      {yacht.isPremium && (
        <div className='absolute top-4 right-4 bg-gradient-to-r from-coral-400 to-orange-400 text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1'>
          <Crown className='w-3 h-3' />
          {t('services.premium.luxYachtView.yachtGrid.cardPremiumBadge')}
        </div>
      )}

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

// Sunset CTA Banner
const SunsetCTABanner: React.FC<CTABannerProps> = ({
  onExploreFleet,
  onOpenBooking,
}) => {
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

// Tropical CTA Banner (Simplified)
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

// Gallery Section
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

// What to Bring Section
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

// Yacht Details Modal
const YachtDetailsModal: React.FC<YachtDetailsModalProps> = ({
  yacht,
  onClose,
  onBookYacht,
}) => {
  const { t } = useTranslation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className='fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
      <div className='bg-white rounded-3xl max-w-6xl w-full h-[95vh] overflow-hidden shadow-2xl flex flex-col lg:flex-row'>
        <div className='lg:w-3/5 flex flex-col min-h-0'>
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

          <div className='relative flex-1 bg-gray-100 min-h-0'>
            <img
              src={yacht.gallery[currentImageIndex]}
              alt={`${yacht.name} - Image ${currentImageIndex + 1}`}
              className='w-full h-full object-cover'
            />

            <div className='absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm'>
              {currentImageIndex + 1} / {yacht.gallery.length}
            </div>

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

        <div className='lg:w-2/5 flex flex-col min-h-0'>
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
              onClick={() => onBookYacht(yacht)}
              className='w-full bg-teal-600 hover:bg-teal-700 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2'
            >
              <Calendar className='w-5 h-5' />
              {t('services.premium.luxYachtView.modal.ctaBook')}
            </button>
          </div>

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

          <CaribbeanGallery />
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
