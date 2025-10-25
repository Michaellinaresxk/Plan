import type PaymentRepository from '@/domain/payment/PaymentRepository';

export class CreatePaymentIntentUseCase {
  constructor(private readonly paymentRepository: PaymentRepository) {}

  async execute(data: {
    reservationId: string;
    amount: number;
    currency: string;
    metadata: Record<string, any> | undefined;
  }): Promise<{
    clientSecret: string;
    paymentIntentId: string;
  }> {
    try {
      console.log('🎯 CreatePaymentIntentUseCase - Executing with data:', data);

      // Validate input data
      this.validatePaymentIntentData(data);

      // Create payment intent
      const paymentIntent = await this.paymentRepository.createPaymentIntent(
        data
      );

      console.log(
        '✅ CreatePaymentIntentUseCase - Payment intent created successfully:',
        paymentIntent.paymentIntentId
      );

      return paymentIntent;
    } catch (error) {
      console.error(
        '❌ CreatePaymentIntentUseCase - Error creating payment intent:',
        error
      );
      throw error;
    }
  }

  private validatePaymentIntentData(data: {
    reservationId: any;
    amount: any;
    currency: any;
    metadata?: Record<string, any> | undefined;
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

    // Minimum amount validation (50 cents for USD)
    const minimumAmount = data.currency.toLowerCase() === 'usd' ? 50 : 100;
    if (data.amount < minimumAmount) {
      throw new Error(`Amount must be at least ${minimumAmount} cents`);
    }

    console.log('✅ CreatePaymentIntentUseCase - Data validation passed');
  }
}
