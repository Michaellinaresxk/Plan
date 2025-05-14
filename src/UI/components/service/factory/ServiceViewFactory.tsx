import React from 'react';
import { Service } from '@/types/type';
import { ServiceData } from '@/types/services';
import YogaServiceView from '../renders/YogaServiceView';
import ChefServiceView from '../renders/ChefServiceView';
import BabysitterServiceView from '../renders/BabysitterServiceView';
import AirportServiceView from '../renders/AirportServiceView';
import CatamaranServiceView from '../renders/CatamaranServiceView';
import GroceryServiceView from '../renders/GroceryServiceView';
import LiveMusicServiceView from '../renders/LiveMusicServiceView';
import KaraokeServiceView from '../renders/KaraokeServiceView';
import CustomDecorationsServiceView from '../renders/CustomDecorationsServiceView';
import DefaultServiceView from './DefaultServiceView';

interface ServiceViewFactoryProps {
  service: Service;
  serviceData?: ServiceData;
  primaryColor: string;
}

/**
 * Service View Factory
 *
 * This component follows the Factory Pattern to instantiate the appropriate
 * view component based on the service type. It centralizes the mapping logic
 * and makes it easy to extend with new service views.
 */
const ServiceViewFactory: React.FC<ServiceViewFactoryProps> = ({
  service,
  serviceData,
  primaryColor,
}) => {
  // Mapping of service IDs to their specialized view components
  const serviceViewMap: Record<string, React.ComponentType<any>> = {
    // Standard services
    'yoga-standard': YogaServiceView,
    'private-chef': ChefServiceView,
    babysitter: BabysitterServiceView,
    'airport-transfers': AirportServiceView,
    'catamaran-trips': CatamaranServiceView,
    'private-catamaran': CatamaranServiceView,
    'grocery-shopping': GroceryServiceView,
    'live-music': LiveMusicServiceView,
    karaoke: KaraokeServiceView,
    'custom-decorations': CustomDecorationsServiceView,

    // Premium services
    'luxe-yoga': YogaServiceView,
    'luxe-culinary': ChefServiceView,
    'luxe-arrival': AirportServiceView,
    'private-yacht': CatamaranServiceView,
    'luxe-yacht': CatamaranServiceView,
  };

  // Get the specific view component for this service or fall back to the default view
  const ViewComponent = serviceViewMap[service.id] || DefaultServiceView;

  return (
    <ViewComponent
      service={service}
      serviceData={serviceData}
      primaryColor={primaryColor}
    />
  );
};

export default ServiceViewFactory;
