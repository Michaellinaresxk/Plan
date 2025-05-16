import React, { useState } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { Service } from '@/types/type';
import { ServiceData } from '@/types/services';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  ChefHat,
  Clock,
  Calendar,
  Users,
  Check,
  Star,
  Utensils,
  Menu,
  AlertCircle,
  ArrowRight,
  Heart,
  GlassWater,
  ShoppingBag,
} from 'lucide-react';
import BookingModal from '@/UI/components/modal/BookingModal';
import { useBooking } from '@/context/BookingContext';
import { BookingDate } from '@/types/type';

interface ChefServiceViewProps {
  service: Service;
  serviceData?: ServiceData;
  primaryColor: string;
}

/**
 * A modern, professional component for displaying chef services
 * Showcases cuisine types, meal options, and the chef experience
 */
const ChefServiceView: React.FC<ChefServiceViewProps> = ({
  service,
  serviceData,
  primaryColor,
}) => {
  const { t } = useTranslation();
  const { bookService, selectedServices } = useBooking();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'cuisines' | 'process'
  >('overview');

  // Determine if this is a premium service
  const isPremium = service.packageType.includes('premium');

  // Determine if the service is already selected
  const isSelected = selectedServices.some((s) => s.id === service.id);

  // Extract cuisine options if they exist
  const cuisineOptions = serviceData?.options?.cuisineType?.subOptions || {};

  // Extract meal options if they exist
  const mealOptions = serviceData?.options?.mealCount?.subOptions || {};

  // Get maximum number of people
  const maxPeople = serviceData?.metaData?.maxPeople || 10;

  // Gallery images for chef experience
  const galleryImages = [
    {
      src: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?q=80&w=2070&auto=format&fit=crop',
      alt: 'Chef preparing gourmet meal',
    },
    {
      src: 'https://images.unsplash.com/photo-1577106263724-2c8e03bfe9cf?q=80&w=2070&auto=format&fit=crop',
      alt: 'Elegantly plated dish',
    },
    {
      src: 'https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?q=80&w=2074&auto=format&fit=crop',
      alt: 'Chef in kitchen',
    },
    {
      src: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=2070&auto=format&fit=crop',
      alt: 'Private dining experience',
    },
  ];

  // Sample menu items
  const sampleMenuItems = [
    {
      category: 'Starters',
      items: [
        {
          name: 'Truffle Arancini',
          description: 'Wild mushroom risotto balls with truffle aioli',
          isSignature: true,
        },
        {
          name: 'Scallop Ceviche',
          description: 'Fresh scallops, citrus, avocado, chili',
          isSignature: false,
        },
        {
          name: 'Goat Cheese Tart',
          description: 'Caramelized onions, fig jam, micro herbs',
          isSignature: false,
        },
      ],
    },
    {
      category: 'Main Courses',
      items: [
        {
          name: 'Sous Vide Filet Mignon',
          description:
            'Truffle mashed potatoes, seasonal vegetables, red wine reduction',
          isSignature: true,
        },
        {
          name: 'Pan-Seared Sea Bass',
          description: 'Saffron risotto, roasted fennel, lemon beurre blanc',
          isSignature: false,
        },
        {
          name: 'Wild Mushroom Ravioli',
          description:
            'House-made pasta, sage brown butter sauce, aged parmesan',
          isSignature: false,
        },
      ],
    },
    {
      category: 'Desserts',
      items: [
        {
          name: 'Chocolate Fondant',
          description:
            'Warm chocolate cake, vanilla bean ice cream, berry coulis',
          isSignature: true,
        },
        {
          name: 'Crème Brûlée Trio',
          description: 'Classic vanilla, espresso, and lavender infused',
          isSignature: false,
        },
      ],
    },
  ];

  // Chef experience steps
  const chefExperienceSteps = [
    {
      title: 'Initial Consultation',
      description:
        'We discuss your preferences, dietary restrictions, and event details to create a personalized culinary experience.',
      icon: <Calendar className='h-6 w-6' />,
    },
    {
      title: 'Menu Design',
      description:
        'Our chef creates a custom menu tailored to your taste, using the freshest seasonal ingredients available.',
      icon: <Menu className='h-6 w-6' />,
    },
    {
      title: 'Shopping & Preparation',
      description:
        'On the day of your event, our chef shops for premium ingredients and arrives at your location to prepare everything from scratch.',
      icon: <ShoppingBag className='h-6 w-6' />,
    },
    {
      title: 'Culinary Experience',
      description:
        'Sit back and enjoy a restaurant-quality dining experience in the comfort of your home, with professional service and presentation.',
      icon: <Utensils className='h-6 w-6' />,
    },
  ];

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

  return (
    <div className='space-y-10'>
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className='relative h-[60vh] rounded-2xl overflow-hidden'
      >
        <Image
          src='https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop'
          alt='Chef preparation'
          fill
          className='object-cover'
        />
        <div className='absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/80'></div>

        <div className='absolute bottom-0 left-0 right-0 p-10 md:p-16 text-white'>
          {isPremium && (
            <span className='inline-block px-3 py-1 bg-amber-500 text-amber-900 text-xs font-bold uppercase rounded-full mb-4'>
              Premium Experience
            </span>
          )}
          <h1 className='text-3xl md:text-5xl font-bold mb-4'>
            {serviceData?.titleKey
              ? t(serviceData.titleKey)
              : 'Private Chef Experience'}
          </h1>
          <p className='text-lg md:text-xl text-white/90 mb-8 max-w-2xl'>
            Exquisite dining in the comfort of your home, crafted by
            professional chefs using the finest ingredients.
          </p>

          <button
            onClick={handleOpenBookingModal}
            className={`px-8 py-4 ${
              isPremium
                ? 'bg-amber-500 hover:bg-amber-600 text-amber-900'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            } rounded-lg font-bold flex items-center gap-2 transition transform hover:scale-105`}
          >
            <span>Book Your Chef</span>
            <ArrowRight className='h-5 w-5' />
          </button>
        </div>
      </motion.div>

      {/* Key Features */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className='p-8 bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition'
        >
          <div
            className={`p-3 rounded-full inline-flex bg-${primaryColor}-100 text-${primaryColor}-600 mb-4`}
          >
            <ChefHat className='h-6 w-6' />
          </div>
          <h3 className='text-xl font-bold text-gray-900 mb-2'>
            Professional Chef
          </h3>
          <p className='text-gray-600'>
            {isPremium
              ? 'Michelin-trained culinary experts bringing five-star dining experiences to your home'
              : 'Experienced chefs creating personalized dining experiences tailored to your preferences'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className='p-8 bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition'
        >
          <div
            className={`p-3 rounded-full inline-flex bg-${primaryColor}-100 text-${primaryColor}-600 mb-4`}
          >
            <Users className='h-6 w-6' />
          </div>
          <h3 className='text-xl font-bold text-gray-900 mb-2'>
            Customizable Experience
          </h3>
          <p className='text-gray-600'>
            From intimate dinners to celebrations, we serve groups of up to{' '}
            {maxPeople} people with custom menus
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className='p-8 bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition'
        >
          <div
            className={`p-3 rounded-full inline-flex bg-${primaryColor}-100 text-${primaryColor}-600 mb-4`}
          >
            <Utensils className='h-6 w-6' />
          </div>
          <h3 className='text-xl font-bold text-gray-900 mb-2'>
            Gourmet Cuisine
          </h3>
          <p className='text-gray-600'>
            {isPremium
              ? 'Premium ingredients and extraordinary presentation for an unforgettable culinary journey'
              : 'Fresh, locally-sourced ingredients prepared with care for a delightful dining experience'}
          </p>
        </motion.div>
      </div>

      {/* Navigation Tabs */}
      <div className='flex border-b border-gray-200 overflow-x-auto pb-px'>
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-4 px-6 text-sm font-medium border-b-2 ${
            activeTab === 'overview'
              ? `border-${primaryColor}-500 text-${primaryColor}-600`
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          } transition-colors`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('cuisines')}
          className={`py-4 px-6 text-sm font-medium border-b-2 ${
            activeTab === 'cuisines'
              ? `border-${primaryColor}-500 text-${primaryColor}-600`
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          } transition-colors`}
        >
          Cuisines & Options
        </button>
        <button
          onClick={() => setActiveTab('process')}
          className={`py-4 px-6 text-sm font-medium border-b-2 ${
            activeTab === 'process'
              ? `border-${primaryColor}-500 text-${primaryColor}-600`
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          } transition-colors`}
        >
          How It Works
        </button>
      </div>

      {/* Tab Content */}
      <div className='mt-6'>
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className='space-y-10'
          >
            {/* Description */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-10 items-center'>
              <div>
                <h2
                  className={`text-2xl md:text-3xl font-bold mb-6 text-${primaryColor}-800`}
                >
                  A Culinary Journey at Home
                </h2>
                <div className='prose max-w-none text-gray-700'>
                  <p className='mb-4 text-lg'>
                    {serviceData?.fullDescriptionKey
                      ? t(serviceData.fullDescriptionKey)
                      : 'Experience the luxury of restaurant-quality dining in the comfort of your own space. Our private chef service brings the entire fine dining experience to you - from menu planning to preparation, service, and cleanup.'}
                  </p>
                  <p>
                    Whether you're celebrating a special occasion, hosting an
                    intimate dinner party, or simply treating yourself to an
                    exceptional meal, our chefs create memorable culinary
                    experiences tailored to your tastes and preferences.
                  </p>
                </div>
              </div>

              <div className='relative h-80 rounded-xl overflow-hidden shadow-xl'>
                <Image
                  src='https://images.unsplash.com/photo-1581299894007-aaa50297cf16?q=80&w=2070&auto=format&fit=crop'
                  alt='Chef preparing food'
                  fill
                  className='object-cover'
                />
              </div>
            </div>

            {/* Gallery Section */}
            <div>
              <h2
                className={`text-2xl font-bold mb-6 text-${primaryColor}-800`}
              >
                The Chef Experience
              </h2>

              <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                {galleryImages.map((image, index) => (
                  <div
                    key={index}
                    className='aspect-square relative rounded-xl overflow-hidden group'
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className='object-cover transition-transform duration-500 group-hover:scale-110'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end'>
                      <p className='p-4 text-white text-sm'>{image.alt}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonials */}
            <div className='bg-gray-50 rounded-xl p-8'>
              <h2
                className={`text-2xl font-bold mb-6 text-${primaryColor}-800`}
              >
                What Our Clients Say
              </h2>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                <div className='bg-white p-6 rounded-xl shadow-sm'>
                  <div className='flex mb-4'>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 text-${primaryColor}-400 fill-${primaryColor}-400 mr-1`}
                      />
                    ))}
                  </div>
                  <p className='italic text-gray-700 mb-4'>
                    "Our private chef experience exceeded all expectations. The
                    food was exceptional, the service impeccable, and our guests
                    were thoroughly impressed. It was like having a 5-star
                    restaurant in our dining room."
                  </p>
                  <p className='text-sm font-medium text-gray-900'>
                    — Michael & Sarah, Anniversary Dinner
                  </p>
                </div>

                <div className='bg-white p-6 rounded-xl shadow-sm'>
                  <div className='flex mb-4'>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 text-${primaryColor}-400 fill-${primaryColor}-400 mr-1`}
                      />
                    ))}
                  </div>
                  <p className='italic text-gray-700 mb-4'>
                    "Having a professional chef prepare our dinner party was the
                    best decision. The menu was perfectly tailored to our
                    preferences, and we could actually enjoy our own party
                    without the stress of cooking!"
                  </p>
                  <p className='text-sm font-medium text-gray-900'>
                    — Jennifer L., Dinner Party for 8
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Cuisines & Options Tab */}
        {activeTab === 'cuisines' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className='space-y-10'
          >
            {/* Cuisine Types */}
            <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
              <div className='p-8'>
                <h2
                  className={`text-2xl font-bold mb-6 text-${primaryColor}-800 flex items-center`}
                >
                  <GlassWater className='mr-2' />
                  Cuisine Specialties
                </h2>

                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
                  {Object.entries(cuisineOptions).length > 0
                    ? Object.entries(cuisineOptions).map(([key, cuisine]) => (
                        <div
                          key={key}
                          className={`relative rounded-xl overflow-hidden group h-60 flex items-center justify-center`}
                        >
                          <div className='absolute inset-0 z-0'>
                            <Image
                              src={getCuisineImage(key)}
                              alt={
                                typeof cuisine === 'object' &&
                                'nameKey' in cuisine
                                  ? t(cuisine.nameKey, { fallback: key })
                                  : key
                              }
                              fill
                              className='object-cover transition-transform duration-700 group-hover:scale-110'
                            />
                            <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-black/30'></div>
                          </div>

                          <div className='relative z-10 text-center p-6'>
                            <h3 className='text-xl font-bold text-white mb-2'>
                              {typeof cuisine === 'object' &&
                              'nameKey' in cuisine
                                ? t(cuisine.nameKey, {
                                    fallback: formatCuisineName(key),
                                  })
                                : formatCuisineName(key)}
                            </h3>

                            {isPremium && (
                              <p className='text-white/90 text-sm'>
                                Premium ingredients and authentic techniques
                              </p>
                            )}

                            <div
                              className={`mt-3 inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs`}
                            >
                              Chef Specialty
                            </div>
                          </div>
                        </div>
                      ))
                    : /* Default cuisines if none defined */
                      [
                        'italian',
                        'french',
                        'asian',
                        'mediterranean',
                        'latin',
                        'plant-based',
                      ].map((cuisine) => (
                        <div
                          key={cuisine}
                          className={`relative rounded-xl overflow-hidden group h-60 flex items-center justify-center`}
                        >
                          <div className='absolute inset-0 z-0'>
                            <Image
                              src={getCuisineImage(cuisine)}
                              alt={formatCuisineName(cuisine)}
                              fill
                              className='object-cover transition-transform duration-700 group-hover:scale-110'
                            />
                            <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-black/30'></div>
                          </div>

                          <div className='relative z-10 text-center p-6'>
                            <h3 className='text-xl font-bold text-white mb-2'>
                              {formatCuisineName(cuisine)}
                            </h3>

                            {isPremium && (
                              <p className='text-white/90 text-sm'>
                                Premium ingredients and authentic techniques
                              </p>
                            )}

                            <div
                              className={`mt-3 inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs`}
                            >
                              Chef Specialty
                            </div>
                          </div>
                        </div>
                      ))}
                </div>
              </div>
            </div>

            {/* Meal Options */}
            <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
              <div className='p-8'>
                <h2
                  className={`text-2xl font-bold mb-6 text-${primaryColor}-800 flex items-center`}
                >
                  <Clock className='mr-2' />
                  Meal Options
                </h2>

                <div className='space-y-4'>
                  {Object.entries(mealOptions).length > 0
                    ? Object.entries(mealOptions).map(([key, meal]) => (
                        <div
                          key={key}
                          className='p-6 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors'
                        >
                          <div className='flex items-start justify-between'>
                            <div className='flex items-center'>
                              <div
                                className={`p-3 rounded-full bg-${primaryColor}-100 text-${primaryColor}-600 mr-4`}
                              >
                                {key === 'breakfast' ? (
                                  <Clock className='h-5 w-5' />
                                ) : key === 'lunch' ? (
                                  <Utensils className='h-5 w-5' />
                                ) : key === 'dinner' ? (
                                  <Utensils className='h-5 w-5' />
                                ) : key === 'fullDay' ? (
                                  <Calendar className='h-5 w-5' />
                                ) : key === 'appetizers' ? (
                                  <Utensils className='h-5 w-5' />
                                ) : (
                                  <Utensils className='h-5 w-5' />
                                )}
                              </div>
                              <div>
                                <h3 className='text-xl font-bold text-gray-900'>
                                  {typeof meal === 'object' && 'nameKey' in meal
                                    ? t(meal.nameKey, {
                                        fallback: formatMealName(key),
                                      })
                                    : formatMealName(key)}
                                </h3>

                                {key === 'fullDay' && (
                                  <p className='text-gray-600 mt-1'>
                                    Complete culinary experience with breakfast,
                                    lunch, and dinner
                                  </p>
                                )}

                                {typeof meal === 'object' &&
                                  'descriptionKey' in meal && (
                                    <p className='text-gray-600 mt-1'>
                                      {t(meal.descriptionKey, { fallback: '' })}
                                    </p>
                                  )}
                              </div>
                            </div>

                            {typeof meal === 'object' && 'price' in meal && (
                              <div className='text-right'>
                                {meal.price > 0 ? (
                                  <span
                                    className={`text-${primaryColor}-600 font-bold text-xl`}
                                  >
                                    +${meal.price}
                                  </span>
                                ) : null}

                                <button
                                  onClick={handleOpenBookingModal}
                                  className={`block mt-2 px-4 py-2 bg-${primaryColor}-100 text-${primaryColor}-700 hover:bg-${primaryColor}-200 rounded-lg text-sm font-medium transition-colors`}
                                >
                                  Select
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    : /* Default meal options if none defined */
                      [
                        'breakfast',
                        'lunch',
                        'dinner',
                        'fullDay',
                        'appetizers',
                      ].map((mealType) => (
                        <div
                          key={mealType}
                          className='p-6 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors'
                        >
                          <div className='flex items-start justify-between'>
                            <div className='flex items-center'>
                              <div
                                className={`p-3 rounded-full bg-${primaryColor}-100 text-${primaryColor}-600 mr-4`}
                              >
                                {mealType === 'breakfast' ? (
                                  <Clock className='h-5 w-5' />
                                ) : mealType === 'lunch' ? (
                                  <Utensils className='h-5 w-5' />
                                ) : mealType === 'dinner' ? (
                                  <Utensils className='h-5 w-5' />
                                ) : mealType === 'fullDay' ? (
                                  <Calendar className='h-5 w-5' />
                                ) : mealType === 'appetizers' ? (
                                  <Utensils className='h-5 w-5' />
                                ) : (
                                  <Utensils className='h-5 w-5' />
                                )}
                              </div>
                              <div>
                                <h3 className='text-xl font-bold text-gray-900'>
                                  {formatMealName(mealType)}
                                </h3>

                                {mealType === 'fullDay' && (
                                  <p className='text-gray-600 mt-1'>
                                    Complete culinary experience with breakfast,
                                    lunch, and dinner
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className='text-right'>
                              {mealType === 'lunch' || mealType === 'dinner' ? (
                                <span
                                  className={`text-${primaryColor}-600 font-bold text-xl`}
                                >
                                  +$0
                                </span>
                              ) : mealType === 'fullDay' ? (
                                <span
                                  className={`text-${primaryColor}-600 font-bold text-xl`}
                                >
                                  +$150
                                </span>
                              ) : null}

                              <button
                                onClick={handleOpenBookingModal}
                                className={`block mt-2 px-4 py-2 bg-${primaryColor}-100 text-${primaryColor}-700 hover:bg-${primaryColor}-200 rounded-lg text-sm font-medium transition-colors`}
                              >
                                Select
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                </div>
              </div>
            </div>

            {/* Dietary Accommodations */}
            <div className='bg-white rounded-xl shadow-lg overflow-hidden p-8'>
              <h2
                className={`text-2xl font-bold mb-6 text-${primaryColor}-800 flex items-center`}
              >
                <Heart className='mr-2' />
                Dietary Accommodations
              </h2>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                {[
                  'Vegetarian',
                  'Vegan',
                  'Gluten-Free',
                  'Dairy-Free',
                  'Keto',
                  'Low-Sodium',
                ].map((diet) => (
                  <div
                    key={diet}
                    className='flex items-center p-4 bg-gray-50 rounded-lg border border-gray-200'
                  >
                    <Check
                      className={`h-5 w-5 text-${primaryColor}-500 mr-3`}
                    />
                    <span className='text-gray-800'>{diet}</span>
                  </div>
                ))}
              </div>

              <div className='mt-6 p-4 bg-amber-50 rounded-lg border border-amber-100 flex items-start'>
                <AlertCircle className='h-5 w-5 text-amber-500 mr-3 mt-0.5 flex-shrink-0' />
                <div>
                  <p className='text-amber-800 font-medium'>
                    Special Dietary Requirements
                  </p>
                  <p className='text-amber-700 text-sm mt-1'>
                    Please inform us of any allergies or special dietary
                    requirements when booking. Our chefs will accommodate your
                    needs and ensure a safe dining experience.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Process Tab */}
        {activeTab === 'process' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className='space-y-10'
          >
            {/* How It Works */}
            <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
              <div className='p-8'>
                <h2
                  className={`text-2xl font-bold mb-10 text-${primaryColor}-800`}
                >
                  The Chef Experience Process
                </h2>

                <div className='relative'>
                  {/* Process Timeline */}
                  <div className='absolute left-[26px] top-[24px] bottom-16 w-0.5 bg-gray-200 z-0 hidden md:block'></div>

                  <div className='space-y-12'>
                    {chefExperienceSteps.map((step, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className='flex flex-col md:flex-row gap-6'
                      >
                        <div className='z-10'>
                          <div
                            className={`relative h-12 w-12 rounded-full bg-${primaryColor}-100 text-${primaryColor}-600 flex items-center justify-center flex-shrink-0 border-4 border-white`}
                          >
                            {step.icon}
                          </div>
                        </div>

                        <div
                          className={`flex-1 p-6 rounded-xl bg-${primaryColor}-50/40 border border-${primaryColor}-100`}
                        >
                          <h3 className='text-xl font-bold text-gray-900 mb-2'>
                            {step.title}
                          </h3>
                          <p className='text-gray-700'>{step.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className='mt-10 text-center pt-10 border-t border-gray-100'>
                  <button
                    onClick={handleOpenBookingModal}
                    className={`px-8 py-4 bg-${primaryColor}-500 hover:bg-${primaryColor}-600 text-white rounded-lg font-bold inline-flex items-center gap-2`}
                  >
                    <span>Start Your Chef Experience</span>
                    <ArrowRight className='h-5 w-5' />
                  </button>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
              <div className='p-8'>
                <h2
                  className={`text-2xl font-bold mb-6 text-${primaryColor}-800`}
                >
                  Frequently Asked Questions
                </h2>

                <div className='space-y-4'>
                  <div className='border border-gray-200 rounded-lg p-6'>
                    <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                      Do I need to provide any cooking equipment?
                    </h3>
                    <p className='text-gray-700'>
                      Our chefs bring their own professional knives and
                      specialized tools, but they will utilize your kitchen
                      equipment such as pots, pans, and serving dishes. If you
                      have any concerns about your kitchen setup, please let us
                      know in advance.
                    </p>
                  </div>

                  <div className='border border-gray-200 rounded-lg p-6'>
                    <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                      How far in advance should I book?
                    </h3>
                    <p className='text-gray-700'>
                      We recommend booking at least 7-14 days in advance to
                      ensure availability and allow time for menu planning. For
                      special occasions or peak periods, earlier booking is
                      advisable.
                    </p>
                  </div>

                  <div className='border border-gray-200 rounded-lg p-6'>
                    <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                      Do you handle cleanup afterward?
                    </h3>
                    <p className='text-gray-700'>
                      Yes, our service includes complete kitchen cleanup. Your
                      chef will leave the kitchen as clean as they found it,
                      washing all cooking equipment and surfaces used during
                      preparation and service.
                    </p>
                  </div>

                  <div className='border border-gray-200 rounded-lg p-6'>
                    <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                      Can I purchase groceries myself?
                    </h3>
                    <p className='text-gray-700'>
                      While our chefs typically handle grocery shopping to
                      ensure the freshest, highest-quality ingredients, you can
                      arrange to purchase groceries yourself if preferred.
                      Please discuss this during the menu planning stage.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Notes */}
            <div className='bg-gray-50 rounded-xl p-8'>
              <h3 className='font-medium text-gray-800 mb-4 flex items-center'>
                <AlertCircle className='w-5 h-5 mr-2' />
                Important Information
              </h3>

              <ul className='space-y-3'>
                <li className='flex items-start'>
                  <Check
                    className={`h-5 w-5 text-${primaryColor}-500 mr-2 mt-0.5`}
                  />
                  <span className='text-gray-700'>
                    Minimum booking notice required is 48 hours, with 7 days
                    recommended for optimal menu planning
                  </span>
                </li>
                <li className='flex items-start'>
                  <Check
                    className={`h-5 w-5 text-${primaryColor}-500 mr-2 mt-0.5`}
                  />
                  <span className='text-gray-700'>
                    Cancellations within 48 hours of the scheduled service are
                    subject to a 50% charge
                  </span>
                </li>
                <li className='flex items-start'>
                  <Check
                    className={`h-5 w-5 text-${primaryColor}-500 mr-2 mt-0.5`}
                  />
                  <span className='text-gray-700'>
                    Grocery costs are additional and will be discussed during
                    menu planning
                  </span>
                </li>
                <li className='flex items-start'>
                  <Check
                    className={`h-5 w-5 text-${primaryColor}-500 mr-2 mt-0.5`}
                  />
                  <span className='text-gray-700'>
                    Service charge includes chef's time, preparation, service,
                    and cleanup
                  </span>
                </li>
              </ul>
            </div>
          </motion.div>
        )}
      </div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className={`bg-gradient-to-r from-${primaryColor}-600 to-${primaryColor}-500 rounded-xl shadow-xl overflow-hidden text-white`}
      >
        <div className='p-8 md:p-12'>
          <div className='flex flex-col md:flex-row items-center justify-between gap-6'>
            <div>
              <h2 className='text-2xl md:text-3xl font-bold mb-2'>
                Ready to Elevate Your Dining Experience?
              </h2>
              <p className='text-${primaryColor}-100'>
                Book your private chef experience today and enjoy a culinary
                journey in the comfort of your home.
              </p>
            </div>

            <button
              onClick={handleOpenBookingModal}
              className='py-4 px-8 bg-white text-gray-900 hover:bg-gray-100 font-medium rounded-lg transition-colors shadow-md whitespace-nowrap'
            >
              Book Your Chef
            </button>
          </div>
        </div>
      </motion.div>

      {/* Booking Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <BookingModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConfirm={handleBookingConfirm}
            service={service}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Helper function to format cuisine names
const formatCuisineName = (name: string): string => {
  return name
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

// Helper function to format meal option names
const formatMealName = (key: string): string => {
  const mealMap: Record<string, string> = {
    breakfast: 'Breakfast Experience',
    lunch: 'Lunch Service',
    dinner: 'Dinner Experience',
    fullDay: 'Full Day Culinary Experience',
    appetizers: 'Appetizers & Canapés',
    brunch: 'Weekend Brunch',
  };

  return (
    mealMap[key] ||
    key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')
  );
};

// Helper function to get cuisine images
const getCuisineImage = (cuisine: string): string => {
  const cuisineImages: Record<string, string> = {
    italian:
      'https://images.unsplash.com/photo-1595295333158-4742f28fbd85?q=80&w=2080&auto=format&fit=crop',
    french:
      'https://images.unsplash.com/photo-1608855238293-a8853e7f7c98?q=80&w=2070&auto=format&fit=crop',
    asian:
      'https://images.unsplash.com/photo-1580442151529-343f2f6e0e27?q=80&w=2070&auto=format&fit=crop',
    mediterranean:
      'https://images.unsplash.com/photo-1559598467-f8b76c8155d0?q=80&w=1974&auto=format&fit=crop',
    latin:
      'https://images.unsplash.com/photo-1613514785940-daed07799d9b?q=80&w=2080&auto=format&fit=crop',
    'plant-based':
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop',
    seafood:
      'https://images.unsplash.com/photo-1579631542720-3a87824fff86?q=80&w=1974&auto=format&fit=crop',
  };

  return (
    cuisineImages[cuisine.toLowerCase()] ||
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=2080&auto=format&fit=crop'
  );
};

export default ChefServiceView;
