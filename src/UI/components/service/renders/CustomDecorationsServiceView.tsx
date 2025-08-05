import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Heart,
  ArrowRight,
  CheckCircle,
  PartyPopper,
  Sparkles,
  Camera,
  Star,
  MessageCircle,
  Gift,
  Calendar,
  MapPin,
  Users,
  AlertTriangle,
} from 'lucide-react';

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

interface CustomDecorationsServiceViewProps {
  service: Service;
  serviceData?: ServiceData;
}

// Constants
const DECORATION_GALLERY = [
  {
    image:
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&q=80&w=1400',
    title: 'Romantic Dinner',
    category: 'Romance',
  },
  {
    image:
      'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?q=80&w=1400',
    title: 'Birthday Party',
    category: 'Birthday',
  },
  {
    image:
      'https://images.unsplash.com/photo-1531058020387-3be344556be6?q=80&w=1400',
    title: 'Pool Celebration',
    category: 'Pool Party',
  },
  {
    image:
      'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=1400',
    title: 'Garden Party',
    category: 'Garden',
  },
  {
    image:
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=1400',
    title: 'Anniversary',
    category: 'Anniversary',
  },
  {
    image:
      'https://images.unsplash.com/photo-1520637836862-4d197d17c881?q=80&w=1400',
    title: 'Proposal Setup',
    category: 'Proposal',
  },
  {
    image:
      'https://images.unsplash.com/photo-1566737236500-c8ac43014a8e?q=80&w=1400',
    title: 'Brunch Setup',
    category: 'Brunch',
  },
  {
    image:
      'https://images.unsplash.com/photo-1551218808-94e220e084d2?q=80&w=1400',
    title: 'Wedding Reception',
    category: 'Wedding',
  },
] as const;

const DECORATION_BANNERS = [
  {
    id: 'romantic',
    title: 'Romantic Moments',
    subtitle: 'Candlelit elegance for intimate celebrations',
    image:
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&q=80&w=1400',
    color: 'from-rose-300/60 to-pink-400/60',
  },
  {
    id: 'birthday',
    title: 'Birthday Magic',
    subtitle: 'Vibrant celebrations that create lasting memories',
    image:
      'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?q=80&w=1400',
    color: 'from-indigo-300/60 to-purple-400/60',
  },
  {
    id: 'poolside',
    title: 'Poolside Paradise',
    subtitle: 'Transform your pool area into a celebration oasis',
    image:
      'https://images.unsplash.com/photo-1531058020387-3be344556be6?q=80&w=1400',
    color: 'from-teal-300/60 to-cyan-400/60',
  },
] as const;

const WHAT_WE_OFFER = [
  'Complete decoration setup',
  'Custom theme planning',
  'Premium materials',
  'Professional styling',
  'Full cleanup service',
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
const CustomDecorationsServiceView: React.FC<
  CustomDecorationsServiceViewProps
> = ({ service, serviceData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBooking = () => {
    setIsModalOpen(true);
    // Implement booking logic
  };

  return (
    <div className='min-h-screen bg-stone-50'>
      {/* Hero Section */}
      <HeroSection onBookClick={handleBooking} />

      {/* Decoration Banners */}
      <BannersSection onBookClick={handleBooking} />

      {/* Simple Gallery */}
      <GallerySection />

      {/* What We Offer */}
      <OfferSection />

      {/* Testimonial */}
      <TestimonialSection />

      {/* Final CTA */}
      <FinalCTASection onBookClick={handleBooking} />

      {/* Notice */}
      <NoticeSection />
    </div>
  );
};

// Hero Section - Clean and Minimal
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
        src='https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&q=80&w=1400'
        alt='Beautiful villa decoration'
        className='w-full h-full object-cover'
      />
      <div className='absolute inset-0 bg-black/40'></div>
    </div>

    {/* Content */}
    <div className='relative z-10 h-full flex items-center justify-center text-center px-6'>
      <div className='max-w-4xl space-y-8'>
        <motion.div variants={fadeInUp}>
          <span className='inline-block px-6 py-2 bg-emerald-50/90 backdrop-blur-sm rounded-full text-emerald-800 text-sm font-medium border border-emerald-200/60'>
            Villa Decoration Specialists
          </span>
        </motion.div>

        <motion.h1
          variants={fadeInUp}
          className='text-5xl md:text-7xl font-light text-white leading-tight'
        >
          Transform Your
          <span className='block font-bold'>Special Moments</span>
        </motion.h1>

        <motion.p
          variants={fadeInUp}
          className='text-xl md:text-2xl text-white/90 font-light max-w-2xl mx-auto'
        >
          We create beautiful atmospheres that turn your villa into the perfect
          celebration space
        </motion.p>

        <motion.button
          variants={fadeInUp}
          onClick={onBookClick}
          className='inline-flex items-center gap-3 bg-stone-100 text-stone-800 px-8 py-4 rounded-full font-medium text-lg hover:bg-stone-200 transition-colors duration-200'
        >
          <Sparkles className='w-5 h-5' />
          Create Your Decoration
        </motion.button>
      </div>
    </div>
  </motion.section>
);

// Decoration Banners Section
const BannersSection: React.FC<{
  onBookClick: () => void;
}> = ({ onBookClick }) => (
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

// Individual Banner Card
const BannerCard: React.FC<{
  banner: (typeof DECORATION_BANNERS)[0];
  reverse: boolean;
  onBookClick: () => void;
}> = ({ banner, reverse, onBookClick }) => (
  <motion.div
    variants={fadeInUp}
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
      <div
        className={`absolute inset-0 bg-gradient-to-r ${banner.color}`}
      ></div>
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
      <button
        onClick={onBookClick}
        className='inline-flex items-center gap-3 bg-stone-700 text-stone-50 px-6 py-3 rounded-full font-medium hover:bg-stone-800 transition-colors duration-200'
      >
        View Details
        <ArrowRight className='w-4 h-4' />
      </button>
    </div>
  </motion.div>
);

// Simple Gallery Section
const GallerySection: React.FC = () => (
  <motion.section
    className='py-20 px-6 bg-stone-100'
    initial='hidden'
    whileInView='visible'
    viewport={{ once: true }}
    variants={staggerChildren}
  >
    <div className='max-w-7xl mx-auto'>
      <motion.div variants={fadeInUp} className='text-center mb-16'>
        <h2 className='text-4xl md:text-5xl font-light text-stone-800 mb-6'>
          Our Work
        </h2>
        <p className='text-xl text-stone-600'>
          Every celebration tells a story
        </p>
      </motion.div>

      {/* Desktop Grid */}
      <div className='hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6'>
        {DECORATION_GALLERY.map((item, index) => (
          <GalleryItem key={index} item={item} />
        ))}
      </div>

      {/* Mobile Horizontal Scroll */}
      <div className='md:hidden'>
        <div className='flex gap-4 overflow-x-auto pb-4 scroll-smooth'>
          <div className='flex gap-4 min-w-max'>
            {DECORATION_GALLERY.map((item, index) => (
              <div key={index} className='w-64 flex-shrink-0'>
                <GalleryItem item={item} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </motion.section>
);

// Gallery Item
const GalleryItem: React.FC<{
  item: (typeof DECORATION_GALLERY)[0];
}> = ({ item }) => (
  <motion.div
    variants={fadeInUp}
    className='group relative aspect-[4/5] rounded-xl overflow-hidden cursor-pointer'
  >
    <img
      src={item.image}
      alt={item.title}
      className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
    />
    <div className='absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300'></div>

    {/* Category badge */}
    <div className='absolute top-4 left-4 bg-stone-50/95 backdrop-blur-sm text-stone-700 px-3 py-1 rounded-full text-sm font-medium'>
      {item.category}
    </div>

    {/* Title on hover */}
    <div className='absolute bottom-6 left-6 right-6'>
      <h3 className='text-white font-medium text-lg opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300'>
        {item.title}
      </h3>
    </div>
  </motion.div>
);

// What We Offer Section
const OfferSection: React.FC = () => (
  <motion.section
    className='py-20 px-6'
    initial='hidden'
    whileInView='visible'
    viewport={{ once: true }}
    variants={fadeInUp}
  >
    <div className='max-w-4xl mx-auto'>
      <div className='bg-stone-50 rounded-3xl p-12 shadow-sm border border-stone-200'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl font-light text-stone-800 mb-4'>
            What We Provide
          </h2>
          <p className='text-stone-600'>
            Everything you need for a perfect celebration
          </p>
        </div>

        <div className='grid md:grid-cols-2 gap-8'>
          <div className='space-y-6'>
            {WHAT_WE_OFFER.map((item, index) => (
              <div key={index} className='flex items-center gap-4'>
                <div className='w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center'>
                  <CheckCircle className='w-5 h-5 text-emerald-600' />
                </div>
                <span className='text-stone-700'>{item}</span>
              </div>
            ))}
          </div>

          <div className='space-y-6'>
            <div className='flex items-start gap-4'>
              <Calendar className='w-6 h-6 text-stone-400 mt-1' />
              <div>
                <h3 className='font-medium text-stone-800 mb-1'>Booking</h3>
                <p className='text-sm text-stone-600'>
                  48 hours advance notice recommended
                </p>
              </div>
            </div>

            <div className='flex items-start gap-4'>
              <MapPin className='w-6 h-6 text-stone-400 mt-1' />
              <div>
                <h3 className='font-medium text-stone-800 mb-1'>Location</h3>
                <p className='text-sm text-stone-600'>
                  Any villa, indoor or outdoor
                </p>
              </div>
            </div>

            <div className='flex items-start gap-4'>
              <Users className='w-6 h-6 text-stone-400 mt-1' />
              <div>
                <h3 className='font-medium text-stone-800 mb-1'>Group Size</h3>
                <p className='text-sm text-stone-600'>
                  Intimate to large celebrations
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </motion.section>
);

// Simple Testimonial
const TestimonialSection: React.FC = () => (
  <motion.section
    className='py-20 px-6 bg-slate-700'
    initial='hidden'
    whileInView='visible'
    viewport={{ once: true }}
    variants={fadeInUp}
  >
    <div className='max-w-4xl mx-auto text-center text-stone-100'>
      <div className='flex justify-center mb-8'>
        {[...Array(5)].map((_, i) => (
          <Star key={i} className='w-6 h-6 text-amber-300 fill-current' />
        ))}
      </div>

      <blockquote className='text-2xl md:text-3xl font-light leading-relaxed mb-8'>
        "They transformed our villa into something magical. Every detail was
        perfect, and our anniversary became truly unforgettable."
      </blockquote>

      <cite className='text-stone-300'>
        — Emma & David, Anniversary Celebration
      </cite>
    </div>
  </motion.section>
);

// Final CTA
const FinalCTASection: React.FC<{
  onBookClick: () => void;
}> = ({ onBookClick }) => (
  <motion.section
    className='py-20 px-6 bg-stone-50'
    initial='hidden'
    whileInView='visible'
    viewport={{ once: true }}
    variants={fadeInUp}
  >
    <div className='max-w-4xl mx-auto text-center'>
      <h2 className='text-4xl md:text-5xl font-light text-stone-800 mb-6'>
        Let's Create Something
        <span className='block font-bold'>Beautiful Together</span>
      </h2>

      <p className='text-xl text-stone-600 mb-12 max-w-2xl mx-auto'>
        Every celebration deserves to be special. Let us help you create the
        perfect atmosphere for your memorable moments.
      </p>

      <button
        onClick={onBookClick}
        className='inline-flex items-center gap-3 bg-slate-700 text-stone-50 px-10 py-4 rounded-full font-medium text-lg hover:bg-slate-800 transition-colors duration-200'
      >
        <MessageCircle className='w-5 h-5' />
        Plan My Decoration
      </button>
    </div>
  </motion.section>
);

// Notice Section
const NoticeSection: React.FC = () => (
  <motion.section
    className='py-12 px-6 bg-orange-50'
    initial='hidden'
    whileInView='visible'
    viewport={{ once: true }}
    variants={fadeInUp}
  >
    <div className='max-w-4xl mx-auto'>
      <div className='flex gap-4'>
        <AlertTriangle className='w-5 h-5 text-orange-500 flex-shrink-0 mt-1' />
        <div className='text-sm text-orange-700'>
          <p className='font-medium mb-1'>Please note:</p>
          <p>
            Booking 48-72 hours in advance recommended. Weather-dependent setups
            include backup options.
          </p>
        </div>
      </div>
    </div>
  </motion.section>
);

export default CustomDecorationsServiceView;
