import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { Service } from '@/types/type';
import {
  MapPin,
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
  Navigation,
  Route,
  ArrowRight,
  Repeat,
} from 'lucide-react';
import { useReservation } from '@/context/BookingContext';
import { useRouter } from 'next/navigation';
import FormHeader from '@/UI/components/forms/FormHeader';
import { useFormModal } from '@/hooks/useFormModal';
import { LOCATION_OPTIONS } from '@/constants/location/location';

// Vehicle configuration
const POINT_TO_POINT_VEHICLES = {
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

// Destination zones with pricing
const DESTINATION_ZONES = [
  {
    id: 'punta-cana-center',
    name: 'Punta Cana Center',
    description: 'Main tourist area with hotels and resorts',
    landmarks: ['Hard Rock Hotel', 'Bavaro Beach', 'Downtown Punta Cana'],
    basePrice: 30,
    estimatedTime: '15-20 min',
    isPopular: true,
  },
  {
    id: 'bavaro',
    name: 'Bavaro',
    description: 'Beach area with luxury resorts',
    landmarks: ['Bavaro Beach', 'Iberostar', 'Natura Park'],
    basePrice: 35,
    estimatedTime: '20-25 min',
    isPopular: true,
  },
  {
    id: 'cap-cana',
    name: 'Cap Cana',
    description: 'Exclusive luxury resort area',
    landmarks: ['Marina Cap Cana', 'Eden Roc', 'Fishing Lodge'],
    basePrice: 40,
    estimatedTime: '25-30 min',
    isPopular: true,
  },
  {
    id: 'uvero-alto',
    name: 'Uvero Alto',
    description: 'Northern coast resort area',
    landmarks: ['Secrets Royal Beach', 'Excellence Punta Cana'],
    basePrice: 60,
    estimatedTime: '35-45 min',
    isPopular: false,
  },
  {
    id: 'la-romana',
    name: 'La Romana',
    description: 'Historic town with cultural attractions',
    landmarks: ['Casa de Campo', 'Altos de Chavón'],
    basePrice: 90,
    estimatedTime: '1.5-2 hours',
    isPopular: true,
  },
  {
    id: 'bayahibe',
    name: 'Bayahíbe',
    description: 'Port for Saona Island excursions',
    landmarks: ['Bayahíbe Beach', 'Saona Ferry Terminal'],
    basePrice: 100,
    estimatedTime: '1.5-2 hours',
    isPopular: true,
  },
  {
    id: 'santo-domingo',
    name: 'Santo Domingo',
    description: 'Capital city - premium service',
    landmarks: ['Colonial Zone', 'Malecón', 'Airport'],
    basePrice: 150,
    estimatedTime: '2.5-3 hours',
    isPopular: false,
  },
];

// Types
interface PointToPointFormData {
  pickupDate: string;
  pickupTime: string;
  pickupLocationArea: string;
  destinationZone: string;
  isRoundTrip: boolean;
  returnDate: string;
  returnTime: string;
  passengerCount: number;
  kidsCount: number;
  kidsAges: number[];
  needsCarSeat: boolean;
  carSeatCount: number;
  vehicleType: string;
  specialRequests: string;
}

interface FormErrors {
  [key: string]: string;
}

interface PointToPointTransferFormProps {
  service: Service;
  onSubmit: (formData: PointToPointFormData & { totalPrice: number }) => void;
  onCancel: () => void;
}

// Destination Zone Selector Component
const DestinationZoneSelector: React.FC<{
  selectedDestination: string;
  onDestinationSelect: (zoneId: string) => void;
  error?: string;
}> = ({ selectedDestination, onDestinationSelect, error }) => {
  return (
    <div className='bg-blue-50 p-6 rounded-xl border border-blue-100 shadow-sm'>
      <label className='flex items-center text-sm font-medium text-blue-800 mb-4'>
        <Navigation className='w-5 h-5 mr-2 text-blue-600' />
        Select destination zone *
      </label>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {DESTINATION_ZONES.map((zone) => (
          <div
            key={zone.id}
            className={`
              border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md
              ${
                selectedDestination === zone.id
                  ? 'border-blue-500 bg-white shadow-lg ring-2 ring-blue-200'
                  : 'border-blue-200 bg-white hover:border-blue-300 hover:bg-blue-25'
              }
            `}
            onClick={() => onDestinationSelect(zone.id)}
          >
            <div className='flex items-start justify-between mb-3'>
              <div className='flex items-start'>
                <div
                  className={`
                    w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 mt-0.5 transition-all
                    ${
                      selectedDestination === zone.id
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-blue-300'
                    }
                  `}
                >
                  {selectedDestination === zone.id && (
                    <CheckCircle className='w-4 h-4 text-white' />
                  )}
                </div>
                <div className='flex-1'>
                  <div className='flex items-center mb-1'>
                    <MapPin className='w-4 h-4 mr-2 text-blue-500' />
                    <span className='font-medium text-blue-900 text-sm'>
                      {zone.name}
                    </span>
                  </div>
                  {zone.isPopular && (
                    <span className='inline-block mb-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full'>
                      Popular
                    </span>
                  )}
                  <p className='text-xs text-gray-600 mb-2'>
                    {zone.description}
                  </p>
                </div>
              </div>

              <div className='text-right'>
                <div className='text-sm font-semibold text-green-600'>
                  ${zone.basePrice}
                </div>
                <div className='text-xs text-gray-500 flex items-center'>
                  <Clock className='w-3 h-3 mr-1' />
                  {zone.estimatedTime}
                </div>
              </div>
            </div>

            <div className='text-xs text-gray-500 border-t border-gray-100 pt-2'>
              <span className='font-medium'>Landmarks: </span>
              {zone.landmarks.slice(0, 2).join(', ')}
              {zone.landmarks.length > 2 && '...'}
            </div>
          </div>
        ))}
      </div>

      {error && (
        <p className='text-red-500 text-xs mt-3 flex items-center'>
          <AlertTriangle className='w-3 h-3 mr-1' />
          {error}
        </p>
      )}
    </div>
  );
};

// Custom Hooks
const useFormValidation = () => {
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

  return { isSameDay, hasMinimum24Hours };
};

const usePriceCalculation = (
  formData: PointToPointFormData,
  servicePrice: number
) => {
  return useMemo(() => {
    let basePrice = servicePrice;

    // Add destination zone price
    const selectedDestinationZone = DESTINATION_ZONES.find(
      (z) => z.id === formData.destinationZone
    );
    if (selectedDestinationZone) {
      basePrice += selectedDestinationZone.basePrice;
    }

    // Add vehicle cost
    const selectedVehicle = POINT_TO_POINT_VEHICLES[formData.vehicleType];
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
    formData.destinationZone,
    formData.vehicleType,
    formData.isRoundTrip,
    formData.carSeatCount,
    servicePrice,
  ]);
};

// Counter Component
const Counter: React.FC<{
  label: string;
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  icon: React.ElementType;
  min?: number;
}> = ({ label, value, onIncrement, onDecrement, icon: Icon, min = 0 }) => (
  <div>
    <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
      <Icon className='w-4 h-4 mr-2 text-emerald-700' />
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

// Main Component
const PointToPointTransferForm: React.FC<PointToPointTransferFormProps> = ({
  service,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { setReservationData } = useReservation();
  const { isSameDay, hasMinimum24Hours } = useFormValidation();
  const { handleClose, registerEscapeListener } = useFormModal({ onCancel });

  // Register escape key listener
  useEffect(() => {
    const cleanup = registerEscapeListener();
    return cleanup;
  }, [registerEscapeListener]);

  // Form state
  const [formData, setFormData] = useState<PointToPointFormData>({
    pickupDate: '',
    pickupTime: '',
    pickupLocationArea: '',
    destinationZone: '',
    isRoundTrip: false,
    returnDate: '',
    returnTime: '',
    passengerCount: 2,
    kidsCount: 0,
    kidsAges: [],
    needsCarSeat: false,
    carSeatCount: 0,
    vehicleType: 'suv',
    specialRequests: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Helper to update form fields
  const updateFormField = useCallback((field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when field is updated
    setErrors((prev) => {
      if (prev[field]) {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      }
      return prev;
    });
  }, []);

  // Handle location area selection
  const handlePickupLocationAreaSelect = useCallback(
    (locationAreaId: string) => {
      updateFormField('pickupLocationArea', locationAreaId);
    },
    [updateFormField]
  );

  const handleDestinationZoneSelect = useCallback(
    (zoneId: string) => {
      updateFormField('destinationZone', zoneId);
    },
    [updateFormField]
  );

  // Calculate total passengers
  const totalPassengers = useMemo(
    () => formData.passengerCount + formData.kidsCount,
    [formData.passengerCount, formData.kidsCount]
  );

  // Calculate price using custom hook
  const calculatePrice = usePriceCalculation(formData, service.price);

  // Auto-adjust vehicle type when passengers change
  useEffect(() => {
    if (totalPassengers <= 6 && formData.vehicleType === 'van') {
      setFormData((prev) => ({ ...prev, vehicleType: 'suv' }));
    }
  }, [totalPassengers, formData.vehicleType]);

  // Validation
  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    // Required fields validation
    const requiredFields = [
      { field: 'pickupDate', message: 'Pickup date is required' },
      { field: 'pickupTime', message: 'Pickup time is required' },
      { field: 'pickupLocationArea', message: 'Please select pickup area' },
      { field: 'destinationZone', message: 'Please select destination zone' },
    ];

    // Round trip validations
    if (formData.isRoundTrip) {
      requiredFields.push(
        { field: 'returnDate', message: 'Return date is required' },
        { field: 'returnTime', message: 'Return time is required' }
      );
    }

    // Check required fields
    requiredFields.forEach(({ field, message }) => {
      if (!formData[field as keyof PointToPointFormData]) {
        newErrors[field] = message;
      }
    });

    // Date validations
    if (
      formData.pickupDate &&
      !isSameDay(formData.pickupDate) &&
      !hasMinimum24Hours(formData.pickupDate)
    ) {
      newErrors.pickupDate =
        'Bookings must be made at least 24 hours in advance';
    }

    // Return date validation
    if (formData.isRoundTrip && formData.pickupDate && formData.returnDate) {
      if (new Date(formData.returnDate) < new Date(formData.pickupDate)) {
        newErrors.returnDate = 'Return date must be after pickup date';
      }
    }

    // Passenger validation
    if (totalPassengers < 1) {
      newErrors.passengerCount = 'At least one passenger is required';
    }

    // Vehicle capacity validation
    const selectedVehicle = POINT_TO_POINT_VEHICLES[formData.vehicleType];
    if (selectedVehicle && totalPassengers > selectedVehicle.capacity) {
      newErrors.vehicleType = `Selected vehicle can only accommodate ${selectedVehicle.capacity} passengers`;
    }

    // Car seat validation
    if (formData.needsCarSeat && formData.carSeatCount === 0) {
      newErrors.carSeatCount = 'Please specify number of car seats needed';
    }

    return newErrors;
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const totalPrice = calculatePrice;

      // Get selected areas for display names
      const selectedPickupArea = LOCATION_OPTIONS.find(
        (loc) => loc.id === formData.pickupLocationArea
      );
      const selectedDestinationZone = DESTINATION_ZONES.find(
        (zone) => zone.id === formData.destinationZone
      );

      const reservationData = {
        service,
        totalPrice,
        formData: {
          ...formData,
          serviceType: 'point-to-point-transfer',
          pickupLocationAreaName:
            selectedPickupArea?.name || formData.pickupLocationArea,
          destinationZoneName:
            selectedDestinationZone?.name || formData.destinationZone,
        },
        bookingDate: new Date(`${formData.pickupDate}T${formData.pickupTime}`),
        clientInfo: undefined,
        pointToPointSpecifics: {
          pickupLocationArea: formData.pickupLocationArea,
          destinationZone: formData.destinationZone,
          pickupLocationAreaName:
            selectedPickupArea?.name || formData.pickupLocationArea,
          destinationZoneName:
            selectedDestinationZone?.name || formData.destinationZone,
          vehicleType: formData.vehicleType,
          totalPassengers,
          carSeats: formData.carSeatCount,
          isRoundTrip: formData.isRoundTrip,
          destinationPricing: selectedDestinationZone?.basePrice || 0,
        },
      };

      console.log(
        '🚗 Point-to-Point transfer - Reservation data:',
        reservationData
      );
      console.log('📍 Pickup area:', selectedPickupArea);
      console.log('🎯 Destination zone:', selectedDestinationZone);
      console.log('💰 Total Price:', totalPrice);

      setReservationData(reservationData);
      router.push('/reservation-confirmation');
    } catch (error) {
      console.error(
        '❌ Point-to-Point transfer - Error submitting form:',
        error
      );
      setErrors({
        submit: 'Failed to submit reservation. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Input change handler
  const handleInputChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value, type } = e.target;
      const checked = 'checked' in e.target ? e.target.checked : false;

      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));

      // Clear car seat count if checkbox is unchecked
      if (name === 'needsCarSeat' && !checked) {
        setFormData((prev) => ({ ...prev, carSeatCount: 0 }));
      }

      // Clear error when user starts typing
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: '' }));
      }
    },
    [errors]
  );

  // Counter handlers
  const createCounterHandler = (
    field: keyof PointToPointFormData,
    min = 0,
    max = 20
  ) => ({
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

  return (
    <form onSubmit={handleSubmit} className='w-full mx-auto overflow-hidden'>
      <div className='bg-white rounded-xl shadow-lg border border-gray-100'>
        {/* Header */}
        <FormHeader
          title='Point-to-Point Transfer'
          subtitle='Professional transportation between any two locations'
          icon={Car}
          onCancel={handleClose}
          showCloseButton={true}
          gradientFrom='emerald-500'
          gradientVia='emerald-700'
          gradientTo='emerald-800'
        />

        {/* Form Body */}
        <div className='p-8 space-y-8'>
          {/* Location Selection Section */}
          <div className='space-y-6'>
            <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2'>
              Route Information
            </h3>

            {/* Pickup Location Area Selector - Tu componente existente */}
            <div className='bg-emerald-50 p-6 rounded-xl border border-emerald-100 shadow-sm'>
              <label className='flex items-center text-sm font-medium text-emerald-800 mb-4'>
                <MapPin className='w-5 h-5 mr-2 text-emerald-600' />
                Select pickup area *
              </label>

              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {LOCATION_OPTIONS.map((locationOption) => (
                  <div
                    key={locationOption.id}
                    className={`
                      border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md
                      ${
                        formData.pickupLocationArea === locationOption.id
                          ? 'border-emerald-500 bg-white shadow-lg ring-2 ring-emerald-200'
                          : 'border-emerald-200 bg-white hover:border-emerald-300 hover:bg-emerald-25'
                      }
                    `}
                    onClick={() =>
                      handlePickupLocationAreaSelect(locationOption.id)
                    }
                  >
                    <div className='flex items-center'>
                      <div
                        className={`
                          w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 transition-all
                          ${
                            formData.pickupLocationArea === locationOption.id
                              ? 'border-emerald-500 bg-emerald-500'
                              : 'border-emerald-300'
                          }
                        `}
                      >
                        {formData.pickupLocationArea === locationOption.id && (
                          <CheckCircle className='w-4 h-4 text-white' />
                        )}
                      </div>
                      <div className='flex items-center'>
                        <MapPin className='w-4 h-4 mr-2 text-emerald-500' />
                        <span className='font-medium text-emerald-900 text-sm'>
                          {locationOption.name}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {errors.pickupLocationArea && (
                <p className='text-red-500 text-xs mt-3 flex items-center'>
                  <AlertTriangle className='w-3 h-3 mr-1' />
                  {errors.pickupLocationArea}
                </p>
              )}
            </div>

            {/* Destination Zone Selector - Nuevo componente */}
            <DestinationZoneSelector
              selectedDestination={formData.destinationZone}
              onDestinationSelect={handleDestinationZoneSelect}
              error={errors.destinationZone}
            />

            {/* Route Preview Simple */}
            {formData.pickupLocationArea && formData.destinationZone && (
              <div className='bg-gradient-to-r from-emerald-50 to-blue-50 border border-gray-200 rounded-xl p-6'>
                <div className='flex items-center mb-4'>
                  <Route className='w-5 h-5 text-gray-700 mr-2' />
                  <h3 className='font-semibold text-gray-900'>Route Preview</h3>
                </div>

                <div className='space-y-4'>
                  {/* Route */}
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center'>
                      <div className='w-3 h-3 bg-emerald-600 rounded-full'></div>
                      <span className='ml-3 font-medium text-gray-900'>
                        {LOCATION_OPTIONS.find(
                          (loc) => loc.id === formData.pickupLocationArea
                        )?.name || 'Pickup Area'}
                      </span>
                    </div>
                    <ArrowRight className='w-4 h-4 text-gray-500 mx-2' />
                    <div className='flex items-center'>
                      <div className='w-3 h-3 bg-blue-600 rounded-full'></div>
                      <span className='ml-3 font-medium text-gray-900'>
                        {DESTINATION_ZONES.find(
                          (zone) => zone.id === formData.destinationZone
                        )?.name || 'Destination Zone'}
                      </span>
                    </div>
                  </div>

                  {/* Price and Trip Info */}
                  <div className='grid grid-cols-2 gap-4 pt-2 border-t border-gray-200'>
                    <div className='text-center'>
                      <div className='text-sm text-gray-600'>
                        Estimated Price
                      </div>
                      <div className='font-semibold text-green-600'>
                        ${calculatePrice}
                      </div>
                    </div>
                    <div className='text-center'>
                      <div className='text-sm text-gray-600'>Vehicle</div>
                      <div className='font-semibold text-gray-900'>
                        {POINT_TO_POINT_VEHICLES[formData.vehicleType]?.name}
                      </div>
                    </div>
                  </div>

                  {/* Round Trip Indicator */}
                  {formData.isRoundTrip && (
                    <div className='flex items-center text-sm text-emerald-700 mt-3'>
                      <Repeat className='w-4 h-4 mr-2' />
                      Round trip service included
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Date & Time Section */}
          <div className='space-y-6'>
            <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2'>
              Schedule Information
            </h3>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {/* Pickup Date */}
              <div>
                <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                  <Calendar className='w-4 h-4 mr-2 text-emerald-700' />
                  Pickup Date *
                </label>
                <input
                  type='date'
                  name='pickupDate'
                  value={formData.pickupDate}
                  onChange={handleInputChange}
                  className={`w-full p-3 border ${
                    errors.pickupDate ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50`}
                  min={new Date().toISOString().split('T')[0]}
                />
                {errors.pickupDate && (
                  <p className='text-red-500 text-xs mt-1'>
                    {errors.pickupDate}
                  </p>
                )}
              </div>

              {/* Pickup Time */}
              <div>
                <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                  <Clock className='w-4 h-4 mr-2 text-emerald-700' />
                  Pickup Time *
                </label>
                <input
                  type='time'
                  name='pickupTime'
                  value={formData.pickupTime}
                  onChange={handleInputChange}
                  className={`w-full p-3 border ${
                    errors.pickupTime ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50`}
                />
                {errors.pickupTime && (
                  <p className='text-red-500 text-xs mt-1'>
                    {errors.pickupTime}
                  </p>
                )}
              </div>
            </div>

            {/* Booking timing warnings */}
            {formData.pickupDate && (
              <div className='mt-4'>
                {isSameDay(formData.pickupDate) ? (
                  <div className='p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start'>
                    <Info className='w-4 h-4 text-amber-600 mr-2 mt-0.5' />
                    <div className='text-sm text-amber-800'>
                      <strong>Same-day booking:</strong> Requires immediate
                      confirmation from our team.
                    </div>
                  </div>
                ) : !hasMinimum24Hours(formData.pickupDate) ? (
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
                        ? 'border-emerald-700 bg-emerald-700'
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
                <span className='text-emerald-700'>
                  {formData.isRoundTrip ? (
                    <ChevronUp className='w-5 h-5' />
                  ) : (
                    <ChevronDown className='w-5 h-5' />
                  )}
                </span>
              </div>

              {/* Return Trip Details */}
              {formData.isRoundTrip && (
                <div className='mt-4 pl-6 border-l-2 border-emerald-200 space-y-6'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    {/* Return Date */}
                    <div>
                      <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                        <Calendar className='w-4 h-4 mr-2 text-emerald-700' />
                        Return Date *
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
                        } rounded-lg focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50`}
                        min={
                          formData.pickupDate ||
                          new Date().toISOString().split('T')[0]
                        }
                      />
                      {errors.returnDate && (
                        <p className='text-red-500 text-xs mt-1'>
                          {errors.returnDate}
                        </p>
                      )}
                    </div>

                    {/* Return Time */}
                    <div>
                      <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                        <Clock className='w-4 h-4 mr-2 text-emerald-700' />
                        Return Time *
                      </label>
                      <input
                        type='time'
                        name='returnTime'
                        value={formData.returnTime}
                        onChange={handleInputChange}
                        className={`w-full p-3 border ${
                          errors.returnTime
                            ? 'border-red-500'
                            : 'border-gray-300'
                        } rounded-lg focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50`}
                      />
                      {errors.returnTime && (
                        <p className='text-red-500 text-xs mt-1'>
                          {errors.returnTime}
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
            <div className='p-3 bg-emerald-50 border border-emerald-200 rounded-lg'>
              <p className='text-sm text-emerald-800'>
                <strong>Total passengers:</strong> {totalPassengers}
              </p>
            </div>

            {/* Vehicle Type Selection */}
            <div>
              <label className='flex items-center text-sm font-medium text-gray-700 mb-3'>
                <Car className='w-4 h-4 mr-2 text-emerald-700' />
                Vehicle Type
              </label>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                {Object.entries(POINT_TO_POINT_VEHICLES).map(
                  ([key, vehicle]) => (
                    <div
                      key={key}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        formData.vehicleType === key
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-200 hover:border-emerald-300'
                      }`}
                      onClick={() => updateFormField('vehicleType', key)}
                    >
                      <div className='flex items-center justify-between mb-2'>
                        <div className='flex items-center'>
                          {vehicle.icon}
                          <span className='font-medium ml-2'>
                            {vehicle.name}
                          </span>
                        </div>
                        <span className='text-sm text-gray-600'>
                          +${vehicle.additionalCost}
                        </span>
                      </div>
                      <p className='text-sm text-gray-600 mb-2'>
                        {vehicle.description}
                      </p>
                      <div className='text-xs text-gray-500'>
                        <span>Up to {vehicle.capacity} passengers</span>
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* Show info for large groups */}
              {totalPassengers > 10 && (
                <div className='p-3 bg-amber-50 border border-amber-200 rounded-lg mt-4 flex items-start'>
                  <Info className='w-4 h-4 text-amber-600 mr-2 mt-0.5' />
                  <div className='text-sm text-amber-800'>
                    <strong>Large group options:</strong> For {totalPassengers}{' '}
                    passengers, choose between one Van (everyone together) or
                    two SUVs (more flexibility).
                  </div>
                </div>
              )}

              {errors.vehicleType && (
                <p className='text-red-500 text-xs mt-2'>
                  {errors.vehicleType}
                </p>
              )}
            </div>

            {/* Car Seat Section */}
            <div>
              <div className='mb-4'>
                <label className='flex items-center mb-2 text-sm font-medium text-gray-700'>
                  <Baby className='w-4 h-4 mr-2 text-emerald-700' />
                  Child Safety Seats
                </label>

                <div className='flex items-center bg-gray-50 p-3 border border-gray-300 rounded-lg'>
                  <input
                    type='checkbox'
                    id='needsCarSeat'
                    name='needsCarSeat'
                    checked={formData.needsCarSeat}
                    onChange={handleInputChange}
                    className='h-4 w-4 text-emerald-700 focus:ring-emerald-500 border-gray-300 rounded'
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

          {/* Additional Information */}
          <div className='space-y-6'>
            <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2'>
              Additional Information
            </h3>

            {/* Special Requests */}
            <div>
              <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                <Info className='w-4 h-4 mr-2 text-emerald-700' />
                Special Requests (optional)
              </label>
              <textarea
                name='specialRequests'
                value={formData.specialRequests}
                onChange={handleInputChange}
                rows={3}
                className='w-full p-3 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50 resize-none'
                placeholder='Any special requirements, accessibility needs, or additional stops...'
              />
            </div>
          </div>
        </div>

        {/* Footer with Actions */}
        <div className='rounded-2xl bg-gray-900 text-white p-6 flex justify-between items-center'>
          <div className='text-xl font-bold'>
            Total: <span className='text-emerald-400'>${calculatePrice}</span>
            {formData.pickupLocationArea && formData.destinationZone && (
              <div className='text-sm text-gray-400 mt-1'>
                {
                  LOCATION_OPTIONS.find(
                    (loc) => loc.id === formData.pickupLocationArea
                  )?.name
                }{' '}
                →{' '}
                {
                  DESTINATION_ZONES.find(
                    (zone) => zone.id === formData.destinationZone
                  )?.name
                }
              </div>
            )}
          </div>
          <div className='flex space-x-4'>
            <button
              type='button'
              onClick={handleClose}
              disabled={isSubmitting}
              className='px-5 py-3 border border-gray-700 rounded-lg text-gray-300 hover:text-white hover:border-gray-600 transition disabled:opacity-50'
            >
              Cancel
            </button>

            <button
              type='submit'
              disabled={
                isSubmitting ||
                !formData.pickupLocationArea ||
                !formData.destinationZone
              }
              className='px-8 py-3 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg transition flex items-center disabled:opacity-50'
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

export default PointToPointTransferForm;
