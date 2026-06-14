-- ============================================================
-- IMPERIUM · Fase 4 — Permisos de administración sobre perfiles
-- - Los admin pueden editar cualquier perfil (para cambiar roles).
-- - Nadie puede auto-ascenderse a admin: un trigger impide cambiar
--   el campo `role` salvo que quien hace el cambio sea admin.
--   (La escritura en games/guides/guide_steps ya está limitada a
--    admins por las políticas de la Fase 2.)
-- ============================================================

-- Un admin puede actualizar cualquier perfil (se combina OR con
-- "editar tu propio perfil" de la Fase 1).
drop policy if exists "admin edita cualquier perfil" on public.profiles;
create policy "admin edita cualquier perfil"
  on public.profiles for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Blindaje: solo un admin puede cambiar el rol de un perfil.
-- Evita que un usuario normal se ponga role = 'admin' a sí mismo.
create or replace function public.protect_profile_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role and not public.is_admin() then
    raise exception 'Solo un administrador puede cambiar el rol';
  end if;
  return new;
end;
$$;

drop trigger if exists protect_profile_role on public.profiles;
create trigger protect_profile_role
  before update on public.profiles
  for each row execute function public.protect_profile_role();
