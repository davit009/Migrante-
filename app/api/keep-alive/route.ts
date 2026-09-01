// ============================================================
// app/api/keep-alive/route.ts
// Route Handler que hace una consulta mínima a Supabase para
// mantener el proyecto activo.
//
// Supabase pausa automáticamente los proyectos del plan gratuito
// tras ~7 días sin actividad en la API. Este endpoint, llamado
// periódicamente (ver .github/workflows/keep-alive.yml), genera
// esa actividad con una lectura pública y liviana.
// ============================================================

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const revalidate = 0;

export async function GET() {
  const supabase = await createClient();

  const { error } = await supabase
    .from('migrante_exchange_history')
    .select('id')
    .limit(1);

  if (error) {
    console.error('[keep-alive] Error:', error);
    return NextResponse.json(
      { status: 'error', message: error.message },
      { status: 503 }
    );
  }

  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
}
