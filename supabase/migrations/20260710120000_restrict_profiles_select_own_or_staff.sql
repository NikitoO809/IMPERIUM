-- Endurecimiento de privacidad (auditoria 10/07/2026):
-- La tabla `profiles` era legible entera por cualquier usuario autenticado
-- (USING true), lo que exponia la columna `discord_id` via /rest/v1/profiles
-- aunque la UI nunca la muestra. El roster publico se lee por la vista
-- `public_profiles` (SECURITY DEFINER), que nunca expone discord_id.
--
-- A partir de ahora, sobre la tabla base: cada usuario ve solo su propia fila;
-- staff/admin ven todas (para el panel de administracion).
-- Verificado que no rompe: roster -> public_profiles, panel admin -> is_staff(),
-- hook use-is-admin -> lee solo la fila propia (.eq id, auth.uid()).

DROP POLICY IF EXISTS "perfiles visibles para autenticados" ON public.profiles;

CREATE POLICY "perfiles: propio o staff" ON public.profiles
  FOR SELECT TO authenticated
  USING (id = (SELECT auth.uid()) OR is_staff());
