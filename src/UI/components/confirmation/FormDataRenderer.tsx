// components/confirmation/FormDataRenderer.tsx
import React from 'react';
import { useTranslation } from '@/lib/i18n/client';
import {
  Calendar,
  Clock,
  Users,
  Plane,
  Baby,
  Car,
  MapPin,
  Info,
  CheckCircle,
  XCircle,
} from 'lucide-react';

interface FormDataRendererProps {
  formData: Record<string, any>;
  serviceId: string;
}

/**
 * Dynamic Form Data Renderer
 *
 * This component intelligently renders form data based on the service type
 * and field types, providing a clean, organized view of the user's selections.
 */
const FormDataRenderer: React.FC<FormDataRendererProps> = ({
  formData,
  serviceId,
}) => {
  const { t } = useTranslation();

  // Field mappings for better display
  const getFieldIcon = (key: string, value: any) => {
    const iconMap: Record<string, React.ReactNode> = {
      date: <Calendar className='w-4 h-4' />,
      returnDate: <Calendar className='w-4 h-4' />,
      startTime: <Clock className='w-4 h-4' />,
      endTime: <Clock className='w-4 h-4' />,
      flightNumber: <Plane className='w-4 h-4' />,
      returnFlightNumber: <Plane className='w-4 h-4' />,
      passengerCount: <Users className='w-4 h-4' />,
      guestCount: <Users className='w-4 h-4' />,
      childrenCount: <Baby className='w-4 h-4' />,
      kidsCount: <Baby className='w-4 h-4' />,
      vehicleType: <Car className='w-4 h-4' />,
      location: <MapPin className='w-4 h-4' />,
    };

    return iconMap[key] || <Info className='w-4 h-4' />;
  };

  // Get field labels with translations
  const getFieldLabel = (key: string, serviceId: string): string => {
    const labelMap: Record<string, string> = {
      // Common fields
      date: t('form.labels.date', { fallback: 'Date' }),
      startTime: t('form.labels.startTime', { fallback: 'Start Time' }),
      endTime: t('form.labels.endTime', { fallback: 'End Time' }),
      location: t('form.labels.location', { fallback: 'Location' }),
      guestCount: t('form.labels.guests', { fallback: 'Guests' }),

      // Airport transfer specific
      flightNumber: t('services.airportTransfer.form.flightNumber', {
        fallback: 'Flight Number',
      }),
      returnDate: t('services.airportTransfer.form.returnDate', {
        fallback: 'Return Date',
      }),
      returnFlightNumber: t(
        'services.airportTransfer.form.returnFlightNumber',
        { fallback: 'Return Flight' }
      ),
      passengerCount: t('services.airportTransfer.form.passengers', {
        fallback: 'Passengers',
      }),
      kidsCount: t('services.airportTransfer.form.kids', {
        fallback: 'Children',
      }),
      vehicleType: t('services.airportTransfer.form.vehicleType', {
        fallback: 'Vehicle Type',
      }),
      isRoundTrip: t('services.airportTransfer.form.roundTrip', {
        fallback: 'Round Trip',
      }),
      needsCarSeat: t('services.airportTransfer.form.needsCarSeat', {
        fallback: 'Car Seat Required',
      }),
      carSeatCount: t('services.airportTransfer.form.carSeatCount', {
        fallback: 'Car Seats',
      }),

      // Babysitter specific
      childrenCount: t('services.babysitter.form.childrenCount', {
        fallback: 'Number of Children',
      }),
      childrenAges: t('services.babysitter.form.childrenAges', {
        fallback: 'Children Ages',
      }),
      hasSpecialNeeds: t('services.babysitter.form.specialNeeds', {
        fallback: 'Special Needs',
      }),
      specialNeedsDetails: t('services.babysitter.form.specialNeedsDetails', {
        fallback: 'Special Needs Details',
      }),
      specialRequests: t('services.babysitter.form.specialRequests', {
        fallback: 'Special Requests',
      }),
    };

    return (
      labelMap[key] ||
      key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')
    );
  };

  // Format values for better display
  const formatValue = (key: string, value: any): React.ReactNode => {
    if (value === null || value === undefined || value === '') {
      return <span className='text-gray-400 italic'>Not specified</span>;
    }

    // Boolean values
    if (typeof value === 'boolean') {
      return (
        <span
          className={`flex items-center ${
            value ? 'text-green-600' : 'text-gray-500'
          }`}
        >
          {value ? (
            <CheckCircle className='w-4 h-4 mr-1' />
          ) : (
            <XCircle className='w-4 h-4 mr-1' />
          )}
          {value ? 'Yes' : 'No'}
        </span>
      );
    }

    // Arrays (like children ages)
    if (Array.isArray(value)) {
      return (
        <div className='flex flex-wrap gap-1'>
          {value
            .filter((item) => item !== '')
            .map((item, index) => (
              <span
                key={index}
                className='inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full'
              >
                {item}
              </span>
            ))}
        </div>
      );
    }

    // Date formatting
    if (key.includes('date') || key.includes('Date')) {
      try {
        const date = new Date(value);
        return date.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      } catch {
        return value;
      }
    }

    // Time formatting
    if (key.includes('time') || key.includes('Time')) {
      try {
        const [hours, minutes] = value.split(':');
        const date = new Date();
        date.setHours(parseInt(hours), parseInt(minutes));
        return date.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        });
      } catch {
        return value;
      }
    }

    // Vehicle type formatting
    if (key === 'vehicleType') {
      return (
        <span className='capitalize bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm'>
          {value
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, (str) => str.toUpperCase())}
        </span>
      );
    }

    // Numeric values with context
    if (typeof value === 'number') {
      if (key.includes('Count') || key.includes('count')) {
        return (
          <span className='font-medium text-blue-600'>
            {value} {value === 1 ? 'person' : 'people'}
          </span>
        );
      }
    }

    // Long text values (textarea content)
    if (typeof value === 'string' && value.length > 100) {
      return (
        <div className='bg-gray-50 p-3 rounded-lg border'>
          <p className='text-sm text-gray-700 whitespace-pre-wrap'>{value}</p>
        </div>
      );
    }

    return <span className='font-medium'>{value}</span>;
  };

  // Group fields by category for better organization
  const categorizeFields = (formData: Record<string, any>) => {
    const categories = {
      'Schedule & Timing': ['date', 'startTime', 'endTime', 'returnDate'],
      'Flight Information': [
        'flightNumber',
        'returnFlightNumber',
        'isRoundTrip',
      ],
      'Passenger Details': [
        'passengerCount',
        'guestCount',
        'childrenCount',
        'kidsCount',
        'childrenAges',
      ],
      'Vehicle & Equipment': ['vehicleType', 'needsCarSeat', 'carSeatCount'],
      'Location & Logistics': ['location'],
      'Special Requirements': [
        'hasSpecialNeeds',
        'specialNeedsDetails',
        'specialRequests',
      ],
      'Additional Information': [],
    };

    const categorizedData: Record<string, Array<[string, any]>> = {};
    const usedKeys = new Set<string>();

    // Categorize known fields
    Object.entries(categories).forEach(([category, keys]) => {
      const categoryData = keys
        .filter((key) => key in formData)
        .map((key) => {
          usedKeys.add(key);
          return [key, formData[key]] as [string, any];
        });

      if (categoryData.length > 0) {
        categorizedData[category] = categoryData;
      }
    });

    // Add remaining fields to "Additional Information"
    const remainingFields = Object.entries(formData)
      .filter(([key]) => !usedKeys.has(key))
      .filter(
        ([, value]) => value !== null && value !== undefined && value !== ''
      );

    if (remainingFields.length > 0) {
      categorizedData['Additional Information'] = remainingFields;
    }

    return categorizedData;
  };

  const categorizedData = categorizeFields(formData);

  return (
    <div className='space-y-6'>
      {Object.entries(categorizedData).map(([category, fields]) => (
        <div key={category} className='bg-gray-50 rounded-lg p-4'>
          <h4 className='font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide'>
            {category}
          </h4>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
            {fields.map(([key, value]) => (
              <div
                key={key}
                className='flex items-start space-x-3 p-3 bg-white rounded-md shadow-sm'
              >
                <div className='flex-shrink-0 mt-0.5 text-gray-400'>
                  {getFieldIcon(key, value)}
                </div>
                <div className='flex-grow min-w-0'>
                  <p className='text-sm font-medium text-gray-500 mb-1'>
                    {getFieldLabel(key, serviceId)}
                  </p>
                  <div className='text-sm text-gray-900'>
                    {formatValue(key, value)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {Object.keys(categorizedData).length === 0 && (
        <div className='text-center py-8 text-gray-500'>
          <Info className='w-8 h-8 mx-auto mb-2 opacity-50' />
          <p>No booking details available</p>
        </div>
      )}
    </div>
  );
};

export default FormDataRenderer;
