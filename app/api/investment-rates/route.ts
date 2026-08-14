// ============================================================
// app/api/investment-rates/route.ts
// Route Handler para las tasas del Simulador de Inversión:
//   - CETES 28 días (Banxico SIE API — requiere BANXICO_TOKEN)
//   - Bitcoin (CoinGecko — pública, sin token)
//
// Si una fuente falla o no hay token configurado, se responde con
// un valor de referencia estático y `esEnVivo: false`, para que el
// simulador siga funcionando (con el disclaimer correspondiente en UI).
// ============================================================

import { NextResponse } from 'next/server';
import type { InvestmentRatesResponse } from '@/types/api.types';

// Serie de Banxico SIE: "CETES a 28 días, Tasa de rendimiento" (verificar en
// https://www.banxico.org.mx/SieAPIRest/service/v1/ si Banxico reasigna IDs).
const CETES_28_SERIES_ID = 'SF43936';
const CETES_FALLBACK_RATE = 0.1; // 10% anual — valor de referencia si no hay token o falla la consulta

// Cachear en el edge por 6 horas: ambas tasas cambian poco intradía
export const revalidate = 21600;

async function getCetesRate(): Promise<InvestmentRatesResponse['cetes']> {
  const today = new Date().toISOString().split('T')[0];
  const token = process.env.BANXICO_TOKEN;

  if (!token) {
    return { tasaAnual: CETES_FALLBACK_RATE, esEnVivo: false, fecha: today };
  }

  try {
    const res = await fetch(
      `https://www.banxico.org.mx/SieAPIRest/service/v1/series/${CETES_28_SERIES_ID}/datos/oportuno`,
      { headers: { 'Bmx-Token': token }, next: { revalidate } }
    );

    if (!res.ok) throw new Error(`Banxico API error: ${res.status}`);

    const json = await res.json();
    const dato = json?.bmx?.series?.[0]?.datos?.[0];
    const tasaAnual = parseFloat(dato?.dato) / 100;

    if (!dato || isNaN(tasaAnual)) throw new Error('Respuesta de Banxico sin datos válidos');

    return { tasaAnual, esEnVivo: true, fecha: today };
  } catch (error) {
    console.error('[investment-rates] CETES error:', error);
    return { tasaAnual: CETES_FALLBACK_RATE, esEnVivo: false, fecha: today };
  }
}

async function getBitcoinData(): Promise<InvestmentRatesResponse['bitcoin']> {
  const today = new Date().toISOString().split('T')[0];
  const FALLBACK_PRICE = 65000;

  try {
    const currentRes = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd',
      { next: { revalidate } }
    );
    if (!currentRes.ok) throw new Error(`CoinGecko error: ${currentRes.status}`);
    const currentJson = await currentRes.json();
    const precioUSD = currentJson?.bitcoin?.usd;
    if (!precioUSD) throw new Error('CoinGecko sin precio actual');

    // Precio hace ~1 año, para mostrar variación histórica (retrospectiva, no predicción)
    let variacion1AnioPct: number | null = null;
    try {
      const oneYearAgo = new Date();
      oneYearAgo.setDate(oneYearAgo.getDate() - 365);
      const dd = String(oneYearAgo.getDate()).padStart(2, '0');
      const mm = String(oneYearAgo.getMonth() + 1).padStart(2, '0');
      const yyyy = oneYearAgo.getFullYear();

      const historyRes = await fetch(
        `https://api.coingecko.com/api/v3/coins/bitcoin/history?date=${dd}-${mm}-${yyyy}`,
        { next: { revalidate } }
      );
      if (historyRes.ok) {
        const historyJson = await historyRes.json();
        const precioHace1Anio = historyJson?.market_data?.current_price?.usd;
        if (precioHace1Anio) {
          variacion1AnioPct = (precioUSD - precioHace1Anio) / precioHace1Anio;
        }
      }
    } catch {
      // La variación histórica es opcional; si falla, se omite sin romper el precio actual
    }

    return { precioUSD, variacion1AnioPct, esEnVivo: true, fecha: today };
  } catch (error) {
    console.error('[investment-rates] Bitcoin error:', error);
    return { precioUSD: FALLBACK_PRICE, variacion1AnioPct: null, esEnVivo: false, fecha: today };
  }
}

export async function GET() {
  const [cetes, bitcoin] = await Promise.all([getCetesRate(), getBitcoinData()]);

  const response: InvestmentRatesResponse = { cetes, bitcoin };
  return NextResponse.json(response);
}
