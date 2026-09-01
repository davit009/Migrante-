'use client';

// ============================================================
// features/savings/hooks/useSavings.ts
// Hook para consultar transacciones y calcular totales acumulados
// ============================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionService } from '../services/transaction.service';
import { useExchangeRate } from '@/features/converter/hooks/useExchangeRate';
import type { TransactionCreate } from '@/types/app.types';
import { toast } from 'sonner';

/**
 * @param monthKey - Filtra las transacciones (y totales) a un mes YYYY-MM.
 *                    Si se omite, se consideran todas las transacciones.
 */
export function useSavings(monthKey?: string) {
  const queryClient = useQueryClient();
  const { rate } = useExchangeRate();

  // Consulta de transacciones
  const {
    data: allTransactions = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => transactionService.getTransactions(),
  });

  const transactions = monthKey
    ? allTransactions.filter((t) => t.fecha.startsWith(monthKey))
    : allTransactions;

  // Mutación para agregar transacción
  const createMutation = useMutation({
    mutationFn: (payload: TransactionCreate) =>
      transactionService.createTransaction(payload, rate || 17.5),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Transacción registrada exitosamente');
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  // Mutación para eliminar transacción
  const deleteMutation = useMutation({
    mutationFn: (id: string) => transactionService.deleteTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Transacción eliminada');
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  // Cálculos consolidados en dólares
  const totalIngresosUSD = transactions
    .filter((t) => t.tipo === 'ingreso')
    .reduce((sum, t) => sum + (t.moneda === 'USD' ? t.monto : (t.monto_mxn ?? t.monto) / (t.tipo_cambio || rate || 1)), 0);

  const totalGastosUSD = transactions
    .filter((t) => t.tipo === 'gasto')
    .reduce((sum, t) => sum + (t.moneda === 'USD' ? t.monto : (t.monto_mxn ?? t.monto) / (t.tipo_cambio || rate || 1)), 0);

  const balanceUSD = totalIngresosUSD - totalGastosUSD;
  const balanceMXN = balanceUSD * (rate || 17.5);

  return {
    transactions,
    allTransactions,
    totalIngresosUSD,
    totalGastosUSD,
    balanceUSD,
    balanceMXN,
    isLoading,
    isError,
    error,
    refetch,
    addTransaction: createMutation.mutateAsync,
    deleteTransaction: deleteMutation.mutateAsync,
    isSubmitting: createMutation.isPending,
  };
}
