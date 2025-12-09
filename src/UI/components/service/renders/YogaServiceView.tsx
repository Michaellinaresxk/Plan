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
  User,
  MapPin,
  Shield,
  Clock,
  Heart,
  Sparkles,
  ArrowRight,
  Wind,
  CheckCircle,
  Play,
  Quote,
  Moon,
  Info,
  XCircle,
  Gift,
  Waves,
  Leaf,
} from 'lucide-react';
import YogalVideoGallery from '../YogaVideoGallery';
import { fadeInUp, slideIn, videos } from '@/constants/yoga';

interface YogaServiceViewProps {
  service: Service;
  serviceData?: ServiceData;
  primaryColor: string;
  viewContext?: 'standard-view' | 'premium-view';
}

export const SERVICE_METADATA = {
  title: 'Yoga Sessions | Relax & Rejuvenate',
  description:
    'Professional yoga sessions for all levels. Relax and rejuvenate with our expert instructors in a beautiful beachfront setting.',
  image: '/images/services/yoga-standard-og.jpg', // 1200x630px
  imageAlt: 'Yoga session',
  keywords: ['yoga', 'wellness', 'relaxation', 'punta cana', 'meditation'],
  duration: '1.5 - 2 hours',
  price: '$...',
} as const;

const YogaServiceView: React.FC<YogaServiceViewProps> = ({ service }) => {
  const { t } = useTranslation();
  const { bookService } = useBooking();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('');

  const LOCATIONS = [
    {
      id: 'beach',
      name: t('services.standard.yoga.locations.beach'),
      image:
        'https://images.unsplash.com/photo-1591228127791-8e2eaef098d3?auto=format&fit=crop&q=80&w=800',
      icon: <Waves className='w-5 h-5' />,
    },
    {
      id: 'pool',
      name: t('services.standard.yoga.locations.pool'),
      image:
        'https://res.cloudinary.com/ddg92xar5/image/upload/v1761494335/Yoga_Class_-_all_level_1_zs0q6u.jpg',
      icon: <Sparkles className='w-5 h-5' />,
    },
    {
      id: 'garden',
      name: t('services.standard.yoga.locations.garden'),
      image:
        'https://res.cloudinary.com/ddg92xar5/image/upload/v1761494399/Stretching___Yin_Yoga_odnzpb.jpg',
      icon: <Leaf className='w-5 h-5' />,
    },
    {
      id: 'villa',
      name: t('services.standard.yoga.locations.villa'),
      image:
        'https://res.cloudinary.com/ddg92xar5/image/upload/v1761494381/Yoga_Class_-_all_level_2_jx3vbp.jpg',
      icon: <User className='w-5 h-5' />,
    },
  ];

  const handleBookingConfirm = (
    service: Service,
    dates: BookingDate,
    guests: number
  ) => {
    bookService(service, dates, guests);
    setIsModalOpen(false);
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-blue-50'>
      <div className='max-w-8xl mx-auto space-y-16 pb-16'>
        {/* Hero Section */}
        <motion.div
          className='relative overflow-hidden w-full my-6 sm:my-8 lg:my-12'
          initial='hidden'
          animate='visible'
          variants={fadeInUp}
        >
          <div className='relative h-[70vh] sm:h-[80vh] lg:h-[85vh] bg-gradient-to-r from-emerald-900/80 via-teal-800/70 to-cyan-900/80'>
            <div className='absolute inset-0 bg-black/30 z-[1]' />
            <Image
              src='https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1200'
              alt='Serene yoga practice at sunset'
              fill
              className='object-cover mix-blend-overlay opacity-60'
              priority
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 z-[2]' />

            {/* Floating Elements */}
            <motion.div
              className='absolute top-8 right-4 sm:top-12 sm:right-8 lg:top-20 lg:right-20 w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-white/10 rounded-full backdrop-blur-sm border border-white/20 hidden sm:block'
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 4, repeat: Infinity }}
            />

            <div className='relative z-10 h-full flex items-center justify-center text-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16'>
              <div className='max-w-5xl w-full space-y-6 sm:space-y-8 lg:space-y-10'>
                <motion.h1
                  className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-8xl font-bold text-white leading-tight'
                  variants={fadeInUp}
                >
                  {t('services.standard.yoga.hero.title')}
                  <br />
                  <span className='bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent'>
                    {t('services.standard.yoga.hero.titleHighlight')}
                  </span>
                </motion.h1>

                <motion.p
                  className='text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-white/90 max-w-4xl mx-auto leading-relaxed px-2'
                  variants={fadeInUp}
                >
                  {t('services.standard.yoga.hero.subtitle')}
                </motion.p>

                <motion.div
                  className='flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-8 max-w-4xl mx-auto justify-center'
                  variants={slideIn}
                >
                  <div className='flex items-center bg-white/10 backdrop-blur-sm px-3 py-3 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl border border-white/20 min-w-0 flex-1 sm:flex-none'>
                    <Clock className='w-4 h-4 sm:w-6 sm:h-6 text-white mr-2 sm:mr-3 flex-shrink-0' />
                    <div className='text-left min-w-0'>
                      <div className='text-white font-semibold text-sm sm:text-base truncate'>
                        {t('services.standard.yoga.hero.duration')}
                      </div>
                      <div className='text-white/70 text-xs sm:text-sm truncate'>
                        {t('services.standard.yoga.hero.dutationTitle')}
                      </div>
                    </div>
                  </div>
                  <div className='flex items-center bg-white/10 backdrop-blur-sm px-3 py-3 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl border border-white/20 min-w-0 flex-1 sm:flex-none'>
                    <User className='w-4 h-4 sm:w-6 sm:h-6 text-white mr-2 sm:mr-3 flex-shrink-0' />
                    <div className='text-left min-w-0'>
                      <div className='text-white font-semibold text-sm sm:text-base truncate'>
                        {t('services.standard.yoga.hero.age')}
                      </div>
                      <div className='text-white/70 text-xs sm:text-sm truncate'>
                        {t('services.standard.yoga.hero.level')}
                      </div>
                    </div>
                  </div>
                  <div className='flex items-center bg-white/10 backdrop-blur-sm px-3 py-3 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl border border-white/20 min-w-0 flex-1 sm:flex-none'>
                    <MapPin className='w-4 h-4 sm:w-6 sm:h-6 text-white mr-2 sm:mr-3 flex-shrink-0' />
                    <div className='text-left min-w-0'>
                      <div className='text-white font-semibold text-sm sm:text-base truncate'>
                        Your Rental
                      </div>
                      <div className='text-white/70 text-xs sm:text-sm truncate'>
                        {t('services.standard.yoga.hero.weCome')}
                      </div>
                    </div>
                  </div>
                </motion.div>

                <div className='pt-4 sm:pt-6 lg:pt-8'>
                  <motion.button
                    onClick={() => setIsModalOpen(true)}
                    className='group bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-3 sm:px-8 sm:py-4 lg:px-12 lg:py-5 rounded-xl lg:rounded-2xl font-bold text-base sm:text-lg lg:text-xl flex items-center gap-2 sm:gap-3 mx-auto transition-all duration-300 hover:scale-105 shadow-2xl max-w-xs sm:max-w-none'
                    variants={slideIn}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Play
                      className='w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7'
                      fill='currentColor'
                    />
                    <span className='whitespace-nowrap'>
                      {t('services.standard.yoga.hero.bookNow')}
                    </span>
                    <ArrowRight className='w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 group-hover:translate-x-1 transition-transform' />
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Location Selection */}
        <motion.div
          className='px-2'
          initial='hidden'
          animate='visible'
          variants={fadeInUp}
        >
          <div className='bg-gradient-to-r from-emerald-50 to-teal-50 rounded-3xl p-2'>
            <div className='text-center mb-16'>
              <h2 className='text-4xl font-bold text-gray-800 mb-6'>
                {t('services.standard.yoga.chooseLocation.title')}
              </h2>
              <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
                {t('services.standard.yoga.chooseLocation.subtitle')}
              </p>
            </div>

            <div className='grid grid-cols-2 md:grid-cols-2 gap-8'>
              {LOCATIONS.map((location, index) => (
                <motion.div
                  key={location.id}
                  className={`relative overflow-hidden rounded-3xl cursor-pointer group ${
                    selectedLocation === location.id
                      ? 'ring-4 ring-emerald-500'
                      : ''
                  }`}
                  onClick={() =>
                    setSelectedLocation(
                      selectedLocation === location.id ? '' : location.id
                    )
                  }
                  variants={fadeInUp}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className='relative h-40 md:h-80'>
                    <Image
                      src={location.image}
                      alt={location.name}
                      fill
                      className='object-cover transition-transform duration-700 group-hover:scale-110'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent' />

                    <div className='absolute top-6 left-6'>
                      <div className='flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white border border-white/30'>
                        {location.icon}
                        <span className='ml-2 font-light'>{location.name}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          className='px-4'
          initial='hidden'
          animate='visible'
          variants={fadeInUp}
        >
          <div className='bg-white rounded-3xl shadow-2xl overflow-hidden'>
            <div className='bg-gradient-to-r from-emerald-600 to-teal-600 p-12 text-white text-center'>
              <h2 className='text-4xl font-bold mb-4'>
                {t('services.standard.yoga.whatsIncluded.title')}
              </h2>
              <p className='text-xl opacity-90 max-w-2xl mx-auto'>
                {t('services.standard.yoga.whatsIncluded.subtitle')}
              </p>
            </div>

            <div className='p-12'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-12'>
                <div className='space-y-8'>
                  <h3 className='text-2xl font-bold text-gray-800 mb-6'>
                    {t('services.standard.yoga.whatsIncluded.included')}
                  </h3>
                  {[
                    {
                      icon: CheckCircle,
                      text: t(
                        'services.standard.yoga.whatsIncluded.items.equipment.title'
                      ),
                      desc: t(
                        'services.standard.yoga.whatsIncluded.items.equipment.description'
                      ),
                    },
                    {
                      icon: CheckCircle,
                      text: t(
                        'services.standard.yoga.whatsIncluded.items.personalized.title'
                      ),
                      desc: t(
                        'services.standard.yoga.whatsIncluded.items.personalized.description'
                      ),
                    },
                    {
                      icon: Shield,
                      text: t(
                        'services.standard.yoga.whatsIncluded.items.instructor.title'
                      ),
                      desc: t(
                        'services.standard.yoga.whatsIncluded.items.instructor.description'
                      ),
                    },
                  ].map((item, index) => (
                    <div key={index} className='flex items-start space-x-4'>
                      <div className='w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center flex-shrink-0'>
                        <item.icon className='w-6 h-6 text-emerald-600' />
                      </div>
                      <div>
                        <h4 className='text-lg font-bold text-gray-800 mb-1'>
                          {item.text}
                        </h4>
                        <p className='text-gray-600'>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className='space-y-8'>
                  <h3 className='text-2xl font-bold text-gray-800 mb-6'>
                    {t('services.standard.yoga.notIncluded.title')}
                  </h3>
                  <div className='flex items-start space-x-4'>
                    <div className='w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center flex-shrink-0'>
                      <Gift className='w-6 h-6 text-amber-600' />
                    </div>
                    <div>
                      <h4 className='text-lg font-bold text-gray-800 mb-1'>
                        {t('services.standard.yoga.notIncluded.secondaryText')}
                      </h4>
                      <p className='text-gray-600'>
                        {t('services.standard.yoga.notIncluded.subtitle')}
                      </p>
                    </div>
                  </div>

                  <div className='bg-gray-50 rounded-2xl p-6'>
                    <h4 className='text-lg font-semibold text-gray-800 mb-3'>
                      {t('services.standard.yoga.notIncluded.goodToKnow.title')}
                    </h4>
                    <ul className='space-y-2 text-gray-600 text-sm'>
                      <li>
                        •{' '}
                        <strong>
                          {t(
                            'services.standard.yoga.notIncluded.goodToKnow.start'
                          )}
                        </strong>{' '}
                        {t(
                          'services.standard.yoga.notIncluded.goodToKnow.startText'
                        )}
                      </li>
                      <li>
                        •{' '}
                        <strong>
                          {' '}
                          {t(
                            'services.standard.yoga.notIncluded.goodToKnow.whatToWear'
                          )}
                        </strong>{' '}
                        {t(
                          'services.standard.yoga.notIncluded.goodToKnow.whatToWearText'
                        )}
                      </li>
                      <li>
                        •{' '}
                        <strong>
                          {' '}
                          {t(
                            'services.standard.yoga.notIncluded.goodToKnow.adaptability'
                          )}
                        </strong>{' '}
                        {t(
                          'services.standard.yoga.notIncluded.goodToKnow.adaptabilityText'
                        )}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <YogalVideoGallery videos={videos} />

        {/* What to Expect Section - From PDF */}
        <motion.div
          className='px-2'
          initial='hidden'
          animate='visible'
          variants={fadeInUp}
        >
          <div className='text-center mb-16'>
            <h2 className='text-4xl font-bold text-gray-800 mb-6'>
              {t('services.standard.yoga.whatToExpect.title')}
            </h2>
            <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
              {t('services.standard.yoga.whatToExpect.subtitle')}
            </p>
          </div>

          <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {[
              {
                step: '1',
                title: t(
                  'services.standard.yoga.whatToExpect.items.setup.title'
                ),
                description: t(
                  'services.standard.yoga.whatToExpect.items.setup.description'
                ),
                icon: <Sparkles className='w-8 h-8' />,
                color: 'from-emerald-500 to-teal-500',
              },
              {
                step: '2',
                title: t(
                  'services.standard.yoga.whatToExpect.items.welcome.title'
                ),
                description: t(
                  'services.standard.yoga.whatToExpect.items.welcome.description'
                ),
                icon: <Heart className='w-8 h-8' />,
                color: 'from-teal-500 to-cyan-500',
              },
              {
                step: '3',
                title: t(
                  'services.standard.yoga.whatToExpect.items.practice.title'
                ),
                description: t(
                  'services.standard.yoga.whatToExpect.items.practice.description'
                ),
                icon: <Wind className='w-8 h-8' />,
                color: 'from-cyan-500 to-blue-500',
              },
              {
                step: '4',
                title: 'Grounding Relaxation',
                description: 'Finish with a grounding relaxation',
                icon: <Moon className='w-8 h-8' />,
                color: 'from-blue-500 to-indigo-500',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className='text-center'
                variants={fadeInUp}
                transition={{ delay: index * 0.1 }}
              >
                <div
                  className={`w-20 h-20 bg-gradient-to-r ${item.color} rounded-full flex items-center justify-center mx-auto mb-6 text-white shadow-lg`}
                >
                  {item.icon}
                </div>
                <div className='mb-3'>
                  <span className='text-3xl font-bold text-gray-300 mr-2'>
                    {item.step}
                  </span>
                  <h3 className='text-xl font-bold text-gray-800 inline'>
                    {item.title}
                  </h3>
                </div>
                <p className='text-gray-600'>{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Service Overview Section - From PDF */}
        <motion.div
          className='px-2'
          initial='hidden'
          animate='visible'
          variants={fadeInUp}
        >
          <div className='bg-white rounded-3xl shadow-xl p-8 md:p-12'>
            <div className='text-center mb-12'>
              <h2 className='text-4xl font-bold text-gray-800 mb-4'>
                {t('services.standard.yoga.serviceDetails.title')}
              </h2>
              <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
                {t('services.standard.yoga.serviceDetails.subtitle')}
              </p>
            </div>

            <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8'>
              <div className='text-center'>
                <div className='w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <Clock className='w-8 h-8 text-emerald-600' />
                </div>
                <h3 className='text-lg font-semibold text-gray-800 mb-2'>
                  {t('services.standard.yoga.serviceDetails.duration.title')}
                </h3>
                <p className='text-gray-600'>
                  {' '}
                  {t('services.standard.yoga.serviceDetails.duration.value')}
                </p>
              </div>

              <div className='text-center'>
                <div className='w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <MapPin className='w-8 h-8 text-emerald-600' />
                </div>
                <h3 className='text-lg font-semibold text-gray-800 mb-2'>
                  {t(
                    'services.standard.yoga.serviceDetails.meetingPoint.title'
                  )}
                </h3>
                <p className='text-gray-600'>
                  {' '}
                  {t(
                    'services.standard.yoga.serviceDetails.meetingPoint.value'
                  )}
                </p>
              </div>

              <div className='text-center'>
                <div className='w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <User className='w-8 h-8 text-emerald-600' />
                </div>
                <h3 className='text-lg font-semibold text-gray-800 mb-2'>
                  {t('services.standard.yoga.serviceDetails.age.title')}
                </h3>
                <p className='text-gray-600'>
                  {t('services.standard.yoga.serviceDetails.age.value')}
                </p>
              </div>

              <div className='text-center'>
                <div className='w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <XCircle className='w-8 h-8 text-emerald-600' />
                </div>
                <h3 className='text-lg font-semibold text-gray-800 mb-2'>
                  {t(
                    'services.standard.yoga.serviceDetails.cancellations.title'
                  )}
                </h3>
                <p className='text-gray-600'>
                  {t(
                    'services.standard.yoga.serviceDetails.cancellations.value'
                  )}
                </p>
              </div>
            </div>

            {/* Cancellation Policy Details */}
            <div className='bg-amber-50 border border-amber-200 rounded-2xl p-6 mt-8'>
              <div className='flex items-start'>
                <Info className='w-5 h-5 text-amber-600 mr-3 mt-0.5 flex-shrink-0' />
                <div>
                  <h4 className='font-semibold text-amber-800 mb-2'>
                    {/* Cancellation Policy */}
                    {t(
                      'services.standard.yoga.serviceDetails.cancellations.policyTitle'
                    )}
                  </h4>
                  <p className='text-amber-700 text-sm'>
                    {t(
                      'services.standard.yoga.serviceDetails.cancellations.policyText'
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          className='px-2'
          initial='hidden'
          animate='visible'
          variants={fadeInUp}
        >
          <div className='relative overflow-hidden rounded-3xl'>
            <div className='absolute inset-0'>
              <Image
                src='https://images.unsplash.com/photo-1588286840104-8957b019727f?auto=format&fit=crop&q=80&w=1200'
                alt='Peaceful yoga meditation'
                fill
                className='object-cover'
              />
              <div className='absolute inset-0 bg-gradient-to-r from-emerald-900/90 to-teal-900/80' />
            </div>

            <div className='relative z-10 p-6 text-center text-white'>
              <motion.h2
                className='text-4xl md:text-6xl font-bold mb-6'
                variants={fadeInUp}
              >
                {t('services.standard.yoga.finalCta.title')}
              </motion.h2>
              <motion.p
                className='text-xl opacity-90 mb-12 max-w-3xl mx-auto leading-relaxed'
                variants={fadeInUp}
              >
                {t('services.standard.yoga.finalCta.subtitle')}
              </motion.p>

              <motion.div
                className='flex flex-col sm:flex-row gap-6 justify-center items-center'
                variants={fadeInUp}
              >
                <button
                  onClick={() => setIsModalOpen(true)}
                  className='group bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-10 py-3 rounded-2xl font-bold text-1xl flex items-center gap-3 transition-all duration-300 hover:scale-105 shadow-2xl'
                >
                  <Sparkles className='w-6 h-6' />
                  {t('services.standard.yoga.finalCta.button')}
                  <ArrowRight className='w-6 h-6 group-hover:translate-x-1 transition-transform' />
                </button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Mindfulness Quote Banner */}
        <motion.div
          className='px-2'
          initial='hidden'
          animate='visible'
          variants={fadeInUp}
        >
          <div className='bg-gradient-to-r from-emerald-100 via-teal-50 to-cyan-100 rounded-3xl p-6 text-center relative overflow-hidden'>
            <Quote className='w-12 h-12 text-emerald-500 mx-auto mb-6' />
            <blockquote className='text-3xl md:text-4xl font-light text-gray-800 mb-6 italic leading-relaxed'>
              "{t('services.standard.yoga.quote.text')}"
            </blockquote>
            <cite className='text-xl text-emerald-600 font-medium'>
              - Judith Hanson Lasater
            </cite>
          </div>
        </motion.div>
      </div>

      {/* Health & Safety Information - Enhanced */}
      <motion.div
        className='px-4'
        initial='hidden'
        animate='visible'
        variants={fadeInUp}
      >
        <div className='bg-amber-50 border border-amber-200 rounded-3xl p-8'>
          <div className='flex items-start'>
            <Shield className='w-8 h-8 text-amber-600 mr-4 flex-shrink-0 mt-1' />
            <div className='flex-1'>
              <h3 className='font-bold text-amber-800 mb-6 text-2xl'>
                {t('services.standard.yoga.healthSafety.title')}
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-8 text-amber-700'>
                <div>
                  <h4 className='font-semibold mb-3 text-lg'>
                    {t(
                      'services.standard.yoga.healthSafety.beforeSession.title'
                    )}
                  </h4>
                  <ul className='space-y-2'>
                    <li>
                      {t(
                        'services.standard.yoga.healthSafety.beforeSession.items.inform'
                      )}
                    </li>
                    <li>
                      {t(
                        'services.standard.yoga.healthSafety.beforeSession.items.meals'
                      )}
                    </li>
                    <li>
                      {t(
                        'services.standard.yoga.healthSafety.beforeSession.items.hydration'
                      )}
                    </li>
                    <li>
                      {t(
                        'services.standard.yoga.healthSafety.beforeSession.items.clothing'
                      )}
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className='font-semibold mb-3 text-lg'>
                    {t(
                      'services.standard.yoga.healthSafety.duringPractice.title'
                    )}
                  </h4>
                  <ul className='space-y-2'>
                    <li>
                      {t(
                        'services.standard.yoga.healthSafety.duringPractice.items.listen'
                      )}
                    </li>
                    <li>
                      {t(
                        'services.standard.yoga.healthSafety.duringPractice.items.breathe'
                      )}
                    </li>
                    <li>
                      {t(
                        'services.standard.yoga.healthSafety.duringPractice.items.communicate'
                      )}
                    </li>
                    <li>
                      {' '}
                      {t(
                        'services.standard.yoga.healthSafety.duringPractice.items.focus'
                      )}
                    </li>
                  </ul>
                </div>
              </div>

              <div className='bg-amber-100 rounded-2xl p-6 mt-6'>
                <h4 className='font-bold text-amber-800 mb-3'>
                  {t('services.standard.yoga.healthSafety.disclaimer.title')}
                </h4>
                <p className='text-amber-700'>
                  <strong>
                    {' '}
                    {t(
                      'services.standard.yoga.healthSafety.disclaimer.strongtext'
                    )}
                  </strong>{' '}
                  {t('services.standard.yoga.healthSafety.disclaimer.mainText')}
                </p>
                <p className='text-amber-700 mt-3 italic'>
                  <strong>
                    {' '}
                    {t(
                      'services.standard.yoga.healthSafety.disclaimer.secondaryText'
                    )}
                  </strong>
                  <br />
                  {t(
                    'services.standard.yoga.healthSafety.disclaimer.closingText'
                  )}
                </p>
              </div>
            </div>
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

export default YogaServiceView;
