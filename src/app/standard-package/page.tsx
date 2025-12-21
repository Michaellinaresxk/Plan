'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookingProvider, useBooking } from '@/context/BookingContext';
import { useTranslation } from '@/lib/i18n/client';
import Navbar from '@/UI/components/shared/Navbar';
import Footer from '@/UI/components/shared/Footer';
import CartSidebar from '@/UI/components/shared/CartSidebar';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import ServiceList from '@/UI/components/service/ServiceList';
import ServiceManager from '@/constants/services/ServiceManager';
import FloatingActionButton from '@/UI/components/shared/WhatsAppFloatingButton';

const StandardPackageContent = () => {
  const { packageType, setPackageType } = useBooking();
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  // Load services when component mounts
  useEffect(() => {
    const loadServices = async () => {
      try {
        setIsLoading(true);
        // Ensure package type is set first
        if (packageType !== 'standard') {
          setPackageType('standard');
        }

        // Load services
        const standardServices = ServiceManager.getByPackageType('standard');
        setServices(standardServices);
      } catch (error) {
        console.error('Error loading services:', error);
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
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-white'>
      <Navbar />

      {/* Modern Hero Section */}
      <section className='relative min-h-[90vh] flex items-center justify-center overflow-hidden'>
        {/* Background with improved gradients */}
        <div className='absolute inset-0 z-0'>
          <Image
            src='/img/bike.jpg'
            alt='Luxury experience'
            fill
            className='object-cover scale-105'
            priority
          />
          <div className='absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20'></div>
          <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30'></div>
        </div>

        {/* Floating elements for modern look */}
        <div className='absolute top-20 right-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse'></div>
        <div className='absolute bottom-20 left-20 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000'></div>

        <div className='container mx-auto px-6 relative z-20 py-24'>
          <motion.div
            initial='hidden'
            animate='visible'
            variants={staggerContainer}
            className='max-w-4xl mx-auto'
          >
            <motion.div
              variants={fadeInUp}
              className='inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 mb-8 border border-blue-400/30 backdrop-blur-sm'
            >
              <Sparkles className='w-4 h-4 mr-2' />
              {t('standardPage.chip')}
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className='text-5xl md:text-7xl font-extrabold leading-tight bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent'
            >
              Lux
            </motion.h1>
            <motion.h1
              variants={fadeInUp}
              className='text-5xl md:text-7xl font-extrabold mb-6 leading-tight bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent'
            >
              Punta Cana
              <span className='block text-3xl md:text-5xl font-normal text-blue-300 mt-2'>
                Standard Experience
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className='text-xl md:text-2xl text-gray-200 mb-12 leading-relaxed max-w-3xl'
            >
              {t('standardPage.subTitle')}
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className='flex flex-col sm:flex-row gap-6'
            >
              <Link href='/premium-package'>
                <button className='group px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-2xl transition-all duration-300 flex items-center shadow-2xl shadow-blue-500/25 transform hover:scale-105 hover:shadow-blue-500/40'>
                  {t('standardPage.btn1')}
                  <ChevronRight className='ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform' />
                </button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className='py-20 bg-gradient-to-b from-white to-gray-50'>
        {isLoading ? (
          <div className='container mx-auto px-6'>
            <div className='flex items-center justify-center py-20'>
              <div className='text-center'>
                <Loader2 className='w-12 h-12 animate-spin text-blue-600 mx-auto mb-4' />
                <p className='text-gray-600 text-lg'>
                  Loading your perfect experiences...
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className='container mx-auto px-6'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className='text-center mb-16'
            >
              <h2 className='text-4xl md:text-5xl font-bold text-gray-900 mb-6'>
                {t('services.standard.standardPage.title')}
              </h2>
              <p className='text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed'>
                {t('services.standard.standardPage.subtitle')}
              </p>
            </motion.div>
            <ServiceList
              services={services}
              servicePath='standard-package'
              viewContext='standard-view'
            />
          </div>
        )}
      </section>

      {/* Modern Booking CTA Section */}
      <section className='py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-black relative overflow-hidden'>
        {/* Background effects */}
        <div className='absolute inset-0 bg-gradient-to-br from-blue-900/40 to-black/80 z-10'></div>
        <div className='absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl'></div>
        <div className='absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl'></div>

        {/* Background image */}
        <div className='absolute inset-0 z-0 opacity-20'>
          <Image
            src='/images/punta-cana-beach-sunset.jpg'
            alt='Punta Cana Beach'
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
              <h2 className='text-4xl md:text-6xl font-bold text-white mb-8 leading-tight'>
                {t('standardPage.standardPageCTA.title')}
              </h2>
              <p className='text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed'>
                {t('standardPage.standardPageCTA.subtitle')}
              </p>

              <div className='flex flex-col sm:flex-row gap-6 justify-center'>
                <Link href='/premium-package'>
                  <button className='group px-10 py-5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-bold rounded-2xl transition-all duration-300 shadow-2xl shadow-amber-500/25 text-lg transform hover:scale-105'>
                    {t('standardPage.standardPageCTA.btn2')}
                    <Sparkles className='ml-2 h-6 w-6 inline group-hover:rotate-12 transition-transform' />
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className='py-20 bg-gradient-to-b from-gray-50 to-white'>
        <div className='container mx-auto px-6'>
          <div className='max-w-4xl mx-auto'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className='text-center mb-16'
            >
              <h2 className='text-4xl md:text-5xl font-bold text-gray-900 mb-6'>
                {t('common.faqs.title')}
              </h2>
              <p className='text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed'>
                {t('common.faqs.subtitle')}
              </p>
            </motion.div>

            <div className='space-y-6'>
              {[
                {
                  question: t('common.faqs.question1'),
                  answer: t('common.faqs.answer1'),
                },
                {
                  question: t('common.faqs.question2'),
                  answer: t('common.faqs.answer2'),
                },
                {
                  question: t('common.faqs.question3'),
                  answer: t('common.faqs.answer3'),
                },
                {
                  question: t('common.faqs.question4'),
                  answer: t('common.faqs.answer4'),
                },
                {
                  question: t('common.faqs.question5'),
                  answer: t('common.faqs.answer5'),
                },
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className='bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100'
                >
                  <h3 className='text-xl font-bold text-gray-900 mb-4'>
                    {faq.question}
                  </h3>
                  <p className='text-gray-700 leading-relaxed'>{faq.answer}</p>
                </motion.div>
              ))}
            </div>

            {/* Contact for More Questions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className='mt-16 text-center p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl border border-blue-200'
            >
              <h3 className='text-2xl font-bold text-gray-900 mb-4'>
                {t('common.faqs.stillHaveQuestions')}
              </h3>
              <p className='text-gray-700 mb-8 text-lg'>
                {t('common.faqs.stillHaveQuestionsText')}
              </p>
              <Link href='/contact'>
                <button className='inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg transform hover:scale-105'>
                  {t('common.faqs.contactUs')}
                  <ArrowRight className='ml-2 h-5 w-5' />
                </button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <CartSidebar />
      <FloatingActionButton
        message='Hi! I need help with luxury services'
        position='bottom-right'
      />
      <Footer />
    </div>
  );
};

const StandardPackage = () => {
  return (
    <BookingProvider>
      <StandardPackageContent />
    </BookingProvider>
  );
};

export default StandardPackage;
