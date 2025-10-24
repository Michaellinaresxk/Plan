// primary/payment/index.ts
import { PaymentCaller } from '@/infra/payment/PaymentCaller';
import { PaymentResource } from '@/infra/payment/PaymentResource';
import { db } from '@/infra/api/FirebaseConfig';

/**
 * PaymentService - Servicio principal de pagos usando Square
 * Este servicio coordina toda la lógica de pagos de la aplicación
 */
export class PaymentService {
  private paymentCaller: PaymentCaller;
  private paymentResource: PaymentResource | null = null;

  constructor() {
    console.log('🗃️ PaymentService - Initializing...');
    this.paymentCaller = new PaymentCaller(db);
    console.log('✅ PaymentService - Basic initialization complete');
  }

  /**
   * Inicialización lazy de componentes de Square (solo servidor)
   */
  private async initializeSquareComponents() {
    if (typeof window !== 'undefined') {
      throw new Error(
        'Square components can only be initialized on the server'
      );
    }

    if (!this.paymentResource) {
      console.log('🔄 PaymentService - Initializing Square components...');

      // Verificar variables de entorno ANTES de importar Square
      if (!process.env.SQUARE_ACCESS_TOKEN) {
        throw new Error('SQUARE_ACCESS_TOKEN environment variable is required');
      }

      if (!process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID) {
        throw new Error(
          'NEXT_PUBLIC_SQUARE_APPLICATION_ID environment variable is required'
        );
      }

      if (!process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID) {
        throw new Error(
          'NEXT_PUBLIC_SQUARE_LOCATION_ID environment variable is required'
        );
      }

      try {
        // Importar dinámicamente para evitar errores en el cliente
        const { SquareCaller } = await import('@/infra/payment/SquareCaller');

        const squareCaller = new SquareCaller();
        this.paymentResource = new PaymentResource(
          squareCaller,
          this.paymentCaller
        );

        console.log('✅ PaymentService - Square components initialized');
      } catch (error) {
        console.error(
          '❌ PaymentService - Failed to initialize Square:',
          error
        );
        throw new Error(
          `Failed to initialize Square: ${
            error instanceof Error ? error.message : 'Unknown error'
          }`
        );
      }
    }
  }

  /**
   * Procesar un pago completo con Square
   * Este método reemplaza createPaymentIntent + confirmPayment
   */
  async processPayment(data: {
    sourceId: string; // Token de Square
    reservationId: string;
    amount: number; // en centavos
    currency: string;
    locationId: string;
    metadata?: Record<string, any>;
  }) {
    try {
      console.log(
        '🎯 PaymentService - Processing payment for:',
        data.reservationId
      );

      await this.initializeSquareComponents();

      if (!this.paymentResource) {
        throw new Error('Failed to initialize payment resource');
      }

      const result = await this.paymentResource.processPayment(data);
      console.log('✅ PaymentService - Payment processed successfully');

      return result;
    } catch (error) {
      console.error('❌ PaymentService - Error processing payment:', error);
      throw error;
    }
  }

  /**
   * Obtener un pago por ID
   */
  async getPayment(paymentId: string) {
    try {
      console.log('🎯 PaymentService - Getting payment:', paymentId);

      await this.initializeSquareComponents();

      if (!this.paymentResource) {
        throw new Error('Failed to initialize payment resource');
      }

      const payment = await this.paymentResource.getPayment(paymentId);
      console.log('✅ PaymentService - Payment retrieved');

      return payment;
    } catch (error) {
      console.error('❌ PaymentService - Error getting payment:', error);
      throw error;
    }
  }

  /**
   * Obtener pago por ID de reservación
   */
  async getPaymentByReservationId(reservationId: string) {
    try {
      console.log(
        '🎯 PaymentService - Getting payment by reservation:',
        reservationId
      );

      await this.initializeSquareComponents();

      if (!this.paymentResource) {
        throw new Error('Failed to initialize payment resource');
      }

      const payment = await this.paymentResource.getPaymentByReservationId(
        reservationId
      );
      console.log('✅ PaymentService - Payment retrieved');

      return payment;
    } catch (error) {
      console.error(
        '❌ PaymentService - Error getting payment by reservation:',
        error
      );
      throw error;
    }
  }

  /**
   * Actualizar estado de un pago
   */
  async updatePaymentStatus(
    paymentId: string,
    status: string,
    metadata?: Record<string, any>
  ) {
    try {
      console.log('🎯 PaymentService - Updating payment status:', paymentId);

      await this.initializeSquareComponents();

      if (!this.paymentResource) {
        throw new Error('Failed to initialize payment resource');
      }

      await this.paymentResource.updatePaymentStatus(
        paymentId,
        status,
        metadata
      );
      console.log('✅ PaymentService - Payment status updated');
    } catch (error) {
      console.error(
        '❌ PaymentService - Error updating payment status:',
        error
      );
      throw error;
    }
  }

  /**
   * Procesar reembolso
   */
  async refundPayment(paymentId: string, amount?: number, reason?: string) {
    try {
      console.log('🎯 PaymentService - Refunding payment:', paymentId);

      await this.initializeSquareComponents();

      if (!this.paymentResource) {
        throw new Error('Failed to initialize payment resource');
      }

      await this.paymentResource.refundPayment(paymentId, amount, reason);
      console.log('✅ PaymentService - Refund processed');
    } catch (error) {
      console.error('❌ PaymentService - Error refunding payment:', error);
      throw error;
    }
  }

  /**
   * Manejar webhook de Square
   */
  async handleWebhook(webhookData: any) {
    try {
      console.log('🎯 PaymentService - Handling webhook:', webhookData.type);

      await this.initializeSquareComponents();

      if (!this.paymentResource) {
        throw new Error('Failed to initialize payment resource');
      }

      await this.paymentResource.handleWebhook(webhookData);
      console.log('✅ PaymentService - Webhook handled');
    } catch (error) {
      console.error('❌ PaymentService - Error handling webhook:', error);
      throw error;
    }
  }

  /**
   * Validar configuración del servidor
   */
  static validateServerEnvironment(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validar variables de Square
    if (!process.env.SQUARE_ACCESS_TOKEN) {
      errors.push('SQUARE_ACCESS_TOKEN is required');
    }

    if (!process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID) {
      errors.push('NEXT_PUBLIC_SQUARE_APPLICATION_ID is required');
    }

    if (!process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID) {
      errors.push('NEXT_PUBLIC_SQUARE_LOCATION_ID is required');
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

  /**
   * Probar conexión con Square
   */
  static async testSquareConnection() {
    try {
      if (typeof window !== 'undefined') {
        throw new Error('Square connection test can only run on server');
      }

      const { SquareCaller } = await import('@/infra/payment/SquareCaller');
      const squareCaller = new SquareCaller();

      return await squareCaller.testConnection();
    } catch (error) {
      console.error('❌ Square connection test failed:', error);
      throw error;
    }
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
  } else {
    console.log('✅ PaymentService - Environment validation passed');
  }
}

export default paymentService;
