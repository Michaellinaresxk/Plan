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
  Users,
  Shirt,
  Calendar,
  AlertTriangle,
  X,
  Gift,
} from 'lucide-react';

interface PersonalTrainerServiceViewProps {
  service: Service;
  serviceData?: ServiceData;
  primaryColor: string;
  viewContext?: 'standard-view' | 'premium-view';
}

// Constants for better maintainability
const TRAINING_TYPES = [
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
  {
    id: 'prenatal',
    name: 'Pre/Postnatal Fitness',
    icon: '🤱',
    color: 'from-pink-500 to-rose-500',
    description: 'Safe training for expecting mothers',
  },
  {
    id: 'cardio-kickboxing',
    name: 'Cardio Kickboxing',
    icon: '🥊',
    color: 'from-orange-500 to-red-600',
    description: 'High-energy combat workout',
  },
] as const;

const BENEFITS = [
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
] as const;

const WHATS_INCLUDED = [
  'Certified Personal Trainer',
  'Customized Workout Plan',
  'All Necessary Equipment',
  'Post-Workout Recovery Tips',
] as const;

const WHAT_TO_EXPECT_STEPS = [
  {
    step: 1,
    title: 'Trainer arrives & sets up equipment',
    description: 'Professional setup at your chosen location',
  },
  {
    step: 2,
    title: 'Warm-up and goal discussion',
    description: 'Assessment and personalized planning',
  },
  {
    step: 3,
    title: 'Personalized training session',
    description: 'Focused workout tailored to your needs',
  },
  {
    step: 4,
    title: 'Cool-down and recovery guidance',
    description: 'Proper stretching and recovery tips',
  },
] as const;

const GOOD_TO_KNOW_INFO = {
  whatToWear: 'Comfortable athletic attire & supportive shoes',
  agePolicy: 'Participants must be 16+ (under 16 with adult supervision)',
  adaptability:
    'Sessions can be modified for injuries, prenatal/postnatal needs, or mobility restrictions',
  startEndTime: 'According to your booking schedule',
  notIncluded: 'Gratuity (optional, appreciated)',
} as const;

// Animation variants
const ANIMATION_VARIANTS = {
  fadeIn: {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  },
  slideIn: {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
  },
  stagger: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  },
} as const;

const PersonalTrainerServiceView: React.FC<PersonalTrainerServiceViewProps> = ({
  service,
  serviceData,
}) => {
  const { t } = useTranslation();
  const { bookService } = useBooking();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrainingType, setSelectedTrainingType] = useState('');

  const sessionDuration = serviceData?.metaData?.sessionDuration || 60;

  const handleBookingConfirm = (
    service: Service,
    dates: BookingDate,
    guests: number
  ) => {
    bookService(service, dates, guests);
    setIsModalOpen(false);
  };

  const handleTrainingTypeSelect = (typeId: string) => {
    setSelectedTrainingType((prev) => (prev === typeId ? '' : typeId));
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100'>
      <div className='max-w-8xl mx-auto space-y-16 pb-16'>
        {/* Hero Section */}
        <HeroSection
          sessionDuration={sessionDuration}
          onBookClick={() => setIsModalOpen(true)}
        />

        {/* Benefits Section */}
        <BenefitsSection />

        {/* What's Included Section */}
        <WhatsIncludedSection />

        {/* Training Types Section */}
        <TrainingTypesSection
          selectedType={selectedTrainingType}
          onTypeSelect={handleTrainingTypeSelect}
        />

        {/* What to Expect Section */}
        <WhatToExpectSection />

        {/* Good to Know Section */}
        <GoodToKnowSection />

        {/* Call to Action */}
        <CallToActionSection
          service={service}
          onBookClick={() => setIsModalOpen(true)}
        />

        {/* Testimonial */}
        <TestimonialSection />

        {/* Health Disclaimer */}
        <HealthDisclaimerSection />
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

// Hero Section Component
const HeroSection: React.FC<{
  sessionDuration: number;
  onBookClick: () => void;
}> = ({ sessionDuration, onBookClick }) => (
  <motion.div
    className='relative overflow-hidden w-full my-6 sm:my-8 lg:my-12'
    initial='hidden'
    animate='visible'
    variants={ANIMATION_VARIANTS.fadeIn}
  >
    <div className='relative h-[70vh] sm:h-[75vh] lg:h-[80vh] bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900'>
      <img
        src='https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        alt='Personal training session'
        className='absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60'
      />

      {/* Overlay adicional para mejor contraste */}
      <div className='absolute inset-0 bg-black/20 z-[1]' />
      <div className='absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 z-[2]' />

      <div className='relative z-10 h-full flex items-center justify-center text-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16'>
        <div className='max-w-4xl w-full space-y-6 sm:space-y-8 lg:space-y-10'>
          <motion.div
            className='inline-flex items-center bg-white/10 backdrop-blur-sm px-3 py-1 sm:px-4 sm:py-2 rounded-full border border-white/20'
            variants={ANIMATION_VARIANTS.slideIn}
          >
            <Dumbbell className='w-4 h-4 sm:w-5 sm:h-5 text-white mr-2' />
            <span className='text-white font-medium text-sm sm:text-base'>
              Your Strength. Your Progress.
            </span>
          </motion.div>

          <motion.h1
            className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight'
            variants={ANIMATION_VARIANTS.fadeIn}
          >
            Personal Training
          </motion.h1>

          <motion.p
            className='text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-white/90 max-w-3xl mx-auto leading-relaxed px-2'
            variants={ANIMATION_VARIANTS.fadeIn}
          >
            Transform your fitness with one-on-one sessions tailored to your
            goals, anywhere you want to train.
          </motion.p>

          <motion.div
            className='flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-8 max-w-4xl mx-auto justify-center'
            variants={ANIMATION_VARIANTS.slideIn}
          >
            <div className='flex-1 sm:flex-none'>
              <StatChip icon={Clock} text={`${sessionDuration} Minutes`} />
            </div>
            <div className='flex-1 sm:flex-none'>
              <StatChip icon={Star} text='5.0 Rating' iconFill />
            </div>
            <div className='flex-1 sm:flex-none'>
              <StatChip icon={MapPin} text='Any Location' />
            </div>
          </motion.div>

          <div className='pt-4 sm:pt-6 lg:pt-8'>
            <motion.button
              onClick={onBookClick}
              className='bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white px-6 py-3 sm:px-8 sm:py-4 lg:px-10 lg:py-5 rounded-xl lg:rounded-2xl font-bold text-base sm:text-lg lg:text-xl flex items-center gap-2 sm:gap-3 mx-auto transition-all duration-300 hover:scale-105 shadow-2xl max-w-xs sm:max-w-none'
              variants={ANIMATION_VARIANTS.slideIn}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play className='w-5 h-5 sm:w-6 sm:h-6' fill='currentColor' />
              <span className='whitespace-nowrap'>
                Start Your Transformation
              </span>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

// Stat Chip Component
const StatChip: React.FC<{
  icon: React.ComponentType<any>;
  text: string;
  iconFill?: boolean;
}> = ({ icon: Icon, text, iconFill }) => (
  <div className='flex items-center bg-white/10 backdrop-blur-sm px-4 py-3 rounded-xl'>
    <Icon
      className={`w-5 h-5 ${iconFill ? 'text-yellow-400' : 'text-white'} mr-2`}
      fill={iconFill ? 'currentColor' : 'none'}
    />
    <span className='text-white font-medium'>{text}</span>
  </div>
);

// Benefits Section Component
const BenefitsSection: React.FC = () => (
  <motion.div
    className='px-4'
    initial='hidden'
    animate='visible'
    variants={ANIMATION_VARIANTS.stagger}
  >
    <div className='text-center mb-12'>
      <h2 className='text-4xl font-bold text-gray-800 mb-4'>
        Why Choose Personal Training?
      </h2>
      <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
        Get the results you want with expert guidance and personalized attention
      </p>
    </div>

    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
      {BENEFITS.map((benefit, index) => (
        <BenefitCard key={index} benefit={benefit} />
      ))}
    </div>
  </motion.div>
);

// Benefit Card Component
const BenefitCard: React.FC<{
  benefit: (typeof BENEFITS)[0];
}> = ({ benefit }) => (
  <motion.div
    className='group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2'
    variants={ANIMATION_VARIANTS.fadeIn}
  >
    <div className='w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300'>
      <benefit.icon className='w-8 h-8 text-white' />
    </div>
    <h3 className='text-xl font-bold text-gray-800 mb-3'>{benefit.title}</h3>
    <p className='text-gray-600'>{benefit.description}</p>
  </motion.div>
);

// What's Included Section Component
const WhatsIncludedSection: React.FC = () => (
  <motion.div
    className='px-4'
    initial='hidden'
    animate='visible'
    variants={ANIMATION_VARIANTS.fadeIn}
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
            {WHATS_INCLUDED.map((item, index) => (
              <IncludedItem key={index} item={item} />
            ))}

            {/* Not Included Section */}
            <div className='mt-8 pt-6 border-t border-gray-200'>
              <h4 className='font-bold text-gray-800 mb-4 flex items-center'>
                <X className='w-5 h-5 text-red-500 mr-2' />
                Not Included
              </h4>
              <div className='flex items-center'>
                <div className='w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-4'>
                  <Gift className='w-5 h-5 text-red-600' />
                </div>
                <span className='text-gray-600'>
                  {GOOD_TO_KNOW_INFO.notIncluded}
                </span>
              </div>
            </div>
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
);

// Included Item Component
const IncludedItem: React.FC<{ item: string }> = ({ item }) => (
  <div className='flex items-center'>
    <div className='w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4'>
      <CheckCircle className='w-5 h-5 text-green-600' />
    </div>
    <span className='text-lg text-gray-700 font-medium'>{item}</span>
  </div>
);

// Training Types Section Component
const TrainingTypesSection: React.FC<{
  selectedType: string;
  onTypeSelect: (typeId: string) => void;
}> = ({ selectedType, onTypeSelect }) => (
  <motion.div
    className='px-4'
    initial='hidden'
    animate='visible'
    variants={ANIMATION_VARIANTS.fadeIn}
  >
    <div className='text-center mb-12'>
      <h2 className='text-4xl font-bold text-gray-800 mb-4'>
        Choose Your Training Style
      </h2>
      <p className='text-xl text-gray-600'>
        Select the workout type that matches your fitness goals
      </p>
    </div>

    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {TRAINING_TYPES.map((type, index) => (
        <TrainingTypeCard
          key={type.id}
          type={type}
          isSelected={selectedType === type.id}
          onSelect={() => onTypeSelect(type.id)}
        />
      ))}
    </div>
  </motion.div>
);

// Training Type Card Component
const TrainingTypeCard: React.FC<{
  type: (typeof TRAINING_TYPES)[0];
  isSelected: boolean;
  onSelect: () => void;
}> = ({ type, isSelected, onSelect }) => (
  <motion.div
    className={`relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-500 hover:scale-105 ${
      isSelected ? 'ring-4 ring-indigo-500 shadow-2xl' : 'shadow-lg'
    }`}
    onClick={onSelect}
    variants={ANIMATION_VARIANTS.slideIn}
    whileHover={{ y: -5 }}
  >
    <div
      className={`h-48 bg-gradient-to-br ${type.color} p-6 text-white relative overflow-hidden`}
    >
      <div className='absolute inset-0 opacity-10'>
        <div className='absolute top-4 right-4 text-6xl'>{type.icon}</div>
      </div>

      <div className='relative z-10 h-full flex flex-col justify-between'>
        <div className='text-4xl mb-2'>{type.icon}</div>
        <div>
          <h3 className='text-lg font-bold mb-2'>{type.name}</h3>
          <p className='text-sm opacity-90'>{type.description}</p>
        </div>
      </div>

      <div className='absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-300' />
    </div>
  </motion.div>
);

// What to Expect Section Component
const WhatToExpectSection: React.FC = () => (
  <motion.div
    className='px-4'
    initial='hidden'
    animate='visible'
    variants={ANIMATION_VARIANTS.fadeIn}
  >
    <div className='bg-white rounded-3xl shadow-2xl p-8'>
      <div className='text-center mb-12'>
        <h2 className='text-4xl font-bold text-gray-800 mb-4'>
          What to Expect
        </h2>
        <p className='text-xl text-gray-600'>
          Your personalized training experience step by step
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {WHAT_TO_EXPECT_STEPS.map((step, index) => (
          <ExpectationStep key={step.step} step={step} />
        ))}
      </div>
    </div>
  </motion.div>
);

// Expectation Step Component
const ExpectationStep: React.FC<{
  step: (typeof WHAT_TO_EXPECT_STEPS)[0];
}> = ({ step }) => (
  <div className='text-center'>
    <div className='w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4'>
      <span className='text-2xl font-bold text-white'>{step.step}</span>
    </div>
    <h3 className='text-lg font-bold text-gray-800 mb-2'>{step.title}</h3>
    <p className='text-gray-600 text-sm'>{step.description}</p>
  </div>
);

// Good to Know Section Component
const GoodToKnowSection: React.FC = () => (
  <motion.div
    className='px-4'
    initial='hidden'
    animate='visible'
    variants={ANIMATION_VARIANTS.fadeIn}
  >
    <div className='bg-white rounded-3xl shadow-2xl p-8'>
      <h2 className='text-3xl font-bold text-gray-800 mb-8 text-center'>
        Good to Know
      </h2>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <GoodToKnowItem
          icon={Calendar}
          title='Start & End Time'
          description={GOOD_TO_KNOW_INFO.startEndTime}
        />
        <GoodToKnowItem
          icon={Shirt}
          title='What to Wear'
          description={GOOD_TO_KNOW_INFO.whatToWear}
        />
        <GoodToKnowItem
          icon={Users}
          title='Age Policy'
          description={GOOD_TO_KNOW_INFO.agePolicy}
        />
        <GoodToKnowItem
          icon={Heart}
          title='Adaptability'
          description={GOOD_TO_KNOW_INFO.adaptability}
        />
      </div>
    </div>
  </motion.div>
);

// Good to Know Item Component
const GoodToKnowItem: React.FC<{
  icon: React.ComponentType<any>;
  title: string;
  description: string;
}> = ({ icon: Icon, title, description }) => (
  <div className='flex items-start space-x-4 p-4 bg-gray-50 rounded-2xl'>
    <div className='w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0'>
      <Icon className='w-6 h-6 text-indigo-600' />
    </div>
    <div>
      <h3 className='font-bold text-gray-800 mb-1'>{title}</h3>
      <p className='text-gray-600 text-sm'>{description}</p>
    </div>
  </div>
);

// Call to Action Section Component
const CallToActionSection: React.FC<{
  service: Service;
  onBookClick: () => void;
}> = ({ service, onBookClick }) => (
  <motion.div
    className='px-4'
    initial='hidden'
    animate='visible'
    variants={ANIMATION_VARIANTS.fadeIn}
  >
    <div className='relative overflow-hidden rounded-3xl'>
      <div className='bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 p-12 text-center'>
        <div className='max-w-3xl mx-auto'>
          <h2 className='text-4xl md:text-5xl font-bold text-white mb-6'>
            Ready to Start Your Fitness Journey?
          </h2>
          <p className='text-xl text-white/90 mb-8'>
            Book your personalized training session today and take the first
            step towards achieving your fitness goals with expert guidance.
          </p>

          <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
            <button
              onClick={onBookClick}
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
);

// Testimonial Section Component
const TestimonialSection: React.FC = () => (
  <motion.div
    className='px-4'
    initial='hidden'
    animate='visible'
    variants={ANIMATION_VARIANTS.fadeIn}
  >
    <div className='bg-gradient-to-r from-blue-50 to-indigo-100 rounded-3xl p-8 text-center'>
      <div className='flex justify-center mb-4'>
        {[...Array(5)].map((_, i) => (
          <Star key={i} className='w-6 h-6 text-yellow-400 fill-current' />
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
);

// Health Disclaimer Section Component
const HealthDisclaimerSection: React.FC = () => (
  <motion.div
    className='px-4'
    initial='hidden'
    animate='visible'
    variants={ANIMATION_VARIANTS.fadeIn}
  >
    <div className='bg-amber-50 border border-amber-200 rounded-2xl p-6'>
      <div className='flex items-start'>
        <AlertTriangle className='w-6 h-6 text-amber-600 mr-3 flex-shrink-0 mt-1' />
        <div>
          <h3 className='font-bold text-amber-800 mb-2'>
            Health & Safety First
          </h3>
          <p className='text-amber-700'>
            For your safety, please consult your physician before beginning any
            new fitness program. Our certified trainers will adapt sessions to
            your fitness level and any physical limitations. Participation is at
            your own discretion.
          </p>
        </div>
      </div>
    </div>
  </motion.div>
);

export default PersonalTrainerServiceView;
