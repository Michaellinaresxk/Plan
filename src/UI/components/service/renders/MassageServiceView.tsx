import React, { useState, useCallback } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { Service } from '@/types/type';
import { ServiceData } from '@/types/services';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useBooking } from '@/context/BookingContext';
import { BookingDate } from '@/types/type';
import { SPA_SERVICES } from '@/constants/spaServices'; // ← IMPORTAR LA CONSTANTE
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

// ← USAR LA CONSTANTE IMPORTADA
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
      serviceId: selectedMassage.id, // ← serviceId como pediste
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

const MassageServiceView: React.FC<MassageServiceViewProps> = ({
  service,
  serviceData,
  primaryColor = 'stone',
  viewContext = 'standard-view',
}) => {
  const { t } = useTranslation();
  const { bookService } = useBooking();

  // ← ESTADO SIMPLE: solo masaje seleccionado (SIN MODAL)
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

  // ← HANDLERS SIMPLES
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

      // ← LLAMAR AL CONTEXTO DE BOOKING DIRECTAMENTE (SIN MODAL)
      // En lugar de abrir modal, procesamos la reserva directamente
      try {
        // Convertir a formato esperado por el contexto
        const bookingDate: BookingDate = {
          date: bookingData.date,
          time: bookingData.time,
        };

        // Llamar al contexto de booking
        bookService(service, bookingDate, bookingData.persons);

        // Mostrar confirmación y limpiar
        alert(
          `¡Reserva confirmada!\n${bookingData.serviceName}\nFecha: ${bookingData.date} a las ${bookingData.time}\nPersonas: ${bookingData.persons}\nPrecio: ${bookingData.price}`
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
            <div className='absolute inset-0 bg-gradient-to-b from-stone-900/60 via-stone-900/30 to-stone-900/60' />
          </div>

          <div className='relative z-10 text-center max-w-4xl'>
            <motion.div
              className='inline-flex items-center bg-white/20 backdrop-blur-md px-8 py-4 rounded-full border border-white/30 mb-12'
              variants={fadeUp}
            >
              <Leaf className='w-6 h-6 text-white mr-4' />
              <span className='text-white font-medium text-lg'>
                BF Paradise Premium Wellness
              </span>
            </motion.div>

            <motion.h1
              className='text-6xl md:text-8xl font-light text-white mb-8 leading-tight'
              variants={fadeUp}
            >
              Massage
              <br />
              <span className='font-normal'>Therapy</span>
            </motion.h1>

            <motion.p
              className='text-2xl md:text-3xl text-white/90 mb-16 leading-relaxed font-light max-w-3xl mx-auto'
              variants={fadeUp}
            >
              Rediscover harmony between body and mind in a sensory journey
              designed to restore your vital energy
            </motion.p>

            <motion.div
              className='flex flex-col items-center'
              variants={fadeUp}
            >
              <div className='text-white/70 text-lg'>
                ↓ Choose your perfect treatment below
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* ← SECCIÓN DE MASAJES USANDO SPA_SERVICES */}
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
              // ← CALCULAR PRECIOS USANDO DATOS REALES
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
                  onClick={() => handleMassageSelect(massage)} // ← CLICK PARA SELECCIONAR
                  whileHover={{ scale: 1.01 }}
                >
                  <div
                    className={`grid grid-cols-1 lg:grid-cols-2 min-h-[600px] ${
                      index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
                    }`}
                  >
                    {/* Imagen */}
                    <div
                      className={`relative overflow-hidden ${
                        index % 2 === 1 ? 'lg:col-start-2' : ''
                      }`}
                    >
                      <Image
                        src={massage.imageUrl}
                        alt={massage.name}
                        fill
                        className='object-cover group-hover:scale-110 transition-transform duration-1000'
                      />

                      {massage.isPremium && (
                        <div className='absolute top-8 right-8 bg-white/20 backdrop-blur-md text-white px-6 py-3 rounded-full font-medium border border-white/30'>
                          <Star className='w-5 h-5 inline mr-2' />
                          Premium Experience
                        </div>
                      )}

                      <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent' />

                      <div className='absolute bottom-8 left-8 text-white'>
                        <div className='text-4xl font-light mb-2'>
                          {priceDisplay}
                        </div>
                        <div className='text-white/90'>
                          {massage.durations
                            .map((d) => `${d.duration}min`)
                            .join(' • ')}
                        </div>
                      </div>

                      {/* Hover overlay */}
                      <div className='absolute inset-0 bg-stone-800/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center'>
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

                    {/* Contenido */}
                    <div
                      className={`bg-gradient-to-br from-stone-100 to-amber-50 p-12 lg:p-16 flex flex-col justify-center ${
                        index % 2 === 1 ? 'lg:col-start-1' : ''
                      }`}
                    >
                      <div className='mb-8'>
                        <div className='flex items-center mb-6'>
                          <span className='text-5xl mr-4'>{massage.emoji}</span>
                          <div>
                            <h3 className='text-3xl font-light text-stone-800 mb-2'>
                              {massage.name}
                            </h3>
                            <div className='flex items-center gap-2 text-sm text-stone-600 mb-2'>
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

                        <p className='text-xl text-stone-700 leading-relaxed mb-8'>
                          {massage.description}
                        </p>

                        <div className='space-y-3 mb-8'>
                          {massage.benefits.slice(0, 3).map((benefit, idx) => (
                            <div
                              key={idx}
                              className='flex items-start text-stone-600'
                            >
                              <div className='w-2 h-2 bg-stone-400 rounded-full mr-4 mt-3 flex-shrink-0' />
                              <span className='text-lg leading-relaxed'>
                                {benefit}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button
                        className={`self-start px-8 py-4 rounded-2xl font-medium transition-all duration-300 ${
                          selectedMassage?.id === massage.id
                            ? 'bg-stone-700 text-white shadow-lg'
                            : 'bg-white/80 text-stone-700 hover:bg-white hover:shadow-lg'
                        }`}
                      >
                        {selectedMassage?.id === massage.id ? (
                          <span className='flex items-center'>
                            <CheckCircle className='w-5 h-5 mr-2' />
                            Selected - Complete booking below
                          </span>
                        ) : (
                          <span className='flex items-center'>
                            <Heart className='w-5 h-5 mr-2' />
                            Book {massage.name}
                            <ArrowRight className='w-5 h-5 ml-2' />
                          </span>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* ← FORMULARIO INLINE APARECE AQUÍ */}
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

        {/* Resto de secciones existentes... */}
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
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default MassageServiceView;
