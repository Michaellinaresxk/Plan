import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  Users,
  Star,
  ArrowRight,
  Plus,
  Minus,
  X,
  Search,
  ShoppingCart,
  Trash2,
  CheckCircle,
  Timer,
  Sparkles,
  Leaf,
  Zap,
  Shield,
  Award,
  Heart,
  MapPin,
  Filter,
  Eye,
  Info,
} from 'lucide-react';

// Types remain the same
interface Service {
  id: string;
  name: string;
  description: string;
  category: 'relaxation' | 'therapeutic' | 'beauty' | 'signature' | 'kids';
  durations: { duration: number; price: number }[];
  emoji: string;
  tags: string[];
  maxPersons: number;
  intensity: 'gentle' | 'medium' | 'strong';
  isPremium?: boolean;
  imageUrl: string;
  benefits: string[];
}

interface BookingItem {
  id: string;
  serviceId: string;
  serviceName: string;
  duration: number;
  price: number;
  date: string;
  time: string;
  persons: number;
  emoji: string;
}

interface FormProps {
  onSubmit: (data: { bookings: BookingItem[]; totalPrice: number }) => void;
  onCancel: () => void;
}

// Data
const SERVICES: Service[] = [
  {
    id: 'relaxing',
    name: 'Relaxing Massage',
    description:
      'Smooth movements to relieve muscle tensions and restore inner peace. Perfect for stress relief and mental clarity.',
    category: 'relaxation',
    durations: [
      { duration: 60, price: 120 },
      { duration: 90, price: 140 },
    ],
    emoji: '🌿',
    tags: ['relaxation', 'stress-relief'],
    maxPersons: 2,
    intensity: 'gentle',
    imageUrl:
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&h=400&fit=crop',
    benefits: ['Reduces stress', 'Better sleep', 'Mental clarity'],
  },
  {
    id: 'deep-tissue',
    name: 'Deep Tissue Massage',
    description:
      'Intensive therapy targeting deep muscle layers for chronic pain relief and muscle recovery.',
    category: 'therapeutic',
    durations: [
      { duration: 60, price: 130 },
      { duration: 90, price: 150 },
    ],
    emoji: '💪',
    tags: ['therapeutic', 'pain-relief'],
    maxPersons: 1,
    intensity: 'strong',
    imageUrl:
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop',
    benefits: ['Pain relief', 'Muscle recovery', 'Better mobility'],
  },
  {
    id: 'aromatherapy',
    name: 'Aromatherapy Massage',
    description:
      'Therapeutic massage enhanced with essential oils for deeper relaxation and emotional balance.',
    category: 'relaxation',
    durations: [
      { duration: 60, price: 130 },
      { duration: 90, price: 150 },
    ],
    emoji: '🌸',
    tags: ['aromatherapy', 'essential-oils'],
    maxPersons: 2,
    intensity: 'gentle',
    imageUrl:
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&h=400&fit=crop',
    benefits: ['Emotional balance', 'Deep relaxation', 'Aromatherapy benefits'],
  },
  {
    id: 'couples',
    name: 'Couples Massage',
    description:
      'Romantic synchronized treatments for two in a shared peaceful space. Create lasting memories together.',
    category: 'signature',
    durations: [{ duration: 90, price: 280 }],
    emoji: '💕',
    tags: ['couples', 'romantic'],
    maxPersons: 2,
    intensity: 'gentle',
    isPremium: true,
    imageUrl:
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop',
    benefits: ['Romantic bonding', 'Shared relaxation', 'Memory creation'],
  },
  {
    id: 'hot-stone',
    name: 'Hot Stone Therapy',
    description:
      'Ancient technique using heated volcanic stones for deep muscle relaxation and improved circulation.',
    category: 'therapeutic',
    durations: [{ duration: 90, price: 160 }],
    emoji: '🪨',
    tags: ['hot-stones', 'therapeutic'],
    maxPersons: 1,
    intensity: 'medium',
    isPremium: true,
    imageUrl:
      'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600&h=400&fit=crop',
    benefits: ['Deep relaxation', 'Better circulation', 'Pain relief'],
  },
  {
    id: 'facial',
    name: 'Rejuvenating Facial',
    description:
      'Professional skincare treatment for radiant, youthful-looking skin with deep cleansing and anti-aging benefits.',
    category: 'beauty',
    durations: [
      { duration: 60, price: 100 },
      { duration: 90, price: 130 },
    ],
    emoji: '✨',
    tags: ['facial', 'skincare'],
    maxPersons: 1,
    intensity: 'gentle',
    imageUrl:
      'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=600&h=400&fit=crop',
    benefits: ['Glowing skin', 'Anti-aging', 'Deep cleansing'],
  },
];

const TIME_SLOTS = [
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
];

// Utility Components
const CategoryIcon = ({ category }: { category: string }) => {
  const icons = {
    relaxation: <Leaf className='w-4 h-4' />,
    therapeutic: <Zap className='w-4 h-4' />,
    beauty: <Sparkles className='w-4 h-4' />,
    signature: <Award className='w-4 h-4' />,
    kids: <Heart className='w-4 h-4' />,
  };
  return icons[category as keyof typeof icons] || <Leaf className='w-4 h-4' />;
};

const IntensityBadge = ({ intensity }: { intensity: string }) => {
  const styles = {
    gentle: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    medium: 'bg-amber-50 text-amber-700 border-amber-200',
    strong: 'bg-red-50 text-red-700 border-red-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
        styles[intensity as keyof typeof styles]
      }`}
    >
      {intensity}
    </span>
  );
};

// Improved Service Card Component
const ServiceCard = ({
  service,
  onSelect,
}: {
  service: Service;
  onSelect: (service: Service) => void;
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const minPrice = Math.min(...service.durations.map((d) => d.price));
  const maxPrice = Math.max(...service.durations.map((d) => d.price));
  const priceRange =
    minPrice === maxPrice ? `$${minPrice}` : `$${minPrice} - $${maxPrice}`;

  return (
    <motion.div
      layout
      whileHover={{ y: -4 }}
      className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group'
    >
      {/* Image Header */}
      <div className='relative aspect-[4/3] overflow-hidden'>
        <img
          src={service.imageUrl}
          alt={service.name}
          className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
        />

        {/* Gradient Overlay */}
        <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent' />

        {/* Top Badges */}
        <div className='absolute top-3 left-3 flex flex-wrap gap-2'>
          {service.isPremium && (
            <span className='bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-sm'>
              <Star className='w-3 h-3' />
              Premium
            </span>
          )}
          <span className='bg-white/90 backdrop-blur-sm text-gray-700 px-2.5 py-1 rounded-full text-xs font-medium capitalize flex items-center gap-1.5'>
            <CategoryIcon category={service.category} />
            {service.category}
          </span>
        </div>

        {/* Bottom Info */}
        <div className='absolute bottom-3 left-3 right-3 flex items-end justify-between'>
          <div className='flex items-center gap-2'>
            <div className='w-12 h-12 bg-white/95 backdrop-blur-sm rounded-xl flex items-center justify-center text-xl shadow-sm'>
              {service.emoji}
            </div>
            <div className='text-white'>
              <div className='text-sm font-medium opacity-90'>
                Starting from
              </div>
              <div className='text-lg font-bold'>{priceRange}</div>
            </div>
          </div>

          <div className='flex items-center gap-2'>
            <IntensityBadge intensity={service.intensity} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className='p-5'>
        <div className='flex items-start justify-between mb-3'>
          <h3 className='text-lg font-semibold text-gray-900 leading-tight pr-2'>
            {service.name}
          </h3>
          <div className='flex items-center gap-1 text-gray-500 flex-shrink-0'>
            <Users className='w-4 h-4' />
            <span className='text-sm'>{service.maxPersons}</span>
          </div>
        </div>

        <p className='text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2'>
          {service.description}
        </p>

        {/* Duration Options */}
        <div className='flex flex-wrap gap-1.5 mb-4'>
          {service.durations.map((d, i) => (
            <span
              key={i}
              className='text-xs bg-gray-100 text-gray-700 px-2.5 py-1.5 rounded-lg font-medium'
            >
              {d.duration}min • ${d.price}
            </span>
          ))}
        </div>

        {/* Benefits Preview */}
        <div className='mb-4'>
          <div className='flex flex-wrap gap-1.5'>
            {service.benefits.slice(0, 2).map((benefit, idx) => (
              <span
                key={idx}
                className='text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-md border border-blue-100'
              >
                {benefit}
              </span>
            ))}
            {service.benefits.length > 2 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDetails(!showDetails);
                }}
                className='text-xs text-blue-600 px-2 py-1 hover:bg-blue-50 rounded-md transition-colors flex items-center gap-1'
              >
                <Info className='w-3 h-3' />+{service.benefits.length - 2} more
              </button>
            )}
          </div>
        </div>

        {/* Expanded Benefits */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className='mb-4 overflow-hidden'
            >
              <div className='p-3 bg-gray-50 rounded-lg border'>
                <div className='text-xs font-medium text-gray-700 mb-2'>
                  All Benefits:
                </div>
                <div className='flex flex-wrap gap-1'>
                  {service.benefits.map((benefit, idx) => (
                    <span
                      key={idx}
                      className='text-xs bg-white text-gray-600 px-2 py-1 rounded border'
                    >
                      {benefit}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Button */}
        <button
          onClick={() => onSelect(service)}
          className='w-full bg-gray-900 text-white py-3 px-4 rounded-xl hover:bg-gray-800 transition-colors font-medium flex items-center justify-center gap-2 group/btn'
        >
          <span>Book Treatment</span>
          <ArrowRight className='w-4 h-4 group-hover/btn:translate-x-1 transition-transform' />
        </button>
      </div>
    </motion.div>
  );
};

// Services Grid Component
const ServicesGrid = ({
  services,
  onServiceSelect,
}: {
  services: Service[];
  onServiceSelect: (service: Service) => void;
}) => {
  if (services.length === 0) {
    return (
      <div className='text-center py-20'>
        <div className='w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6'>
          <Search className='w-10 h-10 text-gray-400' />
        </div>
        <h3 className='text-xl font-semibold text-gray-900 mb-3'>
          No treatments found
        </h3>
        <p className='text-gray-600 max-w-md mx-auto'>
          We couldn't find any treatments matching your search. Try adjusting
          your filters.
        </p>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6'>
      {services.map((service) => (
        <ServiceCard
          key={service.id}
          service={service}
          onSelect={onServiceSelect}
        />
      ))}
    </div>
  );
};

// Search and Filter Bar Component
const SearchAndFilters = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
}: {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}) => {
  const categories = [
    'relaxation',
    'therapeutic',
    'beauty',
    'signature',
    'kids',
  ];

  return (
    <div className='space-y-6'>
      {/* Search Bar */}
      <div className='relative max-w-2xl mx-auto'>
        <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
        <input
          type='text'
          placeholder='Search treatments, benefits, or keywords...'
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className='w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white text-lg shadow-sm transition-all'
        />
      </div>

      {/* Category Filters */}
      <div className='flex justify-center'>
        <div className='flex gap-2 flex-wrap max-w-4xl'>
          <button
            onClick={() => onCategoryChange(null)}
            className={`px-4 py-2.5 rounded-xl flex items-center gap-2 font-medium transition-all text-sm ${
              selectedCategory === null
                ? 'bg-gray-900 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <Filter className='w-4 h-4' />
            All Services
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`px-4 py-2.5 rounded-xl flex items-center gap-2 capitalize font-medium transition-all text-sm ${
                selectedCategory === category
                  ? 'bg-gray-900 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <CategoryIcon category={category} />
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Simple Booking Modal (keeping it minimal for space)
const BookingModal = ({
  service,
  onConfirm,
  onCancel,
}: {
  service: Service;
  onConfirm: (booking: Omit<BookingItem, 'id'>) => void;
  onCancel: () => void;
}) => {
  const [duration, setDuration] = useState(service.durations[0].duration);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [persons, setPersons] = useState(1);

  const currentPrice =
    service.durations.find((d) => d.duration === duration)?.price || 0;
  const totalPrice = currentPrice * persons;

  const handleSubmit = () => {
    if (!date || !time) return;
    onConfirm({
      serviceId: service.id,
      serviceName: service.name,
      duration,
      price: totalPrice,
      date,
      time,
      persons,
      emoji: service.emoji,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50'
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className='bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl'
      >
        <div className='p-6 space-y-6'>
          <div className='flex items-center justify-between'>
            <h2 className='text-xl font-semibold'>{service.name}</h2>
            <button
              onClick={onCancel}
              className='p-2 hover:bg-gray-100 rounded-lg'
            >
              <X className='w-5 h-5' />
            </button>
          </div>

          {/* Duration Selection */}
          <div>
            <label className='block text-sm font-medium text-gray-900 mb-3'>
              Duration
            </label>
            <div className='space-y-2'>
              {service.durations.map((option) => (
                <button
                  key={option.duration}
                  onClick={() => setDuration(option.duration)}
                  className={`w-full p-3 rounded-lg border text-left transition-all ${
                    duration === option.duration
                      ? 'border-gray-900 bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className='flex justify-between'>
                    <span>{option.duration} minutes</span>
                    <span className='font-semibold'>${option.price}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Date & Time */}
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-900 mb-2'>
                Date
              </label>
              <input
                type='date'
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-900 mb-2'>
                Time
              </label>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500'
              >
                <option value=''>Select time</option>
                {TIME_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Persons */}
          <div>
            <label className='block text-sm font-medium text-gray-900 mb-3'>
              People
            </label>
            <div className='flex items-center justify-between bg-gray-50 rounded-lg p-3'>
              <div className='flex items-center gap-3'>
                <button
                  onClick={() => setPersons(Math.max(1, persons - 1))}
                  className='w-8 h-8 rounded-full bg-white border flex items-center justify-center'
                >
                  <Minus className='w-4 h-4' />
                </button>
                <span className='font-semibold w-8 text-center'>{persons}</span>
                <button
                  onClick={() =>
                    setPersons(Math.min(service.maxPersons, persons + 1))
                  }
                  className='w-8 h-8 rounded-full bg-white border flex items-center justify-center'
                >
                  <Plus className='w-4 h-4' />
                </button>
              </div>
              <span className='text-sm text-gray-600'>
                Max: {service.maxPersons}
              </span>
            </div>
          </div>

          {/* Total */}
          <div className='bg-gray-900 text-white rounded-lg p-4'>
            <div className='flex justify-between items-center'>
              <span className='font-medium'>Total</span>
              <span className='text-xl font-bold'>${totalPrice}</span>
            </div>
          </div>

          {/* Actions */}
          <div className='flex gap-3'>
            <button
              onClick={onCancel}
              className='flex-1 py-3 border border-gray-300 rounded-lg hover:bg-gray-50'
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!date || !time}
              className='flex-1 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400'
            >
              Add to Cart
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Main Component
const MassageForm: React.FC<FormProps> = ({ onSubmit, onCancel }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [bookings, setBookings] = useState<BookingItem[]>([]);

  const filteredServices = useMemo(() => {
    return SERVICES.filter((service) => {
      const matchesSearch =
        !searchTerm ||
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.tags.some((tag) => tag.includes(searchTerm.toLowerCase())) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        !selectedCategory || service.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const addBooking = (bookingData: Omit<BookingItem, 'id'>) => {
    const newBooking: BookingItem = {
      ...bookingData,
      id: Date.now().toString(),
    };
    setBookings((prev) => [...prev, newBooking]);
    setSelectedService(null);
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <div className='bg-white shadow-sm border-b border-gray-200'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <div className='text-center mb-8'>
            <h1 className='text-3xl sm:text-4xl font-light text-gray-900 mb-4'>
              Book Your Spa Experience
            </h1>
            <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
              Choose from our premium massage and wellness services
            </p>
          </div>

          <SearchAndFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>
      </div>

      {/* Services */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <ServicesGrid
          services={filteredServices}
          onServiceSelect={setSelectedService}
        />
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {selectedService && (
          <BookingModal
            service={selectedService}
            onConfirm={addBooking}
            onCancel={() => setSelectedService(null)}
          />
        )}
      </AnimatePresence>

      {/* Cancel Button */}
      <div className='fixed bottom-6 left-6 z-30'>
        <button
          onClick={onCancel}
          className='px-6 py-3 bg-white text-gray-700 rounded-full shadow-lg hover:bg-gray-50 border border-gray-200'
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default MassageForm;
