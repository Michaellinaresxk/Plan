'use client';

import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import {
  CreditCard,
  Lock,
  AlertCircle,
  CheckCircle,
  Loader2,
} from 'lucide-react';
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
      fontFamily: '"Inter", "Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      '::placeholder': {
        color: '#9CA3AF',
      },
    },
    invalid: {
      color: '#EF4444',
      iconColor: '#EF4444',
    },
  },
  hidePostalCode: false,
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

  // Estados del formulario
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [cardReady, setCardReady] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<
    'ready' | 'processing' | 'success'
  >('ready');

  // Handlers para el CardElement
  const handleCardReady = () => {
    console.log('✅ Card Element ready');
    setCardReady(true);
  };

  const handleCardChange = (event: any) => {
    if (event.error) {
      setCardError(event.error.message);
      console.error('❌ Card error:', event.error.message);
    } else {
      setCardError(null);
    }
  };

  // Loading state si Stripe no está listo
  if (!stripe || !elements) {
    return (
      <div className='flex items-center justify-center p-8'>
        <div className='text-center'>
          <Loader2 className='w-8 h-8 animate-spin text-blue-600 mx-auto mb-4' />
          <p className='text-gray-600 mb-2'>Loading payment system...</p>
          <p className='text-xs text-gray-500'>
            Initializing secure connection...
          </p>
        </div>
      </div>
    );
  }

  // Validación inicial
  if (!reservationData.clientInfo) {
    onError('Client information is required');
    return null;
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      console.error('❌ Stripe not loaded');
      onError('Payment system not ready. Please refresh the page.');
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

      console.log('💳 Creating NEW payment intent...');

      // 🔥 SOLUCIÓN: Generar ID único cada vez
      const uniqueId = `${Date.now()}_${Math.random()
        .toString(36)
        .substring(2)}`;

      const paymentIntentData = {
        reservationId: `temp_${Date.now()}`, // ✅ Esto está bien
        amount: Math.round(reservationData.totalPrice * 100),
        currency: 'usd',
        metadata: {
          serviceName: reservationData.service.name,
          clientEmail: reservationData.clientInfo.email,
          clientName: reservationData.clientInfo.name,
          timestamp: new Date().toISOString(), // ✅ Timestamp único
          uniqueId: uniqueId, // ✅ ID adicional para debug
        },
      };

      // Crear Payment Intent FRESCO
      const paymentIntent = await createPaymentIntent(paymentIntentData);

      console.log(
        '💳 Fresh payment intent created:',
        paymentIntent.paymentIntentId
      );
      console.log(
        '💳 Client secret:',
        paymentIntent.clientSecret.substring(0, 20) + '...'
      );

      // Verificar que el client secret es nuevo
      if (!paymentIntent.clientSecret || !paymentIntent.paymentIntentId) {
        throw new Error('Invalid payment intent response');
      }

      console.log('💳 Confirming payment...');

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
        // 🔥 MEJOR MANEJO DE ERRORES
        console.error('❌ Stripe error:', error);

        if (error.message?.includes('No such payment_intent')) {
          throw new Error(
            'Payment expired. Please try again with a new payment.'
          );
        }

        throw new Error(error.message || 'Payment failed');
      }

      if (confirmedPayment?.status === 'succeeded') {
        console.log('✅ Payment confirmed, creating reservation...');

        const result = await processCompletePayment({
          reservationData,
          paymentMethodId: confirmedPayment.payment_method as string,
          clientSecret: paymentIntent.clientSecret,
        });

        if (result.success) {
          console.log('✅ Reservation created successfully');
          setCurrentStep('success');

          setTimeout(() => {
            onSuccess(result.reservation);
          }, 1500);
        } else {
          throw new Error('Failed to create reservation after payment');
        }
      } else {
        throw new Error(
          `Payment status: ${confirmedPayment?.status}. Expected: succeeded`
        );
      }
    } catch (error) {
      console.error('❌ Payment process error:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred';

      // 🔥 RESET ESTADO EN ERROR
      setCurrentStep('ready');
      setPaymentError(errorMessage);
      onError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };
  // Success state (inline success message)
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
    <div className='space-y-6'>
      {/* Simple Header - NO MORE SUMMARY */}
      <div className='text-center'>
        <h3 className='text-2xl font-bold text-gray-900 mb-2'>
          Enter Payment Details
        </h3>
        <p className='text-gray-600'>
          Total:{' '}
          <span className='font-bold text-green-600'>
            ${reservationData.totalPrice.toFixed(2)}
          </span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* Card Input Section */}
        <div className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-3'>
              <CreditCard className='inline w-4 h-4 mr-2' />
              Card Information
              {!cardReady && (
                <span className='text-orange-500 ml-2'>(Loading...)</span>
              )}
            </label>

            <div
              className={`
                border rounded-lg p-4 bg-white transition-all
                ${
                  cardError
                    ? 'border-red-300 ring-2 ring-red-100'
                    : 'border-gray-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500'
                }
              `}
            >
              <CardElement
                options={cardElementOptions}
                onReady={handleCardReady}
                onChange={handleCardChange}
              />
            </div>

            {cardError && (
              <p className='mt-2 text-sm text-red-600 flex items-center'>
                <AlertCircle className='w-4 h-4 mr-1' />
                {cardError}
              </p>
            )}
          </div>
        </div>

        {/* Payment Error */}
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
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Security Notice */}
        <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
          <div className='flex items-start'>
            <Lock className='w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0' />
            <div>
              <h4 className='font-medium text-blue-800 mb-1'>Secure Payment</h4>
              <p className='text-sm text-blue-700'>
                Your payment is secured by 256-bit SSL encryption and processed
                by Stripe.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex flex-col sm:flex-row gap-3 pt-6'>
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
            disabled={!stripe || !cardReady || isProcessing}
            className={`
              flex-1 px-6 py-3 rounded-lg transition-colors flex items-center justify-center font-medium text-lg
              ${
                !stripe || !cardReady || isProcessing
                  ? 'bg-gray-400 cursor-not-allowed text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }
            `}
          >
            {isProcessing ? (
              <>
                <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                {currentStep === 'processing'
                  ? 'Processing Payment...'
                  : 'Creating Reservation...'}
              </>
            ) : !stripe ? (
              'Loading Stripe...'
            ) : !cardReady ? (
              'Loading Card...'
            ) : (
              <>
                <Lock className='w-4 h-4 mr-2' />
                Complete Payment ${reservationData.totalPrice.toFixed(2)}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;
