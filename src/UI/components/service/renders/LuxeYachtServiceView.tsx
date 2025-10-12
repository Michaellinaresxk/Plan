import React, { useState, useEffect, useRef } from 'react';
import {
  Anchor,
  Users,
  Star,
  Calendar,
  Camera,
  X,
  Wifi,
  Utensils,
  BedDouble,
  Zap,
  Diamond,
  Waves,
  Crown,
  Sparkles,
  ArrowRight,
  Coffee,
  Heart,
  Music,
  Info,
  CheckCircle,
} from 'lucide-react';

// ============ FIX 1: VIDEO AUTOPLAY ============
const CinematicHero = ({ onBookingClick }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log('Autoplay prevented:', error);
        });
      }
    }
  }, []);

  return (
    <div className='relative min-h-screen bg-black'>
      <div className='fixed inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950' />

      <div className='relative mt-20 z-10 min-h-screen'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12'>
          <div className='grid lg:grid-cols-2 gap-8 lg:gap-12 items-center'>
            <div className='order-2 lg:order-1 space-y-6 lg:space-y-8'>
              <div>
                <div className='flex items-center space-x-3 mb-4'>
                  <div className='h-px w-12 bg-gradient-to-r from-transparent to-cyan-400'></div>
                  <Anchor className='w-5 h-5 text-cyan-400' />
                </div>

                <h1 className='text-4xl sm:text-5xl lg:text-6xl font-light text-white mb-4 leading-tight'>
                  Where
                  <span className='block font-black text-5xl sm:text-6xl lg:text-7xl mt-2 mb-3 bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-400 bg-clip-text text-transparent'>
                    LUXURY
                  </span>
                  Meets the Sea
                </h1>

                <p className='text-base sm:text-lg lg:text-xl text-gray-300 leading-relaxed max-w-xl'>
                  Embark on an unforgettable journey aboard our premium yachts.
                </p>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                {[
                  { icon: Diamond, label: 'Premium Fleet', value: '50+' },
                  { icon: Waves, label: 'Destinations', value: '120+' },
                  { icon: Star, label: 'Rating', value: '5.0' },
                  { icon: Anchor, label: 'Experience', value: '15Y' },
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={index}
                      className='bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all cursor-pointer'
                    >
                      <Icon className='w-6 h-6 text-cyan-400 mb-2' />
                      <div className='text-2xl font-bold text-white mb-1'>
                        {item.value}
                      </div>
                      <div className='text-xs text-gray-400'>{item.label}</div>
                    </div>
                  );
                })}
              </div>

              <div className='flex flex-col sm:flex-row gap-4'>
                <button
                  onClick={onBookingClick}
                  className='bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-600 px-8 py-4 rounded-full font-bold text-white shadow-xl hover:scale-105 transition-transform flex items-center justify-center gap-2'
                >
                  <span>Book Your Voyage</span>
                  <Diamond className='w-5 h-5' />
                </button>
                <button className='px-8 py-4 rounded-full font-bold text-white border-2 border-white/20 backdrop-blur-sm hover:bg-white/10 transition-all'>
                  Explore Fleet
                </button>
              </div>
            </div>

            <div className='order-1 lg:order-2'>
              <div className='relative'>
                <div className='absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-purple-500/30 blur-3xl' />
                <div className='relative rounded-3xl overflow-hidden border border-white/20 shadow-2xl backdrop-blur-sm bg-gradient-to-br from-white/10 to-white/5'>
                  <div className='absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-amber-400 rounded-tl-3xl z-10' />
                  <div className='absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-cyan-400 rounded-br-3xl z-10' />

                  <div className='relative aspect-[9/16] sm:aspect-video lg:aspect-[4/5]'>
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className='absolute inset-0 w-full h-full object-cover'
                      poster='https://res.cloudinary.com/ddg92xar5/image/upload/v1754600018/2_dc7fry.jpg'
                    >
                      <source
                        src='https://res.cloudinary.com/ddg92xar5/video/upload/v1759669338/yate_m7z3ve.mp4'
                        type='video/mp4'
                      />
                    </video>

                    <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20' />

                    <div className='absolute top-6 left-6 bg-black/60 backdrop-blur-xl border border-amber-400/50 rounded-2xl px-4 py-2 z-20'>
                      <div className='flex items-center space-x-2'>
                        <div className='w-2 h-2 bg-amber-400 rounded-full animate-pulse' />
                        <span className='text-xs font-bold text-amber-300'>
                          LIVE PREVIEW
                        </span>
                      </div>
                    </div>

                    <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4 sm:p-6'>
                      <p className='text-xs text-gray-400 mb-1'>
                        Featured Collection
                      </p>
                      <p className='text-base sm:text-lg font-bold text-white'>
                        Mediterranean Classics 2025
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============ FIX 2: MODAL - IMAGEN GRANDE EN MÓVILES ============
const YachtDetailsModal = ({ yacht, onClose, onBook }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className='fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4'>
      <div className='bg-white rounded-2xl sm:rounded-3xl max-w-6xl w-full h-[98vh] sm:h-[95vh] overflow-hidden shadow-2xl flex flex-col'>
        <div className='flex flex-col lg:flex-row flex-1 min-h-0'>
          <div className='lg:w-3/5 flex flex-col min-h-0'>
            <div className='hidden lg:flex p-6 border-b border-gray-200 justify-between items-center'>
              <div>
                <h2 className='text-2xl font-semibold text-gray-900'>
                  {yacht.name}
                </h2>
                <div className='flex items-center gap-4 mt-1'>
                  <span className='text-gray-500'>
                    {yacht.specifications.length}
                  </span>
                  <span className='text-gray-300'>•</span>
                  <div className='flex items-center gap-1'>
                    <Star className='w-4 h-4 text-yellow-400 fill-yellow-400' />
                    <span className='text-gray-600'>
                      {yacht.rating} ({yacht.reviews})
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className='w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200'
              >
                <X className='w-5 h-5' />
              </button>
            </div>

            <div className='relative flex-1 bg-gray-100 min-h-[50vh] lg:min-h-0'>
              <img
                src={yacht.gallery[currentImageIndex]}
                alt={`${yacht.name}`}
                className='w-full h-full object-cover'
              />

              <button
                onClick={onClose}
                className='lg:hidden absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 z-20'
              >
                <X className='w-5 h-5' />
              </button>

              <div className='absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm z-10'>
                {currentImageIndex + 1} / {yacht.gallery.length}
              </div>

              {yacht.gallery.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setCurrentImageIndex(
                        (prev) =>
                          (prev - 1 + yacht.gallery.length) %
                          yacht.gallery.length
                      )
                    }
                    className='absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 z-10'
                  >
                    ‹
                  </button>
                  <button
                    onClick={() =>
                      setCurrentImageIndex(
                        (prev) => (prev + 1) % yacht.gallery.length
                      )
                    }
                    className='absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 z-10'
                  >
                    ›
                  </button>
                </>
              )}

              <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10'>
                {yacht.gallery.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-10 h-7 sm:w-12 sm:h-8 rounded-md overflow-hidden border-2 transition-all ${
                      index === currentImageIndex
                        ? 'border-white'
                        : 'border-white/50'
                    }`}
                  >
                    <img
                      src={image}
                      alt=''
                      className='w-full h-full object-cover'
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className='lg:w-2/5 flex flex-col min-h-0 max-h-[48vh] lg:max-h-full'>
            <div className='lg:hidden p-4 border-b border-gray-200 bg-white'>
              <h2 className='text-xl font-semibold text-gray-900'>
                {yacht.name}
              </h2>
              <div className='flex items-center gap-3 mt-1 text-sm'>
                <span className='text-gray-500'>
                  {yacht.specifications.length}
                </span>
                <span>•</span>
                <div className='flex items-center gap-1'>
                  <Star className='w-4 h-4 text-yellow-400 fill-yellow-400' />
                  <span>
                    {yacht.rating} ({yacht.reviews})
                  </span>
                </div>
              </div>
            </div>

            <div className='p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-br from-teal-50/50 to-blue-50/50'>
              <div className='text-center mb-3'>
                <div className='inline-flex items-center gap-2 bg-teal-100 text-teal-700 px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold mb-2'>
                  <Calendar className='w-3 h-3 sm:w-4 sm:h-4' />
                  Available on Request
                </div>
                <p className='text-gray-600 text-xs sm:text-sm'>
                  Contact us for availability
                </p>
              </div>

              {yacht.isPremium && (
                <div className='flex justify-center mb-3'>
                  <div className='bg-gradient-to-r from-orange-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1'>
                    <Crown className='w-3 h-3' />
                    Premium Yacht
                  </div>
                </div>
              )}

              <button
                onClick={onBook}
                className='w-full bg-teal-600 hover:bg-teal-700 text-white py-3 sm:py-4 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2'
              >
                <Calendar className='w-4 h-4 sm:w-5 sm:h-5' />
                Book This Yacht
              </button>
            </div>

            <div className='border-b border-gray-200 bg-gray-50'>
              <div className='flex'>
                {[
                  { id: 'overview', name: 'Overview' },
                  { id: 'specs', name: 'Specs' },
                  { id: 'amenities', name: 'Amenities' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-teal-600 text-teal-600 bg-white'
                        : 'border-transparent text-gray-500'
                    }`}
                  >
                    {tab.name}
                  </button>
                ))}
              </div>
            </div>

            <div className='flex-1 overflow-y-auto p-4 sm:p-6'>
              {activeTab === 'overview' && (
                <div className='space-y-4'>
                  <p className='text-gray-600 text-sm sm:text-base'>
                    {yacht.shortDescription}
                  </p>
                  <div className='flex items-center gap-2 text-sm text-gray-500'>
                    <Users className='w-4 h-4' />
                    <span>Up to {yacht.specifications.maxGuests} guests</span>
                  </div>
                </div>
              )}

              {activeTab === 'specs' && (
                <div className='grid grid-cols-2 gap-3 sm:gap-4'>
                  {[
                    {
                      label: 'Length',
                      value: yacht.specifications.length,
                      icon: Anchor,
                    },
                    {
                      label: 'Guests',
                      value: yacht.specifications.maxGuests,
                      icon: Users,
                    },
                    {
                      label: 'Cabins',
                      value: yacht.specifications.cabins,
                      icon: BedDouble,
                    },
                    {
                      label: 'Speed',
                      value: yacht.specifications.maxSpeed,
                      icon: Zap,
                    },
                  ].map((spec, index) => {
                    const Icon = spec.icon;
                    return (
                      <div
                        key={index}
                        className='text-center p-3 bg-teal-50 rounded-lg'
                      >
                        <Icon className='w-4 h-4 text-teal-600 mx-auto mb-2' />
                        <div className='font-bold text-gray-900 text-sm'>
                          {spec.value}
                        </div>
                        <div className='text-xs text-gray-500'>
                          {spec.label}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {activeTab === 'amenities' && (
                <div className='space-y-3'>
                  {yacht.amenities.map((amenity, index) => (
                    <div
                      key={index}
                      className='p-3 border border-gray-200 rounded-xl'
                    >
                      <div className='flex items-start gap-3'>
                        <div className='w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600'>
                          {amenity.icon}
                        </div>
                        <div>
                          <h4 className='font-semibold text-gray-900 text-sm'>
                            {amenity.name}
                          </h4>
                          <p className='text-gray-600 text-xs'>
                            {amenity.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============ FIX 3: FORMULARIO COMPACTO ============
const BookingFormBanner = ({ onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    guests: 2,
    duration: 'full-day',
    name: '',
    email: '',
    phone: '',
    message: '',
    addons: [],
  });

  const handleAddonToggle = (addon) => {
    setFormData((prev) => ({
      ...prev,
      addons: prev.addons.includes(addon)
        ? prev.addons.filter((a) => a !== addon)
        : [...prev.addons, addon],
    }));
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      alert('Booking request submitted successfully!');
      setIsSubmitting(false);
      onClose();
    }, 2000);
  };

  return (
    <div className='fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto'>
      <div className='bg-white rounded-2xl max-w-4xl w-full my-8 shadow-2xl'>
        <div className='bg-gradient-to-r from-teal-600 to-cyan-600 px-4 sm:px-8 py-4 sm:py-6 flex justify-between items-center rounded-t-2xl'>
          <div>
            <h3 className='text-xl sm:text-2xl font-bold text-white'>
              Request Your Yacht Experience
            </h3>
            <p className='text-teal-100 text-xs sm:text-sm mt-1'>
              Fill out the form below
            </p>
          </div>
          <button
            onClick={onClose}
            className='text-white hover:bg-white/20 rounded-full p-2 transition-colors'
          >
            <X className='w-5 h-5 sm:w-6 sm:h-6' />
          </button>
        </div>

        <div className='p-4 sm:p-8 space-y-4 sm:space-y-5'>
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4'>
            <div>
              <label className='block text-xs sm:text-sm font-semibold text-gray-700 mb-1'>
                Date <span className='text-red-500'>*</span>
              </label>
              <input
                type='date'
                required
                min={new Date().toISOString().split('T')[0]}
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className='w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500'
              />
            </div>

            <div>
              <label className='block text-xs sm:text-sm font-semibold text-gray-700 mb-1'>
                Guests <span className='text-red-500'>*</span>
              </label>
              <select
                value={formData.guests}
                onChange={(e) =>
                  setFormData({ ...formData, guests: parseInt(e.target.value) })
                }
                className='w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500'
              >
                {[...Array(20)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1} {i === 0 ? 'Guest' : 'Guests'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className='block text-xs sm:text-sm font-semibold text-gray-700 mb-1'>
                Duration <span className='text-red-500'>*</span>
              </label>
              <select
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
                className='w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500'
              >
                <option value='half-day'>Half Day (4h)</option>
                <option value='full-day'>Full Day (8h)</option>
              </select>
            </div>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4'>
            <div>
              <label className='block text-xs sm:text-sm font-semibold text-gray-700 mb-1'>
                Name <span className='text-red-500'>*</span>
              </label>
              <input
                type='text'
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className='w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500'
                placeholder='John Doe'
              />
            </div>

            <div>
              <label className='block text-xs sm:text-sm font-semibold text-gray-700 mb-1'>
                Email <span className='text-red-500'>*</span>
              </label>
              <input
                type='email'
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className='w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500'
                placeholder='john@example.com'
              />
            </div>

            <div>
              <label className='block text-xs sm:text-sm font-semibold text-gray-700 mb-1'>
                Phone <span className='text-red-500'>*</span>
              </label>
              <input
                type='tel'
                required
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className='w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500'
                placeholder='+1 234 567 890'
              />
            </div>
          </div>

          <div>
            <label className='block text-xs sm:text-sm font-semibold text-gray-700 mb-2'>
              Additional Services{' '}
              <span className='text-gray-400'>(Optional)</span>
            </label>
            <div className='grid grid-cols-2 sm:grid-cols-3 gap-2'>
              {[
                { id: 'catering', label: 'Catering', icon: Coffee },
                { id: 'massage', label: 'Massage', icon: Sparkles },
                { id: 'photography', label: 'Photography', icon: Camera },
                { id: 'dj', label: 'DJ Music', icon: Music },
                { id: 'decoration', label: 'Decoration', icon: Heart },
                { id: 'celebration', label: 'Celebration', icon: Sparkles },
              ].map((addon) => {
                const Icon = addon.icon;
                return (
                  <label
                    key={addon.id}
                    className='flex items-center gap-2 p-2 rounded-lg border-2 border-gray-200 hover:border-teal-300 cursor-pointer transition-all'
                  >
                    <input
                      type='checkbox'
                      checked={formData.addons.includes(addon.id)}
                      onChange={() => handleAddonToggle(addon.id)}
                      className='w-4 h-4 text-teal-600 rounded focus:ring-teal-500'
                    />
                    <Icon className='w-4 h-4 text-teal-600' />
                    <span className='text-xs sm:text-sm font-medium text-gray-700 truncate'>
                      {addon.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          <div>
            <label className='block text-xs sm:text-sm font-semibold text-gray-700 mb-1'>
              Special Requests
            </label>
            <textarea
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              rows={2}
              className='w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 resize-none'
              placeholder='Any special requests or questions?'
            />
          </div>

          <div className='bg-teal-50 rounded-xl p-3 border border-teal-200'>
            <div className='flex gap-2'>
              <Info className='w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5' />
              <div>
                <p className='text-xs sm:text-sm font-medium text-teal-900'>
                  Response Time: 24-48 hours
                </p>
                <p className='text-xs text-teal-700 mt-1'>
                  We'll contact you to confirm availability and finalize
                  details.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`w-full py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all flex items-center justify-center gap-3 ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 shadow-lg hover:shadow-xl'
            } text-white`}
          >
            {isSubmitting ? (
              <>
                <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white' />
                Submitting...
              </>
            ) : (
              <>
                <CheckCircle className='w-5 h-5' />
                Submit Request
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============ DEMO COMPONENT ============
export default function YachtExperienceDemo() {
  const [showModal, setShowModal] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const demoYacht = {
    id: 'luxury-princess',
    name: 'Luxury Princess 85',
    category: 'luxury',
    shortDescription:
      'Experience the ultimate in maritime luxury aboard our flagship yacht. Perfect for special occasions and unforgettable moments.',
    mainImage:
      'https://res.cloudinary.com/ddg92xar5/image/upload/v1754600018/2_dc7fry.jpg',
    gallery: [
      'https://res.cloudinary.com/ddg92xar5/image/upload/v1754600017/3_eapwql.jpg',
      'https://res.cloudinary.com/ddg92xar5/image/upload/v1754600018/2_dc7fry.jpg',
      'https://res.cloudinary.com/ddg92xar5/image/upload/v1754600017/5_ryceky.jpg',
    ],
    specifications: {
      length: '85 ft',
      maxGuests: 18,
      cabins: 4,
      bathrooms: 4,
      crew: 5,
      maxSpeed: '28 knots',
      manufacturer: 'Princess',
      year: 2024,
    },
    amenities: [
      {
        icon: <Wifi className='w-5 h-5' />,
        name: 'High-Speed WiFi',
        description:
          'Stay connected with premium internet throughout your journey',
      },
      {
        icon: <Utensils className='w-5 h-5' />,
        name: 'Gourmet Dining',
        description:
          'Private chef preparing exquisite meals with fresh ingredients',
      },
    ],
    highlights: [
      'Spacious sun deck',
      'Luxury cabins',
      'Water sports equipment',
    ],
    isPremium: true,
    rating: 5.0,
    reviews: 128,
    location: 'Caribbean',
    itinerary: [
      'Marina departure',
      'Snorkeling spot',
      'Beach lunch',
      'Sunset cruise',
    ],
  };

  return (
    <div className='min-h-screen bg-white'>
      <CinematicHero onBookingClick={() => setShowForm(true)} />

      <div className='py-20 bg-gray-50'>
        <div className='max-w-4xl mx-auto px-4 text-center'>
          <h2 className='text-3xl font-bold text-gray-900 mb-4'>
            Component Demos
          </h2>
          <p className='text-gray-600 mb-8'>Test the improved components</p>

          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <button
              onClick={() => setShowModal(true)}
              className='px-8 py-4 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-colors flex items-center justify-center gap-2'
            >
              <Camera className='w-5 h-5' />
              View Yacht Details
            </button>

            <button
              onClick={() => setShowForm(true)}
              className='px-8 py-4 bg-cyan-600 text-white rounded-xl font-semibold hover:bg-cyan-700 transition-colors flex items-center justify-center gap-2'
            >
              <Calendar className='w-5 h-5' />
              Open Booking Form
            </button>
          </div>

          <div className='mt-12 grid sm:grid-cols-3 gap-6 text-left'>
            <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-200'>
              <div className='w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4'>
                <CheckCircle className='w-6 h-6 text-teal-600' />
              </div>
              <h3 className='font-semibold text-gray-900 mb-2'>
                Video Autoplay
              </h3>
              <p className='text-sm text-gray-600'>
                Video se reproduce automáticamente al cargar la página
              </p>
            </div>

            <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-200'>
              <div className='w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4'>
                <CheckCircle className='w-6 h-6 text-cyan-600' />
              </div>
              <h3 className='font-semibold text-gray-900 mb-2'>
                Mobile Gallery
              </h3>
              <p className='text-sm text-gray-600'>
                Imágenes más grandes y prominentes en móviles
              </p>
            </div>

            <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-200'>
              <div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4'>
                <CheckCircle className='w-6 h-6 text-blue-600' />
              </div>
              <h3 className='font-semibold text-gray-900 mb-2'>Compact Form</h3>
              <p className='text-sm text-gray-600'>
                Formulario optimizado con menos scroll
              </p>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <YachtDetailsModal
          yacht={demoYacht}
          onClose={() => setShowModal(false)}
          onBook={() => {
            setShowModal(false);
            setShowForm(true);
          }}
        />
      )}

      {showForm && <BookingFormBanner onClose={() => setShowForm(false)} />}
    </div>
  );
}
