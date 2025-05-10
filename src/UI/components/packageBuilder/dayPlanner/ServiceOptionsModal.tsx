import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChefHat } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/client';
import { Service } from '@/types/type';

interface ServiceOptionsModalProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (options: Record<string, any>) => void;
}

const ServiceOptionsModal: React.FC<ServiceOptionsModalProps> = ({
  service,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const { t } = useTranslation();
  const [mealType, setMealType] = useState('');
  const [guestCount, setGuestCount] = useState(1);
  const [specialRequests, setSpecialRequests] = useState('');

  if (!isOpen || !service) return null;

  const calculatePrice = () => {
    let basePrice = service.price;

    // Adjust price based on meal type
    if (mealType === 'dinner') {
      basePrice += 30;
    } else if (mealType === 'lunch') {
      basePrice += 20;
    }

    // Adjust price based on guest count
    if (guestCount > 4) {
      basePrice += (guestCount - 4) * 10;
    }

    return basePrice;
  };

  const handleConfirm = () => {
    const options = {
      mealType,
      guestCount,
      specialRequests,
      calculatedPrice: calculatePrice(),
    };

    onConfirm(options);
    // Reset form
    setMealType('');
    setGuestCount(1);
    setSpecialRequests('');
  };

  // Service-specific options rendering
  const renderChefOptions = () => (
    <>
      <div className='mb-6'>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          {t('services.chef.mealType')}
        </label>
        <select
          value={mealType}
          onChange={(e) => setMealType(e.target.value)}
          className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
        >
          <option value=''>{t('common.select')}</option>
          <option value='breakfast'>{t('services.chef.breakfast')}</option>
          <option value='lunch'>{t('services.chef.lunch')}</option>
          <option value='dinner'>{t('services.chef.dinner')}</option>
        </select>
      </div>

      <div className='mb-6'>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          {t('services.chef.guestCount')}
        </label>
        <input
          type='number'
          min='1'
          max='20'
          value={guestCount}
          onChange={(e) => setGuestCount(Number(e.target.value))}
          className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
        />
      </div>

      <div className='mb-6'>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          {t('services.chef.specialRequests')}
        </label>
        <textarea
          value={specialRequests}
          onChange={(e) => setSpecialRequests(e.target.value)}
          rows={3}
          className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
          placeholder={t('services.chef.specialRequestsPlaceholder')}
        />
      </div>
    </>
  );

  // Generic options for other services
  const renderGenericOptions = () => (
    <div className='mb-6'>
      <label className='block text-sm font-medium text-gray-700 mb-2'>
        {t('services.generic.specialRequests')}
      </label>
      <textarea
        value={specialRequests}
        onChange={(e) => setSpecialRequests(e.target.value)}
        rows={3}
        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
        placeholder={t('services.generic.specialRequestsPlaceholder')}
      />
    </div>
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4'
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className='bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-hidden'
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className='flex items-center justify-between p-6 border-b'>
            <div className='flex items-center'>
              {service.id === 'private-chef' && (
                <ChefHat className='mr-2' size={24} />
              )}
              <h2 className='text-xl font-bold'>
                {t('services.configureService', { service: service.name })}
              </h2>
            </div>
            <button
              onClick={onClose}
              className='p-2 rounded-full hover:bg-gray-100'
            >
              <X size={24} className='text-gray-500' />
            </button>
          </div>

          {/* Content */}
          <div className='p-6'>
            {service.id === 'private-chef'
              ? renderChefOptions()
              : renderGenericOptions()}

            {/* Price Summary */}
            <div className='bg-blue-50 p-4 rounded-lg mb-6'>
              <div className='flex justify-between items-center'>
                <span className='text-gray-700 font-medium'>
                  {t('common.totalPrice')}:
                </span>
                <span className='text-xl font-bold text-blue-600'>
                  ${calculatePrice()}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className='flex justify-end space-x-3'>
              <button
                onClick={onClose}
                className='px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200'
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleConfirm}
                disabled={service.id === 'private-chef' && !mealType}
                className={`px-4 py-2 rounded-lg ${
                  service.id === 'private-chef' && !mealType
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {t('common.confirm')}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ServiceOptionsModal;
