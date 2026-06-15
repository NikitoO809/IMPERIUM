-- Presentación por sección para un Hub dinámico por juego.
-- Hasta ahora el Hub se armaba desde una lista fija en el código (GAME_SECTIONS +
-- mapas SECTION_ICON/SECTION_COVERS). Para que cada juego muestre SUS secciones
-- (CoD→héroes, Sword x Staff→compañeros), la presentación de cada sección se
-- guarda en la propia fila de game_sections. Todo aditivo, no rompe nada; las
-- secciones de CoD ya existentes siguen funcionando vía los fallbacks del código.

alter table public.game_sections
  add column if not exists label        text,                       -- nombre en el card del Hub (cae a title)
  add column if not exists description  text,                       -- subtítulo del card
  add column if not exists icon         text,                       -- clave de icono (p. ej. 'paw', 'shield')
  add column if not exists cover_image  text,                       -- portada del card
  add column if not exists order_index  int  not null default 0,    -- orden en el Hub
  add column if not exists render_type  text not null default 'generic'; -- 'generic' | 'tier-list' | 'table'
