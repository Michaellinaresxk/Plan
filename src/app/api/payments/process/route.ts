// src/app/api/payments/process/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { reservationService } from '@/primary/Reservation/useCases';

export async function POST(request: NextRequest) {
  console.log('🎯 Process Payment API called');

  try {
    const body = await request.json();
    console.log('📥 Processing payment and reservation...');

    const { reservationData, paymentMethodId, clientSecret } = body;

    // Validation
    if (!reservationData || !paymentMethodId || !clientSecret) {
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

    console.log('📄 Creating reservation with service...');

    // Usar el servicio real en lugar de mock
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
      },
    });
  } catch (error: any) {
    console.error('❌ Process payment error:', error);
    return NextResponse.json(
      {
        error: 'Failed to process payment and create reservation',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
