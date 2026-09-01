// ============================================================
// utils/date.utils.ts
// Funciones puras para formateo y manejo de fechas.
// ============================================================

/**
 * Formatea una fecha ISO a formato legible en español.
 * @example formatDate('2024-03-15') → "15 de marzo de 2024"
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00'); // Evita problemas de timezone
  return date.toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Formatea una fecha ISO a formato corto.
 * @example formatDateShort('2024-03-15') → "15 mar. 2024"
 */
export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Devuelve la fecha actual en formato YYYY-MM-DD (para inputs type="date").
 */
export function getTodayISO(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Devuelve el primer y último día del mes actual en formato YYYY-MM-DD.
 */
export function getCurrentMonthRange(): { start: string; end: string } {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0],
  };
}

/**
 * Devuelve el nombre del mes actual en español.
 * @example getCurrentMonthName() → "Marzo"
 */
export function getCurrentMonthName(): string {
  return new Date().toLocaleDateString('es-MX', { month: 'long' });
}

/**
 * Devuelve la clave de mes YYYY-MM para una fecha dada (por defecto, hoy).
 * @example getMonthKey() → "2026-08"
 */
export function getMonthKey(date: Date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

/**
 * Desplaza una clave de mes YYYY-MM hacia adelante o atrás.
 * @example shiftMonthKey('2026-01', -1) → '2025-12'
 */
export function shiftMonthKey(monthKey: string, delta: number): string {
  const [year, month] = monthKey.split('-').map(Number);
  return getMonthKey(new Date(year, month - 1 + delta, 1));
}

/**
 * Formatea una clave de mes YYYY-MM a texto legible en español.
 * @example formatMonthLabel('2026-08') → "Agosto 2026"
 */
export function formatMonthLabel(monthKey: string): string {
  const [year, month] = monthKey.split('-').map(Number);
  const label = new Date(year, month - 1, 1).toLocaleDateString('es-MX', {
    month: 'long',
    year: 'numeric',
  });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

/**
 * true si la clave de mes YYYY-MM corresponde al mes actual.
 */
export function isCurrentMonth(monthKey: string): boolean {
  return monthKey === getMonthKey();
}

/**
 * Formatea una fecha ISO con hora (timestamp).
 * @example formatDateTime('2024-03-15T14:30:00Z') → "15 mar. 2024, 2:30 p.m."
 */
export function formatDateTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

/**
 * Calcula cuánto tiempo pasó desde una fecha (relativo).
 * @example timeAgo('2024-03-14T10:00:00Z') → "hace 2 días"
 */
export function timeAgo(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'ahora mismo';
  if (diffMins < 60) return `hace ${diffMins} min`;
  if (diffHours < 24) return `hace ${diffHours}h`;
  if (diffDays < 7) return `hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
  return formatDateShort(isoString.split('T')[0]);
}
