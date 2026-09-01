// ============================================================
// utils/investment.utils.ts
// Proyecciones puras para el Simulador de Inversión.
// Educativo / ilustrativo — no constituye asesoría financiera.
// ============================================================

import { round2 } from './currency.utils';

/**
 * Proyecta el valor futuro de un monto a interés compuesto anual,
 * como el que pagan los CETES a su vencimiento y reinversión.
 * @param amount - Monto inicial en USD (o la moneda que se use)
 * @param annualRate - Tasa anual en decimal (ej. 0.10 = 10%)
 * @param months - Meses a proyectar
 */
export function projectCompoundReturn(amount: number, annualRate: number, months: number): number {
  const years = months / 12;
  return round2(amount * Math.pow(1 + annualRate, years));
}

/**
 * Aplica retrospectivamente una variación porcentual histórica a un monto,
 * para mostrar "cuánto valdría hoy" — no es una proyección a futuro.
 */
export function applyHistoricalChange(amount: number, changePct: number): number {
  return round2(amount * (1 + changePct));
}
