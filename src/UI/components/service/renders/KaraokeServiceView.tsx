import React, { useState, useCallback, useMemo } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { Service } from '@/types/type';
import { ServiceData } from '@/types/services';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useBooking } from '@/context/BookingContext';
import { BookingDate } from '@/types/type';
import BookingModal from '../../modal/BookingModal';
import {
  Music,
  Mic,
  Users,
  Clock,
  Star,
  ArrowRight,
  Play,
  Trophy,
  Sparkles,
  Quote,
  MicVocal,
  Zap,
  Gift,
  Disc3,
} from 'lucide-react';

interface KaraokeServiceViewProps {
  service: Service;
  serviceData?: ServiceData;
  primaryColor?: string;
  viewContext?: 'standard-view' | 'premium-view';
}

const TESTIMONIALS = [
  {
    id: '1',
    quote:
      'The karaoke setup was absolutely incredible! Everyone from kids to grandparents had a blast. The sound quality was amazing and the song selection was perfect.',
    author: 'Maria Rodriguez',
    event: 'Family Reunion',
    image:
      'https://images.unsplash.com/photo-1494790108755-2616b612b593?auto=format&fit=crop&q=80&w=150',
    rating: 5,
    songs: 'Sang 15 songs • 3 hours of fun',
  },
  {
    id: '2',
    quote:
      'Best birthday party ever! The setup was so professional and the wireless mics made it easy for everyone to join in. We recorded some hilarious performances!',
    author: 'David Chen',
    event: '30th Birthday Bash',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    rating: 5,
    songs: '25 guests • Epic dance party',
  },
  {
    id: '3',
    quote:
      'Our wedding reception was transformed! Guests who never sing were up there belting out classics. The international song selection was perfect for our diverse group.',
    author: 'Sarah & James Wilson',
    event: 'Wedding Reception',
    image:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',
    rating: 5,
    songs: 'Multilingual hits • 80 guests',
  },
];

const PARTY_MOMENTS = [
  {
    title: 'Epic Duets',
    description: 'Perfect songs for singing with friends and family',
    image:
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=600',
  },
  {
    title: 'Solo Superstars',
    description: 'Showcase your talent with crowd-pleasing performances',
    image:
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=600',
  },
  {
    title: 'Group Anthems',
    description: 'Get everyone singing together with these crowd favorites',
    image:
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=600',
  },
];

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const slideIn = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const bounce = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// Custom hook for gallery navigation
const useGallery = (imagesLength: number) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const navigate = useCallback(
    (direction: number) => {
      setCurrentIndex((prev) => {
        const newIndex = prev + direction;
        return newIndex < 0
          ? imagesLength - 1
          : newIndex >= imagesLength
          ? 0
          : newIndex;
      });
    },
    [imagesLength]
  );

  return { currentIndex, navigate, setCurrentIndex };
};

const KaraokeServiceView: React.FC<KaraokeServiceViewProps> = ({
  service,
  serviceData,
  primaryColor = 'purple',
  viewContext = 'standard-view',
}) => {
  const { t } = useTranslation();
  const { bookService } = useBooking();
  const { currentIndex, navigate, setCurrentIndex } = useGallery(
    PARTY_MOMENTS.length
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const averageRating = useMemo(
    () =>
      TESTIMONIALS.reduce((sum, t) => sum + t.rating, 0) / TESTIMONIALS.length,
    []
  );

  const handleBooking = useCallback(
    async (service: Service, dates: BookingDate, guests: number) => {
      try {
        setIsLoading(true);
        await bookService(service, dates, guests);
        setIsModalOpen(false);
      } catch (error) {
        console.error('Booking failed:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [bookService]
  );

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50'>
      <div className='max-w-8xl mx-auto space-y-16 pb-16'>
        {/* Hero Section */}
        <motion.div
          className='relative overflow-hidden rounded-3xl mx-4 mt-8'
          initial='hidden'
          animate='visible'
          variants={fadeInUp}
        >
          <div className='relative h-[90vh] bg-gradient-to-r from-purple-900/90 via-pink-800/80 to-blue-900/90'>
            <Image
              src='https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=1200'
              alt='Epic karaoke party with friends singing and dancing'
              fill
              className='object-cover mix-blend-overlay opacity-70'
              priority
            />

            {/* Floating Musical Elements */}
            <motion.div
              className='absolute top-20 right-20 w-20 h-20 bg-pink-500/20 rounded-full backdrop-blur-sm border border-pink-500/30 flex items-center justify-center'
              variants={bounce}
              animate='animate'
            >
              <MicVocal className='w-8 h-8 text-white' />
            </motion.div>
            <motion.div
              className='absolute bottom-32 left-16 w-16 h-16 bg-purple-500/20 rounded-full backdrop-blur-sm border border-purple-500/30 flex items-center justify-center'
              variants={bounce}
              animate='animate'
              transition={{ delay: 1 }}
            >
              <Music className='w-6 h-6 text-white' />
            </motion.div>
            <motion.div
              className='absolute top-1/3 left-20 w-12 h-12 bg-blue-500/20 rounded-full backdrop-blur-sm border border-blue-500/30 flex items-center justify-center'
              variants={bounce}
              animate='animate'
              transition={{ delay: 2 }}
            >
              <Star className='w-5 h-5 text-white' />
            </motion.div>

            <div className='relative z-10 h-full flex items-center justify-center text-center px-8'>
              <div className='max-w-6xl'>
                <motion.div
                  className='inline-flex items-center bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20 mb-8'
                  variants={slideIn}
                >
                  <Sparkles className='w-5 h-5 text-pink-300 mr-3' />
                  <span className='text-white font-medium text-lg'>
                    Sing, Dance, Create Memories
                  </span>
                </motion.div>

                <motion.h1
                  className='text-6xl md:text-8xl font-bold text-white mb-8 leading-tight'
                  variants={fadeInUp}
                >
                  Karaoke
                  <br />
                  <span className='bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 bg-clip-text text-transparent'>
                    Party Time
                  </span>
                </motion.h1>

                <motion.p
                  className='text-2xl md:text-3xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed'
                  variants={fadeInUp}
                >
                  Transform any space into the ultimate karaoke stage with
                  professional equipment and 5000+ songs everyone will love
                </motion.p>

                <motion.div
                  className='flex flex-wrap justify-center gap-8 mb-12'
                  variants={slideIn}
                >
                  <div className='flex items-center bg-white/10 backdrop-blur-sm px-6 py-4 rounded-2xl border border-white/20'>
                    <Users className='w-6 h-6 text-white mr-3' />
                    <div className='text-left'>
                      <div className='text-white font-semibold'>
                        2-25 People
                      </div>
                      <div className='text-white/70 text-sm'>
                        Any Group Size
                      </div>
                    </div>
                  </div>
                  <div className='flex items-center bg-white/10 backdrop-blur-sm px-6 py-4 rounded-2xl border border-white/20'>
                    <Disc3 className='w-6 h-6 text-white mr-3' />
                    <div className='text-left'>
                      <div className='text-white font-semibold'>
                        5000+ Songs
                      </div>
                      <div className='text-white/70 text-sm'>
                        All Genres & Languages
                      </div>
                    </div>
                  </div>
                  <div className='flex items-center bg-white/10 backdrop-blur-sm px-6 py-4 rounded-2xl border border-white/20'>
                    <Zap className='w-6 h-6 text-white mr-3' />
                    <div className='text-left'>
                      <div className='text-white font-semibold'>
                        15 Min Setup
                      </div>
                      <div className='text-white/70 text-sm'>
                        Quick & Professional
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.button
                  onClick={() => setIsModalOpen(true)}
                  className='group bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 text-white px-12 py-5 rounded-2xl font-bold text-xl flex items-center gap-3 mx-auto transition-all duration-300 hover:scale-105 shadow-2xl'
                  variants={slideIn}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className='w-7 h-7' fill='currentColor' />
                  Start the Party
                  <ArrowRight className='w-6 h-6 group-hover:translate-x-1 transition-transform' />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Party Moments Gallery */}
        <motion.div
          className='px-4'
          initial='hidden'
          animate='visible'
          variants={fadeInUp}
        >
          <div className='text-center mb-16'>
            <h2 className='text-5xl font-bold text-gray-800 mb-6'>
              Create Epic Moments
            </h2>
            <p className='text-2xl text-gray-600 max-w-3xl mx-auto'>
              Every song tells a story, every performance creates a memory
            </p>
          </div>

          <div className='relative'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
              {PARTY_MOMENTS.map((moment, index) => (
                <motion.div
                  key={index}
                  className='relative overflow-hidden rounded-3xl group'
                  variants={fadeInUp}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className='relative h-80'>
                    <Image
                      src={moment.image}
                      alt={moment.title}
                      fill
                      className='object-cover transition-transform duration-700 group-hover:scale-110'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent' />

                    <div className='absolute bottom-6 left-6 right-6 text-white'>
                      <h3 className='text-2xl font-bold mb-2'>
                        {moment.title}
                      </h3>
                      <p className='text-white/90 leading-relaxed'>
                        {moment.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Fun Facts */}
        <motion.div
          className='px-4'
          initial='hidden'
          animate='visible'
          variants={fadeInUp}
        >
          <div className='bg-white rounded-3xl shadow-2xl p-12'>
            <h2 className='text-4xl font-bold text-gray-800 mb-12 text-center'>
              Karaoke Fun Facts
            </h2>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
              {[
                {
                  icon: <Music className='w-8 h-8' />,
                  stat: '5000+',
                  label: 'Songs Available',
                  color: 'text-purple-600',
                },
                {
                  icon: <Users className='w-8 h-8' />,
                  stat: '500+',
                  label: 'Happy Parties',
                  color: 'text-pink-600',
                },
                {
                  icon: <Star className='w-8 h-8' />,
                  stat: '12',
                  label: 'Languages',
                  color: 'text-blue-600',
                },
                {
                  icon: <Clock className='w-8 h-8' />,
                  stat: '15min',
                  label: 'Setup Time',
                  color: 'text-green-600',
                },
              ].map((fact, index) => (
                <div key={index} className='text-center group'>
                  <div
                    className={`w-16 h-16 ${fact.color} bg-opacity-10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <div className={fact.color}>{fact.icon}</div>
                  </div>
                  <div className={`text-3xl font-bold ${fact.color} mb-2`}>
                    {fact.stat}
                  </div>
                  <div className='text-gray-600 font-medium'>{fact.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Pricing & CTA */}
        <motion.div
          className='px-4'
          initial='hidden'
          animate='visible'
          variants={fadeInUp}
        >
          <div className='relative overflow-hidden rounded-3xl'>
            <div className='absolute inset-0'>
              <Image
                src='https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=1200'
                alt='Epic karaoke party atmosphere'
                fill
                className='object-cover'
              />
              <div className='absolute inset-0 bg-gradient-to-r from-purple-900/90 via-pink-800/80 to-blue-900/90' />
            </div>

            <div className='relative z-10 p-16 text-center text-white'>
              <motion.h2
                className='text-5xl md:text-6xl font-bold mb-6'
                variants={fadeInUp}
              >
                Let's Get This Party Started!
              </motion.h2>
              <motion.p
                className='text-2xl opacity-90 mb-12 max-w-3xl mx-auto leading-relaxed'
                variants={fadeInUp}
              >
                Don't just have a party, create an experience! Book your
                professional karaoke setup and watch ordinary moments become
                extraordinary memories.
              </motion.p>

              <motion.div
                className='flex flex-col sm:flex-row gap-8 justify-center items-center mb-12'
                variants={fadeInUp}
              >
                <div className='text-center'>
                  <div className='text-5xl font-bold mb-2'>
                    ${service.price || 299}
                  </div>
                  <div className='text-white/70 text-lg'>
                    Complete karaoke experience
                  </div>
                  <div className='text-white/60 text-sm mt-1'>
                    Setup, equipment & support included
                  </div>
                </div>

                <button
                  onClick={() => setIsModalOpen(true)}
                  disabled={isLoading}
                  className='group bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 text-white px-12 py-5 rounded-2xl font-bold text-xl flex items-center gap-3 transition-all duration-300 hover:scale-105 shadow-2xl'
                >
                  {isLoading ? (
                    <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-white' />
                  ) : (
                    <>
                      <MicVocal className='w-6 h-6' />
                      Book Your Karaoke Party
                      <ArrowRight className='w-6 h-6 group-hover:translate-x-1 transition-transform' />
                    </>
                  )}
                </button>
              </motion.div>

              <motion.div
                className='grid grid-cols-1 md:grid-cols-4 gap-6 text-center'
                variants={stagger}
              >
                <motion.div
                  variants={fadeInUp}
                  className='bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20'
                >
                  <Zap className='w-8 h-8 text-yellow-400 mx-auto mb-3' />
                  <h4 className='font-bold mb-2'>Quick Setup</h4>
                  <p className='text-white/80 text-sm'>Ready in 15 minutes</p>
                </motion.div>
                <motion.div
                  variants={fadeInUp}
                  className='bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20'
                >
                  <Trophy className='w-8 h-8 text-green-400 mx-auto mb-3' />
                  <h4 className='font-bold mb-2'>Professional Quality</h4>
                  <p className='text-white/80 text-sm'>
                    Studio-grade equipment
                  </p>
                </motion.div>
                <motion.div
                  variants={fadeInUp}
                  className='bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20'
                >
                  <Disc3 className='w-8 h-8 text-blue-400 mx-auto mb-3' />
                  <h4 className='font-bold mb-2'>Massive Library</h4>
                  <p className='text-white/80 text-sm'>
                    5000+ songs & counting
                  </p>
                </motion.div>
                <motion.div
                  variants={fadeInUp}
                  className='bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20'
                >
                  <Gift className='w-8 h-8 text-purple-400 mx-auto mb-3' />
                  <h4 className='font-bold mb-2'>Memory Making</h4>
                  <p className='text-white/80 text-sm'>
                    Record your performances
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Testimonials */}
        <motion.div
          className='px-4'
          initial='hidden'
          animate='visible'
          variants={fadeInUp}
        >
          <div className='text-center mb-16'>
            <h2 className='text-5xl font-bold text-gray-800 mb-6'>
              Party Success Stories
            </h2>
            <div className='flex items-center justify-center gap-3 text-2xl text-gray-600'>
              <div className='flex'>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className='w-7 h-7 text-yellow-400 fill-current'
                  />
                ))}
              </div>
              <span>{averageRating.toFixed(1)} stars from amazing parties</span>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {TESTIMONIALS.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                className='bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 group relative overflow-hidden'
                variants={fadeInUp}
                whileHover={{ y: -4 }}
              >
                <div className='absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-bl-full' />

                <div className='flex items-center mb-6'>
                  <div className='relative w-16 h-16 rounded-full overflow-hidden mr-4'>
                    <Image
                      src={testimonial.image}
                      alt={testimonial.author}
                      fill
                      className='object-cover'
                    />
                  </div>
                  <div>
                    <h4 className='font-bold text-gray-800'>
                      {testimonial.author}
                    </h4>
                    <p className='text-gray-500 text-sm'>{testimonial.event}</p>
                    <div className='flex mt-1'>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className='w-4 h-4 text-yellow-400 fill-current'
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <Quote className='w-8 h-8 text-purple-500 mb-4' />
                <p className='text-gray-700 mb-4 leading-relaxed italic'>
                  "{testimonial.quote}"
                </p>

                <div className='text-sm text-purple-600 font-medium bg-purple-50 px-3 py-1 rounded-full inline-block'>
                  {testimonial.songs}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          className='px-4'
          initial='hidden'
          animate='visible'
          variants={fadeInUp}
        >
          <div className='bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl p-12'>
            <h2 className='text-4xl font-bold text-gray-800 mb-12 text-center'>
              Frequently Asked Questions
            </h2>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              {[
                {
                  q: 'How long does setup take?',
                  a: 'Our professional team can set up the complete karaoke system in just 15 minutes. We arrive early to ensure everything is ready for your event start time.',
                },
                {
                  q: 'Can we record our performances?',
                  a: 'Absolutely! Our system includes recording capabilities so you can capture those hilarious and memorable performances to share later.',
                },
                {
                  q: 'Do you have songs in different languages?',
                  a: 'Yes! We have an extensive collection of songs in over 12 languages including Spanish, French, Italian, Portuguese, and many more.',
                },
                {
                  q: 'What if we need more microphones?',
                  a: 'Our standard setup includes 2 wireless microphones, but we can provide additional mics for larger groups. Just let us know your needs when booking.',
                },
                {
                  q: 'Can kids use the karaoke system?',
                  a: "Definitely! We have a huge selection of kid-friendly songs including Disney classics, cartoon themes, and popular children's music.",
                },
                {
                  q: "What happens if there's technical issues?",
                  a: 'Our technician stays on-site during setup and provides support throughout your event. We also offer 24/7 technical support for any issues.',
                },
              ].map((faq, index) => (
                <div key={index} className='bg-white rounded-2xl p-6 shadow-sm'>
                  <h4 className='font-bold text-gray-800 mb-3 flex items-center'>
                    <div className='w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center mr-3'>
                      <span className='text-white text-sm font-bold'>
                        {index + 1}
                      </span>
                    </div>
                    {faq.q}
                  </h4>
                  <p className='text-gray-600 leading-relaxed ml-9'>{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Inspirational Quote */}
        <motion.div
          className='px-4'
          initial='hidden'
          animate='visible'
          variants={fadeInUp}
        >
          <div className='bg-gradient-to-r from-purple-100 via-pink-50 to-blue-100 rounded-3xl p-12 text-center relative overflow-hidden'>
            <motion.div
              className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500'
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 2, delay: 0.5 }}
            />

            <Quote className='w-12 h-12 text-purple-500 mx-auto mb-6' />
            <blockquote className='text-3xl md:text-4xl font-light text-gray-800 mb-6 italic leading-relaxed'>
              "Life is like karaoke - it's not about having a perfect voice,
              it's about having the courage to sing your heart out!"
            </blockquote>
            <cite className='text-xl text-purple-600 font-medium'>
              - Anonymous Karaoke Legend
            </cite>
          </div>
        </motion.div>

        {/* Floating Action Button */}
        <motion.div
          className='fixed bottom-8 right-8 z-50'
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 2, duration: 0.5 }}
        >
          <button
            onClick={() => setIsModalOpen(true)}
            className='group bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white p-4 rounded-full shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-110'
          >
            <MicVocal className='w-6 h-6 group-hover:scale-110 transition-transform' />
          </button>
        </motion.div>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <BookingModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConfirm={handleBooking}
            service={service}
            selectedExperience={selectedExperience}
            isLoading={isLoading}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default KaraokeServiceView;
