import React, { useState, useEffect } from 'react';
import { CheckCircle, Mail, Copy, ExternalLink } from 'lucide-react';
import { ReservationService } from '@/primary/Reservation/useCases';

interface ReservationSuccessPageProps {
  reservationId: string;
  onStartOver: () => void;
}

const ReservationSuccessPage: React.FC<ReservationSuccessPageProps> = ({
  reservationId,
  onStartOver,
}) => {
  const [reservation, setReservation] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Fetch reservation details
  useEffect(() => {
    const fetchReservation = async () => {
      try {
        const reservationData = await ReservationService.getReservation(
          reservationId
        );
        setReservation(reservationData);
      } catch (err) {
        setError('Unable to load reservation details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReservation();
  }, [reservationId]);

  const copyReservationId = () => {
    navigator.clipboard.writeText(reservationId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className='max-w-lg mx-auto p-8 text-center'>
        <div className='animate-pulse'>
          <div className='rounded-full bg-gray-200 h-24 w-24 mx-auto mb-4'></div>
          <div className='h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4'></div>
          <div className='h-4 bg-gray-200 rounded w-1/2 mx-auto mb-2'></div>
          <div className='h-4 bg-gray-200 rounded w-3/4 mx-auto mb-4'></div>
        </div>
      </div>
    );
  }

  if (error || !reservation) {
    return (
      <div className='max-w-lg mx-auto p-8 text-center'>
        <div className='bg-red-50 p-6 rounded-lg'>
          <h2 className='text-2xl font-bold text-red-700 mb-4'>
            Something went wrong
          </h2>
          <p className='text-red-600 mb-4'>
            {error || "We couldn't find your reservation details."}
          </p>
          <button
            onClick={onStartOver}
            className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
          >
            Return to Services
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-lg mx-auto p-8'>
      <div className='text-center mb-8'>
        <div className='inline-flex items-center justify-center h-24 w-24 rounded-full bg-green-100 mb-6'>
          <CheckCircle className='h-12 w-12 text-green-600' />
        </div>
        <h1 className='text-3xl font-bold text-gray-900 mb-2'>
          Request Submitted!
        </h1>
        <p className='text-gray-600'>
          Your reservation request has been successfully submitted and is
          pending confirmation.
        </p>
      </div>

      <div className='bg-white shadow-lg rounded-lg overflow-hidden mb-8'>
        <div className='bg-blue-600 px-6 py-4'>
          <h2 className='text-white font-medium'>Reservation Details</h2>
        </div>

        <div className='p-6'>
          <div className='space-y-4'>
            <div>
              <h3 className='text-sm font-medium text-gray-500'>
                Reservation ID
              </h3>
              <div className='mt-1 flex items-center'>
                <span className='text-gray-900 font-mono'>{reservationId}</span>
                <button
                  onClick={copyReservationId}
                  className='ml-2 text-blue-600 hover:text-blue-800'
                  aria-label='Copy reservation ID'
                >
                  {copied ? (
                    <CheckCircle className='h-4 w-4' />
                  ) : (
                    <Copy className='h-4 w-4' />
                  )}
                </button>
              </div>
            </div>

            <div>
              <h3 className='text-sm font-medium text-gray-500'>Service</h3>
              <p className='mt-1 text-gray-900'>{reservation.service.name}</p>
            </div>

            <div>
              <h3 className='text-sm font-medium text-gray-500'>Status</h3>
              <p className='mt-1'>
                <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800'>
                  Pending Confirmation
                </span>
              </p>
            </div>

            <div>
              <h3 className='text-sm font-medium text-gray-500'>
                Contact Information
              </h3>
              <p className='mt-1 text-gray-900'>{reservation.customer.name}</p>
              <p className='text-gray-900'>{reservation.customer.email}</p>
              <p className='text-gray-900'>{reservation.customer.phone}</p>
            </div>
          </div>
        </div>
      </div>

      <div className='bg-blue-50 border border-blue-100 rounded-lg p-6 mb-8'>
        <div className='flex'>
          <div className='flex-shrink-0'>
            <Mail className='h-6 w-6 text-blue-600' />
          </div>
          <div className='ml-3'>
            <h3 className='text-lg font-medium text-blue-800'>
              What happens next?
            </h3>
            <div className='mt-2 text-sm text-blue-700 space-y-1'>
              <p>
                Our team will review your request and you will receive a
                confirmation email within as soon as posible.
              </p>
              <p>
                Once confirmed, a payment link will be sent to your email to
                complete your booking.
              </p>
              <p>
                Please check your inbox (and spam folder) for communications
                from us.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className='text-center'>
        <button
          onClick={onStartOver}
          className='inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
        >
          Return to Services
        </button>

        <p className='mt-4 text-sm text-gray-500'>
          Need help?{' '}
          <a
            href='/contact'
            className='text-blue-600 hover:text-blue-800 inline-flex items-center'
          >
            Contact our support team <ExternalLink className='ml-1 h-3 w-3' />
          </a>
        </p>
      </div>
    </div>
  );
};

export default ReservationSuccessPage;
