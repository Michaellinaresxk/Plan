'use client';

import React, { useState, useEffect } from 'react';
import { useBooking } from '@/context/BookingContext';
import { useTranslation } from '@/lib/i18n/client';
import { Service, BookingDate } from '@/types/type';
import { Clock, Plus, Check, Info, Calendar, BadgeCheck } from 'lucide-react';
import RecommendedServiceCard from './ServiceRecomendationCard';

interface ServiceRecommendationsProps {
  services: Service[];
  purpose?: string; // El propósito del viaje (relajación, aventura, etc.)
  travelDates?: BookingDate;
  onRecommendationsSelected?: (selectedServices: Service[]) => void;
}

const ServiceRecommendations: React.FC<ServiceRecommendationsProps> = ({
  services,
  purpose,
  travelDates,
  onRecommendationsSelected,
}) => {
  const { t } = useTranslation();
  const { packageType, selectedServices, addService, removeService } =
    useBooking();

  const [recommendations, setRecommendations] = useState<Service[]>([]);
  const [dailySchedule, setDailySchedule] = useState<Record<string, Service[]>>(
    {}
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Generar recomendaciones basadas en el propósito y las fechas
    generateRecommendations();
  }, [services, purpose, travelDates]);

  // Función para generar recomendaciones basadas en el propósito
  const generateRecommendations = () => {
    setLoading(true);

    // Simulamos una carga de recomendaciones
    setTimeout(() => {
      let filteredServices = [...services];

      // Filtrar por tipo de paquete si está establecido
      if (packageType) {
        filteredServices = filteredServices.filter((service) =>
          service.packageType.includes(packageType)
        );
      }

      // Si hay un propósito definido, filtrar acorde a él
      if (purpose) {
        switch (purpose) {
          case 'relaxation':
            filteredServices = filterByCategories(filteredServices, [
              'wellness',
              'food-drinks',
            ]);
            break;
          case 'adventure':
            filteredServices = filterByCategories(filteredServices, [
              'water-activities',
              'tours',
            ]);
            break;
          case 'celebration':
            filteredServices = filterByCategories(filteredServices, [
              'food-drinks',
              'leisure',
            ]);
            break;
          case 'family':
            // Para familias, incluir una mezcla de actividades
            filteredServices = filterByCategories(filteredServices, [
              'water-activities',
              'leisure',
              'transportation',
            ]);
            break;
        }
      }

      // Limitar a un número razonable de recomendaciones
      const topRecommendations = filteredServices.slice(0, 6);

      // Establecer recomendaciones
      setRecommendations(topRecommendations);

      // Si hay fechas de viaje, crear un horario diario sugerido
      if (travelDates?.startDate && travelDates?.endDate) {
        createDailyScheduleSuggestion(topRecommendations, travelDates);
      }

      setLoading(false);
    }, 1000);
  };

  // Función para filtrar servicios por categorías
  const filterByCategories = (
    services: Service[],
    categories: string[]
  ): Service[] => {
    // Primero incluimos los servicios que coinciden con las categorías
    const matchingServices = services.filter((service) => {
      const category = getCategoryFromServiceId(service.id);
      return categories.includes(category);
    });

    // Si tenemos suficientes servicios, devolvemos solo los que coinciden
    if (matchingServices.length >= 4) {
      return matchingServices;
    }

    // Si no tenemos suficientes, añadimos algunos servicios adicionales
    const otherServices = services.filter((service) => {
      const category = getCategoryFromServiceId(service.id);
      return !categories.includes(category);
    });

    // Combinamos los servicios coincidentes con algunos adicionales
    return [
      ...matchingServices,
      ...otherServices.slice(0, 6 - matchingServices.length),
    ];
  };

  // Función auxiliar para determinar la categoría de un servicio a partir de su ID
  const getCategoryFromServiceId = (serviceId: string): string => {
    if (serviceId.includes('yoga') || serviceId.includes('masseuse')) {
      return 'wellness';
    } else if (serviceId.includes('catamaran') || serviceId.includes('yacht')) {
      return 'water-activities';
    } else if (serviceId.includes('chef')) {
      return 'food-drinks';
    } else if (
      serviceId.includes('music') ||
      serviceId.includes('babysitter')
    ) {
      return 'leisure';
    } else if (serviceId.includes('cart') || serviceId.includes('bike')) {
      return 'transportation';
    } else if (serviceId.includes('tour') || serviceId.includes('excursion')) {
      return 'tours';
    }

    return 'other';
  };

  // Función para crear una sugerencia de horario diario
  const createDailyScheduleSuggestion = () =>
    // services: Service[],
    // dates: BookingDate
    {
      const schedule: Record<string, Service[]> = {};

      // Obtener el número de días
      // const startDate = new Date(dates.startDate);
      // const endDate = new Date(dates.endDate);
      // const dayCount =
      //   Math.floor(
      //     (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)
      //   ) + 1;

      // Distribuir los servicios a lo largo de los días
      // for (let i = 0; i < dayCount; i++) {
      //   const currentDay = new Date(startDate);
      //   currentDay.setDate(startDay.getDate() + i);
      //   const dateKey = currentDay.toISOString().split('T')[0];

      //   // Asignar 1-2 servicios por día
      //   schedule[dateKey] = [];

      //   // Distribuir servicios evitando conflictos
      //   const servicesForDay = services
      //     .filter((service) => {
      //       // Evitar asignar el mismo servicio en múltiples días
      //       for (const day in schedule) {
      //         if (schedule[day].some((s) => s.id === service.id)) {
      //           return false;
      //         }
      //       }
      //       return true;
      //     })
      //     .slice(0, Math.min(2, services.length));

      //   schedule[dateKey] = servicesForDay;
      // }

      setDailySchedule(schedule);
    };

  // Función para manejar la selección/deselección de un servicio
  const toggleService = (service: Service) => {
    if (selectedServices.some((s) => s.id === service.id)) {
      removeService(service.id);
    } else {
      addService(service);
    }
  };

  // Función para comprobar si un servicio está seleccionado
  const isServiceSelected = (serviceId: string) => {
    return selectedServices.some((service) => service.id === serviceId);
  };

  // Función para manejar la aceptación de todas las recomendaciones
  const handleAcceptAll = () => {
    // Añadir todos los servicios recomendados que no estén ya seleccionados
    recommendations.forEach((service) => {
      if (!isServiceSelected(service.id)) {
        addService(service);
      }
    });

    // Notificar al componente padre si es necesario
    if (onRecommendationsSelected) {
      onRecommendationsSelected(selectedServices);
    }
  };

  // Si está cargando, mostrar un estado de carga
  if (loading) {
    return (
      <div className='max-w-4xl mx-auto py-8 px-4'>
        <div className='flex flex-col items-center justify-center py-12'>
          <div className='w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-4'></div>
          <p className='text-gray-600'>
            {t('recommendations.loading', {
              fallback: 'Generating personalized recommendations...',
            })}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-4xl mx-auto py-8 px-4'>
      <div className='mb-8'>
        <h2 className='text-2xl font-bold text-gray-900 mb-4'>
          {t('recommendations.title', {
            fallback: 'Recommended Services for You',
          })}
        </h2>
        <p className='text-gray-600'>
          {t('recommendations.subtitle', {
            fallback:
              'Based on your preferences, we recommend these services for your stay',
          })}
        </p>
      </div>

      {/* Recomendaciones generales */}
      <div className='mb-12'>
        <h3 className='text-lg font-medium text-gray-900 mb-4 flex items-center'>
          <BadgeCheck className='mr-2 h-5 w-5 text-blue-500' />
          {t('recommendations.topPicks', { fallback: 'Top Picks for You' })}
        </h3>

        <div className='grid sm:grid-cols-2 md:grid-cols-3 gap-6'>
          {recommendations.map((service) => (
            <RecommendedServiceCard
              key={service.id}
              service={service}
              isSelected={isServiceSelected(service.id)}
              onToggle={() => toggleService(service)}
              packageType={packageType || 'standard'}
            />
          ))}
        </div>

        {recommendations.length > 0 && (
          <div className='mt-6 flex justify-end'>
            <button
              onClick={handleAcceptAll}
              className={`
                px-6 py-3 rounded-lg font-medium flex items-center
                ${
                  packageType === 'standard'
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'bg-amber-500 hover:bg-amber-600 text-white'
                }
              `}
            >
              <Check className='mr-2 h-5 w-5' />
              {t('recommendations.acceptAll', {
                fallback: 'Accept All Recommendations',
              })}
            </button>
          </div>
        )}
      </div>

      {/* Sugerencia de horario diario */}
      {Object.keys(dailySchedule).length > 0 && (
        <div>
          <h3 className='text-lg font-medium text-gray-900 mb-4 flex items-center'>
            <Calendar className='mr-2 h-5 w-5 text-blue-500' />
            {t('recommendations.suggestedSchedule', {
              fallback: 'Suggested Daily Schedule',
            })}
          </h3>

          <div className='bg-white rounded-lg shadow-md p-4 md:p-6'>
            <p className='text-gray-600 mb-6 text-sm'>
              <Info className='inline-block mr-1 h-4 w-4' />
              {t('recommendations.scheduleInfo')}
            </p>

            <div className='space-y-6'>
              {Object.entries(dailySchedule).map(
                ([dateStr, servicesForDay]) => (
                  <div
                    key={dateStr}
                    className='border-b border-gray-200 pb-4 last:border-b-0 last:pb-0'
                  >
                    <h4 className='font-medium text-gray-900 mb-3'>
                      {new Date(dateStr).toLocaleDateString(undefined, {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </h4>

                    {servicesForDay.length > 0 ? (
                      <div className='space-y-2'>
                        {servicesForDay.map((service) => (
                          <div
                            key={service.id}
                            className='flex justify-between items-center p-3 bg-gray-50 rounded-lg'
                          >
                            <div>
                              <h5 className='font-medium text-gray-800'>
                                {service.name}
                              </h5>
                              <div className='text-sm text-gray-500 flex items-center mt-1'>
                                <Clock size={14} className='mr-1' />
                                <span>
                                  {service.duration}{' '}
                                  {service.duration === 1 ? 'hour' : 'hours'}
                                </span>
                              </div>
                            </div>

                            <button
                              onClick={() => toggleService(service)}
                              className={`
                              p-2 rounded-full
                              ${
                                isServiceSelected(service.id)
                                  ? packageType === 'standard'
                                    ? 'bg-blue-100 text-blue-600'
                                    : 'bg-amber-100 text-amber-600'
                                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                              }
                            `}
                            >
                              {isServiceSelected(service.id) ? (
                                <Check size={18} />
                              ) : (
                                <Plus size={18} />
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className='text-gray-500 italic text-sm'>
                        {t('recommendations.noServicesForDay', {
                          fallback: 'No services scheduled for this day',
                        })}
                      </p>
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceRecommendations;
