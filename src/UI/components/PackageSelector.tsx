'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useBooking } from '@/context/BookingContext';
import { useTranslation } from '@/lib/i18n/client';
import { useRouter } from 'next/navigation';
import {
  CheckCircle,
  Star,
  PlaneTakeoff,
  Sailboat,
  ChefHat,
  Users,
} from 'lucide-react';

const PackageSelector = () => {
  const { packageType, setPackageType } = useBooking();
  const { t } = useTranslation();
  const router = useRouter();
  const handlePackageSelect = (selectedPackage: string) => {
    setPackageType(selectedPackage);

    if (selectedPackage === 'standard') {
      router.push('/standard-package');
    } else if (selectedPackage === 'premium') {
      router.push('/premium-package');
    }
  };

  return (
    <section
      id='packages'
      className='py-28 bg-gradient-to-b from-black to-gray-900'
    >
      <div className='container mx-auto px-6'>
        {/* Section heading with elegant styling */}
        <div className='text-center mb-20'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <span className='inline-block px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-400 font-medium text-sm tracking-wide mb-4'>
              EXCLUSIVE PACKAGES
            </span>
            <h2 className='text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight'>
              {t('home.packages.title')}
            </h2>
            <p className='text-lg text-gray-300 max-w-2xl mx-auto'>
              {t('home.packages.subtitle')}
            </p>
          </motion.div>
        </div>

        {/* Package cards with premium styling */}
        <div className='grid md:grid-cols-2 gap-8 md:gap-10 max-w-5xl mx-auto'>
          {/* Standard Package */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5 }}
          >
            <div
              onClick={() => handlePackageSelect('standard')}
              className={`
                relative p-1 rounded-2xl cursor-pointer transform transition-all duration-500
                ${
                  packageType === 'standard'
                    ? 'scale-105 ring-4 ring-blue-500'
                    : 'hover:scale-[1.02]'
                }
              `}
            >
              <div
                className={`
                  bg-gradient-to-br relative overflow-hidden from-gray-800 to-gray-900 rounded-xl p-8 h-full
                  border border-gray-700 shadow-xl transition-all duration-300
                  ${
                    packageType === 'standard'
                      ? 'border-blue-500/50'
                      : 'hover:border-blue-500/30'
                  }
                `}
              >
                {/* Decorative elements */}
                <div className='absolute -right-20 -top-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl'></div>
                <div className='absolute -left-10 -bottom-10 w-44 h-44 bg-blue-600/10 rounded-full blur-3xl'></div>

                <h3 className='text-2xl font-bold text-white mb-4 relative z-10'>
                  Punta Cana Plan
                </h3>
                <div className='flex items-center mb-6 relative z-10'>
                  <div className='flex mr-2'>
                    {[1, 2, 3, 4].map((star) => (
                      <Star
                        key={star}
                        className='h-5 w-5 text-blue-500 fill-blue-500'
                      />
                    ))}
                    <Star className='h-5 w-5 text-gray-400' />
                  </div>
                  <span className='text-gray-400 text-sm'>
                    Standard Experience
                  </span>
                </div>

                <p className='text-gray-300 mb-8 text-sm leading-relaxed relative z-10'>
                  {t('common.package-standard.standard')}
                </p>

                <div className='space-y-3 mb-8 relative z-10'>
                  <Feature
                    icon={<PlaneTakeoff className='h-5 w-5' />}
                    text={t('common.package-standard.transfers')}
                    color='blue'
                  />
                  <Feature
                    icon={<Sailboat className='h-5 w-5' />}
                    text={t('common.package-standard.trips')}
                    color='blue'
                  />
                  <Feature
                    icon={<ChefHat className='h-5 w-5' />}
                    text={t('common.package-standard.chef')}
                    color='blue'
                  />
                </div>

                <div className='relative z-10'>
                  <button
                    onClick={() => handlePackageSelect('standard')}
                    className={`
                      w-full py-3 px-4 rounded-lg font-medium transition-all duration-300
                      ${
                        packageType === 'standard'
                          ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                          : 'bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 border border-blue-500/30'
                      }
                    `}
                  >
                    {packageType === 'standard' ? (
                      <span className='flex items-center justify-center'>
                        <CheckCircle className='mr-2 h-5 w-5' />
                        Selected
                      </span>
                    ) : (
                      'Select This Package'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Premium Package */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div
              onClick={() => handlePackageSelect('premium')}
              className={`
                relative p-1 rounded-2xl cursor-pointer transform transition-all duration-500
                ${
                  packageType === 'premium'
                    ? 'scale-105 ring-4 ring-amber-500'
                    : 'hover:scale-[1.02]'
                }
              `}
            >
              <div
                className={`
                  bg-gradient-to-br relative overflow-hidden from-gray-800 to-gray-900 rounded-xl p-8 h-full
                  border border-gray-700 shadow-xl transition-all duration-300
                  ${
                    packageType === 'premium'
                      ? 'border-amber-500/50'
                      : 'hover:border-amber-500/30'
                  }
                `}
              >
                {/* Premium badge */}
                <div className='absolute top-4 right-4 bg-amber-500 text-black text-xs font-bold px-3 py-1 rounded-full'>
                  PREMIUM
                </div>

                {/* Decorative elements */}
                <div className='absolute -right-20 -top-20 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl'></div>
                <div className='absolute -left-10 -bottom-10 w-44 h-44 bg-amber-600/10 rounded-full blur-3xl'></div>

                <h3 className='text-2xl font-bold text-white mb-4 relative z-10'>
                  Punta Cana Luxe
                </h3>
                <div className='flex items-center mb-6 relative z-10'>
                  <div className='flex mr-2'>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className='h-5 w-5 text-amber-500 fill-amber-500'
                      />
                    ))}
                  </div>
                  <span className='text-gray-400 text-sm'>
                    Premium Experience
                  </span>
                </div>

                <p className='text-gray-300 mb-8 text-sm leading-relaxed relative z-10'>
                  {t('common.package-luxe.subtitle')}
                </p>

                <div className='space-y-3 mb-8 relative z-10'>
                  <Feature
                    icon={<Sailboat className='h-5 w-5' />}
                    text={t('common.package-luxe.yacht')}
                    color='amber'
                  />
                  <Feature
                    icon={<ChefHat className='h-5 w-5' />}
                    text={t('common.package-luxe.culinarie')}
                    color='amber'
                  />
                  <Feature
                    icon={<Users className='h-5 w-5' />}
                    text={t('common.package-luxe.massage')}
                    color='amber'
                  />
                </div>

                <div className='relative z-10'>
                  <button
                    onClick={() => handlePackageSelect('premium')}
                    className={`
                      w-full py-3 px-4 rounded-lg font-medium transition-all duration-300
                      ${
                        packageType === 'premium'
                          ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30'
                          : 'bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/30'
                      }
                    `}
                  >
                    {packageType === 'premium' ? (
                      <span className='flex items-center justify-center'>
                        <CheckCircle className='mr-2 h-5 w-5' />
                        Selected
                      </span>
                    ) : (
                      'Select This Package'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Feature component for package items
const Feature = ({ icon, text, color }) => (
  <div className='flex items-center space-x-3'>
    <div className={`flex-shrink-0 p-1.5 rounded-full bg-${color}-500/20`}>
      {React.cloneElement(icon, { className: `h-4 w-4 text-${color}-500` })}
    </div>
    <span className='text-white text-sm'>{text}</span>
  </div>
);

export default PackageSelector;
