// src/app/api/payments/process/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { SquareCaller } from '@/infra/payment/SquareCaller';
import { reservationService } from '@/primary/Reservation/useCases';
import { emailService } from '@/services/Email';

export async function POST(request: NextRequest) {
  console.log('🎯 Square Process Payment API called');

  try {
    const body = await request.json();
    console.log('📥 Processing payment with Square...');

    const { sourceId, reservationData, amount, currency } = body;

    // Validación
    if (!sourceId || !reservationData || !amount || !currency) {
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

    const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID;
    if (!locationId) {
      return NextResponse.json(
        { error: 'Square location not configured' },
        { status: 500 }
      );
    }

    console.log('💳 Creating payment with Square...');

    // Crear instancia de SquareCaller
    const squareCaller = new SquareCaller();

    // Crear el pago en Square
    const payment = await squareCaller.createPayment({
      sourceId: sourceId,
      reservationId: `temp_${Date.now()}`,
      amount: amount,
      currency: currency,
      locationId: locationId,
      metadata: {
        serviceName: reservationData.service.name,
        clientEmail: reservationData.clientInfo.email,
        clientName: reservationData.clientInfo.name,
        timestamp: new Date().toISOString(),
      },
    });

    console.log('✅ Square payment created:', payment.paymentId);
    console.log('✅ Payment status:', payment.status);

    // Verificar que el pago fue exitoso
    if (payment.status !== 'COMPLETED') {
      throw new Error(`Payment failed with status: ${payment.status}`);
    }

    console.log('📄 Creating reservation...');

    // Crear la reservación usando el servicio existente
    const reservation = await reservationService.createReservation({
      serviceId: reservationData.service.id,
      serviceName: reservationData.service.name,
      totalPrice: reservationData.totalPrice,
      clientName: reservationData.clientInfo.name,
      clientEmail: reservationData.clientInfo.email,
      clientPhone: reservationData.clientInfo.phone,
      formData: reservationData.formData || {},
      notes: reservationData.notes,
      paymentInfo: {
        paymentId: payment.paymentId,
        status: payment.status,
        receiptUrl: payment.receiptUrl,
        receiptNumber: payment.receiptNumber,
      },
    });

    console.log('✅ Reservation created:', reservation.bookingId);

    // Send payment confirmation email
    console.log('📧 Sending payment confirmation email...');

    try {
      const emailResult = await emailService.sendPaymentConfirmation({
        reservationId: reservation.bookingId,
        bookingId: reservation.bookingId,
        clientEmail: reservation.clientEmail,
        clientName: reservation.clientName,
        serviceName: reservation.serviceName,
        totalPrice: reservation.totalPrice,
        currency: currency,
        metadata: {
          paymentId: payment.paymentId,
          receiptUrl: payment.receiptUrl,
          receiptNumber: payment.receiptNumber,
        },
      });

      if (emailResult.success) {
        console.log('✅ Confirmation email sent successfully');
        console.log('📬 Email Message ID:', emailResult.messageId);
      } else {
        // Log the error but don't fail the entire request
        console.error('⚠️ Failed to send confirmation email:', emailResult.error);
        console.log('✅ Reservation and payment completed successfully despite email failure');
      }
    } catch (emailError) {
      // Catch any unexpected email errors but don't fail the request
      console.error('⚠️ Unexpected error sending confirmation email:', emailError);
      console.log('✅ Reservation and payment completed successfully despite email failure');
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
        details:
          process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
