// src/components/dayplanner/ServiceCard.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Clock, DollarSign, Plus, Check } from 'lucide-react';
import { Service } from '@/types/type';
import { useTranslation } from '@/lib/i18n/client';
import Image from 'next/image';

interface ServiceCardProps {
  service: Service;
  isSelected: boolean;
  onToggle: () => void;
  variant?: 'default' | 'compact';
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  isSelected,
  onToggle,
  variant = 'default',
}) => {
  const { t } = useTranslation();

  if (variant === 'compact') {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className='bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow'
        onClick={onToggle}
      >
        <div className='flex items-start space-x-4'>
          <div className='w-20 h-20 rounded-lg overflow-hidden flex-shrink-0'>
            <Image
              src={service.img}
              alt={service.name}
              width={80}
              height={80}
              className='object-cover w-full h-full'
            />
          </div>

          <div className='flex-1'>
            <h4 className='font-semibold text-gray-900'>{service.name}</h4>
            <p className='text-sm text-gray-600 line-clamp-2 mb-2'>
              {service.description}
            </p>

            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-3 text-sm text-gray-500'>
                <div className='flex items-center'>
                  <Clock size={14} className='mr-1' />
                  <span>{service.duration}h</span>
                </div>
                <div className='flex items-center'>
                  <DollarSign size={14} className='mr-1' />
                  <span>{service.price}</span>
                </div>
              </div>

              <button className='p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600'>
                <Plus size={16} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className={`bg-white rounded-lg overflow-hidden shadow-lg cursor-pointer ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      }`}
      onClick={onToggle}
    >
      <div className='h-48 relative'>
        <Image
          src={service.img}
          alt={service.name}
          fill
          className='object-cover'
        />
        {isSelected && (
          <div className='absolute top-4 right-4 bg-blue-500 text-white p-2 rounded-full'>
            <Check size={20} />
          </div>
        )}
      </div>

      <div className='p-4'>
        <h3 className='text-lg font-semibold mb-2'>{service.name}</h3>
        <p className='text-gray-600 text-sm mb-4 line-clamp-2'>
          {service.description}
        </p>

        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-4'>
            <div className='flex items-center text-gray-500'>
              <Clock size={16} className='mr-1' />
              <span className='text-sm'>{service.duration}h</span>
            </div>
            <div className='flex items-center text-blue-600 font-semibold'>
              <DollarSign size={16} className='mr-1' />
              <span>{service.price}</span>
            </div>
          </div>

          <button
            className={`px-4 py-2 rounded-lg ${
              isSelected
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {isSelected ? t('common.selected') : t('common.select')}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ServiceCard;
