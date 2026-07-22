// ============================================================
// lib/supabase/server.ts
// Cliente de Supabase para uso en el SERVIDOR (Server Components,
// Route Handlers, Server Actions).
//
// IMPORTANTE: Este cliente lee/escribe cookies con `next/headers`,
// por lo que SOLO puede usarse en contextos server-side.
// ============================================================

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Crea un cliente de Supabase para Server Components y Route Handlers.
 * Debe llamarse dentro de una función async (cookies() es async en Next.js 14+).
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll puede fallar en Server Components (son read-only).
            // El middleware se encarga de refrescar el token en ese caso.
          }
        },
      },
    }
  );
}
