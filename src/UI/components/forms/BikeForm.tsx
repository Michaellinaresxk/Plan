import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { useRouter } from 'next/navigation';
import { useReservation } from '@/context/BookingContext';
import { Service } from '@/types/type';
import {
  Calendar,
  MapPin,
  Users,
  Baby,
  CreditCard,
  Info,
  AlertTriangle,
  Plus,
  Minus,
  CheckCircle,
  User,
} from 'lucide-react';
import { BIKE_TYPES, BikeFormProps, FormErrors } from '@/constants/bike/bike';

interface Person {
  id: string;
  type: 'adult' | 'child';
  age?: number;
  selectedBike: string;
  name?: string;
}

interface FormData {
  startDate: string;
  endDate: string;
  endTime: string;
  startTime: string;
  location: string;
  people: Person[];
  needsHelmet: boolean;
  needsLock: boolean;
  deliveryToHotel: boolean;
  specialRequests: string;
}

const BikeForm: React.FC<BikeFormProps> = ({ service, onSubmit, onCancel }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { setReservationData } = useReservation();

  // Form state
  const [formData, setFormData] = useState<FormData>({
    startDate: '',
    endDate: '',
    endTime: '',
    startTime: '09:00',
    location: '',
    people: [
      { id: 'adult-1', type: 'adult', selectedBike: 'cityBike' },
      { id: 'adult-2', type: 'adult', selectedBike: 'cityBike' },
    ],
    needsHelmet: true,
    needsLock: true,
    deliveryToHotel: true,
    specialRequests: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate rental days
  const rentalDays = useMemo(() => {
    if (!formData.startDate || !formData.endDate) return 1;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(1, diffDays + 1);
  }, [formData.startDate, formData.endDate]);

  // Calculate counts
  const adultCount = useMemo(
    () => formData.people.filter((p) => p.type === 'adult').length,
    [formData.people]
  );
  const childCount = useMemo(
    () => formData.people.filter((p) => p.type === 'child').length,
    [formData.people]
  );
  const totalParticipants = formData.people.length;

  // Calculate selected bikes summary
  const selectedBikes = useMemo(() => {
    const bikes: Record<string, number> = {};
    formData.people.forEach((person) => {
      if (person.selectedBike) {
        bikes[person.selectedBike] = (bikes[person.selectedBike] || 0) + 1;
      }
    });
    return bikes;
  }, [formData.people]);

  // Calculate total price
  const calculatePrice = useMemo(() => {
    let total = 0;

    // Calculate bike rental costs
    formData.people.forEach((person) => {
      const bike = BIKE_TYPES.find((b) => b.id === person.selectedBike);
      if (bike) {
        total += bike.price * rentalDays;
      }
    });

    // Add delivery fee if needed
    if (formData.deliveryToHotel && formData.location !== 'Hotel pickup') {
      total += 10;
    }

    return total;
  }, [
    formData.people,
    formData.deliveryToHotel,
    formData.location,
    rentalDays,
  ]);

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

  // Get recommended bike for child based on age
  const getRecommendedBike = (age: number): string => {
    const suitableBike = BIKE_TYPES.find(
      (bike) => age >= bike.minAge && age <= bike.maxAge
    );
    return suitableBike?.id || 'kids-bike';
  };

  // Form validation
  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    // Required fields
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (!formData.location) newErrors.location = 'Location is required';

    // Date validations
    if (formData.startDate && formData.endDate) {
      if (new Date(formData.endDate) < new Date(formData.startDate)) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    // Advanced date validation
    if (
      formData.startDate &&
      !isSameDay(formData.startDate) &&
      !hasMinimum24Hours(formData.startDate)
    ) {
      newErrors.startDate =
        'Bookings must be made at least 24 hours in advance';
    }

    // Participant validation
    if (formData.people.length < 1) {
      newErrors.people = 'At least one participant is required';
    }

    // Children age validation
    formData.people.forEach((person, index) => {
      if (person.type === 'child') {
        if (!person.age || person.age < 4 || person.age > 17) {
          newErrors[`person-${index}-age`] =
            'Child age must be between 4 and 17';
        }
      }
      if (!person.selectedBike) {
        newErrors[`person-${index}-bike`] =
          'Please select a bike for this person';
      }
    });

    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      console.log('❌ BikeForm - Validation errors:', validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Same day booking confirmation
      if (isSameDay(formData.startDate)) {
        if (
          !window.confirm(
            'You are booking for today. This requires immediate confirmation from our team. Continue?'
          )
        ) {
          setIsSubmitting(false);
          return;
        }
      }

      // Create booking dates properly
      const bookingStartDate = new Date(
        `${formData.startDate}T${formData.startTime}`
      );
      const bookingEndDate = new Date(
        `${formData.endDate}T${formData.endTime}`
      );

      // Create service data with fallback
      const serviceData = service || {
        id: 'bike-rental',
        name: 'Bike Rental Service',
        category: 'Transportation',
        type: 'bike-rental',
      };

      // Create reservation data with properly formatted people info
      const reservationData = {
        service: serviceData,
        formData: {
          ...formData,
          serviceType: 'bike-rental',
          totalPrice: calculatePrice,
          rentalDays,
          selectedBikes, // Convert people bikes to bike summary
          // Format people for payment display
          peopleDetails: formData.people.map((person) => {
            const bike = BIKE_TYPES.find((b) => b.id === person.selectedBike);
            return {
              id: person.id,
              type: person.type,
              age: person.age,
              bikeName: bike?.name || 'Unknown Bike',
              bikePrice: bike?.price || 0,
              displayName:
                person.type === 'adult'
                  ? `Adult - ${bike?.name || 'Unknown Bike'}`
                  : `Child (${person.age} years) - ${
                      bike?.name || 'Unknown Bike'
                    }`,
            };
          }),
        },
        totalPrice: calculatePrice,
        bookingDate: bookingStartDate,
        endDate: bookingEndDate,
        participants: {
          adults: adultCount,
          children: childCount,
          total: totalParticipants,
          // Add formatted list for display
          list: formData.people.map((person) => {
            const bike = BIKE_TYPES.find((b) => b.id === person.selectedBike);
            return person.type === 'adult'
              ? `Adult with ${bike?.name || 'Unknown Bike'}`
              : `Child (${person.age} years) with ${
                  bike?.name || 'Unknown Bike'
                }`;
          }),
        },
        selectedItems: Object.entries(selectedBikes)
          .filter(([_, count]) => count > 0)
          .map(([bikeId, count]) => {
            const bike = BIKE_TYPES.find((b) => b.id === bikeId);
            return {
              id: bikeId,
              name: bike?.name || 'Unknown Bike',
              quantity: count,
              price: bike?.price || 0,
              totalPrice: (bike?.price || 0) * count * rentalDays,
            };
          }),
        clientInfo: undefined,
      };

      console.log('🚴 BikeForm - Reservation data created:', reservationData);

      setReservationData(reservationData);

      if (onSubmit) {
        await onSubmit(reservationData);
      }

      router.push('/reservation-confirmation');
    } catch (error) {
      console.error('❌ BikeForm - Error submitting form:', error);
      setErrors({
        submit: 'Failed to submit reservation. Please try again.',
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

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Add person (adult or child)
  const addPerson = (type: 'adult' | 'child') => {
    const newId = `${type}-${Date.now()}`;
    const newPerson: Person = {
      id: newId,
      type,
      selectedBike: type === 'adult' ? 'cityBike' : 'kids-bike',
      ...(type === 'child' && { age: 8 }),
    };

    setFormData((prev) => ({
      ...prev,
      people: [...prev.people, newPerson],
    }));
  };

  // Remove person
  const removePerson = (personId: string) => {
    setFormData((prev) => ({
      ...prev,
      people: prev.people.filter((p) => p.id !== personId),
    }));
  };

  // Update person data
  const updatePerson = (personId: string, updates: Partial<Person>) => {
    setFormData((prev) => ({
      ...prev,
      people: prev.people.map((person) =>
        person.id === personId ? { ...person, ...updates } : person
      ),
    }));

    // Clear related errors
    const personIndex = formData.people.findIndex((p) => p.id === personId);
    if (personIndex !== -1) {
      setErrors((prev) => ({
        ...prev,
        [`person-${personIndex}-age`]: '',
        [`person-${personIndex}-bike`]: '',
      }));
    }
  };

  // Handle child age change with bike recommendation
  const handleChildAgeChange = (personId: string, age: number) => {
    const recommendedBike = getRecommendedBike(age);
    updatePerson(personId, { age, selectedBike: recommendedBike });
  };

  // Person component
  const PersonCard = ({ person, index }: { person: Person; index: number }) => {
    const selectedBikeData = BIKE_TYPES.find(
      (b) => b.id === person.selectedBike
    );
    const isChild = person.type === 'child';
    const canRemove = formData.people.length > 1;

    return (
      <div className='bg-white border border-gray-200 rounded-lg p-4 shadow-sm'>
        <div className='flex items-start justify-between mb-4'>
          <div className='flex items-center'>
            {isChild ? (
              <Baby className='w-5 h-5 text-blue-600 mr-2' />
            ) : (
              <User className='w-5 h-5 text-green-600 mr-2' />
            )}
            <div>
              <h4 className='font-medium text-gray-800'>
                {isChild ? `Child ${index + 1}` : `Adult ${index + 1}`}
              </h4>
              <p className='text-sm text-gray-500'>
                {isChild ? '4-17 years old' : '18+ years old'}
              </p>
            </div>
          </div>

          {canRemove && (
            <button
              type='button'
              onClick={() => removePerson(person.id)}
              className='text-red-500 hover:text-red-700 p-1'
              title='Remove person'
            >
              <Minus className='w-4 h-4' />
            </button>
          )}
        </div>

        {/* Age selector for children */}
        {isChild && (
          <div className='mb-4'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Age *
            </label>
            <select
              value={person.age || 8}
              onChange={(e) =>
                handleChildAgeChange(person.id, parseInt(e.target.value))
              }
              className={`w-full p-2 border ${
                errors[`person-${index}-age`]
                  ? 'border-red-500'
                  : 'border-gray-300'
              } rounded focus:ring-green-500 focus:border-green-500`}
            >
              {Array.from({ length: 14 }, (_, i) => i + 4).map((age) => (
                <option key={age} value={age}>
                  {age} years old
                </option>
              ))}
            </select>
            {errors[`person-${index}-age`] && (
              <p className='text-red-500 text-xs mt-1'>
                {errors[`person-${index}-age`]}
              </p>
            )}
          </div>
        )}

        {/* Bike selection */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Select Bike *
          </label>
          <select
            value={person.selectedBike}
            onChange={(e) =>
              updatePerson(person.id, { selectedBike: e.target.value })
            }
            className={`w-full p-2 border ${
              errors[`person-${index}-bike`]
                ? 'border-red-500'
                : 'border-gray-300'
            } rounded focus:ring-green-500 focus:border-green-500`}
          >
            <option value=''>Choose a bike...</option>
            {BIKE_TYPES.filter((bike) => {
              // Filter bikes based on person type and age
              if (isChild && person.age) {
                return person.age >= bike.minAge && person.age <= bike.maxAge;
              }
              return !isChild ? bike.id !== 'kids-bike' : true;
            }).map((bike) => (
              <option key={bike.id} value={bike.id}>
                {bike.icon} {bike.name} - ${bike.price}/day
                {bike.isPremium && ' (Premium)'}
              </option>
            ))}
          </select>
          {errors[`person-${index}-bike`] && (
            <p className='text-red-500 text-xs mt-1'>
              {errors[`person-${index}-bike`]}
            </p>
          )}
        </div>

        {/* Selected bike info */}
        {selectedBikeData && (
          <div className='mt-3 p-3 bg-gray-50 rounded-lg'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center'>
                <span className='text-lg mr-2'>{selectedBikeData.icon}</span>
                <div>
                  <p className='font-medium text-sm'>{selectedBikeData.name}</p>
                  <p className='text-xs text-gray-600'>
                    {selectedBikeData.ageRange}
                  </p>
                </div>
              </div>
              <div className='text-right'>
                <p className='font-bold text-green-600'>
                  ${selectedBikeData.price}/day
                </p>
                {rentalDays > 1 && (
                  <p className='text-xs text-gray-600'>
                    Total: ${selectedBikeData.price * rentalDays}
                  </p>
                )}
              </div>
            </div>
            <div className='mt-2'>
              <p className='text-xs text-gray-600'>
                {selectedBikeData.description}
              </p>
              <div className='flex flex-wrap gap-1 mt-1'>
                {selectedBikeData.features.slice(0, 3).map((feature, i) => (
                  <span
                    key={i}
                    className='text-xs bg-gray-200 px-2 py-1 rounded'
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className='w-full mx-auto overflow-hidden'>
      <div className='bg-white rounded-xl shadow-lg border border-gray-100'>
        {/* Header */}
        <div className='bg-gradient-to-r from-green-800 via-green-700 to-teal-800 p-6 text-white'>
          <h2 className='text-2xl font-light tracking-wide'>
            Bike Rental Booking
          </h2>
          <p className='text-green-100 mt-1 font-light'>
            Explore Punta Cana with high-quality bikes delivered to your
            location
          </p>
        </div>

        {/* Form Body */}
        <div className='p-8 space-y-8'>
          {/* Rental Period Section */}
          <div className='space-y-6'>
            <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2'>
              Rental Period
            </h3>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              {/* Start Date */}
              <div>
                <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                  <Calendar className='w-4 h-4 mr-2 text-green-700' />
                  Start Date *
                </label>
                <input
                  type='date'
                  name='startDate'
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className={`w-full p-3 border ${
                    errors.startDate ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-green-500 focus:border-green-500 bg-gray-50`}
                  min={new Date().toISOString().split('T')[0]}
                />
                {errors.startDate && (
                  <p className='text-red-500 text-xs mt-1'>
                    {errors.startDate}
                  </p>
                )}
              </div>

              {/* End Date */}
              <div>
                <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                  <Calendar className='w-4 h-4 mr-2 text-green-700' />
                  End Date *
                </label>
                <input
                  type='date'
                  name='endDate'
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className={`w-full p-3 border ${
                    errors.endDate ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-green-500 focus:border-green-500 bg-gray-50`}
                  min={
                    formData.startDate || new Date().toISOString().split('T')[0]
                  }
                />
                {errors.endDate && (
                  <p className='text-red-500 text-xs mt-1'>{errors.endDate}</p>
                )}
              </div>
            </div>

            {/* Rental period display */}
            {formData.startDate && formData.endDate && (
              <div className='p-3 bg-green-50 border border-green-200 rounded-lg'>
                <p className='text-sm text-green-800'>
                  <strong>Rental period:</strong> {rentalDays}{' '}
                  {rentalDays === 1 ? 'day' : 'days'}
                </p>
              </div>
            )}

            {/* Booking timing warnings */}
            {formData.startDate && (
              <div className='mt-4'>
                {isSameDay(formData.startDate) ? (
                  <div className='p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start'>
                    <Info className='w-4 h-4 text-amber-600 mr-2 mt-0.5' />
                    <div className='text-sm text-amber-800'>
                      <strong>Same-day booking:</strong> Requires immediate
                      confirmation from our team.
                    </div>
                  </div>
                ) : !hasMinimum24Hours(formData.startDate) ? (
                  <div className='p-3 bg-red-50 border border-red-200 rounded-lg flex items-start'>
                    <AlertTriangle className='w-4 h-4 text-red-600 mr-2 mt-0.5' />
                    <div className='text-sm text-red-800'>
                      <strong>Advance booking required:</strong> Please book at
                      least 24 hours in advance.
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>

          {/* Location */}
          <div>
            <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
              <MapPin className='w-4 h-4 mr-2 text-green-700' />
              Location *
            </label>
            <input
              type='text'
              name='location'
              value={formData.location}
              onChange={handleInputChange}
              className={`w-full p-3 border ${
                errors.location ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:ring-green-500 focus:border-green-500`}
              placeholder='Please provide the complete address where the personal will bring your bike.'
            />
            {errors.location && (
              <p className='text-red-500 text-xs mt-1'>{errors.location}</p>
            )}
          </div>

          {/* Participants Section */}
          <div className='space-y-6'>
            <div className='flex items-center justify-between'>
              <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2 flex-grow'>
                Participants & Bike Selection
              </h3>
              <div className='text-sm text-gray-600 ml-4'>
                {totalParticipants}{' '}
                {totalParticipants === 1 ? 'person' : 'people'}
              </div>
            </div>

            {/* People Cards */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {formData.people.map((person, index) => (
                <PersonCard key={person.id} person={person} index={index} />
              ))}
            </div>

            {/* Add Person Buttons */}
            <div className='flex flex-wrap gap-4'>
              <button
                type='button'
                onClick={() => addPerson('adult')}
                className='flex items-center px-4 py-2 border-2 border-dashed border-green-300 text-green-700 rounded-lg hover:border-green-400 hover:bg-green-50 transition'
              >
                <Plus className='w-4 h-4 mr-2' />
                Add Adult
              </button>

              <button
                type='button'
                onClick={() => addPerson('child')}
                className='flex items-center px-4 py-2 border-2 border-dashed border-blue-300 text-blue-700 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition'
              >
                <Plus className='w-4 h-4 mr-2' />
                Add Child
              </button>
            </div>

            {errors.people && (
              <p className='text-red-500 text-sm font-medium'>
                {errors.people}
              </p>
            )}
          </div>

          {/* Booking Summary */}
          {totalParticipants > 0 && (
            <div className='bg-gray-50 rounded-lg p-4'>
              <h4 className='font-medium text-gray-800 mb-3'>
                Booking Summary
              </h4>
              <div className='space-y-2 text-sm'>
                <div className='flex justify-between'>
                  <span>Adults:</span>
                  <span>{adultCount}</span>
                </div>
                <div className='flex justify-between'>
                  <span>Children:</span>
                  <span>{childCount}</span>
                </div>
                <div className='border-t pt-2 mt-2'>
                  <div className='flex justify-between font-medium'>
                    <span>Total Participants:</span>
                    <span>{totalParticipants}</span>
                  </div>
                </div>
                {Object.entries(selectedBikes).map(([bikeType, count]) => {
                  const bike = BIKE_TYPES.find((b) => b.id === bikeType);
                  if (!bike || count === 0) return null;
                  return (
                    <div
                      key={bikeType}
                      className='flex justify-between text-xs text-gray-600'
                    >
                      <span>
                        {bike.icon} {bike.name}:
                      </span>
                      <span>
                        {count} × ${bike.price} = $
                        {bike.price * count * rentalDays}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Safety Information */}
          <div className='bg-amber-50 border border-amber-200 rounded-lg p-4'>
            <div className='flex items-start'>
              <AlertTriangle className='w-5 h-5 text-amber-600 mr-3 flex-shrink-0 mt-0.5' />
              <div>
                <h4 className='font-medium text-amber-800 mb-2'>
                  Safety Information
                </h4>
                <ul className='text-sm text-amber-700 space-y-1'>
                  <li>
                    • Helmets are strongly recommended and provided free of
                    charge
                  </li>
                  <li>• Children under 16 must be accompanied by an adult</li>
                  <li>• Please follow all local traffic regulations</li>
                  <li>• Rental includes basic insurance coverage</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {errors.submit && (
            <div className='p-3 bg-red-50 border border-red-200 rounded-lg'>
              <p className='text-red-800 text-sm'>{errors.submit}</p>
            </div>
          )}
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
              {rentalDays > 1 && (
                <span className='ml-2 text-sm bg-green-800 px-2 py-1 rounded'>
                  {rentalDays} days
                </span>
              )}
            </div>

            {/* Price breakdown */}
            <div className='text-xs text-gray-400 mt-2 space-y-1'>
              {Object.entries(selectedBikes).map(([bikeType, count]) => {
                if (count === 0) return null;
                const bike = BIKE_TYPES.find((b) => b.id === bikeType);
                if (!bike) return null;
                return (
                  <div key={bikeType}>
                    {bike.name}: {count} × ${bike.price} × {rentalDays} days = $
                    {bike.price * count * rentalDays}
                  </div>
                );
              })}
              {formData.deliveryToHotel &&
                formData.location !== 'Hotel pickup' && (
                  <div>Delivery service: +$10</div>
                )}
              <div className='text-green-400'>Helmets & locks: Free!</div>
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
              className='px-8 py-3 bg-green-700 hover:bg-green-600 text-white rounded-lg transition flex items-center disabled:opacity-50'
            >
              <CreditCard className='h-4 w-4 mr-2' />
              {isSubmitting ? 'Booking...' : 'Book Bikes'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default BikeForm;
