-- ── Endurecimiento de seguridad (revisión IMPERIUM) ───────────────────────────

-- 1) Cerrar el acceso SIN LOGIN a las funciones del scoreboard.
--    Solo se llaman desde server actions ya autenticadas (refreshScoreboard).
--    La migración original solo hizo GRANT a authenticated, pero nunca revocó el
--    grant por defecto a PUBLIC, lo que dejó a 'anon' capaz de sobrescribir el
--    message id del tablero vía /rest/v1/rpc. authenticated/service_role conservan acceso.
revoke execute on function public.set_scoreboard_message_id(text) from public, anon;
revoke execute on function public.get_scoreboard_message_id() from public, anon;

-- NOTA deliberada: is_admin()/is_staff()/upcoming_game_counts() se DEJAN accesibles a anon.
--   · is_admin/is_staff: las políticas RLS de tablas públicas (games, guides, heroes,
--     community_*) las invocan al evaluar consultas de VISITANTES ANÓNIMOS; revocar
--     EXECUTE a anon rompería la web pública (permission denied for function). Para anon
--     devuelven siempre false (auth.uid() es null), así que no hay escalada de privilegios.
--   · upcoming_game_counts: la portada pública la consume sin login.

-- 2) Índices de cobertura para claves foráneas usadas en filtros/RLS.
create index if not exists idx_change_requests_reviewer_id on public.change_requests (reviewer_id);
create index if not exists idx_game_subscriptions_user_id  on public.game_subscriptions (user_id);

-- 3) Buckets públicos: quitar la política SELECT amplia que permite LISTAR todos los
--    archivos del bucket. El acceso por URL pública (getPublicUrl) sigue funcionando
--    porque el bucket es public=true; esta política solo habilitaba list()/select por API,
--    que la app NO usa (solo upload + getPublicUrl). Evita enumerar uploads no publicados.
drop policy if exists "content: lectura publica" on storage.objects;
drop policy if exists "media: lectura publica" on storage.objects;
