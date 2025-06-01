// UI/components/packageBuilder/dayPlanner/components/RecommendedServices.tsx
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Star, Filter, Search, Calendar, Clock, Tag } from 'lucide-react';
import { Service } from '@/types/type';
import { DailyActivity } from '@/constants/dayplanner';
import { ServiceSlider } from './ServiceSlider';

interface RecommendedServicesProps {
  services: Service[];
  currentDayActivities: DailyActivity[];
  timeSlots: string[];
  isTimeSlotAvailable: (timeSlot: string) => boolean;
  onServiceConfig: (serviceId: string, timeSlot: string) => void;
}

// Lógica inteligente para categorizar servicios sin duplicados
const smartCategorizeServices = (services: Service[], currentDayActivities: DailyActivity[]) => {
  const currentDaySelectedIds = new Set(
    currentDayActivities.map((activity) => activity.serviceId)
  );

  // Servicios ya seleccionados para hoy (siempre se muestran primero)
  const currentlySelectedServices = services.filter(service => 
    currentDaySelectedIds.has(service.id)
  );

  // Servicios disponibles (no seleccionados hoy)
  const availableServices = services.filter(service => 
    !currentDaySelectedIds.has(service.id)
  );

  // Función para asignar a una categoría principal (sin duplicar)
  const assignToPrimaryCategory = (service: Service) => {
    // Orden de prioridad para evitar duplicados
    if (service.packageType.includes('premium')) {
      return 'premium';
    }
    if (service.duration <= 2) {
      return 'short';
    }
    if (service.duration > 3) {
      return 'long';
    }
    if (service.price >= 100) {
      return 'expensive';
    }
    if (service.price < 50) {
      return 'affordable';
    }
    return 'standard';
  };

  // Categorizar servicios disponibles
  const categorizedServices = {
    currentlySelectedServices,
    premiumServices: [],
    standardServices: [],
    shortServices: [],
    longServices: [],
    expensiveServices: [],
    affordableServices: []
  };

  // Asignar cada servicio a UNA SOLA categoría
  availableServices.forEach(service => {
    const category = assignToPrimaryCategory(service);
    
    switch (category) {
      case 'premium':
        categorizedServices.premiumServices.push(service);
        break;
      case 'short':
        categorizedServices.shortServices.push(service);
        break;
      case 'long':
        categorizedServices.longServices.push(service);
        break;
      case 'expensive':
        categorizedServices.expensiveServices.push(service);
        break;
      case 'affordable':
        categorizedServices.affordableServices.push(service);
        break;
      default:
        categorizedServices.standardServices.push(service);
        break;
    }
  });

  return categorizedServices;
};

export const RecommendedServices: React.FC<RecommendedServicesProps> = ({
  services,
  currentDayActivities,
  timeSlots,
  isTimeSlotAvailable,
  onServiceConfig,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);

  // Categorías para filtrado
  const categories = [
    { id: 'all', name: 'Todos' },
    { id: 'water', name: 'Acuáticos' },
    { id: 'relax', name: 'Relajación' },
    { id: 'food', name: 'Gastronomía' },
    { id: 'adventure', name: 'Aventura' },
    { id: 'tours', name: 'Tours' },
    { id: 'romantic', name: 'Romántico' },
    { id: 'transport', name: 'Transporte' },
  ];

  // Filtrar servicios basados en búsqueda y categoría
  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesSearch = 
        searchTerm === '' ||
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Lógica de categorización mejorada
      const matchesCategory = 
        selectedCategory === 'all' ||
        service.id.includes(selectedCategory) ||
        (selectedCategory === 'water' && ['catamaran', 'yacht', 'surf', 'snorkel', 'diving', 'boat', 'swim'].some(term => service.id.includes(term))) ||
        (selectedCategory === 'relax' && ['massage', 'spa', 'yoga', 'meditation', 'relax'].some(term => service.id.includes(term))) ||
        (selectedCategory === 'food' && ['chef', 'culinary', 'food', 'dinner', 'lunch', 'breakfast', 'wine', 'tasting'].some(term => service.id.includes(term))) ||
        (selectedCategory === 'adventure' && ['adventure', 'hike', 'bike', 'trek', 'climbing', 'zip', 'sport'].some(term => service.id.includes(term))) ||
        (selectedCategory === 'romantic' && ['couple', 'romantic', 'private', 'sunset', 'wine'].some(term => service.id.includes(term)));
      
      return matchesSearch && matchesCategory;
    });
  }, [services, searchTerm, selectedCategory]);

  // Usar la categorización inteligente
  const serviceCategories = useMemo(() => {
    return smartCategorizeServices(filteredServices, currentDayActivities);
  }, [filteredServices, currentDayActivities]);

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    
    // Filtrar horarios disponibles
    const available = timeSlots.filter(isTimeSlotAvailable);
    setAvailableTimeSlots(available);
    
    if (available.length > 0) {
      setShowConfigModal(true);
    } else {
      alert('No hay horarios disponibles para este día. Por favor, seleccione otro día o elimine alguna actividad existente.');
    }
  };

  const handleConfigCancel = () => {
    setShowConfigModal(false);
    setSelectedService(null);
  };

  const handleTimeSlotSelect = (timeSlot: string) => {
    if (selectedService) {
      onServiceConfig(selectedService.id, timeSlot);
      setShowConfigModal(false);
      setSelectedService(null);
    }
  };

  return (
    <>
    <div className="mb-8">
      {/* Sliders de servicios categorizados - SIN DUPLICADOS */}
      {serviceCategories.currentlySelectedServices.length > 0 && (
        <ServiceSlider
          services={serviceCategories.currentlySelectedServices}
          currentDayActivities={currentDayActivities}
          onServiceSelect={handleServiceSelect}
          title="Ya seleccionados para hoy"
          className="mb-8"
        />
      )}
      
      {serviceCategories.premiumServices.length > 0 && (
        <ServiceSlider
          services={serviceCategories.premiumServices}
          currentDayActivities={currentDayActivities}
          onServiceSelect={handleServiceSelect}
          title={<div className="flex items-center"><Star className="mr-2 h-5 w-5 text-amber-500" />Experiencias Premium</div>}
          className="mb-8"
        />
      )}
      
      {serviceCategories.shortServices.length > 0 && (
        <ServiceSlider
          services={serviceCategories.shortServices}
          currentDayActivities={currentDayActivities}
          onServiceSelect={handleServiceSelect}
          title={<div className="flex items-center"><Clock className="mr-2 h-5 w-5 text-blue-500" />Experiencias Cortas (≤ 2h)</div>}
          className="mb-8"
        />
      )}
      
      {serviceCategories.longServices.length > 0 && (
        <ServiceSlider
          services={serviceCategories.longServices}
          currentDayActivities={currentDayActivities}
          onServiceSelect={handleServiceSelect}
          title={<div className="flex items-center"><Clock className="mr-2 h-5 w-5 text-purple-500" />Experiencias Largas (> 3h)</div>}
          className="mb-8"
        />
      )}
      
      {serviceCategories.affordableServices.length > 0 && (
        <ServiceSlider
          services={serviceCategories.affordableServices}
          currentDayActivities={currentDayActivities}
          onServiceSelect={handleServiceSelect}
          title={<div className="flex items-center"><Tag className="mr-2 h-5 w-5 text-green-500" />Experiencias Accesibles (&lt; $50)</div>}
          className="mb-8"
        />
      )}
      
      {serviceCategories.expensiveServices.length > 0 && (
        <ServiceSlider
          services={serviceCategories.expensiveServices}
          currentDayActivities={currentDayActivities}
          onServiceSelect={handleServiceSelect}
          title={<div className="flex items-center"><Tag className="mr-2 h-5 w-5 text-amber-500" />Experiencias Exclusivas (≥ $100)</div>}
          className="mb-8"
        />
      )}

      {serviceCategories.standardServices.length > 0 && (
        <ServiceSlider
          services={serviceCategories.standardServices}
          currentDayActivities={currentDayActivities}
          onServiceSelect={handleServiceSelect}
          title="Experiencias Estándar"
          className="mb-8"
        />
      )}

      {filteredServices.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 bg-gray-50 rounded-xl border border-gray-100"
        >
          <p className="text-gray-500 text-lg mb-2">
            No se encontraron experiencias que coincidan con tu búsqueda.
          </p>
          <p className="text-gray-400">
            Intenta ajustar tus filtros o busca con otros términos.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
            }}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Mostrar todas las experiencias
          </button>
        </motion.div>
      )}

      {/* Modal de selección de horario */}
      {selectedService && showConfigModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8"
          >
            <h3 className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Selecciona un horario
            </h3>
            
            <p className="text-gray-600 mb-6">
              Elegiste <span className="font-semibold">{selectedService.name}</span>. 
              Ahora selecciona el horario que prefieras para esta experiencia:
            </p>
            
            <div className="grid grid-cols-2 gap-3 mb-8">
              {availableTimeSlots.map((timeSlot) => (
                <motion.button
                  key={timeSlot}
                  onClick={() => handleTimeSlotSelect(timeSlot)}
                  className="px-4 py-3 text-center rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  whileHover={{ scale: 1.05, backgroundColor: '#EFF6FF' }}
                  whileTap={{ scale: 0.95 }}
                >
                  {timeSlot}
                </motion.button>
              ))}
            </div>
            
            <div className="flex justify-end">
              <motion.button
                onClick={handleConfigCancel}
                className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-medium"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Cancelar
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
    </>
  );
};