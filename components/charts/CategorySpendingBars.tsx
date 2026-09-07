// ============================================================
// components/charts/CategorySpendingBars.tsx
// Gastos por categoría — barra horizontal por categoría, ranking
// de mayor a menor. Part-to-whole: barra horizontal en vez de dona
// (una dona con categorías de valor cercano es difícil de comparar
// a simple vista; la barra + etiqueta directa se lee de un vistazo).
//
// Color: paleta categórica fija de 8 tonos (--chart-1..8 en
// globals.css, validada CVD). El color sigue a la CATEGORÍA, nunca
// a su posición en el ranking del mes — así "Supermercado" es
// siempre el mismo color aunque un mes sea el gasto #1 y otro el #4.
// ============================================================

import { CATEGORIES, getCategoryByValue } from '@/constants/categories';

const CHART_SLOTS = 8;

function slotForCategory(categoria: string): number {
  const idx = CATEGORIES.findIndex((c) => c.value === categoria);
  return (idx >= 0 ? idx : 0) % CHART_SLOTS;
}

export interface CategorySpendingItem {
  categoria: string;
  amount: number;
}

interface CategorySpendingBarsProps {
  items: CategorySpendingItem[];
  formatAmount: (amount: number) => string;
  maxItems?: number;
}

export function CategorySpendingBars({ items, formatAmount, maxItems = 7 }: CategorySpendingBarsProps) {
  if (items.length === 0) return null;

  const visible = items.slice(0, maxItems);
  const restTotal = items.slice(maxItems).reduce((sum, i) => sum + i.amount, 0);
  const rows = restTotal > 0 ? [...visible, { categoria: '__otros__', amount: restTotal }] : visible;
  const max = Math.max(...rows.map((r) => r.amount), 1);

  return (
    <div className="space-y-3" role="img" aria-label="Gastos por categoría, de mayor a menor">
      {rows.map((row) => {
        const isOtros = row.categoria === '__otros__';
        const cat = isOtros ? null : getCategoryByValue(row.categoria);
        const pct = Math.max(4, Math.round((row.amount / max) * 100));

        return (
          <div key={row.categoria} className="group">
            <div className="flex items-center justify-between text-xs mb-1 gap-2">
              <span className="flex items-center gap-1.5 font-medium text-foreground min-w-0 truncate">
                <span aria-hidden="true">{cat?.emoji ?? '📊'}</span>
                <span className="truncate">{cat?.label ?? 'Otros'}</span>
              </span>
              <span className="font-bold text-foreground tabular shrink-0">
                {formatAmount(row.amount)}
              </span>
            </div>
            <div className="h-2.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300 group-hover:brightness-110"
                style={{
                  width: `${pct}%`,
                  backgroundColor: isOtros ? 'var(--muted-foreground)' : `var(--chart-${slotForCategory(row.categoria) + 1})`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
