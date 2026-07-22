'use client';

// ============================================================
// features/converter/components/ConverterCard.tsx
// Componente UI principal del Conversor de Divisas (USD ↔ MXN)
// Estética: Modern Bank / Apple / Fintech Enterprise
// ============================================================

import { useState } from 'react';
import { useExchangeRate } from '../hooks/useExchangeRate';
import { applyConversionMode, formatCurrency, formatRate } from '@/utils/currency.utils';
import type { ConversionMode } from '@/types/app.types';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useRouter } from 'next/navigation';

import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeftRight, RefreshCw, BookmarkPlus, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export function ConverterCard() {
  const { rate: baseRate, isLoading, refetch, isFetching } = useExchangeRate();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const [amount, setAmount] = useState<string>('100');
  const [direction, setDirection] = useState<'USD_TO_MXN' | 'MXN_TO_USD'>('USD_TO_MXN');
  const [mode, setMode] = useState<ConversionMode>('promedio');

  // Calcular tipo de cambio efectivo según el modo (compra / venta / promedio)
  const effectiveRate = applyConversionMode(baseRate, mode);

  // Calcular el resultado de la conversión
  const numericAmount = parseFloat(amount) || 0;
  const convertedAmount =
    direction === 'USD_TO_MXN'
      ? numericAmount * effectiveRate
      : effectiveRate > 0
      ? numericAmount / effectiveRate
      : 0;

  // Intercambiar dirección USD ↔ MXN
  const handleSwap = () => {
    setDirection((prev) => (prev === 'USD_TO_MXN' ? 'MXN_TO_USD' : 'USD_TO_MXN'));
  };

  // Guardar cálculo
  const handleSaveCalculation = () => {
    if (!isAuthenticated) {
      toast.info('Crea tu cuenta o inicia sesión para guardar tus movimientos y cálculos.', {
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
    <Card className="w-full max-w-lg mx-auto p-6 sm:p-8 rounded-3xl border-border bg-card shadow-sm space-y-6">
      {/* Header del Conversor */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="px-3 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary">
            USD ↔ MXN
          </Badge>
          <span className="text-xs text-muted-foreground">En tiempo real</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
          className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
        >
          <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isFetching ? 'animate-spin' : ''}`} />
          {isFetching ? 'Actualizando...' : 'Actualizar'}
        </Button>
      </div>

      {/* Selectores de Modo (Compra / Venta / Promedio) */}
      <div className="grid grid-cols-3 gap-1.5 p-1 bg-muted rounded-2xl">
        {(['promedio', 'compra', 'venta'] as ConversionMode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`py-2 text-xs font-medium rounded-xl capitalize transition-all ${
              mode === m
                ? 'bg-card text-foreground shadow-sm font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {m === 'promedio' ? 'Interbancario' : m}
          </button>
        ))}
      </div>

      {/* Inputs de Conversión */}
      <div className="space-y-3">
        {/* Moneda de Origen */}
        <div className="p-4 rounded-2xl border border-border bg-background/50 space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Tú envías / ingresas</span>
            <span className="font-semibold text-foreground">
              {direction === 'USD_TO_MXN' ? '🇺🇸 USD' : '🇲🇽 MXN'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="text-2xl font-bold border-none shadow-none focus-visible:ring-0 p-0 h-auto tabular"
            />
            <span className="text-lg font-semibold text-muted-foreground">
              {direction === 'USD_TO_MXN' ? 'USD' : 'MXN'}
            </span>
          </div>
        </div>

        {/* Botón de Swap */}
        <div className="flex justify-center -my-2 relative z-10">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleSwap}
            className="w-10 h-10 rounded-full border-border bg-card shadow-sm hover:scale-105 transition-transform"
          >
            <ArrowLeftRight className="w-4 h-4 text-primary" />
          </Button>
        </div>

        {/* Moneda de Destino */}
        <div className="p-4 rounded-2xl border border-primary/20 bg-primary/5 space-y-1">
          <div className="flex items-center justify-between text-xs text-primary/80 font-medium">
            <span>Equivalente aproximado</span>
            <span className="font-semibold text-primary">
              {direction === 'USD_TO_MXN' ? '🇲🇽 MXN' : '🇺🇸 USD'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-extrabold text-foreground tabular">
              {isLoading ? (
                <span className="text-muted-foreground animate-pulse text-2xl">Cargando...</span>
              ) : (
                formatCurrency(
                  convertedAmount,
                  direction === 'USD_TO_MXN' ? 'MXN' : 'USD'
                )
              )}
            </span>
            <span className="text-sm font-semibold text-muted-foreground">
              {direction === 'USD_TO_MXN' ? 'MXN' : 'USD'}
            </span>
          </div>
        </div>
      </div>

      {/* Detalle del Tipo de Cambio */}
      <div className="rounded-2xl bg-muted/60 p-4 space-y-2 text-xs">
        <div className="flex justify-between items-center text-muted-foreground">
          <span>Tipo de cambio aplicado:</span>
          <span className="font-semibold text-foreground tabular">
            1 USD = {formatRate(effectiveRate)} MXN
          </span>
        </div>
        {mode !== 'promedio' && (
          <div className="flex justify-between items-center text-muted-foreground text-[11px]">
            <span>Diferencial estimado ({mode}):</span>
            <span>{mode === 'compra' ? '-1.5%' : '+1.5%'}</span>
          </div>
        )}
      </div>

      {/* Acciones */}
      <div className="pt-2 space-y-3">
        <Button
          onClick={handleSaveCalculation}
          className="w-full h-12 rounded-2xl text-base font-semibold shadow-sm flex items-center justify-center gap-2"
        >
          <BookmarkPlus className="w-4 h-4" />
          Guardar Cálculo
        </Button>

        {!isAuthenticated && (
          <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground pt-1">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Herramienta 100% gratuita y libre de uso.</span>
          </div>
        )}
      </div>
    </Card>
  );
}
