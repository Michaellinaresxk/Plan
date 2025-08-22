import PaymentRepository from '@/domain/payment/PaymentRepository';

export class ProcessPaymentUseCase {
  constructor(private readonly paymentRepository: PaymentRepository) {}

  async execute(data: {
    reservationId: string;
    amount: number;
    currency: string;
    paymentMethodId: string;
    metadata?: Record<string, any>;
  }): Promise<any> {
    try {
      console.log(
        '🎯 ProcessPaymentUseCase - Executing payment process for reservation:',
        data.reservationId
      );

      // Validate input data
      this.validateProcessPaymentData(data);

      // Process payment through repository
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
    reservationId: string;
    amount: number;
    currency: string;
    paymentMethodId: string;
  }): void {
    if (!data.reservationId?.trim()) {
      throw new Error('Reservation ID is required');
    }

    if (!data.amount || data.amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }

    if (!data.currency?.trim()) {
      throw new Error('Currency is required');
    }

    if (!data.paymentMethodId?.trim()) {
      throw new Error('Payment Method ID is required');
    }

    console.log('✅ ProcessPaymentUseCase - Data validation passed');
  }
}
