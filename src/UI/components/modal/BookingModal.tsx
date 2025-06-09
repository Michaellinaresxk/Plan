// UI/components/shared/BookingModal.tsx - UPDATED VERSION
import React from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { Service } from '@/types/type';
import { motion } from 'framer-motion';
import LuxuryModal from './LuxuryModal';
import ServiceFormFactory from '../forms/ServiceFormFactory';

interface GroceryItem {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  translationKey?: string;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service;
  selectedItems?: GroceryItem[]; // For grocery shopping
  additionalData?: any; // For other service-specific data
}

/**
 * UPDATED BookingModal - Enhanced Reservation Flow
 *
 * This modal now properly handles selected items (for grocery shopping)
 * and additional data for different service types.
 */
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

  // Check if service is premium
  const isPremium = service.packageType.includes('premium');

  // Format the title based on service type and premium status
  const getModalTitle = () => {
    if (service.id === 'grocery-shopping' || service.id === 'luxe-grocery') {
      const itemCount = selectedItems?.length || 0;
      return isPremium
        ? t('bookingModal.premiumGroceryTitle', {
            count: itemCount,
            fallback: `Premium Grocery Delivery (${itemCount} items)`,
          })
        : t('bookingModal.groceryTitle', {
            count: itemCount,
            fallback: `Grocery Shopping Service (${itemCount} items)`,
          });
    }

    return isPremium
      ? t('bookingModal.premiumTitle', {
          service: service.name,
          fallback: `Premium ${service.name}`,
        })
      : t('bookingModal.title', {
          service: service.name,
          fallback: `Book ${service.name}`,
        });
  };

  // Get service description with item count for grocery
  const getServiceDescription = () => {
    if (service.id === 'grocery-shopping' || service.id === 'luxe-grocery') {
      const itemCount = selectedItems?.length || 0;
      if (itemCount > 0) {
        return t('bookingModal.groceryDescription', {
          count: itemCount,
          fallback: `Complete your grocery delivery reservation with ${itemCount} selected items.`,
        });
      } else {
        return t('bookingModal.groceryNoItems', {
          fallback:
            'Please select items from the grocery list before proceeding.',
        });
      }
    }

    return (
      service.description ||
      t('bookingModal.defaultDescription', {
        service: service.name,
        fallback: `Complete the form below to book your ${service.name} experience.`,
      })
    );
  };

  return (
    <LuxuryModal
      isOpen={isOpen}
      onClose={onClose}
      title={getModalTitle()}
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
            {getServiceDescription()}
          </p>

          {/* Additional info for grocery shopping */}
          {(service.id === 'grocery-shopping' ||
            service.id === 'luxe-grocery') &&
            selectedItems && (
              <div className='mt-3 pt-3 border-t border-current/20'>
                <div className='flex items-center justify-between text-xs'>
                  <span
                    className={isPremium ? 'text-amber-700' : 'text-blue-700'}
                  >
                    {t('bookingModal.selectedItems', {
                      fallback: 'Selected items',
                    })}
                    :
                  </span>
                  <span
                    className={`font-medium ${
                      isPremium ? 'text-amber-800' : 'text-blue-800'
                    }`}
                  >
                    {selectedItems.length}
                  </span>
                </div>
                <p
                  className={`text-xs mt-1 ${
                    isPremium ? 'text-amber-600' : 'text-blue-600'
                  }`}
                >
                  {t('bookingModal.finalPriceNote', {
                    fallback:
                      'Final price will include groceries + delivery fee',
                  })}
                </p>
              </div>
            )}
        </motion.div>

        {/* The Service Form - This handles navigation automatically */}
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
