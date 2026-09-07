import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/transporte/ui/card';
import type { TransporteHorario } from '@/lib/transporte/types';
import { HorarioForm } from './HorarioForm';
import { HorarioList } from './HorarioList';

export default async function TransporteHorariosPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: horarios } = await supabase
    .from('transporte_horarios')
    .select('*')
    .eq('user_id', user!.id)
    .order('hora')
    .returns<TransporteHorario[]>();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">Horarios de uso</h1>
        <p className="text-sm text-[var(--tp-muted-foreground)]">
          Define a qué hora usas el transporte. A esa hora, la app descuenta automáticamente el
          costo del viaje de tu saldo estimado.
        </p>
      </div>

      <Card className="p-5">
        <HorarioForm />
      </Card>

      <Card className="p-5">
        <HorarioList horarios={horarios ?? []} />
      </Card>
    </div>
  );
}
