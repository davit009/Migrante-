'use client';

// ============================================================
// components/layout/MonthSelector.tsx
// Selector de mes (‹ Mes Año ›) para vistas con datos filtrados por periodo
// ============================================================

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatMonthLabel, shiftMonthKey, isCurrentMonth } from '@/utils/date.utils';

interface MonthSelectorProps {
  monthKey: string;
  onChange: (monthKey: string) => void;
}

export function MonthSelector({ monthKey, onChange }: MonthSelectorProps) {
  const isNowMonth = isCurrentMonth(monthKey);

  return (
    <div className="flex items-center justify-between gap-2 bg-muted rounded-2xl px-1.5 py-1.5 w-fit">
      <button
        type="button"
        onClick={() => onChange(shiftMonthKey(monthKey, -1))}
        className="w-8 h-8 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-card transition-colors"
        aria-label="Mes anterior"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <span className="text-xs font-semibold text-foreground min-w-24 text-center">
        {formatMonthLabel(monthKey)}
      </span>
      <button
        type="button"
        onClick={() => !isNowMonth && onChange(shiftMonthKey(monthKey, 1))}
        disabled={isNowMonth}
        className="w-8 h-8 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-card transition-colors disabled:opacity-30 disabled:pointer-events-none"
        aria-label="Mes siguiente"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
