// ============================================================
// app/api/exchange-rate/route.ts
// Route Handler serverless para el tipo de cambio USD/MXN.
//
// Estrategia de caché en 3 niveles:
//   1. Vercel Edge Cache: respuesta cacheada 1 hora
//   2. Supabase DB: un registro por día en exchange_history
//   3. Cliente: TanStack Query con staleTime de 30 min
//
// Resultado: máximo ~30 llamadas/mes a la API externa.
// ============================================================

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { ExchangeRateApiResponse, InternalExchangeRateResponse } from '@/types/api.types';

// Cachear en Vercel Edge por 1 hora (3600 segundos)
export const revalidate = 3600;

export async function GET() {
  try {
    const supabase = await createClient();
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    // ── Nivel 1: Buscar en DB si ya tenemos el tipo de hoy ──────
    const { data: cached } = await supabase
      .from('exchange_history')
      .select('*')
      .eq('fecha', today)
      .single();

    if (cached) {
      const response: InternalExchangeRateResponse = {
        usd_mxn: cached.usd_mxn,
        fecha: cached.fecha,
        fuente: 'cache_db',
      };
      return NextResponse.json(response);
    }

    // ── Nivel 2: Llamar a la API externa ────────────────────────
    const apiUrl = process.env.NEXT_PUBLIC_EXCHANGE_API_URL!;
    const apiRes = await fetch(apiUrl, {
      next: { revalidate: 3600 }, // Caché adicional de Vercel
    });

    if (!apiRes.ok) {
      throw new Error(`ExchangeRate API error: ${apiRes.status}`);
    }

    const apiData: ExchangeRateApiResponse = await apiRes.json();

    if (apiData.result !== 'success') {
      throw new Error('ExchangeRate API returned error result');
    }

    const usd_mxn = apiData.rates['MXN'];

    if (!usd_mxn || usd_mxn <= 0) {
      throw new Error('Invalid MXN rate from API');
    }

    // ── Guardar en DB para caché diaria ────────────────────────
    await supabase
      .from('exchange_history')
      .upsert(
        { fecha: today, usd_mxn, fuente: 'open.er-api.com' },
        { onConflict: 'fecha' } // UNIQUE(fecha) previene duplicados
      );

    const response: InternalExchangeRateResponse = {
      usd_mxn,
      fecha: today,
      fuente: 'api_external',
      time_last_update_utc: apiData.time_last_update_utc,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('[exchange-rate] Error:', error);

    // ── Fallback: último tipo de cambio conocido en DB ──────────
    try {
      const supabase = await createClient();
      const { data: lastKnown } = await supabase
        .from('exchange_history')
        .select('*')
        .order('fecha', { ascending: false })
        .limit(1)
        .single();

      if (lastKnown) {
        const response: InternalExchangeRateResponse = {
          usd_mxn: lastKnown.usd_mxn,
          fecha: lastKnown.fecha,
          fuente: 'cache_db',
        };
        return NextResponse.json(response, { status: 200 });
      }
    } catch {
      // Si todo falla, devolvemos error controlado
    }

    return NextResponse.json(
      { error: 'No se pudo obtener el tipo de cambio' },
      { status: 503 }
    );
  }
}
