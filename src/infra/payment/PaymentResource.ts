// infra/payment/PaymentResource.ts
import type PaymentRepository from '@/domain/payment/PaymentRepository';
import { Payment } from '@/domain/payment/Payment';
import { SquareCaller } from './SquareCaller';
import { PaymentCaller } from './PaymentCaller';
import type { ApiPayment } from './ApiPayment';

/**
 * PaymentResource - Implementa PaymentRepository usando Square
 * Esta clase coordina entre Square (procesador de pagos) y Firebase (persistencia)
 */
export class PaymentResource implements PaymentRepository {
  constructor(
    private readonly squareCaller: SquareCaller,
    private readonly paymentCaller: PaymentCaller
  ) {
    console.log('🗄️ PaymentResource initialized with Square');
  }

  /**
   * Procesar un pago completo con Square
   * En Square, el proceso es directo: crear el pago y guardarlo
   */
  async processPayment(data: {
    sourceId: string;
    reservationId: string;
    amount: number;
    currency: string;
    locationId: string;
    metadata?: Record<string, any>;
  }): Promise<{
    paymentId: string;
    status: string;
    receiptUrl?: string;
    receiptNumber?: string;
  }> {
    try {
      console.log('🗄️ PaymentResource - Processing payment with Square:', data);

      // Step 1: Crear el pago en Square
      const squarePayment = await this.squareCaller.createPayment({
        sourceId: data.sourceId,
        reservationId: data.reservationId,
        amount: data.amount,
        currency: data.currency,
        locationId: data.locationId,
        metadata: data.metadata,
      });

      console.log('✅ Square payment created:', squarePayment.paymentId);

      // Step 2: Guardar el registro del pago en Firebase
      const paymentData = {
        reservationId: data.reservationId,
        amount: data.amount,
        currency: data.currency,
        status: this.mapSquareStatusToPaymentStatus(squarePayment.status),
        paymentMethod: 'card',
        squarePaymentId: squarePayment.paymentId,
        receiptUrl: squarePayment.receiptUrl,
        receiptNumber: squarePayment.receiptNumber,
        metadata: {
          ...data.metadata,
          squareStatus: squarePayment.status,
          processedAt: new Date().toISOString(),
        },
      };

      await this.paymentCaller.createPayment(paymentData);

      console.log(
        '✅ PaymentResource - Payment processed and stored successfully'
      );

      return {
        paymentId: squarePayment.paymentId,
        status: squarePayment.status,
        receiptUrl: squarePayment.receiptUrl,
        receiptNumber: squarePayment.receiptNumber,
      };
    } catch (error) {
      console.error('❌ PaymentResource - Error processing payment:', error);
      throw error;
    }
  }

  async getPayment(paymentId: string): Promise<Payment | null> {
    try {
      console.log('🗄️ PaymentResource - Getting payment:', paymentId);

      const paymentData = await this.paymentCaller.getPayment(paymentId);

      if (!paymentData) {
        console.log('❌ PaymentResource - Payment not found:', paymentId);
        return null;
      }

      const payment = this.toDomainPayment(paymentData);
      console.log('✅ PaymentResource - Payment retrieved successfully');
      return payment;
    } catch (error) {
      console.error('❌ PaymentResource - Error getting payment:', error);
      throw error;
    }
  }

  async getPaymentByReservationId(
    reservationId: string
  ): Promise<Payment | null> {
    try {
      console.log(
        '🗄️ PaymentResource - Getting payment by reservation ID:',
        reservationId
      );

      const paymentData = await this.paymentCaller.getPaymentByReservationId(
        reservationId
      );

      if (!paymentData) {
        console.log(
          '❌ PaymentResource - Payment not found for reservation:',
          reservationId
        );
        return null;
      }

      const payment = this.toDomainPayment(paymentData);
      console.log('✅ PaymentResource - Payment retrieved successfully');
      return payment;
    } catch (error) {
      console.error(
        '❌ PaymentResource - Error getting payment by reservation ID:',
        error
      );
      throw error;
    }
  }

  async getPaymentBySquareId(squarePaymentId: string): Promise<Payment | null> {
    try {
      console.log(
        '🗄️ PaymentResource - Getting payment by Square ID:',
        squarePaymentId
      );

      const paymentData = await this.paymentCaller.getPaymentBySquareId(
        squarePaymentId
      );

      if (!paymentData) {
        console.log(
          '❌ PaymentResource - Payment not found for Square ID:',
          squarePaymentId
        );
        return null;
      }

      const payment = this.toDomainPayment(paymentData);
      console.log('✅ PaymentResource - Payment retrieved successfully');
      return payment;
    } catch (error) {
      console.error(
        '❌ PaymentResource - Error getting payment by Square ID:',
        error
      );
      throw error;
    }
  }

  async updatePaymentStatus(
    paymentId: string,
    status: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    try {
      console.log('🗄️ PaymentResource - Updating payment status:', {
        paymentId,
        status,
        metadata,
      });

      await this.paymentCaller.updatePaymentStatus(paymentId, status, metadata);

      console.log('✅ PaymentResource - Payment status updated successfully');
    } catch (error) {
      console.error(
        '❌ PaymentResource - Error updating payment status:',
        error
      );
      throw error;
    }
  }

  async refundPayment(
    paymentId: string,
    amount?: number,
    reason?: string
  ): Promise<void> {
    try {
      console.log('🗄️ PaymentResource - Processing refund:', {
        paymentId,
        amount,
        reason,
      });

      // Get payment record from Firebase
      const payment = await this.getPayment(paymentId);
      if (!payment) {
        throw new Error('Payment not found');
      }

      if (!payment.canBeRefunded()) {
        throw new Error('Payment cannot be refunded in current status');
      }

      // Get Square payment ID
      const paymentData = await this.paymentCaller.getPayment(paymentId);
      if (!paymentData?.squarePaymentId) {
        throw new Error('Square payment ID not found');
      }

      // Process refund with Square
      await this.squareCaller.refundPayment(
        paymentData.squarePaymentId,
        amount,
        reason
      );

      // Update payment status in Firebase
      await this.updatePaymentStatus(paymentId, 'canceled', {
        refundReason: reason,
        refundAmount: amount || payment.amount,
        refundedAt: new Date().toISOString(),
      });

      console.log('✅ PaymentResource - Refund processed successfully');
    } catch (error) {
      console.error('❌ PaymentResource - Error processing refund:', error);
      throw error;
    }
  }

  /**
   * Manejar webhooks de Square
   * Square envía notificaciones sobre cambios de estado de pagos
   */
  async handleWebhook(webhookData: any): Promise<void> {
    try {
      console.log(
        '🗄️ PaymentResource - Handling Square webhook:',
        webhookData.type
      );

      // Extraer información del webhook
      const { type, data } = webhookData;

      // Manejar diferentes tipos de eventos de Square
      switch (type) {
        case 'payment.updated':
          await this.handlePaymentUpdated(data);
          break;

        case 'payment.created':
          console.log('ℹ️ Payment created webhook received - no action needed');
          break;

        case 'refund.created':
        case 'refund.updated':
          await this.handleRefundEvent(data);
          break;

        default:
          console.log(`ℹ️ Unhandled webhook type: ${type}`);
      }

      console.log('✅ PaymentResource - Webhook processed successfully');
    } catch (error) {
      console.error('❌ PaymentResource - Error handling webhook:', error);
      throw error;
    }
  }

  // Private helper methods

  private async handlePaymentUpdated(data: any): Promise<void> {
    try {
      const squarePaymentId = data.object.payment.id;
      const status = data.object.payment.status;

      console.log(
        `📥 Updating payment ${squarePaymentId} to status: ${status}`
      );

      // Find payment in Firebase by Square ID
      const payment = await this.paymentCaller.getPaymentBySquareId(
        squarePaymentId
      );

      if (payment && payment.paymentId) {
        await this.updatePaymentStatus(
          payment.paymentId,
          this.mapSquareStatusToPaymentStatus(status),
          {
            squareStatus: status,
            webhookUpdatedAt: new Date().toISOString(),
          }
        );
      }
    } catch (error) {
      console.error('❌ Error handling payment updated:', error);
      throw error;
    }
  }

  private async handleRefundEvent(data: any): Promise<void> {
    try {
      const refundId = data.object.refund.id;
      const paymentId = data.object.refund.payment_id;
      const status = data.object.refund.status;

      console.log(`📥 Handling refund ${refundId} for payment ${paymentId}`);

      // Find payment in Firebase
      const payment = await this.paymentCaller.getPaymentBySquareId(paymentId);

      if (payment && payment.paymentId) {
        await this.updatePaymentStatus(payment.paymentId, 'canceled', {
          refundId,
          refundStatus: status,
          webhookUpdatedAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('❌ Error handling refund event:', error);
      throw error;
    }
  }

  private toDomainPayment(apiPayment: ApiPayment): Payment {
    console.log('🔄 Converting API payment to domain payment:', apiPayment);

    if (!apiPayment.paymentId) {
      throw new Error('API Payment must have a paymentId');
    }

    try {
      // Convert Firestore Timestamp to Date
      const createdAt =
        apiPayment.createdAt instanceof Date
          ? apiPayment.createdAt
          : apiPayment.createdAt.toDate();

      const updatedAt =
        apiPayment.updatedAt instanceof Date
          ? apiPayment.updatedAt
          : apiPayment.updatedAt.toDate();

      const domainPayment = Payment.fromProperties({
        paymentId: apiPayment.paymentId,
        reservationId: apiPayment.reservationId,
        amount: apiPayment.amount,
        currency: apiPayment.currency,
        status: apiPayment.status as any,
        paymentMethod: apiPayment.paymentMethod as any,
        squarePaymentId: apiPayment.squarePaymentId,
        receiptUrl: apiPayment.receiptUrl,
        receiptNumber: apiPayment.receiptNumber,
        createdAt: createdAt,
        updatedAt: updatedAt,
        metadata: apiPayment.metadata || {},
      });

      console.log(
        '✅ Domain payment created successfully:',
        domainPayment.paymentId
      );
      return domainPayment;
    } catch (conversionError) {
      console.error('❌ Error converting to domain payment:', conversionError);
      throw new Error(
        `Failed to convert payment: ${
          conversionError instanceof Error
            ? conversionError.message
            : 'Unknown error'
        }`
      );
    }
  }

  private mapSquareStatusToPaymentStatus(squareStatus: string): string {
    switch (squareStatus.toUpperCase()) {
      case 'COMPLETED':
        return 'completed';
      case 'PENDING':
        return 'pending';
      case 'APPROVED':
        return 'processing';
      case 'CANCELED':
      case 'CANCELLED':
        return 'canceled';
      case 'FAILED':
        return 'failed';
      default:
        console.warn(
          `⚠️ Unknown Square status: ${squareStatus}, defaulting to 'pending'`
        );
        return 'pending';
    }
  }
}
