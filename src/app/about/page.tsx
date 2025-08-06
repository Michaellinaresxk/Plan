'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/UI/components/shared/Navbar';
import Footer from '@/UI/components/shared/Footer';
import { ArrowRight, Star, Check, Clock, MapPin } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from '@/lib/i18n/client';
import CTASection from '@/UI/components/shared/CTASection';

const AboutPage = () => {
  const { t } = useTranslation();
  return (
    <div className='flex flex-col min-h-screen font-[family-name:var(--font-geist-sans)]'>
      <Navbar />

      <main className='flex-grow'>
        {/* Hero Section */}
        <section className='relative min-h-[70vh] flex items-center'>
          {/* Background with Overlay */}
          <div className='absolute inset-0 z-0'>
            <Image
              src='/img/bike.jpg'
              alt='About Punta Cana Plan'
              fill
              className='object-cover'
              priority
            />
            <div className='absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40'></div>
          </div>

          {/* Content */}
          <div className='container mx-auto px-6 relative z-10'>
            <div className='max-w-3xl'>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                <span className='inline-block px-4 py-1 bg-white/10 backdrop-blur-sm text-white rounded-full text-sm font-medium mb-6'>
                  {t('about.aboutChip')}
                </span>
                <h1 className='text-4xl md:text-6xl font-bold mb-6 text-white leading-tight'>
                  {t('about.title')}
                </h1>
                <p className='text-xl text-white/90 max-w-2xl font-light leading-relaxed'>
                  {t('about.subTitle')}
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className='py-12 bg-white relative z-10'>
          <div className='container mx-auto px-6'>
            <div className='grid grid-cols-2 md:grid-cols-4 -mt-24 relative z-20'>
              {/* Stat Card 1 */}
              <motion.div
                className='bg-white shadow-xl mt-5 rounded-xl p-8 text-center mx-2 hover:shadow-2xl transition-shadow duration-300'
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className='font-bold text-4xl text-blue-600 mb-2'>15+</div>
                <p className='text-gray-600'> {t('about.card1')}</p>
              </motion.div>

              {/* Stat Card 2 */}
              <motion.div
                className='bg-white shadow-xl mt-5 rounded-xl p-8 text-center mx-2 hover:shadow-2xl transition-shadow duration-300'
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className='font-bold text-4xl text-blue-600 mb-2'>
                  500+
                </div>
                <p className='text-gray-600'>{t('about.card2')}</p>
              </motion.div>

              {/* Stat Card 3 */}
              <motion.div
                className='bg-white shadow-xl rounded-xl p-8 mt-5 text-center mx-2 hover:shadow-2xl transition-shadow duration-300'
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className='font-bold text-4xl text-blue-600 mb-2'>20+</div>
                <p className='text-gray-600'>{t('about.card3')}</p>
              </motion.div>

              {/* Stat Card 4 */}
              <motion.div
                className='bg-white shadow-xl rounded-xl p-8 mt-5 text-center mx-2 hover:shadow-2xl transition-shadow duration-300'
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className='font-bold text-4xl text-blue-600 mb-2'>
                  100%
                </div>
                <p className='text-gray-600'>{t('about.card4')}</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className='py-20 bg-white'>
          <div className='container mx-auto px-6'>
            <div className='max-w-7xl mx-auto'>
              <div className='grid md:grid-cols-2 gap-16 items-center'>
                {/* Image Side */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className='relative'
                >
                  <div className='relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]'>
                    <Image
                      src='/img/bike.jpg'
                      alt='Nuestra historia'
                      fill
                      className='object-cover'
                    />
                    <div className='absolute bottom-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent w-full'>
                      <div className='text-white text-lg font-light'>
                        {t('about.from')} 2010
                      </div>
                    </div>
                  </div>

                  {/* Floating Card */}
                  <div className='absolute -bottom-10 -right-10 bg-white rounded-xl shadow-xl p-6 max-w-xs'>
                    <div className='flex items-center space-x-2 mb-3'>
                      <Star className='w-5 h-5 text-amber-500' />
                      <Star className='w-5 h-5 text-amber-500' />
                      <Star className='w-5 h-5 text-amber-500' />
                      <Star className='w-5 h-5 text-amber-500' />
                      <Star className='w-5 h-5 text-amber-500' />
                    </div>
                    <p className='text-gray-600 italic text-sm'>
                      {t('about.stars')}
                    </p>
                  </div>
                </motion.div>

                {/* Content Side */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <span className='inline-block px-4 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6'>
                    {t('about.ourHistory.aboutChip')}
                  </span>
                  <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-6'>
                    {t('about.ourHistory.title')}
                  </h2>

                  <div className='space-y-6 text-gray-700'>
                    <p className='text-lg'>{t('about.ourHistory.p1')}</p>
                    <p>{t('about.ourHistory.p2')}</p>
                    <p>{t('about.ourHistory.p3')}</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* What Makes Us Different Section */}
        <section className='py-24 bg-white'>
          <div className='container mx-auto px-6'>
            <div className='max-w-7xl mx-auto'>
              <div className='grid md:grid-cols-2 gap-16 items-center'>
                {/* Content Side */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <span className='inline-block px-4 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium mb-6'>
                    {t('about.difference.differentChip')}
                  </span>
                  <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-6'>
                    {t('about.difference.differentTitle')}
                  </h2>

                  <div className='space-y-6'>
                    <div className='flex items-start'>
                      <div className='flex-shrink-0 mt-1 mr-4'>
                        <div className='w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center'>
                          <Check className='w-4 h-4 text-blue-600' />
                        </div>
                      </div>
                      <div>
                        <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                          {t('about.difference.list1')}
                        </h3>
                        <p className='text-gray-600'>
                          {t('about.difference.list1Text')}
                        </p>
                      </div>
                    </div>

                    <div className='flex items-start'>
                      <div className='flex-shrink-0 mt-1 mr-4'>
                        <div className='w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center'>
                          <Check className='w-4 h-4 text-blue-600' />
                        </div>
                      </div>
                      <div>
                        <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                          {t('about.difference.list2')}
                        </h3>
                        <p className='text-gray-600'>
                          {t('about.difference.list2Text')}
                        </p>
                      </div>
                    </div>

                    <div className='flex items-start'>
                      <div className='flex-shrink-0 mt-1 mr-4'>
                        <div className='w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center'>
                          <Check className='w-4 h-4 text-blue-600' />
                        </div>
                      </div>
                      <div>
                        <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                          {t('about.difference.list3')}
                        </h3>
                        <p className='text-gray-600'>
                          {t('about.difference.list3Text')}
                        </p>
                      </div>
                    </div>

                    <div className='flex items-start'>
                      <div className='flex-shrink-0 mt-1 mr-4'>
                        <div className='w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center'>
                          <Check className='w-4 h-4 text-blue-600' />
                        </div>
                      </div>
                      <div>
                        <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                          {t('about.difference.list4')}
                        </h3>
                        <p className='text-gray-600'>
                          {t('about.difference.list4Text')}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className='mt-8'>
                    <Link
                      href='/contact'
                      className='inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-md'
                    >
                      {t('common.nav.needHelp')}
                      <ArrowRight className='ml-2 h-5 w-5' />
                    </Link>
                  </div>
                </motion.div>

                {/* Image Side */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className='relative'
                >
                  <div className='rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]'>
                    <Image
                      src='/images/difference.jpg'
                      alt='Nuestra diferencia'
                      fill
                      className='object-cover'
                    />
                  </div>

                  {/* Floating Elements */}
                  <div className='absolute -top-6 -left-6 bg-white rounded-xl shadow-xl p-4'>
                    <div className='flex items-center space-x-2'>
                      <div className='w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center'>
                        <Clock className='w-6 h-6 text-blue-600' />
                      </div>
                      <div>
                        <div className='text-sm font-medium text-gray-900'>
                          {t('about.difference.answer')} 24/7
                        </div>
                        <div className='text-xs text-gray-500'>
                          {t('about.difference.answerText')}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='absolute -bottom-6 -right-6 bg-white rounded-xl shadow-xl p-4'>
                    <div className='flex items-center space-x-2'>
                      <div className='w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center'>
                        <MapPin className='w-6 h-6 text-amber-600' />
                      </div>
                      <div>
                        <div className='text-sm font-medium text-gray-900'>
                          {t('about.difference.answer2')}
                        </div>
                        <div className='text-xs text-gray-500'>
                          {t('about.difference.answer2Text')}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        <CTASection />
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
