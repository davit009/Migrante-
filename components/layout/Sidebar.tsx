'use client';

// ============================================================
// components/layout/Sidebar.tsx
// Navegación lateral para pantallas medianas y grandes (Desktop)
// Estética: Modern Bank / Enterprise Minimalist
// ============================================================

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  Calculator, 
  PiggyBank, 
  History, 
  Settings, 
  LogOut 
} from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/converter', label: 'Conversor USD/MXN', icon: ArrowLeftRight },
  { href: '/calculator', label: 'Calculadora de Compras', icon: Calculator },
  { href: '/savings', label: 'Control de Ahorros', icon: PiggyBank },
  { href: '/history', label: 'Historial', icon: History },
  { href: '/settings', label: 'Configuración', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout, profile, user } = useAuth();

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card/60 backdrop-blur-md min-h-screen p-4 sticky top-0 h-screen justify-between">
      <div className="space-y-6">
        {/* Branding */}
        <div className="flex items-center gap-2.5 px-3 py-2">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-xl">
            💵
          </div>
          <div>
            <span className="font-bold text-xl tracking-tight text-foreground">
              Migrante<span className="text-primary">$</span>
            </span>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
              Finanzas Inteligentes
            </p>
          </div>
        </div>

        {/* Menú de Navegación */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm font-semibold'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Perfil & Logout */}
      <div className="pt-4 border-t border-border space-y-3">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">
            {profile?.nombre?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">
              {profile?.nombre ?? 'Usuario'}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email}
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => logout()}
          className="w-full justify-start gap-2.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl px-3 py-2 text-xs"
        >
          <LogOut className="w-4 h-4" />
          Cerrar Sesión
        </Button>
      </div>
    </aside>
  );
}
