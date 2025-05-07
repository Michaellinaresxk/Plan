'use client';

import React, { useState } from 'react';
import { BookingProvider } from '@/context/BookingContext';
import Navbar from '@/UI/components/shared/Navbar';
import Footer from '@/UI/components/shared/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Package, ChevronRight, Sparkles } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/client';
import Image from 'next/image';
import { Service } from '@/types/type';
import GuidedPackageBuilder from './GuidedPackageBuilder';
import CustomPackageBuilder from '../CustomPackageBuilder';
import { SERVICES_DATA } from '@/constants/services/serviceData';

export default function GuidedCustomPackagePage() {
  const { t } = useTranslation();
  const [builderMode, setBuilderMode] = useState<
    'choose' | 'guided' | 'custom'
  >('choose');
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);

  // Handle completion of guided builder
  const handleGuidedComplete = (services: Service[]) => {
    // If services array is empty, it means the user wants to switch to the manual builder
    if (services.length === 0) {
      setBuilderMode('custom');
      return;
    }

    setSelectedServices(services);
    setBuilderMode('custom'); // Move to custom builder with pre-selected services
  };

  // Render different sections based on mode
  const renderContent = () => {
    switch (builderMode) {
      case 'choose':
        return renderModeSelection();
      case 'guided':
        return (
          <GuidedPackageBuilder
            services={SERVICES_DATA}
            onComplete={handleGuidedComplete}
          />
        );
      case 'custom':
        return <CustomPackageBuilder services={SERVICES_DATA} />;
      default:
        return renderModeSelection();
    }
  };

  // Render mode selection UI
  const renderModeSelection = () => (
    <div className='py-20'>
      <div className='max-w-4xl mx-auto text-center mb-12'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-6'>
            {t('customPackagePage.chooseExperience')}
          </h2>
          <p className='text-xl text-gray-600 max-w-2xl mx-auto mb-12'>
            {t('customPackagePage.chooseExperienceSubtitle', {
              fallback:
                'Choose how you want to create your perfect Punta Cana experience',
            })}
          </p>
        </motion.div>

        <div className='grid md:grid-cols-2 gap-8'>
          {/* Guided Experience */}
          <motion.div
            className='bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1'
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <div className='relative h-48 overflow-hidden'>
              <Image
                src='/img/guided-builder.jpg'
                alt='Guided Package Builder'
                fill
                className='object-cover'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/70 to-transparent'></div>
            </div>

            <div className='p-6'>
              <h3 className='text-xl font-bold text-gray-900 mb-2 flex items-center'>
                <Sparkles className='mr-2 h-5 w-5 text-amber-500' />
                {t('customPackagePage.cardGuide1Title')}
              </h3>
              <p className='text-gray-600 mb-6'>
                {t('customPackagePage.cardGuide1Description')}
              </p>
              <button
                onClick={() => setBuilderMode('guided')}
                className='w-full py-3 px-4 rounded-lg font-medium bg-amber-500 text-white hover:bg-amber-600 transition-colors flex items-center justify-center'
              >
                {t('customPackagePage.cardGuideBtn')}
                <ChevronRight size={18} className='ml-1' />
              </button>
            </div>
          </motion.div>

          {/* Custom Builder */}
          <motion.div
            className='bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1'
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <div className='relative h-48 overflow-hidden'>
              <Image
                src='/img/custom-builder.jpg'
                alt='Custom Package Builder'
                fill
                className='object-cover'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/70 to-transparent'></div>
            </div>

            <div className='p-6'>
              <h3 className='text-xl font-bold text-gray-900 mb-2 flex items-center'>
                <Package className='mr-2 h-5 w-5 text-blue-500' />
                {t('customPackagePage.cardGuide2Title')}
              </h3>
              <p className='text-gray-600 mb-6'>
                {t('customPackagePage.cardGuide2Description')}
              </p>
              <button
                onClick={() => setBuilderMode('custom')}
                className='w-full py-3 px-4 rounded-lg font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors flex items-center justify-center'
              >
                {t('customPackagePage.cardGuideBtn2')}
                <ChevronRight size={18} className='ml-1' />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );

  return (
    <BookingProvider>
      <div className='flex flex-col min-h-screen font-[family-name:var(--font-geist-sans)]'>
        <Navbar />

        {/* Page Header */}
        <section className='bg-gray-50 pt-32 pb-12'>
          <div className='container mx-auto px-6'>
            <div className='max-w-4xl'>
              {/* Back Button */}
              <Link
                href='/'
                className='inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-6'
              >
                <ArrowLeft className='mr-2 h-5 w-5' />
                {t('customPackage.actions.backToHome', {
                  fallback: 'Back to Home',
                })}
              </Link>

              <h1 className='text-4xl font-bold text-gray-900 mb-4'>
                {t('customPackage.createYourPackage', {
                  fallback: 'Create Your Custom Package',
                })}
              </h1>
              <p className='text-xl text-gray-600'>
                {t('customPackagePage.title', {
                  fallback:
                    'Build a personalized vacation experience tailored to your preferences',
                })}
              </p>
            </div>
          </div>
        </section>

        {/* Main Content Area */}
        <main className='flex-grow bg-white'>
          <div className='container mx-auto px-6'>
            {/* Show back button when in guided or custom mode */}
            {builderMode !== 'choose' && (
              <div className='py-6'>
                <button
                  onClick={() => setBuilderMode('choose')}
                  className='inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors'
                >
                  <ArrowLeft className='mr-2 h-5 w-5' />
                  {t('customPackage.actions.backToOptions', {
                    fallback: 'Back to Options',
                  })}
                </button>
              </div>
            )}

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
