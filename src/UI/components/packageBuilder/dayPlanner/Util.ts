import { DayPlan, ServiceTimeSlot, TIME_SLOTS } from '@/types/dayPlanner';

export const isTimeSlotAvailable = (
  timeSlot: string,
  dayPlan: DayPlan,
  serviceDuration: number
): boolean => {
  const slotIndex = TIME_SLOTS.indexOf(timeSlot);

  // Check if the service would overflow past available time slots
  if (slotIndex + serviceDuration > TIME_SLOTS.length) {
    return false;
  }

  // Check if any of the required slots are already occupied
  for (let i = 0; i < serviceDuration; i++) {
    const checkSlot = TIME_SLOTS[slotIndex + i];
    const isOccupied = dayPlan.services.some((service) => {
      const serviceStart = TIME_SLOTS.indexOf(service.timeSlot);
      const serviceEnd = serviceStart + service.duration;
      const checkIndex = TIME_SLOTS.indexOf(checkSlot);
      return checkIndex >= serviceStart && checkIndex < serviceEnd;
    });

    if (isOccupied) return false;
  }

  return true;
};

export const calculateServiceEndTime = (
  startTime: string,
  duration: number
): string => {
  const startIndex = TIME_SLOTS.indexOf(startTime);
  const endIndex = startIndex + duration;

  if (endIndex >= TIME_SLOTS.length) {
    return TIME_SLOTS[TIME_SLOTS.length - 1];
  }

  return TIME_SLOTS[endIndex];
};

export const detectTimeConflicts = (services: ServiceTimeSlot[]): boolean => {
  for (let i = 0; i < services.length; i++) {
    const service1 = services[i];
    const start1 = TIME_SLOTS.indexOf(service1.timeSlot);
    const end1 = start1 + service1.duration;

    for (let j = i + 1; j < services.length; j++) {
      const service2 = services[j];
      const start2 = TIME_SLOTS.indexOf(service2.timeSlot);
      const end2 = start2 + service2.duration;

      // Check if services overlap
      if (
        (start1 < end2 && start1 >= start2) ||
        (start2 < end1 && start2 >= start1)
      ) {
        return true;
      }
    }
  }

  return false;
};

export const formatTimeSlot = (time: string): string => {
  // Standardize time format
  return time.replace(/\s+/g, ' ').trim();
};

export const sortServicesByTime = (
  services: ServiceTimeSlot[]
): ServiceTimeSlot[] => {
  return [...services].sort((a, b) => {
    const indexA = TIME_SLOTS.indexOf(a.timeSlot);
    const indexB = TIME_SLOTS.indexOf(b.timeSlot);
    return indexA - indexB;
  });
};

export const calculateDayTotal = (services: ServiceTimeSlot[]): number => {
  return services.reduce((total, service) => total + service.price, 0);
};

export const formatDaySchedule = (services: ServiceTimeSlot[]): string => {
  if (services.length === 0) return 'No services scheduled';

  const sorted = sortServicesByTime(services);
  return sorted
    .map((service) => {
      const endTime = calculateServiceEndTime(
        service.timeSlot,
        service.duration
      );
      return `${service.timeSlot} - ${endTime}: ${service.serviceName}`;
    })
    .join('\n');
};
