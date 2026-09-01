'use client';

// ============================================================
// features/savings/hooks/useInvestmentRates.ts
// Hook con TanStack Query para las tasas del Simulador de Inversión
// ============================================================

import { useQuery } from '@tanstack/react-query';
import { investmentService } from '../services/investment.service';

export function useInvestmentRates() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['investment-rates'],
    queryFn: () => investmentService.getInvestmentRates(),
    staleTime: 60 * 60 * 1000, // 1 hora
    gcTime: 6 * 60 * 60 * 1000,
  });

  return {
    cetes: data?.cetes,
    bitcoin: data?.bitcoin,
    isLoading,
    isError,
  };
}
