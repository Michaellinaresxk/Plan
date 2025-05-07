'use client';

import React, { useState, useEffect } from 'react';
import { DateRange, DayPicker } from 'react-day-picker';
import { format, differenceInDays } from 'date-fns';
import {
  Calendar as CalendarIcon,
  Users,
  Clock,
  Info,
  CheckCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBooking } from '@/context/BookingContext';
import { Service } from '@/types/type';
import { useTranslation } from '@/lib/i18n/client';

const BookingCalendar = () => {
  const {
    packageType,
    selectedServices,
    dates,
    setDates,
    guests,
    setGuests,
    calculateTotalPrice,
  } = useBooking();
  const { t } = useTranslation();

  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    dates ? { from: dates.startDate, to: dates.endDate } : undefined
  );
  const [showServiceTimes, setShowServiceTimes] = useState(false);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<
    Record<string, string>
  >({});
  const [calendarStep, setCalendarStep] = useState<
    'dates' | 'times' | 'review'
  >('dates');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ensure we can only book dates in the future
  const disabledDays = { before: new Date() };

  // Effect to update dateRange when dates in context changes
  useEffect(() => {
    if (dates) {
      setDateRange({ from: dates.startDate, to: dates.endDate });
    }
  }, [dates]);

  const handleRangeSelect = (range: DateRange | undefined) => {
    if (range?.from && range?.to) {
      setDateRange(range);
      setDates({
        startDate: range.from,
        endDate: range.to,
      });

      // If we have selected dates and services, proceed to time slots
      if (selectedServices.length > 0) {
        setCalendarStep('times');
      }
    }
  };

  const handleGuestsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGuests(Number(e.target.value));
  };

  const handleTimeSlotSelect = (serviceId: string, timeSlot: string) => {
    setSelectedTimeSlots((prev) => ({
      ...prev,
      [serviceId]: timeSlot,
    }));
  };

  const handleReviewBooking = () => {
    setCalendarStep('review');
  };

  const handleBackToTimeSelection = () => {
    setCalendarStep('times');
  };

  const handleBackToDateSelection = () => {
    setCalendarStep('dates');
  };

  const handleConfirmBooking = () => {
    setIsSubmitting(true);

    // Simulate API call for booking confirmation
    setTimeout(() => {
      setIsSubmitting(false);
      // Aquí podrías navegar a la página de pago o mostrar un mensaje de confirmación
      window.location.href = '#payment';
    }, 1500);
  };

  // Generate available time slots for each service
  const getServiceTimeSlots = (service: Service) => {
    // Esto es un ejemplo - en una aplicación real, obtendrías esto de una API
    const timeSlots = [];

    // Generate time slots from 9 AM to 5 PM
    for (let hour = 9; hour <= 17; hour++) {
      // Skip 1 PM
      if (hour === 13) continue;

      const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
      const period = hour < 12 ? 'AM' : 'PM';
      timeSlots.push(`${formattedHour}:00 ${period}`);
    }

    return timeSlots;
  };

  // Calculate number of days in the selected range
  const numberOfDays =
    dateRange?.from && dateRange?.to
      ? differenceInDays(dateRange.to, dateRange.from) + 1
      : 0;

  // Only show the calendar when a package is selected and services are added
  if (!packageType || selectedServices.length === 0) {
    return null;
  }

  // Function to get calendar heading based on current step
  const getCalendarHeading = () => {
    switch (calendarStep) {
      case 'dates':
        return t('calendar.selectDates', { fallback: 'Select Your Dates' });
      case 'times':
        return t('calendar.selectTimes', { fallback: 'Select Service Times' });
      case 'review':
        return t('calendar.reviewBooking', { fallback: 'Review Your Booking' });
      default:
        return '';
    }
  };

  return (
    <section id='calendar' className='py-24 bg-gray-50'>
      <div className='container mx-auto px-6'>
        <div className='text-center mb-16'>
          <h2 className='text-4xl font-bold text-gray-900 mb-4'>
            {getCalendarHeading()}
          </h2>
          <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
            {calendarStep === 'dates' &&
              t('calendar.datesSubtitle', {
                fallback:
                  'Choose your check-in and check-out dates and number of guests.',
              })}
            {calendarStep === 'times' &&
              t('calendar.timesSubtitle', {
                fallback:
                  'Select preferred times for each of your booked services.',
              })}
            {calendarStep === 'review' &&
              t('calendar.reviewSubtitle', {
                fallback:
                  'Review all your booking details before proceeding to payment.',
              })}
          </p>
        </div>

        <motion.div
          className='max-w-4xl mx-auto'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className='bg-white rounded-xl shadow-lg p-6 md:p-8'>
            {/* Step indicator */}
            <div className='flex justify-center items-center mb-8'>
              <div
                className={`step-item ${
                  calendarStep === 'dates' ||
                  calendarStep === 'times' ||
                  calendarStep === 'review'
                    ? 'active'
                    : ''
                }`}
              >
                <div
                  className={`step-circle ${
                    calendarStep === 'dates' ||
                    calendarStep === 'times' ||
                    calendarStep === 'review'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200'
                  }`}
                >
                  <CalendarIcon size={18} />
                </div>
                <div className='step-label'>Dates</div>
              </div>
              <div
                className={`step-connector ${
                  calendarStep === 'times' || calendarStep === 'review'
                    ? 'active'
                    : ''
                }`}
              ></div>
              <div
                className={`step-item ${
                  calendarStep === 'times' || calendarStep === 'review'
                    ? 'active'
                    : ''
                }`}
              >
                <div
                  className={`step-circle ${
                    calendarStep === 'times' || calendarStep === 'review'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200'
                  }`}
                >
                  <Clock size={18} />
                </div>
                <div className='step-label'>Times</div>
              </div>
              <div
                className={`step-connector ${
                  calendarStep === 'review' ? 'active' : ''
                }`}
              ></div>
              <div
                className={`step-item ${
                  calendarStep === 'review' ? 'active' : ''
                }`}
              >
                <div
                  className={`step-circle ${
                    calendarStep === 'review'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200'
                  }`}
                >
                  <CheckCircle size={18} />
                </div>
                <div className='step-label'>Review</div>
              </div>
            </div>

            {/* Date Selection */}
            <AnimatePresence mode='wait'>
              {calendarStep === 'dates' && (
                <motion.div
                  key='date-selection'
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className='flex flex-col md:flex-row gap-8'
                >
                  {/* Calendar */}
                  <div className='flex-1'>
                    <div className='mb-4 flex items-center'>
                      <CalendarIcon className='mr-2 h-5 w-5 text-gray-600' />
                      <h3 className='text-lg font-medium text-gray-900'>
                        {t('calendar.selectDates', {
                          fallback: 'Select Dates',
                        })}
                      </h3>
                    </div>

                    <div className='calendar-container p-2 border border-gray-200 rounded-lg bg-white'>
                      <DayPicker
                        mode='range'
                        selected={dateRange}
                        onSelect={handleRangeSelect}
                        disabled={disabledDays}
                        numberOfMonths={1}
                        className='rdp-custom'
                        styles={{
                          caption: { color: '#1e3a8a' },
                          day_selected: {
                            backgroundColor:
                              packageType === 'standard'
                                ? '#3b82f6'
                                : '#f59e0b',
                          },
                          day_today: {
                            color:
                              packageType === 'standard'
                                ? '#3b82f6'
                                : '#f59e0b',
                          },
                        }}
                      />
                    </div>
                  </div>

                  {/* Booking Summary */}
                  <div className='flex-1'>
                    <div className='mb-4 flex items-center'>
                      <h3 className='text-lg font-medium text-gray-900'>
                        {t('calendar.bookingSummary', {
                          fallback: 'Booking Summary',
                        })}
                      </h3>
                    </div>

                    <div className='bg-gray-50 p-4 rounded-lg mb-6'>
                      {dateRange?.from && dateRange?.to ? (
                        <div className='text-gray-700'>
                          <p className='font-medium'>
                            {t('calendar.selectedDates', {
                              fallback: 'Selected Dates',
                            })}
                            :
                          </p>
                          <p className='mb-2'>
                            {format(dateRange.from, 'PP')} -{' '}
                            {format(dateRange.to, 'PP')}
                          </p>
                          <p className='text-sm text-gray-500'>
                            {numberOfDays}{' '}
                            {numberOfDays === 1
                              ? t('calendar.day', { fallback: 'day' })
                              : t('calendar.days', { fallback: 'days' })}
                          </p>
                        </div>
                      ) : (
                        <p className='text-gray-500 italic'>
                          {t('calendar.pleaseSelectDates', {
                            fallback:
                              'Please select check-in and check-out dates',
                          })}
                        </p>
                      )}
                    </div>

                    <div className='mb-6'>
                      <label className='block text-gray-700 mb-2 flex items-center'>
                        <Users className='mr-2 h-5 w-5' />
                        {t('calendar.numberOfGuests', {
                          fallback: 'Number of Guests',
                        })}
                      </label>
                      <select
                        value={guests}
                        onChange={handleGuestsChange}
                        className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
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
                    </div>

                    <div className='mb-6'>
                      <div className='flex items-start mb-4'>
                        <Info
                          size={18}
                          className='text-blue-500 mt-1 mr-2 flex-shrink-0'
                        />
                        <p className='text-sm text-gray-600'>
                          {t('calendar.dateInfo', {
                            fallback:
                              "In the next step, you'll be able to select specific times for each service you've booked.",
                          })}
                        </p>
                      </div>
                    </div>

                    {dateRange?.from && dateRange?.to && (
                      <div>
                        <button
                          onClick={() => setCalendarStep('times')}
                          className={`
                            inline-flex items-center justify-center w-full py-4 px-6 rounded-lg font-semibold transition-colors duration-300
                            ${
                              packageType === 'standard'
                                ? 'bg-blue-500 text-white hover:bg-blue-600'
                                : 'bg-amber-500 text-white hover:bg-amber-600'
                            }
                          `}
                        >
                          {t('calendar.continueToTimeSelection', {
                            fallback: 'Continue to Time Selection',
                          })}
                          <svg
                            className='ml-2 w-5 h-5'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth='2'
                              d='M14 5l7 7m0 0l-7 7m7-7H3'
                            ></path>
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Time Slot Selection */}
              {calendarStep === 'times' && (
                <motion.div
                  key='time-selection'
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className='flex flex-col gap-6'
                >
                  <div className='flex items-start mb-4'>
                    <Info
                      size={18}
                      className='text-blue-500 mt-1 mr-2 flex-shrink-0'
                    />
                    <p className='text-sm text-gray-600'>
                      {t('calendar.timeSelectionInfo', {
                        fallback:
                          'Please select a preferred time for each service during your stay. These times are subject to availability and confirmation.',
                      })}
                    </p>
                  </div>

                  {/* Service Time Slots */}
                  <div className='space-y-6'>
                    {selectedServices.map((service) => {
                      const timeSlots = getServiceTimeSlots(service);

                      return (
                        <div
                          key={service.id}
                          className='bg-gray-50 p-4 rounded-lg'
                        >
                          <h4 className='font-medium text-gray-900 mb-3'>
                            {service.name}
                          </h4>

                          <div className='mb-2 flex items-center text-sm text-gray-600'>
                            <Clock size={16} className='mr-1' />
                            <span>
                              {service.duration}{' '}
                              {service.duration === 1
                                ? t('services.hours.one', { fallback: 'hour' })
                                : t('services.hours.multiple', {
                                    fallback: 'hours',
                                  })}
                            </span>
                          </div>

                          <p className='text-sm text-gray-600 mb-3'>
                            {t('calendar.selectTimeForService', {
                              fallback: 'Select preferred time:',
                              service: service.name,
                            })}
                          </p>

                          <div className='grid grid-cols-2 sm:grid-cols-4 gap-2'>
                            {timeSlots.map((timeSlot) => (
                              <button
                                key={timeSlot}
                                onClick={() =>
                                  handleTimeSlotSelect(service.id, timeSlot)
                                }
                                className={`
                                  py-2 px-3 text-sm rounded-md text-center transition-colors
                                  ${
                                    selectedTimeSlots[service.id] === timeSlot
                                      ? packageType === 'standard'
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-amber-500 text-white'
                                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                  }
                                `}
                              >
                                {timeSlot}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Navigation buttons */}
                  <div className='flex flex-col sm:flex-row gap-3 mt-4'>
                    <button
                      onClick={handleBackToDateSelection}
                      className='py-3 px-6 rounded-lg font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors duration-300'
                    >
                      <svg
                        className='inline-block mr-2 w-5 h-5'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth='2'
                          d='M10 19l-7-7m0 0l7-7m-7 7h18'
                        ></path>
                      </svg>
                      {t('calendar.backToDates', { fallback: 'Back to Dates' })}
                    </button>

                    <button
                      onClick={handleReviewBooking}
                      disabled={
                        Object.keys(selectedTimeSlots).length <
                        selectedServices.length
                      }
                      className={`
                        flex-1 py-3 px-6 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center
                        ${
                          packageType === 'standard'
                            ? 'bg-blue-500 text-white hover:bg-blue-600'
                            : 'bg-amber-500 text-white hover:bg-amber-600'
                        }
                        ${
                          Object.keys(selectedTimeSlots).length <
                          selectedServices.length
                            ? 'opacity-50 cursor-not-allowed'
                            : ''
                        }
                      `}
                    >
                      {t('calendar.reviewBooking', {
                        fallback: 'Review Booking',
                      })}
                      <svg
                        className='ml-2 w-5 h-5'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth='2'
                          d='M14 5l7 7m0 0l-7 7m7-7H3'
                        ></path>
                      </svg>
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Booking Review */}
              {calendarStep === 'review' && (
                <motion.div
                  key='booking-review'
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className='flex flex-col gap-6'
                >
                  {/* Review Summary */}
                  <div className='bg-gray-50 p-6 rounded-lg'>
                    <h3 className='font-medium text-gray-900 mb-4 text-lg'>
                      {t('calendar.bookingDetails', {
                        fallback: 'Booking Details',
                      })}
                    </h3>

                    <div className='space-y-4'>
                      {/* Package */}
                      <div className='flex justify-between items-center border-b border-gray-200 pb-2'>
                        <span className='text-gray-600'>
                          {t('calendar.package', { fallback: 'Package' })}:
                        </span>
                        <span className='font-medium text-gray-900'>
                          {packageType === 'standard'
                            ? 'Punta Cana Plan'
                            : 'Punta Cana Luxe'}
                        </span>
                      </div>

                      {/* Dates */}
                      <div className='flex justify-between items-center border-b border-gray-200 pb-2'>
                        <span className='text-gray-600'>
                          {t('calendar.dates', { fallback: 'Dates' })}:
                        </span>
                        <span className='font-medium text-gray-900'>
                          {dateRange?.from && dateRange?.to && (
                            <>
                              {format(dateRange.from, 'PP')} -{' '}
                              {format(dateRange.to, 'PP')}
                              <span className='text-gray-500 text-sm ml-2'>
                                ({numberOfDays}{' '}
                                {numberOfDays === 1 ? 'day' : 'days'})
                              </span>
                            </>
                          )}
                        </span>
                      </div>

                      {/* Guests */}
                      <div className='flex justify-between items-center border-b border-gray-200 pb-2'>
                        <span className='text-gray-600'>
                          {t('calendar.guests', { fallback: 'Guests' })}:
                        </span>
                        <span className='font-medium text-gray-900'>
                          {guests}
                        </span>
                      </div>

                      {/* Services */}
                      <div className='border-b border-gray-200 pb-2'>
                        <h4 className='text-gray-600 mb-2'>
                          {t('calendar.services', { fallback: 'Services' })}:
                        </h4>
                        <ul className='space-y-2 ml-2'>
                          {selectedServices.map((service) => (
                            <li
                              key={service.id}
                              className='flex justify-between items-center'
                            >
                              <div>
                                <span className='font-medium text-gray-900'>
                                  {service.name}
                                </span>
                                {selectedTimeSlots[service.id] && (
                                  <span className='text-gray-500 text-sm ml-2'>
                                    ({selectedTimeSlots[service.id]})
                                  </span>
                                )}
                              </div>
                              <span className='text-gray-900'>
                                ${service.price}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Total */}
                      <div className='flex justify-between items-center pt-2'>
                        <span className='text-gray-800 font-semibold'>
                          {t('calendar.total', { fallback: 'Total' })}:
                        </span>
                        <span className='font-bold text-xl text-gray-900'>
                          ${calculateTotalPrice().toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Navigation buttons */}
                  <div className='flex flex-col sm:flex-row gap-3 mt-4'>
                    <button
                      onClick={handleBackToTimeSelection}
                      className='py-3 px-6 rounded-lg font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors duration-300'
                    >
                      <svg
                        className='inline-block mr-2 w-5 h-5'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth='2'
                          d='M10 19l-7-7m0 0l7-7m-7 7h18'
                        ></path>
                      </svg>
                      {t('calendar.backToTimeSelection', {
                        fallback: 'Back to Time Selection',
                      })}
                    </button>

                    <button
                      onClick={handleConfirmBooking}
                      disabled={isSubmitting}
                      className={`
                        flex-1 py-3 px-6 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center
                        ${
                          packageType === 'standard'
                            ? 'bg-blue-500 text-white hover:bg-blue-600'
                            : 'bg-amber-500 text-white hover:bg-amber-600'
                        }
                        ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}
                      `}
                    >
                      {isSubmitting ? (
                        <>
                          <svg
                            className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                          >
                            <circle
                              className='opacity-25'
                              cx='12'
                              cy='12'
                              r='10'
                              stroke='currentColor'
                              strokeWidth='4'
                            ></circle>
                            <path
                              className='opacity-75'
                              fill='currentColor'
                              d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                            ></path>
                          </svg>
                          {t('calendar.processing', {
                            fallback: 'Processing...',
                          })}
                        </>
                      ) : (
                        <>
                          {t('calendar.proceedToPayment', {
                            fallback: 'Proceed to Payment',
                          })}
                          <svg
                            className='ml-2 w-5 h-5'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth='2'
                              d='M14 5l7 7m0 0l-7 7m7-7H3'
                            ></path>
                          </svg>
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Step Indicators CSS */}
          <style jsx>{`
            .step-item {
              display: flex;
              flex-direction: column;
              align-items: center;
              position: relative;
              z-index: 1;
            }

            .step-circle {
              width: 40px;
              height: 40px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-bottom: 8px;
              transition: all 0.3s ease;
            }

            .step-label {
              font-size: 14px;
              color: #4b5563;
              font-weight: 500;
            }

            .step-connector {
              flex-grow: 1;
              height: 2px;
              background-color: #e5e7eb;
              margin: 0 10px;
              margin-bottom: 40px;
              transition: background-color 0.3s ease;
            }

            .step-connector.active {
              background-color: #3b82f6;
            }
          `}</style>
        </motion.div>
      </div>
    </section>
  );
};

export default BookingCalendar;
