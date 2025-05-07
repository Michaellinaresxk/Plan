'use client';

import React from 'react';
import Navbar from '@/UI/components/shared/Navbar';
import Footer from '@/UI/components/shared/Footer';
import { motion } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/client';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  const { t } = useTranslation();
  return (
    <>
      <Navbar />
      <div className='min-h-screen bg-gray-50 pt-24'>
        <div className='container mx-auto px-6 py-12'>
          <div className='flex  items-center space-x-4 my-6'>
            <Link
              href='/'
              className='flex items-center text-gray-600 hover:text-gray-900 transition-colors px-4 py-2 rounded-lg hover:bg-gray-100'
            >
              <ArrowLeft size={20} className='mr-2' />
              {t('services.actions.backToHome', {
                fallback: 'Back to Home',
              })}
            </Link>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto'
          >
            <h1 className='text-3xl font-bold text-gray-900 mb-6'>
              Privacy Policy
            </h1>

            <div className='prose prose-lg max-w-none'>
              <p>Last updated: April 18, 2025</p>

              <h2>1. Introduction</h2>
              <p>
                At RelaxInn Vacation Homes ("we," "our," or "us"), we respect
                your privacy and are committed to protecting the personal
                information you share with us. This Privacy Policy explains how
                we collect, use, disclose, and safeguard your information when
                you visit our website or use our services.
              </p>

              <h2>2. Information We Collect</h2>
              <p>
                We may collect personal information that you voluntarily provide
                to us when you:
              </p>
              <ul>
                <li>Register for an account</li>
                <li>Book a vacation home or service</li>
                <li>Contact our customer service</li>
                <li>Subscribe to our newsletter</li>
                <li>Participate in surveys or promotions</li>
              </ul>

              <p>The types of information we may collect include:</p>
              <ul>
                <li>Contact information (name, email address, phone number)</li>
                <li>
                  Billing information (credit card details, billing address)
                </li>
                <li>
                  Identity information (passport details for resort access)
                </li>
                <li>Booking preferences and special requests</li>
                <li>Device information and usage data</li>
              </ul>

              <h2>3. How We Use Your Information</h2>
              <p>We may use the information we collect to:</p>
              <ul>
                <li>Process and manage your bookings</li>
                <li>Provide and maintain our services</li>
                <li>Communicate with you about your reservations</li>
                <li>
                  Send you promotional materials and newsletters (with your
                  consent)
                </li>
                <li>Improve our website and services</li>
                <li>Comply with legal obligations</li>
              </ul>

              <h2>4. Information Sharing and Disclosure</h2>
              <p>We may share your information with:</p>
              <ul>
                <li>Service providers who perform services on our behalf</li>
                <li>Resort partners to facilitate your stay</li>
                <li>
                  Third-party service providers you choose to book through us
                </li>
                <li>Legal authorities when required by law</li>
              </ul>

              <h2>5. Your Rights</h2>
              <p>Depending on your location, you may have the right to:</p>
              <ul>
                <li>Access the personal information we hold about you</li>
                <li>Correct inaccurate or incomplete information</li>
                <li>Request deletion of your personal information</li>
                <li>Restrict or object to processing of your information</li>
                <li>Request transfer of your information</li>
                <li>Withdraw consent where processing is based on consent</li>
              </ul>

              <h2>6. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures
                to protect your personal information against unauthorized
                access, accidental loss, or destruction.
              </p>

              <h2>7. Cookies and Tracking Technologies</h2>
              <p>
                We use cookies and similar tracking technologies to collect
                information about your browsing activities. You can manage your
                preferences for cookies through your browser settings. For more
                information, please see our{' '}
                <a
                  href='/cookie-policy'
                  className='text-blue-600 hover:underline'
                >
                  Cookie Policy
                </a>
                .
              </p>

              <h2>8. International Data Transfers</h2>
              <p>
                Your information may be transferred to and processed in
                countries other than your country of residence, including the
                Dominican Republic and the United States, where our servers are
                located. We ensure appropriate safeguards are in place to
                protect your information when transferred internationally.
              </p>

              <h2>9. Children's Privacy</h2>
              <p>
                Our services are not directed to individuals under the age of
                18. We do not knowingly collect personal information from
                children. If you believe we have inadvertently collected
                information from a child, please contact us immediately.
              </p>

              <h2>10. Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will
                notify you of any changes by posting the new Privacy Policy on
                this page and updating the "Last updated" date.
              </p>

              <h2>11. Contact Us</h2>
              <p>
                If you have any questions or concerns about this Privacy Policy
                or our data practices, please contact us at:
              </p>
              <p>
                Email: privacy@relaxinn.com
                <br />
                Phone: +1 (809) 555-1234
                <br />
                Address: Hacienda B-25, Puntacana Resort & Club, Punta Cana,
                Dominican Republic
              </p>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}
