// ============================================================
// utils/category-spending.utils.ts
// Agrupa transacciones de gasto por categoría, convertidas a USD.
// ============================================================

import type { Transaction, MxTransaction } from '@/types/app.types';
import { round2 } from './currency.utils';

export interface CategorySpending {
  categoria: string;
  totalUSD: number;
}

export function groupExpensesByCategory(transactions: Transaction[], rate: number): CategorySpending[] {
  const totals = new Map<string, number>();

  for (const t of transactions) {
    if (t.tipo !== 'gasto') continue;
    const usd = t.moneda === 'USD' ? t.monto : (t.monto_mxn ?? t.monto) / (t.tipo_cambio || rate || 1);
    totals.set(t.categoria, (totals.get(t.categoria) ?? 0) + usd);
  }

  return Array.from(totals.entries())
    .map(([categoria, totalUSD]) => ({ categoria, totalUSD: round2(totalUSD) }))
    .sort((a, b) => b.totalUSD - a.totalUSD);
}

export interface MxCategorySpending {
  categoria: string;
  totalMXN: number;
}

/**
 * Igual que groupExpensesByCategory pero para el ledger de Modo
 * México (siempre MXN, sin conversión).
 */
export function groupMxExpensesByCategory(transactions: MxTransaction[]): MxCategorySpending[] {
  const totals = new Map<string, number>();

  for (const t of transactions) {
    if (t.tipo !== 'gasto') continue;
    totals.set(t.categoria, (totals.get(t.categoria) ?? 0) + t.monto);
  }

  return Array.from(totals.entries())
    .map(([categoria, totalMXN]) => ({ categoria, totalMXN: round2(totalMXN) }))
    .sort((a, b) => b.totalMXN - a.totalMXN);
}
