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
  Utensils,
} from 'lucide-react';
import Image from 'next/image';
const ChefHeroSection: React.FC<{
  service: Service;
  maxPeople: number;
  isPremium: boolean;
  onBookClick: () => void;
}> = ({ service, maxPeople, isPremium, onBookClick }) => (
  <motion.div
    className='relative overflow-hidden rounded-3xl mx-4 mt-8'
    initial='hidden'
    animate='visible'
    variants={animations.fadeInUp}
  >
    <div className='relative h-[85vh] bg-gradient-to-r from-green-900/60 via-black-900/70 to-blue-800/50'>
      <Image
        src='https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1200'
        alt='Professional chef preparing gourmet cuisine'
        fill
        className='object-cover mix-blend-overlay'
        priority
      />

      {/* Floating Culinary Elements */}
      <motion.div
        className='absolute top-20 right-20 w-20 h-20 bg-orange-500/20 rounded-full backdrop-blur-sm border border-orange-500/30 flex items-center justify-center'
        animate={{ y: [-10, 10, -10], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
      >
        <ChefHat className='w-8 h-8 text-white' />
      </motion.div>
      <motion.div
        className='absolute bottom-32 left-16 w-16 h-16 bg-amber-500/20 rounded-full backdrop-blur-sm border border-amber-500/30 flex items-center justify-center'
        animate={{ y: [10, -10, 10], rotate: [0, -5, 5, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      >
        <Utensils className='w-6 h-6 text-white' />
      </motion.div>

      <div className='relative z-10 h-full flex items-center justify-center text-center px-8'>
        <div className='max-w-6xl'>
          <motion.div
            className='inline-flex items-center bg-white/15 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20 mb-8'
            variants={animations.slideIn}
          >
            {isPremium && <Crown className='w-5 h-5 text-amber-300 mr-3' />}
            <ChefHat className='w-5 h-5 text-white mr-3' />
            <span className='text-white font-medium text-lg'>
              {isPremium
                ? 'Professional Excellence'
                : 'Culinary Artistry at Home'}
            </span>
          </motion.div>

          <motion.h1
            className='text-6xl md:text-8xl font-bold text-white mb-8 leading-tight'
            variants={animations.fadeInUp}
          >
            Private Chef
            <br />
            <span className='bg-gradient-to-r from-amber-300 via-orange-300 to-red-300 bg-clip-text text-transparent'>
              Experience
            </span>
          </motion.h1>

          <motion.p
            className='text-2xl md:text-3xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed'
            variants={animations.fadeInUp}
          >
            Transform your dining into an extraordinary culinary journey with
            skilled chefs in your space
          </motion.p>

          <motion.div
            className='flex flex-wrap justify-center gap-8 mb-12'
            variants={animations.slideIn}
          >
            <div className='flex items-center bg-white/15 backdrop-blur-sm px-6 py-4 rounded-2xl border border-white/20'>
              <Users className='w-6 h-6 text-white mr-3' />
              <div className='text-left'>
                <div className='text-white font-semibold'>
                  Up to {maxPeople} Guests
                </div>
                <div className='text-white/70 text-sm'>
                  Intimate to Celebration
                </div>
              </div>
            </div>
            <div className='flex items-center bg-white/15 backdrop-blur-sm px-6 py-4 rounded-2xl border border-white/20'>
              <Clock className='w-6 h-6 text-white mr-3' />
              <div className='text-left'>
                <div className='text-white font-semibold'>3-6 Hours</div>
                <div className='text-white/70 text-sm'>Full Experience</div>
              </div>
            </div>
            <div className='flex items-center bg-white/15 backdrop-blur-sm px-6 py-4 rounded-2xl border border-white/20'>
              <Award className='w-6 h-6 text-white mr-3' />
              <div className='text-left'>
                <div className='text-white font-semibold'>Skilled Chefs</div>
                <div className='text-white/70 text-sm'>
                  Professional Service
                </div>
              </div>
            </div>
          </motion.div>

          <motion.button
            onClick={onBookClick}
            className='group bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:from-orange-600 hover:via-amber-600 hover:to-orange-600 text-white px-12 py-5 rounded-2xl font-bold text-xl flex items-center gap-3 mx-auto transition-all duration-300 hover:scale-105 shadow-2xl'
            variants={animations.slideIn}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Play className='w-7 h-7' fill='currentColor' />
            Book Your Chef
            <ArrowRight className='w-6 h-6 group-hover:translate-x-1 transition-transform' />
          </motion.button>
        </div>
      </div>
    </div>
  </motion.div>
);

export default ChefHeroSection;
