import React, { useState, useMemo } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { Service } from '@/types/type';
import { ServiceData } from '@/types/services';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Clock,
  Calendar,
  Users,
  Shield,
  Heart,
  Info,
  Sparkles,
  Star,
  ArrowRight,
  Activity,
  MessageCircle,
  Camera,
  Baby,
  BookOpen,
  Palette,
  Music,
  Gamepad2,
  Trophy,
  CheckCircle,
  Phone,
  Mail,
} from 'lucide-react';
import { useBooking } from '@/context/BookingContext';
import { BookingDate } from '@/constants/formFields';
import BookingModal from '../../modal/BookingModal';

interface BabysitterServiceViewProps {
  service: Service;
  serviceData?: ServiceData;
  primaryColor?: string;
  viewContext?: 'standard-view' | 'premium-view';
}

const GALLERY_IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=2040&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: 'Art & crafts time',
  },
  {
    src: 'https://plus.unsplash.com/premium_photo-1661727647956-7d7d3e8ed550?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: 'Outdoor exploration',
  },
  {
    src: 'https://images.unsplash.com/photo-1587323655395-b1c77a12c89a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: 'Storytime favorites',
  },
  {
    src: 'https://parentscanada.com/wp-content/uploads/2022/11/teenage-babysitter.jpg',
    alt: 'Learning through play',
  },
];

const ACTIVITY_ICONS = [Palette, BookOpen, Music, Gamepad2, Activity, Baby];
const ACTIVITY_COLORS = [
  'bg-pink-50 text-pink-600',
  'bg-blue-50 text-blue-600',
  'bg-purple-50 text-purple-600',
  'bg-green-50 text-green-600',
  'bg-orange-50 text-orange-600',
  'bg-yellow-50 text-yellow-600',
];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const BabysitterServiceView: React.FC<BabysitterServiceViewProps> = ({
  service,
  serviceData,
  primaryColor = 'blue',
  viewContext,
}) => {
  const { t } = useTranslation();
  const { bookService } = useBooking();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const isPremium = useMemo(
    () =>
      service.packageType.includes('premium') || viewContext === 'premium-view',
    [service.packageType, viewContext]
  );

  const handleBookingConfirm = (
    bookingService: Service,
    dates: BookingDate,
    guests: number
  ) => {
    bookService(bookingService, dates, guests);
    setIsModalOpen(false);
  };

  return (
    <div className='w-full mx-auto '>
      {/* Hero Section */}
      <motion.div
        className='relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
        initial='hidden'
        animate='visible'
        variants={fadeInUp}
      >
        <div className='absolute top-0 right-0 w-full h-full opacity-10'>
          <Image
            src='https://integrity-asia.com/wp-content/uploads/indoor-image-young-female-babysitter-sitting-dining-table-spacious-living-room-teaching-children-how-make-origami-three-kids-making-paper-planes-together-with-their-mother-home.jpg'
            alt='Children playing'
            fill
            className='object-cover'
          />
        </div>

        <div className='relative p-12 md:p-16'>
          <div className='mb-6'>
            {isPremium ? (
              <div className='inline-flex items-center bg-gradient-to-r from-amber-100 to-orange-100 px-4 py-2 rounded-full border border-amber-200'>
                <Sparkles className='w-5 h-5 text-amber-600 mr-2' />
                <span className='text-sm font-semibold text-amber-700 uppercase tracking-wider'>
                  {t('services.standard.babysitterView.hero.premiumBadge')}
                </span>
              </div>
            ) : (
              <div className='inline-flex items-center bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-full border border-blue-200'>
                <Heart className='w-5 h-5 text-blue-600 mr-2' />
                <span className='text-sm font-semibold text-blue-700 uppercase tracking-wider'>
                  {t('services.standard.babysitterView.hero.standardBadge')}
                </span>
              </div>
            )}
          </div>

          <h1 className='text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight'>
            {isPremium ? (
              <>
                {t('services.standard.babysitterView.hero.premiumTitle')}{' '}
                <span className='text-amber-600'>
                  {t(
                    'services.standard.babysitterView.hero.premiumTitleHighlight'
                  )}
                </span>
                <br />
                {t('services.standard.babysitterView.hero.premiumTitleSuffix')}
              </>
            ) : (
              <>
                {t('services.standard.babysitterView.hero.standardTitle')}{' '}
                <span className='text-blue-600'>
                  {t(
                    'services.standard.babysitterView.hero.standardTitleHighlight'
                  )}
                </span>
                <br />
                {t('services.standard.babysitterView.hero.standardTitleSuffix')}
              </>
            )}
          </h1>

          <p className='text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl leading-relaxed'>
            {t('services.standard.babysitterView.hero.description')}
          </p>

          <div className='flex flex-wrap gap-6 mb-8'>
            <div className='flex items-center bg-white/70 backdrop-blur-sm px-4 py-3 rounded-xl'>
              <Shield className='w-5 h-5 text-green-600 mr-2' />
              <span className='font-medium text-gray-700'>
                {t('services.standard.babysitterView.hero.badge1')}
              </span>
            </div>
            <div className='flex items-center bg-white/70 backdrop-blur-sm px-4 py-3 rounded-xl'>
              <Users className='w-5 h-5 text-blue-600 mr-2' />
              <span className='font-medium text-gray-700'>
                {t('services.standard.babysitterView.hero.badge2')}
              </span>
            </div>
            <div className='flex items-center bg-white/70 backdrop-blur-sm px-4 py-3 rounded-xl'>
              <Clock className='w-5 h-5 text-purple-600 mr-2' />
              <span className='font-medium text-gray-700'>
                {t('services.standard.babysitterView.hero.badge3')}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className='bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-xl font-semibold text-lg flex items-center gap-3 transition-colors group'
          >
            {t('services.standard.babysitterView.hero.bookButton')}
            <ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform' />
          </button>
        </div>
      </motion.div>

      {/* Activities Grid */}
      <motion.div
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true }}
        variants={stagger}
      >
        <div className='text-center mb-12 mt-10'>
          <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>
            {t('services.standard.babysitterView.activities.title')}
          </h2>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
            {t('services.standard.babysitterView.activities.subtitle')}
          </p>
        </div>

        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6 px-5'>
          {[1, 2, 3, 4, 5, 6].map((num, index) => {
            const IconComponent = ACTIVITY_ICONS[index];
            return (
              <motion.div
                key={num}
                className='group bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-300'
                variants={fadeInUp}
                whileHover={{ y: -4 }}
              >
                <div
                  className={`w-12 h-12 rounded-xl ${ACTIVITY_COLORS[index]} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                >
                  <IconComponent className='w-6 h-6' />
                </div>
                <h3 className='text-xl font-bold text-gray-900 mb-3'>
                  {t(
                    `services.standard.babysitterView.activities.activity${num}.title`
                  )}
                </h3>
                <p className='text-gray-600 leading-relaxed'>
                  {t(
                    `services.standard.babysitterView.activities.activity${num}.description`
                  )}
                </p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Interactive Gallery */}
      <motion.div
        className='bg-gray-50 rounded-3xl p-5 md:p-5 mt-12 mb-12'
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <h2 className='text-3xl font-bold text-gray-900 mb-8 flex items-center'>
          <Camera className='mr-4 w-8 h-8 text-gray-600' />
          {t('services.standard.babysitterView.gallery.title')}
        </h2>

        <div className='grid md:grid-cols-2 gap-8'>
          <div className='relative h-80 rounded-2xl overflow-hidden group'>
            <Image
              src={GALLERY_IMAGES[selectedImageIndex].src}
              alt={GALLERY_IMAGES[selectedImageIndex].alt}
              fill
              className='object-cover group-hover:scale-105 transition-transform duration-500'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent'>
              <div className='absolute bottom-0 left-0 right-0 p-6'>
                <p className='text-white text-lg font-medium'>
                  {t(
                    `services.standard.babysitterView.gallery.caption${
                      selectedImageIndex + 1
                    }`
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className='grid grid-cols-3 gap-3'>
            {GALLERY_IMAGES.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={`relative aspect-square rounded-xl overflow-hidden transition-all duration-300 ${
                  selectedImageIndex === index
                    ? 'ring-4 ring-blue-500 scale-105'
                    : 'hover:scale-105 hover:ring-2 hover:ring-gray-300'
                }`}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className='object-cover'
                />
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Safety & Trust Section */}
      <motion.div
        className='grid md:grid-cols-2 gap-12 items-center px-5 md:px-12 mt-20'
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div>
          <h2 className='text-3xl font-bold text-gray-900 mb-6'>
            {t('services.standard.babysitterView.safety.title')}
          </h2>
          <div className='space-y-6'>
            <div className='flex items-start'>
              <div className='w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center mr-4 flex-shrink-0'>
                <Shield className='w-5 h-5 text-green-600' />
              </div>
              <div>
                <h3 className='font-semibold text-gray-900 mb-2'>
                  {t('services.standard.babysitterView.safety.feature1.title')}
                </h3>
                <p className='text-gray-600'>
                  {t(
                    'services.standard.babysitterView.safety.feature1.description'
                  )}
                </p>
              </div>
            </div>

            <div className='flex items-start'>
              <div className='w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center mr-4 flex-shrink-0'>
                <Heart className='w-5 h-5 text-purple-600' />
              </div>
              <div>
                <h3 className='font-semibold text-gray-900 mb-2'>
                  {t('services.standard.babysitterView.safety.feature2.title')}
                </h3>
                <p className='text-gray-600'>
                  {t(
                    'services.standard.babysitterView.safety.feature2.description'
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className='relative h-96 rounded-2xl overflow-hidden'>
          <Image
            src='https://res.cloudinary.com/ddg92xar5/image/upload/v1756210645/babysitteer_xle7mo.png'
            alt='Caring babysitter with child'
            fill
            className='object-cover'
          />
        </div>
      </motion.div>

      {/* Testimonials */}
      <motion.div
        className='bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 md:p-12 mt-20'
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className='text-center mb-12'>
          <h2 className='text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center'>
            <MessageCircle className='mr-3 w-8 h-8' />
            {t('services.standard.babysitterView.testimonials.title')}
          </h2>
          <p className='text-xl text-gray-600'>
            {t('services.standard.babysitterView.testimonials.subtitle')}
          </p>
        </div>

        <div className='grid md:grid-cols-3 gap-8'>
          {[1, 2, 3].map((num) => (
            <div key={num} className='bg-white rounded-2xl p-8 shadow-sm'>
              <div className='flex mb-4'>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className='w-5 h-5 text-yellow-400 fill-current'
                  />
                ))}
              </div>
              <blockquote className='text-gray-700 text-lg italic mb-6 leading-relaxed'>
                "
                {t(
                  `services.standard.babysitterView.testimonials.testimonial${num}.quote`
                )}
                "
              </blockquote>
              <div>
                <cite className='text-gray-900 font-semibold not-italic'>
                  {t(
                    `services.standard.babysitterView.testimonials.testimonial${num}.author`
                  )}
                </cite>
                <div className='text-gray-500 text-sm'>
                  {t(
                    `services.standard.babysitterView.testimonials.testimonial${num}.children`
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* FAQ Section */}
      <motion.div
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true }}
        variants={fadeInUp}
        className='px-5 md:px-12 mt-20 mb-12'
      >
        <div className='text-center mb-12'>
          <h2 className='text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center'>
            <Info className='mr-3 w-8 h-8' />
            {t('services.standard.babysitterView.faq.title')}
          </h2>
          <p className='text-xl text-gray-600'>
            {t('services.standard.babysitterView.faq.subtitle')}
          </p>
        </div>

        <div className='grid md:grid-cols-2 gap-6'>
          {[1, 2, 3, 4].map((num) => (
            <div
              key={num}
              className='bg-white rounded-2xl p-8 shadow-sm border border-gray-100'
            >
              <h3 className='font-semibold text-gray-900 mb-4 text-lg'>
                {t(
                  `services.standard.babysitterView.faq.question${num}.question`
                )}
              </h3>
              <p className='text-gray-600 leading-relaxed'>
                {t(
                  `services.standard.babysitterView.faq.question${num}.answer`
                )}
              </p>
            </div>
          ))}
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

export default BabysitterServiceView;
