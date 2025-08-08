'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookingProvider, useBooking } from '@/context/BookingContext';
import { useTranslation } from '@/lib/i18n/client';
import Navbar from '@/UI/components/shared/Navbar';
import Footer from '@/UI/components/shared/Footer';
import CartSidebar from '@/UI/components/shared/CartSidebar';
import Image from 'next/image';
import Link from 'next/link';
import {
  Check,
  ChevronRight,
  Users,
  Clock,
  Star,
  MapPin,
  Award,
  Wine,
  Sparkles,
  Calendar,
  CheckCircle,
  ArrowRight,
  Loader2,
  Crown,
  Gem,
  Shield,
  Heart,
} from 'lucide-react';
import ServiceList from '@/UI/components/service/ServiceList';
import ServiceManager from '@/constants/services/ServiceManager';

const PremiumPackageContent = () => {
  const { packageType, setPackageType } = useBooking();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load services when component mounts
  useEffect(() => {
    const loadServices = async () => {
      try {
        setIsLoading(true);
        // Ensure package type is set first
        if (packageType !== 'premium') {
          setPackageType('premium');
        }

        // Load services
        const premiumServices = ServiceManager.getByPackageType('premium');
        setServices(premiumServices);
      } catch (error) {
        console.error('Error loading premium services:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadServices();
  }, [packageType, setPackageType]);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Calendar },
    { id: 'services', label: 'Premium Services', icon: Crown },
    { id: 'testimonials', label: 'Testimonials', icon: Users },
    { id: 'faq', label: 'FAQ', icon: CheckCircle },
  ];

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900'>
      <Navbar />

      {/* Enhanced Premium Hero Section */}
      <section className='relative min-h-[90vh] flex items-center justify-center overflow-hidden'>
        {/* Enhanced background with multiple layers */}
        <div className='absolute inset-0 z-0'>
          <Image
            src='/img/saona-island/saona-3.jpg'
            alt='Punta Cana Luxe'
            fill
            className='object-cover scale-105'
            quality={100}
            priority
          />
          <div className='absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/40'></div>
          <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50'></div>
        </div>

        {/* Luxury floating elements */}
        <div className='absolute top-20 right-20 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl animate-pulse'></div>
        <div className='absolute bottom-20 left-20 w-48 h-48 bg-yellow-500/10 rounded-full blur-3xl animate-pulse delay-1000'></div>
        <div className='absolute top-1/2 left-1/2 w-32 h-32 bg-amber-400/5 rounded-full blur-2xl animate-pulse delay-500'></div>

        <div className='container mx-auto px-6 relative z-20 py-24'>
          <motion.div
            initial='hidden'
            animate='visible'
            variants={staggerContainer}
            className='max-w-4xl mx-auto text-center'
          >
            <motion.div
              variants={fadeInUp}
              className='inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 mb-8 border border-amber-400/30 backdrop-blur-sm'
            >
              <Crown className='w-5 h-5 mr-2' />
              PREMIUM LUXURY EXPERIENCE
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className='text-5xl md:text-8xl font-extrabold text-white mb-6 leading-tight'
            >
              Punta Cana{' '}
              <span className='bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 bg-clip-text text-transparent'>
                Luxe
              </span>
              {/* <span className='block text-3xl md:text-5xl font-normal text-amber-300 mt-4'>
                Ultimate Premium Experience
              </span> */}
            </motion.h1>

            <motion.div
              variants={fadeInUp}
              className='flex items-center justify-center mb-8'
            >
              <div className='flex mr-4'>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className='h-7 w-7 text-amber-400 fill-amber-400 drop-shadow-lg'
                  />
                ))}
              </div>
              <span className='text-gray-200 text-lg font-medium'>
                5.0 Exclusive Rating • Elite Experience
              </span>
            </motion.div>

            <motion.p
              variants={fadeInUp}
              className='text-xl md:text-2xl text-gray-200 mb-12 leading-relaxed max-w-3xl mx-auto'
            >
              Indulge in the ultimate Dominican Republic experience with our
              premium package. Elevate your vacation with exclusive luxuries,
              personalized service, and unforgettable moments from arrival to
              departure.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className='flex flex-col sm:flex-row gap-6 justify-center'
            >
              {/* <Link href='/custom-package'>
                <button className='group px-10 py-5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-bold rounded-2xl transition-all duration-300 flex items-center shadow-2xl shadow-amber-500/30 text-lg transform hover:scale-105'>
                  Explore Custom Package
                  <ChevronRight className='ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform' />
                </button>
              </Link> */}

              <Link href='/standard-package'>
                <button className='group px-10 py-5 bg-white/10 backdrop-blur-sm border-2 border-amber-400/30 hover:border-amber-400/50 hover:bg-amber-400/10 text-amber-300 font-bold rounded-2xl transition-all duration-300 flex items-center text-lg'>
                  Explore Standard Experience
                  <ArrowRight className='ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform' />
                </button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Premium Navigation Tabs */}
      <section className='sticky top-16 bg-black/90 backdrop-blur-lg z-30 border-b border-amber-400/30 shadow-2xl'>
        <div className='container mx-auto px-6'>
          <div className='flex overflow-x-auto scrollbar-hide py-2'>
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group flex items-center px-6 py-4 font-bold transition-all duration-300 whitespace-nowrap relative ${
                    activeTab === tab.id
                      ? 'text-amber-400'
                      : 'text-gray-400 hover:text-amber-300'
                  }`}
                >
                  <IconComponent
                    className={`w-5 h-5 mr-2 transition-colors ${
                      activeTab === tab.id
                        ? 'text-amber-400'
                        : 'text-gray-500 group-hover:text-amber-400'
                    }`}
                  />
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId='premiumActiveTab'
                      className='absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full'
                      initial={false}
                      transition={{
                        type: 'spring',
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <AnimatePresence mode='wait'>
        {activeTab === 'overview' && (
          <motion.section
            key='overview'
            initial='hidden'
            animate='visible'
            exit='hidden'
            variants={fadeIn}
            className='py-20 bg-gradient-to-b from-gray-900 via-black to-gray-800 text-white'
          >
            {isLoading ? (
              <div className='container mx-auto px-6'>
                <div className='flex items-center justify-center py-20'>
                  <div className='text-center'>
                    <Loader2 className='w-12 h-12 animate-spin text-amber-400 mx-auto mb-4' />
                    <p className='text-gray-300 text-lg'>
                      Loading your exclusive experiences...
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className='container mx-auto px-6'>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className='text-center mb-16'
                >
                  <h2 className='text-4xl md:text-6xl font-bold text-white mb-6'>
                    Your Premium Experience
                  </h2>
                  <p className='text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed'>
                    Indulge in the ultimate luxury with our handpicked premium
                    services. Every moment is crafted for discerning travelers
                    who demand nothing but the finest.
                  </p>
                </motion.div>

                <div className='max-w-6xl mx-auto mb-16'>
                  <div className='grid md:grid-cols-2 gap-12'>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h3 className='text-2xl font-bold text-amber-400 mb-6 flex items-center'>
                        <Gem className='w-6 h-6 mr-2' />
                        The Ultimate Punta Cana Experience
                      </h3>
                      <p className='text-gray-300 mb-6 leading-relaxed text-lg'>
                        Our Punta Cana Luxe package redefines the Dominican
                        vacation experience, offering an exclusive journey into
                        luxury and personalized service. From your arrival in a
                        premium SUV to unforgettable days aboard your private
                        yacht, every moment is crafted for maximum enjoyment.
                      </p>
                      <p className='text-gray-300 mb-8 leading-relaxed text-lg'>
                        Perfect for discerning travelers, honeymooners, or
                        anyone celebrating a special occasion who desires the
                        very best that Punta Cana has to offer. Every detail is
                        meticulously arranged by our dedicated concierge team.
                      </p>

                      <div className='flex items-center space-x-2 text-amber-400 font-bold text-lg'>
                        <Sparkles className='h-6 w-6' />
                        <span>Limited availability - Reserve early</span>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className='grid grid-cols-2 gap-6'
                    >
                      <div className='bg-gradient-to-br from-amber-500/20 to-yellow-500/20 p-6 rounded-2xl border border-amber-400/30 backdrop-blur-sm'>
                        <h4 className='font-bold text-amber-400 mb-3 flex items-center text-lg'>
                          <Clock className='h-5 w-5 mr-2' />
                          Duration
                        </h4>
                        <p className='text-gray-200 font-medium'>
                          Flexible (5-14 days)
                        </p>
                      </div>

                      <div className='bg-gradient-to-br from-amber-500/20 to-yellow-500/20 p-6 rounded-2xl border border-amber-400/30 backdrop-blur-sm'>
                        <h4 className='font-bold text-amber-400 mb-3 flex items-center text-lg'>
                          <Users className='h-5 w-5 mr-2' />
                          Group Size
                        </h4>
                        <p className='text-gray-200 font-medium'>1-8 people</p>
                      </div>

                      <div className='bg-gradient-to-br from-amber-500/20 to-yellow-500/20 p-6 rounded-2xl border border-amber-400/30 backdrop-blur-sm'>
                        <h4 className='font-bold text-amber-400 mb-3 flex items-center text-lg'>
                          <MapPin className='h-5 w-5 mr-2' />
                          Location
                        </h4>
                        <p className='text-gray-200 font-medium'>
                          Punta Cana, Dominican Republic
                        </p>
                      </div>

                      <div className='bg-gradient-to-br from-amber-500/20 to-yellow-500/20 p-6 rounded-2xl border border-amber-400/30 backdrop-blur-sm'>
                        <h4 className='font-bold text-amber-400 mb-3 flex items-center text-lg'>
                          <Wine className='h-5 w-5 mr-2' />
                          Services
                        </h4>
                        <p className='text-gray-200 font-medium'>
                          All-inclusive premium
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </div>

                <ServiceList
                  services={services}
                  servicePath='premium-package'
                  variant='dark'
                  textColor='white'
                  viewContext='premium-view'
                />
              </div>
            )}
          </motion.section>
        )}

        {activeTab === 'services' && (
          <motion.section
            key='services'
            initial='hidden'
            animate='visible'
            exit='hidden'
            variants={fadeIn}
            className='py-20 bg-gradient-to-b from-gray-800 via-gray-900 to-black text-white'
          >
            <div className='container mx-auto px-6'>
              <div className='max-w-6xl mx-auto'>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className='text-center mb-16'
                >
                  <h2 className='text-4xl md:text-6xl font-bold text-white mb-6'>
                    Premium Services
                  </h2>
                  <p className='text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed'>
                    Our Punta Cana Luxe package includes these exclusive
                    services designed to deliver the ultimate Caribbean
                    experience.
                  </p>
                </motion.div>

                <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16'>
                  {/* Luxury Arrival */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className='group bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-2xl hover:shadow-amber-500/20 transition-all duration-500 overflow-hidden border border-gray-700 hover:border-amber-400/50'
                  >
                    <div className='relative h-64 overflow-hidden'>
                      <Image
                        src='/images/services/luxe-arrival.jpg'
                        alt='Luxury SUV Service'
                        fill
                        className='object-cover group-hover:scale-110 transition-transform duration-700'
                      />
                      <div className='absolute inset-0 bg-gradient-to-t from-black/80 to-transparent'></div>
                      <div className='absolute top-4 right-4'>
                        <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-black shadow-lg'>
                          <Crown className='w-3 h-3 mr-1' />
                          PREMIUM
                        </span>
                      </div>
                    </div>
                    <div className='p-8'>
                      <h3 className='text-2xl font-bold text-white mb-4'>
                        Luxe Arrival - SUV Service
                      </h3>
                      <p className='text-gray-300 mb-6 leading-relaxed'>
                        Begin your premium experience the moment you land with
                        our luxury SUV transportation service. Your personal
                        chauffeur will meet you at the airport with a welcome
                        package including cold towels, premium refreshments, and
                        a tablet with pre-loaded information about your stay.
                      </p>
                      <div className='space-y-3'>
                        <div className='flex items-center text-amber-400 font-medium'>
                          <Clock className='h-5 w-5 mr-3' />
                          <span>
                            Dedicated service for entire arrival and departure
                          </span>
                        </div>
                        <div className='flex items-center text-amber-400 font-medium'>
                          <Users className='h-5 w-5 mr-3' />
                          <span>
                            Accommodates up to 6 passengers with luggage
                          </span>
                        </div>
                        <div className='flex items-center text-amber-400 font-medium'>
                          <Check className='h-5 w-5 mr-3' />
                          <span>Premium refreshments and Wi-Fi included</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Private Yacht */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className='group bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-2xl hover:shadow-amber-500/20 transition-all duration-500 overflow-hidden border border-gray-700 hover:border-amber-400/50'
                  >
                    <div className='relative h-64 overflow-hidden'>
                      <Image
                        src='/images/services/luxe-yacht.jpg'
                        alt='Private Yacht Experience'
                        fill
                        className='object-cover group-hover:scale-110 transition-transform duration-700'
                      />
                      <div className='absolute inset-0 bg-gradient-to-t from-black/80 to-transparent'></div>
                      <div className='absolute top-4 right-4'>
                        <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-black shadow-lg'>
                          <Gem className='w-3 h-3 mr-1' />
                          EXCLUSIVE
                        </span>
                      </div>
                    </div>
                    <div className='p-8'>
                      <h3 className='text-2xl font-bold text-white mb-4'>
                        Private Yacht Experience
                      </h3>
                      <p className='text-gray-300 mb-6 leading-relaxed'>
                        Explore the Dominican coastline aboard your private
                        50-foot yacht with professional captain and crew. Visit
                        secluded beaches, snorkel in pristine waters, and enjoy
                        gourmet refreshments prepared by your personal onboard
                        chef.
                      </p>
                      <div className='space-y-3'>
                        <div className='flex items-center text-amber-400 font-medium'>
                          <Clock className='h-5 w-5 mr-3' />
                          <span>
                            Full day (8.5 hours) private yacht charter
                          </span>
                        </div>
                        <div className='flex items-center text-amber-400 font-medium'>
                          <Users className='h-5 w-5 mr-3' />
                          <span>Up to 19 guests with dedicated crew</span>
                        </div>
                        <div className='flex items-center text-amber-400 font-medium'>
                          <Check className='h-5 w-5 mr-3' />
                          <span>
                            Premium open bar, gourmet meal & activities
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Gourmet Chef Experience */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className='group bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-2xl hover:shadow-amber-500/20 transition-all duration-500 overflow-hidden border border-gray-700 hover:border-amber-400/50'
                  >
                    <div className='relative h-64 overflow-hidden'>
                      <Image
                        src='/images/services/luxe-culinary.jpg'
                        alt='Gourmet Chef Experience'
                        fill
                        className='object-cover group-hover:scale-110 transition-transform duration-700'
                      />
                      <div className='absolute inset-0 bg-gradient-to-t from-black/80 to-transparent'></div>
                      <div className='absolute top-4 right-4'>
                        <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-black shadow-lg'>
                          <Crown className='w-3 h-3 mr-1' />
                          PREMIUM
                        </span>
                      </div>
                    </div>
                    <div className='p-8'>
                      <h3 className='text-2xl font-bold text-white mb-4'>
                        Gourmet Chef Experience
                      </h3>
                      <p className='text-gray-300 mb-6 leading-relaxed'>
                        Enjoy the culinary talents of an executive chef who will
                        create a personalized multi-course dining experience in
                        your accommodation. Using the finest local and imported
                        ingredients, paired with premium wines.
                      </p>
                      <div className='space-y-3'>
                        <div className='flex items-center text-amber-400 font-medium'>
                          <Clock className='h-5 w-5 mr-3' />
                          <span>
                            4-hour dining experience with service staff
                          </span>
                        </div>
                        <div className='flex items-center text-amber-400 font-medium'>
                          <Users className='h-5 w-5 mr-3' />
                          <span>
                            Customized menu consultation prior to stay
                          </span>
                        </div>
                        <div className='flex items-center text-amber-400 font-medium'>
                          <Check className='h-5 w-5 mr-3' />
                          <span>Wine pairing and premium table setting</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Luxury Massage */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className='group bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-2xl hover:shadow-amber-500/20 transition-all duration-500 overflow-hidden border border-gray-700 hover:border-amber-400/50'
                  >
                    <div className='relative h-64 overflow-hidden'>
                      <Image
                        src='/images/services/luxe-masseuse.jpg'
                        alt='Luxury Massage Service'
                        fill
                        className='object-cover group-hover:scale-110 transition-transform duration-700'
                      />
                      <div className='absolute inset-0 bg-gradient-to-t from-black/80 to-transparent'></div>
                      <div className='absolute top-4 right-4'>
                        <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-black shadow-lg'>
                          <Heart className='w-3 h-3 mr-1' />
                          WELLNESS
                        </span>
                      </div>
                    </div>
                    <div className='p-8'>
                      <h3 className='text-2xl font-bold text-white mb-4'>
                        Luxury Massage Service
                      </h3>
                      <p className='text-gray-300 mb-6 leading-relaxed'>
                        Transform your accommodation into a private spa with our
                        premium massage service. Our elite therapists use
                        organic oils and techniques tailored to your
                        preferences, including aromatherapy and wellness
                        consultation.
                      </p>
                      <div className='space-y-3'>
                        <div className='flex items-center text-amber-400 font-medium'>
                          <Clock className='h-5 w-5 mr-3' />
                          <span>
                            2-hour premium massage and wellness service
                          </span>
                        </div>
                        <div className='flex items-center text-amber-400 font-medium'>
                          <Users className='h-5 w-5 mr-3' />
                          <span>Available for all guests in your party</span>
                        </div>
                        <div className='flex items-center text-amber-400 font-medium'>
                          <Check className='h-5 w-5 mr-3' />
                          <span>
                            Choice of techniques and specialty treatments
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Premium Extras */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className='mb-16'
                >
                  <h3 className='text-3xl font-bold text-amber-400 mb-8 text-center flex items-center justify-center'>
                    <Sparkles className='w-8 h-8 mr-3' />
                    Additional Premium Perks
                  </h3>

                  <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-6'>
                    {[
                      {
                        title: 'Welcome Package',
                        description:
                          'Premium welcome basket with local specialties, champagne, and personalized itinerary.',
                        icon: Gem,
                      },
                      {
                        title: 'Concierge Service',
                        description:
                          '24/7 dedicated concierge to handle any request or special arrangement during your stay.',
                        icon: Shield,
                      },
                      {
                        title: 'Priority Reservations',
                        description:
                          'VIP access and priority booking at top restaurants and attractions in Punta Cana.',
                        icon: Crown,
                      },
                      {
                        title: 'Farewell Gift',
                        description:
                          'Curated selection of premium Dominican products to take home as souvenirs.',
                        icon: Heart,
                      },
                    ].map((perk, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        className='bg-gradient-to-br from-amber-500/10 to-yellow-500/10 p-6 rounded-2xl border border-amber-400/30 hover:border-amber-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/20'
                      >
                        <div className='flex items-center mb-4'>
                          <div className='w-12 h-12 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 flex items-center justify-center mr-3'>
                            <perk.icon className='h-6 w-6 text-black' />
                          </div>
                          <h4 className='text-lg font-bold text-amber-400'>
                            {perk.title}
                          </h4>
                        </div>
                        <p className='text-gray-300 leading-relaxed'>
                          {perk.description}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.section>
        )}

        {activeTab === 'testimonials' && (
          <motion.section
            key='testimonials'
            initial='hidden'
            animate='visible'
            exit='hidden'
            variants={fadeIn}
            className='py-20 bg-gradient-to-b from-black via-gray-900 to-gray-800 text-white'
          >
            <div className='container mx-auto px-6'>
              <div className='max-w-6xl mx-auto'>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className='text-center mb-16'
                >
                  <h2 className='text-4xl md:text-6xl font-bold text-white mb-6'>
                    Guest Testimonials
                  </h2>
                  <p className='text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed'>
                    Discover what our premium guests have to say about their
                    luxury experience with Punta Cana Luxe.
                  </p>
                </motion.div>

                <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
                  {[
                    {
                      rating: 5,
                      text: 'Our Punta Cana Luxe experience was absolutely magnificent. From the moment we were picked up at the airport in that beautiful SUV, we knew we were in for something special. The yacht day was beyond anything we could have imagined - the crew was exceptional and the private coves they took us to were paradise. Worth every penny for a truly unforgettable anniversary.',
                      name: 'Robert & Lisa Johnson',
                      location: 'Anniversary Celebration, New York',
                      initials: 'RL',
                      gradient: 'from-amber-500 to-yellow-500',
                    },
                    {
                      rating: 5,
                      text: "I've stayed at luxury resorts worldwide, but Punta Cana Luxe brought personalization to another level. The concierge anticipated needs I didn't even know I had. The private yacht experience was seamless - I've been on many yacht charters, and this rivaled the best of them. This is how vacation should be done.",
                      name: 'Emily Chen',
                      location: 'Solo Luxury Traveler, San Francisco',
                      initials: 'EC',
                      gradient: 'from-purple-500 to-pink-500',
                    },
                    {
                      rating: 5,
                      text: "We booked the Punta Cana Luxe package for our parents' 40th anniversary and they haven't stopped talking about it. The concierge even helped us arrange a surprise renewal of vows ceremony on the beach with a photographer. The attention to detail and personalized service exceeded all expectations.",
                      name: 'Michael Rodriguez',
                      location: 'Family Celebration, Chicago',
                      initials: 'MR',
                      gradient: 'from-green-500 to-emerald-500',
                    },
                  ].map((testimonial, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.1 }}
                      className='bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 shadow-2xl border border-gray-700 hover:border-amber-400/30 transition-all duration-300'
                    >
                      <div className='flex items-center mb-6'>
                        <div className='flex mr-3'>
                          {Array(testimonial.rating)
                            .fill(0)
                            .map((_, i) => (
                              <Star
                                key={i}
                                className='h-6 w-6 text-amber-400 fill-amber-400'
                              />
                            ))}
                        </div>
                        <span className='text-gray-400 font-bold'>
                          {testimonial.rating}.0
                        </span>
                      </div>
                      <p className='text-gray-300 italic mb-8 leading-relaxed text-lg'>
                        "{testimonial.text}"
                      </p>
                      <div className='flex items-center'>
                        <div
                          className={`h-16 w-16 rounded-full bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center text-black font-bold text-xl mr-4 shadow-lg`}
                        >
                          {testimonial.initials}
                        </div>
                        <div>
                          <h4 className='font-bold text-white text-lg'>
                            {testimonial.name}
                          </h4>
                          <p className='text-gray-400'>
                            {testimonial.location}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {activeTab === 'faq' && (
          <motion.section
            key='faq'
            initial='hidden'
            animate='visible'
            exit='hidden'
            variants={fadeIn}
            className='py-20 bg-gradient-to-b from-gray-800 via-black to-gray-900 text-white'
          >
            <div className='container mx-auto px-6'>
              <div className='max-w-4xl mx-auto'>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className='text-center mb-16'
                >
                  <h2 className='text-4xl md:text-6xl font-bold text-white mb-6'>
                    Frequently Asked Questions
                  </h2>
                  <p className='text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed'>
                    Find answers to common questions about our Punta Cana Luxe
                    premium package.
                  </p>
                </motion.div>

                <div className='space-y-6'>
                  {[
                    {
                      question:
                        'What makes the premium package different from the standard package?',
                      answer:
                        'The premium package offers exclusive upgrades on all services, including a luxury SUV for airport transfers, a private yacht experience instead of a group catamaran trip, gourmet dining with a personal executive chef, additional wellness services, and 24/7 dedicated concierge support. Every aspect is enhanced for maximum luxury and personalization.',
                    },
                    {
                      question:
                        'Is the premium package worth the additional cost?',
                      answer:
                        'For travelers seeking a truly exceptional vacation experience, the premium upgrade delivers significant value. The private yacht alone represents a considerable upgrade from the group catamaran experience. When combined with the personal chef, massage service, 24/7 concierge, and upgraded transportation, the premium package creates a seamless luxury experience that our guests consistently rate as exceptional value.',
                    },
                    {
                      question: 'How customizable is the premium package?',
                      answer:
                        'The premium package is highly customizable. While it includes our core luxury services, our dedicated concierge works with you before and during your stay to tailor each experience to your preferences. From menu planning with the chef to specific destinations for your yacht journey, the premium package can be adjusted to match your exact desires.',
                    },
                    {
                      question:
                        'Can I add additional yacht days or chef experiences?',
                      answer:
                        'Absolutely. Additional yacht days, chef experiences, and massage services can be added for an extra charge. Many of our premium guests choose to extend these signature experiences, particularly the yacht days. Your concierge can arrange any additional services with preferential rates for premium package guests.',
                    },
                    {
                      question:
                        'How far in advance should I book the premium package?',
                      answer:
                        'We recommend booking the premium package at least 60 days in advance to ensure availability of all luxury services, particularly during high season (December-April). This lead time also allows our team to thoroughly prepare your personalized experience. Due to limited availability of our premium services, last-minute bookings cannot always be accommodated.',
                    },
                    {
                      question:
                        "What's the cancellation policy for the premium package?",
                      answer:
                        'For premium packages, we offer a full refund for cancellations 45+ days before arrival, 50% refund for cancellations 30-44 days before arrival, and no refund for cancellations less than 30 days before arrival. We strongly recommend travel insurance for all premium bookings. Special consideration may be given for extreme circumstances.',
                    },
                  ].map((faq, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className='bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 shadow-xl border border-gray-700 hover:border-amber-400/30 transition-all duration-300'
                    >
                      <h3 className='text-xl font-bold text-amber-400 mb-4'>
                        {faq.question}
                      </h3>
                      <p className='text-gray-300 leading-relaxed text-lg'>
                        {faq.answer}
                      </p>
                    </motion.div>
                  ))}
                </div>

                {/* Contact for More Questions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className='mt-16 text-center p-8 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 rounded-3xl border border-amber-400/30'
                >
                  <h3 className='text-2xl font-bold text-amber-400 mb-4'>
                    Still Have Questions?
                  </h3>
                  <p className='text-gray-300 mb-8 text-lg'>
                    Our luxury concierge team is here to help you plan your
                    perfect premium experience.
                  </p>
                  <Link href='/contact'>
                    <button className='inline-flex items-center px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-bold rounded-2xl transition-all duration-300 shadow-lg transform hover:scale-105'>
                      Contact Our Concierge Team
                      <ArrowRight className='ml-2 h-5 w-5' />
                    </button>
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Enhanced Premium CTA Section */}
      <section className='py-20 bg-gradient-to-br from-black via-amber-900/20 to-black relative overflow-hidden'>
        {/* Enhanced background effects */}
        <div className='absolute inset-0 bg-gradient-to-br from-amber-900/30 to-black/90 z-10'></div>
        <div className='absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl'></div>
        <div className='absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl'></div>
        <div className='absolute top-1/2 left-1/2 w-64 h-64 bg-amber-400/5 rounded-full blur-2xl'></div>

        {/* Background image */}
        <div className='absolute inset-0 z-0 opacity-20'>
          <Image
            src='/img/beach.jpg'
            alt='Luxury Yacht Sunset'
            fill
            className='object-cover'
          />
        </div>

        <div className='container mx-auto px-6 relative z-20'>
          <div className='max-w-4xl mx-auto text-center'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className='text-4xl md:text-7xl font-bold text-white mb-8 leading-tight'>
                Experience Ultimate Luxury
              </h2>
              <p className='text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed'>
                Book your Punta Cana Luxe package now and indulge in the most
                exclusive Caribbean experience with personalized service and
                premium amenities.
              </p>

              <div className='flex flex-col sm:flex-row gap-6 justify-center'>
                {/* <Link href='/custom-package'>
                  <button className='group px-10 py-5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-bold rounded-2xl transition-all duration-300 shadow-2xl shadow-amber-500/30 text-lg transform hover:scale-105'>
                    Customize Your Package
                    <ArrowRight className='ml-2 h-6 w-6 inline group-hover:translate-x-1 transition-transform' />
                  </button>
                </Link> */}
                <Link href='/contact'>
                  <button className='group px-10 py-5 bg-gradient-to-r from-amber-400/20 to-yellow-400/20 backdrop-blur-sm border-2 border-amber-400 hover:border-amber-300 hover:bg-amber-400/30 text-amber-300 font-bold rounded-2xl transition-all duration-300 text-lg transform hover:scale-105'>
                    Contact Concierge
                    <Crown className='ml-2 h-6 w-6 inline group-hover:rotate-12 transition-transform' />
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <CartSidebar />
      <Footer />
    </div>
  );
};

const PremiumPackage = () => {
  return (
    <BookingProvider>
      <PremiumPackageContent />
    </BookingProvider>
  );
};

export default PremiumPackage;
