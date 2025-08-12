import React, { useState } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { Service } from '@/types/type';
import { ServiceData, ServiceExtendedDetails } from '@/types/services';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  Car,
  Clock,
  MapPin,
  Users,
  Calendar,
  CheckCircle,
  ArrowRight,
  Info,
  Shield,
  AlertTriangle,
  Plane,
  Repeat,
  ChevronRight,
  Check,
  Star,
  Award,
  Baby,
  Wifi,
  Coffee,
  Luggage,
  Navigation,
  MapPinned,
  Timer,
  UserCheck,
  CarFront,
  PlayCircle,
  Quote,
  ChevronLeft,
} from 'lucide-react';
import { useBooking } from '@/context/BookingContext';
import { BookingDate } from '@/types/type';
import BookingModal from '../../modal/BookingModal';

interface AirportServiceViewProps {
  service: Service;
  serviceData?: ServiceData;
  extendedDetails?: ServiceExtendedDetails;
  primaryColor: string;
}

// Constants
const TRANSFER_GALLERY = [
  {
    src: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.0.3',
    alt: 'Luxury private van transfer',
    caption: 'Modern air-conditioned vehicles for your comfort',
  },
  {
    src: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.0.3',
    alt: 'Professional driver service',
    caption: 'Professional drivers with personalized meet & greet',
  },
  {
    src: 'https://images.unsplash.com/photo-1577435213005-1acb8929ad3e?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3',
    alt: 'Airport terminal arrival',
    caption: 'Seamless pickup at airport arrivals area',
  },
  {
    src: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.0.3',
    alt: 'Punta Cana destination',
    caption: 'Direct transfer to your accommodation in paradise',
  },
];

const WHATS_INCLUDED = [
  'Meet & Greet at airport exit',
  'Professional driver service',
  'Luggage assistance',
  'Air-conditioned vehicle',
  'Bottled water on board',
  'Flight tracking service',
];

const WHATS_NOT_INCLUDED = ['Gratuity (optional, appreciated)'];

const TRANSFER_PROCESS = [
  {
    step: 1,
    icon: UserCheck,
    title: 'Driver meets you',
    description: 'At the arrivals area with your name sign',
  },
  {
    step: 2,
    icon: Luggage,
    title: 'Bag assistance',
    description: 'Help with luggage and comfortable boarding',
  },
  {
    step: 3,
    icon: CarFront,
    title: 'Comfortable ride',
    description: 'Direct, air-conditioned journey to destination',
  },
  {
    step: 4,
    icon: MapPin,
    title: 'Safe arrival',
    description: 'Smooth drop-off right at your door',
  },
];

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const AirportServiceView: React.FC<AirportServiceViewProps> = ({
  service,
  serviceData,
  extendedDetails,
  primaryColor,
}) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { bookService } = useBooking();

  // Determinar si es servicio premium
  const isPremium = service.packageType.includes('premium');

  // Extraer propiedades relevantes
  const travelTime =
    extendedDetails?.travelTime ||
    serviceData?.metaData?.travelTime ||
    '20-40 min';

  // Extraer opciones de viaje
  let tripOptions = {};
  if (serviceData?.options?.isRoundTrip?.subOptions) {
    tripOptions = serviceData.options.isRoundTrip.subOptions;
  } else {
    tripOptions = {
      oneWay: {
        nameKey: 'services.airport.options.isRoundTrip.options.oneWay',
        price: 0,
      },
      roundTrip: {
        nameKey: 'services.airport.options.isRoundTrip.options.roundTrip',
        price: 'double',
      },
    };
  }

  const handleBookingConfirm = (
    bookingService: Service,
    dates: BookingDate,
    guests: number
  ) => {
    bookService(bookingService, dates, guests);
    setIsModalOpen(false);
  };

  function formatTripOptionName(key: string): string {
    if (key === 'oneWay') return 'One Way';
    if (key === 'roundTrip') return 'Round Trip';
    return key.replace(/([A-Z])/g, ' $1').trim();
  }

  return (
    <div className='min-h-screen bg-white'>
      {/* Hero Section */}
      <HeroSection
        service={service}
        isPremium={isPremium}
        travelTime={travelTime}
        onBookClick={() => setIsModalOpen(true)}
      />

      {/* Trip Options Section */}
      <TripOptionsSection
        tripOptions={tripOptions}
        isPremium={isPremium}
        formatTripOptionName={formatTripOptionName}
        onBookClick={() => setIsModalOpen(true)}
        t={t}
      />

      {/* Transfer Process Section */}
      <TransferProcessSection />

      {/* Gallery Section */}
      <GallerySection />

      {/* Human Banner CTA */}
      <HumanBannerSection onBookClick={() => setIsModalOpen(true)} />

      {/* What's Included Section */}
      <IncludedSection />

      {/* Traveler Tips Section */}
      <TravelerTipsSection isPremium={isPremium} />

      {/* Good to Know Section */}
      <GoodToKnowSection travelTime={travelTime} />

      {/* Final CTA Section */}
      <FinalCTASection
        isPremium={isPremium}
        onBookClick={() => setIsModalOpen(true)}
      />

      {/* Disclaimer */}
      <DisclaimerSection />

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

// Hero Section Component
const HeroSection: React.FC<{
  service: Service;
  isPremium: boolean;
  travelTime: string;
  onBookClick: () => void;
}> = ({ service, isPremium, travelTime, onBookClick }) => (
  <motion.section
    className='relative pt-20 pb-32 px-6 overflow-hidden'
    initial='hidden'
    animate='visible'
    variants={fadeInUp}
  >
    {/* Background with overlay */}
    <div className='absolute inset-0 z-0'>
      <Image
        src={service.img || TRANSFER_GALLERY[0].src}
        alt={service.name}
        fill
        className='object-cover'
      />
      <div className='absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40'></div>
    </div>

    <div className='relative z-10 max-w-6xl mx-auto'>
      <div className='grid lg:grid-cols-2 gap-16 items-center'>
        {/* Content */}
        <div className='space-y-8 text-white'>
          <motion.div variants={fadeInUp}>
            {isPremium && (
              <span className='inline-flex items-center px-4 py-2 bg-amber-500/90 backdrop-blur-sm rounded-full text-amber-900 text-sm font-bold uppercase'>
                <Award className='w-4 h-4 mr-2' />
                Premium Service
              </span>
            )}
          </motion.div>

          <motion.div variants={fadeInUp} className='space-y-6'>
            <h1 className='text-5xl lg:text-6xl font-bold leading-tight'>
              Start Your Vacation
              <span className='block text-blue-400'>Stress-Free</span>
            </h1>
            <p className='text-xl leading-relaxed max-w-lg opacity-90'>
              Enjoy a seamless and private transfer from the airport to your
              accommodation. Skip the lines and crowds—your personal driver will
              be waiting, ready to welcome you with comfort and efficiency.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={staggerChildren}
            className='flex flex-wrap gap-6'
          >
            <StatItem icon={Clock} value={travelTime} label='Travel Time' />
            <StatItem icon={Star} value='4.9' label='Rating' />
            <StatItem icon={Car} value='24/7' label='Available' />
          </motion.div>

          {/* CTA */}
          <motion.div variants={fadeInUp} className='pt-4'>
            <button
              onClick={onBookClick}
              className='group inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:scale-[1.02] shadow-xl'
            >
              <PlayCircle className='w-5 h-5' />
              Book Your Transfer
              <ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform' />
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  </motion.section>
);

// Stat Item Component
const StatItem: React.FC<{
  icon: React.ComponentType<any>;
  value: string;
  label: string;
}> = ({ icon: Icon, value, label }) => (
  <motion.div variants={fadeInUp} className='flex items-center gap-3'>
    <div className='w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center'>
      <Icon className='w-5 h-5 text-white' />
    </div>
    <div>
      <p className='font-bold text-white'>{value}</p>
      <p className='text-sm text-white/80'>{label}</p>
    </div>
  </motion.div>
);

// Trip Options Section
const TripOptionsSection: React.FC<{
  tripOptions: any;
  isPremium: boolean;
  formatTripOptionName: (key: string) => string;
  onBookClick: () => void;
  t: any;
}> = ({ tripOptions, isPremium, formatTripOptionName, onBookClick, t }) => (
  <motion.section
    className='py-24 px-6'
    initial='hidden'
    whileInView='visible'
    viewport={{ once: true }}
    variants={staggerChildren}
  >
    <div className='max-w-6xl mx-auto'>
      <motion.div variants={fadeInUp} className='text-center mb-16'>
        <h2 className='text-4xl font-bold text-gray-900 mb-4'>
          Choose Your Transfer Option
        </h2>
        <p className='text-xl text-gray-600'>
          Select between one-way or round-trip transfer for maximum convenience
        </p>
      </motion.div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        {Object.entries(tripOptions).map(([key, option], index) => (
          <motion.div
            key={key}
            variants={fadeInUp}
            className='bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100'
          >
            <div className='flex items-center mb-6'>
              <div
                className={`p-4 rounded-full mr-4 ${
                  isPremium
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-blue-100 text-blue-700'
                }`}
              >
                {key === 'oneWay' ? (
                  <ArrowRight className='w-6 h-6' />
                ) : (
                  <Repeat className='w-6 h-6' />
                )}
              </div>
              <div>
                <h3 className='text-2xl font-bold text-gray-900'>
                  {typeof option === 'object' && 'nameKey' in option
                    ? t(option.nameKey, { fallback: formatTripOptionName(key) })
                    : formatTripOptionName(key)}
                </h3>
                <p className='text-gray-600'>
                  {key === 'oneWay'
                    ? 'One-way transfer to or from the airport'
                    : 'Return transfers included, for arrival and departure'}
                </p>
              </div>
            </div>

            <div className='space-y-3 mb-6'>
              <div className='flex items-center text-gray-700'>
                <Check className='w-4 h-4 text-green-500 mr-3' />
                Professional driver service
              </div>
              <div className='flex items-center text-gray-700'>
                <Check className='w-4 h-4 text-green-500 mr-3' />
                Air-conditioned vehicle
              </div>
              <div className='flex items-center text-gray-700'>
                <Check className='w-4 h-4 text-green-500 mr-3' />
                Meet & greet included
              </div>
            </div>

            {typeof option === 'object' && 'price' in option && (
              <div className='text-right mb-4'>
                {option.price === 'double' ? (
                  <span className='text-lg font-bold text-gray-600'>
                    2x base price
                  </span>
                ) : option.price > 0 ? (
                  <span className='text-lg font-bold text-blue-600'>
                    +${option.price}
                  </span>
                ) : (
                  <span className='text-lg font-bold text-green-600'>
                    Base price
                  </span>
                )}
              </div>
            )}

            <button
              onClick={onBookClick}
              className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                isPremium
                  ? 'bg-amber-500 hover:bg-amber-600 text-amber-900'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              Select {formatTripOptionName(key)}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  </motion.section>
);

// Transfer Process Section
const TransferProcessSection: React.FC = () => (
  <motion.section
    className='py-24 px-6 bg-gray-50'
    initial='hidden'
    whileInView='visible'
    viewport={{ once: true }}
    variants={staggerChildren}
  >
    <div className='max-w-6xl mx-auto'>
      <motion.div variants={fadeInUp} className='text-center mb-16'>
        <h2 className='text-4xl font-bold text-gray-900 mb-4'>
          What to Expect
        </h2>
        <p className='text-xl text-gray-600'>
          Your seamless transfer experience in 4 simple steps
        </p>
      </motion.div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
        {TRANSFER_PROCESS.map((process, index) => (
          <motion.div
            key={index}
            variants={fadeInUp}
            className='bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center'
          >
            <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <div className='w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm'>
                {process.step}
              </div>
            </div>
            <div className='mb-4'>
              <process.icon className='w-8 h-8 text-blue-600 mx-auto' />
            </div>
            <h3 className='text-lg font-bold text-gray-900 mb-2'>
              {process.title}
            </h3>
            <p className='text-gray-600 text-sm'>{process.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </motion.section>
);

// Gallery Section - Responsive 4 photos, 2 columns on mobile
const GallerySection: React.FC = () => (
  <motion.section
    className='py-24 px-6'
    initial='hidden'
    whileInView='visible'
    viewport={{ once: true }}
    variants={staggerChildren}
  >
    <div className='max-w-6xl mx-auto'>
      <motion.div variants={fadeInUp} className='text-center mb-16'>
        <h2 className='text-4xl font-bold text-gray-900 mb-4'>
          Our Transfer Experience
        </h2>
        <p className='text-xl text-gray-600'>
          See what makes our airport transfer service exceptional
        </p>
      </motion.div>

      {/* Responsive Gallery Grid */}
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
        {TRANSFER_GALLERY.map((image, index) => (
          <motion.div
            key={index}
            variants={fadeInUp}
            className='relative aspect-square rounded-xl overflow-hidden group cursor-pointer'
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className='object-cover transition-transform duration-700 group-hover:scale-110'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end'>
              <p className='p-4 text-white font-medium text-sm'>
                {image.caption}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </motion.section>
);

// Human Banner Section
const HumanBannerSection: React.FC<{
  onBookClick: () => void;
}> = ({ onBookClick }) => (
  <motion.section
    className='py-24 px-6 relative overflow-hidden'
    initial='hidden'
    whileInView='visible'
    viewport={{ once: true }}
    variants={fadeInUp}
  >
    <div className='absolute inset-0 z-0'>
      <Image
        src='https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.0.3'
        alt='Airport transfer comfort'
        fill
        className='object-cover'
      />
      <div className='absolute inset-0 bg-black/70'></div>
    </div>

    <div className='relative z-10 max-w-4xl mx-auto text-center text-white'>
      <h2 className='text-4xl md:text-5xl font-bold mb-6'>
        Skip the Taxi Lines
        <span className='block text-blue-400'>Start Your Vacation Now</span>
      </h2>
      <p className='text-xl mb-8 max-w-2xl mx-auto opacity-90'>
        Your personal driver is waiting for you. No stress, no delays, no
        complications. Just comfort and efficiency from the moment you land.
      </p>

      <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
        <button
          onClick={onBookClick}
          className='bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:scale-[1.02] shadow-xl'
        >
          Book Your Transfer Now
        </button>
        <p className='text-sm opacity-75'>
          🚐 Available 24/7 with advance reservation
        </p>
      </div>
    </div>
  </motion.section>
);

// What's Included Section
const IncludedSection: React.FC = () => (
  <motion.section
    className='py-24 px-6 bg-gray-50'
    initial='hidden'
    whileInView='visible'
    viewport={{ once: true }}
    variants={fadeInUp}
  >
    <div className='max-w-6xl mx-auto'>
      <div className='grid lg:grid-cols-2 gap-16'>
        {/* What's Included */}
        <div>
          <h2 className='text-3xl font-bold text-gray-900 mb-8'>
            What's Included
          </h2>
          <div className='bg-white rounded-2xl p-8 shadow-lg'>
            <div className='space-y-4'>
              {WHATS_INCLUDED.map((item, index) => (
                <div key={index} className='flex items-center gap-4'>
                  <div className='w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0'>
                    <Check className='w-4 h-4 text-green-600' />
                  </div>
                  <span className='text-gray-700'>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* What's Not Included */}
        <div>
          <h2 className='text-3xl font-bold text-gray-900 mb-8'>
            Not Included
          </h2>
          <div className='bg-white rounded-2xl p-8 shadow-lg'>
            <div className='space-y-4'>
              {WHATS_NOT_INCLUDED.map((item, index) => (
                <div key={index} className='flex items-center gap-4'>
                  <div className='w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0'>
                    <span className='text-gray-500 text-sm'>•</span>
                  </div>
                  <span className='text-gray-700'>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Why Choose Us */}
          <div className='mt-8 bg-blue-50 rounded-2xl p-8'>
            <h3 className='text-xl font-bold text-gray-900 mb-4'>
              Why Choose Us?
            </h3>
            <p className='text-gray-700'>
              We value your time and comfort. Our punctual, friendly service
              ensures you feel relaxed from the moment you land. Perfect for
              families, couples, solo travelers, or VIP guests.
            </p>
          </div>
        </div>
      </div>
    </div>
  </motion.section>
);

// Traveler Tips Section
const TravelerTipsSection: React.FC<{
  isPremium: boolean;
}> = ({ isPremium }) => (
  <motion.section
    className={`py-24 px-6 ${isPremium ? 'bg-amber-50' : 'bg-blue-50'}`}
    initial='hidden'
    whileInView='visible'
    viewport={{ once: true }}
    variants={staggerChildren}
  >
    <div className='max-w-6xl mx-auto'>
      <motion.div variants={fadeInUp} className='text-center mb-16'>
        <div className='flex items-center justify-center mb-4'>
          <AlertTriangle
            className={`h-8 w-8 ${
              isPremium ? 'text-amber-500' : 'text-blue-500'
            } mr-3`}
          />
          <h2 className='text-4xl font-bold text-gray-900'>Traveler Tips</h2>
        </div>
        <p className='text-xl text-gray-600'>
          Important information to ensure a smooth transfer experience
        </p>
      </motion.div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
        <motion.div
          variants={fadeInUp}
          className='bg-white rounded-2xl p-8 shadow-lg'
        >
          <Calendar
            className={`h-8 w-8 ${
              isPremium ? 'text-amber-500' : 'text-blue-500'
            } mb-4`}
          />
          <h3 className='font-bold text-gray-800 mb-3 text-xl'>
            Book in Advance
          </h3>
          <p className='text-gray-600'>
            Reserve your transfer at least 24 hours before your flight for the
            best experience. Early booking ensures availability and better
            coordination.
          </p>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          className='bg-white rounded-2xl p-8 shadow-lg'
        >
          <Plane
            className={`h-8 w-8 ${
              isPremium ? 'text-amber-500' : 'text-blue-500'
            } mb-4`}
          />
          <h3 className='font-bold text-gray-800 mb-3 text-xl'>
            Provide Flight Details
          </h3>
          <p className='text-gray-600'>
            Include your flight number, arrival/departure time, and
            accommodation address. Accurate details ensure perfect timing and
            coordination.
          </p>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          className='bg-white rounded-2xl p-8 shadow-lg'
        >
          <Clock
            className={`h-8 w-8 ${
              isPremium ? 'text-amber-500' : 'text-blue-500'
            } mb-4`}
          />
          <h3 className='font-bold text-gray-800 mb-3 text-xl'>
            Allow Buffer Time
          </h3>
          <p className='text-gray-600'>
            For departures, schedule your pickup with ample time before your
            flight. We recommend 3 hours for international flights.
          </p>
        </motion.div>
      </div>
    </div>
  </motion.section>
);

// Good to Know Section
const GoodToKnowSection: React.FC<{
  travelTime: string;
}> = ({ travelTime }) => (
  <motion.section
    className='py-24 px-6'
    initial='hidden'
    whileInView='visible'
    viewport={{ once: true }}
    variants={fadeInUp}
  >
    <div className='max-w-6xl mx-auto'>
      <div className='text-center mb-16'>
        <h2 className='text-4xl font-bold text-gray-900 mb-4'>Good to Know</h2>
        <p className='text-xl text-gray-600'>
          Essential information about your transfer service
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
        <div className='bg-white p-6 rounded-xl shadow-lg text-center'>
          <Plane className='w-12 h-12 text-blue-600 mx-auto mb-4' />
          <h3 className='font-bold text-gray-900 mb-2'>Flight Tracking</h3>
          <p className='text-gray-600 text-sm'>
            We monitor your flight to adjust for delays automatically
          </p>
        </div>

        <div className='bg-white p-6 rounded-xl shadow-lg text-center'>
          <Clock className='w-12 h-12 text-blue-600 mx-auto mb-4' />
          <h3 className='font-bold text-gray-900 mb-2'>Travel Time</h3>
          <p className='text-gray-600 text-sm'>
            Approximately {travelTime} within Punta Cana zone
          </p>
        </div>

        <div className='bg-white p-6 rounded-xl shadow-lg text-center'>
          <Baby className='w-12 h-12 text-blue-600 mx-auto mb-4' />
          <h3 className='font-bold text-gray-900 mb-2'>Child Safety</h3>
          <p className='text-gray-600 text-sm'>
            Child seats available upon request for safe travel
          </p>
        </div>

        <div className='bg-white p-6 rounded-xl shadow-lg text-center'>
          <h3 className='font-bold text-gray-900 mb-2'>24/7 Service</h3>
          <p className='text-gray-600 text-sm'>
            Round-the-clock availability with advance reservation
          </p>
        </div>
      </div>
    </div>
  </motion.section>
);

// Final CTA Section
const FinalCTASection: React.FC<{
  isPremium: boolean;
  onBookClick: () => void;
}> = ({ isPremium, onBookClick }) => (
  <motion.section
    className='py-24 px-6 bg-gray-900'
    initial='hidden'
    whileInView='visible'
    viewport={{ once: true }}
    variants={fadeInUp}
  >
    <div className='max-w-6xl mx-auto'>
      <div className='text-center text-white'>
        <h2 className='text-4xl md:text-5xl font-bold mb-6'>
          Ready to Start Your Vacation Stress-Free?
        </h2>
        <p className='text-xl mb-8 max-w-2xl mx-auto opacity-90'>
          Secure your hassle-free transportation now and start your vacation the
          moment you land. Avoid the hassle—travel in style and peace of mind.
        </p>

        <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
          <button
            onClick={onBookClick}
            className={`px-8 py-4 rounded-xl font-bold text-lg shadow-lg transform transition-all duration-300 hover:scale-105 ${
              isPremium
                ? 'bg-amber-500 hover:bg-amber-600 text-amber-900'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            Book Your Transfer
            <ArrowRight className='inline-block ml-2 h-5 w-5' />
          </button>
          <p className='text-gray-300 text-sm'>
            🚐 Private Van | Group Shuttle available
          </p>
        </div>
      </div>
    </div>
  </motion.section>
);

// Disclaimer Section
const DisclaimerSection: React.FC = () => (
  <motion.section
    className='py-12 px-6 bg-amber-50'
    initial='hidden'
    whileInView='visible'
    viewport={{ once: true }}
    variants={fadeInUp}
  >
    <div className='max-w-4xl mx-auto'>
      <div className='flex gap-4'>
        <Shield className='w-6 h-6 text-amber-600 flex-shrink-0 mt-1' />
        <div>
          <h3 className='font-semibold text-amber-900 mb-2'>
            Important Information
          </h3>
          <p className='text-amber-800 text-sm'>
            To ensure your pickup, please provide accurate flight details and
            contact information. Changes or cancellations should be made at
            least 24 hours in advance for the best service experience.
          </p>
        </div>
      </div>
    </div>
  </motion.section>
);

export default AirportServiceView;
