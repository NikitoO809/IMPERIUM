-- ============================================================
-- IMPERIUM · Fase 2 — Juegos, guías, pasos y progreso + RLS
-- Tablas del contenido de guías y del avance personal de cada usuario.
-- ============================================================

-- ── Helper: ¿el usuario actual es admin? ─────────────────────
-- security definer para poder leer profiles sin chocar con su RLS.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ── games ────────────────────────────────────────────────────
create table if not exists public.games (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  name          text not null,
  description   text,
  cover_image   text,
  is_published  boolean not null default false,
  created_at    timestamptz not null default now()
);

-- ── guides (una guía pertenece a un juego) ───────────────────
create table if not exists public.guides (
  id            uuid primary key default gen_random_uuid(),
  game_id       uuid not null references public.games (id) on delete cascade,
  slug          text not null,
  title         text not null,
  description   text,
  order_index   int not null default 0,
  is_published  boolean not null default false,
  created_at    timestamptz not null default now(),
  unique (game_id, slug)
);
create index if not exists guides_game_id_idx on public.guides (game_id);

-- ── guide_steps (los pasos que el usuario marca) ─────────────
create table if not exists public.guide_steps (
  id            uuid primary key default gen_random_uuid(),
  guide_id      uuid not null references public.guides (id) on delete cascade,
  order_index   int not null default 0,
  title         text not null,
  content       text,
  source_url    text,
  is_verified   boolean not null default false,
  created_at    timestamptz not null default now()
);
create index if not exists guide_steps_guide_id_idx on public.guide_steps (guide_id);

-- ── step_progress (avance de cada usuario en cada paso) ──────
create table if not exists public.step_progress (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles (id) on delete cascade,
  step_id       uuid not null references public.guide_steps (id) on delete cascade,
  completed     boolean not null default false,
  completed_at  timestamptz,
  unique (user_id, step_id)
);
create index if not exists step_progress_user_id_idx on public.step_progress (user_id);
create index if not exists step_progress_step_id_idx on public.step_progress (step_id);

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.games        enable row level security;
alter table public.guides       enable row level security;
alter table public.guide_steps  enable row level security;
alter table public.step_progress enable row level security;

-- games: cualquiera ve los publicados; solo admin escribe ────
drop policy if exists "games visibles si publicados" on public.games;
create policy "games visibles si publicados"
  on public.games for select
  using (is_published or public.is_admin());

drop policy if exists "games solo admin escribe" on public.games;
create policy "games solo admin escribe"
  on public.games for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- guides: visibles si la guía y su juego están publicados ────
drop policy if exists "guides visibles si publicadas" on public.guides;
create policy "guides visibles si publicadas"
  on public.guides for select
  using (
    public.is_admin()
    or (
      is_published
      and exists (
        select 1 from public.games g
        where g.id = game_id and g.is_published
      )
    )
  );

drop policy if exists "guides solo admin escribe" on public.guides;
create policy "guides solo admin escribe"
  on public.guides for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- guide_steps: visibles si su guía+juego están publicados ────
drop policy if exists "steps visibles si guia publicada" on public.guide_steps;
create policy "steps visibles si guia publicada"
  on public.guide_steps for select
  using (
    public.is_admin()
    or exists (
      select 1
      from public.guides gd
      join public.games g on g.id = gd.game_id
      where gd.id = guide_id and gd.is_published and g.is_published
    )
  );

drop policy if exists "steps solo admin escribe" on public.guide_steps;
create policy "steps solo admin escribe"
  on public.guide_steps for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- step_progress: cada usuario solo ve y edita lo suyo ────────
drop policy if exists "ver tu propio progreso" on public.step_progress;
create policy "ver tu propio progreso"
  on public.step_progress for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "insertar tu propio progreso" on public.step_progress;
create policy "insertar tu propio progreso"
  on public.step_progress for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "actualizar tu propio progreso" on public.step_progress;
create policy "actualizar tu propio progreso"
  on public.step_progress for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "borrar tu propio progreso" on public.step_progress;
create policy "borrar tu propio progreso"
  on public.step_progress for delete
  to authenticated
  using (auth.uid() = user_id);
