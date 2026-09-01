'use client';

// ============================================================
// features/savings/components/SuggestedSavingsCard.tsx
// Plan de Ahorro Sugerido — distribuye los ingresos con la regla 50/30/20
// ============================================================

import { formatUSD, formatMXN } from '@/utils/currency.utils';
import { calculateSuggestedBudget } from '@/utils/budget.utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, Home, ShoppingBag, PiggyBank } from 'lucide-react';

interface SuggestedSavingsCardProps {
  incomeUSD: number;
  rate: number;
  onRegisterSavings: () => void;
  isRegistering?: boolean;
  /** Texto del periodo que cubre `incomeUSD`, ej. "Agosto 2026" */
  periodLabel?: string;
}

export function SuggestedSavingsCard({
  incomeUSD,
  rate,
  onRegisterSavings,
  isRegistering,
  periodLabel,
}: SuggestedSavingsCardProps) {
  if (incomeUSD <= 0) {
    return (
      <Card className="p-6 rounded-3xl border-dashed border-border bg-card/40 text-center space-y-1">
        <Lightbulb className="w-6 h-6 text-primary mx-auto" />
        <p className="text-sm font-semibold text-foreground">Plan de Ahorro Sugerido</p>
        <p className="text-xs text-muted-foreground">
          {periodLabel
            ? `Sin ingresos registrados en ${periodLabel}.`
            : 'Registra tus ingresos para ver cómo distribuir tu sueldo.'}
        </p>
      </Card>
    );
  }

  const { necesidades, gastosPersonales, ahorro } = calculateSuggestedBudget(incomeUSD);

  const rows = [
    {
      label: 'Necesidades',
      hint: 'Renta, comida, servicios',
      pct: '50%',
      amount: necesidades,
      icon: Home,
      color: 'text-info',
      bg: 'bg-info/10',
    },
    {
      label: 'Gastos personales',
      hint: 'Ocio, ropa, extras',
      pct: '30%',
      amount: gastosPersonales,
      icon: ShoppingBag,
      color: 'text-warning',
      bg: 'bg-warning/10',
    },
    {
      label: 'Ahorro',
      hint: 'Ahorro o envío de dinero',
      pct: '20%',
      amount: ahorro,
      icon: PiggyBank,
      color: 'text-success',
      bg: 'bg-success/10',
    },
  ];

  return (
    <Card className="p-5 sm:p-6 rounded-3xl border-primary/20 bg-primary/5 space-y-4">
      <div className="flex items-start gap-2.5">
        <Lightbulb className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div>
          <h3 className="font-bold text-sm text-foreground">Plan de Ahorro Sugerido</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Distribución recomendada de tus ingresos{periodLabel ? ` de ${periodLabel}` : ' totales'} ({formatUSD(incomeUSD)}) con la regla 50/30/20.
          </p>
        </div>
      </div>

      <div className="space-y-2.5">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${row.bg}`}>
                <row.icon className={`w-4 h-4 ${row.color}`} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-foreground">
                  {row.label} <span className="text-muted-foreground font-normal">({row.pct})</span>
                </p>
                <p className="text-[10px] text-muted-foreground truncate">{row.hint}</p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs font-bold text-foreground tabular">{formatUSD(row.amount)}</p>
              <p className="text-[10px] text-muted-foreground tabular">≈ {formatMXN(row.amount * rate)}</p>
            </div>
          </div>
        ))}
      </div>

      <Button
        onClick={onRegisterSavings}
        disabled={isRegistering}
        variant="outline"
        className="w-full h-10 rounded-2xl text-xs font-semibold border-primary/30 text-primary hover:bg-primary/10"
      >
        {isRegistering ? 'Registrando...' : `Registrar ${formatUSD(ahorro)} como ahorro`}
      </Button>
    </Card>
  );
}
