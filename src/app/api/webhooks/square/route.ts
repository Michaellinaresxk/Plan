// src/app/api/webhooks/square/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { paymentService } from '@/primary/payment';
import crypto from 'crypto';

/**
 * Webhook handler para Square
 * Square envía notificaciones sobre eventos de pagos
 * Documentación: https://developer.squareup.com/docs/webhooks/overview
 */

// Verificar firma del webhook de Square
function verifySquareSignature(
  body: string,
  signature: string,
  signatureKey: string
): boolean {
  try {
    const hmac = crypto.createHmac('sha256', signatureKey);
    const hash = hmac.update(body).digest('base64');
    return hash === signature;
  } catch (error) {
    console.error('❌ Error verifying signature:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  console.log('🎯 Square Webhook API called');

  try {
    // Obtener el cuerpo del request como texto (necesario para verificar firma)
    const rawBody = await request.text();

    // Obtener la firma del header
    const signature = request.headers.get('x-square-signature');
    const signatureKey = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY;

    // Verificar que tenemos los datos necesarios
    if (!signature) {
      console.error('❌ Missing Square signature header');
      return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
    }

    if (!signatureKey) {
      console.error('❌ SQUARE_WEBHOOK_SIGNATURE_KEY not configured');
      return NextResponse.json(
        { error: 'Webhook signature key not configured' },
        { status: 500 }
      );
    }

    // Verificar la firma del webhook
    const isValid = verifySquareSignature(rawBody, signature, signatureKey);

    if (!isValid) {
      console.error('❌ Invalid Square webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    console.log('✅ Square webhook signature verified');

    // Parsear el cuerpo como JSON
    const webhookData = JSON.parse(rawBody);

    console.log('📥 Webhook event type:', webhookData.type);
    console.log('📥 Webhook data:', JSON.stringify(webhookData, null, 2));

    // Procesar el webhook
    await paymentService.handleWebhook(webhookData);

    console.log('✅ Webhook processed successfully');

    // Square espera una respuesta 200 OK
    return NextResponse.json({
      success: true,
      message: 'Webhook processed',
    });
  } catch (error: any) {
    console.error('❌ Webhook processing error:', error);

    // Aún así devolvemos 200 para evitar que Square reintente
    // pero loggeamos el error internamente
    return NextResponse.json(
      {
        success: false,
        error: 'Webhook processing failed',
        message: error.message,
        details:
          process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 200 } // 200 para que Square no reintente
    );
  }
}

// Square también puede enviar GET requests para verificar el endpoint
export async function GET(request: NextRequest) {
  console.log('🎯 Square Webhook verification GET request');

  return NextResponse.json({
    status: 'ok',
    message: 'Square webhook endpoint is active',
    timestamp: new Date().toISOString(),
  });
}
