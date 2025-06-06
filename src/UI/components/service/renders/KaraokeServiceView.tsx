import React, { useState, useCallback, useMemo } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { Service } from '@/types/type';
import { ServiceData } from '@/types/services';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useBooking } from '@/context/BookingContext';
import { BookingDate } from '@/types/type';
import BookingModal from '../../modal/BookingModal';
import {
  Music,
  Mic,
  Users,
  Clock,
  Star,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Play,
  Heart,
} from 'lucide-react';

interface KaraokeServiceViewProps {
  service: Service;
  serviceData?: ServiceData;
  primaryColor?: string;
  viewContext?: 'standard-view' | 'premium-view';
}

// Constants
const EXPERIENCES = [
  {
    id: 'classic',
    name: 'Classic Karaoke',
    description: 'Traditional karaoke with all your favorite hits',
    duration: '2-4 hours',
    capacity: '2-20 people',
    icon: <Music className='w-6 h-6' />,
  },
  {
    id: 'family',
    name: 'Family Sessions',
    description: 'Kid-friendly songs perfect for family time',
    duration: '1-3 hours',
    capacity: '4-15 people',
    icon: <Users className='w-6 h-6' />,
  },
  {
    id: 'party',
    name: 'Party Mode',
    description: 'High-energy celebration with dance hits',
    duration: '3-5 hours',
    capacity: '6-25 people',
    icon: <Heart className='w-6 h-6' />,
  },
];

const GALLERY_IMAGES = [
  {
    src: 'https://images.pexels.com/photos/2531728/pexels-photo-2531728.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&dpr=2',
    alt: 'Friends singing karaoke together',
    caption: 'Sing, Laugh & Make Memories',
  },
  {
    src: 'https://images.pexels.com/photos/7097462/pexels-photo-7097462.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&dpr=2',
    alt: 'Professional karaoke setup',
    caption: 'Professional Equipment for Maximum Fun',
  },
  {
    src: 'https://images.pexels.com/photos/1154189/pexels-photo-1154189.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&dpr=2',
    alt: 'Family karaoke party',
    caption: 'Perfect for All Ages & Occasions',
  },
];

const TESTIMONIALS = [
  {
    id: '1',
    quote:
      'Amazing experience! The setup was professional and everyone had a blast singing their hearts out.',
    author: 'Sarah M.',
    occasion: 'Birthday Party',
    rating: 5,
  },
  {
    id: '2',
    quote:
      'Perfect for our family reunion. Even the grandparents joined in for some classic hits!',
    author: 'Mike R.',
    occasion: 'Family Event',
    rating: 5,
  },
  {
    id: '3',
    quote:
      "Best party entertainment we've ever had. The song selection was incredible!",
    author: 'Jessica L.',
    occasion: 'Celebration',
    rating: 5,
  },
];

const FEATURES = [
  { icon: <Mic className='w-5 h-5' />, text: 'Professional sound system' },
  {
    icon: <Play className='w-5 h-5' />,
    text: '4K display with scrolling lyrics',
  },
  {
    icon: <Music className='w-5 h-5' />,
    text: '3000+ songs in multiple languages',
  },
  { icon: <Clock className='w-5 h-5' />, text: 'Quick 15-minute setup' },
  { icon: <Users className='w-5 h-5' />, text: 'Perfect for any group size' },
];

// Custom hook for gallery navigation
const useGallery = (imagesLength: number) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const navigate = useCallback(
    (direction: number) => {
      setCurrentIndex((prev) => {
        const newIndex = prev + direction;
        return newIndex < 0
          ? imagesLength - 1
          : newIndex >= imagesLength
          ? 0
          : newIndex;
      });
    },
    [imagesLength]
  );

  return { currentIndex, navigate, setCurrentIndex };
};

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const KaraokeServiceView: React.FC<KaraokeServiceViewProps> = ({
  service,
  serviceData,
  primaryColor = 'gray',
  viewContext = 'standard-view',
}) => {
  const { t } = useTranslation();
  const { bookService } = useBooking();
  const { currentIndex, navigate, setCurrentIndex } = useGallery(
    GALLERY_IMAGES.length
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const averageRating = useMemo(
    () =>
      TESTIMONIALS.reduce((sum, t) => sum + t.rating, 0) / TESTIMONIALS.length,
    []
  );

  const handleBooking = useCallback(
    async (service: Service, dates: BookingDate, guests: number) => {
      try {
        setIsLoading(true);
        await bookService(service, dates, guests);
        setIsModalOpen(false);
      } catch (error) {
        console.error('Booking failed:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [bookService]
  );

  return (
    <div className='min-h-screen bg-white'>
      {/* Hero Section */}
      <section className='relative h-screen overflow-hidden'>
        <div className='absolute inset-0'>
          <AnimatePresence mode='wait'>
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className='relative w-full h-full'
            >
              <Image
                src={GALLERY_IMAGES[currentIndex].src}
                alt={GALLERY_IMAGES[currentIndex].alt}
                fill
                className='object-cover'
                priority={currentIndex === 0}
              />
              <div className='absolute inset-0 bg-black/40' />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className='absolute inset-0 flex items-center justify-between px-8 z-10'>
          <button
            onClick={() => navigate(-1)}
            className='w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-colors'
          >
            <ChevronLeft className='w-6 h-6' />
          </button>
          <button
            onClick={() => navigate(1)}
            className='w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-colors'
          >
            <ChevronRight className='w-6 h-6' />
          </button>
        </div>

        {/* Slide indicators */}
        <div className='absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20'>
          {GALLERY_IMAGES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? 'bg-white w-8' : 'bg-white/50'
              }`}
            />
          ))}
        </div>

        {/* Hero content */}
        <div className='absolute inset-0 flex items-center justify-center z-20'>
          <div className='text-center max-w-4xl px-6'>
            <motion.div
              className='inline-block bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 mb-6'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className='text-white font-medium'>
                {GALLERY_IMAGES[currentIndex].caption}
              </span>
            </motion.div>

            <motion.h1
              className='text-5xl md:text-7xl font-bold text-white mb-6'
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Karaoke Experience
              <br />
              <span className='text-gray-300'>At Your Villa</span>
            </motion.h1>

            <motion.p
              className='text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto'
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              Professional karaoke setup delivered to your location. Perfect for
              celebrations, family nights, and creating unforgettable memories.
            </motion.p>

            <motion.div
              className='flex flex-col sm:flex-row gap-4 justify-center'
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <button
                onClick={() => setIsModalOpen(true)}
                disabled={isLoading}
                className='bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-lg font-semibold text-lg flex items-center gap-3 transition-colors disabled:opacity-50'
              >
                {isLoading ? (
                  <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-white' />
                ) : (
                  <>
                    Book Your Experience
                    <ArrowRight className='w-5 h-5' />
                  </>
                )}
              </button>
              <button className='border-2 border-white/30 hover:border-white text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors'>
                Learn More
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Experience Types */}
      <section className='py-20 px-6 bg-gray-50'>
        <div className='max-w-6xl mx-auto'>
          <motion.div
            className='text-center mb-16'
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
              Choose Your Experience
            </h2>
            <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
              Each celebration is unique. Select the perfect karaoke experience
              for your group.
            </p>
          </motion.div>

          <motion.div
            className='grid md:grid-cols-3 gap-8'
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
            variants={stagger}
          >
            {EXPERIENCES.map((experience) => (
              <motion.div
                key={experience.id}
                className={`p-8 rounded-2xl cursor-pointer transition-all duration-300 ${
                  selectedExperience === experience.id
                    ? 'bg-gray-900 text-white shadow-xl scale-105'
                    : 'bg-white border border-gray-200 hover:shadow-lg hover:border-gray-300'
                }`}
                variants={fadeInUp}
                whileHover={{ y: -4 }}
                onClick={() =>
                  setSelectedExperience(
                    selectedExperience === experience.id ? '' : experience.id
                  )
                }
              >
                <div className='mb-6'>{experience.icon}</div>
                <h3 className='text-2xl font-bold mb-4'>{experience.name}</h3>
                <p className='text-lg mb-6 opacity-90'>
                  {experience.description}
                </p>
                <div className='space-y-2 text-sm opacity-75'>
                  <div className='flex items-center gap-2'>
                    <Clock className='w-4 h-4' />
                    {experience.duration}
                  </div>
                  <div className='flex items-center gap-2'>
                    <Users className='w-4 h-4' />
                    {experience.capacity}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className='py-20 px-6'>
        <div className='max-w-6xl mx-auto'>
          <motion.div
            className='text-center mb-16'
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
              Professional Setup
            </h2>
            <p className='text-xl text-gray-600'>
              Everything you need for an amazing karaoke experience
            </p>
          </motion.div>

          <motion.div
            className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
            variants={stagger}
          >
            {FEATURES.map((feature, index) => (
              <motion.div
                key={index}
                className='flex items-center gap-4 p-6 bg-gray-50 rounded-xl'
                variants={fadeInUp}
              >
                <div className='text-gray-600'>{feature.icon}</div>
                <span className='text-lg font-medium text-gray-900'>
                  {feature.text}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className='py-20 px-6 bg-gray-50'>
        <div className='max-w-6xl mx-auto'>
          <motion.div
            className='text-center mb-16'
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
              What Our Clients Say
            </h2>
            <div className='flex items-center justify-center gap-2 text-xl text-gray-600'>
              <Star className='w-6 h-6 text-yellow-400 fill-current' />
              <span>
                {averageRating.toFixed(1)} stars from verified customers
              </span>
            </div>
          </motion.div>

          <motion.div
            className='grid md:grid-cols-3 gap-8'
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
            variants={stagger}
          >
            {TESTIMONIALS.map((testimonial) => (
              <motion.div
                key={testimonial.id}
                className='bg-white p-8 rounded-2xl shadow-sm border border-gray-100'
                variants={fadeInUp}
                whileHover={{ y: -4 }}
              >
                <div className='flex mb-4'>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className='w-5 h-5 text-yellow-400 fill-current'
                    />
                  ))}
                </div>
                <blockquote className='text-gray-700 text-lg italic mb-6'>
                  "{testimonial.quote}"
                </blockquote>
                <div>
                  <cite className='text-gray-900 font-semibold not-italic'>
                    {testimonial.author}
                  </cite>
                  <div className='text-gray-500 text-sm'>
                    {testimonial.occasion}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-20 px-6 bg-gray-900 text-white'>
        <div className='max-w-4xl mx-auto text-center'>
          <motion.div
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className='text-4xl md:text-5xl font-bold mb-6'>
              Ready to Create Memories?
            </h2>
            <p className='text-xl text-gray-300 mb-8 max-w-2xl mx-auto'>
              Don't let another celebration pass without the joy of karaoke.
              Book your professional setup today.
            </p>

            <div className='flex flex-col sm:flex-row gap-4 justify-center items-center mb-8'>
              <div className='text-center'>
                <div className='text-3xl font-bold'>
                  ${service.price || 'Contact'}
                </div>
                <div className='text-gray-400'>Complete setup included</div>
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                disabled={isLoading}
                className='bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg flex items-center gap-3 transition-colors disabled:opacity-50'
              >
                {isLoading ? (
                  <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900' />
                ) : (
                  <>
                    Book Your Karaoke Experience
                    <ArrowRight className='w-5 h-5' />
                  </>
                )}
              </button>
            </div>

            <div className='flex flex-wrap justify-center gap-6 text-gray-400'>
              <div className='flex items-center gap-2'>
                <CheckCircle className='w-5 h-5 text-green-400' />
                <span>15-minute setup</span>
              </div>
              <div className='flex items-center gap-2'>
                <CheckCircle className='w-5 h-5 text-green-400' />
                <span>Professional equipment</span>
              </div>
              <div className='flex items-center gap-2'>
                <CheckCircle className='w-5 h-5 text-green-400' />
                <span>Satisfaction guaranteed</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Booking Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <BookingModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConfirm={handleBooking}
            service={service}
            selectedExperience={selectedExperience}
            isLoading={isLoading}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default KaraokeServiceView;
