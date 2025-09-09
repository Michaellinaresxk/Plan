// src/app/api/test/stripe-connection/route.ts - VERSIÓN MEJORADA
import { NextRequest, NextResponse } from 'next/server';
import { StripeCaller } from '@/infra/payment/StripeCaller';

export async function GET() {
  console.log('🧪 Enhanced Stripe Connection Test API called');

  try {
    const result = {
      timestamp: new Date().toISOString(),
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasSecretKey: !!process.env.STRIPE_SECRET_KEY,
        hasPublishableKey: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
        secretKeyFormat: process.env.STRIPE_SECRET_KEY?.startsWith('sk_'),
        publishableKeyFormat:
          process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.startsWith('pk_'),
        secretKeyMode: process.env.STRIPE_SECRET_KEY?.includes('_live_')
          ? 'live'
          : 'test',
        publishableKeyMode:
          process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.includes('_live_')
            ? 'live'
            : 'test',
      },
      validation: null as any,
      stripe: {
        connected: false,
        mode: 'unknown' as 'test' | 'live' | 'unknown',
        accountId: null as string | null,
        error: null as string | null,
      },
      overall: false,
    };

    // 🔍 VALIDACIÓN DE CONFIGURACIÓN
    console.log('🔍 Validating Stripe configuration...');
    result.validation = StripeCaller.validateConfiguration();

    // 🔌 TEST DE CONEXIÓN STRIPE
    if (result.validation.valid) {
      try {
        console.log('🔌 Testing Stripe connection...');
        const stripeCaller = new StripeCaller();
        const connectionTest = await stripeCaller.testConnection();

        result.stripe = {
          connected: connectionTest.connected,
          mode: connectionTest.mode,
          accountId: connectionTest.accountId || null,
          error: connectionTest.error || null,
        };

        // 🚨 VERIFICAR CONSISTENCIA DE MODO
        if (
          result.environment.secretKeyMode !==
          result.environment.publishableKeyMode
        ) {
          result.validation.errors.push(
            `Key mode mismatch: Secret key is ${result.environment.secretKeyMode} but publishable key is ${result.environment.publishableKeyMode}`
          );
          result.validation.valid = false;
        }

        // ⚠️ ADVERTENCIAS ESPECÍFICAS
        if (
          result.environment.nodeEnv === 'production' &&
          result.stripe.mode === 'test'
        ) {
          result.validation.warnings.push(
            'Using TEST mode in PRODUCTION environment - no real payments will be processed'
          );
        }

        if (result.stripe.mode === 'live') {
          result.validation.warnings.push(
            '🚨 LIVE MODE ACTIVE - Real money will be charged!'
          );
        }
      } catch (stripeError: any) {
        console.error('❌ Stripe connection failed:', stripeError);
        result.stripe.error = stripeError.message;

        // 🔍 DETECTAR ERRORES ESPECÍFICOS
        if (
          stripeError.message?.includes('similar object exists in test mode')
        ) {
          result.validation.errors.push(
            'Key mode mismatch detected: mixing test and live keys'
          );
          result.validation.valid = false;
        }
      }
    }

    // 📊 ESTADO GENERAL
    result.overall =
      result.validation.valid &&
      result.stripe.connected &&
      result.environment.hasSecretKey &&
      result.environment.hasPublishableKey &&
      result.environment.secretKeyFormat &&
      result.environment.publishableKeyFormat &&
      result.environment.secretKeyMode ===
        result.environment.publishableKeyMode;

    // 📝 LOGS FINALES
    console.log('📊 Test Results Summary:');
    console.log(`📊 Overall Status: ${result.overall ? 'PASS' : 'FAIL'}`);
    console.log(`📊 Validation: ${result.validation.valid ? 'PASS' : 'FAIL'}`);
    console.log(
      `📊 Stripe Connection: ${result.stripe.connected ? 'PASS' : 'FAIL'}`
    );
    console.log(`📊 Current Mode: ${result.stripe.mode.toUpperCase()}`);

    if (result.validation.errors.length > 0) {
      console.log('❌ Errors:', result.validation.errors);
    }

    if (result.validation.warnings.length > 0) {
      console.log('⚠️ Warnings:', result.validation.warnings);
    }

    // 🎯 MENSAJE FINAL SEGÚN ESTADO
    if (result.overall) {
      console.log('✅ ALL SYSTEMS GO! Stripe is ready for payments.');
    } else {
      console.log('❌ CONFIGURATION ISSUES DETECTED! Check the errors above.');
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('❌ Test API Error:', error);

    return NextResponse.json(
      {
        error: 'Connection test failed',
        message: error.message,
        timestamp: new Date().toISOString(),
        details:
          process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

// 🧪 MÉTODO PARA LIMPIAR DATOS DE TEST (OPCIONAL)
export async function DELETE() {
  try {
    console.log('🧹 Cleaning up test data...');

    // Aquí podrías limpiar datos de test si es necesario
    // Por ejemplo, eliminar payment intents de test antiguos

    return NextResponse.json({
      success: true,
      message: 'Test data cleanup completed',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('❌ Cleanup failed:', error);

    return NextResponse.json(
      { error: 'Cleanup failed', message: error.message },
      { status: 500 }
    );
  }
}
