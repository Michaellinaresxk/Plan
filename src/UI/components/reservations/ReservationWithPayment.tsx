// UI/components/reservation/ReservationWithPayment.tsx
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Check, AlertCircle } from 'lucide-react';
import CheckoutModal from '@/UI/components/payment/CheckoutModal';
import { useReservation } from '@/context/BookingContext';
import type { ReservationData } from '@/context/BookingContext';

interface ReservationWithPaymentProps {
  reservationData: ReservationData;
  onSuccess: (reservation: any) => void;
  onError: (error: string) => void;
  isProcessing?: boolean;
}

const ReservationWithPayment: React.FC<ReservationWithPaymentProps> = ({
  reservationData,
  onSuccess,
  onError,
  isProcessing = false,
}) => {
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const { setReservationResult, clearReservation } = useReservation();

  const handlePaymentClick = () => {
    console.log('💳 Opening payment modal...');
    setShowCheckout(true);
  };

  const handlePaymentSuccess = (reservation: any) => {
    console.log('✅ Payment and reservation successful:', reservation);

    setPaymentSuccess(true);
    setShowCheckout(false);

    // Store the result in context
    setReservationResult({
      reservation,
      success: true,
    });

    // Show success message
    const successMessage = `Reservation created and payment processed successfully! 

📋 Booking ID: ${reservation.bookingId}
📧 Email: ${reservationData.clientInfo?.email}
💰 Amount: $${reservationData.totalPrice.toFixed(2)}

You will receive a confirmation email shortly.`;

    alert(successMessage);

    // Clear the reservation data
    clearReservation();

    // Call the success callback
    onSuccess(reservation);
  };

  const handlePaymentError = (error: string) => {
    console.error('❌ Payment failed:', error);

    setReservationResult({
      reservation: null,
      success: false,
      error,
    });

    // Call the error callback
    onError(error);
  };

  const handleCloseCheckout = () => {
    setShowCheckout(false);
  };

  if (paymentSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className='text-center p-8 bg-green-50 rounded-lg border border-green-200'
      >
        <Check className='w-16 h-16 text-green-600 mx-auto mb-4' />
        <h3 className='text-2xl font-bold text-green-900 mb-2'>
          Payment Successful!
        </h3>
        <p className='text-green-700'>
          Your reservation has been created and payment processed successfully.
        </p>
      </motion.div>
    );
  }

  return (
    <>
      {/* Final Summary */}
      <div className='bg-gray-50 p-6 rounded-lg mb-6'>
        <h4 className='font-bold text-gray-900 mb-4 text-lg'>
          Booking Summary
        </h4>

        <div className='space-y-3'>
          <div className='flex justify-between items-center pb-2 border-b border-gray-200'>
            <span className='font-medium text-gray-700'>Service:</span>
            <span className='text-gray-900'>
              {reservationData.service.name}
            </span>
          </div>

          <div className='flex justify-between items-center pb-2 border-b border-gray-200'>
            <span className='font-medium text-gray-700'>Client:</span>
            <span className='text-gray-900'>
              {reservationData.clientInfo?.name}
            </span>
          </div>

          <div className='flex justify-between items-center pb-2 border-b border-gray-200'>
            <span className='font-medium text-gray-700'>Email:</span>
            <span className='text-gray-900'>
              {reservationData.clientInfo?.email}
            </span>
          </div>

          <div className='flex justify-between items-center pb-2 border-b border-gray-200'>
            <span className='font-medium text-gray-700'>Phone:</span>
            <span className='text-gray-900'>
              {reservationData.clientInfo?.phone}
            </span>
          </div>

          {reservationData.clientInfo?.hostInfo && (
            <div className='flex justify-between items-center pb-2 border-b border-gray-200'>
              <span className='font-medium text-gray-700'>Host Info:</span>
              <span className='text-gray-900'>
                {reservationData.clientInfo.hostInfo}
              </span>
            </div>
          )}

          <div className='flex justify-between items-center pt-2'>
            <span className='text-lg font-bold text-gray-900'>Total:</span>
            <span className='text-xl font-bold text-blue-600'>
              ${reservationData.totalPrice.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Payment Notice */}
      <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6'>
        <div className='flex items-start'>
          <CreditCard className='w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0' />
          <div>
            <h4 className='font-medium text-blue-800 mb-1'>
              Secure Payment Required
            </h4>
            <p className='text-sm text-blue-700'>
              To complete your reservation, we need to process your payment
              securely through Square. Your card information is encrypted and
              never stored on our servers.
            </p>
          </div>
        </div>
      </div>

      {/* Payment Button */}
      <div className='flex flex-col gap-4'>
        <button
          onClick={handlePaymentClick}
          disabled={isProcessing}
          className={`
            w-full px-6 py-4 rounded-lg transition-colors flex items-center justify-center font-medium text-lg
            ${
              isProcessing
                ? 'bg-green-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
            } text-white
          `}
        >
          {isProcessing ? (
            <>
              <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3'></div>
              Processing...
            </>
          ) : (
            <>
              <CreditCard className='w-5 h-5 mr-3' />
              Pay ${reservationData.totalPrice.toFixed(2)} & Complete Booking
            </>
          )}
        </button>

        <p className='text-xs text-gray-500 text-center'>
          By completing this purchase you agree to our terms of service and
          privacy policy. You will be charged immediately upon successful
          payment.
        </p>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={showCheckout}
        onClose={handleCloseCheckout}
        reservationData={reservationData}
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentError={handlePaymentError}
      />
    </>
  );
};

export default ReservationWithPayment;
