'use client';

// ============================================================
// features/payroll-tax/hooks/usePayrollEntries.ts
// Hook para consultar y registrar pagos de nómina/autoempleo
// ============================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { payrollService } from '../services/payroll.service';
import type { PayrollEntryCreate } from '@/types/app.types';
import { toast } from 'sonner';

export function usePayrollEntries() {
  const queryClient = useQueryClient();

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ['payroll-entries'],
    queryFn: () => payrollService.getEntries(),
  });

  const createMutation = useMutation({
    mutationFn: (payload: PayrollEntryCreate) => payrollService.createEntry(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payroll-entries'] });
      toast.success('Pago registrado');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => payrollService.deleteEntry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payroll-entries'] });
      toast.success('Pago eliminado');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return {
    entries,
    isLoading,
    createEntry: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    deleteEntry: deleteMutation.mutateAsync,
  };
}
