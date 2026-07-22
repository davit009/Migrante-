'use client';

// ============================================================
// features/calculator/components/CalculatorSummary.tsx
// Resumen desglosado de la compra (Subtotal, Impuesto, Total USD y MXN)
// ============================================================

import { formatUSD, formatMXN, formatRate } from '@/utils/currency.utils';
import { formatTaxRate } from '@/utils/tax.utils';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface CalculatorSummaryProps {
  subtotal: number;
  taxAmount: number;
  taxRate: number;
  totalUSD: number;
  exchangeRate: number;
  totalMXN: number;
  stateName: string;
}

export function CalculatorSummary({
  subtotal,
  taxAmount,
  taxRate,
  totalUSD,
  exchangeRate,
  totalMXN,
  stateName,
}: CalculatorSummaryProps) {
  return (
    <Card className="p-6 rounded-3xl border-border bg-card space-y-4 shadow-sm">
      <h3 className="font-bold text-base text-foreground">Desglose de la Compra</h3>

      <div className="space-y-2.5 text-sm">
        {/* Subtotal */}
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Subtotal (sin impuesto)</span>
          <span className="font-semibold text-foreground tabular">{formatUSD(subtotal)}</span>
        </div>

        {/* Impuesto por Estado */}
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">
            Impuesto {stateName} ({formatTaxRate(taxRate)})
          </span>
          <span className="font-semibold text-foreground tabular">+{formatUSD(taxAmount)}</span>
        </div>

        <Separator />

        {/* Total USD */}
        <div className="flex justify-between items-center pt-1">
          <span className="font-bold text-base text-foreground">Total USD</span>
          <span className="font-extrabold text-xl text-foreground tabular">{formatUSD(totalUSD)}</span>
        </div>

        {/* Total equivalente MXN */}
        <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-between mt-2">
          <div>
            <span className="text-xs font-semibold text-primary block">Equivalente a Pesos</span>
            <span className="text-[11px] text-muted-foreground">Tasa: 1 USD = {formatRate(exchangeRate)} MXN</span>
          </div>
          <span className="font-black text-2xl text-primary tabular">{formatMXN(totalMXN)}</span>
        </div>
      </div>
    </Card>
  );
}
