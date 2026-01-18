import type { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Custom Package Builder - Design Your Perfect Vacation | Lux Punta Cana',
  description:
    'Create your perfect custom vacation package in Punta Cana. Choose from guided experiences or build your own itinerary. Mix and match luxury services including private chefs, wellness treatments, excursions, and VIP transportation. Personalized luxury at your fingertips.',
  keywords: [
    'custom vacation package Punta Cana',
    'personalized luxury experiences',
    'build your own vacation',
    'custom itinerary Punta Cana',
    'flexible vacation packages',
    'tailored luxury services',
    'vacation package builder',
    'customize Punta Cana experience',
    'bespoke vacation planning',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://luxpuntacana.com/custom-package',
    siteName: 'Lux Punta Cana',
    title: 'Custom Package Builder - Design Your Perfect Vacation | Lux Punta Cana',
    description:
      'Create your perfect custom vacation package. Choose from guided experiences or build your own itinerary with our luxury services in Punta Cana.',
    images: [
      {
        url: 'https://luxpuntacana.com/img/bike.jpg',
        width: 1200,
        height: 630,
        alt: 'Lux Punta Cana Custom Package Builder - Design Your Perfect Vacation',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Custom Package Builder - Design Your Perfect Vacation',
    description:
      'Create your perfect custom vacation package in Punta Cana. Mix and match luxury services to build your ideal experience.',
    images: ['https://luxpuntacana.com/img/bike.jpg'],
  },
  alternates: {
    canonical: 'https://luxpuntacana.com/custom-package',
  },
};

const customPackageStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Custom Vacation Package Builder',
  description:
    'Interactive vacation package builder allowing guests to create personalized luxury experiences in Punta Cana. Choose from guided recommendations or build your own custom itinerary.',
  applicationCategory: 'TravelApplication',
  operatingSystem: 'Web Browser',
  offers: {
    '@type': 'Offer',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
    url: 'https://luxpuntacana.com/custom-package',
  },
  provider: {
    '@type': 'Organization',
    name: 'Lux Punta Cana',
    url: 'https://luxpuntacana.com',
    logo: 'https://res.cloudinary.com/ddg92xar5/image/upload/v1758745477/logo-borde-removebg-preview_za36cg.png',
  },
  featureList: [
    'Guided Package Builder',
    'Custom Itinerary Creator',
    'Service Mix and Match',
    'Real-time Price Calculator',
    'Flexible Booking Options',
  ],
  screenshot: 'https://luxpuntacana.com/img/bike.jpg',
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
      name: 'Custom Package Builder',
      item: 'https://luxpuntacana.com/custom-package',
    },
  ],
};

export default function CustomPackageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script
        id='custom-package-structured-data'
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(customPackageStructuredData),
        }}
        strategy='beforeInteractive'
      />
      <Script
        id='custom-package-breadcrumb'
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
        strategy='beforeInteractive'
      />
      {children}
    </>
  );
}
