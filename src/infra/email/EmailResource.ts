// infra/email/EmailResource.ts

import type EmailRepository from '@/domain/email/EmailRepository';
import type { Email } from '@/domain/email/Email';
import { EmailCaller } from './EmailCaller';

/**
 * EmailResource - Implementa EmailRepository
 *
 * Responsabilidades:
 * - Implementar la interfaz del dominio
 * - Delegar el envío al EmailCaller
 * - Transformar entre domain y infra si es necesario
 *
 * En este caso, no necesitamos guardar en Firebase porque
 * el email se envía directamente via Resend
 */
export class EmailResource implements EmailRepository {
  constructor(private readonly emailCaller: EmailCaller) {
    console.log('📧 EmailResource initialized');
  }

  /**
   * Enviar email de confirmación de pago
   *
   * @param email - Entidad de dominio Email
   * @returns Resultado del envío con messageId si es exitoso
   */
  async sendPaymentConfirmationEmail(email: Email): Promise<{
    success: boolean;
    messageId?: string;
    error?: string;
  }> {
    try {
      console.log(
        '📧 EmailResource - Sending payment confirmation email to:',
        email.clientEmail
      );

      // Preparar datos para el EmailCaller
      const emailData = {
        reservationId: email.reservationId,
        bookingId: email.bookingId,
        clientEmail: email.clientEmail,
        clientName: email.clientName,
        serviceName: email.serviceName,
        emailType: email.emailType,
        totalPrice: email.totalPrice,
        currency: email.currency,
        metadata: email.metadata,
      };

      // Delegar al EmailCaller
      const result = await this.emailCaller.sendPaymentConfirmationEmail(
        emailData
      );

      if (result.success) {
        console.log('✅ EmailResource - Email sent successfully');
        console.log('📬 Message ID:', result.messageId);
      } else {
        console.error('❌ EmailResource - Failed to send email:', result.error);
      }

      return result;
    } catch (error) {
      console.error('❌ EmailResource - Error:', error);

      const errorMessage =
        error instanceof Error ? error.message : 'Failed to send email';

      return {
        success: false,
        error: errorMessage,
      };
    }
  }
}
