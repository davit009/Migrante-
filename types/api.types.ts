// ============================================================
// types/api.types.ts
// Tipos para respuestas de APIs externas
// ============================================================

// ─── ExchangeRate API (open.er-api.com) ──────────────────────
export interface ExchangeRateApiResponse {
  result: 'success' | 'error';
  documentation: string;
  terms_of_use: string;
  time_last_update_unix: number;
  time_last_update_utc: string;
  time_next_update_unix: number;
  time_next_update_utc: string;
  base_code: string;
  rates: Record<string, number>;
}

// ─── Respuesta del Route Handler interno ─────────────────────
export interface InternalExchangeRateResponse {
  usd_mxn: number;
  fecha: string;
  fuente: 'cache_db' | 'api_external';
  time_last_update_utc?: string;
}

// ─── Simulador de Inversión (CETES + Bitcoin) ────────────────
export interface InvestmentRatesResponse {
  cetes: {
    /** Tasa de rendimiento anualizada de CETES 28 días, en decimal (ej. 0.105 = 10.5%) */
    tasaAnual: number;
    /** true si la tasa viene en vivo de Banxico; false si es el valor de referencia estático */
    esEnVivo: boolean;
    fecha: string;
  };
  bitcoin: {
    precioUSD: number;
    /** Variación porcentual en el último año (decimal, ej. 0.42 = +42%) */
    variacion1AnioPct: number | null;
    esEnVivo: boolean;
    fecha: string;
  };
}
