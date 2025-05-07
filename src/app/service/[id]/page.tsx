'use client';

import React from 'react';
import { notFound } from 'next/navigation';
import { BookingProvider } from '@/context/BookingContext';
import Navbar from '@/UI/components/shared/Navbar';
import Footer from '@/UI/components/shared/Footer';
import ServiceDetails from '@/UI/components/services/ServiceDetails';
import RelatedServices from '@/UI/components/services/RelatedServices';
import { getRelatedServices, getServiceById } from '@/utils/servicesUtils';

// Interfaz para los parámetros de la página
interface ServicePageParams {
  params: {
    id: string;
  };
}

export default function ServicePage({ params }: ServicePageParams) {
  const { id } = params;

  // Obtener los datos del servicio usando el ID
  const serviceData = getServiceById(id);

  // Si no se encuentra el servicio, mostrar página 404
  if (!serviceData) {
    return notFound();
  }

  // Convertir a formato legacy para compatibilidad con componentes existentes
  const legacyService = {
    id: serviceData.id,
    name: serviceData.id,
    img: serviceData.imageUrl,
    description: serviceData.descriptionKey,
    packageType: serviceData.packageType,
    price: serviceData.basePrice,
    duration: serviceData.duration || 0,
    available: true,
  };

  // Obtener servicios relacionados
  const relatedServicesData = getRelatedServices(id, 3);

  // Convertir servicios relacionados a formato legacy
  const relatedLegacyServices = relatedServicesData.map((service) => ({
    id: service.id,
    name: service.id,
    img: service.imageUrl,
    description: service.descriptionKey,
    packageType: service.packageType,
    price: service.basePrice,
    duration: service.duration || 0,
    available: true,
  }));

  return (
    <BookingProvider>
      <div className='min-h-screen flex flex-col'>
        <Navbar />

        <div className='flex-grow'>
          {/* Componente principal de detalles del servicio */}
          <ServiceDetails service={legacyService} serviceData={serviceData} />

          {/* Sección de servicios relacionados */}
          {relatedLegacyServices.length > 0 && (
            <div className='bg-gray-50 py-12'>
              <div className='container mx-auto px-6'>
                <RelatedServices
                  services={relatedLegacyServices}
                  currentServiceId={id}
                />
              </div>
            </div>
          )}
        </div>

        <Footer />
      </div>
    </BookingProvider>
  );
}
