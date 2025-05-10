import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { Service } from '@/types/type';
import {
  Plane,
  Truck,
  AlertCircle,
  Check,
  Clock,
  MapPin,
  Calendar,
} from 'lucide-react';
import ServiceManager from '@/constants/services/ServiceManager';

interface AirportTransferFormProps {
  service: Service;
  onSubmit: (formData: any) => void;
  onCancel: () => void;
}

const AirportTransferForm: React.FC<AirportTransferFormProps> = ({
  service,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    date: '',
    airline: '',
    flightNumber: '',
    arrivalTime: '',
    passengerCount: 1,
    transportProvider: '',
    vehicleType: 'vanSmall',
    isRoundTrip: false,
    returnFlightNumber: '',
    returnDepartureTime: '',
    specialRequests: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [totalPrice, setTotalPrice] = useState(service.price);

  // Get full service data and extended details
  const serviceData = ServiceManager.getData(service.id);
  const extendedDetails = ServiceManager.getDetails(service.id);

  // Get vehicle options
  const vehicleOptions = serviceData?.options?.vehicleType?.subOptions || {};

  // ... (resto de tu código existente)

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      {/* Service Information Section */}
      <div className='space-y-4'>
        <h3 className='text-lg font-bold text-gray-900'>
          {serviceData?.titleKey ? t(serviceData.titleKey) : service.name}
        </h3>

        <p className='text-sm text-gray-600'>
          {serviceData?.descriptionKey
            ? t(serviceData.descriptionKey)
            : service.description}
        </p>

        {/* Travel Time and Availability */}
        {extendedDetails?.travelTime && (
          <div className='flex items-center text-sm text-gray-600'>
            <Clock className='h-4 w-4 text-blue-500 mr-2' />
            <span>{extendedDetails.travelTime}</span>
          </div>
        )}

        {extendedDetails?.availability && (
          <div className='flex items-center text-sm text-gray-600'>
            <Calendar className='h-4 w-4 text-blue-500 mr-2' />
            <span>{extendedDetails.availability}</span>
          </div>
        )}
      </div>

      {/* What's Included Section */}
      {extendedDetails?.includes && extendedDetails.includes.length > 0 && (
        <div className='bg-gray-50 rounded-lg p-4'>
          <h4 className='font-medium text-gray-800 mb-3 flex items-center'>
            <Check className='h-5 w-5 text-green-500 mr-2' />
            {t('services.common.whatsIncluded')}
          </h4>
          <ul className='space-y-2'>
            {extendedDetails.includes.map((item, index) => (
              <li
                key={index}
                className='flex items-start text-sm text-gray-700'
              >
                <Check className='h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0' />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Itinerary Section */}
      {extendedDetails?.itinerary && extendedDetails.itinerary.length > 0 && (
        <div className='bg-blue-50 rounded-lg p-4'>
          <h4 className='font-medium text-gray-800 mb-3 flex items-center'>
            <MapPin className='h-5 w-5 text-blue-500 mr-2' />
            {t('services.common.whatToExpect')}
          </h4>
          <ol className='space-y-2'>
            {extendedDetails.itinerary.map((step, index) => (
              <li
                key={index}
                className='flex items-start text-sm text-gray-700'
              >
                <span className='bg-blue-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 flex-shrink-0'>
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Booking Date Selection */}
      <div className='form-group'>
        <label className='block text-sm font-medium text-gray-700 mb-1'>
          {t('services.airportTransfer.form.serviceDate')} *
        </label>
        <input
          type='date'
          name='date'
          value={formData.date}
          onChange={handleChange}
          min={new Date().toISOString().split('T')[0]}
          className={`w-full p-2 border rounded-md ${
            errors.date ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.date && (
          <p className='text-red-500 text-xs mt-1'>{errors.date}</p>
        )}
      </div>

      {/* Provider selection */}
      <div className='form-group'>
        <label className='block text-sm font-medium text-gray-700 mb-1'>
          {t('services.airportTransfer.form.transportProvider')} *
        </label>
        <select
          name='transportProvider'
          value={formData.transportProvider}
          onChange={handleChange}
          className={`w-full p-2 border rounded-md ${
            errors.transportProvider ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value=''>{t('form.selectOption')}</option>
          {serviceData?.metaData?.providers &&
          Array.isArray(serviceData.metaData.providers) ? (
            serviceData.metaData.providers.map((provider, index) => (
              <option key={index} value={provider}>
                {provider}
              </option>
            ))
          ) : (
            <>
              <option value='provider1'>Provider 1</option>
              <option value='provider2'>Provider 2</option>
            </>
          )}
        </select>
        {errors.transportProvider && (
          <p className='text-red-500 text-xs mt-1'>
            {errors.transportProvider}
          </p>
        )}
      </div>

      {/* Vehicle type selection */}
      <div className='border rounded-md p-4 bg-gray-50'>
        <h4 className='font-medium text-gray-800 mb-3 flex items-center'>
          <Truck className='h-5 w-5 text-blue-500 mr-2' />
          {t('services.airportTransfer.form.vehicleOptions')}
        </h4>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {Object.entries(vehicleOptions).map(([key, option]) => {
            if (typeof option !== 'object' || !('capacityInfo' in option)) {
              return null;
            }

            const capacity = option.capacityInfo;
            const isSelected = formData.vehicleType === key;
            const price = capacity.price;

            return (
              <div
                key={key}
                className={`border p-3 rounded-lg cursor-pointer transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 shadow-sm'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() =>
                  setFormData((prev) => ({ ...prev, vehicleType: key }))
                }
              >
                <div className='flex justify-between'>
                  <div>
                    <div className='flex items-center'>
                      <input
                        type='radio'
                        value={key}
                        checked={isSelected}
                        readOnly
                        className='mr-2'
                      />
                      <p className='font-medium'>
                        {option.nameKey ? t(option.nameKey) : key}
                      </p>
                    </div>
                    <p className='text-sm text-gray-600 ml-6'>
                      {getVehicleCapacityText(key)}
                    </p>
                    {option.descriptionKey && (
                      <p className='text-xs text-gray-500 mt-1 ml-6'>
                        {t(option.descriptionKey)}
                      </p>
                    )}
                  </div>
                  <div className='text-blue-600 font-medium'>${price}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Round trip option */}
        <div className='mt-4'>
          <div className='flex items-center'>
            <input
              type='checkbox'
              id='isRoundTrip'
              name='isRoundTrip'
              checked={formData.isRoundTrip}
              onChange={handleChange}
              className='h-4 w-4 text-blue-600 focus:ring-blue-500'
            />
            <label htmlFor='isRoundTrip' className='ml-2 text-sm text-gray-700'>
              {t('services.airportTransfer.form.roundTrip')}
            </label>
          </div>
        </div>
      </div>

      {/* Flight Details */}
      <div className='border rounded-md p-4'>
        <h4 className='font-medium text-gray-800 mb-3 flex items-center'>
          <Plane className='h-5 w-5 text-blue-500 mr-2' />
          {t('services.airportTransfer.form.flightDetails')}
        </h4>

        {/* ... (resto de tu código de flight details) */}
      </div>

      {/* Safety Standards if available */}
      {extendedDetails?.safetyStandards &&
        extendedDetails.safetyStandards.length > 0 && (
          <div className='bg-amber-50 border border-amber-100 rounded-md p-4'>
            <h5 className='font-medium text-gray-800 mb-2'>
              {t('services.common.safetyStandards')}
            </h5>
            <ul className='text-sm text-gray-600 space-y-1'>
              {extendedDetails.safetyStandards.map((standard, index) => (
                <li key={index} className='flex items-start'>
                  <Clock className='h-4 w-4 text-amber-500 mr-2 mt-0.5 flex-shrink-0' />
                  <span>{standard}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

      {/* Important Information */}
      {extendedDetails?.disclaimer && (
        <div className='bg-blue-50 border border-blue-100 rounded-md p-4'>
          <div className='flex'>
            <AlertCircle className='h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5' />
            <div>
              <h5 className='font-medium text-gray-800 mb-1'>
                {t('services.common.importantNote')}
              </h5>
              <p className='text-sm text-gray-600'>
                {extendedDetails.disclaimer}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Form actions */}
      <div className='flex justify-end space-x-3'>
        <button
          type='button'
          onClick={onCancel}
          className='px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors'
        >
          {t('common.cancel')}
        </button>

        <button
          type='submit'
          className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'
        >
          {t('common.confirm')} - ${totalPrice}
        </button>
      </div>
    </form>
  );
};

export default AirportTransferForm;
