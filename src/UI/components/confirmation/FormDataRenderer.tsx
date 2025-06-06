import React from 'react';
import { useTranslation } from '@/lib/i18n/client';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ShoppingBag,
  Baby,
  Car,
  Music,
  Palette,
  Heart,
} from 'lucide-react';

interface GroceryItem {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  translationKey?: string;
}

interface FormDataRendererProps {
  formData: Record<string, any>;
  serviceType?: string;
}

const FormDataRenderer: React.FC<FormDataRendererProps> = ({
  formData,
  serviceType,
}) => {
  const { t } = useTranslation();

  // Helper function to safely render any value
  const renderValue = (value: any): React.ReactNode => {
    if (value === null || value === undefined) {
      return <span className='text-gray-400 italic'>Not specified</span>;
    }

    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }

    if (typeof value === 'string' || typeof value === 'number') {
      return value.toString();
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        return <span className='text-gray-400 italic'>None</span>;
      }

      // Special handling for grocery items
      if (value.length > 0 && typeof value[0] === 'object' && value[0]?.id) {
        return renderGroceryItems(value as GroceryItem[]);
      }

      // Regular array
      return (
        <ul className='list-disc list-inside space-y-1'>
          {value.map((item, index) => (
            <li key={index} className='text-sm text-gray-700'>
              {renderValue(item)}
            </li>
          ))}
        </ul>
      );
    }

    if (typeof value === 'object') {
      // Special handling for categorized items
      if (value.categorizedItems) {
        return renderCategorizedItems(value.categorizedItems);
      }

      // Regular object
      return (
        <div className='space-y-2'>
          {Object.entries(value).map(([key, val]) => (
            <div key={key} className='flex justify-between text-sm'>
              <span className='font-medium capitalize text-gray-600'>
                {key.replace(/([A-Z])/g, ' $1').trim()}:
              </span>
              <span className='text-gray-700'>{renderValue(val)}</span>
            </div>
          ))}
        </div>
      );
    }

    return String(value);
  };

  // Render grocery items in a clean format
  const renderGroceryItems = (items: GroceryItem[]) => {
    // Group by category
    const categorized = items.reduce((acc, item) => {
      const category = item.category || 'other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {} as Record<string, GroceryItem[]>);

    return (
      <div className='space-y-3'>
        {Object.entries(categorized).map(([category, categoryItems]) => (
          <div key={category} className='border-l-2 border-blue-200 pl-3'>
            <h4 className='font-semibold text-gray-800 capitalize mb-1'>
              {category} ({categoryItems.length})
            </h4>
            <div className='flex flex-wrap gap-2'>
              {categoryItems.map((item, index) => (
                <span
                  key={item.id || index}
                  className='inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full'
                >
                  {item.name || item.id}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Render categorized items structure
  const renderCategorizedItems = (categorizedItems: any) => {
    return (
      <div className='space-y-4'>
        {Object.entries(categorizedItems).map(
          ([category, categoryData]: [string, any]) => (
            <div
              key={category}
              className='border border-gray-200 rounded-lg p-3'
            >
              <h4 className='font-semibold text-gray-800 capitalize mb-2'>
                {category}
              </h4>
              {categoryData.subcategories && (
                <div className='space-y-2'>
                  {Object.entries(categoryData.subcategories).map(
                    ([subcat, items]: [string, any]) => (
                      <div key={subcat} className='ml-2'>
                        <span className='text-sm font-medium text-gray-600 capitalize'>
                          {subcat}:
                        </span>
                        <div className='flex flex-wrap gap-1 mt-1'>
                          {Array.isArray(items) &&
                            items.map((item, index) => (
                              <span
                                key={item?.id || index}
                                className='inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded'
                              >
                                {item?.name || item?.id || item}
                              </span>
                            ))}
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          )
        )}
      </div>
    );
  };

  // Get icon for field type
  const getFieldIcon = (key: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      date: <Calendar className='h-4 w-4' />,
      time: <Clock className='h-4 w-4' />,
      hour: <Clock className='h-4 w-4' />,
      deliveryAddress: <MapPin className='h-4 w-4' />,
      exactAddress: <MapPin className='h-4 w-4' />,
      location: <MapPin className='h-4 w-4' />,
      guests: <Users className='h-4 w-4' />,
      passengerCount: <Users className='h-4 w-4' />,
      children: <Baby className='h-4 w-4' />,
      childrenCount: <Baby className='h-4 w-4' />,
      vehicleType: <Car className='h-4 w-4' />,
      flightNumber: <Car className='h-4 w-4' />,
      items: <ShoppingBag className='h-4 w-4' />,
      categorizedItems: <ShoppingBag className='h-4 w-4' />,
      performer: <Music className='h-4 w-4' />,
      occasion: <Heart className='h-4 w-4' />,
      colors: <Palette className='h-4 w-4' />,
    };

    return iconMap[key] || null;
  };

  // Get field label
  const getFieldLabel = (key: string): string => {
    const labelMap: Record<string, string> = {
      date: 'Date',
      time: 'Time',
      hour: 'Hour',
      deliveryAddress: 'Delivery Address',
      exactAddress: 'Exact Address',
      location: 'Location',
      guests: 'Guests',
      passengerCount: 'Passengers',
      children: 'Children',
      childrenCount: 'Number of Children',
      childrenAges: 'Children Ages',
      vehicleType: 'Vehicle Type',
      flightNumber: 'Flight Number',
      airline: 'Airline',
      items: 'Selected Items',
      categorizedItems: 'Selected Items by Category',
      hasAllergies: 'Has Allergies',
      allergyDetails: 'Allergy Details',
      foodRestrictions: 'Food Restrictions',
      specialRequests: 'Special Requests',
      performer: 'Performer',
      occasion: 'Occasion',
      colors: 'Colors',
      theme: 'Theme',
      startTime: 'Start Time',
      endTime: 'End Time',
      serviceType: 'Service Type',
    };

    return (
      labelMap[key] ||
      key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())
    );
  };

  // Filter out internal/system fields
  const filteredData = Object.entries(formData).filter(([key]) => {
    const internalFields = ['serviceType'];
    return !internalFields.includes(key);
  });

  if (filteredData.length === 0) {
    return (
      <div className='text-center py-4 text-gray-500 italic'>
        No additional details provided
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {filteredData.map(([key, value]) => {
        const icon = getFieldIcon(key);
        const label = getFieldLabel(key);

        return (
          <div
            key={key}
            className='border-b border-gray-100 pb-3 last:border-b-0'
          >
            <div className='flex items-start gap-3'>
              {icon && (
                <div className='flex-shrink-0 mt-1 text-gray-500'>{icon}</div>
              )}
              <div className='flex-1 min-w-0'>
                <h4 className='text-sm font-medium text-gray-800 mb-1'>
                  {label}
                </h4>
                <div className='text-sm text-gray-700'>
                  {renderValue(value)}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FormDataRenderer;
