// infra/payment/StripeCaller.ts
//
// NOTE: requires the 'stripe' npm package.
// Run: npm install stripe
// when you receive your Stripe credentials.

import Stripe from 'stripe';
import { randomUUID } from 'crypto';

export class StripeCaller {
  private stripe: Stripe;
  private isProduction: boolean;

  constructor() {
    if (typeof window !== 'undefined') {
      throw new Error('StripeCaller can only be used on the server side');
    }

    const secretKey = process.env.STRIPE_SECRET_KEY;

    if (!secretKey) {
      console.error('❌ STRIPE_SECRET_KEY not found in environment variables');
      throw new Error('STRIPE_SECRET_KEY environment variable is required');
    }

    this.isProduction = secretKey.startsWith('sk_live_');

    console.log('🔧 StripeCaller Configuration:');
    console.log(`🔧 Mode: ${this.isProduction ? 'PRODUCTION' : 'TEST'}`);

    if (this.isProduction) {
      console.log('💰 PRODUCTION MODE - Real payments will be processed!');
    } else {
      console.log('🧪 TEST MODE - Test payments only');
    }

    this.stripe = new Stripe(secretKey);
  }

  getEnvironment(): 'test' | 'production' {
    return this.isProduction ? 'production' : 'test';
  }

  isProductionReady(): boolean {
    return this.isProduction && process.env.NODE_ENV === 'production';
  }

  /**
   * Create a payment with Stripe using a PaymentMethod ID from the frontend.
   */
  async createPayment(data: {
    paymentMethodId: string; // from Stripe.js createPaymentMethod() on the frontend
    reservationId: string;
    amount: number;          // in cents
    currency: string;
    metadata?: Record<string, string>;
  }): Promise<{
    paymentId: string;
    status: string;
    receiptUrl?: string;
  }> {
    try {
      console.log(`💳 Creating Stripe payment in ${this.getEnvironment().toUpperCase()} mode`);

      if (this.isProduction) {
        console.log('🚨 PRODUCTION PAYMENT - Real money will be charged!');
        console.log(`🚨 Amount: $${(data.amount / 100).toFixed(2)} ${data.currency.toUpperCase()}`);
      }

      if (data.amount < 50) {
        throw new Error('Amount must be at least $0.50 (50 cents)');
      }

      const paymentIntent = await this.stripe.paymentIntents.create(
        {
          amount: data.amount,
          currency: data.currency.toLowerCase(),
          payment_method: data.paymentMethodId,
          confirm: true,
          // allow_redirects: 'never' ensures we never get a redirect-based 3DS challenge
          automatic_payment_methods: {
            enabled: true,
            allow_redirects: 'never',
          },
          metadata: {
            reservationId: data.reservationId,
            ...(data.metadata ?? {}),
          },
        },
        { idempotencyKey: randomUUID() }
      );

      if (paymentIntent.status !== 'succeeded') {
        throw new Error(`Payment failed with status: ${paymentIntent.status}`);
      }

      console.log(`✅ Stripe PaymentIntent created: ${paymentIntent.id}`);
      console.log(`✅ Status: ${paymentIntent.status}`);

      // Retrieve the charge to get the receipt URL
      let receiptUrl: string | undefined;
      if (paymentIntent.latest_charge) {
        const charge = await this.stripe.charges.retrieve(
          paymentIntent.latest_charge as string
        );
        receiptUrl = charge.receipt_url ?? undefined;
      }

      return {
        paymentId: paymentIntent.id,
        status: paymentIntent.status,
        receiptUrl,
      };
    } catch (error) {
      console.error('❌ Error creating Stripe payment:', error);

      let userFriendlyMessage = 'Failed to create payment';

      if (error instanceof Stripe.errors.StripeCardError) {
        switch (error.code) {
          case 'card_declined':
            userFriendlyMessage = 'Your card was declined. Please try a different card.';
            break;
          case 'insufficient_funds':
            userFriendlyMessage = 'Insufficient funds. Please try a different card.';
            break;
          case 'incorrect_cvc':
            userFriendlyMessage = 'Invalid CVV. Please check your card security code.';
            break;
          case 'expired_card':
            userFriendlyMessage = 'Your card has expired. Please use a different card.';
            break;
          case 'incorrect_number':
            userFriendlyMessage = 'Invalid card number. Please check your card details.';
            break;
          default:
            userFriendlyMessage = error.message || 'Payment failed. Please try again.';
        }
      }

      throw new Error(
        `${userFriendlyMessage}: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Retrieve a Stripe PaymentIntent by ID.
   */
  async getPayment(paymentId: string): Promise<Stripe.PaymentIntent> {
    try {
      console.log(`🔍 Getting Stripe payment: ${paymentId}`);
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentId);
      console.log(`✅ Payment retrieved: ${paymentIntent.status}`);
      return paymentIntent;
    } catch (error) {
      console.error('❌ Error getting Stripe payment:', error);
      throw new Error(
        `Failed to get payment: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Refund a Stripe payment.
   */
  async refundPayment(
    paymentId: string,
    amount?: number,
    reason?: string
  ): Promise<{
    refundId: string;
    status: string;
  }> {
    try {
      console.log(`💰 Refunding Stripe payment: ${paymentId}`);

      const refund = await this.stripe.refunds.create({
        payment_intent: paymentId,
        ...(amount ? { amount } : {}),
        reason: (reason as Stripe.RefundCreateParams.Reason) ?? 'requested_by_customer',
      });

      console.log(`✅ Refund created: ${refund.id}`);
      console.log(`✅ Status: ${refund.status}`);

      return {
        refundId: refund.id,
        status: refund.status!,
      };
    } catch (error) {
      console.error('❌ Error refunding Stripe payment:', error);
      throw new Error(
        `Failed to process refund: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Validate that all required Stripe environment variables are present.
   */
  static validateConfiguration(): {
    valid: boolean;
    errors: string[];
    environment?: 'test' | 'production';
  } {
    const errors: string[] = [];

    if (typeof window !== 'undefined') {
      errors.push('StripeCaller should only be used on the server side');
    }

    const secretKey = process.env.STRIPE_SECRET_KEY;
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

    if (!secretKey) {
      errors.push('STRIPE_SECRET_KEY environment variable is missing');
    }
    if (!publishableKey) {
      errors.push('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY environment variable is missing');
    }

    const isProduction = secretKey?.startsWith('sk_live_') ?? false;

    if (process.env.NODE_ENV === 'production' && !isProduction) {
      errors.push(
        'Using Stripe TEST keys in PRODUCTION environment - no real payments will be processed'
      );
    }

    return {
      valid: errors.length === 0,
      errors,
      environment: isProduction ? 'production' : 'test',
    };
  }
}
