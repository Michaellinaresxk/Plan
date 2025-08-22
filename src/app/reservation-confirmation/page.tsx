// app/reservation-confirmation/page.tsx (VERSIÓN COMPLETA ACTUALIZADA)
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n/client';
import { useReservation } from '@/context/BookingContext';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import ReservationSteps from '@/UI/components/reservations/ReservationSteps';

const ReservationConfirmationPage = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { reservationData, setReservationData, setReservationResult } =
    useReservation();

  const [hasTriedRecovery, setHasTriedRecovery] = useState(false);

  // Recovery method with proper error handling
  const recoverReservationData = () => {
    if (typeof window === 'undefined' || hasTriedRecovery) return null;

    console.log(
      '📄 Attempting to recover reservation data from localStorage...'
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

  const handleReservationSuccess = (reservation: any) => {
    console.log('🎉 Reservation process completed successfully:', reservation);
    router.push('/');
  };

  const handleReservationError = (error: string) => {
    console.error('💥 Reservation process failed:', error);

    setReservationResult({
      reservation: null,
      success: false,
      error,
    });

    // Show error alert
    alert(`Reservation failed: ${error}. Please try again.`);
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
          <ReservationSteps
            reservationData={reservationData}
            onSuccess={handleReservationSuccess}
            onError={handleReservationError}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default ReservationConfirmationPage;
