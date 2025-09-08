import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Clock,
  Shield,
  Star,
  Check,
  ArrowRight,
  X,
  Sparkles,
  Users,
  Anchor,
  Sun,
  Music,
  LifeBuoy,
  Calendar,
  DollarSign,
  AlertCircle,
  Camera,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
// Assuming you have these imports in your actual file
// import BookingModal from '../../modal/BookingModal';
// import { useBooking } from '@/context/BookingContext';
// import { BookingDate, Service } from '@/constants/formFields';

// ==================== DATA LAYER ====================
const CATAMARAN_DATA = {
  destiny: {
    id: 'destiny',
    name: 'Destiny',
    category: 'party',
    description: 'High-energy party cruise experience',
    image:
      'https://res.cloudinary.com/ddg92xar5/image/upload/v1756802334/4_vg6qwh.jpg',
    gallery: [
      'https://res.cloudinary.com/ddg92xar5/image/upload/v1756802334/1_wvnp2r.jpg',
      'https://res.cloudinary.com/ddg92xar5/image/upload/v1756802335/3_oahsqo.jpg',
      'https://res.cloudinary.com/ddg92xar5/image/upload/v1756802334/4_vg6qwh.jpg',
      'https://res.cloudinary.com/ddg92xar5/image/upload/v1756802334/2_vrbyj2.jpg',
    ],
    pricing: {
      minimumRate: 350,
      baseGroupSize: 5,
      additionalPersonRate: 25,
      currency: 'USD',
    },
    timeSlots: [
      { id: 'morning', time: '8:30 AM - 11:30 AM' },
      { id: 'midday', time: '11:30 AM - 2:30 PM' },
      { id: 'afternoon', time: '2:30 PM - 5:30 PM' },
    ],
    duration: '3 hours',
    capacity: 50,
    premium: false,
    price: 89, // Display price for cards
    features: [
      'DJ & Sound System',
      'Dance Floor',
      'Party Games',
      'Premium Open Bar',
      'Party Snacks',
      'Water Sports',
    ],
    highlights: ['DJ music', 'Dance party', 'Water activities'],
    includes: [
      'Catamarán y gasolina',
      'Transporte privado de ida y vuelta desde su hotel o villa',
      'Open Bar Cócteles variados: vodka cranberry, gin tonic, Ron punch, Cuba libre, mojito y piña colada (elegir 4 tipos)',
      'Hielo, agua, refrescos',
      'Frutas tropicales',
      'Nachos con salsa',
      'Equipos de esnorquel',
    ],
    destinations: [
      'Piscinas Naturales (bancos de arena)',
      'Zona de esnorquel',
      'Visita el delfinario para ver a los delfines desde el exterior',
    ],
    notes: 'El cliente puede llevar su propia bebida y comida si lo desea.',
  },
  liberty: {
    id: 'liberty',
    name: 'Liberty',
    category: 'classic',
    description: 'Perfect introduction to Caribbean sailing',
    image:
      'https://res.cloudinary.com/ddg92xar5/image/upload/v1756802312/2_je7e48.jpg',
    gallery: [
      'https://res.cloudinary.com/ddg92xar5/image/upload/v1756802312/1_sqzbhj.jpg',
      'https://res.cloudinary.com/ddg92xar5/image/upload/v1756802312/4_v3oped.jpg',
      'https://res.cloudinary.com/ddg92xar5/image/upload/v1756802312/2_je7e48.jpg',
    ],
    pricing: {
      minimumRate: 400,
      baseGroupSize: 5,
      additionalPersonRate: 25,
      currency: 'USD',
    },
    timeSlots: [
      { id: 'morning', time: '8:30 AM - 11:30 AM' },
      { id: 'midday', time: '11:30 AM - 2:30 PM' },
      { id: 'afternoon', time: '2:30 PM - 5:30 PM' },
    ],
    duration: '3 hours',
    capacity: 40,
    premium: false,
    price: 89, // Display price for cards
    features: [
      'Open Bar',
      'Buffet Lunch',
      'Snorkeling Equipment',
      'Professional Crew',
      'Music System',
    ],
    highlights: ['Beach stops', 'Snorkeling', 'Local cuisine'],
    includes: [
      'Catamarán y gasolina',
      'Transporte privado de ida y vuelta desde su hotel o villa',
      'Open Bar Cócteles variados: vodka cranberry, gin tonic, Ron punch, Cuba libre, mojito y piña colada (elegir 4 tipos)',
      'Hielo, agua, refrescos',
      'Frutas tropicales',
      'Nachos con salsa',
      'Equipos de esnorquel',
    ],
    destinations: [
      'Piscinas Naturales (bancos de arena)',
      'Zona de esnorkel',
      'Visita el delfinario para ver a los delfines desde el exterior',
    ],
    notes: 'El cliente puede llevar su propia bebida y comida si lo desea.',
  },
  '45': {
    id: '45',
    name: '45',
    category: 'sunset',
    description: 'Romantic evening cruise for couples',
    image:
      'https://res.cloudinary.com/ddg92xar5/image/upload/v1756802373/6_r2h1ei.jpg',
    gallery: [
      'https://res.cloudinary.com/ddg92xar5/image/upload/v1756802373/5_srdzk8.jpg',
      'https://res.cloudinary.com/ddg92xar5/image/upload/v1756802372/4_onfvkv.jpg',
      'https://res.cloudinary.com/ddg92xar5/image/upload/v1756802371/3_wwn9g3.jpg',
      'https://res.cloudinary.com/ddg92xar5/image/upload/v1756802371/2_d9a9ye.jpg',
      'https://res.cloudinary.com/ddg92xar5/image/upload/v1756802371/2_d9a9ye.jpg',
    ],
    pricing: {
      minimumRate: 400,
      baseGroupSize: 5,
      additionalPersonRate: 25,
      currency: 'USD',
    },
    timeSlots: [
      { id: 'morning', time: '8:30 AM - 11:30 AM' },
      { id: 'midday', time: '11:30 AM - 2:30 PM' },
      { id: 'afternoon', time: '2:30 PM - 5:30 PM' },
    ],
    duration: '3 hours',
    capacity: 20,
    premium: true,
    price: 159, // Display price for cards
    features: [
      'Champagne Service',
      'Romantic Dinner',
      'Live Music',
      'Sunset Views',
      'Couples Massage',
      'Photography',
    ],
    highlights: ['Romantic ambiance', 'Sunset views', 'Couples experience'],
    includes: [
      'Catamarán y gasolina',
      'Transporte privado de ida y vuelta desde su hotel o villa',
      'Open Bar Cócteles variados: vodka cranberry, gin tonic, Ron punch, Cuba libre, mojito y piña colada (elegir 4 tipos)',
      'Hielo, agua, refrescos',
      'Frutas tropicales',
      'Nachos con salsa',
      'Equipos de esnorkel',
    ],
    destinations: [
      'Piscinas Naturales (bancos de arena)',
      'Zona de esnorkel',
      'Visita el delfinario para ver a los delfines desde el exterior',
    ],
    notes: 'El cliente puede llevar su propia bebida y comida si lo desea.',
  },
  trinity: {
    id: 'trinity',
    name: 'Trinity',
    category: 'premium',
    description: 'Luxury sailing with premium amenities',
    image:
      'https://res.cloudinary.com/ddg92xar5/image/upload/v1756802359/7_vmobhk.jpg',
    gallery: [
      'https://res.cloudinary.com/ddg92xar5/image/upload/v1756802356/3_syxzqo.jpg',
      'https://res.cloudinary.com/ddg92xar5/image/upload/v1756802356/1_wshnpg.jpg',
      'https://res.cloudinary.com/ddg92xar5/image/upload/v1756802357/2_axcixv.jpg',
      'https://res.cloudinary.com/ddg92xar5/image/upload/v1756802358/5_jmqruo.jpg',
    ],
    pricing: {
      minimumRate: 600,
      baseGroupSize: 15,
      additionalPersonRate: 35,
      currency: 'USD',
    },
    timeSlots: [
      { id: 'morning', time: '8:30 AM - 11:30 AM' },
      { id: 'midday', time: '11:30 AM - 2:30 PM' },
      { id: 'afternoon', time: '2:30 PM - 5:30 PM' },
    ],
    duration: '3 hours',
    capacity: 30,
    premium: true,
    price: 129, // Display price for cards
    features: [
      'Premium Bar',
      'Gourmet Buffet',
      'Water Slide',
      'VIP Service',
      'Photo Package',
      'Floating Mats',
    ],
    highlights: ['Water slide', 'Premium drinks', 'VIP treatment'],
    includes: [
      'Catamarán y gasolina',
      'Transporte privado de ida y vuelta desde su hotel o villa',
      'Open Bar Cócteles variados: vodka cranberry, gin tonic, Ron punch, Cuba libre, mojito y piña colada (elegir 4 tipos)',
      'Hielo, agua, refrescos',
      'Frutas tropicales',
      'Nachos con salsa',
      'Equipos de esnorkel',
    ],
    destinations: [
      'Piscinas Naturales (bancos de arena)',
      'Zona de esnorkel',
      'Visita el delfinario para ver a los delfines desde el exterior',
    ],
    notes: 'El cliente puede llevar su propia bebida y comida si lo desea.',
  },
};

const CANCELLATION_POLICY = [
  'No Show - Non refundable',
  'Cancellation with less than 48 hours of notification - No refund',
  'Cancellation notified 48 hours before the pick-up time - 50% refund',
  'Cancellation notified 72 hours before the pick-up time - 100% refund',
];

const WEATHER_POLICY =
  'In case of bad weather and the excursion cannot be done, we will look for an alternative date to do the excursion, in case it cannot be done on another date, 100% of the money paid will be refunded.';

// ==================== UTILITY FUNCTIONS ====================
const calculatePrice = (catamaran, groupSize) => {
  const { minimumRate, baseGroupSize, additionalPersonRate } =
    catamaran.pricing;

  if (groupSize <= baseGroupSize) {
    return minimumRate;
  }

  const additionalPeople = groupSize - baseGroupSize;
  return minimumRate + additionalPeople * additionalPersonRate;
};

// ==================== COMPONENTS ====================

// Touch-friendly Image Gallery Component
const TouchGallery = ({ images, currentIndex, onIndexChange }) => {
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Minimum distance for swipe
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      // Swipe left - next image
      onIndexChange((currentIndex + 1) % images.length);
    }
    if (isRightSwipe) {
      // Swipe right - previous image
      onIndexChange(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
    }
  };

  const handleImageClick = () => {
    // Click to go to next image
    onIndexChange((currentIndex + 1) % images.length);
  };

  return (
    <div className='relative'>
      <div
        className='relative h-64 overflow-hidden rounded-lg cursor-pointer'
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onClick={handleImageClick}
      >
        <img
          src={images[currentIndex]}
          alt={`Gallery image ${currentIndex + 1}`}
          className='w-full h-full object-cover transition-opacity duration-300'
        />

        {/* Click/Swipe indicator */}
        <div className='absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs'>
          Tap or swipe for next image
        </div>

        {/* Image Counter */}
        <div className='absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm'>
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnail Strip */}
      <div className='flex gap-2 mt-3 overflow-x-auto'>
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => onIndexChange(index)}
            className={`flex-shrink-0 w-16 h-16 overflow-hidden rounded border-2 transition ${
              index === currentIndex ? 'border-blue-500' : 'border-transparent'
            }`}
          >
            <img
              src={image}
              alt={`Thumbnail ${index + 1}`}
              className='w-full h-full object-cover'
            />
          </button>
        ))}
      </div>
    </div>
  );
};

// Pricing Calculator Component
const PricingCalculator = ({ catamaran, groupSize, onGroupSizeChange }) => {
  const price = calculatePrice(catamaran, groupSize);
  const isMinimumRate = groupSize <= catamaran.pricing.baseGroupSize;

  return (
    <div className='bg-blue-50 rounded-lg p-4'>
      <h4 className='font-semibold text-gray-800 mb-3 flex items-center'>
        <DollarSign className='w-4 h-4 mr-2' />
        Pricing Calculator
      </h4>

      <div className='space-y-3'>
        <div className='flex items-center justify-between'>
          <label className='text-sm font-medium'>Group Size:</label>
          <div className='flex items-center gap-2'>
            <button
              onClick={() => onGroupSizeChange(Math.max(1, groupSize - 1))}
              className='w-8 h-8 bg-white border rounded flex items-center justify-center hover:bg-gray-50'
            >
              -
            </button>
            <span className='w-8 text-center font-medium'>{groupSize}</span>
            <button
              onClick={() => onGroupSizeChange(groupSize + 1)}
              className='w-8 h-8 bg-white border rounded flex items-center justify-center hover:bg-gray-50'
            >
              +
            </button>
          </div>
        </div>

        <div className='border-t pt-3'>
          <div className='flex justify-between text-sm text-gray-600 mb-1'>
            <span>
              Minimum rate (1-{catamaran.pricing.baseGroupSize} people):
            </span>
            <span>${catamaran.pricing.minimumRate}</span>
          </div>

          {!isMinimumRate && (
            <div className='flex justify-between text-sm text-gray-600 mb-1'>
              <span>
                Additional people ({groupSize - catamaran.pricing.baseGroupSize}
                ):
              </span>
              <span>
                +$
                {(groupSize - catamaran.pricing.baseGroupSize) *
                  catamaran.pricing.additionalPersonRate}
              </span>
            </div>
          )}

          <div className='flex justify-between font-bold text-lg text-blue-600 border-t pt-2'>
            <span>Total Price:</span>
            <span>${price} USD</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Catamaran Details Sidebar/Modal Component
const CatamaranDetailsModal = ({ catamaran, isOpen, onClose, onBook }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [groupSize, setGroupSize] = useState(2);

  if (!isOpen || !catamaran) return null;

  const handleBookNow = () => {
    onBook(catamaran, groupSize);
  };

  return (
    <div className='fixed inset-0 z-50 flex'>
      {/* Backdrop */}
      <div className='absolute inset-0 bg-black/50' onClick={onClose} />

      {/* Sidebar Content */}
      <div className='relative ml-auto h-full w-full max-w-2xl bg-white shadow-2xl overflow-y-auto'>
        {/* Header */}
        <div className='sticky top-0 bg-white border-b p-6 flex items-center justify-between z-10'>
          <div className='flex items-center'>
            <div>
              <h2 className='text-2xl font-bold text-gray-800'>
                {catamaran.name}
              </h2>
              <p className='text-gray-600'>{catamaran.description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className='p-2 hover:bg-gray-100 rounded-full transition'
          >
            <X className='w-6 h-6' />
          </button>
        </div>

        <div className='p-6 space-y-8'>
          {/* Image Gallery */}
          <section>
            <h3 className='text-lg font-semibold mb-4 flex items-center'>
              <Camera className='w-5 h-5 mr-2' />
              Gallery
            </h3>
            <TouchGallery
              images={catamaran.gallery}
              currentIndex={currentImageIndex}
              onIndexChange={setCurrentImageIndex}
            />
          </section>

          {/* Pricing Calculator */}
          <section>
            <PricingCalculator
              catamaran={catamaran}
              groupSize={groupSize}
              onGroupSizeChange={setGroupSize}
            />
          </section>

          {/* Time Slots */}
          <section>
            <h3 className='text-lg font-semibold mb-4 flex items-center'>
              <Clock className='w-5 h-5 mr-2' />
              Available Time Slots
            </h3>
            <div className='grid gap-3'>
              {catamaran.timeSlots.map((slot) => (
                <div
                  key={slot.id}
                  className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'
                >
                  <span className='font-medium'>{slot.time}</span>
                  <span className='text-sm text-gray-600'>
                    {catamaran.duration}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* What's Included */}
          <section>
            <h3 className='text-lg font-semibold mb-4 flex items-center'>
              <Check className='w-5 h-5 mr-2' />
              What's Included
            </h3>
            <div className='space-y-2'>
              {catamaran.includes.map((item, index) => (
                <div key={index} className='flex items-start'>
                  <Check className='w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0' />
                  <span className='text-sm text-gray-700'>{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Destinations */}
          <section>
            <h3 className='text-lg font-semibold mb-4 flex items-center'>
              <MapPin className='w-5 h-5 mr-2' />
              Destinations
            </h3>
            <div className='space-y-2'>
              {catamaran.destinations.map((destination, index) => (
                <div key={index} className='flex items-start'>
                  <MapPin className='w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0' />
                  <span className='text-sm text-gray-700'>{destination}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Additional Notes */}
          {catamaran.notes && (
            <section>
              <div className='bg-amber-50 border border-amber-200 rounded-lg p-4'>
                <p className='text-sm text-amber-800'>{catamaran.notes}</p>
              </div>
            </section>
          )}

          {/* Cancellation Policy */}
          <section>
            <h3 className='text-lg font-semibold mb-4 flex items-center'>
              <Shield className='w-5 h-5 mr-2' />
              Cancellation Policy
            </h3>
            <div className='space-y-2'>
              {CANCELLATION_POLICY.map((policy, index) => (
                <div key={index} className='flex items-start'>
                  <AlertCircle className='w-4 h-4 text-red-500 mr-2 mt-0.5 flex-shrink-0' />
                  <span className='text-sm text-gray-700'>{policy}</span>
                </div>
              ))}
            </div>

            <div className='mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg'>
              <p className='text-sm text-blue-800'>{WEATHER_POLICY}</p>
            </div>
          </section>
        </div>

        {/* Footer with Book Button */}
        <div className='sticky bottom-0 bg-white border-t p-6'>
          <button
            onClick={handleBookNow}
            className='w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 rounded-xl font-semibold text-lg flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl'
          >
            <Calendar className='w-5 h-5 mr-2' />
            Book {catamaran.name} - ${calculatePrice(catamaran, groupSize)} USD
          </button>
        </div>
      </div>
    </div>
  );
};

// Original Catamaran Selection Card Component (maintained as before)
const CatamaranCard = ({ catamaran, isSelected, onSelect, onViewDetails }) => {
  const getIcon = (catamaranId) => {
    switch (catamaranId) {
      case 'liberty':
        return Anchor;
      case 'trinity':
        return Star;
      case '45':
        return Sun;
      case 'destiny':
        return Music;
      default:
        return Anchor;
    }
  };

  const IconComponent = getIcon(catamaran.id);

  return (
    <motion.div
      className={`relative overflow-hidden rounded-3xl cursor-pointer transition-all duration-500 group ${
        isSelected
          ? 'ring-4 ring-cyan-500 shadow-2xl scale-105'
          : 'hover:scale-102 hover:shadow-xl'
      }`}
      onClick={onViewDetails}
      whileHover={{ y: -5 }}
      layout
    >
      <div className='relative h-80'>
        <img
          src={catamaran.image}
          alt={catamaran.name}
          className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent' />

        {catamaran.premium && (
          <div className='absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg'>
            Premium
          </div>
        )}

        <div className='absolute top-4 left-4 bg-white/20 backdrop-blur-md rounded-full p-3'>
          <IconComponent className='w-6 h-6 text-white' />
        </div>
      </div>

      <div className='absolute bottom-0 left-0 right-0 p-4 text-white'>
        <h3 className='text-2xl font-bold mb-2'>{catamaran.name}</h3>
        <div className='flex items-center justify-between mb-4'>
          <span className='text-3xl font-bold text-cyan-300'>
            ${catamaran.price}
            <span className='text-lg text-white/70'>/person</span>
          </span>
          <div className='flex items-center gap-4 text-white/80 text-sm'>
            <div className='flex items-center gap-1'>
              <Users className='w-4 h-4' />
              <span>{catamaran.capacity}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Catamaran Selection Section (maintained as before)
const CatamaranSelection = ({ onCatamaranViewDetails }) => {
  return (
    <section className='py-20 px-4 bg-gradient-to-br from-blue-50 to-cyan-50'>
      <div className='max-w-7xl mx-auto'>
        <div className='text-center mb-12'>
          <div className='inline-flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full mb-4'>
            <Sparkles className='w-4 h-4 text-blue-600' />
            <span className='text-blue-700 font-medium'>
              Choose Your Adventure
            </span>
          </div>
          <h2 className='text-3xl md:text-4xl font-bold text-gray-800 mb-4'>
            Select Your{' '}
            <span className='text-cyan-500'>Catamaran Experience</span>
          </h2>
          <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
            Each catamaran offers a unique Caribbean adventure. Choose the
            perfect experience for your group size and preferences.
          </p>
        </div>

        <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {Object.values(CATAMARAN_DATA).map((catamaran) => (
            <CatamaranCard
              key={catamaran.id}
              catamaran={catamaran}
              isSelected={false}
              onViewDetails={() => onCatamaranViewDetails(catamaran)}
            />
          ))}
        </div>

        <div className='mt-12 text-center'>
          <div className='inline-flex items-center gap-6 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg'>
            <div className='flex items-center gap-2 text-sm text-gray-700'>
              <Shield className='w-4 h-4 text-green-500' />
              <span>All safety equipment included</span>
            </div>
            <div className='flex items-center gap-2 text-sm text-gray-700'>
              <LifeBuoy className='w-4 h-4 text-blue-500' />
              <span>Professional crew</span>
            </div>
            <div className='flex items-center gap-2 text-sm text-gray-700'>
              <MapPin className='w-4 h-4 text-red-500' />
              <span>Multiple pickup locations</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Features Comparison Section (maintained as before)
const FeaturesComparison = () => {
  const features = [
    {
      name: 'Open Bar',
      liberty: true,
      trinity: true,
      '45': true,
      destiny: true,
    },
    {
      name: 'Food Service',
      liberty: 'Buffet',
      trinity: 'Gourmet',
      '45': 'Dinner',
      destiny: 'Snacks',
    },
    {
      name: 'Water Slide',
      liberty: false,
      trinity: true,
      '45': false,
      destiny: true,
    },
    {
      name: 'Live Music',
      liberty: false,
      trinity: false,
      '45': true,
      destiny: 'DJ',
    },
    {
      name: 'Dance Floor',
      liberty: false,
      trinity: false,
      '45': false,
      destiny: true,
    },
    {
      name: 'Photography',
      liberty: false,
      trinity: true,
      '45': true,
      destiny: false,
    },
    {
      name: 'Couples Massage',
      liberty: false,
      trinity: false,
      '45': true,
      destiny: false,
    },
  ];

  return (
    <section className='py-16 bg-white'>
      <div className='max-w-6xl mx-auto px-4'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl md:text-4xl font-bold text-gray-800 mb-4'>
            Compare <span className='text-cyan-500'>Experiences</span>
          </h2>
          <p className='text-lg text-gray-600'>
            Find the perfect catamaran experience for your preferences
          </p>
        </div>

        <div className='overflow-x-auto'>
          <table className='w-full bg-white rounded-2xl shadow-lg overflow-hidden'>
            <thead className='bg-gradient-to-r from-cyan-500 to-blue-500 text-white'>
              <tr>
                <th className='px-6 py-4 text-left font-semibold'>Features</th>
                <th className='px-6 py-4 text-center font-semibold'>Liberty</th>
                <th className='px-6 py-4 text-center font-semibold'>Destiny</th>
                <th className='px-6 py-4 text-center font-semibold'>45</th>
                <th className='px-6 py-4 text-center font-semibold'>Trinity</th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, index) => (
                <tr
                  key={feature.name}
                  className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                >
                  <td className='px-6 py-4 font-medium text-gray-800'>
                    {feature.name}
                  </td>
                  <td className='px-6 py-4 text-center'>
                    {typeof feature.liberty === 'boolean' ? (
                      feature.liberty ? (
                        <Check className='w-5 h-5 text-green-500 mx-auto' />
                      ) : (
                        <X className='w-5 h-5 text-red-500 mx-auto' />
                      )
                    ) : (
                      <span className='text-sm text-gray-700'>
                        {feature.liberty}
                      </span>
                    )}
                  </td>
                  <td className='px-6 py-4 text-center'>
                    {typeof feature.destiny === 'boolean' ? (
                      feature.destiny ? (
                        <Check className='w-5 h-5 text-green-500 mx-auto' />
                      ) : (
                        <X className='w-5 h-5 text-red-500 mx-auto' />
                      )
                    ) : (
                      <span className='text-sm text-gray-700'>
                        {feature.destiny}
                      </span>
                    )}
                  </td>
                  <td className='px-6 py-4 text-center'>
                    {typeof feature['45'] === 'boolean' ? (
                      feature['45'] ? (
                        <Check className='w-5 h-5 text-green-500 mx-auto' />
                      ) : (
                        <X className='w-5 h-5 text-red-500 mx-auto' />
                      )
                    ) : (
                      <span className='text-sm text-gray-700'>
                        {feature['45']}
                      </span>
                    )}
                  </td>
                  <td className='px-6 py-4 text-center'>
                    {typeof feature.trinity === 'boolean' ? (
                      feature.trinity ? (
                        <Check className='w-5 h-5 text-green-500 mx-auto' />
                      ) : (
                        <X className='w-5 h-5 text-red-500 mx-auto' />
                      )
                    ) : (
                      <span className='text-sm text-gray-700'>
                        {feature.trinity}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

// Gallery Section (maintained as before)
const GallerySection = () => {
  const images = [
    {
      src: 'https://res.cloudinary.com/ddg92xar5/image/upload/v1756802356/3_syxzqo.jpg',
      alt: 'Catamaran in crystal clear waters',
      title: 'Crystal Clear Waters',
    },
    {
      src: 'https://res.cloudinary.com/ddg92xar5/image/upload/v1756802334/1_wvnp2r.jpg',
      alt: 'Snorkeling from catamaran',
      title: 'Snorkeling Adventures',
    },
    {
      src: 'https://res.cloudinary.com/ddg92xar5/image/upload/v1756802334/2_vrbyj2.jpg',
      alt: 'Water slide fun',
      title: 'Water Slide Thrills',
    },
    {
      src: 'https://res.cloudinary.com/ddg92xar5/image/upload/v1756802312/3_cz2ios.jpg',
      alt: 'Sunset catamaran cruise',
      title: 'Stunning Sunsets',
    },
  ];

  return (
    <section className='py-16 bg-gradient-to-br from-blue-50 to-cyan-50'>
      <div className='max-w-6xl mx-auto px-4'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl md:text-4xl font-bold text-gray-800 mb-4'>
            Experience <span className='text-cyan-500'>Gallery</span>
          </h2>
          <p className='text-lg text-gray-600'>
            See what awaits you on the crystal-clear Caribbean waters
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {images.map((image, index) => (
            <motion.div
              key={index}
              className='group relative overflow-hidden rounded-2xl h-64 shadow-lg'
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ scale: 1.05 }}
            >
              <img
                src={image.src}
                alt={image.alt}
                className='w-full h-full object-cover transition-all duration-500 group-hover:scale-110'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />

              <div className='absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300'>
                <h3 className='text-lg font-bold'>{image.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Reviews Section (maintained as before)
const ReviewsSection = () => {
  const reviews = [
    {
      name: 'Maria González',
      rating: 5,
      text: 'The premium catamaran was incredible! The water slide and gourmet food made it unforgettable.',
      date: '2 days ago',
      experience: 'Premium Experience',
    },
    {
      name: 'James Wilson',
      rating: 5,
      text: 'Perfect sunset cruise for our anniversary. The romantic dinner and live music were magical.',
      date: '1 week ago',
      experience: 'Sunset Romance',
    },
    {
      name: 'Sophie Martin',
      rating: 5,
      text: 'The party catamaran was amazing! Great DJ, dancing, and the best open bar in Punta Cana.',
      date: '2 weeks ago',
      experience: 'Party Catamaran',
    },
  ];

  return (
    <section className='py-16 px-4 bg-white'>
      <div className='max-w-5xl mx-auto'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl md:text-4xl font-bold mb-4 text-gray-800'>
            Guest <span className='text-cyan-500'>Reviews</span>
          </h2>
          <div className='flex justify-center items-center gap-1'>
            {[...Array(5)].map((_, i) => (
              <Star key={i} className='w-5 h-5 fill-amber-400 text-amber-400' />
            ))}
            <span className='ml-2 text-gray-600'>
              4.9 from 2,500+ adventures
            </span>
          </div>
        </div>

        <div className='grid md:grid-cols-3 gap-6'>
          {reviews.map((review, idx) => (
            <div
              key={idx}
              className='bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow'
            >
              <div className='flex gap-1 mb-3'>
                {[...Array(review.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className='w-4 h-4 fill-amber-400 text-amber-400'
                  />
                ))}
              </div>
              <p className='text-gray-700 mb-4'>"{review.text}"</p>
              <div className='flex justify-between items-center text-sm'>
                <div>
                  <p className='font-medium text-gray-800'>{review.name}</p>
                  <p className='text-cyan-600 text-xs'>{review.experience}</p>
                </div>
                <span className='text-gray-500'>{review.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Main Component
const CatamaranServiceView = () => {
  const [selectedCatamaran, setSelectedCatamaran] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const { bookService } = useBooking(); // Uncomment when using real context

  // Create service object for your existing BookingModal
  const createServiceFromCatamaran = (catamaran) => ({
    id: `catamaran-${catamaran.id}`,
    name: `Catamaran ${catamaran.name}`,
    type: 'CATAMARAN_CRUISE',
    description: catamaran.description,
    duration: catamaran.duration,
    price: catamaran.price,
    included: catamaran.includes,
    packageType: catamaran.premium ? 'premium' : 'standard',
    catamaranType: catamaran.id,
    maxParticipants: catamaran.capacity,
    catamaranSpecifics: {
      minimumRate: catamaran.pricing.minimumRate,
      baseGroupSize: catamaran.pricing.baseGroupSize,
      additionalPersonRate: catamaran.pricing.additionalPersonRate,
      timeSlots: catamaran.timeSlots,
      destinations: catamaran.destinations,
      gallery: catamaran.gallery,
      notes: catamaran.notes,
      realPricing: catamaran.pricing,
    },
  });

  const service = selectedCatamaran
    ? createServiceFromCatamaran(selectedCatamaran)
    : null;

  const handleBookingConfirm = (service, dates, guests) => {
    // Your existing booking logic
    // bookService(service, dates, guests);
    setIsModalOpen(false);
    console.log('Booking confirmed:', { service, dates, guests });
  };

  const handleCatamaranViewDetails = (catamaran) => {
    setSelectedCatamaran(catamaran);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsModalOpen(false);
    setSelectedCatamaran(null);
  };

  const handleBookFromDetails = (catamaran, groupSize) => {
    setSelectedCatamaran(catamaran);
    setIsDetailsModalOpen(false);
    setIsModalOpen(true);
  };

  return (
    <div className='min-h-screen bg-white'>
      {/* Hero Section */}
      <div className='relative h-screen overflow-hidden'>
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className='absolute inset-0'
        >
          <img
            src='https://images.pexels.com/photos/4784342/pexels-photo-4784342.jpeg'
            alt='Caribbean Catamaran Experience'
            className='w-full h-full object-cover'
          />
        </motion.div>

        <div className='absolute inset-0 bg-gradient-to-br from-blue-900/60 via-cyan-900/40 to-teal-900/60' />

        <div className='absolute inset-0 flex items-center justify-center text-center text-white p-8'>
          <div className='max-w-5xl'>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className='inline-flex items-center bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 mb-8'
            >
              <Anchor className='w-5 h-5 mr-3 text-cyan-300' />
              <span className='font-semibold text-lg'>
                Caribbean Adventures
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className='text-6xl md:text-7xl font-bold mb-6 leading-tight'
            >
              Catamaran Experiences
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className='text-2xl md:text-3xl text-white/90 mb-4 font-light'
            >
              Choose Your Perfect Caribbean Adventure
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className='text-lg text-white/80 mb-10 max-w-3xl mx-auto leading-relaxed'
            >
              From classic sailing adventures to romantic sunset cruises and
              high-energy party experiences. Find the perfect catamaran
              experience for your group.
            </motion.p>

            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.1, duration: 0.8 }}
              onClick={() => {
                document
                  .querySelector('[data-section="catamaran-selection"]')
                  .scrollIntoView({
                    behavior: 'smooth',
                  });
              }}
              className='bg-gradient-to-r from-cyan-600 to-blue-500 hover:from-cyan-700 hover:to-blue-600 text-white px-10 py-5 rounded-2xl font-bold text-xl flex items-center gap-4 mx-auto transition-all duration-300 hover:scale-105 shadow-2xl'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore Catamarans
              <ArrowRight className='w-6 h-6' />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Catamaran Selection Section */}
      <div data-section='catamaran-selection'>
        <CatamaranSelection
          onCatamaranViewDetails={handleCatamaranViewDetails}
        />
      </div>

      <FeaturesComparison />
      <GallerySection />
      <ReviewsSection />

      {/* Call to Action */}
      <section className='relative overflow-hidden rounded-3xl mx-4 my-16 h-96 shadow-2xl max-w-7xl mx-auto'>
        <img
          src='https://images.pexels.com/photos/4784342/pexels-photo-4784342.jpeg'
          alt='Caribbean catamaran adventure'
          className='w-full h-full object-cover'
        />
        <div className='absolute inset-0 bg-gradient-to-r from-blue-900/80 to-cyan-900/60' />

        <div className='absolute inset-0 flex items-center justify-center text-center text-white p-4'>
          <div className='max-w-3xl'>
            <h2 className='text-3xl md:text-4xl font-bold mb-6'>
              Ready for Your Caribbean Adventure?
            </h2>
            <p className='text-xl text-white/90 mb-8'>
              Book your perfect catamaran experience today and create memories
              that will last a lifetime.
            </p>
            <button
              onClick={() => {
                document
                  .querySelector('[data-section="catamaran-selection"]')
                  .scrollIntoView({
                    behavior: 'smooth',
                  });
              }}
              className='bg-gradient-to-r from-cyan-600 to-blue-500 hover:from-cyan-700 hover:to-blue-600 text-white px-10 py-5 rounded-2xl font-bold text-xl flex items-center gap-4 mx-auto transition-all duration-300 hover:scale-105 shadow-2xl'
            >
              <Anchor className='w-6 h-6' />
              Book Now
            </button>
          </div>
        </div>
      </section>

      {/* Catamaran Details Modal/Sidebar */}
      <CatamaranDetailsModal
        catamaran={selectedCatamaran}
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetails}
        onBook={handleBookFromDetails}
      />

      {/* Your existing Booking Modal */}
      {isModalOpen && service && formCatamaran && (
        <div>
          {/* Placeholder for your BookingModal component */}
          <div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4'>
            <div className='bg-white rounded-xl p-6 max-w-md w-full'>
              <h3 className='text-xl font-bold mb-4'>Booking Modal</h3>
              <p className='mb-4'>
                This would be your BookingModal component with:
              </p>
              <ul className='text-sm text-gray-600 mb-4'>
                <li>• Service: {service.name}</li>
                <li>• Type: {service.type}</li>
                <li>• Price: ${service.price}</li>
                <li>• Catamaran: {formCatamaran.name}</li>
                <li>
                  • Pricing:{' '}
                  {formCatamaran.pricing
                    ? `${formCatamaran.pricing.minimumRate}`
                    : 'No pricing data'}
                </li>
              </ul>
              <div className='flex gap-2'>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className='flex-1 px-4 py-2 bg-gray-200 rounded'
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleBookingConfirm(service, {}, 2)}
                  className='flex-1 px-4 py-2 bg-blue-600 text-white rounded'
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Uncomment this when integrating with your real BookingModal */}
      {/*
      {isModalOpen && service && formCatamaran && (
        <BookingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleBookingConfirm}
          service={service}
          selectedCatamaran={formCatamaran} // Use transformed data
        />
      )}
      */}
    </div>
  );
};

export default CatamaranServiceView;
