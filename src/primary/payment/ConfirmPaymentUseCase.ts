import PaymentRepository from '@/domain/payment/PaymentRepository';

export class ConfirmPaymentUseCase {
  constructor(private readonly paymentRepository: PaymentRepository) {}

  async execute(data: {
    paymentIntentId: string;
    paymentMethodId: string;
  }): Promise<any> {
    try {
      console.log('🎯 ConfirmPaymentUseCase - Executing with data:', data);

      // Validate input data
      this.validateConfirmPaymentData(data);

      // Confirm payment with Stripe
      const payment = await this.paymentRepository.confirmPayment(data);

      console.log(
        '✅ ConfirmPaymentUseCase - Payment confirmed successfully:',
        payment.paymentId
      );

      return payment;
    } catch (error) {
      console.error(
        '❌ ConfirmPaymentUseCase - Error confirming payment:',
        error
      );
      throw error;
    }
  }

  private validateConfirmPaymentData(data: {
    paymentIntentId: string;
    paymentMethodId: string;
  }): void {
    if (!data.paymentIntentId?.trim()) {
      throw new Error('Payment Intent ID is required');
    }

    if (!data.paymentMethodId?.trim()) {
      throw new Error('Payment Method ID is required');
    }

    console.log('✅ ConfirmPaymentUseCase - Data validation passed');
  }
}
