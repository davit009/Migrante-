// ============================================================
// app/(auth)/register/page.tsx
// Página de registro de Migrante$
// ============================================================

import type { Metadata } from 'next';
import { RegisterForm } from '@/features/auth/components/RegisterForm';

export const metadata: Metadata = {
  title: 'Crear Cuenta | Migrante$',
  description: 'Regístrate gratis en Migrante$ y toma el control de tus ingresos y compras en dólares y pesos.',
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 sm:p-6">
      <div className="w-full max-w-md space-y-8">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-3xl mb-2">
            💵
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Migrante<span className="text-primary">$</span>
          </h1>
          <p className="text-muted-foreground text-sm max-w-xs mx-auto">
            Crea tu cuenta gratuita en menos de 1 minuto
          </p>
        </div>

        {/* Card de Autenticación */}
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
