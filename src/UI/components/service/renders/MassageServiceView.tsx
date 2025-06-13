import React, { useState, useCallback } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { useRouter } from 'next/navigation';
import { Service } from '@/types/type';
import { ServiceData } from '@/types/services';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useReservation } from '@/context/BookingContext'; // Cambio: usar useReservation en lugar de useBooking
import { SPA_SERVICES } from '@/constants/spaServices';
import {
  Leaf,
  Clock,
  Star,
  ArrowRight,
  Shield,
  Heart,
  CheckCircle,
  Users,
  Timer,
  Phone,
  Calendar,
  Plus,
  Minus,
  X,
  Accessibility,
  Info,
  CreditCard,
  MapPin,
} from 'lucide-react';
import InlineBookingForm from '../../forms/massage/InlineBookingForm';

interface MassageServiceViewProps {
  service: Service;
  serviceData?: ServiceData;
  primaryColor?: string;
  viewContext?: 'standard-view' | 'premium-view';
}

const TIME_SLOTS = [
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
];

const MASSAGE_TYPES = SPA_SERVICES.massages;

// // Componente del formulario inline
// const InlineBookingForm = ({ selectedMassage, onCancel, onConfirm }) => {
//   const [selectedDuration, setSelectedDuration] = useState(
//     selectedMassage.durations[0]
//   );
//   const [date, setDate] = useState('');
//   const [time, setTime] = useState('');
//   const [location, setLocation] = useState('');
//   const [persons, setPersons] = useState(1);
//   const [specialNeeds, setSpecialNeeds] = useState('');
//   const [errors, setErrors] = useState({}); // Nuevo: estado para errores
//   const [isSubmitting, setIsSubmitting] = useState(false); // Nuevo: estado de carga

//   const totalPrice = selectedDuration.price * persons;
//   const isFormValid = date && time;

//   // Nuevo: validación del formulario
//   const validateForm = useCallback(() => {
//     const newErrors = {};
//     if (!date) newErrors.date = 'Date required';
//     if (!time) newErrors.time = 'Time required';
//     if (!location) newErrors.location = 'Address is required';
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   }, [date, time]);

//   // Corregido: manejar envío del formulario
//   const handleSubmit = useCallback(async () => {
//     if (!validateForm()) return;
//     setIsSubmitting(true);

//     try {
//       // Crear los datos de reserva en el formato correcto
//       const reservationData = {
//         service: selectedMassage,
//         formData: {
//           serviceId: selectedMassage.id,
//           serviceName: selectedMassage.name,
//           duration: selectedDuration.duration,
//           date,
//           time,
//           location,
//           persons,
//           specialNeeds,
//           calculatedPrice: totalPrice,
//         },
//         totalPrice,
//         bookingDate: new Date(),
//       };

//       onConfirm(reservationData);
//     } catch (error) {
//       console.error('Booking error:', error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   }, [
//     validateForm,
//     selectedMassage,
//     selectedDuration,
//     date,
//     time,
//     location,
//     persons,
//     specialNeeds,
//     totalPrice,
//     onConfirm,
//   ]);

//   return (
//     <motion.div
//       initial={{ opacity: 0, height: 0 }}
//       animate={{ opacity: 1, height: 'auto' }}
//       exit={{ opacity: 0, height: 0 }}
//       transition={{ duration: 0.5 }}
//       className='bg-white rounded-3xl shadow-2xl p-8 mt-8 border border-stone-200'
//       id='booking-form'
//     >
//       {/* Header */}
//       <div className='flex items-center justify-between mb-8 pb-6 border-b border-stone-200'>
//         <div className='flex items-center gap-4'>
//           <div className='w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center text-2xl'>
//             {selectedMassage.emoji}
//           </div>
//           <div>
//             <h3 className='text-2xl font-semibold text-stone-800 mb-1'>
//               Complete your {selectedMassage.name} booking
//             </h3>
//             <p className='text-stone-600'>{selectedMassage.description}</p>
//           </div>
//         </div>
//         <button
//           onClick={onCancel}
//           className='p-2 hover:bg-stone-100 rounded-lg transition-colors'
//         >
//           <X className='w-6 h-6 text-stone-600' />
//         </button>
//       </div>

//       <div className='space-y-8'>
//         {/* Duration Selection */}
//         <div>
//           <h4 className='text-lg font-semibold text-stone-800 mb-4 flex items-center gap-2'>
//             <Timer className='w-5 h-5  text-green-800' />
//             Treatment Duration
//           </h4>
//           <div
//             className={`grid gap-4 ${
//               selectedMassage.durations.length === 1
//                 ? 'grid-cols-1 max-w-sm'
//                 : selectedMassage.durations.length === 2
//                 ? 'grid-cols-2'
//                 : 'grid-cols-3'
//             }`}
//           >
//             {selectedMassage.durations.map((option, index) => (
//               <button
//                 key={option.duration}
//                 onClick={() => setSelectedDuration(option)}
//                 className={`p-4 rounded-xl border-2 transition-all text-left ${
//                   selectedDuration.duration === option.duration
//                     ? 'border-stone-800 bg-stone-50'
//                     : 'border-stone-200 hover:border-stone-300'
//                 }`}
//               >
//                 <div className='font-semibold text-stone-800'>
//                   {option.duration} minutes
//                 </div>
//                 <div className='text-xl font-bold text-stone-800 mt-1'>
//                   ${option.price}
//                 </div>
//                 {persons > 1 && (
//                   <div className='text-sm text-stone-500 mt-1'>
//                     ${option.price * persons} total
//                   </div>
//                 )}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Date & Time */}
//         <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
//           <div>
//             <label className='block text-lg font-semibold text-stone-800 mb-3 flex items-center gap-2'>
//               <Calendar className='w-5 h-5  text-green-800' />
//               Date
//             </label>
//             <input
//               type='date'
//               value={date}
//               onChange={(e) => {
//                 setDate(e.target.value);
//                 if (errors.date) setErrors((prev) => ({ ...prev, date: '' }));
//               }}
//               min={new Date().toISOString().split('T')[0]}
//               className={`w-full p-4 border-2 rounded-xl focus:ring-2 focus:ring-stone-500 focus:border-transparent text-lg transition-colors ${
//                 errors.date
//                   ? 'border-red-300 bg-red-50 focus:border-red-400'
//                   : 'border-stone-300'
//               }`}
//             />
//             {errors.date && (
//               <p className='text-red-500 text-sm mt-2'>{errors.date}</p>
//             )}
//           </div>

//           <div>
//             <label className='block text-lg font-semibold text-stone-800 mb-3 flex items-center gap-2'>
//               <Clock className='w-5 h-5' />
//               Time
//             </label>
//             <select
//               value={time}
//               onChange={(e) => {
//                 setTime(e.target.value);
//                 if (errors.time) setErrors((prev) => ({ ...prev, time: '' }));
//               }}
//               className={`w-full p-4 border-2 rounded-xl focus:ring-2 focus:ring-stone-500 focus:border-transparent text-lg transition-colors ${
//                 errors.time
//                   ? 'border-red-300 bg-red-50 focus:border-red-400'
//                   : 'border-stone-300'
//               }`}
//             >
//               <option value=''>Select time</option>
//               {TIME_SLOTS.map((slot) => (
//                 <option key={slot} value={slot}>
//                   {slot}
//                 </option>
//               ))}
//             </select>
//             {errors.time && (
//               <p className='text-red-500 text-sm mt-2'>{errors.time}</p>
//             )}
//           </div>
//         </div>

//         {/* Number of People */}
//         <div>
//           <label className='block text-lg font-semibold text-stone-800 mb-3 flex items-center gap-2'>
//             <Users className='w-5 h-5' />
//             Number of People
//           </label>
//           <div className='flex items-center justify-between bg-stone-50 rounded-xl p-4'>
//             <div className='flex items-center gap-4'>
//               <button
//                 onClick={() => setPersons(Math.max(1, persons - 1))}
//                 className='w-10 h-10 rounded-full bg-white border-2 border-stone-300 flex items-center justify-center hover:bg-stone-50 transition-colors'
//                 disabled={persons <= 1}
//               >
//                 <Minus className='w-5 h-5 text-stone-600' />
//               </button>
//               <span className='text-2xl font-semibold text-stone-800 w-12 text-center'>
//                 {persons}
//               </span>
//               <button
//                 onClick={() =>
//                   setPersons(Math.min(selectedMassage.maxPersons, persons + 1))
//                 }
//                 className='w-10 h-10 rounded-full bg-white border-2 border-stone-300 flex items-center justify-center hover:bg-stone-50 transition-colors'
//                 disabled={persons >= selectedMassage.maxPersons}
//               >
//                 <Plus className='w-5 h-5 text-stone-600' />
//               </button>
//             </div>
//             <span className='text-stone-600'>
//               Maximum: {selectedMassage.maxPersons} people
//             </span>
//           </div>
//         </div>
//         {/* Location */}
//         <div>
//           <label className='flex items-center text-sm font-medium  text-grey-800 mb-2'>
//             <MapPin className='w-4 h-4 mr-2 text-green-800' />
//             Address *
//           </label>
//           <input
//             name='location'
//             value={location}
//             onChange={(e) => setLocation(e.target.value)}
//             className={`w-full p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-stone-500 focus:border-transparent  ${
//               errors.location ? 'border-red-500' : 'border-gray-300'
//             } `}
//             placeholder='Please provide the complete address where the personal training will take place'
//           />
//           {errors.location && (
//             <p className='text-red-500 text-xs mt-1'>{errors.location}</p>
//           )}
//         </div>

//         {/* Special Needs & Disability */}
//         <div>
//           <label className='block text-lg font-semibold text-stone-800 mb-3 flex items-center gap-2'>
//             <Accessibility className='w-5 h-5' />
//             Special Needs & Disabilities
//           </label>
//           <textarea
//             value={specialNeeds}
//             onChange={(e) => setSpecialNeeds(e.target.value)}
//             placeholder='Please mention any medical conditions, disabilities, injuries, pregnancy, allergies, mobility restrictions, or special accommodations we should consider to personalize your experience safely...'
//             className='w-full p-4 border-2 border-stone-300 rounded-xl focus:ring-2 focus:ring-stone-500 focus:border-transparent resize-none h-32 text-lg'
//           />
//           <div className='flex items-start gap-2 mt-3 text-stone-600'>
//             <Info className='w-5 h-5 mt-0.5 flex-shrink-0' />
//             <p className='text-sm leading-relaxed'>
//               This information is confidential and helps us adapt the treatment
//               to your specific needs. Our therapists are trained to work with
//               various conditions and limitations.
//             </p>
//           </div>
//         </div>
//         {/* Price Summary */}
//         <div className='bg-gradient-to-r from-stone-800 to-stone-900 text-white rounded-2xl p-6'>
//           <div className='flex justify-between items-center'>
//             <div>
//               <h4 className='text-xl font-semibold mb-2'>Booking Summary</h4>
//               <div className='space-y-1 text-stone-300'>
//                 <div className='flex items-center gap-2'>
//                   <span className='text-lg'>{selectedMassage.emoji}</span>
//                   <span>{selectedMassage.name}</span>
//                 </div>
//                 <div>
//                   {selectedDuration.duration} minutes • {persons}{' '}
//                   {persons === 1 ? 'person' : 'people'}
//                 </div>
//                 {date && time && (
//                   <div>
//                     {new Date(date).toLocaleDateString()} at {time}
//                   </div>
//                 )}
//               </div>
//             </div>
//             <div className='text-right'>
//               <div className='text-3xl font-bold'>${totalPrice}</div>
//               <div className='text-stone-300'>Total Price</div>
//             </div>
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className='flex gap-4'>
//           <button
//             onClick={onCancel}
//             className='flex-1 py-4 border-2 border-stone-300 text-stone-700 rounded-xl hover:bg-stone-50 transition-colors font-semibold'
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSubmit}
//             disabled={!isFormValid || isSubmitting}
//             className={`flex-1 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
//               isFormValid && !isSubmitting
//                 ? 'bg-stone-800 text-white hover:bg-stone-700'
//                 : 'bg-stone-300 text-stone-500 cursor-not-allowed'
//             }`}
//           >
//             {isSubmitting ? (
//               <>
//                 <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white'></div>
//                 Processing...
//               </>
//             ) : (
//               <>
//                 <CreditCard className='w-5 h-5' />
//                 Confirm Booking
//                 <ArrowRight className='w-5 h-5' />
//               </>
//             )}
//           </button>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

const MassageServiceView = ({
  service,
  serviceData,
  primaryColor = 'stone',
  viewContext = 'standard-view',
}: MassageServiceViewProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { setReservationData } = useReservation();

  const [selectedMassage, setSelectedMassage] = useState(null);

  // Animaciones
  const fadeUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  const stagger = {
    visible: {
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  // Handlers
  const handleMassageSelect = useCallback((massage) => {
    setSelectedMassage(massage);
    setTimeout(() => {
      const formElement = document.getElementById('booking-form');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 200);
  }, []);

  const handleCancelBooking = useCallback(() => {
    console.log('Cancel booking called'); // Para debug

    // Limpiar el estado inmediatamente
    setSelectedMassage(null);

    // Opcional: scroll hacia arriba para mejor UX
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  }, []);

  // Corregido: manejar confirmación de reserva
  const handleConfirmBooking = useCallback(
    async (reservationData) => {
      try {
        console.log('Setting reservation data:', reservationData);

        // Establecer los datos de reserva en el contexto
        setReservationData(reservationData);

        // Navegar a la página de confirmación de reserva (proceso de pago)
        router.push('/reservation-confirmation');

        // Cerrar el formulario
        setSelectedMassage(null);
      } catch (error) {
        console.error('Error processing booking:', error);
        alert(
          'Hubo un error procesando la reserva. Por favor intenta de nuevo.'
        );
      }
    },
    [setReservationData, router]
  );

  return (
    <div className='min-h-screen bg-gradient-to-b from-stone-50 via-amber-25 to-stone-100'>
      <div className='max-w-8xl mx-auto'>
        {/* Hero Section */}
        <motion.section
          className='relative h-screen flex items-center justify-center px-6'
          initial='hidden'
          animate='visible'
          variants={fadeUp}
        >
          <div className='absolute inset-0 z-0'>
            <Image
              src='https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=1600&auto=format&fit=crop'
              alt='BF Paradise Spa Experience'
              fill
              className='object-cover'
              priority
            />
            <div className='absolute inset-0 bg-gradient-to-b from-stone-900/70 via-stone-900/50 to-stone-900/70' />
          </div>

          <div className='relative z-20 text-center max-w-4xl'>
            <motion.div
              className='inline-flex items-center bg-white/20 backdrop-blur-md px-4 md:px-8 py-3 md:py-4 rounded-full border border-white/30 mb-8 md:mb-12'
              variants={fadeUp}
            >
              <Leaf className='w-5 h-5 md:w-6 md:h-6 text-white mr-3 md:mr-4' />
              <span className='text-white font-medium text-sm md:text-lg'>
                BF Paradise Premium Wellness
              </span>
            </motion.div>

            <motion.h1
              className='text-4xl md:text-6xl lg:text-8xl font-light text-white mb-6 md:mb-8 leading-tight'
              variants={fadeUp}
            >
              Massage
              <br />
              <span className='font-normal'>Therapy</span>
            </motion.h1>

            <motion.p
              className='text-lg md:text-2xl lg:text-3xl text-white/90 mb-12 md:mb-16 leading-relaxed font-light max-w-3xl mx-auto px-4'
              variants={fadeUp}
            >
              Rediscover harmony between body and mind in a sensory journey
              designed to restore your vital energy
            </motion.p>

            <motion.div
              className='flex flex-col items-center'
              variants={fadeUp}
            >
              <div className='text-white/70 text-base md:text-lg'>
                ↓ Choose your perfect treatment below
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Sección de Masajes */}
        <motion.section
          id='massage-selection'
          className='py-32 px-6 bg-white/50 backdrop-blur-sm'
          initial='hidden'
          animate='visible'
          variants={stagger}
        >
          <motion.div className='text-center mb-24' variants={fadeUp}>
            <h2 className='text-5xl md:text-6xl font-light text-stone-800 mb-8'>
              Find Your Balance
            </h2>
            <p className='text-2xl text-stone-600 max-w-4xl mx-auto font-light leading-relaxed'>
              Each technique is a unique journey towards wellness
            </p>
          </motion.div>

          <div className='space-y-16'>
            {MASSAGE_TYPES.map((massage, index) => {
              const prices = massage.durations.map((d) => d.price);
              const minPrice = Math.min(...prices);
              const maxPrice = Math.max(...prices);
              const priceDisplay =
                minPrice === maxPrice
                  ? `$${minPrice}`
                  : `$${minPrice} - $${maxPrice}`;

              return (
                <motion.div
                  key={massage.id}
                  className={`relative overflow-hidden rounded-3xl shadow-2xl transition-all duration-700 cursor-pointer group ${
                    selectedMassage?.id === massage.id
                      ? 'ring-4 ring-stone-300 shadow-3xl'
                      : 'hover:shadow-3xl'
                  }`}
                  variants={fadeUp}
                  onClick={() => handleMassageSelect(massage)}
                  whileHover={{ scale: 1.01 }}
                >
                  <div
                    className={`grid grid-cols-1 lg:grid-cols-2 min-h-[400px] md:min-h-[600px] ${
                      index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
                    }`}
                  >
                    {/* Imagen */}
                    <div
                      className={`relative overflow-hidden order-1 lg:order-none ${
                        index % 2 === 1 ? 'lg:col-start-2' : ''
                      }`}
                    >
                      <div className='relative h-64 md:h-full w-full'>
                        <Image
                          src={massage.imageUrl}
                          alt={massage.name}
                          fill
                          className='object-cover group-hover:scale-110 transition-transform duration-1000'
                        />

                        {massage.isPremium && (
                          <div className='absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white px-3 md:px-6 py-2 md:py-3 rounded-full font-medium border border-white/30 text-sm md:text-base'>
                            <Star className='w-4 h-4 md:w-5 md:h-5 inline mr-1 md:mr-2' />
                            Premium Experience
                          </div>
                        )}

                        <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent' />

                        <div className='absolute bottom-4 md:bottom-8 left-4 md:left-8 text-white'>
                          <div className='text-2xl md:text-4xl font-light mb-1 md:mb-2'>
                            {priceDisplay}
                          </div>
                          <div className='text-white/90 text-sm md:text-base'>
                            {massage.durations
                              .map((d) => `${d.duration}min`)
                              .join(' • ')}
                          </div>
                        </div>

                        {/* Hover overlay - solo en desktop */}
                        <div className='hidden lg:flex absolute inset-0 bg-stone-800/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 items-center justify-center'>
                          <div className='text-white text-center'>
                            <div className='text-5xl mb-4'>{massage.emoji}</div>
                            <div className='text-2xl font-light mb-4'>
                              Book Now
                            </div>
                            <div className='flex items-center justify-center gap-2'>
                              <Heart className='w-6 h-6' />
                              <span className='text-lg'>Click to continue</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Contenido */}
                    <div
                      className={`bg-gradient-to-br from-stone-100 to-amber-50 p-6 md:p-12 lg:p-16 flex flex-col justify-center order-2 lg:order-none ${
                        index % 2 === 1 ? 'lg:col-start-1' : ''
                      }`}
                    >
                      <div className='mb-6 md:mb-8'>
                        <div className='flex flex-col sm:flex-row sm:items-center mb-4 md:mb-6'>
                          <span className='text-3xl md:text-5xl mr-0 sm:mr-4 mb-2 sm:mb-0'>
                            {massage.emoji}
                          </span>
                          <div>
                            <h3 className='text-2xl md:text-3xl font-light text-stone-800 mb-1 md:mb-2'>
                              {massage.name}
                            </h3>
                            <div className='flex flex-wrap items-center gap-2 text-xs md:text-sm text-stone-600 mb-2'>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  massage.intensity === 'gentle'
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : massage.intensity === 'medium'
                                    ? 'bg-amber-100 text-amber-700'
                                    : 'bg-red-100 text-red-700'
                                }`}
                              >
                                {massage.intensity}
                              </span>
                              <span className='text-stone-500'>•</span>
                              <span>Max {massage.maxPersons} persons</span>
                            </div>
                          </div>
                        </div>

                        <p className='text-lg md:text-xl text-stone-700 leading-relaxed mb-6 md:mb-8'>
                          {massage.description}
                        </p>

                        <div className='space-y-2 md:space-y-3 mb-6 md:mb-8'>
                          {massage.benefits.slice(0, 3).map((benefit, idx) => (
                            <div
                              key={idx}
                              className='flex items-start text-stone-600'
                            >
                              <div className='w-2 h-2 bg-stone-400 rounded-full mr-3 md:mr-4 mt-2 md:mt-3 flex-shrink-0' />
                              <span className='text-base md:text-lg leading-relaxed'>
                                {benefit}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button
                        className={`self-start px-6 md:px-8 py-3 md:py-4 rounded-2xl font-medium transition-all duration-300 w-full sm:w-auto ${
                          selectedMassage?.id === massage.id
                            ? 'bg-stone-700 text-white shadow-lg'
                            : 'bg-white/80 text-stone-700 hover:bg-white hover:shadow-lg'
                        }`}
                      >
                        {selectedMassage?.id === massage.id ? (
                          <span className='flex items-center justify-center'>
                            <CheckCircle className='w-4 h-4 md:w-5 md:h-5 mr-2' />
                            <span className='text-sm md:text-base'>
                              Selected - Complete booking below
                            </span>
                          </span>
                        ) : (
                          <span className='flex items-center justify-center'>
                            <Heart className='w-4 h-4 md:w-5 md:h-5 mr-2' />
                            <span className='text-sm md:text-base'>
                              Book {massage.name}
                            </span>
                            <ArrowRight className='w-4 h-4 md:w-5 md:h-5 ml-2' />
                          </span>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Formulario inline aparece aquí */}
                  <AnimatePresence mode='wait'>
                    {' '}
                    {/* Agregar mode="wait" */}
                    {selectedMassage?.id === massage.id && (
                      <InlineBookingForm
                        key={`form-${massage.id}`} // Agregar key único
                        selectedMassage={selectedMassage}
                        onCancel={handleCancelBooking}
                        onConfirm={handleConfirmBooking}
                      />
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Call to Action Final */}
        <motion.section
          className='py-32 px-6 bg-gradient-to-b from-stone-800 to-stone-900'
          initial='hidden'
          animate='visible'
          variants={fadeUp}
        >
          <div className='max-w-4xl mx-auto text-center text-white'>
            <motion.h3
              className='text-4xl md:text-5xl font-light mb-8'
              variants={fadeUp}
            >
              Ready to Begin Your Journey?
            </motion.h3>
            <motion.p
              className='text-xl text-stone-300 mb-12 leading-relaxed'
              variants={fadeUp}
            >
              Book your personalized massage experience today and discover the
              transformative power of therapeutic touch in the comfort of your
              own space.
            </motion.p>

            <motion.div className='space-y-6' variants={fadeUp}>
              <button
                onClick={() => {
                  const massageSection =
                    document.getElementById('massage-selection');
                  if (massageSection) {
                    massageSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className='bg-white text-stone-800 px-12 py-6 rounded-2xl font-medium text-xl hover:bg-stone-50 transition-colors flex items-center justify-center gap-4 mx-auto group'
              >
                <Heart className='w-6 h-6 group-hover:scale-110 transition-transform' />
                Choose Your Perfect Treatment
                <ArrowRight className='w-6 h-6 group-hover:translate-x-2 transition-transform' />
              </button>

              <div className='flex justify-center gap-12 text-stone-400 text-sm'>
                <div className='flex items-center gap-3'>
                  <Phone className='w-5 h-5' />
                  <span>Expert consultation included</span>
                </div>
                <div className='flex items-center gap-3'>
                  <CheckCircle className='w-5 h-5' />
                  <span>Cancel up to 4h before</span>
                </div>
                <div className='flex items-center gap-3'>
                  <Shield className='w-5 h-5' />
                  <span>100% secure booking</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default MassageServiceView;
