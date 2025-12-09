/**
 * ARCHIVO: app/standard-package/layout.tsx
 *
 * Layout para rutas dinámicas: /standard-package/[id]
 * Lee SERVICE_METADATA de cada componente y genera meta tags
 */

import { Metadata } from 'next';
import { ReactNode } from 'react';
import { isValidServiceId } from '@/constants/serviceId';

/**
 * ⚠️ IMPORTANTE: Este mapeo DEBE COINCIDIR con tus IDs en ServiceManager
 * Los IDs deben ser EXACTAMENTE iguales a los que usas en tu app
 */
const SERVICE_COMPONENTS_PATHS: Record<string, string> = {
  // Standard services - VERIFICA QUE ESTOS IDs SEAN CORRECTOS
  'yoga-standard': '@/components/services/standard/YogaServiceView',
  'atv-excursions': '@/components/services/standard/AtvRideServiceView',
  'horseback-riding':
    '@/components/services/standard/HorseBackRidingServiceView',
  'horseback-sunset':
    '@/components/services/standard/HorsebackRidingSunsetView',
  babysitter: '@/components/services/standard/BabysitterServiceView',
  'catamaran-trips': '@/components/services/standard/CatamaranServiceView',
  'standard-massage': '@/components/services/standard/MassageServiceView',
  'golf-cart-rentals': '@/components/services/standard/GolfCartServiceView',
  'saona-island-tour':
    '@/components/services/standard/SaonaIslandTourServiceView',

  // Premium services
  'luxe-yacht': '@/components/services/premium/LuxeYachtServiceView',
  'private-catamaran': '@/components/services/premium/LuxCatamaranServiceView',
  // AGREGA MÁS SEGÚN NECESITES
};

interface ServiceLayoutProps {
  params: Promise<{ id: string }>;
}

/**
 * Generar metadata dinámicamente basado en el ID del servicio
 */
export async function generateMetadata(
  props: ServiceLayoutProps
): Promise<Metadata> {
  const params = await props.params;
  const serviceId = params.id;

  // Validar que sea un serviceId válido
  if (!isValidServiceId(serviceId as any)) {
    return {
      title: 'Service Not Found | Lux Punta Cana',
    };
  }

  const componentPath = SERVICE_COMPONENTS_PATHS[serviceId];
  if (!componentPath) {
    return {
      title: 'Service Not Found | Lux Punta Cana',
    };
  }

  try {
    // Importar dinámicamente el componente para obtener SERVICE_METADATA
    const module = await import(componentPath);
    const meta = module.SERVICE_METADATA;

    if (!meta) {
      console.warn(`No SERVICE_METADATA exported from ${componentPath}`);
      return {
        title: `Service | Lux Punta Cana`,
      };
    }

    const baseUrl = 'https://luxpuntacana.com';
    const imageUrl = `${baseUrl}${meta.image}`;

    return {
      title: meta.title,
      description: meta.description,
      keywords: meta.keywords || [],
      openGraph: {
        title: meta.title,
        description: meta.description,
        type: 'website',
        url: `${baseUrl}/standard-package/${serviceId}`,
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: meta.imageAlt,
            type: 'image/jpeg',
          },
        ],
        siteName: 'Lux Punta Cana',
        locale: 'en_US',
      },
      twitter: {
        card: 'summary_large_image',
        title: meta.title,
        description: meta.description,
        images: [imageUrl],
        creator: '@lxpuntacana',
      },
      alternates: {
        canonical: `${baseUrl}/standard-package/${serviceId}`,
      },
    };
  } catch (error) {
    console.error(`Error loading metadata for service ${serviceId}:`, error);
    return {
      title: 'Service | Lux Punta Cana',
    };
  }
}

/**
 * Layout que renderiza los children
 */
export default function ServiceLayout({ children }: { children: ReactNode }) {
  return children;
}
