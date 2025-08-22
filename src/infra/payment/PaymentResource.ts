import type PaymentRepository from '@/domain/payment/PaymentRepository';
import { Payment } from '@/domain/payment/Payment';
import { StripeCaller } from './StripeCaller';
import { PaymentCaller } from './PaymentCaller';
import type { ApiPayment } from './ApiPayment';

export class PaymentResource implements PaymentRepository {
  constructor(
    private readonly stripeCaller: StripeCaller,
    private readonly paymentCaller: PaymentCaller
  ) {
    console.log('🗄️ PaymentResource initialized');
  }

  async createPaymentIntent(data: {
    reservationId: string;
    amount: number;
    currency: string;
    metadata?: Record<string, any>;
  }): Promise<{
    clientSecret: string;
    paymentIntentId: string;
  }> {
    try {
      console.log('🗄️ PaymentResource - Creating payment intent:', data);

      // Create payment intent with Stripe
      const stripeResponse = await this.stripeCaller.createPaymentIntent(data);

      // Store payment record in Firebase
      const paymentData = {
        reservationId: data.reservationId,
        amount: data.amount,
        currency: data.currency,
        status: 'pending',
        paymentMethod: 'card',
        stripePaymentIntentId: stripeResponse.paymentIntentId,
        clientSecret: stripeResponse.clientSecret,
        metadata: data.metadata || {},
      };

      await this.paymentCaller.createPayment(paymentData);

      console.log('✅ PaymentResource - Payment intent created and stored');

      return stripeResponse;
    } catch (error) {
      console.error(
        '❌ PaymentResource - Error creating payment intent:',
        error
      );
      throw error;
    }
  }

  async processPayment(data: {
    reservationId: string;
    amount: number;
    currency: string;
    paymentMethodId: string;
    metadata?: Record<string, any>;
  }): Promise<Payment> {
    try {
      console.log('🗄️ PaymentResource - Processing payment:', data);

      // Step 1: Create payment intent
      const paymentIntent = await this.createPaymentIntent({
        reservationId: data.reservationId,
        amount: data.amount,
        currency: data.currency,
        metadata: data.metadata,
      });

      // Step 2: Confirm payment with Stripe
      const confirmedPayment = await this.stripeCaller.confirmPayment({
        paymentIntentId: paymentIntent.paymentIntentId,
        paymentMethodId: data.paymentMethodId,
      });

      // Step 3: Update payment status in Firebase
      const existingPayment = await this.paymentCaller.getPaymentByStripeId(
        paymentIntent.paymentIntentId
      );

      if (existingPayment) {
        const newStatus = this.mapStripeStatusToPaymentStatus(
          confirmedPayment.status
        );

        await this.paymentCaller.updatePaymentStatus(
          existingPayment.paymentId!,
          newStatus,
          {
            stripeStatus: confirmedPayment.status,
            lastUpdated: new Date().toISOString(),
          }
        );

        // Return updated payment domain object
        const updatedPayment = this.toDomainPayment({
          ...existingPayment,
          status: newStatus,
          updatedAt: new Date(),
        });

        console.log('✅ PaymentResource - Payment processed successfully');
        return updatedPayment;
      } else {
        throw new Error('Payment record not found after creation');
      }
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

      // Get payment record
      const payment = await this.getPayment(paymentId);
      if (!payment) {
        throw new Error('Payment not found');
      }

      if (!payment.canBeRefunded()) {
        throw new Error('Payment cannot be refunded in current status');
      }

      // Process refund with Stripe
      await this.stripeCaller.refundPayment(
        payment.stripePaymentIntentId,
        amount,
        reason
      );

      // Update payment status in database
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

  // Private helper methods
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
        stripePaymentIntentId: apiPayment.stripePaymentIntentId,
        clientSecret: apiPayment.clientSecret,
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

  private mapStripeStatusToPaymentStatus(stripeStatus: string): string {
    switch (stripeStatus) {
      case 'succeeded':
        return 'succeeded';
      case 'processing':
        return 'processing';
      case 'requires_payment_method':
      case 'requires_confirmation':
      case 'requires_action':
        return 'pending';
      case 'canceled':
        return 'canceled';
      default:
        return 'failed';
    }
  }
}
