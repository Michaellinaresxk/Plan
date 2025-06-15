import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { Service } from '@/types/type';
import {
  Calendar,
  Clock,
  Users,
  Baby,
  CheckCircle,
  Heart,
  MessageSquare,
  CreditCard,
  AlertCircle,
  Info,
  Shield,
  DollarSign,
  MapPin,
} from 'lucide-react';
import ServiceManager from '@/constants/services/ServiceManager';

interface BabysitterFormProps {
  service: Service;
  onSubmit: (formData: any) => void;
  onCancel: () => void;
}

const BabysitterForm: React.FC<BabysitterFormProps> = ({
  service,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    childrenCount: 1,
    childrenAges: [''],
    hasSpecialNeeds: false,
    specialNeedsDetails: '',
    specialRequests: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentPrice, setCurrentPrice] = useState(service.price);

  // Get service data
  const serviceData = ServiceManager.getData(service.id);

  // Get minimum booking duration from service data
  const minimumBooking = serviceData?.metaData?.minimumBooking
    ? parseInt(serviceData.metaData.minimumBooking.toString())
    : 3; // Default minimum is 3 hours

  // Calculate price based on form data
  useEffect(() => {
    let price = service.price;

    // Calculate duration in hours if both times are set
    if (formData.startTime && formData.endTime) {
      const start = new Date(`2000-01-01T${formData.startTime}`);
      const end = new Date(`2000-01-01T${formData.endTime}`);

      // If end time is earlier than start time, assume it's the next day
      let duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      if (duration < 0) {
        duration += 24;
      }

      // Apply minimum booking check
      duration = Math.max(duration, minimumBooking);

      // Apply hourly rate
      price = price * duration;
    }

    // Additional child fee
    const additionalChildFee = 10; // $10 per additional child
    if (formData.childrenCount > 1) {
      price += (formData.childrenCount - 1) * additionalChildFee;
    }

    // Special needs fee if applicable
    if (formData.hasSpecialNeeds) {
      price += 15; // $15 surcharge for special needs care
    }

    setCurrentPrice(price);
  }, [
    formData.startTime,
    formData.endTime,
    formData.location,
    formData.childrenCount,
    formData.hasSpecialNeeds,
    service.price,
    minimumBooking,
  ]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const newErrors: Record<string, string> = {};

    if (!formData.date) {
      newErrors.date = t('form.errors.required');
    }

    if (!formData.startTime) {
      newErrors.startTime = t('form.errors.required');
    }

    if (!formData.endTime) {
      newErrors.endTime = t('form.errors.required');
    }

    // validade location required
    if (!formData.location) {
      newErrors.location = t('form.errors.required');
    }

    // Validate children ages are filled
    const filledAges = formData.childrenAges.filter((age) => age.trim() !== '');
    if (filledAges.length < formData.childrenCount) {
      newErrors.childrenAges = t('form.errors.fillAllAges');
    }

    // Validate special needs details if that option is selected
    if (formData.hasSpecialNeeds && !formData.specialNeedsDetails.trim()) {
      newErrors.specialNeedsDetails = t('form.errors.required');
    }

    setErrors(newErrors);

    // Submit if no errors
    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
    }
  };

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    if (name === 'hasSpecialNeeds' && !checked) {
      // If turning off special needs, reset details
      setFormData((prev) => ({
        ...prev,
        hasSpecialNeeds: checked,
        specialNeedsDetails: '',
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  // Handle children count changes
  const updateChildrenCount = (increment: boolean) => {
    setFormData((prev) => {
      const newCount = increment
        ? prev.childrenCount + 1
        : Math.max(1, prev.childrenCount - 1);

      // Update ages array to match the new count
      let newAges = [...prev.childrenAges];
      if (increment) {
        newAges.push(''); // Add empty age for new child
      } else if (prev.childrenCount > 1) {
        newAges = newAges.slice(0, -1); // Remove last age
      }

      return {
        ...prev,
        childrenCount: newCount,
        childrenAges: newAges,
      };
    });
  };

  // Handle child age changes
  const handleAgeChange = (index: number, value: string) => {
    setFormData((prev) => {
      const newAges = [...prev.childrenAges];
      newAges[index] = value;
      return {
        ...prev,
        childrenAges: newAges,
      };
    });
  };

  return (
    <form onSubmit={handleSubmit} className='w-full mx-auto overflow-hidden'>
      <div className='bg-white rounded-2xl shadow-lg border-t-8 border-purple-500'>
        {/* Form Header - Kid-friendly Style */}
        <div className='bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 p-6 relative overflow-hidden'>
          {/* Decorative elements */}
          <div className='absolute top-0 right-0 w-64 h-64 opacity-10'>
            <svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'>
              <path
                fill='#FFFFFF'
                d='M42.8,-62.2C54.9,-56.3,63.7,-42.8,69.8,-28.5C75.9,-14.2,79.3,0.9,75.2,14.3C71.2,27.7,59.7,39.3,46.8,47.3C34,55.3,19.8,59.7,4.9,63C-10,66.3,-25.6,68.6,-37.7,62.3C-49.8,56,-58.4,41.2,-62.5,26.2C-66.6,11.3,-66.2,-3.9,-63.6,-19.3C-61,-34.7,-56.1,-50.3,-45.5,-56.7C-34.9,-63,-17.5,-60,-1.4,-58C14.7,-55.9,30.7,-68.1,42.8,-62.2Z'
                transform='translate(100 100)'
              />
            </svg>
          </div>

          <div className='relative z-10'>
            <h2 className='text-3xl font-bold text-white tracking-wide flex items-center'>
              <Baby className='w-8 h-8 mr-3' />
              {t('services.babysitter.luxuryBooking', 'Happy Kids Babysitting')}
            </h2>
            <p className='text-purple-100 mt-2 text-lg'>
              {t(
                'services.babysitter.luxuryDescription',
                'Professional childcare in the comfort of your accommodation'
              )}
            </p>
          </div>
        </div>

        {/* Form Body */}
        <div className='p-8 space-y-8 relative'>
          {/* Background patterns */}
          <div className='absolute -right-6 top-40 opacity-5 w-40 h-40 rotate-12'>
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'>
              <path
                fill='currentColor'
                d='M500.203,196.093l-64.293,5.6-57.604-78.094c-2.604-3.604-6.703-5.604-11.096-5.604 c-0.5,0-1.102,0-1.602,0.102c-4.898,0.5-9.199,3.5-11.199,8l-44.699,97.797l-84.793-147.09 c-2.398-4.301-6.898-6.801-11.797-6.801c-4.898,0-9.398,2.5-11.797,6.801l-84.793,147.09L72.789,126.3 c-2-4.5-6.301-7.5-11.199-8c-4.801-0.5-9.602,1.5-12.699,5.5L5.289,201.792c-4.199,5.402-4.102,13.004,0.199,18.305 c4.301,5.301,11.801,7,17.896,4.301l58.09-25.9l39.902,74.09c1.199,2.301,2.602,4.102,4.398,5.602 c6.699,5.201,16.898,3.9,21.797-3l71.895-102.691l58.504,162.888c1.5,4.301,5.199,7.5,9.799,8.398 c0.898,0.102,1.699,0.203,2.5,0.203c3.598,0,7.098-1.5,9.699-4.102l76.891-78.792l76.797,38.695 c2,1,4.102,1.5,6.199,1.5c7,0,13.199-4.699,15-11.5C478.305,276.487,515.105,227.389,500.203,196.093z'
              ></path>
            </svg>
          </div>
          <div className='absolute left-4 bottom-40 opacity-5 w-40 h-40 -rotate-12'>
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'>
              <path
                fill='currentColor'
                d='M501.905 10.593C489.743-1.57 468.721-2.766 456.56 10.086L416.717 46.576L347.621 15.71a23.803 23.803 0 0 0-28.06 7.72l-51.15 74.893L157.188 25.103a23.832 23.832 0 0 0-28.46.82L12.543 128.39c-11.95 10.894-12.003 31.375-.053 42.268 11.95 10.894 31.347 9.914 43.408-1.09l93.338-84.593 110.233 72.32a23.784 23.784 0 0 0 30.322-4.962l51.15-74.892 47.289 21.097-10.675 43.653a23.786 23.786 0 0 0 6.56 22.43l57.47 50.412-39.626 48.103-94.697-42.414a23.803 23.803 0 0 0-25.47 3.723l-48.103 39.625-49.199-22.93a23.827 23.827 0 0 0-27.136 5.01l-84.593 93.339-104.9-52.076c-14.142-6.982-31.302-1.156-38.336 12.992-7.034 14.15-1.172 31.899 12.97 38.88l117.773 58.497c8.797 4.358 18.988 1.818 25.506-6.414l76.144-84.058 44.84 20.901a23.798 23.798 0 0 0 24.992-2.776l42.268-34.795 92.89 42.268a23.827 23.827 0 0 0 27.135-5.01l54.693-66.399c7.883-9.57 7.988-24.26.053-33.883L385.01 165.68l9.131-37.333 60.382-48.472 34.795 42.268a23.775 23.775 0 0 0 22.537 8.026c11.854-2.37 19.574-14.477 17.205-26.332l-17.205-86.024c-1.338-6.625-5.263-12.289-10.95-15.22zM278.254 256.051l42.268 21.134c7.07 3.535 15.553 1.84 20.9-4.146l21.134-28.179c1.948-2.586 2.917-5.679 2.873-8.772-2.361.365-4.742.365-7.148-.106l-47.065-10.46-42.268 21.134-8.347 4.175 17.653 5.22zM367.98 328.479l-42.268-21.133c-7.07-3.535-15.553-1.841-20.9 4.145l-21.133 28.18c-2.849 3.794-3.382 8.698-1.884 12.938l37.228-17.32 42.267-21.133 14.117-7.059-7.427 21.382z'
              ></path>
            </svg>
          </div>

          {/* Scheduling Section */}
          <div className='space-y-6'>
            <h3 className='text-xl font-bold text-purple-900 flex items-center'>
              <Calendar className='w-6 h-6 mr-2 text-purple-600' />
              {t('services.babysitter.form.scheduling')}
              <div className='ml-2 h-1 flex-grow bg-gradient-to-r from-purple-200 to-transparent rounded-full'></div>
            </h3>

            {/* Date Field */}
            <div className='bg-purple-50 p-6 rounded-xl border border-purple-100 shadow-sm'>
              <label className='flex items-center text-sm font-medium text-purple-800 mb-3'>
                <Calendar className='w-5 h-5 mr-2 text-purple-600' />
                {t('services.babysitter.form.date')} *
              </label>
              <input
                type='date'
                name='date'
                value={formData.date}
                onChange={handleChange}
                className={`w-full p-4 border-2 ${
                  errors.date ? 'border-red-400' : 'border-purple-200'
                } rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 bg-white shadow-sm transition-all duration-200`}
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.date && (
                <p className='text-red-500 text-xs mt-2 flex items-center'>
                  <AlertCircle className='w-3 h-3 mr-1' />
                  {errors.date}
                </p>
              )}
            </div>

            {/* Time Range Fields */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {/* Start Time */}
              <div className='bg-purple-50 p-6 rounded-xl border border-purple-100 shadow-sm'>
                <label className='flex items-center text-sm font-medium text-purple-800 mb-3'>
                  <Clock className='w-5 h-5 mr-2 text-purple-600' />
                  {t('services.babysitter.form.startTime')} *
                </label>
                <input
                  type='time'
                  name='startTime'
                  value={formData.startTime}
                  onChange={handleChange}
                  className={`w-full p-4 border-2 ${
                    errors.startTime ? 'border-red-400' : 'border-purple-200'
                  } rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 bg-white shadow-sm transition-all duration-200`}
                />
                {errors.startTime && (
                  <p className='text-red-500 text-xs mt-2 flex items-center'>
                    <AlertCircle className='w-3 h-3 mr-1' />
                    {errors.startTime}
                  </p>
                )}
              </div>

              {/* End Time */}
              <div className='bg-purple-50 p-6 rounded-xl border border-purple-100 shadow-sm'>
                <label className='flex items-center text-sm font-medium text-purple-800 mb-3'>
                  <Clock className='w-5 h-5 mr-2 text-purple-600' />
                  {t('services.babysitter.form.endTime')} *
                </label>
                <input
                  type='time'
                  name='endTime'
                  value={formData.endTime}
                  onChange={handleChange}
                  className={`w-full p-4 border-2 ${
                    errors.endTime ? 'border-red-400' : 'border-purple-200'
                  } rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 bg-white shadow-sm transition-all duration-200`}
                />
                {errors.endTime && (
                  <p className='text-red-500 text-xs mt-2 flex items-center'>
                    <AlertCircle className='w-3 h-3 mr-1' />
                    {errors.endTime}
                  </p>
                )}
              </div>
            </div>

            {/* Minimum Booking Notice */}
            <div className='flex items-center p-4 bg-indigo-50 rounded-xl border border-indigo-100 shadow-inner'>
              <Info className='h-6 w-6 text-indigo-500 mr-3 flex-shrink-0' />
              <p className='text-sm text-indigo-700'>
                {t(
                  'services.babysitter.form.minimumBooking',
                  `Minimum booking duration is ${minimumBooking} hours. Shorter bookings will be charged at the ${minimumBooking}-hour rate.`
                )}
              </p>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className='flex items-center text-sm font-medium  text-purple-800 mb-2'>
              <MapPin className='w-4 h-4 mr-2 ' />
              Location *
            </label>
            <input
              name='location'
              value={formData.location}
              onChange={handleChange}
              className={`w-full p-3 border ${
                errors.location ? 'border-red-500' : 'border-gray-300'
              } `}
              placeholder='Please provide the complete address where the personal training will take place'
            />
            {errors.location && (
              <p className='text-red-500 text-xs mt-1'>{errors.location}</p>
            )}
          </div>

          {/* Children Information */}
          <div className='space-y-6 mt-10'>
            <h3 className='text-xl font-bold text-purple-900 flex items-center'>
              <Baby className='w-6 h-6 mr-2 text-purple-600' />
              {t(
                'services.babysitter.form.childrenInfo',
                'Tell Us About Your Children'
              )}
              <div className='ml-2 h-1 flex-grow bg-gradient-to-r from-purple-200 to-transparent rounded-full'></div>
            </h3>

            {/* Children Count */}
            <div className='bg-pink-50 p-6 rounded-xl border border-pink-100 shadow-sm'>
              <label className='flex items-center text-sm font-medium text-pink-800 mb-3'>
                <Users className='w-5 h-5 mr-2 text-pink-600' />
                {t(
                  'services.babysitter.form.childrenCount',
                  'How many children need care?'
                )}
              </label>

              <div className='flex w-48 mx-auto bg-white rounded-xl overflow-hidden shadow-sm border-2 border-pink-200'>
                <button
                  type='button'
                  onClick={() => updateChildrenCount(false)}
                  className='w-16 py-3 bg-pink-100 hover:bg-pink-200 text-pink-800 font-bold text-xl transition-colors'
                >
                  -
                </button>
                <div className='flex-grow py-3 font-bold text-lg text-pink-900 text-center'>
                  {formData.childrenCount}
                </div>
                <button
                  type='button'
                  onClick={() => updateChildrenCount(true)}
                  className='w-16 py-3 bg-pink-100 hover:bg-pink-200 text-pink-800 font-bold text-xl transition-colors'
                >
                  +
                </button>
              </div>

              {formData.childrenCount > 1 && (
                <p className='text-sm text-pink-700 mt-3 text-center flex items-center justify-center'>
                  <DollarSign className='w-4 h-4 mr-1' />
                  +$10{' '}
                  {t(
                    'services.babysitter.form.perAdditionalChild',
                    'per additional child'
                  )}
                </p>
              )}
            </div>

            {/* Children Ages */}
            <div className='space-y-4'>
              <div className='bg-pink-50 p-6 rounded-xl border border-pink-100 shadow-sm'>
                <label className='flex items-center text-sm font-medium text-pink-800 mb-3'>
                  <Baby className='w-5 h-5 mr-2 text-pink-600' />
                  {t(
                    'services.babysitter.form.childrenAges',
                    'How old are they?'
                  )}{' '}
                  *
                </label>

                <div className='space-y-3'>
                  {formData.childrenAges.map((age, index) => (
                    <div
                      key={index}
                      className='flex items-center bg-white p-3 rounded-lg border-2 border-pink-200 shadow-sm'
                    >
                      <div className='flex items-center justify-center w-8 h-8 bg-pink-200 text-pink-800 rounded-full mr-3 font-bold'>
                        {index + 1}
                      </div>
                      <input
                        type='text'
                        value={age}
                        onChange={(e) => handleAgeChange(index, e.target.value)}
                        placeholder={t(
                          'services.babysitter.form.agePlaceholder',
                          'e.g., 3 years'
                        )}
                        className={`flex-1 p-3 border ${
                          errors.childrenAges
                            ? 'border-red-400'
                            : 'border-pink-200'
                        } rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-pink-400 bg-white`}
                      />
                    </div>
                  ))}

                  {errors.childrenAges && (
                    <p className='text-red-500 text-xs mt-2 flex items-center'>
                      <AlertCircle className='w-3 h-3 mr-1' />
                      {errors.childrenAges}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Special Needs Toggle */}
            <div className='mt-6'>
              <div
                className='flex items-center justify-between p-5 border-2 border-purple-200 rounded-xl bg-white hover:border-purple-300 transition cursor-pointer shadow-sm'
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    hasSpecialNeeds: !prev.hasSpecialNeeds,
                  }))
                }
              >
                <div className='flex items-center'>
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      formData.hasSpecialNeeds
                        ? 'border-purple-600 bg-purple-600'
                        : 'border-purple-300'
                    }`}
                  >
                    {formData.hasSpecialNeeds && (
                      <CheckCircle className='w-4 h-4 text-white' />
                    )}
                  </div>
                  <span className='ml-3 font-medium text-purple-900'>
                    {t(
                      'services.babysitter.form.specialNeeds',
                      'Child with special needs or disabilities'
                    )}
                  </span>
                </div>
                <Heart className='w-6 h-6 text-pink-500' />
              </div>

              {/* Special Needs Details */}
              {formData.hasSpecialNeeds && (
                <div className='mt-4 pl-6 border-l-4 border-purple-300 bg-purple-50 p-6 rounded-xl'>
                  <label className='block text-sm font-medium text-purple-800 mb-3'>
                    {t(
                      'services.babysitter.form.specialNeedsDetails',
                      'Please tell us about any special needs'
                    )}{' '}
                    *
                  </label>
                  <textarea
                    name='specialNeedsDetails'
                    value={formData.specialNeedsDetails}
                    onChange={handleChange}
                    placeholder={t(
                      'services.babysitter.form.specialNeedsPlaceholder',
                      'Please describe any special requirements, medical conditions, allergies, etc.'
                    )}
                    className={`w-full p-4 border-2 ${
                      errors.specialNeedsDetails
                        ? 'border-red-400'
                        : 'border-purple-200'
                    } rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 bg-white shadow-sm h-32`}
                  ></textarea>
                  {errors.specialNeedsDetails && (
                    <p className='text-red-500 text-xs mt-2 flex items-center'>
                      <AlertCircle className='w-3 h-3 mr-1' />
                      {errors.specialNeedsDetails}
                    </p>
                  )}
                  <p className='text-sm text-purple-700 mt-3 flex items-center'>
                    <DollarSign className='w-4 h-4 mr-1' />
                    <span>
                      +$15{' '}
                      {t(
                        'services.babysitter.form.specialNeedsFee',
                        'additional fee for specialized care'
                      )}
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Special Requests */}
          <div className='space-y-6 mt-10'>
            <h3 className='text-xl font-bold text-purple-900 flex items-center'>
              <MessageSquare className='w-6 h-6 mr-2 text-purple-600' />
              {t(
                'services.babysitter.form.specialRequests',
                'Additional Information'
              )}
              <div className='ml-2 h-1 flex-grow bg-gradient-to-r from-purple-200 to-transparent rounded-full'></div>
            </h3>

            <div className='bg-indigo-50 p-6 rounded-xl border border-indigo-100 shadow-sm'>
              <label className='flex items-center text-sm font-medium text-indigo-800 mb-3'>
                <MessageSquare className='w-5 h-5 mr-2 text-indigo-600' />
                {t(
                  'services.babysitter.form.additionalInfo',
                  'Anything else we should know?'
                )}
              </label>
              <textarea
                name='specialRequests'
                value={formData.specialRequests}
                onChange={handleChange}
                placeholder={t(
                  'services.babysitter.form.requestsPlaceholder',
                  'Favorite activities, routines, nap times, dietary preferences, or anything else that would help our babysitter provide the best care'
                )}
                className='w-full p-4 border-2 border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 bg-white shadow-sm h-32'
              ></textarea>
            </div>
          </div>
        </div>

        {/* Modern Footer with Price and Actions */}
        <div className='bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-700 text-white p-8 rounded-b-2xl'>
          <div className='flex flex-col md:flex-row items-center justify-between'>
            <div className='flex flex-col items-center md:items-start mb-6 md:mb-0'>
              <span className='text-purple-200 text-sm uppercase tracking-wide font-medium'>
                {t('services.babysitter.form.totalPrice', 'Estimated Total')}
              </span>
              <div className='flex items-center mt-1'>
                <span className='text-4xl font-bold'>
                  ${currentPrice.toFixed(2)}
                </span>
                <span className='ml-2 bg-purple-500/50 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full uppercase tracking-wide'>
                  {t('services.babysitter.form.fullService', 'Full Service')}
                </span>
              </div>
            </div>

            <div className='flex flex-col sm:flex-row gap-4'>
              <button
                type='button'
                onClick={onCancel}
                className='px-6 py-3 border-2 border-white/30 rounded-xl text-white hover:bg-white/10 transition-colors'
              >
                {t('common.cancel', 'Cancel')}
              </button>

              <button
                type='submit'
                className='px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center font-medium'
              >
                <CreditCard className='h-5 w-5 mr-2' />
                {t('services.babysitter.form.bookNow', 'Book Your Sitter')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default BabysitterForm;
