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
 * Generate metadata for premium service detail pages
 */
export async function generateMetadata({
  params,
}: ServicePageParams): Promise<Metadata> {
  const { id } = await params;
  const serviceData = ServiceManager.getData(id);

  if (!serviceData) {
    return {
      title: 'Service Not Found | Lux Punta Cana',
      description: 'The requested premium service could not be found.',
    };
  }

  const serviceName =
    typeof serviceData.titleKey === 'string'
      ? serviceData.titleKey.split('.').pop()?.replace(/([A-Z])/g, ' $1').trim() || 'Service'
      : 'Service';

  const description = `Exclusive ${serviceName} VIP service in Punta Cana. Starting from $${serviceData.basePrice} USD. Premium luxury experience with top-tier professionals and exceptional quality.`;

  return {
    title: `${serviceName} VIP - Premium Package | Lux Punta Cana`,
    description,
    keywords: [
      `${serviceName} VIP Punta Cana`,
      'exclusive luxury services Dominican Republic',
      'premium resort services',
      'VIP vacation activities',
      `book premium ${serviceName}`,
      'five-star experiences',
    ],
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: `https://luxpuntacana.com/premium-package/${id}`,
      siteName: 'Lux Punta Cana',
      title: `${serviceName} VIP - Exclusive Luxury Service in Punta Cana`,
      description,
      images: [
        {
          url: serviceData.imageUrl || 'https://luxpuntacana.com/img/saona-island/saona-3.jpg',
          width: 1200,
          height: 630,
          alt: `${serviceName} VIP - Lux Punta Cana Premium Package`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${serviceName} VIP - Exclusive Luxury Service`,
      description,
      images: [serviceData.imageUrl || 'https://luxpuntacana.com/img/saona-island/saona-3.jpg'],
    },
    alternates: {
      canonical: `https://luxpuntacana.com/premium-package/${id}`,
    },
  };
}

/**
 * Premium Service Details Page
 *
 * This component renders the details page for a specific premium service.
 * It uses the ServiceManager to fetch the service data and the
 * ServiceDetailsEnhanced component to render the service details.
 */
export default async function SelectedServicePage({
  params,
}: ServicePageParams) {
  const { id } = await params;

  // Get the service data using ServiceManager
  const serviceData = ServiceManager.getData(id);

  // Si no se encuentra el servicio, mostrar 404
  if (!serviceData) {
    console.error('Premium service not found:', id);
    return notFound();
  }

  const service = ServiceManager.get(id);

  // Generate structured data for the premium service
  const serviceName =
    typeof serviceData.titleKey === 'string'
      ? serviceData.titleKey.split('.').pop()?.replace(/([A-Z])/g, ' $1').trim() || 'Service'
      : 'Service';

  const serviceStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${serviceName} VIP`,
    description: `Exclusive VIP ${serviceName} service in Punta Cana, Dominican Republic`,
    image: serviceData.imageUrl || 'https://luxpuntacana.com/img/saona-island/saona-3.jpg',
    brand: {
      '@type': 'Brand',
      name: 'Lux Punta Cana',
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      price: serviceData.basePrice,
      availability: 'https://schema.org/InStock',
      url: `https://luxpuntacana.com/premium-package/${id}`,
      priceValidUntil: '2026-12-31',
    },
    provider: {
      '@type': 'Organization',
      name: 'Lux Punta Cana',
      url: 'https://luxpuntacana.com',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5',
      bestRating: '5',
      ratingCount: '67',
    },
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Service Level',
        value: 'VIP Premium',
      },
      {
        '@type': 'PropertyValue',
        name: 'Category',
        value: serviceData.category,
      },
    ],
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
        name: 'Premium Package',
        item: 'https://luxpuntacana.com/premium-package',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: `${serviceName} VIP`,
        item: `https://luxpuntacana.com/premium-package/${id}`,
      },
    ],
  };

  return (
    <>
      <Script
        id={`premium-service-${id}-structured-data`}
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceStructuredData),
        }}
        strategy='beforeInteractive'
      />
      <Script
        id={`premium-service-${id}-breadcrumb`}
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
