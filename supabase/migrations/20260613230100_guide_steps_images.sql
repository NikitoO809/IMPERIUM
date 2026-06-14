-- ============================================================
-- IMPERIUM · Imágenes por paso de guía
-- Cada paso puede llevar varias imágenes (URLs enlazadas desde la
-- fuente original). Array de texto, por defecto vacío.
-- ============================================================
alter table public.guide_steps
  add column if not exists images text[] not null default '{}';
