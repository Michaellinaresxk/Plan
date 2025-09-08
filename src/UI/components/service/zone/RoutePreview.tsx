import React from 'react';
import { Route, ArrowRight, Repeat, Info, Clock, MapPin } from 'lucide-react';
import { Zone, ZonePricing } from '@/constants/zone';

interface RoutePreviewProps {
  pickupZone: Zone | null;
  destinationZone: Zone | null;
  zonePricing: ZonePricing | null;
  vehicleType: 'suv' | 'van';
  totalPrice: number;
  isRoundTrip: boolean;
}

const RoutePreview: React.FC<RoutePreviewProps> = ({
  pickupZone,
  destinationZone,
  zonePricing,
  vehicleType,
  totalPrice,
  isRoundTrip,
}) => {
  if (!pickupZone || !destinationZone || !zonePricing) {
    return null;
  }

  const vehicleNames = { suv: 'SUV', van: 'Van' };

  return (
    <div className='bg-gradient-to-r from-emerald-50 to-blue-50 border border-gray-200 rounded-xl p-6'>
      <div className='flex items-center mb-4'>
        <Route className='w-5 h-5 text-gray-700 mr-2' />
        <h3 className='font-semibold text-gray-900'>Route Preview</h3>
      </div>

      <div className='space-y-4'>
        {/* Route visualization */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center'>
            <div className='w-3 h-3 bg-emerald-600 rounded-full'></div>
            <span className='ml-3 font-medium text-gray-900'>
              {pickupZone.displayName}
            </span>
          </div>
          <ArrowRight className='w-4 h-4 text-gray-500 mx-2' />
          <div className='flex items-center'>
            <div className='w-3 h-3 bg-blue-600 rounded-full'></div>
            <span className='ml-3 font-medium text-gray-900'>
              {destinationZone.displayName}
            </span>
          </div>
        </div>

        {/* Trip details grid */}
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 pt-2 border-t border-gray-200'>
          <div className='text-center'>
            <div className='text-sm text-gray-600'>Estimated Price</div>
            <div className='font-semibold text-green-600'>${totalPrice}</div>
          </div>
          <div className='text-center'>
            <div className='text-sm text-gray-600'>Vehicle</div>
            <div className='font-semibold text-gray-900'>
              {vehicleNames[vehicleType]}
            </div>
          </div>
          <div className='text-center'>
            <div className='text-sm text-gray-600'>Distance</div>
            <div className='font-semibold text-gray-900'>
              {zonePricing.distance}
            </div>
          </div>
          <div className='text-center'>
            <div className='text-sm text-gray-600'>Est. Time</div>
            <div className='font-semibold text-gray-900 flex items-center justify-center'>
              <Clock className='w-3 h-3 mr-1' />
              {zonePricing.estimatedTime}
            </div>
          </div>
        </div>

        {/* Additional info */}
        <div className='space-y-2'>
          {isRoundTrip && (
            <div className='flex items-center text-sm text-emerald-700'>
              <Repeat className='w-4 h-4 mr-2' />
              Round trip service included (1.8x pricing)
            </div>
          )}

          {pickupZone.id === destinationZone.id && (
            <div className='flex items-center text-sm text-amber-700'>
              <Info className='w-4 h-4 mr-2' />
              Local transport within the same area
            </div>
          )}

          {zonePricing.difficulty === 'hard' && (
            <div className='flex items-center text-sm text-red-700'>
              <MapPin className='w-4 h-4 mr-2' />
              Long distance transfer - premium service
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoutePreview;
