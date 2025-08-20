import React, { useState, useMemo } from 'react';
import {
  Bike,
  MapPin,
  Clock,
  Star,
  CheckCircle,
  AlertTriangle,
  Battery,
  Users,
  Calendar,
  Baby,
  CreditCard,
  X,
  Plus,
  Minus,
  User,
  Sparkles,
  ShoppingCart,
  Phone,
} from 'lucide-react';
import { LOCATION_OPTIONS } from '@/constants/location/location';

// Bike types data
const BIKE_TYPES = [
  {
    id: 'beach-cruiser',
    name: 'Beach Cruiser',
    icon: '🏖️',
    price: 25,
    description: 'Perfect for coastal rides',
    image:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=600',
    isPremium: false,
  },
  {
    id: 'city-bike',
    name: 'City Bike',
    icon: '🏙️',
    price: 22,
    description: 'Urban exploration made easy',
    image:
      'https://images.unsplash.com/photo-1502744688674-c619d1586c9e?auto=format&fit=crop&q=80&w=600',
    isPremium: false,
  },
  {
    id: 'mountain-bike',
    name: 'Mountain Bike',
    icon: '🏔️',
    price: 30,
    description: 'Adventure-ready performance',
    image:
      'https://images.unsplash.com/photo-1544191696-15693072b4a5?auto=format&fit=crop&q=80&w=600',
    isPremium: false,
  },
  {
    id: 'e-bike',
    name: 'E-Bike',
    icon: '⚡',
    price: 45,
    description: 'Electric-powered adventure',
    image:
      'https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&q=80&w=600',
    isPremium: true,
  },
  {
    id: 'kids-bike',
    name: 'Kids Bike',
    icon: '👶',
    price: 18,
    description: 'Safe rides for children',
    image:
      'https://images.unsplash.com/photo-1502744688674-c619d1586c9e?auto=format&fit=crop&q=80&w=600',
    isPremium: false,
  },
];

const BikeRentalServiceView = () => {
  // Cart state
  const [cart, setCart] = useState([]);

  // Modal state
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    startTime: '09:00',
    endTime: '17:00',
    location: '',
    adultCount: 2,
    childCount: 0,
    specialRequests: '',
  });

  const [errors, setErrors] = useState({});

  // Calculate rental days
  const rentalDays = useMemo(() => {
    if (!formData.startDate || !formData.endDate) return 1;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(1, diffDays + 1);
  }, [formData.startDate, formData.endDate]);

  const totalParticipants = formData.adultCount + formData.childCount;
  const totalBikesInCart = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Calculate total price
  const calculatePrice = useMemo(() => {
    return cart.reduce((sum, item) => {
      return sum + item.bikePrice * item.quantity * rentalDays;
    }, 0);
  }, [cart, rentalDays]);

  // Cart functions
  const addBikeToCart = (bikeId) => {
    const bike = BIKE_TYPES.find((b) => b.id === bikeId);
    if (!bike) return;

    setCart((prev) => {
      const existingItemIndex = prev.findIndex(
        (item) => item.bikeId === bikeId
      );

      if (existingItemIndex >= 0) {
        const newCart = [...prev];
        newCart[existingItemIndex].quantity += 1;
        return newCart;
      } else {
        const newItem = {
          bikeId,
          quantity: 1,
          bikeName: bike.name,
          bikePrice: bike.price,
          bikeIcon: bike.icon,
        };
        return [...prev, newItem];
      }
    });
  };

  const updateCartQuantity = (bikeId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(bikeId);
      return;
    }

    setCart((prev) =>
      prev.map((item) =>
        item.bikeId === bikeId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (bikeId) => {
    setCart((prev) => prev.filter((item) => item.bikeId !== bikeId));
  };

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const updateParticipantCount = (type, increment) => {
    setFormData((prev) => {
      const field = type === 'adult' ? 'adultCount' : 'childCount';
      const currentValue = prev[field];
      const newValue = increment
        ? currentValue + 1
        : Math.max(0, currentValue - 1);

      if (type === 'adult' && newValue < 1) return prev;

      return { ...prev, [field]: newValue };
    });
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Basic validation
    const newErrors = {};
    if (!formData.startDate) newErrors.startDate = 'Start date required';
    if (!formData.endDate) newErrors.endDate = 'End date required';
    if (!formData.location) newErrors.location = 'Location required';
    if (cart.length === 0) newErrors.cart = 'Please select at least one bike';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    // Get location name
    const selectedLocation = LOCATION_OPTIONS.find(
      (loc) => loc.id === formData.location
    );

    // Create booking data
    const bookingData = {
      ...formData,
      locationName: selectedLocation?.name || formData.location,
      cart,
      totalPrice: calculatePrice,
      rentalDays,
      totalParticipants,
      totalBikes: totalBikesInCart,
      finalPrice: calculatePrice * rentalDays,
    };

    setTimeout(() => {
      setIsSubmitting(false);
      setShowBookingModal(false);
      alert('🚴‍♂️ Booking submitted successfully!');
      console.log('Booking Data:', bookingData);
    }, 2000);
  };

  return (
    <div className='max-w-8xl mx-auto space-y-16'>
      {/* Hero Section */}
      <div
        className='relative overflow-hidden'
        style={{
          backgroundColor: '#111827',
          backgroundImage:
            'linear-gradient(135deg, #111827 0%, #1f2937 50%, #000000 100%)',
        }}
      >
        <div className='absolute inset-0 opacity-30'>
          <img
            src='https://images.pexels.com/photos/1457018/pexels-photo-1457018.jpeg'
            alt='Bike rental adventure'
            className='w-full h-full object-cover'
          />
        </div>

        <div className='absolute inset-0 bg-black/20 z-[1]' />

        <div className='relative z-10 px-8 py-16 text-white'>
          <div className='max-w-4xl mx-auto text-center space-y-6'>
            <div className='inline-flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20'>
              <Bike className='w-5 h-5 text-white mr-2' />
              <span className='text-white font-medium'>
                Your Ride. Your Freedom.
              </span>
            </div>

            <h1 className='text-5xl md:text-7xl font-bold leading-tight'>
              Bike Rental
              <br />
              <span className='text-gray-300 text-3xl md:text-5xl'>
                Explore At Your Own Pace
              </span>
            </h1>

            <p className='text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed'>
              Discover Punta Cana like a local with our high-quality bikes,
              delivered straight to your accommodation.
            </p>
          </div>
        </div>
      </div>

      {/* Bike Selection */}
      <div className=' p-6'>
        <div className='text-center mb-12'>
          <h2 className='text-4xl font-bold text-gray-900 mb-4'>
            Choose Your Bikes
          </h2>
          <p className='text-xl text-gray-600 mb-6'>
            Select the bikes you need. The booking form will appear once you
            make your selection.
          </p>

          {/* Cart Summary Bar */}
          {cart.length > 0 && (
            <div className='inline-flex items-center bg-green-100 border border-green-300 rounded-full px-6 py-3 mb-6'>
              <ShoppingCart className='w-5 h-5 text-green-700 mr-2' />
              <span className='text-green-800 font-medium'>
                {totalBikesInCart} bike{totalBikesInCart !== 1 ? 's' : ''}{' '}
                selected
              </span>
              <span className='ml-4 text-green-600 font-bold'>
                ${calculatePrice.toFixed(2)}/day
              </span>
            </div>
          )}
        </div>

        {/* Bikes Grid */}
        <div className='grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6'>
          {BIKE_TYPES.map((bike) => {
            const cartItem = cart.find((item) => item.bikeId === bike.id);
            const quantity = cartItem?.quantity || 0;
            const isSelected = quantity > 0;

            return (
              <div
                key={bike.id}
                className={`bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 overflow-hidden group ${
                  isSelected
                    ? 'border-green-500 ring-4 ring-green-100 transform -translate-y-2 scale-105'
                    : 'border-gray-200 hover:border-green-300 hover:shadow-xl hover:-translate-y-1'
                }`}
              >
                <div className='relative h-48'>
                  <img
                    src={bike.image}
                    alt={bike.name}
                    className='w-full h-full object-cover'
                  />

                  {bike.isPremium && (
                    <div className='absolute top-3 right-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center'>
                      <Sparkles className='w-3 h-3 mr-1' />
                      Premium
                    </div>
                  )}

                  {isSelected && (
                    <div className='absolute top-3 left-3 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold'>
                      {quantity}
                    </div>
                  )}

                  <div className='absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                </div>

                <div className='p-4'>
                  <div className='text-center mb-3'>
                    <div className='text-2xl mb-1'>{bike.icon}</div>
                    <h3 className='font-bold text-gray-900 text-lg'>
                      {bike.name}
                    </h3>
                    <p className='text-gray-600 text-sm'>{bike.description}</p>
                  </div>

                  <div className='text-center mb-4'>
                    <div className='text-2xl font-bold text-green-600'>
                      ${bike.price}
                    </div>
                    <div className='text-sm text-gray-500'>per day</div>
                  </div>

                  {isSelected ? (
                    <div className='flex items-center justify-center space-x-2'>
                      <button
                        onClick={() =>
                          updateCartQuantity(bike.id, quantity - 1)
                        }
                        className='w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition-colors'
                      >
                        <Minus className='w-4 h-4' />
                      </button>

                      <span className='font-bold text-lg min-w-[2rem] text-center'>
                        {quantity}
                      </span>

                      <button
                        onClick={() =>
                          updateCartQuantity(bike.id, quantity + 1)
                        }
                        className='w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center hover:bg-green-200 transition-colors'
                      >
                        <Plus className='w-4 h-4' />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addBikeToCart(bike.id)}
                      className='w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all'
                    >
                      Select Bike
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Continue Button */}
        {cart.length > 0 && (
          <div className='text-center mt-8'>
            <button
              onClick={() => setShowBookingModal(true)}
              className='inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-lg font-bold rounded-2xl shadow-lg hover:from-green-700 hover:to-emerald-700 transform hover:scale-105 transition-all'
            >
              <Calendar className='w-6 h-6 mr-2' />
              Continue to Booking
              <span className='ml-2 bg-white/20 px-2 py-1 rounded-full text-sm'>
                {totalBikesInCart} bike{totalBikesInCart !== 1 ? 's' : ''}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto'>
            {/* Modal Header */}
            <div className='bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-t-2xl'>
              <div className='flex items-center justify-between'>
                <div>
                  <h3 className='text-2xl font-bold'>Complete Your Booking</h3>
                  <p className='text-green-100 mt-1'>
                    {totalBikesInCart} bike{totalBikesInCart !== 1 ? 's' : ''}{' '}
                    selected for ${calculatePrice.toFixed(2)}/day
                  </p>
                </div>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className='w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors'
                >
                  <X className='w-6 h-6' />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className='p-6'>
              <div className='space-y-6'>
                {/* Selected Bikes Summary */}
                <div className='bg-gray-50 rounded-xl p-4'>
                  <h4 className='font-bold text-gray-800 mb-3 flex items-center'>
                    <ShoppingCart className='w-5 h-5 mr-2' />
                    Your Selection
                  </h4>
                  <div className='space-y-2'>
                    {cart.map((item) => (
                      <div
                        key={item.bikeId}
                        className='flex items-center justify-between bg-white p-3 rounded-lg'
                      >
                        <div className='flex items-center'>
                          <span className='text-xl mr-3'>{item.bikeIcon}</span>
                          <span className='font-medium'>{item.bikeName}</span>
                        </div>
                        <div className='flex items-center space-x-2'>
                          <button
                            onClick={() =>
                              updateCartQuantity(item.bikeId, item.quantity - 1)
                            }
                            className='w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200'
                          >
                            <Minus className='w-3 h-3' />
                          </button>
                          <span className='font-bold min-w-[1.5rem] text-center'>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateCartQuantity(item.bikeId, item.quantity + 1)
                            }
                            className='w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center hover:bg-green-200'
                          >
                            <Plus className='w-3 h-3' />
                          </button>
                          <span className='ml-2 font-bold text-green-600'>
                            ${(item.bikePrice * item.quantity).toFixed(2)}/day
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dates */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-bold text-gray-700 mb-2'>
                      Start Date *
                    </label>
                    <input
                      type='date'
                      name='startDate'
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className={`w-full p-3 border-2 ${
                        errors.startDate ? 'border-red-500' : 'border-gray-300'
                      } rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                      min={new Date().toISOString().split('T')[0]}
                    />
                    {errors.startDate && (
                      <p className='text-red-500 text-sm mt-1'>
                        {errors.startDate}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className='block text-sm font-bold text-gray-700 mb-2'>
                      End Date *
                    </label>
                    <input
                      type='date'
                      name='endDate'
                      value={formData.endDate}
                      onChange={handleInputChange}
                      className={`w-full p-3 border-2 ${
                        errors.endDate ? 'border-red-500' : 'border-gray-300'
                      } rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                      min={
                        formData.startDate ||
                        new Date().toISOString().split('T')[0]
                      }
                    />
                    {errors.endDate && (
                      <p className='text-red-500 text-sm mt-1'>
                        {errors.endDate}
                      </p>
                    )}
                  </div>
                </div>

                {/* Duration Display */}
                {formData.startDate && formData.endDate && (
                  <div className='p-3 bg-green-50 border-2 border-green-200 rounded-xl'>
                    <p className='text-green-800 font-bold flex items-center'>
                      <CheckCircle className='w-5 h-5 mr-2' />
                      Duration: {rentalDays} {rentalDays === 1 ? 'day' : 'days'}
                      <span className='ml-4 text-green-600'>
                        Total: ${(calculatePrice * rentalDays).toFixed(2)}
                      </span>
                    </p>
                  </div>
                )}

                {/* Location */}
                <div>
                  <label className='block text-sm font-bold text-gray-700 mb-2'>
                    Delivery Location (FREE throughout Punta Cana) *
                  </label>
                  <select
                    name='location'
                    value={formData.location}
                    onChange={handleInputChange}
                    className={`w-full p-3 border-2 ${
                      errors.location ? 'border-red-500' : 'border-gray-300'
                    } rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                  >
                    <option value=''>Select delivery area</option>
                    {LOCATION_OPTIONS.map((location) => (
                      <option key={location.id} value={location.id}>
                        {location.name}
                      </option>
                    ))}
                  </select>
                  {errors.location && (
                    <p className='text-red-500 text-sm mt-1'>
                      {errors.location}
                    </p>
                  )}
                </div>

                {/* Participants */}
                <div>
                  <h4 className='font-bold text-gray-800 mb-4'>
                    Number of Participants
                  </h4>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='bg-green-50 p-4 rounded-xl border-2 border-green-200'>
                      <div className='flex items-center justify-between mb-3'>
                        <div className='flex items-center'>
                          <User className='w-5 h-5 text-green-600 mr-2' />
                          <span className='font-medium'>Adults (18+)</span>
                        </div>
                      </div>
                      <div className='flex items-center justify-center space-x-4'>
                        <button
                          type='button'
                          onClick={() => updateParticipantCount('adult', false)}
                          disabled={formData.adultCount <= 1}
                          className='w-8 h-8 rounded-full bg-white border-2 border-green-300 text-green-600 disabled:opacity-50 flex items-center justify-center hover:bg-green-50'
                        >
                          <Minus className='w-4 h-4' />
                        </button>
                        <span className='text-2xl font-bold text-green-700'>
                          {formData.adultCount}
                        </span>
                        <button
                          type='button'
                          onClick={() => updateParticipantCount('adult', true)}
                          className='w-8 h-8 rounded-full bg-white border-2 border-green-300 text-green-600 flex items-center justify-center hover:bg-green-50'
                        >
                          <Plus className='w-4 h-4' />
                        </button>
                      </div>
                    </div>

                    <div className='bg-blue-50 p-4 rounded-xl border-2 border-blue-200'>
                      <div className='flex items-center justify-between mb-3'>
                        <div className='flex items-center'>
                          <Baby className='w-5 h-5 text-blue-600 mr-2' />
                          <span className='font-medium'>Children (4-17)</span>
                        </div>
                      </div>
                      <div className='flex items-center justify-center space-x-4'>
                        <button
                          type='button'
                          onClick={() => updateParticipantCount('child', false)}
                          disabled={formData.childCount <= 0}
                          className='w-8 h-8 rounded-full bg-white border-2 border-blue-300 text-blue-600 disabled:opacity-50 flex items-center justify-center hover:bg-blue-50'
                        >
                          <Minus className='w-4 h-4' />
                        </button>
                        <span className='text-2xl font-bold text-blue-700'>
                          {formData.childCount}
                        </span>
                        <button
                          type='button'
                          onClick={() => updateParticipantCount('child', true)}
                          className='w-8 h-8 rounded-full bg-white border-2 border-blue-300 text-blue-600 flex items-center justify-center hover:bg-blue-50'
                        >
                          <Plus className='w-4 h-4' />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className='mt-4 p-3 bg-gray-100 rounded-lg'>
                    <div className='flex justify-between items-center'>
                      <span className='font-medium'>Total Participants:</span>
                      <span className='font-bold text-purple-600'>
                        {totalParticipants}
                      </span>
                    </div>
                    <div className='flex justify-between items-center mt-1'>
                      <span className='font-medium'>Total Bikes:</span>
                      <span className='font-bold text-green-600'>
                        {totalBikesInCart}
                      </span>
                    </div>
                    {totalBikesInCart > totalParticipants && (
                      <p className='text-amber-600 text-sm mt-2 flex items-center'>
                        <AlertTriangle className='w-4 h-4 mr-1' />
                        You have more bikes than participants
                      </p>
                    )}
                  </div>
                </div>

                {/* Special Requests */}
                <div>
                  <label className='block text-sm font-bold text-gray-700 mb-2'>
                    Special Requests (Optional)
                  </label>
                  <textarea
                    name='specialRequests'
                    value={formData.specialRequests}
                    onChange={handleInputChange}
                    rows={3}
                    className='w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500'
                    placeholder='Any special requirements or notes...'
                  />
                </div>

                {/* Error Display */}
                {Object.keys(errors).length > 0 && (
                  <div className='p-3 bg-red-50 border border-red-200 rounded-lg'>
                    <p className='text-red-800 text-sm'>
                      Please fix the errors above
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className='bg-gray-900 text-white p-6 rounded-b-2xl flex flex-col md:flex-row items-center justify-between'>
              <div className='mb-4 md:mb-0'>
                <span className='text-gray-400 text-sm'>Total Price</span>
                <div className='flex items-center'>
                  <span className='text-3xl font-light'>
                    ${(calculatePrice * rentalDays).toFixed(2)}
                  </span>
                  {rentalDays > 1 && (
                    <span className='ml-2 text-sm bg-green-600 px-2 py-1 rounded'>
                      {rentalDays} days
                    </span>
                  )}
                </div>
                <div className='text-xs text-gray-400 mt-1'>
                  🚚 Free delivery • 🎁 Helmets & locks included • 📞 24/7
                  Support
                </div>
              </div>

              <div className='flex space-x-4'>
                <button
                  type='button'
                  onClick={() => setShowBookingModal(false)}
                  disabled={isSubmitting}
                  className='px-6 py-3 border border-gray-600 rounded-xl text-gray-300 hover:text-white hover:border-gray-500 transition-colors'
                >
                  Back to Selection
                </button>

                <button
                  type='button'
                  onClick={handleBookingSubmit}
                  disabled={isSubmitting || cart.length === 0}
                  className='px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all flex items-center disabled:opacity-50 font-bold'
                >
                  <CreditCard className='h-5 w-5 mr-2' />
                  {isSubmitting ? 'Booking...' : 'Book My Adventure!'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Features Section */}
      <div className='py-8  p-6'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl font-bold text-gray-900 mb-4'>
            Why Choose Our Bikes?
          </h2>
          <p className='text-xl text-gray-600'>
            Premium quality, reliable service, and the freedom to explore 🌟
          </p>
        </div>

        <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {[
            {
              icon: <Clock className='w-6 h-6' />,
              title: 'Flexible Hours',
              desc: 'Rent by hour, day, or week',
              color: 'bg-blue-50 text-blue-600',
            },
            {
              icon: <MapPin className='w-6 h-6' />,
              title: 'Free Delivery',
              desc: 'Delivered anywhere in Punta Cana',
              color: 'bg-green-50 text-green-600',
            },
            {
              icon: <Battery className='w-6 h-6' />,
              title: 'Premium Quality',
              desc: 'Well-maintained, latest models',
              color: 'bg-purple-50 text-purple-600',
            },
            {
              icon: <Phone className='w-6 h-6' />,
              title: '24/7 Support',
              desc: 'Round-the-clock assistance',
              color: 'bg-orange-50 text-orange-600',
            },
          ].map((feature, index) => (
            <div
              key={index}
              className='text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow'
            >
              <div
                className={`w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center mx-auto mb-4`}
              >
                {feature.icon}
              </div>
              <h3 className='text-lg font-bold text-gray-900 mb-2'>
                {feature.title}
              </h3>
              <p className='text-gray-600'>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* What's Included */}
      <div className='grid md:grid-cols-2 gap-12 py-8  p-6'>
        <div>
          <h2 className='text-3xl font-bold text-gray-900 mb-8 flex items-center'>
            <CheckCircle className='w-8 h-8 mr-3 text-green-600' />
            What's Included
          </h2>
          <div className='space-y-6'>
            {[
              { icon: AlertTriangle, text: 'Helmet (Free & Recommended!)' },
              { icon: CheckCircle, text: 'High-quality bike lock' },
              { icon: Phone, text: '24/7 Support & Assistance' },
              { icon: MapPin, text: 'Free delivery & pickup' },
              { icon: Battery, text: 'Basic insurance coverage' },
            ].map((item, index) => (
              <div key={index} className='flex items-center group'>
                <div className='w-14 h-14 bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mr-4 group-hover:shadow-md transition-shadow'>
                  <item.icon className='w-7 h-7 text-green-600' />
                </div>
                <span className='text-lg text-gray-700 font-medium'>
                  {item.text}
                </span>
              </div>
            ))}
          </div>

          <div className='mt-8 p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-200'>
            <h3 className='font-bold text-amber-800 mb-3 flex items-center text-lg'>
              <AlertTriangle className='w-6 h-6 mr-2' />
              🛡️ Safety Disclaimer
            </h3>
            <p className='text-amber-700 font-medium'>
              For your safety, we recommend wearing a helmet and following all
              local traffic regulations.
              <strong> Your Safety, Your Responsibility.</strong>
            </p>
          </div>
        </div>

        <div className='relative h-96 rounded-3xl overflow-hidden shadow-lg'>
          <img
            src='https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&q=80&w=600'
            alt='Bike rental experience'
            className='w-full h-full object-cover'
          />
          <div className='absolute inset-0 bg-gradient-to-t from-black/40 to-transparent' />
          <div className='absolute bottom-6 left-6 text-white'>
            <h3 className='text-2xl font-bold mb-2'>
              Your Adventure Awaits! 🌴
            </h3>
            <p className='text-lg opacity-90'>
              Premium bikes, delivered with care
            </p>
          </div>
        </div>
      </div>

      {/* Testimonial */}
      <div className='bg-gradient-to-br from-white to-blue-50 rounded-3xl p-8 text-center border border-gray-100'>
        <div className='flex justify-center mb-4'>
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className='w-6 h-6 text-yellow-400 fill-current mx-1'
            />
          ))}
        </div>
        <blockquote className='text-xl md:text-2xl font-medium text-gray-900 mb-4 italic'>
          "Fantastic service! The bike was delivered on time and in perfect
          condition. Made exploring Punta Cana so much more enjoyable. 🚴‍♂️✨"
        </blockquote>
        <cite className='text-gray-600 font-medium'>
          - Marcus T., Satisfied Customer
        </cite>
      </div>
    </div>
  );
};

export default BikeRentalServiceView;
