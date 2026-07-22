// ============================================================
// app/(dashboard)/layout.tsx
// Layout autenticado — sin Sidebar, con Glass Navbar + Bottom Tab Bar
// ============================================================

import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { MobileNav } from '@/components/layout/MobileNav';

export const metadata: Metadata = {
  title: { template: '%s | Migrante$', default: 'Dashboard | Migrante$' },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Topbar Glass */}
      <Navbar />

      {/* Contenido con padding bottom para el Tab Bar + safe area */}
      <main className="flex-1 px-4 sm:px-5 py-5 pb-safe max-w-2xl w-full mx-auto">
        {children}
      </main>

      {/* Glass Bottom Tab Bar */}
      <MobileNav />
    </div>
  );
}
