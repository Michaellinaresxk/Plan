// services/client/PaymentClientService.ts
'use client';

/**
 * Client-side payment service
 * Only handles HTTP requests to API routes
 * No server-side logic here
 */
export class PaymentClientService {
  static async createPaymentIntent(data: {
    reservationId: string;
    amount: number;
    currency: string;
    metadata?: Record<string, any>;
  }) {
    try {
      console.log('🎯 PaymentClientService - Creating payment intent via API');

      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            errorData.error ||
            'Failed to create payment intent'
        );
      }

      const result = await response.json();
      console.log(
        '✅ PaymentClientService - Payment intent created successfully'
      );
      return result;
    } catch (error) {
      console.error(
        '❌ PaymentClientService - Error creating payment intent:',
        error
      );
      throw error;
    }
  }

  static async processCompletePayment(data: {
    reservationData: any;
    paymentMethodId: string;
    clientSecret: string;
  }) {
    try {
      console.log(
        '🎯 PaymentClientService - Processing complete payment via API'
      );

      const response = await fetch('/api/payments/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || errorData.error || 'Failed to process payment'
        );
      }

      const result = await response.json();
      console.log('✅ PaymentClientService - Payment processed successfully');
      return result;
    } catch (error) {
      console.error(
        '❌ PaymentClientService - Error processing payment:',
        error
      );
      throw error;
    }
  }

  static async testConnections() {
    try {
      console.log('🧪 PaymentClientService - Testing connections via API');

      const response = await fetch('/api/test/stripe-connection');

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || errorData.error || 'Failed to test connections'
        );
      }

      const result = await response.json();
      console.log('✅ PaymentClientService - Connection test completed');
      return result;
    } catch (error) {
      console.error(
        '❌ PaymentClientService - Error testing connections:',
        error
      );
      throw error;
    }
  }
}

// services/client/ReservationClientService.ts
('use client');

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
      return result;
    } catch (error) {
      console.error(
        '❌ ReservationClientService - Error creating reservation:',
        error
      );
      throw error;
    }
  }
}
