'use client';

// ============================================================
// app/(dashboard)/history/page.tsx
// Historial Unificado de Movimientos y Listas de Compras Guardadas
// ============================================================

import { useQuery } from '@tanstack/react-query';
import { purchaseService } from '@/features/calculator/services/purchase.service';
import { conversionService } from '@/features/converter/services/conversion.service';
import { useSavings } from '@/features/savings/hooks/useSavings';
import { formatUSD, formatMXN, formatCurrency, formatRate } from '@/utils/currency.utils';
import { formatDateShort } from '@/utils/date.utils';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { History, ShoppingBag, PiggyBank, ArrowLeftRight, Download } from 'lucide-react';
import { getCategoryByValue } from '@/constants/categories';
import { arrayToCSV, downloadCSV } from '@/utils/csv.utils';
import { getTodayISO } from '@/utils/date.utils';

export default function HistoryPage() {
  const { transactions, isLoading: isTxLoading } = useSavings();

  const { data: purchaseLists = [], isLoading: isPurchasesLoading } = useQuery({
    queryKey: ['purchase-lists'],
    queryFn: () => purchaseService.getPurchaseLists(),
  });

  const { data: conversions = [], isLoading: isConversionsLoading } = useQuery({
    queryKey: ['saved-conversions'],
    queryFn: () => conversionService.getConversions(),
  });

  const exportMovimientos = () => {
    const csv = arrayToCSV(
      transactions.map((tx) => ({
        fecha: tx.fecha,
        tipo: tx.tipo,
        categoria: getCategoryByValue(tx.categoria)?.label ?? tx.categoria,
        descripcion: tx.descripcion ?? '',
        monto: tx.monto,
        moneda: tx.moneda,
        monto_mxn: tx.monto_mxn ?? '',
      })),
      [
        { key: 'fecha', label: 'Fecha' },
        { key: 'tipo', label: 'Tipo' },
        { key: 'categoria', label: 'Categoría' },
        { key: 'descripcion', label: 'Descripción' },
        { key: 'monto', label: 'Monto' },
        { key: 'moneda', label: 'Moneda' },
        { key: 'monto_mxn', label: 'Monto MXN' },
      ]
    );
    downloadCSV(`migrante-movimientos-${getTodayISO()}.csv`, csv);
  };

  const exportCompras = () => {
    const csv = arrayToCSV(
      purchaseLists.map((list) => ({
        fecha: list.created_at.split('T')[0],
        nombre: list.nombre ?? '',
        estado_usa: list.estado_usa,
        subtotal: list.subtotal,
        impuesto: list.impuesto,
        total_usd: list.total_usd,
        total_mxn: list.total_mxn,
      })),
      [
        { key: 'fecha', label: 'Fecha' },
        { key: 'nombre', label: 'Nombre' },
        { key: 'estado_usa', label: 'Estado' },
        { key: 'subtotal', label: 'Subtotal' },
        { key: 'impuesto', label: 'Impuesto' },
        { key: 'total_usd', label: 'Total USD' },
        { key: 'total_mxn', label: 'Total MXN' },
      ]
    );
    downloadCSV(`migrante-compras-${getTodayISO()}.csv`, csv);
  };

  const exportConversiones = () => {
    const csv = arrayToCSV(
      conversions.map((conv) => ({
        fecha: conv.created_at.split('T')[0],
        monto_origen: conv.monto_origen,
        moneda_origen: conv.moneda_origen,
        monto_destino: conv.monto_destino,
        moneda_destino: conv.moneda_destino,
        tipo_cambio: conv.tipo_cambio,
        modo: conv.modo,
      })),
      [
        { key: 'fecha', label: 'Fecha' },
        { key: 'monto_origen', label: 'Monto Origen' },
        { key: 'moneda_origen', label: 'Moneda Origen' },
        { key: 'monto_destino', label: 'Monto Destino' },
        { key: 'moneda_destino', label: 'Moneda Destino' },
        { key: 'tipo_cambio', label: 'Tipo de Cambio' },
        { key: 'modo', label: 'Modo' },
      ]
    );
    downloadCSV(`migrante-conversiones-${getTodayISO()}.csv`, csv);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-2">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
          <History className="w-7 h-7 text-primary" />
          Historial Financiero
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Consulta el histórico de tus compras con impuestos y tus registros de ingresos/gastos.
        </p>
      </div>

      <Tabs defaultValue="movimientos" className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full max-w-xl h-12 rounded-2xl bg-muted p-1">
          <TabsTrigger value="movimientos" className="rounded-xl font-semibold text-xs sm:text-sm">
            <PiggyBank className="w-4 h-4 mr-2" /> Movimientos ({transactions.length})
          </TabsTrigger>
          <TabsTrigger value="compras" className="rounded-xl font-semibold text-xs sm:text-sm">
            <ShoppingBag className="w-4 h-4 mr-2" /> Compras ({purchaseLists.length})
          </TabsTrigger>
          <TabsTrigger value="conversiones" className="rounded-xl font-semibold text-xs sm:text-sm">
            <ArrowLeftRight className="w-4 h-4 mr-2" /> Conversiones ({conversions.length})
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Movimientos */}
        <TabsContent value="movimientos" className="space-y-3">
          {transactions.length > 0 && (
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={exportMovimientos} className="h-8 rounded-lg text-xs gap-1.5">
                <Download className="w-3.5 h-3.5" /> Exportar CSV
              </Button>
            </div>
          )}
          {isTxLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 rounded-2xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <Card className="p-8 rounded-2xl text-center text-muted-foreground text-sm">
              Sin registros de movimientos en el historial.
            </Card>
          ) : (
            transactions.map((tx) => {
              const cat = getCategoryByValue(tx.categoria);
              const isIncome = tx.tipo === 'ingreso';

              return (
                <Card key={tx.id} className="p-4 rounded-2xl border-border bg-card flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-muted flex items-center justify-center text-xl">
                      {cat?.emoji ?? '📌'}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-foreground">{tx.descripcion || cat?.label}</p>
                      <p className="text-xs text-muted-foreground">{formatDateShort(tx.fecha)}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className={`font-bold text-sm tabular ${isIncome ? 'text-success' : 'text-destructive'}`}>
                      {isIncome ? '+' : '-'}{formatUSD(tx.monto)}
                    </p>
                    <p className="text-[11px] text-muted-foreground tabular">
                      ≈ {formatMXN(tx.monto_mxn ?? tx.monto * 17.5)}
                    </p>
                  </div>
                </Card>
              );
            })
          )}
        </TabsContent>

        {/* Tab 2: Compras Guardadas */}
        <TabsContent value="compras" className="space-y-4">
          {purchaseLists.length > 0 && (
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={exportCompras} className="h-8 rounded-lg text-xs gap-1.5">
                <Download className="w-3.5 h-3.5" /> Exportar CSV
              </Button>
            </div>
          )}
          {isPurchasesLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-24 rounded-2xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : purchaseLists.length === 0 ? (
            <Card className="p-8 rounded-2xl text-center text-muted-foreground text-sm">
              Sin compras guardadas en el historial. Prueba guardar una lista desde la Calculadora.
            </Card>
          ) : (
            purchaseLists.map((list) => (
              <Card key={list.id} className="p-5 rounded-3xl border-border bg-card space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-base text-foreground">{list.nombre}</h3>
                    <p className="text-xs text-muted-foreground">
                      Estado: {list.estado_usa} • {formatDateShort(list.created_at)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-lg text-foreground block tabular">{formatUSD(list.total_usd)}</span>
                    <span className="text-xs font-semibold text-primary block tabular">≈ {formatMXN(list.total_mxn)}</span>
                  </div>
                </div>

                {/* Items */}
                {list.items && list.items.length > 0 && (
                  <div className="pt-2 border-t border-border/60 flex flex-wrap gap-2">
                    {list.items.map((item) => (
                      <Badge key={item.id} variant="secondary" className="text-xs rounded-xl px-2.5 py-1">
                        {item.nombre} ({item.cantidad}x) - ${item.precio}
                      </Badge>
                    ))}
                  </div>
                )}
              </Card>
            ))
          )}
        </TabsContent>

        {/* Tab 3: Conversiones Guardadas */}
        <TabsContent value="conversiones" className="space-y-3">
          {conversions.length > 0 && (
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={exportConversiones} className="h-8 rounded-lg text-xs gap-1.5">
                <Download className="w-3.5 h-3.5" /> Exportar CSV
              </Button>
            </div>
          )}
          {isConversionsLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 rounded-2xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : conversions.length === 0 ? (
            <Card className="p-8 rounded-2xl text-center text-muted-foreground text-sm">
              Sin conversiones guardadas. Prueba guardar un cálculo desde el Conversor.
            </Card>
          ) : (
            conversions.map((conv) => (
              <Card key={conv.id} className="p-4 rounded-2xl border-border bg-card flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-muted flex items-center justify-center text-xl shrink-0">
                    <ArrowLeftRight className="w-4 h-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-foreground">
                      {formatCurrency(conv.monto_origen, conv.moneda_origen)} → {formatCurrency(conv.monto_destino, conv.moneda_destino)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      1 USD = {formatRate(conv.tipo_cambio)} MXN • {formatDateShort(conv.created_at.split('T')[0])}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-[10px] px-2 py-0.5 rounded-md capitalize shrink-0">
                  {conv.modo}
                </Badge>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
