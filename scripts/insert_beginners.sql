do $beg$ declare guide_id uuid; begin

  insert into guides (game_id, slug, title, description, intro_title, intro, intro_images, order_index, is_published)
  values (
    '7137eaf9-fbc4-4ade-b36f-cf73221d10cd',
    'guia-principiantes',
    'Guía para Principiantes',
    'Todo lo que necesitas saber para empezar con buen pie en Call of Dragons: servidor, civilización, alianza, edificios, investigación y más.',
    'Guía para Principiantes de Call of Dragons',
    'Bienvenido a nuestra guía completa para principiantes de Call of Dragons. Si eres nuevo en el juego y no sabes por dónde empezar, aquí encontrarás todo lo que necesitas. Recuerda enfocarte primero en lo más importante y luego explorar el resto de funciones a tu propio ritmo.',
    array['https://cdn.cod.guide/wp-content/uploads/2023/01/Call-of-Dragons-Beginner-Guide-1024x576.png'],
    3,
    true
  )
  returning id into guide_id;


  insert into guide_steps (guide_id, order_index, title, content, images, source_url, is_verified)
  values (
    guide_id,
    1,
    '¿Qué Servidor Elegir?',
    'Una de las cosas más importantes es elegir un servidor de Call of Dragons que sea nuevo. Así tendrás mejores posibilidades de crecer y unirte a las mejores alianzas.

¿Cómo saber qué tan antiguo es tu servidor? Sigue estos pasos:

Toca el ícono de tu avatar en la esquina superior izquierda. Toca Configuración en la esquina inferior derecha. Toca "Gestión de personajes" y luego "Crear nuevo personaje". Mira la esquina inferior derecha de cada servidor: verás hace cuántos días fue creado.

Por ejemplo, el servidor #30 – Shaman Canyon tiene 1 día y 16 horas de antigüedad.

Si tu servidor actual tiene más de un día, considera cambiarte a uno más nuevo cuando abra. De lo contrario, estarás por detrás de jugadores que llevan más tiempo y tendrán más poder, recursos y aliados.

No te preocupes si decides quedarte en tu servidor actual: puedes practicar, explorar el mapa y hacer amigos. Cuando abra uno nuevo, empezarás de cero con todo lo aprendido.

Por eso elegir un servidor nuevo es uno de los mejores consejos para principiantes en Call of Dragons.',
    array['https://cdn.cod.guide/wp-content/uploads/2023/03/Call-of-Dragons-servers-1024x679.png'],
    'https://cod.guide/beginners/',
    false
  );

  insert into guide_steps (guide_id, order_index, title, content, images, source_url, is_verified)
  values (
    guide_id,
    2,
    '¿Qué Civilización Elegir?',
    'Al crear tu cuenta, podrás elegir entre tres civilizaciones, cada una con comandantes iniciales únicos con fortalezas y debilidades propias, que definirán tu estilo de juego a largo plazo.

Por ejemplo, la Liga del Orden (Humanos) destaca en combate PvP gracias a los dos Magos gratuitos que ofrecen desde el principio.

Nuestra recomendación para principiantes es comenzar con los Elfos:

Gwanwyn es la mejor heroína inicial para farmear Darklings. Subir héroes de nivel en Call of Dragons es difícil, y ella lo facilita enormemente. Úsala para subir a tus héroes recolectores y después a los de PvP.
La Curación Gratuita es muy útil cuando necesitas atacar constantemente.
El bono de Velocidad de Marcha de Legión siempre es bienvenido, especialmente si juegas todo el día en PC.

Una vez que consigas el Ticket Gratuito de Cambio de Facción, cámbiate a la Liga del Orden (Humanos) para tener mayor velocidad de recolección, ya que al inicio no tienes suficientes tropas para aprovechar sus bonificaciones.',
    array['https://cdn.cod.guide/wp-content/uploads/2023/01/choosing-civilization-in-Call-of-Dragons-1024x576.png', 'https://cdn.cod.guide/wp-content/uploads/2023/02/gwanwyn.png'],
    'https://cod.guide/beginners/',
    false
  );

  insert into guide_steps (guide_id, order_index, title, content, images, source_url, is_verified)
  values (
    guide_id,
    3,
    'Jugar en PC',
    'Uno de los mayores problemas de jugar en móvil es el lag y el consumo de batería. Por eso muchos jugadores prefieren jugar Call of Dragons en PC:

Puedes jugar todo el día sin preocuparte por el calentamiento del teléfono o la batería.
Puedes dejar tus legiones recolectando y revisarlas más tarde.
Puedes manejar múltiples cuentas al mismo tiempo.
Participas en combates sin sufrir lag.',
    array['https://cdn.cod.guide/wp-content/uploads/2023/03/download-call-of-dragons-pc.png'],
    'https://cod.guide/beginners/',
    false
  );

  insert into guide_steps (guide_id, order_index, title, content, images, source_url, is_verified)
  values (
    guide_id,
    4,
    '¡Únete a una Alianza lo Antes Posible!',
    'Otro consejo clave es unirte a una alianza en cuanto termines el tutorial. No tienes que quedarte ahí para siempre, pero hacerlo te dará ayudas rápidas de otros jugadores y acelerará tu progreso.

Para unirte a una alianza:

Toca el ícono de menú en la esquina inferior derecha.
Toca el ícono de escudo para abrir la pantalla de alianzas.
Toca "Unirse a una alianza" y busca una con muchos miembros y que permita unirse a cualquiera.

Estar en una alianza también te da acceso a tecnología de alianza, Behemoths, regalos, chat, ataque a Fortalezas Darkling y muchas otras actividades.',
    array[]::text[],
    'https://cod.guide/beginners/',
    false
  );

  insert into guide_steps (guide_id, order_index, title, content, images, source_url, is_verified)
  values (
    guide_id,
    5,
    'Tecnología de Alianza',
    'Unirte a una buena alianza es tu mejor arma para el crecimiento de tu cuenta. Encontrarás jugadores activos dispuestos a hacer Fortalezas Darkling y otras actividades contigo, además de obtener bonificaciones para construcción, investigación, recolección y combate.

El Pacto Divino (Divine Covenant) es muy importante en la Tecnología de Alianza.

Recibirás muchas Ayudas Instantáneas de los miembros activos, reduciendo los tiempos de construcción e investigación considerablemente. También hay cofres gratuitos a diario cuando los miembros derrotan Fortalezas o compran paquetes en el juego.

Las bestias otorgan muchos buffs y conseguirás muchas Gemas al ocuparlas por primera vez, lo cual es fundamental para los jugadores F2P para subir el Nivel de Honor.',
    array['https://cdn.cod.guide/wp-content/uploads/2023/01/alliance-tech-Call-of-Dragons.png'],
    'https://cod.guide/beginners/',
    false
  );

  insert into guide_steps (guide_id, order_index, title, content, images, source_url, is_verified)
  values (
    guide_id,
    6,
    '¡Desbloquea al Segundo Constructor!',
    'En Call of Dragons puedes construir dos estructuras simultáneamente si tienes dos colas de construcción.

Al inicio recibes una cola gratuita y otra por dos días. Después puedes mantener la segunda pagando Gemas o dinero real.

Opciones:
- 150 Gemas por dos días más.
- 5.000 Gemas para tenerla permanentemente.
- Bundle de $4.99 USD que incluye la segunda cola y otros objetos.

Si no quieres gastar dinero, puedes conseguir Gemas recolectando recursos, eliminando Darklings o completando misiones. Ahorrando Gemas puedes obtener la segunda cola de construcción sin gastar nada.',
    array['https://cdn.cod.guide/wp-content/uploads/2023/01/unlock-second-builder-in-Call-of-Dragons-1024x697.png'],
    'https://cod.guide/beginners/',
    false
  );

  insert into guide_steps (guide_id, order_index, title, content, images, source_url, is_verified)
  values (
    guide_id,
    7,
    'Realiza las Misiones Diarias',
    'No te pierdas los desafíos diarios, semanales y de temporada. Te dan muchas recompensas por hacer cosas que deberías hacer de todas formas.

Si completas 6 misiones diarias, recibes: Token de Héroe Épico, Llave de Artefacto, Sweetdew para subir el nivel de confianza de un héroe, un speedup de 60 minutos y recursos.

También recibes XP de Runas por cada desafío completado, lo que aumenta tu nivel de Runa en Legado de los Titanes y te da más recompensas.',
    array[]::text[],
    'https://cod.guide/beginners/',
    false
  );

  insert into guide_steps (guide_id, order_index, title, content, images, source_url, is_verified)
  values (
    guide_id,
    8,
    'Nivel Honorary (VIP)',
    'La mejor forma de usar tus Gemas es llegar al nivel 8 de membresía Honorary (equivalente al VIP en Rise of Kingdoms).

En el nivel 8 obtienes la segunda cola de investigación, lo que te permite investigar dos tecnologías al mismo tiempo y acelera muchísimo el crecimiento de tu cuenta.

Necesitas 35.000 puntos de honor para alcanzar ese nivel. Como recompensa también obtienes 1 token de héroe legendario a tu elección (elige uno que no puedas obtener con llaves doradas).

Además, compra objetos en la tienda de Membresía cada semana usando recursos: Tokens de recuperación de Puntos de Comando, speedups de 5 minutos, medallas Épicas y Legendarias, y más. La tienda se reinicia cada lunes a las 0 UTC.',
    array['https://cdn.cod.guide/wp-content/uploads/2023/02/Upgrading-Honorary-VIP-Membership-1-1024x576.png'],
    'https://cod.guide/beginners/',
    false
  );

  insert into guide_steps (guide_id, order_index, title, content, images, source_url, is_verified)
  values (
    guide_id,
    9,
    'Exploración de la Niebla',
    'La progresión de exploración de la niebla es bastante sencilla: envía exploradores al mapa, abre los cofres y completa las mini-misiones en Aldeas, Campamentos y Cuevas. Cada vez obtienes pequeñas recompensas que se acumulan y ayudan mucho al inicio, especialmente con tecnologías, speedups y tropas de recolección.

Consigue Workhorse para recolectar más rápido (mayor capacidad).

¡Registra todos tus premios y progreso de exploración en el Campamento de Exploradores!

Tampoco olvides hablar con tus héroes dentro de la ciudad varias veces al día para recibir pequeñas recompensas y aumentar tu relación con ellos: desbloquearás emojis, historias ocultas y más.',
    array['https://cdn.cod.guide/wp-content/uploads/2023/01/Fog-Exploration-Call-of-Dragons-Rewards-291x300.jpg', 'https://cdn.cod.guide/wp-content/uploads/2023/01/Call-of-Dragons-scouting-camps-1024x576.png', 'https://cdn.cod.guide/wp-content/uploads/2023/01/chat-with-heroes-in-the-city.png'],
    'https://cod.guide/beginners/',
    false
  );

  insert into guide_steps (guide_id, order_index, title, content, images, source_url, is_verified)
  values (
    guide_id,
    10,
    'Edificios Importantes',
    'Subir edificios es una excelente fuente de poder y acelera enormemente tu progresión en las primeras etapas.

Subir el Salón Principal en Call of Dragons es relativamente fácil. Para optimizar la progresión, asigna un constructor al Salón del Orden mientras el segundo trabaja en los edificios prerrequisito, de modo que todo esté listo para subir lo antes posible.

También conviene subir el Centro de Alianza al nivel más alto posible: cuanto mayor sea su nivel, más ayudas recibirás de tus aliados, reduciendo enormemente los tiempos de construcción e investigación.

Nota: si encuentras una manastone de speedup en el mapa, recógela antes de iniciar cualquier mejora.

A continuación encontrarás la prioridad de construcción que debes conocer.',
    array[]::text[],
    'https://cod.guide/beginners/',
    false
  );

  insert into guide_steps (guide_id, order_index, title, content, images, source_url, is_verified)
  values (
    guide_id,
    11,
    'Requisitos para Subir el Salón Principal',
    'Nivel de Salón | Nivel Herbolario | Nivel Muralla | Nivel Fundición | Otros
2 | — | Muralla 2 | — | —
3 | — | Muralla 3 | — | —
4 | — | Muralla 4 | — | —
5 | — | Muralla 5 | — | —
6 | — | Muralla 6 | — | —
7 | — | Muralla 7 | — | —
8 | Herbolario 8 | Muralla 8 | — | —
9 | Herbolario 9 | — | — | —
10 | Herbolario 9 | Muralla 9 | — | Escuela de Sabios 9
11 | Herbolario 10 | Muralla 10 | Fundición 10 | Campo de Tiro 10, Aserradero 10
12 | Herbolario 11 | Muralla 11 | — | —
13 | Herbolario 12 | Muralla 12 | Fundición 11 | Centro de Alianza 12
14 | Herbolario 13 | Muralla 13 | Fundición 12 | Refinería de Maná 13
15 | Herbolario 14 | Muralla 14 | Fundición 13 | Almacén 14
16 | Herbolario 15 | Muralla 15 | Fundición 14 | Escuela de Sabios 15
17 | Herbolario 16 | Muralla 16 | Fundición 15 | —
18 | Herbolario 17 | Muralla 17 | Fundición 16 | Puesto Centauro 17
19 | Herbolario 18 | Muralla 18 | Fundición 17 | —
20 | Herbolario 19 | Muralla 19 | Fundición 18 | —
21 | Herbolario 20 | Muralla 20 | Fundición 19 | —
22 | Herbolario 21 | Muralla 21 | Fundición 20 | —
23 | Herbolario 22 | Muralla 22 | Fundición 21 | —
24 | Herbolario 23 | Muralla 23 | Fundición 22 | —
25 | Herbolario 24 | Muralla 24 | Fundición 23 | —',
    array[]::text[],
    'https://cod.guide/beginners/',
    false
  );

  insert into guide_steps (guide_id, order_index, title, content, images, source_url, is_verified)
  values (
    guide_id,
    12,
    'Sube el Edificio de Investigación y el Centro de Alianza Primero',
    'La mejor forma de subir tu Salón más rápido es saber en qué edificios enfocarte. La mayoría recomendará subir solo los requeridos para cada nivel del Salón, pero hay dos que vale la pena subir aunque no sean requisitos: el Centro de Alianza y el Edificio de Investigación (Consejo del Vidente, Colegio del Orden o Escuela de Sabios).

Centro de Alianza: permite recibir más ayudas de tus aliados, hasta 30 veces al nivel 25.
Edificio de Investigación: aumenta la velocidad de investigación hasta un 25% al nivel 25.

Tendrás que subirlos de todas formas para los requisitos del Salón, así que mejor aprovechar sus beneficios desde el principio.',
    array[]::text[],
    'https://cod.guide/beginners/',
    false
  );

  insert into guide_steps (guide_id, order_index, title, content, images, source_url, is_verified)
  values (
    guide_id,
    13,
    'Política',
    'Otro consejo clave para principiantes es elegir las Políticas correctas. Las encontrarás en el edificio Tablón de Anuncios; toca el ícono de silla al abrirlo.

Para usar una política necesitas Prestigio, que se obtiene derrotando Darklings y en el Dragon Trail.

Para empezar, enfócate en Expansión Militar: aumenta el tamaño de tu legión en 400, 500 o 600 tropas, un gran impulso cuando tu legión solo tiene 3.000 o 4.000. Más tropas = más daño en ataque, defensa y habilidades.

Con el tiempo, cuando tu legión supere las 40.000 tropas, podrás considerar las políticas de daño del 0,5% o 1%.

También recomendamos Estudios de Guerra 1 y 2 para ganar más XP.

Para la Curación Gratuita: elige Curación Gratuita en las Políticas, no Curación con Recursos (a menos que seas ballena). Sube su nivel lo más alto posible; una mayor velocidad de curación te permite participar en guerras con más frecuencia y ayudar a tus compañeros en el campo de batalla.',
    array['https://cdn.cod.guide/wp-content/uploads/2023/03/enacting-policies-300x236.png', 'https://cdn.cod.guide/wp-content/uploads/2023/02/prestige.png'],
    'https://cod.guide/beginners/',
    false
  );

  insert into guide_steps (guide_id, order_index, title, content, images, source_url, is_verified)
  values (
    guide_id,
    14,
    'Usa Todos tus Puntos de Comando Cada Día',
    'Los Puntos de Comando son muy valiosos. No los desperdicies dejando que la barra se llene, porque si está llena no puedes acumular más.

Los Puntos de Comando se usan para atacar Darklings en el mapa, lo cual te da recompensas y sube a tus héroes más rápido.

Úsalos todos cuando entres al juego; tardan unas 12 horas en volver a llenarse. Y gástalos todos antes de dormir para que sigan acumulándose mientras descansas.',
    array['https://cdn.cod.guide/wp-content/uploads/2023/01/cp-bar.png'],
    'https://cod.guide/beginners/',
    false
  );

  insert into guide_steps (guide_id, order_index, title, content, images, source_url, is_verified)
  values (
    guide_id,
    15,
    'Dragon Trail',
    'Dragon Trail es un interesante modo de juego tipo campaña donde debes derrotar enemigos en distintos escenarios. Aprenderás muchas tácticas y las recompensas son excelentes.

Cuantas más campañas superes, más puntos por hora ganarás. Por eso intenta llegar lo más lejos posible y usa tus puntos para comprar objetos en la tienda del Dragon Trail.',
    array[]::text[],
    'https://cod.guide/beginners/',
    false
  );

  insert into guide_steps (guide_id, order_index, title, content, images, source_url, is_verified)
  values (
    guide_id,
    16,
    '¿Cómo Usar los Speedups?',
    'Si puedes, recoge las runas de speedup del mapa antes de iniciar cualquier mejora.

Lo ideal es recibir primero las ayudas de los miembros de tu alianza antes de gastar speedups, para ahorrar recursos.

Al inicio del juego no necesitas guardar los speedups: úsalos de inmediato para impulsar tu poder rápidamente, facilitar la recolección y los ataques.

Más adelante, cuando tu Salón llegue al nivel 15+, conviene sincronizar el uso de speedups con los Eventos de Call of Dragons que los requieran, para obtener recompensas extra.',
    array['https://cdn.cod.guide/wp-content/uploads/2023/01/Call-of-Dragons-Dark-Chests-1024x765.png'],
    'https://cod.guide/beginners/',
    false
  );

  insert into guide_steps (guide_id, order_index, title, content, images, source_url, is_verified)
  values (
    guide_id,
    17,
    'Abre Todas las Llaves Oscuras',
    'No olvides usar tus Llaves Oscuras cada día. Puedes tener hasta 5 y conseguir 2 más diariamente desde la pestaña de eventos. Las necesitas para abrir los Cofres Oscuros en el mapa.

Primero debes derrotar a los Guardias Darkling que los protegen. Si son demasiado fuertes, envía más legiones o pide ayuda a un aliado.

Tras derrotarlos, recoge el cofre. El cofre puede ser abierto por varios miembros de tu alianza, pero solo una vez por persona, y se reinicia cada 15 minutos.

No necesitas Puntos de Comando para atacar a los Guardias Darkling: es botín completamente gratuito.',
    array[]::text[],
    'https://cod.guide/beginners/',
    false
  );

  insert into guide_steps (guide_id, order_index, title, content, images, source_url, is_verified)
  values (
    guide_id,
    18,
    'Prioridad de Investigación',
    'En Call of Dragons siempre debes enfocarte primero en tecnología económica. Aunque al principio parezca difícil, a largo plazo hará crecer tu cuenta mucho más rápido.

Las tecnologías más importantes son Arquitectura I y II y Erudición I y II, que se desbloquean al subir el edificio de investigación.

También sube Conscripción I y II del árbol Militar para obtener un 20% más de velocidad de entrenamiento.

Puedes conseguir los primeros cinco techs de ambos árboles gratis visitando los Campamentos Misteriosos del mapa.

Resumen de tecnologías clave:
- Arquitectura I y II: +50% velocidad de construcción en total.
- Erudición I y II: +25% velocidad de investigación en total.
- Stamina I y II: +600 de almacenamiento de Puntos de Comando.
- Control de Respiración I y II: +15% recuperación de Puntos de Comando.
- Liderazgo Militar I y II: +15% XP de héroes al derrotar Darklings.

No te preocupes demasiado por las tecnologías de recursos al principio. Después de completar Erudición I y II, avanza hacia las tropas de Nivel 4 y otras tecnologías que tarden más tiempo.',
    array['https://cdn.cod.guide/wp-content/uploads/2023/03/mystery-camp-rewards-280x300.png', 'https://cdn.cod.guide/wp-content/uploads/2023/03/tech-from-mystery-camps-1024x910.jpg'],
    'https://cod.guide/beginners/',
    false
  );

  insert into guide_steps (guide_id, order_index, title, content, images, source_url, is_verified)
  values (
    guide_id,
    19,
    'Juego PvP',
    '¿Vale la pena el PvP para jugadores F2P o de bajo gasto?

Call of Dragons es muy amigable con los F2P: todos pueden participar en batallas PvP sin gastar nada. Siempre que te unas a una buena alianza, hagas las tareas diarias y mejores tropas, tecnología y edificios cada día, estarás en buena posición.

Consejos para PvP:
- Juega en PC para acelerar tu progresión.
- Prepara recursos y unidades para curación.
- Usa los mejores talentos para tus Héroes.
- Equipa una Runa para buffs PvP adicionales.
- Usa los Artefactos adecuados para tus Héroes.
- Usa objetos de buff de ataque/defensa.',
    array[]::text[],
    'https://cod.guide/beginners/',
    false
  );

  insert into guide_steps (guide_id, order_index, title, content, images, source_url, is_verified)
  values (
    guide_id,
    20,
    'Línea de Tiempo de la Temporada',
    'Si te tomas el juego en serio, la línea de tiempo de la temporada es algo que debes entender y recordar para mantener tus prioridades en orden.

Como jugador normal, solo necesitarás enfocarte en recolectar recursos, speedups, gemas y subir a tus Héroes mientras sigues las actividades de la Alianza.

Sin embargo, si eres líder, la línea de tiempo se vuelve crucial para planificar con antelación: construir banderas y caminos tempranos para capturar estructuras clave cuando estén disponibles.

Eventos principales de la Temporada (en orden de aparición):
- Fe por Encima de Todo (2 días) — desbloquea La Isla Brumosa
- Flechas de Redención (2 días) — Scout Pass 1
- Una Cita con el Destino — Fortaleza Darkling 3
- La Roca (2 días) — Máscara de la Falsedad (1 día), Pase Nivel 1
- Estrella de Esperanza (2 días)
- Canción de Guerra (2 días) — Thunder Roc
- Grandes Gestas (3 días) — Scout Pass 2
- Nuevo Amanecer (2 días) — Ranking de Alianza
- Nombres Gloriosos (2 días) — Fortaleza Darkling 4
- Momento de la Verdad (2 días) — Hydra
- Conspiración (3 días) — Pase Nivel 2
- Cofre del Deseo (2 días) — Fortaleza Darkling 5
- Y más: Direbear, Scout Pass 3, Necrogiant, Lightbearer, Pase Nivel 3, Maniobras de Alianza',
    array[]::text[],
    'https://cod.guide/beginners/',
    false
  );

  insert into guide_steps (guide_id, order_index, title, content, images, source_url, is_verified)
  values (
    guide_id,
    21,
    'Conclusión',
    '¡Eso es todo por ahora para los principiantes en Call of Dragons! Recuerda tomártelo con calma pero hacerlo bien, y todo irá genial.

Por ahora, enfócate en subir tu Salón Principal y estarás en el camino correcto.

¡No dudes en preguntar en nuestro Discord si tienes dudas sobre cómo hacer crecer tu cuenta!',
    array[]::text[],
    'https://cod.guide/beginners/',
    false
  );

end $beg$;