'use client';

// ============================================================
// app/(dashboard)/calculator/page.tsx
// Calculadora de Compras Rápida — Liquid Glass Mobile-First
// ============================================================

import { useState, useEffect } from 'react';
import { StateSelectorUsa } from '@/features/calculator/components/StateSelectorUsa';
import { CalculatorSummary } from '@/features/calculator/components/CalculatorSummary';
import { calculateSalesTax } from '@/utils/tax.utils';
import { convertUSDtoMXN } from '@/utils/currency.utils';
import { useExchangeRate } from '@/features/converter/hooks/useExchangeRate';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { purchaseService } from '@/features/calculator/services/purchase.service';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, BookmarkPlus, ShoppingBag, Settings2, ChevronDown, ChevronUp } from 'lucide-react';
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
  const { isAuthenticated, profile } = useAuth();
  const router = useRouter();

  // Estado por defecto desde perfil o 'TX'
  const [selectedState, setSelectedState] = useState<string>('TX');
  const [showStateSelector, setShowStateSelector] = useState(false);

  // Lista de productos vacía por defecto
  const [items, setItems] = useState<Item[]>([]);

  // Formulario rápido (precio primero)
  const [newPrecio, setNewPrecio] = useState('');
  const [newNombre, setNewNombre] = useState('');
  const [newCantidad, setNewCantidad] = useState('1');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile?.estado_usa) {
      setSelectedState(profile.estado_usa);
    }
  }, [profile?.estado_usa]);

  // Cálculos de la lista
  const subtotal = items.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  const taxInfo = calculateSalesTax(subtotal, selectedState);
  const totalUSD = taxInfo.total;
  const totalMXN = convertUSDtoMXN(totalUSD, rate || 17.5);

  // Agregar producto (Nombre opcional)
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    const precio = parseFloat(newPrecio);
    const cantidad = parseInt(newCantidad) || 1;

    if (isNaN(precio) || precio <= 0) {
      toast.error('Ingresa un precio válido mayor a $0');
      return;
    }

    // Si el usuario no ingresa nombre, asignar "Producto #1", "Producto #2"...
    const nombreFinal = newNombre.trim() || `Producto #${items.length + 1}`;

    setItems((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        nombre: nombreFinal,
        precio,
        cantidad,
      },
    ]);

    setNewPrecio('');
    setNewNombre('');
    setNewCantidad('1');
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const clearList = () => {
    setItems([]);
  };

  const handleSaveList = async () => {
    if (!isAuthenticated) {
      toast.info('Crea tu cuenta para guardar tu lista de compras', {
        action: {
          label: 'Registrarse',
          onClick: () => router.push('/register'),
        },
      });
      return;
    }

    if (items.length === 0) {
      toast.error('Agrega al menos un precio a la lista');
      return;
    }

    try {
      setIsSaving(true);
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

      toast.success('Lista de compras guardada en tu historial');
      router.push('/history');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al guardar la lista');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-4">
      {/* Header */}
      <div className="flex items-center justify-between enter-up">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-primary" />
            Compras
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Suma tus gastos de compras rápidamente
          </p>
        </div>

        {/* Toggle para ajustar Estado de impuesto si se desea */}
        <button
          type="button"
          onClick={() => setShowStateSelector(!showStateSelector)}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground glass rounded-2xl px-3 py-1.5 btn-xs"
        >
          <Settings2 className="w-3.5 h-3.5" />
          <span>Tax ({selectedState})</span>
          {showStateSelector ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* Selector de Estado (Oculto por defecto) */}
      {showStateSelector && (
        <div className="glass rounded-3xl p-4 enter-up">
          <StateSelectorUsa
            selectedState={selectedState}
            onStateChange={setSelectedState}
          />
        </div>
      )}

      {/* Formulario Rápido de Agregar Precio */}
      <div className="glass rounded-3xl p-5 space-y-4 enter-up" style={{ animationDelay: '60ms' }}>
        <h3 className="font-bold text-sm text-foreground">Agregar costo</h3>
        
        <form onSubmit={handleAddItem} className="space-y-3">
          <div className="grid grid-cols-12 gap-3">
            {/* Precio USD (Input Principal) */}
            <div className="col-span-8 space-y-1">
              <Label htmlFor="prod-precio" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Precio ($ USD) *
              </Label>
              <Input
                id="prod-precio"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={newPrecio}
                onChange={(e) => setNewPrecio(e.target.value)}
                className="h-12 rounded-2xl glass border-0 bg-transparent text-xl font-bold finance-number focus-visible:ring-1 focus-visible:ring-primary/30"
                autoFocus
              />
            </div>

            {/* Cantidad */}
            <div className="col-span-4 space-y-1">
              <Label htmlFor="prod-cant" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Cant.
              </Label>
              <Input
                id="prod-cant"
                type="number"
                min="1"
                value={newCantidad}
                onChange={(e) => setNewCantidad(e.target.value)}
                className="h-12 rounded-2xl glass border-0 bg-transparent text-base font-bold text-center finance-number focus-visible:ring-1 focus-visible:ring-primary/30"
              />
            </div>
          </div>

          {/* Nombre (Opcional) */}
          <div className="space-y-1">
            <Label htmlFor="prod-nombre" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Nombre / Nota <span className="text-muted-foreground/60 font-normal lowercase">(opcional)</span>
            </Label>
            <Input
              id="prod-nombre"
              placeholder="Ej: Camisa, Víveres..."
              value={newNombre}
              onChange={(e) => setNewNombre(e.target.value)}
              className="h-11 rounded-2xl glass border-0 bg-transparent focus-visible:ring-1 focus-visible:ring-primary/30"
            />
          </div>

          <Button
            type="submit"
            className="w-full h-12 rounded-2xl font-semibold text-sm gradient-primary border-0 shadow-none flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
          >
            <Plus className="w-4 h-4" /> Agregar ítem
          </Button>
        </form>
      </div>

      {/* Lista de Productos + Resumen */}
      <div className="space-y-4 enter-up" style={{ animationDelay: '120ms' }}>
        <div className="flex items-center justify-between px-1">
          <h3 className="font-bold text-sm text-foreground">
            Lista ({items.length})
          </h3>
          {items.length > 0 && (
            <button
              onClick={clearList}
              className="text-xs text-rose-500 font-semibold hover:underline btn-xs"
            >
              Vaciar lista
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="glass rounded-3xl p-8 text-center space-y-1">
            <p className="text-xs font-semibold text-foreground">Tu lista está vacía</p>
            <p className="text-[11px] text-muted-foreground">
              Ingresa el precio arriba para ir sumando tus compras al instante.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="glass rounded-2xl p-3.5 flex items-center justify-between gap-3 glass-hover"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-xs text-foreground truncate">{item.nombre}</p>
                  <p className="text-[11px] text-muted-foreground finance-number">
                    ${item.precio.toFixed(2)} x {item.cantidad} u.
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-bold text-sm text-foreground finance-number">
                    ${(item.precio * item.cantidad).toFixed(2)}
                  </span>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="w-8 h-8 rounded-xl glass flex items-center justify-center text-muted-foreground hover:text-rose-500 transition-colors btn-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Resumen Final */}
        {items.length > 0 && (
          <div className="space-y-4 pt-2">
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
              disabled={isSaving}
              className="w-full h-12 rounded-2xl font-semibold text-sm gradient-primary border-0 flex items-center justify-center gap-2 shadow-none active:scale-[0.98] transition-transform"
            >
              <BookmarkPlus className="w-4 h-4" />
              {isSaving ? 'Guardando...' : 'Guardar compra en historial'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
