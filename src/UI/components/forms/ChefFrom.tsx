import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { Service } from '@/types/type';
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  DollarSign,
  Gift,
  AlertCircle,
  MessageCircle,
  CreditCard,
  ChevronRight,
  ChevronLeft,
  Check,
  ChefHat,
  Utensils,
  Info,
} from 'lucide-react';

interface ChefFormProps {
  service: Service;
  onSubmit: (formData: any) => void;
  onCancel: () => void;
}

// Define cuisine types
const cuisineTypes = [
  {
    id: 'local',
    name: 'Local & Traditional',
    description: 'Local specialties and regional dishes',
    price: 0,
  },
  {
    id: 'mediterranean',
    name: 'Mediterranean',
    description: 'Fresh seafood, olive oil, and herbs',
    price: 20,
  },
  {
    id: 'italian',
    name: 'Italian',
    description: 'Pastas, risottos, and authentic Italian flavors',
    price: 20,
  },
  {
    id: 'asian',
    name: 'Asian Fusion',
    description: 'A blend of Asian flavors and techniques',
    price: 30,
  },
  {
    id: 'japanese',
    name: 'Japanese',
    description: 'Sushi, sashimi, and traditional Japanese dishes',
    price: 40,
  },
  {
    id: 'french',
    name: 'French',
    description: 'Classic French cuisine with elegant presentation',
    price: 40,
  },
];

// Define budget options
const budgetOptions = [
  {
    id: 'standard',
    name: 'Standard',
    description: 'Great quality at an accessible price',
    price: 0,
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Enhanced ingredients and presentation',
    price: 100,
  },
  {
    id: 'luxury',
    name: 'Luxury',
    description: 'Exclusive ingredients and gourmet experience',
    price: 250,
  },
];

// Define occasion types
const occasionTypes = [
  {
    id: 'casual',
    name: 'Casual Dinner',
    description: 'Relaxed dining experience',
  },
  {
    id: 'romantic',
    name: 'Romantic Dinner',
    description: 'Special dinner for couples',
  },
  {
    id: 'celebration',
    name: 'Celebration',
    description: 'Birthday, anniversary or special occasion',
  },
  {
    id: 'family',
    name: 'Family Gathering',
    description: 'Meal for family and children',
  },
  {
    id: 'business',
    name: 'Business Dinner',
    description: 'Professional gathering with colleagues',
  },
];

// Example chef's special menu items
const chefsSpecialMenus = [
  {
    id: 'mediterranean',
    title: 'Mediterranean Delight',
    description:
      'A journey through the Mediterranean with fresh seafood, olive oils, and regional spices',
    courses: [
      {
        name: 'Greek Mezze Platter',
        description:
          'Selection of hummus, tzatziki, olives, and warm pita bread',
      },
      {
        name: 'Seafood Paella',
        description:
          'Traditional Spanish rice dish with fresh seafood and saffron',
      },
      {
        name: 'Baklava',
        description: 'Honey-soaked layers of filo pastry with pistachios',
      },
    ],
    price: 85,
  },
  {
    id: 'local',
    title: 'Local Favorites',
    description:
      'Experience the best local flavors prepared with a gourmet twist',
    courses: [
      {
        name: 'Fresh Ceviche',
        description: 'Locally caught fish marinated in citrus juices',
      },
      {
        name: 'Slow-Roasted Pork',
        description: 'Traditional style with local spices and plantains',
      },
      {
        name: 'Coconut Flan',
        description: 'Classic dessert with a tropical touch',
      },
    ],
    price: 70,
  },
  {
    id: 'luxury',
    title: 'Luxury Tasting Experience',
    description:
      'A premium culinary journey with the finest ingredients and expert preparation',
    courses: [
      {
        name: 'Truffle and Wild Mushroom Soup',
        description: 'With black truffle oil and crispy shallots',
      },
      {
        name: 'Wagyu Beef',
        description: 'Premium grade Wagyu with red wine reduction',
      },
      {
        name: 'Gold Leaf Chocolate Soufflé',
        description: 'With Madagascar vanilla bean ice cream',
      },
    ],
    price: 150,
  },
];

const ChefForm: React.FC<ChefFormProps> = ({ service, onSubmit, onCancel }) => {
  const { t } = useTranslation();

  // State for multi-step form
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  // Form data state
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    occasion: '',
    location: '',
    guestCount: 2,
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

  // Show chef's special menu selection
  const [showSpecialMenu, setShowSpecialMenu] = useState(false);

  // Calculate price based on selections
  useEffect(() => {
    let totalPrice = service.price;

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
        totalPrice += selectedBudget.price;
      }
    }

    // Add price if a chef's special menu is selected (and reset other prices)
    if (formData.selectedSpecialMenu) {
      const selectedMenu = chefsSpecialMenus.find(
        (menu) => menu.id === formData.selectedSpecialMenu
      );
      if (selectedMenu) {
        // Chef's special includes cuisine type and base price
        totalPrice = service.price + selectedMenu.price * formData.guestCount;

        // Still add premium/luxury budget if selected
        if (formData.budgetOption !== 'standard') {
          const selectedBudget = budgetOptions.find(
            (budget) => budget.id === formData.budgetOption
          );
          if (selectedBudget) {
            totalPrice += selectedBudget.price;
          }
        }
      }
    }

    setCurrentPrice(totalPrice);
  }, [
    service.price,
    formData.guestCount,
    formData.cuisineType,
    formData.budgetOption,
    formData.selectedSpecialMenu,
  ]);

  // Form validation for each step
  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1: // Date, time, occasion, location
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

        if (!formData.location) {
          newErrors.location = t('form.errors.required', {
            fallback: 'Location is required',
          });
        }

        if (!formData.occasion) {
          newErrors.occasion = t('form.errors.required', {
            fallback: 'Occasion is required',
          });
        }
        break;

      case 2: // Guest count
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
        break;

      case 3: // Cuisine type and budget
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

      case 4: // Dietary restrictions (optional field, no validation needed)
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

      case 5: // Event description
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

  // Navigate to next step
  const goToNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Navigate to previous step
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

  // Handle cuisine type selection
  const handleCuisineSelect = (cuisineId: string) => {
    setFormData({
      ...formData,
      cuisineType: cuisineId,
      selectedSpecialMenu: '', // Reset special menu when cuisine changes
    });

    // Clear error
    if (errors.cuisineType) {
      setErrors({
        ...errors,
        cuisineType: '',
      });
    }
  };

  // Handle budget option selection
  const handleBudgetSelect = (budgetId: string) => {
    setFormData({
      ...formData,
      budgetOption: budgetId,
    });

    // Clear error
    if (errors.budgetOption) {
      setErrors({
        ...errors,
        budgetOption: '',
      });
    }
  };

  // Handle special menu selection
  const handleSpecialMenuSelect = (menuId: string) => {
    const selectedMenu = chefsSpecialMenus.find((menu) => menu.id === menuId);

    if (selectedMenu) {
      setFormData({
        ...formData,
        selectedSpecialMenu: menuId,
        cuisineType: selectedMenu.id, // Set matching cuisine type
      });
    } else {
      setFormData({
        ...formData,
        selectedSpecialMenu: '',
      });
    }
  };

  // Update guest count
  const updateGuestCount = (increment: boolean) => {
    setFormData((prev) => ({
      ...prev,
      guestCount: increment
        ? Math.min(20, prev.guestCount + 1)
        : Math.max(1, prev.guestCount - 1),
    }));

    // Clear error
    if (errors.guestCount) {
      setErrors({
        ...errors,
        guestCount: '',
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
      onSubmit({
        ...formData,
        totalPrice: currentPrice,
      });
    } else {
      // Otherwise, go to next step
      goToNextStep();
    }
  };

  // Get minimum date (tomorrow) for the date picker
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // Progress bar calculation
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <form onSubmit={handleSubmit} className='w-full mx-auto overflow-hidden'>
      <div className='bg-white rounded-xl shadow-lg border border-gray-100'>
        {/* Form Header */}
        <div className='bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 p-6 text-white'>
          <h2 className='text-2xl font-light tracking-wide'>
            {t('chef.form.title', { fallback: 'Personal Chef Booking' })}
          </h2>
          <p className='text-amber-100 mt-1 font-light'>
            {t('chef.form.subtitle', {
              fallback:
                'Create a unique culinary experience in the comfort of your accommodation',
            })}
          </p>

          {/* Progress bar */}
          <div className='mt-6'>
            <div className='flex justify-between text-xs text-amber-200 mb-1'>
              <span>
                Step {currentStep} of {totalSteps}
              </span>
              <span>{Math.round(progressPercentage)}% Complete</span>
            </div>
            <div className='w-full bg-amber-950/50 rounded-full h-2.5'>
              <div
                className='bg-amber-400 h-2.5 rounded-full transition-all duration-300'
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <div className='p-8 space-y-8'>
          {/* Step 1: Basic Details */}
          {currentStep === 1 && (
            <div className='space-y-6'>
              <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2 flex items-center'>
                <Calendar className='w-5 h-5 mr-2 text-amber-600' />
                {t('chef.form.step1.title', { fallback: 'When & Where' })}
              </h3>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {/* Date Field */}
                <div>
                  <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                    <Calendar className='w-4 h-4 mr-2 text-amber-700' />
                    {t('chef.form.date', { fallback: 'Date' })} *
                  </label>
                  <input
                    type='date'
                    name='date'
                    value={formData.date}
                    onChange={handleChange}
                    min={getMinDate()}
                    className={`w-full p-3 border ${
                      errors.date ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:ring-amber-500 focus:border-amber-500 bg-gray-50`}
                  />
                  {errors.date && (
                    <p className='text-red-500 text-xs mt-1'>{errors.date}</p>
                  )}
                </div>

                {/* Time Field */}
                <div>
                  <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                    <Clock className='w-4 h-4 mr-2 text-amber-700' />
                    {t('chef.form.time', { fallback: 'Time' })} *
                  </label>
                  <select
                    name='time'
                    value={formData.time}
                    onChange={handleChange}
                    className={`w-full p-3 border ${
                      errors.time ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:ring-amber-500 focus:border-amber-500 bg-gray-50`}
                  >
                    <option value=''>Select a time</option>
                    <optgroup label='Lunch'>
                      <option value='12:00'>12:00 PM</option>
                      <option value='12:30'>12:30 PM</option>
                      <option value='13:00'>1:00 PM</option>
                      <option value='13:30'>1:30 PM</option>
                      <option value='14:00'>2:00 PM</option>
                    </optgroup>
                    <optgroup label='Dinner'>
                      <option value='18:00'>6:00 PM</option>
                      <option value='18:30'>6:30 PM</option>
                      <option value='19:00'>7:00 PM</option>
                      <option value='19:30'>7:30 PM</option>
                      <option value='20:00'>8:00 PM</option>
                      <option value='20:30'>8:30 PM</option>
                    </optgroup>
                  </select>
                  {errors.time && (
                    <p className='text-red-500 text-xs mt-1'>{errors.time}</p>
                  )}
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>
                {/* Location Field */}
                <div>
                  <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                    <MapPin className='w-4 h-4 mr-2 text-amber-700' />
                    {t('chef.form.location', { fallback: 'Location' })} *
                  </label>
                  <select
                    name='location'
                    value={formData.location}
                    onChange={handleChange}
                    className={`w-full p-3 border ${
                      errors.location ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:ring-amber-500 focus:border-amber-500 bg-gray-50`}
                  >
                    <option value=''>Select a location</option>
                    <option value='villa'>Your Villa/Accommodation</option>
                    <option value='beach'>Private Beach Setup</option>
                    <option value='yacht'>On a Yacht/Boat</option>
                    <option value='garden'>Garden/Outdoor Setting</option>
                  </select>
                  {errors.location && (
                    <p className='text-red-500 text-xs mt-1'>
                      {errors.location}
                    </p>
                  )}
                </div>

                {/* Occasion Field */}
                <div>
                  <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                    <Gift className='w-4 h-4 mr-2 text-amber-700' />
                    {t('chef.form.occasion', { fallback: 'Occasion' })} *
                  </label>
                  <select
                    name='occasion'
                    value={formData.occasion}
                    onChange={handleChange}
                    className={`w-full p-3 border ${
                      errors.occasion ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:ring-amber-500 focus:border-amber-500 bg-gray-50`}
                  >
                    <option value=''>Select occasion</option>
                    {occasionTypes.map((occasion) => (
                      <option key={occasion.id} value={occasion.id}>
                        {occasion.name}
                      </option>
                    ))}
                    <option value='other'>Other</option>
                  </select>
                  {errors.occasion && (
                    <p className='text-red-500 text-xs mt-1'>
                      {errors.occasion}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Guest Count */}
          {currentStep === 2 && (
            <div className='space-y-6'>
              <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2 flex items-center'>
                <Users className='w-5 h-5 mr-2 text-amber-600' />
                {t('chef.form.step2.title', { fallback: 'Number of Guests' })}
              </h3>

              <div className='bg-amber-50 rounded-lg p-6 border border-amber-100'>
                <label className='flex items-center text-lg font-medium text-gray-800 mb-4'>
                  <Users className='w-5 h-5 mr-2 text-amber-700' />
                  {t('chef.form.guestCount', {
                    fallback: 'How many guests will be dining?',
                  })}{' '}
                  *
                </label>

                <div className='flex items-center justify-center'>
                  <button
                    type='button'
                    onClick={() => updateGuestCount(false)}
                    className='w-12 h-12 rounded-full bg-white text-amber-700 border border-amber-200 hover:bg-amber-100 flex items-center justify-center text-xl font-bold'
                  >
                    -
                  </button>

                  <div className='mx-8 text-center'>
                    <div className='text-4xl font-light text-amber-800'>
                      {formData.guestCount}
                    </div>
                    <div className='text-sm text-amber-700 mt-1'>
                      {formData.guestCount === 1 ? 'Guest' : 'Guests'}
                    </div>
                  </div>

                  <button
                    type='button'
                    onClick={() => updateGuestCount(true)}
                    className='w-12 h-12 rounded-full bg-white text-amber-700 border border-amber-200 hover:bg-amber-100 flex items-center justify-center text-xl font-bold'
                  >
                    +
                  </button>
                </div>

                {errors.guestCount && (
                  <p className='text-red-500 text-sm mt-4 text-center'>
                    {errors.guestCount}
                  </p>
                )}

                <p className='mt-6 text-sm text-amber-700 text-center'>
                  <AlertCircle className='inline-block w-4 h-4 mr-1' />
                  Base price is for 2 guests. Additional guests: $50 per person.
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Cuisine Type and Budget */}
          {currentStep === 3 && (
            <div className='space-y-6'>
              <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2 flex items-center'>
                <Utensils className='w-5 h-5 mr-2 text-amber-600' />
                {t('chef.form.step3.title', { fallback: 'Cuisine & Budget' })}
              </h3>

              {!showSpecialMenu ? (
                <>
                  {/* Cuisine Selection */}
                  <div>
                    <label className='block text-lg font-medium text-gray-800 mb-3'>
                      {t('chef.form.cuisineType', {
                        fallback: 'What cuisine would you like?',
                      })}{' '}
                      *
                    </label>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      {cuisineTypes.map((cuisine) => (
                        <div
                          key={cuisine.id}
                          onClick={() => handleCuisineSelect(cuisine.id)}
                          className={`
                            p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md
                            ${
                              formData.cuisineType === cuisine.id
                                ? 'border-amber-500 bg-amber-50'
                                : 'border-gray-200 hover:border-amber-300'
                            }
                          `}
                        >
                          <div className='flex justify-between items-center'>
                            <h4 className='font-medium text-gray-900'>
                              {cuisine.name}
                            </h4>
                            {cuisine.price > 0 && (
                              <span className='text-amber-700 font-medium'>
                                +${cuisine.price}
                              </span>
                            )}
                          </div>
                          <p className='text-sm text-gray-600 mt-1'>
                            {cuisine.description}
                          </p>

                          {formData.cuisineType === cuisine.id && (
                            <div className='mt-2 flex justify-end'>
                              <div className='w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center'>
                                <Check className='w-4 h-4 text-white' />
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {errors.cuisineType && (
                      <p className='text-red-500 text-sm mt-2'>
                        {errors.cuisineType}
                      </p>
                    )}

                    <div className='mt-4 text-center'>
                      <button
                        type='button'
                        onClick={() => setShowSpecialMenu(true)}
                        className='inline-flex items-center text-amber-700 hover:text-amber-800 underline underline-offset-2 font-medium'
                      >
                        <ChefHat className='w-4 h-4 mr-1' />
                        Need inspiration? Try Chef Special Menus
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Chef's Special Menu Selection */}
                  <div>
                    <div className='flex justify-between items-center mb-3'>
                      <label className='block text-lg font-medium text-gray-800'>
                        {t('chef.form.specialMenu', {
                          fallback: "Chef's Special Menus",
                        })}
                      </label>
                      <button
                        type='button'
                        onClick={() => setShowSpecialMenu(false)}
                        className='text-amber-700 hover:text-amber-800 underline underline-offset-2 text-sm'
                      >
                        Back to Cuisine Selection
                      </button>
                    </div>

                    <div className='space-y-4'>
                      {chefsSpecialMenus.map((menu) => (
                        <div
                          key={menu.id}
                          onClick={() => handleSpecialMenuSelect(menu.id)}
                          className={`
                            p-5 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md
                            ${
                              formData.selectedSpecialMenu === menu.id
                                ? 'border-amber-500 bg-amber-50'
                                : 'border-gray-200 hover:border-amber-300'
                            }
                          `}
                        >
                          <div className='flex justify-between items-start'>
                            <div>
                              <h4 className='font-medium text-lg text-gray-900'>
                                {menu.title}
                              </h4>
                              <p className='text-sm text-gray-600 mt-1'>
                                {menu.description}
                              </p>
                            </div>
                            <span className='text-amber-700 font-medium whitespace-nowrap ml-2'>
                              ${menu.price} per person
                            </span>
                          </div>

                          <div className='mt-4 bg-white/80 rounded-lg p-3 border border-gray-100'>
                            <h5 className='font-medium text-gray-800 mb-2'>
                              Sample Menu:
                            </h5>
                            <ul className='space-y-2'>
                              {menu.courses.map((course, idx) => (
                                <li key={idx} className='text-sm'>
                                  <span className='font-medium'>
                                    {course.name}:
                                  </span>{' '}
                                  {course.description}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {formData.selectedSpecialMenu === menu.id && (
                            <div className='mt-2 flex justify-end'>
                              <div className='w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center'>
                                <Check className='w-4 h-4 text-white' />
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Budget Selection */}
              <div className='mt-8'>
                <label className='block text-lg font-medium text-gray-800 mb-3'>
                  {t('chef.form.budget', {
                    fallback: 'Choose your budget experience',
                  })}{' '}
                  *
                </label>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  {budgetOptions.map((option) => (
                    <div
                      key={option.id}
                      onClick={() => handleBudgetSelect(option.id)}
                      className={`
                        p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md
                 
                          ${
                            formData.budgetOption === option.id
                              ? 'border-amber-500 bg-amber-50'
                              : 'border-gray-200 hover:border-amber-300'
                          }
                          `}
                    >
                      <div className='flex justify-between items-center'>
                        <h4 className='font-medium text-gray-900'>
                          {option.name}
                        </h4>
                        {option.price > 0 && (
                          <span className='text-amber-700 font-medium'>
                            +${option.price}
                          </span>
                        )}
                      </div>
                      <p className='text-sm text-gray-600 mt-1'>
                        {option.description}
                      </p>

                      {formData.budgetOption === option.id && (
                        <div className='mt-2 flex justify-end'>
                          <div className='w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center'>
                            <Check className='w-4 h-4 text-white' />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {errors.budgetOption && (
                  <p className='text-red-500 text-sm mt-2'>
                    {errors.budgetOption}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Dietary Restrictions */}
          {currentStep === 4 && (
            <div className='space-y-6'>
              <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2 flex items-center'>
                <AlertCircle className='w-5 h-5 mr-2 text-amber-600' />
                {t('chef.form.step4.title', {
                  fallback: 'Dietary Restrictions',
                })}
              </h3>

              <div>
                <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                  <AlertCircle className='w-4 h-4 mr-2 text-amber-700' />
                  {t('chef.form.dietaryRestrictions', {
                    fallback: 'Any dietary restrictions or allergies?',
                  })}
                </label>
                <textarea
                  name='dietaryRestrictions'
                  value={formData.dietaryRestrictions}
                  onChange={handleChange}
                  placeholder='Please list any allergies, intolerances, or dietary preferences (e.g., vegetarian, vegan, gluten-free, nut allergies, etc.)'
                  className={`w-full p-3 border ${
                    errors.dietaryRestrictions
                      ? 'border-red-500'
                      : 'border-gray-300'
                  } rounded-lg focus:ring-amber-500 focus:border-amber-500 bg-gray-50 min-h-[150px]`}
                ></textarea>
                {errors.dietaryRestrictions && (
                  <p className='text-red-500 text-xs mt-1'>
                    {errors.dietaryRestrictions}
                  </p>
                )}
                <p className='text-xs text-gray-500 mt-1'>
                  {formData.dietaryRestrictions
                    ? `${formData.dietaryRestrictions.length}/500 characters`
                    : 'Optional, but highly recommended if applicable'}
                </p>
              </div>

              {/* Severe Allergies Checkbox */}
              <div className='flex items-center bg-amber-50 p-4 rounded-lg border border-amber-200 mt-4'>
                <input
                  type='checkbox'
                  id='hasAllergies'
                  name='hasAllergies'
                  checked={formData.hasAllergies}
                  onChange={handleChange}
                  className='h-4 w-4 text-amber-700 focus:ring-amber-500 border-amber-300 rounded'
                />
                <label htmlFor='hasAllergies' className='ml-2 text-amber-800'>
                  {t('chef.form.severeAllergies', {
                    fallback:
                      'I or my guests have severe allergies that require special attention',
                  })}
                </label>
              </div>

              <div className='bg-gray-50 p-4 rounded-lg border border-gray-200 mt-4'>
                <div className='flex items-start'>
                  <Info className='w-5 h-5 text-gray-500 mr-2 flex-shrink-0 mt-0.5' />
                  <p className='text-sm text-gray-600'>
                    Our chefs take dietary requirements very seriously. Please
                    be specific about any allergies or restrictions to ensure we
                    can prepare a safe and enjoyable meal for all guests.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Event Description */}
          {currentStep === 5 && (
            <div className='space-y-6'>
              <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2 flex items-center'>
                <MessageCircle className='w-5 h-5 mr-2 text-amber-600' />
                {t('chef.form.step5.title', {
                  fallback: 'Describe Your Event',
                })}
              </h3>

              <div>
                <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                  <MessageCircle className='w-4 h-4 mr-2 text-amber-700' />
                  {t('chef.form.eventDescription', {
                    fallback:
                      'Tell us about your event and any special requests',
                  })}{' '}
                  *
                </label>
                <textarea
                  name='eventDescription'
                  value={formData.eventDescription}
                  onChange={handleChange}
                  placeholder='Share any details that will help our chef prepare the perfect meal. Mention preferred dishes, cooking styles, or specific requests for your occasion.'
                  className={`w-full p-3 border ${
                    errors.eventDescription
                      ? 'border-red-500'
                      : 'border-gray-300'
                  } rounded-lg focus:ring-amber-500 focus:border-amber-500 bg-gray-50 min-h-[200px]`}
                ></textarea>
                {errors.eventDescription && (
                  <p className='text-red-500 text-xs mt-1'>
                    {errors.eventDescription}
                  </p>
                )}
                <p className='text-xs text-gray-500 mt-1'>
                  {formData.eventDescription
                    ? `${formData.eventDescription.length}/1000 characters`
                    : ''}
                </p>
              </div>

              <div className='bg-amber-50 p-6 rounded-lg border border-amber-100 mt-6'>
                <h4 className='font-medium text-amber-800 flex items-center mb-3'>
                  <ChefHat className='w-5 h-5 mr-2' />
                  Your Chef Will Prepare:
                </h4>

                <ul className='space-y-2'>
                  <li className='flex items-start'>
                    <Check className='w-4 h-4 text-amber-600 mr-2 mt-1' />
                    <span className='text-amber-800'>
                      {formData.selectedSpecialMenu
                        ? `${
                            chefsSpecialMenus.find(
                              (m) => m.id === formData.selectedSpecialMenu
                            )?.title || "Chef's Special Menu"
                          }`
                        : `${
                            cuisineTypes.find(
                              (c) => c.id === formData.cuisineType
                            )?.name || 'Selected'
                          } cuisine`}
                    </span>
                  </li>
                  <li className='flex items-start'>
                    <Check className='w-4 h-4 text-amber-600 mr-2 mt-1' />
                    <span className='text-amber-800'>
                      A{' '}
                      {budgetOptions
                        .find((b) => b.id === formData.budgetOption)
                        ?.name.toLowerCase() || 'customized'}{' '}
                      dining experience
                    </span>
                  </li>
                  <li className='flex items-start'>
                    <Check className='w-4 h-4 text-amber-600 mr-2 mt-1' />
                    <span className='text-amber-800'>
                      For {formData.guestCount}{' '}
                      {formData.guestCount === 1 ? 'guest' : 'guests'} at your{' '}
                      {formData.location === 'villa'
                        ? 'accommodation'
                        : formData.location === 'beach'
                        ? 'private beach setting'
                        : formData.location === 'yacht'
                        ? 'yacht or boat'
                        : formData.location === 'garden'
                        ? 'garden or outdoor location'
                        : 'selected location'}
                    </span>
                  </li>
                  {formData.dietaryRestrictions && (
                    <li className='flex items-start'>
                      <Check className='w-4 h-4 text-amber-600 mr-2 mt-1' />
                      <span className='text-amber-800'>
                        Accommodating your specified dietary requirements
                      </span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Form Footer with Total Price and Navigation */}
        <div className='bg-gray-900 text-white p-6 flex flex-col md:flex-row items-center justify-between'>
          {/* Price calculation */}
          <div className='flex flex-col items-center md:items-start mb-4 md:mb-0'>
            <span className='text-gray-400 text-sm uppercase tracking-wide'>
              {t('chef.form.totalPrice', { fallback: 'Total Price' })}
            </span>
            <div className='flex items-center mt-1'>
              <span className='text-3xl font-light'>
                ${currentPrice.toFixed(2)}
              </span>
              {formData.guestCount > 2 && (
                <span className='ml-2 text-sm bg-amber-800 px-2 py-1 rounded'>
                  {formData.guestCount} guests
                </span>
              )}
            </div>
          </div>

          {/* Navigation buttons */}
          <div className='flex space-x-4'>
            {/* Cancel button */}
            {currentStep === 1 ? (
              <button
                type='button'
                onClick={onCancel}
                className='px-5 py-3 border border-gray-700 rounded-lg text-gray-300 hover:text-white hover:border-gray-600 transition'
              >
                {t('common.cancel', { fallback: 'Cancel' })}
              </button>
            ) : (
              <button
                type='button'
                onClick={goToPreviousStep}
                className='px-5 py-3 border border-gray-700 rounded-lg text-gray-300 hover:text-white hover:border-gray-600 transition flex items-center'
              >
                <ChevronLeft className='h-4 w-4 mr-1' />
                {t('common.back', { fallback: 'Back' })}
              </button>
            )}

            {/* Next/Submit button */}
            <button
              type={currentStep === totalSteps ? 'submit' : 'button'}
              onClick={currentStep === totalSteps ? undefined : goToNextStep}
              className='px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition flex items-center'
            >
              {currentStep === totalSteps ? (
                <>
                  <CreditCard className='h-4 w-4 mr-2' />
                  {t('chef.form.bookNow', { fallback: 'Book Now' })}
                </>
              ) : (
                <>
                  {t('common.next', { fallback: 'Next' })}
                  <ChevronRight className='h-4 w-4 ml-1' />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ChefForm;
