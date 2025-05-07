'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Phone,
  Mail,
  Send,
  CheckCircle,
  Calendar,
  Clock,
  Globe,
  MessageSquare,
} from 'lucide-react';
import Navbar from '@/UI/components/shared/Navbar';
import Footer from '@/UI/components/shared/Footer';
import Image from 'next/image';
import { useTranslation } from '@/lib/i18n/client';
import CTASection from '@/UI/components/shared/CTASection';

// Componente para la página de contacto
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
            <div className='max-w-4xl mx-auto text-center mb-16'>
              <span className='inline-block px-4 py-1 bg-gray-200 text-gray-800 rounded-full text-sm font-medium mb-4'>
                {t('contact.multipleChanelChip')}
              </span>
              <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>
                {t('contact.multipleChanelTitle')}
              </h2>
              <p className='text-xl text-gray-600'>
                {t('contact.multipleChanelSubTitle')}
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
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
                  info@puntacanaplan.com
                </p>
              </motion.div>

              {/* Contact Card 3 */}
              <motion.div
                className='bg-gray-50 rounded-xl p-8 text-center shadow-sm hover:shadow-md transition-shadow duration-300'
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6'>
                  <MapPin className='w-8 h-8 text-green-600' />
                </div>
                <h3 className='text-xl font-semibold text-gray-900 mb-3'>
                  {t('contact.channel3Title')}
                </h3>
                <p className='text-gray-600 mb-4'>
                  {t('contact.channel3SubTitle')}
                </p>
                <p className='text-green-600 font-medium'>
                  Puntacana Resort & Club
                </p>
              </motion.div>

              {/* Contact Card 4 */}
              <motion.div
                className='bg-gray-50 rounded-xl p-8 text-center shadow-sm hover:shadow-md transition-shadow duration-300'
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className='w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6'>
                  <MessageSquare className='w-8 h-8 text-purple-600' />
                </div>
                <h3 className='text-xl font-semibold text-gray-900 mb-3'>
                  {t('contact.channel4Title')}
                </h3>
                <p className='text-gray-600 mb-4'>Nombre completo *</p>
                <button className='text-purple-600 font-medium inline-flex items-center'>
                  Iniciar chat{' '}
                  <span className='w-2 h-2 bg-green-500 rounded-full ml-2'></span>
                </button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Form and Information Section */}
        <section className='py-20 bg-gray-50'>
          <div className='container mx-auto px-6'>
            <div className='max-w-7xl mx-auto'>
              <div className='grid md:grid-cols-12 gap-12'>
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
                            htmlFor='message'
                            className='block text-gray-700 mb-2 font-medium'
                          >
                            {t('contact.form.message')}
                          </label>
                          <textarea
                            id='message'
                            name='message'
                            value={formData.message}
                            onChange={handleInputChange}
                            required
                            rows={5}
                            className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
                            placeholder='Escriba su mensaje aquí'
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

                {/* Contact Information */}
                <motion.div
                  className='md:col-span-5'
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                >
                  <div className='bg-gray-900 text-white p-10 rounded-2xl h-full flex flex-col'>
                    <h2 className='text-2xl font-bold mb-8'>
                      {t('contact.contactInformation.title')}
                    </h2>

                    <div className='space-y-6 mb-8'>
                      <div className='flex'>
                        <div className='flex-shrink-0 bg-white/10 rounded-full p-3 mr-4'>
                          <MapPin className='w-6 h-6 text-blue-400' />
                        </div>
                        <div>
                          <h3 className='font-medium text-white mb-1'>
                            {t('contact.contactInformation.ourLocation')}
                          </h3>
                          <p className='text-white/70'>
                            Hacienda B-25, Puntacana Resort & Club
                            <br />
                            Punta Cana, La Altagracia
                            <br />
                            República Dominicana
                          </p>
                        </div>
                      </div>

                      <div className='flex'>
                        <div className='flex-shrink-0 bg-white/10 rounded-full p-3 mr-4'>
                          <Mail className='w-6 h-6 text-blue-400' />
                        </div>
                        <div>
                          <h3 className='font-medium text-white mb-1'>
                            {' '}
                            {t('contact.contactInformation.email')}
                          </h3>
                          <p className='text-white/70'>
                            info@puntacanaplan.com
                          </p>
                          <p className='text-white/70'>
                            booking@puntacanaplan.com
                          </p>
                        </div>
                      </div>

                      <div className='flex'>
                        <div className='flex-shrink-0 bg-white/10 rounded-full p-3 mr-4'>
                          <Phone className='w-6 h-6 text-blue-400' />
                        </div>
                        <div>
                          <h3 className='font-medium text-white mb-1'>
                            {t('contact.contactInformation.phone')}
                          </h3>
                          <p className='text-white/70'>+1 (809) 555-1234</p>
                          <p className='text-white/70'>+1 (809) 555-5678</p>
                        </div>
                      </div>

                      <div className='flex'>
                        <div className='flex-shrink-0 bg-white/10 rounded-full p-3 mr-4'>
                          <Clock className='w-6 h-6 text-blue-400' />
                        </div>
                        <div>
                          <h3 className='font-medium text-white mb-1'>
                            {t('contact.contactInformation.date')}
                          </h3>
                          <p className='text-white/70'>
                            {t('contact.contactInformation.monday')}: 8:00 AM -
                            8:00 PM
                          </p>
                          <p className='text-white/70'>
                            {t('contact.contactInformation.saturday')}: 9:00 AM
                            - 6:00 PM
                          </p>
                          <p className='text-white/70'>
                            {t('contact.contactInformation.sunday')}: 10:00 AM -
                            4:00 PM
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className='mt-auto'>
                      <h3 className='font-medium text-white mb-4'>
                        {' '}
                        {t('contact.contactInformation.follow')}
                      </h3>
                      <div className='flex space-x-4'>
                        <a
                          href='#'
                          className='bg-white/10 p-3 rounded-full hover:bg-white/20 transition-colors'
                        >
                          <svg
                            className='w-5 h-5 text-white'
                            fill='currentColor'
                            viewBox='0 0 24 24'
                          >
                            <path d='M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z' />
                          </svg>
                        </a>
                        <a
                          href='#'
                          className='bg-white/10 p-3 rounded-full hover:bg-white/20 transition-colors'
                        >
                          <svg
                            className='w-5 h-5 text-white'
                            fill='currentColor'
                            viewBox='0 0 24 24'
                          >
                            <path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' />
                          </svg>
                        </a>
                        <a
                          href='#'
                          className='bg-white/10 p-3 rounded-full hover:bg-white/20 transition-colors'
                        >
                          <svg
                            className='w-5 h-5 text-white'
                            fill='currentColor'
                            viewBox='0 0 24 24'
                          >
                            <path d='M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z' />
                          </svg>
                        </a>
                        <a
                          href='#'
                          className='bg-white/10 p-3 rounded-full hover:bg-white/20 transition-colors'
                        >
                          <svg
                            className='w-5 h-5 text-white'
                            fill='currentColor'
                            viewBox='0 0 24 24'
                          >
                            <path d='M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z'></path>
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        <CTASection />

        {/* Map Section */}
        <section className='py-24 bg-white'>
          <div className='container mx-auto px-6'>
            <div className='max-w-4xl mx-auto text-center mb-16'>
              <span className='inline-block px-4 py-1 bg-gray-200 text-gray-800 rounded-full text-sm font-medium mb-4'>
                {t('contact.Cta.visitUs')}
              </span>
              <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>
                {t('contact.Cta.visitUsTitle')}
              </h2>
              <p className='text-xl text-gray-600'>
                {t('contact.Cta.visitUsSubTitle')}
              </p>
            </div>

            <div className='rounded-2xl overflow-hidden shadow-lg max-w-6xl mx-auto'>
              <div className='h-[500px] w-full relative bg-gray-200'>
                {/* This would usually be replaced with an actual map component */}
                <div
                  className='h-full w-full bg-cover bg-center'
                  style={{
                    backgroundImage: 'url("/api/placeholder/1200/600")',
                  }}
                >
                  <div className='absolute inset-0 flex items-center justify-center'>
                    <div className='bg-white p-6 rounded-xl shadow-xl max-w-md'>
                      <div className='flex items-start'>
                        <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0'>
                          <MapPin className='w-6 h-6 text-blue-600' />
                        </div>
                        <div>
                          <h3 className='text-xl font-bold text-gray-900 mb-1'>
                            Punta Cana Plan
                          </h3>
                          <p className='text-gray-600 mb-3'>
                            Hacienda B-25, Puntacana Resort & Club, Punta Cana,
                            República Dominicana
                          </p>
                          <div className='flex space-x-3'>
                            <a
                              href='https://maps.google.com'
                              target='_blank'
                              rel='noopener noreferrer'
                              className='inline-flex items-center text-sm px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors'
                            >
                              <Globe className='w-4 h-4 mr-1' />
                              {t('contact.map.seeOnGoogle')}
                            </a>
                            <a
                              href='#'
                              className='inline-flex items-center text-sm px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors'
                            >
                              <Calendar className='w-4 h-4 mr-1' />
                              {t('contact.map.book')}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;
