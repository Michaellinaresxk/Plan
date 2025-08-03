import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  TreePine,
  Anchor,
  AlertCircle,
  Heart,
  Award,
  Shield,
} from 'lucide-react';
import { useBooking } from '@/context/BookingContext';
import { Service } from '@/types/type';
import { ServiceData } from '@/types/services';
import { BookingDate } from '@/types/type';
import BookingModal from '@/UI/components/modal/BookingModal';

// Types
interface TourPackage {
  id: string;
  name: string;
  price: number;
  duration: string;
  includes: string[];
  highlights: string[];
  maxGuests: number;
  recommended: boolean;
}

interface SaonaIslandTourServiceViewProps {
  service: Service;
  serviceData?: ServiceData;
  primaryColor: string;
}

// Mock data for tour packages
const tourPackages: TourPackage[] = [
  {
    id: 'classic',
    name: 'Classic Saona Island',
    price: 75,
    duration: '8 hours',
    includes: [
      'Round-trip transportation',
      'Speed boat ride',
      'Buffet lunch',
      'Natural pool stop',
      'Professional guide',
    ],
    highlights: [
      'Saona Island beach time',
      'Natural swimming pool',
      'Local lunch experience',
      'Starfish sighting',
    ],
    maxGuests: 50,
    recommended: false,
  },
  {
    id: 'premium',
    name: 'Premium Saona Experience',
    price: 120,
    duration: '9 hours',
    includes: [
      'All Classic features',
      'Premium catamaran',
      'Open bar',
      'Snorkeling equipment',
      'Professional photography',
      'VIP beach setup',
    ],
    highlights: [
      'Luxury catamaran transport',
      'Premium beach service',
      'Professional photos included',
      'Unlimited drinks',
      'Snorkeling adventure',
    ],
    maxGuests: 30,
    recommended: true,
  },
];

// Gallery images for masonry layout
const galleryImages = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?q=80&w=800',
    alt: 'Saona Island Beach',
    title: 'Paradise Beach',
    size: 'large',
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=600',
    alt: 'Natural Pool',
    title: 'Natural Swimming Pool',
    size: 'medium',
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=600',
    alt: 'Starfish',
    title: 'Starfish Encounter',
    size: 'medium',
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800',
    alt: 'Catamaran',
    title: 'Luxury Transportation',
    size: 'large',
  },
  {
    id: 5,
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=600',
    alt: 'Local Cuisine',
    title: 'Dominican Flavors',
    size: 'small',
  },
  {
    id: 6,
    src: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?q=80&w=600',
    alt: 'Snorkeling',
    title: 'Underwater Adventure',
    size: 'medium',
  },
  {
    id: 7,
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=600',
    alt: 'Beach Relaxation',
    title: 'Pure Relaxation',
    size: 'small',
  },
];

// Video Hero Component
const VideoHero: React.FC<{ onBookClick: () => void }> = ({ onBookClick }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {
        // Auto-play failed, which is fine
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
    <div className='relative h-screen overflow-hidden'>
      {/* Video Background */}
      <video
        ref={videoRef}
        className='absolute inset-0 w-full h-full object-cover'
        loop
        muted={isMuted}
        playsInline
        poster='https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?q=80&w=1920'
      >
        <source
          src='https://cdn.coverr.co/videos/coverr-tropical-beach-aerial-view-8662/1080p.mp4'
          type='video/mp4'
        />
        {/* Fallback for browsers that don't support video */}
        <img
          src='https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?q=80&w=1920'
          alt='Saona Island'
          className='w-full h-full object-cover'
        />
      </video>

      {/* Video Controls */}
      <div className='absolute top-6 right-6 flex gap-2'>
        <button
          onClick={togglePlay}
          className='w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 border border-white/20 text-white'
        >
          {isPlaying ? (
            <Pause className='w-5 h-5' />
          ) : (
            <Play className='w-5 h-5' />
          )}
        </button>
        <button
          onClick={toggleMute}
          className='w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 border border-white/20 text-white'
        >
          {isMuted ? (
            <VolumeX className='w-5 h-5' />
          ) : (
            <Volume2 className='w-5 h-5' />
          )}
        </button>
      </div>

      {/* Gradient Overlay */}
      <div className='absolute inset-0 bg-gradient-to-br from-slate-900/50 via-blue-900/30 to-emerald-900/40' />

      {/* Hero Content */}
      <div className='absolute inset-0 flex items-center justify-center text-center text-white p-8'>
        <div className='max-w-5xl'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className='inline-flex items-center bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 mb-8'
          >
            <MapPin className='w-5 h-5 mr-3 text-emerald-300' />
            <span className='font-semibold text-lg'>Dominican Paradise</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className='text-6xl md:text-7xl font-bold mb-6 leading-tight'
          >
            Saona Island
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className='text-2xl md:text-3xl text-white/90 mb-4 font-light'
          >
            Caribbean Paradise Experience
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className='text-lg text-white/80 mb-10 max-w-3xl mx-auto leading-relaxed'
          >
            Discover the most beautiful island in the Caribbean. Crystal clear
            waters, white sand beaches, and unforgettable memories await you in
            this tropical paradise.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            onClick={onBookClick}
            className='bg-gradient-to-r from-emerald-600 to-blue-500 hover:from-emerald-700 hover:to-blue-600 text-white px-10 py-5 rounded-2xl font-bold text-xl flex items-center gap-4 mx-auto transition-all duration-300 hover:scale-105 shadow-2xl'
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Explore Paradise
            <ArrowRight className='w-6 h-6' />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

// Masonry Gallery Component
const MasonryGallery: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'large':
        return 'md:col-span-2 md:row-span-2 h-96';
      case 'medium':
        return 'md:col-span-1 md:row-span-2 h-64';
      case 'small':
        return 'md:col-span-1 md:row-span-1 h-48';
      default:
        return 'md:col-span-1 md:row-span-1 h-48';
    }
  };

  return (
    <section className='bg-white rounded-3xl p-10 shadow-xl'>
      <div className='text-center mb-12'>
        <h2 className='text-4xl font-bold text-slate-800 mb-4'>
          Experience Gallery
        </h2>
        <p className='text-xl text-slate-600'>
          See the beauty that awaits you at Saona Island
        </p>
      </div>

      {/* Masonry Grid */}
      <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-min'>
        {galleryImages.map((image, index) => (
          <motion.div
            key={image.id}
            className={`group relative overflow-hidden rounded-2xl cursor-pointer shadow-lg ${getSizeClasses(
              image.size
            )}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => setSelectedImage(index)}
          >
            <img
              src={image.src}
              alt={image.alt}
              className='w-full h-full object-cover transition-all duration-500 group-hover:scale-110'
            />

            {/* Overlay */}
            <div className='absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300' />

            {/* Content */}
            <div className='absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300'>
              <h3 className='font-bold text-lg'>{image.title}</h3>
            </div>

            {/* Camera icon */}
            <div className='absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
              <Camera className='w-5 h-5 text-white' />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4'
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className='relative max-w-4xl max-h-[80vh] w-full'
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={galleryImages[selectedImage].src}
                alt={galleryImages[selectedImage].alt}
                className='w-full h-full object-contain rounded-2xl'
              />
              <button
                onClick={() => setSelectedImage(null)}
                className='absolute top-4 right-4 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 text-white'
              >
                ×
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

// Features Section Component
const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: Shield,
      title: 'Safety First',
      description: 'Professional crew and safety equipment for peace of mind',
      color: 'text-blue-600 bg-blue-100',
    },
    {
      icon: Award,
      title: 'Award Winning',
      description:
        'Recognized as the best island tour experience in the region',
      color: 'text-amber-600 bg-amber-100',
    },
    {
      icon: Heart,
      title: 'Eco-Friendly',
      description:
        'Sustainable tourism that protects our beautiful environment',
      color: 'text-emerald-600 bg-emerald-100',
    },
  ];

  return (
    <section className='bg-slate-50 rounded-3xl p-10'>
      <div className='text-center mb-12'>
        <h2 className='text-4xl font-bold text-slate-800 mb-4'>
          Why Choose Our Tour?
        </h2>
        <p className='text-xl text-slate-600'>
          Experience the difference with our premium service
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className='text-center'
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.6 }}
          >
            <div
              className={`w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center mx-auto mb-6`}
            >
              <feature.icon className='w-8 h-8' />
            </div>
            <h3 className='text-xl font-bold text-slate-800 mb-3'>
              {feature.title}
            </h3>
            <p className='text-slate-600 leading-relaxed'>
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

// Main Component
const SaonaIslandTourServiceView: React.FC<SaonaIslandTourServiceViewProps> = ({
  service,
  serviceData,
}) => {
  const { bookService } = useBooking();
  const [selectedPackage, setSelectedPackage] = useState<string>('premium');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const selectedPackageData = tourPackages.find(
    (pkg) => pkg.id === selectedPackage
  );

  const handleBookNow = () => {
    setIsModalOpen(true);
  };

  const handleBookingConfirm = (
    service: Service,
    dates: BookingDate,
    guests: number
  ) => {
    bookService(service, dates, guests);
    setIsModalOpen(false);
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50'>
      {/* Video Hero Section */}
      <VideoHero onBookClick={handleBookNow} />

      {/* Content sections */}
      <div className='max-w-7xl mx-auto px-6 py-16 space-y-16'>
        {/* Masonry Gallery */}
        <MasonryGallery />
        {/* Selected Package Details */}
        {selectedPackageData && (
          <motion.section
            layout
            className='bg-gradient-to-r from-emerald-600 to-blue-500 rounded-3xl p-10 text-white shadow-2xl'
          >
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
              <div>
                <h3 className='text-3xl font-bold mb-6'>
                  {selectedPackageData.name}
                </h3>
                <p className='text-xl text-emerald-100 mb-8 leading-relaxed'>
                  {selectedPackageData.id === 'premium'
                    ? "Experience Saona Island in ultimate luxury. Enjoy premium transportation, VIP beach service, professional photography, and unlimited refreshments while exploring one of the Caribbean's most beautiful destinations."
                    : 'Discover the natural beauty of Saona Island with our classic tour package. Perfect for families and groups looking for an authentic Caribbean island experience at an excellent value.'}
                </p>

                <div className='flex items-center gap-8 mb-8'>
                  <div className='text-center'>
                    <div className='text-3xl font-bold'>
                      ${selectedPackageData.price}
                    </div>
                    <div className='text-emerald-200'>per person</div>
                  </div>
                  <div className='text-center'>
                    <div className='text-3xl font-bold'>
                      {selectedPackageData.maxGuests}
                    </div>
                    <div className='text-emerald-200'>max guests</div>
                  </div>
                  <div className='text-center'>
                    <div className='text-3xl font-bold'>
                      {selectedPackageData.duration}
                    </div>
                    <div className='text-emerald-200'>duration</div>
                  </div>
                </div>

                <button
                  onClick={handleBookNow}
                  className='bg-white text-emerald-600 hover:bg-emerald-50 px-8 py-4 rounded-2xl font-bold text-lg flex items-center gap-3 transition-all duration-300 hover:scale-105 shadow-lg'
                >
                  <Calendar className='w-5 h-5' />
                  Book This Experience
                </button>
              </div>

              <div className='relative h-96 rounded-2xl overflow-hidden shadow-2xl'>
                <img
                  src='https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?q=80&w=800'
                  alt={selectedPackageData.name}
                  className='w-full h-full object-cover'
                />
              </div>
            </div>
          </motion.section>
        )}

        {/* Features Section */}
        <FeaturesSection />

        {/* Call to Action */}
        <section className='relative overflow-hidden rounded-3xl h-96 shadow-2xl'>
          <img
            src='https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?q=80&w=1920'
            alt='Saona Island paradise'
            className='w-full h-full object-cover'
          />
          <div className='absolute inset-0 bg-gradient-to-r from-slate-900/80 to-emerald-900/60' />

          <div className='absolute inset-0 flex items-center justify-center text-center text-white p-8'>
            <div className='max-w-3xl'>
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className='text-5xl font-bold mb-6'
              >
                Ready for Paradise?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className='text-xl text-white/90 mb-8'
              >
                Book your Saona Island adventure today and discover why millions
                choose this Caribbean paradise. Limited availability!
              </motion.p>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className='flex flex-col sm:flex-row gap-4 justify-center items-center'
              >
                <button
                  onClick={handleBookNow}
                  className='bg-gradient-to-r from-emerald-600 to-blue-500 hover:from-emerald-700 hover:to-blue-600 text-white px-10 py-5 rounded-2xl font-bold text-xl flex items-center gap-4 transition-all duration-300 hover:scale-105 shadow-2xl'
                >
                  <Anchor className='w-6 h-6' />
                  Book Now
                </button>
                <div className='text-white/80 text-sm'>
                  Free cancellation • Instant confirmation • Best price
                  guarantee
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Important Notice */}
        <motion.div
          className='bg-blue-50 border-l-4 border-blue-400 rounded-2xl p-8'
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className='flex items-start'>
            <div className='w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center mr-4 flex-shrink-0'>
              <AlertCircle className='w-5 h-5 text-blue-600' />
            </div>
            <div>
              <h3 className='font-bold text-blue-800 mb-3 text-lg'>
                Important Information
              </h3>
              <div className='text-blue-700 leading-relaxed space-y-2'>
                <p>
                  • Tours are weather dependent and may be rescheduled for
                  safety
                </p>
                <p>• Pickup times vary by hotel location (6:30 AM - 8:30 AM)</p>
                <p>• Bring sunscreen, towel, and comfortable swimwear</p>
                <p>• Life jackets provided for all water activities</p>
                <p>• Full refund available for weather cancellations</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Booking Modal */}
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

export default SaonaIslandTourServiceView;
