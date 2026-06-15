do $IMPERIUM$
declare
  v_game uuid;
  v_guide uuid;
begin
  select id into v_game from public.games where slug = 'sword-x-staff';
  if v_game is null then
    raise exception 'IMPERIUM: juego no encontrado: %', 'sword-x-staff';
  end if;

  -- Reemplazo idempotente. OJO: borra los pasos -> reinicia step_progress de esta guía.
  delete from public.guide_steps where guide_id in (
    select id from public.guides where game_id = v_game and slug = 'beginner-guide');
  delete from public.guides where game_id = v_game and slug = 'beginner-guide';

  insert into public.guides
    (game_id, slug, title, description, order_index, is_published, intro_title, intro, intro_images)
  values
    (v_game, 'beginner-guide', 'Guía para principiantes de Sword x Staff', 'Recorrido del día 1 en Sword x Staff. Qué clase elegir, por qué explorar el mapa importa más que tu nivel, el triángulo de estadísticas, la trampa de las Stellatie del lanzamiento y tu checklist de las primeras 24 horas.', 1, false, 'Verdantglade es el filtro', 'Boltray diseña Verdantglade (el primer reino) para filtrar a aproximadamente la mitad de la base de jugadores antes de que empiece el segundo reino. Casi todos los sistemas a largo plazo que te van a importar (Premium banner, subastas de calidad dorada, economía de compañeros bestia) se abren en Cinder Ridge o más adelante. Trata Verdantglade como un tutorial largo y no comprometas gastos de Stellatie ni de Voucher en él.

Del día 1 a tu primera semana. Esta guía cubre las cuatro decisiones que realmente tomas en la creación del personaje: elección de clase, dónde empujar tu nivel, dónde gastar tu presupuesto de estadísticas y qué NO hacer con la gacha del lanzamiento. La trampa aquí es tratar el poder del lado de las habilidades como una inversión a largo plazo. Casi todos los sistemas recompensan la paciencia: el leveo, la exploración del mapa, la resonancia de reliquias y las monedas de gacha rinden más en Cinder Ridge que en Forest. Acumula, no gastes.

Una vez que pases la primera semana, la guía Important Tips retoma con decisiones de build específicas por clase, resonancia de reliquias, Mysterious NPC, estrategia de Arena y el orden de gasto más profundo. Si estás sopesando si hacer reroll, lee primero la Reroll Guide.', array['https://eog.gg/assets/games/sword-x-staff/kingdoms/forest.webp']::text[])
  returning id into v_guide;

  insert into public.guide_steps
    (guide_id, order_index, title, content, source_url, is_verified, images)
  values
    (v_guide, 1, '¿Deberías hacer reroll? Probablemente no', 'Los servidores se llenan. Si tus amigos y tu gremio ya están en un servidor, hacer reroll puede dejarte fuera de unirte a ellos una vez que ese servidor llegue a su capacidad. Cada ronda de reroll lleva 15-20 minutos, te da aproximadamente 45 pulls gratis más los 10 pulls forzados del tutorial, y la ventana para ponerse al día sin reroll es corta porque las recompensas de inicio de sesión del lanzamiento llegan en una cadencia fija.

Sáltate el reroll si: estás en un servidor poblado con amigos o un gremio, quieres empezar a jugar el juego de verdad, o eres F2P y prefieres priorizar la exploración de Goddess Statue antes que pasar tres horas cazando una habilidad específica.

Considera hacer reroll si: no estás comprometido con un servidor concreto y tienes un objetivo de pull claro en mente (Heavy Impact para Warrior, Water Assault para Mage). Los objetivos detallados y el proceso paso a paso están en la Reroll Guide.', 'https://eog.gg/games/sword-x-staff/guides/beginner-guide/', false, array[]::text[]),
    (v_guide, 2, 'Elige una clase (puedes cambiar después, pero no es gratis)', 'Empiezas en la Beginner Island y estás restringido a Warrior o Mage (tu 1ª clase). El primer pueblo al que llegas en Verdantglade es Drasilgard. Tu avance de segunda clase se desbloquea en el Lv.44 en Cinder Ridge: Warrior a Duelist o Knight, Mage a Sorcerer o Sage. El reclassing se desbloquea en Aqualis (Tier 3), pero no es sin pérdidas. Las habilidades se transfieren equivalente por equivalente (Legendary→Legendary, etc.), así que los jugadores F2P que no poseen ya la habilidad de la clase objetivo terminan haciéndola por RNG. El ajuste de estadísticas específico de clase (reliquias, afijos de mascota, enfoque en Block / Crit / Heal) tampoco se traslada limpiamente a la mecánica central de otra clase. Consulta la tabla de rutas de cambio en la pestaña Classes antes de comprometerte.

Cambiar antes de Aqualis es doloroso. La opción de reclass temprano reinicia la nueva clase en nivel 1 sin habilidades utilizables. El reclass de Aqualis es el que quieres incluso con sus costes: planea vivir con tu elección de lanzamiento hasta entonces.

Si quieres una opción por defecto limpia, elige el rol que realmente quieres jugar en el contenido de gremio. Duelist y Sorcerer son los dos farmeadores en solitario. Knight y Sage son los dos especialistas en contenido grupal.

Consulta la pestaña Classes para el desglose completo.', 'https://eog.gg/games/sword-x-staff/guides/beginner-guide/', false, array[]::text[]),
    (v_guide, 3, 'Toda clase necesita un loadout para jugar en solitario', 'El progreso de la historia es en solitario. Incluso las clases puramente tanque o sanadoras tienen que completar la campaña por su cuenta, lo que significa que ninguna clase escapa de la necesidad de un loadout orientado al daño. El juego te da hasta siete slots de loadout. Úsalos.

División de loadout por defecto que usan la mayoría de los miembros de EOG:

• Solitario / historia. Enfocado en daño. El que usas para empujar el mapa.

• Daily Dungeon. Enfocado en AoE para limpiar mobs.

• Boss / objetivo único. Habilidades de múltiples golpes que activan pasivas cada turno.

• Contenido grupal. Consciente del tanque o consciente del sanador según la clase. Mete la utilidad de composición de equipo que tu kit pueda ofrecer.

Un slot dedicado de "Dummy" para el Skill Test en el nivel 40 también merece uno de los slots restantes. Consulta la guía DPS Dummy Test para la configuración.', 'https://eog.gg/games/sword-x-staff/guides/beginner-guide/', false, array[]::text[]),
    (v_guide, 4, 'La exploración del mapa es tu nivel real', 'Cada nivel de jugador desbloquea más del mapa. Cada área desbloqueada activa más Goddess Statues. Más Statues significan ganancias de experiencia más rápidas, que se acumulan durante los próximos dos meses del juego.

Empuja la exploración antes que cualquier otra cosa. Los jugadores que se quedan atrás en los desbloqueos de mapa en Verdantglade nunca alcanzan la curva de leveo en Cinder Ridge. Esta es la única ventaja permanente que no requiere gastar.

Temporal Crystals. Concesiones de recompensa por inactividad de dos horas. Úsalas mientras aún tengas mapa que desbloquear, o acumúlalas. Las dos estrategias son aproximadamente equivalentes en producción total de recompensa. Elige la que se ajuste a tu horario de juego. Lo único que no hay que hacer es olvidar que las tienes y dejar que se pudran en tu inventario.', 'https://eog.gg/games/sword-x-staff/guides/beginner-guide/', false, array[]::text[]),
    (v_guide, 5, 'El triángulo de estadísticas', 'Tres estadísticas de combate determinan casi toda interacción de daño. Se contrarrestan entre sí como piedra papel tijera.

Critical (150%): Daño crítico base. Daño masivo al activarse. Se reduce al 50% si el golpe es bloqueado.

Accuracy (Suelo): Reduce la probabilidad de bloqueo del enemigo. No aumenta el daño. Crea un suelo de daño.

Block (50%): Un crítico bloqueado inflige 50% de daño en lugar de 150%. Estadística de escalado del Knight.

Para toda clase DPS, Accuracy es la segunda prioridad más alta después de Crit Rate. Un crítico bloqueado inflige 50% de daño en lugar de 150%, así que cuanto más sube tu Crit Rate, más te cuesta cada punto de Accuracy que falte. Duelist y Sorcerer ambos usan el stack de Crit + Accuracy. Sage también apila Crit Rate, aunque el rasgo de clase no lo proporcione. Knight es la única clase que apila Block.

Speed. Determina el orden de turnos. Alcanza 2x la Speed del enemigo y obtienes dos rondas por cada una de las suyas. No es urgente en Verdantglade porque la diferencia de estadística entre tú y los mobs de Verdantglade se mantiene pequeña, pero importa en reinos posteriores.

Mastery. Physical Mastery escala el daño de habilidades físicas. Elemental Mastery escala toda habilidad elemental. La proporción de conversión es cada 40 puntos de Mastery = +1% de daño a ese tipo de daño. Toca la estadística en el menú para ver el porcentaje en vivo. Por encima de HP plano y Attack en las sub-estadísticas del equipo. Por debajo de Crit Rate, Accuracy y Block para el escalado específico de clase.', 'https://eog.gg/games/sword-x-staff/guides/beginner-guide/', false, array[]::text[]),
    (v_guide, 6, 'Picos de poder a los que apuntar', 'Tres niveles de cuenta valen más que cualquier otro en la primera semana. Planifica tus sesiones en torno a alcanzarlos antes de perseguir cualquier otra cosa.

• Nivel 15: únete a un gremio. Los gremios otorgan recursos, buffs de estadísticas, recompensas por donación y acceso a los drops del Guild Boss (Skill Shard Vouchers). El Discord de EOG publica una lista de reclutamiento abierto en el canal de Sword x Staff si no tienes un gremio preparado.

• Nivel 40: desbloqueo del Skill Test. El dummy en el juego en Character › Skills › Test te deja comparar loadouts sin quemar stamina. Consulta la guía DPS Dummy Test.

• Nivel 50: desbloqueo de Fantomons. El árbol gigante en tu base de origen abre los Fantomons, el sistema de mascotas compañeras. Este es el mayor pico de poder no relacionado con equipo antes del segundo mapa. No repartas los materiales de mejora de Fantomon por todo el roster. Elige un Fantomon por rol que realmente uses, súbelo a 50 para el primer gran desbloqueo de estadística, y solo reparte una vez que tu principal esté a 50. La Fantomon tier list tiene la lista corta.', 'https://eog.gg/games/sword-x-staff/guides/beginner-guide/', false, array[]::text[]),
    (v_guide, 7, 'Dónde estás en la línea de tiempo de la temporada', 'El progreso de Sword x Staff funciona con tiers de clase medidos desde la fecha de creación de tu servidor, no desde el lanzamiento global. Si te uniste dos semanas tarde, estás aproximadamente dos semanas atrás en esta línea de tiempo, no en el mismo punto que una cuenta del día del lanzamiento.

• Tier 1 · Día 1-4: 1ª clase (Warrior o Mage) a través de la Beginner Island y dentro de Verdantglade. Drasilgard es el primer pueblo. La mayor parte de esta guía es consejo de Tier 1.

• Tier 2 · Día 4-12: Cinder Ridge se desbloquea (Mecha Summit, ~180K CP). Avance de segunda clase en el Lv.44 a Duelist / Knight / Sorcerer / Sage. El Premium banner (orbe rosa) se desbloquea aquí. La guía Important Tips retoma aquí.

• Tier 3 · Día 12-47: Aqualis se desbloquea (Ocean Palace Ruins, ~580K CP) y empieza la Season 1. Avance de tercera clase en el Lv.82 a Berserker / Paladin / Archmage / Arcanist. Se desbloquea el reclassing. Aquorigin Shrine ~Día 24, Season Power en el Lv.100. Hellhold ~Día 33 (dura ~2 semanas antes de que las fusiones de servidores transicionen a Loong Haven). La mayoría de los sistemas que deciden el poder de fin de juego están aquí.

• Tier 4 · Día 47+: Loong Haven se desbloquea — empieza la Season 2. Avance de cuarta clase en el Lv.106 a Conqueror / Guardian / Destroyer / Dominator. El ritmo de la temporada se ralentiza. La moneda permanente se convierte en el acarreo significativo a largo plazo a través del próximo reinicio de temporada.

Por qué importa esto. El consejo de build y las tier lists de habilidades cambian entre tiers. Un objetivo de reroll de T1 como Heavy Impact no es lo mismo que un asesino de bosses de T2; la prioridad de estadísticas de Sorcerer en T2 difiere de la prioridad de estadísticas de Sorcerer a largo plazo. Cuando leas cualquier guía de SxS en este sitio o en otro lugar, comprueba para qué tier está escrita.', 'https://eog.gg/games/sword-x-staff/guides/beginner-guide/', false, array[]::text[]),
    (v_guide, 8, 'Los pulls de habilidades alimentan el avance de clase', 'Un error F2P común es sentarse sobre cada pull de habilidad "para guardar para después." Eso funciona para Stellatie (ver abajo), pero los 10-pulls gratis de Wish Goddess Statue son diferentes. El avance de clase requiere que realmente tengas habilidades en el pool para mejorar. Moverse entre tiers de avance de clase (p. ej., 2ª clase → 3ª clase) requiere alcanzar un umbral de nivel de clase que no puedes alcanzar sin gastar las habilidades que ya has sacado.

Reclama cada 10-roll gratis diario. Gasta los rolls de mejora de habilidad en la rama de clase a la que realmente te comprometiste. Acumula Dawnium y Stellatie, no los drops de habilidad de los rolls gratis.', 'https://eog.gg/games/sword-x-staff/guides/beginner-guide/', false, array[]::text[]),
    (v_guide, 9, 'Sube de nivel los slots, no las habilidades individuales', 'Las habilidades y el equipo en Sword x Staff están en slots. El nivel se aplica al slot, no a la habilidad individual ni a la pieza de equipo. Cambiar una nueva habilidad a un slot subido de nivel hereda el nivel del slot. Esto cambia las matemáticas de mejora del juego temprano: mejora los slots sin miedo a dejar obsoleto el trabajo cuando cambies los contenidos.

Regla práctica para la semana 1: mantén tus cuatro slots de habilidad activos y cuatro slots de equipo subidos de nivel de forma más o menos pareja. Un slot maximizado con una habilidad pasable dentro hace más trabajo que cuatro slots con poco nivel con una habilidad perfecta en uno de ellos. Inclínate hacia tu slot más usado solo después de que cada slot activo esté al mismo nivel.', 'https://eog.gg/games/sword-x-staff/guides/beginner-guide/', false, array[]::text[]),
    (v_guide, 10, 'No gastes Stellatie en Verdantglade', 'Esta es la mayor trampa de todas. El orbe azul (Standard banner) saca de cada habilidad del juego y tiene un contador de pity. El orbe rosa (Premium banner) saca solo las habilidades de tu clase, tiene un pool más pequeño, y solo se desbloquea en Cinder Ridge o más adelante. Si aún no has encontrado el orbe rosa, eso es normal.

Las habilidades disponibles en el primer tier de trabajo no se mantienen hacia adelante. Cada habilidad de fin de juego a largo plazo viene de avances de clase posteriores. Gastar Dawnium para comprar Stellatie en Verdantglade para rolear por habilidades de tier más alto ahora es el error más común que mata a los F2P.

• Free-to-play: No compres Stellatie con Dawnium. Guarda Dawnium y Radiant Stars hasta al menos Cinder Ridge; guarda los Skill Shard Vouchers aún más tiempo — idealmente Tier 3 (Aqualis) o más tarde, ya que las habilidades de tier Cinder Ridge se reemplazan de nuevo en el siguiente avance.

• Gastadores solo de fondo: Igual. Acumula. Tu presupuesto no puede seguirle el ritmo a los rerolls de habilidad en esta etapa.

• Compradores de bundles emergentes: Saca hasta que llegues a calidad Miracle en una habilidad de lanzamiento, luego para. Guarda el resto para el siguiente mapa.

• Grandes gastadores: Empieza a pre-comprometer pulls para habilidades de calidad Mythic ahora. Los hitos de Voucher recompensan acumular.

• Jugadores que priorizan la diversión: Gasta en lo que haga más daño. Solo ten en cuenta que no importará a largo plazo.

Skill Shard Vouchers: guárdalos para Tier 3 (Aqualis) o más tarde. Quemarlos en Tier 2 (Cinder Ridge) desperdicia el valor del voucher — las habilidades de 2ª clase quedan superadas por las habilidades de 3ª clase que vas a querer canjear de todos modos. T3 es el objetivo de quema sensato más temprano; T4 es aún más seguro.', 'https://eog.gg/games/sword-x-staff/guides/beginner-guide/', false, array[]::text[]),
    (v_guide, 11, 'Checklist de las primeras 24 horas', '• Reclama el 10-pull diario. Sword x Staff otorga un 10-roll gratis en la Wish Goddess Statue cada día que inicies sesión. No te saltes ni un día.

• Quema tus recompensas de inicio de sesión del lanzamiento y los pulls del collab de KonoSuba. El collab es la mayor ventana de pulls gratis que la build global ha mostrado hasta ahora, con pulls repartidos entre el inicio de sesión y los hitos de evento.

• Empuja la exploración del mapa. Cada Goddess Statue activada esta semana paga EXP acumulada más adelante. Mayor apalancamiento que cualquier otra actividad del día 1.

• Elige una clase y empuja hacia Cinder Ridge. Drasilgard es el primer pueblo alcanzado en Verdantglade; tu avance de segunda clase (Duelist / Knight / Sorcerer / Sage) espera en Cinder Ridge una vez que llegues al Lv.44 — el primer trozo real de poder del kit.

• Únete a un gremio en cuanto llegues al nivel 15. Recursos, buffs de estadísticas y drops del Guild Boss. Progreso gratis que no cuesta nada reclamar.

• Quema stamina en Rolla primero. Rolla es el cuello de botella temprano para las compras de refresh de tienda y la mayoría de las recetas de crafteo de principiante. Corre los nodos de stamina de Rolla antes que nada cuando la stamina llegue al tope.

• Compra Destiny Fruits cuando el Treasury las ofrezca. Un evento futuro requiere 300. Los F2P deberían empezar a acumular el primer día. Los whales generan suficientes a través de las corridas de mazmorra y no necesitan pensar en ello.

• No uses Dawnium en Stellatie. Acumula para Cinder Ridge.

• No te apresures con la Auction House en el nivel 40. El equipo en la Auction House temprana se reemplaza dentro de uno o dos reinos. Guarda Dawnium para los refreshes de mazmorra en su lugar. La escalera detallada de refresh de mazmorra está en la guía Daily Dungeons.

• Configura la asignación de gremio al Smelting Workshop. Por defecto en Verdantglade. Otros edificios de producción se abren una vez que entiendas la economía de compañeros bestia en reinos posteriores.

• Haz la Fantasy Ladder diaria una vez. Sin recompensas de ranking. Solo toma las diarias y para. Si una etapa que termina en 4 o 9 te bloquea, eso es lo esperado y el Discord de EOG tiene consejos consolidados de despeje de etapas.', 'https://eog.gg/games/sword-x-staff/guides/beginner-guide/', false, array[]::text[]);
end
$IMPERIUM$;

do $IMPERIUM$
declare
  v_game uuid;
  v_guide uuid;
begin
  select id into v_game from public.games where slug = 'sword-x-staff';
  if v_game is null then
    raise exception 'IMPERIUM: juego no encontrado: %', 'sword-x-staff';
  end if;

  -- Reemplazo idempotente. OJO: borra los pasos -> reinicia step_progress de esta guía.
  delete from public.guide_steps where guide_id in (
    select id from public.guides where game_id = v_game and slug = 'reroll-guide');
  delete from public.guides where game_id = v_game and slug = 'reroll-guide';

  insert into public.guides
    (game_id, slug, title, description, order_index, is_published, intro_title, intro, intro_images)
  values
    (v_game, 'reroll-guide', 'Guía de Reroll de Sword x Staff', 'Cuándo hacer reroll, cuándo no, y qué skills priorizar en las aperturas de Warrior y Mage. Por qué quedar atado a un servidor suele pesar más que la ventaja, el bucle de reroll de 15-20 minutos, objetivos concretos (Heavy Impact, Water Assault) y las condiciones para parar.', 2, false, 'Lee Esto Antes De Hacer Reroll', 'Sword x Staff tiene capacidad de servidor limitada. Hacer reroll implica abandonar tu servidor inicial, y una vez que un servidor llega a su tope ya no puedes unirte a él más tarde. Si tus amigos o tu guild ya están en un servidor, hacer reroll puede dejarte fuera de jugar con ellos de forma permanente. La decisión no va solo de pulls. Lee la sección ¿Deberías hacer reroll? antes de abrir una cuenta nueva.

Un árbol de decisión enfocado en si hacer reroll y qué priorizar si te decides. La verdad que la mayoría de guías de reroll esconden: en Sword x Staff la curva para alcanzar al resto es corta y quedar atado al servidor es permanente, así que las cuentas rara vez favorecen el reroll a menos que tengas un objetivo muy concreto y ningún compromiso social con el servidor de lanzamiento.', array[]::text[])
  returning id into v_guide;

  insert into public.guide_steps
    (guide_id, order_index, title, content, source_url, is_verified, images)
  values
    (v_guide, 1, '¿Deberías Hacer Reroll?', 'Tres preguntas lo deciden. Respóndelas con honestidad antes de abrir una cuenta nueva.

• ¿Tus amigos o tu guild ya están en un servidor concreto? Si la respuesta es sí, no hagas reroll. Los servidores se llenan. El riesgo de quedar fuera y no poder unirte a ellos es mayor que la ventaja de un skill Legendary extra.

• ¿Tienes un skill objetivo concreto en mente? Si la respuesta es no, no hagas reroll. Hacer reroll sin un objetivo es hacer reroll buscando "buenos pulls" en general, lo cual estadísticamente es lo mismo que simplemente jugar y reclamar las recompensas diarias.

• ¿Te vas a comprometer con Warrior o Mage a largo plazo? El reclassing se desbloquea en Aqualis pero no es sin pérdidas: los skills se cambian uno por uno del mismo tipo (así que los jugadores F2P caen por RNG en skills de la clase objetivo que no poseen) y el ajuste de stats específico de cada clase no se transfiere limpiamente. El pool de skills de lanzamiento sigue importando menos que las ocho semanas de progresión que te saltarías al hacer reroll, pero tampoco es un reinicio gratis más adelante.

La ventana para alcanzar al resto es corta. Los que no hacen reroll reciben las recompensas de login de lanzamiento, los pulls de la colaboración con KonoSuba repartidos en hitos, y los 13 códigos de canje activos dentro de su primera semana. Después del día 7-10 la diferencia entre una cuenta con reroll y una cuenta normal es lo bastante pequeña como para que el coste social del reroll suela pesar más que el beneficio.', 'https://eog.gg/games/sword-x-staff/guides/reroll-guide/', false, array[]::text[]),
    (v_guide, 2, 'Cómo Funciona Una Vuelta De Reroll', 'Si decides hacer reroll, el bucle es corto. Cuenta con 15-20 minutos por vuelta.

• Crea una cuenta de invitado. No la vincules a correo ni a redes sociales en el primer intento. Las cuentas de invitado te permiten rotar de forma limpia sin gastar credenciales.

• Pasa el tutorial. El tutorial incluye 10 pulls forzados. Salta cada cinemática que tenga botón de saltar.

• Reclama las recompensas del correo de lanzamiento. Los pulls de compensación, el regalo de fundador y cualquier paquete de promoción cruzada llegan a tu buzón del juego al empezar.

• Canjea los códigos de lanzamiento. Los 13 códigos actualmente activos están listados en la pestaña Codes. La mayoría dan un paquete de Stellatie + Destiny Fruit + Rare Auroral Badge.

• Tira en el banner de lanzamiento. Pulls de 10 en el Standard hasta agotar tu pool de pulls. Aproximadamente 45 pulls gratis más los 10 forzados del tutorial, antes de los códigos.

• Compara tus resultados con la lista de objetivos de abajo. Para y comprométete si consigues un objetivo. Si no, reinicia borrando la caché de la app o cerrando sesión de la cuenta de invitado.

Vincula tu cuenta final. Una vez que tengas los pulls que querías, vincúlala a un correo o cuenta social permanente de inmediato. Las cuentas solo de invitado pueden borrarse al reinstalar la app o al cambiar de dispositivo.', 'https://eog.gg/games/sword-x-staff/guides/reroll-guide/', false, array[]::text[]),
    (v_guide, 3, 'Objetivos De Reroll Para Mage', 'Mage se abre hacia Sorcerer o Sage en el segundo avance de clase (Lv.44, en Cinder Ridge). La lista de reroll de lanzamiento asume que vas a ir Sorcerer, que es el camino más amigable para F2P. Los objetivos de Sage se solapan mucho, así que esta lista sigue siendo válida si cambias más tarde.

• Water Assault. La mejor apertura para Mage, sin discusión. AoE amplio con un daño respetable, y la etiqueta Water sinergiza con el charm Water to Ice. Es multi-hit, lo que significa que contra enemigos medianos y grandes puede golpear al mismo objetivo varias veces. Lo más parecido a un "obligatorio" en la tirada de Mage.

• Gale Shield. La mejor protección temprana de Mage. Nota: Sorcerer acaba reemplazándolo por Void Bubble (una versión más fuerte), así que Gale Shield es bueno ahora pero no es un slot permanente.

• Charm Water to Ice. Empareja directamente con Water Assault. Si consigues ambos en la misma apertura, el daño Water multi-hit te lleva a través de casi todo Verdantglade.

• Mana Surge. Buena pasiva general de Crit. Útil en cualquier build de Mage, incluido el eventual cambio a Sage.

Qué ignorar en la tirada de Mage. Los skills de objetivo único del lado Mage (Fireball, Frost Spear) son provisionales durante las primeras semanas. Los reemplaza el segundo job tier. No hagas reroll por ellos.', 'https://eog.gg/games/sword-x-staff/guides/reroll-guide/', false, array[]::text[]),
    (v_guide, 4, 'Objetivos De Reroll Para Warrior', 'Warrior se abre hacia Duelist o Knight. Los objetivos de abajo asumen Duelist, que es la rama más popular y la opción de DPS con mayor techo.

• Heavy Impact. El mejor matabosses de objetivo único de T1 del juego. Si tu cuenta saca Heavy Impact, deja de hacer reroll. Es el pull de Warrior de mayor valor en el lanzamiento.

• Mountain Collapse. La mejor opción de AoE, pero colócala al final de tu rotación de skills. Su empuje desplaza a los enemigos fuera de posición y puede arruinar los skills de AoE siguientes si la lanzas pronto.

• Whirlwind Slash. El otro AoE esencial. Empareja de forma limpia con Quadrant Slash y encaja en cualquier rotación de limpieza de Duelist.

• Blade of Lament. Un robo de vida valioso para el contenido en solitario. Empuja a un Duelist a través de los muros del Fantasy Ladder sin obligarte a una build de tanque.

• Counter Blade. Daño pasivo. Una aportación siempre activa que no ocupa un hueco en la rotación.

Qué ignorar en la tirada de Warrior. Los skills de utilidad orientados a Knight (Guard Defense, Charge Assault) están bien pero no son de nivel reroll. Se vuelven útiles si te comprometes con Knight, pero el pool de la tirada de Warrior se aprovecha mejor persiguiendo skills de DPS del lado Duelist.', 'https://eog.gg/games/sword-x-staff/guides/reroll-guide/', false, array[]::text[]),
    (v_guide, 5, 'Condiciones Para Parar', 'Dos condiciones por las que vale la pena parar. Tirar buscando la apertura perfecta desperdicia horas que cuentan en contra de tu progresión.

• Un objetivo nombrado más una carta de apoyo. Heavy Impact + Counter Blade. Water Assault + charm Water to Ice. Cualquiera de las dos parejas es suficiente para comprometerte.

• Tres aciertos razonables. Si sacas tres de los objetivos nombrados arriba, esa cuenta es mejor que el 95% de las cuentas nuevas. Para y vincúlala.

No persigas un Legendary que no necesitas. El pity del standard banner es de 70 pulls para un Legendary garantizado, pero solo consigues unos 55 pulls durante la ventana de reroll. Una sola cuenta con mala suerte no justifica otro ciclo de reinicio de 20 minutos.', 'https://eog.gg/games/sword-x-staff/guides/reroll-guide/', false, array[]::text[]),
    (v_guide, 6, 'Qué Hacer Si No Deberías Hacer Reroll', 'Si recorriste el árbol de decisión y la respuesta fue "no hagas reroll", esa es la opción por defecto fuerte. El tiempo que gastarías en el reroll está mejor invertido en otra parte:

• Empuja la exploración del mapa. Las Goddess Statues se acumulan con efecto compuesto. Mira la Beginner Guide para entender por qué esto supera a cualquier otra actividad del día 1.

• Canjea los códigos activos. 13 actualmente activos. Aproximadamente 200 Dawnium, 13 Destiny Fruits y 13 Stellatie repartidos en los paquetes estándar. Cada código tarda unos 10 segundos.

• Únete a una guild al nivel 15. Los drops del Guild Boss incluyen Skill Shard Vouchers, que es el camino de adquisición de skills de mayor calidad en el juego temprano fuera de Cinder Ridge.', 'https://eog.gg/games/sword-x-staff/guides/reroll-guide/', false, array[]::text[]);
end
$IMPERIUM$;

do $IMPERIUM$
declare
  v_game uuid;
  v_guide uuid;
begin
  select id into v_game from public.games where slug = 'sword-x-staff';
  if v_game is null then
    raise exception 'IMPERIUM: juego no encontrado: %', 'sword-x-staff';
  end if;

  -- Reemplazo idempotente. OJO: borra los pasos -> reinicia step_progress de esta guía.
  delete from public.guide_steps where guide_id in (
    select id from public.guides where game_id = v_game and slug = 'important-tips');
  delete from public.guides where game_id = v_game and slug = 'important-tips';

  insert into public.guides
    (game_id, slug, title, description, order_index, is_published, intro_title, intro, intro_images)
  values
    (v_game, 'important-tips', 'Consejos Importantes de Sword x Staff', 'Más allá de la Guía para Principiantes. Viabilidad de clases, mejoras del carro, reglas de inversión en Fantomons, resonancia de relics, NPC Misterioso + Primal Forge, estrategia de tickets de Arena, refresco de tienda, orden de gasto y trampas del juego a largo plazo.', 3, false, 'Más Allá de la Guía para Principiantes', 'Consejos Importantes retoma donde lo deja la Guía para Principiantes. Decisiones de build específicas por clase, prioridades de carro y relics, la regla del NPC Misterioso, la cadencia de refresco de tienda, la estrategia de Arena y el orden de gasto en la tienda de lanzamiento. Léelo de principio a fin, o salta a la sección en la que esté tu cuenta.', array[]::text[])
  returning id into v_guide;

  insert into public.guide_steps
    (guide_id, order_index, title, content, source_url, is_verified, images)
  values
    (v_guide, 1, 'Decisiones de Clase y Build', '• Sage solo tiene un build viable: Dark . El Sorcerer Light es una elección solo para PvP. Los builds de Summoner y Healer no son viables en el parche global actual.

• Duelist es la elección segura y popular. La mayoría de la base de jugadores lo está usando. Knight funciona bien y se mantiene demandado porque los tanques serán escasos en el contenido de grupo.

• Un jugador F2P no puede permitirse dos elementos. Las relics solo otorgan un 10-15% de bonus de elemento, así que dividir la afinidad cuesta un daño serio y ralentiza tu enfoque en subir de nivel las skills. Elige un elemento y termínalo.', 'https://eog.gg/games/sword-x-staff/guides/important-tips/', false, array[]::text[]),
    (v_guide, 2, 'Mejoras del Carro', 'El carro produce recursos que se solapan con los de las mazmorras, además de equipo y alimento para bestias. Prioridad de mejora por nivel de producción:

• Máxima prioridad: Madera + Piedra. Sirven para mejorar casi todo lo demás del juego. El rendimiento más barato y la vida útil más larga. Mejóralos primero sin importar tu clase.

• Siempre en demanda: Chrono Sand + Raw Ore. Alimentan las recetas del carro y de stamina. Nunca se desperdician.

• Condicional: Rolla. Su prioridad escala según lo agresivo que seas con el refresco de tienda. Si haces 3 o más refrescos al día, sube Rolla. Si no, déjalo.

• Menor prioridad: Battle Essence + Basic Treats. Ambos tienen fuentes alternativas (drops de mazmorra, Treasury). El carro no es el cuello de botella para ninguno.

Principio de enfoque. Elige una estrategia de carro y mantenla. Los recursos en los que te enfoques deberían estar aproximadamente un 20-30% más altos que los demás durante toda la temporada. Subir el carro de forma uniforme reparte el rendimiento de forma muy fina y nunca rompe ningún cuello de botella.

Si tienes objetivos específicos de clase (por ejemplo, sabes que te vas a comprometer con Sorcerer y necesitas más alimento de Fantomon de tipo ataque), inclina ese 20-30% enfocado hacia el tipo de alimento que corresponda.', 'https://eog.gg/games/sword-x-staff/guides/important-tips/', false, array[]::text[]),
    (v_guide, 3, 'Reglas de Inversión en Fantomons', 'Los Fantomons se desbloquean al nivel 50 y son el mayor pico de poder fuera del equipo en Cinder Ridge. La trampa es tratarlos como un único conjunto. Tres reglas deciden si tu inversión se acumula o se desperdicia.

• La ranura de stat principal no es lo mismo que la ranura de combate. La ranura de stat principal otorga el 100% del bloque de stats de un Fantomon. Las tres sub-ranuras otorgan el 50% . El resto de la colección otorga el 20% . Pon tu Fantomon más raro en la ranura de stat principal. El despliegue del lado de combate es una decisión aparte y debe coincidir con el rol que estés jugando.

• Mantén nivelados de forma pareja los Fantomons desplegados. La resonancia aplica el nivel más bajo entre tus cuatro Fantomons desplegados al resto de tu colección. Un roster a 50/50/50/20 escala efectivamente como si cada bonus de colección estuviera al nivel 20. Sube el suelo antes de empujar el techo.

• La evolución Mythic necesita tres copias en total. Aegiswing y Nyxarchon cuestan 60 Bond Trinkets por copia. La trampa: un solo Mythic se topa al nivel 100. Alcanzar el nivel 108 requiere 120 dupe shards — eso son 2 copias duplicadas además de la base, así que 3 copias en total = 180 Bond Trinkets . Presupuesta los 180 completos antes de comprometerte, no 60.

Fantomons útiles por rol. Knight : Boaro (escudos) y Armopi (tanqueo). Limpieza AoE de Duelist / Sorcerer: Falko o Zeioletus. Sage : Mandragora (curación) y Herbote (limpieza de estados). Elección universal cuando los enemigos acumulan buffs: Kels (dispel).', 'https://eog.gg/games/sword-x-staff/guides/important-tips/', false, array[]::text[]),
    (v_guide, 4, 'Relics y Resonancia', 'Los jugadores F2P conseguirán todas las relics azules y moradas para aproximadamente el 70% del pool de relics de Verdantglade. Los jugadores de pago deberían recoger las naranjas (Mythic) y por debajo para aproximadamente un 90% de cobertura. Si puedes elegir una relic Mythic seleccionable, Duelist / Sorcerer / Sage toman Crit Rate . Knight toma Block .

Resonancia. Cada elemento resuena con cuatro relics. Sube las cuatro de un elemento al mismo nivel y todas las relics no resonantes de ese elemento suben de nivel al mismo tiempo. No repartas las mejoras entre varios elementos. Elige uno y termínalo.

Prioridad de elemento por clase:

• Duelist : Fire o Dark

• Knight : Water o Light

• Sorcerer : Light o Fire

• Sage : Dark

Relic Hero''s Guide. Se desbloquea en el Stellaris Path — ya sea mediante gasto de vouchers o compras directas de packs. Aumenta tu ganancia de experiencia y resuena con otras relics para un bonus adicional del 20%. Lo más parecido a un muro duro de pagar-para-progresar en Verdantglade, y la curva de EXP se acumula a lo largo de cada reino que sigue.', 'https://eog.gg/games/sword-x-staff/guides/important-tips/', false, array[]::text[]),
    (v_guide, 5, 'Mazmorras Diarias (Referencia Rápida)', 'Las Mazmorras Diarias son la fuente principal de equipo y Gear Shards. Dos tiradas gratis al día, más dos refrescos de pago accesibles para F2P a 100 y 150 Dawnium . Las ranuras de refresco adicionales más allá de la tirada 4 se desbloquean mediante niveles de tarjetas mensuales y packs. Una vez que el equipo realmente importa (transición de Verdantglade → Cinder Ridge), la escalera de cuatro tiradas para gastadores medios es el gasto de Dawnium más limpio del juego.

• El ranking se basa en hasta dónde llegas. No en qué nodos eliges. Optimiza tu ruta para llegar al jefe en lugar de escoger nodos «más seguros».

• Desmantela los shards de mazmorras antiguas en cuanto se desbloquee una nueva mazmorra. Los shards de la mazmorra anterior pierden su valor de venta tan pronto como abre el reemplazo. Después de eso solo se pueden desmantelar.

• Escalera de refresco de mazmorras de material. Gastador F2P / ligero 2/2/2/2 al día. Gastador medio 4/2/4/4 (el 2 va en el material que tu clase menos necesite). 1.000$/mes 6/6/6/6. 3.000$/mes 8/8/8/8. 5.000$/mes o los que persiguen título de temporada 10/10/10/10.

• Las tiradas se acumulan hasta 6. Acumula-y-explota F2P: salta 4 intentos a lo largo de días flojos, luego compra 2 refrescos de pago en un día de explosión. El tope es fijo en 6 — lo que se desborde se pierde.

El desglose completo, incluyendo qué mazmorra priorizar por clase y las cuentas de gasto en refrescos de Dawnium, está en la guía de Mazmorras Diarias .', 'https://eog.gg/games/sword-x-staff/guides/important-tips/', false, array[]::text[]),
    (v_guide, 6, 'Horario de Refresco de Tienda', '• Antes de que abra Aqualis: F2P refresca una vez al día, vacía la tienda.

• Durante Loong Haven: refresca dos veces, vacía la tienda.

• Después de que abra Loong Haven: compra solo los artículos al 80% de descuento, refresca hasta tres veces.

• Ballenas: escala el número de refrescos a tu total de material de Mystery Realm. Cuanto mayor sea el stock, más refrescos.', 'https://eog.gg/games/sword-x-staff/guides/important-tips/', false, array[]::text[]),
    (v_guide, 7, 'NPC Misterioso: Solo Primal Forge', 'El día después de que termine la Chaos Invasion, aparece un NPC Misterioso en tu Home. Puedes gastar Chaos Crystals en su tienda. SOLO compra el Primal Forge. Nada más. Esta regla se aplica a todos los jugadores sin importar su nivel de gasto.

• No compres nada más. Cualquier otro artículo de la tienda es una trampa en este punto del reino.

• Mejora el Primal Forge hasta el final, hasta Immortal. Cualquier cosa por debajo y los crystals se desperdician en un nivel temporal.

• Si no puedes permitírtelo: guarda tus Chaos Crystals, echa al NPC y sigue intercambiando en el siguiente ciclo. No gastes en pánico en alternativas.

Por qué es tan estricto. El Primal Forge es el único artículo de la tienda de Chaos que se acumula a lo largo de los reinos. Cualquier otra compra es reemplazada o queda obsoleta por las recompensas de Cinder Ridge, así que gastar en ellas hace retroceder tu cuenta.', 'https://eog.gg/games/sword-x-staff/guides/important-tips/', false, array[]::text[]),
    (v_guide, 8, 'Estrategia de Tickets de Arena', 'El refresco de PvP es semanal. La semana reinicia la escalada, lo que permite que los empujes de principio de semana agarren rangos altos antes de que los rosters de nivel ballena fijen la cima en su sitio.

• Día 1 de una semana nueva: suelta los 20 tickets guardados de inmediato. Todos los demás todavía están escalando. Agarras un rango alto y ganas diamantes diarios gratis durante el resto de la semana.

• Después de la semana 1, deja de pelear. Los rankings se fijan por poder. Guarda los tickets para el siguiente reinicio.

• Comprar tickets extra en un solo día cuesta más Dawnium por ticket. El máximo beneficio significa comprar casi cero tickets después de la semana 1.', 'https://eog.gg/games/sword-x-staff/guides/important-tips/', false, array[]::text[]),
    (v_guide, 9, 'Orden de Gasto Si Abres la Cartera', 'Del mejor valor al peor valor en toda la tienda de lanzamiento.

• Monthly card. El mejor valor para gasto bajo. Aumenta las ganancias AFK y la EXP.

• Month Fund. El segundo mejor.

• Weekly Card. El tercero.

• Pop-up packs. El último. Evítalos a menos que necesites específicamente su contenido.

Vouchers vs puntos VIP. Los vouchers se convierten directamente en valor equivalente a dinero. Los puntos VIP solo se acreditan cuando realmente gastas, así que no acumules vouchers esperando que el track VIP los alcance.', 'https://eog.gg/games/sword-x-staff/guides/important-tips/', false, array[]::text[]),
    (v_guide, 10, 'Trampas del Juego a Largo Plazo', '• No hagas reroll. Los nombres son únicos y no hay ningún beneficio de reroll integrado en el juego.

• No subas de nivel ni mejores en exceso al principio. Pasados ciertos umbrales, el poder se reinicia al final de temporada. Solo la moneda permanente ( Astral ) se conserva. Los F2P tienen efectivamente cero posibilidades de rango en la temporada 1, así que relájate y aprende los sistemas en lugar de farmear.

• Los nuevos avances de clase vienen con sus propias tiradas de skills premium. Cada nueva clase abre un pseudo-banner que solo alimenta el nuevo pool, así que guarda tiradas antes de cada nuevo nivel de clase.

• El cariño se topa en 1000 por semana en las invocaciones. El exceso se sigue acumulando como corazones de perfil, pero no puedes arrastrar el cariño sobrante a la reclamación de la semana siguiente.', 'https://eog.gg/games/sword-x-staff/guides/important-tips/', false, array[]::text[]);
end
$IMPERIUM$;

do $IMPERIUM$
declare
  v_game uuid;
  v_guide uuid;
begin
  select id into v_game from public.games where slug = 'sword-x-staff';
  if v_game is null then
    raise exception 'IMPERIUM: juego no encontrado: %', 'sword-x-staff';
  end if;

  -- Reemplazo idempotente. OJO: borra los pasos -> reinicia step_progress de esta guía.
  delete from public.guide_steps where guide_id in (
    select id from public.guides where game_id = v_game and slug = 'gacha-and-pity');
  delete from public.guides where game_id = v_game and slug = 'gacha-and-pity';

  insert into public.guides
    (game_id, slug, title, description, order_index, is_published, intro_title, intro, intro_images)
  values
    (v_game, 'gacha-and-pity', 'Referencia de Gacha y Pity (garantía) de Sword x Staff', 'Probabilidades de drop y umbrales de pity (garantía) de cada pool de tiradas de Sword x Staff. Standard banner Wish (probabilidades 1/7/22, pity 10/30/70, mileage de 200 tiradas), Premium banner Prayer (bloqueado por clase, moneda de pity Covenite), Relic banner (regla de colección del 50-70%) y Fantomon banner (SSR 0,8%, pity 80, 120 Bond Trinkets en duplicados para la evolución Mythic a nivel 108).', 4, false, 'El pity es la palanca del gasto', 'Sword x Staff tiene cuatro pools de tiradas (skills Standard, skills Premium bloqueadas por clase, Relics y Fantomons). Usan monedas distintas y umbrales de pity (garantía) distintos. Los números de pity de abajo son el presupuesto con el que dimensionas cualquier otra decisión de gacha. Si los ignoras, gastas el doble por el mismo resultado.

Una única página de referencia para cada pool de gacha de Sword x Staff. Cada sección lista las probabilidades, los umbrales de pity, la moneda y la regla de tirada recomendada por EOG. Léela de arriba abajo o salta al banner en el que estés tirando ahora mismo.', array[]::text[])
  returning id into v_guide;

  insert into public.guide_steps
    (guide_id, order_index, title, content, source_url, is_verified, images)
  values
    (v_guide, 1, 'Standard banner (Orbe azul)', 'Tira de todas las skills del juego. El pool más grande, la tasa de acierto individual más baja, pero el único pool que te da skills a las que aún no tienes acceso.

• Legendary: 1% de probabilidad base. Pity (garantía) a las 70 tiradas.

• Epic: 7% de probabilidad base. Pity a las 30 tiradas (Epic o superior).

• Rare: 22% de probabilidad base. Pity a las 10 tiradas (Rare o superior).

• Mileage de 200 tiradas: el primer gran objetivo de mileage del Standard. Skill Legendary T1 a elegir. Guarda Stellatie para caer en este objetivo en lugar de perseguir Legendaries sueltas con tiradas en bruto.

Regla de tirada. 10-rolls gratis a diario, sin excepciones. Las compras de Stellatie de pago en Verdantglade son una trampa (mira la Guía para principiantes). Reserva el gasto de pago para Cinder Ridge, donde se desbloquea el Premium banner y el pool objetivo se reduce.

El pity no se reinicia al cambiar de clase. Tu contador de pity del Standard banner (la barra de 70 tiradas de Legendary) es a nivel de cuenta, no está ligado a la clase. Cambiar de clase en Aqualis no borra el progreso hacia la siguiente Legendary. Esto hace que el objetivo de mileage de 200 tiradas sea más seguro de perseguir de lo que parece, incluso si todavía estás decidiendo entre ramas de clase.', 'https://eog.gg/games/sword-x-staff/guides/gacha-and-pity/', false, array[]::text[]),
    (v_guide, 2, 'Premium banner (Orbe rosa)', 'Bloqueado tras superar Verdantglade y llegar al siguiente mapa. Si todavía no lo encuentras, es lo esperado.

• Moneda: Covenite, no Stellatie. Covenite es una moneda de pity: la generas quemando Stellatie en el Standard banner (cuanta más Stellatie tiras, más Covenite te va volviendo poco a poco).

• Pool: solo las skills de tu clase. Pool más pequeño, mayores probabilidades por tirada de conseguir drops útiles. La razón estructural por la que este banner es el objetivo de gasto a largo plazo.

• Seleccionable por clase. Una vez que has desbloqueado el avance de segundo nivel, puedes elegir de qué pool de clase tira el banner.

• No canjees pronto los Skill Shard Vouchers por skills T1 o T2. Los vouchers de inicio de partida se convierten en Legendaries a elegir. El inicio del juego ya te da muchas tiradas Standard gratis, así que gastarlos en skills de primer nivel desperdicia el valor del voucher, que de todas formas acaba siendo reemplazado. Guárdalos para el tercer nivel en adelante.', 'https://eog.gg/games/sword-x-staff/guides/gacha-and-pity/', false, array[]::text[]),
    (v_guide, 3, 'Relic banner (Por reino)', 'Cada reino tiene su propio relic banner. Las Relics controlan el sistema de bonus de resonancia (cuatro relics del mismo elemento activan la resonancia, que sube de nivel todas las relics no resonantes de ese mismo elemento). La regla de tirada de las relics se basa en la colección, no en la suerte.

• Regla de colección del 50-70%. Quédate en el relic banner de cada reino hasta alcanzar aproximadamente el 50-70% de la colección de relics de ese reino. Luego pasa al siguiente.

• ¿Por qué 50-70% y no 100%? Rendimientos decrecientes. El primer 50% del pool de relics de un reino cubre todas las resonancias y la mayoría de los bonus de set. El último 30% son duplicados y cobertura menor de estadísticas.

• ¿Por qué no menos del 50%? Los bonus de resonancia requieren los cuatro slots de un elemento. Tirar el 30% de un reino y pasar al siguiente deja la resonancia sin completar, lo que cuesta un escalado de daño muy superior a cualquier progreso logrado en el pool de relics del siguiente reino.

Los F2P toparán con huecos de relics azules y moradas en torno al 70% de completado de la galería. Los jugadores de pago llegan al 90% incluyendo las relics Mythic. Una vez que las tiradas se ralentizan, cambia a Destiny Exploration en la ubicación indicada de la relic que falta para rellenar el resto: mira la guía de Destiny Fruit para el ejemplo de tres pasos.', 'https://eog.gg/games/sword-x-staff/guides/gacha-and-pity/', false, array[]::text[]),
    (v_guide, 4, 'Fantomon banner', 'Los Fantomons se desbloquean al nivel 50 y usan una moneda distinta de las tiradas de skills. La regla de evolución Mythic es el número más importante de este banner.

• Probabilidad de SSR: 0,8% de probabilidad base.

• Pity de Legendary: 80 tiradas.

• Tienda Mythic: 60 Bond Trinkets por copia. Aegiswing y Nyxarchon son los dos Mythics de la ventana de lanzamiento.

• Evolución Mythic: una sola copia Mythic tiene un tope de nivel 100. La evolución a nivel 108 requiere 120 shards de duplicado, es decir, 2 copias duplicadas además de la base, o 120 Bond Trinkets en duplicados. Planifica los 120 completos antes de comprometerte con un Mythic.

Trampa habitual con los Mythic. Los jugadores gastan 60 Bond Trinkets en Aegiswing pensando que ya está, llegan al nivel 100 y entonces se dan cuenta de que evolucionar a 108 necesita otros 120 Bond Trinkets en duplicados (2 copias más, 60 cada una). Si no puedes permitirte los 120 Bond Trinkets completos en duplicados para el rol que de verdad juegas, no compres un Mythic. Mientras tanto, acumula Fantomons SSR y guarda trinkets.', 'https://eog.gg/games/sword-x-staff/guides/gacha-and-pity/', false, array[]::text[]),
    (v_guide, 5, 'Orden de tirada: qué tirar primero', 'Una prioridad de gasto limpia si tienes moneda en varios pools a la vez:

• 10-rolls gratis del Standard banner. Cada día, sin excepciones. Las tiradas gratis diarias son la mayor fuente de skills a lo largo de la temporada.

• Relic banner del reino activo hasta el 50-70% de la colección.

• Fantomon banner si te estás comprometiendo con un objetivo Mythic. Presupuesta 120 Bond Trinkets en duplicados antes de tirar (evolución completa), no 60.

• Premium banner una vez desbloqueado. El pool más estrecho da mejor valor esperado que las tiradas del Standard banner.

• Tiradas de pago del Standard banner solo después de que el Premium banner esté desbloqueado y solo con un objetivo concreto dentro de la ruta del mileage de 200 tiradas.

Este orden es el predeterminado para F2P. Los niveles de gasto pueden desviarse: los grandes gastadores adelantan los Fantomons Mythic y la relic de la Hero''s Guide (desbloqueo de la Stellaris Path mediante gasto de vouchers o compra directa de packs) porque ambos compuestan a lo largo de cada reino. Mira el orden de gasto de los Important Tips para ese carril.', 'https://eog.gg/games/sword-x-staff/guides/gacha-and-pity/', false, array[]::text[]),
    (v_guide, 6, 'Referencia rápida de monedas', '• Stellatie: Standard banner (orbe azul). Se convierte desde Dawnium en Verdantglade o desde Radiant Stars más adelante.

• Covenite: Premium banner (orbe rosa). Moneda de pity que sale de quemar Stellatie en el Standard banner: cuanto más tiras en el Standard, más Covenite te va volviendo poco a poco. No se puede comprar directamente con Dawnium.

• Destiny Fruit: un uso común: Destiny Exploration — gasta Destiny Fruit en una ubicación concreta para rolar una entrada que falte de la Relic Gallery. Uso secundario: desbloqueos regionales (pociones de vid, llaves, taladros en el vendedor del reino). Mira la guía de Destiny Fruit para el ejemplo de tres pasos.

• Bond Trinkets: Fantomon banner. Cae de eventos temáticos de Fantomon, cadenas de login diario y hitos del collab de KonoSuba.', 'https://eog.gg/games/sword-x-staff/guides/gacha-and-pity/', false, array[]::text[]);
end
$IMPERIUM$;

do $IMPERIUM$
declare
  v_game uuid;
  v_guide uuid;
begin
  select id into v_game from public.games where slug = 'sword-x-staff';
  if v_game is null then
    raise exception 'IMPERIUM: juego no encontrado: %', 'sword-x-staff';
  end if;

  -- Reemplazo idempotente. OJO: borra los pasos -> reinicia step_progress de esta guía.
  delete from public.guide_steps where guide_id in (
    select id from public.guides where game_id = v_game and slug = 'daily-dungeons');
  delete from public.guides where game_id = v_game and slug = 'daily-dungeons';

  insert into public.guides
    (game_id, slug, title, description, order_index, is_published, intro_title, intro, intro_images)
  values
    (v_game, 'daily-dungeons', 'Daily Dungeons de Sword x Staff', 'Cómo correr la Daily Dungeon de Gear y las cuatro dungeons de materiales, la regla de ruteo (te puntúan por hasta dónde llegas, no por los nodos), la escalera completa de refresco con Dawnium (F2P/ligero 2/2/2/2, medio 4/2/4/4, $1k 6/6/6/6, $3k 8/8/8/8, $5k 10/10/10/10), el banco de 6 runs y la fecha límite para desmantelar los Gear Shards viejos.', 5, false, 'Las Daily Dungeons Son La Tubería De Gear', 'Las Daily Dungeons son la fuente principal de Gear y Gear Shards. Tienes 2 runs gratis al día , más dos refrescos con Dawnium accesibles para F2P a 100 y 150 Dawnium . Las casillas de refresco adicionales más allá del run 4 se desbloquean a través de los niveles de Month Fund y de packs mensuales. Los runs no usados se acumulan hasta un tope de 6, así que puedes saltarte los días lentos y reventar en un día objetivo.

Las Daily Dungeons se dividen en dos vías: la Daily Dungeon principal de Gear (suelta la pieza de Gear en sí más Gear Shards para subir de estrellas) y cuatro dungeons de materiales (Raw Ore, Chrono Sand, alimento de Rolla y el consumible específico de tu clase). La estrategia de refresco difiere entre ambas. Esta guía cubre las dos.', array[]::text[])
  returning id into v_guide;

  insert into public.guide_steps
    (guide_id, order_index, title, content, source_url, is_verified, images)
  values
    (v_guide, 1, 'La Regla De Ruteo', 'Dentro de cada dungeon navegas un pequeño grafo de nodos: salas de combate, buffs, fuentes de curación y una sala de jefe al final. Los jugadores nuevos en el género tienden a escoger nodos «más seguros» (salas de curación, packs de mobs más pequeños) pensando que conserva HP para el jefe.

Ese modelo de ranking no es como te puntúa el juego. El ranking de la dungeon se calcula según hasta dónde llegas , no según qué nodos limpiaste por el camino. Rutear directo al jefe, incluso atravesando una sala de combate más difícil, puntúa más alto que jugar a lo seguro y terminar a una sala del jefe.

Regla práctica. Escoge el camino más corto a la sala del jefe cada vez. Recibe daño por el camino mientras sobrevivas hasta el jefe. Si no puedes sobrevivir al jefe con tu loadout actual, cambia a un loadout más tanque entre tus siete casillas de loadout antes de entrar a la dungeon. Rutear más difícil no arregla a un personaje con poco gear.', 'https://eog.gg/games/sword-x-staff/guides/daily-dungeons/', false, array[]::text[]),
    (v_guide, 2, 'La Matemática Del Refresco Con Dawnium', 'Dos runs gratis al día. Dos refrescos pagados accesibles para F2P. El precio de pago no es plano.

• Run 1: Gratis.

• Run 2: Gratis.

• Run 3: 100 Dawnium.

• Run 4: 150 Dawnium. El último refresco en la banda accesible para F2P es más caro que el primero.

• Run 5+: Las casillas de refresco adicionales se desbloquean a través de los niveles de Month Fund y de packs mensuales. La escalera de whale (6, 8, 10 runs al día) está bloqueada detrás de gasto mensual, no de puro quemado de Dawnium.

Tope accesible para F2P. 250 Dawnium por dungeon para llegar al run 4. Entre la Daily Dungeon de Gear más las cuatro dungeons de materiales, el límite superior F2P es de 1,250 Dawnium al día. Ese es el presupuesto de gasto contra el que dimensionas la escalera de refresco F2P/medio. Los niveles más altos (6/8/10 runs) requieren además suscripciones de Month Fund o packs mensuales por encima de eso.', 'https://eog.gg/games/sword-x-staff/guides/daily-dungeons/', false, array[]::text[]),
    (v_guide, 3, 'Escalera De Refresco De Las Dungeons De Materiales', 'Las cuatro dungeons de materiales corren en el mismo horario, con los mismos precios de refresco. El orden está condicionado por cuál necesita realmente tu clase actual. Cinco niveles según el gasto mensual:

• F2P / Ligero: 2 / 2 / 2 / 2. Solo runs gratis. Sáltate los refrescos con Dawnium en las dungeons de materiales. Guarda el Dawnium para la Daily Dungeon de Gear y para las compras de nivel Cinder Ridge.

• Gastador medio: 4 / 2 / 4 / 4. Tope tres dungeons de materiales. El «2» va sobre el material que tu clase actual necesite menos (típicamente el consumible específico de la clase cuando estás entre cambios de clase).

• $1,000 / mes: 6 / 6 / 6 / 6. Se desbloquea vía casillas de refresco de Month Fund / packs mensuales por encima de las cuatro accesibles para F2P.

• $3,000 / mes: 8 / 8 / 8 / 8. Un nivel de pack más alto desbloquea dos casillas de refresco adicionales por dungeon.

• $5,000 / mes: 10 / 10 / 10 / 10. La escalera tope de whale. Obligatoria si vas detrás de un título de temporada; opcional en caso contrario, incluso con este gasto.

Cómo leer la escalera. Los números son el total de runs por dungeon de materiales por día. F2P y gasto ligero comparten la misma escalera porque los refrescos F2P igual cuestan Dawnium que normalmente necesitas en otro lado. El gastador medio es el primer nivel donde tiene sentido apretar de verdad el gatillo en los dos refrescos F2P pagados más la casilla extra que te dé el pack mensual que tengas.', 'https://eog.gg/games/sword-x-staff/guides/daily-dungeons/', false, array[]::text[]),
    (v_guide, 4, 'Banco De Runs', 'Los intentos de dungeon no usados se acumulan en vez de desvanecerse. El tope del banco es 6 runs . Esto cambia el patrón de juego F2P.

• Acumular-y-reventar F2P. Sáltate tus runs gratis en los días lentos, deja que los intentos se acumulen, y luego gástalos en una sola sesión en un día objetivo. El patrón limpio es «guarda 4, compra 2 al día siguiente»: sáltate 4 intentos gratis a lo largo de un par de días lentos, y luego compra 2 refrescos pagados en un día de reventón para una sesión más pesada.

• Vigila el tope. El banco aguanta 6. Una vez lleno, los intentos no usados adicionales se pierden de forma permanente. Quema antes de tocar el techo.

• Útil para cambios de clase. Si sabes que viene un cambio y vas a necesitar cambiar qué dungeon de materiales priorizas, acumular te deja redirigir intentos a la dungeon correcta para la clase post-cambio.', 'https://eog.gg/games/sword-x-staff/guides/daily-dungeons/', false, array[]::text[]),
    (v_guide, 5, 'La Daily Dungeon De Gear Es Diferente', 'La Daily Dungeon de Gear suelta equipo real más Gear Shards. La prioridad de refresco en esta dungeon es más alta que en las dungeons de materiales porque:

• El Gear es el recurso que se repone más lento. Los materiales se regeneran. Las piezas de Gear no.

• Los Gear Shards alimentan las subidas de estrellas directamente. El valor marginal de un cuarto run de la Daily Dungeon de Gear es más alto que el de un cuarto run de dungeon de materiales, porque los shards no tienen fuente alternativa.

• Los sets de Gear específicos de clase importan. Si la rotación de dungeon activa está soltando piezas del set de Gear de tu clase, prioriza su ventana de refresco aunque tu presupuesto diario de Dawnium esté corto.

Priorización F2P. Si solo puedes permitirte un refresco pagado al día entre todas las dungeons, gástalo en la Daily Dungeon de Gear, no en runs de materiales.', 'https://eog.gg/games/sword-x-staff/guides/daily-dungeons/', false, array[]::text[]),
    (v_guide, 6, 'Gear Shards Viejos: Desmantela, No Te Quedes Sentado', 'Cada nueva dungeon que se desbloquea reemplaza el pool de loot de la anterior. La economía de shards funciona con un corte duro.

• Antes de que se desbloquee la siguiente dungeon. Los shards viejos se pueden vender en el Guild Market por Dawnium. Retorno decente.

• Después de que se desbloquea la siguiente dungeon. Los shards viejos pierden su listado en el Guild Market. Pasan a ser solo desmantelables por un pequeño reembolso de material.

Disparador para actuar. Cuando veas aparecer la notificación de la nueva dungeon en tu lista de misiones diarias, vende cualquier shard viejo que aún tengas dentro de las 24 horas. De lo contrario, la vía de desmantelar es la única opción que queda y la tasa de conversión es significativamente peor.', 'https://eog.gg/games/sword-x-staff/guides/daily-dungeons/', false, array[]::text[]),
    (v_guide, 7, 'Errores A Evitar', '• No dejes que el banco de runs se desborde. El tope del banco es 6. Una vez que estás en 6 intentos acumulados, cualquier intento no usado adicional se pierde de forma permanente. Quema o refresca antes del techo.

• No «guardes» casillas de refresco con Dawnium para mañana. El Dawnium en sí se acumula. La casilla de refresco por día no. Los refrescos están condicionados por día, los runs están condicionados por el banco con tope de 6.

• No rutees a lo seguro. El ranking es por hasta dónde llegas, no por limpiar todos los nodos como completista. Rutear a lo seguro te cuesta shards de ranking.

• No te quedes sentado sobre Gear Shards viejos pasado el lanzamiento de la nueva dungeon. Ver arriba.

• No pagues Dawnium para refrescar dungeons de materiales antes de haber topado la Daily Dungeon de Gear. Las piezas de Gear y los shards son la clase de loot de mayor valor.

• No persigas la escalera 8/8/8/8 o 10/10/10/10 a menos que también estés persiguiendo un título de temporada. Los rendimientos decrecientes pegan fuerte por encima de 6 runs. El gastador medio (4/2/4/4) limpia cualquier meta de gear realista salvo el liderato.', 'https://eog.gg/games/sword-x-staff/guides/daily-dungeons/', false, array[]::text[]);
end
$IMPERIUM$;

do $IMPERIUM$
declare
  v_game uuid;
  v_guide uuid;
begin
  select id into v_game from public.games where slug = 'sword-x-staff';
  if v_game is null then
    raise exception 'IMPERIUM: juego no encontrado: %', 'sword-x-staff';
  end if;

  -- Reemplazo idempotente. OJO: borra los pasos -> reinicia step_progress de esta guía.
  delete from public.guide_steps where guide_id in (
    select id from public.guides where game_id = v_game and slug = 'grand-treasure-hunt');
  delete from public.guides where game_id = v_game and slug = 'grand-treasure-hunt';

  insert into public.guides
    (game_id, slug, title, description, order_index, is_published, intro_title, intro, intro_images)
  values
    (v_game, 'grand-treasure-hunt', 'Sword x Staff: Grand Treasure Hunt', 'Cómo gastar Aurodrasil Energy en el Grand Treasure Hunt para sacarle el máximo valor como F2P. Cadencias de ahorrar-y-gastar, los tres principios absolutos de QY Maple (extremo izquierdo en el Floor 5, la Energy se acumula entre ciclos, las reliquias únicas son obligatorias), prioridades de recompensa de los niveles 1 a 5, las trampas del L4 que debes saltarte, el muro de Loong Haven para F2P y la rotación de fases actual de Cinder Ridge / Aqualis.', 6, false, 'La mayor trampa para F2P en cualquier evento', 'El Grand Treasure Hunt es el evento rotativo donde gastas Aurodrasil Energy en cinco niveles de recompensa. La trampa: la mayoría de los jugadores gasta cada semana creyendo que la cadencia coincide con el reinicio del evento. No es así. Gastar semanalmente deja recompensas del Nivel 5 sin reclamar porque la Aurodrasil Energy se recarga más rápido de lo que conviene recoger las recompensas de los niveles altos. Existen dos cadencias correctas, y ambas esperan varias semanas por gasto.

El Grand Treasure Hunt es uno de los eventos con mayor rentabilidad del juego para cuentas F2P porque el nivel de recompensa del Nivel 5 está detrás de un muro de moneda que castiga el gasto semanal. Si te dosificas correctamente, te llevas varios objetos del Nivel 5 por ciclo. Si te dosificas mal, malgastas tu Aurodrasil Energy en recompensas de L1-L2 que nunca se acumulan.', array[]::text[])
  returning id into v_guide;

  insert into public.guide_steps
    (guide_id, order_index, title, content, source_url, is_verified, images)
  values
    (v_guide, 1, 'Los tres principios absolutos de Maple', 'Maple resumió el evento en tres reglas. El resto de esta guía son las cuentas + los detalles por rotación que las demuestran.

• 1. Orden de prioridad del Floor 5: Prioriza siempre el Floor 5. En el Floor 5 el orden de prioridad de las casillas es Izquierda > Extremo derecho > Centro: la Izquierda es la reliquia única y siempre se coge, el Extremo derecho es la elección secundaria que vale la pena coger con la moneda sobrante, y el Centro es la prioridad más baja. Nunca compres en los Floors 1-4 si no puedes llegar al Floor 5 este ciclo (el coste mínimo es de ~3,240 Energy para reclamar a través de las etapas 1-5). En un ciclo de acumulación, no compres nada de ningún floor; necesitarás toda la reserva el próximo ciclo.

• 2. La Energy se acumula: la Aurodrasil Energy se acumula entre ciclos por diseño. Los F2P pueden llegar de forma estable al Floor 5 cada dos ciclos; los jugadores que compran los dos packs de regalo de 500 de energy cada ciclo pueden llegar al Floor 5 en todos los ciclos. Las cuentas están hechas para que la cadencia funcione; confía en ella.

• 3. Reliquias únicas: los F2P que aún no han llegado a Loong Haven (Season 2) deberían saltarse el 1.º y el 3.º Grand Treasure Hunt, pero coger sin falta las reliquias únicas del 2.º y el 5.º. Las ascensiones de la Lucky Statue de la Phase 6 son recomendables pero no obligatorias; eso es una decisión de inversión personal. Una vez que llegues a Loong Haven, sigue la Regla 2 para canjear la reliquia única en cada ciclo.', 'https://eog.gg/games/sword-x-staff/guides/grand-treasure-hunt/', false, array[]::text[]),
    (v_guide, 2, 'Cómo elegir recompensas en los primeros cuatro niveles', 'Los tesoros de L1-L4 se dividen en dos categorías. No hay una elección correcta o incorrecta entre ellas, solo preferencia según lo que tu cuenta necesite.

• Seasonal Resources: recursos del Material Realm. Aportan más Power inmediato. Progresión Seasonal más rápida. Elígelos si estás empujando rango o intentando superar los umbrales de CP del reino actual.

• Basic Resources: aportan menos Power inmediato pero refuerzan los cimientos a largo plazo. Elígelos si juegas pensando en el arrastre de temporada a temporada o si construyes hacia un objetivo concreto de Mythic / Relic.

Pautas prácticas. Ajusta la elección del nivel al objetivo que realmente tengas ahora mismo:

• Necesitas tu primer Mythic Fantomon → coge Bond Trinkets en el L4. El presupuesto de 180 Bond Trinkets para la evolución es difícil de alcanzar solo con actividades del lado de los companion; el Hunt es una vía de impulso real.

• Te faltan Legendary Relics de atributo especial → coge Legendary Auroral Badges en el L4. El atajo para rellenar los huecos de resonancia en el pool de reliquias de tu reino actual.

• Las Skills van después de las Relics. Si estás eligiendo entre recoger una reliquia que falta o skill shards, coge primero la reliquia: las reliquias acumulan resonancia, las skills no.

• Si no te gustan las tasas de drop con poco RNG → elige Skills directamente. Progreso determinista en la skill de clase que estés construyendo, sin suerte del pool de reliquias de por medio.', 'https://eog.gg/games/sword-x-staff/guides/grand-treasure-hunt/', false, array[]::text[]),
    (v_guide, 3, 'La rotación de este ciclo (Cinder Ridge / Aqualis)', 'El nuevo ciclo empieza en el reinicio de mañana y se extiende por seis fases a lo largo de las semanas de Cinder Ridge y Aqualis. Dos fases dan Lucky Statue y una da Primal Gem; esas son las tres elecciones en torno a las que se construye la cadencia de ahorrar-y-gastar de más abajo.

• Phase 1: Cinder Ridge. Cinder Ridge Mythic Relic seleccionable (Kingdom Relic).

• Phase 2: Cinder Ridge. Lucky Statue (Special Relic). Probabilidad pasiva de duplicar los drops de los cofres de Dungeon; escala del 10% al 60% a medida que acumulas ascensiones en la Relic.

• Phase 3: Aqualis. 3rd-class skill shards seleccionables × 180 (Class Skill).

• Phase 4: Aqualis. Primal Gem (Special Relic). Aumenta la obtención de Gem en todas las fuentes excepto packs y la casa de comercio; escala del 10% al 60%.

• Phase 5: Aqualis. Aqualis Mythic Relic seleccionable (Kingdom Relic).

• Phase 6: Aqualis. Lucky Statue (Special Relic). Mismo efecto que la Phase 2. La ascensión de la Phase 6 es la segunda copia del mismo ciclo; Maple la marca como recomendable pero no obligatoria si vas justo de Aurodrasil.

La Lucky Statue vuelve a entrar en el evento aproximadamente cada 1,5 meses. La Phase 2 es la recogida obligatoria; la Phase 6 es la segunda copia opcional del mismo ciclo para jugadores dispuestos a comprometer una segunda ventana de gasto. El Primal Gem de la Phase 4 encaja limpiamente en la cadencia de ahorrar-una-semana / gastar-la-siguiente, de modo que las recogidas de alta prioridad ocurren en ventanas de gasto separadas sin conflicto.

Más allá de este ciclo. La reliquia única del Floor 5 cambia en cada Hunt. Para planificar con antelación los ciclos posteriores a este, consulta la hoja de cálculo de rotación de recompensas de QY Maple. Mapea la reliquia única + los efectos de stats de cada Hunt para que puedas decidir qué Hunts saltarte y a través de cuáles ahorrar.', 'https://eog.gg/games/sword-x-staff/guides/grand-treasure-hunt/', false, array[]::text[]),
    (v_guide, 4, 'Prioridades de recompensa por nivel', 'Cinco niveles de recompensa. Cada ciclo, la recompensa del L5 rota. Los niveles L1-L4 se mantienen relativamente estables, así que las prioridades de más abajo aplican en la mayoría de los ciclos.

• Level 1: Basic Treats primero. Comida de companion. Se acumula con la economía de bond de companion. Entrada barata; reclámalo siempre.

• Level 2: Companion Gifts. Empuja los bonds de companion hacia el siguiente nivel. Mejor ratio de EXP/valor que los Treats por unidad de Aurodrasil gastada.

• Level 3: Relleno de recursos genéricos. Elige el recurso que en ese momento esté cuellobotellando tu cart. Wood y Stone son las opciones seguras por defecto (consulta la prioridad de mejora del cart).

• Level 4: Legendary Auroral Badges es el objeto L4 de mayor valor por defecto en todos los ciclos (rellena huecos de reliquias de atributo especial). Bond Trinkets pasa a ser la mejor elección si vas a por tu primer Mythic Fantomon: el presupuesto de evolución de 180 Trinkets es difícil de alcanzar solo con actividades de companion. Sáltate Stellatie (también cae de códigos + Treasury).

• Level 5: Rota. Prioridad de casillas: Izquierda > Extremo derecho > Centro. La Izquierda es la reliquia única (cógela siempre); el Extremo derecho es la elección secundaria; el Centro es la más baja. Rotaciones destacadas: Lucky Statue — Relic pasiva que escala del 10% al 60% de probabilidad de duplicar los drops de los cofres de Dungeon a medida que acumulas copias. Primal Gem — aumento del 10% al 60% en la obtención de Gem en todas las fuentes excepto packs y casa de comercio. Coge ambas siempre que roten. La Lucky Statue vuelve cada ~1,5 meses, así que aprovecha cada ventana de Phase en la que aparezca.', 'https://eog.gg/games/sword-x-staff/guides/grand-treasure-hunt/', false, array[]::text[]),
    (v_guide, 5, 'Cadencia de gasto F2P: dos opciones', 'La Aurodrasil Energy se recarga aproximadamente hasta el tope cada semana. Gastar semanalmente significa que no puedes permitirte la ventana de recompensa del L5. Funcionan dos patrones.

• Cada 2 semanas: aproximadamente 4,440 de moneda por gasto. Te da 2 objetos del Level 5 por ciclo. Adquisición de L5 constante, menos reclamaciones totales de L1-L2.

• Cada 3 semanas: aproximadamente 5,640 de moneda por gasto. Te da todos los objetos del Level 5 por ciclo. Máximo rendimiento de L5 pero ingresos más lentos de L1-L2.

Cuál elegir. Si la recompensa rotativa del L5 en el ciclo actual es Lucky Statue u otro compuesto a largo plazo, usa la cadencia de 3 semanas. Si la rotación del L5 es más floja, la cadencia de 2 semanas es la opción más segura porque aun así guardas un L5 por gasto manteniéndote flexible.

Gastadores ligeros. La recomendación concreta de Maple: compra los dos packs de regalo de 500 de energy cada ciclo (unos 30 $/semana de gasto en event-packs) y llegarás al Level 5 en todos los ciclos sin hueco de ahorrar-y-gastar. Eso acelera las ascensiones de Lucky Statue y las recogidas de Primal Gem. Si además compras la Monthly Card, la Aurodrasil Energy se rellena más rápido por los topes diarios con bonus de la card, lo que significa que puedes llegar al L5 cada ciclo incluso sin el segundo pack de 500. Vigila tu reserva antes de cada gasto.

El muro de Loong Haven. La cadencia de arriba asume que aún estás en Verdantglade o Cinder Ridge. Una vez que llegues a Loong Haven (Season 2), la curva de ingresos de Aurodrasil se empina lo suficiente como para que los F2P puedan canjear de forma estable la reliquia única en cada ciclo con la misma cadencia sin packs de 500. Antes de Loong Haven, los F2P deben esperar saltarse Hunts alternos; después, cada ciclo está al alcance.', 'https://eog.gg/games/sword-x-staff/guides/grand-treasure-hunt/', false, array[]::text[]),
    (v_guide, 6, 'Errores comunes', '• Gastar cualquier Aurodrasil Energy en una semana en la que no puedes permitirte el L5. Si tu reserva no va a alcanzar los ~3,240 Energy para el final de la semana, sáltate el evento entero. Cada clic de L1-L4 en una semana floja aleja un futuro L5 de tu alcance.

• Gastar cada semana como F2P. No puedes permitirte el L5 con cadencia semanal. La Aurodrasil Energy gastada en reclamaciones semanales de L1-L2 es valor que dejas sobre la mesa.

• Comprar cualquier cosa durante un ciclo de acumulación. Un ciclo de acumulación significa que la reserva tiene que quedar exactamente al máximo para el L5 del próximo ciclo. Incluso una sola compra de L1 se come esa reserva y te desliza a una cadencia de 3 semanas en lugar de 2.

• Elegir la casilla del Centro en el Floor 5. La prioridad de casillas del Floor 5 es Izquierda > Extremo derecho > Centro. La casilla central es la elección de menor valor; cómprala solo después de haber agotado la Izquierda y el Extremo derecho.

• Comprar Stellatie en el L4. La Stellatie cae de los códigos de canje, el Treasury y los hitos de la colaboración con KonoSuba. Gastar energy del Grand Treasure Hunt en ella duplica un recurso gratuito.

• Elegir un L5 que no sea Lucky Statue / Primal Gem cuando esos están en rotación. Ambas Special Relics escalan del 10% al 60% con ascensiones y se acumulan durante toda la temporada. Las demás recompensas de L5 normalmente no.

• Saltarte el ciclo entero cuando sí puedes permitirte el L5. Aunque la rotación del L5 parezca floja, la cadencia de 2 semanas aun así se lleva Legendary Auroral Badges o Bond Trinkets de L4 más relleno de L1-L3. No te quedes en cero si puedes superar el mínimo de 3,240 Energy.', 'https://eog.gg/games/sword-x-staff/guides/grand-treasure-hunt/', false, array[]::text[]),
    (v_guide, 7, 'Dónde encaja esto en el orden de gasto', 'El Grand Treasure Hunt va por detrás del bucle diario principal. Ordénalo de la siguiente manera:

• 10-roll diario gratis del Standard banner. Siempre lo primero.

• Runs gratis del Daily Dungeon. Dos runs al día en gear + materiales. Consulta la guía de Daily Dungeons.

• Stamina en Rolla primero. Cuello de botella del cart. Consulta la Beginner Guide.

• Destiny Exploration en reliquias que faltan. Gasta Destiny Fruit en la ubicación indicada. Apunta a reliquias que completen un set bonus de un build que realmente uses. Consulta la guía de Destiny Fruit.

• Grand Treasure Hunt con la cadencia de 2 o 3 semanas de arriba. No semanal.

El Grand Treasure Hunt es el evento que más recompensa la dosificación correcta. Si solo aprendes una regla de cadencia de eventos, que sea esta.', 'https://eog.gg/games/sword-x-staff/guides/grand-treasure-hunt/', false, array[]::text[]);
end
$IMPERIUM$;

do $IMPERIUM$
declare
  v_game uuid;
  v_guide uuid;
begin
  select id into v_game from public.games where slug = 'sword-x-staff';
  if v_game is null then
    raise exception 'IMPERIUM: juego no encontrado: %', 'sword-x-staff';
  end if;

  -- Reemplazo idempotente. OJO: borra los pasos -> reinicia step_progress de esta guía.
  delete from public.guide_steps where guide_id in (
    select id from public.guides where game_id = v_game and slug = 'food-guide');
  delete from public.guides where game_id = v_game and slug = 'food-guide';

  insert into public.guides
    (game_id, slug, title, description, order_index, is_published, intro_title, intro, intro_images)
  values
    (v_game, 'food-guide', 'Guía de Comida de Sword x Staff', 'La comida son tres sistemas distintos. Comida de curación para dentro de las mazmorras (fuera, volver a casa es más rápido). Comida de buff temporal guardada para el combate adecuado (los buffs no caducan en el inventario). La comida permanente tiene solo tres categorías (HP, Attack, Speed) con rendimientos decrecientes por tramos (100% / 50% / 20% / 5% en los umbrales 10/30/50/51) - cómela de forma pasiva hasta ~30 en la categoría que encaje con tu clase, no la persigas más allá de eso.', 7, false, 'La Comida Son Tres Sistemas Distintos', 'La comida en Sword x Staff no es una sola función, son tres. La comida de curación te mantiene vivo dentro de las mazmorras. La comida de buff temporal añade una ventana de bonificaciones de estadísticas para un combate concreto. La comida permanente es una escalera de estadísticas a largo plazo que se acumula durante toda la temporada. La mayoría de los jugadores tratan las tres por igual y pierden valor en cada categoría. Se aplican tres reglas distintas.

Un desglose enfocado de las tres categorías de comida, qué hace en realidad cada una por debajo, y cómo gastar cada una para que la escalera de estadísticas a largo plazo no se desperdicie en curación a corto plazo.', array[]::text[])
  returning id into v_guide;

  insert into public.guide_steps
    (guide_id, order_index, title, content, source_url, is_verified, images)
  values
    (v_guide, 1, 'Comida de Curación', 'La categoría directa. Cada item de comida restaura una cantidad fija o porcentual de HP al consumirlo. La regla de la comida de curación trata sobre cuándo gastarla, no sobre cuál elegir.

• Dentro de una mazmorra: cúrate con comida. Las mazmorras no te dejan teletransportarte a casa a mitad de la partida. El ranking de la Mazmorra Diaria se basa en lo lejos que llegas (ver la guía de Mazmorras Diarias ), así que gastar unas pocas comidas de curación para sobrevivir una sala extra vale más que la comida guardada en el inventario.

• Fuera de una mazmorra: no te cures con comida. Volver a tu base de origen es más rápido y restaura HP gratis. Quemar comida de curación en combates del mundo abierto es el desperdicio de novato más común.

• Antes de un combate importante: no te cures por adelantado. Empiezas cada combate con el HP al máximo gracias a un teletransporte. Comer comida de curación antes no hace nada porque no falta HP que restaurar.

• Acumula comida de curación barata. Los items de curación de nivel vendedor se amontonan en el inventario porque la mayoría de los jugadores olvidan que existen. Apila los baratos y úsalos en emergencias dentro de mazmorras.', 'https://eog.gg/games/sword-x-staff/guides/food-guide/', false, array[]::text[]),
    (v_guide, 2, 'Comida de Buff Temporal', 'Items de buff de estadísticas que duran una duración fija una vez consumidos. Bonificaciones de daño, bonificaciones de defensa, bonificaciones de daño elemental, picos de precisión. La trampa es que el temporizador del buff solo empieza cuando comes la comida, no cuando la recibes.

• La comida en el inventario no caduca. Una comida de buff de daño de elemento Fire en tu bolsa seguirá siendo útil tres semanas después. No las comas con prisa para "gastarlas".

• Lee la afinidad / el objetivo. Muchas comidas de buff solo se aplican a un elemento, rol o tipo de contenido específico (PvE, mazmorras, raids). Comer un buff de Light-DMG justo antes de un combate solo de Fire desperdicia la duración.

• Cómela justo antes de la puerta. Si el buff dura 30 minutos, no quieres consumirlo cinco minutos antes de una cola larga de mazmorra. Activa el buff justo antes de la puerta para que toda la ventana cubra el combate real.

• Guarda los buffs más fuertes para tu contenido más difícil. La mayoría de la comida de buff cae mientras haces farmeo rutinario. El buff que guardas ahora es el buff que sostiene el próximo intento de jefe de gremio.', 'https://eog.gg/games/sword-x-staff/guides/food-guide/', false, array[]::text[]),
    (v_guide, 3, 'Comida Permanente (La Escalera a Largo Plazo)', 'Comer comida permanente otorga un pequeño aumento permanente de estadísticas a tu personaje. La bonificación no desaparece y no se reinicia al final de la temporada. Solo hay tres categorías de comida permanente : HP , Attack y Speed .

La regla de rendimientos decrecientes. Cada categoría lleva la cuenta de cuántas copias has comido en total. La curva de efectividad no es suave — está por tramos:

• Copias 0–10: 100% efectivas. El aumento de estadística completo por copia. Esta es la única banda donde el coste por estadística es realmente competitivo con reliquias, tiradas de equipo o inversión en Fantomon.

• Copias 11–30: 50% efectivas. La mitad del aumento de estadística por copia. Aún vale la pena comerlas de forma pasiva según vayan llegando los ingredientes — esta es la banda por la que la mayoría de las cuentas avanzan.

• Copias 31–50: 20% efectivas. Un quinto del valor por copia. A estas alturas normalmente es mejor gastar los ingredientes / Dawnium en otra fuente de poder.

• Copias 51+: 5% efectivas. Funcionalmente muertas. Solo persigue esta banda si ya has maximizado todas las demás palancas.

Come de forma pasiva hasta ~30 en cada categoría, luego para. Llegar a 30 en HP / Attack / Speed te da el trozo significativo de la curva. Pasar de 30 es técnicamente positivo, pero el coste de Dawnium e ingredientes por punto de estadística es brutal. No persigas 50+ a menos que estés peleando por la clasificación y todas las demás palancas ya estén al máximo.

Prioridad de categoría por clase.

• Sage : HP primero. Las curaciones de Sage escalan con el HP, así que el HP cumple doble función (supervivencia + rendimiento de curación).

• Knight : HP primero. Knight es para tanquear. El HP es la escalera de estadística de tanque principal.

• Duelist / Sorcerer (DPS): Attack primero. Los roles de daño suben sus copias de Attack hasta 30 antes de tocar HP.

• Speed es la estadística de PvP. En todas las clases, Speed es la categoría de comida permanente más importante si juegas PvP / RTA en serio. El orden de turno que compra vale más que HP o Attack equivalentes en arena. Incluso Knights y Sages que juegan PvP deberían subir Speed junto con HP.

Nota sobre el coste por estadística. La comida permanente es una de las fuentes de poder más caras del juego una vez que empiezas a perseguir más allá de la banda del 100% efectivo. El coste es real, las ganancias son pequeñas, y normalmente hay mejores gastos de Dawnium / ingredientes disponibles. Trátala como un goteo pasivo en lugar de un farmeo activo.', 'https://eog.gg/games/sword-x-staff/guides/food-guide/', false, array[]::text[]),
    (v_guide, 4, 'Cocinar la Comida Tú Mismo', 'La mayoría de la comida se puede cocinar en la cocina de tu hogar. Las recetas se desbloquean a medida que progresas por las regiones. El sistema de cocina tiene algunas reglas que vale la pena conocer antes de comprometer espacios de receta.

• Los ingredientes vienen de la recolección por el lado de stamina. Gasta stamina en Rolla y en nodos de hierbas para alimentar la cocina. El carro ayuda pero no basta por sí solo.

• La calidad de las recetas escala con la progresión del reino. Las cocinas de nivel más alto desbloquean recetas de comida permanente más fuertes. No inviertas de más en el nivel de cocina temprano de Verdantglade.

• Cocina las comidas permanentes para las que tengas ingredientes, aunque todavía no necesites la estadística. La comida permanente cocinada ahora y comida después vale más que ingredientes guardados en el almacén.', 'https://eog.gg/games/sword-x-staff/guides/food-guide/', false, array[]::text[]),
    (v_guide, 5, 'Errores a Evitar', '• Comer comida de curación en el mundo abierto. Volver a casa es más rápido y gratis.

• Comer comida de buff antes de las colas. Espera hasta estar en la puerta de la mazmorra.

• Perseguir comida permanente más allá de 30 copias en una categoría. Los tramos bajan a 20% y luego a 5% de efectividad. La curva de coste por estadística es brutal — hay mejores gastos de Dawnium pasado este punto.

• Elegir la categoría equivocada para tu clase. Sage / Knight en Attack es una mala asignación. Las clases DPS con HP primero es una mala asignación. Las cuentas centradas en PvP que ignoran Speed es la mala asignación más cara de las tres.

• Tratar la comida permanente como un farmeo activo. El consenso de los reseñadores es que esta fuente de poder es real pero cara para lo que devuelve. Cómela de forma pasiva según vayan llegando los ingredientes; no acumules Dawnium específicamente para perseguirla.

• Vender ingredientes raros por Dawnium. Cocínalos primero. Los ingredientes pierden valor una vez que se desbloquean las recetas permanentes.', 'https://eog.gg/games/sword-x-staff/guides/food-guide/', false, array[]::text[]),
    (v_guide, 6, 'Dónde Encaja la Comida en Tu Rutina Diaria', 'La comida no es una actividad diaria. Es semanal. La mayoría de las cuentas obtienen el mayor valor de la comida con una sesión de cocina enfocada cada 5-7 días, no con un consumo constante.

• Cocina por lotes. Una o dos sesiones por semana para convertir ingredientes en comida permanente.

• Come primero en tu categoría prioritaria. Sage / Knight alimentan HP. Los DPS alimentan Attack. Los jugadores de PvP alimentan Speed. Sigue comiendo hasta llegar a ~30 copias en esa categoría, luego baja a un goteo pasivo.

• Acumula buffs temporales. Guárdalos en el inventario para el próximo jefe de gremio o empuje de mazmorra difícil.

• Repón comida de curación. Ten suficiente para dos días de mazmorras. Cualquier cosa más allá de eso es inventario muerto.', 'https://eog.gg/games/sword-x-staff/guides/food-guide/', false, array[]::text[]);
end
$IMPERIUM$;

do $IMPERIUM$
declare
  v_game uuid;
  v_guide uuid;
begin
  select id into v_game from public.games where slug = 'sword-x-staff';
  if v_game is null then
    raise exception 'IMPERIUM: juego no encontrado: %', 'sword-x-staff';
  end if;

  -- Reemplazo idempotente. OJO: borra los pasos -> reinicia step_progress de esta guía.
  delete from public.guide_steps where guide_id in (
    select id from public.guides where game_id = v_game and slug = 'destiny-fruit');
  delete from public.guides where game_id = v_game and slug = 'destiny-fruit';

  insert into public.guides
    (game_id, slug, title, description, order_index, is_published, intro_title, intro, intro_images)
  values
    (v_game, 'destiny-fruit', 'Guía de Destiny Fruit de Sword x Staff', 'Un uso común de la Destiny Fruit es la Destiny Exploration: gastarla en una ubicación concreta para tirar por una reliquia que te falta. El ejemplo en tres pasos (Relic Gallery -> lista de fuentes -> gastar en la ubicación), cuándo pasar de tirar a explorar, y el uso secundario de desbloqueos regionales (pociones de enredadera, llaves, taladros en el vendedor del reino).', 8, false, 'La Destiny Fruit rellena reliquias, no es una tirada al azar', 'Un uso común de la Destiny Fruit es la Destiny Exploration : viajar a una ubicación concreta y gastar Destiny Fruit allí para tirar por una reliquia que falta en tu Relic Gallery. El uso secundario son los desbloqueos regionales: pociones de enredadera, llaves, taladros y otros objetos en el vendedor local del reino. No hay ninguna buena razón para gastar Destiny Fruit en una ubicación aleatoria del mapa; cada gasto debería apuntar a algo que realmente necesitas.', array[]::text[])
  returning id into v_guide;

  insert into public.guide_steps
    (guide_id, order_index, title, content, source_url, is_verified, images)
  values
    (v_guide, 1, 'Ejemplo: rellenar una reliquia que falta con Destiny Exploration', 'Un caso de uso común de la Destiny Fruit es cerrar un hueco de la relic gallery mediante la Destiny Exploration. Los tres pasos de abajo recorren ese ejemplo usando un flujo real dentro del juego.

• Paso 1 — Relic Gallery. Abre tu Relic Gallery. Cada reino tiene su propia pestaña (Verdantglade, Cinder Ridge, Aqualis, Loong Haven, Other). Las entradas en gris son reliquias que todavía no tienes.

• Paso 2 — Lista de fuentes. Toca la reliquia que te falta para abrir su página de detalle. Baja hasta Source . Verás una lista como Kingdom Gacha , Element Gacha , y una entrada "<Kingdom> <Area> Destiny Exploration". La entrada de Destiny Exploration es la vía de gasto dirigido.

• Paso 3 — Gasta en la ubicación. Viaja al área indicada en la línea de fuente. El cuadro de confirmación muestra la ubicación y el coste en Destiny Fruit de ese intento; el coste puede variar, así que lee el cuadro antes de confirmar. Repite hasta que caiga la reliquia.', 'https://eog.gg/games/sword-x-staff/guides/destiny-fruit/', false, array['https://eog.gg/assets/games/sword-x-staff/guides/destiny-fruit-step1-gallery.webp', 'https://eog.gg/assets/games/sword-x-staff/guides/destiny-fruit-step2-source.webp', 'https://eog.gg/assets/games/sword-x-staff/guides/destiny-fruit-step3-spend.webp']::text[]),
    (v_guide, 2, 'Cuándo pasar a Destiny Exploration', 'La Destiny Exploration es un rellenahuecos de reliquias, no un sustituto de tirar. La tasa de obtención de la gacha del reino es más rápida por equivalente de Destiny Fruit para la mayor parte de la galería. El punto de cambio es cuando tirar se ha ralentizado pero la galería sigue incompleta.

• En torno al ~70% de la galería completada. Regla práctica del analista: cuando has reunido más o menos siete de cada diez reliquias de un reino pero las tiradas se han secado (lo has dejado, o estás aguantando deliberadamente en ese banner), la Destiny Exploration es la forma de cerrar el hueco.

• Apuntar a bonus de set. Las reliquias caen en sets; por ejemplo, el set Faint Ember Glow de Cinder Ridge es de 4 piezas (Quake Pick, Pyrecrown, Ignic Loop, Blade Saw). Los bonus de set se activan con 2 / 3 / 4 piezas en tu poder. Si vas 3/4 en un set útil y te falta una pieza concreta, la Destiny Exploration es la vía más limpia para llegar al bonus de 4 piezas.

• Azules y moradas en concreto. La mayoría de las cuentas se atascan en las reliquias azules (rare) y moradas (epic), no en el escalón de mayor rareza; la gacha tiende a rellenar las ranuras rare al final porque la distribución de la tasa favorece primero a las reliquias estrella. La Destiny Exploration es más útil justo en el hueco de azules / moradas.

• No apuntes a reliquias que no necesitas. Una reliquia que te falta y que no forma parte de un set que pienses usar no merece la pena rellenarla. Ajusta el gasto de Destiny Exploration a tu plan de build, no al afán de completarlo todo.', 'https://eog.gg/games/sword-x-staff/guides/destiny-fruit/', false, array[]::text[]),
    (v_guide, 3, 'Uso secundario: desbloqueos regionales', 'La Destiny Fruit también se puede gastar en el vendedor local de cada reino en objetos específicos de la región. Los objetos disponibles varían según el reino, pero la lista recurrente incluye:

• Pociones de enredadera. Consumibles de desplazamiento por el mapa para los trucos de terreno propios del reino.

• Llaves. Desbloquean cofres, subzonas o contenido bloqueado dentro del reino.

• Taladros. Aceleradores de nodos de recursos para la capa de minería / recolección del reino.

• Desbloqueos varios. Cada reino añade sus propios objetos de compra única en el vendedor local.

Estos son extras agradables, no la razón de ser de la Destiny Fruit. Cubre la lista de desbloqueos regionales cuando tengas fruta sobrante más allá de tu plan de Destiny Exploration, nunca antes.', 'https://eog.gg/games/sword-x-staff/guides/destiny-fruit/', false, array[]::text[]),
    (v_guide, 4, 'Estrategia según el nivel de gasto', 'La Destiny Exploration es el mismo flujo de trabajo en cualquier nivel de gasto. Lo que cambia es cuánto ha hecho ya por ti el tirar y, por tanto, lo grande que es realmente el hueco de la galería.

• F2P: Solo con tiradas te quedará el mayor hueco de la galería. Planifica uno o dos sets prioritarios por reino (Faint Ember Glow para builds de fuego de Cinder Ridge, etc.) y usa la Destiny Exploration para las piezas que falten y cerrar el bonus de set 3/4 o 4/4. No persigas reliquias fuera de tu build.

• Gasto ligero / medio: Tirar te cubre la mayoría de las reliquias. La Destiny Exploration pasa a ser limpieza dirigida: uno o dos huecos concretos de azules / moradas por reino. Gasta Destiny Fruit en los huecos y luego mete lo que sobre en desbloqueos regionales.

• Whale: La mayoría de las galerías se llenan solo con tiradas. La Destiny Exploration queda reservada para las últimas 1–2 ranuras rezagadas por reino, normalmente piezas de baja prioridad que la distribución de la tasa de la gacha se saltó. Usa la Destiny Fruit sobrante en desbloqueos regionales.', 'https://eog.gg/games/sword-x-staff/guides/destiny-fruit/', false, array[]::text[]),
    (v_guide, 5, 'Errores a evitar', '• Malgastar Destiny Fruit en una ubicación aleatoria del mapa. Gastar sin un objetivo concreto de reliquia que falta quema fruta sin avanzar nada en la galería. Revisa siempre la lista de fuentes primero.

• Explorar por reliquias que no necesitas. Si la reliquia que falta no forma parte de un set que realmente uses, la ranura es cosmética. Gasta en reliquias que activen un bonus de set en una build que uses.

• Pasarte a Destiny Exploration demasiado pronto. Tirar en la gacha rellena la galería más rápido que la Destiny Exploration durante el primer ~70% de las reliquias. Tira primero, explora al final.', 'https://eog.gg/games/sword-x-staff/guides/destiny-fruit/', false, array[]::text[]);
end
$IMPERIUM$;

do $IMPERIUM$
declare
  v_game uuid;
  v_guide uuid;
begin
  select id into v_game from public.games where slug = 'sword-x-staff';
  if v_game is null then
    raise exception 'IMPERIUM: juego no encontrado: %', 'sword-x-staff';
  end if;

  -- Reemplazo idempotente. OJO: borra los pasos -> reinicia step_progress de esta guía.
  delete from public.guide_steps where guide_id in (
    select id from public.guides where game_id = v_game and slug = 'companion-upgrade');
  delete from public.guides where game_id = v_game and slug = 'companion-upgrade';

  insert into public.guides
    (game_id, slug, title, description, order_index, is_published, intro_title, intro, intro_images)
  values
    (v_game, 'companion-upgrade', 'Guía de Mejora de Companions de Sword x Staff', 'Emparejamiento de estadísticas por clase y prioridad de breakpoints de nivel para mejorar a los Companions. El Knight quiere Block, los DPS quieren Crit Rate, el Sage quiere Accuracy o Healing Boost. El orden universal de mejora (todos a L20, luego los que coinciden con tu clase a L50, después L70 y por último L100) es el mismo para F2P y para mega ballenas. Incluye la ley de estadísticas L20/L50/L70/L100 (el Healing Boost es exclusivo de L100) y la nota del desbloqueo de skin en L60.', 9, false, 'El Mismo Orden de Mejora, en Cualquier Nivel de Gasto', 'Los Companions de Sword x Staff reparten estadísticas en breakpoints fijos (nivel 20, 50, 70, 100), y los breakpoints son predecibles: el Nivel 70 repite la estadística del Nivel 20, y el Nivel 100 repite la estadística del Nivel 50. Empareja las estadísticas con el rasgo de tu clase y el orden de prioridad es idéntico tanto si eres F2P como si eres una mega ballena al máximo. Gastar más no cambia el orden; solo cambia la rapidez con la que lo completas.

Una guía corta y con opinión sobre qué Companions mejorar y hasta dónde. La matemática es la misma sin importar tu gasto: cada cuenta se beneficia del mismo orden de prioridad porque los desbloqueos de estadísticas de los Companions caen en breakpoints fijos que premian la subida de nivel enfocada por encima de repartir.', array[]::text[])
  returning id into v_guide;

  insert into public.guide_steps
    (guide_id, order_index, title, content, source_url, is_verified, images)
  values
    (v_guide, 1, 'Regla de Oro: Empareja las Estadísticas con tu Clase', 'Los Companions que priorices mejorar siempre deben coincidir con las estadísticas de tu clase activa. Prioridad de estadísticas por clase:

• Knight: Block › Crit Rate. Los Companions defensivos son la prioridad. Los Knights escalan con Block, y el techo de Block es difícil de alcanzar solo con el equipo.

• Sorcerer: Crit Rate › Accuracy. Companions ofensivos. El rasgo del Sorcerer ya otorga Accuracy, así que un pequeño extra de los Companions es suficiente; el Crit Rate es la estadística de daño limitante.

• Duelist: Crit Rate › Accuracy. Igual que el Sorcerer. El rasgo del Duelist ya proporciona Crit Rate, así que acumular más desde los Companions lo potencia.

• Sage: Accuracy › Crit Rate (build de DPS / DoT) o Healing Boost (build de sanador). El rasgo del Sage cubre todos los atributos base, así que las elecciones de Companion dependen del rol. Un Sage sanador espera hasta L100 porque el Healing Boost solo se desbloquea ahí.

Toca el signo de exclamación de un Companion dentro del juego para confirmar su perfil exacto de estadísticas antes de comprometer materiales de mejora.', 'https://eog.gg/games/sword-x-staff/guides/companion-upgrade/', false, array[]::text[]),
    (v_guide, 2, 'La Ley de Estadísticas (Ofensivo vs Defensivo)', 'Cada Companion cae en una de dos categorías. La categoría se identifica únicamente a partir de la estadística de L20.

• Nivel 20: Primer desbloqueo. DMG Boost → Companion ofensivo. DMG Reduce → Companion defensivo. Se repite en L70.

• Nivel 50: Ofensivo: Crit Rate o Accuracy. Defensivo: Block, Crit Resist o Healing Boost (el Healing Boost es exclusivo de L100 -- ver más abajo). Se repite en L100.

• Nivel 60: Desbloqueo de skin. Sin cambio de estadística.

• Nivel 70: Repite la estadística de L20. DMG Boost / DMG Reduce acumulado de nuevo.

• Nivel 100: Repite la estadística de L50. El Healing Boost solo aparece en L100 -- un Companion sanador que detectaste en L50 con una estadística de sabor sanador no entregará el Healing Boost estelar hasta el 100.', 'https://eog.gg/games/sword-x-staff/guides/companion-upgrade/', false, array[]::text[]),
    (v_guide, 3, 'Orden Universal de Mejora', 'El mismo orden tanto si eres F2P, gastador ligero o una mega ballena al máximo. La única diferencia es cuánto tarda cada fase.

• Todos a L20. Sin excepciones. Este es el suelo que desbloquea la primera concesión de estadística en cada Companion que posees. El valor marginal de llevar un cuarto Companion a L20 es mayor que empujar a tu principal de L50 a L70.

• Los Companions que coinciden con tu clase a L50. Una vez que el suelo de L20 es universal, empuja a aquellos cuya estadística de L50 coincida con el rasgo de tu clase. Aquí es donde aterriza la estadística relevante para la clase y donde el Companion empieza a aportar de verdad.

• Repite el patrón para L70. Lleva tu plantilla activa hacia L70 para el segundo nivel de estadística ofensiva / defensiva. Este es el largo grindeo intermedio para la mayoría de las cuentas.

• Repite para L100. Punto final de mega ballena. Necesario para las builds de Sage sanador porque el Healing Boost solo se desbloquea aquí.

Por qué las mega ballenas siguen el mismo orden. Incluso si tu punto final es tener a todos en L100, el orden de las operaciones sigue importando porque L20 es una pequeña inversión de material a cambio de una concesión de estadística garantizada en toda la plantilla. Saltarte el suelo de L20 en el camino hacia un único principal en L100 desperdicia la contribución por Companion durante toda la subida. La propia admisión de Maple en el vídeo fuente: "De todos modos voy a llevar a todos al máximo, nivel 100", y aun así sigue exactamente este orden.', 'https://eog.gg/games/sword-x-staff/guides/companion-upgrade/', false, array[]::text[]),
    (v_guide, 4, 'Skins y Cosméticos', 'Las skins se desbloquean en L60. Sin beneficio de combate. Si un Companion que no usas activamente tiene una skin que quieres, esa es la única razón válida para subirlo más allá de su desbloqueo de estadística de L50 fuera del orden universal. En cualquier otro caso, pasa de L50 y sigue adelante.', 'https://eog.gg/games/sword-x-staff/guides/companion-upgrade/', false, array[]::text[]),
    (v_guide, 5, 'Regalos', 'Cada Companion tiene regalos preferidos. Dar el regalo correcto acelera el progreso de vínculo; dar regalos equivocados desperdicia consumibles que podrían haber ido a otro Companion.

• Comprueba antes de regalar. Toca el signo de exclamación en la página de detalle del Companion para ver qué regalos prefiere.

• Acumula los regalos preferidos. Si un Companion prefiere un tipo de regalo que cae con frecuencia, guarda el excedente en lugar de gastarlo en Companions de menor prioridad.

• No regales a Companions que estén fuera de tu orden de mejora. Aplican las mismas reglas de prioridad: regala el suelo de L20 de forma universal y luego concéntrate en los que coinciden con tu clase.', 'https://eog.gg/games/sword-x-staff/guides/companion-upgrade/', false, array[]::text[]),
    (v_guide, 6, 'Errores Comunes', '• Subir un Companion a L100 antes de que el resto llegue a L20. El suelo de L20 se acumula en toda la plantilla. Sube primero el suelo.

• Mejorar Companions ofensivos en un Knight. Los Knights no escalan con Crit Rate ni con DMG Boost como lo hacen las clases de DPS. Quédate con lo defensivo.

• Subir a un Companion de Sage sanador a L70 esperando Healing Boost. El Healing Boost es exclusivo de L100. L70 solo repite la concesión de L20.

• Gastar regalos sin comprobar las preferencias. El signo de exclamación existe por una razón.

• Tratar la etiqueta de "lazy" como algo solo de F2P. El orden es idéntico para las ballenas. Seguirlo hace que las ballenas alcancen el punto final de L100 antes, no después.', 'https://eog.gg/games/sword-x-staff/guides/companion-upgrade/', false, array[]::text[]),
    (v_guide, 7, 'La Hoja de Cálculo de Maple', 'Maple mantiene una hoja de cálculo que clasifica a cada Companion por su tipo de L20 (ofensivo / defensivo) y su estadística de L50, para que puedas preseleccionar los objetivos de mejora que coinciden con tu clase sin tener que entrar en la página de detalle de cada Companion dentro del juego. Disponible a través de su Discord (enlace en la descripción de su vídeo de YouTube).', 'https://eog.gg/games/sword-x-staff/guides/companion-upgrade/', false, array[]::text[]);
end
$IMPERIUM$;

do $IMPERIUM$
declare
  v_game uuid;
  v_guide uuid;
begin
  select id into v_game from public.games where slug = 'sword-x-staff';
  if v_game is null then
    raise exception 'IMPERIUM: juego no encontrado: %', 'sword-x-staff';
  end if;

  -- Reemplazo idempotente. OJO: borra los pasos -> reinicia step_progress de esta guía.
  delete from public.guide_steps where guide_id in (
    select id from public.guides where game_id = v_game and slug = 'dps-dummy-test');
  delete from public.guides where game_id = v_game and slug = 'dps-dummy-test';

  insert into public.guides
    (game_id, slug, title, description, order_index, is_published, intro_title, intro, intro_images)
  values
    (v_game, 'dps-dummy-test', 'Sword x Staff DPS Dummy Test', 'Cómo usar el Skill Test del juego (se desbloquea en el nivel 40) para comparar habilidades y loadouts. Metodología universal + una prueba de ejemplo específica de Sorcerer hecha por Keripo a nivel 40, con gráfica y conclusiones. Incluye las cuentas de Elemental Mastery (EM de tier Gold = 1.270 = +31,75% de daño según la regla de 40 EM = 1%).', 10, false, 'Se Desbloquea En El Nivel 40', 'El Skill Test del juego es la forma más rápida de comparar habilidades, equipo o loadouts completos sin gastar stamina de contenido real. Se desbloquea en el nivel 40 y te permite probar contra la configuración de equipo rival que elijas, ya sea un solo boss, un solo mob o una mezcla de distintas configuraciones variables.

La prueba de ejemplo + conclusiones de abajo provienen de las pruebas de Sorcerer de Keripo. La metodología (cómo configurar el Dummy, qué poner en la barra de charms, cómo leer la gráfica) es universal: todas las clases usan el mismo Dummy. Las elecciones de habilidades concretas y los rankings de la sección de Conclusiones Clave aplican a un kit de Sorcerer. Usa la metodología para tu propia clase; no copies los rankings de habilidades si juegas Duelist, Knight o Sage.

Dos partes. Primero, cómo usar el Dummy y qué configurar antes de pulsar Start. Segundo, una prueba de ejemplo específica de Sorcerer a nivel 40 con la gráfica y las conclusiones.', array[]::text[])
  returning id into v_guide;

  insert into public.guide_steps
    (guide_id, order_index, title, content, source_url, is_verified, images)
  values
    (v_guide, 1, 'Configura Primero Tu Barra De Charms', 'Configura tu barra de charms antes de pulsar nada. El tier y la selección de charms cambian los resultados más que las estadísticas de daño en bruto. Barra recomendada:

• Elemental Mastery. El mayor multiplicador de daño de la barra de charms. En tier Gold, el charm de Elemental Mastery otorga 1.270 EM, lo que se traduce en +31,75% de daño según la regla estándar de 40 EM = 1% de daño. Esto no es "escalado elemental plano que vale la pena incluir": es el protagonista. Ponlo primero.

• Water to Ice. Sigue siendo fuerte en builds de Water de Sorcerer; añade un golpe de daño extra que procea de forma fiable. Buena segunda ranura, pero con charms de tier Gold no supera en escalado a Elemental Mastery.

• Unstable Aura. Pasiva que procea cada turno y se potencia mucho con habilidades de cooldown bajo. Apílala con Water to Ice en una configuración de Water Shot / Water Assault.

Water to Ice y la pasiva de Wind no son excluyentes. Usa ambas junto a Elemental Mastery si tienes las tres en tier Gold.', 'https://eog.gg/games/sword-x-staff/guides/dps-dummy-test/', false, array[]::text[]),
    (v_guide, 2, 'Ejecutar La Prueba', '• 1. Ve al Skill Test. Home › Character › Skills.

• 2. Pulsa el botón "Test".

• 3. Configura el Dummy. Cambia el desplegable a "Boss" y pon 50 rondas, Unlimited HP, low damage. Pulsa "Start Test".

• 4. Arma tu loadout. Cambia o edita habilidades y equipo, luego pulsa "Start Battle".

• 5. Salta al final del combate. Pulsa el icono ⏭ para avanzar rápido.

• 6. Lee el informe de daño.

• 7. Ejecútala varias veces. "Retest" te da nuevos datos de muestra para que una sola tirada con suerte o sin ella no distorsione la lectura. "Edit Settings" te permite cambiar el loadout entre tiradas.

El Dummy usa las estadísticas reales de tu personaje. Lo que tengas equipado es lo que se prueba, así que no hace falta configuración extra del lado del personaje.

Consejo: guarda un loadout dedicado de "Dummy". No pruebes con tu loadout de combate real. Guarda un loadout aparte (la palabra "Test" está bloqueada, así que llámalo Dummy o similar) con una sola técnica equipada. Ejecuta cada prueba con una habilidad a la vez. Los números de daño quedan limpios y las comparaciones por habilidad son mucho más fáciles de leer que los resultados con loadouts mezclados.', 'https://eog.gg/games/sword-x-staff/guides/dps-dummy-test/', false, array[]::text[]),
    (v_guide, 3, 'Leer El Informe', 'Ejecuta cada vez tanto la configuración de solo boss como la de grupo de mobs. Distintas habilidades ganan en cada una, y un combate de mazmorra real se parece más a la configuración de mobs que al boss aislado.

• BAvg: Daño promedio contra un solo boss grande a lo largo de 10 tiradas. Las habilidades AoE consiguen golpes extra aquí porque los bosses reciben varios impactos por lanzamiento.

• MAvg: Daño promedio contra el Monster Group 2 (boss + grupo de mobs) a lo largo de 3 tiradas. Más cercano a un combate de mazmorra real donde te enfrentas a mobs más un élite.

• B1–B10 / M1–M3: Muestras de tiradas individuales. La varianza entre tiradas te dice qué habilidades dependen mucho de la RNG.

• Lvl: Tier de rareza de la habilidad con el que se probó la fila. El ranking relativo entre habilidades tiende a mantenerse entre rarezas aunque los números absolutos escalen hacia arriba.', 'https://eog.gg/games/sword-x-staff/guides/dps-dummy-test/', false, array[]::text[]),
    (v_guide, 4, 'Prueba De Ejemplo A Nivel 40', 'Una prueba de ejemplo a nivel 40 usando el loadout de arriba. Primero la gráfica, debajo las condiciones y luego las conclusiones.

No copies estos números, copia la forma. Los valores mostrados son resultados de prueba en bruto, no daño calculado teórico. Ejecuta la prueba con tus propias estadísticas y loadout. Las habilidades de muestra están en rareza Legendary; Mythic sube los números absolutos, pero el ranking relativo entre habilidades tiende a mantenerse.', 'https://eog.gg/games/sword-x-staff/guides/dps-dummy-test/', false, array['https://eog.gg/assets/games/sword-x-staff/guides/dps-dummy-test-sample.webp']::text[]),
    (v_guide, 5, 'Conclusiones Clave (Sorcerer)', 'Los rankings de abajo son para un kit de Sorcerer. La metodología se generaliza; las elecciones de habilidades concretas no. Si juegas Duelist, Knight o Sage, ejecuta tu propia prueba de Dummy en vez de copiar estos.

• Wind''s Delight gana en ambas columnas. Multi-golpe y multi-objetivo, así que encabeza el daño a boss Y el daño a mobs. Lo más parecido a una elección S-tier por defecto para contenido general de Sorcerer.

• Water Assault es la opción de AoE que además funciona contra bosses. Es AoE pero los bosses reciben varios golpes de ella, por eso puntúa alto en ambas configuraciones.

• Water Shot es una especialista de boss en un solo objetivo. Su cooldown cero permite que Unstable Aura y Water to Ice proceen cada turno. BAvg de primer nivel, MAvg casi al fondo porque solo golpea a un objetivo.

• Stonechief Summon es directamente malo. Al fondo tanto en BAvg como en MAvg. Sáltatelo.

• Wind es superior ahora mismo. La combinación de kits multi-golpe y la pasiva de wind lo pone en lo más alto.

• Elemental Mastery es roto de bueno en tier Gold. 1.270 EM = +31,75% de daño. Ponerlo en la barra de charms sube cada fila de la gráfica, no solo una habilidad. Si tu ranking de prueba se ve comprimido, es porque pusiste poco EM.

Perspectiva de Tier 2. Espera que Light tome el control en T2, impulsado por Chain Lightning y una pasiva de lightning que replica la pasiva de wind. Planifica el gasto en charms con eso en mente si estás ahorrando para el siguiente tier.', 'https://eog.gg/games/sword-x-staff/guides/dps-dummy-test/', false, array[]::text[]),
    (v_guide, 6, 'Advertencia: El Dummy No Tiene Elemento', 'El boss de prueba no tiene elemento, así que el informe de daño ignora cualquier bonus de afinidad elemental que verías contra un objetivo real. Las builds elementales se ven más débiles en el Dummy de lo que en realidad son en contenido. Vale la pena recordarlo al comparar, por ejemplo, un Fire Sorcerer contra un Duelist físico. Usa el Dummy para comparaciones relativas dentro de una sola build, no para números absolutos entre elementos.

Nota sobre Elemental Mastery vs Elemental Affinity. La Affinity (el bonus por emparejamiento) es lo que queda anulado en el Dummy. La Elemental Mastery (la estadística de daño plano) no queda anulada: aplica en el Dummy y fuera del Dummy. Así que la cifra de 1.270 EM → +31,75% de daño de arriba es lo que verás de verdad en tu informe de prueba. Los bonus de Affinity por encima de eso solo entran en juego cuando luchas contra un objetivo real con tipo elemental.', 'https://eog.gg/games/sword-x-staff/guides/dps-dummy-test/', false, array[]::text[]);
end
$IMPERIUM$;

do $IMPERIUM$
declare
  v_game uuid;
  v_guide uuid;
begin
  select id into v_game from public.games where slug = 'sword-x-staff';
  if v_game is null then
    raise exception 'IMPERIUM: juego no encontrado: %', 'sword-x-staff';
  end if;

  -- Reemplazo idempotente. OJO: borra los pasos -> reinicia step_progress de esta guía.
  delete from public.guide_steps where guide_id in (
    select id from public.guides where game_id = v_game and slug = 'void-rifts');
  delete from public.guides where game_id = v_game and slug = 'void-rifts';

  insert into public.guides
    (game_id, slug, title, description, order_index, is_published, intro_title, intro, intro_images)
  values
    (v_game, 'void-rifts', 'Sword x Staff Void Rifts', 'Evento quincenal de los domingos que rota con Chaos Invasion. 10 intentos dentro de las 24 horas tras su aparición; luego desaparece hasta su siguiente rotación. De 1 a 5 pisos de progresión por suerte por partida para conseguir tiradas de relics hasta Mythic. El juego en grupo escala las recompensas para quienes no son whales.', 11, false, 'Evento quincenal de los domingos, ventana de 24 horas', 'Void Rifts aparece cada dos domingos y rota con Chaos Invasion: un domingo toca Void Rifts y el siguiente Chaos Invasion. Tienes 10 intentos dentro de las 24 horas tras su aparición; cuando se cierra la ventana, el evento desaparece hasta su siguiente turno de rotación. Los intentos no se acumulan ni se trasladan entre rotaciones. Gástalos los 10 ese día o los pierdes.

Guía compacta para un evento compacto. Lee el resumen, despacha la partida y sigue adelante.', array[]::text[])
  returning id into v_guide;

  insert into public.guide_steps
    (guide_id, order_index, title, content, source_url, is_verified, images)
  values
    (v_guide, 1, 'Cómo funciona una partida', '• Encuentra un rift. Los marcadores aparecen por el mapa del mundo abierto de cada región. La elección de la región no afecta a las recompensas. Los rifts en disputa (con otro jugador ya dentro) te bloquean el acceso: ve hacia el siguiente marcador.

• Limpia los pisos del 1 al 5. Después de cada piso el juego tira para ver si el rift continúa. Limpiar un piso de forma limpia no garantiza el siguiente. Los pisos más altos suponen enemigos más difíciles y mejores pozos de recompensas.

• Sal con tiradas de relics. Las tiradas de rareza son independientes en cada tirada, así que una sola partida puede mezclar Normal / Epic / Legendary / Mythic. Las recompensas de moneda escalan según cuántos pisos hayas limpiado.', 'https://eog.gg/games/sword-x-staff/guides/void-rifts/', false, array[]::text[]),
    (v_guide, 2, 'Consejos de grupo y combate', '• Composición del grupo: 1 healer + 1 frontliner resistente + 2 DPS. Recluta antes de entrar a la cola en lugar de forzar el primer intento a la fuerza.

• Dónde encontrar grupos: el canal LFG dentro del juego, tu guild, la lista de amigos o el Discord oficial.

• Cúrate entre pisos. El intervalo entre pisos es tu única ventana de recuperación constante. Empieza cada piso nuevo cerca del HP máximo.

• Cambia de loadout cuando cambie la mezcla de enemigos. Build de congelación para los grupos de mobs de los pisos 1 y 2, y cambio a AoE / objetivo único para los pisos 3 y 4 con élites más adds. Usa las ranuras de loadout de la guía para principiantes.

• El solitario está bien para los whales que pueden limpiar a fondo pisos altos por su cuenta. Para todos los demás, el bono de grupo compensa con creces el coste de coordinarse.', 'https://eog.gg/games/sword-x-staff/guides/void-rifts/', false, array[]::text[]),
    (v_guide, 3, 'Checklist del día del evento', '• Conéctate el domingo en que aparece. Comprueba la rotación frente al domingo anterior: si la semana pasada fue Chaos Invasion, esta semana es Void Rifts.

• Haz los 10 intentos dentro de las 24 horas. Desaparecen cuando se cierra la ventana.

• Recluta antes de entrar a la cola. Healer + frontliner + 2 DPS.

• Apunta a terminar entre 3 y 4 pisos. El piso 5 es un extra, no el objetivo.

• Salta de inmediato los rifts en disputa. Ve al siguiente marcador en lugar de esperar.', 'https://eog.gg/games/sword-x-staff/guides/void-rifts/', false, array[]::text[]);
end
$IMPERIUM$;
