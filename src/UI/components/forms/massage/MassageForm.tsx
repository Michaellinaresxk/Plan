import React, { useState, useMemo, useEffect } from 'react';

import { Star, X } from 'lucide-react';
import { SPA_SERVICES } from '@/constants/spaServices';
import PreSelectedBookingForm from './PreSelectedBookingForm';
import ServiceSelectionGrid from './ServiceSelectionGrid';

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
