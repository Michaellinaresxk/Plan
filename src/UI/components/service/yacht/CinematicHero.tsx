import { Anchor, ArrowRight, ChevronDown } from 'lucide-react';
import YachtVideoGallery from './YachtVideoGallery';
import { useEffect, useRef, useState } from 'react';
import { HeroProps } from '@/constants/yacht/yachts';

const CinematicHero: React.FC<HeroProps> = ({
  onExploreFleet,
  onOpenBooking,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      setIsVideoLoaded(true);
    };

    video.addEventListener('loadeddata', handleLoadedData);

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.log('Autoplay prevented:', error);
      });
    }

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
    };
  }, []);

  return (
    <div className='relative min-h-screen overflow-hidden bg-slate-950'>
      {/* Video Background with Quality Optimization */}
      <div className='absolute inset-0'>
        {/* Poster Image as Fallback/Loading State */}
        <div
          className='absolute inset-0 bg-cover bg-center transition-opacity duration-700'
          style={{
            backgroundImage:
              "url('https://res.cloudinary.com/ddg92xar5/image/upload/v1754600018/2_dc7fry.jpg')",
            opacity: isVideoLoaded ? 0 : 1,
          }}
        />

        {/* Video with blur to hide low resolution */}
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className={`absolute inset-0 w-full h-full object-cover scale-110 blur-[2px] transition-opacity duration-700 ${
            isVideoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          poster='https://res.cloudinary.com/ddg92xar5/image/upload/v1754600018/2_dc7fry.jpg'
        >
          <source
            src='https://res.cloudinary.com/ddg92xar5/video/upload/v1759669338/yate_m7z3ve.mp4'
            type='video/mp4'
          />
        </video>

        {/* Professional Gradient Overlay */}
        <div className='absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/60 to-slate-950/90' />
        <div className='absolute inset-0 bg-gradient-to-r from-slate-950/60 via-transparent to-slate-950/60' />

        {/* Subtle noise texture for depth */}
        <div className='absolute inset-0 opacity-[0.03] bg-noise' />
      </div>

      {/* Content Container */}
      <div className='relative z-10 min-h-screen flex flex-col'>
        {/* Main Content - Centered */}
        <div className='flex-1 flex items-center'>
          <div className='w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24'>
            <div className='max-w-4xl mx-auto text-center'>
              {/* Subtle Badge */}
              <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 mb-8'>
                <Anchor className='w-4 h-4 text-white/70' />
                <span className='text-sm font-medium text-white/70 tracking-wider'>
                  LUXURY YACHT CHARTER
                </span>
              </div>

              {/* Main Heading */}
              <h1 className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white mb-6 leading-[1.1] tracking-tight'>
                Where Elegance
                <span className='block font-semibold mt-2'>
                  Meets the Ocean
                </span>
              </h1>

              {/* Subtitle */}
              <p className='text-lg sm:text-xl text-white/70 leading-relaxed max-w-2xl mx-auto mb-12 font-light'>
                Experience unparalleled luxury aboard our meticulously curated
                fleet of premium yachts in the Caribbean
              </p>

              {/* CTA Buttons */}
              <div className='flex flex-col sm:flex-row items-center justify-center gap-4 mb-16'>
                <button
                  onClick={onOpenBooking}
                  className='group w-full sm:w-auto px-8 py-4 bg-white text-slate-900 rounded-lg font-medium hover:bg-white/90 transition-all duration-300 flex items-center justify-center gap-2'
                >
                  <span>Book Your Experience</span>
                  <ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform' />
                </button>

                <button
                  onClick={onExploreFleet}
                  className='w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-md text-white rounded-lg font-medium border border-white/20 hover:bg-white/20 transition-all duration-300'
                >
                  Explore Fleet
                </button>
              </div>

              {/* Stats - Minimal Design */}
              <div className='grid grid-cols-3 gap-8 max-w-2xl mx-auto'>
                {[
                  { value: '4', label: 'Premium Yachts' },
                  { value: '5.0', label: 'Guest Rating' },
                  { value: '15+', label: 'Years Experience' },
                ].map((stat, index) => (
                  <div key={index} className='text-center'>
                    <div className='text-3xl sm:text-4xl font-light text-white mb-1'>
                      {stat.value}
                    </div>
                    <div className='text-sm text-white/50 font-light'>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className='pb-8 flex justify-center'>
          <button
            onClick={onExploreFleet}
            className='flex flex-col items-center gap-2 text-white/50 hover:text-white/70 transition-colors group'
            aria-label='Scroll to explore'
          >
            <span className='text-xs font-medium tracking-wider uppercase'>
              Explore
            </span>
            <ChevronDown className='w-5 h-5 animate-bounce' />
          </button>
        </div>
      </div>

      {/* Gallery Section Below */}
      <YachtVideoGallery />
    </div>
  );
};

export default CinematicHero;
