// Contenido ENRIQUECIDO de los juegos próximos, indexado por `key`.
//
// La tabla `preregister_games` guarda la ficha básica (nombre, logo, blurb,
// género…). Aquí vive el contenido largo de la sección "Info" del mundo de cada
// juego (/proximos/[key]): descripción en párrafos, características y una ficha
// técnica ampliada + tráiler. Se mantiene en código (no en la BD) porque es una
// lista curada y pequeña, y la BD real está en otra cuenta.
//
// REGLA: los datos son REALES, extraídos de fuentes fiables (mmorpg.com y las
// webs oficiales). Nunca se inventan hechos de un juego. `source` documenta de
// dónde salió cada ficha. `releaseWindow` refleja el estado real con honestidad.

export type PreRegisterContent = {
  // Descripción larga: un elemento por párrafo.
  description: string[];
  // Características / "lo que ofrece" (viñetas).
  highlights: string[];
  // Ficha técnica ampliada. Complementa (o corrige) la de la BD: la página usa
  // estos valores si existen y cae a los de la BD si no.
  developer?: string; // estudio de desarrollo
  publisher?: string; // editora / distribuidora
  platforms?: string[]; // plataformas confirmadas
  businessModel?: string; // "Free-to-play", "Pago único", "Por confirmar"…
  engine?: string; // motor gráfico
  releaseWindow?: string; // ventana de lanzamiento / estado real
  // Tráiler oficial en YouTube (URL completa "watch?v=…").
  trailerUrl?: string;
  // Fuente(s) de la información, para trazabilidad.
  source?: string;
};

export const PREREGISTER_CONTENT: Record<string, PreRegisterContent> = {
  "chrono-odyssey": {
    description: [
      "Chrono Odyssey es un MMORPG de acción de nueva generación para PC, consolas y móvil, desarrollado por el estudio surcoreano NPIXEL y distribuido por Kakao Games. Es, según MMORPG.com, uno de los juegos más esperados del género.",
      "La historia transcurre en Setera, un mundo que a primera vista parece una tierra apacible y llena de naturaleza, pero que en realidad es la primera línea de una guerra eterna contra el Vacío. Es un lugar marcado por el caos del tiempo y el espacio retorcidos y por líneas temporales que se contradicen: peligros que, a la vez, esconden misterios y oportunidades que ningún otro mundo ofrece.",
      "La clave de todo es el Chronotector, un artefacto legendario creado por una antigua civilización conocida solo como «Los Grandes». Aunque ha perdido buena parte de su poder original, todavía es capaz de deformar el tiempo y el espacio a voluntad de quien lo porta, con efectos imposibles de replicar ni con la magia más poderosa del mundo.",
    ],
    highlights: [
      "Mundo abierto de nueva generación ambientado en el continente de Setera.",
      "Chronotector: manipula el tiempo y el espacio en combate y exploración.",
      "Guerra eterna contra el Vacío a través de líneas temporales enfrentadas.",
      "Combate de acción en tiempo real.",
      "Multiplataforma: PC, consolas y móvil.",
      "Construido sobre Unreal Engine 5 para gráficos de última generación.",
    ],
    developer: "NPIXEL",
    publisher: "Kakao Games",
    platforms: ["PC", "Consolas", "Móvil"],
    businessModel: "Por confirmar",
    engine: "Unreal Engine 5",
    releaseWindow: "Q4 2025 (fecha tentativa de Kakao Games)",
    trailerUrl: "https://www.youtube.com/watch?v=uSPUHJqNrqY",
    source: "mmorpg.com/chrono-odyssey · chronoodyssey.com",
  },

  "path-of-exile-2": {
    description: [
      "Path of Exile 2 es la secuela independiente del aclamado ARPG Path of Exile, de Grinding Gear Games. Empezó como una expansión, pero el proyecto creció tanto que acabó convertido en un juego propio, con sus mecánicas, su endgame y sus ligas separadas del original.",
      "En su lanzamiento cuenta con 12 clases de personaje y 36 clases de Ascendancy, más de 1500 habilidades pasivas y 240 activas para moldear tu build a tu gusto. El mundo reúne más de 100 escenarios únicos, cada uno con sus propios jefes, para que ninguna partida se sienta igual.",
      "Grinding Gear Games mantiene vivos los dos juegos a la vez, y ha confirmado que todas las microtransacciones compradas en Path of Exile 1 se trasladan a Path of Exile 2 (salvo algunas excepciones de cosméticos exclusivos).",
    ],
    highlights: [
      "12 clases de personaje y 36 clases de Ascendancy para especializar tu build.",
      "Más de 1500 habilidades pasivas y 240 activas: personalización casi infinita.",
      "Más de 100 escenarios únicos, cada uno con sus propios jefes.",
      "Combate ARPG de acción con botín y progresión profunda.",
      "Tus microtransacciones de Path of Exile 1 se trasladan a la secuela.",
      "Modelo free-to-play, como el original.",
    ],
    developer: "Grinding Gear Games",
    publisher: "Grinding Gear Games",
    platforms: ["PC", "PlayStation 5", "Xbox Series X/S"],
    businessModel: "Free-to-play",
    releaseWindow: "Ya disponible en acceso anticipado (desde diciembre de 2024)",
    trailerUrl: "https://www.youtube.com/watch?v=Go4ykizk_Uo",
    source: "mmorpg.com/path-of-exile-2 · pathofexile2.com",
  },

  "blue-protocol": {
    description: [
      "Blue Protocol nació como un MMORPG de Bandai Namco Studios ambientado en el mundo de Regnus, pero aquella versión original se quedó en beta cerrada y acabó cancelada antes de salir de Japón. La IP no murió: resucitó como Blue Protocol: Star Resonance, desarrollado ahora por Shanghai BOKURA Technology y publicado a nivel global, con lanzamiento el 9 de octubre de 2025 en Norteamérica, Latinoamérica, Europa, Oriente Medio y Oceanía.",
      "Su eslogan lo resume bien: sé tu propio yo anime, explora, conecta y lucha en equipo. Puedes crear tu héroe con un editor brutal (127 parámetros ajustables y un sistema de tinte que cubre más de 250 piezas de equipo) y lanzarte a explorar el mundo abierto de Regnus: mazmorras escondidas, picos que escalar y secretos por todas partes. En combate eliges entre varias clases —desde luchadores cuerpo a cuerpo veloces hasta hechiceros a distancia— para tumbar jefes que ocupan toda la pantalla, con fases y mecánicas que obligan a currar en equipo.",
      "Fuera de las peleas apuesta fuerte por la parte social: gremios, sistema de vivienda (housing), eventos y minijuegos para quien prefiera los oficios de vida antes que la acción pura. Es free-to-play, multiplataforma (PC vía Steam y Epic Games Store, además de iOS y Android con progreso cruzado) y funciona como servicio en vivo, con temporadas nuevas de forma continua.",
    ],
    highlights: [
      "Editor de personaje muy profundo, con 127 parámetros ajustables y tinte para más de 250 piezas de equipo.",
      "Mundo abierto de Regnus lleno de mazmorras ocultas, picos por escalar y secretos por descubrir.",
      "Combate dinámico en equipo con varias clases, desde luchadores cuerpo a cuerpo hasta hechiceros a distancia.",
      "Vida social con gremios, sistema de vivienda (housing), eventos y minijuegos.",
      "Multiplataforma con progreso cruzado entre PC (Steam y Epic), iOS y Android.",
      "Juego en vivo free-to-play que sigue recibiendo temporadas nuevas.",
    ],
    developer: "Shanghai BOKURA Technology (IP de Bandai Namco)",
    publisher: "A PLUS JAPAN (con Bandai Namco)",
    platforms: ["PC (Steam, Epic)", "iOS", "Android"],
    businessModel: "Free-to-play",
    releaseWindow: "Ya disponible (relanzado como «Star Resonance», 9 de octubre de 2025)",
    trailerUrl: "https://www.youtube.com/watch?v=mQBBTVUcyQ8",
    source: "playbpsr.com · store.steampowered.com · mmorpg.com/blue-protocol",
  },

  "palia": {
    description: [
      "Palia es un MMO acogedor de vida y comunidad ambientado en Kilima Village, dentro del mundo de fantasía de Majiri. La premisa engancha: los humanos eran una raza legendaria que desapareció hace miles de años en la cima de su dominio de la magia, y nadie sabe por qué. Un día empiezan a reaparecer por todo el mundo, y tú eres uno de ellos: te toca construirte un hogar desde cero y decidir si quieres desenterrar los secretos del pasado humano o simplemente vivir tranquilo.",
      "El día a día en Palia gira en torno a cultivar, pescar, cocinar, explorar y decorar tu propia casa a tu gusto, subiendo de nivel para desbloquear nuevas herramientas y habilidades. También puedes criar animales y, sobre todo, socializar: hay un elenco de aldeanos entrañables con los que puedes forjar amistades o incluso romances.",
      "Está pensado para jugarse solo o acompañado sin perder el ritmo, y sigue en beta abierta y gratuita mientras se expande: primero llegó a PC (agosto 2023) y Switch (diciembre 2023), y más tarde a PlayStation 5 y Xbox Series X/S (mayo 2025) junto a la expansión Elderwood.",
    ],
    highlights: [
      "Cultiva, pesca, cocina y decora tu propia casa en un mundo pensado para sentirse como un hogar.",
      "Conoce a un elenco entrañable de aldeanos con los que forjar amistades o incluso un romance.",
      "Juega en solitario a tu ritmo o únete a amigos: Palia se disfruta mejor en compañía.",
      "Descubre los secretos de los Antiguos Humanos, una raza legendaria desaparecida hace miles de años.",
      "Disponible gratis en PC, Nintendo Switch, PlayStation 5 y Xbox Series X/S.",
      "Sigue creciendo con expansiones como Elderwood.",
    ],
    developer: "Singularity 6",
    publisher: "Singularity 6",
    platforms: ["PC", "Nintendo Switch", "PlayStation 5", "Xbox Series X/S"],
    businessModel: "Free-to-play",
    engine: "Unreal Engine",
    releaseWindow: "Ya jugable en beta abierta (desde 2023)",
    trailerUrl: "https://www.youtube.com/watch?v=fpI1nacehbE",
    source: "mmorpg.com/palia · palia.com",
  },

  "steel-hunters": {
    description: [
      "Steel Hunters es el nuevo shooter de Wargaming (los creadores de World of Tanks y World of Warships), y aquí se meten de lleno en la ciencia ficción. La premisa le da una vuelta al battle royale de siempre: en vez de escuadras enteras cayendo sobre un mapa gigante, juegas en dúo, mezclando el caos del battle royale con la tensión de un juego de extracción. Controlas a un Hunter, un híbrido entre máquina y humano, en una Tierra en ruinas donde solo sobrevive quien sabe jugar en equipo.",
      "Cada Hunter tiene su propio estilo de combate: hay quien golpea como un camión, quien apoya desde la distancia y quien está pensado para hostigar y desgastar al rival. La clave está en la pareja: hay que combinar bien las builds para que funcionen juntas. Las partidas se juegan en mapas enormes y completamente destructibles, donde puedes volar paredes, esconderte entre los escombros o usar el terreno para tender trampas, mientras decides si arrasas con todo o te la juegas escapando por un punto de extracción.",
      "El juego es gratuito y entró en Acceso Anticipado el 2 de abril de 2025 en PC (Steam y Wargaming Game Center). Su primera temporada arrancó sin monetización a propósito, para pulir el gameplay con el feedback de la comunidad; y desde ese día los servidores se quedan fijos, sin resetear el progreso.",
    ],
    highlights: [
      "Shooter en tercera persona que mezcla battle royale y extracción, con combates en dúo.",
      "Controlas a un Hunter, un híbrido máquina-humano con habilidades propias (siete disponibles).",
      "Mapas enormes y totalmente destructibles: vuela paredes, usa escombros como cobertura o tiende trampas.",
      "Gratuito (free-to-play) en Steam y en el Wargaming Game Center para PC.",
      "En Acceso Anticipado desde abril de 2025, con la primera temporada sin monetización.",
      "El progreso no se resetea: lo que ganes ahora te lo llevas al lanzamiento completo.",
    ],
    developer: "Wargaming.net",
    publisher: "Wargaming.net",
    platforms: ["PC"],
    businessModel: "Free-to-play",
    releaseWindow: "En acceso anticipado (desde abril de 2025)",
    trailerUrl: "https://www.youtube.com/watch?v=lWiakTjMGno",
    source: "mmorpg.com/steel-hunters · wargaming.com",
  },

  "the-hidden-ones": {
    description: [
      "The Hidden Ones es un juego de acción y artes marciales en 3D con estética cinemática, inspirado en el popular manga y anime «Hitori no Shita: The Outcast» (también conocido como «Under One Person»). La historia se ambienta en un mundo moderno impregnado de mitología oriental antigua, con el taoísmo y la dualidad Yin-Yang como base: los llamados «Outcasts» son personas normales que esconden poderes y secretos bajo la superficie de la vida cotidiana.",
      "En combate apuesta por artes marciales orientales con coreografías muy cuidadas, escenas cinematográficas y un sistema de habilidades que cada jugador adapta a su estilo. Incluye los modos Historia, Duelo y Prueba, con fuerte foco en el PvP y una política de tolerancia cero contra las trampas. Es free-to-play y llegará tanto a PC (vía Steam) como a móviles (iOS y Android); tras varias fases de playtest cerrado, en 2026 mostró una actualización importante en la GDC, aunque en Steam sigue figurando como «Coming soon».",
    ],
    highlights: [
      "Combate cuerpo a cuerpo de artes marciales orientales con coreografías cinematográficas.",
      "Tres modos de juego: Historia, Duelo y Prueba, para campaña y PvP.",
      "PvP con política de tolerancia cero contra las trampas, pensado para partidas limpias.",
      "Ambientación basada en el manga y anime «Hitori no Shita: The Outcast».",
      "Lanzamiento multiplataforma confirmado para PC (Steam) y móviles (iOS y Android).",
      "Ya pasó por varias fases de playtest cerrado; en 2026 mostró una gran actualización en la GDC.",
    ],
    developer: "Morefun Studios",
    publisher: "Tencent",
    platforms: ["PC", "iOS", "Android"],
    businessModel: "Free-to-play",
    releaseWindow: "2026 (sin fecha exacta, «Coming soon» en Steam)",
    trailerUrl: "https://www.youtube.com/watch?v=TICJj9rzlFM",
    source: "mmorpg.com/the-hidden-ones · playthehiddenones.com · Steam",
  },

  "archeage-chronicles": {
    description: [
      "ArcheAge Chronicles (antes conocido como ArcheAge 2) es el regreso de XLGAMES al universo de ArcheAge, el MMO que arrancó en Corea en 2013. Lo publica Kakao Games y llega como título multiplataforma para PC, Xbox Series X/S y PlayStation 5. Nació como secuela directa, pero a mitad de desarrollo el estudio cambió el rumbo y hasta el nombre, pasando de ArcheAge 2 a Chronicles, para reflejar ese giro de enfoque.",
      "Según el propio productor ejecutivo, Yongjin Ham, esto no es un MMORPG tradicional: es un action RPG online centrado en el descubrimiento, con un combate construido desde cero a base de combos, esquives y habilidades propias de cada arma. La historia transcurre 50 años después del ArcheAge original, en un momento en que Auroria —salvaje y abandonada tras la catástrofe— empieza a resurgir con la llegada de nuevos colonos. En vez de flechas que te lleven de la mano, el estudio apuesta por que explores por tu cuenta: templos olvidados, personajes con historia propia y secretos que solo aparecen si te desvías del camino.",
      "Del ArcheAge original vuelve buena parte de lo que enamoró a la comunidad, pero pulido: vida útil (lifeskills), crafteo ligado a la progresión y un sistema de comercio con carromatos y rutas de intercambio, ahora con más riesgo cuanto más subes de nivel. Se mantiene la vivienda de jugador, con casas compartidas y decoración interactiva, más la posibilidad de levantar pueblos junto a tu gremio. Sigue en desarrollo sobre Unreal Engine 5 y, según Kakao Games, su lanzamiento se movió a Q4 de 2026.",
    ],
    highlights: [
      "Combate construido desde cero con combos, esquives y habilidades específicas de cada arma.",
      "La exploración es el corazón del juego: sin flechas guiándote, descubres templos y secretos por tu cuenta.",
      "Recupera y mejora la vida útil (lifeskills), la vivienda personalizable y el crafteo ligado al progreso.",
      "El sistema de comercio (Trade Run) vuelve mejorado, con carromatos, rutas y más riesgo a mayor nivel.",
      "Funda pueblos de jugadores junto a tu gremio y comparte vivienda con otros colonos.",
      "Contenido para todos los estilos: desde PvE en solitario hasta raids de hasta veinte jugadores.",
    ],
    developer: "XLGAMES",
    publisher: "Kakao Games",
    platforms: ["PC", "Xbox Series X/S", "PlayStation 5"],
    businessModel: "Por confirmar",
    engine: "Unreal Engine 5",
    releaseWindow: "Q4 2026 (previsto)",
    trailerUrl: "https://www.youtube.com/watch?v=-m9swucgNUQ",
    source: "mmorpg.com/archeage-chronicles · archeagechronicles.kakaogames.com",
  },

  "aion-2": {
    description: [
      "AION 2 es la secuela del clásico MMORPG de NCSoft y no se conforma con vivir de la nostalgia: reconstruye por completo el mundo de Atreia sobre Unreal Engine 5, con un mapa unas 36 veces más grande que el original de 2008. La historia salta 200 años hacia adelante: el Aether que sostenía la vida se ha agotado, y esa escasez es la raíz del nuevo conflicto entre facciones.",
      "Lo que siempre distinguió a la saga sigue siendo el centro del juego: el vuelo real como parte del combate, no solo como forma de desplazarte. La lucha es en tiempo real y premia el posicionamiento, con ataques de flanqueo que golpean más fuerte. Hay alrededor de 200 mazmorras repartidas entre contenido para un jugador, grupos de cuatro y grupos de ocho.",
      "El PvP escala desde arenas pequeñas hasta asedios Reino contra Reino entre servidores. El juego ya se lanzó en Corea del Sur y Taiwán (noviembre de 2025) y ahora prepara su lanzamiento global para PC, iOS y Android en septiembre de 2026.",
    ],
    highlights: [
      "El vuelo es parte real del combate, no solo desplazamiento: algo único entre los MMORPG actuales.",
      "El mundo de Atreia, reconstruido en Unreal Engine 5 y unas 36 veces más grande que en el AION original.",
      "Cerca de 200 mazmorras para modos de un jugador, cuatro jugadores y ocho jugadores.",
      "PvP que va desde arenas pequeñas hasta asedios Reino contra Reino a nivel entre servidores.",
      "Ya lanzado en Corea del Sur y Taiwán (nov. 2025); lanzamiento global confirmado para septiembre de 2026.",
      "Personalización de personaje profunda, con cosméticos, tintes y mascotas coleccionables.",
    ],
    developer: "NCSoft",
    publisher: "NCSoft",
    platforms: ["PC", "iOS", "Android"],
    businessModel: "Free-to-play",
    engine: "Unreal Engine 5",
    releaseWindow: "Global en sept. 2026 (ya disponible en Corea y Taiwán desde nov. 2025)",
    trailerUrl: "https://www.youtube.com/watch?v=IZ_zw2GksRY",
    source: "mmorpg.com/aion-2 · aion2.plaync.com",
  },

  "soulframe": {
    description: [
      "Soulframe es el proyecto de fantasía de Digital Extremes, el estudio detrás de Warframe, anunciado en la TennoCon 2022. Aquí se olvidan de los ninjas espaciales y el ritmo frenético: el combate es más pausado y contundente, con espadas y magia que recuerdan a Elden Ring o Ghost of Tsushima. La ambientación gira en torno a la naturaleza, la restauración de un mundo herido y la conexión entre lo físico y lo espiritual.",
      "Encarnas a un Envoy que llega a la isla de Midrath y puede viajar entre el Mundo Físico y el Mundo del Alma, hablando con los Ancestros que va descubriendo por el camino. Tu estilo de juego se define por tres Virtudes —Coraje, Gracia y Espíritu— y puedes avanzar en solitario o en cooperativo, invocando familiares animales que te acompañan en combate, incluido un lobo que puedes montar.",
      "El juego ya se puede probar gratis a través de Preludes, el programa público de acceso anticipado que Digital Extremes actualiza con frecuencia: nuevas armas, comercio entre jugadores, partidas de hasta cuatro personas y natación llegaron en actualizaciones recientes. Tiene página de Steam abierta para lista de deseados, pero todavía sin fecha de lanzamiento completo.",
    ],
    highlights: [
      "Controlas a un Envoy que viaja entre el Mundo Físico y el Mundo del Alma para hablar con los Ancestros de Midrath.",
      "Combate de espada y magia con un ritmo más lento y táctico, inspirado en juegos como Elden Ring.",
      "Tres Virtudes —Coraje, Gracia y Espíritu— definen tu rol y tu forma de jugar.",
      "Invoca familiares animales que te ayudan en la aventura, incluido un lobo al que puedes montar.",
      "Se juega en solitario o en cooperativo mientras exploras la isla, luchas y resuelves puzles.",
      "Ya jugable gratis en Preludes, con actualizaciones constantes (nuevas armas, comercio y mejoras).",
    ],
    developer: "Digital Extremes",
    publisher: "Digital Extremes",
    platforms: ["PC"],
    businessModel: "Free-to-play",
    releaseWindow: "En pruebas públicas (Preludes); sin fecha de lanzamiento completo",
    trailerUrl: "https://www.youtube.com/watch?v=OHJZ4iYdBio",
    source: "mmorpg.com/soulframe · soulframe.com",
  },

  "ragnarok-online-3": {
    description: [
      "Ragnarok Online 3 (RO3) es la secuela oficial y con licencia del mítico Ragnarok Online, desarrollada por Gravity junto al estudio JoyMaker (el mismo equipo detrás de Ragnarok Origin). El propio estudio la resume como «RO tal y como estaba destinado a ser»: recupera el estilo pixel-art nostálgico de siempre y recrea ciudades icónicas como Prontera y Geffen, pero con gráficos renovados y sistemas de juego más profundos.",
      "Mantiene los trabajos de toda la vida (Lord Knight, High Wizard, Assassin Cross…) y un sistema de progresión de personaje ampliado, además de mazmorras cooperativas de hasta 10 jugadores, jefes MVP y guerras de gremio a gran escala. Su gran novedad es un modo de «mundo por temporadas»: en vez de una única progresión lineal, el contenido se renueva de forma periódica para mantener el juego fresco.",
      "Ahora mismo está en fase de pruebas: ha pasado por varias rondas cerradas llamadas Pioneer Test en Corea, Taiwán, Hong Kong, Tailandia, Malasia, Singapur, Indonesia y Filipinas, con miles de jugadores probando el cliente antes del lanzamiento. El pre-registro sigue abierto en la web oficial y el estudio mantiene el lanzamiento global para 2026, en PC y móvil.",
    ],
    highlights: [
      "Recupera el estilo pixel-art clásico de Ragnarok Online y recrea ciudades icónicas como Prontera y Geffen con gráficos renovados.",
      "Mantiene los trabajos de siempre —Lord Knight, High Wizard, Assassin Cross— con un sistema de progresión ampliado.",
      "Añade un modo de «mundo por temporadas» que renueva el contenido de forma periódica en vez de una progresión lineal.",
      "Mazmorras cooperativas para hasta 10 jugadores, jefes MVP en equipo y guerras de gremio a gran escala.",
      "Ya ha pasado por varias rondas de beta cerrada (Pioneer Test) en Corea y el Sudeste Asiático.",
      "Será gratuito y llegará a PC y móvil con soporte multi-idioma, incluido español latinoamericano.",
    ],
    developer: "Gravity / JoyMaker",
    publisher: "Gravity Game Vision",
    platforms: ["PC", "Móvil"],
    businessModel: "Free-to-play",
    releaseWindow: "Previsto para 2026 en PC y móvil; en pruebas cerradas (Pioneer Test) y con pre-registro abierto",
    trailerUrl: "https://www.youtube.com/watch?v=n8PqmhQBHzc",
    source: "ro3global.com · massivelyop.com · rpgsite.net",
  },
};

// Devuelve el contenido enriquecido de un juego (o null si aún no lo tiene).
export function getPreRegisterContent(key: string): PreRegisterContent | null {
  return PREREGISTER_CONTENT[key] ?? null;
}
