// ============================================================
// constants/budget-buckets.ts
// Clasifica cada categoría de gasto en uno de los 3 baldes de la
// regla 50/30/20 (Necesidades / Gastos personales / Ahorro), para
// poder comparar el gasto REAL contra el reparto sugerido — no solo
// mostrar cuánto "deberías" gastar en cada balde, sino cuánto
// gastaste de verdad.
// ============================================================

export type BudgetBucket = 'necesidades' | 'gastos_personales' | 'ahorro';

export const CATEGORY_BUCKET: Record<string, BudgetBucket> = {
  // ── Necesidades: obligaciones difíciles de recortar ─────────
  renta: 'necesidades',
  supermercado: 'necesidades',
  gasolina: 'necesidades',
  transporte: 'necesidades',
  salud: 'necesidades',
  servicios: 'necesidades',
  telefono: 'necesidades',
  seguros: 'necesidades',
  envio: 'necesidades',
  educacion: 'necesidades',

  // ── Gastos personales: discrecional ──────────────────────────
  comida: 'gastos_personales',
  ropa: 'gastos_personales',
  entretenimiento: 'gastos_personales',
  otros: 'gastos_personales',

  // ── Ahorro ────────────────────────────────────────────────────
  ahorro: 'ahorro',
};

export function bucketForCategory(categoria: string): BudgetBucket {
  return CATEGORY_BUCKET[categoria] ?? 'gastos_personales';
}
