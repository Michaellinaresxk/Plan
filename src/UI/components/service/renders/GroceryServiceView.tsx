import React, { useState } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { BookingDate, Service } from '@/types/type';
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
import { useBooking } from '@/context/BookingContext';

import GroceryShoppingService from '../../grocery/GroceryShoppingService';

// Interface for grocery items
interface GroceryItem {
  id: string;
  name: string;
  price: number;
  unit: string;
  quantity?: number;
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
  const { bookService } = useBooking();

  // State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<GroceryItem[]>([]);
  const [formData, setFormData] = useState({
    date: '',
    hour: '',
    foodRestrictions: '',
    hasAllergies: false,
    specialRequests: '',
  });

  // Determine if this is a premium service
  const isPremium = service.packageType.includes('premium');

  // Handle selected items from the grocery selector
  const handleItemsSelected = (items: GroceryItem[]) => {
    setSelectedItems(items);
  };
  const handleOpenBookingModal = () => {
    setIsModalOpen(true);
  };

  // Handle booking confirmation
  const handleBookingConfirm = (
    service: Service,
    dates: BookingDate,
    guests: number
  ) => {
    // Add the selected grocery items as additional data
    const bookingData = {
      groceryItems: selectedItems,
      totalPrice: calculateTotal(selectedItems),
    };

    // Book the service with the grocery items data
    bookService(service, dates, guests, bookingData);

    // Close the modal
    setIsModalOpen(false);

    // Navigate to payment page
    // In a real application, you might use router.push('/payment') or similar
  };
  // Calculate total price based on selected items
  const calculateTotal = (): number => {
    const itemsTotal = selectedItems.reduce((total, item) => {
      return total + item.price * (item.quantity || 1);
    }, 0);

    return service.price + itemsTotal;
  };

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

          {/* CTA Button - opens the book now form */}
          <div className='mt-8'>
            <button
              onClick={() => {
                // Scroll to the grocery selection section
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

      {/* Grocery Selection Section */}
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
        transition={{ duration: 0.6, delay: 0.4 }}
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
        transition={{ duration: 0.6, delay: 0.5 }}
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

      {/* Booking Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <BookingModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConfirm={handleBookingConfirm}
            service={service}
            additionalData={{
              groceryItems: selectedItems,
              formData: formData,
              totalPrice: calculateTotal(),
              serviceType: 'grocery',
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default GroceryServiceView;
