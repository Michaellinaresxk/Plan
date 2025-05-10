// src/types/dayPlanner.ts
export const TIME_SLOTS = [
  '9:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
  '5:00 PM',
];

export interface ServiceTimeSlot {
  serviceId: string;
  timeSlot: string;
  serviceName: string;
  price: number;
  duration: number;
  options?: Record<string, any>;
}

export interface DayPlan {
  id: string;
  date: Date;
  services: ServiceTimeSlot[];
}

export enum STEPS {
  INTRO = 'intro',
  SERVICE_SELECTION = 'service-selection',
  TIME_SLOTS = 'time-slots',
  DAY_PLANNING = 'day-planning',
  SUMMARY = 'summary',
}
