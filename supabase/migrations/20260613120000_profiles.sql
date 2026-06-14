-- ============================================================
-- IMPERIUM · Fase 1 — Tabla de perfiles + RLS + creación automática
-- Pegar y ejecutar en Supabase → SQL Editor.
-- ============================================================

-- 1) Tabla de perfiles (ligada a auth.users)
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  discord_id  text,
  username    text,
  avatar_url  text,
  role        text not null default 'user' check (role in ('user', 'admin')),
  created_at  timestamptz not null default now()
);

-- 2) Row Level Security
alter table public.profiles enable row level security;

-- Cualquier usuario autenticado puede VER los perfiles (para el roster).
drop policy if exists "perfiles visibles para autenticados" on public.profiles;
create policy "perfiles visibles para autenticados"
  on public.profiles for select
  to authenticated
  using (true);

-- Cada usuario solo puede EDITAR su propio perfil.
drop policy if exists "editar tu propio perfil" on public.profiles;
create policy "editar tu propio perfil"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- 3) Crear el perfil automáticamente cuando un usuario entra por primera vez.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, discord_id, username, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data ->> 'provider_id',
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
