import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Car,
  Diamond,
  Play,
  Calendar,
  Shield,
  Battery,
  Clock,
  MapPin,
} from 'lucide-react';

interface HeroSectionProps {
  onBookingClick: () => void;
}

const GolfCartHero: React.FC<HeroSectionProps> = ({ onBookingClick }) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, 200]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const scale = useTransform(scrollY, [0, 400], [1, 1.1]);

  return (
    <div className='relative h-screen overflow-hidden'>
      {/* Video Background */}
      <motion.div style={{ y, scale }} className='absolute inset-0'>
        <div className='absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/70' />
        <img
          src='https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1920&h=1080&fit=crop'
          alt='Luxury Golf Cart'
          className='absolute inset-0 w-full h-full object-cover'
        />
      </motion.div>

      {/* Floating Elements */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className='absolute w-1 h-1 bg-white/40 rounded-full'
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.4, 0.8, 0.4],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Hero Content */}
      <motion.div
        style={{ opacity }}
        className='relative z-10 h-full flex items-center'
      >
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full'>
          <div className='grid lg:grid-cols-2 gap-12 items-center'>
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className='text-white'
            >
              {/* Premium Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className='inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-8'
              >
                <Diamond className='w-5 h-5 text-cyan-400' />
                <span className='text-sm font-semibold'>
                  PREMIUM MOBILITY COLLECTION
                </span>
                <Diamond className='w-5 h-5 text-cyan-400' />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className='text-5xl lg:text-7xl font-thin mb-6 leading-tight'
              >
                Move
                <span className='block font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent'>
                  Freely
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
                className='text-xl lg:text-2xl text-gray-300 mb-8 leading-relaxed max-w-lg'
              >
                Explore Punta Cana in style with our luxury golf cart
                collection. Freedom on wheels, delivered to your door.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3, duration: 0.8 }}
                className='flex flex-col sm:flex-row gap-4 mb-12'
              >
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow: '0 20px 40px rgba(6, 182, 212, 0.3)',
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onBookingClick}
                  className='group bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center space-x-3 relative overflow-hidden'
                >
                  <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000' />
                  <Car className='w-6 h-6' />
                  <span>Explore Fleet</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className='border-2 border-white/60 text-white px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center space-x-3 backdrop-blur-sm hover:bg-white/10 transition-all duration-300'
                >
                  <Play className='w-6 h-6' />
                  <span>Watch Tour</span>
                </motion.button>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6, duration: 0.8 }}
                className='grid grid-cols-3 gap-6'
              >
                {[
                  { number: '50+', label: 'Premium Carts' },
                  { number: '500+', label: 'Happy Guests' },
                  { number: '24/7', label: 'Support' },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.8 + index * 0.1 }}
                    className='text-center'
                  >
                    <div className='text-3xl font-bold text-cyan-400'>
                      {stat.number}
                    </div>
                    <div className='text-sm text-gray-400 uppercase tracking-wider'>
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Content - Modern Card */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
              className='hidden lg:block'
            >
              <div className='relative'>
                {/* Main Card */}
                <motion.div
                  whileHover={{ y: -10, rotateY: 5 }}
                  className='bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 transform perspective-1000'
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <div className='flex items-center space-x-4 mb-6'>
                    <div className='w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center'>
                      <Car className='w-8 h-8 text-white' />
                    </div>
                    <div>
                      <h3 className='text-2xl font-bold text-white'>
                        Premium Service
                      </h3>
                      <p className='text-gray-300'>Door-to-Door Delivery</p>
                    </div>
                  </div>

                  <p className='text-gray-300 mb-6'>
                    Experience hassle-free mobility with our premium golf cart
                    service. Delivered fully charged and ready to explore.
                  </p>

                  <div className='grid grid-cols-2 gap-4'>
                    {[
                      {
                        icon: <Shield className='w-5 h-5' />,
                        text: 'Fully Insured',
                      },
                      {
                        icon: <Battery className='w-5 h-5' />,
                        text: 'Fully Charged',
                      },
                      {
                        icon: <Clock className='w-5 h-5' />,
                        text: '24/7 Support',
                      },
                      {
                        icon: <MapPin className='w-5 h-5' />,
                        text: 'Free Delivery',
                      },
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.2 + index * 0.1 }}
                        className='flex items-center space-x-2 text-gray-300'
                      >
                        {item.icon}
                        <span className='text-sm font-medium'>{item.text}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Floating Elements */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  className='absolute -top-4 -right-4 w-8 h-8 border-2 border-cyan-400/50 rounded-full'
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className='absolute -bottom-4 -left-4 w-6 h-6 bg-purple-500/50 rounded-full'
                />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className='absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/80'
      >
        <div className='flex flex-col items-center space-y-2'>
          <div className='w-6 h-10 border-2 border-white/60 rounded-full flex justify-center'>
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className='w-1 h-3 bg-white rounded-full mt-2'
            />
          </div>
          <span className='text-xs uppercase tracking-wider'>
            Scroll to explore
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default GolfCartHero;
