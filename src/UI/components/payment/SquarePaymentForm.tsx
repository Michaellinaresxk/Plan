'use client';

import React, { useState, useEffect, useRef } from 'react';
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

const SquarePaymentForm: React.FC<SquarePaymentFormProps> = ({
  reservationData,
  onSuccess,
  onError,
  onClose,
}) => {
  // Estados
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [isSquareLoaded, setIsSquareLoaded] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [card, setCard] = useState<any>(null);
  const [payments, setPayments] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState<
    'ready' | 'processing' | 'success'
  >('ready');

  // Refs
  const isMountedRef = useRef(true);
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const initializationAttempted = useRef(false);
  const squareScriptLoaded = useRef(false);

  // Configuración de Square (desde variables de entorno)
  const applicationId = process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID;
  const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID;

  // 🔧 DETECCIÓN AUTOMÁTICA DE AMBIENTE
  const detectEnvironment = () => {
    if (!applicationId) return { isProduction: false, isSandbox: false };

    const isSandbox = applicationId.startsWith('sandbox-');
    const isProduction =
      applicationId.startsWith('sq0idp-') ||
      applicationId.startsWith('sq0idb-');

    return { isProduction, isSandbox };
  };

  const { isProduction, isSandbox } = detectEnvironment();

  // Determinar la URL correcta del SDK
  const getSquareSDKUrl = () => {
    if (isProduction) {
      console.log('🚨 PRODUCTION MODE - Real payments will be processed!');
      return 'https://web.squarecdn.com/v1/square.js';
    } else if (isSandbox) {
      console.log('🧪 SANDBOX MODE - Test payments only');
      return 'https://sandbox.web.squarecdn.com/v1/square.js';
    } else {
      console.error('❌ Invalid Application ID format');
      return null;
    }
  };

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (card) {
        try {
          card.destroy();
          console.log('🧹 Card instance destroyed');
        } catch (e) {
          console.log('Card already destroyed or not initialized');
        }
      }
    };
  }, [card]);

  // 🔧 FIX: Esperar a que el elemento esté en el DOM con mejor lógica
  const waitForCardContainer = (): Promise<HTMLElement> => {
    return new Promise((resolve, reject) => {
      console.log('⏳ Waiting for card container...');

      // Timeout máximo de 5 segundos
      const timeout = setTimeout(() => {
        reject(
          new Error('Card container element not found in DOM after 5 seconds')
        );
      }, 5000);

      // Función para verificar el elemento
      const checkElement = () => {
        // Primero intentar con el ref
        if (cardContainerRef.current) {
          console.log('✅ Card container found via ref');
          clearTimeout(timeout);
          resolve(cardContainerRef.current);
          return true;
        }

        // Luego intentar con getElementById
        const element = document.getElementById('card-container');
        if (element) {
          console.log('✅ Card container found via getElementById');
          clearTimeout(timeout);
          resolve(element);
          return true;
        }

        return false;
      };

      // Verificar inmediatamente
      if (checkElement()) return;

      // Si no existe, usar MutationObserver
      console.log('👀 Setting up MutationObserver...');
      const observer = new MutationObserver((mutations) => {
        if (checkElement()) {
          observer.disconnect();
        }
      });

      // Observar cambios en el body
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      // También intentar con requestAnimationFrame
      const rafCheck = () => {
        if (!checkElement()) {
          requestAnimationFrame(rafCheck);
        } else {
          observer.disconnect();
        }
      };
      requestAnimationFrame(rafCheck);
    });
  };

  // Cargar Square Web Payments SDK
  useEffect(() => {
    if (!applicationId || !locationId) {
      setPaymentError(
        'Square configuration is missing. Please contact support.'
      );
      setIsInitializing(false);
      return;
    }

    const sdkUrl = getSquareSDKUrl();
    if (!sdkUrl) {
      setPaymentError(
        'Invalid Square Application ID format. Must start with "sandbox-" or "sq0idp-" or "sq0idb-"'
      );
      setIsInitializing(false);
      return;
    }

    const loadSquareScript = async () => {
      try {
        // Verificar si Square ya está cargado
        if (window.Square && squareScriptLoaded.current) {
          console.log('✅ Square SDK already loaded, initializing...');
          await initializeSquare();
          return;
        }

        console.log('📥 Loading Square Web Payments SDK...');
        console.log(
          `🔧 Environment: ${isProduction ? 'PRODUCTION 🚨' : 'SANDBOX 🧪'}`
        );
        console.log(`🔧 SDK URL: ${sdkUrl}`);

        const script = document.createElement('script');
        script.src = sdkUrl;
        script.async = true;
        script.id = 'square-sdk-script';

        script.onload = async () => {
          if (!isMountedRef.current) return;

          console.log('✅ Square SDK script loaded successfully');
          squareScriptLoaded.current = true;

          if (isProduction) {
            console.log('🚨🚨🚨 PRODUCTION MODE ACTIVE 🚨🚨🚨');
            console.log('💰 REAL MONEY WILL BE CHARGED!');
          }

          // Pequeño delay para asegurar que el SDK esté completamente listo
          await new Promise((resolve) => setTimeout(resolve, 100));

          await initializeSquare();
        };

        script.onerror = (error) => {
          if (!isMountedRef.current) return;
          console.error('❌ Failed to load Square SDK:', error);
          setPaymentError(
            'Failed to load payment system. Please refresh the page.'
          );
          setIsInitializing(false);
        };

        document.body.appendChild(script);
      } catch (error) {
        if (!isMountedRef.current) return;
        console.error('❌ Error loading Square SDK:', error);
        setPaymentError('Failed to initialize payment system.');
        setIsInitializing(false);
      }
    };

    loadSquareScript();

    // Cleanup
    return () => {
      const existingScript = document.getElementById('square-sdk-script');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [applicationId, locationId]);

  // Inicializar Square Payments
  const initializeSquare = async () => {
    // Evitar inicialización múltiple
    if (initializationAttempted.current) {
      console.log('⚠️ Square initialization already attempted');
      return;
    }

    initializationAttempted.current = true;

    if (!isMountedRef.current) {
      console.log('⚠️ Component unmounted, skipping initialization');
      return;
    }

    try {
      if (!window.Square) {
        throw new Error('Square SDK not loaded');
      }

      console.log('🔧 Initializing Square Payments...');
      console.log(`🔧 Application ID: ${applicationId}`);
      console.log(`🔧 Location ID: ${locationId}`);
      console.log(
        `🔧 Environment: ${isProduction ? 'PRODUCTION 🚨' : 'SANDBOX 🧪'}`
      );

      // 🔧 FIX: Esperar a que el elemento exista
      console.log('⏳ Waiting for card container element...');
      const cardContainer = await waitForCardContainer();

      if (!isMountedRef.current) {
        console.log('⚠️ Component unmounted during wait, aborting');
        return;
      }

      console.log('✅ Card container element ready:', cardContainer.id);

      // Inicializar payments instance
      const paymentsInstance = window.Square.payments(
        applicationId,
        locationId
      );

      if (!isMountedRef.current) return;
      setPayments(paymentsInstance);
      console.log('✅ Payments instance created');

      // Inicializar Card
      console.log('🔧 Creating card instance...');
      const cardInstance = await paymentsInstance.card();

      if (!isMountedRef.current) return;
      console.log('✅ Card instance created');

      // Attach card to container
      console.log('🔧 Attaching card to container...');
      await cardInstance.attach('#card-container');

      if (!isMountedRef.current) return;
      console.log('✅ Card attached to container');

      setCard(cardInstance);
      setIsSquareLoaded(true);
      setIsInitializing(false);

      console.log('🎉 Square Card initialized successfully!');
      if (isProduction) {
        console.log('⚠️ PRODUCTION MODE: Real payments will be processed');
      }
    } catch (error) {
      if (!isMountedRef.current) return;

      console.error('❌ Error initializing Square:', error);

      let errorMessage = 'Failed to initialize payment form. ';

      if (error instanceof Error) {
        if (error.message.includes('not found in DOM')) {
          errorMessage +=
            'The payment form container is not ready. Please try again.';
        } else {
          errorMessage += error.message;
        }
      }

      setPaymentError(errorMessage);
      setIsInitializing(false);
      initializationAttempted.current = false; // Permitir reintento
    }
  };

  // Validación inicial
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

  // Loading/Initializing state
  if (isInitializing || !isSquareLoaded) {
    return (
      <div className='flex items-center justify-center p-8'>
        <div className='text-center'>
          <Loader2 className='w-8 h-8 animate-spin text-blue-600 mx-auto mb-4' />
          <p className='text-gray-600 mb-2'>
            {isInitializing
              ? 'Initializing payment system...'
              : 'Loading payment system...'}
          </p>
          <p className='text-xs text-gray-500'>
            {isInitializing
              ? 'Setting up secure connection...'
              : 'Please wait...'}
          </p>
          {isProduction && (
            <div className='mt-4 p-4 bg-red-50 border-2 border-red-300 rounded-lg'>
              <div className='flex items-center justify-center mb-2'>
                <AlertTriangle className='w-6 h-6 text-red-600 mr-2' />
                <p className='text-sm font-bold text-red-900'>
                  PRODUCTION MODE ACTIVE
                </p>
              </div>
              <p className='text-xs text-red-800 font-semibold'>
                💰 Real money will be charged!
              </p>
              <p className='text-xs text-red-700 mt-1'>
                This is not a test payment
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Error state
  if (paymentError && !isSquareLoaded) {
    return (
      <div className='flex items-center justify-center p-8'>
        <div className='text-center max-w-md'>
          <AlertCircle className='w-12 h-12 text-red-600 mx-auto mb-4' />
          <h3 className='text-xl font-bold text-red-900 mb-2'>
            Initialization Error
          </h3>
          <p className='text-red-700 mb-4'>{paymentError}</p>
          <div className='space-y-2'>
            <button
              onClick={() => {
                setPaymentError(null);
                setIsInitializing(true);
                initializationAttempted.current = false;
                initializeSquare();
              }}
              className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full'
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.reload()}
              className='px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 w-full'
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Manejar el submit del formulario
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!card || !payments) {
      setPaymentError('Payment system not ready');
      return;
    }

    // Confirmación adicional en producción
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

      const tokenResult = await card.tokenize();

      if (tokenResult.status === 'OK') {
        console.log('✅ Card tokenized successfully');
        console.log('🔐 Token:', tokenResult.token);

        if (isProduction) {
          console.log('💰 Processing REAL payment...');
        }

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

          {/* Square Card Container */}
          <div
            id='card-container'
            ref={cardContainerRef}
            className='border rounded-lg p-4 bg-white border-gray-300 min-h-[120px]'
            style={{ minHeight: '120px' }}
          />

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
                      window.location.reload();
                    }}
                    className='mt-2 text-sm text-red-600 hover:text-red-800 underline'
                  >
                    Refresh Page
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
            disabled={!isSquareLoaded || isProcessing}
            className={`
              flex-1 px-6 py-3 rounded-lg transition-colors flex items-center justify-center font-medium text-lg
              ${
                !isSquareLoaded || isProcessing
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
            ) : !isSquareLoaded ? (
              'Loading Square...'
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
