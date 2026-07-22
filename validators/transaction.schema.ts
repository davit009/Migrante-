// ============================================================
// validators/transaction.schema.ts
// Esquemas Zod para transacciones (ingresos y gastos).
// ============================================================

import { z } from 'zod';
import { getTodayISO } from '@/utils/date.utils';

export const transactionSchema = z.object({
  tipo: z.enum(['ingreso', 'gasto'] as const, {
    error: 'Selecciona el tipo de transacción',
  }),
  categoria: z
    .string()
    .min(1, 'Selecciona una categoría'),
  descripcion: z
    .string()
    .max(200, 'La descripción no puede superar 200 caracteres')
    .optional()
    .or(z.literal('')),
  monto: z
    .number({ error: 'El monto debe ser un número mayor a cero' })
    .positive('El monto debe ser mayor a cero')
    .max(999999.99, 'El monto es demasiado grande'),
  moneda: z.enum(['USD', 'MXN'] as const).default('USD'),
  fecha: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha inválida')
    .default(getTodayISO),
});

export type TransactionFormValues = z.infer<typeof transactionSchema>;

// Schema para el string del input (antes de parsear a number)
export const transactionStringSchema = transactionSchema.extend({
  monto: z
    .string()
    .min(1, 'Ingresa el monto')
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: 'El monto debe ser un número mayor a cero',
    })
    .transform((val) => parseFloat(val)),
});
