import React, { useState, useRef, useEffect } from 'react';
import { Play, Volume2, VolumeX } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/client';

interface Video {
  id: string;
  url: string;
  thumbnail?: string;
  title?: string;
  description?: string;
}

interface Props {
  videos: Video[];
}

const YogalVideoSlider: React.FC<Props> = ({ videos }) => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState<{ [key: number]: boolean }>({});
  const [isMuted, setIsMuted] = useState<{ [key: number]: boolean }>({});
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);

  // Auto-play solo el video activo
  useEffect(() => {
    Object.keys(videoRefs.current).forEach((key) => {
      const index = parseInt(key);
      const video = videoRefs.current[index];
      if (video) {
        if (index === currentIndex) {
          video.play().catch(() => {
            setIsPlaying((prev) => ({ ...prev, [index]: false }));
          });
          setIsPlaying((prev) => ({ ...prev, [index]: true }));
        } else {
          video.pause();
          setIsPlaying((prev) => ({ ...prev, [index]: false }));
        }
      }
    });
  }, [currentIndex]);

  // Scroll al video actual
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const videoWidth = container.offsetWidth * 0.7; // 70% del ancho
    const scrollPosition = currentIndex * videoWidth;

    container.scrollTo({
      left: scrollPosition,
      behavior: 'smooth',
    });
  }, [currentIndex]);

  // Swipe horizontal
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentIndex < videos.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else if (diff < 0 && currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1);
      }
    }
  };

  // Controles
  const togglePlayPause = (index: number) => {
    const video = videoRefs.current[index];
    if (!video) return;

    if (isPlaying[index]) {
      video.pause();
      setIsPlaying((prev) => ({ ...prev, [index]: false }));
    } else {
      video.play();
      setIsPlaying((prev) => ({ ...prev, [index]: true }));
    }
  };

  const toggleMute = (index: number) => {
    const video = videoRefs.current[index];
    if (video) {
      video.muted = !video.muted;
      setIsMuted((prev) => ({ ...prev, [index]: video.muted }));
    }
  };

  return (
    <div className='relative w-full py-12 md:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-white overflow-hidden'>
      {/* Header Section */}
      <div className='max-w-7xl mx-auto px-4 mb-8 md:mb-12 lg:mb-16 text-center'>
        {/* Badge */}
        <div className='inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-full mb-4 md:mb-6'>
          <Play className='w-4 h-4 text-blue-600' />
          <span className='text-blue-700 text-xs md:text-sm font-semibold tracking-wide uppercase'>
            {t('services.standard.yoga.videoGallery.badge.text')}
          </span>
        </div>

        {/* Main Title */}
        <h2 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-3 md:mb-4 leading-tight'>
          {t('services.standard.yoga.videoGallery.title.main')}{' '}
          <span className='bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent'>
            {t('services.standard.yoga.videoGallery.title.highlight')}
          </span>
        </h2>

        {/* Slogan */}
        <p className='text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4'>
          {t('services.standard.yoga.videoGallery.slogan')}
        </p>
      </div>

      {/* Slider Container */}
      <div
        ref={containerRef}
        className='flex gap-6 px-[15%] overflow-x-auto scrollbar-hide scroll-smooth py-6'
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {videos.map((video, index) => {
          const isActive = index === currentIndex;

          return (
            <div
              key={video.id}
              className='flex-shrink-0 w-[70%] md:w-[40%] lg:w-[30%]'
              style={{ scrollSnapAlign: 'center' }}
              onClick={() => setCurrentIndex(index)}
            >
              {/* Video Card */}
              <div
                className={`relative aspect-[9/16] bg-black rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 cursor-pointer ${
                  isActive
                    ? 'scale-100 opacity-100 ring-4 ring-blue-500'
                    : 'scale-90 opacity-60 hover:opacity-80'
                }`}
              >
                {/* Video */}
                <video
                  ref={(el) => (videoRefs.current[index] = el)}
                  src={video.url}
                  poster={video.thumbnail}
                  className='w-full h-full object-cover'
                  playsInline
                  loop
                  muted={isMuted[index] ?? true}
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePlayPause(index);
                  }}
                />

                {/* Play/Pause Overlay */}
                {!isPlaying[index] && (
                  <div className='absolute inset-0 flex items-center justify-center'>
                    <div className='w-16 h-16 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center'>
                      <Play className='w-8 h-8 text-white ml-1' />
                    </div>
                  </div>
                )}

                {/* Mute Button - Solo en video activo */}
                {isActive && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMute(index);
                    }}
                    className='absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/70 transition-colors z-10'
                  >
                    {isMuted[index] ?? true ? (
                      <VolumeX className='w-5 h-5 text-white' />
                    ) : (
                      <Volume2 className='w-5 h-5 text-white' />
                    )}
                  </button>
                )}

                {/* Overlay para videos inactivos */}
                {!isActive && (
                  <div className='absolute inset-0 bg-black/20 flex items-center justify-center'>
                    <span className='text-white text-sm font-medium bg-black/50 px-3 py-1 rounded-full'>
                      {t('services.standard.yoga.videoGallery.video.tapToView')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Dots Indicator */}
      <div className='flex justify-center gap-2 mt-8'>
        {videos.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex
                ? 'w-8 bg-blue-600'
                : 'w-2 bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>

      {/* Counter */}
      <div className='text-center mt-4'>
        <span className='text-gray-600 font-medium'>
          {currentIndex + 1} / {videos.length}
        </span>
      </div>

      {/* Swipe Hint */}
      <div className='text-center mt-4'>
        <p className='text-sm text-gray-400'>
          {t('services.standard.yoga.swipeHint')}
        </p>
      </div>
    </div>
  );
};

export default YogalVideoSlider;
