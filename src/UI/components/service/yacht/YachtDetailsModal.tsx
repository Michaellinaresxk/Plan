import { YachtDetailsModalProps } from "@/constants/yacht/yachts";
import { useTranslation } from "@/lib/i18n/client";
import { Anchor, BedDouble, Calendar, Crown, Star, Users, X, Zap } from "lucide-react";
import { useState } from "react";

// Yacht Details Modal
const YachtDetailsModal: React.FC<YachtDetailsModalProps> = ({
  yacht,
  onClose,
  onBookYacht,
}) => {
  const { t } = useTranslation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className='fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
      <div className='bg-white rounded-3xl max-w-6xl w-full h-[95vh] overflow-hidden shadow-2xl flex flex-col lg:flex-row'>
        <div className='lg:w-3/5 flex flex-col min-h-0'>
          <div className='p-6 border-b border-gray-200 flex justify-between items-center flex-shrink-0'>
            <div>
              <h2 className='text-2xl font-semibold text-gray-900'>
                {yacht.name}
              </h2>
              <div className='flex items-center gap-4 mt-1'>
                <span className='text-gray-500'>
                  {yacht.specifications.length}
                </span>
                <span className='text-gray-300'>•</span>
                <div className='flex items-center gap-1'>
                  <Star className='w-4 h-4 text-yellow-400 fill-yellow-400' />
                  <span className='text-gray-600'>
                    {yacht.rating} ({yacht.reviews})
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className='w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors'
            >
              <X className='w-5 h-5' />
            </button>
          </div>

          <div className='relative flex-1 bg-gray-100 min-h-0'>
            <img
              src={yacht.gallery[currentImageIndex]}
              alt={`${yacht.name} - Image ${currentImageIndex + 1}`}
              className='w-full h-full object-cover'
            />

            <div className='absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm'>
              {currentImageIndex + 1} / {yacht.gallery.length}
            </div>

            <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2'>
              {yacht.gallery.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-12 h-8 rounded-md overflow-hidden border-2 transition-all ${
                    index === currentImageIndex
                      ? 'border-white'
                      : 'border-white/50'
                  }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className='w-full h-full object-cover'
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className='lg:w-2/5 flex flex-col min-h-0'>
          <div className='p-6 border-b border-gray-200 bg-gradient-to-br from-teal-50/50 to-blue-50/50 flex-shrink-0'>
            <div className='text-center mb-4'>
              <div className='inline-flex items-center gap-2 bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-semibold mb-3'>
                <Calendar className='w-4 h-4' />
                {t('services.premium.luxYachtView.modal.availableOnRequest')}
              </div>
              <p className='text-gray-600 text-sm'>
                {t('services.premium.luxYachtView.modal.availabilityNote')}
              </p>
            </div>

            {yacht.isPremium && (
              <div className='flex justify-center mb-4'>
                <div className='bg-gradient-to-r from-coral-400 to-orange-400 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1'>
                  <Crown className='w-3 h-3' />
                  {t(
                    'services.premium.luxYachtView.yachtGrid.cardPremiumBadge'
                  )}
                </div>
              </div>
            )}

            <button
              onClick={() => onBookYacht(yacht)}
              className='w-full bg-teal-600 hover:bg-teal-700 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2'
            >
              <Calendar className='w-5 h-5' />
              {t('services.premium.luxYachtView.modal.ctaBook')}
            </button>
          </div>

          <div className='border-b border-gray-200 bg-gray-50 flex-shrink-0'>
            <div className='flex'>
              {[
                {
                  id: 'overview',
                  name: t('services.premium.luxYachtView.modal.tabOverview'),
                },
                {
                  id: 'itinerary',
                  name: t('services.premium.luxYachtView.modal.tabItinerary'),
                },
                {
                  id: 'amenities',
                  name: t('services.premium.luxYachtView.modal.tabAmenities'),
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-teal-600 text-teal-600 bg-white'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </div>
          </div>

          <div className='flex-1 min-h-0 overflow-y-auto p-6 pb-30'>
            {activeTab === 'overview' && (
              <div className='space-y-6'>
                <div>
                  <h3 className='font-semibold text-gray-900 mb-3'>
                    {t('services.premium.luxYachtView.modal.overviewTitle')}
                  </h3>
                  <p className='text-gray-600 leading-relaxed'>
                    {yacht.shortDescription}
                  </p>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  {[
                    {
                      label: t(
                        'services.premium.luxYachtView.modal.specLength'
                      ),
                      value: yacht.specifications.length,
                      icon: <Anchor className='w-4 h-4' />,
                    },
                    {
                      label: t(
                        'services.premium.luxYachtView.modal.specGuests'
                      ),
                      value: yacht.specifications.maxGuests,
                      icon: <Users className='w-4 h-4' />,
                    },
                    {
                      label: t(
                        'services.premium.luxYachtView.modal.specCabins'
                      ),
                      value: yacht.specifications.cabins,
                      icon: <BedDouble className='w-4 h-4' />,
                    },
                    {
                      label: t('services.premium.luxYachtView.modal.specSpeed'),
                      value: yacht.specifications.maxSpeed,
                      icon: <Zap className='w-4 h-4' />,
                    },
                  ].map((spec, index) => (
                    <div
                      key={index}
                      className='text-center p-3 bg-teal-50 rounded-lg'
                    >
                      <div className='flex justify-center mb-2 text-teal-600'>
                        {spec.icon}
                      </div>
                      <div className='font-bold text-gray-900'>
                        {spec.value}
                      </div>
                      <div className='text-xs text-gray-500'>{spec.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'itinerary' && (
              <div>
                <h3 className='font-semibold text-gray-900 mb-4'>
                  {t('services.premium.luxYachtView.modal.itineraryTitle')}
                </h3>
                <div className='space-y-4 mb-6'>
                  <div className='p-4 bg-teal-50 rounded-lg'>
                    <h4 className='font-semibold text-teal-900 mb-2'>
                      {t(
                        'services.premium.luxYachtView.modal.itineraryScheduleTitle'
                      )}
                    </h4>
                    <p className='text-teal-700 text-sm'>
                      {t(
                        'services.premium.luxYachtView.modal.itineraryScheduleDesc'
                      )}
                    </p>
                  </div>
                  <div className='p-4 bg-blue-50 rounded-lg'>
                    <h4 className='font-semibold text-blue-900 mb-2'>
                      {t(
                        'services.premium.luxYachtView.modal.itineraryPrivateTitle'
                      )}
                    </h4>
                    <p className='text-blue-700 text-sm'>
                      {t(
                        'services.premium.luxYachtView.modal.itineraryPrivateDesc'
                      )}
                    </p>
                  </div>
                  <div className='p-4 bg-green-50 rounded-lg'>
                    <h4 className='font-semibold text-green-900 mb-2'>
                      {t(
                        'services.premium.luxYachtView.modal.itineraryBookingTitle'
                      )}
                    </h4>
                    <p className='text-green-700 text-sm'>
                      {t(
                        'services.premium.luxYachtView.modal.itineraryBookingDesc'
                      )}
                    </p>
                  </div>
                </div>
                <div className='space-y-3'>
                  <h4 className='font-semibold text-gray-900'>
                    {t(
                      'services.premium.luxYachtView.modal.itineraryOptionsLabel'
                    )}
                  </h4>
                  {yacht.itinerary.map((item, index) => (
                    <div
                      key={index}
                      className='flex items-start gap-3 p-3 bg-gray-50 rounded-lg'
                    >
                      <div className='w-6 h-6 bg-teal-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5'>
                        <span className='text-xs font-bold text-teal-700'>
                          {index + 1}
                        </span>
                      </div>
                      <span className='text-gray-700 text-sm'>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'amenities' && (
              <div className='space-y-4'>
                <h3 className='font-semibold text-gray-900 mb-4'>
                  {t('services.premium.luxYachtView.modal.amenitiesTitle')}
                </h3>
                {yacht.amenities.map((amenity, index) => (
                  <div
                    key={index}
                    className='p-4 border border-gray-200 rounded-xl bg-white'
                  >
                    <div className='flex items-start gap-3'>
                      <div className='w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600'>
                        {amenity.icon}
                      </div>
                      <div>
                        <h4 className='font-semibold text-gray-900 mb-1'>
                          {amenity.name}
                        </h4>
                        <p className='text-gray-600 text-sm'>
                          {amenity.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default YachtDetailsModal;
