// ============================================================
// utils/payroll-tax.utils.ts
// Estimación de impuestos sobre nómina — federal + FICA/autoempleo
// + estatal (parcial). Cálculo de referencia educativo, NO
// sustituye una declaración real ni asesoría fiscal.
// ============================================================

import type { FilingStatus, WorkerType } from '@/types/app.types';
import {
  FEDERAL_BRACKETS_2026,
  STANDARD_DEDUCTION_2026,
  FICA_2026,
  SELF_EMPLOYMENT_TAX,
  type TaxBracket,
} from '@/constants/payroll-tax-2026';
import { STATE_INCOME_TAX_2026, type StateTaxType } from '@/constants/state-income-tax';

/** Aplica una tabla de tramos progresivos a un ingreso gravable anual. */
function applyBrackets(taxableIncome: number, brackets: TaxBracket[]): number {
  if (taxableIncome <= 0) return 0;

  let tax = 0;
  for (const bracket of brackets) {
    const techoTramo = bracket.hasta ?? Infinity;
    if (taxableIncome <= bracket.desde) break;

    const montoEnTramo = Math.min(taxableIncome, techoTramo) - bracket.desde;
    tax += montoEnTramo * bracket.tasa;
  }
  return tax;
}

/**
 * Estima el impuesto federal ANUAL sobre el ingreso, dado un ingreso
 * bruto anualizado y el estado civil fiscal. Usa la deducción
 * estándar (no contempla deducciones detalladas ni créditos).
 */
export function estimateAnnualFederalTax(annualGrossIncome: number, filingStatus: FilingStatus): number {
  const deduction = STANDARD_DEDUCTION_2026[filingStatus];
  const taxableIncome = Math.max(0, annualGrossIncome - deduction);
  return applyBrackets(taxableIncome, FEDERAL_BRACKETS_2026[filingStatus]);
}

/**
 * FICA para un empleado W-2: Seguro Social (con tope) + Medicare
 * (sin tope) + Medicare adicional sobre ingresos altos.
 * ytdGrossBeforeThisCheck permite respetar el tope anual de Seguro
 * Social cuando ya se acumuló ingreso en el año.
 */
export function estimateFicaForPaycheck(
  grossThisPaycheck: number,
  ytdGrossBeforeThisCheck: number,
  filingStatus: FilingStatus
): { seguroSocial: number; medicare: number; medicareAdicional: number; total: number } {
  const espacioRestanteSS = Math.max(0, FICA_2026.topeSalarioSeguroSocial - ytdGrossBeforeThisCheck);
  const gravableSS = Math.min(grossThisPaycheck, espacioRestanteSS);
  const seguroSocial = gravableSS * FICA_2026.tasaSeguroSocial;

  const medicare = grossThisPaycheck * FICA_2026.tasaMedicare;

  const umbral = FICA_2026.umbralMedicareAdicional[filingStatus];
  const ytdDespues = ytdGrossBeforeThisCheck + grossThisPaycheck;
  const excedente = Math.max(0, Math.min(grossThisPaycheck, ytdDespues - umbral));
  const medicareAdicional = excedente * FICA_2026.tasaMedicareAdicional;

  return {
    seguroSocial,
    medicare,
    medicareAdicional,
    total: seguroSocial + medicare + medicareAdicional,
  };
}

/**
 * Impuesto de autoempleo (1099) sobre la utilidad neta de un pago,
 * más una estimación simplificada del ahorro fiscal que genera la
 * deducción de la mitad del impuesto de autoempleo.
 */
export function estimateSelfEmploymentTax(
  netProfitThisPeriod: number,
  ytdNetProfitBeforeThisPeriod: number
): { seguroSocial: number; medicare: number; total: number } {
  const gravable = netProfitThisPeriod * SELF_EMPLOYMENT_TAX.porcentajeUtilidadGravable;
  const ytdGravableAntes = ytdNetProfitBeforeThisPeriod * SELF_EMPLOYMENT_TAX.porcentajeUtilidadGravable;

  const espacioRestanteSS = Math.max(0, FICA_2026.topeSalarioSeguroSocial - ytdGravableAntes);
  const gravableSS = Math.min(gravable, espacioRestanteSS);

  const seguroSocial = gravableSS * SELF_EMPLOYMENT_TAX.tasaSeguroSocial;
  const medicare = gravable * SELF_EMPLOYMENT_TAX.tasaMedicare;

  return { seguroSocial, medicare, total: seguroSocial + medicare };
}

export function getStateTaxType(estadoCode: string): StateTaxType {
  return STATE_INCOME_TAX_2026[estadoCode]?.tipo ?? 'progresivo';
}

/**
 * Impuesto estatal anual estimado. Devuelve null cuando el estado
 * tiene tramos progresivos que no calculamos (ver constants/state-income-tax.ts) —
 * la UI debe mostrar "no disponible", nunca un 0 ni un número inventado.
 */
export function estimateAnnualStateTax(annualGrossIncome: number, estadoCode: string): number | null {
  const config = STATE_INCOME_TAX_2026[estadoCode];
  if (!config || config.tipo === 'progresivo') return null;
  if (config.tipo === 'ninguno') return 0;
  return annualGrossIncome * (config.tasa ?? 0);
}

export interface PayrollProjection {
  ytdGross: number;
  paychecksPerYear: number;
  annualizedGross: number;
  estimatedAnnualFederalTax: number;
  estimatedAnnualFica: number;
  estimatedAnnualStateTax: number | null;
  estimatedAnnualTotal: number | null;
  ytdActualWithheld: number;
  projectedAnnualWithheld: number | null;
  /** Positivo = probable reembolso, negativo = probable saldo a pagar. null si falta el estatal. */
  projectedDifference: number | null;
}

/**
 * Proyección anual a partir de lo registrado hasta ahora en el año:
 * anualiza el ingreso acumulado (asumiendo un ritmo de pago
 * constante), estima el impuesto total esperado, y lo compara
 * contra lo que el usuario reportó que ya le retuvieron.
 */
export function projectAnnualPayroll(params: {
  ytdGross: number;
  entriesCount: number;
  paychecksPerYear: number;
  filingStatus: FilingStatus;
  workerType: WorkerType;
  estadoCode: string;
  ytdActualFederalWithheld: number;
  ytdActualStateWithheld: number;
}): PayrollProjection {
  const {
    ytdGross,
    entriesCount,
    paychecksPerYear,
    filingStatus,
    workerType,
    estadoCode,
    ytdActualFederalWithheld,
    ytdActualStateWithheld,
  } = params;

  const avgPerCheck = entriesCount > 0 ? ytdGross / entriesCount : 0;
  const annualizedGross = avgPerCheck * paychecksPerYear;

  const estimatedAnnualFederalTax = estimateAnnualFederalTax(annualizedGross, filingStatus);

  const estimatedAnnualFica =
    workerType === 'w2'
      ? estimateFicaForPaycheck(annualizedGross, 0, filingStatus).total
      : estimateSelfEmploymentTax(annualizedGross, 0).total;

  const estimatedAnnualStateTax = estimateAnnualStateTax(annualizedGross, estadoCode);

  const estimatedAnnualTotal =
    estimatedAnnualStateTax === null
      ? null
      : estimatedAnnualFederalTax + estimatedAnnualFica + estimatedAnnualStateTax;

  const ytdActualWithheld = ytdActualFederalWithheld + ytdActualStateWithheld;
  const projectedAnnualWithheld =
    entriesCount > 0 ? (ytdActualWithheld / entriesCount) * paychecksPerYear : null;

  const projectedDifference =
    estimatedAnnualTotal === null || projectedAnnualWithheld === null
      ? null
      : projectedAnnualWithheld - estimatedAnnualTotal;

  return {
    ytdGross,
    paychecksPerYear,
    annualizedGross,
    estimatedAnnualFederalTax,
    estimatedAnnualFica,
    estimatedAnnualStateTax,
    estimatedAnnualTotal,
    ytdActualWithheld,
    projectedAnnualWithheld,
    projectedDifference,
  };
}
