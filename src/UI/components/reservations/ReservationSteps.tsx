// UI/components/reservation/ReservationSteps.tsx
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n/client';
import { useReservation } from '@/context/BookingContext';
import {
  ArrowLeft,
  DollarSign,
  CreditCard,
  Shield,
  User,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';

import FormDataRenderer from '@/UI/components/confirmation/FormDataRenderer';
import type { ReservationData } from '@/context/BookingContext';
import CheckoutModal from '../payment/CheckoutModal';

interface ClientInfo {
  name: string;
  email: string;
  phone: string;
  hostInfo: string; // Required field for pickup location contact
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
    } else {
      // Enhanced phone validation - accepts various international formats
      const phoneRegex = /^[\+]?[\d\s\-\(\)]{8,}$/;
      const cleanPhone = clientForm.phone.replace(/[\s\-\(\)]/g, '');
      if (!phoneRegex.test(clientForm.phone) || cleanPhone.length < 8) {
        errors.phone = 'Please enter a valid phone number';
      }
    }

    if (!clientForm.hostInfo.trim()) {
      errors.hostInfo =
        'Host contact information is required for pickup location';
    }

    setClientFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleClientInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateClientForm()) {
      console.log('👤 Client info validated, proceeding to payment');
      updateClientInfo(clientForm);
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
            Enter your details and complete payment
          </p>
        </div>

        <div className='p-6'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='space-y-6'
          >
            {/* Compact Service Summary */}
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

            {/* Collapsible Booking Details */}
            <details className='group bg-gray-50 rounded-lg border border-gray-200'>
              <summary className='cursor-pointer p-4 font-medium text-gray-900 hover:bg-gray-100 rounded-lg transition-colors'>
                <span className='select-none'>📋 View Booking Details</span>
              </summary>
              <div className='px-4 pb-4 border-t border-gray-200'>
                <FormDataRenderer
                  formData={reservationData.formData}
                  serviceId={reservationData.service.id}
                />
              </div>
            </details>

            {/* Contact Information Form */}
            <div className='bg-white border border-gray-200 rounded-lg p-6'>
              <div className='text-center mb-6'>
                <h3 className='text-2xl font-bold text-gray-900 mb-2'>
                  Contact Information
                </h3>
                <p className='text-gray-600'>
                  Enter your details to complete your reservation
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
                      placeholder='+1 (555) 123-4567'
                    />
                    {clientFormErrors.phone && (
                      <p className='mt-1 text-sm text-red-600'>
                        {clientFormErrors.phone}
                      </p>
                    )}
                  </div>

                  {/* Pickup Location Host Contact */}
                  <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4'>
                    <label className='block text-sm font-medium text-gray-700 mb-3'>
                      <MapPin className='inline w-4 h-4 mr-2' />
                      Pickup Location Contact *
                    </label>
                    <div className='space-y-2 mb-3'>
                      <p className='text-sm text-gray-600'>
                        <strong>Where should we pick you up?</strong>
                      </p>
                      <p className='text-xs text-gray-500'>
                        Please provide the name and contact info of your
                        accommodation (hotel, villa, Airbnb, etc.) so we can
                        coordinate the exact pickup location and time.
                      </p>
                    </div>
                    <textarea
                      rows={3}
                      value={clientForm.hostInfo}
                      onChange={(e) =>
                        setClientForm({
                          ...clientForm,
                          hostInfo: e.target.value,
                        })
                      }
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${
                        clientFormErrors.hostInfo
                          ? 'border-red-300'
                          : 'border-gray-300'
                      }`}
                      placeholder='Example: Paradise Beach, Front Desk: +1-555-0123, or: Villa Casa Blanca, Contact: Maria +1-555-9876, 123 Puntacana'
                    />
                    {clientFormErrors.hostInfo && (
                      <p className='mt-1 text-sm text-red-600'>
                        {clientFormErrors.hostInfo}
                      </p>
                    )}
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

                {/* Action Button */}
                <div className='pt-6'>
                  <button
                    type='submit'
                    className='w-full px-6 py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center justify-center font-medium text-lg'
                  >
                    <CreditCard className='w-5 h-5 mr-3' />
                    Complete Payment ${reservationData.totalPrice.toFixed(2)}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
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
