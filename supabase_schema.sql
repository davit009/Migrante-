-- ============================================================
-- Migrante$ — Schema Inicial de Base de Datos PostgreSQL + RLS
-- Proyecto: https://nirwjsofvpcdifaasghw.supabase.co
-- Copia y ejecuta este script en el SQL Editor de tu panel de Supabase
-- ============================================================

-- 1. EXTENSIONES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLA: profiles (Perfil de usuario extendido de auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre      TEXT NOT NULL,
  pais        TEXT NOT NULL DEFAULT 'MX',
  estado_usa  TEXT,                           -- Ej: 'TX', 'CA', 'FL'
  moneda_pref TEXT NOT NULL DEFAULT 'USD',   -- 'USD' o 'MXN'
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS para profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Los usuarios pueden ver su propio perfil"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Los usuarios pueden actualizar su propio perfil"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Los usuarios pueden insertar su propio perfil"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Trigger para actualizar `updated_at` en profiles
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- Trigger para crear perfil automáticamente cuando un usuario se registra en Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, nombre, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- 3. TABLA: transactions (Ingresos y Gastos)
CREATE TABLE IF NOT EXISTS public.transactions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
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

-- Índices de alto rendimiento para transactions
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_fecha ON public.transactions(fecha DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_tipo ON public.transactions(tipo);

-- RLS para transactions
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Los usuarios solo ven sus propias transacciones"
  ON public.transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios solo crean sus propias transacciones"
  ON public.transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Los usuarios solo actualizan sus propias transacciones"
  ON public.transactions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios solo eliminan sus propias transacciones"
  ON public.transactions FOR DELETE
  USING (auth.uid() = user_id);


-- 4. TABLA: purchase_lists (Calculadora de Compras)
CREATE TABLE IF NOT EXISTS public.purchase_lists (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
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

CREATE INDEX IF NOT EXISTS idx_purchase_lists_user_id ON public.purchase_lists(user_id);

-- RLS para purchase_lists
ALTER TABLE public.purchase_lists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Los usuarios administran sus listas de compra"
  ON public.purchase_lists FOR ALL
  USING (auth.uid() = user_id);


-- 5. TABLA: purchase_items (Items de cada lista de compra)
CREATE TABLE IF NOT EXISTS public.purchase_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_id UUID NOT NULL REFERENCES public.purchase_lists(id) ON DELETE CASCADE,
  nombre      TEXT NOT NULL,
  precio      NUMERIC(10, 2) NOT NULL CHECK (precio >= 0),
  cantidad    INTEGER NOT NULL DEFAULT 1 CHECK (cantidad > 0),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_purchase_items_purchase_id ON public.purchase_items(purchase_id);

-- RLS para purchase_items (hereda seguridad a través de la lista de compras del usuario)
ALTER TABLE public.purchase_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Los usuarios administran los items de sus listas"
  ON public.purchase_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.purchase_lists
      WHERE purchase_lists.id = purchase_items.purchase_id
      AND purchase_lists.user_id = auth.uid()
    )
  );


-- 6. TABLA: exchange_history (Caché e Historial de Tipo de Cambio)
CREATE TABLE IF NOT EXISTS public.exchange_history (
  id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usd_mxn  NUMERIC(10, 4) NOT NULL,
  fuente   TEXT NOT NULL DEFAULT 'open.er-api.com',
  fecha    DATE NOT NULL DEFAULT CURRENT_DATE,
  CONSTRAINT unique_exchange_fecha UNIQUE (fecha)
);

CREATE INDEX IF NOT EXISTS idx_exchange_history_fecha ON public.exchange_history(fecha DESC);

-- RLS pública de lectura para exchange_history
ALTER TABLE public.exchange_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura pública del tipo de cambio"
  ON public.exchange_history FOR SELECT
  USING (true);
