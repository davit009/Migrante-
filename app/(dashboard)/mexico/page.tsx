'use client';

// ============================================================
// app/(dashboard)/mexico/page.tsx
// Modo México — ledger de ingresos y gastos en pesos, sin
// conversión ni tipo de cambio. Separado del de Ahorros (EE.UU.).
// ============================================================

import { useState } from 'react';
import { useMxTransactions } from '@/features/mexico/hooks/useMxTransactions';
import { MxTransactionForm } from '@/features/mexico/components/MxTransactionForm';
import { CategorySpendingBars } from '@/components/charts/CategorySpendingBars';
import { BudgetVsActualCard } from '@/components/reports/BudgetVsActualCard';
import { PeriodTrendCard } from '@/components/reports/PeriodTrendCard';
import { formatMXN } from '@/utils/currency.utils';
import { formatDateShort, getMonthKey, formatMonthLabel, shiftMonthKey } from '@/utils/date.utils';
import { groupMxExpensesByCategory } from '@/utils/category-spending.utils';
import { calculateSuggestedBudget, classifyActualSpendingMx } from '@/utils/budget.utils';
import { getCategoryByValue } from '@/constants/categories';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MonthSelector } from '@/components/layout/MonthSelector';
import { Wallet, TrendingUp, TrendingDown, Trash2, ChartNoAxesColumnIncreasing } from 'lucide-react';

export default function MexicoPage() {
  const [selectedMonth, setSelectedMonth] = useState(getMonthKey());
  const [filterType, setFilterType] = useState<'todos' | 'ingreso' | 'gasto'>('todos');

  const {
    transactions,
    allTransactions,
    totalIngresos,
    totalGastos,
    balance,
    addTransaction,
    deleteTransaction,
    isSubmitting,
    isLoading,
  } = useMxTransactions(selectedMonth);

  const previousMonth = shiftMonthKey(selectedMonth, -1);
  const previousTransactions = allTransactions.filter((t) => t.fecha.startsWith(previousMonth));
  const previousIngresos = previousTransactions
    .filter((t) => t.tipo === 'ingreso')
    .reduce((sum, t) => sum + t.monto, 0);
  const previousGastos = previousTransactions
    .filter((t) => t.tipo === 'gasto')
    .reduce((sum, t) => sum + t.monto, 0);

  const filteredTransactions = transactions.filter((t) => {
    if (filterType === 'todos') return true;
    return t.tipo === filterType;
  });

  const categorySpending = groupMxExpensesByCategory(transactions);
  const suggestedBudget = calculateSuggestedBudget(totalIngresos);
  const actualSpending = classifyActualSpendingMx(transactions);

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
            <Wallet className="w-7 h-7 text-success" />
            Modo México
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Tus ingresos y gastos en pesos, sin conversión — un libro aparte de tu control de Ahorros en EE.UU.
          </p>
        </div>
        <MonthSelector monthKey={selectedMonth} onChange={setSelectedMonth} />
      </div>

      {/* Balance */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 rounded-3xl border-primary/20 bg-primary/5 space-y-1">
          <span className="text-xs font-semibold text-primary">Balance del Mes</span>
          <h3 className="text-3xl font-black text-foreground tabular">{formatMXN(balance)}</h3>
        </Card>

        <Card className="p-5 rounded-3xl border-border bg-card space-y-1">
          <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-success" /> Total Ingresos
          </span>
          <h3 className="text-2xl font-bold text-success tabular">{formatMXN(totalIngresos)}</h3>
        </Card>

        <Card className="p-5 rounded-3xl border-border bg-card space-y-1">
          <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5 text-destructive" /> Total Gastos
          </span>
          <h3 className="text-2xl font-bold text-destructive tabular">{formatMXN(totalGastos)}</h3>
        </Card>
      </div>

      <Tabs defaultValue="movimientos" className="space-y-6">
        <TabsList className="grid grid-cols-2 w-full max-w-sm h-11 rounded-2xl bg-muted p-1">
          <TabsTrigger value="movimientos" className="rounded-xl font-semibold text-xs sm:text-sm">
            Movimientos
          </TabsTrigger>
          <TabsTrigger value="resumen" className="rounded-xl font-semibold text-xs sm:text-sm">
            Resumen
          </TabsTrigger>
        </TabsList>

        {/* Movimientos: lo esencial, visible siempre */}
        <TabsContent value="movimientos" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5">
              <MxTransactionForm onSubmit={addTransaction} isSubmitting={isSubmitting} />
            </div>

            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-foreground">{formatMonthLabel(selectedMonth)}</h3>

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
                          <p className={`font-bold text-sm tabular ${isIncome ? 'text-success' : 'text-destructive'}`}>
                            {isIncome ? '+' : '-'}{formatMXN(tx.monto)}
                          </p>

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
        </TabsContent>

        {/* Resumen: reporte del periodo — sugerido vs real, tendencia y categorías */}
        <TabsContent value="resumen" className="space-y-6">
          <BudgetVsActualCard
            suggested={suggestedBudget}
            actual={actualSpending}
            formatAmount={formatMXN}
            periodLabel={formatMonthLabel(selectedMonth)}
          />

          <PeriodTrendCard
            currentLabel={formatMonthLabel(selectedMonth)}
            previousLabel={formatMonthLabel(previousMonth)}
            formatAmount={formatMXN}
            rows={[
              { label: 'Ingresos', current: totalIngresos, previous: previousIngresos },
              { label: 'Gastos', current: totalGastos, previous: previousGastos, invert: true },
              { label: 'Balance', current: balance, previous: previousIngresos - previousGastos },
            ]}
          />

          {categorySpending.length > 0 && (
            <Card className="p-5 rounded-3xl border-border bg-card space-y-4">
              <div>
                <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <ChartNoAxesColumnIncreasing className="w-4 h-4 text-primary" /> Gastos por Categoría
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  En qué se te fue el dinero este mes, de mayor a menor.
                </p>
              </div>
              <CategorySpendingBars
                items={categorySpending.map((c) => ({ categoria: c.categoria, amount: c.totalMXN }))}
                formatAmount={formatMXN}
              />
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
