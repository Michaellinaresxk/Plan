'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, CreditCard } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from '@/UI/components/payment/PaymentForm';
import { useReservation } from '@/hooks/useReservation';
import type { ReservationData } from '@/context/BookingContext';

// Initialize Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservationData: ReservationData;
  onPaymentSuccess: (reservation: any) => void;
  onPaymentError: (error: string) => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  reservationData,
  onPaymentSuccess,
  onPaymentError,
}) => {
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState<'payment' | 'success'>(
    'payment'
  );
  const { createReservation } = useReservation();

  const handlePaymentSuccess = (reservation: any) => {
    console.log('✅ Payment successful in modal:', reservation);
    setPaymentSuccess(true);
    setCurrentStep('success');

    // Wait a moment to show success, then call parent callback
    setTimeout(() => {
      onPaymentSuccess(reservation);
    }, 2000);
  };

  const handlePaymentError = (error: string) => {
    console.error('❌ Payment error in modal:', error);
    onPaymentError(error);
  };

  const handleClose = () => {
    if (!paymentSuccess) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className='bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className='flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-800'>
            <div className='flex items-center'>
              <CreditCard className='w-6 h-6 text-white mr-3' />
              <div>
                <h2 className='text-xl font-bold text-white'>
                  {currentStep === 'payment'
                    ? 'Complete Payment'
                    : 'Payment Successful!'}
                </h2>
                <p className='text-blue-100 text-sm'>
                  {currentStep === 'payment'
                    ? 'Secure checkout powered by Stripe'
                    : 'Your reservation has been confirmed'}
                </p>
              </div>
            </div>
            {currentStep === 'payment' && (
              <button
                onClick={handleClose}
                className='p-2 hover:bg-blue-700 rounded-full transition-colors'
              >
                <X className='w-5 h-5 text-white' />
              </button>
            )}
          </div>

          {/* Content */}
          <div className='p-6'>
            {currentStep === 'payment' && (
              <div className='space-y-6'>
                {/* Progress Indicator */}
                <div className='flex items-center justify-center space-x-4 mb-6'>
                  <div className='flex items-center'>
                    <div className='w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium'>
                      1
                    </div>
                    <span className='ml-2 text-sm font-medium text-blue-600'>
                      Review Details
                    </span>
                  </div>
                  <div className='w-8 h-px bg-gray-300'></div>
                  <div className='flex items-center'>
                    <div className='w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium'>
                      2
                    </div>
                    <span className='ml-2 text-sm font-medium text-blue-600'>
                      Secure Payment
                    </span>
                  </div>
                  <div className='w-8 h-px bg-gray-300'></div>
                  <div className='flex items-center'>
                    <div className='w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium'>
                      3
                    </div>
                    <span className='ml-2 text-sm font-medium text-gray-500'>
                      Confirmation
                    </span>
                  </div>
                </div>

                {/* Payment Form */}
                <Elements
                  stripe={stripePromise}
                  options={{
                    appearance: {
                      theme: 'stripe',
                      variables: {
                        colorPrimary: '#2563eb',
                      },
                    },
                  }}
                >
                  <PaymentForm
                    reservationData={reservationData}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                    createReservation={createReservation}
                    onClose={handleClose}
                  />
                </Elements>
              </div>
            )}

            {currentStep === 'success' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className='text-center py-8'
              >
                <div className='mb-6'>
                  <div className='w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                    <Check className='w-10 h-10 text-green-600' />
                  </div>
                  <h3 className='text-2xl font-bold text-green-900 mb-2'>
                    Payment Successful!
                  </h3>
                  <p className='text-green-700 mb-4'>
                    Your reservation has been confirmed and payment processed
                    successfully.
                  </p>
                </div>

                {/* Success Details */}
                <div className='bg-green-50 border border-green-200 rounded-lg p-6 text-left'>
                  <h4 className='font-semibold text-green-900 mb-3'>
                    Reservation Details:
                  </h4>
                  <div className='space-y-2 text-sm'>
                    <div className='flex justify-between'>
                      <span className='text-green-700'>Service:</span>
                      <span className='text-green-900 font-medium'>
                        {reservationData.service.name}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-green-700'>Client:</span>
                      <span className='text-green-900 font-medium'>
                        {reservationData.clientInfo?.name}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-green-700'>Email:</span>
                      <span className='text-green-900 font-medium'>
                        {reservationData.clientInfo?.email}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-green-700'>Amount Paid:</span>
                      <span className='text-green-900 font-bold'>
                        ${reservationData.totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className='mt-6 space-y-3'>
                  <p className='text-sm text-gray-600'>
                    📧 A confirmation email has been sent to{' '}
                    <strong>{reservationData.clientInfo?.email}</strong>
                  </p>
                  <p className='text-sm text-gray-600'>
                    🎉 Thank you for choosing our services!
                  </p>
                </div>

                {/* Auto-close indicator */}
                <div className='mt-8'>
                  <div className='w-full bg-gray-200 rounded-full h-1'>
                    <motion.div
                      className='bg-green-600 h-1 rounded-full'
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 2 }}
                    />
                  </div>
                  <p className='text-xs text-gray-500 mt-2'>
                    Redirecting to confirmation page...
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CheckoutModal;
