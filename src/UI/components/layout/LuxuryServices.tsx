import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import ServicePackagesCTA from '../service/ServicePackagesCTA';
import { useTranslation } from '@/lib/i18n/client';

const LuxuryServices = () => {
  const { t } = useTranslation();

  return (
    <section className='py-24 bg-white relative overflow-hidden'>
      {/* Subtle Background Pattern */}
      <div className='absolute inset-0 opacity-5'>
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.3),transparent)] bg-[length:100px_100px]' />
      </div>

      <div className='container mx-auto px-6 relative z-10'>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className='max-w-5xl mx-auto text-center'
        >
          <div className='flex items-center justify-center mb-8'>
            <div className='w-24 h-px bg-gradient-to-r from-transparent to-slate-800' />
            <Sparkles className='mx-4 w-8 h-8 text-slate-800' />
            <div className='w-24 h-px bg-gradient-to-l from-transparent to-slate-800' />
          </div>

          <h2 className='text-4xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent leading-tight'>
            {t('common.mainText.title')}
          </h2>

          <p className='text-xl md:text-2xl text-slate-700 leading-relaxed font-light'>
            {t('common.mainText.subtitle')}
            <span className='text-blue-600 font-medium'>
              {' '}
              {t('common.mainText.slogan')}
            </span>
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className='mt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto'
          >
            <div className='text-center'>
              <div className='text-3xl font-bold text-blue-600 mb-2'>15+</div>
              <div className='text-slate-600 text-sm'>Años de Experiencia</div>
            </div>
            <div className='text-center'>
              <div className='text-3xl font-bold text-blue-600 mb-2'>500+</div>
              <div className='text-slate-600 text-sm'>Clientes Satisfechos</div>
            </div>
            <div className='text-center'>
              <div className='text-3xl font-bold text-blue-600 mb-2'>100%</div>
              <div className='text-slate-600 text-sm'>Servicio Premium</div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <ServicePackagesCTA />
    </section>
  );
};
export default LuxuryServices;
