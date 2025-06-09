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
import { ChevronRight, Clock, Star } from 'lucide-react';
import ServiceList from '@/UI/components/service/ServiceList';
import ServiceManager from '@/constants/services/ServiceManager';

const StandardPackage = () => {
  const { packageType, setPackageType } = useBooking();
  const [activeTab, setActiveTab] = useState('overview');

  const { t } = useTranslation();

  // Get all standard services using the new ServiceManager
  const standardServices = ServiceManager.getByPackageType('standard');

  // Ensure package type is set to 'standard'
  React.useEffect(() => {
    if (packageType !== 'standard') {
      setPackageType('standard');
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
      <div className='min-h-screen bg-white'>
        <Navbar />

        {/* Hero Section with Background Image */}
        <section className='relative min-h-[80vh] flex items-center justify-center'>
          <div className='absolute inset-0 z-0'>
            <Image
              src='/img/bike.jpg'
              alt='Luxury experience'
              fill
              className='object-cover'
              priority
            />
            <div className='absolute inset-0 bg-gradient-to-r from-black/70 via-black/60 to-transparent'></div>
          </div>

          <div className='container mx-auto px-6 relative z-20 py-24'>
            <motion.div
              initial='hidden'
              animate='visible'
              variants={staggerContainer}
              className='max-w-3xl'
            >
              <motion.span
                variants={fadeInUp}
                className='inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-500/20 text-blue-400 mb-6'
              >
                {t('standardPage.chip')}
              </motion.span>

              <motion.h1
                variants={fadeInUp}
                className='text-4xl md:text-6xl font-bold text-white mb-6 leading-tight'
              >
                Punta Cana Plan
              </motion.h1>

              <motion.div
                variants={fadeInUp}
                className='flex items-center mb-8'
              >
                <div className='flex mr-3'>
                  {[1, 2, 3, 4].map((i) => (
                    <Star
                      key={i}
                      className='h-5 w-5 text-blue-500 fill-blue-500'
                    />
                  ))}
                  <Star className='h-5 w-5 text-gray-400' />
                </div>
                <span className='text-gray-300'>
                  4.0 {t('standardPage.rating')} •{' '}
                  {t('standardPage.rastingText')}
                </span>
              </motion.div>

              <motion.p
                variants={fadeInUp}
                className='text-xl text-gray-200 mb-10 leading-relaxed'
              >
                {t('standardPage.subTitle')}
              </motion.p>

              <motion.div variants={fadeInUp} className='flex flex-wrap gap-4'>
                <Link href='/premium-package'>
                  <button className='px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors flex items-center shadow-lg shadow-blue-500/20'>
                    {t('standardPage.btn1')}
                    <ChevronRight className='ml-2 h-5 w-5' />
                  </button>
                </Link>

                <Link href='/custom-package'>
                  <button className='px-6 py-3 bg-transparent border border-white/30 hover:border-white text-white font-medium rounded-lg transition-colors flex items-center'>
                    {t('standardPage.btn2')}
                  </button>
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* Decorative Bottom Gradient */}
          <div className='absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black to-transparent z-10'></div>
        </section>

        {/* Navigation Tabs */}
        <section className='sticky top-16 bg-white z-30 border-b border-gray-200 shadow-sm'>
          <div className='container mx-auto px-6'>
            <div className='flex overflow-x-auto scrollbar-hide py-1'>
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-5 py-4 font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'overview'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {t('standardPage.tab1')}
              </button>
              <button
                onClick={() => setActiveTab('services')}
                className={`px-5 py-4 font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'services'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {t('standardPage.tab2')}
              </button>
              <button
                onClick={() => setActiveTab('testimonials')}
                className={`px-5 py-4 font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'testimonials'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {t('standardPage.tab3')}
              </button>
              <button
                onClick={() => setActiveTab('faq')}
                className={`px-5 py-4 font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'faq'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {t('standardPage.tab4')}
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
              className='py-16 bg-white'
            >
              {/* Pass the services from the new data source */}
              <ServiceList
                services={standardServices}
                servicePath='standard-package'
                viewContext='standard-view'
              />
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
              className='py-16 bg-gray-50'
            >
              <div className='container mx-auto px-6'>
                <div className='max-w-4xl mx-auto'>
                  <h2 className='text-3xl font-bold text-gray-900 mb-4'>
                    {t('standardPage.services.title')}
                  </h2>
                  <p className='text-gray-700 mb-12 text-lg'>
                    {t('standardPage.services.subtitle')}
                  </p>

                  <div className='grid grid-cols-1 gap-6 mb-16'>
                    {/* Airport Transfers */}
                    <div className='bg-white rounded-xl shadow-md overflow-hidden border border-gray-200'>
                      <div className='md:flex'>
                        <div className='md:w-1/3 h-48 md:h-auto relative'>
                          <Image
                            src='/images/services/airport-transfers.jpg'
                            alt='Airport Transfers'
                            fill
                            className='object-cover'
                          />
                        </div>
                        <div className='p-6 md:w-2/3'>
                          <div className='flex justify-between items-start mb-4'>
                            <h3 className='text-xl font-bold text-gray-900'>
                              Airport Transfers
                            </h3>
                            <span className='bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium'>
                              Included
                            </span>
                          </div>
                          <p className='text-gray-700 mb-4'>
                            Start and end your vacation with hassle-free
                            transportation between Punta Cana International
                            Airport and your accommodation. Our comfortable,
                            air-conditioned vehicles and professional drivers
                            ensure a smooth journey.
                          </p>
                          <div className='flex items-center text-sm text-gray-600'>
                            <Clock className='h-4 w-4 mr-1' />
                            <span>30-45 minutes each way</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Golf Cart Rentals */}
                    <div className='bg-white rounded-xl shadow-md overflow-hidden border border-gray-200'>
                      <div className='md:flex'>
                        <div className='md:w-1/3 h-48 md:h-auto relative'>
                          <Image
                            src='/images/services/golf-cart-rentals.jpg'
                            alt='Golf Cart Rentals'
                            fill
                            className='object-cover'
                          />
                        </div>
                        <div className='p-6 md:w-2/3'>
                          <div className='flex justify-between items-start mb-4'>
                            <h3 className='text-xl font-bold text-gray-900'>
                              Golf Cart Rentals
                            </h3>
                            <span className='bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium'>
                              Included
                            </span>
                          </div>
                          <p className='text-gray-700 mb-4'>
                            Enjoy the freedom to explore your resort and nearby
                            areas with a convenient golf cart rental. Perfect
                            for short trips to the beach, restaurants, or just
                            taking in the beautiful surroundings at your own
                            pace.
                          </p>
                          <div className='flex items-center text-sm text-gray-600'>
                            <Clock className='h-4 w-4 mr-1' />
                            <span>24-hour rental periods</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Catamaran Trips */}
                    <div className='bg-white rounded-xl shadow-md overflow-hidden border border-gray-200'>
                      <div className='md:flex'>
                        <div className='md:w-1/3 h-48 md:h-auto relative'>
                          <Image
                            src='/images/services/catamaran-trips.jpg'
                            alt='Catamaran Trips'
                            fill
                            className='object-cover'
                          />
                        </div>
                        <div className='p-6 md:w-2/3'>
                          <div className='flex justify-between items-start mb-4'>
                            <h3 className='text-xl font-bold text-gray-900'>
                              Catamaran Trips
                            </h3>
                            <span className='bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium'>
                              Included
                            </span>
                          </div>
                          <p className='text-gray-700 mb-4'>
                            Sail along the stunning coastline on a spacious
                            catamaran. These trips include snorkeling
                            opportunities, visits to natural swimming pools, and
                            time to relax on the boat with refreshments and
                            beautiful views.
                          </p>
                          <div className='flex items-center text-sm text-gray-600'>
                            <Clock className='h-4 w-4 mr-1' />
                            <span>4 hours per trip</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Private Chef Service */}
                    <div className='bg-white rounded-xl shadow-md overflow-hidden border border-gray-200'>
                      <div className='md:flex'>
                        <div className='md:w-1/3 h-48 md:h-auto relative'>
                          <Image
                            src='/images/services/private-chef.jpg'
                            alt='Private Chef Service'
                            fill
                            className='object-cover'
                          />
                        </div>
                        <div className='p-6 md:w-2/3'>
                          <div className='flex justify-between items-start mb-4'>
                            <h3 className='text-xl font-bold text-gray-900'>
                              Private Chef Service
                            </h3>
                            <span className='bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium'>
                              Included
                            </span>
                          </div>
                          <p className='text-gray-700 mb-4'>
                            Experience authentic Dominican cuisine and
                            international dishes prepared in your accommodation
                            by a skilled chef. Enjoy a personalized dining
                            experience with fresh, local ingredients tailored to
                            your preferences.
                          </p>
                          <div className='flex items-center text-sm text-gray-600'>
                            <Clock className='h-4 w-4 mr-1' />
                            <span>One 3-hour culinary experience</span>
                          </div>
                        </div>
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
              className='py-16 bg-white'
            >
              <div className='container mx-auto px-6'>
                <div className='max-w-4xl mx-auto'>
                  <h2 className='text-3xl font-bold text-gray-900 mb-4'>
                    {t('standardPage.testimonial.title')}
                  </h2>
                  <p className='text-gray-700 mb-12 text-lg'>
                    {t('standardPage.services.subtitle')}
                  </p>

                  <div className='grid gap-8'>
                    {/* Testimonial 1 */}
                    <div className='bg-blue-50 rounded-xl p-6 border border-blue-100'>
                      <div className='flex items-center mb-4'>
                        <div className='flex mr-2'>
                          {Array(5)
                            .fill(0)
                            .map((_, i) => (
                              <Star
                                key={i}
                                className='h-5 w-5 text-blue-500 fill-blue-500'
                              />
                            ))}
                        </div>
                        <span className='text-gray-600 text-sm'>5.0</span>
                      </div>
                      <p className='text-gray-700 italic mb-6'>
                        {t('standardPage.testimonial.testimonial1')}
                      </p>
                      <div className='flex items-center'>
                        <div className='h-12 w-12 rounded-full bg-blue-200 flex items-center justify-center text-blue-600 font-bold text-xl mr-3'>
                          JD
                        </div>
                        <div>
                          <h4 className='font-semibold text-gray-900'>
                            James & Diana Rodriguez
                          </h4>
                          <p className='text-gray-600 text-sm'>
                            Family of 4, Miami
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Testimonial 2 */}
                    <div className='bg-blue-50 rounded-xl p-6 border border-blue-100'>
                      <div className='flex items-center mb-4'>
                        <div className='flex mr-2'>
                          {[1, 2, 3, 4].map((i) => (
                            <Star
                              key={i}
                              className='h-5 w-5 text-blue-500 fill-blue-500'
                            />
                          ))}
                          <Star className='h-5 w-5 text-blue-500 fill-blue-500/50' />
                        </div>
                        <span className='text-gray-600 text-sm'>4.5</span>
                      </div>
                      <p className='text-gray-700 italic mb-6'>
                        {t('standardPage.testimonial.testimonial2')}
                      </p>
                      <div className='flex items-center'>
                        <div className='h-12 w-12 rounded-full bg-blue-200 flex items-center justify-center text-blue-600 font-bold text-xl mr-3'>
                          SM
                        </div>
                        <div>
                          <h4 className='font-semibold text-gray-900'>
                            Sarah Mitchell
                          </h4>
                          <p className='text-gray-600 text-sm'>
                            Couple, Toronto
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Testimonial 3 */}
                    <div className='bg-blue-50 rounded-xl p-6 border border-blue-100'>
                      <div className='flex items-center mb-4'>
                        <div className='flex mr-2'>
                          {Array(5)
                            .fill(0)
                            .map((_, i) => (
                              <Star
                                key={i}
                                className='h-5 w-5 text-blue-500 fill-blue-500'
                              />
                            ))}
                        </div>

                        <span className='text-gray-600 text-sm'>5.0</span>
                      </div>
                      <p className='text-gray-700 italic mb-6'>
                        {t('standardPage.testimonial.testimonial3')}
                      </p>
                      <div className='flex items-center'>
                        <div className='h-12 w-12 rounded-full bg-blue-200 flex items-center justify-center text-blue-600 font-bold text-xl mr-3'>
                          AT
                        </div>
                        <div>
                          <h4 className='font-semibold text-gray-900'>
                            Alex Thompson
                          </h4>
                          <p className='text-gray-600 text-sm'>
                            Group of 6, Chicago
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
              className='py-16 bg-gray-50'
            >
              <div className='container mx-auto px-6'>
                <div className='max-w-4xl mx-auto'>
                  <h2 className='text-3xl font-bold text-gray-900 mb-4'>
                    Frequently Asked Questions
                  </h2>
                  <p className='text-gray-700 mb-12 text-lg'>
                    Find answers to common questions about our Punta Cana Plan
                    package.
                  </p>

                  <div className='space-y-6'>
                    <div className='bg-white rounded-xl p-6 border border-gray-200 shadow-sm'>
                      <h3 className='text-lg font-semibold text-gray-900 mb-3'>
                        What's included in the standard package?
                      </h3>
                      <p className='text-gray-700'>
                        The Punta Cana Plan standard package includes airport
                        transfers, golf cart rental, a catamaran trip, and a
                        private chef service. These core services provide you
                        with transportation, adventure, and culinary experiences
                        during your stay.
                      </p>
                    </div>

                    <div className='bg-white rounded-xl p-6 border border-gray-200 shadow-sm'>
                      <h3 className='text-lg font-semibold text-gray-900 mb-3'>
                        How long is the standard package valid for?
                      </h3>
                      <p className='text-gray-700'>
                        The package is flexible and can be customized for stays
                        between 3-14 days. The services included are allocated
                        once during your stay, regardless of its length (e.g.,
                        one round-trip airport transfer, one catamaran trip,
                        etc.).
                      </p>
                    </div>

                    <div className='bg-white rounded-xl p-6 border border-gray-200 shadow-sm'>
                      <h3 className='text-lg font-semibold text-gray-900 mb-3'>
                        Can I customize the standard package?
                      </h3>
                      <p className='text-gray-700'>
                        Yes! While the standard package includes core services,
                        you can add additional services from our catalog. You
                        can also upgrade to our premium package for more
                        exclusive experiences or create a fully custom package
                        through our package builder.
                      </p>
                    </div>

                    <div className='bg-white rounded-xl p-6 border border-gray-200 shadow-sm'>
                      <h3 className='text-lg font-semibold text-gray-900 mb-3'>
                        What if I'm staying at an all-inclusive resort?
                      </h3>
                      <p className='text-gray-700'>
                        Our packages complement all-inclusive stays perfectly.
                        While your resort provides meals and basic amenities,
                        our services offer unique experiences beyond the resort,
                        transportation solutions, and special experiences like
                        private dining that all-inclusives typically don't
                        offer.
                      </p>
                    </div>

                    <div className='bg-white rounded-xl p-6 border border-gray-200 shadow-sm'>
                      <h3 className='text-lg font-semibold text-gray-900 mb-3'>
                        How far in advance should I book?
                      </h3>
                      <p className='text-gray-700'>
                        We recommend booking at least 30 days in advance,
                        especially during high season (December-April). This
                        ensures availability of all services and gives us time
                        to perfectly coordinate your experience. Last-minute
                        bookings are possible but subject to availability.
                      </p>
                    </div>

                    <div className='bg-white rounded-xl p-6 border border-gray-200 shadow-sm'>
                      <h3 className='text-lg font-semibold text-gray-900 mb-3'>
                        What's the cancellation policy?
                      </h3>
                      <p className='text-gray-700'>
                        We offer a flexible cancellation policy: full refund for
                        cancellations 30+ days before arrival, 50% refund for
                        cancellations 14-29 days before arrival, and no refund
                        for cancellations less than 14 days before arrival.
                        Special terms may apply during hurricane season or for
                        group bookings.
                      </p>
                    </div>
                  </div>

                  {/* Contact for More Questions */}
                  <div className='mt-12 text-center p-8 bg-blue-50 rounded-xl border border-blue-100'>
                    <h3 className='text-xl font-bold text-gray-900 mb-4'>
                      Still Have Questions?
                    </h3>
                    <p className='text-gray-700 mb-6'>
                      Our team is here to help you plan your perfect Punta Cana
                      experience.
                    </p>
                    <Link href='/contact'>
                      <button className='px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm'>
                        Contact Our Team
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Booking CTA Section */}
        <section className='py-16 bg-black relative overflow-hidden'>
          {/* Background overlay with gradient */}
          <div className='absolute inset-0 bg-gradient-to-br from-blue-900/40 to-black/80 z-10'></div>

          {/* Background image */}
          <div className='absolute inset-0 z-0 opacity-30'>
            <Image
              src='/images/punta-cana-beach-sunset.jpg'
              alt='Punta Cana Beach'
              fill
              className='object-cover'
            />
          </div>

          <div className='container mx-auto px-6 relative z-20'>
            <div className='max-w-4xl mx-auto text-center'>
              <h2 className='text-4xl md:text-5xl font-bold text-white mb-6'>
                {t('standardPage.standardPageCTA.title')}
              </h2>
              <p className='text-xl text-gray-300 mb-10 max-w-2xl mx-auto'>
                {t('standardPage.standardPageCTA.subtitle')}
              </p>

              <div className='flex flex-col sm:flex-row gap-6 justify-center'>
                <Link href='/custom-package'>
                  <button className='px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-300 shadow-xl shadow-blue-500/20 text-lg'>
                    {t('standardPage.standardPageCTA.btn1')}
                  </button>
                </Link>

                <Link href='/premium-package'>
                  <button className='px-8 py-4 bg-transparent border-2 border-amber-500 hover:bg-amber-500/10 text-amber-400 font-semibold rounded-lg transition-colors duration-300 text-lg'>
                    {t('standardPage.standardPageCTA.btn2')}
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

export default StandardPackage;
