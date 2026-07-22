'use client';

// ============================================================
// providers/QueryProvider.tsx
// Proveedor de TanStack Query para Client Components.
// ============================================================

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { getQueryClient } from '@/lib/query-client';

interface QueryProviderProps {
  children: React.ReactNode;
}

/**
 * Envuelve la app con el QueryClientProvider de TanStack Query.
 * El cliente es un singleton en el browser para evitar re-creaciones.
 * Los DevTools solo se cargan en desarrollo.
 */
export function QueryProvider({ children }: QueryProviderProps) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} position="bottom" />
      )}
    </QueryClientProvider>
  );
}
