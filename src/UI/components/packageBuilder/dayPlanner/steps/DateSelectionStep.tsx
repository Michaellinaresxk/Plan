import React from 'react';
import { motion } from 'framer-motion';
import { DayPicker, DateRange } from 'react-day-picker';
import { format, addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/client';

interface DateSelectionStepProps {
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
  guests: number;
  setGuests: (guests: number) => void;
  numDays: number;
  onNext: () => void;
}

export const DateSelectionStep: React.FC<DateSelectionStepProps> = ({
  dateRange,
  setDateRange,
  guests,
  setGuests,
  numDays,
  onNext,
}) => {
  const { t } = useTranslation();

  const handleRangeSelect = (range: DateRange | undefined) => {
    if (range?.from) {
      // If only from date is selected, auto-select to date as from + 3 days
      if (!range.to) {
        const defaultEndDate = addDays(range.from, 3);
        range.to = defaultEndDate;
      }
      setDateRange(range);
    }
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      className='bg-white rounded-2xl shadow-xl p-8 border border-gray-100'
      initial='hidden'
      animate='visible'
      variants={fadeIn}
    >
      <h2 className='text-3xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
        {t('customPackagePage.cardGuideBtn2')}
      </h2>

      <div className='mb-8'>
        <p className='text-gray-600 mb-6 text-lg'>
          {t('dayByDayPlanner.title')}
        </p>

        <motion.div
          className='max-w-sm mx-auto border border-gray-200 rounded-2xl p-4 bg-white shadow-md'
          whileHover={{ boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}
          transition={{ duration: 0.3 }}
        >
          <DayPicker
            mode='range'
            selected={dateRange}
            onSelect={handleRangeSelect}
            numberOfMonths={1}
            disabled={{ before: new Date() }}
            locale={es}
            className='m-auto'
            styles={{
              caption: { color: '#3B82F6' },
              day_selected: { backgroundColor: '#3B82F6' },
              day_today: { color: '#3B82F6' },
            }}
          />
        </motion.div>

        {dateRange?.from && dateRange?.to && (
          <motion.div
            className='mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl text-center shadow-sm border border-blue-100'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className='text-blue-800 font-semibold text-lg'>
              Tu estancia: {format(dateRange.from, 'PPP', { locale: es })} -{' '}
              {format(dateRange.to, 'PPP', { locale: es })}
            </p>
            <p className='text-blue-600 mt-2 text-lg font-medium'>
              ({numDays} {numDays === 1 ? 'día' : 'días'})
            </p>
          </motion.div>
        )}
      </div>

      <div className='flex justify-end'>
        <motion.button
          onClick={onNext}
          disabled={!dateRange?.from || !dateRange?.to || !guests}
          className={`
            px-8 py-4 rounded-xl font-medium flex items-center text-lg
            ${
              !dateRange?.from || !dateRange?.to || !guests
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl'
            }
            transition-all duration-300
          `}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          Continuar
          <ArrowRight className='ml-2 h-5 w-5' />
        </motion.button>
      </div>
    </motion.div>
  );
};
