// hooks/useDayPlanner.ts
import { useState, useMemo, useCallback, useEffect } from 'react';
import { DateRange } from 'react-day-picker';
import { differenceInDays, format } from 'date-fns';
import { BookingDate } from '@/types/type';
import { DailyActivity } from '@/constants/dayplanner';

export const useDayPlanner = (dates: BookingDate | null) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    dates
      ? { from: new Date(dates.startDate), to: new Date(dates.endDate) }
      : undefined
  );

  const [travelPurpose, setTravelPurpose] = useState<string>('');
  const [dailyActivities, setDailyActivities] = useState<
    Record<string, DailyActivity[]>
  >({});
  const [currentDayIndex, setCurrentDayIndex] = useState<number>(0);

  // Effect to update dateRange when dates in context changes
  useEffect(() => {
    if (dates) {
      setDateRange({
        from: new Date(dates.startDate),
        to: new Date(dates.endDate),
      });
    }
  }, [dates]);

  // Generate array of days between the selected range
  const daysArray = useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) return [];

    const days: Date[] = [];
    let currentDate = new Date(dateRange.from);
    const endDate = new Date(dateRange.to);

    while (currentDate <= endDate) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  }, [dateRange]);

  // Get the current day being planned
  const currentDay = daysArray[currentDayIndex] || null;
  const currentDayStr = currentDay ? format(currentDay, 'yyyy-MM-dd') : '';

  // Calculate number of days in selection
  const numDays =
    dateRange?.from && dateRange?.to
      ? differenceInDays(dateRange.to, dateRange.from) + 1
      : 0;

  // Get count of planned activities
  const getTotalActivitiesCount = useCallback(() => {
    return Object.values(dailyActivities).reduce((total, activities) => {
      return total + activities.length;
    }, 0);
  }, [dailyActivities]);

  // Calculate total price of all activities
  const calculateTotalPrice = useCallback(
    (services: any[]) => {
      let total = 0;

      Object.values(dailyActivities).forEach((activities) => {
        activities.forEach((activity) => {
          const service = services.find((s) => s.id === activity.serviceId);
          if (service) {
            total += service.price * activity.guestCount;
          }
        });
      });

      return total;
    },
    [dailyActivities]
  );

  return {
    dateRange,
    setDateRange,
    travelPurpose,
    setTravelPurpose,
    dailyActivities,
    setDailyActivities,
    currentDayIndex,
    setCurrentDayIndex,
    daysArray,
    currentDay,
    currentDayStr,
    numDays,
    getTotalActivitiesCount,
    calculateTotalPrice,
  };
};
