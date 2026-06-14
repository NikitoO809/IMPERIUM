-- ============================================================
-- IMPERIUM · Fase 2 — Carga inicial de Call of Dragons
-- Contenido tomado de las guías de la comunidad (ver source_url).
-- Los pasos verificados llevan is_verified = true; el resto son
-- [EJEMPLO — reemplazar] y los completará el admin desde fuentes.
-- Idempotente: si ya existe el juego (por slug), no duplica.
-- ============================================================
do $$
declare
  v_game_id uuid;
  v_guide_pp uuid;
  v_guide_db uuid;
  v_guide_ht uuid;
  i int;
begin
  -- Si el juego ya está cargado, no hacemos nada.
  if exists (select 1 from public.games where slug = 'call-of-dragons') then
    return;
  end if;

  insert into public.games (slug, name, description, is_published)
  values (
    'call-of-dragons',
    'Call of Dragons',
    'Guías de la comunidad para Call of Dragons. El contenido real lo carga el equipo desde fuentes verificadas.',
    true
  )
  returning id into v_game_id;

  -- ── Guía 1: Primeros pasos (contenido verificado) ──────────
  insert into public.guides (game_id, slug, title, description, order_index, is_published)
  values (
    v_game_id, 'primeros-pasos',
    'Guía para principiantes: consejos y trucos',
    'Las prioridades clave para empezar bien tus primeras semanas.',
    1, true
  )
  returning id into v_guide_pp;

  insert into public.guide_steps (guide_id, order_index, title, content, source_url, is_verified) values
  (v_guide_pp, 1, 'Desbloquea un segundo constructor',
   'Con un segundo constructor podrás levantar dos edificios a la vez. Gasta unas 3.000 gemas pronto para acelerar muchísimo tu progreso de construcción.',
   'https://callofdragonsguides.com/beginner-guide-tips-tricks/', true),
  (v_guide_pp, 2, 'Llega rápido a Honor nivel 8',
   'Prioriza alcanzar el nivel 8 de Honor: desbloquea una segunda cola de investigación, te da fichas gratis de héroe legendario y bonus de progreso importantes.',
   'https://callofdragonsguides.com/beginner-guide-tips-tricks/', true),
  (v_guide_pp, 3, 'Sube el Ayuntamiento (City Hall) a nivel 22',
   'El Ayuntamiento es la base de todas las demás mejoras. Súbelo a nivel 22 para desbloquear 5 colas de legión y poder farmear y combatir al mismo tiempo.',
   'https://callofdragonsguides.com/beginner-guide-tips-tricks/', true),
  (v_guide_pp, 4, 'Investiga sin parar',
   'No dejes nunca la cola de investigación vacía. Equilibra tecnologías militares y de recursos, y pásate del todo a recursos cuando desbloquees tropas de tier 4.',
   'https://callofdragonsguides.com/beginner-guide-tips-tricks/', true),
  (v_guide_pp, 5, 'Crea una cuenta granja (farm)',
   'Crea una cuenta secundaria desde el principio para recolectar y enviar recursos a tu cuenta principal, así nunca te faltarán para las mejoras clave.',
   'https://callofdragonsguides.com/beginner-guide-tips-tricks/', true),
  (v_guide_pp, 6, 'Concéntrate en un solo héroe legendario',
   'No repartas recursos entre varios héroes. Desarrolla por completo un único héroe legendario antes de invertir en otro; el progreso es lento para jugadores free-to-play.',
   'https://callofdragonsguides.com/beginner-guide-tips-tricks/', true),
  (v_guide_pp, 7, 'No subas tropas de tier bajo',
   'No mejores tropas de tier 1 a tier 3. Entrena tier 3 directamente y sube a tier 4 solo cuando tengas suficientes tropas para tus necesidades de combate.',
   'https://callofdragonsguides.com/beginner-guide-tips-tricks/', true),
  (v_guide_pp, 8, 'Únete a una alianza activa',
   'Pertenecer a una alianza da mejoras de estadísticas, reduce tiempos de construcción y aporta recursos y recompensas compartidas. Busca una con jugadores dedicados.',
   'https://callofdragonsguides.com/beginner-guide-tips-tricks/', true);

  -- ── Guía 2: Desarrollo de la base [EJEMPLO] ────────────────
  insert into public.guides (game_id, slug, title, description, order_index, is_published)
  values (
    v_game_id, 'desarrollo-base',
    'Desarrollo de la base [EJEMPLO]',
    'Orden recomendado para subir tu base.',
    2, true
  )
  returning id into v_guide_db;

  for i in 1..6 loop
    insert into public.guide_steps (guide_id, order_index, title, content, source_url, is_verified)
    values (
      v_guide_db, i,
      'Paso ' || i || ' — [EJEMPLO — reemplazar]',
      'Texto de ejemplo del paso. Aquí irá la explicación real, cargada por el administrador desde una fuente verificada. No es contenido real del juego.',
      null, false
    );
  end loop;

  -- ── Guía 3: Héroes y tropas [EJEMPLO] ──────────────────────
  insert into public.guides (game_id, slug, title, description, order_index, is_published)
  values (
    v_game_id, 'heroes-tropas',
    'Héroes y tropas [EJEMPLO]',
    'Qué priorizar al principio.',
    3, true
  )
  returning id into v_guide_ht;

  for i in 1..4 loop
    insert into public.guide_steps (guide_id, order_index, title, content, source_url, is_verified)
    values (
      v_guide_ht, i,
      'Paso ' || i || ' — [EJEMPLO — reemplazar]',
      'Texto de ejemplo del paso. Aquí irá la explicación real, cargada por el administrador desde una fuente verificada. No es contenido real del juego.',
      null, false
    );
  end loop;
end $$;
