'use client';

// ============================================================
// features/dashboard/components/StatCard.tsx
// Tarjeta financiera reutilizable — Liquid Glass
// ============================================================

import React from 'react';

interface StatCardProps {
  title: string;
  amountUSD: string;
  amountMXN?: string;
  icon: React.ReactNode;
  variant?: 'default' | 'income' | 'expense' | 'brand';
  subtitle?: string;
}

export function StatCard({
  title,
  amountUSD,
  amountMXN,
  icon,
  variant = 'default',
  subtitle,
}: StatCardProps) {
  const getBadgeStyle = () => {
    switch (variant) {
      case 'income':
        return 'badge-income';
      case 'expense':
        return 'badge-expense';
      case 'brand':
        return 'bg-primary/15 text-primary border border-primary/20';
      default:
        return 'glass text-muted-foreground';
    }
  };

  return (
    <div className="glass rounded-3xl p-5 space-y-3 glass-hover">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {title}
        </span>
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${getBadgeStyle()}`}>
          {icon}
        </div>
      </div>

      <div className="space-y-0.5">
        <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground finance-number">
          {amountUSD}
        </h3>
        {amountMXN && (
          <p className="text-xs font-medium text-muted-foreground/80 finance-number">
            ≈ {amountMXN}
          </p>
        )}
        {subtitle && (
          <p className="text-[11px] text-muted-foreground pt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
