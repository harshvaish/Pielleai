import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: '--plus-jakarta-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Milano Ovest',
  description: 'Pannello di controllo e gestione',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='it'>
      <body
        className={`h-dvh flex flex-col ${plusJakartaSans.variable} antialiased bg-zinc-100`}
      >
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
