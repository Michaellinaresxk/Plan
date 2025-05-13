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
        className='grid grid-cols-1 md:grid-cols-3 gap-8 mt-20'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {[
          {
            icon: <Calendar className='h-6 w-6 text-amber-500' />,
            title: 'Flexible Planning',
            description: 'Modify your itinerary anytime before your trip',
            gradient: 'from-amber-500/10 to-amber-500/5',
            borderColor: 'border-amber-200/20',
            hoverBorder: 'group-hover:border-amber-300/30',
            iconBg: 'bg-amber-50',
          },
          {
            icon: <Star className='h-6 w-6 text-blue-500' />,
            title: 'Best Local Experiences',
            description: 'Curated by our team of local destination experts',
            gradient: 'from-blue-500/10 to-blue-500/5',
            borderColor: 'border-blue-200/20',
            hoverBorder: 'group-hover:border-blue-300/30',
            iconBg: 'bg-blue-50',
          },
          {
            icon: <Package className='h-6 w-6 text-green-500' />,
            title: 'All-inclusive Packages',
            description: 'Everything you need in one convenient booking',
            gradient: 'from-green-500/10 to-green-500/5',
            borderColor: 'border-green-200/20',
            hoverBorder: 'group-hover:border-green-300/30',
            iconBg: 'bg-green-50',
          },
        ].map((feature, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * idx + 0.3 }}
            className={`group relative bg-white/70 backdrop-blur-xl p-8 rounded-2xl border ${feature.borderColor} shadow-sm hover:shadow-lg transition-all duration-500 overflow-hidden`}
          >
            {/* Subtle gradient background */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-30 group-hover:opacity-60 transition-opacity duration-500`}
            ></div>

            {/* Icon */}
            <div
              className={`relative ${feature.iconBg} p-4 rounded-2xl w-fit mb-6 shadow-sm ${feature.hoverBorder} border border-transparent transition-colors duration-300`}
            >
              {feature.icon}
            </div>

            {/* Content */}
            <div className='relative'>
              <h3 className='text-xl font-bold text-gray-800 mb-3'>
                {feature.title}
              </h3>
              <p className='text-gray-600 leading-relaxed'>
                {feature.description}
              </p>
            </div>

            {/* Subtle diagonal line decoration */}
            <div
              className={`absolute -bottom-6 -right-6 w-12 h-12 rounded-full border-2 ${feature.borderColor} opacity-20 group-hover:opacity-40 transition-opacity duration-500`}
            ></div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );

  return (
    <BookingProvider>
      <div className='flex flex-col min-h-screen font-[family-name:var(--font-geist-sans)]'>
        <Navbar />

        {/* Page Header */}
        <section className='relative overflow-hidden pt-24 pb-12'>
          {/* Decorative background elements */}
          <div className='absolute inset-0 -z-10'>
            <div className='absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-blue-50 to-transparent'></div>
            <div className='absolute -top-24 right-0 w-96 h-96 rounded-full bg-blue-50/80 blur-3xl'></div>
            <div className='absolute top-1/3 left-10 w-48 h-48 rounded-full bg-indigo-50/50 blur-3xl'></div>
            <div className='absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-amber-50/40 blur-3xl'></div>
          </div>

          <div className='container mx-auto px-6 relative z-10'>
            <div className='max-w-4xl'>
              {/* Badge */}
              <div className='inline-flex items-center mb-6 px-4 py-1.5 bg-white rounded-full shadow-sm border border-gray-100'>
                <Sparkles className='w-4 h-4 mr-2 text-blue-500' />
                <span className='text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'>
                  {t('customPackage.badge', { fallback: 'Custom Experience' })}
                </span>
              </div>

              {/* Back Button - Enhanced version */}
              {/* <Link
                href='/'
                className='inline-flex items-center mb-8 text-gray-600 hover:text-gray-900 transition-colors group'
              >
                <span className='mr-2 h-8 w-8 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center group-hover:bg-gray-50 transition-colors'>
                  <ArrowLeft className='h-4 w-4 group-hover:-translate-x-0.5 transition-transform' />
                </span>
                <span className='font-medium'>
                  {t('customPackage.actions.backToHome', {
                    fallback: 'Back to Home',
                  })}
                </span>
              </Link> */}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-gray-800 bg-clip-text text-transparent mb-6'>
                  {t('customPackagePage.title')}
                </h1>
                <p className='text-xl md:text-2xl text-gray-600 max-w-2xl'>
                  {t('customPackagePage.subtitle')}
                </p>
              </motion.div>
            </div>
          </div>

          {/* Bottom divider */}
          <div className='absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent'></div>
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
