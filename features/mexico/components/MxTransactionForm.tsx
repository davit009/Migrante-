'use client';

// ============================================================
// features/mexico/components/MxTransactionForm.tsx
// Formulario de Modo México — igual que el de Ahorros, sin
// selector de moneda (todo es MXN, sin conversión).
// ============================================================

import { useState } from 'react';
import Link from 'next/link';
import { CATEGORIES, filterActiveCategories } from '@/constants/categories';
import { getTodayISO } from '@/utils/date.utils';
import { useAuth } from '@/features/auth/hooks/useAuth';
import type { MxTransactionCreate, TransactionType, TransactionCategory } from '@/types/app.types';

import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ListChecks, Plus } from 'lucide-react';

interface MxTransactionFormProps {
  onSubmit: (values: MxTransactionCreate) => Promise<unknown>;
  isSubmitting: boolean;
}

export function MxTransactionForm({ onSubmit, isSubmitting }: MxTransactionFormProps) {
  const { profile } = useAuth();
  const [tipo, setTipo] = useState<TransactionType>('gasto');
  const [categoria, setCategoria] = useState<TransactionCategory | ''>('');
  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');
  const [fecha, setFecha] = useState(getTodayISO());

  const categoriesForTipo = CATEGORIES.filter((c) => c.tipo === tipo || c.tipo === 'ambos');
  const availableCategories = filterActiveCategories(categoriesForTipo, profile?.categorias_activas);

  // Si la categoría guardada en el estado ya no aplica (cambió el tipo, o
  // el perfil recién cargó), se deriva la primera categoría activa
  // disponible en su lugar — sin efecto, para no disparar renders en cadena.
  const categoriaValue: TransactionCategory | '' = availableCategories.some((c) => c.value === categoria)
    ? categoria
    : ((availableCategories[0]?.value as TransactionCategory) ?? '');

  const handleTipoChange = (nuevoTipo: TransactionType) => {
    setTipo(nuevoTipo);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const montoNum = parseFloat(monto);
    if (isNaN(montoNum) || montoNum <= 0 || !categoriaValue) return;

    await onSubmit({
      tipo,
      categoria: categoriaValue,
      descripcion: descripcion || undefined,
      monto: montoNum,
      fecha,
    });

    setMonto('');
    setDescripcion('');
  };

  return (
    <Card className="p-5 rounded-3xl border-border bg-card shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-base text-foreground">Registrar Movimiento</h3>

        <div className="grid grid-cols-2 gap-1 p-1 bg-muted rounded-xl">
          <button
            type="button"
            onClick={() => handleTipoChange('gasto')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              tipo === 'gasto' ? 'bg-destructive text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Gasto
          </button>
          <button
            type="button"
            onClick={() => handleTipoChange('ingreso')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              tipo === 'ingreso' ? 'bg-success text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Ingreso
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="mx-monto" className="text-xs">Monto (MXN)</Label>
          <Input
            id="mx-monto"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            className="h-11 rounded-xl text-lg font-bold tabular"
            autoFocus
          />
        </div>

        {availableCategories.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-muted/40 p-3 flex items-start gap-2">
            <ListChecks className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground">
              Aún no activas categorías de {tipo === 'ingreso' ? 'ingreso' : 'gasto'}.{' '}
              <Link href="/settings" className="text-primary font-semibold hover:underline">
                Actívalas en Configuración
              </Link>
              .
            </p>
          </div>
        ) : (
        <div className="space-y-1">
          <Label htmlFor="mx-cat" className="text-xs">Categoría</Label>
          <Select value={categoriaValue} onValueChange={(val) => val && setCategoria(val as TransactionCategory)}>
            <SelectTrigger id="mx-cat" className="h-11 rounded-xl">
              <SelectValue placeholder="Selecciona categoría..." />
            </SelectTrigger>
            <SelectContent className="max-h-52 rounded-2xl">
              {availableCategories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value} className="rounded-xl cursor-pointer">
                  <span className="mr-2">{cat.emoji}</span>
                  <span>{cat.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        )}

        <div className="space-y-1">
          <Label htmlFor="mx-desc" className="text-xs">Descripción (opcional)</Label>
          <Input
            id="mx-desc"
            placeholder="Ej: Pago de quincena, Renta del departamento..."
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="h-10 rounded-xl"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="mx-fecha" className="text-xs">Fecha</Label>
          <Input
            id="mx-fecha"
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="h-10 rounded-xl"
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting || availableCategories.length === 0}
          className={`w-full h-11 rounded-2xl font-semibold text-white gap-2 shadow-sm ${
            tipo === 'ingreso' ? 'bg-success hover:bg-success/90' : 'bg-destructive hover:bg-destructive/90'
          }`}
        >
          <Plus className="w-4 h-4" />
          {isSubmitting ? 'Guardando...' : `Registrar ${tipo === 'ingreso' ? 'Ingreso' : 'Gasto'}`}
        </Button>
      </form>
    </Card>
  );
}
