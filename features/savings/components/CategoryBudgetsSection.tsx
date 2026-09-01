'use client';

// ============================================================
// features/savings/components/CategoryBudgetsSection.tsx
// Gastos por categoría del mes + límites de presupuesto opcionales
// ============================================================

import { useState } from 'react';
import type { Transaction, CategoryBudget } from '@/types/app.types';
import { groupExpensesByCategory } from '@/utils/category-spending.utils';
import { getCategoryByValue } from '@/constants/categories';
import { formatUSD } from '@/utils/currency.utils';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChartNoAxesColumnIncreasing, Pencil, X } from 'lucide-react';

interface CategoryBudgetsSectionProps {
  transactions: Transaction[];
  rate: number;
  budgets: CategoryBudget[];
  isLoadingBudgets: boolean;
  onSaveBudget: (categoria: string, limite: number) => Promise<unknown>;
  isSavingBudget: boolean;
}

export function CategoryBudgetsSection({
  transactions,
  rate,
  budgets,
  isLoadingBudgets,
  onSaveBudget,
  isSavingBudget,
}: CategoryBudgetsSectionProps) {
  const [editingCategoria, setEditingCategoria] = useState<string | null>(null);
  const [limitInput, setLimitInput] = useState('');

  const spending = groupExpensesByCategory(transactions, rate);

  if (!isLoadingBudgets && spending.length === 0) {
    return (
      <Card className="p-6 rounded-3xl border-dashed border-border bg-card/40 text-center space-y-1">
        <ChartNoAxesColumnIncreasing className="w-6 h-6 text-primary mx-auto" />
        <p className="text-sm font-semibold text-foreground">Gastos por Categoría</p>
        <p className="text-xs text-muted-foreground">
          Registra gastos este mes para ver en qué se va tu dinero.
        </p>
      </Card>
    );
  }

  const maxSpent = Math.max(...spending.map((s) => s.totalUSD), 1);

  const startEditing = (categoria: string, currentLimit?: number) => {
    setEditingCategoria(categoria);
    setLimitInput(currentLimit ? String(currentLimit) : '');
  };

  const handleSaveLimit = async (categoria: string) => {
    const limite = parseFloat(limitInput);
    if (isNaN(limite) || limite <= 0) return;
    await onSaveBudget(categoria, limite);
    setEditingCategoria(null);
    setLimitInput('');
  };

  return (
    <Card className="p-5 rounded-3xl border-border bg-card space-y-4">
      <div>
        <h3 className="font-bold text-base text-foreground flex items-center gap-2">
          <ChartNoAxesColumnIncreasing className="w-4 h-4 text-primary" /> Gastos por Categoría
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Define un límite mensual por categoría para recibir una alerta visual al acercarte.
        </p>
      </div>

      {isLoadingBudgets ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {spending.map(({ categoria, totalUSD }) => {
            const cat = getCategoryByValue(categoria);
            const budget = budgets.find((b) => b.categoria === categoria);
            const limiteUSD = budget
              ? budget.moneda === 'USD'
                ? budget.limite_mensual
                : budget.limite_mensual / rate
              : null;

            const pct = limiteUSD ? totalUSD / limiteUSD : totalUSD / maxSpent;
            const isOver = limiteUSD !== null && totalUSD >= limiteUSD;
            const isNear = limiteUSD !== null && !isOver && pct >= 0.7;

            const barColor = limiteUSD === null ? 'bg-primary/50' : isOver ? 'bg-rose-500' : isNear ? 'bg-amber-500' : 'bg-emerald-500';

            return (
              <div key={categoria} className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-foreground flex items-center gap-1.5 min-w-0 truncate">
                    <span>{cat?.emoji ?? '📌'}</span>
                    <span className="truncate">{cat?.label ?? categoria}</span>
                  </span>
                  <span className="text-xs font-bold text-foreground tabular shrink-0">
                    {formatUSD(totalUSD)}
                    {limiteUSD !== null && (
                      <span className="text-muted-foreground font-normal"> / {formatUSD(limiteUSD)}</span>
                    )}
                  </span>
                </div>

                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${barColor}`}
                    style={{ width: `${Math.min(100, Math.round(pct * 100))}%` }}
                  />
                </div>

                {editingCategoria === categoria ? (
                  <div className="flex items-center gap-2 pt-0.5">
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Límite mensual USD"
                      value={limitInput}
                      onChange={(e) => setLimitInput(e.target.value)}
                      className="h-8 rounded-lg text-xs flex-1"
                      autoFocus
                    />
                    <Button
                      type="button"
                      size="sm"
                      disabled={isSavingBudget}
                      onClick={() => handleSaveLimit(categoria)}
                      className="h-8 rounded-lg text-xs px-3"
                    >
                      OK
                    </Button>
                    <button
                      type="button"
                      onClick={() => setEditingCategoria(null)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground shrink-0"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => startEditing(categoria, budget?.moneda === 'USD' ? budget.limite_mensual : undefined)}
                    className="text-[10px] text-muted-foreground hover:text-primary flex items-center gap-1"
                  >
                    <Pencil className="w-2.5 h-2.5" />
                    {budget ? 'Editar límite' : 'Definir límite'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
