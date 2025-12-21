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
import {
  Users,
  Clock,
  Star,
  MapPin,
  Wine,
  Sparkles,
  Calendar,
  CheckCircle,
  ArrowRight,
  Loader2,
  Crown,
  Gem,
} from 'lucide-react';
import ServiceList from '@/UI/components/service/ServiceList';
import ServiceManager from '@/constants/services/ServiceManager';
import FloatingActionButton from '@/UI/components/shared/WhatsAppFloatingButton';

const PremiumPackageContent = () => {
  const { packageType, setPackageType } = useBooking();
  const { t } = useTranslation();
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

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900'>
      <Navbar />

      {/* Enhanced Premium Hero Section */}
      <section className='relative min-h-[90vh] flex items-center justify-center overflow-hidden'>
        {/* Enhanced background with multiple layers */}
        <div className='absolute inset-0 z-0'>
          <Image
            src='/img/saona-island/saona-3.jpg'
            alt={t('premiumPage.hero.imageAlt')}
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
              {t('premiumPage.hero.badge')}
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className='text-5xl md:text-8xl font-extrabold text-white mb-6 leading-tight'
            >
              {t('premiumPage.hero.titlePrefix')}
              <span className='bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 bg-clip-text text-transparent'>
                {t('premiumPage.hero.titleHighlight')}
              </span>
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
                {t('premiumPage.hero.rating')}
              </span>
            </motion.div>

            <motion.p
              variants={fadeInUp}
              className='text-xl md:text-2xl text-gray-200 mb-12 leading-relaxed max-w-3xl mx-auto'
            >
              {t('premiumPage.hero.description')}
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className='flex flex-col sm:flex-row gap-6 justify-center'
            >
              <Link href='/standard-package'>
                <button className='group px-10 py-5 bg-white/10 backdrop-blur-sm border-2 border-amber-400/30 hover:border-amber-400/50 hover:bg-amber-400/10 text-amber-300 font-bold rounded-2xl transition-all duration-300 flex items-center text-lg'>
                  {t('premiumPage.hero.exploreStandardButton')}
                  <ArrowRight className='ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform' />
                </button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Main Content Area - Overview Section */}
      <motion.section
        initial='hidden'
        animate='visible'
        variants={fadeIn}
        className='py-20 bg-gradient-to-b from-gray-900 via-black to-gray-800 text-white'
      >
        {isLoading ? (
          <div className='container mx-auto px-6'>
            <div className='flex items-center justify-center py-20'>
              <div className='text-center'>
                <Loader2 className='w-12 h-12 animate-spin text-amber-400 mx-auto mb-4' />
                <p className='text-gray-300 text-lg'>
                  {t('premiumPage.overview.loading')}
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
                {t('premiumPage.overview.title')}
              </h2>
              <p className='text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed'>
                {t('premiumPage.overview.subtitle')}
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
                    {t('premiumPage.overview.experienceTitle')}
                  </h3>
                  <p className='text-gray-300 mb-6 leading-relaxed text-lg'>
                    {t('premiumPage.overview.experienceDescription1')}
                  </p>
                  <p className='text-gray-300 mb-8 leading-relaxed text-lg'>
                    {t('premiumPage.overview.experienceDescription2')}
                  </p>

                  <div className='flex items-center space-x-2 text-amber-400 font-bold text-lg'>
                    <Sparkles className='h-6 w-6' />
                    <span>{t('premiumPage.overview.availabilityNote')}</span>
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
                      {t('premiumPage.overview.details.duration.title')}
                    </h4>
                    <p className='text-gray-200 font-medium'>
                      {t('premiumPage.overview.details.duration.value')}
                    </p>
                  </div>

                  <div className='bg-gradient-to-br from-amber-500/20 to-yellow-500/20 p-6 rounded-2xl border border-amber-400/30 backdrop-blur-sm'>
                    <h4 className='font-bold text-amber-400 mb-3 flex items-center text-lg'>
                      <Users className='h-5 w-5 mr-2' />
                      {t('premiumPage.overview.details.groupSize.title')}
                    </h4>
                    <p className='text-gray-200 font-medium'>
                      {t('premiumPage.overview.details.groupSize.value')}
                    </p>
                  </div>

                  <div className='bg-gradient-to-br from-amber-500/20 to-yellow-500/20 p-6 rounded-2xl border border-amber-400/30 backdrop-blur-sm'>
                    <h4 className='font-bold text-amber-400 mb-3 flex items-center text-lg'>
                      <MapPin className='h-5 w-5 mr-2' />
                      {t('premiumPage.overview.details.location.title')}
                    </h4>
                    <p className='text-gray-200 font-medium'>
                      {t('premiumPage.overview.details.location.value')}
                    </p>
                  </div>

                  <div className='bg-gradient-to-br from-amber-500/20 to-yellow-500/20 p-6 rounded-2xl border border-amber-400/30 backdrop-blur-sm'>
                    <h4 className='font-bold text-amber-400 mb-3 flex items-center text-lg'>
                      <Wine className='h-5 w-5 mr-2' />
                      {t('premiumPage.overview.details.services.title')}
                    </h4>
                    <p className='text-gray-200 font-medium'>
                      {t('premiumPage.overview.details.services.value')}
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
            alt={t('premiumPage.cta.backgroundImageAlt')}
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
                {t('premiumPage.cta.title')}
              </h2>
              <p className='text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed'>
                {t('premiumPage.cta.description')}
              </p>

              <div className='flex flex-col sm:flex-row gap-6 justify-center'>
                <Link href='/contact'>
                  <button className='group px-10 py-5 bg-gradient-to-r from-amber-400/20 to-yellow-400/20 backdrop-blur-sm border-2 border-amber-400 hover:border-amber-300 hover:bg-amber-400/30 text-amber-300 font-bold rounded-2xl transition-all duration-300 text-lg transform hover:scale-105'>
                    {t('premiumPage.cta.contactButton')}
                    <Crown className='ml-2 h-6 w-6 inline group-hover:rotate-12 transition-transform' />
                  </button>
                </Link>
              </div>
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

const PremiumPackage = () => {
  return (
    <BookingProvider>
      <PremiumPackageContent />
    </BookingProvider>
  );
};

export default PremiumPackage;
