'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import ServiceManager from '@/constants/services/ServiceManager';
import { useTranslation } from '@/lib/i18n/client';

// ─── Featured Services Config ─────────────────────────────────────────────────
// Add or remove IDs here to control what shows on the homepage.
// Order matters — first item renders first.

const FEATURED_IDS = [
  'yacht-rental',
  'point-to-point-transfers',
  'atv-excursions',
  'golf-cart-rentals',
  'saona-island-tour',
  'babysitter',
  'horseback-sunset',
  'luxe-yacht',
  // To add a service, just append its ID:
  // 'karaoke',
  // 'personal-trainer',
] as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getTranslationPath(serviceId: string): string {
  const camelCase = serviceId.replace(/-([a-z])/g, (_, c: string) =>
    c.toUpperCase(),
  );
  const tier = camelCase.startsWith('luxe') ? 'premium' : 'standard';
  return `services.${tier}.${camelCase}`;
}

function getServiceRoute(service: {
  id: string;
  packageType: string[];
}): string {
  const tier = service.packageType.includes('standard')
    ? 'standard'
    : 'premium';
  return `/${tier}-package/${service.id}`;
}

// ─── Animation ────────────────────────────────────────────────────────────────

const fadeIn = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

// ─── Component ────────────────────────────────────────────────────────────────

const ServicesGallery: React.FC = () => {
  const { t } = useTranslation();

  // Resolve featured IDs into service objects, preserving order
  const featured = useMemo(() => {
    const all = [
      ...ServiceManager.getByPackageType('standard'),
      ...ServiceManager.getByPackageType('premium'),
    ];

    // Deduplicate by id
    const map = new Map<string, (typeof all)[number]>();
    all.forEach((s) => {
      if (!map.has(s.id)) map.set(s.id, s);
    });

    // Return only featured, in the order defined above
    return FEATURED_IDS.map((id) => map.get(id)).filter(Boolean) as typeof all;
  }, []);

  if (featured.length === 0) return null;

  return (
    <section className='bg-white py-16 sm:py-20 lg:py-24'>
      <div className='px-5 sm:px-8 lg:px-12'>
        {/* ── Header ──────────────────────────────────────────── */}
        <motion.div
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true, margin: '-60px' }}
          variants={fadeIn}
          className='text-center mb-12 sm:mb-14'
        >
          <p className='text-amber-600 uppercase tracking-[0.25em] text-[11px] font-medium mb-2'>
            {t('services.standard.serviceGallery.header.subtitle')}
          </p>
          <h2 className='text-2xl sm:text-3xl lg:text-4xl font-light text-stone-900 tracking-tight mb-4'>
            {t('services.standard.serviceGallery.header.title')}
          </h2>
          <p className='text-stone-400 text-sm sm:text-base max-w-lg mx-auto leading-relaxed'>
            {t('services.standard.serviceGallery.header.description')}
          </p>
        </motion.div>

        {/* ── Grid ────────────────────────────────────────────── */}
        <motion.div
          className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5 sm:gap-2'
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true, margin: '-60px' }}
          variants={stagger}
        >
          {featured.map((service) => {
            const path = getTranslationPath(service.id);
            const name = t(`${path}.name`, { fallback: service.name });
            const isPremium = service.packageType.includes('premium');

            return (
              <motion.div key={service.id} variants={fadeIn}>
                <Link href={getServiceRoute(service)} className='block group'>
                  <div className='relative aspect-[4/3] overflow-hidden'>
                    <Image
                      src={service.img || `/images/services/${service.id}.jpg`}
                      alt={name}
                      fill
                      sizes='(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw'
                      className='object-cover transition-transform duration-700 group-hover:scale-105'
                      onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                        e.currentTarget.src = '/images/placeholder-service.jpg';
                      }}
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent' />

                    {/* Badge */}
                    <div className='absolute top-2 left-2'>
                      <span
                        className={`
                          inline-block px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-[0.1em]
                          ${
                            isPremium
                              ? 'bg-black/50 backdrop-blur-sm text-amber-400 border border-amber-500/30'
                              : 'bg-white/90 text-stone-600'
                          }
                        `}
                      >
                        {isPremium ? t('common.mainText.xclusive') : 'Standard'}
                      </span>
                    </div>

                    {/* Name */}
                    <div className='absolute bottom-0 left-0 right-0 p-2.5 sm:p-3'>
                      <h3 className='text-white text-xs sm:text-sm font-medium leading-tight truncate'>
                        {name}
                      </h3>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ── View all link ───────────────────────────────────── */}
        <motion.div
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true }}
          variants={fadeIn}
          className='text-center mt-10'
        >
          <Link
            href='/standard-package'
            className='group inline-flex items-center gap-2 text-stone-500 hover:text-stone-900 text-xs font-medium tracking-wide uppercase transition-colors duration-300'
          >
            View all services
            <ArrowRight className='w-3 h-3 group-hover:translate-x-0.5 transition-transform' />
          </Link>
        </motion.div>
      </div>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <div className='mt-16 sm:mt-20 lg:mt-24 relative w-full bg-stone-900'>
        <div className='py-14 sm:py-18 px-5 sm:px-8 lg:px-12'>
          <div className='max-w-2xl mx-auto text-center'>
            <p className='text-amber-400 uppercase tracking-[0.3em] text-[11px] font-medium mb-4'>
              Get Started
            </p>
            <h2 className='text-xl sm:text-2xl lg:text-3xl font-light text-white tracking-tight mb-4'>
              {t('services.standard.serviceGallery.cta.title')}
            </h2>
            <p className='text-white/40 text-sm leading-relaxed mb-8 max-w-md mx-auto'>
              {t('services.standard.serviceGallery.cta.description')}
            </p>

            <div className='flex flex-col sm:flex-row gap-3 justify-center'>
              <Link
                href='/standard-package'
                className='group inline-flex items-center justify-center gap-2 border border-stone-700 text-stone-300 px-6 py-2.5 text-[11px] font-medium tracking-wide uppercase hover:border-stone-500 hover:text-white transition-colors duration-300'
              >
                {t('services.standard.serviceGallery.cta.standardPackages')}
                <ArrowRight className='w-3 h-3 group-hover:translate-x-0.5 transition-transform' />
              </Link>

              <Link
                href='/premium-package'
                className='group inline-flex items-center justify-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-6 py-2.5 text-[11px] font-medium tracking-wide uppercase hover:bg-amber-500/20 transition-colors duration-300'
              >
                {t('services.standard.serviceGallery.cta.xclusivePackages')}
                <ArrowRight className='w-3 h-3 group-hover:translate-x-0.5 transition-transform' />
              </Link>
            </div>

            <div className='mt-6 flex flex-wrap items-center justify-center gap-4 text-[10px] text-stone-500'>
              {[
                t('services.standard.serviceGallery.cta.features.service247'),
                t(
                  'services.standard.serviceGallery.cta.features.uniqueExperiences',
                ),
                t(
                  'services.standard.serviceGallery.cta.features.fullyCustomized',
                ),
              ].map((feature, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <div className='w-px h-3 bg-stone-700' />}
                  <span>{feature}</span>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesGallery;
