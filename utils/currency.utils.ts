// ============================================================
// utils/currency.utils.ts
// Funciones puras para formateo y conversión de divisas.
// Sin efectos secundarios. Sin dependencias externas.
// ============================================================

/**
 * Formatea un número como moneda USD.
 * @example formatUSD(1234.5) → "$1,234.50"
 */
export function formatUSD(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Formatea un número como moneda MXN.
 * @example formatMXN(20000) → "$20,000.00"
 */
export function formatMXN(amount: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Formatea cualquier número como moneda según su código.
 */
export function formatCurrency(amount: number, currencyCode: 'USD' | 'MXN'): string {
  if (currencyCode === 'USD') return formatUSD(amount);
  return formatMXN(amount);
}

/**
 * Convierte USD a MXN usando el tipo de cambio dado.
 * @param usd - Monto en dólares
 * @param rate - Tipo de cambio (USD → MXN). Ej: 17.35
 */
export function convertUSDtoMXN(usd: number, rate: number): number {
  return parseFloat((usd * rate).toFixed(2));
}

/**
 * Convierte MXN a USD usando el tipo de cambio dado.
 * @param mxn - Monto en pesos
 * @param rate - Tipo de cambio (USD → MXN). Ej: 17.35
 */
export function convertMXNtoUSD(mxn: number, rate: number): number {
  return parseFloat((mxn / rate).toFixed(2));
}

/**
 * Aplica el diferencial de compra/venta al tipo de cambio base.
 * Los bancos y casas de cambio suelen aplicar ±0.5-2% sobre el tipo interbancario.
 *
 * @param baseRate - Tipo de cambio base (interbancario)
 * @param mode     - 'compra' = el banco compra USD (paga menos MXN)
 *                   'venta'  = el banco vende USD (cobra más MXN)
 *                   'promedio' = tipo interbancario puro
 * @param spread   - Diferencial en decimal (default: 0.015 = 1.5%)
 */
export function applyConversionMode(
  baseRate: number,
  mode: 'compra' | 'venta' | 'promedio',
  spread = 0.015
): number {
  switch (mode) {
    case 'compra':
      return parseFloat((baseRate * (1 - spread)).toFixed(4));
    case 'venta':
      return parseFloat((baseRate * (1 + spread)).toFixed(4));
    case 'promedio':
    default:
      return baseRate;
  }
}

/**
 * Formatea el tipo de cambio para mostrar en UI.
 * @example formatRate(17.3521) → "17.3521"
 */
export function formatRate(rate: number): string {
  return rate.toFixed(4);
}

/**
 * Redondea a 2 decimales con precisión numérica (evita floating point errors).
 */
export function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
