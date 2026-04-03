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
  private readonly adminEmail: string;

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
    this.adminEmail =
      process.env.RESEND_ADMIN_EMAIL || 'info@luxpuntacana.com';

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
        data.clientEmail,
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
        bcc: this.adminEmail,
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
    const priceFormatted = `$${data.totalPrice.toFixed(2)} ${data.currency.toUpperCase()}`;

    // Campos opcionales desde metadata
    const location = data.metadata?.location as string | undefined;
    const activityDate = data.metadata?.activityDate as string | undefined;
    const numberOfPeople = data.metadata?.numberOfPeople as
      | string
      | number
      | undefined;
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
  <body style="margin:0;padding:0;background-color:#1a1714;font-family:'Montserrat','Helvetica Neue',Helvetica,Arial,sans-serif;line-height:1.6;-webkit-text-size-adjust:100%;">

    <!-- Preheader -->
    <div style="display:none;max-height:0;overflow:hidden;">
      Your luxury experience is confirmed — Lux Punta Cana LLC
    </div>

    <!-- Wrapper -->
    <div style="display:flex;justify-content:center;padding:32px 16px;">

      <!-- Card -->
      <div style="width:100%;max-width:600px;background-color:#faf8f3;">

        <!-- Top gold bar -->
        <div style="height:3px;background:linear-gradient(90deg,#c9a84c,#e8d5a0,#c9a84c);"></div>

        <!-- Logo -->
        <div style="display:flex;flex-direction:column;align-items:center;padding:44px 40px 0;">
          <div style="font-family:'Cormorant Garamond',Georgia,serif;font-size:48px;font-weight:300;color:#c9a84c;letter-spacing:8px;text-transform:uppercase;line-height:1;">LUX</div>
          <div style="margin-top:6px;font-size:9px;font-weight:500;color:#b09a6a;letter-spacing:5px;text-transform:uppercase;">PUNTA CANA</div>
        </div>

        <!-- Hero -->
        <div style="display:flex;flex-direction:column;align-items:center;padding:40px 48px;">
          <div style="width:40px;height:1px;background-color:#c9a84c;margin-bottom:24px;"></div>
          <h1 style="margin:0;font-family:'Cormorant Garamond',Georgia,serif;font-size:32px;font-weight:400;color:#2c2416;line-height:1.35;text-align:center;letter-spacing:0.5px;">
            Your experience<br>has been confirmed
          </h1>
          <p style="margin:16px 0 0;font-size:13px;font-weight:300;color:#7a6e5a;line-height:1.7;text-align:center;letter-spacing:0.3px;">
            Thank you for choosing Lux Punta Cana.<br>Every detail has been arranged for you.
          </p>
        </div>

        <!-- Details card -->
        <div style="margin:0 32px;padding:32px;background-color:#f3efe6;border-left:2px solid #c9a84c;">

          <div style="font-size:12px;font-weight:500;color:#b09a6a;text-transform:uppercase;letter-spacing:3px;">Reservation Details</div>

          <div style="margin-top:16px;font-family:'Cormorant Garamond',Georgia,serif;font-size:20px;font-weight:400;color:#2c2416;line-height:1.4;">
            Hello <strong style="font-weight:600;">${this.escapeHTML(data.clientName)}</strong>
          </div>
          <div style="margin-top:4px;font-size:13px;font-weight:300;color:#7a6e5a;">
            We are pleased to confirm the following:
          </div>

          <div style="height:1px;background-color:#ddd5c3;margin:24px 0;"></div>

          <!-- Activity -->
          <div style="margin-bottom:18px;">
            <div style="font-size:10px;font-weight:500;color:#b09a6a;text-transform:uppercase;letter-spacing:2px;margin-bottom:4px;">Activity</div>
            <div style="font-family:'Cormorant Garamond',Georgia,serif;font-size:18px;font-weight:500;color:#2c2416;line-height:1.4;">${this.escapeHTML(data.serviceName)}</div>
          </div>

          ${
            location
              ? `
          <!-- Location -->
          <div style="margin-bottom:18px;">
            <div style="font-size:10px;font-weight:500;color:#b09a6a;text-transform:uppercase;letter-spacing:2px;margin-bottom:4px;">Meeting Point</div>
            <div style="font-size:14px;font-weight:400;color:#2c2416;line-height:1.5;">${this.escapeHTML(location)}</div>
          </div>
          `
              : ''
          }

          <!-- Date & Guests -->
          <div style="display:flex;flex-wrap:wrap;gap:18px 32px;margin-bottom:18px;">
            ${
              activityDate
                ? `
            <div style="flex:1 1 180px;min-width:0;">
              <div style="font-size:10px;font-weight:500;color:#b09a6a;text-transform:uppercase;letter-spacing:2px;margin-bottom:4px;">Date &amp; Time</div>
              <div style="font-size:14px;font-weight:400;color:#2c2416;line-height:1.5;">${this.escapeHTML(activityDate)}</div>
            </div>
            `
                : ''
            }
            ${
              numberOfPeople
                ? `
            <div style="flex:1 1 80px;min-width:0;">
              <div style="font-size:10px;font-weight:500;color:#b09a6a;text-transform:uppercase;letter-spacing:2px;margin-bottom:4px;">Guests</div>
              <div style="font-size:14px;font-weight:400;color:#2c2416;line-height:1.5;">${this.escapeHTML(String(numberOfPeople))}</div>
            </div>
            `
                : ''
            }
          </div>

          <!-- Payment -->
          <div>
            <div style="font-size:10px;font-weight:500;color:#b09a6a;text-transform:uppercase;letter-spacing:2px;margin-bottom:4px;">Payment Received</div>
            <div style="font-family:'Cormorant Garamond',Georgia,serif;font-size:22px;font-weight:600;color:#2c2416;line-height:1.4;">${this.escapeHTML(paymentLine)}</div>
          </div>

        </div>

        <!-- Notes -->
        <div style="padding:36px 32px 0;">
          <div style="font-size:13px;font-weight:300;color:#5c5242;line-height:1.75;letter-spacing:0.2px;margin-bottom:20px;">
            Your personal coordinator will contact you before the activity to confirm final details and accommodate any special requests.
          </div>

          <div style="display:flex;align-items:flex-start;gap:12px;padding:16px 20px;background-color:#f3efe6;">
            <span style="color:#c9a84c;font-size:8px;line-height:1;flex-shrink:0;margin-top:4px;">&#9679;</span>
            <div style="font-size:12px;font-weight:400;color:#5c5242;line-height:1.6;">
              Please arrive at the meeting point at least <strong style="font-weight:600;color:#2c2416;">15 minutes</strong> before the scheduled time.
            </div>
          </div>
        </div>

        <!-- CTA -->
        <div style="display:flex;flex-direction:column;align-items:center;padding:36px 32px 0;">
          <div style="font-size:11px;font-weight:500;color:#b09a6a;text-transform:uppercase;letter-spacing:3px;margin-bottom:16px;">Need to make changes?</div>
          <a href="https://wa.me/13027248030" target="_blank" style="display:inline-block;padding:14px 36px;border:1px solid #c9a84c;font-family:'Montserrat','Helvetica Neue',Arial,sans-serif;font-size:12px;font-weight:500;color:#c9a84c;text-decoration:none;letter-spacing:2px;text-transform:uppercase;">
            Contact Us via WhatsApp
          </a>
          <div style="margin-top:12px;font-size:12px;font-weight:300;color:#9e8a5e;">
            or call <a href="tel:+13027248030" style="color:#c9a84c;text-decoration:none;font-weight:400;">+1 302-724-8030</a>
          </div>
        </div>

        <!-- Divider -->
        <div style="height:1px;background-color:#ddd5c3;margin:40px 32px 0;"></div>

        <!-- Footer -->
        <div style="display:flex;flex-direction:column;align-items:center;padding:32px 32px 44px;">
          <div style="font-family:'Cormorant Garamond',Georgia,serif;font-size:24px;font-weight:300;color:#c9a84c;letter-spacing:6px;text-transform:uppercase;">LUX</div>
          <div style="margin-top:12px;font-size:10px;font-weight:400;color:#b09a6a;letter-spacing:3px;text-transform:uppercase;">
            Luxury Experiences
          </div>
          <div style="margin-top:16px;font-size:11px;font-weight:300;color:#9e8a5e;">
            <a href="https://www.luxpuntacana.com" style="color:#9e8a5e;text-decoration:none;">luxpuntacana.com</a>
          </div>
        </div>

        <!-- Bottom gold bar -->
        <div style="height:3px;background:linear-gradient(90deg,#c9a84c,#e8d5a0,#c9a84c);"></div>

      </div>
    </div>

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
