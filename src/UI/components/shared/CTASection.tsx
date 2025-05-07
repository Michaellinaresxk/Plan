import { motion } from 'framer-motion';
import { Mail, Phone } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/client';
const CTASection = () => {
  const { t } = useTranslation();
  return (
    <>
      {/* Call-to-action Section */}
      <section className='py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white relative overflow-hidden'>
        {/* Background pattern */}
        <div className='absolute inset-0 opacity-10'>
          <div className='absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 opacity-30'></div>
          <svg
            className='absolute inset-0 w-full h-full'
            viewBox='0 0 100 100'
            preserveAspectRatio='none'
          >
            <pattern
              id='grid'
              width='8'
              height='8'
              patternUnits='userSpaceOnUse'
            >
              <path
                d='M 8 0 L 0 0 0 8'
                fill='none'
                stroke='white'
                strokeWidth='0.5'
              />
            </pattern>
            <rect width='100%' height='100%' fill='url(#grid)' />
          </svg>
        </div>

        <div className='container mx-auto px-6 relative z-10'>
          <div className='max-w-4xl mx-auto text-center'>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <h2 className='text-4xl md:text-5xl font-bold mb-6'>
                {t('contact.Cta.title')}
              </h2>
              <p className='text-xl text-white/90 mb-10 max-w-3xl mx-auto'>
                {t('contact.Cta.subTitle')}
              </p>
              <div className='flex flex-wrap justify-center gap-4'>
                <a
                  href='tel:+18095551234'
                  className='inline-flex items-center px-8 py-4 bg-white text-blue-700 hover:bg-gray-100 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                >
                  <Phone className='mr-2 h-5 w-5' />
                  {t('contact.Cta.btn1')}
                </a>
                <a
                  href='#contact-form'
                  className='inline-flex items-center px-8 py-4 bg-blue-500 bg-opacity-30 backdrop-blur-sm hover:bg-opacity-40 text-white border border-white/30 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                >
                  <Mail className='mr-2 h-5 w-5' />
                  {t('contact.Cta.btn2')}
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CTASection;
