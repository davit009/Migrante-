// ============================================================
// features/savings/services/budgets.service.ts
// Servicio para gestionar límites de presupuesto por categoría
// ============================================================

import { createClient } from '@/lib/supabase/client';
import type { CategoryBudget, CategoryBudgetUpsert } from '@/types/app.types';

export const budgetsService = {
  /**
   * Obtiene todos los límites de presupuesto del usuario.
   */
  async getBudgets(): Promise<CategoryBudget[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('migrante_category_budgets')
      .select('*');

    if (error) throw new Error(`Error al consultar presupuestos: ${error.message}`);
    return (data ?? []) as CategoryBudget[];
  },

  /**
   * Crea o actualiza el límite mensual de una categoría (una fila por
   * categoría y usuario — el límite es recurrente, no por mes).
   */
  async upsertBudget(payload: CategoryBudgetUpsert): Promise<CategoryBudget> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Debes iniciar sesión para definir un presupuesto');

    const { data, error } = await supabase
      .from('migrante_category_budgets')
      .upsert(
        {
          user_id: user.id,
          categoria: payload.categoria,
          limite_mensual: payload.limite_mensual,
          moneda: payload.moneda,
        },
        { onConflict: 'user_id,categoria' }
      )
      .select()
      .single();

    if (error) throw new Error(`Error al guardar el presupuesto: ${error.message}`);
    return data as CategoryBudget;
  },

  /**
   * Elimina el límite de presupuesto de una categoría.
   */
  async deleteBudget(id: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase.from('migrante_category_budgets').delete().eq('id', id);
    if (error) throw new Error(`Error al eliminar el presupuesto: ${error.message}`);
  },
};
