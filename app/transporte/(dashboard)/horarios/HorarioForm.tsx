'use client';

import { useActionState } from 'react';
import { crearHorario } from './actions';
import { Button } from '@/components/transporte/ui/button';
import { Input } from '@/components/transporte/ui/input';
import { DIAS_SEMANA } from '@/lib/transporte/format';

const TODOS_LOS_DIAS = DIAS_SEMANA.map((d) => d.value);

export function HorarioForm() {
  const [state, formAction, pending] = useActionState(crearHorario, null);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-sm font-medium" htmlFor="hora">
          Hora del viaje
        </label>
        <Input id="hora" name="hora" type="time" required className="max-w-[10rem]" />
      </div>

      <div className="space-y-1.5">
        <span className="text-sm font-medium">Días de la semana</span>
        <div className="flex flex-wrap gap-2">
          {DIAS_SEMANA.map((dia) => (
            <label
              key={dia.value}
              className="flex items-center gap-1.5 rounded-lg border border-[var(--tp-border)] px-2.5 py-1.5 text-sm has-[:checked]:border-[var(--tp-primary)] has-[:checked]:bg-[var(--tp-primary)]/10"
            >
              <input
                type="checkbox"
                name="dias"
                value={dia.value}
                defaultChecked={TODOS_LOS_DIAS.includes(dia.value)}
                className="accent-current"
              />
              {dia.label}
            </label>
          ))}
        </div>
      </div>

      {state?.error && <p className="text-sm text-[var(--tp-destructive)]">{state.error}</p>}
      <Button type="submit" disabled={pending}>
        {pending ? 'Guardando…' : 'Agregar horario'}
      </Button>
    </form>
  );
}
