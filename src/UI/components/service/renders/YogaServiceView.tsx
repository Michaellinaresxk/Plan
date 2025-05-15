import React, { useState } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { Service } from '@/types/type';
import { ServiceData } from '@/types/services';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useBooking } from '@/context/BookingContext';
import { BookingDate } from '@/types/type';
import BookingModal from '../../modal/BookingModal';
import {
  User,
  MapPin,
  Leaf,
  Shield,
  Clock,
  CalendarDays,
  Heart,
  Award,
  Sparkles,
  Star,
  ArrowRight,
  Instagram,
} from 'lucide-react';

interface YogaServiceViewProps {
  service: Service;
  serviceData?: ServiceData;
  primaryColor: string;
  viewContext?: 'standard-view' | 'premium-view';
}

const YogaServiceView: React.FC<YogaServiceViewProps> = ({
  service,
  serviceData,
  viewContext,
}) => {
  const { t } = useTranslation();
  const { bookService } = useBooking();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isPremium =
    service.packageType.includes('premium') || viewContext === 'premium-view';

  // Extracting data specific to yoga and massage
  const yogaStyles = serviceData?.metaData?.yogaStyles || [
    'Hatha',
    'Vinyasa',
    'Restorative',
    'Meditation',
    'Yin',
  ];
  const equipmentIncluded = serviceData?.metaData?.equipmentProvided !== false;
  const experienceLevels = extractExperienceLevels(serviceData) || [
    'beginner',
    'intermediate',
    'advanced',
  ];

  // Extracting locations
  const locations = serviceData?.options?.location?.subOptions || {};

  // Gallery images - In a real app these would come from your serviceData
  const galleryImages = [
    {
      src: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?auto=format&fit=crop&w=800&q=80',
      alt: 'Luxury yoga session by the beach',
      caption: 'Tranquil beach yoga retreat',
    },
    {
      src: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=800&q=80',
      alt: 'Yoga meditation in luxury setting',
      caption: 'Mindful meditation sessions',
    },
    {
      src: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
      alt: 'Luxury yoga equipment',
      caption: 'Premium equipment provided',
    },
  ];

  // Testimonials
  const testimonials = [
    {
      text: "The most transformative yoga experience I've ever had. The instructor was phenomenal and the setting was perfect.",
      author: 'Emily T.',
      rating: 5,
    },
    {
      text: 'A perfect blend of relaxation and challenge. I left feeling both rejuvenated and accomplished.',
      author: 'Michael L.',
      rating: 5,
    },
    {
      text: "I've practiced yoga for years, but this elevated experience was truly worth every penny.",
      author: 'Sophie K.',
      rating: 5,
    },
  ];

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className='space-y-12'>
      {/* Hero Section with Tagline */}
      <motion.div
        className={`relative overflow-hidden rounded-2xl ${
          isPremium
            ? 'bg-gradient-to-r from-amber-900/90 to-amber-700/80'
            : 'bg-gradient-to-r from-blue-900/90 to-blue-700/80'
        }`}
        initial='hidden'
        animate='visible'
        variants={fadeIn}
      >
        <div className='absolute inset-0 -z-10'>
          <Image
            src='https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1000'
            alt='Yoga background'
            fill
            className='object-cover opacity-30'
          />
        </div>

        <div className='p-10 md:p-16 text-white'>
          <div className='flex items-center mb-4'>
            {isPremium ? (
              <div className='flex items-center bg-amber-500/20 backdrop-blur-sm px-3 py-1 rounded-full border border-amber-500/40'>
                <Sparkles className='h-4 w-4 text-amber-300 mr-2' />
                <span className='text-xs font-semibold uppercase tracking-wider text-amber-100'>
                  Premium Experience
                </span>
              </div>
            ) : (
              <div className='flex items-center bg-blue-500/20 backdrop-blur-sm px-3 py-1 rounded-full border border-blue-500/40'>
                <Leaf className='h-4 w-4 text-blue-300 mr-2' />
                <span className='text-xs font-semibold uppercase tracking-wider text-blue-100'>
                  Signature Experience
                </span>
              </div>
            )}
          </div>
          <h1 className='text-3xl md:text-5xl font-bold mb-4 leading-tight'>
            {isPremium
              ? 'Transcendent Luxury Yoga & Massage'
              : 'Restore Body & Mind Through Yoga'}
          </h1>
          <h2 className='text-xl md:text-2xl opacity-90 mb-8 max-w-3xl font-light'>
            {isPremium
              ? 'A personalized sanctuary where ancient wellness traditions meet modern luxury'
              : 'Expert-led sessions tailored to your needs in the comfort of your space'}
          </h2>

          <div className='flex flex-wrap items-center gap-4 text-sm'>
            <div className='flex items-center'>
              <Clock className='h-5 w-5 mr-2 opacity-80' />
              <span>
                {service.duration} hour{' '}
                {service.duration > 1 ? 'sessions' : 'session'}
              </span>
            </div>
            <div className='flex items-center'>
              <CalendarDays className='h-5 w-5 mr-2 opacity-80' />
              <span>Flexible scheduling</span>
            </div>
            <div className='flex items-center'>
              <MapPin className='h-5 w-5 mr-2 opacity-80' />
              <span>In-villa or beachside</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Description with image */}
      <motion.div
        className='grid grid-cols-1 md:grid-cols-2 gap-8 items-center'
        initial='hidden'
        animate='visible'
        variants={fadeIn}
      >
        <div className='relative h-[400px] rounded-2xl overflow-hidden'>
          <Image
            src={
              isPremium
                ? 'https://images.unsplash.com/photo-1591228127791-8e2eaef098d3?auto=format&fit=crop&q=80&w=800'
                : 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?auto=format&fit=crop&q=80&w=800'
            }
            alt='Yoga instructor demonstrating pose'
            fill
            className='object-cover'
          />
          <div
            className={`absolute bottom-0 left-0 right-0 p-4 ${
              isPremium
                ? 'bg-gradient-to-t from-black/80 to-transparent'
                : 'bg-gradient-to-t from-black/70 to-transparent'
            }`}
          >
            <p className='text-white text-sm md:text-base'>
              {isPremium
                ? 'Certified master instructors with 10+ years experience'
                : 'Expert instructors guiding you through each pose'}
            </p>
          </div>
        </div>

        <div>
          <h2
            className={`text-2xl md:text-3xl font-bold mb-6 ${
              isPremium ? 'text-amber-800' : 'text-blue-800'
            }`}
          >
            {serviceData?.titleKey
              ? t(serviceData.titleKey)
              : isPremium
              ? 'Transformative Wellness Journey'
              : 'Your Personal Yoga Experience'}
          </h2>
          <div className='prose max-w-none text-gray-700'>
            <p className='text-lg mb-4'>
              {serviceData?.descriptionKey
                ? t(serviceData.descriptionKey)
                : isPremium
                ? 'Our premium yoga and massage service combines ancient techniques with modern luxury, tailored specifically to your needs and goals. We bring the full spa experience to your private space.'
                : 'Our personalized yoga sessions are designed to bring balance, strength, and peace to your body and mind, all in the comfort of your preferred setting.'}
            </p>
            {serviceData?.fullDescriptionKey && (
              <p className='mb-4'>{t(serviceData.fullDescriptionKey)}</p>
            )}
            <p>
              {isPremium
                ? 'Each session begins with a consultation to understand your specific needs, followed by a fully customized experience that combines breath work, movement, and mindfulness practices.'
                : 'Our approach focuses on proper alignment, breath control, and mindfulness to ensure you receive maximum benefits from each session.'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Gallery Section */}
      <motion.div
        className='bg-white rounded-2xl shadow-xl overflow-hidden'
        initial='hidden'
        animate='visible'
        variants={fadeIn}
      >
        <div className='p-8'>
          <h2
            className={`text-2xl font-bold mb-6 ${
              isPremium ? 'text-amber-800' : 'text-blue-800'
            } flex items-center`}
          >
            <Instagram className='mr-3' size={24} />
            Experience Gallery
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {galleryImages.map((image, index) => (
              <div
                key={index}
                className='relative h-64 rounded-xl overflow-hidden group'
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className='object-cover transition-transform duration-500 group-hover:scale-110'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end'>
                  <p className='p-4 text-white text-sm'>{image.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Yoga Styles */}
      {yogaStyles.length > 0 && (
        <motion.div
          className='bg-white rounded-2xl shadow-xl overflow-hidden'
          initial='hidden'
          animate='visible'
          variants={fadeIn}
        >
          <div className='p-8'>
            <h2
              className={`text-2xl font-bold mb-6 ${
                isPremium ? 'text-amber-800' : 'text-blue-800'
              } flex items-center`}
            >
              <Leaf className='mr-3' size={24} />
              {t('yogaDetails.availableStyles')}
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              {yogaStyles.map((style: string, index: number) => (
                <div
                  key={index}
                  className={`relative rounded-xl overflow-hidden group h-32 flex items-center justify-center ${
                    isPremium
                      ? 'bg-gradient-to-br from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200'
                      : 'bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200'
                  } transition-all duration-300`}
                >
                  <div
                    className={`absolute top-3 left-3 h-8 w-8 rounded-full ${
                      isPremium ? 'bg-amber-100' : 'bg-blue-100'
                    } flex items-center justify-center`}
                  >
                    <Leaf
                      className={`h-4 w-4 ${
                        isPremium ? 'text-amber-600' : 'text-blue-600'
                      }`}
                    />
                  </div>
                  <h3
                    className={`text-xl font-medium ${
                      isPremium ? 'text-amber-800' : 'text-blue-800'
                    } capitalize`}
                  >
                    {style}
                  </h3>
                  <div className='absolute inset-0 border-2 border-transparent group-hover:border-amber-200 rounded-xl transition-all duration-300'></div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Experience Levels and Locations */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        {/* Experience Levels */}
        {experienceLevels.length > 0 && (
          <motion.div
            className='bg-white rounded-2xl shadow-xl overflow-hidden'
            initial='hidden'
            animate='visible'
            variants={fadeIn}
          >
            <div className='p-8'>
              <h2
                className={`text-2xl font-bold mb-6 ${
                  isPremium ? 'text-amber-800' : 'text-blue-800'
                } flex items-center`}
              >
                <User className='mr-3' size={24} />
                {t('yogaDetails.experienceLevels')}
              </h2>
              <div className='space-y-4'>
                {experienceLevels.map((level: string, index: number) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg ${
                      isPremium ? 'bg-amber-50' : 'bg-blue-50'
                    } flex items-start`}
                  >
                    <div
                      className={`h-8 w-8 rounded-full ${
                        isPremium
                          ? 'bg-amber-100 text-amber-600'
                          : 'bg-blue-100 text-blue-600'
                      } flex-shrink-0 flex items-center justify-center mr-4`}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <h3
                        className={`font-medium ${
                          isPremium ? 'text-amber-800' : 'text-blue-800'
                        } capitalize mb-1`}
                      >
                        {level.trim()}
                      </h3>
                      <p className='text-gray-600 text-sm'>
                        {getLevelDescription(level)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Locations */}
        <motion.div
          className='bg-white rounded-2xl shadow-xl overflow-hidden'
          initial='hidden'
          animate='visible'
          variants={fadeIn}
        >
          <div className='p-8'>
            <h2
              className={`text-2xl font-bold mb-6 ${
                isPremium ? 'text-amber-800' : 'text-blue-800'
              } flex items-center`}
            >
              <MapPin className='mr-3' size={24} />
              {t('yogaDetails.locations')}
            </h2>

            <div className='space-y-4'>
              {Object.keys(locations).length > 0
                ? Object.entries(locations).map(([key, location]) => (
                    <div
                      key={key}
                      className={`p-4 rounded-lg ${
                        isPremium ? 'bg-amber-50' : 'bg-blue-50'
                      } flex items-start`}
                    >
                      <div
                        className={`h-8 w-8 rounded-full ${
                          isPremium
                            ? 'bg-amber-100 text-amber-600'
                            : 'bg-blue-100 text-blue-600'
                        } flex-shrink-0 flex items-center justify-center mr-4`}
                      >
                        <MapPin className='h-4 w-4' />
                      </div>
                      <div>
                        <h3
                          className={`font-medium ${
                            isPremium ? 'text-amber-800' : 'text-blue-800'
                          } capitalize mb-1`}
                        >
                          {typeof location === 'object' && 'nameKey' in location
                            ? t(location.nameKey, {
                                fallback: formatLocationName(key),
                              })
                            : formatLocationName(key)}
                        </h3>
                        <p className='text-gray-600 text-sm'>
                          {getLocationDescription(key)}
                        </p>
                        {typeof location === 'object' &&
                          'price' in location &&
                          location.price !== 0 && (
                            <p
                              className={`text-sm mt-1 font-medium ${
                                Number(location.price) > 0
                                  ? 'text-amber-600'
                                  : 'text-green-600'
                              }`}
                            >
                              {location.price > 0
                                ? `+$${location.price}`
                                : `-$${Math.abs(Number(location.price))}`}
                            </p>
                          )}
                      </div>
                    </div>
                  ))
                : // Default locations if none provided in data
                  ['beach', 'pool', 'garden', 'indoor'].map(
                    (location, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg ${
                          isPremium ? 'bg-amber-50' : 'bg-blue-50'
                        } flex items-start`}
                      >
                        <div
                          className={`h-8 w-8 rounded-full ${
                            isPremium
                              ? 'bg-amber-100 text-amber-600'
                              : 'bg-blue-100 text-blue-600'
                          } flex-shrink-0 flex items-center justify-center mr-4`}
                        >
                          <MapPin className='h-4 w-4' />
                        </div>
                        <div>
                          <h3
                            className={`font-medium ${
                              isPremium ? 'text-amber-800' : 'text-blue-800'
                            } capitalize mb-1`}
                          >
                            {formatLocationName(location)}
                          </h3>
                          <p className='text-gray-600 text-sm'>
                            {getLocationDescription(location)}
                          </p>
                        </div>
                      </div>
                    )
                  )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Equipment and Benefits */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        {/* Equipment Section */}
        <motion.div
          className='bg-white rounded-2xl shadow-xl overflow-hidden'
          initial='hidden'
          animate='visible'
          variants={fadeIn}
        >
          <div className='p-8'>
            <h2
              className={`text-2xl font-bold mb-6 ${
                isPremium ? 'text-amber-800' : 'text-blue-800'
              } flex items-center`}
            >
              <Shield className='mr-3' size={24} />
              {t('yogaDetails.equipment')}
            </h2>
            <div className='relative overflow-hidden rounded-lg aspect-video mb-6'>
              <Image
                src={
                  isPremium
                    ? 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&q=80&w=800'
                    : 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=800'
                }
                alt='Yoga equipment'
                fill
                className='object-cover'
              />
            </div>
            <div className='bg-gray-50 p-4 rounded-lg'>
              <h3 className='font-medium text-gray-800 mb-2'>
                {equipmentIncluded
                  ? 'All equipment provided for your comfort'
                  : 'What to bring'}
              </h3>
              <p className='text-gray-700'>
                {equipmentIncluded
                  ? isPremium
                    ? 'We provide premium eco-friendly mats, blocks, straps, blankets, and essential oils to enhance your practice. All equipment is sanitized between uses.'
                    : 'We provide all necessary equipment including mats, blocks, and straps. Everything is sanitized and ready for your session.'
                  : 'Please bring your own yoga mat. We will provide other accessories as needed.'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Benefits Section */}
        <motion.div
          className='bg-white rounded-2xl shadow-xl overflow-hidden'
          initial='hidden'
          animate='visible'
          variants={fadeIn}
        >
          <div className='p-8'>
            <h2
              className={`text-2xl font-bold mb-6 ${
                isPremium ? 'text-amber-800' : 'text-blue-800'
              } flex items-center`}
            >
              <Heart className='mr-3' size={24} />
              {t('yogaDetails.benefits')}
            </h2>
            <div className='space-y-4'>
              {[
                { key: 'yogaDetails.benefitFlexibility', icon: <Leaf /> },
                { key: 'yogaDetails.benefitStrength', icon: <Award /> },
                { key: 'yogaDetails.benefitMindfulness', icon: <Heart /> },
                { key: 'yogaDetails.benefitStress', icon: <Shield /> },
              ].map((benefit, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${
                    isPremium ? 'bg-amber-50' : 'bg-blue-50'
                  } flex items-start`}
                >
                  <div
                    className={`h-8 w-8 rounded-full ${
                      isPremium
                        ? 'bg-amber-100 text-amber-600'
                        : 'bg-blue-100 text-blue-600'
                    } flex-shrink-0 flex items-center justify-center mr-4`}
                  >
                    {benefit.icon}
                  </div>
                  <div>
                    <p className='text-gray-700'>
                      {t(benefit.key, {
                        fallback: getBenefitFallback(index),
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Testimonials Section */}
      <motion.div
        className={`rounded-2xl overflow-hidden ${
          isPremium ? 'bg-amber-50' : 'bg-blue-50'
        }`}
        initial='hidden'
        animate='visible'
        variants={fadeIn}
      >
        <div className='p-8'>
          <h2
            className={`text-2xl font-bold mb-6 ${
              isPremium ? 'text-amber-800' : 'text-blue-800'
            } flex items-center`}
          >
            <Star className='mr-3' size={24} />
            Client Experiences
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {testimonials.map((testimonial, index) => (
              <div key={index} className='bg-white p-6 rounded-xl shadow-sm'>
                <div className='flex mb-4'>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={`${
                        isPremium
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-blue-400 fill-blue-400'
                      } mr-1`}
                    />
                  ))}
                </div>
                <p className='italic text-gray-700 mb-4'>
                  "{testimonial.text}"
                </p>
                <p className='text-sm font-medium text-gray-900'>
                  {testimonial.author}
                </p>
              </div>
            ))}
          </div>

          {/* Modal de reserva */}
          {isModalOpen && (
            <BookingModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              // onConfirm={handleBookingConfirm}
              service={service}
            />
          )}
        </div>
      </motion.div>

      {/* Call-to-Action Section */}
      <motion.div
        className={`rounded-2xl overflow-hidden ${
          isPremium
            ? 'bg-gradient-to-r from-amber-600 to-amber-800'
            : 'bg-gradient-to-r from-blue-600 to-blue-800'
        }`}
        initial='hidden'
        animate='visible'
        variants={fadeIn}
      >
        <div className='p-10 md:p-16 text-white text-center'>
          <h2 className='text-3xl md:text-4xl font-bold mb-4'>
            Ready to Transform Your Experience?
          </h2>
          <p className='text-xl opacity-90 mb-8 max-w-2xl mx-auto'>
            {isPremium
              ? 'Book your premium session today and embark on a journey of luxury wellness'
              : 'Schedule your personal yoga session and start your journey to balance and wellness'}
          </p>
          <button
            onClick={() => {
              setIsModalOpen(true);
              bookService({
                service,
                bookingDate: {} as BookingDate,
                isPremium,
              });
            }}
            className={`py-3 px-8 rounded-full bg-white flex items-center mx-auto font-medium ${
              isPremium ? 'text-amber-700' : 'text-blue-700'
            }`}
          >
            Book Now
            <ArrowRight className='ml-2 h-5 w-5' />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// Helper function to extract experience levels
const extractExperienceLevels = (serviceData?: ServiceData): string[] => {
  if (!serviceData?.metaData?.experienceLevel) return [];
  return serviceData.metaData.experienceLevel.toString().split(',');
};

// Helper function to format location names
const formatLocationName = (name: string): string => {
  return name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' ');
};

// Helper functions for descriptive text
const getLevelDescription = (level: string): string => {
  switch (level.trim().toLowerCase()) {
    case 'beginner':
      return 'Perfect for those new to yoga or returning after a break. Focus on fundamentals and gentle postures.';
    case 'intermediate':
      return 'For practitioners with a steady practice. More challenging postures and deeper exploration.';
    case 'advanced':
      return 'For experienced yogis looking to refine their practice with complex postures and deeper insights.';
    default:
      return 'Personalized session adapted to your current experience level.';
  }
};

const getLocationDescription = (location: string): string => {
  switch (location.toLowerCase()) {
    case 'beach':
      return 'Practice with the rhythm of the waves and the gentle sea breeze for a truly immersive experience.';
    case 'pool':
      return 'A serene poolside setting offering a peaceful practice with water elements.';
    case 'indoor':
    case 'indoors':
      return 'A climate-controlled environment for maximum comfort and focus during your practice.';
    case 'garden':
      return 'Connect with nature in a lush garden setting, surrounded by tropical plants and flowers.';
    default:
      return 'A beautiful setting carefully selected to enhance your practice.';
  }
};

const getBenefitFallback = (index: number): string => {
  const benefits = [
    'Improve flexibility and range of motion through carefully sequenced postures',
    'Build functional strength and muscle tone while enhancing overall stability',
    'Develop mindfulness and mental clarity through focused breathing techniques',
    'Reduce stress and anxiety while promoting deeper relaxation and better sleep',
  ];
  return benefits[index % benefits.length];
};

export default YogaServiceView;
