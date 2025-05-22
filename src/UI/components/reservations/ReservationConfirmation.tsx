// src/components/ReservationConfirmation.tsx
import React, { useState } from 'react';
import { Service, BookingDate } from '../types/type';
import {
  Clock,
  Calendar,
  User,
  Phone,
  Mail,
  CheckCircle,
  AlertCircle,
  Loader,
} from 'lucide-react';
import ReservationService from '@/infra/services/api/ReservationService';

interface ReservationConfirmationProps {
  service: Service;
  bookingDate: BookingDate;
  guests: number;
  formData: any;
  onBack: () => void;
  onComplete: (reservationId: string) => void;
}

const ReservationConfirmation: React.FC<ReservationConfirmationProps> = ({
  service,
  bookingDate,
  guests,
  formData,
  onBack,
  onComplete,
}) => {
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const [status, setStatus] = useState<
    'idle' | 'submitting' | 'success' | 'error'
  >('idle');
  const [error, setError] = useState<string | null>(null);

  // Format the booking date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      setError('Please fill in all required fields');
      return;
    }

    setStatus('submitting');
    setError(null);

    try {
      const result = await ReservationService.createReservation(
        service,
        bookingDate,
        guests,
        customerInfo,
        formData // Any additional service-specific data
      );

      if (result.success && result.reservationId) {
        setStatus('success');
        setTimeout(() => {
          onComplete(result.reservationId!);
        }, 2000);
      } else {
        throw new Error(result.error || 'Failed to create reservation');
      }
    } catch (err) {
      setStatus('error');
      setError(
        err instanceof Error ? err.message : 'An unexpected error occurred'
      );
    }
  };

  if (status === 'success') {
    return (
      <div className='max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg'>
        <div className='text-center mb-6'>
          <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4'>
            <CheckCircle className='w-8 h-8 text-green-600' />
          </div>
          <h2 className='text-2xl font-bold text-gray-800'>
            Reservation Submitted!
          </h2>
          <p className='text-gray-600 mt-2'>
            Your reservation request has been received and is pending
            confirmation.
          </p>
        </div>

        <div className='bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4'>
          <p className='text-sm text-blue-700'>
            <strong>What happens next?</strong> Our team will review your
            reservation request and send you a confirmation email within 24
            hours. Once confirmed, you'll receive a payment link to complete
            your booking.
          </p>
        </div>

        <div className='border-t border-gray-200 pt-4 mt-4 text-sm text-gray-500'>
          <p>For any questions, please contact our support team.</p>
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg'>
      <h2 className='text-2xl font-bold text-gray-800 mb-6'>
        Confirm Your Reservation
      </h2>

      {/* Service Summary */}
      <div className='bg-gray-50 rounded-lg p-4 mb-6'>
        <h3 className='font-semibold text-gray-700 mb-3'>
          Reservation Summary
        </h3>
        <div className='space-y-2'>
          <div className='flex items-start'>
            <div className='flex-shrink-0 mt-1'>
              <Calendar className='h-5 w-5 text-gray-400' />
            </div>
            <div className='ml-3'>
              <p className='text-sm font-medium text-gray-800'>Date</p>
              <p className='text-sm text-gray-600'>
                {formatDate(bookingDate.startDate)}
                {bookingDate.endDate &&
                  bookingDate.startDate.getTime() !==
                    bookingDate.endDate.getTime() &&
                  ` - ${formatDate(bookingDate.endDate)}`}
              </p>
            </div>
          </div>

          <div className='flex items-start'>
            <div className='flex-shrink-0 mt-1'>
              <Clock className='h-5 w-5 text-gray-400' />
            </div>
            <div className='ml-3'>
              <p className='text-sm font-medium text-gray-800'>Service</p>
              <p className='text-sm text-gray-600'>{service.name}</p>
            </div>
          </div>

          {/* Add more service details as needed */}
        </div>
      </div>

      {/* Customer Information Form */}
      <form onSubmit={handleSubmit}>
        <h3 className='font-semibold text-gray-700 mb-4'>Your Information</h3>

        <div className='space-y-4 mb-6'>
          <div>
            <label
              htmlFor='name'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Full Name *
            </label>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <User className='h-5 w-5 text-gray-400' />
              </div>
              <input
                type='text'
                id='name'
                name='name'
                value={customerInfo.name}
                onChange={handleInputChange}
                required
                className='pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                placeholder='Your full name'
              />
            </div>
          </div>

          <div>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Email Address *
            </label>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <Mail className='h-5 w-5 text-gray-400' />
              </div>
              <input
                type='email'
                id='email'
                name='email'
                value={customerInfo.email}
                onChange={handleInputChange}
                required
                className='pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                placeholder='your.email@example.com'
              />
            </div>
          </div>

          <div>
            <label
              htmlFor='phone'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Phone Number *
            </label>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <Phone className='h-5 w-5 text-gray-400' />
              </div>
              <input
                type='tel'
                id='phone'
                name='phone'
                value={customerInfo.phone}
                onChange={handleInputChange}
                required
                className='pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                placeholder='+1 (555) 123-4567'
              />
            </div>
          </div>
        </div>

        {/* Confirmation Notice */}
        <div className='bg-yellow-50 border border-yellow-100 rounded-lg p-4 mb-6'>
          <div className='flex'>
            <div className='flex-shrink-0'>
              <AlertCircle className='h-5 w-5 text-yellow-400' />
            </div>
            <div className='ml-3'>
              <h3 className='text-sm font-medium text-yellow-800'>
                Confirmation Required
              </h3>
              <div className='mt-2 text-sm text-yellow-700'>
                <p>
                  This reservation requires confirmation before payment. After
                  submission:
                </p>
                <ul className='list-disc pl-5 mt-1 space-y-1'>
                  <li>Our team will review your request</li>
                  <li>You'll receive a confirmation email</li>
                  <li>A payment link will be sent to complete your booking</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4'>
            {error}
          </div>
        )}

        <div className='flex justify-between'>
          <button
            type='button'
            onClick={onBack}
            className='inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50'
          >
            Back
          </button>

          <button
            type='submit'
            disabled={status === 'submitting'}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
              status === 'submitting'
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {status === 'submitting' ? (
              <>
                <Loader className='animate-spin -ml-1 mr-2 h-4 w-4' />
                Submitting...
              </>
            ) : (
              'Submit Reservation'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReservationConfirmation;
