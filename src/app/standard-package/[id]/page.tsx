import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Script from 'next/script';
import ServiceManager from '@/constants/services/ServiceManager';
import ServiceDetailsWrapper from '@/UI/components/service/ServiceDetailsWrapper';

interface ServicePageParams {
  params: Promise<{
    id: string;
  }>;
}

/**
 * Generate metadata for service detail pages
 */
export async function generateMetadata({
  params,
}: ServicePageParams): Promise<Metadata> {
  const { id } = await params;
  const serviceData = ServiceManager.getData(id);

  if (!serviceData) {
    return {
      title: 'Service Not Found | Lux Punta Cana',
      description: 'The requested service could not be found.',
    };
  }

  const serviceName =
    typeof serviceData.titleKey === 'string'
      ? serviceData.titleKey.split('.').pop()?.replace(/([A-Z])/g, ' $1').trim() || 'Service'
      : 'Service';

  const description = `Book ${serviceName} in Punta Cana. Starting from $${serviceData.basePrice} USD. Premium luxury service with professional staff and exceptional quality.`;

  return {
    title: `${serviceName} - Standard Package | Lux Punta Cana`,
    description,
    keywords: [
      `${serviceName} Punta Cana`,
      'luxury services Dominican Republic',
      'resort services',
      'vacation activities',
      `book ${serviceName}`,
    ],
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: `https://luxpuntacana.com/standard-package/${id}`,
      siteName: 'Lux Punta Cana',
      title: `${serviceName} - Luxury Service in Punta Cana`,
      description,
      images: [
        {
          url: serviceData.imageUrl || 'https://luxpuntacana.com/img/bike.jpg',
          width: 1200,
          height: 630,
          alt: `${serviceName} - Lux Punta Cana`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${serviceName} - Luxury Service in Punta Cana`,
      description,
      images: [serviceData.imageUrl || 'https://luxpuntacana.com/img/bike.jpg'],
    },
    alternates: {
      canonical: `https://luxpuntacana.com/standard-package/${id}`,
    },
  };
}

/**
 * Service Details Page
 *
 * This component renders the details page for a specific service.
 * It uses the ServiceManager to fetch the service data and the
 * ServiceDetailsEnhanced component to render the service details.
 */
export default async function SelectedServicePage({
  params,
}: ServicePageParams) {
  const { id } = await params;

  // Get the service data using ServiceManager
  const serviceData = ServiceManager.getData(id);

  // Si no se encuentra el servicio, mostrar mensaje de depuración en vez de 404
  if (!serviceData) {
    console.error('Service not found:', id);
    return notFound();
  }

  const service = ServiceManager.get(id);

  // Generate structured data for the service
  const serviceName =
    typeof serviceData.titleKey === 'string'
      ? serviceData.titleKey.split('.').pop()?.replace(/([A-Z])/g, ' $1').trim() || 'Service'
      : 'Service';

  const serviceStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: serviceName,
    description: `${serviceName} service in Punta Cana, Dominican Republic`,
    image: serviceData.imageUrl || 'https://luxpuntacana.com/img/bike.jpg',
    brand: {
      '@type': 'Brand',
      name: 'Lux Punta Cana',
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      price: serviceData.basePrice,
      availability: 'https://schema.org/InStock',
      url: `https://luxpuntacana.com/standard-package/${id}`,
    },
    provider: {
      '@type': 'Organization',
      name: 'Lux Punta Cana',
      url: 'https://luxpuntacana.com',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      bestRating: '5',
      ratingCount: '45',
    },
  };

  const breadcrumbStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://luxpuntacana.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Standard Package',
        item: 'https://luxpuntacana.com/standard-package',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: serviceName,
        item: `https://luxpuntacana.com/standard-package/${id}`,
      },
    ],
  };

  return (
    <>
      <Script
        id={`service-${id}-structured-data`}
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceStructuredData),
        }}
        strategy='beforeInteractive'
      />
      <Script
        id={`service-${id}-breadcrumb`}
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
        strategy='beforeInteractive'
      />
      <ServiceDetailsWrapper service={service} serviceData={serviceData} />
    </>
  );
}
