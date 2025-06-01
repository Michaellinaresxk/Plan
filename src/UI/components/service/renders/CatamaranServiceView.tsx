import React, { useState } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { Service } from '@/types/type';
import { ServiceData } from '@/types/services';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Ship,
  Users,
  Clock,
  Utensils,
  Calendar,
  Camera,
  ArrowRight,
  Star,
  Check,
  ChevronRight,
  ChevronLeft,
  Droplets,
  LifeBuoy,
  AlertCircle,
  MapPin,
  CreditCard,
} from 'lucide-react';
import { useBooking } from '@/context/BookingContext';
import { BookingDate } from '@/types/type';
import BookingModal from '@/UI/components/modal/BookingModal';

interface CatamaranServiceViewProps {
  service: Service;
  serviceData?: ServiceData;
  primaryColor: string;
}

const CatamaranServiceView: React.FC<CatamaranServiceViewProps> = ({
  service,
  serviceData,
  primaryColor,
}) => {
  const { t } = useTranslation();
  const { bookService } = useBooking();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Service type detection
  const isPremium = service.packageType.includes('premium');
  const isPrivate = service.id.includes('private');

  // Essential data extraction
  const capacity = serviceData?.metaData?.capacity || (isPrivate ? '19' : '40');
  const duration = serviceData?.metaData?.travelTime || '4-6 hours';

  // Gallery images - reduced to essential shots
  const galleryImages = [
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

  // Key highlights - focused on main benefits
  const highlights = [
    {
      icon: Ship,
      title: isPrivate ? 'Private Charter' : 'Premium Vessel',
      description: isPrivate
        ? 'Exclusive use for your group'
        : 'Modern catamaran with all amenities',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: LifeBuoy,
      title: 'All Equipment',
      description: 'Snorkeling gear & safety equipment included',
      color: 'from-emerald-500 to-teal-500',
    },
    {
      icon: Utensils,
      title: 'Food & Drinks',
      description: isPremium
        ? 'Gourmet buffet & premium bar'
        : 'Tropical buffet & open bar',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: Users,
      title: `Up to ${capacity} Guests`,
      description: 'Perfect for groups & families',
      color: 'from-purple-500 to-pink-500',
    },
  ];

  // Essential activities
  const activities = [
    { name: 'Snorkeling', icon: '🤿' },
    { name: 'Swimming', icon: '🏊‍♀️' },
    { name: 'Beach Visits', icon: '🏖️' },
    { name: 'Sunbathing', icon: '☀️' },
    { name: 'Photography', icon: '📸' },
    { name: 'Open Bar', icon: '🍹' },
  ];

  // Time slots
  const timeSlots = [
    { time: '8:30 AM', label: 'Morning Adventure', popular: false },
    { time: '12:00 PM', label: 'Afternoon Escape', popular: false },
    { time: '3:30 PM', label: 'Sunset Experience', popular: true },
  ];

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const slideIn = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  };

  // Navigation functions
  const navigateImage = (direction: number) => {
    setCurrentImageIndex((prev) => {
      const newIndex = prev + direction;
      if (newIndex < 0) return galleryImages.length - 1;
      if (newIndex >= galleryImages.length) return 0;
      return newIndex;
    });
  };

  const handleBookingConfirm = (
    service: Service,
    dates: BookingDate,
    guests: number
  ) => {
    bookService(service, dates, guests);
    setIsModalOpen(false);
  };

  return (
    <div className='space-y-12 max-w-7xl mx-auto'>
      {/* Hero Section with Image Slider */}
      <motion.div
        className='relative overflow-hidden rounded-3xl shadow-2xl h-[70vh]'
        initial='hidden'
        animate='visible'
        variants={fadeIn}
      >
        <div className='relative h-full'>
          <Image
            src={galleryImages[currentImageIndex].src}
            alt={galleryImages[currentImageIndex].alt}
            fill
            className='object-cover transition-opacity duration-700'
            priority
          />

          {/* Gradient Overlay */}
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
            {galleryImages.map((_, index) => (
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
              {/* Badge */}
              <motion.div
                className='inline-flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 mb-6'
                variants={slideIn}
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
                {galleryImages[currentImageIndex].title}
              </motion.h1>

              <motion.p
                className='text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto'
                variants={fadeIn}
              >
                Discover paradise aboard our luxury catamaran. Explore pristine
                beaches, snorkel in crystal waters, and create unforgettable
                memories.
              </motion.p>

              {/* Quick Stats */}
              <motion.div
                className='flex flex-wrap justify-center gap-6 mb-8'
                variants={slideIn}
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
                className='bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-3 mx-auto transition-all duration-300 hover:scale-105 shadow-lg'
                variants={slideIn}
              >
                Book Your Adventure
                <ArrowRight className='w-5 h-5' />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Key Highlights */}
      <motion.div
        className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'
        initial='hidden'
        animate='visible'
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
        }}
      >
        {highlights.map((highlight, index) => (
          <motion.div
            key={index}
            className='group relative overflow-hidden rounded-2xl p-6 text-white cursor-pointer'
            variants={fadeIn}
            whileHover={{ scale: 1.05 }}
          >
            {/* Gradient Background */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${highlight.color} opacity-90 group-hover:opacity-100 transition-opacity`}
            />

            {/* Content */}
            <div className='relative z-10'>
              <highlight.icon className='w-8 h-8 mb-4' />
              <h3 className='text-lg font-bold mb-2'>{highlight.title}</h3>
              <p className='text-sm opacity-90'>{highlight.description}</p>
            </div>

            {/* Hover Effect */}
            <div className='absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity' />
          </motion.div>
        ))}
      </motion.div>

      {/* Activities Grid */}
      <motion.div
        className='bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-8'
        initial='hidden'
        animate='visible'
        variants={fadeIn}
      >
        <div className='text-center mb-8'>
          <h2 className='text-3xl font-bold text-gray-800 mb-4'>
            What's Included
          </h2>
          <p className='text-gray-600 text-lg'>
            Everything you need for the perfect day at sea
          </p>
        </div>

        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6'>
          {activities.map((activity, index) => (
            <motion.div
              key={index}
              className='bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-shadow'
              variants={slideIn}
            >
              <div className='text-3xl mb-2'>{activity.icon}</div>
              <p className='font-medium text-gray-800 text-sm'>
                {activity.name}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Time Slots */}
      <motion.div
        className='bg-white rounded-3xl shadow-lg p-8'
        initial='hidden'
        animate='visible'
        variants={fadeIn}
      >
        <div className='text-center mb-8'>
          <h2 className='text-3xl font-bold text-gray-800 mb-4'>
            Choose Your Departure
          </h2>
          <p className='text-gray-600'>
            Select the perfect time for your adventure
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {timeSlots.map((slot, index) => (
            <motion.div
              key={index}
              className={`relative overflow-hidden rounded-xl border-2 p-6 cursor-pointer transition-all duration-300 ${
                slot.popular
                  ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                  : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
              }`}
              variants={slideIn}
              onClick={() => setIsModalOpen(true)}
            >
              {slot.popular && (
                <div className='absolute top-0 right-0 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-1 text-xs font-bold rounded-bl-lg'>
                  Most Popular
                </div>
              )}

              <div className='text-center'>
                <h3 className='text-2xl font-bold text-gray-800 mb-2'>
                  {slot.time}
                </h3>
                <p className='text-gray-600 mb-4'>{slot.label}</p>
                <button
                  className={`w-full py-2 rounded-lg font-medium transition-colors ${
                    slot.popular
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  Select Time
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* What to Expect */}
      <motion.div
        className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'
        initial='hidden'
        animate='visible'
        variants={fadeIn}
      >
        <div>
          <h2 className='text-3xl font-bold text-gray-800 mb-6'>
            {isPrivate
              ? 'Your Private Paradise'
              : 'An Unforgettable Experience'}
          </h2>
          <div className='space-y-4 text-gray-700'>
            <p className='text-lg'>
              {isPrivate
                ? 'Enjoy complete privacy aboard our luxury catamaran with personalized service just for your group.'
                : 'Sail through crystal-clear Caribbean waters, discover hidden beaches, and snorkel among vibrant coral reefs.'}
            </p>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-6'>
              <div className='flex items-center'>
                <Check className='w-5 h-5 text-green-500 mr-3' />
                <span>Professional crew</span>
              </div>
              <div className='flex items-center'>
                <Check className='w-5 h-5 text-green-500 mr-3' />
                <span>Safety equipment</span>
              </div>
              <div className='flex items-center'>
                <Check className='w-5 h-5 text-green-500 mr-3' />
                <span>Snorkeling gear</span>
              </div>
              <div className='flex items-center'>
                <Check className='w-5 h-5 text-green-500 mr-3' />
                <span>Open bar & food</span>
              </div>
            </div>
          </div>
        </div>

        <div className='relative h-[400px] rounded-2xl overflow-hidden shadow-xl'>
          <Image
            src='https://images.unsplash.com/photo-1548574505-5e239809ee19?q=80&w=1200'
            alt='Catamaran deck experience'
            fill
            className='object-cover'
          />
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        className='bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl p-8 md:p-12 text-center text-white'
        initial='hidden'
        animate='visible'
        variants={fadeIn}
      >
        <h2 className='text-3xl md:text-4xl font-bold mb-4'>
          Ready to Set Sail?
        </h2>
        <p className='text-xl text-blue-100 mb-8 max-w-2xl mx-auto'>
          Book your catamaran adventure today and create memories that will last
          a lifetime
        </p>

        <div className='flex flex-col md:flex-row gap-4 justify-center items-center'>
          <div className='text-left'>
            <div className='text-3xl font-bold'>${service.price}</div>
            <div className='text-blue-200 text-sm'>per person</div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className='bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-3 hover:bg-blue-50 transition-colors shadow-lg'
          >
            <CreditCard className='w-5 h-5' />
            Book Now
          </button>
        </div>
      </motion.div>

      {/* Important Notice */}
      <motion.div
        className='bg-amber-50 border border-amber-200 rounded-xl p-6'
        initial='hidden'
        animate='visible'
        variants={fadeIn}
      >
        <div className='flex items-start'>
          <AlertCircle className='w-6 h-6 text-amber-500 mr-3 flex-shrink-0 mt-0.5' />
          <div>
            <h3 className='font-semibold text-amber-800 mb-2'>
              Important Information
            </h3>
            <p className='text-amber-700'>
              Tours are weather dependent. We recommend booking 24 hours in
              advance. Full refund or rescheduling available for weather
              cancellations.
            </p>
          </div>
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

export default CatamaranServiceView;
