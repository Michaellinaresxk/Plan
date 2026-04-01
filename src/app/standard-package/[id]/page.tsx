import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Script from 'next/script';
import ServiceManager from '@/constants/services/ServiceManager';
import { getServiceMetadata } from '@/constants/services/Servicemetadata';
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
  const meta = getServiceMetadata(id);

  if (!serviceData && !meta) {
    return {
      title: 'Service Not Found | Lux Punta Cana',
      description: 'The requested service could not be found.',
    };
  }

  const baseUrl = 'https://luxpuntacana.com';
  const pageUrl = `${baseUrl}/standard-package/${id}`;

  // Use SERVICE_METADATA when available — richer, human-crafted titles & images
  if (meta) {
    return {
      title: meta.title,
      description: meta.description,
      keywords: meta.keywords,
      openGraph: {
        type: 'website',
        locale: 'en_US',
        url: pageUrl,
        siteName: 'Lux Punta Cana',
        title: meta.title,
        description: meta.description,
        images: [
          {
            url: meta.image,
            width: 1200,
            height: 630,
            alt: meta.imageAlt,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: meta.title,
        description: meta.description,
        images: [meta.image],
        creator: '@lxpuntacana',
      },
      alternates: {
        canonical: pageUrl,
      },
    };
  }

  // Fallback for services not yet in SERVICE_METADATA
  const title = `${id.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())} | Lux Punta Cana`;
  const description = serviceData
    ? `Book ${id.replace(/-/g, ' ')} in Punta Cana. Starting from $${serviceData.basePrice} USD. Premium luxury service with professional staff and exceptional quality.`
    : 'Premium luxury service in Punta Cana, Dominican Republic.';
  const image = serviceData?.imageUrl || `${baseUrl}/img/beach.jpg`;

  return {
    title,
    description,
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: pageUrl,
      siteName: 'Lux Punta Cana',
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    alternates: {
      canonical: pageUrl,
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
