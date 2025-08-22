import PaymentRepository from '@/domain/payment/PaymentRepository';

export class HandlePaymentWebhookUseCase {
  constructor(private readonly paymentRepository: PaymentRepository) {}

  async execute(webhookData: any): Promise<void> {
    try {
      console.log(
        '🎯 HandlePaymentWebhookUseCase - Processing webhook:',
        webhookData.type
      );

      await this.paymentRepository.handleWebhook(webhookData);

      console.log(
        '✅ HandlePaymentWebhookUseCase - Webhook processed successfully'
      );
    } catch (error) {
      console.error(
        '❌ HandlePaymentWebhookUseCase - Error processing webhook:',
        error
      );
      throw error;
    }
  }
}
