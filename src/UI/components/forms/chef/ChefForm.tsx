import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { Service } from '@/types/type';

import FormHeader from './ChefHeader';
import ChefTypeStep from './steps/ChefTypeStep';
import BasicDetailsStep from './steps/BasicDetailsStep';
import GuestCountStep from './steps/GuestCountStep';
import CuisineAndBudgetStep from './CuisineAndBudgetStep'; // ✅ Corrected version
import DietaryRestrictionsStep from './steps/DietaryRestrictionsStep';
import EventDescriptionStep from './steps/EventDescriptionStep';
import { ChefFormFooter } from './ChefFormFooter';
import { useReservation } from '@/context/BookingContext';
import { useRouter } from 'next/navigation';
import {
  chefsSpecialMenus,
  cuisineTypes,
  occasionTypes,
} from '@/constants/chef/chefForm';
import ChefServiceTypeStep from './steps/ServiceTypeStep';

interface ChefFormProps {
  service: Service;
  onSubmit: (formData: any) => void;
  onCancel: () => void;
}

// ✅ Custom hook for auto scroll to top
const useAutoScrollToTop = (currentStep: number) => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [currentStep]);
};

const ChefForm: React.FC<ChefFormProps> = ({ service, onSubmit, onCancel }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { setReservationData } = useReservation();

  // State for multi-step form
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 7;

  // ✅ Use auto scroll hook
  useAutoScrollToTop(currentStep);

  // ✅ Form data state - UPDATED with multiple time fields
  const [formData, setFormData] = useState({
    chefType: '',
    serviceType: 'single',
    dates: [] as string[],
    date: '',
    time: '', // Can be: 'breakfast', 'lunch', 'dinner', 'full-day', 'multiple', or ''
    times: [] as string[], // Array for multiple time selections
    occasion: '',
    otherOccasion: '',
    locationAddress: '',
    guestCount: 2,
    childrenCount: 0,
    childrenAges: '',
    cuisineType: '',
    customCuisineType: '', // ✅ For custom cuisine input
    selectedSpecialMenu: '', // ✅ For chef's special menus
    dietaryRestrictions: '',
    customDietaryRestrictions: '',
    hasAllergies: false,
    eventDescription: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentPrice, setCurrentPrice] = useState(service.price);

  // AUTO-SCROLL TO TOP WHEN STEP CHANGES - MOBILE OPTIMIZATION
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [currentStep]);

  // Callback para actualizar fechas múltiples
  const handleDateSelect = useCallback(
    (dates: string[]) => {
      console.log('📅 handleDateSelect called with:', dates);
      setFormData((prev) => ({
        ...prev,
        dates: [...dates],
      }));

      if (errors.dates) {
        setErrors((prev) => ({ ...prev, dates: '' }));
      }
    },
    [errors.dates]
  );

  // Callback para actualizar campos del formulario
  const updateFormField = useCallback(
    (field: string, value: any) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));

      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: '' }));
      }
    },
    [errors]
  );

  // ✅ Enhanced form validation for each step
  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    console.log('🔍 Validating step:', step);

    switch (step) {
      case 1: // Chef Type Selection
        if (!formData.chefType) {
          newErrors.chefType = 'Por favor selecciona un tipo de chef';
        }
        break;

      case 2: // Service Type
        if (!formData.serviceType) {
          newErrors.serviceType = 'Por favor selecciona un tipo de servicio';
        }
        break;

      case 3: // Basic Details
        if (formData.serviceType === 'single') {
          if (!formData.date) {
            newErrors.date = 'La fecha es requerida';
          }
          // ✅ Enhanced time validation for multiple selections
          if (
            !formData.time &&
            (!formData.times || formData.times.length === 0)
          ) {
            newErrors.time = 'Por favor selecciona al menos un momento del día';
          }
        } else {
          // Multiple days validation
          if (!formData.dates || formData.dates.length === 0) {
            newErrors.dates = 'Por favor selecciona al menos una fecha';
          }
        }

        if (!formData.locationAddress) {
          newErrors.locationAddress = 'La dirección es requerida';
        }

        if (!formData.occasion) {
          newErrors.occasion = 'Por favor selecciona una ocasión';
        }

        if (formData.occasion === 'other' && !formData.otherOccasion) {
          newErrors.otherOccasion = 'Por favor especifica la ocasión';
        }
        break;

      case 4: // Guest count
        if (formData.guestCount < 1) {
          newErrors.guestCount = 'Se requiere al menos 1 invitado';
        }

        if (formData.guestCount > 20) {
          newErrors.guestCount = 'Máximo 20 invitados permitidos';
        }

        if (formData.childrenCount < 0) {
          newErrors.childrenCount = 'Número de niños inválido';
        }

        if (
          formData.childrenCount > 0 &&
          (!formData.childrenAges ||
            (Array.isArray(formData.childrenAges) &&
              formData.childrenAges.length === 0) ||
            (typeof formData.childrenAges === 'string' &&
              !formData.childrenAges.trim()))
        ) {
          newErrors.childrenAges =
            'Por favor especifica las edades de los niños';
        }
        break;

      case 5: // ✅ Enhanced Cuisine type validation (no budget option)
        // Check if either regular cuisine or special menu is selected
        if (!formData.cuisineType && !formData.selectedSpecialMenu) {
          newErrors.cuisineType =
            'Por favor selecciona un estilo de cocina o menú especial';
        }

        // If custom cuisine is selected, validate the custom input
        if (
          formData.cuisineType === 'custom' &&
          !formData.customCuisineType?.trim()
        ) {
          newErrors.customCuisineType =
            'Por favor especifica tu estilo de cocina personalizado';
        }
        break;

      case 6: // ✅ Enhanced Dietary restrictions validation
        if (
          formData.dietaryRestrictions &&
          formData.dietaryRestrictions.length > 500
        ) {
          newErrors.dietaryRestrictions = 'Máximo 500 caracteres permitidos';
        }

        if (
          formData.customDietaryRestrictions &&
          formData.customDietaryRestrictions.length > 500
        ) {
          newErrors.customDietaryRestrictions =
            'Máximo 500 caracteres permitidos';
        }
        break;

      case 7: // Event description
        if (!formData.eventDescription) {
          newErrors.eventDescription = 'La descripción del evento es requerida';
        }

        if (
          formData.eventDescription &&
          formData.eventDescription.length > 1000
        ) {
          newErrors.eventDescription = 'Máximo 1000 caracteres permitidos';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Navigation functions
  const goToNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // ✅ Enhanced form input handler with special error handling
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    // ✅ Special handling for clearing errors
    if (name === '__clearErrors' && type === 'custom') {
      setErrors(value);
      return;
    }

    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked,
      });
    } else if (type === 'custom' && name === 'childrenAges') {
      setFormData({
        ...formData,
        [name]: value,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  // ✅ Enhanced form submission with all new fields
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateStep(currentStep)) {
        return;
      }

      if (currentStep === totalSteps) {
        try {
          const numberOfDays =
            formData.serviceType === 'multiple' ? formData.dates.length : 1;

          // ✅ Calculate multiplier for full day or multiple times
          let serviceMultiplier = 1;
          if (formData.serviceType === 'single') {
            if (
              formData.time === 'full-day' ||
              (formData.times && formData.times.length === 3)
            ) {
              serviceMultiplier = 2.5; // Full day premium
            } else if (formData.times && formData.times.length > 1) {
              serviceMultiplier = 1 + (formData.times.length - 1) * 0.7; // Multiple meals
            }
          }

          // ✅ Complete reservation data structure
          const reservationData = {
            service,
            totalPrice: currentPrice,
            formData: {
              serviceId: service.id,
              serviceName: service.name,
              serviceType: 'chef',

              // Chef and service details
              chefType: formData.chefType,
              serviceTypeDetail: formData.serviceType,

              // ✅ Enhanced dates and time information
              date: formData.serviceType === 'single' ? formData.date : '',
              dates: formData.serviceType === 'multiple' ? formData.dates : [],
              time: formData.time,
              times: formData.times, // ✅ Include multiple times
              serviceMultiplier, // ✅ For pricing calculations
              location: formData.locationAddress,
              locationAddress: formData.locationAddress,

              // Guest information
              guestCount: formData.guestCount,
              childrenCount: formData.childrenCount,
              childrenAges: formData.childrenAges,
              totalGuests: formData.guestCount + formData.childrenCount,

              // Event details
              occasion: formData.occasion,
              otherOccasion: formData.otherOccasion,

              // ✅ Enhanced cuisine and menu options
              cuisineType: formData.cuisineType,
              customCuisineType: formData.customCuisineType,
              selectedSpecialMenu: formData.selectedSpecialMenu,

              // ✅ Enhanced dietary restrictions
              dietaryRestrictions: formData.dietaryRestrictions,
              customDietaryRestrictions: formData.customDietaryRestrictions,
              hasAllergies: formData.hasAllergies,

              // Event description
              eventDescription: formData.eventDescription,
              specialRequests: formData.eventDescription,

              // Calculated values
              calculatedPrice: currentPrice,
              numberOfDays,

              // Display values
              formattedOccasion:
                formData.occasion === 'other'
                  ? formData.otherOccasion
                  : occasionTypes.find((o) => o.id === formData.occasion)
                      ?.name || formData.occasion,

              // ✅ Enhanced cuisine display
              formattedCuisine: formData.selectedSpecialMenu
                ? chefsSpecialMenus.find(
                    (m) => m.id === formData.selectedSpecialMenu
                  )?.title
                : formData.cuisineType === 'custom' &&
                  formData.customCuisineType
                ? formData.customCuisineType
                : cuisineTypes.find((c) => c.id === formData.cuisineType)?.name,

              // ✅ Enhanced time display
              formattedTimes:
                formData.time === 'full-day'
                  ? 'Día Completo (Desayuno, Comida y Cena)'
                  : formData.times && formData.times.length > 1
                  ? formData.times
                      .map((t) => {
                        switch (t) {
                          case 'breakfast':
                            return 'Desayuno';
                          case 'lunch':
                            return 'Comida';
                          case 'dinner':
                            return 'Cena';
                          default:
                            return t;
                        }
                      })
                      .join(', ')
                  : formData.time === 'breakfast'
                  ? 'Desayuno'
                  : formData.time === 'lunch'
                  ? 'Comida'
                  : formData.time === 'dinner'
                  ? 'Cena'
                  : formData.time,
            },
            bookingDate: new Date(),
            clientInfo: undefined,
          };

          console.log(
            '👨‍🍳 Enhanced ChefForm - Reservation data:',
            reservationData
          );
          console.log('💰 Total Price at root level:', currentPrice);

          setReservationData(reservationData);
          router.push('/reservation-confirmation');
        } catch (error) {
          console.error('❌ Chef booking error:', error);
          alert('Error processing booking. Please try again.');
        }
      } else {
        goToNextStep();
      }
    },
    [
      validateStep,
      currentStep,
      totalSteps,
      formData,
      currentPrice,
      service,
      setReservationData,
      router,
      goToNextStep,
    ]
  );

  // ✅ Enhanced price calculation with multiple time considerations
  useEffect(() => {
    let basePrice = service.price;

    if (formData.chefType === 'standard') {
      basePrice = 120;
    } else if (formData.chefType === 'professional') {
      basePrice = 175;
    }

    const numberOfDays =
      formData.serviceType === 'multiple' ? formData.dates.length : 1;

    let totalPrice = basePrice * numberOfDays;

    // ✅ Special menu pricing (overrides regular cuisine pricing)
    if (formData.selectedSpecialMenu) {
      const selectedMenu = chefsSpecialMenus.find(
        (menu) => menu.id === formData.selectedSpecialMenu
      );
      if (selectedMenu) {
        // Special menu pricing per person - using estimated price
        const menuPrice =
          selectedMenu.id === 'tasting-menu'
            ? 85
            : selectedMenu.id === 'fusion-experience'
            ? 65
            : selectedMenu.id === 'romantic-dinner'
            ? 75
            : 70;
        totalPrice =
          (basePrice + menuPrice) * formData.guestCount * numberOfDays;
      }
    } else {
      // Regular cuisine pricing
      const extraGuests = Math.max(0, formData.guestCount - 2);
      totalPrice += extraGuests * 50; // $50 per additional guest

      // Add price based on cuisine type
      if (formData.cuisineType) {
        const selectedCuisine = cuisineTypes.find(
          (cuisine) => cuisine.id === formData.cuisineType
        );
        if (selectedCuisine) {
          totalPrice += selectedCuisine.price * numberOfDays;
        } else if (formData.cuisineType === 'custom') {
          // Custom cuisine has a base additional cost
          totalPrice += 15 * numberOfDays;
        }
      }
    }

    // ✅ Multiple time pricing for single day service
    if (formData.serviceType === 'single') {
      if (
        formData.time === 'full-day' ||
        (formData.times && formData.times.length === 3)
      ) {
        // Full day service - significant premium
        totalPrice *= 2.5;
      } else if (formData.times && formData.times.length > 1) {
        // Multiple meals but not full day
        const mealMultiplier = 1 + (formData.times.length - 1) * 0.7;
        totalPrice *= mealMultiplier;
      }
    }

    setCurrentPrice(totalPrice);
  }, [
    service.price,
    formData.chefType,
    formData.serviceType,
    formData.dates.length,
    formData.guestCount,
    formData.cuisineType,
    formData.customCuisineType,
    formData.selectedSpecialMenu,
    formData.time,
    formData.times,
  ]);

  // Reset some fields when service type changes
  useEffect(() => {
    if (formData.serviceType === 'single') {
      setFormData((prev) => ({
        ...prev,
        dates: [],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        date: '',
        time: '',
        times: [],
      }));
    }
  }, [formData.serviceType]);

  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className='w-full mx-auto overflow-hidden'>
      {/* MOBILE/DESKTOP RESPONSIVE CONTAINER */}
      <div className='bg-white rounded-xl shadow-lg border border-gray-100 max-w-4xl mx-auto'>
        {/* Form Header with Mobile Optimization */}
        <FormHeader
          title='Personal Chef Booking'
          subtitle={t('chef.form.subtitle', {
            fallback:
              'Create a unique culinary experience in the comfort of your accommodation',
          })}
          currentStep={currentStep}
          totalSteps={totalSteps}
          progressPercentage={progressPercentage}
        />

        {/* Form Body with Responsive Padding */}
        <div className='p-4 md:p-8 space-y-6 md:space-y-8'>
          {/* Step 1: Chef Type Selection */}
          {currentStep === 1 && (
            <ChefTypeStep
              formData={formData}
              onChange={updateFormField}
              errors={errors}
            />
          )}

          {/* Step 2: Service Type */}
          {currentStep === 2 && (
            <ChefServiceTypeStep
              formData={formData}
              onChange={updateFormField}
              errors={errors}
            />
          )}

          {/* Step 3: Enhanced Basic Details with Multiple Time Selection */}
          {currentStep === 3 && (
            <BasicDetailsStep
              formData={formData}
              onChange={handleChange}
              onDateSelect={handleDateSelect}
              errors={errors}
              getMinDate={() => {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                return tomorrow.toISOString().split('T')[0];
              }}
            />
          )}

          {/* Step 4: Guest Count */}
          {currentStep === 4 && (
            <GuestCountStep
              formData={formData}
              onChange={handleChange}
              updateGuestCount={(increment) => {
                setFormData((prev) => ({
                  ...prev,
                  guestCount: increment
                    ? Math.min(20, prev.guestCount + 1)
                    : Math.max(1, prev.guestCount - 1),
                }));
                if (errors.guestCount) {
                  setErrors({ ...errors, guestCount: '' });
                }
              }}
              updateChildrenCount={(increment) => {
                setFormData((prev) => ({
                  ...prev,
                  childrenCount: increment
                    ? Math.min(10, prev.childrenCount + 1)
                    : Math.max(0, prev.childrenCount - 1),
                }));
                if (errors.childrenCount) {
                  setErrors({ ...errors, childrenCount: '' });
                }
              }}
              errors={errors}
            />
          )}

          {/* Step 5: Enhanced Cuisine Type (No Budget) */}
          {currentStep === 5 && (
            <CuisineAndBudgetStep
              formData={formData}
              onChange={updateFormField}
              errors={errors}
            />
          )}

          {/* Step 6: Enhanced Dietary Restrictions */}
          {currentStep === 6 && (
            <DietaryRestrictionsStep
              formData={formData}
              onChange={handleChange}
              errors={errors}
            />
          )}

          {/* Step 7: Event Description */}
          {currentStep === 7 && (
            <EventDescriptionStep
              formData={formData}
              onChange={handleChange}
              errors={errors}
            />
          )}
        </div>

        {/* Form Footer with Mobile Optimization */}
        <ChefFormFooter
          currentPrice={currentPrice}
          formData={formData}
          currentStep={currentStep}
          totalSteps={totalSteps}
          onCancel={onCancel}
          onBack={goToPreviousStep}
          onNext={handleSubmit} // This handles both next and submit
        />
      </div>
    </div>
  );
};

export default ChefForm;
