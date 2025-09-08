import React, { useEffect } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { Service } from '@/types/type';
import { Car, Navigation } from 'lucide-react';
import { useReservation } from '@/context/BookingContext';
import { useRouter } from 'next/navigation';
import FormHeader from '@/UI/components/forms/FormHeader';
import { useFormModal } from '@/hooks/useFormModal';
import { useZonePricing } from '@/hooks/pointToPoint/useZonePricing';
import { usePointToPointForm } from '@/hooks/pointToPoint/usePointToPointForm';
import ZoneSelector from './ZoneSelector';
import RoutePreview from './RoutePreview';

interface PointToPointFormContainerProps {
  service: Service;
  onSubmit: (formData: any) => void;
  onCancel: () => void;
}

const PointToPointFormContainer: React.FC<PointToPointFormContainerProps> = ({
  service,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { setReservationData } = useReservation();
  const { handleClose, registerEscapeListener } = useFormModal({ onCancel });

  // Initialize hooks
  const {
    zones,
    getZonePricing,
    calculateTransferPrice,
    getAvailableDestinations,
  } = useZonePricing();
  const {
    formData,
    errors,
    setErrors,
    updateField,
    updatePickupZone,
    updateDestinationZone,
    handleInputChange,
    createCounter,
    totalPassengers,
    validateForm,
    isSameDay,
    hasMinimum24Hours,
  } = usePointToPointForm();

  // Register escape key listener
  useEffect(() => {
    const cleanup = registerEscapeListener();
    return cleanup;
  }, [registerEscapeListener]);

  // Get current zone pricing and availability
  const currentZonePricing =
    formData.pickupZone && formData.destinationZone
      ? getZonePricing(formData.pickupZone, formData.destinationZone)
      : null;

  const availableDestinations = formData.pickupZone
    ? getAvailableDestinations(formData.pickupZone)
    : zones;

  const currentPickupZone =
    zones.find((z) => z.id === formData.pickupZone) || null;
  const currentDestinationZone =
    zones.find((z) => z.id === formData.destinationZone) || null;

  // Calculate total price
  const totalPrice =
    formData.pickupZone && formData.destinationZone
      ? calculateTransferPrice(
          formData.pickupZone,
          formData.destinationZone,
          formData.vehicleType,
          formData.isRoundTrip,
          formData.carSeatCount
        )
      : 0;

  // Counter handlers
  const passengerCounter = createCounter('passengerCount', 1);
  const kidsCounter = createCounter('kidsCount', 0);
  const carSeatCounter = createCounter('carSeatCount', 0);

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const reservationData = {
        service,
        totalPrice,
        formData: {
          ...formData,
          serviceType: 'point-to-point-transfer',
          pickupZoneName: currentPickupZone?.displayName || '',
          destinationZoneName: currentDestinationZone?.displayName || '',
        },
        bookingDate: new Date(`${formData.pickupDate}T${formData.pickupTime}`),
        pointToPointSpecifics: {
          pickupZone: formData.pickupZone,
          destinationZone: formData.destinationZone,
          pickupZoneName: currentPickupZone?.displayName || '',
          destinationZoneName: currentDestinationZone?.displayName || '',
          exactPickupAddress: formData.pickupAddress,
          exactDestinationAddress: formData.destinationAddress,
          vehicleType: formData.vehicleType,
          totalPassengers,
          carSeats: formData.carSeatCount,
          isRoundTrip: formData.isRoundTrip,
          zonePricing: currentZonePricing,
        },
      };

      console.log(
        '🚗 Point-to-Point transfer - Reservation data:',
        reservationData
      );

      onSubmit({
        ...formData,
        totalPrice,
      });
    } catch (error) {
      console.error(
        '❌ Point-to-Point transfer - Error submitting form:',
        error
      );
      setErrors({
        submit: 'Failed to submit reservation. Please try again.',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className='w-full mx-auto overflow-hidden'>
      <div className='bg-white rounded-xl shadow-lg border border-gray-100'>
        {/* Header */}
        <FormHeader
          title='Point-to-Point Transfer'
          subtitle='Professional transportation between any two locations'
          icon={Car}
          onCancel={handleClose}
          showCloseButton={true}
          gradientFrom='emerald-500'
          gradientVia='emerald-700'
          gradientTo='emerald-800'
        />

        {/* Form Body */}
        <div className='p-8 space-y-8'>
          {/* Zone Selection Section */}
          <div className='space-y-6'>
            <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2'>
              Route Information
            </h3>

            {/* Pickup Zone Selector */}
            <ZoneSelector
              label='Select pickup zone *'
              zones={zones}
              selectedZone={formData.pickupZone}
              onZoneSelect={updatePickupZone}
              error={errors.pickupZone}
              colorScheme='emerald'
            />

            {/* Destination Zone Selector */}
            <ZoneSelector
              label='Select destination zone *'
              zones={availableDestinations}
              selectedZone={formData.destinationZone}
              onZoneSelect={updateDestinationZone}
              error={errors.destinationZone}
              colorScheme='blue'
              icon={Navigation}
            />

            {/* Route Preview */}
            <RoutePreview
              pickupZone={currentPickupZone}
              destinationZone={currentDestinationZone}
              zonePricing={currentZonePricing}
              vehicleType={formData.vehicleType}
              totalPrice={totalPrice}
              isRoundTrip={formData.isRoundTrip}
            />
          </div>

          {/* TODO: Add other form sections here */}
          {/* - Date & Time Section */}
          {/* - Passenger Information */}
          {/* - Additional Information */}
        </div>

        {/* Footer */}
        <div className='rounded-2xl bg-gray-900 text-white p-6 flex justify-between items-center'>
          <div className='text-xl font-bold'>
            Total: <span className='text-emerald-400'>${totalPrice}</span>
            {currentPickupZone && currentDestinationZone && (
              <div className='text-sm text-gray-400 mt-1'>
                {currentPickupZone.displayName} →{' '}
                {currentDestinationZone.displayName}
              </div>
            )}
          </div>
          <div className='flex space-x-4'>
            <button
              type='button'
              onClick={handleClose}
              className='px-5 py-3 border border-gray-700 rounded-lg text-gray-300 hover:text-white hover:border-gray-600 transition'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={!formData.pickupZone || !formData.destinationZone}
              className='px-8 py-3 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg transition flex items-center disabled:opacity-50'
            >
              <Car className='h-4 w-4 mr-2' />
              Book Transfer
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PointToPointFormContainer;
