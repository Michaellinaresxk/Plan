// ChefForm.tsx - FIXED VERSION
import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { Service } from '@/types/type';

import FormHeader from './ChefHeader';
import ChefTypeStep from './steps/ChefTypeStep';
import BasicDetailsStep from './steps/BasicDetailsStep';
import GuestCountStep from './steps/GuestCountStep';
import CuisineAndBudgetStep from './CuisineAndBudgetStep';
import DietaryRestrictionsStep from './steps/DietaryRestrictionsStep';
import EventDescriptionStep from './steps/EventDescriptionStep';
import ChefFormFooter from './ChefFormFooter';
import {
  budgetOptions,
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

const ChefForm: React.FC<ChefFormProps> = ({ service, onSubmit, onCancel }) => {
  const { t } = useTranslation();

  // State for multi-step form
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 7;

  // Form data state with proper initialization
  const [formData, setFormData] = useState({
    chefType: '',
    serviceType: 'single',
    dates: [] as string[], // Explicitly typed as string array
    date: '',
    time: '',
    occasion: '',
    otherOccasion: '',
    locationAddress: '',
    guestCount: 2,
    childrenCount: 0,
    childrenAges: '',
    cuisineType: '',
    budgetOption: 'standard',
    dietaryRestrictions: '',
    hasAllergies: false,
    eventDescription: '',
    selectedSpecialMenu: '',
  });

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Current price calculation
  const [currentPrice, setCurrentPrice] = useState(service.price);

  // Callback para actualizar fechas múltiples
  const handleDateSelect = useCallback(
    (dates: string[]) => {
      console.log('📅 handleDateSelect called with:', dates);
      console.log('📅 Previous formData.dates:', formData.dates);

      setFormData((prev) => {
        const newFormData = {
          ...prev,
          dates: [...dates], // Create new array to ensure state update
        };
        console.log('📅 New formData will be:', newFormData);
        return newFormData;
      });

      // Clear date error if any
      if (errors.dates) {
        setErrors((prev) => ({ ...prev, dates: '' }));
      }
    },
    [formData.dates, errors.dates]
  );

  // Callback para actualizar campos del formulario
  const updateFormField = useCallback(
    (field: string, value: any) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));

      // Clear error for this field
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: '' }));
      }
    },
    [errors]
  );

  // Form validation for each step
  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    console.log('🔍 Validating step:', step);
    console.log('📋 Current formData:', {
      serviceType: formData.serviceType,
      date: formData.date,
      dates: formData.dates,
      datesLength: formData.dates?.length,
    });

    switch (step) {
      case 1: // Chef Type Selection
        if (!formData.chefType) {
          newErrors.chefType = t('form.errors.required', {
            fallback: 'Chef type is required',
          });
        }
        break;

      case 2: // Service Type
        // No validation needed for service type selection
        break;

      case 3: // Basic Details
        if (formData.serviceType === 'single') {
          if (!formData.date) {
            newErrors.date = t('form.errors.required', {
              fallback: 'Date is required',
            });
          }
          if (!formData.time) {
            newErrors.time = t('form.errors.required', {
              fallback: 'Time is required',
            });
          }
        } else {
          // Multiple days validation
          if (
            !formData.dates ||
            !Array.isArray(formData.dates) ||
            formData.dates.length === 0
          ) {
            newErrors.dates = t('form.errors.required', {
              fallback: 'Please select at least one date',
            });
            console.log('❌ Dates validation failed:', formData.dates);
          } else {
            console.log('✅ Dates validation passed:', formData.dates);
          }
        }

        if (!formData.locationAddress) {
          newErrors.locationAddress = t('form.errors.required', {
            fallback: 'Location address is required',
          });
        }

        if (!formData.occasion) {
          newErrors.occasion = t('form.errors.required', {
            fallback: 'Occasion is required',
          });
        }

        if (formData.occasion === 'other' && !formData.otherOccasion) {
          newErrors.otherOccasion = t('form.errors.required', {
            fallback: 'Please specify the occasion',
          });
        }
        break;

      case 4: // Guest count
        if (formData.guestCount < 1) {
          newErrors.guestCount = t('form.errors.minGuests', {
            fallback: 'At least 1 guest is required',
          });
        }

        if (formData.guestCount > 20) {
          newErrors.guestCount = t('form.errors.maxGuests', {
            fallback: 'Maximum 20 guests allowed',
          });
        }

        if (formData.childrenCount < 0) {
          newErrors.childrenCount = t('form.errors.invalidCount', {
            fallback: 'Invalid children count',
          });
        }

        if (
          formData.childrenCount > 0 &&
          (!formData.childrenAges ||
            (Array.isArray(formData.childrenAges) &&
              formData.childrenAges.length === 0) ||
            (typeof formData.childrenAges === 'string' &&
              !formData.childrenAges.trim()))
        ) {
          newErrors.childrenAges = t('form.errors.required', {
            fallback: 'Please specify children ages',
          });
        }
        break;

      case 5: // Cuisine type and budget
        if (!formData.cuisineType && !formData.selectedSpecialMenu) {
          newErrors.cuisineType = t('form.errors.required', {
            fallback: 'Cuisine type is required',
          });
        }

        if (!formData.budgetOption) {
          newErrors.budgetOption = t('form.errors.required', {
            fallback: 'Budget option is required',
          });
        }
        break;

      case 6: // Dietary restrictions
        if (
          formData.dietaryRestrictions &&
          formData.dietaryRestrictions.length > 500
        ) {
          newErrors.dietaryRestrictions = t('form.errors.maxLength', {
            max: 500,
            fallback: 'Maximum 500 characters allowed',
          });
        }
        break;

      case 7: // Event description
        if (!formData.eventDescription) {
          newErrors.eventDescription = t('form.errors.required', {
            fallback: 'Event description is required',
          });
        }

        if (
          formData.eventDescription &&
          formData.eventDescription.length > 1000
        ) {
          newErrors.eventDescription = t('form.errors.maxLength', {
            max: 1000,
            fallback: 'Maximum 1000 characters allowed',
          });
        }
        break;
    }

    setErrors(newErrors);
    const hasErrors = Object.keys(newErrors).length > 0;

    console.log('🔍 Validation result:', hasErrors ? 'FAILED' : 'PASSED');
    if (hasErrors) {
      console.log('❌ Errors:', newErrors);
    }

    return !hasErrors;
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

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked,
      });
    } else if (type === 'custom' && name === 'childrenAges') {
      // Handle custom children ages array
      setFormData({
        ...formData,
        [name]: value, // value is already the array of children
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    // Clear error for this field when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep(currentStep)) {
      return;
    }

    if (currentStep === totalSteps) {
      const numberOfDays =
        formData.serviceType === 'multiple' ? formData.dates.length : 1;

      onSubmit({
        ...formData,
        totalPrice: currentPrice,
        numberOfDays,
        formattedOccasion:
          formData.occasion === 'other'
            ? formData.otherOccasion
            : occasionTypes.find((o) => o.id === formData.occasion)?.name ||
              formData.occasion,
        formattedLocation: formData.locationAddress,
      });
    } else {
      goToNextStep();
    }
  };

  // Calculate price based on selections
  useEffect(() => {
    let basePrice = service.price;

    // Override base price based on chef type
    if (formData.chefType === 'standard') {
      basePrice = 120;
    } else if (formData.chefType === 'professional') {
      basePrice = 175;
    }

    const numberOfDays =
      formData.serviceType === 'multiple' ? formData.dates.length : 1;

    let totalPrice = basePrice * numberOfDays;

    // Add price based on guest count (assuming base price is for 2 people)
    const extraGuests = Math.max(0, formData.guestCount - 2);
    totalPrice += extraGuests * 50; // $50 per additional guest

    // Add price based on cuisine type
    if (formData.cuisineType) {
      const selectedCuisine = cuisineTypes.find(
        (cuisine) => cuisine.id === formData.cuisineType
      );
      if (selectedCuisine) {
        totalPrice += selectedCuisine.price;
      }
    }

    // Add price based on budget option
    if (formData.budgetOption) {
      const selectedBudget = budgetOptions.find(
        (budget) => budget.id === formData.budgetOption
      );
      if (selectedBudget) {
        totalPrice += selectedBudget.price - 120; // Subtract the standard price already included
      }
    }

    // Add price if a chef's special menu is selected
    if (formData.selectedSpecialMenu) {
      const selectedMenu = chefsSpecialMenus.find(
        (menu) => menu.id === formData.selectedSpecialMenu
      );
      if (selectedMenu) {
        totalPrice =
          basePrice * numberOfDays + selectedMenu.price * formData.guestCount;

        if (formData.budgetOption !== 'standard') {
          const selectedBudget = budgetOptions.find(
            (budget) => budget.id === formData.budgetOption
          );
          if (selectedBudget) {
            totalPrice += selectedBudget.price - 120;
          }
        }
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
    formData.budgetOption,
    formData.selectedSpecialMenu,
  ]);

  // Reset some fields when service type changes
  useEffect(() => {
    if (formData.serviceType === 'single') {
      setFormData((prev) => ({
        ...prev,
        dates: [], // Clear multiple dates
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        date: '', // Clear single date
        time: '', // Clear time as it's configured per date in multiple
      }));
    }
  }, [formData.serviceType]);

  // Debug effect to monitor formData.dates changes
  useEffect(() => {
    console.log('📅 ChefForm - formData.dates changed:', formData.dates);
  }, [formData.dates]);

  // Progress bar calculation
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <form onSubmit={handleSubmit} className='w-full mx-auto overflow-hidden'>
      <div className='bg-white rounded-xl shadow-lg border border-gray-100'>
        {/* Form Header */}
        <FormHeader
          title={t('chef.form.title', { fallback: 'Personal Chef Booking' })}
          subtitle={t('chef.form.subtitle', {
            fallback:
              'Create a unique culinary experience in the comfort of your accommodation',
          })}
          currentStep={currentStep}
          totalSteps={totalSteps}
          progressPercentage={progressPercentage}
        />

        {/* Form Body */}
        <div className='p-8 space-y-8'>
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

          {/* Step 3: Basic Details */}
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

          {/* Step 5: Cuisine Type and Budget */}
          {currentStep === 5 && (
            <CuisineAndBudgetStep
              formData={formData}
              onChange={updateFormField}
              errors={errors}
            />
          )}

          {/* Step 6: Dietary Restrictions */}
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

        {/* Form Footer with Total Price and Navigation */}
        <ChefFormFooter
          currentPrice={currentPrice}
          formData={formData}
          currentStep={currentStep}
          totalSteps={totalSteps}
          onCancel={onCancel}
          onBack={goToPreviousStep}
          onNext={goToNextStep}
        />
      </div>
    </form>
  );
};

export default ChefForm;
