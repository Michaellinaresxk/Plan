import { Service } from '@/constants/formFields';
import { animations, motion } from 'framer-motion';
import { ArrowRight, Award, ChefHat, Shield, Zap } from 'lucide-react';
import Image from 'next/image';
const ChefCTASection: React.FC<{
  service: Service;
  onBookClick: () => void;
}> = ({ service, onBookClick }) => (
  <motion.div
    className='px-4'
    initial='hidden'
    animate='visible'
    variants={animations.fadeInUp}
  >
    <div className='relative overflow-hidden rounded-3xl'>
      <div className='absolute inset-0'>
        <Image
          src='https://images.pexels.com/photos/9986228/pexels-photo-9986228.jpeg?_gl=1*17t3j26*_ga*MTQzOTE0OTkxMS4xNzUzMjcxMDk0*_ga_8JE65Q40S6*czE3NTM3OTg1NjgkbzgkZzEkdDE3NTM4MDAyMjIkajU5JGwwJGgw'
          alt='Elegant dining setup'
          fill
          className='object-cover'
        />
        <div className='absolute inset-0 bg-gradient-to-r from-orange-900/70 via-amber-800/60 to-orange-900/70' />
      </div>

      <div className='relative z-10 p-16 text-center text-white'>
        <h2 className='text-5xl md:text-6xl font-bold mb-6'>Ready to taste?</h2>
        <p className='text-2xl opacity-90 mb-12 max-w-3xl mx-auto leading-relaxed'>
          Turn your next gathering into an unforgettable dining experience.
          Schedule your personal chef today and let extraordinary cuisine create
          lasting memories.
        </p>

        <div className='flex flex-col sm:flex-row gap-8 justify-center items-center'>
          <button
            onClick={onBookClick}
            className='group bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:from-orange-600 hover:via-amber-600 hover:to-orange-600 text-white px-12 py-5 rounded-2xl font-bold text-xl flex items-center gap-3 transition-all duration-300 hover:scale-105 shadow-2xl'
          >
            <ChefHat className='w-6 h-6' />
            Book Your Chef Experience
            <ArrowRight className='w-6 h-6 group-hover:translate-x-1 transition-transform' />
          </button>
        </div>
      </div>
    </div>
  </motion.div>
);

export default ChefCTASection;
