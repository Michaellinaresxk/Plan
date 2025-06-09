import React, { useState, useCallback } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { Service } from '@/types/type';
import { ServiceData } from '@/types/services';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useBooking } from '@/context/BookingContext';
import { BookingDate } from '@/types/type';
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
  Home,
  Timer,
  Phone,
  MapPin,
  Sparkles,
  Quote,
  Calendar,
  Plus,
  Minus,
  X,
  Accessibility,
  Info,
} from 'lucide-react';

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

// Usar los datos importados
const MASSAGE_TYPES = SPA_SERVICES.massages;

// Componente del formulario inline
const InlineBookingForm = ({ selectedMassage, onCancel, onConfirm }) => {
  const [selectedDuration, setSelectedDuration] = useState(
    selectedMassage.durations[0]
  );
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [persons, setPersons] = useState(1);
  const [specialNeeds, setSpecialNeeds] = useState('');

  const totalPrice = selectedDuration.price * persons;
  const isFormValid = date && time;

  const handleSubmit = () => {
    if (!isFormValid) return;

    onConfirm({
      serviceId: selectedMassage.id,
      serviceName: selectedMassage.name,
      duration: selectedDuration.duration,
      price: totalPrice,
      date,
      time,
      persons,
      specialNeeds,
      emoji: selectedMassage.emoji,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.5 }}
      className='bg-white rounded-3xl shadow-2xl p-8 mt-8 border border-stone-200'
      id='booking-form'
    >
      {/* Header */}
      <div className='flex items-center justify-between mb-8 pb-6 border-b border-stone-200'>
        <div className='flex items-center gap-4'>
          <div className='w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center text-2xl'>
            {selectedMassage.emoji}
          </div>
          <div>
            <h3 className='text-2xl font-semibold text-stone-800 mb-1'>
              Complete your {selectedMassage.name} booking
            </h3>
            <p className='text-stone-600'>{selectedMassage.description}</p>
          </div>
        </div>
        <button
          onClick={onCancel}
          className='p-2 hover:bg-stone-100 rounded-lg transition-colors'
        >
          <X className='w-6 h-6 text-stone-600' />
        </button>
      </div>

      <div className='space-y-8'>
        {/* Duration Selection */}
        <div>
          <h4 className='text-lg font-semibold text-stone-800 mb-4 flex items-center gap-2'>
            <Timer className='w-5 h-5' />
            Treatment Duration
          </h4>
          <div
            className={`grid gap-4 ${
              selectedMassage.durations.length === 1
                ? 'grid-cols-1 max-w-sm'
                : selectedMassage.durations.length === 2
                ? 'grid-cols-2'
                : 'grid-cols-3'
            }`}
          >
            {selectedMassage.durations.map((option, index) => (
              <button
                key={option.duration}
                onClick={() => setSelectedDuration(option)}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  selectedDuration.duration === option.duration
                    ? 'border-stone-800 bg-stone-50'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className='font-semibold text-stone-800'>
                  {option.duration} minutes
                </div>
                <div className='text-xl font-bold text-stone-800 mt-1'>
                  ${option.price}
                </div>
                {persons > 1 && (
                  <div className='text-sm text-stone-500 mt-1'>
                    ${option.price * persons} total
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Date & Time */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <label className='block text-lg font-semibold text-stone-800 mb-3 flex items-center gap-2'>
              <Calendar className='w-5 h-5' />
              Date
            </label>
            <input
              type='date'
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className='w-full p-4 border-2 border-stone-300 rounded-xl focus:ring-2 focus:ring-stone-500 focus:border-transparent text-lg'
            />
          </div>

          <div>
            <label className='block text-lg font-semibold text-stone-800 mb-3 flex items-center gap-2'>
              <Clock className='w-5 h-5' />
              Time
            </label>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className='w-full p-4 border-2 border-stone-300 rounded-xl focus:ring-2 focus:ring-stone-500 focus:border-transparent text-lg'
            >
              <option value=''>Select time</option>
              {TIME_SLOTS.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Number of People */}
        <div>
          <label className='block text-lg font-semibold text-stone-800 mb-3 flex items-center gap-2'>
            <Users className='w-5 h-5' />
            Number of People
          </label>
          <div className='flex items-center justify-between bg-stone-50 rounded-xl p-4'>
            <div className='flex items-center gap-4'>
              <button
                onClick={() => setPersons(Math.max(1, persons - 1))}
                className='w-10 h-10 rounded-full bg-white border-2 border-stone-300 flex items-center justify-center hover:bg-stone-50 transition-colors'
                disabled={persons <= 1}
              >
                <Minus className='w-5 h-5 text-stone-600' />
              </button>
              <span className='text-2xl font-semibold text-stone-800 w-12 text-center'>
                {persons}
              </span>
              <button
                onClick={() =>
                  setPersons(Math.min(selectedMassage.maxPersons, persons + 1))
                }
                className='w-10 h-10 rounded-full bg-white border-2 border-stone-300 flex items-center justify-center hover:bg-stone-50 transition-colors'
                disabled={persons >= selectedMassage.maxPersons}
              >
                <Plus className='w-5 h-5 text-stone-600' />
              </button>
            </div>
            <span className='text-stone-600'>
              Maximum: {selectedMassage.maxPersons} people
            </span>
          </div>
        </div>

        {/* Special Needs & Disability */}
        <div>
          <label className='block text-lg font-semibold text-stone-800 mb-3 flex items-center gap-2'>
            <Accessibility className='w-5 h-5' />
            Special Needs & Disabilities
          </label>
          <textarea
            value={specialNeeds}
            onChange={(e) => setSpecialNeeds(e.target.value)}
            placeholder='Please mention any medical conditions, disabilities, injuries, pregnancy, allergies, mobility restrictions, or special accommodations we should consider to personalize your experience safely...'
            className='w-full p-4 border-2 border-stone-300 rounded-xl focus:ring-2 focus:ring-stone-500 focus:border-transparent resize-none h-32 text-lg'
          />
          <div className='flex items-start gap-2 mt-3 text-stone-600'>
            <Info className='w-5 h-5 mt-0.5 flex-shrink-0' />
            <p className='text-sm leading-relaxed'>
              This information is confidential and helps us adapt the treatment
              to your specific needs. Our therapists are trained to work with
              various conditions and limitations.
            </p>
          </div>
        </div>

        {/* Price Summary */}
        <div className='bg-gradient-to-r from-stone-800 to-stone-900 text-white rounded-2xl p-6'>
          <div className='flex justify-between items-center'>
            <div>
              <h4 className='text-xl font-semibold mb-2'>Booking Summary</h4>
              <div className='space-y-1 text-stone-300'>
                <div className='flex items-center gap-2'>
                  <span className='text-lg'>{selectedMassage.emoji}</span>
                  <span>{selectedMassage.name}</span>
                </div>
                <div>
                  {selectedDuration.duration} minutes • {persons}{' '}
                  {persons === 1 ? 'person' : 'people'}
                </div>
                {date && time && (
                  <div>
                    {new Date(date).toLocaleDateString()} at {time}
                  </div>
                )}
              </div>
            </div>
            <div className='text-right'>
              <div className='text-3xl font-bold'>${totalPrice}</div>
              <div className='text-stone-300'>Total Price</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex gap-4'>
          <button
            onClick={onCancel}
            className='flex-1 py-4 border-2 border-stone-300 text-stone-700 rounded-xl hover:bg-stone-50 transition-colors font-semibold'
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isFormValid}
            className={`flex-1 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
              isFormValid
                ? 'bg-stone-800 text-white hover:bg-stone-700'
                : 'bg-stone-300 text-stone-500 cursor-not-allowed'
            }`}
          >
            <Heart className='w-5 h-5' />
            Confirm Booking
            <ArrowRight className='w-5 h-5' />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const MassageServiceView = ({
  service,
  serviceData,
  primaryColor = 'stone',
  viewContext = 'standard-view',
}) => {
  const { t } = useTranslation();
  const { bookService } = useBooking();

  // Estado simple: solo masaje seleccionado
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

  // Handlers simples
  const handleMassageSelect = useCallback((massage) => {
    setSelectedMassage(massage);
    // Scroll al formulario después de un momento
    setTimeout(() => {
      const formElement = document.getElementById('booking-form');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 200);
  }, []);

  const handleCancelBooking = useCallback(() => {
    setSelectedMassage(null);
  }, []);

  const handleConfirmBooking = useCallback(
    (bookingData) => {
      console.log('Booking confirmed with serviceId:', bookingData.serviceId);
      console.log('Full booking data:', bookingData);

      // Llamar al contexto de booking directamente (sin modal)
      try {
        const bookingDate = {
          date: bookingData.date,
          time: bookingData.time,
        };

        bookService(service, bookingDate, bookingData.persons);

        alert(
          `¡Reserva confirmada!\n${bookingData.serviceName}\nFecha: ${bookingData.date} a las ${bookingData.time}\nPersonas: ${bookingData.persons}\nPrecio: $${bookingData.price}`
        );
        setSelectedMassage(null);
      } catch (error) {
        console.error('Error processing booking:', error);
        alert(
          'Hubo un error procesando la reserva. Por favor intenta de nuevo.'
        );
      }
    },
    [bookService, service]
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

        {/* Sección de Masajes usando SPA_SERVICES */}
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
                  <AnimatePresence>
                    {selectedMassage?.id === massage.id && (
                      <InlineBookingForm
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

        {/* Galería de Ambiente */}
        <motion.section
          className='py-32 px-6'
          initial='hidden'
          animate='visible'
          variants={stagger}
        >
          <motion.div className='text-center mb-20' variants={fadeUp}>
            <h2 className='text-5xl md:text-6xl font-light text-stone-800 mb-8'>
              Your Personal Oasis
            </h2>
            <p className='text-xl text-stone-600 max-w-3xl mx-auto font-light leading-relaxed'>
              Every detail is carefully designed to create an atmosphere of
              absolute tranquility in the privacy of your space
            </p>
          </motion.div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-16 md:mb-20'>
            {[
              {
                image:
                  'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?q=80&w=800&auto=format&fit=crop',
                title: 'Serene Environment',
                description: 'We create the perfect space for your relaxation',
              },
              {
                image:
                  'https://images.unsplash.com/photo-1583416750470-965b2707b355?q=80&w=800&auto=format&fit=crop',
                title: 'Premium Products',
                description: 'Oils and essences of the highest quality',
              },
              {
                image:
                  'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=800&auto=format&fit=crop',
                title: 'Professional Techniques',
                description: 'Precise and therapeutic movements',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className='group relative overflow-hidden rounded-2xl md:rounded-3xl shadow-2xl'
                variants={fadeUp}
                whileHover={{ scale: 1.02 }}
              >
                <div className='aspect-[4/5] relative'>
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className='object-cover group-hover:scale-110 transition-transform duration-700'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-transparent' />
                </div>

                <div className='absolute bottom-0 left-0 right-0 p-4 md:p-8 text-white'>
                  <h3 className='text-lg md:text-2xl font-light mb-2 md:mb-3'>
                    {item.title}
                  </h3>
                  <p className='text-sm md:text-base text-white/90 leading-relaxed'>
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Quote inspiracional */}
          <motion.div
            className='text-center max-w-4xl mx-auto'
            variants={fadeUp}
          >
            <div className='relative'>
              <Quote className='w-16 h-16 text-stone-300 mx-auto mb-8' />
              <blockquote className='text-3xl md:text-4xl font-light text-stone-700 leading-relaxed italic mb-8'>
                "The body is your temple. Keep it pure and clean for the soul to
                reside in."
              </blockquote>
              <cite className='text-xl text-stone-500 font-medium'>
                — B.K.S. Iyengar
              </cite>
            </div>
          </motion.div>
        </motion.section>

        {/* Proceso y Experiencia */}
        <motion.section
          className='py-32 px-6 bg-gradient-to-b from-stone-100 to-amber-50'
          initial='hidden'
          animate='visible'
          variants={stagger}
        >
          <motion.div className='text-center mb-20' variants={fadeUp}>
            <h3 className='text-4xl md:text-5xl font-light text-stone-800 mb-8'>
              A Wellness Ritual
            </h3>
            <p className='text-xl text-stone-600 max-w-3xl mx-auto leading-relaxed'>
              Each session is carefully orchestrated to create a transformative
              experience from the first moment
            </p>
          </motion.div>

          <div className='max-w-6xl mx-auto'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20'>
              <motion.div variants={fadeUp}>
                <h4 className='text-3xl font-light text-stone-800 mb-8'>
                  Sanctuary Preparation
                </h4>

                <div className='space-y-8'>
                  {[
                    {
                      step: '01',
                      title: 'Arrival and Setup',
                      description:
                        'Our therapist arrives 15 minutes early to prepare your personal space with professional table, relaxing music and subtle aromatherapy.',
                    },
                    {
                      step: '02',
                      title: 'Personalized Consultation',
                      description:
                        'Initial conversation about your needs, pressure preferences, tension areas and session goals.',
                    },
                    {
                      step: '03',
                      title: 'Perfect Environment',
                      description:
                        'Temperature adjustment, soft lighting and selection of essential oils according to your emotional state of the day.',
                    },
                  ].map((item, index) => (
                    <div key={index} className='flex items-start'>
                      <div className='w-16 h-16 bg-stone-600 text-white rounded-full flex items-center justify-center mr-6 flex-shrink-0 font-light text-lg'>
                        {item.step}
                      </div>
                      <div>
                        <h5 className='text-xl font-medium text-stone-800 mb-3'>
                          {item.title}
                        </h5>
                        <p className='text-stone-600 leading-relaxed'>
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div className='relative' variants={fadeUp}>
                <div className='relative h-[600px] rounded-3xl overflow-hidden shadow-2xl'>
                  <Image
                    src='https://images.unsplash.com/photo-1596178065887-1198b6148b2b?q=80&w=800&auto=format&fit=crop'
                    alt='Spa environment preparation'
                    fill
                    className='object-cover'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent' />

                  <div className='absolute bottom-8 left-8 right-8 text-white'>
                    <h5 className='text-2xl font-light mb-3'>
                      Your Space, Transformed
                    </h5>
                    <p className='text-white/90 leading-relaxed'>
                      We transform any room into an oasis of tranquility with
                      professional equipment and attention to every detail.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Galería de productos y técnicas */}
            <motion.div
              className='grid grid-cols-1 md:grid-cols-4 gap-6'
              variants={stagger}
            >
              {[
                {
                  image:
                    'https://images.unsplash.com/photo-1583416750470-965b2707b355?q=80&w=600&auto=format&fit=crop',
                  title: 'Premium Oils',
                  description: '100% natural and organic',
                },
                {
                  image:
                    'https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=600&auto=format&fit=crop',
                  title: 'Expert Techniques',
                  description: 'Precise and therapeutic movements',
                },
                {
                  image:
                    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=600&auto=format&fit=crop',
                  title: 'Volcanic Stones',
                  description: 'Natural therapeutic heat',
                },
                {
                  image:
                    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=600&auto=format&fit=crop',
                  title: 'Pure Aromas',
                  description: 'Carefully selected essences',
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className='group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500'
                  variants={fadeUp}
                  whileHover={{ y: -8 }}
                >
                  <div className='aspect-square relative'>
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className='object-cover group-hover:scale-110 transition-transform duration-700'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-stone-900/80 to-transparent' />
                  </div>

                  <div className='absolute bottom-0 left-0 right-0 p-6 text-white'>
                    <h6 className='font-medium mb-2'>{item.title}</h6>
                    <p className='text-sm text-white/90'>{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* Lo Que Incluye */}
        <motion.section
          className='py-32 px-6'
          initial='hidden'
          animate='visible'
          variants={stagger}
        >
          <motion.div className='text-center mb-20' variants={fadeUp}>
            <h3 className='text-4xl md:text-5xl font-light text-stone-800 mb-8'>
              A Complete Experience
            </h3>
            <p className='text-xl text-stone-600 max-w-3xl mx-auto leading-relaxed'>
              Every detail is included so you only focus on relaxing and
              enjoying
            </p>
          </motion.div>

          <div className='max-w-6xl mx-auto'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20'>
              {/* Lo que está incluido */}
              <motion.div
                className='bg-white rounded-3xl shadow-xl p-12'
                variants={fadeUp}
              >
                <h4 className='text-2xl font-light text-stone-800 mb-10 flex items-center'>
                  <Heart className='w-8 h-8 text-stone-600 mr-4' />
                  Everything Included
                </h4>

                <div className='space-y-8'>
                  {[
                    {
                      icon: Shield,
                      title: 'Certified Therapist',
                      desc: 'Professionals with more than 500 hours of training and international certifications in specialized techniques.',
                    },
                    {
                      icon: Leaf,
                      title: 'Premium Organic Products',
                      desc: '100% pure essential oils, nutritive creams and natural products selected for their therapeutic properties.',
                    },
                    {
                      icon: Home,
                      title: 'Professional Installation',
                      desc: 'Professional massage table, Egyptian cotton sheets, relaxing music and environmental aromatherapy.',
                    },
                    {
                      icon: Timer,
                      title: 'Personalized Consultation',
                      desc: 'Prior evaluation of needs, preferences and creation of a unique treatment plan for you.',
                    },
                    {
                      icon: Heart,
                      title: 'Post-Session Follow-up',
                      desc: 'Personalized recommendations and tips to prolong the benefits of your experience.',
                    },
                  ].map((item, index) => (
                    <div key={index} className='flex items-start group'>
                      <div className='w-14 h-14 bg-stone-100 rounded-2xl flex items-center justify-center mr-6 flex-shrink-0 group-hover:bg-stone-200 transition-colors'>
                        <item.icon className='w-6 h-6 text-stone-600' />
                      </div>
                      <div>
                        <h5 className='text-lg font-medium text-stone-800 mb-3'>
                          {item.title}
                        </h5>
                        <p className='text-stone-600 leading-relaxed'>
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Nuestros terapeutas */}
              <motion.div className='space-y-8' variants={fadeUp}>
                <div className='bg-gradient-to-br from-stone-700 to-stone-800 rounded-3xl p-12 text-white'>
                  <h4 className='text-2xl font-light mb-8'>Our Therapists</h4>

                  <div className='space-y-6'>
                    {[
                      {
                        name: 'Elena Martínez',
                        specialty: 'Deep Tissue Specialist',
                        experience: '8 years of experience',
                        certification:
                          'Certified in Swedish and Thai Techniques',
                      },
                      {
                        name: 'Carlos Mendoza',
                        specialty: 'Thai Massage Master',
                        experience: '12 years of experience',
                        certification: 'Traditional training in Thailand',
                      },
                      {
                        name: 'Ana Silva',
                        specialty: 'Certified Prenatal Therapist',
                        experience: '10 years of experience',
                        certification: 'Aromatherapy Specialization',
                      },
                    ].map((therapist, index) => (
                      <div
                        key={index}
                        className='border-b border-white/20 pb-6 last:border-b-0'
                      >
                        <h5 className='text-lg font-medium mb-2'>
                          {therapist.name}
                        </h5>
                        <p className='text-stone-200 mb-1'>
                          {therapist.specialty}
                        </p>
                        <p className='text-stone-300 text-sm'>
                          {therapist.experience}
                        </p>
                        <p className='text-stone-300 text-sm'>
                          {therapist.certification}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className='bg-white rounded-3xl shadow-xl p-8'>
                  <div className='text-center'>
                    <div className='flex justify-center mb-6'>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className='w-6 h-6 text-amber-400 fill-current'
                        />
                      ))}
                    </div>
                    <blockquote className='text-xl text-stone-700 italic leading-relaxed mb-6'>
                      "Each session is a transformative experience. The level of
                      professionalism and personal care is exceptional."
                    </blockquote>
                    <cite className='text-stone-600 font-medium'>
                      — Sofía Restrepo, frequent guest
                    </cite>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Sección Final Inspiracional */}
        <motion.section
          className='py-32 px-6 bg-gradient-to-b from-amber-50 to-stone-50'
          initial='hidden'
          animate='visible'
          variants={fadeUp}
        >
          <div className='max-w-5xl mx-auto text-center'>
            <div className='mb-16'>
              <Sparkles className='w-16 h-16 text-stone-400 mx-auto mb-8' />
              <h3 className='text-4xl md:text-5xl font-light text-stone-800 mb-8 leading-tight'>
                More than a massage,
                <br />a personal transformation
              </h3>
              <p className='text-2xl text-stone-600 leading-relaxed max-w-3xl mx-auto'>
                Allow yourself this moment of deep connection with yourself.
                Your well-being is not a luxury, it's a necessity.
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
              {[
                {
                  icon: '🌱',
                  title: 'Renewal',
                  description:
                    'Each session is a new beginning for your body and mind',
                },
                {
                  icon: '💫',
                  title: 'Balance',
                  description:
                    'Find the perfect harmony between relaxation and revitalization',
                },
                {
                  icon: '🕊️',
                  title: 'Inner Peace',
                  description:
                    'Experience a deep calm that transcends the physical',
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className='text-center p-8'
                  variants={fadeUp}
                  whileHover={{ y: -8 }}
                >
                  <div className='text-5xl mb-6'>{item.icon}</div>
                  <h4 className='text-2xl font-light text-stone-800 mb-4'>
                    {item.title}
                  </h4>
                  <p className='text-stone-600 leading-relaxed'>
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
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
