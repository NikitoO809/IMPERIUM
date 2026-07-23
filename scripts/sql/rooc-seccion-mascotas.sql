do $IMPERIUM$
declare
  v_game uuid;
  v_section uuid;
begin
  select id into v_game from public.games where slug = 'ragnarok-origin-classic';
  if v_game is null then
    raise exception 'IMPERIUM: juego no encontrado: %', 'ragnarok-origin-classic';
  end if;

  -- Reemplazo idempotente: borra la sección y sus bloques, luego reinserta.
  delete from public.section_blocks where section_id in (
    select id from public.game_sections where game_id = v_game and slug = 'mascotas');
  delete from public.game_sections where game_id = v_game and slug = 'mascotas';

  insert into public.game_sections
    (game_id, slug, title, intro_title, intro, intro_images, is_published,
     label, description, icon, cover_image, render_type, order_index)
  values
    (v_game, 'mascotas', 'Mascotas', 'Mascotas: cómo funcionan', 'Las mascotas son un sistema aparte de las monturas: se desbloquean al llegar a Nivel Base 22, con un máximo de 4 mascotas activas a la vez. Desde el Nivel Base 55 se añade además un hueco extra de Assist, para una mascota que no despliegas en combate pero que igual te aporta sus estadísticas pasivas. La forma de conseguirlas es cazando monstruos Mini y MVP: sueltan Poring Coins, la moneda que canjeas en la Pet Shop por fragmentos propios de cada mascota ("Pet Shard", así se llama en el juego) para desbloquearla y mejorarla.

Cada mascota tiene su propio rol (Tanque, Soporte o DPS), raza, y una Habilidad Exclusiva que se refuerza en dos puntos de mejora — Tier 5 y Tier 10 — dentro de una progresión de 10 tiers en total. Subir una mascota entera cuesta 2.430 Pet Shard, así que conviene concentrar tus Poring Coins en 3-4 mascotas principales en vez de repartirlos entre muchas a medio mejorar. Si solo vas a invertir en una, la referencia habitual de la comunidad es Baphomet Jr. —ya la conoces si has leído la guía de principiantes— por lo bien que sostiene HP en sesiones largas de farmeo.', array[]::text[], false,
     'Mascotas', 'Las mascotas de ROOC: rol, raza y habilidad exclusiva de cada una.', 'paw', null, 'generic', 4)
  returning id into v_section;

  insert into public.section_blocks
    (section_id, order_index, title, content, source_url, is_verified, images, meta)
  values
    (v_section, 1, 'Cómo mejorar tus mascotas', 'Cada mascota tiene 10 niveles de mejora ("Tiers"). Cada tier añade una habilidad pasiva de la mascota (resistencias, curación, boosts de daño…) y tiene su propio coste en Pet Shard —el fragmento específico de esa mascota, que se consigue cambiando Poring Coins en la Pet Shop—. Los 10 tiers de una misma mascota cuestan en total 2.430 Pet Shard.

Además de esas habilidades por tier, cada mascota tiene una Habilidad Exclusiva propia —solo se activa si la llevas como mascota activa, no en el hueco Assist— que normalmente se refuerza en el Tier 5 y llega a su versión más fuerte en el Tier 10. Es la habilidad que de verdad marca la diferencia entre mascotas, más que las habilidades genéricas por tier (que se repiten entre varias mascotas distintas).', 'https://roocdb.com/en/pets/1014', false, array[]::text[], '{}'::jsonb),
    (v_section, 2, 'Catálogo de mascotas', '__ARTIFACT_TABLE__[{"name": "King Piggy", "artifact_img": "https://roocdb.com/pets/Pokemon_guowangzhu.webp", "tier": "", "types": "Tanque · Bruto", "hero_images": [], "hero_label": "", "range": "", "attributes": "Blessing: absorbe todo el daño de su dueño durante 10 segundos; el daño que recibe se calcula como (200 - INT/10)% y baja a (150 - INT/10)% en el Tier 10."}, {"name": "Child of Earth", "artifact_img": "https://roocdb.com/pets/Pokemon_tuyuansujingling.webp", "tier": "", "types": "Tanque · Amorfo", "hero_images": [], "hero_label": "", "range": "", "attributes": "Behind Me: absorbe todo el daño de su dueño durante 10 segundos; el daño que recibe se calcula como (200 - VIT/10)% y baja a (150 - VIT/10)% en el Tier 10."}, {"name": "Sohee", "artifact_img": "https://roocdb.com/pets/Pokemon_guinv.webp", "tier": "", "types": "Soporte · Semihumano", "hero_images": [], "hero_label": "", "range": "", "attributes": "Lucid Dream: da a Sohee y a su dueño +10% de velocidad de ataque, +5% de velocidad de movimiento y 2% de robo de vida durante 8s (a cambio de +3s de reutilización de habilidades); en el Tier 10 llega a +30%/+12%/5%."}, {"name": "Teacup Rabbit", "artifact_img": "https://roocdb.com/pets/Pokemon_chabeitu.webp", "tier": "", "types": "Soporte · Bruto", "hero_images": [], "hero_label": "", "range": "", "attributes": "Drinks on Me: rocía té causando 350% de daño mágico de agua a 6 enemigos frontales y devuelve SP al dueño al lanzar habilidades; el daño sube a 550% en el Tier 10."}, {"name": "Squidgitte", "artifact_img": "https://roocdb.com/pets/Pokemon_saidula.webp", "tier": "", "types": "Soporte · Pez", "hero_images": [], "hero_label": "", "range": "", "attributes": "Dance of the Sea Monster: da +15% de daño físico/mágico a los aliados cercanos durante 10 segundos; sube a +25% en el Tier 10."}, {"name": "Baphomet Jr.", "artifact_img": "https://roocdb.com/pets/Pokemon_bafengte.webp", "tier": "", "types": "DPS (Área) · Bruto", "hero_images": [], "hero_label": "", "range": "", "attributes": "Harvesting Scythe: golpea en área y cura un 3% del daño crítico como HP para ella y su dueño; sube hasta el 9% en el Tier 10 (la mascota estrella para farmeo — más detalle en la guía de principiantes)."}, {"name": "Abyss Witch", "artifact_img": "https://roocdb.com/pets/Pokemon_zhangyu.webp", "tier": "", "types": "DPS (Área) · Semihumano", "hero_images": [], "hero_label": "", "range": "", "attributes": "Lord of Vermilion: invoca 4 oleadas de rayo (90% de daño mágico de viento cada una, hasta 10 objetivos) que acumulan un buff de daño; en el Tier 10 llega a 12 oleadas."}, {"name": "Kitten Oracle", "artifact_img": "https://roocdb.com/pets/Pokemon_zhanbumao.webp", "tier": "", "types": "DPS (Objetivo único) · Bruto", "hero_images": [], "hero_label": "", "range": "", "attributes": "Battle Blessing: golpea al objetivo con 800% de daño físico neutral y da +10% de velocidad de ataque al dueño; en el Tier 10 llega a 1200% de daño y suma +5% de daño crítico y +20% de probabilidad de crítico."}, {"name": "Dr. Owl", "artifact_img": "https://roocdb.com/pets/Pokemon_maotouyingboshi.webp", "tier": "", "types": "DPS (Objetivo único) · Bruto", "hero_images": [], "hero_label": "", "range": "", "attributes": "Gale Wind: dispara una flecha de viento con 800% de daño físico y aumenta el daño físico recibido por el objetivo un 20%; en el Tier 10 llega a 1200% de daño y +30% de daño físico recibido."}]', 'https://roocdb.com/en/pets', false, array[]::text[], '{}'::jsonb);
end
$IMPERIUM$;
