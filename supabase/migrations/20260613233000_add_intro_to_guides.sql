-- ============================================================
-- IMPERIUM · Intro de las guías
-- Bloque introductorio de cada guía con su propio título (fiel a la fuente).
-- Se renderiza arriba de la guía, NO es un paso marcable.
-- (Aplicada previamente vía MCP; este archivo la deja registrada en el repo.)
-- ============================================================
alter table public.guides
  add column if not exists intro_title  text,
  add column if not exists intro        text,
  add column if not exists intro_images text[] not null default '{}';
