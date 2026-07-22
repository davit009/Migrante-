// ============================================================
// app/page.tsx
// Landing Pública — Conversor + Glass UI Mobile-First
// ============================================================

import type { Metadata } from 'next';
import Link from 'next/link';
import { ConverterCard } from '@/features/converter/components/ConverterCard';
import { Button } from '@/components/ui/button';
import { Calculator, PiggyBank, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Conversor USD a MXN | Migrante$',
  description: 'Calcula el tipo de cambio de dólar a peso mexicano en tiempo real. Herramienta gratuita.',
};

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header Glass */}
      <header
        className="glass sticky top-0 z-50"
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
      >
        <div className="flex items-center justify-between h-14 px-4 sm:px-6 max-w-2xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="text-xl">💵</span>
            <span className="font-bold text-lg tracking-tight">
              Migrante<span className="text-primary">$</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="rounded-full h-9 px-4 text-sm font-medium btn-xs">
                Entrar
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="rounded-full h-9 px-4 text-sm font-semibold gradient-primary border-0 btn-xs">
                Registro
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="flex-1 px-4 sm:px-5 pt-6 pb-10 max-w-2xl mx-auto w-full space-y-8">
        {/* Hero */}
        <div className="text-center space-y-2 enter-up">
          <p className="text-xs font-semibold text-primary/80 uppercase tracking-widest">
            Tipo de cambio en tiempo real
          </p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground leading-tight">
            Convierte tus<br />
            dólares al instante
          </h1>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
            Sin registro. Sin comisiones. Transparente y gratuito.
          </p>
        </div>

        {/* Conversor Principal */}
        <div className="enter-up" style={{ animationDelay: '80ms' }}>
          <ConverterCard />
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-border/50" />
          <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
            Más herramientas
          </span>
          <div className="flex-1 h-px bg-border/50" />
        </div>

        {/* Cards de Funciones */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 enter-up" style={{ animationDelay: '160ms' }}>
          {/* Calculadora */}
          <div className="glass rounded-3xl p-5 space-y-3 glass-hover">
            <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Calculator className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">Calculadora de Compras</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Agrega productos y calcula el impuesto según tu estado en EE.UU.
              </p>
            </div>
            <Link href="/register">
              <Button variant="ghost" size="sm" className="rounded-2xl h-9 text-xs w-full justify-between px-3 mt-1 btn-xs">
                Ver más <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          {/* Ahorros */}
          <div className="glass rounded-3xl p-5 space-y-3 glass-hover">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
              <PiggyBank className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">Control de Ahorros</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Registra ingresos y gastos. Ve tu saldo en dólares y pesos.
              </p>
            </div>
            <Link href="/register">
              <Button variant="ghost" size="sm" className="rounded-2xl h-9 text-xs w-full justify-between px-3 mt-1 btn-xs">
                Ver más <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* CTA inferior */}
        <div className="glass rounded-3xl p-5 text-center space-y-3 enter-up" style={{ animationDelay: '220ms' }}>
          <p className="text-sm font-semibold text-foreground">
            ¿Listo para llevar el control?
          </p>
          <p className="text-xs text-muted-foreground">
            Crea tu cuenta gratuita y guarda tu historial para siempre.
          </p>
          <Link href="/register">
            <Button className="rounded-2xl h-11 px-8 font-semibold gradient-primary border-0 w-full sm:w-auto">
              Crear cuenta gratis →
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer mínimo */}
      <footer className="text-center py-6 pb-8 text-[11px] text-muted-foreground/70 px-4">
        Migrante<span className="text-primary font-bold">$</span> — Herramienta para trabajadores migrantes
      </footer>
    </div>
  );
}
