import type { Metadata } from 'next';
import './globals.css';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: siteConfig.siteName,
  description: siteConfig.tagline,
  keywords: ['3D prints', 'Baarn', '3D printing', 'custom prints', 'jonge ondernemer'],
  authors: [{ name: 'Jelte van Veen' }],
  openGraph: {
    title: siteConfig.siteName,
    description: siteConfig.tagline,
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/svg+xml" href="/logo.svg" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
