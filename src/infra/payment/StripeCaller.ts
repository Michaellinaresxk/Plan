// infra/payment/StripeCaller.ts (CORREGIDO para servidor)
import Stripe from 'stripe';

export class StripeCaller {
  private stripe: Stripe;

  constructor() {
    // VERIFICAR QUE ESTAMOS EN EL SERVIDOR
    if (typeof window !== 'undefined') {
      throw new Error('StripeCaller can only be used on the server side');
    }

    // VERIFICAR VARIABLES DE ENTORNO
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('❌ STRIPE_SECRET_KEY not found in environment variables');
      console.error(
        '❌ Available env vars:',
        Object.keys(process.env).filter((key) => key.includes('STRIPE'))
      );
      throw new Error(
        'STRIPE_SECRET_KEY environment variable is required. Make sure .env.local is in the project root and the server is restarted.'
      );
    }

    // VERIFICAR FORMATO DE CLAVE
    if (!process.env.STRIPE_SECRET_KEY.startsWith('sk_')) {
      throw new Error(
        'STRIPE_SECRET_KEY must start with "sk_" (found: ' +
          process.env.STRIPE_SECRET_KEY.substring(0, 10) +
          '...)'
      );
    }

    // LOG PARA DEBUGGING
    console.log('🔑 StripeCaller initializing...');
    console.log(
      '🔑 Secret key found:',
      process.env.STRIPE_SECRET_KEY.substring(0, 15) + '...'
    );
    console.log(
      '🔑 Mode:',
      process.env.STRIPE_SECRET_KEY.includes('_test_') ? 'TEST' : 'LIVE'
    );

    try {
      this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2023-10-16',
      });

      console.log('✅ StripeCaller initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Stripe:', error);
      throw new Error(
        'Failed to initialize Stripe: ' + (error as Error).message
      );
    }
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
      console.log('💳 StripeCaller - Creating payment intent...');
      console.log('💳 Amount:', data.amount, 'Currency:', data.currency);

      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: data.amount,
        currency: data.currency,
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          reservationId: data.reservationId,
          ...data.metadata,
        },
      });

      if (!paymentIntent.client_secret) {
        throw new Error(
          'Failed to create payment intent - no client secret returned'
        );
      }

      console.log(
        '✅ StripeCaller - Payment intent created:',
        paymentIntent.id
      );

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      };
    } catch (error: any) {
      console.error('❌ StripeCaller - Error creating payment intent:', error);

      let userFriendlyMessage = 'Failed to create payment intent';

      if (error.type === 'StripeCardError') {
        userFriendlyMessage =
          'Your card was declined. Please try a different payment method.';
      } else if (error.type === 'StripeInvalidRequestError') {
        userFriendlyMessage =
          'Invalid payment request. Please check your information.';
      } else if (error.type === 'StripeAPIError') {
        userFriendlyMessage =
          'Payment service temporarily unavailable. Please try again.';
      } else if (error.type === 'StripeConnectionError') {
        userFriendlyMessage =
          'Network error. Please check your connection and try again.';
      }

      throw new Error(`${userFriendlyMessage}: ${error.message}`);
    }
  }

  async confirmPayment(data: {
    paymentIntentId: string;
    paymentMethodId: string;
  }): Promise<Stripe.PaymentIntent> {
    try {
      console.log(
        '💳 StripeCaller - Confirming payment intent:',
        data.paymentIntentId
      );

      const paymentIntent = await this.stripe.paymentIntents.confirm(
        data.paymentIntentId,
        {
          payment_method: data.paymentMethodId,
        }
      );

      console.log('✅ StripeCaller - Payment confirmed:', paymentIntent.status);
      return paymentIntent;
    } catch (error: any) {
      console.error('❌ StripeCaller - Error confirming payment:', error);

      let userFriendlyMessage = 'Failed to confirm payment';

      if (error.type === 'StripeCardError') {
        switch (error.code) {
          case 'card_declined':
            userFriendlyMessage =
              'Your card was declined. Please try a different card.';
            break;
          case 'insufficient_funds':
            userFriendlyMessage =
              'Insufficient funds. Please try a different card.';
            break;
          case 'expired_card':
            userFriendlyMessage =
              'Your card has expired. Please try a different card.';
            break;
          case 'incorrect_cvc':
            userFriendlyMessage =
              'Incorrect security code. Please check and try again.';
            break;
          default:
            userFriendlyMessage =
              'Payment failed. Please try a different payment method.';
        }
      }

      throw new Error(`${userFriendlyMessage}: ${error.message}`);
    }
  }

  async refundPayment(
    paymentIntentId: string,
    amount?: number,
    reason?: string
  ): Promise<Stripe.Refund> {
    try {
      console.log(
        '💳 StripeCaller - Creating refund for payment:',
        paymentIntentId
      );

      const refundData: Stripe.RefundCreateParams = {
        payment_intent: paymentIntentId,
      };

      if (amount) {
        refundData.amount = amount;
      }

      if (reason) {
        refundData.reason = reason as Stripe.RefundCreateParams.Reason;
      }

      const refund = await this.stripe.refunds.create(refundData);

      console.log('✅ StripeCaller - Refund created:', refund.id);
      return refund;
    } catch (error: any) {
      console.error('❌ StripeCaller - Error creating refund:', error);
      throw new Error(`Failed to create refund: ${error.message}`);
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      console.log('🧪 Testing Stripe connection...');
      const account = await this.stripe.accounts.retrieve();
      console.log('✅ Stripe connection successful:', account.id);
      return true;
    } catch (error) {
      console.error('❌ Stripe connection test failed:', error);
      return false;
    }
  }
}
