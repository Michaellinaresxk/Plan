import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Navigation,
  Shield,
  Battery,
  Clock,
  MapPin,
  Car,
  Phone,
  Mail,
  Calendar,
  X,
  ChevronLeft,
  ChevronRight,
  Crown,
  CheckCircle,
  AlertCircle,
  CreditCard,
  ArrowRight,
  Star,
  Camera,
  Users,
  Zap,
  Route,
} from 'lucide-react';

// Import the service data we just created
import {
  GOLF_CART_SERVICE_DETAILS,
  GOLF_CART_CONTACT_INFO,
  SERVICE_IDS,
} from '../data/golfCartServiceData';

// Types
interface GolfCart {
  id: string;
  name: string;
  category: 'standard' | 'premium' | 'luxury';
  price: number;
  priceUnit: 'day' | 'hour';
  description: string;
  shortDescription: string;
  mainImage: string;
  gallery: string[];
  specifications: {
    seats: number;
    maxSpeed: string;
    batteryLife: string;
    range: string;
    features: string[];
    type: 'electric' | 'gas';
  };
  features: Array<{
    icon: React.ReactNode;
    name: string;
    description: string;
  }>;
  highlights: string[];
  isPremium: boolean;
  isAvailable: boolean;
  rating: number;
  gradient: string;
}

interface BookingFormData {
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  duration: number;
  specialRequests: string;
  cartType: string;
  extras: string[];
}

interface ContactBookingSectionProps {
  onBookingClick: () => void;
  selectedCart: GolfCart | null;
  onCloseModal: () => void;
}

// Contact Section Component
const ContactSection: React.FC<{ onBookingClick: () => void }> = ({
  onBookingClick,
}) => {
  return (
    <section className='py-32 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden'>
      {/* Background Effects */}
      <div className='absolute inset-0'>
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{
            rotate: { duration: 100, repeat: Infinity, ease: 'linear' },
            scale: { duration: 8, repeat: Infinity },
          }}
          className='absolute top-20 right-20 w-96 h-96 border border-cyan-400/20 rounded-full'
        />
        <motion.div
          animate={{ rotate: -360, opacity: [0.1, 0.3, 0.1] }}
          transition={{
            rotate: { duration: 120, repeat: Infinity, ease: 'linear' },
            opacity: { duration: 6, repeat: Infinity },
          }}
          className='absolute bottom-20 left-20 w-80 h-80 border-2 border-blue-400/20 rounded-full'
        />
      </div>

      <div className='relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='grid lg:grid-cols-2 gap-16 items-center'>
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className='inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-8'
            >
              <Navigation className='w-5 h-5 text-cyan-400' />
              <span className='font-semibold'>START YOUR ADVENTURE</span>
            </motion.div>

            <h2 className='text-5xl lg:text-6xl font-thin mb-6'>
              Ready to{' '}
              <span className='font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent'>
                Explore?
              </span>
            </h2>

            <p className='text-xl text-blue-100 mb-8 leading-relaxed'>
              {GOLF_CART_SERVICE_DETAILS[SERVICE_IDS.GOLF_CART]?.tagline ||
                'Move Freely. Explore Comfortably.'}
              <br />
              Door-to-door delivery, 24/7 support, and the freedom to explore at
              your pace.
            </p>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12'>
              {[
                {
                  icon: <Shield className='w-6 h-6' />,
                  title: 'Fully Insured',
                  desc: 'Complete protection',
                },
                {
                  icon: <Battery className='w-6 h-6' />,
                  title: 'Fully Charged',
                  desc: 'Ready to explore',
                },
                {
                  icon: <Clock className='w-6 h-6' />,
                  title: '24/7 Support',
                  desc: 'Always available',
                },
                {
                  icon: <MapPin className='w-6 h-6' />,
                  title: 'Free Delivery',
                  desc: 'Door-to-door service',
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className='flex items-center space-x-3'
                >
                  <div className='w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl flex items-center justify-center text-cyan-400'>
                    {feature.icon}
                  </div>
                  <div>
                    <div className='font-bold'>{feature.title}</div>
                    <div className='text-blue-200 text-sm'>{feature.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className='flex flex-col sm:flex-row gap-4'>
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 20px 40px rgba(6, 182, 212, 0.3)',
                }}
                whileTap={{ scale: 0.95 }}
                onClick={onBookingClick}
                className='group bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center space-x-3 relative overflow-hidden'
              >
                <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000' />
                <Calendar className='w-6 h-6' />
                <span>Book Now</span>
              </motion.button>

              <motion.a
                href={`tel:${GOLF_CART_CONTACT_INFO.phone}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className='border-2 border-white/60 text-white px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center space-x-3 backdrop-blur-sm hover:bg-white/10 transition-all duration-300'
              >
                <Phone className='w-6 h-6' />
                <span>Call Support</span>
              </motion.a>
            </div>
          </motion.div>

          {/* Right Content - Contact Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className='relative'
          >
            <div className='bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8'>
              <div className='text-center mb-8'>
                <div className='w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-4'>
                  <Car className='w-10 h-10 text-white' />
                </div>
                <h3 className='text-2xl font-bold mb-2'>Premium Service</h3>
                <p className='text-blue-200'>Delivered to your door</p>
              </div>

              <div className='space-y-6'>
                {[
                  {
                    icon: <Phone className='w-5 h-5' />,
                    label: 'Phone',
                    value: GOLF_CART_CONTACT_INFO.phone,
                  },
                  {
                    icon: <Mail className='w-5 h-5' />,
                    label: 'Email',
                    value: GOLF_CART_CONTACT_INFO.email,
                  },
                  {
                    icon: <Clock className='w-5 h-5' />,
                    label: 'Hours',
                    value: GOLF_CART_CONTACT_INFO.hours,
                  },
                  {
                    icon: <MapPin className='w-5 h-5' />,
                    label: 'Coverage',
                    value: GOLF_CART_CONTACT_INFO.coverage,
                  },
                ].map((contact, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className='flex items-center space-x-4 p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300'
                  >
                    <div className='w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-cyan-400'>
                      {contact.icon}
                    </div>
                    <div>
                      <div className='text-sm text-blue-200'>
                        {contact.label}
                      </div>
                      <div className='font-semibold'>{contact.value}</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1 }}
                className='mt-8 p-4 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-400/30 rounded-2xl text-center'
              >
                <p className='text-sm text-cyan-200 mb-2'>Response time</p>
                <p className='font-bold text-cyan-400'>
                  {GOLF_CART_CONTACT_INFO.responseTime}
                </p>
              </motion.div>
            </div>

            {/* Floating decorative elements */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className='absolute -top-4 -right-4 w-8 h-8 border-2 border-cyan-400/50 rounded-full'
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className='absolute -bottom-4 -left-4 w-6 h-6 bg-purple-500/50 rounded-full'
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Golf Cart Modal Component
const GolfCartModal: React.FC<{
  cart: GolfCart;
  onClose: () => void;
  onBook: () => void;
}> = ({ cart, onClose, onBook }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const serviceDetails = GOLF_CART_SERVICE_DETAILS[SERVICE_IDS.GOLF_CART];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % cart.gallery.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + cart.gallery.length) % cart.gallery.length
    );
  };

  if (showBookingForm) {
    return (
      <GolfCartBookingForm
        cart={cart}
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
      className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50'
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 50 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className='bg-white rounded-3xl max-w-7xl w-full max-h-[95vh] overflow-y-auto shadow-2xl'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={`relative p-8 bg-gradient-to-r ${cart.gradient} text-white overflow-hidden`}
        >
          {/* Close Button */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className='absolute top-6 right-6 w-12 h-12 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 z-10'
          >
            <X className='w-6 h-6' />
          </motion.button>

          <div className='relative z-10'>
            <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6'>
              <div className='flex-1'>
                {cart.isPremium && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className='inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 mb-4'
                  >
                    <Crown className='w-4 h-4 text-amber-300' />
                    <span className='text-sm font-bold'>
                      PREMIUM COLLECTION
                    </span>
                  </motion.div>
                )}

                <h2 className='text-4xl lg:text-5xl font-bold mb-3'>
                  {cart.name}
                </h2>
                <p className='text-xl text-white/90 mb-4'>
                  {cart.shortDescription}
                </p>

                <div className='flex items-center space-x-6'>
                  <div className='flex items-center space-x-2'>
                    <Star className='w-5 h-5 text-amber-300 fill-current' />
                    <span className='font-bold'>{cart.rating}</span>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <Users className='w-5 h-5' />
                    <span className='font-bold'>
                      {cart.specifications.seats}
                    </span>
                    <span className='text-white/80'>Seats</span>
                  </div>
                </div>
              </div>

              <div className='text-center lg:text-right'>
                <div className='text-5xl lg:text-6xl font-bold mb-2'>
                  ${cart.price}
                </div>
                <div className='text-white/80 text-lg'>
                  per {cart.priceUnit}
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowBookingForm(true)}
                  className='mt-4 bg-white text-gray-900 px-8 py-3 rounded-2xl font-bold hover:bg-white/90 transition-all duration-300 flex items-center space-x-2 mx-auto lg:mx-0'
                >
                  <Calendar className='w-5 h-5' />
                  <span>Book Now</span>
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        <div className='p-8'>
          {/* Gallery */}
          <div className='mb-12'>
            <h3 className='text-3xl font-bold text-gray-900 mb-6 flex items-center'>
              <Camera className='w-8 h-8 mr-3 text-blue-600' />
              Gallery
            </h3>
            <div className='relative rounded-3xl overflow-hidden shadow-2xl'>
              <img
                src={cart.gallery[currentImageIndex]}
                alt={`${cart.name} - Image ${currentImageIndex + 1}`}
                className='w-full h-96 lg:h-[500px] object-cover'
              />

              {/* Navigation */}
              <button
                onClick={prevImage}
                className='absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 backdrop-blur-sm border border-white/20 rounded-full text-white transition-all duration-300 flex items-center justify-center hover:bg-black/70'
              >
                <ChevronLeft className='w-6 h-6' />
              </button>
              <button
                onClick={nextImage}
                className='absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 backdrop-blur-sm border border-white/20 rounded-full text-white transition-all duration-300 flex items-center justify-center hover:bg-black/70'
              >
                <ChevronRight className='w-6 h-6' />
              </button>
            </div>
          </div>

          {/* Service Details from Data */}
          <div className='grid lg:grid-cols-2 gap-12'>
            <div>
              <h3 className='text-3xl font-bold text-gray-900 mb-6'>
                What's Included
              </h3>
              <div className='space-y-3'>
                {serviceDetails?.includes.map((item, index) => (
                  <div key={index} className='flex items-center space-x-3'>
                    <CheckCircle className='w-5 h-5 text-emerald-500 flex-shrink-0' />
                    <span className='text-gray-700'>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className='text-3xl font-bold text-gray-900 mb-6'>
                Service Process
              </h3>
              <div className='space-y-4'>
                {serviceDetails?.itinerary.map((step, index) => (
                  <div key={index} className='flex items-start space-x-4'>
                    <div className='w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm'>
                      {index + 1}
                    </div>
                    <p className='text-gray-700 font-medium'>{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Important Information */}
          <div className='mt-12 p-6 bg-blue-50 rounded-2xl border border-blue-200'>
            <h4 className='font-bold text-blue-900 mb-3 flex items-center'>
              <AlertCircle className='w-5 h-5 mr-2' />
              Important Information
            </h4>
            <p className='text-blue-800 leading-relaxed'>
              {serviceDetails?.disclaimer}
            </p>
          </div>

          {/* Booking CTA */}
          <div className='mt-12 p-8 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-3xl border border-blue-200'>
            <div className='flex flex-col lg:flex-row items-center justify-between gap-6'>
              <div>
                <h4 className='text-2xl font-bold text-gray-900 mb-2'>
                  Ready for Your Adventure?
                </h4>
                <p className='text-gray-600 text-lg'>
                  Book your premium golf cart experience today
                </p>
              </div>
              <div className='flex flex-col sm:flex-row gap-4'>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowBookingForm(true)}
                  className={`px-8 py-4 rounded-2xl text-white font-bold text-lg bg-gradient-to-r ${cart.gradient} hover:shadow-xl transition-all duration-300 flex items-center space-x-3`}
                >
                  <Calendar className='w-6 h-6' />
                  <span>Book Now</span>
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Booking Form Component (simplified version)
const GolfCartBookingForm: React.FC<{
  cart: GolfCart;
  onClose: () => void;
  onBack: () => void;
}> = ({ cart, onClose, onBack }) => {
  const [formData, setFormData] = useState<BookingFormData>({
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    duration: 1,
    specialRequests: '',
    cartType: cart.id,
    extras: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setTimeout(() => {
      alert(
        'Booking request submitted successfully! Our team will contact you within 30 minutes.'
      );
      setIsSubmitting(false);
      onClose();
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50'
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className='bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`p-6 bg-gradient-to-r ${cart.gradient} text-white`}>
          <div className='flex items-center justify-between mb-4'>
            <button
              onClick={onBack}
              className='w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all'
            >
              <ChevronLeft className='w-5 h-5' />
            </button>
            <button
              onClick={onClose}
              className='w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all'
            >
              <X className='w-5 h-5' />
            </button>
          </div>
          <h2 className='text-2xl font-bold'>Book {cart.name}</h2>
          <p className='text-white/90'>Complete your reservation</p>
        </div>

        {/* Form */}
        <div className='p-6 space-y-6'>
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>
              Rental Date *
            </label>
            <input
              type='date'
              value={formData.date}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, date: e.target.value }))
              }
              min={new Date().toISOString().split('T')[0]}
              className='w-full p-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
            />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>
                Pickup Time
              </label>
              <input
                type='time'
                value={formData.startTime}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    startTime: e.target.value,
                  }))
                }
                className='w-full p-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
              />
            </div>
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>
                Duration (Days)
              </label>
              <select
                value={formData.duration}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    duration: Number(e.target.value),
                  }))
                }
                className='w-full p-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
              >
                {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                  <option key={day} value={day}>
                    {day} {day === 1 ? 'day' : 'days'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>
              Delivery Location *
            </label>
            <select
              value={formData.location}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, location: e.target.value }))
              }
              className='w-full p-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
            >
              <option value=''>Select location</option>
              <option value='punta-cana-resort'>Punta Cana Resort</option>
              <option value='cap-cana-resort'>Cap Cana Resort</option>
              <option value='bavaro-beach'>Bavaro Beach Hotels</option>
              <option value='private-villa'>Private Villa</option>
            </select>
          </div>

          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>
              Special Requests
            </label>
            <textarea
              value={formData.specialRequests}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  specialRequests: e.target.value,
                }))
              }
              rows={4}
              placeholder='Any special requirements or requests...'
              className='w-full p-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none'
            />
          </div>

          {/* Price Summary */}
          <div className='bg-blue-50 p-4 rounded-2xl border border-blue-200'>
            <div className='flex justify-between items-center'>
              <span className='font-semibold'>
                Total ({formData.duration}{' '}
                {formData.duration === 1 ? 'day' : 'days'})
              </span>
              <span className='text-2xl font-bold text-blue-600'>
                ${cart.price * formData.duration}
              </span>
            </div>
          </div>

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-3 ${
              isSubmitting
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : `bg-gradient-to-r ${cart.gradient} text-white hover:shadow-lg`
            }`}
          >
            {isSubmitting ? (
              <>
                <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white' />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <CreditCard className='w-5 h-5' />
                <span>Confirm Booking</span>
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Main Contact & Booking Section Component
const GolfCartContact: React.FC<ContactBookingSectionProps> = ({
  onBookingClick,
  selectedCart,
  onCloseModal,
}) => {
  return (
    <div>
      <ContactSection onBookingClick={onBookingClick} />

      {/* Modal System */}
      <AnimatePresence>
        {selectedCart && (
          <GolfCartModal
            cart={selectedCart}
            onClose={onCloseModal}
            onBook={() => {}}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default GolfCartContact;
