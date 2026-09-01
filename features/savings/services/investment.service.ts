// ============================================================
// features/savings/services/investment.service.ts
// Servicio para consultar las tasas del Simulador de Inversión
// ============================================================

import type { InvestmentRatesResponse } from '@/types/api.types';

export const investmentService = {
  async getInvestmentRates(): Promise<InvestmentRatesResponse> {
    const res = await fetch('/api/investment-rates');
    if (!res.ok) {
      throw new Error('Error al obtener las tasas de inversión');
    }
    return res.json();
  },
};
