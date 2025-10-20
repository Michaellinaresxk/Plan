import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { useRouter } from 'next/navigation';
import { useReservation } from '@/context/BookingContext';
import { Service } from '@/types/type';
import {
  Calendar,
  MapPin,
  Users,
  Baby,
  Clock,
  AlertTriangle,
  Info,
  Waves,
  Star,
  CheckCircle,
  Car,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useFormModal } from '@/hooks/useFormModal';
import FormHeader from './FormHeader';
import { useScrollToError } from '@/hooks/useScrollToError';
import { calculatePriceWithTax } from '@/utils/priceCalculator';

interface ChildInfo {
  id: string;
  age: number;
  hasCharge: boolean;
  price: number;
}

interface FormData {
  tourDate: string;
  location: string;
  adultCount: number;
  childCount: number;
  children: ChildInfo[];
  specialRequests: string;
  transportType: '1-6' | '7-12' | null;
}

interface FormErrors {
  [key: string]: string;
}

interface SaonaIslandFormProps {
  service: Service;
  onSubmit?: (
    formData: FormData & { totalPrice: number; pickupTime: string }
  ) => void;
  onCancel: () => void;
}

const LOCATION_IDS = [
  'punta-cana-resorts',
  'bavaro',
  'cap-cana',
  'uvero-alto',
  'puntacana-village',
] as const;

const PRICING_CONFIG = {
  FREE_AGE_LIMIT: 4,
  CHILD_AGE_LIMIT: 6,
  BASE_PRICE_PER_PERSON: 70,
  FREE_PRICE: 0,
  TRANSPORT_1_6_PEOPLE: 140,
  TRANSPORT_7_12_PEOPLE: 180,
  TAX_RATE: 5,
} as const;

const TOUR_INFO = {
  PICKUP_TIME: '7:00 AM - 7:45 AM',
  DURATION: '8-9 hours',
};

const LOCATIONS = {
  'punta-cana-resorts': 'Punta Cana Resorts',
  bavaro: 'Bávaro',
  'cap-cana': 'Cap Cana',
  'uvero-alto': 'Uvero Alto',
  'puntacana-village': 'Puntacana Village',
};

const SaonaIslandForm: React.FC<SaonaIslandFormProps> = ({
  service,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { setReservationData } = useReservation();
  const { handleClose } = useFormModal({ onCancel });
  const [formData, setFormData] = useState<FormData>({
    tourDate: '',
    location: '',
    adultCount: 2,
    childCount: 0,
    children: [],
    specialRequests: '',
    transportType: null,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTransportOpen, setIsTransportOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);

  const { fieldRefs, scrollToFirstError } = useScrollToError(errors);

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

  const totalParticipants = useMemo(() => {
    return formData.adultCount + formData.childCount;
  }, [formData.adultCount, formData.childCount]);

  const calculateChildPrice = useCallback((age: number): number => {
    if (age <= PRICING_CONFIG.FREE_AGE_LIMIT) {
      return PRICING_CONFIG.FREE_PRICE;
    } else if (age <= PRICING_CONFIG.CHILD_AGE_LIMIT) {
      return PRICING_CONFIG.BASE_PRICE_PER_PERSON * 0.5;
    } else {
      return PRICING_CONFIG.BASE_PRICE_PER_PERSON;
    }
  }, []);

  const calculateTransportCost = useCallback((): number => {
    if (!formData.transportType) return 0;

    return formData.transportType === '1-6'
      ? PRICING_CONFIG.TRANSPORT_1_6_PEOPLE
      : PRICING_CONFIG.TRANSPORT_7_12_PEOPLE;
  }, [formData.transportType]);

  const basePrice = useMemo(() => {
    let total = formData.adultCount * PRICING_CONFIG.BASE_PRICE_PER_PERSON;

    formData.children.forEach((child) => {
      total += calculateChildPrice(child.age);
    });

    return total;
  }, [formData.adultCount, formData.children, calculateChildPrice]);

  const subtotal = useMemo(() => {
    const transportCost = calculateTransportCost();
    return basePrice + transportCost;
  }, [basePrice, calculateTransportCost]);

  const priceWithTax = useMemo(() => {
    return calculatePriceWithTax(subtotal, PRICING_CONFIG.TAX_RATE);
  }, [subtotal]);

  const totalPrice = priceWithTax.total;

  useEffect(() => {
    const currentChildrenCount = formData.children.length;
    const newChildCount = formData.childCount;

    if (newChildCount > currentChildrenCount) {
      const newChildren = [...formData.children];
      for (let i = currentChildrenCount; i < newChildCount; i++) {
        const defaultAge = 8;
        newChildren.push({
          id: `child-${i + 1}`,
          age: defaultAge,
          hasCharge: defaultAge > PRICING_CONFIG.FREE_AGE_LIMIT,
          price: calculateChildPrice(defaultAge),
        });
      }
      setFormData((prev) => ({ ...prev, children: newChildren }));
    } else if (newChildCount < currentChildrenCount) {
      setFormData((prev) => ({
        ...prev,
        children: prev.children.slice(0, newChildCount),
      }));
    }
  }, [formData.childCount, calculateChildPrice]);

  // Auto-limpiar transporte al cerrar acordeón
  useEffect(() => {
    if (!isTransportOpen && formData.transportType) {
      setFormData((prev) => ({
        ...prev,
        transportType: null,
        location: '',
      }));
      setIsLocationOpen(false);
    }
  }, [isTransportOpen, formData.transportType]);

  const handleChildAgeChange = useCallback(
    (childId: string, age: number) => {
      setFormData((prev) => ({
        ...prev,
        children: prev.children.map((child) =>
          child.id === childId
            ? {
                ...child,
                age,
                hasCharge: age > PRICING_CONFIG.FREE_AGE_LIMIT,
                price: calculateChildPrice(age),
              }
            : child
        ),
      }));
    },
    [calculateChildPrice]
  );

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

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.tourDate) {
      newErrors.tourDate = t(
        'services.standard.saonaIslandForm.fields.tourDate.error'
      );
    }

    if (formData.transportType && !formData.location) {
      newErrors.location = t(
        'services.standard.saonaIslandForm.fields.location.error'
      );
    }

    if (
      formData.tourDate &&
      !isSameDay(formData.tourDate) &&
      !hasMinimum24Hours(formData.tourDate)
    ) {
      newErrors.tourDate = t(
        'services.standard.saonaIslandForm.validation.advance24Hours'
      );
    }

    if (totalParticipants < 1) {
      newErrors.adultCount = t(
        'services.standard.saonaIslandForm.validation.minParticipants'
      );
    }

    if (totalParticipants > 15) {
      newErrors.adultCount = t(
        'services.standard.saonaIslandForm.validation.maxParticipants'
      );
    }

    if (formData.transportType === '1-6' && totalParticipants > 6) {
      newErrors.transportType = t(
        'services.standard.saonaIslandForm.validation.transport1to6Exceeded'
      );
    }

    if (formData.transportType === '7-12' && totalParticipants > 12) {
      newErrors.transportType = t(
        'services.standard.saonaIslandForm.validation.transport7to12Exceeded'
      );
    }

    formData.children.forEach((child, index) => {
      if (child.age < 0 || child.age > 17) {
        newErrors[`child-${index}-age`] = t(
          'services.standard.saonaIslandForm.validation.childAgeRange'
        );
      }
    });

    return newErrors;
  };

  const handleTransportTypeSelect = (type: '1-6' | '7-12') => {
    setFormData((prev) => ({
      ...prev,
      transportType: type,
    }));

    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.transportType;
      return newErrors;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      console.log('❌ SaonaForm - Validation errors:', validationErrors);
      scrollToFirstError();
      return;
    }

    setIsSubmitting(true);

    try {
      if (isSameDay(formData.tourDate)) {
        if (
          !window.confirm(
            t('services.standard.saonaIslandForm.warnings.sameDayConfirm')
          )
        ) {
          setIsSubmitting(false);
          return;
        }
      }

      const selectedDate = new Date(formData.tourDate);
      const bookingStartDate = new Date(selectedDate);
      bookingStartDate.setHours(7, 30, 0, 0);
      const bookingEndDate = new Date(selectedDate);
      bookingEndDate.setHours(18, 30, 0, 0);

      const locationKey = LOCATION_IDS.find((id) => id === formData.location);
      const locationName = locationKey
        ? t(
            `services.standard.saonaIslandForm.locations.${locationKey.replace(
              /-/g,
              ''
            )}.name`
          )
        : formData.location;

      const includes = Array.from({ length: 9 }, (_, i) =>
        t(`services.standard.saonaIslandForm.included.item${i + 1}`)
      );

      const restrictions = Array.from({ length: 6 }, (_, i) =>
        t(`services.standard.saonaIslandForm.restrictions.item${i + 1}`)
      );

      const transportCost = calculateTransportCost();

      const reservationData = {
        service: service,
        formData: {
          ...formData,
          serviceType: 'saona-island',
          totalPrice,
          pickupTime: TOUR_INFO.PICKUP_TIME,
          locationName,
          transportCost,
          basePrice,
          subtotal: priceWithTax.subtotal,
          tax: priceWithTax.tax,
          taxRate: PRICING_CONFIG.TAX_RATE,
          includeTransport: !!formData.transportType,
        },
        totalPrice,
        bookingDate: bookingStartDate,
        endDate: bookingEndDate,
        participants: {
          adults: formData.adultCount,
          children: formData.childCount,
          total: totalParticipants,
        },
        selectedItems: [
          {
            id: 'saona-island-tour',
            name: 'Saona Island Tour',
            quantity: 1,
            price: totalPrice,
            totalPrice,
            pickupTime: TOUR_INFO.PICKUP_TIME,
            duration: TOUR_INFO.DURATION,
          },
        ],
        clientInfo: undefined,
        saonaSpecifics: {
          pickupTime: TOUR_INFO.PICKUP_TIME,
          duration: TOUR_INFO.DURATION,
          adultCount: formData.adultCount,
          childCount: formData.childCount,
          children: formData.children,
          specialRequests: formData.specialRequests,
          includes,
          restrictions,
          location: formData.location,
          locationName,
          transportType: formData.transportType,
          pricing: {
            basePrice,
            transportCost,
            subtotal: priceWithTax.subtotal,
            tax: priceWithTax.tax,
            taxRate: PRICING_CONFIG.TAX_RATE,
            totalPrice,
          },
        },
      };

      console.log('🏝️ SaonaForm - Reservation data created:', reservationData);

      setReservationData(reservationData);

      if (onSubmit) {
        await onSubmit({
          ...formData,
          totalPrice,
          pickupTime: TOUR_INFO.PICKUP_TIME,
        });
      }

      router.push('/reservation-confirmation');
    } catch (error) {
      console.error('❌ SaonaForm - Error submitting form:', error);
      setErrors({
        submit: t('services.standard.saonaIslandForm.errors.submit'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      const { name, value } = e.target;
      updateFormField(name, value);
    },
    [updateFormField]
  );

  const createCounterHandler = (field: keyof FormData, min = 0, max = 15) => ({
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

  const adultCounter = createCounterHandler('adultCount', 1);
  const childCounter = createCounterHandler('childCount', 0);

  const Counter = ({
    label,
    value,
    onIncrement,
    onDecrement,
    icon: Icon,
    min = 0,
    max = 15,
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
          disabled={value >= max}
          className='px-4 py-2 bg-gray-100 hover:bg-gray-200 transition disabled:opacity-50'
        >
          +
        </button>
      </div>
      {value >= max && (
        <p className='text-xs text-amber-600 mt-1'>
          {t('services.standard.saonaIslandForm.warnings.maxParticipants')}
        </p>
      )}
    </div>
  );

  const kebabToCamel = (str: string): string => {
    return str.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
  };

  return (
    <form onSubmit={handleSubmit} className='w-full mx-auto overflow-hidden'>
      <div className='bg-white rounded-xl shadow-lg border border-gray-100'>
        <FormHeader
          title={t('services.standard.saonaIslandForm.header.title')}
          subtitle={t('services.standard.saonaIslandForm.header.subtitle')}
          icon={Waves}
          onCancel={handleClose}
          showCloseButton={true}
          gradientFrom='blue-500'
          gradientVia='cyan-700'
          gradientTo='blue-800'
        />

        <div className='p-8 space-y-8'>
          <section className='space-y-6'>
            <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2'>
              {t('services.standard.saonaIslandForm.sections.tourDate')}
            </h3>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div ref={(el) => el && fieldRefs.current.set('tourDate', el)}>
                <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                  <Calendar className='w-4 h-4 mr-2 text-blue-700' />
                  {t(
                    'services.standard.saonaIslandForm.fields.tourDate.label'
                  )}{' '}
                  *
                </label>
                <input
                  type='date'
                  name='tourDate'
                  value={formData.tourDate}
                  onClick={(e) => e.currentTarget.showPicker()}
                  onChange={handleInputChange}
                  className={`w-full p-3 border ${
                    errors.tourDate ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-blue-500 focus:border-blue-500`}
                  min={new Date().toISOString().split('T')[0]}
                />
                {errors.tourDate && (
                  <p className='text-red-500 text-xs mt-1'>{errors.tourDate}</p>
                )}
              </div>

              <div>
                <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                  <Clock className='w-4 h-4 mr-2 text-blue-700' />
                  {t(
                    'services.standard.saonaIslandForm.fields.pickupTime.label'
                  )}
                </label>
                <div className='w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600'>
                  {TOUR_INFO.PICKUP_TIME}{' '}
                  {t(
                    'services.standard.saonaIslandForm.fields.pickupTime.fixed'
                  )}
                </div>
                <p className='text-xs text-gray-500 mt-1'>
                  {t(
                    'services.standard.saonaIslandForm.fields.pickupTime.note'
                  )}
                </p>
              </div>
            </div>

            {formData.tourDate && (
              <div className='mt-4'>
                {isSameDay(formData.tourDate) ? (
                  <div className='p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start'>
                    <Info className='w-4 h-4 text-amber-600 mr-2 mt-0.5' />
                    <div className='text-sm text-amber-800'>
                      <strong>Same-day booking:</strong> Availability may be
                      limited
                    </div>
                  </div>
                ) : !hasMinimum24Hours(formData.tourDate) ? (
                  <div className='p-3 bg-red-50 border border-red-200 rounded-lg flex items-start'>
                    <AlertTriangle className='w-4 h-4 text-red-600 mr-2 mt-0.5' />
                    <div className='text-sm text-red-800'>
                      <strong>Advance booking required:</strong> Minimum 24
                      hours notice
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </section>

          <section className='space-y-6'>
            <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2'>
              Participants
            </h3>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <Counter
                  label='Adults (7+ years)'
                  value={formData.adultCount}
                  onIncrement={adultCounter.increment}
                  onDecrement={adultCounter.decrement}
                  icon={Users}
                  min={1}
                  max={15}
                />
                {errors.adultCount && (
                  <p className='text-red-500 text-xs mt-1'>
                    {errors.adultCount}
                  </p>
                )}
              </div>

              <Counter
                label='Children (0-17 years)'
                value={formData.childCount}
                onIncrement={childCounter.increment}
                onDecrement={childCounter.decrement}
                icon={Baby}
                max={15}
              />
            </div>

            <div className='bg-green-50 p-4 rounded-lg border border-green-200'>
              <h4 className='font-medium text-green-800 mb-2'>
                Pricing Information
              </h4>
              <div className='text-sm text-green-700 space-y-1'>
                <div>• Ages 0-4: Free</div>
                <div>• Ages 5-6: $35 (50% discount)</div>
                <div>• Ages 7+: $70 (full price)</div>
              </div>
            </div>

            {formData.childCount > 0 && (
              <div className='space-y-4'>
                <h4 className='font-medium text-gray-800'>Children Details</h4>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {formData.children.map((child, index) => {
                    const price = calculateChildPrice(child.age);
                    let priceLabel = '';
                    let priceColor = '';

                    if (price === 0) {
                      priceLabel = 'Free';
                      priceColor = 'bg-green-100 text-green-800';
                    } else if (child.age <= PRICING_CONFIG.CHILD_AGE_LIMIT) {
                      priceLabel = '50% Off';
                      priceColor = 'bg-orange-100 text-orange-800';
                    } else {
                      priceLabel = 'Full Price';
                      priceColor = 'bg-blue-100 text-blue-800';
                    }

                    return (
                      <div key={child.id} className='p-4 bg-gray-50 rounded-lg'>
                        <div className='flex items-center justify-between mb-2'>
                          <label className='text-sm font-medium text-gray-700'>
                            Child {index + 1} Age
                          </label>
                          <span
                            className={`text-xs px-2 py-1 rounded ${priceColor}`}
                          >
                            ${price.toFixed(2)} - {priceLabel}
                          </span>
                        </div>
                        <select
                          value={child.age}
                          onChange={(e) =>
                            handleChildAgeChange(
                              child.id,
                              parseInt(e.target.value)
                            )
                          }
                          className='w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500'
                        >
                          {Array.from({ length: 18 }, (_, i) => i).map(
                            (age) => (
                              <option key={age} value={age}>
                                {age === 0
                                  ? 'Less than 1 year'
                                  : `${age} years old`}
                              </option>
                            )
                          )}
                        </select>
                        {errors[`child-${index}-age`] && (
                          <p className='text-red-500 text-xs mt-1'>
                            {errors[`child-${index}-age`]}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </section>

          <section className='space-y-4'>
            <div className='border border-gray-200 rounded-lg overflow-hidden'>
              <button
                type='button'
                onClick={() => setIsTransportOpen(!isTransportOpen)}
                className='w-full p-4 bg-gray-50 hover:bg-gray-100 transition flex items-center justify-between'
              >
                <div className='flex items-center'>
                  <Car className='w-5 h-5 text-blue-700 mr-3' />
                  <div className='text-left'>
                    <h3 className='text-lg font-medium text-gray-800'>
                      Round-trip Transport (Optional)
                    </h3>
                    <p className='text-sm text-gray-600'>
                      {formData.transportType
                        ? `${
                            formData.transportType
                          } people - $${calculateTransportCost()}`
                        : 'Click to add transport service'}
                    </p>
                  </div>
                </div>
                {isTransportOpen ? (
                  <ChevronUp className='w-5 h-5 text-gray-600' />
                ) : (
                  <ChevronDown className='w-5 h-5 text-gray-600' />
                )}
              </button>

              {isTransportOpen && (
                <div className='p-6 space-y-6 bg-white'>
                  <div className='bg-blue-50 p-4 rounded-lg border border-blue-100'>
                    <div className='flex items-start'>
                      <Info className='w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5' />
                      <div>
                        <h4 className='font-medium text-blue-800 mb-1'>
                          About Transport Service
                        </h4>
                        <p className='text-sm text-blue-700'>
                          Round-trip transportation from your hotel/resort to
                          the departure point. Select the option that matches
                          your group size.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className='text-sm font-medium text-gray-700 mb-3 block'>
                      Select Transport Capacity
                    </label>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div
                        onClick={() => handleTransportTypeSelect('1-6')}
                        className={`
                          border-2 rounded-xl p-5 cursor-pointer transition-all
                          ${
                            formData.transportType === '1-6'
                              ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                              : 'border-gray-200 bg-white hover:border-blue-300'
                          }
                        `}
                      >
                        <div className='flex items-start justify-between mb-3'>
                          <div className='flex items-center'>
                            <div
                              className={`
                                w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3
                                ${
                                  formData.transportType === '1-6'
                                    ? 'border-blue-500 bg-blue-500'
                                    : 'border-gray-300'
                                }
                              `}
                            >
                              {formData.transportType === '1-6' && (
                                <CheckCircle className='w-3 h-3 text-white' />
                              )}
                            </div>
                            <div>
                              <p className='font-semibold text-gray-900'>
                                1-6 People
                              </p>
                              <p className='text-xs text-gray-500'>
                                Standard transport
                              </p>
                            </div>
                          </div>
                          <div className='text-right'>
                            <p className='text-xl font-bold text-blue-700'>
                              $140
                            </p>
                            <p className='text-xs text-gray-500'>round-trip</p>
                          </div>
                        </div>

                        {totalParticipants > 6 && (
                          <div className='mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-700 flex items-start'>
                            <AlertTriangle className='w-3 h-3 mr-1 mt-0.5 flex-shrink-0' />
                            <span>
                              You have {totalParticipants} participants.
                              Consider the 7-12 option.
                            </span>
                          </div>
                        )}
                      </div>

                      <div
                        onClick={() => handleTransportTypeSelect('7-12')}
                        className={`
                          border-2 rounded-xl p-5 cursor-pointer transition-all
                          ${
                            formData.transportType === '7-12'
                              ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                              : 'border-gray-200 bg-white hover:border-blue-300'
                          }
                        `}
                      >
                        <div className='flex items-start justify-between mb-3'>
                          <div className='flex items-center'>
                            <div
                              className={`
                                w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3
                                ${
                                  formData.transportType === '7-12'
                                    ? 'border-blue-500 bg-blue-500'
                                    : 'border-gray-300'
                                }
                              `}
                            >
                              {formData.transportType === '7-12' && (
                                <CheckCircle className='w-3 h-3 text-white' />
                              )}
                            </div>
                            <div>
                              <p className='font-semibold text-gray-900'>
                                7-12 People
                              </p>
                              <p className='text-xs text-gray-500'>
                                Large group transport
                              </p>
                            </div>
                          </div>
                          <div className='text-right'>
                            <p className='text-xl font-bold text-blue-700'>
                              $180
                            </p>
                            <p className='text-xs text-gray-500'>round-trip</p>
                          </div>
                        </div>

                        {totalParticipants > 12 && (
                          <div className='mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700 flex items-start'>
                            <AlertTriangle className='w-3 h-3 mr-1 mt-0.5 flex-shrink-0' />
                            <span>
                              You have {totalParticipants} participants. Maximum
                              12 for transport.
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {errors.transportType && (
                      <p className='text-red-500 text-xs mt-2 flex items-center'>
                        <AlertTriangle className='w-3 h-3 mr-1' />
                        {errors.transportType}
                      </p>
                    )}
                  </div>

                  {formData.transportType && (
                    <div>
                      <div className='border border-gray-200 rounded-lg overflow-hidden'>
                        <button
                          type='button'
                          onClick={() => setIsLocationOpen(!isLocationOpen)}
                          className='w-full p-4 bg-gray-50 hover:bg-gray-100 transition flex items-center justify-between'
                        >
                          <div className='flex items-center'>
                            <MapPin className='w-5 h-5 text-blue-700 mr-3' />
                            <div className='text-left'>
                              <h4 className='text-base font-medium text-gray-800'>
                                Pickup Location *
                              </h4>
                              <p className='text-sm text-gray-600'>
                                {formData.location
                                  ? LOCATIONS[
                                      formData.location as keyof typeof LOCATIONS
                                    ]
                                  : 'Select your pickup location'}
                              </p>
                            </div>
                          </div>
                          {isLocationOpen ? (
                            <ChevronUp className='w-5 h-5 text-gray-600' />
                          ) : (
                            <ChevronDown className='w-5 h-5 text-gray-600' />
                          )}
                        </button>

                        {isLocationOpen && (
                          <div className='p-4 bg-white'>
                            <div className='grid grid-cols-1 gap-3'>
                              {LOCATION_IDS.map((locationId) => (
                                <div
                                  key={locationId}
                                  className={`
                                    border-2 rounded-lg p-3 cursor-pointer transition-all
                                    ${
                                      formData.location === locationId
                                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                                        : 'border-gray-200 bg-white hover:border-blue-300'
                                    }
                                  `}
                                  onClick={() => {
                                    updateFormField('location', locationId);
                                    setIsLocationOpen(false);
                                  }}
                                >
                                  <div className='flex items-center'>
                                    <div
                                      className={`
                                        w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3
                                        ${
                                          formData.location === locationId
                                            ? 'border-blue-500 bg-blue-500'
                                            : 'border-gray-300'
                                        }
                                      `}
                                    >
                                      {formData.location === locationId && (
                                        <CheckCircle className='w-3 h-3 text-white' />
                                      )}
                                    </div>
                                    <span className='text-sm font-medium text-gray-800'>
                                      {LOCATIONS[locationId]}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {errors.location && (
                        <p className='text-red-500 text-xs mt-2 flex items-center'>
                          <AlertTriangle className='w-3 h-3 mr-1' />
                          {errors.location}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>

          <section className='space-y-6'>
            <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2'>
              What's Included
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
              {[
                'Professional bilingual guide',
                'Visit to natural pool',
                'Beach time at Saona Island',
                'Buffet lunch with drinks',
                'Open bar (rum, beer, soft drinks)',
                'Snorkeling equipment',
                'Life jackets',
                'Insurance',
              ].map((item, i) => (
                <div
                  key={i}
                  className='flex items-center text-sm text-gray-700'
                >
                  <Star className='w-4 h-4 text-yellow-500 mr-2 flex-shrink-0' />
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className='space-y-6'>
            <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2'>
              Additional Information
            </h3>

            <div>
              <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                <Info className='w-4 h-4 mr-2 text-blue-700' />
                Special Requests
              </label>
              <textarea
                name='specialRequests'
                value={formData.specialRequests}
                onChange={handleInputChange}
                rows={3}
                className='w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500'
                placeholder='Any dietary restrictions, accessibility needs, or special requests...'
              />
            </div>
          </section>

          <div className='bg-amber-50 border border-amber-200 rounded-lg p-4'>
            <div className='flex items-start'>
              <AlertTriangle className='w-5 h-5 text-amber-600 mr-3 flex-shrink-0 mt-0.5' />
              <div>
                <h4 className='font-medium text-amber-800 mb-2'>
                  Important Restrictions
                </h4>
                <ul className='text-sm text-amber-700 space-y-1'>
                  <li>• Not recommended for pregnant women</li>
                  <li>• Not suitable for people with back problems</li>
                  <li>• Not accessible for wheelchairs</li>
                  <li>• Minimum age: 0 years (infants allowed)</li>
                  <li>• Bring sunscreen, towel, and comfortable clothes</li>
                  <li>• Respect marine life and coral reefs</li>
                </ul>
              </div>
            </div>
          </div>

          {errors.submit && (
            <div className='p-3 bg-red-50 border border-red-200 rounded-lg'>
              <p className='text-red-800 text-sm'>{errors.submit}</p>
            </div>
          )}
        </div>

        <div className='rounded-2xl bg-gray-900 text-white p-6'>
          <div className='flex flex-col space-y-6'>
            {/* Price Breakdown */}
            <div className='flex flex-col'>
              <div className='text-xs text-gray-400 space-y-2'>
                <div className='flex items-center justify-between'>
                  <span className='text-blue-400 font-medium'>
                    {t('services.standard.saonaIslandForm.header.title')}
                  </span>
                </div>

                <div className='flex justify-between'>
                  <span>
                    {t(
                      'services.standard.saonaIslandForm.priceBreakdown.perPerson'
                    )}{' '}
                    ({totalParticipants}{' '}
                    {totalParticipants === 1
                      ? t(
                          'services.standard.saonaIslandForm.priceBreakdown.person'
                        )
                      : t(
                          'services.standard.saonaIslandForm.priceBreakdown.people'
                        )}
                    )
                  </span>
                  <span className='font-medium'>${basePrice.toFixed(2)}</span>
                </div>

                {formData.transportType && (
                  <div className='flex justify-between text-green-400'>
                    <span>
                      {t(
                        'services.standard.saonaIslandForm.priceBreakdown.transport'
                      )}{' '}
                      ({formData.transportType}{' '}
                      {t(
                        'services.standard.saonaIslandForm.priceBreakdown.people'
                      )}
                      )
                    </span>
                    <span className='font-medium'>
                      ${calculateTransportCost().toFixed(2)}
                    </span>
                  </div>
                )}

                <div className='border-t border-gray-700 pt-2 mt-2 space-y-1'>
                  <div className='flex justify-between'>
                    <span>Subtotal</span>
                    <span className='font-medium'>
                      ${priceWithTax.subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className='flex justify-between text-yellow-400'>
                    <span>
                      {t('common.fee.creditcard')} ({PRICING_CONFIG.TAX_RATE}%)
                    </span>
                    <span className='font-medium'>
                      ${priceWithTax.tax.toFixed(2)}
                    </span>
                  </div>
                </div>

                {formData.transportType && formData.location && (
                  <div className='text-blue-400 pt-2'>
                    📍{' '}
                    {t(
                      'services.standard.saonaIslandForm.priceBreakdown.pickupFrom'
                    )}{' '}
                    {t(
                      `services.standard.saonaIslandForm.locations.${kebabToCamel(
                        formData.location
                      )}.name`
                    )}
                  </div>
                )}
              </div>

              {/* Total Price */}
              <div className='border-t border-gray-700 mt-4 pt-4'>
                <div className='flex items-center justify-between'>
                  <span className='text-gray-400 text-sm uppercase tracking-wide'>
                    {t(
                      'services.standard.saonaIslandForm.priceBreakdown.totalPrice'
                    )}
                  </span>
                  <div className='flex items-center'>
                    <span className='text-3xl font-light'>
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className='flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-700'>
              <button
                type='button'
                onClick={onCancel}
                disabled={isSubmitting}
                className='flex-1 px-5 py-3 border border-gray-700 rounded-lg text-gray-300 hover:text-white hover:border-gray-600 transition disabled:opacity-50'
              >
                {t('services.standard.saonaIslandForm.buttons.cancel')}
              </button>

              <button
                type='submit'
                disabled={isSubmitting || totalParticipants > 15}
                className='flex-1 px-8 py-3 bg-blue-700 hover:bg-blue-600 text-white rounded-lg transition flex items-center justify-center disabled:opacity-50'
              >
                <Waves className='h-4 w-4 mr-2' />
                {isSubmitting
                  ? t('services.standard.saonaIslandForm.buttons.booking')
                  : t('services.standard.saonaIslandForm.buttons.book')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default SaonaIslandForm;
