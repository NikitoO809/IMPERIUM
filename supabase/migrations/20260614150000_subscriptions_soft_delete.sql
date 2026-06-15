-- Anti-spam de avisos: en vez de BORRAR la suscripción al desapuntarse,
-- la marcamos como inactiva (active = false) y recordamos si ya avisamos a
-- Discord (notified = true). Así, aunque alguien pulse "Avísame" muchas veces,
-- solo se envía UN aviso a Discord por persona+juego, y el contador sigue
-- siendo correcto (cuenta solo las activas).

alter table public.game_subscriptions
  add column if not exists active   boolean not null default true,
  add column if not exists notified boolean not null default false;

-- El conteo público ahora cuenta solo suscripciones activas.
create or replace function public.upcoming_game_counts()
returns table (game_key text, subscribers bigint)
language sql
security definer
set search_path = public
as $$
  select game_key, count(*)::bigint as subscribers
  from public.game_subscriptions
  where active
  group by game_key;
$$;

grant execute on function public.upcoming_game_counts() to anon, authenticated;

-- Al desapuntarse ya no borramos: actualizamos active. Hace falta política UPDATE.
drop policy if exists "subscriptions_update_own" on public.game_subscriptions;
create policy "subscriptions_update_own"
  on public.game_subscriptions for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
