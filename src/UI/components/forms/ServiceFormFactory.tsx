// components/forms/ServiceFormFactory.tsx
import React from 'react';
import { useRouter } from 'next/navigation';
import { Service } from '@/types/type';
import { useReservation } from '@/context/BookingContext';
import AirportTransferForm from './AirportTransferForm';
import ChefForm from './chef/ChefFrom';
import DefaultServiceForm from './DefaultServiceForm';
import BabysitterForm from './BabysitterForm';
import CustomDecorationForm from './CustomDecorationForm';
import GroceryForm from './GroceryForm';
import YogaServiceForm from './YogaServiceForm';
import LiveMusicForm from './LiveMusicForm';

interface ServiceFormFactoryProps {
  service: Service;
  onCancel: () => void;
}

/**
 * Service Form Factory Component with Enhanced Debugging
 */
const ServiceFormFactory: React.FC<ServiceFormFactoryProps> = ({
  service,
  onCancel,
}) => {
  const router = useRouter();
  const { setReservationData } = useReservation();

  console.log('🏭 ServiceFormFactory initialized for service:', service.id);

  /**
   * Enhanced form submission handler with debugging
   */
  const createDebuggedOnSubmit = (formName: string) => {
    return (formData: Record<string, any>) => {
      console.log(`🚀 ${formName} - handleFormSubmit called with:`, formData);

      // Calculate total price
      const totalPrice =
        formData.calculatedPrice || formData.totalPrice || service.price;

      // Create reservation data structure
      const reservationData = {
        service,
        formData,
        totalPrice,
        bookingDate: new Date(),
      };

      console.log(
        `💾 ${formName} - Setting reservation data:`,
        reservationData
      );

      try {
        // Store in context for the confirmation page
        setReservationData(reservationData);
        console.log(`✅ ${formName} - Reservation data stored in context`);

        // ALSO store in localStorage as backup
        localStorage.setItem(
          'tempReservationData',
          JSON.stringify(reservationData)
        );
        console.log(
          `✅ ${formName} - Reservation data stored in localStorage as backup`
        );

        // CLOSE THE MODAL FIRST before navigating
        console.log(`🔒 ${formName} - Closing modal before navigation`);
        onCancel(); // This should close the modal

        // Small delay to ensure modal closes before navigation
        setTimeout(() => {
          console.log(
            `🔄 ${formName} - Navigating to /reservation-confirmation`
          );
          router.replace('/reservation-confirmation'); // Use replace instead of push
        }, 100);
      } catch (error) {
        console.error(`💥 ${formName} - Error in handleFormSubmit:`, error);
      }
    };
  };

  /**
   * Enhanced cancel handler with debugging
   */
  const createDebuggedOnCancel = (formName: string) => {
    return () => {
      console.log(`❌ ${formName} - Cancel called`);
      onCancel();
    };
  };

  /**
   * Form mapping with automatic debugging
   */
  const formMapping = [
    {
      condition: (id: string) =>
        id.includes('airport-transfer') || id.includes('airportTransfer'),
      name: 'AirportTransferForm',
      component: AirportTransferForm,
      icon: '✈️',
    },
    {
      condition: (id: string) => id.includes('custom-decorations'),
      name: 'CustomDecorationForm',
      component: CustomDecorationForm,
      icon: '🎨',
      isSpecial: true, // Uses different prop structure
    },
    {
      condition: (id: string) => id.includes('yoga-standard'),
      name: 'YogaServiceForm',
      component: YogaServiceForm,
      icon: '🧘',
    },
    {
      condition: (id: string) => id.includes('grocery-shopping'),
      name: 'GroceryForm',
      component: GroceryForm,
      icon: '🛒',
    },
    {
      condition: (id: string) => id.includes('chef'),
      name: 'ChefForm',
      component: ChefForm,
      icon: '👨‍🍳',
    },
    {
      condition: (id: string) => id.includes('babysitter'),
      name: 'BabysitterForm',
      component: BabysitterForm,
      icon: '👶',
    },
    {
      condition: (id: string) => id.includes('live-music'),
      name: 'LiveMusicForm',
      component: LiveMusicForm,
      icon: 'music',
    },
  ];

  /**
   * Determine which form to render based on service.id
   */
  const renderFormByServiceType = () => {
    console.log('🔍 Determining form type for service ID:', service.id);

    // Find matching form
    const matchedForm = formMapping.find((form) => form.condition(service.id));

    if (matchedForm) {
      console.log(`${matchedForm.icon} Rendering ${matchedForm.name}`);

      const FormComponent = matchedForm.component;
      const debuggedOnSubmit = createDebuggedOnSubmit(matchedForm.name);
      const debuggedOnCancel = createDebuggedOnCancel(matchedForm.name);

      // Handle special cases
      if (
        matchedForm.isSpecial &&
        matchedForm.name === 'CustomDecorationForm'
      ) {
        return (
          <FormComponent
            service={service}
            onBookService={(
              service: Service,
              dates: any,
              guests: number,
              formData: any
            ) => {
              console.log('🎨 CustomDecorationForm - onBookService called');
              const standardFormData = { ...formData, dates, guests };
              debuggedOnSubmit(standardFormData);
            }}
            onClose={debuggedOnCancel}
          />
        );
      }

      // Standard form structure
      return (
        <FormComponent
          service={service}
          onSubmit={debuggedOnSubmit}
          onCancel={debuggedOnCancel}
          {...(matchedForm.name === 'GroceryForm' ? { selectedItems: [] } : {})}
        />
      );
    }

    // Default fallback
    console.log('📝 Rendering DefaultServiceForm (fallback)');
    const debuggedOnSubmit = createDebuggedOnSubmit('DefaultServiceForm');
    const debuggedOnCancel = createDebuggedOnCancel('DefaultServiceForm');

    return (
      <DefaultServiceForm
        service={service}
        onSubmit={debuggedOnSubmit}
        onCancel={debuggedOnCancel}
      />
    );
  };

  return (
    <div className='service-form-container'>{renderFormByServiceType()}</div>
  );
};

export default ServiceFormFactory;
