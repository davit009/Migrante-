// ============================================================
// validators/purchase.schema.ts
// Esquemas Zod para la calculadora de compras.
// ============================================================

import { z } from 'zod';

export const purchaseItemSchema = z.object({
  nombre: z
    .string()
    .min(1, 'Escribe el nombre del producto')
    .max(100, 'Nombre demasiado largo')
    .trim(),
  precio: z
    .number({ error: 'El precio debe ser un número válido' })
    .nonnegative('El precio no puede ser negativo')
    .max(99999.99, 'Precio demasiado alto'),
  cantidad: z
    .number()
    .int('La cantidad debe ser un número entero')
    .positive('La cantidad mínima es 1')
    .max(999, 'Cantidad máxima: 999')
    .default(1),
});

export type PurchaseItemFormValues = z.infer<typeof purchaseItemSchema>;

export const purchaseListSchema = z.object({
  nombre: z
    .string()
    .max(80, 'El nombre no puede superar 80 caracteres')
    .optional()
    .or(z.literal('')),
  estado_usa: z
    .string()
    .length(2, 'Selecciona un estado'),
  items: z
    .array(purchaseItemSchema)
    .min(1, 'Agrega al menos un producto'),
});

export type PurchaseListFormValues = z.infer<typeof purchaseListSchema>;

// Schema para el input de precio como string
export const purchaseItemStringSchema = purchaseItemSchema.extend({
  precio: z
    .string()
    .min(1, 'Ingresa el precio')
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
      message: 'El precio debe ser un número válido',
    })
    .transform((val) => parseFloat(val)),
});
