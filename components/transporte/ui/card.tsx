import type { HTMLAttributes } from 'react';

export function Card({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-2xl border border-[var(--tp-border)] bg-[var(--tp-card)] text-[var(--tp-card-foreground)] shadow-sm ${className}`}
      {...props}
    />
  );
}
