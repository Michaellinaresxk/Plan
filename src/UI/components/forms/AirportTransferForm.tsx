import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { Service } from '@/types/type';
import {
  Plane,
  Calendar,
  Users,
  Baby,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Info,
} from 'lucide-react';
import ServiceManager from '@/constants/services/ServiceManager';

interface AirportTransferFormProps {
  service: Service;
  onSubmit: (formData: any) => void;
  onCancel: () => void;
}

const AirportTransferForm: React.FC<AirportTransferFormProps> = ({
  service,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    date: '',
    flightNumber: '',
    isRoundTrip: false,
    returnDate: '',
    returnFlightNumber: '',
    passengerCount: 1,
    kidsCount: 1,
    needsCarSeat: false,
    carSeatCount: 0,
    vehicleType: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentPrice, setCurrentPrice] = useState(service.price);

  // Get service data and vehicle options
  const serviceData = ServiceManager.getData(service.id);
  const vehicleOptions = serviceData?.options?.vehicleType?.subOptions || {};

  // Set default vehicle type on component mount
  useEffect(() => {
    if (Object.keys(vehicleOptions).length > 0 && !formData.vehicleType) {
      setFormData((prev) => ({
        ...prev,
        vehicleType: Object.keys(vehicleOptions)[0],
      }));
    }
  }, [vehicleOptions]);

  // Update price when relevant form fields change
  useEffect(() => {
    let price = service.price;

    // Vehicle price
    const selectedVehicle = vehicleOptions[formData.vehicleType];
    if (selectedVehicle?.capacityInfo?.price) {
      price = selectedVehicle.capacityInfo.price;
    }

    // Round trip price
    if (formData.isRoundTrip) {
      price = price * 1.8;
    }

    // Child seats
    const carSeatPrice = 25; // per seat
    price += formData.carSeatCount * carSeatPrice;

    setCurrentPrice(price);
  }, [
    formData.vehicleType,
    formData.isRoundTrip,
    formData.carSeatCount,
    service.price,
  ]);

  const isSameDay = (dateString: string): boolean => {
    if (!dateString) return false;

    const today = new Date();
    const selectedDate = new Date(dateString);

    return (
      today.getFullYear() === selectedDate.getFullYear() &&
      today.getMonth() === selectedDate.getMonth() &&
      today.getDate() === selectedDate.getDate()
    );
  };

  // Handle form submission
  const hasMinimum24Hours = (dateString: string): boolean => {
    if (!dateString) return false;

    const now = new Date();
    const selectedDate = new Date(dateString);

    // Calcula la diferencia en milisegundos
    const differenceMs = selectedDate.getTime() - now.getTime();
    const hours = differenceMs / (1000 * 60 * 60);

    return hours >= 24;
  };

  // Modifica la función handleSubmit para incluir esta validación
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const newErrors: Record<string, string> = {};

    if (!formData.date) {
      newErrors.date = t('form.errors.required');
    }

    if (!formData.flightNumber) {
      newErrors.flightNumber = t('form.errors.required');
    }

    if (formData.isRoundTrip && !formData.returnDate) {
      newErrors.returnDate = t('form.errors.required');
    }

    if (formData.isRoundTrip && !formData.returnFlightNumber) {
      newErrors.returnFlightNumber = t('form.errors.required');
    }

    // Nueva validación para la reserva del mismo día
    if (isSameDay(formData.date)) {
      // Mostrar diálogo de confirmación en lugar de un error
      if (
        !window.confirm(
          t('services.airportTransfer.form.sameDayConfirmation', {
            fallback:
              'You are booking for today. This requires immediate confirmation from our team. Continue?',
          })
        )
      ) {
        return; // El usuario canceló la confirmación
      }
    } else if (!hasMinimum24Hours(formData.date)) {
      newErrors.date = t('services.airportTransfer.form.minimum24Hours', {
        fallback: 'Bookings must be made at least 24 hours in advance',
      });
    }

    setErrors(newErrors);

    // Submit if no errors
    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
    }
  };

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target;

    if (name === 'needsCarSeat' && !checked) {
      // If turning off car seat, reset count
      setFormData((prev) => ({
        ...prev,
        needsCarSeat: checked,
        carSeatCount: 0,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  // Handle passenger count changes
  const updatePassengerCount = (increment: boolean) => {
    setFormData((prev) => ({
      ...prev,
      passengerCount: increment
        ? prev.passengerCount + 1
        : Math.max(1, prev.passengerCount - 1),
    }));
  };

  // Handle passenger count changes
  const updateKidsCount = (increment: boolean) => {
    setFormData((prev) => ({
      ...prev,
      kidsCount: increment
        ? prev.kidsCount + 1
        : Math.max(1, prev.kidsCount - 1),
    }));
  };

  // Handle child seat count changes
  const updateCarSeatCount = (increment: boolean) => {
    setFormData((prev) => ({
      ...prev,
      carSeatCount: increment
        ? prev.carSeatCount + 1
        : Math.max(0, prev.carSeatCount - 1),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className='w-full mx-auto overflow-hidden '>
      <div className='bg-white rounded-xl shadow-lg border border-gray-100'>
        {/* Form Header - Luxury Style */}
        <div className='bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 p-6 text-white'>
          <h2 className='text-2xl font-light tracking-wide'>
            {t('services.airportTransfer.luxuryBooking')}
          </h2>
          <p className='text-blue-100 mt-1 font-light'>
            {t('services.airportTransfer.luxuryDescription')}
          </p>
        </div>

        {/* Form Body */}
        <div className='p-8 space-y-8'>
          {/* Flight Details Section */}
          <div className='space-y-6'>
            <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2'>
              {t('services.airportTransfer.form.flightDetails')}
            </h3>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {/* Date Field */}
              <div>
                <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                  <Calendar className='w-4 h-4 mr-2 text-blue-700' />
                  {t('services.airportTransfer.form.date')} *
                </label>
                <input
                  type='date'
                  name='date'
                  value={formData.date}
                  onChange={handleChange}
                  className={`w-full p-3 border ${
                    errors.date ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-50`}
                  min={new Date().toISOString().split('T')[0]}
                />
                {errors.date && (
                  <p className='text-red-500 text-xs mt-1'>{errors.date}</p>
                )}
              </div>

              {/* Flight Number Field */}
              <div>
                <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                  <Plane className='w-4 h-4 mr-2 text-blue-700' />
                  {t('services.airportTransfer.form.flightNumber')} *
                </label>
                <input
                  type='text'
                  name='flightNumber'
                  value={formData.flightNumber}
                  onChange={handleChange}
                  placeholder='BA1234'
                  className={`w-full p-3 border ${
                    errors.flightNumber ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-50`}
                />
                {errors.flightNumber && (
                  <p className='text-red-500 text-xs mt-1'>
                    {errors.flightNumber}
                  </p>
                )}
              </div>
            </div>

            {isSameDay(formData.date) && (
              <p className='text-amber-600 text-xs mt-1 flex items-center'>
                <Info className='w-3 h-3 mr-1' />
                {t('services.airportTransfer.form.sameDayWarning', {
                  fallback: 'Same-day bookings require immediate confirmation',
                })}
              </p>
            )}
            {!isSameDay(formData.date) &&
              !hasMinimum24Hours(formData.date) &&
              formData.date && (
                <p className='text-amber-600 text-xs mt-1 flex items-center'>
                  <Info className='w-3 h-3 mr-1' />
                  {t('services.airportTransfer.form.advanceBookingRequired', {
                    fallback: 'Please book at least 24 hours in advance',
                  })}
                </p>
              )}

            {/* Round Trip Toggle - Luxury Style */}
            <div className='mt-2'>
              <div
                className='flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition cursor-pointer'
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    isRoundTrip: !prev.isRoundTrip,
                  }))
                }
              >
                <div className='flex items-center'>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      formData.isRoundTrip
                        ? 'border-blue-700 bg-blue-700'
                        : 'border-gray-400'
                    }`}
                  >
                    {formData.isRoundTrip && (
                      <CheckCircle className='w-4 h-4 text-white' />
                    )}
                  </div>
                  <span className='ml-3 font-medium text-gray-800'>
                    {t('services.airportTransfer.form.roundTrip')}
                  </span>
                </div>
                <span className='text-blue-700'>
                  {formData.isRoundTrip ? (
                    <ChevronUp className='w-5 h-5' />
                  ) : (
                    <ChevronDown className='w-5 h-5' />
                  )}
                </span>
              </div>

              {/* Return Flight Details */}
              {formData.isRoundTrip && (
                <div className='mt-4 pl-6 border-l-2 border-blue-200 space-y-6'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    {/* Return Date */}
                    <div>
                      <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                        <Calendar className='w-4 h-4 mr-2 text-blue-700' />
                        {t('services.airportTransfer.form.returnDate')} *
                      </label>
                      <input
                        type='date'
                        name='returnDate'
                        value={formData.returnDate}
                        onChange={handleChange}
                        className={`w-full p-3 border ${
                          errors.returnDate
                            ? 'border-red-500'
                            : 'border-gray-300'
                        } rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-50`}
                        min={
                          formData.date ||
                          new Date().toISOString().split('T')[0]
                        }
                      />
                      {errors.returnDate && (
                        <p className='text-red-500 text-xs mt-1'>
                          {errors.returnDate}
                        </p>
                      )}
                    </div>

                    {/* Return Flight Number */}
                    <div>
                      <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                        <Plane className='w-4 h-4 mr-2 text-blue-700' />
                        {t(
                          'services.airportTransfer.form.returnFlightNumber'
                        )}{' '}
                        *
                      </label>
                      <input
                        type='text'
                        name='returnFlightNumber'
                        value={formData.returnFlightNumber}
                        onChange={handleChange}
                        placeholder='BA4321'
                        className={`w-full p-3 border ${
                          errors.returnFlightNumber
                            ? 'border-red-500'
                            : 'border-gray-300'
                        } rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-50`}
                      />
                      {errors.returnFlightNumber && (
                        <p className='text-red-500 text-xs mt-1'>
                          {errors.returnFlightNumber}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Passenger Information */}
          <div className='space-y-6'>
            <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2'>
              {t('services.airportTransfer.form.passengerInfo')}
            </h3>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {/* Passenger Count */}
              <div>
                <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                  <Users className='w-4 h-4 mr-2 text-blue-700' />
                  {t('services.airportTransfer.form.passengers')}
                </label>
                <div className='flex border border-gray-300 rounded-lg overflow-hidden bg-white'>
                  <button
                    type='button'
                    onClick={() => updatePassengerCount(false)}
                    className='px-4 py-2 bg-gray-100 hover:bg-gray-200 transition'
                  >
                    -
                  </button>
                  <div className='flex-1 py-2 text-center'>
                    {formData.passengerCount}
                  </div>
                  <button
                    type='button'
                    onClick={() => updatePassengerCount(true)}
                    className='px-4 py-2 bg-gray-100 hover:bg-gray-200 transition'
                  >
                    +
                  </button>
                </div>
              </div>

              {/* kids Count */}
              <div>
                <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                  <Users className='w-4 h-4 mr-2 text-blue-700' />
                  {t('services.airportTransfer.form.kids')}
                </label>
                <div className='flex border border-gray-300 rounded-lg overflow-hidden bg-white'>
                  <button
                    type='button'
                    onClick={() => updateKidsCount(false)}
                    className='px-4 py-2 bg-gray-100 hover:bg-gray-200 transition'
                  >
                    -
                  </button>
                  <div className='flex-1 py-2 text-center'>
                    {formData.kidsCount}
                  </div>
                  <button
                    type='button'
                    onClick={() => updateKidsCount(true)}
                    className='px-4 py-2 bg-gray-100 hover:bg-gray-200 transition'
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Car Seat Option */}
              <div>
                <div className='mb-2'>
                  <label className='flex items-center mb-2 text-sm font-medium text-gray-700'>
                    <Baby className='w-4 h-4 mr-2 text-blue-700' />
                    {t('services.airportTransfer.form.carSeat')}
                  </label>

                  <div className='flex items-center bg-gray-50 p-3 border border-gray-300 rounded-lg'>
                    <input
                      type='checkbox'
                      id='needsCarSeat'
                      name='needsCarSeat'
                      checked={formData.needsCarSeat}
                      onChange={handleChange}
                      className='h-4 w-4 text-blue-700 focus:ring-blue-500 border-gray-300 rounded'
                    />
                    <label
                      htmlFor='needsCarSeat'
                      className='ml-2 text-sm text-gray-700'
                    >
                      {t('services.airportTransfer.form.needsCarSeat')}
                    </label>
                  </div>
                </div>

                {formData.needsCarSeat && (
                  <div className='mt-2'>
                    <label className='block text-sm text-gray-600 mb-1'>
                      {t('services.airportTransfer.form.howManyCarSeats')}
                    </label>
                    <div className='flex border border-gray-300 rounded-lg overflow-hidden bg-white'>
                      <button
                        type='button'
                        onClick={() => updateCarSeatCount(false)}
                        className='px-4 py-2 bg-gray-100 hover:bg-gray-200 transition'
                      >
                        -
                      </button>
                      <div className='flex-1 py-2 text-center'>
                        {formData.carSeatCount}
                      </div>
                      <button
                        type='button'
                        onClick={() => updateCarSeatCount(true)}
                        className='px-4 py-2 bg-gray-100 hover:bg-gray-200 transition'
                      >
                        +
                      </button>
                    </div>
                    {formData.carSeatCount > 0 && (
                      <p className='text-xs text-blue-700 mt-1'>
                        +${formData.carSeatCount * 25} (
                        {t('services.airportTransfer.form.perSeat')})
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Luxury Footer with Price and Actions */}
        <div className='bg-gray-900 text-white p-6 flex flex-col md:flex-row items-center justify-between'>
          <div className='flex flex-col items-center md:items-start mb-4 md:mb-0'>
            <span className='text-gray-400 text-sm uppercase tracking-wide'>
              {t('services.airportTransfer.form.totalPrice')}
            </span>
            <div className='flex items-center mt-1'>
              <span className='text-3xl font-light'>
                ${currentPrice.toFixed(2)}
              </span>
              {formData.isRoundTrip && (
                <span className='ml-2 text-sm bg-blue-800 px-2 py-1 rounded'>
                  {t('services.airportTransfer.form.roundTrip')}
                </span>
              )}
            </div>
          </div>

          <div className='flex space-x-4'>
            <button
              type='button'
              onClick={onCancel}
              className='px-5 py-3 border border-gray-700 rounded-lg text-gray-300 hover:text-white hover:border-gray-600 transition'
            >
              {t('common.cancel')}
            </button>

            <button
              type='submit'
              className='px-8 py-3 bg-blue-700 hover:bg-blue-600 text-white rounded-lg transition flex items-center'
            >
              <CreditCard className='h-4 w-4 mr-2' />
              {/* {t('services.airportTransfer.form.bookNow')} */}
              book
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default AirportTransferForm;
