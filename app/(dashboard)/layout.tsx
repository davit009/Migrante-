// ============================================================
// app/(dashboard)/layout.tsx
// Layout de la sección autenticada.
// Incluye: Sidebar (desktop) + MobileNav (bottom tabs móvil).
// Se desarrolla completamente en Fase 3.
// ============================================================

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Migrante$',
    default: 'Dashboard | Migrante$',
  },
};

interface DashboardLayoutProps {
  children: React.ReactNode;
}

// Placeholder — se reemplaza en Fase 3 con Sidebar + MobileNav
export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Topbar temporal */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💵</span>
            <span className="font-bold text-lg">
              Migrante<span className="text-primary">$</span>
            </span>
          </div>
          <div className="text-xs text-muted-foreground">Fase 1 ✅</div>
        </div>
      </header>

      {/* Contenido */}
      <main className="mx-auto max-w-7xl px-4 py-6 pb-24">
        {children}
      </main>

      {/* Bottom Nav placeholder */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/90 backdrop-blur-md">
        <div className="mx-auto max-w-7xl flex items-center justify-around h-16 px-4">
          {['🏠', '💱', '🛒', '💰', '⚙️'].map((icon, i) => (
            <button
              key={i}
              className="flex flex-col items-center justify-center gap-0.5 p-2 rounded-xl transition-colors hover:bg-accent"
            >
              <span className="text-xl">{icon}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
