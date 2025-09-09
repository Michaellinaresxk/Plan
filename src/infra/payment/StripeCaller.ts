// infra/payment/StripeCaller.ts - VERSIÓN PRODUCCIÓN
import Stripe from 'stripe';

export class StripeCaller {
  private stripe: Stripe;
  private isLiveMode: boolean;

  constructor() {
    // 🚨 VERIFICAR QUE ESTAMOS EN EL SERVIDOR
    if (typeof window !== 'undefined') {
      throw new Error('StripeCaller can only be used on the server side');
    }

    // 🔑 OBTENER Y VALIDAR CLAVES
    const secretKey = process.env.STRIPE_SECRET_KEY;

    if (!secretKey) {
      console.error('❌ STRIPE_SECRET_KEY not found in environment variables');
      console.error(
        '❌ Available env vars:',
        Object.keys(process.env).filter((key) => key.includes('STRIPE'))
      );
      throw new Error('STRIPE_SECRET_KEY environment variable is required');
    }

    // 🔍 VERIFICAR FORMATO DE CLAVE
    if (!secretKey.startsWith('sk_')) {
      throw new Error(
        `STRIPE_SECRET_KEY must start with "sk_". Current: ${secretKey.substring(
          0,
          10
        )}...`
      );
    }

    // 🎯 DETERMINAR MODO (TEST vs LIVE)
    this.isLiveMode = secretKey.includes('_live_');
    const mode = this.isLiveMode ? 'LIVE' : 'TEST';

    // 🚨 ADVERTENCIA PARA PRODUCCIÓN
    if (process.env.NODE_ENV === 'production' && !this.isLiveMode) {
      console.warn('⚠️ WARNING: Using TEST keys in PRODUCTION environment!');
      console.warn('⚠️ This will NOT process real payments!');
      console.warn('⚠️ Switch to LIVE keys for real transactions');
    }

    // ✅ LOGS DE CONFIGURACIÓN
    console.log('🔧 StripeCaller Configuration:');
    console.log(`🔧 Mode: ${mode}`);
    console.log(`🔧 Environment: ${process.env.NODE_ENV}`);
    console.log(`🔧 Key type: ${secretKey.substring(0, 15)}...`);

    if (this.isLiveMode) {
      console.log('💰 LIVE MODE ENABLED - Real payments will be processed!');
    } else {
      console.log('🧪 TEST MODE - No real money will be charged');
    }

    try {
      this.stripe = new Stripe(secretKey, {
        apiVersion: '2023-10-16',
        typescript: true,
      });

      console.log('✅ Stripe initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Stripe:', error);
      throw new Error(
        `Failed to initialize Stripe: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }

  // 🔍 MÉTODO PÚBLICO PARA VERIFICAR MODO
  getMode(): 'test' | 'live' {
    return this.isLiveMode ? 'live' : 'test';
  }

  // 🔍 MÉTODO PARA VERIFICAR SI ES PRODUCCIÓN
  isProductionReady(): boolean {
    return this.isLiveMode && process.env.NODE_ENV === 'production';
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
      console.log(
        `💳 Creating payment intent in ${this.getMode().toUpperCase()} mode`
      );

      // 🚨 ADVERTENCIA FINAL PARA LIVE MODE
      if (this.isLiveMode) {
        console.log('🚨 LIVE MODE PAYMENT - Real money will be charged!');
        console.log(
          `🚨 Amount: $${(data.amount / 100).toFixed(
            2
          )} ${data.currency.toUpperCase()}`
        );
      }

      // ✅ VALIDACIÓN DE DATOS
      if (data.amount < 50) {
        throw new Error('Amount must be at least 50 cents');
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
          mode: this.getMode(),
          environment: process.env.NODE_ENV || 'unknown',
          timestamp: new Date().toISOString(),
          ...data.metadata,
        },
      });

      if (!paymentIntent.client_secret) {
        throw new Error(
          'Failed to create payment intent - no client secret returned'
        );
      }

      console.log(`✅ Payment intent created: ${paymentIntent.id}`);
      console.log(`✅ Mode: ${this.getMode()}`);

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      };
    } catch (error: any) {
      console.error('❌ Error creating payment intent:', error);

      // 🔍 MEJOR MANEJO DE ERRORES ESPECÍFICOS
      let userFriendlyMessage = 'Failed to create payment intent';

      switch (error.type) {
        case 'StripeInvalidRequestError':
          if (error.message.includes('similar object exists in test mode')) {
            userFriendlyMessage =
              'Payment system configuration error. Please contact support.';
            console.error(
              '🚨 KEY MODE MISMATCH: You are mixing test and live keys!'
            );
            console.error('🚨 Current mode:', this.getMode());
            console.error('🚨 Check your environment variables');
          } else {
            userFriendlyMessage =
              'Invalid payment request. Please check your information.';
          }
          break;
        case 'StripeAuthenticationError':
          userFriendlyMessage =
            'Payment authentication failed. Please contact support.';
          console.error('🚨 Authentication error - check your Stripe keys');
          break;
        default:
          if (error.message.includes('Amount must be at least')) {
            userFriendlyMessage = 'Minimum payment amount is $0.50';
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
        `💳 Confirming payment in ${this.getMode().toUpperCase()} mode:`,
        data.paymentIntentId
      );

      const paymentIntent = await this.stripe.paymentIntents.confirm(
        data.paymentIntentId,
        {
          payment_method: data.paymentMethodId,
        }
      );

      console.log(`✅ Payment confirmed: ${paymentIntent.status}`);

      if (this.isLiveMode && paymentIntent.status === 'succeeded') {
        console.log('💰 REAL PAYMENT SUCCESSFUL! Money has been charged.');
      }

      return paymentIntent;
    } catch (error: any) {
      console.error('❌ Error confirming payment:', error);

      // 🔍 DETECTAR ERRORES DE MODO MIXTO
      if (error.message?.includes('similar object exists in test mode')) {
        console.error(
          '🚨 CRITICAL: Payment Intent was created in test mode but you are using live keys!'
        );
        console.error(
          '🚨 Solution: Use consistent keys (both test or both live)'
        );
        throw new Error(
          'Payment configuration error: Key mode mismatch. Please contact support.'
        );
      }

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

  async testConnection(): Promise<{
    connected: boolean;
    mode: 'test' | 'live';
    environment: string;
    accountId?: string;
    error?: string;
  }> {
    try {
      console.log(`🧪 Testing Stripe connection in ${this.getMode()} mode...`);

      const account = await this.stripe.accounts.retrieve();

      const result = {
        connected: true,
        mode: this.getMode(),
        environment: process.env.NODE_ENV || 'unknown',
        accountId: account.id,
      };

      console.log('✅ Stripe connection successful:', result);
      return result;
    } catch (error: any) {
      console.error('❌ Stripe connection test failed:', error);

      return {
        connected: false,
        mode: this.getMode(),
        environment: process.env.NODE_ENV || 'unknown',
        error: error.message,
      };
    }
  }

  // 🔍 MÉTODO ESTÁTICO PARA VALIDAR CONFIGURACIÓN
  static validateConfiguration(): {
    valid: boolean;
    errors: string[];
    warnings: string[];
    mode?: 'test' | 'live';
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (typeof window !== 'undefined') {
      errors.push('StripeCaller should only be used on the server side');
    }

    const secretKey = process.env.STRIPE_SECRET_KEY;
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

    // Validar secret key
    if (!secretKey) {
      errors.push('STRIPE_SECRET_KEY environment variable is missing');
    } else if (!secretKey.startsWith('sk_')) {
      errors.push('STRIPE_SECRET_KEY must start with "sk_"');
    }

    // Validar publishable key
    if (!publishableKey) {
      errors.push(
        'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY environment variable is missing'
      );
    } else if (!publishableKey.startsWith('pk_')) {
      errors.push('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY must start with "pk_"');
    }

    // Verificar consistencia de modo
    if (secretKey && publishableKey) {
      const secretIsLive = secretKey.includes('_live_');
      const publishableIsLive = publishableKey.includes('_live_');

      if (secretIsLive !== publishableIsLive) {
        errors.push(
          'Secret key and publishable key must be in the same mode (both test or both live)'
        );
      }

      const mode = secretIsLive ? 'live' : 'test';

      // Advertencias para producción
      if (process.env.NODE_ENV === 'production' && !secretIsLive) {
        warnings.push(
          'Using TEST keys in PRODUCTION environment - no real payments will be processed'
        );
      }

      if (mode === 'live') {
        warnings.push('LIVE MODE ENABLED - Real money will be charged!');
      }

      return {
        valid: errors.length === 0,
        errors,
        warnings,
        mode,
      };
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }
}
