'use client';

// ============================================================
// features/payroll-tax/components/PayrollEntryForm.tsx
// Formulario para registrar un pago (nómina W-2 o cliente 1099)
// ============================================================

import { useState } from 'react';
import { USA_STATES_LIST } from '@/constants/usa-states';
import { getTodayISO } from '@/utils/date.utils';
import type { PayrollEntryCreate, WorkerType } from '@/types/app.types';

import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';

interface PayrollEntryFormProps {
  onSubmit: (values: PayrollEntryCreate) => Promise<unknown>;
  isSubmitting: boolean;
  defaultState?: string;
}

export function PayrollEntryForm({ onSubmit, isSubmitting, defaultState = 'TX' }: PayrollEntryFormProps) {
  const [tipoTrabajador, setTipoTrabajador] = useState<WorkerType>('w2');
  const [estadoUsa, setEstadoUsa] = useState(defaultState);
  const [montoBruto, setMontoBruto] = useState('');
  const [retencionFederal, setRetencionFederal] = useState('');
  const [retencionEstatal, setRetencionEstatal] = useState('');
  const [fecha, setFecha] = useState(getTodayISO());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const bruto = parseFloat(montoBruto);
    if (isNaN(bruto) || bruto <= 0) return;

    await onSubmit({
      fecha,
      tipo_trabajador: tipoTrabajador,
      estado_usa: estadoUsa,
      monto_bruto: bruto,
      retencion_federal_real: retencionFederal ? parseFloat(retencionFederal) : null,
      retencion_estatal_real: retencionEstatal ? parseFloat(retencionEstatal) : null,
    });

    setMontoBruto('');
    setRetencionFederal('');
    setRetencionEstatal('');
  };

  return (
    <Card className="p-5 rounded-3xl border-border bg-card shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-base text-foreground">Registrar Pago</h3>

        <div className="grid grid-cols-2 gap-1 p-1 bg-muted rounded-xl">
          <button
            type="button"
            onClick={() => setTipoTrabajador('w2')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              tipoTrabajador === 'w2'
                ? 'bg-primary text-white shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Empleado (W-2)
          </button>
          <button
            type="button"
            onClick={() => setTipoTrabajador('1099')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              tipoTrabajador === '1099'
                ? 'bg-primary text-white shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Contratista (1099)
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="pr-bruto" className="text-xs">
              {tipoTrabajador === 'w2' ? 'Sueldo bruto' : 'Pago recibido'}
            </Label>
            <Input
              id="pr-bruto"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={montoBruto}
              onChange={(e) => setMontoBruto(e.target.value)}
              className="h-11 rounded-xl text-lg font-bold tabular"
              autoFocus
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="pr-fecha" className="text-xs">Fecha</Label>
            <Input
              id="pr-fecha"
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="h-11 rounded-xl"
            />
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor="pr-estado" className="text-xs">Estado de EE.UU. donde trabajas</Label>
          <Select value={estadoUsa} onValueChange={(val) => val && setEstadoUsa(val)}>
            <SelectTrigger id="pr-estado" className="h-11 rounded-xl">
              <SelectValue placeholder="Selecciona un estado..." />
            </SelectTrigger>
            <SelectContent className="max-h-60 rounded-2xl">
              {USA_STATES_LIST.map((state) => (
                <SelectItem key={state.code} value={state.code} className="rounded-xl cursor-pointer">
                  {state.name} ({state.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="pr-ret-fed" className="text-xs">
              Retención federal real <span className="text-muted-foreground/60 font-normal lowercase">(opcional, de tu talón)</span>
            </Label>
            <Input
              id="pr-ret-fed"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={retencionFederal}
              onChange={(e) => setRetencionFederal(e.target.value)}
              className="h-10 rounded-xl"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="pr-ret-est" className="text-xs">
              Retención estatal real <span className="text-muted-foreground/60 font-normal lowercase">(opcional)</span>
            </Label>
            <Input
              id="pr-ret-est"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={retencionEstatal}
              onChange={(e) => setRetencionEstatal(e.target.value)}
              className="h-10 rounded-xl"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-11 rounded-2xl font-semibold text-white gap-2 shadow-sm gradient-primary border-0"
        >
          <Plus className="w-4 h-4" />
          {isSubmitting ? 'Guardando...' : 'Registrar pago'}
        </Button>
      </form>
    </Card>
  );
}
