// infra/payment/SquareCaller.ts
import { Client, Environment, ApiError } from 'square';
import { randomUUID } from 'crypto';

export class SquareCaller {
  private client: Client;
  private isProduction: boolean;

  constructor() {
    // 🚨 VERIFICAR QUE ESTAMOS EN EL SERVIDOR
    if (typeof window !== 'undefined') {
      throw new Error('SquareCaller can only be used on the server side');
    }

    // 🔑 OBTENER Y VALIDAR CLAVES
    const accessToken = process.env.SQUARE_ACCESS_TOKEN;
    const environment = process.env.SQUARE_ENVIRONMENT || 'sandbox';

    if (!accessToken) {
      console.error(
        '❌ SQUARE_ACCESS_TOKEN not found in environment variables'
      );
      throw new Error('SQUARE_ACCESS_TOKEN environment variable is required');
    }

    // 🎯 DETERMINAR AMBIENTE (SANDBOX vs PRODUCTION)
    this.isProduction = environment === 'production';

    // ✅ LOGS DE CONFIGURACIÓN
    console.log('🔧 SquareCaller Configuration:');
    console.log(`🔧 Environment: ${environment.toUpperCase()}`);
    console.log(`🔧 Node Environment: ${process.env.NODE_ENV}`);

    if (this.isProduction) {
      console.log('💰 PRODUCTION MODE - Real payments will be processed!');
    } else {
      console.log('🧪 SANDBOX MODE - Test payments only');
    }

    try {
      // Inicializar cliente de Square
      this.client = new Client({
        accessToken: accessToken,
        environment: this.isProduction
          ? Environment.Production
          : Environment.Sandbox,
      });

      console.log('✅ Square client initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Square client:', error);
      throw new Error(
        `Failed to initialize Square: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }

  // 🔍 MÉTODO PÚBLICO PARA VERIFICAR AMBIENTE
  getEnvironment(): 'sandbox' | 'production' {
    return this.isProduction ? 'production' : 'sandbox';
  }

  // 🔍 MÉTODO PARA VERIFICAR SI ESTÁ LISTO PARA PRODUCCIÓN
  isProductionReady(): boolean {
    return this.isProduction && process.env.NODE_ENV === 'production';
  }

  /**
   * Crear un pago en Square
   * @param data - Datos del pago
   * @returns Payment ID y detalles
   */
  async createPayment(data: {
    sourceId: string; // Token del método de pago (viene del frontend)
    reservationId: string;
    amount: number; // en centavos
    currency: string;
    locationId: string;
    customerId?: string;
    metadata?: Record<string, any>;
  }): Promise<{
    paymentId: string;
    status: string;
    receiptUrl?: string;
    receiptNumber?: string;
  }> {
    try {
      console.log(
        `💳 Creating payment in ${this.getEnvironment().toUpperCase()} mode`
      );

      // 🚨 ADVERTENCIA PARA PRODUCCIÓN
      if (this.isProduction) {
        console.log('🚨 PRODUCTION PAYMENT - Real money will be charged!');
        console.log(
          `🚨 Amount: $${(data.amount / 100).toFixed(
            2
          )} ${data.currency.toUpperCase()}`
        );
      }

      // ✅ VALIDACIÓN DE DATOS
      if (data.amount < 100) {
        throw new Error('Amount must be at least $1.00 (100 cents)');
      }

      // Generar idempotency key único
      const idempotencyKey = randomUUID();

      // Crear el pago
      const { result } = await this.client.paymentsApi.createPayment({
        sourceId: data.sourceId,
        idempotencyKey: idempotencyKey,
        amountMoney: {
          amount: BigInt(data.amount),
          currency: data.currency.toUpperCase(),
        },
        locationId: data.locationId,
        customerId: data.customerId,
        referenceId: data.reservationId,
        note: data.metadata?.note || 'Online reservation payment',
        // Autocompletar el pago inmediatamente
        autocomplete: true,
      });

      if (!result.payment) {
        throw new Error('No payment returned from Square');
      }

      console.log(`✅ Payment created: ${result.payment.id}`);
      console.log(`✅ Status: ${result.payment.status}`);

      return {
        paymentId: result.payment.id!,
        status: result.payment.status!,
        receiptUrl: result.payment.receiptUrl,
        receiptNumber: result.payment.receiptNumber,
      };
    } catch (error) {
      console.error('❌ Error creating payment:', error);

      // 🔍 MANEJO DE ERRORES ESPECÍFICOS DE SQUARE
      let userFriendlyMessage = 'Failed to create payment';

      if (error instanceof ApiError) {
        console.error('❌ Square API Error:', error.errors);

        const firstError = error.errors?.[0];
        if (firstError) {
          switch (firstError.code) {
            case 'INVALID_CARD_DATA':
              userFriendlyMessage =
                'Invalid card information. Please check your card details.';
              break;
            case 'CARD_DECLINED':
              userFriendlyMessage =
                'Your card was declined. Please try a different card.';
              break;
            case 'INSUFFICIENT_FUNDS':
              userFriendlyMessage =
                'Insufficient funds. Please try a different card.';
              break;
            case 'CVV_FAILURE':
              userFriendlyMessage =
                'Invalid CVV. Please check your card security code.';
              break;
            case 'EXPIRED_CARD':
              userFriendlyMessage =
                'Your card has expired. Please use a different card.';
              break;
            case 'INVALID_LOCATION':
              userFriendlyMessage = 'Invalid location. Please contact support.';
              break;
            case 'GENERIC_DECLINE':
              userFriendlyMessage =
                'Payment declined. Please try a different card or contact your bank.';
              break;
            default:
              userFriendlyMessage =
                firstError.detail || 'Payment failed. Please try again.';
          }
        }
      }

      throw new Error(
        `${userFriendlyMessage}: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }

  /**
   * Obtener información de un pago
   */
  async getPayment(paymentId: string): Promise<any> {
    try {
      console.log(`🔍 Getting payment: ${paymentId}`);

      const { result } = await this.client.paymentsApi.getPayment(paymentId);

      console.log(`✅ Payment retrieved: ${result.payment?.status}`);
      return result.payment;
    } catch (error) {
      console.error('❌ Error getting payment:', error);
      throw new Error(
        `Failed to get payment: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }

  /**
   * Reembolsar un pago
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
      console.log(`💰 Refunding payment: ${paymentId}`);

      const idempotencyKey = randomUUID();

      const { result } = await this.client.refundsApi.refundPayment({
        idempotencyKey: idempotencyKey,
        paymentId: paymentId,
        amountMoney: amount
          ? {
              amount: BigInt(amount),
              currency: 'USD', // Deberías obtener esto del pago original
            }
          : undefined,
        reason: reason || 'Customer requested refund',
      });

      if (!result.refund) {
        throw new Error('No refund returned from Square');
      }

      console.log(`✅ Refund created: ${result.refund.id}`);
      console.log(`✅ Status: ${result.refund.status}`);

      return {
        refundId: result.refund.id!,
        status: result.refund.status!,
      };
    } catch (error) {
      console.error('❌ Error refunding payment:', error);

      let userFriendlyMessage = 'Failed to process refund';

      if (error instanceof ApiError) {
        const firstError = error.errors?.[0];
        if (firstError) {
          userFriendlyMessage = firstError.detail || userFriendlyMessage;
        }
      }

      throw new Error(
        `${userFriendlyMessage}: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }

  /**
   * Probar la conexión con Square
   */
  async testConnection(): Promise<{
    connected: boolean;
    environment: 'sandbox' | 'production';
    locations?: Array<{ id: string; name: string }>;
    error?: string;
  }> {
    try {
      console.log(
        `🧪 Testing Square connection in ${this.getEnvironment()} mode...`
      );

      // Listar locations para verificar la conexión
      const { result } = await this.client.locationsApi.listLocations();

      const locations =
        result.locations?.map((loc) => ({
          id: loc.id!,
          name: loc.name!,
        })) || [];

      console.log('✅ Square connection successful');
      console.log(`✅ Found ${locations.length} location(s)`);

      return {
        connected: true,
        environment: this.getEnvironment(),
        locations: locations,
      };
    } catch (error) {
      console.error('❌ Square connection test failed:', error);

      return {
        connected: false,
        environment: this.getEnvironment(),
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Validar configuración de Square
   */
  static validateConfiguration(): {
    valid: boolean;
    errors: string[];
    warnings: string[];
    environment?: 'sandbox' | 'production';
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (typeof window !== 'undefined') {
      errors.push('SquareCaller should only be used on the server side');
    }

    const accessToken = process.env.SQUARE_ACCESS_TOKEN;
    const applicationId = process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID;
    const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID;
    const environment = process.env.SQUARE_ENVIRONMENT || 'sandbox';

    // Validar access token
    if (!accessToken) {
      errors.push('SQUARE_ACCESS_TOKEN environment variable is missing');
    }

    // Validar application ID (necesario para el frontend)
    if (!applicationId) {
      errors.push(
        'NEXT_PUBLIC_SQUARE_APPLICATION_ID environment variable is missing'
      );
    }

    // Validar location ID
    if (!locationId) {
      errors.push(
        'NEXT_PUBLIC_SQUARE_LOCATION_ID environment variable is missing'
      );
    }

    // Advertencias para producción
    if (process.env.NODE_ENV === 'production' && environment === 'sandbox') {
      warnings.push(
        'Using SANDBOX mode in PRODUCTION environment - no real payments will be processed'
      );
    }

    if (environment === 'production') {
      warnings.push('🚨 PRODUCTION MODE ACTIVE - Real money will be charged!');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      environment: environment as 'sandbox' | 'production',
    };
  }
}
