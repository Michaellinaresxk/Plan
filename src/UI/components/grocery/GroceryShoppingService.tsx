// components/grocery/GroceryShoppingService.tsx - FINAL FIXED VERSION
import React, { useState, useCallback, useMemo, useRef } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import {
  ShoppingBag,
  Utensils,
  Wine,
  ShoppingCart,
  ArrowRight,
} from 'lucide-react';
import GroceryShoppingSelector from './GroceryShoppingSelector';

// Enhanced interface to match our expected structure
interface GroceryItem {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  translationKey?: string;
  price?: number;
  unit?: string;
  quantity?: number;
}

interface GroceryShoppingServiceProps {
  service?: any;
  onItemsSelected?: (itemIds: string[]) => void;
  handleOpenBookingModal?: () => void;
}

const GroceryShoppingService: React.FC<GroceryShoppingServiceProps> = ({
  service,
  onItemsSelected,
  handleOpenBookingModal,
}) => {
  const { t } = useTranslation();

  // State to track selected item IDs
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);

  // Use ref to track the last notified items to prevent duplicate calls
  const lastNotifiedItems = useRef<string[]>([]);

  // FIXED: Handle items selected without calling setState during render
  const handleItemsSelected = useCallback(
    (itemIds: string[]) => {
      console.log('🛒 GroceryShoppingService - Received item IDs:', itemIds);

      // Check if items actually changed to prevent unnecessary updates
      const itemsChanged =
        lastNotifiedItems.current.length !== itemIds.length ||
        !lastNotifiedItems.current.every(
          (item, index) => item === itemIds[index]
        );

      if (itemsChanged) {
        console.log('🛒 GroceryShoppingService - Items changed, updating...');

        // Update local state
        setSelectedItemIds(itemIds);

        // Update ref to track last notified items
        lastNotifiedItems.current = itemIds;

        // Notify parent - do this synchronously, not in useEffect
        if (onItemsSelected) {
          console.log(
            '🛒 GroceryShoppingService - Notifying parent immediately'
          );
          onItemsSelected(itemIds);
        }
      } else {
        console.log(
          '🛒 GroceryShoppingService - Items unchanged, skipping update'
        );
      }
    },
    [onItemsSelected]
  );

  // FIXED: Memoize the calculation to prevent unnecessary recalculations
  const estimatedTotal = useMemo(() => {
    const estimatedPricePerItem = 5; // $5 average per item
    const baseServiceFee = service?.price || 20;

    return baseServiceFee + selectedItemIds.length * estimatedPricePerItem;
  }, [selectedItemIds.length, service?.price]);

  // Memoize features to prevent recreation
  const features = useMemo(
    () => [
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
    ],
    []
  );

  // Memoize steps to prevent recreation
  const steps = useMemo(
    () => [
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
    ],
    []
  );

  const FeatureCard = useMemo(() => {
    return React.memo<{
      icon: React.ReactNode;
      titleKey: string;
      titleFallback: string;
      descriptionKey: string;
      descriptionFallback: string;
    }>(
      ({
        icon,
        titleKey,
        titleFallback,
        descriptionKey,
        descriptionFallback,
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
      )
    );
  }, [t]);

  return (
    <section className='py-8 px-3 max-w-7xl mx-auto'>
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
      <div className='mb-12 sm:mb-16 lg:mb-20'>
        <div className='bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-sm border border-gray-100'>
          <div className='flex flex-col lg:flex-row'>
            {/* Imagen */}
            <div className='lg:w-1/2 h-64 sm:h-80 lg:h-auto relative'>
              <img
                src='https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80&w=800'
                alt='How our grocery service works'
                className='absolute inset-0 w-full h-full object-cover'
              />
              <div className='absolute inset-0 bg-gradient-to-r from-blue-900/20 to-transparent lg:from-transparent lg:to-blue-900/10' />

              {/* Badge flotante en la imagen */}
              <div className='absolute top-4 left-4 sm:top-6 sm:left-6 bg-white/90 backdrop-blur-sm px-3 py-1 sm:px-4 sm:py-2 rounded-full border border-gray-200'>
                <span className='text-blue-600 font-semibold text-xs sm:text-sm'>
                  ✨ Simple Process
                </span>
              </div>
            </div>

            {/* Contenido */}
            <div className='lg:w-1/2 p-6 sm:p-8 lg:p-10 xl:p-12 flex flex-col justify-center'>
              <h2 className='text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-6 sm:mb-8'>
                {t('grocery.service.howItWorks', { fallback: 'How It Works' })}
              </h2>

              <div className='space-y-4 sm:space-y-6'>
                {steps.map((step) => (
                  <div key={step.number} className='flex items-start group'>
                    <div className='flex-shrink-0 flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-blue-500 group-hover:bg-blue-600 text-white mr-3 sm:mr-4 transition-colors duration-200'>
                      <span className='text-sm sm:text-base font-medium'>
                        {step.number}
                      </span>
                    </div>
                    <div className='pt-1 sm:pt-2 flex-1 min-w-0'>
                      <p className='text-gray-700 text-sm sm:text-base leading-relaxed'>
                        {t(step.textKey, { fallback: step.textFallback })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA opcional */}
              <div className='mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-100'>
                <button className='inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold text-sm sm:text-base transition-colors duration-200'>
                  <span>Get Started Now</span>
                  <ArrowRight className='ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform' />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grocery Shopping Selector */}
      <div className='mt-12'>
        <h2 className='text-2xl font-bold text-gray-900 mb-6 flex items-center'>
          <ShoppingBag className='mr-2 text-blue-600' size={24} />
          {t('grocery.selector.selectItems', { fallback: 'Select Your Items' })}
        </h2>

        <GroceryShoppingSelector
          onItemsSelected={handleItemsSelected}
          onSubmit={handleOpenBookingModal}
        />

        {/* Enhanced Proceed Button - shown when items are selected */}
        {selectedItemIds.length > 0 && (
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
                    {selectedItemIds.length}{' '}
                    {t('grocery.selector.itemsSelected', {
                      fallback: 'items selected',
                    })}{' '}
                    -{' '}
                    {t('grocery.selector.estimatedTotal', {
                      fallback: 'Estimated Total',
                    })}
                    : ${estimatedTotal.toFixed(2)}
                  </p>
                  <p className='text-xs text-gray-500 mt-1'>
                    {t('grocery.selector.finalPriceNote', {
                      fallback:
                        'Final price will be calculated based on actual market prices',
                    })}
                  </p>
                </div>

                <button
                  onClick={handleOpenBookingModal}
                  className='flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-all duration-300 min-w-[200px] justify-center'
                >
                  <ShoppingCart className='mr-2 h-5 w-5' />
                  {t('grocery.selector.proceedToCheckout', {
                    fallback: 'Proceed to Checkout',
                  })}
                </button>
              </div>

              {/* Debug info for development */}
              {process.env.NODE_ENV === 'development' && (
                <div className='mt-4 pt-4 border-t border-gray-200'>
                  <div className='text-xs text-gray-500'>
                    <strong>Debug Info:</strong> {selectedItemIds.length} items
                    selected
                    <br />
                    <strong>IDs:</strong>{' '}
                    {selectedItemIds.slice(0, 5).join(', ')}
                    {selectedItemIds.length > 5 && '...'}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default GroceryShoppingService;
