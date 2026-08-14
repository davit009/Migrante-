'use client';

// ============================================================
// features/auth/components/LoginForm.tsx
// Formulario de Inicio de Sesión validado con Zod + RHF
// ============================================================

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { loginSchema, type LoginFormValues } from '@/validators/auth.schema';
import { useAuth } from '../hooks/useAuth';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GoogleButton } from './GoogleButton';

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { loginWithEmail } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      setIsLoading(true);
      await loginWithEmail(values);
      toast.success('¡Bienvenido de nuevo!');
      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al iniciar sesión');
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Correo electrónico</Label>
          <Input
            id="email"
            type="email"
            placeholder="tu@correo.com"
            disabled={isLoading}
            className="h-12 rounded-2xl glass border-0 bg-transparent focus-visible:ring-1 focus-visible:ring-primary/30"
            {...register('email')}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Contraseña</Label>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            disabled={isLoading}
            className="h-12 rounded-2xl glass border-0 bg-transparent focus-visible:ring-1 focus-visible:ring-primary/30"
            {...register('password')}
          />
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 rounded-2xl font-semibold text-sm gradient-primary border-0 shadow-none active:scale-[0.98] transition-transform"
        >
          {isLoading ? 'Ingresando...' : 'Iniciar sesión →'}
        </Button>
      </form>

      {/* Divisor + Google */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-border/50" />
        <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
          O continúa con
        </span>
        <div className="flex-1 h-px bg-border/50" />
      </div>

      <GoogleButton />
    </div>
  );
}
