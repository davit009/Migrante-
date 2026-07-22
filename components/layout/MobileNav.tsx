'use client';

// ============================================================
// components/layout/MobileNav.tsx
// Glass Bottom Tab Bar — Liquid Glass, Mobile-First
// ============================================================

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  Calculator, 
  PiggyBank, 
  Settings 
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Inicio', icon: LayoutDashboard },
  { href: '/converter', label: 'Conversor', icon: ArrowLeftRight },
  { href: '/calculator', label: 'Compras', icon: Calculator },
  { href: '/savings', label: 'Ahorros', icon: PiggyBank },
  { href: '/settings', label: 'Ajustes', icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="glass-nav fixed bottom-0 left-0 right-0 z-50"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center gap-1 flex-1 py-1 relative"
            >
              {/* Pill indicador activo */}
              <div
                className={`relative flex items-center justify-center w-12 h-8 rounded-2xl transition-all duration-300 ${
                  isActive
                    ? 'glass-pill-active'
                    : ''
                }`}
              >
                <Icon
                  className={`transition-all duration-300 ${
                    isActive
                      ? 'w-5 h-5 text-primary'
                      : 'w-5 h-5 text-muted-foreground'
                  }`}
                  strokeWidth={isActive ? 2.5 : 1.75}
                />
              </div>
              <span
                className={`text-[10px] font-medium tracking-tight transition-all duration-300 ${
                  isActive ? 'text-primary font-semibold' : 'text-muted-foreground'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
