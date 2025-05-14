import React from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { Service, BookingDate } from '@/types/type';
import { motion } from 'framer-motion';
import LuxuryModal from './LuxuryModal';
import ServiceFormFactory from '../forms/ServiceFormFactory';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (
    service: Service,
    dates: BookingDate,
    guests: number,
    formData?: Record<string, any>
  ) => void;
  service: Service;
}

const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  service,
}) => {
  const { t } = useTranslation();

  // Check if service is premium
  const isPremium = service.packageType.includes('premium');

  // Format the title with a more luxurious feel
  const title = isPremium
    ? t('bookingModal.premiumTitle', {
        service: t(`services.premium.${service.id.replace('luxe-', '')}.name`, {
          fallback: service.name,
        }),
      })
    : t('bookingModal.title', {
        service: t(`services.standard.${service.id}.name`, {
          fallback: service.name,
        }),
      });

  return (
    <LuxuryModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      isPremium={isPremium}
    >
      <div className='py-2'>
        {/* Brief service description */}
        <motion.p
          className={`mb-6 ${isPremium ? 'text-gray-300' : 'text-gray-600'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {isPremium
            ? t('bookingModal.premiumDescription', { service: service.name })
            : t('bookingModal.description', { service: service.name })}
        </motion.p>

        {/* Render the appropriate form through the factory */}
        <ServiceFormFactory
          service={service}
          onBookService={onConfirm}
          onClose={onClose}
        />
      </div>
    </LuxuryModal>
  );
};

export default BookingModal;
