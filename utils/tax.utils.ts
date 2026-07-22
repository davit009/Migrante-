// ============================================================
// utils/tax.utils.ts
// Funciones puras para cálculo de impuestos de EE.UU.
// ============================================================

import { USA_TAX_RATES } from '@/constants/usa-states';
import { round2 } from '@/utils/currency.utils';

export interface TaxCalculation {
  subtotal: number;
  tasa: number;        // Ej: 0.0825
  impuesto: number;
  total: number;
  estado_code: string;
  estado_name: string;
}

/**
 * Calcula el impuesto sobre ventas para un monto dado en un estado de EE.UU.
 *
 * @param subtotal   - Suma de precios antes de impuesto
 * @param stateCode  - Código del estado (ej: 'TX', 'CA')
 * @returns TaxCalculation con todos los valores desglosados
 */
export function calculateSalesTax(subtotal: number, stateCode: string): TaxCalculation {
  const state = USA_TAX_RATES[stateCode.toUpperCase()];

  if (!state) {
    // Estado desconocido: asumimos tasa 0 (safe fallback)
    return {
      subtotal: round2(subtotal),
      tasa: 0,
      impuesto: 0,
      total: round2(subtotal),
      estado_code: stateCode,
      estado_name: stateCode,
    };
  }

  const impuesto = round2(subtotal * state.rate);
  const total = round2(subtotal + impuesto);

  return {
    subtotal: round2(subtotal),
    tasa: state.rate,
    impuesto,
    total,
    estado_code: state.code,
    estado_name: state.name,
  };
}

/**
 * Formatea una tasa decimal como porcentaje legible.
 * @example formatTaxRate(0.0825) → "8.25%"
 */
export function formatTaxRate(rate: number): string {
  return `${(rate * 100).toFixed(2)}%`;
}

/**
 * Devuelve true si el estado tiene impuesto estatal = 0.
 */
export function isNoTaxState(stateCode: string): boolean {
  const state = USA_TAX_RATES[stateCode.toUpperCase()];
  return state ? state.rate === 0 : false;
}
