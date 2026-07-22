// ============================================================
// app/(auth)/register/page.tsx
// Registro — Glass Card flotante sobre fondo animado
// ============================================================

import type { Metadata } from 'next';
import Link from 'next/link';
import { RegisterForm } from '@/features/auth/components/RegisterForm';

export const metadata: Metadata = {
  title: 'Crear cuenta | Migrante$',
  description: 'Crea tu cuenta gratuita en Migrante$',
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      {/* Logo + Título */}
      <div className="text-center space-y-2 mb-8 enter-up">
        <div className="w-16 h-16 rounded-3xl glass flex items-center justify-center mx-auto mb-4 text-3xl">
          💵
        </div>
        <h1 className="text-2xl font-black tracking-tight">
          Crea tu cuenta gratis
        </h1>
        <p className="text-sm text-muted-foreground">
          Empieza a controlar tus finanzas con Migrante<span className="text-primary font-bold">$</span>
        </p>
      </div>

      {/* Glass Card del formulario */}
      <div className="w-full max-w-sm glass-strong rounded-3xl p-6 space-y-5 enter-up" style={{ animationDelay: '80ms' }}>
        <RegisterForm />
      </div>

      {/* Link a Login */}
      <p className="mt-6 text-sm text-muted-foreground enter-up" style={{ animationDelay: '160ms' }}>
        ¿Ya tienes cuenta?{' '}
        <Link
          href="/login"
          className="text-primary font-semibold hover:underline underline-offset-4"
        >
          Iniciar sesión
        </Link>
      </p>

      {/* Volver al conversor */}
      <Link
        href="/"
        className="mt-4 text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors enter-up"
        style={{ animationDelay: '200ms' }}
      >
        ← Probar el conversor primero
      </Link>
    </div>
  );
}
