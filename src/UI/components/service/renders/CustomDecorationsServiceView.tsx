import React, { useState } from 'react';
import {
  CheckCircle,
  Sparkles,
  Star,
  MessageCircle,
  Calendar,
  MapPin,
  X,
  Camera,
  Music,
  AlertTriangle,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
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

interface CustomDecorationsServiceViewProps {
  service: Service;
  serviceData?: ServiceData;
}

// Constants - Updated with PDF information
const DECORATION_GALLERY = [
  {
    image:
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&q=80&w=1400',
    title: 'Romantic Setup',
    category: 'Romance',
  },
  {
    image:
      'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?q=80&w=1400',
    title: 'Birthday Theme',
    category: 'Birthday',
  },
  {
    image:
      'https://images.unsplash.com/photo-1566737236500-c8ac43014a8e?q=80&w=1400',
    title: 'Beach Picnic',
    category: 'Beach',
  },
  {
    image:
      'https://images.unsplash.com/photo-1531058020387-3be344556be6?q=80&w=1400',
    title: 'Kids Party',
    category: 'Kids',
  },
  {
    image:
      'https://images.unsplash.com/photo-1551218808-94e220e084d2?q=80&w=1400',
    title: 'Luxury Dining Decor',
    category: 'Luxury',
  },
  {
    image:
      'https://images.unsplash.com/photo-1520637836862-4d197d17c881?q=80&w=1400',
    title: 'Balloon Garlands',
    category: 'Balloons',
  },
];

const DECORATION_BANNERS = [
  {
    id: 'romantic',
    title: 'Romantic Setups',
    subtitle:
      'Candlelit elegance for intimate celebrations and special moments',
    image:
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&q=80&w=1400',
    color: 'from-rose-300/60 to-pink-400/60',
  },
  {
    id: 'birthday',
    title: 'Birthday Themes',
    subtitle: 'Vibrant celebrations with custom themes for all ages',
    image:
      'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?q=80&w=1400',
    color: 'from-indigo-300/60 to-purple-400/60',
  },
  {
    id: 'beach',
    title: 'Beach Picnics & Balloon Garlands',
    subtitle:
      'Outdoor magic with stunning balloon arrangements and beach setups',
    image:
      'https://images.unsplash.com/photo-1566737236500-c8ac43014a8e?q=80&w=1400',
    color: 'from-teal-300/60 to-cyan-400/60',
  },
  {
    id: 'luxury',
    title: 'Kids Parties & Luxury Dining',
    subtitle:
      'From playful children celebrations to elegant dining experiences',
    image:
      'https://images.unsplash.com/photo-1551218808-94e220e084d2?q=80&w=1400',
    color: 'from-amber-300/60 to-orange-400/60',
  },
];

// Updated with exact PDF information
const WHATS_INCLUDED = [
  'Custom Design Consultation',
  'Full Setup & Breakdown',
  'Decor Materials & Styling',
  'Lighting (if needed)',
  'Optional Add-ons: Cake, Flowers, Welcome Signs',
];

const NOT_INCLUDED = ['Gratuity (optional, appreciated)'];

const WHAT_TO_EXPECT = [
  'Theme & color palette consultation',
  'On-site setup before your event',
  'Beautiful decor tailored to your occasion',
  'Timely breakdown & clean-up',
];

const EXTRAS_AVAILABLE = [
  {
    icon: Camera,
    name: 'Photography',
    description: 'Professional event photography',
  },
  {
    icon: Music,
    name: 'Live Music',
    description: 'Musicians for your celebration',
  },
  { icon: Star, name: 'Catering', description: 'Food and beverage service' },
];

// Main Component
const CustomDecorationsServiceView: React.FC<
  CustomDecorationsServiceViewProps
> = ({ service, serviceData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBooking = () => {
    setIsModalOpen(true);
  };

  // Inject custom CSS animations
  React.useEffect(() => {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      @keyframes float-1 {
        0%, 100% { transform: translateY(0px) translateX(0px); }
        33% { transform: translateY(-10px) translateX(5px); }
        66% { transform: translateY(5px) translateX(-5px); }
      }
      
      @keyframes float-2 {
        0%, 100% { transform: translateY(0px) translateX(0px); }
        33% { transform: translateY(8px) translateX(-8px); }
        66% { transform: translateY(-12px) translateX(3px); }
      }
      
      @keyframes float-3 {
        0%, 100% { transform: translateY(0px) translateX(0px); }
        50% { transform: translateY(-15px) translateX(8px); }
      }
      
      @keyframes slide-down {
        from { opacity: 0; transform: translateY(-50px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes slide-up {
        from { opacity: 0; transform: translateY(50px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes fade-in-delayed {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes pulse-slow {
        0%, 100% { opacity: 0.3; transform: scale(1); }
        50% { opacity: 0.6; transform: scale(1.1); }
      }
      
      @keyframes scroll-indicator {
        0% { opacity: 1; transform: translateY(0); }
        50% { opacity: 0.5; transform: translateY(10px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      
      .animate-float-1 { animation: float-1 6s ease-in-out infinite; }
      .animate-float-2 { animation: float-2 8s ease-in-out infinite; }
      .animate-float-3 { animation: float-3 7s ease-in-out infinite; }
      .animate-slide-down { animation: slide-down 1s ease-out; }
      .animate-slide-up { animation: slide-up 1.2s ease-out 0.3s both; }
      .animate-slide-up-delayed { animation: slide-up 1s ease-out 0.8s both; }
      .animate-fade-in-delayed { animation: fade-in-delayed 1.5s ease-out 0.6s both; }
      .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
      .animate-scroll-indicator { animation: scroll-indicator 2s ease-in-out infinite; }
      .delay-1000 { animation-delay: 1s; }
      
      .backdrop-blur-md {
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
      }
      
      .bg-clip-text {
        -webkit-background-clip: text;
        background-clip: text;
      }
      
      html { scroll-behavior: smooth; }
    `;
    document.head.appendChild(styleSheet);

    return () => {
      if (document.head.contains(styleSheet)) {
        document.head.removeChild(styleSheet);
      }
    };
  }, []);

  return (
    <div className='min-h-screen bg-stone-50'>
      {/* Hero Section */}
      <HeroSection onBookClick={handleBooking} />

      {/* Decoration Banners */}
      <BannersSection onBookClick={handleBooking} />

      {/* Simple Gallery */}
      <GallerySection />

      {/* What's Included - Updated */}
      <IncludedSection />

      {/* What to Expect */}
      <ExpectationSection />

      {/* Extras Available */}
      <ExtrasSection />

      {/* Testimonial */}
      <TestimonialSection />

      {/* Updated Notice */}
      <NoticeSection />

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

// Hero Section with Parallax
const HeroSection: React.FC<{ onBookClick: () => void }> = ({
  onBookClick,
}) => {
  const [scrollY, setScrollY] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className='relative h-screen overflow-hidden'>
      {/* Parallax Background */}
      <div
        className='absolute inset-0 will-change-transform'
        style={{
          transform: `translateY(${scrollY * 0.5}px)`,
        }}
      >
        <div className='absolute inset-0 scale-110'>
          <img
            src='https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=2070'
            alt='Elegant decoration setup'
            className='w-full h-full object-cover'
          />
          {/* Multi-layer overlay for depth */}
          <div className='absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/60'></div>
          <div className='absolute inset-0 bg-gradient-to-r from-purple-900/20 via-transparent to-pink-900/20'></div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className='absolute inset-0 overflow-hidden'>
        {/* Floating particles */}
        <div className='absolute top-1/4 left-1/4 w-2 h-2 bg-white/30 rounded-full animate-float-1'></div>
        <div className='absolute top-1/3 right-1/3 w-3 h-3 bg-white/20 rounded-full animate-float-2'></div>
        <div className='absolute bottom-1/3 left-1/5 w-1 h-1 bg-white/40 rounded-full animate-float-3'></div>
        <div className='absolute top-1/2 right-1/4 w-2 h-2 bg-white/25 rounded-full animate-float-1'></div>

        {/* Gradient orbs */}
        <div className='absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-pink-400/20 to-purple-600/20 rounded-full blur-xl animate-pulse-slow'></div>
        <div className='absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-br from-amber-400/20 to-orange-600/20 rounded-full blur-xl animate-pulse-slow delay-1000'></div>
      </div>

      {/* Content */}
      <div className='relative z-10 h-full flex items-center  px-6'>
        <div className='max-w-5xl space-y-10'>
          {/* Main Title */}
          <div className='space-y-4 animate-slide-up'>
            <h1 className='text-6xl md:text-8xl lg:text-9xl font-extralight text-white leading-none tracking-tight'>
              Create a
            </h1>
            <h2 className='text-5xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-white via-pink-100 to-amber-100 bg-clip-text text-transparent leading-none'>
              Memorable Setting
            </h2>
          </div>

          {/* Subtitle */}
          <p className='text-xl md:text-2xl lg:text-3xl text-white/90 font-light max-w-4xl mx-auto leading-relaxed animate-fade-in-delayed'>
            Transform any space into a celebration with our personalized
            decoration service.
            <span className='block mt-2 text-amber-200/80'>
              We bring your vision to life with elegance, color, and creativity.
            </span>
          </p>

          {/* CTA Buttons */}
          <div className='flex flex-col sm:flex-row gap-4  items-center animate-slide-up-delayed'>
            <button
              onClick={onBookClick}
              className='group relative inline-flex items-center gap-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-10 py-4 rounded-full font-semibold text-lg shadow-2xl hover:shadow-pink-500/25 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1'
            >
              <div className='absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
              <Sparkles className='w-6 h-6 relative z-10' />
              <span className='relative z-10'>Plan My Decoration</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

// Decoration Banners Section
const BannersSection: React.FC<{ onBookClick: () => void }> = ({
  onBookClick,
}) => (
  <section className='py-10 px-6'>
    <div className='max-w-7xl mx-auto space-y-16'>
      <motion.section
        className='py-20 px-6 bg-stone-50'
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true }}
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
        </div>
      </motion.section>

      {DECORATION_BANNERS.map((banner, index) => (
        <BannerCard
          key={banner.id}
          banner={banner}
          reverse={index % 2 === 1}
          onBookClick={onBookClick}
        />
      ))}
    </div>
  </section>
);

// Individual Banner Card
const BannerCard: React.FC<{
  banner: (typeof DECORATION_BANNERS)[0];
  reverse: boolean;
  onBookClick: () => void;
}> = ({ banner, reverse, onBookClick }) => (
  <div
    className={`grid lg:grid-cols-2 gap-12 items-center ${
      reverse ? 'lg:grid-flow-col-dense' : ''
    }`}
  >
    {/* Image */}
    <div
      className={`relative h-96 rounded-2xl overflow-hidden group ${
        reverse ? 'lg:col-start-2' : ''
      }`}
    >
      <img
        src={banner.image}
        alt={banner.title}
        className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-700'
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
    </div>
  </div>
);

// Gallery Section
const GallerySection: React.FC = () => (
  <section className='py-20 px-6 bg-stone-100'>
    <div className='max-w-7xl mx-auto'>
      <div className='text-center mb-16'>
        <h2 className='text-4xl md:text-5xl font-light text-stone-800 mb-6'>
          Our Work
        </h2>
        <p className='text-xl text-stone-600'>
          Every celebration tells a story
        </p>
      </div>

      {/* Desktop Grid */}
      <div className='hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6'>
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
  </section>
);

// Gallery Item
const GalleryItem: React.FC<{ item: (typeof DECORATION_GALLERY)[0] }> = ({
  item,
}) => (
  <div className='group relative aspect-[4/5] rounded-xl overflow-hidden cursor-pointer'>
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
  </div>
);

// What's Included Section - Updated with PDF info
const IncludedSection: React.FC = () => (
  <section className='py-20 px-6'>
    <div className='max-w-6xl mx-auto'>
      <div className='grid lg:grid-cols-2 gap-12'>
        {/* What's Included */}
        <div className='bg-emerald-50 rounded-3xl p-8 shadow-sm border border-emerald-200'>
          <h2 className='text-3xl font-light text-stone-800 mb-8 flex items-center gap-3'>
            <CheckCircle className='w-8 h-8 text-emerald-600' />
            What's Included
          </h2>

          <div className='space-y-4'>
            {WHATS_INCLUDED.map((item, index) => (
              <div key={index} className='flex items-start gap-3'>
                <div className='w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mt-0.5'>
                  <CheckCircle className='w-4 h-4 text-emerald-600' />
                </div>
                <span className='text-stone-700'>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Not Included */}
        <div className='bg-stone-50 rounded-3xl p-8 shadow-sm border border-stone-200'>
          <h2 className='text-3xl font-light text-stone-800 mb-8 flex items-center gap-3'>
            <X className='w-8 h-8 text-stone-400' />
            Not Included
          </h2>

          <div className='space-y-4'>
            {NOT_INCLUDED.map((item, index) => (
              <div key={index} className='flex items-start gap-3'>
                <div className='w-6 h-6 bg-stone-200 rounded-full flex items-center justify-center mt-0.5'>
                  <X className='w-4 h-4 text-stone-500' />
                </div>
                <span className='text-stone-600'>{item}</span>
              </div>
            ))}
          </div>

          {/* Important Details */}
          <div className='mt-8 pt-8 border-t border-stone-200 space-y-4'>
            <div className='flex items-start gap-3'>
              <Calendar className='w-6 h-6 text-stone-400 mt-1' />
              <div>
                <h3 className='font-medium text-stone-800 mb-1'>
                  Booking Time
                </h3>
                <p className='text-sm text-stone-600'>
                  Minimum 48 hours notice required
                </p>
              </div>
            </div>

            <div className='flex items-start gap-3'>
              <MapPin className='w-6 h-6 text-stone-400 mt-1' />
              <div>
                <h3 className='font-medium text-stone-800 mb-1'>
                  Setup Location
                </h3>
                <p className='text-sm text-stone-600'>
                  Indoor or outdoor options available
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// What to Expect Section
const ExpectationSection: React.FC = () => (
  <section className='py-20 px-6 bg-stone-100'>
    <div className='max-w-4xl mx-auto'>
      <div className='text-center mb-12'>
        <h2 className='text-4xl font-light text-stone-800 mb-6'>
          What to Expect
        </h2>
        <p className='text-xl text-stone-600'>
          Your journey from consultation to celebration
        </p>
      </div>

      <div className='grid md:grid-cols-2 gap-8'>
        {WHAT_TO_EXPECT.map((step, index) => (
          <div
            key={index}
            className='flex items-start gap-4 p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300'
          >
            <div className='w-10 h-10 bg-stone-800 text-white rounded-full flex items-center justify-center font-medium'>
              {index + 1}
            </div>
            <div className='flex-1'>
              <p className='text-stone-700 leading-relaxed'>{step}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// Extras Available Section
const ExtrasSection: React.FC = () => (
  <section className='py-20 px-6'>
    <div className='max-w-4xl mx-auto'>
      <div className='text-center mb-12'>
        <h2 className='text-4xl font-light text-stone-800 mb-6'>
          Extras Available
        </h2>
        <p className='text-xl text-stone-600'>
          Additional services upon request
        </p>
      </div>

      <div className='grid md:grid-cols-3 gap-8'>
        {EXTRAS_AVAILABLE.map((extra, index) => (
          <div
            key={index}
            className='text-center p-6 bg-stone-50 rounded-2xl border border-stone-200 hover:shadow-md transition-all duration-300 hover:-translate-y-1'
          >
            <div className='w-16 h-16 bg-stone-800 rounded-full flex items-center justify-center mx-auto mb-4'>
              <extra.icon className='w-8 h-8 text-white' />
            </div>
            <h3 className='text-xl font-medium text-stone-800 mb-2'>
              {extra.name}
            </h3>
            <p className='text-stone-600'>{extra.description}</p>
          </div>
        ))}
      </div>

      <div className='text-center mt-8'>
        <p className='text-stone-600'>
          <strong>Customization Options:</strong> We adapt to space, weather,
          and personal style
        </p>
      </div>
    </div>
  </section>
);

// Simple Testimonial
const TestimonialSection: React.FC = () => (
  <section className='py-20 px-6 bg-slate-700'>
    <div className='max-w-4xl mx-auto text-center text-stone-100'>
      <div className='flex justify-center mb-8'>
        {[...Array(5)].map((_, i) => (
          <Star key={i} className='w-6 h-6 text-amber-300 fill-current' />
        ))}
      </div>

      <blockquote className='text-2xl md:text-3xl font-light leading-relaxed mb-8'>
        "Every celebration deserves a personal touch. We handle every detail so
        you can focus on enjoying the moment. From cozy to extravagant, we make
        your setting unforgettable."
      </blockquote>

      <cite className='text-stone-300'>— Why Choose Us</cite>
    </div>
  </section>
);

// Updated Notice Section
const NoticeSection: React.FC = () => (
  <section className='py-12 px-6 bg-orange-50'>
    <div className='max-w-4xl mx-auto'>
      <div className='flex gap-4'>
        <AlertTriangle className='w-5 h-5 text-orange-500 flex-shrink-0 mt-1' />
        <div className='text-sm text-orange-700'>
          <p className='font-medium mb-1'>Disclaimer:</p>
          <p>
            Please provide accurate setup location details and timing. Minimum
            48 hours advance notice required. We adapt to space, weather, and
            personal style.
          </p>
        </div>
      </div>
    </div>
  </section>
);

export default CustomDecorationsServiceView;
