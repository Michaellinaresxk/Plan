// src/app/api/payments/create-intent/route.ts
// Creates a PaymentIntent without confirming it — returns clientSecret to the frontend.
// Used by TestApi and any flow that needs client-side confirmation.
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  console.log('🎯 Create Payment Intent API called');

  try {
    const body = await request.json();
    const { reservationId, amount, currency, metadata } = body;

    if (!reservationId || !amount || !currency) {
      return NextResponse.json(
        { error: 'Missing required fields: reservationId, amount, currency' },
        { status: 400 },
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be greater than 0' },
        { status: 400 },
      );
    }

    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json(
        { error: 'Stripe is not configured' },
        { status: 500 },
      );
    }

    const stripe = new Stripe(secretKey);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount),
      currency: currency.toLowerCase(),
      automatic_payment_methods: { enabled: true },
      metadata: {
        reservationId,
        ...(metadata ?? {}),
      },
    });

    console.log('✅ PaymentIntent created:', paymentIntent.id);

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error: any) {
    console.error('❌ Create payment intent error:', error);
    return NextResponse.json(
      {
        error: 'Failed to create payment intent',
        message: error.message,
        details:
          process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 },
    );
  }
}
