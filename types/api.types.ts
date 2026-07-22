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
