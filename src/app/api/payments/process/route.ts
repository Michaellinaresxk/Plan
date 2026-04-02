// src/app/api/payments/process/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PAYMENT_PROVIDER } from '@/config/paymentConfig';
import { SquareCaller } from '@/infra/payment/SquareCaller';
import { StripeCaller } from '@/infra/payment/StripeCaller';
import { reservationService } from '@/primary/Reservation/useCases';
import { emailService } from '@/services/Email';

// ─────────────────────────────────────────────────────────────
// ADAPTER: normaliza formData de cualquier servicio → campos
// universales que EmailCaller espera (location, activityDate,
// numberOfPeople, paymentMethod).
//
// Cada formulario de servicio usa nombres distintos para los
// mismos conceptos. Este adapter centraliza el mapeo para que
// route.ts no necesite saber qué servicio se está procesando.
//
// Cuando agregues un servicio nuevo, solo asegúrate de que sus
// campos caigan en alguno de los alias existentes, o agrega el
// nuevo alias aquí.
// ─────────────────────────────────────────────────────────────
function normalizeFormDataForEmail(
  formData: Record<string, any>,
): Record<string, string | undefined> {
  // ── Location ──────────────────────────────────────────────
  // DefaultServiceForm  → location
  // ATV / Horseback     → meetingPoint
  // Airport Transfers   → pickupLocation
  // Catamaran / Yacht   → departurePoint, marina
  // Babysitter          → (no location field)
  const rawLocation =
    formData.location ??
    formData.meetingPoint ??
    formData.pickupLocation ??
    formData.departurePoint ??
    formData.marina ??
    formData.hotelName ??
    formData.hotel ??
    formData.address ??
    undefined;

  // ── Date + Time → single "activityDate" string ────────────
  // DefaultServiceForm  → date + time
  // BabysitterForm      → date + startTime
  // Catamaran / Yacht   → departureDate + departureTime
  // ATV / Horseback     → date + time
  const rawDate =
    formData.date ??
    formData.activityDate ??
    formData.departureDate ??
    formData.startDate ??
    undefined;

  const rawTime =
    formData.time ?? formData.startTime ?? formData.departureTime ?? undefined;

  let activityDate: string | undefined;
  if (rawDate) {
    activityDate = rawTime ? `${rawDate} at ${rawTime}` : String(rawDate);
  }

  // ── Number of people ──────────────────────────────────────
  // DefaultServiceForm  → guests
  // BabysitterForm      → childrenCount
  // Catamaran / Yacht   → passengers, numberOfPeople
  // ATV                 → riders, participants
  const rawPeople =
    formData.guests ??
    formData.numberOfPeople ??
    formData.passengers ??
    formData.childrenCount ??
    formData.participants ??
    formData.riders ??
    formData.people ??
    formData.children ??
    undefined;

  // ── Duration (bonus: nice-to-have for some services) ──────
  const rawDuration = formData.hours ?? formData.duration ?? undefined;

  // Build clean metadata — only include fields that have values
  const normalized: Record<string, string | undefined> = {
    location: rawLocation ? String(rawLocation) : undefined,
    activityDate: activityDate ? String(activityDate) : undefined,
    numberOfPeople: rawPeople != null ? String(rawPeople) : undefined,
  };

  // Add duration only if it provides meaningful context
  if (rawDuration != null) {
    const hrs = Number(rawDuration);
    if (!isNaN(hrs) && hrs > 0) {
      normalized.duration = hrs === 1 ? '1 hour' : `${hrs} hours`;
    }
  }

  return normalized;
}

// ─────────────────────────────────────────────────────────────
// MAIN HANDLER
// ─────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  console.log(
    `🎯 Process Payment API called — provider: ${PAYMENT_PROVIDER.toUpperCase()}`,
  );

  try {
    const body = await request.json();

    const { reservationData, amount, currency } = body;

    if (!reservationData || !amount || !currency) {
      return NextResponse.json(
        { error: 'Missing required payment data' },
        { status: 400 },
      );
    }

    if (!reservationData.service || !reservationData.clientInfo) {
      return NextResponse.json(
        { error: 'Invalid reservation data structure' },
        { status: 400 },
      );
    }

    // ─────────────────────────────────────────────────────────
    // CHARGE THE CARD via the active provider
    // ─────────────────────────────────────────────────────────
    let payment: {
      paymentId: string;
      status: string;
      receiptUrl?: string;
      receiptNumber?: string;
    };

    if (PAYMENT_PROVIDER === 'stripe') {
      // ── STRIPE ──────────────────────────────────────────────
      const { paymentMethodId } = body;

      if (!paymentMethodId) {
        return NextResponse.json(
          { error: 'Missing paymentMethodId for Stripe payment' },
          { status: 400 },
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
        throw new Error(
          `Stripe payment failed with status: ${stripeResult.status}`,
        );
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
          { status: 400 },
        );
      }

      const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID;
      if (!locationId) {
        return NextResponse.json(
          { error: 'Square location not configured' },
          { status: 500 },
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
        throw new Error(
          `Square payment failed with status: ${squareResult.status}`,
        );
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
    // SEND CONFIRMATION EMAIL (non-blocking — never interrupts
    // the successful payment/reservation response)
    // ─────────────────────────────────────────────────────────
    console.log('📧 Sending payment confirmation email...');

    try {
      // ✅ FIX: Normalize formData → universal email metadata fields
      const serviceMetadata = normalizeFormDataForEmail(
        reservation.formData ?? reservationData.formData ?? {},
      );

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
          paymentMethod: PAYMENT_PROVIDER === 'stripe' ? 'Credit Card' : 'Card',
          // ✅ Universal fields derived from any service's formData
          ...serviceMetadata,
        },
      });

      if (emailResult.success) {
        console.log('✅ Confirmation email sent — ID:', emailResult.messageId);
      } else {
        console.error(
          '⚠️ Failed to send confirmation email:',
          emailResult.error,
        );
      }
    } catch (emailError) {
      // Email is non-blocking — log but never throw
      console.error(
        '⚠️ Unexpected error sending confirmation email:',
        emailError,
      );
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
      { status: 500 },
    );
  }
}
