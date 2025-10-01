import { motion } from 'framer-motion';
import {
  ArrowRight,
  Calendar,
  CheckCircle,
  Star,
  Timer,
  Users,
} from 'lucide-react';
import IntensityBadge from './IntensityBadge';
import { useTranslation } from '@/lib/i18n/client';

// Massage Card Component
const MassageCard = ({ massage, isSelected, onSelect }) => {
  const { t } = useTranslation();
  const prices = massage.durations.map((d) => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceDisplay =
    minPrice === maxPrice ? `$${minPrice}` : `$${minPrice} - $${maxPrice}`;
  const popularDuration = massage.durations.find((d) => d.popular);

  return (
    <motion.div
      className={`group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer ${
        isSelected ? 'ring-2 ring-emerald-400 shadow-2xl' : ''
      }`}
      whileHover={{ y: -8 }}
      onClick={onSelect}
      layout
    >
      <div className='relative h-56 overflow-hidden'>
        <img
          src={massage.imageUrl}
          alt={massage.name}
          className='object-cover group-hover:scale-110 transition-transform duration-700'
        />

        <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent' />

        <div className='absolute top-4 left-4 right-4 flex justify-between items-start'>
          {isSelected && (
            <div className='bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg'>
              <CheckCircle className='w-3 h-3 inline mr-1' />
              {t('services.standard.massageCard.selected')}
            </div>
          )}
        </div>

        <div className='absolute bottom-4 left-4 right-4'>
          <div className='flex items-center justify-between text-white'>
            <div className='flex items-center gap-2 text-sm'>
              <Timer className='w-4 h-4' />
              <span>
                {massage.durations.map((d) => `${d.duration}min`).join(' / ')}
              </span>
            </div>
            <div className='text-xl font-bold'>{priceDisplay}</div>
          </div>
        </div>

        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
          <div className='w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center'>
            <span className='text-3xl'>{massage.emoji}</span>
          </div>
        </div>
      </div>

      <div className='p-6'>
        <div className='flex items-start justify-between mb-3'>
          <div className='flex-1'>
            <h3 className='text-xl font-semibold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors'>
              {massage.name}
            </h3>
            <p className='text-gray-600 text-sm leading-relaxed mb-3 line-clamp-2'>
              {massage.description}
            </p>
          </div>
        </div>

        <div className='flex items-center justify-between mb-4'>
          <IntensityBadge intensity={massage.intensity} />
          <div className='flex items-center gap-1 text-sm text-gray-500'>
            <Users className='w-4 h-4' />
            <span>
              {t('services.standard.massageCard.upTo')} {massage.maxPersons}
            </span>
          </div>
        </div>

        <div className='flex flex-wrap gap-1 mb-4'>
          {massage.benefits.slice(0, 2).map((benefit, idx) => (
            <span
              key={idx}
              className='text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md'
            >
              {benefit}
            </span>
          ))}
          {massage.benefits.length > 2 && (
            <span className='text-xs text-gray-500 px-2 py-1'>
              {t('services.standard.massageCard.moreBenefits', {
                count: massage.benefits.length - 2,
              })}
            </span>
          )}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className='w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg flex items-center justify-center gap-2'
        >
          <Calendar className='w-4 h-4' />
          {t('services.standard.massageCard.bookButton')}
          <ArrowRight className='w-4 h-4' />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default MassageCard;
