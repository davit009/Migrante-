'use client';

// ============================================================
// app/(dashboard)/impuestos/page.tsx
// Estimador de Impuestos de Nómina — registra tus pagos y proyecta
// tu situación fiscal anual. Estimación educativa, no asesoría fiscal.
// ============================================================

import { usePayrollEntries } from '@/features/payroll-tax/hooks/usePayrollEntries';
import { PayrollEntryForm } from '@/features/payroll-tax/components/PayrollEntryForm';
import { PayrollSummaryCard } from '@/features/payroll-tax/components/PayrollSummaryCard';
import { formatUSD } from '@/utils/currency.utils';
import { formatDateShort } from '@/utils/date.utils';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Receipt, Trash2 } from 'lucide-react';

export default function ImpuestosPage() {
  const { entries, isLoading, createEntry, isCreating, deleteEntry } = usePayrollEntries();

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-2">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
          <Receipt className="w-7 h-7 text-primary" />
          Impuestos de Nómina
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Registra tus pagos y mira una proyección de cuánto podrías deber o recibir de reembolso al declarar.
        </p>
      </div>

      {/* Proyección */}
      {isLoading ? (
        <div className="h-48 rounded-3xl bg-muted animate-pulse" />
      ) : (
        <PayrollSummaryCard entries={entries} />
      )}

      {/* Formulario + Lista */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5">
          <PayrollEntryForm onSubmit={createEntry} isSubmitting={isCreating} />
        </div>

        <div className="lg:col-span-7 space-y-4">
          <h3 className="font-bold text-base text-foreground">Pagos Registrados</h3>

          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 rounded-2xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : entries.length === 0 ? (
            <Card className="p-8 rounded-2xl border-dashed border-border bg-card/40 text-center text-xs text-muted-foreground">
              No hay pagos registrados aún. Agrega uno en el formulario.
            </Card>
          ) : (
            <div className="space-y-2">
              {entries.map((entry) => (
                <Card
                  key={entry.id}
                  className="p-4 rounded-2xl border-border bg-card flex items-center justify-between gap-3 card-hover"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-foreground truncate">
                      {formatUSD(entry.monto_bruto)}{' '}
                      <span className="text-xs font-normal text-muted-foreground">
                        {entry.tipo_trabajador === 'w2' ? 'W-2' : '1099'} · {entry.estado_usa}
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground">{formatDateShort(entry.fecha)}</p>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteEntry(entry.id)}
                    className="w-8 h-8 rounded-xl text-muted-foreground hover:text-destructive shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
