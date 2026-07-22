'use client';

// ============================================================
// app/(dashboard)/calculator/page.tsx
// Módulo interactivo de Calculadora de Compras + Impuestos USA
// ============================================================

import { useState } from 'react';
import { StateSelectorUsa } from '@/features/calculator/components/StateSelectorUsa';
import { CalculatorSummary } from '@/features/calculator/components/CalculatorSummary';
import { calculateSalesTax } from '@/utils/tax.utils';
import { convertUSDtoMXN } from '@/utils/currency.utils';
import { useExchangeRate } from '@/features/converter/hooks/useExchangeRate';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { purchaseService } from '@/features/calculator/services/purchase.service';
import { USA_TAX_RATES } from '@/constants/usa-states';

import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, BookmarkPlus, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface Item {
  id: string;
  nombre: string;
  precio: number;
  cantidad: number;
}

export default function CalculatorPage() {
  const { rate } = useExchangeRate();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const [selectedState, setSelectedState] = useState<string>('TX');
  const [items, setItems] = useState<Item[]>([
    { id: '1', nombre: 'Supermercado / Víveres', precio: 45.50, cantidad: 1 },
    { id: '2', nombre: 'Ropa / Zapatos', precio: 89.99, cantidad: 1 },
  ]);

  // Formulario temporal de nuevo producto
  const [newNombre, setNewNombre] = useState('');
  const [newPrecio, setNewPrecio] = useState('');
  const [newCantidad, setNewCantidad] = useState('1');
  const [isSaving, setIsSaving] = useState(false);

  // Cálculos matemáticos de la lista
  const subtotal = items.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  const taxInfo = calculateSalesTax(subtotal, selectedState);
  const totalUSD = taxInfo.total;
  const totalMXN = convertUSDtoMXN(totalUSD, rate || 17.5);

  // Agregar producto
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    const precio = parseFloat(newPrecio);
    const cantidad = parseInt(newCantidad) || 1;

    if (!newNombre.trim()) {
      toast.error('Escribe el nombre del producto');
      return;
    }
    if (isNaN(precio) || precio <= 0) {
      toast.error('Ingresa un precio mayor a 0');
      return;
    }

    setItems((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        nombre: newNombre.trim(),
        precio,
        cantidad,
      },
    ]);

    setNewNombre('');
    setNewPrecio('');
    setNewCantidad('1');
  };

  // Eliminar producto
  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  // Vaciar lista
  const clearList = () => {
    setItems([]);
  };

  // Guardar lista en Supabase
  const handleSaveList = async () => {
    if (!isAuthenticated) {
      toast.info('Inicia sesión para guardar tus listas de compras', {
        action: {
          label: 'Iniciar sesión',
          onClick: () => router.push('/login'),
        },
      });
      return;
    }

    if (items.length === 0) {
      toast.error('Agrega al menos un producto a la lista');
      return;
    }

    try {
      setIsSaving(true);
      const stateObj = USA_TAX_RATES[selectedState];
      await purchaseService.savePurchaseList({
        estado_usa: selectedState,
        subtotal: taxInfo.subtotal,
        impuesto: taxInfo.impuesto,
        tasa_imp: taxInfo.tasa,
        total_usd: totalUSD,
        tipo_cambio: rate || 17.5,
        total_mxn: totalMXN,
        items: items.map((i) => ({
          nombre: i.nombre,
          precio: i.precio,
          cantidad: i.cantidad,
        })),
      });

      toast.success('Lista de compras guardada exitosamente');
      router.push('/history');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al guardar la lista');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-2">
      {/* Header del Módulo */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
          <ShoppingBag className="w-7 h-7 text-primary" />
          Calculadora de Compras
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Suma tus productos, calcula los impuestos por estado de EE.UU. y obtén el costo final en dólares y pesos.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Columna Izquierda: Formulario e Items (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Selector de Estado */}
          <Card className="p-5 rounded-3xl border-border bg-card shadow-sm">
            <StateSelectorUsa
              selectedState={selectedState}
              onStateChange={setSelectedState}
            />
          </Card>

          {/* Formulario de Agregar Producto */}
          <Card className="p-5 rounded-3xl border-border bg-card shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-foreground">Agregar Producto a la Lista</h3>
            <form onSubmit={handleAddItem} className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="prod-nombre" className="text-xs">Nombre del producto</Label>
                <Input
                  id="prod-nombre"
                  placeholder="Ej: Tenis, Mandado, Televisor..."
                  value={newNombre}
                  onChange={(e) => setNewNombre(e.target.value)}
                  className="h-10 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="prod-precio" className="text-xs">Precio unitario ($ USD)</Label>
                  <Input
                    id="prod-precio"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={newPrecio}
                    onChange={(e) => setNewPrecio(e.target.value)}
                    className="h-10 rounded-xl tabular"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="prod-cant" className="text-xs">Cantidad</Label>
                  <Input
                    id="prod-cant"
                    type="number"
                    min="1"
                    value={newCantidad}
                    onChange={(e) => setNewCantidad(e.target.value)}
                    className="h-10 rounded-xl tabular"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-10 rounded-xl font-medium gap-2 mt-1">
                <Plus className="w-4 h-4" /> Agregar Producto
              </Button>
            </form>
          </Card>

          {/* Lista de Productos */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-foreground">Productos ({items.length})</h3>
              {items.length > 0 && (
                <Button variant="ghost" size="sm" onClick={clearList} className="h-7 text-xs text-muted-foreground hover:text-destructive">
                  Vaciar lista
                </Button>
              )}
            </div>

            {items.length === 0 ? (
              <Card className="p-8 rounded-2xl border-dashed border-border bg-card/40 text-center text-xs text-muted-foreground">
                No hay productos en la lista. Agrega uno arriba para comenzar el cálculo.
              </Card>
            ) : (
              <div className="space-y-2">
                {items.map((item) => (
                  <Card key={item.id} className="p-3.5 rounded-2xl border-border bg-card flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-foreground truncate">{item.nombre}</p>
                      <p className="text-xs text-muted-foreground tabular">
                        ${item.precio.toFixed(2)} x {item.cantidad} u.
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-bold text-sm text-foreground tabular">
                        ${(item.precio * item.cantidad).toFixed(2)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                        className="w-8 h-8 rounded-xl text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Columna Derecha: Summary & Guardar (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <CalculatorSummary
            subtotal={taxInfo.subtotal}
            taxAmount={taxInfo.impuesto}
            taxRate={taxInfo.tasa}
            totalUSD={totalUSD}
            exchangeRate={rate || 17.5}
            totalMXN={totalMXN}
            stateName={taxInfo.estado_name}
          />

          <Button
            onClick={handleSaveList}
            disabled={isSaving || items.length === 0}
            className="w-full h-12 rounded-2xl text-base font-semibold shadow-sm gap-2"
          >
            <BookmarkPlus className="w-5 h-5" />
            {isSaving ? 'Guardando...' : 'Guardar Compra en Historial'}
          </Button>
        </div>
      </div>
    </div>
  );
}
