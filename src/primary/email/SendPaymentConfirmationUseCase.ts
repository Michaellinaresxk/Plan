import type EmailRepository from '@/domain/email/EmailRepository';
import { Email } from '@/domain/email/Email';

export class SendPaymentConfirmationUseCase {
  constructor(private readonly emailRepository: EmailRepository) {}

  async execute(data: {
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
    try {
      const email = Email.create({
        reservationId: data.reservationId,
        bookingId: data.bookingId,
        clientEmail: data.clientEmail,
        clientName: data.clientName,
        serviceName: data.serviceName,
        totalPrice: data.totalPrice,
        currency: data.currency,
        emailType: 'payment_confirmation',
        status: 'pending',
        metadata: data.metadata,
      });

      const result = await this.emailRepository.sendPaymentConfirmationEmail(
        email
      );

      if (result.success) {
        console.log('âœ… Email sent successfully');
        console.log('ðŸ"" Message ID:', result.messageId);
      } else {
        console.error('âŒ Failed to send email:', result.error);
      }

      return result;
    } catch (error) {
      console.error('âŒ SendPaymentConfirmationUseCase Error:', error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to send confirmation email';

      return {
        success: false,
        error: errorMessage,
      };
    }
  }
}
