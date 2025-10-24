// primary/payment/useCases/ProcessPaymentUseCase.ts
import PaymentRepository from '@/domain/payment/PaymentRepository';

/**
 * ProcessPaymentUseCase - Procesa un pago completo con Square
 * En Square, el proceso es más directo
 */
export class ProcessPaymentUseCase {
  constructor(private readonly paymentRepository: PaymentRepository) {}

  async execute(data: {
    sourceId: string; // Token de Square del frontend
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
  }> {
    try {
      console.log(
        '🎯 ProcessPaymentUseCase - Executing payment process for reservation:',
        data.reservationId
      );

      // Validar datos de entrada
      this.validateProcessPaymentData(data);

      // Procesar pago a través del repositorio
      const result = await this.paymentRepository.processPayment(data);

      console.log('✅ ProcessPaymentUseCase - Payment processed successfully');

      return result;
    } catch (error) {
      console.error(
        '❌ ProcessPaymentUseCase - Error processing payment:',
        error
      );
      throw error;
    }
  }

  private validateProcessPaymentData(data: {
    sourceId: string;
    reservationId: string;
    amount: number;
    currency: string;
    locationId: string;
  }): void {
    if (!data.sourceId?.trim()) {
      throw new Error('Source ID (payment token) is required');
    }

    if (!data.reservationId?.trim()) {
      throw new Error('Reservation ID is required');
    }

    if (!data.amount || data.amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }

    // Square requiere mínimo $1.00 (100 centavos)
    if (data.amount < 100) {
      throw new Error('Amount must be at least $1.00 (100 cents)');
    }

    if (!data.currency?.trim()) {
      throw new Error('Currency is required');
    }

    if (!data.locationId?.trim()) {
      throw new Error('Location ID is required');
    }

    console.log('✅ ProcessPaymentUseCase - Data validation passed');
  }
}
