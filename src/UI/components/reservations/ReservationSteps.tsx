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
  Clock,
  User,
  Mail,
  Phone,
  Building,
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
      console.log('👤 Submitting client info:', clientForm);
      updateClientInfo(clientForm);
      setCurrentStep(3);
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

  const handleStartPayment = () => {
    console.log('💳 Starting payment process...');
    setShowCheckout(true);
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
              fallback: 'Confirm Your Reservation',
            })}
          </h1>
          <p className='text-blue-100 mt-1'>
            {t('reservation.confirmSubtitle', {
              fallback:
                'Review your booking details and complete your reservation',
            })}
          </p>
        </div>

        {/* Step Indicator */}
        <div className='p-6 border-b bg-gray-50 rounded-none'>
          <StepIndicator currentStep={currentStep} />
        </div>

        <div className='p-6'>
          {/* Step 1: Review Details */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className='space-y-6'
            >
              {/* Service Summary */}
              <div className='bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-100'>
                <div className='flex items-start justify-between mb-4'>
                  <div>
                    <h3 className='text-xl font-bold text-blue-900 mb-2'>
                      {reservationData.service.name}
                    </h3>
                    <div className='flex items-center text-blue-700 mb-2'>
                      <span className='bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded-full uppercase tracking-wide'>
                        {reservationData.service.packageType || 'Service'}
                      </span>
                    </div>
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

                {reservationData.service.description && (
                  <p className='text-blue-800 text-sm leading-relaxed'>
                    {reservationData.service.description}
                  </p>
                )}
              </div>

              {/* Booking Details */}
              <div>
                <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center'>
                  <Check className='w-5 h-5 mr-2 text-green-600' />
                  {t('reservation.bookingDetails', {
                    fallback: 'Booking Details',
                  })}
                </h3>

                <FormDataRenderer
                  formData={reservationData.formData}
                  serviceId={reservationData.service.id}
                />
              </div>

              {/* Important Information */}
              <div className='bg-amber-50 border border-amber-200 rounded-lg p-4'>
                <div className='flex items-start'>
                  <Clock className='w-5 h-5 text-amber-600 mr-3 mt-0.5 flex-shrink-0' />
                  <div>
                    <h4 className='font-medium text-amber-800 mb-1'>
                      {t('reservation.importantInfo.title', {
                        fallback: 'Important Information',
                      })}
                    </h4>
                    <p className='text-sm text-amber-700'>
                      {t('reservation.importantInfo.message', {
                        fallback:
                          'Please review all details carefully. Once confirmed, changes may require additional fees or may not be possible.',
                      })}
                    </p>
                  </div>
                </div>
              </div>

              <div className='pt-4'>
                <button
                  onClick={() => setCurrentStep(2)}
                  className='w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium'
                >
                  {t('reservation.continue', { fallback: 'Continue' })}
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Contact Information */}
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
                  Please provide your contact details for the reservation
                </p>
              </div>

              <form onSubmit={handleClientInfoSubmit} className='space-y-6'>
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

                {/* Host Information (Optional) */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    <Building className='inline w-4 h-4 mr-2' />
                    Hotel/Accommodation (Optional)
                  </label>
                  <input
                    type='text'
                    value={clientForm.hostInfo}
                    onChange={(e) =>
                      setClientForm({ ...clientForm, hostInfo: e.target.value })
                    }
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
                    placeholder='Hotel name or accommodation details'
                  />
                  <p className='mt-1 text-sm text-gray-500'>
                    This helps us coordinate service delivery
                  </p>
                </div>

                {/* Action Buttons */}
                <div className='flex flex-col sm:flex-row gap-4 pt-6'>
                  <button
                    type='button'
                    onClick={() => setCurrentStep(1)}
                    className='flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors'
                  >
                    {t('common.back', { fallback: 'Back' })}
                  </button>

                  <button
                    type='submit'
                    className='flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium'
                  >
                    Continue to Payment
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Step 3: Final Confirmation & Payment */}
          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className='space-y-6'
            >
              <div className='text-center'>
                <div className='bg-green-50 p-6 rounded-lg mb-6'>
                  <Check className='w-16 h-16 text-green-600 mx-auto mb-4' />
                  <h3 className='text-2xl font-bold text-green-900 mb-2'>
                    {t('reservation.readyToBook', {
                      fallback: 'Ready to Complete Your Booking',
                    })}
                  </h3>
                  <p className='text-green-700'>
                    {t('reservation.finalStep', {
                      fallback:
                        "You're one step away from securing your reservation",
                    })}
                  </p>
                </div>
              </div>

              {/* Final Summary */}
              <div className='bg-gray-50 p-6 rounded-lg'>
                <h4 className='font-bold text-gray-900 mb-4 text-lg'>
                  {t('reservation.summary', { fallback: 'Booking Summary' })}
                </h4>

                <div className='space-y-3'>
                  <div className='flex justify-between items-center pb-2 border-b border-gray-200'>
                    <span className='font-medium text-gray-700'>
                      {t('reservation.service', { fallback: 'Service' })}:
                    </span>
                    <span className='text-gray-900'>
                      {reservationData.service.name}
                    </span>
                  </div>

                  <div className='flex justify-between items-center pb-2 border-b border-gray-200'>
                    <span className='font-medium text-gray-700'>
                      {t('reservation.client', { fallback: 'Client' })}:
                    </span>
                    <span className='text-gray-900'>{clientForm.name}</span>
                  </div>

                  <div className='flex justify-between items-center pb-2 border-b border-gray-200'>
                    <span className='font-medium text-gray-700'>
                      {t('reservation.email', { fallback: 'Email' })}:
                    </span>
                    <span className='text-gray-900'>{clientForm.email}</span>
                  </div>

                  <div className='flex justify-between items-center pb-2 border-b border-gray-200'>
                    <span className='font-medium text-gray-700'>
                      {t('reservation.phone', { fallback: 'Phone' })}:
                    </span>
                    <span className='text-gray-900'>{clientForm.phone}</span>
                  </div>

                  {clientForm.hostInfo && (
                    <div className='flex justify-between items-center pb-2 border-b border-gray-200'>
                      <span className='font-medium text-gray-700'>
                        Accommodation:
                      </span>
                      <span className='text-gray-900'>
                        {clientForm.hostInfo}
                      </span>
                    </div>
                  )}

                  <div className='flex justify-between items-center pt-2'>
                    <span className='text-lg font-bold text-gray-900'>
                      {t('reservation.total', { fallback: 'Total' })}:
                    </span>
                    <span className='text-xl font-bold text-blue-600'>
                      ${reservationData.totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Security Notice */}
              <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
                <div className='flex items-start'>
                  <Shield className='w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0' />
                  <div>
                    <h4 className='font-medium text-blue-800 mb-1'>
                      {t('reservation.security.title', {
                        fallback: 'Secure Payment',
                      })}
                    </h4>
                    <p className='text-sm text-blue-700'>
                      {t('reservation.security.message', {
                        fallback:
                          'Your payment will be processed securely through Stripe. You will receive a confirmation email with all details shortly after payment.',
                      })}
                    </p>
                  </div>
                </div>
              </div>

              <div className='flex flex-col sm:flex-row gap-4 pt-6'>
                <button
                  onClick={() => setCurrentStep(2)}
                  className='flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors'
                >
                  {t('common.back', { fallback: 'Back' })}
                </button>

                <button
                  onClick={handleStartPayment}
                  className='flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center justify-center font-medium'
                >
                  <CreditCard className='w-4 h-4 mr-2' />
                  {t('reservation.confirmBooking', {
                    fallback: 'Pay Now & Complete Booking',
                  })}
                </button>
              </div>
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
