import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Music,
  Users,
  Clock,
  Star,
  ArrowRight,
  CheckCircle,
  Play,
  Mic,
  Guitar,
  Piano,
  MapPin,
  Heart,
  Crown,
  Calendar,
  Quote,
  ChevronLeft,
  ChevronRight,
  Volume2,
} from 'lucide-react';
import BookingModal from '../../modal/BookingModal';

// Types
interface Service {
  id: string;
  name: string;
  price: number;
}

interface ServiceData {
  metaData?: {
    sessionDuration?: number;
  };
}

interface LiveMusicServiceViewProps {
  service: Service;
  serviceData?: ServiceData;
}

// Constants
const MUSIC_STYLES = [
  {
    id: 'acoustic',
    title: 'Acoustic Sessions',
    description: 'Intimate acoustic performances perfect for romantic moments',
    image:
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=1400',
    vibe: 'Intimate',
    price: 'From $280',
  },
  {
    id: 'jazz',
    title: 'Jazz Ensemble',
    description: 'Sophisticated jazz performances for elegant gatherings',
    image:
      'https://images.unsplash.com/photo-1571266028243-d220c9856446?auto=format&fit=crop&q=80&w=800',
    vibe: 'Sophisticated',
    price: 'From $480',
  },
  {
    id: 'classical',
    title: 'Classical Virtuoso',
    description: 'Refined classical music for distinguished occasions',
    image:
      'https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&q=80&w=800',
    vibe: 'Elegant',
    price: 'From $380',
  },
  {
    id: 'contemporary',
    title: 'Contemporary Hits',
    description: 'Modern covers and popular songs everyone will love',
    image:
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800',
    vibe: 'Dynamic',
    price: 'From $520',
  },
  {
    id: 'latin',
    title: 'Latin Rhythms',
    description: 'Vibrant Latin music to energize your celebration',
    image:
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800',
    vibe: 'Energetic',
    price: 'From $420',
  },
  {
    id: 'world',
    title: 'World Fusion',
    description: 'International sounds for a unique musical journey',
    image:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2940&auto=format&fit=crop',
    vibe: 'Unique',
    price: 'From $450',
  },
] as const;

const ENSEMBLE_OPTIONS = [
  {
    id: 'soloist',
    title: 'Solo Performer',
    description: 'One exceptional musician for intimate settings',
    musicians: 1,
    duration: '2-3 hours',
    price: 280,
    image:
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=800',
    perfect: 'Romantic dinners, intimate gatherings',
  },
  {
    id: 'duo',
    title: 'Musical Duo',
    description: 'Perfect harmony with two talented musicians',
    musicians: 2,
    duration: '2-4 hours',
    price: 420,
    image:
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800',
    perfect: 'Wedding ceremonies, private parties',
  },
  {
    id: 'trio',
    title: 'Professional Trio',
    description: 'Rich, full sound with three skilled performers',
    musicians: 3,
    duration: '3-4 hours',
    price: 680,
    image:
      'https://images.unsplash.com/photo-1571266028243-d220c9856446?auto=format&fit=crop&q=80&w=800',
    perfect: 'Dinner parties, corporate events',
    popular: true,
  },
  {
    id: 'quartet',
    title: 'Complete Band',
    description: 'Full band experience with professional production',
    musicians: 4,
    duration: '3-5 hours',
    price: 920,
    image:
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800',
    perfect: 'Large celebrations, dance parties',
    premium: true,
  },
] as const;

const SUCCESS_STORIES = [
  {
    name: 'Isabella & Marco',
    occasion: 'Wedding Reception',
    result: 'Magical evening celebration',
    quote:
      'The jazz trio created the perfect atmosphere for our wedding. Every song was beautifully performed, and our guests are still talking about the incredible music.',
    image:
      'https://images.unsplash.com/photo-1571266028243-d220c9856446?auto=format&fit=crop&q=80&w=800',
    couple:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2940&auto=format&fit=crop',
  },
  {
    name: 'David Chen',
    occasion: 'Corporate Gala',
    result: 'Unforgettable evening',
    quote:
      'The acoustic duo elevated our corporate event to something truly special. Professional, talented, and exactly what we needed for our VIP clients.',
    image:
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=800',
    couple:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2940&auto=format&fit=crop',
  },
  {
    name: 'Sophie & James',
    occasion: 'Anniversary Dinner',
    result: 'Perfect romantic ambiance',
    quote:
      'The solo pianist made our 25th anniversary dinner absolutely perfect. The music was sophisticated yet intimate, exactly what we dreamed of.',
    image:
      'https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&q=80&w=800',
    couple:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=2940&auto=format&fit=crop',
  },
] as const;

const WHAT_INCLUDED = [
  'Professional musicians with international experience',
  'High-quality sound equipment and setup',
  'Custom song selection and arrangements',
  'Professional sound check and testing',
  'Flexible performance duration',
  'Complete setup and breakdown service',
] as const;

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

// Main Component
const LiveMusicServiceView: React.FC<LiveMusicServiceViewProps> = ({
  service,
  serviceData,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStory, setCurrentStory] = useState(0);

  const handleBooking = () => {
    setIsModalOpen(true);
    // Implement booking logic
  };

  const nextStory = () => {
    setCurrentStory((prev) => (prev + 1) % SUCCESS_STORIES.length);
  };

  const prevStory = () => {
    setCurrentStory(
      (prev) => (prev - 1 + SUCCESS_STORIES.length) % SUCCESS_STORIES.length
    );
  };

  return (
    <div className='min-h-screen bg-zinc-900'>
      {/* Custom CSS for hiding scrollbar */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Hero Section */}
      <HeroSection onBookClick={handleBooking} />

      {/* Music Styles Gallery */}
      <MusicStylesSection />

      {/* Ensemble Options */}
      <EnsembleSection />

      {/* Success Stories */}
      <SuccessStoriesSection
        currentStory={currentStory}
        onNext={nextStory}
        onPrev={prevStory}
      />

      {/* What's Included */}
      <IncludedSection />

      {/* Experience Banner */}
      <ExperienceBannerSection onBookClick={handleBooking} />

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

// Hero Section
const HeroSection: React.FC<{
  onBookClick: () => void;
}> = ({ onBookClick }) => (
  <motion.section
    className='relative h-screen overflow-hidden'
    initial='hidden'
    animate='visible'
    variants={fadeInUp}
  >
    {/* Background */}
    <div className='absolute inset-0'>
      <img
        src='https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=1400'
        alt='Live music performance'
        className='w-full h-full object-cover'
      />
      <div className='absolute inset-0 bg-zinc-900/60'></div>
    </div>

    {/* Floating Music Elements */}
    <motion.div
      className='absolute top-20 right-20 w-16 h-16 bg-amber-500/20 backdrop-blur-sm rounded-full border border-amber-500/30 flex items-center justify-center'
      animate={{ y: [-10, 10, -10], rotate: [0, 5, -5, 0] }}
      transition={{ duration: 8, repeat: Infinity }}
    >
      <Music className='w-8 h-8 text-amber-400' />
    </motion.div>

    <motion.div
      className='absolute bottom-32 left-16 w-12 h-12 bg-amber-500/20 backdrop-blur-sm rounded-full border border-amber-500/30 flex items-center justify-center'
      animate={{ y: [10, -10, 10] }}
      transition={{ duration: 6, repeat: Infinity, delay: 2 }}
    >
      <Volume2 className='w-6 h-6 text-amber-400' />
    </motion.div>

    {/* Content */}
    <div className='relative z-10 h-full flex items-center justify-center text-center px-6'>
      <div className='max-w-5xl space-y-8'>
        <motion.div variants={fadeInUp}>
          <span className='inline-block px-6 py-2 bg-amber-500/20 backdrop-blur-sm rounded-full text-amber-300 text-sm font-medium border border-amber-500/30'>
            Premium Live Music Experience
          </span>
        </motion.div>

        <motion.h1
          variants={fadeInUp}
          className='text-6xl md:text-8xl font-light text-white leading-tight'
        >
          Live Music
          <span className='block font-bold text-amber-400'>Perfection</span>
        </motion.h1>

        <motion.p
          variants={fadeInUp}
          className='text-xl md:text-2xl text-zinc-300 font-light max-w-3xl mx-auto leading-relaxed'
        >
          Transform your celebration with world-class musicians and
          unforgettable performances tailored to your vision
        </motion.p>

        {/* Quick Stats */}
        <motion.div
          variants={staggerChildren}
          className='flex flex-wrap justify-center gap-8 pt-8'
        >
          <StatItem icon={Users} value='1-4' label='Musicians' />
          <StatItem icon={Clock} value='2-5' label='Hours' />
          <StatItem icon={MapPin} value='Any' label='Location' />
        </motion.div>

        <motion.button
          variants={fadeInUp}
          onClick={onBookClick}
          className='inline-flex items-center gap-3 bg-amber-500 hover:bg-amber-600 text-zinc-900 px-10 py-4 rounded-full font-semibold text-lg transition-all duration-200 hover:scale-[1.02]'
        >
          <Play className='w-5 h-5' />
          Book Your Experience
        </motion.button>
      </div>
    </div>
  </motion.section>
);

// Stat Item Component
const StatItem: React.FC<{
  icon: React.ComponentType<any>;
  value: string;
  label: string;
}> = ({ icon: Icon, value, label }) => (
  <motion.div variants={fadeInUp} className='flex items-center gap-3'>
    <div className='w-10 h-10 bg-amber-500/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-amber-500/30'>
      <Icon className='w-5 h-5 text-amber-400' />
    </div>
    <div>
      <p className='font-bold text-white'>{value}</p>
      <p className='text-sm text-zinc-400'>{label}</p>
    </div>
  </motion.div>
);

// Music Styles Section
const MusicStylesSection: React.FC = () => (
  <motion.section
    className='py-20 px-6 bg-zinc-50'
    initial='hidden'
    whileInView='visible'
    viewport={{ once: true }}
    variants={staggerChildren}
  >
    <div className='max-w-7xl mx-auto'>
      <motion.div variants={fadeInUp} className='text-center mb-12 md:mb-16'>
        <h2 className='text-3xl md:text-4xl lg:text-5xl font-light text-zinc-900 mb-4 md:mb-6'>
          Musical Experiences
        </h2>
        <p className='text-lg md:text-xl text-zinc-600 max-w-2xl mx-auto'>
          Choose the perfect musical atmosphere for your celebration
        </p>
      </motion.div>

      {/* Desktop Grid */}
      <div className='hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8'>
        {MUSIC_STYLES.map((style, index) => (
          <MusicStyleCard key={style.id} style={style} />
        ))}
      </div>

      {/* Mobile Horizontal Scroll */}
      <div className='md:hidden'>
        <div className='overflow-x-auto scrollbar-hide'>
          <div
            className='flex gap-4 pb-4 px-4 scroll-smooth'
            style={{ width: 'max-content' }}
          >
            {MUSIC_STYLES.map((style, index) => (
              <div key={style.id} className='w-64 flex-shrink-0'>
                <MusicStyleCard style={style} />
              </div>
            ))}
          </div>
        </div>
        {/* Scroll indicator */}
        <div className='flex justify-center mt-4'>
          <div className='flex gap-2'>
            {MUSIC_STYLES.map((_, index) => (
              <div
                key={index}
                className='w-2 h-2 bg-zinc-300 rounded-full'
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </motion.section>
);

// Music Style Card
const MusicStyleCard: React.FC<{
  style: (typeof MUSIC_STYLES)[0];
}> = ({ style }) => (
  <motion.div
    variants={fadeInUp}
    className='group relative aspect-[3/4] md:aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer'
  >
    <img
      src={style.image}
      alt={style.title}
      className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
    />
    <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent'></div>

    {/* Vibe badge */}
    <div className='absolute top-3 md:top-4 right-3 md:right-4 bg-amber-500/90 text-zinc-900 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium'>
      {style.vibe}
    </div>

    {/* Content */}
    <div className='absolute bottom-4 md:bottom-6 left-4 md:left-6 right-4 md:right-6 text-white'>
      <h3 className='text-xl md:text-2xl font-bold mb-2'>{style.title}</h3>
      <p className='text-zinc-300 text-xs md:text-sm mb-3 md:mb-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 line-clamp-2'>
        {style.description}
      </p>
      <div className='flex items-center justify-between'>
        <span className='text-amber-400 font-semibold text-sm md:text-base'>
          {style.price}
        </span>
        <ArrowRight className='w-4 md:w-5 h-4 md:h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300' />
      </div>
    </div>
  </motion.div>
);

// Ensemble Section
const EnsembleSection: React.FC = () => (
  <motion.section
    className='py-20 px-6 bg-zinc-100'
    initial='hidden'
    whileInView='visible'
    viewport={{ once: true }}
    variants={staggerChildren}
  >
    <div className='max-w-6xl mx-auto'>
      <motion.div variants={fadeInUp} className='text-center mb-12 md:mb-16'>
        <h2 className='text-3xl md:text-4xl lg:text-5xl font-light text-zinc-900 mb-4 md:mb-6'>
          Choose Your Ensemble
        </h2>
        <p className='text-lg md:text-xl text-zinc-600'>
          From intimate solos to full band experiences
        </p>
      </motion.div>

      <div className='grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-8'>
        {ENSEMBLE_OPTIONS.map((ensemble, index) => (
          <EnsembleCard key={ensemble.id} ensemble={ensemble} />
        ))}
      </div>
    </div>
  </motion.section>
);

// Ensemble Card
const EnsembleCard: React.FC<{
  ensemble: (typeof ENSEMBLE_OPTIONS)[0];
}> = ({ ensemble }) => (
  <motion.div
    variants={fadeInUp}
    className='bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group'
  >
    <div className='relative h-48 md:h-64 overflow-hidden'>
      <img
        src={ensemble.image}
        alt={ensemble.title}
        className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-300'
      />
      <div className='absolute inset-0 bg-zinc-900/30'></div>

      {/* Badges */}
      {ensemble.popular && (
        <div className='absolute top-2 md:top-4 left-2 md:left-4 bg-blue-500 text-white px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium flex items-center gap-1'>
          <Star className='w-3 h-3' />
          <span className='hidden sm:inline'>Popular</span>
        </div>
      )}

      {ensemble.premium && (
        <div className='absolute top-2 md:top-4 left-2 md:left-4 bg-amber-500 text-zinc-900 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium flex items-center gap-1'>
          <Crown className='w-3 h-3' />
          <span className='hidden sm:inline'>Premium</span>
        </div>
      )}

      {/* Price */}
      <div className='absolute bottom-2 md:bottom-4 right-2 md:right-4 bg-white/90 backdrop-blur-sm text-zinc-900 px-2 md:px-4 py-1 md:py-2 rounded-full font-bold text-sm md:text-base'>
        ${ensemble.price}
      </div>
    </div>

    <div className='p-4 md:p-6'>
      <div className='flex items-start justify-between mb-3 md:mb-4'>
        <h3 className='text-lg md:text-xl font-bold text-zinc-900 leading-tight'>
          {ensemble.title}
        </h3>
        <div className='text-xs md:text-sm text-zinc-500 ml-2 flex-shrink-0'>
          {ensemble.musicians} {ensemble.musicians === 1 ? 'mus.' : 'mus.'}
        </div>
      </div>

      <p className='text-zinc-600 mb-3 md:mb-4 text-sm md:text-base leading-relaxed'>
        {ensemble.description}
      </p>

      <div className='space-y-2 md:space-y-3'>
        <div className='flex items-center gap-2 text-xs md:text-sm text-zinc-500'>
          <Clock className='w-3 md:w-4 h-3 md:h-4' />
          {ensemble.duration}
        </div>
        <div className='text-xs md:text-sm text-zinc-600 leading-relaxed'>
          <span className='font-medium'>Perfect for:</span>
          <span className='block sm:hidden mt-1'>{ensemble.perfect}</span>
          <span className='hidden sm:inline ml-1'>{ensemble.perfect}</span>
        </div>
      </div>
    </div>
  </motion.div>
);

// Success Stories Section
const SuccessStoriesSection: React.FC<{
  currentStory: number;
  onNext: () => void;
  onPrev: () => void;
}> = ({ currentStory, onNext, onPrev }) => {
  const story = SUCCESS_STORIES[currentStory];

  return (
    <motion.section
      className='py-20 px-6 bg-zinc-900'
      initial='hidden'
      whileInView='visible'
      viewport={{ once: true }}
      variants={fadeInUp}
    >
      <div className='max-w-6xl mx-auto'>
        <div className='text-center mb-16'>
          <h2 className='text-4xl md:text-5xl font-light text-white mb-6'>
            Unforgettable Moments
          </h2>
          <p className='text-xl text-zinc-400'>
            Real celebrations made magical with live music
          </p>
        </div>

        <div className='bg-zinc-800 rounded-3xl overflow-hidden'>
          <div className='grid lg:grid-cols-2'>
            {/* Image */}
            <div className='relative h-96 lg:h-auto'>
              <img
                src={story.image}
                alt={story.occasion}
                className='w-full h-full object-cover'
              />
              <div className='absolute inset-0 bg-zinc-900/40'></div>
            </div>

            {/* Content */}
            <div className='p-12 flex flex-col justify-center text-white'>
              <Quote className='w-12 h-12 text-amber-400 mb-6' />
              <blockquote className='text-xl leading-relaxed mb-8'>
                "{story.quote}"
              </blockquote>

              <div className='flex items-center gap-4 mb-8'>
                <img
                  src={story.couple}
                  alt={story.name}
                  className='w-12 h-12 rounded-full object-cover'
                />
                <div>
                  <h3 className='font-bold text-lg'>{story.name}</h3>
                  <p className='text-zinc-400'>{story.occasion}</p>
                  <p className='text-amber-400 text-sm'>{story.result}</p>
                </div>
              </div>

              {/* Navigation */}
              <div className='flex items-center justify-between'>
                <div className='flex gap-2'>
                  {SUCCESS_STORIES.map((_, index) => (
                    <div
                      key={index}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentStory ? 'bg-amber-400' : 'bg-zinc-600'
                      }`}
                    />
                  ))}
                </div>

                <div className='flex gap-2'>
                  <button
                    onClick={onPrev}
                    className='w-10 h-10 bg-zinc-700 hover:bg-zinc-600 rounded-full flex items-center justify-center transition-colors'
                  >
                    <ChevronLeft className='w-5 h-5' />
                  </button>
                  <button
                    onClick={onNext}
                    className='w-10 h-10 bg-zinc-700 hover:bg-zinc-600 rounded-full flex items-center justify-center transition-colors'
                  >
                    <ChevronRight className='w-5 h-5' />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

// What's Included Section
const IncludedSection: React.FC = () => (
  <motion.section
    className='py-20 px-6 bg-zinc-50'
    initial='hidden'
    whileInView='visible'
    viewport={{ once: true }}
    variants={fadeInUp}
  >
    <div className='max-w-4xl mx-auto'>
      <div className='text-center mb-16'>
        <h2 className='text-4xl font-light text-zinc-900 mb-6'>
          Complete Musical Experience
        </h2>
        <p className='text-xl text-zinc-600'>
          Everything included for a flawless performance
        </p>
      </div>

      <div className='bg-white rounded-2xl p-8 shadow-sm'>
        <div className='grid md:grid-cols-2 gap-6'>
          {WHAT_INCLUDED.map((item, index) => (
            <div key={index} className='flex items-center gap-4'>
              <div className='w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0'>
                <CheckCircle className='w-4 h-4 text-amber-600' />
              </div>
              <span className='text-zinc-700'>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </motion.section>
);

// Experience Banner Section
const ExperienceBannerSection: React.FC<{
  onBookClick: () => void;
}> = ({ onBookClick }) => (
  <motion.section
    className='py-20 px-6 relative overflow-hidden'
    initial='hidden'
    whileInView='visible'
    viewport={{ once: true }}
    variants={fadeInUp}
  >
    <div className='absolute inset-0'>
      <img
        src='https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800'
        alt='Live music performance'
        className='w-full h-full object-cover'
      />
      <div className='absolute inset-0 bg-zinc-900/70'></div>
    </div>

    <div className='relative z-10 max-w-4xl mx-auto text-center text-white'>
      <h2 className='text-4xl md:text-6xl font-light mb-6'>
        Music That Moves
        <span className='block font-bold text-amber-400'>Hearts & Souls</span>
      </h2>
      <p className='text-xl mb-8 max-w-2xl mx-auto text-zinc-300 leading-relaxed'>
        Our musicians don't just play music – they create emotional experiences
        that become the soundtrack to your most precious memories.
      </p>

      <button
        onClick={onBookClick}
        className='inline-flex items-center gap-3 bg-amber-500 hover:bg-amber-600 text-zinc-900 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200 hover:scale-[1.02]'
      >
        <Heart className='w-5 h-5' />
        Create Musical Magic
      </button>
    </div>
  </motion.section>
);

export default LiveMusicServiceView;
