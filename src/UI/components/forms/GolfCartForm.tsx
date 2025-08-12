import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { useRouter } from 'next/navigation';
import { useReservation } from '@/context/BookingContext';
import { Service } from '@/types/type';
import {
  Calendar,
  MapPin,
  Clock,
  AlertTriangle,
  Info,
  Car,
  Users,
  Battery,
  Shield,
  Star,
  Check,
  FileText,
  Truck,
  CheckCircle,
  Phone,
  CreditCard,
  Plus,
  Minus,
  ShoppingCart,
} from 'lucide-react';

// Types for better type safety
interface GolfCartOption {
  id: string;
  name: string;
  spanishName: string;
  seats: number;
  basePrice: number;
  image: string;
  features: string[];
  description: string;
  spanishDescription: string;
}

// Updated interface to handle multiple cart selections
interface CartSelection {
  [cartId: string]: number; // cartId -> quantity
}

interface FormData {
  // Cart selection with quantities
  selectedCarts: CartSelection;

  // Rental period
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;

  // Location
  deliveryLocation: string;
  specificAddress: string;

  // Additional information
  specialRequests: string;
  driverLicense: boolean;
  ageConfirmation: boolean;
  termsAccepted: boolean;
}

interface FormErrors {
  [key: string]: string;
}

interface GolfCartFormProps {
  service: Service;
  onSubmit?: (
    formData: FormData & {
      totalPrice: number;
      selectedCartsDetails: Array<{
        cart: GolfCartOption;
        quantity: number;
        subtotal: number;
      }>;
      rentalDays: number;
      totalCarts: number;
    }
  ) => void;
  onCancel: () => void;
}

// Golf Cart options based on PDF
const GOLF_CART_OPTIONS: GolfCartOption[] = [
  {
    id: '4-seater',
    name: '4-Seater Cart',
    spanishName: 'Carrito de 4 Plazas',
    seats: 4,
    basePrice: 60,
    image:
      'https://images.unsplash.com/photo-1551058622-5d7b4f0c6e6a?w=800&h=600&fit=crop',
    features: [
      'Free delivery & pickup',
      '24/7 support included',
      'Quick orientation included',
    ],
    description:
      'Perfect for couples or small families. Compact and efficient for resort exploration.',
    spanishDescription:
      'Perfecto para parejas o familias pequeñas. Compacto y eficiente para explorar el resort.',
  },
  {
    id: '6-seater',
    name: '6-Seater Cart',
    spanishName: 'Carrito de 6 Plazas',
    seats: 6,
    basePrice: 80,
    image:
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
    features: [
      'Free delivery & pickup',
      '24/7 support included',
      'Quick orientation included',
    ],
    description:
      'Ideal for larger groups and families. More space and comfort for extended exploration.',
    spanishDescription:
      'Ideal para grupos grandes y familias. Más espacio y comodidad para exploración extendida.',
  },
];

// Location options
const DELIVERY_LOCATIONS = [
  { id: 'punta-cana-resorts', name: 'Puntacana Resorts' },
  { id: 'cap-cana', name: 'Capcana' },
  { id: 'bavaro', name: 'Bavaro' },
  { id: 'punta-village', name: 'Puntacana Village' },
  { id: 'uvero-alto', name: 'Uvero Alto' },
  { id: 'macao', name: 'Macao Beach Area' },
  { id: 'other', name: 'Other (Specify below)' },
] as const;

// Requirements and info from PDF
const RENTAL_REQUIREMENTS = [
  "Must be 18+ years old with a valid driver's license",
  'Basic driving experience recommended',
  'Drive responsibly and follow resort/community rules',
  'Respect local driving laws and speed limits',
  'Children must be supervised at all times while in cart',
  'Available throughout Puntacana area',
];

const WHAT_TO_EXPECT = [
  'We deliver your golf cart(s) to your location',
  'Quick orientation & safety overview for each cart',
  'You drive & enjoy your surroundings',
  'We pick them up at your scheduled time',
];

const INCLUDED_FEATURES = [
  'Full fuel tank (if applicable)',
  'Free delivery & pickup',
  '24/7 support',
  'Quick orientation',
];

const NOT_INCLUDED = ['Gratuity (optional, appreciated)'];

const GolfCartForm: React.FC<GolfCartFormProps> = ({
  service,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { setReservationData } = useReservation();

  // Initialize cart selections
  const initializeCartSelections = (): CartSelection => {
    const initialSelection: CartSelection = {};

    // Initialize with pre-selected cart if available
    if (service?.selectedCartInfo?.id) {
      initialSelection[service.selectedCartInfo.id] = 1;
    }

    // Initialize all cart types with 0
    GOLF_CART_OPTIONS.forEach((cart) => {
      if (!initialSelection[cart.id]) {
        initialSelection[cart.id] = 0;
      }
    });

    return initialSelection;
  };

  // Form state
  const [formData, setFormData] = useState<FormData>({
    selectedCarts: initializeCartSelections(),
    startDate: '',
    startTime: '09:00',
    endDate: '',
    endTime: '17:00',
    deliveryLocation: '',
    specificAddress: '',
    specialRequests: '',
    driverLicense: false,
    ageConfirmation: false,
    termsAccepted: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update selected cart if service changes
  useEffect(() => {
    if (
      service?.selectedCartInfo?.id &&
      formData.selectedCarts[service.selectedCartInfo.id] === 0
    ) {
      setFormData((prev) => ({
        ...prev,
        selectedCarts: {
          ...prev.selectedCarts,
          [service.selectedCartInfo.id]: 1,
        },
      }));
    }
  }, [service?.selectedCartInfo?.id]);

  // Get selected carts with details
  const selectedCartsDetails = useMemo(() => {
    return GOLF_CART_OPTIONS.map((cart) => ({
      cart,
      quantity: formData.selectedCarts[cart.id] || 0,
      subtotal: (formData.selectedCarts[cart.id] || 0) * cart.basePrice,
    })).filter((item) => item.quantity > 0);
  }, [formData.selectedCarts]);

  // Calculate total carts
  const totalCarts = useMemo(() => {
    return Object.values(formData.selectedCarts).reduce(
      (sum, quantity) => sum + quantity,
      0
    );
  }, [formData.selectedCarts]);

  // Calculate rental days
  const rentalDays = useMemo(() => {
    if (!formData.startDate || !formData.endDate) return 1;

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return Math.max(1, diffDays);
  }, [formData.startDate, formData.endDate]);

  // Calculate total price
  const calculateTotalPrice = useMemo(() => {
    const baseTotal = selectedCartsDetails.reduce(
      (sum, item) => sum + item.subtotal,
      0
    );
    return baseTotal * rentalDays;
  }, [selectedCartsDetails, rentalDays]);

  // Handle cart quantity change
  const handleCartQuantityChange = (cartId: string, newQuantity: number) => {
    const clampedQuantity = Math.max(0, Math.min(10, newQuantity)); // Limit to 0-10 carts

    setFormData((prev) => ({
      ...prev,
      selectedCarts: {
        ...prev.selectedCarts,
        [cartId]: clampedQuantity,
      },
    }));

    // Clear cart selection error if user selects any cart
    if (clampedQuantity > 0 && errors.selectedCarts) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.selectedCarts;
        return newErrors;
      });
    }
  };

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

  const isEndDateValid = (): boolean => {
    if (!formData.startDate || !formData.endDate) return true;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    return end >= start;
  };

  // Form validation
  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    // Cart selection validation
    if (totalCarts === 0) {
      newErrors.selectedCarts = 'Please select at least one golf cart';
    }

    // Required fields
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (!formData.deliveryLocation) {
      newErrors.deliveryLocation = 'Delivery location is required';
    }

    // Specific address required for "other" location
    if (
      formData.deliveryLocation === 'other' &&
      !formData.specificAddress.trim()
    ) {
      newErrors.specificAddress = 'Please specify the delivery address';
    }

    // Date validations
    if (
      formData.startDate &&
      !isSameDay(formData.startDate) &&
      !hasMinimum24Hours(formData.startDate)
    ) {
      newErrors.startDate =
        'Bookings must be made at least 24 hours in advance';
    }

    if (!isEndDateValid()) {
      newErrors.endDate = 'End date must be same or after start date';
    }

    // Requirements confirmations
    if (!formData.driverLicense) {
      newErrors.driverLicense =
        "Valid driver's license confirmation is required";
    }

    if (!formData.ageConfirmation) {
      newErrors.ageConfirmation = 'Age confirmation is required';
    }

    if (!formData.termsAccepted) {
      newErrors.termsAccepted = 'You must accept the terms and conditions';
    }

    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      console.log('❌ GolfCartForm - Validation errors:', validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Same day booking confirmation
      if (isSameDay(formData.startDate)) {
        if (
          !window.confirm(
            'You are booking for today. This requires immediate confirmation from our team. Continue?'
          )
        ) {
          setIsSubmitting(false);
          return;
        }
      }

      // Create booking dates
      const startDate = new Date(formData.startDate);
      const [startHours, startMinutes] = formData.startTime
        .split(':')
        .map(Number);
      startDate.setHours(startHours, startMinutes, 0, 0);

      const endDate = new Date(formData.endDate);
      const [endHours, endMinutes] = formData.endTime.split(':').map(Number);
      endDate.setHours(endHours, endMinutes, 0, 0);

      // Create selected items for reservation
      const selectedItems = selectedCartsDetails.map((item) => ({
        id: `golf-cart-${item.cart.id}`,
        name: `${item.cart.name} (x${item.quantity})`,
        quantity: item.quantity,
        price: item.cart.basePrice,
        totalPrice: item.subtotal * rentalDays,
        duration: `${rentalDays} night${rentalDays > 1 ? 's' : ''}`,
      }));

      // Create reservation data
      const reservationData = {
        service: service,
        formData: {
          ...formData,
          serviceType: 'golf-cart-rental',
          totalPrice: calculateTotalPrice,
          selectedCartsDetails,
          rentalDays: rentalDays,
          totalCarts,
        },
        totalPrice: calculateTotalPrice,
        bookingDate: startDate,
        endDate: endDate,
        participants: {
          adults: 1, // At least the driver
          children: 0,
          total: 1,
        },
        selectedItems,
        clientInfo: undefined,
        // Golf cart specific data
        golfCartSpecifics: {
          selectedCarts: formData.selectedCarts,
          selectedCartsDetails,
          totalCarts,
          rentalDays: rentalDays,
          startDate: formData.startDate,
          startTime: formData.startTime,
          endDate: formData.endDate,
          endTime: formData.endTime,
          deliveryLocation: formData.deliveryLocation,
          specificAddress: formData.specificAddress,
          specialRequests: formData.specialRequests,
          requirements: RENTAL_REQUIREMENTS,
          included: INCLUDED_FEATURES,
          notIncluded: NOT_INCLUDED,
          whatToExpect: WHAT_TO_EXPECT,
          driverLicense: formData.driverLicense,
          ageConfirmation: formData.ageConfirmation,
          termsAccepted: formData.termsAccepted,
        },
      };

      console.log(
        '🚗 GolfCartForm - Reservation data created:',
        reservationData
      );

      // Store in context
      setReservationData(reservationData);

      // Call the onSubmit callback if provided
      if (onSubmit) {
        await onSubmit({
          ...formData,
          totalPrice: calculateTotalPrice,
          selectedCartsDetails,
          rentalDays: rentalDays,
          totalCarts,
        });
      }

      // Navigate to confirmation page
      router.push('/reservation-confirmation');
    } catch (error) {
      console.error('❌ GolfCartForm - Error submitting form:', error);
      setErrors({
        submit: 'Failed to submit reservation. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generic input handler
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error when user interacts
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Handle location selection
  const handleLocationSelect = (locationId: string) => {
    setFormData((prev) => ({
      ...prev,
      deliveryLocation: locationId,
    }));

    // Clear location error if exists
    if (errors.deliveryLocation) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.deliveryLocation;
        return newErrors;
      });
    }
  };

  // Quantity Input Component
  const QuantityInput: React.FC<{
    cartId: string;
    currentQuantity: number;
    maxQuantity?: number;
  }> = ({ cartId, currentQuantity, maxQuantity = 10 }) => (
    <div className='flex items-center space-x-2'>
      <button
        type='button'
        onClick={() => handleCartQuantityChange(cartId, currentQuantity - 1)}
        disabled={currentQuantity === 0}
        className='w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
      >
        <Minus className='w-4 h-4 text-gray-600' />
      </button>

      <input
        type='number'
        min='0'
        max={maxQuantity}
        value={currentQuantity}
        onChange={(e) =>
          handleCartQuantityChange(cartId, parseInt(e.target.value) || 0)
        }
        className='w-16 text-center py-1 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500'
      />

      <button
        type='button'
        onClick={() => handleCartQuantityChange(cartId, currentQuantity + 1)}
        disabled={currentQuantity >= maxQuantity}
        className='w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
      >
        <Plus className='w-4 h-4 text-gray-600' />
      </button>
    </div>
  );

  // Golf Cart Selection Component
  const GolfCartSelection = () => (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {GOLF_CART_OPTIONS.map((cart) => {
          const quantity = formData.selectedCarts[cart.id] || 0;
          const isSelected = quantity > 0;

          return (
            <div
              key={cart.id}
              className={`relative border-2 rounded-2xl overflow-hidden transition-all duration-300 ${
                isSelected
                  ? 'border-blue-500 shadow-2xl ring-4 ring-blue-200'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-xl'
              }`}
            >
              {/* Cart Image */}
              <div className='relative h-48 overflow-hidden'>
                <img
                  src={cart.image}
                  alt={cart.name}
                  className='w-full h-full object-cover transition-transform duration-300 hover:scale-105'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent' />

                {/* Quantity Badge */}
                {isSelected && (
                  <div className='absolute top-4 left-4 bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold'>
                    {quantity}
                  </div>
                )}

                {/* Price Overlay */}
                <div className='absolute bottom-4 left-4 text-white'>
                  <div className='text-2xl font-bold'>${cart.basePrice}</div>
                  <div className='text-sm opacity-90'>per night</div>
                </div>
              </div>

              {/* Cart Info */}
              <div className='p-6'>
                <div className='flex items-center justify-between mb-3'>
                  <h4 className='text-xl font-bold text-gray-800 flex items-center gap-2'>
                    <Car className='w-6 h-6 text-blue-600' />
                    {cart.name}
                  </h4>
                </div>

                <div className='flex items-center text-gray-600 text-sm mb-3'>
                  <Users className='w-4 h-4 mr-1' />
                  {cart.seats} seats • Electric/Gas
                </div>

                <p className='text-gray-600 text-sm mb-4'>{cart.description}</p>

                {/* Quantity Controls */}
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium text-gray-700'>
                    Quantity:
                  </span>
                  <QuantityInput cartId={cart.id} currentQuantity={quantity} />
                </div>

                {/* Subtotal */}
                {isSelected && (
                  <div className='mt-3 pt-3 border-t border-gray-200'>
                    <div className='flex justify-between items-center text-sm'>
                      <span className='text-gray-600'>Subtotal:</span>
                      <span className='font-bold text-gray-800'>
                        ${cart.basePrice * quantity}/night
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {errors.selectedCarts && (
        <p className='text-red-500 text-sm'>{errors.selectedCarts}</p>
      )}
    </div>
  );

  // What to Expect Section
  const WhatToExpectSection = () => (
    <div className='bg-blue-50 border border-blue-200 rounded-lg p-6'>
      <div className='flex items-start'>
        <Info className='w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5' />
        <div className='w-full'>
          <h4 className='font-medium text-blue-800 mb-3'>What to Expect</h4>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {WHAT_TO_EXPECT.map((step, index) => (
              <div
                key={index}
                className='flex items-start text-sm text-blue-700'
              >
                <span className='bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0 mt-0.5'>
                  {index + 1}
                </span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Requirements Section
  const RequirementsSection = () => (
    <div className='space-y-4'>
      <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2'>
        Driver Requirements & Disclaimer
      </h3>

      {/* Requirements List */}
      <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
        <div className='flex items-start'>
          <FileText className='w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5' />
          <div>
            <h4 className='font-medium text-blue-800 mb-2'>
              Driver Requirements
            </h4>
            <ul className='text-sm text-blue-700 space-y-1'>
              {RENTAL_REQUIREMENTS.map((requirement, index) => (
                <li key={index}>• {requirement}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className='bg-amber-50 border border-amber-200 rounded-lg p-4'>
        <div className='flex items-start'>
          <AlertTriangle className='w-5 h-5 text-amber-600 mr-3 flex-shrink-0 mt-0.5' />
          <div>
            <h4 className='font-medium text-amber-800 mb-2'>
              Important Disclaimer
            </h4>
            <p className='text-sm text-amber-700'>
              <strong>Drive at your own discretion.</strong> Please follow all
              community or resort rules and respect local driving laws. You are
              responsible for the safe operation of the vehicle during the
              rental period. Our carts are more than transportation—they're
              freedom on wheels.
            </p>
          </div>
        </div>
      </div>

      {/* Confirmations */}
      <div className='space-y-3'>
        <div className='flex items-start'>
          <input
            type='checkbox'
            id='driverLicense'
            name='driverLicense'
            checked={formData.driverLicense}
            onChange={handleInputChange}
            className='mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
          />
          <label htmlFor='driverLicense' className='ml-2 text-sm text-gray-700'>
            I confirm that I have a valid driver's license and meet all driving
            requirements
          </label>
        </div>
        {errors.driverLicense && (
          <p className='text-red-500 text-xs ml-6'>{errors.driverLicense}</p>
        )}

        <div className='flex items-start'>
          <input
            type='checkbox'
            id='ageConfirmation'
            name='ageConfirmation'
            checked={formData.ageConfirmation}
            onChange={handleInputChange}
            className='mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
          />
          <label
            htmlFor='ageConfirmation'
            className='ml-2 text-sm text-gray-700'
          >
            I confirm that I am 18 years of age or older
          </label>
        </div>
        {errors.ageConfirmation && (
          <p className='text-red-500 text-xs ml-6'>{errors.ageConfirmation}</p>
        )}

        <div className='flex items-start'>
          <input
            type='checkbox'
            id='termsAccepted'
            name='termsAccepted'
            checked={formData.termsAccepted}
            onChange={handleInputChange}
            className='mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
          />
          <label htmlFor='termsAccepted' className='ml-2 text-sm text-gray-700'>
            I accept the terms and conditions and disclaimer above
          </label>
        </div>
        {errors.termsAccepted && (
          <p className='text-red-500 text-xs ml-6'>{errors.termsAccepted}</p>
        )}
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className='w-full mx-auto overflow-hidden'>
      <div className='bg-white rounded-xl shadow-lg border border-gray-100'>
        {/* Header */}
        <div className='bg-gradient-to-r from-blue-800 via-blue-700 to-cyan-800 p-6 text-white'>
          <h2 className='text-2xl font-light tracking-wide'>
            Golf Cart Rental Booking
          </h2>
          <p className='text-blue-100 mt-1 font-light'>
            Move Freely. Explore Comfortably.
          </p>
          <div className='mt-3 flex items-center text-blue-100 text-sm'>
            <Car className='w-4 h-4 mr-2' />
            Flexible duration | Free delivery & pickup included
          </div>
        </div>

        {/* Form Body */}
        <div className='p-8 space-y-8'>
          {/* Golf Cart Selection */}
          <div className='space-y-6'>
            <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2'>
              Choose Your Golf Carts
            </h3>
            <GolfCartSelection />
          </div>

          {/* Rental Period */}
          <div className='space-y-6'>
            <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2'>
              Rental Period
            </h3>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {/* Start Date & Time */}
              <div className='space-y-4'>
                <div>
                  <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                    <Calendar className='w-4 h-4 mr-2 text-blue-700' />
                    Start Date *
                  </label>
                  <input
                    type='date'
                    name='startDate'
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className={`w-full p-3 border ${
                      errors.startDate ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-50`}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  {errors.startDate && (
                    <p className='text-red-500 text-xs mt-1'>
                      {errors.startDate}
                    </p>
                  )}
                </div>
              </div>

              {/* End Date & Time */}
              <div className='space-y-4'>
                <div>
                  <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                    <Calendar className='w-4 h-4 mr-2 text-blue-700' />
                    Return Date *
                  </label>
                  <input
                    type='date'
                    name='endDate'
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className={`w-full p-3 border ${
                      errors.endDate ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-50`}
                    min={
                      formData.startDate ||
                      new Date().toISOString().split('T')[0]
                    }
                  />
                  {errors.endDate && (
                    <p className='text-red-500 text-xs mt-1'>
                      {errors.endDate}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Booking timing warnings */}
            {formData.startDate && (
              <div className='mt-4'>
                {isSameDay(formData.startDate) ? (
                  <div className='p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start'>
                    <Info className='w-4 h-4 text-amber-600 mr-2 mt-0.5' />
                    <div className='text-sm text-amber-800'>
                      <strong>Same-day booking:</strong> Requires immediate
                      confirmation from our team. Subject to availability.
                    </div>
                  </div>
                ) : !hasMinimum24Hours(formData.startDate) ? (
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
          </div>

          {/* Delivery Location */}
          <div className='space-y-6'>
            <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2'>
              Delivery Location
            </h3>

            <div>
              <label className='flex items-center text-sm font-medium text-gray-700 mb-3'>
                <MapPin className='w-4 h-4 mr-2 text-blue-700' />
                Select Delivery Location *
              </label>

              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
                {DELIVERY_LOCATIONS.map((location) => (
                  <div
                    key={location.id}
                    className={`
                      border rounded-lg p-4 cursor-pointer transition-all
                      ${
                        formData.deliveryLocation === location.id
                          ? 'bg-blue-50 border-blue-300 shadow-sm'
                          : 'border-gray-200 hover:bg-gray-50'
                      }
                    `}
                    onClick={() => handleLocationSelect(location.id)}
                  >
                    <div className='flex items-center'>
                      <div
                        className={`
                        w-5 h-5 rounded-full border flex items-center justify-center mr-3
                        ${
                          formData.deliveryLocation === location.id
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300'
                        }
                      `}
                      >
                        {formData.deliveryLocation === location.id && (
                          <Check className='w-3 h-3 text-white' />
                        )}
                      </div>
                      <span className='font-medium text-gray-800'>
                        {location.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {errors.deliveryLocation && (
                <p className='text-red-500 text-xs mt-2'>
                  {errors.deliveryLocation}
                </p>
              )}

              {/* Specific Address for "Other" */}
              {formData.deliveryLocation === 'other' && (
                <div className='mt-4'>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Specific Address *
                  </label>
                  <input
                    type='text'
                    name='specificAddress'
                    value={formData.specificAddress}
                    onChange={handleInputChange}
                    placeholder='Please provide the exact delivery address...'
                    className={`w-full p-3 border ${
                      errors.specificAddress
                        ? 'border-red-500'
                        : 'border-gray-300'
                    } rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-50`}
                  />
                  {errors.specificAddress && (
                    <p className='text-red-500 text-xs mt-1'>
                      {errors.specificAddress}
                    </p>
                  )}
                </div>
              )}

              {/* Delivery info */}
              {formData.deliveryLocation && (
                <div className='mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg'>
                  <div className='flex items-start'>
                    <Truck className='w-4 h-4 text-blue-600 mr-2 mt-0.5' />
                    <div className='text-sm text-blue-800'>
                      <strong>Delivery Information:</strong> Our team will
                      deliver your golf cart{totalCarts > 1 ? 's' : ''} to your
                      location and provide a quick orientation
                      {totalCarts > 1 ? ' for each cart' : ''}. Pickup will be
                      scheduled at your specified return time.
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* What to Expect */}
          <WhatToExpectSection />

          {/* What's Included */}
          <div className='space-y-6'>
            <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2'>
              What's Included
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
              {INCLUDED_FEATURES.map((item, index) => (
                <div
                  key={index}
                  className='flex items-center text-sm text-gray-700'
                >
                  <CheckCircle className='w-4 h-4 text-green-500 mr-2 flex-shrink-0' />
                  {item}
                </div>
              ))}
            </div>

            <div className='pt-4 border-t border-gray-200'>
              <h4 className='font-medium text-gray-800 mb-2'>Not Included:</h4>
              {NOT_INCLUDED.map((item, index) => (
                <div
                  key={index}
                  className='flex items-center text-sm text-gray-600'
                >
                  <Info className='w-4 h-4 text-gray-400 mr-2 flex-shrink-0' />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Special Requests */}
          <div className='space-y-6'>
            <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2'>
              Additional Information
            </h3>

            <div>
              <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                <Info className='w-4 h-4 mr-2 text-blue-700' />
                Special Requests or Requirements
              </label>
              <textarea
                name='specialRequests'
                value={formData.specialRequests}
                onChange={handleInputChange}
                rows={3}
                className='w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-50'
                placeholder='Any special requirements, accessibility needs, or additional information...'
              />
            </div>
          </div>

          {/* Requirements & Disclaimer */}
          <RequirementsSection />

          {/* Error Display */}
          {errors.submit && (
            <div className='p-3 bg-red-50 border border-red-200 rounded-lg'>
              <p className='text-red-800 text-sm'>{errors.submit}</p>
            </div>
          )}
        </div>

        {/* Footer with Price and Actions */}
        <div className='bg-gray-900 text-white p-6 flex flex-col md:flex-row items-center justify-between'>
          <div className='flex flex-col items-center md:items-start mb-4 md:mb-0'>
            <span className='text-gray-400 text-sm uppercase tracking-wide'>
              Total Price
            </span>
            <div className='flex items-center mt-1'>
              <span className='text-3xl font-light'>
                ${calculateTotalPrice.toFixed(2)}
              </span>
              <span className='ml-2 text-sm bg-blue-800 px-2 py-1 rounded'>
                {rentalDays} night{rentalDays > 1 ? 's' : ''}
              </span>
            </div>

            {/* Price breakdown */}
            <div className='text-xs text-gray-400 mt-2 space-y-1'>
              {totalCarts > 0 && (
                <>
                  <div className='text-blue-400 font-medium'>
                    {totalCarts} cart{totalCarts > 1 ? 's' : ''} selected
                  </div>
                  {selectedCartsDetails.map((item) => (
                    <div key={item.cart.id}>
                      {item.quantity}x {item.cart.name}: ${item.cart.basePrice}
                      /night × {rentalDays} = ${item.subtotal * rentalDays}
                    </div>
                  ))}
                  <div className='text-cyan-400'>
                    Includes: Free delivery & pickup, 24/7 support, safety
                    equipment
                  </div>
                </>
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
              disabled={isSubmitting || totalCarts === 0}
              className='px-8 py-3 bg-blue-700 hover:bg-blue-600 text-white rounded-lg transition flex items-center disabled:opacity-50'
            >
              <Car className='h-4 w-4 mr-2' />
              {isSubmitting
                ? 'Booking...'
                : `Book ${totalCarts || 0} Cart${totalCarts !== 1 ? 's' : ''}`}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default GolfCartForm;
