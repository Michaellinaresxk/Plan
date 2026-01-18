// src/app/api/test/send-email/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/services/Email';

/**
 * Test endpoint to send a real payment confirmation email
 *
 * Usage:
 * POST /api/test/send-email
 * Body: { "email": "test@example.com", "name": "Test User" }
 *
 * Or use default test data:
 * POST /api/test/send-email
 * Body: {}
 */
export async function POST(request: NextRequest) {
  console.log('🧪 Send Email Test API called');

  try {
    // Parse request body or use defaults
    const body = await request.json().catch(() => ({}));

    const testEmail = body.email || 'delivered@resend.dev'; // Resend's test inbox
    const testName = body.name || 'Test User';

    console.log(`📧 Sending test email to: ${testEmail}`);

    // Prepare test data
    const testData = {
      reservationId: `test_${Date.now()}`,
      bookingId: `BOOKING_TEST_${Math.random().toString(36).substring(7).toUpperCase()}`,
      clientEmail: testEmail,
      clientName: testName,
      serviceName: 'Luxury Yacht Charter - Test Service',
      totalPrice: 25000, // $250.00 in cents
      currency: 'usd',
      metadata: {
        testMode: true,
        timestamp: new Date().toISOString(),
        paymentId: `test_payment_${Date.now()}`,
        receiptUrl: 'https://example.com/receipt/test',
        receiptNumber: `TEST-${Math.random().toString(36).substring(7).toUpperCase()}`,
      },
    };

    console.log('📨 Test data:', {
      email: testData.clientEmail,
      name: testData.clientName,
      bookingId: testData.bookingId,
      price: `$${(testData.totalPrice / 100).toFixed(2)}`,
    });

    // Send the email using the email service
    const result = await emailService.sendPaymentConfirmation(testData);

    if (result.success) {
      console.log('✅ Test email sent successfully!');
      console.log('📬 Message ID:', result.messageId);

      return NextResponse.json({
        success: true,
        message: 'Test email sent successfully',
        data: {
          messageId: result.messageId,
          recipient: testData.clientEmail,
          bookingId: testData.bookingId,
          timestamp: new Date().toISOString(),
        },
        testData,
      });
    } else {
      console.error('❌ Failed to send test email:', result.error);

      return NextResponse.json(
        {
          success: false,
          error: 'Failed to send test email',
          message: result.error,
          testData,
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('❌ Send Email Test API Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Test email failed',
        message: error.message,
        timestamp: new Date().toISOString(),
        details:
          process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to check if the test endpoint is available
 */
export async function GET() {
  return NextResponse.json({
    endpoint: '/api/test/send-email',
    method: 'POST',
    description: 'Test endpoint to send payment confirmation emails',
    usage: {
      customEmail: {
        body: { email: 'your@email.com', name: 'Your Name' },
      },
      defaultTest: {
        body: {},
        note: 'Sends to delivered@resend.dev (Resend test inbox)',
      },
    },
    example: `
      curl -X POST http://localhost:3000/api/test/send-email \\
        -H "Content-Type: application/json" \\
        -d '{"email":"test@example.com","name":"Test User"}'
    `,
  });
}
