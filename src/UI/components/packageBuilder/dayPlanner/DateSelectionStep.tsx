// UI/components/packageBuilder/dayPlanner/steps/LuxuryDateSelectionStep.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DayPicker, DateRange } from 'react-day-picker';
import { format, differenceInDays, addDays, isSameMonth } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  ArrowRight,
  Calendar,
  Users,
  ChevronLeft,
  ChevronRight,
  Info,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/client';
import Image from 'next/image';

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
  const [month, setMonth] = useState<Date>(new Date());
  const [showGuestsModal, setShowGuestsModal] = useState(false);

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

  const getRandomDestinationImage = () => {
    // In a real app, this would be replaced with actual destination images
    const destinationImages = [
      '/img/destinations/beach.jpg',
      '/img/destinations/mountain.jpg',
      '/img/destinations/city.jpg',
      '/img/destinations/lake.jpg',
      '/img/destinations/island.jpg',
    ];

    return destinationImages[
      Math.floor(Math.random() * destinationImages.length)
    ];
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  const staggerChildrenVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className='bg-white rounded-2xl shadow-xl p-8 border border-gray-100'
      initial='hidden'
      animate='visible'
      variants={containerVariants}
    >
      <motion.div variants={staggerChildrenVariants}>
        <motion.h2
          className='text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'
          variants={itemVariants}
        >
          {t('customPackagePage.cardGuideBtn2')}
        </motion.h2>

        <motion.p
          className='text-gray-600 mb-8 text-lg'
          variants={itemVariants}
        >
          {t('dayByDayPlanner.title')}
        </motion.p>
      </motion.div>

      <div className='grid md:grid-cols-2 gap-8 mb-8'>
        <motion.div
          className='border border-gray-200 rounded-2xl p-6 bg-white shadow-md'
          whileHover={{ boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}
          transition={{ duration: 0.3 }}
        >
          <div className='flex justify-between items-center mb-4'>
            <h3 className='text-xl font-semibold text-gray-800 flex items-center'>
              <Calendar className='mr-2 h-5 w-5 text-blue-500' />
              Selecciona fechas
            </h3>

            <div className='flex space-x-2'>
              <motion.button
                onClick={() => {
                  const newMonth = new Date(month);
                  newMonth.setMonth(month.getMonth() - 1);
                  setMonth(newMonth);
                }}
                className='p-1 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors'
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronLeft className='h-5 w-5' />
              </motion.button>

              <motion.button
                onClick={() => {
                  const newMonth = new Date(month);
                  newMonth.setMonth(month.getMonth() + 1);
                  setMonth(newMonth);
                }}
                className='p-1 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors'
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronRight className='h-5 w-5' />
              </motion.button>
            </div>
          </div>

          <DayPicker
            mode='range'
            selected={dateRange}
            onSelect={handleRangeSelect}
            month={month}
            onMonthChange={setMonth}
            numberOfMonths={1}
            disabled={{ before: new Date() }}
            locale={es}
            className='m-auto'
            modifiersClassNames={{
              selected: 'bg-blue-600 text-white rounded-full',
              today: 'text-blue-600 font-bold',
              range_start: 'bg-blue-600 text-white rounded-full',
              range_end: 'bg-blue-600 text-white rounded-full',
              range_middle: 'bg-blue-100',
            }}
            styles={{
              caption: { color: '#3B82F6', fontWeight: 'bold' },
              day_selected: {
                backgroundColor: '#3B82F6',
                color: 'white',
                fontWeight: 'bold',
              },
              day_today: { color: '#3B82F6', fontWeight: 'bold' },
            }}
          />

          <div className='mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100 flex items-center text-sm text-blue-700'>
            <Info className='h-4 w-4 mr-2 flex-shrink-0' />
            <p>
              Selecciona la fecha de inicio y fin de tu estancia. Los días
              intermedios serán incluidos automáticamente.
            </p>
          </div>
        </motion.div>

        <div>
          {dateRange?.from && dateRange?.to ? (
            <motion.div
              className='h-full flex flex-col'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className='p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 mb-4'>
                <h3 className='text-xl font-semibold text-blue-800 mb-4'>
                  Tu estancia
                </h3>

                <div className='flex items-center mb-4'>
                  <div className='bg-white p-3 rounded-lg shadow-sm mr-4 text-center w-20'>
                    <p className='text-xs text-gray-500'>Entrada</p>
                    <p className='text-2xl font-bold text-gray-900'>
                      {format(dateRange.from, 'dd', { locale: es })}
                    </p>
                    <p className='text-sm text-gray-700'>
                      {format(dateRange.from, 'MMM', { locale: es })}
                    </p>
                  </div>

                  <div className='flex-grow h-0.5 bg-blue-200 relative mx-2'>
                    <div className='absolute -top-3 left-1/2 transform -translate-x-1/2 text-blue-500 text-sm font-medium bg-blue-50 px-2 rounded-full'>
                      {numDays} {numDays === 1 ? 'día' : 'días'}
                    </div>
                  </div>

                  <div className='bg-white p-3 rounded-lg shadow-sm ml-4 text-center w-20'>
                    <p className='text-xs text-gray-500'>Salida</p>
                    <p className='text-2xl font-bold text-gray-900'>
                      {format(dateRange.to, 'dd', { locale: es })}
                    </p>
                    <p className='text-sm text-gray-700'>
                      {format(dateRange.to, 'MMM', { locale: es })}
                    </p>
                  </div>
                </div>

                <p className='text-blue-800 font-medium text-center'>
                  {format(dateRange.from, 'PPP', { locale: es })} -{' '}
                  {format(dateRange.to, 'PPP', { locale: es })}
                </p>
              </div>

              <div className='p-6 bg-white rounded-xl border border-gray-200 shadow-md flex-grow'>
                <div className='flex justify-between items-center mb-4'>
                  <h3 className='text-xl font-semibold text-gray-800 flex items-center'>
                    <Users className='mr-2 h-5 w-5 text-blue-500' />
                    Viajeros
                  </h3>

                  <button
                    onClick={() => setShowGuestsModal(!showGuestsModal)}
                    className='px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-full font-medium hover:bg-blue-100 transition-colors'
                  >
                    Cambiar
                  </button>
                </div>

                <div className='flex items-center justify-center py-4'>
                  <button
                    onClick={() => setGuests(Math.max(1, guests - 1))}
                    className='w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-200'
                  >
                    -
                  </button>

                  <div className='mx-6 text-center'>
                    <span className='text-4xl font-bold text-gray-900'>
                      {guests}
                    </span>
                    <p className='text-sm text-gray-500 mt-1'>
                      {guests === 1 ? 'Persona' : 'Personas'}
                    </p>
                  </div>

                  <button
                    onClick={() => setGuests(Math.min(10, guests + 1))}
                    className='w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-200'
                  >
                    +
                  </button>
                </div>

                <p className='text-sm text-gray-500 text-center mt-2'>
                  Selecciona el número de personas que participarán en las
                  actividades.
                </p>
              </div>

              <motion.div
                className='relative h-40 rounded-xl mt-4 overflow-hidden shadow-lg'
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src={getRandomDestinationImage()}
                  alt='Destination'
                  fill
                  className='object-cover'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4'>
                  <div className='text-white'>
                    <p className='text-sm font-medium'>Tu próxima aventura</p>
                    <p className='text-xl font-bold'>
                      {numDays} {numDays === 1 ? 'día' : 'días'} de experiencias
                      inolvidables
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <div className='flex flex-col items-center justify-center h-full p-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100'>
              <Calendar className='h-16 w-16 text-blue-300 mb-4' />
              <h3 className='text-xl font-medium text-blue-700 mb-2 text-center'>
                Selecciona tus fechas de viaje
              </h3>
              <p className='text-blue-600 text-center'>
                Elige las fechas en el calendario para comenzar a planificar tu
                itinerario personalizado.
              </p>
            </div>
          )}
        </div>
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
          whileHover={
            dateRange?.from && dateRange?.to && guests ? { scale: 1.03 } : {}
          }
          whileTap={
            dateRange?.from && dateRange?.to && guests ? { scale: 0.98 } : {}
          }
        >
          Continuar
          <ArrowRight className='ml-2 h-5 w-5' />
        </motion.button>
      </div>
    </motion.div>
  );
};
