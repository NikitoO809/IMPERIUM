-- IMPERIUM · Albion Online: ficha del juego + 30 guías (borrador).
-- Generado por el pipeline (build_sql.py). Idempotente.

-- Alta del juego Albion Online (idempotente por slug).
-- Todo en BORRADOR (is_published=false): la regla de la BD impide publicar sin un
-- admin con sesión. Miguel publica luego desde el panel admin.
insert into public.games (slug, name, description, is_published, cover_image)
values (
  'albion-online',
  'Albion Online',
  'MMORPG sandbox de mundo abierto con economía dirigida por jugadores y progresión sin clases (Destiny Board). Forja tu propio camino: explora, craftea, comercia y conquista.',
  false,
  'https://albiononline.com/assets/images/header/header-faye.jpg'
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  is_published = excluded.is_published,
  cover_image = excluded.cover_image;


-- [1] your-first-steps
do $IMPERIUM$
declare
  v_game uuid;
  v_guide uuid;
begin
  select id into v_game from public.games where slug = 'albion-online';
  if v_game is null then
    raise exception 'IMPERIUM: juego no encontrado: %', 'albion-online';
  end if;

  -- Reemplazo idempotente. OJO: borra los pasos -> reinicia step_progress de esta guía.
  delete from public.guide_steps where guide_id in (
    select id from public.guides where game_id = v_game and slug = 'your-first-steps');
  delete from public.guides where game_id = v_game and slug = 'your-first-steps';

  insert into public.guides
    (game_id, slug, title, description, order_index, is_published, intro_title, intro, intro_images)
  values
    (v_game, 'your-first-steps', 'Tus primeros pasos en Albion Online', '¿Eres nuevo en Albion y no sabes por dónde empezar? ¡Lee esta guía!', 1, false, null, 'Cuando entras en Albion Online por primera vez, estás entrando en un mundo de posibilidades infinitas. Con tanto por delante, puede ser difícil saber exactamente por dónde empezar, y Albion tiene un montón de actividades que quizá no sean visibles a primera vista.

Para darte el mejor comienzo posible, hemos recopilado algunas actividades de nivel principiante y objetivos personales que te introducirán en las principales mecánicas del juego, a la vez que te ponen en buena posición para explorar todo lo demás que el juego tiene para ofrecer. Tener una comprensión básica de cada actividad te ayudará a progresar mucho más rápido y a convertirte en quien quieres ser en Albion.', array['https://assets.albiononline.com/uploads/media/default/media/37fe9cb36ef1298687b45043f6c2e354a13db50c.jpeg']::text[])
  returning id into v_guide;

  insert into public.guide_steps
    (guide_id, order_index, title, content, source_url, is_verified, images)
  values
    (v_guide, 1, 'Primeros pasos', 'Tu primer objetivo como jugador nuevo es viajar a una Royal City. Hay cinco de ellas en Albion, una en cada bioma:

• Bridgewatch (Steppe)
• Lymhurst (Forest)
• Martlock (Highland)
• Thetford (Swamp)
• Fort Sterling (Mountain)

Lo antes posible, abandona tu Starter Town y dirígete a la ciudad más cercana, a dos regiones de distancia, que puedes encontrar abriendo el World Map (atajo: M). Por ejemplo, esta imagen muestra Bridgewatch en relación con su Starter Town, Steppe Cross:

Cada ciudad tiene un banco para almacenar, un Marketplace para comprar y vender objetos, y muchas otras comodidades para tus primeras aventuras.

Una vez que hayas llegado a una ciudad, es hora de empezar a ganar Fame. La Fame es el equivalente en Albion Online a los puntos de experiencia, y ganar Fame desbloquea armas y equipo más poderosos.

• Matar enemigos te da Combat Fame, que desbloquea armas de tier superior
• Recolectar recursos te da Gathering Fame, que desbloquea herramientas de tier superior (con las que puedes recolectar recursos más valiosos)
• Fabricar objetos y refinar materiales te da Crafting Fame, que te permite fabricar y refinar objetos de tier superior

Puedes ver tu progreso en estas áreas en el Destiny Board, que es el árbol de habilidades de Albion. Aquí puedes ver las ramas de combate, fabricación y recolección del Destiny Board:

Ahora veamos algunas buenas formas de ganar Fame.', 'https://albiononline.com/guides/article/beginner-guide+109', false, array['https://assets.albiononline.com/uploads/media/default/media/e171dc10fb5d0b03f80cd2c1fd1fcc1f84fa3171.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/fc91c7e01ac4b4c8b32a41398ae788fa42d9e68a.jpeg']::text[]),
    (v_guide, 2, 'Objetivos de combate para tus primeros días', 'Consigue equipo de Tier 4

Una vez que empieces a usar un arma de Tier 4, tendrás acceso a muchas habilidades nuevas y podrás afrontar mayores desafíos. Matar enemigos con un arma de tu elección te dará Combat Fame para esa arma, hasta que desbloquees la capacidad de usar su versión de Tier 4.

Albion Online tiene un arma para cada estilo de juego. Aquí tienes algunas armas divertidas que quizá quieras probar:

• Dual Swords
• Battleaxe
• Bow
• Fire Staff

Para más sugerencias de equipo, consulta nuestras guías de Basic Build.

Adéntrate en las Yellow Zones

Después de equipar gear de Tier 4, dirígete a las Yellow Zones. Las Yellow Zones siguen siendo muy seguras, pero ofrecen mucha más Fame y contenido que las Blue Zones.

El combate jugador contra jugador (PvP) puede ocurrir aquí, pero no tengas miedo: la derrota solo resultará en un derribo (no una muerte) y dañará tus objetos (que puedes reparar en una Repair Station en una ciudad, por una pequeña tarifa). ¡No perderás ninguna posesión!

Puedes ver claramente en el World Map dónde están tus Yellow Zones más cercanas por el cuadrado de color junto a su nombre:

Derrota a los Roaming Mobs y limpia los Mob Camps

En el mundo abierto, te encontrarás con Roaming Mobs, enemigos que literalmente vagan por el mundo en lugar de quedarse en campamentos. Aunque pueden suponer un verdadero desafío, ofrecen cantidades serias de Fame. Esto te ayudará a subir de nivel tu equipo y te hará aún más fuerte, además de afinar tus habilidades de combate.

Otra actividad divertida son los Dynamic Encampments, campamentos de enemigos temporales que aparecen en ubicaciones aleatorias en regiones de Tier 5 en adelante, en versiones en solitario y en grupo. Ganar suficiente Fame matando a los enemigos de uno de estos desbloqueará un Cache (un tipo de cofre) que contiene botín valioso. Las posibles ubicaciones de Encampment se pueden reconocer en el Region Map: busca puntos como este:

Explora las Mists y encuentra la ciudad de Brecilien

Mientras exploras el mundo abierto, mantén un ojo atento a los curiosos Will o'' Wisps. Seguirlos abrirá un portal hacia las Mists, una región mágica llena de Roaming Mobs, Mob Camps, recursos, criaturas míticas y más. Completar ciertas tareas en las Mists, como liberar Wisps capturados, aumentará tu Standing con la esquiva ciudad de Brecilien. Alcanza un Standing lo bastante alto y podrás revelar un portal a la propia ciudad…

Esta imagen muestra cómo es un Wisp:', 'https://albiononline.com/guides/article/beginner-guide+109', false, array['https://assets.albiononline.com/uploads/media/default/media/7618b493c445fb50c4c00b0ed22bb4253bd66531.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/e170579144a970a04d8a9fe3ba415fc3540834ad.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/9a30a6ab5cdeb774dfdc2321743dfaa513128e5e.jpeg']::text[]),
    (v_guide, 3, 'Objetivos económicos para tus primeros días', 'Si quieres jugar la vertiente económica del juego, o si simplemente buscas ganar algo más de Silver, aquí tienes algunos objetivos tempranos que alcanzar:

Sube de nivel tus herramientas de recolección

Hay 5 recursos diferentes en Albion, cada uno con su propia profesión de recolección en el Destiny Board. Cada vez que recolectes un material, ganarás Gathering Fame y progresarás en su profesión correspondiente.

Los Learning Points, que te permiten acelerar tu progreso en cualquier nodo del Destiny Board, pueden ser especialmente beneficiosos al subir de nivel la recolección.

Una vez que alcances un nuevo nivel en una profesión, puedes comprar una herramienta mejor y recolectar materiales de tier superior. Como objetivo personal, deberías intentar llevar al menos una herramienta a Tier 4 pronto.

Aquí puedes ver el nivel que necesitas alcanzar en el Destiny Board para desbloquear las herramientas de Tier 4:

Consejo: comer un Pork Pie aumentará significativamente tu rendimiento de recolección y tu capacidad de carga durante 30 minutos.

Fabrica equipo y véndelo

Puedes coger tus materiales recolectados y refinarlos en la crafting station apropiada de una ciudad. Como alternativa, puedes comprar los materiales que necesites para fabricar equipo en el Marketplace.

Hay 3 tipos de stations para armas y armaduras (Warrior''s Forge, Hunter''s Lodge, Mage Tower). Aquí hay pestañas para armas, armaduras, y una tercera pestaña para estudiar. Estudiar te permite ganar Crafting Fame adicional de un objeto no deseado, pero lo destruye en el proceso.

La station del Toolmaker te permite fabricar y estudiar accesorios como bolsas, capas y herramientas.

Luego puedes usar los objetos terminados tú mismo, o venderlos en el Marketplace.

Las crafting stations se encuentran justo a las afueras de la plaza principal de una ciudad, como puedes ver en el Region Map:', 'https://albiononline.com/guides/article/beginner-guide+109', false, array['https://assets.albiononline.com/uploads/media/default/media/4ddf6482c1fb3b5459f5bdbad05f0960ae11e372.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/bc40879776fdd4bf535110bdbc10a6067195f8a1.jpeg']::text[]),
    (v_guide, 4, 'El Albion Journal', 'El Albion Journal es una función que rastrea tu progreso a través del juego, mientras te recompensa por alcanzar objetivos específicos a medida que avanzas.

Pulsa J para abrirlo, o ve a través del menú de Actividades.

El Albion Journal ofrece misiones para casi cualquier actividad en Albion, y ofrece una recompensa por completar cada una. Estas misiones actúan como objetivos claros y alcanzables en las primeras etapas del juego, y van escalando gradualmente hasta logros de alto nivel a medida que progresas.

Puedes rastrear hasta tres misiones de tu elección en el HUD, o tener misiones sugeridas automáticamente que se adapten a tu nivel de juego. Haz clic en este icono para ver tus misiones rastreadas:

El Albion Journal es una gran forma de medir tu progreso en las primeras etapas del juego, además de proporcionar una manera de ganar algo de Fame o Silver extra para ayudarte aún más en tu camino.', 'https://albiononline.com/guides/article/beginner-guide+109', false, array['https://assets.albiononline.com/uploads/media/default/media/892af31dbec25d0f1a8feb84170c07ce5a42cd79.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/7c22b382a59c9b394750878f2c0babfbd4226f23.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/abc92a7c9600b0f76fc4d8a481b07cd61ad458ac.jpeg']::text[]),
    (v_guide, 5, 'Consejos adicionales', '• No estás obligado a fabricar cada objeto tú mismo. El mercado impulsado por jugadores de Albion casi con seguridad tendrá el equipo y las herramientas que necesitas para tu viaje. Ser autosuficiente al principio puede ahorrarte Silver, pero costarte un tiempo valioso.
• Mejora tu montura cuando consigas suficiente Silver. Un Journeyman''s Riding Horse es un compañero rápido que puede llevarte de A a B, mientras que un Journeyman''s Ox puede ayudarte a transportar grandes cargas de recursos u objetos.
• El mercado en Albion Online está impulsado por jugadores. Si vendes un objeto directamente, significa que has cumplido la Buy Order de otro jugador. Si creas una Sell Order, necesita que otro jugador la compre manualmente. ¡Ten cuidado con cómo vendes tus objetos para no perder Silver! Aquí puedes ver la interfaz para crear una Sell Order:', 'https://albiononline.com/guides/article/beginner-guide+109', false, array['https://assets.albiononline.com/uploads/media/default/media/6faf3af2dafac19fc72a4d22932acd1754447966.jpeg']::text[]),
    (v_guide, 6, 'Juego en grupo', 'Solo eres fuerte; con compañeros, imparable. Albion ofrece muchas actividades dirigidas a jugadores en solitario, pero se abre aún más cuando empiezas a formar equipo con otros.

Aquí tienes algunas actividades de grupo en las que puedes participar desde el principio.

Faction Warfare

Una vez que tengas gear de T4, estás listo para empezar a luchar en Faction Warfare. Busca al Faction Warmaster en una de las Royal Cities para alistarte y ganar recompensas valiosas. En Blue, Yellow y Red Zones puedes luchar contra jugadores de otras facciones y capturar o defender Faction Outposts. Tus contribuciones a la causa te darán puntos que pueden comprar objetos especiales en el Faction Warmaster.

Compite en la Arena y la Crystal Arena

Albion tiene dos modos de arena no letales, de 5 contra 5. La Arena es la versión casual, mientras que la Crystal Arena es más competitiva, con clasificaciones. ¡Únete a la cola de uno de estos modos y gana una partida para ganar recompensas!

Para apuntarte a una batalla de Arena, simplemente selecciona Arena desde el menú de Actividades.

Únete a un gremio

Ser miembro de un gremio abre un montón de contenido, te permite beneficiarte del conocimiento y la orientación de otros, y te da seguridad en números en las regiones más arriesgadas, pero más gratificantes, de Albion.

Albion Online tiene un Guild Finder dentro del juego, que facilita encontrar un gremio acogedor y amigable para principiantes. ¡Consulta nuestra guía y ve a encontrar a tus compañeros!', 'https://albiononline.com/guides/article/beginner-guide+109', false, array['https://assets.albiononline.com/uploads/media/default/media/c0382c2d79f31c3784e4999981282473b4c6e54e.png']::text[]),
    (v_guide, 7, 'Recursos útiles', 'Si quieres saber más sobre las diferentes actividades en Albion Online, te recomendamos consultar nuestra sección de guías o la Albion Online Wiki. Si tienes preguntas, puedes hacerlas en nuestro Beginner''s Questions Forum, el chat /help dentro del juego, o en nuestro Discord oficial. Aquí tienes algunos enlaces para ayudarte:

• Guías oficiales
• Albion Online Wiki
• Foro oficial
• Discord oficial', 'https://albiononline.com/guides/article/beginner-guide+109', false, array[]::text[]);
end
$IMPERIUM$;

-- [2] the-world-of-albion
do $IMPERIUM$
declare
  v_game uuid;
  v_guide uuid;
begin
  select id into v_game from public.games where slug = 'albion-online';
  if v_game is null then
    raise exception 'IMPERIUM: juego no encontrado: %', 'albion-online';
  end if;

  -- Reemplazo idempotente. OJO: borra los pasos -> reinicia step_progress de esta guía.
  delete from public.guide_steps where guide_id in (
    select id from public.guides where game_id = v_game and slug = 'the-world-of-albion');
  delete from public.guides where game_id = v_game and slug = 'the-world-of-albion';

  insert into public.guides
    (game_id, slug, title, description, order_index, is_published, intro_title, intro, intro_images)
  values
    (v_game, 'the-world-of-albion', 'El mundo de Albion', 'Un recorrido por las principales partes del mundo abierto de Albion.', 2, false, null, '¡Bienvenido a Albion, Aventurero!

El vasto mundo abierto de Albion está compuesto por cientos de zonas que abarcan cinco biomas diferentes a lo largo de dos continentes enormes. Todo puede resultar un poco abrumador, así que lo desglosaremos con las siguientes secciones:

• Los cinco biomas
• Los dos continentes
• Las ciudades de Albion
• Cómo moverse', array['https://assets.albiononline.com/uploads/media/default/media/a2cdc576df03596c30c1b4eac3be02482a50dd69.jpeg']::text[])
  returning id into v_guide;

  insert into public.guide_steps
    (guide_id, order_index, title, content, source_url, is_verified, images)
  values
    (v_guide, 1, 'Los cinco biomas de Albion', 'Las zonas de mundo abierto de Albion pertenecen a uno de cinco biomas (Steppe, Forest, Swamp, Mountain o Highlands), que determinan qué recursos y criaturas contienen. Además de sus propios elementos visuales y terreno distintivos, cada bioma contiene tres de los cinco recursos naturales principales:

• Steppe: hide, fiber, ore
• Forest: wood, hide, stone
• Swamp: fiber, wood, hide
• Mountain: ore, stone, fiber
• Highlands: wood, stone, ore
• El pescado se puede encontrar en los cinco biomas

Mientras que todo el Royal Continent está dividido equitativamente en cinco enormes regiones de bioma, las Outlands, en cambio, tienen "subregiones" de bioma que cambian a menudo de zona en zona. Cada una de las principales zonas de bioma en el Royal Continent tiene su propia Starter Town y Royal City correspondientes, con Caerleon en el centro y sin asociación a ningún bioma concreto.', 'https://albiononline.com/guides/article/the-world-of-albion+86', false, array['https://assets.albiononline.com/uploads/media/default/media/b6b014fa5fce5c218c20fd4e75248d091be6d1c3.jpeg']::text[]),
    (v_guide, 2, 'El Royal Continent: el corazón de Albion', 'Después de terminar el tutorial (que tiene lugar en su propia mini-isla separada), serás transportado al Royal Continent para empezar tu aventura. El Royal Continent es la enorme masa de tierra meridional de Albion, y alberga las cinco Starter Towns del juego (donde aterrizarás por primera vez tras el tutorial) y las seis Royal Cities.

El Royal Continent contiene blue, yellow y red zones, pero no black zones (consulta Zones and Flagging para más información). Así, aunque el PvP de botín completo es posible, el PvP de black zone, 100% sin flag y siempre hostil, está limitado a las Outlands.', 'https://albiononline.com/guides/article/the-world-of-albion+86', false, array[]::text[]),
    (v_guide, 3, 'Las Outlands: la frontera salvaje de Albion', 'Las Outlands son la principal masa de tierra septentrional de Albion, accesible desde el Royal Continent a través de cinco Realmgates en cada una de las cinco Royal Cities. Todas las zonas de las Outlands son black zones, lo que significa que se aplican las reglas de "el ganador se lo lleva todo", y cualquier jugador puede atacar a cualquier otro sin pérdida de reputación. Las Outlands son donde tiene lugar gran parte de la guild warfare de Albion, con gremios luchando por territorios y colocando Hideouts.', 'https://albiononline.com/guides/article/the-world-of-albion+86', false, array['https://assets.albiononline.com/uploads/media/default/media/e2bcece68b18927ce0ee8e1bad884208395f015b.jpeg']::text[]),
    (v_guide, 4, 'Reinos alternativos', 'El mundo abierto de Albion incluye reinos que existen en planos alternativos fuera de las regiones cartografiadas. Estos reinos son inestables, y presentan conexiones de zona impredecibles, limitaciones de tamaño de grupo y condiciones variables de entrada/salida.

Roads of Avalon: las Roads of Avalon son una red de cientos de regiones, accesibles a través de portales que se abren al azar por todo el mundo abierto. Una vez dentro, se aplican las reglas de PvP de Black Zone, y cualquier portal que encuentres podría llevar a cualquier parte del mundo abierto de Albion, o más adentro en las Roads, sin que ninguna conexión sea permanente.

The Mists: una región mágica a la que se puede entrar a través de portales efímeros. Estas áreas no corresponden a ningún bioma concreto y pueden contener todos los recursos. También puedes encontrar conexiones de un solo sentido a diferentes partes del mundo o un portal a la City in the Mists: Brecilien. Las Mists también presentan criaturas únicas que no se encuentran en ningún otro lugar, las cuales tienen una probabilidad de soltar artefactos raros y valiosos al ser derrotadas.', 'https://albiononline.com/guides/article/the-world-of-albion+86', false, array[]::text[]),
    (v_guide, 5, 'Las ciudades y pueblos de Albion', 'Starter Towns: cada gran región de bioma en el Royal Continent alberga una de las cinco "Starter Towns": Steppe Cross, Mountain Cross, Swamp Cross, Forest Cross y Highlands Cross. Estos pueblos ofrecen marketplaces básicos y crafting/refining stations para los jugadores que están empezando.

Royal Cities: cada una de las cinco regiones de bioma del Royal Continent también corresponde a una Royal City:

• Lymhurst (Forest)
• Bridgewatch (Steppe)
• Fort Sterling (Mountain)
• Martlock (Highlands)
• Thetford (Swamp)

Una sexta ciudad, Caerleon, se sitúa en el centro del Royal Continent.

Además de sus propias bonificaciones únicas de fabricación y refinado, las Royal Cities ofrecen parcelas de terreno en venta, acceso a islas privadas y de gremio, marketplaces locales gestionados por jugadores, la posibilidad de unirse a la Faction de la ciudad y luchar en el sistema de Faction Warfare de Albion, y (con la excepción de Caerleon) acceso a las Outlands a través de Realmgate.

Rests (pueblos de las Outlands): aunque las Outlands son generalmente salvajes y hostiles, tres pequeños pueblos llamados Rests (Merlyn''s Rest, Morgana''s Rest y Arthur''s Rest) ofrecen la oportunidad de comprar y vender mercancías, fabricar objetos, refinar recursos y desconectarse de forma segura en medio de las zonas más peligrosas de Albion.', 'https://albiononline.com/guides/article/the-world-of-albion+86', false, array['https://assets.albiononline.com/uploads/media/default/media/3f62750de37449b1711f0b1a93cc50fb439ded80.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/5c4e88c18fd5a74277da4e53ebb513bd48a8e7d4.jpeg']::text[]),
    (v_guide, 6, 'Cómo moverse por Albion', 'A pie o montado: la mejor manera de ver lo que Albion tiene para ofrecer es simplemente salir al mundo, ya sea a pie o sobre una montura de confianza. Tanto si tienes un destino en mente como si solo estás explorando, seguro que te encuentras con algo nuevo cada vez que sales. Por lo general, querrás llevar una montura contigo por la velocidad y el peso de carga adicionales que ofrecen.

Fast travel: en Albion, el fast travel está limitado a destinos específicos, y solo puede iniciarse a través del Travel Planner o de los NPC Island Merchant. Como el comercio y el transporte son partes esenciales de la economía de Albion, el fast travel a la mayoría de los destinos solo es gratis cuando tu inventario está completamente vacío, y se vuelve drásticamente más caro con cada objeto adicional.

Realmgates y Portal Towns: cada una de las cinco Royal Cities tiene un Realmgate que conduce a una Portal Town que comparte un Marketplace y un Bank con su ciudad correspondiente. Cada una de estas conduce luego a una parte diferente de las Outlands.', 'https://albiononline.com/guides/article/the-world-of-albion+86', false, array[]::text[]);
end
$IMPERIUM$;

-- [3] the-armory
do $IMPERIUM$
declare
  v_game uuid;
  v_guide uuid;
begin
  select id into v_game from public.games where slug = 'albion-online';
  if v_game is null then
    raise exception 'IMPERIUM: juego no encontrado: %', 'albion-online';
  end if;

  -- Reemplazo idempotente. OJO: borra los pasos -> reinicia step_progress de esta guía.
  delete from public.guide_steps where guide_id in (
    select id from public.guides where game_id = v_game and slug = 'the-armory');
  delete from public.guides where game_id = v_game and slug = 'the-armory';

  insert into public.guides
    (game_id, slug, title, description, order_index, is_published, intro_title, intro, intro_images)
  values
    (v_game, 'the-armory', 'El Armory', 'Descubre builds efectivas para cada tipo de contenido en Albion.', 3, false, null, 'Corrupted Dungeons, PvP en grupo, PvP en solitario, las Mists, la Arena, Faction Warfare… con tantas formas diferentes de luchar en Albion, puede ser difícil saber qué equipo llevar contigo. Ahí es donde entra el Armory.

Esta herramienta utiliza datos de juego constantemente actualizados para ofrecerte builds sugeridas para cada tipo de contenido. Puedes buscar por objetos específicos para encontrar una build que use tu arma favorita, filtrar por diversas métricas para encontrar una build que vaya a maximizar tu daño o supervivencia, o explorar una combinación de objetos completamente nueva y aprender a dominar un cierto tipo de contenido. El Armory te permite explorar incontables builds con un solo clic, antes de guardarlas como Loadouts para comprar, equipar y lanzarte a la acción.

¿Listo para probar una nueva build? Entonces sigue leyendo y aprende a sacar el máximo partido a esta herramienta.', array['https://assets.albiononline.com/uploads/media/default/media/9a3ae128765ca1d15520bf85117ff28178c0dbda.jpeg']::text[])
  returning id into v_guide;

  insert into public.guide_steps
    (guide_id, order_index, title, content, source_url, is_verified, images)
  values
    (v_guide, 1, 'Acceder al Armory', 'Desde el Player Menu

La forma más sencilla de acceder al Armory es a través del Player Menu. Así es cómo encontrarlo en escritorio, móvil y consola.

• Escritorio y móvil: haz clic o toca el Avatar de tu personaje (posición por defecto: arriba a la izquierda) para abrir el Player Menu. Desde aquí, selecciona ''Armory''.
• Mando: abre el radial menu (cruceta a la derecha), y cambia a Player Actions (alterna entre los menús con RB/LB). Desde aquí, selecciona la opción Armory.

Desde Item Details

También puedes acceder al Armory desde los Item Details de un arma. Selecciona un arma y desplázate hacia abajo hasta ''Recommended Builds''. Aquí puedes ver builds potenciales para uno o más tipos de contenido que incluyen esta arma. Hacer clic en ''View Build'' junto a una de estas abrirá esa build específica dentro del Armory.

Ten en cuenta que esto solo es posible con armas, no con objetos de Armor, offhands, u otros objetos.', 'https://albiononline.com/guides/article/armory+117', false, array['https://assets.albiononline.com/uploads/media/default/media/347f143f9d6894d9bd6200e46889ad0951c6dd08.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/4ac5da06c532fb8ede9c94bf2ce36f12af06b3f5.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/d10d9fb57050574513b7953d2f05c7089c4fbc3d.jpeg']::text[]),
    (v_guide, 2, 'Usar el Armory', 'Cuando abres el Armory desde el Player Menu, se te presentará el Activity Overview. Esto te muestra una amplia gama de tipos de contenido diferentes, desde Open World hasta las Depths y todo lo demás. Puedes navegar por ellos en busca de un tipo de contenido que te interese, o puedes filtrarlos por tamaño de grupo y tipo de actividad (como PvE, PvP, o contenido instanciado).

Seleccionar uno de estos tipos de contenido abre un desglose detallado de diferentes builds recomendadas para ese contenido. A la izquierda puedes desplazarte por estas diferentes builds, categorizadas por su arma principal.

Seleccionar una de las builds de esta lista mostrará su equipo a la derecha, junto con las habilidades sugeridas para cada objeto. También puedes ver la comida y pociones sugeridas para complementar cada build. Algunas builds tienen opciones alternativas para habilidades, comida y pociones, por las que puedes navegar usando las flechas debajo de las secciones de Equipment y Abilities.

También puedes usar filtros para centrarte en equipo concreto dentro de un tipo de contenido.

Selecciona ''Filter'' en la parte superior de la lista de builds, y se abrirá una ventana que te permite seleccionar objetos específicos, grupos de objetos, o una combinación de estos. Por ejemplo, si quieres una build efectiva que use un Great Arcane Staff y Plate Armor, puedes seleccionar Arcane Staff → Great Arcane Staff para la ranura de arma, y Plate Armor para la ranura de Armor.

Hacer clic en confirmar mostrará entonces una lista de builds para ese tipo de contenido que utilizan estos objetos específicos. Esto resulta especialmente útil si tienes equipo principal que te gusta usar porque se adapta a tu estilo de juego, y buscas objetos complementarios para sacar lo mejor de él en una situación dada.

Puedes volver al Activity Overview en cualquier momento haciendo clic en este icono junto al desplegable de Activity:

Métricas

La parte inferior de la ventana muestra las fortalezas y debilidades relativas de una build seleccionada en diversas métricas. Estas métricas cambian dependiendo del tipo de contenido que hayas seleccionado, mostrándote las más relevantes para cada campo.

El rendimiento de cada build en estas áreas se visualiza en un Radar Chart, lo que te permite centrarte fácilmente en las áreas que son importantes para ti. Por ejemplo, si quieres una build de Gathering que te permita escapar con facilidad, puedes navegar por las sugerencias y ver cuáles puntúan más alto en la métrica "Escape". Como alternativa, puedes mirar el panorama general y encontrar una build que sea un sólido todoterreno.

Además, un menú desplegable en la parte superior de la interfaz te permite seleccionar una métrica concreta en la que centrarte. Esto ajustará la lista para mostrar aquellas builds que son fuertes en esa área. Por ejemplo, seleccionar Lethality te mostrará una lista de builds con una alta tasa de muertes en tu tipo de contenido seleccionado. Luego puedes navegar por esa lista y mirar el Radar Chart para hacerte una idea de cómo rinde cada build en las demás métricas relevantes.

Por último, puedes filtrar por builds recientes o builds establecidas. Recent builds usa datos de juego recientes para mostrarte aquellas que han estado rindiendo bien últimamente, dándote opciones más cercanas al meta actual. Established builds, por otro lado, te muestra aquellas que han rendido durante un período más largo, dándote opciones más perennes que probablemente tengan éxito independientemente de los cambios en el meta.', 'https://albiononline.com/guides/article/armory+117', false, array['https://assets.albiononline.com/uploads/media/default/media/66795d92fdbe9cbbf8a8dabf50a1b634d8f49214.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/1da374f468400026c93928e048676e7ee68d29e4.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/1d935187dbbca1aa080bcc69f76ad011e42b75c1.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/5883c516afcc99704d1f3fd6b8fa14e4fdb1ce7e.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/a5c3e6bcaa576d8063947bd14be3967e90c1f0bf.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/c9038d354adb7260d52d3460aec5b80ae95d6df6.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/0439b78178a0655daf0a46359479a34dc67d5bcc.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/ca1f59c11b987c56d7b003ca1a509d0d9485aa1b.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/ea40ea332c52d370b180e5fc0e96dd58e8f6e881.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/6a5cee4c21f6900970b55b0f7d7f3c52565cf9ca.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/e58babb0c3d574a083a58499fbd252792f8d3bd9.jpeg']::text[]),
    (v_guide, 3, 'Guardar una build', 'Si has encontrado una build que te interesa, puedes guardarla como un Loadout para poder comprarla al instante desde el Marketplace. Haz clic en el botón Save en la parte inferior de la ventana.

Esto abrirá una ventana donde podrás asignar a tu Loadout un nombre, icono y color de fondo. También puedes elegir un nivel de Tier, Enchantment y Quality para la build. Seleccionar ''Advanced Settings'' te permite seleccionar Tier, Enchantment y Quality a nivel de objeto individual. Por ejemplo, si quieres una build de Tier 6.1, pero solo quieres una poción de Tier 5 para acompañarla, puedes hacerlo fácilmente aquí.

Hacer clic en ''Create'' guardará entonces tu build seleccionada como un Loadout y lo abrirá dentro de la interfaz de Loadouts. Aquí puedes editarlo y guardarlo más si lo deseas.

¡Ahora ya tienes un loadout del Armory! Si visitas un Marketplace, puedes seleccionarlo desde la pestaña Loadouts y comprarlo y equiparlo al instante antes de lanzarte al contenido de tu elección.

El Armory ofrece una forma fácil de encontrar una configuración de equipo efectiva para cualquier tipo de contenido que te interese, dándote la opción de construir en torno a tu arma favorita o explorar algo completamente nuevo. Con tantas combinaciones de objetos disponibles en Albion, esta es la forma más fácil de obtener opciones probadas y actualizadas con un solo clic.

Tanto si eres un jugador nuevo que busca explorar un nuevo tipo de contenido, como un veterano curtido que quiere probar una nueva arma, el Armory es tu amigo. ¡Explora tus opciones ahora y pruébalas en el fragor de la batalla!', 'https://albiononline.com/guides/article/armory+117', false, array['https://assets.albiononline.com/uploads/media/default/media/5328cf634126d3eed13f4b80281a7666879a3d97.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/11b1e0253cf8f3a028c080eb53710f590e4a87b0.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/ec3c7c5c53b939e3018724f619fc664bea93c3ec.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/f6fb4e95c3974f571c9d0cc17089551c69ad72c7.jpeg']::text[]);
end
$IMPERIUM$;

-- [4] faction-warfare
do $IMPERIUM$
declare
  v_game uuid;
  v_guide uuid;
begin
  select id into v_game from public.games where slug = 'albion-online';
  if v_game is null then
    raise exception 'IMPERIUM: juego no encontrado: %', 'albion-online';
  end if;

  -- Reemplazo idempotente. OJO: borra los pasos -> reinicia step_progress de esta guía.
  delete from public.guide_steps where guide_id in (
    select id from public.guides where game_id = v_game and slug = 'faction-warfare');
  delete from public.guides where game_id = v_game and slug = 'faction-warfare';

  insert into public.guides
    (game_id, slug, title, description, order_index, is_published, intro_title, intro, intro_images)
  values
    (v_game, 'faction-warfare', 'Faction Warfare', '¡Elige tu Faction y lucha por el honor y las riquezas!', 4, false, null, 'La Faction Warfare es una forma fantástica de experimentar batallas PvP a gran escala, dinámicas y basadas en objetivos en el Royal Continent. Cada ciudad del Royal Continent tiene su propia milicia a la que puedes apuntarte y participar en una guerra territorial continua con las otras cinco ciudades. Los jugadores que se alistan en una Faction contribuyen al éxito de esa Faction a través del combate PvP en blue, yellow y red zones, así como a través de actividades PvE.

Aquí tienes algunos de los conceptos clave de esta guía:

• Faction Flagging: esto significa mostrar oficialmente tu lealtad a una Faction, lo que te permite ganar recompensas de Faction, a la vez que te convierte en un objetivo de ataque para las Factions enemigas.
• Faction Points: una moneda específica de cada ciudad que puedes ganar participando en casi cualquier actividad mientras estás con flag de Faction.
• Faction Standing: una puntuación separada que mide tu progreso dentro de tu Faction actual; a medida que ganas más Faction Standing, tu Faction Rank aumenta.
• Faction Rank: un título e insignia que designan tu dedicación a la causa de tu ciudad. Alcanzar Faction Ranks más altos desbloquea recompensas.
• Regions: "zonas" individuales de mundo abierto, y los principales bloques de construcción del Royal Continent. Diferentes regions pueden tener diferentes reglas de PvP, ofreciendo las regions más peligrosas mayores recompensas.
• Provinces: grupos de regions en el Royal Continent que son propiedad de una Faction concreta, y que otras buscan capturar.

Cualquiera puede participar en Faction Warfare, siempre y cuando hayas desbloqueado Expert Adventurer en el Destiny Board (es decir, que tengas más de 157.000 de Fame total).

Esto la convierte en una gran forma de participar en PvP de grupo sin unirte a un gremio, y ganar recompensas como Faction Mounts, objetos de vanidad, y más.', array['https://assets.albiononline.com/uploads/media/default/media/307bd03785a3dbd355b30f17c53a70ef6ae71f67.jpeg']::text[])
  returning id into v_guide;

  insert into public.guide_steps
    (guide_id, order_index, title, content, source_url, is_verified, images)
  values
    (v_guide, 1, 'Alistarse en una Faction y poner el flag', 'Unirse a una Faction es fácil:

• Primero, ve a la ciudad cuya Faction deseas unirte
• Una vez allí, habla con el Faction Master, en el centro de cada ciudad
• Allí puedes hacer clic en Enlist para unirte a esa Faction

Alistarse no cuesta nada, y puedes ganar grandes recompensas con el tiempo al hacerlo. Puedes cambiarte a otra Faction más adelante, aunque puedes perder algo de Faction Standing o rango si lo haces, así que hay beneficios en permanecer leal a una Faction.

Cuando te unes a una Faction, tu Faction flag está inicialmente desactivado. Esto significa que no ganarás automáticamente Faction Points ni Faction Standing, pero tampoco pueden atacarte las Factions enemigas en Blue y Yellow Zones.

Cuando quieras poner el flag, visita al Faction Master y haz clic en Flag en la parte inferior de la ventana.

El flag de la Faction ahora aparece junto a tu avatar, y la insignia de rango específica de tu Faction aparece sobre tu personaje, junto a tu nombre.

Cuando tienes el Faction flag activado, pueden atacarte miembros de otras Factions. Sin embargo, en Blue y Yellow Zones no perderás ningún objeto si te matan. En su lugar, simplemente reapareces en el Outpost más cercano controlado por tu Faction dentro de esa region, con todo tu inventario y tu gear (dañado). Si tu Faction no controla ningún Outpost en esa region, reaparecerás en una entrada de la region.

Para apagar tu Faction flag y tomarte un descanso, simplemente haz clic en el flag junto a tu avatar. Puedes hacerlo en cualquier momento, en cualquier parte del mundo. Tras un breve canalizado, tu flag desaparece, y dejarás de ganar Faction Points y Faction Standing, o de ser atacado por Factions enemigas. Aunque tu flag esté apagado, sigues alistado en tu Faction, así que conservas los Faction Points que has ganado y el rango que has alcanzado.', 'https://albiononline.com/guides/article/faction-warfare+108', false, array['https://assets.albiononline.com/uploads/media/default/media/533b441e1a009500f315825869a56c6216ea32a3.png', 'https://assets.albiononline.com/uploads/media/default/media/661ef7dc621b95597e14497c768662689601d39a.png', 'https://assets.albiononline.com/uploads/media/default/media/f8223b0f6aceac3be000c957edd1399074875709.png', 'https://assets.albiononline.com/uploads/media/default/media/76c1e5f7a923cfbd91c238fa378ee9d11e0ca112.png']::text[]),
    (v_guide, 2, 'Faction Points y Standing', 'Mientras tengas el flag de Faction activado, puedes ganar Faction Points y Faction Standing por diversas actividades, incluyendo recolección, pesca, combate PvE y combate PvP contra Factions rivales. Pero la principal fuente de Faction Points y Faction Standing proviene de luchar por las Provinces.

Los Faction Points que ganas pueden gastarse como moneda en tu Faction Master. Simplemente visita al Faction Master en la ciudad apropiada, y selecciona la pestaña Faction Items.

Aquí verás varias recompensas que puedes comprar, como:

• City Hearts, que pueden usarse para fabricar Faction Capes y crear Faction Mounts
• Reward chests de la campaña de hierro
• City Crests, que pueden usarse para fabricar Faction Capes
• Baby Faction Mounts (Tier 5 y Tier 8), que pueden crecer hasta convertirse en monturas montables con hechizos únicos
• Objetos de vanidad de Faction, como el conjunto de vestuario Faction Legionnaire

Tu Faction no venderá estos objetos a cualquiera, sin embargo: solo los miembros de confianza pueden comprarlos. Ahí es donde entra el Faction Standing. Casi cualquier actividad que te dé Faction Points te dará Faction Standing al mismo tiempo. Esto contribuye a tu rango general con la Faction, y alcanzar rangos más altos te permite comprar mejores objetos de recompensa.', 'https://albiononline.com/guides/article/faction-warfare+108', false, array['https://assets.albiononline.com/uploads/media/default/media/af6247f7e0e6d0a18a4da1d725a48b6a874b9a28.png', 'https://assets.albiononline.com/uploads/media/default/media/d5fc0ebaefeacb039415a5a1e03edb45088f72f1.png', 'https://assets.albiononline.com/uploads/media/default/media/85bf4f5a1cde02e5380e3d62bea7d747fac51dfc.png']::text[]),
    (v_guide, 3, 'La Faction Campaign', 'Al participar en Faction Warfare, también puedes ganar Campaign Rewards. Por ejemplo, cada día puedes obtener Faction Standing extra si ganas cierto número de Faction Points. Mientras tanto, cada semana hay disponible un nuevo Faction Reward Chest para quienes ganen suficientes Faction Points.

Los Faction Reward Chests contienen botín aleatorio como bolsas de Silver, Tomes of Insight, artefactos, y más. Los cofres que se ponen a disposición cada semana se vuelven progresivamente más valiosos, pero debes desbloquearlos en secuencia. Para reclamar estos cofres, debes tener estado Premium activo.

Así es como ver tu información actual de Faction Warfare, incluyendo tu progreso de recompensas:

• Escritorio: abre el menú de Actividades y elige Faction Warfare (atajo: SHIFT+F)
• Móvil: toca el menú principal y elige Faction Warfare

En el lado derecho de la ventana de Faction Warfare hay dos pestañas adicionales con información importante:

• Faction Campaign Overview. Esta pestaña te da una impresión visual del estado de cada Faction en la campaña actual. En escritorio, al pasar el cursor sobre el flag de cualquier Faction se muestra un resumen de sus Faction points y territorios en esta campaña.
• La pestaña Personal Faction Warfare Overview. Esta pestaña muestra las estadísticas, bonificaciones y rango de Faction Warfare de tu personaje. Haz clic en Weekly Report para ver tu progreso de Faction Campaign de la semana actual y reclamar cualquier Faction Point extra.', 'https://albiononline.com/guides/article/faction-warfare+108', false, array['https://assets.albiononline.com/uploads/media/default/media/417c2d4abcba0ac7f4602879bc213982193dd500.png', 'https://assets.albiononline.com/uploads/media/default/media/70b1012d286ff37cf8a8927c898de90b9c6fc5f8.jpeg']::text[]),
    (v_guide, 4, 'Bonificaciones de Faction', 'Cuando estás jugando en una Province que tu Faction posee o está disputando, recibes bonificaciones a toda la Fame, loot y Silver que ganas. Esto también se aplica en Provinces donde tu Faction está disputando una Fortress. Estas bonificaciones se acumulan, así que cuando defiendes una Province que tu Faction controla, tus bonificaciones son aún mayores.', 'https://albiononline.com/guides/article/faction-warfare+108', false, array[]::text[]),
    (v_guide, 5, 'El mapa de Faction Warfare', 'Para ver el estado actual de la Faction Warfare, puedes usar la capa superpuesta de Faction Warfare en el World Map. Cuando abres el World Map (tecla: m), esta capa se activará automáticamente si tienes el flag de Faction. De lo contrario, puedes seleccionar ''Faction Warfare'' en el menú desplegable de la parte superior:

El mapa de Faction Warfare tiene dos modos, una vista de region y una vista de Province. Puedes alternar entre estas vistas seleccionando "Region Map" o "Province Map" en la parte superior, o acercando o alejando el zoom.

Vista de Region

Con el zoom acercado, el mapa de Faction Warfare te muestra las diferentes regions del Royal Continent, con los colores de cada Faction designando quién controla cada una de ellas:

• Bridgewatch: naranja
• Martlock: azul
• Thetford: morado
• Fort Sterling: blanco
• Lymhurst: verde
• Caerleon: negro

Cada region también muestra su Zone Value, representado por 1-5 estrellas bajo su nombre. Las regions de mayor valor ofrecen más Faction Points a la Faction que las controla, ofreciendo generalmente las blue y yellow zones menos valor que las red zones. Este valor se reinicia a 1 cada vez que una region es capturada, acumulándose de nuevo con el tiempo hasta que cambia de manos otra vez.

También puedes ver dónde se encuentran las Faction Fortresses y los Outposts:

Vista de Province

El World Map también muestra los límites de las diferentes Provinces, y la vista de Province te da una visión más clara de estas.

El estandarte en el centro de una Province muestra qué Faction la controla actualmente, al igual que el color de los límites de la Province. Si una region muestra un color y el límite de la Province muestra un color diferente, significa que una Faction controla los Outposts de una region pero una Faction diferente controla la Province.

La vista de Province te permite ver qué ataques están teniendo lugar actualmente. Una línea de galones rojos indica que una Province está atacando actualmente a otra.

Además, si el estandarte en el centro de una Province está resaltado en rojo, significa que esa Province está actualmente bajo ataque. Hacer clic en el estandarte de una Province que está bajo ataque muestra el estado actual de su conflicto, y los Supplies de cada Faction implicada (más sobre esto a continuación).', 'https://albiononline.com/guides/article/faction-warfare+108', false, array['https://assets.albiononline.com/uploads/media/default/media/7c5c65b7c173113ddab6aa5292c524f297c7e479.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/8a01b29138f7ab4ab04cdfbea0e13c4c18b852e0.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/09da7cd695dac5a657b703ea7d60c34ac6e68c4b.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/b79e6a3f8e6499bc3fa800cd324e8210d650c0e2.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/9adc4ded13f12ae2176d6f226f4d31a7ce9b3ae7.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/0bbe79accf3698fd51dc9a2e068daca641a8dd5c.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/5084a523bcd17fcbb1e45fd857e184a8446e45e0.jpeg']::text[]),
    (v_guide, 6, 'Conflicto de Provinces', 'Ahora es el momento de entrar en la lucha, y ver cómo puedes dar forma al curso del conflicto de Factions.

Las Provinces son los territorios por cuyo control luchan las Factions, y actúan como los principales teatros de la acción de Faction Warfare. Los conflictos de Province generalmente siguen este flujo:

• Una Province inicia un ataque sobre una Province vecina
• Las Factions implicadas compiten por reunir Supplies
• A una hora fijada, se evalúa la cantidad de Supplies que cada bando ha reunido
• Si la Faction defensora tiene la mayoría de Supplies, es declarada ganadora y el ataque es repelido
• Si una Faction atacante tiene la mayoría de Supplies, es declarada ganadora y se inicia un Fortress Siege (consulta ''Fortress Sieges'' más abajo)

Ahora veamos cada uno de estos pasos con más detalle.

Iniciar ataques

Los ataques de Province se inician automáticamente según ciertas condiciones:

• Si una Faction ha defendido con éxito una Province de un ataque, lanzará entonces un ataque propio
• Si una Faction ha capturado con éxito una Province, lanzará entonces un nuevo ataque sobre una Province vecina
• Si una Faction tiene muy pocos ataques en curso, lanzará uno nuevo. En cualquier momento, una Faction debería estar enzarzada en dos ataques sobre Provinces no letales, y un ataque sobre una Province letal

Ten en cuenta que una Province puede tener como máximo un ataque saliente sobre una Province letal en cualquier momento. Si ya tiene uno en curso, no iniciará otro ataque sobre una Province letal.

Supplies

Cuando una Province está bajo ataque, las Factions implicadas compiten por reunir Supplies para su esfuerzo bélico. Puedes generar Supplies a través de las siguientes actividades:

• Controlar Outposts. Esto genera Supplies para la Faction que los controla con el tiempo
• Abrir Faction Chests. Esto genera Supplies solo para la primera Faction que abre el cofre
• Completar Faction Camps. Esto genera Supplies solo para la primera Faction que abre el cofre

Realizar estas actividades en una Province que está bajo ataque generará Supplies para tu bando, tanto si estás atacando como defendiendo esa Province. En algunos casos más de una Faction puede atacar una Province al mismo tiempo, ¡lo que significa tres o más Factions compitiendo por Supplies!', 'https://albiononline.com/guides/article/faction-warfare+108', false, array[]::text[]),
    (v_guide, 7, 'Actividades', 'Faction Outposts

La mayoría de las regions del Royal Continent contienen al menos un Faction Outpost. Puedes reconocerlos en el World Map por estos iconos, con el estandarte indicando qué Faction los controla:

Cada Outpost es una pequeña fortificación protegida por al menos siete guardias y un jefe. Para capturar un Outpost enemigo, forma equipo con otros jugadores que tengan el flag de tu Faction y derrota a todos los guardias y al jefe. Luego, ponte de pie en el gran círculo en el centro del Outpost (debes estar a pie, no montado) y espera mientras el anillo alrededor del círculo se llena lentamente con el color de tu Faction.

Una vez que este anillo esté completo, ¡tu Faction tiene el control del Outpost!

Si tu Faction controla más Outposts que cualquier otra Faction en una region concreta, empezarás a conquistar esa region. Un medidor de progreso comienza a llenarse mientras mantengas la mayoría de los Outposts, y si se llena por completo, el control de la region pasa a tu Faction.

Faction Chests

Los Faction Chests son objetivos por los que las Factions rivales compiten por botín y Supplies. Vienen en dos tamaños: pequeño y mediano, y pueden reconocerse en el mapa de region por estos iconos:

La primera Faction en abrir un Faction Chest gana Supplies para los esfuerzos de su Faction en la Province, mientras que el botín se reparte entre todos los jugadores de esa Faction dentro de cierto radio, no solo los del mismo Party. ¡Sin embargo, miembros de otras Factions pueden colarse y llevarse el botín para sí mismos si son lo bastante rápidos!

Faction Camps

Similar a los Faction Chests, los Faction Camps aparecen en Provinces disputadas y vienen en dos tamaños: Small Camps para jugadores en solitario y grupos pequeños, y Medium Camps para grupos medianos. Estos pueden reconocerse en el mapa de region por estos iconos:

Los Faction Camps son campamentos de suministros que han sido invadidos por bandidos, y tu objetivo es completarlos derrotando a todos estos bandidos y abriendo el cofre que yace en el corazón del campamento. Ten en cuenta que, a diferencia de campamentos similares en el mundo abierto o en las Mists, cada enemigo dentro de un Faction Camp necesita ser derrotado para desbloquear el cofre.

Una vez disponibles, estos cofres se comportan como los Faction Chests mencionados antes. De nuevo, ¡mantén los ojos atentos a luchadores de Factions rivales en la region que busquen entrar y llevarse los Supplies y el botín después de que te hayas abierto camino entre los bandidos!', 'https://albiononline.com/guides/article/faction-warfare+108', false, array['https://assets.albiononline.com/uploads/media/default/media/fa76c2186cbc7101d1f3726f3a97c5025fa1f7bf.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/42ed1e01bdafd3dc9935b5371a9a72603c73283b.png', 'https://assets.albiononline.com/uploads/media/default/media/02141a34a8de7d2c6d83d4a575b4f979984b7910.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/424d6e6a27ade83dcd193e4e004b44c21fded26d.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/296d4dda8d31a32a69ae6b87ec54196f54698fb3.jpeg']::text[]),
    (v_guide, 8, 'Fortress Sieges', 'A horas fijadas durante el día, se evalúa la cantidad de Supplies que cada Faction ha generado en cada Province. Estas horas varían por servidor, y pueden verse en la vista de Province del World Map, bajo ''Siege Times'':

En este punto, ocurre una de dos situaciones:

• Si la Faction defensora tiene más Supplies, el ataque es repelido, y la Faction defensora ataca una Province vecina
• Si la Faction atacante tiene más Supplies, comienza un Fortress Siege

Los Fortress Sieges son la etapa culminante de un conflicto de Province: batallas a gran escala por el control del área. Cada Province contiene una Faction Fortress, marcada en el World Map con este icono:

Una vez que una Faction atacante ha ganado la carrera por los Supplies, las Factions tienen 15 minutos para reunir sus fuerzas para el Siege. Una vez que el Siege está en marcha, todos los jugadores que no son de la Faction defensora son retirados de la Fortress, y los guardias defienden las defensas. También notarás una barra de progreso en la parte superior de tu pantalla:

Esta es la barra de Fortress Defense, y marca la duración del Siege. El objetivo de los atacantes es atravesar los muros de la Fortress y reclamar la torre del centro antes de que esta barra se llene. El objetivo de los defensores es mantener a raya a los atacantes hasta que la barra se llene y el Siege sea declarado terminado.

Los muros de la Fortress pueden ser dañados o reparados por jugadores que tengan Siege Hammers en su inventario, dependiendo de si están atacando o defendiendo. Así que, sea cual sea tu bando, ¡asegúrate de llevar un Siege Hammer antes de llegar a la lucha!

Last Stand

Si los atacantes consiguen abrirse paso hasta la torre del centro de la Fortress, los defensores entran en un Last Stand. Guardias duros toman las armas alrededor de la torre, a los que los atacantes deben derrotar antes de poder capturar la Fortress. Esto compra a los defensores tiempo extra para reagruparse, tiempo que puede ser inestimable para permitirles aguantar a los atacantes.

Una vez dentro de la torre, los atacantes necesitan permanecer allí el tiempo suficiente para ser declarados victoriosos. Un anillo de progreso se llena gradualmente con el color de la Faction atacante, y una vez que este se llena por completo, los atacantes triunfan y toman el control de la Province.

Weapons Caches

Durante un Fortress Siege, pueden aparecer Weapons Caches en el área alrededor de la Fortress. Estas proporcionan una bonificación a cualquiera de los bandos que las capture:

• Si los defensores capturan una Weapons Cache, reciben un impulso a su Fortress Defense Progress
• Si los atacantes capturan una Weapons Cache, los defensores pierden algo de Fortress Defense Progress, comprando esencialmente más tiempo a los atacantes
• La Faction que captura la Weapons Cache también recibe un buff acumulable a su daño y defensa. Este buff se aplica a todos los jugadores de esa Faction en la region de la Fortress hasta la finalización de la lucha de la Fortress

Cuando aparecen por primera vez están bloqueadas, y todos los jugadores de la region son notificados. Cuando esto ocurre, puedes formar un grupo de avanzada que abandone el Siege principal e intente capturar la Weapons Cache. ¡Sin embargo, seguro que el otro bando la disputará, así que no esperes conseguirla sin pelear!

El bando que gane el Fortress Siege tiene el control de la Province, y lanzará un ataque sobre una Province vecina. El impulso del conflicto de Factions puede depender de estos momentos, así que asegúrate de que tu fuerza esté bien preparada, lleva tus Siege Hammers, y ponte manos a la obra.', 'https://albiononline.com/guides/article/faction-warfare+108', false, array['https://assets.albiononline.com/uploads/media/default/media/fb130419996d611f04de3a5c6b1b644dd17dd40c.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/6a6e53d514d7ecb7d50f929ab0e65a06fb12f870.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/09c557ff4162f7c253b5639fc14afaf338c8b3a9.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/5e44bf2316b122f13c33daff3b96b65ef0ca882f.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/e475eb57ec792cfa405f04153949a1b6ed9133ea.jpeg']::text[]),
    (v_guide, 9, 'Faction Transports', 'Para ahorrar tiempo de viaje, los Faction Transports te ofrecen una ruta directa a la acción. Estos carromatos pueden encontrarse en las Royal Cities y en las Faction Fortresses de Yellow Zone, marcados por este icono de brújula:

En las Royal Cities, se encuentran junto al Faction Master, lo que significa que puedes dirigirte directamente a las líneas del frente una vez que hayas puesto el flag de tu Faction.

Hacer clic en un Faction Transport te ofrece una elección de destinos, que puedes ver en este desplegable:

Seleccionar un destino muestra el estado actual de su conflicto en la interfaz, y hacer clic en ''Travel Map'' te muestra la Province en el mapa del mundo.

Los Faction Transports pueden llevarte a:

• Una Province donde tu Faction está en conflicto
• Un party abierto que se encuentra actualmente en una Province que está en conflicto
• La Royal City de tu Faction

Dependiendo del estado del conflicto de la region de destino, puedes llegar a una entrada de region, a un Outpost amigo, o a una Fortress amiga. Ten en cuenta que al viajar a red zones, solo están disponibles las entradas junto a una Province de yellow zone controlada por tu Faction: no puedes viajar a lo profundo de una red zone.

Usar un Faction Transport requiere una tarifa de Silver, que se calcula en función de los objetos que llevas y la distancia a tu destino elegido. ¡Los objetos equipados cuentan menos que los objetos en tu inventario, así que equipa primero tus objetos de mayor valor!

Open Parties

Los Parties con flag de Faction en una Province que está en conflicto pueden abrirse para recibir refuerzos. Cualquier Party que lo haga puede aparecer en una lista de destinos de Faction Transport, así que puedes encontrar directamente un grupo al que unirte y meterte en la acción.', 'https://albiononline.com/guides/article/faction-warfare+108', false, array['https://assets.albiononline.com/uploads/media/default/media/1332a0f940b184abb2b54a9cbe913166f40dafd1.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/2c5631bc7e304a03fee810120150ac133289ddef.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/63784e1ea1000cbda6568b3b12d73ec031bbe64f.jpeg']::text[]),
    (v_guide, 10, 'Provinces aisladas', 'Las Provinces aisladas (cut-off) se comportan ligeramente diferente a la mayoría de las demás. Una Province se considera aislada si no está conectada directamente a su Royal City mediante Provinces amigas. En las Provinces aisladas:

• No se conceden bonificaciones de Fame, Silver ni loot a la Faction que las controla
• No aparecen Faction Camps ni Faction Chests
• No hay disputa por Supplies
• Las Fortresses pueden ser atacadas en cualquier momento por una Faction que controle todas las regions dentro de la Province, y una Province adyacente que no esté aislada

Estas Provinces son particularmente vulnerables, ¡así que intenta asegurarte de que las Provinces de tu Faction no lleguen a este estado!', 'https://albiononline.com/guides/article/faction-warfare+108', false, array['https://assets.albiononline.com/uploads/media/default/media/8ab1e50652746e15ae131abc3716c4cc95c6fb72.jpeg']::text[]),
    (v_guide, 11, 'Bandit Assault', 'Más allá de las batallas por las Provinces, hay otras actividades de Faction en las que puedes participar para ganar recompensas, como el Bandit Assault.

El Bandit Assault es un evento que ocurre periódicamente en las Provinces letales, a horas aleatorias. Ofrece a los jugadores de cada Faction la oportunidad de ganar Faction Points extra, y disfrutar de buffs de Fame, Silver y loot en las Provinces donde el Bandit Assault está activo.

Durante el evento, cada Faction compite por ganar la mayor cantidad de Bandit Assault Supplies. Estos pueden ganarse de las mismas actividades que los Supplies normales, pero se contabilizan de forma independiente. Si estás en una Province donde tu Faction está en conflicto, ganarás Supplies para ese conflicto así como para el Bandit Assault al mismo tiempo. Al final del evento, cada Faction recibe Faction Points según su clasificación en el Bandit Assault.

Durante el evento, los Bandit Assault Supplies de cada Faction pueden verse en la capa superpuesta de Faction Warfare del World Map.

El Bandit Assault consta de dos fases. En la primera fase, todos los Outposts de las Provinces letales son tomados por Caerleon. Durante esta fase, todas las actividades de Faction Warfare pueden encontrarse en todas las Provinces letales.

En la segunda fase, el Bandit Assault se concentra en solo dos Provinces letales. Estas Provinces están marcadas en el World Map con este icono:

Los Bandit Assault Supplies solo pueden ganarse en estas Provinces durante esta fase, pero a un ritmo muy aumentado. Además, las Faction Fortresses de estas Provinces entran en juego. Un cofre aparece en la torre de cada Fortress, conteniendo enormes cantidades de loot y Bandit Assault Supplies, pero que está inicialmente bloqueado.

La Faction que controla la Fortress intenta defenderla hasta que el cofre se desbloquee, mientras que las otras Factions pueden intentar irrumpir en la Fortress y abrir el cofre para sí mismas. Durante el Bandit Assault la Fortress, y por extensión la Province, no puede cambiar de manos: este Siege es puramente por el cofre.

Poco después de que el Fortress Siege termine, el evento Bandit Assault finaliza y cada Faction recibe una cantidad significativa de Faction Points según sus clasificaciones en la carrera por los Bandit Assault Supplies.', 'https://albiononline.com/guides/article/faction-warfare+108', false, array['https://assets.albiononline.com/uploads/media/default/media/c084661bc791d3ef6cf3957ae8e0816cbe163cc5.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/26b065f452807f5c586c8ea10d05ad39f08c7d7c.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/188be3402788bd51b38b2eca2d8071d07ece3b91.jpeg']::text[]),
    (v_guide, 12, 'Faction Battle Standards', 'Los Faction Battle Standards son objetivos transportables que pueden aparecer en cualquier Province que esté en conflicto. Tu objetivo es entregar uno a un Outpost amigo, donde tú y cualquiera que luche a tu lado seréis recompensados con Faction Points.

Una vez que un Battle Standard aparece en el mundo abierto, está inicialmente bloqueado durante un breve tiempo. Durante este período, su ubicación se marca en el Region Map, y adicionalmente en el World Map para todos los jugadores de las regions cercanas.

Cualquier jugador con flag de Faction puede recoger un Battle Standard. Solo pueden transportarse a pie, pero el portador recibe un buff de velocidad de movimiento cuando no está en combate, así que puedes seguir el ritmo del resto de tu grupo al transportar uno. Un Battle Standard puede transportarse entre Provinces de la misma letalidad, pero no de No letal a Letal o viceversa.

Al participar en combate de Faction y capturar Outposts, el Prestige de un Battle Standard puede aumentarse, lo que significa que recompensa más Faction Points al entregarse. Hay cuatro niveles de Prestige: Uncommon, Rare, Epic y Legendary. En los niveles Uncommon y Rare, tanto el PvE como el PvP de Faction pueden hacer progresar un Battle Standard. A partir del nivel Epic, solo el PvP de Faction contribuirá. Puedes ver el nivel de Prestige de un Battle Standard en el HUD cuando transportas uno.

Si un Battle Standard se suelta, conserva su nivel de Prestige. Esto significa que las Factions rivales pueden intentar robar uno en una lucha, y entregarlo a uno de sus propios Outposts. ¡Mantente alerta!

Una vez que has recogido un Battle Standard, el Region Map y el Minimap mostrarán los Outposts de la region donde puedes entregarlo.

La bardo Fiona Fableheart estará esperando en el Outpost para recibir tu Battle Standard y recompensaros a ti y a cualquiera que luchara a tu lado en su trayecto con Faction Points.', 'https://albiononline.com/guides/article/faction-warfare+108', false, array['https://assets.albiononline.com/uploads/media/default/media/6c265a2bdb0ac90307e8cbb952cab97976b4908b.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/1b3d3fed44882e86e75d590c08714ba4f4c18d66.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/bd57d87aad6f5d940fd8543aa2f9f4bc5b060404.jpeg']::text[]),
    (v_guide, 13, 'Faction Hearts', 'Junto a todas las demás actividades de Faction Warfare, puedes ganar City Hearts completando misiones de transporte. Estas misiones implican transportar City Hearts muy pesados a través de territorios potencialmente peligrosos y entregarlos a un contrabandista, para luego regresar a salvo con una caja de los City Hearts de la Faction enemiga. Para apuntarte a una misión, visita al Faction Master de tu ciudad y elige la pestaña Trade Missions para ver los contratos disponibles. Luego, elige lo pesada que quieres que sea tu carga, y hacia qué ciudad quieres dirigirte.

Luego, entrega los contenedores llenos de City Hearts a un NPC ubicado en algún punto entre tu ciudad y la ciudad enemiga.

Cuando una misión de Faction está activa, la descripción de la misión enumerará los nombres de hasta tres zonas donde puedes entregar la carga.

Si abres el World Map y haces zoom en los mapas de estas regions, verás un signo de interrogación amarillo que indica la ubicación general del objetivo. Puedes entregar tu carga, y recibir carga de retorno a cambio, en cualquiera de los campamentos objetivo.

Si consigues llegar al objetivo y volver a tu Faction Master sin ser matado ni abandonar tu pesada carga, la misión se completa y recibirás tu recompensa.

La Faction Warfare ofrece PvP de grupo en el Royal Continent con valiosas recompensas en juego, y el orgullo de luchar por tu ciudad y expandir sus territorios. ¡Alístate ahora, sube a un Faction Transport, y sal a las líneas del frente. Tu Faction te necesita!', 'https://albiononline.com/guides/article/faction-warfare+108', false, array['https://assets.albiononline.com/uploads/media/default/media/c2dade624e940df77c6544b062e2aac0e45f9f96.png', 'https://assets.albiononline.com/uploads/media/default/media/be2bd07a57459d66d871a69765aa010130d50507.png', 'https://assets.albiononline.com/uploads/media/default/media/f7af78c4eb5b6288f583306f2b13086d9a4561df.png', 'https://assets.albiononline.com/uploads/media/default/media/839948fcd88ea11c46352b8e422cde15c07bd361.png']::text[]);
end
$IMPERIUM$;

-- [5] learning-points
do $IMPERIUM$
declare
  v_game uuid;
  v_guide uuid;
begin
  select id into v_game from public.games where slug = 'albion-online';
  if v_game is null then
    raise exception 'IMPERIUM: juego no encontrado: %', 'albion-online';
  end if;

  -- Reemplazo idempotente. OJO: borra los pasos -> reinicia step_progress de esta guía.
  delete from public.guide_steps where guide_id in (
    select id from public.guides where game_id = v_game and slug = 'learning-points');
  delete from public.guides where game_id = v_game and slug = 'learning-points';

  insert into public.guides
    (game_id, slug, title, description, order_index, is_published, intro_title, intro, intro_images)
  values
    (v_game, 'learning-points', 'Learning Points', 'Acelera tu progreso usando los Learning Points de forma inteligente.', 5, false, null, 'Desarrollar tu personaje en Albion Online es un viaje con muchas posibilidades, y los Learning Points pueden ayudarte a progresar esencialmente cinco veces más rápido. Esta guía muestra cómo funcionan los Learning Points, cómo conseguirlos, y cómo usarlos sabiamente para avanzar en las áreas que te importan.', array['https://assets.albiononline.com/uploads/media/default/media/2766ac484f0092728f6336638d640205a791706b.png']::text[])
  returning id into v_guide;

  insert into public.guide_steps
    (guide_id, order_index, title, content, source_url, is_verified, images)
  values
    (v_guide, 1, '¿Qué son los Learning Points?', 'Los Learning Points (LP para abreviar) permiten a tu personaje acelerar considerablemente el progreso en cualquier área del Destiny Board. La cantidad de Learning Points que tienes puede verse en la parte superior del Destiny Board:

Puedes usar los Learning Points activando Quick Learn en el Destiny Board, mediante el interruptor de la parte superior.

Cuando esto se hace, cualquier nodo (un nivel de maestría de una habilidad específica) en el que tengas Quick Learn activado consumirá Learning Points, multiplicando por cinco cualquier Fame que ganes hacia el progreso de ese nodo. Tener Quick Learn activado en un nodo gastará automáticamente Learning Points a medida que ganas Fame para él.

Como la cantidad de Fame necesaria para completar un nodo varía, también varía la cantidad de Learning Points que gastarías para completarlo con Quick Learn. Cada Learning Point cuenta esencialmente como más Fame en niveles más altos del Destiny Board. Puedes ver la cantidad de Learning Points necesarios para completar un nodo haciendo clic en él:', 'https://albiononline.com/guides/article/learning-points+103', false, array['https://assets.albiononline.com/uploads/media/default/media/e962ff2650c9acd203de00e7aca0c6db957dcc94.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/5865ef06a0f0d4e8818221b9e8f0666a025cde55.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/ae9e5f200e85e6435b208a4544422100ee9dcb3a.jpeg']::text[]),
    (v_guide, 2, 'Quick Learn', 'Siempre que Quick Learn está activado, tu Destiny Board entra en un estado potenciado (boosted), indicado por efectos visuales en el centro y en cualquier nodo para el que Quick Learn esté activado.

Puedes alternar Quick Learn en los propios nodos individuales. Como alternativa, puedes abrir el Quick Learn menu en la parte superior del Destiny Board:

Aquí puedes ver tus ajustes de Quick Learn por categoría, y hacer clic en el nombre de cada categoría muestra esa sección concreta en el Destiny Board.

Las categorías de nodos se dividen aquí en dos tipos:

• Generalist Nodes: estos cubren tipos de habilidad más amplios, como Bow Fighter, o Hammer Crafter
• Specialist Nodes: estos cubren actividades más específicas, como Longbow Combat Specialist, o Forge Hammers Crafting Specialist', 'https://albiononline.com/guides/article/learning-points+103', false, array['https://assets.albiononline.com/uploads/media/default/media/b3dda1e183eddf99a026ac2c4fd0dc7703e89da8.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/ad220ed13cb3e5cb24e5d142c319e3215a7d8034.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/7ab4c9e2ea6c1fd6b26308aa84e8f4e1b3ee28d2.jpeg']::text[]),
    (v_guide, 3, '¿Cómo consigo Learning Points?', 'Los Learning Points pueden obtenerse de varias formas:

• Ganas automáticamente 30 LP cada día por tener estado Premium activo
• También recibirás 500 Learning Points la primera vez que compres 7 días de Premium o más para un personaje
• Los personajes sin Premium pueden ganar 10 Learning Points completando el daily Adventurer''s Challenge
• Puedes obtener Tomes of Learning completando ciertas misiones del Albion Journal. Estos recompensan una cierta cantidad de Learning Points cuando se usan, dependiendo de su tier', 'https://albiononline.com/guides/article/learning-points+103', false, array['https://assets.albiononline.com/uploads/media/default/media/4b02ca55e22f4f1fddb5b31a35505c933b6f7e20.jpeg']::text[]),
    (v_guide, 4, '¿Cómo puedo usar los Learning Points?', 'Los Learning Points pueden usarse para progresar en casi cualquier área de tu Destiny Board. Aquí tienes algunas de las más comunes:

Combat

Puedes gastar Learning Points en la maestría de Weapon/Armor para desbloquear la capacidad de usar objetos de tier superior. Si se usan en los nodos de especialización del exterior del Destiny Board, pueden potenciar el Item Power de cada objeto.

Consejo: dado que la Fame de combate es comparativamente fácil de conseguir en Albion, quizá quieras considerar usar tus Learning Points en otras áreas en las que desees progresar primero.

Crafting

De forma similar al combate, la maestría de crafting te permite fabricar objetos de tier superior, mientras que la especialización reduce los costes de Focus y aumenta las probabilidades de fabricar objetos de mayor calidad.

Consejo: a menudo se recomienda usar Learning Points para progresar a través de las especializaciones de crafting de nivel inferior, lo que te permite desbloquear fácilmente fabricación más valiosa y de mayor nivel.

Refining

Cuando se trata de refinado, el primer nivel dentro de un nodo desbloquea la capacidad de refinar un nuevo tier de materiales. Después de eso, niveles adicionales aumentan tu eficiencia de Focus.

Consejo: si te interesa el refinado, a menudo se recomienda usar Learning Points para aumentar tu especialización y convertirte en un maestro refinador.

Gathering

Los Gathering nodes funcionan como el refinado. Alcanzar el primer nivel de un nodo desbloqueará un nuevo tier de herramientas de recolección y armadura de recolección, mientras que niveles posteriores dentro de un nodo aumentan la velocidad de recolección y el rendimiento de recursos dentro de ese tier.

Consejo: la recolección es un gran lugar para usar Learning Points al principio. A menudo se recomienda usar Learning Points para desbloquear el primer nivel de un nuevo tier de recolección, de modo que puedas usar mejores herramientas y armadura de recolección mientras empiezas a progresar hacia el siguiente tier.

Los Learning Points no pueden usarse para potenciar el progreso a través de los nodos Adventurer y Reaver, ni en nodos de nivel inferior (por debajo de los niveles Generalist).

Cómo gastas tus Learning Points depende en última instancia de ti, y realmente depende de las actividades que quieras hacer en Albion. Y recuerda, si en algún momento no estás seguro, siempre puedes conservar tus Learning Points por ahora y usarlos más tarde. ¡Feliz aprendizaje!', 'https://albiononline.com/guides/article/learning-points+103', false, array['https://assets.albiononline.com/uploads/media/default/media/5cf6cc80053a63d81da587dec20d82533b6a9412.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/582640b9761da2bbaa2671ed033aaa2783d44ae0.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/942432c8e485ff3eeb185110b5e2bd652d446d17.jpeg']::text[]);
end
$IMPERIUM$;

-- [6] corrupted-dungeons
do $IMPERIUM$
declare
  v_game uuid;
  v_guide uuid;
begin
  select id into v_game from public.games where slug = 'albion-online';
  if v_game is null then
    raise exception 'IMPERIUM: juego no encontrado: %', 'albion-online';
  end if;

  -- Reemplazo idempotente. OJO: borra los pasos -> reinicia step_progress de esta guía.
  delete from public.guide_steps where guide_id in (
    select id from public.guides where game_id = v_game and slug = 'corrupted-dungeons');
  delete from public.guides where game_id = v_game and slug = 'corrupted-dungeons';

  insert into public.guides
    (game_id, slug, title, description, order_index, is_published, intro_title, intro, intro_images)
  values
    (v_game, 'corrupted-dungeons', 'Corrupted Dungeons', 'Demonios diabólicos y duelos PvP te esperan en esta mazmorra infernal en solitario.', 6, false, null, 'Las Corrupted Dungeons ofrecen una mezcla única de contenido PvE de matanza de demonios con la posibilidad de encuentros PvP en solitario. Ya seas un jugador nuevo que se está orientando en Albion, o un aventurero veterano en busca de contenido emocionante, ofrecen tanto combates trepidantes como botín rentable. Y la actividad PvP en las Corrupted Dungeons también puede otorgarte Antiquarian Standing, que puedes usar para comprar recompensas de temática infernal en el Antiquarian''s Den.

Esta guía te explicará los conceptos básicos de las Corrupted Dungeons, los tres niveles de dificultad distintos, cómo funcionan la Infamy y las recompensas, y qué debes esperar al enfrentarte a invasiones PvP. Al final, contarás con todo el conocimiento que necesitas para empezar.', array['https://assets.albiononline.com/uploads/media/default/media/8d6686b9790ba692156cc798ee7365c2a7c68e02.jpeg']::text[])
  returning id into v_guide;

  insert into public.guide_steps
    (guide_id, order_index, title, content, source_url, is_verified, images)
  values
    (v_guide, 1, '¿Qué son las Corrupted Dungeons?', 'Las Corrupted Dungeons son mazmorras en solitario impregnadas de fuerzas demoníacas. Son instanciadas, y cada una se siente ligeramente distinta. Dentro encontrarás pasillos de enemigos demoníacos a los que dar muerte, recibiendo puntos de Infamy como recompensa por ello. Una vez que hayas ganado suficiente Infamy en la mazmorra, emergerá un jefe demonio final, que ofrece una gran cantidad de Fame y botín si logras derrotarlo.

Lo que hace únicas a las Corrupted Dungeons es la forma en que integran el PvP. En cualquier momento puedes ser invadido por otro jugador, o puedes intentar invadir tú mismo a otro aventurero. Esto hace que el contenido sea a la vez impredecible y gratificante, mientras farmeas mobs PvE en busca de botín, Fame e Infamy, al tiempo que te preparas para un duelo uno contra uno.', 'https://albiononline.com/guides/article/corrupted-dungeons+116', false, array['https://assets.albiononline.com/uploads/media/default/media/7b265fca45c1617162120c5a37851d6c9ddf0c72.jpeg']::text[]),
    (v_guide, 2, '¿Qué es la Infamy?', 'La Infamy es un sistema de progresión usado en las Corrupted Dungeons y en los Hellgates. Cada vez que matas mobs o mini-jefes dentro de una de estas mazmorras, tu Infamy aumenta. Una vez que has ganado cierta cantidad de Infamy durante una incursión individual en la mazmorra, aparece el jefe final, permitiéndote completar la mazmorra.

La Infamy también se contabiliza de forma continua: la cantidad que ganas en cada incursión se suma al total de tu personaje. Una Infamy total más alta significa:

• Recibes más Fame en las Corrupted Dungeons
• Te enfrentarás a jugadores con mayor Infamy

Una derrota PvP en una Corrupted Dungeon reduce tu Infamy total en un 10%, mientras que derrotar a otro jugador te otorga el 10% de su Infamy total.', 'https://albiononline.com/guides/article/corrupted-dungeons+116', false, array['https://assets.albiononline.com/uploads/media/default/media/5239734b5ceff64242de72b7b3de7cf4a874c0fa.jpeg']::text[]),
    (v_guide, 3, 'Entrar en una Corrupted Dungeon', 'La forma más sencilla de entrar en una Corrupted Dungeon es desde un Antiquarian''s Den, presente en cada ciudad del Royal Continent. El Antiquarian''s Den está marcado en el mapa de la región con este icono naranja:

Una vez dentro del Antiquarian''s Den, la entrada a la Corrupted Dungeon es el gran óvalo naranja brillante:

Como alternativa, puedes encontrar entradas a Corrupted Dungeons en el mundo abierto. Busca una entrada de piedra, similar a la de una mazmorra en solitario, pero con un brillo naranja que emana de su interior:

Por último, puedes comprar o conseguir como botín un mapa de Corrupted Dungeon. Usar uno de estos revelará una entrada en el mundo abierto para ti.

Cuando interactúas con la entrada de una Corrupted Dungeon, aparecerá una interfaz donde puedes seleccionar el nivel de dificultad: Hunter, Stalker o Slayer.

Ahora echemos un vistazo a estos distintos niveles de dificultad.', 'https://albiononline.com/guides/article/corrupted-dungeons+116', false, array['https://assets.albiononline.com/uploads/media/default/media/73b35ff0a3692fa14c8198031938c7da769b15d7.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/a44b808ae43eb2c1b5e74a38cc702a69ae5b4536.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/992fbf6f7e9c3c9524b50bf303542ca2352aad40.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/eccb230034d71998f2e2f462738d10d29ff88846.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/a5d03b3b18032a250725f5b81166be5801994be6.jpeg']::text[]),
    (v_guide, 4, 'Hunter, Stalker y Slayer', 'Hay tres niveles de Corrupted Dungeons, para distintos niveles de equipo y experiencia del jugador. Los requisitos de entrada, las recompensas y las reglas de PvP cambian según la dificultad.

Cada nivel tiene un requisito de Base Item Power para entrar. Este valor se calcula a partir del IP medio de tu equipo de combate equipado, excluyendo bonificaciones como Mastery u Overcharge. Puedes consultar tu Base IP en la pestaña de Detalles del Inventario o en la interfaz de la entrada de la mazmorra:

Hunter
• Requisito de Base Item Power: mínimo 800
• Tope blando (Softcap) de Item Power: 900 (con una reducción del 90% por encima de este punto)
• Reglas de PvP: aquí no puedes morir por PvP; si te derrota otro jugador, quedas derribado y no pierdes ningún objeto, solo durabilidad en tu equipo

El nivel Hunter es el punto de entrada a las Corrupted Dungeons y la mejor opción para principiantes. Si equipas equipo equivalente a Tier 5, tendrás suficiente Item Power para participar. Como las derrotas en PvP no resultan en muerte, es el entorno más seguro para aprender las mecánicas de la mazmorra y experimentar invasiones sin el riesgo de perder tu equipo.

El tope blando de 900 IP significa que si, por ejemplo, entras con 1000 de Item Power, este se reducirá a 910 dentro de la mazmorra. Esto evita que los jugadores con equipo poderoso dominen por completo.

Stalker
• Requisito de Base Item Power: mínimo 900
• Tope blando de Item Power: 1000 (con una reducción del 80% por encima de este punto)
• Reglas de PvP: PvP de botín completo (full loot); si mueres, pierdes todo tu equipo, inventario y montura

Las mazmorras Stalker son donde el peligro aumenta. Te enfrentarás a mobs de Tier 6, más duros que los de las mazmorras Hunter, pero la diferencia real reside en las reglas de PvP. Perder aquí significa que tu oponente se marcha con todo lo que llevabas.

Este nivel es ideal para jugadores que están cómodos con sus builds, tienen algunas reservas de Silver para reemplazar el equipo perdido y quieren la emoción del PvP en solitario de alto riesgo.

Slayer
• Requisito de Base Item Power: mínimo 1200
• Requisito de Infamy: mínimo 100.000
• Tope blando de Item Power: 1300 (con una reducción del 50% por encima de este punto)
• Reglas de PvP: PvP de botín completo (full loot); si mueres, pierdes todo tu equipo, inventario y montura

Las mazmorras Slayer son la cúspide del contenido de Corrupted Dungeon. Te enfrentarás a mobs de Tier 8, los jefes más duros y, por lo general, a jugadores de PvP más experimentados. El tope blando de Item Power es menos restrictivo aquí, ya que los jugadores con exceso de equipo solo reciben una reducción del 50% sobre su Item Power excedente.

Debido a su requisito de Infamy, no puedes lanzarte directamente a las mazmorras Slayer. Tendrás que forjar tu reputación primero en Corrupted Dungeons de nivel inferior. Esto garantiza que el nivel Slayer quede reservado para los jugadores más dedicados y preparados.

Alcanzar los 100.000 de Infamy desbloquea permanentemente el acceso a las mazmorras Slayer. Incluso si tu Infamy cae luego por debajo de esa marca, seguirás pudiendo entrar en las mazmorras Slayer cuando quieras.', 'https://albiononline.com/guides/article/corrupted-dungeons+116', false, array['https://assets.albiononline.com/uploads/media/default/media/a61fd466704f373c1201ab5cc52b70e8c24ae330.jpeg']::text[]),
    (v_guide, 5, 'Mecánicas PvE', 'Para completar una Corrupted Dungeon, necesitas ganar suficiente Infamy matando mobs para revelar al jefe final. Puedes ver tu progreso actual en el rastreador del HUD:

El minimapa te muestra las ubicaciones de los mobs en la mazmorra, para que sepas adónde tienes que ir a matar más de ellos.

Por el camino te encontrarás con mini-jefes antes del demonio final. Derrotar a uno de estos desbloquea un cofre (que va de Común a Legendario) y otorga botín e Infamy. Estos mini-jefes son más duros que los mobs estándar, pero normalmente mucho más gratificantes, así que nunca deberías saltártelos.

Las Corrupted Dungeons también incluyen algunos mobs que no se encuentran en ningún otro lugar: unas criaturas especiales con forma de murciélago llamadas Mephits con mecánicas únicas que pueden influir tanto en las peleas PvE como en las PvP. Hay tres tipos de Mephit, y cada uno tiene un efecto particular al ser eliminado:

• Arcane Mephit: deja una nube de veneno que silencia a los jugadores y duerme a los mobs
• Magma Mephit: deja un charco de magma que inflige daño elevado
• Volatile Mephit: explota, derribando a los que están cerca e infligiendo daño

Similares a estos son los Bloated Gluttons, que escupen un rastro de fuego al morir. Estas mecánicas añaden una capa extra de estrategia al combate de las Corrupted Dungeons, ya que puedes intentar arrastrar a los mobs u otros jugadores hacia estos peligros para obtener ventaja en combate. Un uso inteligente de estos mobs puede marcar la diferencia entre la victoria y la derrota en los encuentros PvP.

Después de derrotar al jefe final, podrás elegir: puedes regresar a Albion, reapareciendo donde entraste a la mazmorra; o puedes continuar directamente hacia otra Corrupted Dungeon. Si continúas, la siguiente mazmorra tendrá el mismo nivel de dificultad que la que acabas de completar.', 'https://albiononline.com/guides/article/corrupted-dungeons+116', false, array['https://assets.albiononline.com/uploads/media/default/media/740e32d489d0eecebef7a41b83edbbb5d82dfdce.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/2ffb8a5026fe03fa2d04eacc8dd511c1a11b4921.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/62c4673508c41ce7d279f401df766365a76f9cc3.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/c883e665bc699516d36a961d796c7455d23bd714.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/b1f1dc7cd5307ca267708f12ffcff6fac5cddad7.jpeg']::text[]),
    (v_guide, 6, 'Invasiones PvP', 'La característica que define a las Corrupted Dungeons es su mecánica de invasión. Cuando entras, verás un Demonic Shrine (santuario demoníaco) frente a ti.

Si interactúas con él, puedes elegir hacerte elegible para invadir la mazmorra de otro jugador durante tu incursión. Hacerlo también aumentará las probabilidades de que alguien invada tu mazmorra. Aunque usar este santuario no garantiza que se produzca una invasión, aumenta mucho sus probabilidades.

No puedes saber con certeza si serás el invasor o el invadido hasta que llega el momento. Antes de invadir la mazmorra de otro jugador, un mensaje en pantalla te dirá que "poderes infernales te mueven a otro lugar". Unos segundos después, te encontrarás caído dentro de la mazmorra de otro jugador, y depende de ti encontrarlo y luchar contra él.

Si otro jugador invade tu mazmorra, aparece un mensaje en pantalla que dice que "sientes una presencia malvada". Cuando esto ocurre, aparecen en la mazmorra una serie de cristales llamados Demonic Shards, visibles en el minimapa.

Destruir tres de estos desterrará al otro jugador de tu mazmorra, dejándote libre para seguir luchando contra los demonios en solitario. Sin embargo, el otro jugador intentará darte caza y derrotarte en combate, así que tienes que ser rápido.

Por supuesto, también puedes simplemente ignorar los Shards y desterrar a tu enemigo venciéndolo en combate. Puedes sentarte y esperar a que se acerque, o ir a buscarlo tú mismo, aunque puede que tengas que abrirte paso entre algunos mobs antes de llegar hasta él.

Cuando hay dos jugadores dentro, unos Demonic Watchers (vigilantes demoníacos) deambulan por la mazmorra. Si uno de estos se acerca a un jugador, transmite brevemente la ubicación de ese jugador en el minimapa, dando al otro una pista de dónde encontrarlo.

También puedes hacerte una idea de la ubicación de tu oponente observando los mobs del minimapa. Si algunos desaparecen de repente, sabes que tu oponente está ahí.

Si ganas una pelea PvP, recibes una parte de la Infamy de tu oponente, además de algo de botín. Y, en los modos Slayer y Stalker, recibirás también su equipo e inventario. Si ganas una pelea como invasor, serás teletransportado de vuelta a tu mazmorra original tras unos segundos.', 'https://albiononline.com/guides/article/corrupted-dungeons+116', false, array['https://assets.albiononline.com/uploads/media/default/media/ec2dd316628e3dcaa0414a060f1b0e9b23ac1b7a.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/81cc717ba32bf0352f34c6a57843d02261e81a11.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/cce3377d6e1e1e8f6a6852a9cf3129ec47b3e2fd.jpeg']::text[]),
    (v_guide, 7, 'Consejos para principiantes', 'Empieza en mazmorras Hunter
No te lances de cabeza al nivel Stalker. Las mazmorras Hunter te permiten aprender el sistema de invasión sin arriesgar tu equipo.

Lleva equipo asequible
En los modos letales, nunca lleves equipo que no puedas permitirte perder. Muchos veteranos usan builds económicas pero fuertes, diseñadas especialmente para el PvP de mazmorras.

Aprende a usar el entorno
Los mobs enemigos y los murciélagos pueden cambiar el rumbo de un PvP. Colócate de forma que los invasores se vean forzados a entrar en los peligros del entorno.

Ten equipo de repuesto listo
Si mueres en una mazmorra Stalker o Slayer, querrás equipo de reserva para volver a entrar rápido. Tener algunos juegos guardados en el banco local resulta útil para volver a la acción.

Saber cuándo marcharse
A veces irse es la mejor opción. Si te superan en equipo o simplemente no ves la forma de matar a tu oponente, destruir los Demonic Shards para desterrarlo podría salvar tu preciado equipo.

Las Corrupted Dungeons son una forma fantástica de experimentar la mezcla única de PvE y PvP de Albion Online. Para los principiantes, sirven como una introducción de bajo riesgo al PvP en solitario a través del nivel Hunter, y a medida que ganas confianza puedes avanzar a las mazmorras Stalker y, finalmente, Slayer, para obtener mayores recompensas.

Las claves del éxito residen en comprender el riesgo frente a la recompensa, usar el entorno a tu favor y saber cuándo luchar y cuándo retirarse. Con el tiempo, irás acumulando tu Infamy, desbloquearás mayores desafíos y quizás incluso encuentres tu propia build favorita para dominar estas mazmorras.

¡Lánzate ahora y descubre adónde te lleva tu viaje!', 'https://albiononline.com/guides/article/corrupted-dungeons+116', false, array[]::text[]);
end
$IMPERIUM$;

-- [7] the-mists
do $IMPERIUM$
declare
  v_game uuid;
  v_guide uuid;
begin
  select id into v_game from public.games where slug = 'albion-online';
  if v_game is null then
    raise exception 'IMPERIUM: juego no encontrado: %', 'albion-online';
  end if;

  -- Reemplazo idempotente. OJO: borra los pasos -> reinicia step_progress de esta guía.
  delete from public.guide_steps where guide_id in (
    select id from public.guides where game_id = v_game and slug = 'the-mists');
  delete from public.guides where game_id = v_game and slug = 'the-mists';

  insert into public.guides
    (game_id, slug, title, description, order_index, is_published, intro_title, intro, intro_images)
  values
    (v_game, 'the-mists', 'The Mists', 'Una experiencia única y lucrativa para jugadores en solitario y en dúo.', 7, false, null, 'The Mists son regiones que existen fuera del espacio y el tiempo normales de Albion, donde deambulan criaturas místicas y aguardan valiosos tesoros. Aquí puedes recolectar valiosos recursos de todo tipo y acceder a zonas aún más mágicas, incluida la mazmorra Knightfall Abbey y la ciudad oculta de Brecilien. Sigue leyendo para descubrir qué puedes hacer dentro de este extraño reino...', array['https://assets.albiononline.com/uploads/media/default/media/c6e340d3c0662d0acf5017a4374d00c0c7af3c5c.jpeg']::text[])
  returning id into v_guide;

  insert into public.guide_steps
    (guide_id, order_index, title, content, source_url, is_verified, images)
  values
    (v_guide, 1, '¿Cómo entro en The Mists?', 'Para entrar en The Mists desde el Royal Continent, los Outlands o las Roads of Avalon, primero necesitas encontrar un Wisp deambulando por cualquier Yellow Zone, Red Zone o Black Zone. Los Wisps son pequeños orbes azules flotantes, así:

Si te acercas al Wisp a pie (no montado), inicialmente se alejará y emitirá un chillido. Síguelo un poco más y abrirá un portal a otra dimensión para escapar.

Lo único que tienes que hacer es seguirlo a través del portal. Bienvenido a The Mists.', 'https://albiononline.com/guides/article/mists+115', false, array['https://assets.albiononline.com/uploads/media/default/media/3571860a687714a5e0e85862484b357f92e633ba.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/ae1eb06f285926a80f20352c05dc8762e44ff12f.jpeg']::text[]),
    (v_guide, 2, 'Tipos de Mists', 'Mists y Greater Mists
Hay dos tipos de regiones de Mists, para jugadores en solitario o en dúo.

En las regiones de Mists normales, solo una persona puede entrar a través de cada portal temporal. Un número relativamente pequeño de jugadores poblará cada región de Mists, todos procedentes de distintas ubicaciones del mundo de Albion. Cuando una región alcanza su límite, no pueden entrar más jugadores.

En cambio, las Greater Mists están diseñadas para equipos de dos jugadores, y puedes formar grupo con otro jugador allí. Aún puedes entrar solo si quieres, pero es probable que te encuentres con equipos de dos jugadores. Hasta dos jugadores pueden entrar por un portal de Greater Mists, aunque no necesariamente en equipo: entra solo y puede que te siga un jugador hostil.

En las Yellow Zones, cada Wisp abre un portal de Mists en solitario, mientras que en las Red Zones y Black Zones algunos Wisps abren portales a las Greater Mists.

Independientemente de si es a través de un portal en solitario o en dúo, no puedes ver ni controlar adónde vas. Cada región de Mists es una instancia única y aleatorizada. No puedes pedir refuerzos, porque nadie puede elegir unirse a la misma región en la que estás. Pero esto también significa que nadie puede aliarse con otros para entrar en la misma región de Mists y emboscar al puñado de jugadores en solitario o en dúo que hay dentro.

Non-lethal Mists
Si entras en The Mists desde una Yellow Zone, siempre entras en una Non-lethal Mist. Estas siguen las mismas reglas de PvP que las Yellow Zones del mundo abierto. Los jugadores pueden atacarte si están marcados para PvP, pero esto rara vez ocurre en la práctica. La derrota en PvP significa que quedas derribado y no pierdes ningún objeto. Si te derriban en The Mists, eres expulsado de vuelta a la ubicación exacta desde la que entraste originalmente.

Lethal Mists
Si entras en The Mists desde una Red Zone o Black Zone, siempre entras en una Lethal Mist. Todos quedan marcados automáticamente como hostiles y pueden atacarte, y el PvP resulta en muerte, haciéndote perder todo tu inventario y los objetos equipados. Reaparecerás en la última ciudad que visitaste o en una ubicación que hayas establecido como Home.

Ten en cuenta que el combate dentro de The Mists no tiene efecto sobre tu reputación en el Royal Continent.

Niveles de rareza
Cada Wisp tiene un nivel de rareza, y los del mundo abierto pueden aumentar con el tiempo. Un nivel de rareza más alto significa que la región de Mists a la que conduce contiene recursos más valiosos, y mobs más duros pero más valiosos, con mayores recompensas de Fame, Might y Favor por tus actividades.', 'https://albiononline.com/guides/article/mists+115', false, array['https://assets.albiononline.com/uploads/media/default/media/5a62646f3ba89a4012be6ace99e98f9dc0467bff.jpeg']::text[]),
    (v_guide, 3, 'Características únicas', 'The Mists presentan varias mecánicas únicas:

Anonimato
En The Mists, nadie conoce tu nombre. Cada jugador aparece ante los demás como Mysterious Stranger (Extraño Misterioso). Esto significa que nadie te reconocerá por tu nombre, y tú no distinguirás a un jugador de otro salvo por sus monturas y equipo. Sin embargo, si entras en las Greater Mists en grupo, tú y tu compañero seguiréis pudiendo ver vuestros nombres.

Tiempo limitado
Tras un tiempo variable, The Mists se alzarán y envolverán la región en la que estás, expulsándote finalmente de vuelta al mundo abierto. Cuando quedan cinco minutos en una instancia de Mists, verás un temporizador en la parte superior de tu pantalla:

A medida que este temporizador se agota, notarás que la pantalla se vuelve cada vez más brumosa, hasta que apenas puedas ver lo que haces. Cuando expire por completo, serás expulsado de vuelta al mundo abierto, al lugar desde el que entraste a The Mists. Ten en cuenta que esto no te daña a ti ni a tu equipo de ningún modo.

Si no estás listo para abandonar The Mists, puedes encontrar otro Wisp, cruzar un portal a otra región de Mists y continuar tu aventura.

Debuffs de The Mists
Dentro de The Mists, la curación aplicada se reduce un 30%, la salud de la montura se limita a 900, y la Armadura y la Resistencia Mágica de la montura se limitan a 120. Además, las Non-lethal Mists están sujetas al mismo tope blando de 1200 IP que las Yellow Zones del mundo abierto. Todo esto está pensado para fomentar las peleas entre jugadores y evitar que las builds de curación sean demasiado poderosas.

Periodo de enfriamiento al desmontar más largo
En el mundo abierto o en las Roads of Avalon, si te desmontas cerca de un jugador hostil, recibes un enfriamiento de cinco segundos antes de poder usar tus habilidades. En The Mists, sin embargo, si dos jugadores ya están luchando entre sí, desmontar cerca resulta en un enfriamiento de quince segundos.', 'https://albiononline.com/guides/article/mists+115', false, array['https://assets.albiononline.com/uploads/media/default/media/4965bba46be87d1d0a2b4c87824d636b1c383851.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/4bc71bc4543d5c6df579d22648b2d85acf1ad52b.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/2178ae65359fe2d87505f416d56158838b75af0d.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/98a7b60f08ad20aac1d6c53970660df816002f8a.jpeg']::text[]),
    (v_guide, 4, '¿Por qué debería ir a The Mists?', 'Aunque The Mists son bastante similares al mundo abierto en algunos aspectos, hay algunas diferencias importantes. Como se ha mencionado, The Mists están diseñadas de modo que no te encontrarás con grandes escuadrones de ganking mientras estés dentro. La posibilidad de PvP siempre existe, pero como mucho contra dos jugadores. Si eres cuidadoso, a menudo puedes evitar el PvP por completo.

Mientras tanto, explorar The Mists puede ser muy lucrativo. Puedes recolectar los cinco tipos de recursos (Stone, Ore, Fiber, Hide, Wood) en cualquier región de Mists, y algunas actividades exclusivas de The Mists ofrecen botín valioso. Además, jugar en The Mists puede otorgarte Challenge Points, Fame de combate y, en las Lethal Mists, también Might y Favor.

Aparte de esto, en The Mists se pueden encontrar varias actividades únicas.

Rescatar Wisps enjaulados
Dispersos por cualquier región de Mists encontrarás Wisps que han sido enjaulados por los demás habitantes. Al liberar a estos Caged Wisps, puedes ganar Fame y una pequeña cantidad de Brecilien Standing (más sobre esto más abajo), así como Might y Favor en las Lethal Mists. Para liberar a un Caged Wisp, simplemente necesitas interactuar con él, y tras un breve canalizado escapará. Sin embargo, suelen estar custodiados por uno o más mobs, a los que tendrás que derrotar primero. Ten cuidado con otros jugadores que se acerquen sigilosamente e intenten aprovecharse de ti cuando estés en medio de la pelea contra estos mobs.

Limpiar campamentos de mobs
También se pueden encontrar campamentos de mobs dispersos por The Mists, de distintos tamaños. Para completar un campamento, necesitas matar mobs que valgan cierta cantidad de Fame dentro de él. Cuando entras en el área de un campamento de mobs, aparece un nuevo objetivo en tu rastreador del HUD mostrando tu progreso en este objetivo:

Completarlo desbloqueará un Cache (alijo) en lo más profundo del campamento, que puede contener botín valioso y otorgarte algo de Brecilien Standing.

Sin embargo, incluso en las Non-lethal Mists, cada campamento de mobs es un área de PvP sin restricciones. Vigila siempre a los jugadores que merodean cerca y quieren atacar mientras estás debilitado y tus enfriamientos están gastados de pelear contra los mobs. Si ves gente rondando cerca del campamento, o si ves a otros jugadores luchando contra los mobs, considera volver más tarde.

Escoltar Wisps debilitados
De vez en cuando aparecerá una Turbulent Mist, marcada en el minimapa así:

Al igual que con los campamentos de mobs, las Turbulent Mists en las Non-lethal Mists están rodeadas por un área de PvP sin restricciones, así que mantente atento a otros jugadores que puedan ser una amenaza.

Tras un tiempo determinado, un Weakened Wisp aparecerá de la Turbulent Mist. Puedes ver cuánto tiempo falta para que esto ocurra pasando el cursor por encima:

El objetivo es escoltar al Weakened Wisp hasta un refugio seguro, ubicado en algún lugar dentro de la región de Mists actual. Esta ubicación aparece en el mapa solo para la persona que lleva al Weakened Wisp; nadie más puede ver dónde está. Y cuando se ha recogido a un Weakened Wisp, este desaparece del mapa.

Sin embargo, otros pueden atacarte mientras llevas al Weakened Wisp y quedárselo ellos. Además, no se te permite montar mientras escoltas a un Weakened Wisp, y debes transportarlo a pie. Incluso en las Non-lethal Mists, quedas marcado para PvP mientras lleves un Weakened Wisp, así que cualquiera es libre de atacarte.

Una táctica popular es que los jugadores esperen cerca de una Turbulent Mist, pero no lo bastante cerca como para estar en la misma pantalla. Estarán atentos a que el Weakened Wisp desaparezca del mapa, lo que significa que alguien lo ha recogido, y entonces se abalanzarán e intentarán matar a la persona que lo escolta. ¡Ten cuidado!

Si consigues transportar al Weakened Wisp a salvo hasta su destino, ganarás una gran cantidad de Brecilien Standing. Y, en las Lethal Mists, también ganarás bastante Might y Favor.

Knightfall Abbey
Knightfall Abbey (a menudo referida como KFA en el chat) es un tipo de mazmorra en The Mists que ofrece muchas oportunidades de ganar grandes cantidades de botín mientras compites con otros jugadores en un entorno PvPvE. Knightfall Abbey viene en modos en solitario y en dúo, Lethal y Non-lethal. Sin embargo, incluso si entras en Knightfall Abbey desde unas Non-lethal Mists, toda la mazmorra es un área de PvP sin restricciones, donde la derrota conduce al derribo. Si entras desde unas Lethal Mists, la mazmorra es un área de full-loot.

Una entrada a Knightfall Abbey puede aparecer en cualquier región de Mists, aunque no es algo común. Si ves este icono en el minimapa, sabrás dónde encontrar una:

La entrada tiene este aspecto:

Una vez dentro, te encontrarás en las ruinas de una antigua abadía, ahora ocupada por los No-muertos. La abadía consta de una serie de salas: derrota a los mobs que habitan una sala, y la estatua de la sala revelará o bien un cofre lleno de botín, o bien una mejora (buff) para ayudarte a medida que avanzas por la mazmorra.

Además, puedes encontrar Cofres del Tesoro y Cofres (Coffers) a medida que avanzas por la abadía.

Igual que The Mists, las instancias de Knightfall Abbey tienen tiempo limitado, y tras un rato serás expulsado de vuelta al mundo abierto. Sin embargo, hay salidas repartidas por toda la abadía, que te permiten marcharte con tu botín antes de que llegue ese momento.

Recolección
The Mists pueden ser un lugar muy valioso para recolectar. A los recolectores les encanta The Mists porque los cinco tipos de recursos están disponibles en cada zona de Mists, así como peces.

Las Non-lethal Mists contienen recursos de Tier 2 a Tier 5 (y a veces peces de Tier 6). Las Lethal Mists pueden tener recursos de hasta Tier 8. Las regiones de Mists con mayor rareza tienen más probabilidades de tener recursos de tier superior.

Resource Mists
También puedes encontrar un tipo especial de región de Mists orientada especialmente a la recolección: las Resource Mists. Son áreas de Mists más pequeñas y ricas en recursos, que también vienen en variantes en solitario y en dúo.

Para encontrar una Resource Mist, busca un Dynamic Resource Hotspot en el mundo abierto (en regiones de Tier 5 y superiores). Dentro de estos, puedes encontrar un Verdant Wisp; estos son de color verde, en lugar del azul de un Wisp estándar. Cuando los persigues, abrirán una entrada a una Resource Mist.

El tipo principal de recurso que se encuentra en una Resource Mist corresponde al del Dynamic Resource Hotspot en el que encontraste el Verdant Wisp. Por ejemplo, si entras desde un hotspot de Ore, la Resource Mist contendrá principalmente Ore.

Criaturas en The Mists
Toda clase de criaturas mágicas tienen su hogar en The Mists, y la mayor parte de la fauna local (de Tier 1 a Tier 8) es completamente ajena a las tierras de Albion.

Además, los Arcane Spiderlings son versiones más pequeñas de las Crystal Spiders que encuentras en el mundo abierto. Están diseñados para ser abatidos por jugadores en solitario, pero aun así ofrecen enormes recompensas.

Por último, dentro de The Mists puedes encontrar Rare Creatures: jefes únicos que aparecen muy rara vez. Hay tres Rare Creatures distintas con las que podrías toparte: Griffin, Fey Dragon y Veilweaver. Son muy difíciles de derrotar, pero pueden soltar botín muy valioso, incluidos Fey Artifacts especiales que se pueden usar para fabricar los distintos tipos de Fey Armor:

• Las escamas del Fey Dragon se pueden tejer en Cloth Armor
• Las plumas del Griffin se pueden coser en Leather Armor
• El caparazón del Veilweaver se puede forjar en Plate Armor

Las probabilidades de encontrar una Rare Creature en The Mists mejoran significativamente en los niveles de rareza más altos.', 'https://albiononline.com/guides/article/mists+115', false, array['https://assets.albiononline.com/uploads/media/default/media/8c59d88a696fc119de9ad3ece0f262dcc9f98137.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/5c3f3ddccabcfdc38b4b7a1b495648166e684135.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/bd35f74a3d07d33318f9cd948a5ba68d119e963f.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/109dc17cf706cef6c5ab929c85a036222c830729.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/1e291ed40b464e1351f2de3efa99d91737fd5736.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/436c018e9b504340a55a1c556450b53db8fd8955.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/8d40dfb9eb9751bc507a7cd16c11002e71e6dc00.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/bf142dd64592a9cc3ace9d47fb2da95abbfc4090.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/978134ac3b6d5dc79d838a50be095bc9746e66b3.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/15b6f35d56d3d9d272ed4c4f2565177f3c77216b.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/fbbc780747825e066f70981dd9b5d759ffec67e9.jpeg']::text[]),
    (v_guide, 5, 'Brecilien', 'Si eso no es suficiente para tentarte, hay un lugar misterioso dentro del reino de The Mists que aún no hemos mencionado: Brecilien, la ciudad en The Mists.

Descubrirás que Brecilien no es accesible al principio; de hecho, ni siquiera podrás encontrar el camino hasta allí. Sin embargo, realizar ciertas actividades en The Mists, como liberar Wisps atrapados o transportar Weakened Wisps a un lugar seguro, te otorgará Brecilien Standing. Esto puede entenderse como una medida del nivel de confianza que la ciudad tiene en ti, y cuando alcanzas 50.000 de Brecilien Standing, te conviertes en Accepted (Aceptado).

Cuando esto ocurre, empezarás a ver portales a Brecilien dentro de The Mists. Estos no siempre están presentes, pero puedes localizarlos en el minimapa con este icono:

Interactúa con uno de estos portales y serás transportado a una ciudad mágica que flota a la deriva dentro de estos reinos.

Nota: si entras en Brecilien desde The Mists, no hay una ruta directa de vuelta a la región del mundo abierto desde la que entraste a The Mists. Puedes viajar de vuelta al Royal Continent a través del Travel Planner, pero ten en cuenta que se cobrará una tarifa de Silver basada en el equipo e inventario que lleves.

Brecilien es una ciudad completa y bulliciosa en tres niveles, con casi todas las instalaciones que encontrarías en una Royal City, incluida la oportunidad de comprar allí una isla personal. Brecilien incluso tiene su propio vendedor de facción, Eralia Wayfarer, que ofrece objetos especiales a quienes tengan suficiente Brecilien Standing, a cambio de Favor.

Interactuar con el portal por el que entraste a Brecilien te transportará a una región de Mists aleatoria. Desde aquí puedes elegir si entrar en una región Lethal, Non-lethal o Greater Mists.

Brecilien también tiene cuatro regiones de Mists fijas a su alrededor: tres Lethal y una Non-lethal. Estas pueden ofrecer algunas oportunidades de recolección lucrativas, así como Wisps que te transporten más adentro de The Mists.

Una vez que has visitado Brecilien una vez, puedes volver a alcanzarla a través del Travel Planner o usando la habilidad Journey Back, así como a través de portales en The Mists y las Roads of Avalon.', 'https://albiononline.com/guides/article/mists+115', false, array['https://assets.albiononline.com/uploads/media/default/media/50cc8b60ba1553ee85db6851d0fa1d94d9f7dbba.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/62cdb2e6410868fe17058602763b81c92573d23b.jpeg']::text[]),
    (v_guide, 6, 'Salir de The Mists', 'Si quieres salir de una región de Mists, tienes varias opciones: cruzar otro Wisp hacia una región de Mists distinta; cruzar un portal a Brecilien; esperar a que The Mists se alcen y te expulsen; o salir por una de las cuatro salidas repartidas por los bordes de la región. Abre el Mapa de la Región cuando estés en The Mists y verás estas salidas:

Puedes usarlas para salir de The Mists en cualquier momento, y regresar al lugar desde el que entraste. Ten en cuenta que estas salidas son de un solo sentido: una vez que sales, no puedes volver a esa misma región de Mists.

Como puedes ver, The Mists ofrecen todo un mundo de contenido, y puedes pasar horas explorándolas, luchando contra criaturas extrañas, recolectando recursos valiosos, adentrándote en Knightfall Abbey o relajándote en Brecilien. ¡Ve a buscar un Wisp errante y descubre lo que hay ahí fuera!', 'https://albiononline.com/guides/article/mists+115', false, array['https://assets.albiononline.com/uploads/media/default/media/15f6241345fee1a3da63470dd18b7e3416a6e313.jpeg']::text[]);
end
$IMPERIUM$;

-- [8] the-depths
do $IMPERIUM$
declare
  v_game uuid;
  v_guide uuid;
begin
  select id into v_game from public.games where slug = 'albion-online';
  if v_game is null then
    raise exception 'IMPERIUM: juego no encontrado: %', 'albion-online';
  end if;

  -- Reemplazo idempotente. OJO: borra los pasos -> reinicia step_progress de esta guía.
  delete from public.guide_steps where guide_id in (
    select id from public.guides where game_id = v_game and slug = 'the-depths');
  delete from public.guides where game_id = v_game and slug = 'the-depths';

  insert into public.guides
    (game_id, slug, title, description, order_index, is_published, intro_title, intro, intro_images)
  values
    (v_game, 'the-depths', 'The Depths', 'Desvela los secretos de The Depths y afronta el peligroso descenso.', 8, false, null, 'The Depths son una mazmorra de estilo extracción dirigida a grupos de dos o tres jugadores, donde tu objetivo es recoger botín y escapar antes de que la mazmorra colapse. Aquí puedes abrirte paso a través de encuentros PvE y PvP recogiendo las Souls (almas) de tus enemigos derrotados, y ofrecerlas en altares demoníacos para potenciar a tu equipo a medida que avanzas.

A medida que pasa el tiempo, tendrás que sopesar tus opciones con cuidado: marcharte pronto para asegurar tu botín, o profundizar más en busca de mayores recompensas con el riesgo de perder todo lo que has saqueado. Pero pase lo que pase, tu equipo equipado permanece a salvo, lo que convierte a The Depths en un lugar ideal para poner a prueba tus límites, asumir riesgos audaces y vivir uno de los desafíos más emocionantes de Albion.', array['https://assets.albiononline.com/uploads/media/default/media/07a9e6649cbde83b27be0b402dfd31fa99801ad0.png']::text[])
  returning id into v_guide;

  insert into public.guide_steps
    (guide_id, order_index, title, content, source_url, is_verified, images)
  values
    (v_guide, 1, 'Hacia The Depths', 'Cómo entrar en The Depths
Para comenzar tu descenso, dirígete a un Antiquarian''s Den. Encontrarás uno en cada ciudad del Royal Continent. Abre tu mapa y busca el icono, normalmente cerca del Arena Master:

Dentro encontrarás una zona de preparación dedicada con todo lo que necesitas:

• Entradas a The Depths, Hellgates y Corrupted Dungeons
• Un Bank y un Marketplace vinculados a la ciudad correspondiente
• Una Repair Station (estación de reparación)
• El NPC Antiquarian

Busca la siniestra puerta hacia The Depths en sí:

Interactúa con la puerta para abrir la interfaz de entrada. Aquí puedes elegir entre el Modo Duo o Trio: el primero permite hasta dos jugadores, el segundo hasta tres. Puedes entrar solo o con menos miembros, pero ten cuidado: los enemigos del interior pueden ser grupos completos.

Los jugadores entran en The Depths por oleadas, cada cuatro minutos. Al final de cada intervalo, todos los que esperan en cualquier Royal City se colocan en una única bolsa de emparejamiento. Esto significa que puede que no te enfrentes al grupo que está a tu lado; tus oponentes podrían venir de otras ciudades por completo.

Una cuenta atrás en la interfaz de entrada te indica cuándo comienza el siguiente ciclo y cuánto tiempo tienes para entrar:

Una vez dentro, la teletransportación queda deshabilitada y no puedes volver corriendo a través de la puerta: ¡quedas encerrado! Asegúrate de haber seleccionado el modo correcto, de no haber olvidado nada y de estar listo para lo que te espera, porque ¡estarás atrapado un buen rato!

Reglas y requisitos
Para entrar en The Depths, necesitarás un Base Item Power (IP) de al menos 900. Este valor se calcula a partir del IP medio de tu equipo de combate equipado, excluyendo bonificaciones como Mastery u Overcharge. Puedes consultar tu Base IP en la pestaña de Detalles del Inventario o en la pantalla de entrada de The Depths:

Pero no te preocupes por llegar justo al requisito: The Depths tienen un tope blando de 1200 IP, lo que significa que cualquier poder por encima de este umbral se reduce considerablemente. Esto garantiza que cada pelea se sienta justa, manteniendo las cosas competitivas independientemente de lo cargado que esté tu equipo. Si tu IP sin tope está por encima de 1200, la interfaz mostrará tu valor con tope:

Toda la curación se reduce también un 30%, así que no esperes que tu sanador te saque de los errores.

Antes de cruzar la puerta, asegúrate de depositar en el Bank cualquier objeto innecesario que lleves. The Depths usan un conjunto de reglas de PvP Naranja, lo que significa que cuando los jugadores se enfrentan en combate, solo se sueltan al morir los objetos del inventario no equipados. Tu equipo equipado está a salvo y no se soltará; solo sufre una pérdida de durabilidad del 5%, similar a ser derribado en una Yellow Zone. ¡Así que viaja ligero! Cualquier cosa de tu inventario puede ser saqueada si caes.', 'https://albiononline.com/guides/article/the-depths+114', false, array['https://assets.albiononline.com/uploads/media/default/media/6e2feda0911b0ed760dd96a14843bc2ec2f4445f.png', 'https://assets.albiononline.com/uploads/media/default/media/a70161612eccef8620ac5fa5d03e1b94b490c1a1.png', 'https://assets.albiononline.com/uploads/media/default/media/960b3c82dafad1445b6f55843d63d6cba127ab4c.png', 'https://assets.albiononline.com/uploads/media/default/media/509b8d5133083eeed46b61df82681cec2162e720.png', 'https://assets.albiononline.com/uploads/media/default/media/f546c8788632e0fefe89e989fdc114560984e62d.png']::text[]),
    (v_guide, 2, 'Dentro de The Depths', 'Tu viaje a través de The Depths abarca tres niveles, cada uno más oscuro y mortal que el anterior. Cada nivel está vinculado a un tier de zona superior:

• Nivel 1: Tier 6
• Nivel 2: Tier 7
• Nivel 3: Tier 8

A medida que te adentras más, los enemigos se vuelven más duros, las salidas son más escasas y el botín se vuelve más valioso.

Quedarás encerrado en cada nivel durante un periodo determinado, obligado a abrirte paso luchando. Una vez agotado ese tiempo, comienza el colapso, y aparecerán dos iconos distintos en tu mapa, y con ellos, una decisión crítica:

• Los iconos que muestran escaleras hacia arriba marcan las salidas estándar, que te permiten abandonar The Depths y extraer tu botín de forma segura. Ten en cuenta que estas salidas no aparecen en el nivel 3.
• Los iconos que muestran escaleras hacia abajo marcan las puertas al siguiente nivel, tentándote a arriesgarlo todo por recompensas aún mayores.

Una cuenta atrás aparece cuando comienza el colapso, dándote la oportunidad de prepararte. Cuando el temporizador está a punto de terminar, el fuego infernal empieza a consumir la zona, y tu personaje empezará a recibir daño creciente hasta morir. Recuerda: según las normas de la Zona Naranja, cualquier objeto no equipado que hayas saqueado será eliminado de tu inventario si pereces antes de escapar.

Mantén un ojo atento al temporizador y elige sabiamente: ¿aseguras tu botín ahora, o lo arriesgas todo por recompensas más jugosas?

Objetivos y recompensas
A medida que derrotes a monstruos y jugadores en The Depths, notarás orbes flotantes que caen de sus cadáveres. Son sus Souls (almas), y vienen en tres tipos distintos:

• Neutral Souls (Blancas): soltadas ocasionalmente por los monstruos
• Hostile Souls (Rojas): soltadas por los jugadores enemigos derrotados
• Friendly Souls (Azules): soltadas por tus compañeros de equipo caídos

Para recoger una Soul, púlsala y canaliza brevemente. Una vez reclamada, flotará a tu lado.

Estas Souls pueden ofrecerse a los demonios a cambio de botín, resurrección o huida anticipada, según dónde las lleves. Cada altar cumple un propósito único en función del tipo de Soul que ofrezcas:

• Altar of Greed: acepta Neutral y Hostile Souls a cambio de cofres de botín. Cada altar acepta hasta tres Souls a la vez. Sacrificar aquí una Hostile Soul elimina permanentemente de la mazmorra a su propietario.

• Altar of Awakening: se usa para revivir a un compañero de equipo caído ofreciendo su Friendly Soul. Cada equipo solo puede usar cada altar una vez. Para más resurrecciones, tendrás que encontrar otro.

• Soulgates: estos altares son en realidad salidas, y te permiten abandonar la mazmorra antes de que el nivel empiece a colapsar. Se pueden activar con cualquier tipo de Soul para extraer inmediatamente tu botín tras un breve canalizado. Una vez activadas, las Soulgates permanecen abiertas durante 30 segundos, así que asegúrate de que tu grupo esté cerca o corres el riesgo de dejarlos atrás.

Mientras están muertos, los jugadores pueden ser espectadores de la partida mientras esperan a ser revividos, o elegir abandonar The Depths antes de tiempo. Si lo hacen, su Soul se vuelve Neutral para todos los grupos.

Pero las Souls no son lo único que ansían los demonios. Si eres lo bastante valiente como para explorar los rincones más oscuros de la mazmorra, descubrirás que están dispuestos a ofrecer ciertos... incentivos.

Mantente atento a estos elementos mientras te abres paso por The Depths:

• Sin marcar en tu mapa, las estatuas demoníacas se activan cuando se han eliminado todos los enemigos cercanos. Cada una otorga a tu equipo una mejora permanente de Demonic Ferocity (acumulable hasta 15 veces), y una de las siguientes:
  - Un pequeño cofre de botín
  - Una mejora temporal, activada cuando bajas del 40% de Salud:
    - Gift of Wrath (Rojo): +10% de daño y curación
    - Gift of Dominion (Amarillo): crea un área de ralentización
    - Gift of Cruelty (Morado): inflige daño en área y reduce la armadura
    - Cada acumulación de Demonic Ferocity amplifica estos efectos, así que cuantas más estatuas despiertes, más fuerte se vuelve tu equipo

• Los Treasure Coffers (cofres del tesoro) aparecen aleatoriamente por todo The Depths en distintas rarezas, de Común a Legendario. No aparecerán en tu mapa hasta que estés cerca, así que una exploración minuciosa puede dar grandes frutos.', 'https://albiononline.com/guides/article/the-depths+114', false, array['https://assets.albiononline.com/uploads/media/default/media/7c0baafa1d7c24ea7e5cfd5cc81a7c5ce3a06a62.png', 'https://assets.albiononline.com/uploads/media/default/media/81a4dbb0642587597765bfc63e0cef153cac2491.png', 'https://assets.albiononline.com/uploads/media/default/media/ccfbb231620d8c3c04b920520008afea19763b45.png', 'https://assets.albiononline.com/uploads/media/default/media/e830618616dff355fa2a175b91ec0bfa8491593a.png', 'https://assets.albiononline.com/uploads/media/default/media/d0a8d333e373c47f5d71f457ac08a47f93e79f18.png', 'https://assets.albiononline.com/uploads/media/default/media/3b58bea693f7a3a6c66e439ac75d5597bf03d9be.png', 'https://assets.albiononline.com/uploads/media/default/media/82801359589e0cd0086ad7663601aa20972acc50.png', 'https://assets.albiononline.com/uploads/media/default/media/eba773dafee919b3220708d3cc56364ec35a1a83.png']::text[]),
    (v_guide, 3, 'La sala final', 'Al final de tu descenso se encuentra el Treasure Vault (cámara del tesoro), el premio definitivo de la mazmorra. Para reclamar sus riquezas, tu equipo debe encontrar y entregar llaves, cada una generada aleatoriamente en el mapa. Pero si un portador de llave muere, la llave cae y puede ser robada.

• En Modo Duo se requieren 3 llaves
• En Modo Trio se requieren 5 llaves

Una vez abierta, la cámara revela botín valioso y una ruta de escape final, pero la salida solo permanece abierta durante 60 segundos. Este portal requiere un canalizado, así que asegúrate de que la zona está despejada y tu grupo está cerca.

Este desafío final a menudo se convierte en una refriega caótica, con múltiples equipos chocando en esta única sala. Espera combates intensos y quizás incluso alianzas repentinas, pero al final, solo un grupo se marchará con el tesoro.

Ahora que estás armado con conocimiento, puedes comenzar tu descenso. Que tu alma encuentre el camino de vuelta y que tu valor nunca flaquee.', 'https://albiononline.com/guides/article/the-depths+114', false, array['https://assets.albiononline.com/uploads/media/default/media/89c6617f9cd9b6adbfe6d45753b5a093f1a7cc22.png', 'https://assets.albiononline.com/uploads/media/default/media/b10c86e10c2be8fdbb2d80bdcd431979e3c285c7.png']::text[]);
end
$IMPERIUM$;

-- [9] crafting
do $IMPERIUM$
declare
  v_game uuid;
  v_guide uuid;
begin
  select id into v_game from public.games where slug = 'albion-online';
  if v_game is null then
    raise exception 'IMPERIUM: juego no encontrado: %', 'albion-online';
  end if;

  -- Reemplazo idempotente. OJO: borra los pasos -> reinicia step_progress de esta guía.
  delete from public.guide_steps where guide_id in (
    select id from public.guides where game_id = v_game and slug = 'crafting');
  delete from public.guides where game_id = v_game and slug = 'crafting';

  insert into public.guides
    (game_id, slug, title, description, order_index, is_published, intro_title, intro, intro_images)
  values
    (v_game, 'crafting', 'Crafting', 'Fabrica tu camino hacia la grandeza.', 9, false, null, 'El Crafting (fabricación) se encuentra en el corazón de la economía de Albion, impulsada por los jugadores. Prácticamente cada objeto del juego fue creado inicialmente por un jugador a partir de recursos en bruto. Los fabricantes de Albion son, por tanto, un pilar central del juego, y puede ser una actividad muy rentable. Así que si buscas comenzar tu andadura en el crafting de Albion Online, sigue leyendo para aprender todo lo que necesitas para empezar.', array['https://assets.albiononline.com/uploads/media/default/media/7baf4ef1e97faf8f504e766ae05028e200cd03db.jpeg']::text[])
  returning id into v_guide;

  insert into public.guide_steps
    (guide_id, order_index, title, content, source_url, is_verified, images)
  values
    (v_guide, 1, 'Primeros pasos con el Crafting', 'Entender el Destiny Board
Antes de empezar a fabricar, es importante saber cómo seguir tu progreso. Puedes hacerlo abriendo el Destiny Board:

• Pulsa la tecla B o haz clic en el icono del Destiny Board en tu pantalla

• El lado izquierdo del tablero representa el Combat Tree (árbol de combate)
• El lado derecho representa el Crafting Tree (árbol de fabricación)

A medida que progresas en el Destiny Board, desbloqueas la capacidad de fabricar objetos de tier superior. Más sobre esto más abajo.

Antes de fabricar cualquier cosa, necesitas conocer los materiales requeridos. Puedes comprobarlo fácilmente dentro del juego haciendo clic en el objeto que deseas fabricar y desplazándote hacia abajo para ver los componentes necesarios.

¿Qué puedes fabricar?
Hay una enorme variedad de objetos que puedes empezar a fabricar, como:

• Armas: espadas, arcos, dagas, bastones y más
• Armaduras: conjuntos de armadura de Plate, Leather y Cloth
• Herramientas: herramientas de recolección y objetos de utilidad
• Accesorios: bolsas, capas y equipo de asedio
• Mobiliario: objetos de utilidad o decorativos para islas personales y de gremio

¿Dónde puedes fabricar?
Según lo que quieras fabricar, necesitas visitar la Crafting Station apropiada:

• Warrior''s Forge: Plate Armor, espadas, hachas, mazas, martillos, guantes, ballestas y escudos
• Hunter''s Lodge: Leather Armor, arcos, dagas, lanzas, bastones largos (quarterstaffs), bastones de cambiaformas, bastones de naturaleza y antorchas
• Mage Tower: Cloth Armor, bastones de fuego, bastones sagrados, bastones arcanos, bastones de escarcha, bastones malditos y tomos
• Toolmaker: bolsas, capas, herramientas de recolección, equipo de asedio y mobiliario

Estas estaciones se pueden encontrar en varios lugares como Royal Cities, Starter Towns, islas, Hideouts y Outland Rests.', 'https://albiononline.com/guides/article/crafting+112', false, array['https://assets.albiononline.com/uploads/media/default/media/7601a5df30caefdccdcc01416b1fe3993856998e.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/a9867b2b931f32da2ed50dc5ac08f51bf7c40a59.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/26f0a8c039063f13ee11688266e516952c8d2f6a.jpeg']::text[]),
    (v_guide, 2, 'Progresar en el Crafting', 'Desbloquear tu potencial de fabricación
Tu andadura en el crafting comienza con el nodo Trainee Crafter de tu Destiny Board. Para desbloquearlo, simplemente necesitas:

• Refinar cualquier recurso de Tier 2

Es decir, necesitas llevar cualquiera de los recursos básicos de Albion (Stone, Wood, Ore, Fiber o Hide) a la estación de refinado apropiada (Stonemason, Lumbermill, Smelter, Weaver o Tanner) y crear recursos refinados (Bricks, Planks, Metal, Cloth o Leather). Una vez hecho esto, puedes empezar a fabricar objetos.

Tomar tu primera decisión
El siguiente paso es desbloquear la fabricación de objetos de Tier 3. Esto requiere ganar 480 de Fame fabricando equipo Novice (Tier 2) en una de las tres especializaciones de fabricación principales:

• Journeyman Warrior''s Forge Crafter: requiere 480 de Fame fabricando equipo Novice Warrior
• Journeyman Hunter''s Lodge Crafter: requiere 480 de Fame fabricando equipo Novice Hunter
• Journeyman Mage''s Tower Crafter: requiere 480 de Fame fabricando equipo Novice Mage

Ten en cuenta que cada uno de esos tres nodos solo te permite fabricar su tipo de objeto correspondiente (objetos T3 Warrior, Hunter o Mage).

A partir de aquí, eliges en qué tipo de objeto específico quieres especializarte. Por ejemplo, si quieres fabricar arcos, necesitarás ganar 14.424 de Fame fabricando Journeyman''s Bows.

Este proceso funciona de la misma manera para cualquier otro objeto. Simplemente fabrica el objeto Journeyman (Tier 3) correspondiente hasta que alcances el Fame requerido para desbloquear la fabricación de Tier 4 de ese tipo de objeto.', 'https://albiononline.com/guides/article/crafting+112', false, array['https://assets.albiononline.com/uploads/media/default/media/52af8e2a54bf5a26c58269190667d18dc4a11969.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/3c8a9dc5cf85aca3364e39ab7abd8d01903d2ae4.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/e224c6843cfca7f8ac6bdca38bb5df19b3210a43.jpeg']::text[]),
    (v_guide, 3, 'Tiers de fabricación y especializaciones', 'Cuando alcanzas por primera vez el Tier 4 en cualquier categoría de fabricación, desbloqueas el nodo de fabricación de esa categoría. Esto abarca tipos de objetos generales (por ejemplo, Leather Shoes, arcos, espadas, etc.), en contraposición a los tipos de objetos específicos (por ejemplo, Assassin Shoes, Warbows, Dual Swords, etc.).

Cada vez que fabricas un objeto dentro de una categoría (por ejemplo, cualquier tipo de arco), ganas Fame para esa categoría. A medida que acumulas Fame, subirás de nivel tu fabricación en esa categoría. Los niveles más altos te permiten fabricar objetos de tier superior.

¿Qué es un nivel?
Un nivel de fabricación es simplemente un hito que muestra cuánto Fame has ganado dentro de esa categoría. Cada vez que subes de nivel, desbloqueas la capacidad de fabricar objetos de tier superior. Hay umbrales específicos que determinan cuándo puedes pasar a fabricar tiers superiores:

• Nivel 1: desbloquea la fabricación de objetos de Tier 4
• Nivel 10: desbloquea la fabricación de objetos de Tier 5
• Nivel 30: desbloquea la fabricación de objetos de Tier 6
• Nivel 70: desbloquea la fabricación de objetos de Tier 7
• Nivel 100: desbloquea la fabricación de objetos de Tier 8, el tier más alto del juego

Especialización
Cuando fabricas un objeto en Albion Online, no solo mejoras en la fabricación de su categoría general, sino que también mejoras en la fabricación de ese objeto específico. Esto es lo que llamamos Especialización.

Piénsalo así:

• Si fabricas un Bow of Badon, te vuelves mejor fabricando todos los arcos, como se ha descrito arriba
• Al mismo tiempo, también mejoras tus habilidades fabricando específicamente Bows of Badon

A medida que aumentan tus niveles de especialización, desbloqueas bonificaciones importantes que te ayudan a fabricar objetos de forma más eficiente. Estas bonificaciones incluyen:

• Focus Cost Efficiency (General): reduce la cantidad de Focus Points que necesitas al fabricar objetos de esta categoría (más sobre esto abajo)
• Focus Cost Efficiency (Especializada): mejora aún más la eficiencia de Focus al fabricar un tipo de objeto específico
• Quality Bonus (General): aumenta ligeramente las probabilidades de fabricar equipo de mayor calidad en todo este grupo de objetos
• Quality Bonus (Especializada): aumenta aún más tus probabilidades de fabricar equipo de alta calidad para un objeto específico', 'https://albiononline.com/guides/article/crafting+112', false, array['https://assets.albiononline.com/uploads/media/default/media/1b843646de8cc33709ae2007f625e5f0819d217a.jpeg']::text[]),
    (v_guide, 4, 'Resource Return Rate (tasa de retorno de recursos)', 'Al fabricar o refinar un objeto, puedes recibir de vuelta cierta cantidad de los materiales usados para crear ese objeto. La cantidad de recursos devueltos depende del Resource Return Rate (o RRR). Puedes ver el Resource Return Rate en la pestaña de fabricación de cualquier objeto que crees, y la tasa básica para fabricar en una Royal City es del 15,2%. Sin embargo, los Resource Return Rates pueden verse afectados por muchas bonificaciones distintas, como los Local Production Bonuses, los Daily Production Bonuses y el Focus. Exploremos algunos de estos.

Local Crafting Bonuses
Cada región de Albion Online ofrece sus propios Local Production Bonuses por fabricar allí ciertos tipos de objetos, lo que significa que recibes más materiales de vuelta cuando fabricas ciertos objetos allí. Fabricar en Royal Cities tiene una bonificación de producción base del 18%, que se traduce en un Resource Return Rate del 15,2% si no se añaden otras bonificaciones. Con un Local Production Bonus, la tasa de retorno aumenta al 24,8%.

Ejemplo:

Si fabricas Soldier''s Boots en Martlock, donde hay un Local Production Bonus para este objeto, esto es lo que ocurre:

• Para fabricar 100 pares, necesitas 800 metal bars.
• Con una tasa de retorno del 24,8%, recuperas de media 198,4 bars tras fabricar 100 pares. Esto significa que por cada par individual que fabricas allí, a veces recibirás un bar de vuelta de los 8 que pusiste, pero la mayoría de las veces recibirás 2 bars de vuelta.
• Si fabricas las mismas botas en otra ciudad sin bonificación para Soldier''s Boots (solo el 15,2% de tasa de retorno), solo recuperarías unos 121 bars tras fabricar 100 pares, es decir, por cada par individual que fabricas, normalmente recibirás solo un bar de vuelta.

Ubicaciones de fabricación
Además de las Royal Cities, puedes fabricar en otras ubicaciones, cada una con distintos beneficios y riesgos:

• Outlands Rests: son pequeñas ciudades situadas en medio de peligrosas zonas de PvP. Tienen sus propias bonificaciones de producción, y las usan principalmente los jugadores que tienen su base en los Outlands y no visitan a menudo las Royal Cities.
• Personal/Guild Islands: las islas ofrecen los mismos Local Production Bonuses que la Royal City de su bioma concreto. Por ejemplo, una isla de las Highlands tendrá las mismas bonificaciones de producción que Martlock (la Royal City de las Highlands). Sin embargo, ten en cuenta que, a diferencia de las Royal Cities, las islas no ofrecen la bonificación de producción base del 18%.
• Hideouts: puedes fabricar objetos dentro de un Hideout en los Outlands, si tu gremio tiene uno. Sus bonificaciones de producción pueden variar enormemente, según la región específica en la que estén ubicados.

Daily Production Bonuses
Cada día, cada servidor tiene ciertas bonificaciones que potencian la producción de distintas categorías de objetos. Estas bonificaciones cambian aleatoriamente cada día con el mantenimiento del servidor, y serán del 10% o del 20%.

Puedes ver cuál es la bonificación diaria actual abriendo la Activities UI (en escritorio: desde el menú Activities; en móvil: desde el menú principal).

Focus Points
Los Focus Points son un recurso valioso que puede mejorar tu eficiencia de fabricación. Cuando se usan en la fabricación, los Focus Points proporcionan un impulso significativo a los Resource Return Rates.

Los Focus Points solo están disponibles para los jugadores Premium, y se regeneran a diario. Los jugadores con el estado Premium activo pueden ganar hasta 10.000 Focus Points al día. Sin embargo, no puedes tener más de 30.000 Focus Points en ningún momento. Cualquier Focus Point ganado por encima de este límite se pierde, así que es importante usarlos sabiamente para evitar desperdiciarlos.

Como alternativa, puedes obtener Focus Points de las Focus Restoration Potions, que se pueden conseguir como recompensas del Albion Journal.

Para ver cuántos Focus Points tienes, abre tu inventario. En la esquina superior verás una pequeña flecha. Haz clic en esa flecha y aparecerá una pestaña de estadísticas, con tus Focus Points actuales mostrados cerca de la parte superior.

Estudiar objetos
También puedes estudiar objetos fabricados para ganar Crafting Fame adicional. Esto se puede hacer en cualquier Crafting Station, y te otorga el 275% del Fame que recibirías por fabricar ese objeto. Esto puede darte un impulso enorme en tu progresión de fabricación, pero los costes son altos, ya que una vez que has estudiado un objeto, este se destruye. Por ello, estudiar se considera un método caro pero efectivo para subir de nivel.

Es importante entender que cada objeto que desees estudiar debe estudiarse en la misma Crafting Station en la que lo fabricarías. Así, una Broadsword se estudia en una Warrior''s Forge, una Mercenary Jacket en una Hunter''s Lodge, y así sucesivamente.', 'https://albiononline.com/guides/article/crafting+112', false, array['https://assets.albiononline.com/uploads/media/default/media/94424ba116d22b806a2df29e1a07997c73d7360d.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/d7e0ee5cc133557bdf7d493fdf01a54647f2844d.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/a41d3be34aa0321d3e8da600645ec9330f9d3c5e.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/18f9e62758e63bd9e808721798d02a5a91d658c9.jpeg']::text[]),
    (v_guide, 5, 'Enchantment (encantamiento)', 'Los objetos pueden fabricarse en tiers encantados, que mejoran su poder. Los distintos niveles de encantamiento y la bonificación de Item Power que proporcionan son los siguientes:

• .1 (Uncommon): +100 Item Power
• .2 (Rare): +200 Item Power
• .3 (Exceptional): +300 Item Power
• .4 (Pristine): +400 Item Power

Puedes identificar el nivel de encantamiento de un objeto por el número de diamantes que se muestran en la parte inferior de su icono.

Los objetos encantados se pueden obtener de dos formas:

• Fabricando con recursos encantados
• Encantando objetos existentes en una Artifact Foundry (presente en cada ciudad del Royal Continent, Portal Towns, Outlands Rests y Smuggler''s Dens)

Encantar objetos en la Artifact Foundry requiere Runes, Souls o Relics: objetos especiales que puedes conseguir como botín o comprar en el Marketplace. Puedes ver en la Artifact Foundry cuántos de estos objetos necesitas.', 'https://albiononline.com/guides/article/crafting+112', false, array['https://assets.albiononline.com/uploads/media/default/media/10ca4581d43b264b3d62134c4c5413dce688b2c3.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/209926dccd1a50ddbdcf288e507e8ea61086b27c.jpeg']::text[]),
    (v_guide, 6, 'Journals (diarios)', 'Los Journals son objetos que puedes rellenar realizando actividades, como fabricar, para proporcionarte una bonificación. (No deben confundirse con el Albion Journal, el sistema de logros de Albion Online). Llevar un Crafting Journal mientras fabricas lo rellena con la misma cantidad de Crafting Fame que ganas. El Journal puede luego entregarse a un Laborer: un NPC que puedes contratar para trabajar en casas de tus islas de gremio o de jugador. Una vez que has rellenado un Journal y se lo has dado al Laborer, este irá a "trabajar" y volverá más tarde (normalmente unas 22 horas) con una recompensa, a menudo materiales de fabricación.

Importante: rellenar Journals no reduce el Crafting Fame que ganas; sigues obteniendo la cantidad completa para tu Destiny Board mientras simultáneamente rellenas el Journal.

Cada árbol de fabricación del Destiny Board tiene un Journal correspondiente:

• Blacksmith Journals: se rellenan fabricando objetos en la Warrior''s Forge
• Fletcher''s Journals: se rellenan fabricando objetos en la Hunter''s Lodge
• Imbuer Journals: se rellenan fabricando objetos en la Mage''s Tower
• Tinkerer Journals: se rellenan fabricando objetos en la Toolmaker''s

Los Journals vacíos se pueden comprar a los Laborers o directamente en el Marketplace. También puedes comprar Journals parcial o totalmente llenos en el Marketplace, o venderlos por Silver.', 'https://albiononline.com/guides/article/crafting+112', false, array[]::text[]),
    (v_guide, 7, 'Artifacts (artefactos)', 'Los Artifact items son objetos que requieren un componente de artefacto único para fabricarse. Hay varios tipos distintos de artefactos, como:

• Runes
• Souls
• Relics
• Royal Sigils
• Avalonian Artifacts
• Fey Artifacts
• Crystal Artifacts

La mayoría de los artefactos se pueden fabricar en la Artifact Foundry, excepto los Fey y los Crystal artifacts. Los Fey Artifacts se encuentran exclusivamente en The Mists, mientras que los Crystal Artifacts se otorgan al final de una Guild Season en los Conqueror''s Chests.

Recetas de fabricación alternativas
Para algunos objetos que se fabrican con artefactos, hay recetas de fabricación alternativas que puedes usar. Estas recetas no requieren el artefacto habitual, sino que usan en su lugar Crystallized Items. Estos Crystallized Items actúan como sustituto del artefacto original necesario para fabricar el objeto.

Hay distintos tipos de Crystallized Item:

• Crystalized Spirit para Runes
• Crystalized Dread para Souls
• Crystalized Magic para Relics
• Crystalized Divinity para Avalonian Artifacts

Ten en cuenta que los Fey Artifacts y los Crystal Artifacts no tienen recetas de fabricación alternativas.

Usar estas recetas alternativas puede ser una buena forma de ahorrar Silver, especialmente cuando el artefacto original es difícil de encontrar o demasiado caro. Para usar estas recetas, simplemente busca el objeto que quieres fabricar, luego haz clic en la flecha de la pestaña de receta para ver las opciones alternativas.', 'https://albiononline.com/guides/article/crafting+112', false, array['https://assets.albiononline.com/uploads/media/default/media/3479a31a1a628dc3d34a699fe747fe3edc7247af.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/7d21e4d59b216608924f6cb565914ed1c15065f5.jpeg']::text[]),
    (v_guide, 8, 'Cómo maximizar la rentabilidad', 'Fabricar tu propio equipo puede ser divertido, pero también es una de las mejores formas de ganar Silver en Albion Online. Para maximizar tus beneficios, hay varios factores importantes a tener en cuenta:

Coste de las materias primas
El precio de los materiales necesarios para fabricar puede variar. Intenta siempre comprar los materiales más baratos, y considera usar buy orders (órdenes de compra) para conseguirlos a mejor precio.

Tarifas de las Crafting Stations
Cada Crafting Station cobra una Usage Fee (tarifa de uso), que establece el jugador que la posee y se puede consultar haciendo clic en el edificio.

Para ahorrar dinero, intenta usar las Crafting Stations más baratas. También puedes pedirle al propietario de un edificio el estado de associate, que te dará un descuento en las tarifas de fabricación.

Tasas de retorno
Aumentar tus Resource Return Rates (por ejemplo, aprovechando un Daily Production Bonus o usando Focus Points) puede ayudarte a recuperar más materiales, incrementando tus beneficios.

Premium
Tener el estado Premium aumenta el Fame que ganas al fabricar y te da Focus Points, que hacen que fabricar sea más barato y eficiente.

Journals
Rellena Crafting Journals, que se pueden vender o usar para obtener recursos extra.

Recetas alternativas
Algunos objetos de artefacto se pueden fabricar usando recetas alternativas, que pueden ser más baratas que usar los artefactos habituales.', 'https://albiononline.com/guides/article/crafting+112', false, array['https://assets.albiononline.com/uploads/media/default/media/f11a908a6bb97ab14ec5286bcdf63f1a63f049a1.jpeg']::text[]),
    (v_guide, 9, 'Consejos finales para fabricantes principiantes', '• Empieza con objetos de tier bajo
  Fabricar primero objetos de tier inferior te permite familiarizarte con las mecánicas antes de invertir demasiado Silver.

• Calcula el beneficio antes de fabricar
  Compara siempre el coste de fabricar un objeto con su precio en el Marketplace para asegurarte de que no estás perdiendo Silver.

• Aprovecha los Local Production Bonuses
  Fabrica en ciudades que ofrezcan bonificaciones de objeto específicas para maximizar los Resource Return Rates.

• Evita fabricar objetos de tier alto demasiado pronto
  Los objetos de tier superior a menudo requieren Focus para ser rentables y pueden ser más difíciles de vender debido a una menor demanda.

• Explora distintas especializaciones de fabricación
  Experimenta con varios árboles de fabricación para encontrar el nicho más rentable que mejor se adapte a ti.

Siguiendo esta guía, irás bien encaminado para convertirte en una potencia de la fabricación en Albion Online. El crafting abre todo un mundo de oportunidades, ya sea que quieras abastecer de armas a tu gremio, convertirte en un comerciante multimillonario, o simplemente fabricar objetos para tu uso personal. ¡Diviértete!', 'https://albiononline.com/guides/article/crafting+112', false, array[]::text[]);
end
$IMPERIUM$;

-- [10] focus-points
do $IMPERIUM$
declare
  v_game uuid;
  v_guide uuid;
begin
  select id into v_game from public.games where slug = 'albion-online';
  if v_game is null then
    raise exception 'IMPERIUM: juego no encontrado: %', 'albion-online';
  end if;

  -- Reemplazo idempotente. OJO: borra los pasos -> reinicia step_progress de esta guía.
  delete from public.guide_steps where guide_id in (
    select id from public.guides where game_id = v_game and slug = 'focus-points');
  delete from public.guides where game_id = v_game and slug = 'focus-points';

  insert into public.guides
    (game_id, slug, title, description, order_index, is_published, intro_title, intro, intro_images)
  values
    (v_game, 'focus-points', 'Focus Points', 'Usa los Focus Points para aumentar tu productividad en fabricación, refinado y agricultura.', 10, false, null, 'En Albion Online, los Focus Points se pueden usar para hacer muchas actividades más eficientes y rentables, especialmente la fabricación, el refinado y la agricultura. Entender cómo usar el Focus correctamente puede ahorrarte muchos recursos y ayudarte a progresar más rápido en el juego, y esta guía te dará algunos consejos sobre cómo hacerlo. Sigue leyendo para saber más...', array['https://assets.albiononline.com/uploads/media/default/media/60905ec38aeeda8b254166ae8be22e611af2b9c5.png']::text[])
  returning id into v_guide;

  insert into public.guide_steps
    (guide_id, order_index, title, content, source_url, is_verified, images)
  values
    (v_guide, 1, 'Cómo conseguir Focus Points', 'Si tu personaje tiene el estado Premium, ganarás automáticamente 10.000 Focus Points al día, y puedes tener un máximo de 30.000 puntos en cualquier momento. Una vez que alcanzas ese límite, dejarán de acumularse hasta que gastes algunos, así que es importante usarlos sabiamente para evitar desperdiciarlos.

Además de los que ganas a diario por tener Premium, los Focus Points se pueden conseguir a través de las Focus Restoration Potions. Estas pociones vienen en distintos tamaños, ofreciendo entre 500 y 20.000 Focus Points, según su tier. Puedes obtener estas pociones como recompensa por completar misiones del Albion Journal o de los cofres mensuales del Adventurer''s Challenge.

Para ver cuántos Focus Points tienes, abre tu inventario. En la esquina superior verás una pequeña flecha. Haz clic en esa flecha y aparecerá una pestaña de estadísticas, con tus Focus Points actuales mostrados cerca de la parte superior.

Ahora veamos algunas de las formas en que se pueden usar los Focus Points.', 'https://albiononline.com/guides/article/focus-points+73', false, array['https://assets.albiononline.com/uploads/media/default/media/722d23248b8729a03ec5274a3b0cc28f50d50540.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/544b2f565bc892812eef27af5da84460c4c7f125.jpeg']::text[]),
    (v_guide, 2, 'Agricultura (cultivos y hierbas)', 'Al cosechar cultivos y hierbas que has plantado en una isla, hay una pequeña probabilidad de que recibas una semilla de vuelta. Sin embargo, las probabilidades de que esto ocurra suelen ser bastante bajas. Para mejorarlas, puedes usar Focus Points para regar tus cultivos, lo que mejora las probabilidades de recuperar una semilla.

Encontrarás el botón Water (regar) haciendo clic en tu cultivo plantado y mirando en la parte inferior de la ventana que aparece.

Puedes regar un cultivo en cualquier momento antes de que esté completamente crecido. Al principio, regar consume bastantes Focus Points, pero a medida que aumenta tu especialización en agricultura, la cantidad de Focus requerida irá disminuyendo gradualmente.

Solo puedes regar cada cultivo una vez. Por esa razón, lo mejor es usar tus Focus Points en cultivos más caros o raros, donde recuperar una semilla es más importante.', 'https://albiononline.com/guides/article/focus-points+73', false, array['https://assets.albiononline.com/uploads/media/default/media/04cf81ce720a62509b3d27baed1edcba76339695.jpeg']::text[]),
    (v_guide, 3, 'Agricultura (animales)', 'De forma similar a cómo los cultivos pueden devolver semillas al cosecharse, hay una pequeña probabilidad de que los animales que crías produzcan una cría cuando están completamente crecidos. Para mejorar las probabilidades de que esto ocurra, puedes usar Focus para nurture (cuidar) al animal. Cuidarlo aumenta significativamente las probabilidades de que se produzca una cría.

Puedes cuidar a cada animal una vez al día. Como la mayoría de los animales tardan más de un día en crecer, puedes usar Focus Points cada día hasta que el animal esté completamente crecido.

Al igual que con el riego de los cultivos, encontrarás el botón Nurture (cuidar) haciendo clic en el animal que estás criando y mirando en la parte inferior de la ventana que aparece. Al principio, cuidar consume muchos Focus Points, pero este coste se reduce a medida que aumenta tu especialización en cría de animales.', 'https://albiononline.com/guides/article/focus-points+73', false, array['https://assets.albiononline.com/uploads/media/default/media/6b6ff8d79f1118ba1287de24c2fa2be11efc5b0d.jpeg']::text[]),
    (v_guide, 4, 'Fabricación y refinado', 'Cada vez que fabricas objetos o refinas materiales, una parte de los recursos que usas se te devuelve. Esto se llama Resource Return Rate (RRR). En las Royal Cities, el RRR base para fabricar y refinar es del 15,2%. Sin embargo, cuando usas Focus, tu RRR aumenta significativamente, a menudo triplicándose. Eso significa que recuperas más materiales de lo que pones, puedes fabricar o refinar más objetos y, en consecuencia, puedes obtener mucho más beneficio.

Usar Focus es especialmente valioso al fabricar objetos caros o refinar materiales de tier alto, ya que te ayuda a estirar más tus recursos y maximizar tus beneficios. Además, fabricar con Focus aumenta las probabilidades de que produzcas un objeto de mayor calidad, con mayor Item Power y mayor valor.', 'https://albiononline.com/guides/article/focus-points+73', false, array['https://assets.albiononline.com/uploads/media/default/media/39893c66a969cb5879d293a4caf931772eefea6d.jpeg']::text[]),
    (v_guide, 5, 'Estudiar (Studying)', 'Si quieres subir de nivel tus habilidades de fabricación en Albion Online, una buena opción es estudiar objetos. Cuando estudias un objeto, lo destruyes a cambio de una gran cantidad de Crafting Fame. Normalmente, cuando estudias un objeto, obtienes el 275% del Fame que habrías ganado fabricándolo. Si tienes Premium activo, ese número sube al 413%. Y si usas Focus, puede aumentar hasta el 656%. En otras palabras, cada objeto que destruyes estudiándolo puede darte el Fame equivalente a fabricar unas seis veces y media el mismo objeto, lo que lo convierte en una de las formas más rápidas de perfeccionar tus habilidades de fabricación.', 'https://albiononline.com/guides/article/focus-points+73', false, array['https://assets.albiononline.com/uploads/media/default/media/6713086450624e50b16f0fa9dac7efbde4bbb198.jpeg']::text[]),
    (v_guide, 6, 'Despertar armas (Awakening Weapons)', 'Si tienes un arma Pristine (nivel de encantamiento .4), puedes llevarla a la Artifact Foundry para awaken (despertarla). Despertar tu arma le otorga rasgos poderosos que mejoran ciertas estadísticas. Para despertar un arma, necesitarás Silver y algo llamado Attunement, que puedes ganar matando enemigos en el mundo abierto.

Una vez que un arma está despierta, puedes añadir, mejorar o cambiar sus rasgos. El Focus se puede usar durante este proceso para reducir la cantidad de Attunement requerida para ello. Como resultado, tendrás más oportunidades de adaptar un arma a tu estilo de juego.', 'https://albiononline.com/guides/article/focus-points+73', false, array['https://assets.albiononline.com/uploads/media/default/media/3bd80483a4479d42c5498a94ad3a5b77488e1638.jpeg']::text[]),
    (v_guide, 7, 'Por qué deberías usar los Focus Points', 'El Focus es uno de los muchos beneficios de tener el estado Premium, y es importante no dejar que se desperdicie. Usar los Focus Points de forma inteligente puede marcar una gran diferencia en áreas como la agricultura y la fabricación, y para muchos jugadores es clave para sus ingresos. Usar Focus te permite ofrecer mejores precios sin dejar de ser rentable, dándote ventaja sobre otros jugadores.

Ya sea que decidas fabricar, refinar, criar animales o cultivar, los Focus Points son una herramienta extremadamente valiosa en tu arsenal. ¡Úsalos con sabiduría y cosecha las recompensas!', 'https://albiononline.com/guides/article/focus-points+73', false, array[]::text[]);
end
$IMPERIUM$;

-- [11] awakened-weapons
do $IMPERIUM$
declare
  v_game uuid;
  v_guide uuid;
begin
  select id into v_game from public.games where slug = 'albion-online';
  if v_game is null then
    raise exception 'IMPERIUM: juego no encontrado: %', 'albion-online';
  end if;

  -- Reemplazo idempotente. OJO: borra los pasos -> reinicia step_progress de esta guía.
  delete from public.guide_steps where guide_id in (
    select id from public.guides where game_id = v_game and slug = 'awakened-weapons');
  delete from public.guides where game_id = v_game and slug = 'awakened-weapons';

  insert into public.guides
    (game_id, slug, title, description, order_index, is_published, intro_title, intro, intro_images)
  values
    (v_game, 'awakened-weapons', 'Armas Despertadas', 'Personaliza tus armas para adaptarlas a tu estilo de juego y escribe tu nombre en la historia de Albion.', 11, false, null, 'Las Armas Despertadas son elementos únicos en el arsenal de Albion Online. Los jugadores pueden tomar armas Pristine (con encantamiento .4) y mejorar ciertas cualidades, como el Item Power, la velocidad de los ataques automáticos, la defensa y muchas más. Esto te permite personalizar un arma para adaptarla a tu estilo de juego y conseguir una ventaja en el fragor de la batalla. Y, además, las Armas Despertadas contienen registros de sus anteriores propietarios, ¡escribiendo tu nombre en la historia de Albion!

Sigue leyendo para aprender a conseguir y usar estos poderosos objetos…', array['https://assets.albiononline.com/uploads/media/default/media/084931d3445e8083727c76abad8de11358c6f77f.jpeg']::text[])
  returning id into v_guide;

  insert into public.guide_steps
    (guide_id, order_index, title, content, source_url, is_verified, images)
  values
    (v_guide, 1, 'Cómo Despertar un Arma', 'Antes de poder personalizar un arma, hay que Despertarla en la Artifact Foundry. Es un proceso sencillo, y funciona así:

• Ve a una Artifact Foundry
• Selecciona la pestaña de Armas Despertadas
• Coloca un Arma Encantada Pristine (.4) en la ranura
• Paga el coste requerido de Silver, Siphoned Energy y Avalonian Energy
• Este coste aumenta dependiendo del tier del arma', 'https://albiononline.com/guides/article/awakened-weapons+113', false, array['https://assets.albiononline.com/uploads/media/default/media/dca0899f88b1f62b6abac9d32e7e06ebb317ab06.jpeg']::text[]),
    (v_guide, 2, 'Sintonización (Attunement)', 'Una vez que has despertado un arma, quedará sintonizada (attuned) con tu personaje. Una vez hecho esto, puedes empezar a personalizarla añadiendo Traits (rasgos). Solo el personaje con el que un arma está sintonizada puede beneficiarse de los Traits que se le añaden.

Para añadir Traits a tu Arma Despertada, primero debes ganar Attunement Points para ella. Para ganar Attunement Points, simplemente gana Fame de PvE mientras usas esa arma. Las armas de Tier 6 o superior solo pueden ganar Attunement Points en zonas de PvP con full-loot. La cantidad máxima de Attunement Points que un arma puede tener aumenta según su Legendary Rating; más sobre esto a continuación.', 'https://albiononline.com/guides/article/awakened-weapons+113', false, array['https://assets.albiononline.com/uploads/media/default/media/5f8231f9f0fc5ba980e6bc1a235c9e9ac6b01170.jpeg']::text[]),
    (v_guide, 3, 'Añadir Traits', 'Tras ganar suficientes Attunement Points, puedes empezar a añadir Traits a tu Arma Despertada. Ve de nuevo a la Artifact Foundry y sigue estos pasos:

• Selecciona la pestaña de Armas Despertadas
• Coloca tu Arma Despertada en la ranura
• Selecciona Modify Trait
• Haz clic en Add Trait
• Esto cuesta una cierta cantidad de Silver y Attunement Points

A continuación se te ofrecerán tres Traits seleccionados al azar para añadir a tu arma, de los cuales puedes elegir uno. Ten en cuenta que algunos Traits solo se pueden añadir a ciertos tipos de armas:

• Healing Cast: disponible para Holy Staffs y Nature Staffs
• Attack Range: disponible para Bows, Crossbows, Fire Staffs, Arcane Staffs, Cursed Staffs, Holy Staffs y Nature Staffs
• Resilience Penetration: disponible para Axes, Hammers, Maces, Swords, War Gloves, Daggers, Spears y Quarterstaffs', 'https://albiononline.com/guides/article/awakened-weapons+113', false, array['https://assets.albiononline.com/uploads/media/default/media/4aa1bb4debccfd82d854654fa683c152f66fbdf4.jpeg']::text[]),
    (v_guide, 4, 'Mejorar y Reemplazar Traits', 'Cuando añades por primera vez un nuevo Trait a un arma, su impacto es relativamente bajo. Sin embargo, una vez que se ha añadido un Trait, se puede mejorar (upgrade) en la Artifact Foundry. Este proceso funciona así:

• Abre la pestaña de Armas Despertadas de la Artifact Foundry
• Coloca tu Arma Despertada en la ranura
• Haz clic en el Trait que quieres mejorar
• Selecciona Upgrade Trait en la ventana que aparece
• Paga los costes de Silver y Attunement haciendo clic en Upgrade

El Trait mejorará una cantidad determinada al azar, y su nuevo valor se muestra en la ventana. Puedes seguir mejorando un Trait hasta que alcance su valor máximo posible. Para ver el rango de valores posibles de un Trait, selecciónalo en la Artifact Foundry y luego haz clic en la flecha de la esquina superior de la ventana que aparece, como se muestra abajo:

Recuerda que cada mejora cuesta Attunement Points, así que para seguir mejorándolo necesitarás usar el arma para ganar suficientes Attunement Points.

También es posible reemplazar Traits existentes en un Arma Despertada. Simplemente sigue el mismo proceso que usarías para mejorar un Trait, pero selecciona ''Replace Trait'' en la ventana que aparece. Hacer clic en Replace te ofrecerá tres nuevos Traits seleccionados al azar para elegir. Sin embargo, tu Trait anterior se perderá si haces esto.

Nota: Al añadir, reemplazar o mejorar Traits, se pueden usar Focus Points para reducir significativamente el coste de Attunement Points.', 'https://albiononline.com/guides/article/awakened-weapons+113', false, array['https://assets.albiononline.com/uploads/media/default/media/76c02afa2736ca18a7f6d74988c58ba00875beba.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/b47f93f495658cf097b0dd236e156b69a1f1bebe.jpeg']::text[]),
    (v_guide, 5, 'Strain (Tensión)', 'Strain es una estadística que determina cuán alto será el coste de Silver y Attunement Points para hacer más cambios en el arma. Cada vez que haces un cambio en un Arma Despertada, se añade Strain. Puedes ver el Strain actual de un arma haciendo clic en ella y luego desplazándote hasta sus estadísticas.

El Strain puede acumularse bastante rápido, así que llevar todos los Traits de un arma a su nivel máximo posible sería un esfuerzo extremadamente costoso. Por esta razón es importante considerar cuidadosamente hasta dónde mejorar cada Trait, ya que el análisis coste-beneficio cambia significativamente con cada mejora.', 'https://albiononline.com/guides/article/awakened-weapons+113', false, array['https://assets.albiononline.com/uploads/media/default/media/b33cc639443eca7d0986eb670f6d7ae6d25a3f2f.jpeg']::text[]),
    (v_guide, 6, 'Comerciar y Resintonizar', 'Cuando un Arma Despertada se obtiene como botín, independientemente de si la soltó un jugador o un mob, quedará automáticamente sintonizada con quien la recibe, que puede disfrutar de inmediato de sus Traits. Sin embargo, un Arma Despertada no se puede comerciar en el Marketplace sin antes desencantarse y perder sus Traits.

Un Arma Despertada sí puede comerciarse directamente de un personaje a otro, pero en ese caso debe ser Resintonizada (Reattuned) con su nuevo propietario en la Artifact Foundry.

Para Resintonizar un Arma Despertada, simplemente:

• Abre la pestaña de Armas Despertadas de la Artifact Foundry
• Coloca el arma en la ranura
• Pulsa Reattune, pagando el coste de Silver mostrado

El coste de Silver de Resintonizar un arma depende de su Strain y su Tier.

Una vez que un arma ha sido Resintonizada con tu personaje, puedes añadir, mejorar o reemplazar Traits como de costumbre.', 'https://albiononline.com/guides/article/awakened-weapons+113', false, array['https://assets.albiononline.com/uploads/media/default/media/36ac36fa0414aa996de53b547380b79fbfa65dd3.jpeg']::text[]),
    (v_guide, 7, 'Legendary Rating', 'Cada Arma Despertada tiene un Legendary Rating. Esta puntuación determina cuántos Traits puede tener un arma, hasta un máximo de tres. Además, cuanto mayor sea el Legendary Rating de un arma, mayores serán las probabilidades de que entre en el loot pool de Albion cuando su propietario sea asesinado, en lugar de ser destruida. Por lo tanto, un arma con un Legendary Rating alto tiene una mayor probabilidad de permanecer en el juego, con un registro de su creador y de todos aquellos con quienes ha estado Sintonizada.

Las Armas Despertadas pueden marcar la diferencia en combate, si estás dispuesto a dedicar el tiempo y el Silver necesarios para crear una que se adapte a tu estilo de juego. Y recuerda, tener un Arma Despertada sintonizada con tu personaje escribe tu nombre en su historia para la posteridad, para que lo vean todos por cuyas manos pueda pasar. ¡Así que dirígete a la Artifact Foundry, empieza a crear tu arma personalizada y entra en la historia de Albion a través de una de estas poderosas armas!', 'https://albiononline.com/guides/article/awakened-weapons+113', false, array[]::text[]);
end
$IMPERIUM$;

-- [12] smugglers
do $IMPERIUM$
declare
  v_game uuid;
  v_guide uuid;
begin
  select id into v_game from public.games where slug = 'albion-online';
  if v_game is null then
    raise exception 'IMPERIUM: juego no encontrado: %', 'albion-online';
  end if;

  -- Reemplazo idempotente. OJO: borra los pasos -> reinicia step_progress de esta guía.
  delete from public.guide_steps where guide_id in (
    select id from public.guides where game_id = v_game and slug = 'smugglers');
  delete from public.guides where game_id = v_game and slug = 'smugglers';

  insert into public.guides
    (game_id, slug, title, description, order_index, is_published, intro_title, intro, intro_images)
  values
    (v_game, 'smugglers', 'Guaridas, Red y Actividades de Contrabandistas', 'Explora las oscuras oportunidades que ofrece esta facción en las Outlands.', 12, false, null, 'La actualización Rogue Frontier introdujo a los Smugglers (contrabandistas) en Albion, trayendo una variedad de nuevas oportunidades de juego a las Outlands. Las Smuggler''s Dens (guaridas de contrabandistas) ofrecen lugares donde refugiarse y guardar mercancías, la Smuggler''s Network (red de contrabandistas) trae nuevas oportunidades comerciales tanto para compradores como para vendedores, y nuevas actividades dan a los jugadores en solitario y a los grupos pequeños oportunidades de ganar recompensas valiosas.

Con todo esto ya disponible, echemos un vistazo a estas características con más detalle, y a cómo puedes aprovechar al máximo las oportunidades que ofrecen.', array['https://assets.albiononline.com/uploads/media/default/media/a47c46c8bc3fb15cc8355ab6f4926ad87236a462.jpeg']::text[])
  returning id into v_guide;

  insert into public.guide_steps
    (guide_id, order_index, title, content, source_url, is_verified, images)
  values
    (v_guide, 1, 'Smuggler''s Dens (Guaridas de Contrabandistas)', '¿Dónde encontrarlas?

Las Smuggler''s Dens se pueden encontrar repartidas por todas las Outlands. Hay 35 en total, y puedes reconocerlas en el Region Map por este icono:

Notarás que cada Smuggler''s Den tiene dos entradas dentro de su región, cada una de las cuales te lleva a un extremo diferente de la guarida. Puedes entrar en una Smuggler''s Den montado sin ningún tiempo de canalización. Sin embargo, no puedes entrar como Outlaw, ni mientras estés en combate.

Las Smuggler''s Dens se pueden establecer como Home (hogar), lo que significa que reapareceras allí al morir y podrás viajar hasta allí desde un Travel Planner (siempre que no lleves equipaje). Para establecer una Smuggler''s Den como Home, debes hacer clic en uno de estos tableros al entrar:

Tener una Smuggler''s Den establecida como Home ofrece varias ventajas. Puedes asentarte en lo más profundo de las Outlands sin el apoyo de una guild, y recibes un bono del 2.5% a la Combat Fame y Gathering Fame en las Outlands cuando lo haces. Esto la convierte en una gran opción para jugadores en solitario y grupos pequeños que disfrutan de la emoción y las recompensas de jugar en las zonas más peligrosas de Albion.

Homesickness (Nostalgia)

Para asegurar que las guilds no usen las Smuggler''s Dens simplemente como base para peleas a gran escala, el debuff Homesick aumenta los efectos de Disarray para grupos de 21 o más jugadores en un 20% adicional. Esto significa que las guilds no pueden aprovechar estas ubicaciones como posiciones estratégicas para la guerra GvG, pero siguen siendo una opción muy útil para jugadores en solitario y grupos más pequeños.

¿Qué hay dentro de una Smuggler''s Den?

Dentro de una Smuggler''s Den, puedes encontrar muchas de las comodidades de una ciudad, junto con algunas características que son exclusivas de estos lugares. Sus ubicaciones exactas se pueden ver en el Region Map cuando estás dentro de una Smuggler''s Den.

• Una Repair Station donde puedes reparar o desmontar objetos
• Una Artifact Foundry donde puedes fusionar artefactos y encantar, despertar, desmontar o transmutar objetos
• Un Travel Planner desde el que puedes viajar a las ciudades de Albion, tus islas, o (si los tienes establecidos como Home) Rests y Hideouts en las Outlands
• Un Bank personal para almacenar objetos
• Un Smuggler''s Market desde el que puedes comprar y vender objetos en la Smuggler''s Network (más sobre esto abajo)
• El NPC contrabandista, Maggy Slade, a quien puedes comprar Smuggler''s Crests, objetos de vanidad de Smuggler, o invitar a una ronda en el Smuggler''s Bar (más sobre ella abajo)', 'https://albiononline.com/guides/article/guide-smugglers+110', false, array['https://assets.albiononline.com/uploads/media/default/media/81b2bba434773c04a2821f9f1d6d97f3d50d2f29.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/8f5d3d1a105a574d9752e8b3015bf70c404dd764.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/c099ca0319364afe2c5114a419773e7ffa8a921d.jpeg']::text[]),
    (v_guide, 2, 'La Smuggler''s Network (Red de Contrabandistas)', 'La Smuggler''s Network es una red de Marketplace en las Outlands, que opera de forma independiente a los Marketplaces de Albion en el Royal Continent. Sus nodos son los Smuggler''s Markets, que se pueden encontrar en las Smuggler''s Dens y en los Outlands Rests.

¿Cómo funciona?

• Los jugadores ponen objetos a la venta en un Smuggler''s Market, y estos pueden comprarse desde cualquier Marketplace de la Network
• Se aplica una Distance Fee (tarifa de distancia) basada en la distancia entre el lugar donde se pone a la venta un objeto y el lugar donde se compra
• Cada región que un objeto tiene que ''recorrer'' añade un 4% adicional de su precio en Distance Fees
• Las Distance Fees siempre las paga el comprador

¿Cómo la uso?

Cuando visitas un Smuggler''s Market, se abrirá la interfaz de la Smuggler''s Network. Es similar a las otras interfaces de Marketplace de Albion, con algunas diferencias.

En la lista de objetos, verás una columna etiquetada como ''Location (Distance)''. Esto te indica en qué Smuggler''s Market se puso a la venta un objeto, y a qué distancia está de tu ubicación actual.

En los filtros de la parte superior puedes establecer una ''Max Distance''. Usándola, puedes filtrar los objetos que están a cierta distancia de ti, y que por tanto tienen Distance Fees altas.

Cuando haces clic en ''Buy'' en un objeto, verás la Distance Fee indicada bajo el precio base del objeto. Si parece particularmente alta, quizás quieras buscar un objeto más cercano, o, si te sientes valiente, viajar más cerca de la ubicación del objeto, reduciendo así la Distance Fee.

Un objeto con un precio base bajo puede acabar siendo relativamente caro una vez que se tienen en cuenta las Distance Fees. Por esta razón, existe la opción de ver los precios base en la interfaz, con las Distance Fees eliminadas, para que puedas ver dónde están los objetos más baratos.

Oportunidades para compradores y vendedores

El Marketplace integrado que es la Smuggler''s Network significa que hay nuevas consideraciones estratégicas tanto para compradores como para vendedores. Como jugador en las Outlands que busca reequiparse, por ejemplo, puedes comprar en tu Smuggler''s Market más cercano con las Distance Fees aplicadas, viajar más cerca de donde está listado un objeto para reducir esas tarifas, o viajar de vuelta al Royal Continent para conseguir precios más baratos.

Como vendedor, la Smuggler''s Network te permite aprovechar a los jugadores que desean permanecer en las Outlands cobrando precios más altos que en el Royal Continent. También ofrecen comodidad al eliminar la necesidad de hacer un viaje arriesgado a través de las Outlands para llevar mercancías al mercado, permitiéndote deshacerte de recursos cerca de donde los recogiste, y por extensión permitiéndote vender en mayores volúmenes.', 'https://albiononline.com/guides/article/guide-smugglers+110', false, array['https://assets.albiononline.com/uploads/media/default/media/475c5c2eb4faf1d5bb154716b279fe794ae9a5b9.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/0674427556eb0b5cb77a397acf381bdaefd8575c.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/73c8352c4d8a13272b8c79e33d90a34c0f736c18.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/fca09fd9175dc95485b92c5d744125c88e5430b0.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/adfb7a2171e8cbb1512365cde1a11a7067376b22.jpeg']::text[]),
    (v_guide, 3, 'Maggy Slade', 'También acechando dentro de las Smuggler''s Dens encontrarás a un personaje turbio llamado Maggy Slade. Es la comerciante de los Smugglers, lista para ofrecerte recompensas por ayudar a su causa. La mayoría de los objetos que ofrece Maggy requieren un cierto nivel de Smuggler Standing (reputación de contrabandista), que puedes ganar realizando varias Smuggler Activities (más sobre eso abajo). Puedes encontrar a Maggy apoyada en la barra de las Dens:

Esto es lo que ofrece:

• Buy A Round (Invitar a una ronda)
• Puedes usar una Smuggler''s Coin (ver Smuggler''s Activities abajo) para invitar a una ronda a los Smugglers que están en la Den, aumentando tu Smuggler Standing

• Smuggler''s Crests
• Se pueden comprar a Maggy una vez que has alcanzado un cierto nivel de Smuggler Standing
• Una Standing más alta te permite comprar Crests de tier superior
• Estos Crests se pueden usar (junto con Caerleon Hearts) para fabricar Smuggler Capes

• Vanity Items (Objetos de vanidad)
• Un conjunto completo de vestuario de Smuggler está disponible con Maggy Slade, requiriendo cada objeto un nivel diferente de Standing
• Estos objetos son no comerciables, así que solo aquellos verdaderamente devotos a la causa de los Smugglers pueden llevarlos
• Quienes tengan Venerated Standing también pueden comprar un Smuggler Avatar y un Avatar Ring', 'https://albiononline.com/guides/article/guide-smugglers+110', false, array['https://assets.albiononline.com/uploads/media/default/media/aac1e48f7309c44ed25013f069bed7543c220e2e.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/a97e611e61c3f09ab5de2018ce8036b170893a06.jpeg']::text[]),
    (v_guide, 4, 'Smuggler''s Activities (Actividades de Contrabandistas)', 'Hay varias actividades que puedes realizar en las Outlands para ganar Smuggler Standing, junto con Might y Favor.

Smuggler Crates (Cajas de Contrabandista)

Por las Outlands puedes encontrar Smuggler Wagons (carros de contrabandista) averiados, que han sido emboscados de camino a su destino y su carga (las Smuggler Crates) abandonada. Puedes recuperar esta carga y entregarla en una ubicación de entrega designada (un Smuggler Stash), aunque solo a pie.

Estos Wagons vienen en tres tamaños, conteniendo diferentes cantidades de Crates. Sin embargo, solo puedes llevar una Crate a la vez, así que si quieres asegurar más de una, necesitarás compañía.

Los Wagons más pequeños solo son visibles cuando estás muy cerca, lo que significa que ofrecen una oportunidad para que los jugadores en solitario agarren una Crate cuando ven una y la entreguen rápidamente. Los Wagons más grandes son visibles en el Region Map, atrayendo más atención de los jugadores cercanos, incluidos los gankers.

Sin embargo, los jugadores que llevan Crates no son visibles en el mapa, así que si consigues agarrar una sin ser detectado, tienes la oportunidad de escabullirte con ella sin que nadie lo note.

Si necesitas hacer una huida rápida, puedes soltar una Crate para poder montar y escapar. Una Crate soltada permanecerá en el suelo donde puede ser recogida por otros, o recuperada por ti más tarde, pero si se deja desatendida durante 30 minutos, desaparecerá.

Captured Smugglers (Contrabandistas Capturados)

Por las Outlands también puedes encontrar Captured Smugglers, que están retenidos como rehenes por los Royal Guards, descontentos con sus actividades ilícitas.

Derrotando a estos guardias en combate, y canalizando durante un breve tiempo, puedes liberar al Captured Smuggler y ganar Smuggler Standing, Might y Favor.

Smuggler''s Coins (Monedas de Contrabandista)

Las Smuggler''s Coins son una forma de moneda que puedes usar en las Smuggler''s Dens para aumentar tu Standing (ver ''Buy a Round'' arriba) y ganar algo de Favor. Estas pueden caer como botín de Camp Caches, Coffers y Hidden Treasures en las Outlands.

Las Smuggler''s Coins no se pueden comerciar y, dado que siempre se destruyen al morir, tampoco se pueden obtener como botín.

Con esta información, ¡podrás aprovechar las oportunidades que ofrece esta turbia facción en las Outlands y ganar sus recompensas! Diviértete, y nos vemos en las Dens…', 'https://albiononline.com/guides/article/guide-smugglers+110', false, array['https://assets.albiononline.com/uploads/media/default/media/88d47157dc1a7e47f1f4ee783d93a7eb57bd9850.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/55add90882e5f416ce8a80d8f80a43bcbf35bb77.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/78072e135b2f030efd4a0429758fcae369eae410.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/66da636befb4262cbd3839e7153b87b785aeab41.jpeg']::text[]);
end
$IMPERIUM$;

-- [13] ingame-chat
do $IMPERIUM$
declare
  v_game uuid;
  v_guide uuid;
begin
  select id into v_game from public.games where slug = 'albion-online';
  if v_game is null then
    raise exception 'IMPERIUM: juego no encontrado: %', 'albion-online';
  end if;

  -- Reemplazo idempotente. OJO: borra los pasos -> reinicia step_progress de esta guía.
  delete from public.guide_steps where guide_id in (
    select id from public.guides where game_id = v_game and slug = 'ingame-chat');
  delete from public.guides where game_id = v_game and slug = 'ingame-chat';

  insert into public.guides
    (game_id, slug, title, description, order_index, is_published, intro_title, intro, intro_images)
  values
    (v_game, 'ingame-chat', 'El Chat del Juego', 'Saca el máximo partido a tu experiencia social en Albion Online.', 13, false, null, 'El sello distintivo de todo gran juego online es la interacción con otros jugadores. Esto añade otro nivel de importancia a tus logros, y comparar tus resultados con los de tus amigos no es sustituto de compartir esas experiencias juntos.

Albion Online no es una excepción. Aunque jugar en solitario es totalmente viable y gratificante por sí mismo, todos los que juegan con otros te dirán que el juego es aún más divertido de esta manera.

La herramienta de chat del juego te permite comunicarte directamente con personas por todo el mundo del juego, y entender los conceptos básicos de la herramienta de chat te ayudará a aprovechar al máximo tu tiempo en Albion.', array['https://assets.albiononline.com/uploads/media/default/media/cce89b707270e63f65c83a6a0f692da2c35970bc.jpeg']::text[])
  returning id into v_guide;

  insert into public.guide_steps
    (guide_id, order_index, title, content, source_url, is_verified, images)
  values
    (v_guide, 1, 'Conceptos Básicos del Chat', 'Por defecto, la ventana de chat aparece en la esquina inferior izquierda de la pantalla en escritorio, o en el centro inferior de la pantalla en móvil.

Para enviar un mensaje en escritorio, empieza pulsando Enter en tu teclado. En móvil, toca ''Chat'' en la parte inferior de la pantalla, luego toca el área de texto junto al nombre del canal en la esquina inferior izquierda de la ventana.

Luego simplemente escribe tu mensaje y pulsa Enter en tu teclado o toca ''Done'' en el teclado en pantalla para enviarlo.

La herramienta de chat recuerda a qué canal has publicado más recientemente, y tu mensaje se publicará en ese canal por defecto.

Para enviar un mensaje a un canal diferente, haz clic o toca el nombre del canal que aparece en la esquina inferior izquierda de la ventana. La lista de canales disponibles para la pestaña actual aparece encima del canal seleccionado actualmente (más sobre pestañas y canales abajo). Haz clic o toca el canal al que quieres enviar.

Alternativamente, escribe una barra (/) seguida del nombre o abreviatura del canal al que quieres enviar, y luego escribe un espacio. Por ejemplo, para enviar un mensaje al canal /trade, podrías escribir /trade o /tr seguido de un espacio y luego tu mensaje.', 'https://albiononline.com/guides/article/guide-chat+111', false, array['https://assets.albiononline.com/uploads/media/default/media/8e77ce47bbbb6c54ff2f45bcf14412809cc6519f.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/da65b11e7b33f01d8f3c3a4db7daad45d09e0bfa.jpeg']::text[]),
    (v_guide, 2, 'Canales y Pestañas', 'Los canales de chat y las pestañas de la ventana de chat son dos cosas separadas, y puedes combinarlos para que funcionen exactamente como tú quieras. Cada pestaña puede mostrar diferentes canales, y puedes personalizar qué canales muestra cada pestaña.

Entendiendo los Canales de Chat

Un canal de chat te permite enviar mensajes a otros jugadores sin importar dónde estén en el mundo del juego (o en el mundo real). Estos canales siempre están ahí, aunque no los estés mirando. Pero para ver un canal, tienes que tenerlo activado.

Hay muchos canales de chat dedicados en el juego, diseñados para diferentes tipos de mensajes. Por defecto, puede que se te muestre un canal general específico de tu idioma, como inglés o portugués, según tu configuración de idioma.

Hay muchos otros canales disponibles que están enfocados en temas específicos. Los canales populares incluyen:

• /help - Para hacer y responder preguntas sobre cómo funciona el juego
• /trade - Para comprar, vender e intercambiar cualquier cosa en el juego
• /lfg - Para encontrar un grupo o encontrar más miembros para tu grupo
• /hce - Para encontrar un grupo para hardcore expeditions, o encontrar miembros para tu grupo de hardcore expedition
• /rec - Para publicar mensajes sobre el reclutamiento de miembros para tu guild, o para encontrar una guild

Algunos canales tienen un ''cooldown'', lo que significa que tienes que esperar un breve tiempo tras enviar un mensaje antes de poder enviar otro. Esto evita el spam del chat y facilita la lectura para todos.

Entendiendo las Pestañas de Chat

Las pestañas en la parte superior de la ventana de chat actúan como contenedores para diferentes canales de chat. Ya tienes configuradas algunas pestañas por defecto, pero puedes decidir qué canales aparecen en cada pestaña, cuántas pestañas tienes mostradas y los nombres de cada pestaña.

Digamos que quieres configurar una nueva pestaña de chat: puedes nombrarla como quieras. Por ejemplo, podrías llamarla ''Jim'', si realmente quisieras. Luego puedes elegir qué canales se muestran en esa pestaña.

Controlando tus Pestañas de Chat

Ahora que entiendes la diferencia entre canales y pestañas, puedes configurarlos como desees. Para personalizar tus pestañas, haz clic o toca la flecha hacia arriba en la esquina superior izquierda de la ventana de chat, y luego haz clic o toca ''Advanced''. Esto abrirá el menú General Chat Settings. (También puedes llegar aquí desde el menú principal del juego, en la sección Social.)

Ahora desplázate hacia abajo hasta ''Tab settings'' y ''Visible Channels''. Para crear una nueva pestaña, haz clic o toca ''New tab'' e introduce su nombre cuando se te solicite.

Para gestionar qué canales están en cada pestaña, selecciona una pestaña en la lista ''Tab settings''. Luego haz clic o toca la marca de verificación junto a cada canal que quieras incluir en esa pestaña. En el ejemplo aquí, puedes ver que la pestaña General incluye los canales Client language /cl e English /en.

Para eliminar una pestaña, haz clic en la ''X'' junto a su nombre.', 'https://albiononline.com/guides/article/guide-chat+111', false, array['https://assets.albiononline.com/uploads/media/default/media/e63d1102b38a231aa7a19c1e9d467a542224f9d7.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/57b9dce478f682828c42975ba0ce99bb7c584476.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/166802068896ef320f833a60e8dfc752256b3288.jpeg']::text[]),
    (v_guide, 3, 'Susurrar (Whispering)', 'También puedes enviar un ''whisper'' (susurro) privado directamente a otro jugador. Si el jugador especificado está conectado, el mensaje le llegará sin importar dónde esté en el mundo de Albion. Ningún otro jugador verá este mensaje.

Si el nombre del jugador es visible en la ventana de chat, simplemente puedes hacer clic en él. De lo contrario, sigue estos pasos:

• Escribe /w seguido de un único espacio. El canal cambia a /whisper.
• Escribe el nombre del jugador, seguido de otro espacio. El canal cambia a un susurro directo al jugador especificado.
• Escribe tu mensaje al jugador y pulsa ''Enter'' o toca ''Done''.

En móvil, cuando escribes un espacio tras el nombre del jugador, el nombre del jugador desaparecerá del teclado virtual. Luego puedes proceder a escribir tu mensaje.', 'https://albiononline.com/guides/article/guide-chat+111', false, array[]::text[]),
    (v_guide, 4, 'Chat ''Say'' (Decir)', 'Si quieres enviar un mensaje de chat que aparezca como un bocadillo de diálogo directamente sobre la cabeza de tu personaje, y que sea visible para los jugadores en tu área inmediata, escribe /s y un espacio para enviar un mensaje al canal ''Say''. Verás tu mensaje público aparecer sobre tu personaje.', 'https://albiononline.com/guides/article/guide-chat+111', false, array['https://assets.albiononline.com/uploads/media/default/media/e544d897d01564e5bc2b07c15c2b0fb6dc1b6bdd.jpeg']::text[]),
    (v_guide, 5, 'Enlazar un Objeto en el Chat', 'Los objetos del juego se pueden enlazar en la ventana de chat, permitiendo a otros jugadores ver los detalles del objeto. Para hacer esto en escritorio, mantén pulsado Control (o Command) y haz clic izquierdo en el objeto. El enlace aparecerá en tu canal de chat actual.

Alternativamente, puedes arrastrar el objeto desde tu inventario y soltarlo directamente sobre la ventana de chat para insertar un enlace. Este método también funciona en móvil.', 'https://albiononline.com/guides/article/guide-chat+111', false, array['https://assets.albiononline.com/uploads/media/default/media/aea9f16a3b42eab402b209a557b06d27d0b25706.jpeg']::text[]),
    (v_guide, 6, 'Personalizar el Chat', 'Hay muchas formas de personalizar la ventana de chat para adaptarla a tus necesidades. Para empezar, abre el menú General Chat Settings a través de la ventana de chat o el menú principal Settings.

Controlando los Ajustes de Apariencia

En la parte superior del menú General Chat Settings, hay varios controles para personalizar la apariencia y el comportamiento de la ventana de chat:

• Lock Window. Cuando está seleccionado, no puedes redimensionar la ventana de chat. Cuando está desactivado, puedes hacer clic o tocar el control en la esquina superior derecha de la ventana y arrastrarlo para redimensionar la ventana.
• Auto-hide Chat. Cuando está activado, la ventana de chat desaparecerá automáticamente tras un breve periodo sin nuevos mensajes.
• Font Size. Este deslizador te permite controlar el tamaño de fuente del texto dentro de la ventana de chat.
• Focused Chat Background Opacity. Este deslizador te da control sobre la transparencia del fondo de la ventana de chat cuando estás interactuando con ella (por ejemplo, enviando mensajes).
• Idle Chat Background Opacity. Este deslizador te da control sobre la transparencia del fondo de la ventana de chat cuando está inactiva (es decir, cuando no has enviado ni recibido recientemente ningún mensaje en los canales de la pestaña seleccionada).

Ubicación de la Ventana de Chat

Además de redimensionar la ventana de chat como se describió antes, puedes controlar dónde aparece en tu pantalla.

En escritorio, siempre que ''Lock Window'' esté desactivado, simplemente haz clic en el fondo y arrastra la ventana a donde quieras que vaya. También puedes reubicar la ventana de chat tanto en escritorio como en móvil usando el HUD Editor. Se puede acceder a él desde la sección Interface del menú principal Settings.

Luego toca ''HUD Editor'' para controlar la ubicación de la ventana de chat y otros elementos de la interfaz.', 'https://albiononline.com/guides/article/guide-chat+111', false, array['https://assets.albiononline.com/uploads/media/default/media/b99ca686a2becd72256d7262ce3621adf79d0684.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/e8953ea2053959155684bd479fb97934acd7feed.jpeg']::text[]),
    (v_guide, 7, 'Reglas del Chat', 'El chat de Albion Online debería ser un espacio amistoso y útil, y por esa razón, hay ciertas reglas que todos deben seguir.

No puedes:

• Usar insultos racistas, sexistas, homófobos o de otro modo intolerantes.
• Acusar públicamente a otros jugadores de hacer trampas, hackear, duplicar, etc., ya sea en el juego o en los foros. Todos los reportes de trampas, hackeos o exploits deben enviarse a support@albiononline.com.
• Hacer spam o fomentar el spam en los canales de chat públicos.
• Publicar material o enlazar a material de naturaleza pornográfica.
• Discutir el intercambio o la venta de cuentas del juego.
• Hacer dox a nadie, es decir, no comunicar bajo ninguna circunstancia contenido encontrado en o relacionado con los perfiles de redes sociales del usuario u otra información sensible. Esto incluye, entre otros, fotografías, nombres reales o datos de contacto como correos electrónicos, direcciones postales o números de teléfono.
• Amenazar a un jugador con violencia contra su persona o su familia.
• Publicar enlaces a archivos ejecutables.
• Hacerse pasar por cualquier MOD, GM, personal de Sandbox Interactive o similar.
• Discutir las decisiones de los moderadores o acosar a los moderadores.
• Discutir excesivamente sobre política, religión, actualidad, etc.
• Ridiculizar a las personas por sus creencias personales.
• Usar el canal global si existe un canal dedicado para tu tema (por ejemplo, comercio o reclutamiento).
• Difundir toxicidad.
• Usar el canal /help para cualquier cosa que no sea hacer o responder preguntas relacionadas con el juego.

Violar estas reglas en un canal público puede resultar en una advertencia o incluso un ban. Esta es una visión general de lo que es inaceptable en el chat, pero como regla, si un mod te pide que dejes de hacer algo, ¡detente! Y si deseas reportar a alguien por incumplir estas reglas, pide un mod en el chat o escribe a support@albiononline.com.

Con este conocimiento, puedes usar el chat del juego de Albion para abrir toda una nueva dimensión social y elevar tu experiencia. Así que diviértete, sé amable, ¡y nos vemos allí!', 'https://albiononline.com/guides/article/guide-chat+111', false, array[]::text[]);
end
$IMPERIUM$;

-- [14] mounts
do $IMPERIUM$
declare
  v_game uuid;
  v_guide uuid;
begin
  select id into v_game from public.games where slug = 'albion-online';
  if v_game is null then
    raise exception 'IMPERIUM: juego no encontrado: %', 'albion-online';
  end if;

  -- Reemplazo idempotente. OJO: borra los pasos -> reinicia step_progress de esta guía.
  delete from public.guide_steps where guide_id in (
    select id from public.guides where game_id = v_game and slug = 'mounts');
  delete from public.guides where game_id = v_game and slug = 'mounts';

  insert into public.guides
    (game_id, slug, title, description, order_index, is_published, intro_title, intro, intro_images)
  values
    (v_game, 'mounts', 'Monturas (Mounts)', '¡Tu fiel compañero tiene más que ofrecer de lo que esperarías!', 14, false, null, 'Las monturas en Albion son más que un simple medio de transporte. Elegir la adecuada para tu aventura puede incluso determinar si sobrevives a un encuentro o pierdes tu equipo ganado con esfuerzo. En la siguiente guía, repasaremos algunos consejos útiles para criar, comprar y montar tus monturas, y mostraremos qué estadísticas y rasgos vigilar para asegurarte de no ser presa fácil ahí fuera, en la naturaleza.', array[]::text[])
  returning id into v_guide;

  insert into public.guide_steps
    (guide_id, order_index, title, content, source_url, is_verified, images)
  values
    (v_guide, 1, 'Consejos Útiles', 'Cada montura tiene estadísticas pasivas que pueden ayudarte a determinar si es adecuada para tu próxima aventura. Estas incluyen mount health (salud de la montura), armor (armadura), magical resistance (resistencia mágica) y crowd control resistance (resistencia al control de masas), que te indican cuánto daño puede recibir esa montura antes de tirar a su jinete. Por su parte, move speed y gallop speed indican cuán rápido puedes viajar por el mundo: la move speed se refiere a la velocidad básica de tu montura, mientras que el galope se consigue cabalgando continuamente sin recibir daño.

Otra estadística importante es la max load, que muestra cuánto peso extra te deja cargar una montura. Aquí tenemos que distinguir entre max load, que cuenta como active carry weight (peso de carga activo), y el hechizo pasivo ''Courier'', que cuenta como passive carry weight (peso de carga pasivo).

El active carry weight te permite cargar más peso mientras cabalgas o mientras estás directamente junto a tu montura. Ser desmontado a la fuerza o salir del radio de la montura eliminará este bono, y puede dejarte sobrecargado.

El passive carry weight, en cambio, aumenta tu max load mientras tengas una montura equipada, incluso si estás a pie o en combate.

Varias monturas también tienen habilidades activas que pueden activarse mientras cabalgas. Algunas ofrecen habilidades en el shoe slot (ranura de calzado, por defecto: F) que te permiten viajar más rápido de varias formas, mientras que otras tienen habilidades en el weapon slot (ranura de arma, por defecto: Q, W, E). Usar una habilidad activa de montura pondrá esa ranura en cooldown, así que si usas la habilidad del shoe slot de tu montura y luego desmontas, debes esperar a que termine el cooldown antes de poder usar tu shoe slot real de nuevo.

Cada montura tiene la habilidad ''Journey Back'' (por defecto: R). Esta te permite regresar a tu última ubicación en zona segura tras una canalización. Esta habilidad tiene un coste de Silver, que viene determinado por la distancia a la zona segura más cercana y los objetos que llevas.

Cuando te desmonta un jugador o criatura enemiga, te vuelves inmune al control de masas durante un breve tiempo, teniendo pleno acceso a tus cooldowns. No puedes volver a montar en 30 segundos.

Al desmontar voluntariamente, tus ranuras de arma están disponibles siempre que no haya jugadores enemigos cerca, mientras que tus ranuras de armadura tienen un cooldown de 5 segundos. También notarás un círculo alrededor de tu montura, dentro del cual puedes moverte libremente y hacer clic/tocar la montura para volver a montar rápidamente. Entrar en combate con otro jugador eliminará inmediatamente la montura.

Cada montura se puede comerciar en el Marketplace. Si decides criar o ganar una montura tú mismo, encontrarás información adicional a continuación.', 'https://albiononline.com/guides/article/mounts+81', false, array['https://assets.albiononline.com/uploads/media/default/media/deb63f7b9452830fa2b06e8e4ca861511f66d3b2.png', 'https://assets.albiononline.com/uploads/media/default/media/70fa881ed4ea480485ea2d349a191b5aa1b829b1.png', 'https://assets.albiononline.com/uploads/media/default/media/9ba1886f55f3ea204dc8809f87f637980be21be4.png']::text[]),
    (v_guide, 2, 'Las Monturas de Albion', 'Starter Mounts (Monturas Iniciales)

Al jugar el tutorial, conocerás tu primera montura: la Novice''s Mule. Aunque no es la más rápida, ya tiene la pasiva ''Courier'', otorgando algo de peso de carga adicional.

Los Horses y Oxen se pueden criar en pastos en islas personales o territorios de guild. Una vez crecidos, pueden ser ensillados para convertirse en un Riding Horse (una montura ágil con peso de carga pasivo), un Armored Horse (una montura robusta con armadura adicional para mayor protección) o un Transport Ox, que te permite cargar grandes cantidades de mercancías.

Adventurer''s Challenge Mounts (Monturas del Reto del Aventurero)

Las Adventurer''s Challenge Mounts ofrecen movimiento rápido, habilidades de escape o alta capacidad de transporte. Cada mes trae un nuevo reto en el que los jugadores pueden acumular Challenge Points para desbloquear recompensas diarias, semanales y mensuales. Tras completar el reto mensual, los jugadores con estatus Premium activo pueden reclamar la montura de ese mes y empezar a usarla de inmediato.

Los Adventurer''s Challenges funcionan en una rotación anual, con la montura de cada mes como sigue:

• Enero: Frost Ram
• Febrero: Saddled Terrorbird
• Marzo: Grizzly Bear
• Abril: Black Panther
• Mayo: Morgana Raven
• Junio: Gallant Horse
• Julio: Spectral Direboar
• Agosto: Divine Owl
• Septiembre: Heretic Combat Mule
• Octubre: Spectral Bat
• Noviembre: Pest Lizard
• Diciembre: Snow Husky

Rare Baby Animals (Crías de Animales Raras)

Algunas crías de animales pueden conseguirse matando hide animals del mundo abierto. Luego pueden criarse en un pasto o en una perrera.

Las probabilidades de que caiga una de estas crías disminuyen con el tier del mob.

Tienes posibilidad de encontrar cada tipo de cría de animal en los siguientes biomas:

• Steppe: Stag (T4) / Swiftclaw (T5) / Mammoth (T8)
• Forest: Direwolf (T6) / Moose (T6) / Direboar (T7) / Direbear (T8)
• Swamp: Swamp Salamander (T6) / Direboar (T7) / Direbear (T8)

También hay una pequeña posibilidad de que los Conqueror''s Chests contengan una de estas.

Los Swiftclaws y Direwolves son muy rápidos, mientras que otros, como el Moose, son geniales cargando cargas medianas a la vez que mantienen la agilidad. El Transport Mammoth es con diferencia la mejor montura para cargar mucho peso.

Faction Mounts (Monturas de Facción)

Cada ciudad importante de Albion alberga una facción por la que los jugadores pueden luchar para ganar Faction Points. Estos puntos se pueden usar para adquirir crías de animales. Cada ciudad tiene una versión estándar y una versión elite de su montura para elegir.

Además de las seis Royal Cities, Brecilien también ofrece dos crías de animales que se pueden comprar con Favor.

Las monturas de cada ciudad son:

• Thetford: Swamp Salamander y Elite Swamp Salamander
• Fort Sterling: Winter Bear y Elite Winter Bear
• Lymhurst: Wild Boar y Elite Wild Boar
• Bridgewatch: Terrorbird y Elite Terrorbird
• Martlock: Bighorn Ram y Elite Bighorn Ram
• Caerleon: Greywolf y Elite Greywolf
• Brecilien: Mystic Owl y Elite Mystic Owl

Battle Mounts (Monturas de Batalla)

Las battle mounts se usan en batallas a gran escala para mejorar la supervivencia y la fuerza ofensiva de un zerg. Pueden ofrecer buffs a grandes grupos de jugadores y moldear el campo de batalla con sus habilidades disruptivas. Estas monturas suelen ser difíciles de derribar.

La mayoría de battle mounts se reparten al final de una Guild Season a través de los Conqueror''s Chests. Alcanzar un guild rank más alto y un mejor cofre aumenta las probabilidades de conseguir battle mounts. Los jugadores que participan en partidas de alto nivel 20v20 Crystal League también tienen posibilidad de recibirlas.

Algunas battle mounts solo pueden obtenerse a través del Energy Manipulator. Requieren una montura base, algunos materiales y una gran cantidad de Siphoned Energy.

Special Mounts (Monturas Especiales)

También hay unas pocas monturas raras que no encajan en ninguna de las categorías anteriores, como la Morgana Nightmare, la Rageclaw y la Spectral Bonehorse. Cada una de estas se puede fabricar a partir de artefactos soltados por World Bosses que se encuentran en zonas de raid especiales en el mundo abierto.

El evento Rites of Spring permite a los jugadores ganar las monturas Spring Cottontail y Caerleon Cottontail.

Algunas referral seasons antiguas recompensaban con monturas únicas.

Y, por último pero no menos importante, el Avalonian Basilisk se puede conseguir con un Saddled Swamp Dragon y 5000 Avalonian Energy en el Saddler.', 'https://albiononline.com/guides/article/mounts+81', false, array['https://assets.albiononline.com/uploads/media/default/media/860f6f4d6d455dd8dea83ee6fba6ca50857baa6d.png', 'https://assets.albiononline.com/uploads/media/default/media/a1dc4bfce579f162edf69cc39a2d7cffed8318ea.png', 'https://assets.albiononline.com/uploads/media/default/media/b9907d7385b04059f626f88150783f6dcf48a103.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/e422e5c7f96d451dfaa7969508e78308c2dab65e.png', 'https://assets.albiononline.com/uploads/media/default/media/a689aee5cd2405abf12587751d47c486ecd097ab.png']::text[]),
    (v_guide, 3, 'Skins de Montura', 'Eres lo que llevas puesto. ¡Así que conviértete en un apuesto aventurero o en un guerrero espantoso mientras cabalgas por Albion! Hay multitud de skins disponibles para dar un cambio de imagen a tu montura favorita; simplemente ve a la interfaz Appearance en el menú del jugador para ver qué skins están disponibles.

Muchas skins se pueden comprar en la Albion Online Web Shop o en la tienda del juego, mientras que algunas se pueden comprar con Gold o ganar refiriendo a un amigo. Las skins de montura por referido se pueden comerciar en el Marketplace.

¿Listo para cabalgar? Con este conocimiento estarás bien equipado para atravesar los traicioneros caminos de Albion con la montura adecuada para cualquier ocasión. ¡Arre!', 'https://albiononline.com/guides/article/mounts+81', false, array['https://assets.albiononline.com/uploads/media/default/media/205cc0aa8ca695bf2198b053e3143cf204980f30.jpeg']::text[]);
end
$IMPERIUM$;

-- [15] farming
do $IMPERIUM$
declare
  v_game uuid;
  v_guide uuid;
begin
  select id into v_game from public.games where slug = 'albion-online';
  if v_game is null then
    raise exception 'IMPERIUM: juego no encontrado: %', 'albion-online';
  end if;

  -- Reemplazo idempotente. OJO: borra los pasos -> reinicia step_progress de esta guía.
  delete from public.guide_steps where guide_id in (
    select id from public.guides where game_id = v_game and slug = 'farming');
  delete from public.guides where game_id = v_game and slug = 'farming';

  insert into public.guides
    (game_id, slug, title, description, order_index, is_published, intro_title, intro, intro_images)
  values
    (v_game, 'farming', 'Farming (Agricultura)', 'El farming es esencial para la economía del juego: ¡involúcrate!', 15, false, null, 'Cuando atiendes tus granjas tras un duro día de aventuras, no solo te estás tomando un descanso bien merecido. También estás alimentando la economía de Albion al producir materias primas que se usan de multitud de formas por todo el juego.

Los productos cultivados se usan para crear muchos tipos diferentes de comida y pociones. La comida es esencial para mantener funcionando las crafting stations, y también proporciona buffs a los jugadores cuando se consume, mientras que las pociones ofrecen opciones adicionales en combate.

Además, puedes usar tu granja para criar crías de animales que se conviertan en las monturas que acompañan a cada aventurero en sus viajes.

Este artículo te proporciona una guía paso a paso para empezar, antes de repasar los diferentes tipos de farming. ¿Listo para empezar a cultivar tus propios cultivos, hierbas y animales? Entonces sigue leyendo…', array['https://assets.albiononline.com/uploads/media/default/media/54a4c23445df17ba1ebc8c2c77e3ca3372f11f46.jpeg']::text[])
  returning id into v_guide;

  insert into public.guide_steps
    (guide_id, order_index, title, content, source_url, is_verified, images)
  values
    (v_guide, 1, 'Paso 1: Comprar una Isla', 'Para hacer farming, necesitas una farming plot (parcela de cultivo). Esto es más común en una player island (isla de jugador), pero también puede estar en un farming territory proporcionado por una guild.

Las islas se pueden comprar en el Island Merchant en cualquiera de las Royal Cities, Caerleon o Brecilien. El Island Merchant se encuentra en el centro de estas ciudades, cerca del Marketplace. Así aparece en el region map:

Ten en cuenta que para comprar una isla necesitas al menos 7 días de Premium. Después de esto, puedes mantener la isla para siempre sin necesidad de tener continuamente el estatus Premium.

Cada isla está vinculada a la ciudad en la que se compró, y puedes poseer hasta una isla por cada ciudad. Comparten bioma, y, lo que es importante, puedes viajar entre una isla y su ciudad anfitriona de forma gratuita. Si deseas viajar de una isla a una ciudad diferente, necesitas pagar costes de transporte.

Ahora que tienes una isla, puedes viajar a ella usando el Travel Planner.', 'https://albiononline.com/guides/article/farming+51', false, array['https://assets.albiononline.com/uploads/media/default/media/43ca6ac296d02f665d04156c1c99e5646a4b61a5.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/f9bc6ba1811caf8b0135f345619e3de0753b3796.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/e6959654a300c968e8e0a5c40827ab7b552722c9.jpeg']::text[]),
    (v_guide, 2, 'Paso 2: Construir una Parcela', 'Dependiendo del nivel de tu isla, tendrás acceso a una serie de multipurpose plots (parcelas multipropósito) que pueden usarse para diferentes tipos de parcelas de cultivo o edificios. Una isla de nivel 1 contiene una multipurpose plot. Los farming territories solo tienen cuatro parcelas para construir, pero producirán cuatro veces más rendimiento de cultivo, y harán crecer a los animales cuatro veces más rápido.

Para empezar a construir una granja, ve a una multipurpose plot. Luego, navega a la interfaz Build haciendo clic en tu avatar en la parte superior y seleccionando ''Build'' (en escritorio puedes simplemente pulsar H para abrir este menú). Navega a la segunda pestaña, ''Farming'', donde puedes elegir entre construir una Farm, Herb Garden, Pasture o Kennel. Cada una de estas te permite cultivar diferentes cultivos o criar diferentes animales.

Para construir una de estas, debes asegurarte de tener los recursos necesarios, que puedes comprar en el Marketplace o recolectar tú mismo.', 'https://albiononline.com/guides/article/farming+51', false, array['https://assets.albiononline.com/uploads/media/default/media/82586a2f6bb7aacd8c699105602224765f0145ac.jpeg']::text[]),
    (v_guide, 3, 'Paso 3: Cultivar Productos', 'Digamos que quieres cultivar zanahorias (carrots). Una vez que has construido una farm plot, necesitas comprar algunas Carrot Seeds. Las islas de nivel 2 contienen un farming merchant al que puedes comprar semillas, o puedes obtenerlas de los Marketplaces. Podría valer la pena comparar precios para ver qué opción es más barata.

Ve a tu farming plot, selecciona las Carrot Seeds de tu inventario, y haz clic en ''Place'' para plantarlas.

Si tienes Focus Points, puedes elegir regar tus plantas, lo que garantizará que recibas semillas de vuelta de tus cultivos (ver abajo). Si riegas aproximadamente la mitad de tus plantas, puedes mantener suficientes semillas para el día siguiente sin tener que comprar nuevas, aumentando tus beneficios.', 'https://albiononline.com/guides/article/farming+51', false, array['https://assets.albiononline.com/uploads/media/default/media/df6299a3876b129951a3409b82a4aa7d2f6f2f56.jpeg']::text[]),
    (v_guide, 4, 'Paso 4: Cosechar', 'Todas las plantas tienen un ciclo de crecimiento de 22 horas, tras el cual puedes cosecharlas. También hay posibilidad de que recibas semillas adicionales que puedes usar para volver a cultivar, y Earthworms (lombrices) que se pueden usar para fabricar Fishing Bait (cebo de pesca).

Ve a tu farming plot y haz clic en ''Collect''. ¡Enhorabuena, has cultivado y cosechado con éxito tus primeras plantas!

Ahora puedes vender tus cultivos en el Marketplace, o usarlos para fabricar comida.', 'https://albiononline.com/guides/article/farming+51', false, array['https://assets.albiononline.com/uploads/media/default/media/951c4c0bcf73a7f0efaa66ab5ff463b6bfc76d2a.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/cce19b83c896714f96a70e5a9229ba114459fd91.jpeg']::text[]),
    (v_guide, 5, 'Tipos de Granjas y sus Productos', 'Especializarte en un tipo concreto de farming puede permitirte progresar más rápido en esa área, llevando a una mayor eficiencia y maestría con el tiempo. Por el contrario, diversificar tus operaciones de farming te permite producir una gama más amplia de objetos, ofreciendo flexibilidad y adaptabilidad en el mercado. Cada farming plot tiene un coste fijo y puede demolerse en cualquier momento, lo que devuelve el 90% de sus recursos. A continuación, una visión general de los costes de cada tipo de parcela y sus productos:

• Farm — Coste: 15 Rough Logs, 15 Rough Stone. Productos: Carrots, Beans, Wheat, Turnips, Cabbage, Potatoes, Corn, Pumpkins
• Herb Garden — Coste: 25 Rough Logs, 25 Rough Stone, 25 Birch Planks, 25 Limestone Blocks. Productos: Arcane Agaric, Brightleaf Comfrey, Crenellated Burdock, Dragon Teasel, Elusive Foxglove, Firetouched Mullein, Ghoul Yarrow
• Pasture — Coste: 30 Rough Logs, 30 Rough Stone, 30 Chestnut Planks, 30 Sandstone Blocks. Productos: Horses T3-T8, Oxes T3-T8, Stag, Moose, Chickens, Goats, Geese, Sheeps, Pigs, Cows
• Kennel — Coste: 50 Bloodoak Logs, 50 Slate, 10 Runite Steel Bars. Productos: Moabirds T5 y T8, Winter Bears T5 y T8, Wild Boars T5 y T8, Bighorn Rams T5 y T8, Swamp Salamanders T5 y T8, Greywolves T5 y T8, Mystic Owls T5 y T8, Swiftclaws, Direwolves, Direboars, Swamp Dragons, Direbears, Mammoths, Spring y Caerleon Cottontail

Esto es lo que necesitas saber sobre cada tipo de producto…

Plantas

Lo básico de la plantación se ha cubierto en la guía paso a paso de arriba. Sin embargo, también vale la pena señalar que cada Royal City tiene un local production bonus para ciertas verduras o hierbas, que aumenta su rendimiento en un 10%.

Bonificaciones de producción local por ciudad:
• Lymhurst — Crop: (T8) Pumpkin · Herb: (T4) Crenellated Burdock · Animal: (T5) Goose · Adicional: (T1) Carrot
• Bridgewatch — Crop: (T7) Corn · Herb: (T5) Dragon Teasel · Animal: (T4) Goat · Adicional: (T2) Bean
• Martlock — Crop: (T6) Potato · Herb: (T6) Elusive Foxglove · Animal: (T8) Cow · Adicional: (T3) Wheat
• Thetford — Crop: (T5) Cabbage · Herb: (T7) Firetouched Mullein · Animal: (T7) Pig · Adicional: (T2) Arcane Agaric
• Fort Sterling — Crop: (T4) Turnip · Herb: (T8) Ghoul Yarrow · Animal: (T6) Sheep · Adicional: (T3) Chicken

Livestock Animals (Animales de Granja)

El ganado colocado en una pasture necesita ser alimentado para empezar a crecer. Cada tipo tiene una comida favorita que reduce a la mitad la cantidad de cultivos necesarios para alimentarlo.

El ciclo de crecimiento de los Livestock Animals es de 1 día y 20 horas, pero puede reducirse a la mitad si tienes estatus Premium.

Cuando están completamente crecidos, estos animales pueden recogerse para ser sacrificados (butchered), o alimentarse de nuevo para obtener productos secundarios como huevos o leche.

Usando Focus Points puedes aumentar las probabilidades de que produzcan descendencia, lo que, de forma similar a las plantas, te ayuda a reiniciar el proceso sin tener que gastar Silver adicional.

Cada Royal City tiene un local production bonus que aumenta el rendimiento del sacrificio de ciertos animales, y de sus productos secundarios (ver tabla de arriba).

Riding Animals (Animales de Montar)

A diferencia del ganado, los Riding Animals no tienen una comida favorita y su ciclo de crecimiento depende del tier del animal. Esto es lo que tarda cada uno en crecer (con y sin Premium):

• T3: 22h con Premium / 1d 20h sin Premium
• T4: 1d 22h con Premium / 3d 20h sin Premium
• T5: 2d 22h con Premium / 5d 20h sin Premium
• T6: 3d 22h con Premium / 7d 20h sin Premium
• T7: 4d 22h con Premium / 9d 20h sin Premium
• T8: 5d 22h con Premium / 11d 20h sin Premium

Solo los Horses y Oxen se pueden comprar al Farming Merchant; todas las demás crías de animales hay que comprarlas a otros jugadores o encontrarlas en la naturaleza: al matar un Wild Animal, tiene posibilidad de soltar su correspondiente cría de animal como botín.

Los Horses, Oxen, Stags y Moose se pueden criar en una Pasture, mientras que todos los demás Riding Animals requieren un Kennel.

Las crías de animales superiores a T4 también pueden ser nurtured (cuidadas) varias veces, aumentando las probabilidades de que produzcan descendencia.

Cuando un Riding Animal está completamente crecido, puede ensillarse en el Saddler (otro Farm Building que se puede construir en tu isla) y usarse como tu nueva montura o venderse a otros jugadores.', 'https://albiononline.com/guides/article/farming+51', false, array['https://assets.albiononline.com/uploads/media/default/media/7724cbe563e85462d4cd902f4a80bf51db2031b3.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/4366fc928c1563a1914f74db782cc2c3de794b11.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/a428fea5820593da685ca95f3c97864a59767efd.jpeg']::text[]),
    (v_guide, 6, 'Conclusión', 'Ya sea que elijas producir comida o pociones a partir de los productos de tu trabajo, o venderlos directamente en el Marketplace, hay muchas formas en las que puedes contribuir a la vibrante economía de Albion, ¡y obtener un buen beneficio mientras lo haces!

A veces es buena idea vender tus productos a tus guildmates y amigos. Muchos jugadores están encantados de comprarlos con un pequeño descuento, mientras que ambos os beneficiáis al evitar los impuestos del Marketplace.

Si buscas ampliar tu espacio de farming pero no puedes mejorar más tu isla ni comprar una nueva isla en otra ciudad, también puedes preguntar a tus amigos o guildmates si puedes usar sus islas. Ellos pueden permitirte acceder a sus islas a través de la interfaz Access Rights, y viceversa.

Con esta información, deberías tener todo lo que necesitas para trabajar la tierra y ganarte tu prosperidad. ¡Feliz farming!', 'https://albiononline.com/guides/article/farming+51', false, array['https://assets.albiononline.com/uploads/media/default/media/0f75f476fdff134c79fa8e3907bcbd1579834e46.jpeg']::text[]);
end
$IMPERIUM$;

-- [16] roads-of-avalon
do $IMPERIUM$
declare
  v_game uuid;
  v_guide uuid;
begin
  select id into v_game from public.games where slug = 'albion-online';
  if v_game is null then
    raise exception 'IMPERIUM: juego no encontrado: %', 'albion-online';
  end if;

  -- Reemplazo idempotente. OJO: borra los pasos -> reinicia step_progress de esta guía.
  delete from public.guide_steps where guide_id in (
    select id from public.guides where game_id = v_game and slug = 'roads-of-avalon');
  delete from public.guides where game_id = v_game and slug = 'roads-of-avalon';

  insert into public.guides
    (game_id, slug, title, description, order_index, is_published, intro_title, intro, intro_images)
  values
    (v_game, 'roads-of-avalon', 'Las Roads of Avalon', 'Aprende a navegar por estos antiguos caminos, y descubre lo que esconden.', 16, false, null, 'Hay más de una forma de moverse por el mundo de Albion Online. Puedes tomar el camino tradicional de viajar por el mundo abierto hasta tu destino. Pero quienes conocen una antigua red de caminos creada por los avalonianos pueden recorrer grandes distancias en poco tiempo. Estas Roads of Avalon son mucho más que una simple red de senderos: contienen oportunidades para luchar contra mobs únicos, descubrir Avalonian Chests, hacer Tracking, explorar dungeons de alto valor, recolectar recursos lucrativos, ¡y mucho más!

Las Roads of Avalon se pueden disfrutar tanto como solo player como en grupo, así que, para descubrir cómo navegar por estos senderos y cómo sacarles el máximo partido, sigue leyendo…', array['https://assets.albiononline.com/uploads/media/default/media/9b574b5080854575c8e10e0189e7f944038e282d.png']::text[])
  returning id into v_guide;

  insert into public.guide_steps
    (guide_id, order_index, title, content, source_url, is_verified, images)
  values
    (v_guide, 1, 'Encontrar las Roads', 'Encontrar una entrada a las Roads of Avalon es bastante sencillo:

• Cuando explores el mundo abierto, consulta el Minimap o el Region Map
• En el Region Map puede que veas portales de colores vivos, llamados Gateways to Avalon
• Al pasar el cursor por encima aparece un tooltip que dice "Road of Avalon to…"
• Justo debajo de ese mensaje se muestra el nombre de la Road
• Por ejemplo, "Casitos-Atinaum" o similar
• También verás una barra que indica cuántos jugadores pueden entrar en esa región de Roads en ese momento
• Hay portales que permiten pasar a 7 jugadores y portales que permiten pasar a 20 jugadores

También existe una entrada de un solo sentido a las Roads en Brecilien, la ciudad de los Mists:

• Este portal en concreto es único, ya que no te permite regresar a Brecilien y no te indica a qué región de Roads vas a viajar', 'https://albiononline.com/guides/article/the-roads-of-avalon+107', false, array['https://assets.albiononline.com/uploads/media/default/media/2fc74f1fd200e110555dc30cefd22339f4094995.jpeg']::text[]),
    (v_guide, 2, 'Entrar en las Roads', '• Las Roads tienen un número limitado de ''cargas'', que determinan cuántas personas pueden entrar en un momento dado
• La cantidad de cargas que le quedan a un portal de Roads se muestra al pasar el cursor por encima
• Estas cargas se regeneran con el tiempo
• Cuando entras en una Road, consumes una carga
• Si un portal de Roads no tiene cargas restantes, se desvanecerá en el mapa y no podrás usarlo hasta que haya regenerado cargas
• Si has consumido una carga recientemente, todavía puedes usar el portal
• En ese caso aparecerá marcado con un contorno amarillo y un tooltip que dice "Free to use"
• El tiempo que falta para que se regenere la siguiente carga se indica a la derecha de la barra de ''cargas disponibles''

• Los portales para salir de las Roads tienen su propio conjunto de cargas
• Por ejemplo, si usas un portal para entrar en las Roads, consumirá una carga en esa dirección
• Sin embargo, no afectará a la cantidad de cargas del portal de salida correspondiente dentro de las Roads
• Si entras brevemente en las Roads y luego sales por el mismo portal, no consumirás una carga al salir, solo al entrar
• Las Roads no son estáticas, sino una red cambiante de portales que se abren y se cierran, conectando zonas distintas cada vez
• El tiempo que le queda a un portal antes de cerrarse se puede ver al pasar el cursor por encima

Aunque puedes simplemente saltar a cualquier portal de Roads y ver adónde lleva, hay formas de identificar adónde te llevará:

• Entrar por un portal desde una Blue Zone o Yellow Zone siempre te llevará a una Road de Tier 4
• Entrar desde una Red Zone o Black Zone normalmente te situará en una Road de Tier 6
• Las Roads de Tier 8 son exclusivas de las Deep Roads (a las que solo se puede acceder desde portales situados dentro de las Roads, más sobre esto abajo) o de los ''raid portals'' de 20 jugadores', 'https://albiononline.com/guides/article/the-roads-of-avalon+107', false, array['https://assets.albiononline.com/uploads/media/default/media/4d6b1a32a9224d8f0681c27a58fc796b9864ad13.png', 'https://assets.albiononline.com/uploads/media/default/media/eee97190b88da4bb2ca3b45e87114b8f7491922f.jpeg']::text[]),
    (v_guide, 3, 'Navegar por las Roads', 'Una vez dentro de las Roads of Avalon, encontrarás la propia Road, que contiene indicadores dorados que otorgan un buff de velocidad del 70% a tu montura cuando los pisas (este buff se acumula con el galope de tu montura), así como áreas "off-road" (fuera del camino) donde podrás encontrar gran cantidad de contenido distinto. Más sobre esto abajo.

También encontrarás más gateways que conectan con otras regiones de Roads. Algunas regiones son cruces o conectores, mientras que otras están más especializadas.

Los gateways dentro de las Roads están rodeados por una serie de anillos giratorios. Para ver a qué tipo de región te llevará un gateway, colócate junto al portal y los anillos que lo rodean dejarán de girar, iluminando una serie de tres indicadores. El primer indicador (el más cercano al centro) te dice para qué tamaño de grupo está pensado el destino:

• Un personaje: contenido Solo/Dúo
• Dos personajes: contenido de grupo pequeño (Small Group)
• Cuatro personajes: contenido de grupo grande (Large Group)

El segundo indicador muestra el tier de la región de destino:

• Cuatro puntos: zona T4
• Cinco puntos: zona T5
• Seis puntos: zona T6
• Siete puntos: zona T7
• Ocho puntos: zona T8

Por último, el tercer indicador te dice a qué tipo de región llegarás. Los que llevan fuera de las Roads se marcan así:

• Anillo único: Blue Zone
• Dos anillos: Yellow Zone
• Anillo exterior con centro sólido: Red Zone
• Anillo sólido: Black Zone

Si un gateway lleva a otra región de Roads, el tercer indicador mostrará el tipo de región:

• Cruce de 4 caminos: Avalonian Junction. El tipo de Road más común, con portales a otras Roads y al mundo abierto
• Camino único: Avalonian Corridor. Una Road simple y recta, normalmente con un solo portal adicional
• Forma de T: Avalonian Rest. Los gremios pueden colocar Hideouts en estas Roads
• Callejón sin salida: Avalonian Sanctuary. El tipo de Road más raro, que contiene mobs y recursos de alto valor
• Callejón sin salida con pinchos: Avalonian Raid. Normalmente se accede desde los Avalonian Rests y ofrecen contenido de alto nivel para grupos

La forma de nombrar las regiones de Roads también puede indicar de qué tipo de área se trata. La mayoría de las Roads se nombran con una combinación de dos palabras; las que tienen tres palabras casi siempre indican un Avalonian Rest. Fijarse en la primera letra del nombre también puede dar una pista: la Road de esa región tendrá aproximadamente la forma de esa letra.

La terminación de la última palabra a menudo (aunque no siempre) puede insinuar lo que contiene una Road:

• -los: cofre verde grande
• -am: cofre azul grande
• -un: cofre dorado grande
• -sum: fibra
• -tum: cuero
• -rom: piedra
• -lum: mineral
• -aum: madera', 'https://albiononline.com/guides/article/the-roads-of-avalon+107', false, array['https://assets.albiononline.com/uploads/media/default/media/7319e3e18c4983e30dc1978b128f2e94d1cc9dd7.png', 'https://assets.albiononline.com/uploads/media/default/media/042f16346d33bd898aa05e5a6c89679284dabd4d.png', 'https://assets.albiononline.com/uploads/media/default/media/10d33efed3ac421ab317e53174f92380de632117.png', 'https://assets.albiononline.com/uploads/media/default/media/c3232bad726e332b4eae359264d67d79f7b0c338.png', 'https://assets.albiononline.com/uploads/media/default/media/c450370dbcb9a88fea8b7cf3ecf67d07066e87a1.png', 'https://assets.albiononline.com/uploads/media/default/media/3f9e2faee29ddfa559a70b81bb8dfaa44e2b4102.png', 'https://assets.albiononline.com/uploads/media/default/media/71cfabb5b13a1b60e06f2829787e23b31c73d986.png', 'https://assets.albiononline.com/uploads/media/default/media/df798538d60c89de0bff0a79e71c4a583ebdf955.png', 'https://assets.albiononline.com/uploads/media/default/media/8951c0d9d097a47ff5a04f1f3f715900206293bf.png', 'https://assets.albiononline.com/uploads/media/default/media/f8b1e74e1a1f9e6eb84b5de775c59ddda6d75956.png', 'https://assets.albiononline.com/uploads/media/default/media/32b89eb2868ca7ae4e8b0f611e909f4df9d95836.png', 'https://assets.albiononline.com/uploads/media/default/media/3f8b397eaa65b1802016f06088299ddcfc328dce.png', 'https://assets.albiononline.com/uploads/media/default/media/d3237c6afc3581116d83985e613c8eeb13f6bd6a.png', 'https://assets.albiononline.com/uploads/media/default/media/0884d3773c0d6b1ef196288fea98ec2b0605d1e2.png', 'https://assets.albiononline.com/uploads/media/default/media/f643d4cc859a7a6302b190f61747967634444e39.png', 'https://assets.albiononline.com/uploads/media/default/media/9ceabb9525619f287996c0d92b276969b51e6f75.png', 'https://assets.albiononline.com/uploads/media/default/media/7a66c0fcc3bbe7d0aa071b651463c67b86a780cc.png']::text[]),
    (v_guide, 4, 'Contenido en las Roads', 'Como se mencionó antes, las áreas a los lados del camino principal contienen una gran variedad de contenido, como mobs para combatir, recursos para recolectar y dungeons para explorar.

Aquí tienes un desglose de lo que ofrecen las Roads:

• Viaje acelerado
• Las Roads sirven como conexiones entre regiones del mundo abierto que no tienen una conexión directa
• El camino principal proporciona un buff de velocidad a la montura, como se comentó antes

• Avalonian Mobs
• Estos mobs son únicos de las Roads of Avalon
• Ofrecen oportunidades de PvE de alto nivel para solo players y grupos pequeños
• Los mobs que encuentres serán del mismo tier que la región en la que estés

• Avalonian Dungeons
• Al igual que en el mundo abierto, aparecen dungeons por todas las Roads of Avalon
• Ofrecen contenido PvE de alto nivel para grupos
• Dentro de estos dungeons encontrarás un gran número de Avalonian Mobs y poderosos jefes

• Tracking
• El Tracking es posible dentro de las Roads, y ofrece botín valioso para solo players y grupos pequeños

• Avalonian Chests
• Vienen en variedades pequeña y grande, para juego en solitario y en grupo respectivamente
• Pueden mejorar si se dejan sin tocar el tiempo suficiente
• Contienen mejor botín que sus equivalentes del mundo abierto

• Recolección (Gathering)
• En las Roads se pueden recolectar recursos lucrativos de alto tier y Resource Mobs

• PvP
• Las Roads son zonas letales de full-loot, con todos los riesgos y recompensas del PvP que ello implica
• Los gremios pueden establecerse en las Roads construyendo Hideouts y participando en batallas GvG', 'https://albiononline.com/guides/article/the-roads-of-avalon+107', false, array['https://assets.albiononline.com/uploads/media/default/media/68067a74747cb67ee53e369798c57d7720a35e80.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/32450a58344b45f3fd93abc027ed0755e43a71d7.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/0e35b6e6ca7314f406a62a9592b25a441be667e0.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/d68b5d54fdca220cd049ced5f6de543effa1fc59.jpeg']::text[]),
    (v_guide, 5, 'Botín avaloniano', 'Cuando juegas en las Roads of Avalon, puedes conseguir una variedad de botín único de mobs y cofres:

• Los Avalonian Shards se pueden usar para crear Avalonian Artifacts. Estos, a su vez, se pueden usar para fabricar poderosas Avalonian Weapons

• La Avalonian Energy se puede usar para crear comida avaloniana, herramientas de recolección y la montura Avalonian Basilisk. También se utiliza para crear Awakened Weapons

Las Roads of Avalon ofrecen contenido impredecible y lucrativo al viajero aventurero, y con esta información deberías sentirte seguro navegando por estos misteriosos senderos. ¡Buena suerte!', 'https://albiononline.com/guides/article/the-roads-of-avalon+107', false, array['https://assets.albiononline.com/uploads/media/default/media/0fa477affce4d5810bd7894de950cd326046e7f5.jpeg']::text[]);
end
$IMPERIUM$;

-- [17] guild-finder
do $IMPERIUM$
declare
  v_game uuid;
  v_guide uuid;
begin
  select id into v_game from public.games where slug = 'albion-online';
  if v_game is null then
    raise exception 'IMPERIUM: juego no encontrado: %', 'albion-online';
  end if;

  -- Reemplazo idempotente. OJO: borra los pasos -> reinicia step_progress de esta guía.
  delete from public.guide_steps where guide_id in (
    select id from public.guides where game_id = v_game and slug = 'guild-finder');
  delete from public.guides where game_id = v_game and slug = 'guild-finder';

  insert into public.guides
    (game_id, slug, title, description, order_index, is_published, intro_title, intro, intro_images)
  values
    (v_game, 'guild-finder', 'Guild Finder', '¡Encuentra un gremio y desbloquea más de lo que Albion tiene para ofrecer!', 17, false, null, 'Aunque Albion Online se puede disfrutar como solo player, unirte a un gremio añade enormes capas a la experiencia de juego. Ser miembro de un gremio desbloquea una gran cantidad de contenido, te permite beneficiarte del conocimiento de tus compañeros de gremio, te da seguridad en grupo en las zonas más peligrosas de Albion, y mucho más. Si te unes a un gremio, descubrirás que el juego se abre a un nivel completamente nuevo que no habías experimentado antes.

Para que sea fácil encontrar el gremio adecuado, existe un Guild Finder dentro del juego que puede ayudarte a buscar aquellos cuyas actividades, idiomas, zonas horarias y mucho más se ajusten a lo que buscas. Sigue leyendo para descubrir cómo sacarle el máximo partido y disfrutar de Albion Online al máximo.', array['https://assets.albiononline.com/uploads/media/default/media/c672f66e7c4154cdd4a6cb303f02e2b8f02e3701.png']::text[])
  returning id into v_guide;

  insert into public.guide_steps
    (guide_id, order_index, title, content, source_url, is_verified, images)
  values
    (v_guide, 1, '¿Por qué unirse a un gremio?', 'Unirte a un gremio puede aportar muchas ventajas. Por ejemplo:

• Tener una comunidad de jugadores que te ayude a guiarte por Albion Online
• Acceso a una Guild Island o a Hideouts, con almacenamiento adicional en el banco y la posibilidad de construir casas y tiendas
• Apoyo y protección de tus compañeros de gremio en zonas peligrosas como las Outlands y las Roads of Avalon
• Los Hideouts y los Territorios también pueden proporcionar cierto nivel de protección en las Outlands
• Compañeros de equipo para actividades de grupo como Hellgates y dungeons de grupo
• La posibilidad de desbloquear recompensas del Albion Journal por participar en el gremio
• Servidores de Discord dedicados para comunicarte y recibir orientación de tus compañeros de gremio

Sin embargo, hay algunas cosas a tener en cuenta cuando busques un gremio:

• Algunos gremios pueden tener requisitos sobre quién puede unirse (por ejemplo, debes tener cierta cantidad de Fame)
• También puede que se te exija unirte al servidor de Discord del gremio y usar el chat de voz
• Los gremios pueden deducir automáticamente impuestos (taxes) de la Silver que obtienes al matar mobs, para financiar las instalaciones y actividades del gremio', 'https://albiononline.com/guides/article/guild-finder+106', false, array['https://assets.albiononline.com/uploads/media/default/media/c0382c2d79f31c3784e4999981282473b4c6e54e.png']::text[]),
    (v_guide, 2, 'Abrir el Guild Finder', 'Para abrir el Guild Finder en escritorio, haz clic en el icono de escudo (Guilds) en la parte superior de la pantalla y elige Guild Finder en el menú desplegable (atajo: Shift+G).

Si estás en móvil, toca el icono del menú principal en la esquina superior derecha de la pantalla y luego toca Guild Finder en el menú.', 'https://albiononline.com/guides/article/guild-finder+106', false, array['https://assets.albiononline.com/uploads/media/default/media/9f4f7f9c5db534f104614af9aae988f953f6681f.png']::text[]),
    (v_guide, 3, 'Navegar por el Guild Finder', 'Tres pestañas en el lado derecho de la ventana principal del Guild Finder ofrecen distintas formas de encontrar el gremio adecuado.

• Beginner Recommendations (Recomendaciones para principiantes)
• Esta pestaña se abre por defecto
• Usa el selector de Guild Language en el lado izquierdo de la ventana para elegir tu idioma
• Se recomiendan automáticamente nueve gremios que pueden interesarte, según factores como la ubicación del gremio y la hora del día a la que sueles jugar
• Haz clic o toca las flechas de navegación izquierda y derecha en la parte inferior de la ventana para moverte entre las páginas de recomendaciones
• Puedes hacer clic o tocar el escudo de un gremio para ver sus detalles de reclutamiento

• Guild Name Search (Búsqueda por nombre de gremio)
• Usa esta pestaña si ya conoces el nombre del gremio que buscas
• Introduce el nombre del gremio en el cuadro de búsqueda y luego haz clic o toca el icono del gremio para ver sus detalles de reclutamiento

• Guild Filter (Filtro de gremios)
• Esta pestaña te permite seleccionar criterios para acotar el tipo de gremio que buscas
• Puedes filtrar por factores individuales como si un gremio es apto para principiantes, el número de miembros activos del gremio y las actividades concretas que quieres hacer con tus compañeros
• Consulta "Consejos para usar el Guild Filter", más adelante en esta guía, para más información', 'https://albiononline.com/guides/article/guild-finder+106', false, array['https://assets.albiononline.com/uploads/media/default/media/f8cd1f5bbc3f0ad262944eb5c3cf9d6a4392ddf3.png', 'https://assets.albiononline.com/uploads/media/default/media/186c38d6398331678beabacc0db3e6f1240299ec.png', 'https://assets.albiononline.com/uploads/media/default/media/95a5fbd3a40dbde641fdf958c57ea902b98a54ff.png']::text[]),
    (v_guide, 4, 'Unirse a un gremio', 'Cuando hayas encontrado un gremio al que quieras unirte, puedes hacer clic en Apply (Solicitar) o Join (Unirse), según si el gremio requiere una solicitud o permite a los jugadores unirse al instante.

• ''Apply'' te permite enviar un mensaje a los líderes del gremio; los líderes reciben un correo dentro del juego con tu solicitud y pueden aceptarla o rechazarla dentro del mensaje
• ''Join'' te añade al gremio de inmediato

Servidores de Discord

• Si tienes el cliente de Discord instalado y el botón azul de Discord está activo, puedes hacer clic en el botón para recibir una invitación al servidor de Discord del gremio
• Normalmente, en este punto se te exige completar una solicitud para acceder al servidor
• Si te aceptan, podrás comunicarte con otros miembros del gremio en la app de Discord, tanto por chat de voz como de texto
• Los miembros del gremio a menudo hacen streaming dentro del servidor de Discord, al que puedes unirte o simplemente ver

Usar Discord para charlar con personas que ya están en un gremio concreto también puede ayudarte a tomar una mejor decisión sobre si quieres o no unirte a ese gremio. Si el botón de Discord no está activo, significa que el gremio no ha proporcionado una invitación de Discord.', 'https://albiononline.com/guides/article/guild-finder+106', false, array['https://assets.albiononline.com/uploads/media/default/media/c0be785d593bb4d975acb84b1b74e16de6eec295.png']::text[]),
    (v_guide, 5, 'Consejos para usar el Guild Filter', 'Aquí tienes algunas indicaciones para ayudarte a usar la pestaña Guild Filter de forma eficaz:

• Selecciona la opción "Guild Requirements Met" para asegurarte de ver gremios cuyos requisitos de admisión cumple actualmente tu personaje
• Los requisitos pueden incluir una cantidad mínima de Fame total, o una cantidad mínima de PvP Fame
• Si eres nuevo en Albion Online, considera seleccionar el filtro Beginner-Friendly Guilds para incluir en la lista solo los gremios que aceptan jugadores nuevos
• Si no encuentras lo que buscas y necesitas empezar de cero, haz clic o toca Reset All Filters en la parte superior del panel izquierdo
• Puedes usar la opción ''Sort By'' en la esquina superior derecha de la ventana para ordenar los resultados por actividad, rankings o distintos tipos de Fame, en orden ascendente o descendente', 'https://albiononline.com/guides/article/guild-finder+106', false, array['https://assets.albiononline.com/uploads/media/default/media/65aff553e629ba7c224a25ae4a1aa7184e50a992.png']::text[]),
    (v_guide, 6, 'Para oficiales de gremio: cómo controlar la ficha de tu gremio', '• Los jugadores de tu gremio que tengan el permiso "Edit Recruitment Settings" pueden controlar cómo aparece tu gremio en el Guild Finder
• Para hacerlo, abre la interfaz del gremio (Guild UI) y haz clic en la pestaña Recruitment
• El campo Type controla si los jugadores que quieren unirse a tu gremio pueden hacerlo de inmediato (sin revisión por parte de los líderes del gremio) o deben solicitar la entrada
• Selecciona "Looking for Beginners" si tu gremio es apto para principiantes
• Tras especificar los Languages, Active Times, Home City y Activities de tu gremio, baja y haz clic en Settings para establecer los requisitos mínimos que los jugadores deben cumplir para unirse al gremio
• En el campo Discord, introduce la última parte del enlace de invitación del servidor de Discord de tu gremio; no incluyas la barra (/) delante
• Puedes introducir tu propio texto en el campo Guild Description, que aparecerá a los posibles miembros cuando hagan clic en el escudo de tu gremio en el Guild Finder
• Puedes usar New Member Mail para crear un mensaje de bienvenida que se enviará por correo dentro del juego a los nuevos miembros en cuanto se unan', 'https://albiononline.com/guides/article/guild-finder+106', false, array['https://assets.albiononline.com/uploads/media/default/media/64684567a487dec5d046faaa21d66431184f4b57.png']::text[]);
end
$IMPERIUM$;

-- [18] caerleon-black-market
do $IMPERIUM$
declare
  v_game uuid;
  v_guide uuid;
begin
  select id into v_game from public.games where slug = 'albion-online';
  if v_game is null then
    raise exception 'IMPERIUM: juego no encontrado: %', 'albion-online';
  end if;

  -- Reemplazo idempotente. OJO: borra los pasos -> reinicia step_progress de esta guía.
  delete from public.guide_steps where guide_id in (
    select id from public.guides where game_id = v_game and slug = 'caerleon-black-market');
  delete from public.guides where game_id = v_game and slug = 'caerleon-black-market';

  insert into public.guides
    (game_id, slug, title, description, order_index, is_published, intro_title, intro, intro_images)
  values
    (v_game, 'caerleon-black-market', 'Caerleon y el Black Market', 'Aprovecha las muchas oportunidades que ofrece esta ciudad de mala fama.', 18, false, null, '', array['https://assets.albiononline.com/uploads/media/default/media/4777cd72af6bb42a209ed9c69a5e153f10a40779.jpeg']::text[])
  returning id into v_guide;

  insert into public.guide_steps
    (guide_id, order_index, title, content, source_url, is_verified, images)
  values
    (v_guide, 1, 'Qué es Caerleon', 'En medio del Royal Continent se encuentra la ciudad de Caerleon. Lo que en su día fue una ciudad próspera antes de que los avalonianos atacaran, es ahora una guarida de bandidos y comerciantes de dudosa reputación.

La ciudad está situada en el centro del Royal Continent, completamente rodeada por las Red Zones de Albion, que ofrecen muchas oportunidades para crafters, transportistas y gankers. Cuatro de las salidas de la ciudad conducen directamente a esas zonas, mientras que un turbio Underway (que es a su vez una Red Zone) conecta la ciudad con otro grupo de cuatro zonas.

La ciudad en sí ofrece la mayoría de las características clave de todas las Royal Cities:

• Un Marketplace y un Bank
• Una Repair Station, una Artifact Foundry y City Plots y Crafting Stations propiedad de los jugadores
• Un Island Merchant y un Travel Planner
• Un Energy Manipulator, un Expedition Master y Faction Enlistment

Sin embargo, no dispone de un Realmgate operativo y, por tanto, no tiene conexión con las Outlands. El Fast Travel a Caerleon está restringido, y solo se permite sin ningún equipamiento y con el inventario vacío. Esto obliga a los jugadores a transportar a través de las peligrosas Red Zones.

El incentivo para hacerlo proviene del misterioso comerciante del Black Market, que ha establecido su negocio en la ciudad. Más sobre él más abajo.', 'https://albiononline.com/guides/article/caerleon-and-the-black-market+104', false, array['https://assets.albiononline.com/uploads/media/default/media/031993f7c691bc7b91b40d00c95a473faeaa9450.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/d08209d2a5a80fc467b65c1e8127d47546145379.jpeg']::text[]),
    (v_guide, 2, 'Bonificaciones', 'Caerleon, como cualquier otra ciudad, ofrece varias bonificaciones de producción locales. Además de algunas bonificaciones de cultivo, la ciudad ofrece tasas de retorno (return rates) mejoradas para:

• Shapeshifter Staffs
• War Gloves
• Gathering Gear
• Tools
• Food

Ten en cuenta que Caerleon es la única ciudad que proporciona tasas de retorno mejoradas para Food como consumible, un producto crucial que casi todos los jugadores necesitan.

A diferencia de otras ciudades del Royal Continent, no tiene una tasa mejorada para refinar recursos específicos. Esto significa que los materiales suelen ser más caros en Caerleon. Para ti esto significa lo siguiente: merece la pena transportar materiales o artículos fabricados a Caerleon y venderlos allí con un buen beneficio.', 'https://albiononline.com/guides/article/caerleon-and-the-black-market+104', false, array['https://assets.albiononline.com/uploads/media/default/media/ba1273ce11f7da0847dc66e903d722dbf7a95077.jpeg']::text[]),
    (v_guide, 3, 'Faction Warfare', 'Cuando se trata de Faction Warfare, Caerleon juega un papel especial. Los jugadores que se alistan (flag) por Caerleon no solo pueden atacar a jugadores de otras facciones, sino también a otros jugadores alistados por Caerleon, siempre que no estén en grupo con ellos.

Bandit Assault

El evento Bandit Assault tiene lugar varias veces al día, en las Red Zones alrededor de Caerleon.

• Cada Bandit Assault dura una hora
• Quince minutos antes del evento, una ventana emergente avisa a todos los jugadores alistados a una facción de que el asalto está a punto de comenzar, y aparece una cuenta atrás en la esquina superior derecha del World Map
• Al inicio del evento, todos los Outposts de las Red Zones son tomados por la facción de Caerleon
• Los jugadores de las facciones de las Royal Cities luchan entonces por recuperar tantas zonas como sea posible para recibir recompensas adicionales muy valiosas
• Aunque los jugadores alistados por Caerleon no pueden luchar por tomar los Outposts, sí pueden aprovechar el ajetreo para emboscar y matar a miembros de las otras facciones
• Al final del evento, recibes una cantidad de Faction Points determinada por tu contribución y el rango de tu facción en comparación con las facciones de las otras ciudades', 'https://albiononline.com/guides/article/caerleon-and-the-black-market+104', false, array['https://assets.albiononline.com/uploads/media/default/media/693175179e0fd0c2de1a68392c1984b4042e865c.jpeg']::text[]),
    (v_guide, 4, 'El Black Market', '¿Alguna vez te has preguntado de dónde sale el botín de los cofres y los mobs? ¿O por qué hay tantos jugadores transportando y gankeando en los caminos hacia Caerleon? La respuesta a ambas preguntas es el Black Market.

El Black Market es un Marketplace independiente en la parte occidental de Caerleon, que compra todos los tiers, niveles de calidad y encantamientos de equipo de los jugadores y los distribuye directamente a los cofres y al botín de los mobs por todo Albion. Por esta razón, todos los objetos que sueltan los mobs al matarlos están fabricados por jugadores (player-crafted).

Aquí tienes una explicación rápida de cómo funciona:

• Un jugador genera Silver al matar un mob o abrir un cofre
• El juego deduce una parte de la Silver y la envía al comerciante del Black Market
• El juego comprueba entonces una enorme tabla de botín en busca de posibles drops:
• Si un objeto está actualmente en stock, es decir, que se vendió recientemente al Black Market, caerá como botín
• Si no, el comerciante del Black Market usará su Silver para aumentar el valor de su orden de compra (buy order) de ese objeto
• Esta orden de compra aumenta hasta que alcanza el valor de una orden de venta (sell order) existente en el Black Market
• Cuando esto sucede, el comerciante del Black Market compra el objeto, y este pasa a poder caer como botín

Puedes vender objetos en el Black Market directamente o mediante sell orders. La mayoría de los jugadores aconsejan consultar la pestaña principal (Buy Orders) del Black Market y buscar los objetos que intentan vender. Luego puedes vender objetos directamente con el botón "Sell now" cuando estés conforme con el precio. Como alternativa, puedes crear una sell order para ese objeto, en cuyo caso se venderá automáticamente cuando se alcance tu precio de venta.

Las Tools (excepto el skinning knife) y el Gathering Gear no se pueden vender en el Black Market. No es posible comprar nada en el Black Market.

El Black Market compra cantidades enormes de objetos, a menudo a precios más altos que los Marketplaces de otras ciudades, lo que hace que vender al Black Market sea una actividad muy rentable para crafters y transportistas espabilados. Los tiers y encantamientos bajos se piden más que los productos de gama alta, y los objetos de calidad normal tienen más demanda que los de alta calidad. No tienes que preocuparte por tener un objeto de mayor calidad que el que se está pidiendo, ya que siempre puedes vender objetos por sus versiones de menor calidad.

Sin embargo, no todos los objetos acabarán en el inventario de un jugador. El comerciante del Black Market retira una parte de los objetos vendidos, lo que actúa como un sumidero de objetos (item sink).

Los drops del Black Market conservan el nombre de su crafter, así que cuando recibas uno como botín, ¡ya sabes a quién dar las gracias!', 'https://albiononline.com/guides/article/caerleon-and-the-black-market+104', false, array['https://assets.albiononline.com/uploads/media/default/media/3b3c8eee12c2dec02ea4f8c0fbd5d2518dad761f.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/7ec69ca63451d49d1cd8ae7967cf652055f594a8.jpeg']::text[]);
end
$IMPERIUM$;

-- [19] guild-seasons
do $IMPERIUM$
declare
  v_game uuid;
  v_guide uuid;
begin
  select id into v_game from public.games where slug = 'albion-online';
  if v_game is null then
    raise exception 'IMPERIUM: juego no encontrado: %', 'albion-online';
  end if;

  -- Reemplazo idempotente. OJO: borra los pasos -> reinicia step_progress de esta guía.
  delete from public.guide_steps where guide_id in (
    select id from public.guides where game_id = v_game and slug = 'guild-seasons');
  delete from public.guides where game_id = v_game and slug = 'guild-seasons';

  insert into public.guides
    (game_id, slug, title, description, order_index, is_published, intro_title, intro, intro_images)
  values
    (v_game, 'guild-seasons', 'Guild Seasons', '¡Conquista Albion con tu gremio y obtén valiosas recompensas!', 19, false, null, 'Ser miembro de un gremio tiene muchos beneficios, y la colaboración es clave en Albion Online. Unirte a un gremio te permite participar en la Guild Warfare, encontrar jugadores para actividades de grupo, disfrutar de la seguridad de los Hideouts y los Territorios, así como avanzar y mejorar tu Conqueror''s Challenge con más facilidad.', array['https://assets.albiononline.com/uploads/media/default/media/cce8b5e9ab7439b9ba58a0be0f6be676744087ce.jpeg']::text[])
  returning id into v_guide;

  insert into public.guide_steps
    (guide_id, order_index, title, content, source_url, is_verified, images)
  values
    (v_guide, 1, 'Guild Warfare', 'Durante las Guild Seasons, los jugadores pueden colaborar con su gremio para conquistar y asaltar territorios, tomar castles y participar en diversos desafíos con el fin de ganar Season Points que beneficiarán tanto al gremio en su conjunto como a sus miembros individuales.', 'https://albiononline.com/guides/article/guild-seasons+100', false, array['https://assets.albiononline.com/uploads/media/default/media/3f8dc5923ab1b70f3f075eb990ce0e80011cfc35.jpeg']::text[]),
    (v_guide, 2, 'Estructura de la temporada', 'Cada Guild Season dura aproximadamente 8 semanas y se puede dividir en 2 segmentos de 4 semanas cada uno, delimitados por los Invasion Days. Durante estos, todos los territorios se vuelven neutrales y deben reconquistarse, y los gremios necesitan derribar a un Territory Guardian para reclamar una Territory Tower para sí mismos.

Fuera de los Invasion Days, los territorios pueden ser asaltados y se les pueden declarar ataques durante su prime time, que depende de su región. El prime time dura una hora, al final de la cual un porcentaje de la Raw Energy y la Siphoned Energy de un territorio se convierte en Season Points.

La primera parte de la temporada otorga puntos normales, mientras que los Season Points de territorio se duplican durante las cuatro semanas finales.', 'https://albiononline.com/guides/article/guild-seasons+100', false, array['https://assets.albiononline.com/uploads/media/default/media/012a0d918a277247c6f5e96aa0e9f6a9fbb86aef.jpeg']::text[]),
    (v_guide, 3, 'Ganar Season Points', 'Los Season Points se pueden generar a través de muchos tipos distintos de contenido. Incluso un gremio que no posee territorios o que no se centra en el PvP puede escalar lo suficiente como para declarar su propio Headquarters.

Territorios

Mantener territorios como gremio es una gran manera de generar muchos Season Points. Tras capturar un territorio en un Invasion Day o después de un ataque exitoso, puedes subirlo de nivel usando Power Crystals. Los territorios de nivel más alto generan más puntos, mientras que la calidad de la región amplifica este efecto.

Si tu gremio forma parte de una alianza, los Season Points obtenidos de los territorios se compartirán con ella. El 50% de todos los puntos van directamente a tu gremio, mientras que el 50% restante se reparte entre todos los demás gremios de la alianza, incluido el tuyo.

Mantener muchos territorios como gremio o alianza también aumenta el Control Cost. Si este número supera 15, se aplica un Siphoned Energy Drain, y si supera 25, todos los miembros individuales se enfrentan a penalizaciones de Fame y Silver.

Guild Might Levels

Los Guild Might Levels permiten que cada miembro del gremio contribuya al esfuerzo del gremio a través de distintas actividades. Cada nivel alcanzado otorga directamente al gremio una cierta cantidad de Season Points.

Si estás en un gremio y quieres consultar su progreso, puedes hacerlo dentro de la Guild UI.

Guild Challenge

La Guild Challenge es una herramienta adicional para que los jugadores aporten Season Points. Puedes subirla de nivel adquiriendo Challenge Points. Estos se pueden obtener matando mobs, recolectando o pescando, y son idénticos a los que se usan para progresar en el Adventurer''s Challenge. Los puntos de bonificación diarios no cuentan para la Guild Challenge.', 'https://albiononline.com/guides/article/guild-seasons+100', false, array['https://assets.albiononline.com/uploads/media/default/media/5ffec00240bd0b3a970a012385d0d87e281fc872.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/1957905f0fe184f22f277148f99ca4f81e0d61ea.jpeg']::text[]),
    (v_guide, 4, 'Beneficios para el gremio', 'Los gremios pueden hacerse un nombre conquistando y manteniendo numerosos objetivos en las Outlands, mientras escalan en los season rankings. Esto aumenta su visibilidad de cara a nuevos miembros y otorga valiosas recompensas.

Controlar territorios genera Siphoned Energy, que actúa como un ingreso pasivo para los gremios. Los gremios pueden usar Silver para lanzar ataques sobre territorios enemigos, mejorar la infraestructura del gremio, o dar regears u otros beneficios a sus miembros. Cuantos más Season Points consiga un gremio, mejor será la ubicación en la que podrá declarar un Headquarters Hideout. Los Headquarters Hideouts son una forma especial de Hideout que se vuelve invulnerable a los ataques enemigos siempre que reciba suficiente energía de los Power Cores.

Aquí tienes un resumen de cuántos Season Points necesitas para declarar un Headquarters en distintas regiones:

• 200.000: Quality 6 / Tier 8
• 120.000: Quality 5 / Tier 8
• 80.000: Quality 4 / Tier 8
• 40.000: Quality 3 / Tier 7
• 20.000: Quality 3 / Tier 6
• 10.000: Quality 1 / Tier 6
• 1.000: Roads of Avalon', 'https://albiononline.com/guides/article/guild-seasons+100', false, array['https://assets.albiononline.com/uploads/media/default/media/ceb9a504e99e716a6579a2d537541fdc98f73cec.jpeg']::text[]),
    (v_guide, 5, 'Beneficios para los miembros del gremio', 'Los jugadores pueden obtener una serie de recompensas participando activamente en las actividades del gremio. Si el gremio posee Hideouts o territorios, pueden usar Power Cores y Power Crystals para subir de nivel sus Hideouts y territorios respectivamente, ganando al mismo tiempo una cantidad significativa de Might para su Conqueror''s Challenge personal, y obtener Favor para comprar objetos adicionales en el Energy Manipulator.

Poseer territorios y Hideouts como gremio también proporciona seguridad a tus miembros. Aquí pueden reunirse, almacenar su equipo o buscar refugio de un grupo enemigo. Subir de nivel un Hideout usando Power Cores también aumenta la tasa de retorno de recursos de los objetos fabricados allí, lo que es una gran forma de que los crafters aumenten sus márgenes de beneficio.

Además, escalar en los rankings de gremios mejorará tu Conqueror''s Chest personal dentro de la Conqueror''s Challenge.

Cuando un territorio genera Siphoned Energy, todos los miembros del gremio también recibirán un bonus diario de Might que pueden reclamar en la interfaz de la Conqueror''s Challenge.', 'https://albiononline.com/guides/article/guild-seasons+100', false, array['https://assets.albiononline.com/uploads/media/default/media/3db493578e1fb6cc45e619029230b22d1ca2fe52.jpeg']::text[]),
    (v_guide, 6, 'Recompensas personales', 'También puedes ganar Might y Favor cuando juegas activamente y participas en las actividades del gremio. El Might se usa para progresar en la Conqueror''s Challenge, que se puede ver en la Activities UI. Avanzar en tu Conqueror''s Challenge desbloqueará un Small, Medium o Grand Conqueror''s Chest, cada uno más valioso. Además, si tu gremio alcanza un rango más alto, también mejorará el Conqueror''s Chest, lo que amplía y aumenta las recompensas.

El Might se gana mediante actividades en lethal areas, incluyendo objetivos de gremio, PvE, recolección, Hellgates y más. También se gana algo de Might cuando tu gremio sube de nivel dentro de un tramo de temporada (season bracket).

El Favor se puede usar en el Energy Manipulator para comprar diversos objetos como Tomes of Insight, Siphoned Energy o Avalonian Crests. El Favor se gana de actividades que otorgan Might pero que no llevan botín directo asociado, como Power Crystals, Power Cores o algunas actividades de PvE. Además, puedes ganar Favor por cada 5.000, 10.000 y 15.000 de Might obtenidos cada semana.

Los gremios juegan un papel central en el mundo de Albion, así que si te interesa unirte a uno, ¡puedes usar el Guild Finder para encontrar uno y comenzar tu misión de conquistar Albion!', 'https://albiononline.com/guides/article/guild-seasons+100', false, array['https://assets.albiononline.com/uploads/media/default/media/df1d2b6bc19e96e5bd597d41e3a3e242b245f566.jpeg']::text[]);
end
$IMPERIUM$;

-- [20] potions-and-alchemy
do $IMPERIUM$
declare
  v_game uuid;
  v_guide uuid;
begin
  select id into v_game from public.games where slug = 'albion-online';
  if v_game is null then
    raise exception 'IMPERIUM: juego no encontrado: %', 'albion-online';
  end if;

  -- Reemplazo idempotente. OJO: borra los pasos -> reinicia step_progress de esta guía.
  delete from public.guide_steps where guide_id in (
    select id from public.guides where game_id = v_game and slug = 'potions-and-alchemy');
  delete from public.guides where game_id = v_game and slug = 'potions-and-alchemy';

  insert into public.guides
    (game_id, slug, title, description, order_index, is_published, intro_title, intro, intro_images)
  values
    (v_game, 'potions-and-alchemy', 'Pociones y Alquimia', 'Las pociones consumibles de Albion Online aportan muchos beneficios tanto en PvP como en PvE.', 20, false, null, 'Las pociones son consumibles equipables que aplican buffs o debuffs temporales al usarse. Hay un total de 14 pociones disponibles, cada una con una habilidad única. Las pociones ofrecen opciones defensivas, ofensivas y diversas utilidades para ayudarte en tus aventuras por Albion Online.

En el siguiente artículo explicaremos cómo obtener y fabricar pociones, cómo usarlas, qué efectos tienen y para qué pueden servir.', array['https://assets.albiononline.com/uploads/media/default/media/ddb45a101177fa045906c34fbacc0f0d45a7a77a.jpeg']::text[])
  returning id into v_guide;

  insert into public.guide_steps
    (guide_id, order_index, title, content, source_url, is_verified, images)
  values
    (v_guide, 1, 'Cómo obtener pociones', 'Las pociones se pueden fabricar en el Alchemist''s Lab, o comprar a través del Marketplace o mediante un intercambio directo.

Para fabricar una poción necesitarás los materiales necesarios y tener desbloqueado el nodo de Alchemist en el Destiny Board para el tier correspondiente.

Fabricar pociones implica una variedad de ingredientes cultivados, principalmente hierbas, aunque algunas pueden incorporar componentes de origen animal o brebajes alquímicos. Para varias pociones potentes, puede que necesites ingredientes alquímicos raros que se obtienen mediante Tracking.

Para amplificar aún más los efectos de estas pociones, se pueden encantar con Arcane Extracts.

Cabe destacar que las pociones fabricadas vienen en lotes de cinco, lo que asegura que los crafters de pociones puedan producir un suministro considerable.', 'https://albiononline.com/guides/article/potions-and-alchemy+101', false, array['https://assets.albiononline.com/uploads/media/default/media/682cb4c49dd73cb8211b6a77ca9ae7a205b6a190.jpeg']::text[]),
    (v_guide, 2, 'Cómo se usan las pociones', 'Las pociones deben equiparse en la ranura inferior izquierda de tu inventario, y un personaje puede llevar hasta diez de ellas a la vez. Para usar una poción, tendrás que usar su atajo de teclado (hotkey) o hacer clic/tocar el icono de la poción.

Mientras que muchas pociones funcionan sobre ti mismo, algunas tienen como objetivo a otros jugadores o un área del suelo.', 'https://albiononline.com/guides/article/potions-and-alchemy+101', false, array[]::text[]),
    (v_guide, 3, 'Pociones disponibles', 'Las Healing Potions regeneran una parte de la salud de un jugador durante un breve periodo de tiempo, aumentando la cantidad de curación con el tier y el encantamiento. Estas pociones se usan a menudo en combate 1v1 y PvE.

Las Energy Potions restauran una parte de la energía de un jugador directamente, a la vez que regeneran energía adicional y proporcionan un buff a las tasas de cooldown durante un breve periodo de tiempo. Todos estos efectos aumentan con el tier y el encantamiento. Las usan a menudo los jugadores con armas de curación en peleas a pequeña escala o en Arenas.

Las Gigantify Potions permiten a un jugador aumentar temporalmente su salud máxima y su Max Load, a la vez que lo hacen inmune a los efectos de movimiento forzado. La potencia de estos efectos aumenta con el tier y el encantamiento. Se utilizan con frecuencia como opción defensiva en peleas a gran escala.

Las Resistance Potions mejoran brevemente las estadísticas defensivas de un jugador y su resistencia al control de masas (crowd control), escalando estos efectos con el tier y el encantamiento de la poción. Son valiosas en diversos contextos, desde pequeñas escaramuzas hasta enfrentamientos a mayor escala.

Las Sticky Potions son pociones arrojables que crean una brea pegajosa en el suelo. Los jugadores enemigos quedan ralentizados y su daño se reduce durante cinco segundos, mientras que los enemigos invisibles que entren en el área quedarán revelados. Los tiers y encantamientos más altos aumentan los efectos de ralentización y debuff. Estas pociones se pueden usar en distintos tipos de contenido, tanto como opción ofensiva como defensiva.

Las Poison Potions son una poción dirigida que se puede arrojar sobre un jugador, infligiéndole daño verdadero (true damage) durante un periodo de cuatro segundos. La cantidad de daño aumenta con cada tier. Se pueden usar en combate PvP a pequeña escala, ganking y PvE.

Las Invisibility Potions vuelven invisible al lanzador durante una breve duración, a la vez que reducen su daño. Estas pociones solo están disponibles como Tier 8, pero se pueden encantar para aumentar su duración. Las pociones de invisibilidad se usan a menudo al emboscar o al escapar de una pelea.

Las Calming Potions te hacen invisible para los mobs durante un breve tiempo, lo que se puede usar para quitarles la agresión (de-aggro). Las versiones de tier más alto son arrojables y pueden afectar a varios jugadores, lo que las hace útiles para reiniciar pulls en contenido PvE.

Las Cleansing Potions eliminan todos los efectos de control de masas del lanzador, incluyendo aturdimientos (stuns), raíces (roots), silencios y debuffs (excepto el daño con el tiempo). Las pociones de Tier 5 y 7 otorgan además inmunidad a los efectos de control de masas durante un breve tiempo. Pueden ser efectivas en diversas situaciones.

Las Acid Potions se pueden arrojar al suelo para reducir las resistencias de los enemigos durante cinco segundos. La cantidad de resistencia perdida aumenta con el tier y el encantamiento. Se pueden usar para amplificar el daño infligido a los objetivos enemigos.

Las Berserk Potions otorgan un buff al lanzador que aumenta su daño a la vez que reduce su defensa. Ambos efectos escalan con el tier y el encantamiento de la poción. Esta poción es buena en escenarios de PvP en los que planeas repartir mucho daño.

Las Hellfire Potions son pociones arrojables que crean un fuego en el suelo, infligiendo daño a los jugadores y mobs que se encuentren en él cada 0,5 segundos durante hasta 3 segundos. Este daño aumenta con el tier y el encantamiento. Sirven como fuente de daño adicional tanto en contenido PvP como PvE.

Las Gathering Potions aumentan la velocidad de recolección y de pesca, así como el rendimiento de estas actividades. Las versiones de tier más alto y encantadas funcionan durante más tiempo. Esta poción se puede usar al recolectar valiosos recursos encantados, para aumentar la rentabilidad.

La Tornado in a Bottle es una poción arrojable que crea un tornado en una posición determinada que empuja lejos a todos los jugadores enemigos. La duración del tornado escala con el tier y el encantamiento. Se puede usar para proteger a ciertos jugadores de los ataques cuerpo a cuerpo.', 'https://albiononline.com/guides/article/potions-and-alchemy+101', false, array['https://assets.albiononline.com/uploads/media/default/media/6355110afd3379e4b83405052e1e92bbdf083de5.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/09e037d9f6d0a743b2fe49ffd3082d4962502a48.jpeg']::text[]);
end
$IMPERIUM$;

-- [21] basic-builds-dual-swords
do $IMPERIUM$
declare
  v_game uuid;
  v_guide uuid;
begin
  select id into v_game from public.games where slug = 'albion-online';
  if v_game is null then
    raise exception 'IMPERIUM: juego no encontrado: %', 'albion-online';
  end if;

  -- Reemplazo idempotente. OJO: borra los pasos -> reinicia step_progress de esta guía.
  delete from public.guide_steps where guide_id in (
    select id from public.guides where game_id = v_game and slug = 'basic-builds-dual-swords');
  delete from public.guides where game_id = v_game and slug = 'basic-builds-dual-swords';

  insert into public.guides
    (game_id, slug, title, description, order_index, is_published, intro_title, intro, intro_images)
  values
    (v_game, 'basic-builds-dual-swords', 'Builds básicas: Dual Swords', 'Echa un vistazo a nuestra build sugerida para esta arma a dos manos.', 21, false, null, 'Bienvenido a otra de nuestras guías de Basic Builds para jugadores de nivel principiante a intermedio. Cada guía presenta una build sugerida y describe cómo funcionan sus habilidades en conjunto. Puedes probarlas tal cual, o usarlas como punto de partida para crear tus propias builds.', array['https://assets.albiononline.com/uploads/media/default/media/dd34e42ba32c04596710d6b4f60bc232cbb54f3d.jpeg']::text[])
  returning id into v_guide;

  insert into public.guide_steps
    (guide_id, order_index, title, content, source_url, is_verified, images)
  values
    (v_guide, 1, 'Características', 'Esta build se basa en las Dual Swords, un arma de guerrero a dos manos con gran movilidad que inflige daño constante y aplica Heroic Charges.

¡Aquí tienes el desglose completo!', 'https://albiononline.com/guides/article/basic-builds-dual-swords+98', false, array[]::text[]),
    (v_guide, 2, 'Equipo y habilidades utilizadas', 'Adept''s Dual Swords

• Heroic Strike/Heroic Cleave: Puedes elegir entre dos hechizos para la ranura Q, uno para objetivos individuales y otro para daño en área. Ambos te aplican Heroic Charges.
• Blade Cyclone: Giras en una dirección marcada, infligiendo daño a los enemigos que atraviesas. Si hay al menos una Heroic Charge activa, inflige más daño a la vez que consume una carga.
• Spinning Blades: Tu habilidad principal realiza un dash en una dirección marcada, volviéndote inmune a los efectos de control de masas hasta el impacto. Inflige daño al impactar y aumenta tu velocidad de ataque y el daño de tus ataques automáticos durante tres segundos si golpea al menos a un enemigo.

Adept''s Mage Cowl

• Firebreath: Tu Cowl tiene un hechizo ofensivo que prende fuego brevemente a los enemigos en un pequeño cono frente a ti.

Adept''s Mercenary Jacket

• Bloodlust: La habilidad activa de esta chaqueta te permite recuperar algo de vida cada vez que haces un ataque automático o lanzas un hechizo de daño.

Adept''s Soldier Boots

• Rejuvenating Sprint: La habilidad activa de tus botas es un sprint que además te cura ligeramente.

Adept''s Bag: Aumenta la capacidad de carga de peso.

Adept''s Cape: Aumenta la Energy y la regeneración pasiva de Energy.

Minor Poison Potion: Inflige un efecto de daño en el tiempo a los objetivos y reduce sus resistencias mientras dura.

Roast Pork: Recupera vida en función del daño que infliges.

Journeyman''s Riding Horse: Te lleva rápidamente por el mapa a la vez que añade más capacidad de carga.', 'https://albiononline.com/guides/article/basic-builds-dual-swords+98', false, array['https://assets.albiononline.com/uploads/media/default/media/0718fc4ea69bf3651751deb9ebc84e090f2514b6.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/52116ecf8169ce671f83c16487e4f0539613c24a.jpeg']::text[]),
    (v_guide, 3, 'Pros y contras', 'Pros:

• Movilidad muy alta
• Muchos buffs que potencian tus ataques básicos y habilidades
• Buena velocidad de limpieza
• Build viable para 1v1 y duelos
• Económica

Contras:

• La mayoría de las habilidades W situacionales se desbloquean a niveles más altos
• Depende mucho de mantenerte pegado a los objetivos
• No es adecuada para combates a gran escala', 'https://albiononline.com/guides/article/basic-builds-dual-swords+98', false, array['https://assets.albiononline.com/uploads/media/default/media/e0a28b1487e4e4e4a378d3d3a65aaddec5f8cd16.jpeg']::text[]),
    (v_guide, 4, 'Estilo de juego', '• Tu ranura Q ofrece la elección entre una habilidad de objetivo único y una habilidad de área. La habilidad de objetivo único es mejor en escenarios 1v1, mientras que la de área inflige daño a todos los objetivos dentro de alcance. Ambas habilidades aplican una Heroic Charge, mientras que golpear a tres o más objetivos con Heroic Cleave aplica dos cargas.
• Las Heroic Charges aumentan tu velocidad de movimiento y de ataque. Puedes tener un máximo de tres cargas a la vez. Muchas habilidades de Sword pueden usar Heroic Charges para potenciar sus efectos.
• La habilidad W te permite girar en una dirección marcada, y puede infligir daño en tres instancias. El daño puede aumentarse aún más consumiendo una Heroic Charge. Es una gran herramienta para reposicionarte durante un encuentro con enemigos a la vez que repartes daño.
• Tu habilidad principal, con su dash de largo alcance, te permite esquivar y atravesar habilidades de control de masas mientras infliges daño y potencias tus ataques básicos durante tres segundos. No utiliza Heroic Charges, pero con su bonificación de velocidad de ataque y daño funciona bien con las Heroic Charges de todos modos, potenciando aún más tus ataques automáticos.
• El cowl tiene un hechizo de daño adicional que ayuda a derribar rápidamente grupos de enemigos.
• La chaqueta puede usarse para recuperar vida. Se usa mejor en combinación con tu habilidad W o con el aumento de velocidad de ataque de la habilidad E.
• Tus botas tienen una habilidad de sprint que puede recuperar rápidamente una pequeña porción de vida a la vez que proporciona mayor velocidad de movimiento.
• Un encuentro con enemigos debería verse más o menos así:
  • Usa tu Q para iniciar el combate y ganar Heroic Charges. Repite hasta tener al menos dos cargas.
  • Usa tu W para infligir daño o cambiar de posición.
  • Usa tu E cuando necesites esquivar una habilidad de control de masas, o cuando tengas tres Heroic Charges para maximizar el daño de tus ataques automáticos posteriores.
  • Usa tu chaqueta en combinación con tus habilidades de área o con la velocidad de ataque potenciada cuando tengas poca vida.', 'https://albiononline.com/guides/article/basic-builds-dual-swords+98', false, array['https://assets.albiononline.com/uploads/media/default/media/ab615a1ba4017ca43b010ea329f6cf5edcca7ef5.jpeg']::text[]);
end
$IMPERIUM$;

-- [22] basic-builds-arcane-staff
do $IMPERIUM$
declare
  v_game uuid;
  v_guide uuid;
begin
  select id into v_game from public.games where slug = 'albion-online';
  if v_game is null then
    raise exception 'IMPERIUM: juego no encontrado: %', 'albion-online';
  end if;

  -- Reemplazo idempotente. OJO: borra los pasos -> reinicia step_progress de esta guía.
  delete from public.guide_steps where guide_id in (
    select id from public.guides where game_id = v_game and slug = 'basic-builds-arcane-staff');
  delete from public.guides where game_id = v_game and slug = 'basic-builds-arcane-staff';

  insert into public.guides
    (game_id, slug, title, description, order_index, is_published, intro_title, intro, intro_images)
  values
    (v_game, 'basic-builds-arcane-staff', 'Builds básicas: Arcane Staff', 'Nuestra última guía echa un vistazo a esta arma de mago.', 22, false, null, 'Bienvenido a otra de nuestras guías de Basic Builds para jugadores de nivel principiante a intermedio.', array['https://assets.albiononline.com/uploads/media/default/media/13c24e0ed093bdc36248111f9ae00e2855ad91ff.png']::text[])
  returning id into v_guide;

  insert into public.guide_steps
    (guide_id, order_index, title, content, source_url, is_verified, images)
  values
    (v_guide, 1, 'Características', 'Esta build muestra el Arcane Staff, un arma de mago destacable por sus ataques en cadena, su daño constante y su movilidad.

¡Aquí tienes el desglose completo!', 'https://albiononline.com/guides/article/basic-builds-arcane-staff+97', false, array[]::text[]),
    (v_guide, 2, 'Equipo y habilidades utilizadas', 'Adept''s Arcane Staff

• Chain Missile: Un proyectil que golpea a un enemigo y luego salta hacia un máximo de dos objetivos adicionales. Inflige más daño al primer objetivo. Todos los enemigos golpeados reciben una Arcane Charge, que puede activarse con otras habilidades activas o con ataques automáticos para infligir daño adicional.
• Enigma Blade: Un ataque en área que inflige daño en un cono frente a ti. Si golpeas al menos a un enemigo, desbloqueas una segunda parte opcional que te permite teletransportarte una corta distancia.
• Arcane Orb: Lanzas un Arcane Orb que explota al impactar con el primer objetivo, infligiendo daño en un amplio radio a la vez que purga todos los buffs enemigos y silencia a los objetivos durante un breve tiempo.

Adept''s Scholar Cowl

• Energy Shield: Tu Cowl tiene un hechizo defensivo que reduce el daño que recibes a la vez que recupera energía por cada golpe recibido.

Adept''s Cleric Robe

• Everlasting Spirit: La habilidad activa de la túnica ofrece un escudo al recibir daño que te vuelve invulnerable y aumenta tu daño en un 20% durante 3 segundos.

Adept''s Soldier Boots

• Rejuvenating Sprint: La habilidad activa de tus botas es un sprint que además te cura ligeramente.

Adept''s Torch: Aumenta pasivamente la velocidad de ataque y reduce los tiempos de reutilización.

Adept''s Bag: Aumenta la capacidad de carga de peso.

Adept''s Cape: Aumenta la Energy y la regeneración pasiva de Energy.

Minor Poison Potion: Inflige un efecto de daño en el tiempo a los objetivos y reduce sus resistencias mientras dura.

Catfish: Comida buff que aumenta enormemente la regeneración de vida fuera de combate, devolviéndote a la vida completa rápidamente tras limpiar enemigos.

Journeyman''s Riding Horse: Te lleva rápidamente por el mapa a la vez que añade más capacidad de carga.', 'https://albiononline.com/guides/article/basic-builds-arcane-staff+97', false, array['https://assets.albiononline.com/uploads/media/default/media/341a6a80d08cdd3fa2fd8eb255b055c15804b683.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/14fad79d9a4c6c9872b607e390ac6184901c4d95.jpeg']::text[]),
    (v_guide, 3, 'Pros y contras', 'Pros:

• Buena velocidad de limpieza
• Movilidad e interrupciones
• Adecuada para combates a gran escala (aunque requeriría piezas de armadura diferentes)
• Económica

Contras:

• Build de baja defensa
• Problemas al luchar contra varios enemigos', 'https://albiononline.com/guides/article/basic-builds-arcane-staff+97', false, array['https://assets.albiononline.com/uploads/media/default/media/789d2a856723a18d1d4b9e4337d4a2d44a6bdaa9.jpeg']::text[]),
    (v_guide, 4, 'Estilo de juego', '• Tu hechizo Q inflige un daño considerable al primer objetivo que golpea, mientras encadena hacia dos objetivos adicionales con una cantidad de daño menor. Cada enemigo golpeado recibe una Arcane Charge.
• Las Arcane Charges pueden consumirse usando un ataque automático o una habilidad de daño directo como Enigma Blade o Arcane Orb.
• Tu habilidad W golpea a todos los enemigos en un cono frente a ti, infligiendo una buena cantidad de daño y consumiendo cualquier Arcane Charge para daño extra. Golpear al menos a un enemigo también desbloquea la habilidad combo Flicker, que te permite teletransportarte una corta distancia volviéndote brevemente invulnerable, pero aumentando el tiempo de reutilización de este hechizo.
• Tu habilidad E lanza un orbe en una dirección marcada, colisionando con el primer objetivo que golpea e infligiendo daño a su alrededor. Al purgar todos los buffs del objetivo y silenciarlo durante un breve tiempo, es una interrupción rápida y eficaz. También consume Arcane Charges para infligir daño adicional.
• La pasiva, Lingering Power, es una gran herramienta para maximizar tu daño, especialmente cuando luchas contra un solo objetivo. Cada vez que lanzas un hechizo, aumenta tu velocidad de ataque y tu alcance de ataque durante los siguientes tres ataques básicos. Como estás usando un hechizo Q con un tiempo de reutilización muy bajo, puedes usar esta pasiva para derribar rápidamente a enemigos duros.
• Cuando tengas poca Energy o necesites Energy extra, usa la habilidad de tu Cowl. Por cada golpe recibido recuperas algo de Energy a la vez que reduces en general el daño que recibes.
• La potente habilidad defensiva de la túnica puede usarse para evitar daño. Mientras recibas daño en la ventana de 1,5 segundos tras la activación, obtienes un escudo de invulnerabilidad que te vuelve inmune al daño a la vez que aumenta tu daño en un 20% durante 3 segundos.
• Tus botas ofrecen una habilidad de sprint que puede recuperar rápidamente una pequeña cantidad de vida, a la vez que proporciona mayor velocidad de movimiento.
• Un encuentro con enemigos debería verse más o menos así:
  • Lanza tu Q para infligir daño y aplicar Arcane Charges.
  • Usa tu W para consumir Arcane Charges.
  • Lanza tu Q de nuevo para volver a aplicar Arcane Charges.
  • Usa tu habilidad E para consumir esas cargas.
  • Relanza tu Q y consume Arcane Charges mediante ataques automáticos, hasta que tu W y tu E salgan del tiempo de reutilización de nuevo.
  • Cuando te enfrentes a un solo enemigo, alterna entre el hechizo Q y los ataques automáticos para máximo daño, usando la W y la E de forma situacional o cuando se necesite daño adicional.', 'https://albiononline.com/guides/article/basic-builds-arcane-staff+97', false, array['https://assets.albiononline.com/uploads/media/default/media/1b498f22add8652d36f73c486e2753c7eb06ce6f.jpeg']::text[]);
end
$IMPERIUM$;

-- [23] basic-builds-battleaxe
do $IMPERIUM$
declare
  v_game uuid;
  v_guide uuid;
begin
  select id into v_game from public.games where slug = 'albion-online';
  if v_game is null then
    raise exception 'IMPERIUM: juego no encontrado: %', 'albion-online';
  end if;

  -- Reemplazo idempotente. OJO: borra los pasos -> reinicia step_progress de esta guía.
  delete from public.guide_steps where guide_id in (
    select id from public.guides where game_id = v_game and slug = 'basic-builds-battleaxe');
  delete from public.guides where game_id = v_game and slug = 'basic-builds-battleaxe';

  insert into public.guides
    (game_id, slug, title, description, order_index, is_published, intro_title, intro, intro_images)
  values
    (v_game, 'basic-builds-battleaxe', 'Builds básicas: Battleaxe', 'Esta es la primera de nuestra serie de guías Basic Builds para jugadores de nivel principiante a intermedio.', 23, false, null, 'Esta es la primera de nuestra serie de guías Basic Builds para jugadores de nivel principiante a intermedio. Cada guía presenta una build sugerida y describe cómo funcionan sus habilidades en conjunto. Puedes probarlas tal cual, o usarlas como punto de partida para crear tus propias builds.', array['https://assets.albiononline.com/uploads/media/default/media/d414cc432a9c13b0a4951055617656eaa18a91d6.png']::text[])
  returning id into v_guide;

  insert into public.guide_steps
    (guide_id, order_index, title, content, source_url, is_verified, images)
  values
    (v_guide, 1, 'Características', 'Esta build se basa en la Battleaxe, que se caracteriza por una habilidad de auto-sostén llamada Blood Bandit que te permite lanzar tu hacha dos veces, infligiendo daño a la vez que te curas.

La build completa ofrece auto-curación adicional, una habilidad defensiva con recuperación de energía y movilidad adicional.

¡Aquí tienes el desglose completo!', 'https://albiononline.com/guides/article/basic-builds-battleaxe+88', false, array[]::text[]),
    (v_guide, 2, 'Equipo y habilidades utilizadas', 'Adept''s Battleaxe

• Rending Strike/Rending Spin: Puedes elegir entre dos hechizos para la ranura Q, uno para objetivos individuales y otro para daño en área. Ambos infligen daño y aplican acumulaciones de sangrado a tu(s) objetivo(s).
• Adrenaline Boost: Tu habilidad W ofrece modificadores de daño, velocidad de ataque y velocidad de movimiento que te ayudan a maximizar tu daño y a mantenerte pegado a tu objetivo.
• Blood Bandit: La habilidad principal te permite infligir daño adicional a distancia según la cantidad de acumulaciones de sangrado en tu objetivo. Es un combo de dos partes: el primer lanzamiento inflige más daño y el segundo te aplica una curación directa.

Adept''s Scholar Cowl

• Energy Shield: Tu cowl tiene un hechizo defensivo que reduce el daño que recibes a la vez que recupera energía por cada golpe recibido durante su tiempo activo.

Adept''s Mercenary Jacket

• Bloodlust: La habilidad activa de la chaqueta te permite recuperar algo de vida cada vez que usas un ataque automático o un hechizo de daño.

Adept''s Mercenary Shoes

• Refreshing Sprint: Tus zapatos te permiten dar caza a los objetivos a la vez que reducen tus tiempos de reutilización; también pueden usarse para huir de un combate.

Adept''s Shield: Un objeto de mano secundaria que aumenta pasivamente tus defensas y tu resistencia al control de masas.

Adept''s Bag: Un accesorio que aumenta pasivamente tu capacidad de carga de peso.

Adept''s Cape: Un accesorio que aumenta tu energía y la regeneración pasiva de energía.

Minor Poison Potion: Una poción que inflige un efecto de daño en el tiempo a un objetivo y reduce sus resistencias mientras dura.

Catfish: Comida buff que aumenta enormemente tu regeneración de vida fuera de combate. Esto te permite volver a la vida completa tras limpiar un grupo de enemigos.

Journeyman''s Riding Horse: Un caballo de montura que te lleva rápidamente por el mapa a la vez que añade más capacidad de carga pasiva.

Todos los objetos pueden comprarse a través del Marketplace, o fabricarse si se ha desbloqueado el nodo de fabricación correspondiente.', 'https://albiononline.com/guides/article/basic-builds-battleaxe+88', false, array['https://assets.albiononline.com/uploads/media/default/media/b7c514db6c71b8a706f2d2c9dfd067d5a08ea5c5.png', 'https://assets.albiononline.com/uploads/media/default/media/20e888c38b1d41a60495beb62ab38707678d4e19.png']::text[]),
    (v_guide, 3, 'Pros y contras de la build', 'Pros:

• Gran sostén contra enemigos fuertes
• Buena gestión de energía
• Buena velocidad de limpieza
• Buen potencial de persecución
• Económica

Contras:

• Los sangrados pueden mantenerte en combate durante un periodo prolongado
• No aplicable en combates a gran escala', 'https://albiononline.com/guides/article/basic-builds-battleaxe+88', false, array['https://assets.albiononline.com/uploads/media/default/media/132d8c7f255543971594a9b778e82094e6186a5b.jpeg']::text[]),
    (v_guide, 4, 'Estilo de juego', '• Usa tu hechizo Q para infligir daño directo y aplicar sangrados a tu(s) objetivo(s). Puedes usar ataques directos entre los hechizos.
• Tu habilidad W puede usarse para potenciar tu daño durante un breve periodo. También es una gran herramienta que te permite mantenerte pegado a tu objetivo, ya que su buff puede estar activo hasta 7 segundos mientras infligas daño directo a un objetivo.
• Blood Bandit puede usarse para infligir daño adicional, y el segundo lanzamiento puede usarse para recuperar algo de vida cuando los enemigos tienen varias acumulaciones de sangrado. Intenta usar esta habilidad antes de utilizar tu chaqueta.
• Cuando tengas poca energía o esperes recibir una cantidad mayor de daño, puedes usar la habilidad de tu casco. Por cada golpe recibido recuperarás algo de energía a la vez que reduces en general el daño que recibes.
• La chaqueta puede usarse para recuperar una cantidad considerable de vida. Tiene un tiempo de reutilización alto, por lo que se aconseja usarla en situaciones de emergencia. Por cada ataque automático o daño directo que inflijas te curarás una cierta cantidad, hasta 7 veces. Combinar esta habilidad con battle rush te permitirá curarte más rápido gracias a la bonificación de velocidad de ataque.
• Los zapatos son en general una herramienta de movilidad. Puedes usarlos para cerrar distancias o para crear distancia entre tú y el enemigo. Refreshing Sprint además reduce tus tiempos de reutilización, lo que te permite usar tus habilidades con más frecuencia.

¡Eso es todo por esta semana! Mantente atento a más guías de Basic Builds que llegarán pronto.', 'https://albiononline.com/guides/article/basic-builds-battleaxe+88', false, array['https://assets.albiononline.com/uploads/media/default/media/c0707c5a96af3bc55b8d29a328739542d7649fd5.jpeg']::text[]);
end
$IMPERIUM$;

-- [24] basic-builds-light-crossbow
do $IMPERIUM$
declare
  v_game uuid;
  v_guide uuid;
begin
  select id into v_game from public.games where slug = 'albion-online';
  if v_game is null then
    raise exception 'IMPERIUM: juego no encontrado: %', 'albion-online';
  end if;

  -- Reemplazo idempotente. OJO: borra los pasos -> reinicia step_progress de esta guía.
  delete from public.guide_steps where guide_id in (
    select id from public.guides where game_id = v_game and slug = 'basic-builds-light-crossbow');
  delete from public.guides where game_id = v_game and slug = 'basic-builds-light-crossbow';

  insert into public.guides
    (game_id, slug, title, description, order_index, is_published, intro_title, intro, intro_images)
  values
    (v_game, 'basic-builds-light-crossbow', 'Builds básicas: Light Crossbow', 'Nuestra segunda guía de build de combate se centra en esta arma de daño explosivo.', 24, false, null, 'Esta es la segunda guía de Basic Builds para jugadores de nivel principiante a intermedio. Cada guía presenta una build sugerida y describe sus habilidades. Puedes probarlas tal cual, o usarlas como punto de partida para crear las tuyas propias.', array['https://assets.albiononline.com/uploads/media/default/media/240de21634ced878ea0a6a4e2a393d1c9ed3e117.png']::text[])
  returning id into v_guide;

  insert into public.guide_steps
    (guide_id, order_index, title, content, source_url, is_verified, images)
  values
    (v_guide, 1, 'Características', 'Esta build se basa en la Light Crossbow, que cuenta con un fuerte daño explosivo que derriba rápidamente a pequeños grupos de enemigos.

Desglose completo:', 'https://albiononline.com/guides/article/basic-builds-light-crossbow+89', false, array[]::text[]),
    (v_guide, 2, 'Equipo y habilidades utilizadas', 'Adept''s Light Crossbow

• Explosive Bolt: Tu Q es una habilidad de daño en área con un tiempo de reutilización corto.
• Caltrops: Tu W lanza una trampa que reduce la velocidad del enemigo y aumenta la tuya.
• Exploding Shot: Esta habilidad E lanza una bomba sobre tu objetivo que explota tras una breve duración.

Adept''s Scholar Cowl

• Energy Shield: Tu Cowl tiene un hechizo defensivo que reduce el daño recibido y recupera energía por cada golpe recibido mientras está activo.

Adept''s Cleric Robe

• Everlasting Spirit: La habilidad activa de la túnica ofrece un escudo al recibir daño que te vuelve invulnerable y aumenta tu daño en un 20% durante 3 segundos.

Adept''s Soldier Boots

• Wanderlust: La habilidad activa de tus botas es una habilidad de movimiento con carga que te permite escapar de combates o dar caza a los objetivos.

Adept''s Shield: Aumenta pasivamente las defensas y la resistencia al control de masas.

Adept''s Bag: Aumenta la capacidad de carga de peso.

Adept''s Cape: Aumenta la Energy y la regeneración pasiva de Energy.

Minor Poison Potion: Inflige un efecto de daño en el tiempo a los objetivos y reduce sus resistencias mientras dura.

Catfish: Comida buff que aumenta enormemente la regeneración de vida fuera de combate, devolviéndote a la vida completa rápidamente tras limpiar enemigos.

Journeyman''s Riding Horse: Te lleva rápidamente por el mapa a la vez que añade más capacidad de carga.', 'https://albiononline.com/guides/article/basic-builds-light-crossbow+89', false, array['https://assets.albiononline.com/uploads/media/default/media/fd9fe3310925a0a958e4b531464de54a8d1f3d8b.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/b6041e16cc8e778d08fd945b552addc4f3bde09c.jpeg']::text[]),
    (v_guide, 3, 'Pros y contras de la build', 'Pros:

• Gran daño explosivo
• Velocidad de limpieza rápida
• Buena para grupos pequeños de PvE
• Económica

Contras:

• Sin movilidad adicional más allá del hechizo de las botas
• No es adecuada para combates a gran escala', 'https://albiononline.com/guides/article/basic-builds-light-crossbow+89', false, array['https://assets.albiononline.com/uploads/media/default/media/dec5eff53268e5e5301fcb6c7f35383c3ef77b5a.jpeg']::text[]),
    (v_guide, 4, 'Estilo de juego', '• Tu hechizo Q es tu herramienta básica. Con su bajo tiempo de reutilización y su alto daño base, es ideal para limpiar enemigos. Entre Qs puedes usar tu W, tu E o ataques automáticos.
• Tu habilidad W lanza una trampa que no inflige mucho daño pero ralentiza a los enemigos, a la vez que aumenta tu velocidad de movimiento. Tiene un tiempo de reutilización bajo, lo que permite usarla a menudo. (Este hechizo se desbloquea en Crossbows de nivel 15, así que es posible que tengas que derrotar a más enemigos antes de poder usarlo.)
• Tu habilidad E, Exploding Shot, es una buena habilidad de inicio que coloca una bomba en tu objetivo. Inflige poco daño inicial pero explota tras 2 segundos, infligiendo más daño en un radio mayor. Si el objetivo muere antes de la explosión, no inflige daño en área.
• Combinar estas habilidades con tu pasiva, Well-Prepared, desbloquea aún más potencial de daño. Para usarla eficazmente, usa tu Q como cuarto hechizo. Esto elimina inmediatamente su tiempo de reutilización y podrás usar la Q dos veces seguidas rápidamente. Como tu Q tiene un tiempo de reutilización corto y dispones de habilidades adicionales, puedes encadenar varias rotaciones de la pasiva rápidamente.
• Cuando tengas poca Energy o necesites Energy extra, usa la habilidad de tu Cowl. Por cada golpe recibido recuperas algo de Energy a la vez que reduces en general el daño que recibes.
• La potente habilidad defensiva de la túnica puede usarse para evitar daño. Mientras recibas daño en la ventana de 1,5 segundos tras la activación, obtienes un escudo de invulnerabilidad que te vuelve inmune al daño a la vez que aumenta tu daño en un 20% durante 3 segundos.
• Tus botas compensan tu falta de movilidad. Tienen una habilidad de carga que ofrece escape de los combates. Aunque te permite cubrir grandes distancias, tiene un tiempo de reutilización de 1 minuto.', 'https://albiononline.com/guides/article/basic-builds-light-crossbow+89', false, array['https://assets.albiononline.com/uploads/media/default/media/bcebfe213a89a89e82a70a79d6739002d3ac1088.jpeg']::text[]);
end
$IMPERIUM$;

-- [25] basic-builds-great-fire-staff
do $IMPERIUM$
declare
  v_game uuid;
  v_guide uuid;
begin
  select id into v_game from public.games where slug = 'albion-online';
  if v_game is null then
    raise exception 'IMPERIUM: juego no encontrado: %', 'albion-online';
  end if;

  -- Reemplazo idempotente. OJO: borra los pasos -> reinicia step_progress de esta guía.
  delete from public.guide_steps where guide_id in (
    select id from public.guides where game_id = v_game and slug = 'basic-builds-great-fire-staff');
  delete from public.guides where game_id = v_game and slug = 'basic-builds-great-fire-staff';

  insert into public.guides
    (game_id, slug, title, description, order_index, is_published, intro_title, intro, intro_images)
  values
    (v_game, 'basic-builds-great-fire-staff', 'Builds básicas: Great Fire Staff', 'La siguiente de nuestra serie de Basic Builds ofrece una configuración inicial para este bastón versátil.', 25, false, null, 'Bienvenido a otra de nuestras guías de Basic Builds para jugadores de nivel principiante a intermedio.', array['https://assets.albiononline.com/uploads/media/default/media/3457f3981094b29c26e786f82e53c26a318f85ae.png']::text[])
  returning id into v_guide;

  insert into public.guide_steps
    (guide_id, order_index, title, content, source_url, is_verified, images)
  values
    (v_guide, 1, 'Características', 'Esta build se basa en el Great Fire Staff, un bastón de magia con grandes hechizos de área de efecto, gran daño explosivo y efectos adicionales de daño en el tiempo.', 'https://albiononline.com/guides/article/basic-builds-great-fire-staff+90', false, array[]::text[]),
    (v_guide, 2, 'Equipo y habilidades utilizadas', 'Adept''s Great Fire Staff

• Burning Field: Tu Q dispara un orbe al suelo, infligiendo daño directo y daño adicional en el tiempo.
• Flame Blast: Tu Q prende fuego a un enemigo, lo que termina en una explosión tras un breve tiempo.
• Flame Pillar: Tu habilidad principal crea un pilar de llamas que daña a los enemigos en una amplia zona. Golpear al menos a un enemigo reducirá aún más el tiempo de reutilización del hechizo.

Adept''s Scholar Cowl

• Energy Shield: Tu Cowl tiene un hechizo defensivo que reduce el daño que recibes a la vez que recupera energía por cada golpe recibido.

Adept''s Cleric Robe

• Everlasting Spirit: La habilidad activa de la túnica ofrece un escudo al recibir daño que te vuelve invulnerable y aumenta tu daño en un 20% durante 3 segundos.

Adept''s Soldier Boots

• Wanderlust: La habilidad activa de tus botas es una habilidad de movimiento con carga que te permite escapar de combates o dar caza a los objetivos.

Adept''s Bag: Aumenta la capacidad de carga de peso.

Adept''s Cape: Aumenta la Energy y la regeneración pasiva de Energy.

Minor Poison Potion: Inflige un efecto de daño en el tiempo a los objetivos y reduce sus resistencias mientras dura.

Catfish: Comida buff que aumenta enormemente la regeneración de vida fuera de combate, devolviéndote a la vida completa rápidamente tras limpiar enemigos.

Journeyman''s Riding Horse: Te lleva rápidamente por el mapa a la vez que añade más capacidad de carga.', 'https://albiononline.com/guides/article/basic-builds-great-fire-staff+90', false, array['https://assets.albiononline.com/uploads/media/default/media/48c304c28d49e533b61f63b82ed4c418e69fa383.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/e98a5e9bad2cd64ac2f37e8f550d6cfd3ade328a.jpeg']::text[]),
    (v_guide, 3, 'Pros y contras', 'Pros:

• Velocidad de limpieza rápida
• Grandes hechizos de área de efecto
• Buena para grupos pequeños de PvE
• Buena para PvP a pequeña escala
• Económica

Contras:

• Sin movilidad adicional más allá del hechizo de las botas
• Tiempos de canalización y lanzamiento largos
• No es adecuada para combates a gran escala', 'https://albiononline.com/guides/article/basic-builds-great-fire-staff+90', false, array['https://assets.albiononline.com/uploads/media/default/media/23addec23c8311893100d1c228c80e6619164a27.png']::text[]),
    (v_guide, 4, 'Estilo de juego', '• Tu hechizo Q crea un campo de fuego que inflige daño al instante y cada 0,5 segundos a los enemigos que haya dentro; intenta mantener a los enemigos dentro el mayor tiempo posible.
• Debido a su tiempo de reutilización relativamente alto, tienes mucho tiempo para hacer kiting a los enemigos y aplicar ataques automáticos adicionales que, combinados con tu pasiva "Burn", infligen un daño considerable.
• Tu habilidad W prende fuego a los enemigos y les coloca una bomba. Tras 1,6 segundos explota e inflige daño en un radio de 5 m. Intenta colocarla sobre enemigos que estén cerca unos de otros para que todos reciban daño.
• Tu hechizo E funciona mejor como apertura, ya que te permite golpear a los enemigos mientras están quietos. Tiene un tiempo de reutilización relativamente corto que se reduce aún más al golpear al menos a un enemigo. Usa este hechizo lo más a menudo posible para maximizar el daño.
• Cuando tengas poca Energy o necesites Energy extra, usa la habilidad de tu Cowl. Por cada golpe recibido recuperas algo de Energy a la vez que reduces en general el daño que recibes.
• La potente habilidad defensiva de la túnica puede usarse para evitar daño. Mientras recibas daño en la ventana de 1,5 segundos tras la activación, obtienes un escudo de invulnerabilidad que te vuelve inmune al daño a la vez que aumenta tu daño en un 20% durante 3 segundos.
• Tus botas compensan tu falta de movilidad. Tienen una habilidad de carga que ofrece escape de los combates. Aunque te permite cubrir grandes distancias, tiene un tiempo de reutilización de 1 minuto.', 'https://albiononline.com/guides/article/basic-builds-great-fire-staff+90', false, array['https://assets.albiononline.com/uploads/media/default/media/d03f45507931107091faf885be4394494eea4ea3.png']::text[]);
end
$IMPERIUM$;

-- [26] basic-builds-nature-staff
do $IMPERIUM$
declare
  v_game uuid;
  v_guide uuid;
begin
  select id into v_game from public.games where slug = 'albion-online';
  if v_game is null then
    raise exception 'IMPERIUM: juego no encontrado: %', 'albion-online';
  end if;

  -- Reemplazo idempotente. OJO: borra los pasos -> reinicia step_progress de esta guía.
  delete from public.guide_steps where guide_id in (
    select id from public.guides where game_id = v_game and slug = 'basic-builds-nature-staff');
  delete from public.guides where game_id = v_game and slug = 'basic-builds-nature-staff';

  insert into public.guides
    (game_id, slug, title, description, order_index, is_published, intro_title, intro, intro_images)
  values
    (v_game, 'basic-builds-nature-staff', 'Builds básicas: Nature Staff', 'Nuestra última guía de Basic Builds se centra en esta arma de curación.', 26, false, null, 'Bienvenido a otra de nuestras guías de Basic Builds para jugadores de nivel principiante a intermedio. Cada guía presenta una build sugerida y describe cómo funcionan sus habilidades en conjunto. Puedes probarlas tal cual, o usarlas como punto de partida para crear tus propias builds.', array['https://assets.albiononline.com/uploads/media/default/media/30ed5911846899761aa04cad5facafb1a1ee542a.png']::text[])
  returning id into v_guide;

  insert into public.guide_steps
    (guide_id, order_index, title, content, source_url, is_verified, images)
  values
    (v_guide, 1, 'Características', 'Esta build presenta el Nature Staff a una mano, un arma de curación situada en la rama de cazador (hunter) que se caracteriza por sus habilidades de curación en área amplia y sus habilidades de espinas que ofrecen daño continuo.

¡Aquí tienes el desglose completo!', 'https://albiononline.com/guides/article/basic-builds-nature-staff+91', false, array[]::text[]),
    (v_guide, 2, 'Equipo y habilidades utilizadas', 'Adept''s Nature Staff

• Thorn Growth: tu Q crea un campo de espinas en el suelo que aplica cargas a todos los enemigos dentro de él cada 0,5 segundos; tiene un enfriamiento corto y puede relanzarse 3 veces.
• Brambleseed: tu W coloca una línea de semillas en el suelo que crecerán tras un breve tiempo, lanzando por los aires a todos los enemigos que estén encima; ambos efectos infligen daño, el segundo en mayor medida.
• Circle of Life: tu habilidad principal cura hasta 5 aliados en un radio amplio a tu alrededor; si los enemigos dentro de ese radio tienen al menos 3 cargas de espinas, reciben daño adicional y quedan enraizados durante un breve tiempo.

Adept''s Mage Cowl

• Firebreath: tu Cowl tiene un hechizo ofensivo que incendia brevemente a los enemigos en un pequeño cono frente a ti.

Adept''s Mercenary Jacket

• Bloodlust: la habilidad activa de esta chaqueta te permite recuperar algo de salud cada vez que haces un ataque automático o lanzas un hechizo de daño.

Adept''s Soldier Boots

• Rejuvenating Sprint: la habilidad activa de tus botas es un sprint que además te cura ligeramente.

Adept''s Shield: una mano secundaria que aumenta pasivamente tus defensas y resistencia al control de masas (cc).

Adept''s Bag: aumenta la capacidad de carga de peso.

Adept''s Cape: aumenta la Energy y la regeneración pasiva de Energy.

Minor Poison Potion: inflige un efecto de daño por tiempo a los objetivos y reduce sus resistencias durante su duración.

Pork Omelette: aumenta tu velocidad de lanzamiento y tu tasa de enfriamiento, permitiéndote usar tus habilidades con más frecuencia.

Journeyman''s Riding Horse: te lleva rápidamente por el mapa al tiempo que añade más capacidad de carga.', 'https://albiononline.com/guides/article/basic-builds-nature-staff+91', false, array['https://assets.albiononline.com/uploads/media/default/media/9bb6a1d1aacd11afa27454d5ed82e9cd4f8180ed.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/c42de53d36566aa66a729994cbab663aa1e61a56.jpeg']::text[]),
    (v_guide, 3, 'Pros y contras', 'Pros:

• Velocidad de limpieza rápida
• Alta sostenibilidad (sustain)
• Buena para curar grupos pequeños de PvE
• Asequible

Contras:

• Sin movilidad adicional más allá del hechizo de las botas
• Mucho tiempo parado (standtime) y tiempo de lanzamiento alto
• No apta para combates a gran escala', 'https://albiononline.com/guides/article/basic-builds-nature-staff+91', false, array['https://assets.albiononline.com/uploads/media/default/media/3bebfc33eba99ef7439b7cca0100d42da891952f.jpeg']::text[]),
    (v_guide, 4, 'Estilo de juego', '• Tu hechizo Q crea un campo de espinas en el suelo que aplica repetidamente una carga a los enemigos que estén dentro. También puede relanzarse en un plazo de tres segundos hasta tres veces. Usar un ataque automático sobre un enemigo dentro de las espinas las consume y a la vez inflige daño extra.
• Tu habilidad W coloca semillas de zarza en el suelo que brotan tras un breve retraso, lanzando a los enemigos por los aires e interrumpiéndolos. Sus dos instancias de daño permiten una buena sinergia con la Mercenary Jacket.
• Puedes cambiar tu W por Revitalize para enemigos más duros. Esto te permitirá aumentar tu sustain a costa de algo de daño y control de masas.
• Tu hechizo E es una curación de área amplia que puede usarse para el juego en grupo. Tiene una fuerte sinergia con Thorn Growth, ya que enraíza a todos los enemigos que tengan al menos 3 cargas. Además inflige algo de daño extra.
• Todo el kit del arma puede usarse alternativamente para curar grupos, cambiando la Q por Rejuvenation o Rejuvenating Flower y la W por cualquier cosa que no sea Brambleseed.
• El cowl tiene un hechizo de daño adicional que te permite acabar más rápido con grupos de enemigos.
• La chaqueta puede usarse para recuperar salud. Es mejor usarla en combinación con tus habilidades W y E, ya que pueden golpear a varios objetivos y aplicar cargas de robo de vida más rápidamente. Tu Q no activa Bloodlust porque no inflige daño directo. También se aconsejan los ataques automáticos mientras usas esta chaqueta.
• Tus botas ofrecen una habilidad de sprint que puede recuperar una pequeña cantidad de salud rápidamente, además de proporcionar mayor velocidad de movimiento.
• Un encuentro con enemigos debería verse más o menos así:
• Acumula varios Thorn Growth e intenta meter a todos los enemigos dentro de las áreas.
• Usa la W para mantenerlos alejados de ti o para interrumpir sus habilidades clave.
• Lanza tu E cuando todos los enemigos tengan varias acumulaciones de espinas.
• Usa ataques automáticos sobre el enemigo que intentas rematar para infligir daño adicional.
• Cuando bajes a poca salud, usa tu chaqueta seguida de Brambleseed y ataques automáticos. También puedes usar tus botas para crear espacio y curarte aún más.
• La energía puede ser un problema, así que se recomienda usar la pasiva energetic y atacar automáticamente a los enemigos entre enfriamientos.', 'https://albiononline.com/guides/article/basic-builds-nature-staff+91', false, array['https://assets.albiononline.com/uploads/media/default/media/ed50850d14022054a0460dfa8836a1845c363459.jpeg']::text[]);
end
$IMPERIUM$;

-- [27] basic-builds-bow
do $IMPERIUM$
declare
  v_game uuid;
  v_guide uuid;
begin
  select id into v_game from public.games where slug = 'albion-online';
  if v_game is null then
    raise exception 'IMPERIUM: juego no encontrado: %', 'albion-online';
  end if;

  -- Reemplazo idempotente. OJO: borra los pasos -> reinicia step_progress de esta guía.
  delete from public.guide_steps where guide_id in (
    select id from public.guides where game_id = v_game and slug = 'basic-builds-bow');
  delete from public.guides where game_id = v_game and slug = 'basic-builds-bow';

  insert into public.guides
    (game_id, slug, title, description, order_index, is_published, intro_title, intro, intro_images)
  values
    (v_game, 'basic-builds-bow', 'Builds básicas: Bow', 'Nuestra última guía muestra esta arma a distancia.', 27, false, null, 'Bienvenido a otra de nuestras guías de Basic Builds para jugadores de nivel principiante a intermedio. Cada guía presenta una build sugerida y describe cómo funcionan sus habilidades en conjunto. Puedes probarlas tal cual, o usarlas como punto de partida para crear tus propias builds.', array['https://assets.albiononline.com/uploads/media/default/media/bd862f9e1d1429234a3b751e65328056db3497d6.png']::text[])
  returning id into v_guide;

  insert into public.guide_steps
    (guide_id, order_index, title, content, source_url, is_verified, images)
  values
    (v_guide, 1, 'Características', 'Esta build muestra el Bow normal. Esta arma de cazador (hunter) tiene flechas encantadas que potencian tus ataques automáticos y te permiten abatir con facilidad a enemigos individuales fuertes.

¡Aquí tienes el desglose completo!', 'https://albiononline.com/guides/article/basic-builds-bow+92', false, array[]::text[]),
    (v_guide, 2, 'Equipo y habilidades utilizadas', 'Adept''s Bow

• Multishot: una habilidad de área (AoE) que empuja e inflige daño a los enemigos en un cono frente a ti.
• Ray of Light: tu W dispara una flecha al aire que cae tras un pequeño retraso, enraizando e infligiendo daño a todos los enemigos golpeados.
• Enchanted Quiver: la habilidad principal encanta tus siguientes 6 ataques básicos, aumentando tu velocidad de ataque y tu daño. Puede relanzarse en un plazo de 8 segundos para realizar un breve dash y añadir otras 4 flechas encantadas a tu carcaj, aunque nunca puedes tener más de 6 flechas encantadas activas a la vez.

Adept''s Mage Cowl

• Firebreath: tu Cowl tiene un hechizo ofensivo que incendia brevemente a los enemigos en un pequeño cono frente a ti.

Adept''s Mercenary Jacket

• Bloodlust: la habilidad activa de esta chaqueta te permite recuperar algo de salud cada vez que haces un ataque automático o lanzas un hechizo de daño.

Adept''s Mercenary Shoes

• Refreshing Sprint: tus zapatos te permiten perseguir a los objetivos mientras reducen tus enfriamientos; también pueden usarse para huir de un combate.

Adept''s Bag: aumenta la capacidad de carga de peso.

Adept''s Cape: aumenta la Energy y la regeneración pasiva de Energy.

Minor Poison Potion: inflige un efecto de daño por tiempo a los objetivos y reduce sus resistencias durante su duración.

Catfish: comida de buff que aumenta enormemente la regeneración de salud fuera de combate, devolviéndote rápidamente a la salud máxima tras limpiar mobs.

Journeyman''s Riding Horse: te lleva rápidamente por el mapa al tiempo que añade más capacidad de carga.', 'https://albiononline.com/guides/article/basic-builds-bow+92', false, array['https://assets.albiononline.com/uploads/media/default/media/dac718276a59e25f978a2ddbf9d31461a7a3159c.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/e5afbab1de14873dc72f9ed1175eb4fe849bdad1.jpeg']::text[]),
    (v_guide, 3, 'Pros y contras', 'Pros:

• Muy efectiva contra enemigos individuales y jefes
• Varias habilidades de control de masas menores
• Habilidad de dash para esquivar ataques
• Asequible

Contras:

• Débil contra grupos de mobs
• Mucho tiempo parado (standtime) y tiempo de lanzamiento alto
• No es útil en combates a gran escala', 'https://albiononline.com/guides/article/basic-builds-bow+92', false, array['https://assets.albiononline.com/uploads/media/default/media/c0cb6008a2d9f54b5772a54bac25c68650fe6a12.jpeg']::text[]),
    (v_guide, 4, 'Estilo de juego', '• Tu habilidad Q dispara una andanada de flechas en un cono frente a ti. Además de infligir daño, también empuja a cualquier enemigo golpeado. Puede usarse para crear distancia o para interrumpir hechizos enemigos. Tiene un enfriamiento bajo, así que puede usarse para infligir daño con frecuencia.
• Tu W es una habilidad de control de masas de área pequeña que enraíza temporalmente a los enemigos. Puede usarse como apertura para mantener alejados a los enemigos cuerpo a cuerpo.
• Puede cambiarse por Frost Shot para mayor movilidad a costa de algo de daño y control de masas.
• Tu habilidad E te da 6 flechas encantadas que potenciarán tus siguientes ataques básicos, infligiendo más daño. Es útil contra enemigos fuertes que estén solos.
• Esta habilidad también puede relanzarse en un plazo de 8 segundos para realizar un breve dash y añadir otras 4 flechas encantadas a tu carcaj. Es buena para crear distancia o esquivar hechizos enemigos. No usarla acortará el enfriamiento de la habilidad.
• El cowl tiene un hechizo de daño adicional que te permite acabar más rápido con grupos de enemigos.
• La chaqueta puede usarse para recuperar salud. Es mejor usarla en combinación con tus flechas encantadas. Tus habilidades Q y W también activan Lifesteal, así que pueden usarse como complemento.
• Tus zapatos pueden usarse para cerrar distancia con el enemigo o para alejarte de él. Refreshing Sprint también reduce tus enfriamientos, permitiéndote usar tus habilidades con más frecuencia.
• Un encuentro con enemigos debería verse más o menos así:
• Usa tu E para activar las flechas encantadas.
• Lanza tu W para mantener al enemigo o enemigos alejados de ti.
• Empieza a atacar automáticamente al objetivo que quieras abatir primero.
• Usa tu Q para infligir daño adicional o para interrumpir habilidades enemigas.
• Relanza tu E si necesitas esquivar un hechizo o necesitas el daño extra de las flechas encantadas.
• Usa tu chaqueta cuando bajes del 60% de salud, idealmente en combinación con tus flechas encantadas.
• Si la energía se convierte en un problema, se recomienda usar la pasiva energetic, que reabastecerá tu energía continuamente cada vez que uses un ataque básico.', 'https://albiononline.com/guides/article/basic-builds-bow+92', false, array['https://assets.albiononline.com/uploads/media/default/media/842ab1858120e53a77194c5c00493be5c6b768ed.jpeg']::text[]);
end
$IMPERIUM$;

-- [28] basic-builds-great-cursed-staff
do $IMPERIUM$
declare
  v_game uuid;
  v_guide uuid;
begin
  select id into v_game from public.games where slug = 'albion-online';
  if v_game is null then
    raise exception 'IMPERIUM: juego no encontrado: %', 'albion-online';
  end if;

  -- Reemplazo idempotente. OJO: borra los pasos -> reinicia step_progress de esta guía.
  delete from public.guide_steps where guide_id in (
    select id from public.guides where game_id = v_game and slug = 'basic-builds-great-cursed-staff');
  delete from public.guides where game_id = v_game and slug = 'basic-builds-great-cursed-staff';

  insert into public.guides
    (game_id, slug, title, description, order_index, is_published, intro_title, intro, intro_images)
  values
    (v_game, 'basic-builds-great-cursed-staff', 'Builds básicas: Great Cursed Staff', 'Nuestra última guía examina esta poderosa arma de mago.', 28, false, null, 'Bienvenido a otra de nuestras guías de Basic Builds para jugadores de nivel principiante a intermedio. Cada guía presenta una build sugerida y describe cómo funcionan sus habilidades en conjunto. Puedes probarlas tal cual, o usarlas como punto de partida para crear tus propias builds.', array['https://assets.albiononline.com/uploads/media/default/media/4f1057fcf7e0c0640abfa1ccc46361e7683a3861.png']::text[])
  returning id into v_guide;

  insert into public.guide_steps
    (guide_id, order_index, title, content, source_url, is_verified, images)
  values
    (v_guide, 1, 'Características', 'Esta build presenta el Great Cursed Staff, un arma de mago que inflige daño durante un periodo de tiempo prolongado.

¡Aquí tienes el desglose completo!', 'https://albiononline.com/guides/article/basic-builds-great-cursed-staff+93', false, array[]::text[]),
    (v_guide, 2, 'Equipo y habilidades utilizadas', 'Adept''s Great Cursed Staff

• Cursed Sickle: lanza una hoz en línea frente a ti que regresa a su posición de lanzamiento. Aplica una carga de Vile Curse a cada enemigo que atraviesa, que puede acumularse hasta 4 veces.
• Armor Piercer: tu W lanza un rayo demoníaco frente a ti, infligiendo daño y reduciendo brevemente las resistencias de tus enemigos.
• Area of Decay: tu habilidad principal canaliza un área que aplica una carga de Vile Curse cada 0,8 segundos. Puede canalizarse durante hasta 3,2 segundos.

Adept''s Mage Cowl

• Firebreath: tu Cowl tiene un hechizo ofensivo que incendia brevemente a los enemigos en un pequeño cono frente a ti.

Adept''s Cleric Robe

• Everlasting Spirit: la habilidad activa de la túnica ofrece un escudo al recibir daño que te hace invulnerable y aumenta tu daño un 20% durante 3 segundos.

Adept''s Soldier Boots

• Wanderlust: la habilidad activa de tus botas es una habilidad de movimiento con carga que te permite escapar de combates o perseguir objetivos.

Adept''s Bag: aumenta la capacidad de carga de peso.

Adept''s Cape: aumenta la Energy y la regeneración pasiva de Energy.

Minor Poison Potion: inflige un efecto de daño por tiempo a los objetivos y reduce sus resistencias durante su duración.

Catfish: comida de buff que aumenta enormemente la regeneración de salud fuera de combate, devolviéndote rápidamente a la salud máxima tras limpiar mobs.

Journeyman''s Riding Horse: te lleva rápidamente por el mapa al tiempo que añade más capacidad de carga.', 'https://albiononline.com/guides/article/basic-builds-great-cursed-staff+93', false, array['https://assets.albiononline.com/uploads/media/default/media/8b70638b889694bb92ad1b3ce3757bbb733b0634.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/86083db86f9e549fac6f8bf82658014348e48b88.jpeg']::text[]),
    (v_guide, 3, 'Pros y contras', 'Pros:

• Velocidad de limpieza rápida contra grupos de enemigos
• Buena para grupos pequeños de PvE y PvP
• Los hechizos de daño por tiempo permiten moverse entre lanzamientos de habilidades
• Asequible

Contras:

• Las cargas de Vile Curse pueden mantenerte en combate durante un periodo prolongado
• No es útil en combates a gran escala', 'https://albiononline.com/guides/article/basic-builds-great-cursed-staff+93', false, array['https://assets.albiononline.com/uploads/media/default/media/5330d81f56118d4a1324d0ffc1e962f8e19f5d9d.jpeg']::text[]),
    (v_guide, 4, 'Estilo de juego', '• Tu hechizo Q lanza un Cursed Sickle en la dirección apuntada que regresa de vuelta a su posición de lanzamiento. Esto puede colocar dos cargas de Vile Curse sobre tus enemigos con cada hoz. Posiciónate para golpear a la mayor cantidad de objetivos posible.
• Las cargas de Vile Curse pueden acumularse hasta cuatro veces, pero es mejor que las reabastezcas. Lanzar la "quinta" carga infligirá esencialmente el daño directo equivalente a cuatro acumulaciones sobre el objetivo, conservando a la vez 4 cargas.
• Tu W puede usarse como apoyo de daño adicional, ya que reduce las resistencias del enemigo a la vez que inflige daño directo.
• Puede cambiarse por Grudge para combatir a enemigos individuales más duros. Esto potencia tus ataques automáticos en función de cuánto tiempo lleves sin atacar.
• Tu habilidad E canaliza un efecto en el suelo que aplica rápidamente cargas de Vile Curse, aunque no puedes moverte ni usar ningún otro hechizo mientras la canalizas.
• El cowl tiene un hechizo de daño adicional que puede acabar rápido con grupos de enemigos.
• La túnica tiene una potente habilidad defensiva. Mientras recibas daño en la ventana de 1,5 segundos tras la activación, recibirás un escudo de invulnerabilidad que te hace inmune al daño a la vez que aumenta tu daño un 20% durante un total de 3 segundos.
• Tus botas compensan tu falta de movilidad. Tienen una habilidad con carga que permite una huida rápida. Aunque esto te permite cubrir mucha distancia, viene con un enfriamiento de 1 minuto.
• Un encuentro con enemigos debería verse más o menos así:
• Lanza tu Cursed Sickle hacia el enemigo.
• Lanza tu W para reducir sus resistencias.
• Usa tu E cuando estés en una posición cómoda. No dudes en cancelar el hechizo si necesitas esquivar una habilidad enemiga.
• Relanza tu Q mientras haces kiting y atacas automáticamente. Concéntrate en reabastecer las cargas de Vile Curse para maximizar el daño.
• Usa tu túnica cuando esperes recibir una ráfaga de daño. Esto te hará invulnerable durante 3 segundos a la vez que aumenta tu daño.
• Si la energía se convierte en un problema, se recomienda usar la pasiva energetic, que reabastecerá tu energía continuamente cada vez que uses un ataque básico.', 'https://albiononline.com/guides/article/basic-builds-great-cursed-staff+93', false, array['https://assets.albiononline.com/uploads/media/default/media/e7cfa02f479993c956e0bcf4098879bec2957c68.jpeg']::text[]);
end
$IMPERIUM$;

-- [29] basic-builds-battle-bracers
do $IMPERIUM$
declare
  v_game uuid;
  v_guide uuid;
begin
  select id into v_game from public.games where slug = 'albion-online';
  if v_game is null then
    raise exception 'IMPERIUM: juego no encontrado: %', 'albion-online';
  end if;

  -- Reemplazo idempotente. OJO: borra los pasos -> reinicia step_progress de esta guía.
  delete from public.guide_steps where guide_id in (
    select id from public.guides where game_id = v_game and slug = 'basic-builds-battle-bracers');
  delete from public.guides where game_id = v_game and slug = 'basic-builds-battle-bracers';

  insert into public.guides
    (game_id, slug, title, description, order_index, is_published, intro_title, intro, intro_images)
  values
    (v_game, 'basic-builds-battle-bracers', 'Builds básicas: Battle Bracers', 'Nuestra última guía examina estos War Gloves.', 29, false, null, 'Bienvenido a otra de nuestras guías de Basic Builds para jugadores de nivel principiante a intermedio. Cada guía presenta una build sugerida y describe cómo funcionan sus habilidades en conjunto. Puedes probarlas tal cual, o usarlas como punto de partida para crear tus propias builds.', array['https://assets.albiononline.com/uploads/media/default/media/55049b5983e31405e513c859be1badd3dfc769c7.png']::text[])
  returning id into v_guide;

  insert into public.guide_steps
    (guide_id, order_index, title, content, source_url, is_verified, images)
  values
    (v_guide, 1, 'Características', 'Esta build muestra los Battle Bracers, un arma de guerrero (warrior) con alta movilidad, daño y habilidades de control de masas cortas.

¡Aquí tienes el desglose completo!', 'https://albiononline.com/guides/article/basic-builds-battle-bracers+94', false, array[]::text[]),
    (v_guide, 2, 'Equipo y habilidades utilizadas', 'Adept''s Battle Bracers

• Dragon Leap: un combo de corto alcance que te permite hacer un dash e infligir daño en un radio pequeño. Puede activarse una segunda vez para lanzar brevemente a los enemigos por los aires.
• Triple Kick: un dash lento a través de los enemigos, infligiendo daño hasta tres veces.
• Falcon Smash: levitas, volviéndote inmune al control de masas. Con el segundo lanzamiento te lanzas en picado a un área apuntada, infligiendo daño en un radio de 6 m.

Adept''s Mage Cowl

• Firebreath: tu Cowl tiene un hechizo ofensivo que incendia brevemente a los enemigos en un pequeño cono frente a ti.

Adept''s Mercenary Jacket

• Bloodlust: la habilidad activa de esta chaqueta te permite recuperar algo de salud cada vez que haces un ataque automático o lanzas un hechizo de daño.

Adept''s Soldier Boots

• Rejuvenating Sprint: la habilidad activa de tus botas es un sprint que además te cura ligeramente.

Adept''s Bag: aumenta la capacidad de carga de peso.

Adept''s Cape: aumenta la Energy y la regeneración pasiva de Energy.

Minor Poison Potion: inflige un efecto de daño por tiempo a los objetivos y reduce sus resistencias durante su duración.

Beef Stew: aumenta tu daño.

Journeyman''s Riding Horse: te lleva rápidamente por el mapa al tiempo que añade más capacidad de carga.', 'https://albiononline.com/guides/article/basic-builds-battle-bracers+94', false, array['https://assets.albiononline.com/uploads/media/default/media/0f445d91c05f7071ddddeb4ce97fe44cb7543062.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/a81a174b65ccd61460f25ff4e86cf0f2e5098b2a.jpeg']::text[]),
    (v_guide, 3, 'Pros y contras', 'Pros:

• Mucha movilidad, lo que te permite esquivar hechizos o escapar de un combate
• Muchas habilidades de control de masas a pequeña escala
• Build viable para 1v1 y duelos
• Asequible

Contras:

• Velocidad de limpieza media
• Requiere práctica
• No apta para combates a gran escala', 'https://albiononline.com/guides/article/basic-builds-battle-bracers+94', false, array['https://assets.albiononline.com/uploads/media/default/media/4bb4a01afdbeff4cc98b20a4eda7989f96b126a4.jpeg']::text[]),
    (v_guide, 4, 'Estilo de juego', '• Tu habilidad Q es un combo de dos partes en el que haces un dash en una dirección apuntada, infligiendo daño. Usar la habilidad de nuevo realizará otro dash, lanzando a los enemigos por los aires y dejando el hechizo con un enfriamiento de 7 segundos, mientras que no hacerlo te permitirá reutilizar la primera parte tras 2 segundos. Para maximizar el daño, usa solo la primera parte; la segunda parte es mejor para interrumpir o rematar a un objetivo.
• La habilidad W es otro dash que tiene tres instancias de daño. Te permite atravesar un grupo de objetivos e infligir daño en las cercanías, de modo que puedas infligir la cantidad completa de daño a tus objetivos. Si golpeas a un jugador, será arrastrado contigo. Para maximizar el daño, apunta cerca de tu ubicación actual, infligiendo daño en un área concentrada. Apuntar más lejos te permitirá viajar más, pero repartirá el daño.
• Tu habilidad principal es un combo de dos partes. Primero levitas, volviéndote inmune al control de masas. Luego puedes relanzar para lanzarte en picado hacia un área apuntada, infligiendo daño en una amplia zona. Es una buena apertura, ya que puedes golpear a un grupo de enemigos mientras están inactivos.
• Tus ataques automáticos pueden potenciar aún más tu daño. La primera pasiva "Fatal Fury" aumenta tu daño con cada ataque automático. Como los gloves tienen una alta velocidad de ataque, puedes encajar algunos ataques entre tus habilidades para elevar tu daño.
• El cowl tiene un hechizo de daño adicional para acabar rápido con grupos.
• La chaqueta puede recuperar salud. Es mejor usarla en combinación con tus habilidades de arma si pueden golpear a varios objetivos, o cuando atacas automáticamente a un enemigo durante unos segundos.
• Tus botas tienen una habilidad de sprint que puede recuperar una pequeña cantidad de salud rápidamente a la vez que proporciona mayor velocidad.
• Un encuentro debería verse más o menos así:
• Usa tu E para levitar, luego relanza para lanzarte en picado hacia el objetivo o los objetivos.
• Usa la primera parte de tu Q para infligir daño.
• Usa tu W para aplicar daño adicional.
• Alterna entre usar tu primera Q y ataques automáticos.
• Usa tu chaqueta cuando estés por debajo del 60% de salud, idealmente en combinación con hechizos de área contra grupos o ataques automáticos contra enemigos individuales.
• Si la energía se convierte en un problema, prueba a cambiar a Cloth Sandals para usar Energetic Sprint.', 'https://albiononline.com/guides/article/basic-builds-battle-bracers+94', false, array['https://assets.albiononline.com/uploads/media/default/media/be0cf0f1219315be61c4872863acb9d252ff48fd.jpeg']::text[]);
end
$IMPERIUM$;

-- [30] basic-builds-spear
do $IMPERIUM$
declare
  v_game uuid;
  v_guide uuid;
begin
  select id into v_game from public.games where slug = 'albion-online';
  if v_game is null then
    raise exception 'IMPERIUM: juego no encontrado: %', 'albion-online';
  end if;

  -- Reemplazo idempotente. OJO: borra los pasos -> reinicia step_progress de esta guía.
  delete from public.guide_steps where guide_id in (
    select id from public.guides where game_id = v_game and slug = 'basic-builds-spear');
  delete from public.guides where game_id = v_game and slug = 'basic-builds-spear';

  insert into public.guides
    (game_id, slug, title, description, order_index, is_published, intro_title, intro, intro_images)
  values
    (v_game, 'basic-builds-spear', 'Builds básicas: Spear', 'Nuestra última guía examina esta arma de cazador.', 30, false, null, 'Bienvenido a otra de nuestras guías de Basic Builds para jugadores de nivel principiante a intermedio. Cada guía presenta una build sugerida y describe cómo funcionan sus habilidades en conjunto. Puedes probarlas tal cual, o usarlas como punto de partida para crear tus propias builds.', array['https://assets.albiononline.com/uploads/media/default/media/775d536f1482df4fedc477d59071879afe1d99db.png']::text[])
  returning id into v_guide;

  insert into public.guide_steps
    (guide_id, order_index, title, content, source_url, is_verified, images)
  values
    (v_guide, 1, 'Características', 'Esta build muestra la Spear normal, un arma de cazador (hunter) conocida por su daño constante, alta movilidad y habilidades de control de masas.

¡Aquí tienes el desglose completo!', 'https://albiononline.com/guides/article/basic-builds-spear+95', false, array[]::text[]),
    (v_guide, 2, 'Equipo y habilidades utilizadas', 'Adept''s Spear

• Lunging Strike: un ataque perforante que inflige daño en línea frente a ti a la vez que ralentiza un 10% a los enemigos golpeados. También te aplica una carga de Spirit Spear, aumentando el daño de tus ataques automáticos.
• Forest of Spears: una habilidad que puede canalizarse durante hasta 2,1 segundos, infligiendo daño en un cono frente a ti cada 0,3 segundos.
• Reckless Charge: tu habilidad principal te permite hacer un dash hacia una posición apuntada, lanzando por los aires a todos los enemigos que atraviesas. Inflige daño en función de la cantidad de cargas de Spirit Spear que tengas, consumiéndolas en el proceso.

Adept''s Mage Cowl

• Firebreath: tu Cowl tiene un hechizo ofensivo que incendia brevemente a los enemigos en un pequeño cono frente a ti.

Adept''s Mercenary Jacket

• Bloodlust: la habilidad activa de esta chaqueta te permite recuperar algo de salud cada vez que haces un ataque automático o lanzas un hechizo de daño.

Adept''s Soldier Boots

• Rejuvenating Sprint: la habilidad activa de tus botas es un sprint que además te cura ligeramente.

Adept''s Torch: aumenta pasivamente la velocidad de ataque y reduce los enfriamientos.

Adept''s Bag: aumenta la capacidad de carga de peso.

Adept''s Cape: aumenta la Energy y la regeneración pasiva de Energy.

Minor Poison Potion: inflige un efecto de daño por tiempo a los objetivos y reduce sus resistencias durante su duración.

Roast Pork: recupera salud en función del daño que infliges.

Journeyman''s Riding Horse: te lleva rápidamente por el mapa al tiempo que añade más capacidad de carga.', 'https://albiononline.com/guides/article/basic-builds-spear+95', false, array['https://assets.albiononline.com/uploads/media/default/media/33a836f1d08d0fdd819340608f9911a30d11c9c8.jpeg', 'https://assets.albiononline.com/uploads/media/default/media/042206a8bff2d8f6a8a89e8f4a5b057355fda5e7.jpeg']::text[]),
    (v_guide, 3, 'Pros y contras', 'Pros:

• La habilidad principal tiene alta movilidad y control de masas
• Ataques automáticos potentes
• Buena velocidad de limpieza
• Buena sostenibilidad (sustain) gracias a la comida y otro equipo
• Build viable para 1v1 y duelos
• Asequible

Contras:

• La mayoría de las habilidades W situacionales se desbloquean a niveles más altos
• No apta para combates a gran escala', 'https://albiononline.com/guides/article/basic-builds-spear+95', false, array['https://assets.albiononline.com/uploads/media/default/media/a4cbb8ba47da7b47c759b4448812b6e1d916b12c.jpeg']::text[]),
    (v_guide, 4, 'Estilo de juego', '• Tu habilidad Q golpea a los enemigos en línea frente a ti, infligiendo daño directo y aplicando una carga de Spirit Spear (hasta un total de tres). Tiene un enfriamiento muy corto, así que puede usarse varias veces durante un combate.
• Las cargas de Spirit Spear aumentan el daño de tus ataques automáticos, que además te curan una cantidad decente si usas la pasiva "Life Leech".
• La habilidad W inflige daño repetidamente frente a ti mientras se canaliza. Tiene hasta 8 instancias de daño, lo que la hace muy fuerte en combinación con la habilidad "Bloodlust" de la Mercenary Jacket.
• Tu habilidad principal es un dash de largo alcance que lanza por los aires a todos los enemigos que atraviesa a la vez que inflige daño en función de la cantidad de cargas activas de Spirit Spear. Usar la habilidad consume estas cargas. Esta habilidad es muy útil para interrumpir hechizos enemigos, reposicionarte o escapar de un combate.
• El cowl tiene un hechizo de daño adicional que te permite acabar más rápido con grupos de enemigos.
• La chaqueta puede usarse para recuperar salud. Es mejor usarla en combinación con tu habilidad W, pero también puede activarse rápidamente al luchar contra un grupo de enemigos con tu habilidad Q.
• Tus botas tienen una habilidad de sprint que recupera una pequeña porción de salud rápidamente a la vez que proporciona mayor velocidad.
• Un encuentro con enemigos debería verse más o menos así:
• Usa tu Q para empezar el combate y ganar cargas de Spirit Spear.
• Usa ataques automáticos sobre el objetivo o los objetivos principales.
• Usa tu E para cancelar o esquivar un hechizo enemigo.
• Usa tu W si estás en un punto seguro o en combinación con tu chaqueta para curarte rápidamente.', 'https://albiononline.com/guides/article/basic-builds-spear+95', false, array['https://assets.albiononline.com/uploads/media/default/media/62223b3b20fc36bda1fddcc01634e5307c8f8cca.jpeg']::text[]);
end
$IMPERIUM$;
