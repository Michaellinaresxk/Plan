/**
 * ARCHIVO 1: app/standard-package/[id]/metadata.ts (NUEVO - Server Component)
 *
 * Este archivo SOLO genera metadata
 * NO tiene 'use client'
 */

import { Metadata } from 'next';
import ServiceManager from '@/constants/services/ServiceManager';

interface ServicePageParams {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params,
}: ServicePageParams): Promise<Metadata> {
  const { id } = params;

  try {
    const serviceData = ServiceManager.getData(id);
    const service = ServiceManager.get(id);

    if (!serviceData || !service) {
      return {
        title: 'Service Not Found | Lux Punta Cana',
      };
    }

    // 🔑 Buscar SERVICE_METADATA en el objeto service
    const metadata = (service as any)?.SERVICE_METADATA;

    if (!metadata) {
      return {
        title: `${service.title} | Lux Punta Cana`,
        description: service.description || 'Premium service in Punta Cana',
      };
    }

    const baseUrl = 'https://luxpuntacana.com';
    const imageUrl = `${baseUrl}${metadata.image}`;
    const packageType = serviceData?.packageType || 'standard';

    return {
      title: metadata.title,
      description: metadata.description,
      keywords: metadata.keywords || [],
      openGraph: {
        title: metadata.title,
        description: metadata.description,
        type: 'website',
        url: `${baseUrl}/${packageType}-package/${id}`,
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: metadata.imageAlt,
            type: 'image/jpeg',
          },
        ],
        siteName: 'Lux Punta Cana',
        locale: 'en_US',
      },
      twitter: {
        card: 'summary_large_image',
        title: metadata.title,
        description: metadata.description,
        images: [imageUrl],
        creator: '@lxpuntacana',
      },
      alternates: {
        canonical: `${baseUrl}/${packageType}-package/${id}`,
      },
    };
  } catch (error) {
    console.error(`Error generating metadata for ${params.id}:`, error);
    return {
      title: 'Service | Lux Punta Cana',
    };
  }
}
