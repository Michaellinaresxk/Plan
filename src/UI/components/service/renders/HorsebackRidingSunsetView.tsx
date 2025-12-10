import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useReservation } from '@/context/BookingContext';
import { Service } from '@/types/type';
import {
  X,
  ArrowRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Calendar,
  ChevronDown,
  Star,
  Check,
  Phone,
  Clock,
  Users,
  Camera,
  Award,
  Shield,
  Heart,
  Sparkles,
  TrendingUp,
  Zap,
  User,
  Baby,
  AlertTriangle,
  CreditCard,
} from 'lucide-react';
import { useScrollToError } from '@/hooks/useScrollToError';

// ==================== TYPES ====================
interface MediaItem {
  id: number;
  type: 'image' | 'video';
  src: string;
  thumbnail?: string;
  title: string;
}

interface FormData {
  date: string;
  adults: number;
  children: number;
  infants: number;
}

interface FormErrors {
  [key: string]: string;
}

interface HorsebackRidingSunsetViewProps {
  service: Service;
}

// ==================== CONSTANTS ====================
const GALLERY_VIDEOS: MediaItem[] = [
  {
    id: 1,
    type: 'video',
    src: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnail:
      'https://res.cloudinary.com/ddg92xar5/image/upload/v1755946814/Imagen_de_WhatsApp_2024-06-03_a_las_15.47.17_f9b60a74_l7xtfu.jpg',
    title: 'The Golden Moment',
  },
  {
    id: 2,
    type: 'video',
    src: 'https://www.w3schools.com/html/movie.mp4',
    thumbnail:
      'https://res.cloudinary.com/ddg92xar5/image/upload/v1755946813/Imagen_de_WhatsApp_2024-06-03_a_las_15.47.17_45e97ed7_uoutrp.jpg',
    title: 'Beach Paradise',
  },
  {
    id: 3,
    type: 'video',
    src: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnail:
      'https://puntacanaexcursions.online/wp-content/uploads/2024/08/image00011-1536x1017.jpeg',
    title: 'Sunset Journey',
  },
];

const GALLERY_IMAGES: MediaItem[] = [
  {
    id: 4,
    type: 'image',
    src: 'https://res.cloudinary.com/ddg92xar5/image/upload/v1755946811/image00043_s1jla3.jpg',
    title: 'Golden Hour',
  },
  {
    id: 5,
    type: 'image',
    src: 'https://res.cloudinary.com/ddg92xar5/image/upload/v1755946864/image00002_krjl52.jpg',
    title: 'Beach Sunset',
  },
  {
    id: 6,
    type: 'image',
    src: 'https://puntacanaexcursions.online/wp-content/uploads/2024/07/image00014-scaled.jpeg',
    title: 'Paradise View',
  },
];

const ADULT_PRICE = 95; // Adultos
const CHILD_PRICE = 95 * 0.5; // 5-10 años: 50%
const INFANT_PRICE = 0; // Menores de 5 años: gratis

const PROCESSING_FEE_RATE = 5; // 5%
const FIXED_PICKUP_TIME = '16:00'; // 4 PM
const FIXED_START_TIME = '17:00'; // 5 PM
const EXPERIENCE_DURATION_HOURS = 3;

// ==================== HOOKS ====================
const useScrollReveal = () => {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return scrollY;
};

const useIntersectionObserver = (options = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1, ...options }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return { elementRef, isVisible };
};

// ==================== COMPONENTS ====================
const ParticipantCounter: React.FC<{
  label: string;
  sublabel: string;
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  icon: React.ElementType;
  min?: number;
}> = ({
  label,
  sublabel,
  value,
  onIncrement,
  onDecrement,
  icon: Icon,
  min = 0,
}) => (
  <div className='flex items-center justify-between py-4 border-b border-white/5 last:border-0'>
    <div className='flex items-center gap-3'>
      <div className='w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0'>
        <Icon className='w-5 h-5 text-amber-300' />
      </div>
      <div>
        <div className='text-sm font-medium text-white'>{label}</div>
        <div className='text-xs text-white/40'>{sublabel}</div>
      </div>
    </div>
    <div className='flex items-center gap-3'>
      <button
        type='button'
        onClick={onDecrement}
        disabled={value <= min}
        className='w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white flex items-center justify-center transition disabled:opacity-30 disabled:cursor-not-allowed'
      >
        <span className='text-lg font-light'>−</span>
      </button>
      <div className='w-10 text-center text-base font-medium text-white'>
        {value}
      </div>
      <button
        type='button'
        onClick={onIncrement}
        className='w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white flex items-center justify-center transition'
      >
        <span className='text-lg font-light'>+</span>
      </button>
    </div>
  </div>
);

const VideoPlayer: React.FC<{
  src: string;
  thumbnail: string;
  onClose: () => void;
}> = ({ src, thumbnail, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  const togglePlay = () => {
    if (videoRef.current) {
      isPlaying ? videoRef.current.pause() : videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className='fixed inset-0 bg-black/98 z-50 flex items-center justify-center p-4 md:p-8 backdrop-blur-2xl animate-fadeIn'>
      <button
        onClick={onClose}
        className='absolute top-4 right-4 md:top-8 md:right-8 group'
      >
        <div className='relative w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center transition-all duration-500 group-hover:bg-white/10 group-hover:scale-110'>
          <X className='w-5 h-5 md:w-6 md:h-6 text-white/80 group-hover:text-white transition-colors' />
        </div>
      </button>

      <div className='relative w-full max-w-7xl'>
        <video
          ref={videoRef}
          src={src}
          poster={thumbnail}
          className='w-full rounded-3xl shadow-2xl'
          onTimeUpdate={() => {
            if (videoRef.current) {
              setProgress(
                (videoRef.current.currentTime / videoRef.current.duration) * 100
              );
            }
          }}
          onClick={togglePlay}
        />

        <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 md:p-10 rounded-b-3xl'>
          <div className='flex items-center gap-4 md:gap-6'>
            <button onClick={togglePlay} className='group/play relative'>
              <div className='w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center transition-all duration-500 group-hover/play:bg-white/20 group-hover/play:scale-110'>
                {isPlaying ? (
                  <Pause className='w-5 h-5 md:w-6 md:h-6 text-white' />
                ) : (
                  <Play className='w-5 h-5 md:w-6 md:h-6 text-white ml-1' />
                )}
              </div>
            </button>

            <div className='flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden backdrop-blur-xl'>
              <div
                className='h-full bg-gradient-to-r from-amber-200 via-orange-300 to-amber-200 transition-all duration-300 shadow-lg shadow-amber-500/50'
                style={{ width: `${progress}%` }}
              />
            </div>

            <button
              onClick={() => {
                if (videoRef.current) {
                  videoRef.current.muted = !isMuted;
                  setIsMuted(!isMuted);
                }
              }}
              className='text-white/70 hover:text-white transition-all duration-300 hover:scale-110'
            >
              {isMuted ? (
                <VolumeX className='w-5 h-5 md:w-6 md:h-6' />
              ) : (
                <Volume2 className='w-5 h-5 md:w-6 md:h-6' />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const HeroSection: React.FC<{ onBookClick: () => void }> = ({
  onBookClick,
}) => {
  const scrollY = useScrollReveal();
  const parallax = scrollY * 0.7;

  const handleContactClick = () => {
    window.location.href =
      'mailto:info@luxpuntacana.com?subject=Horseback Riding Inquiry&body=Hello, I would like to know more about the sunset horseback riding experience.';
  };

  return (
    <div className='relative h-screen min-h-[900px] overflow-hidden'>
      <div
        className='absolute inset-0'
        style={{ transform: `translateY(${parallax}px)` }}
      >
        <img
          src='https://res.cloudinary.com/ddg92xar5/image/upload/v1755946814/Imagen_de_WhatsApp_2024-06-03_a_las_15.47.17_f9b60a74_l7xtfu.jpg'
          alt='Sunset'
          className='w-full h-full object-cover scale-110'
        />
        <div className='absolute inset-0 bg-gradient-to-b from-zinc-950/40 via-zinc-950/20 to-zinc-950/90' />
        <div className='absolute inset-0 bg-gradient-to-r from-zinc-950/60 via-transparent to-transparent' />
      </div>

      <div className='relative z-10 h-full flex items-end pb-24 md:pb-32'>
        <div className='max-w-7xl mx-auto px-4 md:px-8 w-full'>
          <div className='max-w-4xl space-y-8 md:space-y-10'>
            <div className='inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 backdrop-blur-2xl border border-white/10'>
              <div className='w-2 h-2 rounded-full bg-amber-300 animate-pulse' />
              <span className='text-white/90 text-xs md:text-sm tracking-widest uppercase font-light'>
                Exclusive Sunset Experience
              </span>
            </div>

            <h1 className='text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-extralight text-white tracking-tighter leading-none'>
              Golden
              <span className='block text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-orange-300 to-amber-200 mt-2 md:mt-4'>
                Hour
              </span>
            </h1>

            <p className='text-lg md:text-2xl lg:text-3xl text-white/60 font-light max-w-2xl leading-relaxed'>
              Where paradise meets perfection, captured in nature's most
              spectacular light
            </p>

            <div className='flex flex-col sm:flex-row gap-4 md:gap-6 pt-4'>
              <button
                onClick={onBookClick}
                className='group relative overflow-hidden px-10 md:px-14 py-4 md:py-5 rounded-full bg-gradient-to-r from-amber-200 via-orange-300 to-amber-200 text-zinc-950 font-medium text-base md:text-lg transition-all duration-500 hover:shadow-2xl hover:shadow-amber-500/50 hover:scale-105 flex items-center justify-center gap-3'
              >
                <span className='relative z-10'>Experience Golden Hour</span>
                <ArrowRight className='w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform' />
                <div className='absolute inset-0 bg-gradient-to-r from-orange-300 via-amber-200 to-orange-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
              </button>
            </div>

            <div className='grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 pt-6 md:pt-8'>
              {[
                { label: '3.5 Hours', icon: Clock },
                { label: 'Small Groups', icon: Users },
                { label: 'All Inclusive', icon: Check },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className='flex items-center gap-3'>
                    <Icon className='w-4 h-4 md:w-5 md:h-5 text-amber-300' />
                    <span className='text-xs md:text-sm text-white/50 font-light'>
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className='absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce'>
        <ChevronDown className='w-8 h-8 text-white/30' />
      </div>
    </div>
  );
};

const StatsSection: React.FC = () => {
  const { elementRef, isVisible } = useIntersectionObserver();

  const stats = [
    { number: '500+', label: 'Happy Guests', icon: Heart },
    { number: '5.0', label: 'Perfect Rating', icon: Star },
    { number: '100%', label: 'Satisfaction', icon: Award },
    { number: '25+', label: 'Group Size', icon: Users },
  ];

  return (
    <section
      ref={elementRef}
      className='py-20 md:py-32 bg-zinc-950 border-y border-white/5 relative overflow-hidden'
    >
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,191,36,0.02),transparent_50%)]' />
      <div className='max-w-7xl mx-auto px-4 md:px-8 relative z-10'>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12'>
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className={`text-center transition-all duration-1000 ${
                  isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <Icon className='w-8 h-8 md:w-10 md:h-10 text-amber-300 mx-auto mb-4' />
                <div className='text-4xl md:text-6xl font-light text-white mb-2'>
                  {stat.number}
                </div>
                <div className='text-sm md:text-base text-white/40 font-light'>
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const VideoGallery: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<MediaItem | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { elementRef, isVisible } = useIntersectionObserver();

  return (
    <section
      ref={elementRef}
      className='py-24 md:py-40 bg-zinc-950 relative overflow-hidden'
    >
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,191,36,0.03),transparent_50%)]' />

      <div className='max-w-7xl mx-auto px-4 md:px-8 relative z-10'>
        <div className='text-center mb-16 md:mb-24'>
          <div
            className={`transition-all duration-1000 ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-20'
            }`}
          >
            <h2 className='text-4xl md:text-7xl font-extralight text-white mb-6 tracking-tighter'>
              Experience
            </h2>
            <p className='text-base md:text-xl text-white/40 font-light'>
              Immerse yourself in the golden hour magic
            </p>
          </div>
        </div>

        <div className='md:hidden mb-12'>
          <div
            ref={scrollContainerRef}
            className='flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 pl-4'
            style={{ scrollBehavior: 'smooth' }}
          >
            {GALLERY_VIDEOS.map((video, i) => (
              <div
                key={video.id}
                className='flex-shrink-0 w-[200px] snap-start'
              >
                <div
                  className='relative aspect-[9/16] rounded-2xl overflow-hidden cursor-pointer group shadow-lg'
                  onClick={() => setSelectedVideo(video)}
                >
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className='w-full h-full object-cover'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/20 to-transparent' />
                  <div className='absolute inset-0 flex flex-col items-center justify-center'>
                    <div className='w-14 h-14 rounded-full bg-white/10 backdrop-blur-2xl border border-white/20 flex items-center justify-center group-active:scale-95 transition-transform'>
                      <Play className='w-5 h-5 text-white ml-0.5' />
                    </div>
                  </div>
                  <div className='absolute bottom-0 left-0 right-0 p-3'>
                    <h3 className='text-sm font-light text-white'>
                      {video.title}
                    </h3>
                  </div>
                  {i === 0 && (
                    <div className='absolute top-3 right-3 bg-amber-300/20 backdrop-blur-md px-2.5 py-1 rounded-full animate-pulse'>
                      <span className='text-xs text-amber-200 font-light'>
                        Scroll →
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div className='flex-shrink-0 w-20 flex items-center justify-center'>
              <div className='w-1 h-20 bg-white/10 rounded-full' />
            </div>
          </div>

          <div className='flex justify-center gap-2 mt-4'>
            {GALLERY_VIDEOS.map((_, i) => (
              <div key={i} className='w-1.5 h-1.5 rounded-full bg-white/30' />
            ))}
          </div>
        </div>

        <div className='hidden md:grid md:grid-cols-3 gap-6 md:gap-8 mb-12'>
          {GALLERY_VIDEOS.map((video, i) => (
            <div
              key={video.id}
              className={`group relative aspect-[9/16] rounded-3xl overflow-hidden cursor-pointer transition-all duration-700 hover:scale-105 ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-20'
              }`}
              style={{ transitionDelay: `${i * 200}ms` }}
              onClick={() => setSelectedVideo(video)}
            >
              <img
                src={video.thumbnail}
                alt={video.title}
                className='w-full h-full object-cover'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/20 to-transparent' />
              <div className='absolute inset-0 bg-gradient-to-t from-amber-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700' />

              <div className='absolute inset-0 flex flex-col items-center justify-center'>
                <div className='w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/10 backdrop-blur-2xl border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110'>
                  <Play className='w-8 h-8 md:w-10 md:h-10 text-white ml-1' />
                </div>
              </div>

              <div className='absolute bottom-0 left-0 right-0 p-6 md:p-8 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500'>
                <h3 className='text-xl md:text-2xl font-light text-white'>
                  {video.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        <div className='grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8'>
          {GALLERY_IMAGES.map((image, i) => (
            <div
              key={image.id}
              className={`group relative aspect-[4/3] rounded-2xl md:rounded-3xl overflow-hidden transition-all duration-700 hover:scale-105 ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-20'
              }`}
              style={{ transitionDelay: `${(i + 3) * 200}ms` }}
            >
              <img
                src={image.src}
                alt={image.title}
                className='w-full h-full object-cover'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-zinc-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700' />
              <div className='absolute bottom-0 left-0 right-0 p-4 md:p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500'>
                <h3 className='text-base md:text-xl font-light text-white'>
                  {image.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedVideo && (
        <VideoPlayer
          src={selectedVideo.src}
          thumbnail={selectedVideo.thumbnail!}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </section>
  );
};

const ExperienceSection: React.FC = () => {
  const { elementRef, isVisible } = useIntersectionObserver();

  const experiences = [
    {
      number: '01',
      title: 'Arrival',
      desc: 'VIP welcome with tropical refreshments',
    },
    {
      number: '02',
      title: 'Journey',
      desc: 'Guided ride through pristine trails',
    },
    {
      number: '03',
      title: 'Golden Hour',
      desc: "Witness nature's masterpiece unfold",
    },
    {
      number: '04',
      title: 'Serenity',
      desc: 'Pause at the shore as waves meet hooves',
    },
    {
      number: '05',
      title: 'Reflection',
      desc: 'Treasured moments under painted skies',
    },
  ];

  return (
    <section
      ref={elementRef}
      className='py-20 md:py-32 relative overflow-hidden'
    >
      {/* Background Image */}
      <div
        className='absolute inset-0 bg-cover bg-center'
        style={{
          backgroundImage:
            'url(https://images.pexels.com/photos/269583/pexels-photo-269583.jpeg?auto=compress&cs=tinysrgb&w=1920)',
        }}
      />

      {/* Dark Overlay para contraste con títulos blancos */}
      <div className='absolute inset-0 bg-zinc-900/75' />

      {/* Radial Gradient Effect */}
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(251,191,36,0.15),transparent_50%)]' />

      <div className='max-w-7xl mx-auto px-4 md:px-8 relative z-10'>
        <div className='text-center mb-12 md:mb-20'>
          <div
            className={`transition-all duration-1000 ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-20'
            }`}
          >
            <h2 className='text-4xl md:text-6xl lg:text-7xl font-extralight text-white mb-4 tracking-tighter'>
              The Journey
            </h2>
            <p className='text-base md:text-lg text-white/70 font-light'>
              Every moment thoughtfully orchestrated
            </p>
          </div>
        </div>

        {/* Mobile Grid */}
        <div className='grid grid-cols-2 gap-3 lg:hidden'>
          {experiences.map((exp, i) => (
            <div
              key={i}
              className={`bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-xl transition-all duration-700 ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className='text-4xl font-extralight text-transparent bg-clip-text bg-gradient-to-b from-amber-300 to-orange-400 mb-2'>
                {exp.number}
              </div>
              <h3 className='text-base font-light text-white mb-1 leading-tight'>
                {exp.title}
              </h3>
              <p className='text-xs text-white/70 font-light leading-relaxed'>
                {exp.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Desktop Grid */}
        <div className='hidden lg:grid lg:grid-cols-5 gap-6'>
          {experiences.map((exp, i) => (
            <div
              key={i}
              className={`bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-xl transition-all duration-1000 hover:scale-105 hover:bg-white/15 hover:shadow-2xl hover:shadow-amber-500/30 ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-20'
              }`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              <div className='text-6xl font-extralight text-transparent bg-clip-text bg-gradient-to-b from-amber-300 to-orange-400 mb-4'>
                {exp.number}
              </div>
              <h3 className='text-xl font-light text-white mb-3 tracking-tight leading-tight'>
                {exp.title}
              </h3>
              <p className='text-sm text-white/70 font-light leading-relaxed'>
                {exp.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const UrgencySection: React.FC<{ onBookClick: () => void }> = ({
  onBookClick,
}) => {
  const { elementRef, isVisible } = useIntersectionObserver();

  const handleContactClick = () => {
    window.location.href =
      'mailto:info@luxpuntacana.com?subject=Horseback Riding Inquiry&body=Hello, I would like to know more about the sunset horseback riding experience.';
  };

  return (
    <section
      ref={elementRef}
      className='py-16 md:py-24 bg-zinc-950 border-y border-amber-500/20 relative overflow-hidden'
    >
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,191,36,0.05),transparent_50%)]' />
      <div className='max-w-5xl mx-auto px-4 md:px-8 text-center relative z-10'>
        <div
          className={`transition-all duration-1000 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          <div className='inline-flex items-center gap-2 px-5 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6'>
            <Zap className='w-4 h-4 text-amber-400 animate-pulse' />
            <span className='text-amber-300 text-sm font-light tracking-wider uppercase'>
              Personal Support
            </span>
          </div>

          <h3 className='text-3xl md:text-5xl font-light text-white mb-4'>
            Need Booking Assistance?
          </h3>
          <p className='text-white/60 font-light mb-8 text-base md:text-lg'>
            Email us directly—we'll contact you and help plan your perfect
            sunset ride.
          </p>

          <button
            onClick={handleContactClick}
            className='group relative overflow-hidden px-12 py-4 rounded-full bg-gradient-to-r from-amber-200 via-orange-300 to-amber-200 text-zinc-950 font-medium transition-all duration-500 hover:shadow-2xl hover:shadow-amber-500/50 hover:scale-105 inline-flex items-center gap-3'
          >
            <TrendingUp className='w-5 h-5 relative z-10' />
            <span className='relative z-10'>Get Assistance</span>
          </button>
        </div>
      </div>
    </section>
  );
};

const FinalCTA: React.FC<{ onBookClick: () => void }> = ({ onBookClick }) => {
  const { elementRef, isVisible } = useIntersectionObserver();

  return (
    <section
      ref={elementRef}
      className='relative py-32 md:py-56 overflow-hidden'
    >
      <div className='absolute inset-0'>
        <img
          src='https://puntacanaexcursions.online/wp-content/uploads/2024/07/image00014-scaled.jpeg'
          alt='Final'
          className='w-full h-full object-cover'
        />
        <div className='absolute inset-0 bg-gradient-to-b from-zinc-950/80 via-zinc-950/60 to-zinc-950/90' />
      </div>

      <div className='relative z-10 max-w-5xl mx-auto px-4 md:px-8 text-center'>
        <div
          className={`transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
          }`}
        >
          <h2 className='text-5xl md:text-8xl lg:text-9xl font-extralight text-white mb-8 md:mb-12 tracking-tighter leading-none'>
            Your Moment
            <span className='block text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-orange-300 to-amber-200 mt-4'>
              Awaits
            </span>
          </h2>

          <p className='text-lg md:text-2xl lg:text-3xl text-white/60 font-light mb-12 md:mb-16 max-w-3xl mx-auto leading-relaxed'>
            Limited availability. Reserve your exclusive golden hour experience
            today.
          </p>

          <button
            onClick={onBookClick}
            className='group relative overflow-hidden px-12 md:px-20 py-5 md:py-7 rounded-full bg-gradient-to-r from-amber-200 via-orange-300 to-amber-200 text-zinc-950 font-medium text-base md:text-xl transition-all duration-500 hover:shadow-2xl hover:shadow-amber-500/50 hover:scale-105 inline-flex items-center gap-4'
          >
            <Calendar className='w-5 h-5 md:w-6 md:h-6 relative z-10' />
            <span className='relative z-10'>Reserve Now</span>
            <ArrowRight className='w-5 h-5 md:w-6 md:h-6 relative z-10 group-hover:translate-x-1 transition-transform' />
            <div className='absolute inset-0 bg-gradient-to-r from-orange-300 via-amber-200 to-orange-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
          </button>

          <div className='flex flex-wrap justify-center gap-6 md:gap-12 mt-10 md:mt-16 text-sm md:text-base text-white/40 font-light'>
            <div className='flex items-center gap-2'>
              <Check className='w-4 h-4 md:w-5 md:h-5 text-amber-300' />
              Instant Confirmation
            </div>
            <div className='flex items-center gap-2'>
              <Check className='w-4 h-4 md:w-5 md:h-5 text-amber-300' />
              Free Cancellation
            </div>
            <div className='flex items-center gap-2'>
              <Check className='w-4 h-4 md:w-5 md:h-5 text-amber-300' />
              Private Available
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ==================== BOOKING MODAL ====================
const BookingModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  service: Service;
}> = ({ isOpen, onClose, service }) => {
  const router = useRouter();
  const { setReservationData } = useReservation();

  const [formData, setFormData] = useState<FormData>({
    date: '',
    adults: 1,
    children: 0,
    infants: 0,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate pricing
  const totalParticipants =
    formData.adults + formData.children + formData.infants;
  const basePrice =
    formData.adults * ADULT_PRICE +
    formData.children * CHILD_PRICE +
    formData.infants * INFANT_PRICE;
  const subtotal = basePrice;
  const processingFee = (subtotal * PROCESSING_FEE_RATE) / 100;
  const total = subtotal + processingFee;

  const { fieldRefs, scrollToFirstError } = useScrollToError(errors);

  const updateField = useCallback((field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (prev[field]) {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      }
      return prev;
    });
  }, []);

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (totalParticipants === 0) {
      newErrors.participants = 'At least one participant is required';
    }

    return newErrors;
  };

  const handleSubmit = async () => {
    // Validate form
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      console.log('❌ Validation errors:', validationErrors);
      setErrors(validationErrors);
      scrollToFirstError(); // Ahora funciona porque el hook está declarado arriba
      return; // Detener ejecución si hay errores
    }

    setIsSubmitting(true);

    try {
      // Parse selected date
      const selectedDate = new Date(formData.date);
      const bookingStartDate = new Date(selectedDate);
      const bookingEndDate = new Date(selectedDate);

      // Set fixed times (17:00 start, 20:00 end = 3 hours)
      const [startHour] = FIXED_START_TIME.split(':').map(Number);
      bookingStartDate.setHours(startHour, 0, 0, 0);
      bookingEndDate.setHours(startHour + EXPERIENCE_DURATION_HOURS, 0, 0, 0);

      // Build reservation data matching HorseBackRidingForm structure
      const reservationData = {
        service: service,
        formData: {
          date: formData.date,
          participantCount: totalParticipants,
          adults: formData.adults,
          children: formData.children,
          infants: formData.infants,
          timeSlot: FIXED_START_TIME,
          pickupTime: FIXED_PICKUP_TIME,
          serviceType: 'horseback-sunset',
          totalPrice: total,
          basePrice: basePrice,
          subtotal: subtotal,
          tax: processingFee,
          taxRate: PROCESSING_FEE_RATE,
        },
        totalPrice: total,
        bookingDate: bookingStartDate,
        endDate: bookingEndDate,
        participants: {
          adults: formData.adults,
          children: formData.children,
          infants: formData.infants,
          total: totalParticipants,
        },
        selectedItems: [
          {
            id: 'horseback-sunset',
            name: 'Sunset Horseback Riding Experience',
            quantity: 1,
            price: total,
            totalPrice: total,
            timeSlot: FIXED_START_TIME,
            pickupTime: FIXED_PICKUP_TIME,
          },
        ],
        clientInfo: undefined,
        horsebackSpecifics: {
          timeSlot: FIXED_START_TIME,
          pickupTime: FIXED_PICKUP_TIME,
          participantCount: totalParticipants,
          adults: formData.adults,
          children: formData.children,
          infants: formData.infants,
          pricing: {
            basePrice: basePrice,
            subtotal: subtotal,
            tax: processingFee,
            taxRate: PROCESSING_FEE_RATE,
            totalPrice: total,
          },
        },
      };

      console.log('🐎 Sunset Reservation data created:', reservationData);

      // Set reservation in context
      setReservationData(reservationData);

      // Navigate to confirmation page
      await router.push('/reservation-confirmation');
    } catch (error) {
      console.error('❌ Error submitting form:', error);
      setErrors({
        submit:
          error instanceof Error
            ? error.message
            : 'Failed to submit booking. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black/98 z-50 flex items-center justify-center p-4 backdrop-blur-2xl animate-fadeIn overflow-y-auto'>
      <div className='bg-zinc-900 rounded-3xl max-w-2xl w-full border border-white/10 my-8'>
        {/* Header */}
        <div className='bg-gradient-to-r from-amber-500 to-orange-500 px-6 md:px-8 py-6 rounded-t-3xl'>
          <div className='flex justify-between items-start'>
            <div>
              <h3 className='text-2xl md:text-3xl font-light text-white mb-2 tracking-tight'>
                Book Your Experience
              </h3>
              <p className='text-amber-50 text-sm font-light'>
                Sunset Horseback Riding - From ${ADULT_PRICE}/person
              </p>
              <p className='text-amber-100 text-xs font-light mt-1'>
                📍 Pickup: 4:00 PM | Experience: 5:00 PM
              </p>
            </div>
            <button
              onClick={onClose}
              className='text-white/80 hover:text-white transition-colors'
            >
              <X className='w-6 h-6' />
            </button>
          </div>
        </div>

        <div className='p-6 md:p-8 space-y-6'>
          {/* Date Selection */}
          <div>
            <label className='flex items-center text-sm font-medium text-white/70 mb-2'>
              <Calendar className='w-4 h-4 mr-2 text-amber-400' />
              Select Date *
            </label>
            <input
              type='date'
              value={formData.date}
              onChange={(e) => updateField('date', e.target.value)}
              onClick={(e) => e.currentTarget.showPicker()}
              min={new Date().toISOString().split('T')[0]}
              className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${
                errors.date ? 'border-red-500' : 'border-white/10'
              } text-white focus:outline-none focus:border-amber-300/50 transition-colors`}
            />
            {errors.date && (
              <p className='text-red-400 text-xs mt-2 flex items-center gap-1'>
                <AlertTriangle className='w-3 h-3' />
                {errors.date}
              </p>
            )}
          </div>

          {/* Fixed Pickup Time Info */}
          <div className='border border-amber-500/20 rounded-xl p-4 bg-amber-500/5'>
            <div className='flex items-start gap-3'>
              <Clock className='w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5' />
              <div>
                <div className='text-sm font-medium text-white mb-1'>
                  Pickup Time: 4:00 PM
                </div>
                <div className='text-xs text-white/60'>
                  Experience starts at 5:00 PM for the perfect sunset
                </div>
              </div>
            </div>
          </div>

          {/* Participants */}
          <div>
            <label className='flex items-center text-sm font-medium text-white/70 mb-3'>
              <Users className='w-4 h-4 mr-2 text-amber-400' />
              Participants *
            </label>
            <div className='border border-white/10 rounded-xl p-4 bg-white/5'>
              <ParticipantCounter
                label='Adult'
                sublabel='Above 11 years'
                value={formData.adults}
                onIncrement={() => updateField('adults', formData.adults + 1)}
                onDecrement={() =>
                  formData.adults > 1 &&
                  updateField('adults', formData.adults - 1)
                }
                icon={User}
                min={1}
              />
              <ParticipantCounter
                label='Child'
                sublabel='5 - 10 years (50% off)'
                value={formData.children}
                onIncrement={() =>
                  updateField('children', formData.children + 1)
                }
                onDecrement={() =>
                  formData.children > 0 &&
                  updateField('children', formData.children - 1)
                }
                icon={Users}
              />
              <ParticipantCounter
                label='Infant'
                sublabel='Under 5 years (Free)'
                value={formData.infants}
                onIncrement={() => updateField('infants', formData.infants + 1)}
                onDecrement={() =>
                  formData.infants > 0 &&
                  updateField('infants', formData.infants - 1)
                }
                icon={Baby}
              />
            </div>
            {errors.participants && (
              <p className='text-red-400 text-xs mt-2 flex items-center gap-1'>
                <AlertTriangle className='w-3 h-3' />
                {errors.participants}
              </p>
            )}
          </div>

          {/* Price Summary */}
          <div className='space-y-1'>
            {formData.adults > 0 && (
              <div className='flex justify-between text-sm text-white/60'>
                <span>
                  {formData.adults} Adult{formData.adults > 1 ? 's' : ''} × $
                  {ADULT_PRICE}
                </span>
                <span className='font-medium text-white'>
                  ${(formData.adults * ADULT_PRICE).toFixed(2)}
                </span>
              </div>
            )}
            {formData.children > 0 && (
              <div className='flex justify-between text-sm text-white/60'>
                <span>
                  {formData.children} Child{formData.children > 1 ? 'ren' : ''}{' '}
                  (5-10y) × ${CHILD_PRICE.toFixed(2)}
                </span>
                <span className='font-medium text-white'>
                  ${(formData.children * CHILD_PRICE).toFixed(2)}
                </span>
              </div>
            )}
            {formData.infants > 0 && (
              <div className='flex justify-between text-sm text-green-400'>
                <span>
                  {formData.infants} Infant{formData.infants > 1 ? 's' : ''}{' '}
                  (&lt;5y) × Free
                </span>
                <span className='font-medium'>$0.00</span>
              </div>
            )}
          </div>

          {errors.submit && (
            <div className='p-3 bg-red-500/10 border border-red-500/20 rounded-xl'>
              <p className='text-red-400 text-sm flex items-center gap-2'>
                <AlertTriangle className='w-4 h-4' />
                {errors.submit}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className='flex flex-col sm:flex-row gap-3 pt-4'>
            <button
              type='button'
              onClick={onClose}
              disabled={isSubmitting}
              className='flex-1 px-6 py-3 border border-white/20 rounded-xl text-white/70 hover:text-white hover:border-white/30 transition font-medium disabled:opacity-50'
            >
              Cancel
            </button>
            <button
              type='button'
              onClick={handleSubmit}
              disabled={isSubmitting}
              className='flex-1 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50 font-medium shadow-lg hover:shadow-xl'
            >
              <CreditCard className='w-4 h-4' />
              {isSubmitting ? 'Processing...' : 'Confirm Booking'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== MAIN COMPONENT ====================
const HorsebackRidingSunsetView: React.FC<HorsebackRidingSunsetViewProps> = ({
  service,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBookNow = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return (
    <div className='min-h-screen bg-zinc-950 antialiased'>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <HeroSection onBookClick={handleBookNow} />
      <StatsSection />
      <VideoGallery />
      <ExperienceSection />
      <UrgencySection onBookClick={handleBookNow} />
      <FinalCTA onBookClick={handleBookNow} />

      {/* Floating Button */}
      <button
        onClick={handleBookNow}
        className='fixed bottom-6 right-6 md:bottom-8 md:right-8 z-40 group'
        aria-label='Book now'
      >
        <div className='w-14 h-14 md:w-20 md:h-20 rounded-full bg-gradient-to-r from-amber-200 via-orange-300 to-amber-200 flex items-center justify-center shadow-2xl shadow-amber-500/50 transition-all duration-500 group-hover:scale-110'>
          <Calendar className='w-6 h-6 md:w-9 md:h-9 text-zinc-950' />
        </div>
      </button>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        service={service}
      />
    </div>
  );
};

export default HorsebackRidingSunsetView;
