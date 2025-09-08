import React from 'react';
import { Users, Baby, Car, Info } from 'lucide-react';

interface Counter {
  increment: () => void;
  decrement: () => void;
}

interface PassengerSectionProps {
  formData: {
    passengerCount: number;
    kidsCount: number;
    vehicleType: 'suv' | 'van';
    needsCarSeat: boolean;
    carSeatCount: number;
  };
  errors: { [key: string]: string };
  totalPassengers: number;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onVehicleTypeChange: (vehicleType: 'suv' | 'van') => void;
  passengerCounter: Counter;
  kidsCounter: Counter;
  carSeatCounter: Counter;
}

const Counter: React.FC<{
  label: string;
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  icon: React.ElementType;
  min?: number;
}> = ({ label, value, onIncrement, onDecrement, icon: Icon, min = 0 }) => (
  <div>
    <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
      <Icon className='w-4 h-4 mr-2 text-emerald-700' />
      {label}
    </label>
    <div className='flex border border-gray-300 rounded-lg overflow-hidden bg-white'>
      <button
        type='button'
        onClick={onDecrement}
        disabled={value <= min}
        className='px-4 py-2 bg-gray-100 hover:bg-gray-200 transition disabled:opacity-50'
      >
        -
      </button>
      <div className='flex-1 py-2 text-center font-medium'>{value}</div>
      <button
        type='button'
        onClick={onIncrement}
        className='px-4 py-2 bg-gray-100 hover:bg-gray-200 transition'
      >
        +
      </button>
    </div>
  </div>
);

const VEHICLE_OPTIONS = {
  suv: {
    name: 'SUV',
    capacity: 6,
    additionalCost: 25,
    description: 'Spacious and comfortable for medium groups',
    icon: '🚙',
  },
  van: {
    name: 'Van',
    capacity: 15,
    additionalCost: 50,
    description: 'Large capacity for big groups, keeps everyone together',
    icon: '🚐',
  },
};

const PassengerSection: React.FC<PassengerSectionProps> = ({
  formData,
  errors,
  totalPassengers,
  onInputChange,
  onVehicleTypeChange,
  passengerCounter,
  kidsCounter,
  carSeatCounter,
}) => {
  return (
    <div className='space-y-6'>
      <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2'>
        Passenger Information
      </h3>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Counter
          label='Adults'
          value={formData.passengerCount}
          onIncrement={passengerCounter.increment}
          onDecrement={passengerCounter.decrement}
          icon={Users}
          min={1}
        />

        <Counter
          label='Children'
          value={formData.kidsCount}
          onIncrement={kidsCounter.increment}
          onDecrement={kidsCounter.decrement}
          icon={Baby}
        />
      </div>

      {/* Total passengers display */}
      <div className='p-3 bg-emerald-50 border border-emerald-200 rounded-lg'>
        <p className='text-sm text-emerald-800'>
          <strong>Total passengers:</strong> {totalPassengers}
        </p>
      </div>

      {/* Vehicle Type Selection */}
      <div>
        <label className='flex items-center text-sm font-medium text-gray-700 mb-3'>
          <Car className='w-4 h-4 mr-2 text-emerald-700' />
          Vehicle Type
        </label>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {Object.entries(VEHICLE_OPTIONS).map(([key, vehicle]) => (
            <div
              key={key}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                formData.vehicleType === key
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-gray-200 hover:border-emerald-300'
              }`}
              onClick={() => onVehicleTypeChange(key as 'suv' | 'van')}
            >
              <div className='flex items-center justify-between mb-2'>
                <div className='flex items-center'>
                  <span className='text-2xl mr-2'>{vehicle.icon}</span>
                  <span className='font-medium'>{vehicle.name}</span>
                </div>
                <span className='text-sm text-gray-600'>
                  +${vehicle.additionalCost}
                </span>
              </div>
              <p className='text-sm text-gray-600 mb-2'>
                {vehicle.description}
              </p>
              <div className='text-xs text-gray-500'>
                <span>Up to {vehicle.capacity} passengers</span>
              </div>
            </div>
          ))}
        </div>

        {/* Show info for large groups */}
        {totalPassengers > 10 && (
          <div className='p-3 bg-amber-50 border border-amber-200 rounded-lg mt-4 flex items-start'>
            <Info className='w-4 h-4 text-amber-600 mr-2 mt-0.5' />
            <div className='text-sm text-amber-800'>
              <strong>Large group options:</strong> For {totalPassengers}{' '}
              passengers, choose between one Van (everyone together) or consider
              multiple vehicles for comfort.
            </div>
          </div>
        )}

        {errors.vehicleType && (
          <p className='text-red-500 text-xs mt-2'>{errors.vehicleType}</p>
        )}
      </div>

      {/* Car Seat Section */}
      <div>
        <div className='mb-4'>
          <label className='flex items-center mb-2 text-sm font-medium text-gray-700'>
            <Baby className='w-4 h-4 mr-2 text-emerald-700' />
            Child Safety Seats
          </label>

          <div className='flex items-center bg-gray-50 p-3 border border-gray-300 rounded-lg'>
            <input
              type='checkbox'
              id='needsCarSeat'
              name='needsCarSeat'
              checked={formData.needsCarSeat}
              onChange={onInputChange}
              className='h-4 w-4 text-emerald-700 focus:ring-emerald-500 border-gray-300 rounded'
            />
            <label
              htmlFor='needsCarSeat'
              className='ml-2 text-sm text-gray-700'
            >
              I need child safety seats (+$25 each)
            </label>
          </div>
        </div>

        {formData.needsCarSeat && (
          <Counter
            label='Number of car seats needed'
            value={formData.carSeatCount}
            onIncrement={carSeatCounter.increment}
            onDecrement={carSeatCounter.decrement}
            icon={Baby}
          />
        )}

        {errors.carSeatCount && (
          <p className='text-red-500 text-xs mt-1'>{errors.carSeatCount}</p>
        )}
      </div>
    </div>
  );
};

export default PassengerSection;
