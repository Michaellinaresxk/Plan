import React, { useState } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { Service } from '@/types/type';
import { ServiceData, ServiceExtendedDetails } from '@/types/services';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  Car,
  MapPin,
  ArrowRight,
  Shield,
  Route,
  Check,
  Star,
  Award,
  PlayCircle,
  Crown,
  Truck,
  Bus,
} from 'lucide-react';
import { useBooking } from '@/context/BookingContext';
import { BookingDate } from '@/types/type';
import BookingModal from '../../modal/BookingModal';
import {
  POPULAR_ROUTES,
  TRANSFER_GALLERY,
  TRANSFER_PROCESS,
  VEHICLE_FEATURES,
  WHATS_INCLUDED,
  WHATS_NOT_INCLUDED,
} from '@/constants/pointToPoint';
import { POINT_TO_POINT_VEHICLES, TRANSPORT_ZONES } from '@/constants/zone';

interface PointToPointServiceViewProps {
  service: Service;
  serviceData?: ServiceData;
  extendedDetails?: ServiceExtendedDetails;
  primaryColor: string;
}

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

const PointToPointServiceView: React.FC<PointToPointServiceViewProps> = ({
  service,
  serviceData,
  extendedDetails,
  primaryColor,
}) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { bookService } = useBooking();

  const isPremium = service.packageType.includes('premium');
  const travelTime = extendedDetails?.travelTime || '15-45 min';

  const handleBookingConfirm = (
    bookingService: Service,
    dates: BookingDate,
    guests: number
  ) => {
    bookService(bookingService, dates, guests);
    setIsModalOpen(false);
  };

  return (
    <div className='min-h-screen bg-white'>
      {/* Hero Section */}
      <HeroSection
        service={service}
        isPremium={isPremium}
        onBookClick={() => setIsModalOpen(true)}
      />

      {/* Popular Routes Section */}
      <PopularRoutesSection onBookClick={() => setIsModalOpen(true)} />

      {/* Vehicle Options Section */}
      <VehicleOptionsSection
        isPremium={isPremium}
        onBookClick={() => setIsModalOpen(true)}
      />

      {/* Gallery Section */}
      <GallerySection />

      {/* Process Section */}
      <ProcessSection />

      {/* Human Banner CTA */}
      <HumanBannerSection onBookClick={() => setIsModalOpen(true)} />

      {/* What's Included Section */}
      <IncludedSection />

      {/* Coverage Area Section */}
      <CoverageAreaSection />

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
  onBookClick: () => void;
}> = ({ service, isPremium, onBookClick }) => (
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
              Go Anywhere
              <span className='block text-emerald-400'>In Comfort</span>
            </h1>
            <p className='text-xl leading-relaxed max-w-lg opacity-90'>
              Professional point-to-point transportation between any locations
              in Punta Cana. From hotels to attractions, restaurants to beaches
              - we'll get you there safely and on time.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={staggerChildren}
            className='flex flex-wrap gap-6'
          >
            <StatItem icon={Route} value='50+' label='Destinations' />
            <StatItem icon={Star} value='4.9' label='Rating' />
            <StatItem icon={Car} value='24/7' label='Available' />
          </motion.div>

          {/* CTA */}
          <motion.div variants={fadeInUp} className='pt-4'>
            <button
              onClick={onBookClick}
              className='group inline-flex items-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:scale-[1.02] shadow-xl'
            >
              <PlayCircle className='w-5 h-5' />
              Book Your Ride
              <ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform' />
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  </motion.section>
);

// Popular Routes Section
const PopularRoutesSection: React.FC<{
  onBookClick: () => void;
}> = ({ onBookClick }) => (
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
          Popular Routes
        </h2>
        <p className='text-xl text-gray-600'>
          Most requested destinations for our transportation service
        </p>
      </motion.div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
        {POPULAR_ROUTES.map((route, index) => (
          <motion.div
            key={index}
            variants={fadeInUp}
            className='bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100'
          >
            <div className='flex items-center justify-between mb-4'>
              <div className='text-2xl font-bold text-emerald-600'>
                ${route.price}
              </div>
              <div className='text-sm text-gray-500'>{route.time}</div>
            </div>

            <div className='mb-4'>
              <div className='flex items-center text-gray-700 mb-2'>
                <div className='w-3 h-3 bg-emerald-600 rounded-full mr-3'></div>
                <span className='font-medium'>{route.from}</span>
              </div>
              <div className='flex items-center justify-center my-2'>
                <ArrowRight className='w-4 h-4 text-gray-400' />
              </div>
              <div className='flex items-center text-gray-700'>
                <div className='w-3 h-3 bg-blue-600 rounded-full mr-3'></div>
                <span className='font-medium'>{route.to}</span>
              </div>
            </div>

            <p className='text-gray-600 text-sm mb-6'>{route.description}</p>

            <button
              onClick={onBookClick}
              className='w-full py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors'
            >
              Book This Route
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  </motion.section>
);

// Vehicle Options Section
const VehicleOptionsSection: React.FC<{
  isPremium: boolean;
  onBookClick: () => void;
}> = ({ isPremium, onBookClick }) => (
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
          Choose Your Vehicle
        </h2>
        <p className='text-xl text-gray-600'>
          Select the perfect vehicle for your comfort and group size
        </p>
      </motion.div>
      {/* 
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {Object.entries(POINT_TO_POINT_VEHICLES).map(([key, vehicle]) => {
          const IconComponent =
            vehicle.icon === 'Car'
              ? Car
              : vehicle.icon === 'Truck'
              ? Truck
              : vehicle.icon === 'Bus'
              ? Bus
              : vehicle.icon === 'Crown'
              ? Crown
              : Car;

          return (
            <motion.div
              key={key}
              variants={fadeInUp}
              className='bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300'
            >
              <div className='text-center'>
                <div
                  className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                    key === 'luxury' ? 'bg-amber-100' : 'bg-emerald-100'
                  }`}
                >
                  <IconComponent
                    className={`w-8 h-8 ${
                      key === 'luxury' ? 'text-amber-600' : 'text-emerald-600'
                    }`}
                  />
                </div>

                <h3 className='font-bold text-gray-900 text-lg mb-2'>
                  {vehicle.name}
                </h3>

                <p className='text-gray-600 text-sm mb-4'>
                  {vehicle.description}
                </p>

                <div className='space-y-2 text-sm text-gray-700 mb-4'>
                  <div className='flex justify-between'>
                    <span>Capacity:</span>
                    <span>{vehicle.capacity} passengers</span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Luggage:</span>
                    <span>{vehicle.suitcases} suitcases</span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Additional:</span>
                    <span
                      className={
                        vehicle.additionalCost > 0
                          ? 'text-amber-600 font-medium'
                          : 'text-green-600 font-medium'
                      }
                    >
                      {vehicle.additionalCost > 0
                        ? `+$${vehicle.additionalCost}`
                        : 'Base price'}
                    </span>
                  </div>
                </div>

                {key === 'luxury' && (
                  <div className='mb-4'>
                    <span className='inline-flex items-center px-3 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full'>
                      <Crown className='w-3 h-3 mr-1' />
                      Premium
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div> */}

      <motion.div variants={fadeInUp} className='text-center mt-12'>
        <button
          onClick={onBookClick}
          className='bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:scale-[1.02] shadow-lg'
        >
          Book Your Transfer Now
        </button>
      </motion.div>
    </div>
  </motion.section>
);

// Gallery Section
const GallerySection: React.FC = () => (
  <motion.section
    className='px-6'
    initial='hidden'
    whileInView='visible'
    viewport={{ once: true }}
    variants={staggerChildren}
  >
    <div className='max-w-6xl mx-auto mt-10'>
      <motion.div variants={fadeInUp} className='text-center mb-16'>
        <h2 className='text-2xl md:text-4xl font-bold text-gray-900 mb-4'>
          Professional Transport Experience
        </h2>
        <p className='text-xl text-gray-600'>
          Comfort, safety, and reliability in every journey
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

// Process Section
const ProcessSection: React.FC = () => (
  <motion.section
    className='py-24 px-6'
    initial='hidden'
    whileInView='visible'
    viewport={{ once: true }}
    variants={staggerChildren}
  >
    <div className='max-w-6xl mx-auto'>
      <motion.div variants={fadeInUp} className='text-center mb-16'>
        <h2 className='text-4xl font-bold text-gray-900 mb-4'>How It Works</h2>
        <p className='text-xl text-gray-600'>
          Simple, reliable transportation in 4 easy steps
        </p>
      </motion.div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
        {TRANSFER_PROCESS.map((step, index) => (
          <motion.div key={index} variants={fadeInUp} className='text-center'>
            <div className='relative mb-6'>
              <div className='w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto'>
                <step.icon className='w-8 h-8 text-emerald-600' />
              </div>
              <div className='absolute -top-2 -right-2 w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold'>
                {step.step}
              </div>
            </div>
            <h3 className='font-bold text-gray-900 text-lg mb-2'>
              {step.title}
            </h3>
            <p className='text-gray-600'>{step.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </motion.section>
);

// Coverage Area Section
const CoverageAreaSection: React.FC = () => (
  <motion.section
    className='py-24 px-6 bg-emerald-50'
    initial='hidden'
    whileInView='visible'
    viewport={{ once: true }}
    variants={fadeInUp}
  >
    <div className='max-w-6xl mx-auto'>
      <div className='text-center mb-16'>
        <h2 className='text-4xl font-bold text-gray-900 mb-4'>
          Coverage Areas
        </h2>
        <p className='text-xl text-gray-600'>
          We serve all major destinations in the Dominican Republic
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {TRANSPORT_ZONES.filter((zone) => zone.isPopular).map((zone) => (
          <div
            key={zone.id}
            className='bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300'
          >
            <div className='flex items-center mb-3'>
              <MapPin className='w-5 h-5 text-emerald-600 mr-3' />
              <h3 className='font-bold text-gray-900'>{zone.displayName}</h3>
            </div>
            <p className='text-gray-600 text-sm mb-4'>{zone.description}</p>
            {zone.landmarks && (
              <div className='text-xs text-gray-500'>
                <strong>Landmarks:</strong>{' '}
                {zone.landmarks.slice(0, 2).join(', ')}
                {zone.landmarks.length > 2 && '...'}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className='text-center mt-12'>
        <div className='bg-white rounded-xl p-6 shadow-lg inline-block'>
          <h3 className='font-bold text-gray-900 mb-2'>Extended Coverage</h3>
          <p className='text-gray-600'>
            Need to go somewhere not listed? We also serve La Romana, Santo
            Domingo, and Samaná Peninsula with premium long-distance service.
          </p>
        </div>
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
        src='https://res.cloudinary.com/ddg92xar5/image/upload/v1756210028/2_indxf4.jpg'
        alt='Professional driver service'
        fill
        className='object-cover'
      />
      <div className='absolute inset-0 bg-black/70'></div>
    </div>

    <div className='relative z-10 max-w-4xl mx-auto text-center text-white'>
      <h2 className='text-4xl md:text-5xl font-bold mb-6'>
        Your Personal Driver
        <span className='block text-emerald-400'>Wherever You Need to Go</span>
      </h2>
      <p className='text-xl mb-8 max-w-2xl mx-auto opacity-90'>
        From hotel to restaurant, beach to attraction, or any destination in
        between. Professional, punctual, and always comfortable.
      </p>

      <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
        <button
          onClick={onBookClick}
          className='bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:scale-[1.02] shadow-xl'
        >
          Book Your Transfer Now
        </button>
        <p className='text-sm opacity-75'>
          Available 24/7 with advance reservation
        </p>
      </div>
    </div>
  </motion.section>
);

// What's Included Section
const IncludedSection: React.FC = () => (
  <motion.section
    className='py-24 px-6'
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

          {/* Vehicle Features */}
          <div className='mt-8 bg-emerald-50 rounded-2xl p-8'>
            <h3 className='text-xl font-bold text-gray-900 mb-4'>
              Vehicle Features
            </h3>
            <div className='grid grid-cols-2 gap-4'>
              {VEHICLE_FEATURES.map((feature, index) => (
                <div key={index} className='flex items-center text-gray-700'>
                  <feature.icon className='w-4 h-4 text-emerald-600 mr-2' />
                  <span className='text-sm'>{feature.label}</span>
                </div>
              ))}
            </div>
          </div>
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
          Ready to Travel in Comfort?
        </h2>
        <p className='text-xl mb-8 max-w-2xl mx-auto opacity-90'>
          Book your professional point-to-point transfer now. Reliable,
          comfortable, and always on time.
        </p>

        <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
          <button
            onClick={onBookClick}
            className={`px-8 py-4 rounded-xl font-bold text-lg shadow-lg transform transition-all duration-300 hover:scale-105 ${
              isPremium
                ? 'bg-amber-500 hover:bg-amber-600 text-amber-900'
                : 'bg-emerald-500 hover:bg-emerald-600 text-white'
            }`}
          >
            Book Your Transfer
            <ArrowRight className='inline-block ml-2 h-5 w-5' />
          </button>
          <p className='text-gray-300 text-sm'>
            Professional service | 24/7 availability
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
            Service Information
          </h3>
          <p className='text-amber-800 text-sm'>
            Please provide accurate pickup and destination addresses to ensure
            smooth service. For locations outside our standard coverage areas,
            custom quotes may apply. Cancellations should be made at least 24
            hours in advance.
          </p>
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

export default PointToPointServiceView;
