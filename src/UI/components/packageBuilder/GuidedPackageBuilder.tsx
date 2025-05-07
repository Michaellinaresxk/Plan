import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBooking } from '@/context/BookingContext';
import { useTranslation } from '@/lib/i18n/client';
import {
  CalendarDays,
  Users,
  Heart,
  Bike,
  UtensilsCrossed,
  Music,
  DumbbellIcon,
  Anchor,
  Waves,
  Check,
  MapPin,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Plus,
  Clock,
} from 'lucide-react';
import { Service } from '@/types/type';
import Image from 'next/image';

// Define types for the questionnaire flow
interface Question {
  id: string;
  title: string;
  description: string;
  type:
    | 'single-select'
    | 'multi-select'
    | 'date-range'
    | 'numeric'
    | 'location';
  options?: Array<{
    id: string;
    label: string;
    icon?: React.ReactNode;
    description?: string;
  }>;
  minSelections?: number;
  maxSelections?: number;
}

interface GuidedPackageBuilderProps {
  services: Service[];
  onComplete: (selectedServices: Service[]) => void;
}

// Variants for animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.3 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
  exit: { y: -20, opacity: 0 },
};

const GuidedPackageBuilder: React.FC<GuidedPackageBuilderProps> = ({
  services,
  onComplete,
}) => {
  const { t } = useTranslation();
  const { packageType, addService, selectedServices, resetBooking } =
    useBooking();

  // State for the questionnaire
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Service[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [showSkip, setShowSkip] = useState(true);

  // Define the questionnaire flow
  const questions: Question[] = [
    {
      id: 'tripDates',
      title: t('guidedBuilder.tripDates.title', {
        fallback: 'When are you planning to visit?',
      }),
      description: t('guidedBuilder.tripDates.description', {
        fallback:
          'Let us know your travel dates so we can create the perfect plan',
      }),
      type: 'date-range',
    },
    {
      id: 'groupSize',
      title: t('guidedBuilder.groupSize.title', {
        fallback: 'How many people will be traveling?',
      }),
      description: t('guidedBuilder.groupSize.description', {
        fallback: 'This helps us recommend appropriate services for your group',
      }),
      type: 'numeric',
    },
    {
      id: 'tripPurpose',
      title: t('guidedBuilder.tripPurpose.title', {
        fallback: "What's the main purpose of your trip?",
      }),
      description: t('guidedBuilder.tripPurpose.description', {
        fallback: 'This will help us tailor recommendations to your needs',
      }),
      type: 'single-select',
      options: [
        {
          id: 'relaxation',
          label: t('guidedBuilder.tripPurpose.relaxation', {
            fallback: 'Relaxation & Wellness',
          }),
          icon: <Heart className='h-6 w-6' />,
          description: t('guidedBuilder.tripPurpose.relaxationDesc', {
            fallback: 'Peaceful experiences focused on rest and rejuvenation',
          }),
        },
        {
          id: 'adventure',
          label: t('guidedBuilder.tripPurpose.adventure', {
            fallback: 'Adventure & Exploration',
          }),
          icon: <Anchor className='h-6 w-6' />,
          description: t('guidedBuilder.tripPurpose.adventureDesc', {
            fallback:
              'Active experiences discovering new places and activities',
          }),
        },
        {
          id: 'celebration',
          label: t('guidedBuilder.tripPurpose.celebration', {
            fallback: 'Special Celebration',
          }),
          icon: <Sparkles className='h-6 w-6' />,
          description: t('guidedBuilder.tripPurpose.celebrationDesc', {
            fallback:
              'Commemorating a special occasion with memorable experiences',
          }),
        },
        {
          id: 'family',
          label: t('guidedBuilder.tripPurpose.family', {
            fallback: 'Family Vacation',
          }),
          icon: <Users className='h-6 w-6' />,
          description: t('guidedBuilder.tripPurpose.familyDesc', {
            fallback: 'Activities and experiences for all family members',
          }),
        },
      ],
    },
    {
      id: 'interests',
      title: t('guidedBuilder.interests.title', {
        fallback: 'What interests you most?',
      }),
      description: t('guidedBuilder.interests.description', {
        fallback:
          'Select all that apply to help us recommend the perfect activities',
      }),
      type: 'multi-select',
      minSelections: 1,
      maxSelections: 4,
      options: [
        {
          id: 'water-activities',
          label: t('guidedBuilder.interests.waterActivities', {
            fallback: 'Water Activities',
          }),
          icon: <Waves className='h-6 w-6' />,
        },
        {
          id: 'culinary',
          label: t('guidedBuilder.interests.culinary', {
            fallback: 'Culinary Experiences',
          }),
          icon: <UtensilsCrossed className='h-6 w-6' />,
        },
        {
          id: 'fitness',
          label: t('guidedBuilder.interests.fitness', {
            fallback: 'Fitness & Wellness',
          }),
          icon: <DumbbellIcon className='h-6 w-6' />,
        },
        {
          id: 'entertainment',
          label: t('guidedBuilder.interests.entertainment', {
            fallback: 'Entertainment & Leisure',
          }),
          icon: <Music className='h-6 w-6' />,
        },
        {
          id: 'transportation',
          label: t('guidedBuilder.interests.transportation', {
            fallback: 'Transportation & Mobility',
          }),
          icon: <Bike className='h-6 w-6' />,
        },
        {
          id: 'excursions',
          label: t('guidedBuilder.interests.excursions', {
            fallback: 'Tours & Excursions',
          }),
          icon: <MapPin className='h-6 w-6' />,
        },
      ],
    },
  ];

  // Reset selected services when component mounts
  useEffect(() => {
    // Only reset if coming fresh to the guided builder
    if (currentStep === 0 && Object.keys(answers).length === 0) {
      resetBooking();
    }
  }, [currentStep, answers, resetBooking]);

  // Helper function to get service categories based on interests
  const getServiceCategoriesFromInterests = (interests: string[]): string[] => {
    const categoryMap: Record<string, string[]> = {
      'water-activities': ['water-activities'],
      culinary: ['food-drinks'],
      fitness: ['wellness'],
      entertainment: ['leisure'],
      transportation: ['transportation'],
      excursions: ['tours'],
    };

    return interests.flatMap((interest) => categoryMap[interest] || []);
  };

  // Function to generate service recommendations based on user answers
  const generateRecommendations = () => {
    setLoading(true);

    setTimeout(() => {
      let filteredServices = [...services];

      // Filter by package type
      if (packageType) {
        filteredServices = filteredServices.filter((service) =>
          service.packageType.includes(packageType)
        );
      }

      // Filter by interests if selected
      if (answers.interests && answers.interests.length > 0) {
        const categories = getServiceCategoriesFromInterests(answers.interests);

        // Simple mapping of interests to service categories
        filteredServices = filteredServices.filter((service) => {
          // Determine the category of this service
          const serviceCategory = determineServiceCategory(service.id);
          return categories.includes(serviceCategory);
        });
      }

      // Filter by trip purpose
      if (answers.tripPurpose) {
        // Adjust the filter based on trip purpose
        switch (answers.tripPurpose) {
          case 'relaxation':
            // Prioritize wellness, spa, yoga, etc.
            filteredServices = prioritizeCategories(filteredServices, [
              'wellness',
              'food-drinks',
            ]);
            break;
          case 'adventure':
            // Prioritize tours, water activities, etc.
            filteredServices = prioritizeCategories(filteredServices, [
              'water-activities',
              'tours',
            ]);
            break;
          case 'celebration':
            // Prioritize chef services, entertainment, etc.
            filteredServices = prioritizeCategories(filteredServices, [
              'food-drinks',
              'leisure',
            ]);
            break;
          case 'family':
            // Family-friendly mix
            // No need to prioritize - keep a good mix
            break;
        }
      }

      // Limit to a reasonable number of recommendations
      const topRecommendations = filteredServices.slice(0, 6);

      setRecommendations(topRecommendations);
      setLoading(false);
      setIsComplete(true);
    }, 1500); // Simulate API call with timeout
  };

  // Helper to prioritize certain categories
  const prioritizeCategories = (
    services: Service[],
    priorityCategories: string[]
  ): Service[] => {
    // Sort the services to put priority categories first
    return [...services].sort((a, b) => {
      const catA = determineServiceCategory(a.id);
      const catB = determineServiceCategory(b.id);

      const isPriorityA = priorityCategories.includes(catA);
      const isPriorityB = priorityCategories.includes(catB);

      if (isPriorityA && !isPriorityB) return -1;
      if (!isPriorityA && isPriorityB) return 1;
      return 0;
    });
  };

  // Simple function to determine a service's category
  const determineServiceCategory = (serviceId: string): string => {
    // This is a simplified version - you should use your actual service categorization logic
    if (
      serviceId.includes('yoga') ||
      serviceId.includes('masseuse') ||
      serviceId.includes('fitness')
    ) {
      return 'wellness';
    } else if (
      serviceId.includes('catamaran') ||
      serviceId.includes('yacht') ||
      serviceId.includes('fishing')
    ) {
      return 'water-activities';
    } else if (serviceId.includes('chef') || serviceId.includes('culinary')) {
      return 'food-drinks';
    } else if (
      serviceId.includes('music') ||
      serviceId.includes('karaoke') ||
      serviceId.includes('baby')
    ) {
      return 'leisure';
    } else if (
      serviceId.includes('golf-cart') ||
      serviceId.includes('bike') ||
      serviceId.includes('airport')
    ) {
      return 'transportation';
    } else if (
      serviceId.includes('island') ||
      serviceId.includes('excursion') ||
      serviceId.includes('adventure')
    ) {
      return 'tours';
    }
    return 'other';
  };

  // Handle next step
  const handleNextStep = () => {
    // Validate current step
    if (!validateCurrentStep()) {
      return;
    }

    // If we're at the last question, generate recommendations
    if (currentStep === questions.length - 1) {
      generateRecommendations();
      return;
    }

    // Otherwise, move to the next question
    setCurrentStep(currentStep + 1);
  };

  // Handle previous step
  const handlePreviousStep = () => {
    if (isComplete) {
      setIsComplete(false);
      return;
    }

    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle skipping the guided process
  const handleSkip = () => {
    // Just set a flag that we want to use the manual builder
    onComplete([]);
  };

  // Validate the current step
  const validateCurrentStep = (): boolean => {
    const currentQuestion = questions[currentStep];

    switch (currentQuestion.type) {
      case 'date-range':
        return !!answers.startDate && !!answers.endDate;

      case 'numeric':
        return !!answers[currentQuestion.id] && answers[currentQuestion.id] > 0;

      case 'single-select':
        return !!answers[currentQuestion.id];

      case 'multi-select':
        return (
          !!answers[currentQuestion.id] &&
          answers[currentQuestion.id].length >=
            (currentQuestion.minSelections || 1)
        );

      default:
        return true;
    }
  };

  // Handle answer changes
  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers({
      ...answers,
      [questionId]: value,
    });
  };

  // Handle service selection
  const handleServiceSelect = (service: Service) => {
    addService(service);
  };

  // Handle completing the guided process
  const handleComplete = () => {
    onComplete(selectedServices);
  };

  // Render step content based on current step
  const renderStepContent = () => {
    if (isComplete) {
      return renderRecommendations();
    }

    const currentQuestion = questions[currentStep];

    return (
      <motion.div
        key={currentQuestion.id}
        variants={containerVariants}
        initial='hidden'
        animate='visible'
        exit='exit'
        className='bg-white rounded-xl shadow-lg p-8'
      >
        <motion.h2
          variants={itemVariants}
          className='text-2xl font-bold text-gray-900 mb-3'
        >
          {currentQuestion.title}
        </motion.h2>

        <motion.p variants={itemVariants} className='text-gray-600 mb-8'>
          {currentQuestion.description}
        </motion.p>

        {renderQuestionType(currentQuestion)}

        <motion.div
          variants={itemVariants}
          className='flex justify-between mt-10'
        >
          <button
            onClick={handlePreviousStep}
            className={`flex items-center px-6 py-3 rounded-lg ${
              currentStep === 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            disabled={currentStep === 0}
          >
            <ChevronLeft className='mr-2 h-5 w-5' />
            {t('guidedBuilder.back', { fallback: 'Back' })}
          </button>

          <div className='flex gap-4'>
            {showSkip && (
              <button
                onClick={handleSkip}
                className='px-6 py-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors'
              >
                {t('guidedBuilder.skip', { fallback: 'Skip Guide' })}
              </button>
            )}

            <button
              onClick={handleNextStep}
              className={`flex items-center px-8 py-3 rounded-lg font-medium ${
                validateCurrentStep()
                  ? packageType === 'standard'
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'bg-amber-500 hover:bg-amber-600 text-white'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
              disabled={!validateCurrentStep()}
            >
              {currentStep === questions.length - 1
                ? t('guidedBuilder.getRecommendations', {
                    fallback: 'Get Recommendations',
                  })
                : t('guidedBuilder.next', { fallback: 'Next' })}
              <ChevronRight className='ml-2 h-5 w-5' />
            </button>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  // Render recommendations
  const renderRecommendations = () => {
    return (
      <motion.div
        variants={containerVariants}
        initial='hidden'
        animate='visible'
        exit='exit'
        className='bg-white rounded-xl shadow-lg p-8'
      >
        <motion.h2
          variants={itemVariants}
          className='text-2xl font-bold text-gray-900 mb-3'
        >
          {t('guidedBuilder.recommendationsTitle', {
            fallback: 'Your Personalized Recommendations',
          })}
        </motion.h2>

        <motion.p variants={itemVariants} className='text-gray-600 mb-8'>
          {t('guidedBuilder.recommendationsDescription', {
            fallback:
              'Based on your preferences, we recommend these services for your custom package',
          })}
        </motion.p>

        {loading ? (
          <div className='flex flex-col items-center justify-center py-12'>
            <div className='w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-4'></div>
            <p className='text-gray-600'>
              {t('guidedBuilder.generatingRecommendations', {
                fallback: 'Generating your personalized recommendations...',
              })}
            </p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            className='grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'
          >
            {recommendations.map((service) => (
              <RecommendedServiceCard
                key={service.id}
                service={service}
                isSelected={selectedServices.some((s) => s.id === service.id)}
                onSelect={() => handleServiceSelect(service)}
                packageType={packageType || 'standard'}
              />
            ))}
          </motion.div>
        )}

        <motion.div
          variants={itemVariants}
          className='flex justify-between mt-8'
        >
          <button
            onClick={handlePreviousStep}
            className='flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-lg'
          >
            <ChevronLeft className='mr-2 h-5 w-5' />
            {t('guidedBuilder.back', { fallback: 'Back' })}
          </button>

          <button
            onClick={handleComplete}
            className={`flex items-center px-8 py-3 rounded-lg font-medium ${
              packageType === 'standard'
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : 'bg-amber-500 hover:bg-amber-600 text-white'
            }`}
          >
            {t('guidedBuilder.finishAndBuild', {
              fallback: 'Finish & Build My Package',
            })}
            <ChevronRight className='ml-2 h-5 w-5' />
          </button>
        </motion.div>
      </motion.div>
    );
  };

  // Render different question types
  const renderQuestionType = (question: Question) => {
    switch (question.type) {
      case 'date-range':
        return renderDateRangeQuestion();

      case 'numeric':
        return renderNumericQuestion(question);

      case 'single-select':
        return renderSingleSelectQuestion(question);

      case 'multi-select':
        return renderMultiSelectQuestion(question);

      default:
        return null;
    }
  };

  // Render date range question
  const renderDateRangeQuestion = () => {
    // Simplified date picker for demo purposes
    // In a real implementation, you'd use a proper date picker component

    // Get current date and format as YYYY-MM-DD for min attribute
    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0];

    return (
      <motion.div variants={itemVariants} className='space-y-6'>
        <div className='flex flex-col sm:flex-row gap-4'>
          <div className='flex-1'>
            <label className='block text-gray-700 text-sm font-medium mb-2'>
              {t('guidedBuilder.startDate', { fallback: 'Start Date' })}
            </label>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <CalendarDays className='h-5 w-5 text-gray-400' />
              </div>
              <input
                type='date'
                min={formattedToday}
                value={answers.startDate || ''}
                onChange={(e) =>
                  handleAnswerChange('startDate', e.target.value)
                }
                className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              />
            </div>
          </div>

          <div className='flex-1'>
            <label className='block text-gray-700 text-sm font-medium mb-2'>
              {t('guidedBuilder.endDate', { fallback: 'End Date' })}
            </label>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <CalendarDays className='h-5 w-5 text-gray-400' />
              </div>
              <input
                type='date'
                min={answers.startDate || formattedToday}
                value={answers.endDate || ''}
                onChange={(e) => handleAnswerChange('endDate', e.target.value)}
                className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                disabled={!answers.startDate}
              />
            </div>
          </div>
        </div>

        {answers.startDate && answers.endDate && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className='bg-blue-50 p-4 rounded-lg border border-blue-100'
          >
            <p className='text-blue-800 font-medium'>
              {t('guidedBuilder.stayDuration', {
                fallback: 'Your stay will be approximately {{days}} days',
                days: calculateDays(answers.startDate, answers.endDate),
              })}
            </p>
          </motion.div>
        )}
      </motion.div>
    );
  };

  // Calculate days between dates
  const calculateDays = (startDate: string, endDate: string): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end dates
  };

  // Render numeric question
  const renderNumericQuestion = (question: Question) => {
    return (
      <motion.div variants={itemVariants} className='space-y-6'>
        <div className='max-w-xs mx-auto'>
          <div className='relative'>
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
              <Users className='h-5 w-5 text-gray-400' />
            </div>
            <input
              type='number'
              min='1'
              max='20'
              value={answers[question.id] || ''}
              onChange={(e) =>
                handleAnswerChange(question.id, parseInt(e.target.value, 10))
              }
              className='w-full pl-10 pr-4 py-3 text-xl border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center'
              placeholder='0'
            />
          </div>
        </div>

        {answers[question.id] && answers[question.id] > 8 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className='bg-amber-50 p-4 rounded-lg border border-amber-100'
          >
            <p className='text-amber-800'>
              {t('guidedBuilder.largeGroupTip', {
                fallback:
                  'For groups of 8+ people, we recommend exploring our premium services for the best experience.',
              })}
            </p>
          </motion.div>
        )}
      </motion.div>
    );
  };

  // Render single select question
  const renderSingleSelectQuestion = (question: Question) => {
    return (
      <motion.div variants={itemVariants} className='grid md:grid-cols-2 gap-4'>
        {question.options?.map((option) => (
          <div
            key={option.id}
            onClick={() => handleAnswerChange(question.id, option.id)}
            className={`
              p-4 border rounded-xl cursor-pointer transition-all
              ${
                answers[question.id] === option.id
                  ? packageType === 'standard'
                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                    : 'border-amber-500 bg-amber-50 ring-2 ring-amber-200'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }
            `}
          >
            <div className='flex items-start mb-2'>
              <div
                className={`
                p-2 rounded-full mr-3
                ${
                  answers[question.id] === option.id
                    ? packageType === 'standard'
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-amber-100 text-amber-600'
                    : 'bg-gray-100 text-gray-600'
                }
              `}
              >
                {option.icon}
              </div>
              <div className='flex-1'>
                <h3 className='font-semibold text-gray-900'>{option.label}</h3>
                {option.description && (
                  <p className='text-sm text-gray-600 mt-1'>
                    {option.description}
                  </p>
                )}
              </div>
              {answers[question.id] === option.id && (
                <div
                  className={`
                  ${
                    packageType === 'standard'
                      ? 'text-blue-500'
                      : 'text-amber-500'
                  }
                `}
                >
                  <Check className='h-5 w-5' />
                </div>
              )}
            </div>
          </div>
        ))}
      </motion.div>
    );
  };

  // Render multi select question
  const renderMultiSelectQuestion = (question: Question) => {
    // Initialize answers array if not set
    const selectedOptions = answers[question.id] || [];
    const maxReached =
      question.maxSelections &&
      selectedOptions.length >= question.maxSelections;

    return (
      <motion.div variants={itemVariants} className='space-y-6'>
        <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-3'>
          {question.options?.map((option) => {
            const isSelected = selectedOptions.includes(option.id);
            const isDisabled = maxReached && !isSelected;

            return (
              <div
                key={option.id}
                onClick={() => {
                  if (isDisabled) return;

                  const currentSelections = [...(answers[question.id] || [])];
                  if (isSelected) {
                    // Remove option
                    handleAnswerChange(
                      question.id,
                      currentSelections.filter((id) => id !== option.id)
                    );
                  } else {
                    // Add option
                    handleAnswerChange(question.id, [
                      ...currentSelections,
                      option.id,
                    ]);
                  }
                }}
                className={`
                  p-4 border rounded-xl cursor-pointer transition-all
                  ${isDisabled ? 'opacity-40 cursor-not-allowed' : ''}
                  ${
                    isSelected
                      ? packageType === 'standard'
                        ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-200'
                        : 'border-amber-500 bg-amber-50 ring-1 ring-amber-200'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }
                `}
              >
                <div className='flex items-center'>
                  <div
                    className={`
                    p-2 rounded-full mr-3
                    ${
                      isSelected
                        ? packageType === 'standard'
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-amber-100 text-amber-600'
                        : 'bg-gray-100 text-gray-600'
                    }
                  `}
                  >
                    {option.icon}
                  </div>
                  <h3 className='font-medium text-gray-900'>{option.label}</h3>
                  {isSelected && (
                    <div
                      className={`ml-auto
                      ${
                        packageType === 'standard'
                          ? 'text-blue-500'
                          : 'text-amber-500'
                      }
                    `}
                    >
                      <Check className='h-5 w-5' />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className='text-sm text-gray-600'>
          {t('guidedBuilder.selectionHint', {
            fallback: 'Select {{min}} to {{max}} options',
            min: question.minSelections || 1,
            max: question.maxSelections || question.options?.length,
          })}
          <span className='ml-2 font-medium'>
            ({selectedOptions.length}/
            {question.maxSelections || question.options?.length})
          </span>
        </div>
      </motion.div>
    );
  };

  return (
    <div className='max-w-4xl mx-auto py-8'>
      <div className='mb-8'>
        <h2 className='text-3xl font-bold text-gray-900 mb-4'>
          {t('guidedBuilder.mainTitle', {
            fallback: 'Create Your Perfect Vacation Package',
          })}
        </h2>
        <p className='text-gray-600'>
          {t('guidedBuilder.mainDescription', {
            fallback:
              'Answer a few questions to help us recommend the perfect services for your Punta Cana experience',
          })}
        </p>
      </div>

      {/* Progress indicator */}
      <div className='mb-8'>
        <div className='flex items-center justify-between'>
          {questions.map((question, index) => (
            <React.Fragment key={question.id}>
              <div className='flex flex-col items-center'>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors
                    ${
                      index < currentStep ||
                      (index === currentStep && isComplete)
                        ? packageType === 'standard'
                          ? 'bg-blue-500 text-white'
                          : 'bg-amber-500 text-white'
                        : index === currentStep
                        ? packageType === 'standard'
                          ? 'border-2 border-blue-500 text-blue-500'
                          : 'border-2 border-amber-500 text-amber-500'
                        : 'bg-gray-200 text-gray-500'
                    }
                  `}
                >
                  {index < currentStep ||
                  (index === currentStep && isComplete) ? (
                    <Check className='h-5 w-5' />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <span className='text-xs mt-1 text-gray-500'>
                  {getStepLabel(question)}
                </span>
              </div>

              {index < questions.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2
                    ${
                      index < currentStep
                        ? packageType === 'standard'
                          ? 'bg-blue-500'
                          : 'bg-amber-500'
                        : 'bg-gray-200'
                    }
                  `}
                ></div>
              )}
            </React.Fragment>
          ))}

          {/* Final recommendations step */}
          <div className='flex flex-col items-center'>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center
                ${
                  isComplete
                    ? packageType === 'standard'
                      ? 'bg-blue-500 text-white'
                      : 'bg-amber-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }
              `}
            >
              {isComplete ? (
                <Check className='h-5 w-5' />
              ) : (
                questions.length + 1
              )}
            </div>
            <span className='text-xs mt-1 text-gray-500'>
              {t('guidedBuilder.recommendationsStep', {
                fallback: 'Recommendations',
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Content area */}
      <AnimatePresence mode='wait'>{renderStepContent()}</AnimatePresence>
    </div>
  );
};

// Helper function to get a shorter label for the progress indicator
const getStepLabel = (question: Question): string => {
  switch (question.id) {
    case 'tripDates':
      return 'Dates';
    case 'groupSize':
      return 'Group';
    case 'tripPurpose':
      return 'Purpose';
    case 'interests':
      return 'Interests';
    default:
      return question.id;
  }
};

// Recommended Service Card component
interface RecommendedServiceCardProps {
  service: Service;
  isSelected: boolean;
  onSelect: () => void;
  packageType: 'standard' | 'premium';
}

const RecommendedServiceCard: React.FC<RecommendedServiceCardProps> = ({
  service,
  isSelected,
  onSelect,
  packageType,
}) => {
  const { t } = useTranslation();

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/images/placeholder-service.jpg';
  };

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -5 }}
      className={`
        bg-white rounded-lg shadow-sm overflow-hidden border transition-all
        ${
          isSelected
            ? packageType === 'standard'
              ? 'border-blue-500 ring-2 ring-blue-200'
              : 'border-amber-500 ring-2 ring-amber-200'
            : 'border-gray-200 hover:border-gray-300'
        }
      `}
    >
      <div className='h-40 relative overflow-hidden'>
        <Image
          src={service.img || `/images/services/${service.id}.jpg`}
          alt={service.name}
          fill
          className='object-cover transition-transform duration-500 hover:scale-105'
          onError={handleImageError}
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
        />
      </div>

      <div className='p-4'>
        <h3 className='font-medium text-gray-900 mb-2'>{service.name}</h3>
        <p className='text-sm text-gray-600 mb-4 line-clamp-2'>
          {service.description}
        </p>

        <div className='flex justify-between items-center text-sm mb-4'>
          <div className='flex items-center text-gray-700'>
            <Clock className='mr-1 h-4 w-4 text-gray-500' />
            <span>
              {service.duration} {service.duration === 1 ? 'hour' : 'hours'}
            </span>
          </div>
          <span className='font-medium'>${service.price}</span>
        </div>

        <button
          onClick={onSelect}
          className={`
            w-full py-2 px-4 rounded font-medium flex items-center justify-center transition-colors
            ${
              isSelected
                ? packageType === 'standard'
                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                : packageType === 'standard'
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-amber-500 text-white hover:bg-amber-600'
            }
          `}
        >
          {isSelected ? (
            <>
              <Check className='mr-1 h-4 w-4' />
              {t('guidedBuilder.selected', { fallback: 'Selected' })}
            </>
          ) : (
            <>
              <Plus className='mr-1 h-4 w-4' />
              {t('guidedBuilder.addToPackage', { fallback: 'Add to Package' })}
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default GuidedPackageBuilder;
