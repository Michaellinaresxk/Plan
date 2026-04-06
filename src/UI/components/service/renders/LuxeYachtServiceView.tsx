import React, { useState, useMemo, useRef, useCallback } from 'react';
import {
  Anchor,
  Users,
  Star,
  Clock,
  Wifi,
  Utensils,
  Calendar,
  CheckCircle,
  Camera,
  Check,
  Shirt,
  Sun,
  Shield,
  Award,
  Navigation,
  Info,
  Wind,
  Play,
  Pause,
  Waves,
  Crown,
  ArrowRight,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/client';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import {
  Yacht,
  YachtCardProps,
  CTABannerProps,
} from '@/constants/yacht/yachts';
import YachtDetailsModal from '../yacht/YachtDetailsModal';
import UnifiedBookingForm from '../yacht/UnifiedBookingForm';
import CinematicHero from '../yacht/CinematicHero';
import YachtVideoGallery from '../yacht/YachtVideoGallery';

// ─── Animation ────────────────────────────────────────────────────────────────

const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

// ─── Video Player ─────────────────────────────────────────────────────────────

const VideoPlayer: React.FC<{ isPlaying: boolean; onToggle: () => void }> = ({
  isPlaying,
  onToggle,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isPlaying) {
      v.play().catch(() => onToggle());
    } else {
      v.pause();
    }
  }, [isPlaying, onToggle]);

  return (
    <div
      className='relative overflow-hidden group cursor-pointer'
      onClick={onToggle}
    >
      <div className='relative aspect-video'>
        <video
          ref={videoRef}
          className='w-full h-full object-cover'
          poster='https://res.cloudinary.com/ddg92xar5/image/upload/v1754600018/2_dc7fry.jpg'
          preload='metadata'
          playsInline
        >
          <source
            src='https://res.cloudinary.com/ddg92xar5/video/upload/v1759669338/yate_m7z3ve.mp4'
            type='video/mp4'
          />
        </video>

        {!isPlaying && (
          <div className='absolute inset-0 bg-black/30 flex items-center justify-center'>
            <div className='w-14 h-14 bg-white/90 flex items-center justify-center'>
              <Play className='w-6 h-6 text-stone-900 ml-0.5' />
            </div>
          </div>
        )}

        {isPlaying && (
          <div className='absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center'>
            <div className='w-12 h-12 bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
              <Pause className='w-5 h-5 text-stone-900' />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Yacht Card ───────────────────────────────────────────────────────────────

const YachtCard: React.FC<YachtCardProps> = ({ yacht, onSelect }) => {
  const { t } = useTranslation();

  return (
    <div
      className='group relative overflow-hidden cursor-pointer'
      onClick={() => onSelect(yacht)}
    >
      <div className='relative aspect-[4/3]'>
        <Image
          src={yacht.mainImage}
          alt={yacht.name}
          fill
          className='object-cover transition-transform duration-700 group-hover:scale-105'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent' />

        {yacht.isPremium && (
          <div className='absolute top-2 right-2'>
            <span className='bg-black/50 backdrop-blur-sm text-amber-400 border border-amber-500/30 px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.1em]'>
              {t('services.premium.luxYachtView.yachtGrid.cardPremiumBadge')}
            </span>
          </div>
        )}

        <div className='absolute bottom-0 left-0 right-0 p-3 sm:p-4'>
          <div className='flex items-center justify-between mb-2'>
            <h3 className='text-white text-sm sm:text-base font-medium group-hover:text-amber-200 transition-colors'>
              {yacht.name}
            </h3>
            <span className='flex items-center gap-1 text-white/60 text-[11px]'>
              <Users className='w-3 h-3' />
              {yacht.specifications.maxGuests}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(yacht);
            }}
            className='w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white py-2 text-xs font-medium tracking-wide uppercase hover:bg-white/20 transition-colors flex items-center justify-center gap-1.5'
          >
            View Details
            <ArrowRight className='w-3 h-3' />
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const LuxeYachtServiceView: React.FC = () => {
  const { t } = useTranslation();
  const [selectedYacht, setSelectedYacht] = useState<Yacht | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [yachtFilter, setYachtFilter] = useState('all');
  const fleetRef = useRef<HTMLDivElement>(null);

  // ── Yacht Data (unchanged) ──────────────────────────────────────────
  const YACHT_DATA: Yacht[] = useMemo(
    () => [
      {
        id: 'aiconFly-60',
        name: t('services.premium.luxYachtView.yachts.aiconfly.name'),
        category: 'luxury',
        shortDescription: t(
          'services.premium.luxYachtView.yachts.aiconfly.shortDesc',
        ),
        mainImage:
          'https://res.cloudinary.com/ddg92xar5/image/upload/v1754600019/1_nyrndv.jpg',
        gallery: [
          'https://res.cloudinary.com/ddg92xar5/image/upload/v1754600017/5_ryceky.jpg',
          'https://res.cloudinary.com/ddg92xar5/image/upload/v1754600017/3_eapwql.jpg',
          'https://res.cloudinary.com/ddg92xar5/image/upload/v1754600018/2_dc7fry.jpg',
          'https://res.cloudinary.com/ddg92xar5/image/upload/v1754600016/7_mkxuiy.jpg',
          'https://res.cloudinary.com/ddg92xar5/image/upload/v1754600019/1_nyrndv.jpg',
        ],
        specifications: {
          length: '60 ft',
          maxGuests: 16,
          cabins: 3,
          bathrooms: 2,
          crew: 3,
          maxSpeed: '30 knots',
          manufacturer: 'AiconFly',
          year: 2008,
        },
        amenities: [
          {
            icon: <Wifi className='w-5 h-5' />,
            name: t(
              'services.premium.luxYachtView.yachts.aiconfly.amenityWifiName',
            ),
            description: t(
              'services.premium.luxYachtView.yachts.aiconfly.amenityWifiDesc',
            ),
          },
          {
            icon: <Utensils className='w-5 h-5' />,
            name: t(
              'services.premium.luxYachtView.yachts.aiconfly.amenityChefName',
            ),
            description: t(
              'services.premium.luxYachtView.yachts.aiconfly.amenityChefDesc',
            ),
          },
          {
            icon: <Waves className='w-5 h-5' />,
            name: t(
              'services.premium.luxYachtView.yachts.aiconfly.amenitySportsName',
            ),
            description: t(
              'services.premium.luxYachtView.yachts.aiconfly.amenitySportsDesc',
            ),
          },
        ],
        highlights: [
          t('services.premium.luxYachtView.yachts.aiconfly.highlight1'),
          t('services.premium.luxYachtView.yachts.aiconfly.highlight2'),
          t('services.premium.luxYachtView.yachts.aiconfly.highlight3'),
        ],
        isPremium: false,
        rating: 5,
        reviews: 128,
        location: t('services.premium.luxYachtView.yachts.aiconfly.location'),
        itinerary: [
          t('services.premium.luxYachtView.yachts.aiconfly.itinerary1'),
          t('services.premium.luxYachtView.yachts.aiconfly.itinerary2'),
          t('services.premium.luxYachtView.yachts.aiconfly.itinerary3'),
          t('services.premium.luxYachtView.yachts.aiconfly.itinerary4'),
          t('services.premium.luxYachtView.yachts.aiconfly.itinerary5'),
        ],
      },
      {
        id: 'fairline-43',
        name: t('services.premium.luxYachtView.yachts.fairline.name'),
        category: 'luxury',
        shortDescription: t(
          'services.premium.luxYachtView.yachts.fairline.shortDesc',
        ),
        mainImage:
          'https://res.cloudinary.com/ddg92xar5/image/upload/v1754600208/2_k72tfn.jpg',
        gallery: [
          'https://res.cloudinary.com/ddg92xar5/image/upload/v1754600211/1_k81g6k.jpg',
          'https://res.cloudinary.com/ddg92xar5/image/upload/v1754600209/3_dvbeqw.jpg',
          'https://res.cloudinary.com/ddg92xar5/image/upload/v1754600212/4_yj68bm.jpg',
          'https://res.cloudinary.com/ddg92xar5/image/upload/v1754600213/5_uvzjqd.jpg',
          'https://res.cloudinary.com/ddg92xar5/image/upload/v1754600209/3_dvbeqw.jpg',
        ],
        specifications: {
          length: '85 ft',
          maxGuests: 18,
          cabins: 4,
          bathrooms: 4,
          crew: 5,
          maxSpeed: '28 knots',
          manufacturer: 'Princess',
          year: 2024,
        },
        amenities: [
          {
            icon: <Wifi className='w-5 h-5' />,
            name: t(
              'services.premium.luxYachtView.yachts.fairline.amenityWifiName',
            ),
            description: t(
              'services.premium.luxYachtView.yachts.fairline.amenityWifiDesc',
            ),
          },
          {
            icon: <Utensils className='w-5 h-5' />,
            name: t(
              'services.premium.luxYachtView.yachts.fairline.amenityChefName',
            ),
            description: t(
              'services.premium.luxYachtView.yachts.fairline.amenityChefDesc',
            ),
          },
          {
            icon: <Waves className='w-5 h-5' />,
            name: t(
              'services.premium.luxYachtView.yachts.fairline.amenitySpaName',
            ),
            description: t(
              'services.premium.luxYachtView.yachts.fairline.amenitySpaDesc',
            ),
          },
        ],
        highlights: [
          t('services.premium.luxYachtView.yachts.fairline.highlight1'),
          t('services.premium.luxYachtView.yachts.fairline.highlight2'),
          t('services.premium.luxYachtView.yachts.fairline.highlight3'),
        ],
        isPremium: true,
        rating: 4.95,
        reviews: 89,
        location: t('services.premium.luxYachtView.yachts.fairline.location'),
        itinerary: [
          t('services.premium.luxYachtView.yachts.fairline.itinerary1'),
          t('services.premium.luxYachtView.yachts.fairline.itinerary2'),
          t('services.premium.luxYachtView.yachts.fairline.itinerary3'),
          t('services.premium.luxYachtView.yachts.fairline.itinerary4'),
          t('services.premium.luxYachtView.yachts.fairline.itinerary5'),
          t('services.premium.luxYachtView.yachts.fairline.itinerary6'),
          t('services.premium.luxYachtView.yachts.fairline.itinerary7'),
        ],
      },
      {
        id: 'catamaran',
        name: t('services.premium.luxYachtView.yachts.lagoon.name'),
        category: 'catamaran',
        shortDescription: t(
          'services.premium.luxYachtView.yachts.lagoon.shortDesc',
        ),
        mainImage:
          'https://res.cloudinary.com/ddg92xar5/image/upload/v1755956164/7030fcbb-7da3-4676-9abb-d22177efab14_qdk2ac.jpg',
        gallery: [
          'https://res.cloudinary.com/ddg92xar5/image/upload/v1755956159/4f5f3743-f52d-4d85-b023-fb4be38f833f_n70bbg.jpg',
          'https://res.cloudinary.com/ddg92xar5/image/upload/v1755956399/3380551b-f82f-4fdc-86e2-47cf2ad3a6dc_foh9sp.jpg',
          'https://res.cloudinary.com/ddg92xar5/image/upload/v1755956172/c3b072ee-3a35-497c-8aa0-1942c9044a3b_q5xht7.jpg',
          'https://res.cloudinary.com/ddg92xar5/image/upload/v1755956193/d21ad3c2-f7eb-41e2-921d-3ae1be25c7a5_edwn0e.jpg',
          'https://res.cloudinary.com/ddg92xar5/image/upload/v1755956396/5ad4be2d-9122-45fe-bd48-0dec7b77a8b5_ymmrx8.jpg',
        ],
        specifications: {
          length: '13,71 m',
          maxGuests: 20,
          cabins: 4,
          bathrooms: 3,
          crew: 3,
          maxSpeed: '26 knots',
          manufacturer: 'Lagoon',
          year: 2013,
        },
        amenities: [
          {
            icon: <Wifi className='w-5 h-5' />,
            name: t(
              'services.premium.luxYachtView.yachts.lagoon.amenityWifiName',
            ),
            description: t(
              'services.premium.luxYachtView.yachts.lagoon.amenityWifiDesc',
            ),
          },
          {
            icon: <Utensils className='w-5 h-5' />,
            name: t(
              'services.premium.luxYachtView.yachts.lagoon.amenityChefName',
            ),
            description: t(
              'services.premium.luxYachtView.yachts.lagoon.amenityChefDesc',
            ),
          },
          {
            icon: <Waves className='w-5 h-5' />,
            name: t(
              'services.premium.luxYachtView.yachts.lagoon.amenityPoolName',
            ),
            description: t(
              'services.premium.luxYachtView.yachts.lagoon.amenityPoolDesc',
            ),
          },
        ],
        highlights: [
          t('services.premium.luxYachtView.yachts.lagoon.highlight1'),
          t('services.premium.luxYachtView.yachts.lagoon.highlight2'),
          t('services.premium.luxYachtView.yachts.lagoon.highlight3'),
        ],
        isPremium: true,
        rating: 5.0,
        reviews: 156,
        location: t('services.premium.luxYachtView.yachts.lagoon.location'),
        itinerary: [
          t('services.premium.luxYachtView.yachts.lagoon.itinerary1'),
          t('services.premium.luxYachtView.yachts.lagoon.itinerary2'),
          t('services.premium.luxYachtView.yachts.lagoon.itinerary3'),
          t('services.premium.luxYachtView.yachts.lagoon.itinerary4'),
        ],
      },
      {
        id: 'tiara-38',
        name: t('services.premium.luxYachtView.yachts.tiara.name'),
        category: 'luxury',
        shortDescription: t(
          'services.premium.luxYachtView.yachts.tiara.shortDesc',
        ),
        mainImage:
          'https://res.cloudinary.com/ddg92xar5/image/upload/v1755956761/ac955cf2-03ad-4c8c-87c6-36c0ec0cb3a9_ymvcuc.jpg',
        gallery: [
          'https://res.cloudinary.com/ddg92xar5/image/upload/v1755956770/3e8353e4-c87b-4ce6-9781-151e4bcc0245_usext6.jpg',
          'https://res.cloudinary.com/ddg92xar5/image/upload/v1755956766/28d661b1-e505-4bbe-98b9-66354d9e3112_gzt0ku.jpg',
          'https://res.cloudinary.com/ddg92xar5/image/upload/v1755956782/5ac1f830-2a76-4d82-8666-37bef3104a87_i810fb.jpg',
          'https://res.cloudinary.com/ddg92xar5/image/upload/v1755957154/f87b013c-affa-4058-8723-e62f49f7643d_fjzbpv.jpg',
          'https://res.cloudinary.com/ddg92xar5/image/upload/v1755956815/f46a7e9a-3093-404d-825d-138155d275e7_lwjmri.jpg',
          'https://res.cloudinary.com/ddg92xar5/image/upload/v1755956761/ac955cf2-03ad-4c8c-87c6-36c0ec0cb3a9_ymvcuc.jpg',
        ],
        specifications: {
          length: '60 ft',
          maxGuests: 16,
          cabins: 3,
          bathrooms: 2,
          crew: 3,
          maxSpeed: '30 knots',
          manufacturer: 'AiconFly',
          year: 2008,
        },
        amenities: [
          {
            icon: <Wifi className='w-5 h-5' />,
            name: t(
              'services.premium.luxYachtView.yachts.tiara.amenityWifiName',
            ),
            description: t(
              'services.premium.luxYachtView.yachts.tiara.amenityWifiDesc',
            ),
          },
          {
            icon: <Utensils className='w-5 h-5' />,
            name: t(
              'services.premium.luxYachtView.yachts.tiara.amenityChefName',
            ),
            description: t(
              'services.premium.luxYachtView.yachts.tiara.amenityChefDesc',
            ),
          },
          {
            icon: <Waves className='w-5 h-5' />,
            name: t(
              'services.premium.luxYachtView.yachts.tiara.amenitySportsName',
            ),
            description: t(
              'services.premium.luxYachtView.yachts.tiara.amenitySportsDesc',
            ),
          },
        ],
        highlights: [
          t('services.premium.luxYachtView.yachts.tiara.highlight1'),
          t('services.premium.luxYachtView.yachts.tiara.highlight2'),
          t('services.premium.luxYachtView.yachts.tiara.highlight3'),
        ],
        isPremium: false,
        rating: 5,
        reviews: 128,
        location: t('services.premium.luxYachtView.yachts.tiara.location'),
        itinerary: [
          t('services.premium.luxYachtView.yachts.tiara.itinerary1'),
          t('services.premium.luxYachtView.yachts.tiara.itinerary2'),
          t('services.premium.luxYachtView.yachts.tiara.itinerary3'),
          t('services.premium.luxYachtView.yachts.tiara.itinerary4'),
          t('services.premium.luxYachtView.yachts.tiara.itinerary5'),
        ],
      },
    ],
    [t],
  );

  const filteredYachts = useMemo(
    () =>
      yachtFilter === 'all'
        ? YACHT_DATA
        : YACHT_DATA.filter((y) => y.category === yachtFilter),
    [yachtFilter, YACHT_DATA],
  );

  // ── Promo features ──────────────────────────────────────────────────
  const promoFeatures = useMemo(
    () => [
      {
        icon: Utensils,
        label: t(
          'services.premium.luxYachtView.promoVideoSection.features.provisioning.title',
        ),
      },
      {
        icon: Waves,
        label: t(
          'services.premium.luxYachtView.promoVideoSection.features.photography.title',
        ),
      },
      {
        icon: Crown,
        label: t(
          'services.premium.luxYachtView.promoVideoSection.features.specialOccasion.title',
        ),
      },
    ],
    [t],
  );

  // ── What to bring ───────────────────────────────────────────────────
  const whatToBring = useMemo(
    () => [
      {
        icon: Sun,
        title: t(
          'services.premium.luxYachtView.whatToBring.sunProtectionTitle',
        ),
        desc: t('services.premium.luxYachtView.whatToBring.sunProtectionDesc'),
      },
      {
        icon: Shirt,
        title: t('services.premium.luxYachtView.whatToBring.clothingTitle'),
        desc: t('services.premium.luxYachtView.whatToBring.clothingDesc'),
      },
      {
        icon: Camera,
        title: t('services.premium.luxYachtView.whatToBring.cameraTitle'),
        desc: t('services.premium.luxYachtView.whatToBring.cameraDesc'),
      },
      {
        icon: Wind,
        title: t('services.premium.luxYachtView.whatToBring.jacketTitle'),
        desc: t('services.premium.luxYachtView.whatToBring.jacketDesc'),
      },
    ],
    [t],
  );

  // ── Service info ────────────────────────────────────────────────────
  const serviceInfo = useMemo(
    () => [
      {
        icon: Clock,
        title: t('services.premium.luxYachtView.privateService.flexibleTitle'),
        time: t('services.premium.luxYachtView.privateService.flexibleTime'),
        desc: t('services.premium.luxYachtView.privateService.flexibleDesc'),
      },
      {
        icon: Users,
        title: t('services.premium.luxYachtView.privateService.privateTitle'),
        time: t('services.premium.luxYachtView.privateService.privateTime'),
        desc: t('services.premium.luxYachtView.privateService.privateDesc'),
      },
      {
        icon: Navigation,
        title: t('services.premium.luxYachtView.privateService.customTitle'),
        time: t('services.premium.luxYachtView.privateService.customTime'),
        desc: t('services.premium.luxYachtView.privateService.customDesc'),
      },
      {
        icon: Utensils,
        title: t('services.premium.luxYachtView.privateService.gourmetTitle'),
        time: t('services.premium.luxYachtView.privateService.gourmetTime'),
        desc: t('services.premium.luxYachtView.privateService.gourmetDesc'),
      },
      {
        icon: Waves,
        title: t(
          'services.premium.luxYachtView.privateService.activitiesTitle',
        ),
        time: t('services.premium.luxYachtView.privateService.activitiesTime'),
        desc: t('services.premium.luxYachtView.privateService.activitiesDesc'),
      },
      {
        icon: Calendar,
        title: t('services.premium.luxYachtView.privateService.bookingTitle'),
        time: t('services.premium.luxYachtView.privateService.bookingTime'),
        desc: t('services.premium.luxYachtView.privateService.bookingDesc'),
      },
    ],
    [t],
  );

  // ── Handlers ────────────────────────────────────────────────────────
  const handleExploreFleet = useCallback(() => {
    fleetRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleYachtSelect = useCallback((yacht: Yacht) => {
    setSelectedYacht(yacht);
    setShowDetailsModal(true);
  }, []);

  const handleOpenBooking = useCallback((yacht?: Yacht) => {
    if (yacht) setSelectedYacht(yacht);
    setShowDetailsModal(false);
    setShowBookingForm(true);
  }, []);

  const handleCloseAll = useCallback(() => {
    setSelectedYacht(null);
    setShowBookingForm(false);
    setShowDetailsModal(false);
  }, []);

  if (showBookingForm) {
    return (
      <UnifiedBookingForm yacht={selectedYacht} onClose={handleCloseAll} />
    );
  }

  return (
    <div className='min-h-screen bg-stone-50'>
      <CinematicHero
        onExploreFleet={handleExploreFleet}
        onOpenBooking={() => handleOpenBooking()}
      />

      {/* ── Fleet Grid ─────────────────────────────────────────── */}
      <motion.section
        ref={fleetRef}
        id='fleet'
        className='px-5 sm:px-8 lg:px-12 py-14 sm:py-18 lg:py-20'
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, margin: '-60px' }}
        variants={stagger}
      >
        <motion.div className='mb-10' variants={fadeIn}>
          <p className='text-amber-600 uppercase tracking-[0.25em] text-[11px] font-medium mb-2'>
            {t('services.premium.luxYachtView.yachtGrid.badgeLabel')}
          </p>
          <h2 className='text-2xl sm:text-3xl lg:text-4xl font-light text-stone-900 tracking-tight'>
            {t('services.premium.luxYachtView.yachtGrid.titlePrefix')}{' '}
            <span className='font-semibold'>
              {t('services.premium.luxYachtView.yachtGrid.titleSuffix')}
            </span>
          </h2>
        </motion.div>

        {/* Filters */}
        <div className='flex flex-wrap gap-2 mb-8'>
          {[
            {
              id: 'all',
              label: t('services.premium.luxYachtView.yachtGrid.filterAll'),
            },
            {
              id: 'catamaran',
              label: t(
                'services.premium.luxYachtView.yachtGrid.filterCatamaran',
              ),
            },
            {
              id: 'luxury',
              label: t('services.premium.luxYachtView.yachtGrid.filterLuxury'),
            },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setYachtFilter(cat.id)}
              className={`px-3.5 py-2 border text-[11px] font-medium tracking-wide transition-colors duration-200 ${
                yachtFilter === cat.id
                  ? 'bg-stone-900 border-stone-900 text-white'
                  : 'bg-white border-stone-200 text-stone-500 hover:text-stone-900 hover:border-stone-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Yacht grid */}
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-1.5 sm:gap-2'>
          {filteredYachts.map((yacht) => (
            <YachtCard
              key={yacht.id}
              yacht={yacht}
              onSelect={handleYachtSelect}
            />
          ))}
        </div>
      </motion.section>

      <YachtVideoGallery />

      {/* ── Service Details — consolidated ──────────────────────── */}
      <motion.section
        className='px-5 sm:px-8 lg:px-12 pb-14 sm:pb-18 lg:pb-20'
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, margin: '-60px' }}
        variants={stagger}
      >
        <motion.div className='mb-10' variants={fadeIn}>
          <p className='text-amber-600 uppercase tracking-[0.25em] text-[11px] font-medium mb-2'>
            {t('services.premium.luxYachtView.privateService.badgeLabel')}
          </p>
          <h2 className='text-2xl sm:text-3xl lg:text-4xl font-light text-stone-900 tracking-tight'>
            {t('services.premium.luxYachtView.privateService.titlePrefix')}{' '}
            <span className='font-semibold'>
              {t('services.premium.luxYachtView.privateService.titleSuffix')}
            </span>
          </h2>
        </motion.div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {serviceInfo.map(({ icon: Icon, title, time, desc }, i) => (
            <motion.div
              key={i}
              className='border border-stone-200 bg-white p-5'
              variants={fadeIn}
            >
              <div className='flex items-start gap-3'>
                <Icon className='w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0' />
                <div>
                  <div className='flex items-center gap-2 mb-1'>
                    <p className='text-stone-900 text-xs font-medium'>
                      {title}
                    </p>
                    <span className='text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5'>
                      {time}
                    </span>
                  </div>
                  <p className='text-stone-400 text-[11px] leading-relaxed'>
                    {desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── What to Bring + Important Info — consolidated ───────── */}
      <motion.section
        className='px-5 sm:px-8 lg:px-12 pb-14 sm:pb-18 lg:pb-20'
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, margin: '-60px' }}
        variants={stagger}
      >
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
          {/* What to bring */}
          <motion.div
            className='border border-stone-200 bg-white p-6'
            variants={fadeIn}
          >
            <h3 className='text-xs font-semibold text-stone-900 uppercase tracking-[0.1em] mb-5'>
              {t('services.premium.luxYachtView.whatToBring.titlePrefix')}{' '}
              {t('services.premium.luxYachtView.whatToBring.titleSuffix')}
            </h3>
            <div className='space-y-4'>
              {whatToBring.map(({ icon: Icon, title, desc }, i) => (
                <div key={i} className='flex items-start gap-3'>
                  <Icon className='w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0' />
                  <div>
                    <p className='text-stone-900 text-xs font-medium'>
                      {title}
                    </p>
                    <p className='text-stone-400 text-[11px] leading-relaxed'>
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className='border-t border-stone-100 mt-5 pt-4 flex items-start gap-2.5'>
              <Check className='w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0' />
              <p className='text-stone-500 text-xs'>
                {t('services.premium.luxYachtView.whatToBring.weProvideDesc')}
              </p>
            </div>
          </motion.div>

          {/* Important info */}
          <motion.div
            className='border border-stone-200 bg-white p-6'
            variants={fadeIn}
          >
            <h3 className='text-xs font-semibold text-stone-900 uppercase tracking-[0.1em] mb-5'>
              {t('services.premium.luxYachtView.importantInfo.title')}
            </h3>
            <div className='space-y-4'>
              {[
                {
                  icon: Calendar,
                  title: t(
                    'services.premium.luxYachtView.importantInfo.availabilityTitle',
                  ),
                  desc: t(
                    'services.premium.luxYachtView.importantInfo.availabilityDesc',
                  ),
                },
                {
                  icon: CheckCircle,
                  title: t(
                    'services.premium.luxYachtView.importantInfo.confirmationTitle',
                  ),
                  desc: t(
                    'services.premium.luxYachtView.importantInfo.confirmationDesc',
                  ),
                },
                {
                  icon: Shield,
                  title: t(
                    'services.premium.luxYachtView.importantInfo.paymentTitle',
                  ),
                  desc: t(
                    'services.premium.luxYachtView.importantInfo.paymentDesc',
                  ),
                },
              ].map(({ icon: Icon, title, desc }, i) => (
                <div key={i} className='flex items-start gap-3'>
                  <Icon className='w-4 h-4 text-stone-400 mt-0.5 flex-shrink-0' />
                  <div>
                    <p className='text-stone-900 text-xs font-medium'>
                      {title}
                    </p>
                    <p className='text-stone-400 text-[11px] leading-relaxed'>
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* ── CTA Banner — single ────────────────────────────────── */}
      <motion.section
        className='relative w-full'
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, margin: '-60px' }}
        variants={fadeIn}
      >
        <Image
          src='https://res.cloudinary.com/ddg92xar5/image/upload/v1754600018/2_dc7fry.jpg'
          alt='Sunset yacht'
          fill
          className='object-cover'
        />
        <div className='absolute inset-0 bg-stone-900/85' />
        <div className='relative z-10 py-14 sm:py-18 lg:py-22 px-5 sm:px-8 lg:px-12 text-center'>
          <p className='text-amber-400 uppercase tracking-[0.3em] text-[11px] font-medium mb-4'>
            {t('services.premium.luxYachtView.yachtCta.cta1Badge')}
          </p>
          <h2 className='text-2xl sm:text-3xl lg:text-4xl font-light text-white mb-4 tracking-tight'>
            {t('services.premium.luxYachtView.yachtCta.cta1Title')}
          </h2>
          <p className='text-white/40 text-sm max-w-md mx-auto leading-relaxed mb-8'>
            {t('services.premium.luxYachtView.yachtCta.cta1Description')}
          </p>
          <div className='flex flex-col sm:flex-row gap-3 justify-center'>
            <button
              onClick={() => handleOpenBooking()}
              className='group inline-flex items-center justify-center gap-2.5 bg-white text-stone-900 px-8 py-3.5 text-xs font-medium tracking-wide uppercase hover:bg-amber-50 transition-colors duration-300'
            >
              <Calendar className='w-3.5 h-3.5' />
              {t('services.premium.luxYachtView.yachtCta.cta1Button')}
              <ArrowRight className='w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform' />
            </button>
            <a
              href='#fleet'
              className='group inline-flex items-center justify-center gap-2 border border-stone-600 text-stone-300 px-6 py-3.5 text-xs font-medium tracking-wide uppercase hover:border-stone-400 hover:text-white transition-colors duration-300'
            >
              <Anchor className='w-3.5 h-3.5' />
              {t('services.premium.luxYachtView.yachtCta.cta1SecondaryButton')}
            </a>
          </div>

          <div className='mt-10 grid grid-cols-3 gap-6 max-w-sm mx-auto'>
            {[
              {
                value: '500+',
                label: t('services.premium.luxYachtView.yachtCta.stat1'),
              },
              {
                value: '5.0',
                label: t('services.premium.luxYachtView.yachtCta.stat2'),
              },
              {
                value: '4',
                label: t('services.premium.luxYachtView.yachtCta.stat3'),
              },
            ].map((stat, i) => (
              <div key={i} className='text-center'>
                <div className='text-white text-lg font-light'>
                  {stat.value}
                </div>
                <div className='text-stone-500 text-[10px] uppercase tracking-wider'>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ── Details Modal ──────────────────────────────────────── */}
      {selectedYacht && showDetailsModal && (
        <YachtDetailsModal
          yacht={selectedYacht}
          onClose={handleCloseAll}
          onBookYacht={handleOpenBooking}
        />
      )}
    </div>
  );
};

export default LuxeYachtServiceView;
