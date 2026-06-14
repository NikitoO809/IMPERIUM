-- ============================================================
-- IMPERIUM · Secciones de contenido genéricas por juego
-- Cada sección del Hub (eventos, codigos, war-pets, ...) puede tener
-- contenido scrapeado: una página con intro + bloques (texto + imágenes).
-- Mismo patrón y RLS que guides/guide_steps (lectura si publicado, escribe admin).
-- ============================================================

-- ── game_sections (una fila por juego + sección) ─────────────
create table if not exists public.game_sections (
  id            uuid primary key default gen_random_uuid(),
  game_id       uuid not null references public.games (id) on delete cascade,
  slug          text not null,
  title         text not null,
  intro_title   text,
  intro         text,
  intro_images  text[] not null default '{}',
  is_published  boolean not null default false,
  created_at    timestamptz not null default now(),
  unique (game_id, slug)
);
create index if not exists game_sections_game_id_idx on public.game_sections (game_id);

-- ── section_blocks (bloques de contenido de una sección) ─────
create table if not exists public.section_blocks (
  id            uuid primary key default gen_random_uuid(),
  section_id    uuid not null references public.game_sections (id) on delete cascade,
  order_index   int not null default 0,
  title         text not null,
  content       text,
  source_url    text,
  is_verified   boolean not null default false,
  images        text[] not null default '{}',
  created_at    timestamptz not null default now()
);
create index if not exists section_blocks_section_id_idx on public.section_blocks (section_id);

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.game_sections  enable row level security;
alter table public.section_blocks enable row level security;

-- game_sections: visibles si la sección y su juego están publicados; admin ve todo
drop policy if exists "secciones visibles si publicadas" on public.game_sections;
create policy "secciones visibles si publicadas"
  on public.game_sections for select
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

drop policy if exists "secciones solo admin escribe" on public.game_sections;
create policy "secciones solo admin escribe"
  on public.game_sections for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- section_blocks: visibles si su sección+juego están publicados; admin ve todo
drop policy if exists "bloques visibles si seccion publicada" on public.section_blocks;
create policy "bloques visibles si seccion publicada"
  on public.section_blocks for select
  using (
    public.is_admin()
    or exists (
      select 1
      from public.game_sections s
      join public.games g on g.id = s.game_id
      where s.id = section_id and s.is_published and g.is_published
    )
  );

drop policy if exists "bloques solo admin escribe" on public.section_blocks;
create policy "bloques solo admin escribe"
  on public.section_blocks for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
