'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from '@/app/transporte/(dashboard)/actions';
import { Button } from '@/components/transporte/ui/button';
import { ArrowLeft } from 'lucide-react';

const LINKS = [
  { href: '/transporte/dashboard', label: 'Saldo' },
  { href: '/transporte/horarios', label: 'Horarios' },
  { href: '/transporte/historial', label: 'Historial' },
  { href: '/transporte/configuracion', label: 'Configuración' },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <header className="border-b border-[var(--tp-border)] bg-[var(--tp-card)]">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-6">
          <span className="text-lg font-bold">🚌 Saldo Transporte</span>
          <nav className="hidden sm:flex items-center gap-1">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'bg-[var(--tp-primary)] text-[var(--tp-primary-foreground)]'
                    : 'text-[var(--tp-muted-foreground)] hover:bg-[var(--tp-muted)]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="hidden sm:flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-[var(--tp-muted-foreground)] hover:bg-[var(--tp-muted)]"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Migrante$
          </Link>
          <form action={signOut}>
            <Button type="submit" variant="ghost">
              Salir
            </Button>
          </form>
        </div>
      </div>
      <nav className="flex sm:hidden items-center gap-1 px-4 pb-3 overflow-x-auto">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              pathname === link.href
                ? 'bg-[var(--tp-primary)] text-[var(--tp-primary-foreground)]'
                : 'text-[var(--tp-muted-foreground)] hover:bg-[var(--tp-muted)]'
            }`}
          >
            {link.label}
          </Link>
        ))}
        <Link
          href="/dashboard"
          className="whitespace-nowrap flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-[var(--tp-muted-foreground)]"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Migrante$
        </Link>
      </nav>
    </header>
  );
}
