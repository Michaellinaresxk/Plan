// views/LiveMusicServiceView.tsx (versión mejorada con sección de reserva)

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n/client';
import { Service } from '@/types/type';
import { ServiceData } from '@/types/services';
import {
  Music,
  Calendar,
  Check,
  Sparkles,
  Heart,
  X,
  PlayCircle,
  Clock,
  Users,
  ListMusic,
  Settings,
  ChevronDown,
  Timer,
  DollarSign,
  CreditCard,
  AlertCircle,
} from 'lucide-react';
import { useReservation } from '@/context/BookingContext';
import { BookingDate } from '@/types/type';

interface LiveMusicServiceViewProps {
  service: Service;
  serviceData?: ServiceData;
  primaryColor: string;
}

// Tipos de performer
const performerTypes = [
  {
    id: 'soloist',
    name: 'Solista',
    description: 'Un músico con guitarra o piano',
    price: 150,
    icon: '🎸',
  },
  {
    id: 'duo',
    name: 'Dúo',
    description: 'Dos músicos con armonías vocales',
    price: 250,
    icon: '🎭',
  },
  {
    id: 'trio',
    name: 'Trío',
    description: 'Tres músicos con instrumentos variados',
    price: 350,
    icon: '🎼',
  },
  {
    id: 'band',
    name: 'Banda Completa',
    description: 'Banda de 4-5 músicos',
    price: 500,
    icon: '🎪',
  },
];

// Opciones de duración y sets
const durationOptions = [
  {
    id: 'regular',
    name: 'Programación Regular',
    description: '2 sets de 45 min (Total: 1:30h)',
    duration: 90,
    sets: 2,
    setDuration: 45,
    breakTime: 15,
  },
  {
    id: 'triple',
    name: 'Sesiones Cortas',
    description: '3 sets de 30 min (Total: 1:30h)',
    duration: 90,
    sets: 3,
    setDuration: 30,
    breakTime: 15,
  },
  {
    id: 'continuous',
    name: 'Sesión Continua',
    description: '1:30h corrido sin parar',
    duration: 90,
    sets: 1,
    setDuration: 90,
    breakTime: 0,
  },
];

// Galería de imágenes de música en vivo
const musicGallery = [
  {
    src: 'https://images.unsplash.com/photo-1501612780327-45045538702b?q=80&w=2940&auto=format&fit=crop',
    alt: 'Solo acoustic guitarist performing',
    type: 'soloist',
  },
  {
    src: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=2832&auto=format&fit=crop',
    alt: 'Jazz duo performing at intimate venue',
    type: 'duo',
  },
  {
    src: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=2940&auto=format&fit=crop',
    alt: 'String trio performing classical music',
    type: 'trio',
  },
];

const LiveMusicServiceView: React.FC<LiveMusicServiceViewProps> = ({
  service,
  serviceData,
  primaryColor,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { setReservationData } = useReservation();
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );

  // Estados para el formulario de reserva
  const [bookingForm, setBookingForm] = useState({
    date: '',
    time: '',
    performerType: '',
    duration: '',
    hasSpecificSongs: false,
    specificSongs: '',
    specialRequests: '',
  });

  // Estados para validación y errores
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calcular precio total
  const selectedPerformer = performerTypes.find(
    (p) => p.id === bookingForm.performerType
  );
  const selectedDuration = durationOptions.find(
    (d) => d.id === bookingForm.duration
  );
  const totalPrice =
    selectedPerformer && selectedDuration
      ? selectedPerformer.price * (selectedDuration.sets || 1)
      : 0;

  // Validar formulario
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!bookingForm.date) {
      newErrors.date = t('form.errors.required', {
        fallback: 'Date is required',
      });
    }

    if (!bookingForm.time) {
      newErrors.time = t('form.errors.required', {
        fallback: 'Time is required',
      });
    }

    if (!bookingForm.performerType) {
      newErrors.performerType = t('form.errors.required', {
        fallback: 'Please select a performer type',
      });
    }

    if (!bookingForm.duration) {
      newErrors.duration = t('form.errors.required', {
        fallback: 'Please select a duration',
      });
    }

    if (bookingForm.hasSpecificSongs && !bookingForm.specificSongs.trim()) {
      newErrors.specificSongs = t('form.errors.required', {
        fallback: 'Please specify your song preferences',
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar la reserva
  const handleBookingSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Crear datos de reserva
      const reservationData = {
        service,
        formData: {
          ...bookingForm,
          calculatedPrice: totalPrice,
          serviceId: service.id,
          serviceName: service.name,
        },
        totalPrice,
        bookingDate: new Date(),
      };

      console.log(
        '🎵 LiveMusicServiceView - Setting reservation data:',
        reservationData
      );

      // Guardar en contexto
      setReservationData(reservationData);

      // Backup en localStorage
      localStorage.setItem(
        'tempReservationData',
        JSON.stringify(reservationData)
      );

      // Navegar a confirmación
      router.push('/reservation-confirmation');
    } catch (error) {
      console.error('💥 LiveMusicServiceView - Error in booking:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormChange = (field: string, value: any) => {
    setBookingForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className='space-y-10'>
      {/* Sección de Detalles de Reserva */}
      <div
        id='booking-details'
        className='bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl overflow-hidden'
      >
        <div className='p-8 md:p-12'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl md:text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3'>
              <Settings className={`text-${primaryColor}-500`} size={36} />
              Personaliza tu Experiencia Musical
            </h2>
            <p className='text-xl text-gray-300 max-w-3xl mx-auto'>
              Configura cada detalle para crear la atmósfera perfecta para tu
              evento
            </p>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            {/* Columna Izquierda - Formulario */}
            <div className='space-y-6'>
              {/* Fecha y Hora */}
              <div className='bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10'>
                <h3 className='text-xl font-semibold text-white mb-4 flex items-center gap-2'>
                  <Calendar className={`text-${primaryColor}-500`} size={20} />
                  Fecha y Hora
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-300 mb-2'>
                      Fecha del Evento
                    </label>
                    <input
                      type='date'
                      value={bookingForm.date}
                      onChange={(e) => handleFormChange('date', e.target.value)}
                      className={`w-full px-4 py-3 border-2 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.date
                          ? 'bg-red-900/20 border-red-500'
                          : 'bg-white/10 border-white/20'
                      }`}
                    />
                    {errors.date && (
                      <p className='text-red-400 text-xs mt-1 flex items-center'>
                        <AlertCircle className='w-3 h-3 mr-1' />
                        {errors.date}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-300 mb-2'>
                      Hora de Inicio
                    </label>
                    <input
                      type='time'
                      value={bookingForm.time}
                      onChange={(e) => handleFormChange('time', e.target.value)}
                      className={`w-full px-4 py-3 border-2 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.time
                          ? 'bg-red-900/20 border-red-500'
                          : 'bg-white/10 border-white/20'
                      }`}
                    />
                    {errors.time && (
                      <p className='text-red-400 text-xs mt-1 flex items-center'>
                        <AlertCircle className='w-3 h-3 mr-1' />
                        {errors.time}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Tipo de Performer */}
              <div className='bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10'>
                <h3 className='text-xl font-semibold text-white mb-4 flex items-center gap-2'>
                  <Users className={`text-${primaryColor}-500`} size={20} />
                  Tipo de Performer
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                  {performerTypes.map((performer) => (
                    <div
                      key={performer.id}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        bookingForm.performerType === performer.id
                          ? `border-${primaryColor}-500 bg-${primaryColor}-500/20`
                          : 'border-white/20 hover:border-white/40 bg-white/5'
                      } ${
                        errors.performerType ? 'ring-2 ring-red-500/50' : ''
                      }`}
                      onClick={() =>
                        handleFormChange('performerType', performer.id)
                      }
                    >
                      <div className='flex items-center gap-3 mb-2'>
                        <span className='text-2xl'>{performer.icon}</span>
                        <div>
                          <h4 className='font-semibold text-white'>
                            {performer.name}
                          </h4>
                          <p className='text-sm text-gray-300'>
                            {performer.description}
                          </p>
                        </div>
                      </div>
                      <div className='flex justify-between items-center'>
                        <span className={`text-${primaryColor}-400 font-bold`}>
                          ${performer.price}/set
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                {errors.performerType && (
                  <p className='text-red-400 text-xs mt-2 flex items-center'>
                    <AlertCircle className='w-3 h-3 mr-1' />
                    {errors.performerType}
                  </p>
                )}
              </div>

              {/* Selección de Canciones */}
              <div className='bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10'>
                <h3 className='text-xl font-semibold text-white mb-4 flex items-center gap-2'>
                  <ListMusic className={`text-${primaryColor}-500`} size={20} />
                  Selección de Canciones
                </h3>
                <div className='space-y-4'>
                  <label className='flex items-center gap-3 cursor-pointer'>
                    <input
                      type='checkbox'
                      checked={bookingForm.hasSpecificSongs}
                      onChange={(e) =>
                        handleFormChange('hasSpecificSongs', e.target.checked)
                      }
                      className={`w-5 h-5 rounded border-2 border-white/20 bg-white/10 checked:bg-${primaryColor}-500 checked:border-${primaryColor}-500 focus:ring-2 focus:ring-${primaryColor}-500`}
                    />
                    <span className='text-white font-medium'>
                      Tengo una lista específica de canciones
                    </span>
                  </label>

                  {bookingForm.hasSpecificSongs && (
                    <textarea
                      value={bookingForm.specificSongs}
                      onChange={(e) =>
                        handleFormChange('specificSongs', e.target.value)
                      }
                      placeholder='Lista las canciones que te gustaría escuchar...'
                      rows={4}
                      className={`w-full px-4 py-3 border-2 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                        errors.specificSongs
                          ? 'bg-red-900/20 border-red-500'
                          : 'bg-white/10 border-white/20'
                      }`}
                    />
                  )}
                  {errors.specificSongs && (
                    <p className='text-red-400 text-xs mt-1 flex items-center'>
                      <AlertCircle className='w-3 h-3 mr-1' />
                      {errors.specificSongs}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Columna Derecha - Duración y Precio */}
            <div className='space-y-6'>
              {/* Duración y Sets */}
              <div className='bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10'>
                <h3 className='text-xl font-semibold text-white mb-4 flex items-center gap-2'>
                  <Timer className={`text-${primaryColor}-500`} size={20} />
                  Duración y Programación
                </h3>
                <div className='space-y-3'>
                  {durationOptions.map((option) => (
                    <div
                      key={option.id}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        bookingForm.duration === option.id
                          ? `border-${primaryColor}-500 bg-${primaryColor}-500/20`
                          : 'border-white/20 hover:border-white/40 bg-white/5'
                      } ${errors.duration ? 'ring-2 ring-red-500/50' : ''}`}
                      onClick={() => handleFormChange('duration', option.id)}
                    >
                      <div className='flex justify-between items-start mb-2'>
                        <h4 className='font-semibold text-white'>
                          {option.name}
                        </h4>
                        <Clock className='text-gray-400' size={16} />
                      </div>
                      <p className='text-sm text-gray-300 mb-3'>
                        {option.description}
                      </p>
                      <div className='grid grid-cols-3 gap-2 text-xs'>
                        <div className='text-center p-2 bg-white/10 rounded'>
                          <div className={`font-bold text-${primaryColor}-400`}>
                            {option.sets}
                          </div>
                          <div className='text-gray-400'>Sets</div>
                        </div>
                        <div className='text-center p-2 bg-white/10 rounded'>
                          <div className={`font-bold text-${primaryColor}-400`}>
                            {option.setDuration}min
                          </div>
                          <div className='text-gray-400'>Por Set</div>
                        </div>
                        <div className='text-center p-2 bg-white/10 rounded'>
                          <div className={`font-bold text-${primaryColor}-400`}>
                            {option.breakTime}min
                          </div>
                          <div className='text-gray-400'>Descanso</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {errors.duration && (
                  <p className='text-red-400 text-xs mt-2 flex items-center'>
                    <AlertCircle className='w-3 h-3 mr-1' />
                    {errors.duration}
                  </p>
                )}
              </div>

              {/* Resumen de Precio */}
              {totalPrice > 0 && (
                <div
                  className={`bg-gradient-to-r from-${primaryColor}-600 to-${primaryColor}-500 rounded-xl p-6 text-white`}
                >
                  <h3 className='text-xl font-semibold mb-4 flex items-center gap-2'>
                    <DollarSign size={20} />
                    Resumen de Precio
                  </h3>
                  <div className='space-y-3'>
                    <div className='flex justify-between items-center'>
                      <span>Tipo de Performer:</span>
                      <span className='font-semibold'>
                        {selectedPerformer?.name}
                      </span>
                    </div>
                    <div className='flex justify-between items-center'>
                      <span>Precio por Set:</span>
                      <span className='font-semibold'>
                        ${selectedPerformer?.price}
                      </span>
                    </div>
                    <div className='flex justify-between items-center'>
                      <span>Número de Sets:</span>
                      <span className='font-semibold'>
                        {selectedDuration?.sets}
                      </span>
                    </div>
                    <div className='border-t border-white/20 pt-3'>
                      <div className='flex justify-between items-center text-xl font-bold'>
                        <span>Total:</span>
                        <span>${totalPrice}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleBookingSubmit}
                    disabled={isSubmitting || totalPrice === 0}
                    className={`w-full mt-6 py-3 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 ${
                      isSubmitting || totalPrice === 0
                        ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                        : 'bg-white text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700'></div>
                        Procesando...
                      </>
                    ) : (
                      <>
                        <CreditCard size={18} />
                        Confirmar Reserva
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Información Adicional */}
              <div className='bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10'>
                <h3 className='text-lg font-semibold text-white mb-3'>
                  Información Adicional
                </h3>
                <textarea
                  value={bookingForm.specialRequests}
                  onChange={(e) =>
                    handleFormChange('specialRequests', e.target.value)
                  }
                  placeholder='Requisitos especiales, temas musicales preferidos, instrucciones del venue...'
                  rows={4}
                  className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none'
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Galería de imágenes */}
      <div className='rounded-xl shadow-lg overflow-hidden bg-gray-900'>
        <div className='p-6 md:p-8'>
          <h2 className='text-2xl font-bold text-white mb-6 flex items-center'>
            <Music className={`mr-2 text-${primaryColor}-500`} size={22} />
            {t('musicDetails.gallery')}
          </h2>

          <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
            {musicGallery.map((image, index) => (
              <div
                key={index}
                className='relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer group'
                onClick={() => setSelectedImageIndex(index)}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className='object-cover transition-transform duration-500 group-hover:scale-110'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3'>
                  <p className='text-white text-sm font-medium'>
                    {image.type.charAt(0).toUpperCase() + image.type.slice(1)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hero section con imagen de fondo y call-to-action */}
      <div className='relative overflow-hidden rounded-2xl shadow-xl'>
        <div className='absolute inset-0 bg-black'>
          <Image
            src='https://images.unsplash.com/photo-1496449903678-68ddcb189a24?q=80&w=2940&auto=format&fit=crop'
            alt='Live music performance'
            fill
            className='object-cover opacity-80'
          />
          <div className='absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/30' />
        </div>

        <div className='relative z-10 px-8 py-16 md:py-24 md:px-12 max-w-4xl'>
          <span
            className={`inline-block px-3 py-1 rounded-full bg-${primaryColor}-500/20 text-${primaryColor}-400 text-sm font-medium mb-4`}
          >
            {t('musicDetails.transformYourEvent')}
          </span>

          <h1 className='text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight'>
            {serviceData?.titleKey ? t(serviceData.titleKey) : service.name}
          </h1>

          <p className='text-lg md:text-xl text-gray-300 mb-8 leading-relaxed max-w-3xl'>
            {serviceData?.descriptionKey
              ? t(serviceData.descriptionKey)
              : service.description}
          </p>

          <div className='flex flex-wrap gap-4'>
            <a
              href='#booking-details'
              className={`px-6 py-3 bg-${primaryColor}-500 hover:bg-${primaryColor}-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2`}
            >
              <Calendar size={18} />
              {t('serviceDetails.bookNow')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveMusicServiceView;
