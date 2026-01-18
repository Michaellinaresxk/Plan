'use client';

import { BookingProvider } from '@/context/BookingContext';
import Navbar from '@/UI/components/shared/Navbar';
import CartSidebar from '@/UI/components/shared/CartSidebar';
import Footer from '@/UI/components/shared/Footer';
import ServiceDetails from '@/UI/components/service/ServiceDetails';
import type { Service } from '@/types/type';
import type { ServiceData } from '@/types/services';

interface ServiceDetailsWrapperProps {
  service: Service;
  serviceData: ServiceData;
}

export default function ServiceDetailsWrapper({
  service,
  serviceData,
}: ServiceDetailsWrapperProps) {
  return (
    <BookingProvider>
      <div className='min-h-screen flex flex-col'>
        <Navbar />

        <main className='flex-grow'>
          <ServiceDetails service={service} serviceData={serviceData} />
        </main>

        <CartSidebar />
        <Footer />
      </div>
    </BookingProvider>
  );
}
