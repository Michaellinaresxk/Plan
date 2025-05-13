// ServiceViewFactory.tsx

import React from 'react';
import { Service } from '@/types/type';
import { ServiceData, ServiceExtendedDetails } from '@/types/services';
import YogaServiceView from '../renders/YogaServiceView';
import ChefServiceView from '../renders/ChefServiceView';
import BabysitterServiceView from '../renders/BabysitterServiceView';
import AirportServiceView from '../renders/AirportServiceView';
import CatamaranServiceView from '../renders/CatamaranServiceView';
import MassageServiceView from '../renders/MassageServiceView'; // Importa el componente mejorado
import DefaultServiceView from './DefaultServiceView';

interface ServiceViewFactoryProps {
  service: Service;
  serviceData?: ServiceData;
  primaryColor: string;
}

const ServiceViewFactory: React.FC<ServiceViewFactoryProps> = ({
  service,
  serviceData,
  primaryColor,
}) => {
  // Extender los detalles del servicio
  const extendedDetails = serviceData?.id
    ? getServiceExtendedDetails(serviceData.id)
    : undefined;

  // Mapeo de tipos de servicios a componentes específicos
  const serviceViewMap: Record<string, React.ComponentType<any>> = {
    // Servicios estándar
    'yoga-standard': YogaServiceView,
    'private-chef': ChefServiceView,
    babysitter: BabysitterServiceView,
    'airport-transfers': AirportServiceView,
    'catamaran-trips': CatamaranServiceView,
    'massage-standard': MassageServiceView,

    // Servicios premium
    'luxe-yoga': YogaServiceView,
    'luxe-chef': ChefServiceView,
    'luxe-masseuse': MassageServiceView, // Servicio premium de masaje
    'luxe-airport': AirportServiceView,
    'private-yacht': CatamaranServiceView,
  };

  // Obtener el componente de vista adecuado o usar el predeterminado
  const ViewComponent = serviceViewMap[service.id] || DefaultServiceView;

  return (
    <ViewComponent
      service={service}
      serviceData={serviceData}
      extendedDetails={extendedDetails}
      primaryColor={primaryColor}
    />
  );
};

// Función para obtener detalles extendidos del servicio
// (Adaptada para trabajar con tu estructura existente)
function getServiceExtendedDetails(
  serviceId: string
): ServiceExtendedDetails | undefined {
  // Importar la función de getServiceExtendedDetails de tus archivos existentes
  // Esta es una implementación de respaldo si no puedes importar directamente
  try {
    // Intentar importar la función
    const {
      getServiceExtendedDetails,
    } = require('@/constants/services/serviceDetails');
    return getServiceExtendedDetails(serviceId);
  } catch (error) {
    console.error('Error getting extended details:', error);
    return undefined;
  }
}

export default ServiceViewFactory;
