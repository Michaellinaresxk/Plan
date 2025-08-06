import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { useBooking } from '@/context/BookingContext';
import { Service } from '@/types/type';
import { ServiceData } from '@/types/services';
import { BookingDate } from '@/types/type';
import BookingModal from '../../modal/BookingModal';
import {
  ChevronRight,
  MapPin,
  Clock,
  Shield,
  Star,
  Check,
  ArrowRight,
  X,
  Sparkles,
  Heart,
  Users,
  Baby,
  Mountain,
  Sun,
  Waves,
  Calendar,
  Play,
} from 'lucide-react';

interface HorseBackRidingServiceViewProps {
  service: Service;
  serviceData?: ServiceData;
  primaryColor: string;
  viewContext?: 'standard-view' | 'premium-view';
}

// Location options matching the form
const LOCATION_OPTIONS = [
  {
    id: 'punta-cana-resorts',
    name: 'Punta Cana Resorts',
    description: 'Resort area pickup available',
  },
  {
    id: 'cap-cana',
    name: 'Cap Cana',
    description: 'Exclusive marina and luxury hotels',
  },
  { id: 'bavaro', name: 'Bavaro', description: 'Popular beach destination' },
  {
    id: 'punta-village',
    name: 'Punta Village',
    description: 'Local community area',
  },
  {
    id: 'uvero-alto',
    name: 'Uvero Alto',
    description: 'Northern resort corridor',
  },
  {
    id: 'macao-beach',
    name: 'Macao Beach Area',
    description: 'Near the riding location',
  },
];

// Modern Hero Section with Parallax - Simplified
const HeroSection = ({ onBookClick }) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className='relative h-screen min-h-[600px] md:min-h-[700px] overflow-hidden'>
      {/* Parallax Background with stronger overlay */}
      <div
        className='absolute inset-0'
        style={{ transform: `translateY(${scrollY * 0.3}px)` }}
      >
        <img
          src='https://puntacanaexcursions.online/wp-content/uploads/2024/07/image00008-scaled.jpeg'
          alt='Horseback riding at Macao Beach'
          className='w-full h-full object-cover'
        />
        {/* Darker overlay for better contrast */}
        <div className='absolute inset-0 bg-black/40' />
        <div className='absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/70' />
      </div>

      {/* Content */}
      <div className='relative z-10 h-full flex flex-col justify-end px-4 md:px-8 pb-30'>
        <div className='max-w-4xl mx-auto w-full'>
          {/* Main Title - Cleaner and more impactful */}
          <h1 className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 text-white'>
            Horseback Riding
            <span className='block text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-amber-400 mt-2'>
              Macao Beach
            </span>
          </h1>

          {/* Simplified description */}
          <p className='text-base sm:text-lg md:text-xl text-white/90 mb-8 md:mb-10 max-w-2xl'>
            Experience the magic of riding along pristine beaches. Perfect for
            all skill levels.
          </p>

          {/* Single prominent CTA */}
          <div className='flex flex-col sm:flex-row gap-4 mb-8'>
            <button
              onClick={onBookClick}
              className='group bg-amber-500 hover:bg-amber-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold transition-all transform hover:scale-105 shadow-2xl inline-flex items-center justify-center gap-2'
            >
              <Play
                className='w-5 h-5 group-hover:translate-x-1 transition-transform'
                fill='currentColor'
              />
              Book Your Adventure
              <ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform' />
            </button>
          </div>

          {/* Minimal key info */}
          <div className='flex flex-wrap gap-6 text-white/80 text-sm sm:text-base'>
            <div className='flex items-center gap-2'>
              <Star className='w-4 h-4 text-amber-400 fill-amber-400' />
              <span>4.9 Rating</span>
            </div>
            <div className='flex items-center gap-2'>
              <Clock className='w-4 h-4' />
              <span>2 Hours</span>
            </div>
            <div className='flex items-center gap-2'>
              <Users className='w-4 h-4' />
              <span>All Levels</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator - subtle */}
      <div className='absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/50 animate-bounce'>
        <ChevronRight className='w-6 h-6 rotate-90' />
      </div>
    </div>
  );
};

// Photo Gallery Section - Enhanced Masonry Grid
const PhotoGallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const photos = [
    {
      src: 'https://puntacanaexcursions.online/wp-content/uploads/2024/08/image00011-1536x1017.jpeg',
      alt: 'Beach horseback riding',
      caption: 'Ride along pristine Macao Beach',
    },
    {
      src: 'https://puntacanaexcursions.online/wp-content/uploads/2024/07/image00013-scaled.jpeg',
      alt: 'Sunset riding',
      caption: 'Magical sunset experiences',
    },
    {
      src: 'https://puntacanaexcursions.online/wp-content/uploads/2024/07/image00021-scaled.jpeg',
      alt: 'Ocean views',
      caption: 'Breathtaking ocean views',
    },
  ];

  return (
    <section className='py-8 bg-white'>
      <div className='max-w-7xl mx-auto px-4'>
        {/* Masonry Grid */}
        <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
          {photos.map((photo, idx) => (
            <div
              key={idx}
              className={`group relative overflow-hidden rounded-xl cursor-pointer ${
                idx === 0 ? 'md:col-span-2 md:row-span-2' : ''
              }`}
              onClick={() => setSelectedImage(photo)}
            >
              <div className={`${idx === 0 ? 'h-full' : 'aspect-square'}`}>
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
                />
              </div>
              <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                <div className='absolute bottom-4 left-4 text-white'>
                  <p className='font-semibold text-sm md:text-base'>
                    {photo.caption}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className='fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4'
          onClick={() => setSelectedImage(null)}
        >
          <button
            className='absolute top-4 right-4 text-white hover:text-gray-300 z-50'
            onClick={() => setSelectedImage(null)}
          >
            <X className='w-8 h-8' />
          </button>
          <img
            src={selectedImage.src}
            alt={selectedImage.alt}
            className='max-w-full max-h-[90vh] rounded-lg'
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
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
          src='https://puntacanaexcursions.online/wp-content/uploads/2024/07/Imagen-de-WhatsApp-2024-06-03-a-las-15.47.17_45e97ed7-scaled.jpg'
          alt='Horseback riding experience'
          className='w-full h-full object-cover'
        />
        <div className='absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent' />
      </div>

      {/* Content */}
      <div className='relative z-10 max-w-6xl mx-auto px-4'>
        <div className='max-w-2xl'>
          <div className='inline-flex items-center gap-2 bg-amber-500/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-amber-400/30'>
            <Sparkles className='w-4 h-4 text-amber-400' />
            <span className='text-amber-200 text-sm font-medium'>
              Limited Time Offer
            </span>
          </div>

          <h2 className='text-4xl md:text-5xl font-bold text-white mb-6'>
            Create Memories That
            <span className='block text-amber-400'>Last a Lifetime</span>
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
            className='bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all transform hover:scale-105 shadow-2xl'
          >
            Book Now
          </button>
        </div>
      </div>
    </section>
  );
};

// Quick Info Cards - Cleaner Design
const QuickInfoSection = () => {
  const cards = [
    {
      icon: <MapPin className='w-5 h-5' />,
      title: 'Macao Beach',
      description: 'Pristine untouched paradise',
    },
    {
      icon: <Shield className='w-5 h-5' />,
      title: 'Safety First',
      description: 'Professional guides & equipment',
    },
    {
      icon: <Clock className='w-5 h-5' />,
      title: '2 Hours',
      description: 'Complete beach experience',
    },
    {
      icon: <Star className='w-5 h-5' />,
      title: '4.9 Rating',
      description: 'From 847+ happy riders',
    },
  ];

  return (
    <section className='py-16 px-4 bg-gray-50'>
      <div className='max-w-5xl mx-auto'>
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6'>
          {cards.map((card, idx) => (
            <div key={idx} className='text-center p-6'>
              <div className='inline-flex p-3 rounded-full bg-amber-100 text-amber-600 mb-3'>
                {card.icon}
              </div>
              <h3 className='font-semibold text-gray-800 mb-1'>{card.title}</h3>
              <p className='text-sm text-gray-600'>{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Trust Badges Section - Minimalist
const TrustBadges = () => {
  return (
    <section className='py-16 px-4 bg-amber-500'>
      <div className='max-w-5xl mx-auto'>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white'>
          <div>
            <div className='text-3xl font-bold'>847+</div>
            <div className='text-sm opacity-90'>Happy Riders</div>
          </div>
          <div>
            <div className='text-3xl font-bold'>4.9★</div>
            <div className='text-sm opacity-90'>Rating</div>
          </div>
          <div>
            <div className='text-3xl font-bold'>5+</div>
            <div className='text-sm opacity-90'>Years</div>
          </div>
          <div>
            <div className='text-3xl font-bold'>100%</div>
            <div className='text-sm opacity-90'>Safe</div>
          </div>
        </div>
      </div>
    </section>
  );
};

// What's Included Section - Clean & Simple
const IncludesSection = () => {
  const includes = [
    'Round-trip transportation',
    'Playa Macao',
    '2-hour beach experience',
    'Shopping stop',
    'Scenic river',
  ];

  return (
    <section className='py-16 px-4 bg-white'>
      <div className='max-w-3xl mx-auto'>
        <h2 className='text-3xl font-bold text-center mb-10 text-gray-800'>
          Everything Included
        </h2>
        <div className='grid grid-cols-2 md:grid-cols-2 gap-4'>
          {includes.map((item, idx) => (
            <div key={idx} className='flex items-center gap-3'>
              <Check className='w-5 h-5 text-amber-500 flex-shrink-0' />
              <span className='text-gray-700'>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Reviews Section - Clean Design
const ReviewsSection = () => {
  const reviews = [
    {
      name: 'Sarah Johnson',
      rating: 5,
      text: 'Amazing experience! The sunset ride was magical and our guide was excellent.',
      date: '2 days ago',
    },
    {
      name: 'Mike Chen',
      rating: 5,
      text: 'Perfect for beginners. Felt safe the whole time and the beach views were incredible.',
      date: '1 week ago',
    },
    {
      name: 'Emma Davis',
      rating: 5,
      text: 'Swimming with the horses was unforgettable. Highly recommend this tour!',
      date: '2 weeks ago',
    },
  ];

  return (
    <section className='py-16 px-4 bg-gray-50'>
      <div className='max-w-5xl mx-auto'>
        <div className='text-center mb-10'>
          <h2 className='text-3xl font-bold mb-3 text-gray-800'>
            What Riders Say
          </h2>
          <div className='flex justify-center items-center gap-1'>
            {[...Array(5)].map((_, i) => (
              <Star key={i} className='w-5 h-5 fill-amber-400 text-amber-400' />
            ))}
            <span className='ml-2 text-gray-600'>4.9 from 847 reviews</span>
          </div>
        </div>

        <div className='grid md:grid-cols-3 gap-6'>
          {reviews.map((review, idx) => (
            <div key={idx} className='bg-white rounded-xl p-6'>
              <div className='flex gap-1 mb-3'>
                {[...Array(review.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className='w-4 h-4 fill-amber-400 text-amber-400'
                  />
                ))}
              </div>
              <p className='text-gray-700 mb-4'>"{review.text}"</p>
              <div className='flex justify-between items-center text-sm'>
                <span className='font-medium text-gray-800'>{review.name}</span>
                <span className='text-gray-500'>{review.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Adventure Banner Section
const AdventureBanner = ({ onBookClick }) => {
  return (
    <section className='relative py-24 overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50'>
      <div className='max-w-6xl mx-auto px-4'>
        <div className='grid lg:grid-cols-2 gap-12 items-center'>
          {/* Left Content */}
          <div>
            <h2 className='text-3xl md:text-4xl font-bold text-gray-800 mb-6'>
              Why Choose Our
              <span className='text-amber-500'> Horseback Adventure?</span>
            </h2>

            <div className='space-y-4'>
              <div className='flex items-start gap-3'>
                <div className='w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-1'>
                  <Check className='w-4 h-4 text-amber-600' />
                </div>
                <div>
                  <h3 className='font-semibold text-gray-800 mb-1'>
                    Expert Local Guides
                  </h3>
                  <p className='text-gray-600'>
                    Our bilingual guides know every trail and ensure your safety
                    and enjoyment throughout the journey.
                  </p>
                </div>
              </div>

              <div className='flex items-start gap-3'>
                <div className='w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-1'>
                  <Check className='w-4 h-4 text-amber-600' />
                </div>
                <div>
                  <h3 className='font-semibold text-gray-800 mb-1'>
                    Well-Trained Horses
                  </h3>
                  <p className='text-gray-600'>
                    Our horses are gentle, well-cared for, and perfectly trained
                    for beach riding.
                  </p>
                </div>
              </div>

              <div className='flex items-start gap-3'>
                <div className='w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-1'>
                  <Check className='w-4 h-4 text-amber-600' />
                </div>
                <div>
                  <h3 className='font-semibold text-gray-800 mb-1'>
                    Stunning Locations
                  </h3>
                  <p className='text-gray-600'>
                    Ride through pristine beaches, crystal-clear rivers, and
                    tropical landscapes.
                  </p>
                </div>
              </div>

              <div className='flex items-start gap-3'>
                <div className='w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-1'>
                  <Check className='w-4 h-4 text-amber-600' />
                </div>
                <div>
                  <h3 className='font-semibold text-gray-800 mb-1'>
                    All-Inclusive Experience
                  </h3>
                  <p className='text-gray-600'>
                    Transportation, equipment, and refreshments all included in
                    one price.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={onBookClick}
              className='mt-8 bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105'
            >
              Reserve Your Spot Today
            </button>
          </div>

          {/* Right Image */}
          <div className='relative'>
            <div className='rounded-2xl overflow-hidden shadow-2xl'>
              <img
                src='https://puntacanaexcursions.online/wp-content/uploads/2024/07/image00014-scaled.jpeg'
                alt='Happy rider with horse'
                className='w-full h-[400px] object-cover'
              />
            </div>
            {/* Floating Badge */}
            <div className='absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-4'>
              <div className='flex items-center gap-3'>
                <div className='w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center'>
                  <Star className='w-6 h-6 text-amber-500' />
                </div>
                <div>
                  <p className='text-2xl font-bold text-gray-800'>4.9</p>
                  <p className='text-xs text-gray-600'>847+ Reviews</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Main Component
const HorseBackRidingServiceView: React.FC<HorseBackRidingServiceViewProps> = ({
  service,
  serviceData,
  viewContext,
}) => {
  const { t } = useTranslation();
  const { bookService } = useBooking();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('');

  const handleBookingConfirm = (
    service: Service,
    dates: BookingDate,
    guests: number
  ) => {
    bookService(service, dates, guests);
    setIsModalOpen(false);
  };

  const handleBookNow = () => {
    setIsModalOpen(true);
  };

  const handleLocationSelect = (locationId: string) => {
    setSelectedLocation(selectedLocation === locationId ? '' : locationId);
  };

  return (
    <div className='min-h-screen bg-white'>
      <HeroSection onBookClick={handleBookNow} />
      <PhotoGallery />
      <QuickInfoSection />
      <IncludesSection />
      <SpecialBanner onBookClick={handleBookNow} />
      <AdventureBanner onBookClick={handleBookNow} />
      <TrustBadges />
      <ReviewsSection />

      {/* Floating Action Button */}
      <div className='fixed bottom-8 right-8 z-50'>
        <button
          onClick={handleBookNow}
          className='group bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white p-4 rounded-full shadow-2xl hover:shadow-amber-500/25 transition-all duration-300 hover:scale-110'
        >
          <Mountain className='w-6 h-6 group-hover:scale-110 transition-transform' />
        </button>
      </div>

      {/* Booking Modal */}
      {isModalOpen && (
        <BookingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleBookingConfirm}
          service={service}
        />
      )}
    </div>
  );
};

export default HorseBackRidingServiceView;
