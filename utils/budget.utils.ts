// ============================================================
// utils/budget.utils.ts
// Cálculo del Plan de Ahorro Sugerido (regla 50/30/20)
// ============================================================

import { round2 } from './currency.utils';
import { bucketForCategory } from '@/constants/budget-buckets';
import type { Transaction, MxTransaction } from '@/types/app.types';

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

/**
 * Clasifica el gasto REAL del periodo (transacciones tipo 'gasto')
 * en los mismos 3 baldes que calculateSuggestedBudget, para poder
 * comparar "lo sugerido" contra "lo que de verdad gastaste".
 */
export function classifyActualSpending(transactions: Transaction[], rate: number): SuggestedBudget {
  const totals: SuggestedBudget = { necesidades: 0, gastosPersonales: 0, ahorro: 0 };

  for (const t of transactions) {
    if (t.tipo !== 'gasto') continue;
    const usd = t.moneda === 'USD' ? t.monto : (t.monto_mxn ?? t.monto) / (t.tipo_cambio || rate || 1);
    const bucket = bucketForCategory(t.categoria);
    if (bucket === 'necesidades') totals.necesidades += usd;
    else if (bucket === 'gastos_personales') totals.gastosPersonales += usd;
    else totals.ahorro += usd;
  }

  return {
    necesidades: round2(totals.necesidades),
    gastosPersonales: round2(totals.gastosPersonales),
    ahorro: round2(totals.ahorro),
  };
}

/**
 * Igual que classifyActualSpending pero para el ledger de Modo
 * México (siempre MXN, sin conversión).
 */
export function classifyActualSpendingMx(transactions: MxTransaction[]): SuggestedBudget {
  const totals: SuggestedBudget = { necesidades: 0, gastosPersonales: 0, ahorro: 0 };

  for (const t of transactions) {
    if (t.tipo !== 'gasto') continue;
    const bucket = bucketForCategory(t.categoria);
    if (bucket === 'necesidades') totals.necesidades += t.monto;
    else if (bucket === 'gastos_personales') totals.gastosPersonales += t.monto;
    else totals.ahorro += t.monto;
  }

  return {
    necesidades: round2(totals.necesidades),
    gastosPersonales: round2(totals.gastosPersonales),
    ahorro: round2(totals.ahorro),
  };
}
