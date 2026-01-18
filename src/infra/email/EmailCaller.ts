// infra/email/EmailCaller.ts

import { Resend } from 'resend';
import type { ApiEmail, CreateEmailData } from './ApiEmail';

/**
 * EmailCaller - Comunica con Resend API
 *
 * Responsabilidades:
 * - Enviar email a través de Resend
 * - Construir HTML del email
 * - Manejar respuesta de Resend
 *
 * ÚNICO que sabe de Resend
 */
export class EmailCaller {
  private client: Resend;
  private readonly fromEmail: string;
  private readonly fromName: string;

  constructor() {
    // ðŸš¨ VERIFICAR QUE ESTAMOS EN EL SERVIDOR
    if (typeof window !== 'undefined') {
      throw new Error('EmailCaller can only be used on the server side');
    }

    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      console.error('âŒ RESEND_API_KEY not found in environment variables');
      throw new Error('RESEND_API_KEY environment variable is required');
    }

    this.client = new Resend(apiKey);
    this.fromEmail =
      process.env.RESEND_FROM_EMAIL || 'noreply@luxpuntacana.com';
    this.fromName = process.env.RESEND_FROM_NAME || 'Luxe Punta Cana Concierge';

    console.log('ðŸ"§ EmailCaller initialized');
  }

  /**
   * Enviar email de confirmación de pago
   *
   * @param data - Datos del email a enviar
   * @returns { success, messageId, error? }
   */
  async sendPaymentConfirmationEmail(data: CreateEmailData): Promise<{
    success: boolean;
    messageId?: string;
    error?: string;
  }> {
    try {
      console.log(
        'ðŸ"§ EmailCaller - Sending payment confirmation to:',
        data.clientEmail
      );

      // Validar datos requeridos
      if (!data.clientEmail) {
        throw new Error('Client email is required');
      }

      if (!data.clientName) {
        throw new Error('Client name is required');
      }

      // Construir HTML del email
      const emailHtml = this.buildPaymentConfirmationHTML(data);

      // Enviar a Resend
      const response = await this.client.emails.send({
        from: `${this.fromName} <${this.fromEmail}>`,
        to: data.clientEmail,
        subject: `Payment Confirmation - ${data.serviceName} | Luxe Punta Cana`,
        html: emailHtml,
        replyTo: this.fromEmail,
        headers: {
          'X-Booking-Id': data.bookingId,
          'X-Email-Type': 'payment-confirmation',
        },
      });

      if (!response.data?.id) {
        throw new Error('No message ID returned from Resend');
      }

      console.log('âœ… Email sent successfully');
      console.log('ðŸ"" Message ID:', response.data.id);

      return {
        success: true,
        messageId: response.data.id,
      };
    } catch (error) {
      console.error('âŒ EmailCaller - Error sending email:', error);

      const errorMessage =
        error instanceof Error ? error.message : 'Failed to send email';

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Construir HTML profesional para email de confirmación
   * Estilos inline para máxima compatibilidad
   */
  private buildPaymentConfirmationHTML(data: CreateEmailData): string {
    const priceFormatted = `$${(data.totalPrice / 100).toFixed(2)}`;

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
              line-height: 1.6;
              color: #333;
              background-color: #f5f5f5;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
            }
            .header {
              background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
              color: white;
              padding: 40px 20px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: bold;
            }
            .content {
              padding: 40px 20px;
            }
            .section {
              margin-bottom: 30px;
              padding: 20px;
              background-color: #f9fafb;
              border-radius: 8px;
              border-left: 4px solid #2563eb;
            }
            .section-title {
              font-size: 14px;
              font-weight: 600;
              color: #6b7280;
              text-transform: uppercase;
              margin-bottom: 15px;
              letter-spacing: 0.5px;
            }
            .detail-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 10px;
              font-size: 15px;
            }
            .detail-label {
              color: #6b7280;
              font-weight: 500;
            }
            .detail-value {
              color: #1f2937;
              font-weight: 600;
            }
            .amount-value {
              color: #10b981;
              font-size: 32px;
              font-weight: bold;
              margin-top: 10px;
            }
            .footer {
              background-color: #f9fafb;
              padding: 20px;
              text-align: center;
              border-top: 1px solid #e5e7eb;
              font-size: 12px;
              color: #6b7280;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <!-- Header -->
            <div class="header">
              <h1>✓ Payment Confirmed</h1>
            </div>

            <!-- Content -->
            <div class="content">
              <h2 style="margin-top: 0;">Hi ${this.escapeHTML(
                data.clientName
              )},</h2>

              <p style="color: #6b7280;">
                Thank you for your payment! Your reservation has been confirmed.
              </p>

              <!-- Amount Section -->
              <div class="section">
                <div class="section-title">Amount Paid</div>
                <div class="amount-value">${priceFormatted}</div>
                <div class="detail-row" style="margin-top: 15px;">
                  <span class="detail-label">Currency:</span>
                  <span class="detail-value">${data.currency.toUpperCase()}</span>
                </div>
              </div>

              <!-- Reservation Details Section -->
              <div class="section">
                <div class="section-title">Reservation Details</div>
                <div class="detail-row">
                  <span class="detail-label">Service:</span>
                  <span class="detail-value">${this.escapeHTML(
                    data.serviceName
                  )}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Booking ID:</span>
                  <span class="detail-value" style="font-size: 13px; font-family: monospace;">
                    ${this.escapeHTML(data.bookingId)}
                  </span>
                </div>
              </div>

              <!-- Contact Info -->
              <div class="section">
                <div class="section-title">Questions?</div>
                <p style="margin: 0; font-size: 14px;">
                  Contact our concierge team at
                  <strong>${this.fromEmail}</strong> or call
                  <strong>+1 302-724-8080</strong>
                </p>
              </div>
            </div>

            <!-- Footer -->
            <div class="footer">
              <p style="margin: 0; font-weight: 600; color: #1f2937;">
                Luxe Punta Cana - Your Luxury Concierge
              </p>
              <p style="margin: 10px 0 0 0;">
                © ${new Date().getFullYear()} Luxe Punta Cana. All rights reserved.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Escapar HTML para prevenir XSS
   */
  private escapeHTML(text: string): string {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Probar conexión con Resend
   */
  async testConnection(): Promise<{
    connected: boolean;
    error?: string;
  }> {
    try {
      console.log('ðŸ§ª Testing Resend connection...');

      const response = await this.client.emails.send({
        from: `${this.fromName} <${this.fromEmail}>`,
        to: 'delivered@resend.dev',
        subject: 'Test Email',
        html: '<p>Test</p>',
      });

      if (response.data?.id) {
        console.log('âœ… Resend connection successful');
        return { connected: true };
      }

      throw new Error('No message ID returned');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      return { connected: false, error: errorMessage };
    }
  }
}
