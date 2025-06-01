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
  Dumbbell,
  MapPin,
  Zap,
  Clock,
  Star,
  ArrowRight,
  Target,
  Award,
  Heart,
  CheckCircle,
  Play,
} from 'lucide-react';

interface PersonalTrainerServiceViewProps {
  service: Service;
  serviceData?: ServiceData;
  primaryColor: string;
  viewContext?: 'standard-view' | 'premium-view';
}

const PersonalTrainerServiceView: React.FC<PersonalTrainerServiceViewProps> = ({
  service,
  serviceData,
  viewContext,
}) => {
  const { t } = useTranslation();
  const { bookService } = useBooking();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrainingType, setSelectedTrainingType] = useState('');

  const isPremium =
    service.packageType.includes('premium') || viewContext === 'premium-view';
  const sessionDuration = serviceData?.metaData?.sessionDuration || 60;

  // Training types with visual icons
  const trainingTypes = [
    {
      id: 'strength',
      name: 'Strength Training',
      icon: '💪',
      color: 'from-red-500 to-orange-500',
      description: 'Build muscle and power',
    },
    {
      id: 'hiit',
      name: 'HIIT Training',
      icon: '⚡',
      color: 'from-yellow-500 to-red-500',
      description: 'High-intensity fat burning',
    },
    {
      id: 'functional',
      name: 'Functional Fitness',
      icon: '🤸‍♀️',
      color: 'from-green-500 to-teal-500',
      description: 'Real-world movement patterns',
    },
    {
      id: 'flexibility',
      name: 'Flexibility & Mobility',
      icon: '🧘‍♀️',
      color: 'from-blue-500 to-purple-500',
      description: 'Improve range of motion',
    },
  ];

  // Key benefits
  const benefits = [
    {
      icon: Target,
      title: 'Personalized Plan',
      description: 'Customized workout designed for your goals',
    },
    {
      icon: Award,
      title: 'Certified Trainers',
      description: 'International certifications and expertise',
    },
    {
      icon: Heart,
      title: 'All Fitness Levels',
      description: 'From beginner to advanced athletes',
    },
    {
      icon: MapPin,
      title: 'Your Location',
      description: 'Villa, beach, or resort gym',
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
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100'>
      <div className='max-w-6xl mx-auto space-y-16 pb-16'>
        {/* Hero Section */}
        <motion.div
          className='relative overflow-hidden rounded-3xl mx-4 mt-8'
          initial='hidden'
          animate='visible'
          variants={fadeIn}
        >
          <div className='relative h-[70vh] bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900'>
            <Image
              src='https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=1200'
              alt='Personal training session'
              fill
              className='object-cover mix-blend-overlay opacity-60'
              priority
            />

            {/* Content */}
            <div className='relative z-10 h-full flex items-center justify-center text-center px-8'>
              <div className='max-w-4xl'>
                <motion.div
                  className='inline-flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 mb-6'
                  variants={slideIn}
                >
                  <Dumbbell className='w-5 h-5 text-white mr-2' />
                  <span className='text-white font-medium'>
                    Your Strength. Your Progress.
                  </span>
                </motion.div>

                <motion.h1
                  className='text-5xl md:text-7xl font-bold text-white mb-6 leading-tight'
                  variants={fadeIn}
                >
                  Personal Training
                </motion.h1>

                <motion.p
                  className='text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto'
                  variants={fadeIn}
                >
                  Transform your fitness with one-on-one sessions tailored to
                  your goals, anywhere you want to train.
                </motion.p>

                {/* Quick Stats */}
                <motion.div
                  className='flex flex-wrap justify-center gap-8 mb-10'
                  variants={slideIn}
                >
                  <div className='flex items-center bg-white/10 backdrop-blur-sm px-4 py-3 rounded-xl'>
                    <Clock className='w-5 h-5 text-white mr-2' />
                    <span className='text-white font-medium'>
                      {sessionDuration} Minutes
                    </span>
                  </div>
                  <div className='flex items-center bg-white/10 backdrop-blur-sm px-4 py-3 rounded-xl'>
                    <Star
                      className='w-5 h-5 text-yellow-400 mr-2'
                      fill='currentColor'
                    />
                    <span className='text-white font-medium'>5.0 Rating</span>
                  </div>
                  <div className='flex items-center bg-white/10 backdrop-blur-sm px-4 py-3 rounded-xl'>
                    <MapPin className='w-5 h-5 text-white mr-2' />
                    <span className='text-white font-medium'>Any Location</span>
                  </div>
                </motion.div>

                <motion.button
                  onClick={() => setIsModalOpen(true)}
                  className='bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white px-10 py-4 rounded-2xl font-bold text-lg flex items-center gap-3 mx-auto transition-all duration-300 hover:scale-105 shadow-2xl'
                  variants={slideIn}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className='w-6 h-6' fill='currentColor' />
                  Start Your Transformation
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Benefits Section */}
        <motion.div
          className='px-4'
          initial='hidden'
          animate='visible'
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
          }}
        >
          <div className='text-center mb-12'>
            <h2 className='text-4xl font-bold text-gray-800 mb-4'>
              Why Choose Personal Training?
            </h2>
            <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
              Get the results you want with expert guidance and personalized
              attention
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className='group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2'
                variants={fadeIn}
              >
                <div className='w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300'>
                  <benefit.icon className='w-8 h-8 text-white' />
                </div>
                <h3 className='text-xl font-bold text-gray-800 mb-3'>
                  {benefit.title}
                </h3>
                <p className='text-gray-600'>{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* What's Included */}
        <motion.div
          className='px-4'
          initial='hidden'
          animate='visible'
          variants={fadeIn}
        >
          <div className='bg-white rounded-3xl shadow-2xl overflow-hidden'>
            <div className='bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white text-center'>
              <h2 className='text-3xl font-bold mb-4'>
                Everything You Need Included
              </h2>
              <p className='text-xl opacity-90'>
                Professional service from start to finish
              </p>
            </div>

            <div className='p-8'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                <div className='space-y-6'>
                  {[
                    'Certified Personal Trainer',
                    'Customized Workout Plan',
                    'All Necessary Equipment',
                    'Post-Workout Recovery Tips',
                  ].map((item, index) => (
                    <div key={index} className='flex items-center'>
                      <div className='w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4'>
                        <CheckCircle className='w-5 h-5 text-green-600' />
                      </div>
                      <span className='text-lg text-gray-700 font-medium'>
                        {item}
                      </span>
                    </div>
                  ))}
                </div>

                <div className='relative h-64 rounded-2xl overflow-hidden'>
                  <Image
                    src='https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=600'
                    alt='Professional training equipment'
                    fill
                    className='object-cover'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end'>
                    <p className='text-white p-6 font-medium'>
                      Professional equipment sanitized for each session
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Training Types */}
        <motion.div
          className='px-4'
          initial='hidden'
          animate='visible'
          variants={fadeIn}
        >
          <div className='text-center mb-12'>
            <h2 className='text-4xl font-bold text-gray-800 mb-4'>
              Choose Your Training Style
            </h2>
            <p className='text-xl text-gray-600'>
              Select the workout type that matches your fitness goals
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {trainingTypes.map((type, index) => (
              <motion.div
                key={type.id}
                className={`relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-500 hover:scale-105 ${
                  selectedTrainingType === type.id
                    ? 'ring-4 ring-indigo-500 shadow-2xl'
                    : 'shadow-lg'
                }`}
                onClick={() => setSelectedTrainingType(type.id)}
                variants={slideIn}
                whileHover={{ y: -5 }}
              >
                <div
                  className={`h-48 bg-gradient-to-br ${type.color} p-6 text-white relative overflow-hidden`}
                >
                  {/* Background Pattern */}
                  <div className='absolute inset-0 opacity-10'>
                    <div className='absolute top-4 right-4 text-6xl'>
                      {type.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <div className='relative z-10 h-full flex flex-col justify-between'>
                    <div className='text-4xl mb-2'>{type.icon}</div>
                    <div>
                      <h3 className='text-lg font-bold mb-2'>{type.name}</h3>
                      <p className='text-sm opacity-90'>{type.description}</p>
                    </div>
                  </div>

                  {/* Hover Effect */}
                  <div className='absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-300' />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className='px-4'
          initial='hidden'
          animate='visible'
          variants={fadeIn}
        >
          <div className='relative overflow-hidden rounded-3xl'>
            <div className='bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 p-12 text-center'>
              <div className='max-w-3xl mx-auto'>
                <h2 className='text-4xl md:text-5xl font-bold text-white mb-6'>
                  Ready to Start Your Fitness Journey?
                </h2>
                <p className='text-xl text-white/90 mb-8'>
                  Book your personalized training session today and take the
                  first step towards achieving your fitness goals with expert
                  guidance.
                </p>

                <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
                  <div className='text-center'>
                    <div className='text-4xl font-bold text-white'>
                      ${service.price}
                    </div>
                    <div className='text-white/70'>per session</div>
                  </div>

                  <button
                    onClick={() => setIsModalOpen(true)}
                    className='bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white px-10 py-4 rounded-2xl font-bold text-lg flex items-center gap-3 transition-all duration-300 hover:scale-105 shadow-2xl'
                  >
                    Book Your Session
                    <ArrowRight className='w-6 h-6' />
                  </button>
                </div>
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
          <div className='bg-gradient-to-r from-blue-50 to-indigo-100 rounded-3xl p-8 text-center'>
            <div className='flex justify-center mb-4'>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className='w-6 h-6 text-yellow-400 fill-current'
                />
              ))}
            </div>
            <blockquote className='text-2xl font-medium text-gray-800 mb-4 italic'>
              "Best investment in my health! The trainer was amazing and I felt
              stronger after just one session."
            </blockquote>
            <cite className='text-lg text-gray-600 font-medium'>
              - Sarah M., Satisfied Client
            </cite>
          </div>
        </motion.div>

        {/* Important Notice */}
        <motion.div
          className='px-4'
          initial='hidden'
          animate='visible'
          variants={fadeIn}
        >
          <div className='bg-amber-50 border border-amber-200 rounded-2xl p-6'>
            <div className='flex items-start'>
              <Zap className='w-6 h-6 text-amber-600 mr-3 flex-shrink-0 mt-1' />
              <div>
                <h3 className='font-bold text-amber-800 mb-2'>
                  Health & Safety First
                </h3>
                <p className='text-amber-700'>
                  Please consult your physician before beginning any new fitness
                  program. Our certified trainers will adapt sessions to your
                  fitness level and any physical limitations.
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

export default PersonalTrainerServiceView;
