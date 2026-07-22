// ============================================================
// constants/categories.ts
// Categorías de transacciones (ingresos y gastos).
// Escalable: agregar nuevas categorías sin tocar componentes.
// ============================================================

export interface Category {
  value: string;
  label: string;
  emoji: string;
  tipo: 'ingreso' | 'gasto' | 'ambos';
}

export const CATEGORIES: Category[] = [
  // ── Ingresos ─────────────────────────────────────────────
  { value: 'trabajo',       label: 'Trabajo / Salario',  emoji: '💼', tipo: 'ingreso' },
  { value: 'freelance',     label: 'Freelance',           emoji: '💻', tipo: 'ingreso' },
  { value: 'negocio',       label: 'Negocio',             emoji: '🏪', tipo: 'ingreso' },
  { value: 'propinas',      label: 'Propinas',            emoji: '💵', tipo: 'ingreso' },
  { value: 'remesa',        label: 'Remesa recibida',     emoji: '📲', tipo: 'ingreso' },

  // ── Gastos ───────────────────────────────────────────────
  { value: 'renta',         label: 'Renta / Vivienda',   emoji: '🏠', tipo: 'gasto' },
  { value: 'supermercado',  label: 'Supermercado',        emoji: '🛒', tipo: 'gasto' },
  { value: 'comida',        label: 'Comida / Restaurante',emoji: '🍽️', tipo: 'gasto' },
  { value: 'gasolina',      label: 'Gasolina',            emoji: '⛽', tipo: 'gasto' },
  { value: 'transporte',    label: 'Transporte / Bus',    emoji: '🚌', tipo: 'gasto' },
  { value: 'salud',         label: 'Salud / Médico',      emoji: '🏥', tipo: 'gasto' },
  { value: 'ropa',          label: 'Ropa / Calzado',      emoji: '👕', tipo: 'gasto' },
  { value: 'servicios',     label: 'Servicios / Utilities',emoji: '💡',tipo: 'gasto' },
  { value: 'telefono',      label: 'Teléfono / Internet', emoji: '📱', tipo: 'gasto' },
  { value: 'entretenimiento',label: 'Entretenimiento',    emoji: '🎬', tipo: 'gasto' },
  { value: 'envio',         label: 'Envío de dinero',     emoji: '📤', tipo: 'gasto' },
  { value: 'educacion',     label: 'Educación',           emoji: '📚', tipo: 'gasto' },
  { value: 'seguros',       label: 'Seguros',             emoji: '🛡️', tipo: 'gasto' },

  // ── Ambos ─────────────────────────────────────────────────
  { value: 'ahorro',        label: 'Ahorro / Inversión',  emoji: '🏦', tipo: 'ambos' },
  { value: 'otros',         label: 'Otros',               emoji: '📌', tipo: 'ambos' },
];

export const INCOME_CATEGORIES = CATEGORIES.filter(
  (c) => c.tipo === 'ingreso' || c.tipo === 'ambos'
);

export const EXPENSE_CATEGORIES = CATEGORIES.filter(
  (c) => c.tipo === 'gasto' || c.tipo === 'ambos'
);

export const getCategoryByValue = (value: string): Category | undefined =>
  CATEGORIES.find((c) => c.value === value);
