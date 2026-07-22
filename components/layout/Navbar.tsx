'use client';

// ============================================================
// components/layout/Navbar.tsx
// Glass Top Bar — Liquid Glass, Mobile-First
// ============================================================

import { useAuth } from '@/features/auth/hooks/useAuth';
import { useExchangeRate } from '@/features/converter/hooks/useExchangeRate';
import { formatRate } from '@/utils/currency.utils';
import { ThemeToggle } from './ThemeToggle';
import { RefreshCw } from 'lucide-react';

export function Navbar() {
  const { profile, user } = useAuth();
  const { rate, isFetching, refetch } = useExchangeRate();

  const displayName = profile?.nombre?.split(' ')[0] ?? 
    user?.email?.split('@')[0] ?? 'Migrante';

  return (
    <header
      className="glass sticky top-0 z-40 px-4 sm:px-5"
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      <div className="flex items-center justify-between h-14 max-w-2xl mx-auto">
        {/* Branding */}
        <div className="flex items-center gap-2">
          <span className="text-xl">💵</span>
          <span className="font-bold text-lg tracking-tight text-foreground">
            Migrante<span className="text-primary">$</span>
          </span>
        </div>

        {/* Right: Exchange Rate + Theme Toggle */}
        <div className="flex items-center gap-2">
          {rate > 0 && (
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass text-xs font-semibold text-primary btn-xs transition-all active:scale-95"
            >
              {isFetching ? (
                <RefreshCw className="w-3 h-3 animate-spin" />
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              )}
              {formatRate(rate)} MXN
            </button>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
