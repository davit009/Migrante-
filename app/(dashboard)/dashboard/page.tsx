'use client';

// ============================================================
// app/(dashboard)/dashboard/page.tsx
// Página principal del Dashboard Autenticado (/dashboard)
// ============================================================

import Link from 'next/link';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useSavings } from '@/features/savings/hooks/useSavings';
import { useExchangeRate } from '@/features/converter/hooks/useExchangeRate';
import { formatUSD, formatMXN } from '@/utils/currency.utils';
import { formatDateShort } from '@/utils/date.utils';
import { getCategoryByValue } from '@/constants/categories';

import { StatCard } from '@/features/dashboard/components/StatCard';
import { ConverterCard } from '@/features/converter/components/ConverterCard';
import { Button } from '@/components/ui/button';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Plus,
  Calculator,
  PiggyBank,
  ArrowRight,
  Send
} from 'lucide-react';

export default function DashboardPage() {
  const { profile } = useAuth();
  const { rate } = useExchangeRate();
  const { 
    transactions, 
    totalIngresosUSD, 
    totalGastosUSD, 
    balanceUSD, 
    balanceMXN,
    isLoading 
  } = useSavings();

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="space-y-6 pb-4">
      {/* Header del Dashboard */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 enter-up">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            Hola, {profile?.nombre?.split(' ')[0] ?? 'Migrante'} 👋
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Resumen en tiempo real de tu patrimonio
          </p>
        </div>

        <Link href="/savings" className="shrink-0">
          <Button className="w-full sm:w-auto h-11 px-5 rounded-2xl font-semibold text-xs gradient-primary border-0 shadow-none flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> Registrar movimiento
          </Button>
        </Link>
      </div>

      {/* Grid de Tarjetas Financieras */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 enter-up" style={{ animationDelay: '60ms' }}>
        <StatCard
          title="Saldo Estimado"
          amountUSD={isLoading ? '$0.00' : formatUSD(balanceUSD)}
          amountMXN={isLoading ? '$0.00' : formatMXN(balanceMXN)}
          icon={<Wallet className="w-5 h-5" />}
          variant="brand"
        />

        <StatCard
          title="Ingresos Totales"
          amountUSD={isLoading ? '$0.00' : formatUSD(totalIngresosUSD)}
          amountMXN={isLoading ? '$0.00' : formatMXN(totalIngresosUSD * (rate || 17.5))}
          icon={<TrendingUp className="w-5 h-5" />}
          variant="income"
        />

        <StatCard
          title="Gastos Totales"
          amountUSD={isLoading ? '$0.00' : formatUSD(totalGastosUSD)}
          amountMXN={isLoading ? '$0.00' : formatMXN(totalGastosUSD * (rate || 17.5))}
          icon={<TrendingDown className="w-5 h-5" />}
          variant="expense"
        />
      </div>

      {/* Sección en 2 Columnas: Conversor Rápido + Actividad Reciente */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start enter-up" style={{ animationDelay: '120ms' }}>
        {/* Conversor Rápido */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-base font-bold tracking-tight text-foreground">
              Conversor Rápido
            </h2>
            <span className="text-[11px] text-muted-foreground">Tipo de cambio al día</span>
          </div>
          <ConverterCard />
        </div>

        {/* Derecha: Accesos Rápidos + Últimos Movimientos */}
        <div className="lg:col-span-5 space-y-6">
          {/* Accesos Rápidos */}
          <div className="space-y-3">
            <h2 className="text-base font-bold tracking-tight text-foreground px-1">
              Herramientas
            </h2>
            <div className="grid grid-cols-3 gap-2.5">
              <Link href="/calculator">
                <div className="glass rounded-3xl p-3 flex flex-col gap-2 glass-hover">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Calculator className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-[11px] text-foreground block leading-tight">Calculadora</span>
                    <span className="text-[9px] text-muted-foreground">Compras + Tax</span>
                  </div>
                </div>
              </Link>

              <Link href="/savings">
                <div className="glass rounded-3xl p-3 flex flex-col gap-2 glass-hover">
                  <div className="w-8 h-8 rounded-xl badge-income flex items-center justify-center">
                    <PiggyBank className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-[11px] text-foreground block leading-tight">Ahorros</span>
                    <span className="text-[9px] text-muted-foreground">Ingresos y gastos</span>
                  </div>
                </div>
              </Link>

              <Link href="/remesas">
                <div className="glass rounded-3xl p-3 flex flex-col gap-2 glass-hover">
                  <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                    <Send className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-[11px] text-foreground block leading-tight">Remesas</span>
                    <span className="text-[9px] text-muted-foreground">Comparar envíos</span>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Últimos Movimientos */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-base font-bold tracking-tight text-foreground">
                Últimos Movimientos
              </h2>
              <Link href="/history" className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
                Ver todos <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-14 rounded-2xl glass animate-pulse" />
                ))}
              </div>
            ) : recentTransactions.length === 0 ? (
              <div className="glass rounded-3xl p-6 text-center space-y-2">
                <p className="text-xs font-semibold text-foreground">Sin registros aún</p>
                <p className="text-[11px] text-muted-foreground">
                  Registra tus ingresos o gastos para llevar tu historial al día.
                </p>
                <Link href="/savings" className="inline-block pt-1">
                  <Button size="sm" variant="ghost" className="glass rounded-2xl text-xs h-9 px-4 btn-xs">
                    Agregar primer registro
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {recentTransactions.map((item) => {
                  const cat = getCategoryByValue(item.categoria);
                  const isIncome = item.tipo === 'ingreso';

                  return (
                    <div
                      key={item.id}
                      className="glass rounded-2xl p-3.5 flex items-center justify-between gap-3 glass-hover"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-2xl glass flex items-center justify-center text-base shrink-0">
                          {cat?.emoji ?? '📌'}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-xs text-foreground truncate">
                            {item.descripcion || cat?.label || 'Movimiento'}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {formatDateShort(item.fecha)}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <p
                          className={`font-bold text-xs finance-number ${
                            isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                          }`}
                        >
                          {isIncome ? '+' : '-'}{formatUSD(item.monto)}
                        </p>
                        <p className="text-[10px] text-muted-foreground finance-number">
                          ≈ {formatMXN(item.monto_mxn ?? item.monto * (rate || 17.5))}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
