'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ArrowLeft, ArrowRight } from 'lucide-react';
import { differenceInDays } from 'date-fns';
import { useTranslation } from '@/lib/i18n/client';
import { useForm, FormProvider } from 'react-hook-form';
import { BookingModalProps } from '@/constants/formFields';
import DynamicFormField from '../forms/DynamicFormField';
import BookingSummary from '../shared/BookingSummary';
import { getServiceFormConfig } from '@/constants/getServiceFormConfig';

const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  service,
}) => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const methods = useForm();

  // Reset form when modal opens or service changes
  useEffect(() => {
    if (isOpen && service) {
      methods.reset();
      setCurrentStep(0);
    }
  }, [isOpen, service, methods]);

  if (!service) return null;

  // Get the form configuration based on the service type
  const formConfig = getServiceFormConfig(service);

  // Check if we have a configuration for this service
  if (!formConfig) {
    console.error(`No form configuration found for service: ${service.id}`);
    return null;
  }

  const isPremium = service.packageType.includes('premium');
  const primaryColor = isPremium ? 'amber' : 'blue';

  const handleSubmit = methods.handleSubmit((data) => {
    onConfirm(service, data);
  });

  const nextStep = () => {
    const fieldsInCurrentStep = formConfig.steps[currentStep].fields.map(
      (field) => field.id
    );

    // Validate only the fields in the current step
    methods.trigger(fieldsInCurrentStep).then((isValid) => {
      if (isValid) {
        if (currentStep < formConfig.steps.length - 1) {
          setCurrentStep((prev) => prev + 1);
        } else {
          handleSubmit();
        }
      }
    });
  };

  const prevStep = () => {
    setCurrentStep((curr) => Math.max(0, curr - 1));
  };

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: 'spring', damping: 25, stiffness: 500 },
    },
    exit: {
      opacity: 0,
      y: 20,
      scale: 0.98,
      transition: { duration: 0.2 },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
  };

  // Calculate total price based on form data
  const calculateTotalPrice = () => {
    if (!service) return 0;

    const formData = methods.getValues();
    const basePrice = service.price;

    // Handle different pricing logic based on service type
    if (service.id === 'transport') {
      // Example: Additional fee for car seats
      const carSeats = formData.carSeats || 0;
      return basePrice + carSeats * 10; // $10 per car seat
    } else if (['golf-cart-rentals', 'bike-rentals'].includes(service.id)) {
      // Example: Day-based pricing for rentals
      const days = formData.dateRange
        ? differenceInDays(
            new Date(formData.dateRange.to),
            new Date(formData.dateRange.from)
          ) + 1
        : 1;
      const guests = formData.guests || 1;
      return basePrice * days * guests;
    } else {
      // Default pricing
      const guests = formData.guests || 1;
      return basePrice * guests;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className='fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4 md:p-6'>
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial='hidden'
            animate='visible'
            exit='exit'
            className='fixed inset-0 bg-black/60 backdrop-blur-sm'
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            variants={modalVariants}
            initial='hidden'
            animate='visible'
            exit='exit'
            className={`relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto overflow-hidden`}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className='absolute right-4 top-4 z-10 p-1.5 rounded-full bg-white/80 hover:bg-white shadow-md text-gray-700 hover:text-gray-900 transition-all duration-200'
              aria-label='Close modal'
            >
              <X size={18} />
            </button>

            {/* Header with service info */}
            <div
              className={`relative px-6 py-8 ${
                isPremium
                  ? 'bg-gradient-to-r from-amber-500 to-amber-400'
                  : 'bg-gradient-to-r from-blue-600 to-blue-500'
              } text-white`}
            >
              <h3 className='text-2xl font-bold mb-2'>{service.name}</h3>
              <div className='flex items-center space-x-3'>
                <div className='font-semibold text-white/90 flex items-center'>
                  <span className='text-lg'>${service.price}</span>
                  <span className='text-white/80 text-sm ml-1'>
                    {service.duration > 0
                      ? `/ ${service.duration} ${
                          service.duration === 1
                            ? t('services.hours.one', { fallback: 'hour' })
                            : t('services.hours.multiple', {
                                fallback: 'hours',
                              })
                        }`
                      : ''}
                  </span>
                </div>
              </div>

              {/* Step progress indicator */}
              <div className='absolute bottom-0 left-0 right-0 h-1 bg-white/20'>
                <div
                  className={`h-full transition-all duration-500 ${
                    isPremium ? 'bg-amber-300' : 'bg-blue-300'
                  }`}
                  style={{
                    width: `${
                      ((currentStep + 1) / formConfig.steps.length) * 100
                    }%`,
                  }}
                />
              </div>
            </div>

            {/* Steps navigation */}
            <div className='flex border-b overflow-x-auto hide-scrollbar'>
              {formConfig.steps.map((step, index) => (
                <button
                  key={step.id}
                  className={`flex-1 text-sm whitespace-nowrap font-medium py-3 px-4 flex justify-center items-center relative ${
                    currentStep === index
                      ? isPremium
                        ? 'text-amber-600 border-b-2 border-amber-500'
                        : 'text-blue-600 border-b-2 border-blue-500'
                      : currentStep > index
                      ? 'text-gray-400'
                      : 'text-gray-500'
                  }`}
                  onClick={() => {
                    // Only allow going back or to completed steps
                    if (index <= currentStep) {
                      setCurrentStep(index);
                    }
                  }}
                >
                  <span>
                    {index + 1}. {step.title}
                  </span>
                </button>
              ))}
            </div>

            {/* Form content with animations */}
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit} className='p-6 overflow-hidden'>
                <AnimatePresence mode='wait'>
                  <motion.div
                    key={`step-${currentStep}`}
                    variants={contentVariants}
                    initial='hidden'
                    animate='visible'
                    exit='exit'
                    className='space-y-5'
                  >
                    <h4 className='text-base font-medium text-gray-800 mb-4'>
                      {formConfig.steps[currentStep].title}
                    </h4>

                    {/* Render fields for current step */}
                    {formConfig.steps[currentStep].fields.map((field) => (
                      <DynamicFormField
                        key={field.id}
                        field={field}
                        isPremium={isPremium}
                        formMethods={methods}
                      />
                    ))}

                    {/* Show summary on last step */}
                    {currentStep === formConfig.steps.length - 1 && (
                      <BookingSummary
                        service={service}
                        formData={methods.getValues()}
                        totalPrice={calculateTotalPrice()}
                        isPremium={isPremium}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Navigation buttons */}
                <div className='flex space-x-3 mt-8'>
                  {currentStep > 0 && (
                    <button
                      type='button'
                      onClick={prevStep}
                      className='flex-1 py-3 px-4 rounded-lg font-medium border hover:bg-gray-50 transition-colors flex justify-center items-center'
                    >
                      <ArrowLeft size={16} className='mr-1.5' />
                      {t('modal.back', { fallback: 'Back' })}
                    </button>
                  )}

                  <button
                    type='button'
                    onClick={nextStep}
                    className={`
                      flex-1 py-3 px-4 rounded-lg font-medium text-white 
                      flex justify-center items-center transition-colors
                      transform active:scale-[0.98]
                      ${
                        isPremium
                          ? 'bg-amber-500 hover:bg-amber-600'
                          : 'bg-blue-500 hover:bg-blue-600'
                      }
                    `}
                  >
                    {currentStep === formConfig.steps.length - 1 ? (
                      <>
                        <Check size={16} className='mr-1.5' />
                        {formConfig.submitButtonText ||
                          t('modal.addToCart', { fallback: 'Add to Cart' })}
                      </>
                    ) : (
                      <>
                        {t('modal.continue', { fallback: 'Continue' })}
                        <ArrowRight size={16} className='ml-1.5' />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </FormProvider>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BookingModal;
