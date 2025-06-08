import React, { useState, useCallback } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { Service } from '@/types/type';
import { ServiceData } from '@/types/services';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Ship,
  Users,
  Clock,
  Star,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  Check,
  Anchor,
  Waves,
  Sun,
  Camera,
  Calendar,
  Shield,
} from 'lucide-react';
import { useBooking } from '@/context/BookingContext';
import { BookingDate } from '@/types/type';
import BookingModal from '@/UI/components/modal/BookingModal';

interface LuxeYachtServiceViewProps {
  service: Service;
  serviceData?: ServiceData;
  primaryColor?: string;
}

// Constants
const GALLERY_IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1566416800269-eefb8666ae1b?q=80&w=1200',
    alt: 'Luxury catamaran sailing',
    title: 'Sail in Paradise',
  },
  {
    src: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?q=80&w=1200',
    alt: 'Catamaran deck experience',
    title: 'Spacious Comfort',
  },
  {
    src: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=1200',
    alt: 'Snorkeling adventure',
    title: 'Underwater Exploration',
  },
  {
    src: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200',
    alt: 'Beach paradise',
    title: 'Hidden Beaches',
  },
];

const TIME_SLOTS = [
  {
    time: '9:00 AM - 1:00 PM',
    label: 'Morning Adventure',
    popular: true,
    description: 'Perfect for families & early birds',
  },
  {
    time: '1:00 PM - 5:30 PM',
    label: 'Afternoon Escape',
    popular: false,
    description: 'Ideal for sunset lovers',
  },
];

const FEATURES = [
  {
    icon: <Anchor className='w-6 h-6' />,
    title: 'Premium Catamaran',
    description: 'Modern vessel with luxury amenities',
  },
  {
    icon: <Waves className='w-6 h-6' />,
    title: 'Snorkeling Included',
    description: 'Equipment & guided underwater tours',
  },
  {
    icon: <Sun className='w-6 h-6' />,
    title: 'All-Day Experience',
    description: 'Swimming, sunbathing & relaxation',
  },
  {
    icon: <Camera className='w-6 h-6' />,
    title: 'Photo Opportunities',
    description: 'Stunning backdrops & memories',
  },
];

const INCLUDED_ITEMS = [
  'Professional crew & captain',
  'Snorkeling equipment',
  'Open bar (beer, rum, soft drinks)',
  'Tropical lunch buffet',
  'Towels & safety equipment',
  'Hotel pickup & drop-off',
];

const TESTIMONIALS = [
  {
    name: 'Sarah & Mike',
    event: 'Honeymoon',
    quote:
      'Absolutely magical! The crew was incredible and the snorkeling was amazing.',
    rating: 5,
  },
  {
    name: 'The Johnson Family',
    event: 'Family Vacation',
    quote:
      'Perfect day for all ages. Kids loved the snorkeling, adults loved the relaxation.',
    rating: 5,
  },
  {
    name: 'Rebecca T.',
    event: 'Girls Trip',
    quote:
      'Best part of our Punta Cana trip! Great vibes, beautiful spots, amazing crew.',
    rating: 5,
  },
];

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const LuxeYachtServiceView: React.FC<LuxeYachtServiceViewProps> = ({
  service,
  serviceData,
  primaryColor = 'blue',
}) => {
  const { t } = useTranslation();
  const { bookService } = useBooking();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const isPremium = service.packageType.includes('premium');
  const isPrivate = service.id.includes('private');
  const capacity = serviceData?.metaData?.capacity || (isPrivate ? '19' : '40');
  const duration = serviceData?.metaData?.travelTime || '4-6 hours';

  const navigateImage = useCallback((direction: number) => {
    setCurrentImageIndex((prev) => {
      const newIndex = prev + direction;
      if (newIndex < 0) return GALLERY_IMAGES.length - 1;
      if (newIndex >= GALLERY_IMAGES.length) return 0;
      return newIndex;
    });
  }, []);

  const handleBookingConfirm = useCallback(
    (service: Service, dates: BookingDate, guests: number) => {
      bookService(service, dates, guests);
      setIsModalOpen(false);
    },
    [bookService]
  );

  return (
    <div className='max-w-7xl mx-auto px-6 py-8 space-y-16'>
      {/* Hero Section with Image Slider */}
      <motion.div
        className='relative overflow-hidden rounded-3xl shadow-2xl h-[70vh]'
        initial='hidden'
        animate='visible'
        variants={fadeIn}
      >
        <div className='relative h-full'>
          <Image
            src={GALLERY_IMAGES[currentImageIndex].src}
            alt={GALLERY_IMAGES[currentImageIndex].alt}
            fill
            className='object-cover transition-opacity duration-700'
            priority
          />

          <div className='absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-black/60' />

          {/* Navigation Arrows */}
          <button
            onClick={() => navigateImage(-1)}
            className='absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors'
          >
            <ChevronLeft className='w-6 h-6 text-white' />
          </button>

          <button
            onClick={() => navigateImage(1)}
            className='absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors'
          >
            <ChevronRight className='w-6 h-6 text-white' />
          </button>

          {/* Image Indicators */}
          <div className='absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2'>
            {GALLERY_IMAGES.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentImageIndex
                    ? 'bg-white scale-125'
                    : 'bg-white/50'
                }`}
              />
            ))}
          </div>

          {/* Content */}
          <div className='absolute inset-0 flex items-center justify-center text-center text-white p-8'>
            <div className='max-w-4xl'>
              <motion.div
                className='inline-flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 mb-6'
                variants={fadeIn}
              >
                <Ship className='w-5 h-5 mr-2' />
                <span className='font-semibold'>
                  {isPremium
                    ? 'Premium Experience'
                    : isPrivate
                    ? 'Private Charter'
                    : 'Caribbean Adventure'}
                </span>
              </motion.div>

              <motion.h1
                className='text-5xl md:text-6xl font-bold mb-6 leading-tight'
                variants={fadeIn}
              >
                {GALLERY_IMAGES[currentImageIndex].title}
              </motion.h1>

              <motion.p
                className='text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto'
                variants={fadeIn}
              >
                Discover paradise aboard our luxury catamaran. Explore pristine
                beaches, snorkel in crystal waters, and create unforgettable
                memories.
              </motion.p>

              <motion.div
                className='flex flex-wrap justify-center gap-6 mb-8'
                variants={fadeIn}
              >
                <div className='flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg'>
                  <Clock className='w-5 h-5 mr-2' />
                  <span>{duration}</span>
                </div>
                <div className='flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg'>
                  <Users className='w-5 h-5 mr-2' />
                  <span>Up to {capacity} guests</span>
                </div>
                <div className='flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg'>
                  <Star
                    className='w-5 h-5 mr-2 text-yellow-400'
                    fill='currentColor'
                  />
                  <span>5.0 (120+ reviews)</span>
                </div>
              </motion.div>

              <motion.button
                onClick={() => setIsModalOpen(true)}
                className='bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-3 mx-auto transition-colors shadow-lg'
                variants={fadeIn}
                whileHover={{ scale: 1.02 }}
              >
                Book Your Adventure
                <ArrowRight className='w-5 h-5' />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Choose Your Departure */}
      <motion.section
        className='space-y-8 gap-6'
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true }}
        variants={fadeIn}
      >
        <div className='text-center'>
          <h2 className='text-4xl font-bold text-white mb-4'>
            Choose Your Departure
          </h2>
          <p className='text-xl text-white/80'>
            Select the perfect time for your adventure
          </p>
        </div>

        <div className='grid md:grid-cols-2 gap-6'>
          {TIME_SLOTS.map((slot, index) => (
            <motion.div
              key={index}
              className={`relative overflow-hidden rounded-2xl border cursor-pointer transition-all duration-300 backdrop-blur-md ${
                slot.popular
                  ? 'border-white/30 bg-white/10 shadow-lg scale-105'
                  : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'
              }`}
              variants={fadeIn}
              onClick={() => setIsModalOpen(true)}
              whileHover={{ y: -4 }}
            >
              {slot.popular && (
                <div className='absolute top-0 right-0 bg-white text-gray-900 px-4 py-2 text-sm font-bold rounded-bl-2xl'>
                  Most Popular
                </div>
              )}

              <div className='text-center p-8'>
                <h3 className='text-2xl font-bold text-white mb-2'>
                  {slot.time}
                </h3>
                <p className='text-lg text-white/90 mb-2'>{slot.label}</p>
                <p className='text-white/70 mb-6'>{slot.description}</p>
                <button
                  className={`w-full py-3 rounded-xl font-semibold transition-colors ${
                    slot.popular
                      ? 'bg-white text-gray-900 hover:bg-gray-100'
                      : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
                  }`}
                >
                  Select Time
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* What's Included */}
      <motion.section
        className='bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-12'
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true }}
        variants={stagger}
      >
        <div className='text-center mb-12'>
          <h2 className='text-4xl font-bold text-white mb-4'>
            Everything You Need
          </h2>
          <p className='text-xl text-white/80'>
            Your complete catamaran experience
          </p>
        </div>

        <div className='grid md:grid-cols-2 gap-12 items-center'>
          <motion.div variants={fadeIn}>
            <h3 className='text-2xl font-bold text-white mb-6'>
              What's Included
            </h3>
            <div className='space-y-4'>
              {INCLUDED_ITEMS.map((item, index) => (
                <div key={index} className='flex items-center'>
                  <div className='w-6 h-6 bg-green-500/20 backdrop-blur-sm rounded-full flex items-center justify-center mr-4'>
                    <Check className='w-4 h-4 text-green-400' />
                  </div>
                  <span className='text-white/90'>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeIn} className='grid grid-cols-2 gap-6'>
            {FEATURES.map((feature, index) => (
              <div
                key={index}
                className='text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10'
              >
                <div className='w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-4 text-white'>
                  {feature.icon}
                </div>
                <h4 className='font-bold text-white mb-2'>{feature.title}</h4>
                <p className='text-sm text-white/70'>{feature.description}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Testimonials */}
      <motion.section
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true }}
        variants={fadeIn}
        className='bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-12'
      >
        <div className='text-center mb-12'>
          <h2 className='text-4xl font-bold text-white mb-4'>Guest Stories</h2>
          <p className='text-xl text-white/80'>
            Hear from travelers who sailed with us
          </p>
        </div>

        <div className='grid md:grid-cols-3 gap-8'>
          {TESTIMONIALS.map((testimonial, index) => (
            <div
              key={index}
              className='bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-8'
            >
              <div className='flex mb-4'>
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className='w-5 h-5 text-yellow-400 fill-current'
                  />
                ))}
              </div>
              <blockquote className='text-white/90 mb-6 leading-relaxed italic'>
                "{testimonial.quote}"
              </blockquote>
              <div>
                <cite className='text-white font-semibold not-italic'>
                  {testimonial.name}
                </cite>
                <div className='text-white/60 text-sm'>{testimonial.event}</div>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Safety & Comfort */}
      <motion.section
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true }}
        variants={fadeIn}
        className='grid md:grid-cols-2 gap-12 items-center'
      >
        <div className='relative h-96 rounded-2xl overflow-hidden'>
          <Image
            src='https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800'
            alt='Safety and comfort on catamaran'
            fill
            className='object-cover'
          />
          <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent' />
        </div>

        <div className='space-y-6'>
          <h2 className='text-4xl font-bold text-white'>
            Safety & Comfort First
          </h2>
          <p className='text-xl text-white/80 leading-relaxed'>
            Our experienced crew ensures your safety while you focus on creating
            memories. Modern catamarans with all safety equipment and
            comfortable amenities.
          </p>

          <div className='space-y-4'>
            <div className='flex items-center'>
              <Shield className='w-6 h-6 text-green-400 mr-3' />
              <span className='text-white/90'>Certified captain & crew</span>
            </div>
            <div className='flex items-center'>
              <Shield className='w-6 h-6 text-green-400 mr-3' />
              <span className='text-white/90'>Coast Guard approved vessel</span>
            </div>
            <div className='flex items-center'>
              <Shield className='w-6 h-6 text-green-400 mr-3' />
              <span className='text-white/90'>
                Life jackets & safety equipment
              </span>
            </div>
            <div className='flex items-center'>
              <Shield className='w-6 h-6 text-green-400 mr-3' />
              <span className='text-white/90'>
                Weather monitoring & contingency plans
              </span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Final CTA */}
      <motion.div
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true }}
        variants={fadeIn}
        className='bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 md:p-12 text-white text-center'
      >
        <h2 className='text-4xl font-bold mb-4'>Ready to Set Sail?</h2>
        <p className='text-xl text-white/80 mb-8 max-w-2xl mx-auto'>
          Book your catamaran adventure today and create memories that will last
          a lifetime
        </p>

        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
          <button
            onClick={() => setIsModalOpen(true)}
            className='bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-3 transition-colors mx-auto sm:mx-0'
          >
            <Calendar className='w-5 h-5' />
            Book Your Catamaran
            <ArrowRight className='w-5 h-5' />
          </button>
        </div>

        <div className='mt-8 text-white/60 text-sm space-y-1'>
          <p>🌊 Weather guarantee • 24h booking confirmation</p>
          <p>⚓ Professional crew • All equipment included</p>
        </div>
      </motion.div>

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

export default LuxeYachtServiceView;
