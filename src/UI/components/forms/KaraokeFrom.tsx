import React, { useState, useMemo } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import {
  Mic,
  Calendar,
  Clock,
  MapPin,
  Monitor,
  Youtube,
  MessageSquare,
  CreditCard,
  AlertCircle,
  Check,
  X,
  Plus,
  Info,
  CheckCircle,
  Volume2,
} from 'lucide-react';
import { useReservation } from '@/context/BookingContext';
import { useRouter } from 'next/navigation';
import {
  FormErrors,
  KaraokeFormProps,
  PRICING,
  SETUP_TYPES,
  FormData,
} from '@/constants/karaoke';
import { LOCATION_OPTIONS } from '@/constants/location/location';
import FormHeader from './FormHeader';
import { useFormModal } from '@/hooks/useFormModal';

// Enhanced FormData interface
interface EnhancedFormData extends Omit<FormData, 'location'> {
  location: string;
  endTime: string;
  confirmOutdoorPolicy: boolean;
}

const KaraokeForm: React.FC<KaraokeFormProps> = ({ service, onCancel }) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { setReservationData } = useReservation();

  const { handleClose } = useFormModal({ onCancel });

  // Enhanced form state
  const [formData, setFormData] = useState<EnhancedFormData>({
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    hasProjectionSpace: false,
    needsScreen: false,
    setupType: '',
    musicReferences: [''],
    specialRequests: '',
    confirmOutdoorPolicy: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Calculate event duration in hours
  const eventDuration = useMemo(() => {
    if (!formData.startTime || !formData.endTime) return 0;

    const start = new Date(`2000-01-01T${formData.startTime}`);
    const end = new Date(`2000-01-01T${formData.endTime}`);

    if (end <= start) return 0;

    return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  }, [formData.startTime, formData.endTime]);

  // Enhanced price calculation with duration logic
  const calculatePrice = useMemo(() => {
    let total = PRICING.BASE_PRICE;

    // Add screen rental if needed
    if (formData.needsScreen) {
      total += PRICING.SCREEN_RENTAL;
    }

    // Add outdoor setup fee if selected
    if (formData.setupType === 'outdoor') {
      total += PRICING.OUTDOOR_SETUP;
    }

    // Apply duration-based pricing (over 4 hours)
    if (eventDuration > 4) {
      const extraHours = eventDuration - 4;
      total += extraHours * 50; // $50 per extra hour
    }

    return total;
  }, [formData.needsScreen, formData.setupType, eventDuration]);

  // Date validation helpers
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

  // Enhanced form validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Required fields
    if (!formData.date) {
      newErrors.date = 'Event date is required';
    }

    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required';
    }

    if (!formData.endTime) {
      newErrors.endTime = 'End time is required';
    }

    if (!formData.location) {
      newErrors.location = 'Event location is required';
    }

    if (!formData.setupType) {
      newErrors.setupType = 'Please select indoor or outdoor setup';
    }

    // Time validation
    if (formData.startTime && formData.endTime && eventDuration <= 0) {
      newErrors.endTime = 'End time must be after start time';
    }

    // Date validations
    if (
      formData.date &&
      !isSameDay(formData.date) &&
      !hasMinimum24Hours(formData.date)
    ) {
      newErrors.date = 'Bookings must be made at least 24 hours in advance';
    }

    // Outdoor policy confirmation
    if (formData.setupType === 'outdoor' && !formData.confirmOutdoorPolicy) {
      newErrors.confirmOutdoorPolicy =
        'Please confirm you understand the outdoor sound policy';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const totalPrice = calculatePrice;
      const selectedLocation =
        LOCATION_OPTIONS.find((loc) => loc.id === formData.location)?.name ||
        formData.location;

      // Enhanced reservation data structure
      const reservationData = {
        service,
        totalPrice,
        formData: {
          ...formData,
          serviceType: 'karaoke',
          calculatedPrice: totalPrice,
          locationName: selectedLocation,
          eventDuration,
        },
        bookingDate: new Date(`${formData.date}T${formData.startTime}`),
        endDate: new Date(`${formData.date}T${formData.endTime}`),
        clientInfo: undefined,
        karaokeSpecifics: {
          setupType: formData.setupType,
          location: formData.location,
          locationName: selectedLocation,
          hasProjectionSpace: formData.hasProjectionSpace,
          needsScreen: formData.needsScreen,
          musicReferences: formData.musicReferences.filter((ref) => ref.trim()),
          specialRequests: formData.specialRequests,
          eventDuration,
          isExtendedSession: eventDuration > 4,
        },
      };

      console.log('🎤 Karaoke - Enhanced reservation data:', reservationData);
      console.log('💰 Total Price included:', totalPrice);
      console.log('⏱️ Event duration:', eventDuration, 'hours');

      // Store in context
      setReservationData(reservationData);

      // Navigate to confirmation page
      router.push('/reservation-confirmation');
    } catch (error) {
      console.error('❌ KaraokeForm - Error submitting form:', error);
      setErrors({
        submit: t('form.errors.submitError', {
          fallback: 'Failed to submit reservation. Please try again.',
        }),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generic input handler
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = 'checked' in e.target ? e.target.checked : false;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Handle location selection
  const handleLocationSelect = (locationId: string) => {
    setFormData((prev) => ({
      ...prev,
      location: locationId,
    }));

    // Clear location error if exists
    if (errors.location) {
      setErrors((prev) => ({
        ...prev,
        location: '',
      }));
    }
  };

  // Handle projection space selection
  const handleProjectionSpaceChange = (hasSpace: boolean) => {
    setFormData((prev) => ({
      ...prev,
      hasProjectionSpace: hasSpace,
      needsScreen: hasSpace ? false : true, // Auto-select screen if no space
    }));
  };

  // Handle setup type selection with outdoor policy logic
  const handleSetupTypeChange = (setupType: 'indoor' | 'outdoor') => {
    setFormData((prev) => ({
      ...prev,
      setupType,
      confirmOutdoorPolicy:
        setupType === 'indoor' ? false : prev.confirmOutdoorPolicy,
    }));

    // Clear error when user selects
    if (errors.setupType) {
      setErrors((prev) => ({
        ...prev,
        setupType: '',
      }));
    }
  };

  // Music reference handlers
  const addMusicReference = () => {
    if (formData.musicReferences.length < 10) {
      setFormData((prev) => ({
        ...prev,
        musicReferences: [...prev.musicReferences, ''],
      }));
    }
  };

  const removeMusicReference = (index: number) => {
    if (formData.musicReferences.length > 1) {
      setFormData((prev) => ({
        ...prev,
        musicReferences: prev.musicReferences.filter((_, i) => i !== index),
      }));
    }
  };

  const updateMusicReference = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      musicReferences: prev.musicReferences.map((ref, i) =>
        i === index ? value : ref
      ),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className='w-full mx-auto overflow-hidden'>
      <div className='bg-white rounded-xl shadow-lg border border-gray-100'>
        {/* Form Header */}
        <FormHeader
          title='Karaoke'
          subtitle='Experience the magic of riding along pristine Macao Beach'
          icon={Mic}
          onCancel={handleClose}
          showCloseButton={true}
          gradientFrom='purple-800'
          gradientVia='purple-500'
          gradientTo='purple-600'
        />

        {/* Form Body */}
        <div className='p-8 space-y-8'>
          {/* Event Details Section */}
          <div className='space-y-6'>
            <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2'>
              Event Details
            </h3>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              {/* Date */}
              <div>
                <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                  <Calendar className='w-4 h-4 mr-2 text-purple-700' />
                  Event Date *
                </label>
                <input
                  type='date'
                  name='date'
                  value={formData.date}
                  onChange={handleInputChange}
                  className={`w-full p-3 border ${
                    errors.date ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-purple-500 focus:border-purple-500 bg-gray-50`}
                  min={new Date().toISOString().split('T')[0]}
                />
                {errors.date && (
                  <p className='text-red-500 text-xs mt-1'>{errors.date}</p>
                )}
              </div>

              {/* Start Time */}
              <div>
                <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                  <Clock className='w-4 h-4 mr-2 text-purple-700' />
                  Start Time *
                </label>
                <input
                  type='time'
                  name='startTime'
                  value={formData.startTime}
                  onChange={handleInputChange}
                  className={`w-full p-3 border ${
                    errors.startTime ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-purple-500 focus:border-purple-500 bg-gray-50`}
                />
                {errors.startTime && (
                  <p className='text-red-500 text-xs mt-1'>
                    {errors.startTime}
                  </p>
                )}
              </div>
            </div>

            {/* Location Selection */}
            <div className='space-y-4'>
              <label className='flex items-center text-sm font-medium text-gray-700 mb-3'>
                <MapPin className='w-4 h-4 mr-2 text-purple-700' />
                Event Location *
              </label>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                {LOCATION_OPTIONS.map((location) => (
                  <div
                    key={location.id}
                    className={`
                      border rounded-lg p-4 cursor-pointer transition-all
                      ${
                        formData.location === location.id
                          ? 'bg-purple-50 border-purple-300 shadow-sm'
                          : 'border-gray-200 hover:bg-gray-50'
                      }
                    `}
                    onClick={() => handleLocationSelect(location.id)}
                  >
                    <div className='flex items-center'>
                      <div
                        className={`
                        w-5 h-5 rounded-full border flex items-center justify-center mr-3
                        ${
                          formData.location === location.id
                            ? 'border-purple-500 bg-purple-500'
                            : 'border-gray-300'
                        }
                      `}
                      >
                        {formData.location === location.id && (
                          <CheckCircle className='w-4 h-4 text-white' />
                        )}
                      </div>
                      <span className='font-medium text-gray-800'>
                        {location.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {errors.location && (
                <p className='text-red-500 text-xs mt-1'>{errors.location}</p>
              )}
            </div>

            {/* Booking timing warnings */}
            {formData.date && (
              <div className='mt-4'>
                {isSameDay(formData.date) ? (
                  <div className='p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start'>
                    <Info className='w-4 h-4 text-amber-600 mr-2 mt-0.5' />
                    <div className='text-sm text-amber-800'>
                      <strong>Same-day booking:</strong> Requires immediate
                      confirmation from our team.
                    </div>
                  </div>
                ) : !hasMinimum24Hours(formData.date) ? (
                  <div className='p-3 bg-red-50 border border-red-200 rounded-lg flex items-start'>
                    <AlertCircle className='w-4 h-4 text-red-600 mr-2 mt-0.5' />
                    <div className='text-sm text-red-800'>
                      <strong>Advance booking required:</strong> Please book at
                      least 24 hours in advance.
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>

          {/* Setup Type Section */}
          <div className='space-y-6'>
            <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2'>
              Setup Environment
            </h3>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {SETUP_TYPES.map((setup) => {
                const Icon = setup.icon;
                const isSelected = formData.setupType === setup.id;

                return (
                  <div
                    key={setup.id}
                    className={`border rounded-lg p-6 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onClick={() =>
                      handleSetupTypeChange(setup.id as 'indoor' | 'outdoor')
                    }
                  >
                    <div className='flex items-start justify-between mb-3'>
                      <div className='flex items-center'>
                        <Icon
                          className={`w-6 h-6 mr-3 ${
                            isSelected ? 'text-purple-600' : 'text-gray-600'
                          }`}
                        />
                        <div>
                          <h4 className='font-medium text-gray-900'>
                            {setup.name}
                          </h4>
                        </div>
                      </div>
                      {isSelected && (
                        <Check className='w-5 h-5 text-purple-600' />
                      )}
                    </div>

                    <p className='text-sm text-gray-600 mb-3'>
                      {setup.description}
                    </p>

                    <div className='space-y-1'>
                      {setup.benefits.map((benefit, index) => (
                        <div
                          key={index}
                          className='flex items-center text-xs text-gray-500'
                        >
                          <div className='w-1 h-1 bg-gray-400 rounded-full mr-2'></div>
                          {benefit}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {errors.setupType && (
              <p className='text-red-500 text-xs'>{errors.setupType}</p>
            )}

            {/* Outdoor Sound Policy Warning */}
            {formData.setupType === 'outdoor' && (
              <div className='mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg'>
                <div className='flex items-start'>
                  <Volume2 className='w-5 h-5 text-yellow-600 mr-3 flex-shrink-0 mt-0.5' />
                  <div className='flex-1'>
                    <h4 className='font-medium text-yellow-800 mb-2'>
                      Outdoor Sound Policy
                    </h4>
                    <p className='text-sm text-yellow-700 mb-3'>
                      For outdoor setups, please note:
                    </p>
                    <ul className='text-sm text-yellow-700 space-y-1 mb-4'>
                      <li>
                        • Sound levels must comply with local noise ordinances
                      </li>
                      <li>• Events typically must end by 10:00 PM</li>
                      <li>
                        • We may need to adjust volume based on venue
                        requirements
                      </li>
                      <li>
                        • Additional sound permits may be required for some
                        locations
                      </li>
                    </ul>

                    <div className='flex items-start'>
                      <input
                        type='checkbox'
                        id='confirmOutdoorPolicy'
                        name='confirmOutdoorPolicy'
                        checked={formData.confirmOutdoorPolicy}
                        onChange={handleInputChange}
                        className='h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded mt-0.5'
                      />
                      <label
                        htmlFor='confirmOutdoorPolicy'
                        className='ml-2 text-sm text-yellow-800'
                      >
                        I understand and agree to comply with the outdoor sound
                        policy
                      </label>
                    </div>
                    {errors.confirmOutdoorPolicy && (
                      <p className='text-red-500 text-xs mt-1'>
                        {errors.confirmOutdoorPolicy}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Music Preferences Section */}
          <div className='space-y-6'>
            <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2'>
              Music Preferences
            </h3>

            <div className='space-y-4'>
              <div className='flex items-center text-sm font-medium text-gray-700 mb-3'>
                <Youtube className='w-4 h-4 mr-2 text-purple-700' />
                Song Requests (Optional)
              </div>

              <p className='text-sm text-gray-600'>
                Share YouTube or Spotify links of songs you'd like to include in
                your karaoke session
              </p>

              {formData.musicReferences.map((reference, index) => (
                <div key={index} className='flex gap-3'>
                  <div className='flex-1'>
                    <input
                      type='text'
                      value={reference}
                      onChange={(e) =>
                        updateMusicReference(index, e.target.value)
                      }
                      placeholder={`Song request ${
                        index + 1
                      } (YouTube, Spotify, or just song name)`}
                      className='w-full p-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500'
                    />
                  </div>
                  {formData.musicReferences.length > 1 && (
                    <button
                      type='button'
                      onClick={() => removeMusicReference(index)}
                      className='px-3 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors'
                      title='Remove this song'
                    >
                      <X className='w-5 h-5' />
                    </button>
                  )}
                </div>
              ))}

              {formData.musicReferences.length < 10 && (
                <button
                  type='button'
                  onClick={addMusicReference}
                  className='flex items-center text-purple-600 hover:text-purple-800 transition-colors'
                >
                  <div className='w-8 h-8 rounded-full border-2 border-dashed border-purple-300 flex items-center justify-center mr-2 hover:border-purple-400'>
                    <Plus className='w-4 h-4' />
                  </div>
                  Add another song request
                </button>
              )}
            </div>
          </div>

          {/* Special Requests Section */}
          <div className='space-y-6'>
            <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2'>
              Special Requests
            </h3>

            <div>
              <textarea
                name='specialRequests'
                value={formData.specialRequests}
                onChange={handleInputChange}
                rows={4}
                className='w-full p-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500'
                placeholder='Any special requests, specific setup requirements, themes, or other details for your karaoke event...'
              />
            </div>
          </div>

          {/* Equipment Information */}
          <div className='bg-purple-50 border border-purple-200 rounded-lg p-4'>
            <div className='flex items-start'>
              <Mic className='w-5 h-5 text-purple-600 mr-3 flex-shrink-0 mt-0.5' />
              <div>
                <h4 className='font-medium text-purple-800 mb-2'>
                  What's Included
                </h4>
                <ul className='text-sm text-purple-700 space-y-1'>
                  <li>
                    • Professional karaoke system with wireless microphones
                  </li>
                  <li>• High-quality sound system and speakers</li>
                  <li>• Extensive music library with latest hits</li>
                  <li>• Professional setup and technical support</li>
                  <li>• Lighting effects for enhanced ambiance</li>
                  {formData.needsScreen && (
                    <li>• Professional projection screen rental</li>
                  )}
                  {eventDuration > 4 && (
                    <li>
                      • Extended session support ({eventDuration.toFixed(1)}{' '}
                      hours)
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with Price and Actions */}
        <div className='bg-gray-900 text-white p-6 flex flex-col md:flex-row items-center justify-between'>
          <div className='flex flex-col items-center md:items-start mb-4 md:mb-0'>
            <span className='text-gray-400 text-sm uppercase tracking-wide'>
              Total Price
            </span>
            <div className='flex items-center mt-1'>
              <span className='text-3xl font-light'>
                ${calculatePrice.toFixed(2)}
              </span>
            </div>

            {/* Enhanced price breakdown */}
            <div className='text-xs text-gray-400 mt-2 space-y-1'>
              <div>Base karaoke setup: ${PRICING.BASE_PRICE}</div>
              {formData.needsScreen && (
                <div>Screen rental: +${PRICING.SCREEN_RENTAL}</div>
              )}
              {formData.setupType === 'outdoor' && <div>Outdoor setup</div>}
              {eventDuration > 4 && (
                <div className='text-orange-400'>
                  Extended session ({(eventDuration - 4).toFixed(1)}h): +$
                  {((eventDuration - 4) * 50).toFixed(0)}
                </div>
              )}
              {formData.location && (
                <div className='text-purple-400'>
                  Location:{' '}
                  {
                    LOCATION_OPTIONS.find((loc) => loc.id === formData.location)
                      ?.name
                  }
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
              Cancel
            </button>

            <button
              type='submit'
              disabled={isSubmitting}
              className='px-8 py-3 bg-purple-700 hover:bg-purple-600 text-white rounded-lg transition flex items-center disabled:opacity-50'
            >
              <CreditCard className='h-4 w-4 mr-2' />
              {isSubmitting ? 'Processing...' : 'Book Karaoke'}
            </button>
          </div>
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div className='p-4 bg-red-50 border border-red-200 rounded-lg mt-4'>
            <div className='flex items-start'>
              <AlertCircle className='w-4 h-4 text-red-600 mr-2 mt-0.5' />
              <div className='text-sm text-red-800'>
                <strong>Error:</strong> {errors.submit}
              </div>
            </div>
          </div>
        )}
      </div>
    </form>
  );
};

export default KaraokeForm;
