import React, { useState } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { ShoppingBag, Utensils, Wine, ShoppingCart } from 'lucide-react';
import GroceryShoppingSelector from '../../grocery/GroceryShoppingSelector';

// Interface for grocery items
interface GroceryItem {
  id: string;
  name: string;
  price: number;
  unit: string;
  quantity?: number;
}

interface GroceryShoppingServiceProps {
  onItemsSelected?: (items: GroceryItem[]) => void;
  handleOpenBookingModal?: () => void;
}

const GroceryShoppingService: React.FC<GroceryShoppingServiceProps> = ({
  onItemsSelected,
  handleOpenBookingModal,
  service,
}) => {
  const { t } = useTranslation();

  // State variables
  const [selectedItems, setSelectedItems] = useState<GroceryItem[]>([]);
  // Handle selected items from the grocery selector
  const handleItemsSelected = (items: GroceryItem[]) => {
    setSelectedItems(items);

    // Pass the selected items up to the parent
    if (onItemsSelected) {
      onItemsSelected(items);
    }
  };

  // Calculate total cart value
  const calculateTotal = (): number => {
    return selectedItems.reduce((total, item) => {
      return total + item.price * (item.quantity || 1);
    }, 0);
  };

  // Features for the info section
  const features = [
    {
      icon: <ShoppingBag size={20} className='text-blue-600' />,
      titleKey: 'grocery.features.convenience.title',
      titleFallback: 'Convenience',
      descriptionKey: 'grocery.features.convenience.description',
      descriptionFallback:
        'Get your groceries delivered directly to your accommodation without interrupting your vacation.',
    },
    {
      icon: <Utensils size={20} className='text-blue-600' />,
      titleKey: 'grocery.features.quality.title',
      titleFallback: 'Quality Products',
      descriptionKey: 'grocery.features.quality.description',
      descriptionFallback:
        'We select the freshest local produce and highest quality imported goods for your complete satisfaction.',
    },
    {
      icon: <Wine size={20} className='text-blue-600' />,
      titleKey: 'grocery.features.selection.title',
      titleFallback: 'Wide Selection',
      descriptionKey: 'grocery.features.selection.description',
      descriptionFallback:
        'Choose from our extensive selection of groceries, beverages, and specialty items for all your needs.',
    },
  ];

  // Working steps
  const steps = [
    {
      number: 1,
      textKey: 'grocery.service.step1',
      textFallback:
        'Select your groceries and beverages from our comprehensive list below.',
    },
    {
      number: 2,
      textKey: 'grocery.service.step2',
      textFallback:
        'Fill in your delivery details and any special dietary requirements.',
    },
    {
      number: 3,
      textKey: 'grocery.service.step3',
      textFallback:
        'Our team will shop for your groceries and deliver them to your accommodation at the scheduled time.',
    },
    {
      number: 4,
      textKey: 'grocery.service.step4',
      textFallback:
        'Enjoy your vacation with a fully stocked kitchen and your favorite drinks and snacks.',
    },
  ];

  // Feature card component
  const FeatureCard = ({
    icon,
    titleKey,
    titleFallback,
    descriptionKey,
    descriptionFallback,
  }: {
    icon: React.ReactNode;
    titleKey: string;
    titleFallback: string;
    descriptionKey: string;
    descriptionFallback: string;
  }) => (
    <div className='bg-gradient-to-br from-white to-blue-50 rounded-xl p-6 shadow-md transition-all duration-300 hover:shadow-lg border border-blue-100'>
      <div className='flex items-center mb-4'>
        <div className='p-3 bg-blue-100 rounded-full'>{icon}</div>
        <h3 className='ml-4 font-semibold text-gray-800'>
          {t(titleKey, { fallback: titleFallback })}
        </h3>
      </div>
      <p className='text-gray-600'>
        {t(descriptionKey, { fallback: descriptionFallback })}
      </p>
    </div>
  );

  return (
    <section className='py-8 max-w-7xl mx-auto'>
      {/* Features Section */}
      <div className='mb-16'>
        <h2 className='text-2xl font-bold text-gray-900 mb-6'>
          {t('grocery.features.title', {
            fallback: 'About Our Grocery Shopping Service',
          })}
        </h2>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              titleKey={feature.titleKey}
              titleFallback={feature.titleFallback}
              descriptionKey={feature.descriptionKey}
              descriptionFallback={feature.descriptionFallback}
            />
          ))}
        </div>
      </div>

      {/* How It Works Section */}
      <div className='mb-16'>
        <div className='bg-white rounded-xl p-8 shadow-sm border border-gray-100'>
          <h2 className='text-2xl font-bold text-gray-900 mb-6'>
            {t('grocery.service.howItWorks', { fallback: 'How It Works' })}
          </h2>

          <div className='space-y-6'>
            {steps.map((step) => (
              <div key={step.number} className='flex items-start'>
                <div className='flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white mr-4'>
                  <span className='text-sm font-medium'>{step.number}</span>
                </div>
                <div className='pt-1'>
                  <p className='text-gray-700'>
                    {t(step.textKey, { fallback: step.textFallback })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grocery Shopping Selector */}
      <div className='mt-12'>
        <h2 className='text-2xl font-bold text-gray-900 mb-6 flex items-center'>
          <ShoppingBag className='mr-2 text-blue-600' size={24} />
          {t('grocery.selector.selectItems', { fallback: 'Select Your Items' })}
        </h2>

        <GroceryShoppingSelector onItemsSelected={handleItemsSelected} />

        {/* Proceed Button - shown when items are selected */}
        {selectedItems.length > 0 && (
          <div className='mt-8'>
            <div className='bg-white rounded-xl p-6 shadow-md border border-blue-100'>
              <div className='flex flex-col md:flex-row justify-between items-center'>
                <div className='mb-4 md:mb-0'>
                  <h3 className='text-xl font-bold text-gray-900 mb-1'>
                    {t('grocery.selector.yourSelection', {
                      fallback: 'Your Selection',
                    })}
                  </h3>
                  <p className='text-gray-600'>
                    {selectedItems.length}{' '}
                    {t('grocery.selector.itemsSelected', {
                      fallback: 'items selected',
                    })}{' '}
                    - {t('grocery.selector.total', { fallback: 'Total' })}: $
                    {calculateTotal().toFixed(2)}
                  </p>
                </div>

                <button
                  onClick={handleOpenBookingModal}
                  className='flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-all duration-300'
                >
                  <ShoppingCart className='mr-2 h-5 w-5' />
                  {t('grocery.selector.proceedToCheckout', {
                    fallback: 'Proceed to Checkout',
                  })}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default GroceryShoppingService;
