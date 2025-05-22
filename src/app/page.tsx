'use client';

import React from 'react';

import { BookingProvider } from '@/context/BookingContext';
import Navbar from '@/UI/components/shared/Navbar';
import Hero from '@/UI/components/layout/Hero';
import PackageSelector from '@/UI/components/layout/PackageSelector';
import CustomPackageCTA from '@/UI/components/layout/CustomPackageCTA';
import ConsiergeSupport from '@/UI/components/layout/ConsiergeSupport';
import Footer from '@/UI/components/shared/Footer';

const HomePage = () => {
  return (
    <BookingProvider>
      <div className='flex flex-col min-h-screen font-[family-name:var(--font-geist-sans)]'>
        <Navbar />
        <Hero />
        <PackageSelector />
        <CustomPackageCTA />
        <ConsiergeSupport />
        <Footer />
      </div>
    </BookingProvider>
  );
};

export default HomePage;
