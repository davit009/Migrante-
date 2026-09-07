// ============================================================
// lib/transporte/format.ts
// Helpers de formato compartidos por la UI de Saldo Transporte.
// ============================================================

export function formatMonto(monto: number, moneda: string) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: moneda || 'MXN',
  }).format(monto);
}

export function formatFecha(fechaIso: string) {
  return new Intl.DateTimeFormat('es-MX', {
    dateStyle: 'medium',
    timeStyle: 'short',
    // Estas páginas son Server Components: sin timeZone explícito, el
    // formato usa la hora del servidor (UTC en Vercel), no la del
    // usuario — mostraba la hora ~6h adelantada. Misma zona que ya
    // asume transporte_procesar_descuentos() en la base de datos.
    timeZone: 'America/Mexico_City',
  }).format(new Date(fechaIso));
}

export const DIAS_SEMANA = [
  { value: 0, label: 'Dom' },
  { value: 1, label: 'Lun' },
  { value: 2, label: 'Mar' },
  { value: 3, label: 'Mié' },
  { value: 4, label: 'Jue' },
  { value: 5, label: 'Vie' },
  { value: 6, label: 'Sáb' },
] as const;

export const TIPO_LABEL: Record<string, string> = {
  recarga: 'Recarga',
  viaje_automatico: 'Viaje automático',
  viaje_manual: 'Ajuste: viaje extra',
  ajuste: 'Ajuste manual',
};
