import { motion } from 'framer-motion';
import { ArrowUpRight, Clock, Users } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/client';

const MassageCard = ({ massage, isSelected, onSelect }) => {
  const { t } = useTranslation();
  const prices = massage.durations.map((d) => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceDisplay =
    minPrice === maxPrice ? `$${minPrice}` : `$${minPrice}–$${maxPrice}`;
  const durationDisplay = massage.durations
    .map((d) => `${d.duration}min`)
    .join(' / ');

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      onClick={onSelect}
      className={`
        relative overflow-hidden bg-white border cursor-pointer group
        ${isSelected ? 'border-stone-900' : 'border-stone-200'}
      `}
    >
      {/* ── Image ─ */}
      <div className='relative h-52 overflow-hidden'>
        <motion.div
          className='relative w-full h-full'
          whileHover={{ scale: 1.04 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <img
            src={massage.imageUrl}
            alt={massage.name}
            className='w-full h-full object-cover'
          />
        </motion.div>

        <div className='absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent' />

        {massage.isPremium && (
          <div className='absolute top-3 right-3 z-10'>
            <span className='px-2.5 py-1 bg-black/50 backdrop-blur-sm border border-amber-500/30 text-amber-400 text-[10px] font-medium uppercase tracking-[0.15em]'>
              Premium
            </span>
          </div>
        )}

        {/* Price overlay */}
        <div className='absolute bottom-3 right-3 z-10'>
          <span className='text-stone-900 text-lg font-light'>
            {priceDisplay}
          </span>
        </div>
      </div>

      {/* ── Content ─ */}
      <div className='p-6'>
        <h3 className='text-lg font-semibold tracking-tight text-stone-900 group-hover:text-stone-600 transition-colors duration-300 mb-2'>
          {massage.name}
        </h3>

        {/* Meta */}
        <div className='flex items-center gap-3 mb-3'>
          <span className='inline-flex items-center gap-1 text-[11px] text-stone-400 tracking-wide'>
            <Clock className='w-3 h-3' />
            {durationDisplay}
          </span>
          <span className='inline-flex items-center gap-1 text-[11px] text-stone-400 tracking-wide'>
            <Users className='w-3 h-3' />
            {t('services.standard.massageView.massageCard.upTo', {
              fallback: 'Up to',
            })}{' '}
            {massage.maxPersons}
          </span>
        </div>

        <p className='text-sm text-stone-500 leading-relaxed line-clamp-2 mb-4'>
          {massage.description}
        </p>

        {/* Benefits as inline tags */}
        <div className='flex flex-wrap gap-1.5 mb-5'>
          {massage.benefits.slice(0, 2).map((benefit, idx) => (
            <span
              key={idx}
              className='text-[11px] text-stone-500 border border-stone-200 px-2 py-0.5'
            >
              {benefit}
            </span>
          ))}
          {massage.benefits.length > 2 && (
            <span className='text-[11px] text-stone-400 px-1'>
              +{massage.benefits.length - 2}
            </span>
          )}
        </div>

        {/* CTA */}
        <div className='inline-flex items-center gap-1.5 py-2.5 px-4 bg-stone-900 text-white text-xs font-medium uppercase tracking-[0.1em] group-hover:bg-stone-800 transition-colors duration-300'>
          {t('services.standard.massageView.massageCard.bookButton', {
            fallback: 'Book Now',
          })}
          <ArrowUpRight className='w-3.5 h-3.5' />
        </div>
      </div>
    </motion.article>
  );
};

export default MassageCard;
