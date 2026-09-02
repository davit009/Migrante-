// ============================================================
// features/payroll-tax/services/payroll.service.ts
// Servicio para registrar pagos de nómina/autoempleo en Supabase
// ============================================================

import { createClient } from '@/lib/supabase/client';
import type { PayrollEntry, PayrollEntryCreate } from '@/types/app.types';

export const payrollService = {
  /**
   * Obtiene los pagos registrados del usuario, más recientes primero.
   */
  async getEntries(): Promise<PayrollEntry[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('migrante_payroll_entries')
      .select('*')
      .order('fecha', { ascending: false });

    if (error) throw new Error(`Error al consultar tus pagos: ${error.message}`);
    return (data ?? []) as PayrollEntry[];
  },

  /**
   * Registra un pago (cheque de nómina o pago de cliente si es 1099).
   */
  async createEntry(payload: PayrollEntryCreate): Promise<PayrollEntry> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Debes iniciar sesión para registrar un pago');

    const { data, error } = await supabase
      .from('migrante_payroll_entries')
      .insert({
        user_id: user.id,
        fecha: payload.fecha,
        tipo_trabajador: payload.tipo_trabajador,
        estado_usa: payload.estado_usa,
        monto_bruto: payload.monto_bruto,
        retencion_federal_real: payload.retencion_federal_real ?? null,
        retencion_estatal_real: payload.retencion_estatal_real ?? null,
      })
      .select()
      .single();

    if (error) throw new Error(`Error al guardar el pago: ${error.message}`);
    return data as PayrollEntry;
  },

  /**
   * Elimina un pago registrado por ID.
   */
  async deleteEntry(id: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase.from('migrante_payroll_entries').delete().eq('id', id);
    if (error) throw new Error(`Error al eliminar el pago: ${error.message}`);
  },
};
