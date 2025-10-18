import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';
import { BookingProvider } from '@/context/BookingContext';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

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
    default: 'Lux Punta Cana',
    template: '%s | Lux Punta Cana',
  },
  description:
    'Experience luxury vacations in Punta Cana, Dominican Republic. Premium concierge services, private chefs, exclusive excursions, and personalized experiences for resort guests. 24/7 local expert team.',
  keywords: [
    'Punta Cana luxury services',
    'Dominican Republic concierge',
    'exclusive vacation services', // ✅ CONSISTENTE
    'private chef Punta Cana',
    'exclusive excursions', // ✅ CONSISTENTE
    'luxury resort services',
    'personalized vacation experiences',
    'Punta Cana resort concierge',
    'luxury travel Dominican Republic',
    'premium villa services',
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
    title: 'Lux Punta Cana - Exclusive Luxury Services & Concierge', // ✅ CONSISTENTE
    description:
      'Experience luxury vacations in Punta Cana with our exclusive concierge services, private chefs, and premium excursions. Personalized experiences for resort guests.', // ✅ CONSISTENTE
    images: [
      {
        // ⚠️ USAR IMAGEN QUE SEPAS QUE EXISTE
        url: 'https://res.cloudinary.com/ddg92xar5/image/upload/v1758745477/logo-borde-removebg-preview_za36cg.png',
        width: 1200,
        height: 630,
        alt: 'Lux Punta Cana - Luxury Beach Resort Services',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lux Punta Cana - Exclusive Luxury Services', // ✅ CONSISTENTE
    description:
      'Experience luxury vacations in Punta Cana with exclusive concierge services and personalized experiences.',
    images: [
      'https://res.cloudinary.com/ddg92xar5/image/upload/v1758745477/logo-borde-removebg-preview_za36cg.png',
    ],
  },
  verification: {
    google: 'oPvzSrKPE_LawXAm0InFeyYxibPpOalvIGo1ICIB4zg', // ✅ YA TIENES ESTO
  },
  alternates: {
    canonical: 'https://luxpuntacana.com',
  },
  category: 'travel',
};

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://luxpuntacana.com/#organization',
      name: 'Lux Punta Cana',
      alternateName: 'LuxPuntaCana',
      url: 'https://luxpuntacana.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://res.cloudinary.com/ddg92xar5/image/upload/v1758745477/logo-borde-removebg-preview_za36cg.png',
        width: 300,
        height: 100,
      },
      image: {
        '@type': 'ImageObject',
        url: 'https://res.cloudinary.com/ddg92xar5/image/upload/v1758745477/logo-borde-removebg-preview_za36cg.png',
        width: 1200,
        height: 630,
      },
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
        telephone: '+1-302-724-8080',
        contactType: 'customer service',
        availableLanguage: ['English', 'Spanish'],
        areaServed: 'Dominican Republic',
      },
      sameAs: ['https://www.instagram.com/lxpuntacana/'],
      foundingDate: '2024',
      knowsAbout: [
        'Luxury Travel',
        'Concierge Services',
        'Private Chef Services',
        'Dominican Republic Tourism',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://luxpuntacana.com/#website',
      url: 'https://luxpuntacana.com',
      name: 'Lux Punta Cana - Premium Exclusive Services',
      description:
        'Experience luxury vacations in Punta Cana with exclusive concierge services, private chefs, and premium excursions.',
      publisher: {
        '@id': 'https://luxpuntacana.com/#organization',
      },
      inLanguage: 'en-US',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://luxpuntacana.com/?s={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'Service',
      '@id': 'https://luxpuntacana.com/#service',
      name: 'Premium Concierge Services',
      description:
        'Exclusive concierge services including private chefs, luxury excursions, and personalized experiences for resort guests in Punta Cana.',
      provider: {
        '@id': 'https://luxpuntacana.com/#organization',
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
      serviceType: 'Luxury Travel Services',
      category: 'Concierge Services',
      offers: {
        '@type': 'Offer',
        availability: 'https://schema.org/InStock',
        priceCurrency: 'USD',
      },
    },
  ],
};

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <head>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta
          name='google-site-verification'
          content='oPvzSrKPE_LawXAm0InFeyYxibPpOalvIGo1ICIB4zg'
        />
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

        <script
          async
          src='https://www.googletagmanager.com/gtag/js?id=G-0HDR1ZMVET'
        ></script>
        <script>
          window.dataLayer = window.dataLayer || []; function gtag()
          {window.dataLayer.push(arguments)}
          gtag('js', new Date()); gtag('config', 'G-0HDR1ZMVET');
        </script>

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
          <BookingProvider>
            {children}
            <Analytics />
            <SpeedInsights />
          </BookingProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
