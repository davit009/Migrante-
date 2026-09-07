// ============================================================
// components/reports/PeriodTrendCard.tsx
// Compara totales del periodo actual contra el anterior (mes vs
// mes). La dirección "buena" depende de la fila (más ingreso es
// bueno, más gasto es malo) — nunca se marca solo con color: cada
// delta lleva ícono + texto (+12% / -8%).
// ============================================================

import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus, CalendarClock } from 'lucide-react';

interface TrendRow {
  label: string;
  current: number;
  previous: number;
  /** true si un valor más bajo es la señal positiva (ej. Gastos) */
  invert?: boolean;
}

interface PeriodTrendCardProps {
  rows: TrendRow[];
  formatAmount: (amount: number) => string;
  currentLabel: string;
  previousLabel: string;
}

export function PeriodTrendCard({ rows, formatAmount, currentLabel, previousLabel }: PeriodTrendCardProps) {
  const hasBaseline = rows.some((r) => r.previous !== 0);

  return (
    <Card className="p-5 sm:p-6 rounded-3xl border-border bg-card space-y-4">
      <div className="flex items-start gap-2.5">
        <CalendarClock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div>
          <h3 className="font-bold text-sm text-foreground">{currentLabel} vs. {previousLabel}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {hasBaseline ? 'Cómo te fue comparado con el periodo anterior.' : `Sin movimientos en ${previousLabel} para comparar todavía.`}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {rows.map((row) => {
          const diff = row.current - row.previous;
          const pct = row.previous !== 0 ? (diff / Math.abs(row.previous)) * 100 : null;
          const improved = row.invert ? diff < 0 : diff > 0;
          const flat = diff === 0 || pct === null;

          const Icon = flat ? Minus : improved ? TrendingUp : TrendingDown;
          const colorClass = flat ? 'text-muted-foreground' : improved ? 'text-success' : 'text-destructive';

          return (
            <div key={row.label} className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground">{row.label}</p>
                <p className="font-bold text-sm text-foreground tabular">{formatAmount(row.current)}</p>
              </div>
              <div className={`flex items-center gap-1 text-xs font-semibold shrink-0 ${colorClass}`}>
                <Icon className="w-3.5 h-3.5" />
                {pct === null ? 'nuevo' : `${diff > 0 ? '+' : ''}${pct.toFixed(0)}%`}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
