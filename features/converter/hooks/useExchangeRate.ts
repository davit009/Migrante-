'use client';

// ============================================================
// features/converter/hooks/useExchangeRate.ts
// Hook con TanStack Query para el tipo de cambio USD/MXN
// ============================================================

import { useQuery } from '@tanstack/react-query';
import { exchangeService } from '../services/exchange.service';

export function useExchangeRate() {
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['exchange-rate'],
    queryFn: () => exchangeService.getExchangeRate(),
    staleTime: 30 * 60 * 1000, // Cachear durante 30 minutos en el cliente
    gcTime: 60 * 60 * 1000,    // Guardar en garbage collector durante 1 hora
  });

  return {
    rate: data?.usd_mxn ?? 0,
    lastUpdated: data?.fecha,
    source: data?.fuente,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  };
}
