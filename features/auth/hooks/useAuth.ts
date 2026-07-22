// ============================================================
// features/auth/hooks/useAuth.ts
// Hook de conveniencia para la autenticación en componentes UI
// ============================================================

import { useSupabase } from '@/providers/SupabaseProvider';
import { authService } from '../services/auth.service';

export function useAuth() {
  const { user, session, profile, isLoading, refreshProfile } = useSupabase();

  return {
    user,
    session,
    profile,
    isAuthenticated: !!user,
    isLoading,
    loginWithEmail: authService.loginWithEmail,
    registerWithEmail: authService.registerWithEmail,
    loginWithGoogle: authService.loginWithGoogle,
    logout: authService.logout,
    refreshProfile,
  };
}
