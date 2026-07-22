// ============================================================
// features/savings/services/transaction.service.ts
// Servicio para consultar y guardar transacciones (Ingresos y Gastos)
// ============================================================

import { createClient } from '@/lib/supabase/client';
import type { Transaction, TransactionCreate } from '@/types/app.types';

export const transactionService = {
  /**
   * Obtiene todas las transacciones del usuario ordenadas por fecha.
   */
  async getTransactions(): Promise<Transaction[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('fecha', { ascending: false });

    if (error) {
      throw new Error(`Error al obtener transacciones: ${error.message}`);
    }

    return (data ?? []) as Transaction[];
  },

  /**
   * Registra una nueva transacción (ingreso o gasto).
   */
  async createTransaction(payload: TransactionCreate, exchangeRate: number): Promise<Transaction> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Usuario no autenticado');

    // Calcular el monto equivalente en MXN
    const monto_mxn =
      payload.moneda === 'USD'
        ? payload.monto * exchangeRate
        : payload.monto;

    const { data, error } = await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        tipo: payload.tipo,
        categoria: payload.categoria,
        descripcion: payload.descripcion ?? null,
        monto: payload.monto,
        moneda: payload.moneda,
        tipo_cambio: exchangeRate,
        monto_mxn,
        fecha: payload.fecha,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Error al guardar la transacción: ${error.message}`);
    }

    return data as Transaction;
  },

  /**
   * Elimina una transacción por ID.
   */
  async deleteTransaction(id: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Error al eliminar la transacción: ${error.message}`);
    }
  },
};
