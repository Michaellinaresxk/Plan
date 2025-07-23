import React from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { ServiceData } from '@/types/services';
import { motion } from 'framer-motion';
import {
  Check,
  Clock,
  DollarSign,
  Calendar,
  Users,
  Shield,
  Heart,
  Info,
  Tag,
} from 'lucide-react';

interface ServiceContentProps {
  service: ServiceData;
  primaryColor: string;
}

/**
 * Componente para renderizar el contenido específico de un servicio
 * basado en su tipo y datos.
 */
const ServiceContent: React.FC<ServiceContentProps> = ({
  service,
  primaryColor,
}) => {
  const { t } = useTranslation();

  // Durante la transición, seguimos usando los renderizadores antiguos
  // pero eventualmente podemos reemplazarlos con el nuevo sistema
  if (service.specialRender) {
    switch (service.specialRender) {
      case 'yoga':
        // Preparar datos para el renderizador de yoga
        const yogaExtendedData = {
          yogaStyles: service.options?.yogaStyle?.subOptions
            ? Object.values(service.options.yogaStyle.subOptions).map((opt) =>
                t(opt.nameKey)
              )
            : [],
          includes: service.includes?.map((key) => t(key)) || [],
          notIncluded: service.notIncluded?.map((key) => t(key)) || [],
          itinerary: service.itinerary?.map((key) => t(key)) || [],
          tagline: t('services.yoga.tagline'),
          slogan: t('services.yoga.slogan'),
        };

        // Por ahora seguimos usando el renderizador antiguo
        return renderYogaService(
          yogaExtendedData,
          primaryColor,
          t,
          `services.standard.yogaStandard`
        );
      // Eventualmente podemos cambiarlo por el nuevo orquestador:
      // return <ServiceContentOrchestrator service={service} primaryColor={primaryColor} />;

      case 'karaoke':
        // Obtener datos extendidos para que sean compatibles con el renderizador actual
        const karaokeExtendedData = {
          timeSlots: service.options?.setupType?.subOptions
            ? Object.values(service.options.setupType.subOptions).map((opt) =>
                t(opt.nameKey)
              )
            : [],
          includes: service.includes?.map((key) => t(key)) || [],
          notIncluded: service.notIncluded?.map((key) => t(key)) || [],
          itinerary: service.itinerary?.map((key) => t(key)) || [],
          disclaimer: service.disclaimer ? t(service.disclaimer) : undefined,
          tagline: t('services.karaoke.tagline'),
          slogan: t('services.karaoke.slogan'),
        };

        return renderKaraokeService(
          karaokeExtendedData,
          primaryColor,
          t,
          `services.standard.karaoke`
        );

      case 'airport':
        // Adaptador para datos de transferencia de aeropuerto
        const airportData = {
          title: t('services.airportTransfer.title'),
          description: t(service.fullDescriptionKey || service.descriptionKey),
          priceUnit: t(service.priceUnit),
          timeSlots: service.options?.vehicleType?.subOptions
            ? Object.values(service.options.vehicleType.subOptions).map((opt) =>
                t(opt.nameKey)
              )
            : [],
          travelTime: service.metaData?.travelTime?.toString() || '',
          includes: service.includes?.map((key) => t(key)) || [],
          notIncluded: service.notIncluded?.map((key) => t(key)) || [],
          itinerary: service.itinerary?.map((key) => t(key)) || [],
          safetyStandards: service.metaData?.safetyStandards
            ? (service.metaData.safetyStandards as string)
                .split(',')
                .map((item) => item.trim())
            : [],
          availability: service.metaData?.availability?.toString() || '',
          disclaimer: service.disclaimer ? t(service.disclaimer) : undefined,
          fullDescription: t(
            service.fullDescriptionKey || service.descriptionKey
          ),
          tagline: t('services.airportTransfer.tagline'),
        };

        return renderAirportTransferDetails(airportData, primaryColor);

      case 'babysitter':
        return renderBabysitterService(service, primaryColor, t);

      default:
        // Para servicios con specialRender pero sin función específica,
        // usamos el orquestador que maneja bloques de contenido
        return (
          <ServiceContentOrchestrator
            service={service}
            primaryColor={primaryColor}
          />
        );
    }
  }

  // Para servicios estándar, usamos el orquestador o el renderizador clásico
  return renderDefaultServiceContent(service, t);
  // Alternativamente, para migrar completamente:
  // return <ServiceContentOrchestrator service={service} primaryColor={primaryColor} />;
};

// Función de renderizado para el servicio de niñera
function renderBabysitterService(
  service: ServiceData,
  primaryColor: string,
  t: ReturnType<typeof useTranslation>['t']
) {
  // Crear adaptador de datos para mantener compatibilidad con el renderizador existente
  const extendedData = {
    minimumBooking: service.metaData?.minimumBooking?.toString() || '',
    availability: service.metaData?.availability?.toString() || '',
    ageRange: service.metaData?.ageRange?.toString() || '',
    safetyStandards: service.metaData?.safetyStandards
      ? (service.metaData.safetyStandards as string).split(',')
      : [],
    timeSlots: service.options?.timeSlot?.subOptions
      ? Object.values(service.options.timeSlot.subOptions).map((opt) =>
          t(opt.nameKey)
        )
      : [],
    includes: service.includes?.map((key) => t(key)) || [],
    notIncluded: service.notIncluded?.map((key) => t(key)) || [],
    itinerary: service.itinerary?.map((key) => t(key)) || [],
    disclaimer: service.disclaimer ? t(service.disclaimer) : undefined,
    tagline: t('services.babysitter.tagline', {
      defaultValue: 'Your Peace of Mind. Their Happiness.',
    }),
    fullDescription: t(service.fullDescriptionKey || service.descriptionKey),
  };

  return (
    <div className='space-y-8'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='bg-white rounded-xl shadow-lg overflow-hidden'
      >
        <div className='p-6 md:p-8'>
          <h2 className='text-2xl font-bold text-gray-900 mb-2'>
            {extendedData.tagline || 'Your Peace of Mind. Their Happiness.'}
          </h2>
          <p className='text-lg text-gray-700 mb-6'>
            {extendedData.fullDescription ||
              'Trust our experienced, background-checked babysitters to care for your little ones.'}
          </p>

          <div className='grid md:grid-cols-2 gap-6'>
            <div>
              <h3 className='text-lg font-semibold text-gray-800 mb-4 flex items-center'>
                <Clock className={`mr-2 text-${primaryColor}-500`} size={20} />
                {t('services.booking.information')}
              </h3>

              <div className='space-y-3'>
                <div className='flex items-start'>
                  <div
                    className={`h-6 w-6 rounded-full bg-${primaryColor}-100 flex items-center justify-center mr-3 flex-shrink-0`}
                  >
                    <Clock className={`h-3.5 w-3.5 text-${primaryColor}-600`} />
                  </div>
                  <div>
                    <p className='font-medium text-gray-700'>
                      {t('services.booking.minimum')}
                    </p>
                    <p className='text-gray-600 text-sm'>
                      {extendedData.minimumBooking}
                    </p>
                  </div>
                </div>

                <div className='flex items-start'>
                  <div
                    className={`h-6 w-6 rounded-full bg-${primaryColor}-100 flex items-center justify-center mr-3 flex-shrink-0`}
                  >
                    <Calendar
                      className={`h-3.5 w-3.5 text-${primaryColor}-600`}
                    />
                  </div>
                  <div>
                    <p className='font-medium text-gray-700'>
                      {t('services.booking.availability')}
                    </p>
                    <p className='text-gray-600 text-sm'>
                      {extendedData.availability}
                    </p>
                  </div>
                </div>

                <div className='flex items-start'>
                  <div
                    className={`h-6 w-6 rounded-full bg-${primaryColor}-100 flex items-center justify-center mr-3 flex-shrink-0`}
                  >
                    <Users className={`h-3.5 w-3.5 text-${primaryColor}-600`} />
                  </div>
                  <div>
                    <p className='font-medium text-gray-700'>
                      {t('services.babysitter.ageRange')}
                    </p>
                    <p className='text-gray-600 text-sm'>
                      {extendedData.ageRange}
                    </p>
                  </div>
                </div>

                <div className='flex items-start'>
                  <div
                    className={`h-6 w-6 rounded-full bg-${primaryColor}-100 flex items-center justify-center mr-3 flex-shrink-0`}
                  >
                    <Shield
                      className={`h-3.5 w-3.5 text-${primaryColor}-600`}
                    />
                  </div>
                  <div>
                    <p className='font-medium text-gray-700'>
                      {t('services.babysitter.safetyStandards')}
                    </p>
                    <p className='text-gray-600 text-sm'>
                      {extendedData.safetyStandards?.join(', ')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className='text-lg font-semibold text-gray-800 mb-4 flex items-center'>
                <Heart className={`mr-2 text-${primaryColor}-500`} size={20} />
                {t('services.common.options')}
              </h3>

              <div className='grid grid-cols-1 gap-2'>
                {extendedData.timeSlots?.map((option, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg bg-${primaryColor}-50 border border-${primaryColor}-100`}
                  >
                    <p className='font-medium text-gray-800 flex items-center'>
                      <Check
                        className={`mr-2 h-4 w-4 text-${primaryColor}-500`}
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

      {/* What's Included Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className='bg-white rounded-xl shadow-lg overflow-hidden'
      >
        <div className='p-6 md:p-8'>
          <h3 className='text-xl font-bold text-gray-900 mb-6'>
            {t('services.common.whatsIncluded')}
          </h3>

          <div className='grid md:grid-cols-2 gap-8'>
            <div>
              <h4 className='text-lg font-semibold text-gray-800 mb-4 flex items-center'>
                <Check className={`mr-2 text-${primaryColor}-500`} size={18} />
                {t('services.common.includedInService')}
              </h4>

              <ul className='space-y-3'>
                {extendedData.includes?.map((item, index) => (
                  <li key={index} className='flex items-start'>
                    <div
                      className={`mt-1 h-5 w-5 rounded-full bg-${primaryColor}-100 flex items-center justify-center mr-3 flex-shrink-0`}
                    >
                      <Check className={`h-3 w-3 text-${primaryColor}-600`} />
                    </div>
                    <span className='text-gray-700'>{item}</span>
                  </li>
                ))}
              </ul>

              {extendedData.notIncluded &&
                extendedData.notIncluded.length > 0 && (
                  <div className='mt-6'>
                    <h4 className='text-lg font-semibold text-gray-800 mb-4 flex items-center'>
                      <DollarSign
                        className={`mr-2 text-${primaryColor}-500`}
                        size={18}
                      />
                      {t('services.common.notIncluded')}
                    </h4>

                    <ul className='space-y-3'>
                      {extendedData.notIncluded.map((item, index) => (
                        <li
                          key={index}
                          className='flex items-start text-gray-700'
                        >
                          <div className='mt-1 h-5 w-5 flex items-center justify-center mr-3 flex-shrink-0'>
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
              <h4 className='text-lg font-semibold text-gray-800 mb-4'>
                {t('services.common.whatToExpect')}
              </h4>

              <ol className='space-y-4'>
                {extendedData.itinerary?.map((step, index) => (
                  <li key={index} className='flex items-start'>
                    <div
                      className={`mt-0.5 h-6 w-6 rounded-full bg-${primaryColor}-500 text-white flex items-center justify-center mr-3 flex-shrink-0 font-medium text-sm`}
                    >
                      {index + 1}
                    </div>
                    <span className='text-gray-700'>{step}</span>
                  </li>
                ))}
              </ol>

              {extendedData.disclaimer && (
                <div className='mt-6 p-4 bg-amber-50 rounded-lg border border-amber-100'>
                  <h4 className='font-medium text-amber-800 mb-2'>
                    {t('services.common.importantNote')}
                  </h4>
                  <p className='text-amber-700 text-sm'>
                    {extendedData.disclaimer}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Función para renderizar el contenido estándar de un servicio
function renderDefaultServiceContent(
  service: ServiceData,
  t: ReturnType<typeof useTranslation>['t']
) {
  return (
    <div className='service-content standard-render'>
      <div className='service-description mb-6'>
        <h3 className='text-xl font-semibold mb-3'>
          {t('services.common.description')}
        </h3>
        <p className='text-gray-700'>{t(service.descriptionKey)}</p>
        {service.fullDescriptionKey && (
          <p className='text-gray-700 mt-3'>{t(service.fullDescriptionKey)}</p>
        )}
      </div>

      {/* Información adicional si existe */}
      {service.additionalInfoKeys && service.additionalInfoKeys.length > 0 && (
        <div className='additional-info my-6'>
          <h3 className='text-xl font-semibold mb-3'>
            {t('services.common.additionalInfo')}
          </h3>
          <ul className='list-disc pl-5 space-y-2'>
            {service.additionalInfoKeys.map((infoKey, index) => (
              <li key={index} className='text-gray-700'>
                {t(infoKey)}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Incluido en el servicio */}
      {service.includes && service.includes.length > 0 && (
        <div className='includes my-6'>
          <h3 className='text-xl font-semibold mb-3'>
            {t('services.common.includedInService')}
          </h3>
          <ul className='list-disc pl-5 space-y-2'>
            {service.includes.map((includeKey, index) => (
              <li key={index} className='text-gray-700'>
                {t(includeKey)}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* No incluido en el servicio */}
      {service.notIncluded && service.notIncluded.length > 0 && (
        <div className='not-included my-6'>
          <h3 className='text-xl font-semibold mb-3'>
            {t('services.common.notIncluded')}
          </h3>
          <ul className='list-disc pl-5 space-y-2'>
            {service.notIncluded.map((notIncludedKey, index) => (
              <li key={index} className='text-gray-700'>
                {t(notIncludedKey)}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Opciones del servicio si existen */}
      {service.options && Object.keys(service.options).length > 0 && (
        <div className='service-options my-6'>
          <h3 className='text-xl font-semibold mb-3'>
            {t('services.common.options')}
          </h3>
          <div className='space-y-4'>
            {Object.entries(service.options).map(([optionKey, option]) => (
              <div key={optionKey} className='option-category'>
                <h4 className='text-lg font-medium mb-2'>
                  {t(option.nameKey)}
                </h4>
                {option.subOptions && (
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                    {Object.entries(option.subOptions).map(
                      ([subOptionKey, subOption]) => (
                        <div
                          key={subOptionKey}
                          className='option-item p-3 border rounded-lg'
                        >
                          <div className='flex justify-between'>
                            <span>{t(subOption.nameKey)}</span>
                            {subOption.price !== undefined &&
                              subOption.price !== 0 && (
                                <span
                                  className={`font-medium ${
                                    subOption.price > 0
                                      ? 'text-amber-600'
                                      : 'text-green-600'
                                  }`}
                                >
                                  {subOption.price > 0 ? '+' : ''}
                                  {subOption.price} USD
                                </span>
                              )}
                          </div>
                          {subOption.descriptionKey && (
                            <p className='text-sm text-gray-500 mt-1'>
                              {t(subOption.descriptionKey)}
                            </p>
                          )}
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Itinerario del servicio */}
      {service.itinerary && service.itinerary.length > 0 && (
        <div className='service-itinerary my-6'>
          <h3 className='text-xl font-semibold mb-3'>
            {t('services.common.whatToExpect')}
          </h3>
          <ol className='space-y-3'>
            {service.itinerary.map((stepKey, index) => (
              <li key={index} className='flex items-start'>
                <div className='mt-0.5 h-6 w-6 rounded-full bg-blue-500 text-white flex items-center justify-center mr-3 flex-shrink-0 font-medium text-sm'>
                  {index + 1}
                </div>
                <span className='text-gray-700'>{t(stepKey)}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Metadata relevante del servicio */}
      {service.metaData && Object.keys(service.metaData).length > 0 && (
        <div className='service-metadata my-6'>
          <h3 className='text-xl font-semibold mb-3'>
            {t('services.common.details')}
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {Object.entries(service.metaData).map(([key, value]) => {
              // Convertir el valor a un formato presentable
              let displayValue = '';
              if (typeof value === 'boolean') {
                displayValue = value ? t('common.yes') : t('common.no');
              } else if (typeof value === 'string' && value.includes(',')) {
                // Asumir que es una lista separada por comas
                displayValue = value
                  .split(',')
                  .map((v) =>
                    t(`services.metadata.values.${v.trim()}`, {
                      defaultValue: v.trim(),
                    })
                  )
                  .join(', ');
              } else {
                displayValue = value?.toString() || '';
              }

              return (
                <div
                  key={key}
                  className='metadata-item p-3 bg-gray-50 rounded-lg'
                >
                  <div className='text-sm text-gray-500 capitalize'>
                    {t(`services.metadata.${key}`, {
                      defaultValue: key.replace(/([A-Z])/g, ' $1').trim(),
                    })}
                  </div>
                  <div className='font-medium'>{displayValue}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Disponibilidad si existe */}
      {service.availability && (
        <div className='service-availability my-6'>
          <h3 className='text-xl font-semibold mb-3'>
            {t('services.common.availability')}
          </h3>

          {service.availability.daysOfWeek &&
            service.availability.daysOfWeek.length > 0 && (
              <div className='mb-4'>
                <h4 className='text-lg font-medium mb-2'>
                  {t('services.common.availableDays')}
                </h4>
                <div className='flex flex-wrap gap-2'>
                  {Array.from({ length: 7 }).map((_, i) => {
                    const dayIndex = (i + 1) % 7; // Hace que empiece desde lunes (1) hasta domingo (0)
                    const isAvailable =
                      service.availability?.daysOfWeek?.includes(dayIndex);

                    return (
                      <div
                        key={i}
                        className={`w-10 h-10 flex items-center justify-center rounded-full 
                        ${
                          isAvailable
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        {t(`common.days.short.${dayIndex}`)}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          {service.availability.hoursOfDay &&
            service.availability.hoursOfDay.length > 0 && (
              <div>
                <h4 className='text-lg font-medium mb-2'>
                  {t('services.common.availableHours')}
                </h4>
                <div className='flex flex-wrap gap-2'>
                  {service.availability.hoursOfDay.map((hour) => (
                    <div
                      key={hour}
                      className='px-3 py-1 bg-green-100 text-green-800 rounded-full'
                    >
                      {`${hour}:00`}
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>
      )}

      {/* Disclaimer */}
      {service.disclaimer && (
        <div className='disclaimer mt-6 p-4 bg-amber-50 rounded-lg border border-amber-100'>
          <h4 className='font-medium text-amber-800 mb-2'>
            {t('services.common.importantNote')}
          </h4>
          <p className='text-amber-700 text-sm'>{t(service.disclaimer)}</p>
        </div>
      )}
    </div>
  );
}

// Orquestador principal que decide qué bloques de contenido mostrar
const ServiceContentOrchestrator: React.FC<ServiceContentProps> = ({
  service,
  primaryColor,
}) => {
  return (
    <div className='space-y-8'>
      {/* Bloque de descripción básica - siempre presente */}
      <ServiceDescriptionBlock service={service} primaryColor={primaryColor} />

      {/* Bloque de opciones - solo si hay opciones disponibles */}
      {service.options && Object.keys(service.options).length > 0 && (
        <ServiceOptionsBlock service={service} primaryColor={primaryColor} />
      )}

      {/* Bloque de includes/not includes - solo si existe alguno de estos datos */}
      {(service.includes?.length || service.notIncluded?.length) && (
        <ServiceIncludesBlock service={service} primaryColor={primaryColor} />
      )}

      {/* Bloque de itinerario - solo si hay itinerario */}
      {service.itinerary && service.itinerary.length > 0 && (
        <ServiceItineraryBlock service={service} primaryColor={primaryColor} />
      )}

      {/* Bloque de metadatos - solo si hay metadata relevante */}
      {service.metaData && Object.keys(service.metaData).length > 0 && (
        <ServiceMetadataBlock service={service} primaryColor={primaryColor} />
      )}

      {/* Bloque de disponibilidad - solo si hay datos de disponibilidad */}
      {service.availability && (
        <ServiceAvailabilityBlock
          service={service}
          primaryColor={primaryColor}
        />
      )}

      {/* Bloque de información adicional - solo si hay additionalInfoKeys */}
      {service.additionalInfoKeys && service.additionalInfoKeys.length > 0 && (
        <ServiceAdditionalInfoBlock
          service={service}
          primaryColor={primaryColor}
        />
      )}

      {/* Bloque de disclaimer - solo si hay disclaimers */}
      {service.disclaimer && (
        <ServiceDisclaimerBlock service={service} primaryColor={primaryColor} />
      )}
    </div>
  );
};

// Bloque de descripción básica del servicio
const ServiceDescriptionBlock: React.FC<ServiceContentProps> = ({
  service,
  primaryColor,
}) => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className='bg-white rounded-xl shadow-lg overflow-hidden'
    >
      <div className='p-6 md:p-8'>
        <h2 className='text-2xl font-bold text-gray-900 mb-2'>
          {t(service.titleKey)}
        </h2>
        <p className='text-lg text-gray-700 mb-6'>
          {t(service.descriptionKey)}
        </p>
        {service.fullDescriptionKey && (
          <p className='text-gray-700 mt-3'>{t(service.fullDescriptionKey)}</p>
        )}

        <div className='mt-6 flex flex-wrap gap-3'>
          {service.tags?.map((tag, index) => (
            <span
              key={index}
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-${primaryColor}-100 text-${primaryColor}-800`}
            >
              <Tag className='w-4 h-4 mr-1' />
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// Bloque de opciones del servicio
const ServiceOptionsBlock: React.FC<ServiceContentProps> = ({
  service,
  primaryColor,
}) => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className='bg-white rounded-xl shadow-lg overflow-hidden'
    >
      <div className='p-6 md:p-8'>
        <h3 className='text-xl font-bold text-gray-900 mb-6'>
          {t('services.common.options')}
        </h3>

        <div className='space-y-6'>
          {Object.entries(service.options || {}).map(([optionKey, option]) => (
            <div key={optionKey} className='option-category'>
              <h4 className='text-lg font-medium mb-3'>{t(option.nameKey)}</h4>
              {option.subOptions && (
                <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                  {Object.entries(option.subOptions).map(
                    ([subOptionKey, subOption]) => (
                      <div
                        key={subOptionKey}
                        className={`p-3 border rounded-lg ${
                          subOption.price && subOption.price > 0
                            ? `border-${primaryColor}-200`
                            : 'border-gray-200'
                        }`}
                      >
                        <div className='flex justify-between'>
                          <span>{t(subOption.nameKey)}</span>
                          {subOption.price !== undefined &&
                            subOption.price !== 0 && (
                              <span
                                className={`font-medium ${
                                  subOption.price > 0
                                    ? `text-${primaryColor}-600`
                                    : 'text-green-600'
                                }`}
                              >
                                {subOption.price > 0 ? '+' : ''}
                                {subOption.price} USD
                              </span>
                            )}
                        </div>
                        {subOption.descriptionKey && (
                          <p className='text-sm text-gray-500 mt-1'>
                            {t(subOption.descriptionKey)}
                          </p>
                        )}
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// Bloque de lo que incluye y no incluye el servicio
const ServiceIncludesBlock: React.FC<ServiceContentProps> = ({
  service,
  primaryColor,
}) => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className='bg-white rounded-xl shadow-lg overflow-hidden'
    >
      <div className='p-6 md:p-8'>
        <h3 className='text-xl font-bold text-gray-900 mb-6'>
          {t('services.common.whatsIncluded')}
        </h3>

        <div className='grid md:grid-cols-2 gap-8'>
          {service.includes && service.includes.length > 0 && (
            <div>
              <h4 className='text-lg font-semibold text-gray-800 mb-4 flex items-center'>
                <Check className={`mr-2 text-${primaryColor}-500`} size={18} />
                {t('services.common.includedInService')}
              </h4>

              <ul className='space-y-3'>
                {service.includes.map((includeKey, index) => (
                  <li key={index} className='flex items-start'>
                    <div
                      className={`mt-1 h-5 w-5 rounded-full bg-${primaryColor}-100 flex items-center justify-center mr-3 flex-shrink-0`}
                    >
                      <Check className={`h-3 w-3 text-${primaryColor}-600`} />
                    </div>
                    <span className='text-gray-700'>{t(includeKey)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {service.notIncluded && service.notIncluded.length > 0 && (
            <div>
              <h4 className='text-lg font-semibold text-gray-800 mb-4 flex items-center'>
                <DollarSign
                  className={`mr-2 text-${primaryColor}-500`}
                  size={18}
                />
                {t('services.common.notIncluded')}
              </h4>

              <ul className='space-y-3'>
                {service.notIncluded.map((notIncludedKey, index) => (
                  <li key={index} className='flex items-start text-gray-700'>
                    <div className='mt-1 h-5 w-5 flex items-center justify-center mr-3 flex-shrink-0'>
                      <span className='text-sm font-medium'>•</span>
                    </div>
                    <span>{t(notIncludedKey)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Bloque de itinerario del servicio
const ServiceItineraryBlock: React.FC<ServiceContentProps> = ({
  service,
  primaryColor,
}) => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className='bg-white rounded-xl shadow-lg overflow-hidden'
    >
      <div className='p-6 md:p-8'>
        <h3 className='text-xl font-bold text-gray-900 mb-6'>
          {t('services.common.whatToExpect')}
        </h3>

        <ol className='space-y-4'>
          {service.itinerary?.map((stepKey, index) => (
            <li key={index} className='flex items-start'>
              <div
                className={`mt-0.5 h-6 w-6 rounded-full bg-${primaryColor}-500 text-white flex items-center justify-center mr-3 flex-shrink-0 font-medium text-sm`}
              >
                {index + 1}
              </div>
              <span className='text-gray-700'>{t(stepKey)}</span>
            </li>
          ))}
        </ol>
      </div>
    </motion.div>
  );
};

// Bloque de metadatos del servicio
const ServiceMetadataBlock: React.FC<ServiceContentProps> = ({
  service,
  primaryColor,
}) => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className='bg-white rounded-xl shadow-lg overflow-hidden'
    >
      <div className='p-6 md:p-8'>
        <h3 className='text-xl font-bold text-gray-900 mb-6'>
          {t('services.common.details')}
        </h3>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {Object.entries(service.metaData || {}).map(([key, value]) => {
            // Convertir el valor a un formato presentable
            let displayValue = '';
            if (typeof value === 'boolean') {
              displayValue = value ? t('common.yes') : t('common.no');
            } else if (typeof value === 'string' && value.includes(',')) {
              // Asumir que es una lista separada por comas
              displayValue = value
                .split(',')
                .map((v) =>
                  t(`services.metadata.values.${v.trim()}`, {
                    defaultValue: v.trim(),
                  })
                )
                .join(', ');
            } else {
              displayValue = value?.toString() || '';
            }

            return (
              <div
                key={key}
                className={`p-3 bg-gray-50 rounded-lg border border-${primaryColor}-100`}
              >
                <div className='text-sm text-gray-500 capitalize'>
                  {t(`services.metadata.${key}`, {
                    defaultValue: key.replace(/([A-Z])/g, ' $1').trim(),
                  })}
                </div>
                <div className='font-medium'>{displayValue}</div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

// Bloque de disponibilidad del servicio
const ServiceAvailabilityBlock: React.FC<ServiceContentProps> = ({
  service,
  primaryColor,
}) => {
  const { t } = useTranslation();

  // Días de la semana
  const weekdays = [
    'services.days.sunday',
    'services.days.monday',
    'services.days.tuesday',
    'services.days.wednesday',
    'services.days.thursday',
    'services.days.friday',
    'services.days.saturday',
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className='bg-white rounded-xl shadow-lg overflow-hidden'
    >
      <div className='p-6 md:p-8'>
        <h3 className='text-xl font-bold text-gray-900 mb-6 flex items-center'>
          <Calendar className={`mr-2 text-${primaryColor}-500`} size={20} />
          {t('services.common.availability')}
        </h3>

        {service.availability?.daysOfWeek &&
          service.availability.daysOfWeek.length > 0 && (
            <div className='mb-6'>
              <h4 className='text-lg font-medium mb-3'>
                {t('services.common.availableDays')}
              </h4>
              <div className='flex flex-wrap gap-2'>
                {weekdays.map((day, index) => {
                  const isAvailable =
                    service.availability?.daysOfWeek?.includes(index);
                  return (
                    <div
                      key={index}
                      className={`py-1 px-3 rounded-lg text-sm font-medium ${
                        isAvailable
                          ? `bg-${primaryColor}-100 text-${primaryColor}-800`
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {t(day)}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        {service.availability?.hoursOfDay &&
          service.availability.hoursOfDay.length > 0 && (
            <div>
              <h4 className='text-lg font-medium mb-3'>
                {t('services.common.availableHours')}
              </h4>
              <div className='flex flex-wrap gap-2'>
                {service.availability.hoursOfDay.map((hour) => {
                  const formattedHour = `${hour}:00`;
                  return (
                    <div
                      key={hour}
                      className={`py-1 px-3 rounded-lg text-sm font-medium bg-${primaryColor}-100 text-${primaryColor}-800`}
                    >
                      {formattedHour}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
      </div>
    </motion.div>
  );
};

// Bloque de información adicional
const ServiceAdditionalInfoBlock: React.FC<ServiceContentProps> = ({
  service,
  primaryColor,
}) => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className='bg-white rounded-xl shadow-lg overflow-hidden'
    >
      <div className='p-6 md:p-8'>
        <h3 className='text-xl font-bold text-gray-900 mb-4 flex items-center'>
          <Info className={`mr-2 text-${primaryColor}-500`} size={20} />
          {t('services.common.additionalInfo')}
        </h3>

        <ul className='space-y-3'>
          {service.additionalInfoKeys?.map((infoKey, index) => (
            <li key={index} className='flex items-start'>
              <div
                className={`mt-1 h-5 w-5 rounded-full bg-${primaryColor}-100 flex items-center justify-center mr-3 flex-shrink-0`}
              >
                <Info className={`h-3 w-3 text-${primaryColor}-600`} />
              </div>
              <span className='text-gray-700'>{t(infoKey)}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

// Bloque de disclaimer
const ServiceDisclaimerBlock: React.FC<ServiceContentProps> = ({ service }) => {
  const { t } = useTranslation();

  // Si no hay disclaimer, no renderizamos nada
  if (!service.disclaimer) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.7 }}
      className='p-4 bg-amber-50 rounded-lg border border-amber-100'
    >
      <h4 className='font-medium text-amber-800 mb-2 flex items-center'>
        <Shield className='w-4 h-4 mr-2' />
        {t('services.common.importantNote')}
      </h4>
      <p className='text-amber-700'>{t(service.disclaimer)}</p>
    </motion.div>
  );
};

// Referencia a las funciones existentes para compatibilidad
// Estas ya están definidas arriba

export default ServiceContent;

function renderYogaService(
  yogaExtendedData: {
    yogaStyles: string[];
    includes: string[];
    notIncluded: string[];
    itinerary: string[];
    tagline: string;
    slogan: string;
  },
  primaryColor: string,
  t: (
    key: string,
    options?: { fallback?: string; [key: string]: any }
  ) => string,
  arg3: string
): React.ReactNode | Promise<React.ReactNode> {
  throw new Error('Function not implemented.');
}

function renderKaraokeService(
  karaokeExtendedData: {
    timeSlots: string[];
    includes: string[];
    notIncluded: string[];
    itinerary: string[];
    disclaimer: string | undefined;
    tagline: string;
    slogan: string;
  },
  primaryColor: string,
  t: (
    key: string,
    options?: { fallback?: string; [key: string]: any }
  ) => string,
  arg3: string
): React.ReactNode | Promise<React.ReactNode> {
  throw new Error('Function not implemented.');
}

function renderAirportTransferDetails(
  airportData: {
    title: string;
    description: string;
    priceUnit: string;
    timeSlots: string[];
    travelTime: string;
    includes: string[];
    notIncluded: string[];
    itinerary: string[];
    safetyStandards: string[];
    availability: string;
    disclaimer: string | undefined;
    fullDescription: string;
    tagline: string;
  },
  primaryColor: string
): React.ReactNode | Promise<React.ReactNode> {
  throw new Error('Function not implemented.');
}
