// app/reservation-confirmation/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n/client';
import { useReservation } from '@/context/BookingContext';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Check,
  DollarSign,
  AlertCircle,
  CreditCard,
  Shield,
  Clock,
} from 'lucide-react';
import StepIndicator from '@/UI/components/confirmation/StepIndicator';
import FormDataRenderer from '@/UI/components/confirmation/FormDataRenderer';
import ClientInfoForm from '@/UI/components/confirmation/ClientInfoForm';

const ReservationConfirmationPage = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const {
    reservationData,
    updateClientInfo,
    clearReservation,
    setReservationData,
  } = useReservation();
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    console.log('🏁 RESERVATION CONFIRMATION PAGE LOADED');
    console.log('🏁 Current URL:', window.location.href);
    console.log('🏁 Reservation data available:', !!reservationData);
    console.log('🏁 Raw reservationData:', reservationData);

    // If we have reservation data, we're good to go
    if (reservationData) {
      console.log('✅ Reservation Data found in context:', reservationData);
      return; // Exit early, no need to check localStorage or redirect
    }

    // Only if we don't have reservation data, try localStorage
    console.log('⚠️ No reservation data in context, checking localStorage...');

    try {
      const tempData = localStorage.getItem('tempReservationData');
      if (tempData) {
        const parsedData = JSON.parse(tempData);
        console.log('✅ Found reservation data in localStorage:', parsedData);
        setReservationData(parsedData);
        // Clean up localStorage after successful recovery
        localStorage.removeItem('tempReservationData');
        console.log('✅ Reservation data restored from localStorage');
        return; // Exit early, let the component re-render with new data
      } else {
        console.log('❌ No data found in localStorage either');
      }
    } catch (error) {
      console.error('❌ Error reading from localStorage:', error);
    }

    // Only redirect if we truly have no data anywhere
    console.log(
      '⚠️ No reservation data found anywhere, redirecting to home in 3 seconds...'
    );

    const timeoutId = setTimeout(() => {
      // Double-check one more time before redirecting
      if (!reservationData) {
        console.log(
          '❌ Final check - still no reservation data, redirecting...'
        );
        router.push('/');
      } else {
        console.log('✅ Data appeared during timeout, staying on page');
      }
    }, 3000);

    // Cleanup timeout if component unmounts or data arrives
    return () => {
      console.log('🧹 Cleaning up timeout');
      clearTimeout(timeoutId);
    };
  }, [reservationData, router, setReservationData]);

  const handleClientInfoSubmit = (clientInfo: any) => {
    updateClientInfo(clientInfo);
    setCurrentStep(3);
  };

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      // Here you would integrate with your Firebase service
      // For now, we'll simulate the API call

      const bookingData = {
        serviceId: reservationData!.service.id,
        bookingDate: new Date().toISOString(),
        status: 'pending',
        totalPrice: reservationData!.totalPrice,
        clientName: reservationData!.clientInfo?.name,
        clientEmail: reservationData!.clientInfo?.email,
        clientPhone: reservationData!.clientInfo?.phone,
        formData: reservationData!.formData,
        notes: '', // Can be filled by admin later
      };

      console.log('Booking data to be sent to Firebase:', bookingData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // TODO: Replace with actual Firebase call
      // const result = await createReservation(bookingData);

      alert(
        'Reservation created successfully! You will receive a confirmation email shortly.'
      );
      clearReservation();
      router.push('/');
    } catch (error) {
      console.error('Error creating reservation:', error);
      alert(
        'There was an error processing your reservation. Please try again.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  if (!reservationData) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='text-center max-w-md mx-auto p-8'>
          <AlertCircle className='w-16 h-16 text-gray-400 mx-auto mb-4' />
          <h2 className='text-2xl font-bold text-gray-900 mb-2'>
            {t('reservation.noData.title', {
              fallback: 'No Reservation Found',
            })}
          </h2>
          <p className='text-gray-600 mb-6'>
            {t('reservation.noData.description', {
              fallback: "It looks like you haven't started a reservation yet.",
            })}
          </p>
          <button
            onClick={() => router.push('/')}
            className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
          >
            {t('reservation.noData.backToServices', {
              fallback: 'Browse Services',
            })}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-4xl mx-auto px-4'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='bg-white rounded-xl shadow-lg overflow-hidden'
        >
          {/* Header */}
          <div className='bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white'>
            <button
              onClick={() => router.back()}
              className='flex items-center text-blue-100 hover:text-white mb-4 transition-colors'
            >
              <ArrowLeft className='w-4 h-4 mr-2' />
              {t('common.back', { fallback: 'Back' })}
            </button>
            <h1 className='text-2xl font-bold'>
              {t('reservation.confirmTitle', {
                fallback: 'Confirm Your Reservation',
              })}
            </h1>
            <p className='text-blue-100 mt-1'>
              {t('reservation.confirmSubtitle', {
                fallback:
                  'Review your booking details and complete your reservation',
              })}
            </p>
          </div>

          {/* Step Indicator */}
          <div className='p-6 border-b bg-gray-50'>
            <StepIndicator currentStep={currentStep} />
          </div>

          <div className='p-6'>
            {/* Step 1: Review Details */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className='space-y-6'
              >
                {/* Service Summary */}
                <div className='bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-100'>
                  <div className='flex items-start justify-between mb-4'>
                    <div>
                      <h3 className='text-xl font-bold text-blue-900 mb-2'>
                        {reservationData.service.name}
                      </h3>
                      <div className='flex items-center text-blue-700 mb-2'>
                        <span className='bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded-full uppercase tracking-wide'>
                          {reservationData.service.packageType}
                        </span>
                      </div>
                    </div>
                    <div className='text-right'>
                      <div className='flex items-center text-blue-700 mb-1'>
                        <DollarSign className='w-5 h-5 mr-1' />
                        <span className='text-3xl font-bold'>
                          ${reservationData.totalPrice.toFixed(2)}
                        </span>
                      </div>
                      <p className='text-sm text-blue-600'>Total Price</p>
                    </div>
                  </div>

                  {reservationData.service.description && (
                    <p className='text-blue-800 text-sm leading-relaxed'>
                      {reservationData.service.description}
                    </p>
                  )}
                </div>

                {/* Booking Details */}
                <div>
                  <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center'>
                    <Check className='w-5 h-5 mr-2 text-green-600' />
                    {t('reservation.bookingDetails', {
                      fallback: 'Booking Details',
                    })}
                  </h3>

                  <FormDataRenderer
                    formData={reservationData.formData}
                    serviceId={reservationData.service.id}
                  />
                </div>

                {/* Important Information */}
                <div className='bg-amber-50 border border-amber-200 rounded-lg p-4'>
                  <div className='flex items-start'>
                    <Clock className='w-5 h-5 text-amber-600 mr-3 mt-0.5 flex-shrink-0' />
                    <div>
                      <h4 className='font-medium text-amber-800 mb-1'>
                        {t('reservation.importantInfo.title', {
                          fallback: 'Important Information',
                        })}
                      </h4>
                      <p className='text-sm text-amber-700'>
                        {t('reservation.importantInfo.message', {
                          fallback:
                            'Please review all details carefully. Once confirmed, changes may require additional fees or may not be possible.',
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                <div className='pt-4'>
                  <button
                    onClick={() => setCurrentStep(2)}
                    className='w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium'
                  >
                    {t('reservation.continue', { fallback: 'Continue' })}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Contact Information */}
            {currentStep === 2 && (
              <ClientInfoForm
                onSubmit={handleClientInfoSubmit}
                onBack={() => setCurrentStep(1)}
              />
            )}

            {/* Step 3: Final Confirmation */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className='space-y-6'
              >
                <div className='text-center'>
                  <div className='bg-green-50 p-6 rounded-lg mb-6'>
                    <Check className='w-16 h-16 text-green-600 mx-auto mb-4' />
                    <h3 className='text-2xl font-bold text-green-900 mb-2'>
                      {t('reservation.readyToBook', {
                        fallback: 'Ready to Complete Your Booking',
                      })}
                    </h3>
                    <p className='text-green-700'>
                      {t('reservation.finalStep', {
                        fallback:
                          "You're one step away from securing your reservation",
                      })}
                    </p>
                  </div>
                </div>

                {/* Final Summary */}
                <div className='bg-gray-50 p-6 rounded-lg'>
                  <h4 className='font-bold text-gray-900 mb-4 text-lg'>
                    {t('reservation.summary', { fallback: 'Booking Summary' })}
                  </h4>

                  <div className='space-y-3'>
                    <div className='flex justify-between items-center pb-2 border-b border-gray-200'>
                      <span className='font-medium text-gray-700'>
                        {t('reservation.service', { fallback: 'Service' })}:
                      </span>
                      <span className='text-gray-900'>
                        {reservationData.service.name}
                      </span>
                    </div>

                    <div className='flex justify-between items-center pb-2 border-b border-gray-200'>
                      <span className='font-medium text-gray-700'>
                        {t('reservation.client', { fallback: 'Client' })}:
                      </span>
                      <span className='text-gray-900'>
                        {reservationData.clientInfo?.name}
                      </span>
                    </div>

                    <div className='flex justify-between items-center pb-2 border-b border-gray-200'>
                      <span className='font-medium text-gray-700'>
                        {t('reservation.email', { fallback: 'Email' })}:
                      </span>
                      <span className='text-gray-900'>
                        {reservationData.clientInfo?.email}
                      </span>
                    </div>

                    <div className='flex justify-between items-center pb-2 border-b border-gray-200'>
                      <span className='font-medium text-gray-700'>
                        {t('reservation.phone', { fallback: 'Phone' })}:
                      </span>
                      <span className='text-gray-900'>
                        {reservationData.clientInfo?.phone}
                      </span>
                    </div>

                    <div className='flex justify-between items-center pt-2'>
                      <span className='text-lg font-bold text-gray-900'>
                        {t('reservation.total', { fallback: 'Total' })}:
                      </span>
                      <span className='text-xl font-bold text-blue-600'>
                        ${reservationData.totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Security Notice */}
                <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
                  <div className='flex items-start'>
                    <Shield className='w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0' />
                    <div>
                      <h4 className='font-medium text-blue-800 mb-1'>
                        {t('reservation.security.title', {
                          fallback: 'Secure Booking',
                        })}
                      </h4>
                      <p className='text-sm text-blue-700'>
                        {t('reservation.security.message', {
                          fallback:
                            'Your booking will be processed securely. You will receive a confirmation email with all details shortly after confirmation.',
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                <div className='flex flex-col sm:flex-row gap-4 pt-6'>
                  <button
                    onClick={() => setCurrentStep(2)}
                    className='flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors'
                  >
                    {t('common.back', { fallback: 'Back' })}
                  </button>

                  <button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className={`
                      flex-1 px-6 py-3 rounded-lg transition-colors flex items-center justify-center font-medium
                      ${
                        isProcessing
                          ? 'bg-green-400 cursor-not-allowed'
                          : 'bg-green-600 hover:bg-green-700'
                      } text-white
                    `}
                  >
                    {isProcessing ? (
                      <>
                        <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
                        {t('reservation.processing', {
                          fallback: 'Processing...',
                        })}
                      </>
                    ) : (
                      <>
                        <CreditCard className='w-4 w-4 mr-2' />
                        {t('reservation.confirmBooking', {
                          fallback: 'Confirm Booking',
                        })}
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ReservationConfirmationPage;
