import React, { useState } from 'react';
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
  Instagram,
} from 'lucide-react';
import { useBooking } from '@/context/BookingContext';
import { BookingDate } from '@/constants/formFields';
import BookingModal from '../../modal/BookingModal';

interface BabysitterServiceViewProps {
  service: Service;
  serviceData?: ServiceData;
  primaryColor: string;
  viewContext?: 'standard-view' | 'premium-view';
}

const BabysitterServiceView: React.FC<BabysitterServiceViewProps> = ({
  service,
  serviceData,
  viewContext,
}) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { bookService } = useBooking();

  // Manejar la confirmación de reserva
  const handleBookingConfirm = (
    bookingService: Service,
    dates: BookingDate,
    guests: number
  ) => {
    bookService(bookingService, dates, guests);
    setIsModalOpen(false);
  };

  const isPremium =
    service.packageType.includes('premium') || viewContext === 'premium-view';

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className='space-y-12'>
      {/* Hero Section with Tagline */}
      <motion.div
        className={`relative overflow-hidden rounded-2xl ${
          isPremium
            ? 'bg-gradient-to-r from-amber-900/90 to-amber-700/80'
            : 'bg-gradient-to-r from-blue-900/90 to-blue-700/80'
        }`}
        initial='hidden'
        animate='visible'
        variants={fadeIn}
      >
        <div className='absolute inset-0 -z-10'>
          <Image
            src='https://images.unsplash.com/photo-1560877241-1dc5479934b6?auto=format&fit=crop&q=80&w=1000'
            alt='Child playing'
            fill
            className='object-cover opacity-30'
          />
        </div>

        <div className='p-10 md:p-16 text-white'>
          <div className='flex items-center mb-4'>
            {isPremium ? (
              <div className='flex items-center bg-amber-500/20 backdrop-blur-sm px-3 py-1 rounded-full border border-amber-500/40'>
                <Sparkles className='h-4 w-4 text-amber-300 mr-2' />
                <span className='text-xs font-semibold uppercase tracking-wider text-amber-100'>
                  Premium Experience
                </span>
              </div>
            ) : (
              <div className='flex items-center bg-blue-500/20 backdrop-blur-sm px-3 py-1 rounded-full border border-blue-500/40'>
                <Heart className='h-4 w-4 text-blue-300 mr-2' />
                <span className='text-xs font-semibold uppercase tracking-wider text-blue-100'>
                  {t('services.standard.babysitter.chip')}
                </span>
              </div>
            )}
          </div>
          <h1 className='text-3xl md:text-5xl font-bold mb-4 leading-tight'>
            {isPremium
              ? 'Premium In-Villa Childcare Services'
              : 'Professional Babysitting Services'}
          </h1>
          <h2 className='text-xl md:text-2xl opacity-90 mb-8 max-w-3xl font-light'>
            {t('services.standard.babysitter.CTAHeaderSubTitle')}
          </h2>

          <div className='flex flex-wrap items-center gap-6 text-sm'>
            <div className='flex items-center'>
              <Shield className='h-5 w-5 mr-2 opacity-80' />
              <span> {t('services.standard.babysitter.headerOption1')}</span>
            </div>
            <div className='flex items-center'>
              <Users className='h-5 w-5 mr-2 opacity-80' />
              <span> {t('services.standard.babysitter.headerOption2')}</span>
            </div>
            <div className='flex items-center'>
              <Calendar className='h-5 w-5 mr-2 opacity-80' />
              <span> {t('services.standard.babysitter.headerOption3')}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Info with Image */}
      <motion.div
        className='grid grid-cols-1 md:grid-cols-2 gap-8 items-center'
        initial='hidden'
        animate='visible'
        variants={fadeIn}
      >
        <div className='relative h-[400px] rounded-2xl overflow-hidden'>
          <Image
            src={
              isPremium
                ? 'https://images.unsplash.com/photo-1596463059283-da257325bab8?auto=format&fit=crop&q=80&w=800'
                : 'https://images.unsplash.com/photo-1583244685026-d8519b5e3d21?auto=format&fit=crop&q=80&w=800'
            }
            alt='Babysitter with children'
            fill
            className='object-cover'
          />
          <div
            className={`absolute bottom-0 left-0 right-0 p-4 ${
              isPremium
                ? 'bg-gradient-to-t from-black/80 to-transparent'
                : 'bg-gradient-to-t from-black/70 to-transparent'
            }`}
          ></div>
        </div>

        <div>
          <h2
            className={`text-2xl md:text-3xl font-bold mb-6 ${
              isPremium ? 'text-amber-800' : 'text-blue-800'
            }`}
          >
            {serviceData?.titleKey
              ? t(serviceData.titleKey)
              : isPremium
              ? 'Your Peace of Mind. Their Happiness.'
              : 'Trust our experienced, background-checked babysitters'}
          </h2>
          <div className='space-y-4'>
            <div className='flex items-start'>
              <div
                className={`h-8 w-8 rounded-full ${
                  isPremium ? 'bg-amber-100' : 'bg-blue-100'
                } flex items-center justify-center mr-3 flex-shrink-0 mt-1`}
              >
                <Clock
                  className={`h-4 w-4 ${
                    isPremium ? 'text-amber-600' : 'text-blue-600'
                  }`}
                />
              </div>
              <div>
                <p className='font-medium text-gray-700'>
                  {t('services.standard.babysitter.ageRange')}
                </p>
                <p className='text-gray-600'>
                  {t('services.standard.babysitter.ageRangeAnswer')}
                </p>
              </div>
            </div>

            <div className='flex items-start'>
              <div
                className={`h-8 w-8 rounded-full ${
                  isPremium ? 'bg-amber-100' : 'bg-blue-100'
                } flex items-center justify-center mr-3 flex-shrink-0 mt-1`}
              >
                <Calendar
                  className={`h-4 w-4 ${
                    isPremium ? 'text-amber-600' : 'text-blue-600'
                  }`}
                />
              </div>
              <div>
                <p className='font-medium text-gray-700'>
                  {t('services.standard.babysitter.availability')}
                </p>
                {t('services.standard.babysitter.availabilityAnswer')}
              </div>
            </div>

            <div className='flex items-start'>
              <div
                className={`h-8 w-8 rounded-full ${
                  isPremium ? 'bg-amber-100' : 'bg-blue-100'
                } flex items-center justify-center mr-3 flex-shrink-0 mt-1`}
              >
                <Shield
                  className={`h-4 w-4 ${
                    isPremium ? 'text-amber-600' : 'text-blue-600'
                  }`}
                />
              </div>
              <div>
                <p className='font-medium text-gray-700'>
                  {t('services.standard.babysitter.safety')}
                </p>
                <p className='text-gray-600'>
                  {t('services.standard.babysitter.safetyAnswer')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Gallery Section with Instagram-like feel */}
      <motion.div
        className='bg-white rounded-2xl shadow-xl overflow-hidden'
        initial='hidden'
        animate='visible'
        variants={fadeIn}
      >
        <div className='p-8'>
          <h2
            className={`text-2xl font-bold mb-6 ${
              isPremium ? 'text-amber-800' : 'text-blue-800'
            } flex items-center`}
          >
            <Instagram className='mr-3' size={24} />
            Childcare Moments
          </h2>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            {[
              'https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&q=80&w=300',
              'https://images.unsplash.com/photo-1597413545419-4013d5fade59?auto=format&fit=crop&q=80&w=300',
              'https://images.unsplash.com/photo-1596464716066-8ee1cc47bb8e?auto=format&fit=crop&q=80&w=300',
              'https://images.unsplash.com/photo-1607453998774-d533f65dac99?auto=format&fit=crop&q=80&w=300',
            ].map((imgSrc, index) => (
              <div
                key={index}
                className='relative aspect-square rounded-lg overflow-hidden group'
              >
                <Image
                  src={imgSrc}
                  alt={`Childcare moment ${index + 1}`}
                  fill
                  className='object-cover transition-transform duration-300 group-hover:scale-110'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end'>
                  <p className='p-3 text-white text-sm font-medium'>
                    {
                      [
                        'Art & crafts time',
                        'Outdoor exploration',
                        'Storytime favorites',
                        'Learning through play',
                        'Snack preparation',
                        'Interactive games',
                        'Music & movement',
                        'Creative playtime',
                      ][index]
                    }
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Service Options */}
      <motion.div
        className='bg-white rounded-2xl shadow-xl overflow-hidden'
        initial='hidden'
        animate='visible'
        variants={fadeIn}
      ></motion.div>

      {/* Age-Appropriate Activities */}
      <motion.div initial='hidden' animate='visible' variants={fadeIn}>
        <div className='p-8'>
          <h2
            className={`text-2xl font-bold mb-6 ${
              isPremium ? 'text-amber-800' : 'text-blue-800'
            } flex items-center`}
          >
            <Activity className='mr-3' size={24} />
            {t('services.standard.babysitter.subTitle1')}
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-1 gap-6'>
            <div
              className={`p-6 rounded-xl ${
                isPremium
                  ? 'bg-gradient-to-br from-amber-50 to-amber-100/50'
                  : 'bg-gradient-to-br from-blue-50 to-blue-100/50'
              }`}
            >
              <div className='flex items-center mb-4'>
                <h3 className='text-lg font-semibold text-gray-800'>
                  {t('services.standard.babysitter.full')}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Testimonials Section */}
      <motion.div
        className={`rounded-2xl overflow-hidden ${
          isPremium ? 'bg-amber-50' : 'bg-blue-50'
        }`}
        initial='hidden'
        animate='visible'
        variants={fadeIn}
      >
        <div className='p-8'>
          <h2
            className={`text-2xl font-bold mb-6 ${
              isPremium ? 'text-amber-800' : 'text-blue-800'
            } flex items-center`}
          >
            <MessageCircle className='mr-3' size={24} />
            {t('services.standard.babysitter.testimonialTitle')}
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='bg-white p-6 rounded-xl shadow-sm'>
              <div className='flex mb-4'>
                <Star
                  size={16}
                  className={`${
                    isPremium
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-blue-400 fill-blue-400'
                  } mr-1`}
                />
              </div>
              <p className='italic text-gray-700 mb-4'>
                {' '}
                {t('services.standard.babysitter.testimonial1')}
              </p>
              <p className='text-sm font-medium text-gray-900'>Sarah M.</p>
            </div>
            <div className='bg-white p-6 rounded-xl shadow-sm'>
              <div className='flex mb-4'>
                <Star
                  size={16}
                  className={`${
                    isPremium
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-blue-400 fill-blue-400'
                  } mr-1`}
                />
              </div>
              <p className='italic text-gray-700 mb-4'>
                {' '}
                {t('services.standard.babysitter.testimonial2')}
              </p>
              <p className='text-sm font-medium text-gray-900'>David L.</p>
            </div>

            <div className='bg-white p-6 rounded-xl shadow-sm'>
              <div className='flex mb-4'>
                <Star
                  size={16}
                  className={`${
                    isPremium
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-blue-400 fill-blue-400'
                  } mr-1`}
                />
              </div>
              <p className='italic text-gray-700 mb-4'>
                {' '}
                {t('services.standard.babysitter.testimonial3')}
              </p>
              <p className='text-sm font-medium text-gray-900'>Michael R.</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* FAQ Section */}
      <motion.div
        className='bg-white rounded-2xl shadow-xl overflow-hidden'
        initial='hidden'
        animate='visible'
        variants={fadeIn}
      >
        <div className='p-8'>
          <h2
            className={`text-2xl font-bold mb-6 ${
              isPremium ? 'text-amber-800' : 'text-blue-800'
            } flex items-center`}
          >
            <Info className='mr-3' size={24} />
            {t('services.standard.babysitter.faqsTitle')}
          </h2>

          <div className='space-y-4'>
            <div
              className={`p-6 rounded-xl border ${
                isPremium ? 'border-amber-200' : 'border-blue-200'
              }`}
            >
              <h3
                className={`text-lg font-medium mb-2 ${
                  isPremium ? 'text-amber-800' : 'text-blue-800'
                }`}
              >
                {t('services.standard.babysitter.faqQuestion1')}
              </h3>
              <p className='text-gray-700'>
                {' '}
                {t('services.standard.babysitter.faqAnswer1')}
              </p>
            </div>
            <div
              className={`p-6 rounded-xl border ${
                isPremium ? 'border-amber-200' : 'border-blue-200'
              }`}
            >
              <h3
                className={`text-lg font-medium mb-2 ${
                  isPremium ? 'text-amber-800' : 'text-blue-800'
                }`}
              >
                {t('services.standard.babysitter.faqQuestion2')}
              </h3>
              <p className='text-gray-700'>
                {' '}
                {t('services.standard.babysitter.faqAnswer2')}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Call-to-Action Section */}
      <motion.div
        className={`rounded-2xl overflow-hidden ${
          isPremium
            ? 'bg-gradient-to-r from-amber-600 to-amber-800'
            : 'bg-gradient-to-r from-blue-600 to-blue-800'
        }`}
        initial='hidden'
        animate='visible'
        variants={fadeIn}
      >
        <div className='p-10 md:p-16 text-white text-center'>
          <h2 className='text-3xl md:text-4xl font-bold mb-4'>
            {t('services.standard.babysitter.CTATitle')}
          </h2>
          <p className='text-xl opacity-90 mb-8 max-w-2xl mx-auto'>
            {t('services.standard.babysitter.CTASubTitle')}
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className={`py-3 px-8 rounded-full bg-white flex items-center mx-auto font-medium ${
              isPremium ? 'text-amber-700' : 'text-blue-700'
            }`}
          >
            {t('common.footer.bookNow')}
            <ArrowRight className='ml-2 h-5 w-5' />
          </button>
        </div>
      </motion.div>
      {/* Booking modal */}
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
