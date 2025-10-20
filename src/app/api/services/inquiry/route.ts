// 📁 app/api/services/inquiry/route.ts

import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

interface ServiceInquiryData {
  // Datos del servicio
  serviceName: string;
  serviceType: string; // 'catamaran', 'yacht', 'lux-catamaran'

  // Datos del cliente
  customerName: string;
  customerEmail: string;
  customerPhone: string;

  // Detalles de la reserva
  tourDate?: string;
  timeSlot?: string;
  location?: string;

  // Participantes
  adultCount?: number;
  childCount?: number;
  totalGuests?: number;

  // Precio
  totalPrice?: number;

  // Mensaje/Notas
  message?: string;
  specialRequests?: string;
}

export async function POST(request: NextRequest) {
  try {
    console.log('📧 Service inquiry API called');

    // 1️⃣ Parse body
    const body: ServiceInquiryData = await request.json();
    console.log('📨 Received data:', body);

    // 2️⃣ Validación básica
    if (!body.customerName?.trim()) {
      return NextResponse.json(
        { error: 'Customer name is required' },
        { status: 400 }
      );
    }

    if (!body.customerEmail?.trim()) {
      return NextResponse.json(
        { error: 'Customer email is required' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.customerEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // 3️⃣ Construir el HTML del email
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .info-row { margin: 15px 0; padding: 10px; background: white; border-radius: 5px; }
          .label { font-weight: bold; color: #667eea; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🛥️ Nueva Consulta de Servicio</h1>
            <p>LuxPuntaCana - ${body.serviceName}</p>
          </div>
          
          <div class="content">
            <h2>Detalles de la Consulta</h2>
            
            <div class="info-row">
              <span class="label">Servicio:</span> ${body.serviceName}
            </div>
            
            <div class="info-row">
              <span class="label">Tipo:</span> ${body.serviceType}
            </div>
            
            <div class="info-row">
              <span class="label">Cliente:</span> ${body.customerName}
            </div>
            
            <div class="info-row">
              <span class="label">Email:</span> 
              <a href="mailto:${body.customerEmail}">${body.customerEmail}</a>
            </div>
            
            <div class="info-row">
              <span class="label">Teléfono:</span> 
              <a href="tel:${body.customerPhone}">${body.customerPhone}</a>
            </div>
            
            ${
              body.tourDate
                ? `
              <div class="info-row">
                <span class="label">Fecha del Tour:</span> ${body.tourDate}
              </div>
            `
                : ''
            }
            
            ${
              body.timeSlot
                ? `
              <div class="info-row">
                <span class="label">Horario:</span> ${body.timeSlot}
              </div>
            `
                : ''
            }
            
            ${
              body.location
                ? `
              <div class="info-row">
                <span class="label">Ubicación:</span> ${body.location}
              </div>
            `
                : ''
            }
            
            ${
              body.adultCount
                ? `
              <div class="info-row">
                <span class="label">Adultos:</span> ${body.adultCount}
              </div>
            `
                : ''
            }
            
            ${
              body.childCount
                ? `
              <div class="info-row">
                <span class="label">Niños:</span> ${body.childCount}
              </div>
            `
                : ''
            }
            
            ${
              body.totalPrice
                ? `
              <div class="info-row">
                <span class="label">Precio Total:</span> $${body.totalPrice.toFixed(
                  2
                )} USD
              </div>
            `
                : ''
            }
            
            ${
              body.message || body.specialRequests
                ? `
              <div class="info-row">
                <span class="label">Mensaje/Solicitudes Especiales:</span>
                <p>${body.message || body.specialRequests}</p>
              </div>
            `
                : ''
            }
          </div>
        </div>
      </body>
      </html>
    `;

    // 4️⃣ Enviar email con Resend
    console.log('📤 Sending email via Resend...');

    const { data, error } = await resend.emails.send({
      from: 'LuxPuntaCana <noreply@luxpuntacana.com>',
      to: ['info@luxpuntacana.com'],
      replyTo: body.customerEmail,
      subject: `🔔 Nueva Consulta: ${body.serviceName} - ${body.customerName}`,
      html: emailHtml,
    });

    // 5️⃣ Manejo de errores de Resend
    if (error) {
      console.error('❌ Resend error:', error);
      return NextResponse.json(
        {
          error:
            'Failed to send email: ' + (error.message || JSON.stringify(error)),
        },
        { status: 500 }
      );
    }

    // 6️⃣ Éxito
    console.log('✅ Email sent successfully:', data?.id);

    return NextResponse.json(
      {
        success: true,
        message: 'Inquiry sent successfully',
        emailId: data?.id,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('💥 Service inquiry API error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}
