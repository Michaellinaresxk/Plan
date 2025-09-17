'use client';

import React from 'react';
import Link from 'next/link';
import {
  MapPin,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Twitter,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/client';

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className='footer text-white' id='contact'>
      <div className='container mx-auto px-6 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          {/* Company Info */}
          <div className='md:col-span-1'>
            <h3 className='text-xl font-bold mb-4'>Lux Punta Cana</h3>
            <p className='text-gray-400 mb-6'>{t('common.footer.slogan')}</p>
            <div className='flex space-x-4'>
              <Link
                href='https://www.instagram.com/lxpuntacana?igsh=bnp1NGtnbWpna3I4&utm_source=qr'
                target='_blank'
                className='text-gray-400 hover:text-white transition-colors'
              >
                <Instagram size={20} />
              </Link>
              {/* <a
                href='#'
                className='text-gray-400 hover:text-white transition-colors'
              >
                <Facebook size={20} />
              </a>
              <a
                href='#'
                className='text-gray-400 hover:text-white transition-colors'
              >
                <Twitter size={20} />
              </a> */}
            </div>
          </div>
          {/* Quick Links */}
          <div className='md:col-span-1'>
            <h3 className='text-lg font-semibold mb-4'>
              {t('common.footer.quickLinks')}{' '}
            </h3>
            <ul className='space-y-2'>
              <li>
                <Link
                  href='/about'
                  className='text-gray-400 hover:text-white transition-colors'
                >
                  {t('common.footer.aboutUs')}
                </Link>
              </li>
              <li>
                <Link
                  href='#packages'
                  className='text-gray-400 hover:text-white transition-colors'
                >
                  {t('common.footer.packages')}
                </Link>
              </li>
              <li>
                <Link
                  href='/custom-package'
                  className='text-gray-400 hover:text-white transition-colors'
                >
                  {t('common.footer.custom')}
                </Link>
              </li>
              <li>
                <Link
                  href='contact'
                  className='text-gray-400 hover:text-white transition-colors'
                >
                  {t('common.footer.contact')}
                </Link>
              </li>
            </ul>
          </div>
          {/* Contact Info */}
          <div className='md:col-span-1'>
            <h3 className='text-lg font-semibold mb-4'>
              {' '}
              {t('common.footer.contact')}
            </h3>
            <ul className='space-y-3'>
              <li className='flex items-start'>
                <MapPin className='h-5 w-5 mr-3 mt-0.5 text-gray-400' />
                <span className='text-gray-400'>
                  VISTACANA, Punta Cana 23000, Dominican Republic
                </span>
              </li>
              <li className='flex items-center'>
                <Phone className='h-5 w-5 mr-3 text-gray-400' />
                <span className='text-gray-400'>+1 302-724-8080</span>
              </li>
              <li className='flex items-center'>
                <Mail className='h-5 w-5 mr-3 text-gray-400' />
                <span className='text-gray-400'>info@luxpuntacana.com</span>
              </li>
            </ul>
          </div>
        </div>

        <hr className='border-gray-800 my-8' />

        <div className='flex flex-col md:flex-row justify-between items-center'>
          <p className='text-gray-500 text-sm mb-4 md:mb-0'>
            &copy; {new Date().getFullYear()} Lux Punta Cana. All rights
            reserved.
          </p>
          <div className='flex space-x-6'>
            <Link
              href='/privacy-policy'
              className='text-gray-500 hover:text-white text-sm transition-colors'
            >
              Privacy Policy
            </Link>
            {/* <Link
              href='/terms-of-services'
              className='text-gray-500 hover:text-white text-sm transition-colors'
            >
              Terms of Service
            </Link> */}
            <Link
              href='/cookie-policy'
              className='text-gray-500 hover:text-white text-sm transition-colors'
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
