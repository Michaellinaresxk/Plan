// hooks/usePayment.ts - SQUARE VERSION
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

  /**
   * Procesar pago completo con Square
   * Este método reemplaza createPaymentIntent + processCompletePayment
   * Con Square todo se hace en un solo paso
   */
  const processPayment = useCallback(
    async (data: {
      sourceId: string; // Token de Square Web Payments SDK
      reservationData: any;
      amount: number; // en centavos
      currency: string;
    }) => {
      try {
        setIsLoading(true);
        setError(null);

        console.log('🎯 usePayment - Processing Square payment...');
        console.log('💳 Amount:', data.amount, 'Currency:', data.currency);

        // Validar datos
        if (
          !data.sourceId ||
          !data.reservationData ||
          !data.amount ||
          !data.currency
        ) {
          throw new Error('Missing required fields for payment');
        }

        if (data.amount <= 0) {
          throw new Error('Amount must be greater than 0');
        }

        const response = await fetch('/api/payments/process', {
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

        // Verificar si la respuesta es HTML (página de error)
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
              `HTTP ${response.status}: Failed to process payment`
          );
        }

        console.log('✅ Payment processed successfully:', result);
        console.log('📋 Reservation created:', result.reservation?.bookingId);

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
          code: 'PAYMENT_ERROR',
        };

        setError(paymentError);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Obtener estado de un pago
   */
  const getPaymentStatus = useCallback(async (paymentId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('🔍 usePayment - Getting payment status:', paymentId);

      const response = await fetch(`/api/payments/${paymentId}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || errorData.error || 'Failed to get payment status'
        );
      }

      const result = await response.json();
      console.log('✅ Payment status retrieved:', result.status);

      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to get payment status';
      console.error(
        '❌ usePayment - Error getting payment status:',
        errorMessage
      );

      const paymentError: PaymentError = {
        message: errorMessage,
        details: error instanceof Error ? error.stack : undefined,
        code: 'GET_PAYMENT_STATUS_ERROR',
      };

      setError(paymentError);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Probar conexión con Square
   */
  const testConnection = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('🧪 usePayment - Testing Square connection...');

      const response = await fetch('/api/test/square-connection');

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || errorData.error || 'Failed to test connection'
        );
      }

      const result = await response.json();
      console.log('✅ Connection test completed:', result);
      console.log('📊 Overall status:', result.overall ? 'PASS ✅' : 'FAIL ❌');
      console.log(
        '📊 Square connected:',
        result.square?.connected ? 'YES ✅' : 'NO ❌'
      );
      console.log('📊 Environment:', result.square?.environment?.toUpperCase());

      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to test connection';
      console.error('❌ usePayment - Error testing connection:', errorMessage);

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

  /**
   * Procesar reembolso (admin only)
   */
  const processRefund = useCallback(
    async (data: {
      paymentId: string;
      amount?: number; // Opcional: monto parcial en centavos
      reason?: string;
    }) => {
      try {
        setIsLoading(true);
        setError(null);

        console.log('💰 usePayment - Processing refund...');
        console.log('💰 Payment ID:', data.paymentId);

        const response = await fetch(`/api/payments/${data.paymentId}/refund`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: data.amount,
            reason: data.reason || 'Customer requested refund',
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || errorData.error || 'Failed to process refund'
          );
        }

        const result = await response.json();
        console.log('✅ Refund processed successfully');

        return result;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to process refund';
        console.error('❌ usePayment - Error processing refund:', errorMessage);

        const paymentError: PaymentError = {
          message: errorMessage,
          details: error instanceof Error ? error.stack : undefined,
          code: 'REFUND_ERROR',
        };

        setError(paymentError);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Alias para compatibilidad con código existente
  // Si tu código usa processCompletePayment, seguirá funcionando
  const processCompletePayment = processPayment;

  return {
    // State
    isLoading,
    error,

    // Main actions
    processPayment, // Método principal para Square
    processCompletePayment, // Alias para compatibilidad

    // Additional actions
    getPaymentStatus,
    testConnection, // Renombrado de testConnections
    processRefund,
    clearError,
  };
};

// Export default para compatibilidad
export default usePayment;
