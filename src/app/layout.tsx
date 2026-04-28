import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
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

import { AuthProvider } from '@/context/AuthContext';
import SkipLink from '@/components/SkipLink';
import { validateEnv } from '@/lib/env';
import { ErrorBoundary } from '@/components/ErrorBoundary';

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
