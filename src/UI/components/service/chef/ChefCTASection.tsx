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
          src='https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80&w=1200'
          alt='Elegant dining setup'
          fill
          className='object-cover'
        />
        <div className='absolute inset-0 bg-gradient-to-r from-orange-900/70 via-amber-800/60 to-orange-900/70' />
      </div>

      <div className='relative z-10 p-16 text-center text-white'>
        <h2 className='text-5xl md:text-6xl font-bold mb-6'>
          Ready to Indulge?
        </h2>
        <p className='text-2xl opacity-90 mb-12 max-w-3xl mx-auto leading-relaxed'>
          Transform your next gathering into an unforgettable culinary
          experience. Book your chef today and taste the extraordinary.
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

        <div className='mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center'>
          <div className='bg-white/15 backdrop-blur-sm rounded-2xl p-6 border border-white/20'>
            <Zap className='w-8 h-8 text-amber-300 mx-auto mb-3' />
            <h4 className='font-bold mb-2'>Instant Booking</h4>
            <p className='text-white/80 text-sm'>
              Quick confirmation & scheduling
            </p>
          </div>
          <div className='bg-white/15 backdrop-blur-sm rounded-2xl p-6 border border-white/20'>
            <Shield className='w-8 h-8 text-amber-300 mx-auto mb-3' />
            <h4 className='font-bold mb-2'>Satisfaction Guaranteed</h4>
            <p className='text-white/80 text-sm'>
              100% satisfaction or money back
            </p>
          </div>
          <div className='bg-white/15 backdrop-blur-sm rounded-2xl p-6 border border-white/20'>
            <Award className='w-8 h-8 text-amber-300 mx-auto mb-3' />
            <h4 className='font-bold mb-2'>Premium Service</h4>
            <p className='text-white/80 text-sm'>
              Professional culinary expertise
            </p>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

export default ChefCTASection;
