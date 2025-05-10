// src/components/dayplanner/ServiceSearchModal.tsx
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Search,
  Grid,
  Map,
  Car,
  Heart,
  Utensils,
  Music,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/client';
import { Service } from '@/types/type';
import ServiceCard from './ServiceCard';
import ServiceManager from '@/constants/services/ServiceManager';

interface ServiceSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableServices: Service[];
  onServiceSelect: (service: Service) => void;
}

const categories = [
  { id: 'all', name: 'Todos', icon: <Grid size={20} /> },
  {
    id: 'water-activities',
    name: 'Actividades Acuáticas',
    icon: <Map size={20} />,
  },
  { id: 'tours', name: 'Tours', icon: <Map size={20} /> },
  { id: 'transportation', name: 'Transporte', icon: <Car size={20} /> },
  { id: 'wellness', name: 'Bienestar', icon: <Heart size={20} /> },
  { id: 'food-drinks', name: 'Comida y Bebidas', icon: <Utensils size={20} /> },
  { id: 'leisure', name: 'Ocio', icon: <Music size={20} /> },
];

const ServiceSearchModal: React.FC<ServiceSearchModalProps> = ({
  isOpen,
  onClose,
  availableServices,
  onServiceSelect,
}) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredServices = useMemo(() => {
    return availableServices.filter((service) => {
      const matchesSearch =
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === 'all' ||
        ServiceManager.getCategory(service.id) === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [availableServices, searchTerm, selectedCategory]);

  const handleServiceSelect = (service: Service) => {
    onServiceSelect(service);
    onClose();
    setSearchTerm('');
    setSelectedCategory('all');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4'
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className='bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden'
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className='flex items-center justify-between p-6 border-b'>
            <h2 className='text-2xl font-bold'>
              {t('dayplanner.selectService')}
            </h2>
            <button
              onClick={onClose}
              className='p-2 rounded-full hover:bg-gray-100'
            >
              <X size={24} className='text-gray-500' />
            </button>
          </div>

          {/* Search and Filters */}
          <div className='p-6 border-b'>
            <div className='relative mb-4'>
              <Search
                className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
                size={20}
              />
              <input
                type='text'
                placeholder={t('services.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              />
            </div>

            <div className='flex overflow-x-auto pb-2 gap-2'>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center px-4 py-2 rounded-full whitespace-nowrap ${
                    selectedCategory === category.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.icon}
                  <span className='ml-2'>{category.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Services List */}
          <div className='p-6 overflow-y-auto max-h-[60vh]'>
            {filteredServices.length === 0 ? (
              <div className='text-center py-12 text-gray-500'>
                <p>{t('services.noResults')}</p>
              </div>
            ) : (
              <div className='grid md:grid-cols-2 gap-4'>
                {filteredServices.map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    isSelected={false}
                    onToggle={() => handleServiceSelect(service)}
                    variant='compact'
                  />
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ServiceSearchModal;
