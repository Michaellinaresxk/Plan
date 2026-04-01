// src/app/api/payments/process/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PAYMENT_PROVIDER } from '@/config/paymentConfig';
import { SquareCaller } from '@/infra/payment/SquareCaller';
import { StripeCaller } from '@/infra/payment/StripeCaller';
import { reservationService } from '@/primary/Reservation/useCases';
import { emailService } from '@/services/Email';

export async function POST(request: NextRequest) {
  console.log(`🎯 Process Payment API called — provider: ${PAYMENT_PROVIDER.toUpperCase()}`);

  try {
    const body = await request.json();

    const { reservationData, amount, currency } = body;

    if (!reservationData || !amount || !currency) {
      return NextResponse.json(
        { error: 'Missing required payment data' },
        { status: 400 }
      );
    }

    if (!reservationData.service || !reservationData.clientInfo) {
      return NextResponse.json(
        { error: 'Invalid reservation data structure' },
        { status: 400 }
      );
    }

    // ─────────────────────────────────────────────────────────
    // CHARGE THE CARD via the active provider
    // ─────────────────────────────────────────────────────────
    let payment: { paymentId: string; status: string; receiptUrl?: string; receiptNumber?: string };

    if (PAYMENT_PROVIDER === 'stripe') {
      // ── STRIPE ──────────────────────────────────────────────
      const { paymentMethodId } = body;

      if (!paymentMethodId) {
        return NextResponse.json(
          { error: 'Missing paymentMethodId for Stripe payment' },
          { status: 400 }
        );
      }

      console.log('💳 Creating payment with Stripe...');
      const stripeCaller = new StripeCaller();

      const stripeResult = await stripeCaller.createPayment({
        paymentMethodId,
        reservationId: `temp_${Date.now()}`,
        amount,
        currency,
        metadata: {
          serviceName: reservationData.service.name,
          clientEmail: reservationData.clientInfo.email,
          clientName: reservationData.clientInfo.name,
          timestamp: new Date().toISOString(),
        },
      });

      if (stripeResult.status !== 'succeeded') {
        throw new Error(`Stripe payment failed with status: ${stripeResult.status}`);
      }

      console.log('✅ Stripe payment succeeded:', stripeResult.paymentId);

      payment = {
        paymentId: stripeResult.paymentId,
        status: stripeResult.status,
        receiptUrl: stripeResult.receiptUrl,
      };
    } else {
      // ── SQUARE ──────────────────────────────────────────────
      const { sourceId } = body;

      if (!sourceId) {
        return NextResponse.json(
          { error: 'Missing sourceId for Square payment' },
          { status: 400 }
        );
      }

      const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID;
      if (!locationId) {
        return NextResponse.json(
          { error: 'Square location not configured' },
          { status: 500 }
        );
      }

      console.log('💳 Creating payment with Square...');
      const squareCaller = new SquareCaller();

      const squareResult = await squareCaller.createPayment({
        sourceId,
        reservationId: `temp_${Date.now()}`,
        amount,
        currency,
        locationId,
        metadata: {
          serviceName: reservationData.service.name,
          clientEmail: reservationData.clientInfo.email,
          clientName: reservationData.clientInfo.name,
          timestamp: new Date().toISOString(),
        },
      });

      if (squareResult.status !== 'COMPLETED') {
        throw new Error(`Square payment failed with status: ${squareResult.status}`);
      }

      console.log('✅ Square payment completed:', squareResult.paymentId);

      payment = squareResult;
    }

    // ─────────────────────────────────────────────────────────
    // CREATE RESERVATION
    // ─────────────────────────────────────────────────────────
    console.log('📄 Creating reservation...');

    const reservation = await reservationService.createReservation({
      serviceId: reservationData.service.id,
      serviceName: reservationData.service.name,
      totalPrice: reservationData.totalPrice,
      clientName: reservationData.clientInfo.name,
      clientEmail: reservationData.clientInfo.email,
      clientPhone: reservationData.clientInfo.phone,
      formData: reservationData.formData || {},
      notes: reservationData.notes,
    });

    console.log('✅ Reservation created:', reservation.bookingId);

    // ─────────────────────────────────────────────────────────
    // SEND CONFIRMATION EMAIL
    // ─────────────────────────────────────────────────────────
    console.log('📧 Sending payment confirmation email...');

    try {
      const emailResult = await emailService.sendPaymentConfirmation({
        reservationId: reservation.bookingId,
        bookingId: reservation.bookingId,
        clientEmail: reservation.clientEmail,
        clientName: reservation.clientName,
        serviceName: reservation.serviceName,
        totalPrice: reservation.totalPrice,
        currency,
        metadata: {
          paymentId: payment.paymentId,
          receiptUrl: payment.receiptUrl,
          receiptNumber: payment.receiptNumber,
        },
      });

      if (emailResult.success) {
        console.log('✅ Confirmation email sent — ID:', emailResult.messageId);
      } else {
        console.error('⚠️ Failed to send confirmation email:', emailResult.error);
      }
    } catch (emailError) {
      console.error('⚠️ Unexpected error sending confirmation email:', emailError);
    }

    return NextResponse.json({
      success: true,
      reservation: {
        bookingId: reservation.bookingId,
        serviceId: reservation.serviceId,
        serviceName: reservation.serviceName,
        totalPrice: reservation.totalPrice,
        clientName: reservation.clientName,
        clientEmail: reservation.clientEmail,
        clientPhone: reservation.clientPhone,
        status: reservation.status,
        formData: reservation.formData,
        paymentInfo: {
          paymentId: payment.paymentId,
          status: payment.status,
          receiptUrl: payment.receiptUrl,
          receiptNumber: payment.receiptNumber,
        },
      },
    });
  } catch (error: any) {
    console.error('❌ Process payment error:', error);
    return NextResponse.json(
      {
        error: 'Failed to process payment',
        message: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
