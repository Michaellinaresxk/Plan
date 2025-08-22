// src/app/api/payments/process/route.ts
import { NextRequest, NextResponse } from 'next/server';

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

    console.log('🔄 Creating reservation...');

    // Create mock reservation (you can integrate your ReservationService later)
    const reservation = {
      bookingId: `booking_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`,
      serviceId: reservationData.service.id,
      serviceName: reservationData.service.name,
      totalPrice: reservationData.totalPrice,
      clientName: reservationData.clientInfo.name,
      clientEmail: reservationData.clientInfo.email,
      clientPhone: reservationData.clientInfo.phone,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      paymentMethodId,
      formData: reservationData.formData || {},
      properties: {
        serviceId: reservationData.service.id,
        serviceName: reservationData.service.name,
        totalPrice: reservationData.totalPrice,
        clientName: reservationData.clientInfo.name,
        clientEmail: reservationData.clientInfo.email,
        clientPhone: reservationData.clientInfo.phone,
        status: 'confirmed',
        formData: reservationData.formData || {},
      },
    };

    console.log('✅ Reservation created:', reservation.bookingId);

    return NextResponse.json({
      success: true,
      reservation: {
        bookingId: reservation.bookingId,
        ...reservation.properties,
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

export async function GET() {
  return NextResponse.json({
    message: 'Process Payment API is working',
    timestamp: new Date().toISOString(),
    methods: ['POST'],
  });
}
