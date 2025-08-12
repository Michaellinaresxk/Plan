import React, { useState, useMemo } from 'react';
import {
  Building2,
  Search,
  CheckCircle,
  Info,
  MapPin,
  Plane,
} from 'lucide-react';
import { AIRLINE_TERMINAL_MAP, AirlineInfo } from '@/constants/airlines';

interface AirlineSelectorProps {
  name: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  error?: string;
  label?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const AirlineSelector: React.FC<AirlineSelectorProps> = ({
  name,
  value,
  onChange,
  error,
  label = 'Airline *',
  placeholder = 'Search or select airline...',
  className = '',
  disabled = false,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  // Get all airlines (mapped + additional)
  const allAirlines = useMemo(() => {
    const mappedAirlines = Object.keys(AIRLINE_TERMINAL_MAP);
    return [...mappedAirlines].sort();
  }, []);

  // Filter airlines based on search term
  const filteredAirlines = useMemo(() => {
    if (!searchTerm) return allAirlines;

    return allAirlines.filter(
      (airline) =>
        airline.toLowerCase().includes(searchTerm.toLowerCase()) ||
        AIRLINE_TERMINAL_MAP[airline]?.code
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, allAirlines]);

  // Get terminal info for selected airline
  const terminalInfo = useMemo((): AirlineInfo | null => {
    if (!value || !AIRLINE_TERMINAL_MAP[value]) {
      return null;
    }
    return AIRLINE_TERMINAL_MAP[value];
  }, [value]);

  const handleAirlineSelect = (airline: string) => {
    // Create synthetic event to maintain compatibility
    const syntheticEvent = {
      target: {
        name: name,
        value: airline,
        type: 'text',
      },
    } as React.ChangeEvent<HTMLInputElement>;

    onChange(syntheticEvent);
    setSearchTerm('');
    setIsDropdownOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;

    const inputValue = e.target.value;
    setSearchTerm(inputValue);
    setIsDropdownOpen(true);

    // If user types exact match, select it
    const exactMatch = allAirlines.find(
      (airline) => airline.toLowerCase() === inputValue.toLowerCase()
    );

    if (exactMatch) {
      handleAirlineSelect(exactMatch);
    } else if (inputValue === '') {
      const syntheticEvent = {
        target: {
          name: name,
          value: '',
          type: 'text',
        },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(syntheticEvent);
    }
  };

  const handleInputFocus = () => {
    if (!disabled) {
      setIsDropdownOpen(true);
    }
  };

  const handleInputBlur = () => {
    // Delay to allow selection click
    setTimeout(() => {
      setIsDropdownOpen(false);
    }, 200);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (e.key === 'Escape') {
      setIsDropdownOpen(false);
      setSearchTerm('');
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Main Input */}
      <div className='relative'>
        <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
          <Building2 className='w-4 h-4 mr-2 text-blue-700' />
          {label}
        </label>

        <div className='relative'>
          <input
            type='text'
            name={name}
            value={value || searchTerm}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className={`w-full p-3 pl-10 border ${
              error ? 'border-red-500' : 'border-gray-300'
            } rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-50 transition-colors
            ${
              disabled
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:border-gray-400'
            }`}
            autoComplete='off'
            aria-expanded={isDropdownOpen}
            aria-haspopup='listbox'
          />

          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />

          {value && (
            <CheckCircle className='absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500' />
          )}
        </div>

        {/* Dropdown */}
        {isDropdownOpen && filteredAirlines.length > 0 && !disabled && (
          <div
            className='absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto'
            role='listbox'
          >
            {filteredAirlines.map((airline) => {
              const airlineInfo = AIRLINE_TERMINAL_MAP[airline];
              const isSelected = value === airline;

              return (
                <div
                  key={airline}
                  onClick={() => handleAirlineSelect(airline)}
                  className={`p-3 cursor-pointer hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors ${
                    isSelected ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                  role='option'
                  aria-selected={isSelected}
                >
                  <div className='flex items-center justify-between'>
                    <div className='flex-1'>
                      <div className='flex items-center'>
                        <Plane className='w-4 h-4 text-gray-500 mr-2 flex-shrink-0' />
                        <span className='font-medium text-gray-900'>
                          {airline}
                        </span>
                        {airlineInfo?.code && (
                          <span className='ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded'>
                            {airlineInfo.code}
                          </span>
                        )}
                      </div>
                      {airlineInfo?.description && (
                        <p className='text-xs text-gray-500 mt-1 ml-6'>
                          {airlineInfo.description}
                        </p>
                      )}
                    </div>

                    {airlineInfo?.terminal && (
                      <div className='flex items-center ml-2 flex-shrink-0'>
                        <MapPin className='w-3 h-3 text-blue-600 mr-1' />
                        <span className='text-sm font-medium text-blue-700'>
                          Terminal {airlineInfo.terminal}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* No results message */}
        {isDropdownOpen &&
          filteredAirlines.length === 0 &&
          searchTerm &&
          !disabled && (
            <div className='absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-3'>
              <div className='text-sm text-gray-500 text-center'>
                No airlines found matching "{searchTerm}"
              </div>
            </div>
          )}
      </div>

      {/* No Terminal Info Available */}
      {value && !terminalInfo && value !== 'Other' && (
        <div className='p-3 bg-yellow-50 border border-yellow-200 rounded-lg'>
          <div className='flex items-start'>
            <Info className='w-4 h-4 text-yellow-600 mr-2 mt-0.5 flex-shrink-0' />
            <div className='text-sm text-yellow-800'>
              <strong>Terminal information not available</strong> for {value}.
              <br />
              Please check your flight confirmation or contact your airline to
              confirm terminal information.
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <p className='text-red-500 text-xs mt-1' role='alert'>
          {error}
        </p>
      )}

      {/* Help Text */}
      {!disabled && (
        <div className='text-xs text-gray-500'>
          <p>
            💡 <strong>Tip:</strong> Start typing your airline name or code (AA,
            DL, UA) to search quickly
          </p>
        </div>
      )}
    </div>
  );
};

export default AirlineSelector;
