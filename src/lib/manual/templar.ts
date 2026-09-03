// Manual de Atreia — Templar (수호성).
//
// Los porcentajes de equipo, grabados y pasivas salen de la plataforma que mide
// el combate real del servidor coreano: 6.287 Templars en total (5.237 de PvE y
// 950 de PvP) para skills, estigmas, arcanas y equipo, y una muestra aparte de
// 554 Templars de élite para los grabados pieza a pieza. Las especializaciones y
// el reparto de las cartas de arcana salen del volcado del cliente del juego —
// ahí son exactos. La rotación, la macro y todo lo del agro viene del tablón
// coreano de la clase. Nombres coreanos incluidos para rastrear las fuentes.
import type { Guia } from "./tipos";

const ICO = "https://aion2t.com/db-item-icons/";

export const templar: Guia = {
  slug: "templar",
  nombre: "Templar",
  acento: "#4f9ee0",
  resumen: {
    es: "Bloqueo, hostilidad y golpes por minuto: cómo se sostiene el agro de un jefe según 6.287 Templars.",
    en: "Block, enmity and hits per minute: how boss aggro is actually held, based on 6,287 Templars.",
  },

  portada: {
    eyebrow: { es: "Aion 2 · Guía de clase", en: "Aion 2 · Class guide" },
    titulo: "Templar",
    lede: {
      es: "El tanque principal de Aion 2. Esta guía va de las tres cosas que de verdad deciden si haces bien tu trabajo: **bloquear sin dejar de pegar, no perder el agro del jefe y sacar los golpes por minuto** — todo medido, no opinado.",
      en: "Aion 2's main tank. This guide is about the three things that actually decide whether you are doing your job: **blocking without stopping your swings, never losing boss aggro, and hitting your hits per minute** — all measured, not guessed.",
    },
    cifras: [
      { valor: "6.287", etiqueta: { es: "Templars medidos", en: "Templars measured" } },
      { valor: "6.º / 8", etiqueta: { es: "En daño por segundo", en: "In damage per second" } },
      { valor: "117.020", etiqueta: { es: "DPS mediano de la clase", en: "Class median DPS" } },
      { valor: "3 sept", etiqueta: { es: "Última actualización", en: "Last updated" } },
    ],
    arte: "/manual/aion2-templar.webp",
  },

  secciones: [
    // ── 1. Dónde está la clase ──────────────────────────────────
    {
      eyebrow: { es: "Lo primero, sin adornos", en: "First, with no sugar-coating" },
      titulo: { es: "Dónde está el Templar", en: "Where the Templar stands" },
      intro: [
        {
          es: "Sexto de ocho clases en daño. Por debajo de Assassin (256.978), Ranger (203.262), Spiritmaster (196.559), Sorcerer (155.574) y Gladiator (127.421); por encima de Chanter (112.601) y Cleric (86.811).",
          en: "Sixth of eight classes in damage. Below Assassin (256,978), Ranger (203,262), Spiritmaster (196,559), Sorcerer (155,574) and Gladiator (127,421); above Chanter (112,601) and Cleric (86,811).",
        },
        {
          es: "**Y aun así el número no cuenta la historia.** El Templar es la única clase con Provocación y la única con una pasiva que dobla la hostilidad. Eres el que sujeta al jefe mientras siete personas hacen números más grandes que el tuyo, y el que reparte un +5,5% de daño a todo el grupo cada vez que bloquea. Si te comparas con el Gladiator en el medidor vas a estar amargado; si miras cuánto sube el grupo contigo delante, no.",
          en: "**And the number still does not tell the story.** The Templar is the only class with Taunt and the only one with a passive that doubles enmity. You are the one pinning the boss while seven people post bigger numbers than yours, and the one handing the whole party +5.5% damage every time you block. Compare yourself to the Gladiator on the meter and you will be miserable; look at how much the party gains with you in front and you will not.",
        },
      ],
      bloques: [
        {
          t: "tarjetas",
          columnas: 3,
          items: [
            {
              titulo: { es: "Lo que sí eres", en: "What you are" },
              sub: { es: "Y nadie más puede hacer", en: "And nobody else can do" },
              puntos: [
                { es: "**El único con Provocación** — 20.000 de hostilidad de golpe", en: "**The only one with Taunt** — 20,000 flat enmity" },
                { es: "**El único que dobla la hostilidad** con una pasiva grabada", en: "**The only one who doubles enmity** with an engraved passive" },
                { es: "**+5,5% de daño para todo el grupo** cada vez que bloqueas", en: "**+5.5% damage for the whole party** every time you block" },
                { es: "Escudos, reducción de daño y quitar controles a los demás", en: "Shields, damage reduction and cleansing crowd control for others" },
              ],
            },
            {
              titulo: { es: "Lo que no eres", en: "What you are not" },
              sub: { es: "Y no vas a serlo", en: "And are not going to be" },
              puntos: [
                { es: "El primero del medidor. Ni el segundo", en: "Top of the meter. Or second" },
                { es: "Una clase de la que sale daño sola: **el tuyo se sostiene a mano**", en: "A class whose damage happens by itself: **yours is held together by hand**" },
                { es: "Cómodo. En Corea la queja constante es que todo depende de que no dejes de pegar ni un segundo", en: "Comfortable. The constant complaint in Korea is that everything hinges on never stopping your swings" },
              ],
            },
            {
              titulo: { es: "Y lo que decide todo", en: "And what decides everything" },
              sub: { es: "Las tres palancas de la clase", en: "The class's three levers" },
              ordenada: true,
              puntos: [
                { es: "**Bloqueo** — mantiene encendida la Furia sin parar de atacar", en: "**Block** — keeps Fury up without stopping your attacks" },
                { es: "**Hostilidad** — el agro se pierde por dejar de pegar, no por falta de amenaza", en: "**Enmity** — aggro is lost by stopping, not by lacking threat" },
                { es: "**Golpes por minuto** — el termómetro real de la clase, y depende hasta del ordenador", en: "**Hits per minute** — the class's real yardstick, and it even depends on your PC" },
              ],
            },
          ],
        },
      ],
    },

    // ── 2. Stats ────────────────────────────────────────────────
    {
      eyebrow: { es: "Stats", en: "Stats" },
      titulo: { es: "Qué buscar en el equipo", en: "What to look for on gear" },
      intro: [
        {
          es: "Esto no es una opinión: es **el porcentaje de Templars de élite que lleva cada opción**. Lo que está al 100% no se discute — si te falta, vas mal.",
          en: "This is not an opinion: it is **the percentage of top Templars running each option**. Anything at 100% is not up for debate — if you are missing it, you are behind.",
        },
      ],
      bloques: [
        {
          t: "stats",
          filas: [
            {
              nombre: { es: "Amplificación de daño de arma", en: "Weapon damage amplification" },
              nota: { es: "무기 피해 증폭 · el multiplicador que más pesa, en espada y guarda", en: "무기 피해 증폭 · the multiplier that weighs most, on sword and guard" },
              pct: 100, top: true,
            },
            {
              nombre: { es: "Potencia", en: "Power" },
              nota: { es: "위력 · sube el suelo de todos tus golpes", en: "위력 · raises the floor of every hit" },
              pct: 100, top: true,
            },
            {
              nombre: { es: "Velocidad de combate", en: "Combat speed" },
              nota: { es: "전투 속도 · en arma, guarda y guantes. Aquí no hay tope: cada punto son golpes", en: "전투 속도 · on sword, guard and gloves. There is no cap here: every point is more hits" },
              pct: 100, top: true,
            },
            {
              nombre: { es: "Amplificación de daño", en: "Damage amplification" },
              nota: { es: "피해 증폭 · el peto entero la lleva", en: "피해 증폭 · every single chest piece has it" },
              pct: 100, top: true,
            },
            {
              nombre: { es: "Amplificación de daño crítico", en: "Critical damage amplification" },
              nota: { es: "치명타 피해 증폭 · va en las hombreras y no se discute", en: "치명타 피해 증폭 · goes on the shoulders, no debate" },
              pct: 100, top: true,
            },
            {
              nombre: { es: "Puntería", en: "Hit" },
              nota: { es: "명중 · pendiente 92,8% y collar 87,9%. Sin esto el Juicio falla", en: "명중 · 92.8% on the earring, 87.9% on the necklace. Without it Judgment misses" },
              pct: 92.8,
            },
            {
              nombre: { es: "Crítico", en: "Critical" },
              nota: { es: "치명타 · en pendiente y collar; en el resto se pelea con el bloqueo", en: "치명타 · on earring and necklace; elsewhere it fights the block setup" },
              pct: 91.9,
            },
            {
              nombre: { es: "Perfección", en: "Perfection" },
              nota: { es: "완벽 · capa, botas, guantes y pantalón", en: "완벽 · cape, boots, gloves and legs" },
              pct: 91.2,
            },
            {
              nombre: { es: "Acierto de golpes múltiples", en: "Multi-hit accuracy" },
              nota: { es: "다단 히트 적중 · 89,2% en el arma, 97,2% en la guarda", en: "다단 히트 적중 · 89.2% on the sword, 97.2% on the guard" },
              pct: 89.2,
            },
            {
              nombre: { es: "Bloqueo", en: "Block" },
              nota: { es: "막기 · el stat firma del Templar. La mitad de la élite lo mete en los accesorios", en: "막기 · the Templar signature stat. Half the top players slot it on accessories" },
              pct: 51.3,
            },
          ],
        },
        {
          t: "parrafo",
          texto: {
            es: "**Cómo se busca cada cosa.** Cada pieza tiene su papel, y no se mezclan:",
            en: "**Where each thing goes.** Every slot has its job, and they do not mix:",
          },
        },
        {
          t: "tabla",
          cabeceras: [
            { es: "Pieza", en: "Slot" },
            { es: "Lo que tiene que salir", en: "What it needs to roll" },
            { es: "Adopción", en: "Adoption" },
          ],
          filas: [
            [
              { es: "Espada y guarda", en: "Sword and guard" },
              { es: "Amplif. daño de arma · Potencia · Velocidad de combate · Amplif. de daño · Precisión · Golpes múltiples", en: "Weapon damage amp · Power · Combat speed · Damage amp · Accuracy · Multi-hit" },
              { es: "100%", en: "100%" },
            ],
            [{ es: "Casco", en: "Helmet" }, { es: "Golpe fuerte · Aumento de ataque · Ataque", en: "Heavy strike · Attack increase · Attack" }, { es: "99,4%", en: "99.4%" }],
            [{ es: "Peto", en: "Chest" }, { es: "Amplificación de daño · Ataque", en: "Damage amplification · Attack" }, { es: "100%", en: "100%" }],
            [{ es: "Pantalón", en: "Legs" }, { es: "Aumento de ataque · **Resistencia al daño** · Perfección", en: "Attack increase · **Damage resistance** · Perfection" }, { es: "98,7%", en: "98.7%" }],
            [{ es: "Guantes", en: "Gloves" }, { es: "Velocidad de combate · Ataque · Perfección", en: "Combat speed · Attack · Perfection" }, { es: "100%", en: "100%" }],
            [{ es: "Botas", en: "Boots" }, { es: "Velocidad de movimiento · Ataque · Perfección", en: "Movement speed · Attack · Perfection" }, { es: "100%", en: "100%" }],
            [{ es: "Hombreras", en: "Shoulders" }, { es: "Amplificación de daño crítico · Ataque", en: "Critical damage amplification · Attack" }, { es: "100%", en: "100%" }],
            [{ es: "Capa", en: "Cape" }, { es: "Aumento de ataque · Golpe fuerte · Perfección", en: "Attack increase · Heavy strike · Perfection" }, { es: "99,6%", en: "99.6%" }],
            [
              { es: "Collar y pendiente", en: "Necklace and earring" },
              { es: "Ataque · Puntería · Crítico — y **Bloqueo en la mitad de los casos**", en: "Attack · Hit · Critical — and **Block about half the time**" },
              { es: "100%", en: "100%" },
            ],
            [
              { es: "Anillo", en: "Ring" },
              { es: "Ataque + **opciones de skill**: aquí se decide tu build", en: "Attack + **skill options**: this is where your build is decided" },
              { es: "97,2%", en: "97.2%" },
            ],
            [{ es: "Broche", en: "Brooch" }, { es: "Potencia · Precisión · Puntería", en: "Power · Accuracy · Hit" }, { es: "99,4%", en: "99.4%" }],
          ],
        },
        {
          t: "parrafo",
          texto: {
            es: "**Las piedras mágicas son fáciles:** ataque en todo. Dos de cada tres Templars meten ataque ×10 en cada pieza de armadura, y en accesorios y brazalete suben al 80-85%. Después van vida, crítico y puntería adicional.",
            en: "**Manastones are the easy part:** attack everywhere. Two out of three Templars slot attack ×10 in every armour piece, rising to 80-85% on accessories and the bracelet. After that come HP, crit and extra hit.",
          },
        },
        { t: "subtitulo", texto: { es: "Y cuando tengas que elegir entre dos", en: "And when a piece makes you choose" } },
        {
          t: "tabla",
          primeraNum: true,
          cabeceras: [{ es: "#", en: "#" }, { es: "Opción", en: "Option" }, { es: "Lo que hay que mirar", en: "What to watch" }],
          filas: [
            [{ es: "1", en: "1" }, { es: "**Daño de arma · Amplificación · Potencia**", en: "**Weapon damage · Amplification · Power**" }, { es: "El eje que multiplica todo lo demás", en: "The axis that multiplies everything else" }],
            [{ es: "2", en: "2" }, { es: "**Velocidad de combate**", en: "**Combat speed**" }, { es: "Son golpes por minuto, y aquí no hay tope", en: "It is hits per minute, and there is no cap here" }],
            [{ es: "3", en: "3" }, { es: "**Puntería**", en: "**Hit**" }, { es: "Un Juicio fallado vale cero por muy crítico que fuese", en: "A missed Judgment is worth zero no matter how critical it was" }],
            [{ es: "4", en: "4" }, { es: "**Bloqueo**", en: "**Block**" }, { es: "Hasta el umbral que decidas — ver la sección siguiente", en: "Up to whatever threshold you pick — see the next section" }],
            [{ es: "5", en: "5" }, { es: "Golpe fuerte y amplificación de daño frontal", en: "Heavy strike and front damage amplification" }, { es: "Un montaje muy usado busca 75-80% de golpe fuerte y 40% de frontal", en: "A widely used setup aims for 75-80% heavy strike and 40% front" }],
            [{ es: "6", en: "6" }, { es: "Crítico · Perfección", en: "Critical · Perfection" }, { es: "Lo primero que se sacrifica cuando entra el bloqueo", en: "The first thing sacrificed when block comes in" }],
          ],
        },
        {
          t: "aviso",
          parrafos: [
            {
              es: "**No metas Defensa acorazada en un hueco de PvE.** Es la trampa que más se repite en el tablón coreano: suena a tanque, y en PvE la graban 2 de cada 100. En su lugar van Ataque, Crítico, Puntería o Bloqueo. Defensa acorazada es una pasiva de PvP — ahí sí, y ahí sube al 65%.",
              en: "**Do not put Ironclad Defense in a PvE slot.** It is the most repeated trap on the Korean board: it sounds like a tank stat, and in PvE 2 out of 100 engrave it. Attack, Critical, Hit or Block go there instead. Ironclad Defense is a PvP passive — there it does belong, and there it climbs to 65%.",
            },
            {
              es: "**En PvP cambia el tablero entero.** Resistencia a estados alterados en las ocho piezas de armadura (82-87%), Muro de hierro en peto, hombreras, casco y pantalón (86-88%), y Conocimiento y Puntería en los accesorios (88-89%). Lo que en PvE es ataque, en PvP es aguantar el control: en el propio tablón lo dicen claro — no te matan por poca vida, te matan por quedarte aturdido.",
              en: "**In PvP the whole board changes.** Status effect resist on all eight armour pieces (82-87%), Iron Wall on chest, shoulders, helmet and legs (86-88%), and INT and Hit on the accessories (88-89%). What is attack in PvE is crowd-control resistance in PvP: the board says it plainly — you do not die from low HP, you die from being stunned.",
            },
          ],
        },
      ],
    },

    // ── 3. El bloqueo ───────────────────────────────────────────
    {
      eyebrow: { es: "El bloqueo", en: "Block" },
      titulo: { es: "Bloquear no es defenderse", en: "Blocking is not defending" },
      intro: [
        {
          es: "Esta es **la sección que separa a un Templar que sabe de uno que no**, y no tiene nada que ver con sobrevivir. Bloquear es tu botón de daño para todo el grupo.",
          en: "This is **the section that separates a Templar who knows from one who does not**, and it has nothing to do with surviving. Blocking is your damage button for the entire party.",
        },
      ],
      bloques: [
        {
          t: "skills",
          items: [
            {
              orden: { es: "El motor", en: "The engine" },
              nombre: { es: "Furia", en: "Fury" },
              ko: "격앙",
              icono: `${ICO}ICON_TE_SKILL_Passive_008.webp`,
              puntos: [
                { es: "Al bloquear: **+5,5% de daño PvE durante 20 segundos para ti y para todo el grupo**", en: "On block: **+5.5% PvE damage for 20 seconds, for you and the whole party**" },
                { es: "+0,3% de daño por ataque frontal, siempre", en: "+0.3% front attack damage, always on" },
                { es: "Recarga de 1 segundo, así que se puede refrescar sin parar", en: "1 second cooldown, so it can be refreshed constantly" },
                { es: "**Es la pasiva más grabada de la clase** — no baja del 66% en ninguna pieza", en: "**It is the most engraved passive in the class** — it never drops below 66% on any slot" },
              ],
            },
            {
              orden: { es: "El apoyo", en: "The support" },
              nombre: { es: "Escudo protector", en: "Warding Shield" },
              ko: "비호의 방패",
              icono: `${ICO}ICON_TE_SKILL_Passive_002.webp`,
              puntos: [
                { es: "**+200 de bloqueo**, y encima te cura 53-64 de vida cada vez que bloqueas", en: "**+200 block**, and it heals you 53-64 HP every time you block" },
                { es: "Recarga de 3 segundos entre curaciones", en: "3 second cooldown between heals" },
                { es: "Se desbloquea a nivel 6 — la tienes desde el principio", en: "Unlocks at level 6 — you have it from the start" },
              ],
            },
            {
              orden: { es: "La muleta", en: "The crutch" },
              nombre: { es: "Escudo de protección", en: "Shield of Protection" },
              ko: "보호의 방패",
              icono: `${ICO}ICON_TE_SKILL_011.webp`,
              puntos: [
                { es: "**Garantiza el bloqueo** y sube un 100% la reducción de daño al bloquear", en: "**Guarantees a block** and raises block damage reduction by 100%" },
                { es: "Recupera espíritu y aguante cada vez que bloqueas con él", en: "Restores MP and stamina on each block" },
                { es: "**Pero mientras está encendido dejas de atacar.** Ahí está el problema", en: "**But while it is up you stop attacking.** That is the problem" },
                { es: "El 87,6% de los Templars lo tiene a nivel 20", en: "87.6% of Templars run it at level 20" },
              ],
            },
          ],
        },
        {
          t: "parrafo",
          texto: {
            es: "**El círculo vicioso.** La Furia solo se enciende al bloquear. Si no tienes bloqueo suficiente, la única forma de bloquear a voluntad es pulsar el Escudo de protección — y mientras lo tienes puesto, no pegas. Así que para mantener el buff de daño del grupo estás renunciando a tu propio daño, y encima tienes que cronometrar todos los patrones del jefe para no quedarte sin Furia entre uno y otro.",
            en: "**The vicious circle.** Fury only lights up on a block. Without enough block rating, the only way to block on demand is to press Shield of Protection — and while it is up, you are not swinging. So to keep the party's damage buff you are giving up your own damage, and on top of that you have to time every boss pattern so Fury does not drop between them.",
          },
        },
        {
          t: "parrafo",
          texto: {
            es: "**El montaje de bloqueo rompe el círculo.** Si subes el bloqueo lo suficiente, bloqueas solo mientras atacas: la Furia se refresca sin que hagas nada y el Escudo de protección vuelve a ser lo que debería — un botón de supervivencia y de recuperar espíritu, no un impuesto sobre tu daño. Los Templars de cabeza en las clasificaciones lo llevan por esto, no por aguantar más.",
            en: "**The block setup breaks the circle.** Push block rating high enough and you block naturally while attacking: Fury refreshes on its own and Shield of Protection goes back to being what it should be — a survival and MP button, not a tax on your damage. The Templars at the top of the rankings run it for this reason, not to survive more.",
          },
        },
        { t: "subtitulo", texto: { es: "Cuánto bloqueo hace falta", en: "How much block you need" } },
        {
          t: "tabla",
          cabeceras: [
            { es: "Fuente", en: "Source" },
            { es: "Cifra que da", en: "Number given" },
            { es: "Para qué", en: "For what" },
          ],
          filas: [
            [{ es: "Guía de «montaje de bloqueo obligatorio»", en: "The «block setup is mandatory» guide" }, { es: "**1.700 – 1.800**", en: "**1,700 – 1,800**" }, { es: "Pesadilla, expedición y trascendencia — el propio autor pide que se afine", en: "Nightmare, expedition and transcendence — the author himself asks for it to be refined" }],
            [{ es: "Guía de «por qué el bloqueo»", en: "The «why block» guide" }, { es: "**2.100 – 2.400**", en: "**2,100 – 2,400**" }, { es: "Competir por clasificación en pesadilla", en: "Competing on the nightmare rankings" }],
            [{ es: "Guía de montaje base", en: "The base setup guide" }, { es: "**2.400 – 2.500** · **3.100**", en: "**2,400 – 2,500** · **3,100**" }, { es: "Expedición · trascendencia. Marcadas por el autor como estimaciones", en: "Expedition · transcendence. Flagged by the author as estimates" }],
          ],
        },
        {
          t: "aviso",
          parrafos: [
            {
              es: "**Nadie ha cerrado el número, y quien lo publica lo dice.** Las tres cifras salen de tres jugadores distintos midiendo en contenidos distintos, y las tres van con la coletilla de «esto habría que confirmarlo». Lo que sí coincide en las tres: **el bloqueo se paga con crítico y puntería**, así que si vas justo de puntería para el contenido que haces, primero la puntería.",
              en: "**Nobody has settled the number, and the people publishing it say so.** The three figures come from three different players measuring in different content, and all three carry a «this needs confirming» caveat. What all three agree on: **block is paid for with crit and hit**, so if you are short on the hit rating your content demands, hit comes first.",
            },
            {
              es: "**Y no lo hagas si no te hace falta.** Quien lleva armadura de Corazón de lava o accesorios erosionados, quien no compite por clasificación y quien va cómodo tal como está: el montaje de bloqueo no compensa el trabajo de rehacer los grabados. Es para quien lleva armadura de dragón, quiere ir a clasificación, o está harto de pulsar el Escudo de protección cada veinte segundos solo para no perder la Furia.",
              en: "**And do not do it if you do not need it.** If you run Lava Heart armour or corroded accessories, if you are not chasing rankings, if you are comfortable as you are: the block setup is not worth redoing your engravings for. It is for people in dragon armour, people going for rankings, or people sick of pressing Shield of Protection every twenty seconds just to keep Fury alive.",
            },
          ],
        },
      ],
    },

    // ── 4. Arcanas ──────────────────────────────────────────────
    {
      eyebrow: { es: "Arcanas", en: "Arcana" },
      titulo: { es: "Cómo subir una skill a 20", en: "How a skill reaches level 20" },
      intro: [
        {
          es: "El nivel de una skill no sale de un sitio: **se suma de tres**. Y hasta que no entiendes esto, gastas cartas a ciegas.",
          en: "A skill's level does not come from one place: **it is the sum of three**. Until you get this, you burn cards blind.",
        },
      ],
      bloques: [
        {
          t: "fuentes",
          items: [
            {
              valor: "+4",
              titulo: { es: "Daevanion", en: "Daevanion" },
              texto: {
                es: "El techo son cuatro niveles, y salen de las mazmorras selladas —incluidas las del bando contrario—, misiones secundarias y contenido de progreso.",
                en: "Four levels is the ceiling, and they come from sealed dungeons —including the enemy faction's—, side quests and progression content.",
              },
            },
            {
              valor: "+2",
              titulo: { es: "Anillo", en: "Ring" },
              texto: {
                es: "Dos niveles por skill activa. En espada y guarda también pueden salir, pero **no las cojas ahí**: ese hueco lo necesitas para potencia y velocidad.",
                en: "Two levels per active skill. They can also roll on sword and guard, but **do not take them there**: that room is needed for power and speed.",
              },
            },
            {
              valor: "+4",
              titulo: { es: "Cartas de arcana", en: "Arcana cards" },
              texto: {
                es: "Los otros cuatro. Cada línea de skill de una carta va de +1 a +4, un nivel por mejora. Es la parte lenta y donde se atasca todo el mundo.",
                en: "The other four. Each skill line on a card runs from +1 to +4, one level per enchant. It is the slow part, and where everyone gets stuck.",
              },
            },
          ],
        },
        {
          t: "parrafo",
          texto: {
            es: "**Cada tipo de carta da unas skills concretas.** Esto sale del volcado del cliente, así que es exacto — pedirle a una brújula una skill que solo sale en pergamino es tirar el dinero:",
            en: "**Each card type only rolls certain skills.** This comes from the game client dump, so it is exact — asking a compass for a skill that only appears on parchment is throwing money away:",
          },
        },
        {
          t: "tabla",
          cabeceras: [{ es: "Carta", en: "Card" }, { es: "Qué puede salir", en: "What it can roll" }],
          filas: [
            [
              { es: "**Pergamino** (양피지)", en: "**Parchment** (양피지)" },
              { es: "Juicio · Castigo · Golpe feroz · Enganche · Embate debilitador · Aniquilación", en: "Judgment · Punishment · Vicious Strike · Poach · Debilitating Smash · Annihilate" },
            ],
            [
              { es: "**Brújula** (나침반)", en: "**Compass** (나침반)" },
              { es: "Aporreo continuo · Golpe de escudo · Golpe protector · Carga de escudo · Danza de destellos · Liberación de impacto", en: "Pummel · Shield Smite · Warding Strike · Shield Rush · Flash Rampage · Defiance" },
            ],
            [
              { es: "**Campana** (종)", en: "**Bell** (종)" },
              { es: "Solo pasivas: **Furia** · **Rugido insultante** · Bendición condenatoria · Sello de guarda · Refuerzo vital", en: "Passives only: **Fury** · **Insulting Roar** · Punishing Benediction · Guarding Seal · Enhance Health" },
            ],
            [
              { es: "**Espejo** (거울)", en: "**Mirror** (거울)" },
              { es: "Solo pasivas: **Impacto certero** · Escudo protector · Defensa acorazada · Voluntad de supervivencia · Bloqueo del dolor", en: "Passives only: **Impact Hit** · Warding Shield · Ironclad Defense · Survival Willpower · Block Pain" },
            ],
            [
              { es: "**Cáliz y balanza** (성배 · 천칭)", en: "**Chalice and scales** (성배 · 천칭)" },
              { es: "Las 22 — activas y pasivas. Por eso son las más golosas y las más traicioneras: las pasivas se cuelan y te estropean la tirada", en: "All 22 — actives and passives. That makes them the most tempting and the most treacherous: passives sneak in and ruin the roll" },
            ],
            [
              { es: "**Llave, reloj, dado y farol** (열쇠 · 모래시계 · 주사위 · 등불)", en: "**Key, hourglass, dice and lantern** (열쇠 · 모래시계 · 주사위 · 등불)" },
              { es: "**Ninguna skill.** Dan estadística plana (+5 ataque, +50 defensa, +10 puntería, +10 evasión) y cuentan para el conjunto", en: "**No skills at all.** They give flat stats (+5 attack, +50 defence, +10 hit, +10 evasion) and count toward the set" },
            ],
          ],
        },
        { t: "subtitulo", texto: { es: "Qué conjunto montar", en: "Which set to build" } },
        {
          t: "tarjetas",
          columnas: 2,
          items: [
            {
              titulo: { es: "PvE · 4 Protección + 4 Castigo", en: "PvE · 4 Protection + 4 Punishment" },
              sub: { es: "2.057 de 6.156 — el reparto más común con diferencia", en: "2,057 out of 6,156 — the most common split by a mile" },
              puntos: [
                { es: "**Castigo** (징벌 서곡) — 2 piezas: +5% de aguante contra jefes · 4 piezas: +60 de ataque PvE y **+10% de amplificación de daño PvE con la vida por encima del 70%**", en: "**Punishment** (징벌 서곡) — 2 pieces: +5% boss damage tolerance · 4 pieces: +60 PvE attack and **+10% PvE damage amplification while above 70% HP**" },
                { es: "**Protección** (수호받는 영혼) — 2 piezas: +5% de regeneración · 4 piezas: **+5% de amplificación de daño de arma** y un escudo de 10.000 al bajar del 30% de vida", en: "**Protection** (수호받는 영혼) — 2 pieces: +5% regeneration · 4 pieces: **+5% weapon damage amplification** and a 10,000 shield when you drop below 30% HP" },
                { es: "Segundo más visto: 4 Castigo + 2 Protección (811)", en: "Second most seen: 4 Punishment + 2 Protection (811)" },
              ],
              nota: { es: "El cáliz casi siempre es de Protección (94,6%); campana, espejo y balanza casi siempre de Castigo (82-85%).", en: "The chalice is nearly always Protection (94.6%); bell, mirror and scales nearly always Punishment (82-85%)." },
            },
            {
              titulo: { es: "PvP · 4 Protección + 4 Firmeza", en: "PvP · 4 Protection + 4 Indomitability" },
              sub: { es: "237 de 950 — aquí el reparto cambia de verdad", en: "237 out of 950 — here the split genuinely changes" },
              puntos: [
                { es: "**Firmeza** (불굴의 집념) — 2 piezas: +5% de resistencia al daño de arma · 4 piezas: +5% de resistencia al daño crítico y **+50% de aguante PvP durante 5 s al recibir un control** (recarga 2 min 30 s)", en: "**Indomitability** (불굴의 집념) — 2 pieces: +5% weapon damage tolerance · 4 pieces: +5% critical damage tolerance and **+50% PvP damage tolerance for 5s when hit by crowd control** (2m30s cooldown)" },
                { es: "El resto de repartos de PvP van muy repartidos: no hay un estándar como en PvE", en: "The rest of the PvP splits are all over the place: there is no PvE-style standard" },
              ],
              nota: { es: "El efecto de 4 piezas de Firmeza es literalmente la respuesta al «no me matan por vida, me matan aturdido».", en: "The 4-piece Indomitability effect is literally the answer to «they do not kill me with damage, they kill me stunned»." },
            },
          ],
        },
        {
          t: "aviso",
          parrafos: [
            {
              es: "**Los grabados de dioses del brazalete son casi obligatorios.** Cuatro los lleva prácticamente todo el mundo: Tiempo (시엘, 99,8%), Destrucción (지켈, 99,8%), Sabiduría (루미엘, 98,0%) e Ilusión (카이시넬, 92,4%). El quinto —Justicia (네자칸, 79,0%)— es el que separa al Templar del Gladiator, y en PvP se desploma al 37% para dejarle sitio a Libertad (바이젤), que sube al 82%.",
              en: "**The bracelet's god engravings are near-mandatory.** Four are all but universal: Time (시엘, 99.8%), Destruction (지켈, 99.8%), Wisdom (루미엘, 98.0%) and Illusion (카이시넬, 92.4%). The fifth —Justice (네자칸, 79.0%)— is what sets the Templar apart from the Gladiator, and in PvP it collapses to 37% to make room for Freedom (바이젤), which climbs to 82%.",
            },
            {
              es: "**Antes de gastar nada,** mira de dónde viene cada nivel: al pulsar una skill, la flecha que sale junto al número te enseña qué parte pone el Daevanion, qué parte el anillo y qué parte la carta. Así sabes exactamente cuál te falta y no compras dos veces lo mismo.",
              en: "**Before spending anything,** check where each level comes from: clicking a skill shows an arrow next to the number that breaks down what Daevanion, the ring and the card each contribute. That way you know exactly which one you are short on and never buy the same thing twice.",
            },
          ],
        },
      ],
    },

    // ── 5. La build (cambia con el modo) ────────────────────────
    {
      eyebrow: { es: "La build", en: "The build" },
      titulo: { es: "Qué skills subir", en: "Which skills to level" },
      intro: [
        {
          es: "Aquí es donde PvE y PvP se separan de verdad. Cambia el modo y cambian las prioridades:",
          en: "This is where PvE and PvP really part ways. Switch the mode and the priorities change:",
        },
      ],
      bloques: [],
      porModo: {
        pve: [
          {
            t: "skills",
            items: [
              {
                orden: { es: "1.ª · 88,5%", en: "1st · 88.5%" },
                nombre: { es: "Juicio", en: "Judgment" },
                ko: "심판",
                icono: `${ICO}ICON_TE_SKILL_004.webp`,
                puntos: [
                  { es: "**El daño de la clase entera pasa por aquí.** Nueve de cada diez Templars la tienen a 20", en: "**The class's entire damage runs through this.** Nine out of ten Templars have it at 20" },
                  { es: "A nivel 16 **se queda sin tiempo de recarga**", en: "At level 16 it **loses its cooldown entirely**" },
                  { es: "Genera hostilidad, así que es también tu motor de agro", en: "It builds enmity, so it is your aggro engine too" },
                  { es: "Se activa con Golpe de escudo, Golpe protector, Carga de escudo y Escudo de perdición", en: "It is triggered by Shield Smite, Warding Strike, Shield Rush and Doom Shield" },
                ],
              },
              {
                orden: { es: "2.ª · 76,5%", en: "2nd · 76.5%" },
                nombre: { es: "Golpe feroz", en: "Vicious Strike" },
                ko: "맹렬한 일격",
                icono: `${ICO}ICON_TE_SKILL_001.webp`,
                puntos: [
                  { es: "Recupera **100 de espíritu** por uso — es lo que te mantiene con recurso", en: "Restores **100 MP** per use — it is what keeps your resource up" },
                  { es: "Genera hostilidad en hasta 4 enemigos", en: "Builds enmity on up to 4 enemies" },
                  { es: "A nivel 16 añade la cadena **Embate amenazante**", en: "At level 16 it adds the **Threatening Blow** chain skill" },
                  { es: "Ojo: con el ciclo actual ha perdido peso — hay quien ya no la sube a 20", en: "Careful: with the current cycle it has lost weight — some players no longer take it to 20" },
                ],
              },
              {
                orden: { es: "3.ª · 76,0%", en: "3rd · 76.0%" },
                nombre: { es: "Aporreo continuo", en: "Pummel" },
                ko: "연속 난타",
                icono: `${ICO}ICON_TE_SKILL_006.webp`,
                puntos: [
                  { es: "El otro medio del ciclo: **es la que se encadena con el Juicio**", en: "The other half of the cycle: **it is what chains with Judgment**" },
                  { es: "A nivel 12 le quita **1 segundo de recarga al Golpe protector** al acertar el Golpe punitivo", en: "At level 12 it cuts **1 second off Warding Strike's cooldown** when Punishing Strike lands" },
                  { es: "A nivel 16 activa el **Golpe punitivo una vez más**", en: "At level 16 it triggers **Punishing Strike one extra time**" },
                  { es: "Genera hostilidad en hasta 4 enemigos", en: "Builds enmity on up to 4 enemies" },
                ],
              },
              {
                orden: { es: "4.ª · 43,9%", en: "4th · 43.9%" },
                nombre: { es: "Castigo", en: "Punishment" },
                ko: "징벌",
                icono: `${ICO}ICON_TE_SKILL_009.webp`,
                puntos: [
                  { es: "**Tu golpe grande: 1.174-3.523 según la carga**, hasta 3 niveles", en: "**Your big hit: 1,174-3,523 depending on charge**, up to 3 charge levels" },
                  { es: "Deja **Ejecutor** 10 s: +200 de precisión, +20% de daño PvE, +10% de daño PvP", en: "Leaves **Executor** for 10s: +200 accuracy, +20% PvE damage, +10% PvP damage" },
                  { es: "20 m de alcance: **es con lo que abres antes de pegarte al jefe**", en: "20m range: **it is what you open with before closing on the boss**" },
                  { es: "Solo la mitad de la clase la lleva a 20 — la otra mitad se queda en 16", en: "Only half the class takes it to 20 — the other half stops at 16" },
                ],
              },
              {
                orden: { es: "5.ª · 28,1%", en: "5th · 28.1%" },
                nombre: { es: "Golpe protector", en: "Warding Strike" },
                ko: "비호의 일격",
                icono: `${ICO}ICON_TE_SKILL_035.webp`,
                puntos: [
                  { es: "**No se sube por lo que cura, sino porque activa el Juicio**", en: "**You do not level it for the healing, but because it activates Judgment**" },
                  { es: "Da **Amparo** 10 s: +20% de aguante PvE y +10% PvP", en: "Grants **Warding** for 10s: +20% PvE and +10% PvP damage tolerance" },
                  { es: "A nivel 16 **reparte +10% de aguante PvE al grupo entero**", en: "At level 16 it **hands +10% PvE damage tolerance to the whole party**" },
                  { es: "Va en la línea del clic derecho, dos segundos después del Juicio", en: "It sits on the right-click line, two seconds after Judgment" },
                ],
              },
              {
                orden: { es: "Discutida · 2,6%", en: "Contested · 2.6%" },
                nombre: { es: "Aniquilación", en: "Annihilate" },
                ko: "섬멸",
                icono: `${ICO}ICON_TE_SKILL_028.webp`,
                puntos: [
                  { es: "**719 de daño**, el golpe más fuerte por impacto que tienes", en: "**719 damage**, the biggest per-hit number you have" },
                  { es: "A nivel 8 puede darle **+100% de daño a los enemigos inmunes al control** — o sea, a los jefes", en: "At level 8 it can deal **+100% damage to control-immune targets** — that is, bosses" },
                  { es: "**En el muñeco baja tus golpes** (la animación es larga y te come Juicios)", en: "**On the dummy it lowers your hit count** (the long animation eats Judgments)" },
                  { es: "**En mazmorra real sube el pico**, porque solo tienes 10-20 s libres por minuto", en: "**In a real dungeon it raises your peak**, because you only get 10-20 free seconds a minute" },
                ],
              },
            ],
          },
          { t: "parrafo", texto: { es: "**Y así se reparten en las cartas:**", en: "**And this is how they split across the cards:**" } },
          {
            t: "tarjetas",
            columnas: 3,
            items: [
              {
                titulo: { es: "Pergamino", en: "Parchment" },
                sub: { es: "Aquí van los golpes", en: "The hits go here" },
                ordenada: true,
                puntos: [
                  { es: "**Juicio a +4** — es la prioridad absoluta", en: "**Judgment to +4** — the absolute priority" },
                  { es: "Castigo o Golpe feroz de segunda", en: "Punishment or Vicious Strike as the second" },
                ],
                nota: { es: "De las tres (Castigo, Juicio, Golpe feroz), con una a +4 ya vas servido. Bloquea la carta y a otra cosa.", en: "Out of the three (Punishment, Judgment, Vicious Strike), one at +4 is enough. Lock the card and move on." },
              },
              {
                titulo: { es: "Brújula", en: "Compass" },
                sub: { es: "Aquí va el ciclo", en: "The cycle goes here" },
                ordenada: true,
                puntos: [
                  { es: "**Aporreo continuo a +4**", en: "**Pummel to +4**" },
                  { es: "Golpe protector o Golpe de escudo detrás", en: "Warding Strike or Shield Smite behind it" },
                ],
                nota: { es: "El Aporreo es el que se encadena con el Juicio: sin él el ciclo no existe.", en: "Pummel is what chains with Judgment: without it there is no cycle." },
              },
              {
                titulo: { es: "Campana, espejo y cáliz", en: "Bell, mirror and chalice" },
                sub: { es: "Aquí van las pasivas", en: "The passives go here" },
                ordenada: true,
                puntos: [
                  { es: "**Campana: Furia a +3 o más**", en: "**Bell: Fury to +3 or more**" },
                  { es: "**Espejo: Impacto certero a +3 o más**", en: "**Mirror: Impact Hit to +3 or more**" },
                  { es: "Cáliz y balanza: la activa que te falte para llegar a 20, y Rugido insultante", en: "Chalice and scales: whichever active you are short on for level 20, plus Insulting Roar" },
                ],
                nota: { es: "El cáliz mezcla pasivas con activas: la probabilidad de que salga limpio es baja. No quemes recursos en el primero.", en: "The chalice mixes passives with actives: the odds of a clean roll are low. Do not burn resources on your first one." },
              },
            ],
          },
        ],
        pvp: [
          {
            t: "skills",
            items: [
              {
                orden: { es: "Prioridad 0 · 60%", en: "Priority 0 · 60%" },
                nombre: { es: "Juicio", en: "Judgment" },
                ko: "심판",
                icono: `${ICO}ICON_TE_SKILL_004.webp`,
                puntos: [
                  { es: "Sigue siendo la primera, pero ya no por goleada: en PvP la graba el 60%, no el 68%", en: "Still first, but no longer by a landslide: 60% engrave it in PvP, not 68%" },
                  { es: "En cerco conviene llevarla en área para rematar", en: "In siege it is worth running it as an area attack to finish people off" },
                ],
              },
              {
                orden: { es: "Prioridad 0 · 47%", en: "Priority 0 · 47%" },
                nombre: { es: "Carga de escudo", en: "Shield Rush" },
                ko: "방패 돌격",
                icono: `${ICO}ICON_TE_SKILL_015.webp`,
                puntos: [
                  { es: "**Sube del 8,7% en PvE al 47% en PvP.** Es el mayor salto de toda la clase", en: "**Goes from 8.7% in PvE to 47% in PvP.** The biggest jump in the entire class" },
                  { es: "10 m de carga + **30% de aturdimiento** — es alcanzar al que huye", en: "10m charge + **30% stun chance** — this is how you catch the runner" },
                  { es: "A nivel 8 puede sumar **+10 m de alcance** o pasar a golpear en área", en: "At level 8 it can add **+10m range** or become an area attack" },
                ],
              },
              {
                orden: { es: "3.ª · 45%", en: "3rd · 45%" },
                nombre: { es: "Golpe feroz", en: "Vicious Strike" },
                ko: "맹렬한 일격",
                icono: `${ICO}ICON_TE_SKILL_001.webp`,
                puntos: [
                  { es: "El relleno que te sostiene el espíritu durante una pelea larga", en: "The filler that keeps your MP alive through a long fight" },
                  { es: "Mantiene su sitio casi igual que en PvE", en: "Holds nearly the same place as in PvE" },
                ],
              },
              {
                orden: { es: "4.ª · 42%", en: "4th · 42%" },
                nombre: { es: "Liberación de impacto", en: "Defiance" },
                ko: "충격 해제",
                icono: `${ICO}ICON_CO_SKILL_002.webp`,
                puntos: [
                  { es: "**Del 8,4% en PvE al 42% en PvP.** Quita aturdimiento, derribo, aéreo, agarre, congelación y miedo", en: "**From 8.4% in PvE to 42% in PvP.** Removes stun, knockdown, airborne, grab, frost and fear" },
                  { es: "Deja **Tenacidad**: inmunidad a estados alterados durante 5 s", en: "Leaves **Tenacity**: status effect immunity for 5s" },
                  { es: "A nivel 16 añade **+50% de aguante PvE y +25% PvP** mientras dura", en: "At level 16 it adds **+50% PvE and +25% PvP damage tolerance** for the duration" },
                  { es: "**No cojas la especialización 1 en PvE**: la cadena te deja clavado", en: "**Do not take specialty 1 in PvE**: the chain roots you in place" },
                ],
              },
              {
                orden: { es: "5.ª · 37%", en: "5th · 37%" },
                nombre: { es: "Enganche", en: "Poach" },
                ko: "포획",
                icono: `${ICO}ICON_TE_SKILL_013.webp`,
                puntos: [
                  { es: "**Del 0% en PvE al 37% en PvP.** Atrae al objetivo y lo enraíza 2 s", en: "**From 0% in PvE to 37% in PvP.** Pulls the target and roots it for 2s" },
                  { es: "A nivel 12 te da un **escudo del 10% de tu vida máxima**", en: "At level 12 it gives you a **shield worth 10% of your max HP**" },
                  { es: "A nivel 16, **50% de aturdir 3 s**", en: "At level 16, **50% chance to stun for 3s**" },
                ],
              },
              {
                orden: { es: "Y baja", en: "And drops" },
                nombre: { es: "Castigo", en: "Punishment" },
                ko: "징벌",
                icono: `${ICO}ICON_TE_SKILL_009.webp`,
                puntos: [
                  { es: "**Del 59,5% en PvE al 22% en PvP.** Cargarla delante de un jugador es regalarle el tiempo", en: "**From 59.5% in PvE to 22% in PvP.** Charging it in front of a player is handing them free time" },
                  { es: "Lo mismo con el Golpe protector: del 38,8% al 22%", en: "Same with Warding Strike: from 38.8% to 22%" },
                ],
              },
            ],
          },
          {
            t: "aviso",
            parrafos: [
              {
                es: "**Bloqueo o puntería: en PvP hay que elegir, y no es lo mismo según con quién pelees.** El bloqueo brilla en duelo y en peleas pequeñas, donde cambias aguante PvP por defensa. La puntería brilla en cerco, campo de batalla y guerra de grupos — pero en duelo, con dos o tres encima, te quedas sin nada que hacer. Quien lo ha probado lo resume así: en grupo la puntería es divertidísima; solo, es deprimente.",
                en: "**Block or hit: in PvP you have to choose, and it depends who you are fighting.** Block shines in duels and small skirmishes, where you trade PvP tolerance for defence. Hit shines in siege, battlegrounds and group war — but in a duel, with two or three on you, you have nothing left. The player who tested both puts it like this: in a group, hit is enormous fun; alone, it is depressing.",
              },
            ],
          },
        ],
      },
    },

    // ── 6. Orden de subida ──────────────────────────────────────
    {
      eyebrow: { es: "El orden", en: "The order" },
      titulo: { es: "En qué orden subirlas", en: "What to level first" },
      intro: [
        {
          es: "Repartir puntos entre muchas skills es el error que más frena. Esta tabla no es una recomendación: es **hasta dónde llegó de verdad cada skill en 6.287 Templars**, y el embudo se ve solo.",
          en: "Spreading points across many skills is the mistake that slows people down most. This table is not a recommendation: it is **how far each skill actually got across 6,287 Templars**, and the funnel speaks for itself.",
        },
      ],
      bloques: [
        {
          t: "tabla",
          cabeceras: [
            { es: "Skill", en: "Skill" },
            { es: "Llega a 12", en: "Reaches 12" },
            { es: "Llega a 16", en: "Reaches 16" },
            { es: "Llega a 20", en: "Reaches 20" },
          ],
          filas: [
            [{ es: "**Juicio**", en: "**Judgment**" }, { es: "97,7%", en: "97.7%" }, { es: "95,6%", en: "95.6%" }, { es: "**88,5%**", en: "**88.5%**" }],
            [{ es: "**Golpe feroz**", en: "**Vicious Strike**" }, { es: "97,8%", en: "97.8%" }, { es: "93,2%", en: "93.2%" }, { es: "**76,5%**", en: "**76.5%**" }],
            [{ es: "**Aporreo continuo**", en: "**Pummel**" }, { es: "97,9%", en: "97.9%" }, { es: "92,2%", en: "92.2%" }, { es: "**76,0%**", en: "**76.0%**" }],
            [{ es: "Castigo", en: "Punishment" }, { es: "97,2%", en: "97.2%" }, { es: "80,9%", en: "80.9%" }, { es: "43,9%", en: "43.9%" }],
            [{ es: "Golpe protector", en: "Warding Strike" }, { es: "97,5%", en: "97.5%" }, { es: "83,6%", en: "83.6%" }, { es: "28,1%", en: "28.1%" }],
            [{ es: "Carga de escudo", en: "Shield Rush" }, { es: "94,4%", en: "94.4%" }, { es: "46,4%", en: "46.4%" }, { es: "12,5%", en: "12.5%" }],
            [{ es: "Liberación de impacto", en: "Defiance" }, { es: "82,1%", en: "82.1%" }, { es: "30,5%", en: "30.5%" }, { es: "8,4%", en: "8.4%" }],
            [{ es: "Enganche", en: "Poach" }, { es: "96,0%", en: "96.0%" }, { es: "36,3%", en: "36.3%" }, { es: "4,9%", en: "4.9%" }],
            [{ es: "Golpe de escudo", en: "Shield Smite" }, { es: "93,9%", en: "93.9%" }, { es: "39,0%", en: "39.0%" }, { es: "3,1%", en: "3.1%" }],
            [{ es: "Embate debilitador", en: "Debilitating Smash" }, { es: "92,6%", en: "92.6%" }, { es: "31,5%", en: "31.5%" }, { es: "2,7%", en: "2.7%" }],
            [{ es: "Aniquilación", en: "Annihilate" }, { es: "85,2%", en: "85.2%" }, { es: "24,2%", en: "24.2%" }, { es: "2,6%", en: "2.6%" }],
            [{ es: "Danza de destellos", en: "Flash Rampage" }, { es: "37,9%", en: "37.9%" }, { es: "16,7%", en: "16.7%" }, { es: "1,0%", en: "1.0%" }],
          ],
        },
        {
          t: "parrafo",
          texto: {
            es: "**Léelo así: hasta 12 sube casi todo, y a partir de ahí el embudo se cierra.** De doce skills, solo tres pasan del 70% a nivel 20 — Juicio, Golpe feroz y Aporreo continuo. Ese es el orden. Después va Castigo, y después Golpe protector, que se sube por activar el Juicio y no por lo que hace él.",
            en: "**Read it like this: nearly everything goes to 12, and from there the funnel closes.** Out of twelve skills only three clear 70% at level 20 — Judgment, Vicious Strike and Pummel. That is your order. After that comes Punishment, and then Warding Strike, which you level to activate Judgment and not for what it does itself.",
          },
        },
        {
          t: "aviso",
          parrafos: [
            {
              es: "**El Juicio va primero siempre, y a distancia.** Es tu daño, tu hostilidad y el eje de la macro. Todo lo demás en el árbol existe para volver a activarlo.",
              en: "**Judgment always comes first, and by a distance.** It is your damage, your enmity and the axis of the macro. Everything else in the tree exists to switch it back on.",
            },
            {
              es: "**Y ojo con el Golpe feroz.** Lleva años siendo la segunda, pero con el ciclo actual varios jugadores de cabeza dicen que ya vale menos que una skill de relleno y que no hace falta llevarla a 20. Si la tienes ya subida, no toques nada; si estás empezando, mete esos recursos en Castigo.",
              en: "**And watch Vicious Strike.** It has been second for a long time, but with the current cycle several top players say it is now worth less than a filler skill and does not need level 20. If yours is already there, leave it alone; if you are starting out, put those resources into Punishment.",
            },
          ],
        },
      ],
    },

    // ── 7. Especializaciones ────────────────────────────────────
    {
      eyebrow: { es: "Especializaciones", en: "Specialties" },
      titulo: { es: "Lo que desbloquea cada skill", en: "What each skill unlocks" },
      intro: [
        {
          es: "Subir una skill no solo le sube el número: a **nivel 8, 12 y 16** cada una desbloquea efectos que le cambian el comportamiento. Pero **no te los llevas todos** — cada skill tiene **tres ranuras** de especialización, y la tercera está cerrada hasta el nivel 16. Eliges qué metes en cada una y lo que dejes fuera se queda apagado.",
          en: "Levelling a skill does more than raise its number: at **levels 8, 12 and 16** each one unlocks effects that change how it behaves. But **you do not get them all** — each skill has **three specialty slots**, and the third stays locked until level 16. You choose what goes in each one, and whatever you leave out stays dark.",
        },
        {
          es: "Los efectos y los niveles salen del volcado del cliente del juego, así que son exactos. La marca **✓** señala lo que recomienda esta guía, cruzando dos montajes públicos del tablón coreano; el porcentaje de la derecha es otra cosa: **cuántos de los 538 Templars medidos graban esa skill en el anillo**.",
          en: "The effects and levels come from the game client dump, so they are exact. The **✓** marks what this guide recommends, cross-referenced from two public setups on the Korean board; the percentage on the right is a different thing: **how many of the 538 measured Templars engrave that skill on their ring**.",
        },
      ],
      bloques: [
        {
          t: "especialidades",
          items: [
            {
              nombre: { es: "Juicio", en: "Judgment" },
              ko: "심판",
              icono: `${ICO}ICON_TE_SKILL_004.webp`,
              anillo: 68.2,
              nota: { es: "**La más grabada, y la única con consenso total: 345.** Es la misma elección desde hace meses y nadie la discute.", en: "**The most engraved, and the only one with total consensus: 345.** It has been the same pick for months and nobody argues." },
              opciones: [
                { nivel: 8, alternativa: true, efecto: { es: "Roba un 1% de vida", en: "Absorbs 1% HP" } },
                { nivel: 8, alternativa: true, efecto: { es: "Daño extra contra enemigos con estado de impacto", en: "Extra damage against targets afflicted with an Impact-type status" } },
                { nivel: 8, alternativa: true, recomendada: true, efecto: { es: "Daño extra al acertar", en: "Extra damage on hit" } },
                { nivel: 12, recomendada: true, efecto: { es: "Crítico garantizado al acertar", en: "Guaranteed critical hit on hit" } },
                { nivel: 16, recomendada: true, efecto: { es: "**Le quita el tiempo de recarga**", en: "**Removes the cooldown**" } },
              ],
            },
            {
              nombre: { es: "Aporreo continuo", en: "Pummel" },
              ko: "연속 난타",
              icono: `${ICO}ICON_TE_SKILL_006.webp`,
              anillo: 66.7,
              nota: { es: "Si de verdad necesitas robo de vida, **métela aquí y no en el Juicio**: cuesta mucho menos daño.", en: "If you genuinely need lifesteal, **put it here and not on Judgment**: it costs far less damage." },
              opciones: [
                { nivel: 8, alternativa: true, efecto: { es: "−20% de espíritu consumido", en: "−20% MP consumed" } },
                { nivel: 8, alternativa: true, efecto: { es: "El Golpe punitivo roba un 3% de vida", en: "[Punishing Strike] absorbs 3% HP" } },
                { nivel: 8, alternativa: true, recomendada: true, efecto: { es: "Hasta +12% de daño cuantos menos enemigos haya", en: "Up to +12% damage the fewer targets you hit" } },
                { nivel: 12, recomendada: true, efecto: { es: "**−1 s de recarga al Golpe protector** al acertar el Golpe punitivo", en: "**−1s Warding Strike cooldown** on landing Punishing Strike" } },
                { nivel: 16, recomendada: true, efecto: { es: "Activa el **Golpe punitivo una vez más**", en: "Activates **Punishing Strike one extra time**" } },
              ],
            },
            {
              nombre: { es: "Golpe feroz", en: "Vicious Strike" },
              ko: "맹렬한 일격",
              icono: `${ICO}ICON_TE_SKILL_001.webp`,
              anillo: 66.7,
              nota: { es: "**Aquí ha cambiado el consenso.** Antes 345 (golpes múltiples); ahora el robo de vida vale más que el daño extra, así que 245.", en: "**The consensus moved here.** It used to be 345 (multi-hit); now the lifesteal is worth more than the extra damage, so 245." },
              opciones: [
                { nivel: 8, alternativa: true, efecto: { es: "+20% de espíritu recuperado", en: "+20% MP restored" } },
                { nivel: 8, alternativa: true, recomendada: true, efecto: { es: "Roba un 1% de vida", en: "Absorbs 1% HP" } },
                { nivel: 8, alternativa: true, efecto: { es: "+50% de golpes múltiples al acertar", en: "+50% Multi-Hit on hit" } },
                { nivel: 12, recomendada: true, efecto: { es: "**−1 s de recarga al Castigo** al acertar", en: "**−1s Punishment cooldown** on hit" } },
                { nivel: 16, recomendada: true, efecto: { es: "Añade la cadena **Embate amenazante**", en: "Adds the **Threatening Blow** chain skill" } },
              ],
            },
            {
              nombre: { es: "Castigo", en: "Punishment" },
              ko: "징벌",
              icono: `${ICO}ICON_TE_SKILL_009.webp`,
              anillo: 59.5,
              nota: { es: "A nivel 16 se lleva 34; si llegas a 20, 345. El robo de vida del 10% suena enorme, pero con el ciclo actual apenas se nota.", en: "At level 16 take 34; if you reach 20, 345. The 10% lifesteal sounds huge, but with the current cycle you barely feel it." },
              opciones: [
                { nivel: 8, alternativa: true, efecto: { es: "Roba un 10% de vida", en: "Absorbs 10% HP" } },
                { nivel: 8, alternativa: true, efecto: { es: "Deja daño en el tiempo al acertar", en: "Inflicts damage over time on hit" } },
                { nivel: 8, alternativa: true, recomendada: true, efecto: { es: "**+30% de velocidad de skill**", en: "**+30% skill speed**" } },
                { nivel: 12, recomendada: true, efecto: { es: "Se puede usar en movimiento", en: "Becomes usable while moving" } },
                { nivel: 16, recomendada: true, efecto: { es: "**Ignora bloqueo y evasión y entra como crítico**", en: "**Ignores block and evasion and lands as a critical hit**" } },
              ],
            },
            {
              nombre: { es: "Golpe protector", en: "Warding Strike" },
              ko: "비호의 일격",
              icono: `${ICO}ICON_TE_SKILL_035.webp`,
              anillo: 38.8,
              nota: { es: "**Se lleva por la recarga, no por la curación.** Hay que poder lanzarlo cada vez que esté listo, porque es lo que reactiva el Juicio.", en: "**You take it for the cooldown, not the healing.** You need to fire it every time it is up, because it is what re-enables Judgment." },
              opciones: [
                { nivel: 8, alternativa: true, recomendada: true, efecto: { es: "**−5 s de tiempo de recarga**", en: "**−5s cooldown**" } },
                { nivel: 8, alternativa: true, efecto: { es: "+100 de bloqueo mientras dura Amparo", en: "+100 block during Warding" } },
                { nivel: 8, alternativa: true, efecto: { es: "Curación continua mientras dura Amparo", en: "Heal over time during Warding" } },
                { nivel: 12, efecto: { es: "Amparo da más aguante cuantos más enemigos alcances", en: "Warding gives more damage tolerance the more targets you hit" } },
                { nivel: 16, recomendada: true, efecto: { es: "**+10% de aguante PvE al grupo** al usarlo", en: "**+10% PvE damage tolerance to party members** on use" } },
              ],
            },
            {
              nombre: { es: "Golpe de escudo", en: "Shield Smite" },
              ko: "방패 강타",
              icono: `${ICO}ICON_TE_SKILL_010.webp`,
              anillo: 8.2,
              nota: { es: "**Casi nadie lo graba en el anillo y aun así lo lleva todo el mundo en la macro.** Es lo que reactiva el Juicio: las dos especializaciones marcadas son obligatorias.", en: "**Almost nobody engraves it on the ring, and yet everyone runs it in the macro.** It is what re-triggers Judgment: both marked specialties are mandatory." },
              opciones: [
                { nivel: 8, alternativa: true, efecto: { es: "+1 s de aturdimiento", en: "+1s stun duration" } },
                { nivel: 8, alternativa: true, recomendada: true, efecto: { es: "**Deja de costar espíritu y recupera 200** al acertar", en: "**Removes the MP cost and restores 200 MP** on hit" } },
                { nivel: 8, alternativa: true, efecto: { es: "50% de activar el Embate debilitador al acertar", en: "50% chance to trigger Debilitating Smash on hit" } },
                { nivel: 12, recomendada: true, efecto: { es: "**−2 s de tiempo de recarga**", en: "**−2s cooldown**" } },
                { nivel: 16, efecto: { es: "El aturdimiento pasa a ser en área", en: "The stun becomes an area effect" } },
              ],
            },
            {
              nombre: { es: "Carga de escudo", en: "Shield Rush" },
              ko: "방패 돌격",
              icono: `${ICO}ICON_TE_SKILL_015.webp`,
              anillo: 8.7,
              nota: { es: "Una de las dos que sí se pulsan a mano. El aguante que devuelve vale mucho, así que 14 es tan buena como 24.", en: "One of the two you actually press by hand. The stamina it gives back is worth a lot, so 14 is as good as 24." },
              opciones: [
                { nivel: 8, alternativa: true, recomendada: true, efecto: { es: "Recupera **300 de aguante** al acertar", en: "Restores **300 stamina** on hit" } },
                { nivel: 8, alternativa: true, efecto: { es: "+10 m de alcance", en: "+10m range" } },
                { nivel: 8, alternativa: true, efecto: { es: "Pasa a ser una carga y golpea en área", en: "Becomes a charge skill and deals area damage" } },
                { nivel: 12, recomendada: true, efecto: { es: "**−10 s de tiempo de recarga**", en: "**−10s cooldown**" } },
                { nivel: 16, efecto: { es: "+25% de probabilidad de aturdir", en: "+25% stun chance" } },
              ],
            },
            {
              nombre: { es: "Aniquilación", en: "Annihilate" },
              ko: "섬멸",
              icono: `${ICO}ICON_TE_SKILL_028.webp`,
              anillo: 13.2,
              nota: { es: "Si la subes a 20, 134. Es la única skill de la clase con **+100% de daño contra un jefe** — y contra un jefe es donde estás siempre.", en: "If you take it to 20, go 134. It is the only skill in the class with **+100% damage against a boss** — and a boss is where you always are." },
              opciones: [
                { nivel: 8, alternativa: true, recomendada: true, efecto: { es: "+50% de golpes múltiples al acertar", en: "+50% Multi-Hit on hit" } },
                { nivel: 8, alternativa: true, efecto: { es: "+20% de probabilidad de derribo", en: "+20% knockdown chance" } },
                { nivel: 8, alternativa: true, recomendada: true, efecto: { es: "**+100% de daño contra enemigos inmunes al control**", en: "**+100% damage against control-immune targets**" } },
                { nivel: 12, recomendada: true, efecto: { es: "**−10 s de tiempo de recarga**", en: "**−10s cooldown**" } },
                { nivel: 16, efecto: { es: "Pasa a golpear en área", en: "Changes to an area skill" } },
              ],
            },
            {
              nombre: { es: "Liberación de impacto", en: "Defiance" },
              ko: "충격 해제",
              icono: `${ICO}ICON_CO_SKILL_002.webp`,
              nota: { es: "**En PvE no cojas la primera nunca**: la cadena que añade te deja clavado en el sitio y pierdes más de lo que ganas.", en: "**In PvE never take the first one**: the chain it adds roots you in place and you lose more than you gain." },
              opciones: [
                { nivel: 8, alternativa: true, efecto: { es: "Añade la cadena [Captura]", en: "Adds the [Capture] chain skill" } },
                { nivel: 8, alternativa: true, efecto: { es: "Recupera 1.000 de aguante al usarla", en: "Restores 1,000 stamina on use" } },
                { nivel: 8, alternativa: true, recomendada: true, efecto: { es: "Recupera un **20% de vida** al usarla", en: "Restores **20% HP** on use" } },
                { nivel: 12, efecto: { es: "+2 s de Tenacidad", en: "+2s Tenacity duration" } },
                { nivel: 16, recomendada: true, efecto: { es: "**+50% de aguante PvE y +25% PvP** mientras dura la Tenacidad", en: "**+50% PvE and +25% PvP damage tolerance** for the Tenacity duration" } },
              ],
            },
            {
              nombre: { es: "Danza de destellos", en: "Flash Rampage" },
              ko: "섬광 난무",
              icono: `${ICO}ICON_GL_SKILL_027.webp`,
              nota: { es: "**La olvidada que en expedición y trascendencia sí vale.** Se cancela durante el groggy, baja la recarga del Estandarte y devuelve espíritu.", en: "**The forgotten one that does pay off in expedition and transcendence.** It cancels during groggy, cuts the Banner's cooldown and gives MP back." },
              opciones: [
                { nivel: 8, alternativa: true, recomendada: true, efecto: { es: "Roba un 5% de vida", en: "Absorbs 5% HP" } },
                { nivel: 8, alternativa: true, efecto: { es: "Recupera 120 de espíritu al acertar", en: "Restores 120 MP on hit" } },
                { nivel: 8, alternativa: true, efecto: { es: "Se puede usar en movimiento", en: "Becomes usable while moving" } },
                { nivel: 12, efecto: { es: "Golpes múltiples al acertar", en: "Multi-Hit on hit" } },
                { nivel: 16, recomendada: true, efecto: { es: "**−1 s a todas tus recargas** al acertar", en: "**−1s to all your cooldowns** on hit" } },
              ],
            },
            {
              nombre: { es: "Enganche", en: "Poach" },
              ko: "포획",
              icono: `${ICO}ICON_TE_SKILL_013.webp`,
              nota: { es: "**En PvE es cuestión de gusto; en PvP es de las que más suben.** El escudo del nivel 12 es lo que la salva.", en: "**In PvE it is down to taste; in PvP it is one of the biggest risers.** The level-12 shield is what saves it." },
              opciones: [
                { nivel: 8, alternativa: true, efecto: { es: "Te desplaza hasta el objetivo si es inmune al control", en: "Moves you to the target if it has incapacitated immunity" } },
                { nivel: 8, alternativa: true, efecto: { es: "−20% de resistencia a estados alterados durante 5 s", en: "−20% status effect resist for 5s on hit" } },
                { nivel: 8, alternativa: true, efecto: { es: "Reinicia su recarga al matar a un enemigo", en: "Resets its cooldown on defeating an enemy" } },
                { nivel: 12, recomendada: true, efecto: { es: "**Escudo del 10% de tu vida máxima**", en: "**Protective shield worth 10% of max HP**" } },
                { nivel: 16, recomendada: true, efecto: { es: "50% de probabilidad de aturdir 3 s", en: "50% chance to stun for 3s" } },
              ],
            },
            {
              nombre: { es: "Embate debilitador", en: "Debilitating Smash" },
              ko: "쇠약의 맹타",
              icono: `${ICO}ICON_TE_SKILL_025.webp`,
              anillo: 8.2,
              nota: { es: "**La que casi nadie usa, y con razón** — pero su nivel 12 es de lo mejor que tiene la clase escrito en ningún sitio.", en: "**The one almost nobody uses, and fairly so** — but its level 12 is one of the strongest lines written anywhere in the class." },
              opciones: [
                { nivel: 8, alternativa: true, efecto: { es: "30% de probabilidad de aturdir 3 s", en: "30% chance to stun for 3s" } },
                { nivel: 8, alternativa: true, efecto: { es: "+3 s de Debilitación", en: "+3s Debilitate duration" } },
                { nivel: 8, alternativa: true, efecto: { es: "−60% de curación recibida mientras dura la Debilitación", en: "−60% incoming heal during Debilitate" } },
                { nivel: 12, efecto: { es: "**Ignora bloqueo y evasión y entra como golpes múltiples**", en: "**Ignores block and evasion and lands as Multi-Hit**" } },
                { nivel: 16, efecto: { es: "25% de reiniciar su recarga al bloquear", en: "25% chance to reset its cooldown on block" } },
              ],
            },
          ],
        },
        {
          t: "aviso",
          parrafos: [
            {
              es: "**El error que más se repite: meter robo de vida en el Juicio.** Lo dicen dos guías distintas del tablón coreano con las mismas palabras — no te mueres, así que estás pagando daño por nada. Si de verdad te hace falta robo de vida, va en el Aporreo continuo. Y si mueres, el problema no era el robo de vida: era la posición.",
              en: "**The most repeated mistake: putting lifesteal on Judgment.** Two separate guides on the Korean board say it in the same words — you do not die anyway, so you are paying damage for nothing. If you genuinely need lifesteal, it goes on Pummel. And if you are dying, lifesteal was never the problem: positioning was.",
            },
            {
              es: "**Nadie publica el porcentaje de adopción de las especializaciones.** Se puede medir lo que la gente lleva puesto encima, pero no lo que ha elegido dentro de cada skill. Lo único de primera mano son los montajes que publican los propios jugadores de cabeza — de ahí salen los ✓ de arriba, cruzando dos guías de agosto que coinciden en casi todo. Donde no coinciden queda dicho en la nota de la skill.",
              en: "**Nobody publishes adoption rates for specialties.** What people wear can be measured, what they picked inside each skill cannot. The only first-hand material is the setups top players publish themselves — that is where the ✓ marks above come from, cross-referencing two August guides that agree on nearly everything. Where they disagree, the skill's note says so.",
            },
          ],
        },
      ],
    },

    // ── 8. Pasivas y estigmas ───────────────────────────────────
    {
      eyebrow: { es: "Pasivas y estigmas", en: "Passives and stigmas" },
      titulo: { es: "Lo que no se ve pero se nota", en: "What you cannot see but do feel" },
      intro: [
        {
          es: "El orden de abajo no lo hemos decidido nosotros: es **el porcentaje de Templars de élite que graba cada pasiva**, pieza por pieza. Y hay un corte brutal — tres pasivas se llevan todos los huecos y las otras siete casi no existen.",
          en: "The order below is not our call: it is **the percentage of top Templars who engrave each passive**, slot by slot. And there is a brutal cut — three passives take every slot and the other seven barely exist.",
        },
        {
          es: "Las pasivas no aparecen en la barra, pero son la mitad de tu daño y todo tu agro. Y ojo: **se meten como grabados en el equipo** — por eso en la tabla de stats verás nombres de pasivas entre las opciones de cada pieza.",
          en: "Passives never show on your bar, but they are half your damage and all of your aggro. And note: **they slot as engravings on gear** — which is why you will spot passive names among the options for every piece in the stats table.",
        },
      ],
      bloques: [
        {
          t: "skills",
          items: [
            {
              orden: { es: "66 – 70%", en: "66 – 70%" },
              nombre: { es: "Furia", en: "Fury" },
              ko: "격앙",
              icono: `${ICO}ICON_TE_SKILL_Passive_008.webp`,
              puntos: [
                { es: "**La primera en las nueve piezas, sin excepción.** No baja del 66% en ninguna", en: "**First on all nine slots, no exceptions.** It never drops below 66% anywhere" },
                { es: "Al bloquear: **+5,5% de daño PvE durante 20 s para ti y para el grupo**", en: "On block: **+5.5% PvE damage for 20s, for you and the party**" },
                { es: "+0,3% de daño por ataque frontal, siempre encendido", en: "+0.3% front attack damage, always on" },
                { es: "Se desbloquea a nivel 21", en: "Unlocks at level 21" },
              ],
            },
            {
              orden: { es: "51 – 69%", en: "51 – 69%" },
              nombre: { es: "Impacto certero", en: "Impact Hit" },
              ko: "충격 적중",
              icono: `${ICO}ICON_TE_SKILL_Passive_006.webp`,
              puntos: [
                { es: "+11,2% de probabilidad de impacto y +0,3% de doble golpe", en: "+11.2% Impact-type chance and +0.3% double chance" },
                { es: "**Es la segunda medida, pero no la segunda del tablón.** Ver el aviso de abajo", en: "**It is second by measurement, but not second on the board.** See the note below" },
                { es: "Muy alta en accesorios (67-69%) y la primera que cae en el pantalón (51%)", en: "Very high on accessories (67-69%) and the first to go on the legs (51%)" },
                { es: "Se desbloquea a nivel 15", en: "Unlocks at level 15" },
              ],
            },
            {
              orden: { es: "43 – 63%", en: "43 – 63%" },
              nombre: { es: "Rugido insultante", en: "Insulting Roar" },
              ko: "모욕의 포효",
              icono: `${ICO}ICON_TE_SKILL_Passive_007.webp`,
              puntos: [
                { es: "**Dobla toda la hostilidad que generas: +100%.** Es la pasiva que te hace tanque", en: "**Doubles all the enmity you generate: +100%.** This is the passive that makes you a tank" },
                { es: "Y encima: +5,5% de ataque durante 5 s al acertar un ataque frontal", en: "And on top: +5.5% attack for 5s on landing a front attack" },
                { es: "63,1% en el pendiente y 59,3% en el collar; **42,6% en el pantalón**", en: "63.1% on the earring and 59.3% on the necklace; **42.6% on the legs**" },
                { es: "Se desbloquea a nivel 17", en: "Unlocks at level 17" },
              ],
            },
            {
              orden: { es: "0,4 – 23%", en: "0.4 – 23%" },
              nombre: { es: "Bendición condenatoria", en: "Punishing Benediction" },
              ko: "단죄의 가호",
              icono: `${ICO}ICON_TE_SKILL_Passive_003.webp`,
              puntos: [
                { es: "**Solo cabe en los accesorios**: 22,6% en el pendiente, 19,1% en el collar, y prácticamente cero en la armadura", en: "**It only fits on the accessories**: 22.6% on the earring, 19.1% on the necklace, and next to zero on armour" },
                { es: "+100 de crítico, y al acertar deja 10 s de daño extra con un 50% de probabilidad", en: "+100 critical hit, and on landing an attack it leaves 10s of bonus damage with a 50% proc chance" },
                { es: "Se desbloquea a nivel 9", en: "Unlocks at level 9" },
              ],
            },
            {
              orden: { es: "PvP · 29 – 65%", en: "PvP · 29 – 65%" },
              nombre: { es: "Defensa acorazada", en: "Ironclad Defense" },
              ko: "철벽 방어",
              icono: `${ICO}ICON_TE_SKILL_Passive_004.webp`,
              puntos: [
                { es: "**Aquí está el vuelco.** En PvE la graban 2-5 de cada 100; en PvP es la primera de todas las piezas", en: "**Here is the flip.** In PvE 2-5 out of 100 engrave it; in PvP it is first on every single slot" },
                { es: "Es la pasiva que separa los dos montajes: si la ves en un equipo de PvE, está mal", en: "It is the passive that separates the two setups: if you see it on a PvE set, that set is wrong" },
                { es: "Se desbloquea a nivel 11", en: "Unlocks at level 11" },
              ],
            },
            {
              orden: { es: "PvP · 9 – 47%", en: "PvP · 9 – 47%" },
              nombre: { es: "Voluntad de supervivencia", en: "Survival Willpower" },
              ko: "생존 의지",
              icono: `${ICO}ICON_TE_SKILL_Passive_009.webp`,
              puntos: [
                { es: "**+17% de resistencia a estados alterados**, y sube más cada vez que te golpean mientras estás controlado", en: "**+17% status effect resist**, and it stacks further each time you are hit while under crowd control" },
                { es: "+12% de aguante PvE y +6% PvP durante 5 s al caer aturdido, derribado, aéreo, congelado o con miedo", en: "+12% PvE and +6% PvP damage tolerance for 5s when stunned, knocked down, airborne, frozen or feared" },
                { es: "En PvE la graban 0,2-1,3 de cada 100. **En PvP, 47% en el pendiente**", en: "In PvE 0.2-1.3 out of 100 engrave it. **In PvP, 47% on the earring**" },
              ],
            },
          ],
        },
        {
          t: "tabla",
          cabeceras: [
            { es: "Pieza", en: "Slot" },
            { es: "Furia", en: "Fury" },
            { es: "Impacto", en: "Impact" },
            { es: "Rugido", en: "Roar" },
            { es: "Bendición", en: "Benediction" },
            { es: "Acorazada", en: "Ironclad" },
          ],
          filas: [
            [{ es: "**Pendiente**", en: "**Earring**" }, { es: "69,6%", en: "69.6%" }, { es: "69,4%", en: "69.4%" }, { es: "**63,1%**", en: "**63.1%**" }, { es: "22,6%", en: "22.6%" }, { es: "22,8%", en: "22.8%" }],
            [{ es: "**Collar**", en: "**Necklace**" }, { es: "69,3%", en: "69.3%" }, { es: "67,1%", en: "67.1%" }, { es: "**59,3%**", en: "**59.3%**" }, { es: "19,1%", en: "19.1%" }, { es: "16,5%", en: "16.5%" }],
            [{ es: "Botas", en: "Boots" }, { es: "68,9%", en: "68.9%" }, { es: "61,8%", en: "61.8%" }, { es: "47,3%", en: "47.3%" }, { es: "2,8%", en: "2.8%" }, { es: "3,9%", en: "3.9%" }],
            [{ es: "Guantes", en: "Gloves" }, { es: "68,3%", en: "68.3%" }, { es: "61,0%", en: "61.0%" }, { es: "51,9%", en: "51.9%" }, { es: "3,9%", en: "3.9%" }, { es: "2,1%", en: "2.1%" }],
            [{ es: "Casco", en: "Helmet" }, { es: "67,0%", en: "67.0%" }, { es: "58,5%", en: "58.5%" }, { es: "47,8%", en: "47.8%" }, { es: "3,3%", en: "3.3%" }, { es: "2,0%", en: "2.0%" }],
            [{ es: "Hombreras", en: "Shoulders" }, { es: "67,0%", en: "67.0%" }, { es: "62,7%", en: "62.7%" }, { es: "54,3%", en: "54.3%" }, { es: "4,5%", en: "4.5%" }, { es: "3,4%", en: "3.4%" }],
            [{ es: "Capa", en: "Cape" }, { es: "66,5%", en: "66.5%" }, { es: "56,7%", en: "56.7%" }, { es: "44,9%", en: "44.9%" }, { es: "0,4%", en: "0.4%" }, { es: "1,9%", en: "1.9%" }],
            [{ es: "Peto", en: "Torso" }, { es: "66,3%", en: "66.3%" }, { es: "60,9%", en: "60.9%" }, { es: "49,1%", en: "49.1%" }, { es: "3,7%", en: "3.7%" }, { es: "5,2%", en: "5.2%" }],
            [{ es: "Pantalón", en: "Pants" }, { es: "66,3%", en: "66.3%" }, { es: "51,4%", en: "51.4%" }, { es: "**42,6%**", en: "**42.6%**" }, { es: "1,3%", en: "1.3%" }, { es: "2,2%", en: "2.2%" }],
          ],
        },
        {
          t: "aviso",
          parrafos: [
            {
              es: "**La discusión que esconde esa tabla.** Los datos dicen Furia, Impacto certero, Rugido insultante. La guía de referencia del tablón coreano dice Furia, **Rugido insultante**, Impacto certero — y lo escribe con retintín. La diferencia es de un par de puntos porcentuales, pero lo que hay detrás es esto: casi seis de cada diez Templars dejan el Rugido fuera del pantalón y de la capa, y el Rugido es literalmente lo que dobla tu agro. Si pierdes el jefe a menudo, ahí tienes lo primero que mirar.",
              en: "**The argument hidden in that table.** The data says Fury, Impact Hit, Insulting Roar. The Korean board's reference guide says Fury, **Insulting Roar**, Impact Hit — and says it pointedly. The gap is a couple of percentage points, but here is what sits behind it: nearly six out of ten Templars leave the Roar off their legs and cape, and the Roar is literally what doubles your aggro. If you lose the boss often, that is the first thing to check.",
            },
          ],
        },
        { t: "subtitulo", texto: { es: "Los estigmas", en: "The stigmas" } },
        {
          t: "tabla",
          cabeceras: [
            { es: "Estigma", en: "Stigma" },
            { es: "A nivel 20", en: "At level 20" },
            { es: "A nivel 25", en: "At level 25" },
            { es: "Qué hace", en: "What it does" },
          ],
          filas: [
            [
              { es: "**Provocación** · Taunt (도발)", en: "**Taunt** (도발)" },
              { es: "**89,2%**", en: "**89.2%**" },
              { es: "32,5%", en: "32.5%" },
              { es: "888 de daño y **+20.000 de hostilidad** a 20 m. Deja Encogimiento 15 s: −200 de precisión y −10% de ataque", en: "888 damage and **+20,000 enmity** at 20m. Leaves Shrink for 15s: −200 accuracy and −10% attack" },
            ],
            [
              { es: "**Estandarte de batalla** · Battlefield Banner (전장의 깃발)", en: "**Battlefield Banner** (전장의 깃발)" },
              { es: "88,5%", en: "88.5%" },
              { es: "**54,6%**", en: "**54.6%**" },
              { es: "**El primero que se lleva a 25**, y por mucho. A 25 da +15% de velocidad de combate mientras dura", en: "**The first one taken to 25**, by a mile. At 25 it gives +15% combat speed for the duration" },
            ],
            [
              { es: "**Escudo de protección** · Shield of Protection (보호의 방패)", en: "**Shield of Protection** (보호의 방패)" },
              { es: "87,6%", en: "87.6%" },
              { es: "10,0%", en: "10.0%" },
              { es: "Bloqueo garantizado. A 5 y a 25 suma un uso seguido más", en: "Guaranteed block. At 5 and at 25 it adds one more consecutive use" },
            ],
            [
              { es: "**Escudo de perdición** · Doom Shield (파멸의 방패)", en: "**Doom Shield** (파멸의 방패)" },
              { es: "84,4%", en: "84.4%" },
              { es: "15,9%", en: "15.9%" },
              { es: "1.254 de daño, carga a 20 m, derribo y escudo. **Es tu apertura**", en: "1,254 damage, 20m charge, knockdown and a shield. **This is your opener**" },
            ],
            [
              { es: "**Castigo del Señor Empíreo** · Empyrean Lord's Punishment (주신의 징벌)", en: "**Empyrean Lord's Punishment** (주신의 징벌)" },
              { es: "77,4%", en: "77.4%" },
              { es: "10,0%", en: "10.0%" },
              { es: "939 en área, 50% de aturdir y **50 de barra de groggy** — el estigma de groggy de la clase", en: "939 area damage, 50% stun chance and **50 stagger gauge** — the class's groggy stigma" },
            ],
            [
              { es: "Camarada de armas · Comrade in Arms (전우 보호)", en: "Comrade in Arms (전우 보호)" },
              { es: "62,9%", en: "62.9%" },
              { es: "2,5%", en: "2.5%" },
              { es: "Te comes la mitad del daño que reciba un compañero durante 6 s. **En PvP sube al 85,5%**", en: "You eat half the damage a party member takes for 6s. **In PvP it climbs to 85.5%**" },
            ],
            [
              { es: "Segunda piel · Second Skin (이중 갑옷)", en: "Second Skin (이중 갑옷)" },
              { es: "58,1%", en: "58.1%" },
              { es: "27,6%", en: "27.6%" },
              { es: "+30% de aguante PvE 10 s. El tercero más llevado a 25", en: "+30% PvE damage tolerance for 10s. Third most common at 25" },
            ],
            [
              { es: "Escudo de Nezekan · Nezekan's Shield (네자칸의 방패)", en: "Nezekan's Shield (네자칸의 방패)" },
              { es: "53,7%", en: "53.7%" },
              { es: "6,6%", en: "6.6%" },
              { es: "Escudo del **41% de tu vida máxima para ti y todo el grupo** a 40 m", en: "A shield worth **41% of your max HP for you and the whole party** within 40m" },
            ],
          ],
        },
        {
          t: "aviso",
          parrafos: [
            {
              es: "**Los cinco de arriba son el montaje.** Provocación, Estandarte, Escudo de protección, Escudo de perdición y Castigo del Señor Empíreo: los cinco pasan del 77% y no hay debate. Lo que sí se decide es el sexto — Camarada de armas si el grupo va justo, Escudo de Nezekan si hay un pico de daño que absorber, Segunda piel si el que se muere eres tú.",
              en: "**The top five are the setup.** Taunt, Banner, Shield of Protection, Doom Shield and Empyrean Lord's Punishment: all five clear 77% and there is no debate. What you do decide is the sixth — Comrade in Arms if the party is struggling, Nezekan's Shield if there is a damage spike to absorb, Second Skin if the one dying is you.",
            },
            {
              es: "**Si solo vas a subir uno a 25, es el Estandarte de batalla.** Lo tiene el 54,6% a ese nivel, más del doble que el segundo, y la razón es su nivel 25: **+15% de velocidad de combate mientras dura**. En una clase donde la velocidad de combate son golpes por minuto sin tope, eso no es un buff, es otra escala.",
              en: "**If you are only taking one to 25, take Battlefield Banner.** 54.6% have it there, more than double the second place, and the reason is its level 25: **+15% combat speed for the duration**. In a class where combat speed is uncapped hits per minute, that is not a buff, it is a different scale.",
            },
          ],
        },
      ],
    },

    // ── 9. El agro ──────────────────────────────────────────────
    {
      eyebrow: { es: "El agro", en: "Aggro" },
      titulo: { es: "Cómo no perder al jefe", en: "How not to lose the boss" },
      intro: [
        {
          es: "Es la queja número uno del tablón coreano de la clase — hay más hilos sobre perder el agro que sobre cualquier otra cosa. Y la respuesta que dan los que no lo pierden nunca es incómoda: **la hostilidad no se genera pulsando Provocación, se genera pegando.**",
          en: "It is the number one complaint on the class's Korean board — there are more threads about losing aggro than about anything else. And the answer from the people who never lose it is uncomfortable: **enmity is not generated by pressing Taunt, it is generated by hitting.**",
        },
      ],
      bloques: [
        {
          t: "parrafo",
          texto: {
            es: "**De dónde sale la hostilidad.** En el volcado del cliente, las skills que dicen literalmente «aumenta la hostilidad» son estas: Aporreo continuo, Golpe feroz, Juicio, Danza de destellos y las cuatro cadenas del ataque básico —Golpe decisivo, Golpe desesperado, Golpe punitivo y Embate amenazante—. Es decir: **tu rotación normal**. No hay un botón de tanque aparte; el botón de tanque es no dejar de darle.",
            en: "**Where enmity comes from.** In the client dump, the skills that literally say «increases Enmity» are these: Pummel, Vicious Strike, Judgment, Flash Rampage and the four basic-attack chains —Decisive Strike, Desperate Strike, Punishing Strike and Threatening Blow—. In other words: **your normal rotation**. There is no separate tank button; the tank button is never stopping.",
          },
        },
        {
          t: "skills",
          items: [
            {
              orden: { es: "El multiplicador", en: "The multiplier" },
              nombre: { es: "Rugido insultante", en: "Insulting Roar" },
              ko: "모욕의 포효",
              icono: `${ICO}ICON_TE_SKILL_Passive_007.webp`,
              puntos: [
                { es: "**+100% de generación de hostilidad.** Todo lo que hagas cuenta el doble", en: "**+100% enmity boost.** Everything you do counts twice" },
                { es: "No es una skill que se pulsa: **es un grabado, y hay que meterlo en las nueve piezas**", en: "It is not a skill you press: **it is an engraving, and it goes on all nine slots**" },
                { es: "En el pantalón lo lleva el 42,6% y en la capa el 44,9%. Ahí es donde se pierde el agro", en: "42.6% have it on their legs and 44.9% on their cape. That is where aggro gets lost" },
                { es: "De regalo: +5,5% de ataque durante 5 s al acertar de frente", en: "As a bonus: +5.5% attack for 5s on a front attack" },
              ],
            },
            {
              orden: { es: "El botón", en: "The button" },
              nombre: { es: "Provocación", en: "Taunt" },
              ko: "도발",
              icono: `${ICO}ICON_TE_SKILL_012.webp`,
              puntos: [
                { es: "**+20.000 de hostilidad de golpe**, a 20 m, cada 30 s", en: "**+20,000 enmity in one hit**, at 20m, every 30s" },
                { es: "Deja **Encogimiento** 15 s al enemigo: −200 de precisión y −10% de ataque", en: "Leaves **Shrink** on the target for 15s: −200 accuracy and −10% attack" },
                { es: "**El estigma más subido de la clase: 89,2% a nivel 20**", en: "**The most levelled stigma in the class: 89.2% at level 20**" },
                { es: "A nivel 15 le quita 5 s de recarga; a nivel 20, +5 s de Encogimiento", en: "Level 15 cuts 5s off its cooldown; level 20 adds +5s of Shrink" },
              ],
            },
            {
              orden: { es: "El que reparte", en: "The one that shares" },
              nombre: { es: "Camarada de armas", en: "Comrade in Arms" },
              ko: "전우 보호",
              icono: `${ICO}ICON_TE_SKILL_024.webp`,
              puntos: [
                { es: "Durante 6 s, **la mitad del daño que reciba un compañero te lo comes tú**", en: "For 6s, **half the damage a party member takes goes to you instead**" },
                { es: "No genera hostilidad, pero evita que a alguien lo maten justo cuando el jefe se gira", en: "It does not build enmity, but it stops someone dying exactly when the boss turns" },
                { es: "62,9% en PvE, **85,5% en PvP**", en: "62.9% in PvE, **85.5% in PvP**" },
              ],
            },
          ],
        },
        { t: "subtitulo", texto: { es: "Por qué se pierde de verdad", en: "Why you actually lose it" } },
        {
          t: "tabla",
          cabeceras: [{ es: "Lo que dice la gente", en: "What people say" }, { es: "Lo que pasa de verdad", en: "What is actually happening" }],
          filas: [
            [
              { es: "«Me lo quita un Gladiator con 100K más de poder»", en: "«A Gladiator with 100K more power takes it off me»" },
              { es: "Puede pasar, y NCSoft ya lo arregló una vez subiendo la hostilidad del Templar la semana siguiente a un parche de daño del Gladiator. Pero en el mismo tablón hay quien va con Gladiators 100K por encima y no lo pierde nunca", en: "It can happen, and NCSoft already fixed it once by raising Templar enmity the week after a Gladiator damage patch. But on the same board there are people running with Gladiators 100K above them who never lose it" },
            ],
            [
              { es: "«Se me va cuando hago la mecánica»", en: "«It goes when I do the mechanic»" },
              { es: "**Esta es la de verdad.** Si el jefe tiene un patrón cada minuto y solo tienes 10-20 s de daño libre, cada segundo que dejas de pegar es hostilidad que no generas", en: "**This is the real one.** If the boss has a pattern every minute and you only get 10-20 seconds of free damage, every second you stop is enmity you do not build" },
            ],
            [
              { es: "«Llevo Provocación y aun así me lo quitan»", en: "«I run Taunt and they still take it»" },
              { es: "Hay un caso documentado de un Templar **sin** Provocación quitándole el jefe a uno **con** Provocación, con menos de 20K de diferencia de poder. Provocación es un empujón, no un seguro", en: "There is a documented case of a Templar **without** Taunt pulling the boss off one **with** Taunt, with under 20K power between them. Taunt is a shove, not an insurance policy" },
            ],
            [
              { es: "«Me muero y se va»", en: "«I die and it goes»" },
              { es: "Eso pasa en todos los juegos del género. No es un problema de la clase", en: "That happens in every game in the genre. It is not a class problem" },
            ],
          ],
        },
        {
          t: "parrafo",
          texto: {
            es: "**Lo que sale de leer los cuatro casos seguidos.** La hostilidad la generas pegando, y todo lo que te obliga a dejar de pegar —una mecánica, un reposicionamiento, un Escudo de protección de más, un patrón que no te sabes— es hostilidad que no estás generando. Por eso los que no lo pierden nunca no hablan de stats: hablan de conocerse el jefe.",
            en: "**What comes out of reading all four cases together.** You build enmity by hitting, and everything that forces you to stop —a mechanic, a repositioning, one Shield of Protection too many, a pattern you have not learned— is enmity you are not building. That is why the people who never lose it do not talk about stats: they talk about knowing the boss.",
          },
        },
        { t: "subtitulo", texto: { es: "La lista de lo que sí funciona", en: "The list of what does work" } },
        {
          t: "tarjetas",
          columnas: 3,
          items: [
            {
              titulo: { es: "Lo que se toca en el equipo", en: "What you change on your gear" },
              sub: { es: "Antes de tocar nada más", en: "Before touching anything else" },
              ordenada: true,
              puntos: [
                { es: "**Rugido insultante en las nueve piezas**, pantalón y capa incluidos", en: "**Insulting Roar on all nine slots**, legs and cape included" },
                { es: "**Provocación a nivel 20** — el 89,2% ya la tiene ahí", en: "**Taunt at level 20** — 89.2% already have it there" },
                { es: "Montaje de bloqueo, para no perder tiempo de ataque manteniendo la Furia", en: "Block setup, so you do not lose attack time keeping Fury up" },
                { es: "Fuera el robo de vida del Juicio: es daño que no haces, y el daño es agro", en: "Lifesteal off Judgment: it is damage you are not doing, and damage is aggro" },
              ],
            },
            {
              titulo: { es: "Lo que se toca en el teclado", en: "What you change on your keys" },
              sub: { es: "Cuesta cinco minutos", en: "Five minutes of work" },
              ordenada: true,
              puntos: [
                { es: "**Pon Provocación en Ctrl + la tecla del Aporreo continuo**: así sale sin soltar la macro", en: "**Bind Taunt to Ctrl + your Pummel key**: it fires without letting go of the macro" },
                { es: "Abre con **Castigo a 20 m** y entra con **Escudo de perdición**", en: "Open with **Punishment at 20m** and close in with **Doom Shield**" },
                { es: "Provocación en cuanto esté lista, no cuando ya la hayas perdido", en: "Taunt the moment it is up, not once you have already lost it" },
                { es: "En el jefe final, todos los consumibles. No los guardes", en: "On the last boss, every consumable. Do not save them" },
              ],
            },
            {
              titulo: { es: "Lo que se toca en la cabeza", en: "What you change in your head" },
              sub: { es: "Y es lo que más pesa", en: "And this is what weighs most" },
              ordenada: true,
              puntos: [
                { es: "**Aprende los patrones del jefe.** El agro que pierdes es el daño que no hiciste esquivando de más", en: "**Learn the boss patterns.** The aggro you lose is the damage you skipped while over-dodging" },
                { es: "Coloca y no te muevas: cada reposicionamiento es tiempo sin pegar", en: "Pick your spot and stay: every repositioning is time not hitting" },
                { es: "Bloquea los golpes grandes, no todos: cada bloqueo forzado es un ataque que no sale", en: "Block the big hits, not every hit: each forced block is a swing that does not happen" },
                { es: "Si aun así lo pierdes en una incursión nueva, es un problema conocido y abierto — no eres tú solo", en: "If you still lose it in new raid content, it is a known open problem — it is not just you" },
              ],
            },
          ],
        },
        {
          t: "aviso",
          parrafos: [
            {
              es: "**Provocación no se quita nunca en contenido nuevo.** Es la frase que más se repite en el tablón, y va dirigida a quien la saca del montaje para meter algo de daño o de reducción: en una incursión que estás aprendiendo, Provocación entra sí o sí. El sitio para experimentar es la mazmorra que ya te sabes.",
              en: "**Never drop Taunt in new content.** It is the most repeated line on the board, and it is aimed at people who cut it from their setup for something offensive: in a raid you are still learning, Taunt goes in, full stop. The place to experiment is the dungeon you already know.",
            },
            {
              es: "**Y una que no te va a gustar.** La guía de agro más leída de la clase la escribió alguien que se puso a jugar un Cleric de secundario y dice que ahí se le cayó la venda: desde fuera se ve al instante si el Templar sabe colocarse o no. Su consejo no era ningún stat — era ver vídeos de la mazmorra antes de entrar.",
              en: "**And one you will not like.** The most-read aggro guide in the class was written by someone who levelled a Cleric alt and says that is where it clicked: from the outside you can tell instantly whether the Templar knows where to stand. Their advice was not a stat — it was to watch videos of the dungeon before going in.",
            },
          ],
        },
      ],
    },

    // ── 10. La macro ────────────────────────────────────────────
    {
      eyebrow: { es: "La macro", en: "The macro" },
      titulo: { es: "Cómo se juega de verdad al Templar", en: "How the Templar is actually played" },
      intro: [
        {
          es: "Aion 2 trae **una macro de habilidades dentro del juego**: metes skills en orden, le pones un retardo en milisegundos y salen con un solo botón. El termómetro de la clase en Corea no es el DPS — son **los golpes por minuto**, y en el Templar se cuentan por separado los del Juicio, los del Golpe punitivo y los del Aporreo continuo.",
          en: "Aion 2 ships **a skill macro inside the game**: you queue skills in order, set a delay in milliseconds and they fire off one button. The class's yardstick in Korea is not DPS — it is **hits per minute**, and for the Templar they are counted separately for Judgment, Punishing Strike and Pummel.",
        },
        {
          es: "**Y aquí viene lo raro de esta clase: el techo depende del ordenador.** No es una exageración de foro — está medido sobre unos 60 Templars, uno por uno.",
          en: "**And here is the strange part of this class: your ceiling depends on your computer.** That is not forum exaggeration — it was measured across some 60 Templars, one by one.",
        },
      ],
      bloques: [
        {
          t: "tabla",
          cabeceras: [
            { es: "Procesador", en: "CPU" },
            { es: "Juicio", en: "Judgment" },
            { es: "Golpe punitivo", en: "Punishing Strike" },
            { es: "Aporreo continuo", en: "Pummel" },
          ],
          filas: [
            [{ es: "Intel i5", en: "Intel i5" }, { es: "~220", en: "~220" }, { es: "~140", en: "~140" }, { es: "~120", en: "~120" }],
            [{ es: "Intel i7", en: "Intel i7" }, { es: "~230", en: "~230" }, { es: "~140", en: "~140" }, { es: "~110", en: "~110" }],
            [{ es: "Intel i9", en: "Intel i9" }, { es: "~240", en: "~240" }, { es: "~150", en: "~150" }, { es: "~100", en: "~100" }],
            [{ es: "Ryzen 5600", en: "Ryzen 5600" }, { es: "~220", en: "~220" }, { es: "~140", en: "~140" }, { es: "~120", en: "~120" }],
            [{ es: "Ryzen 7500", en: "Ryzen 7500" }, { es: "~230", en: "~230" }, { es: "~140", en: "~140" }, { es: "~110", en: "~110" }],
            [{ es: "**Ryzen X3D**", en: "**Ryzen X3D**" }, { es: "**~250**", en: "**~250**" }, { es: "**~150**", en: "**~150**" }, { es: "~100", en: "~100" }],
          ],
        },
        {
          t: "parrafo",
          texto: {
            es: "**Léelo así:** el Juicio depende del procesador y de la reducción de recarga; el Golpe punitivo depende de la velocidad de combate; y el Aporreo continuo sube cuando los otros dos bajan, porque ocupa el hueco. El techo confirmado hasta ahora es **250 de Juicio, 150 de Golpe punitivo y 100 de Aporreo**.",
            en: "**Read it like this:** Judgment scales with your CPU and your cooldown reduction; Punishing Strike scales with combat speed; and Pummel goes up when the other two go down, because it fills the gap. The confirmed ceiling so far is **250 Judgment, 150 Punishing Strike and 100 Pummel**.",
          },
        },
        { t: "subtitulo", texto: { es: "Cuánta velocidad de combate hace falta", en: "How much combat speed you need" } },
        {
          t: "parrafo",
          texto: {
            es: "Un jugador contó los golpes de un minuto con la misma configuración y solo cambiando el elixir de velocidad, treinta pasadas por valor. La conclusión es lo contrario de lo que pasa en el Gladiator: **aquí no hay tope**. El último parche lo rompió y cada punto de velocidad de combate se nota.",
            en: "A player counted a full minute of hits with the same setup, changing only the speed elixir, thirty runs per value. The conclusion is the opposite of the Gladiator's: **there is no cap here**. The last patch broke it and every point of combat speed shows up.",
          },
        },
        {
          t: "tabla",
          cabeceras: [
            { es: "Velocidad de combate", en: "Combat speed" },
            { es: "Golpes totales", en: "Total hits" },
            { es: "De los cuales, Juicio", en: "Of which, Judgment" },
          ],
          filas: [
            [{ es: "**111,6%** (91,6% + elixir superior 20%)", en: "**111.6%** (91.6% + top elixir 20%)" }, { es: "**580**", en: "**580**" }, { es: "230 de media · 240 una vez en treinta pasadas", en: "230 average · 240 once in thirty runs" }],
            [{ es: "106,6% (91,6% + elixir alto 15%)", en: "106.6% (91.6% + high elixir 15%)" }, { es: "568", en: "568" }, { es: "210 de media, y nunca pasó de 570 golpes", en: "210 average, and never over 570 total" }],
            [{ es: "101,6% (91,6% + elixir normal 10%)", en: "101.6% (91.6% + normal elixir 10%)" }, { es: "550", en: "550" }, { es: "200-210, dando saltos", en: "200-210, jumping around" }],
          ],
        },
        {
          t: "aviso",
          parrafos: [
            {
              es: "**De 101,6% a 111,6% son 30 golpes de más por minuto.** En el Gladiator ese mismo salto vale seis. Por eso la velocidad de combate está al 100% en la lista de stats del Templar y sigue subiendo después: aquí no hay punto en el que dejes de ganar.",
              en: "**From 101.6% to 111.6% is 30 extra hits per minute.** On the Gladiator that same jump is worth six. That is why combat speed sits at 100% on the Templar's stat list and keeps climbing after that: there is no point here where you stop gaining.",
            },
            {
              es: "**Ojo con el muñeco.** El mismo autor avisa: en el muñeco lo que cuenta es el número de golpes, no el DPS. Lo que decide en mazmorra es el equilibrio entre golpe fuerte y daño frontal, y entre perfección y amplificación de daño de arma — cosas que el muñeco no mide.",
              en: "**Careful with the dummy.** The same author warns: on the dummy what counts is the hit count, not the DPS. What decides a dungeon is the balance between heavy strike and front damage, and between perfection and weapon damage amplification — things the dummy does not measure.",
            },
          ],
        },
        { t: "subtitulo", texto: { es: "Qué va dentro y qué va fuera", en: "What goes in and what stays out" } },
        {
          t: "tarjetas",
          columnas: 3,
          items: [
            {
              titulo: { es: "Dentro de la macro", en: "Inside the macro" },
              sub: { es: "La línea del clic derecho", en: "The right-click line" },
              ordenada: true,
              puntos: [
                { es: "**Juicio**", en: "**Judgment**" },
                { es: "Escudo de perdición · a los 3 s", en: "Doom Shield · at 3s" },
                { es: "Golpe protector · a los 2 s", en: "Warding Strike · at 2s" },
                { es: "Golpe de escudo · a los 2 s", en: "Shield Smite · at 2s" },
              ],
              nota: { es: "Se pueden cambiar Golpe protector y Escudo de perdición de orden, pero abrir con el Castigo a distancia y luego el Escudo de perdición da más pico.", en: "You can swap Warding Strike and Doom Shield around, but opening with Punishment at range and then Doom Shield gives a higher peak." },
            },
            {
              titulo: { es: "Fuera de la macro", en: "Outside the macro" },
              sub: { es: "A mano, mirando al jefe", en: "By hand, watching the boss" },
              puntos: [
                { es: "**Provocación** — en Ctrl + una tecla del ciclo, para no soltar la macro", en: "**Taunt** — on Ctrl + a cycle key, so you never let go of the macro" },
                { es: "**Enganche y Carga de escudo** — son las dos únicas que de verdad se pulsan", en: "**Poach and Shield Rush** — the only two you genuinely press" },
                { es: "**Escudo de protección** — cada 20 s o cuando salga una mecánica de control", en: "**Shield of Protection** — every 20s or when a crowd-control mechanic lands" },
                { es: "Armadura de nobleza y los estigmas de grupo, cuando toque", en: "Noble Armor and the party stigmas, when they are needed" },
              ],
            },
            {
              titulo: { es: "Y la configuración", en: "And the settings" },
              sub: { es: "Gratis, y se nota", en: "Free, and you feel it" },
              ordenada: true,
              puntos: [
                { es: "**Calidad de efectos en «muy bajo»**: son entre 15 y 30 Juicios de diferencia", en: "**Effect quality on «very low»**: that is 15 to 30 Judgments of difference" },
                { es: "Apagar el indicador de daño flotante en combate", en: "Turn off the floating combat damage text" },
                { es: "**Internet simétrica.** Con conexión asimétrica los golpes bailan con el mismo PC y el mismo montaje", en: "**Symmetric internet.** On an asymmetric line your hit count swings with the same PC and the same setup" },
                { es: "La escala de resolución apenas influye", en: "Resolution scale barely matters" },
              ],
            },
          ],
        },
        {
          t: "aviso",
          parrafos: [
            {
              es: "**No quites el Golpe de escudo por los tirones.** Es verdad que su animación provoca una caída de fotogramas, y por eso hay gente que lo saca. Pero es la skill que reactiva el Juicio: **el daño que pierdes por no tenerlo es mayor que el que pierdes por el tirón**. Déjalo dentro.",
              en: "**Do not cut Shield Smite because of the stutter.** Its animation does cause a frame drop, which is why some people remove it. But it is the skill that re-enables Judgment: **the damage you lose without it is bigger than the damage you lose to the stutter**. Leave it in.",
            },
            {
              es: "**Y el aviso que hay que dar entero: esto es una queja abierta en Corea, no una característica.** El parche que metió un retardo mínimo de cancelación mató el ciclo de clic izquierdo y dejó forzado el de clic derecho, que es justo el que depende del PC y de la conexión. Hay una petición formal en el tablón pidiendo o que lo devuelvan o que quiten la dependencia del hardware. Cuando el juego llegue al global el 5 de octubre esto puede estar ya cambiado.",
              en: "**And the full warning: this is an open complaint in Korea, not a feature.** The patch that added a minimum cancel delay killed the left-click cycle and forced the right-click one, which is exactly the one that depends on your PC and your connection. There is a formal request on the board asking either to roll it back or to remove the hardware dependency. By the time the game reaches global on 5 October this may already have changed.",
            },
          ],
        },
      ],
    },

    // ── 11. Rotación ────────────────────────────────────────────
    {
      eyebrow: { es: "Rotación", en: "Rotation" },
      titulo: { es: "El orden de los golpes", en: "The order of your swings" },
      intro: [
        {
          es: "El ciclo del Templar tiene nombre propio en Corea: **el encadenado de Aporreo y Juicio**. La idea es que el Aporreo continuo cancele la recuperación del Juicio y que el Juicio se vuelva a activar antes de que la cadena se rompa. Todo lo demás del árbol existe para eso.",
          en: "The Templar's cycle has its own name in Korea: **the Pummel-Judgment chain**. The idea is that Pummel cancels Judgment's recovery and that Judgment comes back up before the chain breaks. Everything else in the tree exists for that.",
        },
      ],
      bloques: [
        {
          t: "rotacion",
          titulo: { es: "Apertura contra un jefe", en: "Boss opener" },
          cuando: { es: "Desde que entras hasta que el ciclo se estabiliza", en: "From the pull until the cycle settles" },
          pasos: [
            { texto: { es: "Castigo", en: "Punishment" }, nota: { es: "a 20 m, cargado", en: "at 20m, charged" }, ko: "징벌", icono: `${ICO}ICON_TE_SKILL_009.webp` },
            { texto: { es: "Escudo de perdición", en: "Doom Shield" }, nota: { es: "con esto entras", en: "this is how you close in" }, ko: "파멸의 방패", icono: `${ICO}ICON_TE_SKILL_007.webp` },
            { texto: { es: "Provocación", en: "Taunt" }, nota: { es: "en cuanto pegues", en: "the moment you land" }, clave: true, ko: "도발", icono: `${ICO}ICON_TE_SKILL_012.webp` },
            { texto: { es: "Juicio", en: "Judgment" }, clave: true, ko: "심판", icono: `${ICO}ICON_TE_SKILL_004.webp` },
            { texto: { es: "Golpe protector", en: "Warding Strike" }, nota: { es: "reactiva el Juicio", en: "re-enables Judgment" }, ko: "비호의 일격", icono: `${ICO}ICON_TE_SKILL_035.webp` },
            { texto: { es: "Golpe de escudo", en: "Shield Smite" }, nota: { es: "y lo vuelve a activar", en: "and switches it on again" }, ko: "방패 강타", icono: `${ICO}ICON_TE_SKILL_010.webp` },
          ],
        },
        {
          t: "rotacion",
          titulo: { es: "Justo antes del groggy", en: "Right before the groggy" },
          cuando: { es: "Aquí es donde se gana o se pierde la mazmorra", en: "This is where the dungeon is won or lost" },
          pasos: [
            { texto: { es: "Comprueba que la Furia está encendida", en: "Check Fury is up" } },
            { texto: { es: "Estandarte de batalla", en: "Battlefield Banner" }, ko: "전장의 깃발", icono: `${ICO}ICON_TE_SKILL_045.webp` },
            { texto: { es: "Castigo del Señor Empíreo", en: "Empyrean Lord's Punishment" }, nota: { es: "50 de barra de groggy", en: "50 stagger gauge" }, clave: true, ko: "주신의 징벌", icono: `${ICO}ICON_TE_SKILL_029.webp` },
            { texto: { es: "Castigo", en: "Punishment" }, nota: { es: "cargado del todo", en: "fully charged" }, ko: "징벌", icono: `${ICO}ICON_TE_SKILL_009.webp` },
            { texto: { es: "Aniquilación", en: "Annihilate" }, nota: { es: "si la llevas", en: "if you run it" }, ko: "섬멸", icono: `${ICO}ICON_TE_SKILL_028.webp` },
            { texto: { es: "Danza de destellos", en: "Flash Rampage" }, nota: { es: "cancela en groggy", en: "cancels during groggy" }, ko: "섬광 난무", icono: `${ICO}ICON_GL_SKILL_027.webp` },
          ],
        },
        {
          t: "rotacion",
          titulo: { es: "Farmeo de grupos en campo", en: "Open-world grinding" },
          cuando: { es: "Varios enemigos a la vez", en: "Several enemies at once" },
          pasos: [
            { texto: { es: "Enganche", en: "Poach" }, nota: { es: "los junta", en: "gathers them" }, clave: true, ko: "포획", icono: `${ICO}ICON_TE_SKILL_013.webp` },
            { texto: { es: "Golpe de escudo", en: "Shield Smite" }, nota: { es: "aturde en área a nivel 16", en: "area stun at level 16" }, ko: "방패 강타", icono: `${ICO}ICON_TE_SKILL_010.webp` },
            { texto: { es: "Aporreo continuo", en: "Pummel" }, ko: "연속 난타", icono: `${ICO}ICON_TE_SKILL_006.webp` },
            { texto: { es: "Golpe feroz", en: "Vicious Strike" }, nota: { es: "recupera espíritu", en: "recovers spirit" }, ko: "맹렬한 일격", icono: `${ICO}ICON_TE_SKILL_001.webp` },
            { texto: { es: "Aniquilación", en: "Annihilate" }, nota: { es: "para rematar", en: "to finish" }, ko: "섬멸", icono: `${ICO}ICON_TE_SKILL_028.webp` },
          ],
        },
        {
          t: "aviso",
          parrafos: [
            {
              es: "**El espíritu es el límite real del ciclo.** Encadenar Aporreo y Juicio sin parar te lo vacía: con poción de espíritu y zumo del bueno aguanta **exactamente tres minutos de combate**. En peleas más largas hay que recuperarlo aprovechando las fases sin daño — durante el groggy, pulsando solo el estigma de groggy, recuperas espíritu y recarga sin perder ni un golpe.",
              en: "**Spirit is the cycle's real limit.** Chaining Pummel and Judgment non-stop drains it: with an MP potion and the good juice it lasts **exactly three minutes of combat**. In longer fights you recover during the no-damage phases — during the groggy, pressing only the groggy stigma, you regain both MP and cooldowns without losing a single hit.",
            },
            {
              es: "**Y la Aniquilación es la excepción de las dos caras.** En el muñeco la quitas: su animación es larga y te come Juicios, así que baja el número. En mazmorra la metes: solo tienes 10-20 segundos libres por minuto, y ahí no gana quien acumula golpes sino quien mete más daño en menos tiempo. No copies el montaje del muñeco a una incursión.",
              en: "**And Annihilate is the two-faced exception.** On the dummy you cut it: the long animation eats Judgments, so your number drops. In a dungeon you keep it: you only get 10-20 free seconds a minute, and there the winner is not who accumulates hits but who packs the most damage into the least time. Do not copy your dummy setup into a raid.",
            },
          ],
        },
      ],
    },

    // ── 12. Errores ─────────────────────────────────────────────
    {
      eyebrow: { es: "Los tropiezos", en: "Common trips" },
      titulo: { es: "Errores que cuestan daño y agro", en: "Mistakes that cost damage and aggro" },
      intro: [{ es: "Los ocho que más se repiten en el tablón coreano, y qué hacer en su lugar:", en: "The eight most repeated ones on the Korean board, and what to do instead:" }],
      bloques: [
        {
          t: "tabla",
          cabeceras: [{ es: "El error", en: "The mistake" }, { es: "La solución", en: "The fix" }],
          filas: [
            [{ es: "Meter robo de vida en el Juicio «por seguridad»", en: "Putting lifesteal on Judgment «to be safe»" }, { es: "No te mueres. Es daño regalado — y el daño es agro. Si lo necesitas, va en el Aporreo continuo", en: "You do not die. It is damage given away — and damage is aggro. If you need it, it goes on Pummel" }],
            [{ es: "No grabar Rugido insultante en el pantalón y la capa", en: "Leaving Insulting Roar off the legs and cape" }, { es: "Es el grabado que dobla tu hostilidad: va en las nueve piezas", en: "It is the engraving that doubles your enmity: it goes on all nine slots" }],
            [{ es: "Meter Defensa acorazada en un hueco de PvE", en: "Slotting Ironclad Defense in a PvE piece" }, { es: "En PvE la graban 2 de cada 100. Es una pasiva de PvP; en PvE ahí van ataque, crítico, puntería o bloqueo", en: "In PvE 2 out of 100 engrave it. It is a PvP passive; in PvE that slot takes attack, crit, hit or block" }],
            [{ es: "Quitar el Golpe de escudo porque da tirones", en: "Removing Shield Smite because it stutters" }, { es: "Es lo que reactiva el Juicio: pierdes más quitándolo que dejándolo", en: "It is what re-enables Judgment: you lose more by cutting it than by keeping it" }],
            [{ es: "Pulsar el Escudo de protección solo para mantener la Furia", en: "Pressing Shield of Protection just to keep Fury up" }, { es: "Sube el bloqueo hasta que la Furia se refresque sola y guarda el escudo para las mecánicas", en: "Raise block until Fury refreshes on its own and save the shield for mechanics" }],
            [{ es: "Sacar Provocación del montaje en una incursión nueva", en: "Cutting Taunt in new raid content" }, { es: "En contenido que estás aprendiendo, Provocación entra siempre. Se experimenta en lo que ya te sabes", en: "In content you are still learning, Taunt always goes in. Experiment in what you already know" }],
            [{ es: "Copiar en mazmorra el montaje que hiciste en el muñeco", en: "Copying your dummy setup into a dungeon" }, { es: "Son dos cosas distintas: el muñeco premia acumular golpes, la mazmorra premia el pico en 10-20 segundos", en: "They are two different things: the dummy rewards accumulating hits, the dungeon rewards a peak in 10-20 seconds" }],
            [{ es: "Culpar al equipo cuando tus golpes por minuto están bajos", en: "Blaming your gear when your hit count is low" }, { es: "Mira en este orden: procesador, gráficos en muy bajo, macro, velocidad de combate, reducción de recarga y línea de internet", en: "Check in this order: CPU, effects on very low, macro, combat speed, cooldown reduction and internet line" }],
          ],
        },
      ],
    },

    // ── 13. Equipo ──────────────────────────────────────────────
    {
      eyebrow: { es: "Equipo", en: "Gear" },
      titulo: { es: "Lo que llevan puesto", en: "What they are wearing" },
      intro: [
        {
          es: "Las piezas más usadas en cada hueco, sobre 6.287 Templars. Ojo con los porcentajes: anillo, pendiente, brazalete, broche y runa son huecos dobles, así que ahí se da el reparto entre las opciones más vistas y no el porcentaje de gente.",
          en: "The most-used pieces in each slot, across 6,287 Templars. Careful with the percentages: ring, earring, bracelet, brooch and rune are double slots, so those show the split between the most-seen options rather than a share of players.",
        },
      ],
      bloques: [
        {
          t: "tabla",
          cabeceras: [{ es: "Hueco", en: "Slot" }, { es: "Más usado", en: "Most used" }, { es: "%", en: "%" }, { es: "Alternativa", en: "Alternative" }],
          filas: [
            [{ es: "Espada", en: "Sword" }, { es: "Espada de escamas de Ludra", en: "Ludra's Scale Sword" }, { es: "20,9", en: "20.9" }, { es: "Mandoble del Rey Dragón Némesis brillante", en: "Splendent Nemesis Dragon Lord Longsword" }],
            [{ es: "Guarda", en: "Guard" }, { es: "Guarda del Rey Dragón Cornudo", en: "Horned Dragon Lord Guard" }, { es: "27,9", en: "27.9" }, { es: "Guarda del Rey Dragón Cornudo brillante", en: "Splendent Horned Dragon Lord Guard" }],
            [{ es: "Armadura (las siete piezas)", en: "Armour (all seven pieces)" }, { es: "Conjunto de la Sombra desvaída", en: "Faded Shadow set" }, { es: "38 – 47", en: "38 – 47" }, { es: "Conjunto del Corazón de lava", en: "Lava Heart set" }],
            [{ es: "Brazalete", en: "Bracelet" }, { es: "Brazalete de la Sombra desvaída", en: "Faded Shadow Bracelet" }, { es: "54,7", en: "54.7" }, { es: "Brazalete de Ludra", en: "Ludra's Bracelet" }],
            [{ es: "Broche", en: "Brooch" }, { es: "Broche de Kaldrix", en: "Kaldrix Brooch" }, { es: "56,7", en: "56.7" }, { es: "Broche del Libertador", en: "Liberator Brooch" }],
            [{ es: "Cinturón", en: "Belt" }, { es: "Cinturón noble", en: "Noble Belt" }, { es: "98,9", en: "98.9" }, { es: "— no hay debate", en: "— no debate" }],
            [{ es: "Amuleto", en: "Amulet" }, { es: "Amuleto de la Revelación", en: "Revelation Amulet" }, { es: "83,6", en: "83.6" }, { es: "Amuleto de la Batalla feroz", en: "Fierce Battle Amulet" }],
            [{ es: "Colgante", en: "Pendant" }, { es: "Colgante dracónico", en: "Draconic Pendant" }, { es: "69,8", en: "69.8" }, { es: "— no hay debate", en: "— no debate" }],
            [{ es: "Anillo", en: "Ring" }, { es: "Anillo del Rey Dragón Cornudo", en: "Horned Dragon Lord Ring" }, { es: "24,1", en: "24.1" }, { es: "Anillo del Rey Dragón de Ébano", en: "Ebony Dragon Lord Ring" }],
            [{ es: "Pendiente", en: "Earring" }, { es: "Pendientes del Rey Dragón Cornudo", en: "Horned Dragon Lord Earrings" }, { es: "21,7", en: "21.7" }, { es: "Pendientes del Rey Dragón de Ébano", en: "Ebony Dragon Lord Earrings" }],
            [{ es: "Collar", en: "Necklace" }, { es: "Collar del Rey Dragón Cornudo", en: "Horned Dragon Lord Necklace" }, { es: "22,2", en: "22.2" }, { es: "Collar del Rey Dragón de Ébano", en: "Ebony Dragon Lord Necklace" }],
            [{ es: "Runa", en: "Rune" }, { es: "Runa del choque", en: "Clash Rune" }, { es: "84,6", en: "84.6" }, { es: "Runa de la devoción", en: "Devotion Rune" }],
            [{ es: "Alas", en: "Wings" }, { es: "Alas de Talisra", en: "Talisra Wings" }, { es: "32,4", en: "32.4" }, { es: "Alas de pesadilla (19,1%)", en: "Nightmare Wings (19.1%)" }],
          ],
        },
        {
          t: "parrafo",
          texto: {
            es: "**Las alas son la sorpresa.** En el Gladiator las Alas de Talisra son la respuesta única; en el Templar las lleva solo un tercio, y en PvP ni siquiera son las primeras — ahí manda las **Alas del destello azur** (Azure Flash Wings). Tiene sentido: Talisra y Pesadilla dan **exactamente las mismas opciones**, así que aquí sí hay margen para elegir.",
            en: "**The wings are the surprise.** For the Gladiator, Talisra Wings are the single answer; for the Templar only a third run them, and in PvP they are not even first — there the **Azure Flash Wings** lead. It makes sense: Talisra and Nightmare roll **exactly the same options**, so there is genuine room to choose here.",
          },
        },
        { t: "subtitulo", texto: { es: "La mascota", en: "The pet" } },
        {
          t: "tabla",
          cabeceras: [{ es: "Casillas", en: "Slots" }, { es: "PvE", en: "PvE" }, { es: "PvP", en: "PvP" }],
          filas: [
            [{ es: "**3 y 9**", en: "**3 and 9**" }, { es: "Golpe fuerte o amplificación de daño frontal", en: "Heavy strike or front damage amplification" }, { es: "Amplif. de daño de arma o de daño frontal", en: "Weapon damage amp or front damage amp" }],
            [{ es: "**6**", en: "**6**" }, { es: "Resistencia al daño, muro de hierro o bloqueo", en: "Damage resistance, iron wall or block" }, { es: "Resistencia al daño o muro de hierro", en: "Damage resistance or iron wall" }],
            [{ es: "**1, 4 y 7**", en: "**1, 4 and 7**" }, { es: "Bloqueo o ataque contra jefes", en: "Block or boss attack" }, { es: "Bloqueo o puntería", en: "Block or hit" }],
            [{ es: "**2, 5 y 8**", en: "**2, 5 and 8**" }, { es: "Ataque máximo — y si sale ataque adicional, vale igual", en: "Max attack — and if additional attack rolls, that is fine too" }, { es: "Bloqueo o puntería", en: "Block or hit" }],
          ],
        },
        {
          t: "aviso",
          parrafos: [
            {
              es: "**Y sobre la mascota, el consejo del propio autor:** no te obsesiones. Si sale la opción parecida en vez de la ideal, úsala y sigue. Hay muchas más cosas en esta clase que dan más daño por hora invertida que perseguir la casilla perfecta.",
              en: "**And on the pet, the author's own advice:** do not obsess. If the near-miss option rolls instead of the ideal one, use it and move on. There are plenty of things in this class that give more damage per hour spent than chasing the perfect slot.",
            },
          ],
        },
      ],
    },
  ],

  fuentes: [
    {
      es: "**De dónde sale todo esto.** Los porcentajes de equipo, skills, estigmas, arcanas y alas vienen de una plataforma que mide el combate real del servidor coreano y agrega lo que llevan puesto **6.287 Templars** (5.237 de PvE y 950 de PvP); se actualiza a diario y estos datos son del 3 de septiembre. Los grabados y pasivas pieza a pieza salen de la misma plataforma sobre una muestra aparte de **554 Templars de élite en PvE** y **775 en PvP**. Las medianas de daño por clase son de la instantánea diaria del mismo día.",
      en: "**Where all this comes from.** The gear, skill, stigma, arcana and wing percentages come from a platform that measures real combat on the Korean server and aggregates what **6,287 Templars** have equipped (5,237 PvE and 950 PvP); it updates daily and this snapshot is from 3 September. The per-slot engravings and passives come from the same platform over a separate sample of **554 top PvE Templars** and **775 PvP ones**. The per-class damage medians are from the same day's daily snapshot.",
    },
    {
      es: "**Las especializaciones y el reparto de las cartas de arcana salen del volcado del cliente del juego** (26 de agosto), que publica una base de datos extraída del propio juego: los efectos, los niveles y qué skill puede salir en qué carta son exactos. Lo que NO existe en ninguna fuente pública es el porcentaje de gente que elige cada especialización — lo marcado con ✓ es lo que coinciden en recomendar dos montajes publicados en el tablón coreano en agosto, y donde no coinciden queda dicho en la nota de cada skill.",
      en: "**The specialties and the arcana card split come from the game client dump** (26 August), a database extracted from the game itself: the effects, the levels and which skill can roll on which card are exact. What does NOT exist in any public source is how many players pick each specialty — what is marked with ✓ is what two setups published on the Korean board in August agree on, and where they disagree, each skill's note says so.",
    },
    {
      es: "**La rotación, la macro, los golpes por minuto y todo lo del agro** salen del tablón coreano de la clase: la guía de montaje base del 21 de agosto, la del ciclo y la macro del 28 de agosto, la comparación de golpes sobre unos 60 Templars del 31 de agosto, las dos guías del montaje de bloqueo y una docena de hilos sobre perder el agro, incluidos los de quien lo pierde y los de quien no. Son jugadores, no un laboratorio: los números son suyos y en su ordenador. La macro de ratón es software de terceros y no una función del juego; queda dicho donde aparece.",
      en: "**The rotation, the macro, the hits per minute and everything about aggro** come from the class's Korean board: the base setup guide from 21 August, the cycle and macro guide from 28 August, the hit-count comparison across some 60 Templars from 31 August, the two block-setup guides, and a dozen threads about losing aggro — from the people who lose it and the people who do not. These are players, not a lab: the numbers are theirs, on their machines. The mouse macro is third-party software and not a game feature; that is stated where it appears.",
    },
    {
      es: "**Lo que hay que tener en cuenta.** Es el servidor coreano, con un parche por delante del que llegará al global el 5 de octubre. Las mecánicas serán las mismas; los números y el meta pueden moverse. Y en este caso hay algo más: el parche del retardo mínimo de cancelación tiene a la clase entera pidiendo que lo revisen, así que **el ciclo de esta guía es el de septiembre de 2026 en Corea y puede no ser el que te encuentres al entrar**. Los umbrales de bloqueo tampoco están cerrados por nadie: las tres cifras que damos son de tres jugadores distintos y las tres van marcadas como estimación.",
      en: "**What to keep in mind.** This is the Korean server, one patch ahead of what lands on global on 5 October. The mechanics will be the same; the numbers and the meta can shift. And here there is something more: the minimum-cancel-delay patch has the entire class asking for a review, so **the cycle in this guide is Korea's as of September 2026 and may not be the one you find on launch**. The block thresholds are not settled by anyone either: the three figures we give come from three different players and all three are flagged as estimates.",
    },
  ],
};
