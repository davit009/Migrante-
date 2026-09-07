// ============================================================
// next.config.ts
// Configuración de Next.js para Migrante$.
// ============================================================

import type { NextConfig } from 'next';

const isDev = process.env.NODE_ENV === 'development';

// CSP sin nonces (ver docs de Next.js: content-security-policy.md) — evita tener
// que forzar renderizado dinámico en toda la app. 'unsafe-inline' en script/style
// es necesario porque next-themes inyecta un <script> inline (anti-flash de tema)
// y varios componentes usan style={{...}} inline; el resto de directivas sí quedan
// restringidas (nada de <object>/<embed>, sin iframes ajenos, sin fetch/imágenes
// fuera de Supabase y avatares de Google, sin cambiar el <base> ni enviar forms
// a otro dominio).
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''};
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data: https://*.supabase.co https://lh3.googleusercontent.com;
  font-src 'self';
  connect-src 'self' https://*.supabase.co wss://*.supabase.co;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`.replace(/\s{2,}/g, ' ').trim();

const nextConfig: NextConfig = {
  // Habilitar React strict mode para detectar problemas en desarrollo
  reactStrictMode: true,

  // Optimización de imágenes — permitir dominios de Supabase Storage
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        // Avatares de Google OAuth
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },

  // Headers de seguridad
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: cspHeader,
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
