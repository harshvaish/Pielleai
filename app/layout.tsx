import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: '--plus-jakarta-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Eagle Booking',
  description:
    'Eagle Booking è la piattaforma per gestire e prenotare eventi tra artisti e locali: ricerca e matching, richieste di ingaggio, contratti e pagamenti, calendario disponibilità, report e recensioni. Pensata per manager, promoter e venue.',
  keywords:
    'booking eventi, gestione artisti, gestione locali, venue manager, artist manager, promoter, contratti di ingaggio, cachet, pagamenti, fatture, calendario disponibilità, tour, offerte spettacoli, marketplace musica live, gestione eventi, preventivi, rider tecnico, hospitality, reportistica, recensioni',
  openGraph: {
    url: process.env.NEXT_PUBLIC_BASE_URL,
    images: [
      {
        url: 'https://mzmigzmqxpmypbmvklfh.supabase.co/storage/v1/object/public/milano-ovest-admin/general/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Eagle Booking — piattaforma di booking per artisti e locali, con dashboard, calendario e strumenti per contratti e pagamenti.',
      },
    ],
    siteName: 'Eagle Booking',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_BASE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='it' suppressHydrationWarning>
      <head>
        <meta
          name='apple-mobile-web-app-title'
          content='Eagle'
        />
      </head>
      <body className={`group h-dvh flex flex-col ${plusJakartaSans.variable} antialiased bg-zinc-100`}>
        {children}
        <Toaster
          position='top-center'
          expand={true} // column visualization if true, stack if false
          richColors={true}
        />
      </body>
    </html>
  );
}
