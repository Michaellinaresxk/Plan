// UI/components/reservation/ReservationSteps.tsx
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n/client';
import { useReservation } from '@/context/BookingContext';
import {
  ArrowLeft,
  Check,
  DollarSign,
  AlertCircle,
  CreditCard,
  Shield,
  User,
  Mail,
  Phone,
  Building,
  ArrowRight,
} from 'lucide-react';

import StepIndicator from '@/UI/components/confirmation/StepIndicator';
import FormDataRenderer from '@/UI/components/confirmation/FormDataRenderer';
import type { ReservationData } from '@/context/BookingContext';
import CheckoutModal from '../payment/CheckoutModal';

interface ClientInfo {
  name: string;
  email: string;
  phone: string;
  hostInfo?: string;
}

interface ReservationStepsProps {
  reservationData: ReservationData;
  onSuccess: (reservation: any) => void;
  onError: (error: string) => void;
}

const ReservationSteps: React.FC<ReservationStepsProps> = ({
  reservationData,
  onSuccess,
  onError,
}) => {
  const router = useRouter();
  const { t } = useTranslation();
  const { updateClientInfo, setReservationResult, clearReservation } =
    useReservation();

  // SOLO 2 PASOS ANTES DEL PAGO: review + contact
  const [currentStep, setCurrentStep] = useState(1);
  const [showCheckout, setShowCheckout] = useState(false);
  const [clientForm, setClientForm] = useState<ClientInfo>({
    name: reservationData.clientInfo?.name || '',
    email: reservationData.clientInfo?.email || '',
    phone: reservationData.clientInfo?.phone || '',
    hostInfo: reservationData.clientInfo?.hostInfo || '',
  });
  const [clientFormErrors, setClientFormErrors] = useState<Partial<ClientInfo>>(
    {}
  );

  // Validate client form
  const validateClientForm = (): boolean => {
    const errors: Partial<ClientInfo> = {};

    if (!clientForm.name.trim()) {
      errors.name = 'Name is required';
    }

    if (!clientForm.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientForm.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!clientForm.phone.trim()) {
      errors.phone = 'Phone number is required';
    }

    setClientFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleClientInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateClientForm()) {
      console.log('👤 Client info validated, proceeding to payment');
      updateClientInfo(clientForm);
      // DIRECTO AL PAGO - NO MORE STEP 3
      setShowCheckout(true);
    }
  };

  const handlePaymentSuccess = (reservation: any) => {
    console.log('✅ Payment and reservation successful:', reservation);

    setReservationResult({
      reservation,
      success: true,
    });

    const successMessage = `Reservation created and payment processed successfully! 

📋 Booking ID: ${reservation.bookingId}
📧 Email: ${reservationData.clientInfo?.email || clientForm.email}
💰 Amount: $${reservationData.totalPrice.toFixed(2)}

You will receive a confirmation email shortly.`;

    alert(successMessage);
    clearReservation();
    setShowCheckout(false);
    onSuccess(reservation);
  };

  const handlePaymentError = (error: string) => {
    console.error('❌ Payment failed:', error);

    setReservationResult({
      reservation: null,
      success: false,
      error,
    });

    setShowCheckout(false);
    onError(error);
  };

  return (
    <>
      <div className='space-y-8'>
        {/* Header */}
        <div className='bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white rounded-t-xl'>
          <button
            onClick={() => router.back()}
            className='flex items-center text-blue-100 hover:text-white mb-4 transition-colors'
          >
            <ArrowLeft className='w-4 h-4 mr-2' />
            {t('common.back', { fallback: 'Back' })}
          </button>
          <h1 className='text-2xl font-bold'>
            {t('reservation.confirmTitle', {
              fallback: 'Complete Your Reservation',
            })}
          </h1>
          <p className='text-blue-100 mt-1'>
            {currentStep === 1
              ? 'Review your booking details'
              : 'Enter your contact information'}
          </p>
        </div>

        {/* Simple 2-Step Indicator */}
        <div className='p-6 border-b bg-gray-50'>
          <div className='flex items-center justify-center space-x-8'>
            <div className='flex items-center'>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep === 1
                    ? 'bg-blue-600 text-white'
                    : 'bg-green-600 text-white'
                }`}
              >
                {currentStep > 1 ? <Check className='w-4 h-4' /> : '1'}
              </div>
              <span
                className={`ml-2 text-sm font-medium ${
                  currentStep === 1 ? 'text-blue-600' : 'text-green-600'
                }`}
              >
                Review Details
              </span>
            </div>

            <div
              className={`w-12 h-0.5 ${
                currentStep > 1 ? 'bg-green-600' : 'bg-gray-300'
              }`}
            ></div>

            <div className='flex items-center'>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep === 2
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                2
              </div>
              <span
                className={`ml-2 text-sm font-medium ${
                  currentStep === 2 ? 'text-blue-600' : 'text-gray-500'
                }`}
              >
                Contact & Pay
              </span>
            </div>
          </div>
        </div>

        <div className='p-6'>
          {/* Step 1: Review Details - SIMPLIFIED */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className='space-y-6'
            >
              {/* Quick Service Summary */}
              <div className='bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-100'>
                <div className='flex items-start justify-between'>
                  <div>
                    <h3 className='text-xl font-bold text-blue-900 mb-2'>
                      {reservationData.service.name}
                    </h3>
                    {reservationData.service.description && (
                      <p className='text-blue-800 text-sm'>
                        {reservationData.service.description}
                      </p>
                    )}
                  </div>
                  <div className='text-right'>
                    <div className='flex items-center text-blue-700 mb-1'>
                      <DollarSign className='w-5 h-5 mr-1' />
                      <span className='text-3xl font-bold'>
                        ${reservationData.totalPrice.toFixed(2)}
                      </span>
                    </div>
                    <p className='text-sm text-blue-600'>Total Price</p>
                  </div>
                </div>
              </div>

              {/* Booking Details */}
              <div>
                <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center'>
                  <Check className='w-5 h-5 mr-2 text-green-600' />
                  Booking Details
                </h3>

                <FormDataRenderer
                  formData={reservationData.formData}
                  serviceId={reservationData.service.id}
                />
              </div>

              <div className='pt-4'>
                <button
                  onClick={() => setCurrentStep(2)}
                  className='w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center'
                >
                  Continue to Contact Information
                  <ArrowRight className='w-4 h-4 ml-2' />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Contact Information + Direct Payment */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 0 }}
              animate={{ opacity: 1, x: 0 }}
              className='space-y-6'
            >
              <div className='text-center mb-6'>
                <h3 className='text-2xl font-bold text-gray-900 mb-2'>
                  Contact Information
                </h3>
                <p className='text-gray-600'>
                  Enter your details and complete payment in one step
                </p>
              </div>

              <form onSubmit={handleClientInfoSubmit} className='space-y-6'>
                {/* Contact Form Fields */}
                <div className='grid gap-4'>
                  {/* Name */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      <User className='inline w-4 h-4 mr-2' />
                      Full Name *
                    </label>
                    <input
                      type='text'
                      value={clientForm.name}
                      onChange={(e) =>
                        setClientForm({ ...clientForm, name: e.target.value })
                      }
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        clientFormErrors.name
                          ? 'border-red-300'
                          : 'border-gray-300'
                      }`}
                      placeholder='Enter your full name'
                    />
                    {clientFormErrors.name && (
                      <p className='mt-1 text-sm text-red-600'>
                        {clientFormErrors.name}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      <Mail className='inline w-4 h-4 mr-2' />
                      Email Address *
                    </label>
                    <input
                      type='email'
                      value={clientForm.email}
                      onChange={(e) =>
                        setClientForm({ ...clientForm, email: e.target.value })
                      }
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        clientFormErrors.email
                          ? 'border-red-300'
                          : 'border-gray-300'
                      }`}
                      placeholder='Enter your email address'
                    />
                    {clientFormErrors.email && (
                      <p className='mt-1 text-sm text-red-600'>
                        {clientFormErrors.email}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      <Phone className='inline w-4 h-4 mr-2' />
                      Phone Number *
                    </label>
                    <input
                      type='tel'
                      value={clientForm.phone}
                      onChange={(e) =>
                        setClientForm({ ...clientForm, phone: e.target.value })
                      }
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        clientFormErrors.phone
                          ? 'border-red-300'
                          : 'border-gray-300'
                      }`}
                      placeholder='Enter your phone number'
                    />
                    {clientFormErrors.phone && (
                      <p className='mt-1 text-sm text-red-600'>
                        {clientFormErrors.phone}
                      </p>
                    )}
                  </div>

                  {/* Hotel Info (Optional) */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      <Building className='inline w-4 h-4 mr-2' />
                      Hotel/Accommodation (Optional)
                    </label>
                    <input
                      type='text'
                      value={clientForm.hostInfo}
                      onChange={(e) =>
                        setClientForm({
                          ...clientForm,
                          hostInfo: e.target.value,
                        })
                      }
                      className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
                      placeholder='Hotel name or accommodation details'
                    />
                  </div>
                </div>

                {/* Security Notice */}
                <div className='bg-green-50 border border-green-200 rounded-lg p-4'>
                  <div className='flex items-start'>
                    <Shield className='w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0' />
                    <div>
                      <h4 className='font-medium text-green-800 mb-1'>
                        Secure Payment
                      </h4>
                      <p className='text-sm text-green-700'>
                        Next step will open a secure payment window powered by
                        Stripe. Total:{' '}
                        <span className='font-bold'>
                          ${reservationData.totalPrice.toFixed(2)}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className='flex flex-col sm:flex-row gap-4 pt-6'>
                  <button
                    type='button'
                    onClick={() => setCurrentStep(1)}
                    className='flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors'
                  >
                    Back
                  </button>

                  <button
                    type='submit'
                    className='flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center justify-center font-medium'
                  >
                    <CreditCard className='w-4 h-4 mr-2' />
                    Complete Payment ${reservationData.totalPrice.toFixed(2)}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        reservationData={{
          ...reservationData,
          clientInfo: clientForm,
        }}
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentError={handlePaymentError}
      />
    </>
  );
};

export default ReservationSteps;
