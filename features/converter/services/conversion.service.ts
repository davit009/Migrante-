// ============================================================
// features/converter/services/conversion.service.ts
// Servicio para guardar y consultar conversiones del Conversor
// ============================================================

import { createClient } from '@/lib/supabase/client';
import type { ConversionResult } from '@/types/app.types';

export interface SavedConversion extends ConversionResult {
  id: string;
  user_id: string;
  created_at: string;
}

export const conversionService = {
  /**
   * Guarda un cálculo de conversión en el historial del usuario.
   */
  async saveConversion(result: ConversionResult): Promise<SavedConversion> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Debes iniciar sesión para guardar conversiones');

    const { data, error } = await supabase
      .from('saved_conversions')
      .insert({
        user_id: user.id,
        monto_origen: result.monto_origen,
        moneda_origen: result.moneda_origen,
        monto_destino: result.monto_destino,
        moneda_destino: result.moneda_destino,
        tipo_cambio: result.tipo_cambio,
        modo: result.modo,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Error al guardar la conversión: ${error.message}`);
    }

    return data as SavedConversion;
  },

  /**
   * Consulta las conversiones guardadas del usuario, más recientes primero.
   */
  async getConversions(): Promise<SavedConversion[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('saved_conversions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Error al consultar conversiones: ${error.message}`);
    return (data ?? []) as SavedConversion[];
  },
};
