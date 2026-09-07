// ============================================================
// components/reports/BudgetVsActualCard.tsx
// Compara el reparto 50/30/20 sugerido contra el gasto real del
// periodo, balde por balde. Usa los mismos colores de identidad
// que SuggestedSavingsCard (info/warning/success — ya establecidos
// en la app para Necesidades/Gastos personales/Ahorro), más una
// marca de "sobre lo sugerido" con ícono + texto, nunca solo color.
// ============================================================

import type { SuggestedBudget } from '@/utils/budget.utils';
import { Card } from '@/components/ui/card';
import { Home, ShoppingBag, PiggyBank, TriangleAlert } from 'lucide-react';

interface BudgetVsActualCardProps {
  suggested: SuggestedBudget;
  actual: SuggestedBudget;
  formatAmount: (amount: number) => string;
  periodLabel?: string;
}

const ROWS = [
  { key: 'necesidades' as const, label: 'Necesidades', icon: Home, color: 'var(--info)', text: 'text-info' },
  { key: 'gastosPersonales' as const, label: 'Gastos personales', icon: ShoppingBag, color: 'var(--warning)', text: 'text-warning' },
  { key: 'ahorro' as const, label: 'Ahorro', icon: PiggyBank, color: 'var(--success)', text: 'text-success' },
];

export function BudgetVsActualCard({ suggested, actual, formatAmount, periodLabel }: BudgetVsActualCardProps) {
  const totalSuggested = suggested.necesidades + suggested.gastosPersonales + suggested.ahorro;

  if (totalSuggested <= 0) {
    return (
      <Card className="p-6 rounded-3xl border-dashed border-border bg-card/40 text-center space-y-1">
        <p className="text-sm font-semibold text-foreground">Sugerido vs. lo que gastaste</p>
        <p className="text-xs text-muted-foreground">
          {periodLabel ? `Sin ingresos registrados en ${periodLabel}.` : 'Registra ingresos para ver esta comparación.'}
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-5 sm:p-6 rounded-3xl border-border bg-card space-y-5">
      <div>
        <h3 className="font-bold text-sm text-foreground">Sugerido vs. lo que gastaste</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Tu gasto real{periodLabel ? ` de ${periodLabel}` : ''} contra la regla 50/30/20. La línea marca la meta.
        </p>
      </div>

      <div className="space-y-4">
        {ROWS.map((row) => {
          const suggestedAmt = suggested[row.key];
          const actualAmt = actual[row.key];
          const max = Math.max(suggestedAmt, actualAmt, 1) * 1.15;
          const actualPct = Math.min(100, (actualAmt / max) * 100);
          const targetPct = Math.min(100, (suggestedAmt / max) * 100);
          const over = actualAmt > suggestedAmt * 1.02;

          return (
            <div key={row.key}>
              <div className="flex items-center justify-between text-xs mb-1.5 gap-2">
                <span className={`flex items-center gap-1.5 font-semibold text-foreground shrink-0`}>
                  <row.icon className={`w-3.5 h-3.5 ${row.text}`} /> {row.label}
                </span>
                <span className="tabular text-right">
                  <span className="font-bold text-foreground">{formatAmount(actualAmt)}</span>
                  <span className="text-muted-foreground font-normal"> / {formatAmount(suggestedAmt)} sugerido</span>
                </span>
              </div>
              <div className="relative h-3 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${actualPct}%`, backgroundColor: over ? 'var(--destructive)' : row.color }}
                />
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-foreground/50"
                  style={{ left: `${targetPct}%` }}
                  aria-hidden="true"
                />
              </div>
              {over && (
                <p className="flex items-center gap-1 text-[10px] text-destructive font-medium mt-1">
                  <TriangleAlert className="w-3 h-3" /> Superaste lo sugerido por {formatAmount(actualAmt - suggestedAmt)}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
