import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  Users,
  Star,
  ArrowRight,
  Plus,
  Minus,
  X,
  CheckCircle,
  Timer,
  Sparkles,
  Leaf,
  Zap,
  Shield,
  Award,
  Heart,
  Info,
  Accessibility,
} from 'lucide-react';
import { SPA_SERVICES } from '@/constants/spaServices';

// Types
interface Service {
  id: string;
  name: string;
  description: string;
  category: 'relaxation' | 'therapeutic' | 'beauty' | 'signature' | 'kids';
  durations: { duration: number; price: number }[];
  emoji: string;
  tags: string[];
  maxPersons: number;
  intensity: 'gentle' | 'medium' | 'strong';
  isPremium?: boolean;
  imageUrl: string;
  benefits: string[];
}

interface BookingItem {
  id: string;
  serviceId: string;
  serviceName: string;
  duration: number;
  price: number;
  date: string;
  time: string;
  persons: number;
  specialNeeds: string;
  emoji: string;
}

interface FormProps {
  onSubmit: (data: { bookings: BookingItem[]; totalPrice: number }) => void;
  onCancel: () => void;
  selectedMassageData?: any;
}

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

// Convertir de SPA_SERVICES format a Service format
const convertSpaServiceToService = (spaService: any): Service => {
  return {
    id: spaService.id,
    name: spaService.name,
    description: spaService.description,
    category: spaService.category || 'relaxation',
    durations: spaService.durations,
    emoji: spaService.emoji,
    tags: spaService.tags || [],
    maxPersons: spaService.maxPersons,
    intensity: spaService.intensity,
    isPremium: spaService.isPremium || false,
    imageUrl: spaService.imageUrl,
    benefits: spaService.benefits || [],
  };
};

// Utility Components
const CategoryIcon = ({ category }) => {
  const icons = {
    relaxation: <Leaf className='w-4 h-4' />,
    therapeutic: <Zap className='w-4 h-4' />,
    beauty: <Sparkles className='w-4 h-4' />,
    signature: <Award className='w-4 h-4' />,
    kids: <Heart className='w-4 h-4' />,
  };
  return icons[category] || <Leaf className='w-4 h-4' />;
};

const IntensityBadge = ({ intensity }) => {
  const styles = {
    gentle: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    medium: 'bg-amber-50 text-amber-700 border-amber-200',
    strong: 'bg-red-50 text-red-700 border-red-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${styles[intensity]}`}
    >
      {intensity}
    </span>
  );
};

// Pre-selected Service Display
const PreSelectedServiceCard = ({ service, onRemove }) => {
  return (
    <div className='bg-gradient-to-r from-stone-800 to-stone-900 text-white rounded-2xl p-6 mb-8'>
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center gap-4'>
          <div className='w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-2xl'>
            {service.emoji}
          </div>
          <div>
            <h3 className='text-2xl font-semibold mb-1'>{service.name}</h3>
            <p className='text-stone-300'>{service.description}</p>
            {service.isPremium && (
              <div className='flex items-center gap-1 mt-2'>
                <Star className='w-4 h-4 text-amber-400 fill-current' />
                <span className='text-sm text-amber-400'>
                  Premium Experience
                </span>
              </div>
            )}
          </div>
        </div>
        <button
          onClick={onRemove}
          className='p-2 hover:bg-white/10 rounded-lg transition-colors'
          title='Change massage'
        >
          <X className='w-5 h-5' />
        </button>
      </div>

      <div className='flex flex-wrap gap-2 mb-4'>
        {service.benefits.slice(0, 4).map((benefit, idx) => (
          <span
            key={idx}
            className='text-sm bg-white/20 text-white px-3 py-1 rounded-full'
          >
            {benefit}
          </span>
        ))}
      </div>
    </div>
  );
};

// Booking Form for Pre-selected Service
const PreSelectedBookingForm = ({ service, onConfirm, onCancel }) => {
  const [duration, setDuration] = useState(service.durations[0].duration);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [persons, setPersons] = useState(1);
  const [specialNeeds, setSpecialNeeds] = useState('');

  const currentPrice =
    service.durations.find((d) => d.duration === duration)?.price || 0;
  const totalPrice = currentPrice * persons;

  const handleSubmit = () => {
    if (!date || !time) return;

    onConfirm({
      serviceId: service.id,
      serviceName: service.name,
      duration,
      price: totalPrice,
      date,
      time,
      persons,
      specialNeeds,
      emoji: service.emoji,
    });
  };

  const isFormValid = date && time;

  return (
    <div className='max-w-4xl mx-auto space-y-8'>
      {/* Duration Selection */}
      <div className='bg-white rounded-2xl shadow-lg p-8'>
        <h3 className='text-2xl font-semibold text-stone-800 mb-6 flex items-center gap-3'>
          <Timer className='w-6 h-6 text-stone-600' />
          Treatment Duration
        </h3>

        <div
          className={`grid gap-4 ${
            service.durations.length === 1
              ? 'grid-cols-1 max-w-md'
              : service.durations.length === 2
              ? 'grid-cols-1 md:grid-cols-2'
              : 'grid-cols-1 md:grid-cols-3'
          }`}
        >
          {service.durations.map((option, index) => (
            <button
              key={option.duration}
              onClick={() => setDuration(option.duration)}
              className={`relative p-6 rounded-xl border-2 transition-all text-left ${
                duration === option.duration
                  ? 'border-stone-800 bg-stone-50 shadow-md'
                  : 'border-stone-200 hover:border-stone-300 hover:shadow-sm'
              }`}
            >
              {index === 0 && service.durations.length > 1 && (
                <div className='absolute -top-3 left-1/2 transform -translate-x-1/2 bg-stone-800 text-white px-3 py-1 rounded-full text-xs font-medium'>
                  Popular
                </div>
              )}
              <div className='font-semibold text-stone-800 mb-2 text-lg'>
                {option.duration} minutes
              </div>
              <div className='text-stone-600 mb-3'>
                {option.duration === 30 && 'Quick session'}
                {option.duration === 60 && 'Standard session'}
                {option.duration === 90 && 'Extended experience'}
                {option.duration === 120 && 'Complete relaxation'}
              </div>
              <div className='text-2xl font-bold text-stone-800'>
                ${option.price}
              </div>
              <div className='text-sm text-stone-500'>
                ${option.price * persons} total
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Date & Time Selection */}
      <div className='bg-white rounded-2xl shadow-lg p-8'>
        <h3 className='text-2xl font-semibold text-stone-800 mb-6 flex items-center gap-3'>
          <Calendar className='w-6 h-6 text-stone-600' />
          Date & Time
        </h3>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <label className='block text-lg font-medium text-stone-800 mb-3'>
              Select Date
            </label>
            <input
              type='date'
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className='w-full p-4 border-2 border-stone-300 rounded-xl focus:ring-2 focus:ring-stone-500 focus:border-transparent text-lg'
            />
          </div>

          <div>
            <label className='block text-lg font-medium text-stone-800 mb-3'>
              Select Time
            </label>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className='w-full p-4 border-2 border-stone-300 rounded-xl focus:ring-2 focus:ring-stone-500 focus:border-transparent text-lg'
            >
              <option value=''>Choose time slot</option>
              {TIME_SLOTS.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Persons Selection */}
      <div className='bg-white rounded-2xl shadow-lg p-8'>
        <h3 className='text-2xl font-semibold text-stone-800 mb-6 flex items-center gap-3'>
          <Users className='w-6 h-6 text-stone-600' />
          Number of People
        </h3>

        <div className='flex items-center justify-between bg-stone-50 rounded-xl p-6'>
          <div className='flex items-center gap-6'>
            <button
              onClick={() => setPersons(Math.max(1, persons - 1))}
              className='w-12 h-12 rounded-full bg-white border-2 border-stone-300 flex items-center justify-center hover:bg-stone-50 transition-colors shadow-sm'
            >
              <Minus className='w-6 h-6 text-stone-600' />
            </button>
            <span className='text-3xl font-semibold text-stone-800 w-16 text-center'>
              {persons}
            </span>
            <button
              onClick={() =>
                setPersons(Math.min(service.maxPersons, persons + 1))
              }
              className='w-12 h-12 rounded-full bg-white border-2 border-stone-300 flex items-center justify-center hover:bg-stone-50 transition-colors shadow-sm'
            >
              <Plus className='w-6 h-6 text-stone-600' />
            </button>
          </div>
          <div className='text-stone-600'>
            <span className='text-lg'>
              Maximum: {service.maxPersons} people
            </span>
          </div>
        </div>
      </div>

      {/* Special Needs & Disabilities */}
      <div className='bg-white rounded-2xl shadow-lg p-8'>
        <h3 className='text-2xl font-semibold text-stone-800 mb-6 flex items-center gap-3'>
          <Accessibility className='w-6 h-6 text-stone-600' />
          Special Needs & Medical Considerations
        </h3>

        <textarea
          value={specialNeeds}
          onChange={(e) => setSpecialNeeds(e.target.value)}
          placeholder='Please mention any medical conditions, disabilities, injuries, pregnancy, allergies, mobility restrictions, or special accommodations we should consider to personalize your experience safely...'
          className='w-full p-4 border-2 border-stone-300 rounded-xl focus:ring-2 focus:ring-stone-500 focus:border-transparent resize-none h-32 text-lg'
        />
        <div className='flex items-start gap-2 mt-3 text-stone-600'>
          <Info className='w-5 h-5 mt-0.5 flex-shrink-0' />
          <p className='text-sm leading-relaxed'>
            This information is confidential and helps us adapt the treatment to
            your specific needs. Our therapists are trained to work with various
            conditions, disabilities, and limitations.
          </p>
        </div>
      </div>

      {/* Price Summary */}
      <div className='bg-gradient-to-r from-stone-800 to-stone-900 text-white rounded-2xl p-8'>
        <div className='flex justify-between items-start mb-6'>
          <div>
            <h3 className='text-2xl font-semibold mb-4 flex items-center gap-3'>
              <CheckCircle className='w-6 h-6' />
              Booking Summary
            </h3>
            <div className='space-y-2 text-stone-300'>
              <div className='flex items-center gap-2'>
                <span className='text-xl'>{service.emoji}</span>
                <span className='text-lg'>{service.name}</span>
              </div>
              <div>{duration} minutes treatment</div>
              <div>
                {persons} {persons === 1 ? 'person' : 'people'}
              </div>
              {date && time && (
                <div className='flex items-center gap-2'>
                  <Calendar className='w-4 h-4' />
                  <span>
                    {new Date(date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}{' '}
                    at {time}
                  </span>
                </div>
              )}
              {specialNeeds && (
                <div className='text-sm bg-white/10 rounded-lg p-3 mt-3'>
                  <strong>Special considerations:</strong>{' '}
                  {specialNeeds.slice(0, 100)}
                  {specialNeeds.length > 100 ? '...' : ''}
                </div>
              )}
            </div>
          </div>
          <div className='text-right'>
            <div className='text-4xl font-bold'>${totalPrice}</div>
            <div className='text-stone-300'>Total Price</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className='flex gap-4 pt-4'>
        <button
          onClick={onCancel}
          className='flex-1 py-4 border-2 border-stone-300 text-stone-700 rounded-xl hover:bg-stone-50 transition-colors font-semibold text-lg'
        >
          Change Service
        </button>
        <button
          onClick={handleSubmit}
          disabled={!isFormValid}
          className={`flex-1 py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 transition-all ${
            isFormValid
              ? 'bg-stone-800 text-white hover:bg-stone-700 shadow-lg'
              : 'bg-stone-300 text-stone-500 cursor-not-allowed'
          }`}
        >
          <Heart className='w-6 h-6' />
          Confirm Booking
          <ArrowRight className='w-6 h-6' />
        </button>
      </div>
    </div>
  );
};

// Service Selection Grid - CON TODOS LOS MASAJES DE SPA_SERVICES
const ServiceSelectionGrid = ({ services, onServiceSelect }) => {
  return (
    <div className='max-w-7xl mx-auto'>
      <div className='text-center mb-12'>
        <h2 className='text-3xl font-semibold text-stone-800 mb-4'>
          Choose Your Perfect Massage Experience
        </h2>
        <p className='text-xl text-stone-600'>
          Select from our complete range of therapeutic treatments
        </p>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6'>
        {services.map((service) => {
          const minPrice = Math.min(...service.durations.map((d) => d.price));
          const maxPrice = Math.max(...service.durations.map((d) => d.price));
          const priceDisplay =
            minPrice === maxPrice
              ? `$${minPrice}`
              : `$${minPrice} - $${maxPrice}`;

          return (
            <motion.div
              key={service.id}
              className='bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group'
              onClick={() => onServiceSelect(service)}
              whileHover={{ y: -4 }}
            >
              <div className='aspect-[4/3] relative overflow-hidden'>
                <img
                  src={service.imageUrl}
                  alt={service.name}
                  className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent' />

                {service.isPremium && (
                  <div className='absolute top-4 right-4 bg-gradient-to-r from-amber-400 to-amber-500 text-amber-900 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1'>
                    <Star className='w-3 h-3' />
                    Premium
                  </div>
                )}

                <div className='absolute bottom-4 left-4 right-4 text-white'>
                  <div className='flex items-center gap-3 mb-2'>
                    <span className='text-2xl'>{service.emoji}</span>
                    <div>
                      <h3 className='text-lg font-semibold'>{service.name}</h3>
                      <p className='text-sm text-white/90'>{priceDisplay}</p>
                    </div>
                  </div>
                </div>

                {/* Hover overlay */}
                <div className='absolute inset-0 bg-stone-800/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center'>
                  <div className='text-white text-center'>
                    <div className='text-4xl mb-4'>{service.emoji}</div>
                    <div className='text-xl font-light mb-3'>Book Now</div>
                    <div className='flex items-center justify-center gap-2'>
                      <Heart className='w-5 h-5' />
                      <span>Click to continue</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className='p-6'>
                <p className='text-stone-600 text-sm mb-4 line-clamp-2'>
                  {service.description}
                </p>

                <div className='flex items-center gap-2 mb-4'>
                  <IntensityBadge intensity={service.intensity} />
                  <span className='text-xs text-stone-500'>•</span>
                  <span className='text-xs text-stone-500'>
                    Max {service.maxPersons} people
                  </span>
                </div>

                <div className='flex flex-wrap gap-1 mb-4'>
                  {service.benefits.slice(0, 2).map((benefit, idx) => (
                    <span
                      key={idx}
                      className='text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-md border border-blue-100'
                    >
                      {benefit}
                    </span>
                  ))}
                </div>

                <button className='w-full bg-stone-800 text-white py-3 px-4 rounded-xl hover:bg-stone-700 transition-colors font-medium flex items-center justify-center gap-2 group/btn'>
                  <span>Select Treatment</span>
                  <ArrowRight className='w-4 h-4 group-hover/btn:translate-x-1 transition-transform' />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

// Main Component
const MassageForm = ({ onSubmit, onCancel, selectedMassageData }) => {
  const [selectedService, setSelectedService] = useState(null);

  // Convertir datos pre-seleccionados si existen
  useEffect(() => {
    if (selectedMassageData) {
      const convertedService = convertSpaServiceToService(selectedMassageData);
      if (convertedService) {
        setSelectedService(convertedService);
      }
    }
  }, [selectedMassageData]);

  // Usar todos los masajes de SPA_SERVICES
  const allMassageServices = useMemo(() => {
    return SPA_SERVICES.massages.map((massage) =>
      convertSpaServiceToService(massage)
    );
  }, []);

  const addBooking = (bookingData) => {
    const newBooking = {
      ...bookingData,
      id: Date.now().toString(),
    };

    onSubmit({
      bookings: [newBooking],
      totalPrice: newBooking.price,
    });
  };

  const handleServiceRemove = () => {
    setSelectedService(null);
  };

  return (
    <div className='min-h-screen bg-gradient-to-b from-stone-50 to-stone-100'>
      {/* Header */}
      <div className='bg-white shadow-sm border-b border-stone-200'>
        <div className='max-w-6xl mx-auto px-6 py-8'>
          <div className='text-center'>
            <h1 className='text-4xl font-light text-stone-900 mb-4'>
              {selectedService
                ? 'Complete Your Booking'
                : 'Book Your Massage Experience'}
            </h1>
            <p className='text-xl text-stone-600'>
              {selectedService
                ? 'Just a few more details to confirm your appointment'
                : 'Choose from our complete range of therapeutic massages'}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className='max-w-6xl mx-auto px-6 py-12'>
        {selectedService ? (
          <>
            {/* Pre-selected Service Display */}
            <PreSelectedServiceCard
              service={selectedService}
              onRemove={handleServiceRemove}
            />

            {/* Booking Form */}
            <PreSelectedBookingForm
              service={selectedService}
              onConfirm={addBooking}
              onCancel={handleServiceRemove}
            />
          </>
        ) : (
          /* Mostrar todos los masajes de SPA_SERVICES */
          <ServiceSelectionGrid
            services={allMassageServices}
            onServiceSelect={setSelectedService}
          />
        )}
      </div>

      {/* Cancel Button */}
      <div className='fixed bottom-6 left-6 z-30'>
        <button
          onClick={onCancel}
          className='px-6 py-3 bg-white text-stone-700 rounded-full shadow-lg hover:bg-stone-50 border border-stone-200 flex items-center gap-2'
        >
          <X className='w-5 h-5' />
          Cancel
        </button>
      </div>
    </div>
  );
};

export default MassageForm;
