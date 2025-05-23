// components/confirmation/ClientInfoForm.tsx
import React, { useState } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { motion } from 'framer-motion';
import { User, Mail, Phone, AlertCircle } from 'lucide-react';

interface ClientInfo {
  name: string;
  email: string;
  phone: string;
}

interface ClientInfoFormProps {
  onSubmit: (clientInfo: ClientInfo) => void;
  onBack: () => void;
}

const ClientInfoForm: React.FC<ClientInfoFormProps> = ({
  onSubmit,
  onBack,
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<ClientInfo>({
    name: '',
    email: '',
    phone: '',
  });
  const [errors, setErrors] = useState<Partial<ClientInfo>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation patterns
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phonePattern = /^[\+]?[\d\s\-\(\)]+$/;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as keyof ClientInfo]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ClientInfo> = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = t('form.errors.nameRequired', {
        fallback: 'Name is required',
      });
    } else if (formData.name.trim().length < 2) {
      newErrors.name = t('form.errors.nameMinLength', {
        fallback: 'Name must be at least 2 characters',
      });
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = t('form.errors.emailRequired', {
        fallback: 'Email is required',
      });
    } else if (!emailPattern.test(formData.email)) {
      newErrors.email = t('form.errors.emailInvalid', {
        fallback: 'Please enter a valid email address',
      });
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = t('form.errors.phoneRequired', {
        fallback: 'Phone number is required',
      });
    } else if (!phonePattern.test(formData.phone)) {
      newErrors.phone = t('form.errors.phoneInvalid', {
        fallback: 'Please enter a valid phone number',
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    onSubmit(formData);
    setIsSubmitting(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* Form Introduction */}
        <div className='text-center mb-8'>
          <h3 className='text-xl font-semibold text-gray-900 mb-2'>
            {t('reservation.contactForm.title', {
              fallback: 'We need your contact information',
            })}
          </h3>
          <p className='text-gray-600'>
            {t('reservation.contactForm.description', {
              fallback:
                'This information will be used to confirm your booking and send you important updates.',
            })}
          </p>
        </div>

        {/* Name Field */}
        <div>
          <label
            htmlFor='name'
            className='block text-sm font-medium text-gray-700 mb-2'
          >
            <User className='w-4 h-4 inline mr-2' />
            {t('form.labels.fullName', { fallback: 'Full Name' })}
            <span className='text-red-500 ml-1'>*</span>
          </label>
          <input
            type='text'
            id='name'
            name='name'
            value={formData.name}
            onChange={handleChange}
            placeholder={t('form.placeholders.fullName', {
              fallback: 'Enter your full name',
            })}
            className={`
              w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors
              ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'}
            `}
          />
          {errors.name && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className='mt-1 text-sm text-red-600 flex items-center'
            >
              <AlertCircle className='w-4 h-4 mr-1' />
              {errors.name}
            </motion.p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label
            htmlFor='email'
            className='block text-sm font-medium text-gray-700 mb-2'
          >
            <Mail className='w-4 h-4 inline mr-2' />
            {t('form.labels.email', { fallback: 'Email Address' })}
            <span className='text-red-500 ml-1'>*</span>
          </label>
          <input
            type='email'
            id='email'
            name='email'
            value={formData.email}
            onChange={handleChange}
            placeholder={t('form.placeholders.email', {
              fallback: 'your.email@example.com',
            })}
            className={`
              w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors
              ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'}
            `}
          />
          {errors.email && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className='mt-1 text-sm text-red-600 flex items-center'
            >
              <AlertCircle className='w-4 h-4 mr-1' />
              {errors.email}
            </motion.p>
          )}
        </div>

        {/* Phone Field */}
        <div>
          <label
            htmlFor='phone'
            className='block text-sm font-medium text-gray-700 mb-2'
          >
            <Phone className='w-4 h-4 inline mr-2' />
            {t('form.labels.phone', { fallback: 'Phone Number' })}
            <span className='text-red-500 ml-1'>*</span>
          </label>
          <input
            type='tel'
            id='phone'
            name='phone'
            value={formData.phone}
            onChange={handleChange}
            placeholder={t('form.placeholders.phone', {
              fallback: '+1 (555) 123-4567',
            })}
            className={`
              w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors
              ${errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'}
            `}
          />
          {errors.phone && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className='mt-1 text-sm text-red-600 flex items-center'
            >
              <AlertCircle className='w-4 h-4 mr-1' />
              {errors.phone}
            </motion.p>
          )}
        </div>

        {/* Privacy Notice */}
        <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
          <p className='text-sm text-blue-700'>
            <span className='font-medium'>Privacy Notice:</span> Your
            information will only be used for booking confirmation and service
            delivery. We never share your data with third parties.
          </p>
        </div>

        {/* Form Actions */}
        <div className='flex flex-col sm:flex-row gap-4 pt-6'>
          <button
            type='button'
            onClick={onBack}
            className='flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors'
          >
            {t('common.back', { fallback: 'Back' })}
          </button>

          <button
            type='submit'
            disabled={isSubmitting}
            className={`
              flex-1 px-6 py-3 rounded-lg transition-colors flex items-center justify-center
              ${
                isSubmitting
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white
            `}
          >
            {isSubmitting ? (
              <>
                <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
                {t('common.processing', { fallback: 'Processing...' })}
              </>
            ) : (
              t('reservation.contactForm.continue', {
                fallback: 'Continue to Payment',
              })
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default ClientInfoForm;
