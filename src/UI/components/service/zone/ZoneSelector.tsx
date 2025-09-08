import React from 'react';
import { MapPin, CheckCircle, AlertTriangle } from 'lucide-react';
import { Zone } from '@/constants/zone';

interface ZoneSelectorProps {
  label: string;
  zones: Zone[];
  selectedZone: string;
  onZoneSelect: (zoneId: string) => void;
  error?: string;
  colorScheme?: 'emerald' | 'blue' | 'purple';
  icon?: React.ElementType;
}

const ZoneSelector: React.FC<ZoneSelectorProps> = ({
  label,
  zones,
  selectedZone,
  onZoneSelect,
  error,
  colorScheme = 'emerald',
  icon: Icon = MapPin,
}) => {
  const colorClasses = {
    emerald: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
      label: 'text-emerald-800',
      icon: 'text-emerald-600',
      selectedBorder: 'border-emerald-500',
      selectedBg: 'bg-white',
      selectedRing: 'ring-emerald-200',
      zoneBorder: 'border-emerald-200',
      zoneHover: 'hover:border-emerald-300 hover:bg-emerald-25',
      zoneSelected: 'border-emerald-500 bg-emerald-500',
      zoneIcon: 'text-emerald-500',
      zoneText: 'text-emerald-900',
    },
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-100',
      label: 'text-blue-800',
      icon: 'text-blue-600',
      selectedBorder: 'border-blue-500',
      selectedBg: 'bg-white',
      selectedRing: 'ring-blue-200',
      zoneBorder: 'border-blue-200',
      zoneHover: 'hover:border-blue-300 hover:bg-blue-25',
      zoneSelected: 'border-blue-500 bg-blue-500',
      zoneIcon: 'text-blue-500',
      zoneText: 'text-blue-900',
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-100',
      label: 'text-purple-800',
      icon: 'text-purple-600',
      selectedBorder: 'border-purple-500',
      selectedBg: 'bg-white',
      selectedRing: 'ring-purple-200',
      zoneBorder: 'border-purple-200',
      zoneHover: 'hover:border-purple-300 hover:bg-purple-25',
      zoneSelected: 'border-purple-500 bg-purple-500',
      zoneIcon: 'text-purple-500',
      zoneText: 'text-purple-900',
    },
  };

  const colors = colorClasses[colorScheme];

  return (
    <div
      className={`${colors.bg} p-6 rounded-xl border ${colors.border} shadow-sm`}
    >
      <label
        className={`flex items-center text-sm font-medium ${colors.label} mb-4`}
      >
        <Icon className={`w-5 h-5 mr-2 ${colors.icon}`} />
        {label}
      </label>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {zones.map((zone) => (
          <div
            key={zone.id}
            className={`
              border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md
              ${
                selectedZone === zone.id
                  ? `${colors.selectedBorder} ${colors.selectedBg} shadow-lg ring-2 ${colors.selectedRing}`
                  : `${colors.zoneBorder} bg-white ${colors.zoneHover}`
              }
            `}
            onClick={() => onZoneSelect(zone.id)}
          >
            <div className='flex items-start justify-between mb-2'>
              <div className='flex items-center'>
                <div
                  className={`
                    w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 transition-all
                    ${
                      selectedZone === zone.id
                        ? colors.zoneSelected
                        : `border-gray-300`
                    }
                  `}
                >
                  {selectedZone === zone.id && (
                    <CheckCircle className='w-4 h-4 text-white' />
                  )}
                </div>
                <div>
                  <div className='flex items-center'>
                    <MapPin className={`w-4 h-4 mr-2 ${colors.zoneIcon}`} />
                    <span className={`font-medium ${colors.zoneText} text-sm`}>
                      {zone.displayName}
                    </span>
                  </div>
                  {zone.isPopular && (
                    <span className='inline-block mt-1 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full'>
                      Popular
                    </span>
                  )}
                </div>
              </div>
            </div>

            {zone.description && (
              <p className='text-xs text-gray-600 mb-2'>{zone.description}</p>
            )}

            {zone.landmarks && zone.landmarks.length > 0 && (
              <div className='text-xs text-gray-500'>
                <span className='font-medium'>Landmarks: </span>
                {zone.landmarks.slice(0, 2).join(', ')}
                {zone.landmarks.length > 2 && '...'}
              </div>
            )}
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

export default ZoneSelector;
