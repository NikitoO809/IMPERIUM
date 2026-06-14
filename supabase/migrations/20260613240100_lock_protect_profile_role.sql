-- ============================================================
-- IMPERIUM · Fase 4 — Cerrar el acceso directo a protect_profile_role()
-- Es una función de TRIGGER: no debe poder llamarse como RPC. Los
-- triggers se ejecutan sin necesidad de EXECUTE para el rol que hace
-- el UPDATE, así que revocarlo es seguro y quita el aviso del linter.
-- ============================================================
revoke execute on function public.protect_profile_role() from public;
revoke execute on function public.protect_profile_role() from anon;
revoke execute on function public.protect_profile_role() from authenticated;
