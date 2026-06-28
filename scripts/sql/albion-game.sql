-- Alta del juego Albion Online (idempotente por slug).
-- El juego va publicado para poder revisarlo en la web; las guías van en borrador.
insert into public.games (slug, name, description, is_published, cover_image)
values (
  'albion-online',
  'Albion Online',
  'MMORPG sandbox de mundo abierto con economía dirigida por jugadores y progresión sin clases (Destiny Board). Forja tu propio camino: explora, craftea, comercia y conquista.',
  true,
  'https://albiononline.com/assets/images/header/header-faye.jpg'
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  is_published = excluded.is_published,
  cover_image = excluded.cover_image;
