import React from 'react';
import { Service } from '@/types/type';
import { ServiceData } from '@/types/services';
import YogaServiceView from '../renders/YogaServiceView';
import ChefServiceView from '../renders/ChefServiceView';
import BabysitterServiceView from '../renders/BabysitterServiceView';
import AirportServiceView from '../renders/AirportServiceView';
import LuxYogaExperience from '../renders/LuxeYogaExperience';
import CatamaranServiceView from '../renders/CatamaranServiceView';
import LiveMusicServiceView from '../renders/LiveMusicServiceView';
import KaraokeServiceView from '../renders/KaraokeServiceView';
import SaonaIslandTourServiceView from '../renders/SaonaIslandTourServiceView';
import CustomDecorationsServiceView from '../renders/CustomDecorationsServiceView';
import PersonalTrainerServiceView from '../renders/PersonalTrainerServiceView';
import BikeRentalServiceView from '../renders/BikeRentalServiceView';
import DefaultServiceView from './DefaultServiceView';
import MassageServiceView from '../renders/MassageServiceView';
import LuxeYachtServiceView from '../renders/LuxeYachtServiceView';
import GolfCartServiceView from '../renders/GolfCartServiceView';
import HorseBackRidingServiceView from '../renders/HorseBackRidingServiceView';
import AtvRideServiceView from '../renders/AtvRideServiceView';

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
    'saona-island-tour': SaonaIslandTourServiceView,
    'live-music': LiveMusicServiceView,
    karaoke: KaraokeServiceView,
    'custom-decorations': CustomDecorationsServiceView,
    'personal-training': PersonalTrainerServiceView,
    'bike-rentals': BikeRentalServiceView,
    'standard-massage': MassageServiceView,
    'golf-cart-rentals': GolfCartServiceView,
    'horseback-riding': HorseBackRidingServiceView,
    'atv-excursions': AtvRideServiceView,

    // Premium services
    'luxe-yoga': LuxYogaExperience,
    'luxe-culinary': ChefServiceView,
    'luxe-arrival': AirportServiceView,
    'private-yacht': CatamaranServiceView,
    'luxe-yacht': LuxeYachtServiceView,
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
