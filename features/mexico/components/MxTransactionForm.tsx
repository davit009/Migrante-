'use client';

// ============================================================
// features/mexico/components/MxTransactionForm.tsx
// Formulario de Modo México — igual que el de Ahorros, sin
// selector de moneda (todo es MXN, sin conversión).
// ============================================================

import { useState } from 'react';
import { CATEGORIES } from '@/constants/categories';
import { getTodayISO } from '@/utils/date.utils';
import type { MxTransactionCreate, TransactionType, TransactionCategory } from '@/types/app.types';

import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';

interface MxTransactionFormProps {
  onSubmit: (values: MxTransactionCreate) => Promise<unknown>;
  isSubmitting: boolean;
}

export function MxTransactionForm({ onSubmit, isSubmitting }: MxTransactionFormProps) {
  const [tipo, setTipo] = useState<TransactionType>('gasto');
  const [categoria, setCategoria] = useState<TransactionCategory>('supermercado');
  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');
  const [fecha, setFecha] = useState(getTodayISO());

  const availableCategories = CATEGORIES.filter((c) => c.tipo === tipo || c.tipo === 'ambos');

  const handleTipoChange = (nuevoTipo: TransactionType) => {
    setTipo(nuevoTipo);
    setCategoria(nuevoTipo === 'ingreso' ? 'trabajo' : 'supermercado');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const montoNum = parseFloat(monto);
    if (isNaN(montoNum) || montoNum <= 0) return;

    await onSubmit({
      tipo,
      categoria,
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

        <div className="space-y-1">
          <Label htmlFor="mx-cat" className="text-xs">Categoría</Label>
          <Select value={categoria} onValueChange={(val) => val && setCategoria(val as TransactionCategory)}>
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
          disabled={isSubmitting}
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
