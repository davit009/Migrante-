'use client';

// ============================================================
// features/payroll-tax/components/PayrollSummaryCard.tsx
// Proyección anual de impuestos sobre nómina/autoempleo a partir
// de los pagos registrados. Estimación educativa, NO sustituye una
// declaración real ni asesoría fiscal.
// ============================================================

import { useState } from 'react';
import type { PayrollEntry, FilingStatus, WorkerType } from '@/types/app.types';
import { projectAnnualPayroll, getStateTaxType } from '@/utils/payroll-tax.utils';
import { formatUSD } from '@/utils/currency.utils';
import { USA_STATES_LIST } from '@/constants/usa-states';

import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Landmark, TrendingUp, TrendingDown } from 'lucide-react';

interface PayrollSummaryCardProps {
  entries: PayrollEntry[];
}

const FRECUENCIAS = [
  { value: '52', label: 'Semanal (52/año)' },
  { value: '26', label: 'Quincenal (26/año)' },
  { value: '24', label: 'Bimensual (24/año)' },
  { value: '12', label: 'Mensual (12/año)' },
];

const WORKER_TYPE_LABEL: Record<WorkerType, string> = {
  w2: 'Empleado (W-2)',
  '1099': 'Contratista (1099)',
};

export function PayrollSummaryCard({ entries }: PayrollSummaryCardProps) {
  const [filingStatus, setFilingStatus] = useState<FilingStatus>('soltero');
  const [paychecksPerYear, setPaychecksPerYear] = useState('26');

  if (entries.length === 0) {
    return (
      <Card className="p-6 rounded-3xl border-dashed border-border bg-card/40 text-center space-y-1">
        <Landmark className="w-6 h-6 text-primary mx-auto" />
        <p className="text-sm font-semibold text-foreground">Proyección de Impuestos</p>
        <p className="text-xs text-muted-foreground">
          Registra al menos un pago para ver tu proyección anual.
        </p>
      </Card>
    );
  }

  // Agrupamos por tipo de trabajador porque el cálculo de FICA vs.
  // impuesto de autoempleo es distinto entre W-2 y 1099.
  const grupos = Array.from(new Set(entries.map((e) => e.tipo_trabajador))) as WorkerType[];

  return (
    <Card className="p-5 sm:p-6 rounded-3xl border-border bg-card space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h3 className="font-bold text-sm text-foreground">Proyección de Impuestos</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Basado en {entries.length} pago{entries.length === 1 ? '' : 's'} registrado{entries.length === 1 ? '' : 's'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="space-y-0.5">
            <Label htmlFor="ps-estado-civil" className="text-[10px] text-muted-foreground">Declaras como</Label>
            <Select value={filingStatus} onValueChange={(val) => val && setFilingStatus(val as FilingStatus)}>
              <SelectTrigger id="ps-estado-civil" className="h-8 rounded-lg text-xs w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="soltero">Soltero(a)</SelectItem>
                <SelectItem value="casado_conjunto">Casado(a), conjunto</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-0.5">
            <Label htmlFor="ps-frecuencia" className="text-[10px] text-muted-foreground">Te pagan</Label>
            <Select value={paychecksPerYear} onValueChange={(val) => val && setPaychecksPerYear(val)}>
              <SelectTrigger id="ps-frecuencia" className="h-8 rounded-lg text-xs w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {FRECUENCIAS.map((f) => (
                  <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {grupos.map((tipo) => {
          const grupoEntries = entries.filter((e) => e.tipo_trabajador === tipo);
          const estadoUsado = grupoEntries[0].estado_usa;
          const estadoInfo = USA_STATES_LIST.find((s) => s.code === estadoUsado);

          const ytdGross = grupoEntries.reduce((sum, e) => sum + e.monto_bruto, 0);
          const ytdActualFederalWithheld = grupoEntries.reduce((sum, e) => sum + (e.retencion_federal_real ?? 0), 0);
          const ytdActualStateWithheld = grupoEntries.reduce((sum, e) => sum + (e.retencion_estatal_real ?? 0), 0);

          const proj = projectAnnualPayroll({
            ytdGross,
            entriesCount: grupoEntries.length,
            paychecksPerYear: parseInt(paychecksPerYear, 10),
            filingStatus,
            workerType: tipo,
            estadoCode: estadoUsado,
            ytdActualFederalWithheld,
            ytdActualStateWithheld,
          });

          const stateTaxType = getStateTaxType(estadoUsado);
          const hayRetencionReal = ytdActualFederalWithheld > 0 || ytdActualStateWithheld > 0;

          return (
            <div key={tipo} className="rounded-2xl border border-border p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground">{WORKER_TYPE_LABEL[tipo]}</span>
                <span className="text-[10px] text-muted-foreground">{estadoInfo?.name ?? estadoUsado}</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-0.5">
                  <p className="text-[10px] text-muted-foreground">Ingreso anualizado (proyectado)</p>
                  <p className="text-sm font-bold text-foreground tabular">{formatUSD(proj.annualizedGross)}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] text-muted-foreground">
                    {tipo === 'w2' ? 'FICA anual estimado' : 'Impuesto autoempleo estimado'}
                  </p>
                  <p className="text-sm font-bold text-foreground tabular">{formatUSD(proj.estimatedAnnualFica)}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] text-muted-foreground">Federal estimado (anual)</p>
                  <p className="text-sm font-bold text-foreground tabular">{formatUSD(proj.estimatedAnnualFederalTax)}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] text-muted-foreground">Estatal estimado (anual)</p>
                  <p className="text-sm font-bold text-foreground tabular">
                    {proj.estimatedAnnualStateTax === null ? (
                      <span className="text-muted-foreground font-normal text-xs">No disponible</span>
                    ) : (
                      formatUSD(proj.estimatedAnnualStateTax)
                    )}
                  </p>
                </div>
              </div>

              {stateTaxType === 'progresivo' && (
                <p className="text-[10px] text-muted-foreground italic">
                  {estadoInfo?.name ?? estadoUsado} tiene tramos progresivos que esta versión aún no calcula — el
                  total no incluye impuesto estatal.
                </p>
              )}

              {hayRetencionReal && proj.projectedDifference !== null && (
                <div
                  className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 ${
                    proj.projectedDifference >= 0 ? 'bg-success/10' : 'bg-destructive/10'
                  }`}
                >
                  {proj.projectedDifference >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-success shrink-0" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-destructive shrink-0" />
                  )}
                  <p className="text-xs text-foreground">
                    Si sigues así, vas hacia un{' '}
                    <strong>{proj.projectedDifference >= 0 ? 'posible reembolso' : 'posible saldo a pagar'}</strong>{' '}
                    de ≈ {formatUSD(Math.abs(proj.projectedDifference))} al declarar.
                  </p>
                </div>
              )}

              {!hayRetencionReal && (
                <p className="text-[10px] text-muted-foreground">
                  Agrega la retención real de tu talón de pago para comparar contra lo estimado y proyectar reembolso/saldo.
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-start gap-2 rounded-2xl bg-warning/10 border border-warning/20 px-3.5 py-2.5">
        <AlertTriangle className="w-3.5 h-3.5 text-warning shrink-0 mt-0.5" />
        <p className="text-[10px] text-[oklch(0.42_0.09_75)] dark:text-[oklch(0.82_0.09_75)] leading-relaxed">
          Estimación <strong>educativa</strong>, no es asesoría fiscal ni sustituye una declaración real. Asume
          deducción estándar sin dependientes ni créditos, y en varios estados el impuesto estatal no se calcula
          (ver nota arriba). Verifica con el{' '}
          <span className="underline">estimador oficial del IRS</span> o un preparador de impuestos certificado
          antes de tomar decisiones con dinero real.
        </p>
      </div>
    </Card>
  );
}
