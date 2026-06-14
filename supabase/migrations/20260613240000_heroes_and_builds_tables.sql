-- Tabla de héroes (datos estructurados, un héroe por fila)
create table if not exists public.heroes (
  id           uuid primary key default gen_random_uuid(),
  game_id      uuid not null references public.games(id) on delete cascade,
  name         text not null,
  slug         text not null,
  generation   smallint not null,
  tier         text not null,
  faction      text not null default '',
  hero_class   text not null default '',
  role         text not null default '',
  specialty    text not null default '',
  description  text not null default '',
  image_url    text not null default '',
  is_published bool not null default true,
  created_at   timestamptz not null default now(),
  unique (game_id, slug)
);

-- Tabla de builds (secciones por héroe)
create table if not exists public.hero_builds (
  id           uuid primary key default gen_random_uuid(),
  hero_id      uuid not null references public.heroes(id) on delete cascade,
  order_index  smallint not null default 0,
  section      text not null,
  content      text not null default '',
  images       text[] not null default '{}',
  source_url   text,
  is_verified  bool not null default false,
  created_at   timestamptz not null default now()
);

alter table public.heroes enable row level security;
create policy "heroes_read" on public.heroes for select using (
  is_published = true or public.is_admin()
);
create policy "heroes_write" on public.heroes for all using (public.is_admin());

alter table public.hero_builds enable row level security;
create policy "hero_builds_read" on public.hero_builds for select using (
  exists (
    select 1 from public.heroes h
    where h.id = hero_id and (h.is_published = true or public.is_admin())
  )
);
create policy "hero_builds_write" on public.hero_builds for all using (public.is_admin());

grant execute on function public.is_admin() to anon, authenticated;

create index if not exists heroes_game_gen on public.heroes(game_id, generation);
create index if not exists hero_builds_hero on public.hero_builds(hero_id, order_index);
