import React, { useState, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useReservation } from '@/context/BookingContext';
import {
  Leaf,
  Clock,
  Star,
  ArrowRight,
  Shield,
  Heart,
  CheckCircle,
  Phone,
  Users,
  Timer,
  Zap,
  Sparkles,
  Plus,
  X,
  MapPin,
  Calendar,
  Accessibility,
  Info,
  CreditCard,
  Minus,
  Filter,
  Search,
  SlidersHorizontal,
  Tag,
} from 'lucide-react';

// Mock data - reemplaza esto con SPA_SERVICES.massages
const SPA_SERVICES = {
  massages: [
    {
      id: 'swedish',
      name: 'Swedish Massage',
      description: 'Classic relaxing massage with long, flowing strokes',
      category: 'relaxation',
      durations: [
        { duration: 60, price: 120 },
        { duration: 90, price: 160 },
      ],
      emoji: '🌿',
      maxPersons: 4,
      intensity: 'gentle',
      isPremium: false,
      imageUrl:
        'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400',
      benefits: ['Stress Relief', 'Muscle Relaxation'],
    },
    {
      id: 'deep-tissue',
      name: 'Deep Tissue',
      description: 'Therapeutic massage targeting deep muscle layers',
      category: 'therapeutic',
      durations: [
        { duration: 60, price: 140 },
        { duration: 90, price: 180 },
      ],
      emoji: '💪',
      maxPersons: 2,
      intensity: 'strong',
      isPremium: true,
      imageUrl:
        'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400',
      benefits: ['Pain Relief', 'Tension Release'],
    },
    {
      id: 'hot-stone',
      name: 'Hot Stone',
      description: 'Relaxing massage using heated volcanic stones',
      category: 'signature',
      durations: [{ duration: 90, price: 200 }],
      emoji: '🔥',
      maxPersons: 2,
      intensity: 'medium',
      isPremium: true,
      imageUrl:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      benefits: ['Deep Relaxation', 'Improved Blood Flow'],
    },
    {
      id: 'aromatherapy',
      name: 'Aromatherapy',
      description: 'Sensory journey with essential oils',
      category: 'relaxation',
      durations: [
        { duration: 60, price: 130 },
        { duration: 90, price: 170 },
      ],
      emoji: '🌸',
      maxPersons: 3,
      intensity: 'gentle',
      isPremium: false,
      imageUrl:
        'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=400',
      benefits: ['Mental Clarity', 'Emotional Balance'],
    },
    {
      id: 'prenatal',
      name: 'Prenatal Massage',
      description: 'Specialized care for expecting mothers',
      category: 'therapeutic',
      durations: [{ duration: 60, price: 150 }],
      emoji: '🤱',
      maxPersons: 1,
      intensity: 'gentle',
      isPremium: true,
      imageUrl:
        'https://images.unsplash.com/photo-1527196850338-c9e2cfac4d5a?w=400',
      benefits: ['Pregnancy Comfort', 'Swelling Reduction'],
    },
    {
      id: 'sports',
      name: 'Sports Massage',
      description: 'Performance-focused therapy for athletes',
      category: 'therapeutic',
      durations: [
        { duration: 60, price: 155 },
        { duration: 90, price: 195 },
      ],
      emoji: '🏃‍♂️',
      maxPersons: 2,
      intensity: 'strong',
      isPremium: false,
      imageUrl:
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
      benefits: ['Performance Enhancement', 'Injury Prevention'],
    },
    {
      id: 'reflexology',
      name: 'Reflexology',
      description: 'Pressure point therapy focusing on feet and hands',
      category: 'therapeutic',
      durations: [
        { duration: 45, price: 100 },
        { duration: 60, price: 130 },
      ],
      emoji: '👣',
      maxPersons: 2,
      intensity: 'medium',
      isPremium: false,
      imageUrl:
        'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400',
      benefits: ['Stress Relief', 'Improved Circulation'],
    },
    {
      id: 'thai',
      name: 'Thai Massage',
      description: 'Traditional stretching and pressure point massage',
      category: 'signature',
      durations: [
        { duration: 90, price: 180 },
        { duration: 120, price: 220 },
      ],
      emoji: '🧘‍♀️',
      maxPersons: 1,
      intensity: 'medium',
      isPremium: true,
      imageUrl:
        'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=400',
      benefits: ['Flexibility', 'Energy Balance'],
    },
    {
      id: 'couples',
      name: 'Couples Massage',
      description: 'Romantic massage experience for two',
      category: 'signature',
      durations: [
        { duration: 60, price: 240 },
        { duration: 90, price: 320 },
      ],
      emoji: '💑',
      maxPersons: 2,
      intensity: 'gentle',
      isPremium: true,
      imageUrl:
        'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=400',
      benefits: ['Romantic Experience', 'Shared Relaxation'],
    },
    {
      id: 'lymphatic',
      name: 'Lymphatic Drainage',
      description: 'Gentle massage to stimulate lymph flow',
      category: 'therapeutic',
      durations: [{ duration: 60, price: 145 }],
      emoji: '💧',
      maxPersons: 1,
      intensity: 'gentle',
      isPremium: true,
      imageUrl:
        'https://images.unsplash.com/photo-1552693673-1bf958298935?w=400',
      benefits: ['Detoxification', 'Reduced Swelling'],
    },
    {
      id: 'cupping',
      name: 'Cupping Therapy',
      description: 'Traditional therapy using suction cups',
      category: 'therapeutic',
      durations: [
        { duration: 45, price: 120 },
        { duration: 60, price: 150 },
      ],
      emoji: '🥢',
      maxPersons: 1,
      intensity: 'medium',
      isPremium: false,
      imageUrl:
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
      benefits: ['Pain Relief', 'Muscle Recovery'],
    },
    {
      id: 'bamboo',
      name: 'Bamboo Massage',
      description: 'Unique massage using warm bamboo sticks',
      category: 'signature',
      durations: [{ duration: 75, price: 165 }],
      emoji: '🎋',
      maxPersons: 2,
      intensity: 'medium',
      isPremium: true,
      imageUrl:
        'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400',
      benefits: ['Deep Tissue Work', 'Unique Experience'],
    },
  ],
};

const TIME_SLOTS = [
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
];

// Componente de filtros
const FilterBar = ({ filters, onFilterChange, onClearFilters }) => {
  return (
    <div className='bg-white rounded-xl shadow-sm border border-stone-200 p-6 mb-8'>
      <div className='flex items-center justify-between mb-4'>
        <h3 className='text-lg font-semibold text-stone-800 flex items-center gap-2'>
          <SlidersHorizontal className='w-5 h-5' />
          Filter Treatments
        </h3>
        <button
          onClick={onClearFilters}
          className='text-sm text-stone-600 hover:text-stone-800 transition-colors'
        >
          Clear All
        </button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        {/* Search */}
        <div>
          <label className='block text-sm font-medium text-stone-700 mb-2'>
            Search
          </label>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-stone-400' />
            <input
              type='text'
              value={filters.search}
              onChange={(e) => onFilterChange('search', e.target.value)}
              placeholder='Search treatments...'
              className='w-full pl-10 pr-4 py-2 border border-stone-300 rounded-lg focus:border-stone-500 focus:ring-1 focus:ring-stone-500'
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className='block text-sm font-medium text-stone-700 mb-2'>
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => onFilterChange('category', e.target.value)}
            className='w-full px-3 py-2 border border-stone-300 rounded-lg focus:border-stone-500 focus:ring-1 focus:ring-stone-500'
          >
            <option value=''>All Categories</option>
            <option value='relaxation'>Relaxation</option>
            <option value='therapeutic'>Therapeutic</option>
            <option value='signature'>Signature</option>
          </select>
        </div>

        {/* Intensity */}
        <div>
          <label className='block text-sm font-medium text-stone-700 mb-2'>
            Intensity
          </label>
          <select
            value={filters.intensity}
            onChange={(e) => onFilterChange('intensity', e.target.value)}
            className='w-full px-3 py-2 border border-stone-300 rounded-lg focus:border-stone-500 focus:ring-1 focus:ring-stone-500'
          >
            <option value=''>All Intensities</option>
            <option value='gentle'>Gentle</option>
            <option value='medium'>Medium</option>
            <option value='strong'>Strong</option>
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className='block text-sm font-medium text-stone-700 mb-2'>
            Price Range
          </label>
          <select
            value={filters.priceRange}
            onChange={(e) => onFilterChange('priceRange', e.target.value)}
            className='w-full px-3 py-2 border border-stone-300 rounded-lg focus:border-stone-500 focus:ring-1 focus:ring-stone-500'
          >
            <option value=''>All Prices</option>
            <option value='0-120'>$0 - $120</option>
            <option value='120-180'>$120 - $180</option>
            <option value='180-250'>$180 - $250</option>
            <option value='250+'>$250+</option>
          </select>
        </div>
      </div>

      {/* Premium toggle */}
      <div className='mt-4 flex items-center gap-4'>
        <label className='flex items-center'>
          <input
            type='checkbox'
            checked={filters.premiumOnly}
            onChange={(e) => onFilterChange('premiumOnly', e.target.checked)}
            className='rounded border-stone-300 text-amber-600 focus:ring-amber-500'
          />
          <span className='ml-2 text-sm text-stone-700'>Premium Only</span>
        </label>
      </div>
    </div>
  );
};

// Componente de Badge de Intensidad
const IntensityBadge = ({ intensity }) => {
  const styles = {
    gentle: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    medium: 'bg-amber-100 text-amber-700 border-amber-200',
    strong: 'bg-red-100 text-red-700 border-red-200',
  };

  const icons = {
    gentle: <Leaf className='w-3 h-3' />,
    medium: <Zap className='w-3 h-3' />,
    strong: <Sparkles className='w-3 h-3' />,
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${styles[intensity]}`}
    >
      {icons[intensity]}
      {intensity}
    </span>
  );
};

// Modal de configuración de masaje mejorado
const MassageConfigModal = ({ massage, isOpen, onClose, onConfirm }) => {
  const [formData, setFormData] = useState({
    // Información del masaje
    massageId: massage.id,
    massageName: massage.name,
    selectedDuration: massage.durations[0],
    persons: 1,

    // Información de booking
    date: '',
    time: '',
    location: '',
    specialNeeds: '',

    // Metadata
    serviceType: 'massage-therapy',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Limpiar error
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time) newErrors.time = 'Time is required';
    if (!formData.location.trim()) newErrors.location = 'Address is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const totalPrice = formData.selectedDuration.price * formData.persons;

      // Estructura similar al airport transfer
      const reservationData = {
        service: {
          id: 'massage-therapy',
          name: 'Massage Therapy Service',
          type: 'massage-therapy',
          price: totalPrice,
        },
        totalPrice,
        formData: {
          ...formData,
          // Información adicional del masaje
          massageDetails: {
            id: massage.id,
            name: massage.name,
            category: massage.category,
            intensity: massage.intensity,
            isPremium: massage.isPremium,
            benefits: massage.benefits,
            emoji: massage.emoji,
            maxPersons: massage.maxPersons,
          },
          calculatedPrice: totalPrice,
        },
        bookingDate: new Date(`${formData.date}T${formData.time}`),
        clientInfo: undefined,
      };

      console.log('🌿 Massage therapy - Reservation data:', reservationData);
      console.log('💰 Total Price included:', totalPrice);

      await onConfirm(reservationData);
    } catch (error) {
      console.error('Error submitting massage booking:', error);
      setErrors({ submit: 'Failed to submit booking. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalPrice = formData.selectedDuration.price * formData.persons;
  const isValid = formData.date && formData.time && formData.location.trim();

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
      {/* Backdrop */}
      <div
        className='absolute inset-0 bg-black/50 backdrop-blur-sm'
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className='relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto'
      >
        {/* Header */}
        <div className='sticky top-0 bg-gradient-to-r from-stone-800 to-stone-900 text-white p-6'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <div className='w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-2xl'>
                {massage.emoji}
              </div>
              <div>
                <h3 className='text-xl font-semibold'>{massage.name}</h3>
                <p className='text-stone-300'>
                  Configure your massage therapy booking
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className='p-2 hover:bg-white/10 rounded-lg transition-colors'
            >
              <X className='w-6 h-6' />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className='p-6 space-y-6'>
          {/* Massage Information */}
          <div className='bg-stone-50 rounded-xl p-4'>
            <div className='flex items-center gap-3 mb-3'>
              <IntensityBadge intensity={massage.intensity} />
              <span className='text-sm text-stone-600'>•</span>
              <span className='text-sm text-stone-600'>
                Max {massage.maxPersons} people
              </span>
              {massage.isPremium && (
                <>
                  <span className='text-sm text-stone-600'>•</span>
                  <span className='inline-flex items-center gap-1 text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full'>
                    <Star className='w-3 h-3' />
                    Premium
                  </span>
                </>
              )}
            </div>
            <p className='text-stone-700 text-sm mb-3'>{massage.description}</p>
            <div className='flex flex-wrap gap-2'>
              {massage.benefits.map((benefit, idx) => (
                <span
                  key={idx}
                  className='text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-md'
                >
                  {benefit}
                </span>
              ))}
            </div>
          </div>

          {/* Duration & Persons */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Duration Selection */}
            <div>
              <label className='block text-sm font-medium text-stone-800 mb-3'>
                <Timer className='w-4 h-4 inline mr-2' />
                Duration & Price
              </label>
              <div className='space-y-3'>
                {massage.durations.map((option) => (
                  <button
                    key={option.duration}
                    onClick={() => updateField('selectedDuration', option)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      formData.selectedDuration.duration === option.duration
                        ? 'border-stone-800 bg-stone-50'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className='flex justify-between items-center'>
                      <div>
                        <div className='font-semibold text-stone-800'>
                          {option.duration} minutes
                        </div>
                        <div className='text-sm text-stone-600'>
                          Perfect for a complete experience
                        </div>
                      </div>
                      <div className='text-xl font-bold text-stone-800'>
                        ${option.price}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Number of Persons */}
            <div>
              <label className='block text-sm font-medium text-stone-800 mb-3'>
                <Users className='w-4 h-4 inline mr-2' />
                Number of People
              </label>
              <div className='flex items-center justify-between bg-stone-50 rounded-xl p-4'>
                <div className='flex items-center gap-4'>
                  <button
                    onClick={() =>
                      updateField('persons', Math.max(1, formData.persons - 1))
                    }
                    disabled={formData.persons <= 1}
                    className='w-10 h-10 rounded-full bg-white border-2 border-stone-300 flex items-center justify-center hover:bg-stone-50 disabled:opacity-50 transition-colors'
                  >
                    <Minus className='w-4 h-4' />
                  </button>
                  <span className='text-2xl font-semibold text-stone-800 w-12 text-center'>
                    {formData.persons}
                  </span>
                  <button
                    onClick={() =>
                      updateField(
                        'persons',
                        Math.min(massage.maxPersons, formData.persons + 1)
                      )
                    }
                    disabled={formData.persons >= massage.maxPersons}
                    className='w-10 h-10 rounded-full bg-white border-2 border-stone-300 flex items-center justify-center hover:bg-stone-50 disabled:opacity-50 transition-colors'
                  >
                    <Plus className='w-4 h-4' />
                  </button>
                </div>
                <span className='text-stone-600 text-sm'>
                  Max: {massage.maxPersons}
                </span>
              </div>
            </div>
          </div>

          {/* Date & Time */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-stone-800 mb-2'>
                <Calendar className='w-4 h-4 inline mr-2' />
                Date *
              </label>
              <input
                type='date'
                value={formData.date}
                onChange={(e) => updateField('date', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full p-3 border-2 rounded-lg focus:border-stone-500 focus:ring-1 focus:ring-stone-500 ${
                  errors.date ? 'border-red-300 bg-red-50' : 'border-stone-200'
                }`}
              />
              {errors.date && (
                <p className='text-red-500 text-sm mt-1'>{errors.date}</p>
              )}
            </div>

            <div>
              <label className='block text-sm font-medium text-stone-800 mb-2'>
                <Clock className='w-4 h-4 inline mr-2' />
                Time *
              </label>
              <select
                value={formData.time}
                onChange={(e) => updateField('time', e.target.value)}
                className={`w-full p-3 border-2 rounded-lg focus:border-stone-500 focus:ring-1 focus:ring-stone-500 ${
                  errors.time ? 'border-red-300 bg-red-50' : 'border-stone-200'
                }`}
              >
                <option value=''>Select time</option>
                {TIME_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
              {errors.time && (
                <p className='text-red-500 text-sm mt-1'>{errors.time}</p>
              )}
            </div>
          </div>

          {/* Address */}
          <div>
            <label className='block text-sm font-medium text-stone-800 mb-2'>
              <MapPin className='w-4 h-4 inline mr-2' />
              Service Address *
            </label>
            <input
              type='text'
              value={formData.location}
              onChange={(e) => updateField('location', e.target.value)}
              placeholder='Enter complete address where the massage will take place'
              className={`w-full p-3 border-2 rounded-lg focus:border-stone-500 focus:ring-1 focus:ring-stone-500 ${
                errors.location
                  ? 'border-red-300 bg-red-50'
                  : 'border-stone-200'
              }`}
            />
            {errors.location && (
              <p className='text-red-500 text-sm mt-1'>{errors.location}</p>
            )}
          </div>

          {/* Special Needs */}
          <div>
            <label className='block text-sm font-medium text-stone-800 mb-2'>
              <Accessibility className='w-4 h-4 inline mr-2' />
              Special Needs & Medical Considerations
            </label>
            <textarea
              value={formData.specialNeeds}
              onChange={(e) => updateField('specialNeeds', e.target.value)}
              placeholder='Please mention any medical conditions, disabilities, injuries, pregnancy, allergies, preferences...'
              className='w-full p-3 border-2 border-stone-200 rounded-lg focus:border-stone-500 focus:ring-1 focus:ring-stone-500 resize-none h-20'
            />
            <div className='flex items-start gap-2 mt-2 text-stone-600'>
              <Info className='w-4 h-4 mt-0.5 flex-shrink-0' />
              <p className='text-xs'>
                This information helps our therapists provide the best possible
                service
              </p>
            </div>
          </div>

          {/* Price Summary */}
          <div className='bg-gradient-to-br from-stone-800 to-stone-900 text-white rounded-xl p-6'>
            <div className='flex justify-between items-center'>
              <div>
                <h4 className='text-lg font-semibold mb-2'>Booking Summary</h4>
                <div className='space-y-1 text-stone-300'>
                  <div className='flex items-center gap-2'>
                    <span className='text-xl'>{massage.emoji}</span>
                    <span>{massage.name}</span>
                  </div>
                  <div>
                    {formData.selectedDuration.duration} minutes •{' '}
                    {formData.persons}{' '}
                    {formData.persons === 1 ? 'person' : 'people'}
                  </div>
                  {formData.date && formData.time && (
                    <div>
                      {new Date(formData.date).toLocaleDateString()} at{' '}
                      {formData.time}
                    </div>
                  )}
                  {formData.location && (
                    <div className='text-sm'>📍 {formData.location}</div>
                  )}
                </div>
              </div>
              <div className='text-right'>
                <div className='text-3xl font-bold'>${totalPrice}</div>
                <div className='text-stone-300'>Total Price</div>
              </div>
            </div>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className='p-4 bg-red-50 border border-red-200 rounded-lg'>
              <p className='text-red-800 text-sm'>{errors.submit}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className='sticky bottom-0 bg-white border-t border-stone-200 p-6'>
          <div className='flex gap-4'>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className='flex-1 py-3 border-2 border-stone-300 text-stone-700 rounded-xl hover:bg-stone-50 transition-colors font-medium'
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!isValid || isSubmitting}
              className={`flex-1 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                isValid && !isSubmitting
                  ? 'bg-stone-800 text-white hover:bg-stone-700'
                  : 'bg-stone-300 text-stone-500 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white' />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className='w-4 h-4' />
                  Confirm Booking
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Card compacta de masaje
const MassageCard = ({ massage, isSelected, onSelect }) => {
  const prices = massage.durations.map((d) => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceDisplay =
    minPrice === maxPrice ? `$${minPrice}` : `$${minPrice} - $${maxPrice}`;

  return (
    <motion.div
      className={`group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer ${
        isSelected ? 'ring-2 ring-green-500 shadow-xl' : ''
      }`}
      whileHover={{ y: -2 }}
      onClick={onSelect}
    >
      {/* Image */}
      <div className='relative h-40 overflow-hidden'>
        <Image
          src={massage.imageUrl}
          alt={massage.name}
          fill
          className='object-cover group-hover:scale-105 transition-transform duration-500'
        />

        <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent' />

        {massage.isPremium && (
          <div className='absolute top-2 right-2 bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-medium'>
            <Star className='w-3 h-3 inline mr-1' />
            Premium
          </div>
        )}

        {isSelected && (
          <div className='absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium'>
            <CheckCircle className='w-3 h-3 inline mr-1' />
            Selected
          </div>
        )}

        <div className='absolute bottom-2 left-2 right-2'>
          <div className='flex items-center justify-between text-white text-xs'>
            <div className='flex items-center gap-1'>
              <Timer className='w-3 h-3' />
              <span>
                {massage.durations.map((d) => `${d.duration}min`).join('/')}
              </span>
            </div>
            <div className='font-semibold'>{priceDisplay}</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className='p-3'>
        <div className='flex items-center gap-2 mb-2'>
          <span className='text-lg'>{massage.emoji}</span>
          <h3 className='font-semibold text-stone-800 text-sm line-clamp-1'>
            {massage.name}
          </h3>
        </div>

        <p className='text-stone-600 text-xs mb-3 line-clamp-2'>
          {massage.description}
        </p>

        <div className='flex items-center justify-between'>
          <IntensityBadge intensity={massage.intensity} />
          <div className='flex items-center gap-1 text-xs text-stone-500'>
            <Users className='w-3 h-3' />
            <span>{massage.maxPersons}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Componente principal MassageServiceView
const MassageServiceView = () => {
  const router = useRouter();
  const { setReservationData } = useReservation();

  const [selectedMassages, setSelectedMassages] = useState([]);
  const [currentMassage, setCurrentMassage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Estados de filtro
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    intensity: '',
    priceRange: '',
    premiumOnly: false,
  });

  // Filtrar masajes
  const filteredMassages = useMemo(() => {
    return SPA_SERVICES.massages.filter((massage) => {
      // Search filter
      if (
        filters.search &&
        !massage.name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !massage.description
          .toLowerCase()
          .includes(filters.search.toLowerCase())
      ) {
        return false;
      }

      // Category filter
      if (filters.category && massage.category !== filters.category) {
        return false;
      }

      // Intensity filter
      if (filters.intensity && massage.intensity !== filters.intensity) {
        return false;
      }

      // Price range filter
      if (filters.priceRange) {
        const minPrice = Math.min(...massage.durations.map((d) => d.price));
        switch (filters.priceRange) {
          case '0-120':
            if (minPrice > 120) return false;
            break;
          case '120-180':
            if (minPrice < 120 || minPrice > 180) return false;
            break;
          case '180-250':
            if (minPrice < 180 || minPrice > 250) return false;
            break;
          case '250+':
            if (minPrice < 250) return false;
            break;
        }
      }

      // Premium filter
      if (filters.premiumOnly && !massage.isPremium) {
        return false;
      }

      return true;
    });
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      category: '',
      intensity: '',
      priceRange: '',
      premiumOnly: false,
    });
  };

  const handleMassageSelect = useCallback((massage) => {
    setCurrentMassage(massage);
    setShowModal(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setShowModal(false);
    setCurrentMassage(null);
  }, []);

  const handleMassageConfirm = useCallback(
    async (reservationData) => {
      try {
        console.log('🌿 Setting massage reservation data:', reservationData);

        // Establecer los datos en el contexto global
        setReservationData(reservationData);

        // Navegar a la página de confirmación
        router.push('/reservation-confirmation');

        // Cerrar modal
        setShowModal(false);
        setCurrentMassage(null);
      } catch (error) {
        console.error('Error processing massage booking:', error);
        alert('Error processing booking. Please try again.');
      }
    },
    [setReservationData, router]
  );

  const totalFilteredCount = filteredMassages.length;
  const totalMassagesCount = SPA_SERVICES.massages.length;

  return (
    <div className='min-h-screen bg-gradient-to-b from-stone-50 via-amber-25 to-stone-100'>
      {/* Hero Section */}
      <section className='relative h-[50vh] sm:h-[60vh] flex items-center justify-center px-4 sm:px-6'>
        <div className='absolute inset-0 z-0'>
          <Image
            src='https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=1600'
            alt='BF Paradise Spa Experience'
            fill
            className='object-cover'
            priority
          />
          <div className='absolute inset-0 bg-gradient-to-b from-stone-900/70 via-stone-900/50 to-stone-900/70' />
        </div>

        <div className='relative z-20 text-center max-w-4xl'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className='inline-flex items-center bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30 mb-6'
          >
            <Leaf className='w-4 h-4 text-white mr-2' />
            <span className='text-white font-medium text-sm'>
              BF Paradise Premium Wellness
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className='text-3xl sm:text-5xl lg:text-6xl font-light text-white mb-4 leading-tight'
          >
            Massage Therapy
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className='text-lg sm:text-xl text-white/90 mb-8 leading-relaxed font-light max-w-2xl mx-auto'
          >
            Discover our complete collection of {totalMassagesCount} therapeutic
            treatments
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className='py-12 px-4 sm:px-6'>
        <div className='max-w-7xl mx-auto'>
          {/* Filter Bar */}
          <FilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />

          {/* Results Count */}
          <div className='mb-6'>
            <p className='text-stone-600'>
              Showing {totalFilteredCount} of {totalMassagesCount} treatments
              {totalFilteredCount !== totalMassagesCount && (
                <button
                  onClick={handleClearFilters}
                  className='ml-2 text-stone-800 hover:text-stone-600 underline'
                >
                  Clear filters
                </button>
              )}
            </p>
          </div>

          {/* Massage Grid - Máximo 4 por línea */}
          {totalFilteredCount > 0 ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12'>
              {filteredMassages.map((massage, index) => (
                <motion.div
                  key={massage.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <MassageCard
                    massage={massage}
                    isSelected={false}
                    onSelect={() => handleMassageSelect(massage)}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className='text-center py-12'>
              <div className='text-6xl mb-4'>🔍</div>
              <h3 className='text-xl font-semibold text-stone-800 mb-2'>
                No treatments found
              </h3>
              <p className='text-stone-600 mb-4'>
                Try adjusting your filters to see more options
              </p>
              <button
                onClick={handleClearFilters}
                className='px-6 py-2 bg-stone-800 text-white rounded-lg hover:bg-stone-700 transition-colors'
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {showModal && currentMassage && (
          <MassageConfigModal
            massage={currentMassage}
            isOpen={showModal}
            onClose={handleModalClose}
            onConfirm={handleMassageConfirm}
          />
        )}
      </AnimatePresence>

      {/* Call to Action */}
      <section className='py-16 px-4 sm:px-6 bg-gradient-to-b from-stone-800 to-stone-900'>
        <div className='max-w-4xl mx-auto text-center text-white'>
          <h2 className='text-2xl sm:text-4xl font-light mb-6'>
            Ready for Your Perfect Wellness Experience?
          </h2>
          <p className='text-lg text-stone-300 mb-8 leading-relaxed'>
            Book your personalized massage therapy and discover the
            transformative power of therapeutic touch.
          </p>

          <div className='flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 text-stone-400 text-sm'>
            <div className='flex items-center justify-center gap-2'>
              <Phone className='w-4 h-4' />
              <span>Expert therapists</span>
            </div>
            <div className='flex items-center justify-center gap-2'>
              <CheckCircle className='w-4 h-4' />
              <span>Flexible scheduling</span>
            </div>
            <div className='flex items-center justify-center gap-2'>
              <Shield className='w-4 h-4' />
              <span>Professional service</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MassageServiceView;
