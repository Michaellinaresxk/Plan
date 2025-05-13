// views/BabysitterServiceView.tsx

import React from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { Service } from '@/types/type';
import { ServiceData } from '@/types/services';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Clock,
  Calendar,
  Users,
  Shield,
  Heart,
  Check,
  DollarSign,
  Star,
  Camera,
  ExternalLink,
} from 'lucide-react';

interface BabysitterServiceViewProps {
  service: Service;
  serviceData?: ServiceData;
  primaryColor: string;
}

const BabysitterServiceView: React.FC<BabysitterServiceViewProps> = ({
  service,
  serviceData,
  primaryColor,
}) => {
  const { t } = useTranslation();
  const [expandedImage, setExpandedImage] = React.useState<number | null>(null);

  // Crear adaptador de datos para mantener compatibilidad con el renderizador existente
  const extendedData = {
    minimumBooking: serviceData?.metaData?.minimumBooking?.toString() || '',
    availability: serviceData?.metaData?.availability?.toString() || '',
    ageRange: serviceData?.metaData?.ageRange?.toString() || '',
    safetyStandards: serviceData?.metaData?.safetyStandards
      ? (serviceData.metaData.safetyStandards as string).split(',')
      : [],
    timeSlots: serviceData?.options?.timeSlot?.subOptions
      ? Object.values(serviceData.options.timeSlot.subOptions).map((opt: any) =>
          t(opt.nameKey)
        )
      : [],
    includes: serviceData?.includes?.map((key: string) => t(key)) || [],
    notIncluded: serviceData?.notIncluded?.map((key: string) => t(key)) || [],
    itinerary: serviceData?.itinerary?.map((key: string) => t(key)) || [],
    disclaimer: serviceData?.disclaimer ? t(serviceData.disclaimer) : undefined,
    tagline: t('services.babysitter.tagline', {
      defaultValue: 'Your Peace of Mind. Their Happiness.',
    }),
    fullDescription: t(
      serviceData?.fullDescriptionKey || serviceData?.descriptionKey || ''
    ),
  };

  // Gallery images for luxury babysitting service
  const galleryImages = [
    {
      src: 'https://images.unsplash.com/photo-1560884845-2aeb05f38f13?auto=format&fit=crop&q=80&w=1200',
      alt: 'Luxury babysitting experience',
      caption: 'Professional childcare in the comfort of your villa',
    },
    {
      src: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&q=80&w=1200',
      alt: 'Educational activities with children',
      caption: "Engaging activities tailored to your child's interests",
    },
    {
      src: 'https://images.unsplash.com/photo-1596975366153-2c2598fadfa7?auto=format&fit=crop&q=80&w=1200',
      alt: 'Safe and nurturing environment',
      caption: 'Creating memorable experiences for your little ones',
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.div
      className='space-y-8'
      initial='hidden'
      animate='visible'
      variants={containerVariants}
    >
      {/* Main Description */}
      <motion.div
        className={`bg-white rounded-xl shadow-xl overflow-hidden border border-${primaryColor}-100`}
        variants={itemVariants}
      >
        <div className='p-8 md:p-10'>
          <div className='flex items-center mb-4'>
            <div className={`h-10 w-1 bg-${primaryColor}-500 mr-4`}></div>
            <h2 className='text-3xl font-bold text-gray-900'>
              {extendedData.tagline || 'Your Peace of Mind. Their Happiness.'}
            </h2>
          </div>
          <p className='text-lg text-gray-700 leading-relaxed mb-6'>
            {extendedData.fullDescription ||
              'Trust our experienced, background-checked babysitters to care for your little ones.'}
          </p>

          {/* Ratings Bar - Luxury Touch */}
          <div
            className={`flex items-center p-4 bg-${primaryColor}-50 rounded-lg mb-8`}
          >
            <div className='flex mr-6'>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={18}
                  className={`text-${primaryColor}-500 fill-${primaryColor}-500`}
                />
              ))}
            </div>
            <div className='text-sm'>
              <span className='font-medium'>Outstanding Service</span>
              <span className='text-gray-500 ml-2'>Based on 150+ reviews</span>
            </div>
          </div>

          <div className='grid md:grid-cols-2 gap-8'>
            <div>
              <h3 className='text-lg font-semibold text-gray-800 mb-5 flex items-center'>
                <Clock className={`mr-3 text-${primaryColor}-500`} size={22} />
                {t('services.booking.information')}
              </h3>

              <div className='space-y-5'>
                <div className='flex items-start'>
                  <div
                    className={`h-10 w-10 rounded-full bg-${primaryColor}-100 flex items-center justify-center mr-4 flex-shrink-0 shadow-sm`}
                  >
                    <Clock className={`h-5 w-5 text-${primaryColor}-600`} />
                  </div>
                  <div>
                    <p className='font-semibold text-gray-800'>
                      {t('services.booking.minimum')}
                    </p>
                    <p className='text-gray-600'>
                      {extendedData.minimumBooking}
                    </p>
                  </div>
                </div>

                <div className='flex items-start'>
                  <div
                    className={`h-10 w-10 rounded-full bg-${primaryColor}-100 flex items-center justify-center mr-4 flex-shrink-0 shadow-sm`}
                  >
                    <Calendar className={`h-5 w-5 text-${primaryColor}-600`} />
                  </div>
                  <div>
                    <p className='font-semibold text-gray-800'>
                      {t('services.booking.availability')}
                    </p>
                    <p className='text-gray-600'>{extendedData.availability}</p>
                  </div>
                </div>

                <div className='flex items-start'>
                  <div
                    className={`h-10 w-10 rounded-full bg-${primaryColor}-100 flex items-center justify-center mr-4 flex-shrink-0 shadow-sm`}
                  >
                    <Users className={`h-5 w-5 text-${primaryColor}-600`} />
                  </div>
                  <div>
                    <p className='font-semibold text-gray-800'>
                      {t('services.babysitter.ageRange')}
                    </p>
                    <p className='text-gray-600'>{extendedData.ageRange}</p>
                  </div>
                </div>

                <div className='flex items-start'>
                  <div
                    className={`h-10 w-10 rounded-full bg-${primaryColor}-100 flex items-center justify-center mr-4 flex-shrink-0 shadow-sm`}
                  >
                    <Shield className={`h-5 w-5 text-${primaryColor}-600`} />
                  </div>
                  <div>
                    <p className='font-semibold text-gray-800'>
                      {t('services.babysitter.safetyStandards')}
                    </p>
                    <p className='text-gray-600'>
                      {extendedData.safetyStandards?.join(', ')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className='text-lg font-semibold text-gray-800 mb-5 flex items-center'>
                <Heart className={`mr-3 text-${primaryColor}-500`} size={22} />
                {t('services.common.options')}
              </h3>

              <div className='grid grid-cols-1 gap-3'>
                {extendedData.timeSlots?.map((option, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg bg-${primaryColor}-50/60 border border-${primaryColor}-100 shadow-sm hover:shadow-md transition-shadow duration-300`}
                  >
                    <p className='font-medium text-gray-800 flex items-center'>
                      <Check
                        className={`mr-3 h-5 w-5 text-${primaryColor}-500`}
                      />
                      {option}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Gallery Section */}
      <motion.div
        className={`bg-white rounded-xl shadow-xl overflow-hidden border border-${primaryColor}-100`}
        variants={itemVariants}
      >
        <div className='p-8 md:p-10'>
          <div className='flex items-center justify-between mb-6'>
            <h3 className='text-2xl font-bold text-gray-900 flex items-center'>
              <Camera className={`mr-3 text-${primaryColor}-500`} size={24} />
              <span>Premium Childcare Experience</span>
            </h3>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
            {galleryImages.map((image, index) => (
              <div key={index} className='relative group'>
                <div
                  className='relative aspect-[4/3] overflow-hidden rounded-lg shadow-md cursor-pointer'
                  onClick={() => setExpandedImage(index)}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className='object-cover transition-transform duration-500 group-hover:scale-110'
                    sizes='(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                  <div className='absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300'>
                    <p className='text-sm font-medium'>{image.caption}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* What's Included Section */}
      <motion.div
        className={`bg-white rounded-xl shadow-xl overflow-hidden border border-${primaryColor}-100`}
        variants={itemVariants}
      >
        <div className='p-8 md:p-10'>
          <h3 className='text-2xl font-bold text-gray-900 mb-6 flex items-center'>
            <Check className={`mr-3 text-${primaryColor}-500`} size={24} />
            {t('services.common.whatsIncluded')}
          </h3>

          <div className='grid md:grid-cols-2 gap-10'>
            <div>
              <h4 className='text-lg font-semibold text-gray-800 mb-4 flex items-center'>
                <div
                  className={`h-8 w-8 rounded-full bg-${primaryColor}-100 flex items-center justify-center mr-3 shadow-sm`}
                >
                  <Check className={`h-4 w-4 text-${primaryColor}-600`} />
                </div>
                {t('services.common.includedInService')}
              </h4>

              <ul className='space-y-4'>
                {extendedData.includes?.map((item, index) => (
                  <li key={index} className='flex items-start'>
                    <div
                      className={`mt-1 h-6 w-6 rounded-full bg-${primaryColor}-100 flex items-center justify-center mr-3 flex-shrink-0 shadow-sm`}
                    >
                      <Check
                        className={`h-3.5 w-3.5 text-${primaryColor}-600`}
                      />
                    </div>
                    <span className='text-gray-700'>{item}</span>
                  </li>
                ))}
              </ul>

              {extendedData.notIncluded &&
                extendedData.notIncluded.length > 0 && (
                  <div className='mt-8'>
                    <h4 className='text-lg font-semibold text-gray-800 mb-4 flex items-center'>
                      <div
                        className={`h-8 w-8 rounded-full bg-${primaryColor}-100 flex items-center justify-center mr-3 shadow-sm`}
                      >
                        <DollarSign
                          className={`h-4 w-4 text-${primaryColor}-600`}
                        />
                      </div>
                      {t('services.common.notIncluded')}
                    </h4>

                    <ul className='space-y-4'>
                      {extendedData.notIncluded.map((item, index) => (
                        <li
                          key={index}
                          className='flex items-start text-gray-700'
                        >
                          <div className='mt-1 h-6 w-6 flex items-center justify-center mr-3 flex-shrink-0'>
                            <span className='text-sm font-medium'>•</span>
                          </div>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>

            <div>
              <h4 className='text-lg font-semibold text-gray-800 mb-4 flex items-center'>
                <div
                  className={`h-8 w-8 rounded-full bg-${primaryColor}-100 flex items-center justify-center mr-3 shadow-sm`}
                >
                  <Clock className={`h-4 w-4 text-${primaryColor}-600`} />
                </div>
                {t('services.common.whatToExpect')}
              </h4>

              <ol className='space-y-5'>
                {extendedData.itinerary?.map((step, index) => (
                  <li key={index} className='flex items-start'>
                    <div
                      className={`mt-0.5 h-8 w-8 rounded-full bg-${primaryColor}-500 text-white flex items-center justify-center mr-4 flex-shrink-0 font-medium text-sm shadow-md`}
                    >
                      {index + 1}
                    </div>
                    <span className='text-gray-700'>{step}</span>
                  </li>
                ))}
              </ol>

              {extendedData.disclaimer && (
                <div className='mt-8 p-6 bg-amber-50 rounded-lg border border-amber-100'>
                  <h4 className='font-medium text-amber-800 mb-2 flex items-center'>
                    <Shield className='w-5 h-5 mr-2' />
                    {t('services.common.importantNote')}
                  </h4>
                  <p className='text-amber-700'>{extendedData.disclaimer}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Image Modal */}
      {expandedImage !== null && (
        <div
          className='fixed inset-0 bg-black/90 z-50 flex items-center justify-center'
          onClick={() => setExpandedImage(null)}
        >
          <div className='relative max-w-5xl max-h-[90vh] w-full'>
            <button
              className='absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors z-10'
              onClick={() => setExpandedImage(null)}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </button>

            <div className='relative h-[80vh]'>
              <Image
                src={galleryImages[expandedImage].src}
                alt={galleryImages[expandedImage].alt}
                fill
                className='object-contain'
                sizes='100vw'
              />
            </div>

            <div className='absolute bottom-0 left-0 right-0 bg-black/70 text-white p-4'>
              <p className='text-lg font-medium'>
                {galleryImages[expandedImage].caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default BabysitterServiceView;
