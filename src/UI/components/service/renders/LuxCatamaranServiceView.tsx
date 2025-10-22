import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Clock,
  Utensils,
  ArrowRight,
  Check,
  AlertCircle,
  Waves,
  MapPin,
  Calendar,
  Anchor,
  Sun,
  Fish,
  X,
  Info,
  Sparkles,
  Send,
} from 'lucide-react';

// Types
interface CatamaranType {
  id: string;
  name: string;
  price: number;
  image: string;
  features: string[];
  capacity: number;
  hasWaterSlide: boolean;
  premium: boolean;
}

interface InquiryFormData {
  date: string;
  guests: number;
  timeSlot: string;
  name: string;
  email: string;
  phone: string;
  message: string;
}

// Time slots
const timeSlots = [
  {
    id: 'morning',
    time: '9:00 AM',
    endTime: '1:00 PM',
    label: 'Morning Adventure',
    popular: false,
  },
  {
    id: 'afternoon',
    time: '2:00 PM',
    endTime: '6:00 PM',
    label: 'Afternoon Cruise',
    popular: true,
  },
];

// ============================================
// INQUIRY MODAL COMPONENT
// ============================================
const InquiryModal: React.FC<{
  catamaran: CatamaranType;
  onClose: () => void;
}> = ({ catamaran, onClose }) => {
  const [formData, setFormData] = useState<InquiryFormData>({
    date: '',
    guests: 2,
    timeSlot: 'afternoon',
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    // Validation
    if (
      !formData.date ||
      !formData.name ||
      !formData.email ||
      !formData.phone
    ) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      alert(
        'Inquiry submitted successfully! Our team will contact you within 24 hours to confirm availability.'
      );
      setIsSubmitting(false);
      onClose();
    }, 2000);
  };

  return (
    <div className='fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className='bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl'
      >
        {/* Header */}
        <div className='relative h-32 overflow-hidden'>
          <img
            src={catamaran.image}
            alt={catamaran.name}
            className='w-full h-full object-cover'
          />
          <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent' />
          <button
            onClick={onClose}
            className='absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors'
          >
            <X className='w-4 h-4' />
          </button>
          <div className='absolute bottom-4 left-4 text-white'>
            <h2 className='text-lg font-semibold'>{catamaran.name}</h2>
            <p className='text-white/80 text-sm'>Check Availability</p>
          </div>
        </div>

        {/* Form */}
        <div className='p-6 space-y-4'>
          {/* Date & Guests */}
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Preferred Date <span className='text-red-500'>*</span>
              </label>
              <input
                type='date'
                required
                min={new Date().toISOString().split('T')[0]}
                onClick={(e) => e.currentTarget.showPicker()}
                value={formData.date}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, date: e.target.value }))
                }
                className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Number of Guests <span className='text-red-500'>*</span>
              </label>
              <select
                value={formData.guests}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    guests: parseInt(e.target.value),
                  }))
                }
                className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
              >
                {Array.from(
                  { length: catamaran.capacity },
                  (_, i) => i + 1
                ).map((num) => (
                  <option key={num} value={num}>
                    {num} {num > 1 ? 'Guests' : 'Guest'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Time Slot Selection */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Preferred Time <span className='text-red-500'>*</span>
            </label>
            <div className='grid grid-cols-2 gap-4'>
              {timeSlots.map((slot) => (
                <button
                  key={slot.id}
                  type='button'
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, timeSlot: slot.id }))
                  }
                  className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center ${
                    formData.timeSlot === slot.id
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <Clock className='w-5 h-5 mb-2' />
                  <span className='font-semibold'>{slot.label}</span>
                  <span className='text-sm text-gray-600'>
                    {slot.time} - {slot.endTime}
                  </span>
                  {slot.popular && (
                    <span className='text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full mt-1'>
                      Most Popular
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Full Name <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              required
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
              placeholder='John Doe'
            />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Email <span className='text-red-500'>*</span>
              </label>
              <input
                type='email'
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
                placeholder='john@example.com'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Phone <span className='text-red-500'>*</span>
              </label>
              <input
                type='tel'
                required
                value={formData.phone}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, phone: e.target.value }))
                }
                className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
                placeholder='+1 (555) 000-0000'
              />
            </div>
          </div>

          {/* Message */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Additional Information (Optional)
            </label>
            <textarea
              value={formData.message}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, message: e.target.value }))
              }
              rows={3}
              className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none'
              placeholder='Any special requests or questions?'
            />
          </div>

          {/* Info Notice */}
          <div className='bg-blue-50 rounded-lg p-4 border border-blue-200'>
            <div className='flex items-start gap-2 mb-2'>
              <Info className='w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5' />
              <p className='text-sm text-blue-800 font-medium'>
                Availability Request
              </p>
            </div>
            <p className='text-sm text-blue-700 leading-relaxed'>
              This is not a confirmed booking. Our team will review your request
              and contact you within 24 hours to confirm availability and
              finalize details.
            </p>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`w-full py-4 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
              isSubmitting
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600 shadow-md hover:shadow-lg'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white' />
                Submitting...
              </>
            ) : (
              <>
                <Send className='w-5 h-5' />
                Submit Inquiry
              </>
            )}
          </button>

          <p className='text-xs text-gray-500 text-center'>
            By submitting, you agree to be contacted by our team regarding this
            inquiry.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

// ============================================
// HERO SECTION
// ============================================
const HeroSection: React.FC<{
  onInquiryClick: () => void;
}> = ({ onInquiryClick }) => {
  return (
    <div className='relative h-screen overflow-hidden'>
      <div className='absolute inset-0'>
        <img
          src='https://images.pexels.com/photos/4784342/pexels-photo-4784342.jpeg'
          alt='Luxury Catamaran'
          className='w-full h-full object-cover'
        />
      </div>

      <div className='absolute inset-0 bg-gradient-to-br from-slate-900/60 via-blue-900/40 to-cyan-900/60' />

      <div className='absolute inset-0 flex items-center justify-center text-center text-white p-8'>
        <div className='max-w-5xl'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className='inline-flex items-center bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 mb-8'
          >
            <Waves className='w-5 h-5 mr-3 text-cyan-300' />
            <span className='font-semibold text-lg'>Premium Experience</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className='text-6xl md:text-7xl font-bold mb-6 leading-tight'
          >
            Caribbean Catamaran Adventure
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className='text-2xl md:text-3xl text-white/90 mb-4 font-light'
          >
            Sail, Snorkel & Celebrate
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className='text-lg text-white/80 mb-10 max-w-3xl mx-auto leading-relaxed'
          >
            Experience the ultimate Caribbean adventure with our luxury
            catamarans. Choose from classic sailing or premium experiences with
            water slides.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            onClick={onInquiryClick}
            className='bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-10 py-5 rounded-2xl font-bold text-xl flex items-center gap-4 mx-auto transition-all duration-300 hover:scale-105 shadow-2xl'
          >
            Check Availability
            <ArrowRight className='w-6 h-6' />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// CATAMARAN CARD
// ============================================
const CatamaranCard: React.FC<{
  catamaran: CatamaranType;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ catamaran, isSelected, onSelect }) => {
  return (
    <motion.div
      className={`relative overflow-hidden rounded-3xl cursor-pointer transition-all duration-500 ${
        isSelected
          ? 'ring-4 ring-blue-500 shadow-2xl scale-105'
          : 'hover:scale-102 hover:shadow-xl'
      }`}
      onClick={onSelect}
      whileHover={{ y: -5 }}
      layout
    >
      <div className='relative h-80'>
        <img
          src={catamaran.image}
          alt={catamaran.name}
          className='w-full h-full object-cover'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent' />

        {catamaran.premium && (
          <div className='absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg'>
            Premium
          </div>
        )}

        {catamaran.hasWaterSlide && (
          <div className='absolute top-4 left-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2'>
            <Waves className='w-4 h-4' />
            Water Slide
          </div>
        )}
      </div>

      <div className='absolute bottom-0 left-0 right-0 p-6 text-white'>
        <h3 className='text-2xl font-bold mb-2'>{catamaran.name}</h3>
        <div className='flex items-center justify-between mb-4'>
          <span className='text-3xl font-bold text-cyan-300'>
            ${catamaran.price}
            <span className='text-lg text-white/70'>/person</span>
          </span>
          <div className='flex items-center gap-2 text-white/80'>
            <Users className='w-4 h-4' />
            <span>{catamaran.capacity} guests</span>
          </div>
        </div>

        <div className='space-y-2'>
          {catamaran.features.slice(0, 3).map((feature, index) => (
            <div
              key={index}
              className='flex items-center gap-2 text-sm text-white/80'
            >
              <Check className='w-4 h-4 text-green-400' />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
const LuxCatamaranServiceView: React.FC = () => {
  const [selectedCatamaran, setSelectedCatamaran] = useState<string>('classic');
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);

  const catamaranTypes: CatamaranType[] = [
    {
      id: 'classic',
      name: 'Classic Catamaran',
      price: 89,
      image:
        'https://res.cloudinary.com/michaelxk-com/image/upload/v1625794349/nuestra%20flota/lagoon%2042/1_uspfu7.jpg',
      features: [
        'Open Bar & Premium Drinks',
        'Gourmet Caribbean Buffet',
        'Professional Snorkeling Equipment',
        'Expert Crew & Captain',
        'Swim Stops at Best Spots',
      ],
      capacity: 40,
      hasWaterSlide: false,
      premium: false,
    },
    {
      id: 'premium-slide',
      name: 'Premium Water Slide Catamaran',
      price: 129,
      image:
        'https://www.whitesandwatersports.com/assets/images/2020-09-02-11-41-55-IMG0606.JPG',
      features: [
        'All Classic Features Included',
        '2-Story Water Slide',
        'Premium Bar Selection',
        'VIP Service & Amenities',
        'Professional Photo Package',
        'Private Beach Area',
      ],
      capacity: 30,
      hasWaterSlide: true,
      premium: true,
    },
  ];

  const selectedCatamaranData = catamaranTypes.find(
    (c) => c.id === selectedCatamaran
  );

  const handleOpenInquiry = () => {
    setIsInquiryModalOpen(true);
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50'>
      <HeroSection onInquiryClick={handleOpenInquiry} />

      <div className='max-w-7xl mx-auto px-4 py-16 space-y-16'>
        {/* Catamaran Selection */}
        <section className='bg-white rounded-3xl p-8 shadow-xl'>
          <div className='text-center mb-12'>
            <h2 className='text-4xl font-bold text-slate-800 mb-4'>
              Choose Your Adventure
            </h2>
            <p className='text-xl text-slate-600'>
              Select the perfect catamaran experience for your group
            </p>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
            {catamaranTypes.map((catamaran) => (
              <CatamaranCard
                key={catamaran.id}
                catamaran={catamaran}
                isSelected={selectedCatamaran === catamaran.id}
                onSelect={() => setSelectedCatamaran(catamaran.id)}
              />
            ))}
          </div>

          {/* Selected Catamaran CTA */}
          {selectedCatamaranData && (
            <div className='text-center'>
              <button
                onClick={handleOpenInquiry}
                className='bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-8 py-4 rounded-2xl font-bold text-lg flex items-center gap-3 mx-auto transition-all duration-300 hover:scale-105 shadow-lg'
              >
                <Calendar className='w-5 h-5' />
                Request Availability for {selectedCatamaranData.name}
              </button>
            </div>
          )}
        </section>

        {/* Final CTA */}
        <section className='relative overflow-hidden rounded-3xl h-96 shadow-2xl'>
          <img
            src='https://images.pexels.com/photos/5006967/pexels-photo-5006967.jpeg'
            alt='Sunset catamaran'
            className='w-full h-full object-cover'
          />
          <div className='absolute inset-0 bg-gradient-to-r from-slate-900/80 to-blue-900/60' />

          <div className='absolute inset-0 flex items-center justify-center text-center text-white p-8'>
            <div className='max-w-3xl'>
              <h2 className='text-4xl font-bold mb-6'>
                Ready for an Unforgettable Experience?
              </h2>
              <p className='text-xl text-white/90 mb-8'>
                Contact us today to check availability and reserve your spot
              </p>
              <button
                onClick={handleOpenInquiry}
                className='bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-10 py-5 rounded-2xl font-bold text-xl flex items-center gap-4 mx-auto transition-all duration-300 hover:scale-105 shadow-2xl'
              >
                <Anchor className='w-6 h-6' />
                Request Your Adventure
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Inquiry Modal */}
      <AnimatePresence>
        {isInquiryModalOpen && selectedCatamaranData && (
          <InquiryModal
            catamaran={selectedCatamaranData}
            onClose={() => setIsInquiryModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default LuxCatamaranServiceView;
