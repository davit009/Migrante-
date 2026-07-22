// ============================================================
// constants/currencies.ts
// Monedas soportadas. Escalable para agregar más países.
// ============================================================

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  country: string;
}

export const CURRENCIES: Record<string, Currency> = {
  USD: { code: 'USD', name: 'Dólar Estadounidense', symbol: '$',  flag: '🇺🇸', country: 'Estados Unidos' },
  MXN: { code: 'MXN', name: 'Peso Mexicano',        symbol: '$',  flag: '🇲🇽', country: 'México' },
  // Preparado para futuras monedas:
  // GTQ: { code: 'GTQ', name: 'Quetzal Guatemalteco', symbol: 'Q',  flag: '🇬🇹', country: 'Guatemala' },
  // HNL: { code: 'HNL', name: 'Lempira Hondureño',   symbol: 'L',  flag: '🇭🇳', country: 'Honduras' },
  // COP: { code: 'COP', name: 'Peso Colombiano',      symbol: '$',  flag: '🇨🇴', country: 'Colombia' },
};

export const SUPPORTED_CURRENCIES = Object.values(CURRENCIES);
