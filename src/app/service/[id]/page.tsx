'use client';

import React, { use } from 'react';
import { notFound } from 'next/navigation';
import { BookingProvider } from '@/context/BookingContext';
import { useTranslation } from '@/lib/i18n/client';
import Navbar from '@/UI/components/shared/Navbar';
import CartSidebar from '@/UI/components/shared/CartSidebar';
import Footer from '@/UI/components/shared/Footer';
import ServiceManager from '@/constants/services/ServiceManager';
import ServiceDetails from '@/UI/components/service/ServiceDetails';

// Page parameters interface
interface ServicePageParams {
  params: {
    id: string;
  };
}

/**
 * Service Details Page
 *
 * This component renders the details page for a specific service.
 * It uses the ServiceManager to fetch the service data and the
 * ServiceDetailsEnhanced component to render the service details.
 */
export default function SelectedServicePage({ params }: ServicePageParams) {
  // Usar React.use() para desenvolver params si es una promesa

  const { id } = use(params);
  const { t } = useTranslation();

  // Get the service data using ServiceManager
  const serviceData = ServiceManager.getData(id);
  console.log('Available IDs:', Object.keys(ServiceManager.IDs));

  // Si no se encuentra el servicio, mostrar mensaje de depuración en vez de 404
  if (!serviceData) {
    console.error('Service not found:', id);
    return (
      <div className='min-h-screen flex items-center justify-center flex-col'>
        <h1 className='text-2xl font-bold mb-4'>Servicio no encontrado</h1>
        <p>ID solicitado: {id}</p>
        <p>Revisa que este ID exista en ServiceManager</p>
      </div>
    );
  }

  if (!serviceData) {
    return notFound();
  }

  const service = ServiceManager.get(id);

  return (
    <BookingProvider>
      <div className='min-h-screen flex flex-col'>
        <Navbar />

        <main className='flex-grow'>
          {/* Render the service details with the enhanced component */}
          <ServiceDetails service={service} serviceData={serviceData} />
        </main>

        <CartSidebar />
        <Footer />
      </div>
    </BookingProvider>
  );
}
