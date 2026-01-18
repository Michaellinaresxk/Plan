import type { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Premium Package - Exclusive VIP Services in Punta Cana',
  description:
    'Experience our premium VIP services in Punta Cana. Exclusive private chefs, luxury wellness treatments, VIP transportation, Saona Island tours, and personalized concierge services. Ultimate luxury experiences.',
  keywords: [
    'Punta Cana premium services',
    'VIP luxury vacation packages',
    'exclusive concierge Punta Cana',
    'luxury wellness retreat',
    'private helicopter tours Punta Cana',
    'Saona Island VIP tour',
    'premium yacht charter',
    'luxury transportation Dominican Republic',
    'five-star vacation services',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://luxpuntacana.com/premium-package',
    siteName: 'Lux Punta Cana',
    title: 'Premium Package - Exclusive VIP Services | Lux Punta Cana',
    description:
      'Experience ultimate luxury with our premium VIP services in Punta Cana. Exclusive private chefs, luxury wellness, VIP transportation, and personalized experiences.',
    images: [
      {
        url: 'https://luxpuntacana.com/img/saona-island/saona-3.jpg',
        width: 1200,
        height: 630,
        alt: 'Lux Punta Cana Premium Package - Exclusive VIP Services',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Premium Package - Exclusive VIP Services in Punta Cana',
    description:
      'Experience ultimate luxury with our premium VIP services: exclusive chefs, wellness treatments, VIP transportation, and personalized experiences.',
    images: ['https://luxpuntacana.com/img/saona-island/saona-3.jpg'],
  },
  alternates: {
    canonical: 'https://luxpuntacana.com/premium-package',
  },
};

const premiumPackageStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Premium VIP Package - Lux Punta Cana',
  description:
    'Exclusive VIP luxury services package including private chef, luxury wellness treatments, VIP transportation, private yacht charters, Saona Island tours, and personalized concierge services in Punta Cana, Dominican Republic.',
  brand: {
    '@type': 'Brand',
    name: 'Lux Punta Cana',
  },
  image: 'https://luxpuntacana.com/img/saona-island/saona-3.jpg',
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'USD',
    lowPrice: '200',
    highPrice: '2500',
    availability: 'https://schema.org/InStock',
    url: 'https://luxpuntacana.com/premium-package',
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
  serviceType: 'Premium VIP Concierge Services',
  category: 'Premium Package',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5',
    bestRating: '5',
    worstRating: '1',
    ratingCount: '89',
  },
  additionalProperty: [
    {
      '@type': 'PropertyValue',
      name: 'Service Level',
      value: 'VIP Premium',
    },
    {
      '@type': 'PropertyValue',
      name: 'Availability',
      value: '24/7 Concierge',
    },
  ],
};

export default function PremiumPackageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script
        id='premium-package-structured-data'
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(premiumPackageStructuredData),
        }}
        strategy='beforeInteractive'
      />
      {children}
    </>
  );
}
