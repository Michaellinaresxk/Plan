import type { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Standard Package - Luxury Services in Punta Cana',
  description:
    'Discover our standard luxury services in Punta Cana. Enjoy private chefs, yoga sessions, massage therapy, and exclusive excursions. Premium experiences tailored for your vacation.',
  keywords: [
    'Punta Cana standard services',
    'luxury vacation packages',
    'private chef Punta Cana',
    'yoga sessions Punta Cana',
    'massage therapy Dominican Republic',
    'affordable luxury services',
    'resort activities Punta Cana',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://luxpuntacana.com/standard-package',
    siteName: 'Lux Punta Cana',
    title: 'Standard Package - Luxury Services & Experiences | Lux Punta Cana',
    description:
      'Discover our standard luxury services in Punta Cana. Private chefs, yoga, massages, and exclusive excursions. Premium experiences at great value.',
    images: [
      {
        url: 'https://luxpuntacana.com/img/bike.jpg',
        width: 1200,
        height: 630,
        alt: 'Lux Punta Cana Standard Package - Luxury Services',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Standard Package - Luxury Services in Punta Cana',
    description:
      'Discover our standard luxury services: private chefs, yoga, massages, and exclusive excursions in Punta Cana.',
    images: ['https://luxpuntacana.com/img/bike.jpg'],
  },
  alternates: {
    canonical: 'https://luxpuntacana.com/standard-package',
  },
};

const standardPackageStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Standard Luxury Package - Lux Punta Cana',
  description:
    'Premium luxury services package including private chef, yoga sessions, massage therapy, and exclusive excursions in Punta Cana, Dominican Republic.',
  brand: {
    '@type': 'Brand',
    name: 'Lux Punta Cana',
  },
  image: 'https://luxpuntacana.com/img/bike.jpg',
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'USD',
    lowPrice: '50',
    highPrice: '500',
    availability: 'https://schema.org/InStock',
    url: 'https://luxpuntacana.com/standard-package',
  },
  provider: {
    '@type': 'Organization',
    name: 'Lux Punta Cana',
    url: 'https://luxpuntacana.com',
    logo: 'https://res.cloudinary.com/ddg92xar5/image/upload/v1758745477/logo-borde-removebg-preview_za36cg.png',
  },
  areaServed: {
    '@type': 'Place',
    name: 'Punta Cana, Dominican Republic',
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '18.5601',
      longitude: '-68.3725',
    },
  },
  serviceType: 'Luxury Concierge Services',
  category: 'Standard Package',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    bestRating: '5',
    worstRating: '1',
    ratingCount: '127',
  },
};

export default function StandardPackageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script
        id='standard-package-structured-data'
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(standardPackageStructuredData),
        }}
        strategy='beforeInteractive'
      />
      {children}
    </>
  );
}
