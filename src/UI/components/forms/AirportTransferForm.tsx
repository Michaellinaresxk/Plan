import React, { useState, useEffect, useMemo } from 'react';
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
  Car,
  Clock,
  AlertTriangle,
  Truck,
  Bus,
  MapPin,
} from 'lucide-react';
import { useReservation } from '@/context/BookingContext';
import { useRouter } from 'next/navigation';

// Import the enhanced airline selector and utilities
import AirlineSelector from '@/UI/components/service/AirlineSelector';
import {
  AIRLINE_TERMINAL_MAP,
  getAirlineInfo,
  validateAirlineWithTerminal,
} from '@/constants/airlines';

interface AirportTransferFormProps {
  service: Service;
  onSubmit: (formData: FormData & { totalPrice: number }) => void;
  onCancel: () => void;
}

// Vehicle configuration
const VEHICLE_OPTIONS = {
  suv: {
    name: 'SUV',
    capacity: 6,
    additionalCost: 25,
    description: 'Spacious and comfortable for medium groups',
    icon: <Truck className='w-5 h-5 text-gray-600' />,
  },
  van: {
    name: 'Van',
    capacity: 15,
    additionalCost: 50,
    description: 'Large capacity for big groups, keeps everyone together',
    icon: <Bus className='w-5 h-5 text-gray-600' />,
  },
  two_suvs: {
    name: 'Two SUVs',
    capacity: 12,
    additionalCost: 75,
    description:
      'Two separate SUVs for flexibility and comfort in large groups',
    icon: (
      <div className='flex items-center'>
        <Truck className='w-4 h-4 text-gray-600' />
        <span className='mx-1 text-xs text-gray-500'>+</span>
        <Truck className='w-4 h-4 text-gray-600' />
      </div>
    ),
  },
};

const AirportTransferForm: React.FC<AirportTransferFormProps> = ({
  service,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { setReservationData } = useReservation();

  // Form state with enhanced terminal tracking
  const [formData, setFormData] = useState<FormData>({
    date: '',
    airline: '',
    flightNumber: '',
    arrivalTime: '',
    arrivalTerminal: '',
    isRoundTrip: false,
    returnDate: '',
    returnAirline: '',
    returnFlightNumber: '',
    departureTime: '',
    departureTerminal: '',
    passengerCount: 2,
    kidsCount: 0,
    needsCarSeat: false,
    carSeatCount: 0,
    vehicleType: 'suv',
    location: '',
    pickupName: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Calculate total passengers
  const totalPassengers = useMemo(
    () => formData.passengerCount + formData.kidsCount,
    [formData.passengerCount, formData.kidsCount]
  );

  // Vehicle recommendation logic
  const recommendedVehicle = useMemo(() => {
    if (totalPassengers > 6) {
      return 'van';
    }
    return 'suv';
  }, [totalPassengers]);

  // Update vehicle type when passengers change
  useEffect(() => {
    if (totalPassengers > 6 && formData.vehicleType === 'suv') {
      setFormData((prev) => ({
        ...prev,
        vehicleType: 'van',
      }));
    }
  }, [totalPassengers, formData.vehicleType]);

  // Calculate price
  const calculatePrice = useMemo(() => {
    let basePrice = service.price;

    // Add vehicle cost
    const selectedVehicle = VEHICLE_OPTIONS[formData.vehicleType];
    if (selectedVehicle) {
      basePrice += selectedVehicle.additionalCost;
    }

    // Round trip multiplier
    if (formData.isRoundTrip) {
      basePrice *= 1.8;
    }

    // Car seats
    const CAR_SEAT_PRICE = 25;
    basePrice += formData.carSeatCount * CAR_SEAT_PRICE;

    return basePrice;
  }, [
    formData.vehicleType,
    formData.isRoundTrip,
    formData.carSeatCount,
    service.price,
  ]);

  // Date validation helpers
  const isSameDay = (dateString: string): boolean => {
    if (!dateString) return false;
    const today = new Date();
    const selectedDate = new Date(dateString);
    return today.toDateString() === selectedDate.toDateString();
  };

  const hasMinimum24Hours = (dateString: string): boolean => {
    if (!dateString) return false;
    const now = new Date();
    const selectedDate = new Date(dateString);
    const differenceMs = selectedDate.getTime() - now.getTime();
    const hours = differenceMs / (1000 * 60 * 60);
    return hours >= 24;
  };

  // Enhanced form validation with terminal validation
  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    // Required fields validation
    const requiredFields = [
      { field: 'date', message: 'Date is required' },
      { field: 'airline', message: 'Airline is required' },
      { field: 'flightNumber', message: 'Flight number is required' },
      { field: 'arrivalTime', message: 'Arrival time is required' },
      { field: 'location', message: 'Location is required' },
    ];

    // Round trip validations
    if (formData.isRoundTrip) {
      requiredFields.push(
        { field: 'returnDate', message: 'Return date is required' },
        { field: 'returnAirline', message: 'Return airline is required' },
        {
          field: 'returnFlightNumber',
          message: 'Return flight number is required',
        },
        { field: 'departureTime', message: 'Departure time is required' }
      );
    }

    // Check required fields
    requiredFields.forEach(({ field, message }) => {
      if (!formData[field as keyof FormData]) {
        newErrors[field] = message;
      }
    });

    // Enhanced airline validation with terminal checking
    const airlineValidation = validateAirlineWithTerminal(formData.airline);
    if (airlineValidation) {
      newErrors.airline = airlineValidation;
    }

    if (formData.isRoundTrip) {
      const returnAirlineValidation = validateAirlineWithTerminal(
        formData.returnAirline
      );
      if (returnAirlineValidation) {
        newErrors.returnAirline = returnAirlineValidation;
      }
    }

    // Date validations
    if (
      formData.date &&
      !isSameDay(formData.date) &&
      !hasMinimum24Hours(formData.date)
    ) {
      newErrors.date = 'Bookings must be made at least 24 hours in advance';
    }

    // Return date validation
    if (formData.isRoundTrip && formData.date && formData.returnDate) {
      if (new Date(formData.returnDate) <= new Date(formData.date)) {
        newErrors.returnDate = 'Return date must be after arrival date';
      }
    }

    // Passenger validation
    if (totalPassengers < 1) {
      newErrors.passengerCount = 'At least one passenger is required';
    }

    // Vehicle capacity validation
    const selectedVehicle = VEHICLE_OPTIONS[formData.vehicleType];
    if (selectedVehicle && totalPassengers > selectedVehicle.capacity) {
      newErrors.vehicleType = `Selected vehicle can only accommodate ${selectedVehicle.capacity} passengers`;
    }

    // Car seat validation
    if (formData.needsCarSeat && formData.carSeatCount === 0) {
      newErrors.carSeatCount = 'Please specify number of car seats needed';
    }

    return newErrors;
  };

  // Generate pickup instructions based on terminal information
  const generatePickupInstructions = (data: FormData): string => {
    const arrivalTerminal = getAirlineInfo(data.airline)?.terminal;
    const departureTerminal = data.isRoundTrip
      ? getAirlineInfo(data.returnAirline)?.terminal
      : null;

    let instructions = [];

    if (arrivalTerminal) {
      instructions.push(`Pickup: Terminal ${arrivalTerminal} arrivals area`);
    } else {
      instructions.push(
        'Pickup: Terminal will be confirmed based on flight details'
      );
    }

    if (data.isRoundTrip && departureTerminal) {
      instructions.push(
        `Return: Terminal ${departureTerminal} departures area`
      );
    } else if (data.isRoundTrip) {
      instructions.push(
        'Return: Terminal will be confirmed based on flight details'
      );
    }

    return instructions.join(' | ');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // ✅ CALCULAR EL PRECIO TOTAL ANTES DE CREAR LA RESERVA
      const totalPrice = calculatePrice; // Ya está calculado con useMemo

      // Enhanced reservation data with terminal information AND totalPrice
      const reservationData = {
        service,
        totalPrice, // ✅ AGREGAR ESTA LÍNEA - CRÍTICA PARA QUE NO FALLE
        formData: {
          ...formData,
          serviceType: 'airport-transfers',
          // Add terminal information
          terminalInfo: {
            arrival: {
              airline: formData.airline,
              terminal: getAirlineInfo(formData.airline)?.terminal || 'TBD',
              code: getAirlineInfo(formData.airline)?.code || '',
            },
            departure: formData.isRoundTrip
              ? {
                  airline: formData.returnAirline,
                  terminal:
                    getAirlineInfo(formData.returnAirline)?.terminal || 'TBD',
                  code: getAirlineInfo(formData.returnAirline)?.code || '',
                }
              : null,
          },
          // Enhanced pickup instructions
          specialInstructions: generatePickupInstructions(formData),
        },
        bookingDate: new Date(`${formData.date}T${formData.arrivalTime}`),
        clientInfo: undefined,
      };

      console.log(
        '🛩️ Enhanced Airport transfer - Reservation data:',
        reservationData
      );
      console.log('💰 Total Price included:', totalPrice); // Debug log

      setReservationData(reservationData);
      router.push('/reservation-confirmation');
    } catch (error) {
      console.error('❌ Airport transfer - Error submitting form:', error);
      setErrors({
        submit: t('form.errors.submitError', {
          fallback: 'Failed to submit reservation. Please try again.',
        }),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Enhanced input handler with terminal auto-update
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = 'checked' in e.target ? e.target.checked : false;

    setFormData((prev) => {
      const newData = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      };

      // AUTO-UPDATE TERMINAL INFO WHEN AIRLINE CHANGES
      if (name === 'airline') {
        const terminalInfo = getAirlineInfo(value);
        newData.arrivalTerminal = terminalInfo?.terminal || '';
      }

      if (name === 'returnAirline') {
        const terminalInfo = getAirlineInfo(value);
        newData.departureTerminal = terminalInfo?.terminal || '';
      }

      return newData;
    });

    // Clear car seat count if checkbox is unchecked
    if (name === 'needsCarSeat' && !checked) {
      setFormData((prev) => ({
        ...prev,
        carSeatCount: 0,
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Counter handlers
  const createCounterHandler = (field: keyof FormData, min = 0, max = 20) => ({
    increment: () =>
      setFormData((prev) => ({
        ...prev,
        [field]: Math.min(max, (prev[field] as number) + 1),
      })),
    decrement: () =>
      setFormData((prev) => ({
        ...prev,
        [field]: Math.max(min, (prev[field] as number) - 1),
      })),
  });

  const passengerCounter = createCounterHandler('passengerCount', 1);
  const kidsCounter = createCounterHandler('kidsCount', 0);
  const carSeatCounter = createCounterHandler('carSeatCount', 0);

  // Vehicle selection with recommendations
  const VehicleSelector = () => {
    const getRecommendationMessage = () => {
      if (totalPassengers > 10) {
        return {
          type: 'warning',
          message: `For ${totalPassengers} passengers, we strongly recommend a Van or consider booking two SUVs.`,
          showFor: ['suv', 'sedan'],
        };
      }

      if (totalPassengers > 6) {
        return {
          type: 'info',
          message: `For ${totalPassengers} passengers, we recommend a Van or two SUVs.`,
          showFor: ['suv'],
        };
      }

      return null;
    };

    const canVehicleAccommodate = (vehicleKey: string, vehicle: any) => {
      if (totalPassengers <= vehicle.capacity) return true;

      if (totalPassengers > 6) {
        return vehicleKey === 'van' || vehicleKey === 'two_suvs';
      }

      return false;
    };

    const getRecommendedVehicle = () => {
      if (totalPassengers > 10) return 'van';
      if (totalPassengers > 6) return 'van';
      return recommendedVehicle;
    };

    const recommendation = getRecommendationMessage();
    const currentRecommended = getRecommendedVehicle();

    return (
      <div className='space-y-4'>
        <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
          <Car className='w-4 h-4 mr-2 text-blue-700' />
          Vehicle Type *
        </label>

        {recommendation &&
          recommendation.showFor.includes(formData.vehicleType) && (
            <div
              className={`p-3 border rounded-lg flex items-start ${
                recommendation.type === 'warning'
                  ? 'bg-red-50 border-red-200'
                  : 'bg-yellow-50 border-yellow-200'
              }`}
            >
              <AlertTriangle
                className={`w-4 h-4 mr-2 mt-0.5 ${
                  recommendation.type === 'warning'
                    ? 'text-red-600'
                    : 'text-yellow-600'
                }`}
              />
              <div
                className={`text-sm ${
                  recommendation.type === 'warning'
                    ? 'text-red-800'
                    : 'text-yellow-800'
                }`}
              >
                <strong>
                  {recommendation.type === 'warning'
                    ? 'Important:'
                    : 'Recommendation:'}
                </strong>{' '}
                {recommendation.message}
              </div>
            </div>
          )}

        {totalPassengers > 10 && (
          <div className='p-3 bg-blue-50 border border-blue-200 rounded-lg'>
            <div className='text-sm text-blue-800'>
              <strong>Note:</strong> For groups larger than 10 passengers, you
              can also consider:
              <ul className='mt-1 ml-4 list-disc'>
                <li>Booking two SUVs (more flexibility)</li>
                <li>One Van (cost-effective, keeps group together)</li>
              </ul>
            </div>
          </div>
        )}

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {Object.entries(VEHICLE_OPTIONS).map(([key, vehicle]) => {
            const isSelected = formData.vehicleType === key;
            const isRecommended = key === currentRecommended;
            const canAccommodate = canVehicleAccommodate(key, vehicle);
            const isDisabled = !canAccommodate;

            return (
              <div
                key={key}
                className={`relative p-4 border rounded-lg transition-all ${
                  isDisabled
                    ? 'border-red-300 bg-red-50 cursor-not-allowed opacity-75'
                    : isSelected
                    ? 'border-blue-500 bg-blue-50 cursor-pointer'
                    : 'border-gray-300 hover:border-gray-400 cursor-pointer'
                }`}
                onClick={() => {
                  if (!isDisabled) {
                    setFormData((prev) => ({ ...prev, vehicleType: key }));
                  }
                }}
              >
                {isRecommended && canAccommodate && (
                  <div className='absolute -top-2 left-4 bg-green-500 text-white text-xs px-2 py-1 rounded'>
                    Recommended
                  </div>
                )}

                <div className='flex items-center justify-between mb-2'>
                  <div className='flex items-center'>
                    {vehicle.icon}
                    <span
                      className={`ml-2 font-medium ${
                        isDisabled ? 'text-gray-400' : ''
                      }`}
                    >
                      {vehicle.name}
                    </span>
                  </div>
                  {vehicle.additionalCost > 0 && (
                    <span
                      className={`text-sm ${
                        isDisabled ? 'text-gray-400' : 'text-gray-600'
                      }`}
                    >
                      +${vehicle.additionalCost}
                    </span>
                  )}
                </div>

                <p
                  className={`text-sm mb-2 ${
                    isDisabled ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  {vehicle.description}
                </p>

                <div className='flex items-center justify-between text-sm'>
                  <span
                    className={`${
                      canAccommodate ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    Capacity: {vehicle.capacity} passengers
                  </span>
                  {isSelected && (
                    <CheckCircle className='w-4 h-4 text-blue-500' />
                  )}
                </div>

                {!canAccommodate && (
                  <div className='mt-2'>
                    <p className='text-xs text-red-600'>
                      Insufficient capacity for {totalPassengers} passengers
                    </p>
                    {totalPassengers > 10 && key !== 'van' && (
                      <p className='text-xs text-red-500 font-medium'>
                        Consider Van or multiple vehicles
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {errors.vehicleType && (
          <p className='text-red-500 text-xs'>{errors.vehicleType}</p>
        )}
      </div>
    );
  };

  // Counter component
  const Counter = ({
    label,
    value,
    onIncrement,
    onDecrement,
    icon: Icon,
    min = 0,
  }: {
    label: string;
    value: number;
    onIncrement: () => void;
    onDecrement: () => void;
    icon: React.ElementType;
    min?: number;
  }) => (
    <div>
      <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
        <Icon className='w-4 h-4 mr-2 text-blue-700' />
        {label}
      </label>
      <div className='flex border border-gray-300 rounded-lg overflow-hidden bg-white'>
        <button
          type='button'
          onClick={onDecrement}
          disabled={value <= min}
          className='px-4 py-2 bg-gray-100 hover:bg-gray-200 transition disabled:opacity-50'
        >
          -
        </button>
        <div className='flex-1 py-2 text-center font-medium'>{value}</div>
        <button
          type='button'
          onClick={onIncrement}
          className='px-4 py-2 bg-gray-100 hover:bg-gray-200 transition'
        >
          +
        </button>
      </div>
    </div>
  );

  // Terminal Summary Component
  const TerminalSummary = () => {
    const arrivalInfo = getAirlineInfo(formData.airline);
    const departureInfo = formData.isRoundTrip
      ? getAirlineInfo(formData.returnAirline)
      : null;

    if (!arrivalInfo && !departureInfo) return null;

    return (
      <div className='mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg'>
        <h4 className='font-medium text-blue-900 mb-3 flex items-center'>
          <Info className='w-4 h-4 mr-2' />
          Terminal Information Summary
        </h4>

        {arrivalInfo && (
          <div className='mb-2'>
            <span className='text-sm text-blue-800'>
              <strong>Arrival:</strong> {formData.airline} → Terminal{' '}
              {arrivalInfo.terminal}
            </span>
          </div>
        )}

        {departureInfo && (
          <div>
            <span className='text-sm text-blue-800'>
              <strong>Departure:</strong> {formData.returnAirline} → Terminal{' '}
              {departureInfo.terminal}
            </span>
          </div>
        )}

        <p className='text-xs text-blue-700 mt-2'>
          Your driver will receive this terminal information to ensure smooth
          pickup and drop-off.
        </p>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className='w-full mx-auto overflow-hidden'>
      <div className='bg-white rounded-xl shadow-lg border border-gray-100'>
        {/* Header */}
        <div className='bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 p-6 text-white'>
          <h2 className='text-2xl font-light tracking-wide'>
            Premium Airport Transfer Booking
          </h2>
          <p className='text-blue-100 mt-1 font-light'>
            Professional transfer service to/from Punta Cana International
            Airport
          </p>
        </div>

        {/* Form Body */}
        <div className='p-8 space-y-8'>
          {/* Flight Details Section */}
          <div className='space-y-6'>
            <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2'>
              Flight Information
            </h3>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {/* Date */}
              <div>
                <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                  <Calendar className='w-4 h-4 mr-2 text-blue-700' />
                  Arrival Date *
                </label>
                <input
                  type='date'
                  name='date'
                  value={formData.date}
                  onChange={handleInputChange}
                  className={`w-full p-3 border ${
                    errors.date ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-50`}
                  min={new Date().toISOString().split('T')[0]}
                />
                {errors.date && (
                  <p className='text-red-500 text-xs mt-1'>{errors.date}</p>
                )}
              </div>

              {/* Enhanced Airline Selector */}
              <AirlineSelector
                name='airline'
                value={formData.airline}
                onChange={handleInputChange}
                error={errors.airline}
                label='Arrival Airline *'
                placeholder='Search for your airline...'
              />

              {/* Flight Number */}
              <div>
                <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                  <Plane className='w-4 h-4 mr-2 text-blue-700' />
                  Flight Number *
                </label>
                <input
                  type='text'
                  name='flightNumber'
                  value={formData.flightNumber}
                  onChange={handleInputChange}
                  placeholder='AA1234'
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

              {/* Arrival Time */}
              <div>
                <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                  <Clock className='w-4 h-4 mr-2 text-blue-700' />
                  Arrival Time *
                </label>
                <input
                  type='time'
                  name='arrivalTime'
                  value={formData.arrivalTime}
                  onChange={handleInputChange}
                  className={`w-full p-3 border ${
                    errors.arrivalTime ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-50`}
                />
                {errors.arrivalTime && (
                  <p className='text-red-500 text-xs mt-1'>
                    {errors.arrivalTime}
                  </p>
                )}
              </div>
            </div>

            {/* Booking timing warnings */}
            {formData.date && (
              <div className='mt-4'>
                {isSameDay(formData.date) ? (
                  <div className='p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start'>
                    <Info className='w-4 h-4 text-amber-600 mr-2 mt-0.5' />
                    <div className='text-sm text-amber-800'>
                      <strong>Same-day booking:</strong> Requires immediate
                      confirmation from our team.
                    </div>
                  </div>
                ) : !hasMinimum24Hours(formData.date) ? (
                  <div className='p-3 bg-red-50 border border-red-200 rounded-lg flex items-start'>
                    <AlertTriangle className='w-4 h-4 text-red-600 mr-2 mt-0.5' />
                    <div className='text-sm text-red-800'>
                      <strong>Advance booking required:</strong> Please book at
                      least 24 hours in advance.
                    </div>
                  </div>
                ) : null}
              </div>
            )}

            {/* Round Trip Toggle */}
            <div className='mt-6'>
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
                    Round Trip Service
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
                        Departure Date *
                      </label>
                      <input
                        type='date'
                        name='returnDate'
                        value={formData.returnDate}
                        onChange={handleInputChange}
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

                    {/* Enhanced Return Airline Selector */}
                    <AirlineSelector
                      name='returnAirline'
                      value={formData.returnAirline}
                      onChange={handleInputChange}
                      error={errors.returnAirline}
                      label='Departure Airline *'
                      placeholder='Search for your return airline...'
                    />

                    {/* Return Flight Number */}
                    <div>
                      <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                        <Plane className='w-4 h-4 mr-2 text-blue-700' />
                        Departure Flight Number *
                      </label>
                      <input
                        type='text'
                        name='returnFlightNumber'
                        value={formData.returnFlightNumber}
                        onChange={handleInputChange}
                        placeholder='AA4321'
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

                    {/* Departure Time */}
                    <div>
                      <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                        <Clock className='w-4 h-4 mr-2 text-blue-700' />
                        Departure Time *
                      </label>
                      <input
                        type='time'
                        name='departureTime'
                        value={formData.departureTime}
                        onChange={handleInputChange}
                        className={`w-full p-3 border ${
                          errors.departureTime
                            ? 'border-red-500'
                            : 'border-gray-300'
                        } rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-50`}
                      />
                      {errors.departureTime && (
                        <p className='text-red-500 text-xs mt-1'>
                          {errors.departureTime}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Terminal Summary */}
          {(formData.airline ||
            (formData.isRoundTrip && formData.returnAirline)) && (
            <TerminalSummary />
          )}

          {/* Passenger Information */}
          <div className='space-y-6'>
            <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2'>
              Passenger Information
            </h3>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <Counter
                label='Adults'
                value={formData.passengerCount}
                onIncrement={passengerCounter.increment}
                onDecrement={passengerCounter.decrement}
                icon={Users}
                min={1}
              />

              <Counter
                label='Children'
                value={formData.kidsCount}
                onIncrement={kidsCounter.increment}
                onDecrement={kidsCounter.decrement}
                icon={Baby}
              />
            </div>

            {/* Total passengers display */}
            <div className='p-3 bg-blue-50 border border-blue-200 rounded-lg'>
              <p className='text-sm text-blue-800'>
                <strong>Total passengers:</strong> {totalPassengers}
              </p>
            </div>

            {/* Car Seat Section */}
            <div>
              <div className='mb-4'>
                <label className='flex items-center mb-2 text-sm font-medium text-gray-700'>
                  <Baby className='w-4 h-4 mr-2 text-blue-700' />
                  Child Safety Seats
                </label>

                <div className='flex items-center bg-gray-50 p-3 border border-gray-300 rounded-lg'>
                  <input
                    type='checkbox'
                    id='needsCarSeat'
                    name='needsCarSeat'
                    checked={formData.needsCarSeat}
                    onChange={handleInputChange}
                    className='h-4 w-4 text-blue-700 focus:ring-blue-500 border-gray-300 rounded'
                  />
                  <label
                    htmlFor='needsCarSeat'
                    className='ml-2 text-sm text-gray-700'
                  >
                    I need child safety seats
                  </label>
                </div>
              </div>

              {formData.needsCarSeat && (
                <Counter
                  label='Number of car seats needed'
                  value={formData.carSeatCount}
                  onIncrement={carSeatCounter.increment}
                  onDecrement={carSeatCounter.decrement}
                  icon={Baby}
                />
              )}

              {errors.carSeatCount && (
                <p className='text-red-500 text-xs mt-1'>
                  {errors.carSeatCount}
                </p>
              )}
            </div>
          </div>

          {/* Vehicle Selection */}
          <div className='space-y-6'>
            <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2'>
              Vehicle Selection
            </h3>
            <VehicleSelector />
          </div>

          {/* Location */}
          <div>
            <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
              <MapPin className='w-4 h-4 mr-2 text-blue-700' />
              Location *
            </label>
            <input
              type='text'
              name='location'
              value={formData.location}
              onChange={handleInputChange}
              className={`w-full p-3 border ${
                errors.location ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-50`}
              placeholder='Please provide the complete address where the transportation will drop you off.'
            />
            {errors.location && (
              <p className='text-red-500 text-xs mt-1'>{errors.location}</p>
            )}
          </div>

          {/* Pickup name / alias */}
          <div>
            <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
              <Plane className='w-4 h-4 mr-2 text-blue-700' />
              Pickup Name / Alias (optional)
            </label>
            <input
              type='text'
              name='pickupName'
              value={formData.pickupName || ''}
              onChange={handleInputChange}
              placeholder='Pickup Name'
              className={`w-full p-3 border ${
                errors.pickupName ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-50`}
            />
            {errors.pickupName && (
              <p className='text-red-500 text-xs mt-1'>{errors.pickupName}</p>
            )}
          </div>
        </div>

        {/* Footer with Price and Actions */}
        <div className='bg-gray-900 text-white p-6 flex flex-col md:flex-row items-center justify-between'>
          <div className='flex flex-col items-center md:items-start mb-4 md:mb-0'>
            <span className='text-gray-400 text-sm uppercase tracking-wide'>
              Total Price
            </span>
            <div className='flex items-center mt-1'>
              <span className='text-3xl font-light'>
                ${calculatePrice.toFixed(2)}
              </span>
              {formData.isRoundTrip && (
                <span className='ml-2 text-sm bg-blue-800 px-2 py-1 rounded'>
                  Round Trip
                </span>
              )}
            </div>

            {/* Price breakdown */}
            <div className='text-xs text-gray-400 mt-2 space-y-1'>
              <div>Base: ${service.price}</div>
              {VEHICLE_OPTIONS[formData.vehicleType]?.additionalCost > 0 && (
                <div>
                  Vehicle upgrade: +$
                  {VEHICLE_OPTIONS[formData.vehicleType].additionalCost}
                </div>
              )}
              {formData.isRoundTrip && <div>Round trip: x1.8</div>}
              {formData.carSeatCount > 0 && (
                <div>Car seats: +${formData.carSeatCount * 25}</div>
              )}
            </div>
          </div>

          <div className='flex space-x-4'>
            <button
              type='button'
              onClick={onCancel}
              disabled={isSubmitting}
              className='px-5 py-3 border border-gray-700 rounded-lg text-gray-300 hover:text-white hover:border-gray-600 transition disabled:opacity-50'
            >
              Cancel
            </button>

            <button
              type='submit'
              disabled={isSubmitting}
              className='px-8 py-3 bg-blue-700 hover:bg-blue-600 text-white rounded-lg transition flex items-center disabled:opacity-50'
            >
              <CreditCard className='h-4 w-4 mr-2' />
              {isSubmitting ? 'Processing...' : 'Book Transfer'}
            </button>
          </div>
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div className='p-4 bg-red-50 border border-red-200 rounded-lg mt-4'>
            <div className='flex items-start'>
              <AlertTriangle className='w-4 h-4 text-red-600 mr-2 mt-0.5' />
              <div className='text-sm text-red-800'>
                <strong>Error:</strong> {errors.submit}
              </div>
            </div>
          </div>
        )}
      </div>
    </form>
  );
};

export default AirportTransferForm;
