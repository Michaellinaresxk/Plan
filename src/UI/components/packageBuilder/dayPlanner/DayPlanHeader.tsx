// src/components/dayplanner/DayPlanHeader.tsx
import React from 'react';
import { ChevronLeft, ChevronRight, Plus, Minus } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/client';

interface DayPlanHeaderProps {
  currentDay: number;
  daysCount: number;
  onPrevious: () => void;
  onNext: () => void;
  onAddDay: () => void;
  onRemoveDay: () => void;
}

const DayPlanHeader: React.FC<DayPlanHeaderProps> = ({
  currentDay,
  daysCount,
  onPrevious,
  onNext,
  onAddDay,
  onRemoveDay,
}) => {
  const { t } = useTranslation();

  return (
    <div className='flex items-center justify-between mb-6 bg-white p-4 rounded-lg shadow-sm'>
      <div className='flex items-center space-x-4'>
        <button
          onClick={onPrevious}
          disabled={currentDay === 1}
          className={`p-2 rounded-full ${
            currentDay === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
          }`}
        >
          <ChevronLeft size={20} />
        </button>

        <h3 className='text-xl font-semibold'>
          {t('dayplanner.dayTitle', { day: currentDay })}
        </h3>

        <button
          onClick={onNext}
          disabled={currentDay === daysCount}
          className={`p-2 rounded-full ${
            currentDay === daysCount
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
          }`}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className='flex items-center space-x-2'>
        <button
          onClick={onRemoveDay}
          disabled={daysCount === 1}
          className={`p-2 rounded-full ${
            daysCount === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-red-100 text-red-600 hover:bg-red-200'
          }`}
          title={t('dayplanner.removeDay')}
        >
          <Minus size={16} />
        </button>

        <span className='text-sm text-gray-600'>
          {t('dayplanner.totalDays', { count: daysCount })}
        </span>

        <button
          onClick={onAddDay}
          className='p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200'
          title={t('dayplanner.addDay')}
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
};

export default DayPlanHeader;
