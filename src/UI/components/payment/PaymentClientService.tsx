// services/client/PaymentClientService.ts
'use client';

/**
 * Client-side payment service for Square
 * Only handles HTTP requests to API routes
 * No server-side logic here
 */
export class PaymentClientService {
  /**
   * Procesar un pago completo con Square
   * Este método reemplaza createPaymentIntent + confirmPayment
   * Con Square todo se hace en un solo paso
   */
  static async processCompletePayment(data: {
    sourceId: string; // Token de Square (viene del Web Payments SDK)
    reservationData: any;
    amount: number; // en centavos
    currency: string;
  }) {
    try {
      console.log(
        '🎯 PaymentClientService - Processing payment with Square via API'
      );
      console.log('💳 Amount:', data.amount, 'Currency:', data.currency);

      const response = await fetch('/api/payments/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Payment API error:', errorData);
        throw new Error(
          errorData.message || errorData.error || 'Failed to process payment'
        );
      }

      const result = await response.json();
      console.log('✅ PaymentClientService - Payment processed successfully');
      console.log('📋 Reservation created:', result.reservation?.bookingId);

      return result;
    } catch (error) {
      console.error(
        '❌ PaymentClientService - Error processing payment:',
        error
      );
      throw error;
    }
  }

  /**
   * Probar la conexión con Square
   * Útil para debugging y validación de configuración
   */
  static async testConnection() {
    try {
      console.log(
        '🧪 PaymentClientService - Testing Square connection via API'
      );

      const response = await fetch('/api/test/square-connection');

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || errorData.error || 'Failed to test connection'
        );
      }

      const result = await response.json();
      console.log('✅ PaymentClientService - Connection test completed');
      console.log('📊 Test results:', {
        overall: result.overall,
        connected: result.square?.connected,
        environment: result.square?.environment,
        locations: result.square?.locations?.length || 0,
      });

      return result;
    } catch (error) {
      console.error(
        '❌ PaymentClientService - Error testing connection:',
        error
      );
      throw error;
    }
  }

  /**
   * Obtener el estado de un pago
   * Útil para polling o verificación post-pago
   */
  static async getPaymentStatus(paymentId: string) {
    try {
      console.log(
        '🔍 PaymentClientService - Getting payment status:',
        paymentId
      );

      const response = await fetch(`/api/payments/${paymentId}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || errorData.error || 'Failed to get payment status'
        );
      }

      const result = await response.json();
      console.log(
        '✅ PaymentClientService - Payment status retrieved:',
        result.status
      );

      return result;
    } catch (error) {
      console.error(
        '❌ PaymentClientService - Error getting payment status:',
        error
      );
      throw error;
    }
  }

  /**
   * Procesar un reembolso (admin only)
   */
  static async processRefund(data: {
    paymentId: string;
    amount?: number; // Opcional: monto parcial en centavos
    reason?: string;
  }) {
    try {
      console.log('💰 PaymentClientService - Processing refund via API');
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
      console.log('✅ PaymentClientService - Refund processed successfully');

      return result;
    } catch (error) {
      console.error(
        '❌ PaymentClientService - Error processing refund:',
        error
      );
      throw error;
    }
  }
}

/**
 * Client-side reservation service
 * Only handles HTTP requests to API routes
 */
export class ReservationClientService {
  static async createReservation(data: {
    serviceId: string;
    serviceName: string;
    totalPrice: number;
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    formData: Record<string, any>;
    notes?: string;
    paymentInfo?: {
      paymentId: string;
      status: string;
      receiptUrl?: string;
      receiptNumber?: string;
    };
  }) {
    try {
      console.log('🎯 ReservationClientService - Creating reservation via API');

      const response = await fetch('/api/reservations/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || errorData.error || 'Failed to create reservation'
        );
      }

      const result = await response.json();
      console.log(
        '✅ ReservationClientService - Reservation created successfully'
      );
      console.log('📋 Booking ID:', result.bookingId);

      return result;
    } catch (error) {
      console.error(
        '❌ ReservationClientService - Error creating reservation:',
        error
      );
      throw error;
    }
  }

  /**
   * Obtener una reservación por ID
   */
  static async getReservation(reservationId: string) {
    try {
      console.log(
        '🔍 ReservationClientService - Getting reservation:',
        reservationId
      );

      const response = await fetch(`/api/reservations/${reservationId}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || errorData.error || 'Failed to get reservation'
        );
      }

      const result = await response.json();
      console.log('✅ ReservationClientService - Reservation retrieved');

      return result;
    } catch (error) {
      console.error(
        '❌ ReservationClientService - Error getting reservation:',
        error
      );
      throw error;
    }
  }

  /**
   * Actualizar el estado de una reservación
   */
  static async updateReservationStatus(reservationId: string, status: string) {
    try {
      console.log('📝 ReservationClientService - Updating reservation status');

      const response = await fetch(`/api/reservations/${reservationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || errorData.error || 'Failed to update reservation'
        );
      }

      const result = await response.json();
      console.log('✅ ReservationClientService - Reservation updated');

      return result;
    } catch (error) {
      console.error(
        '❌ ReservationClientService - Error updating reservation:',
        error
      );
      throw error;
    }
  }
}

export default PaymentClientService;
