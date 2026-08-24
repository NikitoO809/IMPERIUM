-- Contador público de "gente esperando" un juego (banner de reclutamiento).
-- No exige iniciar sesión: cada navegador guarda un token anónimo y solo puede
-- sumar una vez por juego. La tabla no se toca nunca en directo: todo pasa por
-- las funciones de abajo (SECURITY DEFINER), por eso RLS queda sin políticas.
create table if not exists public.game_hype (
  game_key text not null,
  token uuid not null,
  user_id uuid references auth.users(id) on delete set null,
  ip text,
  created_at timestamptz not null default now(),
  primary key (game_key, token)
);

alter table public.game_hype enable row level security;

create index if not exists game_hype_key_idx on public.game_hype (game_key);
create index if not exists game_hype_ip_idx on public.game_hype (ip, created_at desc);

-- Cuánta gente espera un juego.
create or replace function public.hype_count(p_game_key text)
returns integer
language sql
security definer
set search_path = public, pg_temp
stable
as $$
  select count(*)::int from public.game_hype where game_key = p_game_key;
$$;

-- Apunta a alguien (una vez por navegador) y devuelve el total ya actualizado.
-- Freno básico contra inflado: máximo 5 altas por IP en una hora.
create or replace function public.hype_join(p_game_key text, p_token uuid, p_ip text default null)
returns integer
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  recent int;
begin
  if p_game_key is null or length(p_game_key) > 64 or p_token is null then
    raise exception 'parametros invalidos';
  end if;

  if p_ip is not null then
    select count(*) into recent
    from public.game_hype
    where ip = p_ip and created_at > now() - interval '1 hour';
    if recent >= 5 then
      return (select count(*)::int from public.game_hype where game_key = p_game_key);
    end if;
  end if;

  insert into public.game_hype (game_key, token, user_id, ip)
  values (p_game_key, p_token, auth.uid(), p_ip)
  on conflict (game_key, token) do nothing;

  return (select count(*)::int from public.game_hype where game_key = p_game_key);
end;
$$;

revoke all on function public.hype_count(text) from public;
revoke all on function public.hype_join(text, uuid, text) from public;
grant execute on function public.hype_count(text) to anon, authenticated;
grant execute on function public.hype_join(text, uuid, text) to anon, authenticated;
