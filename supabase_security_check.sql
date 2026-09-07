-- ============================================================
-- Migrante$ — Verificación de seguridad de Supabase
-- Corre esto en el SQL Editor de tu panel de Supabase cada vez que
-- agregues una tabla nueva (a este proyecto o al de Saldo Transporte,
-- ya que comparten base de datos). Es de solo lectura — no modifica
-- nada.
--
-- Qué revisa:
--   1. Toda tabla en "public" con Row Level Security (RLS) APAGADA
--      → cualquier usuario autenticado podría leer/escribir TODAS
--        las filas de esa tabla, de cualquier usuario.
--   2. Toda tabla con RLS encendida pero SIN ninguna policy
--      → con RLS sola (sin policies) Postgres niega todo por
--        defecto, así que esto normalmente se ve como "la función
--        no funciona" más que como fuga de datos, pero igual vale
--        la pena revisarlo.
--   3. Lista completa de policies por tabla, para confirmar a simple
--      vista que cada una filtra por auth.uid().
-- ============================================================

-- 1. Tablas SIN RLS (⚠️ la señal más importante — no debería haber ninguna)
SELECT
  schemaname,
  tablename,
  rowsecurity AS rls_activado
FROM pg_tables
WHERE schemaname = 'public'
  AND rowsecurity = false;

-- 2. Tablas CON RLS pero sin ninguna policy definida
SELECT
  t.tablename,
  t.rowsecurity AS rls_activado,
  COUNT(p.policyname) AS total_policies
FROM pg_tables t
LEFT JOIN pg_policies p
  ON p.schemaname = t.schemaname AND p.tablename = t.tablename
WHERE t.schemaname = 'public'
GROUP BY t.tablename, t.rowsecurity
HAVING t.rowsecurity = true AND COUNT(p.policyname) = 0;

-- 3. Listado completo de policies (revisa que "qual"/"with_check"
--    haga referencia a auth.uid() en toda tabla con datos por usuario)
SELECT
  tablename,
  policyname,
  cmd AS comando,
  qual AS condicion_using,
  with_check AS condicion_with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, cmd;
