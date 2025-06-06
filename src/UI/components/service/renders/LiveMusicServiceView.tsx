import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n/client';
import { Service } from '@/types/type';
import { ServiceData } from '@/types/services';
import { motion } from 'framer-motion';
import {
  Music,
  Calendar,
  Users,
  Timer,
  DollarSign,
  CreditCard,
  AlertCircle,
  Clock,
  PlayCircle,
  Mic,
  Check,
  ArrowRight,
} from 'lucide-react';
import { useReservation } from '@/context/BookingContext';
import { BookingDate } from '@/types/type';
import { useCallback, useMemo, useState } from 'react';

interface LiveMusicServiceViewProps {
  service: Service;
  serviceData?: ServiceData;
  primaryColor?: string;
}

// Constants
const PERFORMER_TYPES = [
  {
    id: 'soloist',
    name: 'Solo Artist',
    description: 'Acoustic guitar or piano',
    price: 150,
    duration: '60-90 min',
    image:
      'https://images.unsplash.com/photo-1501612780327-45045538702b?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'duo',
    name: 'Musical Duo',
    description: 'Vocal harmonies & instruments',
    price: 250,
    duration: '60-90 min',
    image:
      'https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'trio',
    name: 'Acoustic Trio',
    description: 'Full harmonic experience',
    price: 350,
    duration: '90-120 min',
    image:
      'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'band',
    name: 'Full Band',
    description: 'Complete musical ensemble',
    price: 500,
    duration: '120-180 min',
    image:
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=600&auto=format&fit=crop',
    popular: true,
  },
];

const MUSIC_GENRES = [
  {
    id: 'acoustic',
    name: 'Acoustic & Folk',
    description: 'Intimate, unplugged performances',
    icon: '🎸',
    popular: ['Ed Sheeran', 'John Mayer', 'Taylor Swift', 'Bob Dylan'],
  },
  {
    id: 'jazz',
    name: 'Jazz & Swing',
    description: 'Sophisticated evening atmosphere',
    icon: '🎷',
    popular: ['Frank Sinatra', 'Ella Fitzgerald', 'Nina Simone', 'Miles Davis'],
  },
  {
    id: 'latin',
    name: 'Latin & Tropical',
    description: 'Caribbean and Latin vibes',
    icon: '🌴',
    popular: ['Manu Chao', 'Jesse & Joy', 'Juan Luis Guerra', 'Buena Vista'],
  },
  {
    id: 'pop',
    name: 'Pop & Top 40',
    description: 'Current hits and classics',
    icon: '🎤',
    popular: ['Bruno Mars', 'Adele', 'The Weeknd', 'Dua Lipa'],
  },
  {
    id: 'rock',
    name: 'Rock & Classic',
    description: 'Energetic rock performances',
    icon: '🤘',
    popular: ['Queen', 'The Beatles', 'Coldplay', 'Red Hot Chili Peppers'],
  },
  {
    id: 'romantic',
    name: 'Romantic & Love Songs',
    description: 'Perfect for special moments',
    icon: '💕',
    popular: ['All of Me', 'Perfect', 'Thinking Out Loud', 'A Thousand Years'],
  },
];

const FEATURES = [
  'Professional sound equipment',
  'Flexible song selection',
  'Customizable set duration',
  'Professional musicians',
  'Setup and breakdown included',
];

const TESTIMONIALS = [
  {
    name: 'Sarah & Michael',
    event: 'Wedding Reception',
    quote:
      'The acoustic duo made our villa wedding absolutely magical. Every song was perfect!',
    rating: 5,
  },
  {
    name: 'Carlos R.',
    event: 'Birthday Celebration',
    quote:
      'Amazing jazz trio! They created the perfect atmosphere for our sunset dinner party.',
    rating: 5,
  },
  {
    name: 'Emma L.',
    event: 'Anniversary Dinner',
    quote:
      'Professional, talented, and accommodating. They played our special song beautifully.',
    rating: 5,
  },
];

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const LiveMusicServiceView: React.FC<LiveMusicServiceViewProps> = ({
  service,
  serviceData,
  primaryColor = 'blue',
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { setReservationData } = useReservation();

  const [bookingForm, setBookingForm] = useState({
    date: '',
    time: '',
    performerType: '',
    musicGenre: '',
    hasSpecificSongs: false,
    specificSongs: '',
    songLinks: '',
    specialRequests: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedPerformer = useMemo(
    () => PERFORMER_TYPES.find((p) => p.id === bookingForm.performerType),
    [bookingForm.performerType]
  );

  const totalPrice = selectedPerformer?.price || 0;

  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    if (!bookingForm.date) newErrors.date = 'Date required';
    if (!bookingForm.time) newErrors.time = 'Time required';
    if (!bookingForm.performerType)
      newErrors.performerType = 'Please select performer type';
    if (!bookingForm.musicGenre)
      newErrors.musicGenre = 'Please select music style';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [bookingForm]);

  const handleBookingSubmit = useCallback(async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      const reservationData = {
        service,
        formData: { ...bookingForm, calculatedPrice: totalPrice },
        totalPrice,
        bookingDate: new Date(),
      };

      setReservationData(reservationData);
      router.push('/reservation-confirmation');
    } catch (error) {
      console.error('Booking error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    bookingForm,
    totalPrice,
    service,
    setReservationData,
    router,
    validateForm,
  ]);

  const handleFormChange = useCallback(
    (field: string, value: any) => {
      setBookingForm((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
    },
    [errors]
  );

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-5xl mx-auto px-6 py-12 space-y-20'>
        {/* Hero Section */}
        <motion.div
          className='text-center space-y-8'
          initial='hidden'
          animate='visible'
          variants={fadeIn}
        >
          <div className='space-y-6'>
            <div className='inline-flex items-center bg-gray-100 px-4 py-2 rounded-full'>
              <Music className='w-4 h-4 text-gray-600 mr-2' />
              <span className='text-sm font-medium text-gray-700'>
                Professional Live Entertainment
              </span>
            </div>

            <h1 className='text-6xl md:text-7xl font-bold text-gray-900 leading-none'>
              Live Music
            </h1>

            <div className='text-2xl md:text-3xl font-light text-gray-800 italic mb-4'>
              "Where Memories Meet Melodies"
            </div>

            <p className='text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed'>
              Transform your event with professional musicians who bring soul to
              every celebration. From intimate villa dinners to grand
              celebrations, we create the perfect soundtrack for your special
              moments.
            </p>

            <div className='flex flex-wrap justify-center gap-8 text-sm text-gray-500'>
              <div className='flex items-center gap-2'>
                <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                <span>500+ Events</span>
              </div>
              <div className='flex items-center gap-2'>
                <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                <span>Professional Musicians</span>
              </div>
              <div className='flex items-center gap-2'>
                <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                <span>All Genres Available</span>
              </div>
            </div>
          </div>

          <div className='relative w-full h-64 md:h-80 rounded-3xl overflow-hidden'>
            <Image
              src='https://images.unsplash.com/photo-1496449903678-68ddcb189a24?q=80&w=1200&auto=format&fit=crop'
              alt='Live music performance at villa'
              fill
              className='object-cover'
              priority
            />
            <div className='absolute inset-0 bg-black/30 flex items-center justify-center'>
              <div className='text-center space-y-4'>
                <button
                  onClick={() =>
                    document
                      .getElementById('booking')
                      ?.scrollIntoView({ behavior: 'smooth' })
                  }
                  className='bg-white text-gray-900 px-8 py-4 rounded-2xl font-semibold flex items-center gap-3 hover:bg-gray-100 transition-colors group mx-auto'
                >
                  <PlayCircle className='w-6 h-6 group-hover:scale-110 transition-transform' />
                  Book Your Performance
                </button>
                <p className='text-white/90 text-sm'>
                  Starting from $150 • Same day availability
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Music Genre Selection */}
        <motion.section
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true }}
          variants={stagger}
          className='space-y-12'
        >
          <div className='text-center space-y-4'>
            <h2 className='text-4xl font-bold text-gray-900'>
              Choose Your Vibe
            </h2>
            <p className='text-xl text-gray-600'>
              What sound defines your perfect moment?
            </p>
          </div>

          <div className='grid grid-cols-2 lg:grid-cols-3 gap-4'>
            {MUSIC_GENRES.map((genre) => (
              <motion.div
                key={genre.id}
                variants={fadeIn}
                className={`relative group cursor-pointer transition-all duration-200 ${
                  bookingForm.musicGenre === genre.id
                    ? 'scale-[1.02]'
                    : 'hover:scale-[1.01]'
                }`}
                onClick={() => handleFormChange('musicGenre', genre.id)}
              >
                <div
                  className={`h-32 rounded-2xl border-2 p-6 flex flex-col justify-between transition-all duration-200 ${
                    bookingForm.musicGenre === genre.id
                      ? 'border-gray-900 bg-gray-900 text-white shadow-lg'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  <div className='flex items-center justify-between'>
                    <h3
                      className={`text-lg font-bold ${
                        bookingForm.musicGenre === genre.id
                          ? 'text-white'
                          : 'text-gray-900'
                      }`}
                    >
                      {genre.name}
                    </h3>
                    <div
                      className={`text-2xl ${
                        bookingForm.musicGenre === genre.id ? 'scale-110' : ''
                      } transition-transform duration-200`}
                    >
                      {genre.icon}
                    </div>
                  </div>

                  <p
                    className={`text-sm ${
                      bookingForm.musicGenre === genre.id
                        ? 'text-gray-200'
                        : 'text-gray-600'
                    }`}
                  >
                    {genre.description}
                  </p>

                  {/* Selection indicator */}
                  {bookingForm.musicGenre === genre.id && (
                    <div className='absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center'>
                      <Check className='w-4 h-4 text-gray-900' />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {errors.musicGenre && (
            <div className='text-center'>
              <p className='text-red-500 text-sm'>{errors.musicGenre}</p>
            </div>
          )}
        </motion.section>

        <motion.section
          id='booking'
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true }}
          variants={stagger}
          className='space-y-12'
        >
          <div className='text-center'>
            <h2 className='text-4xl font-bold text-gray-900 mb-4'>
              Choose Your Musicians
            </h2>
            <p className='text-xl text-gray-600'>
              Select the perfect performance for your event
            </p>
          </div>

          <div className='grid md:grid-cols-2 gap-6'>
            {PERFORMER_TYPES.map((performer) => (
              <motion.div
                key={performer.id}
                variants={fadeIn}
                className={`relative group cursor-pointer transition-all duration-300 ${
                  bookingForm.performerType === performer.id
                    ? 'scale-105'
                    : 'hover:scale-102'
                }`}
                onClick={() => handleFormChange('performerType', performer.id)}
              >
                <div className='relative h-64 rounded-2xl overflow-hidden'>
                  <Image
                    src={performer.image}
                    alt={performer.name}
                    fill
                    className='object-cover group-hover:scale-105 transition-transform duration-500'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent' />

                  {performer.popular && (
                    <div className='absolute top-4 right-4 bg-white text-gray-900 px-3 py-1 rounded-full text-sm font-semibold'>
                      Most Popular
                    </div>
                  )}

                  <div className='absolute bottom-0 left-0 right-0 p-6 text-white'>
                    <h3 className='text-2xl font-bold mb-2'>
                      {performer.name}
                    </h3>
                    <p className='text-white/80 mb-3'>
                      {performer.description}
                    </p>
                    <div className='flex justify-between items-center'>
                      <span className='text-sm text-white/60'>
                        {performer.duration}
                      </span>
                      <span className='text-2xl font-bold'>
                        ${performer.price}
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  className={`absolute inset-0 rounded-2xl border-3 transition-all ${
                    bookingForm.performerType === performer.id
                      ? 'border-gray-900 shadow-xl'
                      : 'border-transparent'
                  }`}
                />

                {bookingForm.performerType === performer.id && (
                  <div className='absolute -top-2 -right-2 w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center'>
                    <Check className='w-5 h-5 text-white' />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {errors.performerType && (
            <p className='text-red-500 text-center flex items-center justify-center'>
              <AlertCircle className='w-4 h-4 mr-1' />
              {errors.performerType}
            </p>
          )}
        </motion.section>

        {/* Booking Form */}
        {bookingForm.performerType && bookingForm.musicGenre && (
          <motion.section
            id='booking'
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100'
          >
            <div className='max-w-3xl mx-auto space-y-8'>
              <div className='text-center'>
                <h2 className='text-3xl font-bold text-gray-900 mb-2'>
                  Event Details
                </h2>
                <p className='text-gray-600'>
                  Let's finalize your musical experience
                </p>
              </div>

              {/* Date & Time */}
              <div className='grid md:grid-cols-2 gap-6'>
                <div>
                  <label className='block text-sm font-semibold text-gray-900 mb-3'>
                    Event Date
                  </label>
                  <input
                    type='date'
                    value={bookingForm.date}
                    onChange={(e) => handleFormChange('date', e.target.value)}
                    className={`w-full px-4 py-4 text-lg border-2 rounded-2xl focus:outline-none focus:ring-0 transition-colors ${
                      errors.date
                        ? 'border-red-300 bg-red-50 focus:border-red-400'
                        : 'border-gray-200 focus:border-gray-400'
                    }`}
                  />
                  {errors.date && (
                    <p className='text-red-500 text-sm mt-2'>{errors.date}</p>
                  )}
                </div>

                <div>
                  <label className='block text-sm font-semibold text-gray-900 mb-3'>
                    Start Time
                  </label>
                  <input
                    type='time'
                    value={bookingForm.time}
                    onChange={(e) => handleFormChange('time', e.target.value)}
                    className={`w-full px-4 py-4 text-lg border-2 rounded-2xl focus:outline-none focus:ring-0 transition-colors ${
                      errors.time
                        ? 'border-red-300 bg-red-50 focus:border-red-400'
                        : 'border-gray-200 focus:border-gray-400'
                    }`}
                  />
                  {errors.time && (
                    <p className='text-red-500 text-sm mt-2'>{errors.time}</p>
                  )}
                </div>
              </div>

              {/* Song Preferences */}
              <div className='space-y-6'>
                <div className='text-center'>
                  <h3 className='text-xl font-bold text-gray-900 mb-2'>
                    Song Requests
                  </h3>
                  <p className='text-gray-600'>
                    Help us play exactly what you want to hear
                  </p>
                </div>

                <label className='flex items-center cursor-pointer group'>
                  <div className='relative'>
                    <input
                      type='checkbox'
                      checked={bookingForm.hasSpecificSongs}
                      onChange={(e) =>
                        handleFormChange('hasSpecificSongs', e.target.checked)
                      }
                      className='sr-only'
                    />
                    <div
                      className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
                        bookingForm.hasSpecificSongs
                          ? 'bg-gray-900 border-gray-900'
                          : 'border-gray-300 group-hover:border-gray-400'
                      }`}
                    >
                      {bookingForm.hasSpecificSongs && (
                        <Check className='w-4 h-4 text-white' />
                      )}
                    </div>
                  </div>
                  <span className='ml-3 text-gray-900 font-medium'>
                    I have specific song requests
                  </span>
                </label>

                {bookingForm.hasSpecificSongs && (
                  <div className='space-y-4 bg-gray-50 p-6 rounded-2xl'>
                    <div>
                      <label className='block text-sm font-semibold text-gray-900 mb-3'>
                        Song List
                      </label>
                      <textarea
                        value={bookingForm.specificSongs}
                        onChange={(e) =>
                          handleFormChange('specificSongs', e.target.value)
                        }
                        placeholder="List your favorite songs (e.g., 'Perfect by Ed Sheeran', 'All of Me by John Legend')..."
                        rows={4}
                        className='w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-gray-400 resize-none text-lg'
                      />
                    </div>

                    <div>
                      <label className='block text-sm font-semibold text-gray-900 mb-3'>
                        Song Links (Optional)
                        <span className='font-normal text-gray-500 block text-xs mt-1'>
                          Share YouTube or Spotify links to ensure we play the
                          exact version you want
                        </span>
                      </label>
                      <textarea
                        value={bookingForm.songLinks}
                        onChange={(e) =>
                          handleFormChange('songLinks', e.target.value)
                        }
                        placeholder='Paste YouTube or Spotify links here (one per line)...'
                        rows={3}
                        className='w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-gray-400 resize-none'
                      />
                      <p className='text-xs text-gray-500 mt-2'>
                        💡 This helps us play the exact arrangement, tempo, and
                        style you prefer
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Special Requests */}
              <div>
                <label className='block text-sm font-semibold text-gray-900 mb-3'>
                  Special Requests{' '}
                  <span className='font-normal text-gray-500'>(Optional)</span>
                </label>
                <textarea
                  value={bookingForm.specialRequests}
                  onChange={(e) =>
                    handleFormChange('specialRequests', e.target.value)
                  }
                  placeholder='Venue details, volume preferences, special moments to highlight, or any other requests...'
                  rows={3}
                  className='w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-gray-400 resize-none text-lg'
                />
              </div>

              {/* Booking Summary */}
              <div className='bg-gray-50 rounded-2xl p-6'>
                <h4 className='font-bold text-gray-900 mb-4'>
                  Booking Summary
                </h4>
                <div className='space-y-2 text-gray-700'>
                  <div className='flex justify-between'>
                    <span>Performance Type:</span>
                    <span className='font-medium'>
                      {selectedPerformer?.name}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Music Style:</span>
                    <span className='font-medium'>
                      {
                        MUSIC_GENRES.find(
                          (g) => g.id === bookingForm.musicGenre
                        )?.name
                      }
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Duration:</span>
                    <span className='font-medium'>
                      {selectedPerformer?.duration}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* Why Choose Us / Social Proof */}
        <motion.section
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true }}
          variants={fadeIn}
          className='bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100'
        >
          <div className='text-center space-y-8'>
            <div>
              <h2 className='text-3xl font-bold text-gray-900 mb-4'>
                Why Choose Our Musicians?
              </h2>
              <p className='text-xl text-gray-600'>
                Professional quality that makes a difference
              </p>
            </div>

            <div className='grid md:grid-cols-4 gap-8'>
              <div className='text-center'>
                <div className='text-3xl font-bold text-gray-900 mb-2'>
                  500+
                </div>
                <p className='text-gray-600'>Events Performed</p>
              </div>
              <div className='text-center'>
                <div className='text-3xl font-bold text-gray-900 mb-2'>
                  4.9/5
                </div>
                <p className='text-gray-600'>Average Rating</p>
              </div>
              <div className='text-center'>
                <div className='text-3xl font-bold text-gray-900 mb-2'>24h</div>
                <p className='text-gray-600'>Booking Confirmation</p>
              </div>
              <div className='text-center'>
                <div className='text-3xl font-bold text-gray-900 mb-2'>
                  100%
                </div>
                <p className='text-gray-600'>Satisfaction Rate</p>
              </div>
            </div>

            <div className='space-y-6'>
              <h3 className='text-xl font-bold text-gray-900'>
                What Our Clients Say
              </h3>
              <div className='grid md:grid-cols-3 gap-6'>
                {TESTIMONIALS.map((testimonial, index) => (
                  <div key={index} className='bg-gray-50 p-6 rounded-2xl'>
                    <div className='flex mb-3'>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <span key={i} className='text-yellow-400 text-lg'>
                          ★
                        </span>
                      ))}
                    </div>
                    <p className='text-gray-700 italic mb-4'>
                      "{testimonial.quote}"
                    </p>
                    <div>
                      <p className='font-semibold text-gray-900'>
                        {testimonial.name}
                      </p>
                      <p className='text-sm text-gray-600'>
                        {testimonial.event}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>
        <motion.section
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true }}
          variants={fadeIn}
          className='text-center space-y-8'
        >
          <h2 className='text-3xl font-bold text-gray-900'>What's Included</h2>
          <div className='grid md:grid-cols-5 gap-6'>
            {FEATURES.map((feature, index) => (
              <div key={index} className='flex flex-col items-center space-y-3'>
                <div className='w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center'>
                  <Check className='w-6 h-6 text-gray-600' />
                </div>
                <p className='text-gray-700 font-medium text-center'>
                  {feature}
                </p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Price Summary & Booking */}
        {totalPrice > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className='bg-gray-900 rounded-3xl p-8 md:p-12 text-white text-center'
          >
            <div className='max-w-2xl mx-auto space-y-8'>
              <div>
                <h2 className='text-3xl font-bold mb-4'>Ready to Book?</h2>
                <p className='text-gray-300 text-lg'>
                  {selectedPerformer?.name} for your special event
                </p>
              </div>

              <div className='bg-white/10 rounded-2xl p-6 space-y-4'>
                <div className='flex justify-between text-xl'>
                  <span>Performance Fee:</span>
                  <span className='font-bold'>${totalPrice}</span>
                </div>
                <div className='text-sm text-gray-300'>
                  Duration: {selectedPerformer?.duration} • Professional
                  equipment included
                </div>
              </div>

              <button
                onClick={handleBookingSubmit}
                disabled={isSubmitting}
                className='w-full max-w-md mx-auto py-4 bg-white text-gray-900 hover:bg-gray-100 font-bold text-lg rounded-2xl transition-colors flex items-center justify-center gap-3 disabled:opacity-50'
              >
                {isSubmitting ? (
                  <>
                    <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900'></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className='w-5 h-5' />
                    Confirm Booking
                    <ArrowRight className='w-5 h-5' />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LiveMusicServiceView;
