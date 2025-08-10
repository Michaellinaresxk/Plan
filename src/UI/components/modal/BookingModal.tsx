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
  additionalData?: any;
}

const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  service,
  selectedItems,
  additionalData,
}) => {
  const { t } = useTranslation();

  // Debug logs
  console.log('🏨 BookingModal rendered for service:', service.id);
  console.log('🏨 BookingModal selectedItems:', selectedItems);
  console.log('🏨 BookingModal additionalData:', additionalData);

  // ✅ TÍTULO UNIFICADO PARA TODOS LOS SERVICIOS
  const getModalTitle = () => {
    return t('bookingModal.title', {
      service: service.name,
      fallback: `Book ${service.name}`,
    });
  };

  return (
    <LuxuryModal isOpen={isOpen} onClose={onClose} title={getModalTitle()}>
      <div className='py-2'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <ServiceFormFactory
            service={service}
            selectedItems={selectedItems}
            additionalData={additionalData}
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
