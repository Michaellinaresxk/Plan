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
} from 'lucide-react';

interface MassageServiceViewProps {
  service: Service;
  serviceData?: ServiceData;
  primaryColor?: string;
  viewContext?: 'standard-view' | 'premium-view';
}

// 🕯️ Configuración extendida con más contenido visual
const MASSAGE_TYPES = [
  {
    id: 'relaxing',
    name: 'Masaje Relajante',
    tagline: 'Encuentra tu paz interior',
    icon: '🌿',
    price: 120,
    duration: 60,
    gradient: 'from-stone-100 to-amber-50',
    accent: 'stone-600',
    description:
      'Un viaje hacia la tranquilidad absoluta con técnicas suaves que liberan el estrés acumulado',
    longDescription:
      'Sumérgete en una experiencia de relajación profunda donde cada movimiento está diseñado para liberar tensiones y restaurar tu equilibrio natural. Utilizamos aceites esenciales de lavanda y manzanilla para crear un ambiente de serenidad total.',
    benefits: [
      'Reduce estrés y ansiedad',
      'Mejora calidad del sueño',
      'Calma mental profunda',
      'Libera tensión muscular',
    ],
    image:
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=800&auto=format&fit=crop',
    galleryImages: [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=600&auto=format&fit=crop',
    ],
  },
  {
    id: 'deep',
    name: 'Tejido Profundo',
    tagline: 'Libera, restaura, renueva',
    icon: '💆‍♀️',
    price: 130,
    duration: 60,
    gradient: 'from-slate-100 to-stone-50',
    accent: 'slate-600',
    description:
      'Terapia restaurativa especializada para músculos tensos y contracturas profundas',
    longDescription:
      'Técnica terapéutica avanzada que alcanza las capas más profundas del tejido muscular. Ideal para atletas, personas con trabajos sedentarios o quienes sufren de tensión crónica. Cada sesión es personalizada según tus necesidades específicas.',
    benefits: [
      'Alivia tensión muscular crónica',
      'Restaura movilidad articular',
      'Mejora circulación sanguínea',
      'Reduce dolor localizado',
    ],
    image:
      'https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=800&auto=format&fit=crop',
    galleryImages: [
      'https://images.unsplash.com/photo-1559844307-58f3e5c8c12d?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=600&auto=format&fit=crop',
    ],
  },
  {
    id: 'thai',
    name: 'Masaje Tailandés',
    tagline: 'Equilibrio ancestral',
    icon: '🧘‍♀️',
    price: 100,
    duration: 60,
    gradient: 'from-amber-50 to-orange-50',
    accent: 'amber-600',
    description:
      'Técnica milenaria que combina estiramientos asistidos con digitopresión',
    longDescription:
      'Conocido como "yoga pasivo", esta técnica ancestral tailandesa combina estiramientos suaves, presión sobre puntos de energía y movimientos rítmicos. Sin aceites, se realiza con ropa cómoda sobre un futón especial.',
    benefits: [
      'Aumenta flexibilidad significativamente',
      'Equilibra flujo de energía',
      'Libera tensión articular',
      'Mejora postura corporal',
    ],
    image:
      'https://images.unsplash.com/photo-1559844307-58f3e5c8c12d?q=80&w=800&auto=format&fit=crop',
    galleryImages: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=600&auto=format&fit=crop',
    ],
  },
  {
    id: 'prenatal',
    name: 'Masaje Prenatal',
    tagline: 'Cuidado especial para ti',
    icon: '🌸',
    price: 100,
    duration: 60,
    gradient: 'from-rose-50 to-pink-50',
    accent: 'rose-500',
    description:
      'Cuidado especializado y seguro durante el hermoso proceso del embarazo',
    longDescription:
      'Diseñado específicamente para mujeres embarazadas, este masaje utiliza técnicas seguras y posiciones cómodas. Ayuda a aliviar molestias comunes del embarazo mientras promueve la relajación y el bienestar tanto de mamá como bebé.',
    benefits: [
      'Alivia molestias del embarazo',
      'Reduce hinchazón de extremidades',
      'Promueve descanso reparador',
      'Mejora circulación',
    ],
    image:
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=800&auto=format&fit=crop',
    galleryImages: [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=600&auto=format&fit=crop',
    ],
  },
  {
    id: 'hot-stone',
    name: 'Piedras Calientes',
    tagline: 'Calor que sana profundamente',
    icon: '🪨',
    price: 150,
    duration: 90,
    gradient: 'from-stone-200 to-slate-100',
    accent: 'stone-700',
    description:
      'Terapia ancestral con piedras volcánicas que penetra hasta los músculos más profundos',
    longDescription:
      'Piedras de basalto volcánico calentadas a temperatura perfecta se colocan estratégicamente en puntos clave del cuerpo. El calor penetra profundamente, relajando músculos y creando una sensación de bienestar incomparable.',
    benefits: [
      'Relajación muscular profunda',
      'Mejora circulación significativamente',
      'Calor terapéutico duradero',
      'Reduce inflamación',
    ],
    image:
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800&auto=format&fit=crop',
    galleryImages: [
      'https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=600&auto=format&fit=crop',
    ],
    isPremium: true,
  },
  {
    id: 'aromatherapy',
    name: 'Aromaterapia',
    tagline: 'Despertar de los sentidos',
    icon: '🌺',
    price: 125,
    duration: 60,
    gradient: 'from-violet-50 to-purple-50',
    accent: 'violet-500',
    description:
      'Experiencia sensorial completa con aceites esenciales puros y técnicas especializadas',
    longDescription:
      'Combina el poder curativo del tacto con la aromaterapia. Utilizamos aceites esenciales 100% puros seleccionados según tu estado emocional y necesidades. Cada aroma tiene propiedades terapéuticas específicas que potencian los beneficios del masaje.',
    benefits: [
      'Experiencia sensorial única',
      'Equilibra emociones naturalmente',
      'Nutrición profunda de la piel',
      'Aromas terapéuticos duraderos',
    ],
    image:
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800&auto=format&fit=crop',
    galleryImages: [
      'https://images.unsplash.com/photo-1559844307-58f3e5c8c12d?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=600&auto=format&fit=crop',
    ],
    isPremium: true,
  },
];

const DURATION_OPTIONS = [
  {
    duration: '60',
    label: '60 minutos',
    multiplier: 1.0,
    desc: 'Sesión estándar perfecta',
    popular: true,
    details: 'Tiempo ideal para una experiencia completa y relajante',
  },
  {
    duration: '90',
    label: '90 minutos',
    multiplier: 1.4,
    desc: 'Experiencia extendida',
    details: 'Permite trabajar áreas específicas con mayor profundidad',
  },
  {
    duration: '120',
    label: '2 horas',
    multiplier: 1.8,
    desc: 'Relajación total',
    details:
      'Experiencia completa de spa con tiempo para desconectar totalmente',
  },
];

// Galería de inspiración para el ambiente spa
const AMBIANCE_GALLERY = [
  {
    image:
      'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?q=80&w=800&auto=format&fit=crop',
    title: 'Ambiente Sereno',
    description: 'Creamos el espacio perfecto para tu relajación',
  },
  {
    image:
      'https://images.unsplash.com/photo-1583416750470-965b2707b355?q=80&w=800&auto=format&fit=crop',
    title: 'Productos Premium',
    description: 'Aceites y esencias de la más alta calidad',
  },
  {
    image:
      'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=800&auto=format&fit=crop',
    title: 'Técnicas Profesionales',
    description: 'Movimientos precisos y terapéuticos',
  },
];

// 🧮 Cálculo de precio
const calculatePrice = (selectedType: string, selectedDuration: string) => {
  const massageType = MASSAGE_TYPES.find((t) => t.id === selectedType);
  const duration = DURATION_OPTIONS.find(
    (d) => d.duration === selectedDuration
  );

  if (!massageType || !duration) return massageType?.price || 0;

  return Math.round(massageType.price * duration.multiplier);
};

const MassageServiceView: React.FC<MassageServiceViewProps> = ({
  service,
  serviceData,
  primaryColor = 'stone',
  viewContext = 'standard-view',
}) => {
  const { t } = useTranslation();
  const { bookService } = useBooking();

  // 🎛️ Estado expandido
  const [selectedType, setSelectedType] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('60');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedMassage, setExpandedMassage] = useState<string | null>(null);

  // 💰 Cálculo del precio
  const totalPrice = calculatePrice(selectedType, selectedDuration);
  const selectedMassage = MASSAGE_TYPES.find((t) => t.id === selectedType);

  // 🎭 Animaciones más fluidas
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

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  // 🎯 Handlers
  const handleTypeSelect = useCallback((typeId: string) => {
    setSelectedType(typeId);
    setExpandedMassage(typeId);
  }, []);

  const handleBooking = useCallback(
    (service: Service, dates: BookingDate, guests: number) => {
      bookService(service, dates, guests);
      setIsModalOpen(false);
    },
    [bookService]
  );

  return (
    <div className='min-h-screen bg-gradient-to-b from-stone-50 via-amber-25 to-stone-100'>
      <div className='max-w-7xl mx-auto'>
        {/* 🌅 Hero Section Expandido */}
        <motion.section
          className='relative h-screen flex items-center justify-center px-6'
          initial='hidden'
          animate='visible'
          variants={fadeUp}
        >
          <div className='absolute inset-0 z-0'>
            <Image
              src='https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=1600&auto=format&fit=crop'
              alt='Experiencia spa de lujo'
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
                Santuario de Bienestar Premium
              </span>
            </motion.div>

            <motion.h1
              className='text-6xl md:text-8xl font-light text-white mb-8 leading-tight'
              variants={fadeUp}
            >
              Terapia de
              <br />
              <span className='font-normal'>Masajes</span>
            </motion.h1>

            <motion.p
              className='text-2xl md:text-3xl text-white/90 mb-16 leading-relaxed font-light max-w-3xl mx-auto'
              variants={fadeUp}
            >
              Redescubre la armonía entre cuerpo y mente en un viaje sensorial
              diseñado para restaurar tu energía vital
            </motion.p>

            <motion.div
              className='flex flex-col items-center'
              variants={fadeUp}
            >
              <button
                onClick={() => {
                  document.getElementById('massage-selection')?.scrollIntoView({
                    behavior: 'smooth',
                  });
                }}
                className='bg-white/10 backdrop-blur-md text-white px-12 py-6 rounded-2xl font-medium text-xl border border-white/30 hover:bg-white/20 transition-all duration-300 mb-8'
              >
                Explorar Experiencias
              </button>

              <div className='text-white/70 text-sm'>
                ↓ Descubre tu sanación perfecta
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* 🖼️ Galería de Ambiente - Nuevo */}
        <motion.section
          className='py-32 px-6'
          initial='hidden'
          animate='visible'
          variants={stagger}
        >
          <motion.div className='text-center mb-20' variants={fadeUp}>
            <h2 className='text-5xl md:text-6xl font-light text-stone-800 mb-8'>
              Tu Oasis Personal
            </h2>
            <p className='text-xl text-stone-600 max-w-3xl mx-auto font-light leading-relaxed'>
              Cada detalle está cuidadosamente diseñado para crear un ambiente
              de tranquilidad absoluta en la privacidad de tu espacio
            </p>
          </motion.div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-20'>
            {AMBIANCE_GALLERY.map((item, index) => (
              <motion.div
                key={index}
                className='group relative overflow-hidden rounded-3xl shadow-2xl'
                variants={scaleIn}
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

                <div className='absolute bottom-0 left-0 right-0 p-8 text-white'>
                  <h3 className='text-2xl font-light mb-3'>{item.title}</h3>
                  <p className='text-white/90 leading-relaxed'>
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
                "El cuerpo es tu templo. Manténlo puro y limpio para que el alma
                more en él."
              </blockquote>
              <cite className='text-xl text-stone-500 font-medium'>
                — B.K.S. Iyengar
              </cite>
            </div>
          </motion.div>
        </motion.section>

        {/* 🕯️ Selección de Masajes Expandida */}
        <motion.section
          id='massage-selection'
          className='py-32 px-6 bg-white/50 backdrop-blur-sm'
          initial='hidden'
          animate='visible'
          variants={stagger}
        >
          <motion.div className='text-center mb-24' variants={fadeUp}>
            <h2 className='text-5xl md:text-6xl font-light text-stone-800 mb-8'>
              Encuentra Tu Equilibrio
            </h2>
            <p className='text-2xl text-stone-600 max-w-4xl mx-auto font-light leading-relaxed'>
              Cada técnica es un viaje único hacia el bienestar, cuidadosamente
              seleccionada para nutrir tu cuerpo y alma
            </p>
          </motion.div>

          <div className='space-y-16'>
            {MASSAGE_TYPES.map((massage, index) => (
              <motion.div
                key={massage.id}
                className={`relative overflow-hidden rounded-3xl shadow-2xl transition-all duration-700 ${
                  selectedType === massage.id
                    ? 'ring-4 ring-stone-300 shadow-3xl'
                    : 'hover:shadow-3xl'
                }`}
                variants={fadeUp}
                onClick={() => handleTypeSelect(massage.id)}
              >
                <div
                  className={`grid grid-cols-1 lg:grid-cols-2 min-h-[600px] ${
                    index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
                  }`}
                >
                  {/* Imagen principal */}
                  <div
                    className={`relative overflow-hidden ${
                      index % 2 === 1 ? 'lg:col-start-2' : ''
                    }`}
                  >
                    <Image
                      src={massage.image}
                      alt={massage.name}
                      fill
                      className='object-cover hover:scale-110 transition-transform duration-1000'
                    />

                    {massage.isPremium && (
                      <div className='absolute top-8 right-8 bg-white/20 backdrop-blur-md text-white px-6 py-3 rounded-full font-medium border border-white/30'>
                        Experiencia Premium
                      </div>
                    )}

                    <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent' />

                    {/* Precio en imagen */}
                    <div className='absolute bottom-8 left-8 text-white'>
                      <div className='text-4xl font-light mb-2'>
                        ${massage.price}
                      </div>
                      <div className='text-white/90'>
                        {massage.duration} minutos
                      </div>
                    </div>
                  </div>

                  {/* Contenido */}
                  <div
                    className={`bg-gradient-to-br ${
                      massage.gradient
                    } p-12 lg:p-16 flex flex-col justify-center ${
                      index % 2 === 1 ? 'lg:col-start-1' : ''
                    }`}
                  >
                    <div className='mb-8'>
                      <div className='flex items-center mb-6'>
                        <span className='text-5xl mr-4'>{massage.icon}</span>
                        <div>
                          <h3 className='text-3xl font-light text-stone-800 mb-2'>
                            {massage.name}
                          </h3>
                          <p className='text-lg text-stone-600 italic'>
                            {massage.tagline}
                          </p>
                        </div>
                      </div>

                      <p className='text-xl text-stone-700 leading-relaxed mb-8'>
                        {massage.description}
                      </p>

                      <div className='space-y-3 mb-8'>
                        {massage.benefits.map((benefit, idx) => (
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

                      {selectedType === massage.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          transition={{ duration: 0.5 }}
                          className='border-t border-stone-200 pt-8'
                        >
                          <p className='text-stone-600 leading-relaxed mb-6'>
                            {massage.longDescription}
                          </p>

                          {/* Mini galería */}
                          <div className='grid grid-cols-3 gap-4'>
                            {massage.galleryImages.map((img, imgIdx) => (
                              <div
                                key={imgIdx}
                                className='aspect-square relative rounded-xl overflow-hidden'
                              >
                                <Image
                                  src={img}
                                  alt={`${massage.name} ${imgIdx + 1}`}
                                  fill
                                  className='object-cover hover:scale-110 transition-transform duration-500'
                                />
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </div>

                    <button
                      className={`self-start px-8 py-4 rounded-2xl font-medium transition-all duration-300 ${
                        selectedType === massage.id
                          ? 'bg-stone-700 text-white shadow-lg'
                          : 'bg-white/80 text-stone-700 hover:bg-white hover:shadow-lg'
                      }`}
                    >
                      {selectedType === massage.id ? (
                        <span className='flex items-center'>
                          <CheckCircle className='w-5 h-5 mr-2' />
                          Seleccionado
                        </span>
                      ) : (
                        'Seleccionar Esta Experiencia'
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ⏱️ Duración Expandida */}
        {selectedType && (
          <motion.section
            className='py-32 px-6'
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className='max-w-5xl mx-auto'>
              <div className='text-center mb-20'>
                <h3 className='text-4xl md:text-5xl font-light text-stone-800 mb-8'>
                  Personaliza Tu Experiencia
                </h3>
                <p className='text-xl text-stone-600 max-w-3xl mx-auto leading-relaxed'>
                  Elige la duración que mejor se adapte a tu ritmo y necesidades
                  de relajación
                </p>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                {DURATION_OPTIONS.map((option) => (
                  <motion.div
                    key={option.duration}
                    className={`relative p-10 rounded-2xl cursor-pointer transition-all duration-500 ${
                      selectedDuration === option.duration
                        ? 'bg-stone-800 text-white shadow-2xl scale-105'
                        : 'bg-white text-stone-700 shadow-lg hover:shadow-xl hover:scale-102'
                    }`}
                    onClick={() => setSelectedDuration(option.duration)}
                    whileHover={{ y: -8 }}
                  >
                    {option.popular && (
                      <div className='absolute -top-4 left-1/2 transform -translate-x-1/2 bg-stone-600 text-white px-4 py-2 rounded-full text-sm font-medium'>
                        Más Popular
                      </div>
                    )}

                    <div className='text-center'>
                      <div className='text-4xl font-light mb-4'>
                        {option.label}
                      </div>
                      <div
                        className={`text-lg font-medium mb-4 ${
                          selectedDuration === option.duration
                            ? 'text-stone-200'
                            : 'text-stone-600'
                        }`}
                      >
                        {option.desc}
                      </div>
                      <p
                        className={`text-sm leading-relaxed mb-6 ${
                          selectedDuration === option.duration
                            ? 'text-stone-300'
                            : 'text-stone-500'
                        }`}
                      >
                        {option.details}
                      </p>

                      {selectedType && (
                        <div
                          className={`pt-6 border-t ${
                            selectedDuration === option.duration
                              ? 'border-stone-600'
                              : 'border-stone-200'
                          }`}
                        >
                          <div className='text-3xl font-light'>
                            ${calculatePrice(selectedType, option.duration)}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {/* 🌿 Proceso y Experiencia - Nuevo */}
        <motion.section
          className='py-32 px-6 bg-gradient-to-b from-stone-100 to-amber-50'
          initial='hidden'
          animate='visible'
          variants={stagger}
        >
          <motion.div className='text-center mb-20' variants={fadeUp}>
            <h3 className='text-4xl md:text-5xl font-light text-stone-800 mb-8'>
              Un Ritual de Bienestar
            </h3>
            <p className='text-xl text-stone-600 max-w-3xl mx-auto leading-relaxed'>
              Cada sesión es cuidadosamente orquestada para crear una
              experiencia transformadora desde el primer momento
            </p>
          </motion.div>

          <div className='max-w-6xl mx-auto'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20'>
              <motion.div variants={fadeUp}>
                <h4 className='text-3xl font-light text-stone-800 mb-8'>
                  Preparación del Santuario
                </h4>

                <div className='space-y-8'>
                  {[
                    {
                      step: '01',
                      title: 'Llegada y Configuración',
                      description:
                        'Nuestro terapeuta llega 15 minutos antes para preparar tu espacio personal con mesa profesional, música relajante y aromaterapia sutil.',
                    },
                    {
                      step: '02',
                      title: 'Consulta Personalizada',
                      description:
                        'Conversación inicial sobre tus necesidades, preferencias de presión, áreas de tensión y objetivos de la sesión.',
                    },
                    {
                      step: '03',
                      title: 'Ambiente Perfecto',
                      description:
                        'Ajuste de temperatura, iluminación suave y selección de aceites esenciales según tu estado emocional del día.',
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

              <motion.div className='relative' variants={scaleIn}>
                <div className='relative h-[600px] rounded-3xl overflow-hidden shadow-2xl'>
                  <Image
                    src='https://images.unsplash.com/photo-1596178065887-1198b6148b2b?q=80&w=800&auto=format&fit=crop'
                    alt='Preparación del ambiente spa'
                    fill
                    className='object-cover'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent' />

                  <div className='absolute bottom-8 left-8 right-8 text-white'>
                    <h5 className='text-2xl font-light mb-3'>
                      Tu Espacio, Transformado
                    </h5>
                    <p className='text-white/90 leading-relaxed'>
                      Convertimos cualquier habitación en un oasis de
                      tranquilidad con equipamiento profesional y atención a
                      cada detalle.
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
                  title: 'Aceites Premium',
                  description: '100% naturales y orgánicos',
                },
                {
                  image:
                    'https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=600&auto=format&fit=crop',
                  title: 'Técnicas Expertas',
                  description: 'Movimientos precisos y terapéuticos',
                },
                {
                  image:
                    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=600&auto=format&fit=crop',
                  title: 'Piedras Volcánicas',
                  description: 'Calor terapéutico natural',
                },
                {
                  image:
                    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=600&auto=format&fit=crop',
                  title: 'Aromas Puros',
                  description: 'Esencias seleccionadas cuidadosamente',
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className='group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500'
                  variants={scaleIn}
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

        {/* 📋 Lo Que Incluye - Expandido */}
        <motion.section
          className='py-32 px-6'
          initial='hidden'
          animate='visible'
          variants={stagger}
        >
          <motion.div className='text-center mb-20' variants={fadeUp}>
            <h3 className='text-4xl md:text-5xl font-light text-stone-800 mb-8'>
              Una Experiencia Completa
            </h3>
            <p className='text-xl text-stone-600 max-w-3xl mx-auto leading-relaxed'>
              Cada detalle está incluido para que solo te enfoques en relajarte
              y disfrutar
            </p>
          </motion.div>

          <div className='max-w-6xl mx-auto'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20'>
              {/* Lo que está incluido */}
              <motion.div
                className='bg-white rounded-3xl shadow-xl p-12'
                variants={scaleIn}
              >
                <h4 className='text-2xl font-light text-stone-800 mb-10 flex items-center'>
                  <Heart className='w-8 h-8 text-stone-600 mr-4' />
                  Todo Incluido
                </h4>

                <div className='space-y-8'>
                  {[
                    {
                      icon: Shield,
                      title: 'Terapeuta Certificado',
                      desc: 'Profesionales con más de 500 horas de entrenamiento y certificaciones internacionales en técnicas especializadas.',
                    },
                    {
                      icon: Leaf,
                      title: 'Productos Orgánicos Premium',
                      desc: 'Aceites esenciales 100% puros, cremas nutritivas y productos naturales seleccionados por sus propiedades terapéuticas.',
                    },
                    {
                      icon: Home,
                      title: 'Instalación Profesional',
                      desc: 'Mesa de masaje profesional, sábanas de algodón egipcio, música relajante y aromaterapia ambiental.',
                    },
                    {
                      icon: Timer,
                      title: 'Consulta Personalizada',
                      desc: 'Evaluación previa de necesidades, preferencias y creación de un plan de tratamiento único para ti.',
                    },
                    {
                      icon: Heart,
                      title: 'Seguimiento Post-Sesión',
                      desc: 'Recomendaciones personalizadas y consejos para prolongar los beneficios de tu experiencia.',
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
                  <h4 className='text-2xl font-light mb-8'>
                    Nuestros Terapeutas
                  </h4>

                  <div className='space-y-6'>
                    {[
                      {
                        name: 'Elena Martínez',
                        specialty: 'Especialista en Tejido Profundo',
                        experience: '8 años de experiencia',
                        certification:
                          'Certificada en Técnicas Suecas y Tailandesas',
                      },
                      {
                        name: 'Carlos Mendoza',
                        specialty: 'Maestro en Masaje Tailandés',
                        experience: '12 años de experiencia',
                        certification: 'Formación tradicional en Tailandia',
                      },
                      {
                        name: 'Ana Silva',
                        specialty: 'Terapeuta Prenatal Certificada',
                        experience: '10 años de experiencia',
                        certification: 'Especialización en Aromaterapia',
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
                      "Cada sesión es una experiencia transformadora. El nivel
                      de profesionalismo y cuidado personal es excepcional."
                    </blockquote>
                    <cite className='text-stone-600 font-medium'>
                      — Sofía Restrepo, huésped frecuente
                    </cite>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* 💰 Confirmación y Reserva - Expandido */}
        {selectedType && (
          <motion.section
            className='py-32 px-6 bg-gradient-to-b from-stone-800 to-stone-900'
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className='max-w-4xl mx-auto text-center text-white'>
              <h3 className='text-4xl md:text-5xl font-light mb-12'>
                Tu Experiencia Personalizada
              </h3>

              {/* Resumen visual */}
              <div className='bg-white/10 backdrop-blur-sm rounded-3xl p-12 mb-16 border border-white/20'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-12 items-center'>
                  <div className='relative h-80 rounded-2xl overflow-hidden'>
                    <Image
                      src={selectedMassage?.image || ''}
                      alt={selectedMassage?.name || ''}
                      fill
                      className='object-cover'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent' />

                    <div className='absolute bottom-6 left-6 right-6'>
                      <div className='text-3xl mb-3'>
                        {selectedMassage?.icon}
                      </div>
                      <h4 className='text-2xl font-light'>
                        {selectedMassage?.name}
                      </h4>
                      <p className='text-white/90 mt-2'>
                        {selectedMassage?.tagline}
                      </p>
                    </div>
                  </div>

                  <div className='text-left space-y-6'>
                    <div className='flex justify-between items-center pb-4 border-b border-white/20'>
                      <span className='text-lg'>Duración seleccionada:</span>
                      <span className='text-xl font-medium'>
                        {
                          DURATION_OPTIONS.find(
                            (d) => d.duration === selectedDuration
                          )?.label
                        }
                      </span>
                    </div>

                    <div className='flex justify-between items-center pb-4 border-b border-white/20'>
                      <span className='text-lg'>Experiencia:</span>
                      <span className='text-xl font-medium'>
                        {selectedMassage?.name}
                      </span>
                    </div>

                    <div className='flex justify-between items-center pb-4 border-b border-white/20'>
                      <span className='text-lg'>Incluye:</span>
                      <span className='text-sm text-white/80 text-right'>
                        Mesa profesional, aceites premium,
                        <br />
                        consulta personalizada, seguimiento
                      </span>
                    </div>

                    <div className='flex justify-between items-center pt-4'>
                      <span className='text-2xl font-light'>Total:</span>
                      <span className='text-4xl font-light'>${totalPrice}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className='space-y-6'>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className='w-full md:w-auto bg-white text-stone-800 px-16 py-6 rounded-2xl font-medium text-xl hover:bg-stone-50 transition-colors flex items-center justify-center gap-4 mx-auto group'
                >
                  <Heart className='w-6 h-6 group-hover:scale-110 transition-transform' />
                  Reservar Mi Experiencia de Bienestar
                  <ArrowRight className='w-6 h-6 group-hover:translate-x-2 transition-transform' />
                </button>

                <div className='flex justify-center gap-12 text-stone-300 text-sm'>
                  <div className='flex items-center gap-3'>
                    <Phone className='w-5 h-5' />
                    <span>Asesoría personalizada</span>
                  </div>
                  <div className='flex items-center gap-3'>
                    <CheckCircle className='w-5 h-5' />
                    <span>Cancelación hasta 4h antes</span>
                  </div>
                  <div className='flex items-center gap-3'>
                    <Shield className='w-5 h-5' />
                    <span>100% seguro y confiable</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* 🌸 Sección Final Inspiracional */}
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
                Más que un masaje,
                <br />
                una transformación personal
              </h3>
              <p className='text-2xl text-stone-600 leading-relaxed max-w-3xl mx-auto'>
                Permítete este momento de conexión profunda contigo mismo. Tu
                bienestar no es un lujo, es una necesidad.
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
              {[
                {
                  icon: '🌱',
                  title: 'Renovación',
                  description:
                    'Cada sesión es un nuevo comienzo para tu cuerpo y mente',
                },
                {
                  icon: '💫',
                  title: 'Equilibrio',
                  description:
                    'Encuentra la armonía perfecta entre relajación y revitalización',
                },
                {
                  icon: '🕊️',
                  title: 'Paz Interior',
                  description:
                    'Experimenta una calma profunda que trasciende lo físico',
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
      </div>

      {/* 📱 Modal de Reserva */}
      {isModalOpen && (
        <BookingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleBooking}
          service={service}
        />
      )}
    </div>
  );
};

export default MassageServiceView;
