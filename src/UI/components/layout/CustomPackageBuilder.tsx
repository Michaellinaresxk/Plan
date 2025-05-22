'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Service } from '@/types/type';
import { useTranslation } from '@/lib/i18n/client';
import { useBooking } from '@/context/BookingContext';
import {
  Package,
  Grid,
  X,
  Plus,
  Heart,
  Save,
  ShoppingCart,
  Filter,
  Search,
  DollarSign,
  Clock,
  Check,
  Info,
} from 'lucide-react';
import Image from 'next/image';
import router from 'next/router';
import ServiceManager from '@/constants/services/ServiceManager';
import { getServiceTranslationPath } from '@/utils/servicesUtils';

interface CustomPackageBuilderProps {
  services: Service[];
}

// Service card for selection grid
const ServiceCard = ({
  service,
  isSelected,
  onToggle,
  t,
}: {
  service: Service;
  isSelected: boolean;
  onToggle: () => void;
  t: any;
}) => {
  // Animation variants for selection
  const cardVariants = {
    selected: {
      scale: [1, 1.05, 1],
      borderColor: isSelected
        ? service.packageType.includes('premium')
          ? '#F59E0B'
          : '#3B82F6'
        : '#E5E7EB',
      transition: { duration: 0.3 },
    },
    unselected: {
      scale: 1,
      borderColor: '#E5E7EB',
      transition: { duration: 0.3 },
    },
  };
  const translationPath = getServiceTranslationPath(service.id);
  const isPremium = service.packageType.includes('premium');

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    e.currentTarget.src = '/images/placeholder-service.jpg';
  };

  return (
    <motion.div
      id={`service-card-${service.id}`}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      animate={isSelected ? 'selected' : 'unselected'}
      variants={cardVariants}
      className={`
        relative bg-white rounded-lg shadow-sm overflow-hidden border package-card
        ${
          isSelected
            ? isPremium
              ? 'border-amber-500 ring-2 ring-amber-200'
              : 'border-blue-500 ring-2 ring-blue-200'
            : 'border-gray-200'
        }
      `}
    >
      {/* Service Image */}
      <div className='relative h-32 overflow-hidden'>
        <Image
          src={service.img || `/images/services/${service.id}.jpg`}
          alt={t(`${translationPath}.name`, { fallback: service.name })}
          width={150}
          height={100}
          className='w-full h-full object-cover'
          onError={handleImageError}
          unoptimized={service.img?.startsWith('http')}
        />

        {/* Package Type Badge */}
        <div
          className={`absolute top-2 right-2 px-2 py-1 text-xs font-medium rounded-full ${
            isPremium ? 'bg-amber-500 text-white' : 'bg-blue-500 text-white'
          }`}
        >
          {isPremium ? 'Premium' : 'Standard'}
        </div>
      </div>

      {/* Content */}
      <div className='p-3'>
        <h3 className='font-medium text-gray-900 mb-1 line-clamp-1'>
          {t(`${translationPath}.name`, { fallback: service.name })}
        </h3>

        <div className='flex justify-between items-center mb-3 text-sm'>
          <div className='flex items-center text-gray-500'>
            <Clock size={14} className='mr-1' />
            <span>{service.duration}h</span>
          </div>
          <div className='font-medium text-gray-900'>${service.price}</div>
        </div>

        <button
          onClick={onToggle}
          className={`
            w-full py-1.5 px-2 rounded text-sm font-medium flex items-center justify-center
            ${
              isSelected
                ? isPremium
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }
          `}
        >
          {isSelected ? (
            <>
              <Check size={14} className='mr-1' />
              {t('customPackage.selected', { fallback: 'Selected' })}
            </>
          ) : (
            <>
              <Plus size={14} className='mr-1' />
              {t('customPackage.select', { fallback: 'Add' })}
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};

// Sortable service item for the selected services list
const SortableServiceItem = ({
  service,
  onRemove,
  t,
}: {
  service: Service;
  onRemove: () => void;
  t: any;
}) => {
  const translationPath = getServiceTranslationPath(service.id);
  const isPremium = service.packageType.includes('premium');

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: service.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      id={`sortable-${service.id}`}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        flex items-center p-2 mb-2 bg-white rounded-lg shadow-sm border sortable-item
        ${isPremium ? 'border-amber-200' : 'border-blue-200'} 
        ${isDragging ? 'dragging' : 'hover:shadow-md'} 
        cursor-grab active:cursor-grabbing
      `}
    >
      <div className='flex-shrink-0 w-10 h-10 relative rounded overflow-hidden mr-3'>
        <Image
          src={service.img || `/images/services/${service.id}.jpg`}
          alt={service.name}
          fill
          className='object-cover'
          unoptimized={service.img?.startsWith('http')}
        />
      </div>

      <div className='flex-grow min-w-0'>
        <h4 className='font-medium text-gray-900 text-sm truncate'>
          {t(`${translationPath}.name`, { fallback: service.name })}
        </h4>
        <p className='text-xs text-gray-500 flex items-center'>
          <DollarSign size={12} className='mr-1' />
          {service.price}
        </p>
      </div>

      <button
        onClick={onRemove}
        className='ml-2 p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50'
        aria-label='Remove service'
      >
        <X size={14} />
      </button>
    </div>
  );
};

const CustomPackageBuilder: React.FC<CustomPackageBuilderProps> = ({
  services,
}) => {
  const { t } = useTranslation();
  const {
    packageType,
    selectedServices,
    setPackageType,
    addService,
    removeService,
    calculateTotalPrice,
    reorderServices,
  } = useBooking();

  const [activeId, setActiveId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [customPackageName, setCustomPackageName] = useState('');
  const [savedPackages, setSavedPackages] = useState<
    { name: string; services: Service[] }[]
  >([]);
  const [showSavedPackages, setShowSavedPackages] = useState(false);

  // Filter services when search term, category, or package type changes
  useEffect(() => {
    if (!packageType) return;

    let filtered = services.filter((service) =>
      service.packageType.includes(packageType)
    );

    // Apply category filter
    if (activeCategory !== 'all') {
      filtered = filtered.filter(
        (service) => ServiceManager.getCategory(service.id) === activeCategory
      );
    }

    // Apply search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (service) =>
          service.name.toLowerCase().includes(term) ||
          service.description.toLowerCase().includes(term)
      );
    }

    setFilteredServices(filtered);
  }, [services, packageType, activeCategory, searchTerm]);

  // Load saved packages from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('savedPackages');
      if (saved) {
        try {
          setSavedPackages(JSON.parse(saved));
        } catch (e) {
          console.error('Error loading saved packages', e);
        }
      }
    }
  }, []);

  // Configure DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px of movement required before activating
      },
    }),
    useSensor(KeyboardSensor)
  );

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    const id = event.active.id as string;
    setActiveId(id);

    // Añadir clase visual para mejor feedback
    const element = document.getElementById(`sortable-${id}`);
    if (element) {
      element.classList.add('dragging');
    }
  };

  // Handle drag end (reordering selected services)
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    // Eliminar clase visual
    const element = document.getElementById(`sortable-${active.id}`);
    if (element) {
      element.classList.remove('dragging');
    }

    setActiveId(null);

    if (over && active.id !== over.id) {
      // Find the indices of the active and over items
      const activeIndex = selectedServices.findIndex((s) => s.id === active.id);
      const overIndex = selectedServices.findIndex((s) => s.id === over.id);

      if (activeIndex !== -1 && overIndex !== -1) {
        // Create a new array with the items reordered
        const newServices = [...selectedServices];
        const movedService = newServices.splice(activeIndex, 1)[0];
        newServices.splice(overIndex, 0, movedService);

        // Update the selectedServices in the booking context
        reorderServices(newServices);
      }
    }
  };

  // Clear all selected services
  const clearAllServices = () => {
    if (selectedServices.length === 0) return;

    // Mostrar confirmación antes de limpiar
    if (
      window.confirm(
        t('customPackage.confirmClear', {
          fallback: 'Are you sure you want to clear all selected services?',
        })
      )
    ) {
      selectedServices.forEach((service) => removeService(service.id));
    }
  };

  // Toggle service selection with visual feedback
  const toggleService = (service: Service) => {
    if (selectedServices.some((s) => s.id === service.id)) {
      // Show visual feedback before removing
      const serviceElement = document.getElementById(
        `service-card-${service.id}`
      );
      if (serviceElement) {
        serviceElement.classList.add('shake-animation');
        setTimeout(() => {
          removeService(service.id);
        }, 300);
      } else {
        removeService(service.id);
      }
    } else {
      // Show visual feedback when adding
      const serviceElement = document.getElementById(
        `service-card-${service.id}`
      );
      if (serviceElement) {
        serviceElement.classList.add('pulse-animation');
        setTimeout(() => {
          serviceElement.classList.remove('pulse-animation');
        }, 600);
      }
      addService(service);
    }
  };

  // Save current package
  const saveCurrentPackage = () => {
    if (!customPackageName.trim() || selectedServices.length === 0) return;

    const newPackage = {
      name: customPackageName,
      services: [...selectedServices],
    };

    const updatedPackages = [...savedPackages, newPackage];
    setSavedPackages(updatedPackages);
    setCustomPackageName('');

    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('savedPackages', JSON.stringify(updatedPackages));
    }
  };

  // Load a saved package
  const loadPackage = (packageIndex: number) => {
    const packageToLoad = savedPackages[packageIndex];

    // Clear current selection and add the saved services
    selectedServices.forEach((service) => removeService(service.id));
    packageToLoad.services.forEach((service) => addService(service));

    setShowSavedPackages(false);
  };

  // Delete a saved package
  const deletePackage = (packageIndex: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedPackages = savedPackages.filter(
      (_, index) => index !== packageIndex
    );
    setSavedPackages(updatedPackages);

    // Update localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('savedPackages', JSON.stringify(updatedPackages));
    }
  };

  // Get categories for the filter tabs
  const categories = [
    {
      id: 'all',
      name: t('customPackage.allServices', { fallback: 'All Services' }),
    },
    {
      id: 'water-activities',
      name: t('customPackage.waterActivities', {
        fallback: 'Water Activities',
      }),
    },
    { id: 'tours', name: t('customPackage.tours', { fallback: 'Tours' }) },
    {
      id: 'transportation',
      name: t('customPackage.transportation', { fallback: 'Transportation' }),
    },
    {
      id: 'wellness',
      name: t('customPackage.wellness', { fallback: 'Wellness' }),
    },
    {
      id: 'food-drinks',
      name: t('customPackage.foodDrinks', { fallback: 'Food & Drinks' }),
    },
    {
      id: 'leisure',
      name: t('customPackage.leisure', { fallback: 'Leisure' }),
    },
  ];

  if (!packageType) {
    return null;
  }

  const handleProceedToPayment = () => {
    // Establecer el tipo de paquete como custom
    setPackageType('custom');

    // Opcional: Guardar en localStorage como respaldo
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        'booking',
        JSON.stringify({
          packageType: 'custom',
          selectedServices,
          total: calculateTotalPrice(),
        })
      );
    }

    // Navegar a la página de pago
    router.push('/payment');
  };

  return (
    <section id='custom-package' className='py-24 bg-gray-50'>
      <div className='container mx-auto px-6'>
        <div className='text-center mb-12'>
          <h2 className='text-4xl font-bold text-gray-900 mb-4'>
            {t('customPackage.title', {
              fallback: 'Create Your Custom Package',
            })}
          </h2>
          <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
            {t('customPackage.subtitle', {
              fallback:
                'Select services to create your personalized experience package',
            })}
          </p>
        </div>

        <div className='grid md:grid-cols-3 gap-8'>
          {/* Services Selection Section */}
          <div className='md:col-span-2 bg-white rounded-xl shadow-md p-6'>
            <div className='flex items-center justify-between mb-6'>
              <h3 className='text-xl font-semibold text-gray-900 flex items-center'>
                <Grid className='mr-2' size={20} />
                {t('customPackage.availableServices', {
                  fallback: 'Available Services',
                })}
              </h3>

              {/* Search input */}
              <div className='relative w-64'>
                <Search
                  className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
                  size={16}
                />
                <input
                  type='text'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t('services.actions.search', {
                    fallback: 'Search services...',
                  })}
                  className='w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                />
              </div>
            </div>

            {/* Category tabs */}
            <div className='flex mb-6 overflow-x-auto pb-2 scrollbar-hide'>
              <div className='flex space-x-2'>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`
                      whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium
                      ${
                        activeCategory === category.id
                          ? packageType === 'standard'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-amber-100 text-amber-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }
                    `}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Services grid */}
            <AnimatePresence mode='wait'>
              {filteredServices.length > 0 ? (
                <motion.div
                  key='services-grid'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className='grid grid-cols-2 sm:grid-cols-3 gap-4'
                >
                  {filteredServices.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      isSelected={selectedServices.some(
                        (s) => s.id === service.id
                      )}
                      onToggle={() => toggleService(service)}
                      t={t}
                    />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key='empty-services'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className='text-center py-12 bg-gray-50 rounded-lg'
                >
                  <Filter size={40} className='mx-auto text-gray-400 mb-3' />
                  <p className='text-gray-600'>
                    {t('customPackage.noServicesFound', {
                      fallback:
                        'No services found. Try adjusting your filters.',
                    })}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Your Package Section */}
          <div>
            <div className='bg-white rounded-xl shadow-md p-6 sticky top-24'>
              <h3 className='text-xl font-semibold text-gray-900 flex items-center justify-between mb-4'>
                <div className='flex items-center'>
                  <Package className='mr-2' size={20} />
                  {t('customPackage.yourPackage', { fallback: 'Your Package' })}
                </div>
                {selectedServices.length > 0 && (
                  <span
                    className={`text-sm font-medium px-2 py-1 rounded-full ${
                      packageType === 'standard'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {selectedServices.length}{' '}
                    {selectedServices.length === 1
                      ? t('customPackage.service', { fallback: 'service' })
                      : t('customPackage.services', { fallback: 'services' })}
                  </span>
                )}
              </h3>

              <AnimatePresence>
                {selectedServices.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className='text-center py-10 bg-gray-50 rounded-lg mb-4'
                  >
                    <ShoppingCart
                      size={32}
                      className='mx-auto text-gray-400 mb-3'
                    />
                    <p className='text-gray-600 mb-2'>
                      {t('customPackage.emptyPackage', {
                        fallback: 'Your package is empty',
                      })}
                    </p>
                    <p className='text-sm text-gray-500'>
                      {t('customPackage.selectServices', {
                        fallback:
                          'Select services from the left to add them to your package',
                      })}
                    </p>
                  </motion.div>
                ) : (
                  <div className='mb-6'>
                    <p className='text-sm text-gray-500 mb-3 flex items-center'>
                      <Info size={14} className='mr-1' />
                      {t('customPackage.dragToReorder', {
                        fallback: 'Drag items to reorder them in your package',
                      })}
                    </p>

                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                    >
                      <SortableContext
                        items={selectedServices.map((service) => service.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className='space-y-2 max-h-80 overflow-y-auto pr-2 custom-scrollbar'>
                          {selectedServices.length > 0 && (
                            <div className='flex justify-end mb-3'>
                              <button
                                onClick={clearAllServices}
                                className='text-sm text-gray-500 hover:text-red-500 flex items-center'
                              >
                                <X size={14} className='mr-1' />
                                {t('customPackage.clearAll', {
                                  fallback: 'Clear all',
                                })}
                              </button>
                            </div>
                          )}
                          {selectedServices.map((service) => (
                            <SortableServiceItem
                              key={service.id}
                              service={service}
                              onRemove={() => removeService(service.id)}
                              t={t}
                            />
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>

                    <div className='mt-6 pt-4 border-t border-gray-100'>
                      <div className='flex justify-between items-center mb-1'>
                        <span className='text-gray-600'>
                          {t('customPackage.totalServices', {
                            fallback: 'Total Services',
                          })}
                          :
                        </span>
                        <span className='font-medium'>
                          {selectedServices.length}
                        </span>
                      </div>
                      <div className='flex justify-between items-center'>
                        <span className='text-gray-800 font-medium'>
                          {t('customPackage.estimatedTotal', {
                            fallback: 'Estimated Total',
                          })}
                          :
                        </span>
                        <span className='text-xl font-bold text-gray-900'>
                          ${calculateTotalPrice().toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </AnimatePresence>

              {/* Save Package */}
              {selectedServices.length > 0 && (
                <div className='mb-6'>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    {t('customPackage.savePackage', {
                      fallback: 'Save this package for later',
                    })}
                  </label>
                  <div className='flex'>
                    <input
                      type='text'
                      value={customPackageName}
                      onChange={(e) => setCustomPackageName(e.target.value)}
                      placeholder={t('customPackage.packageName', {
                        fallback: 'Package name',
                      })}
                      className='flex-grow mr-2 px-3 py-2 border border-gray-300 rounded-md text-sm'
                    />
                    <button
                      onClick={saveCurrentPackage}
                      disabled={
                        !customPackageName.trim() ||
                        selectedServices.length === 0
                      }
                      className={`
                        px-3 py-2 rounded-md text-white text-sm font-medium flex items-center
                        ${
                          packageType === 'standard'
                            ? 'bg-blue-500 hover:bg-blue-600'
                            : 'bg-amber-500 hover:bg-amber-600'
                        }
                        ${
                          !customPackageName.trim() ||
                          selectedServices.length === 0
                            ? 'opacity-50 cursor-not-allowed'
                            : ''
                        }
                      `}
                    >
                      <Save size={16} className='mr-1' />
                      {t('customPackage.save', { fallback: 'Save' })}
                    </button>
                  </div>
                </div>
              )}

              {/* Saved Packages */}
              {savedPackages.length > 0 && (
                <div>
                  <button
                    onClick={() => setShowSavedPackages(!showSavedPackages)}
                    className='flex w-full items-center justify-between px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-md text-gray-700 mb-2'
                  >
                    <span className='flex items-center'>
                      <Heart size={16} className='mr-2' />
                      {t('customPackage.savedPackages', {
                        fallback: 'Saved Packages',
                      })}
                    </span>
                    <span className='bg-gray-200 text-gray-800 text-xs font-medium rounded-full px-2 py-0.5'>
                      {savedPackages.length}
                    </span>
                  </button>

                  <AnimatePresence>
                    {showSavedPackages && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className='overflow-hidden'
                      >
                        <div className='space-y-2 mt-2 max-h-60 overflow-y-auto pr-1'>
                          {savedPackages.map((pkg, index) => (
                            <div
                              key={index}
                              onClick={() => loadPackage(index)}
                              className='flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-md cursor-pointer'
                            >
                              <div>
                                <h4 className='font-medium text-gray-800'>
                                  {pkg.name}
                                </h4>
                                <p className='text-xs text-gray-500'>
                                  {pkg.services.length}{' '}
                                  {t('customPackage.services', {
                                    fallback: 'services',
                                  })}
                                </p>
                              </div>
                              <button
                                onClick={(e) => deletePackage(index, e)}
                                className='p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-white'
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Action buttons */}
              {selectedServices.length > 0 && (
                <div className='mt-6'>
                  <button
                    className={`
                      w-full py-3 px-4 rounded-lg font-semibold flex items-center justify-center
                      ${
                        packageType === 'standard'
                          ? 'bg-blue-500 hover:bg-blue-600'
                          : 'bg-amber-500 hover:bg-amber-600'
                      }
                      text-white transition-colors duration-300 shadow-md hover:shadow-lg transform hover:translate-y-[-2px]
                    `}
                  >
                    <ShoppingCart size={18} className='mr-2' />
                    {t('customPackage.proceedToBooking', {
                      fallback: 'Proceed to Booking',
                    })}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomPackageBuilder;
