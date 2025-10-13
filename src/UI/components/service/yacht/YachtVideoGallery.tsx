import React, { useState, useRef } from 'react';
import { Play, X, Pause, Volume2, VolumeX } from 'lucide-react';

// ============================================
// TYPES
// ============================================
interface MediaItem {
  id: number;
  type: 'image' | 'video';
  src: string;
  thumbnail?: string;
  title: string;
}

interface VideoPlayerProps {
  src: string;
  thumbnail: string;
  onClose: () => void;
}

// ============================================
// CONSTANTS
// ============================================
const YACHT_VIDEOS: MediaItem[] = [
  {
    id: 1,
    type: 'video',
    src: 'https://res.cloudinary.com/ddg92xar5/video/upload/v1759669338/yate_m7z3ve.mp4',
    thumbnail:
      'https://res.cloudinary.com/ddg92xar5/image/upload/v1754600018/2_dc7fry.jpg',
    title: 'Luxury Yacht Experience',
  },
  {
    id: 2,
    type: 'video',
    src: 'https://res.cloudinary.com/ddg92xar5/video/upload/v1759669338/yate_m7z3ve.mp4',
    thumbnail:
      'https://res.cloudinary.com/ddg92xar5/image/upload/v1754600017/3_eapwql.jpg',
    title: 'Caribbean Adventure',
  },
  {
    id: 3,
    type: 'video',
    src: 'https://res.cloudinary.com/ddg92xar5/video/upload/v1759669338/yate_m7z3ve.mp4',
    thumbnail:
      'https://res.cloudinary.com/ddg92xar5/image/upload/v1754600209/3_dvbeqw.jpg',
    title: 'Sunset Sailing',
  },
];

const YACHT_IMAGES: MediaItem[] = [
  {
    id: 4,
    type: 'image',
    src: 'https://res.cloudinary.com/ddg92xar5/image/upload/v1754600211/1_k81g6k.jpg',
    title: 'Ocean Paradise',
  },
  {
    id: 5,
    type: 'image',
    src: 'https://res.cloudinary.com/ddg92xar5/image/upload/v1755956399/3380551b-f82f-4fdc-86e2-47cf2ad3a6dc_foh9sp.jpg',
    title: 'Luxury Interior',
  },
  {
    id: 6,
    type: 'image',
    src: 'https://res.cloudinary.com/ddg92xar5/image/upload/v1754600208/2_k72tfn.jpg',
    title: 'Crystal Waters',
  },
];

// ============================================
// CUSTOM HOOKS
// ============================================
const useIntersectionObserver = (options = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
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

// ============================================
// VIDEO PLAYER COMPONENT
// ============================================
const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  thumbnail,
  onClose,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentProgress =
        (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(currentProgress);
    }
  };

  return (
    <div className='fixed inset-0  z-50 flex items-center justify-center p-4 md:p-8 backdrop-blur-2xl animate-fadeIn'>
      <button
        onClick={onClose}
        className='absolute top-4 right-4 md:top-8 md:right-8 group'
        aria-label='Close video'
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
          onTimeUpdate={handleTimeUpdate}
          onClick={togglePlay}
        />

        <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 md:p-10 rounded-b-3xl'>
          <div className='flex items-center gap-4 md:gap-6'>
            <button
              onClick={togglePlay}
              className='group/play relative'
              aria-label='Play/Pause'
            >
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
                className='h-full bg-gradient-to-r from-cyan-400 via-teal-400 to-cyan-400 transition-all duration-300 shadow-lg shadow-cyan-500/50'
                style={{ width: `${progress}%` }}
              />
            </div>

            <button
              onClick={toggleMute}
              className='text-white/70 hover:text-white transition-all duration-300 hover:scale-110'
              aria-label='Mute/Unmute'
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

// ============================================
// VIDEO GALLERY COMPONENT
// ============================================
const YachtVideoGallery: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<MediaItem | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { elementRef, isVisible } = useIntersectionObserver();

  return (
    <section
      ref={elementRef}
      className='py-24 md:py-40 relative overflow-hidden'
    >
      {/* Background effects */}
      <div className='absolute inset-0 ' />

      {/* Animated gradient orbs */}
      <div className='absolute top-20 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse' />
      <div
        className='absolute bottom-20 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse'
        style={{ animationDelay: '1s' }}
      />

      <div className='max-w-7xl mx-auto px-4 md:px-8 relative z-10'>
        {/* Header */}
        <div className='text-center mb-16 md:mb-24'>
          <div
            className={`transition-all duration-1000 ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-20'
            }`}
          >
            <div className='inline-flex items-center gap-2 bg-cyan-500/10 backdrop-blur-sm px-6 py-3 rounded-full mb-8 border border-cyan-500/20'>
              <Play className='w-5 h-5 text-cyan-400' />
              <span className='text-cyan-300 text-sm font-medium tracking-wide'>
                VIDEO GALLERY
              </span>
            </div>

            <h2 className='text-4xl md:text-7xl font-extralight text-white mb-6 tracking-tighter'>
              Experience the
              <span className='block font-bold bg-gradient-to-r from-cyan-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent mt-2'>
                Journey
              </span>
            </h2>
            <p className='text-base md:text-xl text-white/60 font-light max-w-2xl mx-auto'>
              Immerse yourself in the luxury yacht experience
            </p>
          </div>
        </div>

        {/* Mobile Carousel */}
        <div className='md:hidden mb-12'>
          <div
            ref={scrollContainerRef}
            className='flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 pl-4'
            style={{ scrollBehavior: 'smooth' }}
          >
            {YACHT_VIDEOS.map((video, i) => (
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
                  <div className='absolute inset-0 bg-gradient-to-t from-cyan-950/90 via-cyan-950/20 to-transparent' />

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
                    <div className='absolute top-3 right-3 bg-cyan-500/20 backdrop-blur-md px-2.5 py-1 rounded-full animate-pulse'>
                      <span className='text-xs text-cyan-200 font-light'>
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

          {/* Mobile indicators */}
          <div className='flex justify-center gap-2 mt-4'>
            {YACHT_VIDEOS.map((_, i) => (
              <div key={i} className='w-1.5 h-1.5 rounded-full bg-white/30' />
            ))}
          </div>
        </div>

        {/* Desktop Video Grid */}
        <div className='hidden md:grid md:grid-cols-3 gap-6 md:gap-8 mb-12'>
          {YACHT_VIDEOS.map((video, i) => (
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

              <div className='absolute inset-0 bg-gradient-to-t from-cyan-950/90 via-cyan-950/20 to-transparent' />
              <div className='absolute inset-0 bg-gradient-to-t from-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700' />

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

        {/* Image Grid */}
        <div className='grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8'>
          {YACHT_IMAGES.map((image, i) => (
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
              <div className='absolute inset-0 bg-gradient-to-t from-cyan-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700' />
              <div className='absolute bottom-0 left-0 right-0 p-4 md:p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500'>
                <h3 className='text-base md:text-xl font-light text-white'>
                  {image.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Player Modal */}
      {selectedVideo && (
        <VideoPlayer
          src={selectedVideo.src}
          thumbnail={selectedVideo.thumbnail!}
          onClose={() => setSelectedVideo(null)}
        />
      )}

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
    </section>
  );
};

export default YachtVideoGallery;
