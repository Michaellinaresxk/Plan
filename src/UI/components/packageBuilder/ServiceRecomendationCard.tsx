import React from 'react';
import { motion } from 'framer-motion';
import { Check, Clock, Plus } from 'lucide-react';
import Image from 'next/image';
import { Service } from '@/types/type';
import { useTranslation } from '@/lib/i18n/client';

interface ServiceRecommendationCardProps {
  service: Service;
  isSelected: boolean;
  onToggle: () => void;
  packageType: 'standard' | 'premium';
}

const ServiceRecommendationCard: React.FC<ServiceRecommendationCardProps> = ({
  service,
  isSelected,
  onToggle,
  packageType,
}) => {
  const { t } = useTranslation();

  // Handle image loading errors
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/images/placeholder-service.jpg';
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className={`
        bg-white rounded-lg shadow-sm overflow-hidden border transition-all
        ${
          isSelected
            ? packageType === 'standard'
              ? 'border-blue-500 ring-2 ring-blue-200'
              : 'border-amber-500 ring-2 ring-amber-200'
            : 'border-gray-200 hover:border-gray-300'
        }
      `}
    >
      <div className='h-40 relative overflow-hidden'>
        <Image
          src={service.img || `/images/services/${service.id}.jpg`}
          alt={service.name}
          fill
          className='object-cover transition-transform duration-500 hover:scale-105'
          onError={handleImageError}
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
        />
      </div>

      <div className='p-4'>
        <h3 className='font-medium text-gray-900 mb-2'>{service.name}</h3>
        <p className='text-sm text-gray-600 mb-4 line-clamp-2'>
          {service.description}
        </p>

        <div className='flex justify-between items-center text-sm mb-4'>
          <div className='flex items-center text-gray-700'>
            <Clock className='mr-1 h-4 w-4 text-gray-500' />
            <span>
              {service.duration} {service.duration === 1 ? 'hour' : 'hours'}
            </span>
          </div>
          <span className='font-medium'>${service.price}</span>
        </div>

        <button
          onClick={onToggle}
          className={`
            w-full py-2 px-4 rounded font-medium flex items-center justify-center transition-colors
            ${
              isSelected
                ? packageType === 'standard'
                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                : packageType === 'standard'
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-amber-500 text-white hover:bg-amber-600'
            }
          `}
        >
          {isSelected ? (
            <>
              <Check className='mr-1 h-4 w-4' />
              {t('recommendations.selected', { fallback: 'Selected' })}
            </>
          ) : (
            <>
              <Plus className='mr-1 h-4 w-4' />
              {t('recommendations.add', { fallback: 'Add to Package' })}
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default ServiceRecommendationCard;
