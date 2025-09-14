// app/api/contact/route.ts - VERSIÓN DEBUG
import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

// Verificar que la API key existe
console.log('🔑 API Key existe:', !!process.env.RESEND_API_KEY);
console.log(
  '🔑 API Key empieza con re_:',
  process.env.RESEND_API_KEY?.startsWith('re_')
);

const resend = new Resend(process.env.RESEND_API_KEY);

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  _honeypot?: string;
}

function validateFormData(data: ContactFormData): string | null {
  if (!data.name?.trim()) return 'El nombre es requerido';
  if (!data.email?.trim()) return 'El email es requerido';
  if (!data.message?.trim()) return 'El mensaje es requerido';

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) return 'Email inválido';

  return null;
}

export async function POST(request: NextRequest) {
  console.log('📨 API route contact llamada');

  try {
    // Verificar si Resend está inicializado
    if (!process.env.RESEND_API_KEY) {
      console.error('❌ RESEND_API_KEY no está configurada');
      return NextResponse.json(
        { error: 'Configuración del servidor incorrecta' },
        { status: 500 }
      );
    }

    console.log('📝 Parseando body...');
    const body: ContactFormData = await request.json();
    console.log('✅ Body parseado:', {
      name: body.name,
      email: body.email,
      hasMessage: !!body.message,
    });

    // Validación
    const validationError = validateFormData(body);
    if (validationError) {
      console.log('❌ Error de validación:', validationError);
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    console.log('📧 Intentando enviar email...');

    // Envío del email
    const { data, error } = await resend.emails.send({
      from: 'LuxPuntaCana <noreply@luxpuntacana.com>',
      to: ['info@luxpuntacana.com'],
      replyTo: body.email,
      subject: `[CONTACTO] ${body.subject || 'Nueva consulta'} - ${body.name}`,
      html: `
        <h2>Nuevo mensaje de contacto</h2>
        <p><strong>Nombre:</strong> ${body.name}</p>
        <p><strong>Email:</strong> ${body.email}</p>
        <p><strong>Asunto:</strong> ${body.subject || 'No especificado'}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${body.message}</p>
      `,
    });

    if (error) {
      console.error('❌ Error de Resend:', error);
      console.error('❌ Error detalles:', JSON.stringify(error, null, 2));
      return NextResponse.json(
        {
          error:
            'Error al enviar email: ' +
            (error.message || JSON.stringify(error)),
        },
        { status: 500 }
      );
    }

    console.log('✅ Email enviado exitosamente:', data);
    return NextResponse.json(
      {
        message: 'Mensaje enviado correctamente',
        id: data?.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('💥 Error en API route:', error);
    console.error('💥 Error stack:', (error as Error).stack);
    return NextResponse.json(
      { error: 'Error interno: ' + (error as Error).message },
      { status: 500 }
    );
  }
}
