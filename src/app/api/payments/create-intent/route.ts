// src/app/api/payments/create-intent/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { paymentService } from '@/primary/payment'; // Usar el servicio

export async function POST(request: NextRequest) {
  console.log('🎯 Payment Intent API called');

  try {
    const body = await request.json();
    console.log('📥 Request body:', body);

    const { reservationId, amount, currency, metadata } = body;

    // Validation
    if (!reservationId || !amount || !currency) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be greater than 0' },
        { status: 400 }
      );
    }

    console.log('📄 Creating payment intent with service...');

    // Usar el servicio en lugar de Stripe directamente
    const result = await paymentService.createPaymentIntent({
      reservationId,
      amount: Math.round(amount),
      currency: currency.toLowerCase(),
      metadata,
    });

    console.log('✅ Payment intent created:', result.paymentIntentId);

    return NextResponse.json({
      clientSecret: result.clientSecret,
      paymentIntentId: result.paymentIntentId,
    });
  } catch (error: any) {
    console.error('❌ Payment intent error:', error);

    return NextResponse.json(
      {
        error: 'Failed to create payment intent',
        message: error.message,
        details:
          process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
