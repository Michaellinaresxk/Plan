'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from '@/lib/i18n/client';
import { ChevronRight } from 'lucide-react';

const ConsiergeSupport = () => {
  const { t } = useTranslation();
  return (
    <section className='py-20 bg-white'>
      <div className='container mx-auto px-6'>
        <div className='max-w-6xl mx-auto'>
          <div className='grid md:grid-cols-2 gap-16 items-center'>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <span className='inline-block px-4 py-1 bg-gray-200 text-gray-800 rounded-full text-sm font-medium mb-4'>
                {t('customPackage.personalTouch', {
                  fallback: 'Personal Touch',
                })}
              </span>
              <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-6'>
                {t('common.consierge.title', {
                  fallback: 'Need Help? Our Concierge Team Is Ready',
                })}
              </h2>
              <p className='text-xl text-gray-600 mb-8'>
                {t('common.consierge.subtitle', {
                  fallback:
                    'Not sure which services to select? Our experienced concierge team is available to guide you through creating the perfect package tailored to your preferences.',
                })}
              </p>

              <div className='space-y-4 mb-8'>
                <div className='flex items-start'>
                  <div className='flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mt-1 mr-3'>
                    <svg
                      className='h-4 w-4 text-green-600'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M5 13l4 4L19 7'
                      />
                    </svg>
                  </div>
                  <p className='text-gray-600'>
                    {t('common.consierge.option1', {
                      fallback:
                        'Expert advice on selecting the perfect mix of services',
                    })}
                  </p>
                </div>
                <div className='flex items-start'>
                  <div className='flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mt-1 mr-3'>
                    <svg
                      className='h-4 w-4 text-green-600'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M5 13l4 4L19 7'
                      />
                    </svg>
                  </div>
                  <p className='text-gray-600'>
                    {t('common.consierge.option2', {
                      fallback:
                        'Personalized suggestions based on your preferences',
                    })}
                  </p>
                </div>
                <div className='flex items-start'>
                  <div className='flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mt-1 mr-3'>
                    <svg
                      className='h-4 w-4 text-green-600'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M5 13l4 4L19 7'
                      />
                    </svg>
                  </div>
                  <p className='text-gray-600'>
                    {t('common.consierge.option3', {
                      fallback:
                        'Assistance with special requests and arrangements',
                    })}
                  </p>
                </div>
              </div>

              <Link
                href='/contact'
                className='inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'
              >
                {t('common.consierge.button', {
                  fallback: 'Contact Our Concierge Team',
                })}
                <ChevronRight className='ml-2 h-5 w-5' />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className='relative'
            >
              <div className='rounded-2xl overflow-hidden shadow-2xl'>
                <Image
                  src='/img/consierge.jpg'
                  alt='Concierge team'
                  width={600}
                  height={800}
                  className='w-full h-full object-cover'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent'></div>
                <div className='absolute bottom-0 left-0 right-0 p-8'>
                  <div className='bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg'>
                    <div className='flex items-center mb-4'>
                      <div className='w-12 h-12 rounded-full overflow-hidden border-2 border-blue-500 mr-4'>
                        <Image
                          src='/img/consierge.jpg'
                          alt='Concierge portrait'
                          width={48}
                          height={48}
                          className='w-full h-full object-cover'
                        />
                      </div>
                      <div>
                        <h4 className='font-semibold text-gray-900'>
                          Ramon Brito
                        </h4>
                        <p className='text-gray-600 text-sm'>
                          Head of Concierge Services
                        </p>
                      </div>
                    </div>
                    <p className='text-gray-700 italic'>
                      {t('common.consierge.testimonial')}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConsiergeSupport;
