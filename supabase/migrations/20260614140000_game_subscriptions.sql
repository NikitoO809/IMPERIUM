-- Suscripciones a juegos "próximamente": la gente pulsa "Avísame" en un juego
-- que la comunidad espera. Guardamos quién espera qué (1 fila por usuario+juego)
-- para poder avisarle cuando salga y para mostrar cuántos lo esperan.
--
-- game_key NO es FK a games: los juegos esperados aún no existen en la tabla
-- games (son cartas de "próximamente"); identificamos cada uno por una clave
-- de texto estable (p.ej. "guild-wars-2").

create table if not exists public.game_subscriptions (
  id         uuid primary key default gen_random_uuid(),
  game_key   text not null,
  user_id    uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (game_key, user_id)
);

create index if not exists game_subscriptions_game_key_idx
  on public.game_subscriptions (game_key);

alter table public.game_subscriptions enable row level security;

-- Cada quien gestiona SOLO su propia suscripción.
drop policy if exists "subscriptions_select_own" on public.game_subscriptions;
create policy "subscriptions_select_own"
  on public.game_subscriptions for select
  using (auth.uid() = user_id);

drop policy if exists "subscriptions_insert_own" on public.game_subscriptions;
create policy "subscriptions_insert_own"
  on public.game_subscriptions for insert
  with check (auth.uid() = user_id);

drop policy if exists "subscriptions_delete_own" on public.game_subscriptions;
create policy "subscriptions_delete_own"
  on public.game_subscriptions for delete
  using (auth.uid() = user_id);

-- Conteo público de suscriptores por juego (sin exponer QUIÉN está suscrito).
-- SECURITY DEFINER para poder agregar por encima de la RLS; solo devuelve totales.
create or replace function public.upcoming_game_counts()
returns table (game_key text, subscribers bigint)
language sql
security definer
set search_path = public
as $$
  select game_key, count(*)::bigint as subscribers
  from public.game_subscriptions
  group by game_key;
$$;

grant execute on function public.upcoming_game_counts() to anon, authenticated;
