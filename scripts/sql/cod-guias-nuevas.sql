do $IMPERIUM$
declare
  v_game uuid;
  v_guide uuid;
begin
  select id into v_game from public.games where slug = 'call-of-dragons';
  if v_game is null then
    raise exception 'IMPERIUM: juego no encontrado: %', 'call-of-dragons';
  end if;

  -- Reemplazo idempotente. OJO: borra los pasos -> reinicia step_progress de esta guía.
  delete from public.guide_steps where guide_id in (
    select id from public.guides where game_id = v_game and slug = 'consejos-de-farmeo');
  delete from public.guides where game_id = v_game and slug = 'consejos-de-farmeo';

  insert into public.guides
    (game_id, slug, title, description, order_index, is_published, intro_title, intro, intro_images)
  values
    (v_game, 'consejos-de-farmeo', 'Consejos de Farmeo de Recursos', 'Trucos para recolectar recursos más rápido en el early game: gatherers, eventos, exploración, alianzas y cuentas de farmeo.', 5, false, null, null, array['https://cdn.cod.guide/wp-content/uploads/2023/02/farm-quicker-in-Call-of-Dragons-1024x576.png']::text[])
  returning id into v_guide;

  insert into public.guide_steps
    (guide_id, order_index, title, content, source_url, is_verified, images)
  values
    (v_guide, 1, 'Gatherers', 'Estos son los 4 gatherers (recolectores) que hay en Call of Dragons ahora mismo:

Algunos héroes de tipo Overall como Ordo también pueden funcionar como pequeños gatherers, ya que tiene una habilidad que aumenta la velocidad de recolección.

Estos gatherers ganan EXP solo con recolectar recursos, además farmean súper rápido y ofrecen recompensas extra al completar la recolección.

Asegúrate de darles el mejor árbol de talentos de farmeo para maximizar su velocidad de recolección.

Siempre debes tener activo el buff de gathering boost y los 4 production boosts. No tengas miedo de usarlos todos, vas a tener un montón. A largo plazo, marcan una diferencia enorme.', 'https://cod.guide/farming-tips/', false, array['https://cdn.cod.guide/wp-content/uploads/2023/02/kella.png', 'https://cdn.cod.guide/wp-content/uploads/2023/02/chakcha.png', 'https://cdn.cod.guide/wp-content/uploads/2023/02/pan.png', 'https://cdn.cod.guide/wp-content/uploads/2023/02/indis.png', 'https://cdn.cod.guide/wp-content/uploads/2023/02/ordo.png', 'https://cdn.cod.guide/wp-content/uploads/2023/06/farming-buffs.png']::text[]),
    (v_guide, 2, 'Usa los items de aceleración (speedups)', 'Antes que nada, atrévete a usar los items de aceleración (speedups). Cuando empieza una temporada, arranca siempre con un evento de poder.

El poder en el early game es la medida más clara a la hora de buscar una alianza fuerte. No quedarse atrás al principio es la clave. Además, durante el early game, no tener suficientes tropas para farmear o atacar es un verdadero dolor de cabeza. No dudes en gastar esos speedups de entrenamiento para llenar la capacidad de tu Legion durante la primera semana.', 'https://cod.guide/farming-tips/', false, array[]::text[]),
    (v_guide, 3, 'Completa los eventos Road to Glory', 'Haz lo posible por llenar las recompensas.

En la etapa temprana, obtener una gran cantidad de consumo al mismo tiempo apoyándote en eventos y misiones te dará un retorno suficiente.

Acuérdate siempre de terminar este evento por completo.', 'https://cod.guide/farming-tips/', false, array['https://cdn.cod.guide/wp-content/uploads/2023/02/road-to-glory-event-Call-of-Dragons-1024x576.png']::text[]),
    (v_guide, 4, 'Sigue las misiones principales (Main Quests)', 'Lo siguiente es seguir las misiones que más recompensan.

Las misiones principales (Mainline quests) son rentables, fáciles de completar y una guía para un desarrollo saludable. Incluyen principalmente el nivel del City Hall (recompensan muchas gemas).

Derrota a las criaturas oscuras (dark creatures), y mejora héroes o artefactos hasta un nivel concreto, o entrena cierta cantidad de tropas.

Estas misiones principales o bien te guían para mejorar tu capacidad o ponen a prueba tu poder actual para ver si es sólido, a la vez que dan muchas recompensas, así que seguir las misiones principales nunca estará mal.', 'https://cod.guide/farming-tips/', false, array['https://cdn.cod.guide/wp-content/uploads/2023/02/wonder-in-Call-of-Dragons-1024x615.png']::text[]),
    (v_guide, 5, 'Exploración', 'Además, Call of Dragons tiene mucha jugabilidad de exploración y recompensas.

Primero, los wonders (maravillas) están repartidos por todo el mapa. Estos wonders tienen una serie de misiones que recompensan con tropas voladoras de Nivel IV, que eran outcasts poderosos en el early game.

El mapa también contiene una gran cantidad de Villages (aldeas), free supplies (suministros gratis), campamentos misteriosos, etc. Hay muchas recompensas como recursos e items de aceleración.

Desbloquea todos los Free Supplies del mapa con un solo clic. Lee más aquí.

La exploración es un complemento útil para cubrir la falta inicial de recursos e items de aceleración.', 'https://cod.guide/farming-tips/', false, array[]::text[]),
    (v_guide, 6, 'Vacía tu CP (Command Point)', 'Usar de forma constante tu Command Point hará que ganes más packs de recursos.

Aunque puedan ser pequeños, estos packs se irán acumulando con el tiempo y aportarán recursos sustanciales.

Recogerlos lleva aproximadamente 5 minutos cada 8-12 horas, lo cual resultará muy ventajoso a largo plazo.

Además, no los perderás cuando el servidor se reinicie ni cuando te ataquen (raid).', 'https://cod.guide/farming-tips/', false, array['https://cdn.cod.guide/wp-content/uploads/2023/02/cp.png', 'https://cdn.cod.guide/wp-content/uploads/2023/06/empty-your-cp.png']::text[]),
    (v_guide, 7, 'City Hall Nivel 12', 'En los niveles 10-12 del City Hall, desbloqueas policies (políticas) y tecnología militar.

Hay una diferencia enorme entre las clases con tech y sin tech, y las policies aportan una gran cantidad de stats y habilidades de recolección de tropas y gemas.

Pero antes de subir al Hall 12, necesitas decidir a qué alianza y a qué región quieres seguir a continuación, o a qué grupo de amigos y en qué región quieres seguir.

Porque una vez que termines la mejora del City Hall 12, solo podrás ir a la alianza correspondiente cuando el nivel se abra y tu área sea tomada por la Outland Alliance entre zonas (cross-zone).

Dicho de forma sencilla, ya no podrás cambiar de región para unirte a alianzas durante un periodo de tiempo tras completar el City Hall 12, a menos que te cueste resetear todas las policies. A esto se le llama Resurgence.

Actividades de alianza', 'https://cod.guide/farming-tips/', false, array['https://cdn.cod.guide/wp-content/uploads/2023/02/farming-exp-with-your-alliance-members-1024x576.png']::text[]),
    (v_guide, 8, 'Únete a una alianza', 'Debido a que los distintos miembros de una alianza pueden estar en diferentes zonas horarias, combinado con los retos de Augurstone Progress contra los jefes y niveles de alianza, la construcción de carreteras y banderas de alianza, y el inicio de algunas actividades de alianza como escoltar recursos de la alianza, etc.

Asegúrate de prestar atención a las marcas de alianza, a los correos y a los chats que los oficiales de la alianza configuran cada vez que estés conectado. En la medida de lo posible, cumple con los requisitos de la alianza, asiste a las actividades a tiempo, y mantener tu propio poder dentro de la alianza no es lo último.

Si los oficiales de la alianza están inactivos o la alianza pierde miembros con frecuencia, plantéate cambiar de alianza.

Consejos: Los jefes de alianza del mismo tipo pero con bonificaciones distintas pueden otorgar varias muertes. Por tanto, los jefes de baja dificultad en el early game pueden dar lugar a una situación en la que los equipos de jugadores de una misma área cambian de alianza de forma colectiva para matar jefes y conseguir muchas recompensas.

Si puedes sumarte al jefe de otro jugador y matar a un behemoth, te recompensarán con gemas y migración de ciudad.

Lee más: Guía de Alianzas', 'https://cod.guide/farming-tips/', false, array[]::text[]),
    (v_guide, 9, 'Cuentas de farmeo (Farm Accounts)', 'Crear una cuenta de farmeo puede simplificarte la vida. Con una cuenta pequeña dedicada a farmear recursos, puedes aumentar tu recolección semanal de recursos.

Esta estrategia es mejor para jugadores dedicados que estén dispuestos a crear una cuenta nueva e invertir más tiempo para maximizar la eficiencia.

Para crear una cuenta de farmeo, echa un vistazo a nuestra guía de farm account aquí.

Necesitarás mejorar tu alliance resource center rápidamente para proporcionar a tu cuenta principal la mayor cantidad de recursos posible.

Además: ¡Puedes crear más si tienes tiempo!', 'https://cod.guide/farming-tips/', false, array[]::text[]),
    (v_guide, 10, '¡Activa tus notificaciones!', 'Para muchos jugadores puede parecer de sentido común, pero es importante activar las notificaciones en tu PC/móvil y enviar de inmediato a tus gatherers a farmear cuando regresen a tu ciudad.

Algunas personas no priorizan el farmeo al principio porque creen que tienen suficientes packs de recursos. Aunque esto puede ser cierto al inicio, una vez que el nivel de tu city hall llegue a alrededor de 17, empezarás a notar una escasez de recursos que continuará hasta que obtengas las T5.

Si te tomas el juego en serio y quieres avanzar más rápido que tus compañeros, es crucial farmear de forma eficiente y frecuente.', 'https://cod.guide/farming-tips/', false, array['https://cdn.cod.guide/wp-content/uploads/2023/06/destroy-small-cities.png']::text[]),
    (v_guide, 11, 'Atacar a otros jugadores (Raiding)', 'Para quienes están avanzados en el juego, aquí tienes un consejo de farmeo que puedes usar.

Tu objetivo es explorar (scout) las ciudades cercanas, en particular las de nivel bajo. Los jugadores que han dejado el juego o que han agotado sus recursos son tus objetivos.

Sin embargo, asegúrate de que no tengan demasiadas tropas defendiendo su ciudad. No querrás sufrir demasiadas bajas.

También es obligatorio calcular el coste de entrenar tus tropas por si mueren.

Por ejemplo, si atacas una aldea con 2 millones de recursos y pierdes 3k tropas T4, aún podrías obtener beneficio. Pero si atacas una ciudad con 10 millones de recursos y pierdes 8k tropas, el beneficio será más significativo, aunque tengas que esperar dos días para volver a entrenar tus tropas.', 'https://cod.guide/farming-tips/', false, array[]::text[]),
    (v_guide, 12, 'Resumen', 'El desarrollo temprano, por un lado, depende de estar mucho tiempo conectado y de un alto uso de recolección de recursos e items de aceleración; por otro lado, presta atención a unirte al círculo de jugadores activos lo antes posible.

Crecer juntos en una alianza activa es aún más rápido, y tener amigos hace tu experiencia de juego aún mejor.

Después de todo, el lobo solitario y el grupo activo, ¿cuál es más atractivo?', 'https://cod.guide/farming-tips/', false, array[]::text[]);
end
$IMPERIUM$;

do $IMPERIUM$
declare
  v_game uuid;
  v_guide uuid;
begin
  select id into v_game from public.games where slug = 'call-of-dragons';
  if v_game is null then
    raise exception 'IMPERIUM: juego no encontrado: %', 'call-of-dragons';
  end if;

  -- Reemplazo idempotente. OJO: borra los pasos -> reinicia step_progress de esta guía.
  delete from public.guide_steps where guide_id in (
    select id from public.guides where game_id = v_game and slug = 'conseguir-recursos');
  delete from public.guides where game_id = v_game and slug = 'conseguir-recursos';

  insert into public.guides
    (game_id, slug, title, description, order_index, is_published, intro_title, intro, intro_images)
  values
    (v_game, 'conseguir-recursos', 'Cómo Conseguir Recursos', 'Guía completa de las mejores formas de obtener oro, madera, mineral y maná en Call of Dragons: héroes y unidades de recolección, artefactos, misiones, eventos, tecnología y mucho más.', 6, false, null, null, array['https://cdn.cod.guide/wp-content/uploads/2023/02/pan-gathering-skill-in-Call-of-Dragons-1024x576.png']::text[])
  returning id into v_guide;

  insert into public.guide_steps
    (guide_id, order_index, title, content, source_url, is_verified, images)
  values
    (v_guide, 1, 'Usa héroes de recolección adecuados', 'Los héroes en Call of Dragons vienen en muchas formas y tamaños, cada uno con su utilidad especial. Mientras que algunos son más adecuados para escaramuzas PvP, atacar Bastiones de otros jugadores o enfrentarse a Darklings y fuerzas oscuras, otros son más útiles para recolectar recursos.

Indis (Legendaria) y Pan (Épica) son excelentes ejemplos de héroes que destacan en la recolección de recursos.

Tanto Indis como Pan tienen habilidades y talentos especiales que los hacen ideales para recoger oro, madera, mineral y maná de los puntos de recursos.

Por ejemplo, el árbol de talentos de recolección de Pan se centra en maximizar la eficiencia de recolección, como aumentar la velocidad de recolección y la capacidad de carga de recursos, e incluso otorgar un 50% de bonificación a la producción de recursos de tu ciudad durante una hora si Pan y su legión han estado recolectando durante al menos una hora.

Si tienes alguno de estos héroes, asegúrate de maximizar sus talentos de recolección para aprovechar al máximo tu potencial de recolección de recursos.', 'https://cod.guide/get-resources/', false, array[]::text[]),
    (v_guide, 2, 'Usa unidades de recolección adecuadas (tropas)', 'Si formas parte de las facciones League of Order, Springwardens o Wilderburg en Call of Dragons, tendrás acceso a la unidad de transporte respectiva de cada facción:

- Workhorses para la League of Order,

- Work-Elks para los Springwardens

- Workrhinos de Wilderburg.

Al recolectar recursos de los puntos de recursos, estas son las mejores unidades de transporte que puedes usar, ya que tienen la mayor capacidad de carga de recursos. Cada unidad de transporte tiene además sus propios beneficios especiales.

Por ejemplo, los Workrhinos de Wilderburg obtienen recursos extra después de que un punto de recursos se agota. Los Work-Elks de los Springwardens tienen la mayor velocidad al dirigirse a los puntos de recursos. Los Workhorses de la League of Order tienen la mayor capacidad de carga.

Pero es importante señalar que los Workhorses de mayor nivel no ofrecen más capacidad de carga, ya que los Workhorses de nivel 1 tienen la más alta.

Además, la facción League of Order obtiene una bonificación de +10% de velocidad de recolección, lo que vale la pena tener en cuenta a la hora de decidir a qué facción unirse.', 'https://cod.guide/get-resources/', false, array['https://cdn.cod.guide/wp-content/uploads/2023/02/Gathering-Artifact-1024x576.png']::text[]),
    (v_guide, 3, 'Usa artefactos de recolección', 'Hacer uso de un artefacto de recolección es tan efectivo como tener un héroe de recolección en Call of Dragons. Puedes conseguir estos artefactos usando Llaves de Artefacto Universal en el Altar (el mismo lugar donde reclutas héroes).

Estos son algunos de los mejores artefactos a considerar:

- Ancient Tree Roots: este artefacto Legendario aumenta la capacidad de carga de recursos de tu legión en un 24,7% y su HP en un 2% cuando está completamente mejorado. También te permite teletransportar instantáneamente a tu legión a un punto de recursos de alto nivel aleatorio dentro de un cierto rango.

- Greenfinger Sickle: este artefacto Épico aumenta la capacidad de carga de recursos de tu legión en un 21,7%. También te permite recolectar 400.000 de madera, 300.000 de mineral o 160.000 de maná de un punto de recursos elegido. Sin embargo, la cantidad de recursos recolectados no debe superar la capacidad de carga de la legión ni la cantidad restante de recursos en el punto. Además, tiene un tiempo de recarga de 12 horas.

- Enchanted Coins: artefacto Avanzado pero muy útil, aumenta mucho la velocidad de recolección general.', 'https://cod.guide/get-resources/', false, array['https://cdn.cod.guide/wp-content/uploads/2023/02/main-quest-Call-of-Dragons-1024x471.png']::text[]),
    (v_guide, 4, 'Completa misiones', 'Completar misiones principales y secundarias en Call of Dragons es una forma ideal de conseguir recursos, especialmente en las primeras etapas del juego.

Estas misiones son muy gratificantes; te proporcionan oro, madera, mineral y otras ventajas como gemas y mejoras. Para acceder a la página de misiones, simplemente toca el icono del pergamino situado en la esquina superior izquierda.

Una vez que termines una misión, aparecerá una burbuja roja con un número que te informará de cuántas misiones has completado para que puedas canjear tus recompensas.', 'https://cod.guide/get-resources/', false, array['https://cdn.cod.guide/wp-content/uploads/2023/02/Call-of-Dragons-Daily-Quests-Rewards-1024x576.png']::text[]),
    (v_guide, 5, 'Hacer desafíos (misiones diarias)', 'Los desafíos son tareas similares a las que se encuentran en las misiones principales y secundarias, pero están relacionados con eventos específicos y ofrecen recompensas diferentes.

Durante el evento Titan''s Legacy, completar desafíos diarios, semanales o de temporada te dará Rune EXP y Keys of Titan, ambos necesarios para abrir el gran cofre situado en la parte superior de la página de desafíos.

Una vez que la barra de progreso esté llena, el cofre te recompensará con gemas, aceleradores, madera, mineral, maná y otras cosas buenas; el tipo y la cantidad de recompensas dependen de tu nivel de runa actual.

Como el nivel de runa 1 requiere 6 desafíos diarios para abrir el cofre, estos son los más fáciles de completar, siendo los desafíos de temporada los más difíciles.

Puedes alternar entre estas tres categorías y consultar los requisitos de cada desafío tocando las pestañas situadas debajo de la barra de progreso del cofre.', 'https://cod.guide/get-resources/', false, array['https://cdn.cod.guide/wp-content/uploads/2023/02/Alliance-Territory-Rewards-1024x576.png']::text[]),
    (v_guide, 6, 'Recoge las recompensas del territorio de alianza cada día', '¿Quieres conseguir oro y recursos extra? Los miembros de una alianza pueden aprovechar una recompensa especial, pero solo si su alianza tiene un territorio.

El tamaño del territorio determina la cantidad de recursos que puedes recibir, lo que incluye oro, madera, mineral y maná.

La recompensa se acumula durante un periodo de 24 horas, así que asegúrate de reclamarla a diario para no perdértela. Para recogerla, abre el menú de la alianza y selecciona la opción ''Territorio''.

Luego, si hay recursos disponibles, simplemente toca el botón ''Reclamar'' y se añadirán a tu cuenta.', 'https://cod.guide/get-resources/', false, array['https://cdn.cod.guide/wp-content/uploads/2023/01/Call-of-Dragons-Dark-Chests-1024x765.png']::text[]),
    (v_guide, 7, 'Conseguir Dark Chests', 'Derrotar a las Darkling Legions en Call of Dragons es una gran manera de conseguir recursos y subir de nivel a tu héroe. Al vencer a una Darkling Legion, serás recompensado con una Darkling Key. Usa estas llaves para abrir los Dark Chests repartidos por el mapa fuera de tu ciudad.

Para abrir el cofre, debes tener el número necesario de llaves y luego derrotar a los Darkling Guards que lo custodian. La dificultad y la forma de las criaturas pueden variar, y pueden ser bastante difíciles de derrotar si tu legión no es lo suficientemente fuerte.

Cuanto más grande sea el cofre, más recompensas podrás recoger. Estos Dark Chests contienen muchos recursos valiosos, incluidos Resource Bundles con una buena cantidad de recursos.', 'https://cod.guide/get-resources/', false, array['https://cdn.cod.guide/wp-content/uploads/2023/02/system-mail-gift-1024x576.png']::text[]),
    (v_guide, 8, 'Regalos del sistema en el correo', 'Cada vez que tu ciudad alcanza un nuevo nivel, recibirás una recompensa especial por correo con madera, mineral, Gold Keys y otras cosas buenas, enviada a través de la pestaña del sistema en el correo del juego.

Los desarrolladores también pueden enviar recompensas tras una actualización importante o un mantenimiento del servidor.

Así que asegúrate de revisar siempre tu correo y recoger las recompensas que te ayudarán a avanzar. Puedes recogerlas individualmente o simplemente pulsar el botón "Leer y reclamar todo", como se muestra en la captura de pantalla.', 'https://cod.guide/get-resources/', false, array['https://cdn.cod.guide/wp-content/uploads/2023/01/Strongest-Lord-Event-Call-of-Dragons-1024x576.png']::text[]),
    (v_guide, 9, 'Completar eventos', '¡Los eventos son una gran manera de conseguir más recursos en Call of Dragons!

El juego suele organizar eventos especiales que implican tareas como recolectar un determinado recurso, mejorar edificios o iniciar sesión durante un número específico de días.

Por ejemplo, el evento Strongest Lord tiene una serie de misiones a lo largo de 5 días en las que puedes recibir muchos recursos completando las misiones indicadas. Las recompensas incluyen fichas de héroe, Gold Keys y Llaves de Artefacto Universal.

Para llegar a la página de eventos, simplemente toca el icono del pergamino (el primer icono) en la parte superior derecha de tu pantalla.', 'https://cod.guide/get-resources/', false, array['https://cdn.cod.guide/wp-content/uploads/2023/02/Daily-Deals-Call-of-Dragons-1024x576.png']::text[]),
    (v_guide, 10, 'Ofertas diarias gratuitas', '¡Dirígete a la página del Mercado y echa un vistazo a la pestaña de Daily Deals! Encontrarás algunos paquetes premium, así como un cofre diario gratuito lleno de recursos.

Solo hace falta un toque para reclamar los recursos.

Las recompensas no son muchas, pero definitivamente son útiles al principio del juego.

Para encontrar esta página, toca la ranura animada (que cambia con cada promoción) situada junto al icono de eventos en la esquina superior derecha. Luego, toca la pestaña Daily Deals como se muestra en la captura de arriba.', 'https://cod.guide/get-resources/', false, array['https://cdn.cod.guide/wp-content/uploads/2023/02/gathering-boost-1024x576.png']::text[]),
    (v_guide, 11, 'Gathering Boost', 'Los objetos Resource Boost y Gathering Boost pueden dar un gran impulso a tu producción de recursos y a tu velocidad de recolección. Vienen en dos formatos, de 8 horas y de 24 horas, y se pueden consumir antes de enviar a tus tropas a recolectar recursos.

Estos objetos se pueden encontrar en el edificio Shop y se pueden comprar con gemas. La producción de madera, maná y mineral se puede aumentar en un 25% con estos objetos.

Un boost de 8 horas te costará 70 gemas, y un objeto de boost de recursos de 24 horas costará 300 gemas. Pero nunca se recomienda comprarlos con gemas. Puedes conseguirlos gratis en muchos eventos.', 'https://cod.guide/get-resources/', false, array['https://cdn.cod.guide/wp-content/uploads/2023/01/green-wood-boost.png', 'https://cdn.cod.guide/wp-content/uploads/2023/02/8-hour-gathering-boost.png', 'https://cdn.cod.guide/wp-content/uploads/2023/01/alliance-tech-Call-of-Dragons-1024x576.png']::text[]),
    (v_guide, 12, 'Tecnología de economía', 'El árbol de tecnología de economía (Economy Tech Tree) en Call of Dragons es imprescindible a la hora de desarrollar tu Bastión.

Al investigar ciertas mejoras como Logging Techniques y Forestry, puedes aumentar la producción de recursos y la velocidad de recolección de tu ciudad.

Además, investigar el árbol de tecnología de economía aumentará tu capacidad de carga, que es la cantidad de recursos que tus legiones pueden tomar de los puntos de recursos. Para aumentar aún más la capacidad de carga, puedes investigar la tecnología Container Upgrade.

Por último, investigar Mana Prospering permitirá que tus legiones recolecten maná. Por lo tanto, es sensato centrarse en investigar el árbol de tecnología de economía antes que el militar.

Hacerlo mejorará tu producción de recursos y desbloqueará nuevas funciones relacionadas con los recursos que serán beneficiosas a largo plazo.', 'https://cod.guide/get-resources/', false, array['https://cdn.cod.guide/wp-content/uploads/2023/02/Call-of-Dragons-Resource-Tokens-1024x576.png']::text[]),
    (v_guide, 13, 'Objetos de recursos', 'Puedes conseguir recursos haciendo misiones, recolectando de los puntos de recursos, abriendo cofres y participando en eventos, así como a través de la Tienda.

Si tienes suficientes gemas, puedes usarlas para comprar objetos de recursos. Por ejemplo, un objeto de 1,5M de madera te costará 2.300 gemas.

Para acceder a la pestaña de objetos de recursos de la Tienda, toca el edificio Store y luego selecciona el tercer icono, el de la bolsa de monedas. Desplázate hacia abajo y elige el objeto de recurso que quieras comprar.', 'https://cod.guide/get-resources/', false, array['https://cdn.cod.guide/wp-content/uploads/2023/02/Upgrading-Honorary-VIP-Membership-1-1024x576.png']::text[]),
    (v_guide, 14, 'Honorary Membership', 'Situada en el edificio Store, la Honorary Membership ofrece numerosas ventajas.

Cada día se puede reclamar una recompensa que contiene recursos. Mejorar el nivel de la Honorary Membership desbloquea mejores recompensas y buffs para los recursos de la ciudad.

Por ejemplo, mejorar al nivel 1 otorga 5 nuevos buffs de recursos, incluida la producción de mineral, maná y madera, y un aumento del 5% en la velocidad de recolección.

Cuanto más alto sea el nivel de la Honorary Membership, mejores serán los buffs y las recompensas diarias.

Además, la pestaña Store de esta página da acceso a un conjunto de objetos con descuento justo al lado de la pestaña Perks.', 'https://cod.guide/get-resources/', false, array['https://cdn.cod.guide/wp-content/uploads/2023/02/goblin-merchant-Call-of-Dragons-1024x576.png']::text[]),
    (v_guide, 15, 'Goblin Merchants', 'Una vez que tu ciudad sube al nivel 6, el edificio Hall of Order te da acceso al Goblin Market. El Goblin Merchant aparecerá en tu ciudad periódicamente, ofreciendo varios objetos y recursos a precios con descuento.

Hace poco compré 50.000 de oro por solo 40.000 de madera, un descuento fijo del -25%, y 7.500 de mineral por solo 5 gemas.

¡Mantente atento al Goblin Merchant y aprovecha sus ofertas!', 'https://cod.guide/get-resources/', false, array['https://cdn.cod.guide/wp-content/uploads/2023/02/opening-Call-of-Dragons-chests-1024x576.png']::text[]),
    (v_guide, 16, 'Abrir cofres', 'La función de reclutamiento de héroes (Hero Recruitment) en el edificio Altar te da la oportunidad de reclutar nuevos héroes. Sin embargo, las probabilidades de conseguir grandes héroes son escasas, por lo que tienes más posibilidades de obtener objetos de recursos.

Estos objetos se pueden recibir tanto del reclutamiento del Silver Chest como del Gold Chest.

Tienes un 76,2% de probabilidad de conseguir objetos de recursos Avanzados (hasta 50.000 recursos), y un 3,2% de probabilidad de conseguir objetos de recursos Elite, por ejemplo, 150.000 de oro/madera o 112.000 de mineral.

Nota: abrir 10 llaves a la vez no aumenta tus probabilidades de conseguir recompensas. Simplemente ábrelas si necesitas recursos.', 'https://cod.guide/get-resources/', false, array['https://cdn.cod.guide/wp-content/uploads/2023/02/rewards-chatting-heroes-1024x576.png']::text[]),
    (v_guide, 17, 'Regalos por charlar con los héroes', '¡Sí, lo has entendido bien! En Call of Dragons, los héroes también pueden ofrecerte regalos especiales. Esto se consigue entablando breves conversaciones con ellos, tras las cuales te ofrecerán un regalo especial que incluye recursos y otros objetos esenciales.

Para hacerlo, mientras estás dentro de tu ciudad, los héroes disponibles para charlar tendrán un icono de bocadillo de 3 puntos, que te informa de que puedes iniciar la conversación.

Una vez que tocas ese icono, el héroe te dirá algo o te pedirá consejo y tendrás que elegir una opción. La respuesta que des afectará a si te ofrece un regalo o no.

Esta función también aumenta tu nivel de reputación con cada héroe, a través del cual puedes desbloquear una serie de cosas interesantes, como historias sobre el héroe y audios cortos.', 'https://cod.guide/get-resources/', false, array[]::text[]);
end
$IMPERIUM$;

do $IMPERIUM$
declare
  v_game uuid;
  v_guide uuid;
begin
  select id into v_game from public.games where slug = 'call-of-dragons';
  if v_game is null then
    raise exception 'IMPERIUM: juego no encontrado: %', 'call-of-dragons';
  end if;

  -- Reemplazo idempotente. OJO: borra los pasos -> reinicia step_progress de esta guía.
  delete from public.guide_steps where guide_id in (
    select id from public.guides where game_id = v_game and slug = 'subir-de-nivel-rapido');
  delete from public.guides where game_id = v_game and slug = 'subir-de-nivel-rapido';

  insert into public.guides
    (game_id, slug, title, description, order_index, is_published, intro_title, intro, intro_images)
  values
    (v_game, 'subir-de-nivel-rapido', 'Cómo Subir de Nivel Rápido', 'Todas las formas de ganar experiencia y subir de nivel a tus héroes rápidamente en Call of Dragons: recompensar códigos, farmear, derrotar Darklings, asaltar Behemoths y mucho más.', 7, false, null, null, array['https://cdn.cod.guide/wp-content/uploads/2023/02/level-up-heroes-in-Call-of-Dragons-1024x576.png']::text[])
  returning id into v_guide;

  insert into public.guide_steps
    (guide_id, order_index, title, content, source_url, is_verified, images)
  values
    (v_guide, 1, '¿Por qué necesito subir de nivel a mis héroes en Call of Dragons?', 'La razón por la que necesitas aumentar la XP de tus héroes es para trabajar sus árboles de talentos.

El árbol de talentos es muy importante; otorga buffs a tus héroes. Por ejemplo, si estás trabajando en un héroe Recolector (Gatherer), te permitirá recolectar recursos más rápido.

Cuando libras un combate PVP en Call of Dragons, hay una limitación relacionada con la 💧 Stamina. Cada vez que tu héroe sale de tu ciudad y vuelve, consumes 10 de stamina por esa acción, y destruir edificios enemigos también consume stamina de forma gradual.

Tienes que esperar a que la Stamina se regenere.

Así que, trabajando todos tus héroes, si se te agota la stamina en uno de ellos, todavía tendrás los demás disponibles.

Sube de nivel a tus héroes para sacarles más partido a todos.', 'https://cod.guide/level-up-fast/', false, array[]::text[]),
    (v_guide, 2, 'Recompensa códigos de regalo', 'Conseguirás muchos impulsos iniciales enormes con solo recompensar códigos de Call of Dragons. Ganarás EXP, objetos valiosos, así como gemas y recursos. ¡Siempre hay algo para todos!

Esto hace que sea un gran juego para implicarse en cualquier momento, así que, ¿por qué no probarlo?', 'https://cod.guide/level-up-fast/', false, array[]::text[]),
    (v_guide, 3, 'Ganar XP farmeando', 'También puedes obtener XP de héroe farmeando.

Los Recolectores (Gatherers) tienen un árbol de talentos llamado Earth''s Grace que puede ayudarte a farmear una tonelada de XP mientras estás desconectado, solo por recolectar.

Ten en cuenta que solo los recolectores, que son los héroes principales, pueden ganar XP recolectando recursos. El juego ya no da EXP al héroe adjunto (deputy). Pero siempre deberías tener un recolector liderando cada Legión para maximizar la velocidad de farmeo.', 'https://cod.guide/level-up-fast/', false, array['https://cdn.cod.guide/wp-content/uploads/2023/03/level-up-by-farming-resources-1024x327.png', 'https://cdn.cod.guide/wp-content/uploads/2023/03/farming-Acolytes-in-Call-of-Dragons-1024x680.png']::text[]),
    (v_guide, 4, 'Derrotar Darklings', 'La primera forma de conseguir algo de XP es derrotar a las criaturas que ves fuera de tu base.

Las patrullas de Darklings proporcionan más XP de héroe; esta es sin duda la vía si buscas XP de héroe. Pero si derrotas a las criaturas oscuras, vas a obtener más Arcane Dust (Polvo Arcano) para mejorar Artefactos.

Cada vez que los derrotas, no solo eso, también vas a conseguir algunos Tactic Manuals (Manuales de Táctica), algunos aceleradores de entrenamiento y recursos.

No olvides unirte con los miembros de tu Alianza para farmear Acolytes (Acólitos) también.

Si eres capaz de derrotar Darklings con facilidad, se recomienda usar una sola marcha para minimizar la cantidad de CP perdida. Por cada Darkling consecutivo derrotado con la misma marcha y sin volver a tu castillo, el coste se reducirá en 1 CP, hasta un mínimo de 40 CP por combate.

Intenta apuntar al Darkling de nivel más alto que puedas derrotar. Usa varias Legiones si quieres. La XP ganada no se dividirá. Cada una de tus Legiones seguirá obteniendo el 100% de la XP.

Así es como deberían ser tus marchas:

- Infantry (Infantería): La mejor para encajar daño por tus otras marchas. En general, querrás que sea lo más tanque posible.

- Marksman (Tirador): Gran DPS contra Behemoths después del juego temprano. Ofrecen el mejor DPS pero menor alcance de ataque que los Mage.

- Mage (Mago): Geniales contra Behemoths en las primeras etapas del juego. Geniales para PvP por el alcance de ataque y el daño en área (AoE). Si eres un gastador medio y puedes maximizar a Liliya pronto, usa Mage como tu fuerza principal para PvP en el juego temprano.

- Cavalry (Caballería): La mejor para combates en campo abierto y destruir las líneas traseras enemigas por su rápida velocidad de marcha y su gran daño contra unidades a distancia. Se puede usar para farmear recolectores. A veces útil en asaltos a Behemoths.

- Flying (Voladoras): Según la ubicación de tu ciudad, esto podría tener distintos usos. Normalmente puedes usarlas para hit-and-run por su rápida velocidad de movimiento y porque pueden moverse sobre todos los terrenos. ¡También puedes usar héroes Mage con Celestials (tropas voladoras humanas) y ganar más daño!', 'https://cod.guide/level-up-fast/', false, array['https://cdn.cod.guide/wp-content/uploads/2023/03/arcane-dust.png', 'https://cdn.cod.guide/wp-content/uploads/2023/03/tactic-manual.png', 'https://cdn.cod.guide/wp-content/uploads/2023/02/cp.png', 'https://cdn.cod.guide/wp-content/uploads/2023/02/liliya.png', 'https://cdn.cod.guide/wp-content/uploads/2023/02/darkling-fort-1024x627.jpg']::text[]),
    (v_guide, 5, 'Destruir Fuertes de Darklings', 'Los Fuertes de Darklings (Darkling Forts) son otra gran forma de subir de nivel a tus héroes debido a la gran cantidad de puntos de experiencia que obtienes de los Tactic Manuals, junto con las demás recompensas.

No solo eso, sino que recompensas adicionales como el Treaty (Tratado) para mejorar tu Edificio de Rally solo se pueden conseguir destruyendo Fuertes.

Pedir a los miembros fuertes de tu Alianza que inicien el Rally sobre los Fuertes de Darklings ayuda mucho a los jugadores free-to-play. La victoria está garantizada.', 'https://cod.guide/level-up-fast/', false, array['https://cdn.cod.guide/wp-content/uploads/2023/03/tactic-manual.png', 'https://cdn.cod.guide/wp-content/uploads/2023/02/treaty.png']::text[]),
    (v_guide, 6, 'Asaltar Behemoths', '¡Sube de nivel a tus héroes uniéndote con la Alianza para derrotar Unidades Behemoth! Derrotarlos otorga XP y un montón de otras recompensas como Arcane Dust y Prestige, sin necesidad de Command Points.', 'https://cod.guide/level-up-fast/', false, array['https://cdn.cod.guide/wp-content/uploads/2023/03/arcane-dust.png', 'https://cdn.cod.guide/wp-content/uploads/2023/02/prestige.png', 'https://cdn.cod.guide/wp-content/uploads/2023/02/dragon-trail-rewards-1024x576.png']::text[]),
    (v_guide, 7, 'Dragon Trail', 'El Dragon Trail te dará XP de héroe a través del Tactics Manual; lo ganas por hora, así que querrás llegar al nivel más alto posible aquí.

Recuerda, estos manuales de táctica se reiniciarán después de que termine la temporada, así que conocer todos estos pasos para conseguir los manuales de táctica te será muy útil porque, una vez que termine la temporada, podrás volver a conseguirlos durante el mismo proceso y podrás subir de nivel a tus héroes rápido.', 'https://cod.guide/level-up-fast/', false, array[]::text[]),
    (v_guide, 8, 'Completa eventos y misiones diarias', 'Call of Dragons ofrece muchos eventos en los que participar, y la mayoría de ellos ofrecen los libros de XP.

Por lo tanto, asegúrate de completar todos los eventos abiertos, ya que las recompensas van más allá de la experiencia; recibirás otros objetos súper raros para disparar el progreso de tu cuenta.', 'https://cod.guide/level-up-fast/', false, array[]::text[]),
    (v_guide, 9, 'Aumenta tu nivel de Honor/VIP', 'Ganar un nivel de Honor/VIP no te otorgará EXP de héroe directamente, pero te dará una abundancia de Command Points así como otros buffs para los combates como velocidad de entrenamiento, ATK/DEF de Legión, etc.

Armado con más Command Points, podrás farmear más Darklings, lo que a su vez te hará ganar experiencia.

La investigación enseña mejoras que aumentan tu poder de CP.', 'https://cod.guide/level-up-fast/', false, array['https://cdn.cod.guide/wp-content/uploads/2023/02/CP-Tech-2-1024x576.png', 'https://cdn.cod.guide/wp-content/uploads/2023/02/CP-Tech-1-1024x576.png']::text[]),
    (v_guide, 10, 'Investiga tu Tecnología y Políticas', 'Investigar tecnología es imprescindible, ya que eventualmente tendrás que conseguir unidades T5.

Profundizar en la tecnología potenciará la fuerza de tus unidades, permitiéndote desafiar a enemigos más duros para obtener más experiencia.

Además, cierta tecnología puede aumentar la tasa de recuperación y el tope de Command Points, lo que te permitirá luchar contra las fuerzas Darkling con más frecuencia.

También, aumenta tu potencial de obtener más XP a través de las Policies (Políticas). A medida que realizas tus Dragon Trails, obtienes más Prestige. Luego puedes consumir Prestige en los War Studies, lo que te dará un bonus de XP de héroe del 12,5% en total.

Así que, trabajar tus políticas es definitivamente algo que deberías hacer pronto en el juego cuando empieza la temporada.', 'https://cod.guide/level-up-fast/', false, array['https://cdn.cod.guide/wp-content/uploads/2023/02/prestige.png']::text[]);
end
$IMPERIUM$;

do $IMPERIUM$
declare
  v_game uuid;
  v_guide uuid;
begin
  select id into v_game from public.games where slug = 'call-of-dragons';
  if v_game is null then
    raise exception 'IMPERIUM: juego no encontrado: %', 'call-of-dragons';
  end if;

  -- Reemplazo idempotente. OJO: borra los pasos -> reinicia step_progress de esta guía.
  delete from public.guide_steps where guide_id in (
    select id from public.guides where game_id = v_game and slug = 'curacion-hospital');
  delete from public.guides where game_id = v_game and slug = 'curacion-hospital';

  insert into public.guides
    (game_id, slug, title, description, order_index, is_published, intro_title, intro, intro_images)
  values
    (v_game, 'curacion-hospital', 'Hospital y Curación de Tropas', 'Cómo funciona el hospital y los dos tipos de curación: Free Healing con Elixir (gratis) y Resource Healing (con recursos), y cómo sacarles el máximo partido.', 8, false, null, null, array['https://cdn.cod.guide/wp-content/uploads/2023/02/Call-of-Dragons-Healing-Guide-1024x576.png']::text[])
  returning id into v_guide;

  insert into public.guide_steps
    (guide_id, order_index, title, content, source_url, is_verified, images)
  values
    (v_guide, 1, 'Los hospitales en Call of Dragons', 'El hospital es el lugar al que van tus tropas gravemente heridas (severely wounded) tras la batalla. El hospital no tiene límite de tropas gravemente heridas que puede albergar. Como principiante, conviene usar tu hospital de forma eficiente.

Hay dos tipos de curación en los hospitales: uno es la Free Healing (curación gratis); el otro es la Resources Healing (curación con recursos).', 'https://cod.guide/healing/', false, array[]::text[]),
    (v_guide, 2, 'Free Healing (curación con Elixir)', 'La Free Healing es donde puedes curar tus tropas gravemente heridas usando el Elixir, que se produce con el tiempo. No necesitas gastar recursos ni speedups en ello. Literalmente solo tienes que esperar.

1 Elixir = 1 tropa curada.

La curación con Elixir no cuesta recursos. Cada botella de Elixir cura 1 unidad gravemente herida. La velocidad de producción de Elixir está determinada por el nivel de tu Hospital y tu Unit Count total (incluyendo las Legions en tu Hospital). Cuanto mayor sea tu Unit Count total y el nivel de esas unidades, más rápida será tu velocidad de producción de Elixir. Activar las Policies correspondientes también aumentará tu velocidad de producción de Elixir. Se puede producir un máximo de 2.000.000 de Elixir al día.

Activar la Free Healing en tu Policy también aumenta tu velocidad de curación. Si eres F2P o gastas poco, elegir Free Healing en la Policy es tu mejor opción.

¡Pasa a la siguiente sección para ver cómo sacarle el máximo partido a la curación con Elixir!', 'https://cod.guide/healing/', false, array['https://cdn.cod.guide/wp-content/uploads/2023/07/elixir.png', 'https://cdn.cod.guide/wp-content/uploads/2023/07/elixir-healing-Call-of-Dragons-1024x614.jpg']::text[]),
    (v_guide, 3, 'Resource Healing (curación con recursos)', 'La Resources Healing, por otro lado, no es recomendable si eres F2P o gastas poco. Curar tropas, especialmente desde T4, es muy caro.

A menos que seas una ballena (whale), la curación con recursos no debería ser una opción. La Resources Healing te permite curar al instante tus tropas en el hospital a cambio de pagar recursos.

Elegir Resource Healing costará recursos, pero cura las Legions al instante. La Resource Healing tiene un límite diario máximo, determinado por el nivel de tu Hospital y tu Unit Count total (incluyendo las Legions en tu Hospital). Cuanto mayor sea tu total de unidades y el nivel de esas unidades, más rápida será tu Heal Speed. Además, activar las Policies correspondientes también aumentará tu límite diario de Resource Healing hasta un máximo de 3.000.000.', 'https://cod.guide/healing/', false, array['https://cdn.cod.guide/wp-content/uploads/2023/03/resource-healing-in-Call-of-Dragons-1024x513.png']::text[]),
    (v_guide, 4, 'El sistema de curación de Call of Dragons', 'Al aumentar tu velocidad de free healing a diario, puedes curar más tropas por día.

Así que si quieres aumentar tu free healing, debes trabajar las habilidades de free healing en las Policies en lugar de elegir la resource healing.

La resource healing te permite aumentar, por supuesto, la capacidad de la curación instantánea que puedes hacer con recursos.

Ten en cuenta que la Free healing tiene un máximo de 2M y la Resource healing un máximo de 3M. Así que considera esto: solo hay una diferencia de 1M de tropas.

¿De verdad gastarías 3M en coste de recursos de curación? ¿o prefieres curar gratis 2M al día, que puedes obtener a razón de 83.000 por hora hasta un máximo de 2M?

Elegir Free healing no significa que no puedas hacer resource healing, simplemente estaría más limitada.', 'https://cod.guide/healing/', false, array['https://cdn.cod.guide/wp-content/uploads/2023/07/elixir-healing-policy.png']::text[]),
    (v_guide, 5, '¿Free Healing o Resource Healing?', 'Elegir free healing es la jugada correcta; avanzando hacia el end game quizá siga siendo free healing y tal vez algo de resource healing.

Pero veo que el factor más limitante para los jugadores será la stamina más que las tropas.

Sospecho que los jugadores tendrán muchas más tropas de las que pueden usar cuando lleguemos al late game, debido a que la capacidad del hospital es ilimitada.

En el early game, trabaja las policies de resource healing diarias. Te enfrentarás a muchas guerras civiles de servidor en el early game, y será un dolor de cabeza si no puedes farmear recursos durante ese tiempo.', 'https://cod.guide/healing/', false, array[]::text[]),
    (v_guide, 6, 'Cómo aprovechar la curación con Elixir (Free Healing)', 'Esta nueva mecánica reconfigura la forma en que estrategizamos y jugamos a Call of Dragons, con un fuerte enfoque en la actividad del jugador y el uso hábil de los items de Elixir.

La curación con Elixir ha sustituido al sistema anterior, donde las tropas se recuperaban automáticamente con el tiempo.

Ahora, tus tropas se curan mediante Elixir.

Curar tropas requiere Elixir en los hospitales.

Los hospitales producen Elixir con el tiempo.

A pesar del periodo de adaptación inicial, es crucial entender que esta mecánica no perjudica necesariamente a los jugadores gratuitos frente a los que gastan.

La participación activa es la clave para hacer de Call of Dragons una experiencia más dinámica y gratificante para los jugadores dedicados.', 'https://cod.guide/healing/', false, array['https://cdn.cod.guide/wp-content/uploads/2023/07/elixir.png']::text[]),
    (v_guide, 7, '¿Cómo conseguir items de Elixir?', 'Los items de Elixir no los produce el hospital de tu juego; en cambio, recoges estas valiosas pociones en la Merit store mediante el combate.

Al usar un item de Elixir, aumenta la capacidad de curación en el hospital, lo que significa que puedes restaurar más tropas de una sola vez.

Elixir en la Merit Store

Ten en cuenta, no obstante, que la curación se hace por lotes y tiene un tope máximo para evitar abusos.

Se puede producir un máximo de 2 millones de Elixir al día.', 'https://cod.guide/healing/', false, array['https://cdn.cod.guide/wp-content/uploads/2023/07/elixir-in-merit-store-1024x560.png']::text[]),
    (v_guide, 8, 'Maximizar la curación con Elixir', 'Call of Dragons te anima a estar siempre al tanto de tu juego. Si tienes unidades heridas y no aprovechas tu free healing con Elixir a diario, estás desperdiciando un valioso potencial de recuperación.

Usa tu Elixir con sensatez para regenerar tropas a diario y mantener la fuerza de tu ejército.

Cuando se trata de curar, recuerda que no todas las tropas son iguales.

Las unidades de tier más alto aportan más valor, y es una jugada inteligente mejorar a los soldados de tier más bajo siempre que sea posible (espera hasta que tus marchas estén llenas).

Esto se debe a la proporción de curación uno a uno: curar una tropa de tier 2 cuesta lo mismo que curar una de tier 3.

Una de las características más destacadas de la curación con Elixir es la capacidad de curar tus unidades de forma selectiva.

A diferencia del sistema antiguo, donde el juego elegía a quién curar, ahora tienes control sobre qué unidades reciben atención. Esta flexibilidad permite decisiones más estratégicas según tus necesidades inmediatas en el campo de batalla.', 'https://cod.guide/healing/', false, array[]::text[]),
    (v_guide, 9, 'Potenciar tu curación con Elixir', 'Aumentar el nivel de tu hospital e implementar policies puede mejorar tu curación diaria con Elixir. Se recomienda encarecidamente centrarse solo en la Elixir Healing aquí.

También puedes beneficiarte de varios buffs, como los del Behemoth o de ciertas manastones.

Tu enfoque debe estar en potenciar la free Elixir healing en lugar de la resource healing, para ahorrar recursos valiosos y progresar de forma más efectiva en el juego.', 'https://cod.guide/healing/', false, array[]::text[]),
    (v_guide, 10, '¿Cuándo usar los items de Elixir?', 'Usar tus items de Elixir debe ser una decisión estratégica.

Dependiendo de tu estilo de juego y de la situación, hay muchas formas de usar los items de Elixir. En la mayoría de los casos, querrás usarlo cuando necesites tus tropas de inmediato para los combates. De lo contrario, puedes simplemente dejar tus tropas curándose en los hospitales, pero asegúrate de que tu Elixir no alcance el tope (cap).

Aunque es esencial mantener un flujo constante de curación, recuerda que estas pociones no son infinitas. Guárdalas para batallas intensas o eventos donde tener un ejército más grande y sano te dé una ventaja significativa.

Dosifica tu proceso de curación y ten cuidado con tus reservas de Elixir.', 'https://cod.guide/healing/', false, array['https://cdn.cod.guide/wp-content/uploads/2023/07/elixir-potion.png']::text[]),
    (v_guide, 11, 'Conclusión', 'En conclusión, aunque la función de curación con Elixir en Call of Dragons presenta nuevos retos, también introduce elementos de juego gratificantes. Pone el énfasis en la actividad del jugador y en la toma de decisiones estratégicas, haciendo el juego más atractivo.

Ahora que cuentas con este conocimiento, ¡vuelve al mundo de Call of Dragons y conquista el campo de batalla!', 'https://cod.guide/healing/', false, array[]::text[]);
end
$IMPERIUM$;

do $IMPERIUM$
declare
  v_game uuid;
  v_guide uuid;
begin
  select id into v_game from public.games where slug = 'call-of-dragons';
  if v_game is null then
    raise exception 'IMPERIUM: juego no encontrado: %', 'call-of-dragons';
  end if;

  -- Reemplazo idempotente. OJO: borra los pasos -> reinicia step_progress de esta guía.
  delete from public.guide_steps where guide_id in (
    select id from public.guides where game_id = v_game and slug = 'niveles-clave-ayuntamiento');
  delete from public.guides where game_id = v_game and slug = 'niveles-clave-ayuntamiento';

  insert into public.guides
    (game_id, slug, title, description, order_index, is_published, intro_title, intro, intro_images)
  values
    (v_game, 'niveles-clave-ayuntamiento', 'Niveles Clave del Ayuntamiento', 'Los niveles de City Hall más importantes que desbloquean tropas, colas de marcha y otras mejoras, además de la tabla completa de requisitos de mejora.', 9, false, null, null, array['https://cdn.cod.guide/wp-content/uploads/2023/02/Call-of-Dragons-Hall-Levels-1024x576.png']::text[])
  returning id into v_guide;

  insert into public.guide_steps
    (guide_id, order_index, title, content, source_url, is_verified, images)
  values
    (v_guide, 1, 'Niveles importantes del City Hall en Call of Dragons', '- CH nivel 12: Ya no puedes cambiar la región inicial, así que elige una alianza con cuidado.

- CH nivel 16 desbloquea las tropas t3 y la unidad voladora de tu Faction.

- CH nivel 17 desbloquea tu 4ª cola de marcha (march queue).

- CH nivel 21 desbloquea las tropas t4.

- CH nivel 22 desbloquea tu 5ª cola de marcha (march queue).

- CH nivel 25 desbloquea el nivel final del growth fund y recibe 40k gemas (si compraste un growth fund).', 'https://cod.guide/important-city-hall-levels/', false, array[]::text[]),
    (v_guide, 2, 'Requisitos de mejora del City Hall en Call of Dragons', 'City Hall Level | Pre-Req (LoO/SW/WB) | Legion Capacity | Legion Queue | Cost | Time | Power
2 (Settlement) | None | 1,000 | 1 | 3.5k Gold/Wood | 2s | 90
3 | None | 1,500 | 1 | 6.5k Gold/Wood | 5m | 120
4 (Village) | Lv.3 Wall | 2,000 | 2 | 11.8k Gold/Wood | 20m | 154
5 | Lv.4 Wall, Mint | 2,500 | 2 | 21.3k Gold/Wood | 1h | 383
6 | Lv.5 Wall Hospital | 3,000 | 2 | 36.3k Gold/Wood, 12k Stone | 2h | 852
7 | Lv.6 Wall | 3,500 | 2 | 54.4k Gold/Wood, 19.2k Stone | 5h | 1,847
8 | Lv.7 Wall | 4,000 | 2 | 81.8k Gold/Wood, 30.8k Stone | 10h | 3,706
9 | Lv.8 Wall | 4,500 | 2 | 122.8k Gold/Wood, 49.2k Stone | 15h | 6,504
10 (Town) | Lv.9 Wall | 5,000 | 2 | 184.3k Gold/Wood, 78.7k Stone | 22h | 10,933
11 | Lv.10 Wall | 5,500 | 3 | 277.5k Gold/Wood, 120k Stone | 1d 6h | 16,723
12 | Lv.11 Wall Lv.11 Scout Camp/Ranger Retreat/Centaur Sentry Post | 6,000 | 3 | 417.5k Gold/Wood, 180k Stone | 1d 16h | 24,693
13 | Lv.12 Wall | 6,500 | 3 | 627.5k Gold/Wood, 270k Stone | 2d 2h | 35,213
14 | Lv.13 Wall Lv.13 Mana Refinery | 7,000 | 3 | 942.5k Gold/Wood, 405k Stone | 2d 12h | 48,838
15 | Lv.14 Wall Lv.14 Storehouse | 7,500 | 3 | 1.4m Gold/Wood, 607.5k Stone | 2d 22h | 66,400
16 (Citadel) | Lv.15 Wall | 8,000 | 3 | 2.1m Gold/Wood, 912.5k Stone | 4d | 91,451
17 | Lv.16 Wall Lv.16 Abbey/Longeaf Arch/Satyr Lodge | 8,500 | 4 | 3.2m Gold/Wood, 1.4m Stone | 4d 20h | 125,005
18 | Lv.17 Wall Lv.17 Scout Camp/Ranger Retreat/Centaur Sentry Post | 9,000 | 4 | 4.8m Gold/Wood, 2.1m Stone | 5d 20h | 170,590
19 | Lv.18 Wall | 9,500 | 4 | 7.2m Gold/Wood, 3.1m Stone | 7d | 232,957
20 | Lv.19 Wall | 10,000 | 4 | 10.8m Gold/Wood, 4.7m Stone | 8d 6h | 318,769
21 (Metropolis) | Lv.20 Wall | 10,500 | 4 | 16.2m Gold/Wood, 7m Stone | 11d | 442,735
22 | Lv.21 Wall Lv.21 Knight Camp/Elk Stable/Beast Pen | 11,000 | 5 | 24.3m Gold/Wood, 10.6m Stone | 17d 3h | 630,860
23 | Lv.22 Wall Lv.22 College of Order/School of Sages/Seers Council | 11,500 | 5 | 36.5m Gold/Wood, 15.9m Stone | 23d 23h | 907,085
24 | Lv.23 Wall Lv.23 Celestial Temple/Eagle Nest/Wyvern Rider Camp | 12,000 | 5 | 54.8m Gold/Wood, 24m Stone | 36d | 1,322,480
25 | Lv.24 Wall Lv.24 Alliance Market | 12,500 | 5 | 82.2m Gold/Wood, 36m Stone, Blueprint | 126d 8h | 2,195,458', 'https://cod.guide/important-city-hall-levels/', false, array[]::text[]),
    (v_guide, 3, 'Conclusión', 'Sube (rush) tu CH lo antes posible para potenciarte rápido y desbloquear más cosas que te ayudarán a crecer como jugador.', 'https://cod.guide/important-city-hall-levels/', false, array[]::text[]);
end
$IMPERIUM$;

do $IMPERIUM$
declare
  v_game uuid;
  v_guide uuid;
begin
  select id into v_game from public.games where slug = 'call-of-dragons';
  if v_game is null then
    raise exception 'IMPERIUM: juego no encontrado: %', 'call-of-dragons';
  end if;

  -- Reemplazo idempotente. OJO: borra los pasos -> reinicia step_progress de esta guía.
  delete from public.guide_steps where guide_id in (
    select id from public.guides where game_id = v_game and slug = 'membresia-honoraria');
  delete from public.guides where game_id = v_game and slug = 'membresia-honoraria';

  insert into public.guides
    (game_id, slug, title, description, order_index, is_published, intro_title, intro, intro_images)
  values
    (v_game, 'membresia-honoraria', 'Membresía Honoraria (VIP)', 'Todo sobre la Membresía Honoraria (VIP) de Call of Dragons: requisitos y buffs por nivel, por qué llegar al nivel 8 cuanto antes y qué comprar en la tienda Honoraria.', 10, false, null, null, array['https://cdn.cod.guide/wp-content/uploads/2023/02/Upgrading-Honorary-VIP-Membership-1-1024x576.png']::text[])
  returning id into v_guide;

  insert into public.guide_steps
    (guide_id, order_index, title, content, source_url, is_verified, images)
  values
    (v_guide, 1, 'Resumen de la Membresía de Honor de Call of Dragons', 'Hay 15 niveles totales de Membresía de Honor (Honor Membership) en Call of Dragons por el momento, pero seguramente conseguiremos más niveles pronto en el futuro.

En cada Membresía de Honor hay 1 Honor Chest (Cofre de Honor) exclusivo para comprar, que siempre vale el dinero y te daría acceso a algunos héroes exclusivos. Por ejemplo, los primeros niveles de Honor Chest te dan acceso a Liliya, que es súper poderosa con tan solo 5-1-1-1 (primera habilidad al máximo).

Los jugadores pueden conseguir muchos puntos de Honor gratis jugando, pero si quieres empujar hasta el nivel 8, querrás gastar Gemas para comprar el nivel.

Conseguir nivel de Honor sigue siendo la máxima prioridad al usar Gemas en Call of Dragons por el momento.', 'https://cod.guide/honorary-vip/', false, array[]::text[]),
    (v_guide, 2, 'Requisitos y buffs por nivel de Membresía Honoraria', 'Nivel VIP | Puntos requeridos | Buffs
0 | 0 | Producción de Oro 3% Producción de Madera 3%
1 | 200 | Producción de Oro 3% Producción de Madera 3% Velocidad de Recolección 5% Producción de Maná 3% Producción de Mineral 3%
2 | 400 | Producción de Oro 5% Producción de Madera 5% Velocidad de Recolección 5% Producción de Maná 5% Producción de Mineral 5%
3 | 1.200 | Producción de Oro 7% Producción de Madera 7% Velocidad de Recolección 5% Producción de Maná 7% Producción de Mineral 5% Velocidad de Construcción 5%
4 | 3.500 | Producción de Oro 9% Producción de Madera 9% Velocidad de Recolección 5% Producción de Maná 9% Producción de Mineral 9% Velocidad de Construcción 5% Velocidad de Investigación 5%
5 | 6.000 | Producción de Oro 12% Producción de Madera 12% Velocidad de Recolección 5% Producción de Maná 12% Producción de Mineral 12% Velocidad de Construcción 5% Velocidad de Investigación 5% Velocidad de Entrenamiento 5%
6 | 11.500 | Producción de Oro 15% Producción de Madera 15% Velocidad de Recolección 10% Producción de Maná 15% Producción de Mineral 15% Velocidad de Construcción 10% Velocidad de Investigación 5% Velocidad de Entrenamiento 5%
7 | 17.500 | Producción de Oro 18% Producción de Madera 18% Velocidad de Recolección 10% Producción de Maná 18% Producción de Mineral 18% Velocidad de Construcción 10% Velocidad de Investigación 5% Velocidad de Entrenamiento 10%
8 | 35.000 | Producción de Oro 21% Producción de Madera 21% Velocidad de Recolección 10% Producción de Maná 21% Producción de Mineral 21% Velocidad de Construcción 10% Velocidad de Investigación 10% Velocidad de Entrenamiento 10% 2ª Cola de Investigación
9 | 75.000 | Producción de Oro 25% Producción de Madera 25% Velocidad de Recolección 10% Producción de Maná 25% Producción de Mineral 25% Velocidad de Construcción 15% Velocidad de Investigación 10% Velocidad de Entrenamiento 10% 2ª Cola de Investigación Velocidad de Recuperación de CP +10%
10 | 150.000 | Producción de Oro 29% Producción de Madera 29% Velocidad de Recolección 10% Producción de Maná 29% Producción de Mineral 29% Velocidad de Construcción 15% Velocidad de Investigación 10% Velocidad de Entrenamiento 15% Velocidad de Recuperación de CP +10% 2ª Cola de Investigación
11 | 250.000 | Producción de Oro 33% Producción de Madera 33% Velocidad de Recolección 20% Producción de Maná 33% Producción de Mineral 33% Velocidad de Construcción 15% Velocidad de Investigación 10% Velocidad de Entrenamiento 15% 2ª Cola de Investigación Legion ATK 5%
12 | 350.000 | Producción de Oro 38% Producción de Madera 38% Velocidad de Recolección 20% Producción de Maná 38% Producción de Mineral 38% Velocidad de Construcción 15% Velocidad de Investigación 15% Velocidad de Entrenamiento 15% 2ª Cola de Investigación Legion DEF 5%
13 | 500.000 | Producción de Oro 42% Producción de Madera 42% Velocidad de Recolección 20% Producción de Maná 42% Producción de Mineral 42% Velocidad de Construcción 15% Velocidad de Investigación 15% Velocidad de Entrenamiento 15% 2ª Cola de Investigación Legion ATK 5% Legion HP 5%
14 | 750.000 | Producción de Oro 46% Producción de Madera 46% Velocidad de Recolección 25% Producción de Maná 46% Producción de Mineral 46% Velocidad de Construcción 15% Velocidad de Investigación 15% Velocidad de Entrenamiento 20% 2ª Cola de Investigación Legion ATK 5% Legion DEF 5% Legion HP 5% Legion March Speed 5% Velocidad de Curación 10%
15 | 1.000.000 | Producción de Oro 50% Producción de Madera 50% Velocidad de Recolección 30% Producción de Maná 50% Producción de Mineral 50% Velocidad de Construcción 20% Velocidad de Investigación 20% Velocidad de Entrenamiento 20% 2ª Cola de Investigación Legion ATK 5% Legion DEF 5% Legion HP 5% Legion March Speed 5% Velocidad de Curación 10%', 'https://cod.guide/honorary-vip/', false, array[]::text[]),
    (v_guide, 3, '¡Llega al nivel 8 de Membresía de Honor cuanto antes!', 'Alcanzar el nivel 8 de Honor debería ser la prioridad para cualquier jugador nuevo.

No es demasiado difícil de lograr, incluso si eres un jugador free-to-play.

Todo lo que necesitas son 75.300 gemas en total para llegar al nivel 8 de Honor, que puedes conseguir fácilmente completando distintas misiones, tareas y eventos mientras juegas.

Puede que te lleve unas pocas semanas llegar ahí, pero al final lo conseguirás.

Asegúrate de gastar todas tus gemas en llegar al nivel 8 de Honor, no en ninguna otra cosa, para desbloquear la cola secundaria de investigación de Tecnología. Además, serás recompensado con un Legendary Hero Token (Ficha de Héroe Legendario) gratis cada día, a tu elección. Los héroes legendarios son increíblemente poderosos, así que asegúrate de aprovechar esto.

También obtendrás dos epic hero tokens (fichas de héroe épico) en el nivel 7, que son geniales para jugadores nuevos, así como recursos adicionales.

Si necesitas más gemas para subir tu estatus VIP, no olvides recompensar todos los códigos promocionales de Call of Dragons disponibles.', 'https://cod.guide/honorary-vip/', false, array['https://cdn.cod.guide/wp-content/uploads/2023/02/Upgrading-Honorary-VIP-Membership-2-1024x576.png']::text[]),
    (v_guide, 4, 'Tienda de Membresía Honoraria (VIP)', 'Otro beneficio de mejorar tu nivel de Membresía Honoraria es que te permite comprar múltiples objetos exclusivos de la Tienda Honoraria con recursos normales como Oro, Madera, Mineral y Gemas.

Se recomienda comprar CP Recovery, aceleradores (Speedups), Epic Medals y Legendary Medals con Oro, Madera y Mineral.

Objeto | Nivel de Membresía | Cantidad | Precio
Basic CP Recovery | Nivel 2 | 20 | 12k Oro
5 Minute Speedup | Nivel 3 | 50 | 7k Oro
5 Minute Speedup | Nivel 3 | 20 | 6 Gemas
Epic Medal | Nivel 4 | 20 | 60k Oro
Gold Key | Nivel 4 | 20 | 600 Gemas
500k Gold | Nivel 4 | 10 | 180 Gemas
Legendary Medal | Nivel 5 | 5 | 400k Madera
500k Wood | Nivel 5 | 10 | 180 Gemas
60 Minute Speedup | Nivel 5 | 50 | 50 Gemas
Epic Essence | Nivel 6 | 20 | 28k Madera
Universal Artifact Key | Nivel 6 | 20 | 300 Gemas
Territorial Relocation | Nivel 6 | 10 | 300 Gemas
375k Ore | Nivel 6 | 10 | 180 Gemas
Legendary Essence | Nivel 7 | 5 | 300 Gemas
8 Hour Speedup | Nivel 7 | 20 | 240 Gemas
200k Mana | Nivel 7 | 10 | 180 Gemas
Epic Lucky Medal | Nivel 8 | 25 | 225 Gemas
1.5M Gold | Nivel 8 | 10 | 460 Gemas
Epic Hero Token | Nivel 9 | 50 | 180 Gemas
Epic Titan Essence | Nivel 9 | 30 | 280 Gemas
1.5M Wood | Nivel 9 | 10 | 460 Gemas
24 Hour Enhanced | Nivel 10 | 10 | 750 Gemas
1.125M Ore | Nivel 10 | 10 | 460 Gemas
Legendary Lucky Medal | Nivel 11 | 15 | 1.5k Gemas
600k Mana | Nivel 11 | 10 | 460 Gemas
24 Hour Enhanced Attack | Nivel 12 | 10 | 600 Gemas
5M Gold | Nivel 12 | 10 | 1.4k Gemas
Legendary Hero Token | Nivel 13 | 20 | 1.4k Gemas
5M Wood | Nivel 13 | 10 | 1.4k Gemas
Legendary Titan Essence | Nivel 14 | 20 | 1.2k Gemas
3.75M Ore | Nivel 14 | 10 | 1.4k Gemas
24 Hour Speedup | Nivel 15 | 20 | 600 Gemas
2M Mana | Nivel 15 | 10 | 1.4k Gemas', 'https://cod.guide/honorary-vip/', false, array[]::text[]);
end
$IMPERIUM$;

do $IMPERIUM$
declare
  v_game uuid;
  v_guide uuid;
begin
  select id into v_game from public.games where slug = 'call-of-dragons';
  if v_game is null then
    raise exception 'IMPERIUM: juego no encontrado: %', 'call-of-dragons';
  end if;

  -- Reemplazo idempotente. OJO: borra los pasos -> reinicia step_progress de esta guía.
  delete from public.guide_steps where guide_id in (
    select id from public.guides where game_id = v_game and slug = 'builds-arbol-de-talentos');
  delete from public.guides where game_id = v_game and slug = 'builds-arbol-de-talentos';

  insert into public.guides
    (game_id, slug, title, description, order_index, is_published, intro_title, intro, intro_images)
  values
    (v_game, 'builds-arbol-de-talentos', 'Builds de Árbol de Talentos', 'Recopilación de los mejores builds de árbol de talentos por héroe en Call of Dragons, con capturas de cada distribución para PvP, Behemoths, Peacekeeping y campo abierto.', 11, false, null, null, array['https://cdn.cod.guide/wp-content/uploads/2023/03/gwanwyn.png']::text[])
  returning id into v_guide;

  insert into public.guide_steps
    (guide_id, order_index, title, content, source_url, is_verified, images)
  values
    (v_guide, 1, 'Árboles de talentos de Gwanwyn', 'Créditos: Abused Panda

Una de los 3 héroes iniciales en Call of Dragons. Es una fantástica héroe de juego temprano que te ayuda a erradicar a los Darklings con extrema eficiencia. Es fácil de subir de nivel, genial luchando contra los Behemoths y genial en PVP si se construye correctamente.

- Artefacto recomendado: Shadow Blade

- Emparejamientos recomendados: Hosk, Madeline, Kregg, Atheus, Alistair.

Field Battle Build – Objetivo único y movilidad: el build de talentos se centra en el ataque básico, que tiende a convertir el duro caparazón del oponente en algo blando y tierno. Apoyarse fuertemente en el ataque básico también significa que tienes la movilidad para moverte en una mala situación sin preocuparte de perder la rage acumulada para usar una habilidad. Mejores emparejamientos: Hosk: el mejor par disponible por el momento, usando sus habilidades 1 y 3. Madeline: posible opción improvisada, ya que no hay muchos héroes que potencien el ataque base. Kregg: fácil de emparejar, ya que los eventos dan muchas de sus medallas en el juego temprano. Atheus: opción alternativa porque funcionan su habilidad 1, 2 y la mitad de la 3. Alistair: opción alternativa porque funcionan sus habilidades 1 y 2.

Peacekeeping – Objetivo único: el build de talentos se centra en el ataque básico, que tiende a convertir el duro caparazón del oponente en algo blando y tierno. Apoyarse fuertemente en el ataque básico también significa que tienes la movilidad para moverte en una mala situación sin preocuparte de perder la rage acumulada para usar una habilidad. Mejores emparejamientos: Nika: por si consigues muchas de ellas pronto. Buenas habilidades 1 y 2. Emrys: por si consigues muchos de ellos pronto. Buenas habilidades 1 y 2. Kregg: fácil de emparejar, ya que los eventos dan muchas de sus medallas en el juego temprano. Atheus: opción alternativa porque funcionan su habilidad 1, 2 y la mitad de la 3. Alistair: opción alternativa porque funcionan sus habilidades 1 y 2.

1 vs 1 – Objetivo único y daño nuke: el build de talentos se centra en la ganancia de estadísticas, ya que durante el juego temprano puede que carezcas de stats y es una forma fácil de ganar muchas. Este árbol también se centra en soltar nukes pesados, así que querrás emparejar con un adjunto (deputy) que destaque usando daño de habilidad. Mejores emparejamientos: Nika: por si consigues muchas de ellas pronto. Buenas habilidades 1 y 2. Emrys: por si consigues muchos de ellos pronto. Buenas habilidades 1 y 2. Kregg: fácil de emparejar, ya que los eventos dan muchas de sus medallas en el juego temprano. Atheus: opción alternativa porque funcionan su habilidad 1, 2 y la mitad de la 3. Alistair: opción alternativa porque funcionan sus habilidades 1 y 2.

Peacekeeping – Objetivo único: el build de talentos se centra en dañar a los Darklings para que tengas un ejército sólido cazándolos mientras el resto farmea experiencia sin problemas. Mejores emparejamientos: Nika: por si consigues muchas de ellas pronto. Buenas habilidades 1 y 2. Emrys: por si consigues muchos de ellos pronto. Buenas habilidades 1 y 2. Kregg: fácil de emparejar, ya que los eventos dan muchas de sus medallas en el juego temprano. Atheus: opción alternativa porque funcionan su habilidad 1, 2 y la mitad de la 3. Alistair: opción alternativa porque funcionan sus habilidades 1 y 2.', 'https://cod.guide/talent-tree-builds/', false, array['https://cdn.cod.guide/wp-content/uploads/2023/01/Gwanwyn-Call-of-Dragons-Talent-Tree-Build-for-Field-Battle-1024x726.jpg', 'https://cdn.cod.guide/wp-content/uploads/2023/01/gwanwyn-peacekeeping-talent-tree-build-1024x722.jpg', 'https://cdn.cod.guide/wp-content/uploads/2023/01/gwanwyn-pvp-nuke-talent-tree-1024x722.jpg', 'https://cdn.cod.guide/wp-content/uploads/2023/01/gwanwyn-peacekeeping-single-target-talent-build-1024x722.jpg', 'https://cdn.cod.guide/wp-content/uploads/2023/03/bakhar.png']::text[]),
    (v_guide, 2, 'Árboles de talentos de Bakhar', 'Créditos: Abused Panda

Es un héroe agresivo en Call of Dragons que lo hace fantástico cuando se usa con movilidad y rapidez. Muy bueno para propósitos de PVP o para rellenar un hueco extra de ejército.

- Artefacto recomendado: Giant''s Bone, Springs of Silence, Cloak of Stealth.

- Emparejamientos recomendados: Nika, Madeline, Atheus, Alistair.

Field Battle – Objetivo único y movilidad: el build de talentos se centra en sorprender a tu oponente moviéndote a la línea trasera y machacándolo. Por lo tanto, tienes una sola oportunidad de que salga bien o mal. Se apoya fuertemente en la velocidad de marcha y el daño de habilidad. Artefacto recomendado: Cloak of Stealth. Mejores emparejamientos: Nika: el árbol está construido pensando en ella como adjunta (deputy). Melanie: otro par genial con este build por el sustain y el contraataque que proporciona. Atheus: posible opción para probar el build. Alistair: posible opción para probar el build.

1 vs 1 – Objetivo único: el build de talentos se centra en lvsl para intercambiar méritos en un reino pacífico y se apoya fuertemente en el daño de habilidad. Artefactos recomendados: Giant''s Bone y Springs of Silence. Mejores emparejamientos: Nika: funciona de maravilla para un combate lvsl, pudiendo destruir caballería, arqueros y magos por igual. Atheus: no es el mejor, pero qué otras opciones tienes, jaja. Alistair: no es el mejor, pero qué otras opciones tienes, jaja.', 'https://cod.guide/talent-tree-builds/', false, array['https://cdn.cod.guide/wp-content/uploads/2023/01/bakhar-field-battle-single-target-build-1024x722.jpg', 'https://cdn.cod.guide/wp-content/uploads/2023/01/bakhar-talent-tree-build-1v1-1024x722.jpg', 'https://cdn.cod.guide/wp-content/uploads/2023/03/waldyr.png']::text[]),
    (v_guide, 3, 'Árboles de talentos de Waldyr', 'Árbol de talentos de Waldyr para Behemoths y DPS

Árbol de talentos de Waldyr para PvP 1 vs 1

Build general de PvP

Árbol de talentos Magic de Waldyr

Árbol de talentos Skill de Waldyr', 'https://cod.guide/talent-tree-builds/', false, array['https://cdn.cod.guide/wp-content/uploads/2023/02/waldyr-behemoths-and-dps-talent-tree-build-1024x722.jpg', 'https://cdn.cod.guide/wp-content/uploads/2023/02/waldyr-pvp-1vs1-talent-tree-1024x722.jpg', 'https://cdn.cod.guide/wp-content/uploads/2023/02/waldyr-pvp-talent-tree-1024x722.jpg', 'https://cdn.cod.guide/wp-content/uploads/2023/02/waldyr-magic-talent-tree-1024x722.jpg', 'https://cdn.cod.guide/wp-content/uploads/2023/02/waldyr-skill-talent-tree-1024x722.jpg', 'https://cdn.cod.guide/wp-content/uploads/2023/03/liliya.png']::text[]),
    (v_guide, 4, 'Árboles de talentos de Liliya', 'Árbol de talentos PvP de Liliya por Shinchi42

Árbol de talentos Peacekeeping de Liliya por Shinchi42

Liliya para Behemoths

Árbol de talentos Magic de Liliya

Árbol de talentos Skill de Liliya

Build Rage 1 vs 1

Build Peacekeeping de Liliya (no recomendado)', 'https://cod.guide/talent-tree-builds/', false, array['https://cdn.cod.guide/wp-content/uploads/2023/02/liliya-pvp-talent-tree-Call-of-Dragons-1024x552.jpg', 'https://cdn.cod.guide/wp-content/uploads/2023/02/liliya-peacekeeping-talent-tree-1-1024x552.jpg', 'https://cdn.cod.guide/wp-content/uploads/2023/02/liliya-behemoths-talent-tree-build-1024x722.jpg', 'https://cdn.cod.guide/wp-content/uploads/2023/02/liliya-magic-talent-tree-1024x722.jpg', 'https://cdn.cod.guide/wp-content/uploads/2023/02/liliya-skill-talent-tree-1024x722.jpg', 'https://cdn.cod.guide/wp-content/uploads/2023/02/liliya-rage-1v1-talent-tree-1024x722.jpg', 'https://cdn.cod.guide/wp-content/uploads/2023/02/liliya-peacekeeping-talent-tree-1024x722.jpg', 'https://cdn.cod.guide/wp-content/uploads/2023/03/kregg.png']::text[]),
    (v_guide, 5, 'Árboles de talentos de Kregg', 'Build Marksman de Kregg

Build de Kregg para Behemoths

Build de árbol de talentos de movilidad de Kregg

Build de velocidad de Kregg', 'https://cod.guide/talent-tree-builds/', false, array['https://cdn.cod.guide/wp-content/uploads/2023/02/marksman-kregg-pvp-talent-tree-build-1024x612.jpg', 'https://cdn.cod.guide/wp-content/uploads/2023/02/kregg-behenmoths-talent-tree-build-1024x602.jpg', 'https://cdn.cod.guide/wp-content/uploads/2023/02/kregg-mobility-talent-tree-build-1024x602.jpg', 'https://cdn.cod.guide/wp-content/uploads/2023/02/kregg-speed-build-guide-1024x602.jpg', 'https://cdn.cod.guide/wp-content/uploads/2023/03/alwyn.png']::text[]),
    (v_guide, 6, 'Árboles de talentos de Alwyn', 'Árbol de talentos Magic de Alwyn

Árbol de talentos Control de Alwyn', 'https://cod.guide/talent-tree-builds/', false, array['https://cdn.cod.guide/wp-content/uploads/2023/02/alwyn-magic-build-for-pvp-1024x619.jpg', 'https://cdn.cod.guide/wp-content/uploads/2023/02/alwyn-control-talent-tree-build-1024x619.jpg', 'https://cdn.cod.guide/wp-content/uploads/2023/03/eliana.png']::text[]),
    (v_guide, 7, 'Árboles de talentos de Eliana', 'Build general de Eliana

Build de árbol de talentos Support de Eliana

Talentos Peacekeeping de Eliana

Build Tank de Eliana', 'https://cod.guide/talent-tree-builds/', false, array['https://cdn.cod.guide/wp-content/uploads/2023/02/eliana-overall-build-talent-tree-1024x722.jpg', 'https://cdn.cod.guide/wp-content/uploads/2023/02/eliana-support-talent-tree-1-1-1024x722.jpg', 'https://cdn.cod.guide/wp-content/uploads/2023/02/eliana-peacekeeping-build-1-1024x722.jpg', 'https://cdn.cod.guide/wp-content/uploads/2023/02/eliana-tank-build-1024x722.jpg', 'https://cdn.cod.guide/wp-content/uploads/2023/03/atheus.png']::text[]),
    (v_guide, 8, 'Árboles de talentos de Atheus', 'Build de árbol de talentos de movilidad de Atheus

Build de árbol de talentos PvP de Atheus

Build de árbol de talentos Magic de Atheus', 'https://cod.guide/talent-tree-builds/', false, array['https://cdn.cod.guide/wp-content/uploads/2023/02/atheus-mobily-talent-tree-build-1024x619.jpg', 'https://cdn.cod.guide/wp-content/uploads/2023/02/atheus-pvp-talent-tree-build-1024x673.jpg', 'https://cdn.cod.guide/wp-content/uploads/2023/02/atheus-magic-talent-tree-1024x673.jpg']::text[]),
    (v_guide, 9, 'Árboles de talentos de Alistair', 'Árbol de talentos recomendado para Alistair (ver imágenes).', 'https://cod.guide/talent-tree-builds/', false, array['https://cdn.cod.guide/wp-content/uploads/2023/03/alistair-talent-tree-1024x564.jpg', 'https://cdn.cod.guide/wp-content/uploads/2023/03/theia.png']::text[]),
    (v_guide, 10, 'Árboles de talentos de Theia', 'Build de árbol de talentos PvP de Theia

Build general de árbol de talentos de Theia

Árbol de talentos Support de Theia', 'https://cod.guide/talent-tree-builds/', false, array['https://cdn.cod.guide/wp-content/uploads/2023/02/theia-pvp-build-1-1024x673.jpg', 'https://cdn.cod.guide/wp-content/uploads/2023/02/theia-overall-build-guide-1024x673.jpg', 'https://cdn.cod.guide/wp-content/uploads/2023/02/theia-supoprt-build-1024x673.jpg', 'https://cdn.cod.guide/wp-content/uploads/2023/03/emrys.png']::text[]),
    (v_guide, 11, 'Árboles de talentos de Emrys', 'Árbol de talentos de movilidad de Emrys

Árbol de talentos PvP de Emrys', 'https://cod.guide/talent-tree-builds/', false, array['https://cdn.cod.guide/wp-content/uploads/2023/02/emrys-mobility-speed-build-1024x722.jpg', 'https://cdn.cod.guide/wp-content/uploads/2023/02/emrys-pvp-talent-build-1024x896.jpg', 'https://cdn.cod.guide/wp-content/uploads/2023/03/nico.png']::text[]),
    (v_guide, 12, 'Árboles de talentos de Nico', 'Nico para Behemoths

Build de árbol de talentos Marksman de Nico

Build PvP de precisión de Nico

Build PvP de velocidad de Nico', 'https://cod.guide/talent-tree-builds/', false, array['https://cdn.cod.guide/wp-content/uploads/2023/02/nico-behemoths-talent-tree-build-1024x673.jpg', 'https://cdn.cod.guide/wp-content/uploads/2023/02/nico-marksman-talent-tree-1024x673.jpg', 'https://cdn.cod.guide/wp-content/uploads/2023/02/nico-precision-pvp-1024x673.jpg', 'https://cdn.cod.guide/wp-content/uploads/2023/02/nico-pvp-speed-build-1024x673.jpg', 'https://cdn.cod.guide/wp-content/uploads/2023/03/nika.png']::text[]),
    (v_guide, 13, 'Árboles de talentos de Nika', 'Build Infantry de Nika

Árbol de talentos Peacekeeping de Nika

Build Skill de Nika

Build Skill Rage de Nika', 'https://cod.guide/talent-tree-builds/', false, array['https://cdn.cod.guide/wp-content/uploads/2023/02/nika-infantry-build-Call-of-Dragons-1024x673.jpg', 'https://cdn.cod.guide/wp-content/uploads/2023/02/nika-peacekeeing-talent-guide-1024x659.jpg', 'https://cdn.cod.guide/wp-content/uploads/2023/02/nika-skill-build-talent-1024x673.jpg', 'https://cdn.cod.guide/wp-content/uploads/2023/02/nika-skill-rage-build-1024x673.jpg', 'https://cdn.cod.guide/wp-content/uploads/2023/03/bakshi.png']::text[]),
    (v_guide, 14, 'Árboles de talentos de Bakshi', 'Árbol de talentos Open-Field de Bakshi

Árbol de talentos Peacekeeping de Bakshi

Árbol Rage Skill de Bakshi

Build PvP 1-v-1 de Bakshi', 'https://cod.guide/talent-tree-builds/', false, array['https://cdn.cod.guide/wp-content/uploads/2023/03/bakshi-open-field-talent-tree-1024x576.jpg', 'https://cdn.cod.guide/wp-content/uploads/2023/03/bakshi-peackeeping-talent-tree-1024x576.jpg', 'https://cdn.cod.guide/wp-content/uploads/2023/03/bakshi-rage-skill-tree-cod-1024x576.jpg', 'https://cdn.cod.guide/wp-content/uploads/2023/02/bakshi-pvp-1vs1-talent-build-1024x659.jpg', 'https://cdn.cod.guide/wp-content/uploads/2023/03/velyn-1.png']::text[]),
    (v_guide, 15, 'Árboles de talentos de Velyn', 'Velyn Magic Control

Árbol de talentos Magic 2 de Velyn

Árbol de talentos Control de Velyn

Árbol de talentos PvP de Velyn

Árbol de talentos All-Rounder de Velyn', 'https://cod.guide/talent-tree-builds/', false, array['https://cdn.cod.guide/wp-content/uploads/2023/02/velyn-magic-control-talent-tree-1024x630.jpg', 'https://cdn.cod.guide/wp-content/uploads/2023/02/velyn-magic-2-talent-tree-1024x647.jpg', 'https://cdn.cod.guide/wp-content/uploads/2023/02/velyn-control-talent-tree-1024x647.jpg', 'https://cdn.cod.guide/wp-content/uploads/2023/02/velyn-pvp-talent-tree-1024x647.jpg', 'https://cdn.cod.guide/wp-content/uploads/2023/02/velyn-all-rounder-1024x647.jpg', 'https://cdn.cod.guide/wp-content/uploads/2023/03/kinnara-1.png']::text[]),
    (v_guide, 16, 'Árboles de talentos de Kinnara', 'Kinnara Marksman

Kinnara Control

Kinnara Behemoths

Kinnara PvP

Kinnara All-Rounder', 'https://cod.guide/talent-tree-builds/', false, array['https://cdn.cod.guide/wp-content/uploads/2023/03/kinnara-marksman-talent-tree-1024x647.jpg', 'https://cdn.cod.guide/wp-content/uploads/2023/03/kinnara-control-talent-tree-1024x647.jpg', 'https://cdn.cod.guide/wp-content/uploads/2023/03/kinnara-behemoth-talent-tree-1024x647.jpg', 'https://cdn.cod.guide/wp-content/uploads/2023/03/kinnara-pvp-talent-tree-1024x647.jpg', 'https://cdn.cod.guide/wp-content/uploads/2023/03/kinnara-all-rounder-talent-tree-1024x647.jpg', 'https://cdn.cod.guide/wp-content/uploads/2023/03/madeline.png']::text[]),
    (v_guide, 17, 'Árboles de talentos de Madeline', 'Árbol Infantry de Madeline

Árbol de talentos PvP de Madeline

Árbol de talentos Tank de Madeline', 'https://cod.guide/talent-tree-builds/', false, array['https://cdn.cod.guide/wp-content/uploads/2023/03/medaline-infantry-talent-tree-3-1024x889.jpg', 'https://cdn.cod.guide/wp-content/uploads/2023/03/medaline-pvp-talent-tree-1024x889.jpg', 'https://cdn.cod.guide/wp-content/uploads/2023/03/madeline-tank-talent-tree-1024x889.jpg']::text[]),
    (v_guide, 18, 'Árbol de talentos de Farmeo', 'Árbol de talentos recomendado para recolección/farmeo (ver imágenes).', 'https://cod.guide/talent-tree-builds/', false, array['https://cdn.cod.guide/wp-content/uploads/2023/03/gathering-talent-tree-call-of-dragon-1024x795.jpg']::text[]);
end
$IMPERIUM$;

do $IMPERIUM$
declare
  v_game uuid;
  v_guide uuid;
begin
  select id into v_game from public.games where slug = 'call-of-dragons';
  if v_game is null then
    raise exception 'IMPERIUM: juego no encontrado: %', 'call-of-dragons';
  end if;

  -- Reemplazo idempotente. OJO: borra los pasos -> reinicia step_progress de esta guía.
  delete from public.guide_steps where guide_id in (
    select id from public.guides where game_id = v_game and slug = 'cod-vs-rise-of-kingdoms');
  delete from public.guides where game_id = v_game and slug = 'cod-vs-rise-of-kingdoms';

  insert into public.guides
    (game_id, slug, title, description, order_index, is_published, intro_title, intro, intro_images)
  values
    (v_game, 'cod-vs-rise-of-kingdoms', 'Call of Dragons vs. Rise of Kingdoms', 'Comparativa detallada entre Call of Dragons y Rise of Kingdoms: similitudes, sistema F2P/P2W, alianzas, behemoths, hospitales, héroes, eventos y monetización, con las diferencias clave de cada juego.', 12, false, null, null, array['https://cdn.cod.guide/wp-content/uploads/2023/03/Call-of-Dragons-Vs-Rise-of-Kingdoms-1024x576.png']::text[])
  returning id into v_guide;

  insert into public.guide_steps
    (guide_id, order_index, title, content, source_url, is_verified, images)
  values
    (v_guide, 1, 'Las similitudes', 'Las estructuras y los sistemas de investigación en ambos juegos son casi idénticos.

La única diferencia es un nuevo edificio de entrenamiento de tropas, exclusivo para unidades avanzadas como Celestials, Eagles y Wyverns.

Todo lo demás simplemente está renombrado.

En cuanto al entrenamiento de tropas, el sistema apenas ha cambiado, salvo por las unidades de asedio, que tienen su propio edificio y cola.

En Call of Dragons, la caballería de nivel 1 no es realmente caballería, sino unidades de transporte que se usan para recolectar.

Me gusta mucho este cambio, sobre todo en el juego avanzado, cuando ya no necesitas unidades de recolección.

Entrenar unidades de asedio en Rise of Kingdoms siempre fue una gran pérdida de tiempo y recursos.

Recolección en Call of Dragons

El sistema de investigación también es solo un cambio de aspecto, con algunas tecnologías añadidas. Eso sí, han incluido dos colas de investigación, lo que me parece una gran idea: significa que puedes trabajar en esos largos proyectos de investigación que duran 20, 30 o más de 50 días, mientras sigues trabajando en otras tecnologías al mismo tiempo.

Recolectar recursos en Call of Dragons es similar a lo que harías en Rise of Kingdoms, solo que esta vez los recursos son oro, madera, mineral y maná en lugar de comida, madera, piedra y oro.

Los Darklings son simplemente una versión con nuevo aspecto de los bárbaros. En Call of Dragons encontrarás tres tipos de Darklings: patrols, creatures y guards. Los patrols son buenos para subir de nivel a los héroes, los creatures para subir de nivel los artefactos, y los guards equivalen a los Barbarian Camps.', 'https://cod.guide/call-of-dragons-vs-rise-of-kingdoms/', false, array['https://cdn.cod.guide/wp-content/uploads/2023/02/farming-gold-mine-in-Call-of-Dragons-1024x576.png']::text[]),
    (v_guide, 2, 'F2P y P2W', 'Cuando empecé mi andadura en Rise of Kingdoms, me pareció una experiencia bastante frustrante que dependía en gran medida de los jugadores más fuertes.

Si desbloqueas las unidades de nivel 5 incluso antes del primer evento Kingdom vs. Kingdom, te pondrá una enorme presión para estar disponible 24/7, lo que a menudo se traduce en días de arduos rallies y guarniciones.

Sin embargo, a pesar de todos tus esfuerzos, cada vez que te alejabas del juego nuestros enemigos nos superaban con facilidad.

Call of Dragons es diferente; se centra más en el campo abierto. Para lograr la victoria, debes tomar y dominar el campo, desplazando el énfasis de los jugadores individuales a los equipos enteros.

Esto significa que la contribución de cada uno se valora más, lo que hace que el juego sea más gratificante para todo el equipo.

En Call of Dragons, defender una bandera es un poco diferente que en Rise of Kingdoms. Para proteger una bandera, debes hacer retroceder a los enemigos más allá de una torre y mantener la línea allí. Para defenderla por completo, tendrás que enviar tanto ingenieros como tropas de infantería regular para derribar cada torre.

Esto es similar a la forma en que se derriban los holy sites en el evento KvK3 Light and Darkness. Es una gran manera de involucrar a más jugadores en el juego, y quita la presión de los pocos jugadores que podrían haberlo estado haciendo todo por su cuenta en otros títulos.', 'https://cod.guide/call-of-dragons-vs-rise-of-kingdoms/', false, array['https://cdn.cod.guide/wp-content/uploads/2023/03/Call-of-Dragons-Alliance-Activities-1024x557.jpg']::text[]),
    (v_guide, 3, 'La importancia de la alianza', '¿Buscas saltar de una alianza a otra durante una guerra? En Rise of Kingdoms, puedes cambiar de bando de forma rápida y sencilla, lo que te permite mover tu ciudad con la misma rapidez.

Sin embargo, en Call of Dragons las cosas son un poco diferentes. Si decides dejar tu antigua alianza y unirte a una nueva, no podrás teletransportarte a un nuevo territorio durante un periodo de tiempo determinado.

Digamos, por ejemplo, que tienes el Hall de nivel 21; el tiempo de espera que debes soportar antes de poder reubicarte es de 8 horas. Cuanto más alto sea el nivel de tu Hall, más tiempo tendrás que esperar.

Esto se hace para garantizar que el juego siga siendo equilibrado y justo, además de evitar que jugadores de nivel alto se teletransporten y interrumpan las batallas. Aunque es un tiempo de espera largo, cumple su propósito.', 'https://cod.guide/call-of-dragons-vs-rise-of-kingdoms/', false, array['https://cdn.cod.guide/wp-content/uploads/2023/03/flame-dragon-behemoth-1024x719.png']::text[]),
    (v_guide, 4, 'Behemoths', 'Los Behemoths aportan un nuevo giro a los enfrentamientos en campo abierto. En Rise of Kingdoms, tu objetivo es conquistar los holy sites, que te dan una bonificación. En Call of Dragons, los Behemoths han ocupado su lugar.

Cuando consigues derrotarlos, pueden ser invocados en batalla y mejorados con mejores habilidades y más fuerza, lo que los hace más difíciles de vencer.

Esta dinámica añadida es algo que realmente aprecio en Call of Dragons.

Además, puedes configurar varias combinaciones de guarnición en tu muralla. Cuanto más alto sea el nivel de tu muralla, más opciones tendrás, hasta cinco combinaciones de héroes diferentes.

Si tu combinación de guarnición principal está desplegada en el campo, entonces la primera reserva defenderá la muralla. Y si usas la segunda combinación de héroes en el campo, la tercera la seguirá, y así sucesivamente.

Esta es una gran mejora respecto a la única combinación disponible en Rise of Kingdoms.', 'https://cod.guide/call-of-dragons-vs-rise-of-kingdoms/', false, array[]::text[]),
    (v_guide, 5, 'Hospitales y mecánica de curación', 'En Call of Dragons los hospitales no tienen límites: puedes enviar tantas tropas como quieras.

Por otro lado, en Rise of Kingdoms, una vez que tu hospital se llena, cualquier tropa gravemente herida a partir de ese momento se pierde.

En Call of Dragons, las tropas heridas pueden seguir yendo al hospital, así que reciben los cuidados que necesitan. Si atacan tu ciudad mientras estás desconectado, solo perderás un máximo del 10% de tus tropas, sin importar cuántas veces te asalten.

Por eso, es increíblemente difícil que te eliminen por completo en Call of Dragons.

La ciudad del defensor no perderá más tropas hasta que inicie sesión y reúna sus tropas sanas de nuevo, aumentando su número en un 10%. Además, todos los recursos siguen disponibles, salvo los que guarda en su almacén.

Desafortunadamente, la desventaja de atacar una ciudad es que el 50% de las tropas que envías en un rally o a la legión pueden morir.

En definitiva, atacar una ciudad puede no merecer el riesgo.

Curar no siempre tiene que ser una lucha; tienes dos opciones. Puedes usar la curación diaria gratuita o la curación con recursos; esto se decide según el nivel de tus hospitales, las políticas que hayas implementado y el número total de tropas que tengas.

Además, puedes comprar fichas de suministros médicos en la Merits Store y curar al instante un cierto número de unidades. Los Merits se consiguen mediante combate jugador contra jugador.

Con 350.000 soldados bajo mi mando y una tasa de curación diaria del hospital de alrededor de 330.000, mi tamaño máximo de ejército está actualmente en 60.000 tropas.

Sin embargo, comparado con los millones de tropas permitidas en Rise of Kingdoms, esto supone mucho menos problema del que esperaba.

Entiendo por qué los desarrolladores optaron por este enfoque. Iguala el terreno de juego entre los grandes gastadores, los pequeños gastadores y los jugadores F2P, ya que las grandes ballenas ya no pueden enzarzarse en batallas sin parar, y todo el mundo acaba teniendo que enfrentarse a las mismas restricciones de aceleradores, recursos u hospital.', 'https://cod.guide/call-of-dragons-vs-rise-of-kingdoms/', false, array['https://cdn.cod.guide/wp-content/uploads/2023/02/Call-of-Dragons-healing-1024x368.png', 'https://cdn.cod.guide/wp-content/uploads/2023/02/member-point.png', 'https://cdn.cod.guide/wp-content/uploads/2023/02/pan-gathering-skill-in-Call-of-Dragons-1024x576.png']::text[]),
    (v_guide, 6, 'Héroes', 'Cada temporada de Call of Dragons comienza con un reinicio de los niveles de tus héroes.

Aunque sus clasificaciones de estrellas y niveles de habilidad permanecen iguales, su nivel y árboles de talentos se revierten al principio.

Esto obliga a los jugadores a esforzarse de verdad y hacer a sus héroes lo más fuertes posible. El esfuerzo que inviertes se recompensa, ya que tus héroes tienen un límite de stamina para cuántas veces pueden atacar antes de necesitar regenerarse.

Todas estas características se combinan para incentivar a los jugadores dedicados y crear una experiencia agradable.

Cuando luchas contra otros jugadores en campo abierto en Rise of Kingdoms, tu héroe perderá 10 💧 de stamina en el primer ataque. Después de eso, puedes pelear contra tantas legiones como quieras sin más pérdida de stamina. Sin embargo, cada vez que inicias o te unes a un rally, se eliminarán 10 puntos de stamina adicionales, y si estás destruyendo edificios enemigos, tu stamina se reducirá continuamente.

Las guerras largas pueden ser especialmente agotadoras, ya que puedes experimentar fatiga de stamina si te unes a numerosos rallies. Una buena manera de gestionar esto es unirte a los rallies con héroes que no sueles usar, para no consumir stamina en tus principales.

Los grandes gastadores, sin embargo, tienen la ventaja de tener la mayoría de sus héroes de primer nivel disponibles ya maximizados, lo que significa que, incluso si experimentaran pérdida de stamina, seguirían teniendo una enorme ventaja inicial.

El sistema de Call of Dragons evita que los jugadores lancen asaltos interminables contra quien quieran.

Para tener éxito y no malgastar la preciada stamina luchando contra jugadores de bajo nivel, tienen que idear una estrategia y apuntar a enemigos más formidables.', 'https://cod.guide/call-of-dragons-vs-rise-of-kingdoms/', false, array['https://cdn.cod.guide/wp-content/uploads/2023/03/combats-in-Call-of-Dragons.jpg']::text[]),
    (v_guide, 7, 'Combate', 'En Call of Dragons, las batallas en el exterior pueden ser aún más emocionantes.

Las tropas mágicas y las unidades de arqueros pueden disparar a larga distancia, mientras que las unidades voladoras pueden sobrevolar las colinas y los ríos.

El terreno tiene muchos niveles, lo que te permite luchar desde puntos más altos y golpear a las tropas que marchan para alcanzarte. También puedes construir barricadas para entorpecer el avance del enemigo, lo que da al juego un nuevo nivel de estrategia y lo hace mucho más disfrutable.

Por otro lado, muchas batallas en Rise of Kingdoms eran simplemente un caos y luego una ronda constante de tropas marchando a la batalla otra vez, sin más reflexión táctica.

Desafortunadamente, el juego no permite guarnecer ni hacer rally en pasos o ciudades como puedes hacer en Rise of Kingdoms.

Para recrear esta mecánica en Call of Dragons, sugiero que se creen torres limitadas que puedan convertirse en torres de guarnición y colocarse en ubicaciones estratégicas. Con esta adición, el juego se volverá más disfrutable y atractivo para todos los jugadores.

Una de las cosas que me encanta de las batallas en campo abierto de Call of Dragons es que los constructores alrededor de sus torres nunca están a salvo de un ataque.

En Rise of Kingdoms, para evitar que se construya una torre, tienes que reunir fuerzas para atacar la guarnición conectada a ella. Aunque en Call of Dragons todavía necesitas enviar fuerzas para destruir la torre, puedes ralentizar considerablemente su tiempo de construcción eliminando a todos los ejércitos que la construyen, lo que puede llevar hasta un día entero.

Incluso sin ningún ingeniero en la zona, las torres siguen construyéndose a un ritmo de un punto de durabilidad por segundo.', 'https://cod.guide/call-of-dragons-vs-rise-of-kingdoms/', false, array[]::text[]),
    (v_guide, 8, 'La gran lección: eventos controlados', 'En Rise of Kingdoms hay una función llamada "Mightiest Governor". Es una competición en la que los jugadores pueden ganar héroes. Pero aquí está el truco: muchos reinos han encontrado la manera de controlar este evento, reduciendo así la cantidad de dinero que gastan los jugadores.

Call of Dragons tomó nota e introdujo un evento similar llamado "Strongest Lord", pero con un giro. No puedes controlarlo, lo que lo convierte en una competición libre que fomenta el gasto. Esto es un cambio de juego, amigos.

Añade una capa de imprevisibilidad y emoción que antes no existía.

¿Por qué importan los eventos controlados?

Los eventos controlados en Rise of Kingdoms eran un arma de doble filo. Por un lado, permitían a los jugadores idear estrategias y colaborar. Por otro lado, limitaban el potencial de ingresos del juego. Al hacer que los eventos sean incontrolables en Call of Dragons, los desarrolladores han abierto una nueva vía de ingresos. Es un win-win para todos los implicados.', 'https://cod.guide/call-of-dragons-vs-rise-of-kingdoms/', false, array[]::text[]),
    (v_guide, 9, 'Flexibilidad en migración y eventos', 'En Rise of Kingdoms estás atado a un "reino de origen" (home kingdom), gobernado por consejos de jugadores. Esto puede ser limitante, especialmente si buscas nuevos desafíos.

Call of Dragons ofrece más flexibilidad. No hay reino de origen, y eres libre de migrar entre servidores.

Esto significa que siempre estás compitiendo con jugadores nuevos, lo que hace imposible controlar los eventos y fomenta más el gasto.

La capacidad de migrar libremente entre servidores en Call of Dragons es un cambio de juego. Mantiene la jugabilidad fresca y emocionante, asegurando que los jugadores estén siempre alerta.

Este dinamismo no solo es divertido; también es una forma inteligente de fomentar las compras dentro del juego.

Al fin y al cabo, los nuevos desafíos a menudo requieren nuevos recursos, ¿y qué mejor manera de conseguir esos recursos que comprándolos?', 'https://cod.guide/call-of-dragons-vs-rise-of-kingdoms/', false, array[]::text[]),
    (v_guide, 10, 'Los bundles', 'Call of Dragons ha introducido bundles innovadores como "Hero of Tamaris", que permiten a los jugadores maximizar a sus héroes más rápido que nunca. Esto es un win-win tanto para los grandes como para los pequeños gastadores, ya que ofrece una forma más rápida de subir de nivel a la vez que fomenta el gasto.

Profundicemos un poco en la economía de estos bundles. En Rise of Kingdoms, los bundles eran buenos pero no geniales. Call of Dragons lo ha llevado al siguiente nivel ofreciendo bundles que proporcionan beneficios inmediatos y tangibles. Esto hace que los jugadores sean más propensos a gastar, aumentando así la rentabilidad del juego.', 'https://cod.guide/call-of-dragons-vs-rise-of-kingdoms/', false, array[]::text[]),
    (v_guide, 11, 'Limitaciones de recursos', 'Call of Dragons ha implementado un límite semanal de recursos, obligando a los jugadores a esforzarse en el juego o a gastar dinero en bundles.

Esta es una jugada inteligente para fomentar más compras dentro del juego. Añade una capa de estrategia a la gestión de recursos, haciendo el juego más atractivo.

Al limitar la cantidad de recursos que los jugadores pueden acumular, Call of Dragons fomenta una jugabilidad estratégica. Los jugadores tienen que pensar cuidadosamente cómo asignar sus recursos, lo que añade profundidad al juego. Esta capa estratégica no solo hace el juego más interesante, sino que también anima a los jugadores a gastar dinero para conseguir ventaja.', 'https://cod.guide/call-of-dragons-vs-rise-of-kingdoms/', false, array[]::text[]),
    (v_guide, 12, 'Curación y puntos de acción', 'A diferencia de Rise of Kingdoms, donde usas aceleradores para curar, Call of Dragons usa elixires. Esto hace el juego más atractivo para un público más amplio.

Sin embargo, el juego limita cómo puedes ganar puntos de acción, empujándote principalmente hacia las compras dentro del juego.

El uso de elixires para curar es una jugada maestra. Simplifica el proceso de curación, haciéndolo más accesible para los jugadores casuales.

Al mismo tiempo, crea una nueva fuente de ingresos para el juego, ya que los jugadores son más propensos a comprar elixires.', 'https://cod.guide/call-of-dragons-vs-rise-of-kingdoms/', false, array['https://cdn.cod.guide/wp-content/uploads/2023/07/elixir.png']::text[]),
    (v_guide, 13, 'Desarrollos futuros', 'Call of Dragons planea introducir las "War Pets", que probablemente ofrecerán más oportunidades de compras dentro del juego. Esto demuestra que el juego está en continua evolución, aprendiendo de su predecesor para maximizar la rentabilidad.

La introducción de las War Pets es solo la punta del iceberg. Los desarrolladores están innovando constantemente, y podemos esperar más características emocionantes en el futuro. Estos nuevos elementos no solo harán el juego más disfrutable, sino que también ofrecerán nuevas vías de generación de ingresos.', 'https://cod.guide/call-of-dragons-vs-rise-of-kingdoms/', false, array[]::text[]),
    (v_guide, 14, 'Conclusión', 'Call of Dragons está aprendiendo inteligentemente de Rise of Kingdoms para crear un modelo más rentable. Desde eventos no controlados hasta bundles más inteligentes y limitaciones de recursos, el juego está diseñado para fomentar el gasto sin dejar de ofrecer una gran experiencia. Tanto si eres un veterano de Rise of Kingdoms como un novato de Call of Dragons, el futuro pinta prometedor para jugadores y desarrolladores.

Recuerda que, aunque ambos juegos son del mismo desarrollador, también compiten entre sí.

¿Está Rise of Kingdoms condenado al fracaso? No necesariamente: ambos juegos tienen sus propios pros y contras únicos. Rise of Kingdoms es un gran juego histórico, y cuando empecé a jugar estuve investigando a diferentes comandantes y sus famosas historias. Esta familiaridad hizo que me sintiera cómodo con el juego rápidamente. También me encanta todo el rallying y el guarnecer que puedes hacer para mantener tus posiciones.

¡En definitiva, Rise of Kingdoms es muy divertido!

Call of Dragons es un mundo único ambientado en una tierra de fantasía con humanos, elfos y orcos.

Los jugadores pueden enzarzarse en acaloradas batallas de táctica, con diferentes niveles de terreno y obstáculos estratégicos. El juego está diseñado para hacer todo lo posible por ser una experiencia justa y equilibrada, con generosas ofertas amigables para los F2P. Los jugadores pueden esperar más grandes características en el futuro, y muchos esperan felizmente el lanzamiento global.

Personalmente, he conseguido lo que quería con Rise of Kingdoms y estoy deseando jugar a Call of Dragons. Parece que Legou Games han desarrollado este juego para competir con otros títulos como Infinity Kingdom más que con Rise of Kingdoms. Se avecinan tiempos emocionantes.', 'https://cod.guide/call-of-dragons-vs-rise-of-kingdoms/', false, array[]::text[]);
end
$IMPERIUM$;

