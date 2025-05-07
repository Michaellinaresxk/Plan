'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart,
  X,
  ChevronRight,
  Trash2,
  Users,
  Calendar,
} from 'lucide-react';
import { useBooking } from '@/context/BookingContext';
import { useTranslation } from '@/lib/i18n/client';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation'; // Import Next.js router

const CartSidebar = () => {
  const router = useRouter(); // Initialize the router
  const [isOpen, setIsOpen] = useState(false);
  const {
    packageType,
    selectedServices,
    removeService,
    calculateTotalPrice,
    getServiceBooking,
    // Ensure cart visibility is managed through context
    cartVisible,
    setCartVisible,
  } = useBooking();
  const { t } = useTranslation();
  const [total, setTotal] = useState(0);

  // Use useEffect to calculate the total instead of doing it during rendering
  useEffect(() => {
    if (packageType && selectedServices.length > 0) {
      setTotal(calculateTotalPrice());
    }
  }, [packageType, selectedServices, calculateTotalPrice]);

  // Sync local isOpen state with context cartVisible
  useEffect(() => {
    setIsOpen(cartVisible);
  }, [cartVisible]);

  // If no package is selected or no services, don't show the cart
  if (!packageType || selectedServices.length === 0) {
    return null;
  }

  const toggleCart = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    setCartVisible(newState); // Update context state too
  };

  const handleRemoveService = (serviceId: string) => {
    removeService(serviceId);

    // If it was the last service, close the cart
    if (selectedServices.length === 1) {
      setIsOpen(false);
      setCartVisible(false);
    }
  };

  // Navigate to payment page - Improved method
  const navigateToPayment = () => {
    // Close the cart
    setIsOpen(false);
    setCartVisible(false);

    // Save only what you currently have available
    const bookingData = {
      packageType,
      selectedServices,
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem('booking', JSON.stringify(bookingData));
    }

    // Use Next.js router for client-side navigation
    setTimeout(() => {
      router.push('/payment');
    }, 300);
  };
  // Translate the package type for display
  const packageName = t(`services.title.${packageType}`, {
    fallback:
      packageType === 'standard' ? 'Punta Cana Plan' : 'Punta Cana Luxe',
  });

  return (
    <>
      {/* Floating cart button */}
      <motion.div
        className='fixed bottom-6 right-6 z-40'
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <button
          onClick={toggleCart}
          className={`
            relative flex items-center justify-center p-4 rounded-full shadow-lg
            ${
              packageType === 'standard'
                ? 'bg-blue-500 hover:bg-blue-600'
                : 'bg-amber-500 hover:bg-amber-600'
            }
            transition-colors duration-300
          `}
        >
          <ShoppingCart className='text-white' size={24} />

          {/* Service counter */}
          <div className='absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center'>
            {selectedServices.length}
          </div>
        </button>
      </motion.div>

      {/* Overlay when cart is open */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className='fixed inset-0 bg-black/40 z-40'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
          />
        )}
      </AnimatePresence>

      {/* Cart sidebar panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className='fixed top-0 bottom-0 right-0 w-full sm:w-96 bg-white shadow-xl z-50 flex flex-col'
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Cart header */}
            <div
              className={`
              p-4 flex items-center justify-between
              ${packageType === 'standard' ? 'bg-blue-500' : 'bg-amber-500'}
              text-white
            `}
            >
              <div className='flex items-center'>
                <ShoppingCart className='mr-2' size={20} />
                <h3 className='text-lg font-semibold'>
                  {t('cart.title', { fallback: 'Your Selection' })}
                </h3>
              </div>
              <button
                onClick={toggleCart}
                className='p-1 rounded-full hover:bg-white/20 transition-colors'
              >
                <X size={20} />
              </button>
            </div>

            {/* Cart content */}
            <div className='flex-1 overflow-y-auto p-4'>
              {/* Selected package */}
              <div className='mb-4 pb-4 border-b border-gray-200'>
                <h4 className='font-medium text-gray-700 mb-2'>
                  {t('cart.selectedPackage', { fallback: 'Selected Package' })}:
                </h4>
                <p className='text-gray-900 font-semibold'>{packageName}</p>
              </div>

              {/* Services list */}
              <div className='mb-4'>
                <h4 className='font-medium text-gray-700 mb-2'>
                  {t('cart.selectedServices', {
                    fallback: 'Selected Services',
                  })}
                  :
                </h4>

                <ul className='space-y-3'>
                  {selectedServices.map((service) => {
                    const serviceBooking = getServiceBooking(service.id);
                    const hasBookingDetails = serviceBooking !== undefined;

                    return (
                      <li
                        key={service.id}
                        className='bg-gray-50 p-3 rounded-lg'
                      >
                        <div className='flex items-center justify-between mb-1'>
                          <p className='font-medium text-gray-800'>
                            {service.name}
                          </p>
                          <button
                            onClick={() => handleRemoveService(service.id)}
                            className='p-2 text-gray-500 hover:text-red-500 transition-colors'
                            aria-label='Remove service'
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>

                        {/* Service details */}
                        <div className='text-gray-500 text-sm mb-2'>
                          <div className='flex items-center justify-between'>
                            <span>
                              ${service.price}
                              {hasBookingDetails &&
                                serviceBooking.guests > 1 && (
                                  <span> × {serviceBooking.guests} guests</span>
                                )}
                            </span>
                            <span>
                              {service.duration > 0 && (
                                <span>
                                  {service.duration}{' '}
                                  {service.duration === 1
                                    ? t('services.hours.one', {
                                        fallback: 'hour',
                                      })
                                    : t('services.hours.multiple', {
                                        fallback: 'hours',
                                      })}
                                </span>
                              )}
                            </span>
                          </div>
                        </div>

                        {/* Show booking details if available */}
                        {hasBookingDetails && (
                          <div className='mt-2 pt-2 border-t border-gray-200'>
                            <div className='flex items-center text-xs text-gray-600 mb-1'>
                              <Calendar size={14} className='mr-1' />
                              <span>
                                {format(serviceBooking.dates.startDate, 'PP')} -{' '}
                                {format(serviceBooking.dates.endDate, 'PP')}
                              </span>
                            </div>
                            <div className='flex items-center text-xs text-gray-600'>
                              <Users size={14} className='mr-1' />
                              <span>
                                {serviceBooking.guests}{' '}
                                {serviceBooking.guests === 1
                                  ? t('calendar.guest', { fallback: 'Guest' })
                                  : t('calendar.guests', {
                                      fallback: 'Guests',
                                    })}
                              </span>
                            </div>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            {/* Cart footer */}
            <div className='p-4 bg-gray-50 border-t border-gray-200'>
              {/* Total */}
              <div className='flex justify-between items-center mb-4'>
                <span className='text-gray-700 font-medium'>
                  {t('cart.total', { fallback: 'Total' })}:
                </span>
                <span className='text-xl font-bold text-gray-900'>
                  ${total.toFixed(2)}
                </span>
              </div>

              {/* Action buttons - ONLY TWO BUTTONS */}
              <div className='space-y-2'>
                {/* Button 1: Proceed to Checkout */}
                <button
                  onClick={navigateToPayment}
                  className={`
                    w-full py-3 px-4 rounded-lg font-semibold flex items-center justify-center
                    ${
                      packageType === 'standard'
                        ? 'bg-blue-500 hover:bg-blue-600 text-white'
                        : 'bg-amber-500 hover:bg-amber-600 text-white'
                    }
                    transition-colors duration-300
                  `}
                >
                  {t('cart.proceedToCheckout', {
                    fallback: 'Proceed to Checkout',
                  })}
                  <ChevronRight size={18} className='ml-1' />
                </button>

                {/* Button 2: Continue Shopping */}
                <button
                  onClick={toggleCart}
                  className='w-full py-3 px-4 rounded-lg font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors duration-300'
                >
                  {t('cart.continueShopping', {
                    fallback: 'Continue Shopping',
                  })}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CartSidebar;
