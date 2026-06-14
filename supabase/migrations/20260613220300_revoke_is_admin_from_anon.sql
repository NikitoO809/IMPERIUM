-- ============================================================
-- IMPERIUM · Fase 2 — Quitar is_admin() a los visitantes sin sesión
-- Supabase concede EXECUTE directamente al rol anon (aparte de PUBLIC),
-- así que hay que revocarlo explícitamente. authenticated lo conserva
-- porque lo usan las políticas de escritura de admin.
-- ============================================================
revoke execute on function public.is_admin() from anon;
