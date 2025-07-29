import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bike,
  MapPin,
  Clock,
  Star,
  Shield,
  Truck,
  CheckCircle,
  AlertTriangle,
  Battery,
  Users,
  Calendar,
  Baby,
  CreditCard,
  Info,
  X,
  Plus,
  Minus,
  ArrowUp,
  User,
  Sparkles,
  Heart,
} from 'lucide-react';
import { useReservation } from '@/context/BookingContext';
import { useRouter } from 'next/navigation';
import {
  BIKE_TYPES,
  BikeRentalServiceViewProps,
  FormErrors,
  INCLUDED_ITEMS,
  NOT_INCLUDED_ITEMS,
  PROCESS_STEPS,
} from '@/types/bike';

interface Person {
  id: string;
  type: 'adult' | 'child';
  age?: number;
  selectedBike: string;
  name?: string;
}

interface BookingFormData {
  startDate: string;
  endDate: string;
  endTime: string;
  startTime: string;
  location: string;
  people: Person[];
  needsHelmet: boolean;
  needsLock: boolean;
  deliveryToHotel: boolean;
  specialRequests: string;
}

const FEATURES = [
  {
    icon: <Clock className='w-6 h-6' />,
    title: 'Flexible Hours',
    description: 'Rent by hour, day, or week',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: <MapPin className='w-6 h-6' />,
    title: 'Free Delivery',
    description: 'Delivered anywhere in Punta Cana',
    color: 'bg-green-50 text-green-600',
  },
  {
    icon: <Battery className='w-6 h-6' />,
    title: 'Premium Quality',
    description: 'Well-maintained, latest models',
    color: 'bg-purple-50 text-purple-600',
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

const slideIn = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

const BikeRentalServiceView: React.FC<BikeRentalServiceViewProps> = ({
  service,
}) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { setReservationData } = useReservation();

  // State for bike selection and booking form
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedBikeType, setSelectedBikeType] = useState('');

  // Booking form state - REFACTORED: Now uses people array instead of counts
  const [formData, setFormData] = useState<BookingFormData>({
    startDate: '',
    endDate: '',
    endTime: '',
    startTime: '09:00',
    location: '',
    people: [
      { id: 'adult-1', type: 'adult', selectedBike: 'cityBike' },
      { id: 'adult-2', type: 'adult', selectedBike: 'cityBike' },
    ],
    needsHelmet: true,
    needsLock: true,
    deliveryToHotel: true,
    specialRequests: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Calculate rental days
  const rentalDays = useMemo(() => {
    if (!formData.startDate || !formData.endDate) return 1;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(1, diffDays + 1);
  }, [formData.startDate, formData.endDate]);

  // Calculate counts from people array
  const adultCount = useMemo(
    () => formData.people.filter((p) => p.type === 'adult').length,
    [formData.people]
  );

  const childCount = useMemo(
    () => formData.people.filter((p) => p.type === 'child').length,
    [formData.people]
  );

  const totalParticipants = formData.people.length;

  // Calculate selected bikes summary from people
  const selectedBikes = useMemo(() => {
    const bikes: Record<string, number> = {};
    formData.people.forEach((person) => {
      if (person.selectedBike) {
        bikes[person.selectedBike] = (bikes[person.selectedBike] || 0) + 1;
      }
    });
    return bikes;
  }, [formData.people]);

  // Auto-apply selected bike when form opens with a specific bike
  useEffect(() => {
    if (showBookingForm && selectedBikeType && formData.people.length === 2) {
      // Auto-assign the selected bike to the first adult
      setFormData((prev) => ({
        ...prev,
        people: prev.people.map((person, index) =>
          index === 0 && person.type === 'adult'
            ? { ...person, selectedBike: selectedBikeType }
            : person
        ),
      }));
    }
  }, [showBookingForm, selectedBikeType]);

  // Calculate total price
  const calculatePrice = useMemo(() => {
    let total = 0;

    // Calculate bike rental costs from people
    formData.people.forEach((person) => {
      const bike = BIKE_TYPES.find((b) => b.id === person.selectedBike);
      if (bike) {
        total += bike.price * rentalDays;
      }
    });

    if (formData.deliveryToHotel && formData.location !== 'Hotel pickup') {
      total += 10;
    }

    return total;
  }, [
    formData.people,
    formData.deliveryToHotel,
    formData.location,
    rentalDays,
  ]);

  // Get recommended bike for child based on age
  const getRecommendedBike = (age: number): string => {
    const suitableBike = BIKE_TYPES.find(
      (bike) => age >= bike.minAge && age <= bike.maxAge
    );
    return suitableBike?.id || 'kids-bike';
  };

  // Handle bike selection - now opens form and sets first person's bike
  const handleBikeSelect = useCallback((bikeId: string) => {
    setSelectedBikeType(bikeId);
    setShowBookingForm(true);

    // Set the selected bike for the first adult
    setFormData((prev) => ({
      ...prev,
      people: prev.people.map((person, index) =>
        index === 0 && person.type === 'adult'
          ? { ...person, selectedBike: bikeId }
          : person
      ),
    }));
  }, []);

  // Form handlers
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = 'checked' in e.target ? e.target.checked : false;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Add person (adult or child)
  const addPerson = (type: 'adult' | 'child') => {
    const newId = `${type}-${Date.now()}`;
    const newPerson: Person = {
      id: newId,
      type,
      selectedBike: type === 'adult' ? 'cityBike' : 'kids-bike',
      ...(type === 'child' && { age: 8 }),
    };

    setFormData((prev) => ({
      ...prev,
      people: [...prev.people, newPerson],
    }));
  };

  // Remove person
  const removePerson = (personId: string) => {
    setFormData((prev) => ({
      ...prev,
      people: prev.people.filter((p) => p.id !== personId),
    }));
  };

  // Update person data
  const updatePerson = (personId: string, updates: Partial<Person>) => {
    setFormData((prev) => ({
      ...prev,
      people: prev.people.map((person) =>
        person.id === personId ? { ...person, ...updates } : person
      ),
    }));

    // Clear related errors
    const personIndex = formData.people.findIndex((p) => p.id === personId);
    if (personIndex !== -1) {
      setErrors((prev) => ({
        ...prev,
        [`person-${personIndex}-age`]: '',
        [`person-${personIndex}-bike`]: '',
      }));
    }
  };

  // Handle child age change with bike recommendation
  const handleChildAgeChange = (personId: string, age: number) => {
    const recommendedBike = getRecommendedBike(age);
    updatePerson(personId, { age, selectedBike: recommendedBike });
  };

  // Validation and submission
  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (!formData.location) newErrors.location = 'Location is required';

    if (formData.startDate && formData.endDate) {
      if (new Date(formData.endDate) < new Date(formData.startDate)) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    if (formData.people.length < 1) {
      newErrors.people = 'At least one participant is required';
    }

    formData.people.forEach((person, index) => {
      if (person.type === 'child') {
        if (!person.age || person.age < 4 || person.age > 17) {
          newErrors[`person-${index}-age`] =
            'Child age must be between 4 and 17';
        }
      }
      if (!person.selectedBike) {
        newErrors[`person-${index}-bike`] =
          'Please select a bike for this person';
      }
    });

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const bookingStartDate = new Date(
        `${formData.startDate}T${formData.startTime}`
      );
      const bookingEndDate = new Date(
        `${formData.endDate}T${formData.endTime}`
      );

      const reservationData = {
        service: service || {
          id: 'bike-rental',
          name: 'Bike Rental',
          category: 'Transportation',
          type: 'bike-rental',
        },
        formData: {
          ...formData,
          serviceType: 'bike-rental',
          totalPrice: calculatePrice,
          rentalDays,
          selectedBikes,
          // Format people for payment display
          peopleDetails: formData.people.map((person) => {
            const bike = BIKE_TYPES.find((b) => b.id === person.selectedBike);
            return {
              id: person.id,
              type: person.type,
              age: person.age,
              bikeName: bike?.name || 'Unknown Bike',
              bikePrice: bike?.price || 0,
              displayName:
                person.type === 'adult'
                  ? `Adult - ${bike?.name || 'Unknown Bike'}`
                  : `Child (${person.age} years) - ${
                      bike?.name || 'Unknown Bike'
                    }`,
            };
          }),
        },
        totalPrice: calculatePrice,
        bookingDate: bookingStartDate,
        endDate: bookingEndDate,
        participants: {
          adults: adultCount,
          children: childCount,
          total: totalParticipants,
          // Add formatted list for display
          list: formData.people.map((person) => {
            const bike = BIKE_TYPES.find((b) => b.id === person.selectedBike);
            return person.type === 'adult'
              ? `Adult with ${bike?.name || 'Unknown Bike'}`
              : `Child (${person.age} years) with ${
                  bike?.name || 'Unknown Bike'
                }`;
          }),
        },
        selectedItems: Object.entries(selectedBikes)
          .filter(([_, count]) => count > 0)
          .map(([bikeId, count]) => {
            const bike = BIKE_TYPES.find((b) => b.id === bikeId);
            return {
              id: bikeId,
              name: bike?.name || 'Unknown Bike',
              quantity: count,
              price: bike?.price || 0,
              totalPrice: (bike?.price || 0) * count * rentalDays,
            };
          }),
        clientInfo: undefined,
      };

      console.log(
        '🚴 BikeRentalServiceView - Reservation data created:',
        reservationData
      );

      setReservationData(reservationData);
      router.push('/reservation-confirmation');
    } catch (error) {
      console.error('❌ BikeRentalServiceView - Error submitting form:', error);
      setErrors({
        submit: t('form.errors.submitError', {
          fallback: 'Failed to submit reservation. Please try again.',
        }),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Enhanced Person Card Component
  const PersonCard = ({ person, index }: { person: Person; index: number }) => {
    const selectedBikeData = BIKE_TYPES.find(
      (b) => b.id === person.selectedBike
    );
    const isChild = person.type === 'child';
    const canRemove = formData.people.length > 1;

    return (
      <motion.div
        className='bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden'
        variants={slideIn}
        whileHover={{ y: -4 }}
      >
        {/* Decorative background element */}
        <div className='absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full -mr-10 -mt-10 opacity-50' />

        <div className='flex items-start justify-between mb-4 relative z-10'>
          <div className='flex items-center'>
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center mr-3 ${
                isChild
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                  : 'bg-gradient-to-r from-green-500 to-emerald-500'
              }`}
            >
              {isChild ? (
                <Baby className='w-6 h-6 text-white' />
              ) : (
                <User className='w-6 h-6 text-white' />
              )}
            </div>
            <div>
              <h4 className='font-bold text-gray-800 text-lg'>
                {isChild ? `Child ${index + 1}` : `Adult ${index + 1}`}
              </h4>
              <p className='text-sm text-gray-500 font-medium'>
                {isChild ? '4-17 years old' : '18+ years old'}
              </p>
            </div>
          </div>

          {canRemove && (
            <button
              type='button'
              onClick={() => removePerson(person.id)}
              className='w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-700 transition-colors flex items-center justify-center'
              title='Remove person'
            >
              <X className='w-4 h-4' />
            </button>
          )}
        </div>

        {/* Age selector for children */}
        {isChild && (
          <div className='mb-4'>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>
              <span className='flex items-center'>
                <span className='w-2 h-2 bg-blue-500 rounded-full mr-2'></span>
                Age *
              </span>
            </label>
            <select
              value={person.age || 8}
              onChange={(e) =>
                handleChildAgeChange(person.id, parseInt(e.target.value))
              }
              className={`w-full p-3 border-2 ${
                errors[`person-${index}-age`]
                  ? 'border-red-500'
                  : 'border-gray-300'
              } rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white font-medium`}
            >
              {Array.from({ length: 14 }, (_, i) => i + 4).map((age) => (
                <option key={age} value={age}>
                  {age} years old
                </option>
              ))}
            </select>
            {errors[`person-${index}-age`] && (
              <p className='text-red-500 text-xs mt-1 font-medium'>
                {errors[`person-${index}-age`]}
              </p>
            )}
          </div>
        )}

        {/* Bike selection */}
        <div className='mb-4'>
          <label className='block text-sm font-semibold text-gray-700 mb-3'>
            <span className='flex items-center'>
              <Bike className='w-4 h-4 mr-2 text-green-600' />
              Choose Your Bike *
            </span>
          </label>
          <select
            value={person.selectedBike}
            onChange={(e) =>
              updatePerson(person.id, { selectedBike: e.target.value })
            }
            className={`w-full p-3 border-2 ${
              errors[`person-${index}-bike`]
                ? 'border-red-500'
                : 'border-gray-300'
            } rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-white font-medium`}
          >
            <option value=''>🚲 Select your perfect ride...</option>
            {BIKE_TYPES.filter((bike) => {
              if (isChild && person.age) {
                return person.age >= bike.minAge && person.age <= bike.maxAge;
              }
              return !isChild ? bike.id !== 'kids-bike' : true;
            }).map((bike) => (
              <option key={bike.id} value={bike.id}>
                {bike.icon} {bike.name} - ${bike.price}/day
                {bike.isPremium && ' ✨ Premium'}
              </option>
            ))}
          </select>
          {errors[`person-${index}-bike`] && (
            <p className='text-red-500 text-xs mt-1 font-medium'>
              {errors[`person-${index}-bike`]}
            </p>
          )}
        </div>

        {/* Selected bike preview */}
        {selectedBikeData && (
          <motion.div
            className='p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl'
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className='flex items-center justify-between mb-3'>
              <div className='flex items-center'>
                <span className='text-2xl mr-3'>{selectedBikeData.icon}</span>
                <div>
                  <p className='font-bold text-gray-800'>
                    {selectedBikeData.name}
                  </p>
                  <p className='text-sm text-gray-600'>
                    {selectedBikeData.ageRange}
                  </p>
                </div>
              </div>
              <div className='text-right'>
                <p className='font-bold text-green-600 text-xl'>
                  ${selectedBikeData.price}/day
                </p>
                {rentalDays > 1 && (
                  <p className='text-sm text-gray-600 font-medium'>
                    Total: ${selectedBikeData.price * rentalDays}
                  </p>
                )}
                {selectedBikeData.isPremium && (
                  <div className='inline-flex items-center px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full mt-1'>
                    <Sparkles className='w-3 h-3 mr-1' />
                    Premium
                  </div>
                )}
              </div>
            </div>

            <p className='text-sm text-gray-700 mb-3 leading-relaxed'>
              {selectedBikeData.description}
            </p>

            <div className='flex flex-wrap gap-2'>
              {selectedBikeData.features.slice(0, 3).map((feature, i) => (
                <span
                  key={i}
                  className='text-xs bg-white px-3 py-1 rounded-full border border-green-200 text-gray-700 font-medium'
                >
                  {feature}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    );
  };

  return (
    <div className='max-w-8xl mx-auto space-y-16'>
      {/* Hero Section - FIXED: Separated background properties */}
      <motion.div
        className='relative overflow-hidden w-full my-6 sm:my-8 lg:my-12'
        style={{
          backgroundColor: '#111827',
          backgroundImage:
            'linear-gradient(135deg, #111827 0%, #1f2937 50%, #000000 100%)',
        }}
        initial='hidden'
        animate='visible'
        variants={fadeInUp}
      >
        <div className='absolute inset-0 opacity-30'>
          <Image
            src='https://images.pexels.com/photos/1457018/pexels-photo-1457018.jpeg?_gl=1*9qjvnj*_ga*MTQzOTE0OTkxMS4xNzUzMjcxMDk0*_ga_8JE65Q40S6*czE3NTM3OTg1NjgkbzgkZzEkdDE3NTM4MDA3NzMkajMxJGwwJGgw'
            alt='Bike rental adventure'
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>

        <div className='absolute inset-0 bg-black/20 z-[1]' />
        <div
          className='absolute inset-0 z-[2]'
          style={{
            backgroundImage:
              'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%, rgba(0,0,0,0.2) 100%)',
          }}
        />

        <div className='relative z-10 px-4 sm:px-6 lg:px-8 xl:px-12 py-8 sm:py-12 lg:py-16 xl:py-20 text-white'>
          <div className='max-w-7xl mx-auto space-y-6 sm:space-y-8 lg:space-y-10'>
            <motion.div
              className='inline-flex items-center bg-white/10 backdrop-blur-sm px-3 py-2 sm:px-4 sm:py-2 rounded-full border border-white/20'
              variants={fadeInUp}
            >
              <Bike className='w-4 h-4 sm:w-5 sm:h-5 text-white mr-2' />
              <span className='text-white font-medium text-sm sm:text-base'>
                Your Ride. Your Freedom.
              </span>
            </motion.div>

            <motion.h1
              className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight max-w-4xl'
              variants={fadeInUp}
            >
              Bike Rental
              <br />
              <span className='text-gray-300 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl'>
                Explore At Your Own Pace
              </span>
            </motion.h1>

            <motion.p
              className='text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-gray-300 max-w-4xl leading-relaxed'
              variants={fadeInUp}
            >
              Discover Punta Cana like a local with our high-quality bikes,
              delivered straight to your accommodation. Whether you're cruising
              along the coast or exploring hidden paths, our bikes are
              maintained to the highest standard for a smooth and safe ride.
            </motion.p>
          </div>
        </div>
      </motion.div>

      {/* Bike Selection */}
      <motion.div
        className='px-6 py-8'
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true }}
        variants={stagger}
      >
        <div className='text-center mb-12'>
          <motion.h2
            className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'
            variants={fadeInUp}
          >
            Choose Your Perfect Ride
          </motion.h2>
          <motion.p className='text-xl text-gray-600' variants={fadeInUp}>
            {!showBookingForm
              ? '🏖️ Beach Cruisers | 🏙️ City Bikes | 🏔️ Mountain Bikes | ⚡ E-Bikes | 👶 Kids Bikes - Click to start your adventure!'
              : '✨ Click on additional bikes to add them to your selection'}
          </motion.p>
        </div>

        <motion.div
          className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'
          variants={stagger}
        >
          {BIKE_TYPES.map((bike, index) => {
            const isSelected = selectedBikes[bike.id] > 0;
            const quantity = selectedBikes[bike.id] || 0;

            return (
              <motion.div
                key={bike.id}
                className={`bg-white rounded-3xl shadow-sm border-2 cursor-pointer transition-all duration-500 overflow-hidden relative group ${
                  isSelected
                    ? 'border-green-500 shadow-xl ring-4 ring-green-100'
                    : 'border-gray-100 hover:border-gray-300 hover:shadow-lg'
                }`}
                onClick={() => handleBikeSelect(bike.id)}
                variants={fadeInUp}
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className='relative h-56'>
                  <Image
                    src={bike.image}
                    alt={bike.name}
                    fill
                    style={{ objectFit: 'cover' }}
                  />

                  {/* Overlay effects */}
                  <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />

                  {bike.isPremium && (
                    <div className='absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center shadow-lg'>
                      <Sparkles className='w-3 h-3 mr-1' />
                      Premium
                    </div>
                  )}

                  {isSelected && (
                    <motion.div
                      className='absolute top-4 left-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center shadow-lg'
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: 'spring',
                        stiffness: 500,
                        damping: 30,
                      }}
                    >
                      <CheckCircle className='w-4 h-4 mr-1' />
                      {quantity} Selected
                    </motion.div>
                  )}

                  {showBookingForm && !isSelected && (
                    <motion.div
                      className='absolute top-4 left-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity'
                      whileHover={{ scale: 1.1 }}
                    >
                      <Plus className='w-4 h-4 mr-1' />
                      Add to Selection
                    </motion.div>
                  )}
                </div>

                <div className='p-6'>
                  <div className='flex items-center justify-between mb-4'>
                    <h3 className='text-xl font-bold text-gray-900 flex items-center'>
                      <span className='text-2xl mr-2'>{bike.icon}</span>
                      {bike.name}
                    </h3>
                    <div className='text-right'>
                      <div className='text-2xl font-bold text-gray-900'>
                        ${bike.price}
                      </div>
                      <div className='text-sm text-gray-500 font-medium'>
                        per day
                      </div>
                    </div>
                  </div>

                  <p className='text-gray-600 mb-4 text-sm leading-relaxed'>
                    {bike.description}
                  </p>

                  <div className='space-y-2'>
                    {bike.features.slice(0, 2).map((feature, idx) => (
                      <div
                        key={idx}
                        className='flex items-center text-sm text-gray-600'
                      >
                        <div className='w-2 h-2 bg-green-500 rounded-full mr-3'></div>
                        {feature}
                      </div>
                    ))}
                  </div>

                  {/* Hover effect button */}
                  <div className='mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                    <div className='w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white text-center py-2 rounded-lg font-medium'>
                      {isSelected
                        ? `Selected (${quantity})`
                        : 'Select This Bike'}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>

      {/* Enhanced Inline Booking Form */}
      <AnimatePresence>
        {showBookingForm && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -50 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -50 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className='overflow-hidden'
          >
            <div className='bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl border border-gray-200 p-8 mx-6 relative overflow-hidden'>
              {/* Decorative background elements */}
              <div className='absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full -mr-20 -mt-20 opacity-30' />
              <div className='absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-green-100 to-emerald-100 rounded-full -ml-16 -mb-16 opacity-30' />

              <div className='relative z-10'>
                <div className='flex items-center justify-between mb-8'>
                  <div>
                    <h3 className='text-3xl font-bold text-gray-900 mb-2 flex items-center'>
                      <Sparkles className='w-8 h-8 mr-3 text-purple-600' />
                      Complete Your Booking
                    </h3>
                    <p className='text-gray-600 text-lg'>
                      First selection:{' '}
                      <span className='font-semibold text-green-600'>
                        {
                          BIKE_TYPES.find((b) => b.id === selectedBikeType)
                            ?.name
                        }
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={() => setShowBookingForm(false)}
                    className='w-12 h-12 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center group'
                  >
                    <X className='w-6 h-6 text-gray-500 group-hover:text-gray-700' />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className='space-y-10'>
                  {/* Rental Period */}
                  <motion.div className='space-y-6' variants={fadeInUp}>
                    <h4 className='text-xl font-bold text-gray-800 pb-3 border-b-2 border-green-200 flex items-center'>
                      <Calendar className='w-6 h-6 mr-3 text-green-600' />
                      📅 When do you want to ride?
                    </h4>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      <div>
                        <label className='flex items-center text-sm font-bold text-gray-700 mb-3'>
                          <div className='w-3 h-3 bg-green-500 rounded-full mr-2'></div>
                          Start Date *
                        </label>
                        <input
                          type='date'
                          name='startDate'
                          value={formData.startDate}
                          onChange={handleInputChange}
                          className={`w-full p-4 border-2 ${
                            errors.startDate
                              ? 'border-red-500'
                              : 'border-gray-300'
                          } rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-white text-lg font-medium`}
                          min={new Date().toISOString().split('T')[0]}
                        />
                        {errors.startDate && (
                          <p className='text-red-500 text-sm mt-2 font-medium'>
                            {errors.startDate}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className='flex items-center text-sm font-bold text-gray-700 mb-3'>
                          <div className='w-3 h-3 bg-blue-500 rounded-full mr-2'></div>
                          End Date *
                        </label>
                        <input
                          type='date'
                          name='endDate'
                          value={formData.endDate}
                          onChange={handleInputChange}
                          className={`w-full p-4 border-2 ${
                            errors.endDate
                              ? 'border-red-500'
                              : 'border-gray-300'
                          } rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-lg font-medium`}
                          min={
                            formData.startDate ||
                            new Date().toISOString().split('T')[0]
                          }
                        />
                        {errors.endDate && (
                          <p className='text-red-500 text-sm mt-2 font-medium'>
                            {errors.endDate}
                          </p>
                        )}
                      </div>
                    </div>

                    {formData.startDate && formData.endDate && (
                      <motion.div
                        className='p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl'
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        <p className='text-green-800 font-bold text-lg flex items-center'>
                          <CheckCircle className='w-5 h-5 mr-2' />
                          Adventure Duration: {rentalDays}{' '}
                          {rentalDays === 1 ? 'day' : 'days'} 🚴‍♂️
                        </p>
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Location */}
                  <motion.div className='space-y-6' variants={fadeInUp}>
                    <h4 className='text-xl font-bold text-gray-800 pb-3 border-b-2 border-blue-200 flex items-center'>
                      <MapPin className='w-6 h-6 mr-3 text-blue-600' />
                      📍 Where should we deliver?
                    </h4>

                    <div>
                      <label className='flex items-center text-sm font-bold text-gray-700 mb-3'>
                        <Truck className='w-4 h-4 mr-2 text-green-600' />
                        Delivery Address *
                      </label>
                      <input
                        type='text'
                        name='location'
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder='🏨 Hotel name, resort, or complete address in Punta Cana...'
                        className={`w-full p-4 border-2 ${
                          errors.location ? 'border-red-500' : 'border-gray-300'
                        } rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-white text-lg`}
                      />
                      {errors.location && (
                        <p className='text-red-500 text-sm mt-2 font-medium'>
                          {errors.location}
                        </p>
                      )}
                    </div>
                  </motion.div>

                  {/* Participants - REFACTORED */}
                  <motion.div className='space-y-8' variants={fadeInUp}>
                    <div className='flex items-center justify-between'>
                      <h4 className='text-xl font-bold text-gray-800 pb-3 border-b-2 border-purple-200 flex items-center flex-grow'>
                        <Users className='w-6 h-6 mr-3 text-purple-600' />
                        👥 Who's joining the adventure?
                      </h4>
                      <div className='ml-6 text-lg font-bold text-gray-600'>
                        {totalParticipants}{' '}
                        {totalParticipants === 1 ? 'person' : 'people'}
                      </div>
                    </div>

                    {/* People Cards */}
                    <motion.div
                      className='grid grid-cols-1 lg:grid-cols-2 gap-6'
                      variants={stagger}
                    >
                      {formData.people.map((person, index) => (
                        <PersonCard
                          key={person.id}
                          person={person}
                          index={index}
                        />
                      ))}
                    </motion.div>

                    {/* Add Person Buttons */}
                    <div className='flex flex-wrap gap-4 justify-center'>
                      <motion.button
                        type='button'
                        onClick={() => addPerson('adult')}
                        className='flex items-center px-6 py-3 border-3 border-dashed border-green-300 text-green-700 rounded-2xl hover:border-green-400 hover:bg-green-50 transition-all duration-300 font-bold text-lg'
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Plus className='w-5 h-5 mr-2' />
                        👨 Add Adult
                      </motion.button>

                      <motion.button
                        type='button'
                        onClick={() => addPerson('child')}
                        className='flex items-center px-6 py-3 border-3 border-dashed border-blue-300 text-blue-700 rounded-2xl hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 font-bold text-lg'
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Plus className='w-5 h-5 mr-2' />
                        👶 Add Child
                      </motion.button>
                    </div>

                    {errors.people && (
                      <p className='text-red-500 text-center font-bold'>
                        {errors.people}
                      </p>
                    )}
                  </motion.div>

                  {/* Booking Summary */}
                  {totalParticipants > 0 && (
                    <motion.div
                      className='bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 border-2 border-gray-200'
                      variants={fadeInUp}
                    >
                      <h4 className='font-bold text-gray-800 mb-4 text-xl flex items-center'>
                        <Heart className='w-6 h-6 mr-2 text-red-500' />
                        📋 Your Adventure Summary
                      </h4>
                      <div className='grid grid-cols-2 gap-4 text-lg'>
                        <div className='flex justify-between font-medium'>
                          <span>👨 Adults:</span>
                          <span className='text-green-600 font-bold'>
                            {adultCount}
                          </span>
                        </div>
                        <div className='flex justify-between font-medium'>
                          <span>👶 Children:</span>
                          <span className='text-blue-600 font-bold'>
                            {childCount}
                          </span>
                        </div>
                        <div className='col-span-2 border-t-2 border-gray-300 pt-3 mt-2'>
                          <div className='flex justify-between font-bold text-xl'>
                            <span>🚴‍♂️ Total Riders:</span>
                            <span className='text-purple-600'>
                              {totalParticipants}
                            </span>
                          </div>
                        </div>

                        {/* Bike breakdown */}
                        <div className='col-span-2 mt-4 space-y-2'>
                          <h5 className='font-semibold text-gray-700 mb-2'>
                            🚲 Selected Bikes:
                          </h5>
                          {Object.entries(selectedBikes).map(
                            ([bikeType, count]) => {
                              const bike = BIKE_TYPES.find(
                                (b) => b.id === bikeType
                              );
                              if (!bike || count === 0) return null;
                              return (
                                <div
                                  key={bikeType}
                                  className='flex justify-between text-sm bg-white p-2 rounded-lg'
                                >
                                  <span className='flex items-center'>
                                    <span className='mr-2'>{bike.icon}</span>
                                    {bike.name}
                                  </span>
                                  <span className='font-bold text-green-600'>
                                    {count} × ${bike.price} = $
                                    {bike.price * count * rentalDays}
                                  </span>
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Safety Information */}
                  <motion.div
                    className='bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6'
                    variants={fadeInUp}
                  >
                    <div className='flex items-start'>
                      <AlertTriangle className='w-8 h-8 text-amber-600 mr-4 flex-shrink-0 mt-1' />
                      <div>
                        <h4 className='font-bold text-amber-800 mb-3 text-xl'>
                          🛡️ Safety First - Your Adventure Guidelines
                        </h4>
                        <ul className='text-amber-700 space-y-2 font-medium'>
                          <li className='flex items-center'>
                            <Shield className='w-4 h-4 mr-2' />• Helmets are
                            strongly recommended and provided FREE! 🪖
                          </li>
                          <li className='flex items-center'>
                            <Users className='w-4 h-4 mr-2' />• Children under
                            16 must be accompanied by an adult 👨‍👩‍👧‍👦
                          </li>
                          <li className='flex items-center'>
                            <AlertTriangle className='w-4 h-4 mr-2' />• Please
                            follow all local traffic regulations 🚦
                          </li>
                          <li className='flex items-center'>
                            <CheckCircle className='w-4 h-4 mr-2' />• Rental
                            includes basic insurance coverage 📋
                          </li>
                        </ul>
                      </div>
                    </div>
                  </motion.div>

                  {/* Error Display */}
                  {errors.submit && (
                    <motion.div
                      className='p-4 bg-red-50 border-2 border-red-200 rounded-xl'
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <p className='text-red-800 font-medium'>
                        {errors.submit}
                      </p>
                    </motion.div>
                  )}

                  {/* Enhanced Footer with Price and Actions */}
                  <motion.div
                    className='bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white p-8 rounded-2xl flex flex-col lg:flex-row items-center justify-between shadow-2xl'
                    variants={fadeInUp}
                  >
                    <div className='flex flex-col items-center lg:items-start mb-6 lg:mb-0'>
                      <span className='text-gray-300 text-sm uppercase tracking-wider font-bold mb-2'>
                        🏷️ Total Adventure Cost
                      </span>
                      <div className='flex items-center mb-3'>
                        <span className='text-4xl lg:text-5xl font-light'>
                          ${calculatePrice.toFixed(2)}
                        </span>
                        {rentalDays > 1 && (
                          <span className='ml-3 text-sm bg-green-600 px-3 py-1 rounded-full font-bold'>
                            {rentalDays} days
                          </span>
                        )}
                      </div>

                      {/* Enhanced Price breakdown */}
                      <div className='text-xs text-gray-300 space-y-1 max-w-md'>
                        {Object.entries(selectedBikes).map(
                          ([bikeType, count]) => {
                            if (count === 0) return null;
                            const bike = BIKE_TYPES.find(
                              (b) => b.id === bikeType
                            );
                            if (!bike) return null;
                            return (
                              <div
                                key={bikeType}
                                className='flex justify-between'
                              >
                                <span>
                                  {bike.icon} {bike.name}:
                                </span>
                                <span className='font-medium'>
                                  {count} × ${bike.price} × {rentalDays} days =
                                  ${bike.price * count * rentalDays}
                                </span>
                              </div>
                            );
                          }
                        )}
                        <div className='text-green-400 font-medium pt-2 border-t border-gray-600'>
                          🚚 Delivery & pickup: FREE! 🎁 Helmet & locks: FREE!
                        </div>
                      </div>
                    </div>

                    <div className='flex space-x-4'>
                      <motion.button
                        type='button'
                        onClick={() => setShowBookingForm(false)}
                        className='px-6 py-4 border-2 border-gray-600 rounded-xl text-gray-300 hover:text-white hover:border-gray-500 transition-colors font-bold'
                        disabled={isSubmitting}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        ❌ Cancel
                      </motion.button>

                      <motion.button
                        type='submit'
                        disabled={isSubmitting}
                        className='px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl transition-all flex items-center disabled:opacity-50 font-bold text-lg shadow-lg'
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <CreditCard className='h-5 w-5 mr-2' />
                        {isSubmitting
                          ? '⏳ Booking...'
                          : '🚴‍♂️ Book My Adventure!'}
                      </motion.button>
                    </div>
                  </motion.div>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rest of the component remains the same but with enhanced styling */}
      {/* What to Expect */}
      <motion.div
        className='bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-8 md:p-12 border border-gray-200'
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className='text-center mb-12'>
          <h2 className='text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center'>
            <Sparkles className='w-8 h-8 mr-3 text-purple-600' />
            What to Expect
          </h2>
          <p className='text-xl text-gray-600 mb-4'>
            Our bike rentals are not just convenient—they're an invitation to
            adventure. With flexible rental times, personalized tips, and
            reliable service, you'll have everything you need for a memorable
            ride. We make it easy, fun, and fully adapted to your schedule.
          </p>
          <p className='text-lg text-gray-700 font-medium italic'>
            Let the journey begin—on two wheels. 🚴‍♀️✨
          </p>
        </div>

        <div className='grid md:grid-cols-4 gap-8'>
          {PROCESS_STEPS.map((step, index) => (
            <motion.div
              key={index}
              className='text-center group'
              variants={fadeInUp}
              whileHover={{ y: -4 }}
            >
              <div className='relative mb-6'>
                <div className='w-20 h-20 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-2xl flex items-center justify-center mx-auto font-bold text-2xl shadow-lg group-hover:shadow-xl transition-shadow'>
                  {step.step}
                </div>
                {index < PROCESS_STEPS.length - 1 && (
                  <div className='hidden md:block absolute top-10 left-1/2 w-full h-1 bg-gradient-to-r from-gray-300 to-blue-300 -z-10 rounded'></div>
                )}
              </div>
              <div className='mb-4'>
                <step.icon className='w-10 h-10 text-gray-600 mx-auto group-hover:text-blue-600 transition-colors' />
              </div>
              <p className='text-gray-700 font-medium'>{step.text}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* What's Included - Enhanced */}
      <motion.div
        className='grid md:grid-cols-2 gap-12 px-6 py-8'
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true }}
        variants={stagger}
      >
        <motion.div variants={fadeInUp}>
          <h2 className='text-3xl font-bold text-gray-900 mb-8 flex items-center'>
            <CheckCircle className='w-8 h-8 mr-3 text-green-600' />
            What's Included
          </h2>
          <div className='space-y-6'>
            {INCLUDED_ITEMS.map((item, index) => (
              <motion.div
                key={index}
                className='flex items-center group'
                whileHover={{ x: 4 }}
              >
                <div className='w-14 h-14 bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mr-4 group-hover:shadow-md transition-shadow'>
                  <item.icon className='w-7 h-7 text-green-600' />
                </div>
                <span className='text-lg text-gray-700 font-medium'>
                  {item.text}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Not Included Section */}
          <div className='mt-8'>
            <h3 className='text-xl font-bold text-gray-900 mb-4 flex items-center'>
              <X className='w-6 h-6 text-red-500 mr-2' />
              Not Included
            </h3>
            <div className='space-y-4'>
              {NOT_INCLUDED_ITEMS.map((item, index) => (
                <motion.div
                  key={index}
                  className='flex items-center group'
                  whileHover={{ x: 4 }}
                >
                  <div className='w-14 h-14 bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl flex items-center justify-center mr-4'>
                    <item.icon className='w-7 h-7 text-red-600' />
                  </div>
                  <span className='text-lg text-gray-700 font-medium'>
                    {item.text}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Enhanced Info Sections */}
          <div className='mt-8 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-200'>
            <h3 className='font-bold text-blue-800 mb-4 flex items-center text-lg'>
              <Info className='w-6 h-6 mr-2' />
              🌟 Good to Know
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-700'>
              <div className='bg-white/60 p-3 rounded-lg'>
                <div className='flex items-center mb-2 font-semibold'>
                  <Calendar className='w-4 h-4 mr-2' />
                  Start & End Time:
                </div>
                <p className='text-sm ml-6'>
                  According to your booking schedule
                </p>
              </div>
              <div className='bg-white/60 p-3 rounded-lg'>
                <div className='flex items-center mb-2 font-semibold'>
                  <Baby className='w-4 h-4 mr-2' />
                  Age Policy:
                </div>
                <p className='text-sm ml-6'>
                  Children's bikes available 4-17 years
                </p>
              </div>
              <div className='md:col-span-2 bg-white/60 p-3 rounded-lg'>
                <div className='flex items-center mb-2 font-semibold'>
                  <MapPin className='w-4 h-4 mr-2' />
                  Delivery Zone:
                </div>
                <p className='text-sm ml-6'>
                  Available throughout Punta Cana area - FREE delivery!
                </p>
              </div>
            </div>
          </div>

          <div className='mt-6 p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-200'>
            <h3 className='font-bold text-amber-800 mb-3 flex items-center text-lg'>
              <AlertTriangle className='w-6 h-6 mr-2' />
              🛡️ Safety Disclaimer
            </h3>
            <p className='text-amber-700 font-medium'>
              For your safety, we recommend wearing a helmet and following all
              local traffic regulations.
              <strong> Your Safety, Your Responsibility.</strong>
            </p>
          </div>
        </motion.div>

        <motion.div
          className='relative h-96 rounded-3xl overflow-hidden shadow-lg'
          variants={fadeInUp}
        >
          <Image
            src='https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&q=80&w=600'
            alt='Bike rental experience'
            fill
            style={{ objectFit: 'cover' }}
          />
          <div className='absolute inset-0 bg-gradient-to-t from-black/40 to-transparent' />
          <div className='absolute bottom-6 left-6 text-white'>
            <h3 className='text-2xl font-bold mb-2'>
              Your Adventure Awaits! 🌴
            </h3>
            <p className='text-lg opacity-90'>
              Premium bikes, delivered with care
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Enhanced Testimonial */}
      <motion.div
        className='bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-lg border border-gray-100 p-8 md:p-12 text-center'
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className='flex justify-center mb-6'>
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className='w-8 h-8 text-yellow-400 fill-current mx-1'
            />
          ))}
        </div>
        <blockquote className='text-2xl md:text-3xl font-medium text-gray-900 mb-6 italic leading-relaxed'>
          "Fantastic service! The bike was delivered on time and in perfect
          condition. Made exploring Punta Cana so much more enjoyable. 🚴‍♂️✨"
        </blockquote>
        <cite className='text-lg text-gray-600 font-medium'>
          - Marcus T., Satisfied Customer 🌟
        </cite>
      </motion.div>

      {/* Enhanced Features Grid */}
      <motion.div
        className='px-6 py-8'
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true }}
        variants={stagger}
      >
        <div className='text-center mb-12'>
          <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center'>
            <Heart className='w-8 h-8 mr-3 text-red-500' />
            Why Choose Our Bikes?
          </h2>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
            Premium quality, reliable service, and the freedom to explore 🌟
          </p>
        </div>

        <div className='grid md:grid-cols-3 gap-8'>
          {FEATURES.map((feature, index) => (
            <motion.div
              key={index}
              className='text-center p-8 bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow group'
              variants={fadeInUp}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <div
                className={`w-20 h-20 rounded-3xl ${feature.color} flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg transition-shadow`}
              >
                {feature.icon}
              </div>
              <h3 className='text-xl font-bold text-gray-900 mb-3'>
                {feature.title}
              </h3>
              <p className='text-gray-600 leading-relaxed'>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default BikeRentalServiceView;
