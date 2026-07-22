// ============================================================
// validators/profile.schema.ts
// Esquemas Zod para el perfil de usuario.
// Un solo esquema genera los tipos TypeScript automáticamente.
// ============================================================

import { z } from 'zod';

export const profileSchema = z.object({
  nombre: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(60, 'El nombre no puede tener más de 60 caracteres')
    .trim(),
  pais: z
    .string()
    .length(2, 'Código de país inválido')
    .default('MX'),
  estado_usa: z
    .string()
    .length(2, 'Código de estado inválido')
    .optional()
    .nullable(),
  moneda_pref: z
    .enum(['USD', 'MXN'])
    .default('USD'),
  avatar_url: z
    .string()
    .url('URL de avatar inválida')
    .optional()
    .nullable(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
