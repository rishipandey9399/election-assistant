import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import Footer from '@/components/Footer';
import Navigation from '@/components/Navigation';
import SkipLink from '@/components/SkipLink';
import { AuthProvider } from '@/context/AuthContext';
import { validateEnv } from '@/lib/env';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'VoteAssist - Your Election Companion',
  description:
    'Understand the election process, timelines, and steps in an interactive and easy-to-follow way.',
};

// Fail-fast environment validation
validateEnv();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'VoteAssist',
              operatingSystem: 'Web',
              applicationCategory: 'GovernmentService',
              description:
                'AI-powered election assistant providing voting timelines and polling locations.',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
            }),
          }}
        />
        <ErrorBoundary>
          <AuthProvider>
            <SkipLink />
            <Navigation />
            <main id="main-content" tabIndex={-1}>
              {children}
            </main>
            <Footer />
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
