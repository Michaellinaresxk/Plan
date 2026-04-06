import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import ServicePackagesCTA from '../service/ServicePackagesCTA';
import { useTranslation } from '@/lib/i18n/client';

const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const LuxuryServices = () => {
  const { t } = useTranslation();

  return (
    <section className='bg-white'>
      {/* ── Split layout: full bleed, edge to edge ───────────── */}
      <div className='grid grid-cols-1 lg:grid-cols-2'>
        {/* Left — Image (50% viewport on desktop) */}
        <motion.div
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true, margin: '-60px' }}
          variants={fadeIn}
          className='relative aspect-[4/5] sm:aspect-[3/4] lg:aspect-auto lg:min-h-[500px]'
        >
          <Image
            src='/img/saona-island/saona-3.jpg'
            alt='Luxury experience in Punta Cana'
            fill
            className='object-cover'
          />
          <div className='absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent' />
        </motion.div>

        {/* Right — Content (50% viewport on desktop) */}
        <motion.div
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true, margin: '-60px' }}
          variants={{
            hidden: { opacity: 0, y: 16 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.6,
                delay: 0.15,
                ease: [0.25, 0.1, 0.25, 1],
              },
            },
          }}
          className='bg-stone-950 flex flex-col justify-center px-8 sm:px-12 lg:px-16 xl:px-20 py-14 sm:py-16 lg:py-20'
        >
          <p className='text-amber-500 uppercase tracking-[0.3em] text-[11px] font-medium mb-5'>
            {t('common.mainText.slogan')}
          </p>

          <h2 className='text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-light text-white tracking-tight leading-snug mb-5'>
            {t('common.mainText.title')}
          </h2>

          <p className='text-stone-400 text-sm sm:text-base leading-relaxed mb-10 max-w-lg'>
            {t('common.mainText.subtitle')}
          </p>

          {/* Stats grid */}
          <div className='grid grid-cols-2 gap-x-10 gap-y-5 mb-10'>
            {[
              { value: '20+', label: 'Curated Services' },
              { value: '4', label: 'Languages' },
              { value: '100%', label: 'Satisfaction' },
              { value: '15 min', label: 'Setup Time' },
            ].map((item) => (
              <div key={item.label}>
                <div className='text-white text-xl lg:text-2xl font-light'>
                  {item.value}
                </div>
                <div className='text-stone-500 text-[11px] tracking-wide uppercase mt-0.5'>
                  {item.label}
                </div>
              </div>
            ))}
          </div>

          <a
            href='#services-packages'
            className='group inline-flex items-center gap-2 text-amber-400 text-xs font-medium tracking-wide uppercase hover:text-amber-300 transition-colors duration-300 w-fit'
          >
            Explore Experiences
            <ArrowRight className='w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform' />
          </a>
        </motion.div>
      </div>

      {/* ── Service Packages CTA ─────────────────────────────── */}
      <ServicePackagesCTA />
    </section>
  );
};

export default LuxuryServices;
