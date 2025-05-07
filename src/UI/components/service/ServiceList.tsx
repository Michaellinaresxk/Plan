'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Grid,
  Anchor,
  Map,
  Car,
  Heart,
  Utensils,
  Music,
  Star,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/client';
import { Service, BookingDate } from '@/types/type';
import ServiceCard from './ServiceCard';
import { useBooking } from '@/context/BookingContext';
import ServiceManager from '@/constants/services/ServiceManager';

interface EnhancedServiceListProps {
  services: Service[];
  variant?: 'light' | 'dark';
  textColor?: string;
  viewContext?: 'standard-view' | 'premium-view';
}

// Service categories definition for tabs
const serviceCategories = [
  {
    id: 'all',
    name: 'All Services',
    icon: <Grid size={20} />,
    description: 'View all available services',
  },
  {
    id: 'water-activities',
    name: 'Water Activities',
    icon: <Anchor size={20} />,
    description: 'Boating, fishing, and water adventures',
  },
  {
    id: 'tours',
    name: 'Tours & Excursions',
    icon: <Map size={20} />,
    description: 'Guided tours and adventures',
  },
  {
    id: 'transportation',
    name: 'Transportation',
    icon: <Car size={20} />,
    description: 'Transfers and vehicle rentals',
  },
  {
    id: 'wellness',
    name: 'Wellness & Fitness',
    icon: <Heart size={20} />,
    description: 'Yoga, fitness, and spa services',
  },
  {
    id: 'food-drinks',
    name: 'Food & Drinks',
    icon: <Utensils size={20} />,
    description: 'Culinary experiences and catering',
  },
  {
    id: 'leisure',
    name: 'Leisure & Entertainment',
    icon: <Music size={20} />,
    description: 'Entertainment and convenience services',
  },
  {
    id: 'luxury',
    name: 'Luxury Experiences',
    icon: <Star size={20} />,
    description: 'Premium and exclusive services',
  },
];

const ServiceList: React.FC<EnhancedServiceListProps> = ({
  services,
  variant = 'light',
  textColor,
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
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCategories, setShowCategories] = useState(false);

  // Filter services when search, category, or package type changes
  useEffect(() => {
    if (!packageType) return;

    let result = services.filter((service) =>
      service.packageType.includes(packageType)
    );

    // Apply category filter if not "all"
    if (selectedCategory !== 'all') {
      result = result.filter(
        (service) => ServiceManager.getCategory(service.id) === selectedCategory
      );
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (service) =>
          service.name.toLowerCase().includes(term) ||
          service.description.toLowerCase().includes(term)
      );
    }

    setFilteredServices(result);
  }, [services, packageType, selectedCategory, searchTerm]);

  // Check if a service is selected
  const isServiceSelected = (serviceId: string) => {
    return selectedServices.some((service) => service.id === serviceId);
  };

  // Handle service selection/deselection
  const handleServiceToggle = (service: Service) => {
    if (isServiceSelected(service.id)) {
      removeService(service.id);
    } else {
      addService(service);
    }
  };

  // Handle booking a service with specific dates and guests
  const handleBookService = (
    service: Service,
    dates: BookingDate,
    guests: number
  ) => {
    bookService(service, dates, guests);
  };

  if (!packageType) {
    return null;
  }

  const whiteTextStyle = { color: '#f59e0b' };

  return (
    <section
      id='services'
      className={`py-24 ${variant === 'light' ? 'bg-white' : 'bg-transparent'}`}
    >
      <div className='container mx-auto px-6'>
        <div className='text-center mb-16'>
          <h2
            className='text-4xl font-bold md:text-6xl  text-gray-900 mb-4'
            style={textColor === 'white' ? whiteTextStyle : {}}
          >
            {t(`services.title.${packageType}`)}
          </h2>
          <p
            className='text-lg text-gray-600 max-w-2xl mx-auto'
            style={textColor === 'white' ? whiteTextStyle : {}}
          >
            {t('services.subtitle')}
          </p>
        </div>

        {/* Search and filters bar */}
        <div className='flex flex-col md:flex-row gap-4 mb-8'>
          {/* Search bar */}
          <div className='flex-1'>
            <div className='relative'>
              <Search
                className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
                size={20}
              />
              <input
                type='text'
                placeholder={t('services.actions.search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300'
              />
            </div>
          </div>

          {/* Filter button - Mobile */}
          <div className='md:hidden'>
            <button
              onClick={() => setShowCategories(!showCategories)}
              className={`
                flex items-center justify-center w-full py-3 px-4 rounded-lg
                border border-gray-300 transition-colors
                ${
                  showCategories
                    ? packageType === 'standard'
                      ? 'bg-blue-50 border-blue-300 text-blue-700'
                      : 'bg-amber-50 border-amber-300 text-amber-700'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              <Filter size={20} className='mr-2' />
              <span>Categorías</span>
            </button>
          </div>
        </div>

        {/* Categories - Mobile accordion */}
        <motion.div
          className='md:hidden mb-6'
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: showCategories ? 'auto' : 0,
            opacity: showCategories ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          style={{ overflow: 'hidden' }}
        >
          <div className='grid grid-cols-2 gap-2 p-4 bg-gray-50 rounded-lg'>
            {serviceCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category.id);
                  setShowCategories(false);
                }}
                className={`
                  flex items-center p-3 rounded-md transition-colors
                  ${
                    selectedCategory === category.id
                      ? packageType === 'standard'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-amber-100 text-amber-700'
                      : 'bg-white hover:bg-gray-100 text-gray-700'
                  }
                `}
              >
                <span className='mr-2'>{category.icon}</span>
                <span className='text-sm font-medium'>{category.name}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Categories - Desktop tabs */}
        <div className='hidden md:flex mb-8 overflow-x-auto pb-2'>
          <div className='flex space-x-2'>
            {serviceCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`
                  flex items-center whitespace-nowrap py-2 px-4 rounded-full transition-colors
                  ${
                    selectedCategory === category.id
                      ? packageType === 'standard'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-amber-100 text-amber-700'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }
                `}
              >
                <span className='mr-2'>{category.icon}</span>
                <span className='font-medium'>{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div className='mb-6 text-gray-600'>
          {filteredServices.length === 0 ? (
            <p>No se encontraron servicios que coincidan con tus criterios.</p>
          ) : (
            <p>
              Mostrando {filteredServices.length}{' '}
              {filteredServices.length === 1 ? 'servicio' : 'servicios'}
            </p>
          )}
        </div>

        {/* Service grid */}
        <motion.div
          className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'
          initial='hidden'
          animate='visible'
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {filteredServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              isSelected={isServiceSelected(service.id)}
              packageType={packageType}
              onToggle={handleServiceToggle}
              onBookService={handleBookService}
              viewContext={viewContext}
            />
          ))}
        </motion.div>

        {/* Empty state */}
        {filteredServices.length === 0 && (
          <div className='text-center py-16 bg-gray-50 rounded-xl'>
            <svg
              className='mx-auto h-12 w-12 text-gray-400'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={1}
                d='M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
            <h3 className='mt-4 text-lg font-medium text-gray-900'>
              No se encontraron servicios
            </h3>
            <p className='mt-2 text-gray-600 max-w-md mx-auto'>
              Prueba ajustar tus criterios de búsqueda o filtros para encontrar
              servicios disponibles.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className={`
                mt-6 px-4 py-2 rounded-md text-white
                ${
                  packageType === 'standard'
                    ? 'bg-blue-500 hover:bg-blue-600'
                    : 'bg-amber-500 hover:bg-amber-600'
                }
              `}
            >
              Limpiar Filtros
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ServiceList;
