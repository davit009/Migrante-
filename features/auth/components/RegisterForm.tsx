'use client';

// ============================================================
// features/auth/components/RegisterForm.tsx
// Formulario de Registro — Liquid Glass Mobile-First
// ============================================================

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { registerSchema, type RegisterFormValues } from '@/validators/auth.schema';
import { useAuth } from '../hooks/useAuth';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const inputClass =
  'h-12 rounded-2xl glass border-0 bg-transparent text-sm focus-visible:ring-1 focus-visible:ring-primary/30';

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { registerWithEmail } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nombre: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      setIsLoading(true);
      await registerWithEmail(values);
      toast.success('¡Cuenta creada! Bienvenido a Migrante$');
      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al crear la cuenta');
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Nombre */}
      <div className="space-y-1.5">
        <Label htmlFor="nombre" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Nombre completo
        </Label>
        <Input
          id="nombre"
          type="text"
          placeholder="Juan Pérez"
          disabled={isLoading}
          className={inputClass}
          {...register('nombre')}
        />
        {errors.nombre && (
          <p className="text-xs text-destructive">{errors.nombre.message}</p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <Label htmlFor="reg-email" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Correo electrónico
        </Label>
        <Input
          id="reg-email"
          type="email"
          placeholder="tu@correo.com"
          disabled={isLoading}
          className={inputClass}
          {...register('email')}
        />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <Label htmlFor="reg-password" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Contraseña
        </Label>
        <Input
          id="reg-password"
          type="password"
          placeholder="Mín. 8 caracteres, 1 mayúscula, 1 número"
          disabled={isLoading}
          className={inputClass}
          {...register('password')}
        />
        {errors.password && (
          <p className="text-xs text-destructive">{errors.password.message}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-1.5">
        <Label htmlFor="confirmPassword" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Confirmar contraseña
        </Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Repite tu contraseña"
          disabled={isLoading}
          className={inputClass}
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && (
          <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
        )}
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-12 rounded-2xl font-semibold text-sm gradient-primary border-0 shadow-none active:scale-[0.98] transition-transform mt-2"
      >
        {isLoading ? 'Creando cuenta...' : 'Crear cuenta gratis →'}
      </Button>
    </form>
  );
}
