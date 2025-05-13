'use client';

import React, { useState, } from 'react';
import {
  X,

  Trash2,

} from 'lucide-react';
import { useBooking } from '@/context/BookingContext';
 // Import Next.js router
import { formatServiceDetails } from '@/utils/formatServiceDetails';
import ServiceFormFactory from '../forms/ServiceFormFactory';
import { Service } from '@/types/type';

const CartSidebar: React.FC = () => {
  const { isCartOpen, closeCart, selectedServices } =
    useBooking();
  const [activeForm, setActiveForm] = useState<Service | null>(null);
  const [cartItems, setCartItems] = useState<unknown[]>([]);

  // Handle opening a service form
  const handleOpenServiceForm = (service: Service) => {
    setActiveForm(service);
  };

  // Handle closing the active form
  const handleCloseServiceForm = () => {
    setActiveForm(null);
  };

  // Handle form submission
  const handleServiceFormSubmit = (formData: any) => {
    // Add the service to the cart with its form data
    const cartItem = {
      service: activeForm,
      formData: formData,
      calculatedPrice: formData.calculatedPrice,
      // Include a unique ID for this cart item
      id: `${activeForm?.id}-${Date.now()}`,
    };

    setCartItems((prev) => [...prev, cartItem]);

    // Close the form
    setActiveForm(null);
  };

  // Calculate total price including all cart items
  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.calculatedPrice || item.service.price);
    }, 0);
  };

  return (
    <div
      className={`fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-xl transform transition-transform duration-300 z-50 ${
        isCartOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className='flex flex-col h-full'>
        {/* Header */}
        <div className='flex items-center justify-between p-4 border-b'>
          <h2 className='text-lg font-semibold'>Your Cart</h2>
          <button
            onClick={closeCart}
            className='text-gray-400 hover:text-gray-600'
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className='flex-1 overflow-y-auto p-4'>
          {activeForm ? (
            // Show service form when active
            <ServiceFormFactory
              service={activeForm}
              onSubmit={handleServiceFormSubmit}
              onCancel={handleCloseServiceForm}
            />
          ) : (
            // Show cart contents when no form is active
            <>
              {/* Selected Services */}
              {selectedServices.length > 0 && (
                <div className='mb-6'>
                  <h3 className='text-sm font-medium text-gray-600 mb-3'>
                    Selected Services
                  </h3>
                  {selectedServices.map((service) => (
                    <div
                      key={service.id}
                      className='flex justify-between items-center p-3 bg-gray-50 rounded-md mb-2'
                    >
                      <div>
                        <h4 className='font-medium'>{service.name}</h4>
                        <p className='text-sm text-gray-500'>
                          {service.packageType.join(', ')}
                        </p>
                      </div>
                      <button
                        onClick={() => handleOpenServiceForm(service)}
                        className='text-blue-600 hover:text-blue-800 text-sm'
                      >
                        Configure
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Cart Items with Configuration */}
              {cartItems.length > 0 && (
                <div className='mb-6'>
                  <h3 className='text-sm font-medium text-gray-600 mb-3'>
                    Configured Services
                  </h3>
                  {cartItems.map((item) => (
                    <div key={item.id} className='p-3 border rounded-md mb-2'>
                      <div className='flex justify-between items-start mb-2'>
                        <div>
                          <h4 className='font-medium'>{item.service.name}</h4>
                          <p className='text-sm text-gray-500'>
                            {formatServiceDetails(item.formData)}
                          </p>
                        </div>
                        <button
                          onClick={() => removeCartItem(item.id)}
                          className='text-red-500 hover:text-red-700'
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className='text-right'>
                        <span className='font-medium text-blue-600'>
                          ${item.calculatedPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedServices.length === 0 && cartItems.length === 0 && (
                <p className='text-gray-500 text-center py-8'>
                  Your cart is empty
                </p>
              )}
            </>
          )}
        </div>

        {/* Footer with pricing */}
        {!activeForm && (
          <div className='border-t p-4'>
            <div className='flex justify-between mb-4'>
              <span className='font-medium'>Total:</span>
              <span className='font-bold text-xl'>
                ${calculateTotalPrice().toFixed(2)}
              </span>
            </div>
            <button
              className='w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors'
              onClick={() => {
                // Navigate to checkout
                console.log('Proceeding to checkout');
              }}
              disabled={cartItems.length === 0}
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartSidebar;
