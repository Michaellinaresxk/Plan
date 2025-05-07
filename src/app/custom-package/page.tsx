'use client';

import React, { useState } from 'react';
import { BookingProvider } from '@/context/BookingContext';
import Navbar from '@/UI/components/shared/Navbar';
import Footer from '@/UI/components/shared/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft,
  Package,
  Sparkles,
  ArrowRight,
  Star,
  Calendar,
  Map,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/client';
import Image from 'next/image';
import CustomPackageBuilder from '@/UI/components/CustomPackageBuilder';
import CustomPackageOrchestrator from '@/UI/components/packageBuilder/CustomPackageOrchestrator';
import ServiceManager from '@/constants/services/ServiceManager';

export default function CustomPackagePage() {
  const { t } = useTranslation();
  const [builderMode, setBuilderMode] = useState<
    'choose' | 'guided' | 'custom'
  >('choose');
  const [activeCard, setActiveCard] = useState<'guided' | 'custom' | null>(
    null
  );

  // Get all services using the new ServiceManager
  const allServices = ServiceManager.getAll();

  // Handle completion of the guided flow
  const handleComplete = () => {
    // Navigate to payment page
    window.location.href = '/payment';
  };

  // Handle mouse enter/leave for cards
  const handleCardHover = (card: 'guided' | 'custom' | null) => {
    setActiveCard(card);
  };

  // Render different sections based on mode
  const renderContent = () => {
    switch (builderMode) {
      case 'choose':
        return renderModeSelection();
      case 'guided':
        return (
          <CustomPackageOrchestrator
            services={allServices}
            onComplete={handleComplete}
          />
        );
      case 'custom':
        return <CustomPackageBuilder services={allServices} />;
      default:
        return renderModeSelection();
    }
  };

  // Render mode selection UI with modern design
  const renderModeSelection = () => (
    <div className='py-20 relative overflow-hidden'>
      {/* Background decorations */}
      <div className='absolute top-0 left-0 w-full h-full overflow-hidden -z-10'>
        <div className='absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-b from-amber-200/10 to-amber-300/5 blur-3xl rounded-full transform translate-x-1/2 -translate-y-1/2'></div>
        <div className='absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-t from-blue-200/10 to-blue-300/5 blur-3xl rounded-full transform -translate-x-1/2 translate-y-1/2'></div>
      </div>

      <div className='w-[90%] md:w-[85%] lg:w-[80%] mx-auto mb-16'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className='text-center'
        >
          <div className='inline-block mb-6 px-4 py-1.5 bg-gradient-to-r from-amber-50 to-blue-50 rounded-full border border-gray-100 shadow-sm'>
            <span className='text-sm font-medium bg-gradient-to-r from-amber-600 to-blue-600 bg-clip-text text-transparent'>
              {t('customPackagePage.tagline', {
                fallback: 'Customize Your Journey',
              })}
            </span>
          </div>

          <h2 className='text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent'>
            {t('customPackagePage.chooseExperience')}
          </h2>

          <p className='text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-12'>
            {t('customPackagePage.chooseExperienceSubtitle', {
              fallback:
                'Choose how you want to create your perfect Punta Cana experience',
            })}
          </p>
        </motion.div>
      </div>

      <div className='grid md:grid-cols-2 gap-8 lg:gap-10'>
        {/* Guided Experience Card */}
        <motion.div
          className='relative h-[500px] md:h-[600px] rounded-2xl overflow-hidden group shadow-2xl'
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{
            y: -8,
            transition: { duration: 0.3 },
          }}
          onHoverStart={() => handleCardHover('guided')}
          onHoverEnd={() => handleCardHover(null)}
        >
          {/* Image container */}
          <div className='absolute inset-0 w-full h-full'>
            <Image
              src='/img/bike.jpg'
              alt='Guided Package Builder'
              fill
              className={`object-cover transition-all duration-700 ${
                activeCard === 'guided' ? 'scale-110 blur-[2px]' : 'scale-100'
              }`}
            />

            {/* Gradient overlays */}
            <div className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent'></div>
            <div
              className={`absolute inset-0 bg-amber-800/20 mix-blend-overlay transition-opacity duration-500 ${
                activeCard === 'guided' ? 'opacity-100' : 'opacity-0'
              }`}
            ></div>
          </div>

          {/* Content */}
          <div className='absolute inset-0 flex flex-col justify-between p-8 md:p-10'>
            {/* Top badge */}
            <div className='flex justify-between items-start'>
              <div className='inline-flex items-center bg-white/10 backdrop-blur-xl px-4 py-2 rounded-full border border-white/20'>
                <Sparkles className='h-4 w-4 text-amber-400 mr-2' />
                <span className='text-sm font-medium text-white'>
                  Premium Experience
                </span>
              </div>

              <div className='flex items-center space-x-1 bg-white/10 backdrop-blur-xl px-3 py-1.5 rounded-full border border-white/20'>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className='h-3 w-3 text-amber-400 fill-amber-400'
                  />
                ))}
              </div>
            </div>

            {/* Bottom content with blur background */}
            <div
              className={`backdrop-blur-2xl bg-black/30 rounded-xl border border-white/10 p-8 transform transition-all duration-500 ${
                activeCard === 'guided'
                  ? 'translate-y-0 shadow-lg shadow-amber-900/20'
                  : 'translate-y-4'
              }`}
            >
              <div className='flex items-center mb-3 text-amber-300'>
                <Calendar className='h-5 w-5 mr-2' />
                <span className='text-sm font-medium'>Curated Itineraries</span>
              </div>

              <h3 className='text-2xl md:text-3xl font-bold text-white mb-4'>
                {t('customPackagePage.cardGuide1Title')}
              </h3>

              <p className='text-gray-200 mb-6 text-base md:text-lg'>
                {t('customPackagePage.cardGuide1Description')}
              </p>

              <div className='space-y-3 mb-8'>
                {[
                  'Expert recommendations',
                  'Step-by-step guidance',
                  'Optimized for your preferences',
                ].map((feature, idx) => (
                  <div key={idx} className='flex items-center text-gray-300'>
                    <div className='w-1.5 h-1.5 rounded-full bg-amber-400 mr-2'></div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setBuilderMode('guided')}
                className='w-full py-3.5 px-6 rounded-xl font-medium bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg hover:shadow-amber-500/25 flex items-center justify-center'
              >
                {t('customPackagePage.cardGuideBtn')}
                <ArrowRight
                  size={18}
                  className='ml-2 transition-transform group-hover:translate-x-1'
                />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Custom Builder Card */}
        <motion.div
          className='relative h-[500px] md:h-[600px] rounded-2xl overflow-hidden group shadow-2xl'
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{
            y: -8,
            transition: { duration: 0.3 },
          }}
          onHoverStart={() => handleCardHover('custom')}
          onHoverEnd={() => handleCardHover(null)}
        >
          {/* Image container */}
          <div className='absolute inset-0 w-full h-full'>
            <Image
              src='/img/bike.jpg'
              alt='Custom Package Builder'
              fill
              className={`object-cover transition-all duration-700 ${
                activeCard === 'custom' ? 'scale-110 blur-[2px]' : 'scale-100'
              }`}
            />

            {/* Gradient overlays */}
            <div className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent'></div>
            <div
              className={`absolute inset-0 bg-blue-900/20 mix-blend-overlay transition-opacity duration-500 ${
                activeCard === 'custom' ? 'opacity-100' : 'opacity-0'
              }`}
            ></div>
          </div>

          {/* Content */}
          <div className='absolute inset-0 flex flex-col justify-between p-8 md:p-10'>
            {/* Top badge */}
            <div className='flex justify-between items-start'>
              <div className='inline-flex items-center bg-white/10 backdrop-blur-xl px-4 py-2 rounded-full border border-white/20'>
                <Package className='h-4 w-4 text-blue-400 mr-2' />
                <span className='text-sm font-medium text-white'>
                  Personalized Experience
                </span>
              </div>

              <div className='flex items-center space-x-1 bg-white/10 backdrop-blur-xl px-3 py-1.5 rounded-full border border-white/20'>
                <Map className='h-4 w-4 text-blue-400 mr-1' />
                <span className='text-xs text-gray-200'>Full Control</span>
              </div>
            </div>

            {/* Bottom content with blur background */}
            <div
              className={`backdrop-blur-2xl bg-black/30 rounded-xl border border-white/10 p-8 transform transition-all duration-500 ${
                activeCard === 'custom'
                  ? 'translate-y-0 shadow-lg shadow-blue-900/20'
                  : 'translate-y-4'
              }`}
            >
              <div className='flex items-center mb-3 text-blue-300'>
                <Map className='h-5 w-5 mr-2' />
                <span className='text-sm font-medium'>Build Your Own</span>
              </div>

              <h3 className='text-2xl md:text-3xl font-bold text-white mb-4'>
                {t('customPackagePage.cardGuide2Title')}
              </h3>

              <p className='text-gray-200 mb-6 text-base md:text-lg'>
                {t('customPackagePage.cardGuide2Description')}
              </p>

              <div className='space-y-3 mb-8'>
                {[
                  'Complete flexibility',
                  'Choose your own activities',
                  'Build at your own pace',
                ].map((feature, idx) => (
                  <div key={idx} className='flex items-center text-gray-300'>
                    <div className='w-1.5 h-1.5 rounded-full bg-blue-400 mr-2'></div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setBuilderMode('custom')}
                className='w-full py-3.5 px-6 rounded-xl font-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-blue-500/25 flex items-center justify-center'
              >
                {t('customPackagePage.cardGuideBtn2')}
                <ArrowRight
                  size={18}
                  className='ml-2 transition-transform group-hover:translate-x-1'
                />
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom feature highlights */}
      <motion.div
        className='grid grid-cols-1 md:grid-cols-3 gap-6 mt-16'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.6 }}
      >
        {[
          {
            icon: <Calendar className='h-6 w-6 text-amber-500' />,
            title: 'Flexible Planning',
            description: 'Modify your itinerary anytime before your trip',
          },
          {
            icon: <Star className='h-6 w-6 text-blue-500' />,
            title: 'Best Local Experiences',
            description: 'Curated by our team of local destination experts',
          },
          {
            icon: <Package className='h-6 w-6 text-green-500' />,
            title: 'All-inclusive Packages',
            description: 'Everything you need in one convenient booking',
          },
        ].map((feature, idx) => (
          <div
            key={idx}
            className='bg-white/50 backdrop-blur-md p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all'
          >
            <div className='bg-gray-50 p-3 rounded-full w-fit mb-4'>
              {feature.icon}
            </div>
            <h3 className='text-lg font-bold text-gray-800 mb-2'>
              {feature.title}
            </h3>
            <p className='text-gray-600'>{feature.description}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );

  return (
    <BookingProvider>
      <div className='flex flex-col min-h-screen font-[family-name:var(--font-geist-sans)]'>
        <Navbar />

        {/* Page Header */}
        <section className='bg-gradient-to-b from-gray-50 to-white pt-32 pb-12'>
          <div className='container mx-auto px-6'>
            <div className='max-w-4xl'>
              {/* Back Button */}
              <Link
                href='/'
                className='inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-6 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm hover:shadow border border-gray-100'
              >
                <ArrowLeft className='mr-2 h-5 w-5' />
                {t('customPackage.actions.backToHome', {
                  fallback: 'Back to Home',
                })}
              </Link>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className='text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4'>
                  {t('customPackagePage.title')}
                </h1>
                <p className='text-xl text-gray-600'>
                  {t('customPackagePage.subtitle')}
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Main Content Area */}
        <main className='flex-grow'>
          <div className='container mx-auto px-6'>
            {/* Dynamic Content based on mode */}
            <AnimatePresence mode='wait'>
              <motion.div
                key={builderMode}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        <Footer />
      </div>
    </BookingProvider>
  );
}
