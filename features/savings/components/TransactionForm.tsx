'use client';

// ============================================================
// features/savings/components/TransactionForm.tsx
// Formulario modal/card para crear Ingresos o Gastos
// ============================================================

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { transactionStringSchema } from '@/validators/transaction.schema';
import { CATEGORIES } from '@/constants/categories';
import { getTodayISO } from '@/utils/date.utils';
import type { TransactionCreate, TransactionCategory } from '@/types/app.types';

import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';

interface TransactionFormProps {
  onSubmit: (values: TransactionCreate) => Promise<any>;
  isSubmitting: boolean;
}

export function TransactionForm({ onSubmit, isSubmitting }: TransactionFormProps) {
  const [tipo, setTipo] = useState<'ingreso' | 'gasto'>('gasto');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(transactionStringSchema),
    defaultValues: {
      tipo: 'gasto',
      categoria: 'supermercado',
      descripcion: '',
      monto: '',
      moneda: 'USD',
      fecha: getTodayISO(),
    },
  });

  const availableCategories = CATEGORIES.filter(
    (c) => c.tipo === tipo || c.tipo === 'ambos'
  );

  const handleFormSubmit = async (data: any) => {
    await onSubmit({
      tipo: data.tipo,
      categoria: data.categoria as TransactionCategory,
      descripcion: data.descripcion,
      monto: data.monto,
      moneda: data.moneda,
      fecha: data.fecha,
    });
    reset();
  };

  const monedaValue = watch('moneda') || 'USD';
  const categoriaValue = watch('categoria') || availableCategories[0]?.value || 'supermercado';

  return (
    <Card className="p-5 rounded-3xl border-border bg-card shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-base text-foreground">Registrar Movimiento</h3>
        
        {/* Toggle Ingreso / Gasto */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-muted rounded-xl">
          <button
            type="button"
            onClick={() => {
              setTipo('gasto');
              setValue('tipo', 'gasto');
              setValue('categoria', 'supermercado');
            }}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              tipo === 'gasto'
                ? 'bg-destructive text-white shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Gasto
          </button>
          <button
            type="button"
            onClick={() => {
              setTipo('ingreso');
              setValue('tipo', 'ingreso');
              setValue('categoria', 'trabajo');
            }}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              tipo === 'ingreso'
                ? 'bg-success text-white shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Ingreso
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-3">
        {/* Monto y Moneda */}
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-8 space-y-1">
            <Label htmlFor="tx-monto" className="text-xs">Monto</Label>
            <Input
              id="tx-monto"
              type="number"
              step="0.01"
              placeholder="0.00"
              className="h-11 rounded-xl text-lg font-bold tabular"
              {...register('monto')}
            />
            {errors.monto && (
              <p className="text-xs text-destructive">{errors.monto.message as string}</p>
            )}
          </div>

          <div className="col-span-4 space-y-1">
            <Label htmlFor="tx-moneda" className="text-xs">Moneda</Label>
            <Select value={monedaValue} onValueChange={(val) => val && setValue('moneda', val)}>
              <SelectTrigger id="tx-moneda" className="h-11 rounded-xl font-semibold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="MXN">MXN ($)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Categoría */}
        <div className="space-y-1">
          <Label htmlFor="tx-cat" className="text-xs">Categoría</Label>
          <Select
            value={categoriaValue}
            onValueChange={(val) => val && setValue('categoria', val)}
          >
            <SelectTrigger id="tx-cat" className="h-11 rounded-xl">
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

        {/* Descripción */}
        <div className="space-y-1">
          <Label htmlFor="tx-desc" className="text-xs">Descripción (opcional)</Label>
          <Input
            id="tx-desc"
            placeholder="Ej: Pago de quincena, Renta del departamento..."
            className="h-10 rounded-xl"
            {...register('descripcion')}
          />
        </div>

        {/* Fecha */}
        <div className="space-y-1">
          <Label htmlFor="tx-fecha" className="text-xs">Fecha</Label>
          <Input
            id="tx-fecha"
            type="date"
            className="h-10 rounded-xl"
            {...register('fecha')}
          />
        </div>

        {/* Submit Button */}
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
