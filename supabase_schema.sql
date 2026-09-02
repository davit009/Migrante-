-- ============================================================
-- Migrante$ — Schema de Base de Datos PostgreSQL + RLS
-- Copia y ejecuta este script completo en el SQL Editor de tu panel de Supabase
--
-- IMPORTANTE: todas las tablas, funciones y triggers usan el prefijo
-- "migrante_" porque este proyecto comparte la base de datos con otro(s)
-- proyecto(s) — evita choques de nombres con sus tablas.
--
-- Este script es 100% seguro de volver a ejecutar las veces que sea
-- necesario (renombra en vez de recrear si ya existían tablas sin
-- prefijo de una corrida anterior, sin perder datos; y usa
-- DROP ... IF EXISTS antes de cada POLICY/TRIGGER para que nunca truene
-- por "ya existe").
-- ============================================================

-- 0. MIGRACIÓN DE NOMBRES ANTIGUOS (sin prefijo) → CON PREFIJO
-- No-op seguro si nunca corriste una versión anterior de este script.
ALTER TABLE IF EXISTS public.profiles RENAME TO migrante_profiles;
ALTER TABLE IF EXISTS public.transactions RENAME TO migrante_transactions;
ALTER TABLE IF EXISTS public.purchase_lists RENAME TO migrante_purchase_lists;
ALTER TABLE IF EXISTS public.purchase_items RENAME TO migrante_purchase_items;
ALTER TABLE IF EXISTS public.exchange_history RENAME TO migrante_exchange_history;
ALTER TABLE IF EXISTS public.saved_conversions RENAME TO migrante_saved_conversions;
ALTER TABLE IF EXISTS public.savings_goals RENAME TO migrante_savings_goals;
ALTER TABLE IF EXISTS public.category_budgets RENAME TO migrante_category_budgets;

-- 1. EXTENSIONES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLA: migrante_profiles (Perfil de usuario extendido de auth.users)
CREATE TABLE IF NOT EXISTS public.migrante_profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre      TEXT NOT NULL,
  pais        TEXT NOT NULL DEFAULT 'MX',
  estado_usa  TEXT,                           -- Ej: 'TX', 'CA', 'FL'
  moneda_pref TEXT NOT NULL DEFAULT 'USD',   -- 'USD' o 'MXN'
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS para migrante_profiles
ALTER TABLE public.migrante_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Los usuarios pueden ver su propio perfil" ON public.migrante_profiles;
CREATE POLICY "Los usuarios pueden ver su propio perfil"
  ON public.migrante_profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Los usuarios pueden actualizar su propio perfil" ON public.migrante_profiles;
CREATE POLICY "Los usuarios pueden actualizar su propio perfil"
  ON public.migrante_profiles FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Los usuarios pueden insertar su propio perfil" ON public.migrante_profiles;
CREATE POLICY "Los usuarios pueden insertar su propio perfil"
  ON public.migrante_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Función para actualizar `updated_at` (prefijada para no chocar con otro proyecto)
CREATE OR REPLACE FUNCTION migrante_update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.migrante_profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.migrante_profiles
  FOR EACH ROW
  EXECUTE PROCEDURE migrante_update_updated_at_column();

-- Función + trigger para crear perfil automáticamente al registrarse en Supabase Auth
CREATE OR REPLACE FUNCTION public.migrante_handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.migrante_profiles (id, nombre, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER migrante_on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.migrante_handle_new_user();


-- 3. TABLA: migrante_transactions (Ingresos y Gastos)
CREATE TABLE IF NOT EXISTS public.migrante_transactions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.migrante_profiles(id) ON DELETE CASCADE,
  tipo        TEXT NOT NULL CHECK (tipo IN ('ingreso', 'gasto')),
  categoria   TEXT NOT NULL,
  descripcion TEXT,
  monto       NUMERIC(12, 2) NOT NULL CHECK (monto > 0),
  moneda      TEXT NOT NULL DEFAULT 'USD' CHECK (moneda IN ('USD', 'MXN')),
  tipo_cambio NUMERIC(10, 4),
  monto_mxn   NUMERIC(12, 2),
  fecha       DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices de alto rendimiento para migrante_transactions
CREATE INDEX IF NOT EXISTS idx_migrante_transactions_user_id ON public.migrante_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_migrante_transactions_fecha ON public.migrante_transactions(fecha DESC);
CREATE INDEX IF NOT EXISTS idx_migrante_transactions_tipo ON public.migrante_transactions(tipo);

-- RLS para migrante_transactions
ALTER TABLE public.migrante_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Los usuarios solo ven sus propias transacciones" ON public.migrante_transactions;
CREATE POLICY "Los usuarios solo ven sus propias transacciones"
  ON public.migrante_transactions FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Los usuarios solo crean sus propias transacciones" ON public.migrante_transactions;
CREATE POLICY "Los usuarios solo crean sus propias transacciones"
  ON public.migrante_transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Los usuarios solo actualizan sus propias transacciones" ON public.migrante_transactions;
CREATE POLICY "Los usuarios solo actualizan sus propias transacciones"
  ON public.migrante_transactions FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Los usuarios solo eliminan sus propias transacciones" ON public.migrante_transactions;
CREATE POLICY "Los usuarios solo eliminan sus propias transacciones"
  ON public.migrante_transactions FOR DELETE
  USING (auth.uid() = user_id);


-- 4. TABLA: migrante_purchase_lists (Calculadora de Compras)
CREATE TABLE IF NOT EXISTS public.migrante_purchase_lists (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.migrante_profiles(id) ON DELETE CASCADE,
  nombre      TEXT,
  estado_usa  TEXT NOT NULL,
  subtotal    NUMERIC(12, 2) NOT NULL DEFAULT 0,
  impuesto    NUMERIC(12, 2) NOT NULL DEFAULT 0,
  tasa_imp    NUMERIC(5, 4) NOT NULL DEFAULT 0,
  total_usd   NUMERIC(12, 2) NOT NULL DEFAULT 0,
  tipo_cambio NUMERIC(10, 4) NOT NULL,
  total_mxn   NUMERIC(12, 2) NOT NULL DEFAULT 0,
  estado      TEXT NOT NULL DEFAULT 'borrador' CHECK (estado IN ('borrador', 'guardada')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_migrante_purchase_lists_user_id ON public.migrante_purchase_lists(user_id);

-- RLS para migrante_purchase_lists
ALTER TABLE public.migrante_purchase_lists ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Los usuarios administran sus listas de compra" ON public.migrante_purchase_lists;
CREATE POLICY "Los usuarios administran sus listas de compra"
  ON public.migrante_purchase_lists FOR ALL
  USING (auth.uid() = user_id);


-- 5. TABLA: migrante_purchase_items (Items de cada lista de compra)
CREATE TABLE IF NOT EXISTS public.migrante_purchase_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_id UUID NOT NULL REFERENCES public.migrante_purchase_lists(id) ON DELETE CASCADE,
  nombre      TEXT NOT NULL,
  precio      NUMERIC(10, 2) NOT NULL CHECK (precio >= 0),
  cantidad    INTEGER NOT NULL DEFAULT 1 CHECK (cantidad > 0),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_migrante_purchase_items_purchase_id ON public.migrante_purchase_items(purchase_id);

-- RLS para migrante_purchase_items (hereda seguridad a través de la lista de compras del usuario)
ALTER TABLE public.migrante_purchase_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Los usuarios administran los items de sus listas" ON public.migrante_purchase_items;
CREATE POLICY "Los usuarios administran los items de sus listas"
  ON public.migrante_purchase_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.migrante_purchase_lists
      WHERE migrante_purchase_lists.id = migrante_purchase_items.purchase_id
      AND migrante_purchase_lists.user_id = auth.uid()
    )
  );


-- 6. TABLA: migrante_exchange_history (Caché e Historial de Tipo de Cambio)
CREATE TABLE IF NOT EXISTS public.migrante_exchange_history (
  id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usd_mxn  NUMERIC(10, 4) NOT NULL,
  fuente   TEXT NOT NULL DEFAULT 'open.er-api.com',
  fecha    DATE NOT NULL DEFAULT CURRENT_DATE,
  CONSTRAINT unique_migrante_exchange_fecha UNIQUE (fecha)
);

CREATE INDEX IF NOT EXISTS idx_migrante_exchange_history_fecha ON public.migrante_exchange_history(fecha DESC);

-- RLS pública de lectura para migrante_exchange_history
ALTER TABLE public.migrante_exchange_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Lectura pública del tipo de cambio" ON public.migrante_exchange_history;
CREATE POLICY "Lectura pública del tipo de cambio"
  ON public.migrante_exchange_history FOR SELECT
  USING (true);


-- 7. TABLA: migrante_saved_conversions (Cálculos guardados del Conversor)
CREATE TABLE IF NOT EXISTS public.migrante_saved_conversions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES public.migrante_profiles(id) ON DELETE CASCADE,
  monto_origen    NUMERIC(12, 2) NOT NULL CHECK (monto_origen > 0),
  moneda_origen   TEXT NOT NULL CHECK (moneda_origen IN ('USD', 'MXN')),
  monto_destino   NUMERIC(12, 2) NOT NULL,
  moneda_destino  TEXT NOT NULL CHECK (moneda_destino IN ('USD', 'MXN')),
  tipo_cambio     NUMERIC(10, 4) NOT NULL,
  modo            TEXT NOT NULL DEFAULT 'promedio' CHECK (modo IN ('compra', 'venta', 'promedio')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_migrante_saved_conversions_user_id ON public.migrante_saved_conversions(user_id);

-- RLS para migrante_saved_conversions
ALTER TABLE public.migrante_saved_conversions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Los usuarios administran sus conversiones guardadas" ON public.migrante_saved_conversions;
CREATE POLICY "Los usuarios administran sus conversiones guardadas"
  ON public.migrante_saved_conversions FOR ALL
  USING (auth.uid() = user_id);


-- 8. TABLA: migrante_savings_goals (Metas de Ahorro)
CREATE TABLE IF NOT EXISTS public.migrante_savings_goals (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES public.migrante_profiles(id) ON DELETE CASCADE,
  nombre          TEXT NOT NULL,
  monto_objetivo  NUMERIC(12, 2) NOT NULL CHECK (monto_objetivo > 0),
  monto_actual    NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (monto_actual >= 0),
  moneda          TEXT NOT NULL DEFAULT 'USD' CHECK (moneda IN ('USD', 'MXN')),
  fecha_limite    DATE,
  estado          TEXT NOT NULL DEFAULT 'activa' CHECK (estado IN ('activa', 'completada', 'cancelada')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_migrante_savings_goals_user_id ON public.migrante_savings_goals(user_id);

-- RLS para migrante_savings_goals
ALTER TABLE public.migrante_savings_goals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Los usuarios administran sus metas de ahorro" ON public.migrante_savings_goals;
CREATE POLICY "Los usuarios administran sus metas de ahorro"
  ON public.migrante_savings_goals FOR ALL
  USING (auth.uid() = user_id);

DROP TRIGGER IF EXISTS update_savings_goals_updated_at ON public.migrante_savings_goals;
CREATE TRIGGER update_savings_goals_updated_at
  BEFORE UPDATE ON public.migrante_savings_goals
  FOR EACH ROW
  EXECUTE PROCEDURE migrante_update_updated_at_column();


-- 9. TABLA: migrante_category_budgets (Límite mensual recurrente por categoría)
CREATE TABLE IF NOT EXISTS public.migrante_category_budgets (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES public.migrante_profiles(id) ON DELETE CASCADE,
  categoria       TEXT NOT NULL,
  limite_mensual  NUMERIC(12, 2) NOT NULL CHECK (limite_mensual > 0),
  moneda          TEXT NOT NULL DEFAULT 'USD' CHECK (moneda IN ('USD', 'MXN')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_migrante_user_categoria_budget UNIQUE (user_id, categoria)
);

CREATE INDEX IF NOT EXISTS idx_migrante_category_budgets_user_id ON public.migrante_category_budgets(user_id);

-- RLS para migrante_category_budgets
ALTER TABLE public.migrante_category_budgets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Los usuarios administran sus presupuestos por categoría" ON public.migrante_category_budgets;
CREATE POLICY "Los usuarios administran sus presupuestos por categoría"
  ON public.migrante_category_budgets FOR ALL
  USING (auth.uid() = user_id);

DROP TRIGGER IF EXISTS update_category_budgets_updated_at ON public.migrante_category_budgets;
CREATE TRIGGER update_category_budgets_updated_at
  BEFORE UPDATE ON public.migrante_category_budgets
  FOR EACH ROW
  EXECUTE PROCEDURE migrante_update_updated_at_column();


-- 10. TABLA: migrante_payroll_entries (Pagos de nómina/autoempleo para el estimador de impuestos)
CREATE TABLE IF NOT EXISTS public.migrante_payroll_entries (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                  UUID NOT NULL REFERENCES public.migrante_profiles(id) ON DELETE CASCADE,
  fecha                    DATE NOT NULL,
  tipo_trabajador          TEXT NOT NULL CHECK (tipo_trabajador IN ('w2', '1099')),
  estado_usa               TEXT NOT NULL,
  monto_bruto              NUMERIC(12, 2) NOT NULL CHECK (monto_bruto > 0),
  retencion_federal_real   NUMERIC(12, 2),
  retencion_estatal_real   NUMERIC(12, 2),
  created_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_migrante_payroll_entries_user_id ON public.migrante_payroll_entries(user_id);

-- RLS para migrante_payroll_entries
ALTER TABLE public.migrante_payroll_entries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Los usuarios administran sus pagos de nómina" ON public.migrante_payroll_entries;
CREATE POLICY "Los usuarios administran sus pagos de nómina"
  ON public.migrante_payroll_entries FOR ALL
  USING (auth.uid() = user_id);

DROP TRIGGER IF EXISTS update_payroll_entries_updated_at ON public.migrante_payroll_entries;
CREATE TRIGGER update_payroll_entries_updated_at
  BEFORE UPDATE ON public.migrante_payroll_entries
  FOR EACH ROW
  EXECUTE PROCEDURE migrante_update_updated_at_column();
