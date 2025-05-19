
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
      
      // Mejorar la lógica de categorización para que sea más inclusiva
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

  // Categorizar los servicios para mejor visualización
  const getServiceCategories = () => {
    // Ver si hay servicios ya seleccionados en el día actual
    const currentlySelectedServices = filteredServices.filter(service => 
      currentDayActivities.some(activity => activity.serviceId === service.id)
    );

    // Servicios premium vs estándar
    const premiumServices = filteredServices.filter(s => 
      s.packageType.includes('premium') && 
      !currentlySelectedServices.some(selected => selected.id === s.id)
    );
    
    const standardServices = filteredServices.filter(s => 
      s.packageType.includes('standard') && 
      !s.packageType.includes('premium') && 
      !currentlySelectedServices.some(selected => selected.id === s.id)
    );
    
    // Servicios por precio
    const expensiveServices = filteredServices.filter(s => 
      s.price >= 100 && 
      !currentlySelectedServices.some(selected => selected.id === s.id)
    );
    
    const affordableServices = filteredServices.filter(s => 
      s.price < 100 && 
      !currentlySelectedServices.some(selected => selected.id === s.id)
    );
    
    // Servicios por duración
    const shortServices = filteredServices.filter(s => 
      s.duration <= 2 && 
      !currentlySelectedServices.some(selected => selected.id === s.id)
    );
    
    const longServices = filteredServices.filter(s => 
      s.duration > 2 && 
      !currentlySelectedServices.some(selected => selected.id === s.id)
    );

    return {
      currentlySelectedServices,
      premiumServices,
      standardServices,
      expensiveServices,
      affordableServices,
      shortServices,
      longServices
    };
  };

  const serviceCategories = getServiceCategories();

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    
    // Filtrar horarios disponibles
    const available = timeSlots.filter(isTimeSlotAvailable);
    setAvailableTimeSlots(available);
    
    if (available.length > 0) {
      setShowConfigModal(true);
    } else {
      // Mostrar mensaje si no hay horarios disponibles
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
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
          <Star className="mr-2 h-5 w-5 text-amber-500" />
          Experiencias Recomendadas
        </h3>
        
        <div className="flex items-center space-x-4">
          {/* Input de búsqueda */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar experiencias..."
              className="pl-9 pr-4 py-2 w-60 text-sm bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {/* Dropdown de filtro */}
          <div className="relative group">
            <button className="flex items-center space-x-1 bg-white border border-gray-200 rounded-full px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors">
              <Filter className="h-4 w-4 text-gray-400" />
              <span>Filtrar</span>
            </button>
            
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 p-2 hidden group-hover:block z-10">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full text-left px-4 py-2 text-sm rounded-lg ${
                    selectedCategory === category.id 
                      ? 'bg-blue-50 text-blue-700 font-medium' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sliders de servicios categorizados */}
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
          title="Experiencias Premium"
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
      
      {serviceCategories.shortServices.length > 0 && (
        <ServiceSlider
          services={serviceCategories.shortServices}
          currentDayActivities={currentDayActivities}
          onServiceSelect={handleServiceSelect}
          title={<div className="flex items-center"><Clock className="mr-2 h-5 w-5 text-blue-500" />Experiencias Cortas (2h / 3h)</div>}
          className="mb-8"
        />
      )}
      
      {serviceCategories.longServices.length > 0 && (
        <ServiceSlider
          services={serviceCategories.longServices}
          currentDayActivities={currentDayActivities}
          onServiceSelect={handleServiceSelect}
          title={<div className="flex items-center"><Clock className="mr-2 h-5 w-5 text-purple-500" />Experiencias Largas (> 2h)</div>}
          className="mb-8"
        />
      )}
      
 {serviceCategories.affordableServices.length > 0 && (
  <ServiceSlider
    services={serviceCategories.affordableServices}
    currentDayActivities={currentDayActivities}
    onServiceSelect={handleServiceSelect}
    title={<span className="flex items-center"><Tag className="mr-2 h-5 w-5 text-green-500" />Experiencias Accesibles (menos de $100)</span>}
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