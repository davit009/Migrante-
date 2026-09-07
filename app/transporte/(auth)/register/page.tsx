'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/transporte/ui/button';
import { Input } from '@/components/transporte/ui/input';
import { Card } from '@/components/transporte/ui/card';

export default function TransporteRegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);

    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({ email, password });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    if (!data.session) {
      setInfo('Revisa tu correo para confirmar la cuenta antes de iniciar sesión.');
      return;
    }

    router.replace('/transporte/dashboard');
    router.refresh();
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="text-center space-y-2 mb-8">
        <div className="w-14 h-14 rounded-2xl bg-[var(--tp-primary)]/10 flex items-center justify-center mx-auto mb-4 text-2xl">
          🚌
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Crea tu cuenta</h1>
        <p className="text-sm text-[var(--tp-muted-foreground)]">
          Empieza a estimar el saldo de tu tarjeta de transporte
        </p>
      </div>

      <Card className="w-full max-w-sm p-6">
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium" htmlFor="email">
              Correo electrónico
            </label>
            <Input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium" htmlFor="password">
              Contraseña
            </label>
            <Input
              id="password"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-[var(--tp-destructive)]">{error}</p>}
          {info && <p className="text-sm text-[var(--tp-success)]">{info}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creando cuenta…' : 'Registrarme'}
          </Button>
        </form>
      </Card>

      <p className="mt-6 text-sm text-[var(--tp-muted-foreground)]">
        ¿Ya tienes cuenta?{' '}
        <Link href="/transporte/login" className="text-[var(--tp-primary)] font-semibold hover:underline">
          Inicia sesión
        </Link>
      </p>
      <p className="mt-2 text-xs text-[var(--tp-muted-foreground)]">
        Si ya tienes cuenta en Migrante$, mejor inicia sesión — es la misma cuenta.
      </p>
    </div>
  );
}
