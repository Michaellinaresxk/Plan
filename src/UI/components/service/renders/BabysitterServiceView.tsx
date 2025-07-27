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

// Constants
const GALLERY_IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&q=80&w=400',
    alt: 'Art & crafts time',
    caption: 'Creative arts & crafts sessions',
  },
  {
    src: 'https://images.unsplash.com/photo-1597413545419-4013d5fade59?auto=format&fit=crop&q=80&w=400',
    alt: 'Outdoor exploration',
    caption: 'Safe outdoor adventures',
  },
  {
    src: 'https://images.unsplash.com/photo-1596464716066-8ee1cc47bb8e?auto=format&fit=crop&q=80&w=400',
    alt: 'Storytime favorites',
    caption: 'Interactive reading sessions',
  },
  {
    src: 'https://images.unsplash.com/photo-1607453998774-d533f65dac99?auto=format&fit=crop&q=80&w=400',
    alt: 'Learning through play',
    caption: 'Educational play activities',
  },
  {
    src: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&q=80&w=400',
    alt: 'Music time',
    caption: 'Musical exploration',
  },
  {
    src: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=400',
    alt: 'Snack time',
    caption: 'Healthy snack preparation',
  },
];

const ACTIVITIES = [
  {
    icon: <Palette className='w-6 h-6' />,
    title: 'Creative Arts',
    description: 'Drawing, painting, and craft projects that spark imagination',
    color: 'bg-pink-50 text-pink-600',
  },
  {
    icon: <BookOpen className='w-6 h-6' />,
    title: 'Story Time',
    description: 'Interactive reading sessions with age-appropriate books',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: <Music className='w-6 h-6' />,
    title: 'Music & Dance',
    description: 'Fun musical activities and movement games',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    icon: <Gamepad2 className='w-6 h-6' />,
    title: 'Educational Games',
    description: 'Learning through play with puzzles and brain games',
    color: 'bg-green-50 text-green-600',
  },
  {
    icon: <Activity className='w-6 h-6' />,
    title: 'Physical Activities',
    description: 'Safe outdoor play and indoor movement activities',
    color: 'bg-orange-50 text-orange-600',
  },
  {
    icon: <Baby className='w-6 h-6' />,
    title: 'Age-Appropriate Care',
    description:
      "Customized activities based on each child's developmental stage",
    color: 'bg-yellow-50 text-yellow-600',
  },
];

const TESTIMONIALS = [
  {
    id: 1,
    quote:
      'Maria was absolutely wonderful with our twins. They were engaged and happy the entire evening!',
    author: 'Sarah M.',
    rating: 5,
    children: 'Twins, age 4',
  },
  {
    id: 2,
    quote:
      'Professional, caring, and the kids loved her. We felt completely at ease during our date night.',
    author: 'David L.',
    rating: 5,
    children: '2 children, ages 6 & 8',
  },
  {
    id: 3,
    quote:
      'Our babysitter came prepared with activities and even helped with bedtime routine. Highly recommend!',
    author: 'Jessica R.',
    rating: 5,
    children: '1 child, age 3',
  },
];

const FAQS = [
  {
    question: 'What ages do you provide babysitting services for?',
    answer:
      'We provide professional childcare for children from 6 months to 12 years old. Our sitters are trained to handle different age groups and developmental stages.',
  },
  {
    question: 'Are your babysitters background checked?',
    answer:
      "Yes, all our babysitters undergo thorough background checks, reference verification, and childcare training. Your children's safety is our top priority.",
  },
  {
    question: 'What if my child has special dietary requirements or allergies?',
    answer:
      'We carefully review all dietary restrictions and allergies before the service. Our sitters are trained to handle special dietary needs and can prepare appropriate snacks and meals.',
  },
  {
    question: 'How far in advance should I book?',
    answer:
      "We recommend booking at least 24-48 hours in advance to ensure availability. For last-minute requests, please call us directly and we'll do our best to accommodate.",
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
        <div className='absolute top-0 right-0 w-1/3 h-full opacity-10'>
          <Image
            src='https://images.unsplash.com/photo-1560877241-1dc5479934b6?auto=format&fit=crop&q=80&w=800'
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
                  Premium Experience
                </span>
              </div>
            ) : (
              <div className='inline-flex items-center bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-full border border-blue-200'>
                <Heart className='w-5 h-5 text-blue-600 mr-2' />
                <span className='text-sm font-semibold text-blue-700 uppercase tracking-wider'>
                  Trusted Childcare
                </span>
              </div>
            )}
          </div>

          <h1 className='text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight'>
            {isPremium ? (
              <>
                Premium <span className='text-amber-600'>In-Villa</span>
                <br />
                Childcare Services
              </>
            ) : (
              <>
                Professional <span className='text-blue-600'>Babysitting</span>
                <br />
                You Can Trust
              </>
            )}
          </h1>

          <p className='text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl leading-relaxed'>
            Experienced, background-checked caregivers who create magical
            moments while keeping your children safe, happy, and engaged.
          </p>

          <div className='flex flex-wrap gap-6 mb-8'>
            <div className='flex items-center bg-white/70 backdrop-blur-sm px-4 py-3 rounded-xl'>
              <Shield className='w-5 h-5 text-green-600 mr-2' />
              <span className='font-medium text-gray-700'>
                Background Checked
              </span>
            </div>
            <div className='flex items-center bg-white/70 backdrop-blur-sm px-4 py-3 rounded-xl'>
              <Users className='w-5 h-5 text-blue-600 mr-2' />
              <span className='font-medium text-gray-700'>Ages 6M - 12Y</span>
            </div>
            <div className='flex items-center bg-white/70 backdrop-blur-sm px-4 py-3 rounded-xl'>
              <Clock className='w-5 h-5 text-purple-600 mr-2' />
              <span className='font-medium text-gray-700'>24/7 Available</span>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className='bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-xl font-semibold text-lg flex items-center gap-3 transition-colors group'
          >
            Book Trusted Care
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
        <div className='text-center mb-12'>
          <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>
            Age-Appropriate Activities
          </h2>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
            Our caregivers come prepared with engaging activities tailored to
            your child's age and interests
          </p>
        </div>

        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {ACTIVITIES.map((activity, index) => (
            <motion.div
              key={index}
              className='group bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-300'
              variants={fadeInUp}
              whileHover={{ y: -4 }}
            >
              <div
                className={`w-12 h-12 rounded-xl ${activity.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
              >
                {activity.icon}
              </div>
              <h3 className='text-xl font-bold text-gray-900 mb-3'>
                {activity.title}
              </h3>
              <p className='text-gray-600 leading-relaxed'>
                {activity.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Interactive Gallery */}
      <motion.div
        className='bg-gray-50 rounded-3xl p-8 md:p-12'
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <h2 className='text-3xl font-bold text-gray-900 mb-8 flex items-center'>
          <Camera className='mr-4 w-8 h-8 text-gray-600' />
          Moments of Joy
        </h2>

        <div className='grid md:grid-cols-2 gap-8'>
          {/* Main Selected Image */}
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
                  {GALLERY_IMAGES[selectedImageIndex].caption}
                </p>
              </div>
            </div>
          </div>

          {/* Thumbnail Grid */}
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
        className='grid md:grid-cols-2 gap-12 items-center'
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div>
          <h2 className='text-3xl font-bold text-gray-900 mb-6'>
            Safety & Trust First
          </h2>
          <div className='space-y-6'>
            <div className='flex items-start'>
              <div className='w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center mr-4 flex-shrink-0'>
                <Shield className='w-5 h-5 text-green-600' />
              </div>
              <div>
                <h3 className='font-semibold text-gray-900 mb-2'>
                  Background Verified
                </h3>
                <p className='text-gray-600'>
                  All caregivers undergo thorough background checks and
                  reference verification
                </p>
              </div>
            </div>

            <div className='flex items-start'>
              <div className='w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center mr-4 flex-shrink-0'>
                <Trophy className='w-5 h-5 text-blue-600' />
              </div>
              <div>
                <h3 className='font-semibold text-gray-900 mb-2'>
                  Certified Training
                </h3>
                <p className='text-gray-600'>
                  CPR certified with specialized training in child development
                  and safety
                </p>
              </div>
            </div>

            <div className='flex items-start'>
              <div className='w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center mr-4 flex-shrink-0'>
                <Heart className='w-5 h-5 text-purple-600' />
              </div>
              <div>
                <h3 className='font-semibold text-gray-900 mb-2'>
                  Genuine Care
                </h3>
                <p className='text-gray-600'>
                  Selected for their natural ability to connect with and care
                  for children
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className='relative h-96 rounded-2xl overflow-hidden'>
          <Image
            src='https://images.unsplash.com/photo-1596463059283-da257325bab8?auto=format&fit=crop&q=80&w=600'
            alt='Caring babysitter with child'
            fill
            className='object-cover'
          />
        </div>
      </motion.div>

      {/* Testimonials */}
      <motion.div
        className='bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 md:p-12'
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className='text-center mb-12'>
          <h2 className='text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center'>
            <MessageCircle className='mr-3 w-8 h-8' />
            Happy Families
          </h2>
          <p className='text-xl text-gray-600'>
            See what parents are saying about our childcare services
          </p>
        </div>

        <div className='grid md:grid-cols-3 gap-8'>
          {TESTIMONIALS.map((testimonial) => (
            <div
              key={testimonial.id}
              className='bg-white rounded-2xl p-8 shadow-sm'
            >
              <div className='flex mb-4'>
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className='w-5 h-5 text-yellow-400 fill-current'
                  />
                ))}
              </div>
              <blockquote className='text-gray-700 text-lg italic mb-6 leading-relaxed'>
                "{testimonial.quote}"
              </blockquote>
              <div>
                <cite className='text-gray-900 font-semibold not-italic'>
                  {testimonial.author}
                </cite>
                <div className='text-gray-500 text-sm'>
                  {testimonial.children}
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
      >
        <div className='text-center mb-12'>
          <h2 className='text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center'>
            <Info className='mr-3 w-8 h-8' />
            Frequently Asked Questions
          </h2>
          <p className='text-xl text-gray-600'>
            Everything you need to know about our babysitting services
          </p>
        </div>

        <div className='grid md:grid-cols-2 gap-6'>
          {FAQS.map((faq, index) => (
            <div
              key={index}
              className='bg-white rounded-2xl p-8 shadow-sm border border-gray-100'
            >
              <h3 className='font-semibold text-gray-900 mb-4 text-lg'>
                {faq.question}
              </h3>
              <p className='text-gray-600 leading-relaxed'>{faq.answer}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Contact CTA */}
      <motion.div
        className='bg-gray-900 rounded-3xl p-8 md:p-12 text-white text-center'
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <h2 className='text-3xl md:text-4xl font-bold mb-4'>
          Ready for Peace of Mind?
        </h2>
        <p className='text-xl text-gray-300 mb-8 max-w-2xl mx-auto'>
          Book trusted, professional childcare for your next date night or
          special occasion
        </p>

        <div className='flex flex-col sm:flex-row gap-4 justify-center items-center mb-8'>
          <button
            onClick={() => setIsModalOpen(true)}
            className='bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold text-lg flex items-center gap-3 transition-colors'
          >
            Book Babysitting Service
            <ArrowRight className='w-5 h-5' />
          </button>

          <div className='flex gap-4'>
            <button className='w-12 h-12 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-colors'>
              <Phone className='w-6 h-6' />
            </button>
            <button className='w-12 h-12 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-colors'>
              <Mail className='w-6 h-6' />
            </button>
          </div>
        </div>

        <div className='flex flex-wrap justify-center gap-6 text-gray-400'>
          <div className='flex items-center gap-2'>
            <CheckCircle className='w-5 h-5 text-green-400' />
            <span>Instant booking</span>
          </div>
          <div className='flex items-center gap-2'>
            <CheckCircle className='w-5 h-5 text-green-400' />
            <span>24/7 support</span>
          </div>
          <div className='flex items-center gap-2'>
            <CheckCircle className='w-5 h-5 text-green-400' />
            <span>Satisfaction guaranteed</span>
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

export default BabysitterServiceView;
