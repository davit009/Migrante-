'use client';

// ============================================================
// app/(dashboard)/savings/page.tsx
// Módulo de Control de Ahorros, Ingresos y Gastos
// ============================================================

import { useState } from 'react';
import { useSavings } from '@/features/savings/hooks/useSavings';
import { useSavingsGoals } from '@/features/savings/hooks/useSavingsGoals';
import { useExchangeRate } from '@/features/converter/hooks/useExchangeRate';
import { TransactionForm } from '@/features/savings/components/TransactionForm';
import { SuggestedSavingsCard } from '@/features/savings/components/SuggestedSavingsCard';
import { SavingsGoalsSection } from '@/features/savings/components/SavingsGoalsSection';
import { InvestmentSimulatorCard } from '@/features/savings/components/InvestmentSimulatorCard';
import { formatUSD, formatMXN } from '@/utils/currency.utils';
import { formatDateShort, getTodayISO, getMonthKey, formatMonthLabel } from '@/utils/date.utils';
import { calculateSuggestedBudget } from '@/utils/budget.utils';
import { getCategoryByValue } from '@/constants/categories';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MonthSelector } from '@/components/layout/MonthSelector';
import { PiggyBank, TrendingUp, TrendingDown, Trash2 } from 'lucide-react';

export default function SavingsPage() {
  const [selectedMonth, setSelectedMonth] = useState(getMonthKey());

  const { rate } = useExchangeRate();
  const {
    transactions,
    totalIngresosUSD,
    totalGastosUSD,
    balanceUSD,
    balanceMXN,
    addTransaction,
    deleteTransaction,
    isSubmitting,
    isLoading
  } = useSavings(selectedMonth);

  const {
    goals,
    isLoading: isGoalsLoading,
    createGoal,
    isCreating: isCreatingGoal,
    contribute,
    isContributing,
    deleteGoal,
  } = useSavingsGoals();

  const [filterType, setFilterType] = useState<'todos' | 'ingreso' | 'gasto'>('todos');
  const [isRegisteringSavings, setIsRegisteringSavings] = useState(false);

  const filteredTransactions = transactions.filter((t) => {
    if (filterType === 'todos') return true;
    return t.tipo === filterType;
  });

  const handleRegisterSuggestedSavings = async () => {
    const { ahorro } = calculateSuggestedBudget(totalIngresosUSD);
    if (ahorro <= 0) return;

    try {
      setIsRegisteringSavings(true);
      await addTransaction({
        tipo: 'gasto',
        categoria: 'ahorro',
        descripcion: 'Ahorro sugerido (regla 50/30/20)',
        monto: ahorro,
        moneda: 'USD',
        fecha: getTodayISO(),
      });
    } catch {
      // El hook useSavings ya muestra el toast de error
    } finally {
      setIsRegisteringSavings(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-2">
      {/* Header Módulo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
            <PiggyBank className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
            Control de Ahorros
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Administra tus ingresos y gastos para medir tu capacidad de ahorro mensual en USD y MXN.
          </p>
        </div>
        <MonthSelector monthKey={selectedMonth} onChange={setSelectedMonth} />
      </div>

      {/* Resumen de Ahorro / Balance */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Balance Neto */}
        <Card className="p-5 rounded-3xl border-primary/20 bg-primary/5 space-y-1">
          <span className="text-xs font-semibold text-primary">Ahorro Neto Estimado</span>
          <h3 className="text-3xl font-black text-foreground tabular">{formatUSD(balanceUSD)}</h3>
          <p className="text-xs font-medium text-muted-foreground tabular">
            ≈ {formatMXN(balanceMXN)}
          </p>
        </Card>

        {/* Ingresos */}
        <Card className="p-5 rounded-3xl border-border bg-card space-y-1">
          <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> Total Ingresos
          </span>
          <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 tabular">{formatUSD(totalIngresosUSD)}</h3>
          <p className="text-xs text-muted-foreground tabular">
            ≈ {formatMXN(totalIngresosUSD * (rate || 17.5))}
          </p>
        </Card>

        {/* Gastos */}
        <Card className="p-5 rounded-3xl border-border bg-card space-y-1">
          <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5 text-rose-500" /> Total Gastos
          </span>
          <h3 className="text-2xl font-bold text-rose-600 dark:text-rose-400 tabular">{formatUSD(totalGastosUSD)}</h3>
          <p className="text-xs text-muted-foreground tabular">
            ≈ {formatMXN(totalGastosUSD * (rate || 17.5))}
          </p>
        </Card>
      </div>

      {/* Plan de Ahorro Sugerido */}
      <SuggestedSavingsCard
        incomeUSD={totalIngresosUSD}
        rate={rate || 17.5}
        onRegisterSavings={handleRegisterSuggestedSavings}
        isRegistering={isRegisteringSavings}
        periodLabel={formatMonthLabel(selectedMonth)}
      />

      {/* Metas de Ahorro */}
      <SavingsGoalsSection
        goals={goals}
        isLoading={isGoalsLoading}
        onCreateGoal={createGoal}
        isCreating={isCreatingGoal}
        onContribute={(goal, amount) => contribute({ goal, amount })}
        isContributing={isContributing}
        onDelete={deleteGoal}
      />

      {/* Simulador de Inversión */}
      <InvestmentSimulatorCard amountUSD={balanceUSD} />

      {/* Formulario + Lista de Movimientos */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Columna Izquierda: Formulario (5 Cols) */}
        <div className="lg:col-span-5">
          <TransactionForm onSubmit={addTransaction} isSubmitting={isSubmitting} />
        </div>

        {/* Columna Derecha: Lista de Transacciones (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-foreground">Movimientos de {formatMonthLabel(selectedMonth)}</h3>

            {/* Filtros */}
            <div className="flex items-center gap-1 bg-muted p-1 rounded-xl">
              {(['todos', 'ingreso', 'gasto'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-lg capitalize transition-all ${
                    filterType === t
                      ? 'bg-card text-foreground shadow-sm font-semibold'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 rounded-2xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : filteredTransactions.length === 0 ? (
            <Card className="p-8 rounded-2xl border-dashed border-border bg-card/40 text-center text-xs text-muted-foreground">
              No hay movimientos en esta categoría. Registra uno en el formulario.
            </Card>
          ) : (
            <div className="space-y-2">
              {filteredTransactions.map((tx) => {
                const cat = getCategoryByValue(tx.categoria);
                const isIncome = tx.tipo === 'ingreso';

                return (
                  <Card key={tx.id} className="p-4 rounded-2xl border-border bg-card flex items-center justify-between gap-3 card-hover">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-2xl bg-muted flex items-center justify-center text-xl shrink-0">
                        {cat?.emoji ?? '📌'}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-foreground truncate">
                          {tx.descripcion || cat?.label || 'Movimiento'}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 rounded-md">
                            {cat?.label}
                          </Badge>
                          <span>{formatDateShort(tx.fecha)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <p
                          className={`font-bold text-sm tabular ${
                            isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                          }`}
                        >
                          {isIncome ? '+' : '-'}{formatUSD(tx.monto)}
                        </p>
                        <p className="text-[10px] text-muted-foreground tabular">
                          ≈ {formatMXN(tx.monto_mxn ?? tx.monto * (rate || 17.5))}
                        </p>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteTransaction(tx.id)}
                        className="w-8 h-8 rounded-xl text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
