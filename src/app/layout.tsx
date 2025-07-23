import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';
import { BookingProvider } from '@/context/BookingContext';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Lux Punta Cana - Premium Luxury Services & Concierge',
    template: '%s | Lux Punta Cana',
  },
  description:
    'Experience luxury vacations in Punta Cana, Dominican Republic. Premium concierge services, private chefs, exclusive excursions, and personalized experiences for resort guests. 24/7 local expert team.',
  keywords: [
    'Punta Cana luxury services',
    'Dominican Republic concierge',
    'premium vacation services',
    'private chef Punta Cana',
    'exclusive excursions',
    'luxury resort services',
    'personalized vacation experiences',
    'Punta Cana resort concierge',
  ],
  authors: [{ name: 'Lux Punta Cana' }],
  creator: 'Lux Punta Cana',
  publisher: 'Lux Punta Cana',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://luxpuntacana.com',
    siteName: 'Lux Punta Cana',
    title: 'Lux Punta Cana - Premium Luxury Services & Concierge',
    description:
      'Experience luxury vacations in Punta Cana with our premium concierge services, private chefs, and exclusive excursions. Personalized experiences for resort guests.',
    images: [
      {
        url: 'https://luxpuntacana.com/images/punta-cana-luxury-hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Lux Punta Cana - Luxury Beach Resort Services',
      },
      {
        url: 'https://luxpuntacana.com/images/punta-cana-concierge.jpg',
        width: 800,
        height: 600,
        alt: 'Premium Concierge Services Punta Cana',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lux Punta Cana - Premium Luxury Services',
    description:
      'Experience luxury vacations in Punta Cana with premium concierge services and personalized experiences.',
    images: ['https://luxpuntacana.com/images/punta-cana-luxury-hero.jpg'],
  },
  verification: {
    // google: 'your-google-verification-code',
  },
  alternates: {
    canonical: 'https://luxpuntacana.com',
  },
  category: 'travel',
};

// Structured Data para aparecer en resultados de búsqueda con thumbnail
const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://luxpuntacana.com/#organization',
      name: 'Lux Punta Cana',
      url: 'https://luxpuntacana.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://luxpuntacana.com/images/logo-punta-cana-plan.png',
        width: 300,
        height: 100,
      },
      image: [
        {
          '@type': 'ImageObject',
          url: 'https://luxpuntacana.com/images/punta-cana-luxury-hero.jpg',
          width: 1200,
          height: 630,
        },
      ],
      description:
        'Premium luxury concierge services in Punta Cana, Dominican Republic. Private chefs, exclusive excursions, and personalized vacation experiences.',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Punta Cana',
        addressRegion: 'La Altagracia',
        addressCountry: 'DO',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+1-809-XXX-XXXX',
        contactType: 'customer service',
        availableLanguage: ['English', 'Spanish'],
      },
      sameAs: [
        'https://instagram.com/luxpuntacana',
        'https://facebook.com/luxpuntacana',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://luxpuntacana.com/#website',
      url: 'https://luxpuntacana.com',
      name: 'Lux Punta Cana - Premium Luxury Services',
      description:
        'Experience luxury vacations in Punta Cana with premium concierge services, private chefs, and exclusive excursions.',
      publisher: {
        '@id': 'https://luxpuntacana.com/#organization',
      },
      image: {
        '@type': 'ImageObject',
        url: 'https://luxpuntacana.com/images/punta-cana-luxury-hero.jpg',
        width: 1200,
        height: 630,
      },
    },
    {
      '@type': 'Service',
      name: 'Premium Concierge Services',
      description:
        'Exclusive concierge services including private chefs, luxury excursions, and personalized experiences for resort guests in Punta Cana.',
      provider: {
        '@id': 'https:/puntacana.com/#organization',
      },
      areaServed: {
        '@type': 'Place',
        name: 'Punta Cana, Dominican Republic',
      },
      image: [
        'https:/puntacana.com/images/private-chef-service.jpg',
        'https:/puntacana.com/images/luxury-excursions.jpg',
        'https:/puntacana.com/images/premium-villa.jpg',
      ],
      serviceType: 'Luxury Travel Services',
      offers: {
        '@type': 'Offer',
        availability: 'https://schema.org/InStock',
        priceCurrency: 'USD',
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <head>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
        <link
          rel='apple-touch-icon'
          sizes='180x180'
          href='/apple-touch-icon.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='32x32'
          href='/favicon-32x32.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='16x16'
          href='/favicon-16x16.png'
        />
        <link rel='manifest' href='/site.webmanifest' />

        {/* Structured Data para thumbnails en búsqueda */}
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />

        {/* Meta adicionales para thumbnails */}
        <meta
          name='thumbnail'
          content='https://luxpuntacana.com/images/punta-cana-luxury-hero.jpg'
        />
        <meta
          property='og:image:secure_url'
          content='https://luxpuntacana.com/images/punta-cana-luxury-hero.jpg'
        />
        <meta property='og:image:type' content='image/jpeg' />
        <meta
          name='image'
          content='https://luxpuntacana.com/images/punta-cana-luxury-hero.jpg'
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider>
          <BookingProvider>{children}</BookingProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
