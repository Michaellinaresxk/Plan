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
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import BookingModal from '../../modal/BookingModal';
import { BookingDate, Service } from '@/constants/formFields';
import { useTranslation } from '@/lib/i18n/client';
import { useBooking } from '@/context/BookingContext';

// Types
interface TourPackage {
  id: string;
  name: string;
  price: number;
  duration: string;
  includes: string[];
  maxGuests: number;
}

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  title: string;
}

// Simple gallery data
const galleryImages: GalleryImage[] = [
  {
    id: 1,
    src: 'https://puntacanaexcursions.online/wp-content/uploads/2024/09/Saona-island.png',
    alt: 'Playa Isla Saona',
    title: 'Playa de Arena Blanca',
  },
  {
    id: 2,
    src: 'https://puntacanaexcursions.online/wp-content/uploads/2024/09/playa-isla-saona-scaled.jpg',
    alt: 'Piscina Natural',
    title: 'Piscina Natural',
  },
  {
    id: 3,
    src: 'https://puntacanaexcursions.online/wp-content/uploads/2024/09/saona.png',
    alt: 'Estrellas de Mar',
    title: 'Estrellas de Mar',
  },
  {
    id: 4,
    src: 'https://puntacanaexcursions.online/wp-content/uploads/2024/09/saona-island-2-scaled.jpg',
    alt: 'Lancha',
    title: 'Transporte Marítimo',
  },
];

// Single standard tour package
const tourPackage: TourPackage = {
  id: 'classic',
  name: 'Excursión Isla Saona',
  price: 75,
  duration: '8 horas',
  includes: [
    'Transporte desde tu hotel',
    'Paseo en lancha rápida',
    'Almuerzo buffet típico',
    'Parada en piscina natural',
    'Guía local experimentado',
    'Tiempo libre en la playa',
  ],
  maxGuests: 50,
};

// Simple Video Hero
const IslandHero: React.FC<{ onBookClick: () => void }> = ({ onBookClick }) => {
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
      {/* Video Background */}
      <video
        ref={videoRef}
        className='absolute inset-0 w-full h-full object-cover'
        loop
        muted={isMuted}
        playsInline
        poster='https://images.unsplash.com/photo-1665581341138-78fd42914c6a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      >
        <source
          src='https://cdn.coverr.co/videos/coverr-tropical-beach-aerial-view-8662/1080p.mp4'
          type='video/mp4'
        />
      </video>

      {/* Simple Video Controls */}
      <div className='absolute top-4 right-4 flex gap-2'>
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
      </div>

      {/* Natural Overlay */}
      <div className='absolute inset-0 bg-black/30' />

      {/* Hero Content - Natural and Simple */}
      <div className='absolute inset-0 flex items-center justify-center text-center text-white p-4'>
        <div className='w-full max-w-4xl'>
          {/* Simple Location Badge */}
          <div className='inline-flex items-center bg-white/20 px-4 py-2 rounded-full mb-6'>
            <MapPin className='w-4 h-4 mr-2' />
            <span className='font-medium'>Saona Tour</span>
          </div>

          {/* Natural Title - Appropriate Size */}
          <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight'>
            Isla Saona
          </h1>

          {/* Simple Subtitle */}
          <p className='text-lg sm:text-xl md:text-2xl text-white/90 mb-4 font-light'>
            Excursión de Un Día
          </p>

          {/* Natural Description */}
          <p className='text-sm sm:text-base md:text-lg text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed'>
            Disfruta de un día completo en una de las islas más hermosas del
            Caribe. Playa, naturaleza y cultura dominicana en una sola
            excursión.
          </p>

          {/* Simple CTA */}
          <button
            onClick={onBookClick}
            className='bg-cyan-600 hover:bg-cyan-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg flex items-center gap-3 mx-auto transition-all duration-300 shadow-lg'
          >
            <Anchor className='w-5 h-5' />
            Ver Excursión
            <ArrowRight className='w-5 h-5' />
          </button>

          {/* Simple trust indicators */}
          <div className='flex flex-wrap justify-center items-center gap-4 mt-6 text-white/70 text-sm'>
            <div className='flex items-center gap-1'>
              <Star className='w-4 h-4 text-yellow-400 fill-current' />
              <span>4.8/5</span>
            </div>
            <span>•</span>
            <span>Más de 1,000 excursionistas</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple Gallery Component
const SimpleGallery: React.FC = () => {
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
    <section className='w-full  rounded-lg p-4 sm:p-6 '>
      {/* Simple Header */}
      <div className='text-center mb-6'>
        <h2 className='text-2xl sm:text-3xl font-bold text-slate-800 mb-2'>
          Conoce la Isla
        </h2>
        <p className='text-slate-600'>Un vistazo a lo que vas a descubrir</p>
      </div>

      {/* Simple Grid - 3 columns max */}
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

            {/* Simple overlay */}
            <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300' />

            {/* Simple content */}
            <div className='absolute bottom-0 left-0 right-0 p-2 sm:p-3 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300'>
              <h3 className='font-medium text-sm'>{image.title}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Simple Lightbox */}
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
                {galleryImages[selectedImage].title}
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

// Island Features - Natural Focus
const IslandExperience: React.FC = () => {
  const experiences = [
    {
      icon: Waves,
      title: 'Piscina Natural',
      description:
        'Aguas cristalinas de medio metro de profundidad con estrellas de mar',
    },
    {
      icon: Fish,
      title: 'Vida Marina',
      description:
        'Observa peces tropicales y estrellas de mar en su hábitat natural',
    },
    {
      icon: Utensils,
      title: 'Comida Criolla',
      description:
        'Almuerzo buffet con platos típicos dominicanos preparados localmente',
    },
    {
      icon: Palmtree,
      title: 'Playa Virgen',
      description: 'Kilómetros de playa de arena blanca rodeada de palmeras',
    },
  ];

  return (
    <section className='w-full'>
      <div className='text-center mb-8'>
        <h2 className='text-2xl sm:text-3xl font-bold text-slate-800 mb-3'>
          Qué Vas a Vivir
        </h2>
        <p className='text-slate-600'>
          Una excursión auténtica por la naturaleza caribeña
        </p>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6'>
        {experiences.map((exp, index) => {
          const Icon = exp.icon;
          return (
            <div
              key={index}
              className='bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300'
            >
              <div className='w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4'>
                <Icon className='w-6 h-6 text-teal-600' />
              </div>
              <h3 className='text-lg font-semibold text-slate-800 mb-2'>
                {exp.title}
              </h3>
              <p className='text-slate-600 text-sm leading-relaxed'>
                {exp.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

// Practical Information
const TourInformation: React.FC = () => {
  return (
    <section className='w-full bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6'>
      <div className='flex items-start gap-4'>
        <div className='w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0'>
          <AlertCircle className='w-5 h-5 text-blue-600' />
        </div>
        <div className='flex-1'>
          <h3 className='font-semibold text-blue-800 mb-3 text-lg'>
            Información Práctica
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-3 text-blue-700 text-sm'>
            <div className='space-y-2'>
              <p>• Recogida en hoteles: 7:00 AM - 8:30 AM</p>
              <p>• Regreso aproximado: 5:00 PM</p>
              <p>• Incluye almuerzo y bebidas</p>
            </div>
            <div className='space-y-2'>
              <p>• Llevar: protector solar, toalla, cámara</p>
              <p>• Ropa cómoda y traje de baño</p>
              <p>• Actividad apta para toda la familia</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Special Banner Section
const SpecialBanner = ({ onBookClick }) => {
  return (
    <section className='relative py-32 overflow-hidden'>
      {/* Background Image with Parallax Effect */}
      <div className='absolute inset-0'>
        <img
          src='https://puntacanaexcursions.online/wp-content/uploads/2024/09/saona-sky-scaled.jpg'
          alt='Horseback riding experience'
          className='w-full h-full object-cover'
        />
        <div className='absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent' />
      </div>

      {/* Content */}
      <div className='relative z-10 max-w-6xl mx-auto px-4'>
        <div className='max-w-2xl'>
          <div className='inline-flex items-center gap-2 bg-cyan-500/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-amber-400/30'>
            <Sparkles className='w-4 h-4 text-cyan-400' />
            <span className='text-cyan-200 text-sm font-medium'>
              Limited Time Offer
            </span>
          </div>

          <h2 className='text-4xl md:text-5xl font-bold text-white mb-6'>
            Create Memories That
            <span className='block text-cyan-400'>Last a Lifetime</span>
          </h2>

          <p className='text-lg text-white/90 mb-8'>
            Join over 800+ happy riders who've experienced the magic of Macao
            Beach on horseback. Our gentle horses and expert guides ensure a
            safe, unforgettable adventure for riders of all levels.
          </p>

          <div className='flex flex-wrap gap-6 mb-8'>
            <div className='flex items-center gap-2 text-white'>
              <Heart className='w-5 h-5 text-red-400' />
              <span>Family Friendly</span>
            </div>
            <div className='flex items-center gap-2 text-white'>
              <Shield className='w-5 h-5 text-green-400' />
              <span>100% Safe</span>
            </div>
            <div className='flex items-center gap-2 text-white'>
              <Star className='w-5 h-5 text-amber-400' />
              <span>Top Rated</span>
            </div>
          </div>

          <button
            onClick={onBookClick}
            className='bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all transform hover:scale-105 shadow-2xl'
          >
            Book Now
          </button>
        </div>
      </div>
    </section>
  );
};

// Decoration Banners Section
const BannersSection: React.FC<{
  onBookClick: () => void;
}> = ({ onBookClick }) => {
  // Animation variants
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
      id: 'romantic',
      title: 'Romantic Moments',
      subtitle: 'Candlelit elegance for intimate celebrations',
      image:
        'https://puntacanaexcursions.online/wp-content/uploads/2024/09/saaoaaa.jpeg',
      color: 'from-rose-300/60 to-pink-400/60',
    },
    {
      id: 'birthday',
      title: 'Birthday Magic',
      subtitle: 'Vibrant celebrations that create lasting memories',
      image:
        'https://puntacanaexcursions.online/wp-content/uploads/2024/09/Saona-island-scaled.jpg',
      color: 'from-indigo-300/60 to-purple-400/60',
    },
    {
      id: 'poolside',
      title: 'Poolside Paradise',
      subtitle: 'Transform your pool area into a celebration oasis',
      image:
        'https://puntacanaexcursions.online/wp-content/uploads/2024/09/Saona-island-puj.png',
      color: 'from-teal-300/60 to-cyan-400/60',
    },
  ] as const;

  // Individual Banner Card
  const BannerCard: React.FC<{
    banner: (typeof DECORATION_BANNERS)[0];
    reverse: boolean;
    onBookClick: () => void;
  }> = ({ banner, reverse, onBookClick }) => (
    <motion.div
      // variants={fadeInUp}
      className={`grid lg:grid-cols-2 gap-12 items-center ${
        reverse ? 'lg:grid-flow-col-dense' : ''
      }`}
    >
      {/* Image */}
      <div
        className={`relative h-96 rounded-2xl overflow-hidden ${
          reverse ? 'lg:col-start-2' : ''
        }`}
      >
        <img
          src={banner.image}
          alt={banner.title}
          className='w-full h-full object-cover'
        />
        {/* <div
          className={`absolute inset-0 bg-gradient-to-r ${banner.color}`}
        ></div> */}
      </div>

      {/* Content */}
      <div
        className={`space-y-6 ${reverse ? 'lg:col-start-1 lg:text-right' : ''}`}
      >
        <h2 className='text-4xl md:text-5xl font-light text-stone-800'>
          {banner.title}
        </h2>
        <p className='text-xl text-stone-600 leading-relaxed'>
          {banner.subtitle}
        </p>
      </div>
    </motion.div>
  );

  return (
    <motion.section
      className='py-20 px-6'
      initial='hidden'
      whileInView='visible'
      viewport={{ once: true }}
      variants={staggerChildren}
    >
      <div className='max-w-7xl mx-auto space-y-16'>
        {DECORATION_BANNERS.map((banner, index) => (
          <BannerCard
            key={banner.id}
            banner={banner}
            reverse={index % 2 === 1}
            onBookClick={onBookClick}
          />
        ))}
      </div>
    </motion.section>
  );
};

// Main Component - Natural Island Excursion
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
      {/* Island Hero Section */}
      <IslandHero onBookClick={handleBookNow} />

      {/* Main content - Full width responsive */}
      <div className='w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 sm:space-y-12  mx-auto'>
        {/* Compact Gallery */}
        <SimpleGallery />
        {/* Island Experience */}
        <IslandExperience />
        <BannersSection onBookClick={handleBookNow} />
        <SpecialBanner onBookClick={handleBookNow} />

        {/* Practical Information */}
        <TourInformation />
      </div>

      {/* Booking Modal */}
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
