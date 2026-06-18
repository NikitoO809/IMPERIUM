-- Muro de LOGROS de la comunidad: hazañas de los juegos que jugamos, con
-- imágenes y vídeos (YouTube incrustado o vídeos subidos a Storage).
-- Gestionado a mano desde /admin/comunidad. Reemplaza a los rankings en la web.
create table if not exists public.community_achievements (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  description  text,
  game         text,                      -- juego al que pertenece (texto libre)
  author_name  text,                      -- quién lo consiguió
  author_avatar text,                     -- foto/avatar del autor (URL, opcional)
  achieved_on  date,                      -- cuándo se consiguió (para ordenar)
  images       text[] not null default '{}',  -- URLs de imágenes
  videos       text[] not null default '{}',  -- URLs de vídeo (YouTube o archivo subido)
  accent       text not null default '#7c5cff', -- color de acento HUD
  is_published boolean not null default true,
  created_at   timestamptz not null default now()
);

alter table public.community_achievements enable row level security;

-- Web pública: solo logros publicados.
create policy "achievements lectura publica"
  on public.community_achievements for select
  using (is_published);

-- Panel: el staff ve también los ocultos.
create policy "achievements staff lee todo"
  on public.community_achievements for select
  using (is_staff());

-- Solo admin/supremo escriben (crear/editar/borrar).
create policy "achievements admin escribe"
  on public.community_achievements for all
  using (is_admin())
  with check (is_admin());

-- Orden habitual del muro: lo más reciente primero.
create index if not exists community_achievements_order_idx
  on public.community_achievements (achieved_on desc nulls last, created_at desc);
