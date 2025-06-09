import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { Service } from '@/types/type';
import { ServiceData } from '@/types/services';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useBooking } from '@/context/BookingContext';
import {
  Bike,
  MapPin,
  Clock,
  Star,
  ArrowRight,
  Shield,
  Truck,
  CheckCircle,
  AlertTriangle,
  Battery,
  Route,
  Users,
  Calendar,
  Baby,
  CreditCard,
  Info,
  X,
  Plus,
  Minus,
  ArrowUp,
} from 'lucide-react';

interface BikeRentalServiceViewProps {
  service: Service;
  serviceData?: ServiceData;
  primaryColor?: string;
  viewContext?: 'standard-view' | 'premium-view';
}

// Types for booking form
interface BikeType {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  ageRange: string;
  minAge: number;
  maxAge: number;
  features: string[];
  isPremium?: boolean;
}

interface ChildInfo {
  id: string;
  age: number;
  recommendedBike: string;
}

interface BookingFormData {
  startDate: string;
  endDate: string;
  endTime: string;
  startTime: string;
  location: string;
  adultCount: number;
  childCount: number;
  children: ChildInfo[];
  selectedBikes: Record<string, number>;
  needsHelmet: boolean;
  needsLock: boolean;
  deliveryToHotel: boolean;
  specialRequests: string;
}

interface FormErrors {
  [key: string]: string;
}

// Enhanced bike types with all necessary properties
const BIKE_TYPES: BikeType[] = [
  {
    id: 'kids-bike',
    name: 'Kids Bikes',
    price: 15,
    image:
      'https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&q=80&w=600',
    description: 'Safe and fun bikes designed specifically for children',
    ageRange: '4-12 years',
    minAge: 4,
    maxAge: 12,
    features: ['Training wheels available', 'Safety features', 'Bright colors'],
  },
  {
    id: 'beachCruiser',
    name: 'Beach Cruiser',
    price: 25,
    image:
      'https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&q=80&w=600',
    description: 'Perfect for coastal rides and beach exploration',
    ageRange: '13+ years',
    minAge: 13,
    maxAge: 99,
    features: ['Comfortable seat', 'Beach-ready tires', 'Basket included'],
  },
  {
    id: 'cityBike',
    name: 'City Bike',
    price: 30,
    image:
      'https://images.unsplash.com/photo-1502744688674-c619d1586c9e?auto=format&fit=crop&q=80&w=600',
    description: 'Ideal for urban exploration and local attractions',
    ageRange: '13+ years',
    minAge: 13,
    maxAge: 99,
    features: ['Multi-gear system', 'City-optimized', 'Lights included'],
  },
  {
    id: 'mountainBike',
    name: 'Mountain Bike',
    price: 35,
    image:
      'https://images.unsplash.com/photo-1544191696-15693169e831?auto=format&fit=crop&q=80&w=600',
    description: 'Built for adventure and off-road trails',
    ageRange: '16+ years',
    minAge: 16,
    maxAge: 99,
    features: ['All-terrain tires', 'Suspension', 'Trail-ready'],
  },
  {
    id: 'eBike',
    name: 'E-Bike',
    price: 45,
    image:
      'https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&q=80&w=600',
    description: 'Electric assistance for effortless rides',
    ageRange: '18+ years',
    minAge: 18,
    maxAge: 99,
    features: ['Electric motor', 'Long battery life', 'Premium comfort'],
    isPremium: true,
  },
];

const INCLUDED_ITEMS = [
  { icon: Shield, text: 'Safety helmet included' },
  { icon: CheckCircle, text: 'Secure bike lock' },
  { icon: Truck, text: 'Free delivery & pickup' },
  { icon: Clock, text: '24/7 customer support' },
];

const PROCESS_STEPS = [
  { step: '1', text: 'Choose your bike type', icon: Bike },
  { step: '2', text: 'We deliver to your location', icon: Truck },
  { step: '3', text: 'Quick safety briefing', icon: Shield },
  { step: '4', text: 'Explore at your own pace', icon: Route },
];

const FEATURES = [
  {
    icon: <Clock className='w-6 h-6' />,
    title: 'Flexible Hours',
    description: 'Rent by hour, day, or week',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: <MapPin className='w-6 h-6' />,
    title: 'Free Delivery',
    description: 'Delivered anywhere in Punta Cana',
    color: 'bg-green-50 text-green-600',
  },
  {
    icon: <Battery className='w-6 h-6' />,
    title: 'Premium Quality',
    description: 'Well-maintained, latest models',
    color: 'bg-purple-50 text-purple-600',
  },
];

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const BikeRentalServiceView: React.FC<BikeRentalServiceViewProps> = ({
  service,
  serviceData,
  primaryColor = 'green',
  viewContext,
}) => {
  const { t } = useTranslation();
  const { bookService } = useBooking();

  // State for bike selection and booking form
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedBikeType, setSelectedBikeType] = useState('');

  // Booking form state
  const [formData, setFormData] = useState<BookingFormData>({
    startDate: '',
    endDate: '',
    endTime: '',
    startTime: '09:00',
    location: '',
    adultCount: 2,
    childCount: 0,
    children: [],
    selectedBikes: {},
    needsHelmet: true,
    needsLock: true,
    deliveryToHotel: true,
    specialRequests: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Calculate rental days
  const rentalDays = useMemo(() => {
    if (!formData.startDate || !formData.endDate) return 1;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(1, diffDays + 1);
  }, [formData.startDate, formData.endDate]);

  // Calculate total bikes needed
  const totalBikesNeeded = useMemo(() => {
    return formData.adultCount + formData.childCount;
  }, [formData.adultCount, formData.childCount]);

  // Calculate total bikes selected
  const totalBikesSelected = useMemo(() => {
    return Object.values(formData.selectedBikes).reduce(
      (sum, count) => sum + count,
      0
    );
  }, [formData.selectedBikes]);

  // Auto-recommend bikes based on children ages
  const recommendedBikes = useMemo(() => {
    const recommendations: Record<string, number> = {};

    if (formData.adultCount > 0) {
      recommendations['cityBike'] =
        (recommendations['cityBike'] || 0) + formData.adultCount;
    }

    formData.children.forEach((child) => {
      const suitableBike = BIKE_TYPES.find(
        (bike) => child.age >= bike.minAge && child.age <= bike.maxAge
      );
      if (suitableBike) {
        recommendations[suitableBike.id] =
          (recommendations[suitableBike.id] || 0) + 1;
      }
    });

    return recommendations;
  }, [formData.adultCount, formData.children]);

  // Update children array when child count changes
  useEffect(() => {
    const currentChildrenCount = formData.children.length;
    const newChildCount = formData.childCount;

    if (newChildCount > currentChildrenCount) {
      const newChildren = [...formData.children];
      for (let i = currentChildrenCount; i < newChildCount; i++) {
        newChildren.push({
          id: `child-${i + 1}`,
          age: 8,
          recommendedBike: 'kids-bike',
        });
      }
      setFormData((prev) => ({ ...prev, children: newChildren }));
    } else if (newChildCount < currentChildrenCount) {
      setFormData((prev) => ({
        ...prev,
        children: prev.children.slice(0, newChildCount),
      }));
    }
  }, [formData.childCount]);

  // Auto-apply selected bike when form opens
  useEffect(() => {
    if (
      showBookingForm &&
      selectedBikeType &&
      Object.keys(formData.selectedBikes).length === 0
    ) {
      setFormData((prev) => ({
        ...prev,
        selectedBikes: { [selectedBikeType]: 1 },
      }));
    }
  }, [showBookingForm, selectedBikeType, formData.selectedBikes]);

  // Calculate total price
  const calculatePrice = useMemo(() => {
    let total = 0;

    Object.entries(formData.selectedBikes).forEach(([bikeType, count]) => {
      const bike = BIKE_TYPES.find((b) => b.id === bikeType);
      if (bike) {
        total += bike.price * count * rentalDays;
      }
    });

    if (formData.deliveryToHotel && formData.location !== 'Hotel pickup') {
      total += 10;
    }

    return total;
  }, [
    formData.selectedBikes,
    formData.deliveryToHotel,
    formData.location,
    rentalDays,
  ]);

  // Handle bike selection - now supports multiple bike types
  const handleBikeSelect = useCallback(
    (bikeId: string) => {
      if (!showBookingForm) {
        // First bike selection - open form
        setSelectedBikeType(bikeId);
        setShowBookingForm(true);
        setFormData((prev) => ({
          ...prev,
          selectedBikes: { [bikeId]: 1 },
        }));
      } else {
        // Add another bike type to existing selection
        setFormData((prev) => ({
          ...prev,
          selectedBikes: {
            ...prev.selectedBikes,
            [bikeId]: (prev.selectedBikes[bikeId] || 0) + 1,
          },
        }));
      }
    },
    [showBookingForm]
  );

  // Form handlers
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = 'checked' in e.target ? e.target.checked : false;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const createCounterHandler = (
    field: keyof BookingFormData,
    min = 0,
    max = 20
  ) => ({
    increment: () =>
      setFormData((prev) => ({
        ...prev,
        [field]: Math.min(max, (prev[field] as number) + 1),
      })),
    decrement: () =>
      setFormData((prev) => ({
        ...prev,
        [field]: Math.max(min, (prev[field] as number) - 1),
      })),
  });

  const adultCounter = createCounterHandler('adultCount', 1);
  const childCounter = createCounterHandler('childCount', 0);

  const handleChildAgeChange = (childId: string, age: number) => {
    setFormData((prev) => ({
      ...prev,
      children: prev.children.map((child) =>
        child.id === childId
          ? {
              ...child,
              age,
              recommendedBike:
                BIKE_TYPES.find(
                  (bike) => age >= bike.minAge && age <= bike.maxAge
                )?.id || 'kids-bike',
            }
          : child
      ),
    }));
  };

  const handleBikeSelection = (bikeId: string, count: number) => {
    setFormData((prev) => ({
      ...prev,
      selectedBikes: {
        ...prev.selectedBikes,
        [bikeId]: Math.max(0, count),
      },
    }));
  };

  // Validation and submission
  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (!formData.endTime) newErrors.endTime = 'End time is required';
    if (!formData.location) newErrors.location = 'Location is required';

    if (formData.startDate && formData.endDate) {
      if (new Date(formData.endDate) < new Date(formData.startDate)) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    if (totalBikesNeeded < 1) {
      newErrors.adultCount = 'At least one participant is required';
    }

    formData.children.forEach((child, index) => {
      if (child.age < 4 || child.age > 17) {
        newErrors[`child-${index}-age`] = 'Child age must be between 4 and 17';
      }
    });

    // Simplified bike validation - just check if we have the selected bike
    const selectedBikeCount = formData.selectedBikes[selectedBikeType] || 0;
    if (selectedBikeCount === 0) {
      newErrors.selectedBikes = 'Please select at least one bike';
    }

    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Process booking
      console.log('Booking submitted:', {
        ...formData,
        totalPrice: calculatePrice,
        rentalDays,
      });

      // Here you would typically call your booking service
      // bookService(service, bookingData);

      alert('Booking submitted successfully!');
    }
  };

  // Counter component
  const Counter = ({
    label,
    value,
    onIncrement,
    onDecrement,
    icon: Icon,
    min = 0,
  }: {
    label: string;
    value: number;
    onIncrement: () => void;
    onDecrement: () => void;
    icon: React.ElementType;
    min?: number;
  }) => (
    <div>
      <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
        <Icon className='w-4 h-4 mr-2 text-green-700' />
        {label}
      </label>
      <div className='flex border border-gray-300 rounded-lg overflow-hidden bg-white'>
        <button
          type='button'
          onClick={onDecrement}
          disabled={value <= min}
          className='px-4 py-2 bg-gray-100 hover:bg-gray-200 transition disabled:opacity-50'
        >
          <Minus className='w-4 h-4' />
        </button>
        <div className='flex-1 py-2 text-center font-medium'>{value}</div>
        <button
          type='button'
          onClick={onIncrement}
          className='px-4 py-2 bg-gray-100 hover:bg-gray-200 transition'
        >
          <Plus className='w-4 h-4' />
        </button>
      </div>
    </div>
  );

  return (
    <div className='max-w-8xl mx-auto px-6 py-8 space-y-16'>
      {/* Hero Section */}
      <motion.div
        className='relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-gray-800 to-black'
        initial='hidden'
        animate='visible'
        variants={fadeInUp}
      >
        <div className='absolute inset-0 opacity-30'>
          <Image
            src='https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=1200'
            alt='Bike rental adventure'
            fill
            className='object-cover'
            priority
          />
        </div>

        <div className='relative z-10 p-12 md:p-16 text-white'>
          <motion.div
            className='inline-flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 mb-6'
            variants={fadeInUp}
          >
            <Bike className='w-5 h-5 text-white mr-2' />
            <span className='text-white font-medium'>
              Your Adventure Awaits
            </span>
          </motion.div>

          <motion.h1
            className='text-4xl md:text-6xl font-bold mb-6 leading-tight'
            variants={fadeInUp}
          >
            Bike Rental
            <br />
            <span className='text-gray-300'>Made Simple</span>
          </motion.h1>

          <motion.p
            className='text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl leading-relaxed'
            variants={fadeInUp}
          >
            Discover Punta Cana at your own pace with our premium bike rentals.
            High-quality bikes delivered straight to your accommodation.
          </motion.p>
        </div>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true }}
        variants={stagger}
      >
        <div className='text-center mb-12'>
          <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>
            Why Choose Our Bikes?
          </h2>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
            Premium quality, reliable service, and the freedom to explore
          </p>
        </div>

        <div className='grid md:grid-cols-3 gap-8'>
          {FEATURES.map((feature, index) => (
            <motion.div
              key={index}
              className='text-center p-8'
              variants={fadeInUp}
              whileHover={{ y: -4 }}
            >
              <div
                className={`w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center mx-auto mb-6`}
              >
                {feature.icon}
              </div>
              <h3 className='text-xl font-bold text-gray-900 mb-3'>
                {feature.title}
              </h3>
              <p className='text-gray-600 leading-relaxed'>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Bike Selection */}
      <motion.div
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true }}
        variants={stagger}
      >
        <div className='text-center mb-12'>
          <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>
            Choose Your Ride
          </h2>
          <p className='text-xl text-gray-600'>
            {!showBookingForm
              ? 'Select a bike to start your booking'
              : 'Click on additional bikes to add them to your selection'}
          </p>
        </div>

        <div className='grid md:grid-cols-2 lg:grid-cols-5 gap-6'>
          {BIKE_TYPES.map((bike, index) => {
            const isSelected = formData.selectedBikes[bike.id] > 0;
            const quantity = formData.selectedBikes[bike.id] || 0;

            return (
              <motion.div
                key={bike.id}
                className={`bg-white rounded-2xl shadow-sm border-2 cursor-pointer transition-all duration-300 overflow-hidden relative ${
                  isSelected
                    ? 'border-green-500 shadow-lg'
                    : 'border-gray-100 hover:border-gray-300 hover:shadow-md'
                }`}
                onClick={() => handleBikeSelect(bike.id)}
                variants={fadeInUp}
                whileHover={{ y: -4 }}
              >
                <div className='relative h-48'>
                  <Image
                    src={bike.image}
                    alt={bike.name}
                    fill
                    className='object-cover'
                  />
                  {bike.isPremium && (
                    <div className='absolute top-3 right-3 bg-gray-900 text-white px-2 py-1 rounded-full text-xs font-medium'>
                      Premium
                    </div>
                  )}
                  {isSelected && (
                    <div className='absolute top-3 left-3 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1'>
                      <CheckCircle className='w-3 h-3' />
                      {quantity}
                    </div>
                  )}
                  {showBookingForm && !isSelected && (
                    <div className='absolute top-3 left-3 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1'>
                      <Plus className='w-3 h-3' />
                      Add
                    </div>
                  )}
                </div>

                <div className='p-6'>
                  <div className='flex items-center justify-between mb-3'>
                    <h3 className='text-lg font-bold text-gray-900'>
                      {bike.name}
                    </h3>
                    <div className='text-right'>
                      <div className='text-xl font-bold text-gray-900'>
                        ${bike.price}
                      </div>
                      <div className='text-sm text-gray-500'>per day</div>
                    </div>
                  </div>

                  <p className='text-gray-600 mb-4 text-sm leading-relaxed'>
                    {bike.description}
                  </p>

                  <div className='space-y-1'>
                    {bike.features.slice(0, 2).map((feature, idx) => (
                      <div
                        key={idx}
                        className='flex items-center text-xs text-gray-500'
                      >
                        <div className='w-1.5 h-1.5 bg-gray-400 rounded-full mr-2'></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Inline Booking Form */}
      <AnimatePresence>
        {showBookingForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5 }}
            className='overflow-hidden'
          >
            <div className='bg-white rounded-2xl shadow-lg border border-gray-200 p-8'>
              <div className='flex items-center justify-between mb-8'>
                <div>
                  <h3 className='text-2xl font-bold text-gray-900'>
                    Complete Your Booking
                  </h3>
                  <p className='text-gray-600 mt-1'>
                    Selected:{' '}
                    {BIKE_TYPES.find((b) => b.id === selectedBikeType)?.name}
                  </p>
                </div>
                <button
                  onClick={() => setShowBookingForm(false)}
                  className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
                >
                  <X className='w-6 h-6 text-gray-500' />
                </button>
              </div>

              <form onSubmit={handleSubmit} className='space-y-8'>
                {/* Rental Period */}
                <div className='space-y-6'>
                  <h4 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2'>
                    Rental Period
                  </h4>

                  <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                    <div>
                      <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                        <Calendar className='w-4 h-4 mr-2 text-green-700' />
                        Start Date *
                      </label>
                      <input
                        type='date'
                        name='startDate'
                        value={formData.startDate}
                        onChange={handleInputChange}
                        className={`w-full p-3 border ${
                          errors.startDate
                            ? 'border-red-500'
                            : 'border-gray-300'
                        } rounded-lg focus:ring-green-500 focus:border-green-500`}
                        min={new Date().toISOString().split('T')[0]}
                      />
                      {errors.startDate && (
                        <p className='text-red-500 text-xs mt-1'>
                          {errors.startDate}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                        <Calendar className='w-4 h-4 mr-2 text-green-700' />
                        End Date *
                      </label>
                      <input
                        type='date'
                        name='endDate'
                        value={formData.endDate}
                        onChange={handleInputChange}
                        className={`w-full p-3 border ${
                          errors.endDate ? 'border-red-500' : 'border-gray-300'
                        } rounded-lg focus:ring-green-500 focus:border-green-500`}
                        min={
                          formData.startDate ||
                          new Date().toISOString().split('T')[0]
                        }
                      />
                      {errors.endDate && (
                        <p className='text-red-500 text-xs mt-1'>
                          {errors.endDate}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                        <Clock className='w-4 h-4 mr-2 text-green-700' />
                        End Time *
                      </label>
                      <input
                        type='time'
                        name='endTime'
                        value={formData.endTime}
                        onChange={handleInputChange}
                        className={`w-full p-3 border ${
                          errors.endTime ? 'border-red-500' : 'border-gray-300'
                        } rounded-lg focus:ring-green-500 focus:border-green-500`}
                      />
                      {errors.endTime && (
                        <p className='text-red-500 text-xs mt-1'>
                          {errors.endTime}
                        </p>
                      )}
                    </div>
                  </div>

                  {formData.startDate && formData.endDate && (
                    <div className='p-3 bg-green-50 border border-green-200 rounded-lg'>
                      <p className='text-sm text-green-800'>
                        <strong>Rental period:</strong> {rentalDays}{' '}
                        {rentalDays === 1 ? 'day' : 'days'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Location */}
                <div className='space-y-6'>
                  <h4 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2'>
                    Location & Delivery
                  </h4>

                  <div>
                    <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                      <MapPin className='w-4 h-4 mr-2 text-green-700' />
                      Delivery Address *
                    </label>
                    <input
                      type='text'
                      name='location'
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder='Enter your hotel name, address, or specific location in Punta Cana...'
                      className={`w-full p-3 border ${
                        errors.location ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg focus:ring-green-500 focus:border-green-500`}
                    />
                    {errors.location && (
                      <p className='text-red-500 text-xs mt-1'>
                        {errors.location}
                      </p>
                    )}
                    <p className='text-xs text-gray-500 mt-1'>
                      We deliver anywhere in Punta Cana area. Include hotel
                      name, room number, or specific landmarks to help us find
                      you.
                    </p>
                  </div>

                  <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
                    <div className='flex items-start'>
                      <Truck className='w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5' />
                      <div>
                        <h5 className='font-medium text-blue-800 mb-2'>
                          Free Delivery & Pickup Service
                        </h5>
                        <ul className='text-sm text-blue-700 space-y-1'>
                          <li>• We deliver bikes directly to your location</li>
                          <li>• Free pickup when your rental period ends</li>
                          <li>
                            • Available throughout Punta Cana and surrounding
                            areas
                          </li>
                          <li>• Safety briefing included with delivery</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className='flex items-center bg-gray-50 p-3 border border-gray-300 rounded-lg'>
                    <input
                      type='checkbox'
                      id='deliveryToHotel'
                      name='deliveryToHotel'
                      checked={formData.deliveryToHotel}
                      onChange={handleInputChange}
                      className='h-4 w-4 text-green-700 focus:ring-green-500 border-gray-300 rounded'
                    />
                    <label
                      htmlFor='deliveryToHotel'
                      className='ml-2 text-sm text-gray-700'
                    >
                      This is a hotel/resort address (helps us coordinate with
                      reception)
                    </label>
                  </div>
                </div>

                {/* Participants */}
                <div className='space-y-6'>
                  <h4 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2'>
                    Participants
                  </h4>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <Counter
                      label='Adults (18+)'
                      value={formData.adultCount}
                      onIncrement={adultCounter.increment}
                      onDecrement={adultCounter.decrement}
                      icon={Users}
                      min={1}
                    />

                    <Counter
                      label='Children (4-17)'
                      value={formData.childCount}
                      onIncrement={childCounter.increment}
                      onDecrement={childCounter.decrement}
                      icon={Baby}
                    />
                  </div>

                  {/* Children Details */}
                  {formData.childCount > 0 && (
                    <div className='space-y-4'>
                      <h5 className='font-medium text-gray-800'>
                        Children Details
                      </h5>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        {formData.children.map((child, index) => (
                          <div
                            key={child.id}
                            className='p-4 bg-gray-50 rounded-lg'
                          >
                            <div className='flex items-center justify-between mb-2'>
                              <label className='text-sm font-medium text-gray-700'>
                                Child {index + 1} Age
                              </label>
                              {child.recommendedBike && (
                                <span className='text-xs bg-green-100 text-green-800 px-2 py-1 rounded'>
                                  {
                                    BIKE_TYPES.find(
                                      (b) => b.id === child.recommendedBike
                                    )?.name
                                  }
                                </span>
                              )}
                            </div>
                            <select
                              value={child.age}
                              onChange={(e) =>
                                handleChildAgeChange(
                                  child.id,
                                  parseInt(e.target.value)
                                )
                              }
                              className='w-full p-2 border border-gray-300 rounded focus:ring-green-500 focus:border-green-500'
                            >
                              {Array.from({ length: 14 }, (_, i) => i + 4).map(
                                (age) => (
                                  <option key={age} value={age}>
                                    {age} years old
                                  </option>
                                )
                              )}
                            </select>
                            {errors[`child-${index}-age`] && (
                              <p className='text-red-500 text-xs mt-1'>
                                {errors[`child-${index}-age`]}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className='p-3 bg-green-50 border border-green-200 rounded-lg'>
                    <p className='text-sm text-green-800'>
                      <strong>Total participants:</strong> {totalBikesNeeded} (
                      {formData.adultCount} adults + {formData.childCount}{' '}
                      children)
                    </p>
                  </div>
                </div>

                {/* Selected Bikes Summary */}
                <div className='space-y-6'>
                  <h4 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2'>
                    Your Selected Bikes
                  </h4>

                  <div className='space-y-4'>
                    {Object.entries(formData.selectedBikes)
                      .filter(([_, count]) => count > 0)
                      .map(([bikeId, quantity]) => {
                        const bike = BIKE_TYPES.find((b) => b.id === bikeId);
                        if (!bike) return null;

                        return (
                          <div
                            key={bikeId}
                            className='bg-green-50 border-2 border-green-500 rounded-lg p-4'
                          >
                            <div className='flex items-center justify-between mb-3'>
                              <div className='flex items-center'>
                                <div className='relative w-16 h-16 mr-4'>
                                  <Image
                                    src={bike.image}
                                    alt={bike.name}
                                    fill
                                    className='object-cover rounded'
                                  />
                                </div>
                                <div>
                                  <h5 className='text-lg font-bold text-gray-900'>
                                    {bike.name}
                                  </h5>
                                  <p className='text-sm text-gray-600'>
                                    {bike.ageRange}
                                  </p>
                                  <p className='text-sm text-gray-600'>
                                    {bike.description}
                                  </p>
                                </div>
                              </div>
                              <div className='text-right'>
                                <div className='text-xl font-bold text-green-600'>
                                  ${bike.price}
                                </div>
                                <div className='text-sm text-gray-500'>
                                  per day
                                </div>
                                {bike.isPremium && (
                                  <div className='text-xs bg-purple-500 text-white px-2 py-1 rounded mt-1'>
                                    Premium
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className='mb-3'>
                              <div className='text-sm text-gray-600 mb-2'>
                                Features:
                              </div>
                              <div className='flex flex-wrap gap-1'>
                                {bike.features.map((feature, index) => (
                                  <span
                                    key={index}
                                    className='text-xs bg-white px-2 py-1 rounded border border-gray-200'
                                  >
                                    {feature}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className='flex items-center justify-between'>
                              <span className='text-sm font-medium text-gray-700'>
                                Quantity:
                              </span>
                              <div className='flex items-center space-x-2'>
                                <button
                                  type='button'
                                  onClick={() =>
                                    handleBikeSelection(bikeId, quantity - 1)
                                  }
                                  disabled={quantity <= 0}
                                  className='w-8 h-8 rounded-full bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 flex items-center justify-center'
                                >
                                  <Minus className='w-4 h-4' />
                                </button>
                                <span className='w-8 text-center font-bold text-lg'>
                                  {quantity}
                                </span>
                                <button
                                  type='button'
                                  onClick={() =>
                                    handleBikeSelection(bikeId, quantity + 1)
                                  }
                                  className='w-8 h-8 rounded-full bg-white border border-gray-300 hover:bg-gray-50 flex items-center justify-center'
                                >
                                  <Plus className='w-4 h-4' />
                                </button>
                              </div>
                            </div>

                            <div className='mt-2 text-right'>
                              <span className='text-sm text-gray-600'>
                                Subtotal: $
                                {(bike.price * quantity * rentalDays).toFixed(
                                  2
                                )}
                                {rentalDays > 1 && ` (${rentalDays} days)`}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                  </div>

                  {totalBikesSelected !== totalBikesNeeded && (
                    <div className='p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start'>
                      <AlertTriangle className='w-4 h-4 text-amber-600 mr-2 mt-0.5' />
                      <div className='text-sm text-amber-800'>
                        <strong>Note:</strong> You have {totalBikesSelected}{' '}
                        bikes selected but need {totalBikesNeeded} total (
                        {formData.adultCount} adults + {formData.childCount}{' '}
                        children).
                        {totalBikesSelected < totalBikesNeeded &&
                          ' Click on more bikes above to add them to your selection.'}
                      </div>
                    </div>
                  )}

                  {totalBikesSelected > 0 && (
                    <div className='p-3 bg-blue-50 border border-blue-200 rounded-lg'>
                      <p className='text-sm text-blue-800'>
                        <strong>Total bikes selected:</strong>{' '}
                        {totalBikesSelected}
                        {totalBikesSelected === totalBikesNeeded &&
                          ' ✓ Perfect match!'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Additional Options */}
                <div className='space-y-6'>
                  <h4 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2'>
                    Additional Options
                  </h4>

                  <div className='space-y-4'>
                    <div className='flex items-center bg-gray-50 p-3 border border-gray-300 rounded-lg'>
                      <input
                        type='checkbox'
                        id='needsHelmet'
                        name='needsHelmet'
                        checked={formData.needsHelmet}
                        onChange={handleInputChange}
                        className='h-4 w-4 text-green-700 focus:ring-green-500 border-gray-300 rounded'
                      />
                      <label
                        htmlFor='needsHelmet'
                        className='ml-2 text-sm text-gray-700 flex items-center'
                      >
                        <Shield className='w-4 h-4 mr-1 text-green-600' />
                        Include safety helmets (Free - Highly recommended)
                      </label>
                    </div>

                    <div className='flex items-center bg-gray-50 p-3 border border-gray-300 rounded-lg'>
                      <input
                        type='checkbox'
                        id='needsLock'
                        name='needsLock'
                        checked={formData.needsLock}
                        onChange={handleInputChange}
                        className='h-4 w-4 text-green-700 focus:ring-green-500 border-gray-300 rounded'
                      />
                      <label
                        htmlFor='needsLock'
                        className='ml-2 text-sm text-gray-700'
                      >
                        Include bike locks (Free)
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                      <Info className='w-4 h-4 mr-2 text-green-700' />
                      Special Requests or Notes
                    </label>
                    <textarea
                      name='specialRequests'
                      value={formData.specialRequests}
                      onChange={handleInputChange}
                      rows={3}
                      className='w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500'
                      placeholder='Any special requests, preferred routes, or additional information...'
                    />
                  </div>
                </div>

                {/* Safety Information */}
                <div className='bg-amber-50 border border-amber-200 rounded-lg p-4'>
                  <div className='flex items-start'>
                    <AlertTriangle className='w-5 h-5 text-amber-600 mr-3 flex-shrink-0 mt-0.5' />
                    <div>
                      <h4 className='font-medium text-amber-800 mb-2'>
                        Safety Information
                      </h4>
                      <ul className='text-sm text-amber-700 space-y-1'>
                        <li>
                          • Helmets are strongly recommended and provided free
                          of charge
                        </li>
                        <li>
                          • Children under 16 must be accompanied by an adult
                        </li>
                        <li>• Please follow all local traffic regulations</li>
                        <li>• Rental includes basic insurance coverage</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Footer with Price and Actions */}
                <div className='bg-gray-900 text-white p-6 rounded-lg flex flex-col md:flex-row items-center justify-between'>
                  <div className='flex flex-col items-center md:items-start mb-4 md:mb-0'>
                    <span className='text-gray-400 text-sm uppercase tracking-wide'>
                      Total Price
                    </span>
                    <div className='flex items-center mt-1'>
                      <span className='text-3xl font-light'>
                        ${calculatePrice.toFixed(2)}
                      </span>
                      {rentalDays > 1 && (
                        <span className='ml-2 text-sm bg-green-800 px-2 py-1 rounded'>
                          {rentalDays} days
                        </span>
                      )}
                    </div>

                    {/* Price breakdown */}
                    <div className='text-xs text-gray-400 mt-2 space-y-1'>
                      {Object.entries(formData.selectedBikes).map(
                        ([bikeType, count]) => {
                          if (count === 0) return null;
                          const bike = BIKE_TYPES.find(
                            (b) => b.id === bikeType
                          );
                          if (!bike) return null;
                          return (
                            <div key={bikeType}>
                              {bike.name}: {count} × ${bike.price} ×{' '}
                              {rentalDays} days = $
                              {bike.price * count * rentalDays}
                            </div>
                          );
                        }
                      )}
                      <div className='text-green-400'>
                        Delivery & pickup: Free!
                      </div>
                    </div>
                  </div>

                  <div className='flex space-x-4'>
                    <button
                      type='button'
                      onClick={() => setShowBookingForm(false)}
                      className='px-5 py-3 border border-gray-700 rounded-lg text-gray-300 hover:text-white hover:border-gray-600 transition'
                    >
                      Cancel
                    </button>

                    <button
                      type='submit'
                      className='px-8 py-3 bg-green-700 hover:bg-green-600 text-white rounded-lg transition flex items-center'
                    >
                      <CreditCard className='h-4 w-4 mr-2' />
                      Book Bikes
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* How It Works */}
      <motion.div
        className='bg-gray-50 rounded-3xl p-8 md:p-12'
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className='text-center mb-12'>
          <h2 className='text-3xl font-bold text-gray-900 mb-4'>
            How It Works
          </h2>
          <p className='text-xl text-gray-600'>Simple, fast, and convenient</p>
        </div>

        <div className='grid md:grid-cols-4 gap-8'>
          {PROCESS_STEPS.map((step, index) => (
            <div key={index} className='text-center'>
              <div className='relative mb-6'>
                <div className='w-16 h-16 bg-gray-900 text-white rounded-2xl flex items-center justify-center mx-auto font-bold text-xl'>
                  {step.step}
                </div>
                {index < PROCESS_STEPS.length - 1 && (
                  <div className='hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gray-200 -z-10'></div>
                )}
              </div>
              <div className='mb-4'>
                <step.icon className='w-8 h-8 text-gray-600 mx-auto' />
              </div>
              <p className='text-gray-700 font-medium'>{step.text}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* What's Included */}
      <motion.div
        className='grid md:grid-cols-2 gap-12'
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true }}
        variants={stagger}
      >
        <motion.div variants={fadeInUp}>
          <h2 className='text-3xl font-bold text-gray-900 mb-8'>
            What's Included
          </h2>
          <div className='space-y-6'>
            {INCLUDED_ITEMS.map((item, index) => (
              <div key={index} className='flex items-center'>
                <div className='w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4'>
                  <item.icon className='w-6 h-6 text-green-600' />
                </div>
                <span className='text-lg text-gray-700 font-medium'>
                  {item.text}
                </span>
              </div>
            ))}
          </div>

          <div className='mt-8 p-6 bg-amber-50 rounded-2xl border border-amber-200'>
            <h3 className='font-semibold text-amber-800 mb-3 flex items-center'>
              <AlertTriangle className='w-5 h-5 mr-2' />
              Important Information
            </h3>
            <ul className='text-amber-700 space-y-1'>
              <li>• Valid ID required for rental</li>
              <li>• Helmet use is strongly recommended</li>
              <li>• Follow local traffic regulations</li>
            </ul>
          </div>
        </motion.div>

        <motion.div
          className='relative h-96 rounded-2xl overflow-hidden'
          variants={fadeInUp}
        >
          <Image
            src='https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&q=80&w=600'
            alt='Bike rental experience'
            fill
            className='object-cover'
          />
        </motion.div>
      </motion.div>

      {/* Testimonial */}
      <motion.div
        className='bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12 text-center'
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className='flex justify-center mb-6'>
          {[...Array(5)].map((_, i) => (
            <Star key={i} className='w-6 h-6 text-yellow-400 fill-current' />
          ))}
        </div>
        <blockquote className='text-2xl md:text-3xl font-medium text-gray-900 mb-6 italic leading-relaxed'>
          "Fantastic service! The bike was delivered on time and in perfect
          condition. Made exploring Punta Cana so much more enjoyable."
        </blockquote>
        <cite className='text-lg text-gray-600 font-medium'>
          - Marcus T., Satisfied Customer
        </cite>
      </motion.div>

      {/* Location & Availability */}
      <motion.div
        className='grid md:grid-cols-3 gap-8'
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true }}
        variants={stagger}
      >
        <motion.div className='text-center p-6' variants={fadeInUp}>
          <Clock className='w-12 h-12 text-blue-600 mx-auto mb-4' />
          <h3 className='font-bold text-gray-900 mb-2'>Flexible Timing</h3>
          <p className='text-gray-600'>Available 24/7 to fit your schedule</p>
        </motion.div>

        <motion.div className='text-center p-6' variants={fadeInUp}>
          <Users className='w-12 h-12 text-green-600 mx-auto mb-4' />
          <h3 className='font-bold text-gray-900 mb-2'>All Ages Welcome</h3>
          <p className='text-gray-600'>
            Children's bikes and safety gear available
          </p>
        </motion.div>

        <motion.div className='text-center p-6' variants={fadeInUp}>
          <MapPin className='w-12 h-12 text-purple-600 mx-auto mb-4' />
          <h3 className='font-bold text-gray-900 mb-2'>Wide Coverage</h3>
          <p className='text-gray-600'>Delivery throughout Punta Cana area</p>
        </motion.div>
      </motion.div>

      {/* Final CTA - Only show when no bike is selected */}
      {!selectedBikeType && (
        <motion.div
          className='bg-gray-900 rounded-3xl p-8 md:p-12 text-white text-center'
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h2 className='text-3xl md:text-4xl font-bold mb-4'>
            Ready to Explore?
          </h2>
          <p className='text-xl text-gray-300 mb-8 max-w-2xl mx-auto'>
            Select a bike above to start your booking and discover Punta Cana
            from a new perspective
          </p>

          <div className='flex items-center justify-center gap-3 text-gray-400'>
            <ArrowUp className='w-6 h-6' />
            <span className='text-lg'>Choose your bike to continue</span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default BikeRentalServiceView;
