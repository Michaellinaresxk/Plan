import { Service } from '@/constants/formFields';
import { animations, motion } from 'framer-motion';
import {
  ArrowRight,
  Award,
  ChefHat,
  Clock,
  Crown,
  Play,
  Users,
} from 'lucide-react';
import Image from 'next/image';
const ChefHeroSection: React.FC<{
  service: Service;
  maxPeople: number;
  isPremium: boolean;
  onBookClick: () => void;
}> = ({ maxPeople, isPremium, onBookClick }) => (
  <motion.div
    className='relative overflow-hidden w-full my-6 sm:my-8 lg:my-12'
    initial='hidden'
    animate='visible'
    variants={animations.fadeInUp}
  >
    <div className='relative h-[90vh] sm:h-[75vh] lg:h-[80vh] bg-gradient-to-r from-green-900/60 via-black-900/70 to-blue-800/50'>
      <Image
        src='https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1200'
        alt='Professional chef preparing gourmet cuisine'
        fill
        className='object-cover'
        priority
      />

      {/* Overlay simplificado */}
      <div className='absolute inset-0 bg-black/40 z-[1]' />
      <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 z-[2]' />

      <div className='relative z-10 h-full flex items-center justify-center text-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16'>
        <div className='max-w-4xl w-full space-y-6 sm:space-y-8 lg:space-y-10'>
          <motion.h1
            className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight'
            variants={animations.fadeInUp}
          >
            Private Chef
            <br />
            <span className='bg-gradient-to-r from-amber-300 via-orange-300 to-red-300 bg-clip-text text-transparent'>
              Experience
            </span>
          </motion.h1>

          <motion.p
            className='text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed px-2'
            variants={animations.fadeInUp}
          >
            Enhance your dining experience into an extraordinary culinary
            journey with skilled chefs in your own space.
          </motion.p>

          <motion.div
            className='flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-8 max-w-3xl mx-auto justify-center'
            variants={animations.slideIn}
          >
            <div className='flex items-center bg-white/15 backdrop-blur-sm px-3 py-3 sm:px-4 sm:py-3 lg:px-6 lg:py-4 rounded-xl border border-white/20 flex-1 sm:flex-none'>
              <Users className='w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white mr-2 sm:mr-3 flex-shrink-0' />
              <div className='text-left'>
                <div className='text-white font-semibold text-sm sm:text-base'>
                  {maxPeople} Guests +
                </div>
                <div className='text-white/70 text-xs sm:text-sm'>
                  Perfect for Groups
                </div>
              </div>
            </div>

            <div className='flex items-center bg-white/15 backdrop-blur-sm px-3 py-3 sm:px-4 sm:py-3 lg:px-6 lg:py-4 rounded-xl border border-white/20 flex-1 sm:flex-none'>
              <Clock className='w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white mr-2 sm:mr-3 flex-shrink-0' />
              <div className='text-left'>
                <div className='text-white font-semibold text-sm sm:text-base'>
                  Select
                </div>
                <div className='text-white/70 text-xs sm:text-sm'>
                  Standard Chef
                </div>
              </div>
            </div>

            <div className='flex items-center bg-white/15 backdrop-blur-sm px-3 py-3 sm:px-4 sm:py-3 lg:px-6 lg:py-4 rounded-xl border border-white/20 flex-1 sm:flex-none'>
              <Award className='w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white mr-2 sm:mr-3 flex-shrink-0' />
              <div className='text-left'>
                <div className='text-white font-semibold text-sm sm:text-base'>
                  Skilled Chefs
                </div>
                <div className='text-white/70 text-xs sm:text-sm'>
                  Professional Service
                </div>
              </div>
            </div>
          </motion.div>

          <div className='pt-4 sm:pt-6 lg:pt-8'>
            <motion.button
              onClick={onBookClick}
              className='bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:from-orange-600 hover:via-amber-600 hover:to-orange-600 text-white px-6 py-3 sm:px-8 sm:py-4 lg:px-10 lg:py-5 rounded-xl lg:rounded-2xl font-bold text-base sm:text-lg lg:text-xl flex items-center gap-2 sm:gap-3 mx-auto transition-all duration-300 hover:scale-105 shadow-2xl max-w-xs sm:max-w-none'
              variants={animations.slideIn}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play className='w-5 h-5 sm:w-6 sm:h-6' fill='currentColor' />
              <span className='whitespace-nowrap'>Book Your Chef</span>
              <ArrowRight className='w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform' />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

export default ChefHeroSection;
