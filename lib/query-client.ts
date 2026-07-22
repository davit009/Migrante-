// ============================================================
// lib/query-client.ts
// Configuración centralizada de TanStack Query.
// ============================================================

import { QueryClient } from '@tanstack/react-query';

/**
 * Crea una instancia de QueryClient con configuración optimizada para Migrante$.
 *
 * - staleTime: 5 min para datos de usuario (evita re-fetches innecesarios)
 * - gcTime: 10 min de caché tras dejar de ser observado
 * - retry: 1 reintento (no 3, para no demorar errores reales al usuario)
 * - refetchOnWindowFocus: false (no interrumpir al usuario al cambiar de tab)
 */
export function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,   // 5 minutos
        gcTime: 10 * 60 * 1000,     // 10 minutos
        retry: 1,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 0,
      },
    },
  });
}

// Singleton para el browser (evita múltiples instancias entre renders)
let browserQueryClient: QueryClient | undefined;

export function getQueryClient(): QueryClient {
  if (typeof window === 'undefined') {
    // Server: siempre una instancia nueva (no compartir entre requests)
    return makeQueryClient();
  }

  // Browser: singleton
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}
