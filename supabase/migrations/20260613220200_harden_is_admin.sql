-- ============================================================
-- IMPERIUM · Fase 2 — Endurecer is_admin()
-- Las políticas de SOLO LECTURA no necesitan is_admin(): los admin
-- ya tienen acceso total por su política FOR ALL. Así los visitantes
-- sin sesión (anon) nunca ejecutan is_admin(), y restringimos su
-- ejecución a usuarios con sesión.
-- ============================================================

-- games: leer = solo publicados (admin cubierto por la política FOR ALL)
drop policy if exists "games visibles si publicados" on public.games;
create policy "games visibles si publicados"
  on public.games for select
  using (is_published);

-- guides: leer = publicada y con su juego publicado
drop policy if exists "guides visibles si publicadas" on public.guides;
create policy "guides visibles si publicadas"
  on public.guides for select
  using (
    is_published
    and exists (
      select 1 from public.games g
      where g.id = game_id and g.is_published
    )
  );

-- guide_steps: leer = su guía y su juego publicados
drop policy if exists "steps visibles si guia publicada" on public.guide_steps;
create policy "steps visibles si guia publicada"
  on public.guide_steps for select
  using (
    exists (
      select 1
      from public.guides gd
      join public.games g on g.id = gd.game_id
      where gd.id = guide_id and gd.is_published and g.is_published
    )
  );

-- Solo los usuarios con sesión pueden ejecutar is_admin()
-- (la usan las políticas de escritura para admins).
revoke execute on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;
