'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  CreditCard,
  Lock,
  AlertCircle,
  CheckCircle,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import type { ReservationData } from '@/context/BookingContext';

// Tipos de Square Web Payments SDK
declare global {
  interface Window {
    Square?: any;
  }
}

interface SquarePaymentFormProps {
  reservationData: ReservationData;
  onSuccess: (reservation: any) => void;
  onError: (error: string) => void;
  onClose: () => void;
}

/**
 * 🎯 ARQUITECTURA MEJORADA
 *
 * Cambios principales:
 * 1. El card-container SIEMPRE se renderiza (no condicionalmente)
 * 2. Estados separados para SDK loading vs Card initialization
 * 3. useEffect separado para inicialización solo cuando el DOM está listo
 * 4. Cleanup mejorado y sin memory leaks
 */
const SquarePaymentForm: React.FC<SquarePaymentFormProps> = ({
  reservationData,
  onSuccess,
  onError,
  onClose,
}) => {
  // ========================
  // ESTADOS
  // ========================
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [cardReady, setCardReady] = useState(false);
  const [currentStep, setCurrentStep] = useState<
    'ready' | 'processing' | 'success'
  >('ready');

  // ========================
  // REFS
  // ========================
  const cardInstanceRef = useRef<any>(null);
  const paymentsInstanceRef = useRef<any>(null);
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const initAttemptedRef = useRef(false);
  const isMountedRef = useRef(true);

  // ========================
  // CONFIGURACIÓN
  // ========================
  const applicationId = process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID;
  const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID;

  // Detección de ambiente
  const isProduction =
    applicationId?.startsWith('sq0idp-') ||
    applicationId?.startsWith('sq0idb-');
  const isSandbox = applicationId?.startsWith('sandbox-');

  const getSquareSDKUrl = () => {
    if (isProduction) return 'https://web.squarecdn.com/v1/square.js';
    if (isSandbox) return 'https://sandbox.web.squarecdn.com/v1/square.js';
    return null;
  };

  // ========================
  // CLEANUP
  // ========================
  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;

      // Destroy card instance
      if (cardInstanceRef.current) {
        try {
          cardInstanceRef.current.destroy();
          console.log('🧹 Card instance destroyed');
        } catch (e) {
          console.log('Card instance already destroyed');
        }
      }
    };
  }, []);

  // ========================
  // CARGAR SQUARE SDK
  // ========================
  useEffect(() => {
    if (!applicationId || !locationId) {
      setPaymentError('Square configuration is missing');
      return;
    }

    const sdkUrl = getSquareSDKUrl();
    if (!sdkUrl) {
      setPaymentError('Invalid Square Application ID format');
      return;
    }

    // Si ya está cargado, no hacer nada
    if (window.Square) {
      console.log('✅ Square SDK already loaded');
      setSdkLoaded(true);
      return;
    }

    // Verificar si el script ya existe
    if (document.getElementById('square-sdk-script')) {
      console.log('✅ Square SDK script already in DOM');
      return;
    }

    console.log('📥 Loading Square SDK...');
    console.log(
      `🔧 Environment: ${isProduction ? 'PRODUCTION 🚨' : 'SANDBOX 🧪'}`
    );

    const script = document.createElement('script');
    script.src = sdkUrl;
    script.id = 'square-sdk-script';
    script.async = true;

    script.onload = () => {
      if (!isMountedRef.current) return;

      console.log('✅ Square SDK loaded successfully');
      if (isProduction) {
        console.log('🚨 PRODUCTION MODE - Real payments will be charged!');
      }

      setSdkLoaded(true);
    };

    script.onerror = () => {
      if (!isMountedRef.current) return;

      console.error('❌ Failed to load Square SDK');
      setPaymentError('Failed to load payment system');
    };

    document.body.appendChild(script);

    return () => {
      // No remover el script en cleanup - puede ser reutilizado
    };
  }, [applicationId, locationId, isProduction]);

  // ========================
  // INICIALIZAR SQUARE CARD
  // ========================
  const initializeSquareCard = useCallback(async () => {
    // Evitar múltiples inicializaciones
    if (initAttemptedRef.current) {
      console.log('⚠️ Card initialization already attempted');
      return;
    }

    if (!sdkLoaded || !window.Square) {
      console.log('⚠️ Square SDK not ready yet');
      return;
    }

    if (!cardContainerRef.current) {
      console.log('⚠️ Card container ref not ready');
      return;
    }

    initAttemptedRef.current = true;

    try {
      console.log('🔧 Initializing Square Card...');
      console.log(`🔧 Application ID: ${applicationId}`);
      console.log(`🔧 Location ID: ${locationId}`);

      // 1. Crear payments instance
      const payments = window.Square.payments(applicationId, locationId);
      paymentsInstanceRef.current = payments;
      console.log('✅ Payments instance created');

      // 2. Crear card instance
      const card = await payments.card();
      cardInstanceRef.current = card;
      console.log('✅ Card instance created');

      // 3. Attach al contenedor
      await card.attach('#card-container');
      console.log('✅ Card attached to container');

      if (!isMountedRef.current) return;

      setCardReady(true);
      console.log('🎉 Square Card initialized successfully!');
    } catch (error) {
      if (!isMountedRef.current) return;

      console.error('❌ Error initializing Square Card:', error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to initialize payment form';

      setPaymentError(errorMessage);
      initAttemptedRef.current = false; // Permitir reintento
    }
  }, [sdkLoaded, applicationId, locationId]);

  // ========================
  // EJECUTAR INICIALIZACIÓN
  // ========================
  useEffect(() => {
    // Solo inicializar cuando el SDK esté cargado y el contenedor exista
    if (sdkLoaded && cardContainerRef.current) {
      // Pequeño delay para asegurar que el DOM está completamente listo
      const timer = setTimeout(() => {
        initializeSquareCard();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [sdkLoaded, initializeSquareCard]);

  // ========================
  // HANDLE PAYMENT SUBMIT
  // ========================
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!cardInstanceRef.current || !paymentsInstanceRef.current) {
      setPaymentError('Payment system not ready');
      return;
    }

    // Confirmación en producción
    if (isProduction) {
      const confirmed = window.confirm(
        '🚨 PRODUCTION MODE\n\n' +
          'You are about to process a REAL payment.\n' +
          `Amount: $${reservationData.totalPrice.toFixed(2)}\n\n` +
          'Real money will be charged to this card.\n\n' +
          'Do you want to continue?'
      );

      if (!confirmed) {
        console.log('❌ Payment cancelled by user');
        return;
      }
    }

    setIsProcessing(true);
    setPaymentError(null);
    setCurrentStep('processing');

    try {
      console.log('💳 Tokenizing card...');
      if (isProduction) {
        console.log('🚨 PRODUCTION PAYMENT - Real money will be charged');
      }

      const tokenResult = await cardInstanceRef.current.tokenize();

      if (tokenResult.status === 'OK') {
        console.log('✅ Card tokenized successfully');

        const response = await fetch('/api/payments/process', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sourceId: tokenResult.token,
            reservationData: reservationData,
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
            console.log(
              `Amount charged: $${reservationData.totalPrice.toFixed(2)}`
            );
          }

          setCurrentStep('success');

          setTimeout(() => {
            onSuccess(result.reservation);
          }, 1500);
        } else {
          throw new Error('Failed to create reservation after payment');
        }
      } else {
        console.error('❌ Tokenization failed:', tokenResult.errors);

        let errorMessage = 'Failed to process card information';
        if (tokenResult.errors && tokenResult.errors.length > 0) {
          errorMessage = tokenResult.errors[0].message || errorMessage;
        }

        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('❌ Payment process error:', error);

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
  // VALIDACIONES INICIALES
  // ========================
  if (!reservationData.clientInfo) {
    onError('Client information is required');
    return null;
  }

  if (!applicationId || !locationId) {
    return (
      <div className='flex items-center justify-center p-8'>
        <div className='text-center'>
          <AlertCircle className='w-12 h-12 text-red-600 mx-auto mb-4' />
          <h3 className='text-xl font-bold text-red-900 mb-2'>
            Configuration Error
          </h3>
          <p className='text-red-700 mb-4'>
            Square payment system is not properly configured.
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
          <h3 className='text-2xl font-bold text-green-900 mb-2'>
            Payment Successful!
          </h3>
          <p className='text-green-700 mb-4'>
            Your reservation has been created and payment processed
            successfully.
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
          <p className='text-sm text-green-700'>
            🎉 Redirecting to confirmation page...
          </p>
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
        <h3 className='text-2xl font-bold text-gray-900 mb-2'>
          Enter Payment Details
        </h3>
        <p className='text-gray-600'>
          Total:{' '}
          <span className='font-bold text-green-600'>
            ${reservationData.totalPrice.toFixed(2)}
          </span>
        </p>
        {isProduction && (
          <div className='mt-3 p-3 bg-red-50 border-2 border-red-300 rounded-lg'>
            <div className='flex items-center justify-center mb-1'>
              <AlertTriangle className='w-5 h-5 text-red-600 mr-2' />
              <p className='text-sm font-bold text-red-900'>PRODUCTION MODE</p>
            </div>
            <p className='text-xs text-red-800 font-semibold'>
              💰 Real money will be charged!
            </p>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* Card Input Section */}
        <div className='space-y-4'>
          <label className='block text-sm font-medium text-gray-700 mb-3'>
            <CreditCard className='inline w-4 h-4 mr-2' />
            Card Information
          </label>

          {/* Square Card Container - SIEMPRE RENDERIZADO */}
          <div className='relative'>
            <div
              id='card-container'
              ref={cardContainerRef}
              className='border rounded-lg p-4 bg-white border-gray-300 min-h-[120px]'
            />

            {/* Loading overlay */}
            {!cardReady && sdkLoaded && (
              <div className='absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 rounded-lg'>
                <div className='text-center'>
                  <Loader2 className='w-6 h-6 animate-spin text-blue-600 mx-auto mb-2' />
                  <p className='text-xs text-gray-600'>
                    Initializing payment form...
                  </p>
                </div>
              </div>
            )}

            {/* SDK Loading overlay */}
            {!sdkLoaded && (
              <div className='absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 rounded-lg'>
                <div className='text-center'>
                  <Loader2 className='w-6 h-6 animate-spin text-blue-600 mx-auto mb-2' />
                  <p className='text-xs text-gray-600'>
                    Loading payment system...
                  </p>
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
                  <h4 className='font-medium text-red-800 mb-1'>
                    Payment Error
                  </h4>
                  <p className='text-sm text-red-700'>{paymentError}</p>
                  <button
                    type='button'
                    onClick={() => {
                      setPaymentError(null);
                      initAttemptedRef.current = false;
                      initializeSquareCard();
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
                Your payment is secured by PCI-compliant encryption and
                processed by Square.
              </p>
              {isProduction && (
                <p className='text-xs text-blue-600 mt-2 font-semibold'>
                  ⚠️ Production mode: Real charges will apply
                </p>
              )}
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
              ${
                !cardReady || isProcessing
                  ? 'bg-gray-400 cursor-not-allowed text-white'
                  : isProduction
                  ? 'bg-red-600 hover:bg-red-700 text-white'
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

export default SquarePaymentForm;
