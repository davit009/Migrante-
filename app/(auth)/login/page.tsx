// ============================================================
// app/(auth)/login/page.tsx
// Login — Glass Card flotante sobre fondo animado
// ============================================================

import type { Metadata } from 'next';
import Link from 'next/link';
import { LoginForm } from '@/features/auth/components/LoginForm';

export const metadata: Metadata = {
  title: 'Iniciar sesión | Migrante$',
  description: 'Accede a tu cuenta de Migrante$',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      {/* Logo + Título */}
      <div className="text-center space-y-2 mb-8 enter-up">
        <div className="w-16 h-16 rounded-3xl glass flex items-center justify-center mx-auto mb-4 text-3xl">
          💵
        </div>
        <h1 className="text-2xl font-black tracking-tight">
          Bienvenido de vuelta
        </h1>
        <p className="text-sm text-muted-foreground">
          Ingresa para continuar a Migrante<span className="text-primary font-bold">$</span>
        </p>
      </div>

      {/* Glass Card del formulario */}
      <div className="w-full max-w-sm glass-strong rounded-3xl p-6 space-y-5 enter-up" style={{ animationDelay: '80ms' }}>
        <LoginForm />
      </div>

      {/* Link a Registro */}
      <p className="mt-6 text-sm text-muted-foreground enter-up" style={{ animationDelay: '160ms' }}>
        ¿No tienes cuenta?{' '}
        <Link
          href="/register"
          className="text-primary font-semibold hover:underline underline-offset-4"
        >
          Regístrate gratis
        </Link>
      </p>

      {/* Volver al conversor */}
      <Link
        href="/"
        className="mt-4 text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors enter-up"
        style={{ animationDelay: '200ms' }}
      >
        ← Volver al conversor
      </Link>
    </div>
  );
}
