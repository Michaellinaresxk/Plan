import { useState, useMemo, useCallback } from 'react';

interface CalendarDay {
  date: Date;
  dateStr: string;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelectable: boolean;
  isSelected: boolean;
}

interface UseCalendarProps {
  selectedDates: Set<string>;
  minDate: string;
}

export const useCalendar = ({ selectedDates, minDate }: UseCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Generate calendar data for current month
  const calendarData = useMemo((): CalendarDay[] => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    // First day of the month
    const firstDay = new Date(year, month, 1);
    // First day of the week for the first day of month
    const startDate = new Date(firstDay);
    startDate.setDate(firstDay.getDate() - firstDay.getDay());

    const days: CalendarDay[] = [];
    const current = new Date(startDate);
    const minDateTime = new Date(minDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Generate 6 weeks (42 days) to fill the calendar grid
    for (let i = 0; i < 42; i++) {
      const dateStr = current.toISOString().split('T')[0];
      const isCurrentMonth = current.getMonth() === month;
      const isToday = current.toDateString() === new Date().toDateString();
      const isSelectable = current >= minDateTime;
      const isSelected = selectedDates.has(dateStr);

      days.push({
        date: new Date(current),
        dateStr,
        day: current.getDate(),
        isCurrentMonth,
        isToday,
        isSelectable,
        isSelected,
      });

      current.setDate(current.getDate() + 1);
    }

    return days;
  }, [currentMonth, selectedDates, minDate]);

  const navigateMonth = useCallback((direction: number) => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  }, []);

  const monthYear = currentMonth.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const canNavigatePrevious = useMemo(() => {
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(currentMonth.getMonth() - 1);
    const minDateTime = new Date(minDate);
    return (
      prevMonth >=
      new Date(minDateTime.getFullYear(), minDateTime.getMonth(), 1)
    );
  }, [currentMonth, minDate]);

  return {
    calendarData,
    monthYear,
    navigateMonth,
    canNavigatePrevious,
    currentMonth,
  };
};
