// ============================================================
// app/(dashboard)/converter/page.tsx
// Página del módulo Conversor de Divisas
// ============================================================

import type { Metadata } from 'next';
import { ConverterCard } from '@/features/converter/components/ConverterCard';

export const metadata: Metadata = {
  title: 'Conversor de Divisas | Migrante$',
  description: 'Calcula conversiones USD ↔ MXN con el tipo de cambio en tiempo real.',
};

export default function ConverterPage() {
  return (
    <div className="space-y-6 max-w-xl mx-auto py-4">
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Conversor de Divisas</h1>
        <p className="text-sm text-muted-foreground">
          Tipo de cambio oficial actualizado en tiempo real
        </p>
      </div>

      <ConverterCard />
    </div>
  );
}
