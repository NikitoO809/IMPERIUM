-- Guarda el id del mensaje "tablero" de Discord (el que muestra cuántos
-- esperan cada juego) para poder EDITARLO en cada cambio en vez de crear uno
-- nuevo. Es una tabla de una sola fila (id = 1).
--
-- La app corre con la sesión del usuario (no hay clave de servicio), así que
-- leemos/escribimos ese id mediante funciones security definer. Solo tocan un
-- id de mensaje de Discord (dato no sensible), por eso es seguro exponerlas.

create table if not exists public.discord_config (
  id                    int primary key default 1 check (id = 1),
  scoreboard_message_id text,
  updated_at            timestamptz not null default now()
);

insert into public.discord_config (id) values (1) on conflict (id) do nothing;

alter table public.discord_config enable row level security;
-- Sin políticas: la tabla solo se toca vía las funciones security definer.

create or replace function public.get_scoreboard_message_id()
returns text
language sql
security definer
set search_path = public
as $$
  select scoreboard_message_id from public.discord_config where id = 1;
$$;

create or replace function public.set_scoreboard_message_id(msg_id text)
returns void
language sql
security definer
set search_path = public
as $$
  update public.discord_config
  set scoreboard_message_id = msg_id, updated_at = now()
  where id = 1;
$$;

grant execute on function public.get_scoreboard_message_id() to authenticated;
grant execute on function public.set_scoreboard_message_id(text) to authenticated;
