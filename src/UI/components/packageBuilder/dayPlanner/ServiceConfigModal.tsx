// dayPlanner/components/ServiceConfigModal.tsx
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { X, Clock, DollarSign, Plus, Minus } from 'lucide-react';
import { Service } from '@/types/type';
import { ConfiguringService } from '@/constants/dayplanner';

interface ServiceConfigModalProps {
  service: Service | undefined;
  configuration: ConfiguringService;
  onConfirm: () => void;
  onCancel: () => void;
  onIncrementGuests: () => void;
  onDecrementGuests: () => void;
}

export const ServiceConfigModal: React.FC<ServiceConfigModalProps> = ({
  service,
  configuration,
  onConfirm,
  onCancel,
  onIncrementGuests,
  onDecrementGuests,
}) => {
  if (!service) return null;

  const totalPrice = service.price * configuration.guestCount;

  return (
    <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className='bg-white rounded-2xl shadow-2xl max-w-md w-full p-8'
      >
        <div className='flex justify-between items-center mb-6'>
          <h3 className='text-2xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
            Configurar actividad
          </h3>
          <motion.button
            onClick={onCancel}
            className='p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600'
            whileHover={{ scale: 1.1, backgroundColor: '#F3F4F6' }}
            whileTap={{ scale: 0.95 }}
          >
            <X size={20} />
          </motion.button>
        </div>

        <div className='flex items-center mb-6'>
          <div className='h-16 w-16 relative overflow-hidden rounded-xl mr-4 shadow-md'>
            <Image
              src={service.img || `/images/services/${service.id}.jpg`}
              alt={service.name}
              fill
              className='object-cover'
              unoptimized={service.img?.startsWith('http')}
            />
          </div>
          <div>
            <p className='font-semibold text-xl text-gray-900'>
              {service.name}
            </p>
            <div className='flex items-center text-gray-500 mt-1'>
              <Clock className='mr-2 h-4 w-4 text-blue-500' />
              <span>{configuration.timeSlot}</span>
            </div>
          </div>
        </div>

        <div className='bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl mb-6 border border-blue-100'>
          <p className='font-semibold text-lg text-gray-800 mb-4'>
            ¿Cuántas personas participarán?
          </p>

          <div className='flex items-center'>
            <motion.button
              onClick={onDecrementGuests}
              disabled={configuration.guestCount <= 1}
              className={`
                p-3 rounded-xl border ${
                  configuration.guestCount <= 1
                    ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                    : 'border-gray-300 text-gray-600 hover:bg-white hover:border-blue-300'
                }
                transition-colors
              `}
            >
              <Minus size={20} />
            </motion.button>

            <div className='flex-1 mx-6 text-center'>
              <span className='text-3xl font-bold text-blue-600'>
                {configuration.guestCount}
              </span>
              <p className='text-sm text-gray-500 mt-1'>
                {configuration.guestCount === 1 ? 'persona' : 'personas'}
              </p>
            </div>

            <motion.button
              onClick={onIncrementGuests}
              disabled={configuration.guestCount >= 10}
              className={`
                p-3 rounded-xl border ${
                  configuration.guestCount >= 10
                    ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                    : 'border-gray-300 text-gray-600 hover:bg-white hover:border-blue-300'
                }
                transition-colors
              `}
            >
              <Plus size={20} />
            </motion.button>
          </div>

          <div className='mt-6 pt-4 border-t border-blue-200 flex justify-between items-center'>
            <p className='font-medium text-gray-700'>Precio total:</p>
            <p className='text-2xl font-bold text-blue-600'>${totalPrice}</p>
          </div>

          <div className='mt-2 text-sm text-gray-500 flex items-center justify-end'>
            <DollarSign className='h-4 w-4 mr-1 text-gray-400' />$
            {service.price} x {configuration.guestCount} personas
          </div>
        </div>

        <div className='flex gap-4'>
          <motion.button
            onClick={onCancel}
            className='flex-1 py-3 px-4 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-medium'
          >
            Cancelar
          </motion.button>

          <motion.button
            onClick={onConfirm}
            className='flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 font-medium shadow-md hover:shadow-lg'
          >
            Confirmar
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
