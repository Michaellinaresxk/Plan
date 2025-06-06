// views/GroceryServiceView.tsx - FINAL FIXED VERSION
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

// Interface for grocery items - UPDATED to match our schema
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

const GroceryServiceView: React.FC<GroceryServiceViewProps> = ({
  service,
  serviceData,
  extendedDetails,
  primaryColor,
  viewContext,
}) => {
  const { t } = useTranslation();

  // State - UPDATED to store proper item structure
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<GroceryItem[]>([]);

  // Use ref to track last processed items to prevent duplicate processing
  const lastProcessedIds = useRef<string[]>([]);

  // Determine if this is a premium service
  const isPremium = service.packageType.includes('premium');

  // FIXED: Memoize all categories to prevent recreation
  const allCategories = useMemo(
    () => [...GROCERY_CATEGORIES, ...SPIRIT_CATEGORIES],
    []
  );

  // FIXED: Convert item IDs to proper GroceryItem objects - wrapped in useCallback
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

  // FIXED: Handle selected items from the grocery selector without causing setState during render
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

  // FIXED: Wrap modal handlers in useCallback
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

  // FIXED: Memoize the total calculation
  const estimatedTotal = useMemo(() => {
    const basePrice = service.price;
    const estimatedItemCost = selectedItems.length * 5; // $5 per item estimate
    return basePrice + estimatedItemCost;
  }, [service.price, selectedItems.length]);

  return (
    <div className='space-y-12'>
      {/* Hero Section with Tagline */}
      <motion.div
        className={`relative overflow-hidden rounded-2xl ${
          isPremium
            ? 'bg-gradient-to-r from-amber-900/90 to-amber-700/80'
            : 'bg-gradient-to-r from-blue-900/90 to-blue-700/80'
        }`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className='absolute inset-0 -z-10'>
          <Image
            src='https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80'
            alt='Fresh groceries'
            fill
            className='object-cover opacity-30'
          />
        </div>

        <div className='p-10 md:p-16 text-white'>
          <h1 className='text-3xl md:text-5xl font-bold mb-4 leading-tight'>
            {isPremium
              ? 'Premium Grocery Delivery & Stocking Service'
              : 'Fresh Groceries Delivered to Your Door'}
          </h1>
          <h2 className='text-xl md:text-2xl opacity-90 mb-8 max-w-3xl font-light'>
            {isPremium
              ? 'Your personalized grocery concierge service with premium selection and white-glove stocking'
              : 'We shop for the freshest local ingredients and deliver them right to your vacation rental'}
          </h2>

          <div className='flex flex-wrap items-center gap-6 text-sm'>
            <div className='flex items-center'>
              <Clock className='h-5 w-5 mr-2 opacity-80' />
              <span>
                {isPremium
                  ? 'Same-day delivery available'
                  : 'Delivery within 24-48 hours'}
              </span>
            </div>
            <div className='flex items-center'>
              <Truck className='h-5 w-5 mr-2 opacity-80' />
              <span>Island-wide delivery service</span>
            </div>
            <div className='flex items-center'>
              <ShoppingBag className='h-5 w-5 mr-2 opacity-80' />
              <span>Local & imported products</span>
            </div>
          </div>

          {/* CTA Button - opens the grocery selection */}
          <div className='mt-8'>
            <button
              onClick={() => {
                document
                  .getElementById('grocery-selection')
                  ?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`flex items-center px-8 py-4 ${
                isPremium
                  ? 'bg-amber-500 hover:bg-amber-600 text-amber-900'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              } rounded-full font-bold shadow-lg transform transition-all duration-300 hover:scale-105`}
            >
              Shop Now
              <ShoppingCart className='ml-2 h-5 w-5' />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Grocery Selection Section - UPDATED */}
      <div id='grocery-selection'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <GroceryShoppingService
            onItemsSelected={handleItemsSelected} // FIXED: Now passes proper function
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

      {/* How It Works Section */}
      <motion.div
        className='bg-white rounded-2xl shadow-lg overflow-hidden'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className='p-8'>
          <h2 className='text-2xl font-bold text-gray-900 mb-6'>
            How Our Grocery Service Works
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div className='text-center'>
              <div className='flex items-center justify-center mb-4'>
                <div
                  className={`h-12 w-12 rounded-full ${
                    isPremium ? 'bg-amber-100' : 'bg-blue-100'
                  } flex items-center justify-center text-lg font-bold ${
                    isPremium ? 'text-amber-700' : 'text-blue-700'
                  }`}
                >
                  1
                </div>
              </div>
              <h3 className='text-lg font-bold text-gray-800 mb-2'>
                Select Your Items
              </h3>
              <p className='text-gray-600'>
                Browse our extensive selection and choose your favorite
                groceries
              </p>
            </div>

            <div className='text-center'>
              <div className='flex items-center justify-center mb-4'>
                <div
                  className={`h-12 w-12 rounded-full ${
                    isPremium ? 'bg-amber-100' : 'bg-blue-100'
                  } flex items-center justify-center text-lg font-bold ${
                    isPremium ? 'text-amber-700' : 'text-blue-700'
                  }`}
                >
                  2
                </div>
              </div>
              <h3 className='text-lg font-bold text-gray-800 mb-2'>
                Schedule Delivery
              </h3>
              <p className='text-gray-600'>
                Choose your preferred delivery date and time slot
              </p>
            </div>

            <div className='text-center'>
              <div className='flex items-center justify-center mb-4'>
                <div
                  className={`h-12 w-12 rounded-full ${
                    isPremium ? 'bg-amber-100' : 'bg-blue-100'
                  } flex items-center justify-center text-lg font-bold ${
                    isPremium ? 'text-amber-700' : 'text-blue-700'
                  }`}
                >
                  3
                </div>
              </div>
              <h3 className='text-lg font-bold text-gray-800 mb-2'>
                Enjoy Fresh Groceries
              </h3>
              <p className='text-gray-600'>
                We deliver directly to your accommodation with care and
                punctuality
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Final CTA Section */}
      <motion.div
        className={`rounded-2xl overflow-hidden ${
          isPremium
            ? 'bg-gradient-to-r from-amber-600 to-amber-800'
            : 'bg-gradient-to-r from-blue-600 to-blue-800'
        }`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <div className='p-10 md:p-16 text-white text-center'>
          <h2 className='text-3xl md:text-4xl font-bold mb-4'>
            Ready to Stock Your Villa?
          </h2>
          <p className='text-xl opacity-90 mb-8 max-w-2xl mx-auto'>
            {isPremium
              ? 'Experience our premium grocery service with personalized shopping and delivery'
              : 'Skip the grocery store and let us handle your shopping needs during your stay'}
          </p>
          <button
            onClick={() => {
              document
                .getElementById('grocery-selection')
                ?.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`py-3 px-8 rounded-full bg-white flex items-center mx-auto font-medium ${
              isPremium ? 'text-amber-700' : 'text-blue-700'
            }`}
          >
            Start Shopping
            <ArrowRight className='ml-2 h-5 w-5' />
          </button>
        </div>
      </motion.div>

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
