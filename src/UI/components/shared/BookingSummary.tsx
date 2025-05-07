import React, { useState, useEffect } from 'react';
import { CreditCard, Check, ShoppingBag } from 'lucide-react';

// Type Definitions
interface ServiceBooking {
  id: string;
  name: string;
  price: number;
  guests?: number;
  duration?: number;
}

interface BookingData {
  packageType: 'standard' | 'premium';
  selectedServices: ServiceBooking[];
  dates?: {
    startDate: string;
    endDate: string;
  };
  guests?: number;
}

// Payment Method Selector Component
const PaymentMethodSelector: React.FC = () => {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const paymentMethods = [
    {
      id: 'credit-card',
      name: 'Credit Card',
      icon: <CreditCard className='w-6 h-6 text-blue-500' />,
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='#0070ba'
        >
          <path d='M19.59 9.88c-.16-1.27-.86-2.11-1.94-2.11h-4.27l.53-3.4a.97.97 0 0 0-.34-.93.99.99 0 0 0-.97-.17l-3.78 1.38a.99.99 0 0 0-.68.93l-.23 4.57c-.02.33.12.64.37.85a1 1 0 0 0 .88.24h4.35l-.69 4.4a1.01 1.01 0 0 0 1.07 1.17c.45 0 .87-.25 1.09-.64l3.68-6.14a1.01 1.01 0 0 0 .1-.94' />
        </svg>
      ),
    },
  ];

  return (
    <div className='space-y-4'>
      <h2 className='text-2xl font-semibold mb-4 text-gray-800'>
        Select Payment Method
      </h2>
      <div className='grid grid-cols-2 gap-4'>
        {paymentMethods.map((method) => (
          <button
            key={method.id}
            onClick={() => setSelectedMethod(method.id)}
            className={`
              flex flex-col items-center justify-center 
              p-6 rounded-2xl border-2 transition-all duration-300
              ${
                selectedMethod === method.id
                  ? 'border-blue-500 bg-blue-50 shadow-lg'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/20'
              }
            `}
          >
            <div className='mb-3'>{method.icon}</div>
            <span className='font-medium text-gray-800'>{method.name}</span>
            {selectedMethod === method.id && (
              <Check className='absolute top-2 right-2 text-blue-500' />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

// Checkout Summary Component
const CheckoutSummary: React.FC = () => {
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load booking data from localStorage
  useEffect(() => {
    try {
      const storedBooking = localStorage.getItem('booking');
      if (storedBooking) {
        const parsedBooking = JSON.parse(storedBooking);
        setBookingData(parsedBooking);
      }
    } catch (error) {
      console.error('Error parsing booking data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Calculate total price
  const calculateTotal = () => {
    if (!bookingData || !bookingData.selectedServices) return 0;

    return bookingData.selectedServices.reduce((total, service) => {
      const servicePrice = service.price * (service.guests || 1);
      return total + servicePrice;
    }, 0);
  };

  // Handle payment submission
  const handlePaymentSubmit = () => {
    // Placeholder for payment processing
    alert('Payment processed successfully!');

    // Clear booking data
    localStorage.removeItem('booking');

    // Redirect (simulated)
    window.location.href = '/confirmation';
  };

  // Loading or No Services State
  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin w-16 h-16 border-4 border-blue-500 rounded-full'></div>
      </div>
    );
  }

  // No services selected
  if (
    !bookingData ||
    !bookingData.selectedServices ||
    bookingData.selectedServices.length === 0
  ) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-gray-900 mb-4'>
            No Services Selected
          </h2>
          <p className='text-gray-600 mb-6'>
            Please select services before proceeding to payment.
          </p>
          <button
            onClick={() => (window.location.href = '/')}
            className='px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'
          >
            Back to Services
          </button>
        </div>
      </div>
    );
  }

  // Total calculation with tax
  const subtotal = calculateTotal();
  const taxRate = 0.18;
  const total = subtotal * (1 + taxRate);

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-3xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden'>
        {/* Header */}
        <div className='bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6'>
          <h1 className='text-3xl font-bold text-center'>
            Complete Your Booking
          </h1>
        </div>

        {/* Content Container */}
        <div className='p-8 space-y-8'>
          {/* Order Summary */}
          <div className='bg-gray-50 rounded-2xl p-6'>
            <h2 className='text-2xl font-semibold mb-4 text-gray-800'>
              Order Summary
            </h2>

            {/* Package Details */}
            <div className='mb-4 flex justify-between items-center'>
              <span className='text-gray-700 font-medium'>Package:</span>
              <span className='font-bold text-blue-600'>
                {bookingData.packageType === 'standard'
                  ? 'Punta Cana Plan'
                  : 'Punta Cana Luxe'}
              </span>
            </div>

            {/* Selected Services */}
            <div className='space-y-3 border-t pt-4'>
              {bookingData.selectedServices.map((service) => (
                <div
                  key={service.id}
                  className='flex justify-between items-center text-gray-700'
                >
                  <div className='flex items-center'>
                    <ShoppingBag className='mr-3 text-gray-500' size={20} />
                    <span>{service.name}</span>
                  </div>
                  <div className='flex flex-col items-end'>
                    <span className='font-semibold'>
                      ${service.price.toFixed(2)}
                    </span>
                    {service.guests && service.guests > 1 && (
                      <span className='text-xs text-gray-500'>
                        × {service.guests} guests
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Cost Breakdown */}
            <div className='mt-4 pt-4 border-t'>
              <div className='flex justify-between mb-2'>
                <span className='text-gray-600'>Subtotal</span>
                <span className='text-gray-900'>${subtotal.toFixed(2)}</span>
              </div>
              <div className='flex justify-between mb-2'>
                <span className='text-gray-600'>Taxes & Fees (18%)</span>
                <span className='text-gray-900'>
                  ${(subtotal * taxRate).toFixed(2)}
                </span>
              </div>
              <div className='flex justify-between font-bold text-xl mt-4'>
                <span>Total</span>
                <span className='text-blue-600'>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <PaymentMethodSelector />

          {/* Payment Submit Button */}
          <button
            onClick={handlePaymentSubmit}
            className='
              w-full py-4 rounded-full 
              bg-gradient-to-r from-blue-600 to-purple-600 
              hover:from-blue-700 hover:to-purple-700 
              text-white font-bold 
              transition-all duration-300 
              transform hover:scale-105 
              flex items-center justify-center 
              gap-3
            '
          >
            <CreditCard className='w-6 h-6' />
            Complete Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSummary;
