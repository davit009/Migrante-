// ============================================================
// utils/remittance.utils.ts
// Estimación comparativa de envío de dinero entre proveedores.
// Cálculo de referencia — no sustituye la cotización real del proveedor.
// ============================================================

import { round2 } from './currency.utils';
import { REMITTANCE_PROVIDERS, type RemittanceProvider } from '@/constants/remittance-providers';

export interface RemittanceEstimate {
  provider: RemittanceProvider;
  comision: number;
  tasaEfectiva: number;
  montoRecibidoMXN: number;
}

/**
 * Estima cuánto recibiría el destinatario en MXN con cada proveedor,
 * dado un monto en USD y el tipo de cambio interbancario base.
 * Ordena de mayor a menor monto recibido (mejor opción primero).
 */
export function estimateRemittanceOptions(amountUSD: number, baseRate: number): RemittanceEstimate[] {
  const estimates = REMITTANCE_PROVIDERS.map((provider) => {
    const montoEnviado = Math.max(amountUSD - provider.comisionUSD, 0);
    const tasaEfectiva = baseRate * (1 - provider.margenFx);
    const montoRecibidoMXN = round2(montoEnviado * tasaEfectiva);

    return {
      provider,
      comision: provider.comisionUSD,
      tasaEfectiva,
      montoRecibidoMXN,
    };
  });

  return estimates.sort((a, b) => b.montoRecibidoMXN - a.montoRecibidoMXN);
}
