'use client';

// ============================================================
// app/(dashboard)/settings/page.tsx
// Página de Configuración de Perfil y Preferencias
// ============================================================

import { useState } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { profilesService } from '@/services/profiles.service';
import { USA_STATES_LIST } from '@/constants/usa-states';

import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, User, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { user, profile, refreshProfile } = useAuth();

  const [nombre, setNombre] = useState(profile?.nombre ?? '');
  const [estadoUsa, setEstadoUsa] = useState(profile?.estado_usa ?? 'TX');
  const [monedaPref, setMonedaPref] = useState<'USD' | 'MXN'>(profile?.moneda_pref ?? 'USD');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!nombre.trim()) {
      toast.error('El nombre no puede estar vacío');
      return;
    }

    try {
      setIsSaving(true);
      await profilesService.updateProfile(user.id, {
        nombre: nombre.trim(),
        estado_usa: estadoUsa,
        moneda_pref: monedaPref,
      });

      await refreshProfile();
      toast.success('Perfil actualizado correctamente');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al actualizar el perfil');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto py-2">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
          <Settings className="w-7 h-7 text-primary" />
          Configuración
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Edita la información de tu perfil y tus preferencias regionales.
        </p>
      </div>

      <Card className="p-6 sm:p-8 rounded-3xl border-border bg-card shadow-sm space-y-6">
        <form onSubmit={handleSaveProfile} className="space-y-4">
          {/* Avatar & Email Info */}
          <div className="flex items-center gap-4 pb-4 border-b border-border">
            <div className="w-14 h-14 rounded-full bg-primary/10 text-primary font-bold text-xl flex items-center justify-center">
              {nombre[0]?.toUpperCase() ?? 'U'}
            </div>
            <div>
              <p className="font-bold text-base text-foreground">{nombre || 'Usuario'}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>

          {/* Nombre */}
          <div className="space-y-1.5">
            <Label htmlFor="set-nombre">Nombre completo</Label>
            <Input
              id="set-nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="h-11 rounded-xl"
            />
          </div>

          {/* Estado de EE.UU. Predeterminado */}
          <div className="space-y-1.5">
            <Label htmlFor="set-estado">Estado de residencia habitual en EE.UU.</Label>
            <Select value={estadoUsa} onValueChange={(val) => val && setEstadoUsa(val)}>
              <SelectTrigger id="set-estado" className="h-11 rounded-xl">
                <SelectValue placeholder="Selecciona estado..." />
              </SelectTrigger>
              <SelectContent className="max-h-56 rounded-2xl">
                {USA_STATES_LIST.map((st) => (
                  <SelectItem key={st.code} value={st.code} className="rounded-xl">
                    {st.name} ({st.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Moneda Preferida */}
          <div className="space-y-1.5">
            <Label htmlFor="set-moneda">Moneda principal de visualización</Label>
            <Select
              value={monedaPref}
              onValueChange={(val) => val && setMonedaPref(val as 'USD' | 'MXN')}
            >
              <SelectTrigger id="set-moneda" className="h-11 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="USD">🇺🇸 Dólar Estadounidense (USD)</SelectItem>
                <SelectItem value="MXN">🇲🇽 Peso Mexicano (MXN)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            disabled={isSaving}
            className="w-full h-11 rounded-xl font-semibold gap-2 shadow-sm pt-1"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
