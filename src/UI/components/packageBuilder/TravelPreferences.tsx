'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Heart,
  Anchor,
  Users,
  Sparkles,
  CalendarDays,
  Check,
  ChevronRight,
  Coffee,
  Bike,
  Utensils,
  Music,
  Compass,
} from 'lucide-react';
import { useBooking } from '@/context/BookingContext';
import { useTranslation } from '@/lib/i18n/client';

// Define interest options
interface InterestOption {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface TravelPreferencesProps {
  onComplete: (preferences: {
    purpose: string;
    startDate: string;
    endDate: string;
    guests: number;
    interests: string[];
  }) => void;
}

const TravelPreferences: React.FC<TravelPreferencesProps> = ({
  onComplete,
}) => {
  const { t } = useTranslation();
  const { packageType } = useBooking();

  // State for preferences
  const [purpose, setPurpose] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [guests, setGuests] = useState<number>(2);
  const [interests, setInterests] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Get current date and format as YYYY-MM-DD for min attribute
  const today = new Date();
  const formattedToday = today.toISOString().split('T')[0];

  // Travel purpose options
  const purposeOptions = [
    {
      id: 'relaxation',
      title: t('preferences.relaxation', { fallback: 'Relaxation & Wellness' }),
      description: t('preferences.relaxationDesc', {
        fallback: 'Focus on rest, rejuvenation and wellness activities',
      }),
      icon: <Heart className='h-6 w-6' />,
    },
    {
      id: 'adventure',
      title: t('preferences.adventure', {
        fallback: 'Adventure & Exploration',
      }),
      description: t('preferences.adventureDesc', {
        fallback: 'Discover exciting activities and explore new places',
      }),
      icon: <Anchor className='h-6 w-6' />,
    },
    {
      id: 'family',
      title: t('preferences.family', { fallback: 'Family Vacation' }),
      description: t('preferences.familyDesc', {
        fallback: 'Activities and experiences for the whole family',
      }),
      icon: <Users className='h-6 w-6' />,
    },
    {
      id: 'celebration',
      title: t('preferences.celebration', { fallback: 'Special Celebration' }),
      description: t('preferences.celebrationDesc', {
        fallback: 'Commemorate a special occasion with memorable experiences',
      }),
      icon: <Sparkles className='h-6 w-6' />,
    },
  ];

  // Interest options
  const interestOptions: InterestOption[] = [
    {
      id: 'water-activities',
      label: t('preferences.interests.water', { fallback: 'Water Activities' }),
      icon: <Anchor className='h-5 w-5' />,
    },
    {
      id: 'tours',
      label: t('preferences.interests.tours', {
        fallback: 'Tours & Excursions',
      }),
      icon: <Compass className='h-5 w-5' />,
    },
    {
      id: 'food',
      label: t('preferences.interests.food', { fallback: 'Food & Dining' }),
      icon: <Utensils className='h-5 w-5' />,
    },
    {
      id: 'relaxation',
      label: t('preferences.interests.relaxation', {
        fallback: 'Relaxation & Spa',
      }),
      icon: <Coffee className='h-5 w-5' />,
    },
    {
      id: 'transportation',
      label: t('preferences.interests.transportation', {
        fallback: 'Transportation',
      }),
      icon: <Bike className='h-5 w-5' />,
    },
    {
      id: 'entertainment',
      label: t('preferences.interests.entertainment', {
        fallback: 'Entertainment',
      }),
      icon: <Music className='h-5 w-5' />,
    },
  ];

  // Handler for saving preferences
  const handleSavePreferences = () => {
    onComplete({
      purpose,
      startDate,
      endDate,
      guests,
      interests,
    });
  };

  // Toggle an interest selection
  const toggleInterest = (interestId: string) => {
    if (interests.includes(interestId)) {
      setInterests(interests.filter((id) => id !== interestId));
    } else {
      setInterests([...interests, interestId]);
    }
  };

  // Calculate days between dates
  const calculateDays = (): number => {
    if (!startDate || !endDate) return 0;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both days
  };

  // Check if current step is complete
  const isStepComplete = (): boolean => {
    switch (currentStep) {
      case 1:
        return Boolean(purpose);
      case 2:
        return Boolean(startDate && endDate);
      case 3:
        return guests > 0 && interests.length > 0;
      default:
        return false;
    }
  };

  // Move to next step
  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSavePreferences();
    }
  };

  // Move to previous step
  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Render progress indicator
  const renderProgressIndicator = () => {
    return (
      <div className='flex justify-between mb-8'>
        {[1, 2, 3].map((step) => (
          <div
            key={step}
            className='flex flex-col items-center'
            onClick={() => step < currentStep && setCurrentStep(step)}
          >
            <div
              className={`
                w-8 h-8 rounded-full flex items-center justify-center
                ${
                  currentStep === step
                    ? packageType === 'premium'
                      ? 'bg-amber-500 text-white'
                      : 'bg-blue-500 text-white'
                    : currentStep > step
                    ? packageType === 'premium'
                      ? 'bg-amber-200 text-white'
                      : 'bg-blue-200 text-white'
                    : 'bg-gray-200 text-gray-600'
                }
                ${step < currentStep ? 'cursor-pointer' : ''}
              `}
            >
              {step}
            </div>
            <div className='w-16 text-xs text-center mt-1 text-gray-600'>
              {step === 1
                ? t('preferences.steps.purpose', { fallback: 'Purpose' })
                : step === 2
                ? t('preferences.steps.dates', { fallback: 'Dates' })
                : t('preferences.steps.details', { fallback: 'Details' })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderPurposeStep();
      case 2:
        return renderDatesStep();
      case 3:
        return renderDetailsStep();
      default:
        return null;
    }
  };

  // Render purpose selection step
  const renderPurposeStep = () => {
    return (
      <>
        <h3 className='text-lg font-medium text-gray-900 mb-3'>
          {t('preferences.purposeQuestion', {
            fallback: "What's the main purpose of your trip?",
          })}
        </h3>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          {purposeOptions.map((option) => (
            <div
              key={option.id}
              onClick={() => setPurpose(option.id)}
              className={`
                p-4 border rounded-xl cursor-pointer transition-all
                ${
                  purpose === option.id
                    ? packageType === 'premium'
                      ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-200'
                      : 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }
              `}
            >
              <div className='flex items-start mb-2'>
                <div
                  className={`
                  p-2 rounded-full mr-3
                  ${
                    purpose === option.id
                      ? packageType === 'premium'
                        ? 'bg-amber-100 text-amber-600'
                        : 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-600'
                  }
                `}
                >
                  {option.icon}
                </div>
                <div className='flex-1'>
                  <h4 className='font-semibold text-gray-900'>
                    {option.title}
                  </h4>
                  <p className='text-sm text-gray-600 mt-1'>
                    {option.description}
                  </p>
                </div>
                {purpose === option.id && (
                  <div
                    className={`
                    ${
                      packageType === 'premium'
                        ? 'text-amber-500'
                        : 'text-blue-500'
                    }
                  `}
                  >
                    <Check className='h-5 w-5' />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };

  // Render dates selection step
  const renderDatesStep = () => {
    return (
      <>
        <h3 className='text-lg font-medium text-gray-900 mb-3'>
          {t('preferences.datesQuestion', {
            fallback: 'When are you planning to visit?',
          })}
        </h3>

        <div className='flex flex-col sm:flex-row gap-4 mb-2'>
          <div className='flex-1'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              {t('preferences.startDate', { fallback: 'Start Date' })}
            </label>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <CalendarDays className='h-5 w-5 text-gray-400' />
              </div>
              <input
                type='date'
                min={formattedToday}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              />
            </div>
          </div>

          <div className='flex-1'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              {t('preferences.endDate', { fallback: 'End Date' })}
            </label>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <CalendarDays className='h-5 w-5 text-gray-400' />
              </div>
              <input
                type='date'
                min={startDate || formattedToday}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                disabled={!startDate}
              />
            </div>
          </div>
        </div>

        {startDate && endDate && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`
              mt-4 p-3 rounded-lg
              ${
                packageType === 'premium'
                  ? 'bg-amber-50 text-amber-700'
                  : 'bg-blue-50 text-blue-700'
              }
            `}
          >
            {t('preferences.duration', {
              fallback: 'Trip duration: {{days}} days',
              days: calculateDays(),
            })}
          </motion.div>
        )}
      </>
    );
  };

  // Render details step (guests and interests)
  const renderDetailsStep = () => {
    return (
      <>
        {/* Group Size */}
        <h3 className='text-lg font-medium text-gray-900 mb-3'>
          {t('preferences.guestsQuestion', {
            fallback: 'How many people are traveling?',
          })}
        </h3>

        <div className='max-w-xs mb-6'>
          <div className='flex items-center'>
            <button
              onClick={() => setGuests((prev) => Math.max(1, prev - 1))}
              className='p-2 border border-gray-300 rounded-l-lg hover:bg-gray-100'
            >
              <svg
                viewBox='0 0 24 24'
                width='16'
                height='16'
                stroke='currentColor'
                strokeWidth='2'
                fill='none'
              >
                <path d='M5 12h14' />
              </svg>
            </button>

            <input
              type='number'
              min='1'
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
              className='w-full py-2 px-3 text-center border-t border-b border-gray-300 focus:outline-none'
            />

            <button
              onClick={() => setGuests((prev) => prev + 1)}
              className='p-2 border border-gray-300 rounded-r-lg hover:bg-gray-100'
            >
              <svg
                viewBox='0 0 24 24'
                width='16'
                height='16'
                stroke='currentColor'
                strokeWidth='2'
                fill='none'
              >
                <path d='M12 5v14M5 12h14' />
              </svg>
            </button>
          </div>
        </div>

        {/* Interests */}
        <h3 className='text-lg font-medium text-gray-900 mb-3'>
          {t('preferences.interestsQuestion', {
            fallback: 'What activities are you interested in?',
          })}
        </h3>
        <p className='text-sm text-gray-600 mb-4'>
          {t('preferences.interestsHint', {
            fallback:
              'Select all that apply. This helps us recommend the perfect services.',
          })}
        </p>

        <div className='grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4'>
          {interestOptions.map((option) => (
            <div
              key={option.id}
              onClick={() => toggleInterest(option.id)}
              className={`
                p-3 border rounded-lg cursor-pointer transition-all flex items-center
                ${
                  interests.includes(option.id)
                    ? packageType === 'premium'
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }
              `}
            >
              <div
                className={`
                p-1.5 rounded-full mr-2
                ${
                  interests.includes(option.id)
                    ? packageType === 'premium'
                      ? 'bg-amber-100 text-amber-600'
                      : 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-600'
                }
              `}
              >
                {option.icon}
              </div>
              <span className='text-sm font-medium'>{option.label}</span>
              {interests.includes(option.id) && (
                <Check
                  className={`ml-auto h-4 w-4 ${
                    packageType === 'premium'
                      ? 'text-amber-500'
                      : 'text-blue-500'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6'
    >
      <h2 className='text-2xl font-bold text-gray-900 mb-4'>
        {t('preferences.title', { fallback: 'Tell us about your trip' })}
      </h2>

      <p className='text-gray-600 mb-6'>
        {t('preferences.subtitle', {
          fallback:
            'Help us create the perfect vacation package by sharing your preferences',
        })}
      </p>

      {/* Progress indicator */}
      {renderProgressIndicator()}

      {/* Step content */}
      <div className='mb-8'>{renderStepContent()}</div>

      {/* Navigation buttons */}
      <div className='flex justify-between'>
        {currentStep > 1 ? (
          <button
            onClick={handlePreviousStep}
            className='px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors'
          >
            {t('preferences.back', { fallback: 'Back' })}
          </button>
        ) : (
          <div></div> /* Empty div for flex spacing */
        )}

        <button
          onClick={handleNextStep}
          disabled={!isStepComplete()}
          className={`
            flex items-center px-6 py-3 rounded-lg font-medium
            ${
              isStepComplete()
                ? packageType === 'premium'
                  ? 'bg-amber-500 hover:bg-amber-600 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          {currentStep < 3
            ? t('preferences.next', { fallback: 'Next' })
            : t('preferences.continue', { fallback: 'Continue' })}
          <ChevronRight className='ml-2 h-5 w-5' />
        </button>
      </div>
    </motion.div>
  );
};

export default TravelPreferences;
