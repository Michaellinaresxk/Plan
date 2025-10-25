// primary/payment/useCases/HandlePaymentWebhookUseCase.ts
import PaymentRepository from '@/domain/payment/PaymentRepository';

/**
 * HandlePaymentWebhookUseCase - Maneja webhooks de Square
 * Square envía notificaciones sobre eventos de pagos
 */
export class HandlePaymentWebhookUseCase {
  constructor(private readonly paymentRepository: PaymentRepository) {}

  async execute(webhookData: any): Promise<void> {
    try {
      console.log(
        '🎯 HandlePaymentWebhookUseCase - Processing webhook:',
        webhookData.type
      );

      // Validar estructura del webhook
      this.validateWebhookData(webhookData);

      // Procesar webhook a través del repositorio
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

  private validateWebhookData(webhookData: any): void {
    if (!webhookData) {
      throw new Error('Webhook data is required');
    }

    if (!webhookData.type) {
      throw new Error('Webhook type is required');
    }

    if (!webhookData.data) {
      throw new Error('Webhook data.data is required');
    }

    console.log('✅ HandlePaymentWebhookUseCase - Webhook validation passed');
  }
}
