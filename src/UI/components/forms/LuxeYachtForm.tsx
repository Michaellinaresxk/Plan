import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { Service } from '@/types/type';
import {
  Anchor,
  Calendar,
  Clock,
  MapPin,
  Users,
  MessageSquare,
  CreditCard,
  AlertCircle,
  Star,
  Waves,
  Check,
  Info,
  Zap,
  BedDouble,
  Ruler,
} from 'lucide-react';

interface YachtFormProps {
  service: Service;
  onSubmit: (formData: any) => void;
  onCancel: () => void;
  yachtData?: any; // Additional yacht-specific data
}

interface FormData {
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  guestCount: number;
  specialRequests: string;
  // Additional yacht-specific fields
  yachtType: string;
  duration: string;
  hasTransport: boolean;
  cateringOption: string;
  waterSports: string[];
}

const LuxeYachtForm: React.FC<YachtFormProps> = ({
  service,
  onSubmit,
  onCancel,
  yachtData,
}) => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState<FormData>({
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    guestCount: 1,
    specialRequests: '',
    yachtType: yachtData?.selectedYacht || '',
    duration: 'half-day',
    hasTransport: false,
    cateringOption: 'basic',
    waterSports: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentPrice, setCurrentPrice] = useState(service?.price ?? 0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Yacht options based on the data from YachtServiceView
  const yachtOptions = [
    {
      id: 'sport-yacht-42',
      name: 'Azimut S7',
      category: 'Sport Yacht',
      length: '68 ft',
      maxGuests: 12,
      basePrice: 2500,
      image:
        'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop',
      gradient: 'from-cyan-500 to-blue-600',
    },
    {
      id: 'luxury-yacht-85',
      name: 'Princess Y85',
      category: 'Luxury Yacht',
      length: '85 ft',
      maxGuests: 18,
      basePrice: 5500,
      image:
        'https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=400&h=300&fit=crop',
      gradient: 'from-purple-600 to-pink-600',
    },
    {
      id: 'mega-yacht-120',
      name: 'Sunseeker 120',
      category: 'Mega Yacht',
      length: '120 ft',
      maxGuests: 24,
      basePrice: 12000,
      image:
        'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=400&h=300&fit=crop',
      gradient: 'from-amber-500 to-orange-600',
    },
  ];

  // Duration options
  const durationOptions = [
    { id: 'half-day', name: 'Half Day (4 hours)', multiplier: 0.5 },
    { id: 'full-day', name: 'Full Day (8 hours)', multiplier: 1 },
    { id: 'sunset', name: 'Sunset Cruise (3 hours)', multiplier: 0.4 },
    { id: 'overnight', name: 'Overnight (24 hours)', multiplier: 2 },
  ];

  // Location options
  const locationOptions = [
    'Punta Cana Marina',
    'Cap Cana Marina',
    'Bavaro Beach',
    'Macao Beach',
    'Hotel Pickup (Bavaro/Punta Cana)',
    'Custom Location',
  ];

  // Catering options
  const cateringOptions = [
    {
      id: 'basic',
      name: 'Basic Package',
      description: 'Light snacks and beverages',
      price: 0,
    },
    {
      id: 'premium',
      name: 'Premium Package',
      description: 'Gourmet lunch and premium drinks',
      price: 150,
    },
    {
      id: 'luxury',
      name: 'Luxury Package',
      description: 'Chef-prepared meals and top-shelf bar',
      price: 300,
    },
  ];

  // Water sports options
  const waterSportsOptions = [
    { id: 'snorkeling', name: 'Snorkeling Equipment', price: 50 },
    { id: 'fishing', name: 'Deep Sea Fishing', price: 200 },
    { id: 'jetski', name: 'Jet Ski Rental', price: 300 },
    { id: 'paddleboard', name: 'Paddle Boards', price: 75 },
    { id: 'kayak', name: 'Kayaks', price: 60 },
    { id: 'diving', name: 'Scuba Diving', price: 250 },
  ];

  // Calculate price based on form selections
  useEffect(() => {
    let price = service.price;

    // Get selected yacht
    const selectedYacht = yachtOptions.find((y) => y.id === formData.yachtType);
    if (selectedYacht) {
      price = selectedYacht.basePrice;
    }

    // Apply duration multiplier
    const duration = durationOptions.find((d) => d.id === formData.duration);
    if (duration) {
      price *= duration.multiplier;
    }

    // Add guest count pricing (base price includes up to 6 guests)
    if (formData.guestCount > 6) {
      const extraGuests = formData.guestCount - 6;
      price += extraGuests * 100; // $100 per additional guest
    }

    // Add catering price
    const catering = cateringOptions.find(
      (c) => c.id === formData.cateringOption
    );
    if (catering) {
      price += catering.price;
    }

    // Add water sports pricing
    const waterSportsPrice = formData.waterSports.reduce((total, sportId) => {
      const sport = waterSportsOptions.find((s) => s.id === sportId);
      return total + (sport?.price || 0);
    }, 0);
    price += waterSportsPrice;

    // Add transport fee
    if (formData.hasTransport) {
      price += 150; // Hotel pickup/drop-off
    }

    setCurrentPrice(price);
  }, [
    formData.yachtType,
    formData.duration,
    formData.guestCount,
    formData.cateringOption,
    formData.waterSports,
    formData.hasTransport,
    service.price,
  ]);

  // Handle input changes
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
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Handle water sports selection
  const toggleWaterSport = (sportId: string) => {
    setFormData((prev) => ({
      ...prev,
      waterSports: prev.waterSports.includes(sportId)
        ? prev.waterSports.filter((id) => id !== sportId)
        : [...prev.waterSports, sportId],
    }));
  };

  // Handle guest count changes
  const updateGuestCount = (increment: boolean) => {
    const selectedYacht = yachtOptions.find((y) => y.id === formData.yachtType);
    const maxGuests = selectedYacht?.maxGuests || 20;

    setFormData((prev) => ({
      ...prev,
      guestCount: increment
        ? Math.min(maxGuests, prev.guestCount + 1)
        : Math.max(1, prev.guestCount - 1),
    }));
  };

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required';
    }

    if (!formData.location) {
      newErrors.location = 'Location is required';
    }

    if (!formData.yachtType) {
      newErrors.yachtType = 'Please select a yacht';
    }

    // Validate end time if provided
    if (formData.startTime && formData.endTime) {
      const start = new Date(`2000-01-01T${formData.startTime}`);
      const end = new Date(`2000-01-01T${formData.endTime}`);
      if (end <= start) {
        newErrors.endTime = 'End time must be after start time';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    const submissionData = {
      ...formData,
      totalPrice: currentPrice,
      serviceId: service.id,
      serviceName: service.name,
      selectedYachtDetails: yachtOptions.find(
        (y) => y.id === formData.yachtType
      ),
    };

    // Simulate API call
    setTimeout(() => {
      onSubmit(submissionData);
      setIsSubmitting(false);
    }, 2000);
  };

  const selectedYacht = yachtOptions.find((y) => y.id === formData.yachtType);
  const isPremium = service.packageType?.includes('premium');

  return (
    <div className='w-full mx-auto overflow-hidden'>
      <div className='bg-white rounded-2xl shadow-2xl border border-gray-100'>
        {/* Header */}
        <div
          className={`bg-gradient-to-r ${
            isPremium
              ? 'from-amber-900 via-amber-800 to-amber-900'
              : 'from-blue-900 via-blue-800 to-cyan-900'
          } p-8 text-white relative overflow-hidden`}
        >
          <div className='absolute inset-0 bg-black/10'></div>
          <div className='absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full'></div>
          <div className='absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full'></div>

          <div className='relative'>
            <div className='flex items-center mb-4'>
              <Anchor className='w-8 h-8 mr-3' />
              <h2 className='text-3xl font-light tracking-wide'>
                {t('yacht.form.title', { fallback: 'Luxury Yacht Booking' })}
              </h2>
            </div>
            <p
              className={`${
                isPremium ? 'text-amber-100' : 'text-blue-100'
              } text-lg font-light`}
            >
              {t('yacht.form.subtitle', {
                fallback: 'Reserve your exclusive yacht experience in paradise',
              })}
            </p>
          </div>
        </div>

        {/* Form Body */}
        <div className='p-8 space-y-10'>
          {/* Yacht Selection */}
          <div className='space-y-6'>
            <h3
              className={`text-xl font-semibold ${
                isPremium ? 'text-amber-900' : 'text-blue-900'
              } border-b border-gray-200 pb-3 flex items-center`}
            >
              <Anchor
                className={`w-6 h-6 mr-3 ${
                  isPremium ? 'text-amber-600' : 'text-blue-600'
                }`}
              />
              Select Your Yacht
            </h3>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
              {yachtOptions.map((yacht) => (
                <div
                  key={yacht.id}
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, yachtType: yacht.id }))
                  }
                  className={`relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                    formData.yachtType === yacht.id
                      ? 'ring-4 ring-blue-500 shadow-2xl'
                      : 'shadow-lg hover:shadow-xl'
                  }`}
                >
                  <div className='relative h-48'>
                    <img
                      src={yacht.image}
                      alt={yacht.name}
                      className='w-full h-full object-cover'
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-t ${yacht.gradient} opacity-30`}
                    ></div>

                    {formData.yachtType === yacht.id && (
                      <div className='absolute top-4 right-4 bg-white rounded-full p-2'>
                        <Check className='w-5 h-5 text-green-500' />
                      </div>
                    )}
                  </div>

                  <div className='p-4 bg-white'>
                    <div className='flex justify-between items-start mb-2'>
                      <h4 className='font-bold text-lg text-gray-900'>
                        {yacht.name}
                      </h4>
                      <div className='text-right'>
                        <div className='text-xl font-bold text-blue-600'>
                          ${yacht.basePrice.toLocaleString()}
                        </div>
                        <div className='text-xs text-gray-500'>per day</div>
                      </div>
                    </div>
                    <p className='text-sm text-gray-600 mb-3'>
                      {yacht.category}
                    </p>

                    <div className='grid grid-cols-2 gap-2 text-xs'>
                      <div className='flex items-center text-gray-600'>
                        <Ruler className='w-3 h-3 mr-1' />
                        {yacht.length}
                      </div>
                      <div className='flex items-center text-gray-600'>
                        <Users className='w-3 h-3 mr-1' />
                        {yacht.maxGuests} guests
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {errors.yachtType && (
              <p className='text-red-500 text-sm'>{errors.yachtType}</p>
            )}
          </div>

          {/* Date, Time & Duration */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            <div className='space-y-6'>
              <h3
                className={`text-xl font-semibold ${
                  isPremium ? 'text-amber-900' : 'text-blue-900'
                } border-b border-gray-200 pb-3 flex items-center`}
              >
                <Calendar
                  className={`w-6 h-6 mr-3 ${
                    isPremium ? 'text-amber-600' : 'text-blue-600'
                  }`}
                />
                When
              </h3>

              {/* Date */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Date *
                </label>
                <input
                  type='date'
                  name='date'
                  value={formData.date}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full p-4 border rounded-xl focus:ring-2 ${
                    isPremium
                      ? 'focus:ring-amber-500 focus:border-amber-500'
                      : 'focus:ring-blue-500 focus:border-blue-500'
                  } ${
                    errors.date ? 'border-red-300' : 'border-gray-300'
                  } bg-gray-50`}
                />
                {errors.date && (
                  <p className='text-red-500 text-sm mt-1'>{errors.date}</p>
                )}
              </div>

              {/* Time Range */}
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Start Time *
                  </label>
                  <input
                    type='time'
                    name='startTime'
                    value={formData.startTime}
                    onChange={handleInputChange}
                    className={`w-full p-4 border rounded-xl focus:ring-2 ${
                      isPremium
                        ? 'focus:ring-amber-500 focus:border-amber-500'
                        : 'focus:ring-blue-500 focus:border-blue-500'
                    } ${
                      errors.startTime ? 'border-red-300' : 'border-gray-300'
                    } bg-gray-50`}
                  />
                  {errors.startTime && (
                    <p className='text-red-500 text-sm mt-1'>
                      {errors.startTime}
                    </p>
                  )}
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    End Time (Optional)
                  </label>
                  <input
                    type='time'
                    name='endTime'
                    value={formData.endTime}
                    onChange={handleInputChange}
                    className={`w-full p-4 border rounded-xl focus:ring-2 ${
                      isPremium
                        ? 'focus:ring-amber-500 focus:border-amber-500'
                        : 'focus:ring-blue-500 focus:border-blue-500'
                    } ${
                      errors.endTime ? 'border-red-300' : 'border-gray-300'
                    } bg-gray-50`}
                  />
                  {errors.endTime && (
                    <p className='text-red-500 text-sm mt-1'>
                      {errors.endTime}
                    </p>
                  )}
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-3'>
                  Duration Package
                </label>
                <div className='space-y-3'>
                  {durationOptions.map((option) => (
                    <div
                      key={option.id}
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          duration: option.id,
                        }))
                      }
                      className={`p-4 border rounded-xl cursor-pointer transition-all ${
                        formData.duration === option.id
                          ? `border-blue-500 bg-blue-50`
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className='flex items-center justify-between'>
                        <span className='font-medium'>{option.name}</span>
                        {formData.duration === option.id && (
                          <Check className='w-5 h-5 text-blue-500' />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className='space-y-6'>
              <h3
                className={`text-xl font-semibold ${
                  isPremium ? 'text-amber-900' : 'text-blue-900'
                } border-b border-gray-200 pb-3 flex items-center`}
              >
                <MapPin
                  className={`w-6 h-6 mr-3 ${
                    isPremium ? 'text-amber-600' : 'text-blue-600'
                  }`}
                />
                Where & Who
              </h3>

              {/* Location */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Departure Location *
                </label>
                <select
                  name='location'
                  value={formData.location}
                  onChange={handleInputChange}
                  className={`w-full p-4 border rounded-xl focus:ring-2 ${
                    isPremium
                      ? 'focus:ring-amber-500 focus:border-amber-500'
                      : 'focus:ring-blue-500 focus:border-blue-500'
                  } ${
                    errors.location ? 'border-red-300' : 'border-gray-300'
                  } bg-gray-50`}
                >
                  <option value=''>Select location</option>
                  {locationOptions.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
                {errors.location && (
                  <p className='text-red-500 text-sm mt-1'>{errors.location}</p>
                )}
              </div>

              {/* Hotel Transport */}
              <div className='flex items-center bg-gray-50 p-4 rounded-xl'>
                <input
                  type='checkbox'
                  id='hasTransport'
                  name='hasTransport'
                  checked={formData.hasTransport}
                  onChange={handleInputChange}
                  className={`h-5 w-5 ${
                    isPremium
                      ? 'text-amber-600 focus:ring-amber-500'
                      : 'text-blue-600 focus:ring-blue-500'
                  } border-gray-300 rounded`}
                />
                <label
                  htmlFor='hasTransport'
                  className='ml-3 text-sm text-gray-700'
                >
                  Hotel pickup and drop-off service (+$150)
                </label>
              </div>

              {/* Guest Count */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-3'>
                  Number of Guests
                </label>
                <div className='flex items-center justify-center max-w-xs mx-auto'>
                  <button
                    type='button'
                    onClick={() => updateGuestCount(false)}
                    className='w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors'
                  >
                    -
                  </button>
                  <div className='mx-6 text-center'>
                    <div className='text-3xl font-bold text-gray-900'>
                      {formData.guestCount}
                    </div>
                    <div className='text-sm text-gray-600'>guests</div>
                  </div>
                  <button
                    type='button'
                    onClick={() => updateGuestCount(true)}
                    className='w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors'
                  >
                    +
                  </button>
                </div>
                {selectedYacht && (
                  <p className='text-sm text-gray-500 mt-2 text-center'>
                    Maximum: {selectedYacht.maxGuests} guests
                  </p>
                )}
                {formData.guestCount > 6 && (
                  <p className='text-sm text-blue-600 mt-2 text-center'>
                    +${(formData.guestCount - 6) * 100} for additional guests
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Catering Options */}
          <div className='space-y-6'>
            <h3
              className={`text-xl font-semibold ${
                isPremium ? 'text-amber-900' : 'text-blue-900'
              } border-b border-gray-200 pb-3 flex items-center`}
            >
              <Star
                className={`w-6 h-6 mr-3 ${
                  isPremium ? 'text-amber-600' : 'text-blue-600'
                }`}
              />
              Catering & Beverages
            </h3>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              {cateringOptions.map((option) => (
                <div
                  key={option.id}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      cateringOption: option.id,
                    }))
                  }
                  className={`p-6 border rounded-xl cursor-pointer transition-all ${
                    formData.cateringOption === option.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className='flex items-center justify-between mb-2'>
                    <h4 className='font-semibold'>{option.name}</h4>
                    {option.price > 0 && (
                      <span className='text-blue-600 font-medium'>
                        +${option.price}
                      </span>
                    )}
                  </div>
                  <p className='text-sm text-gray-600 mb-3'>
                    {option.description}
                  </p>
                  {formData.cateringOption === option.id && (
                    <Check className='w-5 h-5 text-blue-500' />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Water Sports */}
          <div className='space-y-6'>
            <h3
              className={`text-xl font-semibold ${
                isPremium ? 'text-amber-900' : 'text-blue-900'
              } border-b border-gray-200 pb-3 flex items-center`}
            >
              <Waves
                className={`w-6 h-6 mr-3 ${
                  isPremium ? 'text-amber-600' : 'text-blue-600'
                }`}
              />
              Water Sports & Activities
            </h3>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {waterSportsOptions.map((sport) => (
                <div
                  key={sport.id}
                  onClick={() => toggleWaterSport(sport.id)}
                  className={`p-4 border rounded-xl cursor-pointer transition-all ${
                    formData.waterSports.includes(sport.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className='flex items-center justify-between'>
                    <div>
                      <h4 className='font-medium'>{sport.name}</h4>
                      <span className='text-blue-600 text-sm'>
                        +${sport.price}
                      </span>
                    </div>
                    {formData.waterSports.includes(sport.id) && (
                      <Check className='w-5 h-5 text-blue-500' />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Special Requests */}
          <div className='space-y-6'>
            <h3
              className={`text-xl font-semibold ${
                isPremium ? 'text-amber-900' : 'text-blue-900'
              } border-b border-gray-200 pb-3 flex items-center`}
            >
              <MessageSquare
                className={`w-6 h-6 mr-3 ${
                  isPremium ? 'text-amber-600' : 'text-blue-600'
                }`}
              />
              Special Requests
            </h3>

            <textarea
              name='specialRequests'
              value={formData.specialRequests}
              onChange={handleInputChange}
              rows={4}
              placeholder='Tell us about any special occasions, dietary requirements, preferred routes, or specific requests to make your yacht experience perfect...'
              className={`w-full p-4 border rounded-xl focus:ring-2 ${
                isPremium
                  ? 'focus:ring-amber-500 focus:border-amber-500'
                  : 'focus:ring-blue-500 focus:border-blue-500'
              } border-gray-300 bg-gray-50 resize-none`}
            />
          </div>

          {/* Important Information */}
          <div className='bg-blue-50 p-6 rounded-2xl'>
            <div className='flex items-start'>
              <Info className='w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5' />
              <div>
                <h4 className='font-semibold text-blue-900 mb-2'>
                  What's Included
                </h4>
                <ul className='text-sm text-blue-800 space-y-1'>
                  <li>• Professional captain and crew</li>
                  <li>• Fuel, insurance, and safety equipment</li>
                  <li>• Basic refreshments and towels</li>
                  <li>• Sound system and entertainment</li>
                  <li>• Snorkeling equipment (basic package)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with Price and Actions */}
        <div
          className={`bg-gradient-to-r ${
            isPremium
              ? 'from-amber-900 to-amber-800'
              : 'from-blue-900 to-cyan-900'
          } text-white p-8`}
        >
          <div className='flex flex-col lg:flex-row items-center justify-between'>
            <div className='flex flex-col items-center lg:items-start mb-6 lg:mb-0'>
              <span className='text-white/80 text-sm uppercase tracking-wide font-medium'>
                Total Investment
              </span>
              <div className='flex items-center mt-2'>
                <span className='text-4xl font-light'>
                  ${currentPrice.toLocaleString()}
                </span>
                {selectedYacht && (
                  <span className='ml-3 bg-white/20 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-full'>
                    {selectedYacht.name}
                  </span>
                )}
              </div>

              {/* Price breakdown */}
              <div className='text-xs text-white/60 mt-3 space-y-1'>
                {selectedYacht && (
                  <div>Yacht: ${selectedYacht.basePrice.toLocaleString()}</div>
                )}
                {formData.guestCount > 6 && (
                  <div>Extra guests: +${(formData.guestCount - 6) * 100}</div>
                )}
                {formData.cateringOption !== 'basic' && (
                  <div>
                    Catering: +$
                    {
                      cateringOptions.find(
                        (c) => c.id === formData.cateringOption
                      )?.price
                    }
                  </div>
                )}
                {formData.waterSports.length > 0 && (
                  <div>
                    Activities: +$
                    {formData.waterSports.reduce((total, sportId) => {
                      const sport = waterSportsOptions.find(
                        (s) => s.id === sportId
                      );
                      return total + (sport?.price || 0);
                    }, 0)}
                  </div>
                )}
                {formData.hasTransport && <div>Transport: +$150</div>}
              </div>
            </div>

            <div className='flex flex-col sm:flex-row gap-4'>
              <button
                onClick={onCancel}
                className='px-8 py-4 border-2 border-white/30 rounded-xl text-white hover:bg-white/10 transition-colors font-medium'
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`px-12 py-4 bg-white text-blue-900 rounded-xl hover:bg-white/90 transition-colors font-semibold flex items-center justify-center ${
                  isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-blue-900 mr-2'></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className='w-5 h-5 mr-2' />
                    Reserve Yacht
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LuxeYachtForm;
