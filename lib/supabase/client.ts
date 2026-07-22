// ============================================================
// lib/supabase/client.ts
// Cliente de Supabase para uso en el BROWSER (Client Components).
// Singleton: una sola instancia por sesión de navegador.
// ============================================================

import { createBrowserClient } from '@supabase/ssr';

/**
 * Crea (o reutiliza) el cliente de Supabase para componentes del lado del cliente.
 * Usa @supabase/ssr que maneja correctamente las cookies en Next.js App Router.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
