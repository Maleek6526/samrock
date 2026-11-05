import type { Metadata, Viewport } from 'next';
import { Inter, Instrument_Serif } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import SamrockAssistant from '@/components/SamrockAssistant';
import { contactInfo, defaultSiteSettings, socialLinks } from '@/lib/site';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

// Display face for headlines. The italic is used for the accented word, which
// is why it is loaded even though the site never asks for italic body copy.
const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://samrock-music-production.vercel.app';

const siteTitle = 'Samrock Music Productions | Afrobeats Production, Mixing & Mastering';

const siteDescription =
  'Beat making, recording, mixing and mastering by Samrock Music Productions. Afrobeats, Reggae, Woro and Trap records built for the global music scene.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: '%s | Samrock Music Productions',
  },
  description: siteDescription,
  applicationName: defaultSiteSettings.producerName,
  authors: [{ name: defaultSiteSettings.producerName }],
  creator: defaultSiteSettings.producerName,
  keywords: [
    'Afrobeats producer',
    'beat store',
    'mixing and mastering',
    'Nigerian recording studio',
    'Woro beats',
    'Samrock Music Productions',
  ],
  alternates: { canonical: '/' },
  icons: {
    icon: '/logo.jpg',
    shortcut: '/logo.jpg',
    apple: '/logo.jpg',
  },
  openGraph: {
    type: 'website',
    url: siteUrl,
    siteName: defaultSiteSettings.producerName,
    title: siteTitle,
    description: siteDescription,
    locale: 'en_NG',
    images: [
      {
        url: '/flyer.jpg',
        alt: 'Samrock Music Productions studio flyer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
    images: ['/flyer.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: '#0a0a0b',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'MusicGroup',
  name: defaultSiteSettings.producerName,
  url: siteUrl,
  image: `${siteUrl}/logo.jpg`,
  description: siteDescription,
  email: contactInfo.email,
  telephone: `+${contactInfo.whatsapp}`,
  genre: ['Afrobeats', 'Reggae', 'Woro', 'Trap', 'Highlife'],
  sameAs: socialLinks.map((social) => social.href),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth" suppressHydrationWarning>
      <head>
        {/* Applies the saved theme before paint to avoid a flash of the wrong colours. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem('theme')==='light'){document.documentElement.classList.remove('dark')}}catch(e){}`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${instrumentSerif.variable} font-sans antialiased`}
      >
        {children}
        <SamrockAssistant />
        <Toaster position="top-center" richColors theme="dark" closeButton />
      </body>
    </html>
  );
}
