// ============================================================
// features/converter/services/exchange.service.ts
// Servicio para consultar el tipo de cambio USD/MXN
// ============================================================

import type { InternalExchangeRateResponse } from '@/types/api.types';

export const exchangeService = {
  /**
   * Obtiene el tipo de cambio actual USD ↔ MXN desde la API interna.
   */
  async getExchangeRate(): Promise<InternalExchangeRateResponse> {
    const res = await fetch('/api/exchange-rate', {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error('Error al obtener el tipo de cambio');
    }

    return res.json();
  },
};
