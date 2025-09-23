import React, { useState, useEffect, useCallback } from 'react';
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
  Camera,
  Coffee,
  Trees,
  Shirt,
  Eye,
  Bug,
  AlertTriangle,
  Info,
  Scale,
  Globe,
  Droplets,
  Navigation,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface HorseBackRidingServiceViewProps {
  service: Service;
  serviceData?: ServiceData;
  primaryColor: string;
  viewContext?: 'standard-view' | 'premium-view';
}

interface BookingActions {
  onBookClick: () => void;
  service: Service;
}

// Itinerary data
const ITINERARY_STEPS = [
  {
    id: 1,
    icon: Info,
    title: 'Safety Briefing',
    description: 'Learn horse riding basics and safety instructions',
  },
  {
    id: 2,
    icon: Coffee,
    title: 'Courtesy Stop',
    description: 'Taste Dominican coffee, mamajuana, and enjoy shopping',
  },
  {
    id: 3,
    icon: Trees,
    title: 'Forest Trail',
    description: 'Ride through tropical forest to reach the river mouth',
  },
  {
    id: 4,
    icon: Waves,
    title: 'River Recreation',
    description: 'Enjoy recreation time at the beautiful river',
  },
  {
    id: 5,
    icon: Sun,
    title: 'Macao Beach',
    description: 'Experience the pristine Macao Beach',
  },
  {
    id: 6,
    icon: Droplets,
    title: 'Beach Swimming',
    description: 'Optional swimming and beach time',
  },
  {
    id: 7,
    icon: Navigation,
    title: 'Return Journey',
    description: 'Return to the ranch for transportation back',
  },
];

// What to bring data
const WHAT_TO_BRING = [
  {
    icon: Shirt,
    title: 'Comfortable Clothing',
    description: 'Light, breathable clothes',
  },
  {
    icon: Shield,
    title: 'Closed-toe Shoes',
    description: 'Sneakers or boots required',
  },
  {
    icon: Bug,
    title: 'Mosquito Repellent',
    description: 'Essential protection',
  },
  {
    icon: Eye,
    title: 'Sunglasses',
    description: 'Eye protection',
  },
];

// Restrictions data
const RESTRICTIONS_INFO = [
  {
    icon: Baby,
    title: 'Age Requirements',
    items: [
      '6+ years can ride alone',
      '3-5 years with adult',
      'Under 3 not recommended',
    ],
  },
  {
    icon: Scale,
    title: 'Weight Limit',
    items: ['Maximum: 300 lbs (136 kg)', 'Weight verification required'],
  },
  {
    icon: AlertTriangle,
    title: 'Health Restrictions',
    items: [
      'Not for pregnant women',
      'No back/neck problems',
      'Heart conditions need clearance',
    ],
  },
  {
    icon: Globe,
    title: 'Language & Safety',
    items: [
      'English-speaking guides',
      'Safety helmets provided',
      'Professional supervision',
    ],
  },
];

// Hero Section Component
const HeroSection: React.FC<BookingActions> = ({ onBookClick }) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className='relative h-screen min-h-[600px] md:min-h-[700px] overflow-hidden'>
      <div
        className='absolute inset-0'
        style={{ transform: `translateY(${scrollY * 0.3}px)` }}
      >
        <img
          src='https://res.cloudinary.com/ddg92xar5/image/upload/v1755946813/Imagen_de_WhatsApp_2024-06-03_a_las_15.47.17_45e97ed7_uoutrp.jpg'
          alt='Horseback riding at Macao Beach'
          className='w-full h-full object-cover'
        />
        <div className='absolute inset-0 bg-black/40' />
        <div className='absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/70' />
      </div>

      <div className='relative z-10 h-full flex flex-col justify-end px-4 md:px-8 pb-30'>
        <div className='max-w-4xl mx-auto w-full'>
          <h1 className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 text-white'>
            Horseback Riding
            <span className='block text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-amber-400 mt-2'>
              Macao Beach
            </span>
          </h1>

          <p className='text-base sm:text-lg md:text-xl text-white/90 mb-8 md:mb-10 max-w-2xl'>
            Experience the magic of riding along pristine beaches. Perfect for
            all skill levels.
          </p>

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

          <div className='flex flex-wrap gap-6 text-white/80 text-sm sm:text-base'>
            <div className='flex items-center gap-2'>
              <Star className='w-4 h-4 text-amber-400 fill-amber-400' />
              <span>4.9 Rating</span>
            </div>
            <div className='flex items-center gap-2'>
              <Clock className='w-4 h-4' />
              <span>3 Hours</span>
            </div>
            <div className='flex items-center gap-2'>
              <Users className='w-4 h-4' />
              <span>All Levels</span>
            </div>
          </div>
        </div>
      </div>

      <div className='absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/50 animate-bounce'>
        <ChevronRight className='w-6 h-6 rotate-90' />
      </div>
    </div>
  );
};

// Gallery Section
const PhotoGallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const GALLERY_IMAGES = [
    {
      id: 1,
      src: 'https://puntacanaexcursions.online/wp-content/uploads/2024/08/image00011-1536x1017.jpeg',
      alt: 'Horse riding on tropical beach',
    },
    {
      id: 2,
      src: 'https://res.cloudinary.com/ddg92xar5/image/upload/v1755946814/Imagen_de_WhatsApp_2024-06-03_a_las_15.47.17_f9b60a74_l7xtfu.jpg',
      alt: 'Riders in tropical forest',
    },
    {
      id: 3,
      src: 'https://res.cloudinary.com/ddg92xar5/image/upload/v1755946811/image00043_s1jla3.jpg',
      alt: 'Beach horseback experience',
    },
    {
      id: 4,
      src: 'https://res.cloudinary.com/ddg92xar5/image/upload/v1755946864/image00002_krjl52.jpg',
      alt: 'Family horseback adventure',
    },
  ];

  return (
    <section className='py-20 bg-gradient-to-br from-slate-50 to-teal-50'>
      <div className='max-w-7xl mx-auto px-6'>
        <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6'>
          {GALLERY_IMAGES.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className='group relative cursor-pointer overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300'
              onClick={() => setSelectedImage(index)}
            >
              <div className='aspect-square overflow-hidden'>
                <img
                  src={image.src}
                  alt={image.alt}
                  className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-700'
                />
              </div>
              <div className='absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
              <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                <div className='bg-white/20 backdrop-blur-sm rounded-full p-2 md:p-3'>
                  <Camera className='w-4 h-4 md:w-6 md:h-6 text-white' />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Gallery Modal */}
        <AnimatePresence>
          {selectedImage !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50'
              onClick={() => setSelectedImage(null)}
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className='relative max-w-4xl w-full'
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={GALLERY_IMAGES[selectedImage].src}
                  alt={GALLERY_IMAGES[selectedImage].alt}
                  className='w-full h-auto rounded-2xl'
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className='absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2 text-white hover:bg-white/30 transition-colors'
                >
                  <X className='w-6 h-6' />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

// Quick Info Section Component
const QuickInfoSection: React.FC = () => {
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
      title: '3 Hours',
      description: 'Complete adventure experience',
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

// Trust Badges Component
const TrustBadges: React.FC = () => {
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

// Includes Section Component
const IncludesSection: React.FC = () => {
  const includes = [
    'Round-trip transportation',
    'Playa Macao experience',
    '3-hour adventure',
    'Shopping stop',
    'Scenic river visit',
    'Professional guide',
    'Safety equipment',
    'Forest trail ride',
  ];

  return (
    <section className='py-16 px-4 bg-white'>
      <div className='max-w-3xl mx-auto'>
        <h2 className='text-3xl font-bold text-center mb-10 text-gray-800'>
          Everything Included
        </h2>
        <div className='grid grid-cols-2 gap-4'>
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

// Compact Itinerary Section (2 columns)
const ItinerarySection: React.FC = () => {
  return (
    <section className='py-16 bg-gradient-to-br from-amber-50 to-orange-50'>
      <div className='max-w-6xl mx-auto px-4'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl font-bold text-gray-800 mb-4'>
            Your Adventure <span className='text-amber-500'>Itinerary</span>
          </h2>
          <p className='text-gray-600'>
            Approximately 3 hours of unforgettable experiences
          </p>
        </div>

        <div className='grid grid-cols-2 md:grid-cols-2 gap-6'>
          {ITINERARY_STEPS.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className='flex items-center gap-4 bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300'
              >
                <div className='w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0'>
                  <IconComponent className='w-6 h-6 text-amber-600' />
                </div>

                <div className='flex-grow'>
                  <div className='flex items-center gap-2 mb-1'>
                    <span className='bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full'>
                      {step.id}
                    </span>
                  </div>
                  <h3 className='font-semibold text-gray-800 text-sm mb-1'>
                    {step.title}
                  </h3>
                  <p className='text-gray-600 text-xs'>{step.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className='mt-8 text-center'>
          <div className='inline-flex items-center gap-2 bg-amber-100 px-4 py-2 rounded-full'>
            <Clock className='w-4 h-4 text-amber-600' />
            <span className='text-amber-800 font-medium text-sm'>
              Total Duration: ~3 hours
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

// Compact What to Bring & Restrictions Section (2 columns)
const InfoSection: React.FC = () => {
  return (
    <section className='py-16 bg-white'>
      <div className='max-w-6xl mx-auto px-4'>
        <div className='grid lg:grid-cols-2 gap-12'>
          {/* What to Bring */}
          <div>
            <h2 className='text-2xl font-bold text-gray-800 mb-6'>
              What to <span className='text-amber-500'>Bring</span>
            </h2>
            <div className='grid grid-cols-2 gap-4'>
              {WHAT_TO_BRING.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className='text-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors'
                  >
                    <div className='w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3'>
                      <IconComponent className='w-6 h-6 text-amber-600' />
                    </div>
                    <h3 className='font-semibold text-gray-800 text-sm mb-2'>
                      {item.title}
                    </h3>
                    <p className='text-gray-600 text-xs'>{item.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Restrictions */}
          <div>
            <h2 className='text-2xl font-bold text-gray-800 mb-6'>
              Important <span className='text-red-500'>Information</span>
            </h2>
            <div className='space-y-4'>
              {RESTRICTIONS_INFO.map((category, index) => {
                const IconComponent = category.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className='bg-gray-50 rounded-xl p-4'
                  >
                    <div className='flex items-center gap-3 mb-3'>
                      <div className='w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center'>
                        <IconComponent className='w-4 h-4 text-red-600' />
                      </div>
                      <h3 className='font-semibold text-gray-800 text-sm'>
                        {category.title}
                      </h3>
                    </div>
                    <ul className='space-y-1'>
                      {category.items.map((item, itemIndex) => (
                        <li key={itemIndex} className='flex items-start gap-2'>
                          <Check className='w-3 h-3 text-green-500 flex-shrink-0 mt-0.5' />
                          <span className='text-gray-600 text-xs'>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Horse Disclaimer */}
        <div className='mt-12 bg-amber-50 rounded-2xl p-6 border border-amber-200'>
          <div className='flex items-start gap-4'>
            <Heart className='w-6 h-6 text-amber-600 flex-shrink-0 mt-1' />
            <div>
              <h3 className='text-lg font-semibold text-amber-800 mb-3'>
                About Our Dominican Horses
              </h3>
              <p className='text-amber-700 text-sm leading-relaxed mb-3'>
                Dominican horses are different from European horses - they're
                perfectly adapted to tropical climate and terrain. Our horses
                are well-cared for, regularly veterinarian-checked, and trained
                specifically for tourist activities.
              </p>
              <p className='text-amber-700 text-sm'>
                We follow all animal welfare standards and treat our horses with
                utmost respect and care.
              </p>
            </div>
          </div>
        </div>

        {/* Weather Note */}
        <div className='mt-6 bg-blue-50 rounded-xl p-4 border border-blue-200'>
          <div className='flex items-start gap-3'>
            <Info className='w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5' />
            <div>
              <h3 className='font-semibold text-blue-800 mb-1'>
                Weather Policy
              </h3>
              <p className='text-blue-700 text-sm'>
                Tours continue rain or shine! We only cancel in extreme weather
                conditions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Reviews Section Component
const ReviewsSection: React.FC = () => {
  const reviews = [
    {
      name: 'Sarah Johnson',
      rating: 5,
      text: 'Amazing experience! The ride was magical and our guide was excellent.',
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

// Adventure Banner Component
const AdventureBanner: React.FC<BookingActions> = ({ onBookClick }) => {
  return (
    <section className='relative py-24 overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50'>
      <div className='max-w-6xl mx-auto px-4'>
        <div className='grid lg:grid-cols-2 gap-12 items-center'>
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

          <div className='relative'>
            <div className='rounded-2xl overflow-hidden shadow-2xl'>
              <img
                src='https://puntacanaexcursions.online/wp-content/uploads/2024/07/image00014-scaled.jpeg'
                alt='Happy rider with horse'
                className='w-full h-[400px] object-cover'
              />
            </div>
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

// Special Banner Component
const SpecialBanner: React.FC<BookingActions> = ({ onBookClick }) => {
  return (
    <section className='relative py-32 overflow-hidden'>
      <div className='absolute inset-0'>
        <img
          src='https://res.cloudinary.com/ddg92xar5/image/upload/v1755946864/image00002_krjl52.jpg'
          alt='Horseback riding experience'
          className='w-full h-full object-cover'
        />
        <div className='absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent' />
      </div>

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

// Floating Action Button Component
const FloatingActionButton: React.FC<BookingActions> = ({ onBookClick }) => {
  return (
    <div className='fixed bottom-8 right-8 z-50'>
      <button
        onClick={onBookClick}
        className='group bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white p-4 rounded-full shadow-2xl hover:shadow-amber-500/25 transition-all duration-300 hover:scale-110'
      >
        <Mountain className='w-6 h-6 group-hover:scale-110 transition-transform' />
      </button>
    </div>
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

  const handleBookNow = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleBookingConfirm = useCallback(
    (service: Service, dates: BookingDate, guests: number) => {
      bookService(service, dates, guests);
      setIsModalOpen(false);
    },
    [bookService]
  );

  const bookingActions: BookingActions = {
    onBookClick: handleBookNow,
    service,
  };

  return (
    <div className='min-h-screen bg-white'>
      <HeroSection {...bookingActions} />
      <PhotoGallery />
      <QuickInfoSection />
      <IncludesSection />
      <ItinerarySection />
      <InfoSection />
      <SpecialBanner {...bookingActions} />
      <AdventureBanner {...bookingActions} />
      <TrustBadges />
      <ReviewsSection />

      {/* Floating Action Button */}
      <FloatingActionButton {...bookingActions} />

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
