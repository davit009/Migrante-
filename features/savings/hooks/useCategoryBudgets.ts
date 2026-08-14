'use client';

// ============================================================
// features/savings/hooks/useCategoryBudgets.ts
// Hook para consultar y administrar límites de presupuesto por categoría
// ============================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { budgetsService } from '../services/budgets.service';
import type { CategoryBudgetUpsert } from '@/types/app.types';
import { toast } from 'sonner';

export function useCategoryBudgets() {
  const queryClient = useQueryClient();

  const { data: budgets = [], isLoading } = useQuery({
    queryKey: ['category-budgets'],
    queryFn: () => budgetsService.getBudgets(),
  });

  const upsertMutation = useMutation({
    mutationFn: (payload: CategoryBudgetUpsert) => budgetsService.upsertBudget(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['category-budgets'] });
      toast.success('Límite de presupuesto guardado');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => budgetsService.deleteBudget(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['category-budgets'] });
      toast.success('Límite eliminado');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return {
    budgets,
    isLoading,
    upsertBudget: upsertMutation.mutateAsync,
    isSaving: upsertMutation.isPending,
    deleteBudget: deleteMutation.mutateAsync,
  };
}
