// domain/payment/PaymentRepository.ts
import type { Payment } from './Payment';

/**
 * Payment Repository Interface
 * Ahora adaptado para Square Payments
 */
export default interface PaymentRepository {
  /**
   * Procesar un pago completo con Square
   * En Square, el proceso es directo: tokenizar y pagar
   */
  processPayment(data: {
    sourceId: string; // Token de Square
    reservationId: string;
    amount: number; // en centavos
    currency: string;
    locationId: string;
    metadata?: Record<string, any>;
  }): Promise<{
    paymentId: string;
    status: string;
    receiptUrl?: string;
    receiptNumber?: string;
  }>;

  /**
   * Obtener información de un pago
   */
  getPayment(paymentId: string): Promise<Payment | null>;

  /**
   * Obtener pago por ID de reservación
   */
  getPaymentByReservationId(reservationId: string): Promise<Payment | null>;

  /**
   * Actualizar estado del pago
   */
  updatePaymentStatus(
    paymentId: string,
    status: string,
    metadata?: Record<string, any>
  ): Promise<void>;

  /**
   * Procesar reembolso
   */
  refundPayment(
    paymentId: string,
    amount?: number,
    reason?: string
  ): Promise<void>;

  /**
   * Manejar webhooks de Square
   */
  handleWebhook(webhookData: any): Promise<void>;

  /**
   * Obtener pago por Square Payment ID
   */
  getPaymentBySquareId(squarePaymentId: string): Promise<Payment | null>;
}
