import React, { useState } from 'react';
import Image from 'next/image';
import { useTranslation } from '@/lib/i18n/client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useBooking } from '@/context/BookingContext';
import { ServiceData } from '@/types/services';
import { Service } from '@/types/type';
import { Check, Star, ArrowLeft, Calendar, PlusCircle } from 'lucide-react';
import ServiceContentOrchestrator from './ServiceContentOrchestrator';
import ServiceManager from '@/constants/services/ServiceManager';
import BookingModal from '../modal/BookingModal';

interface ServiceDetailsEnhancedProps {
  service: Service;
  serviceData?: ServiceData;
}

/**
 * Simplified Service Details Component
 *
 * This version removes the sidebar completely and adds a floating
 * "Book Now" button that opens the BookingModal
 */
const ServiceDetails: React.FC<ServiceDetailsEnhancedProps> = ({
  service,
  serviceData,
}) => {
  const { t } = useTranslation();
  const { addService, selectedServices } = useBooking();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Get extended details from ServiceManager
  const extendedDetails = ServiceManager.getDetails(service.id);

  // Verify if the service is already selected
  const isSelected = selectedServices.some((s) => s.id === service.id);

  // Determine if service is premium
  const isPremium = service.packageType.includes('premium');
  const packageType = isPremium ? 'premium' : 'standard';

  // Get translations for service data
  const serviceName = serviceData?.titleKey
    ? t(serviceData.titleKey, { fallback: service.name })
    : service.name;

  // Format price with currency
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(service.price);

  // Get price unit translation
  const priceUnit = serviceData?.priceUnit
    ? t(serviceData.priceUnit, {
        fallback: service.duration === 24 ? 'per day' : 'per session',
      })
    : service.duration === 24
    ? 'per day'
    : 'per session';

  // Handle booking confirmation
  const handleBookingConfirm = (service: Service, formData: any) => {
    console.log('Booking confirmed:', service, formData);
    // Process the booking - here you might redirect to checkout, add to cart, etc.
    setIsBookingModalOpen(false);
    // You can also add the service to the selected services if that's appropriate
    if (!isSelected) {
      addService(service);
    }
    // Show success message or redirect
  };

  return (
    <div
      className={`bg-gray-50 min-h-screen pb-24 ${
        isPremium ? 'bg-gray-900' : ''
      }`}
    >
      {/* Hero Section with Background Image */}
      <div className='relative h-[40vh] lg:h-[50vh] overflow-hidden'>
        <Image
          src={service.img}
          alt={serviceName}
          fill
          className='object-cover'
        />
        <div
          className={`absolute inset-0 ${
            isPremium
              ? 'bg-gradient-to-b from-black/70 to-black/80'
              : 'bg-gradient-to-b from-black/50 to-black/70'
          }`}
        />

        {/* Content overlay */}
        <div className='container mx-auto px-6 relative h-full flex flex-col justify-end pb-10'>
          <Link
            href='/services'
            className='text-white mb-6 inline-flex items-center hover:underline'
          >
            <ArrowLeft className='h-4 w-4 mr-2' />
            {t('services.actions.backToServices')}
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {isPremium && (
              <span className='bg-amber-500 text-amber-950 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2 uppercase'>
                Premium
              </span>
            )}
            <h1 className='text-3xl md:text-4xl font-bold text-white mb-2'>
              {serviceName}
            </h1>

            {/* Price display in hero section */}
            <div className='flex items-center mt-2'>
              <span className='text-xl md:text-2xl font-bold text-white'>
                {formattedPrice}
              </span>
              <span className='text-white/80 ml-1'>{priceUnit}</span>

              {serviceData?.metaData?.rating && (
                <div className='flex items-center ml-4'>
                  <Star className='h-5 w-5 text-yellow-400 fill-yellow-400' />
                  <span className='ml-1 text-white'>
                    {serviceData.metaData.rating}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className='container mx-auto px-6 pt-12'>
        {/* Action Bar (Optional) - Fixed position at top */}
        <div className='bg-white rounded-lg shadow-md p-4 mb-8 flex justify-between items-center'>
          <div className='flex items-center'>
            <span
              className={`text-lg font-bold ${
                isPremium ? 'text-amber-600' : 'text-blue-600'
              }`}
            >
              {formattedPrice}
            </span>
            <span className='text-gray-500 ml-1'>{priceUnit}</span>
          </div>

          <div className='flex space-x-3'>
            <button
              onClick={() => addService(service)}
              className={`py-2 px-4 rounded-lg ${
                isPremium
                  ? isSelected
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-white text-amber-700 border border-amber-300 hover:bg-amber-50'
                  : isSelected
                  ? 'bg-blue-100 text-blue-800 border border-blue-300'
                  : 'bg-white text-blue-700 border border-blue-300 hover:bg-blue-50'
              } transition-colors flex items-center`}
            >
              {isSelected ? (
                <>
                  <Check className='mr-1' size={16} />
                  {t('serviceDetails.added', { fallback: 'Added' })}
                </>
              ) : (
                <>
                  <PlusCircle className='mr-1' size={16} />
                  {t('serviceDetails.addToPackage', {
                    fallback: 'Add to Package',
                  })}
                </>
              )}
            </button>

            <button
              onClick={() => setIsBookingModalOpen(true)}
              className={`py-2 px-4 rounded-lg font-medium ${
                isPremium
                  ? 'bg-amber-500 hover:bg-amber-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              } transition-colors flex items-center`}
            >
              <Calendar className='mr-1' size={16} />
              {t('serviceDetails.bookNow', { fallback: 'Book Now' })}
            </button>
          </div>
        </div>

        {/* Full width content */}
        <ServiceContentOrchestrator
          service={service}
          serviceData={serviceData}
          extendedDetails={extendedDetails}
          viewContext={isPremium ? 'premium-view' : 'standard-view'}
        />
      </div>

      {/* Floating Book Now Button */}
      <div className='fixed bottom-6 right-6 z-40'>
        <button
          onClick={() => setIsBookingModalOpen(true)}
          className={`${
            isPremium
              ? 'bg-amber-500 hover:bg-amber-600 text-black'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          } rounded-full h-16 w-16 flex items-center justify-center shadow-lg transform transition-transform hover:scale-105`}
          aria-label='Book Now'
        >
          <Calendar size={28} />
        </button>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onConfirm={handleBookingConfirm}
        service={service}
      />
    </div>
  );
};

export default ServiceDetails;
