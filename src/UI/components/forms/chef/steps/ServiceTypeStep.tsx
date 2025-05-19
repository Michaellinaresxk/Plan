import React from 'react';
import { Calendar, CalendarRange, Check } from 'lucide-react';
import { serviceTypes } from '@/utils/chefFormUtils';

interface ServiceTypeStepProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  errors: Record<string, string>;
}

const ServiceTypeStep: React.FC<ServiceTypeStepProps> = ({
  formData,
  onChange,
  errors,
}) => {
  return (
    <div className='space-y-6'>
      <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2 flex items-center'>
        <Calendar className='w-5 h-5 mr-2 text-amber-600' />
        Service Type
      </h3>

      <div className='space-y-4'>
        <p className='text-gray-600'>
          Please select the type of chef service you would like to book:
        </p>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-4'>
          {serviceTypes.map((type) => (
            <div
              key={type.id}
              onClick={() => onChange('serviceType', type.id)}
              className={`
                p-6 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md
                ${
                  formData.serviceType === type.id
                    ? 'border-amber-500 bg-amber-50'
                    : 'border-gray-200 hover:border-amber-300'
                }
              `}
            >
              <div className='flex justify-between items-start'>
                <div>
                  <h4 className='font-medium text-lg text-gray-900 flex items-center'>
                    {type.id === 'single' ? (
                      <Calendar className='w-5 h-5 mr-2 text-amber-600' />
                    ) : (
                      <CalendarRange className='w-5 h-5 mr-2 text-amber-600' />
                    )}
                    {type.name}
                  </h4>
                  <p className='text-gray-600 mt-2'>{type.description}</p>
                </div>

                {formData.serviceType === type.id && (
                  <div className='w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center ml-2'>
                    <Check className='w-4 h-4 text-white' />
                  </div>
                )}
              </div>

              {type.id === 'single' && (
                <div className='mt-4 bg-amber-50/50 p-3 rounded-lg text-sm text-amber-700'>
                  Perfect for a special occasion or a one-time dining experience
                </div>
              )}

              {type.id === 'multiple' && (
                <div className='mt-4 bg-amber-50/50 p-3 rounded-lg text-sm text-amber-700'>
                  Ideal for vacation stays or extended visits
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceTypeStep;
