'use client';

import React from 'react';
import Navbar from '@/UI/components/shared/Navbar';
import Footer from '@/UI/components/shared/Footer';
import { motion } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/client';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CookiePolicyPage() {
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
              Cookie Policy
            </h1>

            <div className='prose prose-lg max-w-none'>
              <p>Last updated: April 18, 2025</p>

              <h2>1. Introduction</h2>
              <p>
                This Cookie Policy explains how Lux Punta Cana ("we," "our," or
                "us") uses cookies and similar technologies when you visit our
                website or use our services. By continuing to browse or use our
                website, you consent to our use of cookies as described in this
                policy.
              </p>

              <h2>2. What Are Cookies?</h2>
              <p>
                Cookies are small text files that are stored on your device
                (computer, tablet, or mobile phone) when you visit a website.
                They allow the website to recognize your device and remember
                some information about your visit, such as your preferences and
                actions on the site.
              </p>
              <p>
                Cookies are widely used to make websites work more efficiently
                and provide valuable information to website owners about how
                users interact with their sites.
              </p>

              <h2>3. Types of Cookies We Use</h2>
              <p>We use the following types of cookies on our website:</p>

              <h3>3.1 Essential Cookies</h3>
              <p>
                These cookies are necessary for the website to function
                properly. They enable core functionality such as security,
                network management, and account access. You cannot opt out of
                these cookies.
              </p>

              <h3>3.2 Preference Cookies</h3>
              <p>
                These cookies enable our website to remember information that
                changes the way the website behaves or looks, such as your
                preferred language or the region you are in. They help us to
                provide a better user experience.
              </p>

              <h3>3.3 Analytics Cookies</h3>
              <p>
                These cookies collect information about how visitors use our
                website, including which pages visitors go to most often and if
                they receive error messages. We use this information to improve
                our website and your browsing experience.
              </p>

              <h3>3.4 Marketing Cookies</h3>
              <p>
                These cookies are used to track visitors across websites. They
                are used to display ads that are relevant and engaging for
                individual users and thereby more valuable for publishers and
                third-party advertisers.
              </p>

              <h2>4. Third-Party Cookies</h2>
              <p>
                Some cookies are placed by third parties on our website. These
                third parties may include:
              </p>
              <ul>
                <li>Analytics providers (such as Google Analytics)</li>
                <li>Advertising networks</li>
                <li>Social media platforms</li>
                <li>Payment processors</li>
              </ul>
              <p>
                These third parties may use cookies, pixel tags, and similar
                technologies to collect information about your use of our
                website and other websites.
              </p>

              <h2>5. Managing Cookies</h2>
              <p>
                Most web browsers allow you to manage your cookie preferences.
                You can:
              </p>
              <ul>
                <li>Delete cookies from your device</li>
                <li>
                  Block cookies by activating the setting on your browser that
                  allows you to refuse all or some cookies
                </li>
                <li>
                  Set your browser to notify you when you receive a cookie
                </li>
              </ul>
              <p>
                Please note that if you choose to block or delete cookies, you
                may not be able to access certain areas or features of our
                website, and some services may not function properly.
              </p>

              <h3>5.1 How to Manage Cookies in Different Browsers</h3>
              <p>
                You can find information on how to manage cookies in your
                browser at the following links:
              </p>
              <ul>
                <li>
                  <a
                    href='https://support.google.com/chrome/answer/95647'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-blue-600 hover:underline'
                  >
                    Google Chrome
                  </a>
                </li>
                <li>
                  <a
                    href='https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-blue-600 hover:underline'
                  >
                    Mozilla Firefox
                  </a>
                </li>
                <li>
                  <a
                    href='https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-blue-600 hover:underline'
                  >
                    Safari
                  </a>
                </li>
                <li>
                  <a
                    href='https://support.microsoft.com/en-us/windows/delete-and-manage-cookies-168dab11-0753-043d-7c16-ede5947fc64d'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-blue-600 hover:underline'
                  >
                    Microsoft Edge
                  </a>
                </li>
              </ul>

              <h2>6. Cookie Consent</h2>
              <p>
                When you first visit our website, you will be presented with a
                cookie banner that allows you to accept or decline non-essential
                cookies. You can change your preferences at any time by clicking
                on the "Cookie Settings" link in the footer of our website.
              </p>

              <h2>7. Updates to This Cookie Policy</h2>
              <p>
                We may update this Cookie Policy from time to time to reflect
                changes in technology, regulation, or our business practices.
                Any changes will become effective when we post the revised
                policy on our website. We encourage you to periodically review
                this page for the latest information on our cookie practices.
              </p>

              <h2>8. Contact Us</h2>
              <p>
                If you have any questions about our use of cookies or this
                Cookie Policy, please contact us at:
              </p>
              <p>
                Email: privacy@relaxinn.com
                <br />
                Phone: +1 (809) 555-1234
                <br />
                Address: Puntacana Resort & Club, Punta Cana, Dominican Republic
              </p>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}
