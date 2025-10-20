import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { useRouter } from 'next/navigation';
import { useReservation } from '@/context/BookingContext';
import { Service } from '@/types/type';
import { motion } from 'framer-motion';
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  AlertTriangle,
  Info,
  CheckCircle,
  Car,
  Mountain,
  CreditCard,
  Sunrise,
  Sun,
  Activity,
} from 'lucide-react';
import { useLocationPricing } from '@/hooks/useLocationPricing';
import { LocationSelector } from '../service/LocationSelector';
import FormHeader from './FormHeader';
import { useFormModal } from '@/hooks/useFormModal';

// ✅ NUEVAS IMPORTACIONES
import { useScrollToError } from '@/hooks/useScrollToError';
import { calculatePriceWithTax } from '@/utils/priceCalculator';

interface AtvRideFormProps {
  service: Service;
  selectedVehicle?: any;
  onSubmit?: (formData: any) => void;
  onCancel?: () => void;
}

interface FormData {
  date: string;
  timeSlot: string;
  location: string;
  vehicleType: string;
  vehicleCount: number;
  totalParticipants: number;
  hasExperience: boolean;
  additionalNotes: string;
}

interface FormErrors {
  [key: string]: string;
}

// Solo datos no traducibles
const VEHICLE_TYPES = {
  buggy: {
    price: 65,
    maxParticipants: 4,
  },
  atv: {
    price: 75,
    maxParticipants: 2,
  },
  polaris: {
    price: 150,
    maxParticipants: 2,
  },
  polarisFamiliar: {
    price: 200,
    maxParticipants: 4,
  },
};

// Solo datos no traducibles
const TIME_SLOTS = [
  {
    id: '8am',
    icon: Sunrise,
  },
  {
    id: '11am',
    icon: Sun,
  },
  {
    id: '2pm',
    icon: Activity,
  },
] as const;

// ✅ TRANSPORTE POR GRUPO (no por persona)
// ✅ TRANSPORTE POR GRUPO (no por persona)
const ATV_TRANSPORT_PRICING = {
  small: 120, // 1-6 personas: $120
  large: 140, // 7-12 personas: $140
  maxCapacity: 6, // Punto de corte para cambiar a "large"
};

// ✅ LÍMITE MÁXIMO DE PARTICIPANTES (según capacidad de transporte)
const MAX_PARTICIPANTS = 12;

const AtvRideForm: React.FC<AtvRideFormProps> = ({
  service,
  selectedVehicle,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { setReservationData } = useReservation();
  const { handleClose } = useFormModal({ onCancel });

  const [formData, setFormData] = useState<FormData>({
    date: '',
    timeSlot: '',
    location: '',
    vehicleType: selectedVehicle?.id || 'buggy',
    vehicleCount: 1,
    totalParticipants: 1,
    hasExperience: true,
    additionalNotes: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ HOOK PARA SCROLL A ERRORES
  const { fieldRefs, scrollToFirstError } = useScrollToError(errors);

  // ✅ CONSTANTE DE TAX
  const TAX_RATE = 5; // 5%

  const updateFormField = useCallback((field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => {
      if (prev[field]) {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      }
      return prev;
    });
  }, []);

  const handleInputChange = useCallback(
    (e: { target: HTMLInputElement }) => {
      const { name, value, type, checked } = e.target as HTMLInputElement;

      if (type === 'checkbox') {
        updateFormField(name, checked);
      } else {
        updateFormField(name, value);
      }
    },
    [updateFormField]
  );

  const handleLocationSelect = useCallback(
    (locationId: string) => {
      updateFormField('location', locationId);
    },
    [updateFormField]
  );

  const currentVehicle = useMemo(
    () => VEHICLE_TYPES[formData.vehicleType as keyof typeof VEHICLE_TYPES],
    [formData.vehicleType]
  );

  const {
    locationOptions,
    selectedLocation,
    locationSurcharge,
    transportCost,
    totalLocationCost,
  } = useLocationPricing({
    selectedLocationId: formData.location,
    totalParticipants: formData.totalParticipants,
    servicePricing: ATV_TRANSPORT_PRICING,
  });

  // ✅ COBRO POR PERSONA (no por vehículo)
  const basePrice = useMemo(() => {
    if (!currentVehicle?.price) return 0;
    return currentVehicle.price * formData.totalParticipants;
  }, [currentVehicle, formData.totalParticipants]);

  // ✅ CÁLCULO DE PRECIO CON TAX
  const priceWithTax = useMemo(() => {
    if (!currentVehicle?.price) return { subtotal: 0, tax: 0, total: 0 };
    const subtotal = basePrice + totalLocationCost;
    return calculatePriceWithTax(subtotal, TAX_RATE);
  }, [basePrice, totalLocationCost, currentVehicle]);

  // ✅ Mantener totalPrice para compatibilidad
  const totalPrice = priceWithTax.total;

  useEffect(() => {
    if (currentVehicle) {
      const vehiclesNeeded = Math.ceil(
        formData.totalParticipants / currentVehicle.maxParticipants
      );
      if (vehiclesNeeded !== formData.vehicleCount) {
        setFormData((prev) => ({
          ...prev,
          vehicleCount: vehiclesNeeded,
        }));
      }
    }
  }, [formData.totalParticipants, formData.vehicleType, currentVehicle]);

  const createCounterHandler = (
    field: keyof FormData,
    min = 0,
    max = MAX_PARTICIPANTS
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

  const participantCounter = createCounterHandler('totalParticipants', 1);
  const vehicleCounter = createCounterHandler('vehicleCount', 1, 8);

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    const maxCapacity =
      (currentVehicle?.maxParticipants || 1) * formData.vehicleCount;

    if (!formData.date) {
      newErrors.date = t(
        'services.standard.atvExcurtionsForm.fields.date.required'
      );
    }

    if (!formData.location) {
      newErrors.location = t(
        'services.standard.atvExcurtionsForm.fields.location.required'
      );
    }

    if (!formData.timeSlot) {
      newErrors.timeSlot = t(
        'services.standard.atvExcurtionsForm.fields.timeSlot.required'
      );
    }

    if (!formData.vehicleType) {
      newErrors.vehicleType = t(
        'services.standard.atvExcurtionsForm.fields.vehicleType.required'
      );
    }

    if (formData.totalParticipants < 1) {
      newErrors.totalParticipants = t(
        'services.standard.atvExcurtionsForm.fields.participants.min'
      );
    }

    if (formData.totalParticipants > MAX_PARTICIPANTS) {
      newErrors.totalParticipants = t(
        'services.standard.atvExcurtionsForm.fields.participants.max'
      );
    }

    if (formData.vehicleCount < 1) {
      newErrors.vehicleCount = t(
        'services.standard.atvExcurtionsForm.fields.vehicles.min'
      );
    }

    if (formData.vehicleCount > 8) {
      newErrors.vehicleCount = t(
        'services.standard.atvExcurtionsForm.fields.vehicles.max'
      );
    }

    if (formData.totalParticipants > maxCapacity) {
      newErrors.totalParticipants = t(
        'services.standard.atvExcurtionsForm.errors.capacityExceeded',
        {
          participants: formData.totalParticipants,
          vehicles: formData.vehicleCount,
          max: maxCapacity,
        }
      );
      newErrors.vehicleCount = t(
        'services.standard.atvExcurtionsForm.errors.needMoreVehicles',
        {
          needed: Math.ceil(
            formData.totalParticipants / (currentVehicle?.maxParticipants || 1)
          ),
          participants: formData.totalParticipants,
        }
      );
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      console.log('❌ AtvForm - Validation errors:', validationErrors);
      // ✅ SCROLL AL PRIMER ERROR
      scrollToFirstError();
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedDate = new Date(formData.date);
      const bookingStartDate = new Date(selectedDate);
      const bookingEndDate = new Date(selectedDate);

      switch (formData.timeSlot) {
        case '8am':
          bookingStartDate.setHours(8, 0, 0, 0);
          bookingEndDate.setHours(11, 0, 0, 0);
          break;
        case '11am':
          bookingStartDate.setHours(11, 0, 0, 0);
          bookingEndDate.setHours(14, 0, 0, 0);
          break;
        case '2pm':
          bookingStartDate.setHours(14, 0, 0, 0);
          bookingEndDate.setHours(17, 0, 0, 0);
          break;
      }

      const reservationData = {
        service: service,
        formData: {
          ...formData,
          serviceType: 'atv-adventure',
          totalPrice,
          basePrice,
          transportCost,
          locationSurcharge,
          // ✅ AGREGAR info de tax
          subtotal: priceWithTax.subtotal,
          tax: priceWithTax.tax,
          taxRate: TAX_RATE,
          locationName: selectedLocation?.name || formData.location,
          pickupTime: t(
            `services.standard.atvExcurtionsForm.timeSlots.${formData.timeSlot}.pickup`
          ),
        },
        totalPrice,
        bookingDate: bookingStartDate,
        endDate: bookingEndDate,
        participants: {
          adults: formData.totalParticipants,
          children: 0,
          total: formData.totalParticipants,
        },
        selectedItems: [
          {
            id: `atv-${formData.vehicleType}`,
            name: `${t(
              'services.standard.atvExcurtionsForm.header.title'
            )} - ${t(
              `services.standard.atvExcurtionsForm.vehicleTypes.${formData.vehicleType}.name`
            )}`,
            quantity: formData.vehicleCount,
            price: totalPrice,
            totalPrice,
            timeSlot: formData.timeSlot,
            vehicleType: formData.vehicleType,
            location: selectedLocation?.name || formData.location,
          },
        ],
        clientInfo: undefined,
        atvSpecifics: {
          timeSlot: formData.timeSlot,
          pickupTime: t(
            `services.standard.atvExcurtionsForm.timeSlots.${formData.timeSlot}.pickup`
          ),
          location: formData.location,
          locationName: selectedLocation?.name || formData.location,
          vehicleType: formData.vehicleType,
          vehicleCount: formData.vehicleCount,
          totalParticipants: formData.totalParticipants,
          hasExperience: formData.hasExperience,
          additionalNotes: formData.additionalNotes,
          pricing: {
            basePrice,
            transportCost,
            locationSurcharge,
            subtotal: priceWithTax.subtotal,
            tax: priceWithTax.tax,
            taxRate: TAX_RATE,
            totalPrice,
          },
        },
      };

      console.log('🏍️ AtvForm - Reservation data created:', reservationData);

      setReservationData(reservationData);

      if (onSubmit) {
        await onSubmit(reservationData);
      }

      router.push('/reservation-confirmation');
    } catch (error) {
      console.error('❌ AtvForm - Error submitting form:', error);
      setErrors({
        submit: t('services.standard.atvExcurtionsForm.errors.submit'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isPremium =
    formData.vehicleType === 'polaris' ||
    formData.vehicleType === 'polarisFamiliar';

  const Counter = ({
    label,
    value,
    onIncrement,
    onDecrement,
    icon: Icon,
    min = 0,
    max = MAX_PARTICIPANTS,
  }: {
    label: string;
    value: number;
    onIncrement: () => void;
    onDecrement: () => void;
    icon: React.ElementType;
    min?: number;
    max?: number;
  }) => (
    <div>
      <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
        <Icon
          className={`w-4 h-4 mr-2 ${
            isPremium ? 'text-purple-600' : 'text-green-600'
          }`}
        />
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
          disabled={value >= max}
          className='px-4 py-2 bg-gray-100 hover:bg-gray-200 transition disabled:opacity-50'
        >
          +
        </button>
      </div>
      {value >= max && (
        <p className='text-xs text-amber-600 mt-1'>
          {t(
            'services.standard.atvExcurtionsForm.fields.participants.maxReached',
            {
              max,
              label: label.toLowerCase(),
            }
          )}
        </p>
      )}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      <form onSubmit={handleSubmit} className='w-full mx-auto overflow-hidden'>
        <div className='bg-white rounded-xl shadow-lg border border-gray-100'>
          <FormHeader
            title={t('services.standard.atvExcurtionsForm.header.title')}
            subtitle={t('services.standard.atvExcurtionsForm.header.subtitle')}
            icon={Mountain}
            isPremium={isPremium}
            onCancel={handleClose}
            showCloseButton={true}
            gradientFrom='green-800'
            gradientVia='green-600'
            gradientTo='amber-500'
          />

          <div className='p-8 space-y-8'>
            {/* Date and Time Section */}
            <div className='space-y-6'>
              <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2'>
                {t('services.standard.atvExcurtionsForm.sections.schedule')}
              </h3>

              {/* ✅ Date Selection con REF */}
              <div ref={(el) => el && fieldRefs.current.set('date', el)}>
                <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                  <Calendar
                    className={`w-4 h-4 mr-2 ${
                      isPremium ? 'text-purple-600' : 'text-green-600'
                    }`}
                  />
                  {t('services.standard.atvExcurtionsForm.fields.date.label')} *
                </label>
                <input
                  type='date'
                  name='date'
                  value={formData.date}
                  onChange={handleInputChange}
                  onClick={(e) => e.currentTarget.showPicker()}
                  className={`w-full p-3 border ${
                    errors.date ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-2 ${
                    isPremium ? 'focus:ring-purple-500' : 'focus:ring-green-500'
                  } bg-gray-50`}
                  min={new Date().toISOString().split('T')[0]}
                />
                {errors.date && (
                  <p className='text-red-500 text-xs mt-1'>{errors.date}</p>
                )}
              </div>

              {/* ✅ Time Slot Selection con REF */}
              <div ref={(el) => el && fieldRefs.current.set('timeSlot', el)}>
                <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                  <Clock
                    className={`w-4 h-4 mr-2 ${
                      isPremium ? 'text-purple-600' : 'text-green-600'
                    }`}
                  />
                  {t(
                    'services.standard.atvExcurtionsForm.fields.timeSlot.label'
                  )}{' '}
                  *
                </label>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  {TIME_SLOTS.map((slot) => {
                    const IconComponent = slot.icon;
                    return (
                      <div
                        key={slot.id}
                        className={`
                          border rounded-lg p-4 cursor-pointer transition-all
                          ${
                            formData.timeSlot === slot.id
                              ? `${
                                  isPremium
                                    ? 'bg-purple-50 border-purple-300'
                                    : 'bg-green-50 border-green-300'
                                } shadow-sm`
                              : 'border-gray-200 hover:bg-gray-50'
                          }
                        `}
                        onClick={() => updateFormField('timeSlot', slot.id)}
                      >
                        <div className='flex items-center'>
                          <div
                            className={`
                            w-5 h-5 rounded-full border flex items-center justify-center mr-3
                            ${
                              formData.timeSlot === slot.id
                                ? `${
                                    isPremium
                                      ? 'border-purple-500 bg-purple-500'
                                      : 'border-green-500 bg-green-500'
                                  }`
                                : 'border-gray-300'
                            }
                          `}
                          >
                            {formData.timeSlot === slot.id && (
                              <CheckCircle className='w-4 h-4 text-white' />
                            )}
                          </div>
                          <div className='flex items-center'>
                            <IconComponent
                              className={`w-5 h-5 mr-2 ${
                                isPremium ? 'text-purple-500' : 'text-green-500'
                              }`}
                            />
                            <span className='font-medium'>
                              {t(
                                `services.standard.atvExcurtionsForm.timeSlots.${slot.id}.name`
                              )}
                            </span>
                          </div>
                        </div>

                        <p className='text-gray-400 text-xs mt-1 ml-8'>
                          {t(
                            'services.standard.atvExcurtionsForm.fields.timeSlot.pickup'
                          )}
                          :{' '}
                          {t(
                            `services.standard.atvExcurtionsForm.timeSlots.${slot.id}.pickup`
                          )}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {errors.timeSlot && (
                  <p className='text-red-500 text-xs mt-1'>{errors.timeSlot}</p>
                )}
              </div>
            </div>

            {/* ✅ Location Selection con REF */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2'>
                {t('services.standard.atvExcurtionsForm.sections.location')}
              </h3>

              <div ref={(el) => el && fieldRefs.current.set('location', el)}>
                <LocationSelector
                  selectedLocationId={formData.location}
                  onLocationSelect={handleLocationSelect}
                  locationOptions={locationOptions}
                  error={errors.location}
                  isPremium={isPremium}
                />
              </div>
            </div>

            {/* Vehicle Selection */}
            <div className='space-y-6'>
              <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2'>
                {t(
                  'services.standard.atvExcurtionsForm.sections.vehicleAndGroup'
                )}
              </h3>

              {/* ✅ Vehicle Type con REF */}
              <div ref={(el) => el && fieldRefs.current.set('vehicleType', el)}>
                <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                  <Car
                    className={`w-4 h-4 mr-2 ${
                      isPremium ? 'text-purple-600' : 'text-green-600'
                    }`}
                  />
                  {t(
                    'services.standard.atvExcurtionsForm.fields.vehicleType.label'
                  )}{' '}
                  *
                </label>
                <select
                  name='vehicleType'
                  value={formData.vehicleType}
                  onChange={handleInputChange}
                  className={`w-full p-3 border ${
                    errors.vehicleType ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-2 ${
                    isPremium ? 'focus:ring-purple-500' : 'focus:ring-green-500'
                  } bg-gray-50`}
                >
                  {Object.entries(VEHICLE_TYPES).map(([key, vehicle]) => (
                    <option key={key} value={key}>
                      {t(
                        `services.standard.atvExcurtionsForm.vehicleTypes.${key}.name`
                      )}{' '}
                      - ${vehicle.price}
                    </option>
                  ))}
                </select>

                {errors.vehicleType && (
                  <p className='text-red-500 text-xs mt-1'>
                    {errors.vehicleType}
                  </p>
                )}
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {/* ✅ Participants con REF */}
                <div
                  ref={(el) =>
                    el && fieldRefs.current.set('totalParticipants', el)
                  }
                >
                  <Counter
                    label={t(
                      'services.standard.atvExcurtionsForm.fields.participants.label'
                    )}
                    value={formData.totalParticipants}
                    onIncrement={participantCounter.increment}
                    onDecrement={participantCounter.decrement}
                    icon={Users}
                    min={1}
                    max={16}
                  />
                  {errors.totalParticipants && (
                    <p className='text-red-500 text-xs mt-1'>
                      {errors.totalParticipants}
                    </p>
                  )}
                </div>

                {/* ✅ Vehicles con REF */}
                <div
                  ref={(el) => el && fieldRefs.current.set('vehicleCount', el)}
                >
                  <Counter
                    label={t(
                      'services.standard.atvExcurtionsForm.fields.vehicles.label'
                    )}
                    value={formData.vehicleCount}
                    onIncrement={vehicleCounter.increment}
                    onDecrement={vehicleCounter.decrement}
                    icon={Car}
                    min={1}
                    max={8}
                  />
                  {errors.vehicleCount && (
                    <p className='text-red-500 text-xs mt-1'>
                      {errors.vehicleCount}
                    </p>
                  )}
                </div>
              </div>

              {/* Capacity Validation */}
              <div>
                {(() => {
                  const maxCapacity =
                    (currentVehicle?.maxParticipants || 1) *
                    formData.vehicleCount;
                  const isOverCapacity =
                    formData.totalParticipants > maxCapacity;
                  const suggestedVehicles = Math.ceil(
                    formData.totalParticipants /
                      (currentVehicle?.maxParticipants || 1)
                  );

                  if (isOverCapacity) {
                    return (
                      <div className='p-4 bg-red-50 border-2 border-red-300 rounded-lg'>
                        <div className='flex items-start gap-3'>
                          <AlertTriangle className='w-5 h-5 text-red-600 flex-shrink-0 mt-0.5' />
                          <div>
                            <h4 className='font-semibold text-red-800 mb-2'>
                              {t(
                                'services.standard.atvExcurtionsForm.capacity.exceeded.title'
                              )}
                            </h4>
                            <p className='text-red-700 text-sm mb-3'>
                              <strong>{formData.totalParticipants}</strong>{' '}
                              {t(
                                'services.standard.atvExcurtionsForm.capacity.people'
                              )}{' '}
                              {t(
                                'services.standard.atvExcurtionsForm.capacity.exceeded.message',
                                {
                                  participants: formData.totalParticipants,
                                  vehicles: formData.vehicleCount,
                                  vehicleName: t(
                                    `services.standard.atvExcurtionsForm.vehicleTypes.${formData.vehicleType}.name`
                                  ),
                                  plural:
                                    formData.vehicleCount !== 1 ? 's' : '',
                                }
                              )
                                .split(' ')
                                .slice(2)
                                .join(' ')}
                              <br />
                              {t(
                                'services.standard.atvExcurtionsForm.capacity.exceeded.maxCapacity',
                                {
                                  max: maxCapacity,
                                  perVehicle: currentVehicle?.maxParticipants,
                                }
                              )}
                            </p>
                            <button
                              type='button'
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  vehicleCount: suggestedVehicles,
                                }))
                              }
                              className='px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition'
                            >
                              {t(
                                'services.standard.atvExcurtionsForm.capacity.exceeded.button',
                                {
                                  suggested: suggestedVehicles,
                                }
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div className='p-3 bg-green-50 border border-green-200 rounded-lg'>
                      <div className='flex items-center gap-2 mb-2'>
                        <CheckCircle className='w-4 h-4 text-green-600' />
                        <span className='text-sm font-medium text-green-800'>
                          {t(
                            'services.standard.atvExcurtionsForm.capacity.perfect.title'
                          )}
                        </span>
                      </div>
                      <div className='text-xs text-green-700 space-y-1'>
                        <div>
                          <strong>
                            {t(
                              'services.standard.atvExcurtionsForm.capacity.perfect.capacity'
                            )}
                          </strong>{' '}
                          {formData.totalParticipants}/{maxCapacity}{' '}
                        </div>
                        <div>
                          <strong>
                            {t(
                              'services.standard.atvExcurtionsForm.capacity.perfect.vehicles'
                            )}
                          </strong>{' '}
                          {formData.vehicleCount} ×{' '}
                          {t(
                            `services.standard.atvExcurtionsForm.vehicleTypes.${formData.vehicleType}.name`
                          )}
                        </div>
                        <div>
                          <strong>
                            {t(
                              'services.standard.atvExcurtionsForm.capacity.perfect.cost'
                            )}
                          </strong>{' '}
                          {formData.totalParticipants} × $
                          {currentVehicle?.price || 0} = ${basePrice.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Additional Information */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2'>
                {t(
                  'services.standard.atvExcurtionsForm.sections.additionalInfo'
                )}
              </h3>

              <div>
                <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                  <Info
                    className={`w-4 h-4 mr-2 ${
                      isPremium ? 'text-purple-600' : 'text-green-600'
                    }`}
                  />
                  {t('services.standard.atvExcurtionsForm.fields.notes.label')}
                </label>
                <textarea
                  name='additionalNotes'
                  value={formData.additionalNotes}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 ${
                    isPremium ? 'focus:ring-purple-500' : 'focus:ring-green-500'
                  } bg-gray-50`}
                  placeholder={t(
                    'services.standard.atvExcurtionsForm.fields.notes.placeholder'
                  )}
                />
              </div>
            </div>

            {/* Safety Information */}
            <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
              <div className='flex items-start'>
                <AlertTriangle className='w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5' />
                <div>
                  <h4 className='font-medium text-red-800 mb-2'>
                    {t('services.standard.atvExcurtionsForm.safety.title')}
                  </h4>
                  <ul className='text-sm text-red-700 space-y-1'>
                    <li>
                      •{' '}
                      {t(
                        'services.standard.atvExcurtionsForm.safety.requirement1'
                      )}
                    </li>
                    <li>
                      •{' '}
                      {t(
                        'services.standard.atvExcurtionsForm.safety.requirement2'
                      )}
                    </li>
                    <li>
                      •{' '}
                      {t(
                        'services.standard.atvExcurtionsForm.safety.requirement3'
                      )}
                    </li>
                    <li>
                      •{' '}
                      {t(
                        'services.standard.atvExcurtionsForm.safety.requirement4'
                      )}
                    </li>
                    <li>
                      •{' '}
                      {t(
                        'services.standard.atvExcurtionsForm.safety.requirement5'
                      )}
                    </li>
                    <li>
                      •{' '}
                      {t(
                        'services.standard.atvExcurtionsForm.safety.requirement6'
                      )}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Error Display */}
            {errors.submit && (
              <div className='p-3 bg-red-50 border border-red-200 rounded-lg'>
                <p className='text-red-800 text-sm'>{errors.submit}</p>
              </div>
            )}
          </div>

          {/* ✅ Form Footer - ACTUALIZADO con desglose de tax */}
          <div className='bg-gray-900 text-white p-6 flex flex-col md:flex-row items-center  justify-between'>
            <div className='flex flex-col-2 items-center md:items-start mb-4 md:mb-0'>
              <div className='flex flex-col-2 gap-10'>
                {currentVehicle?.price && (
                  <div className='text-xs text-gray-400 mt-2 space-y-1'>
                    <div className='text-green-400 font-medium'>
                      {t(
                        `services.standard.atvExcurtionsForm.vehicleTypes.${formData.vehicleType}.name`
                      )}
                    </div>
                    <div>
                      {formData.totalParticipants}{' '}
                      {formData.totalParticipants === 1
                        ? t(
                            'services.standard.atvExcurtionsForm.capacity.perfect.person'
                          )
                        : t(
                            'services.standard.atvExcurtionsForm.capacity.perfect.people'
                          )}{' '}
                      × ${currentVehicle.price} = ${basePrice.toFixed(2)}
                    </div>
                    <div>
                      {t(
                        'services.standard.atvExcurtionsForm.pricing.transport'
                      )}
                      : ${transportCost.toFixed(2)}
                    </div>
                    {locationSurcharge > 0 && (
                      <div>
                        {t(
                          'services.standard.atvExcurtionsForm.pricing.locationSurcharge'
                        )}
                        : +${locationSurcharge.toFixed(2)}
                      </div>
                    )}

                    {/* ✅ DESGLOSE DE TAX */}
                    <div className='border-t border-gray-700 pt-1 mt-1'>
                      <div>Subtotal: ${priceWithTax.subtotal.toFixed(2)}</div>
                      <div className='text-yellow-400'>
                        {t('common.fee.creditcard')}
                        {''} ({TAX_RATE}%): $ {priceWithTax.tax.toFixed(2)}
                      </div>
                    </div>

                    {selectedLocation && (
                      <div className='text-green-400'>
                        {t(
                          'services.standard.atvExcurtionsForm.pricing.pickup'
                        )}
                        : {selectedLocation.name}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <span className='text-gray-400 text-sm uppercase tracking-wide'>
                  {t('services.standard.atvExcurtionsForm.pricing.totalPrice')}
                </span>
                <div className='flex items-center mt-1'>
                  <span className='text-3xl font-light'>
                    {currentVehicle?.price
                      ? `$${totalPrice.toFixed(2)}`
                      : t(
                          'services.standard.atvExcurtionsForm.buttons.contact'
                        )}
                  </span>
                  <span className='ml-2 text-sm bg-green-800 px-2 py-1 rounded'>
                    {formData.totalParticipants}{' '}
                    {formData.totalParticipants === 1
                      ? t(
                          'services.standard.atvExcurtionsForm.capacity.perfect.person'
                        )
                      : t(
                          'services.standard.atvExcurtionsForm.capacity.perfect.people'
                        )}
                  </span>
                </div>
              </div>
            </div>

            <div className='flex space-x-4'>
              <button
                type='button'
                onClick={onCancel}
                disabled={isSubmitting}
                className='px-5 py-3 border border-gray-700 rounded-lg text-gray-300 hover:text-white hover:border-gray-600 transition disabled:opacity-50'
              >
                {t('services.standard.atvExcurtionsForm.buttons.cancel')}
              </button>

              <button
                type='submit'
                disabled={isSubmitting || !currentVehicle?.price}
                className={`px-8 py-3 ${
                  isPremium
                    ? 'bg-purple-600 hover:bg-purple-500'
                    : 'bg-green-600 hover:bg-green-500'
                } text-white rounded-lg transition flex items-center disabled:opacity-50`}
              >
                <CreditCard className='h-4 w-4 mr-2' />
                {isSubmitting
                  ? t('services.standard.atvExcurtionsForm.buttons.booking')
                  : currentVehicle?.price
                  ? t('services.standard.atvExcurtionsForm.buttons.book')
                  : t('services.standard.atvExcurtionsForm.buttons.contact')}
              </button>
            </div>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default AtvRideForm;
