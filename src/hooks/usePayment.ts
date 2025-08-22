// hooks/usePayment.ts - VERSION MEJORADA
'use client';

import { useState, useCallback } from 'react';

interface PaymentError {
  message: string;
  details?: string;
  code?: string;
}

export const usePayment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<PaymentError | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const createPaymentIntent = useCallback(
    async (data: {
      reservationId: string;
      amount: number;
      currency: string;
      metadata?: Record<string, any>;
    }) => {
      try {
        setIsLoading(true);
        setError(null);

        console.log('🎯 usePayment - Creating payment intent...');
        console.log('📝 Data:', data);

        // Validate data
        if (!data.reservationId || !data.amount || !data.currency) {
          throw new Error('Missing required fields for payment intent');
        }

        if (data.amount <= 0) {
          throw new Error('Amount must be greater than 0');
        }

        const response = await fetch('/api/payments/create-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        console.log('📡 Response status:', response.status);
        console.log(
          '📡 Response headers:',
          Object.fromEntries(response.headers.entries())
        );

        // Check if response is HTML (error page)
        const contentType = response.headers.get('content-type');
        if (contentType && !contentType.includes('application/json')) {
          console.error('❌ Response is not JSON, content-type:', contentType);
          const htmlText = await response.text();
          console.error(
            '❌ HTML Response (first 500 chars):',
            htmlText.substring(0, 500)
          );

          throw new Error(
            `API route returned HTML instead of JSON. This usually means the route doesn't exist or crashed. Status: ${response.status}`
          );
        }

        let result;
        try {
          result = await response.json();
        } catch (parseError) {
          console.error('❌ JSON Parse Error:', parseError);
          const textResponse = await response.text();
          console.error('❌ Raw response:', textResponse.substring(0, 500));
          throw new Error('Invalid JSON response from payment API');
        }

        if (!response.ok) {
          console.error('❌ API Error Response:', result);
          throw new Error(
            result.message ||
              result.error ||
              `HTTP ${response.status}: Failed to create payment intent`
          );
        }

        console.log('✅ Payment intent created successfully:', result);
        return result;
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Failed to create payment intent';
        console.error(
          '❌ usePayment - Error creating payment intent:',
          errorMessage
        );

        const paymentError: PaymentError = {
          message: errorMessage,
          details: error instanceof Error ? error.stack : undefined,
          code: 'PAYMENT_INTENT_ERROR',
        };

        setError(paymentError);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const processCompletePayment = useCallback(
    async (data: {
      reservationData: any;
      paymentMethodId: string;
      clientSecret: string;
    }) => {
      try {
        setIsLoading(true);
        setError(null);

        console.log('🎯 usePayment - Processing complete payment...');

        // Validate data
        if (
          !data.reservationData ||
          !data.paymentMethodId ||
          !data.clientSecret
        ) {
          throw new Error('Missing required fields for payment processing');
        }

        const response = await fetch('/api/payments/process', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        console.log('📡 Response status:', response.status);

        // Check if response is HTML (error page)
        const contentType = response.headers.get('content-type');
        if (contentType && !contentType.includes('application/json')) {
          console.error('❌ Response is not JSON, content-type:', contentType);
          const htmlText = await response.text();
          console.error(
            '❌ HTML Response (first 500 chars):',
            htmlText.substring(0, 500)
          );

          throw new Error(
            `API route returned HTML instead of JSON. This usually means the route doesn't exist or crashed. Status: ${response.status}`
          );
        }

        let result;
        try {
          result = await response.json();
        } catch (parseError) {
          console.error('❌ JSON Parse Error:', parseError);
          const textResponse = await response.text();
          console.error('❌ Raw response:', textResponse.substring(0, 500));
          throw new Error('Invalid JSON response from payment processing API');
        }

        if (!response.ok) {
          console.error('❌ API Error Response:', result);
          throw new Error(
            result.message ||
              result.error ||
              `HTTP ${response.status}: Failed to process payment`
          );
        }

        console.log('✅ Payment processed successfully:', result);
        return result;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to process payment';
        console.error(
          '❌ usePayment - Error processing payment:',
          errorMessage
        );

        const paymentError: PaymentError = {
          message: errorMessage,
          details: error instanceof Error ? error.stack : undefined,
          code: 'PAYMENT_PROCESS_ERROR',
        };

        setError(paymentError);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const testConnections = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('🧪 usePayment - Testing connections...');

      const response = await fetch('/api/test/stripe-connection');

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || errorData.error || 'Failed to test connections'
        );
      }

      const result = await response.json();
      console.log('✅ Connection test completed:', result);
      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to test connections';
      console.error('❌ usePayment - Error testing connections:', errorMessage);

      const paymentError: PaymentError = {
        message: errorMessage,
        details: error instanceof Error ? error.stack : undefined,
        code: 'CONNECTION_TEST_ERROR',
      };

      setError(paymentError);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    // State
    isLoading,
    error,

    // Actions
    createPaymentIntent,
    processCompletePayment,
    testConnections,
    clearError,
  };
};
