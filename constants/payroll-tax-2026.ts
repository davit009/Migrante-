// ============================================================
// constants/payroll-tax-2026.ts
// Cifras fiscales federales de referencia — año fiscal 2026.
//
// ⚠️ ACTUALIZAR CADA AÑO. Fuente: IRS Rev. Proc. 2025-32 y
// Publicación 15-T (irs.gov/publications/p15t). Los tramos
// intermedios (12%–35%) se reconstruyeron cruzando varias fuentes
// públicas porque el entorno donde se generó este archivo no tenía
// acceso directo a irs.gov — antes de confiar en montos exactos
// para una declaración real, verifica contra la tabla oficial
// vigente. Deducción estándar, FICA y los límites de los tramos
// 10% y 37% sí están confirmados contra múltiples fuentes.
// ============================================================

export interface TaxBracket {
  /** Límite inferior del tramo (inclusive), en USD de ingreso gravable anual */
  desde: number;
  /** Límite superior del tramo (exclusivo). null = sin límite superior */
  hasta: number | null;
  tasa: number;
}

export const STANDARD_DEDUCTION_2026: Record<'soltero' | 'casado_conjunto', number> = {
  soltero: 16100,
  casado_conjunto: 32200,
};

export const FEDERAL_BRACKETS_2026: Record<'soltero' | 'casado_conjunto', TaxBracket[]> = {
  soltero: [
    { desde: 0, hasta: 12400, tasa: 0.10 },
    { desde: 12400, hasta: 50400, tasa: 0.12 },
    { desde: 50400, hasta: 105700, tasa: 0.22 },
    { desde: 105700, hasta: 201775, tasa: 0.24 },
    { desde: 201775, hasta: 256225, tasa: 0.32 },
    { desde: 256225, hasta: 640600, tasa: 0.35 },
    { desde: 640600, hasta: null, tasa: 0.37 },
  ],
  casado_conjunto: [
    { desde: 0, hasta: 24800, tasa: 0.10 },
    { desde: 24800, hasta: 100800, tasa: 0.12 },
    { desde: 100800, hasta: 211400, tasa: 0.22 },
    { desde: 211400, hasta: 403550, tasa: 0.24 },
    { desde: 403550, hasta: 512450, tasa: 0.32 },
    { desde: 512450, hasta: 768700, tasa: 0.35 },
    { desde: 768700, hasta: null, tasa: 0.37 },
  ],
};

// ─── FICA / Seguro Social + Medicare (2026) ───────────────────
// Confirmado contra múltiples fuentes — estable año con año salvo
// el tope de Seguro Social, que sube cada enero.
export const FICA_2026 = {
  tasaSeguroSocial: 0.062,
  topeSalarioSeguroSocial: 184600,
  tasaMedicare: 0.0145,
  /** Medicare adicional sobre el excedente de este umbral (no tiene tope superior) */
  tasaMedicareAdicional: 0.009,
  umbralMedicareAdicional: {
    soltero: 200000,
    casado_conjunto: 250000,
  },
};

// Trabajador por cuenta propia (1099): paga ambas mitades de FICA
// vía el Impuesto de Autoempleo (Self-Employment Tax), sobre el
// 92.35% de la utilidad neta — regla estable del IRS, no cambia
// con la inflación.
export const SELF_EMPLOYMENT_TAX = {
  porcentajeUtilidadGravable: 0.9235,
  tasaSeguroSocial: 0.124, // 6.2% x 2
  tasaMedicare: 0.029, // 1.45% x 2
};
