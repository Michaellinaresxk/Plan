import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Clock,
  Utensils,
  ArrowRight,
  Check,
  LifeBuoy,
  AlertCircle,
  Waves,
  MapPin,
  Calendar,
  Anchor,
  Sun,
  Fish,
} from 'lucide-react';
import { useBooking } from '@/context/BookingContext';
import { useTranslation } from '@/lib/i18n/client';
import { Service } from '@/types/type';
import { ServiceData } from '@/types/services';
import { BookingDate } from '@/types/type';
import BookingModal from '@/UI/components/modal/BookingModal';

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

interface CatamaranServiceViewProps {
  service: Service;
  serviceData?: ServiceData;
  primaryColor: string;
}

// Time slots data (times don't need translation)
const timeSlots = [
  {
    id: 'morning',
    time: '9:00 AM',
    endTime: '1:00 PM',
    labelKey: 'morning',
    popular: false,
  },
  {
    id: 'afternoon',
    time: '2:00 PM',
    endTime: '6:00 PM',
    labelKey: 'afternoon',
    popular: true,
  },
];

// Hero Section Component
const HeroSection: React.FC<{
  currentImage: number;
  onImageChange: (index: number) => void;
  onBookClick: () => void;
}> = ({ currentImage, onImageChange, onBookClick }) => {
  const { t } = useTranslation();

  const heroImages = [
    {
      src: 'https://images.pexels.com/photos/4784342/pexels-photo-4784342.jpeg?_gl=1*1c89csu*_ga*MTQzOTE0OTkxMS4xNzUzMjcxMDk0*_ga_8JE65Q40S6*czE3NTM3OTg1NjgkbzgkZzEkdDE3NTM3OTkxOTkkajU5JGwwJGgw',
      title: t('services.premium.luxCatamaran.hero.title'),
      subtitle: t('services.premium.luxCatamaran.hero.subtitle'),
    },
  ];

  return (
    <div className='relative h-screen overflow-hidden'>
      <AnimatePresence mode='wait'>
        <motion.div
          key={currentImage}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8 }}
          className='absolute inset-0'
        >
          <img
            src={heroImages[currentImage].src}
            alt={heroImages[currentImage].title}
            className='w-full h-full object-cover'
          />
        </motion.div>
      </AnimatePresence>

      <div className='absolute inset-0 bg-gradient-to-br from-slate-900/60 via-blue-900/40 to-cyan-900/60' />

      <div className='absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2'>
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => onImageChange(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentImage
                ? 'w-8 h-3 bg-white'
                : 'w-3 h-3 bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      <div className='absolute inset-0 flex items-center justify-center text-center text-white p-8'>
        <div className='max-w-5xl'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className='inline-flex items-center bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 mb-8'
          >
            <Waves className='w-5 h-5 mr-3 text-cyan-300' />
            <span className='font-semibold text-lg'>
              {t('services.premium.luxCatamaran.hero.badge')}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className='text-6xl md:text-7xl font-bold mb-6 leading-tight'
          >
            {heroImages[currentImage].title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className='text-2xl md:text-3xl text-white/90 mb-4 font-light'
          >
            {heroImages[currentImage].subtitle}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className='text-lg text-white/80 mb-10 max-w-3xl mx-auto leading-relaxed'
          >
            {t('services.premium.luxCatamaran.hero.description')}
          </motion.p>

          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            onClick={onBookClick}
            className='bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-10 py-5 rounded-2xl font-bold text-xl flex items-center gap-4 mx-auto transition-all duration-300 hover:scale-105 shadow-2xl'
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t('services.premium.luxCatamaran.hero.ctaButton')}
            <ArrowRight className='w-6 h-6' />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

// Catamaran Type Card Component
const CatamaranCard: React.FC<{
  catamaran: CatamaranType;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ catamaran, isSelected, onSelect }) => {
  const { t } = useTranslation();

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
            {t('services.premium.luxCatamaran.catamaranTypes.premium.badge')}
          </div>
        )}

        {catamaran.hasWaterSlide && (
          <div className='absolute top-4 left-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2'>
            <Waves className='w-4 h-4' />
            {t(
              'services.premium.luxCatamaran.catamaranTypes.premium.waterSlideBadge'
            )}
          </div>
        )}
      </div>

      <div className='absolute bottom-0 left-0 right-0 p-6 text-white'>
        <h3 className='text-2xl font-bold mb-2'>{catamaran.name}</h3>
        <div className='flex items-center justify-between mb-4'>
          <span className='text-3xl font-bold text-cyan-300'>
            ${catamaran.price}
            <span className='text-lg text-white/70'>
              {t('services.premium.luxCatamaran.catamaranTypes.perPerson')}
            </span>
          </span>
          <div className='flex items-center gap-2 text-white/80'>
            <Users className='w-4 h-4' />
            <span>
              {catamaran.capacity}{' '}
              {t('services.premium.luxCatamaran.catamaranTypes.guests')}
            </span>
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
          {catamaran.features.length > 3 && (
            <div className='text-sm text-cyan-300'>
              +{catamaran.features.length - 3}{' '}
              {t('services.premium.luxCatamaran.catamaranTypes.moreFeatures')}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Experience Gallery Component
const ExperienceGallery: React.FC = () => {
  const { t } = useTranslation();

  const experiences = [
    {
      image:
        'https://images.pexels.com/photos/4600762/pexels-photo-4600762.jpeg?_gl=1*mwst98*_ga*MTQzOTE0OTkxMS4xNzUzMjcxMDk0*_ga_8JE65Q40S6*czE3NTM3OTg1NjgkbzgkZzEkdDE3NTM3OTg1NzMkajU1JGwwJGgw',
      titleKey: 'crystalWaters',
      icon: Waves,
    },
    {
      image:
        'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?q=80&w=800',
      titleKey: 'snorkeling',
      icon: Fish,
    },
    {
      image:
        'https://www.puntacanabestexcursions.com//assets/Uploads/BEBE_CATAMARAN_22.jpeg',
      titleKey: 'waterSlide',
      icon: Waves,
    },
    {
      image:
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800',
      titleKey: 'dining',
      icon: Utensils,
    },
    {
      image:
        'https://images.pexels.com/photos/4319028/pexels-photo-4319028.jpeg?_gl=1*wp3wc8*_ga*MTQzOTE0OTkxMS4xNzUzMjcxMDk0*_ga_8JE65Q40S6*czE3NTM3OTg1NjgkbzgkZzEkdDE3NTM3OTg5MTYkajUwJGwwJGgw',
      titleKey: 'beach',
      icon: MapPin,
    },
    {
      image:
        'https://images.pexels.com/photos/5006967/pexels-photo-5006967.jpeg?_gl=1*dlck0v*_ga*MTQzOTE0OTkxMS4xNzUzMjcxMDk0*_ga_8JE65Q40S6*czE3NTM3OTg1NjgkbzgkZzEkdDE3NTM3OTg5NzgkajUxJGwwJGgw',
      titleKey: 'sunset',
      icon: Sun,
    },
  ];

  return (
    <section className='bg-white rounded-3xl p-2 shadow-xl'>
      <div className='text-center mb-12'>
        <h2 className='text-4xl font-bold text-slate-800 mb-4'>
          {t('services.premium.luxCatamaran.sections.experienceGallery.title')}
        </h2>
        <p className='text-xl text-slate-600'>
          {t(
            'services.premium.luxCatamaran.sections.experienceGallery.subtitle'
          )}
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {experiences.map((experience, index) => (
          <motion.div
            key={index}
            className='group relative overflow-hidden rounded-2xl h-64 shadow-lg'
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            whileHover={{ scale: 1.05 }}
          >
            <img
              src={experience.image}
              alt={t(
                `sservices.premium.luxCatamaran.sections.experienceGallery.experiences.${experience.titleKey}.title`
              )}
              className='w-full h-full object-cover transition-all duration-500 group-hover:scale-110'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300' />

            <div className='absolute top-4 left-4 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center'>
              <experience.icon className='w-6 h-6 text-white' />
            </div>

            <div className='absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300'>
              <h3 className='text-xl font-bold mb-2'>
                {t(
                  `services.premium.luxCatamaran.sections.experienceGallery.experiences.${experience.titleKey}.title`
                )}
              </h3>
              <p className='text-white/80 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                {t(
                  `services.premium.luxCatamaran.sections.experienceGallery.experiences.${experience.titleKey}.description`
                )}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

// Time Selection Component
const TimeSelection: React.FC<{ onSelect: (time: string) => void }> = ({
  onSelect,
}) => {
  const { t } = useTranslation();

  return (
    <section className='bg-white rounded-3xl p-4 shadow-xl'>
      <div className='text-center mb-12'>
        <h2 className='text-2xl md:text-4xl mt-5 font-bold text-slate-800 mb-4'>
          {t('services.premium.luxCatamaran.sections.chooseTime.title')}
        </h2>
        <p className='text-xl text-slate-600'>
          {t('services.premium.luxCatamaran.sections.chooseTime.subtitle')}
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto'>
        {timeSlots.map((slot, index) => (
          <motion.div
            key={slot.id}
            className={`relative overflow-hidden rounded-2xl p-8 cursor-pointer transition-all duration-300 hover:scale-105 ${
              slot.popular
                ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-2xl'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-800 shadow-lg'
            }`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.6 }}
            onClick={() => onSelect(slot.id)}
          >
            {slot.popular && (
              <div className='absolute top-0 right-0 bg-amber-500 text-white px-4 py-2 text-sm font-bold rounded-bl-2xl'>
                {t(
                  'services.premium.luxCatamaran.sections.chooseTime.mostPopular'
                )}
              </div>
            )}

            <div className='text-center'>
              <div
                className={`w-16 h-16 rounded-2xl ${
                  slot.popular ? 'bg-white/20' : 'bg-blue-100'
                } flex items-center justify-center mx-auto mb-6`}
              >
                <Clock
                  className={`w-8 h-8 ${
                    slot.popular ? 'text-white' : 'text-blue-600'
                  }`}
                />
              </div>

              <h3 className='text-2xl font-bold mb-2'>
                {slot.time} - {slot.endTime}
              </h3>
              <p
                className={`text-lg mb-6 ${
                  slot.popular ? 'text-blue-100' : 'text-slate-600'
                }`}
              >
                {t(
                  `services.premium.luxCatamaran.timeSlots.${slot.labelKey}.label`
                )}
              </p>

              <button
                className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                  slot.popular
                    ? 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {t(
                  'services.premium.luxCatamaran.sections.chooseTime.selectButton'
                )}{' '}
                {slot.time}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

// Main Component
const LuxCatamaranServiceView: React.FC<CatamaranServiceViewProps> = ({
  service,
}) => {
  const { bookService } = useBooking();
  const { t } = useTranslation();
  const [selectedCatamaran, setSelectedCatamaran] = useState<string>('classic');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Catamaran types with translations
  const catamaranTypes: CatamaranType[] = [
    {
      id: 'classic',
      name: t('services.premium.luxCatamaran.catamaranTypes.classic.name'),
      price: 89,
      image:
        'https://res.cloudinary.com/michaelxk-com/image/upload/v1625794349/nuestra%20flota/lagoon%2042/1_uspfu7.jpg',
      features: [
        t(
          'services.premium.luxCatamaran.catamaranTypes.classic.features.openBar'
        ),
        t(
          'services.premium.luxCatamaran.catamaranTypes.classic.features.gourmetBuffet'
        ),
        t(
          'services.premium.luxCatamaran.catamaranTypes.classic.features.snorkelingEquipment'
        ),
        t(
          'services.premium.luxCatamaran.catamaranTypes.classic.features.professionalCrew'
        ),
      ],
      capacity: 40,
      hasWaterSlide: false,
      premium: false,
    },
    {
      id: 'premium-slide',
      name: t('services.premium.luxCatamaran.catamaranTypes.premium.name'),
      price: 129,
      image:
        'https://www.whitesandwatersports.com/assets/images/2020-09-02-11-41-55-IMG0606.JPG',
      features: [
        t(
          'services.premium.luxCatamaran.catamaranTypes.premium.features.allClassic'
        ),
        t(
          'services.premium.luxCatamaran.catamaranTypes.premium.features.waterSlide'
        ),
        t(
          'services.premium.luxCatamaran.catamaranTypes.premium.features.premiumBar'
        ),
        t(
          'services.premium.luxCatamaran.catamaranTypes.premium.features.vipService'
        ),
        t(
          'services.premium.luxCatamaran.catamaranTypes.premium.features.photoPackage'
        ),
      ],
      capacity: 30,
      hasWaterSlide: true,
      premium: true,
    },
  ];

  const selectedCatamaranData = catamaranTypes.find(
    (c) => c.id === selectedCatamaran
  );

  const handleBookNow = () => {
    setIsModalOpen(true);
  };

  const handleBookingConfirm = (
    service: Service,
    dates: BookingDate,
    guests: number
  ) => {
    bookService(service, dates, guests);
    setIsModalOpen(false);
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50'>
      <HeroSection
        currentImage={currentImageIndex}
        onImageChange={setCurrentImageIndex}
        onBookClick={handleBookNow}
      />

      <div className='max-w-7xl mx-auto px-2 py-10 space-y-16'>
        {/* Catamaran Selection */}
        <section className='bg-white rounded-3xl p-2 shadow-xl'>
          <div className='text-center mb-12'>
            <h2 className='text-2xl md:text-4xl font-bold text-slate-800 mb-4'>
              {t(
                'services.premium.luxCatamaran.sections.chooseAdventure.title'
              )}
            </h2>
            <p className='text-xl-1 text-xl text-slate-600'>
              {t(
                'services.premium.luxCatamaran.sections.chooseAdventure.subtitle'
              )}
            </p>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            {catamaranTypes.map((catamaran) => (
              <CatamaranCard
                key={catamaran.id}
                catamaran={catamaran}
                isSelected={selectedCatamaran === catamaran.id}
                onSelect={() => setSelectedCatamaran(catamaran.id)}
              />
            ))}
          </div>
        </section>

        {/* Selected Catamaran Details */}
        {selectedCatamaranData && (
          <motion.section
            layout
            className='bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl p-10 text-white shadow-2xl'
          >
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
              <div>
                <h3 className='text-3xl font-bold mb-6'>
                  {selectedCatamaranData.name}
                </h3>
                <p className='text-xl text-blue-100 mb-8 leading-relaxed'>
                  {selectedCatamaranData.hasWaterSlide
                    ? t(
                        'services.premium.luxCatamaran.details.premiumDescription'
                      )
                    : t(
                        'services.premium.luxCatamaran.details.classicDescription'
                      )}
                </p>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-8'>
                  {selectedCatamaranData.features.map((feature, index) => (
                    <div key={index} className='flex items-center gap-3'>
                      <div className='w-6 h-6 bg-white/20 rounded-full flex items-center justify-center'>
                        <Check className='w-4 h-4 text-white' />
                      </div>
                      <span className='text-blue-100'>{feature}</span>
                    </div>
                  ))}
                </div>

                <div className='flex items-center gap-8 mb-8'>
                  <div className='text-center'>
                    <div className='text-3xl font-bold'>
                      ${selectedCatamaranData.price}
                    </div>
                    <div className='text-blue-200'>
                      {t('services.premium.luxCatamaran.details.perPerson')}
                    </div>
                  </div>
                  <div className='text-center'>
                    <div className='text-3xl font-bold'>
                      {selectedCatamaranData.capacity}
                    </div>
                    <div className='text-blue-200'>
                      {t('services.premium.luxCatamaran.details.maxGuests')}
                    </div>
                  </div>
                  <div className='text-center'>
                    <div className='text-3xl font-bold'>4-6</div>
                    <div className='text-blue-200'>
                      {t('services.premium.luxCatamaran.details.hours')}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleBookNow}
                  className='bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-2xl font-bold text-lg flex items-center gap-3 transition-all duration-300 hover:scale-105 shadow-lg'
                >
                  <Calendar className='w-5 h-5' />
                  {t('services.premium.luxCatamaran.details.bookButton')}
                </button>
              </div>

              <div className='relative h-96 rounded-2xl overflow-hidden shadow-2xl'>
                <img
                  src={selectedCatamaranData.image}
                  alt={selectedCatamaranData.name}
                  className='w-full h-full object-cover'
                />
              </div>
            </div>
          </motion.section>
        )}

        <TimeSelection onSelect={handleBookNow} />
        <ExperienceGallery />

        {/* Call to Action */}
        <section className='relative overflow-hidden rounded-3xl h-96 shadow-2xl'>
          <img
            src='https://images.pexels.com/photos/5006967/pexels-photo-5006967.jpeg?_gl=1*dlck0v*_ga*MTQzOTE0OTkxMS4xNzUzMjcxMDk0*_ga_8JE65Q40S6*czE3NTM3OTg1NjgkbzgkZzEkdDE3NTM3OTg5NzgkajUxJGwwJGgw'
            alt='Sunset catamaran'
            className='w-full h-full object-cover'
          />
          <div className='absolute inset-0 bg-gradient-to-r from-slate-900/80 to-blue-900/60' />

          <div className='absolute inset-0 flex items-center justify-center text-center text-white py-5'>
            <div className='max-w-3xl'>
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className='text-3xl md:text-4xl font-bold mb-6 p-2'
              >
                {t('services.premium.luxCatamaran.cta.title')}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className='text-xl-1 px-2 md:text-4xl text-white/90 mb-8'
              >
                {t('services.premium.luxCatamaran.cta.subtitle')}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className='flex flex-col sm:flex-row gap-4 justify-center items-center'
              >
                <button
                  onClick={handleBookNow}
                  className='bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-10 py-5 rounded-2xl font-bold text-xl flex items-center gap-4 transition-all duration-300 hover:scale-105 shadow-2xl'
                >
                  <Anchor className='w-6 h-6' />
                  {t('services.premium.luxCatamaran.cta.bookButton')}
                </button>
                <div className='text-white/80 text-sm'>
                  {t('services.premium.luxCatamaran.cta.guarantee')}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Important Notice */}
        <motion.div
          className='bg-amber-50 border-l-4 border-amber-400 rounded-2xl p-8'
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className='flex items-start'>
            <div className='w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center mr-4 flex-shrink-0'>
              <AlertCircle className='w-5 h-5 text-amber-600' />
            </div>
            <div>
              <h3 className='font-bold text-amber-800 mb-3 text-lg'>
                {t('services.premium.luxCatamaran.importantInfo.title')}
              </h3>
              <div className='text-amber-700 leading-relaxed space-y-2'>
                <p>
                  •{' '}
                  {t(
                    'services.premium.luxCatamaran.importantInfo.points.weather'
                  )}
                </p>
                <p>
                  •{' '}
                  {t(
                    'services.premium.luxCatamaran.importantInfo.points.booking'
                  )}
                </p>
                <p>
                  •{' '}
                  {t(
                    'services.premium.luxCatamaran.importantInfo.points.refund'
                  )}
                </p>
                <p>
                  •{' '}
                  {t(
                    'services.premium.luxCatamaran.importantInfo.points.safety'
                  )}
                </p>
                <p>
                  •{' '}
                  {t(
                    'services.premium.luxCatamaran.importantInfo.points.ageLimit'
                  )}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {isModalOpen && (
        <BookingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleBookingConfirm}
          service={service}
        />
      )}
    </div>
  );
};

export default LuxCatamaranServiceView;
