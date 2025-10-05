import React, { useState, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useReservation } from '@/context/BookingContext';
import {
  Leaf,
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
import { useTranslation } from '@/lib/i18n/client';

const MassageServiceView = () => {
  const router = useRouter();
  const { t } = useTranslation();
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

  // Build massage services from translations
  const SPA_SERVICES = useMemo(
    () => ({
      massages: [
        {
          id: 'swedish',
          name: t('services.standard.massageView.massages.swedish.name'),
          description: t(
            'services.standard.massageView.massages.swedish.description'
          ),
          longDescription: t(
            'services.standard.massageView.massages.swedish.longDescription'
          ),
          category: 'relaxation',
          durations: [
            { duration: 60, price: 120, popular: false },
            { duration: 90, price: 160, popular: true },
          ],
          emoji: t('services.standard.massageView.massages.swedish.emoji'),
          maxPersons: 4,
          intensity: 'gentle',
          isPremium: false,
          imageUrl:
            'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800',
          benefits: [
            t('services.standard.massageView.massages.swedish.benefits.stress'),
            t(
              'services.standard.massageView.massages.swedish.benefits.circulation'
            ),
            t('services.standard.massageView.massages.swedish.benefits.sleep'),
            t(
              'services.standard.massageView.massages.swedish.benefits.relaxation'
            ),
          ],
          perfectFor: [
            t(
              'services.standard.massageView.massages.swedish.perfectFor.firstTime'
            ),
            t(
              'services.standard.massageView.massages.swedish.perfectFor.stress'
            ),
            t(
              'services.standard.massageView.massages.swedish.perfectFor.wellness'
            ),
          ],
          techniques: [
            t(
              'services.standard.massageView.massages.swedish.techniques.strokes'
            ),
            t(
              'services.standard.massageView.massages.swedish.techniques.kneading'
            ),
            t(
              'services.standard.massageView.massages.swedish.techniques.aromatherapy'
            ),
          ],
        },
        {
          id: 'deep-tissue',
          name: t('services.standard.massageView.massages.deepTissue.name'),
          description: t(
            'services.standard.massageView.massages.deepTissue.description'
          ),
          longDescription: t(
            'services.standard.massageView.massages.deepTissue.longDescription'
          ),
          category: 'therapeutic',
          durations: [
            { duration: 60, price: 140, popular: false },
            { duration: 90, price: 180, popular: true },
          ],
          emoji: t('services.standard.massageView.massages.deepTissue.emoji'),
          maxPersons: 2,
          intensity: 'strong',
          isPremium: true,
          imageUrl:
            'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800',
          benefits: [
            t(
              'services.standard.massageView.massages.deepTissue.benefits.pain'
            ),
            t(
              'services.standard.massageView.massages.deepTissue.benefits.tension'
            ),
            t(
              'services.standard.massageView.massages.deepTissue.benefits.mobility'
            ),
            t(
              'services.standard.massageView.massages.deepTissue.benefits.recovery'
            ),
          ],
          perfectFor: [
            t(
              'services.standard.massageView.massages.deepTissue.perfectFor.athletes'
            ),
            t(
              'services.standard.massageView.massages.deepTissue.perfectFor.pain'
            ),
            t(
              'services.standard.massageView.massages.deepTissue.perfectFor.injury'
            ),
          ],
          techniques: [
            t(
              'services.standard.massageView.massages.deepTissue.techniques.pressure'
            ),
            t(
              'services.standard.massageView.massages.deepTissue.techniques.trigger'
            ),
            t(
              'services.standard.massageView.massages.deepTissue.techniques.myofascial'
            ),
          ],
        },
        {
          id: 'hot-stone',
          name: t('services.standard.massageView.massages.hotStone.name'),
          description: t(
            'services.standard.massageView.massages.hotStone.description'
          ),
          longDescription: t(
            'services.standard.massageView.massages.hotStone.longDescription'
          ),
          category: 'signature',
          durations: [{ duration: 90, price: 200, popular: true }],
          emoji: t('services.standard.massageView.massages.hotStone.emoji'),
          maxPersons: 2,
          intensity: 'medium',
          isPremium: true,
          imageUrl:
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
          benefits: [
            t(
              'services.standard.massageView.massages.hotStone.benefits.relaxation'
            ),
            t('services.standard.massageView.massages.hotStone.benefits.blood'),
            t(
              'services.standard.massageView.massages.hotStone.benefits.tension'
            ),
            t(
              'services.standard.massageView.massages.hotStone.benefits.spiritual'
            ),
          ],
          perfectFor: [
            t(
              'services.standard.massageView.massages.hotStone.perfectFor.relaxation'
            ),
            t(
              'services.standard.massageView.massages.hotStone.perfectFor.weather'
            ),
            t(
              'services.standard.massageView.massages.hotStone.perfectFor.spiritual'
            ),
          ],
          techniques: [
            t(
              'services.standard.massageView.massages.hotStone.techniques.placement'
            ),
            t(
              'services.standard.massageView.massages.hotStone.techniques.massage'
            ),
            t(
              'services.standard.massageView.massages.hotStone.techniques.energy'
            ),
          ],
        },
        {
          id: 'aromatherapy',
          name: t('services.standard.massageView.massages.aromatherapy.name'),
          description: t(
            'services.standard.massageView.massages.aromatherapy.description'
          ),
          longDescription: t(
            'services.standard.massageView.massages.aromatherapy.longDescription'
          ),
          category: 'relaxation',
          durations: [
            { duration: 60, price: 130, popular: false },
            { duration: 90, price: 170, popular: true },
          ],
          emoji: t('services.standard.massageView.massages.aromatherapy.emoji'),
          maxPersons: 3,
          intensity: 'gentle',
          isPremium: false,
          imageUrl:
            'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=800',
          benefits: [
            t(
              'services.standard.massageView.massages.aromatherapy.benefits.clarity'
            ),
            t(
              'services.standard.massageView.massages.aromatherapy.benefits.balance'
            ),
            t(
              'services.standard.massageView.massages.aromatherapy.benefits.stress'
            ),
            t(
              'services.standard.massageView.massages.aromatherapy.benefits.mood'
            ),
          ],
          perfectFor: [
            t(
              'services.standard.massageView.massages.aromatherapy.perfectFor.emotional'
            ),
            t(
              'services.standard.massageView.massages.aromatherapy.perfectFor.lovers'
            ),
            t(
              'services.standard.massageView.massages.aromatherapy.perfectFor.holistic'
            ),
          ],
          techniques: [
            t(
              'services.standard.massageView.massages.aromatherapy.techniques.blending'
            ),
            t(
              'services.standard.massageView.massages.aromatherapy.techniques.lymphatic'
            ),
            t(
              'services.standard.massageView.massages.aromatherapy.techniques.chakra'
            ),
          ],
        },
        {
          id: 'prenatal',
          name: t('services.standard.massageView.massages.prenatal.name'),
          description: t(
            'services.standard.massageView.massages.prenatal.description'
          ),
          longDescription: t(
            'standard.massageView.massages.prenatal.longDescription'
          ),
          category: 'therapeutic',
          durations: [{ duration: 60, price: 150, popular: true }],
          emoji: t('standard.massageView.massages.prenatal.emoji'),
          maxPersons: 1,
          intensity: 'gentle',
          isPremium: true,
          imageUrl:
            'https://images.unsplash.com/photo-1527196850338-c9e2cfac4d5a?w=800',
          benefits: [
            t(
              'services.standard.massageView.massages.prenatal.benefits.comfort'
            ),
            t(
              'services.standard.massageView.massages.prenatal.benefits.swelling'
            ),
            t('services.standard.massageView.massages.prenatal.benefits.pain'),
            t('services.standard.massageView.massages.prenatal.benefits.sleep'),
          ],
          perfectFor: [
            t(
              'services.standard.massageView.massages.prenatal.perfectFor.pregnant'
            ),
            t(
              'services.standard.massageView.massages.prenatal.perfectFor.pain'
            ),
            t(
              'services.standard.massageView.massages.prenatal.perfectFor.support'
            ),
          ],
          techniques: [
            t(
              'services.standard.massageView.massages.prenatal.techniques.positioning'
            ),
            t(
              'services.standard.massageView.massages.prenatal.techniques.pressure'
            ),
            t(
              'services.standard.massageView.massages.prenatal.techniques.safe'
            ),
          ],
        },
        {
          id: 'sports',
          name: t('services.standard.massageView.massages.sports.name'),
          description: t(
            'services.standard.massageView.massages.sports.description'
          ),
          longDescription: t(
            'services.standard.massageView.massages.sports.longDescription'
          ),
          category: 'therapeutic',
          durations: [
            { duration: 60, price: 155, popular: false },
            { duration: 90, price: 195, popular: true },
          ],
          emoji: t('sservices.tandard.massageView.massages.sports.emoji'),
          maxPersons: 2,
          intensity: 'strong',
          isPremium: false,
          imageUrl:
            'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
          benefits: [
            t(
              'services.standard.massageView.massages.sports.benefits.performance'
            ),
            t(
              'services.standard.massageView.massages.sports.benefits.prevention'
            ),
            t(
              'services.standard.massageView.massages.sports.benefits.recovery'
            ),
            t(
              'services.standard.massageView.massages.sports.benefits.flexibility'
            ),
          ],
          perfectFor: [
            t(
              'services.standard.massageView.massages.sports.perfectFor.athletes'
            ),
            t(
              'services.standard.massageView.massages.sports.perfectFor.active'
            ),
            t(
              'services.standard.massageView.massages.sports.perfectFor.performance'
            ),
          ],
          techniques: [
            t(
              'services.standard.massageView.massages.sports.techniques.massage'
            ),
            t(
              'services.standard.massageView.massages.sports.techniques.stretching'
            ),
            t(
              'services.standard.massageView.massages.sports.techniques.compression'
            ),
          ],
        },
        {
          id: 'couples',
          name: t('standard.massageView.massages.couples.name'),
          description: t('standard.massageView.massages.couples.description'),
          longDescription: t(
            'services.standard.massageView.massages.couples.longDescription'
          ),
          category: 'signature',
          durations: [
            { duration: 60, price: 240, popular: false },
            { duration: 90, price: 320, popular: true },
          ],
          emoji: t('services.standard.massageView.massages.couples.emoji'),
          maxPersons: 2,
          intensity: 'gentle',
          isPremium: true,
          imageUrl:
            'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=800',
          benefits: [
            t(
              'services.standard.massageView.massages.couples.benefits.romantic'
            ),
            t('services.standard.massageView.massages.couples.benefits.shared'),
            t(
              'services.standard.massageView.massages.couples.benefits.bonding'
            ),
            t('services.standard.massageView.massages.couples.benefits.stress'),
          ],
          perfectFor: [
            t(
              'services.standard.massageView.massages.couples.perfectFor.couples'
            ),
            t(
              'services.standard.massageView.massages.couples.perfectFor.anniversaries'
            ),
            t(
              'services.standard.massageView.massages.couples.perfectFor.dates'
            ),
          ],
          techniques: [
            t(
              'services.standard.massageView.massages.couples.techniques.synchronized'
            ),
            t(
              'services.standard.massageView.massages.couples.techniques.aromatherapy'
            ),
            t(
              'services.standard.massageView.massages.couples.techniques.ambiance'
            ),
          ],
        },
        {
          id: 'thai',
          name: t('services.standard.massageView.massages.thai.name'),
          description: t(
            'services.standard.massageView.massages.thai.description'
          ),
          longDescription: t(
            'services.standard.massageView.massages.thai.longDescription'
          ),
          category: 'signature',
          durations: [
            { duration: 90, price: 180, popular: true },
            { duration: 120, price: 220, popular: false },
          ],
          emoji: t('services.standard.massageView.massages.thai.emoji'),
          maxPersons: 1,
          intensity: 'medium',
          isPremium: true,
          imageUrl:
            'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=800',
          benefits: [
            t(
              'services.standard.massageView.massages.thai.benefits.flexibility'
            ),
            t('services.standard.massageView.massages.thai.benefits.energy'),
            t('services.standard.massageView.massages.thai.benefits.stress'),
            t('services.standard.massageView.massages.thai.benefits.spiritual'),
          ],
          perfectFor: [
            t(
              'services.standard.massageView.massages.thai.perfectFor.flexibility'
            ),
            t('services.standard.massageView.massages.thai.perfectFor.energy'),
            t(
              'services.standard.massageView.massages.thai.perfectFor.traditional'
            ),
          ],
          techniques: [
            t(
              'services.standard.massageView.massages.thai.techniques.stretching'
            ),
            t(
              'services.standard.massageView.massages.thai.techniques.pressure'
            ),
            t('services.standard.massageView.massages.thai.techniques.energy'),
          ],
        },
      ],
    }),
    [t]
  );

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
  }, [filters, SPA_SERVICES.massages]);

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
        alert(t('services.standard.massageView.errors.booking'));
      }
    },
    [setReservationData, router, t]
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
              {t('services.standard.massageView.hero.badge.title')}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className='text-4xl sm:text-6xl lg:text-7xl font-light text-white mb-6 leading-tight'
          >
            {t('services.standard.massageView.hero.title.line1')}
            <span className='block text-emerald-300 font-normal'>
              {t('services.standard.massageView.hero.title.line2')}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className='text-xl sm:text-2xl text-white/90 mb-12 leading-relaxed font-light max-w-3xl mx-auto'
          >
            {t('services.standard.massageView.hero.subtitle', {
              count: totalMassagesCount,
            })}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className='flex flex-wrap justify-center gap-8 text-white/80 text-sm'
          >
            <div className='flex items-center gap-2'>
              <Shield className='w-4 h-4 text-emerald-300' />
              <span>
                {t('services.standard.massageView.hero.features.licensed')}
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <Heart className='w-4 h-4 text-rose-300' />
              <span>
                {t('services.standard.massageView.hero.features.home')}
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <Star className='w-4 h-4 text-amber-300' />
              <span>
                {t('services.standard.massageView.hero.features.premium')}
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <CheckCircle className='w-4 h-4 text-green-300' />
              <span>
                {t('services.standard.massageView.hero.features.guaranteed')}
              </span>
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
            <div className='text-6xl text-emerald-600 mb-6'>
              {t('services.standard.massageView.quote.emoji')}
            </div>
            <blockquote className='text-3xl lg:text-4xl font-light text-gray-800 leading-relaxed mb-8 italic'>
              {t('services.standard.massageView.quote.text')}
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
                {t('services.standard.massageView.quote.stats.sessions.count')}
              </div>
              <div className='text-gray-600 font-medium'>
                {t('services.standard.massageView.quote.stats.sessions.label')}
              </div>
              <div className='text-sm text-gray-500 mt-2'>
                {t(
                  'services.standard.massageView.quote.stats.sessions.description'
                )}
              </div>
            </div>

            <div className='bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-emerald-100 shadow-lg'>
              <div className='text-emerald-600 text-4xl font-bold mb-2'>
                {t(
                  'services.standard.massageView.quote.stats.satisfaction.count'
                )}
              </div>
              <div className='text-gray-600 font-medium'>
                {t(
                  'services.standard.massageView.quote.stats.satisfaction.label'
                )}
              </div>
              <div className='text-sm text-gray-500 mt-2'>
                {t(
                  'services.standard.massageView.quote.stats.satisfaction.description'
                )}
              </div>
            </div>

            <div className='bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-emerald-100 shadow-lg'>
              <div className='text-emerald-600 text-4xl font-bold mb-2'>
                {t(
                  'services.standard.massageView.quote.stats.availability.count'
                )}
              </div>
              <div className='text-gray-600 font-medium'>
                {t(
                  'services.standard.massageView.quote.stats.availability.label'
                )}
              </div>
              <div className='text-sm text-gray-500 mt-2'>
                {t(
                  'services.standard.massageView.quote.stats.availability.description'
                )}
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
              {t('services.standard.massageView.services.title.line1')}
              <span className='text-emerald-600 block'>
                {t('services.standard.massageView.services.title.line2')}
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className='text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed'
            >
              {t('services.standard.massageView.services.subtitle')}
            </motion.p>
          </div>

          <FilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />

          <div className='mb-8'>
            <p className='text-gray-600 text-lg'>
              {t('services.standard.massageView.services.count.available', {
                count: totalFilteredCount,
              })}
              {totalFilteredCount !== totalMassagesCount && (
                <button
                  onClick={handleClearFilters}
                  className='ml-3 text-emerald-600 hover:text-emerald-700 underline font-medium'
                >
                  {t('services.standard.massageView.services.count.viewAll')}
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
              <div className='text-8xl mb-6'>
                {t('services.standard.massageView.services.noResults.emoji')}
              </div>
              <h3 className='text-2xl font-semibold text-gray-800 mb-4'>
                {t('services.standard.massageView.services.noResults.title')}
              </h3>
              <p className='text-gray-600 mb-8 text-lg'>
                {t(
                  'services.standard.massageView.services.noResults.description'
                )}
              </p>
              <button
                onClick={handleClearFilters}
                className='px-8 py-4 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors font-semibold text-lg shadow-lg'
              >
                {t('services.standard.massageView.services.noResults.button')}
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
                    {t('services.standard.massageView.cta.title.line1')}
                    <span className='block text-emerald-200 font-normal'>
                      {t('services.standard.massageView.cta.title.line2')}
                    </span>
                  </h3>

                  <p className='text-xl text-emerald-100 mb-8 leading-relaxed'>
                    {t('services.standard.massageView.cta.description')}
                  </p>

                  <div className='space-y-4 mb-8'>
                    <div className='flex items-center gap-4 text-emerald-100'>
                      <div className='w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center'>
                        <CheckCircle className='w-5 h-5 text-white' />
                      </div>
                      <span>
                        {t(
                          'services.standard.massageView.cta.features.therapists'
                        )}
                      </span>
                    </div>
                    <div className='flex items-center gap-4 text-emerald-100'>
                      <div className='w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center'>
                        <Heart className='w-5 h-5 text-white' />
                      </div>
                      <span>
                        {t(
                          'services.standard.massageView.cta.features.premium'
                        )}
                      </span>
                    </div>
                    <div className='flex items-center gap-4 text-emerald-100'>
                      <div className='w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center'>
                        <Sparkles className='w-5 h-5 text-white' />
                      </div>
                      <span>
                        {t(
                          'services.standard.massageView.cta.features.customized'
                        )}
                      </span>
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
                    {t('services.standard.massageView.cta.button')}
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
                      <div className='text-3xl mb-3'>
                        {t(
                          'services.standard.massageView.cta.cards.mindBalance.emoji'
                        )}
                      </div>
                      <h4 className='text-white font-semibold mb-2'>
                        {t(
                          'services.standard.massageView.cta.cards.mindBalance.title'
                        )}
                      </h4>
                      <p className='text-emerald-100 text-sm'>
                        {t(
                          'services.standard.massageView.cta.cards.mindBalance.description'
                        )}
                      </p>
                    </div>
                    <div className='bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20'>
                      <div className='text-3xl mb-3'>
                        {t(
                          'services.standard.massageView.cta.cards.bodyRenewal.emoji'
                        )}
                      </div>
                      <h4 className='text-white font-semibold mb-2'>
                        {t(
                          'services.standard.massageView.cta.cards.bodyRenewal.title'
                        )}
                      </h4>
                      <p className='text-emerald-100 text-sm'>
                        {t(
                          'services.standard.massageView.cta.cards.bodyRenewal.description'
                        )}
                      </p>
                    </div>
                  </div>
                  <div className='space-y-6 mt-12'>
                    <div className='bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20'>
                      <div className='text-3xl mb-3'>
                        {t(
                          'services.standard.massageView.cta.cards.naturalHealing.emoji'
                        )}
                      </div>
                      <h4 className='text-white font-semibold mb-2'>
                        {t(
                          'services.standard.massageView.cta.cards.naturalHealing.title'
                        )}
                      </h4>
                      <p className='text-emerald-100 text-sm'>
                        {t(
                          'services.standard.massageView.cta.cards.naturalHealing.description'
                        )}
                      </p>
                    </div>
                    <div className='bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20'>
                      <div className='text-3xl mb-3'>
                        {t(
                          'services.standard.massageView.cta.cards.homeComfort.emoji'
                        )}
                      </div>
                      <h4 className='text-white font-semibold mb-2'>
                        {t(
                          'services.standard.massageView.cta.cards.homeComfort.title'
                        )}
                      </h4>
                      <p className='text-emerald-100 text-sm'>
                        {t(
                          'services.standard.massageView.cta.cards.homeComfort.description'
                        )}
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
