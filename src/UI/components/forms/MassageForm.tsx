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
} from 'lucide-react';

// 📝 Types
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

// 📊 Data with placeholder images
const SERVICES: Service[] = [
  {
    id: 'relaxing',
    name: 'Relaxing Massage',
    description:
      'Smooth movements to relieve muscle tensions and restore inner peace.',
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
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop',
    benefits: ['Reduces stress', 'Better sleep', 'Mental clarity'],
  },
  {
    id: 'deep-tissue',
    name: 'Deep Tissue Massage',
    description:
      'Intensive therapy targeting deep muscle layers for chronic pain relief.',
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
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
    benefits: ['Pain relief', 'Muscle recovery', 'Better mobility'],
  },
  {
    id: 'aromatherapy',
    name: 'Aromatherapy Massage',
    description:
      'Therapeutic massage enhanced with essential oils for deeper relaxation.',
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
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=300&fit=crop',
    benefits: ['Emotional balance', 'Deep relaxation', 'Aromatherapy benefits'],
  },
  {
    id: 'couples',
    name: 'Couples Massage',
    description:
      'Romantic synchronized treatments for two in a shared peaceful space.',
    category: 'signature',
    durations: [{ duration: 90, price: 280 }],
    emoji: '💕',
    tags: ['couples', 'romantic'],
    maxPersons: 2,
    intensity: 'gentle',
    isPremium: true,
    imageUrl:
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    benefits: ['Romantic bonding', 'Shared relaxation', 'Memory creation'],
  },
  {
    id: 'hot-stone',
    name: 'Hot Stone Therapy',
    description:
      'Ancient technique using heated volcanic stones for deep muscle relaxation.',
    category: 'therapeutic',
    durations: [{ duration: 90, price: 160 }],
    emoji: '🪨',
    tags: ['hot-stones', 'therapeutic'],
    maxPersons: 1,
    intensity: 'medium',
    isPremium: true,
    imageUrl:
      'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400&h=300&fit=crop',
    benefits: ['Deep relaxation', 'Better circulation', 'Pain relief'],
  },
  {
    id: 'facial',
    name: 'Rejuvenating Facial',
    description:
      'Professional skincare treatment for radiant, youthful-looking skin.',
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
      'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400&h=300&fit=crop',
    benefits: ['Glowing skin', 'Anti-aging', 'Deep cleansing'],
  },
  {
    id: 'kids',
    name: 'Kids Gentle Massage',
    description: 'Gentle, playful massage designed specifically for children.',
    category: 'kids',
    durations: [{ duration: 30, price: 50 }],
    emoji: '🧸',
    tags: ['kids', 'gentle'],
    maxPersons: 1,
    intensity: 'gentle',
    imageUrl:
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=300&fit=crop',
    benefits: ['Relaxation skills', 'Better sleep', 'Fun experience'],
  },
  {
    id: 'prenatal',
    name: 'Prenatal Massage',
    description:
      'Gentle, specialized care designed for the unique needs of expecting mothers.',
    category: 'therapeutic',
    durations: [
      { duration: 60, price: 100 },
      { duration: 90, price: 120 },
    ],
    emoji: '🤱',
    tags: ['pregnancy', 'prenatal'],
    maxPersons: 1,
    intensity: 'gentle',
    imageUrl:
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    benefits: ['Reduces swelling', 'Back pain relief', 'Better sleep'],
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

// 🎨 Components
const CategoryIcon = ({ category }: { category: string }) => {
  const icons = {
    relaxation: <Leaf className='w-5 h-5' />,
    therapeutic: <Zap className='w-5 h-5' />,
    beauty: <Sparkles className='w-5 h-5' />,
    signature: <Award className='w-5 h-5' />,
    kids: <Heart className='w-5 h-5' />,
  };
  return icons[category as keyof typeof icons] || <Leaf className='w-5 h-5' />;
};

const IntensityBadge = ({ intensity }: { intensity: string }) => {
  const colors = {
    gentle: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    medium: 'bg-amber-100 text-amber-700 border-amber-200',
    strong: 'bg-red-100 text-red-700 border-red-200',
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium border ${
        colors[intensity as keyof typeof colors]
      }`}
    >
      {intensity}
    </span>
  );
};

const ServiceCard = ({
  service,
  onSelect,
}: {
  service: Service;
  onSelect: (service: Service) => void;
}) => {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group'
      onClick={() => onSelect(service)}
    >
      {/* Image Header */}
      <div className='relative h-48 overflow-hidden'>
        <img
          src={service.imageUrl}
          alt={service.name}
          className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent' />

        {/* Badges */}
        <div className='absolute top-4 left-4 flex gap-2'>
          {service.isPremium && (
            <span className='bg-white/90 backdrop-blur-sm text-amber-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1'>
              <Star className='w-3 h-3' />
              Premium
            </span>
          )}
        </div>

        {/* Emoji Avatar */}
        <div className='absolute bottom-4 left-4'>
          <div className='w-16 h-16 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center text-2xl shadow-lg'>
            {service.emoji}
          </div>
        </div>

        {/* Intensity Badge */}
        <div className='absolute bottom-4 right-4'>
          <IntensityBadge intensity={service.intensity} />
        </div>
      </div>

      {/* Content */}
      <div className='p-6'>
        <div className='flex items-start justify-between mb-3'>
          <h3 className='text-lg font-semibold text-gray-900 group-hover:text-gray-700'>
            {service.name}
          </h3>
          <div className='flex items-center gap-1 text-gray-500'>
            <Users className='w-4 h-4' />
            <span className='text-sm'>{service.maxPersons}</span>
          </div>
        </div>

        <p className='text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2'>
          {service.description}
        </p>

        {/* Benefits Preview */}
        <div className='mb-4'>
          <div className='flex flex-wrap gap-1'>
            {service.benefits.slice(0, 2).map((benefit, idx) => (
              <span
                key={idx}
                className='text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded-md'
              >
                {benefit}
              </span>
            ))}
            {service.benefits.length > 2 && (
              <span className='text-xs text-gray-400 px-2 py-1'>
                +{service.benefits.length - 2} more
              </span>
            )}
          </div>
        </div>

        {/* Duration Options */}
        <div className='flex items-center justify-between mb-4'>
          <div className='flex gap-2'>
            {service.durations.map((d, i) => (
              <span
                key={i}
                className='text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md font-medium'
              >
                {d.duration}min
              </span>
            ))}
          </div>
        </div>

        {/* Price and Action */}
        <div className='flex items-center justify-between'>
          <div>
            <span className='text-lg font-bold text-gray-900'>
              From ${Math.min(...service.durations.map((d) => d.price))}
            </span>
            <span className='text-sm text-gray-500 ml-1'>per person</span>
          </div>
          <div className='flex items-center text-gray-400 group-hover:text-gray-600 transition-colors'>
            <span className='text-sm font-medium mr-2'>Select</span>
            <ArrowRight className='w-4 h-4 group-hover:translate-x-1 transition-transform' />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

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
        {/* Header with Image */}
        <div className='relative h-32 overflow-hidden'>
          <img
            src={service.imageUrl}
            alt={service.name}
            className='w-full h-full object-cover'
          />
          <div className='absolute inset-0 bg-black/40' />
          <button
            onClick={onCancel}
            className='absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors'
          >
            <X className='w-5 h-5' />
          </button>
          <div className='absolute bottom-4 left-6 text-white'>
            <h2 className='text-xl font-semibold'>{service.name}</h2>
            <p className='text-white/80 text-sm'>{service.description}</p>
          </div>
        </div>

        <div className='p-6 space-y-6'>
          {/* Duration Selection */}
          <div>
            <label className='block text-sm font-semibold text-gray-900 mb-3'>
              Choose Duration
            </label>
            <div className='grid grid-cols-1 gap-3'>
              {service.durations.map((option) => (
                <button
                  key={option.duration}
                  onClick={() => setDuration(option.duration)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    duration === option.duration
                      ? 'border-gray-900 bg-gray-50 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className='flex justify-between items-center'>
                    <div>
                      <div className='font-semibold text-gray-900'>
                        {option.duration} minutes
                      </div>
                      <div className='text-sm text-gray-600'>
                        Perfect for{' '}
                        {option.duration >= 90
                          ? 'deep relaxation'
                          : 'quick refresh'}
                      </div>
                    </div>
                    <div className='text-right'>
                      <div className='text-xl font-bold text-gray-900'>
                        ${option.price}
                      </div>
                      <div className='text-xs text-gray-500'>per person</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Date & Time */}
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-semibold text-gray-900 mb-2'>
                Date
              </label>
              <input
                type='date'
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className='w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent'
              />
            </div>
            <div>
              <label className='block text-sm font-semibold text-gray-900 mb-2'>
                Time
              </label>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className='w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent'
              >
                <option value=''>Select time</option>
                {TIME_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>
                    {new Date(`2000-01-01 ${slot}`).toLocaleTimeString([], {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    })}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Persons */}
          <div>
            <label className='block text-sm font-semibold text-gray-900 mb-3'>
              Number of People
            </label>
            <div className='flex items-center justify-between bg-gray-50 rounded-xl p-4'>
              <div className='flex items-center gap-4'>
                <button
                  type='button'
                  onClick={() => setPersons(Math.max(1, persons - 1))}
                  className='w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors'
                >
                  <Minus className='w-4 h-4' />
                </button>
                <span className='text-xl font-semibold w-8 text-center'>
                  {persons}
                </span>
                <button
                  type='button'
                  onClick={() =>
                    setPersons(Math.min(service.maxPersons, persons + 1))
                  }
                  className='w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors'
                >
                  <Plus className='w-4 h-4' />
                </button>
              </div>
              <div className='text-sm text-gray-600'>
                Max: {service.maxPersons} people
              </div>
            </div>
          </div>

          {/* Price Summary */}
          <div className='bg-gray-900 text-white rounded-xl p-6'>
            <div className='flex justify-between items-center mb-2'>
              <span className='font-semibold'>Total Price</span>
              <span className='text-2xl font-bold'>${totalPrice}</span>
            </div>
            {persons > 1 && (
              <div className='text-sm text-gray-300'>
                ${currentPrice} × {persons} people
              </div>
            )}
            <div className='mt-3 pt-3 border-t border-gray-700'>
              <div className='flex items-center gap-2 text-sm text-gray-300'>
                <CheckCircle className='w-4 h-4' />
                All equipment & setup included
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className='flex gap-3'>
            <button
              onClick={onCancel}
              className='flex-1 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium'
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!date || !time}
              className='flex-1 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2'
            >
              <ShoppingCart className='w-4 h-4' />
              Add to Cart
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const FloatingCart = ({
  bookings,
  onRemove,
  onToggle,
  isOpen,
}: {
  bookings: BookingItem[];
  onRemove: (id: string) => void;
  onToggle: () => void;
  isOpen: boolean;
}) => {
  const totalPrice = bookings.reduce((sum, booking) => sum + booking.price, 0);
  const itemCount = bookings.length;

  return (
    <>
      {/* Floating Cart Button */}
      <motion.button
        onClick={onToggle}
        className='fixed bottom-6 right-6 bg-gray-900 text-white rounded-full p-4 shadow-lg hover:bg-gray-800 transition-colors z-40'
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className='relative'>
          <ShoppingCart className='w-6 h-6' />
          {itemCount > 0 && (
            <span className='absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center'>
              {itemCount}
            </span>
          )}
        </div>
      </motion.button>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='fixed inset-0 bg-black/50 backdrop-blur-sm z-30'
              onClick={onToggle}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className='fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-40 overflow-y-auto'
            >
              <div className='p-6'>
                <div className='flex items-center justify-between mb-6'>
                  <h3 className='text-xl font-semibold'>
                    Your Cart ({itemCount})
                  </h3>
                  <button
                    onClick={onToggle}
                    className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
                  >
                    <X className='w-5 h-5' />
                  </button>
                </div>

                {itemCount === 0 ? (
                  <div className='text-center py-12'>
                    <ShoppingCart className='w-16 h-16 text-gray-300 mx-auto mb-4' />
                    <p className='text-gray-500'>Your cart is empty</p>
                    <p className='text-sm text-gray-400 mt-2'>
                      Add some treatments to get started
                    </p>
                  </div>
                ) : (
                  <div className='space-y-4'>
                    {bookings.map((booking) => (
                      <motion.div
                        key={booking.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className='bg-gray-50 rounded-xl p-4 border border-gray-200'
                      >
                        <div className='flex items-start justify-between'>
                          <div className='flex items-start gap-3 flex-1'>
                            <div className='text-2xl'>{booking.emoji}</div>
                            <div className='flex-1'>
                              <h4 className='font-semibold text-gray-900 mb-1'>
                                {booking.serviceName}
                              </h4>
                              <div className='text-sm text-gray-600 space-y-1'>
                                <div className='flex items-center gap-2'>
                                  <Calendar className='w-3 h-3' />
                                  {new Date(booking.date).toLocaleDateString()}
                                  <Clock className='w-3 h-3 ml-2' />
                                  {booking.time}
                                </div>
                                <div className='flex items-center gap-2'>
                                  <Timer className='w-3 h-3' />
                                  {booking.duration} min
                                  <Users className='w-3 h-3 ml-2' />
                                  {booking.persons}{' '}
                                  {booking.persons > 1 ? 'people' : 'person'}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className='text-right'>
                            <div className='font-bold text-gray-900 mb-2'>
                              ${booking.price}
                            </div>
                            <button
                              onClick={() => onRemove(booking.id)}
                              className='text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-colors'
                            >
                              <Trash2 className='w-4 h-4' />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    <div className='border-t pt-4 mt-6'>
                      <div className='flex justify-between items-center text-lg font-semibold mb-4'>
                        <span>Total</span>
                        <span>${totalPrice}</span>
                      </div>
                      <button className='w-full py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium flex items-center justify-center gap-2'>
                        <CheckCircle className='w-5 h-5' />
                        Book Now (${totalPrice})
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

// 🎯 Main Component
const MassageForm: React.FC<FormProps> = ({ onSubmit, onCancel }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const categories = [
    'relaxation',
    'therapeutic',
    'beauty',
    'signature',
    'kids',
  ];

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
    setCartOpen(true); // Auto-open cart when item added
  };

  const removeBooking = (id: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
  };

  const handleCheckout = () => {
    const totalPrice = bookings.reduce(
      (sum, booking) => sum + booking.price,
      0
    );
    onSubmit({ bookings, totalPrice });
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <div className='bg-white shadow-sm border-b border-gray-200'>
        <div className='max-w-7xl mx-auto px-6 py-8'>
          <div className='text-center mb-8'>
            <h1 className='text-4xl font-light text-gray-900 mb-4'>
              Book Your Spa Experience
            </h1>
            <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
              Choose from our premium massage and wellness services, delivered
              to your vacation rental
            </p>
          </div>

          {/* Search & Filters */}
          <div className='max-w-4xl mx-auto space-y-6'>
            <div className='relative'>
              <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
              <input
                type='text'
                placeholder='Search treatments, benefits, or keywords...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='w-full pl-12 pr-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white text-lg shadow-sm'
              />
            </div>

            <div className='flex justify-center'>
              <div className='flex gap-3 flex-wrap'>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-6 py-3 rounded-full flex items-center gap-2 font-medium transition-all ${
                    selectedCategory === null
                      ? 'bg-gray-900 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  <Filter className='w-4 h-4' />
                  All Services
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-6 py-3 rounded-full flex items-center gap-2 capitalize font-medium transition-all ${
                      selectedCategory === category
                        ? 'bg-gray-900 text-white shadow-lg'
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
        </div>
      </div>

      {/* Services Grid */}
      <div className='max-w-7xl mx-auto px-6 py-12'>
        {filteredServices.length === 0 ? (
          <div className='text-center py-20'>
            <div className='w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6'>
              <Search className='w-12 h-12 text-gray-400' />
            </div>
            <h3 className='text-2xl font-semibold text-gray-900 mb-4'>
              No treatments found
            </h3>
            <p className='text-gray-600 mb-8 max-w-md mx-auto'>
              We couldn't find any treatments matching your search. Try
              adjusting your filters or search terms.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory(null);
              }}
              className='px-8 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium'
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onSelect={setSelectedService}
              />
            ))}
          </div>
        )}
      </div>

      {/* Service Location Info */}
      <div className='bg-white border-t border-gray-200'>
        <div className='max-w-7xl mx-auto px-6 py-12'>
          <div className='bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-100'>
            <div className='flex items-start gap-6'>
              <div className='w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0'>
                <MapPin className='w-8 h-8 text-blue-600' />
              </div>
              <div className='flex-1'>
                <h3 className='text-2xl font-semibold text-gray-900 mb-3'>
                  Premium In-Room Service
                </h3>
                <p className='text-gray-700 mb-6 text-lg leading-relaxed'>
                  Our professional therapists arrive at your vacation rental
                  with all necessary equipment, premium products, and expertise
                  to transform your space into a luxury spa.
                </p>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                  <div className='flex items-center gap-3 text-gray-600'>
                    <CheckCircle className='w-5 h-5 text-green-500 flex-shrink-0' />
                    <span>Professional setup included</span>
                  </div>
                  <div className='flex items-center gap-3 text-gray-600'>
                    <CheckCircle className='w-5 h-5 text-green-500 flex-shrink-0' />
                    <span>Premium organic products</span>
                  </div>
                  <div className='flex items-center gap-3 text-gray-600'>
                    <CheckCircle className='w-5 h-5 text-green-500 flex-shrink-0' />
                    <span>Licensed & insured therapists</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Cart */}
      <FloatingCart
        bookings={bookings}
        onRemove={removeBooking}
        onToggle={() => setCartOpen(!cartOpen)}
        isOpen={cartOpen}
      />

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
          className='px-6 py-3 bg-white text-gray-700 rounded-full shadow-lg hover:bg-gray-50 transition-colors font-medium border border-gray-200'
        >
          Cancel Booking
        </button>
      </div>
    </div>
  );
};

export default MassageForm;
