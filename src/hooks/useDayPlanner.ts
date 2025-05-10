// src/hooks/useDayPlanner.ts
import { useState, useCallback } from 'react';
import { Service } from '@/types/type';
import { DayPlan, ServiceTimeSlot } from '@/types/dayPlanner';
import {
  detectTimeConflicts,
  isTimeSlotAvailable,
} from '@/UI/components/packageBuilder/dayPlanner/Util';

export const useDayPlanner = (initialDate: Date = new Date()) => {
  // Initialize with one day
  const [days, setDays] = useState<DayPlan[]>([
    {
      id: '1',
      date: initialDate,
      services: [],
    },
  ]);

  const [currentDayIndex, setCurrentDayIndex] = useState(0);

  // Add a new day
  const addDay = useCallback(() => {
    setDays((prevDays) => {
      const lastDay = prevDays[prevDays.length - 1];
      const newDate = new Date(lastDay.date);
      newDate.setDate(newDate.getDate() + 1);

      return [
        ...prevDays,
        {
          id: `${prevDays.length + 1}`,
          date: newDate,
          services: [],
        },
      ];
    });
  }, []);

  // Remove the last day
  const removeDay = useCallback(() => {
    setDays((prevDays) => {
      if (prevDays.length <= 1) return prevDays;

      const newDays = prevDays.slice(0, -1);

      // Adjust current index if necessary
      if (currentDayIndex >= newDays.length) {
        setCurrentDayIndex(newDays.length - 1);
      }

      return newDays;
    });
  }, [currentDayIndex]);

  // Add a service to a specific day
  const addServiceToDay = useCallback(
    (
      dayIndex: number,
      service: Service,
      timeSlot: string,
      options?: Record<string, any>
    ) => {
      setDays((prevDays) => {
        const newDays = [...prevDays];
        const day = newDays[dayIndex];

        // Check if time slot is available
        if (!isTimeSlotAvailable(timeSlot, day, service.duration)) {
          throw new Error('Time slot is not available');
        }

        const serviceTimeSlot: ServiceTimeSlot = {
          serviceId: service.id,
          timeSlot,
          serviceName: service.name,
          price: options?.calculatedPrice || service.price,
          duration: service.duration,
          options,
        };

        day.services.push(serviceTimeSlot);

        // Check for conflicts
        if (detectTimeConflicts(day.services)) {
          throw new Error('Time conflict detected');
        }

        return newDays;
      });
    },
    []
  );

  // Remove a service from a day
  const removeServiceFromDay = useCallback(
    (dayIndex: number, serviceId: string) => {
      setDays((prevDays) => {
        const newDays = [...prevDays];
        newDays[dayIndex].services = newDays[dayIndex].services.filter(
          (s) => s.serviceId !== serviceId
        );
        return newDays;
      });
    },
    []
  );

  // Update service time slot
  const updateServiceTimeSlot = useCallback(
    (dayIndex: number, serviceId: string, newTimeSlot: string) => {
      setDays((prevDays) => {
        const newDays = [...prevDays];
        const day = newDays[dayIndex];
        const serviceIndex = day.services.findIndex(
          (s) => s.serviceId === serviceId
        );

        if (serviceIndex === -1) return prevDays;

        const service = day.services[serviceIndex];

        // Create a temporary day without the service to check availability
        const tempServices = day.services.filter(
          (s) => s.serviceId !== serviceId
        );
        const tempDay = { ...day, services: tempServices };

        if (!isTimeSlotAvailable(newTimeSlot, tempDay, service.duration)) {
          throw new Error('New time slot is not available');
        }

        day.services[serviceIndex] = { ...service, timeSlot: newTimeSlot };

        // Check for conflicts
        if (detectTimeConflicts(day.services)) {
          throw new Error('Time conflict detected');
        }

        return newDays;
      });
    },
    []
  );

  // Navigate between days
  const navigateDay = useCallback(
    (direction: 'prev' | 'next') => {
      setCurrentDayIndex((prevIndex) => {
        if (direction === 'prev' && prevIndex > 0) {
          return prevIndex - 1;
        } else if (direction === 'next' && prevIndex < days.length - 1) {
          return prevIndex + 1;
        }
        return prevIndex;
      });
    },
    [days.length]
  );

  // Get current day
  const currentDay = days[currentDayIndex];

  // Calculate total price
  const calculateTotalPrice = useCallback(() => {
    return days.reduce((total, day) => {
      return (
        total +
        day.services.reduce((dayTotal, service) => {
          return dayTotal + service.price;
        }, 0)
      );
    }, 0);
  }, [days]);

  // Get all services across all days
  const getAllServices = useCallback(() => {
    return days.flatMap((day) => day.services);
  }, [days]);

  return {
    days,
    currentDayIndex,
    currentDay,
    setCurrentDayIndex,
    addDay,
    removeDay,
    addServiceToDay,
    removeServiceFromDay,
    updateServiceTimeSlot,
    navigateDay,
    calculateTotalPrice,
    getAllServices,
  };
};
