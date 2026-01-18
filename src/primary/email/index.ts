// primary/email/index.ts
import { SendPaymentConfirmationUseCase } from './SendPaymentConfirmationUseCase';
import type EmailRepository from '@/domain/email/EmailRepository';

/**
 * EmailService - Expone los casos de uso de email
 *
 * Actúa como facade para los use cases
 */
export class EmailService {
  private sendPaymentConfirmationUseCase: SendPaymentConfirmationUseCase;

  constructor(emailRepository: EmailRepository) {
    this.sendPaymentConfirmationUseCase = new SendPaymentConfirmationUseCase(
      emailRepository
    );
  }

  /**
   * Enviar email de confirmación de pago
   */
  async sendPaymentConfirmation(data: {
    reservationId: string;
    bookingId: string;
    clientEmail: string;
    clientName: string;
    serviceName: string;
    totalPrice: number;
    currency: string;
    metadata?: Record<string, any>;
  }): Promise<{
    success: boolean;
    messageId?: string;
    error?: string;
  }> {
    return await this.sendPaymentConfirmationUseCase.execute(data);
  }
}
