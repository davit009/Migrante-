// ============================================================
// services/profiles.service.ts
// Capa de servicio para operaciones con la tabla profiles
// ============================================================

import { createClient } from '@/lib/supabase/client';
import type { UserProfile } from '@/types/app.types';
import type { ProfileFormValues } from '@/validators/profile.schema';

export const profilesService = {
  /**
   * Obtiene el perfil del usuario actual por su ID.
   */
  async getProfile(userId: string): Promise<UserProfile | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // No encontrado
      throw new Error(`Error al obtener el perfil: ${error.message}`);
    }

    return data as UserProfile;
  },

  /**
   * Actualiza el perfil del usuario.
   */
  async updateProfile(userId: string, updates: Partial<ProfileFormValues>): Promise<UserProfile> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(`Error al actualizar el perfil: ${error.message}`);
    }

    return data as UserProfile;
  },
};
