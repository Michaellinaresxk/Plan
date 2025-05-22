import React, { useState } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { Service } from '@/types/type';
import { ServiceData } from '@/types/services';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Ship,
  Users,
  Clock,
  Map,
  Utensils,
  Calendar,
  Sun,
  Camera,
  ArrowRight,
  Star,
  Check,
  ChevronRight,
  ChevronLeft,
  Wind,
  Droplets,
  Fish,
  LifeBuoy,
  AlertCircle,
  Anchor,
  ChevronDown,
} from 'lucide-react';
import { useBooking } from '@/context/BookingContext';
import { BookingDate } from '@/types/type';
import BookingModal from '@/UI/components/modal/BookingModal';

interface CatamaranServiceViewProps {
  service: Service;
  serviceData?: ServiceData;
  primaryColor: string;
}

const CatamaranServiceView: React.FC<CatamaranServiceViewProps> = ({
  service,
  serviceData,
  primaryColor,
}) => {
  const { t } = useTranslation();
  const { bookService } = useBooking();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Determine if this is a premium service
  const isPremium = service.packageType.includes('premium');

  // Verify if service's name includes 'private'
  const isPrivate = service.id.includes('private');

  // Extract data from serviceData
  const capacity =
    serviceData?.metaData?.capacity ||
    (isPrivate ? '19 passengers' : '40 passengers');

  const travelTime = serviceData?.metaData?.travelTime || '4-6 hours';

  // Extract destinations if available
  const destinations = Array.isArray(serviceData?.metaData?.places)
    ? serviceData.metaData.places
    : serviceData?.metaData?.places?.toString().split(',') || [
        'Isla Saona',
        'Arrecifes de coral',
        'Piscinas naturales',
        'Palmera torcida',
        'Bahía de las Águilas',
      ];

  // Extract drink options if available
  const drinkOptions = Array.isArray(serviceData?.metaData?.openBarOptions)
    ? serviceData.metaData.openBarOptions
    : serviceData?.metaData?.openBarOptions?.toString().split(',') || [
        'Mojito',
        'Cuba Libre',
        'Piña Colada',
        'Daiquiri',
        'Cerveza local',
        'Agua y refrescos',
      ];

  // Gallery images
  const galleryImages = [
    {
      src: 'https://images.unsplash.com/photo-1566416800269-eefb8666ae1b?q=80&w=1000',
      alt: 'Catamaran sailing on crystal blue water',
      caption:
        'Experience the freedom of sailing through pristine Caribbean waters',
    },
    {
      src: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?q=80&w=1000',
      alt: 'Luxury catamaran deck view',
      caption: 'Spacious decks perfect for relaxing and sunbathing',
    },
    {
      src: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=1000',
      alt: 'Snorkeling from catamaran',
      caption: 'Discover vibrant coral reefs and tropical fish',
    },
    {
      src: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1000',
      alt: 'Catamaran anchored near beach',
      caption: 'Visit pristine beaches accessible only by boat',
    },
    {
      src: 'https://images.unsplash.com/photo-1533760881669-80db4d7b4c15?q=80&w=1000',
      alt: 'Tropical beach paradise',
      caption: 'Relax on some of the most beautiful beaches in the Caribbean',
    },
  ];

  // FAQs
  const faqs = [
    {
      question: 'Do I need to know how to swim to enjoy this tour?',
      answer:
        "Swimming isn't mandatory. We provide life jackets and professional supervision for all passengers. However, knowing how to swim will enhance your experience during snorkeling activities.",
    },
    {
      question: 'What should I bring for the catamaran tour?',
      answer:
        'We recommend bringing swimwear, a towel, biodegradable sunscreen, a hat, sunglasses, a camera (preferably waterproof), and cash for optional purchases.',
    },
    {
      question: 'Is this tour suitable for children?',
      answer:
        'Yes, this tour is perfect for families. Children of all ages are welcome, and we have life jackets available in different sizes.',
    },
    {
      question: 'What happens in case of bad weather?',
      answer:
        'Safety is our priority. In case of adverse weather conditions, we may reschedule your booking for another date or offer a full refund.',
    },
    {
      question: 'Is food included in the tour?',
      answer:
        'Yes, a delicious tropical buffet is included in your tour price, along with drinks from our open bar selection.',
    },
  ];

  // Features/highlights
  const highlights = [
    {
      icon: <Ship className='h-6 w-6' />,
      title: isPrivate ? 'Private Experience' : 'Luxury Catamaran',
      description: isPrivate
        ? 'Enjoy complete privacy with family and friends'
        : 'Modern vessel with all amenities',
    },
    {
      icon: <Anchor className='h-6 w-6' />,
      title: 'Complete Equipment',
      description: 'Snorkeling gear included for reef exploration',
    },
    {
      icon: <Utensils className='h-6 w-6' />,
      title: 'Onboard Dining',
      description:
        isPremium || isPrivate
          ? 'Gourmet menu with customized options'
          : 'Tropical buffet with included drinks',
    },
    {
      icon: <Users className='h-6 w-6' />,
      title: 'Capacity',
      description: `Up to ${capacity.split(' ')[0]} passengers comfortably`,
    },
  ];

  // Available time slots
  const timeSlots = serviceData?.metaData?.timeSlots
    ? Array.isArray(serviceData.metaData.timeSlots)
      ? serviceData.metaData.timeSlots
      : serviceData.metaData.timeSlots.toString().split(',')
    : [
        '8:30 AM – 11:30 AM',
        '12:00 PM – 3:00 PM',
        '3:30 PM – 6:30 PM (Sunset Experience)',
      ];

  // Activities
  const activities = [
    {
      icon: <LifeBuoy />,
      title: 'Snorkeling',
      description: 'Explore vibrant coral reefs',
    },
    {
      icon: <Droplets />,
      title: 'Swimming',
      description: 'In safe, crystal-clear waters',
    },
    {
      icon: <Sun />,
      title: 'Sunbathing',
      description: 'On spacious deck with cushions',
    },
    {
      icon: <Fish />,
      title: 'Marine Life',
      description: 'Observe tropical fish',
    },
  ];

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Handle booking modal
  const handleOpenBookingModal = () => {
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

  // Gallery navigation
  const navigateGallery = (direction: number) => {
    const newIndex = currentGalleryIndex + direction;
    if (newIndex >= 0 && newIndex < galleryImages.length) {
      setCurrentGalleryIndex(newIndex);
    }
  };

  // Toggle FAQ expansion
  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div className='space-y-16'>
      {/* Hero Section with Gallery */}
      <motion.div
        className='relative overflow-hidden rounded-2xl shadow-2xl'
        initial='hidden'
        animate='visible'
        variants={fadeIn}
      >
        <div className='relative h-[60vh] w-full'>
          <Image
            src={galleryImages[currentGalleryIndex].src}
            alt={galleryImages[currentGalleryIndex].alt}
            fill
            className='object-cover transition-opacity duration-500'
            priority
          />

          {/* Overlay gradient */}
          <div
            className={`absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/80`}
          ></div>

          {/* Gallery Navigation */}
          <div className='absolute inset-0 flex items-center justify-between px-6 z-10'>
            <button
              onClick={() => navigateGallery(-1)}
              disabled={currentGalleryIndex === 0}
              className={`h-12 w-12 rounded-full flex items-center justify-center ${
                currentGalleryIndex === 0
                  ? 'bg-black/20 text-gray-400 cursor-not-allowed'
                  : 'bg-black/30 backdrop-blur-sm text-white hover:bg-white/20 transition-colors'
              }`}
            >
              <ChevronLeft className='h-6 w-6' />
            </button>

            <button
              onClick={() => navigateGallery(1)}
              disabled={currentGalleryIndex === galleryImages.length - 1}
              className={`h-12 w-12 rounded-full flex items-center justify-center ${
                currentGalleryIndex === galleryImages.length - 1
                  ? 'bg-black/20 text-gray-400 cursor-not-allowed'
                  : 'bg-black/30 backdrop-blur-sm text-white hover:bg-white/20 transition-colors'
              }`}
            >
              <ChevronRight className='h-6 w-6' />
            </button>
          </div>

          {/* Gallery Indicator Dots */}
          <div className='absolute bottom-6 inset-x-0 flex justify-center gap-2 z-10'>
            {galleryImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentGalleryIndex(index)}
                className={`h-2 w-${
                  index === currentGalleryIndex ? '8' : '2'
                } rounded-full transition-all duration-300 ${
                  index === currentGalleryIndex ? 'bg-white' : 'bg-white/50'
                }`}
                aria-label={`View image ${index + 1}`}
              />
            ))}
          </div>

          {/* Content */}
          <div className='absolute bottom-0 left-0 right-0 p-8 text-white z-10'>
            <div className='mb-4'>
              {isPremium ? (
                <div className='inline-flex items-center bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20'>
                  <Star
                    className='h-4 w-4 mr-2 text-yellow-400'
                    fill='currentColor'
                  />
                  <span className='text-sm font-semibold tracking-wide'>
                    Premium Experience
                  </span>
                </div>
              ) : (
                <div className='inline-flex items-center bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20'>
                  <Ship className='h-4 w-4 mr-2 text-white' />
                  <span className='text-sm font-semibold tracking-wide'>
                    Adventure on the Sea
                  </span>
                </div>
              )}
            </div>

            <h1 className='text-4xl md:text-5xl font-bold mb-4 max-w-3xl'>
              {isPremium
                ? 'Premium Catamaran Experience'
                : isPrivate
                ? 'Private Catamaran Adventure'
                : 'Unforgettable Catamaran Sailing Tour'}
            </h1>

            <p className='text-xl text-white/90 mb-6 max-w-2xl'>
              {serviceData?.descriptionKey
                ? t(serviceData.descriptionKey)
                : 'Discover paradise aboard our luxurious catamaran, exploring pristine beaches, natural pools, and vibrant coral reefs with expert guidance.'}
            </p>

            <div className='flex flex-wrap gap-6 items-center mb-4'>
              <div className='flex items-center'>
                <Clock className='h-5 w-5 mr-2 text-white/70' />
                <span>{travelTime}</span>
              </div>
              <div className='flex items-center'>
                <Users className='h-5 w-5 mr-2 text-white/70' />
                <span>Up to {capacity.split(' ')[0]} guests</span>
              </div>
              <div className='flex items-center'>
                <Star className='h-5 w-5 mr-2 text-white/70' />
                <span>5.0 (120+ reviews)</span>
              </div>
            </div>

            <button
              onClick={handleOpenBookingModal}
              className={`mt-4 px-8 py-4 ${
                isPremium
                  ? 'bg-amber-500 hover:bg-amber-600 text-amber-900'
                  : 'bg-white hover:bg-gray-100 text-gray-900'
              } rounded-lg font-bold flex items-center gap-2 transition-all duration-300 hover:shadow-lg transform hover:scale-105`}
            >
              Book Your Adventure
              <ArrowRight className='h-5 w-5' />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Key Features */}
      <motion.div
        className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'
        variants={staggerChildren}
        initial='hidden'
        animate='visible'
      >
        {highlights.map((highlight, index) => (
          <motion.div
            key={index}
            variants={fadeIn}
            className={`bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border-t-4 ${
              isPremium ? 'border-amber-500' : `border-${primaryColor}-500`
            }`}
          >
            <div
              className={`w-12 h-12 rounded-full ${
                isPremium
                  ? 'bg-amber-100 text-amber-600'
                  : `bg-${primaryColor}-100 text-${primaryColor}-600`
              } flex items-center justify-center mb-4`}
            >
              {highlight.icon}
            </div>
            <h3 className='text-lg font-bold text-gray-900 mb-2'>
              {highlight.title}
            </h3>
            <p className='text-gray-600'>{highlight.description}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Description and Image */}
      <motion.div
        className='grid grid-cols-1 lg:grid-cols-2 gap-10 items-center'
        initial='hidden'
        animate='visible'
        variants={fadeIn}
      >
        <div>
          <h2
            className={`text-3xl font-bold ${
              isPremium ? 'text-amber-800' : `text-${primaryColor}-800`
            } mb-6`}
          >
            {isPrivate
              ? 'Your Exclusive Sea Adventure'
              : 'An Unforgettable Maritime Experience'}
          </h2>
          <div className='prose max-w-none text-gray-700'>
            <p className='mb-4 text-lg'>
              {serviceData?.fullDescriptionKey
                ? t(serviceData.fullDescriptionKey)
                : isPrivate
                ? 'Enjoy a completely private experience aboard our luxurious catamaran, where you and your guests will be the only passengers. Our attentive crew will be exclusively dedicated to you, ensuring an unparalleled level of personalized service.'
                : "Embark on an unforgettable adventure through the crystal-clear waters of the Caribbean aboard our spacious catamaran. We'll sail between vibrant coral reefs and white-sand beaches, while you enjoy the sun, sea, and the best hospitality."}
            </p>
            <p>
              {isPrivate
                ? 'The tour includes stops at the most exclusive spots, premium quality snorkeling equipment, an exquisite personalized menu, and a premium selection of beverages. Everything is designed to create unforgettable memories in a paradise setting.'
                : "During the journey, you'll have the opportunity to swim in turquoise waters, snorkel among colorful tropical fish, relax on pristine beaches, and enjoy a delicious tropical buffet accompanied by refreshing drinks."}
            </p>
          </div>
        </div>
        <div className='relative h-[400px] rounded-xl overflow-hidden shadow-xl'>
          <Image
            src={galleryImages[1].src}
            alt='Catamaran experience'
            fill
            className='object-cover'
          />
        </div>
      </motion.div>

      {/* Enhanced Experience Gallery */}
      <motion.div
        className='rounded-xl shadow-lg overflow-hidden'
        initial='hidden'
        animate='visible'
        variants={fadeIn}
      >
        <div className='p-8'>
          <h2
            className={`text-2xl font-bold ${
              isPremium ? 'text-amber-800' : `text-${primaryColor}-800`
            } mb-6 flex items-center`}
          >
            <Camera className='mr-2' />
            Experience Gallery
          </h2>

          {/* Main Gallery */}
          <div className='grid grid-cols-1 md:grid-cols-12 gap-4 mb-4'>
            {/* Featured large image */}
            <div className='md:col-span-8 relative h-80 rounded-xl overflow-hidden'>
              <Image
                src={galleryImages[2].src}
                alt={galleryImages[2].alt}
                fill
                className='object-cover hover:scale-105 transition-transform duration-700'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end'>
                <p className='p-4 text-white font-medium'>
                  Snorkeling among vibrant coral reefs
                </p>
              </div>
            </div>

            {/* Right side gallery */}
            <div className='md:col-span-4 grid grid-rows-2 gap-4'>
              <div className='relative h-36 rounded-xl overflow-hidden'>
                <Image
                  src={galleryImages[3].src}
                  alt={galleryImages[3].alt}
                  fill
                  className='object-cover hover:scale-105 transition-transform duration-700'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end'>
                  <p className='p-3 text-white text-sm'>
                    Anchored at pristine beaches
                  </p>
                </div>
              </div>

              <div className='relative h-36 rounded-xl overflow-hidden'>
                <Image
                  src={galleryImages[4].src}
                  alt={galleryImages[4].alt}
                  fill
                  className='object-cover hover:scale-105 transition-transform duration-700'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end'>
                  <p className='p-3 text-white text-sm'>
                    Paradise island beaches
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Gallery - 3 smaller images */}
          <div className='grid grid-cols-3 gap-4'>
            {[0, 1, 4].map((imgIndex) => (
              <div
                key={imgIndex}
                className='relative h-48 rounded-xl overflow-hidden group'
              >
                <Image
                  src={galleryImages[imgIndex].src}
                  alt={galleryImages[imgIndex].alt}
                  fill
                  className='object-cover transition-transform duration-700 group-hover:scale-110'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end'>
                  <p className='p-3 text-white text-sm'>
                    {galleryImages[imgIndex].caption
                      .split(' ')
                      .slice(0, 4)
                      .join(' ')}
                    ...
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Activities */}
      <motion.div
        className='bg-white rounded-xl shadow-lg overflow-hidden'
        initial='hidden'
        animate='visible'
        variants={fadeIn}
      >
        <div className='p-8'>
          <h2
            className={`text-2xl font-bold ${
              isPremium ? 'text-amber-800' : `text-${primaryColor}-800`
            } mb-6 flex items-center`}
          >
            <Ship className='mr-2' />
            Onboard Activities
          </h2>

          <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
            {activities.map((activity, index) => (
              <div
                key={index}
                className={`p-5 rounded-xl ${
                  isPremium ? 'bg-amber-50' : `bg-${primaryColor}-50`
                } text-center hover:shadow-md transition-shadow`}
              >
                <div
                  className={`h-14 w-14 rounded-full ${
                    isPremium ? 'bg-amber-100' : `bg-${primaryColor}-100`
                  } flex items-center justify-center mx-auto mb-4`}
                >
                  <div
                    className={
                      isPremium ? 'text-amber-600' : `text-${primaryColor}-600`
                    }
                  >
                    {activity.icon}
                  </div>
                </div>
                <h3 className='font-bold text-gray-800 mb-1'>
                  {activity.title}
                </h3>
                <p className='text-sm text-gray-600'>{activity.description}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Open Bar & Food Section */}
      <motion.div
        className='grid grid-cols-1 md:grid-cols-2 gap-8'
        initial='hidden'
        animate='visible'
        variants={fadeIn}
      >
        {/* Open Bar */}
        <div className='bg-white rounded-xl shadow-lg p-8'>
          <h2
            className={`text-xl font-bold ${
              isPremium ? 'text-amber-800' : `text-${primaryColor}-800`
            } mb-4 flex items-center`}
          >
            <Droplets className='mr-2' />
            {isPrivate || isPremium ? 'Premium Bar' : 'Open Bar'}
          </h2>

          <div className='grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-6 mt-6'>
            {drinkOptions.map((drink, index) => (
              <div key={index} className='flex items-center'>
                <Check
                  className={`h-4 w-4 ${
                    isPremium ? 'text-amber-500' : `text-${primaryColor}-500`
                  } mr-2 flex-shrink-0`}
                />
                <span className='text-gray-700'>{drink}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Food */}
        <div className='bg-white rounded-xl shadow-lg p-8'>
          <h2
            className={`text-xl font-bold ${
              isPremium ? 'text-amber-800' : `text-${primaryColor}-800`
            } mb-4 flex items-center`}
          >
            <Utensils className='mr-2' />
            Culinary Experience
          </h2>

          <div className='mt-4 space-y-4'>
            <p className='text-gray-700'>
              {isPremium || isPrivate
                ? 'Indulge in a gourmet buffet featuring fresh local ingredients, seafood specialties, tropical fruits, and Dominican delicacies, prepared by our talented chef.'
                : 'Enjoy a delicious tropical buffet with a variety of options including fresh fruits, snacks, sandwiches, and Dominican specialties during your journey.'}
            </p>
            <div className='bg-gray-50 p-4 rounded-lg border border-gray-100'>
              <h3 className='font-medium text-gray-800 mb-2'>
                Menu Highlights:
              </h3>
              <ul className='space-y-2'>
                <li className='flex items-start'>
                  <Check
                    className={`h-4 w-4 ${
                      isPremium ? 'text-amber-500' : `text-${primaryColor}-500`
                    } mt-1 mr-2`}
                  />
                  <span className='text-gray-700'>
                    {isPremium || isPrivate
                      ? 'Premium seafood selection including fresh-caught fish and lobster (seasonal)'
                      : 'Fresh tropical fruit platter'}
                  </span>
                </li>
                <li className='flex items-start'>
                  <Check
                    className={`h-4 w-4 ${
                      isPremium ? 'text-amber-500' : `text-${primaryColor}-500`
                    } mt-1 mr-2`}
                  />
                  <span className='text-gray-700'>
                    {isPremium || isPrivate
                      ? 'Gourmet grilled meats and vegetarian options'
                      : 'Traditional Dominican rice, beans, and meat dishes'}
                  </span>
                </li>
                <li className='flex items-start'>
                  <Check
                    className={`h-4 w-4 ${
                      isPremium ? 'text-amber-500' : `text-${primaryColor}-500`
                    } mt-1 mr-2`}
                  />
                  <span className='text-gray-700'>
                    {isPremium || isPrivate
                      ? 'Artisanal desserts and premium Dominican coffee'
                      : 'Fresh salads and light snacks'}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Time Slots */}
      <motion.div
        className='bg-white rounded-xl shadow-lg overflow-hidden'
        initial='hidden'
        animate='visible'
        variants={fadeIn}
      >
        <div className='p-8'>
          <h2
            className={`text-2xl font-bold ${
              isPremium ? 'text-amber-800' : `text-${primaryColor}-800`
            } mb-6 flex items-center`}
          >
            <Clock className='mr-2' />
            Available Departures
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {timeSlots.map((slot, index) => (
              <div
                key={index}
                className={`p-5 border-2 rounded-lg group transition-all duration-300 ${
                  index === 2
                    ? isPremium
                      ? 'border-amber-300 bg-amber-50'
                      : `border-${primaryColor}-300 bg-${primaryColor}-50`
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className='flex items-center justify-between'>
                  <span className='font-medium text-gray-800'>{slot}</span>
                  {index === 2 && (
                    <span
                      className={`text-xs font-medium ${
                        isPremium
                          ? 'bg-amber-200 text-amber-800'
                          : `bg-${primaryColor}-200 text-${primaryColor}-800`
                      } px-2 py-1 rounded-full`}
                    >
                      Popular
                    </span>
                  )}
                </div>
                <p className='text-sm text-gray-500 mt-2'>
                  {index === 0
                    ? 'Perfect for early birds'
                    : index === 1
                    ? 'Less crowded time'
                    : 'Sunset experience'}
                </p>
                <button
                  onClick={handleOpenBookingModal}
                  className={`w-full mt-4 py-2 rounded-lg transition-colors ${
                    index === 2
                      ? isPremium
                        ? 'bg-amber-500 hover:bg-amber-600 text-white'
                        : `bg-${primaryColor}-500 hover:bg-${primaryColor}-600 text-white`
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                  }`}
                >
                  Select
                </button>
              </div>
            ))}
          </div>

          <p className='mt-6 text-sm text-gray-500 flex items-center'>
            <AlertCircle className='h-4 w-4 mr-2' />
            Availability may vary by season and weather conditions. Advance
            reservation required.
          </p>
        </div>
      </motion.div>

      {/* FAQs */}
      <motion.div
        className='bg-white rounded-xl shadow-lg overflow-hidden'
        initial='hidden'
        animate='visible'
        variants={fadeIn}
      >
        <div className='p-8'>
          <h2
            className={`text-2xl font-bold ${
              isPremium ? 'text-amber-800' : `text-${primaryColor}-800`
            } mb-6`}
          >
            Frequently Asked Questions
          </h2>

          <div className='space-y-4'>
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`border rounded-lg overflow-hidden transition-all duration-300 ${
                  expandedFaq === index
                    ? isPremium
                      ? 'border-amber-300'
                      : `border-${primaryColor}-300`
                    : 'border-gray-200'
                }`}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className={`w-full p-4 flex justify-between items-center text-left ${
                    expandedFaq === index
                      ? isPremium
                        ? 'bg-amber-50'
                        : `bg-${primaryColor}-50`
                      : 'bg-white'
                  }`}
                >
                  <span className='font-medium text-gray-900'>
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 transition-transform duration-300 ${
                      expandedFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {expandedFaq === index && (
                  <div className='p-4 border-t border-gray-200 bg-white'>
                    <p className='text-gray-700'>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        className={`rounded-xl overflow-hidden bg-gradient-to-r ${
          isPremium
            ? 'from-amber-600 to-amber-800'
            : `from-${primaryColor}-600 to-${primaryColor}-800`
        } shadow-xl`}
        initial='hidden'
        animate='visible'
        variants={fadeIn}
      >
        <div className='p-8 md:p-12 flex flex-col md:flex-row items-center justify-between'>
          <div className='mb-6 md:mb-0'>
            <h2 className='text-2xl md:text-3xl font-bold text-white mb-2'>
              Ready to Set Sail?
            </h2>
            <p className='text-white/80'>
              Book now and create unforgettable memories on the Caribbean Sea
            </p>
          </div>

          <button
            onClick={handleOpenBookingModal}
            className={`px-8 py-4 rounded-xl ${
              isPremium
                ? 'bg-white text-amber-700 hover:bg-amber-50'
                : 'bg-white text-gray-800 hover:bg-gray-100'
            } font-bold transition-all duration-300 shadow-lg text-lg flex items-center gap-2 min-w-[200px] justify-center`}
          >
            <span>Book Now</span>
            <ArrowRight className='h-5 w-5' />
          </button>
        </div>
      </motion.div>

      {/* What to Bring */}
      <motion.div
        className='bg-white rounded-xl shadow-lg overflow-hidden'
        initial='hidden'
        animate='visible'
        variants={fadeIn}
      >
        <div className='p-8'>
          <h2
            className={`text-2xl font-bold ${
              isPremium ? 'text-amber-800' : `text-${primaryColor}-800`
            } mb-6 flex items-center`}
          >
            <Check className='mr-2' />
            What to Bring
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='flex items-start'>
              <Check
                className={`h-5 w-5 ${
                  isPremium ? 'text-amber-500' : `text-${primaryColor}-500`
                } mr-2 mt-0.5`}
              />
              <div>
                <p className='font-medium text-gray-800'>Swimwear</p>
                <p className='text-sm text-gray-600'>
                  Comfortable for water activities
                </p>
              </div>
            </div>
            <div className='flex items-start'>
              <Check
                className={`h-5 w-5 ${
                  isPremium ? 'text-amber-500' : `text-${primaryColor}-500`
                } mr-2 mt-0.5`}
              />
              <div>
                <p className='font-medium text-gray-800'>Towel</p>
                <p className='text-sm text-gray-600'>
                  For drying off after snorkeling
                </p>
              </div>
            </div>
            <div className='flex items-start'>
              <Check
                className={`h-5 w-5 ${
                  isPremium ? 'text-amber-500' : `text-${primaryColor}-500`
                } mr-2 mt-0.5`}
              />
              <div>
                <p className='font-medium text-gray-800'>Sunscreen</p>
                <p className='text-sm text-gray-600'>
                  Preferably biodegradable
                </p>
              </div>
            </div>
            <div className='flex items-start'>
              <Check
                className={`h-5 w-5 ${
                  isPremium ? 'text-amber-500' : `text-${primaryColor}-500`
                } mr-2 mt-0.5`}
              />
              <div>
                <p className='font-medium text-gray-800'>Camera</p>
                <p className='text-sm text-gray-600'>Waterproof if possible</p>
              </div>
            </div>
            <div className='flex items-start'>
              <Check
                className={`h-5 w-5 ${
                  isPremium ? 'text-amber-500' : `text-${primaryColor}-500`
                } mr-2 mt-0.5`}
              />
              <div>
                <p className='font-medium text-gray-800'>Hat or cap</p>
                <p className='text-sm text-gray-600'>For sun protection</p>
              </div>
            </div>
            <div className='flex items-start'>
              <Check
                className={`h-5 w-5 ${
                  isPremium ? 'text-amber-500' : `text-${primaryColor}-500`
                } mr-2 mt-0.5`}
              />
              <div>
                <p className='font-medium text-gray-800'>Cash</p>
                <p className='text-sm text-gray-600'>
                  For optional purchases or souvenirs
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Important Information or Disclaimer */}
      <motion.div
        className='bg-amber-50 rounded-xl border border-amber-200 p-6'
        initial='hidden'
        animate='visible'
        variants={fadeIn}
      >
        <div className='flex items-start'>
          <AlertCircle className='h-6 w-6 text-amber-500 mr-3 flex-shrink-0 mt-0.5' />
          <div>
            <h3 className='font-semibold text-amber-800 mb-2'>
              Important Information
            </h3>
            <p className='text-amber-700'>
              This tour is subject to weather conditions. In case of
              cancellation due to adverse weather, a full refund will be
              provided or you can reschedule for another day. We recommend
              booking at least 24 hours in advance to ensure availability.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Booking Modal */}
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

// Helper function to get destination descriptions
function getDestinationDescription(destination: string): string {
  const destinations: Record<string, string> = {
    'Isla Saona':
      'Paradise island with white sand beaches and turquoise waters, part of the East National Park.',
    'Arrecifes de coral':
      'Vibrant marine ecosystems with colorful tropical fish and coral formations.',
    'Piscinas naturales':
      'Shallow crystal-clear water banks, perfect for relaxing.',
    'Palmera torcida':
      'Iconic leaning palm tree over the sea, one of the most photographed spots.',
    'Bahía de las Águilas':
      'One of the most beautiful and pristine beaches in the Dominican Republic.',
  };

  return (
    destinations[destination] ||
    'A beautiful destination in the crystal-clear waters of the Caribbean.'
  );
}

export default CatamaranServiceView;
