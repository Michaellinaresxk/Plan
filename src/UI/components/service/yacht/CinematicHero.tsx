import { Anchor, Diamond, Star, Waves } from 'lucide-react';
import YachtVideoGallery from './YachtVideoGallery';
import { useEffect, useRef } from 'react';
import { HeroProps } from '@/constants/yacht/yachts';

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
      <YachtVideoGallery />
    </div>
  );
};
export default CinematicHero;
