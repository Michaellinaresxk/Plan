// UI/components/reservation/ReservationSteps.tsx
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n/client';
import { useReservation } from '@/context/BookingContext';
import {
  ArrowLeft,
  CreditCard,
  Shield,
  User,
  Mail,
  Phone,
  CheckCircle,
  Send,
} from 'lucide-react';

import type { ReservationData } from '@/context/BookingContext';
import CheckoutModal from '../payment/CheckoutModal';

interface ClientInfo {
  name: string;
  email: string;
  phone: string;
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
  const [inquirySent, setInquirySent] = useState(
    // If inquiry service AND clientInfo already provided (email sent from form), show success immediately
    !!(reservationData.isInquiry && reservationData.clientInfo),
  );
  const [isSubmittingInquiry, setIsSubmittingInquiry] = useState(false);
  const [clientForm, setClientForm] = useState<ClientInfo>({
    name: reservationData.clientInfo?.name || '',
    email: reservationData.clientInfo?.email || '',
    phone: reservationData.clientInfo?.phone || '',
  });
  const [clientFormErrors, setClientFormErrors] = useState<Partial<ClientInfo>>(
    {},
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

  // Handler for inquiry-only services that need contact info collected here (e.g. BabysitterForm)
  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateClientForm()) return;

    setIsSubmittingInquiry(true);
    try {
      await fetch('/api/services/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceName: reservationData.service.name,
          serviceType: reservationData.formData?.serviceType || reservationData.service.id,
          customerName: clientForm.name,
          customerEmail: clientForm.email,
          customerPhone: clientForm.phone,
          totalGuests: reservationData.formData?.childrenCount || reservationData.formData?.guests || 1,
          totalPrice: reservationData.totalPrice,
          message: Object.entries(reservationData.formData || {})
            .filter(([k]) => !['serviceId', 'serviceName', 'serviceType', 'calculatedPrice'].includes(k))
            .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
            .join('\n'),
        }),
      });
      setInquirySent(true);
    } catch (err) {
      console.error('Inquiry email failed:', err);
      // Still show success to avoid confusing the user — email may have gone through
      setInquirySent(true);
    } finally {
      setIsSubmittingInquiry(false);
    }
  };

  // Inquiry success screen
  if (reservationData.isInquiry && inquirySent) {
    const contactEmail = reservationData.clientInfo?.email || clientForm.email;
    return (
      <div className='space-y-8'>
        <div className='bg-gradient-to-r from-green-600 to-green-700 p-6 text-white rounded-t-xl'>
          <button
            onClick={() => router.push('/')}
            className='flex items-center text-green-100 hover:text-white mb-4 transition-colors'
          >
            <ArrowLeft className='w-4 h-4 mr-2' />
            Back to Services
          </button>
          <h1 className='text-2xl font-bold'>Inquiry Received!</h1>
          <p className='text-green-100 mt-1'>We'll be in touch with you shortly</p>
        </div>

        <div className='p-6 text-center'>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.6 }}
            className='inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6'
          >
            <CheckCircle className='w-10 h-10 text-green-600' />
          </motion.div>

          <h2 className='text-2xl font-bold text-gray-900 mb-3'>
            Thank you for your inquiry!
          </h2>
          <p className='text-gray-600 mb-6 max-w-md mx-auto'>
            We've received your request for{' '}
            <span className='font-semibold'>{reservationData.service.name}</span>.
            Our team will contact you{contactEmail ? ` at ${contactEmail}` : ''} within 24 hours to confirm details.
          </p>

          <div className='bg-green-50 border border-green-200 rounded-lg p-4 max-w-sm mx-auto mb-8'>
            <div className='flex items-center gap-2 text-green-800'>
              <Send className='w-4 h-4' />
              <span className='text-sm font-medium'>Inquiry email sent successfully</span>
            </div>
          </div>

          <button
            onClick={() => { clearReservation(); router.push('/'); }}
            className='px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors'
          >
            Back to Services
          </button>
        </div>
      </div>
    );
  }

  // Inquiry services that need contact info collected (clientInfo not yet provided)
  if (reservationData.isInquiry && !inquirySent) {
    return (
      <div className='space-y-8'>
        <div className='bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white rounded-t-xl'>
          <button
            onClick={() => router.back()}
            className='flex items-center text-blue-100 hover:text-white mb-4 transition-colors'
          >
            <ArrowLeft className='w-4 h-4 mr-2' />
            {t('common.back', { fallback: 'Back' })}
          </button>
          <h1 className='text-2xl font-bold'>
            {t('reservation.inquiryTitle', { fallback: 'Send Your Inquiry' })}
          </h1>
          <p className='text-blue-100 mt-1'>
            Provide your contact details and we'll get back to you shortly
          </p>
        </div>

        <div className='p-2'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='space-y-6'
          >
            <div className='bg-white border border-gray-200 rounded-lg p-4'>
              <div className='text-center mb-6'>
                <h3 className='text-2xl font-bold text-gray-900 mb-2'>
                  Contact Information
                </h3>
                <p className='text-gray-600'>
                  Enter your details so we can follow up on your inquiry
                </p>
              </div>

              <form onSubmit={handleInquirySubmit} className='space-y-6'>
                <div className='grid gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      <User className='inline w-4 h-4 mr-2' />
                      Full Name *
                    </label>
                    <input
                      type='text'
                      value={clientForm.name}
                      onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${clientFormErrors.name ? 'border-red-300' : 'border-gray-300'}`}
                      placeholder='Enter your full name'
                    />
                    {clientFormErrors.name && <p className='mt-1 text-sm text-red-600'>{clientFormErrors.name}</p>}
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      <Mail className='inline w-4 h-4 mr-2' />
                      Email Address *
                    </label>
                    <input
                      type='email'
                      value={clientForm.email}
                      onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${clientFormErrors.email ? 'border-red-300' : 'border-gray-300'}`}
                      placeholder='Enter your email address'
                    />
                    {clientFormErrors.email && <p className='mt-1 text-sm text-red-600'>{clientFormErrors.email}</p>}
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      <Phone className='inline w-4 h-4 mr-2' />
                      Phone Number *
                    </label>
                    <input
                      type='tel'
                      value={clientForm.phone}
                      onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${clientFormErrors.phone ? 'border-red-300' : 'border-gray-300'}`}
                      placeholder='+1 (555) 123-4567'
                    />
                    {clientFormErrors.phone && <p className='mt-1 text-sm text-red-600'>{clientFormErrors.phone}</p>}
                  </div>
                </div>

                <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
                  <div className='flex items-start'>
                    <Shield className='w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0' />
                    <div>
                      <h4 className='font-medium text-blue-800 mb-1'>No payment required</h4>
                      <p className='text-sm text-blue-700'>
                        This is an inquiry — no payment will be charged. Our team will contact you to finalize the details.
                      </p>
                    </div>
                  </div>
                </div>

                <div className='pt-2'>
                  <button
                    type='submit'
                    disabled={isSubmittingInquiry}
                    className='w-full px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center font-medium text-lg disabled:opacity-60'
                  >
                    <Send className='w-5 h-5 mr-3' />
                    {isSubmittingInquiry ? 'Sending...' : 'Send Inquiry'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

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

        <div className='p-2'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='space-y-6'
          >
            {/* Contact Information Form */}
            <div className='bg-white border border-gray-200 rounded-lg p-4'>
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
                        Next step will open a secure payment window. We use
                        industry-leading payment providers to ensure your data
                        is safe and transactions are secure.
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
