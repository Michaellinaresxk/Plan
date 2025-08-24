'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/client';
import {
  Package,
  ChevronRight,
  Sparkles,
  Star,
  Compass,
  Settings,
} from 'lucide-react';
import { useBooking } from '@/context/BookingContext';
import Image from 'next/image';

const featureItems = [
  {
    icon: Compass,
    translationKey: 'customPackageCTA.feature1',
    fallback: 'Choose from a wide range of services',
  },
  {
    icon: Settings,
    translationKey: 'customPackageCTA.feature2',
    fallback: 'Customize every detail of your trip',
  },
  {
    icon: Star,
    translationKey: 'customPackageCTA.feature3',
    fallback: 'Create memorable experiences',
  },
];

const CustomPackageCTA = () => {
  const { t } = useTranslation();
  const { packageType } = useBooking();

  // Si no hay un paquete seleccionado, no mostramos el CTA
  if (!packageType) return null;

  // Determinar colores basados en el tipo de paquete seleccionado
  const isPremium = packageType === 'premium';
  const primaryColor = isPremium ? 'amber' : 'blue';

  // Variantes para animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 260,
        damping: 20,
      },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 10,
      },
    },
    tap: { scale: 0.95 },
  };

  return (
    <section className='relative overflow-hidden'>
      <div className='absolute inset-0 bg-gradient-to-b from-gray-900 via-black to-gray-900 z-0'></div>
      {/* Decorative elements */}
      <div className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-30'></div>
      <div className='absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-30'></div>

      <div className='absolute top-1/4 right-1/4 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl'></div>
      <div className='absolute bottom-1/4 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl'></div>

      <div className='container mx-auto max-w-6xl relative z-10 py-28 px-6'>
        <motion.div
          className='grid md:grid-cols-5 gap-12 items-center'
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
        >
          {/* Left side (Content) */}
          <motion.div
            className='md:col-span-3 z-10'
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <span
                className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-${primaryColor}-500/20 text-${primaryColor}-400 tracking-wide mb-6`}
              >
                {isPremium ? 'PREMIUM EXPERIENCE' : 'CUSTOM EXPERIENCE'}
              </span>
            </motion.div>

            <motion.h2
              className='text-3xl md:text-4xl lg:text-5xl font-bold mb-8 text-white tracking-tight leading-tight'
              variants={itemVariants}
            >
              {t('customPackageCTA.title', {
                fallback: 'Design Your Perfect Vacation Experience',
              })}
            </motion.h2>

            <motion.p
              className='text-xl text-gray-300 mb-10 max-w-xl leading-relaxed'
              variants={itemVariants}
            >
              {t('customPackageCTA.description', {
                fallback:
                  'Create a custom package that perfectly fits your vacation dreams. Select exactly what you want, when you want it.',
              })}
            </motion.p>

            {/* Features */}
            <motion.ul className='space-y-5 mb-10' variants={containerVariants}>
              {featureItems.map((item, index) => (
                <motion.li
                  key={index}
                  className='flex items-center gap-4'
                  variants={itemVariants}
                >
                  <div
                    className={`p-3 rounded-lg bg-${primaryColor}-500/20 backdrop-blur-sm`}
                  >
                    <item.icon className={`h-5 w-5 text-${primaryColor}-400`} />
                  </div>
                  <span className='text-gray-200 font-medium'>
                    {t(item.translationKey, { fallback: item.fallback })}
                  </span>
                </motion.li>
              ))}
            </motion.ul>

            <motion.div
              className='flex flex-wrap gap-5 mt-10'
              variants={itemVariants}
            >
              <motion.div
                variants={buttonVariants}
                whileHover='hover'
                whileTap='tap'
              >
                <Link
                  href='/custom-package'
                  className={`inline-flex items-center justify-center px-8 py-4 bg-${primaryColor}-500 hover:bg-${primaryColor}-600 text-${
                    isPremium ? 'black' : 'white'
                  } font-semibold rounded-lg transition-all duration-300 shadow-lg shadow-${primaryColor}-500/30`}
                >
                  {t('customPackageCTA.buildButton', {
                    fallback: 'Create Custom Package',
                  })}
                  <ChevronRight className='ml-2 h-5 w-5' />
                </Link>
              </motion.div>

              <motion.div
                variants={buttonVariants}
                whileHover='hover'
                whileTap='tap'
              >
                <Link
                  href='/#packages'
                  className='inline-flex items-center justify-center px-6 py-4 bg-transparent text-gray-300 border border-gray-700 hover:border-gray-500 font-medium rounded-lg hover:bg-gray-800/50 transition-all duration-300'
                >
                  {t('customPackageCTA.exploreButton', {
                    fallback: 'Explore All Services',
                  })}
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right side (Image) */}
          <motion.div
            className='md:col-span-2 relative'
            variants={itemVariants}
          >
            <div className='relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-[3px] border-gray-800 transform rotate-2'>
              <Image
                src='/images/custom-package-hero.jpg'
                alt='Custom vacation package'
                fill
                className='object-cover'
                sizes='(max-width: 768px) 100vw, 40vw'
                priority
              />

              {/* Glass overlay */}
              <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent'></div>

              {/* Floating elements */}
              <motion.div
                className={`absolute top-6 right-6 bg-${primaryColor}-500 text-${
                  isPremium ? 'black' : 'white'
                } font-bold py-2 px-4 rounded-lg shadow-xl backdrop-blur-sm transform rotate-3`}
                animate={{
                  y: [0, -10, 0],
                  rotate: [3, 5, 3],
                  scale: [1, 1.02, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: 'mirror',
                }}
              >
                <span className='flex items-center'>
                  <Sparkles className='mr-2 h-4 w-4' />
                  {t('customPackageCTA.personalized', {
                    fallback: 'Personalized',
                  })}
                </span>
              </motion.div>

              <motion.div
                className='absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm text-gray-900 font-bold py-2 px-4 rounded-lg shadow-xl flex items-center space-x-2 transform -rotate-2'
                animate={{
                  y: [0, 8, 0],
                  rotate: [-2, -4, -2],
                  scale: [1, 1.03, 1],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  repeatType: 'mirror',
                  delay: 1,
                }}
              >
                <Package className='h-4 w-4' />
                <span>
                  {t('customPackageCTA.yourWay', { fallback: 'Your Way' })}
                </span>
              </motion.div>
            </div>

            {/* Additional decorative element */}
            <div className='absolute -bottom-6 -right-6 h-12 w-12 rounded-full bg-amber-500/30 backdrop-blur-md'></div>
            <div className='absolute -top-8 -left-8 h-16 w-16 rounded-full border-4 border-blue-500/20 backdrop-blur-md'></div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CustomPackageCTA;
