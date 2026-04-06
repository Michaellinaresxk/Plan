import { Anchor, ArrowRight, ChevronDown } from 'lucide-react';
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

    const handleLoaded = () => setIsVideoLoaded(true);
    video.addEventListener('loadeddata', handleLoaded);

    video.play().catch(() => {});

    return () => video.removeEventListener('loadeddata', handleLoaded);
  }, []);

  return (
    <div className='relative min-h-screen overflow-hidden bg-stone-950'>
      {/* Video background */}
      <div className='absolute inset-0'>
        <div
          className='absolute inset-0 bg-cover bg-center transition-opacity duration-700'
          style={{
            backgroundImage:
              "url('https://res.cloudinary.com/ddg92xar5/image/upload/v1754600018/2_dc7fry.jpg')",
            opacity: isVideoLoaded ? 0 : 1,
          }}
        />

        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className={`absolute inset-0 w-full h-full object-cover scale-105 transition-opacity duration-700 ${
            isVideoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          poster='https://res.cloudinary.com/ddg92xar5/image/upload/v1754600018/2_dc7fry.jpg'
        >
          <source
            src='https://res.cloudinary.com/ddg92xar5/video/upload/v1759669338/yate_m7z3ve.mp4'
            type='video/mp4'
          />
        </video>

        <div className='absolute inset-0 bg-gradient-to-b from-stone-950/70 via-stone-950/40 to-stone-950/80' />
      </div>

      {/* Content */}
      <div className='relative z-10 min-h-screen flex flex-col'>
        <div className='flex-1 flex items-center'>
          <div className='w-full px-5 sm:px-8 lg:px-12 py-20 sm:py-24'>
            <div className='max-w-3xl mx-auto text-center'>
              {/* Badge */}
              <div className='inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/5 border border-white/10 mb-8'>
                <Anchor className='w-3.5 h-3.5 text-amber-400' />
                <span className='text-[11px] font-medium text-white/60 tracking-[0.2em] uppercase'>
                  Luxury Yacht Charter
                </span>
              </div>

              <h1 className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white mb-5 leading-[1.08] tracking-tight'>
                Where Elegance
                <span className='block font-semibold mt-1'>
                  Meets the Ocean
                </span>
              </h1>

              <p className='text-base sm:text-lg text-white/50 leading-relaxed max-w-xl mx-auto mb-10 font-light'>
                Experience unparalleled luxury aboard our curated fleet of
                premium yachts in the Caribbean
              </p>

              {/* CTAs */}
              <div className='flex flex-col sm:flex-row items-center justify-center gap-3 mb-14'>
                <button
                  onClick={onOpenBooking}
                  className='group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-white text-stone-900 px-8 py-3.5 text-xs font-medium tracking-wide uppercase hover:bg-amber-50 transition-colors duration-300'
                >
                  Book Your Experience
                  <ArrowRight className='w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform' />
                </button>

                <button
                  onClick={onExploreFleet}
                  className='w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-stone-700 text-stone-300 px-8 py-3.5 text-xs font-medium tracking-wide uppercase hover:border-stone-500 hover:text-white transition-colors duration-300'
                >
                  Explore Fleet
                </button>
              </div>

              {/* Stats */}
              <div className='grid grid-cols-3 gap-6 max-w-sm mx-auto'>
                {[
                  { value: '4', label: 'Premium Yachts' },
                  { value: '5.0', label: 'Guest Rating' },
                  { value: '15+', label: 'Years Experience' },
                ].map((stat, i) => (
                  <div key={i} className='text-center'>
                    <div className='text-2xl sm:text-3xl font-light text-white mb-0.5'>
                      {stat.value}
                    </div>
                    <div className='text-[10px] text-stone-500 uppercase tracking-wider'>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className='pb-8 flex justify-center'>
          <button
            onClick={onExploreFleet}
            className='flex flex-col items-center gap-1.5 text-stone-600 hover:text-stone-400 transition-colors'
            aria-label='Scroll to explore'
          >
            <span className='text-[10px] font-medium tracking-[0.2em] uppercase'>
              Explore
            </span>
            <ChevronDown className='w-4 h-4' />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CinematicHero;
