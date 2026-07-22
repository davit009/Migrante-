// ============================================================
// app/layout.tsx
// Root Layout — fuentes via next/font + providers anidados
// ============================================================

import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { QueryProvider } from '@/providers/QueryProvider';
import { SupabaseProvider } from '@/providers/SupabaseProvider';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: {
    template: '%s | Migrante$',
    default: 'Migrante$ — Tu dinero, bajo control',
  },
  description:
    'Aplicación financiera para migrantes en Estados Unidos. Convierte USD a MXN, controla tus gastos, calcula impuestos por estado y administra tus ahorros.',
  keywords: [
    'finanzas para migrantes',
    'conversor dólar peso',
    'USD MXN',
    'ahorro migrante',
    'impuestos Estados Unidos',
    'calculadora compras USA',
  ],
  authors: [{ name: 'Migrante$' }],
  creator: 'Migrante$',
  openGraph: {
    title: 'Migrante$ — Tu dinero, bajo control',
    description: 'Finanzas inteligentes para migrantes en EE.UU.',
    type: 'website',
    locale: 'es_MX',
  },
  robots: {
    index: false,
    follow: false,
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f5f7ff' },
    { media: '(prefers-color-scheme: dark)',  color: '#252525' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="es" suppressHydrationWarning className={inter.variable}>
      <body className={inter.className}>
        <ThemeProvider>
          <QueryProvider>
            <SupabaseProvider>
              {children}
              <Toaster position="top-center" richColors closeButton />
            </SupabaseProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
