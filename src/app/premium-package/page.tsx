'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';
import ServiceList from '@/UI/components/service/ServiceList';
import ServiceManager from '@/constants/services/ServiceManager';

const PremiumPackage = () => {
  const { packageType, setPackageType } = useBooking();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');

  // Get premium services using the new ServiceManager
  const premiumServices = ServiceManager.getByPackageType('premium');

  // Ensure package type is set to 'premium'
  React.useEffect(() => {
    if (packageType !== 'premium') {
      setPackageType('premium');
    }
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

  return (
    <BookingProvider>
      <div className='min-h-screen bg-black'>
        <Navbar />

        {/* Hero Section with Luxurious Background Image */}
        <section className='relative min-h-[85vh] flex items-center justify-center'>
          <div className='absolute inset-0 bg-black/50 z-10'></div>
          <div className='absolute inset-0 z-0'>
            <Image
              src='/images/premium-package-hero.jpg'
              alt='Punta Cana Luxe'
              fill
              className='object-cover'
              quality={90}
              priority
            />
          </div>

          {/* Decorative elements */}
          <div className='absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-black to-transparent z-20'></div>
          <div className='absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black to-transparent z-20'></div>

          <div className='container mx-auto px-6 relative z-20 py-24'>
            <motion.div
              initial='hidden'
              animate='visible'
              variants={staggerContainer}
              className='max-w-3xl'
            >
              <motion.div
                variants={fadeInUp}
                className='flex items-center mb-6'
              >
                <div className='mr-3 p-1 rounded-full bg-amber-500/20 backdrop-blur-sm'>
                  <Award className='h-6 w-6 text-amber-400' />
                </div>
                <span className='text-amber-300 font-medium uppercase tracking-wider text-sm'>
                  PREMIUM LUXURY EXPERIENCE
                </span>
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className='text-4xl md:text-6xl font-bold text-white mb-6 leading-tight'
              >
                Punta Cana <span className='text-amber-400'>Luxe</span>
              </motion.h1>

              <motion.div
                variants={fadeInUp}
                className='flex items-center mb-8'
              >
                <div className='flex mr-3'>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className='h-5 w-5 text-amber-400 fill-amber-400'
                    />
                  ))}
                </div>
                <span className='text-gray-300'>
                  5.0 rating • Exclusive Experience
                </span>
              </motion.div>

              <motion.p
                variants={fadeInUp}
                className='text-xl text-gray-200 mb-10 leading-relaxed'
              >
                Indulge in the ultimate Dominican Republic experience with our
                premium package. Elevate your vacation with exclusive luxuries,
                personalized service, and unforgettable moments from arrival to
                departure.
              </motion.p>

              <motion.div variants={fadeInUp} className='flex flex-wrap gap-4'>
                <Link href='#included-services'>
                  <button className='px-6 py-3 bg-amber-500 hover:bg-amber-600 text-black font-medium rounded-lg transition-colors flex items-center shadow-lg shadow-amber-500/20'>
                    Explore Premium Services
                    <ChevronRight className='ml-2 h-5 w-5' />
                  </button>
                </Link>

                <Link href='/custom-package'>
                  <button className='px-6 py-3 bg-transparent border border-white/30 hover:border-white text-white font-medium rounded-lg transition-colors flex items-center'>
                    Customize Your Experience
                  </button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Navigation Tabs */}
        <section className='sticky top-16 bg-black z-30 border-b border-gray-800 shadow-lg'>
          <div className='container mx-auto px-6'>
            <div className='flex overflow-x-auto scrollbar-hide py-1'>
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-5 py-4 font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'overview'
                    ? 'text-amber-400 border-b-2 border-amber-400'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('services')}
                className={`px-5 py-4 font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'services'
                    ? 'text-amber-400 border-b-2 border-amber-400'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                Premium Services
              </button>
              <button
                onClick={() => setActiveTab('testimonials')}
                className={`px-5 py-4 font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'testimonials'
                    ? 'text-amber-400 border-b-2 border-amber-400'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                Testimonials
              </button>
              <button
                onClick={() => setActiveTab('faq')}
                className={`px-5 py-4 font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'faq'
                    ? 'text-amber-400 border-b-2 border-amber-400'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                FAQ
              </button>
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
              className='py-16 bg-gradient-to-b from-gray-900 to-black text-white'
            >
              <div className='container mx-auto px-6'>
                <div className='max-w-4xl mx-auto'>
                  <h2 className='text-3xl font-bold text-white mb-8'>
                    Premium Experience Overview
                  </h2>

                  <div className='grid md:grid-cols-2 gap-12 mb-16'>
                    <div>
                      <h3 className='text-xl font-semibold text-white mb-4'>
                        The Ultimate Punta Cana Experience
                      </h3>
                      <p className='text-gray-300 mb-6 leading-relaxed'>
                        Our Punta Cana Luxe package redefines the Dominican
                        vacation experience, offering an exclusive journey into
                        luxury and personalized service. From your arrival in a
                        premium SUV to unforgettable days aboard your private
                        yacht, every moment is crafted for maximum enjoyment.
                      </p>
                      <p className='text-gray-300 mb-6 leading-relaxed'>
                        Perfect for discerning travelers, honeymooners, or
                        anyone celebrating a special occasion who desires the
                        very best that Punta Cana has to offer. Every detail is
                        meticulously arranged by our dedicated concierge team.
                      </p>

                      <div className='flex items-center space-x-2 text-amber-400 font-medium'>
                        <Sparkles className='h-5 w-5' />
                        <span>Limited availability - Reserve early</span>
                      </div>
                    </div>

                    <div className='grid grid-cols-2 gap-4'>
                      <div className='bg-gray-800 p-4 rounded-lg border border-gray-700'>
                        <h4 className='font-medium text-white mb-2 flex items-center'>
                          <Clock className='h-4 w-4 mr-2 text-amber-400' />
                          Duration
                        </h4>
                        <p className='text-gray-300'>Flexible (5-14 days)</p>
                      </div>

                      <div className='bg-gray-800 p-4 rounded-lg border border-gray-700'>
                        <h4 className='font-medium text-white mb-2 flex items-center'>
                          <Users className='h-4 w-4 mr-2 text-amber-400' />
                          Group Size
                        </h4>
                        <p className='text-gray-300'>1-8 people</p>
                      </div>

                      <div className='bg-gray-800 p-4 rounded-lg border border-gray-700'>
                        <h4 className='font-medium text-white mb-2 flex items-center'>
                          <MapPin className='h-4 w-4 mr-2 text-amber-400' />
                          Location
                        </h4>
                        <p className='text-gray-300'>
                          Punta Cana, Dominican Republic
                        </p>
                      </div>

                      <div className='bg-gray-800 p-4 rounded-lg border border-gray-700'>
                        <h4 className='font-medium text-white mb-2 flex items-center'>
                          <Wine className='h-4 w-4 mr-2 text-amber-400' />
                          Services
                        </h4>
                        <p className='text-gray-300'>All-inclusive premium</p>
                      </div>
                    </div>
                  </div>
                </div>
                <ServiceList
                  services={premiumServices}
                  variant='dark'
                  textColor='white'
                  viewContext='premium-view'
                />
              </div>
            </motion.section>
          )}

          {activeTab === 'services' && (
            <motion.section
              key='services'
              initial='hidden'
              animate='visible'
              exit='hidden'
              variants={fadeIn}
              id='included-services'
              className='py-16 bg-gradient-to-b from-gray-900 to-black text-white'
            >
              <div className='container mx-auto px-6'>
                <div className='max-w-4xl mx-auto'>
                  <h2 className='text-3xl font-bold text-white mb-4'>
                    Premium Services
                  </h2>
                  <p className='text-gray-300 mb-12 text-lg'>
                    Our Punta Cana Luxe package includes these exclusive
                    services designed to deliver the ultimate Caribbean
                    experience.
                  </p>

                  <div className='grid grid-cols-1 gap-8 mb-16'>
                    {/* Luxury Arrival */}
                    <div className='bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden border border-gray-700 shadow-lg group hover:border-amber-500/50 transition-all duration-300'>
                      <div className='md:flex'>
                        <div className='md:w-1/3 h-64 md:h-auto relative overflow-hidden'>
                          <Image
                            src='/images/services/luxe-arrival.jpg'
                            alt='Luxury SUV Service'
                            fill
                            className='object-cover transition-transform duration-700 group-hover:scale-110'
                          />
                          <div className='absolute inset-0 bg-gradient-to-r from-black to-transparent md:bg-gradient-to-t'></div>
                        </div>
                        <div className='p-8 md:w-2/3 relative'>
                          <div className='absolute top-6 right-6'>
                            <span className='bg-amber-400/20 text-amber-400 text-xs px-3 py-1 rounded-full font-medium border border-amber-400/20'>
                              PREMIUM
                            </span>
                          </div>
                          <div className='flex justify-between items-start mb-4'>
                            <h3 className='text-xl font-bold text-white'>
                              Luxe Arrival - SUV Service
                            </h3>
                          </div>
                          <p className='text-gray-300 mb-6'>
                            Begin your premium experience the moment you land
                            with our luxury SUV transportation service. Your
                            personal chauffeur will meet you at the airport with
                            a welcome package including cold towels, premium
                            refreshments, and a tablet with pre-loaded
                            information about your stay.
                          </p>
                          <div className='space-y-2'>
                            <div className='flex items-center text-sm text-gray-400'>
                              <Clock className='h-4 w-4 mr-2 text-amber-400' />
                              <span>
                                Dedicated service for your entire arrival and
                                departure
                              </span>
                            </div>
                            <div className='flex items-center text-sm text-gray-400'>
                              <Users className='h-4 w-4 mr-2 text-amber-400' />
                              <span>
                                Accommodates up to 6 passengers with luggage
                              </span>
                            </div>
                            <div className='flex items-center text-sm text-gray-400'>
                              <Check className='h-4 w-4 mr-2 text-amber-400' />
                              <span>
                                Includes premium refreshments and Wi-Fi
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Luxury Yacht */}
                    <div className='bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden border border-gray-700 shadow-lg group hover:border-amber-500/50 transition-all duration-300'>
                      <div className='md:flex'>
                        <div className='md:w-1/3 h-64 md:h-auto relative overflow-hidden'>
                          <Image
                            src='/images/services/luxe-yacht.jpg'
                            alt='Private Yacht Experience'
                            fill
                            className='object-cover transition-transform duration-700 group-hover:scale-110'
                          />
                          <div className='absolute inset-0 bg-gradient-to-r from-black to-transparent md:bg-gradient-to-t'></div>
                        </div>
                        <div className='p-8 md:w-2/3 relative'>
                          <div className='absolute top-6 right-6'>
                            <span className='bg-amber-400/20 text-amber-400 text-xs px-3 py-1 rounded-full font-medium border border-amber-400/20'>
                              EXCLUSIVE
                            </span>
                          </div>
                          <div className='flex justify-between items-start mb-4'>
                            <h3 className='text-xl font-bold text-white'>
                              Private Yacht Experience
                            </h3>
                          </div>
                          <p className='text-gray-300 mb-6'>
                            Explore the Dominican coastline aboard your private
                            50-foot yacht with professional captain and crew.
                            Visit secluded beaches, snorkel in pristine waters,
                            and enjoy gourmet refreshments prepared by your
                            personal onboard chef. This full-day experience is
                            the highlight of the premium package.
                          </p>
                          <div className='space-y-2'>
                            <div className='flex items-center text-sm text-gray-400'>
                              <Clock className='h-4 w-4 mr-2 text-amber-400' />
                              <span>
                                Full day (8.5 hours) of private yacht charter
                              </span>
                            </div>
                            <div className='flex items-center text-sm text-gray-400'>
                              <Users className='h-4 w-4 mr-2 text-amber-400' />
                              <span>
                                Accommodates up to 19 guests with dedicated crew
                              </span>
                            </div>
                            <div className='flex items-center text-sm text-gray-400'>
                              <Check className='h-4 w-4 mr-2 text-amber-400' />
                              <span>
                                Includes premium open bar, gourmet meal, and
                                water activities
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Gourmet Chef Experience */}
                    <div className='bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden border border-gray-700 shadow-lg group hover:border-amber-500/50 transition-all duration-300'>
                      <div className='md:flex'>
                        <div className='md:w-1/3 h-64 md:h-auto relative overflow-hidden'>
                          <Image
                            src='/images/services/luxe-culinary.jpg'
                            alt='Gourmet Chef Experience'
                            fill
                            className='object-cover transition-transform duration-700 group-hover:scale-110'
                          />
                          <div className='absolute inset-0 bg-gradient-to-r from-black to-transparent md:bg-gradient-to-t'></div>
                        </div>
                        <div className='p-8 md:w-2/3 relative'>
                          <div className='absolute top-6 right-6'>
                            <span className='bg-amber-400/20 text-amber-400 text-xs px-3 py-1 rounded-full font-medium border border-amber-400/20'>
                              PREMIUM
                            </span>
                          </div>
                          <div className='flex justify-between items-start mb-4'>
                            <h3 className='text-xl font-bold text-white'>
                              Gourmet Chef Experience
                            </h3>
                          </div>
                          <p className='text-gray-300 mb-6'>
                            Enjoy the culinary talents of an executive chef who
                            will create a personalized multi-course dining
                            experience in your accommodation. Using the finest
                            local and imported ingredients, this gastronomic
                            journey is paired with premium wines selected by our
                            sommelier.
                          </p>
                          <div className='space-y-2'>
                            <div className='flex items-center text-sm text-gray-400'>
                              <Clock className='h-4 w-4 mr-2 text-amber-400' />
                              <span>
                                4-hour dining experience with dedicated service
                                staff
                              </span>
                            </div>
                            <div className='flex items-center text-sm text-gray-400'>
                              <Users className='h-4 w-4 mr-2 text-amber-400' />
                              <span>
                                Customized menu consultation prior to your stay
                              </span>
                            </div>
                            <div className='flex items-center text-sm text-gray-400'>
                              <Check className='h-4 w-4 mr-2 text-amber-400' />
                              <span>
                                Includes wine pairing and premium table setting
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Luxury Massage Service */}
                    <div className='bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden border border-gray-700 shadow-lg group hover:border-amber-500/50 transition-all duration-300'>
                      <div className='md:flex'>
                        <div className='md:w-1/3 h-64 md:h-auto relative overflow-hidden'>
                          <Image
                            src='/images/services/luxe-masseuse.jpg'
                            alt='Luxury Massage Service'
                            fill
                            className='object-cover transition-transform duration-700 group-hover:scale-110'
                          />
                          <div className='absolute inset-0 bg-gradient-to-r from-black to-transparent md:bg-gradient-to-t'></div>
                        </div>
                        <div className='p-8 md:w-2/3 relative'>
                          <div className='absolute top-6 right-6'>
                            <span className='bg-amber-400/20 text-amber-400 text-xs px-3 py-1 rounded-full font-medium border border-amber-400/20'>
                              PREMIUM
                            </span>
                          </div>
                          <div className='flex justify-between items-start mb-4'>
                            <h3 className='text-xl font-bold text-white'>
                              Luxury Massage Service
                            </h3>
                          </div>
                          <p className='text-gray-300 mb-6'>
                            Transform your accommodation into a private spa with
                            our premium massage service. Our elite therapists
                            use organic oils and techniques tailored to your
                            preferences. The experience includes aromatherapy,
                            soothing music, and a post-treatment wellness
                            consultation.
                          </p>
                          <div className='space-y-2'>
                            <div className='flex items-center text-sm text-gray-400'>
                              <Clock className='h-4 w-4 mr-2 text-amber-400' />
                              <span>
                                2-hour premium massage and wellness service
                              </span>
                            </div>
                            <div className='flex items-center text-sm text-gray-400'>
                              <Users className='h-4 w-4 mr-2 text-amber-400' />
                              <span>
                                Available for all guests in your party
                              </span>
                            </div>
                            <div className='flex items-center text-sm text-gray-400'>
                              <Check className='h-4 w-4 mr-2 text-amber-400' />
                              <span>
                                Includes choice of techniques and specialty
                                treatments
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Luxury Golf Cart */}
                    <div className='bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden border border-gray-700 shadow-lg group hover:border-amber-500/50 transition-all duration-300'>
                      <div className='md:flex'>
                        <div className='md:w-1/3 h-64 md:h-auto relative overflow-hidden'>
                          <Image
                            src='/images/services/luxe-golf-cart.jpg'
                            alt='Luxury Golf Cart'
                            fill
                            className='object-cover transition-transform duration-700 group-hover:scale-110'
                          />
                          <div className='absolute inset-0 bg-gradient-to-r from-black to-transparent md:bg-gradient-to-t'></div>
                        </div>
                        <div className='p-8 md:w-2/3 relative'>
                          <div className='absolute top-6 right-6'>
                            <span className='bg-amber-400/20 text-amber-400 text-xs px-3 py-1 rounded-full font-medium border border-amber-400/20'>
                              PREMIUM
                            </span>
                          </div>
                          <div className='flex justify-between items-start mb-4'>
                            <h3 className='text-xl font-bold text-white'>
                              Luxury Golf Cart
                            </h3>
                          </div>
                          <p className='text-gray-300 mb-6'>
                            Navigate your resort and local area in style with
                            our premium golf cart featuring leather seats,
                            extended battery range, and upgraded features. This
                            luxury transportation option gives you the freedom
                            to explore at your own pace with maximum comfort.
                          </p>
                          <div className='space-y-2'>
                            <div className='flex items-center text-sm text-gray-400'>
                              <Clock className='h-4 w-4 mr-2 text-amber-400' />
                              <span>
                                Available throughout your entire stay (24-hour
                                periods)
                              </span>
                            </div>
                            <div className='flex items-center text-sm text-gray-400'>
                              <Users className='h-4 w-4 mr-2 text-amber-400' />
                              <span>Accommodates up to 6 passengers</span>
                            </div>
                            <div className='flex items-center text-sm text-gray-400'>
                              <Check className='h-4 w-4 mr-2 text-amber-400' />
                              <span>
                                Includes premium features, Bluetooth sound
                                system, and cooler
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Luxe Yoga Sessions */}
                    <div className='bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden border border-gray-700 shadow-lg group hover:border-amber-500/50 transition-all duration-300'>
                      <div className='md:flex'>
                        <div className='md:w-1/3 h-64 md:h-auto relative overflow-hidden'>
                          <Image
                            src='/images/services/luxe-yoga.jpg'
                            alt='Luxe Yoga Sessions'
                            fill
                            className='object-cover transition-transform duration-700 group-hover:scale-110'
                          />
                          <div className='absolute inset-0 bg-gradient-to-r from-black to-transparent md:bg-gradient-to-t'></div>
                        </div>
                        <div className='p-8 md:w-2/3 relative'>
                          <div className='absolute top-6 right-6'>
                            <span className='bg-amber-400/20 text-amber-400 text-xs px-3 py-1 rounded-full font-medium border border-amber-400/20'>
                              PREMIUM
                            </span>
                          </div>
                          <div className='flex justify-between items-start mb-4'>
                            <h3 className='text-xl font-bold text-white'>
                              Luxe Yoga Sessions
                            </h3>
                          </div>
                          <p className='text-gray-300 mb-6'>
                            Elevate your wellness journey with exclusive private
                            yoga sessions held in stunning locations. Our expert
                            instructors provide personalized guidance tailored
                            to your experience level, with premium mats and
                            equipment provided. Each session concludes with
                            fresh organic refreshments.
                          </p>
                          <div className='space-y-2'>
                            <div className='flex items-center text-sm text-gray-400'>
                              <Clock className='h-4 w-4 mr-2 text-amber-400' />
                              <span>
                                90-minute private sessions with certified
                                instructors
                              </span>
                            </div>
                            <div className='flex items-center text-sm text-gray-400'>
                              <Users className='h-4 w-4 mr-2 text-amber-400' />
                              <span>Available for individuals or groups</span>
                            </div>
                            <div className='flex items-center text-sm text-gray-400'>
                              <Check className='h-4 w-4 mr-2 text-amber-400' />
                              <span>
                                Choice of beachfront, garden, or private villa
                                settings
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Premium Extras */}
                  <div className='mb-16'>
                    <h3 className='text-2xl font-bold text-white mb-6'>
                      Additional Premium Perks
                    </h3>

                    <div className='grid sm:grid-cols-2 gap-6'>
                      <div className='bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700 shadow-lg hover:border-amber-500/30 transition-all duration-300'>
                        <h4 className='flex items-center text-lg font-semibold text-white mb-3'>
                          <Sparkles className='h-5 w-5 mr-2 text-amber-400' />
                          Welcome Package
                        </h4>
                        <p className='text-gray-300 text-sm mb-3'>
                          Premium welcome basket with local specialties,
                          champagne, and personalized itinerary.
                        </p>
                      </div>

                      <div className='bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700 shadow-lg hover:border-amber-500/30 transition-all duration-300'>
                        <h4 className='flex items-center text-lg font-semibold text-white mb-3'>
                          <Sparkles className='h-5 w-5 mr-2 text-amber-400' />
                          Concierge Service
                        </h4>
                        <p className='text-gray-300 text-sm mb-3'>
                          24/7 dedicated concierge to handle any request or
                          special arrangement during your stay.
                        </p>
                      </div>

                      <div className='bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700 shadow-lg hover:border-amber-500/30 transition-all duration-300'>
                        <h4 className='flex items-center text-lg font-semibold text-white mb-3'>
                          <Sparkles className='h-5 w-5 mr-2 text-amber-400' />
                          Priority Reservations
                        </h4>
                        <p className='text-gray-300 text-sm mb-3'>
                          VIP access and priority booking at top restaurants and
                          attractions in Punta Cana.
                        </p>
                      </div>

                      <div className='bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700 shadow-lg hover:border-amber-500/30 transition-all duration-300'>
                        <h4 className='flex items-center text-lg font-semibold text-white mb-3'>
                          <Sparkles className='h-5 w-5 mr-2 text-amber-400' />
                          Farewell Gift
                        </h4>
                        <p className='text-gray-300 text-sm mb-3'>
                          Curated selection of premium Dominican products to
                          take home as souvenirs.
                        </p>
                      </div>
                    </div>
                  </div>
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
              className='py-16 bg-gradient-to-b from-gray-900 to-black text-white'
            >
              <div className='container mx-auto px-6'>
                <div className='max-w-4xl mx-auto'>
                  <h2 className='text-3xl font-bold text-white mb-4'>
                    Guest Testimonials
                  </h2>
                  <p className='text-gray-300 mb-12 text-lg'>
                    Discover what our premium guests have to say about their
                    luxury experience with Punta Cana Luxe.
                  </p>

                  <div className='grid gap-8'>
                    {/* Testimonial 1 */}
                    <div className='bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 border border-gray-700 shadow-xl'>
                      <div className='flex items-center mb-6'>
                        <div className='flex mr-2'>
                          {Array(5)
                            .fill(0)
                            .map((_, i) => (
                              <Star
                                key={i}
                                className='h-5 w-5 text-amber-400 fill-amber-400'
                              />
                            ))}
                        </div>
                        <span className='text-gray-400 text-sm'>5.0</span>
                      </div>
                      <p className='text-gray-300 italic mb-8 text-lg leading-relaxed'>
                        "Our Punta Cana Luxe experience was absolutely
                        magnificent. From the moment we were picked up at the
                        airport in that beautiful SUV, we knew we were in for
                        something special. The yacht day was beyond anything we
                        could have imagined - the crew was exceptional and the
                        private coves they took us to were paradise. The
                        in-villa chef prepared the best meal of our lives. Worth
                        every penny for a truly unforgettable anniversary."
                      </p>
                      <div className='flex items-center'>
                        <div className='h-16 w-16 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-black font-bold text-xl mr-4 shadow-lg'>
                          RL
                        </div>
                        <div>
                          <h4 className='font-semibold text-white text-lg'>
                            Robert & Lisa Johnson
                          </h4>
                          <p className='text-gray-400'>
                            Anniversary Celebration, New York
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Testimonial 2 */}
                    <div className='bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 border border-gray-700 shadow-xl'>
                      <div className='flex items-center mb-6'>
                        <div className='flex mr-2'>
                          {Array(5)
                            .fill(0)
                            .map((_, i) => (
                              <Star
                                key={i}
                                className='h-5 w-5 text-amber-400 fill-amber-400'
                              />
                            ))}
                        </div>
                        <span className='text-gray-400 text-sm'>5.0</span>
                      </div>
                      <p className='text-gray-300 italic mb-8 text-lg leading-relaxed'>
                        "I've stayed at luxury resorts worldwide, but Punta Cana
                        Luxe brought personalization to another level. The
                        concierge anticipated needs I didn't even know I had.
                        The private yacht experience was seamless - I've been on
                        many yacht charters, and this rivaled the best of them.
                        The massage therapist was world-class, and the golf cart
                        made exploring so convenient. This is how vacation
                        should be done."
                      </p>
                      <div className='flex items-center'>
                        <div className='h-16 w-16 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-black font-bold text-xl mr-4 shadow-lg'>
                          EC
                        </div>
                        <div>
                          <h4 className='font-semibold text-white text-lg'>
                            Emily Chen
                          </h4>
                          <p className='text-gray-400'>
                            Solo Luxury Traveler, San Francisco
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Testimonial 3 */}
                    <div className='bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 border border-gray-700 shadow-xl'>
                      <div className='flex items-center mb-6'>
                        <div className='flex mr-2'>
                          {Array(5)
                            .fill(0)
                            .map((_, i) => (
                              <Star
                                key={i}
                                className='h-5 w-5 text-amber-400 fill-amber-400'
                              />
                            ))}
                        </div>
                        <span className='text-gray-400 text-sm'>5.0</span>
                      </div>
                      <p className='text-gray-300 italic mb-8 text-lg leading-relaxed'>
                        "We booked the Punta Cana Luxe package for our parents'
                        40th anniversary and they haven't stopped talking about
                        it. Dad particularly loved the private chef experience,
                        while Mom couldn't get enough of the yacht day and
                        massage. The concierge even helped us arrange a surprise
                        renewal of vows ceremony on the beach with a
                        photographer. The attention to detail and personalized
                        service exceeded all expectations."
                      </p>
                      <div className='flex items-center'>
                        <div className='h-16 w-16 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-black font-bold text-xl mr-4 shadow-lg'>
                          MR
                        </div>
                        <div>
                          <h4 className='font-semibold text-white text-lg'>
                            Michael Rodriguez
                          </h4>
                          <p className='text-gray-400'>
                            Family Celebration, Chicago
                          </p>
                        </div>
                      </div>
                    </div>
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
              className='py-16 bg-gradient-to-b from-gray-900 to-black text-white'
            >
              <div className='container mx-auto px-6'>
                <div className='max-w-4xl mx-auto'>
                  <h2 className='text-3xl font-bold text-white mb-4'>
                    Frequently Asked Questions
                  </h2>
                  <p className='text-gray-300 mb-12 text-lg'>
                    Find answers to common questions about our Punta Cana Luxe
                    premium package.
                  </p>

                  <div className='space-y-6'>
                    <div className='bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700'>
                      <h3 className='text-lg font-semibold text-white mb-3'>
                        What makes the premium package different from the
                        standard package?
                      </h3>
                      <p className='text-gray-300'>
                        The premium package offers exclusive upgrades on all
                        services, including a luxury SUV for airport transfers,
                        a private yacht experience instead of a group catamaran
                        trip, gourmet dining with a personal executive chef,
                        additional wellness services, and 24/7 dedicated
                        concierge support. Every aspect is enhanced for maximum
                        luxury and personalization.
                      </p>
                    </div>

                    <div className='bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700'>
                      <h3 className='text-lg font-semibold text-white mb-3'>
                        Is the premium package worth the additional cost?
                      </h3>
                      <p className='text-gray-300'>
                        For travelers seeking a truly exceptional vacation
                        experience, the premium upgrade delivers significant
                        value. The private yacht alone represents a considerable
                        upgrade from the group catamaran experience. When
                        combined with the personal chef, massage service, 24/7
                        concierge, and upgraded transportation, the premium
                        package creates a seamless luxury experience that our
                        guests consistently rate as exceptional value.
                      </p>
                    </div>

                    <div className='bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700'>
                      <h3 className='text-lg font-semibold text-white mb-3'>
                        How customizable is the premium package?
                      </h3>
                      <p className='text-gray-300'>
                        The premium package is highly customizable. While it
                        includes our core luxury services, our dedicated
                        concierge works with you before and during your stay to
                        tailor each experience to your preferences. From menu
                        planning with the chef to specific destinations for your
                        yacht journey, the premium package can be adjusted to
                        match your exact desires.
                      </p>
                    </div>

                    <div className='bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700'>
                      <h3 className='text-lg font-semibold text-white mb-3'>
                        Can I add additional yacht days or chef experiences?
                      </h3>
                      <p className='text-gray-300'>
                        Absolutely. Additional yacht days, chef experiences, and
                        massage services can be added for an extra charge. Many
                        of our premium guests choose to extend these signature
                        experiences, particularly the yacht days. Your concierge
                        can arrange any additional services with preferential
                        rates for premium package guests.
                      </p>
                    </div>

                    <div className='bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700'>
                      <h3 className='text-lg font-semibold text-white mb-3'>
                        How far in advance should I book the premium package?
                      </h3>
                      <p className='text-gray-300'>
                        We recommend booking the premium package at least 60
                        days in advance to ensure availability of all luxury
                        services, particularly during high season
                        (December-April). This lead time also allows our team to
                        thoroughly prepare your personalized experience. Due to
                        limited availability of our premium services,
                        last-minute bookings cannot always be accommodated.
                      </p>
                    </div>

                    <div className='bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700'>
                      <h3 className='text-lg font-semibold text-white mb-3'>
                        What's the cancellation policy for the premium package?
                      </h3>
                      <p className='text-gray-300'>
                        For premium packages, we offer a full refund for
                        cancellations 45+ days before arrival, 50% refund for
                        cancellations 30-44 days before arrival, and no refund
                        for cancellations less than 30 days before arrival. We
                        strongly recommend travel insurance for all premium
                        bookings. Special consideration may be given for extreme
                        circumstances.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Booking CTA Section */}
        <section className='py-16 bg-black relative overflow-hidden'>
          {/* Background overlay with gradient */}
          <div className='absolute inset-0 bg-gradient-to-br from-amber-900/40 to-black/80 z-10'></div>

          {/* Background image */}
          <div className='absolute inset-0 z-0 opacity-30'>
            <Image
              src='/img/beach.jpg'
              alt='Luxury Yacht Sunset'
              fill
              className='object-cover'
            />
          </div>

          <div className='container mx-auto px-6 relative z-20'>
            <div className='max-w-4xl mx-auto text-center'>
              <h2 className='text-4xl md:text-5xl font-bold text-white mb-6'>
                Experience Ultimate Luxury
              </h2>
              <p className='text-xl text-gray-300 mb-10 max-w-2xl mx-auto'>
                Book your Punta Cana Luxe package now and indulge in the most
                exclusive Caribbean experience with personalized service and
                premium amenities.
              </p>

              <div className='flex flex-col sm:flex-row gap-6 justify-center'>
                <Link href='/custom-package'>
                  <button className='px-8 py-4 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg transition-colors duration-300 shadow-xl shadow-amber-500/20 text-lg'>
                    Customize Your Package
                  </button>
                </Link>
                <Link href='/contact'>
                  <button className='px-8 py-4 bg-transparent border-2 border-amber-500 hover:bg-amber-500/10 text-amber-400 font-semibold rounded-lg transition-colors duration-300 text-lg'>
                    Contact Concierge
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <CartSidebar />
        <Footer />
      </div>
    </BookingProvider>
  );
};

export default PremiumPackage;
