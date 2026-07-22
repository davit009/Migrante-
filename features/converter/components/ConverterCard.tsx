'use client';

// ============================================================
// features/converter/components/ConverterCard.tsx
// Conversor de Divisas — Liquid Glass Mobile-First
// ============================================================

import { useState } from 'react';
import { useExchangeRate } from '../hooks/useExchangeRate';
import { applyConversionMode, formatCurrency, formatRate } from '@/utils/currency.utils';
import type { ConversionMode } from '@/types/app.types';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useRouter } from 'next/navigation';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowLeftRight, RefreshCw, BookmarkPlus, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const MODES: { key: ConversionMode; label: string }[] = [
  { key: 'promedio', label: 'Interbancario' },
  { key: 'compra', label: 'Compra' },
  { key: 'venta', label: 'Venta' },
];

export function ConverterCard() {
  const { rate: baseRate, isLoading, refetch, isFetching } = useExchangeRate();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const [amount, setAmount] = useState<string>('100');
  const [direction, setDirection] = useState<'USD_TO_MXN' | 'MXN_TO_USD'>('USD_TO_MXN');
  const [mode, setMode] = useState<ConversionMode>('promedio');

  const effectiveRate = applyConversionMode(baseRate, mode);
  const numericAmount = parseFloat(amount) || 0;
  const convertedAmount =
    direction === 'USD_TO_MXN'
      ? numericAmount * effectiveRate
      : effectiveRate > 0
      ? numericAmount / effectiveRate
      : 0;

  const handleSwap = () => {
    setDirection((prev) => (prev === 'USD_TO_MXN' ? 'MXN_TO_USD' : 'USD_TO_MXN'));
  };

  const handleSaveCalculation = () => {
    if (!isAuthenticated) {
      toast.info('Crea tu cuenta para guardar tus cálculos.', {
        action: {
          label: 'Registrarse',
          onClick: () => router.push('/register'),
        },
      });
      return;
    }
    toast.success('Conversión guardada en tus registros');
    router.push('/history');
  };

  return (
    <div className="glass rounded-3xl p-5 sm:p-6 w-full space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-foreground">USD ↔ MXN</span>
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            En vivo
          </span>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 btn-xs py-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
          {isFetching ? 'Actualizando' : formatRate(effectiveRate)}
        </button>
      </div>

      {/* Selector de Modo */}
      <div className="grid grid-cols-3 gap-1 p-1 rounded-2xl glass">
        {MODES.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setMode(key)}
            className={`py-2 text-xs font-medium rounded-xl transition-all duration-200 btn-xs ${
              mode === key
                ? 'glass-strong text-foreground font-semibold shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Inputs de Conversión */}
      <div className="space-y-2">
        {/* Moneda Origen */}
        <div className="glass rounded-2xl p-4 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground font-medium">
            <span>Monto a convertir</span>
            <span className="text-foreground font-semibold">
              {direction === 'USD_TO_MXN' ? '🇺🇸 USD' : '🇲🇽 MXN'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="text-3xl font-black border-none shadow-none focus-visible:ring-0 p-0 h-auto bg-transparent finance-number tracking-tight"
              style={{ fontSize: 'clamp(1.5rem, 6vw, 2rem)' }}
            />
            <span className="text-base font-semibold text-muted-foreground shrink-0">
              {direction === 'USD_TO_MXN' ? 'USD' : 'MXN'}
            </span>
          </div>
        </div>

        {/* Botón Swap */}
        <div className="flex justify-center -my-1 relative z-10">
          <button
            type="button"
            onClick={handleSwap}
            className="w-10 h-10 rounded-full glass flex items-center justify-center text-primary hover:scale-105 active:scale-95 transition-transform duration-200 btn-xs"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>
        </div>

        {/* Moneda Destino */}
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
          <div className="flex items-center justify-between">
            <span
              className="font-black text-foreground finance-number"
              style={{ fontSize: 'clamp(1.75rem, 7vw, 2.25rem)' }}
            >
              {isLoading ? (
                <span className="text-muted-foreground animate-pulse text-2xl">Cargando...</span>
              ) : (
                formatCurrency(convertedAmount, direction === 'USD_TO_MXN' ? 'MXN' : 'USD')
              )}
            </span>
            <span className="text-sm font-semibold text-primary/60">
              {direction === 'USD_TO_MXN' ? 'MXN' : 'USD'}
            </span>
          </div>
        </div>
      </div>

      {/* Info de Tasa */}
      <div className="glass rounded-2xl px-4 py-3 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Tasa aplicada</span>
        <span className="font-semibold text-foreground finance-number">
          1 USD = {formatRate(effectiveRate)} MXN
        </span>
      </div>

      {/* Acción */}
      <div className="space-y-3">
        <Button
          onClick={handleSaveCalculation}
          className="w-full h-12 rounded-2xl text-sm font-semibold gradient-primary border-0 flex items-center justify-center gap-2 shadow-none active:scale-[0.98] transition-transform"
        >
          <BookmarkPlus className="w-4 h-4" />
          Guardar cálculo
        </Button>

        {!isAuthenticated && (
          <p className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
            <Sparkles className="w-3 h-3 text-primary" />
            Herramienta 100% gratuita
          </p>
        )}
      </div>
    </div>
  );
}
