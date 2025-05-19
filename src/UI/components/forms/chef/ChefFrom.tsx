// ChefForm.jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { Service } from '@/types/type';
import {
  budgetOptions,
  chefsSpecialMenus,
  cuisineTypes,
  occasionTypes,
} from '@/constants/chefFormConsts';
import FormHeader from './ChefHeader';
import BasicDetailsStep from './steps/BasicDetailsStep';
import ServiceTypeStep from './steps/ServiceTypeStep';
import GuestCountStep from './steps/GuestCountStep';
import CuisineAndBudgetStep from './CuisineAndBudgetStep';
import DietaryRestrictionsStep from './steps/DietaryRestrictionsStep';
import EventDescriptionStep from './steps/EventDescriptionStep';
import ChefFormFooter from './ChefFormFooter';

interface ChefFormProps {
  service: Service;
  onSubmit: (formData: any) => void;
  onCancel: () => void;
}

const ChefForm: React.FC<ChefFormProps> = ({ service, onSubmit, onCancel }) => {
  const { t } = useTranslation();

  // State for multi-step form
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6; // Added one more step for service type selection

  // Form data state with new fields
  const [formData, setFormData] = useState({
    serviceType: 'single', // 'single' or 'multiple'
    dates: [], // For multiple days service
    date: '',
    time: '',
    occasion: '',
    otherOccasion: '',
    locationAddress: '', // Now using only the address field
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

  // Form validation for each step
  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1: // Service Type
        // No validation needed for service type selection
        break;

      case 2: // Basic Details
        if (formData.serviceType === 'single') {
          if (!formData.date) {
            newErrors.date = t('form.errors.required', {
              fallback: 'Date is required',
            });
          }
        } else {
          if (!formData.dates.length) {
            newErrors.dates = t('form.errors.required', {
              fallback: 'Please select at least one date',
            });
          }
        }

        if (!formData.time) {
          newErrors.time = t('form.errors.required', {
            fallback: 'Time is required',
          });
        }

        // Validate the direct location address input
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

      case 3: // Guest count
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

        if (formData.childrenCount > 0 && !formData.childrenAges) {
          newErrors.childrenAges = t('form.errors.required', {
            fallback: 'Please specify children ages',
          });
        }
        break;

      case 4: // Cuisine type and budget
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

      case 5: // Dietary restrictions
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

      case 6: // Event description
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
    return Object.keys(newErrors).length === 0;
  };

  // Navigation
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

    // Validate current step
    if (!validateStep(currentStep)) {
      return;
    }

    // If on last step, submit the form
    if (currentStep === totalSteps) {
      // Calculate the number of days for multiple service
      const numberOfDays =
        formData.serviceType === 'multiple' ? formData.dates.length : 1;

      onSubmit({
        ...formData,
        totalPrice: currentPrice,
        numberOfDays,
        // Format the occasion field
        formattedOccasion:
          formData.occasion === 'other'
            ? formData.otherOccasion
            : occasionTypes.find((o) => o.id === formData.occasion)?.name ||
              formData.occasion,
        // Use the direct location address
        formattedLocation: formData.locationAddress,
      });
    } else {
      // Otherwise, go to next step
      goToNextStep();
    }
  };

  // Calculate price based on selections
  useEffect(() => {
    let totalPrice = service.price;
    const numberOfDays =
      formData.serviceType === 'multiple' ? formData.dates.length : 1;

    // Add price based on number of days
    totalPrice *= numberOfDays;

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
        // Chef's special includes cuisine type and base price
        totalPrice =
          service.price * numberOfDays +
          selectedMenu.price * formData.guestCount;

        // Still add premium/luxury budget if selected
        if (formData.budgetOption !== 'standard') {
          const selectedBudget = budgetOptions.find(
            (budget) => budget.id === formData.budgetOption
          );
          if (selectedBudget) {
            totalPrice += selectedBudget.price - 120; // Only add the difference from standard
          }
        }
      }
    }

    setCurrentPrice(totalPrice);
  }, [
    service.price,
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
        dates: [],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        date: '',
      }));
    }
  }, [formData.serviceType]);

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
          {/* Step 1: Service Type */}
          {currentStep === 1 && (
            <ServiceTypeStep
              formData={formData}
              onChange={(field, value) => {
                setFormData({ ...formData, [field]: value });
                // Clear errors for this field
                if (errors[field]) {
                  setErrors({ ...errors, [field]: '' });
                }
              }}
              errors={errors}
            />
          )}

          {/* Step 2: Basic Details */}
          {currentStep === 2 && (
            <BasicDetailsStep
              formData={formData}
              onChange={handleChange}
              onDateSelect={(dates) => {
                setFormData({ ...formData, dates });
                // Clear errors for dates
                if (errors.dates) {
                  setErrors({ ...errors, dates: '' });
                }
              }}
              errors={errors}
              getMinDate={() => {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                return tomorrow.toISOString().split('T')[0];
              }}
            />
          )}

          {/* Step 3: Guest Count */}
          {currentStep === 3 && (
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
                // Clear error
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
                // Clear error
                if (errors.childrenCount) {
                  setErrors({ ...errors, childrenCount: '' });
                }
              }}
              errors={errors}
            />
          )}

          {/* Step 4: Cuisine Type and Budget */}
          {currentStep === 4 && (
            <CuisineAndBudgetStep
              formData={formData}
              onChange={(field, value) => {
                setFormData({ ...formData, [field]: value });
                // Clear errors for this field
                if (errors[field]) {
                  setErrors({ ...errors, [field]: '' });
                }
              }}
              errors={errors}
            />
          )}

          {/* Step 5: Dietary Restrictions */}
          {currentStep === 5 && (
            <DietaryRestrictionsStep
              formData={formData}
              onChange={handleChange}
              errors={errors}
            />
          )}

          {/* Step 6: Event Description */}
          {currentStep === 6 && (
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
