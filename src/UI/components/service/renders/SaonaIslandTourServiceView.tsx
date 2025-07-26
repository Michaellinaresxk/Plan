import React, { useState, useCallback, useMemo } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { Service } from '@/types/type';
import { ServiceData, ServiceExtendedDetails } from '@/types/services';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Ship,
  Users,
  Utensils,
  Camera,
  ArrowRight,
  Star,
  CheckCircle,
  AlertCircle,
  Palmtree,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  Check,
  Fish,
  Sun,
  MapPin,
  Clock,
  Waves,
  Heart,
  Zap,
  CreditCard,
  PartyPopper,
  AlertTriangle,
} from 'lucide-react';
import { useBooking } from '@/context/BookingContext';
import { BookingDate } from '@/types/type';
import BookingModal from '@/UI/components/modal/BookingModal';

interface SaonaIslandTourServiceViewProps {
  service: Service;
  serviceData?: ServiceData;
  extendedDetails?: ServiceExtendedDetails;
  primaryColor?: string;
  viewContext?: 'standard-view' | 'premium-view';
}

// Constants
const GALLERY_IMAGES = [
  {
    src: '/img/saona-island/saona-4.jpg',
    alt: 'Pristine beaches of Saona Island',
    caption:
      'The stunning white sand beaches of Saona Island, Dominican Republic',
    category: 'beaches',
  },
  {
    src: 'https://images.unsplash.com/photo-1502402772916-f8a62ea50180?q=80&w=2940&auto=format&fit=crop',
    alt: 'Luxury catamaran sailing to Saona',
    caption: 'Sailing to Saona Island aboard our luxurious catamaran',
    category: 'sailing',
  },
  {
    src: 'https://images.unsplash.com/photo-1514907283155-ea5f4094c70c?q=80&w=2940&auto=format&fit=crop',
    alt: 'Natural pools experience',
    caption: 'Crystal clear natural pools perfect for snorkeling',
    category: 'pools',
  },
  {
    src: 'https://images.unsplash.com/photo-1518169640858-0d622b058e5c?q=80&w=2874&auto=format&fit=crop',
    alt: 'Tropical buffet lunch',
    caption: 'Delicious tropical buffet lunch served on the island',
    category: 'dining',
  },
  {
    src: 'https://images.unsplash.com/photo-1551918120-9739cb430c6d?q=80&w=2087&auto=format&fit=crop',
    alt: 'Palm trees on Saona Island',
    caption: 'Relax under the shade of palm trees on Saona Island',
    category: 'relaxation',
  },
  {
    src: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=1200',
    alt: 'Snorkeling in crystal waters',
    caption: 'Explore marine life in crystal clear Caribbean waters',
    category: 'snorkeling',
  },
];

// Experience gallery for modern section
const experienceGallery = [
  {
    src: 'https://images.unsplash.com/photo-1502402772916-f8a62ea50180?q=80&w=800',
    title: 'Catamaran Journey',
    description: 'Sail in luxury to your island paradise',
    category: 'sailing',
  },
  {
    src: 'https://images.unsplash.com/photo-1514907283155-ea5f4094c70c?q=80&w=800',
    title: 'Natural Pools',
    description: 'Swim with starfish in crystal clear waters',
    category: 'swimming',
  },
  {
    src: 'https://images.unsplash.com/photo-1615787421738-e980903b0640?q=80&w=800',
    title: 'Paradise Beaches',
    description: 'Pristine white sand beaches await',
    category: 'beaches',
  },
  {
    src: 'https://images.unsplash.com/photo-1518169640858-0d622b058e5c?q=80&w=800',
    title: 'Island Dining',
    description: 'Tropical buffet with Caribbean flavors',
    category: 'dining',
  },
  {
    src: 'https://images.unsplash.com/photo-1551918120-9739cb430c6d?q=80&w=800',
    title: 'Tropical Paradise',
    description: 'Relax under swaying palm trees',
    category: 'relaxation',
  },
  {
    src: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=800',
    title: 'Marine Adventures',
    description: 'Snorkel and explore underwater wonders',
    category: 'adventure',
  },
];

const INCLUDED_ITEMS = [
  { icon: Ship, text: 'Hotel pickup and drop-off service' },
  { icon: Waves, text: 'Catamaran sailing to Saona Island' },
  { icon: Zap, text: 'Speedboat return journey' },
  { icon: Fish, text: 'Visit to the famous natural pools' },
  { icon: Utensils, text: 'Dominican buffet lunch' },
  { icon: PartyPopper, text: 'Open bar with national drinks' },
  { icon: Users, text: 'Professional guides and staff' },
];

const PREMIUM_EXTRAS = [
  { icon: Star, text: 'Premium beverages and cocktails' },
  { icon: Utensils, text: 'Gourmet tropical buffet' },
];

const WHAT_TO_BRING = [
  'Swimwear and beach towel',
  'Sunscreen and sunglasses',
  'Comfortable clothing and footwear',
  'Camera (waterproof if possible)',
  'Cash for souvenirs or additional beverages',
];

const FAQS = [
  {
    question: 'What should I bring for the Saona Island tour?',
    answer:
      "We recommend bringing swimwear, a towel, sunscreen, sunglasses, a hat, comfortable shoes, and a camera. Don't forget some cash for souvenirs or additional beverages.",
  },
  {
    question: 'Is lunch included in the tour?',
    answer:
      'Yes, a delicious Dominican buffet lunch is included in your tour price, along with national drinks. Premium tours include additional gourmet options and premium beverages.',
  },
  {
    question: 'How long is the boat ride to Saona Island?',
    answer:
      'The catamaran journey to Saona Island takes approximately 1.5 hours, while the speedboat return is about 30-40 minutes. Both journeys offer beautiful views and experiences.',
  },
  {
    question: 'Is this tour suitable for children?',
    answer:
      'Yes, the Saona Island tour is family-friendly and suitable for children of all ages. We provide life jackets and our staff ensures everyone is safe throughout the journey.',
  },
  {
    question: 'What if I get seasick easily?',
    answer:
      'Our catamarans are stable vessels that minimize motion sickness. If you are prone to seasickness, we recommend taking medication before the tour and staying in the middle of the boat where there is less movement.',
  },
];

// Custom hook for gallery navigation
const useGallery = (imagesLength: number) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const navigate = useCallback(
    (direction: number) => {
      setCurrentIndex((prev) => {
        const newIndex = prev + direction;
        if (newIndex < 0) return imagesLength - 1;
        if (newIndex >= imagesLength) return 0;
        return newIndex;
      });
    },
    [imagesLength]
  );

  return { currentIndex, navigate, setCurrentIndex };
};

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
};

const slideIn = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const SaonaIslandTourServiceView: React.FC<SaonaIslandTourServiceViewProps> = ({
  service,
  viewContext,
}) => {
  const { t } = useTranslation();
  const { bookService, selectedServices } = useBooking();
  const { currentIndex, navigate, setCurrentIndex } = useGallery(
    GALLERY_IMAGES.length
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'faq'>(
    'overview'
  );

  const isPremium = useMemo(
    () =>
      service.packageType.includes('premium') || viewContext === 'premium-view',
    [service.packageType, viewContext]
  );

  const isSelected = useMemo(
    () => selectedServices.some((s) => s.id === service.id),
    [selectedServices, service.id]
  );

  const handleBookingConfirm = useCallback(
    (service: Service, dates: BookingDate, guests: number) => {
      bookService(service, dates, guests);
      setIsModalOpen(false);
    },
    [bookService]
  );

  const includedItems = useMemo(
    () => (isPremium ? [...INCLUDED_ITEMS, ...PREMIUM_EXTRAS] : INCLUDED_ITEMS),
    [isPremium]
  );

  return (
    <div className='min-h-screen '>
      <div className='max-w-8xl mx-auto px-6 py-12 space-y-16'>
        {/* Hero Section */}
        <motion.div
          className='relative h-[80vh] rounded-3xl overflow-hidden shadow-2xl'
          initial='hidden'
          animate='visible'
          variants={fadeIn}
        >
          <Image
            src={GALLERY_IMAGES[currentIndex].src}
            alt='Saona Island Paradise'
            fill
            className='object-cover transition-all duration-1000 ease-out'
            priority
          />

          {/* Gradient Overlay */}
          <div className='absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-black/60' />

          {/* Floating Elements */}
          <div className='absolute top-6 left-6 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20'>
            <span className='text-white/90 text-sm font-medium'>
              🏝️ Caribbean Paradise
            </span>
          </div>

          {/* Gallery Navigation */}
          <button
            onClick={() => navigate(-1)}
            className='absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 border border-white/20'
          >
            <ChevronLeft className='w-6 h-6 text-white' />
          </button>

          <button
            onClick={() => navigate(1)}
            className='absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 border border-white/20'
          >
            <ChevronRight className='w-6 h-6 text-white' />
          </button>

          {/* Image Indicators */}
          <div className='absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3'>
            {GALLERY_IMAGES.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex
                    ? 'w-8 h-3 bg-white'
                    : 'w-3 h-3 bg-white/50 hover:bg-white/70'
                }`}
              />
            ))}
          </div>

          {/* Hero Content */}
          <div className='absolute inset-0 flex items-center justify-center text-center text-white p-8'>
            <div className='max-w-5xl'>
              <motion.div
                className='inline-flex items-center bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 mb-8'
                variants={slideIn}
              >
                {isPremium ? (
                  <>
                    <Star className='w-5 h-5 mr-3 text-yellow-400' />
                    <span className='font-semibold text-lg uppercase tracking-wider'>
                      Premium Experience
                    </span>
                  </>
                ) : (
                  <>
                    <Ship className='w-5 h-5 mr-3' />
                    <span className='font-semibold text-lg'>
                      Tropical Adventure
                    </span>
                  </>
                )}
              </motion.div>

              <motion.h1
                className='text-6xl md:text-7xl font-bold mb-6 leading-tight bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent'
                variants={fadeIn}
              >
                Saona Island
              </motion.h1>

              <motion.p
                className='text-2xl md:text-3xl text-white/90 mb-4 font-light'
                variants={fadeIn}
              >
                {GALLERY_IMAGES[currentIndex].caption}
              </motion.p>

              <motion.p
                className='text-lg text-white/80 mb-10 max-w-3xl mx-auto leading-relaxed'
                variants={fadeIn}
              >
                Experience the jewel of the Caribbean with pristine beaches,
                crystal-clear waters, and unforgettable catamaran adventures to
                paradise.
              </motion.p>

              {/* Hero Stats */}
              <motion.div
                className='flex flex-wrap justify-center gap-6 mb-10'
                variants={stagger}
                initial='hidden'
                animate='visible'
              >
                {[
                  { icon: Clock, text: 'Full Day', label: 'Adventure' },
                  { icon: Users, text: '40+ Guests', label: 'Capacity' },
                  { icon: Star, text: '4.8/5 Rating', label: 'Satisfaction' },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    variants={slideIn}
                    className='flex items-center bg-white/10 backdrop-blur-md px-6 py-3 rounded-xl border border-white/20'
                  >
                    <stat.icon className='w-5 h-5 mr-3 text-cyan-300' />
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
                className='bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-10 py-5 rounded-2xl font-bold text-xl flex items-center gap-4 mx-auto transition-all duration-300 hover:scale-105 shadow-2xl'
                variants={slideIn}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isSelected ? (
                  <>
                    <CheckCheck className='w-6 h-6' />
                    Added to Package
                  </>
                ) : (
                  <>
                    <Ship className='w-6 h-6' />
                    Book Your Paradise Trip
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Experience Gallery */}
        <motion.div initial='hidden' animate='visible' variants={fadeIn}>
          <div className='text-center mb-12'>
            <h2 className='text-4xl font-bold text-gray-800 mb-4'>
              Experience Gallery
            </h2>
            <p className='text-xl text-gray-600'>
              Discover what makes Saona Island the Caribbean's hidden gem
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

        {/* Navigation Tabs */}
        <div className='bg-white/80 backdrop-blur-sm rounded-2xl p-2 border border-gray-200/50'>
          <nav className='flex space-x-2'>
            <button
              onClick={() => setSelectedTab('overview')}
              className={`flex-1 py-4 px-6 font-semibold text-lg rounded-xl transition-all duration-300 ${
                selectedTab === 'overview'
                  ? 'bg-white text-gray-900 shadow-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              Tour Overview
            </button>
            <button
              onClick={() => setSelectedTab('faq')}
              className={`flex-1 py-4 px-6 font-semibold text-lg rounded-xl transition-all duration-300 ${
                selectedTab === 'faq'
                  ? 'bg-white text-gray-900 shadow-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              FAQs
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div>
          {selectedTab === 'overview' && (
            <motion.div
              className='space-y-16'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              {/* Tour Description */}
              <div className='grid lg:grid-cols-2 gap-12 items-center'>
                <div>
                  <h2 className='text-4xl font-bold text-gray-800 mb-8'>
                    Experience Caribbean Paradise
                  </h2>
                  <div className='prose max-w-none text-gray-700 space-y-6 text-lg leading-relaxed'>
                    <p>
                      Discover the breathtaking beauty of Saona Island, a
                      protected nature reserve and part of Cotubanamá National
                      Park. This paradise island features pristine white-sand
                      beaches, crystal-clear turquoise waters, and swaying palm
                      trees.
                    </p>
                    <p>
                      Our tour combines the best of both worlds: a relaxing
                      catamaran sailing experience on the way to the island and
                      an exhilarating speedboat adventure on the return journey.
                      We'll stop at the famous natural pools where you can
                      observe starfish in their natural habitat.
                    </p>
                  </div>
                </div>
                <div className='relative h-[500px] rounded-3xl overflow-hidden shadow-2xl'>
                  <Image
                    src={GALLERY_IMAGES[1].src}
                    alt='Catamaran sailing to Saona Island'
                    fill
                    className='object-cover'
                  />
                </div>
              </div>

              {/* What's Included Section */}
              <div className='grid md:grid-cols-2 gap-8'>
                <div className='bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-10 border border-gray-200/50'>
                  <h3 className='text-2xl font-bold text-gray-800 mb-8 flex items-center'>
                    <CheckCircle className='mr-4 w-8 h-8 text-green-600' />
                    What's Included
                  </h3>
                  <ul className='space-y-4'>
                    {includedItems.map((item, index) => (
                      <li key={index} className='flex items-start group'>
                        <div className='w-10 h-10 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300'>
                          <item.icon className='w-5 h-5 text-green-600' />
                        </div>
                        <span className='text-lg text-gray-700 font-medium'>
                          {item.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className='bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-10 border border-gray-200/50'>
                  <h3 className='text-2xl font-bold text-gray-800 mb-8 flex items-center'>
                    <AlertCircle className='mr-4 w-8 h-8 text-amber-600' />
                    What to Bring
                  </h3>

                  <div className='space-y-6'>
                    <ul className='space-y-3'>
                      {WHAT_TO_BRING.map((item, index) => (
                        <li
                          key={index}
                          className='flex items-start text-gray-700'
                        >
                          <div className='w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0'>
                            <Check className='w-4 h-4 text-amber-600' />
                          </div>
                          <span className='text-lg'>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {selectedTab === 'faq' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className='bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-10 border border-gray-200/50'>
                <h2 className='text-3xl font-bold text-gray-800 mb-10'>
                  Frequently Asked Questions
                </h2>
                <div className='space-y-6'>
                  {FAQS.map((faq, index) => (
                    <motion.div
                      key={index}
                      className='p-8 rounded-2xl bg-gradient-to-r from-cyan-50 to-blue-50 hover:from-cyan-100 hover:to-blue-100 transition-all duration-300 border border-cyan-200/50'
                      variants={slideIn}
                      whileHover={{ scale: 1.02 }}
                    >
                      <h3 className='font-bold text-gray-800 mb-4 text-lg'>
                        {faq.question}
                      </h3>
                      <p className='text-gray-700 leading-relaxed text-lg'>
                        {faq.answer}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Call to Action Banner 3 - Final booking push */}
        <motion.div
          className='relative overflow-hidden rounded-3xl h-[60vh] shadow-2xl'
          initial='hidden'
          animate='visible'
          variants={fadeIn}
        >
          <Image
            src='https://images.unsplash.com/photo-1615787421738-e980903b0640?q=80&w=1400'
            alt='Paradise beaches of Saona Island'
            fill
            className='object-cover'
          />
          <div className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent' />

          <div className='absolute inset-0 flex items-center justify-center text-center text-white p-12'>
            <div className='max-w-4xl'>
              <motion.h3
                className='text-4xl md:text-5xl font-bold mb-8'
                variants={fadeIn}
              >
                Don't Just Dream of Paradise
              </motion.h3>
              <motion.p
                className='text-xl text-white/90 mb-10 leading-relaxed'
                variants={fadeIn}
              >
                Saona Island is waiting for you. Crystal waters, white sand
                beaches, and memories that will last forever. Book today and
                experience Caribbean paradise.
              </motion.p>
              <motion.div
                className='flex flex-col md:flex-row gap-6 justify-center items-center'
                variants={slideIn}
              >
                <div className='text-center'>
                  <div className='text-4xl font-bold text-white'>
                    ${service.price}
                  </div>
                  <div className='text-white/70 text-lg'>per person</div>
                </div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className='bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-10 py-5 rounded-2xl font-bold text-xl flex items-center gap-4 transition-all duration-300 hover:scale-105 shadow-2xl'
                >
                  <CreditCard className='w-6 h-6' />
                  Book Your Paradise
                  <ArrowRight className='w-6 h-6' />
                </button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Why Choose Our Tour */}
        <motion.div
          className='bg-white/80 backdrop-blur-sm rounded-3xl p-12 border border-gray-200/50 shadow-xl'
          initial='hidden'
          animate='visible'
          variants={fadeIn}
        >
          <div className='text-center mb-12'>
            <h2 className='text-4xl font-bold text-gray-800 mb-6'>
              Why Choose Our Saona Island Tour?
            </h2>
            <p className='text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed'>
              We don't just take you to Saona Island – we create unforgettable
              experiences that showcase the very best of Caribbean paradise.
            </p>
          </div>

          <div className='grid md:grid-cols-3 gap-8 mb-12'>
            {[
              {
                icon: Ship,
                title: 'Dual Adventure Experience',
                description:
                  'Enjoy both catamaran sailing and speedboat thrills in one amazing day',
                gradient: 'from-blue-400 to-cyan-400',
              },
              {
                icon: Heart,
                title: 'Natural Wonder Access',
                description:
                  'Visit exclusive natural pools and pristine beaches away from crowds',
                gradient: 'from-emerald-400 to-teal-400',
              },
              {
                icon: Star,
                title: 'Complete Island Experience',
                description:
                  'Full-day adventure with dining, swimming, snorkeling, and relaxation',
                gradient: 'from-amber-400 to-orange-400',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className='text-center p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:shadow-lg transition-all duration-300'
                variants={slideIn}
                whileHover={{ scale: 1.05 }}
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6`}
                >
                  <feature.icon className='w-8 h-8 text-white' />
                </div>
                <h3 className='text-xl font-bold text-gray-800 mb-4'>
                  {feature.title}
                </h3>
                <p className='text-gray-600 leading-relaxed'>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>

          <div className='grid md:grid-cols-4 gap-8 text-center'>
            <div className='p-6'>
              <div className='text-4xl font-bold text-gray-800 mb-2'>1000+</div>
              <p className='text-gray-600'>Happy Travelers</p>
            </div>
            <div className='p-6'>
              <div className='text-4xl font-bold text-gray-800 mb-2'>4.8/5</div>
              <p className='text-gray-600'>Average Rating</p>
            </div>
            <div className='p-6'>
              <div className='text-4xl font-bold text-gray-800 mb-2'>8h</div>
              <p className='text-gray-600'>Full Day Adventure</p>
            </div>
            <div className='p-6'>
              <div className='text-4xl font-bold text-gray-800 mb-2'>100%</div>
              <p className='text-gray-600'>Satisfaction Rate</p>
            </div>
          </div>
        </motion.div>

        {/* Important Information */}
        <motion.div
          className='bg-amber-50/80 backdrop-blur-sm border border-amber-200 rounded-2xl p-8'
          initial='hidden'
          animate='visible'
          variants={fadeIn}
        >
          <div className='flex items-start'>
            <AlertTriangle className='w-8 h-8 text-amber-600 mr-4 flex-shrink-0 mt-1' />
            <div>
              <h3 className='font-bold text-amber-800 mb-3 text-lg'>
                Important Information
              </h3>
              <div className='text-amber-700 space-y-2'>
                <p>
                  • This tour is subject to weather conditions and may be
                  cancelled for safety reasons
                </p>
                <p>
                  • Please book at least 24 hours in advance to ensure
                  availability
                </p>
                <p>
                  • Pickup times vary by hotel location - we'll confirm your
                  exact time
                </p>
                <p>
                  • Life jackets are provided and required during boat transfers
                </p>
                <p>
                  • The tour is suitable for all ages, but children must be
                  supervised at all times
                </p>
                <p>
                  • Please inform us of any dietary restrictions or medical
                  conditions
                </p>
              </div>
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

export default SaonaIslandTourServiceView;
