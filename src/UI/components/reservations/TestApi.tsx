'use client';

import React, { useState } from 'react';
import { Play, CheckCircle, AlertTriangle, X } from 'lucide-react';

// Define the shape of our message state
interface MessageState {
  type: 'success' | 'error';
  text: string;
}

const TestApi = () => {
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<MessageState | null>(null);

  // Function to dismiss the message box
  const dismissMessage = () => setMessage(null);

  const testPaymentIntent = async () => {
    setIsLoading(true);
    setResult(null);
    setMessage(null);

    try {
      console.log('🧪 Testing payment intent creation...');

      const testData = {
        reservationId: 'test_' + Date.now(),
        amount: 5000, // $50.00
        currency: 'usd',
        metadata: {
          test: 'true',
          timestamp: new Date().toISOString(),
        },
      };

      console.log('📤 Sending request to /api/payments/create-intent');
      console.log('📤 Data:', testData);

      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      });

      console.log('📥 Response status:', response.status);
      console.log(
        '📥 Response headers:',
        Object.fromEntries(response.headers.entries())
      );

      const responseText = await response.text();
      console.log(
        '📥 Response text (first 500 chars):',
        responseText.substring(0, 500)
      );

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error(
          `Response is not JSON: ${responseText.substring(0, 200)}`
        );
      }

      setResult({
        success: response.ok,
        status: response.status,
        data,
        error: response.ok ? null : data.error || data.message,
      });

      if (response.ok) {
        console.log('✅ Payment intent created successfully!');
        console.log(
          '✅ Client Secret:',
          data.clientSecret?.substring(0, 30) + '...'
        );
        console.log('✅ Payment Intent ID:', data.paymentIntentId);
      } else {
        console.error('❌ Payment intent failed:', data);
      }
    } catch (error: any) {
      console.error('❌ Test failed:', error);
      setResult({
        success: false,
        error: error.message,
        data: null,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testProcessPayment = async () => {
    // Check if a successful intent was created first
    if (!result?.success || !result?.data?.clientSecret) {
      setMessage({ type: 'error', text: 'Create a payment intent first!' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      console.log('🧪 Testing payment processing...');

      const processData = {
        reservationData: {
          service: {
            id: 'test_service_123',
            name: 'Test Luxury Service',
          },
          clientInfo: {
            name: 'Test User',
            email: 'test@example.com',
            phone: '+1234567890',
            hostInfo: 'Test Hotel',
          },
          totalPrice: 50,
          formData: {
            testField: 'test value',
            timestamp: new Date().toISOString(),
          },
        },
        paymentMethodId: 'pm_card_visa', // Mock payment method
        clientSecret: result.data.clientSecret,
      };

      console.log('📤 Sending request to /api/payments/process');

      const response = await fetch('/api/payments/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(processData),
      });

      const responseText = await response.text();
      console.log('📥 Process response:', responseText.substring(0, 500));

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error(
          `Response is not JSON: ${responseText.substring(0, 200)}`
        );
      }

      if (response.ok && data.success) {
        console.log('✅ Payment processed successfully!');
        console.log('✅ Reservation created:', data.reservation.bookingId);
        setMessage({
          type: 'success',
          text: `Success!\n\nReservation ID: ${data.reservation.bookingId}\nClient: ${data.reservation.clientName}`,
        });
      } else {
        console.error('❌ Payment processing failed:', data);
        setMessage({
          type: 'error',
          text: `Failed: ${data.error || data.message}`,
        });
      }
    } catch (error: any) {
      console.error('❌ Process test failed:', error);
      setMessage({ type: 'error', text: `Error: ${error.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='max-w-2xl mx-auto p-6'>
      <div className='text-center mb-8'>
        <h1 className='text-2xl font-bold mb-4'>Payment System Test</h1>
        <p className='text-gray-600'>
          Test your payment integration step by step
        </p>
      </div>

      {/* Dynamic message box */}
      {message && (
        <div
          className={`relative p-4 rounded-lg mb-6 shadow-md transition-opacity duration-300 ${
            message.type === 'success'
              ? 'bg-green-100 border-l-4 border-green-500 text-green-700'
              : 'bg-red-100 border-l-4 border-red-500 text-red-700'
          }`}
        >
          <button
            onClick={dismissMessage}
            className='absolute top-2 right-2 p-1 text-sm font-medium rounded-full hover:bg-opacity-50 transition'
          >
            <X className='w-4 h-4' />
          </button>
          <div className='flex items-center'>
            {message.type === 'success' ? (
              <CheckCircle className='w-6 h-6 mr-3' />
            ) : (
              <AlertTriangle className='w-6 h-6 mr-3' />
            )}
            <p className='text-sm whitespace-pre-line'>{message.text}</p>
          </div>
        </div>
      )}

      <div className='space-y-6'>
        {/* Step 1: Create Payment Intent */}
        <div className='border border-gray-200 rounded-lg p-6'>
          <h2 className='text-lg font-semibold mb-4 flex items-center'>
            <span className='w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-3'>
              1
            </span>
            Create Payment Intent
          </h2>

          <button
            onClick={testPaymentIntent}
            disabled={isLoading}
            className={`w-full px-4 py-3 rounded-lg font-medium flex items-center justify-center ${
              isLoading
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            {isLoading ? (
              <>
                <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
                Testing...
              </>
            ) : (
              <>
                <Play className='w-4 h-4 mr-2' />
                Test Payment Intent
              </>
            )}
          </button>

          {result && (
            <div
              className={`mt-4 p-4 rounded-lg border ${
                result.success
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              }`}
            >
              <div className='flex items-start'>
                {result.success ? (
                  <CheckCircle className='w-5 h-5 text-green-600 mr-3 mt-0.5' />
                ) : (
                  <AlertTriangle className='w-5 h-5 text-red-600 mr-3 mt-0.5' />
                )}
                <div className='flex-1'>
                  <h4
                    className={`font-medium ${
                      result.success ? 'text-green-900' : 'text-red-900'
                    }`}
                  >
                    {result.success ? 'Payment Intent Created!' : 'Failed'}
                  </h4>
                  <p
                    className={`text-sm mt-1 ${
                      result.success ? 'text-green-700' : 'text-red-700'
                    }`}
                  >
                    Status: {result.status} |{' '}
                    {result.success ? 'Success' : result.error}
                  </p>

                  {result.data && (
                    <details className='mt-2'>
                      <summary className='cursor-pointer text-sm text-gray-600'>
                        View Response
                      </summary>
                      <pre className='text-xs bg-gray-100 p-2 rounded mt-1 overflow-x-auto'>
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Step 2: Process Payment */}
        <div className='border border-gray-200 rounded-lg p-6'>
          <h2 className='text-lg font-semibold mb-4 flex items-center'>
            <span className='w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold mr-3'>
              2
            </span>
            Process Payment & Create Reservation
          </h2>

          <button
            onClick={testProcessPayment}
            disabled={isLoading || !result?.success}
            className={`w-full px-4 py-3 rounded-lg font-medium flex items-center justify-center ${
              isLoading || !result?.success
                ? 'bg-green-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
            } text-white`}
          >
            <Play className='w-4 h-4 mr-2' />
            {!result?.success ? 'Complete Step 1 First' : 'Test Full Process'}
          </button>
        </div>

        {/* Instructions */}
        <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
          <h3 className='font-semibold text-blue-900 mb-2'>Expected Flow:</h3>
          <ol className='text-sm text-blue-800 space-y-1'>
            <li>
              1. Click "Test Payment Intent" - should create a payment intent
            </li>
            <li>
              2. If successful, click "Test Full Process" - should create a
              reservation
            </li>
            <li>3. Check console logs for detailed information</li>
            <li>4. If both work, your payment system is ready!</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default TestApi;
