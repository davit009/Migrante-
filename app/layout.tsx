// ============================================================
// app/layout.tsx
// Root Layout con fondo animado Liquid Glass
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
  keywords: ['finanzas migrantes', 'conversor dolar peso', 'USD MXN', 'ahorro migrante'],
  authors: [{ name: 'Migrante$' }],
  openGraph: {
    title: 'Migrante$ — Tu dinero, bajo control',
    description: 'Finanzas inteligentes para migrantes en EE.UU.',
    type: 'website',
    locale: 'es_MX',
  },
  robots: { index: false, follow: false },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f0f4ff' },
    { media: '(prefers-color-scheme: dark)',  color: '#0d1520' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning className={inter.variable}>
      <body className={inter.className}>
        <ThemeProvider>
          <QueryProvider>
            <SupabaseProvider>
              {/* Fondo animado Liquid Glass — visible detrás de toda la app */}
              <div className="bg-canvas" aria-hidden="true">
                <div className="blob blob-1" />
                <div className="blob blob-2" />
                <div className="blob blob-3" />
              </div>

              {children}

              <Toaster
                position="top-center"
                richColors
                closeButton
                toastOptions={{
                  className: 'glass-strong rounded-2xl border-0 text-sm font-medium',
                }}
              />
            </SupabaseProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
