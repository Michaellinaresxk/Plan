// src/app/api/test/square-connection/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { SquareCaller } from '@/infra/payment/SquareCaller';

export async function GET() {
  console.log('🧪 Square Connection Test API called');

  try {
    const result = {
      timestamp: new Date().toISOString(),
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasAccessToken: !!process.env.SQUARE_ACCESS_TOKEN,
        hasApplicationId: !!process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID,
        hasLocationId: !!process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID,
        squareEnvironment: process.env.SQUARE_ENVIRONMENT || 'sandbox',
      },
      validation: null as any,
      square: {
        connected: false,
        environment: 'unknown' as 'sandbox' | 'production',
        locations: [] as Array<{ id: string; name: string }>,
        error: null as string | null,
      },
      overall: false,
    };

    // 🔍 VALIDACIÓN DE CONFIGURACIÓN
    console.log('🔍 Validating Square configuration...');
    result.validation = SquareCaller.validateConfiguration();

    // 🔌 TEST DE CONEXIÓN SQUARE
    if (result.validation.valid) {
      try {
        console.log('🔌 Testing Square connection...');
        const squareCaller = new SquareCaller();
        const connectionTest = await squareCaller.testConnection();

        result.square = {
          connected: connectionTest.connected,
          environment: connectionTest.environment,
          locations: connectionTest.locations || [],
          error: connectionTest.error || null,
        };

        // ⚠️ ADVERTENCIAS ESPECÍFICAS
        if (
          result.environment.nodeEnv === 'production' &&
          result.square.environment === 'sandbox'
        ) {
          result.validation.warnings.push(
            'Using SANDBOX mode in PRODUCTION environment - no real payments will be processed'
          );
        }

        if (result.square.environment === 'production') {
          result.validation.warnings.push(
            '🚨 PRODUCTION MODE ACTIVE - Real money will be charged!'
          );
        }
      } catch (squareError: any) {
        console.error('❌ Square connection failed:', squareError);
        result.square.error = squareError.message;
      }
    }

    // 📊 ESTADO GENERAL
    result.overall =
      result.validation.valid &&
      result.square.connected &&
      result.environment.hasAccessToken &&
      result.environment.hasApplicationId &&
      result.environment.hasLocationId;

    // 🔍 LOGS FINALES
    console.log('📊 Test Results Summary:');
    console.log(`📊 Overall Status: ${result.overall ? 'PASS' : 'FAIL'}`);
    console.log(`📊 Validation: ${result.validation.valid ? 'PASS' : 'FAIL'}`);
    console.log(
      `📊 Square Connection: ${result.square.connected ? 'PASS' : 'FAIL'}`
    );
    console.log(
      `📊 Current Environment: ${result.square.environment.toUpperCase()}`
    );
    console.log(`📊 Locations found: ${result.square.locations.length}`);

    if (result.validation.errors.length > 0) {
      console.log('❌ Errors:', result.validation.errors);
    }

    if (result.validation.warnings.length > 0) {
      console.log('⚠️ Warnings:', result.validation.warnings);
    }

    // 🎯 MENSAJE FINAL SEGÚN ESTADO
    if (result.overall) {
      console.log('✅ ALL SYSTEMS GO! Square is ready for payments.');
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
