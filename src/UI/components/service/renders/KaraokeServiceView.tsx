// views/KaraokeServiceView.tsx

import React, { useState } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { Service } from '@/types/type';
import { ServiceData } from '@/types/services';
import Image from 'next/image';
import {
  Music,
  Mic,
  Speaker,
  Clock,
  Users,
  Monitor,
  Sparkles,
  Heart,
  Check,
  AlertCircle,
  PartyPopper,
  Star,
  ArrowRight,
  Play,
  ChevronRight,
  ChevronLeft,
  Info,
  MessageCircle,
  HelpCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useBooking } from '@/context/BookingContext';
import { formatSetupName, getSetupFeatures } from '@/utils/KaraokeUtils';
import { GalleryModal, VideoModal } from '../../modal/GalleryModal';

interface KaraokeServiceViewProps {
  service: Service;
  serviceData?: ServiceData;
  primaryColor: string;
}

const KaraokeServiceView: React.FC<KaraokeServiceViewProps> = ({
  service,
  serviceData,
  primaryColor,
}) => {
  const { t } = useTranslation();
  const { addService, selectedServices } = useBooking();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Check if service is already selected in the booking context
  const isSelected = selectedServices.some((s) => s.id === service.id);

  // Extract setup options if they exist
  let setupOptions: Record<string, any> = {};
  if (serviceData?.options?.setupType?.subOptions) {
    setupOptions = serviceData.options.setupType.subOptions;
  }

  // Extract host options if they exist
  let hostOptions: Record<string, any> = {};
  if (serviceData?.options?.hostIncluded?.subOptions) {
    hostOptions = serviceData.options.hostIncluded.subOptions;
  }

  // Determine if there's a disclaimer
  const disclaimer = serviceData?.disclaimer ? t(serviceData.disclaimer) : '';

  // Extract time slots if available
  let timeSlots: string[] = [];
  if (serviceData?.metaData?.timeSlots) {
    const timeSlotsStr = serviceData.metaData.timeSlots.toString();
    timeSlots = Array.isArray(serviceData.metaData.timeSlots)
      ? serviceData.metaData.timeSlots
      : timeSlotsStr.split(',');
  }

  // Fallback to karaoke-specific time slots if none found in metadata
  if (timeSlots.length === 0) {
    timeSlots = [
      'Evening Sessions (6PM-10PM)',
      'Family-Friendly Sessions',
      'Special Occasion Parties',
      'Theme Nights',
    ];
  }

  // Extract song count
  const songCount = serviceData?.metaData?.songsAvailable || 5000;

  // Extract language options
  let languageOptions: string[] = [];
  if (serviceData?.metaData?.languages) {
    const languagesStr = serviceData.metaData.languages.toString();
    languageOptions = languagesStr
      .split(',')
      .map(
        (lang) => lang.trim().charAt(0).toUpperCase() + lang.trim().slice(1)
      );
  } else {
    languageOptions = ['English', 'Spanish'];
  }

  // Extract equipment included
  let equipmentIncluded: string[] = [];
  if (serviceData?.metaData?.equipmentIncluded) {
    const equipmentStr = serviceData.metaData.equipmentIncluded.toString();
    equipmentIncluded = equipmentStr.split(',').map((item) => item.trim());
  } else {
    equipmentIncluded = ['Microphones', 'Speakers', 'Screen', 'Karaoke System'];
  }

  // Song genres - this could come from metadata in the future
  const songGenres = [
    'Pop Hits',
    'Rock Classics',
    'Latin Favorites',
    'R&B/Hip-Hop',
    'Country',
    'Dance/Electronic',
    'Disney Classics',
    'Top 40 Hits',
  ];

  // Gallery images for karaoke service
  const galleryImages = [
    {
      src: 'https://images.pexels.com/photos/2531728/pexels-photo-2531728.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      alt: 'Friends enjoying karaoke night',
      caption: 'Create memories with friends at your private karaoke party',
    },
    {
      src: 'https://images.pexels.com/photos/7097462/pexels-photo-7097462.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      alt: 'Professional karaoke setup',
      caption: 'Top-quality equipment for an authentic experience',
    },
    {
      src: 'https://images.pexels.com/photos/1154189/pexels-photo-1154189.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      alt: 'Family karaoke fun',
      caption: 'Perfect for family gatherings and celebrations',
    },
    {
      src: 'https://images.pexels.com/photos/5257587/pexels-photo-5257587.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      alt: 'Party atmosphere with karaoke setup',
      caption: 'Create the perfect party atmosphere in your villa',
    },
    {
      src: 'https://images.pexels.com/photos/2034851/pexels-photo-2034851.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      alt: 'Microphone close-up',
      caption: 'Professional equipment for the best sound quality',
    },
  ];

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  // Function to navigate through gallery images
  const navigateGallery = (direction: number) => {
    const newIndex = currentImageIndex + direction;
    if (newIndex >= 0 && newIndex < galleryImages.length) {
      setCurrentImageIndex(newIndex);
    }
  };

  // Function to handle booking button click
  const handleBookNow = () => {
    addService(service);
  };

  return (
    <div className='space-y-8'>
      {/* Hero Section with Media Gallery */}
      <motion.div
        className='bg-white rounded-xl shadow-xl overflow-hidden'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className='relative'>
          {/* Image Gallery */}
          <div className='relative h-80 md:h-96 lg:h-[450px] overflow-hidden group'>
            <Image
              src={galleryImages[currentImageIndex].src}
              alt={galleryImages[currentImageIndex].alt}
              fill
              className='object-cover transition-transform duration-700 group-hover:scale-105'
            />

            <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent'></div>

            {/* Gallery Navigation */}
            <div className='absolute inset-0 flex items-center justify-between px-4'>
              <button
                onClick={() => navigateGallery(-1)}
                disabled={currentImageIndex === 0}
                className={`h-12 w-12 rounded-full flex items-center justify-center ${
                  currentImageIndex === 0
                    ? 'bg-gray-700/30 text-gray-400'
                    : 'bg-black/50 text-white hover:bg-white hover:text-black'
                } transition-all duration-300`}
              >
                <ChevronLeft className='h-6 w-6' />
              </button>

              <button
                onClick={() => setIsVideoModalOpen(true)}
                className='h-16 w-16 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300'
              >
                <Play className='h-8 w-8' />
              </button>

              <button
                onClick={() => navigateGallery(1)}
                disabled={currentImageIndex === galleryImages.length - 1}
                className={`h-12 w-12 rounded-full flex items-center justify-center ${
                  currentImageIndex === galleryImages.length - 1
                    ? 'bg-gray-700/30 text-gray-400'
                    : 'bg-black/50 text-white hover:bg-white hover:text-black'
                } transition-all duration-300`}
              >
                <ChevronRight className='h-6 w-6' />
              </button>
            </div>

            {/* Gallery Control Indicators */}
            <div className='absolute bottom-4 inset-x-0 flex justify-center space-x-2'>
              {galleryImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`h-2 w-10 rounded-full transition-all duration-300 ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/30'
                  }`}
                ></button>
              ))}
            </div>

            {/* View Gallery Button */}
            <button
              onClick={() => setIsGalleryOpen(true)}
              className='absolute bottom-4 right-4 px-4 py-2 rounded-lg bg-black/50 hover:bg-black/70 text-white text-sm font-medium backdrop-blur-sm flex items-center gap-2 transition-all duration-300'
            >
              <span>View Gallery</span>
              <ArrowRight className='h-4 w-4' />
            </button>

            {/* Image Caption */}
            <div className='absolute bottom-14 left-4 max-w-md'>
              <p className='text-white text-sm md:text-base font-medium drop-shadow-md'>
                {galleryImages[currentImageIndex].caption}
              </p>
            </div>
          </div>

          {/* Booking CTA Bar */}
          <div
            className={`px-6 py-4 bg-gradient-to-r from-${primaryColor}-600 to-${primaryColor}-500 flex flex-col md:flex-row items-center justify-between`}
          >
            {/* Price and Description */}
            <div className='flex items-center mb-4 md:mb-0'>
              <div
                className={`h-12 w-12 rounded-full bg-${primaryColor}-700 flex items-center justify-center mr-4 text-white`}
              >
                <PartyPopper className='h-6 w-6' />
              </div>
              <div>
                <p className='text-white font-bold text-lg md:text-xl'>
                  ${service.price}{' '}
                  <span className='font-normal text-sm'>/ session</span>
                </p>
                <p className='text-white/80 text-sm'>
                  {service.duration}-hour professional karaoke experience
                </p>
              </div>
            </div>

            {/* Rating */}
            <div className='flex items-center gap-1 mr-6 mb-4 md:mb-0'>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className='h-5 w-5 text-yellow-300 fill-yellow-300'
                />
              ))}
              <span className='ml-1 text-white'>(5.0)</span>
            </div>

            {/* Book Now Button */}
            <button
              onClick={handleBookNow}
              className={`px-8 py-3 rounded-lg ${
                isSelected
                  ? `bg-white text-${primaryColor}-600 hover:bg-${primaryColor}-50`
                  : `bg-${primaryColor}-700 text-white hover:bg-${primaryColor}-800`
              } font-bold transition-all duration-300 shadow-lg flex items-center gap-2`}
            >
              {isSelected ? (
                <>
                  <Check className='h-5 w-5' />
                  <span>Added to Package</span>
                </>
              ) : (
                <>
                  <span>Book Now</span>
                  <ArrowRight className='h-5 w-5' />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Service Description */}
        <div className='p-6 md:p-8 relative'>
          <div className='absolute top-0 right-0 w-48 h-48 opacity-10 pointer-events-none hidden md:block'>
            <Mic className={`w-full h-full text-${primaryColor}-500`} />
          </div>

          <div className='flex items-center mb-4'>
            <Music className={`h-6 w-6 text-${primaryColor}-500 mr-3`} />
            <h2 className='text-3xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent'>
              {serviceData?.titleKey
                ? t(serviceData.titleKey)
                : 'Ultimate Karaoke Experience'}
            </h2>
          </div>

          <div className='mb-6 max-w-4xl'>
            <p className='text-lg text-gray-700 leading-relaxed'>
              {serviceData?.descriptionKey
                ? t(serviceData.descriptionKey)
                : service.description}
            </p>
            {serviceData?.fullDescriptionKey && (
              <p className='text-gray-700 mt-3 leading-relaxed'>
                {t(serviceData.fullDescriptionKey)}
              </p>
            )}
          </div>

          <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mt-8'>
            <div
              className={`flex flex-col items-center p-4 rounded-lg bg-gradient-to-br from-${primaryColor}-50 to-${primaryColor}-100 border border-${primaryColor}-200 text-center hover:shadow-md transition-all duration-300 hover:-translate-y-1`}
            >
              <Mic className={`h-8 w-8 text-${primaryColor}-500 mb-2`} />
              <span className='font-bold text-xl text-gray-800'>
                {songCount}+
              </span>
              <span className='text-sm text-gray-600'>Songs</span>
            </div>
            <div
              className={`flex flex-col items-center p-4 rounded-lg bg-gradient-to-br from-${primaryColor}-50 to-${primaryColor}-100 border border-${primaryColor}-200 text-center hover:shadow-md transition-all duration-300 hover:-translate-y-1`}
            >
              <Clock className={`h-8 w-8 text-${primaryColor}-500 mb-2`} />
              <span className='font-bold text-xl text-gray-800'>
                {service.duration}h
              </span>
              <span className='text-sm text-gray-600'>Duration</span>
            </div>
            <div
              className={`flex flex-col items-center p-4 rounded-lg bg-gradient-to-br from-${primaryColor}-50 to-${primaryColor}-100 border border-${primaryColor}-200 text-center hover:shadow-md transition-all duration-300 hover:-translate-y-1`}
            >
              <Users className={`h-8 w-8 text-${primaryColor}-500 mb-2`} />
              <span className='font-bold text-xl text-gray-800'>Unlimited</span>
              <span className='text-sm text-gray-600'>Guests</span>
            </div>
            <div
              className={`flex flex-col items-center p-4 rounded-lg bg-gradient-to-br from-${primaryColor}-50 to-${primaryColor}-100 border border-${primaryColor}-200 text-center hover:shadow-md transition-all duration-300 hover:-translate-y-1`}
            >
              {/* <Lightning className={`h-8 w-8 text-${primaryColor}-500 mb-2`} /> */}
              <span className='font-bold text-xl text-gray-800'>Easy</span>
              <span className='text-sm text-gray-600'>15-min Setup</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Setup Options with modern look*/}
      {Object.keys(setupOptions).length > 0 && (
        <motion.div
          className='bg-white rounded-xl shadow-xl overflow-hidden'
          initial='hidden'
          animate='visible'
          variants={fadeIn}
        >
          <div className='p-6 md:p-8 md:pb-12'>
            <h3 className='text-2xl font-bold text-gray-900 mb-8 flex items-center'>
              <Speaker className={`h-7 w-7 text-${primaryColor}-500 mr-3`} />
              <span className='bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent'>
                {t('karaokeDetails.setupOptions')}
              </span>
            </h3>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              {Object.entries(setupOptions).map(([key, option]) => (
                <div
                  key={key}
                  className={`relative rounded-xl overflow-hidden transition-all duration-500 group hover:shadow-2xl ${
                    key === 'premium'
                      ? 'border-2 border-amber-400'
                      : 'border border-gray-200'
                  }`}
                >
                  {key === 'premium' && (
                    <div className='absolute -right-12 -top-12 h-24 w-24 bg-amber-400 rotate-45 z-10'></div>
                  )}
                  {key === 'premium' && (
                    <div className='absolute right-0 top-0 z-20 bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1'>
                      PREMIUM
                    </div>
                  )}

                  <div
                    className={`${
                      key === 'premium'
                        ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-white'
                        : `bg-gradient-to-r from-${primaryColor}-50 to-${primaryColor}-100 text-gray-800`
                    } p-6`}
                  >
                    <h4 className='text-xl font-bold'>
                      {typeof option === 'object' && 'nameKey' in option
                        ? t(option.nameKey, { fallback: formatSetupName(key) })
                        : formatSetupName(key)}
                    </h4>
                  </div>

                  <div className='p-6'>
                    <ul className='space-y-3'>
                      {getSetupFeatures(key).map((feature, idx) => (
                        <li key={idx} className='flex items-start'>
                          <Check
                            className={`h-5 w-5 ${
                              key === 'premium'
                                ? 'text-amber-500'
                                : `text-${primaryColor}-500`
                            } mr-2 mt-0.5 flex-shrink-0`}
                          />
                          <span className='text-gray-700'>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {typeof option === 'object' &&
                      'price' in option &&
                      option.price !== 0 && (
                        <div className='mt-6 pt-4 border-t border-gray-100 flex justify-between items-center'>
                          <span
                            className={`${
                              key === 'premium'
                                ? 'text-amber-600'
                                : `text-${primaryColor}-600`
                            } font-bold text-lg`}
                          >
                            {option.price > 0 ? `+$${option.price}` : ''}
                          </span>
                          <button
                            className={`px-4 py-2 rounded-lg ${
                              key === 'premium'
                                ? 'bg-amber-500 text-white hover:bg-amber-600'
                                : `bg-${primaryColor}-500 text-white hover:bg-${primaryColor}-600`
                            } transition-all duration-300 text-sm font-medium`}
                          >
                            Select Option
                          </button>
                        </div>
                      )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Song Collection with modern visual styling */}
      <motion.div
        className='bg-white rounded-xl shadow-xl overflow-hidden relative'
        initial='hidden'
        animate='visible'
        variants={fadeIn}
      >
        <div className="absolute top-0 right-0 w-full h-full bg-[url('https://images.pexels.com/photos/2034851/pexels-photo-2034851.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] opacity-5 bg-center bg-cover"></div>

        <div className='p-6 md:p-8 relative z-10'>
          <h3 className='text-2xl font-bold mb-8 flex items-center'>
            <Music className={`h-7 w-7 text-${primaryColor}-500 mr-3`} />
            <span className='bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent'>
              {t('karaokeDetails.songCollection')}
            </span>
          </h3>

          <div className='mb-8 max-w-3xl'>
            <p className='text-gray-700 text-lg leading-relaxed mb-6'>
              Our extensive karaoke library includes over{' '}
              <span className='font-bold text-black'>{songCount}</span> songs
              across multiple genres and languages. From classic hits to the
              latest chart-toppers, we ve got something for everyone!
            </p>

            <div className='mt-8 grid grid-cols-1 md:grid-cols-2 gap-8'>
              <div>
                <h4 className='text-lg font-bold text-gray-800 mb-4 flex items-center'>
                  <Sparkles
                    className={`h-5 w-5 text-${primaryColor}-500 mr-2`}
                  />
                  Popular Genres
                </h4>
                <div className='flex flex-wrap gap-2'>
                  {songGenres.map((genre, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1.5 bg-gradient-to-r from-${primaryColor}-50 to-${primaryColor}-100 text-${primaryColor}-700 rounded-full text-sm font-medium border border-${primaryColor}-200 hover:shadow-sm transition-all duration-300 hover:-translate-y-0.5`}
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className='text-lg font-bold text-gray-800 mb-4 flex items-center'>
                  <Mic className={`h-5 w-5 text-${primaryColor}-500 mr-2`} />
                  Available Languages
                </h4>
                <div className='flex flex-wrap gap-2'>
                  {languageOptions.map((language, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1.5 bg-gradient-to-r from-${primaryColor}-50 to-${primaryColor}-100 text-${primaryColor}-700 rounded-full text-sm font-medium border border-${primaryColor}-200 hover:shadow-sm transition-all duration-300 hover:-translate-y-0.5`}
                    >
                      {language}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Host Options with modern styling*/}
      {Object.keys(hostOptions).length > 0 && (
        <motion.div
          className='bg-white rounded-xl shadow-xl overflow-hidden'
          initial='hidden'
          animate='visible'
          variants={fadeIn}
        >
          <div className='p-6 md:p-8'>
            <h3 className='text-2xl font-bold text-gray-900 mb-8 flex items-center'>
              <Users className={`h-7 w-7 text-${primaryColor}-500 mr-3`} />
              <span className='bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent'>
                {t('karaokeDetails.hostOptions')}
              </span>
            </h3>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              {Object.entries(hostOptions).map(([key, option]) => (
                <div
                  key={key}
                  className={`rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl border ${
                    key === 'yes'
                      ? `border-${primaryColor}-200 hover:border-${primaryColor}-300`
                      : 'border-gray-200'
                  }`}
                >
                  <div
                    className={`p-8 ${
                      key === 'yes'
                        ? `bg-gradient-to-br from-${primaryColor}-50 via-${primaryColor}-100 to-${primaryColor}-50`
                        : 'bg-gray-50'
                    }`}
                  >
                    <div className='flex items-center mb-4'>
                      {key === 'yes' ? (
                        <div
                          className={`h-14 w-14 rounded-full bg-${primaryColor}-200 flex items-center justify-center mr-4`}
                        >
                          <Sparkles
                            className={`h-8 w-8 text-${primaryColor}-600`}
                          />
                        </div>
                      ) : (
                        <div className='h-14 w-14 rounded-full bg-gray-200 flex items-center justify-center mr-4'>
                          <Users className='h-8 w-8 text-gray-500' />
                        </div>
                      )}
                      <h4 className='text-xl font-bold text-gray-800'>
                        {typeof option === 'object' && 'nameKey' in option
                          ? t(option.nameKey, {
                              fallback:
                                key === 'yes'
                                  ? 'Professional Host'
                                  : 'Self-Hosted',
                            })
                          : key === 'yes'
                          ? 'Professional Host'
                          : 'Self-Hosted'}
                      </h4>
                    </div>

                    <p className='text-gray-700 mb-6 text-lg'>
                      {key === 'yes'
                        ? 'Our expert host will guide your party, encourage shy singers, organize sing-offs, and keep the energy high!'
                        : 'Host the event yourself with our easy-to-use equipment. Perfect for casual and intimate gatherings.'}
                    </p>

                    {typeof option === 'object' &&
                      'price' in option &&
                      option.price !== 0 && (
                        <div className='mt-4 pt-4 border-t border-gray-200 flex justify-between items-center'>
                          <span
                            className={`text-${primaryColor}-600 font-bold text-lg`}
                          >
                            {option.price > 0 ? `+$${option.price}` : ''}
                          </span>
                          <button
                            className={`px-4 py-2 rounded-lg ${
                              key === 'yes'
                                ? `bg-${primaryColor}-500 text-white hover:bg-${primaryColor}-600`
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            } transition-all duration-300 text-sm font-medium`}
                          >
                            {key === 'yes' ? 'Add Host' : 'Self-Host'}
                          </button>
                        </div>
                      )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Tips for a Great Karaoke Party with enhanced styling */}
      <motion.div
        className='bg-white rounded-xl shadow-xl overflow-hidden'
        initial='hidden'
        animate='visible'
        variants={fadeIn}
      >
        <div className='p-6 md:p-8'>
          <h3 className='text-2xl font-bold text-gray-900 mb-8 flex items-center'>
            <Sparkles className={`h-7 w-7 text-${primaryColor}-500 mr-3`} />
            <span className='bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent'>
              {t('karaokeDetails.partyTips')}
            </span>
          </h3>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div
              className={`p-6 rounded-xl bg-gradient-to-br from-${primaryColor}-50 to-${primaryColor}-100 border border-${primaryColor}-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
            >
              <div className='flex items-center mb-3'>
                <div
                  className={`h-12 w-12 rounded-full bg-${primaryColor}-200 flex items-center justify-center mr-4`}
                >
                  <Heart className={`h-6 w-6 text-${primaryColor}-600`} />
                </div>
                <h4 className='font-bold text-gray-800 text-lg'>
                  Create a Warm-Up Playlist
                </h4>
              </div>
              <p className='text-gray-700'>
                Start with some crowd favorites to get everyone in the mood. We
                recommend upbeat classics that everyone knows!
              </p>
            </div>

            <div
              className={`p-6 rounded-xl bg-gradient-to-br from-${primaryColor}-50 to-${primaryColor}-100 border border-${primaryColor}-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
            >
              <div className='flex items-center mb-3'>
                <div
                  className={`h-12 w-12 rounded-full bg-${primaryColor}-200 flex items-center justify-center mr-4`}
                >
                  <Mic className={`h-6 w-6 text-${primaryColor}-600`} />
                </div>
                <h4 className='font-bold text-gray-800 text-lg'>
                  Plan Duets and Group Songs
                </h4>
              </div>
              <p className='text-gray-700'>
                Include songs that can be performed as duets or by groups to get
                more people involved and build energy.
              </p>
            </div>

            <div
              className={`p-6 rounded-xl bg-gradient-to-br from-${primaryColor}-50 to-${primaryColor}-100 border border-${primaryColor}-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
            >
              <div className='flex items-center mb-3'>
                <div
                  className={`h-12 w-12 rounded-full bg-${primaryColor}-200 flex items-center justify-center mr-4`}
                >
                  <Monitor className={`h-6 w-6 text-${primaryColor}-600`} />
                </div>
                <h4 className='font-bold text-gray-800 text-lg'>
                  Set Up Viewing Areas
                </h4>
              </div>
              <p className='text-gray-700'>
                Arrange seating so everyone can see the screen, but leave an
                open area for performers to move around.
              </p>
            </div>

            <div
              className={`p-6 rounded-xl bg-gradient-to-br from-${primaryColor}-50 to-${primaryColor}-100 border border-${primaryColor}-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
            >
              <div className='flex items-center mb-3'>
                <div
                  className={`h-12 w-12 rounded-full bg-${primaryColor}-200 flex items-center justify-center mr-4`}
                >
                  {/* <Lightning className={`h-6 w-6 text-${primaryColor}-600`} /> */}
                </div>
                <h4 className='font-bold text-gray-800 text-lg'>
                  Keep the Momentum Going
                </h4>
              </div>
              <p className='text-gray-700'>
                Have the next singer ready while the current one is performing
                to avoid down time between songs.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Additional Information Tabs */}
      <motion.div
        className='bg-white rounded-xl shadow-xl overflow-hidden'
        initial='hidden'
        animate='visible'
        variants={fadeIn}
      >
        <div className='p-6 md:p-8'>
          <h3 className='text-2xl font-bold text-gray-900 mb-6 flex items-center'>
            <Info className={`h-7 w-7 text-${primaryColor}-500 mr-3`} />
            <span className='bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent'>
              {t('karaokeDetails.additionalInfo')}
            </span>
          </h3>

          {/* Tabs Navigation */}
          <div className='flex border-b border-gray-200 mb-6 overflow-x-auto'>
            {/* <TabButton
              active={activeTab === 'equipment'}
              onClick={() => setActiveTab('equipment')}
              icon={<Speaker className='h-4 w-4' />}
              label='Equipment & Setup'
              primaryColor={primaryColor}
            /> */}

            {/* <TabButton
              active={activeTab === 'testimonials'}
              onClick={() => setActiveTab('testimonials')}
              icon={<MessageCircle className='h-4 w-4' />}
              label='Client Testimonials'
              primaryColor={primaryColor}
            /> */}

            {/* <TabButton
              active={activeTab === 'faq'}
              onClick={() => setActiveTab('faq')}
              icon={<HelpCircle className='h-4 w-4' />}
              label='FAQ'
              primaryColor={primaryColor}
            /> */}
          </div>

          {/* Tab Content */}
          <div>
            {/* Equipment Tab */}
            {/* {activeTab === 'equipment' && (
              <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                <div>
                  <h4 className='font-semibold text-gray-800 mb-4 text-lg flex items-center'>
                    <Speaker
                      className={`h-5 w-5 text-${primaryColor}-500 mr-2`}
                    />
                    Sound Equipment
                  </h4>
                  <ul className='space-y-2'>
                    <EquipmentItem primaryColor={primaryColor}>
                      Professional karaoke system with over 10,000 songs
                    </EquipmentItem>
                    <EquipmentItem primaryColor={primaryColor}>
                      Two to four wireless microphones with echo effects
                    </EquipmentItem>
                    <EquipmentItem primaryColor={primaryColor}>
                      High-quality speaker system with subwoofer
                    </EquipmentItem>
                    <EquipmentItem primaryColor={primaryColor}>
                      Digital mixing console for perfect sound
                    </EquipmentItem>
                    <EquipmentItem primaryColor={primaryColor}>
                      Tablet interface for song selection
                    </EquipmentItem>
                  </ul>
                </div>

                <div>
                  <h4 className='font-semibold text-gray-800 mb-4 text-lg flex items-center'>
                    <Monitor
                      className={`h-5 w-5 text-${primaryColor}-500 mr-2`}
                    />
                    Visual & Lighting
                  </h4>
                  <ul className='space-y-2'>
                    <EquipmentItem primaryColor={primaryColor}>
                      Dual-screen display system (lyrics + visuals)
                    </EquipmentItem>
                    <EquipmentItem primaryColor={primaryColor}>
                      Customizable light show with LED fixtures
                    </EquipmentItem>
                    <EquipmentItem primaryColor={primaryColor}>
                      Optional fog machine (premium package)
                    </EquipmentItem>
                    <EquipmentItem primaryColor={primaryColor}>
                      HDMI connectivity for larger displays
                    </EquipmentItem>
                    <EquipmentItem primaryColor={primaryColor}>
                      Personalized welcome screens available
                    </EquipmentItem>
                  </ul>
                </div>

                <div className='md:col-span-2 mt-4'>
                  <h4 className='font-semibold text-gray-800 mb-4 text-lg flex items-center'>
                    <Clock
                      className={`h-5 w-5 text-${primaryColor}-500 mr-2`}
                    />
                    Setup Process
                  </h4>
                  <ol className='space-y-4'>
                    <SetupStep number={1} primaryColor={primaryColor}>
                      <span className='font-medium'>Arrival & Assessment</span>{' '}
                      - Our team arrives 30 minutes before your start time to
                      assess the space and layout
                    </SetupStep>
                    <SetupStep number={2} primaryColor={primaryColor}>
                      <span className='font-medium'>Equipment Setup</span> -
                      Professional setup of all sound and visual equipment in
                      your chosen space
                    </SetupStep>
                    <SetupStep number={3} primaryColor={primaryColor}>
                      <span className='font-medium'>System Test</span> -
                      Complete sound check and system testing to ensure
                      everything works flawlessly
                    </SetupStep>
                    <SetupStep number={4} primaryColor={primaryColor}>
                      <span className='font-medium'>Tutorial & Handover</span> -
                      Quick tutorial on using the system and song selection
                      process
                    </SetupStep>
                    <SetupStep number={5} primaryColor={primaryColor}>
                      <span className='font-medium'>
                        Breakdown & Collection
                      </span>{' '}
                      - After your event, we handle all equipment breakdown and
                      cleanup
                    </SetupStep>
                  </ol>
                </div>
              </div>
            )} */}
          </div>
        </div>
      </motion.div>

      {/* Book Now CTA */}
      <motion.div
        className={`rounded-xl overflow-hidden bg-gradient-to-r from-${primaryColor}-600 to-${primaryColor}-500 shadow-xl`}
        initial='hidden'
        animate='visible'
        variants={fadeIn}
      >
        <div className='p-8 md:p-12 flex flex-col md:flex-row items-center justify-between'>
          <div className='mb-6 md:mb-0'>
            <h3 className='text-2xl md:text-3xl font-bold text-white mb-2'>
              Ready to Rock Your Party?
            </h3>
            <p className='text-white/80'>
              Book now and create unforgettable karaoke memories at your villa
            </p>
          </div>

          <button
            onClick={handleBookNow}
            className={`px-8 py-4 rounded-xl ${
              isSelected
                ? 'bg-white text-gray-800 hover:bg-gray-100'
                : 'bg-black/20 backdrop-blur-sm text-white hover:bg-black/30'
            } font-bold transition-all duration-300 shadow-lg text-lg flex items-center gap-2 min-w-[200px] justify-center`}
          >
            {isSelected ? (
              <>
                <Check className='h-5 w-5' />
                <span>Added to Package</span>
              </>
            ) : (
              <>
                <span>Book Now</span>
                <ArrowRight className='h-5 w-5' />
              </>
            )}
          </button>
        </div>
      </motion.div>

      {/* Disclaimer if available */}
      {disclaimer && (
        <motion.div
          className='p-4 bg-amber-50 rounded-xl border border-amber-100'
          initial='hidden'
          animate='visible'
          variants={fadeIn}
        >
          <h4 className='font-medium text-amber-800 mb-2 flex items-center'>
            <AlertCircle className='w-5 h-5 mr-2' />
            {t('services.common.importantNote')}
          </h4>
          <p className='text-amber-700'>{disclaimer}</p>
        </motion.div>
      )}

      {/* Modals */}
      <GalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        images={galleryImages}
        currentIndex={currentImageIndex}
        setCurrentIndex={setCurrentImageIndex}
      />

      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
      />
    </div>
  );
};

// TabButton Component
interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  primaryColor: string;
}

const TabButton: React.FC<TabButtonProps> = ({
  active,
  onClick,
  icon,
  label,
  primaryColor,
}) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 font-medium text-sm mr-4 whitespace-nowrap flex items-center ${
      active
        ? `text-${primaryColor}-600 border-b-2 border-${primaryColor}-600`
        : 'text-gray-600 hover:text-gray-900'
    }`}
  >
    <span className='mr-1.5'>{icon}</span>
    {label}
  </button>
);

// Helper component for equipment items
interface EquipmentItemProps {
  children: React.ReactNode;
  primaryColor: string;
}

const EquipmentItem: React.FC<EquipmentItemProps> = ({
  children,
  primaryColor,
}) => (
  <li className='flex items-start'>
    <Check
      className={`h-5 w-5 text-${primaryColor}-500 mr-2 mt-0.5 flex-shrink-0`}
    />
    <span className='text-gray-700'>{children}</span>
  </li>
);

// Setup Step Component
interface SetupStepProps {
  number: number;
  children: React.ReactNode;
  primaryColor: string;
}

const SetupStep: React.FC<SetupStepProps> = ({
  number,
  children,
  primaryColor,
}) => (
  <li className='flex'>
    <div
      className={`flex-shrink-0 h-6 w-6 rounded-full bg-${primaryColor}-100 text-${primaryColor}-800 flex items-center justify-center font-medium mr-3`}
    >
      {number}
    </div>
    <div>
      <p className='text-gray-700'>{children}</p>
    </div>
  </li>
);

export default KaraokeServiceView;
