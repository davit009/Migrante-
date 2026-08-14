// ============================================================
// types/app.types.ts
// Tipos de dominio de la aplicación Migrante$
// ============================================================

// ─── Perfil de usuario ───────────────────────────────────────
export interface UserProfile {
  id: string;
  nombre: string;
  pais: string;
  estado_usa: string | null;
  moneda_pref: 'USD' | 'MXN';
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Transacciones ───────────────────────────────────────────
export type TransactionType = 'ingreso' | 'gasto';

export type TransactionCategory =
  | 'trabajo'
  | 'freelance'
  | 'negocio'
  | 'propinas'
  | 'remesa'
  | 'renta'
  | 'supermercado'
  | 'comida'
  | 'gasolina'
  | 'transporte'
  | 'salud'
  | 'ropa'
  | 'servicios'
  | 'telefono'
  | 'entretenimiento'
  | 'envio'
  | 'educacion'
  | 'seguros'
  | 'ahorro'
  | 'otros';

export interface Transaction {
  id: string;
  user_id: string;
  tipo: TransactionType;
  categoria: TransactionCategory;
  descripcion: string | null;
  monto: number;
  moneda: 'USD' | 'MXN';
  tipo_cambio: number | null;
  monto_mxn: number | null;
  fecha: string;
  created_at: string;
}

export interface TransactionCreate {
  tipo: TransactionType;
  categoria: TransactionCategory;
  descripcion?: string;
  monto: number;
  moneda: 'USD' | 'MXN';
  fecha: string;
}

// ─── Listas de compra ────────────────────────────────────────
export type PurchaseStatus = 'borrador' | 'guardada';

export interface PurchaseItem {
  id: string;
  purchase_id: string;
  nombre: string;
  precio: number;
  cantidad: number;
  created_at: string;
}

export interface PurchaseItemCreate {
  nombre: string;
  precio: number;
  cantidad: number;
}

export interface PurchaseList {
  id: string;
  user_id: string;
  nombre: string | null;
  estado_usa: string;
  subtotal: number;
  impuesto: number;
  tasa_imp: number;
  total_usd: number;
  tipo_cambio: number;
  total_mxn: number;
  estado: PurchaseStatus;
  created_at: string;
  items?: PurchaseItem[];
}

// ─── Tipo de cambio ──────────────────────────────────────────
export interface ExchangeRate {
  usd_mxn: number;
  fecha: string;
  fuente: string;
}

export interface ExchangeRateHistory {
  id: string;
  usd_mxn: number;
  fuente: string;
  fecha: string;
}

// ─── Conversor ───────────────────────────────────────────────
export type ConversionMode = 'compra' | 'venta' | 'promedio';

export interface ConversionResult {
  monto_origen: number;
  moneda_origen: 'USD' | 'MXN';
  monto_destino: number;
  moneda_destino: 'USD' | 'MXN';
  tipo_cambio: number;
  modo: ConversionMode;
  fecha: string;
}

// ─── Dashboard ───────────────────────────────────────────────
export interface DashboardStats {
  balance_usd: number;
  balance_mxn: number;
  ingresos_mes: number;
  gastos_mes: number;
  ahorro_mes: number;
  tipo_cambio_actual: number;
}

// ─── Estado de EE.UU. con impuesto ───────────────────────────
export interface UsaState {
  code: string;
  name: string;
  rate: number;
}

// ─── Respuesta API genérica ──────────────────────────────────
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}
