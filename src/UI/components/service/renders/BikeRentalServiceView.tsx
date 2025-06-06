import React, { useState, useCallback } from 'react';
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
  Battery,
  Route,
  Users,
} from 'lucide-react';

interface BikeRentalServiceViewProps {
  service: Service;
  serviceData?: ServiceData;
  primaryColor?: string;
  viewContext?: 'standard-view' | 'premium-view';
}

// Constants
const BIKE_TYPES = [
  {
    id: 'beachCruiser',
    name: 'Beach Cruiser',
    price: 25,
    image:
      'https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&q=80&w=600',
    description: 'Perfect for coastal rides and beach exploration',
    features: ['Comfortable seat', 'Beach-ready tires', 'Basket included'],
  },
  {
    id: 'cityBike',
    name: 'City Bike',
    price: 30,
    image:
      'https://images.unsplash.com/photo-1502744688674-c619d1586c9e?auto=format&fit=crop&q=80&w=600',
    description: 'Ideal for urban exploration and local attractions',
    features: ['Multi-gear system', 'City-optimized', 'Lights included'],
  },
  {
    id: 'mountainBike',
    name: 'Mountain Bike',
    price: 35,
    image:
      'https://images.unsplash.com/photo-1544191696-15693169e831?auto=format&fit=crop&q=80&w=600',
    description: 'Built for adventure and off-road trails',
    features: ['All-terrain tires', 'Suspension', 'Trail-ready'],
  },
  {
    id: 'eBike',
    name: 'E-Bike',
    price: 45,
    image:
      'https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&q=80&w=600',
    description: 'Electric assistance for effortless rides',
    features: ['Electric motor', 'Long battery life', 'Premium comfort'],
    isPremium: true,
  },
];

const INCLUDED_ITEMS = [
  { icon: Shield, text: 'Safety helmet included' },
  { icon: CheckCircle, text: 'Secure bike lock' },
  { icon: Truck, text: 'Free delivery & pickup' },
  { icon: Clock, text: '24/7 customer support' },
];

const PROCESS_STEPS = [
  { step: '1', text: 'Choose your bike type', icon: Bike },
  { step: '2', text: 'We deliver to your location', icon: Truck },
  { step: '3', text: 'Quick safety briefing', icon: Shield },
  { step: '4', text: 'Explore at your own pace', icon: Route },
];

const FEATURES = [
  {
    icon: <Clock className='w-6 h-6' />,
    title: 'Flexible Hours',
    description: 'Rent by hour, day, or week',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: <MapPin className='w-6 h-6' />,
    title: 'Free Delivery',
    description: 'Delivered anywhere in Punta Cana',
    color: 'bg-green-50 text-green-600',
  },
  {
    icon: <Battery className='w-6 h-6' />,
    title: 'Premium Quality',
    description: 'Well-maintained, latest models',
    color: 'bg-purple-50 text-purple-600',
  },
];

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const BikeRentalServiceView: React.FC<BikeRentalServiceViewProps> = ({
  service,
  serviceData,
  primaryColor = 'green',
  viewContext,
}) => {
  const { t } = useTranslation();
  const { bookService } = useBooking();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBikeType, setSelectedBikeType] = useState('');

  const handleBookingConfirm = useCallback(
    (service: Service, dates: BookingDate, guests: number) => {
      bookService(service, dates, guests);
      setIsModalOpen(false);
    },
    [bookService]
  );

  const handleBikeSelect = useCallback((bikeId: string) => {
    setSelectedBikeType((prev) => (prev === bikeId ? '' : bikeId));
  }, []);

  return (
    <div className='max-w-8xl mx-auto px-6 py-8 space-y-16'>
      {/* Hero Section */}
      <motion.div
        className='relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-gray-800 to-black'
        initial='hidden'
        animate='visible'
        variants={fadeInUp}
      >
        <div className='absolute inset-0 opacity-30'>
          <Image
            src='https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=1200'
            alt='Bike rental adventure'
            fill
            className='object-cover'
            priority
          />
        </div>

        <div className='relative z-10 p-12 md:p-16 text-white'>
          <motion.div
            className='inline-flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 mb-6'
            variants={fadeInUp}
          >
            <Bike className='w-5 h-5 text-white mr-2' />
            <span className='text-white font-medium'>
              Your Adventure Awaits
            </span>
          </motion.div>

          <motion.h1
            className='text-4xl md:text-6xl font-bold mb-6 leading-tight'
            variants={fadeInUp}
          >
            Bike Rental
            <br />
            <span className='text-gray-300'>Made Simple</span>
          </motion.h1>

          <motion.p
            className='text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl leading-relaxed'
            variants={fadeInUp}
          >
            Discover Punta Cana at your own pace with our premium bike rentals.
            High-quality bikes delivered straight to your accommodation.
          </motion.p>

          <motion.button
            onClick={() => setIsModalOpen(true)}
            className='bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold text-lg flex items-center gap-3 transition-colors group'
            variants={fadeInUp}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Play className='w-5 h-5' />
            Start Your Journey
            <ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform' />
          </motion.button>
        </div>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true }}
        variants={stagger}
      >
        <div className='text-center mb-12'>
          <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>
            Why Choose Our Bikes?
          </h2>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
            Premium quality, reliable service, and the freedom to explore
          </p>
        </div>

        <div className='grid md:grid-cols-3 gap-8'>
          {FEATURES.map((feature, index) => (
            <motion.div
              key={index}
              className='text-center p-8'
              variants={fadeInUp}
              whileHover={{ y: -4 }}
            >
              <div
                className={`w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center mx-auto mb-6`}
              >
                {feature.icon}
              </div>
              <h3 className='text-xl font-bold text-gray-900 mb-3'>
                {feature.title}
              </h3>
              <p className='text-gray-600 leading-relaxed'>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Bike Selection */}
      <motion.div
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true }}
        variants={stagger}
      >
        <div className='text-center mb-12'>
          <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>
            Choose Your Ride
          </h2>
          <p className='text-xl text-gray-600'>
            Find the perfect bike for your Punta Cana adventure
          </p>
        </div>

        <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {BIKE_TYPES.map((bike, index) => (
            <motion.div
              key={bike.id}
              className={`bg-white rounded-2xl shadow-sm border-2 cursor-pointer transition-all duration-300 overflow-hidden ${
                selectedBikeType === bike.id
                  ? 'border-gray-900 shadow-lg scale-105'
                  : 'border-gray-100 hover:border-gray-300 hover:shadow-md'
              }`}
              onClick={() => handleBikeSelect(bike.id)}
              variants={fadeInUp}
              whileHover={{ y: -4 }}
            >
              <div className='relative h-48'>
                <Image
                  src={bike.image}
                  alt={bike.name}
                  fill
                  className='object-cover'
                />
                {bike.isPremium && (
                  <div className='absolute top-3 right-3 bg-gray-900 text-white px-2 py-1 rounded-full text-xs font-medium'>
                    Premium
                  </div>
                )}
              </div>

              <div className='p-6'>
                <div className='flex items-center justify-between mb-3'>
                  <h3 className='text-xl font-bold text-gray-900'>
                    {bike.name}
                  </h3>
                  <div className='text-right'>
                    <div className='text-2xl font-bold text-gray-900'>
                      ${bike.price}
                    </div>
                    <div className='text-sm text-gray-500'>per day</div>
                  </div>
                </div>

                <p className='text-gray-600 mb-4 leading-relaxed'>
                  {bike.description}
                </p>

                <div className='space-y-2'>
                  {bike.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className='flex items-center text-sm text-gray-500'
                    >
                      <div className='w-1.5 h-1.5 bg-gray-400 rounded-full mr-2'></div>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {selectedBikeType && (
          <motion.div
            className='mt-8 text-center'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className='bg-gray-50 rounded-2xl p-6 max-w-2xl mx-auto'>
              <h3 className='text-xl font-bold text-gray-900 mb-3'>
                Great Choice!
              </h3>
              <p className='text-gray-600 mb-4'>
                You've selected the{' '}
                <span className='font-semibold text-gray-900'>
                  {
                    BIKE_TYPES.find((bike) => bike.id === selectedBikeType)
                      ?.name
                  }
                </span>
                . Ready to book your adventure?
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className='bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold transition-colors'
              >
                Book This Bike
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* How It Works */}
      <motion.div
        className='bg-gray-50 rounded-3xl p-8 md:p-12'
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className='text-center mb-12'>
          <h2 className='text-3xl font-bold text-gray-900 mb-4'>
            How It Works
          </h2>
          <p className='text-xl text-gray-600'>Simple, fast, and convenient</p>
        </div>

        <div className='grid md:grid-cols-4 gap-8'>
          {PROCESS_STEPS.map((step, index) => (
            <div key={index} className='text-center'>
              <div className='relative mb-6'>
                <div className='w-16 h-16 bg-gray-900 text-white rounded-2xl flex items-center justify-center mx-auto font-bold text-xl'>
                  {step.step}
                </div>
                {index < PROCESS_STEPS.length - 1 && (
                  <div className='hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gray-200 -z-10'></div>
                )}
              </div>
              <div className='mb-4'>
                <step.icon className='w-8 h-8 text-gray-600 mx-auto' />
              </div>
              <p className='text-gray-700 font-medium'>{step.text}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* What's Included */}
      <motion.div
        className='grid md:grid-cols-2 gap-12'
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true }}
        variants={stagger}
      >
        <motion.div variants={fadeInUp}>
          <h2 className='text-3xl font-bold text-gray-900 mb-8'>
            What's Included
          </h2>
          <div className='space-y-6'>
            {INCLUDED_ITEMS.map((item, index) => (
              <div key={index} className='flex items-center'>
                <div className='w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4'>
                  <item.icon className='w-6 h-6 text-green-600' />
                </div>
                <span className='text-lg text-gray-700 font-medium'>
                  {item.text}
                </span>
              </div>
            ))}
          </div>

          <div className='mt-8 p-6 bg-amber-50 rounded-2xl border border-amber-200'>
            <h3 className='font-semibold text-amber-800 mb-3 flex items-center'>
              <AlertTriangle className='w-5 h-5 mr-2' />
              Important Information
            </h3>
            <ul className='text-amber-700 space-y-1'>
              <li>• Valid ID required for rental</li>
              <li>• Helmet use is strongly recommended</li>
              <li>• Follow local traffic regulations</li>
            </ul>
          </div>
        </motion.div>

        <motion.div
          className='relative h-96 rounded-2xl overflow-hidden'
          variants={fadeInUp}
        >
          <Image
            src='https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&q=80&w=600'
            alt='Bike rental experience'
            fill
            className='object-cover'
          />
        </motion.div>
      </motion.div>

      {/* Testimonial */}
      <motion.div
        className='bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12 text-center'
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className='flex justify-center mb-6'>
          {[...Array(5)].map((_, i) => (
            <Star key={i} className='w-6 h-6 text-yellow-400 fill-current' />
          ))}
        </div>
        <blockquote className='text-2xl md:text-3xl font-medium text-gray-900 mb-6 italic leading-relaxed'>
          "Fantastic service! The bike was delivered on time and in perfect
          condition. Made exploring Punta Cana so much more enjoyable."
        </blockquote>
        <cite className='text-lg text-gray-600 font-medium'>
          - Marcus T., Satisfied Customer
        </cite>
      </motion.div>

      {/* Location & Availability */}
      <motion.div
        className='grid md:grid-cols-3 gap-8'
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true }}
        variants={stagger}
      >
        <motion.div className='text-center p-6' variants={fadeInUp}>
          <Clock className='w-12 h-12 text-blue-600 mx-auto mb-4' />
          <h3 className='font-bold text-gray-900 mb-2'>Flexible Timing</h3>
          <p className='text-gray-600'>Available 24/7 to fit your schedule</p>
        </motion.div>

        <motion.div className='text-center p-6' variants={fadeInUp}>
          <Users className='w-12 h-12 text-green-600 mx-auto mb-4' />
          <h3 className='font-bold text-gray-900 mb-2'>All Ages Welcome</h3>
          <p className='text-gray-600'>
            Children's bikes and safety gear available
          </p>
        </motion.div>

        <motion.div className='text-center p-6' variants={fadeInUp}>
          <MapPin className='w-12 h-12 text-purple-600 mx-auto mb-4' />
          <h3 className='font-bold text-gray-900 mb-2'>Wide Coverage</h3>
          <p className='text-gray-600'>Delivery throughout Punta Cana area</p>
        </motion.div>
      </motion.div>

      {/* Final CTA */}
      <motion.div
        className='bg-gray-900 rounded-3xl p-8 md:p-12 text-white text-center'
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <h2 className='text-3xl md:text-4xl font-bold mb-4'>
          Ready to Explore?
        </h2>
        <p className='text-xl text-gray-300 mb-8 max-w-2xl mx-auto'>
          Book your bike rental today and discover Punta Cana from a new
          perspective
        </p>

        <button
          onClick={() => setIsModalOpen(true)}
          className='bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold text-lg flex items-center gap-3 mx-auto transition-colors group'
        >
          <Bike className='w-6 h-6' />
          Book Your Bike Adventure
          <ArrowRight className='w-6 h-6 group-hover:translate-x-1 transition-transform' />
        </button>
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

export default BikeRentalServiceView;
