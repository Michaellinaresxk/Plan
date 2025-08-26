import React, { useState, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useReservation } from '@/context/BookingContext';
import {
  Leaf,
  Clock,
  Star,
  ArrowRight,
  Shield,
  Heart,
  CheckCircle,
  Sparkles,
  Play,
} from 'lucide-react';
import MassageConfigModal from '../massage/MassageConfigModal';
import FilterBar from '../massage/FilterBar';
import MassageCard from '../massage/MassageCard';

// SPA_SERVICES data
const SPA_SERVICES = {
  massages: [
    {
      id: 'swedish',
      name: 'Swedish Relaxation',
      description:
        'Gentle, flowing strokes to melt away tension and restore inner peace',
      longDescription:
        'Our signature Swedish massage combines traditional techniques with aromatherapy to create a deeply relaxing experience that soothes both body and mind.',
      category: 'relaxation',
      durations: [
        { duration: 60, price: 120, popular: false },
        { duration: 90, price: 160, popular: true },
      ],
      emoji: '🌿',
      maxPersons: 4,
      intensity: 'gentle',
      isPremium: false,
      imageUrl:
        'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800',
      benefits: [
        'Stress Relief',
        'Improved Circulation',
        'Better Sleep',
        'Muscle Relaxation',
      ],
      perfectFor: ['First-time clients', 'Stress relief', 'General wellness'],
      techniques: ['Long gliding strokes', 'Kneading', 'Aromatherapy'],
    },
    {
      id: 'deep-tissue',
      name: 'Deep Tissue Therapy',
      description:
        'Intensive therapeutic massage targeting chronic tension and pain',
      longDescription:
        'Designed for those who need serious muscle work, this therapy focuses on the deeper layers of muscle tissue to release chronic patterns of tension.',
      category: 'therapeutic',
      durations: [
        { duration: 60, price: 140, popular: false },
        { duration: 90, price: 180, popular: true },
      ],
      emoji: '💪',
      maxPersons: 2,
      intensity: 'strong',
      isPremium: true,
      imageUrl:
        'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800',
      benefits: [
        'Pain Relief',
        'Tension Release',
        'Improved Mobility',
        'Injury Recovery',
      ],
      perfectFor: ['Athletes', 'Chronic pain', 'Injury recovery'],
      techniques: [
        'Deep pressure',
        'Trigger point therapy',
        'Myofascial release',
      ],
    },
    {
      id: 'hot-stone',
      name: 'Sacred Stone Ritual',
      description:
        'Heated volcanic stones create deep warmth and profound relaxation',
      longDescription:
        'Ancient healing meets modern luxury. Smooth, heated stones are placed on key points while warm stone massage melts away every trace of stress.',
      category: 'signature',
      durations: [{ duration: 90, price: 200, popular: true }],
      emoji: '🔥',
      maxPersons: 2,
      intensity: 'medium',
      isPremium: true,
      imageUrl:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
      benefits: [
        'Deep Relaxation',
        'Improved Blood Flow',
        'Muscle Tension Relief',
        'Spiritual Balance',
      ],
      perfectFor: ['Ultimate relaxation', 'Cold weather', 'Spiritual wellness'],
      techniques: ['Hot stone placement', 'Stone massage', 'Energy balancing'],
    },
    {
      id: 'aromatherapy',
      name: 'Botanical Bliss',
      description:
        'A sensory journey with pure essential oils and healing touch',
      longDescription:
        'Customized essential oil blends enhance this therapeutic massage, creating a multi-sensory experience that harmonizes mind, body, and spirit.',
      category: 'relaxation',
      durations: [
        { duration: 60, price: 130, popular: false },
        { duration: 90, price: 170, popular: true },
      ],
      emoji: '🌸',
      maxPersons: 3,
      intensity: 'gentle',
      isPremium: false,
      imageUrl:
        'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=800',
      benefits: [
        'Mental Clarity',
        'Emotional Balance',
        'Stress Reduction',
        'Mood Enhancement',
      ],
      perfectFor: [
        'Emotional wellness',
        'Aromatherapy lovers',
        'Holistic healing',
      ],
      techniques: [
        'Custom oil blending',
        'Lymphatic drainage',
        'Chakra balancing',
      ],
    },
    {
      id: 'prenatal',
      name: 'Nurturing Mother',
      description:
        "Specialized care designed for the expecting mother's unique needs",
      longDescription:
        'Our certified prenatal therapists provide safe, effective massage therapy to support you through your pregnancy journey with comfort and care.',
      category: 'therapeutic',
      durations: [{ duration: 60, price: 150, popular: true }],
      emoji: '🤱',
      maxPersons: 1,
      intensity: 'gentle',
      isPremium: true,
      imageUrl:
        'https://images.unsplash.com/photo-1527196850338-c9e2cfac4d5a?w=800',
      benefits: [
        'Pregnancy Comfort',
        'Swelling Reduction',
        'Back Pain Relief',
        'Improved Sleep',
      ],
      perfectFor: ['Pregnant women', 'Back pain relief', 'Emotional support'],
      techniques: [
        'Side-lying positioning',
        'Gentle pressure',
        'Prenatal-safe techniques',
      ],
    },
    {
      id: 'sports',
      name: 'Athletic Recovery',
      description: 'Performance-focused therapy to enhance athletic potential',
      longDescription:
        'Designed specifically for athletes and active individuals, combining therapeutic techniques to improve performance and prevent injuries.',
      category: 'therapeutic',
      durations: [
        { duration: 60, price: 155, popular: false },
        { duration: 90, price: 195, popular: true },
      ],
      emoji: '🏃‍♂️',
      maxPersons: 2,
      intensity: 'strong',
      isPremium: false,
      imageUrl:
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
      benefits: [
        'Performance Enhancement',
        'Injury Prevention',
        'Faster Recovery',
        'Flexibility',
      ],
      perfectFor: ['Athletes', 'Active lifestyle', 'Performance goals'],
      techniques: ['Sports massage', 'Stretching', 'Compression therapy'],
    },
    {
      id: 'couples',
      name: 'Romantic Escape',
      description: 'Share the bliss of relaxation with your loved one',
      longDescription:
        "Side-by-side massage tables, candlelight, and synchronized treatments create an intimate wellness experience you'll treasure forever.",
      category: 'signature',
      durations: [
        { duration: 60, price: 240, popular: false },
        { duration: 90, price: 320, popular: true },
      ],
      emoji: '💑',
      maxPersons: 2,
      intensity: 'gentle',
      isPremium: true,
      imageUrl:
        'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=800',
      benefits: [
        'Romantic Experience',
        'Shared Relaxation',
        'Bonding Time',
        'Stress Relief',
      ],
      perfectFor: ['Couples', 'Anniversaries', 'Date nights'],
      techniques: [
        'Synchronized massage',
        'Couples aromatherapy',
        'Romantic ambiance',
      ],
    },
    {
      id: 'thai',
      name: 'Ancient Thai Healing',
      description:
        'Traditional stretching and pressure point massage from Thailand',
      longDescription:
        'This ancient healing art combines acupressure, assisted yoga stretches, and energy work to restore balance and flexibility to your entire being.',
      category: 'signature',
      durations: [
        { duration: 90, price: 180, popular: true },
        { duration: 120, price: 220, popular: false },
      ],
      emoji: '🧘‍♀️',
      maxPersons: 1,
      intensity: 'medium',
      isPremium: true,
      imageUrl:
        'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=800',
      benefits: [
        'Flexibility',
        'Energy Balance',
        'Stress Relief',
        'Spiritual Wellness',
      ],
      perfectFor: ['Flexibility needs', 'Energy work', 'Traditional healing'],
      techniques: ['Thai stretching', 'Pressure points', 'Energy lines'],
    },
  ],
};

// Main Component
const MassageServiceView = () => {
  const router = useRouter();
  const { setReservationData } = useReservation();

  const [currentMassage, setCurrentMassage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [filters, setFilters] = useState({
    search: '',
    category: '',
    intensity: '',
    priceRange: '',
    premiumOnly: false,
  });

  const filteredMassages = useMemo(() => {
    return SPA_SERVICES.massages.filter((massage) => {
      if (
        filters.search &&
        !massage.name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !massage.description
          .toLowerCase()
          .includes(filters.search.toLowerCase())
      ) {
        return false;
      }
      if (filters.category && massage.category !== filters.category)
        return false;
      if (filters.intensity && massage.intensity !== filters.intensity)
        return false;
      if (filters.priceRange) {
        const minPrice = Math.min(...massage.durations.map((d) => d.price));
        switch (filters.priceRange) {
          case '0-120':
            if (minPrice > 120) return false;
            break;
          case '120-180':
            if (minPrice < 120 || minPrice > 180) return false;
            break;
          case '180-250':
            if (minPrice < 180 || minPrice > 250) return false;
            break;
          case '250+':
            if (minPrice < 250) return false;
            break;
        }
      }
      if (filters.premiumOnly && !massage.isPremium) return false;
      return true;
    });
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      category: '',
      intensity: '',
      priceRange: '',
      premiumOnly: false,
    });
  };

  const handleMassageSelect = useCallback((massage) => {
    setCurrentMassage(massage);
    setShowModal(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setShowModal(false);
    setCurrentMassage(null);
  }, []);

  const handleMassageConfirm = useCallback(
    async (reservationData) => {
      try {
        setReservationData(reservationData);
        router.push('/reservation-confirmation');
        setShowModal(false);
        setCurrentMassage(null);
      } catch (error) {
        console.error('Error processing massage booking:', error);
        alert('Error processing booking. Please try again.');
      }
    },
    [setReservationData, router]
  );

  const totalFilteredCount = filteredMassages.length;
  const totalMassagesCount = SPA_SERVICES.massages.length;

  return (
    <div className='min-h-screen bg-gradient-to-b from-emerald-50 via-white to-teal-50 relative'>
      {/* Hero Section */}
      <section className='relative h-screen flex items-center justify-center px-4 sm:px-6 overflow-hidden'>
        <div className='absolute inset-0 z-0'>
          <Image
            src='https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2000'
            alt='Serene Spa Experience'
            fill
            className='object-cover'
            priority
          />
          <div className='absolute inset-0 bg-gradient-to-br from-emerald-900/80 via-emerald-800/60 to-teal-900/80' />
          <div className='absolute inset-0 bg-black/20' />
        </div>

        <div className='absolute inset-0 overflow-hidden'>
          <div className='absolute top-20 left-10 w-32 h-32 border border-white/10 rounded-full'></div>
          <div className='absolute top-40 right-20 w-20 h-20 border border-white/10 rounded-full'></div>
          <div className='absolute bottom-32 left-1/4 w-24 h-24 border border-white/10 rounded-full'></div>
        </div>

        <div className='relative z-20 text-center max-w-5xl'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className='inline-flex items-center bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 mb-8 shadow-lg'
          >
            <Leaf className='w-5 h-5 text-emerald-300 mr-3' />
            <span className='text-white font-medium'>
              BF Paradise • Premium Wellness Sanctuary
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className='text-4xl sm:text-6xl lg:text-7xl font-light text-white mb-6 leading-tight'
          >
            Therapeutic
            <span className='block text-emerald-300 font-normal'>
              Massage Sanctuary
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className='text-xl sm:text-2xl text-white/90 mb-12 leading-relaxed font-light max-w-3xl mx-auto'
          >
            Experience the transformative power of healing touch with our
            collection of {totalMassagesCount} expertly crafted therapeutic
            treatments
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className='flex flex-wrap justify-center gap-8 text-white/80 text-sm'
          >
            <div className='flex items-center gap-2'>
              <Shield className='w-4 h-4 text-emerald-300' />
              <span>Licensed Therapists</span>
            </div>
            <div className='flex items-center gap-2'>
              <Heart className='w-4 h-4 text-rose-300' />
              <span>In-Home Service</span>
            </div>
            <div className='flex items-center gap-2'>
              <Star className='w-4 h-4 text-amber-300' />
              <span>Premium Experience</span>
            </div>
            <div className='flex items-center gap-2'>
              <CheckCircle className='w-4 h-4 text-green-300' />
              <span>Satisfaction Guaranteed</span>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className='absolute bottom-8 left-1/2 transform -translate-x-1/2'
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className='w-6 h-10 border-2 border-white/50 rounded-full flex justify-center'
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className='w-1 h-3 bg-white/70 rounded-full mt-2'
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Inspirational Quote Section */}
      <section className='py-20 px-4 sm:px-6 relative overflow-hidden bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50'>
        <div className='absolute inset-0 opacity-10'>
          <div className='absolute top-10 left-10 w-64 h-64 bg-emerald-300 rounded-full blur-3xl'></div>
          <div className='absolute bottom-10 right-10 w-96 h-96 bg-teal-300 rounded-full blur-3xl'></div>
        </div>

        <div className='max-w-4xl mx-auto text-center relative z-10'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='mb-8'
          >
            <div className='text-6xl text-emerald-600 mb-6'>🌸</div>
            <blockquote className='text-3xl lg:text-4xl font-light text-gray-800 leading-relaxed mb-8 italic'>
              "Take time to make your soul happy. Your body deserves the gift of
              healing touch, and your mind craves the peace that only comes from
              true relaxation."
            </blockquote>
            <div className='w-24 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 mx-auto rounded-full'></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className='grid grid-cols-2 md:grid-cols-3 gap-8 mt-16'
          >
            <div className='bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-emerald-100 shadow-lg'>
              <div className='text-emerald-600 text-4xl font-bold mb-2'>
                500+
              </div>
              <div className='text-gray-600 font-medium'>Blissful Sessions</div>
              <div className='text-sm text-gray-500 mt-2'>
                completed this year
              </div>
            </div>

            <div className='bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-emerald-100 shadow-lg'>
              <div className='text-emerald-600 text-4xl font-bold mb-2'>
                98%
              </div>
              <div className='text-gray-600 font-medium'>Satisfaction Rate</div>
              <div className='text-sm text-gray-500 mt-2'>
                from our valued clients
              </div>
            </div>

            <div className='bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-emerald-100 shadow-lg'>
              <div className='text-emerald-600 text-4xl font-bold mb-2'>
                24/7
              </div>
              <div className='text-gray-600 font-medium'>Availability</div>
              <div className='text-sm text-gray-500 mt-2'>
                for your convenience
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Services Content */}
      <section id='massage-services' className='py-20 px-4 sm:px-6 relative'>
        <div className='max-w-7xl mx-auto'>
          <div className='text-center mb-16'>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className='text-4xl lg:text-5xl font-light text-gray-900 mb-6'
            >
              Choose Your Perfect
              <span className='text-emerald-600 block'>Healing Experience</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className='text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed'
            >
              Each treatment is thoughtfully designed to address your unique
              wellness needs, combining ancient wisdom with modern therapeutic
              techniques
            </motion.p>
          </div>

          <FilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />

          <div className='mb-8'>
            <p className='text-gray-600 text-lg'>
              <span className='font-semibold text-emerald-600'>
                {totalFilteredCount}
              </span>{' '}
              therapeutic experiences available
              {totalFilteredCount !== totalMassagesCount && (
                <button
                  onClick={handleClearFilters}
                  className='ml-3 text-emerald-600 hover:text-emerald-700 underline font-medium'
                >
                  View all treatments
                </button>
              )}
            </p>
          </div>

          {totalFilteredCount > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16'>
              {filteredMassages.map((massage, index) => (
                <motion.div
                  key={massage.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <MassageCard
                    massage={massage}
                    isSelected={false}
                    onSelect={() => handleMassageSelect(massage)}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className='text-center py-16'
            >
              <div className='text-8xl mb-6'>🌿</div>
              <h3 className='text-2xl font-semibold text-gray-800 mb-4'>
                No treatments match your search
              </h3>
              <p className='text-gray-600 mb-8 text-lg'>
                Try adjusting your filters to discover more healing experiences
              </p>
              <button
                onClick={handleClearFilters}
                className='px-8 py-4 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors font-semibold text-lg shadow-lg'
              >
                Show All Treatments
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className='py-20 px-4 sm:px-6 relative'>
        <div className='max-w-6xl mx-auto'>
          <div className='bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl p-12 relative overflow-hidden shadow-2xl'>
            <div className='absolute inset-0 opacity-20'>
              <div className='absolute top-0 left-0 w-full h-full bg-[url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")]'></div>
            </div>

            <div className='relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
              <div>
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <h3 className='text-4xl lg:text-5xl font-light text-white mb-6 leading-tight'>
                    Your Journey to
                    <span className='block text-emerald-200 font-normal'>
                      Complete Wellness
                    </span>
                  </h3>

                  <p className='text-xl text-emerald-100 mb-8 leading-relaxed'>
                    Escape the stress of daily life and immerse yourself in pure
                    tranquility. Our expert therapists bring the spa experience
                    directly to you.
                  </p>

                  <div className='space-y-4 mb-8'>
                    <div className='flex items-center gap-4 text-emerald-100'>
                      <div className='w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center'>
                        <CheckCircle className='w-5 h-5 text-white' />
                      </div>
                      <span>
                        Certified massage therapists with 5+ years experience
                      </span>
                    </div>
                    <div className='flex items-center gap-4 text-emerald-100'>
                      <div className='w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center'>
                        <Heart className='w-5 h-5 text-white' />
                      </div>
                      <span>
                        Premium organic oils and heated massage tables
                      </span>
                    </div>
                    <div className='flex items-center gap-4 text-emerald-100'>
                      <div className='w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center'>
                        <Sparkles className='w-5 h-5 text-white' />
                      </div>
                      <span>Customized treatments for your unique needs</span>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      document
                        .getElementById('massage-services')
                        .scrollIntoView({ behavior: 'smooth' })
                    }
                    className='bg-white text-emerald-600 px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3'
                  >
                    <Play className='w-5 h-5' />
                    Start Your Wellness Journey
                    <ArrowRight className='w-5 h-5' />
                  </motion.button>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className='relative'
              >
                <div className='grid grid-cols-2 gap-6'>
                  <div className='space-y-6'>
                    <div className='bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20'>
                      <div className='text-3xl mb-3'>🧘‍♀️</div>
                      <h4 className='text-white font-semibold mb-2'>
                        Mind Balance
                      </h4>
                      <p className='text-emerald-100 text-sm'>
                        Achieve mental clarity and emotional harmony
                      </p>
                    </div>
                    <div className='bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20'>
                      <div className='text-3xl mb-3'>💆‍♀️</div>
                      <h4 className='text-white font-semibold mb-2'>
                        Body Renewal
                      </h4>
                      <p className='text-emerald-100 text-sm'>
                        Release tension and restore vitality
                      </p>
                    </div>
                  </div>
                  <div className='space-y-6 mt-12'>
                    <div className='bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20'>
                      <div className='text-3xl mb-3'>🌿</div>
                      <h4 className='text-white font-semibold mb-2'>
                        Natural Healing
                      </h4>
                      <p className='text-emerald-100 text-sm'>
                        Pure organic products for your wellness
                      </p>
                    </div>
                    <div className='bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20'>
                      <div className='text-3xl mb-3'>🏠</div>
                      <h4 className='text-white font-semibold mb-2'>
                        Home Comfort
                      </h4>
                      <p className='text-emerald-100 text-sm'>
                        Luxury spa experience in your space
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {showModal && currentMassage && (
          <MassageConfigModal
            massage={currentMassage}
            isOpen={showModal}
            onClose={handleModalClose}
            onConfirm={handleMassageConfirm}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MassageServiceView;
