// ============================================================
// utils/budget.utils.ts
// Cálculo del Plan de Ahorro Sugerido (regla 50/30/20)
// ============================================================

import { round2 } from './currency.utils';

export interface SuggestedBudget {
  necesidades: number;
  gastosPersonales: number;
  ahorro: number;
}

const NECESIDADES_PCT = 0.5;
const GASTOS_PERSONALES_PCT = 0.3;
const AHORRO_PCT = 0.2;

/**
 * Distribuye un ingreso en USD según la regla 50/30/20:
 * 50% necesidades, 30% gastos personales, 20% ahorro.
 */
export function calculateSuggestedBudget(incomeUSD: number): SuggestedBudget {
  return {
    necesidades: round2(incomeUSD * NECESIDADES_PCT),
    gastosPersonales: round2(incomeUSD * GASTOS_PERSONALES_PCT),
    ahorro: round2(incomeUSD * AHORRO_PCT),
  };
}
