// ============================================================
// constants/usa-states.ts
// Estados de EE.UU. con sus tasas de impuesto sobre ventas.
// ESCALABILIDAD: Para agregar un nuevo estado, basta con añadir
// una entrada a este objeto. Ningún componente necesita modificarse.
// ============================================================

import type { UsaState } from '@/types/app.types';

/**
 * Registro de estados con impuesto sobre ventas (sales tax).
 * La tasa es el porcentaje ESTATAL base. Algunas ciudades agregan
 * impuestos locales adicionales (no incluidos por ahora).
 *
 * Fuente: Tax Foundation 2024
 */
export const USA_TAX_RATES: Record<string, UsaState> = {
  // ── Sin impuesto estatal ─────────────────────────────────
  AK: { code: 'AK', name: 'Alaska',      rate: 0.0000 },
  DE: { code: 'DE', name: 'Delaware',    rate: 0.0000 },
  MT: { code: 'MT', name: 'Montana',     rate: 0.0000 },
  NH: { code: 'NH', name: 'New Hampshire', rate: 0.0000 },
  OR: { code: 'OR', name: 'Oregon',      rate: 0.0000 },

  // ── Con impuesto estatal ─────────────────────────────────
  AL: { code: 'AL', name: 'Alabama',     rate: 0.0400 },
  AZ: { code: 'AZ', name: 'Arizona',     rate: 0.0560 },
  AR: { code: 'AR', name: 'Arkansas',    rate: 0.0650 },
  CA: { code: 'CA', name: 'California',  rate: 0.0725 },
  CO: { code: 'CO', name: 'Colorado',    rate: 0.0290 },
  CT: { code: 'CT', name: 'Connecticut', rate: 0.0635 },
  FL: { code: 'FL', name: 'Florida',     rate: 0.0600 },
  GA: { code: 'GA', name: 'Georgia',     rate: 0.0400 },
  HI: { code: 'HI', name: 'Hawaii',      rate: 0.0400 },
  ID: { code: 'ID', name: 'Idaho',       rate: 0.0600 },
  IL: { code: 'IL', name: 'Illinois',    rate: 0.0625 },
  IN: { code: 'IN', name: 'Indiana',     rate: 0.0700 },
  IA: { code: 'IA', name: 'Iowa',        rate: 0.0600 },
  KS: { code: 'KS', name: 'Kansas',      rate: 0.0650 },
  KY: { code: 'KY', name: 'Kentucky',    rate: 0.0600 },
  LA: { code: 'LA', name: 'Louisiana',   rate: 0.0450 },
  ME: { code: 'ME', name: 'Maine',       rate: 0.0550 },
  MD: { code: 'MD', name: 'Maryland',    rate: 0.0600 },
  MA: { code: 'MA', name: 'Massachusetts', rate: 0.0625 },
  MI: { code: 'MI', name: 'Michigan',    rate: 0.0600 },
  MN: { code: 'MN', name: 'Minnesota',   rate: 0.0688 },
  MS: { code: 'MS', name: 'Mississippi', rate: 0.0700 },
  MO: { code: 'MO', name: 'Missouri',    rate: 0.0423 },
  NE: { code: 'NE', name: 'Nebraska',    rate: 0.0550 },
  NV: { code: 'NV', name: 'Nevada',      rate: 0.0685 },
  NJ: { code: 'NJ', name: 'New Jersey',  rate: 0.0663 },
  NM: { code: 'NM', name: 'New Mexico',  rate: 0.0513 },
  NY: { code: 'NY', name: 'New York',    rate: 0.0400 },
  NC: { code: 'NC', name: 'North Carolina', rate: 0.0475 },
  ND: { code: 'ND', name: 'North Dakota', rate: 0.0500 },
  OH: { code: 'OH', name: 'Ohio',        rate: 0.0575 },
  OK: { code: 'OK', name: 'Oklahoma',    rate: 0.0450 },
  PA: { code: 'PA', name: 'Pennsylvania', rate: 0.0600 },
  RI: { code: 'RI', name: 'Rhode Island', rate: 0.0700 },
  SC: { code: 'SC', name: 'South Carolina', rate: 0.0600 },
  SD: { code: 'SD', name: 'South Dakota', rate: 0.0450 },
  TN: { code: 'TN', name: 'Tennessee',   rate: 0.0700 },
  TX: { code: 'TX', name: 'Texas',       rate: 0.0825 },
  UT: { code: 'UT', name: 'Utah',        rate: 0.0485 },
  VT: { code: 'VT', name: 'Vermont',     rate: 0.0600 },
  VA: { code: 'VA', name: 'Virginia',    rate: 0.0530 },
  WA: { code: 'WA', name: 'Washington',  rate: 0.0650 },
  WV: { code: 'WV', name: 'West Virginia', rate: 0.0600 },
  WI: { code: 'WI', name: 'Wisconsin',   rate: 0.0500 },
  WY: { code: 'WY', name: 'Wyoming',     rate: 0.0400 },
  DC: { code: 'DC', name: 'Washington D.C.', rate: 0.0600 },
};

/**
 * Lista ordenada para usar en selects/dropdowns.
 */
export const USA_STATES_LIST: UsaState[] = Object.values(USA_TAX_RATES).sort(
  (a, b) => a.name.localeCompare(b.name)
);

/**
 * Estados más comunes para migrantes (aparecen primero en la UI).
 */
export const USA_POPULAR_STATES = ['TX', 'CA', 'FL', 'NY', 'IL', 'NV', 'AZ', 'GA'];
