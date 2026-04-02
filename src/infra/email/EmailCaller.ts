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
        subject: `Booking Confirmed — ${data.serviceName} | Lux Punta Cana LLC`,
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
   * Construir HTML premium para email de confirmación de pago
   * Diseño: fondo crema, tipografía serif dorada, estilo Lux Punta Cana
   * Estilos inline para máxima compatibilidad con clientes de email
   */
  private buildPaymentConfirmationHTML(data: CreateEmailData): string {
    const priceFormatted = `$${(data.totalPrice / 100).toFixed(2)} ${data.currency.toUpperCase()}`;

    // Campos opcionales desde metadata
    const location = data.metadata?.location as string | undefined;
    const activityDate = data.metadata?.activityDate as string | undefined;
    const numberOfPeople = data.metadata?.numberOfPeople as string | number | undefined;
    const paymentMethod = data.metadata?.paymentMethod as string | undefined;

    const paymentLine = paymentMethod
      ? `${priceFormatted} — ${this.escapeHTML(paymentMethod)}`
      : priceFormatted;

    return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Confirmation — Lux Punta Cana LLC</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f0ebe0;font-family:Georgia,'Times New Roman',serif;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f0ebe0;">
      <tr>
        <td align="center" style="padding:40px 20px;">

          <!-- Card -->
          <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background-color:#faf7f0;border-radius:2px;">

            <!-- Logo -->
            <tr>
              <td align="center" style="padding:48px 40px 8px 40px;">
                <table cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="font-family:Georgia,'Times New Roman',serif;font-size:52px;font-weight:normal;color:#b8971f;line-height:1;letter-spacing:-1px;">
                      <span style="font-size:64px;vertical-align:bottom;line-height:0.8;">l</span>ux
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Main Headline -->
            <tr>
              <td align="center" style="padding:16px 40px 8px 40px;">
                <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:30px;font-weight:normal;color:#8b6914;line-height:1.3;text-align:center;">
                  Your luxury experience<br>is confirmed!
                </h1>
              </td>
            </tr>

            <!-- Subtitle -->
            <tr>
              <td align="center" style="padding:12px 60px 32px 60px;">
                <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:15px;color:#6b5a2e;line-height:1.6;text-align:center;">
                  Thank you for trusting Lux Punta Cana LLC to make<br>your stay an unforgettable memory.
                </p>
              </td>
            </tr>

            <!-- Thin gold divider -->
            <tr>
              <td align="center" style="padding:0 40px;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr><td style="height:1px;background-color:#d4b96a;"></td></tr>
                </table>
              </td>
            </tr>

            <!-- Body Content -->
            <tr>
              <td style="padding:36px 48px 16px 48px;">

                <!-- Greeting -->
                <p style="margin:0 0 6px 0;font-family:Georgia,'Times New Roman',serif;font-size:16px;color:#2c2416;">
                  Hello <strong>${this.escapeHTML(data.clientName)}</strong>.
                </p>
                <p style="margin:0 0 28px 0;font-family:Georgia,'Times New Roman',serif;font-size:15px;color:#4a3e28;line-height:1.6;">
                  We are pleased to confirm your reservation:
                </p>

                <!-- Details list -->
                <table width="100%" cellpadding="0" cellspacing="0" border="0">

                  <!-- Activity -->
                  <tr>
                    <td style="padding:8px 0;vertical-align:top;">
                      <table cellpadding="0" cellspacing="0" border="0" width="100%">
                        <tr>
                          <td width="28" style="font-size:18px;vertical-align:top;padding-top:1px;">&#128197;</td>
                          <td style="font-family:Georgia,'Times New Roman',serif;font-size:15px;color:#2c2416;line-height:1.5;">
                            <strong>Activity:</strong> ${this.escapeHTML(data.serviceName)}
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  ${location ? `
                  <!-- Location -->
                  <tr>
                    <td style="padding:8px 0;vertical-align:top;">
                      <table cellpadding="0" cellspacing="0" border="0" width="100%">
                        <tr>
                          <td width="28" style="font-size:18px;vertical-align:top;padding-top:1px;">&#128205;</td>
                          <td style="font-family:Georgia,'Times New Roman',serif;font-size:15px;color:#2c2416;line-height:1.5;">
                            <strong>Location / Meeting point:</strong> ${this.escapeHTML(location)}
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  ` : ''}

                  ${activityDate ? `
                  <!-- Date & Time -->
                  <tr>
                    <td style="padding:8px 0;vertical-align:top;">
                      <table cellpadding="0" cellspacing="0" border="0" width="100%">
                        <tr>
                          <td width="28" style="font-size:18px;vertical-align:top;padding-top:1px;">&#128336;</td>
                          <td style="font-family:Georgia,'Times New Roman',serif;font-size:15px;color:#2c2416;line-height:1.5;">
                            <strong>Date &amp; Time:</strong> ${this.escapeHTML(activityDate)}
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  ` : ''}

                  ${numberOfPeople ? `
                  <!-- Number of People -->
                  <tr>
                    <td style="padding:8px 0;vertical-align:top;">
                      <table cellpadding="0" cellspacing="0" border="0" width="100%">
                        <tr>
                          <td width="28" style="font-size:18px;vertical-align:top;padding-top:1px;">&#128100;</td>
                          <td style="font-family:Georgia,'Times New Roman',serif;font-size:15px;color:#2c2416;line-height:1.5;">
                            <strong>Number of guests:</strong> ${this.escapeHTML(String(numberOfPeople))}
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  ` : ''}

                  <!-- Payment -->
                  <tr>
                    <td style="padding:8px 0;vertical-align:top;">
                      <table cellpadding="0" cellspacing="0" border="0" width="100%">
                        <tr>
                          <td width="28" style="font-size:18px;vertical-align:top;padding-top:1px;">&#128179;</td>
                          <td style="font-family:Georgia,'Times New Roman',serif;font-size:15px;color:#2c2416;line-height:1.5;">
                            <strong>Payment received:</strong> ${this.escapeHTML(paymentLine)}
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                </table>

              </td>
            </tr>

            <!-- Coordinator note -->
            <tr>
              <td style="padding:8px 48px 24px 48px;">
                <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:15px;color:#4a3e28;line-height:1.7;">
                  Your assigned coordinator will reach out to you before the activity to confirm the final details or any special requirements.
                </p>
              </td>
            </tr>

            <!-- Important note -->
            <tr>
              <td style="padding:0 48px 24px 48px;">
                <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:15px;color:#4a3e28;line-height:1.7;">
                  <strong>Important note:</strong> Please make sure to be at the meeting point at least 15 minutes in advance.
                </p>
              </td>
            </tr>

            <!-- Modify / Cancel -->
            <tr>
              <td style="padding:0 48px 40px 48px;">
                <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:15px;color:#4a3e28;line-height:1.7;">
                  If you need to modify or cancel your reservation, contact us at
                  <a href="tel:+13027248030" style="color:#b8971f;text-decoration:none;font-weight:bold;">+1 302-724-8030</a>
                  (WhatsApp or iMessage).
                </p>
              </td>
            </tr>

            <!-- Thin gold divider -->
            <tr>
              <td align="center" style="padding:0 40px;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr><td style="height:1px;background-color:#d4b96a;"></td></tr>
                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td align="center" style="padding:32px 40px 40px 40px;">
                <p style="margin:0 0 6px 0;font-family:Georgia,'Times New Roman',serif;font-size:13px;font-weight:bold;color:#8b6914;letter-spacing:2px;text-transform:uppercase;">
                  LUX PUNTA CANA LLC
                </p>
                <p style="margin:0 0 10px 0;font-family:Georgia,'Times New Roman',serif;font-size:12px;color:#9e8a5e;letter-spacing:1px;">
                  Luxury Experiences&nbsp;&nbsp;|&nbsp;&nbsp;Private Services&nbsp;&nbsp;|&nbsp;&nbsp;Signature Moments
                </p>
                <p style="margin:0 0 4px 0;font-family:Georgia,'Times New Roman',serif;font-size:12px;color:#9e8a5e;">
                  info@luxpuntacana.com
                </p>
                <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:12px;color:#9e8a5e;">
                  www.luxpuntacana.com
                </p>
              </td>
            </tr>

          </table>
          <!-- /Card -->

        </td>
      </tr>
    </table>
  </body>
</html>`;
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
