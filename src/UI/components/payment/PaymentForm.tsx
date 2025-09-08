// UI/components/payment/PaymentForm.tsx
'use client';

import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { CreditCard, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { usePayment } from '@/hooks/usePayment';
import type { ReservationData } from '@/context/BookingContext';

interface PaymentFormProps {
  reservationData: ReservationData;
  onSuccess: (reservation: any) => void;
  onError: (error: string) => void;
  onClose: () => void;
}

const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#374151',
      '::placeholder': {
        color: '#9CA3AF',
      },
      fontFamily: 'ui-sans-serif, system-ui, sans-serif',
      padding: '10px 12px',
    },
    invalid: {
      color: '#EF4444',
      iconColor: '#EF4444',
    },
  },
  hidePostalCode: true,
};

const PaymentForm: React.FC<PaymentFormProps> = ({
  reservationData,
  onSuccess,
  onError,
  onClose,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { createPaymentIntent, processCompletePayment } = usePayment();

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<
    'ready' | 'processing' | 'success'
  >('ready');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      console.error('❌ Stripe not loaded');
      onError('Payment system not ready. Please refresh the page.');
      return;
    }

    if (!reservationData.clientInfo) {
      onError('Client information is required');
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);
    setCurrentStep('processing');

    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      console.log('💳 Step 1: Creating payment intent...');

      // CREAR PAYMENT INTENT SOLO CUANDO SE NECESITA
      const paymentIntentData = {
        reservationId: `temp_${Date.now()}`,
        amount: Math.round(reservationData.totalPrice * 100), // Convert to cents
        currency: 'usd',
        metadata: {
          serviceName: reservationData.service.name,
          clientEmail: reservationData.clientInfo.email,
          clientName: reservationData.clientInfo.name,
        },
      };

      const paymentIntent = await createPaymentIntent(paymentIntentData);

      console.log('💳 Step 2: Confirming payment with Stripe...');

      // Confirmar payment con Stripe
      const { error, paymentIntent: confirmedPayment } =
        await stripe.confirmCardPayment(paymentIntent.clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: reservationData.clientInfo.name,
              email: reservationData.clientInfo.email,
              phone: reservationData.clientInfo.phone,
            },
          },
        });

      if (error) {
        console.error('❌ Payment confirmation failed:', error);
        const errorMessage = error.message || 'Payment failed';
        setPaymentError(errorMessage);
        setCurrentStep('ready');
        onError(errorMessage);
        return;
      }

      if (confirmedPayment?.status === 'succeeded') {
        console.log('✅ Step 2 complete: Payment confirmed!');
        console.log('📋 Step 3: Creating reservation...');

        // Crear reservación
        const result = await processCompletePayment({
          reservationData,
          paymentMethodId: confirmedPayment.payment_method as string,
          clientSecret: paymentIntent.clientSecret,
        });

        if (result.success) {
          console.log('✅ Step 3 complete: Reservation created successfully');
          setCurrentStep('success');

          // Small delay to show success state
          setTimeout(() => {
            onSuccess(result.reservation);
          }, 1500);
        } else {
          throw new Error('Failed to create reservation after payment');
        }
      } else {
        throw new Error('Payment did not complete successfully');
      }
    } catch (error) {
      console.error('❌ Error during payment process:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred';
      setPaymentError(errorMessage);
      setCurrentStep('ready');
      onError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  // Success state
  if (currentStep === 'success') {
    return (
      <div className='text-center py-8'>
        <div className='mb-6'>
          <div className='w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
            <CheckCircle className='w-10 h-10 text-green-600' />
          </div>
          <h3 className='text-2xl font-bold text-green-900 mb-2'>
            Payment Successful!
          </h3>
          <p className='text-green-700 mb-4'>
            Your reservation has been created and payment processed
            successfully.
          </p>
        </div>

        <div className='bg-green-50 border border-green-200 rounded-lg p-4'>
          <p className='text-sm text-green-700'>
            🎉 Redirecting to confirmation page...
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      {/* Payment Amount Summary */}
      <div className='bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200'>
        <div className='flex justify-between items-center mb-4'>
          <div>
            <h3 className='text-xl font-bold text-blue-900'>
              {reservationData.service.name}
            </h3>
            <p className='text-sm text-blue-700'>
              {reservationData.clientInfo?.name}
            </p>
          </div>
          <div className='text-right'>
            <div className='text-3xl font-bold text-blue-900'>
              ${reservationData.totalPrice.toFixed(2)}
            </div>
            <p className='text-sm text-blue-600'>Total Amount</p>
          </div>
        </div>
      </div>

      {/* Client Information Display */}
      <div className='bg-gray-50 p-4 rounded-lg'>
        <h4 className='font-medium text-gray-900 mb-3'>Billing Information</h4>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-3 text-sm'>
          <div>
            <span className='text-gray-600'>Name:</span>
            <span className='ml-2 text-gray-900'>
              {reservationData.clientInfo?.name}
            </span>
          </div>
          <div>
            <span className='text-gray-600'>Email:</span>
            <span className='ml-2 text-gray-900'>
              {reservationData.clientInfo?.email}
            </span>
          </div>
          <div className='md:col-span-2'>
            <span className='text-gray-600'>Phone:</span>
            <span className='ml-2 text-gray-900'>
              {reservationData.clientInfo?.phone}
            </span>
          </div>
        </div>
      </div>

      {/* Card Input */}
      <div className='space-y-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-3'>
            <CreditCard className='inline w-4 h-4 mr-2' />
            Card Information
          </label>
          <div className='border border-gray-300 rounded-lg p-4 bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all'>
            <CardElement options={cardElementOptions} />
          </div>
          <p className='text-xs text-gray-500 mt-2'>
            Test card: 4242 4242 4242 4242, any future date, any 3-digit CVC
          </p>
        </div>
      </div>

      {/* Error Display */}
      {paymentError && (
        <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
          <div className='flex items-start'>
            <AlertCircle className='w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0' />
            <div className='flex-grow'>
              <h4 className='font-medium text-red-800 mb-1'>Payment Error</h4>
              <p className='text-sm text-red-700'>{paymentError}</p>
              <button
                type='button'
                onClick={() => setPaymentError(null)}
                className='mt-2 text-sm text-red-600 hover:text-red-800 underline'
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Security Notice */}
      <div className='bg-green-50 border border-green-200 rounded-lg p-4'>
        <div className='flex items-start'>
          <Lock className='w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0' />
          <div>
            <h4 className='font-medium text-green-800 mb-1'>Secure Payment</h4>
            <p className='text-sm text-green-700'>
              Your payment information is encrypted and secure. This transaction
              is processed by Stripe.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className='flex flex-col sm:flex-row gap-3 pt-4'>
        <button
          type='button'
          onClick={onClose}
          className='flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium'
          disabled={isProcessing}
        >
          Cancel
        </button>

        <button
          type='submit'
          disabled={!stripe || isProcessing}
          className={`
            flex-1 px-6 py-3 rounded-lg transition-colors flex items-center justify-center font-medium text-lg
            ${
              !stripe || isProcessing
                ? 'bg-green-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
            } text-white
          `}
        >
          {isProcessing ? (
            <>
              <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
              {currentStep === 'processing'
                ? 'Processing Payment...'
                : 'Creating Reservation...'}
            </>
          ) : (
            <>
              <Lock className='w-4 h-4 mr-2' />
              Pay ${reservationData.totalPrice.toFixed(2)}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default PaymentForm;
