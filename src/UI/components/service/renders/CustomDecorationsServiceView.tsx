import React, { useState } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { Service } from '@/types/type';
import { ServiceData } from '@/types/services';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useBooking } from '@/context/BookingContext';
import { BookingDate } from '@/types/type';
import BookingModal from '../../modal/BookingModal';
import {
  Palette,
  Heart,
  ArrowRight,
  CheckCircle,
  Play,
  PartyPopper,
  Clock,
  MapPin,
  AlertTriangle,
  Sparkles,
  Camera,
  Star,
  Users,
  CreditCard,
  Gift,
  HomeIcon,
  MessageCircle,
} from 'lucide-react';

interface CustomDecorationsServiceViewProps {
  service: Service;
  serviceData?: ServiceData;
  primaryColor: string;
  viewContext?: 'standard-view' | 'premium-view';
}

const CustomDecorationsServiceView: React.FC<
  CustomDecorationsServiceViewProps
> = ({ service, serviceData, viewContext }) => {
  const { t } = useTranslation();
  const { bookService } = useBooking();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDecorationType, setSelectedDecorationType] = useState('');

  const isPremium =
    service.packageType.includes('premium') || viewContext === 'premium-view';

  // Decoration types from PDF
  const decorationTypes = [
    {
      id: 'romanticSetup',
      name: 'Romantic Setups',
      icon: '💕',
      color: 'from-pink-500 to-red-500',
      price: 150,
      image:
        'https://images.unsplash.com/photo-1580740103686-55594a00a1b0?auto=format&fit=crop&q=80&w=600',
      description:
        'Intimate candle-lit settings with roses and elegant touches',
    },
    {
      id: 'birthdayTheme',
      name: 'Birthday Themes',
      icon: '🎂',
      color: 'from-yellow-500 to-orange-500',
      price: 175,
      image:
        'https://images.unsplash.com/photo-1602631985686-1bb0e6a8696e?auto=format&fit=crop&q=80&w=600',
      description: 'Colorful and fun decorations for all ages',
    },
    {
      id: 'balloonGarlands',
      name: 'Balloon Garlands',
      icon: '🎈',
      color: 'from-purple-500 to-pink-500',
      price: 200,
      image:
        'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=600',
      description: 'Stunning balloon arrangements in your chosen colors',
    },
    {
      id: 'beachPicnic',
      name: 'Beach Picnics',
      icon: '🏖️',
      color: 'from-blue-500 to-teal-500',
      price: 225,
      image:
        'https://images.unsplash.com/photo-1464699798531-2ecf3a63fe09?auto=format&fit=crop&q=80&w=600',
      description: 'Bohemian-style setups perfect for seaside celebrations',
    },
    {
      id: 'kidsParty',
      name: "Kids' Parties",
      icon: '🎪',
      color: 'from-green-500 to-blue-500',
      price: 190,
      image:
        'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&q=80&w=600',
      description: 'Playful and magical decorations for little ones',
    },
    {
      id: 'luxuryDining',
      name: 'Luxury Dining Decor',
      icon: '🍽️',
      color: 'from-amber-500 to-orange-500',
      price: 250,
      image:
        'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=600',
      description: 'Elegant table settings for sophisticated celebrations',
    },
  ];

  // Experience gallery
  const experienceGallery = [
    {
      src: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=800',
      title: 'Romantic Dinners',
      description: 'Create intimate moments with perfect ambiance',
      category: 'romantic',
    },
    {
      src: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?q=80&w=800',
      title: 'Birthday Magic',
      description: 'Make every birthday unforgettable',
      category: 'birthday',
    },
    {
      src: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?q=80&w=800',
      title: 'Anniversary Celebrations',
      description: 'Honor your special milestones',
      category: 'anniversary',
    },
    {
      src: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?q=80&w=800',
      title: 'Kids Wonderland',
      description: 'Create magical spaces for children',
      category: 'kids',
    },
    {
      src: 'https://images.unsplash.com/photo-1464699798531-2ecf3a63fe09?q=80&w=800',
      title: 'Beach Setups',
      description: 'Perfect beachside celebrations',
      category: 'beach',
    },
    {
      src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=800',
      title: 'Elegant Dining',
      description: 'Sophisticated table arrangements',
      category: 'luxury',
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

  const handleBookingConfirm = (
    service: Service,
    dates: BookingDate,
    guests: number
  ) => {
    bookService(service, dates, guests);
    setIsModalOpen(false);
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-pink-50 to-purple-50'>
      <div className='max-w-8xl mx-auto space-y-16 pb-16'>
        {/* Hero Section */}
        <motion.div
          className='relative overflow-hidden rounded-3xl mx-4 mt-8 h-[80vh] shadow-2xl'
          initial='hidden'
          animate='visible'
          variants={fadeIn}
        >
          <Image
            src='https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&q=80&w=1400'
            alt='Custom decorations setup'
            fill
            className='object-cover'
            priority
          />

          <div className='absolute inset-0 bg-gradient-to-br from-black/60 via-pink-900/40 to-purple-900/60' />

          {/* Floating elements */}
          <div className='absolute top-6 left-6 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20'>
            <span className='text-white/90 text-sm font-medium'>
              ✨ Villa Decoration Specialists
            </span>
          </div>

          <div className='relative z-10 h-full flex items-center justify-center text-center px-8'>
            <div className='max-w-5xl'>
              <motion.div
                className='inline-flex items-center bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 mb-8'
                variants={slideIn}
              >
                <Palette className='w-5 h-5 text-white mr-3' />
                <span className='text-white font-semibold text-lg'>
                  Your Moment. Your Style. Your Villa.
                </span>
              </motion.div>

              <motion.h1
                className='text-6xl md:text-7xl font-bold mb-6 leading-tight bg-gradient-to-r from-white to-pink-200 bg-clip-text text-transparent'
                variants={fadeIn}
              >
                Custom Decorations
              </motion.h1>

              <motion.p
                className='text-2xl md:text-3xl text-white/90 mb-4 font-light'
                variants={fadeIn}
              >
                Transform Your Villa into a Celebration
              </motion.p>

              <motion.p
                className='text-lg text-white/80 mb-10 max-w-3xl mx-auto leading-relaxed'
                variants={fadeIn}
              >
                From intimate romantic dinners to vibrant birthday celebrations,
                we create magical atmospheres that turn your vacation villa into
                the perfect venue for life's special moments.
              </motion.p>

              {/* Hero Stats */}
              <motion.div
                className='flex flex-wrap justify-center gap-6 mb-10'
                variants={stagger}
                initial='hidden'
                animate='visible'
              >
                {[
                  {
                    icon: HomeIcon,
                    text: 'Villa Specialists',
                    label: 'Expertise',
                  },
                  { icon: Users, text: '500+ Events', label: 'Experience' },
                  { icon: Star, text: '4.9/5 Rating', label: 'Satisfaction' },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    variants={slideIn}
                    className='flex items-center bg-white/10 backdrop-blur-md px-6 py-3 rounded-xl border border-white/20'
                  >
                    <stat.icon className='w-5 h-5 mr-3 text-pink-300' />
                    <div className='text-left'>
                      <div className='font-semibold text-white'>
                        {stat.text}
                      </div>
                      <div className='text-xs text-white/70'>{stat.label}</div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              <motion.button
                onClick={() => setIsModalOpen(true)}
                className='bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-10 py-5 rounded-2xl font-bold text-xl flex items-center gap-4 mx-auto transition-all duration-300 hover:scale-105 shadow-2xl'
                variants={slideIn}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Sparkles className='w-6 h-6' />
                Create Your Perfect Setting
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Experience Gallery */}
        <motion.div
          className='px-4'
          initial='hidden'
          animate='visible'
          variants={fadeIn}
        >
          <div className='text-center mb-12'>
            <h2 className='text-4xl font-bold text-gray-800 mb-4'>
              Experience Gallery
            </h2>
            <p className='text-xl text-gray-600'>
              See how we transform villas into magical celebration spaces
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {experienceGallery.map((image, index) => (
              <motion.div
                key={index}
                className='group relative overflow-hidden rounded-2xl h-80 cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500'
                variants={slideIn}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <Image
                  src={image.src}
                  alt={image.title}
                  fill
                  className='object-cover transition-all duration-700 group-hover:scale-110'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300' />

                {/* Category badge */}
                <div className='absolute top-4 left-4 bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium border border-white/30'>
                  {image.category}
                </div>

                <div className='absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300'>
                  <h3 className='text-2xl font-bold mb-2'>{image.title}</h3>
                  <p className='text-white/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100'>
                    {image.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action Banner 1 - Human Touch */}
        <motion.div
          className='relative overflow-hidden rounded-3xl mx-4 h-[60vh] shadow-2xl'
          initial='hidden'
          animate='visible'
          variants={fadeIn}
        >
          <Image
            src='https://images.unsplash.com/photo-1527529482837-4698179dc6ce?q=80&w=1400'
            alt='Personal decoration service'
            fill
            className='object-cover'
          />
          <div className='absolute inset-0 bg-gradient-to-r from-pink-900/80 via-purple-900/50 to-black/70' />

          <div className='absolute inset-0 flex items-center text-white p-12'>
            <div className='max-w-2xl'>
              <motion.h3
                className='text-5xl md:text-6xl font-bold mb-6'
                variants={fadeIn}
              >
                Personal Touch,
                <br />
                Perfect Moments
              </motion.h3>
              <motion.p
                className='text-xl text-white/90 mb-8 leading-relaxed'
                variants={fadeIn}
              >
                Our team doesn't just set up decorations – we craft experiences.
                Every detail is personally designed to reflect your vision and
                create memories that last forever.
              </motion.p>
              <motion.button
                onClick={() => setIsModalOpen(true)}
                className='bg-white/20 backdrop-blur-md hover:bg-white/30 text-white px-8 py-4 rounded-xl font-semibold text-lg flex items-center gap-3 transition-all duration-300 border border-white/30'
                variants={slideIn}
              >
                <MessageCircle className='w-5 h-5' />
                Tell Us Your Vision
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Choose From Decoration Types */}
        <motion.div
          className='px-4'
          initial='hidden'
          animate='visible'
          variants={fadeIn}
        >
          <div className='text-center mb-12'>
            <h2 className='text-4xl font-bold text-gray-800 mb-4'>
              Choose Your Style
            </h2>
            <p className='text-xl text-gray-600'>
              Each package includes setup, styling, and cleanup
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {decorationTypes.map((decoration, index) => (
              <motion.div
                key={decoration.id}
                className={`group relative overflow-hidden rounded-3xl cursor-pointer transition-all duration-500 hover:scale-105 shadow-lg hover:shadow-2xl ${
                  selectedDecorationType === decoration.id
                    ? 'ring-4 ring-purple-500 shadow-2xl scale-105'
                    : ''
                }`}
                onClick={() => setSelectedDecorationType(decoration.id)}
                variants={slideIn}
              >
                <div className='h-64 relative overflow-hidden'>
                  <Image
                    src={decoration.image}
                    alt={decoration.name}
                    fill
                    className='object-cover transition-transform duration-700 group-hover:scale-110'
                  />
                  <div className='absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300' />
                </div>

                <div className='bg-white p-6 border-t-4 border-purple-500'>
                  <div className='flex items-center justify-between mb-4'>
                    <div className='text-4xl'>{decoration.icon}</div>
                    <div className='text-right'>
                      <div className='text-3xl font-bold text-gray-800'>
                        ${decoration.price}
                      </div>
                      <div className='text-sm text-gray-500'>per event</div>
                    </div>
                  </div>

                  <h3 className='text-xl font-bold text-gray-800 mb-3'>
                    {decoration.name}
                  </h3>
                  <p className='text-gray-600 leading-relaxed'>
                    {decoration.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action Banner 2 - Villa Focus */}
        <motion.div
          className='relative overflow-hidden rounded-3xl mx-4 h-[50vh] shadow-2xl'
          initial='hidden'
          animate='visible'
          variants={fadeIn}
        >
          <Image
            src='https://images.unsplash.com/photo-1531058020387-3be344556be6?q=80&w=1400'
            alt='Villa celebration setup'
            fill
            className='object-cover'
          />
          <div className='absolute inset-0 bg-gradient-to-l from-purple-900/80 via-pink-900/50 to-black/70' />

          <div className='absolute inset-0 flex items-center justify-end text-white p-12'>
            <div className='max-w-2xl text-right'>
              <motion.h3
                className='text-4xl md:text-5xl font-bold mb-4'
                variants={fadeIn}
              >
                Your Villa, Our Artistry
              </motion.h3>
              <motion.p
                className='text-lg text-white/90 mb-6'
                variants={fadeIn}
              >
                We specialize in vacation villa celebrations. Whether it's
                poolside romance or garden party fun, we know how to make the
                most of your space.
              </motion.p>
              <motion.button
                onClick={() => setIsModalOpen(true)}
                className='bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-8 py-4 rounded-xl font-semibold flex items-center gap-3 transition-all duration-300 ml-auto'
                variants={slideIn}
              >
                <HomeIcon className='w-5 h-5' />
                Transform Your Villa
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* What's Included & Process */}
        <motion.div
          className='px-4'
          initial='hidden'
          animate='visible'
          variants={fadeIn}
        >
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
            {/* What's Included */}
            <div className='bg-white rounded-3xl shadow-xl p-10 border border-gray-100'>
              <h2 className='text-3xl font-bold text-gray-800 mb-8 flex items-center'>
                <CheckCircle className='w-8 h-8 text-purple-500 mr-4' />
                What's Included
              </h2>

              <div className='space-y-6 mb-8'>
                {[
                  { icon: MessageCircle, text: 'Personal Design Consultation' },
                  { icon: Palette, text: 'Custom Color & Theme Planning' },
                  { icon: CheckCircle, text: 'Complete Setup & Styling' },
                  { icon: Sparkles, text: 'Premium Decor Materials' },
                  { icon: Camera, text: 'Professional Lighting Setup' },
                  { icon: PartyPopper, text: 'Full Cleanup Service' },
                ].map((item, index) => (
                  <div key={index} className='flex items-center group'>
                    <div className='w-12 h-12 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300'>
                      <item.icon className='w-6 h-6 text-purple-600' />
                    </div>
                    <span className='text-lg text-gray-700 font-medium'>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>

              <div className='bg-gradient-to-r from-gray-50 to-purple-50 p-6 rounded-xl border border-purple-100'>
                <h3 className='font-semibold text-gray-800 mb-3 flex items-center'>
                  <Gift className='w-5 h-5 mr-2 text-purple-500' />
                  Optional Add-ons:
                </h3>
                <p className='text-gray-600'>
                  • Fresh flowers & premium linens
                  <br />
                  • Welcome signs & custom banners
                  <br />• Cake setup & photography props
                </p>
              </div>
            </div>

            {/* What to Expect */}
            <div className='bg-white rounded-3xl shadow-xl p-10 border border-gray-100'>
              <h2 className='text-3xl font-bold text-gray-800 mb-8 flex items-center'>
                <PartyPopper className='w-8 h-8 text-pink-500 mr-4' />
                What to Expect
              </h2>

              <div className='space-y-8'>
                {[
                  {
                    step: '1',
                    text: 'Vision consultation & space planning',
                    icon: MessageCircle,
                    detail: 'We discuss your dream celebration',
                  },
                  {
                    step: '2',
                    text: 'Professional setup at your villa',
                    icon: HomeIcon,
                    detail: '2-3 hours before your event',
                  },
                  {
                    step: '3',
                    text: 'Perfect atmosphere for your celebration',
                    icon: Sparkles,
                    detail: 'Every detail exactly as planned',
                  },
                  {
                    step: '4',
                    text: 'Complete cleanup & takedown',
                    icon: CheckCircle,
                    detail: 'You enjoy, we handle everything else',
                  },
                ].map((item, index) => (
                  <div key={index} className='flex items-start group'>
                    <div className='w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center mr-6 font-bold flex-shrink-0 group-hover:scale-110 transition-transform duration-300'>
                      {item.step}
                    </div>
                    <div className='flex-1'>
                      <div className='flex items-center mb-2'>
                        <item.icon className='w-5 h-5 text-purple-500 mr-3' />
                        <h3 className='font-semibold text-gray-800'>
                          {item.text}
                        </h3>
                      </div>
                      <p className='text-gray-600 text-sm'>{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Good to Know - Modern Cards */}
        <motion.div
          className='px-4'
          initial='hidden'
          animate='visible'
          variants={fadeIn}
        >
          <div className='text-center mb-12'>
            <h2 className='text-4xl font-bold text-gray-800 mb-4'>
              Good to Know
            </h2>
            <p className='text-xl text-gray-600'>
              Everything you need to plan your perfect celebration
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {[
              {
                icon: Clock,
                title: 'Booking Notice',
                detail: 'Minimum 48 hours advance booking required',
                color: 'from-purple-500 to-purple-600',
              },
              {
                icon: HomeIcon,
                title: 'Villa Specialists',
                detail: 'Expert in vacation rental celebrations',
                color: 'from-pink-500 to-pink-600',
              },
              {
                icon: Users,
                title: 'Any Group Size',
                detail: 'Intimate dinners to large parties',
                color: 'from-blue-500 to-blue-600',
              },
              {
                icon: MapPin,
                title: 'Indoor & Outdoor',
                detail: 'Poolside, garden, or indoor setups',
                color: 'from-emerald-500 to-emerald-600',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className='bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100'
                variants={slideIn}
              >
                <div
                  className={`w-14 h-14 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center mx-auto mb-4`}
                >
                  <item.icon className='w-7 h-7 text-white' />
                </div>
                <h3 className='font-bold text-gray-800 mb-2 text-lg'>
                  {item.title}
                </h3>
                <p className='text-gray-600 text-sm leading-relaxed'>
                  {item.detail}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Testimonial Section */}
        <motion.div
          className='px-4'
          initial='hidden'
          animate='visible'
          variants={fadeIn}
        >
          <div className='bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl p-10 text-center border border-purple-100'>
            <div className='flex justify-center mb-6'>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className='w-7 h-7 text-yellow-400 fill-current'
                />
              ))}
            </div>
            <blockquote className='text-3xl font-medium text-gray-800 mb-6 italic leading-relaxed max-w-4xl mx-auto'>
              "They transformed our villa into a romantic paradise! Every detail
              was perfect, from the candlelit pathway to the rose petals. It
              made our anniversary unforgettable."
            </blockquote>
            <cite className='text-xl text-gray-600 font-medium'>
              - Maria & Carlos, Anniversary Celebration
            </cite>

            <div className='mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto'>
              <div className='text-center'>
                <div className='text-2xl font-bold text-purple-600'>500+</div>
                <div className='text-gray-600'>Events Created</div>
              </div>
              <div className='text-center'>
                <div className='text-2xl font-bold text-pink-600'>4.9/5</div>
                <div className='text-gray-600'>Average Rating</div>
              </div>
              <div className='text-center'>
                <div className='text-2xl font-bold text-blue-600'>100%</div>
                <div className='text-gray-600'>Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Why Choose Us - Enhanced */}
        <motion.div
          className='px-4'
          initial='hidden'
          animate='visible'
          variants={fadeIn}
        >
          <div className='bg-gradient-to-r from-gray-900 via-purple-900 to-pink-900 rounded-3xl p-12 text-white'>
            <div className='text-center mb-12'>
              <h2 className='text-4xl font-bold mb-6'>
                Why Choose Our Villa Decoration Service?
              </h2>
              <p className='text-xl text-white/90 max-w-3xl mx-auto leading-relaxed'>
                We don't just decorate spaces – we create experiences that make
                your vacation villa the perfect backdrop for life's most
                precious moments.
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
              {[
                {
                  icon: HomeIcon,
                  title: 'Villa Expertise',
                  description:
                    'We specialize in vacation rental spaces and know how to maximize every corner',
                  gradient: 'from-blue-400 to-cyan-400',
                },
                {
                  icon: Heart,
                  title: 'Personal Touch',
                  description:
                    'Every setup is customized to your style, preferences, and special occasion',
                  gradient: 'from-pink-400 to-red-400',
                },
                {
                  icon: Sparkles,
                  title: 'Stress-Free Experience',
                  description:
                    'Complete service from consultation to cleanup – you just enjoy the moment',
                  gradient: 'from-purple-400 to-pink-400',
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className='text-center p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all duration-300'
                  variants={slideIn}
                  whileHover={{ scale: 1.05 }}
                >
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6`}
                  >
                    <feature.icon className='w-8 h-8 text-white' />
                  </div>
                  <h3 className='text-xl font-bold mb-4'>{feature.title}</h3>
                  <p className='text-white/80 leading-relaxed'>
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Final CTA with urgency */}
        <motion.div
          className='px-4'
          initial='hidden'
          animate='visible'
          variants={fadeIn}
        >
          <div className='relative overflow-hidden rounded-3xl h-[40vh] shadow-2xl'>
            <Image
              src='https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1400'
              alt='Villa celebration'
              fill
              className='object-cover'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent' />

            <div className='absolute inset-0 flex items-center justify-center text-center text-white p-8'>
              <div className='max-w-3xl'>
                <motion.h3
                  className='text-4xl md:text-5xl font-bold mb-6'
                  variants={fadeIn}
                >
                  Don't Wait – Book Your Dream Setup Today
                </motion.h3>
                <motion.p
                  className='text-xl text-white/90 mb-8'
                  variants={fadeIn}
                >
                  Popular dates fill up quickly. Secure your perfect villa
                  celebration now and let us create magic for your special
                  moment.
                </motion.p>
                <motion.div
                  className='flex flex-col sm:flex-row gap-4 justify-center items-center'
                  variants={slideIn}
                >
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className='bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-10 py-5 rounded-2xl font-bold text-xl flex items-center gap-4 transition-all duration-300 hover:scale-105 shadow-2xl'
                  >
                    <Sparkles className='w-6 h-6' />
                    Book Your Celebration
                    <ArrowRight className='w-6 h-6' />
                  </button>

                  <div className='text-center'>
                    <div className='text-sm text-white/70'>Starting from</div>
                    <div className='text-2xl font-bold'>${service.price}</div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Important Notice */}
        <motion.div
          className='px-4'
          initial='hidden'
          animate='visible'
          variants={fadeIn}
        >
          <div className='bg-amber-50 border border-amber-200 rounded-2xl p-8'>
            <div className='flex items-start'>
              <AlertTriangle className='w-8 h-8 text-amber-600 mr-4 flex-shrink-0 mt-1' />
              <div>
                <h3 className='font-bold text-amber-800 mb-3 text-lg'>
                  Important Information
                </h3>
                <div className='text-amber-700 space-y-2'>
                  <p>
                    • Please provide accurate villa location and access details
                    during booking
                  </p>
                  <p>
                    • We recommend booking 48-72 hours in advance for optimal
                    availability
                  </p>
                  <p>
                    • Weather-dependent outdoor setups include indoor backup
                    options
                  </p>
                  <p>
                    • Additional charges may apply for locations outside our
                    standard service area
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
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

export default CustomDecorationsServiceView;
