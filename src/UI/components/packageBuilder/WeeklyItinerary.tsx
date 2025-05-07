'use client';

import React, { useState, useEffect } from 'react';
import { useBooking } from '@/context/BookingContext';
import { useTranslation } from '@/lib/i18n/client';
import { format, isWithinInterval, addDays, isSameDay } from 'date-fns';
import {
  Calendar,
  Clock,
  ArrowLeft,
  ArrowRight,
  Sun,
  Info,
  Sunrise,
  Sunset,
} from 'lucide-react';

interface ItineraryEvent {
  id: string;
  serviceId: string;
  serviceName: string;
  date: Date;
  timeSlot: string;
  duration: number;
  timeOfDay: 'morning' | 'afternoon' | 'evening';
}

const WeeklyItinerary: React.FC = () => {
  const { t } = useTranslation();
  const { packageType, selectedServices, dates, serviceTimeSlots } =
    useBooking();

  const [currentWeekStart, setCurrentWeekStart] = useState<Date | null>(null);
  const [events, setEvents] = useState<ItineraryEvent[]>([]);
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  // Initialize the view with the start of the trip when dates are available
  useEffect(() => {
    if (dates?.startDate) {
      setCurrentWeekStart(new Date(dates.startDate));
      setSelectedDay(new Date(dates.startDate));
    }
  }, [dates]);

  // Process itinerary events when services or time slots change
  useEffect(() => {
    const processedEvents: ItineraryEvent[] = [];

    serviceTimeSlots.forEach((slot) => {
      const service = selectedServices.find((s) => s.id === slot.serviceId);
      if (service) {
        // Determine time of day based on the hour
        const timeOfDay = getTimeOfDay(slot.timeSlot);

        processedEvents.push({
          id: `${slot.serviceId}-${slot.date.toISOString()}-${slot.timeSlot}`,
          serviceId: slot.serviceId,
          serviceName: service.name,
          date: new Date(slot.date),
          timeSlot: slot.timeSlot,
          duration: service.duration,
          timeOfDay,
        });
      }
    });

    setEvents(processedEvents);
  }, [selectedServices, serviceTimeSlots]);

  // If no dates to show
  if (!dates?.startDate || !dates?.endDate) {
    return (
      <div className='max-w-4xl mx-auto py-8 px-4'>
        <div className='bg-amber-50 border border-amber-200 rounded-lg p-6 text-center'>
          <Calendar className='h-12 w-12 text-amber-500 mx-auto mb-4' />
          <h3 className='text-lg font-medium text-amber-800 mb-2'>
            {t('itinerary.noDates.title', {
              fallback: 'No Travel Dates Selected',
            })}
          </h3>
          <p className='text-amber-700 mb-4'>
            {t('itinerary.noDates.message', {
              fallback:
                'Please select your travel dates before viewing your itinerary.',
            })}
          </p>
        </div>
      </div>
    );
  }

  // If no events planned
  if (events.length === 0) {
    return (
      <div className='max-w-4xl mx-auto py-8 px-4'>
        <div className='bg-blue-50 border border-blue-200 rounded-lg p-6'>
          <h2 className='text-xl font-semibold text-blue-800 mb-4'>
            {t('itinerary.noEvents.title', {
              fallback: 'No Activities Scheduled Yet',
            })}
          </h2>
          <p className='text-blue-700 mb-6'>
            {t('itinerary.noEvents.message', {
              fallback:
                'Your itinerary is empty. Schedule your activities to see them here.',
            })}
          </p>

          <div className='bg-white p-4 rounded-lg border border-blue-100'>
            <h3 className='flex items-center text-gray-800 font-medium mb-2'>
              <Info className='mr-2 h-5 w-5 text-blue-500' />
              {t('itinerary.tip.title', { fallback: 'Scheduling Tip' })}
            </h3>
            <p className='text-gray-600 text-sm'>
              {t('itinerary.tip.message', {
                fallback:
                  'We recommend adding time slots for your activities to better plan your vacation.',
              })}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Helper functions
  const getTimeOfDay = (
    timeSlot: string
  ): 'morning' | 'afternoon' | 'evening' => {
    const [time, period] = timeSlot.split(' ');
    const [hourStr] = time.split(':');
    let hour = parseInt(hourStr);

    if (period === 'PM' && hour !== 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;

    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    return 'evening';
  };

  const getNextWeek = () => {
    if (currentWeekStart) {
      setCurrentWeekStart(addDays(currentWeekStart, 7));
    }
  };

  const getPreviousWeek = () => {
    if (currentWeekStart) {
      setCurrentWeekStart(addDays(currentWeekStart, -7));
    }
  };

  const getDaysInCurrentWeek = () => {
    if (!currentWeekStart) return [];

    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(addDays(currentWeekStart, i));
    }
    return days;
  };

  const getEventsForDay = (day: Date) => {
    return events.filter((event) => isSameDay(event.date, day));
  };

  const getEventsForTimeOfDay = (
    day: Date,
    timeOfDay: 'morning' | 'afternoon' | 'evening'
  ) => {
    return events.filter(
      (event) => isSameDay(event.date, day) && event.timeOfDay === timeOfDay
    );
  };

  // Get days that have events
  const daysWithEvents = events
    .map((event) => event.date)
    .filter(
      (date, index, self) => index === self.findIndex((d) => isSameDay(d, date))
    );

  // Determine if a date is within the travel range
  const isInTravelRange = (date: Date) => {
    if (!dates?.startDate || !dates?.endDate) return false;

    return isWithinInterval(date, {
      start: new Date(dates.startDate),
      end: new Date(dates.endDate),
    });
  };

  // Render weekly view
  const renderWeekView = () => {
    const days = getDaysInCurrentWeek();

    return (
      <div>
        {/* Week navigation */}
        <div className='flex justify-between items-center mb-6'>
          <button
            onClick={getPreviousWeek}
            className='p-2 rounded-lg hover:bg-gray-100'
          >
            <ArrowLeft className='h-5 w-5 text-gray-600' />
          </button>

          <h3 className='text-lg font-medium text-gray-900'>
            {currentWeekStart && format(currentWeekStart, 'MMMM d')} -{' '}
            {currentWeekStart &&
              format(addDays(currentWeekStart, 6), 'MMMM d, yyyy')}
          </h3>

          <button
            onClick={getNextWeek}
            className='p-2 rounded-lg hover:bg-gray-100'
          >
            <ArrowRight className='h-5 w-5 text-gray-600' />
          </button>
        </div>

        {/* Weekly calendar */}
        <div className='grid grid-cols-7 gap-2 mb-8'>
          {days.map((day, index) => {
            const dayEvents = getEventsForDay(day);
            const isSelected = selectedDay && isSameDay(day, selectedDay);
            const isInRange = isInTravelRange(day);

            return (
              <button
                key={index}
                onClick={() => {
                  setSelectedDay(day);
                  setViewMode('day');
                }}
                className={`
                  p-3 rounded-lg text-center transition-colors
                  ${
                    isSelected
                      ? packageType === 'standard'
                        ? 'bg-blue-500 text-white'
                        : 'bg-amber-500 text-white'
                      : isInRange
                      ? dayEvents.length > 0
                        ? 'bg-white border-2 border-gray-300 hover:border-gray-400'
                        : 'bg-white border border-gray-200 hover:border-gray-300'
                      : 'bg-gray-100 text-gray-400 cursor-default'
                  }
                  ${!isInRange ? 'opacity-50' : ''}
                `}
                disabled={!isInRange}
              >
                <div className='text-xs font-medium mb-1'>
                  {format(day, 'EEE')}
                </div>
                <div className='text-lg font-semibold'>{format(day, 'd')}</div>
                {dayEvents.length > 0 && isInRange && (
                  <div
                    className={`
                    mt-1 w-4 h-4 mx-auto rounded-full
                    ${
                      packageType === 'standard'
                        ? 'bg-blue-400'
                        : 'bg-amber-400'
                    }
                    ${isSelected ? 'bg-white' : ''}
                  `}
                  >
                    <span className='sr-only'>{dayEvents.length} events</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected day preview */}
        {selectedDay && (
          <div className='bg-white rounded-lg shadow-md p-6 mb-4'>
            <div className='flex justify-between items-center mb-4'>
              <h3 className='text-lg font-medium text-gray-900'>
                {format(selectedDay, 'EEEE, MMMM d')}
              </h3>

              <button
                onClick={() => setViewMode('day')}
                className={`
                  px-4 py-2 text-sm rounded-lg
                  ${
                    packageType === 'standard'
                      ? 'text-blue-600 hover:bg-blue-50'
                      : 'text-amber-600 hover:bg-amber-50'
                  }
                `}
              >
                {t('itinerary.viewDetails', { fallback: 'View Details' })}
              </button>
            </div>

            <DaySummary
              day={selectedDay}
              events={getEventsForDay(selectedDay)}
              packageType={packageType || 'standard'}
            />
          </div>
        )}
      </div>
    );
  };

  // Render daily view
  const renderDayView = () => {
    if (!selectedDay) return null;

    return (
      <div className='bg-white rounded-lg shadow-md p-6'>
        <div className='flex items-center mb-6'>
          <button
            onClick={() => setViewMode('week')}
            className='mr-4 p-2 rounded-lg hover:bg-gray-100'
          >
            <ArrowLeft className='h-5 w-5 text-gray-600' />
          </button>

          <h3 className='text-xl font-semibold text-gray-900'>
            {format(selectedDay, 'EEEE, MMMM d')}
          </h3>
        </div>

        <div className='space-y-8'>
          {/* Morning */}
          <TimeOfDaySection
            title={t('itinerary.morning', { fallback: 'Morning' })}
            icon={<Sunrise className='h-5 w-5 text-orange-500' />}
            events={getEventsForTimeOfDay(selectedDay, 'morning')}
            packageType={packageType || 'standard'}
          />

          {/* Afternoon */}
          <TimeOfDaySection
            title={t('itinerary.afternoon', { fallback: 'Afternoon' })}
            icon={<Sun className='h-5 w-5 text-yellow-500' />}
            events={getEventsForTimeOfDay(selectedDay, 'afternoon')}
            packageType={packageType || 'standard'}
          />

          {/* Evening */}
          <TimeOfDaySection
            title={t('itinerary.evening', { fallback: 'Evening' })}
            icon={<Sunset className='h-5 w-5 text-purple-500' />}
            events={getEventsForTimeOfDay(selectedDay, 'evening')}
            packageType={packageType || 'standard'}
          />
        </div>
      </div>
    );
  };

  return (
    <div className='max-w-4xl mx-auto py-8 px-4'>
      <h2 className='text-2xl font-bold text-gray-900 mb-6 flex items-center'>
        <Calendar className='mr-3 h-6 w-6 text-gray-700' />
        {t('itinerary.title', { fallback: 'Your Vacation Itinerary' })}
      </h2>

      <p className='text-gray-600 mb-8'>
        {t('itinerary.subtitle', {
          fallback:
            "Here's your daily schedule for your trip from {{startDate}} to {{endDate}}.",
          startDate: dates.startDate
            ? format(new Date(dates.startDate), 'MMMM d')
            : '',
          endDate: dates.endDate
            ? format(new Date(dates.endDate), 'MMMM d, yyyy')
            : '',
        })}
      </p>

      {/* View mode selector */}
      <div className='flex space-x-2 mb-6'>
        <button
          onClick={() => setViewMode('week')}
          className={`
            px-4 py-2 rounded-lg transition-colors
            ${
              viewMode === 'week'
                ? packageType === 'standard'
                  ? 'bg-blue-500 text-white'
                  : 'bg-amber-500 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }
          `}
        >
          {t('itinerary.weekView', { fallback: 'Week View' })}
        </button>

        <button
          onClick={() => setViewMode('day')}
          className={`
            px-4 py-2 rounded-lg transition-colors
            ${
              viewMode === 'day'
                ? packageType === 'standard'
                  ? 'bg-blue-500 text-white'
                  : 'bg-amber-500 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }
          `}
        >
          {t('itinerary.dayView', { fallback: 'Day View' })}
        </button>
      </div>

      {viewMode === 'week' ? renderWeekView() : renderDayView()}
    </div>
  );
};

// Day Summary Component
interface DaySummaryProps {
  day: Date;
  events: ItineraryEvent[];
  packageType: 'standard' | 'premium';
}

const DaySummary: React.FC<DaySummaryProps> = ({
  day,
  events,
  packageType,
}) => {
  const { t } = useTranslation();

  if (events.length === 0) {
    return (
      <p className='text-gray-500 italic text-center py-4'>
        {t('itinerary.noActivities', {
          fallback: 'No activities scheduled for this day',
        })}
      </p>
    );
  }

  return (
    <div className='space-y-2'>
      {events.map((event) => (
        <div
          key={event.id}
          className='flex items-center p-2 rounded-lg hover:bg-gray-50'
        >
          <div
            className={`
            w-2 h-2 rounded-full mr-3
            ${
              event.timeOfDay === 'morning'
                ? 'bg-orange-500'
                : event.timeOfDay === 'afternoon'
                ? 'bg-yellow-500'
                : 'bg-purple-500'
            }
          `}
          ></div>

          <div className='flex-1'>
            <h4 className='font-medium text-gray-900'>{event.serviceName}</h4>
            <div className='text-sm text-gray-500 flex items-center'>
              <Clock className='mr-1 h-4 w-4' />
              <span>{event.timeSlot}</span>
            </div>
          </div>

          <div
            className={`
            px-2 py-1 rounded text-xs font-medium
            ${
              packageType === 'standard'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-amber-100 text-amber-800'
            }
          `}
          >
            {event.duration} {event.duration === 1 ? 'hour' : 'hours'}
          </div>
        </div>
      ))}
    </div>
  );
};

// Time of Day Section Component
interface TimeOfDaySectionProps {
  title: string;
  icon: React.ReactNode;
  events: ItineraryEvent[];
  packageType: 'standard' | 'premium';
}

const TimeOfDaySection: React.FC<TimeOfDaySectionProps> = ({
  title,
  icon,
  events,
  packageType,
}) => {
  const { t } = useTranslation();

  return (
    <div>
      <h4 className='text-lg font-medium text-gray-900 mb-3 flex items-center'>
        {icon}
        <span className='ml-2'>{title}</span>
      </h4>

      {events.length === 0 ? (
        <p className='text-gray-500 italic pl-7 pb-4'>
          {t('itinerary.noActivitiesForTimeOfDay', {
            fallback: 'No activities scheduled for this time of day',
            timeOfDay: title.toLowerCase(),
          })}
        </p>
      ) : (
        <div className='space-y-2 pl-7'>
          {events.map((event) => (
            <div
              key={event.id}
              className={`
                p-3 rounded-lg border
                ${
                  packageType === 'standard'
                    ? 'border-blue-200 bg-blue-50'
                    : 'border-amber-200 bg-amber-50'
                }
              `}
            >
              <div className='flex justify-between items-start'>
                <div>
                  <h5 className='font-medium text-gray-900'>
                    {event.serviceName}
                  </h5>
                  <div className='text-sm text-gray-500 flex items-center mt-1'>
                    <Clock className='mr-1 h-4 w-4' />
                    <span>{event.timeSlot}</span>
                  </div>
                </div>

                <div
                  className={`
                  px-2 py-1 rounded text-xs font-medium
                  ${
                    packageType === 'standard'
                      ? 'bg-blue-200 text-blue-800'
                      : 'bg-amber-200 text-amber-800'
                  }
                `}
                >
                  {event.duration} {event.duration === 1 ? 'hour' : 'hours'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WeeklyItinerary;
