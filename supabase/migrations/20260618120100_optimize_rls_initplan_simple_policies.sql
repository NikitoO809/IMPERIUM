-- ── Optimización RLS (auth_rls_initplan) ──────────────────────────────────────
-- Envuelve auth.uid()/is_admin()/is_staff()/is_supremo() en (select ...) para que el
-- planner las evalúe UNA vez por consulta (InitPlan) en lugar de por cada fila.
-- Semánticamente idéntico. Solo se tocan políticas de expresión SIMPLE; las que usan
-- EXISTS con joins se dejan intactas a propósito (riesgo > beneficio).

-- about_admins / about_page / about_timeline (escritura solo admin)
drop policy if exists "about_admins solo admin escribe" on public.about_admins;
create policy "about_admins solo admin escribe" on public.about_admins for all to authenticated using ((select is_admin())) with check ((select is_admin()));
drop policy if exists "about_page solo admin escribe" on public.about_page;
create policy "about_page solo admin escribe" on public.about_page for all to authenticated using ((select is_admin())) with check ((select is_admin()));
drop policy if exists "about_timeline solo admin escribe" on public.about_timeline;
create policy "about_timeline solo admin escribe" on public.about_timeline for all to authenticated using ((select is_admin())) with check ((select is_admin()));

-- assistant_history / assistant_usage (propias del usuario)
drop policy if exists "historial propio editable" on public.assistant_history;
create policy "historial propio editable" on public.assistant_history for update to authenticated using ((user_id = (select auth.uid()))) with check ((user_id = (select auth.uid())));
drop policy if exists "historial propio insertable" on public.assistant_history;
create policy "historial propio insertable" on public.assistant_history for insert to authenticated with check ((user_id = (select auth.uid())));
drop policy if exists "historial propio visible" on public.assistant_history;
create policy "historial propio visible" on public.assistant_history for select to authenticated using ((user_id = (select auth.uid())));
drop policy if exists "uso propio visible" on public.assistant_usage;
create policy "uso propio visible" on public.assistant_usage for select to authenticated using ((user_id = (select auth.uid())));

-- change_requests
drop policy if exists "cr: staff crea las suyas" on public.change_requests;
create policy "cr: staff crea las suyas" on public.change_requests for insert to authenticated with check (((select is_staff()) AND (author_id = (select auth.uid()))));
drop policy if exists "cr: supremo borra" on public.change_requests;
create policy "cr: supremo borra" on public.change_requests for delete to authenticated using ((select is_supremo()));
drop policy if exists "cr: supremo o autor leen" on public.change_requests;
create policy "cr: supremo o autor leen" on public.change_requests for select to authenticated using (((select is_supremo()) OR (author_id = (select auth.uid()))));
drop policy if exists "cr: supremo revisa" on public.change_requests;
create policy "cr: supremo revisa" on public.change_requests for update to authenticated using ((select is_supremo())) with check ((select is_supremo()));

-- community_achievements / community_top_players (escritura admin + staff lee todo)
drop policy if exists "achievements admin escribe" on public.community_achievements;
create policy "achievements admin escribe" on public.community_achievements for all to public using ((select is_admin())) with check ((select is_admin()));
drop policy if exists "achievements staff lee todo" on public.community_achievements;
create policy "achievements staff lee todo" on public.community_achievements for select to public using ((select is_staff()));
drop policy if exists "top_players admin escribe" on public.community_top_players;
create policy "top_players admin escribe" on public.community_top_players for all to public using ((select is_admin())) with check ((select is_admin()));
drop policy if exists "top_players staff lee todo" on public.community_top_players;
create policy "top_players staff lee todo" on public.community_top_players for select to public using ((select is_staff()));

-- community_rankings / community_ranking_entries (escritura admin)
drop policy if exists "community_rankings solo admin escribe" on public.community_rankings;
create policy "community_rankings solo admin escribe" on public.community_rankings for all to public using ((select is_admin())) with check ((select is_admin()));
drop policy if exists "community_entries solo admin escribe" on public.community_ranking_entries;
create policy "community_entries solo admin escribe" on public.community_ranking_entries for all to public using ((select is_admin())) with check ((select is_admin()));

-- game_memberships (propias del usuario; SELECT 'true' se deja)
drop policy if exists "editar tu membresía" on public.game_memberships;
create policy "editar tu membresía" on public.game_memberships for update to authenticated using (((select auth.uid()) = user_id)) with check (((select auth.uid()) = user_id));
drop policy if exists "salir de un juego" on public.game_memberships;
create policy "salir de un juego" on public.game_memberships for delete to authenticated using (((select auth.uid()) = user_id));
drop policy if exists "unirse a un juego" on public.game_memberships;
create policy "unirse a un juego" on public.game_memberships for insert to authenticated with check (((select auth.uid()) = user_id));

-- game_subscriptions (propias del usuario)
drop policy if exists "subscriptions_delete_own" on public.game_subscriptions;
create policy "subscriptions_delete_own" on public.game_subscriptions for delete to public using (((select auth.uid()) = user_id));
drop policy if exists "subscriptions_insert_own" on public.game_subscriptions;
create policy "subscriptions_insert_own" on public.game_subscriptions for insert to public with check (((select auth.uid()) = user_id));
drop policy if exists "subscriptions_select_own" on public.game_subscriptions;
create policy "subscriptions_select_own" on public.game_subscriptions for select to public using (((select auth.uid()) = user_id));
drop policy if exists "subscriptions_update_own" on public.game_subscriptions;
create policy "subscriptions_update_own" on public.game_subscriptions for update to public using (((select auth.uid()) = user_id)) with check (((select auth.uid()) = user_id));

-- games / guides / guide_steps / game_sections / section_blocks (escritura staff; SELECT con EXISTS se dejan)
drop policy if exists "games: staff escribe" on public.games;
create policy "games: staff escribe" on public.games for all to authenticated using ((select is_staff())) with check ((select is_staff()));
drop policy if exists "guides: staff escribe" on public.guides;
create policy "guides: staff escribe" on public.guides for all to authenticated using ((select is_staff())) with check ((select is_staff()));
drop policy if exists "steps: staff escribe" on public.guide_steps;
create policy "steps: staff escribe" on public.guide_steps for all to authenticated using ((select is_staff())) with check ((select is_staff()));
drop policy if exists "secciones: staff escribe" on public.game_sections;
create policy "secciones: staff escribe" on public.game_sections for all to authenticated using ((select is_staff())) with check ((select is_staff()));
drop policy if exists "bloques: staff escribe" on public.section_blocks;
create policy "bloques: staff escribe" on public.section_blocks for all to authenticated using ((select is_staff())) with check ((select is_staff()));

-- heroes / hero_builds (write admin; heroes_read simple; hero_builds_read con EXISTS se deja)
drop policy if exists "heroes_read" on public.heroes;
create policy "heroes_read" on public.heroes for select to public using (((is_published = true) OR (select is_admin())));
drop policy if exists "heroes_write" on public.heroes;
create policy "heroes_write" on public.heroes for all to public using ((select is_admin()));
drop policy if exists "hero_builds_write" on public.hero_builds;
create policy "hero_builds_write" on public.hero_builds for all to public using ((select is_admin()));

-- preregister_games / upcoming_games (escritura admin)
drop policy if exists "preregister solo admin escribe" on public.preregister_games;
create policy "preregister solo admin escribe" on public.preregister_games for all to authenticated using ((select is_admin())) with check ((select is_admin()));
drop policy if exists "upcoming solo admin escribe" on public.upcoming_games;
create policy "upcoming solo admin escribe" on public.upcoming_games for all to authenticated using ((select is_admin())) with check ((select is_admin()));

-- profiles (edición propia + supremo; SELECT 'true' se deja)
drop policy if exists "editar tu propio perfil" on public.profiles;
create policy "editar tu propio perfil" on public.profiles for update to authenticated using (((select auth.uid()) = id)) with check (((select auth.uid()) = id));
drop policy if exists "supremo edita cualquier perfil" on public.profiles;
create policy "supremo edita cualquier perfil" on public.profiles for update to authenticated using ((select is_supremo())) with check ((select is_supremo()));

-- step_progress (propio del usuario; 'ver progreso visible de miembros' con EXISTS se deja)
drop policy if exists "actualizar tu propio progreso" on public.step_progress;
create policy "actualizar tu propio progreso" on public.step_progress for update to authenticated using (((select auth.uid()) = user_id)) with check (((select auth.uid()) = user_id));
drop policy if exists "borrar tu propio progreso" on public.step_progress;
create policy "borrar tu propio progreso" on public.step_progress for delete to authenticated using (((select auth.uid()) = user_id));
drop policy if exists "insertar tu propio progreso" on public.step_progress;
create policy "insertar tu propio progreso" on public.step_progress for insert to authenticated with check (((select auth.uid()) = user_id));
drop policy if exists "ver tu propio progreso" on public.step_progress;
create policy "ver tu propio progreso" on public.step_progress for select to authenticated using (((select auth.uid()) = user_id));
