// ============================================================
// app/page.tsx
// Landing Principal — Conversor de Divisas Público + Acceso Rápido
// ============================================================

import type { Metadata } from 'next';
import Link from 'next/link';
import { ConverterCard } from '@/features/converter/components/ConverterCard';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calculator, PiggyBank, History } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Conversor USD a MXN | Migrante$',
  description: 'Calcula el tipo de cambio de dólar a peso mexicano en tiempo real. Herramienta gratuita para trabajadores y familias migrantes.',
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Público / Topbar */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto max-w-5xl flex items-center justify-between px-4 sm:px-6 h-16">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💵</span>
            <span className="font-bold text-xl tracking-tight text-foreground">
              Migrante<span className="text-primary">$</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="rounded-xl font-medium">
                Iniciar Sesión
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="rounded-xl font-semibold shadow-sm">
                Crear Cuenta
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section + Conversor */}
      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-12 space-y-12">
        {/* Título e Introducción */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Convierte tus dólares a pesos <span className="text-primary">al instante</span>
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Consulta el tipo de cambio real y administra tu dinero entre Estados Unidos y México de forma sencilla y transparente.
          </p>
        </div>

        {/* Módulo Principal: Conversor de Divisas */}
        <section className="w-full flex justify-center">
          <ConverterCard />
        </section>

        {/* Acceso Rápido a otros Módulos */}
        <section className="space-y-6 pt-6 border-t border-border">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Herramientas Diseñadas para Ti
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Todo lo que necesitas para cuidar tu economía diaria
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Calculadora de Compras */}
            <div className="rounded-2xl border border-border bg-card p-5 space-y-3 card-hover">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-base">Calculadora de Compras</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Suma productos y calcula automáticamente los impuestos de tu estado en EE.UU.
                </p>
              </div>
              <Link href="/calculator" className="block">
                <Button variant="outline" size="sm" className="w-full rounded-xl justify-between">
                  Probar Calculadora <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </div>

            {/* Control de Ahorro */}
            <div className="rounded-2xl border border-border bg-card p-5 space-y-3 card-hover">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <PiggyBank className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-base">Control de Ahorro</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Lleva el registro de tus ingresos y gastos mensuales en USD y su equivalente en MXN.
                </p>
              </div>
              <Link href="/login" className="block">
                <Button variant="outline" size="sm" className="w-full rounded-xl justify-between">
                  Comenzar Ahorro <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </div>

            {/* Historial */}
            <div className="rounded-2xl border border-border bg-card p-5 space-y-3 card-hover">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <History className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-base">Historial Financiero</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Guarda cada tipo de cambio utilizado y mantén un registro histórico sin distorsiones.
                </p>
              </div>
              <Link href="/login" className="block">
                <Button variant="outline" size="sm" className="w-full rounded-xl justify-between">
                  Ver Historial <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16 py-8 bg-card/50">
        <div className="mx-auto max-w-5xl px-4 text-center text-xs text-muted-foreground space-y-2">
          <p className="font-semibold text-foreground">
            Migrante<span className="text-primary">$</span> — Aplicación Financiera
          </p>
          <p>Herramienta diseñada para trabajadores y migrantes. Sin comisiones ni costos ocultos.</p>
        </div>
      </footer>
    </div>
  );
}
