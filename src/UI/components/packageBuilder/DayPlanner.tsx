'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  Calendar,
  Check,
  ChevronRight,
  ChevronLeft,
  PlusCircle,
} from 'lucide-react';
import Image from 'next/image';
import { useBooking } from '@/context/BookingContext';
import { useTranslation } from '@/lib/i18n/client';
import { Service } from '@/types/type';

// Types for the day planner
interface DayPlanItem {
  serviceId: string;
  timeSlot: string;
  day: number;
}

interface DayPlannerProps {
  onComplete: () => void;
  onBack: () => void;
  recommendedServices?: Service[];
}

// Helper component for displaying a time slot
const TimeSlotButton = ({
  timeSlot,
  isSelected,
  onClick,
  isPremium,
}: {
  timeSlot: string;
  isSelected: boolean;
  onClick: () => void;
  isPremium: boolean;
}) => (
  <button
    onClick={onClick}
    className={`
      time-slot p-3 rounded-lg border text-sm flex items-center justify-center transition-all
      ${
        isSelected
          ? isPremium
            ? 'bg-amber-100 border-amber-400 text-amber-800 selected'
            : 'bg-blue-100 border-blue-400 text-blue-800 selected'
          : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
      }
    `}
  >
    <Clock size={14} className='mr-2' />
    {timeSlot}
    {isSelected && <Check size={14} className='ml-2' />}
  </button>
);

// Helper component for a service card in the day planner
const ServicePlannerCard = ({
  service,
  selectedTimeSlot,
  onTimeSlotSelect,
  availableTimeSlots,
  isPremium,
  currentDay,
}: {
  service: Service;
  selectedTimeSlot: string | null;
  onTimeSlotSelect: (timeSlot: string) => void;
  availableTimeSlots: string[];
  isPremium: boolean;
  currentDay: number;
}) => {
  // Handle image errors
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/images/placeholder-service.jpg';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className='bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 mb-6'
    >
      <div className='md:flex'>
        <div className='md:w-1/3 h-48 md:h-auto relative'>
          <Image
            src={service.img || `/images/services/${service.id}.jpg`}
            alt={service.name}
            fill
            className='object-cover'
            onError={handleImageError}
            unoptimized={service.img?.startsWith('http')}
          />
        </div>
        <div className='p-6 md:w-2/3'>
          <h3 className='text-xl font-bold text-gray-900 mb-2'>
            {service.name}
          </h3>

          <div className='flex items-center text-gray-600 text-sm mb-6'>
            <Clock className='h-4 w-4 mr-1' />
            <span>
              Duration: {service.duration} hour
              {service.duration !== 1 ? 's' : ''}
            </span>
          </div>

          <div className='mb-4'>
            <h4 className='text-sm font-medium text-gray-700 mb-2'>
              Select a time for Day {currentDay}:
            </h4>
            <div className='grid grid-cols-2 sm:grid-cols-3 gap-2'>
              {availableTimeSlots.map((timeSlot) => (
                <TimeSlotButton
                  key={timeSlot}
                  timeSlot={timeSlot}
                  isSelected={selectedTimeSlot === timeSlot}
                  onClick={() => onTimeSlotSelect(timeSlot)}
                  isPremium={isPremium}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Main component
const DayPlanner: React.FC<DayPlannerProps> = ({
  onComplete,
  onBack,
  recommendedServices = [],
}) => {
  const { packageType, selectedServices, dates } = useBooking();
  const { t } = useTranslation();

  // Derived state to avoid unnecessary re-renders
  const isPremium = packageType === 'premium';

  // State for day planning
  const [currentDay, setCurrentDay] = useState(1);
  const [dayPlan, setDayPlan] = useState<DayPlanItem[]>([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [numDays, setNumDays] = useState(1);

  // Current day plan state
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);

  // Determine the number of days from dates (if available)
  useEffect(() => {
    if (dates?.startDate && dates?.endDate) {
      const start = new Date(dates.startDate);
      const end = new Date(dates.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setNumDays(diffDays);
    } else {
      // Default to 3 days if no dates selected
      setNumDays(3);
    }
  }, [dates]);

  // Generate available time slots - using useCallback to prevent recreating on every render
  const generateTimeSlots = useCallback(() => {
    const slots: string[] = [];
    // Generate time slots from 8 AM to 8 PM
    for (let hour = 8; hour <= 20; hour++) {
      const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
      const period = hour < 12 ? 'AM' : 'PM';
      slots.push(`${formattedHour}:00 ${period}`);
    }
    return slots;
  }, []);

  // Initialize available time slots
  useEffect(() => {
    setAvailableTimeSlots(generateTimeSlots());
  }, [generateTimeSlots]);

  // Handle time slot selection
  const handleTimeSlotSelect = (timeSlot: string) => {
    setSelectedTimeSlot(timeSlot);
  };

  // Handle adding the current service to the day plan
  const handleAddToPlan = useCallback(() => {
    if (!selectedTimeSlot) return;

    // Get the current service
    const service = selectedServices[currentServiceIndex];

    // Add to day plan
    setDayPlan((prev) => [
      ...prev,
      {
        serviceId: service.id,
        timeSlot: selectedTimeSlot,
        day: currentDay,
      },
    ]);

    // Move to next service or next day
    if (currentServiceIndex < selectedServices.length - 1) {
      setCurrentServiceIndex(currentServiceIndex + 1);
      setSelectedTimeSlot(null);
    } else if (currentDay < numDays) {
      setCurrentDay(currentDay + 1);
      setCurrentServiceIndex(0);
      setSelectedTimeSlot(null);
    } else {
      // All services planned for all days
      onComplete();
    }
  }, [
    selectedTimeSlot,
    currentServiceIndex,
    selectedServices,
    currentDay,
    numDays,
    onComplete,
  ]);

  // Check if we have unplanned services
  const hasMoreServices = currentServiceIndex < selectedServices.length;

  // Get the current service being planned
  const currentService = hasMoreServices
    ? selectedServices[currentServiceIndex]
    : null;

  return (
    <div className='max-w-4xl mx-auto px-4 py-8'>
      {/* Progress indicator */}
      <div className='mb-8'>
        <div className='flex justify-between items-center'>
          <h2 className='text-2xl font-bold text-gray-900'>Plan Your Days</h2>
          <div className='flex items-center text-sm text-gray-600'>
            <Calendar className='h-4 w-4 mr-1' />
            <span>
              Day {currentDay} of {numDays}
            </span>
          </div>
        </div>

        <div className='w-full bg-gray-200 rounded-full h-2.5 mt-4'>
          <div
            className={`h-2.5 rounded-full ${
              isPremium ? 'bg-amber-500' : 'bg-blue-500'
            }`}
            style={{ width: `${(currentDay / numDays) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Main planning area */}
      <div className='bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8'>
        <h3 className='text-xl font-semibold mb-6'>
          Plan Your Activities for Day {currentDay}
        </h3>

        {/* Current Service Planner */}
        {currentService ? (
          <ServicePlannerCard
            service={currentService}
            selectedTimeSlot={selectedTimeSlot}
            onTimeSlotSelect={handleTimeSlotSelect}
            availableTimeSlots={availableTimeSlots}
            isPremium={isPremium}
            currentDay={currentDay}
          />
        ) : (
          <div className='bg-gray-50 rounded-lg p-8 text-center'>
            <h4 className='text-lg font-medium text-gray-900 mb-2'>
              All services planned for Day {currentDay}!
            </h4>
            {currentDay < numDays ? (
              <p className='text-gray-600'>
                Continue to plan your next day or view your complete itinerary.
              </p>
            ) : (
              <p className='text-gray-600'>
                You've planned all your activities for your stay. Review your
                complete itinerary.
              </p>
            )}
          </div>
        )}

        {/* Daily Plan Summary */}
        {dayPlan.filter((item) => item.day === currentDay).length > 0 && (
          <div className='mt-8 border-t pt-6'>
            <h4 className='font-medium text-gray-800 mb-4'>
              Your Day {currentDay} Plan:
            </h4>
            <div className='space-y-3'>
              {dayPlan
                .filter((item) => item.day === currentDay)
                .sort((a, b) => {
                  // Sort by time
                  const timeA = a.timeSlot;
                  const timeB = b.timeSlot;
                  return timeA.localeCompare(timeB);
                })
                .map((item, index) => {
                  const service = selectedServices.find(
                    (s) => s.id === item.serviceId
                  );
                  if (!service) return null;

                  return (
                    <div
                      key={index}
                      className='flex items-start p-3 bg-gray-50 rounded-lg'
                    >
                      <div className='flex-shrink-0 w-16 text-center mr-4'>
                        <span className='text-sm font-semibold text-gray-700'>
                          {item.timeSlot}
                        </span>
                      </div>
                      <div className='flex-grow'>
                        <h5 className='font-medium text-gray-900'>
                          {service.name}
                        </h5>
                        <div className='flex items-center text-xs text-gray-500 mt-1'>
                          <Clock className='h-3 w-3 mr-1' />
                          <span>
                            {service.duration} hour
                            {service.duration !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>

      {/* Navigation/action buttons */}
      <div className='flex justify-between'>
        <button
          onClick={onBack}
          className='px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center'
        >
          <ChevronLeft className='mr-2 h-5 w-5' />
          Back
        </button>

        <div className='flex space-x-4'>
          {currentDay < numDays && !hasMoreServices && (
            <button
              onClick={() => {
                setCurrentDay(currentDay + 1);
                setCurrentServiceIndex(0);
                setSelectedTimeSlot(null);
              }}
              className={`px-6 py-3 rounded-lg flex items-center
                ${
                  isPremium
                    ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                    : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                } transition-colors`}
            >
              Next Day
              <ChevronRight className='ml-2 h-5 w-5' />
            </button>
          )}

          {currentService && (
            <button
              onClick={handleAddToPlan}
              disabled={!selectedTimeSlot}
              className={`px-6 py-3 rounded-lg text-white flex items-center
                ${
                  !selectedTimeSlot
                    ? 'bg-gray-300 cursor-not-allowed'
                    : isPremium
                    ? 'bg-amber-500 hover:bg-amber-600'
                    : 'bg-blue-500 hover:bg-blue-600'
                } transition-colors`}
            >
              <PlusCircle className='mr-2 h-5 w-5' />
              Add to Plan
            </button>
          )}

          {!hasMoreServices && (
            <button
              onClick={onComplete}
              className={`px-6 py-3 rounded-lg text-white flex items-center
                ${
                  isPremium
                    ? 'bg-amber-500 hover:bg-amber-600'
                    : 'bg-blue-500 hover:bg-blue-600'
                } 
                transition-colors`}
            >
              Complete Planning
              <Check className='ml-2 h-5 w-5' />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DayPlanner;
