import React, { useState, useCallback, useMemo, useRef } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { Service } from '@/types/type';
import { ServiceData, ServiceExtendedDetails } from '@/types/services';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  ShoppingBag,
  Clock,
  Truck,
  Check,
  ShoppingCart,
  ArrowRight,
} from 'lucide-react';
import BookingModal from '@/UI/components/modal/BookingModal';
import {
  GROCERY_CATEGORIES,
  SPIRIT_CATEGORIES,
} from '@/constants/GroceryShopping';

import GroceryShoppingService from '../../grocery/GroceryShoppingService';

interface GroceryItem {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  translationKey?: string;
}

interface GroceryServiceViewProps {
  service: Service;
  serviceData?: ServiceData;
  extendedDetails?: ServiceExtendedDetails;
  primaryColor: string;
  viewContext?: 'standard-view' | 'premium-view';
}

const GroceryServiceView: React.FC<GroceryServiceViewProps> = ({ service }) => {
  const { t } = useTranslation();

  // State - UPDATED to store proper item structure
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<GroceryItem[]>([]);

  // Use ref to track last processed items to prevent duplicate processing
  const lastProcessedIds = useRef<string[]>([]);

  // Determine if this is a premium service
  const isPremium = service.packageType.includes('premium');

  const allCategories = useMemo(
    () => [...GROCERY_CATEGORIES, ...SPIRIT_CATEGORIES],
    []
  );

  const convertIdsToItems = useCallback(
    (itemIds: string[]): GroceryItem[] => {
      console.log('🛒 GroceryServiceView - Converting IDs to items:', itemIds);

      const groceryItems: GroceryItem[] = [];

      itemIds.forEach((itemId) => {
        // Find the item in all categories
        for (const category of allCategories) {
          const foundItem = category.items.find((item) => item.id === itemId);
          if (foundItem) {
            groceryItems.push({
              id: itemId,
              name: foundItem.translationKey
                ? t(foundItem.translationKey, { fallback: itemId })
                : itemId,
              category: category.id,
              subcategory: category.id, // You can enhance this based on your category structure
              translationKey: foundItem.translationKey,
            });
            break;
          }
        }
      });

      console.log(
        '🛒 GroceryServiceView - Converted to grocery items:',
        groceryItems
      );
      return groceryItems;
    },
    [allCategories, t]
  );

  const handleItemsSelected = useCallback(
    (itemIds: string[]) => {
      console.log('🛒 GroceryServiceView - Raw selected item IDs:', itemIds);

      // Check if IDs actually changed to prevent unnecessary processing
      const idsChanged =
        lastProcessedIds.current.length !== itemIds.length ||
        !lastProcessedIds.current.every((id, index) => id === itemIds[index]);

      if (idsChanged) {
        console.log('🛒 GroceryServiceView - IDs changed, processing...');

        // Update ref to track last processed IDs
        lastProcessedIds.current = itemIds;

        // Convert IDs to items and update state
        const groceryItems = convertIdsToItems(itemIds);
        setSelectedItems(groceryItems);
      } else {
        console.log(
          '🛒 GroceryServiceView - IDs unchanged, skipping processing'
        );
      }
    },
    [convertIdsToItems]
  );

  const handleOpenBookingModal = useCallback(() => {
    console.log(
      '🛒 GroceryServiceView - Opening modal with items:',
      selectedItems
    );

    if (selectedItems.length === 0) {
      console.warn(
        '⚠️ GroceryServiceView - No items selected, cannot open modal'
      );
      return;
    }

    setIsModalOpen(true);
  }, [selectedItems]);

  const handleCloseModal = useCallback(() => {
    console.log('🛒 GroceryServiceView - Closing modal');
    setIsModalOpen(false);
  }, []);

  const estimatedTotal = useMemo(() => {
    const basePrice = service.price;
    const estimatedItemCost = selectedItems.length * 5; // $5 per item estimate
    return basePrice + estimatedItemCost;
  }, [service.price, selectedItems.length]);

  return (
    <div className='space-y-12'>
      {/* Hero Section with Tagline */}
      <motion.div
        className={`relative overflow-hidden w-full my-6 sm:my-8 lg:my-12 ${
          isPremium
            ? 'bg-gradient-to-r from-amber-900/30 to-amber-700/40'
            : 'bg-gradient-to-r from-blue-900/30 to-blue-700/40'
        }`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className='absolute inset-0'>
          <Image
            src='https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80'
            alt='Fresh groceries'
            fill
            className='object-cover opacity-70'
          />
        </div>

        {/* Overlay adicional para mejor contraste */}
        <div className='absolute inset-0 bg-black/40 z-[1]' />
        <div className='absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 z-[2]' />

        <div className='relative z-10 px-4 sm:px-6 lg:px-8 xl:px-10 py-8 sm:py-12 lg:py-16 xl:py-20 text-white'>
          <div className='max-w-6xl mx-auto space-y-6 sm:space-y-8 lg:space-y-10'>
            <h1 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight max-w-4xl'>
              {isPremium
                ? 'Premium Grocery Delivery & Stocking Service'
                : 'Fresh Groceries Delivered to Your Door'}
            </h1>

            <h2 className='text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl opacity-90 max-w-3xl font-light leading-relaxed'>
              {isPremium
                ? 'Your personalized grocery concierge service with premium selection and white-glove stocking'
                : 'We shop for the freshest local ingredients and deliver them right to your vacation rental'}
            </h2>

            {/* Features - Responsive */}
            <div className='flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 lg:gap-6 text-sm sm:text-base max-w-4xl'>
              <div className='flex items-center bg-white/10 backdrop-blur-sm px-3 py-2 sm:px-4 sm:py-2 rounded-lg border border-white/20'>
                <Clock className='h-4 h-4 sm:h-5 sm:w-5 mr-2 opacity-80 flex-shrink-0' />
                <span className='whitespace-nowrap'>
                  {isPremium
                    ? 'Same-day delivery available'
                    : 'Delivery within 24-48 hours'}
                </span>
              </div>
              <div className='flex items-center bg-white/10 backdrop-blur-sm px-3 py-2 sm:px-4 sm:py-2 rounded-lg border border-white/20'>
                <Truck className='h-4 h-4 sm:h-5 sm:w-5 mr-2 opacity-80 flex-shrink-0' />
                <span className='whitespace-nowrap'>
                  Island-wide delivery service
                </span>
              </div>
              <div className='flex items-center bg-white/10 backdrop-blur-sm px-3 py-2 sm:px-4 sm:py-2 rounded-lg border border-white/20'>
                <ShoppingBag className='h-4 h-4 sm:h-5 sm:w-5 mr-2 opacity-80 flex-shrink-0' />
                <span className='whitespace-nowrap'>
                  Local & imported products
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <div className='pt-4 sm:pt-6 lg:pt-8'>
              <button
                onClick={() => {
                  document
                    .getElementById('grocery-selection')
                    ?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`flex items-center px-6 py-3 sm:px-8 sm:py-4 lg:px-10 lg:py-5 ${
                  isPremium
                    ? 'bg-amber-500 hover:bg-amber-600 text-amber-900'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                } rounded-full font-bold text-base sm:text-lg shadow-lg transform transition-all duration-300 hover:scale-105`}
              >
                <span>Shop Now</span>
                <ShoppingCart className='ml-2 h-4 h-4 sm:h-5 sm:w-5' />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <div id='grocery-selection'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <GroceryShoppingService
            onItemsSelected={handleItemsSelected}
            handleOpenBookingModal={handleOpenBookingModal}
            service={service}
          />
        </motion.div>
      </div>

      {/* Selected Items Summary - NEW SECTION */}
      {selectedItems.length > 0 && (
        <motion.div
          className={`rounded-2xl overflow-hidden ${
            isPremium
              ? 'bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200'
              : 'bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200'
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className='p-8 text-center'>
            <h2
              className={`text-2xl font-bold mb-4 ${
                isPremium ? 'text-amber-900' : 'text-blue-900'
              }`}
            >
              Ready to Complete Your Order?
            </h2>
            <p
              className={`text-lg mb-6 ${
                isPremium ? 'text-amber-800' : 'text-blue-800'
              }`}
            >
              You have selected {selectedItems.length} items for delivery
            </p>

            <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
              <div
                className={`px-4 py-2 rounded-lg ${
                  isPremium
                    ? 'bg-amber-200 text-amber-900'
                    : 'bg-blue-200 text-blue-900'
                }`}
              >
                <span className='font-medium'>
                  Estimated Total: ${estimatedTotal.toFixed(2)}
                </span>
              </div>

              <button
                onClick={handleOpenBookingModal}
                className={`flex items-center px-6 py-3 ${
                  isPremium
                    ? 'bg-amber-600 hover:bg-amber-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                } rounded-lg font-medium shadow-lg transition-all duration-300`}
              >
                Book Your Delivery
                <ArrowRight className='ml-2 h-5 w-5' />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Disclaimer */}
      <motion.div
        className='bg-gray-50 rounded-lg p-4 flex items-start'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <Check className='h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0' />
        <p className='text-sm text-gray-600'>
          All prices are in USD. Minimum order value of $50 applies to all
          grocery deliveries.
          {isPremium
            ? ' Premium membership includes benefits such as reduced fees, priority scheduling, and white-glove stocking service.'
            : ' Delivery fees may apply based on location and time of delivery.'}
        </p>
      </motion.div>

      {/* Booking Modal - UPDATED with selectedItems */}
      <AnimatePresence>
        {isModalOpen && (
          <BookingModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            service={service}
            selectedItems={selectedItems} // FIXED: Now passes the selected items
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default GroceryServiceView;
