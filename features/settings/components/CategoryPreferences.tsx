'use client';

// ============================================================
// features/settings/components/CategoryPreferences.tsx
// "Mis categorías" — el usuario arma su propia lista de categorías
// desde cero. Las que no ha activado aparecen sombreadas como
// sugerencia; un tap las activa (o desactiva).
// ============================================================

import { useState } from 'react';
import { toast } from 'sonner';
import { CATEGORIES, type Category } from '@/constants/categories';
import { profilesService } from '@/services/profiles.service';
import { Card } from '@/components/ui/card';
import { ListChecks, Check } from 'lucide-react';

interface CategoryPreferencesProps {
  userId: string;
  categoriasActivas: string[];
  onSaved: () => void | Promise<void>;
}

const GROUPS: { titulo: string; filtro: (c: Category) => boolean }[] = [
  { titulo: 'Ingresos', filtro: (c) => c.tipo === 'ingreso' },
  { titulo: 'Gastos', filtro: (c) => c.tipo === 'gasto' },
  { titulo: 'General', filtro: (c) => c.tipo === 'ambos' },
];

export function CategoryPreferences({ userId, categoriasActivas, onSaved }: CategoryPreferencesProps) {
  const [activas, setActivas] = useState<Set<string>>(new Set(categoriasActivas));
  const [savingValue, setSavingValue] = useState<string | null>(null);

  const toggle = async (value: string) => {
    const next = new Set(activas);
    if (next.has(value)) next.delete(value);
    else next.add(value);

    setActivas(next);
    setSavingValue(value);

    try {
      await profilesService.updateActiveCategories(userId, Array.from(next));
      await onSaved();
    } catch (error) {
      setActivas(activas); // revertir si falla
      toast.error(error instanceof Error ? error.message : 'No se pudo guardar');
    } finally {
      setSavingValue(null);
    }
  };

  return (
    <Card className="p-6 sm:p-8 rounded-3xl border-border bg-card shadow-sm space-y-5">
      <div className="flex items-start gap-2.5">
        <ListChecks className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div>
          <h3 className="font-bold text-base text-foreground">Mis categorías</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Elige las categorías que de verdad usas. Las sombreadas son solo sugerencias — tócalas para activarlas
            y que aparezcan al registrar un movimiento. Ej: si no tienes carro, deja &quot;Gasolina&quot; sin activar.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {GROUPS.map((group) => {
          const items = CATEGORIES.filter(group.filtro);
          if (items.length === 0) return null;

          return (
            <div key={group.titulo} className="space-y-2">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                {group.titulo}
              </span>
              <div className="flex flex-wrap gap-2">
                {items.map((cat) => {
                  const isActive = activas.has(cat.value);
                  const isSaving = savingValue === cat.value;

                  return (
                    <button
                      key={cat.value}
                      type="button"
                      disabled={isSaving}
                      onClick={() => toggle(cat.value)}
                      aria-pressed={isActive}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all disabled:opacity-60 ${
                        isActive
                          ? 'bg-primary/10 border border-primary/40 text-foreground font-semibold'
                          : 'border border-dashed border-border text-muted-foreground opacity-60 hover:opacity-100 hover:border-primary/40'
                      }`}
                    >
                      {isActive && <Check className="w-3 h-3 text-primary" />}
                      <span>{cat.emoji}</span>
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
