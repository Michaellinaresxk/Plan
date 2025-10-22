import React, { useState, useMemo, useEffect } from 'react';
import {
  Star,
  Check,
  ArrowRight,
  X,
  Calendar,
  DollarSign,
  AlertCircle,
  Camera,
  Waves,
  Play,
  Heart,
  Award,
  ChevronDown,
  Clock,
  Info,
  Sparkles,
  Send,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  CATAMARAN_DATA,
  features,
  reviews,
} from '@/constants/catamaran/catamaran';
import { useTranslation } from '@/lib/i18n/client';

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

// ==================== INQUIRY MODAL COMPONENT ====================
interface InquiryFormData {
  date: string;
  guests: number;
  timeSlot: string;
  name: string;
  email: string;
  phone: string;
  message: string;
}

const CatamaranInquiryModal: React.FC<{
  catamaran: any;
  onClose: () => void;
}> = ({ catamaran, onClose }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<InquiryFormData>({
    date: '',
    guests: 2,
    timeSlot: catamaran.timeSlots?.[0]?.id || 'morning',
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
      alert(
        t('services.standard.catamaranServiceView.inquiry.validationError')
      );
      return;
    }

    setIsSubmitting(true);

    // Simulate API call - replace with your actual API endpoint
    setTimeout(() => {
      alert(t('services.standard.catamaranServiceView.inquiry.successMessage'));
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
        {/* Header with Catamaran Image */}
        <div className='relative h-32 overflow-hidden'>
          <img
            src={catamaran.image || catamaran.gallery?.[0]}
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
            <p className='text-white/80 text-sm'>
              {t('services.standard.catamaranServiceView.inquiry.modalTitle')}
            </p>
          </div>
        </div>

        {/* Form Content */}
        <div className='p-6 space-y-4'>
          {/* Date & Guests */}
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                {t('services.standard.catamaranServiceView.inquiry.dateLabel')}
                <span className='text-red-500'>*</span>
              </label>
              <input
                type='date'
                required
                min={new Date().toISOString().split('T')[0]}
                value={formData.date}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, date: e.target.value }))
                }
                className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                {t(
                  'services.standard.catamaranServiceView.inquiry.guestsLabel'
                )}
                <span className='text-red-500'>*</span>
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
                  { length: catamaran.capacity || 30 },
                  (_, i) => i + 1
                ).map((num) => (
                  <option key={num} value={num}>
                    {num}{' '}
                    {num > 1
                      ? t(
                          'services.standard.catamaranServiceView.inquiry.guestsPlural'
                        )
                      : t(
                          'services.standard.catamaranServiceView.inquiry.guestsSingular'
                        )}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Time Slot Selection */}
          {catamaran.timeSlots && catamaran.timeSlots.length > 0 && (
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                {t('services.standard.catamaranServiceView.inquiry.timeLabel')}
                <span className='text-red-500'>*</span>
              </label>
              <div className='grid grid-cols-2 gap-4'>
                {catamaran.timeSlots.map((slot) => (
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
                    <span className='font-semibold text-sm text-center'>
                      {slot.time}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Contact Information */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              {t('services.standard.catamaranServiceView.inquiry.nameLabel')}
              <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              required
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
              placeholder={t(
                'services.standard.catamaranServiceView.inquiry.namePlaceholder'
              )}
            />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                {t('services.standard.catamaranServiceView.inquiry.emailLabel')}
                <span className='text-red-500'>*</span>
              </label>
              <input
                type='email'
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
                placeholder={t(
                  'services.standard.catamaranServiceView.inquiry.emailPlaceholder'
                )}
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                {t('services.standard.catamaranServiceView.inquiry.phoneLabel')}
                <span className='text-red-500'>*</span>
              </label>
              <input
                type='tel'
                required
                value={formData.phone}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, phone: e.target.value }))
                }
                className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
                placeholder={t(
                  'services.standard.catamaranServiceView.inquiry.phonePlaceholder'
                )}
              />
            </div>
          </div>

          {/* Message */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              {t('services.standard.catamaranServiceView.inquiry.messageLabel')}
            </label>
            <textarea
              value={formData.message}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, message: e.target.value }))
              }
              rows={3}
              className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none'
              placeholder={t(
                'services.standard.catamaranServiceView.inquiry.messagePlaceholder'
              )}
            />
          </div>

          {/* Info Notice */}
          <div className='bg-blue-50 rounded-lg p-4 border border-blue-200'>
            <div className='flex items-start gap-2 mb-2'>
              <Info className='w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5' />
              <p className='text-sm text-blue-800 font-medium'>
                {t(
                  'services.standard.catamaranServiceView.inquiry.noticeTitle'
                )}
              </p>
            </div>
            <p className='text-sm text-blue-700 leading-relaxed'>
              {t('services.standard.catamaranServiceView.inquiry.noticeText')}
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
                {t('services.standard.catamaranServiceView.inquiry.submitting')}
              </>
            ) : (
              <>
                <Send className='w-5 h-5' />
                {t(
                  'services.standard.catamaranServiceView.inquiry.submitButton'
                )}
              </>
            )}
          </button>

          <p className='text-xs text-gray-500 text-center'>
            {t('services.standard.catamaranServiceView.inquiry.disclaimer')}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

// ==================== IMMERSIVE HERO SECTION ====================
const ImmersiveHero = ({ selectedCatamaran, onCatamaranSelect }) => {
  const { t } = useTranslation();
  const [currentCatamaranIndex, setCurrentCatamaranIndex] = useState(0);
  const catamarans = Object.values(CATAMARAN_DATA);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCatamaranIndex((prev) => (prev + 1) % catamarans.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [catamarans.length]);

  const currentCatamaran =
    selectedCatamaran || catamarans[currentCatamaranIndex];

  return (
    <div className='relative h-screen overflow-hidden'>
      {/* Background with Ken Burns Effect */}
      <AnimatePresence mode='wait'>
        <motion.div
          key={currentCatamaran.id}
          className='absolute inset-0'
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        >
          <div className='absolute inset-0 overflow-hidden'>
            <img
              src={currentCatamaran.heroImage}
              alt={currentCatamaran.name}
              className='w-full h-full object-cover scale-110'
            />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Dynamic Gradient Based on Catamaran */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${currentCatamaran.primaryColor} opacity-70`}
        animate={{ opacity: [0.6, 0.8, 0.6] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/40' />

      {/* Floating Particles */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className='absolute w-2 h-2 bg-white/20 rounded-full'
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, -100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className='absolute inset-0 flex items-center justify-center z-10'>
        <div className='text-center text-white max-w-6xl px-8'>
          <AnimatePresence mode='wait'>
            <motion.div
              key={currentCatamaran.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.8 }}
            >
              <motion.h1
                className='text-7xl md:text-9xl font-black mb-6 leading-none'
                style={{
                  background: `linear-gradient(135deg, white, #e0f2fe, white)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {currentCatamaran.name}
              </motion.h1>

              <motion.p
                className='text-2xl md:text-4xl mb-4 font-light opacity-90'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {currentCatamaran.mood}
              </motion.p>

              <motion.p
                className='text-lg md:text-xl mb-8 max-w-3xl mx-auto opacity-80'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {currentCatamaran.vibe}
              </motion.p>

              <motion.div
                className='flex flex-wrap justify-center gap-4 mb-12'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                {currentCatamaran.highlights.map((highlight, index) => (
                  <span
                    key={index}
                    className='px-6 py-3 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-sm font-medium'
                  >
                    {highlight}
                  </span>
                ))}
              </motion.div>

              <motion.button
                className='group bg-white text-gray-900 px-12 py-6 rounded-full text-xl font-bold shadow-2xl hover:shadow-white/25 transition-all duration-300'
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onCatamaranSelect(currentCatamaran)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <span className='flex items-center gap-3'>
                  {t(
                    'services.standard.catamaranServiceView.hero.startAdventure'
                  )}
                  <ArrowRight className='w-6 h-6 group-hover:translate-x-2 transition-transform' />
                </span>
              </motion.button>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Catamaran Selector */}
      <div className='absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4'>
        {catamarans.map((catamaran, index) => (
          <motion.button
            key={catamaran.id}
            className={`w-16 h-16 rounded-full border-2 overflow-hidden transition-all duration-300 ${
              index === currentCatamaranIndex
                ? 'border-white scale-110'
                : 'border-white/50 hover:border-white/80'
            }`}
            onClick={() => {
              setCurrentCatamaranIndex(index);
              onCatamaranSelect(catamaran);
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <img
              src={catamaran.image}
              alt={catamaran.name}
              className='w-full h-full object-cover'
            />
          </motion.button>
        ))}
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className='absolute bottom-8 right-8 text-white/70'
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown className='w-8 h-8' />
      </motion.div>
    </div>
  );
};

// ==================== IMMERSIVE EXPERIENCE SHOWCASE ====================
const ExperienceShowcase = ({ catamaran }) => {
  const { t } = useTranslation();
  const [activeExperience, setActiveExperience] = useState(0);

  const experiences = [
    {
      title: t(
        'services.standard.catamaranServiceView.experienceShowcase.experiences.crystalWaters.title'
      ),
      description: t(
        'services.standard.catamaranServiceView.experienceShowcase.experiences.crystalWaters.description'
      ),
      image: catamaran.gallery[0],
      icon: Waves,
    },
    {
      title: t(
        'services.standard.catamaranServiceView.experienceShowcase.experiences.adventureAwaits.title'
      ),
      description: t(
        'services.standard.catamaranServiceView.experienceShowcase.experiences.adventureAwaits.description'
      ),
      image: catamaran.gallery[1] || catamaran.gallery[0],
      icon: Camera,
    },
    {
      title: t(
        'services.standard.catamaranServiceView.experienceShowcase.experiences.pureParadise.title'
      ),
      description: t(
        'services.standard.catamaranServiceView.experienceShowcase.experiences.pureParadise.description'
      ),
      image: catamaran.gallery[2] || catamaran.gallery[0],
      icon: Heart,
    },
  ];

  return (
    <section className='relative py-32 overflow-hidden'>
      <div className='absolute inset-0 bg-gradient-to-br from-slate-900 to-gray-900' />

      {/* Background Pattern */}
      <div className='absolute inset-0 opacity-10'>
        <div
          className='absolute inset-0'
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className='relative max-w-7xl mx-auto px-8'>
        <motion.div
          className='text-center mb-20'
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className='text-6xl md:text-7xl font-black text-white mb-6'>
            {t(
              'services.standard.catamaranServiceView.experienceShowcase.titlePrefix'
            )}{' '}
            <span
              className={`text-transparent bg-clip-text bg-gradient-to-r ${catamaran.primaryColor}`}
            >
              {catamaran.name}
            </span>{' '}
            {t(
              'services.standard.catamaranServiceView.experienceShowcase.titleSuffix'
            )}
          </h2>
          <p className='text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed'>
            {t(
              'services.standard.catamaranServiceView.experienceShowcase.subtitle',
              { catamaranName: catamaran.name }
            )}
          </p>
        </motion.div>

        <div className='grid lg:grid-cols-2 gap-16 items-center'>
          {/* Experience Content */}
          <div className='space-y-8'>
            {experiences.map((experience, index) => (
              <motion.div
                key={index}
                className={`cursor-pointer transition-all duration-500 ${
                  activeExperience === index
                    ? 'opacity-100'
                    : 'opacity-40 hover:opacity-70'
                }`}
                onClick={() => setActiveExperience(index)}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{
                  opacity: activeExperience === index ? 1 : 0.4,
                  x: 0,
                }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className='flex items-center gap-6 p-6 rounded-2xl hover:bg-white/5 transition-colors'>
                  <div
                    className={`p-4 rounded-xl bg-gradient-to-r ${catamaran.primaryColor}`}
                  >
                    <experience.icon className='w-8 h-8 text-white' />
                  </div>
                  <div>
                    <h3 className='text-2xl font-bold text-white mb-2'>
                      {experience.title}
                    </h3>
                    <p className='text-gray-300 text-lg'>
                      {experience.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Experience Image */}
          <div className='relative'>
            <AnimatePresence mode='wait'>
              <motion.div
                key={activeExperience}
                className='relative rounded-3xl overflow-hidden shadow-2xl'
                initial={{ opacity: 0, scale: 0.9, rotateY: 90 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 1.1, rotateY: -90 }}
                transition={{ duration: 0.6 }}
              >
                <img
                  src={experiences[activeExperience].image}
                  alt={experiences[activeExperience].title}
                  className='w-full h-96 object-cover'
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t from-black/50 to-transparent`}
                />
                <div className='absolute bottom-6 left-6'>
                  <h4 className='text-white text-xl font-bold'>
                    {experiences[activeExperience].title}
                  </h4>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

// ==================== ENHANCED TOUCH GALLERY ====================
const TouchGallery = ({ images, currentIndex, onIndexChange }) => {
  const { t } = useTranslation();
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

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
      onIndexChange((currentIndex + 1) % images.length);
    }
    if (isRightSwipe) {
      onIndexChange(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
    }
  };

  return (
    <div className='relative group'>
      <div
        className='relative h-96 overflow-hidden rounded-3xl cursor-pointer shadow-2xl'
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onClick={() => onIndexChange((currentIndex + 1) % images.length)}
      >
        <AnimatePresence mode='wait'>
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt={t(
              'services.standard.catamaranServiceView.touchGallery.galleryAlt',
              { index: currentIndex + 1 }
            )}
            className='w-full h-full object-cover'
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
          />
        </AnimatePresence>

        {/* Navigation Dots */}
        <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2'>
          {images.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-white w-8'
                  : 'bg-white/50 hover:bg-white/80'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                onIndexChange(index);
              }}
            />
          ))}
        </div>

        {/* Touch Indicator */}
        <div className='absolute top-4 left-4 bg-black/30 backdrop-blur-md text-white px-3 py-1 rounded-full text-sm opacity-0 group-hover:opacity-100 transition-opacity'>
          {t(
            'services.standard.catamaranServiceView.touchGallery.touchIndicator'
          )}
        </div>
      </div>
    </div>
  );
};

// ==================== PRICING CALCULATOR ====================
const PricingCalculator = ({ catamaran, groupSize, onGroupSizeChange }) => {
  const { t } = useTranslation();
  const price = calculatePrice(catamaran, groupSize);

  return (
    <motion.div
      className={`relative overflow-hidden bg-gradient-to-br ${catamaran.primaryColor} rounded-3xl p-8 text-white shadow-2xl`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className='absolute inset-0 bg-white/10 backdrop-blur-sm' />
      <div className='relative'>
        <h4 className='text-2xl font-bold mb-6 flex items-center'>
          <DollarSign className='w-7 h-7 mr-3' />
          {t('services.standard.catamaranServiceView.pricingCalculator.title')}
        </h4>

        <div className='space-y-6'>
          <div className='flex items-center justify-between'>
            <span className='text-lg font-medium'>
              {t(
                'services.standard.catamaranServiceView.pricingCalculator.groupSize'
              )}
            </span>
            <div className='flex items-center gap-4'>
              <button
                onClick={() => onGroupSizeChange(Math.max(1, groupSize - 1))}
                className='w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center font-bold text-xl transition-colors'
              >
                -
              </button>
              <span className='text-2xl font-bold w-16 text-center'>
                {groupSize}
              </span>
              <button
                onClick={() => onGroupSizeChange(groupSize + 1)}
                className='w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center font-bold text-xl transition-colors'
              >
                +
              </button>
            </div>
          </div>

          <div className='border-t border-white/20 pt-6'>
            <div className='text-center'>
              <div className='text-sm opacity-80 mb-2'>
                {t(
                  'services.standard.catamaranServiceView.pricingCalculator.totalPrice'
                )}
              </div>
              <motion.div
                className='text-5xl font-black'
                key={price}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                ${price}
              </motion.div>
              <div className='text-sm opacity-80'>
                {t(
                  'services.standard.catamaranServiceView.pricingCalculator.currency'
                )}{' '}
                {t(
                  'services.standard.catamaranServiceView.pricingCalculator.forPeople',
                  { count: groupSize }
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ==================== CATAMARAN DETAILS MODAL ====================
const CatamaranDetailsModal = ({ catamaran, isOpen, onClose, onInquiry }) => {
  const { t } = useTranslation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [groupSize, setGroupSize] = useState(2);

  if (!isOpen || !catamaran) return null;

  return (
    <AnimatePresence>
      <div className='fixed inset-0 z-50'>
        <motion.div
          className='absolute inset-0 bg-black/80 backdrop-blur-sm'
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        <motion.div
          className='absolute right-0 top-0 h-full w-full max-w-4xl bg-white shadow-2xl overflow-y-auto'
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        >
          {/* Header */}
          <div
            className={`sticky top-0 bg-gradient-to-r ${catamaran.primaryColor} text-white p-8 z-10`}
          >
            <div className='flex justify-between items-start'>
              <div>
                <h2 className='text-4xl font-black mb-2'>{catamaran.name}</h2>
                <p className='text-xl opacity-90'>{catamaran.description}</p>
              </div>
              <button
                onClick={onClose}
                className='p-3 hover:bg-white/20 rounded-full transition-colors'
              >
                <X className='w-8 h-8' />
              </button>
            </div>
          </div>

          <div className='p-8 space-y-12'>
            {/* Gallery */}
            <section>
              <h3 className='text-3xl font-bold mb-6'>
                {t(
                  'services.standard.catamaranServiceView.detailsModal.galleryTitle'
                )}
              </h3>
              <TouchGallery
                images={catamaran.gallery}
                currentIndex={currentImageIndex}
                onIndexChange={setCurrentImageIndex}
              />
            </section>

            {/* Pricing */}
            <section>
              <PricingCalculator
                catamaran={catamaran}
                groupSize={groupSize}
                onGroupSizeChange={setGroupSize}
              />
            </section>

            {/* Features Grid */}
            <section>
              <h3 className='text-3xl font-bold mb-6'>
                {t(
                  'services.standard.catamaranServiceView.detailsModal.whatsIncluded'
                )}
              </h3>
              <div className='grid md:grid-cols-2 gap-4'>
                {catamaran.includes.map((item, index) => (
                  <div
                    key={index}
                    className='flex items-center gap-3 p-4 bg-gray-50 rounded-xl'
                  >
                    <Check className='w-5 h-5 text-green-500 flex-shrink-0' />
                    <span className='text-gray-700'>{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Time Slots */}
            <section>
              <h3 className='text-3xl font-bold mb-6'>
                {t(
                  'services.standard.catamaranServiceView.detailsModal.availableTimes'
                )}
              </h3>
              <div className='grid gap-4'>
                {catamaran.timeSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className='flex justify-between items-center p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer'
                  >
                    <span className='text-lg font-semibold'>{slot.time}</span>
                    <span className='text-gray-600'>{catamaran.duration}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className='sticky bottom-0 bg-white border-t p-8'>
            <button
              onClick={() => onInquiry(catamaran, groupSize)}
              className={`w-full bg-gradient-to-r ${catamaran.primaryColor} text-white py-6 rounded-2xl text-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-3`}
            >
              <Calendar className='w-6 h-6' />
              {t(
                'services.standard.catamaranServiceView.detailsModal.inquiryButton',
                { catamaranName: catamaran.name }
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// ==================== CATAMARAN SELECTION GRID ====================
const CatamaranSelection = ({ onCatamaranViewDetails }) => {
  const { t } = useTranslation();

  return (
    <section className='py-24 px-8'>
      <div className='max-w-7xl mx-auto'>
        <motion.div
          className='text-center mb-16'
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className='text-5xl md:text-6xl font-black text-gray-900 mb-6'>
            {t(
              'services.standard.catamaranServiceView.catamaranSelection.title'
            )}{' '}
            <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600'>
              {t(
                'services.standard.catamaranServiceView.catamaranSelection.titleHighlight'
              )}
            </span>
          </h2>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
            {t(
              'services.standard.catamaranServiceView.catamaranSelection.subtitle'
            )}
          </p>
        </motion.div>

        <div
          className='grid md:grid-cols-2 gap-8'
          data-section='catamaran-selection'
        >
          {Object.values(CATAMARAN_DATA).map((catamaran, index) => (
            <motion.div
              key={catamaran.id}
              className='group relative overflow-hidden rounded-3xl cursor-pointer shadow-2xl hover:shadow-3xl transition-all duration-700'
              onClick={() => onCatamaranViewDetails(catamaran)}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <div className='relative h-80 overflow-hidden'>
                <img
                  src={catamaran.image}
                  alt={catamaran.name}
                  className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${catamaran.primaryColor} opacity-60 group-hover:opacity-40 transition-opacity`}
                />

                {catamaran.premium && (
                  <div className='absolute top-6 right-6 bg-white text-gray-900 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2'>
                    <Award className='w-4 h-4' />
                    {t(
                      'services.standard.catamaranServiceView.catamaranSelection.premium'
                    )}
                  </div>
                )}
              </div>

              <div className='absolute inset-0 flex flex-col justify-end p-8 text-white'>
                <h3 className='text-4xl font-black mb-2'>{catamaran.name}</h3>
                <p className='text-lg mb-4 opacity-90'>{catamaran.mood}</p>
                <div className='flex justify-between items-end'>
                  <span className='text-3xl font-bold'>
                    ${catamaran.price}
                    <span className='text-lg opacity-80'>
                      {t(
                        'services.standard.catamaranServiceView.catamaranSelection.perPerson'
                      )}
                    </span>
                  </span>
                  <ArrowRight className='w-6 h-6 transform group-hover:translate-x-2 transition-transform' />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ==================== FEATURES COMPARISON ====================
const FeaturesComparison = () => {
  const { t } = useTranslation();

  return (
    <section className='py-24 bg-gray-50'>
      <div className='max-w-6xl mx-auto px-8'>
        <motion.div
          className='text-center mb-16'
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className='text-5xl font-black text-gray-900 mb-6'>
            {t(
              'services.standard.catamaranServiceView.featuresComparison.title'
            )}{' '}
            <span className='text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600'>
              {t(
                'services.standard.catamaranServiceView.featuresComparison.titleHighlight'
              )}
            </span>
          </h2>
        </motion.div>

        <motion.div
          className='overflow-hidden rounded-3xl shadow-2xl'
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          viewport={{ once: true }}
        >
          <table className='w-full bg-white'>
            <thead className='bg-gradient-to-r from-gray-900 to-gray-800 text-white'>
              <tr>
                <th className='px-8 py-6 text-left text-lg font-bold'>
                  {t(
                    'services.standard.catamaranServiceView.featuresComparison.tableHeaders.features'
                  )}
                </th>
                <th className='px-8 py-6 text-center text-lg font-bold'>
                  {t(
                    'services.standard.catamaranServiceView.featuresComparison.tableHeaders.liberty'
                  )}
                </th>
                <th className='px-8 py-6 text-center text-lg font-bold'>
                  {t(
                    'services.standard.catamaranServiceView.featuresComparison.tableHeaders.destiny'
                  )}
                </th>
                <th className='px-8 py-6 text-center text-lg font-bold'>
                  {t(
                    'services.standard.catamaranServiceView.featuresComparison.tableHeaders.fortyfive'
                  )}
                </th>
                <th className='px-8 py-6 text-center text-lg font-bold'>
                  {t(
                    'services.standard.catamaranServiceView.featuresComparison.tableHeaders.trinity'
                  )}
                </th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, index) => (
                <tr
                  key={feature.name}
                  className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                >
                  <td className='px-8 py-6 font-semibold text-gray-900'>
                    {feature.name}
                  </td>
                  {['liberty', 'destiny', '45', 'trinity'].map((catamaran) => (
                    <td key={catamaran} className='px-8 py-6 text-center'>
                      {typeof feature[catamaran] === 'boolean' ? (
                        feature[catamaran] ? (
                          <Check className='w-6 h-6 text-green-500 mx-auto' />
                        ) : (
                          <X className='w-6 h-6 text-red-500 mx-auto' />
                        )
                      ) : (
                        <span className='px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold'>
                          {feature[catamaran]}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  );
};

// ==================== GALLERY SECTION ====================
const GallerySection = () => {
  const { t } = useTranslation();

  const images = [
    {
      src: 'https://res.cloudinary.com/ddg92xar5/image/upload/v1756802356/3_syxzqo.jpg',
      title: t(
        'services.standard.catamaranServiceView.gallery.images.crystalWaters'
      ),
    },
    {
      src: 'https://res.cloudinary.com/ddg92xar5/image/upload/v1756802334/1_wvnp2r.jpg',
      title: t(
        'services.standard.catamaranServiceView.gallery.images.snorkelAdventure'
      ),
    },
    {
      src: 'https://res.cloudinary.com/ddg92xar5/image/upload/v1756802334/2_vrbyj2.jpg',
      title: t(
        'services.standard.catamaranServiceView.gallery.images.waterSlideFun'
      ),
    },
    {
      src: 'https://res.cloudinary.com/ddg92xar5/image/upload/v1756802312/3_cz2ios.jpg',
      title: t(
        'services.standard.catamaranServiceView.gallery.images.sunsetViews'
      ),
    },
  ];

  return (
    <section className='py-24 bg-gray-900'>
      <div className='max-w-7xl mx-auto px-8'>
        <motion.div
          className='text-center mb-16'
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className='text-5xl font-black text-white mb-6'>
            {t('services.standard.catamaranServiceView.gallery.title')}{' '}
            <span className='text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400'>
              {t(
                'services.standard.catamaranServiceView.gallery.titleHighlight'
              )}
            </span>
          </h2>
        </motion.div>

        <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {images.map((image, index) => (
            <motion.div
              key={index}
              className='group relative overflow-hidden rounded-2xl aspect-square cursor-pointer'
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
            >
              <img
                src={image.src}
                alt={image.title}
                className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity' />
              <div className='absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity'>
                <h3 className='text-lg font-bold'>{image.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ==================== REVIEWS SECTION ====================
const ReviewsSection = () => {
  const { t } = useTranslation();

  return (
    <section className='py-24 px-8 bg-white'>
      <div className='max-w-6xl mx-auto'>
        <motion.div
          className='text-center mb-16'
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className='text-5xl font-black text-gray-900 mb-6'>
            {t('services.standard.catamaranServiceView.reviews.title')}{' '}
            <span className='text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600'>
              {t(
                'services.standard.catamaranServiceView.reviews.titleHighlight'
              )}
            </span>
          </h2>
          <div className='flex justify-center items-center gap-2 mb-4'>
            {[...Array(5)].map((_, i) => (
              <Star key={i} className='w-6 h-6 fill-amber-400 text-amber-400' />
            ))}
            <span className='ml-3 text-xl text-gray-600 font-semibold'>
              {t('services.standard.catamaranServiceView.reviews.rating')}
            </span>
          </div>
        </motion.div>

        <div className='grid md:grid-cols-3 gap-8'>
          {reviews.map((review, idx) => (
            <motion.div
              key={idx}
              className='bg-gray-50 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow'
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className='flex gap-1 mb-4'>
                {[...Array(review.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className='w-5 h-5 fill-amber-400 text-amber-400'
                  />
                ))}
              </div>
              <p className='text-gray-700 mb-6 text-lg leading-relaxed'>
                "{review.text}"
              </p>
              <div className='flex justify-between items-center'>
                <div>
                  <p className='font-bold text-gray-900'>{review.name}</p>
                  <p className='text-cyan-600 text-sm font-semibold'>
                    {review.experience}
                  </p>
                </div>
                <span className='text-gray-500 text-sm'>{review.date}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ==================== MAIN COMPONENT ====================
const CatamaranServiceView = () => {
  const { t } = useTranslation();
  const [selectedCatamaran, setSelectedCatamaran] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [heroSelectedCatamaran, setHeroSelectedCatamaran] = useState(null);

  const handleCatamaranViewDetails = (catamaran) => {
    setSelectedCatamaran(catamaran);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsModalOpen(false);
    setSelectedCatamaran(null);
  };

  const handleInquiryFromDetails = (catamaran, groupSize) => {
    const enrichedCatamaran = {
      ...catamaran,
      pricing: catamaran.pricing || {
        minimumRate: catamaran.price * 4,
        baseGroupSize: 5,
        additionalPersonRate: catamaran.price,
        currency: 'USD',
      },
      includes: catamaran.includes || [],
      destinations: catamaran.destinations || [],
      features: catamaran.features || [],
      highlights: catamaran.highlights || [],
      timeSlots: catamaran.timeSlots || [
        { id: 'morning', time: '8:30 AM - 11:30 AM' },
        { id: 'midday', time: '11:30 AM - 2:30 PM' },
        { id: 'afternoon', time: '2:30 PM - 5:30 PM' },
      ],
      duration: catamaran.duration || '3 hours',
      notes: catamaran.notes || '',
      capacity: catamaran.capacity || 30,
    };

    setSelectedCatamaran(enrichedCatamaran);
    setIsDetailsModalOpen(false);
    setIsInquiryModalOpen(true);
  };

  const handleHeroCatamaranSelect = (catamaran) => {
    setHeroSelectedCatamaran(catamaran);
    handleCatamaranViewDetails(catamaran);
  };

  return (
    <div className='min-h-screen bg-white'>
      {/* Immersive Hero */}
      <ImmersiveHero
        selectedCatamaran={heroSelectedCatamaran}
        onCatamaranSelect={handleHeroCatamaranSelect}
      />

      {/* Experience Showcase */}
      {heroSelectedCatamaran && (
        <ExperienceShowcase catamaran={heroSelectedCatamaran} />
      )}

      {/* Catamaran Selection */}
      <CatamaranSelection onCatamaranViewDetails={handleCatamaranViewDetails} />

      {/* Features Comparison */}
      <FeaturesComparison />

      {/* Gallery */}
      <GallerySection />

      {/* Reviews */}
      <ReviewsSection />

      {/* CTA Section */}
      <section className='relative py-32 overflow-hidden'>
        <div className='absolute inset-0'>
          <img
            src='https://images.pexels.com/photos/4784342/pexels-photo-4784342.jpeg'
            alt='Caribbean Adventure'
            className='w-full h-full object-cover'
          />
          <div className='absolute inset-0 bg-gradient-to-r from-blue-900/90 to-cyan-900/90' />
        </div>

        <div className='relative text-center text-white px-8'>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className='text-5xl md:text-6xl font-black mb-8'>
              {t('services.standard.catamaranServiceView.cta.title')}{' '}
              <span className='text-cyan-300'>
                {t('services.standard.catamaranServiceView.cta.titleHighlight')}
              </span>
            </h2>
            <p className='text-xl mb-12 max-w-3xl mx-auto'>
              {t('services.standard.catamaranServiceView.cta.subtitle')}
            </p>
            <button
              onClick={() => {
                document
                  .querySelector('[data-section="catamaran-selection"]')
                  .scrollIntoView({ behavior: 'smooth' });
              }}
              className='bg-white text-gray-900 px-12 py-6 rounded-full text-xl font-bold shadow-2xl hover:shadow-white/25 transition-all hover:scale-105'
            >
              {t('services.standard.catamaranServiceView.cta.button')}
            </button>
          </motion.div>
        </div>
      </section>

      {/* Catamaran Details Modal */}
      <CatamaranDetailsModal
        catamaran={selectedCatamaran}
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetails}
        onInquiry={handleInquiryFromDetails}
      />

      {/* Inquiry Modal */}
      <AnimatePresence>
        {isInquiryModalOpen && selectedCatamaran && (
          <CatamaranInquiryModal
            catamaran={selectedCatamaran}
            onClose={() => {
              setIsInquiryModalOpen(false);
              setSelectedCatamaran(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CatamaranServiceView;
