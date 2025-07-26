import React, { useState } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { Service } from '@/types/type';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  Users,
  Check,
  Star,
  AlertCircle,
  Heart,
  Crown,
  Trophy,
  Quote,
  Shield,
} from 'lucide-react';
import BookingModal from '@/UI/components/modal/BookingModal';
import { useBooking } from '@/context/BookingContext';
import { BookingDate } from '@/types/type';
import {
  CUISINE_TYPES,
  DIETARY_ACCOMMODATIONS,
  INCLUDED_SERVICES,
  TESTIMONIALS,
} from '@/constants/chef/chefInfo';
import { cn } from '@/utils/cheff/chefFormUtils';
import ChefCTASection from '../chef/ChefCTASection';
import ChefHeroSection from '../chef/ChefHeroSection';
import ChefServiceTypesSection from '../chef/ServiceTypesSection';

const animations = {
  fadeInUp: {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  },
  slideIn: {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
  },
  stagger: {
    visible: { transition: { staggerChildren: 0.1 } },
  },
};

const CuisineSection: React.FC<{
  selectedCuisine: string;
  onCuisineSelect: (id: string) => void;
}> = ({ selectedCuisine, onCuisineSelect }) => (
  <motion.div
    className='px-4'
    initial='hidden'
    animate='visible'
    variants={animations.fadeInUp}
  >
    <div className='text-center mb-16'>
      <h2 className='text-5xl font-bold text-gray-800 mb-6'>
        Global Cuisine Mastery
      </h2>
      <p className='text-2xl text-gray-600 max-w-3xl mx-auto'>
        Explore authentic flavors from around the world, expertly crafted by our
        culinary artists
      </p>
    </div>

    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
      {CUISINE_TYPES.map((cuisine) => (
        <motion.div
          key={cuisine.id}
          className={cn(
            'relative overflow-hidden rounded-3xl cursor-pointer group',
            selectedCuisine === cuisine.id && 'ring-4 ring-orange-500 scale-105'
          )}
          onClick={() =>
            onCuisineSelect(selectedCuisine === cuisine.id ? '' : cuisine.id)
          }
          variants={animations.fadeInUp}
          whileHover={{ y: -8 }}
        >
          <div className='relative h-80'>
            <Image
              src={cuisine.image}
              alt={cuisine.name}
              fill
              className='object-cover transition-transform duration-700 group-hover:scale-110'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent group-hover:bg-gradient-to-t group-hover:from-black/80 group-hover:via-black/40 group-hover:to-black/10 transition-all duration-500' />

            <div className='absolute bottom-6 left-6 right-6 text-white'>
              <h3 className='text-2xl font-bold mb-2'>{cuisine.name}</h3>
              <p className='text-white/90 mb-3 leading-relaxed'>
                {cuisine.description}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

const IncludedServicesSection: React.FC = () => (
  <motion.div
    className='px-4'
    initial='hidden'
    animate='visible'
    variants={animations.fadeInUp}
  >
    <div className='grid grid-cols-1 md:grid-cols-2 gap-12'>
      <div className='bg-white rounded-3xl shadow-lg p-8'>
        <h2 className='text-3xl font-bold text-gray-800 mb-8 flex items-center'>
          <Shield className='w-8 h-8 text-orange-600 mr-3' />
          What's Included
        </h2>

        <div className='space-y-6'>
          {INCLUDED_SERVICES.map((item, index) => (
            <div key={index} className='flex items-start space-x-4'>
              <div className='w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center flex-shrink-0'>
                <item.icon className='w-6 h-6 text-orange-600' />
              </div>
              <div>
                <h4 className='text-lg font-bold text-gray-800 mb-1'>
                  {item.text}
                </h4>
                <p className='text-gray-600 text-sm'>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className='bg-white rounded-3xl shadow-lg p-8'>
        <h2 className='text-3xl font-bold text-gray-800 mb-8 flex items-center'>
          <Heart className='w-8 h-8 text-orange-600 mr-3' />
          Dietary Accommodations
        </h2>

        <div className='grid grid-cols-2 gap-4 mb-6'>
          {DIETARY_ACCOMMODATIONS.map((diet) => (
            <div
              key={diet}
              className='flex items-center p-3 bg-orange-50 rounded-lg border border-orange-200'
            >
              <Check className='w-5 h-5 text-orange-500 mr-2' />
              <span className='text-gray-800 text-sm font-medium'>{diet}</span>
            </div>
          ))}
        </div>

        <div className='bg-amber-50 border border-amber-200 rounded-2xl p-4'>
          <div className='flex items-start'>
            <AlertCircle className='w-5 h-5 text-amber-600 mr-3 mt-0.5' />
            <div>
              <h4 className='font-bold text-amber-800 mb-1'>Allergy Notice</h4>
              <p className='text-amber-700 text-sm'>
                Please inform us of any food allergies or special dietary
                requirements during booking.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

const TestimonialsSection: React.FC = () => (
  <motion.div
    className='px-4'
    initial='hidden'
    animate='visible'
    variants={animations.fadeInUp}
  >
    <div className='text-center mb-16'>
      <h2 className='text-5xl font-bold text-gray-800 mb-6'>
        Culinary Success Stories
      </h2>
      <p className='text-2xl text-gray-600 max-w-3xl mx-auto'>
        Hear from guests who experienced extraordinary dining moments
      </p>
    </div>

    <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
      {TESTIMONIALS.map((testimonial, index) => (
        <motion.div
          key={index}
          className='bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 group relative overflow-hidden'
          variants={animations.fadeInUp}
          whileHover={{ y: -4 }}
        >
          <div className='absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-amber-500/10 rounded-bl-full' />

          <div className='flex items-center mb-6'>
            <div className='relative w-16 h-16 rounded-full overflow-hidden mr-4'>
              <Image
                src={testimonial.image}
                alt={testimonial.author}
                fill
                className='object-cover'
              />
            </div>
            <div>
              <h4 className='font-bold text-gray-800'>{testimonial.author}</h4>
              <p className='text-gray-500 text-sm'>{testimonial.event}</p>
              <div className='flex mt-1'>
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className='w-4 h-4 text-yellow-400 fill-current'
                  />
                ))}
              </div>
            </div>
          </div>

          <Quote className='w-8 h-8 text-orange-500 mb-4' />
          <p className='text-gray-700 mb-4 leading-relaxed italic'>
            "{testimonial.text}"
          </p>

          <div className='text-sm text-orange-600 font-medium bg-orange-50 px-3 py-1 rounded-full inline-block'>
            {testimonial.cuisine}
          </div>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const ChefServiceView: React.FC<ChefServiceViewProps> = ({
  service,
  serviceData,
  primaryColor,
}) => {
  const { t } = useTranslation();
  const { bookService } = useBooking();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [selectedExperience, setSelectedExperience] = useState('');
  const [selectedServiceType, setSelectedServiceType] = useState('');

  // Derived state
  const isPremium = service.packageType.includes('premium');
  const maxPeople = serviceData?.metaData?.maxPeople || 10;

  // Event handlers
  const handleBookingClick = () => setIsModalOpen(true);

  const handleBookingConfirm = (
    service: Service,
    dates: BookingDate,
    guests: number
  ) => {
    bookService(service, dates, guests);
    setIsModalOpen(false);
  };

  const handleCuisineSelect = (cuisineId: string) => {
    setSelectedCuisine(cuisineId);
  };

  const handleExperienceSelect = (experienceId: string) => {
    setSelectedExperience(experienceId);
  };

  const handleServiceTypeSelect = (serviceTypeId: string) => {
    setSelectedServiceType(serviceTypeId);
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50'>
      <div className='max-w-8xl mx-auto space-y-16 pb-16'>
        {/* Hero Section */}
        <ChefHeroSection
          service={service}
          maxPeople={maxPeople}
          isPremium={isPremium}
          onBookClick={handleBookingClick}
        />

        {/* Service Types Section */}
        <ChefServiceTypesSection
          selectedServiceType={selectedServiceType}
          onServiceTypeSelect={handleServiceTypeSelect}
        />

        {/* Cuisine Selection */}
        <CuisineSection
          selectedCuisine={selectedCuisine}
          onCuisineSelect={handleCuisineSelect}
        />

        {/* What's Included & Dietary Accommodations */}
        <IncludedServicesSection />

        {/* Testimonials */}
        <TestimonialsSection />

        {/* CTA Section */}
        <ChefCTASection service={service} onBookClick={handleBookingClick} />

        <motion.div
          className='px-4'
          initial='hidden'
          animate='visible'
          variants={animations.fadeInUp}
        >
          <div className='bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 rounded-3xl p-12 text-center relative overflow-hidden'>
            <motion.div
              className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500'
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 2, delay: 0.5 }}
            />

            <Quote className='w-12 h-12 text-orange-500 mx-auto mb-6' />
            <blockquote className='text-3xl md:text-4xl font-light text-gray-800 mb-6 italic leading-relaxed'>
              "Cooking is not about convenience. It's about love, culture, and
              the beauty of transformation."
            </blockquote>
            <cite className='text-xl text-orange-600 font-medium'>
              - Chef Auguste Escoffier
            </cite>
          </div>
        </motion.div>
      </div>

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

export default ChefServiceView;
