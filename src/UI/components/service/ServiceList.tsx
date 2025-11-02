'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Grid,
  Anchor,
  Map,
  Car,
  Heart,
  Utensils,
  Music,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/client';
import { Service, BookingDate } from '@/types/type';
import ServiceCard from './ServiceCard';
import { useBooking } from '@/context/BookingContext';
import ServiceManager from '@/constants/services/ServiceManager';

interface EnhancedServiceListProps {
  services: Service[];
  servicePath: string;
  variant?: 'light' | 'dark';
  textColor?: string;
  viewContext?: 'standard-view' | 'premium-view';
}

const ServiceList: React.FC<EnhancedServiceListProps> = ({
  services,
  servicePath,
  variant = 'light',
  viewContext,
}) => {
  const {
    packageType,
    selectedServices,
    addService,
    removeService,
    bookService,
  } = useBooking();
  const { t } = useTranslation();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const serviceCategories = [
    {
      id: 'all',
      name: t('services.standard.serviceGallery.categories.all'),
      icon: Grid,
      color: 'slate',
    },
    {
      id: 'water-activities',
      name: t('services.standard.serviceGallery.categories.waterActivities'),
      icon: Anchor,
      color: 'blue',
    },
    {
      id: 'tours',
      name: t('services.standard.serviceGallery.categories.tours'),
      icon: Map,
      color: 'green',
    },
    {
      id: 'transportation',
      name: t('services.standard.serviceGallery.categories.transportation'),
      icon: Car,
      color: 'purple',
    },
    {
      id: 'wellness',
      name: t('services.standard.serviceGallery.categories.wellness'),
      icon: Heart,
      color: 'pink',
    },
    {
      id: 'food-drinks',
      name: t('services.standard.serviceGallery.categories.foodDrinks'),
      icon: Utensils,
      color: 'orange',
    },
    {
      id: 'leisure',
      name: t('services.standard.serviceGallery.categories.leisure'),
      icon: Music,
      color: 'indigo',
    },
  ];

  const filteredServices = useMemo(() => {
    if (!packageType) return [];

    let result = services.filter((service) =>
      service.packageType.includes(packageType)
    );

    if (selectedCategory !== 'all') {
      result = result.filter(
        (service) => ServiceManager.getCategory(service.id) === selectedCategory
      );
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (service) =>
          service.name.toLowerCase().includes(term) ||
          service.description.toLowerCase().includes(term)
      );
    }

    return result;
  }, [services, packageType, selectedCategory, searchTerm]);

  const isServiceSelected = (serviceId: string) => {
    return selectedServices.some((service) => service.id === serviceId);
  };

  const handleServiceToggle = (service: Service) => {
    if (isServiceSelected(service.id)) {
      removeService(service.id);
    } else {
      addService(service);
    }
  };

  const handleBookService = (
    service: Service,
    dates: BookingDate,
    guests: number
  ) => {
    bookService(service, dates, guests);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
  };

  if (!packageType) {
    return null;
  }

  const themeColors = {
    standard: {
      primary: 'blue',
      primaryRgb: '59, 130, 246',
    },
    premium: {
      primary: 'amber',
      primaryRgb: '245, 158, 11',
    },
  };

  const theme = themeColors[packageType] || themeColors.standard;

  return (
    <section
      id='services'
      className={`py-16 ${
        variant === 'light' ? 'bg-gray-50/50' : 'bg-transparent'
      }`}
    >
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Modern Category Pills */}
        <div className='mb-8'>
          <div className='flex flex-wrap justify-center gap-2 sm:gap-3'>
            {serviceCategories.map((category) => {
              const Icon = category.icon;
              const isActive = selectedCategory === category.id;

              return (
                <motion.button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`
                    group relative flex items-center space-x-2 px-4 py-2.5 rounded-xl
                    font-medium text-sm transition-all duration-300
                    ${
                      isActive
                        ? `bg-${theme.primary}-500 text-white shadow-lg shadow-${theme.primary}-500/25`
                        : 'bg-white/70 text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-md'
                    }
                    backdrop-blur-sm border border-gray-200/50
                  `}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    backgroundColor: isActive
                      ? `rgb(${theme.primaryRgb})`
                      : undefined,
                    boxShadow: isActive
                      ? `0 8px 25px -8px rgba(${theme.primaryRgb}, 0.3)`
                      : undefined,
                  }}
                >
                  <Icon size={16} />
                  <span className='hidden sm:inline'>{category.name}</span>

                  {isActive && (
                    <motion.div
                      className='absolute inset-0 rounded-xl border-2 border-white/30'
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Results Summary */}
        <div className='flex items-center justify-between mb-8'>
          <motion.p
            className='text-gray-600 text-sm'
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={filteredServices.length}
          >
            <span className='font-semibold text-gray-900'>
              {filteredServices.length}
            </span>{' '}
            {filteredServices.length === 1 ? 'service' : 'services'} found
          </motion.p>

          {(searchTerm || selectedCategory !== 'all') && (
            <motion.button
              onClick={clearFilters}
              className='text-sm text-gray-500 hover:text-gray-700 transition-colors'
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              Clear filters
            </motion.button>
          )}
        </div>

        {/* Service Grid - SIMPLIFICADO SIN ANIMACIONES CONFLICTIVAS */}
        {filteredServices.length > 0 ? (
          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                servicePath={servicePath}
                isSelected={isServiceSelected(service.id)}
                packageType={packageType}
                onToggle={handleServiceToggle}
                onBookService={handleBookService}
                viewContext={viewContext}
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='text-center py-16'
          >
            <div className='max-w-sm mx-auto'>
              <div className='w-16 h-16 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center'>
                <Search className='w-6 h-6 text-gray-400' />
              </div>
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                No services found
              </h3>
              <p className='text-gray-600 mb-6'>
                Try adjusting your search terms or filters to find what you're
                looking for.
              </p>
              <motion.button
                onClick={clearFilters}
                className={`
                  px-6 py-3 rounded-xl text-white font-medium
                  bg-${theme.primary}-500 hover:bg-${theme.primary}-600
                  transition-colors shadow-lg
                `}
                style={{
                  backgroundColor: `rgb(${theme.primaryRgb})`,
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Clear all filters
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ServiceList;
