'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  CreditCard,
  Lock,
  AlertCircle,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import type { ReservationData } from '@/context/BookingContext';

// Stripe.js global type
declare global {
  interface Window {
    Stripe?: any;
  }
}

interface StripePaymentFormProps {
  reservationData: ReservationData;
  onSuccess: (reservation: any) => void;
  onError: (error: string) => void;
  onClose: () => void;
}

const StripePaymentForm: React.FC<StripePaymentFormProps> = ({
  reservationData,
  onSuccess,
  onError,
  onClose,
}) => {
  // ========================
  // STATES
  // ========================
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [cardReady, setCardReady] = useState(false);
  const [currentStep, setCurrentStep] = useState<'ready' | 'processing' | 'success'>('ready');

  // ========================
  // REFS
  // ========================
  const stripeRef = useRef<any>(null);
  const cardElementRef = useRef<any>(null);
  const isMountedRef = useRef(true);
  const initAttemptedRef = useRef(false);

  // ========================
  // CONFIGURATION
  // ========================
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  const isProduction = publishableKey?.startsWith('pk_live_');

  // ========================
  // CLEANUP
  // ========================
  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
      if (cardElementRef.current) {
        try {
          cardElementRef.current.destroy();
          console.log('🧹 Stripe card element destroyed');
        } catch {
          console.log('Stripe card element already destroyed');
        }
      }
    };
  }, []);

  // ========================
  // LOAD STRIPE.JS SDK
  // ========================
  useEffect(() => {
    if (!publishableKey) {
      setPaymentError('Stripe configuration is missing');
      return;
    }

    if (window.Stripe) {
      console.log('✅ Stripe SDK already loaded');
      setSdkLoaded(true);
      return;
    }

    if (document.getElementById('stripe-sdk-script')) {
      console.log('✅ Stripe SDK script already in DOM');
      return;
    }

    console.log('📥 Loading Stripe.js SDK...');
    console.log(`🔧 Environment: ${isProduction ? 'PRODUCTION 🚨' : 'TEST 🧪'}`);

    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/';
    script.id = 'stripe-sdk-script';
    script.async = true;

    script.onload = () => {
      if (!isMountedRef.current) return;
      console.log('✅ Stripe SDK loaded successfully');
      setSdkLoaded(true);
    };

    script.onerror = () => {
      if (!isMountedRef.current) return;
      console.error('❌ Failed to load Stripe SDK');
      setPaymentError('Failed to load payment system');
    };

    document.body.appendChild(script);
  }, [publishableKey, isProduction]);

  // ========================
  // INITIALIZE STRIPE ELEMENTS
  // ========================
  const initializeStripeCard = useCallback(async () => {
    if (initAttemptedRef.current) {
      console.log('⚠️ Stripe card initialization already attempted');
      return;
    }

    if (!sdkLoaded || !window.Stripe || !publishableKey) {
      console.log('⚠️ Stripe SDK not ready yet');
      return;
    }

    const container = document.getElementById('stripe-card-container');
    if (!container) {
      console.log('⚠️ Stripe card container not found');
      return;
    }

    initAttemptedRef.current = true;

    try {
      console.log('🔧 Initializing Stripe Elements...');

      stripeRef.current = window.Stripe(publishableKey);
      const elements = stripeRef.current.elements();

      const card = elements.create('card', {
        style: {
          base: {
            fontSize: '16px',
            color: '#374151',
            fontFamily: 'ui-sans-serif, system-ui, sans-serif',
            '::placeholder': { color: '#9CA3AF' },
          },
          invalid: {
            color: '#DC2626',
            iconColor: '#DC2626',
          },
        },
      });

      card.mount('#stripe-card-container');
      cardElementRef.current = card;
      console.log('✅ Stripe card element mounted');

      card.on('ready', () => {
        if (isMountedRef.current) {
          setCardReady(true);
          console.log('🎉 Stripe card element ready!');
        }
      });

      card.on('change', (event: any) => {
        if (event.error) {
          setPaymentError(event.error.message);
        } else {
          setPaymentError(null);
        }
      });
    } catch (error) {
      if (!isMountedRef.current) return;

      console.error('❌ Error initializing Stripe Elements:', error);
      setPaymentError(
        error instanceof Error ? error.message : 'Failed to initialize payment form'
      );
      initAttemptedRef.current = false;
    }
  }, [sdkLoaded, publishableKey]);

  // ========================
  // RUN INITIALIZATION
  // ========================
  useEffect(() => {
    if (sdkLoaded) {
      const timer = setTimeout(() => {
        initializeStripeCard();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [sdkLoaded, initializeStripeCard]);

  // ========================
  // HANDLE PAYMENT SUBMIT
  // ========================
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripeRef.current || !cardElementRef.current) {
      setPaymentError('Payment system not ready');
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);
    setCurrentStep('processing');

    try {
      console.log('💳 Creating Stripe PaymentMethod...');
      if (isProduction) {
        console.log('🚨 PRODUCTION PAYMENT - Real money will be charged');
      }

      const { paymentMethod, error } = await stripeRef.current.createPaymentMethod({
        type: 'card',
        card: cardElementRef.current,
        billing_details: {
          name: reservationData.clientInfo?.name,
          email: reservationData.clientInfo?.email,
          phone: reservationData.clientInfo?.phone,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      console.log('✅ PaymentMethod created:', paymentMethod.id);

      const response = await fetch('/api/payments/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
          reservationData,
          amount: Math.round(reservationData.totalPrice * 100),
          currency: 'USD',
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.message || 'Payment failed');
      }

      if (result.success) {
        console.log('✅ Payment and reservation created successfully');
        if (isProduction) {
          console.log('💰 REAL PAYMENT COMPLETED');
          console.log(`Amount charged: $${reservationData.totalPrice.toFixed(2)}`);
        }

        setCurrentStep('success');
        setTimeout(() => {
          onSuccess(result.reservation);
        }, 1500);
      } else {
        throw new Error('Failed to create reservation after payment');
      }
    } catch (error) {
      console.error('❌ Stripe payment error:', error);

      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred';

      setCurrentStep('ready');
      setPaymentError(errorMessage);
      onError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  // ========================
  // GUARDS
  // ========================
  if (!reservationData.clientInfo) {
    onError('Client information is required');
    return null;
  }

  if (!publishableKey) {
    return (
      <div className='flex items-center justify-center p-8'>
        <div className='text-center'>
          <AlertCircle className='w-12 h-12 text-red-600 mx-auto mb-4' />
          <h3 className='text-xl font-bold text-red-900 mb-2'>Configuration Error</h3>
          <p className='text-red-700 mb-4'>
            Stripe payment system is not properly configured.
          </p>
          <button
            onClick={onClose}
            className='px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700'
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  // ========================
  // SUCCESS STATE
  // ========================
  if (currentStep === 'success') {
    return (
      <div className='text-center py-8'>
        <div className='mb-6'>
          <div className='w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
            <CheckCircle className='w-10 h-10 text-green-600' />
          </div>
          <h3 className='text-2xl font-bold text-green-900 mb-2'>Payment Successful!</h3>
          <p className='text-green-700 mb-4'>
            Your reservation has been created and payment processed successfully.
          </p>
          {isProduction && (
            <div className='bg-green-50 border border-green-200 rounded-lg p-3 mb-4'>
              <p className='text-sm text-green-800 font-semibold'>
                💰 Payment Charged: ${reservationData.totalPrice.toFixed(2)}
              </p>
              <p className='text-xs text-green-700'>
                Receipt will be sent to {reservationData.clientInfo.email}
              </p>
            </div>
          )}
        </div>

        <div className='bg-green-50 border border-green-200 rounded-lg p-4'>
          <p className='text-sm text-green-700'>🎉 Redirecting to confirmation page...</p>
        </div>
      </div>
    );
  }

  // ========================
  // MAIN RENDER
  // ========================
  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='text-center'>
        <h3 className='text-2xl font-bold text-gray-900 mb-2'>Enter Payment Details</h3>
        <p className='text-gray-600'>
          Total:{' '}
          <span className='font-bold text-green-600'>
            ${reservationData.totalPrice.toFixed(2)}
          </span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* Card Input */}
        <div className='space-y-4'>
          <label className='block text-sm font-medium text-gray-700 mb-3'>
            <CreditCard className='inline w-4 h-4 mr-2' />
            Card Information
          </label>

          {/* Stripe Card Container - always rendered */}
          <div className='relative'>
            <div
              id='stripe-card-container'
              className='border rounded-lg p-4 bg-white border-gray-300 min-h-[60px] flex items-center'
            />

            {/* Card loading overlay */}
            {!cardReady && sdkLoaded && (
              <div className='absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 rounded-lg'>
                <div className='text-center'>
                  <Loader2 className='w-6 h-6 animate-spin text-blue-600 mx-auto mb-2' />
                  <p className='text-xs text-gray-600'>Initializing payment form...</p>
                </div>
              </div>
            )}

            {/* SDK loading overlay */}
            {!sdkLoaded && (
              <div className='absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 rounded-lg'>
                <div className='text-center'>
                  <Loader2 className='w-6 h-6 animate-spin text-blue-600 mx-auto mb-2' />
                  <p className='text-xs text-gray-600'>Loading payment system...</p>
                </div>
              </div>
            )}
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
                    onClick={() => {
                      setPaymentError(null);
                      initAttemptedRef.current = false;
                      initializeStripeCard();
                    }}
                    className='mt-2 text-sm text-red-600 hover:text-red-800 underline'
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Security Notice */}
        <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
          <div className='flex items-start'>
            <Lock className='w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0' />
            <div>
              <h4 className='font-medium text-blue-800 mb-1'>Secure Payment</h4>
              <p className='text-sm text-blue-700'>
                Your payment is secured by PCI-compliant encryption and processed by Stripe.
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
            disabled={!cardReady || isProcessing}
            className={`
              flex-1 px-6 py-3 rounded-lg transition-colors flex items-center justify-center font-medium text-lg
              ${!cardReady || isProcessing
                ? 'bg-gray-400 cursor-not-allowed text-white'
                : isProduction
                ? 'bg-indigo-700 hover:bg-indigo-800 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }
            `}
          >
            {isProcessing ? (
              <>
                <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                Processing Payment...
              </>
            ) : !cardReady ? (
              <>
                <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                Loading...
              </>
            ) : (
              <>
                <Lock className='w-4 h-4 mr-2' />
                {isProduction ? '💰 ' : ''}
                Complete Payment ${reservationData.totalPrice.toFixed(2)}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StripePaymentForm;
