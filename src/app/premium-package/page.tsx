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

  const PREMIUM_DETAILS = [
    {
      icon: Clock,
      titleKey: 'premiumPage.overview.details.duration.title',
      valueKey: 'premiumPage.overview.details.duration.value',
    },
    {
      icon: Users,
      titleKey: 'premiumPage.overview.details.groupSize.title',
      valueKey: 'premiumPage.overview.details.groupSize.value',
    },
    {
      icon: MapPin,
      titleKey: 'premiumPage.overview.details.location.title',
      valueKey: 'premiumPage.overview.details.location.value',
    },
    {
      icon: Wine,
      titleKey: 'premiumPage.overview.details.services.title',
      valueKey: 'premiumPage.overview.details.services.value',
    },
  ] as const;

  return (
    <div className='min-h-screen bg-stone-950'>
      <Navbar />

      {/* ══════════════════════════════════════════════════════════════
      HERO — full bleed, dark luxury
  ══════════════════════════════════════════════════════════════ */}
      <section className='relative w-full h-[60vh] sm:h-[65vh] lg:h-[75vh]'>
        <Image
          src='/img/saona-island/saona-3.jpg'
          alt={t('premiumPage.hero.imageAlt')}
          fill
          className='object-cover'
          priority
        />
        <div className='absolute inset-0 bg-gradient-to-t from-stone-950 via-black/40 to-black/20' />

        <div className='relative z-10 h-full flex items-end'>
          <div className='w-full px-5 sm:px-8 lg:px-12 pb-10 sm:pb-14 lg:pb-16'>
            <motion.div
              initial='hidden'
              animate='visible'
              variants={staggerContainer}
              className='max-w-3xl'
            >
              <motion.p
                variants={fadeInUp}
                className='text-amber-400 uppercase tracking-[0.3em] text-[11px] sm:text-xs font-medium mb-4'
              >
                {t('premiumPage.hero.badge')}
              </motion.p>

              <motion.h1
                variants={fadeInUp}
                className='text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-light text-white leading-[1.1] tracking-tight mb-2'
              >
                {t('premiumPage.hero.titlePrefix')}
                <span className='text-amber-400'>
                  {t('premiumPage.hero.titleHighlight')}
                </span>
              </motion.h1>

              <motion.div
                variants={fadeInUp}
                className='flex items-center gap-1.5 mb-5 mt-4'
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className='w-3.5 h-3.5 text-amber-500 fill-amber-500'
                  />
                ))}
                <span className='text-stone-500 text-xs ml-1.5'>
                  {t('premiumPage.hero.rating')}
                </span>
              </motion.div>

              <motion.p
                variants={fadeInUp}
                className='text-white/50 text-sm sm:text-base max-w-lg leading-relaxed font-light mb-7'
              >
                {t('premiumPage.hero.description')}
              </motion.p>

              <motion.div variants={fadeInUp}>
                <Link
                  href='/standard-package'
                  className='group inline-flex items-center gap-2 border border-stone-700 text-stone-300 px-6 py-3 text-xs font-medium tracking-wide uppercase hover:border-stone-500 hover:text-white transition-colors duration-300'
                >
                  {t('premiumPage.hero.exploreStandardButton')}
                  <ArrowRight className='w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform' />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
      OVERVIEW + SERVICES
  ══════════════════════════════════════════════════════════════ */}
      <section className='px-5 sm:px-8 lg:px-12 py-16 sm:py-20 lg:py-24'>
        {isLoading ? (
          <div className='flex items-center justify-center py-20'>
            <div className='text-center'>
              <Loader2 className='w-8 h-8 animate-spin text-amber-500 mx-auto mb-3' />
              <p className='text-stone-500 text-sm'>
                {t('premiumPage.overview.loading')}
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Section heading */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6 }}
              className='mb-14 sm:mb-18'
            >
              <p className='text-amber-500 uppercase tracking-[0.25em] text-[11px] font-medium mb-2'>
                Premium Collection
              </p>
              <h2 className='text-2xl sm:text-3xl lg:text-4xl font-light text-white tracking-tight mb-3'>
                {t('premiumPage.overview.title')}
              </h2>
              <p className='text-stone-500 text-sm sm:text-base max-w-xl leading-relaxed'>
                {t('premiumPage.overview.subtitle')}
              </p>
            </motion.div>

            {/* Overview grid */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className='max-w-5xl mx-auto mb-20'
            >
              <div className='grid md:grid-cols-2 gap-10 lg:gap-14'>
                {/* Left — description */}
                <div>
                  <h3 className='text-white font-medium text-base mb-4 flex items-center gap-2'>
                    {t('premiumPage.overview.experienceTitle')}
                  </h3>
                  <p className='text-stone-400 text-sm leading-relaxed mb-4'>
                    {t('premiumPage.overview.experienceDescription1')}
                  </p>
                  <p className='text-stone-400 text-sm leading-relaxed mb-6'>
                    {t('premiumPage.overview.experienceDescription2')}
                  </p>
                  <p className='text-amber-500 text-xs font-medium uppercase tracking-wider'>
                    {t('premiumPage.overview.availabilityNote')}
                  </p>
                </div>

                {/* Right — detail cards (deduplicated) */}
                <div className='grid grid-cols-2 gap-3'>
                  {PREMIUM_DETAILS.map(({ icon: Icon, titleKey, valueKey }) => (
                    <div
                      key={titleKey}
                      className='border border-stone-800 bg-stone-900/50 p-5'
                    >
                      <Icon className='w-4 h-4 text-amber-500 mb-3' />
                      <h4 className='text-white text-xs font-medium mb-1'>
                        {t(titleKey)}
                      </h4>
                      <p className='text-stone-500 text-xs'>{t(valueKey)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Service cards */}
            <ServiceList
              services={services}
              servicePath='premium-package'
              variant='dark'
              textColor='white'
              viewContext='premium-view'
            />
          </>
        )}
      </section>

      {/* ══════════════════════════════════════════════════════════════
      CTA — full bleed with background image
  ══════════════════════════════════════════════════════════════ */}
      <section className='relative w-full'>
        <Image
          src='/img/beach.jpg'
          alt={t('premiumPage.cta.backgroundImageAlt')}
          fill
          className='object-cover'
        />
        <div className='absolute inset-0 bg-stone-950/90' />

        <div className='relative z-10 py-16 sm:py-20 lg:py-24 px-5 sm:px-8 lg:px-12'>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            className='max-w-2xl mx-auto text-center'
          >
            <p className='text-amber-400 uppercase tracking-[0.3em] text-[11px] font-medium mb-5'>
              Begin Your Journey
            </p>
            <h2 className='text-2xl sm:text-3xl lg:text-4xl font-light text-white mb-5 tracking-tight'>
              {t('premiumPage.cta.title')}
            </h2>
            <p className='text-white/40 text-sm sm:text-base leading-relaxed mb-10 max-w-lg mx-auto'>
              {t('premiumPage.cta.description')}
            </p>

            <Link
              href='/contact'
              className='group inline-flex items-center gap-2.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-8 py-3.5 text-xs font-medium tracking-wide uppercase hover:bg-amber-500/20 hover:border-amber-500/50 transition-colors duration-300'
            >
              {t('premiumPage.cta.contactButton')}
              <ArrowRight className='w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform' />
            </Link>
          </motion.div>
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
