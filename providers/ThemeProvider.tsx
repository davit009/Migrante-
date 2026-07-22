'use client';

// ============================================================
// providers/ThemeProvider.tsx
// Proveedor de tema claro/oscuro usando next-themes.
// ============================================================

import { ThemeProvider as NextThemesProvider } from 'next-themes';

interface ThemeProviderProps {
  children: React.ReactNode;
}

/**
 * Envuelve la app con next-themes para soporte de dark/light mode.
 * - defaultTheme: 'system' — respeta la preferencia del sistema operativo
 * - enableSystem: true — detecta prefers-color-scheme
 * - disableTransitionOnChange: false — permite transiciones suaves de tema
 * - attribute: 'class' — Tailwind CSS dark mode por clase en <html>
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
    >
      {children}
    </NextThemesProvider>
  );
}
