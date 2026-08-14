// ============================================================
// constants/remittance-providers.ts
// Valores de referencia estimados para comparar proveedores de envío
// de dinero USD → MXN. NO son tasas en vivo: son aproximaciones
// típicas basadas en las estructuras de comisión públicas de cada
// proveedor y deben verificarse siempre antes de enviar dinero.
// ============================================================

export interface RemittanceProvider {
  id: string;
  nombre: string;
  emoji: string;
  /** Comisión fija estimada por envío, en USD */
  comisionUSD: number;
  /** Margen estimado sobre el tipo de cambio interbancario (decimal) */
  margenFx: number;
  velocidad: string;
  metodoEntrega: string;
}

export const REMITTANCE_PROVIDERS: RemittanceProvider[] = [
  { id: 'wise', nombre: 'Wise', emoji: '🌐', comisionUSD: 4.5, margenFx: 0.006, velocidad: 'Minutos a 1 día', metodoEntrega: 'Depósito bancario' },
  { id: 'remitly-economy', nombre: 'Remitly (Economy)', emoji: '📨', comisionUSD: 1.99, margenFx: 0.015, velocidad: '3-5 días', metodoEntrega: 'Depósito o efectivo' },
  { id: 'remitly-express', nombre: 'Remitly (Express)', emoji: '⚡', comisionUSD: 3.99, margenFx: 0.012, velocidad: 'Minutos', metodoEntrega: 'Depósito o efectivo' },
  { id: 'xoom', nombre: 'Xoom (PayPal)', emoji: '📲', comisionUSD: 3.99, margenFx: 0.02, velocidad: 'Minutos a 1 día', metodoEntrega: 'Depósito o efectivo' },
  { id: 'moneygram', nombre: 'MoneyGram', emoji: '💳', comisionUSD: 4, margenFx: 0.025, velocidad: 'Minutos a 1 día', metodoEntrega: 'Efectivo en sucursal' },
  { id: 'westernunion', nombre: 'Western Union', emoji: '🏦', comisionUSD: 5, margenFx: 0.03, velocidad: 'Minutos', metodoEntrega: 'Efectivo en sucursal' },
];
