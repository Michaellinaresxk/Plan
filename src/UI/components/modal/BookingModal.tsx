'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Users, Check, ArrowLeft, ArrowRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { format, differenceInDays } from 'date-fns';
import { useTranslation } from '@/lib/i18n/client';
import { Service, BookingDate } from '@/types/type';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (service: Service, dates: BookingDate, guests: number) => void;
  service: Service | null;
}

const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  service,
}) => {
  const { t } = useTranslation();
  const [dateRange, setDateRange] = useState<
    { from: Date; to: Date } | undefined
  >(undefined);
  const [guests, setGuests] = useState<number>(1);
  const [step, setStep] = useState<'dates' | 'guests'>('dates');

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setDateRange(undefined);
      setGuests(1);
      setStep('dates');
    }
  }, [isOpen]);

  // Ensure we can only book dates in the future
  const disabledDays = { before: new Date() };

  const handleRangeSelect = (range: { from: Date; to: Date } | undefined) => {
    if (range?.from && range?.to) {
      setDateRange(range);
    }
  };

  const handleGuestsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGuests(Number(e.target.value));
  };

  const handleContinueToGuests = () => {
    if (dateRange?.from && dateRange?.to) {
      setStep('guests');
    }
  };

  const handleBack = () => {
    setStep('dates');
  };

  const handleConfirm = () => {
    if (service && dateRange?.from && dateRange?.to) {
      onConfirm(
        service,
        {
          startDate: dateRange.from,
          endDate: dateRange.to,
        },
        guests
      );
    }
  };

  const calculateTotalPrice = () => {
    if (!service) return 0;

    // Calculate number of days if the service is duration-based
    const days =
      dateRange?.from && dateRange?.to
        ? differenceInDays(dateRange.to, dateRange.from) + 1
        : 1;

    // Multiply by days only if service is day-based (e.g., rentals)
    const isDayBased = [
      'golf-cart-rentals',
      'bike-rentals',
      'luxe-golf-cart',
      'luxe-e-bikes',
    ].includes(service.id);

    return service.price * guests * (isDayBased ? days : 1);
  };

  // Get container classes based on service type for theming
  const getContainerClasses = () => {
    if (!service) return '';
    const isPremium = service.packageType.includes('premium');
    return isPremium ? 'premium-theme' : 'standard-theme';
  };

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: 'spring', damping: 25, stiffness: 500 },
    },
    exit: {
      opacity: 0,
      y: 20,
      scale: 0.98,
      transition: { duration: 0.2 },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
  };

  if (!service) return null;

  const isPremium = service.packageType.includes('premium');
  const primaryColor = isPremium ? 'amber' : 'blue';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className='fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4 md:p-6'>
          {/* Backdrop with improved animation */}
          <motion.div
            variants={backdropVariants}
            initial='hidden'
            animate='visible'
            exit='exit'
            className='fixed inset-0 bg-black/60 backdrop-blur-sm'
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            variants={modalVariants}
            initial='hidden'
            animate='visible'
            exit='exit'
            className={`relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto overflow-hidden ${getContainerClasses()}`}
          >
            {/* Close button - now floating in corner for cleaner look */}
            <button
              onClick={onClose}
              className='absolute right-4 top-4 z-10 p-1.5 rounded-full bg-white/80 hover:bg-white shadow-md text-gray-700 hover:text-gray-900 transition-all duration-200'
              aria-label='Close modal'
            >
              <X size={18} />
            </button>

            {/* Header with service info and gradient background */}
            <div
              className={`relative px-6 py-8 ${
                isPremium
                  ? 'bg-gradient-to-r from-amber-500 to-amber-400'
                  : 'bg-gradient-to-r from-blue-600 to-blue-500'
              } text-white`}
            >
              <h3 className='text-2xl font-bold mb-2'>{service.name}</h3>
              <div className='flex items-center space-x-3'>
                <div className='font-semibold text-white/90 flex items-center'>
                  <span className='text-lg'>${service.price}</span>
                  <span className='text-white/80 text-sm ml-1'>
                    {service.duration > 0
                      ? `/ ${service.duration} ${
                          service.duration === 1
                            ? t('services.hours.one', { fallback: 'hour' })
                            : t('services.hours.multiple', {
                                fallback: 'hours',
                              })
                        }`
                      : ''}
                  </span>
                </div>
              </div>

              {/* Step indicators - now cleaner and more visual */}
              <div className='absolute bottom-0 left-0 right-0 h-1 bg-white/20'>
                <div
                  className={`h-full ${step === 'dates' ? 'w-1/2' : 'w-full'} ${
                    isPremium ? 'bg-amber-300' : 'bg-blue-300'
                  } transition-all duration-500`}
                />
              </div>
            </div>

            {/* Steps navigation */}
            <div className='flex border-b'>
              <button
                className={`flex-1 text-sm font-medium py-3 px-4 flex justify-center items-center relative ${
                  step === 'dates'
                    ? isPremium
                      ? 'text-amber-600 border-b-2 border-amber-500'
                      : 'text-blue-600 border-b-2 border-blue-500'
                    : 'text-gray-500'
                }`}
              >
                <Calendar size={16} className='mr-1.5' />
                <span>1. {t('modal.dates', { fallback: 'Select Dates' })}</span>
              </button>
              <button
                className={`flex-1 text-sm font-medium py-3 px-4 flex justify-center items-center relative ${
                  step === 'guests'
                    ? isPremium
                      ? 'text-amber-600 border-b-2 border-amber-500'
                      : 'text-blue-600 border-b-2 border-blue-500'
                    : 'text-gray-500'
                }`}
                onClick={handleContinueToGuests}
                disabled={!dateRange?.from || !dateRange?.to}
              >
                <Users size={16} className='mr-1.5' />
                <span>
                  2. {t('modal.guests', { fallback: 'Guests & Confirm' })}
                </span>
              </button>
            </div>

            {/* Content area with animation between steps */}
            <div className='p-6 overflow-hidden'>
              <AnimatePresence mode='wait'>
                {step === 'dates' ? (
                  <motion.div
                    key='dates-step'
                    variants={contentVariants}
                    initial='hidden'
                    animate='visible'
                    exit='exit'
                  >
                    <div className='mb-6'>
                      <h4 className='text-base font-medium text-gray-800 mb-3'>
                        {t('modal.selectDates', {
                          fallback: 'When would you like to book this service?',
                        })}
                      </h4>

                      <div
                        className={`border rounded-xl overflow-hidden shadow-sm ${
                          isPremium ? 'border-amber-200' : 'border-blue-200'
                        }`}
                      >
                        <DayPicker
                          mode='range'
                          selected={dateRange}
                          onSelect={handleRangeSelect}
                          disabled={disabledDays}
                          numberOfMonths={1}
                          className='rdp-custom p-2'
                          styles={{
                            day_selected: {
                              backgroundColor: isPremium
                                ? '#f59e0b'
                                : '#3b82f6',
                              color: 'black',
                            },
                            day_today: {
                              color: isPremium ? '#f59e0b' : '#3b82f6',
                              fontWeight: 'bold',
                            },
                          }}
                        />
                      </div>
                    </div>

                    {dateRange?.from && dateRange?.to && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-lg mb-6 ${
                          isPremium
                            ? 'bg-amber-50 border border-amber-100'
                            : 'bg-blue-50 border border-blue-100'
                        }`}
                      >
                        <p className='text-sm font-medium mb-1'>
                          {t('modal.selectedDates', {
                            fallback: 'Your selected dates:',
                          })}
                        </p>
                        <p className='text-sm flex items-center'>
                          <Calendar
                            size={15}
                            className={`mr-1.5 ${
                              isPremium ? 'text-amber-500' : 'text-blue-500'
                            }`}
                          />
                          <span>
                            {format(dateRange.from, 'PPP')} —{' '}
                            {format(dateRange.to, 'PPP')}
                          </span>
                        </p>
                        <p className='text-xs text-gray-500 mt-1'>
                          {differenceInDays(dateRange.to, dateRange.from) + 1}{' '}
                          {differenceInDays(dateRange.to, dateRange.from) +
                            1 ===
                          1
                            ? t('calendar.day', { fallback: 'day' })
                            : t('calendar.days', { fallback: 'days' })}
                        </p>
                      </motion.div>
                    )}

                    <button
                      onClick={handleContinueToGuests}
                      disabled={!dateRange?.from || !dateRange?.to}
                      className={`
                        w-full py-3 px-4 rounded-lg font-medium flex justify-center items-center
                        transition-colors duration-200 transform active:scale-[0.98]
                        ${
                          dateRange?.from && dateRange?.to
                            ? isPremium
                              ? 'bg-amber-500 hover:bg-amber-600 text-white'
                              : 'bg-blue-500 hover:bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }
                      `}
                    >
                      {t('modal.continue', { fallback: 'Continue' })}
                      <ArrowRight size={16} className='ml-1.5' />
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key='guests-step'
                    variants={contentVariants}
                    initial='hidden'
                    animate='visible'
                    exit='exit'
                  >
                    <div className='mb-6'>
                      <h4 className='text-base font-medium text-gray-800 mb-3'>
                        {t('modal.guestsQuestion', {
                          fallback: 'How many guests?',
                        })}
                      </h4>

                      <div className='relative'>
                        <select
                          value={guests}
                          onChange={handleGuestsChange}
                          className={`
                            w-full p-3 pr-10 appearance-none border rounded-lg focus:outline-none focus:ring-2
                            ${
                              isPremium
                                ? 'focus:ring-amber-500 focus:border-amber-500'
                                : 'focus:ring-blue-500 focus:border-blue-500'
                            }
                          `}
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                            <option key={num} value={num}>
                              {num}{' '}
                              {num === 1
                                ? t('calendar.guest', { fallback: 'Guest' })
                                : t('calendar.guests', { fallback: 'Guests' })}
                            </option>
                          ))}
                        </select>
                        <div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
                          <Users size={18} className='text-gray-400' />
                        </div>
                      </div>
                    </div>

                    <div
                      className={`p-4 rounded-lg mb-6 ${
                        isPremium ? 'bg-amber-50' : 'bg-blue-50'
                      }`}
                    >
                      <h4
                        className={`font-medium ${
                          isPremium ? 'text-amber-800' : 'text-blue-800'
                        } mb-3`}
                      >
                        {t('modal.summary', { fallback: 'Booking Summary' })}
                      </h4>

                      <div className='space-y-3'>
                        <div className='flex justify-between text-sm'>
                          <span className='text-gray-600'>
                            {t('modal.service', { fallback: 'Service' })}:
                          </span>
                          <span className='font-medium text-gray-900'>
                            {service.name}
                          </span>
                        </div>

                        <div className='flex justify-between text-sm'>
                          <span className='text-gray-600'>
                            {t('modal.dates', { fallback: 'Dates' })}:
                          </span>
                          <span className='font-medium text-gray-900'>
                            {dateRange?.from &&
                              dateRange?.to &&
                              `${format(dateRange.from, 'MMM d')} - ${format(
                                dateRange.to,
                                'MMM d, yyyy'
                              )}`}
                          </span>
                        </div>

                        <div className='flex justify-between text-sm'>
                          <span className='text-gray-600'>
                            {t('modal.guests', { fallback: 'Guests' })}:
                          </span>
                          <span className='font-medium text-gray-900'>
                            {guests}
                          </span>
                        </div>

                        <div className='pt-3 border-t'>
                          <div className='flex justify-between items-center'>
                            <span className='font-medium text-gray-900'>
                              {t('modal.total', { fallback: 'Total' })}:
                            </span>
                            <span
                              className={`text-lg font-bold ${
                                isPremium ? 'text-amber-600' : 'text-blue-600'
                              }`}
                            >
                              ${calculateTotalPrice()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className='flex space-x-3'>
                      <button
                        onClick={handleBack}
                        className='flex-1 py-3 px-4 rounded-lg font-medium border hover:bg-gray-50 transition-colors flex justify-center items-center'
                      >
                        <ArrowLeft size={16} className='mr-1.5' />
                        {t('modal.back', { fallback: 'Back' })}
                      </button>

                      <button
                        onClick={handleConfirm}
                        className={`
                          flex-1 py-3 px-4 rounded-lg font-medium text-white 
                          flex justify-center items-center transition-colors
                          transform active:scale-[0.98]
                          ${
                            isPremium
                              ? 'bg-amber-500 hover:bg-amber-600'
                              : 'bg-blue-500 hover:bg-blue-600'
                          }
                        `}
                      >
                        <Check size={16} className='mr-1.5' />
                        {t('modal.addToCart', { fallback: 'Add to Cart' })}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BookingModal;
