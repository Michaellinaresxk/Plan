// domain/payment/PaymentRepository.ts
import type { Payment } from './Payment';

export default interface PaymentRepository {
  createPaymentIntent(data: {
    reservationId: string;
    amount: number;
    currency: string;
    metadata?: Record<string, any>;
  }): Promise<{
    clientSecret: string;
    paymentIntentId: string;
  }>;

  processPayment(data: {
    reservationId: string;
    amount: number;
    currency: string;
    paymentMethodId: string;
    metadata?: Record<string, any>;
  }): Promise<Payment>;

  getPayment(paymentId: string): Promise<Payment | null>;

  getPaymentByReservationId(reservationId: string): Promise<Payment | null>;

  updatePaymentStatus(
    paymentId: string,
    status: string,
    metadata?: Record<string, any>
  ): Promise<void>;

  refundPayment(
    paymentId: string,
    amount?: number,
    reason?: string
  ): Promise<void>;
}
