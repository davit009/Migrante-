'use client';

// ============================================================
// features/savings/components/InvestmentSimulatorCard.tsx
// Simulador de Inversión — compara el ahorro actual contra CETES y
// Bitcoin. Educativo/ilustrativo: NO es asesoría financiera.
// ============================================================

import { useInvestmentRates } from '../hooks/useInvestmentRates';
import { formatUSD } from '@/utils/currency.utils';
import { projectCompoundReturn, applyHistoricalChange } from '@/utils/investment.utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet, Landmark, Bitcoin, AlertTriangle } from 'lucide-react';

interface InvestmentSimulatorCardProps {
  amountUSD: number;
}

export function InvestmentSimulatorCard({ amountUSD }: InvestmentSimulatorCardProps) {
  const { cetes, bitcoin, isLoading } = useInvestmentRates();

  if (amountUSD <= 0) {
    return (
      <Card className="p-6 rounded-3xl border-dashed border-border bg-card/40 text-center space-y-1">
        <Landmark className="w-6 h-6 text-primary mx-auto" />
        <p className="text-sm font-semibold text-foreground">Simulador de Inversión</p>
        <p className="text-xs text-muted-foreground">
          Registra ahorro para ver en qué podría estar rindiendo.
        </p>
      </Card>
    );
  }

  if (isLoading || !cetes || !bitcoin) {
    return (
      <Card className="p-5 rounded-3xl border-border bg-card space-y-3">
        <div className="h-4 w-40 rounded bg-muted animate-pulse" />
        <div className="h-16 rounded-2xl bg-muted animate-pulse" />
        <div className="h-16 rounded-2xl bg-muted animate-pulse" />
      </Card>
    );
  }

  const cetesProjection = projectCompoundReturn(amountUSD, cetes.tasaAnual, 12);
  const btcProjection =
    bitcoin.variacion1AnioPct !== null
      ? applyHistoricalChange(amountUSD, bitcoin.variacion1AnioPct)
      : null;

  const rows = [
    {
      label: 'Tu ahorro (sin mover)',
      hint: 'Valor de referencia',
      icon: Wallet,
      color: 'text-foreground',
      bg: 'bg-muted',
      value: formatUSD(amountUSD),
      note: null as string | null,
    },
    {
      label: 'CETES a 28 días',
      hint: `${(cetes.tasaAnual * 100).toFixed(2)}% anual`,
      icon: Landmark,
      color: 'text-success',
      bg: 'bg-success/10',
      value: formatUSD(cetesProjection),
      note: 'Proyectado a 12 meses reinvirtiendo',
    },
    {
      label: 'Bitcoin',
      hint: formatUSD(bitcoin.precioUSD),
      icon: Bitcoin,
      color: 'text-warning',
      bg: 'bg-warning/10',
      value: btcProjection !== null ? formatUSD(btcProjection) : '—',
      note:
        btcProjection !== null
          ? `Si lo hubieras convertido hace 1 año (${bitcoin.variacion1AnioPct! >= 0 ? '+' : ''}${(bitcoin.variacion1AnioPct! * 100).toFixed(1)}%)`
          : 'Variación histórica no disponible',
    },
  ];

  return (
    <Card className="p-5 sm:p-6 rounded-3xl border-border bg-card space-y-4">
      <div>
        <h3 className="font-bold text-sm text-foreground">Simulador de Inversión</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Así se compara tu ahorro actual ({formatUSD(amountUSD)}) frente a otras opciones.
        </p>
      </div>

      <div className="space-y-2.5">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${row.bg}`}>
                <row.icon className={`w-4 h-4 ${row.color}`} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">{row.label}</p>
                <p className="text-[10px] text-muted-foreground truncate">{row.hint}</p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs font-bold text-foreground tabular">{row.value}</p>
              {row.note && <p className="text-[10px] text-muted-foreground max-w-32">{row.note}</p>}
            </div>
          </div>
        ))}
      </div>

      {(!cetes.esEnVivo || !bitcoin.esEnVivo) && (
        <Badge variant="outline" className="text-[10px] rounded-lg">
          {!cetes.esEnVivo && !bitcoin.esEnVivo
            ? 'Ambas tasas son de referencia, no en vivo'
            : !cetes.esEnVivo
              ? 'Tasa de CETES de referencia, no en vivo'
              : 'Precio de Bitcoin de referencia, no en vivo'}
        </Badge>
      )}

      <div className="flex items-start gap-2 rounded-2xl bg-warning/10 border border-warning/20 px-3.5 py-2.5">
        <AlertTriangle className="w-3.5 h-3.5 text-warning shrink-0 mt-0.5" />
        <p className="text-[10px] text-[oklch(0.42_0.09_75)] dark:text-[oklch(0.82_0.09_75)] leading-relaxed">
          Simulación <strong>educativa</strong>, no es asesoría de inversión. CETES es de renta fija del Gobierno de
          México, sujeto a cambio en cada subasta. Bitcoin es altamente volátil — su desempeño pasado no garantiza
          resultados futuros.
        </p>
      </div>
    </Card>
  );
}
