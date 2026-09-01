'use client';

// ============================================================
// features/converter/components/QuickConvertCard.tsx
// Conversor minimalista para acceso rápido — sin extras, con
// impuesto opcional de un tap. Pensado para /rapido.
// ============================================================

import { useEffect, useState } from 'react';
import { useExchangeRate } from '../hooks/useExchangeRate';
import { formatCurrency, formatRate } from '@/utils/currency.utils';
import { calculateSalesTax, formatTaxRate } from '@/utils/tax.utils';
import { StateSelectorUsa } from '@/features/calculator/components/StateSelectorUsa';
import { ArrowLeftRight, RefreshCw, Plus, Minus } from 'lucide-react';

const STATE_STORAGE_KEY = 'migrante_quick_state';

export function QuickConvertCard() {
  const { rate, isLoading, refetch, isFetching } = useExchangeRate();

  const [amount, setAmount] = useState('100');
  const [direction, setDirection] = useState<'USD_TO_MXN' | 'MXN_TO_USD'>('USD_TO_MXN');
  const [showTax, setShowTax] = useState(false);
  const [selectedState, setSelectedState] = useState('TX');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STATE_STORAGE_KEY);
      if (saved) setSelectedState(saved);
    } catch {
      // localStorage puede fallar en modo privado; no es crítico
    }
  }, []);

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    try {
      localStorage.setItem(STATE_STORAGE_KEY, state);
    } catch {
      // no-op
    }
  };

  const numericAmount = parseFloat(amount) || 0;
  const convertedAmount =
    direction === 'USD_TO_MXN'
      ? numericAmount * rate
      : rate > 0
        ? numericAmount / rate
        : 0;

  // El impuesto de venta aplica sobre el lado en USD de la conversión
  const usdAmount = direction === 'USD_TO_MXN' ? numericAmount : convertedAmount;
  const taxInfo = calculateSalesTax(usdAmount, selectedState);
  const totalConMxn = taxInfo.total * rate;

  const handleSwap = () => setDirection((prev) => (prev === 'USD_TO_MXN' ? 'MXN_TO_USD' : 'USD_TO_MXN'));

  return (
    <div className="glass rounded-3xl p-5 sm:p-6 w-full space-y-4">
      {/* Tasa */}
      <button
        onClick={() => refetch()}
        disabled={isFetching}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 mx-auto btn-xs"
      >
        <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
        {isFetching ? 'Actualizando' : `1 USD = ${formatRate(rate)} MXN`}
      </button>

      {/* Monto origen */}
      <div className="glass rounded-2xl p-4 space-y-1">
        <div className="flex items-center justify-between text-[11px] text-muted-foreground font-medium">
          <span>Monto</span>
          <span className="text-foreground font-semibold">
            {direction === 'USD_TO_MXN' ? '🇺🇸 USD' : '🇲🇽 MXN'}
          </span>
        </div>
        <input
          type="number"
          inputMode="decimal"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          autoFocus
          className="w-full bg-transparent border-none outline-none font-black finance-number tracking-tight text-foreground"
          style={{ fontSize: 'clamp(1.75rem, 8vw, 2.5rem)' }}
        />
      </div>

      {/* Swap */}
      <div className="flex justify-center -my-2 relative z-10">
        <button
          type="button"
          onClick={handleSwap}
          className="w-10 h-10 rounded-full glass flex items-center justify-center text-primary hover:scale-105 active:scale-95 transition-transform duration-200 btn-xs"
          aria-label="Invertir dirección"
        >
          <ArrowLeftRight className="w-4 h-4" />
        </button>
      </div>

      {/* Equivalente */}
      <div
        className="rounded-2xl p-4 space-y-1"
        style={{
          background: 'linear-gradient(135deg, rgb(var(--blob-1) / 0.25), rgb(var(--blob-2) / 0.15))',
          border: '1px solid var(--glass-border)',
          backdropFilter: 'blur(var(--glass-blur))',
        }}
      >
        <div className="flex items-center justify-between text-[11px] text-primary/70 font-medium">
          <span>Equivalente</span>
          <span className="font-semibold text-primary">
            {direction === 'USD_TO_MXN' ? '🇲🇽 MXN' : '🇺🇸 USD'}
          </span>
        </div>
        <span
          className="block font-black text-foreground finance-number"
          style={{ fontSize: 'clamp(1.75rem, 8vw, 2.5rem)' }}
        >
          {isLoading ? (
            <span className="text-muted-foreground animate-pulse text-2xl">Cargando...</span>
          ) : (
            formatCurrency(convertedAmount, direction === 'USD_TO_MXN' ? 'MXN' : 'USD')
          )}
        </span>
      </div>

      {/* Toggle de impuesto */}
      <button
        type="button"
        onClick={() => setShowTax((v) => !v)}
        className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-primary py-1 btn-xs"
      >
        {showTax ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
        {showTax ? 'Quitar impuesto' : 'Agregar impuesto (Sales Tax)'}
      </button>

      {showTax && (
        <div className="space-y-3 enter-up">
          <StateSelectorUsa selectedState={selectedState} onStateChange={handleStateChange} />

          <div className="glass rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Subtotal ({taxInfo.estado_name})</span>
              <span className="font-semibold text-foreground finance-number">{formatCurrency(usdAmount, 'USD')}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Impuesto ({formatTaxRate(taxInfo.tasa)})</span>
              <span className="font-semibold text-foreground finance-number">+{formatCurrency(taxInfo.impuesto, 'USD')}</span>
            </div>
            <div className="h-px bg-border/50" />
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-foreground">Total con impuesto</span>
              <div className="text-right">
                <span className="block font-black text-lg text-foreground finance-number">
                  {formatCurrency(taxInfo.total, 'USD')}
                </span>
                <span className="block text-[11px] text-muted-foreground finance-number">
                  ≈ {formatCurrency(totalConMxn, 'MXN')}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
