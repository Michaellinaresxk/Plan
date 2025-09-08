import React from 'react';
import {
  Navigation,
  CheckCircle,
  AlertTriangle,
  MapPin,
  Clock,
} from 'lucide-react';

// Usa los mismos datos que ya tienes en tu constants
const DESTINATION_ZONES = [
  {
    id: 'punta-cana-center',
    name: 'Punta Cana Center',
    description: 'Main tourist area with hotels and resorts',
    landmarks: ['Hard Rock Hotel', 'Bavaro Beach', 'Downtown Punta Cana'],
    basePrice: 30,
    estimatedTime: '15-20 min',
    isPopular: true,
  },
  {
    id: 'bavaro',
    name: 'Bavaro',
    description: 'Beach area with luxury resorts',
    landmarks: ['Bavaro Beach', 'Iberostar', 'Natura Park'],
    basePrice: 35,
    estimatedTime: '20-25 min',
    isPopular: true,
  },
  {
    id: 'cap-cana',
    name: 'Cap Cana',
    description: 'Exclusive luxury resort area',
    landmarks: ['Marina Cap Cana', 'Eden Roc', 'Fishing Lodge'],
    basePrice: 40,
    estimatedTime: '25-30 min',
    isPopular: true,
  },
  {
    id: 'uvero-alto',
    name: 'Uvero Alto',
    description: 'Northern coast resort area',
    landmarks: ['Secrets Royal Beach', 'Excellence Punta Cana'],
    basePrice: 60,
    estimatedTime: '35-45 min',
    isPopular: false,
  },
  {
    id: 'la-romana',
    name: 'La Romana',
    description: 'Historic town with cultural attractions',
    landmarks: ['Casa de Campo', 'Altos de Chavón'],
    basePrice: 90,
    estimatedTime: '1.5-2 hours',
    isPopular: true,
  },
  {
    id: 'bayahibe',
    name: 'Bayahíbe',
    description: 'Port for Saona Island excursions',
    landmarks: ['Bayahíbe Beach', 'Saona Ferry Terminal'],
    basePrice: 100,
    estimatedTime: '1.5-2 hours',
    isPopular: true,
  },
  {
    id: 'santo-domingo',
    name: 'Santo Domingo',
    description: 'Capital city - premium service',
    landmarks: ['Colonial Zone', 'Malecón', 'Airport'],
    basePrice: 150,
    estimatedTime: '2.5-3 hours',
    isPopular: false,
  },
];

interface DestinationZoneSelectorProps {
  selectedDestination: string;
  onDestinationSelect: (zoneId: string) => void;
  error?: string;
}

const DestinationZoneSelector: React.FC<DestinationZoneSelectorProps> = ({
  selectedDestination,
  onDestinationSelect,
  error,
}) => {
  return (
    <div className='bg-blue-50 p-6 rounded-xl border border-blue-100 shadow-sm'>
      <label className='flex items-center text-sm font-medium text-blue-800 mb-4'>
        <Navigation className='w-5 h-5 mr-2 text-blue-600' />
        Select destination zone *
      </label>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {DESTINATION_ZONES.map((zone) => (
          <div
            key={zone.id}
            className={`
              border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md
              ${
                selectedDestination === zone.id
                  ? 'border-blue-500 bg-white shadow-lg ring-2 ring-blue-200'
                  : 'border-blue-200 bg-white hover:border-blue-300 hover:bg-blue-25'
              }
            `}
            onClick={() => onDestinationSelect(zone.id)}
          >
            <div className='flex items-start justify-between mb-3'>
              <div className='flex items-start'>
                <div
                  className={`
                    w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 mt-0.5 transition-all
                    ${
                      selectedDestination === zone.id
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-blue-300'
                    }
                  `}
                >
                  {selectedDestination === zone.id && (
                    <CheckCircle className='w-4 h-4 text-white' />
                  )}
                </div>
                <div className='flex-1'>
                  <div className='flex items-center mb-1'>
                    <MapPin className='w-4 h-4 mr-2 text-blue-500' />
                    <span className='font-medium text-blue-900 text-sm'>
                      {zone.name}
                    </span>
                  </div>
                  {zone.isPopular && (
                    <span className='inline-block mb-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full'>
                      Popular
                    </span>
                  )}
                  <p className='text-xs text-gray-600 mb-2'>
                    {zone.description}
                  </p>
                </div>
              </div>

              <div className='text-right'>
                <div className='text-sm font-semibold text-green-600'>
                  ${zone.basePrice}
                </div>
                <div className='text-xs text-gray-500 flex items-center'>
                  <Clock className='w-3 h-3 mr-1' />
                  {zone.estimatedTime}
                </div>
              </div>
            </div>

            <div className='text-xs text-gray-500 border-t border-gray-100 pt-2'>
              <span className='font-medium'>Landmarks: </span>
              {zone.landmarks.slice(0, 2).join(', ')}
              {zone.landmarks.length > 2 && '...'}
            </div>
          </div>
        ))}
      </div>

      {error && (
        <p className='text-red-500 text-xs mt-3 flex items-center'>
          <AlertTriangle className='w-3 h-3 mr-1' />
          {error}
        </p>
      )}
    </div>
  );
};

export default DestinationZoneSelector;
