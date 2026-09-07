// ============================================================
// features/mexico/services/mx-transaction.service.ts
// Servicio para el ledger de "Modo México" — solo MXN, sin
// conversión. Tabla separada (migrante_mx_transactions) de la de
// Ahorros (migrante_transactions).
// ============================================================

import { createClient } from '@/lib/supabase/client';
import type { MxTransaction, MxTransactionCreate } from '@/types/app.types';

export const mxTransactionService = {
  /**
   * Obtiene todos los movimientos del usuario ordenados por fecha.
   */
  async getTransactions(): Promise<MxTransaction[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('migrante_mx_transactions')
      .select('*')
      .order('fecha', { ascending: false });

    if (error) {
      throw new Error(`Error al obtener movimientos: ${error.message}`);
    }

    return (data ?? []) as MxTransaction[];
  },

  /**
   * Registra un nuevo movimiento (ingreso o gasto) en pesos.
   */
  async createTransaction(payload: MxTransactionCreate): Promise<MxTransaction> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Usuario no autenticado');

    const { data, error } = await supabase
      .from('migrante_mx_transactions')
      .insert({
        user_id: user.id,
        tipo: payload.tipo,
        categoria: payload.categoria,
        descripcion: payload.descripcion ?? null,
        monto: payload.monto,
        fecha: payload.fecha,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Error al guardar el movimiento: ${error.message}`);
    }

    return data as MxTransaction;
  },

  /**
   * Elimina un movimiento por ID.
   */
  async deleteTransaction(id: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase
      .from('migrante_mx_transactions')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Error al eliminar el movimiento: ${error.message}`);
    }
  },
};
