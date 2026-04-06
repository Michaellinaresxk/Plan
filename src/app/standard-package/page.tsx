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
    <div className='min-h-screen bg-stone-50'>
      <Navbar />

      {/* ══════════════════════════════════════════════════════════════
      HERO — full bleed, editorial layout
  ══════════════════════════════════════════════════════════════ */}
      <section className='relative w-full h-[60vh] sm:h-[65vh] lg:h-[70vh]'>
        <Image
          src='/img/bike.jpg'
          alt='Luxury experience in Punta Cana'
          fill
          className='object-cover'
          priority
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent' />

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
                className='text-amber-300 uppercase tracking-[0.3em] text-[11px] sm:text-xs font-medium mb-4'
              >
                {t('standardPage.chip')}
              </motion.p>

              <motion.h1
                variants={fadeInUp}
                className='text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-light text-white leading-[1.1] tracking-tight mb-3'
              >
                Lux Punta Cana
                <span className='block text-lg sm:text-xl lg:text-2xl font-light text-white/50 mt-2'>
                  Standard Experience
                </span>
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className='text-white/55 text-sm sm:text-base max-w-lg leading-relaxed font-light mb-7'
              >
                {t('standardPage.subTitle')}
              </motion.p>

              <motion.div variants={fadeInUp}>
                <Link
                  href='/premium-package'
                  className='group inline-flex items-center gap-2 bg-white text-stone-900 px-6 py-3 text-xs font-medium tracking-wide uppercase hover:bg-amber-50 transition-colors duration-300'
                >
                  {t('standardPage.btn1')}
                  <ChevronRight className='w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform' />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
      SERVICES
  ══════════════════════════════════════════════════════════════ */}
      <section className='px-5 sm:px-8 lg:px-12 py-16 sm:py-20 lg:py-24'>
        {isLoading ? (
          <div className='flex items-center justify-center py-20'>
            <div className='text-center'>
              <Loader2 className='w-8 h-8 animate-spin text-stone-400 mx-auto mb-3' />
              <p className='text-stone-400 text-sm'>Loading experiences...</p>
            </div>
          </div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6 }}
              className='mb-12 sm:mb-16'
            >
              <p className='text-amber-600 uppercase tracking-[0.25em] text-[11px] font-medium mb-2'>
                Our Services
              </p>
              <h2 className='text-2xl sm:text-3xl lg:text-4xl font-light text-stone-900 tracking-tight mb-3'>
                {t('services.standard.standardPage.title')}
              </h2>
              <p className='text-stone-400 text-sm sm:text-base max-w-xl leading-relaxed'>
                {t('services.standard.standardPage.subtitle')}
              </p>
            </motion.div>

            <ServiceList
              services={services}
              servicePath='standard-package'
              viewContext='standard-view'
            />
          </>
        )}
      </section>

      {/* ══════════════════════════════════════════════════════════════
      CTA BANNER — full bleed
  ══════════════════════════════════════════════════════════════ */}
      <section className='relative w-full'>
        <div className='absolute inset-0 bg-stone-900' />

        <div className='relative z-10 py-16 sm:py-20 lg:py-24 px-5 sm:px-8 lg:px-12'>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            className='max-w-2xl mx-auto text-center'
          >
            <p className='text-amber-400 uppercase tracking-[0.3em] text-[11px] font-medium mb-5'>
              Elevate Your Stay
            </p>
            <h2 className='text-2xl sm:text-3xl lg:text-4xl font-light text-white mb-5 tracking-tight'>
              {t('standardPage.standardPageCTA.title')}
            </h2>
            <p className='text-white/40 text-sm sm:text-base leading-relaxed mb-10'>
              {t('standardPage.standardPageCTA.subtitle')}
            </p>

            <Link
              href='/premium-package'
              className='group inline-flex items-center gap-2.5 bg-white text-stone-900 px-8 py-3.5 text-xs font-medium tracking-wide uppercase hover:bg-amber-50 transition-colors duration-300'
            >
              {t('standardPage.standardPageCTA.btn2')}
              <ArrowRight className='w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform' />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
      FAQ
  ══════════════════════════════════════════════════════════════ */}
      <section className='px-5 sm:px-8 lg:px-12 py-16 sm:py-20 lg:py-24'>
        <div className='max-w-3xl mx-auto'>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            className='mb-12'
          >
            <p className='text-amber-600 uppercase tracking-[0.25em] text-[11px] font-medium mb-2'>
              Information
            </p>
            <h2 className='text-2xl sm:text-3xl lg:text-4xl font-light text-stone-900 tracking-tight mb-3'>
              {t('common.faqs.title')}
            </h2>
            <p className='text-stone-400 text-sm sm:text-base max-w-lg leading-relaxed'>
              {t('common.faqs.subtitle')}
            </p>
          </motion.div>

          <motion.div
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true, margin: '-60px' }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.08 } },
            }}
            className='space-y-0 divide-y divide-stone-200'
          >
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
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
                }}
                className='py-6'
              >
                <h4 className='text-stone-900 font-medium text-sm mb-2'>
                  {faq.question}
                </h4>
                <p className='text-stone-400 text-sm leading-relaxed'>
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Contact prompt */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className='mt-14 border border-stone-200 bg-white p-8 text-center'
          >
            <h3 className='text-stone-900 font-medium text-base mb-2'>
              {t('common.faqs.stillHaveQuestions')}
            </h3>
            <p className='text-stone-400 text-sm mb-6 max-w-md mx-auto leading-relaxed'>
              {t('common.faqs.stillHaveQuestionsText')}
            </p>
            <Link
              href='/contact'
              className='group inline-flex items-center gap-2 bg-stone-900 text-white px-6 py-3 text-xs font-medium tracking-wide uppercase hover:bg-stone-800 transition-colors duration-300'
            >
              {t('common.faqs.contactUs')}
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

const StandardPackage = () => {
  return (
    <BookingProvider>
      <StandardPackageContent />
    </BookingProvider>
  );
};

export default StandardPackage;
