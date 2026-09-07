'use client';

// ============================================================
// features/mexico/hooks/useMxTransactions.ts
// Hook para el ledger de Modo México — totales en MXN, sin
// conversión ni tipo de cambio.
// ============================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mxTransactionService } from '../services/mx-transaction.service';
import type { MxTransactionCreate } from '@/types/app.types';
import { toast } from 'sonner';

/**
 * @param monthKey - Filtra los movimientos (y totales) a un mes YYYY-MM.
 *                    Si se omite, se consideran todos los movimientos.
 */
export function useMxTransactions(monthKey?: string) {
  const queryClient = useQueryClient();

  const {
    data: allTransactions = [],
    isLoading,
  } = useQuery({
    queryKey: ['mx-transactions'],
    queryFn: () => mxTransactionService.getTransactions(),
  });

  const transactions = monthKey
    ? allTransactions.filter((t) => t.fecha.startsWith(monthKey))
    : allTransactions;

  const createMutation = useMutation({
    mutationFn: (payload: MxTransactionCreate) => mxTransactionService.createTransaction(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mx-transactions'] });
      toast.success('Movimiento registrado');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => mxTransactionService.deleteTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mx-transactions'] });
      toast.success('Movimiento eliminado');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const totalIngresos = transactions
    .filter((t) => t.tipo === 'ingreso')
    .reduce((sum, t) => sum + t.monto, 0);

  const totalGastos = transactions
    .filter((t) => t.tipo === 'gasto')
    .reduce((sum, t) => sum + t.monto, 0);

  const balance = totalIngresos - totalGastos;

  return {
    transactions,
    allTransactions,
    totalIngresos,
    totalGastos,
    balance,
    isLoading,
    addTransaction: createMutation.mutateAsync,
    deleteTransaction: deleteMutation.mutateAsync,
    isSubmitting: createMutation.isPending,
  };
}
