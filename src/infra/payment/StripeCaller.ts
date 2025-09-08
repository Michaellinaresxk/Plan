// infra/payment/StripeCaller.ts
import Stripe from 'stripe';

export class StripeCaller {
  private stripe: Stripe;

  constructor() {
    // VERIFICAR QUE ESTAMOS EN EL SERVIDOR
    if (typeof window !== 'undefined') {
      throw new Error('StripeCaller can only be used on the server side');
    }

    // VERIFICAR VARIABLES DE ENTORNO CON MEJOR MANEJO DE ERRORES
    const secretKey = process.env.STRIPE_SECRET_KEY;

    if (!secretKey) {
      console.error('❌ STRIPE_SECRET_KEY not found in environment variables');
      console.error(
        '❌ Available env vars:',
        Object.keys(process.env).filter((key) => key.includes('STRIPE'))
      );
      console.error('❌ Make sure you have:');
      console.error('   1. .env.local file in project root');
      console.error('   2. STRIPE_SECRET_KEY=sk_test_... in .env.local');
      console.error('   3. Server restarted after adding the variable');
      throw new Error(
        'STRIPE_SECRET_KEY environment variable is required. Check your .env.local file.'
      );
    }

    // VERIFICAR FORMATO DE CLAVE CON MEJOR ERROR MESSAGE
    if (!secretKey.startsWith('sk_')) {
      console.error('❌ Invalid STRIPE_SECRET_KEY format');
      console.error(
        '❌ Current key starts with:',
        secretKey.substring(0, 10) + '...'
      );
      console.error('❌ Expected format: sk_test_... or sk_live_...');
      console.error(
        '❌ Please check your Stripe dashboard for the correct secret key'
      );
      throw new Error(
        `STRIPE_SECRET_KEY must start with "sk_". Current key: ${secretKey.substring(
          0,
          10
        )}...`
      );
    }

    // LOG PARA DEBUGGING (más informativo)
    console.log('🔑 StripeCaller initializing...');
    console.log('🔑 Secret key found:', secretKey.substring(0, 15) + '...');
    console.log('🔑 Mode:', secretKey.includes('_test_') ? 'TEST' : 'LIVE');
    console.log('🔑 Environment:', process.env.NODE_ENV);

    try {
      this.stripe = new Stripe(secretKey, {
        apiVersion: '2023-10-16',
        typescript: true, // Mejor soporte para TypeScript
      });

      console.log('✅ StripeCaller initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Stripe instance:', error);
      console.error('❌ This usually indicates:');
      console.error('   1. Invalid secret key format');
      console.error('   2. Network connectivity issues');
      console.error('   3. Stripe SDK version conflicts');

      throw new Error(
        `Failed to initialize Stripe: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
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
      console.log('💳 Reservation ID:', data.reservationId);

      // Validación de datos de entrada
      if (data.amount < 50) {
        throw new Error('Amount must be at least 50 cents');
      }

      if (!['usd', 'eur', 'gbp'].includes(data.currency.toLowerCase())) {
        console.warn('⚠️ Unusual currency detected:', data.currency);
      }

      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: data.amount,
        currency: data.currency.toLowerCase(),
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          reservationId: data.reservationId,
          source: 'webapp',
          timestamp: new Date().toISOString(),
          ...data.metadata,
        },
      });

      if (!paymentIntent.client_secret) {
        console.error('❌ No client secret returned from Stripe');
        console.error(
          '❌ Payment Intent object:',
          JSON.stringify(paymentIntent, null, 2)
        );
        throw new Error(
          'Failed to create payment intent - no client secret returned'
        );
      }

      console.log(
        '✅ StripeCaller - Payment intent created:',
        paymentIntent.id
      );
      console.log(
        '✅ Client secret length:',
        paymentIntent.client_secret.length
      );

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      };
    } catch (error: any) {
      console.error('❌ StripeCaller - Error creating payment intent:', error);
      console.error('❌ Error type:', error.type);
      console.error('❌ Error code:', error.code);

      let userFriendlyMessage = 'Failed to create payment intent';

      // Mejor manejo de errores específicos de Stripe
      switch (error.type) {
        case 'StripeCardError':
          userFriendlyMessage =
            'Your card was declined. Please try a different payment method.';
          break;
        case 'StripeInvalidRequestError':
          userFriendlyMessage =
            'Invalid payment request. Please check your information.';
          console.error('❌ Invalid request details:', {
            amount: data.amount,
            currency: data.currency,
            reservationId: data.reservationId,
          });
          break;
        case 'StripeAPIError':
          userFriendlyMessage =
            'Payment service temporarily unavailable. Please try again.';
          break;
        case 'StripeConnectionError':
          userFriendlyMessage =
            'Network error. Please check your connection and try again.';
          break;
        case 'StripeAuthenticationError':
          userFriendlyMessage =
            'Authentication failed. Please contact support.';
          console.error('❌ Authentication error - check your Stripe keys');
          break;
        default:
          if (error.message.includes('Amount must be at least')) {
            userFriendlyMessage = 'Minimum payment amount is $0.50';
          } else if (error.message.includes('Invalid currency')) {
            userFriendlyMessage =
              'Currency not supported. Please contact support.';
          }
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
      console.log('💳 Payment method:', data.paymentMethodId);

      const paymentIntent = await this.stripe.paymentIntents.confirm(
        data.paymentIntentId,
        {
          payment_method: data.paymentMethodId,
        }
      );

      console.log('✅ StripeCaller - Payment confirmed:', paymentIntent.status);
      console.log('✅ Payment Intent ID:', paymentIntent.id);

      return paymentIntent;
    } catch (error: any) {
      console.error('❌ StripeCaller - Error confirming payment:', error);
      console.error('❌ Payment Intent ID:', data.paymentIntentId);
      console.error('❌ Payment Method ID:', data.paymentMethodId);

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
          case 'processing_error':
            userFriendlyMessage = 'Payment processing error. Please try again.';
            break;
          case 'incorrect_number':
            userFriendlyMessage =
              'Invalid card number. Please check and try again.';
            break;
          default:
            userFriendlyMessage =
              'Payment failed. Please try a different payment method.';
        }
      } else if (error.type === 'StripeInvalidRequestError') {
        if (error.message.includes('payment_intent')) {
          userFriendlyMessage = 'Payment session expired. Please start over.';
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
      console.log('💳 Refund amount:', amount || 'full');
      console.log('💳 Refund reason:', reason || 'none specified');

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
      console.log('✅ Refund status:', refund.status);

      return refund;
    } catch (error: any) {
      console.error('❌ StripeCaller - Error creating refund:', error);
      console.error('❌ Payment Intent ID:', paymentIntentId);

      let userFriendlyMessage = 'Failed to create refund';

      if (error.type === 'StripeInvalidRequestError') {
        if (error.message.includes('has already been refunded')) {
          userFriendlyMessage = 'This payment has already been refunded.';
        } else if (error.message.includes('amount')) {
          userFriendlyMessage = 'Invalid refund amount.';
        }
      }

      throw new Error(`${userFriendlyMessage}: ${error.message}`);
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      console.log('🧪 Testing Stripe connection...');
      console.log('🧪 Using API version: 2023-10-16');

      const account = await this.stripe.accounts.retrieve();

      console.log('✅ Stripe connection successful');
      console.log('✅ Account ID:', account.id);
      console.log('✅ Account type:', account.type);
      console.log('✅ Country:', account.country);
      console.log('✅ Default currency:', account.default_currency);

      return true;
    } catch (error: any) {
      console.error('❌ Stripe connection test failed:', error);
      console.error('❌ Error type:', error.type);
      console.error('❌ Error code:', error.code);

      if (error.type === 'StripeAuthenticationError') {
        console.error('❌ Authentication failed - check your secret key');
      } else if (error.type === 'StripeConnectionError') {
        console.error('❌ Network connection failed');
      }

      return false;
    }
  }

  // Método para validar configuración sin hacer llamadas a la API
  static validateConfiguration(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (typeof window !== 'undefined') {
      errors.push('StripeCaller should only be used on the server side');
    }

    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      errors.push('STRIPE_SECRET_KEY environment variable is missing');
    } else if (!secretKey.startsWith('sk_')) {
      errors.push('STRIPE_SECRET_KEY must start with "sk_"');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
