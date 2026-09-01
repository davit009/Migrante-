'use client';

// ============================================================
// features/savings/hooks/useSavingsGoals.ts
// Hook para consultar y administrar metas de ahorro
// ============================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { goalsService } from '../services/goals.service';
import type { SavingsGoal, SavingsGoalCreate } from '@/types/app.types';
import { toast } from 'sonner';

export function useSavingsGoals() {
  const queryClient = useQueryClient();

  const { data: goals = [], isLoading } = useQuery({
    queryKey: ['savings-goals'],
    queryFn: () => goalsService.getGoals(),
  });

  const createMutation = useMutation({
    mutationFn: (payload: SavingsGoalCreate) => goalsService.createGoal(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savings-goals'] });
      toast.success('Meta de ahorro creada');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const contributeMutation = useMutation({
    mutationFn: ({ goal, amount }: { goal: SavingsGoal; amount: number }) =>
      goalsService.contributeToGoal(goal, amount),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['savings-goals'] });
      toast.success(
        updated.estado === 'completada'
          ? `¡Meta "${updated.nombre}" completada! 🎉`
          : 'Progreso agregado a tu meta'
      );
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => goalsService.deleteGoal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savings-goals'] });
      toast.success('Meta eliminada');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return {
    goals,
    isLoading,
    createGoal: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    contribute: contributeMutation.mutateAsync,
    isContributing: contributeMutation.isPending,
    deleteGoal: deleteMutation.mutateAsync,
  };
}
