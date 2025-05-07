import { useTranslation } from '@/lib/i18n/client';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

const FaqsPage = () => {
  const { t } = useTranslation();
  return (
    <section className='py-20 bg-gray-50'>
      <div className='container mx-auto px-6'>
        <div className='max-w-4xl mx-auto text-center mb-16'>
          <span className='inline-block px-4 py-1 bg-gray-200 text-gray-800 rounded-full text-sm font-medium mb-4'>
            {t('customPackage.faq', { fallback: 'FAQ' })}
          </span>
          <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>
            {t('faqs.title', {
              fallback: 'Frequently Asked Questions',
            })}
          </h2>
          <p className='text-xl text-gray-600'>
            {t('faqs.subtitle', {
              fallback:
                'Find answers to common questions about our custom packages',
            })}
          </p>
        </div>

        <div className='max-w-3xl mx-auto'>
          <div className='space-y-6'>
            {/* FAQ Item 1 */}
            <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100'>
              <h3 className='text-lg font-semibold text-gray-900 mb-3'>
                {t('customPackage.faqQ1', {
                  fallback:
                    'How far in advance should I book my custom package?',
                })}
              </h3>
              <p className='text-gray-600'>
                {t('customPackage.faqA1', {
                  fallback:
                    'We recommend booking at least 2-3 weeks in advance to ensure availability of all services. For peak season travel (December to April), 1-2 months advance booking is advised for the best selection.',
                })}
              </p>
            </div>

            {/* FAQ Item 2 */}
            <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100'>
              <h3 className='text-lg font-semibold text-gray-900 mb-3'>
                {t('customPackage.faqQ2', {
                  fallback: 'Can I modify my package after booking?',
                })}
              </h3>
              <p className='text-gray-600'>
                {t('customPackage.faqA2', {
                  fallback:
                    'Yes, you can modify your package up to 72 hours before your scheduled service date, subject to availability. Contact our concierge team for assistance with any changes.',
                })}
              </p>
            </div>

            {/* FAQ Item 3 */}
            <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100'>
              <h3 className='text-lg font-semibold text-gray-900 mb-3'>
                {t('customPackage.faqQ3', {
                  fallback: 'What payment methods do you accept?',
                })}
              </h3>
              <p className='text-gray-600'>
                {t('customPackage.faqA3', {
                  fallback:
                    'We accept all major credit cards, PayPal, and bank transfers. For certain premium services, a deposit may be required at the time of booking.',
                })}
              </p>
            </div>
          </div>

          <div className='text-center mt-12'>
            <Link
              href='/contact'
              className='inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors'
            >
              {t('faqs.btn', {
                fallback: 'Have more questions? Contact us',
              })}
              <ChevronRight className='ml-2 h-5 w-5' />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqsPage;
