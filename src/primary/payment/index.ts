// primary/Payment/useCases/index.ts - CORREGIDO
import { PaymentCaller } from '@/infra/payment/PaymentCaller';
import { PaymentResource } from '@/infra/payment/PaymentResource';
import { CreatePaymentIntentUseCase } from './CreatePaymentIntentUseCase';
import { ProcessPaymentUseCase } from './ProcessPaymentUseCase';
import { db } from '@/infra/api/FirebaseConfig';

export class PaymentService {
  private paymentCaller: PaymentCaller;
  private paymentResource: PaymentResource | null = null;
  private createPaymentIntentUseCase: CreatePaymentIntentUseCase | null = null;
  private processPaymentUseCase: ProcessPaymentUseCase | null = null;

  constructor() {
    console.log('🗃️ PaymentService - Initializing...');
    this.paymentCaller = new PaymentCaller(db);
    console.log('✅ PaymentService - Basic initialization complete');
  }

  // Lazy initialization para componentes que requieren Stripe (solo servidor)
  private async initializeStripeComponents() {
    if (typeof window !== 'undefined') {
      throw new Error(
        'Stripe components can only be initialized on the server'
      );
    }

    if (!this.paymentResource) {
      console.log('🔄 PaymentService - Initializing Stripe components...');

      // Verificar variables de entorno ANTES de importar Stripe
      if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error('STRIPE_SECRET_KEY environment variable is required');
      }

      // if (!process.env.STRIPE_SECRET_KEY.startsWith('sk_')) {
      //   throw new Error(
      //     'Invalid STRIPE_SECRET_KEY format - must start with sk_'
      //   );
      // }

      try {
        // Importar dinámicamente para evitar errores en el cliente
        const { StripeCaller } = await import('@/infra/payment/StripeCaller');

        const stripeCaller = new StripeCaller();
        this.paymentResource = new PaymentResource(
          stripeCaller,
          this.paymentCaller
        );

        this.createPaymentIntentUseCase = new CreatePaymentIntentUseCase(
          this.paymentResource
        );
        this.processPaymentUseCase = new ProcessPaymentUseCase(
          this.paymentResource
        );

        console.log('✅ PaymentService - Stripe components initialized');
      } catch (error) {
        console.error(
          '❌ PaymentService - Failed to initialize Stripe:',
          error
        );
        throw new Error(
          `Failed to initialize Stripe: ${
            error instanceof Error ? error.message : 'Unknown error'
          }`
        );
      }
    }
  }

  // Public methods for API routes
  async createPaymentIntent(data: {
    reservationId: string;
    amount: number;
    currency: string;
    metadata?: Record<string, any>;
  }) {
    try {
      console.log(
        '🎯 PaymentService - Creating payment intent for:',
        data.reservationId
      );

      await this.initializeStripeComponents();

      if (!this.createPaymentIntentUseCase) {
        throw new Error('Failed to initialize payment intent use case');
      }

      const result = await this.createPaymentIntentUseCase.execute(data);
      console.log(
        '✅ PaymentService - Payment intent created:',
        result.paymentIntentId
      );

      return result;
    } catch (error) {
      console.error(
        '❌ PaymentService - Error creating payment intent:',
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
  }) {
    try {
      console.log(
        '🎯 PaymentService - Processing payment for:',
        data.reservationId
      );

      await this.initializeStripeComponents();

      if (!this.processPaymentUseCase) {
        throw new Error('Failed to initialize process payment use case');
      }

      const result = await this.processPaymentUseCase.execute(data);
      console.log('✅ PaymentService - Payment processed successfully');

      return result;
    } catch (error) {
      console.error('❌ PaymentService - Error processing payment:', error);
      throw error;
    }
  }

  // Environment validation
  static validateServerEnvironment(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!process.env.STRIPE_SECRET_KEY) {
      errors.push('STRIPE_SECRET_KEY is required');
    } else if (!process.env.STRIPE_SECRET_KEY.startsWith('sk_')) {
      errors.push('STRIPE_SECRET_KEY must start with sk_');
    }

    // Verificar que Firebase esté configurado
    try {
      require('@/infra/api/FirebaseConfig');
    } catch (error) {
      errors.push('Firebase configuration is missing or invalid');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

// Create and export singleton instance
export const paymentService = new PaymentService();

// Validate environment on module load (server only)
if (typeof window === 'undefined') {
  const validation = PaymentService.validateServerEnvironment();
  if (!validation.valid) {
    console.warn(
      '⚠️ PaymentService - Environment validation warnings:',
      validation.errors
    );
  }
}

export default paymentService;
