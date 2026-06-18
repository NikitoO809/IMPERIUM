-- "Mejores jugadores" de la comunidad: una lista corta de la élite. Cada uno
-- tiene un nombre, una etiqueta (rol) y una hazaña breve que se revela al pulsar
-- su nombre en la web (sección con fondo espacial). Se gestiona en /admin/comunidad.
create table if not exists public.community_top_players (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  role         text,                       -- etiqueta corta (ej: "Líder de alianza")
  achievement  text,                       -- la hazaña que hizo (breve)
  avatar_url   text,                       -- foto/avatar (URL, opcional)
  accent       text not null default '#22e0ff', -- color de su brillo
  order_index  integer not null default 0,
  is_published boolean not null default true,
  created_at   timestamptz not null default now()
);

alter table public.community_top_players enable row level security;

create policy "top_players lectura publica"
  on public.community_top_players for select
  using (is_published);

create policy "top_players staff lee todo"
  on public.community_top_players for select
  using (is_staff());

create policy "top_players admin escribe"
  on public.community_top_players for all
  using (is_admin())
  with check (is_admin());

create index if not exists community_top_players_order_idx
  on public.community_top_players (order_index);
