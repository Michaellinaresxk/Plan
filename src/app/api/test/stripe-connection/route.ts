// src/app/api/test/stripe-connection/route.ts
import paymentService from '@/primary/payment';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  console.log('🧪 Connection test API called');

  try {
    const result = {
      timestamp: new Date().toISOString(),
      environment: {
        publishableKey: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
        secretKey: !!process.env.STRIPE_SECRET_KEY,
        publishableKeyFormat:
          process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.startsWith('pk_'),
        secretKeyFormat: process.env.STRIPE_SECRET_KEY?.startsWith('sk_'),
      },
      services: {
        paymentServiceExists: !!paymentService,
        hasCreatePaymentIntent:
          typeof paymentService.createPaymentIntent === 'function',
        hasProcessPayment: typeof paymentService.processPayment === 'function',
      },
      stripe: {
        connected: false,
        error: null as string | null,
      },
      overall: false,
    };

    // Test Stripe connection directly (without using testStripeConnection method)
    if (result.environment.secretKey && result.environment.secretKeyFormat) {
      try {
        console.log('🔄 Testing Stripe connection directly...');

        const Stripe = (await import('stripe')).default;
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
          apiVersion: '2023-10-16',
        });

        await stripe.accounts.retrieve();
        result.stripe.connected = true;
        console.log('✅ Stripe connection successful');
      } catch (error: any) {
        result.stripe.error = error.message;
        console.error('❌ Stripe connection failed:', error.message);
      }
    } else {
      result.stripe.error = 'Missing or invalid Stripe secret key';
    }

    // Overall status
    result.overall =
      result.environment.publishableKey &&
      result.environment.secretKey &&
      result.environment.publishableKeyFormat &&
      result.environment.secretKeyFormat &&
      result.stripe.connected;

    console.log('📊 Test results:', result);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('❌ Connection test error:', error);
    return NextResponse.json(
      { error: 'Connection test failed', message: error.message },
      { status: 500 }
    );
  }
}
