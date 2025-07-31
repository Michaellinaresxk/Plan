'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  Star,
  PlaneTakeoff,
  Sailboat,
  ChefHat,
  Users,
  Crown,
  Diamond,
  Sparkles,
  ArrowRight,
  Award,
  Gem,
  Zap,
  Globe,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

// Mock translation function - replace with your actual implementation
const useTranslation = () => ({
  t: (key: string) => {
    const translations: Record<string, string> = {
      'home.packages.title': 'Choose Your Experience',
      'home.packages.subtitle':
        'Select the perfect luxury package tailored to your desires',
      'common.package-standard.standard':
        'Experience the best of Punta Cana with our carefully curated standard package.',
      'common.package-standard.transfers': 'Premium Airport Transfers',
      'common.package-standard.trips': 'Catamaran Adventures',
      'common.package-standard.chef': 'Private Chef Experience',
      'common.package-luxe.subtitle':
        'Indulge in ultimate luxury with our premium collection of exclusive experiences.',
      'common.package-luxe.yacht': 'Private Yacht Charter',
      'common.package-luxe.culinarie': 'Michelin-Star Dining',
      'common.package-luxe.massage': 'Spa & Wellness',
    };
    return translations[key] || key;
  },
});

// Mock booking context - replace with your actual implementation
const useBooking = () => {
  const [packageType, setPackageType] = useState('');
  return { packageType, setPackageType };
};

// Enhanced Feature Component
const UltraFeature = ({
  icon,
  text,
  color,
  delay = 0,
}: {
  icon: React.ReactNode;
  text: string;
  color: 'blue' | 'amber';
  delay?: number;
}) => {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-500/20',
      icon: 'text-blue-400',
      glow: 'group-hover:shadow-blue-500/25',
    },
    amber: {
      bg: 'bg-amber-500/20',
      icon: 'text-amber-400',
      glow: 'group-hover:shadow-amber-500/25',
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6 }}
      whileHover={{ scale: 1.02, x: 5 }}
      className='group flex items-center space-x-4 p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300'
    >
      <div
        className={`flex-shrink-0 p-3 rounded-2xl ${colorClasses[color].bg} ${colorClasses[color].glow} group-hover:shadow-lg transition-all duration-300`}
      >
        <div
          className={`w-5 h-5 ${colorClasses[color].icon} group-hover:scale-110 transition-transform`}
        >
          {icon}
        </div>
      </div>
      <span className='text-white font-medium group-hover:text-gray-100 transition-colors'>
        {text}
      </span>
    </motion.div>
  );
};

// Premium Package Card Component
const PremiumPackageCard = ({
  packageData,
  isSelected,
  onSelect,
  delay = 0,
}: {
  packageData: any;
  isSelected: boolean;
  onSelect: () => void;
  delay?: number;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, delay }}
      whileHover={{ y: -15, scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`
        relative cursor-pointer transform transition-all duration-700 group
        ${isSelected ? 'scale-105' : ''}
      `}
      onClick={onSelect}
    >
      {/* Glow Effect */}
      <motion.div
        animate={{
          opacity: isSelected || isHovered ? 1 : 0,
          scale: isSelected || isHovered ? 1 : 0.8,
        }}
        transition={{ duration: 0.5 }}
        className={`absolute -inset-4 rounded-3xl blur-xl ${
          packageData.isPremium
            ? 'bg-gradient-to-r from-amber-500/30 to-orange-500/30'
            : 'bg-gradient-to-r from-blue-500/30 to-cyan-500/30'
        }`}
      />

      {/* Main Card */}
      <div
        className={`
        relative bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl 
        rounded-3xl p-8 h-full border-2 transition-all duration-500
        ${
          isSelected
            ? packageData.isPremium
              ? 'border-amber-500/80 shadow-2xl shadow-amber-500/25'
              : 'border-blue-500/80 shadow-2xl shadow-blue-500/25'
            : packageData.isPremium
            ? 'border-amber-500/30 hover:border-amber-500/60'
            : 'border-blue-500/30 hover:border-blue-500/60'
        }
      `}
      >
        {/* Background Decorative Elements */}
        <div className='absolute inset-0 overflow-hidden rounded-3xl'>
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className={`absolute -right-20 -top-20 w-64 h-64 rounded-full blur-3xl ${
              packageData.isPremium ? 'bg-amber-500/20' : 'bg-blue-500/20'
            }`}
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.05, 0.2, 0.05],
            }}
            transition={{ duration: 5, repeat: Infinity, delay: 1 }}
            className={`absolute -left-10 -bottom-10 w-44 h-44 rounded-full blur-3xl ${
              packageData.isPremium ? 'bg-orange-500/20' : 'bg-cyan-500/20'
            }`}
          />
        </div>

        {/* Premium Badge */}
        {packageData.isPremium && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className='absolute -top-4 -right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-black text-xs font-bold px-4 py-2 rounded-full flex items-center space-x-1 shadow-lg'
          >
            <Crown className='w-3 h-3' />
            <span>PREMIUM</span>
          </motion.div>
        )}

        {/* Content */}
        <div className='relative z-10 space-y-6'>
          {/* Header */}
          <div className='space-y-4'>
            <div className='flex items-center space-x-3'>
              <motion.div
                animate={{ rotate: isHovered ? 360 : 0 }}
                transition={{ duration: 0.8 }}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  packageData.isPremium
                    ? 'bg-gradient-to-br from-amber-500 to-orange-600'
                    : 'bg-gradient-to-br from-blue-500 to-cyan-600'
                }`}
              >
                {packageData.isPremium ? (
                  <Gem className='w-6 h-6 text-white' />
                ) : (
                  <Zap className='w-6 h-6 text-white' />
                )}
              </motion.div>

              <div>
                <h3 className='text-2xl font-bold text-white group-hover:text-gray-100 transition-colors'>
                  {packageData.title}
                </h3>
                <p
                  className={`text-sm font-medium ${
                    packageData.isPremium ? 'text-amber-400' : 'text-blue-400'
                  }`}
                >
                  {packageData.subtitle}
                </p>
              </div>
            </div>

            {/* Rating */}
            <div className='flex items-center space-x-2'>
              <div className='flex'>
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * i }}
                  >
                    <Star
                      className={`h-5 w-5 ${
                        i < packageData.rating
                          ? packageData.isPremium
                            ? 'text-amber-500 fill-amber-500'
                            : 'text-blue-500 fill-blue-500'
                          : 'text-gray-600'
                      }`}
                    />
                  </motion.div>
                ))}
              </div>
              <span className='text-gray-400 text-sm'>
                {packageData.experience}
              </span>
            </div>
          </div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className='text-gray-300 leading-relaxed'
          >
            {packageData.description}
          </motion.p>

          {/* Features */}
          <div className='space-y-3'>
            {packageData.features.map((feature: any, index: number) => (
              <UltraFeature
                key={index}
                icon={feature.icon}
                text={feature.text}
                color={packageData.isPremium ? 'amber' : 'blue'}
                delay={0.1 * index}
              />
            ))}
          </div>

          {/* Action Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
              w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 
              flex items-center justify-center space-x-3 relative overflow-hidden group
              ${
                isSelected
                  ? packageData.isPremium
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-black shadow-lg shadow-amber-500/30'
                    : 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg shadow-blue-500/30'
                  : packageData.isPremium
                  ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border-2 border-amber-500/30 hover:border-amber-500/60'
                  : 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border-2 border-blue-500/30 hover:border-blue-500/60'
              }
            `}
          >
            {/* Shimmer Effect */}
            <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000' />

            <div className='relative flex items-center space-x-3'>
              {isSelected ? (
                <>
                  <CheckCircle className='w-6 h-6' />
                  <span>Selected</span>
                </>
              ) : (
                <>
                  <span>Select Package</span>
                  <ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform' />
                </>
              )}
            </div>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

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

  // Package Data
  const packages = [
    {
      id: 'standard',
      title: 'Standard',
      subtitle: 'Standard Experience',
      description: t('common.package-standard.standard'),
      rating: 4,
      experience: 'Curated Experience',
      isPremium: false,
      features: [
        {
          icon: <PlaneTakeoff className='h-5 w-5' />,
          text: t('common.package-standard.transfers'),
        },
        {
          icon: <Sailboat className='h-5 w-5' />,
          text: t('common.package-standard.trips'),
        },
        {
          icon: <ChefHat className='h-5 w-5' />,
          text: t('common.package-standard.chef'),
        },
      ],
    },
    {
      id: 'premium',
      title: 'Luxe',
      subtitle: 'Premium Experience',
      description: t('common.package-luxe.subtitle'),
      rating: 5,
      experience: 'Ultra Luxury',
      isPremium: true,
      features: [
        {
          icon: <Sailboat className='h-5 w-5' />,
          text: t('common.package-luxe.yacht'),
        },
        {
          icon: <ChefHat className='h-5 w-5' />,
          text: t('common.package-luxe.culinarie'),
        },
        {
          icon: <Users className='h-5 h-5' />,
          text: t('common.package-luxe.massage'),
        },
      ],
    },
  ];

  return (
    <section
      id='packages'
      className='py-32 bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden'
    >
      {/* Background Effects */}
      <div className='absolute inset-0'>
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            rotate: { duration: 100, repeat: Infinity, ease: 'linear' },
            scale: { duration: 8, repeat: Infinity },
            opacity: { duration: 6, repeat: Infinity },
          }}
          className='absolute top-20 right-20 w-96 h-96 border border-blue-400/20 rounded-full'
        />
        <motion.div
          animate={{
            rotate: -360,
            scale: [1, 1.3, 1],
            opacity: [0.05, 0.2, 0.05],
          }}
          transition={{
            rotate: { duration: 120, repeat: Infinity, ease: 'linear' },
            scale: { duration: 10, repeat: Infinity },
            opacity: { duration: 8, repeat: Infinity },
          }}
          className='absolute bottom-20 left-20 w-80 h-80 border-2 border-amber-400/20 rounded-full'
        />
      </div>

      <div className='container mx-auto px-6 relative'>
        {/* Enhanced Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1 }}
          className='text-center mb-20'
        >
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className='inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-8 py-4 mb-8'
          >
            <Diamond className='w-5 h-5 text-amber-400' />
            <span className='text-sm font-bold text-white tracking-wider'>
              EXCLUSIVE PACKAGES
            </span>
            <Diamond className='w-5 h-5 text-amber-400' />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className='text-5xl md:text-7xl font-thin text-white mb-8 tracking-tight'
          >
            {t('home.packages.title')}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className='text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed'
          >
            {t('home.packages.subtitle')}
          </motion.p>
        </motion.div>

        {/* Premium Package Cards */}
        <div className='grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto'>
          {packages.map((pkg, index) => (
            <PremiumPackageCard
              key={pkg.id}
              packageData={pkg}
              isSelected={packageType === pkg.id}
              onSelect={() => handlePackageSelect(pkg.id)}
              delay={index * 0.2}
            />
          ))}
        </div>

        {/* Additional Features Banner */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className='mt-20 text-center'
        ></motion.div>
      </div>
    </section>
  );
};

export default PackageSelector;
