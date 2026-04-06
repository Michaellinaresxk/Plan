'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Phone,
  Mail,
  Send,
  CheckCircle,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import Navbar from '@/UI/components/shared/Navbar';
import Footer from '@/UI/components/shared/Footer';
import Image from 'next/image';
import { useTranslation } from '@/lib/i18n/client';
import CTASection from '@/UI/components/shared/CTASection';
import InstagramCTA from '@/UI/components/shared/InstagramCTA';
import FloatingActionButton from '@/UI/components/shared/WhatsAppFloatingButton';

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
  visible: { transition: { staggerChildren: 0.1 } },
};

// ─── Constants ────────────────────────────────────────────────────────────────

const PHONE_NUMBER = '13027248080';
const EMAIL_ADDRESS = 'info@luxpuntacana.com';

// ─── Component ────────────────────────────────────────────────────────────────

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

  const inputBase =
    'w-full p-3 border rounded-none bg-stone-50 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900 transition-colors';

  const handleInput = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
      if (formError) setFormError(null);
    },
    [formError],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setFormError(null);

      if (!formData.name || !formData.email || !formData.message) {
        setFormError(
          t('contact.form.errorRequired', {
            fallback: 'Please complete all required fields.',
          }),
        );
        return;
      }

      setIsSubmitting(true);

      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        const result = await res.json();
        if (!res.ok) throw new Error(result.error || 'Failed to send message');

        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          setFormData({ name: '', email: '', subject: '', message: '' });
        }, 5000);
      } catch (error) {
        setFormError(
          error instanceof Error
            ? error.message
            : 'Unable to send your message. Please try again.',
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, t],
  );

  const openWhatsApp = useCallback(() => {
    const msg = encodeURIComponent(
      'Hello! I would like to know more about your services.',
    );
    window.open(
      `https://wa.me/${PHONE_NUMBER}?text=${msg}`,
      '_blank',
      'noopener,noreferrer',
    );
  }, []);

  const openEmail = useCallback(() => {
    const subject = encodeURIComponent('Inquiry about your services');
    const body = encodeURIComponent(
      'Hello! I would like to know more about your services.',
    );
    window.location.href = `mailto:${EMAIL_ADDRESS}?subject=${subject}&body=${body}`;
  }, []);

  return (
    <div className='flex flex-col min-h-screen bg-stone-50'>
      <Navbar />
      <FloatingActionButton
        message='Hi! I need help with luxury services'
        position='bottom-right'
      />

      <main className='flex-grow'>
        {/* ── Hero — full bleed ──────────────────────────────── */}
        <motion.section
          className='relative w-full h-[45vh] sm:h-[50vh] lg:h-[55vh]'
          initial='hidden'
          animate='visible'
          variants={fadeIn}
        >
          <Image
            src='/img/bike.jpg'
            alt='Contact Us'
            fill
            className='object-cover'
            priority
          />
          <div className='absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent' />

          <div className='relative z-10 h-full flex items-end'>
            <div className='w-full px-5 sm:px-8 lg:px-12 pb-10 sm:pb-14 lg:pb-16'>
              <div className='max-w-2xl'>
                <p className='text-amber-300 uppercase tracking-[0.3em] text-[11px] sm:text-xs font-medium mb-3'>
                  {t('contact.headerChip')}
                </p>
                <h1 className='text-3xl sm:text-4xl lg:text-5xl font-light text-white leading-[1.1] tracking-tight mb-3'>
                  {t('contact.headerTitle')}
                </h1>
                <p className='text-white/55 text-sm sm:text-base max-w-md leading-relaxed font-light'>
                  {t('contact.headerSubTitle')}
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ── Contact Channels ───────────────────────────────── */}
        <motion.section
          className='px-5 sm:px-8 lg:px-12 py-14 sm:py-18 lg:py-20'
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true, margin: '-60px' }}
          variants={stagger}
        >
          <motion.div className='mb-10 text-center' variants={fadeIn}>
            <p className='text-amber-600 uppercase tracking-[0.25em] text-[11px] font-medium mb-2'>
              {t('contact.multipleChanelChip')}
            </p>
            <h2 className='text-2xl sm:text-3xl lg:text-4xl font-light text-stone-900 tracking-tight mb-3'>
              {t('contact.multipleChanelTitle')}
            </h2>
            <p className='text-stone-400 text-sm sm:text-base max-w-md mx-auto'>
              {t('contact.multipleChanelSubTitle')}
            </p>
          </motion.div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto'>
            <motion.button
              type='button'
              onClick={openWhatsApp}
              variants={fadeIn}
              className='border border-stone-200 bg-white p-6 text-left hover:border-stone-400 transition-colors group'
            >
              <Phone className='w-4 h-4 text-stone-400 mb-4' />
              <h3 className='text-stone-900 text-sm font-medium mb-1'>
                {t('contact.channel1Title')}
              </h3>
              <p className='text-stone-400 text-xs mb-3'>
                {t('contact.channel1SubTitle')}
              </p>
              <span className='text-amber-600 text-xs font-medium'>
                +1 302-724-8080
              </span>
            </motion.button>

            <motion.button
              type='button'
              onClick={openEmail}
              variants={fadeIn}
              className='border border-stone-200 bg-white p-6 text-left hover:border-stone-400 transition-colors group'
            >
              <Mail className='w-4 h-4 text-stone-400 mb-4' />
              <h3 className='text-stone-900 text-sm font-medium mb-1'>
                {t('contact.channel2Title')}
              </h3>
              <p className='text-stone-400 text-xs mb-3'>
                {t('contact.channel2SubTitle')}
              </p>
              <span className='text-amber-600 text-xs font-medium'>
                {EMAIL_ADDRESS}
              </span>
            </motion.button>
          </div>
        </motion.section>

        {/* ── Contact Form ───────────────────────────────────── */}
        <motion.section
          className='px-5 sm:px-8 lg:px-12 pb-14 sm:pb-18 lg:pb-20'
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true, margin: '-60px' }}
          variants={fadeIn}
        >
          <div className='max-w-2xl mx-auto'>
            <div className='border border-stone-200 bg-white'>
              {/* Form header */}
              <div className='bg-stone-900 px-6 sm:px-8 py-6'>
                <h2 className='text-white text-base font-medium'>
                  {t('contact.form.title')}
                </h2>
                <p className='text-stone-400 text-xs mt-1'>
                  {t('contact.form.subTitle')}
                </p>
              </div>

              <div className='p-6 sm:p-8'>
                {isSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className='text-center py-10'
                  >
                    <CheckCircle className='w-10 h-10 text-emerald-500 mx-auto mb-4' />
                    <h3 className='text-stone-900 text-base font-medium mb-1'>
                      {t('contact.form.success')}
                    </h3>
                    <p className='text-stone-400 text-sm'>
                      {t('contact.form.successText')}
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className='space-y-5'>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
                      <div>
                        <label
                          htmlFor='name'
                          className='block text-xs font-medium text-stone-700 mb-2'
                        >
                          {t('contact.form.name')}{' '}
                          <span className='text-amber-600'>*</span>
                        </label>
                        <input
                          type='text'
                          id='name'
                          name='name'
                          required
                          value={formData.name}
                          onChange={handleInput}
                          placeholder={t('contact.form.name')}
                          className={`${inputBase} border-stone-300`}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor='email'
                          className='block text-xs font-medium text-stone-700 mb-2'
                        >
                          {t('contact.form.email')}{' '}
                          <span className='text-amber-600'>*</span>
                        </label>
                        <input
                          type='email'
                          id='email'
                          name='email'
                          required
                          value={formData.email}
                          onChange={handleInput}
                          placeholder={t('contact.form.email')}
                          className={`${inputBase} border-stone-300`}
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor='subject'
                        className='block text-xs font-medium text-stone-700 mb-2'
                      >
                        {t('contact.form.subject')}
                      </label>
                      <select
                        id='subject'
                        name='subject'
                        value={formData.subject}
                        onChange={handleInput}
                        className={`${inputBase} border-stone-300`}
                      >
                        <option value=''>
                          {t('contact.form.selectSubject')}
                        </option>
                        <option value='reservations'>
                          {t('contact.form.subject1')}
                        </option>
                        <option value='services'>
                          {t('contact.form.subject2')}
                        </option>
                        <option value='support'>
                          {t('contact.form.subject3')}
                        </option>
                        <option value='feedback'>
                          {t('contact.form.subject4')}
                        </option>
                        <option value='other'>
                          {t('contact.form.subject5')}
                        </option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor='message'
                        className='block text-xs font-medium text-stone-700 mb-2'
                      >
                        {t('contact.form.messagePlaceHolder')}{' '}
                        <span className='text-amber-600'>*</span>
                      </label>
                      <textarea
                        id='message'
                        name='message'
                        required
                        rows={4}
                        value={formData.message}
                        onChange={handleInput}
                        placeholder={t('contact.form.messagePlaceHolder')}
                        className={`${inputBase} border-stone-300 resize-none`}
                      />
                    </div>

                    {/* Honeypot */}
                    <input
                      type='text'
                      name='_honeypot'
                      style={{ display: 'none' }}
                      tabIndex={-1}
                      autoComplete='off'
                    />

                    {formError && (
                      <div className='flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-sm text-red-800'>
                        <AlertCircle className='w-4 h-4 flex-shrink-0' />
                        {formError}
                      </div>
                    )}

                    <button
                      type='submit'
                      disabled={isSubmitting}
                      className='inline-flex items-center gap-2 bg-stone-900 text-white px-6 py-3 text-xs font-medium tracking-wide uppercase hover:bg-stone-800 transition-colors disabled:opacity-50'
                    >
                      {isSubmitting ? (
                        <>
                          <div className='w-4 h-4 border-2 border-stone-600 border-t-white rounded-full animate-spin' />
                          {t('contact.form.sending')}
                        </>
                      ) : (
                        <>
                          {t('contact.form.submitButton')}
                          <Send className='w-3.5 h-3.5' />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </motion.section>

        {/* ── Instagram + CTA ────────────────────────────────── */}
        <div className='px-5 sm:px-8 lg:px-12 pb-14'>
          <InstagramCTA />
        </div>
        <CTASection />
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;
