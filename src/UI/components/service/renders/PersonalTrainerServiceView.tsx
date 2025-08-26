import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Clock,
  Star,
  MapPin,
  Target,
  Award,
  Users,
  CheckCircle,
  ArrowRight,
  Play,
  Calendar,
  Shirt,
  Heart,
  AlertTriangle,
  Quote,
  Camera,
  Instagram,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import BookingModal from '../../modal/BookingModal';

// Types
interface Service {
  id: string;
  name: string;
  price: number;
}

interface ServiceData {
  metaData?: {
    sessionDuration?: number;
  };
}

interface PersonalTrainerServiceViewProps {
  service: Service;
  serviceData?: ServiceData;
}

// Constants
const TRAINING_SPECIALTIES = [
  {
    id: 'strength',
    title: 'Strength & Conditioning',
    description: 'Build lean muscle and increase functional strength',
    focus: 'Muscle Building',
    image:
      'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=2940&auto=format&fit=crop',
  },
  {
    id: 'hiit',
    title: 'HIIT & Cardio',
    description: 'High-intensity workouts for fat loss and endurance',
    focus: 'Fat Loss',
    image:
      'https://images.unsplash.com/photo-1549476464-37392f717541?q=80&w=2787&auto=format&fit=crop',
  },
  {
    id: 'functional',
    title: 'Functional Movement',
    description: 'Improve mobility and everyday movement patterns',
    focus: 'Mobility',
    image:
      'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?q=80&w=2787&auto=format&fit=crop',
  },
  {
    id: 'wellness',
    title: 'Wellness & Recovery',
    description: 'Holistic approach to fitness and well-being',
    focus: 'Recovery',
    image:
      'https://images.unsplash.com/photo-1506629905607-4d0ee439d067?q=80&w=2940&auto=format&fit=crop',
  },
] as const;

const SUCCESS_STORIES = [
  {
    name: 'James Chen',
    age: 28,
    result: 'Gained 12kg muscle mass',
    quote:
      'The personalized approach made all the difference. Every workout was perfectly tailored to my goals.',
    before:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2787&auto=format&fit=crop',
    after:
      'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=2940&auto=format&fit=crop',
  },
  {
    name: 'Sarah Kim',
    age: 42,
    result: 'Improved strength by 150%',
    quote:
      "At 42, I'm in the best shape of my life. The training sessions were challenging but so rewarding.",
    before:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2940&auto=format&fit=crop',
    after:
      'https://images.unsplash.com/photo-1549476464-37392f717541?q=80&w=2787&auto=format&fit=crop',
  },
] as const;

const TRAINING_GALLERY = [
  {
    image:
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2940&auto=format&fit=crop',
    caption: 'One-on-one strength training',
  },
  {
    image:
      'https://images.unsplash.com/photo-1549476464-37392f717541?q=80&w=2787&auto=format&fit=crop',
    caption: 'High-intensity cardio sessions',
  },
  {
    image:
      'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=2940&auto=format&fit=crop',
    caption: 'Functional movement training',
  },
  {
    image:
      'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?q=80&w=2787&auto=format&fit=crop',
    caption: 'Outdoor training sessions',
  },
  {
    image:
      'https://images.unsplash.com/photo-1506629905607-4d0ee439d067?q=80&w=2940&auto=format&fit=crop',
    caption: 'Recovery and flexibility work',
  },
  {
    image:
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2940&auto=format&fit=crop',
    caption: 'Beach training sessions',
  },
] as const;

const KEY_BENEFITS = [
  {
    icon: Target,
    title: 'Personalized Programs',
    description:
      'Custom workouts designed specifically for your goals and fitness level',
  },
  {
    icon: Award,
    title: 'Certified Expertise',
    description: 'Internationally certified trainers with proven track records',
  },
  {
    icon: MapPin,
    title: 'Your Space, Your Pace',
    description: 'Train anywhere - villa, beach, gym, or outdoor locations',
  },
  {
    icon: Users,
    title: 'All Levels Welcome',
    description: 'From complete beginners to advanced athletes',
  },
] as const;

const SESSION_INCLUDES = [
  'Certified personal trainer',
  'Custom workout plan',
  'Professional equipment',
  'Progress tracking',
  'Nutrition guidance',
  'Recovery techniques',
] as const;

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

// Main Component
const PersonalTrainerServiceView: React.FC<PersonalTrainerServiceViewProps> = ({
  service,
  serviceData,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStory, setCurrentStory] = useState(0);
  const sessionDuration = serviceData?.metaData?.sessionDuration || 60;

  const handleBooking = () => {
    setIsModalOpen(true);
    // Implement booking logic
  };

  const nextStory = () => {
    setCurrentStory((prev) => (prev + 1) % SUCCESS_STORIES.length);
  };

  const prevStory = () => {
    setCurrentStory(
      (prev) => (prev - 1 + SUCCESS_STORIES.length) % SUCCESS_STORIES.length
    );
  };

  return (
    <div className='min-h-screen bg-white'>
      {/* Hero Section */}
      <HeroSection
        sessionDuration={sessionDuration}
        onBookClick={handleBooking}
      />

      {/* Success Stories */}
      <SuccessStoriesSection
        currentStory={currentStory}
        onNext={nextStory}
        onPrev={prevStory}
      />

      {/* Training Specialties */}
      <SpecialtiesSection />

      {/* Human Banner CTA */}
      <HumanBannerSection onBookClick={handleBooking} />

      {/* What's Included */}
      <IncludedSection />

      {/* Benefits Grid */}
      <BenefitsSection />

      {/* Disclaimer */}
      <DisclaimerSection />

      {/* Booking Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <BookingModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConfirm={handleBooking}
            service={service}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Hero Section
const HeroSection: React.FC<{
  sessionDuration: number;
  onBookClick: () => void;
}> = ({ sessionDuration, onBookClick }) => (
  <motion.section
    className='relative pt-20 pb-32 px-6 overflow-hidden'
    initial='hidden'
    animate='visible'
    variants={fadeInUp}
  >
    {/* Background with overlay */}
    <div className='absolute inset-0 z-0'>
      <img
        src='https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2940&auto=format&fit=crop'
        alt='Personal training background'
        className='w-full h-full object-cover'
      />
      <div className='absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30'></div>
    </div>

    <div className='relative z-10 max-w-6xl mx-auto'>
      <div className='grid lg:grid-cols-2 gap-16 items-center'>
        {/* Content */}
        <div className='space-y-8 text-white'>
          <motion.div variants={fadeInUp}>
            <span className='inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium'>
              <Award className='w-4 h-4 mr-2' />
              Transforming Lives Daily
            </span>
          </motion.div>

          <motion.div variants={fadeInUp} className='space-y-6'>
            <h1 className='text-5xl lg:text-6xl font-bold leading-tight'>
              Your Fitness Journey
              <span className='block text-blue-400'>Starts Here</span>
            </h1>
            <p className='text-xl leading-relaxed max-w-lg opacity-90'>
              Real people. Real results. Real transformation. Join our community
              of over 500 successful clients who've achieved their fitness
              dreams.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={staggerChildren}
            className='flex flex-wrap gap-6'
          >
            <StatItem
              icon={Clock}
              value={`${sessionDuration}min`}
              label='Session'
            />
            <StatItem icon={Star} value='4.9' label='Rating' />
            <StatItem icon={Users} value='500+' label='Success Stories' />
          </motion.div>

          {/* CTA */}
          <motion.div variants={fadeInUp} className='pt-4'>
            <button
              onClick={onBookClick}
              className='group inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:scale-[1.02] shadow-xl'
            >
              <Play className='w-5 h-5' />
              Begin Your Transformation
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

// Benefits Section
const BenefitsSection: React.FC = () => (
  <motion.section
    className='py-24 px-2 bg-gray-50'
    initial='hidden'
    whileInView='visible'
    viewport={{ once: true }}
    variants={staggerChildren}
  >
    <div className='max-w-6xl mx-auto'>
      <motion.div variants={fadeInUp} className='text-center mb-16'>
        <h2 className='text-4xl font-bold text-gray-900 mb-4'>
          Why Our Clients Choose Us
        </h2>
        <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
          Experience the difference of individualized attention and expert
          guidance
        </p>
      </motion.div>

      <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8'>
        {KEY_BENEFITS.map((benefit, index) => (
          <BenefitCard key={index} benefit={benefit} />
        ))}
      </div>
    </div>
  </motion.section>
);

// Benefit Card
const BenefitCard: React.FC<{
  benefit: (typeof KEY_BENEFITS)[0];
}> = ({ benefit }) => (
  <motion.div
    variants={fadeInUp}
    className='bg-white p-8 rounded-xl hover:shadow-lg transition-shadow'
  >
    <div className='w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-6'>
      <benefit.icon className='w-6 h-6 text-blue-600' />
    </div>
    <h3 className='text-lg font-semibold text-gray-900 mb-3'>
      {benefit.title}
    </h3>
    <p className='text-gray-600'>{benefit.description}</p>
  </motion.div>
);

// Success Stories Section
const SuccessStoriesSection: React.FC<{
  currentStory: number;
  onNext: () => void;
  onPrev: () => void;
}> = ({ currentStory, onNext, onPrev }) => {
  const story = SUCCESS_STORIES[currentStory];

  return (
    <motion.section
      className='py-24 px-6'
      initial='hidden'
      whileInView='visible'
      viewport={{ once: true }}
      variants={fadeInUp}
    >
      <div className='max-w-6xl mx-auto'>
        <div className='text-center mb-16'>
          <h2 className='text-4xl font-bold text-gray-900 mb-4'>
            Real People, Real Results
          </h2>
          <p className='text-xl text-gray-600'>
            See the incredible transformations our clients have achieved
          </p>
        </div>

        <div className='bg-white rounded-3xl shadow-xl overflow-hidden'>
          <div className='grid lg:grid-cols-2'>
            {/* Before/After Images */}
            <div className='relative'>
              <div className='grid grid-cols-2 h-full'>
                <div className='relative'>
                  <img
                    src={story.before}
                    alt={`${story.name} before`}
                    className='w-full h-full object-cover'
                  />
                  <div className='absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold'>
                    Before
                  </div>
                </div>
                <div className='relative'>
                  <img
                    src={story.after}
                    alt={`${story.name} after`}
                    className='w-full h-full object-cover'
                  />
                  <div className='absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold'>
                    After
                  </div>
                </div>
              </div>
            </div>

            {/* Story Content */}
            <div className='p-12 flex flex-col justify-center'>
              <Quote className='w-12 h-12 text-blue-600 mb-6' />
              <blockquote className='text-xl text-gray-700 mb-8 leading-relaxed'>
                "{story.quote}"
              </blockquote>

              <div className='mb-8'>
                <h3 className='text-2xl font-bold text-gray-900'>
                  {story.name}
                </h3>
                <p className='text-gray-600'>Age {story.age}</p>
                <p className='text-blue-600 font-semibold text-lg mt-2'>
                  {story.result}
                </p>
              </div>

              {/* Navigation */}
              <div className='flex items-center justify-between'>
                <div className='flex gap-2'>
                  {SUCCESS_STORIES.map((_, index) => (
                    <div
                      key={index}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentStory ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>

                <div className='flex gap-2'>
                  <button
                    onClick={onPrev}
                    className='w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors'
                  >
                    <ChevronLeft className='w-5 h-5' />
                  </button>
                  <button
                    onClick={onNext}
                    className='w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors'
                  >
                    <ChevronRight className='w-5 h-5' />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

// Specialties Section
const SpecialtiesSection: React.FC = () => (
  <motion.section
    className='py-24 px-2 bg-gray-50'
    initial='hidden'
    whileInView='visible'
    viewport={{ once: true }}
    variants={staggerChildren}
  >
    <div className='max-w-6xl mx-auto'>
      <motion.div variants={fadeInUp} className='text-center mb-16'>
        <h2 className='text-4xl font-bold text-gray-900 mb-4'>
          Training Specialties
        </h2>
        <p className='text-xl text-gray-600'>
          Choose the approach that aligns with your fitness goals
        </p>
      </motion.div>

      <div className='grid md:grid-cols-2 gap-8'>
        {TRAINING_SPECIALTIES.map((specialty, index) => (
          <SpecialtyCard key={specialty.id} specialty={specialty} />
        ))}
      </div>
    </div>
  </motion.section>
);

// Specialty Card
const SpecialtyCard: React.FC<{
  specialty: (typeof TRAINING_SPECIALTIES)[0];
}> = ({ specialty }) => (
  <motion.div
    variants={fadeInUp}
    className='group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer'
  >
    <div className='relative h-48 overflow-hidden'>
      <img
        src={specialty.image}
        alt={specialty.title}
        className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-300'
      />
      <div className='absolute inset-0 bg-black/40'></div>
      <div className='absolute top-4 right-4'>
        <span className='px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full'>
          {specialty.focus}
        </span>
      </div>
    </div>

    <div className='p-6'>
      <h3 className='text-xl font-semibold text-gray-900 mb-2'>
        {specialty.title}
      </h3>
      <p className='text-gray-600 mb-4'>{specialty.description}</p>
      <div className='flex items-center text-blue-600 font-medium'>
        Learn more
        <ArrowRight className='w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform' />
      </div>
    </div>
  </motion.div>
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
    <div className='max-w-4xl mx-auto'>
      <div className='text-center mb-16'>
        <h2 className='text-4xl font-bold text-gray-900 mb-4'>
          What's Included
        </h2>
        <p className='text-xl text-gray-600'>
          Everything you need for a complete training experience
        </p>
      </div>

      <div className='bg-white rounded-2xl p-8 shadow-lg'>
        <div className='grid md:grid-cols-2 gap-6'>
          {SESSION_INCLUDES.map((item, index) => (
            <div key={index} className='flex items-center gap-4'>
              <div className='w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0'>
                <CheckCircle className='w-4 h-4 text-green-600' />
              </div>
              <span className='text-gray-700'>{item}</span>
            </div>
          ))}
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
      <img
        src='https://images.unsplash.com/photo-1549476464-37392f717541?q=80&w=2787&auto=format&fit=crop'
        alt='Training motivation'
        className='w-full h-full object-cover'
      />
      <div className='absolute inset-0 bg-black/60'></div>
    </div>

    <div className='relative z-10 max-w-4xl mx-auto text-center text-white'>
      <h2 className='text-4xl md:text-5xl font-bold mb-6'>
        Your Transformation Starts with
        <span className='block text-blue-400'>One Decision</span>
      </h2>
      <p className='text-xl mb-8 max-w-2xl mx-auto opacity-90'>
        Join hundreds of people who decided to invest in themselves. Your future
        self will thank you for taking this step today.
      </p>

      <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
        <button
          onClick={onBookClick}
          className='bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:scale-[1.02] shadow-xl'
        >
          Start My Journey Today
        </button>
        <p className='text-sm opacity-75'>
          👥 Join 500+ successful transformations
        </p>
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
        <AlertTriangle className='w-6 h-6 text-amber-600 flex-shrink-0 mt-1' />
        <div>
          <h3 className='font-semibold text-amber-900 mb-2'>
            Important Notice
          </h3>
          <p className='text-amber-800 text-sm'>
            Please consult with your physician before starting any new fitness
            program. Our certified trainers will adapt sessions to your fitness
            level and any physical limitations.
          </p>
        </div>
      </div>
    </div>
  </motion.section>
);

export default PersonalTrainerServiceView;
