import { BookingFormData, BookingFormProps } from '@/constants/yacht/yachts';
import { useTranslation } from '@/lib/i18n/client';
import {
  Calendar,
  Camera,
  Clock,
  Coffee,
  Heart,
  Info,
  Mail,
  Music,
  Phone,
  Sparkles,
  User,
  Users,
  X,
} from 'lucide-react';
import { useState } from 'react';

const UnifiedBookingForm: React.FC<BookingFormProps> = ({ yacht, onClose }) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<BookingFormData>({
    date: '',
    guests: 2,
    duration: 'full-day',
    name: '',
    email: '',
    phone: '',
    message: '',
    addons: [],
  });

  const handleAddonToggle = (addonId: string) => {
    setFormData((prev) => ({
      ...prev,
      addons: prev.addons.includes(addonId)
        ? prev.addons.filter((id) => id !== addonId)
        : [...prev.addons, addonId],
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    setTimeout(() => {
      alert('Booking request submitted successfully!');
      setIsSubmitting(false);
      onClose();
      setFormData({
        date: '',
        guests: 2,
        duration: 'full-day',
        name: '',
        email: '',
        phone: '',
        message: '',
        addons: [],
      });
    }, 2000);
  };

  const maxGuests = yacht?.specifications?.maxGuests || 20;

  return (
    <section className='relative py-6 sm:py-10 lg:py-20 bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500 overflow-hidden min-h-screen flex items-center'>
      <div className='relative z-10 max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 w-full'>
        <div className='bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden'>
          {/* Header */}
          <div className='bg-gradient-to-r from-teal-600 to-cyan-600 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6 flex justify-between items-center'>
            <div className='flex-1 min-w-0 pr-4'>
              <h3 className='text-lg sm:text-xl lg:text-2xl font-bold text-white truncate'>
                {yacht ? `Book ${yacht.name}` : 'Request Your Yacht Experience'}
              </h3>
              <p className='text-teal-100 text-xs sm:text-sm mt-1'>
                Fill out the form below
              </p>
            </div>
            <button
              onClick={onClose}
              className='text-white hover:bg-white/20 rounded-full p-2 transition-colors flex-shrink-0'
              aria-label='Close form'
            >
              <X className='w-5 h-5 sm:w-6 sm:h-6' />
            </button>
          </div>

          {/* Form Content - SIN SCROLL */}
          <div className='p-4 sm:p-6 lg:p-8'>
            <div className='space-y-4 sm:space-y-5'>
              {/* Row 1: Date & Guests - 2 columnas en móvil */}
              <div className='grid grid-cols-2 gap-3 sm:gap-4'>
                <div>
                  <label className='flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2'>
                    <Calendar className='w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-600' />
                    Date <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='date'
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={formData.date}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, date: e.target.value }))
                    }
                    className='w-full px-2.5 py-2 sm:px-3 sm:py-2.5 lg:px-4 lg:py-3 text-xs sm:text-sm border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all'
                  />
                </div>

                <div>
                  <label className='flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2'>
                    <Users className='w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-600' />
                    Guests <span className='text-red-500'>*</span>
                  </label>
                  <select
                    value={formData.guests}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        guests: parseInt(e.target.value),
                      }))
                    }
                    className='w-full px-2.5 py-2 sm:px-3 sm:py-2.5 lg:px-4 lg:py-3 text-xs sm:text-sm border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all'
                  >
                    {Array.from({ length: maxGuests }, (_, i) => i + 1).map(
                      (num) => (
                        <option key={num} value={num}>
                          {num} {num > 1 ? 'Guests' : 'Guest'}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>

              {/* Row 2: Name & Duration - 2 columnas en móvil */}
              <div className='grid grid-cols-2 gap-3 sm:gap-4'>
                <div>
                  <label className='flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2'>
                    <User className='w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-600' />
                    Name <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='text'
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className='w-full px-2.5 py-2 sm:px-3 sm:py-2.5 lg:px-4 lg:py-3 text-xs sm:text-sm border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all'
                    placeholder='John Doe'
                  />
                </div>

                <div>
                  <label className='flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2'>
                    <Clock className='w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-600' />
                    Duration <span className='text-red-500'>*</span>
                  </label>
                  <select
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        duration: e.target.value as 'half-day' | 'full-day',
                      }))
                    }
                    className='w-full px-2.5 py-2 sm:px-3 sm:py-2.5 lg:px-4 lg:py-3 text-xs sm:text-sm border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all'
                  >
                    <option value='half-day'>Half Day (4h)</option>
                    <option value='full-day'>Full Day (8h)</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Email & Phone - 2 columnas en móvil */}
              <div className='grid grid-cols-2 gap-3 sm:gap-4'>
                <div>
                  <label className='flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2'>
                    <Mail className='w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-600' />
                    Email <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='email'
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className='w-full px-2.5 py-2 sm:px-3 sm:py-2.5 lg:px-4 lg:py-3 text-xs sm:text-sm border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all'
                    placeholder='john@example.com'
                  />
                </div>

                <div>
                  <label className='flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2'>
                    <Phone className='w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-600' />
                    Phone <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='tel'
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    className='w-full px-2.5 py-2 sm:px-3 sm:py-2.5 lg:px-4 lg:py-3 text-xs sm:text-sm border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all'
                    placeholder='+1 234 567 8900'
                  />
                </div>
              </div>

              {/* Additional Services - Grid compacto */}
              <div>
                <h4 className='text-sm sm:text-base font-bold text-gray-900 mb-2.5 sm:mb-3 flex items-center gap-2'>
                  <Sparkles className='w-4 h-4 sm:w-5 sm:h-5 text-teal-600' />
                  Additional Services (Optional)
                </h4>
                <div className='grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5'>
                  {[
                    { id: 'catering', label: 'Catering', icon: Coffee },
                    { id: 'massage', label: 'Massage', icon: Sparkles },
                    { id: 'yoga', label: 'Yoga', icon: Heart },
                    { id: 'photography', label: 'Photography', icon: Camera },
                    { id: 'dj', label: 'DJ', icon: Music },
                    { id: 'celebration', label: 'Celebration', icon: Sparkles },
                  ].map((addon) => {
                    const IconComponent = addon.icon;
                    return (
                      <label
                        key={addon.id}
                        className='flex items-center gap-1.5 sm:gap-2 p-2 sm:p-2.5 lg:p-3 rounded-lg border-2 border-gray-200 hover:border-teal-300 cursor-pointer transition-all text-xs sm:text-sm group hover:bg-teal-50'
                      >
                        <input
                          type='checkbox'
                          checked={formData.addons.includes(addon.id)}
                          onChange={() => handleAddonToggle(addon.id)}
                          className='w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-600 rounded focus:ring-teal-500 flex-shrink-0'
                        />
                        <IconComponent className='w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 text-teal-600 flex-shrink-0' />
                        <span className='text-gray-700 font-medium truncate text-xs sm:text-sm'>
                          {addon.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Special Requests - Textarea compacto */}
              <div>
                <label className='block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2'>
                  Special Requests
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      message: e.target.value,
                    }))
                  }
                  rows={2}
                  className='w-full px-2.5 py-2 sm:px-3 sm:py-2.5 lg:px-4 lg:py-3 text-xs sm:text-sm border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all resize-none'
                  placeholder='Any special requests or questions?'
                />
              </div>

              {/* Info Box - Compacto */}
              <div className='bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-3 sm:p-4 border border-teal-200 shadow-sm'>
                <div className='flex gap-2 sm:gap-3'>
                  <Info className='w-4 h-4 sm:w-5 sm:h-5 text-teal-600 flex-shrink-0 mt-0.5' />
                  <div>
                    <p className='text-xs sm:text-sm font-semibold text-teal-900'>
                      Response Time: 24-48 hours
                    </p>
                    <p className='text-xs sm:text-sm text-teal-700 mt-1'>
                      We'll contact you to confirm availability and finalize
                      details.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`w-full py-3 sm:py-3.5 lg:py-4 rounded-xl font-bold text-sm sm:text-base lg:text-lg transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
                } text-white`}
              >
                {isSubmitting ? (
                  <>
                    <div className='animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white' />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className='w-4 h-4 sm:w-5 sm:h-5' />
                    <span>Submit Request</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UnifiedBookingForm;
