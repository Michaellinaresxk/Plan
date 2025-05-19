import React from 'react';
import { Service } from '@/types/type';
import AirportTransferForm from './AirportTransferForm';
import ChefForm from './chef/ChefFrom';
import DefaultServiceForm from './DefaultServiceForm';
import BabysitterForm from './BabysitterForm';
import CustomDecorationForm from './CustomDecorationForm';
import GroceryForm from './GroceryForm';
interface ServiceFormFactoryProps {
  service: Service;
  onSubmit: (formData: any) => void;
  onCancel: () => void;
}

/**
 * Service Form Factory Component
 *
 * This factory determines which specialized form to display based on the service type.
 * It handles the routing to different form components based on the service.id.
 */
const ServiceFormFactory: React.FC<ServiceFormFactoryProps> = ({
  service,
  onSubmit,
  onCancel,
}) => {
  // Determine which form to render based on service.id
  const renderFormByServiceType = () => {
    // Check for airport transfer service
    if (
      service.id.includes('airport-transfer') ||
      service.id.includes('airportTransfer')
    ) {
      return (
        <AirportTransferForm
          service={service}
          onSubmit={onSubmit}
          onCancel={onCancel}
        />
      );
    }

    // Check for airport transfer service
    if (service.id.includes('custom-decorations')) {
      return (
        <CustomDecorationForm
          service={service}
          onSubmit={onSubmit}
          onCancel={onCancel}
        />
      );
    }

    // Check for airport transfer service
    if (service.id.includes('grocery-shopping')) {
      return (
        <GroceryForm
          service={service}
          onSubmit={onSubmit}
          onCancel={onCancel}
        />
      );
    }

    // Check for chef service
    if (service.id.includes('chef')) {
      return (
        <ChefForm service={service} onSubmit={onSubmit} onCancel={onCancel} />
      );
    }

    // Check for babySitter service
    if (service.id.includes('babysitter')) {
      return (
        <BabysitterForm
          service={service}
          onSubmit={onSubmit}
          onCancel={onCancel}
        />
      );
    }

    // Default to generic service form
    return (
      <DefaultServiceForm
        service={service}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />
    );
  };

  return (
    <div className='service-form-container'>{renderFormByServiceType()}</div>
  );
};

export default ServiceFormFactory;
