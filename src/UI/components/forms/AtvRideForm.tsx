import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  Users,
  Calendar,
  Clock,
  Check,
  CreditCard,
  Sparkles,
} from 'lucide-react';

const VEHICLE_TYPES = {
  ATV: {
    id: 'atv',
    name: 'ATV Quad',
    description: 'Single rider adventure',
    price: 89,
    duration: '3 hours',
    maxParticipants: 1,
  },
  BUGGY: {
    id: 'buggy',
    name: 'Dune Buggy',
    description: 'Shared adventure for couples',
    price: 129,
    duration: '3 hours',
    maxParticipants: 2,
  },
  POLARIS: {
    id: 'polaris',
    name: 'Polaris RZR',
    description: 'Premium off-road experience',
    price: 159,
    duration: '3 hours',
    maxParticipants: 2,
  },
};

const AtvRideForm = ({ isOpen, onClose, onConfirm, service }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    participants: 1,
    date: '',
    time: '9:00',
    specialRequests: '',
    emergencyContact: '',
    experience: 'beginner',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});

  const vehicle =
    service || (service?.id ? VEHICLE_TYPES[service.id.toUpperCase()] : null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim())
      newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.date) newErrors.date = 'Please select a date';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      const personalInfoValid =
        formData.firstName &&
        formData.lastName &&
        formData.email &&
        formData.phone;
      if (personalInfoValid) {
        setCurrentStep(2);
      }
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const bookingData = {
        service: vehicle,
        dates: { date: formData.date, time: formData.time },
        guests: formData.participants,
        customerInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          emergencyContact: formData.emergencyContact,
          experience: formData.experience,
          specialRequests: formData.specialRequests,
        },
      };

      console.log('Booking submitted:', bookingData);

      if (onConfirm) {
        onConfirm(
          vehicle,
          { date: formData.date, time: formData.time },
          formData.participants
        );
      }

      alert(
        '¡Reserva confirmada! Te contactaremos pronto para confirmar los detalles.'
      );
    } catch (error) {
      console.error('Booking error:', error);
      alert('Error al procesar la reserva. Por favor intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
      resetForm();
      onClose();
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      participants: 1,
      date: '',
      time: '9:00',
      specialRequests: '',
      emergencyContact: '',
      experience: 'beginner',
    });
    setCurrentStep(1);
    setErrors({});
  };

  const totalPrice = vehicle ? vehicle.price * formData.participants : 0;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      resetForm();
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
      <div
        className='absolute inset-0 bg-black/60 backdrop-blur-sm'
        onClick={onClose}
      />

      <div className='relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto'>
        {/* Header */}
        <div className='sticky top-0 bg-white border-b px-6 py-4 rounded-t-2xl z-10'>
          <div className='flex items-center justify-between'>
            <div>
              <h2 className='text-2xl font-bold text-gray-800'>
                Book Your Adventure
              </h2>
              {vehicle && (
                <div className='flex items-center gap-3 mt-1'>
                  <p className='text-green-600 font-medium'>{vehicle.name}</p>
                  <span className='text-amber-600 font-bold'>
                    ${vehicle.price}
                  </span>
                  <div className='flex items-center gap-1'>
                    <Clock className='w-4 h-4 text-gray-500' />
                    <span className='text-sm text-gray-600'>
                      {vehicle.duration}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className='p-2 hover:bg-gray-100 rounded-full transition-colors'
            >
              <X className='w-6 h-6' />
            </button>
          </div>

          {/* Step Indicator */}
          <div className='flex items-center gap-4 mt-4'>
            <div
              className={`flex items-center gap-2 ${
                currentStep >= 1 ? 'text-green-600' : 'text-gray-400'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= 1 ? 'bg-green-100' : 'bg-gray-100'
                }`}
              >
                1
              </div>
              <span className='text-sm font-medium'>Personal Info</span>
            </div>

            <div
              className={`h-px flex-1 ${
                currentStep >= 2 ? 'bg-green-200' : 'bg-gray-200'
              }`}
            />

            <div
              className={`flex items-center gap-2 ${
                currentStep >= 2 ? 'text-green-600' : 'text-gray-400'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= 2 ? 'bg-green-100' : 'bg-gray-100'
                }`}
              >
                2
              </div>
              <span className='text-sm font-medium'>Tour Details</span>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className='p-6'>
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className='space-y-6'>
              <div className='text-center mb-6'>
                <h3 className='text-xl font-semibold text-gray-800 mb-2'>
                  Tell us about yourself
                </h3>
                <p className='text-gray-600'>
                  We need this information to ensure your safety and contact
                  you.
                </p>
              </div>

              <div className='grid md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    <User className='w-4 h-4 inline mr-1' />
                    First Name *
                  </label>
                  <input
                    type='text'
                    name='firstName'
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`w-full p-3 border rounded-lg transition-all ${
                      errors.firstName
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-amber-500'
                    } focus:ring-2 focus:border-transparent`}
                    placeholder='Your first name'
                  />
                  {errors.firstName && (
                    <p className='text-red-500 text-sm mt-1'>
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Last Name *
                  </label>
                  <input
                    type='text'
                    name='lastName'
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full p-3 border rounded-lg transition-all ${
                      errors.lastName
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-amber-500'
                    } focus:ring-2 focus:border-transparent`}
                    placeholder='Your last name'
                  />
                  {errors.lastName && (
                    <p className='text-red-500 text-sm mt-1'>
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div className='grid md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    <Mail className='w-4 h-4 inline mr-1' />
                    Email *
                  </label>
                  <input
                    type='email'
                    name='email'
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full p-3 border rounded-lg transition-all ${
                      errors.email
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-amber-500'
                    } focus:ring-2 focus:border-transparent`}
                    placeholder='your@email.com'
                  />
                  {errors.email && (
                    <p className='text-red-500 text-sm mt-1'>{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    <Phone className='w-4 h-4 inline mr-1' />
                    Phone *
                  </label>
                  <input
                    type='tel'
                    name='phone'
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full p-3 border rounded-lg transition-all ${
                      errors.phone
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-amber-500'
                    } focus:ring-2 focus:border-transparent`}
                    placeholder='+1 (555) 123-4567'
                  />
                  {errors.phone && (
                    <p className='text-red-500 text-sm mt-1'>{errors.phone}</p>
                  )}
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Experience Level
                </label>
                <select
                  name='experience'
                  value={formData.experience}
                  onChange={handleInputChange}
                  className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all'
                >
                  <option value='beginner'>Beginner - First time</option>
                  <option value='intermediate'>
                    Intermediate - Some experience
                  </option>
                  <option value='advanced'>Advanced - Very experienced</option>
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Emergency Contact (Optional)
                </label>
                <input
                  type='text'
                  name='emergencyContact'
                  value={formData.emergencyContact}
                  onChange={handleInputChange}
                  className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all'
                  placeholder='Name and phone number'
                />
              </div>

              <button
                onClick={handleNextStep}
                disabled={
                  !formData.firstName ||
                  !formData.lastName ||
                  !formData.email ||
                  !formData.phone
                }
                className='w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-[1.02] disabled:scale-100'
              >
                Continue to Tour Details
              </button>
            </div>
          )}

          {/* Step 2: Tour Details */}
          {currentStep === 2 && (
            <div className='space-y-6'>
              <div className='text-center mb-6'>
                <h3 className='text-xl font-semibold text-gray-800 mb-2'>
                  Adventure Details
                </h3>
                <p className='text-gray-600'>
                  Choose your preferred date, time, and group size.
                </p>
              </div>

              {/* Vehicle Summary Card */}
              {vehicle && (
                <div className='bg-gradient-to-r from-green-50 to-amber-50 p-4 rounded-xl border border-green-200'>
                  <div className='flex items-center gap-4'>
                    <div className='w-16 h-16 bg-white rounded-lg flex items-center justify-center shadow-sm'>
                      <Sparkles className='w-8 h-8 text-green-500' />
                    </div>
                    <div className='flex-1'>
                      <h4 className='font-bold text-gray-800'>
                        {vehicle.name}
                      </h4>
                      <p className='text-sm text-gray-600'>
                        {vehicle.description}
                      </p>
                      <div className='flex items-center gap-4 mt-2'>
                        <span className='text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full'>
                          Max {vehicle.maxParticipants} riders
                        </span>
                        <span className='text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full'>
                          {vehicle.duration}
                        </span>
                      </div>
                    </div>
                    <div className='text-right'>
                      <p className='text-2xl font-bold text-green-600'>
                        ${vehicle.price}
                      </p>
                      <p className='text-xs text-gray-500'>per person</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tour Details Form */}
              <div className='grid md:grid-cols-3 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    <Users className='w-4 h-4 inline mr-1' />
                    Participants *
                  </label>
                  <select
                    name='participants'
                    value={formData.participants}
                    onChange={handleInputChange}
                    className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all'
                  >
                    {Array.from(
                      { length: vehicle?.maxParticipants || 6 },
                      (_, i) => i + 1
                    ).map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Person' : 'People'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    <Calendar className='w-4 h-4 inline mr-1' />
                    Date *
                  </label>
                  <input
                    type='date'
                    name='date'
                    value={formData.date}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    className={`w-full p-3 border rounded-lg transition-all ${
                      errors.date
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-amber-500'
                    } focus:ring-2 focus:border-transparent`}
                  />
                  {errors.date && (
                    <p className='text-red-500 text-sm mt-1'>{errors.date}</p>
                  )}
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    <Clock className='w-4 h-4 inline mr-1' />
                    Preferred Time
                  </label>
                  <select
                    name='time'
                    value={formData.time}
                    onChange={handleInputChange}
                    className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all'
                  >
                    <option value='9:00'>9:00 AM - Morning Adventure</option>
                    <option value='11:00'>11:00 AM - Late Morning</option>
                    <option value='13:00'>1:00 PM - Afternoon Ride</option>
                    <option value='15:00'>3:00 PM - Sunset Special</option>
                  </select>
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Special Requests or Dietary Restrictions
                </label>
                <textarea
                  name='specialRequests'
                  value={formData.specialRequests}
                  onChange={handleInputChange}
                  rows={3}
                  className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all'
                  placeholder='Any allergies, special requirements, celebration details, or other notes...'
                />
              </div>

              {/* What's Included */}
              <div className='bg-gray-50 p-4 rounded-lg'>
                <h4 className='font-semibold text-gray-800 mb-3 flex items-center gap-2'>
                  <Check className='w-4 h-4 text-green-500' />
                  What's Included
                </h4>
                <div className='grid grid-cols-2 gap-2 text-sm text-gray-600'>
                  <div className='flex items-center gap-2'>
                    <Check className='w-3 h-3 text-green-500' />
                    <span>Round-trip transport</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Check className='w-3 h-3 text-green-500' />
                    <span>Safety equipment</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Check className='w-3 h-3 text-green-500' />
                    <span>Professional guide</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Check className='w-3 h-3 text-green-500' />
                    <span>Refreshments</span>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className='bg-gradient-to-r from-amber-50 to-green-50 p-6 rounded-xl border border-amber-200'>
                <h4 className='font-semibold text-gray-800 mb-4 flex items-center gap-2'>
                  <CreditCard className='w-4 h-4' />
                  Price Summary
                </h4>

                <div className='space-y-3'>
                  <div className='flex justify-between items-center'>
                    <div>
                      <p className='font-medium text-gray-800'>
                        {vehicle?.name}
                      </p>
                      <p className='text-sm text-gray-600'>
                        ${vehicle?.price} × {formData.participants}{' '}
                        participant(s)
                      </p>
                    </div>
                    <span className='text-lg font-semibold text-gray-800'>
                      ${totalPrice}
                    </span>
                  </div>

                  <hr className='border-gray-200' />

                  <div className='flex justify-between items-center'>
                    <span className='text-lg font-bold text-gray-800'>
                      Total Price
                    </span>
                    <span className='text-2xl font-bold text-green-600'>
                      ${totalPrice}
                    </span>
                  </div>

                  <div className='text-xs text-gray-500 mt-2'>
                    <p>• Price includes all equipment and guide</p>
                    <p>• Free cancellation up to 24 hours before</p>
                    <p>• Payment on arrival - no advance payment required</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className='flex gap-4'>
                <button
                  onClick={() => setCurrentStep(1)}
                  className='flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-all'
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !formData.date}
                  className='flex-2 bg-gradient-to-r from-amber-500 to-green-500 hover:from-amber-600 hover:to-green-600 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold py-3 px-8 rounded-lg transition-all transform hover:scale-[1.02] disabled:scale-100 shadow-lg'
                >
                  {isSubmitting ? (
                    <div className='flex items-center justify-center gap-2'>
                      <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                      Processing...
                    </div>
                  ) : (
                    'Confirm Booking'
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Terms */}
          <div className='text-xs text-gray-500 text-center pt-4 border-t'>
            <p>By booking, you agree to our terms and conditions.</p>
            <p>Must be 16+ years old. Under 18 requires adult supervision.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AtvRideForm;
