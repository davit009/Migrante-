'use client';

// ============================================================
// features/calculator/components/CalculatorSummary.tsx
// Resumen desglosado de la compra — Liquid Glass (MXN Plegable)
// ============================================================

import { useState } from 'react';
import { formatUSD, formatMXN, formatRate } from '@/utils/currency.utils';
import { formatTaxRate } from '@/utils/tax.utils';
import { ChevronDown, ChevronUp } from 'lucide-react';

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
  const [showMXN, setShowMXN] = useState(false);

  return (
    <div className="glass rounded-3xl p-5 sm:p-6 space-y-4">
      <h3 className="font-bold text-sm text-foreground">Desglose de la Compra</h3>

      <div className="space-y-2.5 text-xs">
        {/* Subtotal */}
        <div className="flex justify-between items-center text-muted-foreground">
          <span>Subtotal</span>
          <span className="font-semibold text-foreground finance-number">{formatUSD(subtotal)}</span>
        </div>

        {/* Impuesto por Estado */}
        <div className="flex justify-between items-center text-muted-foreground">
          <span>
            Sales Tax ({stateName} {formatTaxRate(taxRate)})
          </span>
          <span className="font-semibold text-foreground finance-number">+{formatUSD(taxAmount)}</span>
        </div>

        <div className="h-px bg-border/50 my-1" />

        {/* Total USD */}
        <div className="flex justify-between items-center pt-0.5">
          <span className="font-bold text-sm text-foreground">Total USD</span>
          <span className="font-black text-xl text-foreground finance-number">{formatUSD(totalUSD)}</span>
        </div>

        {/* Botón para desplegar equivalencia en pesos */}
        <button
          type="button"
          onClick={() => setShowMXN(!showMXN)}
          className="w-full flex items-center justify-between text-xs font-semibold text-primary glass rounded-2xl px-4 py-2.5 mt-2 transition-all btn-xs"
        >
          <span className="flex items-center gap-1.5">
            <span>🇲🇽</span>
            <span>Ver equivalente en pesos (MXN)</span>
          </span>
          {showMXN ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {/* Total equivalente MXN (Plegable) */}
        {showMXN && (
          <div
            className="rounded-2xl p-4 flex items-center justify-between mt-2 enter-up"
            style={{
              background: 'linear-gradient(135deg, rgb(var(--blob-1) / 0.25), rgb(var(--blob-2) / 0.15))',
              border: '1px solid var(--glass-border)',
            }}
          >
            <div>
              <span className="text-[11px] font-bold text-primary block">Equivalente en Pesos</span>
              <span className="text-[10px] text-muted-foreground">Tasa: 1 USD = {formatRate(exchangeRate)} MXN</span>
            </div>
            <span className="font-black text-xl text-primary finance-number">{formatMXN(totalMXN)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
