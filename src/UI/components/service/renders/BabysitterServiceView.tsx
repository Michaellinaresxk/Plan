// views/BabysitterServiceView.tsx

import React from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { Service } from '@/types/type';
import { ServiceData } from '@/types/services';
import {
  Clock,
  Calendar,
  Users,
  Shield,
  Heart,
  Info,
  Check,
} from 'lucide-react';

interface BabysitterServiceViewProps {
  service: Service;
  serviceData?: ServiceData;
  primaryColor: string;
}

const BabysitterServiceView: React.FC<BabysitterServiceViewProps> = ({
  service,
  serviceData,
  primaryColor,
}) => {
  const { t } = useTranslation();

  // Crear adaptador de datos para mantener compatibilidad con el renderizador existente
  const extendedData = {
    minimumBooking: serviceData?.metaData?.minimumBooking?.toString() || '',
    availability: serviceData?.metaData?.availability?.toString() || '',
    ageRange: serviceData?.metaData?.ageRange?.toString() || '',
    safetyStandards: serviceData?.metaData?.safetyStandards
      ? (serviceData.metaData.safetyStandards as string).split(',')
      : [],
    timeSlots: serviceData?.options?.timeSlot?.subOptions
      ? Object.values(serviceData.options.timeSlot.subOptions).map((opt: any) =>
          t(opt.nameKey)
        )
      : [],
    includes: serviceData?.includes?.map((key: string) => t(key)) || [],
    notIncluded: serviceData?.notIncluded?.map((key: string) => t(key)) || [],
    itinerary: serviceData?.itinerary?.map((key: string) => t(key)) || [],
    disclaimer: serviceData?.disclaimer ? t(serviceData.disclaimer) : undefined,
    tagline: t('services.babysitter.tagline', {
      defaultValue: 'Your Peace of Mind. Their Happiness.',
    }),
    fullDescription: t(
      serviceData?.fullDescriptionKey || serviceData?.descriptionKey || ''
    ),
  };

  return (
    <div className='space-y-8'>
      <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
        <div className='p-6 md:p-8'>
          <h2 className='text-2xl font-bold text-gray-900 mb-2'>
            {extendedData.tagline || 'Your Peace of Mind. Their Happiness.'}
          </h2>
          <p className='text-lg text-gray-700 mb-6'>
            {extendedData.fullDescription ||
              'Trust our experienced, background-checked babysitters to care for your little ones.'}
          </p>

          <div className='grid md:grid-cols-2 gap-6'>
            <div>
              <h3 className='text-lg font-semibold text-gray-800 mb-4 flex items-center'>
                <Clock className={`mr-2 text-${primaryColor}-500`} size={20} />
                {t('services.booking.information')}
              </h3>

              <div className='space-y-3'>
                <div className='flex items-start'>
                  <div
                    className={`h-6 w-6 rounded-full bg-${primaryColor}-100 flex items-center justify-center mr-3 flex-shrink-0`}
                  >
                    <Clock className={`h-3.5 w-3.5 text-${primaryColor}-600`} />
                  </div>
                  <div>
                    <p className='font-medium text-gray-700'>
                      {t('services.booking.minimum')}
                    </p>
                    <p className='text-gray-600 text-sm'>
                      {extendedData.minimumBooking}
                    </p>
                  </div>
                </div>

                <div className='flex items-start'>
                  <div
                    className={`h-6 w-6 rounded-full bg-${primaryColor}-100 flex items-center justify-center mr-3 flex-shrink-0`}
                  >
                    <Calendar
                      className={`h-3.5 w-3.5 text-${primaryColor}-600`}
                    />
                  </div>
                  <div>
                    <p className='font-medium text-gray-700'>
                      {t('services.booking.availability')}
                    </p>
                    <p className='text-gray-600 text-sm'>
                      {extendedData.availability}
                    </p>
                  </div>
                </div>

                <div className='flex items-start'>
                  <div
                    className={`h-6 w-6 rounded-full bg-${primaryColor}-100 flex items-center justify-center mr-3 flex-shrink-0`}
                  >
                    <Users className={`h-3.5 w-3.5 text-${primaryColor}-600`} />
                  </div>
                  <div>
                    <p className='font-medium text-gray-700'>
                      {t('services.babysitter.ageRange')}
                    </p>
                    <p className='text-gray-600 text-sm'>
                      {extendedData.ageRange}
                    </p>
                  </div>
                </div>

                <div className='flex items-start'>
                  <div
                    className={`h-6 w-6 rounded-full bg-${primaryColor}-100 flex items-center justify-center mr-3 flex-shrink-0`}
                  >
                    <Shield
                      className={`h-3.5 w-3.5 text-${primaryColor}-600`}
                    />
                  </div>
                  <div>
                    <p className='font-medium text-gray-700'>
                      {t('services.babysitter.safetyStandards')}
                    </p>
                    <p className='text-gray-600 text-sm'>
                      {extendedData.safetyStandards?.join(', ')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className='text-lg font-semibold text-gray-800 mb-4 flex items-center'>
                <Heart className={`mr-2 text-${primaryColor}-500`} size={20} />
                {t('services.common.options')}
              </h3>

              <div className='grid grid-cols-1 gap-2'>
                {extendedData.timeSlots?.map((option, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg bg-${primaryColor}-50 border border-${primaryColor}-100`}
                  >
                    <p className='font-medium text-gray-800 flex items-center'>
                      <Check
                        className={`mr-2 h-4 w-4 text-${primaryColor}-500`}
                      />
                      {option}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* What's Included Section */}
      <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
        <div className='p-6 md:p-8'>
          <h3 className='text-xl font-bold text-gray-900 mb-6'>
            {t('services.common.whatsIncluded')}
          </h3>

          <div className='grid md:grid-cols-2 gap-8'>
            <div>
              <h4 className='text-lg font-semibold text-gray-800 mb-4 flex items-center'>
                <Check className={`mr-2 text-${primaryColor}-500`} size={18} />
                {t('services.common.includedInService')}
              </h4>

              <ul className='space-y-3'>
                {extendedData.includes?.map((item, index) => (
                  <li key={index} className='flex items-start'>
                    <div
                      className={`mt-1 h-5 w-5 rounded-full bg-${primaryColor}-100 flex items-center justify-center mr-3 flex-shrink-0`}
                    >
                      <Check className={`h-3 w-3 text-${primaryColor}-600`} />
                    </div>
                    <span className='text-gray-700'>{item}</span>
                  </li>
                ))}
              </ul>

              {extendedData.notIncluded &&
                extendedData.notIncluded.length > 0 && (
                  <div className='mt-6'>
                    <h4 className='text-lg font-semibold text-gray-800 mb-4 flex items-center'>
                      <DollarSign
                        className={`mr-2 text-${primaryColor}-500`}
                        size={18}
                      />
                      {t('services.common.notIncluded')}
                    </h4>

                    <ul className='space-y-3'>
                      {extendedData.notIncluded.map((item, index) => (
                        <li
                          key={index}
                          className='flex items-start text-gray-700'
                        >
                          <div className='mt-1 h-5 w-5 flex items-center justify-center mr-3 flex-shrink-0'>
                            <span className='text-sm font-medium'>•</span>
                          </div>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>

            <div>
              <h4 className='text-lg font-semibold text-gray-800 mb-4'>
                {t('services.common.whatToExpect')}
              </h4>

              <ol className='space-y-4'>
                {extendedData.itinerary?.map((step, index) => (
                  <li key={index} className='flex items-start'>
                    <div
                      className={`mt-0.5 h-6 w-6 rounded-full bg-${primaryColor}-500 text-white flex items-center justify-center mr-3 flex-shrink-0 font-medium text-sm`}
                    >
                      {index + 1}
                    </div>
                    <span className='text-gray-700'>{step}</span>
                  </li>
                ))}
              </ol>

              {extendedData.disclaimer && (
                <div className='mt-6 p-4 bg-amber-50 rounded-lg border border-amber-100'>
                  <h4 className='font-medium text-amber-800 mb-2'>
                    {t('services.common.importantNote')}
                  </h4>
                  <p className='text-amber-700 text-sm'>
                    {extendedData.disclaimer}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BabysitterServiceView;
