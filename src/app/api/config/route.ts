import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    stripeKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
}
