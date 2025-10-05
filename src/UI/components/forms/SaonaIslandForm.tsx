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
  // Edades
  FREE_AGE_LIMIT: 4, // 0-4 años gratis
  CHILD_AGE_LIMIT: 6, // 5-6 años 50% descuento
  ADULT_AGE_START: 7, // 7+ años precio completo
  MAX_AGE_LIMIT: 75,

  // Precios excursión
  BASE_PRICE_PER_PERSON: 75,
  FREE_PRICE: 0,

  // Transporte
  TRANSPORT_BASE: 60, // Base para todos

  // Tax
  TAX_RATE: 5, // 5%
} as const;

// ✅ SURCHARGES POR UBICACIÓN (sobre el base de $60)
const LOCATION_SURCHARGES = {
  'punta-cana-resorts': 0, // $60 + $0 = $60
  bavaro: 0, // $60 + $0 = $60
  'cap-cana': 15, // $60 + $15 = $75
  'uvero-alto': 15, // $60 + $15 = $75
  'puntacana-village': 10, // $60 + $10 = $70
} as const;

const SaonaIslandForm: React.FC<SaonaIslandFormProps> = ({
  service,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { setReservationData } = useReservation();
  const { handleClose } = useFormModal({ onCancel });

  const TOUR_INFO = {
    PICKUP_TIME: '7:00 AM - 7:45 AM',
    DURATION: '8-9 hours',
  };

  const [formData, setFormData] = useState<FormData>({
    tourDate: '',
    location: '',
    adultCount: 2,
    childCount: 0,
    children: [],
    specialRequests: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ HOOK PARA SCROLL A ERRORES
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

  const handleLocationSelect = useCallback(
    (locationId: string) => {
      updateFormField('location', locationId);
    },
    [updateFormField]
  );

  const totalParticipants = useMemo(() => {
    return formData.adultCount + formData.childCount;
  }, [formData.adultCount, formData.childCount]);

  useEffect(() => {
    const currentChildrenCount = formData.children.length;
    const newChildCount = formData.childCount;

    if (newChildCount > currentChildrenCount) {
      const newChildren = [...formData.children];
      for (let i = currentChildrenCount; i < newChildCount; i++) {
        const defaultAge = 8;
        const price = calculateChildPrice(defaultAge);
        newChildren.push({
          id: `child-${i + 1}`,
          age: defaultAge,
          hasCharge: defaultAge > PRICING_CONFIG.FREE_AGE_LIMIT,
          price,
        });
      }
      setFormData((prev) => ({ ...prev, children: newChildren }));
    } else if (newChildCount < currentChildrenCount) {
      setFormData((prev) => ({
        ...prev,
        children: prev.children.slice(0, newChildCount),
      }));
    }
  }, [formData.childCount]);

  // ✅ Cálculo de precio por niño según edad
  const calculateChildPrice = (age: number): number => {
    if (age <= PRICING_CONFIG.FREE_AGE_LIMIT) {
      return PRICING_CONFIG.FREE_PRICE; // 0-4 años: Gratis
    } else if (age <= PRICING_CONFIG.CHILD_AGE_LIMIT) {
      return PRICING_CONFIG.BASE_PRICE_PER_PERSON * 0.5; // 5-6 años: 50% ($37.50)
    } else {
      return PRICING_CONFIG.BASE_PRICE_PER_PERSON; // 7+ años: Precio completo ($75)
    }
  };

  // ✅ NUEVO: Cálculo simplificado de transporte (base + surcharge)
  const calculateTransportCost = (): number => {
    const base = PRICING_CONFIG.TRANSPORT_BASE;
    const surcharge =
      LOCATION_SURCHARGES[
        formData.location as keyof typeof LOCATION_SURCHARGES
      ] || 0;

    return base + surcharge;
  };

  // ✅ CÁLCULO DE PRECIO BASE (sin transporte)
  const basePrice = useMemo(() => {
    let total = 0;

    // Adultos
    total += formData.adultCount * PRICING_CONFIG.BASE_PRICE_PER_PERSON;

    // Niños según edad
    formData.children.forEach((child) => {
      total += calculateChildPrice(child.age);
    });

    return total;
  }, [formData.adultCount, formData.children]);

  // ✅ SUBTOTAL (base + transporte)
  const subtotal = useMemo(() => {
    const transportCost = formData.location ? calculateTransportCost() : 0;
    return basePrice + transportCost;
  }, [basePrice, formData.location]);

  // ✅ PRECIO CON TAX
  const priceWithTax = useMemo(() => {
    return calculatePriceWithTax(subtotal, PRICING_CONFIG.TAX_RATE);
  }, [subtotal]);

  const totalPrice = priceWithTax.total;

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

    if (!formData.location) {
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

    formData.children.forEach((child, index) => {
      if (child.age < 0 || child.age > 17) {
        newErrors[`child-${index}-age`] = t(
          'services.standard.saonaIslandForm.validation.childAgeRange'
        );
      }
    });

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      console.log('❌ SaonaForm - Validation errors:', validationErrors);
      // ✅ SCROLL AL PRIMER ERROR
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
      const locationSurcharge =
        LOCATION_SURCHARGES[
          formData.location as keyof typeof LOCATION_SURCHARGES
        ] || 0;

      const reservationData = {
        service: service,
        formData: {
          ...formData,
          serviceType: 'saona-island',
          totalPrice,
          pickupTime: TOUR_INFO.PICKUP_TIME,
          locationName,
          transportCost,
          locationSurcharge,
          basePrice,
          // ✅ AGREGAR info de tax
          subtotal: priceWithTax.subtotal,
          tax: priceWithTax.tax,
          taxRate: PRICING_CONFIG.TAX_RATE,
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
          pricing: {
            basePrice,
            transportCost,
            locationSurcharge,
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

  const handleChildAgeChange = (childId: string, age: number) => {
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
  };

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

  const TourRestrictionsSection = () => (
    <div className='bg-amber-50 border border-amber-200 rounded-lg p-4'>
      <div className='flex items-start'>
        <AlertTriangle className='w-5 h-5 text-amber-600 mr-3 flex-shrink-0 mt-0.5' />
        <div>
          <h4 className='font-medium text-amber-800 mb-2'>
            {t('services.standard.saonaIslandForm.sections.restrictions')}
          </h4>
          <ul className='text-sm text-amber-700 space-y-1'>
            {Array.from({ length: 6 }, (_, i) => (
              <li key={i}>
                •{' '}
                {t(
                  `services.standard.saonaIslandForm.restrictions.item${i + 1}`
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
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
          {/* Tour Date Section */}
          <div className='space-y-6'>
            <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2'>
              {t('services.standard.saonaIslandForm.sections.tourDate')}
            </h3>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {/* ✅ Date con REF */}
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
                  onChange={handleInputChange}
                  className={`w-full p-3 border ${
                    errors.tourDate ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-50`}
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
                      <strong>
                        {t(
                          'services.standard.saonaIslandForm.warnings.sameDayBooking'
                        )}
                      </strong>
                    </div>
                  </div>
                ) : !hasMinimum24Hours(formData.tourDate) ? (
                  <div className='p-3 bg-red-50 border border-red-200 rounded-lg flex items-start'>
                    <AlertTriangle className='w-4 h-4 text-red-600 mr-2 mt-0.5' />
                    <div className='text-sm text-red-800'>
                      <strong>
                        {t(
                          'services.standard.saonaIslandForm.warnings.advanceBooking'
                        )}
                      </strong>
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>

          {/* Location Section */}
          <div className='space-y-6'>
            <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2'>
              {t('services.standard.saonaIslandForm.sections.pickupLocation')}
            </h3>

            {/* ✅ Location con REF */}
            <div
              className='bg-blue-50 p-6 rounded-xl border border-blue-100 shadow-sm'
              ref={(el) => el && fieldRefs.current.set('location', el)}
            >
              <label className='flex items-center text-sm font-medium text-blue-800 mb-4'>
                <MapPin className='w-5 h-5 mr-2 text-blue-600' />
                {t('services.standard.saonaIslandForm.fields.location.label')} *
              </label>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {LOCATION_IDS.map((locationId) => {
                  const locationKey = kebabToCamel(locationId);
                  const surcharge = LOCATION_SURCHARGES[locationId];
                  const totalTransport =
                    PRICING_CONFIG.TRANSPORT_BASE + surcharge;

                  return (
                    <div
                      key={locationId}
                      className={`
                        border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md
                        ${
                          formData.location === locationId
                            ? 'border-blue-500 bg-white shadow-lg ring-2 ring-blue-200'
                            : 'border-blue-200 bg-white hover:border-blue-300'
                        }
                      `}
                      onClick={() => handleLocationSelect(locationId)}
                    >
                      <div className='flex items-start justify-between'>
                        <div className='flex items-center flex-1'>
                          <div
                            className={`
                              w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 transition-all flex-shrink-0
                              ${
                                formData.location === locationId
                                  ? 'border-blue-500 bg-blue-500'
                                  : 'border-blue-300'
                              }
                            `}
                          >
                            {formData.location === locationId && (
                              <CheckCircle className='w-4 h-4 text-white' />
                            )}
                          </div>
                          <div className='flex-1'>
                            <div className='flex items-center'>
                              <MapPin className='w-4 h-4 mr-1 text-blue-500' />
                              <span className='font-medium text-blue-900 text-sm'>
                                {t(
                                  `services.standard.saonaIslandForm.locations.${locationKey}.name`
                                )}
                              </span>
                            </div>
                            {/* ✅ Mostrar precio de transporte */}
                            <div className='flex items-center gap-1 mt-1'>
                              <Car className='w-3 h-3 text-blue-600' />
                              <span className='text-xs text-blue-700 font-medium'>
                                ${PRICING_CONFIG.TRANSPORT_BASE}
                              </span>
                              {surcharge > 0 && (
                                <>
                                  <span className='text-xs text-blue-600'>
                                    +
                                  </span>
                                  <span className='text-xs text-amber-700 font-medium'>
                                    ${surcharge}
                                  </span>
                                  <span className='text-xs text-blue-600'>
                                    =
                                  </span>
                                  <span className='text-xs text-blue-800 font-bold'>
                                    ${totalTransport}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {errors.location && (
                <p className='text-red-500 text-xs mt-3 flex items-center'>
                  <AlertTriangle className='w-3 h-3 mr-1' />
                  {errors.location}
                </p>
              )}
            </div>
          </div>

          {/* Participants Section */}
          <div className='space-y-6'>
            <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2'>
              {t('services.standard.saonaIslandForm.sections.participants')}
            </h3>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {/* ✅ Adults con REF */}
              <div ref={(el) => el && fieldRefs.current.set('adultCount', el)}>
                <Counter
                  label={t(
                    'services.standard.saonaIslandForm.fields.adults.label'
                  )}
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
                label={t(
                  'services.standard.saonaIslandForm.fields.children.label'
                )}
                value={formData.childCount}
                onIncrement={childCounter.increment}
                onDecrement={childCounter.decrement}
                icon={Baby}
                max={15}
              />
            </div>

            <div className='bg-green-50 p-4 rounded-lg border border-green-200'>
              <h4 className='font-medium text-green-800 mb-2'>
                {t('services.standard.saonaIslandForm.pricing.title')}
              </h4>
              <div className='text-sm text-green-700 space-y-1'>
                <div>
                  • {t('services.standard.saonaIslandForm.pricing.free')}
                </div>
                <div>
                  • {t('services.standard.saonaIslandForm.pricing.child')}
                </div>
                <div>
                  • {t('services.standard.saonaIslandForm.pricing.adult')}
                </div>
              </div>
            </div>

            {formData.childCount > 0 && (
              <div className='space-y-4'>
                <h4 className='font-medium text-gray-800'>
                  {t(
                    'services.standard.saonaIslandForm.fields.children.detailsTitle'
                  )}
                </h4>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {formData.children.map((child, index) => {
                    const price = calculateChildPrice(child.age);
                    let priceLabel = '';
                    let priceColor = '';

                    if (price === 0) {
                      priceLabel = t(
                        'services.standard.saonaIslandForm.pricing.priceLabels.free'
                      );
                      priceColor = 'bg-green-100 text-green-800';
                    } else if (child.age <= PRICING_CONFIG.CHILD_AGE_LIMIT) {
                      priceLabel = t(
                        'services.standard.saonaIslandForm.pricing.priceLabels.child'
                      );
                      priceColor = 'bg-orange-100 text-orange-800';
                    } else {
                      priceLabel = t(
                        'services.standard.saonaIslandForm.pricing.priceLabels.adult'
                      );
                      priceColor = 'bg-blue-100 text-blue-800';
                    }

                    return (
                      <div key={child.id} className='p-4 bg-gray-50 rounded-lg'>
                        <div className='flex items-center justify-between mb-2'>
                          <label className='text-sm font-medium text-gray-700'>
                            {t(
                              'services.standard.saonaIslandForm.fields.children.childLabel'
                            )}{' '}
                            {index + 1}{' '}
                            {t(
                              'services.standard.saonaIslandForm.fields.children.childAge'
                            )}
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
                                  ? t(
                                      'services.standard.saonaIslandForm.pricing.ageOptions.baby'
                                    )
                                  : `${age} ${t(
                                      'services.standard.saonaIslandForm.pricing.ageOptions.yearsOld'
                                    )}`}
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
          </div>

          {/* What's Included Section */}
          <div className='space-y-6'>
            <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2'>
              {t('services.standard.saonaIslandForm.sections.whatsIncluded')}
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
              {Array.from({ length: 9 }, (_, i) => (
                <div
                  key={i}
                  className='flex items-center text-sm text-gray-700'
                >
                  <Star className='w-4 h-4 text-yellow-500 mr-2 flex-shrink-0' />
                  {t(`services.standard.saonaIslandForm.included.item${i + 1}`)}
                </div>
              ))}
            </div>
          </div>

          {/* Special Requests Section */}
          <div className='space-y-6'>
            <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2'>
              {t('services.standard.saonaIslandForm.sections.additionalInfo')}
            </h3>

            <div>
              <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                <Info className='w-4 h-4 mr-2 text-blue-700' />
                {t(
                  'services.standard.saonaIslandForm.fields.specialRequests.label'
                )}
              </label>
              <textarea
                name='specialRequests'
                value={formData.specialRequests}
                onChange={handleInputChange}
                rows={3}
                className='w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-50'
                placeholder={t(
                  'services.standard.saonaIslandForm.fields.specialRequests.placeholder'
                )}
              />
            </div>
          </div>

          <TourRestrictionsSection />

          {errors.submit && (
            <div className='p-3 bg-red-50 border border-red-200 rounded-lg'>
              <p className='text-red-800 text-sm'>{errors.submit}</p>
            </div>
          )}
        </div>

        {/* ✅ FOOTER CON DESGLOSE DE TAX */}
        <div className='rounded-2xl bg-gray-900 text-white p-6 flex flex-col md:flex-row items-center justify-between'>
          <div className='flex flex-col items-center md:items-start mb-4 md:mb-0'>
            <span className='text-gray-400 text-sm uppercase tracking-wide'>
              {t('services.standard.saonaIslandForm.priceBreakdown.totalPrice')}
            </span>
            <div className='flex items-center mt-1'>
              <span className='text-3xl font-light'>
                ${totalPrice.toFixed(2)}
              </span>
              <span className='ml-2 text-sm bg-blue-800 px-2 py-1 rounded'>
                {totalParticipants}{' '}
                {totalParticipants === 1
                  ? t('services.standard.saonaIslandForm.priceBreakdown.person')
                  : t(
                      'services.standard.saonaIslandForm.priceBreakdown.people'
                    )}
              </span>
            </div>

            <div className='text-xs text-gray-400 mt-2 space-y-1'>
              <div className='text-blue-400 font-medium'>Tour Saona Island</div>
              <div>
                {t(
                  'services.standard.saonaIslandForm.priceBreakdown.perPerson'
                )}{' '}
                ${basePrice.toFixed(2)}
              </div>
              {formData.location && (
                <>
                  <div>
                    {t(
                      'services.standard.saonaIslandForm.priceBreakdown.transport'
                    )}{' '}
                    ${calculateTransportCost().toFixed(2)}
                  </div>
                  {LOCATION_SURCHARGES[
                    formData.location as keyof typeof LOCATION_SURCHARGES
                  ] > 0 && (
                    <div className='text-amber-400'>
                      Location surcharge: +$
                      {
                        LOCATION_SURCHARGES[
                          formData.location as keyof typeof LOCATION_SURCHARGES
                        ]
                      }
                    </div>
                  )}
                </>
              )}

              {/* ✅ DESGLOSE DE TAX */}
              <div className='border-t border-gray-700 pt-1 mt-1'>
                <div>Subtotal: ${priceWithTax.subtotal.toFixed(2)}</div>
                <div className='text-yellow-400'>
                  Tax ({PRICING_CONFIG.TAX_RATE}%): $
                  {priceWithTax.tax.toFixed(2)}
                </div>
              </div>

              {formData.location && (
                <div className='text-blue-400'>
                  {t(
                    'services.standard.saonaIslandForm.priceBreakdown.pickupFrom'
                  )}{' '}
                  {t(
                    `services.standard.saonaIslandForm.locations.${formData.location.replace(
                      /-/g,
                      ''
                    )}.name`
                  )}
                </div>
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
              {t('services.standard.saonaIslandForm.buttons.cancel')}
            </button>

            <button
              type='submit'
              disabled={isSubmitting || totalParticipants > 15}
              className='px-8 py-3 bg-blue-700 hover:bg-blue-600 text-white rounded-lg transition flex items-center disabled:opacity-50'
            >
              <Waves className='h-4 w-4 mr-2' />
              {isSubmitting
                ? t('services.standard.saonaIslandForm.buttons.booking')
                : t('services.standard.saonaIslandForm.buttons.book')}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default SaonaIslandForm;
