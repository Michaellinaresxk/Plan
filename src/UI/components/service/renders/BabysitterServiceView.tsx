import React from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { Service } from '@/types/type';
import { ServiceData } from '@/types/services';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Clock,
  Calendar,
  Users,
  Shield,
  Heart,
  Check,
  Info,
  Sparkles,
  Star,
  ArrowRight,
  PlayCircle,
  BookOpen,
  Baby,
  SmilePlus,
  Activity,
  MessageCircle,
  Instagram,
} from 'lucide-react';

interface BabysitterServiceViewProps {
  service: Service;
  serviceData?: ServiceData;
  primaryColor: string;
  viewContext?: 'standard-view' | 'premium-view';
}

const BabysitterServiceView: React.FC<BabysitterServiceViewProps> = ({
  service,
  serviceData,
  primaryColor,
  viewContext,
}) => {
  const { t } = useTranslation();
  const isPremium =
    service.packageType.includes('premium') || viewContext === 'premium-view';

  // Extract data from serviceData
  const minimumBooking =
    serviceData?.metaData?.minimumBooking?.toString() || '3 hours';
  const availability =
    serviceData?.metaData?.availability?.toString() ||
    'Day & evening; overnight upon request';
  const ageRange =
    serviceData?.metaData?.ageRange?.toString() || '6 months to 12 years';
  const safetyStandards = serviceData?.metaData?.safetyStandards
    ? (serviceData.metaData.safetyStandards as string).split(',')
    : ['CPR-trained', 'First-aid certified', 'Background-checked'];

  // Extract time slots from options
  const timeSlots = serviceData?.options?.timeSlot?.subOptions
    ? Object.values(serviceData.options.timeSlot.subOptions).map((opt: any) =>
        t(opt.nameKey)
      )
    : ['Daytime', 'Evening', 'Overnight'];

  // Get childCount options if available
  const childCountOptions = serviceData?.options?.childCount?.subOptions || {};

  // Extract includes and not included
  const includes = serviceData?.includes?.map((key: string) => t(key)) || [
    'Certified, Background-Checked Caregiver',
    'Age-Appropriate Activities & Games',
    'Snacks & Light Meals (as needed)',
    'Quiet Time Stories & Nap Support',
  ];

  const notIncluded = serviceData?.notIncluded?.map((key: string) =>
    t(key)
  ) || ['Gratuity (optional, appreciated)'];

  // Extract itinerary
  const itinerary = serviceData?.itinerary?.map((key: string) => t(key)) || [
    'Babysitter arrives & greets family',
    "Review children's routines & any special needs",
    'Engaging play, meals, and nap support',
    'Parent check-in and smooth handover',
  ];

  // Disclaimer if available
  const disclaimer = serviceData?.disclaimer ? t(serviceData.disclaimer) : '';

  // Sample activities by age group
  const activities = [
    {
      ageGroup: 'Infants (6-18 months)',
      activities: [
        'Sensory play with textures and sounds',
        'Gentle movement and stretching',
        'Interactive reading with colorful board books',
        'Soothing music and lullabies',
      ],
      icon: <Baby />,
    },
    {
      ageGroup: 'Toddlers (1.5-3 years)',
      activities: [
        'Simple arts and crafts with safe materials',
        'Music and movement games',
        'Outdoor exploration (weather permitting)',
        'Imaginative play with puppets and toys',
      ],
      icon: <SmilePlus />,
    },
    {
      ageGroup: 'Preschoolers (3-5 years)',
      activities: [
        'Storytelling and puppet shows',
        'Guided creative play',
        'Simple cooking activities',
        'Educational games and puzzles',
      ],
      icon: <PlayCircle />,
    },
    {
      ageGroup: 'School-Age (6-12 years)',
      activities: [
        'Arts, crafts, and DIY projects',
        'Board games and age-appropriate card games',
        'Physical activities and outdoor games',
        'Assistance with homework (if needed)',
      ],
      icon: <BookOpen />,
    },
  ];

  // Testimonials
  const testimonials = [
    {
      text: 'Our children absolutely adored their babysitter! She was punctual, professional, and had an amazing rapport with the kids. We could enjoy our evening knowing they were in safe, caring hands.',
      author: 'Sarah M.',
      rating: 5,
    },
    {
      text: 'The level of professionalism was outstanding. Our babysitter came prepared with age-appropriate activities that kept our children engaged throughout the evening.',
      author: 'David L.',
      rating: 5,
    },
    {
      text: 'This is the only babysitting service I trust with my little ones. The screening process for caregivers is thorough, and the sitter assigned to us was exceptional.',
      author: 'Michelle K.',
      rating: 5,
    },
  ];

  // Sample FAQ
  const faq = [
    {
      question: 'How are your babysitters screened?',
      answer:
        'All our babysitters undergo a rigorous screening process including background checks, reference verification, interviews, CPR and first aid certification, and regular performance reviews.',
    },
    {
      question: 'Can I meet the babysitter before booking?',
      answer:
        'Absolutely! We encourage a meet-and-greet before your scheduled service. This can be arranged in-person or via video call.',
    },
    {
      question: 'What happens if my child gets sick?',
      answer:
        'Our babysitters are trained to handle minor health concerns. For emergencies, they will contact you immediately and follow predetermined emergency protocols.',
    },
    {
      question: 'What if I need to extend the babysitting time?',
      answer:
        'Extensions are possible subject to the babysitter is availability. Please notify us as soon as possible, and we will confirm with your assigned sitter.',
    },
  ];

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
                  Professional Childcare
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
            {isPremium
              ? 'Exceptional childcare that lets parents enjoy their vacation while children thrive'
              : 'Trusted, certified caregivers to keep your children safe, happy, and engaged'}
          </h2>

          <div className='flex flex-wrap items-center gap-6 text-sm'>
            <div className='flex items-center'>
              <Shield className='h-5 w-5 mr-2 opacity-80' />
              <span>Certified & Background-Checked</span>
            </div>
            <div className='flex items-center'>
              <Users className='h-5 w-5 mr-2 opacity-80' />
              <span>Age-Appropriate Activities</span>
            </div>
            <div className='flex items-center'>
              <Calendar className='h-5 w-5 mr-2 opacity-80' />
              <span>Flexible Scheduling</span>
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
          >
            <p className='text-white text-sm md:text-base'>
              {isPremium
                ? 'Elite childcare professionals with advanced training in child development'
                : 'Professional caregivers focused on providing engaging, safe experiences'}
            </p>
          </div>
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
                  {t('services.booking.minimum')}
                </p>
                <p className='text-gray-600'>{minimumBooking}</p>
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
                  {t('services.booking.availability')}
                </p>
                <p className='text-gray-600'>{availability}</p>
              </div>
            </div>

            <div className='flex items-start'>
              <div
                className={`h-8 w-8 rounded-full ${
                  isPremium ? 'bg-amber-100' : 'bg-blue-100'
                } flex items-center justify-center mr-3 flex-shrink-0 mt-1`}
              >
                <Users
                  className={`h-4 w-4 ${
                    isPremium ? 'text-amber-600' : 'text-blue-600'
                  }`}
                />
              </div>
              <div>
                <p className='font-medium text-gray-700'>
                  {t('services.babysitter.ageRange')}
                </p>
                <p className='text-gray-600'>{ageRange}</p>
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
                  {t('services.babysitter.safetyStandards')}
                </p>
                <p className='text-gray-600'>{safetyStandards?.join(' • ')}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Service Options */}
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
            <Heart className='mr-3' size={24} />
            {t('services.common.options')}
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Time Slots */}
            <div>
              <h3 className='text-lg font-semibold text-gray-800 mb-4'>
                Scheduling Options
              </h3>
              <div className='grid grid-cols-1 gap-3'>
                {timeSlots?.map((option, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg ${
                      isPremium ? 'bg-amber-50' : 'bg-blue-50'
                    } hover:shadow-md transition-shadow`}
                  >
                    <div className='flex items-center'>
                      <div
                        className={`h-8 w-8 rounded-full ${
                          isPremium
                            ? 'bg-amber-100 text-amber-600'
                            : 'bg-blue-100 text-blue-600'
                        } flex items-center justify-center mr-3`}
                      >
                        {index === 0 ? (
                          <Clock className='h-4 w-4' />
                        ) : index === 1 ? (
                          <Calendar className='h-4 w-4' />
                        ) : (
                          <Shield className='h-4 w-4' />
                        )}
                      </div>
                      <div>
                        <p className='font-medium text-gray-800'>
                          {option} Care
                        </p>
                        <p className='text-sm text-gray-600'>
                          {index === 0
                            ? '8am - 6pm flexible scheduling'
                            : index === 1
                            ? '6pm - 11pm for your evening events'
                            : 'Full night coverage for complete peace of mind'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Child Count Options */}
            <div>
              <h3 className='text-lg font-semibold text-gray-800 mb-4'>
                Child Care Options
              </h3>
              <div className='grid grid-cols-1 gap-3'>
                {Object.keys(childCountOptions).length > 0
                  ? Object.entries(childCountOptions).map(
                      ([key, option]: [string, any], index) => (
                        <div
                          key={key}
                          className={`p-4 rounded-lg ${
                            isPremium ? 'bg-amber-50' : 'bg-blue-50'
                          } hover:shadow-md transition-shadow`}
                        >
                          <div className='flex justify-between'>
                            <div className='flex items-center'>
                              <div
                                className={`h-8 w-8 rounded-full ${
                                  isPremium
                                    ? 'bg-amber-100 text-amber-600'
                                    : 'bg-blue-100 text-blue-600'
                                } flex items-center justify-center mr-3`}
                              >
                                <Users className='h-4 w-4' />
                              </div>
                              <div>
                                <p className='font-medium text-gray-800'>
                                  {t(option.nameKey, {
                                    fallback: formatOptionName(key),
                                  })}
                                </p>
                                {index === 0 ? (
                                  <p className='text-sm text-gray-600'>
                                    Individual attention for your child
                                  </p>
                                ) : index === 1 ? (
                                  <p className='text-sm text-gray-600'>
                                    Perfect for siblings
                                  </p>
                                ) : (
                                  <p className='text-sm text-gray-600'>
                                    For multiple children or playdates
                                  </p>
                                )}
                              </div>
                            </div>
                            {option.price !== 0 && (
                              <div
                                className={`font-medium ${
                                  option.price > 0
                                    ? 'text-amber-600'
                                    : 'text-green-600'
                                }`}
                              >
                                {option.price > 0
                                  ? `+$${option.price}`
                                  : `-$${Math.abs(option.price)}`}
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    )
                  : // Default options if none provided in data
                    ['one', 'two', 'threePlus'].map((option, index) => (
                      <div
                        key={option}
                        className={`p-4 rounded-lg ${
                          isPremium ? 'bg-amber-50' : 'bg-blue-50'
                        } hover:shadow-md transition-shadow`}
                      >
                        <div className='flex justify-between'>
                          <div className='flex items-center'>
                            <div
                              className={`h-8 w-8 rounded-full ${
                                isPremium
                                  ? 'bg-amber-100 text-amber-600'
                                  : 'bg-blue-100 text-blue-600'
                              } flex items-center justify-center mr-3`}
                            >
                              <Users className='h-4 w-4' />
                            </div>
                            <div>
                              <p className='font-medium text-gray-800'>
                                {option === 'one'
                                  ? 'One Child'
                                  : option === 'two'
                                  ? 'Two Children'
                                  : 'Three or More Children'}
                              </p>
                              {index === 0 ? (
                                <p className='text-sm text-gray-600'>
                                  Individual attention for your child
                                </p>
                              ) : index === 1 ? (
                                <p className='text-sm text-gray-600'>
                                  Perfect for siblings
                                </p>
                              ) : (
                                <p className='text-sm text-gray-600'>
                                  For multiple children or playdates
                                </p>
                              )}
                            </div>
                          </div>
                          <div
                            className={`font-medium ${
                              index > 0 ? 'text-amber-600' : 'text-gray-600'
                            }`}
                          >
                            {index === 0
                              ? 'Base Rate'
                              : index === 1
                              ? '+$10'
                              : '+$25'}
                          </div>
                        </div>
                      </div>
                    ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Age-Appropriate Activities */}
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
            <Activity className='mr-3' size={24} />
            Age-Appropriate Activities
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {activities.map((ageGroup, index) => (
              <div
                key={index}
                className={`p-6 rounded-xl ${
                  isPremium
                    ? 'bg-gradient-to-br from-amber-50 to-amber-100/50'
                    : 'bg-gradient-to-br from-blue-50 to-blue-100/50'
                }`}
              >
                <div className='flex items-center mb-4'>
                  <div
                    className={`h-10 w-10 rounded-full ${
                      isPremium
                        ? 'bg-amber-100 text-amber-600'
                        : 'bg-blue-100 text-blue-600'
                    } flex items-center justify-center mr-3`}
                  >
                    {ageGroup.icon}
                  </div>
                  <h3 className='text-lg font-semibold text-gray-800'>
                    {ageGroup.ageGroup}
                  </h3>
                </div>

                <ul className='space-y-2'>
                  {ageGroup.activities.map((activity, idx) => (
                    <li key={idx} className='flex items-start'>
                      <Check
                        className={`h-5 w-5 ${
                          isPremium ? 'text-amber-500' : 'text-blue-500'
                        } mr-2 mt-0.5 flex-shrink-0`}
                      />
                      <span className='text-gray-700'>{activity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
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
            What Parents Say
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {testimonials.map((testimonial, index) => (
              <div key={index} className='bg-white p-6 rounded-xl shadow-sm'>
                <div className='flex mb-4'>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={`${
                        isPremium
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-blue-400 fill-blue-400'
                      } mr-1`}
                    />
                  ))}
                </div>
                <p className='italic text-gray-700 mb-4'>
                  "{testimonial.text}"
                </p>
                <p className='text-sm font-medium text-gray-900'>
                  {testimonial.author}
                </p>
              </div>
            ))}
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
            Frequently Asked Questions
          </h2>

          <div className='space-y-4'>
            {faq.map((item, index) => (
              <div
                key={index}
                className={`p-6 rounded-xl border ${
                  isPremium ? 'border-amber-200' : 'border-blue-200'
                }`}
              >
                <h3
                  className={`text-lg font-medium mb-2 ${
                    isPremium ? 'text-amber-800' : 'text-blue-800'
                  }`}
                >
                  {item.question}
                </h3>
                <p className='text-gray-700'>{item.answer}</p>
              </div>
            ))}
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
            Ready to Enjoy Your Time While Your Children are in Great Hands?
          </h2>
          <p className='text-xl opacity-90 mb-8 max-w-2xl mx-auto'>
            {isPremium
              ? 'Book our premium babysitting service and give your children an enriching experience while you enjoy your time away'
              : 'Schedule professional, reliable childcare and treat yourself to worry-free time away'}
          </p>
          <button
            className={`py-3 px-8 rounded-full bg-white flex items-center mx-auto font-medium ${
              isPremium ? 'text-amber-700' : 'text-blue-700'
            }`}
          >
            Book Now
            <ArrowRight className='ml-2 h-5 w-5' />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// Helper function to format option names
const formatOptionName = (name: string): string => {
  return (
    name.charAt(0).toUpperCase() +
    name
      .slice(1)
      .replace(/-|([A-Z])/g, ' $1')
      .trim()
  );
};

export default BabysitterServiceView;
