// src/app/api/payments/create-intent/route.ts
import { NextRequest, NextResponse } from 'next/server';

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

    // Check environment variables
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('❌ STRIPE_SECRET_KEY not found');
      return NextResponse.json(
        { error: 'Stripe configuration missing' },
        { status: 500 }
      );
    }

    console.log('🔄 Creating payment intent with Stripe...');

    // Import Stripe directly
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount),
      currency: currency.toLowerCase(),
      automatic_payment_methods: { enabled: true },
      metadata: {
        reservationId,
        ...metadata,
      },
    });

    if (!paymentIntent.client_secret) {
      throw new Error('Failed to create payment intent - no client secret');
    }

    console.log('✅ Payment intent created:', paymentIntent.id);

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
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

export async function GET() {
  return NextResponse.json({
    message: 'Payment Intent API is working',
    timestamp: new Date().toISOString(),
    methods: ['POST'],
  });
}
