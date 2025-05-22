import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCalendar } from '@/hooks/useCalendar';

interface CalendarPickerProps {
  selectedDates: Set<string>;
  onDateToggle: (dateStr: string) => void;
  minDate: string;
  className?: string;
}

const CalendarPicker: React.FC<CalendarPickerProps> = ({
  selectedDates,
  onDateToggle,
  minDate,
  className = '',
}) => {
  const { calendarData, monthYear, navigateMonth, canNavigatePrevious } =
    useCalendar({ selectedDates, minDate });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div
      className={`bg-white border border-gray-300 rounded-lg p-4 ${className}`}
    >
      {/* Calendar Header */}
      <div className='flex items-center justify-between mb-4'>
        <button
          type='button'
          onClick={() => navigateMonth(-1)}
          disabled={!canNavigatePrevious}
          className={`p-2 rounded-lg transition-colors ${
            canNavigatePrevious
              ? 'hover:bg-gray-100 text-gray-600'
              : 'text-gray-300 cursor-not-allowed'
          }`}
          aria-label='Previous month'
        >
          <ChevronLeft className='w-5 h-5' />
        </button>

        <h3 className='text-lg font-semibold text-gray-900'>{monthYear}</h3>

        <button
          type='button'
          onClick={() => navigateMonth(1)}
          className='p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600'
          aria-label='Next month'
        >
          <ChevronRight className='w-5 h-5' />
        </button>
      </div>

      {/* Days of Week Header */}
      <div className='grid grid-cols-7 gap-1 mb-2'>
        {weekDays.map((day) => (
          <div
            key={day}
            className='text-center text-sm font-medium text-gray-500 py-2'
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className='grid grid-cols-7 gap-1'>
        {calendarData.map((day, index) => (
          <button
            key={`${day.dateStr}-${index}`}
            type='button'
            onClick={() => day.isSelectable && onDateToggle(day.dateStr)}
            disabled={!day.isSelectable}
            className={`
              h-10 w-full rounded-lg text-sm font-medium transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1
              ${
                !day.isCurrentMonth
                  ? 'text-gray-300 cursor-default'
                  : day.isSelectable
                  ? day.isSelected
                    ? 'bg-amber-600 text-white shadow-md hover:bg-amber-700'
                    : day.isToday
                    ? 'bg-blue-100 text-blue-800 hover:bg-amber-100 hover:text-amber-800'
                    : 'text-gray-700 hover:bg-amber-50 hover:text-amber-800'
                  : 'text-gray-400 cursor-not-allowed'
              }
            `}
            aria-label={`${
              day.isSelected ? 'Deselect' : 'Select'
            } ${day.date.toLocaleDateString()}`}
          >
            {day.day}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className='mt-4 flex flex-wrap gap-4 text-xs text-gray-600'>
        <div className='flex items-center gap-1'>
          <div className='w-3 h-3 bg-blue-100 rounded' aria-hidden='true'></div>
          <span>Today</span>
        </div>
        <div className='flex items-center gap-1'>
          <div
            className='w-3 h-3 bg-amber-600 rounded'
            aria-hidden='true'
          ></div>
          <span>Selected</span>
        </div>
        <div className='flex items-center gap-1'>
          <div className='w-3 h-3 bg-gray-200 rounded' aria-hidden='true'></div>
          <span>Unavailable</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarPicker;
