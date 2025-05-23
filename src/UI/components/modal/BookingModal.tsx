// UI/components/shared/BookingModal.tsx - REPLACE COMPLETELY
import React from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { Service } from '@/types/type';
import { motion } from 'framer-motion';
import LuxuryModal from './LuxuryModal';
import ServiceFormFactory from '../forms/ServiceFormFactory';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service;
  // REMOVED: onConfirm prop - no longer needed
}

/**
 * UPDATED BookingModal - New Reservation Flow
 *
 * This modal now uses ServiceFormFactory which handles navigation
 * to the reservation-confirmation page automatically.
 */
const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  service,
}) => {
  const { t } = useTranslation();

  // Debug log
  console.log('🏨 BookingModal rendered for service:', service.id);

  // Check if service is premium
  const isPremium = service.packageType.includes('premium');

  // Format the title
  const title = isPremium
    ? t('bookingModal.premiumTitle', {
        service: service.name,
        fallback: `Premium ${service.name}`,
      })
    : t('bookingModal.title', {
        service: service.name,
        fallback: `Book ${service.name}`,
      });

  return (
    <LuxuryModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      isPremium={isPremium}
    >
      <div className='py-2'>
        {/* Service Description */}
        <motion.div
          className={`mb-6 p-4 rounded-lg ${
            isPremium
              ? 'bg-amber-50 border border-amber-200'
              : 'bg-blue-50 border border-blue-200'
          }`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p
            className={`text-sm leading-relaxed mb-3 ${
              isPremium ? 'text-amber-800' : 'text-blue-800'
            }`}
          >
            {service.description ||
              t('bookingModal.defaultDescription', {
                service: service.name,
                fallback: `Complete the form below to book your ${service.name} experience.`,
              })}
          </p>

          <div className='flex items-center justify-between'>
            <span
              className={`text-sm font-medium ${
                isPremium ? 'text-amber-700' : 'text-blue-700'
              }`}
            >
              Starting from:
            </span>
            <span
              className={`text-lg font-bold ${
                isPremium ? 'text-amber-900' : 'text-blue-900'
              }`}
            >
              ${service.price.toFixed(2)}
            </span>
          </div>
        </motion.div>

        {/* The Service Form - This handles navigation automatically */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <ServiceFormFactory
            service={service}
            onCancel={() => {
              console.log('🔄 BookingModal - onCancel called, closing modal');
              onClose();
            }}
          />
        </motion.div>
      </div>
    </LuxuryModal>
  );
};

export default BookingModal;
