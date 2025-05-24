'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n/client';
import { useReservation } from '@/context/BookingContext';
import { useReservation as useReservationHook } from '@/hooks/useReservation';
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
    setReservationResult,
  } = useReservation();

  // Use the reservation hook
  const {
    createReservation,
    isLoading: isCreatingReservation,
    error: reservationError,
    clearError,
  } = useReservationHook();

  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasTriedRecovery, setHasTriedRecovery] = useState(false);

  // Recovery method with proper error handling
  const recoverReservationData = () => {
    if (typeof window === 'undefined' || hasTriedRecovery) return null;

    console.log(
      '🔄 Attempting to recover reservation data from localStorage...'
    );
    setHasTriedRecovery(true);

    try {
      const tempData = localStorage.getItem('tempReservationData');
      if (tempData) {
        const parsedData = JSON.parse(tempData);

        // Properly deserialize the data
        const deserializedData = {
          ...parsedData,
          bookingDate: new Date(parsedData.bookingDate), // Convert string back to Date
        };

        console.log(
          '✅ Successfully recovered reservation data:',
          deserializedData
        );
        setReservationData(deserializedData);

        // Clean up localStorage after successful recovery
        localStorage.removeItem('tempReservationData');
        console.log('🧹 Cleaned up temporary localStorage data');

        return deserializedData;
      } else {
        console.log('❌ No reservation data found in localStorage');
      }
    } catch (error) {
      console.error('❌ Error recovering reservation data:', error);

      // Clean up corrupted data
      if (typeof window !== 'undefined') {
        localStorage.removeItem('tempReservationData');
      }
    }

    return null;
  };

  useEffect(() => {
    console.log('🏁 RESERVATION CONFIRMATION PAGE LOADED');
    console.log('🏁 Current URL:', window.location.href);
    console.log('🏁 Reservation data available:', !!reservationData);
    console.log('🏁 Raw reservationData:', reservationData);

    // If we have reservation data, we're good to go
    if (reservationData) {
      console.log('✅ Reservation Data found in context:', reservationData);

      // Validate that bookingDate is a proper Date object
      if (
        reservationData.bookingDate &&
        !(reservationData.bookingDate instanceof Date)
      ) {
        console.log('⚠️ Fixing bookingDate that is not a Date object');
        const fixedData = {
          ...reservationData,
          bookingDate: new Date(reservationData.bookingDate),
        };
        setReservationData(fixedData);
      }

      return; // Exit early, no need to check localStorage or redirect
    }

    // Only if we don't have reservation data, try localStorage
    console.log('⚠️ No reservation data in context, checking localStorage...');

    const recoveredData = recoverReservationData();

    if (recoveredData) {
      console.log('✅ Reservation data recovered successfully');
      return; // Exit early, let the component re-render with new data
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
    console.log('👤 Submitting client info:', clientInfo);
    updateClientInfo(clientInfo);
    setCurrentStep(3);
  };

  // Fixed payment handler with better error handling
  const handlePayment = async () => {
    if (!reservationData) {
      console.error('❌ No reservation data available');
      alert('No reservation data available. Please try again.');
      return;
    }

    if (!reservationData.clientInfo) {
      console.error('❌ No client info available');
      alert(
        'Client information is required. Please go back and fill in your details.'
      );
      return;
    }

    // Validate that bookingDate is a proper Date object
    if (!(reservationData.bookingDate instanceof Date)) {
      console.error('❌ Invalid booking date:', reservationData.bookingDate);
      alert('Invalid booking date. Please try again.');
      return;
    }

    setIsProcessing(true);
    clearError(); // Clear any previous errors

    try {
      console.log('🚀 Starting reservation creation process...');
      console.log('📋 Current reservation data:', reservationData);

      // Prepare the data for the reservation service
      const createReservationData = {
        serviceId: reservationData.service.id,
        serviceName: reservationData.service.name,
        totalPrice: reservationData.totalPrice,
        clientName: reservationData.clientInfo.name,
        clientEmail: reservationData.clientInfo.email,
        clientPhone: reservationData.clientInfo.phone,
        formData: reservationData.formData,
        notes: '', // Can be filled by admin later
      };

      console.log('📋 Reservation data prepared:', createReservationData);

      // Create the reservation using the use case
      const createdReservation = await createReservation(createReservationData);

      console.log('✅ Reservation created successfully:', createdReservation);

      // Store the result in context
      setReservationResult({
        reservation: createdReservation,
        success: true,
      });

      // Show success message with better formatting
      const successMessage = `Reservation created successfully! 

📋 Booking ID: ${createdReservation.bookingId}
📧 Email: ${reservationData.clientInfo.email}
💰 Amount: $${reservationData.totalPrice.toFixed(2)}

You will receive a confirmation email shortly. Our team will review your request and send you a payment link once approved.`;

      alert(successMessage);

      // Clear the temporary reservation data
      clearReservation();

      // Redirect to home or success page
      router.push('/');
    } catch (error) {
      console.error('❌ Error creating reservation:', error);

      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred';

      setReservationResult({
        reservation: null,
        success: false,
        error: errorMessage,
      });

      alert(
        `There was an error processing your reservation: ${errorMessage}. Please try again.`
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Loading state while trying to recover data
  if (!reservationData && !hasTriedRecovery) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='text-center max-w-md mx-auto p-8'>
          <div className='animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4'></div>
          <h2 className='text-2xl font-bold text-gray-900 mb-2'>
            Loading your reservation...
          </h2>
          <p className='text-gray-600'>
            Please wait while we prepare your booking details.
          </p>
        </div>
      </div>
    );
  }

  // No data found state
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
                          {reservationData.service.packageType || 'Service'}
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
                    disabled={isProcessing || isCreatingReservation}
                  >
                    {t('common.back', { fallback: 'Back' })}
                  </button>

                  <button
                    onClick={handlePayment}
                    disabled={isProcessing || isCreatingReservation}
                    className={`
                      flex-1 px-6 py-3 rounded-lg transition-colors flex items-center justify-center font-medium
                      ${
                        isProcessing || isCreatingReservation
                          ? 'bg-green-400 cursor-not-allowed'
                          : 'bg-green-600 hover:bg-green-700'
                      } text-white
                    `}
                  >
                    {isProcessing || isCreatingReservation ? (
                      <>
                        <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
                        {t('reservation.processing', {
                          fallback: 'Creating Reservation...',
                        })}
                      </>
                    ) : (
                      <>
                        <CreditCard className='w-4 w-4 mr-2' />
                        {t('reservation.confirmBooking', {
                          fallback: 'Create Reservation',
                        })}
                      </>
                    )}
                  </button>
                </div>

                {/* Show error if any */}
                {reservationError && (
                  <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
                    <div className='flex items-start'>
                      <AlertCircle className='w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0' />
                      <div className='flex-grow'>
                        <p className='text-red-700 text-sm font-medium mb-1'>
                          Error Creating Reservation
                        </p>
                        <p className='text-red-600 text-sm'>
                          {reservationError}
                        </p>
                        <button
                          onClick={clearError}
                          className='mt-2 text-sm text-red-600 hover:text-red-800 underline'
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ReservationConfirmationPage;
