import React from 'react';
import { useTranslation } from '@/lib/i18n/client';
import GroceryShoppingSelector from './GroceryShoppingSelector';
import { ShoppingBag, Utensils, Wine } from 'lucide-react';

const GroceryShoppingService: React.FC = () => {
  const { t } = useTranslation();

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

  // Features data
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

  // Steps data
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
        'Submit your grocery list through our system at least 48 hours before your desired delivery.',
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

  return (
    <section className='py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
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
        <GroceryShoppingSelector />
      </div>
    </section>
  );
};

export default GroceryShoppingService;
