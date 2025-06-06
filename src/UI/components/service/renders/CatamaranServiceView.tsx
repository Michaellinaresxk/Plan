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
  Play,
  Waves,
  Sun,
  Fish,
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

  // Gallery images - modern catamaran experience
  const galleryImages = [
    {
      src: 'https://images.unsplash.com/photo-1566416800269-eefb8666ae1b?q=80&w=1200',
      alt: 'Luxury catamaran sailing',
      title: 'Sail in Paradise',
      subtitle: 'Experience the ultimate Caribbean adventure',
    },
    {
      src: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?q=80&w=1200',
      alt: 'Catamaran deck experience',
      title: 'Spacious Comfort',
      subtitle: 'Relax on our premium deck facilities',
    },
    {
      src: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=1200',
      alt: 'Snorkeling adventure',
      title: 'Underwater Exploration',
      subtitle: 'Discover vibrant marine life',
    },
    {
      src: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200',
      alt: 'Beach paradise',
      title: 'Hidden Beaches',
      subtitle: 'Visit secluded tropical paradises',
    },
  ];

  // Key highlights with modern styling
  const highlights = [
    {
      icon: Ship,
      title: isPrivate ? 'Private Charter' : 'Premium Vessel',
      description: isPrivate
        ? 'Exclusive use for your group'
        : 'Modern catamaran with luxury amenities',
      color: 'from-cyan-400 to-blue-500',
      bgColor: 'bg-cyan-500/10',
      iconColor: 'text-cyan-400',
    },
    {
      icon: LifeBuoy,
      title: 'All Equipment',
      description: 'Professional snorkeling gear & safety equipment',
      color: 'from-emerald-400 to-teal-500',
      bgColor: 'bg-emerald-500/10',
      iconColor: 'text-emerald-400',
    },
    {
      icon: Utensils,
      title: 'Gourmet Experience',
      description: isPremium
        ? 'Premium buffet & craft cocktails'
        : 'Fresh buffet & unlimited drinks',
      color: 'from-orange-400 to-red-500',
      bgColor: 'bg-orange-500/10',
      iconColor: 'text-orange-400',
    },
    {
      icon: Users,
      title: `Up to ${capacity} Guests`,
      description: 'Perfect for groups & celebrations',
      color: 'from-purple-400 to-pink-500',
      bgColor: 'bg-purple-500/10',
      iconColor: 'text-purple-400',
    },
  ];

  // Modern activity cards
  const activities = [
    { name: 'Snorkeling', icon: Fish, color: 'from-blue-400 to-cyan-400' },
    { name: 'Swimming', icon: Waves, color: 'from-cyan-400 to-teal-400' },
    { name: 'Beach Visits', icon: Sun, color: 'from-yellow-400 to-orange-400' },
    { name: 'Photography', icon: Camera, color: 'from-purple-400 to-pink-400' },
    {
      name: 'Open Bar',
      icon: Utensils,
      color: 'from-emerald-400 to-green-400',
    },
    { name: 'Music', icon: Play, color: 'from-indigo-400 to-purple-400' },
  ];

  // Time slots with modern design
  const timeSlots = [
    {
      time: '8:30 AM',
      endTime: '11:30 AM',
      label: 'Morning Adventure',
      popular: false,
      icon: Sun,
      description: 'Perfect for early birds',
    },
    {
      time: '11:30 AM',
      endTime: '2:30 PM',
      label: 'Afternoon Escape',
      popular: false,
      icon: Waves,
      description: 'Ideal weather conditions',
    },
    {
      time: '2:30 PM',
      endTime: '5:00 PM',
      label: 'Sunset Experience',
      popular: true,
      icon: Camera,
      description: 'Golden hour magic',
    },
  ];

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  const slideIn = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.1 } },
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
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900'>
      <div className='space-y-16 max-w-7xl mx-auto px-6 py-12'>
        {/* Hero Section with Modern Image Slider */}
        <motion.div
          className='relative overflow-hidden rounded-3xl h-[80vh] shadow-2xl'
          initial='hidden'
          animate='visible'
          variants={fadeIn}
        >
          <div className='relative h-full'>
            <Image
              src={galleryImages[currentImageIndex].src}
              alt={galleryImages[currentImageIndex].alt}
              fill
              className='object-cover transition-all duration-1000 ease-out'
              priority
            />

            {/* Modern Gradient Overlay */}
            <div className='absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-black/60' />

            {/* Floating Elements */}
            <div className='absolute top-6 left-6 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20'>
              <span className='text-white/90 text-sm font-medium'>
                Live Weather: Perfect
              </span>
            </div>

            {/* Navigation with modern styling */}
            <button
              onClick={() => navigateImage(-1)}
              className='absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 border border-white/20'
            >
              <ChevronLeft className='w-6 h-6 text-white' />
            </button>

            <button
              onClick={() => navigateImage(1)}
              className='absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 border border-white/20'
            >
              <ChevronRight className='w-6 h-6 text-white' />
            </button>

            {/* Modern Image Indicators */}
            <div className='absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3'>
              {galleryImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentImageIndex
                      ? 'w-8 h-3 bg-white'
                      : 'w-3 h-3 bg-white/50 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>

            {/* Hero Content with modern typography */}
            <div className='absolute inset-0 flex items-center justify-center text-center text-white p-8'>
              <div className='max-w-5xl'>
                <motion.div
                  className='inline-flex items-center bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 mb-8'
                  variants={slideIn}
                >
                  <Ship className='w-5 h-5 mr-3' />
                  <span className='font-semibold text-lg'>
                    {isPremium
                      ? 'Premium Experience'
                      : isPrivate
                      ? 'Private Charter'
                      : 'Caribbean Adventure'}
                  </span>
                </motion.div>

                <motion.h1
                  className='text-6xl md:text-7xl font-bold mb-6 leading-tight bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent'
                  variants={fadeIn}
                >
                  {galleryImages[currentImageIndex].title}
                </motion.h1>

                <motion.p
                  className='text-2xl md:text-3xl text-white/90 mb-4 font-light'
                  variants={fadeIn}
                >
                  {galleryImages[currentImageIndex].subtitle}
                </motion.p>

                <motion.p
                  className='text-lg text-white/80 mb-10 max-w-3xl mx-auto leading-relaxed'
                  variants={fadeIn}
                >
                  Discover paradise aboard our luxury catamaran. Explore
                  pristine beaches, snorkel in crystal waters, and create
                  unforgettable memories.
                </motion.p>

                {/* Modern Quick Stats */}
                <motion.div
                  className='flex flex-wrap justify-center gap-6 mb-10'
                  variants={stagger}
                  initial='hidden'
                  animate='visible'
                >
                  {[
                    { icon: Clock, text: duration, label: 'Duration' },
                    {
                      icon: Users,
                      text: `${capacity} guests`,
                      label: 'Capacity',
                    },
                    { icon: Star, text: '5.0 (120+)', label: 'Rating' },
                  ].map((stat, index) => (
                    <motion.div
                      key={index}
                      variants={slideIn}
                      className='flex items-center bg-white/10 backdrop-blur-md px-6 py-3 rounded-xl border border-white/20'
                    >
                      <stat.icon className='w-5 h-5 mr-3 text-blue-300' />
                      <div className='text-left'>
                        <div className='font-semibold'>{stat.text}</div>
                        <div className='text-xs text-white/70'>
                          {stat.label}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                <motion.button
                  onClick={() => setIsModalOpen(true)}
                  className='bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-10 py-5 rounded-2xl font-bold text-xl flex items-center gap-4 mx-auto transition-all duration-300 hover:scale-105 shadow-2xl backdrop-blur-sm'
                  variants={slideIn}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Your Adventure
                  <ArrowRight className='w-6 h-6' />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Modern Highlights Grid */}
        <motion.div
          className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'
          initial='hidden'
          animate='visible'
          variants={stagger}
        >
          {highlights.map((highlight, index) => (
            <motion.div
              key={index}
              className={`group relative overflow-hidden rounded-2xl ${highlight.bgColor} backdrop-blur-sm border border-white/10 p-8 text-white cursor-pointer hover:scale-105 transition-all duration-300`}
              variants={fadeIn}
            >
              <div
                className={`w-12 h-12 rounded-xl ${highlight.bgColor} flex items-center justify-center mb-6`}
              >
                <highlight.icon className={`w-6 h-6 ${highlight.iconColor}`} />
              </div>

              <h3 className='text-xl font-bold mb-3 text-white'>
                {highlight.title}
              </h3>
              <p className='text-white/80 leading-relaxed'>
                {highlight.description}
              </p>

              {/* Hover gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${highlight.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Modern Activities Section */}
        <motion.div
          className='bg-white/5 backdrop-blur-md rounded-3xl p-10 border border-white/10'
          initial='hidden'
          animate='visible'
          variants={fadeIn}
        >
          <div className='text-center mb-10'>
            <h2 className='text-4xl font-bold text-white mb-4'>
              What's Included
            </h2>
            <p className='text-white/80 text-xl'>
              Everything you need for the perfect day at sea
            </p>
          </div>

          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6'>
            {activities.map((activity, index) => (
              <motion.div
                key={index}
                className='group bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center border border-white/10 hover:bg-white/15 transition-all duration-300 hover:scale-105'
                variants={slideIn}
                whileHover={{ y: -5 }}
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-r ${activity.color} flex items-center justify-center mx-auto mb-4`}
                >
                  <activity.icon className='w-6 h-6 text-white' />
                </div>
                <p className='font-semibold text-white'>{activity.name}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Modern Time Slots */}
        <motion.div
          className='bg-white/5 backdrop-blur-md rounded-3xl p-10 border border-white/10'
          initial='hidden'
          animate='visible'
          variants={fadeIn}
        >
          <div className='text-center mb-10'>
            <h2 className='text-4xl font-bold text-white mb-4'>
              Choose Your Departure
            </h2>
            <p className='text-white/80 text-xl'>
              Select the perfect time for your adventure
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {timeSlots.map((slot, index) => (
              <motion.div
                key={index}
                className={`relative overflow-hidden rounded-2xl p-8 cursor-pointer transition-all duration-300 hover:scale-105 ${
                  slot.popular
                    ? 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-2 border-blue-400/50 shadow-2xl'
                    : 'bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15'
                }`}
                variants={slideIn}
                onClick={() => setIsModalOpen(true)}
              >
                {slot.popular && (
                  <div className='absolute top-0 right-0 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 text-sm font-bold rounded-bl-2xl'>
                    Most Popular
                  </div>
                )}

                <div className='text-center'>
                  <div
                    className={`w-12 h-12 rounded-xl ${
                      slot.popular ? 'bg-blue-500/30' : 'bg-white/10'
                    } flex items-center justify-center mx-auto mb-6`}
                  >
                    <slot.icon className='w-6 h-6 text-white' />
                  </div>

                  <h3 className='text-2xl font-bold text-white mb-2'>
                    {slot.time} - {slot.endTime}
                  </h3>
                  <p className='text-white/90 text-lg mb-2'>{slot.label}</p>
                  <p className='text-white/70 text-sm mb-6'>
                    {slot.description}
                  </p>

                  <button
                    className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                      slot.popular
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 shadow-lg'
                        : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
                    }`}
                  >
                    Select Time
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Experience Gallery */}
        <motion.div
          className='bg-white/5 backdrop-blur-md rounded-3xl p-10 border border-white/10'
          initial='hidden'
          animate='visible'
          variants={fadeIn}
        >
          <div className='text-center mb-10'>
            <h2 className='text-4xl font-bold text-white mb-4'>
              Experience Gallery
            </h2>
            <p className='text-white/80 text-xl'>
              See what awaits you on this incredible journey
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {[
              {
                src: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=800',
                title: 'Crystal Waters',
                description: 'Swim in pristine Caribbean waters',
              },
              {
                src: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?q=80&w=800',
                title: 'Snorkeling Paradise',
                description: 'Discover vibrant marine life',
              },
              {
                src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800',
                title: 'Sunset Views',
                description: 'Breathtaking Caribbean sunsets',
              },
              {
                src: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800',
                title: 'Gourmet Dining',
                description: 'Fresh seafood and tropical fruits',
              },
              {
                src: 'https://images.unsplash.com/photo-1549144511-f099e773c147?q=80&w=800',
                title: 'Beach Relaxation',
                description: 'Secluded beaches just for you',
              },
              {
                src: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?q=80&w=800',
                title: 'Adventure Awaits',
                description: 'Unforgettable memories guaranteed',
              },
            ].map((image, index) => (
              <motion.div
                key={index}
                className='group relative overflow-hidden rounded-2xl h-64 cursor-pointer'
                variants={slideIn}
                whileHover={{ scale: 1.05 }}
              >
                <Image
                  src={image.src}
                  alt={image.title}
                  fill
                  className='object-cover transition-all duration-500 group-hover:scale-110'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300' />
                <div className='absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300'>
                  <h3 className='text-xl font-bold mb-2'>{image.title}</h3>
                  <p className='text-white/80 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                    {image.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action Banner 1 - Luxury Experience */}
        <motion.div
          className='relative overflow-hidden rounded-3xl h-[60vh] shadow-2xl'
          initial='hidden'
          animate='visible'
          variants={fadeIn}
        >
          <Image
            src='https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=1400'
            alt='Luxury catamaran experience'
            fill
            className='object-cover'
          />
          <div className='absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-blue-900/70' />

          <div className='absolute inset-0 flex items-center justify-center text-center text-white p-8'>
            <div className='max-w-4xl'>
              <motion.h2
                className='text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent'
                variants={fadeIn}
              >
                Pure Luxury Awaits
              </motion.h2>
              <motion.p
                className='text-2xl text-white/90 mb-8 font-light'
                variants={fadeIn}
              >
                Indulge in the ultimate Caribbean experience with premium
                amenities and personalized service
              </motion.p>
              <motion.button
                onClick={() => setIsModalOpen(true)}
                className='bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-10 py-5 rounded-2xl font-bold text-xl flex items-center gap-4 mx-auto transition-all duration-300 hover:scale-105 shadow-2xl'
                variants={slideIn}
              >
                Reserve Your Spot
                <ArrowRight className='w-6 h-6' />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Modern Experience Section */}
        <motion.div
          className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'
          initial='hidden'
          animate='visible'
          variants={fadeIn}
        >
          <div className='order-2 lg:order-1'>
            <h2 className='text-4xl font-bold text-white mb-8'>
              {isPrivate
                ? 'Your Private Paradise'
                : 'An Unforgettable Experience'}
            </h2>
            <p className='text-xl text-white/80 mb-8 leading-relaxed'>
              {isPrivate
                ? 'Enjoy complete privacy aboard our luxury catamaran with personalized service just for your group.'
                : 'Sail through crystal-clear Caribbean waters, discover hidden beaches, and snorkel among vibrant coral reefs.'}
            </p>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {[
                'Professional crew',
                'Safety equipment',
                'Snorkeling gear',
                'Open bar & food',
                'Photography service',
                'Beach towels',
              ].map((feature, index) => (
                <div key={index} className='flex items-center group'>
                  <div className='w-8 h-8 rounded-lg bg-gradient-to-r from-emerald-400 to-green-500 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300'>
                    <Check className='w-4 h-4 text-white' />
                  </div>
                  <span className='text-white/90 font-medium'>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className='order-1 lg:order-2 relative h-[500px] rounded-3xl overflow-hidden shadow-2xl'>
            <Image
              src='https://images.unsplash.com/photo-1548574505-5e239809ee19?q=80&w=1200'
              alt='Catamaran deck experience'
              fill
              className='object-cover'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent' />
          </div>
        </motion.div>

        {/* Call to Action Banner 2 - Adventure */}
        <motion.div
          className='relative overflow-hidden rounded-3xl h-[50vh] shadow-2xl'
          initial='hidden'
          animate='visible'
          variants={fadeIn}
        >
          <Image
            src='https://images.unsplash.com/photo-1583212292454-1fe6229603b7?q=80&w=1400'
            alt='Snorkeling adventure'
            fill
            className='object-cover'
          />
          <div className='absolute inset-0 bg-gradient-to-l from-cyan-900/80 via-blue-900/50 to-black/70' />

          <div className='absolute inset-0 flex items-center text-white p-12'>
            <div className='max-w-2xl'>
              <motion.h3
                className='text-4xl md:text-5xl font-bold mb-4'
                variants={fadeIn}
              >
                Dive into Adventure
              </motion.h3>
              <motion.p
                className='text-xl text-white/90 mb-6'
                variants={fadeIn}
              >
                Explore underwater worlds with our professional snorkeling
                equipment and expert guides
              </motion.p>
              <motion.button
                onClick={() => setIsModalOpen(true)}
                className='bg-white/20 backdrop-blur-md hover:bg-white/30 text-white px-8 py-4 rounded-xl font-semibold text-lg flex items-center gap-3 transition-all duration-300 border border-white/30'
                variants={slideIn}
              >
                Learn More
                <Camera className='w-5 h-5' />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Modern Call to Action */}
        <motion.div
          className='bg-gradient-to-r from-blue-600/20 to-cyan-600/20 backdrop-blur-md rounded-3xl p-12 text-center border border-blue-400/30'
          initial='hidden'
          animate='visible'
          variants={fadeIn}
        >
          <h2 className='text-4xl md:text-5xl font-bold text-white mb-6'>
            Ready to Set Sail?
          </h2>
          <p className='text-xl text-white/80 mb-10 max-w-3xl mx-auto leading-relaxed'>
            Book your catamaran adventure today and create memories that will
            last a lifetime
          </p>

          <div className='flex flex-col md:flex-row gap-8 justify-center items-center'>
            <div className='text-center'>
              <div className='text-5xl font-bold text-white'>
                ${service.price}
              </div>
              <div className='text-white/70 text-lg'>per person</div>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className='bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-10 py-5 rounded-2xl font-bold text-xl flex items-center gap-4 hover:scale-105 transition-all duration-300 shadow-2xl'
            >
              <CreditCard className='w-6 h-6' />
              Book Now
            </button>
          </div>
        </motion.div>

        {/* Modern Important Notice */}
        <motion.div
          className='bg-amber-500/10 backdrop-blur-md border border-amber-400/30 rounded-2xl p-8'
          initial='hidden'
          animate='visible'
          variants={fadeIn}
        >
          <div className='flex items-start'>
            <div className='w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center mr-4 flex-shrink-0'>
              <AlertCircle className='w-5 h-5 text-amber-400' />
            </div>
            <div>
              <h3 className='font-bold text-amber-300 mb-3 text-lg'>
                Important Information
              </h3>
              <p className='text-amber-200/90 leading-relaxed'>
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
    </div>
  );
};

export default CatamaranServiceView;
