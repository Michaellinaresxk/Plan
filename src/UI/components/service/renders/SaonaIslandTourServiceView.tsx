import React, { useState } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { Service } from '@/types/type';
import { ServiceData, ServiceExtendedDetails } from '@/types/services';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Ship,
  Users,
  Clock,
  Map,
  Utensils,
  Calendar,
  Camera,
  ArrowRight,
  Star,
  CheckCircle,
  AlertCircle,
  Palmtree,
  CheckCheck,
  ChevronRight,
  ChevronLeft,
  Check,
} from 'lucide-react';
import { useBooking } from '@/context/BookingContext';
import { BookingDate } from '@/types/type';
import BookingModal from '@/UI/components/modal/BookingModal';

interface SaonaIslandTourServiceViewProps {
  service: Service;
  serviceData?: ServiceData;
  extendedDetails?: ServiceExtendedDetails;
  primaryColor: string;
  viewContext?: 'standard-view' | 'premium-view';
}

const SaonaIslandTourServiceView: React.FC<SaonaIslandTourServiceViewProps> = ({
  service,
  serviceData,
  extendedDetails,
  primaryColor,
  viewContext,
}) => {
  const { t } = useTranslation();
  const { bookService, selectedServices } = useBooking();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'faq'>(
    'overview'
  );

  // Determinar si es un servicio premium
  const isPremium =
    service.packageType.includes('premium') || viewContext === 'premium-view';
  const isSelected = selectedServices.some((s) => s.id === service.id);

  // Galería de imágenes de Saona
  const galleryImages = [
    {
      src: 'https://images.unsplash.com/photo-1615787421738-e980903b0640?q=80&w=2874&auto=format&fit=crop',
      alt: 'Pristine beaches of Saona Island',
      caption:
        'The stunning white sand beaches of Saona Island, Dominican Republic',
    },
    {
      src: 'https://images.unsplash.com/photo-1502402772916-f8a62ea50180?q=80&w=2940&auto=format&fit=crop',
      alt: 'Luxury catamaran sailing to Saona',
      caption: 'Sailing to Saona Island aboard our luxurious catamaran',
    },
    {
      src: 'https://images.unsplash.com/photo-1514907283155-ea5f4094c70c?q=80&w=2940&auto=format&fit=crop',
      alt: 'Natural pools experience',
      caption: 'Crystal clear natural pools perfect for snorkeling',
    },
    {
      src: 'https://images.unsplash.com/photo-1518169640858-0d622b058e5c?q=80&w=2874&auto=format&fit=crop',
      alt: 'Tropical buffet lunch',
      caption: 'Delicious tropical buffet lunch served on the island',
    },
    {
      src: 'https://images.unsplash.com/photo-1551918120-9739cb430c6d?q=80&w=2087&auto=format&fit=crop',
      alt: 'Palm trees on Saona Island',
      caption: 'Relax under the shade of palm trees on Saona Island',
    },
  ];

  // Características principales
  const highlights = [
    {
      icon: <Ship className='h-6 w-6' />,
      title: 'Catamaran & Speedboat',
      description: isPremium
        ? 'Premium catamaran experience one way and thrilling speedboat return'
        : 'Comfortable catamaran journey and exciting speedboat experience',
    },
    {
      icon: <Palmtree className='h-6 w-6' />,
      title: 'Pristine Beaches',
      description:
        'Explore the stunning white sand beaches of Saona Island National Park',
    },
    {
      icon: <Utensils className='h-6 w-6' />,
      title: 'Island Buffet',
      description: isPremium
        ? 'Gourmet tropical buffet with premium drinks and specialties'
        : 'Traditional Dominican buffet with tropical fruits and beverages',
    },
    {
      icon: <Users className='h-6 w-6' />,
      title: 'Group Size',
      description: isPremium
        ? 'Smaller groups for a more personalized experience'
        : 'Fun group atmosphere with our friendly staff',
    },
  ];

  // FAQs
  const faqs = [
    {
      question: 'What should I bring for the Saona Island tour?',
      answer:
        "We recommend bringing swimwear, a towel, sunscreen, sunglasses, a hat, comfortable shoes, and a camera. Don't forget some cash for souvenirs or additional beverages.",
    },
    {
      question: 'Is lunch included in the tour?',
      answer:
        'Yes, a delicious Dominican buffet lunch is included in your tour price, along with national drinks. Premium tours include additional gourmet options and premium beverages.',
    },
    {
      question: 'How long is the boat ride to Saona Island?',
      answer:
        'The catamaran journey to Saona Island takes approximately 1.5 hours, while the speedboat return is about 30-40 minutes. Both journeys offer beautiful views and experiences.',
    },
    {
      question: 'Is this tour suitable for children?',
      answer:
        'Yes, the Saona Island tour is family-friendly and suitable for children of all ages. We provide life jackets and our staff ensures everyone is safety throughout the journey.',
    },
    {
      question: 'What if I get seasick easily?',
      answer:
        'Our catamarans are stable vessels that minimize motion sickness. If you are prone to seasickness, we recommend taking medication before the tour and staying in the middle of the boat where there is less movement.',
    },
  ];

  // Manejar la apertura del modal de reserva
  const handleOpenBookingModal = () => {
    setIsModalOpen(true);
  };

  // Manejar la reserva del servicio
  const handleBookingConfirm = (
    service: Service,
    dates: BookingDate,
    guests: number
  ) => {
    bookService(service, dates, guests);
    setIsModalOpen(false);
  };

  // Navegar por la galería de imágenes
  const navigateGallery = (direction: number) => {
    const newIndex = galleryIndex + direction;
    if (newIndex >= 0 && newIndex < galleryImages.length) {
      setGalleryIndex(newIndex);
    }
  };

  // Animación para elementos
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  return (
    <div className='space-y-12'>
      {/* Hero Section */}
      <motion.div
        className='relative h-[60vh] rounded-3xl overflow-hidden'
        initial='hidden'
        animate='visible'
        variants={fadeIn}
      >
        <Image
          src={galleryImages[0].src}
          alt='Saona Island Paradise'
          fill
          className='object-cover'
          priority
        />

        <div
          className={`absolute inset-0 bg-gradient-to-br from-${primaryColor}-900/90 via-${primaryColor}-800/70 to-transparent`}
        >
          <div className='absolute bottom-0 left-0 right-0 p-8 text-white'>
            <div className='flex items-center mb-4'>
              {isPremium ? (
                <div className='bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full flex items-center'>
                  <Star className='text-yellow-300 mr-2 h-4 w-4' />
                  <span className='text-sm font-semibold uppercase tracking-wider text-yellow-100'>
                    Premium Experience
                  </span>
                </div>
              ) : (
                <div className='bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full flex items-center'>
                  <Ship className='text-white mr-2 h-4 w-4' />
                  <span className='text-sm font-medium'>
                    Tropical Adventure
                  </span>
                </div>
              )}
            </div>

            <h1 className='text-4xl md:text-5xl font-bold mb-2'>
              {serviceData?.titleKey
                ? t(serviceData.titleKey)
                : 'Saona Island Paradise Tour'}
            </h1>

            <p className='text-xl md:text-2xl text-white/90 max-w-2xl'>
              {serviceData?.descriptionKey
                ? t(serviceData.descriptionKey)
                : 'Experience the jewel of the Caribbean with our unforgettable Saona Island adventure'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <div className='border-b border-gray-200'>
        <nav className='flex space-x-8'>
          <button
            onClick={() => setSelectedTab('overview')}
            className={`py-4 px-1 font-medium text-sm border-b-2 ${
              selectedTab === 'overview'
                ? `border-${primaryColor}-500 text-${primaryColor}-600`
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Tour Overview
          </button>

          <button
            onClick={() => setSelectedTab('faq')}
            className={`py-4 px-1 font-medium text-sm border-b-2 ${
              selectedTab === 'faq'
                ? `border-${primaryColor}-500 text-${primaryColor}-600`
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            FAQs
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className='mt-8'>
        {/* Overview Tab */}
        {selectedTab === 'overview' && (
          <motion.div
            className='space-y-10'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {/* Tour Description */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8 items-center'>
              <div>
                <h2
                  className={`text-2xl font-bold text-${primaryColor}-800 mb-4`}
                >
                  Experience the Caribbean Paradise
                </h2>
                <div className='prose max-w-none text-gray-700'>
                  <p className='mb-4'>
                    {serviceData?.fullDescriptionKey
                      ? t(serviceData.fullDescriptionKey)
                      : 'Discover the breathtaking beauty of Saona Island, a protected nature reserve and part of Cotubanamá National Park. This paradise island features pristine white-sand beaches, crystal-clear turquoise waters, and swaying palm trees that create a picture-perfect tropical setting.'}
                  </p>
                  <p>
                    Our Saona Island tour combines the best of both worlds: a
                    relaxing catamaran sailing experience on the way to the
                    island and an exhilarating speedboat adventure on the return
                    journey. Along the way, we'll stop at the famous natural
                    pools where you can wade in crystal-clear shallow waters and
                    observe starfish in their natural habitat.
                  </p>
                </div>
              </div>
              <div className='relative h-[400px] rounded-xl overflow-hidden shadow-xl'>
                <Image
                  src={galleryImages[1].src}
                  alt='Catamaran sailing to Saona Island'
                  fill
                  className='object-cover'
                />
              </div>
            </div>

            {/* Call to Action */}
            <motion.div
              className={`rounded-xl overflow-hidden bg-gradient-to-r from-${primaryColor}-600 to-${primaryColor}-500 shadow-xl`}
              initial='hidden'
              animate='visible'
              variants={fadeIn}
            >
              <div className='p-8 md:p-12 flex flex-col md:flex-row items-center justify-between'>
                <div className='mb-6 md:mb-0'>
                  <h2 className='text-2xl md:text-3xl font-bold text-white mb-2'>
                    Ready for a Paradise Adventure?
                  </h2>
                  <p className='text-white/80'>
                    Book your Saona Island tour now and create unforgettable
                    memories in the Caribbean paradise
                  </p>
                </div>

                <button
                  onClick={handleOpenBookingModal}
                  className={`px-8 py-4 rounded-xl ${
                    isSelected
                      ? 'bg-white text-gray-800 hover:bg-gray-100'
                      : 'bg-black/20 backdrop-blur-sm text-white hover:bg-black/30'
                  } font-bold transition-all duration-300 shadow-lg text-lg flex items-center gap-2 min-w-[200px] justify-center`}
                >
                  {isSelected ? (
                    <>
                      <CheckCheck className='h-5 w-5' />
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

            {/* Gallery Section */}
            <div className='bg-white rounded-xl shadow-md overflow-hidden p-6'>
              <h2
                className={`text-2xl font-bold text-${primaryColor}-800 mb-6 flex items-center`}
              >
                <Camera className='mr-2' />
                Tour Gallery
              </h2>

              <div className='relative'>
                {/* Main Gallery Image */}
                <div className='relative h-96 rounded-lg overflow-hidden'>
                  <Image
                    src={galleryImages[galleryIndex].src}
                    alt={galleryImages[galleryIndex].alt}
                    fill
                    className='object-cover'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-70'></div>
                  <div className='absolute bottom-0 left-0 right-0 p-4'>
                    <p className='text-white text-lg'>
                      {galleryImages[galleryIndex].caption}
                    </p>
                  </div>
                </div>

                {/* Gallery Navigation */}
                <div className='absolute inset-y-0 flex items-center justify-between px-4'>
                  <button
                    onClick={() => navigateGallery(-1)}
                    disabled={galleryIndex === 0}
                    className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      galleryIndex === 0
                        ? 'bg-black/20 text-gray-400 cursor-not-allowed'
                        : 'bg-black/50 text-white hover:bg-black/70'
                    }`}
                  >
                    <ChevronLeft className='h-6 w-6' />
                  </button>

                  <button
                    onClick={() => navigateGallery(1)}
                    disabled={galleryIndex === galleryImages.length - 1}
                    className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      galleryIndex === galleryImages.length - 1
                        ? 'bg-black/20 text-gray-400 cursor-not-allowed'
                        : 'bg-black/50 text-white hover:bg-black/70'
                    }`}
                  >
                    <ChevronRight className='h-6 w-6' />
                  </button>
                </div>
              </div>

              {/* Gallery Thumbnails */}
              <div className='grid grid-cols-5 gap-2 mt-4'>
                {galleryImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setGalleryIndex(index)}
                    className={`relative aspect-square rounded-md overflow-hidden ${
                      galleryIndex === index
                        ? `ring-2 ring-${primaryColor}-500`
                        : ''
                    }`}
                  >
                    <Image
                      src={image.src}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className='object-cover'
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* What's Included Section */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              {/* Included */}
              <div className='bg-white rounded-xl shadow-md p-6'>
                <h2
                  className={`text-xl font-bold text-${primaryColor}-800 mb-4 flex items-center`}
                >
                  <CheckCircle className='mr-2' />
                  What is Included
                </h2>
                <ul className='space-y-3'>
                  <li className='flex items-start'>
                    <div
                      className={`mt-1 h-5 w-5 rounded-full bg-${primaryColor}-100 flex items-center justify-center mr-3 flex-shrink-0`}
                    >
                      <Check className={`h-3 w-3 text-${primaryColor}-600`} />
                    </div>
                    <span className='text-gray-700'>
                      Hotel pickup and drop-off service
                    </span>
                  </li>
                  <li className='flex items-start'>
                    <div
                      className={`mt-1 h-5 w-5 rounded-full bg-${primaryColor}-100 flex items-center justify-center mr-3 flex-shrink-0`}
                    >
                      <Check className={`h-3 w-3 text-${primaryColor}-600`} />
                    </div>
                    <span className='text-gray-700'>
                      Catamaran sailing to Saona Island
                    </span>
                  </li>
                  <li className='flex items-start'>
                    <div
                      className={`mt-1 h-5 w-5 rounded-full bg-${primaryColor}-100 flex items-center justify-center mr-3 flex-shrink-0`}
                    >
                      <Check className={`h-3 w-3 text-${primaryColor}-600`} />
                    </div>
                    <span className='text-gray-700'>
                      Speedboat return journey
                    </span>
                  </li>
                  <li className='flex items-start'>
                    <div
                      className={`mt-1 h-5 w-5 rounded-full bg-${primaryColor}-100 flex items-center justify-center mr-3 flex-shrink-0`}
                    >
                      <Check className={`h-3 w-3 text-${primaryColor}-600`} />
                    </div>
                    <span className='text-gray-700'>
                      Visit to the famous natural pools
                    </span>
                  </li>
                  <li className='flex items-start'>
                    <div
                      className={`mt-1 h-5 w-5 rounded-full bg-${primaryColor}-100 flex items-center justify-center mr-3 flex-shrink-0`}
                    >
                      <Check className={`h-3 w-3 text-${primaryColor}-600`} />
                    </div>
                    <span className='text-gray-700'>
                      Dominican buffet lunch
                    </span>
                  </li>
                  <li className='flex items-start'>
                    <div
                      className={`mt-1 h-5 w-5 rounded-full bg-${primaryColor}-100 flex items-center justify-center mr-3 flex-shrink-0`}
                    >
                      <Check className={`h-3 w-3 text-${primaryColor}-600`} />
                    </div>
                    <span className='text-gray-700'>
                      Open bar with national drinks
                    </span>
                  </li>
                  <li className='flex items-start'>
                    <div
                      className={`mt-1 h-5 w-5 rounded-full bg-${primaryColor}-100 flex items-center justify-center mr-3 flex-shrink-0`}
                    >
                      <Check className={`h-3 w-3 text-${primaryColor}-600`} />
                    </div>
                    <span className='text-gray-700'>
                      Professional guides and staff
                    </span>
                  </li>
                  {isPremium && (
                    <li className='flex items-start'>
                      <div
                        className={`mt-1 h-5 w-5 rounded-full bg-${primaryColor}-100 flex items-center justify-center mr-3 flex-shrink-0`}
                      >
                        <Check className={`h-3 w-3 text-${primaryColor}-600`} />
                      </div>
                      <span className='text-gray-700'>
                        Premium beverages and cocktails
                      </span>
                    </li>
                  )}
                </ul>
              </div>

              {/* Not Included */}
              <div className='bg-white rounded-xl shadow-md p-6'>
                <h2
                  className={`text-xl font-bold text-${primaryColor}-800 mb-4 flex items-center`}
                >
                  <AlertCircle className='mr-2' />
                  Additional Information
                </h2>
                <div className='space-y-4'>
                  <div>
                    <h3 className='font-medium text-gray-800 mb-2'>
                      Not Included:
                    </h3>
                    <ul className='space-y-2'>
                      <li className='flex items-start text-gray-700'>
                        <span className='mr-2'>•</span>
                        <span>
                          Premium international beverages (available for
                          purchase)
                        </span>
                      </li>
                      <li className='flex items-start text-gray-700'>
                        <span className='mr-2'>•</span>
                        <span>Souvenirs and personal expenses</span>
                      </li>
                      <li className='flex items-start text-gray-700'>
                        <span className='mr-2'>•</span>
                        <span>Gratuities for guides and staff (optional)</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className='font-medium text-gray-800 mb-2'>
                      What to Bring:
                    </h3>
                    <ul className='space-y-2'>
                      <li className='flex items-start text-gray-700'>
                        <span className='mr-2'>•</span>
                        <span>Swimwear and beach towel</span>
                      </li>
                      <li className='flex items-start text-gray-700'>
                        <span className='mr-2'>•</span>
                        <span>Sunscreen and sunglasses</span>
                      </li>
                      <li className='flex items-start text-gray-700'>
                        <span className='mr-2'>•</span>
                        <span>Comfortable clothing and footwear</span>
                      </li>
                      <li className='flex items-start text-gray-700'>
                        <span className='mr-2'>•</span>
                        <span>Camera (waterproof if possible)</span>
                      </li>
                      <li className='flex items-start text-gray-700'>
                        <span className='mr-2'>•</span>
                        <span>Cash for souvenirs or additional beverages</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* FAQ Tab */}
        {selectedTab === 'faq' && (
          <motion.div
            className='space-y-8'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className='bg-white rounded-xl shadow-md p-6'>
              <h2
                className={`text-2xl font-bold text-${primaryColor}-800 mb-6`}
              >
                Frequently Asked Questions
              </h2>

              <div className='space-y-4'>
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border border-gray-200 hover:border-${primaryColor}-200 transition-colors`}
                  >
                    <h3 className='font-medium text-gray-900 mb-2'>
                      {faq.question}
                    </h3>
                    <p className='text-gray-700'>{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Quick Details Cards */}
      <motion.div
        className='grid grid-cols-1 md:grid-cols-4 gap-4'
        initial='hidden'
        animate='visible'
        variants={fadeIn}
      >
        {highlights.map((highlight, index) => (
          <motion.div
            key={index}
            className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border-t-4 border-${primaryColor}-500`}
            variants={fadeIn}
            transition={{ delay: index * 0.1 }}
          >
            <div
              className={`h-12 w-12 rounded-full bg-${primaryColor}-50 text-${primaryColor}-600 flex items-center justify-center mb-4`}
            >
              {highlight.icon}
            </div>
            <h3 className='font-bold text-gray-800 mb-2'>{highlight.title}</h3>
            <p className='text-gray-600 text-sm'>{highlight.description}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Important Information */}
      <motion.div
        className='p-4 bg-amber-50 rounded-lg border border-amber-100'
        initial='hidden'
        animate='visible'
        variants={fadeIn}
      >
        <h4 className='font-medium text-amber-800 mb-2 flex items-center'>
          <AlertCircle className='w-5 h-5 mr-2' />
          Important Information
        </h4>
        <p className='text-amber-700'>
          This tour is subject to weather conditions. In case of cancellation
          due to weather, a full refund will be provided or you can reschedule
          for another day. Please book at least 24 hours in advance to ensure
          availability.
        </p>
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

export default SaonaIslandTourServiceView;
