// views/GroceryServiceView.tsx

import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { Service } from '@/types/type';
import { ServiceData } from '@/types/services';
import Image from 'next/image';
import {
  ShoppingBag,
  ShoppingCart,
  Truck,
  Clock,
  Sparkles,
  Info,
} from 'lucide-react';

import GroceryShoppingService from '@/UI/components/grocery/GroceryShoppingService';
import { motion } from 'framer-motion';

interface GroceryServiceViewProps {
  service: Service;
  serviceData?: ServiceData;
  primaryColor: string;
  viewContext?: 'standard-view' | 'premium-view';
}

const GroceryServiceView: React.FC<GroceryServiceViewProps> = ({
  service,
  serviceData,
  viewContext,
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('shop'); // 'shop' or 'cart'
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [specialRequests, setSpecialRequests] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const isPremium =
    viewContext === 'premium-view' || service.packageType.includes('premium');
  // State for the accordion

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  // Simulate form submission
  const handleSubmitOrder = () => {
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmissionSuccess(true);

      // Reset after showing success message
      setTimeout(() => {
        setCartItems([]);
        setSpecialRequests('');
        setSubmissionSuccess(false);
        setActiveTab('shop');
      }, 3000);
    }, 1500);
  };

  return (
    <div className='space-y-8 '>
      {/* Hero Section */}
      <motion.div
        className={`relative overflow-hidden rounded-2xl ${
          isPremium
            ? 'bg-gradient-to-r from-amber-900/90 to-amber-700/80'
            : 'bg-gradient-to-r from-blue-900/90 to-blue-700/80'
        }`}
        initial='hidden'
        animate='visible'
        variants={fadeIn}
      >
        <div className='absolute inset-0 -z-10'>
          <Image
            src='https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80'
            alt='Fresh groceries'
            fill
            className='object-cover opacity-30'
          />
        </div>
        <div className='p-10 md:p-16 text-white'>
          <div className='flex items-center mb-4'>
            {isPremium ? (
              <div className='flex items-center bg-amber-500/20 backdrop-blur-sm px-3 py-1 rounded-full border border-amber-500/40'>
                <Sparkles className='h-4 w-4 text-amber-300 mr-2' />
                <span className='text-xs font-semibold uppercase tracking-wider text-amber-100'>
                  Premium Grocery Service
                </span>
              </div>
            ) : (
              <div className='flex items-center bg-blue-500/20 backdrop-blur-sm px-3 py-1 rounded-full border border-blue-500/40'>
                <ShoppingBag className='h-4 w-4 text-blue-300 mr-2' />
                <span className='text-xs font-semibold uppercase tracking-wider text-blue-100'>
                  Grocery Delivery
                </span>
              </div>
            )}
          </div>
          <h1 className='text-3xl md:text-5xl font-bold mb-4 leading-tight'>
            {isPremium
              ? 'Premium Grocery Delivery & Stocking Service'
              : 'Fresh Groceries Delivered to Your Door'}
          </h1>
          <h2 className='text-xl md:text-2xl opacity-90 mb-8 max-w-3xl font-light'>
            {isPremium
              ? 'Your personalized grocery concierge service with premium selection and white-glove stocking'
              : 'We shop for the freshest local ingredients and deliver them right to your vacation rental'}
          </h2>
          <div className='flex flex-wrap items-center gap-4 text-sm'>
            <div className='flex items-center'>
              <Clock className='h-5 w-5 mr-2 opacity-80' />
              <span>
                {isPremium
                  ? 'Same-day delivery available'
                  : 'Delivery within 24-48 hours'}
              </span>
            </div>
            <div className='flex items-center'>
              <Truck className='h-5 w-5 mr-2 opacity-80' />
              <span>Island-wide delivery service</span>
            </div>
            <div className='flex items-center'>
              <ShoppingBag className='h-5 w-5 mr-2 opacity-80' />
              <span>Local & imported products</span>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        className='grid grid-cols-1 md:grid-cols-5 gap-8 items-center'
        initial='hidden'
        animate='visible'
        variants={fadeIn}
      >
        {/* Right Side with Images - Modernized */}
        <div className='md:col-span-2 space-y-6'>
          <div className='relative h-72 rounded-2xl overflow-hidden shadow-xl transition-transform duration-500 hover:scale-[1.02] group'>
            <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10'></div>
            <Image
              src='https://images.unsplash.com/photo-1584473457409-ce95b8a3affb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80'
              alt='Fresh produce'
              fill
              className='object-cover transition-transform duration-700 group-hover:scale-110'
            />
            <div className='absolute bottom-4 left-4 z-20 text-white'>
              <span
                className={`px-3 py-1 text-xs font-medium rounded-full ${
                  isPremium ? 'bg-amber-500' : 'bg-blue-500'
                }`}
              >
                Premium Selection
              </span>
            </div>
          </div>

          <div className='relative h-56 rounded-2xl overflow-hidden shadow-xl transition-transform duration-500 hover:scale-[1.02] group'>
            <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10'></div>
            <Image
              src='https://images.unsplash.com/photo-1605774337664-7a846e9cdf17?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80'
              alt='Grocery delivery'
              fill
              className='object-cover transition-transform duration-700 group-hover:scale-110'
            />
            <div className='absolute bottom-4 left-4 z-20 text-white'>
              <span
                className={`px-3 py-1 text-xs font-medium rounded-full ${
                  isPremium ? 'bg-amber-500' : 'bg-blue-500'
                }`}
              >
                Delivery Service
              </span>
            </div>
          </div>
        </div>
        {/* Main Content Section */}
        <div className='md:col-span-3'>
          <h2
            className={`text-3xl md:text-4xl font-bold mb-8 ${
              isPremium ? 'text-amber-800' : 'text-blue-800'
            } tracking-tight`}
          >
            {serviceData?.titleKey
              ? t(serviceData.titleKey)
              : isPremium
              ? 'Premium Villa Grocery Service'
              : 'Convenient Grocery Delivery'}
          </h2>
          <div className='prose max-w-none text-gray-700'>
            <p className='text-lg mb-6 leading-relaxed'>
              {serviceData?.descriptionKey
                ? t(serviceData.descriptionKey)
                : isPremium
                ? 'Our premium grocery service takes the hassle out of vacation planning. We carefully select the freshest local and imported products and deliver them directly to your villa, allowing you to focus on enjoying your stay.'
                : 'Skip the grocery store and let us do the shopping for you. We deliver fresh, high-quality groceries directly to your vacation rental so you can spend more time enjoying your stay.'}
            </p>
            {serviceData?.fullDescriptionKey && (
              <p className='mb-6 leading-relaxed'>
                {t(serviceData.fullDescriptionKey)}
              </p>
            )}

            {/* Process Steps - Modernized */}
            <div className='mt-12 relative'>
              {/* Decorative element */}
              <div
                className={`absolute left-4 top-12 bottom-12 w-0.5 ${
                  isPremium ? 'bg-amber-300' : 'bg-blue-300'
                } opacity-50`}
              ></div>

              <h3
                className={`text-2xl font-bold mb-8 ${
                  isPremium ? 'text-amber-700' : 'text-blue-700'
                }`}
              >
                How It Works
              </h3>

              <div className='space-y-8'>
                {/* Step 1 */}
                <div className='flex items-start group transition-all duration-300 hover:transform hover:translate-x-1'>
                  <div
                    className={`flex-shrink-0 h-10 w-10 rounded-full ${
                      isPremium
                        ? 'bg-gradient-to-tr from-amber-500 to-amber-300 shadow-amber-200'
                        : 'bg-gradient-to-tr from-blue-500 to-blue-300 shadow-blue-200'
                    } flex items-center justify-center mr-5 font-medium text-white shadow-lg z-10`}
                  >
                    1
                  </div>
                  <div className='pt-1'>
                    <h4 className='font-semibold text-gray-900 text-lg'>
                      Submit Your Order
                    </h4>
                    <p className='text-gray-600 mt-2'>
                      Send us your grocery list or choose from our curated
                      selections of local favorites.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className='flex items-start group transition-all duration-300 hover:transform hover:translate-x-1'>
                  <div
                    className={`flex-shrink-0 h-10 w-10 rounded-full ${
                      isPremium
                        ? 'bg-gradient-to-tr from-amber-500 to-amber-300 shadow-amber-200'
                        : 'bg-gradient-to-tr from-blue-500 to-blue-300 shadow-blue-200'
                    } flex items-center justify-center mr-5 font-medium text-white shadow-lg z-10`}
                  >
                    2
                  </div>
                  <div className='pt-1'>
                    <h4 className='font-semibold text-gray-900 text-lg'>
                      We Shop For You
                    </h4>
                    <p className='text-gray-600 mt-2'>
                      Our experienced shoppers carefully select the freshest
                      items from local markets and stores.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className='flex items-start group transition-all duration-300 hover:transform hover:translate-x-1'>
                  <div
                    className={`flex-shrink-0 h-10 w-10 rounded-full ${
                      isPremium
                        ? 'bg-gradient-to-tr from-amber-500 to-amber-300 shadow-amber-200'
                        : 'bg-gradient-to-tr from-blue-500 to-blue-300 shadow-blue-200'
                    } flex items-center justify-center mr-5 font-medium text-white shadow-lg z-10`}
                  >
                    3
                  </div>
                  <div className='pt-1'>
                    <h4 className='font-semibold text-gray-900 text-lg'>
                      Prompt Delivery
                    </h4>
                    <p className='text-gray-600 mt-2'>
                      {isPremium
                        ? 'We deliver and stock your kitchen at your preferred time.'
                        : 'We deliver your groceries to your door at your chosen time slot.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <GroceryShoppingService />
      {/* Call-to-Action Banner */}
      <motion.div
        className={`rounded-2xl overflow-hidden ${
          isPremium
            ? 'bg-gradient-to-r from-amber-600 to-amber-800'
            : 'bg-gradient-to-r from-blue-600 to-blue-800'
        }`}
        initial='hidden'
        animate='visible'
        variants={fadeIn}
      >
        <div className='p-10 md:p-16 text-white text-center'>
          <h2 className='text-3xl md:text-4xl font-bold mb-4'>
            Ready to Stock Your Villa?
          </h2>
          <p className='text-xl opacity-90 mb-8 max-w-2xl mx-auto'>
            {isPremium
              ? 'Experience our premium grocery service with personalized shopping and delivery'
              : 'Skip the grocery store and let us handle your shopping needs during your stay'}
          </p>
          <button
            className={`py-3 px-8 rounded-full bg-white flex items-center mx-auto font-medium ${
              isPremium ? 'text-amber-700' : 'text-blue-700'
            }`}
          >
            Place Your Order
            <ShoppingCart className='ml-2 h-5 w-5' />
          </button>
        </div>
      </motion.div>
      {/* Service Disclaimer */}
      <motion.div
        className='bg-gray-50 rounded-lg p-4 flex items-start'
        initial='hidden'
        animate='visible'
        variants={fadeIn}
      >
        <Info className='h-5 w-5 text-gray-500 mr-3 mt-0.5 flex-shrink-0' />
        <p className='text-sm text-gray-600'>
          Minimum order value of $50 applies to all grocery deliveries. Prices
          are subject to change based on market conditions.
          {isPremium
            ? ' Premium membership includes benefits such as reduced fees, priority scheduling, and additional services.'
            : ' Delivery fees may vary based on location and time of delivery.'}
        </p>
      </motion.div>
    </div>
  );
};

export default GroceryServiceView;
