// ============================================================
// features/savings/services/goals.service.ts
// Servicio para gestionar metas de ahorro en Supabase
// ============================================================

import { createClient } from '@/lib/supabase/client';
import type { SavingsGoal, SavingsGoalCreate } from '@/types/app.types';

export const goalsService = {
  /**
   * Obtiene todas las metas de ahorro del usuario, más recientes primero.
   */
  async getGoals(): Promise<SavingsGoal[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('savings_goals')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Error al consultar metas de ahorro: ${error.message}`);
    return (data ?? []) as SavingsGoal[];
  },

  /**
   * Crea una nueva meta de ahorro.
   */
  async createGoal(payload: SavingsGoalCreate): Promise<SavingsGoal> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Debes iniciar sesión para crear una meta de ahorro');

    const { data, error } = await supabase
      .from('savings_goals')
      .insert({
        user_id: user.id,
        nombre: payload.nombre,
        monto_objetivo: payload.monto_objetivo,
        moneda: payload.moneda,
        fecha_limite: payload.fecha_limite || null,
      })
      .select()
      .single();

    if (error) throw new Error(`Error al crear la meta: ${error.message}`);
    return data as SavingsGoal;
  },

  /**
   * Suma una aportación al monto actual de una meta. Si alcanza o supera
   * el objetivo, la marca automáticamente como 'completada'.
   */
  async contributeToGoal(goal: SavingsGoal, amount: number): Promise<SavingsGoal> {
    const supabase = createClient();
    const nuevoMonto = goal.monto_actual + amount;
    const nuevoEstado = nuevoMonto >= goal.monto_objetivo ? 'completada' : goal.estado;

    const { data, error } = await supabase
      .from('savings_goals')
      .update({ monto_actual: nuevoMonto, estado: nuevoEstado })
      .eq('id', goal.id)
      .select()
      .single();

    if (error) throw new Error(`Error al actualizar la meta: ${error.message}`);
    return data as SavingsGoal;
  },

  /**
   * Elimina una meta de ahorro por ID.
   */
  async deleteGoal(id: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase.from('savings_goals').delete().eq('id', id);
    if (error) throw new Error(`Error al eliminar la meta: ${error.message}`);
  },
};
