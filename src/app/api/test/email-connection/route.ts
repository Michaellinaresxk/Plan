// src/app/api/test/email-connection/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { EmailCaller } from '@/infra/email/EmailCaller';

export async function GET() {
  console.log('🧪 Email Connection Test API called');

  try {
    const result = {
      timestamp: new Date().toISOString(),
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasResendApiKey: !!process.env.RESEND_API_KEY,
        fromEmail: process.env.RESEND_FROM_EMAIL || 'not configured',
        fromName: process.env.RESEND_FROM_NAME || 'not configured',
      },
      validation: {
        valid: false,
        errors: [] as string[],
        warnings: [] as string[],
      },
      resend: {
        connected: false,
        messageId: null as string | null,
        error: null as string | null,
      },
      overall: false,
    };

    // 🔍 VALIDACIÓN DE CONFIGURACIÓN
    console.log('🔍 Validating Resend configuration...');

    if (!process.env.RESEND_API_KEY) {
      result.validation.errors.push('RESEND_API_KEY is not configured');
    }

    if (!process.env.RESEND_FROM_EMAIL) {
      result.validation.warnings.push(
        'RESEND_FROM_EMAIL not set, using default: noreply@luxpuntacana.com'
      );
    }

    if (!process.env.RESEND_FROM_NAME) {
      result.validation.warnings.push(
        'RESEND_FROM_NAME not set, using default: Luxe Punta Cana Concierge'
      );
    }

    result.validation.valid = result.validation.errors.length === 0;

    // 🔌 TEST DE CONEXIÓN RESEND
    if (result.validation.valid) {
      try {
        console.log('🔌 Testing Resend connection...');
        const emailCaller = new EmailCaller();
        const connectionTest = await emailCaller.testConnection();

        result.resend = {
          connected: connectionTest.connected,
          messageId: null,
          error: connectionTest.error || null,
        };

        if (connectionTest.connected) {
          console.log('✅ Resend connection successful!');
        } else {
          console.error('❌ Resend connection failed:', connectionTest.error);
        }
      } catch (resendError: any) {
        console.error('❌ Resend connection failed:', resendError);
        result.resend.error = resendError.message;
      }
    }

    // 📊 ESTADO GENERAL
    result.overall =
      result.validation.valid &&
      result.resend.connected &&
      result.environment.hasResendApiKey;

    // 🔍 LOGS FINALES
    console.log('📊 Test Results Summary:');
    console.log(`📊 Overall Status: ${result.overall ? 'PASS ✅' : 'FAIL ❌'}`);
    console.log(
      `📊 Validation: ${result.validation.valid ? 'PASS ✅' : 'FAIL ❌'}`
    );
    console.log(
      `📊 Resend Connection: ${result.resend.connected ? 'PASS ✅' : 'FAIL ❌'}`
    );
    console.log(`📊 From Email: ${result.environment.fromEmail}`);
    console.log(`📊 From Name: ${result.environment.fromName}`);

    if (result.validation.errors.length > 0) {
      console.log('❌ Errors:', result.validation.errors);
    }

    if (result.validation.warnings.length > 0) {
      console.log('⚠️  Warnings:', result.validation.warnings);
    }

    // 🎯 MENSAJE FINAL SEGÚN ESTADO
    if (result.overall) {
      console.log('✅ ALL SYSTEMS GO! Email service is ready.');
    } else {
      console.log('❌ CONFIGURATION ISSUES DETECTED! Check the errors above.');
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('❌ Test API Error:', error);

    return NextResponse.json(
      {
        error: 'Email connection test failed',
        message: error.message,
        timestamp: new Date().toISOString(),
        details:
          process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
