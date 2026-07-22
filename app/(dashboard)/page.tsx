// ============================================================
// app/(dashboard)/page.tsx
// Página principal del Dashboard.
// Se desarrolla completamente en Fase 3.
// ============================================================

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Título */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Buenos días 👋</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Tu resumen financiero
        </p>
      </div>

      {/* Stat cards placeholder */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Balance USD', emoji: '💵' },
          { label: 'Balance MXN', emoji: '🇲🇽' },
          { label: 'Ingresos del mes', emoji: '📈' },
          { label: 'Gastos del mes', emoji: '📉' },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-border bg-card p-4 space-y-2 card-hover"
          >
            <div className="text-2xl">{card.emoji}</div>
            <div className="space-y-1">
              <div className="h-6 rounded bg-muted animate-pulse w-20" />
              <p className="text-xs text-muted-foreground">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tipo de cambio placeholder */}
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-sm">Tipo de cambio</h2>
          <span className="text-xs text-muted-foreground">USD → MXN</span>
        </div>
        <div className="h-8 rounded bg-muted animate-pulse w-32" />
      </div>

      {/* Últimos movimientos placeholder */}
      <div className="space-y-2">
        <h2 className="font-semibold text-sm">Últimos movimientos</h2>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-card p-3 flex items-center gap-3"
          >
            <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3.5 rounded bg-muted animate-pulse w-3/4" />
              <div className="h-3 rounded bg-muted animate-pulse w-1/2" />
            </div>
            <div className="h-4 rounded bg-muted animate-pulse w-16" />
          </div>
        ))}
      </div>

      {/* Banner informativo */}
      <div className="rounded-2xl bg-primary/5 border border-primary/20 p-4">
        <p className="text-xs text-primary font-medium">
          🚧 Dashboard completo se implementa en Fase 3
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          La arquitectura base (Fase 1) está lista. Continúa con Fase 2 → Auth
        </p>
      </div>
    </div>
  );
}
