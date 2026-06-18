do $IMPERIUM$
declare
  v_game uuid;
  v_section uuid;
begin
  select id into v_game from public.games where slug = 'call-of-dragons';
  if v_game is null then
    raise exception 'IMPERIUM: juego no encontrado: %', 'call-of-dragons';
  end if;

  -- Reemplazo idempotente: borra la sección y sus bloques, luego reinserta.
  delete from public.section_blocks where section_id in (
    select id from public.game_sections where game_id = v_game and slug = 'eventos');
  delete from public.game_sections where game_id = v_game and slug = 'eventos';

  insert into public.game_sections
    (game_id, slug, title, intro_title, intro, intro_images, is_published,
     label, description, icon, cover_image, render_type, order_index)
  values
    (v_game, 'eventos', 'Eventos', 'Eventos de Call of Dragons', 'Call of Dragons tiene eventos rotativos que dan recompensas muy valiosas: recursos, aceleradores, fragmentos de héroe y más. Aquí reunimos las guías de cada evento — cómo participar, la mejor estrategia y qué recompensas esperar. El contenido está sin verificar hasta que el staff lo revise.', array['https://cdn.cod.guide/wp-content/uploads/2023/07/Call-of-Dragons-roots-of-war-map.png']::text[], false,
     'Eventos', 'Guías de los eventos de Call of Dragons: cómo completarlos, estrategias y recompensas.', null, 'https://cdn.cod.guide/wp-content/uploads/2023/07/Call-of-Dragons-roots-of-war-map.png', 'generic', 0)
  returning id into v_section;

  insert into public.section_blocks
    (section_id, order_index, title, content, source_url, is_verified, images, meta)
  values
    (v_section, 1, 'Roots of War', '▸ Consejos rápidos de Roots of War

- Consulta la lista de carriles (lanes) en el correo de la alianza.

- Localiza tu carril en la lista.

- Mapa de carriles (míralo en el chat de la alianza o pregúntalo). Se publicará allí varias veces.

- Fíjate en los nombres de los edificios de tu carril y memorízalos. Te será muy útil cuando decidas a qué rally de tu carril unirte.

- En tu carril, al inicio toma los edificios con rallies y guarnece allí. Usa infantería, caballería y arqueros para guarnecer.

- Los líderes del carril inician los rallies. Otros también pueden hacerlo, pero comprueba si hay suficientes jugadores en tu rally.

- La infantería, la caballería y los arqueros siempre deben estar disponibles para los rallies, es decir, mantenlos cerca de los objetivos de rally (los edificios).

- Los de bajo poder pueden conseguir puntos recolectando en las charcas (ponds) con recolectores.

▸ Jugabilidad de Roots of War en Call of Dragons

Tras registrarte en Roots of War, tu alianza será emparejada contra un rival determinado por tu clasificación. Tu Matchmaking Rating, el número de combatientes y el número de victorias recientes determinan tu clasificación.

Una vez emparejadas las alianzas como rivales, un equipo jugará como las fuerzas de Lucia (azul) mientras que el otro jugará como las fuerzas de Yaen (oro).

Cuando comienza la batalla, los jugadores pueden conseguir puntos personales derrotando a las unidades del equipo enemigo. Ocupar edificios y recolectar en las Lunambrite Pools otorgará puntos tanto a ti como a tu alianza.

Entregar la Lifestone a uno de los edificios de tu equipo o a un edificio neutral otorgará una gran cantidad de puntos tanto a ti como a tu alianza.

Una vez terminado el combate, gana el equipo con el mayor número de puntos de alianza. Los jugadores recibirán recompensas según su puntuación personal y según si su equipo ganó o perdió el combate.

▸ Registro en Roots of War: cómo unirse

1. Para poder registrarte, tu alianza debe estar entre las 20 primeras del ranking de poder de alianzas de tu servidor, y debes poseer al menos 10 Alliance Towers en el momento en que abra el registro. Los líderes y oficiales de la alianza pueden registrarse desde la página del evento.

2. Una vez abierto el registro, los jugadores solo pueden participar en Roots of War a través de su alianza actual. No puedes participar en la misma ronda de Roots of War si te cambias a una nueva alianza.

3. Los jugadores que se unan a una alianza después de que abra el registro no podrán entrar en el equipo de su alianza ni recibir recompensas de Roots of War.

4. Cuando finaliza el registro, la lista del equipo de la alianza queda bloqueada y no se puede cambiar.

▸ Gestión de jugadores

Los líderes y oficiales de la alianza pueden nominar hasta 30 combatientes y 10 suplentes para la lista de su equipo.

Los jugadores elegibles deben haberse unido a la alianza antes del inicio del registro, y deben ser al menos de City Level 16.

▸ Cómo entrar al campo de batalla

Cuando comienza Roots of War, los jugadores son transportados a un mapa completamente nuevo.

Antes de entrar al campo de batalla, asegúrate de no tener ninguna Legión desplegada y de no estar en modo War Frenzy.

Tener unidades gravemente heridas en tu Hospital no afecta a tu capacidad de entrar al campo de batalla. Las unidades gravemente heridas son transportadas al campo de batalla y desplegadas en combate.

▸ Inicio del combate en War of Roots

Fase de preparación:

A medida que los jugadores de ambos equipos entran al campo de batalla, disponen de 3 minutos para prepararse. Durante este tiempo, ninguno de los equipos puede ocupar edificios ni desplegar Legiones, pero sí pueden colocar Alliance Markers.

Fase de combate:

- Fase 1: Los edificios se abren. Las fuerzas de Lucia y Yaen comienzan su épica batalla.

- Fase 2: La Lifestone aparece en el Lifestone Pedestal. La batalla alcanza su clímax.

- Fase final: Se calculan las puntuaciones. Gana la alianza con la puntuación total más alta.

▸ Registro

Alianza

En el momento en que abra el registro de Roots of War, tu alianza debe cumplir las siguientes condiciones para poder registrarse:

- Tu alianza debe estar entre las 20 primeras de tu servidor.

- Tu alianza debe poseer al menos 10 Alliance Towers.

Personal

En el momento en que abra el registro de Roots of War, debes ser miembro de tu alianza y tu City debe ser al menos de nivel 16 para entrar en el equipo de tu alianza.

▸ Reglas de combate

Batalla: las reglas de combate de Roots of War son las mismas que las del juego principal. Todos los combatientes pueden marchar libremente.

Curación:

- Las unidades no pueden morir durante Roots of War, pero sí pueden resultar heridas. Las unidades heridas se envían a la Druid Hut para curarse.

- No hay límite de capacidad en tu Druid Hut.

- Las unidades gravemente heridas pueden curarse seleccionando Elixir Healing o Resource Healing.

▸ Campo de visión

- El campo de batalla está cubierto por una niebla de guerra (fog of war) que oculta tu visión del enemigo.

- Cada Legión tiene un campo de visión limitado y solo puede ver a las Legiones enemigas que estén dentro de su campo de visión.

- Todos los miembros de una alianza comparten el mismo campo de visión.

▸ Behemoths

- Durante Roots of War, ambas alianzas pueden invocar un Behemoth al campo de batalla 3 veces.

- Solo el Beastmaster puede invocar Behemoths. El Behemoth aparecerá junto al campamento del Beastmaster. El Behemoth puede ser controlado por el Beastmaster del mismo modo que en el juego principal.

- Una alianza solo puede invocar 1 Behemoth a la vez.

▸ Restricciones de funciones

Ciertas funciones del juego están restringidas durante Roots of War.

- Mientras el campo de batalla está abierto, todas las funciones de gestión de miembros y algunas otras funciones quedan temporalmente desactivadas. Los Alliance Gifts sí pueden reclamarse.

- Mientras están en el campo de batalla, los jugadores no pueden enviar Alliance Help ni Resource Assistance a miembros de su servidor.

- Mientras están en el campo de batalla, los jugadores no pueden desplegar Legiones en el juego principal.

- Mientras están en el campo de batalla, los jugadores no pueden cambiar su nombre.

- Mientras los jugadores están en el campo de batalla, los nuevos Héroes, Artifacts o unidades de combate que obtengan no pueden incluirse en Roots of War. Tampoco surtirán efecto los buffs conferidos por mejorar edificios, subir tu nivel de Honorary Membership, investigar tecnologías o cambiar el City Theme.

- Los jugadores en el campo de batalla solo pueden desplegar un Scout a la vez.

▸ Sistema de puntuación de Roots of War

- Los jugadores y las alianzas consiguen puntos la primera vez que ocupan un edificio, y también consiguen puntos periódicamente por ocupar edificios de forma continua. Ciertos edificios (como el Tree of Healing o el Tree of Courage) también confieren buffs.

- Los jugadores consiguen puntos al derrotar unidades enemigas, pero sus alianzas no.

- Cuando aparece la Lifestone, tienes 15 minutos para entregarla a un destino. Cuando termina el periodo de 15 minutos, la Lifestone desaparece. 1 minuto después, una nueva Lifestone aparecerá en un Lifestone Pedestal aleatorio.

- Si entregas la Lifestone a una Lunambrite Pool, quedará depositada allí y otros jugadores podrán recogerla. Si entregas la Lifestone a una Safe Zone, reaparecerá en su Lifestone Pedestal original poco después sin otorgar puntos a tu equipo.

- Entrega con éxito la Lifestone a uno de los edificios de tu equipo o a un edificio neutral para conseguir una gran cantidad de puntos. Cada vez que la Lifestone se entrega con éxito, aumenta el número de puntos que ambos equipos pueden obtener de la siguiente entrega exitosa.

Función | Actividad | Puntos de alianza | Puntos de jugador
Lifestone | Entrega | 3000 | 300
Hall | Primera ocupación / Ocupación continua | 750 / 150 por minuto | 75 / 15 por minuto
Tree | Primera ocupación / Ocupación continua | 400 / 80 por minuto | 40 / 8 por minuto
Guard Tower | Primera ocupación / Ocupación continua | 80 / 30 por minuto | 8 / 3 por minuto
Lunambrite Pool Nv. 1 | Recolección | 33 | 150
Lunambrite Pool Nv. 2 | Recolección | 49 | 225
Lunambrite Pool Nv. 3 | Recolección | 66 | 300
Bajas | Atacando | — | 10K de poder = 40
Bajas | Defendiendo | — | 10K de poder = 80
Bajas | En campo | — | 10K de poder = 40

▸ Battle Sync

Accede al Battle Sync mediante el icono situado en la parte superior derecha de la pantalla principal de Roots of War.

▸ Héroes

- Cuando Battle Sync está activo, todos tus Héroes se mejoran a su nivel máximo. Esto no afecta a los Héroes en el juego principal.

- Battle Sync no cambia el Star Rating ni el nivel de habilidades de los Héroes.

- Los cambios que hagas en las configuraciones de Talentos de los Héroes mientras Battle Sync está activo solo se aplican a las Campañas. Hay 5 presets disponibles en la página de Talentos: Recommendation #1, Recommendation #2, Recommendation #3, Imported (la configuración de Talentos personalizada actual de tu Héroe en el juego principal) y Manual.

- Los presets Imported y Manual deben configurarse primero. Una vez configurados, puedes alternar entre ellos libremente.

Todos tus héroes suben aquí a nivel 60. Habrá algunos árboles de talentos predeterminados ya disponibles para que los uses, pero también puedes ajustarlos más según nuestros mejores árboles de talentos.

Las habilidades y estrellas de los héroes se basan en tus niveles de habilidad originales de la partida original.

▸ Artifacts

- Cuando Battle Sync está activo, todos los Artifacts se mejoran a su nivel máximo. Esto no afecta a los Artifacts en el juego principal.

- Battle Sync no cambia el Star Rating ni el nivel de habilidades de los Artifacts.

- Los Artifacts equipados a los Héroes en el juego principal también estarán equipados a ellos en las Campañas.

▸ Aumento de la capacidad de Legión

Cuando Battle Sync está activo, tus Policies no se aplicarán a las Campañas, pero tu Legion Capacity aumentará. El aumento de tu Legion Capacity cambiará a medida que avanza la Season.

Season | Aumento de Legion Capacity
1 | 41.500
1+ | 87.500
2 | 87.500

▸ Curación

Cuando Battle Sync está activo, solo puedes usar el Elixir que se te asigna durante la Campaña para curar tus Legiones.

A medida que avanza la Season, cambiarán la cantidad de Elixir Healing y Resource Healing disponibles, así como tu Elixir Production Speed.

La cantidad de Resource Healing que puedes usar es ilimitada.

▸ Buffs disponibles

Cuando Battle Sync está activo, ciertos efectos de buff cambiarán durante las Campañas.

▸ Recompensas de Roots of War

A continuación, las enormes recompensas que puedes conseguir en Roots of War.

▸ Mapa y edificios de Roots of War

▸ Equipos

En Roots of War, dos equipos se enzarzan en una feroz batalla, asumiendo el papel de seguidores de la Queen Lucia o del High Lord Yaen. Las fuerzas de Lucia se agrupan bajo el estandarte azul en la mitad superior del campo de batalla, mientras que las fuerzas de Yaen se agrupan bajo el estandarte dorado en la mitad inferior.

▸ Lifestone

En Roots of War hay 3 Lifestone Pedestals repartidos por el campo de batalla. Periódicamente, la Lifestone aparece en uno de los Pedestals, y ambos equipos deben luchar para obtenerla. Entrega la Lifestone a uno de los edificios de tu equipo o a un edificio neutral para conseguir una gran cantidad de puntos.

Cuando se entrega la Lifestone, reaparece poco después. Cada vez que la Lifestone se entrega con éxito, aumenta el número de puntos otorgados por su siguiente entrega exitosa. Si entregas la Lifestone a una Lunambrite Pool, quedará depositada allí y otros jugadores podrán recogerla. Si entregas la Lifestone a una Safe Zone, reaparecerá en su Lifestone Pedestal original poco después sin otorgar puntos a tu equipo.

▸ Halls

Los Halls del Elven Kingdom se alzan imponentes entre los bosques del Queenswood, símbolo del esplendor del sagrado manantial de Ffynon. Ocupar un Hall otorga a tu alianza una gran cantidad de puntos.

▸ Tree of Courage

El Tree of Courage creció de las semillas de Pren Hynafol, el Ancient Tree. Ni el tiempo ni la adversidad han debilitado su poderosa corteza. Ocupa el Tree of Courage para aumentar el ATK y la DEF de todos los miembros de tu equipo.

▸ Tree of Healing

El Tree of Healing creció de las semillas de Pren Hynafol, el Ancient Tree. Sus delicadas hojas, imbuidas de la misericordia de la naturaleza, se usan para aliviar el dolor. Ocupa el Tree of Healing para aumentar la Elixir Production Speed y los HP de Legión de todos los miembros de tu equipo.

▸ Outposts

Los Outposts llevan mucho tiempo en pie por todas las tierras Elven, testigos de ríos que fluyen, aves que migran, hojas que susurran y soldados que marchan. Cuando cae la noche y la luz de la luna se atenúa, su suave resplandor guía a los viajeros. Ocupar un Outpost amplía el campo de visión de tu alianza, además de otorgar una pequeña cantidad de puntos.

▸ Lunambrite Pools

A menudo pueden encontrarse alces (elk) descansando junto a las Lunambrite Pools. Las suaves aguas de la charca nutren la vegetación cercana, haciéndola crecer con tallos sólidos que dan Lunambrite en lugar de flores. Cuando la luna brilla sobre ellas, las Lunambrite Pools resplandecen con una suave luz azul, y sus aguas confieren un efecto al beberlas.

En Roots of War, desplegar Legiones para recolectar en las Lunambrite Pools otorga puntos tanto a ti como a tu alianza; sin embargo, tu Legión debe regresar a tu campamento tras recolectar para que esos puntos se sumen a tu puntuación. Las Lunambrite Pools pueden vaciarse al recolectar de ellas. Las charcas se rellenan 3 veces a lo largo de la batalla.

▸ Historia de Roots of War

Tras la Night of Burning Stars, la Elven Queen despertó el poder de Pren Hynafol —el Ancient Tree que se alza imponente a orillas del sagrado manantial de Ffynon—. Con la esperanza de adiestrar guerreros capaces de hacer retroceder la marea de oscuridad, ordenó a las raíces del árbol que se extendieran hacia el pasado, creando un campo de batalla seguro pero implacable donde los héroes del futuro pudieran demostrar su valía en la mayor lucha de la Elfkind.

En el año 700, el High Lord Yaen —corrompido por su búsqueda de magia prohibida— condujo a su ejército en un asalto descomunal contra el Queenswood mientras la Reina yacía en un letargo de siglos. La Lifestone, la última esperanza de los Elves de revivirla, no era más que un mito olvidado hacía mucho. ¿Podría florecer vida nueva de nuevo del sagrado manantial? ¿O reducirían las llamas de la furia de Yaen el lugar a un páramo asolado?

Asumiendo su papel de seguidores de la Queen Lucia o del High Lord Yaen, los Lords del reino tienen la oportunidad de presenciar una de las mayores batallas que Tamaris haya conocido jamás —y, quizá, de reescribir la historia—.', 'https://cod.guide/roots-of-war/', false, array['https://cdn.cod.guide/wp-content/uploads/2023/07/Call-of-Dragons-roots-of-war-map.png', 'https://cdn.cod.guide/wp-content/uploads/2023/07/Roots-of-War-battle-sync-heroes-1-1024x576.jpg', 'https://cdn.cod.guide/wp-content/uploads/2023/07/Roots-of-War-battle-sync-heroes-12-1024x576.png', 'https://cdn.cod.guide/wp-content/uploads/2023/07/available-buffs-in-roots-of-war.png', 'https://cdn.cod.guide/wp-content/uploads/2023/07/Call-of-Dragons-Roots-of-War-Rewards-1-1024x402.png', 'https://cdn.cod.guide/wp-content/uploads/2023/07/Call-of-Dragons-Roots-of-War-Rewards-2-1024x403.png', 'https://cdn.cod.guide/wp-content/uploads/2023/07/roots-of-war-teams.jpg', 'https://cdn.cod.guide/wp-content/uploads/2023/07/lifestone-roots-of-war.png']::text[], '{}'::jsonb),
    (v_section, 2, 'Strongest Lord', '▸ Guía del evento Strongest Lord

1. El evento se divide en 2 fases y se desarrolla a lo largo de 6 días.

Los primeros 5 días corresponden a la Fase de Armamento, y el día 6 es la Fase de Batalla. Estas 2 fases tienen clasificaciones independientes, y los Lores mejor clasificados recibirán recompensas.

2. Los eventos de los primeros 4 días de la Fase de Armamento se celebran en el siguiente orden: Entrenamiento de Legiones, Derrotar Darklings (excluye a los Guardias Darkling), Recolección de Recursos y Subida de Poder.

El 5º día todavía puedes obtener puntos realizando las actividades de los primeros 4 días, pero recibirás menos puntos que en los 4 días anteriores.

3. Durante la Fase de Armamento, los Lores pueden ganar recompensas completando las Misiones indicadas cada día, así como recompensas de clasificación de cada día. La clasificación general de los Lores en esta fase se determinará por la suma de sus puntos diarios de cada día durante la Fase de Armamento.

4. La Fase de Batalla solo dura 1 día y no se asignan Misiones. Este día puedes luchar todo lo que quieras o protegerte.

▸ Día 1: Entrenamiento de tropas

Consigue 30.000 / 60.000 / 125.000 puntos entrenando tropas.

• Entrenar 1 unidad de Tier 1: 5 puntos

• Entrenar 1 unidad de Tier 2: 10 puntos

• Entrenar 1 unidad de Tier 3: 20 puntos

• Entrenar 1 unidad de Tier 4: 40 puntos

• Entrenar 1 unidad de Tier 5: 100 puntos

Aquí es donde puedes ganar muchos puntos a la vez que aumentas el poder de tus Legiones.

Conviene conseguir la Manastone (potenciador de Entrenamiento) para obtener más puntos. Tener un nivel Honorario alto también ayuda mucho.

Consejos:

• Antes de que empiece el día 1, entrena tus tropas para que, una vez comience el evento, puedas recoger las tropas entrenadas de inmediato.

• Si ya tienes tropas Tier 5, mejorar unidades Tier 4 a Tier 5 te ahorraría muchos recursos y aceleradores, ganando además más puntos por esos recursos. Este es otro beneficio de desbloquear las unidades T5 rápido.

▸ Día 2: Derrotar Patrullas Darkling y Criaturas Oscuras

Consigue 3.600 / 12.000 / 25.000 puntos derrotando Patrullas Darkling y Criaturas Oscuras.

• Derrotar Patrullas Darkling o Criaturas Oscuras de nivel 1-6: 1.000 puntos

• Derrotar Patrullas Darkling o Criaturas Oscuras de nivel 7-10: 1.500 puntos

• Derrotar Patrullas Darkling o Criaturas Oscuras de nivel 11-15: 2.000 puntos

• Derrotar Patrullas Darkling o Criaturas Oscuras de nivel 16-20: 2.500 puntos

• Derrotar Patrullas Darkling o Criaturas Oscuras de nivel 21+: 3.000 puntos

Necesitas tener muchos Puntos de Mando (CP) para puntuar alto el día 2 y derrotar a tantos Darklings como puedas. Cuanto mayor sea el nivel de los enemigos, más puntos consigues.

Siempre se recomienda atacar a los Darklings de nivel 21+ con tus Legiones de Pacificación.

▸ Día 3: Recolección de recursos

Consigue 1.000 / 5.000 / 10.000 puntos recolectando recursos.

• Recolectar Oro x100 en el campo: 1 punto

• Recolectar Madera x100 en el campo: 1 punto

• Recolectar Mineral x60 en el campo: 1 punto

• Recolectar Maná x30 en el campo: 1 punto

Esta fase es muy sencilla y directa, pero también requiere mucho trabajo si quieres clasificar alto.

Conviene tener todas tus Legiones recolectando todo el día con los mejores árboles de talentos y artefactos para recolección.

Truco: Calcula el tiempo para que tus tropas salgan de los nodos de recursos y vuelvan a tu ciudad justo cuando empiece la fase 3. También puedes enviarlas a recolectar y dejarlas fuera de la ciudad hasta que comience el evento.

▸ Día 4: Subida de poder

Consigue 15.000 / 45.000 / 75.000 puntos aumentando el Poder.

• Ganar 1 punto de Poder de Edificios: 2 puntos

• Ganar 1 punto de Poder de Tecnología: 2 puntos

• Ganar 1 punto de Poder de Legiones: 2 puntos

Una fase estupenda para todo el que aún no tiene sus mejoras al máximo.

Asegúrate de tener el buff de la Manastone activo en todo momento durante este evento para sacar el máximo partido a las mejoras de Tecnología y Edificios.

Ten en cuenta que el Edificio de Producción de Maná es muy caro, pero da la mayor cantidad de puntos.

▸ Día 5: Todos los 4 primeros días combinados

Consigue 15.000 / 45.000 / 75.000 puntos usando cualquier método de los primeros 4 días.

▸ Día 6: Kill Event

Mata a tantos enemigos como puedas. Ganar 1 Mérito = 1 punto.

Aquí es donde está toda la diversión.

Si tienes una buena Alianza y conocimientos de PvP, puedes ganar un montón de puntos en el Kill Event. Solo asegúrate de usar los Héroes de máximo nivel para PvP al combatir, y de no usar árboles de talentos ni artefactos de pacificación, ya que no tienen ningún efecto en las batallas PvP.

Tener un emparejamiento de héroes que funcione también juega un papel enorme.

Consejos para conseguir más puntos en el KE:

• Atacar a otros jugadores: También recibirás mucho daño, lo que provocará que muchas tropas vayan al Hospital. Si vas a atacar a otros jugadores, intenta encontrar los que tengan Legiones y comandantes más débiles. Evita atacar a los mejores jugadores o a los que tengan ejércitos mucho más fuertes. Asegúrate de equipar artefactos y árboles de talentos de PvP antes de luchar, no objetos de pacificación.

• Atacar otras ciudades: Encuentra las ciudades abandonadas del mapa y atácalas. Asegúrate de que esas ciudades tengan mucho menos poder si no quieres que un montón de tropas acaben en el hospital de inmediato. ¡Pide también ayuda a los miembros de tu Alianza!

• Cazar recolectores: Usa tus Legiones de Caballería y caza a los recolectores del mapa. Así podrás conseguir muchos puntos mientras te diviertes. La mayoría de las Alianzas son abiertas a estas actividades durante el KE. Solo asegúrate de no atacar a tus aliados cuando estén recolectando en el territorio de su Alianza. Esto sí que es muy divertido.

• Atacar cuentas granja: ¿Tienes algunas cuentas granja? ¡Es hora de atacarlas para saquear recursos a la vez que consigues puntos del KE! Despliega Legiones pequeñas con tus cuentas pequeñas y atácalas a todas. O simplemente saca todas las tropas y ataca la ciudad de inmediato.

▸ Cronología de recompensas de Strongest Lord

• Día 7: Garwood

• Día 18: Garwood

• Día 47: Emrys

• Día 60: Emrys

• Día 74: Emrys

▸ Recompensas de Strongest Lord

Gracias a sus magníficas recompensas, incluyendo un héroe Legendario limitado, ¡Strongest Lord se convierte en uno de los mejores eventos de Call of Dragons!

El primer héroe Legendario limitado que los jugadores pueden conseguir en este evento es Emrys.

Hay 3 tipos de recompensas de clasificación: Clasificación Diaria, Clasificación de Armamento y Clasificación de Batalla.', 'https://cod.guide/strongest-lord-event/', false, array['https://cdn.cod.guide/wp-content/uploads/2023/01/Strongest-Lord-Event-Call-of-Dragons-1024x576.png', 'https://cdn.cod.guide/wp-content/uploads/2023/01/Strongest-Lord-Event-Rewards-1024x517.png', 'https://cdn.cod.guide/wp-content/uploads/2023/01/Strongest-Lord-Event-3-1024x525.png', 'https://cdn.cod.guide/wp-content/uploads/2023/01/Strongest-Lord-Event-2-1024x518.png']::text[], '{}'::jsonb),
    (v_section, 3, 'Breaking Through', '▸ Guía del evento Breaking Through

Hay seis reglas en total. No quiero explicarlas una por una (puedes leerlas en detalle en la siguiente sección), pero sí quiero recordarte algo a lo que debes prestar atención.

- Cada miembro de la alianza solo puede desplegar una legión para participar en las actividades de escolta; las legiones extra no producirán ningún otro efecto.

- Durante el proceso de escolta, debes pulsar sobre la caravana para seleccionar la legión que vas a desplegar. Si sigues a la caravana sin seleccionar la legión, no obtendrás ningún punto personal, o no podrás obtener la recompensa. La forma de seleccionar una legión para desplegar es la siguiente:

- Al escoltar una caravana, puedes optar por rendirte o esperar a que un monstruo la destruya, lo cual suele ocurrir cuando desafías una tarea de escolta de nivel alto pero descubres que es imposible terminarla. De este modo puedes volver a elegir la dificultad adecuada. Los 3 intentos disponibles no se consumen mientras la escolta no tenga éxito. (Solo los oficiales de la alianza pueden tomar esta decisión.)

- Durante el proceso de escolta, toda la información de los monstruos se muestra en la introducción de la página de actividades. Puedes preparar una estrategia segura conociendo de antemano los atributos de los monstruos.

▸ 1. Preparación y planificación antes de que empiece el evento

Esta preparación es crucial. Para proteger mejor la caravana se necesita que participe más gente. Los oficiales de la alianza deben comunicarse con antelación para asegurarse de que la mayoría de la gente intente estar conectada el día del evento.

Puedes dar a los miembros de la alianza algunos periodos de tiempo opcionales para que voten por correo o por comunicación mutua. La franja horaria disponible para que la mayoría de los miembros de la alianza estén conectados puede confirmarse mediante votación. Después puedes marcar la ubicación del evento en el mapa junto con el periodo de tiempo disponible.

Si este trabajo se hace bien, significa medio éxito para tu clasificación de escolta.

▸ 2. Ajuste del despliegue de tropas

Debes hacer un plan para las legiones de los miembros según sus situaciones específicas. Como hay ciertas diferencias en la fuerza de combate entre los distintos miembros de la alianza, no debes obligar a cada miembro a enviar el mismo tipo de legión.

Por ejemplo, si el objetivo de desarrollo de algunos miembros de la alianza es principalmente la infantería, no debes pedirles que desplieguen una legión que no dominan.

Otro ejemplo: algunos miembros de la alianza tienen una fuerza de combate muy débil; en ese caso, puedes considerar pedirles que desplieguen cuerpo a cuerpo, como infantería o caballería. Como algunos monstruos que atacan la caravana pueden ser retenidos (held back), mientras que otros atacan directamente la caravana, el personal con fuerza de combate débil puede ayudar a aliviar la presión de la fuerza principal reteniendo a algunos monstruos salvajes para que esta los limpie.

▸ 3. Diseña una estrategia operativa

Debes tener claro a qué enemigo te enfrentas antes de diseñar una estrategia.

Hay dos tipos de monstruos que atacan la caravana. Uno puede ser retenido (held back), es decir, si lo atacas, dejará de atacar la caravana y se volverá para atacar al enemigo que lo está atacando a él.

El segundo no puede ser retenido, es decir, por mucho que lo ataques, lo ignorará por completo y se dirigirá directamente hacia la caravana. Puedas retenerlo o no, puedes comprobarlo en la barra de información del monstruo en la interfaz del evento.

Una vez que conozcas la situación del enemigo, puedes ordenar a los miembros de tu alianza que reaccionen.

Para leer más sobre ellos, ve a la sección Bandit Guide más abajo.

Hay muchas formas de reaccionar, pero se recomienda que las tropas cuerpo a cuerpo (caballería o infantería) estén fuera de la caravana y las tropas a distancia (magos o arqueros) dentro.

Las tropas cuerpo a cuerpo se encargan de bloquear en el borde a los bandidos que pueden ser retenidos, mientras que las tropas a distancia se encargan de concentrar el fuego sobre los monstruos que atacan directamente la caravana. Las tropas a distancia regresan para cooperar con las fuerzas cuerpo a cuerpo y combatir a los bandidos restantes tras matar a los que están cerca de la caravana.

La ventaja de este despliegue no es solo reducir la presión defensiva de las legiones interiores para lograr una distribución razonable de la potencia de fuego, sino también permitir que el personal de combate débil, con poco daño, desempeñe un papel más importante.

▸ Reglas del evento Breaking Through

1. Durante el evento, cada alianza tiene 3 intentos para escoltar la caravana hasta su destino. El intento de escolta tendrá éxito siempre que la Supply Integrity de la caravana sea mayor que 0, y los miembros de la alianza recibirán recompensas según los resultados de la escolta. Si todos los suministros de la caravana son saqueados o si se abandona la escolta, los miembros de la alianza no recibirán recompensas, pero la alianza recuperará el intento de escolta.

2. Para escoltar una caravana, pulsa el botón Escort en la ventana emergente de la caravana y selecciona una Legión para desplegar. Los Personal Points se obtienen enviando Legiones a seguir la caravana o derrotando a los Darklings que atacan la caravana. Alcanza el objetivo de Personal Points y completa la escolta con éxito para obtener las recompensas correspondientes. Puedes reclamar recompensas un máximo de 3 veces.

3. Cada miembro de la alianza solo puede desplegar 1 Legión para ayudar a escoltar la caravana. Los oficiales de la alianza pueden elegir dónde y cuándo empieza la escolta. Antes de que empiece la escolta, habrá un periodo de Prep Time en el que puedes desplegar Legiones para esperar en el punto de inicio designado. Una vez que empieza la escolta, la primera Legión que consiga puntos será seleccionada automáticamente para unirse a la escolta y no se puede cambiar hasta que la escolta se complete. Los miembros de la alianza no pueden conseguir más puntos de esa escolta si su Legión es derrotada (routed) o regresa a la ciudad.

4. Las alianzas que completen una escolta con éxito entrarán en las Escort Rankings y se clasificarán más alto si completan contratos con un nivel de dificultad mayor. Si las alianzas completan un contrato con el mismo nivel de dificultad, se clasificarán según la Supply Integrity. Si la Supply Integrity es la misma, las alianzas que completen las escoltas antes se clasificarán más alto. Las recompensas de clasificación se emitirán a la vez, un tiempo después de que termine el evento.

5. Pulsa el Bandit Guide en la esquina superior derecha de la página del evento para ver los distintos tipos de enemigos y sus habilidades, y prepárate con antelación.

6. No se pueden iniciar nuevas escoltas en los últimos 15 minutos antes de que termine el evento, pero las escoltas ya iniciadas pueden continuar, así que aprovecha bien el tiempo del evento.

▸ Bandit Guide

Darkling Infantry Bandit
- Nivel de peligro: Bajo
- Clase: Darkling Bandit
- Hábitos de ataque: Prioriza el contraataque
- Habilidad: La Darkling Infantry inflige daño Physical Skill a una Legión objetivo (Damage Factor 350).
Los Darkling Warriors parecen no tener ni idea de por qué saquean caravanas, pero nunca dejarán pasar una buena oportunidad de pelear. Lo único que les importa es luchar y morir, así que interceptar suministros de supervivencia de las caravanas no es tan importante para ellos. Estos valientes guerreros solo quieren luchar contra cualquiera que se atreva a provocarlos.

Darkling Rider Bandit
- Nivel de peligro: Moderado
- Clase: Darkling Bandit
- Hábitos de ataque: Prioriza atacar la caravana
- Habilidad: Los Darkling Riders infligen Slow a una Legión objetivo, reduciendo su March Speed un 70% durante 7s.
Los Darkling Riders están acostumbrados a galopar y cargar contra sus enemigos, y les encanta saquear y arrebatar cosas a sus legítimos dueños. Las caravanas débiles siempre han sido su objetivo favorito, y el sonido de sus cascos atronadores hace relinchar de terror a los caballos de carga de las caravanas. La visión de una horda de Darkling Riders llena de terror a cualquier mercader, no solo por sus propias vidas, sino ante la perspectiva de que su preciada carga se use para alimentar la invasión Darkling.

Witch Troll Bandit
- Nivel de peligro: Alto
- Clase: Darkling Bandit
- Hábitos de ataque: Prioriza la protección de los aliados
- Witchcraft: Con un movimiento de su bastón, el Witch Troll inflige daño Magic Skill a una Legión objetivo (Damage Factor 400).
- Blazing Effigy: El Witch Troll otorga Keen y Stoneskin a una de sus Legiones aliadas cercanas, aumentando su ATK y su DEF durante 30s.
- Dark Invocation: El Witch Troll cura a las unidades levemente heridas de una de sus Legiones aliadas cercanas (Healing Factor 4.000).
- Cleansing Totem: El Witch Troll disipa todos los efectos de control de todas sus Legiones aliadas cercanas.
La inteligencia natural de los Witch Trolls los convierte en una apuesta segura para cualquier banda de bandidos. Están acostumbrados a esconderse tras Darklings y Creeps más temerarios y a dar apoyo desde la distancia. Cualquier Witch Troll con cerebro se mantendrá a salvo, pero contraatacará si se ve amenazado.

Shield Troll Bandit
- Nivel de peligro: Extremadamente alto
- Clase: Darkling Bandit
- Hábitos de ataque: Prioriza atacar la caravana
- Mean Right Hook: El Shield Troll lanza un puñetazo de barrido, infligiendo daño Physical Skill a todas las Legiones enemigas en un arco frontal (Damage Factor 400).
- Shield Storm: El Shield Troll gira su escudo gigante a su alrededor, infligiendo daño Physical Skill a todas las Legiones enemigas en un círculo a su alrededor (Damage Factor 600).
- Testudo: El Shield Troll otorga Stoneskin a sus Legiones aliadas cercanas, aumentando su DEF un 20%.
- Battering Ram: Tras una carga de 5s, el Shield Troll embiste hacia delante, infligiendo daño Physical Skill a todas las Legiones en su camino (Damage Factor 1.400) y lanzándolas por los aires (Airborne).
Los impulsivos Hammer Trolls son los enemigos más impredecibles de las filas de bandidos. Sus escudos se usan como instrumentos para infligir traumatismos contundentes y no con fines defensivos, lo que los hace fáciles de atacar. Pero si te topas con un Hammer Troll cuando no tiene otro sitio donde descargar su furia, prepárate para soportar una embestida terrible.

Stone Troll Bandit
- Nivel de peligro: Alto
- Clase: Darkling Bandit
- Hábitos de ataque: Prioriza atacar la caravana
- Stone''s Throw: El Stone Troll lanza una piedra, infligiendo daño Physical Skill a una Legión objetivo (Damage Factor 400).
- Powerquake: El Stone Troll inflige daño Physical Skill a todas las Legiones enemigas en línea recta frente a él (Damage Factor 400).
- Shot-Putter: El Stone Troll aumenta un 30% el ATK de las Legiones aliadas a distancia (Ranged) cercanas.
- Rockfall: El Stone Troll arroja un enorme peñasco, inmovilizando (Immobilize) a todas las Legiones enemigas de una pequeña zona allá donde caiga el peñasco durante 7s.
Los Stone Trolls nunca se ponen en peligro al saquear suministros. Son astutos y saben mantener la distancia de la caravana, y lanzarán sus piedras en el momento justo para pillar a los enemigos desprevenidos. Aunque puede que tengan mala puntería, su misión y propósito están muy claros: atrapar la caravana o destrozarla.

Thunder Lizard Bandit
- Nivel de peligro: Extremadamente alto
- Clase: Darkling Bandit
- Hábitos de ataque: Prioriza atacar la caravana
- Arcvott: El Thunder Lizard inflige daño Magic Skill a todas las Legiones enemigas en línea recta frente a él (Damage Factor 400).
- Shock and Awe: El Thunder Lizard golpea el suelo con un poderoso pisotón, infligiendo daño Magic Skill a todas las Legiones en un círculo a su alrededor (Damage Factor 600) e infligiendo Gloom, reduciendo su ATK durante 4s.
- Jumping Bolt: Tras una carga de 5s, el Thunder Lizard lanza una cadena de relámpagos que salta entre hasta 5 Legiones enemigas, infligiendo daño Magic Skill (Damage Factor 1.600). El daño infligido disminuye con cada objetivo adicional.
A los bandidos les gusta usar los relámpagos liberados por los Thunder Lizards para intimidar a las caravanas. Sus aterradores arcos eléctricos pueden dañar tus suministros en cualquier momento. El alcance de sus relámpagos no para de crecer, así que elimínalos cuanto antes o los suministros de tu caravana quedarán completamente arrasados por los rayos.

Ice Lizard Bandit
- Nivel de peligro: Alto
- Clase: Darkling Bandit
- Hábitos de ataque: Prioriza el contraataque
- Ice Shards: El Ice Lizard dispara afiladas esquirlas de hielo, infligiendo daño Magic Skill a una Legión objetivo (Damage Factor 400).
- Frozen Claw: El Ice Lizard ataca con sus gélidas garras, infligiendo daño Magic Skill a una Legión objetivo (Damage Factor 400).
- Frostfury Aura: Las Legiones aliadas al Ice Lizard ganan Rage un 40% más rápido cuando están cerca.
- Call of the Cold: El Ice Lizard invoca 2 elementales de agua durante 400s. Los elementales de agua lanzan ataques mágicos contra todas las Legiones enemigas cercanas.
Los bandidos no han tenido tanto éxito adiestrando a los Ice Lizards. En cuanto son atacados, olvidan por completo su objetivo y atacan al enemigo que consideran más amenazante para ellos. Aunque puedan parecer lentos, no los subestimes o te congelarán a ti y a los suministros que proteges en un voluminoso bloque de hielo.

Venomous Lizard Bandit
- Nivel de peligro: Extremadamente alto
- Clase: Darkling Bandit
- Hábitos de ataque: Prioriza atacar la caravana
- Caustic Spray: El Venomous Lizard escupe veneno, infligiendo daño Magic Skill a una Legión objetivo (Damage Factor 400).
- Venom Slash: El Venomous Lizard ataca con sus garras impregnadas de veneno, infligiendo daño Magic Skill a una Legión objetivo (Damage Factor 400).
- Malevolent Gaze: El Venomous Lizard clava la mirada en una Legión enemiga. La mirada penetrante disipa todos los buffs y debuffs del objetivo e inflige Breach, reduciendo su DEF durante 12s.
- Toxic Bog: El Venomous Lizard rocía veneno sobre 2 Legiones objetivo, infligiendo daño Magic Skill (Damage Factor 400) a los objetivos y a todas las Legiones a su alrededor cada segundo durante 10s.
Los bandidos han engañado a los reclusos Venomous Lizards haciéndoles creer que las caravanas invaden su territorio. Toparse con una criatura altamente venenosa en mitad del camino es, cuando menos, un inconveniente. Ten especial cuidado al eliminarlos, y recuerda protegerte a ti mismo mientras proteges tus suministros.

▸ Recompensas individuales

▸ Recompensas de alianza

La clasificación de cada alianza se basa en la Contract Difficulty, la Supply Integrity y el momento en que terminaron su escolta. Las 20 mejores alianzas recibirán recompensas de clasificación.

- Rango 1: 3x Legendary Custom Tokens + 3x Gold Key + 5x Aceleradores de 60 minutos

- Rango 2: 2x Legendary Custom Tokens + 2x Gold Key + 4x Aceleradores de 60 minutos

- Rango 3: 1x Legendary Custom Tokens + 1x Gold Key + 3x Aceleradores de 60 minutos

- Rango 4-10: 1x Gold Key + 2x Aceleradores de 60 minutos

- Rango 11-20: 1x Silver Key + 1x Acelerador de 60 minutos', 'https://cod.guide/breaking-through-event/', false, array['https://cdn.cod.guide/wp-content/uploads/2023/03/deploy-caravan-1024x640.png', 'https://cdn.cod.guide/wp-content/uploads/2023/03/protecting-caravan-1024x640.png', 'https://cdn.cod.guide/wp-content/uploads/2023/03/preparation-for-break-through-event-1024x640.png', 'https://cdn.cod.guide/wp-content/uploads/2023/03/breaking-through-troop-deployment-1024x640.png', 'https://cdn.cod.guide/wp-content/uploads/2023/03/strategy-for-breaking-through-event-1024x640.png', 'https://cdn.cod.guide/wp-content/uploads/2023/01/Darkling-Infantry-Bandit.png', 'https://cdn.cod.guide/wp-content/uploads/2023/01/witch-troll-bandit.png', 'https://cdn.cod.guide/wp-content/uploads/2023/01/Breaking-Through-Event-Rewards.png']::text[], '{}'::jsonb),
    (v_section, 4, 'Crucible of Courage', '▸ Evento Crucible of Courage

• Durante este evento te espera una serie de desafíos. Completa cada desafío para desbloquear el siguiente. Las Fases Élite son más difíciles que las Fases Estándar: forma una Rally con tus compañeros de Alianza para afrontarlas juntos.

• Derrota a la Crucible Horde en cada fase para obtener recompensas. Consulta la pantalla de Vista Previa de Recompensas para más detalles.

• Tu objetivo solo permanecerá en el mapa durante un tiempo limitado. Debes completar el desafío antes de que desaparezca.

Activar un nivel dentro del Crucible of Courage liberará a las criaturas oscuras cercanas a tu fortaleza.

El evento requiere que derrotes a estas criaturas para avanzar a los siguientes niveles.

Una vez derrotadas, se desbloquea el siguiente nivel. Es esencial recordar que se requieren CP (Puntos de Mando) para tus ataques.

Lo bueno de este evento es que los jugadores pueden desplegar los 5 ejércitos para atacar a estas criaturas. Si te encuentras en una situación difícil, pierdes tropas continuamente o te quedas atascado en un nivel concreto, tienes la opción de formar una rally. De este modo, conseguir ayuda de tu alianza puede contribuir a tu victoria. Sin embargo, recuerda que lanzar una rally costará más.

Las recompensas de este evento son increíblemente generosas. Espera una enorme cantidad de aceleradores, recursos, polvo arcano, llaves y fichas de héroe legendario. Las criaturas élite que combatas soltarán abundantes cantidades de este valioso recurso al ser derrotadas.

▸ Preparándose para Crucible of Courage

La preparación es la piedra angular del éxito en el evento Crucible of Courage. Una buena planificación aumenta tus posibilidades de terminar el evento a la vez que reduce el número de tropas heridas que van a los hospitales.

Asegúrate de tener guardadas tus formaciones de tropas para un despliegue más rápido. A medida que tu número de tropas baje, simplemente retíralas a la ciudad y ataca de nuevo.

Recuerda mantener siempre al menos una legión combatiendo contra la criatura oscura; no hacerlo provoca que el evento se reinicie, y tendrás que crear un nuevo ataque. Si la batalla se te complica, lanza una rally para conseguir ayuda de tus amigos de la Alianza.

Para hacer más daño en el Crucible of Courage y derrotar a los enemigos más rápido:

• Manastone: Echa siempre un vistazo a las guaridas de behemoths por si hay manastones de ataque disponibles.

• Objetos de Aumento de Daño: Si tienes uno, úsalo.

• Artefactos: Equipa a tu héroe con los artefactos de mayor DPS.

• Título de Alianza: Pide el título de DMG a tu jefe de alianza.

• Árbol de Talentos: Utiliza el plano de árbol de talentos óptimo para tus héroes.

▸ Seleccionar los héroes ideales para Crucible of Courage

Call of Dragons tiene muchos héroes únicos y, aunque es poco probable que los uses todos, resulta complicado elegir a los mejores.

Por ello, aquí tienes algunos consejos: usa héroes con daño nuke, preferiblemente los que tengan capacidad de alcance de ataque, y asegúrate de tener al menos un héroe tanque en tu escuadrón. Los héroes tanque atraen a las criaturas oscuras, permitiendo que tus héroes DPS inflijan el máximo daño.

Si no estás seguro de qué héroes desplegar, considera consultar nuestra Tier List de Call of Dragons. Con esta estrategia, ahorrarás tropas y superarás el Crucible of Courage sin problemas. Si descubres estrategias adicionales, comparte tus ideas en la sección de comentarios.

▸ Niveles y recompensas de Crucible of Courage

Fase | Recompensas
5 | Golden Key x1, Acelerador de Entrenamiento de 5 min x5, 50.000 Oro x2
10 | Custom Hero Token x2, 150.000 Oro, 150.000 Madera
15 | Legendary Medal x2, Golden Key x2, Acelerador de Entrenamiento de 60 min
20 | Custom Hero Token x2, 150.000 Mineral, 50.000 Maná
25 | Legendary Medal x3, Gold Key x3, Silver Key x2, Acelerador de Entrenamiento de 60 min
30 | Custom Hero Token x2, 150.000 Oro x2, 150.000 Madera x2, 150.000 Mineral x2

▸ Trasfondo

Antes de poder reclamar la verdadera gloria, un auténtico guerrero debe ponerse a prueba y estar dispuesto a derramar sangre en el campo de batalla. En Wilderburg ha existido desde hace mucho una antigua costumbre de someter a los aspirantes a luchador a una serie de pruebas para demostrar su fuerza y valor. Ahora que las tres facciones de Tamaris trabajan juntas, esta costumbre se ha ampliado para aceptar a todos los participantes, y el War Shaman ofrece generosas recompensas a quienes consigan luchar hasta el final en el Crucible of Courage.', 'https://cod.guide/crucible-of-courage/', false, array['https://cdn.cod.guide/wp-content/uploads/2023/04/Crucible-of-Courage-Call-of-Dragons-1024x526.jpg']::text[], '{}'::jsonb),
    (v_section, 5, 'Celestial Battlegrounds', '▸ Cómo completar Celestial Battlegrounds

Hay 2 niveles de dificultad: Normal y Hard (x2 puntos).

Antes de cada fase, los jugadores deben elegir un buff para los enemigos (lista completa más abajo).

1. Derrota enemigos a lo largo de 10 fases consecutivas. Cada fase superada con éxito te otorgará puntos.

2. Superar una fase rápidamente te dará puntos extra. Cuanto más rápido sea tu tiempo, más puntos recibes.

3. Cada fase tiene un límite de tiempo de 5 minutos. Si superas ese límite, o si todas tus Legiones son derrotadas, fallarás el desafío.

4. Si fallas el desafío, no recibirás puntos por la fase actual.

Estrategias de Celestial Battlegrounds

• Elegir tus marchas: Durante el Celestial Battleground, elegirás tres marchas para luchar contigo. Para puntuar más, querrás hacerlo en un nivel de dificultad más alto. Si aún no tienes T5, no te preocupes; puedes experimentar y ver hasta dónde puedes llegar.

• Puntuar: Al alcanzar la marca de 20.000 puntos, ganarás varias recompensas. Puntuar bien es esencial, pero la clasificación no es tan importante.

• Maximizar el daño: El daño a distancia es crucial. No se recomiendan los tanques; en su lugar, céntrate en daño de explosión tipo glass cannon puro. Las micro-optimizaciones, como colocar a los Magos atrás, también pueden marcar la diferencia.

• Usar artefactos: Los artefactos de bajo coste de rabia son beneficiosos. Ten en cuenta que el enfriamiento dura entre rondas, así que planifica en consecuencia.

• Carrera contra el tiempo: Tendrás que elegir buffs para el enemigo, pero como vas contrarreloj, elige los que no entorpezcan tu progreso. Por ejemplo, podrías elegir "los enemigos ganan 120% de ataque" si no afecta a tu estrategia.

• Adaptarse a los desafíos: Cada ronda presenta diferentes efectos de batalla, como rondas de curación o enemigos con ataque aumentado. Adapta tu estrategia para superar estos obstáculos.

• Ronda del jefe final: En la última ronda te enfrentarás al jefe. Seleccionar las habilidades adecuadas y concentrar tu daño te llevará a la victoria.

▸ Efectos de batalla de Celestial Battlegrounds

Ataque

• Second Wind: 10 s después de comenzar la batalla, el ATK de todas las unidades enemigas aumenta un 30% cada 5 s, hasta un máximo del 210%.

• Intensity: las unidades enemigas infligen un 215% más de daño de Habilidad.

• Second Wind: 10 s después de comenzar la batalla, el ATK de todas las unidades enemigas aumenta un 15% cada 5 s, hasta un máximo del 105%.

• Malice: las unidades enemigas ganan un 60% de ATK.

• Furious Anger: cuando el HP de una unidad enemiga está por debajo del 50%, su ATK aumenta un 120%.

• Furious Anger: cuando el HP de una unidad enemiga está por debajo del 50%, su ATK aumenta un 240%.

• Malice: las unidades enemigas ganan un 120% de ATK.

• Intensity: las unidades enemigas infligen un 107% más de daño de Habilidad.

Defensa

• Darkshade: cada 5 s, las unidades enemigas ganan un escudo (Factor de Escudo 1.500) que dura 3 s. Mientras el escudo está activo, infligen un 25% más de daño de ataque normal.

• Struggle: cuando el HP de una unidad enemiga está por debajo del 50%, su DEF aumenta un 80%.

• Darkshade: cada 5 s, las unidades enemigas ganan un escudo (Factor de Escudo 3.000) que dura 3 s. Mientras el escudo está activo, infligen un 50% más de daño de ataque normal.

• Obstinacy: las unidades enemigas ganan un 80% de DEF.

• Obstinacy: las unidades enemigas ganan un 40% de DEF.

• Tried and Tested: 10 s después de comenzar la batalla, la DEF de todas las unidades enemigas aumenta un 20% cada 5 s, hasta un máximo del 140%.

• Tried and Tested: 10 s después de comenzar la batalla, la DEF de todas las unidades enemigas aumenta un 20% cada 5 s, hasta un máximo del 70%.

• Struggle: cuando el HP de una unidad enemiga está por debajo del 50%, su DEF aumenta un 160%.

Habilidad

• Soul Sap: en cada fase, una unidad enemiga al azar lanzará Soul Sap, aumentando su ATK y DEF un 240%. Cada vez que muere una unidad cercana, este efecto se reduce un 25%.

• Soul Sap: en cada fase, una unidad enemiga al azar lanzará Soul Sap, aumentando su ATK y DEF un 120%. Cada vez que muere una unidad cercana, este efecto se reduce un 25%.

• Overexertion: al comenzar la batalla, las unidades enemigas ganan un 56% de ATK y DEF durante 60 s. Cuando el efecto termina, los Darklings reciben daño (Factor de Daño 1.400).

• Muster: en cada fase, una unidad enemiga al azar lanzará Muster, aumentando el ATK y la DEF de los enemigos cercanos un 96%.

• Muster: en cada fase, una unidad enemiga al azar lanzará Muster, aumentando el ATK y la DEF de los enemigos cercanos un 48%.

• Hale and Hearty: cuando el HP de una unidad enemiga está por encima del 50%, su ATK y DEF aumentan un 48%.

• Hale and Hearty: cuando el HP de una unidad enemiga está por encima del 50%, su ATK y DEF aumentan un 96%.

• Overexertion: al comenzar la batalla, las unidades enemigas ganan un 28% de ATK y DEF durante 60 s. Cuando el efecto termina, los Darklings reciben daño (Factor de Daño 700).

Curación

• Death Heal: al morir, una unidad enemiga cura a los enemigos cercanos (10% del HP máximo).

• Self-Healing: tras entrar en batalla, las unidades enemigas reciben curación cada 5 s (Factor de Curación 1.250).

• Death Heal: al morir, una unidad enemiga cura a los enemigos cercanos (20% del HP máximo).

• Self-Healing: tras entrar en batalla, las unidades enemigas reciben curación cada 5 s (Factor de Curación 2.500).

Debuffs

• Bare-Knuckle: reduce la DEF de tu Legión un 50% y aumenta su ATK un 10%.

• Bare-Knuckle: reduce la DEF de tu Legión un 100% y aumenta su ATK un 20%.

Buffs de Ataque Normal

• Unleashed: al comenzar la batalla, los primeros ataques normales de las unidades enemigas infligen daño adicional (Factor de Daño 8.000).

• Defilement: los ataques enemigos pueden infligir Defilement. Cada acumulación de Defilement reduce la DEF un 4% y la curación recibida un 2% durante 3 s. Máximo 10 acumulaciones.

• Defilement: los ataques enemigos pueden infligir Defilement. Cada acumulación de Defilement reduce la DEF un 8% y la curación recibida un 3% durante 3 s. Máximo 10 acumulaciones.

• Unleashed: al comenzar la batalla, los primeros ataques normales de las unidades enemigas infligen daño adicional (Factor de Daño 4.000).

▸ Recompensas

Las recompensas se otorgan según tu mejor puntuación.

Puntos | Recompensas
5.000 | Hero Token x1, Legendary Medal x1, Epic Token x1, 150.000 Oro x1
10.000 | Hero Token x1, Legendary Medal x2, 150.000 Madera x1, Acelerador de 15 min x1
12.000 | Hero Token x1, Gold Key x1, 112.500 Mineral x1, Acelerador de 30 min x1
20.000 | Gold Key x1, Epic Token x1, 50.000 Maná x1, Acelerador de Entrenamiento de 60 min

¡Los mejores jugadores también ganan recompensas extra!', 'https://cod.guide/celestial-battlegrounds/', false, array['https://cdn.cod.guide/wp-content/uploads/2023/08/Celestial-Battlegrounds-points-1024x627.jpg', 'https://cdn.cod.guide/wp-content/uploads/2023/08/Celestial-Battlegrounds-Battle-Effects-1024x576.jpg', 'https://cdn.cod.guide/wp-content/uploads/2023/08/Celestial-Battlegrounds-rewards.jpg']::text[], '{}'::jsonb),
    (v_section, 6, 'Trial of Light', '▸ Evento Trial of Light

1. Durante el evento hay 3 campos de batalla disponibles, y se desbloquea 1 cada día. Los desafíos pueden afrontarse en los 3 campos de batalla antes de que termine el evento.

2. Tras entrar en el campo de batalla, el combate se desarrollará de la siguiente manera:

3. Tus Legiones ganarán Warrior Points por cada enemigo que derroten en combate. Cuando alcances un cierto número de Warrior Points, tu Warrior Level aumentará. Cuanto mayor sea tu Warrior Level, más fuertes serán tus atributos. Perderás Warrior Points con el tiempo, pero tu Warrior Level no se reducirá.

4. En cada campo de batalla hay enemigos, Héroes, Artefactos y Legiones diferentes. Las recompensas de cada campo de batalla solo pueden reclamarse una vez.

5. Cada campo de batalla tiene dos niveles de dificultad. El nivel de dificultad más alto tiene enemigos más fuertes, pero también otorga más puntos.

6. No se pueden iniciar nuevos desafíos en los 10 minutos previos al final del evento. Esto no afecta a ningún desafío en curso.

▸ Unstoppable: la velocidad de Caballería aumenta enormemente

Héroes disponibles:

Artefacto disponible: Kingslayer

• Aumenta la DEF Física de las unidades de tu Legión en un 400%.

• Las unidades cuerpo a cuerpo de tu Legión infligen un 300% más de daño de ataque normal.

• Cuando tu Legión está compuesta enteramente por unidades de Caballería, ganan un 100% de Velocidad de Marcha durante 5 s cada vez que derrotan a una Legión enemiga.

▸ Steel Battalion: la DEF de Infantería aumenta enormemente

Héroes disponibles:

Artefacto disponible: Dragonscale Armor

• Aumenta la DEF Física de las unidades de tu Legión en un 200%.

• Recibe un 100% más de curación al liderar una Legión cuerpo a cuerpo.

• Al ser curada, tu Legión gana un 200% de DEF Física y DEF Mágica durante 5 s.

▸ On Target: los efectos de ataque de Marksman aumentan enormemente

Héroes disponibles:

Artefacto disponible: Shadowblade

• Aumenta la DEF Física de las unidades de tu Legión en un 200%.

• Aumenta la Tasa de Crítico del ataque normal de las unidades a distancia de tu Legión en un 100%.

• Las unidades Marksman de tu Legión infligen un 200% más de daño Crítico de ataque normal.', 'https://cod.guide/trial-of-light/', false, array['https://cdn.cod.guide/wp-content/uploads/2023/06/trial-of-light-rules.png', 'https://cdn.cod.guide/wp-content/uploads/2023/06/Trial-of-Light-Event-Guide-1024x576.jpg', 'https://cdn.cod.guide/wp-content/uploads/2023/06/Trial-of-Light-Event-Guide-2-1024x576.jpg', 'https://cdn.cod.guide/wp-content/uploads/2023/02/alistair.png', 'https://cdn.cod.guide/wp-content/uploads/2023/02/emrys.png', 'https://cdn.cod.guide/wp-content/uploads/2023/02/kingslayer.png', 'https://cdn.cod.guide/wp-content/uploads/2023/02/garwood-1.png', 'https://cdn.cod.guide/wp-content/uploads/2023/02/bakhar.png']::text[], '{}'::jsonb),
    (v_section, 7, 'Blessings of the Oak', '▸ ¿Por qué deberías canjear?

Según tus necesidades, esta es la lista general de prioridad de canje recomendada para todos durante este evento:

• Tokens de Héroe Legendario (Legendary Hero Tokens)

• Medallas Legendarias (Legendary Medals)

• Llaves de Oro (Gold Keys)

• Aceleradores (Speedups)

• Cofres de Recurso a Elegir (Resource Choice Chests)

▸ Canjes de Blessings of the Oak

Consulta la imagen para ver la tabla completa de canjes disponibles durante el evento.', 'https://cod.guide/blessings-of-the-oak/', false, array['https://cdn.cod.guide/wp-content/uploads/2023/05/blessings-of-the-oak-exchange-690x1024.jpg']::text[], '{}'::jsonb),
    (v_section, 8, 'Summer Smash', '▸ Evento Summer Smash

• Derrota Darklings y Criaturas Oscuras (Dark Creatures) dentro de los límites de tiempo establecidos durante el evento y podrán soltar Cofres. Abrir cada Cofre cuesta 1 Llave de Flor (Flower Key).

• Durante los primeros 3 días del evento, recibirás 10 Llaves de Flor al día. La cantidad de Llaves de Flor en tu inventario se restablece a 10 cada día a medianoche UTC.

• En el cuarto día del evento, ya no recibirás más Llaves de Flor.

• Cada jugador puede abrir cada Cofre una vez. Cada Cofre puede abrirse un total de 5 veces.', 'https://cod.guide/summer-smash/', false, array['https://cdn.cod.guide/wp-content/uploads/2023/05/Summer-Smash.png']::text[], '{}'::jsonb),
    (v_section, 9, 'A Fine Haul', '▸ A Fine Haul — Cosecha los frutos de la tierra

Recolecta recursos para conseguir las siguientes recompensas:

Recolectar | Recompensas
90.000 de Maná (Mana) | Medalla Legendaria x1, Mineral (Ore) 7.500 x8, Maná (Mana) 3.000 x8
300.000 de Oro (Gold) | Acelerador de Investigación de 30 minutos, Oro (Gold) 10.000 x8, Madera (Wood) 10.000 x8
300.000 de Madera (Wood) | Acelerador de Investigación de 30 minutos, Mineral (Ore) 7.500 x8, Maná (Mana) 3.000 x8
200.000 de Mineral (Ore) | Token de Héroe Épico (Epic Hero Token), Oro (Gold) 10.000 x8, Madera (Wood) 10.000 x8
1.000.000 de recursos en total | Gemas (Gem) x50, Acelerador de Investigación de 60 minutos, Oro (Gold) 10.000 x8', 'https://cod.guide/a-fine-haul-event/', false, array[]::text[], '{}'::jsonb),
    (v_section, 10, 'Live and Learn', '▸ Evento Live and Learn

Duración del evento: 24 horas

Requisitos | Recompensas
300 minutos de Acelerador de Investigación gastados | Oro (Gold) 50.000, Madera (Wood) 50.000, Acelerador de 5 minutos x2
900 minutos de Acelerador de Investigación gastados | Medalla Épica x2, Oro (Gold) 50.000, Madera (Wood) 50.000, Mineral (Ore) 37.500
2.700 minutos de Acelerador de Investigación gastados | Llave de Oro (Gold Key) x1, Medalla de la Suerte Épica (Epic Lucky Medal) x1, Potenciador de Producción de Oro de 8 horas, Potenciador de Producción de Maná de 8 horas
5.400 minutos de Acelerador de Investigación gastados | Medalla Legendaria, Acelerador de Construcción de 60 minutos x1, Acelerador de Entrenamiento de 60 minutos x1, Maná (Mana) 50.000 x5
10.800 minutos de Acelerador de Investigación gastados | Medalla Legendaria x2, Llave de Oro (Gold Key) x1, Llave de Plata (Silver Key) x1, Cofre de Recurso a Elegir Nivel 3 x2

Además, hay un ranking adicional para los mejores jugadores que más aceleradores gasten. Estos jugadores recibirán las siguientes recompensas:

Ranking | Recompensas
Top 1 | Token Legendario Personalizado (Custom Legendary Token) x20, Acelerador de 60 minutos x15, Llave de Oro (Gold Key) x5, Llave de Plata (Silver Key) x10
Top 2 | Token Legendario Personalizado (Custom Legendary Token) x12, Acelerador de 60 minutos x12, Llave de Oro (Gold Key) x4, Llave de Plata (Silver Key) x6
Top 3 | Token Legendario Personalizado (Custom Legendary Token) x8, Acelerador de 60 minutos x9, Llave de Oro (Gold Key) x3, Llave de Plata (Silver Key) x4
Top 4-10 | Token Legendario Personalizado (Custom Legendary Token) x4, Acelerador de 60 minutos x6, Llave de Oro (Gold Key) x2, Llave de Plata (Silver Key) x2', 'https://cod.guide/live-and-learn/', false, array[]::text[], '{}'::jsonb);
end
$IMPERIUM$;
