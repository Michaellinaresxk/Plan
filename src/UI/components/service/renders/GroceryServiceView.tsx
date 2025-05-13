// views/GroceryServiceView.tsx

import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { Service } from '@/types/type';
import { ServiceData } from '@/types/services';
import {
  ShoppingBag,
  Check,
  ChevronDown,
  ChevronUp,
  PlusCircle,
  MinusCircle,
  ShoppingCart,
  FileText,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';

import GroceryShoppingService from '@/UI/components/grocery/GroceryShoppingService';

interface GroceryServiceViewProps {
  service: Service;
  serviceData?: ServiceData;
  primaryColor: string;
}

const GroceryServiceView: React.FC<GroceryServiceViewProps> = ({
  service,
  serviceData,
  primaryColor,
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('shop'); // 'shop' or 'cart'
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [specialRequests, setSpecialRequests] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  // Calculate cart totals
  const cartTotal = cartItems.reduce((total, item) => {
    return total + item.price * (item.quantity || 1);
  }, 0);

  const itemCount = cartItems.reduce((count, item) => {
    return count + (item.quantity || 1);
  }, 0);

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
      {/* Service description */}
      <div className={`bg-white rounded-xl shadow-lg overflow-hidden p-6`}>
        <div className='flex items-center mb-4'>
          <ShoppingBag className={`h-6 w-6 text-${primaryColor}-500 mr-3`} />
          <h2 className='text-2xl font-bold text-gray-900'>
            {t('services.grocery.title')}
          </h2>
        </div>
        <p className='text-lg text-gray-700 mb-6'>
          {serviceData?.descriptionKey
            ? t(serviceData.descriptionKey)
            : t('services.grocery.description')}
        </p>

        {/* Enhanced description with service highlights */}
        <div className='grid md:grid-cols-3 gap-4 mt-6'>
          <div
            className={`p-4 rounded-lg bg-${primaryColor}-50 flex flex-col items-center text-center`}
          >
            <div className={`rounded-full bg-${primaryColor}-100 p-3 mb-3`}>
              <RefreshCw className={`h-5 w-5 text-${primaryColor}-600`} />
            </div>
            <h3 className='font-medium text-gray-800 mb-1'>
              {t('services.grocery.fastDelivery')}
            </h3>
            <p className='text-sm text-gray-600'>
              {t('services.grocery.deliveryTime')}
            </p>
          </div>

          <div
            className={`p-4 rounded-lg bg-${primaryColor}-50 flex flex-col items-center text-center`}
          >
            <div className={`rounded-full bg-${primaryColor}-100 p-3 mb-3`}>
              <ShoppingCart className={`h-5 w-5 text-${primaryColor}-600`} />
            </div>
            <h3 className='font-medium text-gray-800 mb-1'>
              {t('services.grocery.wideSelection')}
            </h3>
            <p className='text-sm text-gray-600'>
              {t('services.grocery.localProducts')}
            </p>
          </div>

          <div
            className={`p-4 rounded-lg bg-${primaryColor}-50 flex flex-col items-center text-center`}
          >
            <div className={`rounded-full bg-${primaryColor}-100 p-3 mb-3`}>
              <FileText className={`h-5 w-5 text-${primaryColor}-600`} />
            </div>
            <h3 className='font-medium text-gray-800 mb-1'>
              {t('services.grocery.specialRequests')}
            </h3>
            <p className='text-sm text-gray-600'>
              {t('services.grocery.customOrders')}
            </p>
          </div>
        </div>
      </div>

      {/* Grocery shopping interface */}
      <div className={`bg-white rounded-xl shadow-lg overflow-hidden`}>
        <div className='p-6'>
          {/* Tab navigation */}
          <div className='flex border-b border-gray-200 mb-6'>
            <button
              onClick={() => setActiveTab('shop')}
              className={`py-3 px-5 font-medium border-b-2 mr-4 ${
                activeTab === 'shop'
                  ? `border-${primaryColor}-500 text-${primaryColor}-600`
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <ShoppingBag className='h-5 w-5 inline-block mr-2' />
              {t('services.grocery.shopItems')}
            </button>

            <button
              onClick={() => setActiveTab('cart')}
              className={`py-3 px-5 font-medium border-b-2 relative ${
                activeTab === 'cart'
                  ? `border-${primaryColor}-500 text-${primaryColor}-600`
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <ShoppingCart className='h-5 w-5 inline-block mr-2' />
              {t('services.grocery.cart')}

              {cartItems.length > 0 && (
                <span
                  className={`absolute -top-1 -right-1 bg-${primaryColor}-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs`}
                >
                  {cartItems.length}
                </span>
              )}
            </button>
          </div>

          {/* Main interface - shop or cart */}
          {activeTab === 'shop' ? (
            <div>
              {/* Main grocery shopping component */}
              <GroceryShoppingService />
            </div>
          ) : (
            <div>
              {/* Cart view */}
              {cartItems.length === 0 ? (
                <div className='text-center py-12'>
                  <div className='inline-block p-4 rounded-full bg-gray-100 mb-4'>
                    <ShoppingCart className='h-8 w-8 text-gray-400' />
                  </div>
                  <h3 className='text-lg font-medium text-gray-700 mb-2'>
                    {t('services.grocery.emptyCart')}
                  </h3>
                  <p className='text-gray-500 mb-4'>
                    {t('services.grocery.emptyCartMessage')}
                  </p>
                  <button
                    onClick={() => setActiveTab('shop')}
                    className={`px-4 py-2 bg-${primaryColor}-500 text-white rounded-lg hover:bg-${primaryColor}-600 transition-colors`}
                  >
                    {t('services.grocery.startShopping')}
                  </button>
                </div>
              ) : submissionSuccess ? (
                <div className='text-center py-12'>
                  <div
                    className={`inline-block p-4 rounded-full bg-green-100 mb-4`}
                  >
                    <Check className='h-8 w-8 text-green-500' />
                  </div>
                  <h3 className='text-lg font-medium text-gray-700 mb-2'>
                    {t('services.grocery.orderSuccess')}
                  </h3>
                  <p className='text-gray-500 mb-4'>
                    {t('services.grocery.orderSuccessMessage')}
                  </p>
                </div>
              ) : (
                <div>
                  <h3 className='text-xl font-semibold text-gray-800 mb-4'>
                    {t('services.grocery.yourOrder')}
                  </h3>

                  <div className='space-y-4 mb-6'>
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className='flex justify-between items-center p-3 border border-gray-200 rounded-lg'
                      >
                        <div>
                          <h4 className='font-medium text-gray-800'>
                            {item.name}
                          </h4>
                          <p className='text-sm text-gray-500'>
                            ${item.price.toFixed(2)} per {item.unit}
                          </p>
                        </div>

                        <div className='flex items-center'>
                          <button
                            onClick={() => {
                              /* Handle decrease */
                            }}
                            className='p-1 text-gray-500 hover:text-gray-700'
                          >
                            <MinusCircle size={18} />
                          </button>
                          <span className='mx-2 min-w-[30px] text-center'>
                            {item.quantity || 1}
                          </span>
                          <button
                            onClick={() => {
                              /* Handle increase */
                            }}
                            className='p-1 text-gray-500 hover:text-gray-700'
                          >
                            <PlusCircle size={18} />
                          </button>

                          <span className='font-medium ml-4'>
                            ${(item.price * (item.quantity || 1)).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Special requests */}
                  <div className='mb-6'>
                    <h4 className='font-medium text-gray-800 mb-2'>
                      {t('services.grocery.specialRequests')}
                    </h4>
                    <textarea
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                      rows={3}
                      placeholder={t(
                        'services.grocery.specialRequestsPlaceholder'
                      )}
                    ></textarea>
                  </div>

                  {/* Order summary */}
                  <div className={`p-4 bg-${primaryColor}-50 rounded-lg mb-6`}>
                    <h4 className='font-medium text-gray-800 mb-3'>
                      {t('services.grocery.orderSummary')}
                    </h4>

                    <div className='flex justify-between mb-2'>
                      <span className='text-gray-600'>
                        {t('services.grocery.subtotal')}
                      </span>
                      <span className='font-medium'>
                        ${cartTotal.toFixed(2)}
                      </span>
                    </div>

                    <div className='flex justify-between mb-2'>
                      <span className='text-gray-600'>
                        {t('services.grocery.deliveryFee')}
                      </span>
                      <span className='font-medium'>$10.00</span>
                    </div>

                    <div className='border-t border-gray-200 my-2 pt-2 flex justify-between'>
                      <span className='font-medium text-gray-800'>
                        {t('services.grocery.total')}
                      </span>
                      <span className='font-bold text-gray-800'>
                        ${(cartTotal + 10).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Submit button */}
                  <button
                    onClick={handleSubmitOrder}
                    disabled={isSubmitting}
                    className={`w-full py-3 px-4 flex items-center justify-center ${
                      isSubmitting
                        ? 'bg-gray-300 cursor-not-allowed'
                        : `bg-${primaryColor}-500 hover:bg-${primaryColor}-600`
                    } text-white font-medium rounded-lg transition-colors`}
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className='h-5 w-5 mr-2 animate-spin' />
                        {t('services.grocery.processing')}
                      </>
                    ) : (
                      <>
                        {t('services.grocery.placeOrder')}
                        <ArrowRight className='h-5 w-5 ml-2' />
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroceryServiceView;
