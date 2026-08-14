'use client';

// ============================================================
// features/savings/components/SavingsGoalsSection.tsx
// Metas de Ahorro — crear, aportar progreso y eliminar
// ============================================================

import { useState } from 'react';
import type { SavingsGoal } from '@/types/app.types';
import { formatCurrency } from '@/utils/currency.utils';
import { formatDateShort } from '@/utils/date.utils';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Target, Plus, Trash2, PiggyBank } from 'lucide-react';

interface SavingsGoalsSectionProps {
  goals: SavingsGoal[];
  isLoading: boolean;
  onCreateGoal: (payload: { nombre: string; monto_objetivo: number; moneda: 'USD' | 'MXN'; fecha_limite?: string | null }) => Promise<unknown>;
  isCreating: boolean;
  onContribute: (goal: SavingsGoal, amount: number) => Promise<unknown>;
  isContributing: boolean;
  onDelete: (id: string) => Promise<unknown>;
}

export function SavingsGoalsSection({
  goals,
  isLoading,
  onCreateGoal,
  isCreating,
  onContribute,
  isContributing,
  onDelete,
}: SavingsGoalsSectionProps) {
  const [showNewGoal, setShowNewGoal] = useState(false);
  const [nombre, setNombre] = useState('');
  const [montoObjetivo, setMontoObjetivo] = useState('');
  const [moneda, setMoneda] = useState<'USD' | 'MXN'>('USD');
  const [fechaLimite, setFechaLimite] = useState('');

  const [contributingId, setContributingId] = useState<string | null>(null);
  const [contributionAmount, setContributionAmount] = useState('');

  const activeGoals = goals.filter((g) => g.estado !== 'cancelada');

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    const monto = parseFloat(montoObjetivo);
    if (!nombre.trim() || isNaN(monto) || monto <= 0) return;

    await onCreateGoal({
      nombre: nombre.trim(),
      monto_objetivo: monto,
      moneda,
      fecha_limite: fechaLimite || null,
    });

    setNombre('');
    setMontoObjetivo('');
    setMoneda('USD');
    setFechaLimite('');
    setShowNewGoal(false);
  };

  const handleContribute = async (goal: SavingsGoal) => {
    const amount = parseFloat(contributionAmount);
    if (isNaN(amount) || amount <= 0) return;
    await onContribute(goal, amount);
    setContributingId(null);
    setContributionAmount('');
  };

  return (
    <Card className="p-5 rounded-3xl border-border bg-card space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-base text-foreground flex items-center gap-2">
          <Target className="w-4 h-4 text-primary" /> Metas de Ahorro
        </h3>
        <button
          type="button"
          onClick={() => setShowNewGoal((v) => !v)}
          className="text-xs text-primary font-semibold hover:underline"
        >
          {showNewGoal ? 'Cancelar' : '+ Nueva meta'}
        </button>
      </div>

      {showNewGoal && (
        <form onSubmit={handleCreateGoal} className="space-y-3 p-3 rounded-2xl bg-muted/50">
          <div className="space-y-1">
            <Label htmlFor="goal-nombre" className="text-xs">Nombre de la meta</Label>
            <Input
              id="goal-nombre"
              placeholder="Ej: Viaje a casa, Fondo de emergencia..."
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="h-10 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-8 space-y-1">
              <Label htmlFor="goal-monto" className="text-xs">Monto objetivo</Label>
              <Input
                id="goal-monto"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={montoObjetivo}
                onChange={(e) => setMontoObjetivo(e.target.value)}
                className="h-10 rounded-xl font-semibold tabular"
              />
            </div>
            <div className="col-span-4 space-y-1">
              <Label htmlFor="goal-moneda" className="text-xs">Moneda</Label>
              <Select value={moneda} onValueChange={(val) => val && setMoneda(val as 'USD' | 'MXN')}>
                <SelectTrigger id="goal-moneda" className="h-10 rounded-xl font-semibold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="MXN">MXN</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="goal-fecha" className="text-xs">Fecha límite (opcional)</Label>
            <Input
              id="goal-fecha"
              type="date"
              value={fechaLimite}
              onChange={(e) => setFechaLimite(e.target.value)}
              className="h-10 rounded-xl"
            />
          </div>

          <Button
            type="submit"
            disabled={isCreating}
            className="w-full h-10 rounded-xl font-semibold text-xs gap-2"
          >
            <Plus className="w-3.5 h-3.5" />
            {isCreating ? 'Creando...' : 'Crear meta'}
          </Button>
        </form>
      )}

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-20 rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : activeGoals.length === 0 ? (
        <div className="text-center py-4 space-y-1">
          <PiggyBank className="w-6 h-6 text-muted-foreground mx-auto" />
          <p className="text-xs text-muted-foreground">
            Aún no tienes metas de ahorro. Crea una para empezar a rastrear tu progreso.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {activeGoals.map((goal) => {
            const pct = Math.min(100, Math.round((goal.monto_actual / goal.monto_objetivo) * 100));
            const isCompleted = goal.estado === 'completada';

            return (
              <div key={goal.id} className="p-3.5 rounded-2xl border border-border space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate flex items-center gap-1.5">
                      {goal.nombre}
                      {isCompleted && <span className="text-[10px]">🎉</span>}
                    </p>
                    {goal.fecha_limite && (
                      <p className="text-[10px] text-muted-foreground">
                        Meta: {formatDateShort(goal.fecha_limite)}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => onDelete(goal.id)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive shrink-0"
                    aria-label="Eliminar meta"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <Progress value={pct} />

                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground tabular">
                    {formatCurrency(goal.monto_actual, goal.moneda)} de {formatCurrency(goal.monto_objetivo, goal.moneda)}
                  </span>
                  <span className="text-muted-foreground tabular">{pct}%</span>
                </div>

                {!isCompleted && (
                  contributingId === goal.id ? (
                    <div className="flex items-center gap-2 pt-1">
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Monto a agregar"
                        value={contributionAmount}
                        onChange={(e) => setContributionAmount(e.target.value)}
                        className="h-9 rounded-xl text-sm flex-1"
                        autoFocus
                      />
                      <Button
                        type="button"
                        size="sm"
                        disabled={isContributing}
                        onClick={() => handleContribute(goal)}
                        className="h-9 rounded-xl text-xs px-3"
                      >
                        OK
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => { setContributingId(null); setContributionAmount(''); }}
                        className="h-9 rounded-xl text-xs px-2"
                      >
                        ✕
                      </Button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setContributingId(goal.id)}
                      className="text-xs text-primary font-semibold hover:underline pt-0.5"
                    >
                      + Agregar progreso
                    </button>
                  )
                )}
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
