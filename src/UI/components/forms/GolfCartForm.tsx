import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { useRouter } from 'next/navigation';
import { useReservation } from '@/context/BookingContext';
import { Service } from '@/types/type';
import {
  Calendar,
  AlertTriangle,
  Info,
  Car,
  Check,
  FileText,
  CheckCircle,
  Plus,
  Minus,
} from 'lucide-react';
import FormHeader from './FormHeader';
import { useFormModal } from '@/hooks/useFormModal';

// ✅ NUEVAS IMPORTACIONES
import { useScrollToError } from '@/hooks/useScrollToError';
import { calculatePriceWithTax } from '@/utils/priceCalculator';

interface GolfCartOption {
  id: string;
  seats: number;
  basePrice: number;
  image: string;
}

interface CartSelection {
  [cartId: string]: number;
}

interface FormData {
  selectedCarts: CartSelection;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  deliveryLocation: string;
  specificAddress: string;
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
  onSubmit?: (formData: any) => void;
  onCancel: () => void;
}

const GOLF_CART_OPTIONS: GolfCartOption[] = [
  {
    id: '4-seater',
    seats: 4,
    basePrice: 60,
    image:
      'https://res.cloudinary.com/ddg92xar5/image/upload/v1756102920/14_l4wro8.jpg',
  },
  {
    id: '6-seater',
    seats: 6,
    basePrice: 80,
    image:
      'https://res.cloudinary.com/ddg92xar5/image/upload/v1756103011/IMG_3217_ep7kyr.jpg',
  },
];

const GolfCartForm: React.FC<GolfCartFormProps> = ({
  service,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { setReservationData } = useReservation();
  const { handleClose } = useFormModal({ onCancel });

  // ✅ HOOK PARA SCROLL A ERRORES
  const { fieldRefs, scrollToFirstError } = useScrollToError({});

  // ✅ CONSTANTE DE TAX
  const TAX_RATE = 5; // 5%

  const initializeCartSelections = (): CartSelection => {
    const initialSelection: CartSelection = {};

    if (service?.selectedCartInfo?.id) {
      initialSelection[service.selectedCartInfo.id] = 1;
    }

    GOLF_CART_OPTIONS.forEach((cart) => {
      if (!initialSelection[cart.id]) {
        initialSelection[cart.id] = 0;
      }
    });

    return initialSelection;
  };

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

  const selectedCartsDetails = useMemo(() => {
    return GOLF_CART_OPTIONS.map((cart) => ({
      cart,
      quantity: formData.selectedCarts[cart.id] || 0,
      subtotal: (formData.selectedCarts[cart.id] || 0) * cart.basePrice,
    })).filter((item) => item.quantity > 0);
  }, [formData.selectedCarts]);

  const totalCarts = useMemo(() => {
    return Object.values(formData.selectedCarts).reduce(
      (sum, quantity) => sum + quantity,
      0
    );
  }, [formData.selectedCarts]);

  const rentalDays = useMemo(() => {
    if (!formData.startDate || !formData.endDate) return 1;

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return Math.max(1, diffDays);
  }, [formData.startDate, formData.endDate]);

  // ✅ CÁLCULO DE PRECIO CON TAX
  const priceWithTax = useMemo(() => {
    const baseTotal = selectedCartsDetails.reduce(
      (sum, item) => sum + item.subtotal,
      0
    );
    const subtotal = baseTotal * rentalDays;
    return calculatePriceWithTax(subtotal, TAX_RATE);
  }, [selectedCartsDetails, rentalDays]);

  // ✅ Mantener calculateTotalPrice para compatibilidad
  const calculateTotalPrice = priceWithTax.total;

  const handleCartQuantityChange = (cartId: string, newQuantity: number) => {
    const clampedQuantity = Math.max(0, Math.min(10, newQuantity));

    setFormData((prev) => ({
      ...prev,
      selectedCarts: {
        ...prev.selectedCarts,
        [cartId]: clampedQuantity,
      },
    }));

    if (clampedQuantity > 0 && errors.selectedCarts) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.selectedCarts;
        return newErrors;
      });
    }
  };

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

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (totalCarts === 0) {
      newErrors.selectedCarts = t(
        'services.standard.golfCartForm.validation.noCartsSelected'
      );
    }

    if (!formData.startDate) {
      newErrors.startDate = t(
        'services.standard.golfCartForm.fields.startDate.required'
      );
    }

    if (!formData.endDate) {
      newErrors.endDate = t(
        'services.standard.golfCartForm.fields.returnDate.required'
      );
    }

    if (!formData.deliveryLocation) {
      newErrors.deliveryLocation = t(
        'services.standard.golfCartForm.fields.deliveryLocation.required'
      );
    }

    if (
      formData.deliveryLocation === 'other' &&
      !formData.specificAddress.trim()
    ) {
      newErrors.specificAddress = t(
        'services.standard.golfCartForm.fields.specificAddress.required'
      );
    }

    if (
      formData.startDate &&
      !isSameDay(formData.startDate) &&
      !hasMinimum24Hours(formData.startDate)
    ) {
      newErrors.startDate = t(
        'services.standard.golfCartForm.validation.advance24Hours'
      );
    }

    if (!isEndDateValid()) {
      newErrors.endDate = t(
        'services.standard.golfCartForm.validation.endDateInvalid'
      );
    }

    if (!formData.driverLicense) {
      newErrors.driverLicense = t(
        'services.standard.golfCartForm.validation.driverLicenseRequired'
      );
    }

    if (!formData.ageConfirmation) {
      newErrors.ageConfirmation = t(
        'services.standard.golfCartForm.validation.ageRequired'
      );
    }

    if (!formData.termsAccepted) {
      newErrors.termsAccepted = t(
        'services.standard.golfCartForm.validation.termsRequired'
      );
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      console.log('❌ GolfCartForm - Validation errors:', validationErrors);
      // ✅ SCROLL AL PRIMER ERROR
      scrollToFirstError();
      return;
    }

    setIsSubmitting(true);

    try {
      if (isSameDay(formData.startDate)) {
        if (
          !window.confirm(
            t('services.standard.golfCartForm.warnings.sameDayConfirm')
          )
        ) {
          setIsSubmitting(false);
          return;
        }
      }

      const startDate = new Date(formData.startDate);
      const [startHours, startMinutes] = formData.startTime
        .split(':')
        .map(Number);
      startDate.setHours(startHours, startMinutes, 0, 0);

      const endDate = new Date(formData.endDate);
      const [endHours, endMinutes] = formData.endTime.split(':').map(Number);
      endDate.setHours(endHours, endMinutes, 0, 0);

      const selectedItems = selectedCartsDetails.map((item) => {
        const cartKey = item.cart.id === '4-seater' ? '4seater' : '6seater';
        return {
          id: `golf-cart-${item.cart.id}`,
          name: `${t(
            `services.standard.golfCartForm.carts.${cartKey}.name`
          )} (x${item.quantity})`,
          quantity: item.quantity,
          price: item.cart.basePrice,
          totalPrice: item.subtotal * rentalDays,
          duration: `${rentalDays} ${
            rentalDays > 1
              ? t('services.standard.golfCartForm.pricing.nights')
              : t('services.standard.golfCartForm.pricing.night')
          }`,
        };
      });

      const reservationData = {
        service: service,
        formData: {
          ...formData,
          serviceType: 'golf-cart-rental',
          totalPrice: calculateTotalPrice,
          // ✅ AGREGAR info de tax
          subtotal: priceWithTax.subtotal,
          tax: priceWithTax.tax,
          taxRate: TAX_RATE,
          selectedCartsDetails,
          rentalDays: rentalDays,
          totalCarts,
        },
        totalPrice: calculateTotalPrice,
        bookingDate: startDate,
        endDate: endDate,
        participants: {
          adults: 1,
          children: 0,
          total: 1,
        },
        selectedItems,
        clientInfo: undefined,
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
          driverLicense: formData.driverLicense,
          ageConfirmation: formData.ageConfirmation,
          termsAccepted: formData.termsAccepted,
          pricing: {
            baseTotal: priceWithTax.subtotal,
            subtotal: priceWithTax.subtotal,
            tax: priceWithTax.tax,
            taxRate: TAX_RATE,
            totalPrice: calculateTotalPrice,
          },
        },
      };

      console.log(
        '🚗 GolfCartForm - Reservation data created:',
        reservationData
      );

      setReservationData(reservationData);

      if (onSubmit) {
        await onSubmit({
          ...formData,
          totalPrice: calculateTotalPrice,
          selectedCartsDetails,
          rentalDays: rentalDays,
          totalCarts,
        });
      }

      router.push('/reservation-confirmation');
    } catch (error) {
      console.error('❌ GolfCartForm - Error submitting form:', error);
      setErrors({
        submit: t('services.standard.golfCartForm.errors.submit'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

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

  const GolfCartSelection = () => (
    <div
      className='space-y-6'
      ref={(el) => el && fieldRefs.current.set('selectedCarts', el)}
    >
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {GOLF_CART_OPTIONS.map((cart) => {
          const quantity = formData.selectedCarts[cart.id] || 0;
          const isSelected = quantity > 0;
          const cartKey = cart.id === '4-seater' ? '4seater' : '6seater';

          return (
            <div
              key={cart.id}
              className={`relative border-2 rounded-2xl overflow-hidden transition-all duration-300 ${
                isSelected
                  ? 'border-blue-500 shadow-2xl ring-4 ring-blue-200'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-xl'
              }`}
            >
              <div className='relative h-48 overflow-hidden'>
                <img
                  src={cart.image}
                  alt={t(
                    `services.standard.golfCartForm.carts.${cartKey}.name`
                  )}
                  className='w-full h-full object-cover transition-transform duration-300 hover:scale-105'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent' />

                {isSelected && (
                  <div className='absolute top-4 left-4 bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold'>
                    {quantity}
                  </div>
                )}

                <div className='absolute bottom-4 left-4 text-white'>
                  <div className='text-2xl font-bold'>${cart.basePrice}</div>
                  <div className='text-sm opacity-90'>
                    {t('services.standard.golfCartForm.carts.perNight')}
                  </div>
                </div>
              </div>

              <div className='p-6'>
                <div className='flex items-center justify-between mb-3'>
                  <h4 className='text-xl font-bold text-gray-800 flex items-center gap-2'>
                    {/* <Car className='w-6 h-6 text-blue-600' /> */}
                    {t(`services.standard.golfCartForm.carts.${cartKey}.name`)}
                  </h4>
                </div>

                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium text-gray-700'>
                    {t('services.standard.golfCartForm.carts.quantity')}
                  </span>
                  <QuantityInput cartId={cart.id} currentQuantity={quantity} />
                </div>

                {isSelected && (
                  <div className='mt-3 pt-3 border-t border-gray-200'>
                    <div className='flex justify-between items-center text-sm'>
                      <span className='text-gray-600'>
                        {t('services.standard.golfCartForm.carts.subtotal')}
                      </span>
                      <span className='font-bold text-gray-800'>
                        ${cart.basePrice * quantity}/
                        {t('services.standard.golfCartForm.pricing.night')}
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

  const WhatToExpectSection = () => (
    <div className='bg-blue-50 border border-blue-200 rounded-lg p-6'>
      <div className='flex items-start'>
        <Info className='w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5' />
        <div className='w-full'>
          <h4 className='font-medium text-blue-800 mb-3'>
            {t('services.standard.golfCartForm.whatToExpect.title')}
          </h4>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className='flex items-start text-sm text-blue-700'>
                <span className='bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0 mt-0.5'>
                  {num}
                </span>
                <span>
                  {t(`services.standard.golfCartForm.whatToExpect.step${num}`)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const RequirementsSection = () => (
    <div className='space-y-4'>
      <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2'>
        {t('services.standard.golfCartForm.sections.requirementsDisclaimer')}
      </h3>

      <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
        <div className='flex items-start'>
          <FileText className='w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5' />
          <div>
            <h4 className='font-medium text-blue-800 mb-2'>
              {t('services.standard.golfCartForm.requirements.title')}
            </h4>
            <ul className='text-sm text-blue-700 space-y-1'>
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <li key={num}>
                  •{' '}
                  {t(
                    `services.standard.golfCartForm.requirements.requirement${num}`
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className='bg-amber-50 border border-amber-200 rounded-lg p-4'>
        <div className='flex items-start'>
          <AlertTriangle className='w-5 h-5 text-amber-600 mr-3 flex-shrink-0 mt-0.5' />
          <div>
            <h4 className='font-medium text-amber-800 mb-2'>
              {t('services.standard.golfCartForm.disclaimer.title')}
            </h4>
            <p className='text-sm text-amber-700'>
              <strong>
                {
                  t('services.standard.golfCartForm.disclaimer.text').split(
                    '.'
                  )[0]
                }
                .
              </strong>{' '}
              {t('services.standard.golfCartForm.disclaimer.text')
                .split('.')
                .slice(1)
                .join('.')}
            </p>
          </div>
        </div>
      </div>

      <div className='px-2 space-y-3 mt-10 mb-10'>
        {/* ✅ Checkboxes con REF */}
        <div
          className='flex items-start'
          ref={(el) => el && fieldRefs.current.set('driverLicense', el)}
        >
          <input
            type='checkbox'
            id='driverLicense'
            name='driverLicense'
            checked={formData.driverLicense}
            onChange={handleInputChange}
            className='mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
          />
          <label htmlFor='driverLicense' className='ml-2 text-sm text-gray-700'>
            {t('services.standard.golfCartForm.confirmations.driverLicense')}
          </label>
        </div>
        {errors.driverLicense && (
          <p className='text-red-500 text-xs ml-6'>{errors.driverLicense}</p>
        )}

        <div
          className='flex items-start'
          ref={(el) => el && fieldRefs.current.set('ageConfirmation', el)}
        >
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
            {t('services.standard.golfCartForm.confirmations.ageConfirmation')}
          </label>
        </div>
        {errors.ageConfirmation && (
          <p className='text-red-500 text-xs ml-6'>{errors.ageConfirmation}</p>
        )}

        <div
          className='flex items-start'
          ref={(el) => el && fieldRefs.current.set('termsAccepted', el)}
        >
          <input
            type='checkbox'
            id='termsAccepted'
            name='termsAccepted'
            checked={formData.termsAccepted}
            onChange={handleInputChange}
            className='mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
          />
          <label htmlFor='termsAccepted' className='ml-2 text-sm text-gray-700'>
            {t('services.standard.golfCartForm.confirmations.termsAccepted')}
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
        <FormHeader
          title={t('services.standard.golfCartForm.header.title')}
          subtitle={t('services.standard.golfCartForm.header.subtitle')}
          icon={Car}
          onCancel={handleClose}
          showCloseButton={true}
          gradientFrom='blue-500'
          gradientVia='green-700'
          gradientTo='blue-800'
        />

        <div className='mt-10 p-2 space-y-8'>
          <div className='space-y-6'>
            <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2'>
              {t('services.standard.golfCartForm.sections.cartSelection')}
            </h3>
            <GolfCartSelection />
          </div>

          <div className='space-y-6'>
            <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2'>
              {t('services.standard.golfCartForm.sections.rentalPeriod')}
            </h3>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {/* ✅ Start Date con REF */}
              <div
                className='space-y-4'
                ref={(el) => el && fieldRefs.current.set('startDate', el)}
              >
                <div>
                  <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                    <Calendar className='w-4 h-4 mr-2 text-blue-700' />
                    {t(
                      'services.standard.golfCartForm.fields.startDate.label'
                    )}{' '}
                    *
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

              {/* ✅ End Date con REF */}
              <div
                className='space-y-4'
                ref={(el) => el && fieldRefs.current.set('endDate', el)}
              >
                <div>
                  <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                    <Calendar className='w-4 h-4 mr-2 text-blue-700' />
                    {t(
                      'services.standard.golfCartForm.fields.returnDate.label'
                    )}{' '}
                    *
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

            {formData.startDate && (
              <div className='mt-4'>
                {isSameDay(formData.startDate) ? (
                  <div className='p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start'>
                    <Info className='w-4 h-4 text-amber-600 mr-2 mt-0.5' />
                    <div className='text-sm text-amber-800'>
                      <strong>
                        {t(
                          'services.standard.golfCartForm.warnings.sameDayBooking'
                        )}
                      </strong>
                    </div>
                  </div>
                ) : !hasMinimum24Hours(formData.startDate) ? (
                  <div className='p-3 bg-red-50 border border-red-200 rounded-lg flex items-start'>
                    <AlertTriangle className='w-4 h-4 text-red-600 mr-2 mt-0.5' />
                    <div className='text-sm text-red-800'>
                      <strong>
                        {t(
                          'services.standard.golfCartForm.warnings.advanceBooking'
                        )}
                      </strong>
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>

          <div className='space-y-6'>
            <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2'>
              {t('services.standard.golfCartForm.sections.whatsIncluded')}
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
              {[1, 2, 3, 4].map((num) => (
                <div
                  key={num}
                  className='flex items-center text-sm text-gray-700'
                >
                  <CheckCircle className='w-4 h-4 text-green-500 mr-2 flex-shrink-0' />
                  {t(`services.standard.golfCartForm.included.feature${num}`)}
                </div>
              ))}
            </div>
          </div>

          <div className='space-y-6'>
            <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2'>
              {t('services.standard.golfCartForm.sections.additionalInfo')}
            </h3>

            <div>
              <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                <Info className='w-4 h-4 mr-2 text-blue-700' />
                {t(
                  'services.standard.golfCartForm.fields.specialRequests.label'
                )}
              </label>
              <textarea
                name='specialRequests'
                value={formData.specialRequests}
                onChange={handleInputChange}
                rows={3}
                className='w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-50'
                placeholder={t(
                  'services.standard.golfCartForm.fields.specialRequests.placeholder'
                )}
              />
            </div>
          </div>

          <RequirementsSection />

          {errors.submit && (
            <div className='p-3 bg-red-50 border border-red-200 rounded-lg'>
              <p className='text-red-800 text-sm'>{errors.submit}</p>
            </div>
          )}
        </div>

        {/* ✅ Footer ACTUALIZADO con desglose de tax */}
        <div className='rounded-2xl bg-gray-900 text-white p-6 flex flex-col md:flex-row items-center justify-between'>
          <div className='flex flex-col items-center md:items-start mb-4 md:mb-0'>
            <span className='text-gray-400 text-sm uppercase tracking-wide'>
              {t('services.standard.golfCartForm.pricing.totalPrice')}
            </span>
            <div className='flex items-center mt-1'>
              <span className='text-3xl font-light'>
                ${calculateTotalPrice.toFixed(2)}
              </span>
              <span className='ml-2 text-sm bg-blue-800 px-2 py-1 rounded'>
                {rentalDays}{' '}
                {rentalDays > 1
                  ? t('services.standard.golfCartForm.pricing.nights')
                  : t('services.standard.golfCartForm.pricing.night')}
              </span>
            </div>

            <div className='text-xs text-gray-400 mt-2 space-y-1'>
              {totalCarts > 0 && (
                <>
                  <div className='text-blue-400 font-medium'>
                    {totalCarts}{' '}
                    {totalCarts > 1
                      ? t(
                          'services.standard.golfCartForm.pricing.cartsSelected'
                        )
                      : t(
                          'services.standard.golfCartForm.pricing.cartSelected'
                        )}
                  </div>
                  {selectedCartsDetails.map((item) => {
                    const cartKey =
                      item.cart.id === '4-seater' ? '4seater' : '6seater';
                    return (
                      <div key={item.cart.id}>
                        {item.quantity}x{' '}
                        {t(
                          `services.standard.golfCartForm.carts.${cartKey}.name`
                        )}
                        : ${item.cart.basePrice}/
                        {t('services.standard.golfCartForm.pricing.night')} ×{' '}
                        {rentalDays} = ${item.subtotal * rentalDays}
                      </div>
                    );
                  })}

                  {/* ✅ DESGLOSE DE TAX */}
                  <div className='border-t border-gray-700 pt-1 mt-1'>
                    <div>Subtotal: ${priceWithTax.subtotal.toFixed(2)}</div>
                    <div className='text-yellow-400'>
                      {t('common.fee.creditcard')}({TAX_RATE}%): $
                      {priceWithTax.tax.toFixed(2)}
                    </div>
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
              {t('services.standard.golfCartForm.buttons.cancel')}
            </button>

            <button
              type='submit'
              disabled={isSubmitting || totalCarts === 0}
              className='px-8 py-3 bg-blue-700 hover:bg-blue-600 text-white rounded-lg transition flex items-center disabled:opacity-50'
            >
              <Car className='h-4 w-4 mr-2' />
              {isSubmitting
                ? t('services.standard.golfCartForm.buttons.booking')
                : `${t('services.standard.golfCartForm.buttons.book')} ${
                    totalCarts || 0
                  } ${
                    totalCarts !== 1
                      ? t('services.standard.golfCartForm.buttons.carts')
                      : t('services.standard.golfCartForm.buttons.cart')
                  }`}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default GolfCartForm;
