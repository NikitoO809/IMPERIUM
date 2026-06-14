-- ============================================================
-- IMPERIUM · Fase 3 — Membresías de juego + roster en tiempo real
-- - game_memberships: qué usuario juega a qué juego (+ privacidad).
-- - step_progress: dejar ver el avance de los miembros que lo comparten.
-- - Realtime: publicar step_progress y game_memberships para el roster en vivo.
-- ============================================================

-- ── game_memberships ─────────────────────────────────────────
create table if not exists public.game_memberships (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references public.profiles (id) on delete cascade,
  game_id           uuid not null references public.games (id) on delete cascade,
  progress_visible  boolean not null default true,
  joined_at         timestamptz not null default now(),
  unique (user_id, game_id)
);
create index if not exists game_memberships_game_id_idx on public.game_memberships (game_id);
create index if not exists game_memberships_user_id_idx on public.game_memberships (user_id);

alter table public.game_memberships enable row level security;

-- Cualquier usuario con sesión ve las membresías (para construir el roster).
drop policy if exists "membresías visibles para autenticados" on public.game_memberships;
create policy "membresías visibles para autenticados"
  on public.game_memberships for select
  to authenticated
  using (true);

-- Cada usuario gestiona SOLO su propia membresía (unirse, salir, privacidad).
drop policy if exists "unirse a un juego" on public.game_memberships;
create policy "unirse a un juego"
  on public.game_memberships for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "editar tu membresía" on public.game_memberships;
create policy "editar tu membresía"
  on public.game_memberships for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "salir de un juego" on public.game_memberships;
create policy "salir de un juego"
  on public.game_memberships for delete
  to authenticated
  using (auth.uid() = user_id);

-- ── step_progress: ver el avance de miembros que lo comparten ─
-- Se suma a la política "ver tu propio progreso" (se combinan con OR).
-- Puedes ver una fila de otro usuario si ese usuario es miembro del
-- juego al que pertenece el paso y tiene progress_visible = true.
drop policy if exists "ver progreso visible de miembros" on public.step_progress;
create policy "ver progreso visible de miembros"
  on public.step_progress for select
  to authenticated
  using (
    exists (
      select 1
      from public.guide_steps gs
      join public.guides gd on gd.id = gs.guide_id
      join public.game_memberships m
        on m.game_id = gd.game_id and m.user_id = step_progress.user_id
      where gs.id = step_progress.step_id
        and m.progress_visible = true
    )
  );

-- ── Realtime: publicar las tablas del roster ─────────────────
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'step_progress'
  ) then
    alter publication supabase_realtime add table public.step_progress;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'game_memberships'
  ) then
    alter publication supabase_realtime add table public.game_memberships;
  end if;
end $$;
