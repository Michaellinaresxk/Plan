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
  Bike,
  MapPin,
  Clock,
  Star,
  ArrowRight,
  Shield,
  Truck,
  CheckCircle,
  Play,
  AlertTriangle,
  Baby,
} from 'lucide-react';

interface BikeRentalServiceViewProps {
  service: Service;
  serviceData?: ServiceData;
  primaryColor: string;
  viewContext?: 'standard-view' | 'premium-view';
}

const BikeRentalServiceView: React.FC<BikeRentalServiceViewProps> = ({
  service,
  serviceData,
  viewContext,
}) => {
  const { t } = useTranslation();
  const { bookService } = useBooking();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBikeType, setSelectedBikeType] = useState('');

  // Bike types from PDF
  const bikeTypes = [
    {
      id: 'beachCruiser',
      name: 'Beach Cruisers',
      icon: '🏖️',
      color: 'from-blue-500 to-cyan-500',
      price: 25,
      image:
        'https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&q=80&w=600',
      description: 'Perfect for coastal rides and beach exploration',
    },
    {
      id: 'cityBike',
      name: 'City Bikes',
      icon: '🏙️',
      color: 'from-green-500 to-emerald-500',
      price: 30,
      image:
        'https://images.unsplash.com/photo-1502744688674-c619d1586c9e?auto=format&fit=crop&q=80&w=600',
      description: 'Ideal for urban exploration and local attractions',
    },
    {
      id: 'mountainBike',
      name: 'Mountain Bikes',
      icon: '⛰️',
      color: 'from-orange-500 to-red-500',
      price: 35,
      image:
        'https://images.unsplash.com/photo-1544191696-15693169e831?auto=format&fit=crop&q=80&w=600',
      description: 'Built for adventure and off-road trails',
    },
    {
      id: 'eBike',
      name: 'E-Bikes',
      icon: '⚡',
      color: 'from-purple-500 to-pink-500',
      price: 45,
      image:
        'https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&q=80&w=600',
      description: 'Premium electric assistance for effortless rides',
      isPremium: true,
    },
  ];

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  const slideIn = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
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
    <div className='min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-teal-100'>
      <div className='max-w-6xl mx-auto space-y-16 pb-16'>
        {/* Hero Section */}
        <motion.div
          className='relative overflow-hidden rounded-3xl mx-4 mt-8'
          initial='hidden'
          animate='visible'
          variants={fadeIn}
        >
          <div className='relative h-[70vh] bg-gradient-to-r from-teal-900 via-green-900 to-blue-900'>
            <Image
              src='https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=1200'
              alt='Bike rental adventure'
              fill
              className='object-cover mix-blend-overlay opacity-60'
              priority
            />

            <div className='relative z-10 h-full flex items-center justify-center text-center px-8'>
              <div className='max-w-4xl'>
                <motion.div
                  className='inline-flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 mb-6'
                  variants={slideIn}
                >
                  <Bike className='w-5 h-5 text-white mr-2' />
                  <span className='text-white font-medium'>
                    Your Ride. Your Freedom.
                  </span>
                </motion.div>

                <motion.h1
                  className='text-5xl md:text-7xl font-bold text-white mb-6 leading-tight'
                  variants={fadeIn}
                >
                  Bike Rental
                </motion.h1>

                <motion.p
                  className='text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto'
                  variants={fadeIn}
                >
                  Discover Punta Cana like a local with our high-quality bikes,
                  delivered straight to your accommodation. Cruise along the
                  coast or explore hidden paths with our perfectly maintained
                  bikes.
                </motion.p>

                <motion.button
                  onClick={() => setIsModalOpen(true)}
                  className='bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-10 py-4 rounded-2xl font-bold text-lg flex items-center gap-3 mx-auto transition-all duration-300 hover:scale-105 shadow-2xl'
                  variants={slideIn}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className='w-6 h-6' fill='currentColor' />
                  Let the journey begin—on two wheels
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Choose Your Bike */}
        <motion.div
          className='px-4'
          initial='hidden'
          animate='visible'
          variants={fadeIn}
        >
          <div className='text-center mb-12'>
            <h2 className='text-4xl font-bold text-gray-800 mb-4'>
              Choose From
            </h2>
            <p className='text-xl text-gray-600'>
              Find the perfect bike for your Punta Cana adventure
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {bikeTypes.map((bike, index) => (
              <motion.div
                key={bike.id}
                className={`relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-500 hover:scale-105 ${
                  selectedBikeType === bike.id
                    ? 'ring-4 ring-green-500 shadow-2xl'
                    : 'shadow-lg'
                }`}
                onClick={() => setSelectedBikeType(bike.id)}
                variants={slideIn}
                whileHover={{ y: -5 }}
              >
                <div className='h-48 relative overflow-hidden'>
                  <Image
                    src={bike.image}
                    alt={bike.name}
                    fill
                    className='object-cover transition-transform duration-700 hover:scale-110'
                  />
                  {bike.isPremium && (
                    <div className='absolute top-3 right-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold'>
                      Premium Option
                    </div>
                  )}
                </div>

                <div
                  className={`p-6 bg-gradient-to-br ${bike.color} text-white`}
                >
                  <div className='flex items-center justify-between mb-3'>
                    <div className='text-3xl'>{bike.icon}</div>
                    <div className='text-right'>
                      <div className='text-2xl font-bold'>${bike.price}</div>
                      <div className='text-sm opacity-90'>per day</div>
                    </div>
                  </div>

                  <h3 className='text-xl font-bold mb-2'>{bike.name}</h3>
                  <p className='text-sm opacity-90'>{bike.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* What's Included & Process */}
        <motion.div
          className='px-4'
          initial='hidden'
          animate='visible'
          variants={fadeIn}
        >
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
            {/* What's Included */}
            <div className='bg-white rounded-3xl shadow-lg p-8'>
              <h2 className='text-2xl font-bold text-gray-800 mb-6 flex items-center'>
                <CheckCircle className='w-6 h-6 text-green-500 mr-3' />
                What's Included
              </h2>

              <div className='space-y-4 mb-6'>
                {[
                  { icon: Shield, text: 'Helmet' },
                  { icon: CheckCircle, text: 'Lock' },
                  { icon: Clock, text: '24/7 Support' },
                ].map((item, index) => (
                  <div key={index} className='flex items-center'>
                    <div className='w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4'>
                      <item.icon className='w-5 h-5 text-green-600' />
                    </div>
                    <span className='text-lg text-gray-700 font-medium'>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>

              <div className='bg-gray-50 p-4 rounded-lg'>
                <h3 className='font-medium text-gray-800 mb-2'>
                  Not Included:
                </h3>
                <p className='text-gray-600 text-sm'>
                  • Gratuity (optional, appreciated)
                </p>
              </div>
            </div>

            {/* What to Expect */}
            <div className='bg-white rounded-3xl shadow-lg p-8'>
              <h2 className='text-2xl font-bold text-gray-800 mb-6 flex items-center'>
                <Truck className='w-6 h-6 text-blue-500 mr-3' />
                What to Expect
              </h2>

              <div className='space-y-6'>
                {[
                  {
                    step: '1',
                    text: 'We deliver your bike at your location',
                    icon: Truck,
                  },
                  {
                    step: '2',
                    text: 'Quick setup and safety overview',
                    icon: Shield,
                  },
                  {
                    step: '3',
                    text: 'Enjoy the freedom to explore',
                    icon: Bike,
                  },
                  {
                    step: '4',
                    text: 'We pick up the bike at the scheduled time',
                    icon: CheckCircle,
                  },
                ].map((item, index) => (
                  <div key={index} className='flex items-start'>
                    <div className='w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mr-4 font-bold text-sm flex-shrink-0'>
                      {item.step}
                    </div>
                    <div className='flex items-center'>
                      <item.icon className='w-5 h-5 text-blue-500 mr-3' />
                      <p className='text-gray-700'>{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Why Choose Us */}
        <motion.div
          className='px-4'
          initial='hidden'
          animate='visible'
          variants={fadeIn}
        >
          <div className='bg-gradient-to-r from-green-600 to-teal-600 rounded-3xl p-12 text-center text-white'>
            <h2 className='text-3xl font-bold mb-6'>Why Choose Us?</h2>
            <p className='text-xl mb-4 max-w-4xl mx-auto leading-relaxed'>
              Our bike rentals are not just convenient—they're an invitation to
              adventure. With flexible rental times, personalized tips, and
              reliable service, you'll have everything you need for a memorable
              ride.
            </p>
            <p className='text-lg opacity-90'>
              We make it easy, fun, and fully adapted to your schedule.
            </p>
          </div>
        </motion.div>

        {/* Good to Know */}
        <motion.div
          className='px-4'
          initial='hidden'
          animate='visible'
          variants={fadeIn}
        >
          <div className='bg-white rounded-3xl shadow-lg p-8'>
            <h2 className='text-2xl font-bold text-gray-800 mb-6'>
              Good to Know
            </h2>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              <div className='text-center p-4'>
                <Clock className='w-8 h-8 text-blue-500 mx-auto mb-3' />
                <h3 className='font-bold text-gray-800 mb-2'>
                  Start & End Time
                </h3>
                <p className='text-gray-600 text-sm'>
                  According to your booking schedule
                </p>
              </div>

              <div className='text-center p-4'>
                <Baby className='w-8 h-8 text-green-500 mx-auto mb-3' />
                <h3 className='font-bold text-gray-800 mb-2'>Age Policy</h3>
                <p className='text-gray-600 text-sm'>
                  Children's bikes available
                </p>
              </div>

              <div className='text-center p-4'>
                <MapPin className='w-8 h-8 text-purple-500 mx-auto mb-3' />
                <h3 className='font-bold text-gray-800 mb-2'>Delivery Zone</h3>
                <p className='text-gray-600 text-sm'>
                  Available throughout Punta Cana area
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className='px-4'
          initial='hidden'
          animate='visible'
          variants={fadeIn}
        >
          <div className='bg-gradient-to-r from-gray-900 via-green-900 to-teal-900 rounded-3xl p-12 text-center'>
            <div className='max-w-3xl mx-auto'>
              <h2 className='text-4xl md:text-5xl font-bold text-white mb-6'>
                Ready to Explore Punta Cana?
              </h2>
              <p className='text-xl text-white/90 mb-8'>
                Book your bike rental today and discover the freedom of two
                wheels
              </p>

              <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
                <div className='text-center'>
                  <div className='text-4xl font-bold text-white'>
                    From ${service.price}
                  </div>
                  <div className='text-white/70'>per day</div>
                </div>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className='bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-10 py-4 rounded-2xl font-bold text-lg flex items-center gap-3 transition-all duration-300 hover:scale-105 shadow-2xl'
                >
                  <Bike className='w-6 h-6' />
                  Book Your Adventure
                  <ArrowRight className='w-6 h-6' />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Simple Testimonial */}
        <motion.div
          className='px-4'
          initial='hidden'
          animate='visible'
          variants={fadeIn}
        >
          <div className='bg-gradient-to-r from-green-50 to-teal-100 rounded-3xl p-8 text-center'>
            <div className='flex justify-center mb-4'>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className='w-6 h-6 text-yellow-400 fill-current'
                />
              ))}
            </div>
            <blockquote className='text-2xl font-medium text-gray-800 mb-4 italic'>
              "Great bikes and amazing service! Delivered right to our hotel and
              picked up on time."
            </blockquote>
            <cite className='text-lg text-gray-600 font-medium'>
              - Mark T., Happy Rider
            </cite>
          </div>
        </motion.div>

        {/* Safety Disclaimer */}
        <motion.div
          className='px-4'
          initial='hidden'
          animate='visible'
          variants={fadeIn}
        >
          <div className='bg-amber-50 border border-amber-200 rounded-2xl p-6'>
            <div className='flex items-start'>
              <AlertTriangle className='w-6 h-6 text-amber-600 mr-3 flex-shrink-0 mt-1' />
              <div>
                <h3 className='font-bold text-amber-800 mb-2'>Disclaimer</h3>
                <p className='text-amber-700'>
                  For your safety, we recommend wearing a helmet and following
                  all local traffic regulations.
                  <span className='font-semibold'>
                    {' '}
                    Your Safety, Your Responsibility.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

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

export default BikeRentalServiceView;
