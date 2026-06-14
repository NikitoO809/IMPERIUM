-- La función is_admin() se usa dentro de las políticas RLS. Para que esas políticas
-- se evalúen sin "permission denied" (42501) al consultarlas desde la API (roles anon
-- y authenticated), esos roles deben poder ejecutarla. Es SECURITY DEFINER y solo
-- devuelve true/false según el rol del perfil del usuario actual.
grant execute on function public.is_admin() to anon, authenticated;
