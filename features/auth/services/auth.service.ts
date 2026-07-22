// ============================================================
// features/auth/services/auth.service.ts
// Capa de servicio pura para Supabase Auth.
// Aislada de la UI: no contiene estado de React.
// ============================================================

import { createClient } from '@/lib/supabase/client';
import type { LoginFormValues, RegisterFormValues } from '@/validators/auth.schema';

export const authService = {
  /**
   * Inicia sesión con correo electrónico y contraseña.
   */
  async loginWithEmail({ email, password }: LoginFormValues) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(
        error.message === 'Invalid login credentials'
          ? 'Correo electrónico o contraseña incorrectos'
          : error.message
      );
    }

    return data;
  },

  /**
   * Registra un nuevo usuario con correo, contraseña y nombre.
   */
  async registerWithEmail({ email, password, nombre }: RegisterFormValues) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: nombre,
        },
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  /**
   * Inicia flujo OAuth con Google.
   */
  async loginWithGoogle() {
    const supabase = createClient();
    const redirectTo = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`;

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  /**
   * Cierra la sesión del usuario actual.
   */
  async logout() {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  },

  /**
   * Obtiene la sesión actual.
   */
  async getSession() {
    const supabase = createClient();
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw new Error(error.message);
    return session;
  },

  /**
   * Obtiene el usuario autenticado actual.
   */
  async getCurrentUser() {
    const supabase = createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) return null;
    return user;
  },
};
