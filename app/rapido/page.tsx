import type { Metadata } from 'next';
import Link from 'next/link';
import { QuickConvertCard } from '@/features/converter/components/QuickConvertCard';

export const metadata: Metadata = {
  title: 'Conversión Rápida | Migrante$',
  description: 'Convierte USD a MXN al instante, con impuesto opcional de un tap.',
};

export default function RapidoPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8"
      style={{ paddingTop: 'max(env(safe-area-inset-top, 0px), 1rem)' }}
    >
      <Link
        href="/"
        className="mb-6 flex items-center gap-1.5 text-sm font-bold text-foreground"
      >
        <span className="text-lg">💵</span>
        Migrante<span className="text-primary">$</span>
      </Link>

      <div className="w-full max-w-sm">
        <QuickConvertCard />
      </div>

      <Link
        href="/dashboard"
        className="mt-6 text-xs text-muted-foreground/70 hover:text-muted-foreground transition-colors"
      >
        Ver la app completa →
      </Link>
    </div>
  );
}
