'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, Send, CheckCircle } from 'lucide-react';
import Navbar from '@/UI/components/shared/Navbar';
import Footer from '@/UI/components/shared/Footer';
import Image from 'next/image';
import { useTranslation } from '@/lib/i18n/client';
import CTASection from '@/UI/components/shared/CTASection';

const ContactPage = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validación básica
    if (!formData.name || !formData.email || !formData.message) {
      setFormError('Por favor complete todos los campos requeridos.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulación de envío de formulario
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsSuccess(true);

      // Resetear el formulario después de un tiempo
      setTimeout(() => {
        setIsSuccess(false);
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
        });
      }, 5000);
    } catch (error) {
      setFormError(
        'Ha ocurrido un error al enviar su mensaje. Por favor intente nuevamente.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='flex flex-col min-h-screen font-[family-name:var(--font-geist-sans)]'>
      <Navbar />

      <main className='flex-grow'>
        {/* Hero Section */}
        <section className='relative pt-24 pb-32 overflow-hidden'>
          {/* Background with Overlay */}
          <div className='absolute inset-0 z-0'>
            <Image
              src='/img/bike.jpg'
              alt='Contact Us'
              fill
              className='object-cover'
              priority
            />
            <div className='absolute inset-0 bg-gradient-to-r from-black/80 to-black/40'></div>
          </div>

          {/* Content */}
          <div className='container mx-auto px-6 relative z-10'>
            <div className='max-w-3xl'>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                <span className='inline-block px-4 py-1 bg-white/10 backdrop-blur-sm text-white rounded-full text-sm font-medium mb-6'>
                  {t('contact.headerChip')}
                </span>
                <h1 className='text-4xl md:text-6xl font-bold mb-6 text-white leading-tight'>
                  {t('contact.headerTitle')}
                </h1>
                <p className='text-xl text-white/90 max-w-2xl font-light leading-relaxed'>
                  {t('contact.headerSubTitle')}
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Contact Options Section */}
        <section className='py-24 bg-white'>
          <div className='container mx-auto px-6'>
            <div className='max-w-3xl mx-auto text-center mb-16'>
              <span className='inline-block px-4 py-1 bg-gray-200 text-gray-800 rounded-full text-sm font-medium mb-3'>
                {t('contact.multipleChanelChip')}
              </span>
              <h2 className='text-3xl md:text-3xl font-bold text-gray-900 mb-3'>
                {t('contact.multipleChanelTitle')}
              </h2>
              <p className='text-xl text-gray-600'>
                {t('contact.multipleChanelSubTitle')}
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10'>
              {/* Contact Card 1 */}
              <motion.div
                className='bg-gray-50 rounded-xl p-8 text-center shadow-sm hover:shadow-md transition-shadow duration-300'
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6'>
                  <Phone className='w-8 h-8 text-blue-600' />
                </div>
                <h3 className='text-xl font-semibold text-gray-900 mb-3'>
                  {t('contact.channel1Title')}
                </h3>
                <p className='text-gray-600 mb-4'>
                  {t('contact.channel1SubTitle')}
                </p>
                <p className='text-blue-600 font-medium'>+1 (809) 555-1234</p>
              </motion.div>

              {/* Contact Card 2 */}
              <motion.div
                className='bg-gray-50 rounded-xl p-8 text-center shadow-sm hover:shadow-md transition-shadow duration-300'
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className='w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6'>
                  <Mail className='w-8 h-8 text-amber-600' />
                </div>
                <h3 className='text-xl font-semibold text-gray-900 mb-3'>
                  {t('contact.channel2Title')}
                </h3>
                <p className='text-gray-600 mb-4'>
                  {t('contact.channel2SubTitle')}
                </p>
                <p className='text-amber-600 font-medium'>
                  info@luxpuntacana.com
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Form and Information Section */}
        <section className='py-20 bg-gray-50'>
          <div className='container mx-auto px-6'>
            <div className='max-w-7xl mx-auto'>
              <div className='grid md:grid-cols-1 gap-12'>
                {/* Contact Form */}
                <motion.div
                  className='md:col-span-7 bg-white rounded-2xl shadow-xl overflow-hidden'
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                >
                  <div className='bg-gradient-to-r from-blue-600 to-indigo-700 py-8 px-10 text-white'>
                    <h2 className='text-2xl font-bold'>
                      {' '}
                      {t('contact.form.title')}
                    </h2>
                    <p className='text-white/80 mt-2'>
                      {t('contact.form.subTitle')}
                    </p>
                  </div>

                  <div className='p-10'>
                    {isSuccess ? (
                      <div className='bg-green-50 border border-green-100 rounded-xl p-8 text-center'>
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <CheckCircle className='w-16 h-16 text-green-500 mx-auto mb-4' />
                          <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                            {t('contact.form.success')}
                          </h3>
                          <p className='text-gray-600'>
                            {t('contact.form.successText')}
                          </p>
                        </motion.div>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className='space-y-6'>
                        <div className='grid md:grid-cols-2 gap-6'>
                          <div>
                            <label
                              htmlFor='name'
                              className='block text-gray-700 mb-2 font-medium'
                            >
                              {t('contact.form.name')}
                            </label>
                            <input
                              type='text'
                              id='name'
                              name='name'
                              value={formData.name}
                              onChange={handleInputChange}
                              required
                              className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
                              placeholder='Su nombre completo'
                            />
                          </div>

                          <div>
                            <label
                              htmlFor='email'
                              className='block text-gray-700 mb-2 font-medium'
                            >
                              {t('contact.form.email')}
                            </label>
                            <input
                              type='email'
                              id='email'
                              name='email'
                              value={formData.email}
                              onChange={handleInputChange}
                              required
                              className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
                              placeholder='Su dirección de email'
                            />
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor='subject'
                            className='block text-gray-700 mb-2 font-medium'
                          >
                            {t('contact.form.subject')}
                          </label>
                          <select
                            id='subject'
                            name='subject'
                            value={formData.subject}
                            onChange={handleInputChange}
                            className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
                          >
                            <option value=''>
                              {' '}
                              {t('contact.form.selectSubject')}
                            </option>
                            <option value='reservations'>
                              {' '}
                              {t('contact.form.subject1')}
                            </option>
                            <option value='services'>
                              {t('contact.form.subject2')}
                            </option>
                            <option value='support'>
                              {' '}
                              {t('contact.form.subject3')}
                            </option>
                            <option value='feedback'>
                              {' '}
                              {t('contact.form.subject4')}
                            </option>
                            <option value='other'>
                              {' '}
                              {t('contact.form.subject5')}
                            </option>
                          </select>
                        </div>
                        <div>
                          <label
                            htmlFor='date'
                            className='block text-gray-700 mb-2 font-medium'
                          >
                            {t('contact.form.email')}
                          </label>
                          <input
                            type='email'
                            id='email'
                            name='email'
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
                            placeholder='Su dirección de email'
                          />
                        </div>
                        <div>
                          <label
                            htmlFor='message'
                            className='block text-gray-700 mb-2 font-medium'
                          >
                            {t('contact.form.preferences')}
                          </label>
                          <textarea
                            id='message'
                            name='message'
                            value={formData.message}
                            onChange={handleInputChange}
                            required
                            rows={5}
                            className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
                            placeholder={t('contact.form.messagePlaceHolder')}
                          ></textarea>
                        </div>

                        {formError && (
                          <div className='p-4 bg-red-50 border border-red-200 rounded-lg text-red-700'>
                            {formError}
                          </div>
                        )}

                        <button
                          type='submit'
                          disabled={isSubmitting}
                          className='w-full md:w-auto inline-flex items-center justify-center py-3 px-8 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-md hover:shadow-lg transform active:scale-[0.98]'
                        >
                          {isSubmitting ? (
                            <>
                              <svg
                                className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                                xmlns='http://www.w3.org/2000/svg'
                                fill='none'
                                viewBox='0 0 24 24'
                              >
                                <circle
                                  className='opacity-25'
                                  cx='12'
                                  cy='12'
                                  r='10'
                                  stroke='currentColor'
                                  strokeWidth='4'
                                ></circle>
                                <path
                                  className='opacity-75'
                                  fill='currentColor'
                                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                                ></path>
                              </svg>

                              {t('contact.form.sending')}
                            </>
                          ) : (
                            <>
                              {t('contact.form.submitButton')}{' '}
                              <Send className='ml-2 h-5 w-5' />
                            </>
                          )}
                        </button>
                      </form>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        <CTASection />
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;
