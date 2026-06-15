-- ============================================================
-- IMPERIUM · Contenido editable de la sección "Nosotros"
-- 3 partes: descripción general (singleton), historia (timeline) y
-- administradores. Lectura pública; escritura solo admin (is_admin()).
-- ============================================================

-- ── about_page (fila única con los textos generales) ─────────
create table if not exists public.about_page (
  id          int primary key default 1,
  intro       text,
  updated_at  timestamptz not null default now(),
  constraint about_page_singleton check (id = 1)
);

-- ── about_timeline (hitos de la historia) ────────────────────
create table if not exists public.about_timeline (
  id          uuid primary key default gen_random_uuid(),
  order_index int  not null default 0,
  year        text not null,
  title       text not null,
  description text,
  created_at  timestamptz not null default now()
);
create index if not exists about_timeline_order_idx on public.about_timeline (order_index);

-- ── about_admins (equipo que administra el sitio) ────────────
create table if not exists public.about_admins (
  id          uuid primary key default gen_random_uuid(),
  order_index int  not null default 0,
  name        text not null,
  role        text not null,
  bio         text,
  avatar_url  text,
  created_at  timestamptz not null default now()
);
create index if not exists about_admins_order_idx on public.about_admins (order_index);

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.about_page     enable row level security;
alter table public.about_timeline enable row level security;
alter table public.about_admins   enable row level security;

-- Lectura pública (la sección "Nosotros" es visible para todos)
drop policy if exists "about_page lectura publica" on public.about_page;
create policy "about_page lectura publica"
  on public.about_page for select using (true);

drop policy if exists "about_timeline lectura publica" on public.about_timeline;
create policy "about_timeline lectura publica"
  on public.about_timeline for select using (true);

drop policy if exists "about_admins lectura publica" on public.about_admins;
create policy "about_admins lectura publica"
  on public.about_admins for select using (true);

-- Escritura solo admin
drop policy if exists "about_page solo admin escribe" on public.about_page;
create policy "about_page solo admin escribe"
  on public.about_page for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "about_timeline solo admin escribe" on public.about_timeline;
create policy "about_timeline solo admin escribe"
  on public.about_timeline for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "about_admins solo admin escribe" on public.about_admins;
create policy "about_admins solo admin escribe"
  on public.about_admins for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- ── Seed inicial (contenido de ejemplo) ──────────────────────
insert into public.about_page (id, intro)
values (1, 'IMPERIUM es una comunidad de jugadores de Discord. Aquí coordinamos partidas, compartimos estrategias y montamos guías interactivas para que todo el equipo mejore más rápido.')
on conflict (id) do nothing;