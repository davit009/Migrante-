'use client';

// ============================================================
// features/remittance/components/RemittanceComparator.tsx
// Comparador estimado de envío de dinero USD → MXN
// ============================================================

import { useState } from 'react';
import { useExchangeRate } from '@/features/converter/hooks/useExchangeRate';
import { estimateRemittanceOptions } from '@/utils/remittance.utils';
import { formatUSD, formatMXN, formatRate } from '@/utils/currency.utils';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Sparkles, Clock, MapPin } from 'lucide-react';

export function RemittanceComparator() {
  const { rate, isLoading } = useExchangeRate();
  const [amount, setAmount] = useState('300');

  const numericAmount = parseFloat(amount) || 0;
  const results = estimateRemittanceOptions(numericAmount, rate || 17.5);

  return (
    <div className="space-y-5">
      {/* Input de monto */}
      <div className="glass rounded-3xl p-5 space-y-2">
        <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
          Monto a enviar
        </span>
        <div className="flex items-center gap-3">
          <span className="text-2xl font-black text-muted-foreground">$</span>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="text-3xl font-black border-none shadow-none focus-visible:ring-0 p-0 h-auto bg-transparent finance-number tracking-tight"
            style={{ fontSize: 'clamp(1.5rem, 6vw, 2rem)' }}
          />
          <span className="text-base font-semibold text-muted-foreground shrink-0">USD</span>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-2 rounded-2xl bg-warning/10 border border-warning/20 px-4 py-3">
        <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
        <p className="text-[11px] text-[oklch(0.42_0.09_75)] dark:text-[oklch(0.82_0.09_75)] leading-relaxed">
          Valores <strong>estimados de referencia</strong>, no cotizaciones en vivo. Las comisiones y tasas reales
          varían según el monto, destino y promociones vigentes — confirma siempre en la app o sitio oficial del
          proveedor antes de enviar dinero.
        </p>
      </div>

      {/* Resultados */}
      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-2xl glass animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-2.5">
          {results.map((result, index) => {
            const isBest = index === 0;
            return (
              <div
                key={result.provider.id}
                className={`rounded-2xl p-4 space-y-2.5 glass-hover ${
                  isBest ? 'glass-strong ring-1 ring-primary/40' : 'glass'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{result.provider.emoji}</span>
                    <span className="font-bold text-sm text-foreground">{result.provider.nombre}</span>
                  </div>
                  {isBest && (
                    <Badge className="rounded-full text-[10px] px-2 py-0.5 gap-1 gradient-primary border-0 text-white">
                      <Sparkles className="w-3 h-3" /> Mejor opción
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3" /> {result.provider.velocidad}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3" /> {result.provider.metodoEntrega}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-lg text-foreground finance-number">
                      {formatMXN(result.montoRecibidoMXN)}
                    </p>
                    <p className="text-[10px] text-muted-foreground finance-number">
                      Comisión {formatUSD(result.comision)} · 1 USD = {formatRate(result.tasaEfectiva)} MXN
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
