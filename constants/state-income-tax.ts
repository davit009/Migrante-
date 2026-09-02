// ============================================================
// constants/state-income-tax.ts
// Impuesto ESTATAL sobre el ingreso (income tax), NO confundir con
// el sales tax de constants/usa-states.ts (son impuestos distintos).
//
// Cobertura deliberadamente parcial: los 9 estados sin impuesto
// estatal son un hecho estable y fácil de verificar. Para estados
// de tasa plana incluimos solo los que pudimos confirmar con cifras
// razonablemente confiables. Para los estados de tramos progresivos
// (California, Nueva York, etc.) NO calculamos un monto — usar la
// tasa marginal más alta como aproximación sería engañoso para la
// mayoría de los usuarios (ej. alguien que gana $35,000/año en
// California no paga cerca del 13.3% que solo aplica arriba de
// $1,000,000). Mejor mostrar "no disponible" que un número falso.
//
// ⚠️ ACTUALIZAR CADA AÑO — fuente sugerida: Tax Foundation,
// "State Individual Income Tax Rates and Brackets".
// ============================================================

export type StateTaxType = 'ninguno' | 'plano' | 'progresivo';

export interface StateIncomeTax {
  tipo: StateTaxType;
  /** Solo aplica si tipo === 'plano' */
  tasa?: number;
}

export const STATE_INCOME_TAX_2026: Record<string, StateIncomeTax> = {
  // ── Sin impuesto estatal sobre el ingreso (9 estados) ──────
  AK: { tipo: 'ninguno' },
  FL: { tipo: 'ninguno' },
  NV: { tipo: 'ninguno' },
  NH: { tipo: 'ninguno' },
  SD: { tipo: 'ninguno' },
  TN: { tipo: 'ninguno' },
  TX: { tipo: 'ninguno' },
  WA: { tipo: 'ninguno' },
  WY: { tipo: 'ninguno' },

  // ── Tasa plana (mismo % sin importar el ingreso) ───────────
  AZ: { tipo: 'plano', tasa: 0.025 },
  CO: { tipo: 'plano', tasa: 0.044 },
  IL: { tipo: 'plano', tasa: 0.0495 },
  IN: { tipo: 'plano', tasa: 0.0295 },
  KY: { tipo: 'plano', tasa: 0.04 },
  MA: { tipo: 'plano', tasa: 0.05 },
  MI: { tipo: 'plano', tasa: 0.0425 },
  NC: { tipo: 'plano', tasa: 0.0425 },
  PA: { tipo: 'plano', tasa: 0.0307 },
  UT: { tipo: 'plano', tasa: 0.0455 },

  // El resto (California, Nueva York, tramos progresivos, etc.)
  // no está en esta tabla → se trata como 'progresivo' por defecto
  // (ver getStateIncomeTaxType en utils/payroll-tax.utils.ts).
};
