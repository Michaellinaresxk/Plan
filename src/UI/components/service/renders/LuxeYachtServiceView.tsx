import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Anchor,
  Users,
  Ruler,
  Zap,
  Waves,
  Camera,
  Star,
  MapPin,
  Clock,
  Fuel,
  Wifi,
  Music,
  Utensils,
  BedDouble,
  Droplets,
  X,
  ChevronLeft,
  ChevronRight,
  Calendar,
  MessageSquare,
  CreditCard,
  AlertCircle,
} from 'lucide-react';

// Types
interface YachtSpecification {
  length: string;
  maxGuests: number;
  cabins: number;
  bathrooms: number;
  crew: number;
  maxSpeed: string;
  fuelCapacity: string;
  manufacturer: string;
  year: number;
}

interface YachtAmenity {
  icon: React.ReactNode;
  name: string;
  description: string;
}

interface Yacht {
  id: string;
  name: string;
  category: 'sport' | 'luxury' | 'mega' | 'sailing';
  price: number;
  priceUnit: 'day' | 'hour';
  description: string;
  shortDescription: string;
  mainImage: string;
  gallery: string[];
  specifications: YachtSpecification;
  amenities: YachtAmenity[];
  highlights: string[];
  isPremium: boolean;
  isAvailable: boolean;
  rating: number;
  gradient: string;
}

// Mock Data
const YACHT_DATA: Yacht[] = [
  {
    id: 'sport-yacht-42',
    name: 'Azimut S7',
    category: 'sport',
    price: 2500,
    priceUnit: 'day',
    description:
      'Experience the thrill of the open sea with this stunning sport yacht. Perfect for day trips and water sports adventures.',
    shortDescription: 'High-performance sport yacht with sleek design',
    mainImage:
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
    ],
    specifications: {
      length: '68 ft',
      maxGuests: 12,
      cabins: 3,
      bathrooms: 2,
      crew: 2,
      maxSpeed: '35 knots',
      fuelCapacity: '2,200 L',
      manufacturer: 'Azimut',
      year: 2023,
    },
    amenities: [
      {
        icon: <Wifi className='w-5 h-5' />,
        name: 'WiFi',
        description: 'High-speed internet',
      },
      {
        icon: <Music className='w-5 h-5' />,
        name: 'Sound System',
        description: 'Premium audio',
      },
      {
        icon: <Utensils className='w-5 h-5' />,
        name: 'Galley',
        description: 'Fully equipped kitchen',
      },
      {
        icon: <Droplets className='w-5 h-5' />,
        name: 'Fresh Water',
        description: 'Shower facilities',
      },
    ],
    highlights: [
      'Water sports equipment',
      'Professional crew',
      'Premium sound system',
      'Air conditioning',
    ],
    isPremium: false,
    isAvailable: true,
    rating: 4.8,
    gradient: 'from-cyan-500 to-blue-600',
  },
  {
    id: 'luxury-yacht-85',
    name: 'Princess Y85',
    category: 'luxury',
    price: 5500,
    priceUnit: 'day',
    description:
      'Indulge in ultimate luxury aboard this magnificent yacht. Features world-class amenities and unparalleled comfort.',
    shortDescription: 'Ultra-luxury yacht with premium amenities',
    mainImage:
      'https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=800&h=600&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1582719471137-c3967ffb1c42?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=800&h=600&fit=crop',
    ],
    specifications: {
      length: '85 ft',
      maxGuests: 18,
      cabins: 4,
      bathrooms: 4,
      crew: 4,
      maxSpeed: '32 knots',
      fuelCapacity: '4,500 L',
      manufacturer: 'Princess',
      year: 2024,
    },
    amenities: [
      {
        icon: <Wifi className='w-5 h-5' />,
        name: 'WiFi',
        description: 'Satellite internet',
      },
      {
        icon: <Music className='w-5 h-5' />,
        name: 'Entertainment',
        description: 'Cinema system',
      },
      {
        icon: <Utensils className='w-5 h-5' />,
        name: 'Chef Service',
        description: 'Professional chef',
      },
      {
        icon: <BedDouble className='w-5 h-5' />,
        name: 'Luxury Suites',
        description: 'Master suites',
      },
    ],
    highlights: [
      'Professional chef',
      'Jacuzzi on deck',
      'Water toys included',
      'Butler service',
    ],
    isPremium: true,
    isAvailable: true,
    rating: 4.9,
    gradient: 'from-purple-600 to-pink-600',
  },
  {
    id: 'mega-yacht-120',
    name: 'Sunseeker 120',
    category: 'mega',
    price: 12000,
    priceUnit: 'day',
    description:
      'The pinnacle of luxury yachting. This mega yacht offers an unmatched experience with every conceivable amenity.',
    shortDescription: 'Superyacht with ultimate luxury and space',
    mainImage:
      'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=800&h=600&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1564001443772-b8b4b5b5b5b5?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1571675019871-42a7b1c13ba5?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
    ],
    specifications: {
      length: '120 ft',
      maxGuests: 24,
      cabins: 6,
      bathrooms: 6,
      crew: 8,
      maxSpeed: '28 knots',
      fuelCapacity: '8,000 L',
      manufacturer: 'Sunseeker',
      year: 2024,
    },
    amenities: [
      {
        icon: <Wifi className='w-5 h-5' />,
        name: 'Starlink WiFi',
        description: 'Global connectivity',
      },
      {
        icon: <Music className='w-5 h-5' />,
        name: 'Theater Room',
        description: 'Private cinema',
      },
      {
        icon: <Utensils className='w-5 h-5' />,
        name: 'Michelin Chef',
        description: 'World-class dining',
      },
      {
        icon: <BedDouble className='w-5 h-5' />,
        name: 'Master Suite',
        description: 'Presidential suite',
      },
    ],
    highlights: [
      'Helipad',
      'Spa & wellness center',
      'Private beach club',
      'Submarine garage',
    ],
    isPremium: true,
    isAvailable: true,
    rating: 5.0,
    gradient: 'from-amber-500 to-orange-600',
  },
];

// Form Data Interface
interface YachtFormData {
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  guestCount: number;
  specialRequests: string;
}

// Yacht Card Component
const YachtCard: React.FC<{ yacht: Yacht; onSelect: () => void }> = ({
  yacht,
  onSelect,
}) => {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      className='relative overflow-hidden rounded-3xl shadow-xl bg-white border border-gray-100 group cursor-pointer'
      onClick={onSelect}
    >
      {/* Image */}
      <div className='relative h-80 overflow-hidden'>
        <img
          src={yacht.mainImage}
          alt={yacht.name}
          className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
        />
        <div
          className={`absolute inset-0 bg-gradient-to-t ${yacht.gradient} opacity-20 group-hover:opacity-30 transition-opacity`}
        />

        {/* Badges */}
        <div className='absolute top-4 left-4 flex gap-2'>
          {yacht.isPremium && (
            <span className='bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center'>
              <Star className='w-3 h-3 mr-1' />
              Premium
            </span>
          )}
          <span className='bg-black/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium'>
            {yacht.specifications.length}
          </span>
        </div>

        {/* Rating */}
        <div className='absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center'>
          <Star className='w-4 h-4 text-amber-500 fill-current mr-1' />
          <span className='text-sm font-medium'>{yacht.rating}</span>
        </div>

        {/* Quick Specs Overlay */}
        <div className='absolute bottom-4 left-4 right-4 bg-white/10 backdrop-blur-md rounded-xl p-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
          <div className='grid grid-cols-3 gap-4 text-center'>
            <div>
              <Users className='w-4 h-4 mx-auto mb-1' />
              <div className='text-xs'>
                {yacht.specifications.maxGuests} guests
              </div>
            </div>
            <div>
              <BedDouble className='w-4 h-4 mx-auto mb-1' />
              <div className='text-xs'>
                {yacht.specifications.cabins} cabins
              </div>
            </div>
            <div>
              <Zap className='w-4 h-4 mx-auto mb-1' />
              <div className='text-xs'>{yacht.specifications.maxSpeed}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className='p-6'>
        <div className='flex justify-between items-start mb-3'>
          <h3 className='text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors'>
            {yacht.name}
          </h3>
          <div className='text-right'>
            <div className='text-2xl font-bold text-gray-900'>
              ${yacht.price.toLocaleString()}
            </div>
            <div className='text-sm text-gray-500'>per {yacht.priceUnit}</div>
          </div>
        </div>

        <p className='text-gray-600 mb-4 line-clamp-2'>
          {yacht.shortDescription}
        </p>

        {/* Key Features */}
        <div className='grid grid-cols-2 gap-3 mb-4'>
          <div className='flex items-center text-sm text-gray-600'>
            <Users className='w-4 h-4 mr-2 text-blue-500' />
            Up to {yacht.specifications.maxGuests} guests
          </div>
          <div className='flex items-center text-sm text-gray-600'>
            <Ruler className='w-4 h-4 mr-2 text-blue-500' />
            {yacht.specifications.length}
          </div>
          <div className='flex items-center text-sm text-gray-600'>
            <BedDouble className='w-4 h-4 mr-2 text-blue-500' />
            {yacht.specifications.cabins} cabins
          </div>
          <div className='flex items-center text-sm text-gray-600'>
            <Zap className='w-4 h-4 mr-2 text-blue-500' />
            {yacht.specifications.maxSpeed}
          </div>
        </div>

        {/* CTA Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`w-full py-3 rounded-xl text-white font-medium transition-colors bg-gradient-to-r ${yacht.gradient} hover:shadow-lg`}
        >
          View Details & Book
        </motion.button>
      </div>
    </motion.div>
  );
};

// Yacht Modal Component
const YachtModal: React.FC<{
  yacht: Yacht;
  onClose: () => void;
  onBook: () => void;
}> = ({ yacht, onClose, onBook }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showBookingForm, setShowBookingForm] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % yacht.gallery.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + yacht.gallery.length) % yacht.gallery.length
    );
  };

  if (showBookingForm) {
    return (
      <YachtBookingForm
        yacht={yacht}
        onClose={onClose}
        onBack={() => setShowBookingForm(false)}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50'
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className='bg-white rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-y-auto'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={`relative p-8 bg-gradient-to-r ${yacht.gradient} text-white`}
        >
          <button
            onClick={onClose}
            className='absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors'
          >
            <X className='w-6 h-6' />
          </button>

          <div className='flex items-center justify-between'>
            <div>
              <h2 className='text-3xl font-bold mb-2'>{yacht.name}</h2>
              <p className='text-white/90 text-lg'>{yacht.shortDescription}</p>
            </div>
            <div className='text-right'>
              <div className='text-4xl font-bold'>
                ${yacht.price.toLocaleString()}
              </div>
              <div className='text-white/80'>per {yacht.priceUnit}</div>
            </div>
          </div>
        </div>

        <div className='p-8'>
          {/* Gallery */}
          <div className='mb-8'>
            <h3 className='text-2xl font-bold text-gray-900 mb-4'>Gallery</h3>
            <div className='relative rounded-2xl overflow-hidden'>
              <img
                src={yacht.gallery[currentImageIndex]}
                alt={`${yacht.name} - Image ${currentImageIndex + 1}`}
                className='w-full h-96 object-cover'
              />

              {/* Navigation */}
              <button
                onClick={prevImage}
                className='absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/30 hover:bg-black/50 rounded-full text-white transition-colors'
              >
                <ChevronLeft className='w-6 h-6' />
              </button>
              <button
                onClick={nextImage}
                className='absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/30 hover:bg-black/50 rounded-full text-white transition-colors'
              >
                <ChevronRight className='w-6 h-6' />
              </button>

              {/* Indicators */}
              <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2'>
                {yacht.gallery.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className='grid lg:grid-cols-2 gap-8'>
            {/* Specifications */}
            <div>
              <h3 className='text-2xl font-bold text-gray-900 mb-4'>
                Technical Specifications
              </h3>
              <div className='space-y-4'>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='bg-gray-50 p-4 rounded-xl'>
                    <div className='flex items-center mb-2'>
                      <Ruler className='w-5 h-5 text-blue-600 mr-2' />
                      <span className='font-medium'>Length</span>
                    </div>
                    <div className='text-2xl font-bold text-gray-900'>
                      {yacht.specifications.length}
                    </div>
                  </div>
                  <div className='bg-gray-50 p-4 rounded-xl'>
                    <div className='flex items-center mb-2'>
                      <Users className='w-5 h-5 text-blue-600 mr-2' />
                      <span className='font-medium'>Max Guests</span>
                    </div>
                    <div className='text-2xl font-bold text-gray-900'>
                      {yacht.specifications.maxGuests}
                    </div>
                  </div>
                  <div className='bg-gray-50 p-4 rounded-xl'>
                    <div className='flex items-center mb-2'>
                      <BedDouble className='w-5 h-5 text-blue-600 mr-2' />
                      <span className='font-medium'>Cabins</span>
                    </div>
                    <div className='text-2xl font-bold text-gray-900'>
                      {yacht.specifications.cabins}
                    </div>
                  </div>
                  <div className='bg-gray-50 p-4 rounded-xl'>
                    <div className='flex items-center mb-2'>
                      <Zap className='w-5 h-5 text-blue-600 mr-2' />
                      <span className='font-medium'>Max Speed</span>
                    </div>
                    <div className='text-2xl font-bold text-gray-900'>
                      {yacht.specifications.maxSpeed}
                    </div>
                  </div>
                </div>

                <div className='bg-gray-50 p-4 rounded-xl'>
                  <h4 className='font-medium mb-3'>Additional Details</h4>
                  <div className='grid grid-cols-2 gap-3 text-sm'>
                    <div>
                      <span className='text-gray-600'>Manufacturer:</span>{' '}
                      <span className='font-medium'>
                        {yacht.specifications.manufacturer}
                      </span>
                    </div>
                    <div>
                      <span className='text-gray-600'>Year:</span>{' '}
                      <span className='font-medium'>
                        {yacht.specifications.year}
                      </span>
                    </div>
                    <div>
                      <span className='text-gray-600'>Bathrooms:</span>{' '}
                      <span className='font-medium'>
                        {yacht.specifications.bathrooms}
                      </span>
                    </div>
                    <div>
                      <span className='text-gray-600'>Crew:</span>{' '}
                      <span className='font-medium'>
                        {yacht.specifications.crew}
                      </span>
                    </div>
                    <div>
                      <span className='text-gray-600'>Fuel Capacity:</span>{' '}
                      <span className='font-medium'>
                        {yacht.specifications.fuelCapacity}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Amenities & Highlights */}
            <div>
              <h3 className='text-2xl font-bold text-gray-900 mb-4'>
                Amenities & Features
              </h3>

              <div className='space-y-6'>
                <div>
                  <h4 className='font-medium mb-3'>Premium Amenities</h4>
                  <div className='grid gap-3'>
                    {yacht.amenities.map((amenity, index) => (
                      <div
                        key={index}
                        className='flex items-center p-3 bg-gray-50 rounded-xl'
                      >
                        <div className='text-blue-600 mr-3'>{amenity.icon}</div>
                        <div>
                          <div className='font-medium'>{amenity.name}</div>
                          <div className='text-sm text-gray-600'>
                            {amenity.description}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className='font-medium mb-3'>Highlights</h4>
                  <div className='space-y-2'>
                    {yacht.highlights.map((highlight, index) => (
                      <div key={index} className='flex items-center text-sm'>
                        <Star className='w-4 h-4 text-amber-500 mr-2' />
                        {highlight}
                      </div>
                    ))}
                  </div>
                </div>

                <div className='bg-blue-50 p-4 rounded-xl'>
                  <h4 className='font-medium text-blue-900 mb-2'>
                    Professional Service Included
                  </h4>
                  <p className='text-sm text-blue-800'>
                    Experienced captain and crew, fuel, insurance, safety
                    equipment, and all necessary permits included in the price.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className='mt-8'>
            <h3 className='text-2xl font-bold text-gray-900 mb-4'>
              About This Yacht
            </h3>
            <p className='text-gray-600 leading-relaxed'>{yacht.description}</p>
          </div>

          {/* Booking CTA */}
          <div className='mt-8 p-6 bg-gray-50 rounded-2xl'>
            <div className='flex items-center justify-between'>
              <div>
                <h4 className='text-xl font-bold text-gray-900'>
                  Ready to Book?
                </h4>
                <p className='text-gray-600'>
                  Reserve your luxury yacht experience today
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowBookingForm(true)}
                className={`px-8 py-4 rounded-xl text-white font-medium bg-gradient-to-r ${yacht.gradient} hover:shadow-lg transition-shadow`}
              >
                Book Now
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Yacht Booking Form Component
const YachtBookingForm: React.FC<{
  yacht: Yacht;
  onClose: () => void;
  onBack: () => void;
}> = ({ yacht, onClose, onBack }) => {
  const [formData, setFormData] = useState<YachtFormData>({
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    guestCount: 1,
    specialRequests: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const updateGuestCount = (increment: boolean) => {
    setFormData((prev) => ({
      ...prev,
      guestCount: increment
        ? Math.min(yacht.specifications.maxGuests, prev.guestCount + 1)
        : Math.max(1, prev.guestCount - 1),
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.startTime) newErrors.startTime = 'Start time is required';
    if (!formData.location) newErrors.location = 'Location is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      alert('Booking request submitted successfully!');
      setIsSubmitting(false);
      onClose();
    }, 2000);
  };

  const calculateDuration = () => {
    if (!formData.startTime || !formData.endTime) return 0;
    const start = new Date(`2000-01-01T${formData.startTime}`);
    const end = new Date(`2000-01-01T${formData.endTime}`);
    let hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    if (hours < 0) hours += 24;
    return hours;
  };

  const totalPrice =
    yacht.priceUnit === 'day' ? yacht.price : yacht.price * calculateDuration();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50'
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className='bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={`relative p-8 bg-gradient-to-r ${yacht.gradient} text-white`}
        >
          <button
            onClick={onClose}
            className='absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors'
          >
            <X className='w-6 h-6' />
          </button>

          <button
            onClick={onBack}
            className='absolute top-4 left-4 p-2 hover:bg-white/20 rounded-full transition-colors'
          >
            <ChevronLeft className='w-6 h-6' />
          </button>

          <div className='text-center'>
            <h2 className='text-3xl font-bold mb-2'>Book {yacht.name}</h2>
            <p className='text-white/90'>
              Reserve your luxury yacht experience
            </p>
          </div>
        </div>

        <div className='p-8'>
          <div className='grid lg:grid-cols-2 gap-8'>
            {/* Left Column - Form Fields */}
            <div className='space-y-6'>
              {/* Date & Time */}
              <div>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                  When
                </h3>
                <div className='grid gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      <Calendar className='w-4 h-4 inline mr-2' />
                      Date *
                    </label>
                    <input
                      type='date'
                      name='date'
                      value={formData.date}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 ${
                        errors.date ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.date && (
                      <p className='text-red-500 text-sm mt-1'>{errors.date}</p>
                    )}
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        <Clock className='w-4 h-4 inline mr-2' />
                        Start Time *
                      </label>
                      <input
                        type='time'
                        name='startTime'
                        value={formData.startTime}
                        onChange={handleInputChange}
                        className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 ${
                          errors.startTime
                            ? 'border-red-300'
                            : 'border-gray-300'
                        }`}
                      />
                      {errors.startTime && (
                        <p className='text-red-500 text-sm mt-1'>
                          {errors.startTime}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        End Time
                      </label>
                      <input
                        type='time'
                        name='endTime'
                        value={formData.endTime}
                        onChange={handleInputChange}
                        className='w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500'
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                  Where
                </h3>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    <MapPin className='w-4 h-4 inline mr-2' />
                    Departure Location *
                  </label>
                  <select
                    name='location'
                    value={formData.location}
                    onChange={handleInputChange}
                    className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 ${
                      errors.location ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value=''>Select departure location</option>
                    <option value='punta-cana-marina'>Punta Cana Marina</option>
                    <option value='cap-cana-marina'>Cap Cana Marina</option>
                    <option value='bavaro-beach'>Bavaro Beach</option>
                    <option value='hotel-pickup'>Hotel Pickup</option>
                  </select>
                  {errors.location && (
                    <p className='text-red-500 text-sm mt-1'>
                      {errors.location}
                    </p>
                  )}
                </div>
              </div>

              {/* Guest Count */}
              <div>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                  Guests
                </h3>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-3'>
                    <Users className='w-4 h-4 inline mr-2' />
                    Number of Guests
                  </label>
                  <div className='flex items-center justify-center max-w-xs'>
                    <button
                      type='button'
                      onClick={() => updateGuestCount(false)}
                      className='w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors'
                    >
                      -
                    </button>
                    <div className='mx-6 text-center'>
                      <div className='text-2xl font-bold'>
                        {formData.guestCount}
                      </div>
                      <div className='text-sm text-gray-600'>guests</div>
                    </div>
                    <button
                      type='button'
                      onClick={() => updateGuestCount(true)}
                      className='w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors'
                    >
                      +
                    </button>
                  </div>
                  <p className='text-sm text-gray-500 mt-2 text-center'>
                    Maximum: {yacht.specifications.maxGuests} guests
                  </p>
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                  Special Requests
                </h3>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    <MessageSquare className='w-4 h-4 inline mr-2' />
                    Additional Requirements
                  </label>
                  <textarea
                    name='specialRequests'
                    value={formData.specialRequests}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder='Special occasions, dietary requirements, water sports preferences, etc.'
                    className='w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 resize-none'
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Summary */}
            <div className='space-y-6'>
              {/* Yacht Summary */}
              <div className='bg-gray-50 p-6 rounded-2xl'>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                  Your Selection
                </h3>
                <div className='flex items-center mb-4'>
                  <img
                    src={yacht.mainImage}
                    alt={yacht.name}
                    className='w-20 h-20 object-cover rounded-xl mr-4'
                  />
                  <div>
                    <h4 className='font-semibold'>{yacht.name}</h4>
                    <p className='text-sm text-gray-600'>
                      {yacht.specifications.length} •{' '}
                      {yacht.specifications.maxGuests} guests
                    </p>
                  </div>
                </div>

                {formData.date && (
                  <div className='space-y-2 text-sm'>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>Date:</span>
                      <span className='font-medium'>
                        {new Date(formData.date).toLocaleDateString()}
                      </span>
                    </div>
                    {formData.startTime && (
                      <div className='flex justify-between'>
                        <span className='text-gray-600'>Time:</span>
                        <span className='font-medium'>
                          {formData.startTime}{' '}
                          {formData.endTime && `- ${formData.endTime}`}
                        </span>
                      </div>
                    )}
                    {formData.location && (
                      <div className='flex justify-between'>
                        <span className='text-gray-600'>Location:</span>
                        <span className='font-medium'>
                          {formData.location.replace('-', ' ')}
                        </span>
                      </div>
                    )}
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>Guests:</span>
                      <span className='font-medium'>{formData.guestCount}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Price Summary */}
              <div className='bg-blue-50 p-6 rounded-2xl'>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                  Price Summary
                </h3>
                <div className='space-y-2'>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>
                      {yacht.priceUnit === 'day'
                        ? 'Daily rate'
                        : `Hourly rate (${calculateDuration()}h)`}
                    </span>
                    <span className='font-medium'>
                      ${totalPrice.toLocaleString()}
                    </span>
                  </div>
                  <div className='border-t pt-2'>
                    <div className='flex justify-between text-lg font-bold'>
                      <span>Total</span>
                      <span>${totalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className='mt-4 p-3 bg-white rounded-xl'>
                  <h4 className='font-medium text-sm mb-2'>Included:</h4>
                  <ul className='text-xs text-gray-600 space-y-1'>
                    <li>• Professional captain & crew</li>
                    <li>• Fuel & insurance</li>
                    <li>• Safety equipment</li>
                    <li>• Basic refreshments</li>
                  </ul>
                </div>
              </div>

              {/* Important Notes */}
              <div className='bg-amber-50 p-4 rounded-xl'>
                <div className='flex items-start'>
                  <AlertCircle className='w-5 h-5 text-amber-600 mr-2 mt-0.5 flex-shrink-0' />
                  <div className='text-sm text-amber-800'>
                    <p className='font-medium mb-1'>Important Notes:</p>
                    <ul className='space-y-1'>
                      <li>• Weather conditions may affect departure</li>
                      <li>• Final confirmation within 24 hours</li>
                      <li>• Cancellation policy applies</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className='mt-8 pt-6 border-t'>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`w-full py-4 rounded-xl text-white font-medium transition-all bg-gradient-to-r ${yacht.gradient} hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center`}
            >
              {isSubmitting ? (
                <>
                  <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2'></div>
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className='w-5 h-5 mr-2' />
                  Confirm Booking - ${totalPrice.toLocaleString()}
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Main Yacht Service View Component
const YachtServiceView: React.FC = () => {
  const [selectedYacht, setSelectedYacht] = useState<Yacht | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'All Yachts', icon: <Anchor className='w-5 h-5' /> },
    { id: 'sport', name: 'Sport Yachts', icon: <Zap className='w-5 h-5' /> },
    { id: 'luxury', name: 'Luxury Yachts', icon: <Star className='w-5 h-5' /> },
    { id: 'mega', name: 'Mega Yachts', icon: <Waves className='w-5 h-5' /> },
  ];

  const filteredYachts =
    categoryFilter === 'all'
      ? YACHT_DATA
      : YACHT_DATA.filter((yacht) => yacht.category === categoryFilter);

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50'>
      {/* Hero Section */}
      <div className='relative overflow-hidden bg-gradient-to-r from-blue-900 via-blue-800 to-cyan-900 text-white'>
        <div className='absolute inset-0 bg-black/20'></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=1920&h=1080&fit=crop')] bg-cover bg-center opacity-30"></div>

        <div className='relative max-w-7xl mx-auto px-4 py-24'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className='text-center'
          >
            <h1 className='text-5xl md:text-7xl font-light mb-6 tracking-wide'>
              Luxury Yacht
              <span className='block bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent font-bold'>
                Experiences
              </span>
            </h1>
            <p className='text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-8 leading-relaxed'>
              Discover the Caribbean in unparalleled luxury aboard our exclusive
              fleet of premium yachts
            </p>
            <div className='flex items-center justify-center gap-8 text-blue-200'>
              <div className='flex items-center gap-2'>
                <Anchor className='w-6 h-6' />
                <span>Premium Fleet</span>
              </div>
              <div className='flex items-center gap-2'>
                <Users className='w-6 h-6' />
                <span>Professional Crew</span>
              </div>
              <div className='flex items-center gap-2'>
                <Star className='w-6 h-6' />
                <span>5-Star Service</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Category Filter */}
      <div className='max-w-7xl mx-auto px-4 py-12'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='flex flex-wrap justify-center gap-4 mb-12'
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setCategoryFilter(category.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
                categoryFilter === category.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-200'
              }`}
            >
              {category.icon}
              {category.name}
            </button>
          ))}
        </motion.div>

        {/* Yacht Grid */}
        <motion.div
          layout
          className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8'
        >
          <AnimatePresence>
            {filteredYachts.map((yacht, index) => (
              <motion.div
                key={yacht.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: index * 0.1 }}
              >
                <YachtCard
                  yacht={yacht}
                  onSelect={() => setSelectedYacht(yacht)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedYacht && (
          <YachtModal
            yacht={selectedYacht}
            onClose={() => setSelectedYacht(null)}
            onBook={() => {}}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default YachtServiceView;
