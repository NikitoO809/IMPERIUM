// Manual de Atreia — Gladiator (검성).
//
// Los porcentajes de equipo y stats salen de una plataforma que mide el
// combate real del servidor coreano y agrega lo que llevan puesto 6.834
// Gladiators. Las prioridades de skill, estigmas y rotación vienen de guías de
// la comunidad del juego. Nombres coreanos incluidos para poder rastrear las
// fuentes originales.
import type { Guia } from "./tipos";

export const gladiator: Guia = {
  slug: "gladiator",
  nombre: "Gladiator",
  acento: "#e0524a",
  resumen: {
    es: "Stats, arcanas, estigmas y rotación según lo que llevan 6.834 Gladiators de élite.",
    en: "Stats, arcana, stigmas and rotation based on what 6,834 top Gladiators actually run.",
  },

  portada: {
    eyebrow: { es: "Aion 2 · Guía de clase", en: "Aion 2 · Class guide" },
    titulo: "Gladiator",
    lede: {
      es: "Qué stats buscar, cómo montar las arcanas y qué skills subir — **según lo que llevan equipado los mejores Gladiators del servidor coreano**, no según lo que a nadie le parece.",
      en: "Which stats to chase, how to build your arcana and which skills to level — **based on what the best Gladiators on the Korean server actually have equipped**, not on anyone's opinion.",
    },
    cifras: [
      { valor: "6.834", etiqueta: { es: "Gladiators medidos", en: "Gladiators measured" } },
      { valor: "5.º / 8", etiqueta: { es: "En daño por segundo", en: "In damage per second" } },
      { valor: "127.421", etiqueta: { es: "DPS mediano de la clase", en: "Class median DPS" } },
      { valor: "2 sept", etiqueta: { es: "Última actualización", en: "Last updated" } },
    ],
    arte: "/manual/aion2-gladiator.webp",
  },

  secciones: [
    // ── 1. Dónde está la clase ──────────────────────────────────
    {
      eyebrow: { es: "Lo primero, sin adornos", en: "First, with no sugar-coating" },
      titulo: { es: "Dónde está el Gladiator", en: "Where the Gladiator stands" },
      intro: [
        {
          es: "Quinto de ocho clases en daño. Por debajo de Assassin (256.978), Ranger (203.262), Spiritmaster (196.559) y Sorcerer (155.574); por encima de Templar, Chanter y Cleric.",
          en: "Fifth of eight classes in damage. Below Assassin (256,978), Ranger (203,262), Spiritmaster (196,559) and Sorcerer (155,574); above Templar, Chanter and Cleric.",
        },
        {
          es: "**No es la clase para hacer el número más grande de la pantalla.** Es la que aguanta al lado del jefe, encadena golpes múltiples y roba vida mientras pega. Si vas buscando el primer puesto del medidor, esta no es. Si vas buscando no morirte y estar siempre pegando, sí.",
          en: "**This is not the class for the biggest number on screen.** It is the one that stays glued to the boss, chains multi-hits and drains life while it swings. If you want the top of the meter, look elsewhere. If you want to stay alive and never stop hitting, this is it.",
        },
      ],
      bloques: [],
    },

    // ── 2. Stats ────────────────────────────────────────────────
    {
      eyebrow: { es: "Stats", en: "Stats" },
      titulo: { es: "Qué buscar en el equipo", en: "What to look for on gear" },
      intro: [
        {
          es: "Esto no es una opinión: es **el porcentaje de Gladiators de élite que lleva cada opción**. Lo que está al 100% no se discute — si te falta, vas mal.",
          en: "This is not an opinion: it is **the percentage of top Gladiators running each option**. Anything at 100% is not up for debate — if you are missing it, you are behind.",
        },
      ],
      bloques: [
        {
          t: "stats",
          filas: [
            {
              nombre: { es: "Amplificación de daño de arma", en: "Weapon damage amplification" },
              nota: { es: "무기 피해 증폭 · el multiplicador que más pesa", en: "무기 피해 증폭 · the multiplier that weighs most" },
              pct: 100, top: true,
            },
            {
              nombre: { es: "Potencia", en: "Power" },
              nota: { es: "위력 · sube el suelo de todos tus golpes", en: "위력 · raises the floor of every hit" },
              pct: 100, top: true,
            },
            {
              nombre: { es: "Velocidad de combate", en: "Combat speed" },
              nota: { es: "전투 속도 · más golpes por minuto, y el Gladiator vive de eso", en: "전투 속도 · more swings per minute, and that is what the Gladiator lives on" },
              pct: 100, top: true,
            },
            {
              nombre: { es: "Amplificación de daño", en: "Damage amplification" },
              nota: { es: "피해 증폭", en: "피해 증폭" },
              pct: 97.9,
            },
            {
              nombre: { es: "Precisión", en: "Accuracy" },
              nota: { es: "정확 · sin esto tus golpes múltiples se caen", en: "정확 · without it your multi-hits fall apart" },
              pct: 95.1,
            },
            {
              nombre: { es: "Acierto de golpes múltiples", en: "Multi-hit accuracy" },
              nota: { es: "다단 히트 적중 · el stat firma de la clase", en: "다단 히트 적중 · the class signature stat" },
              pct: 92.2,
            },
            {
              nombre: { es: "Amplificación de daño crítico", en: "Critical damage amplification" },
              nota: { es: "치명타 피해 증폭 · va en las hombreras", en: "치명타 피해 증폭 · goes on the shoulders" },
              pct: 100, top: true,
            },
            {
              nombre: { es: "Perfección", en: "Perfection" },
              nota: { es: "완벽 · pantalón, guantes, botas y capa", en: "완벽 · legs, gloves, boots and cape" },
              pct: 92.7,
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
              { es: "Arma principal y secundaria", en: "Main and off-hand weapon" },
              { es: "Amplif. daño de arma · Potencia · Velocidad de combate — nunca opciones de skill: aquí no caben", en: "Weapon damage amp · Power · Combat speed — never skill options: no room here" },
              { es: "100%", en: "100%" },
            ],
            [{ es: "Casco", en: "Helmet" }, { es: "Golpe fuerte · Aumento de ataque", en: "Heavy strike · Attack increase" }, { es: "99,2%", en: "99.2%" }],
            [{ es: "Peto", en: "Chest" }, { es: "Amplificación de daño", en: "Damage amplification" }, { es: "100%", en: "100%" }],
            [{ es: "Pantalón", en: "Legs" }, { es: "Aumento de ataque · Perfección · Resistencia al daño", en: "Attack increase · Perfection · Damage resistance" }, { es: "98,6%", en: "98.6%" }],
            [{ es: "Guantes", en: "Gloves" }, { es: "Velocidad de combate", en: "Combat speed" }, { es: "100%", en: "100%" }],
            [{ es: "Botas", en: "Boots" }, { es: "Velocidad de movimiento", en: "Movement speed" }, { es: "100%", en: "100%" }],
            [{ es: "Hombreras", en: "Shoulders" }, { es: "Amplificación de daño crítico", en: "Critical damage amplification" }, { es: "100%", en: "100%" }],
            [{ es: "Capa", en: "Cape" }, { es: "Golpe fuerte · Aumento de ataque", en: "Heavy strike · Attack increase" }, { es: "99,4%", en: "99.4%" }],
            [{ es: "Collar y pendiente", en: "Necklace and earring" }, { es: "Ataque · Puntería", en: "Attack · Hit" }, { es: "100%", en: "100%" }],
            [
              { es: "Anillo", en: "Ring" },
              { es: "**Opciones de skill** — aquí sí, y es donde se decide tu build. Es la única pieza sin opciones especiales de arma", en: "**Skill options** — here yes, and this is where your build is decided. It is the only slot with no special weapon options" },
              { es: "98,9%", en: "98.9%" },
            ],
          ],
        },
        {
          t: "parrafo",
          texto: {
            es: "**Las piedras mágicas son fáciles:** ataque en todo. Siete de cada diez Gladiators meten ataque ×10 en cada pieza, y en los accesorios suben a ×2,5 de media. Después van vida, crítico y puntería adicional.",
            en: "**Manastones are the easy part:** attack everywhere. Seven out of ten Gladiators slot attack ×10 in every piece, rising to ×2.5 on accessories. After that come HP, crit and extra hit.",
          },
        },
        { t: "subtitulo", texto: { es: "Y cuando tengas que elegir entre dos", en: "And when a piece makes you choose" } },
        {
          t: "parrafo",
          texto: {
            es: "Los stats de arriba son los que buscas. Esta es la escala para decidir cuando una pieza te obliga a renunciar a algo:",
            en: "The stats above are what you hunt for. This is the ladder for when a piece forces you to give something up:",
          },
        },
        {
          t: "tabla",
          primeraNum: true,
          cabeceras: [{ es: "#", en: "#" }, { es: "Opción", en: "Option" }, { es: "Lo que hay que mirar", en: "What to watch" }],
          filas: [
            [{ es: "1", en: "1" }, { es: "**Daño de arma · Amplificación · Potencia**", en: "**Weapon damage · Amplification · Power**" }, { es: "El eje que multiplica todo lo demás", en: "The axis that multiplies everything else" }],
            [{ es: "2", en: "2" }, { es: "**Velocidad de combate**", en: "**Combat speed**" }, { es: "Se nota al encadenar y al cancelar el básico", en: "You feel it when chaining and when cancelling autos" }],
            [{ es: "3", en: "3" }, { es: "**Precisión y puntería**", en: "**Accuracy and hit**" }, { es: "Si fallas al jefe, el resto de la construcción da igual", en: "If you miss the boss, the rest of the build is worthless" }],
            [{ es: "4", en: "4" }, { es: "Crítico", en: "Critical" }, { es: "Alimenta el reinicio de la Onda trituradora", en: "Feeds the Crushing Wave reset" }],
            [{ es: "5", en: "5" }, { es: "Ataque y golpes múltiples", en: "Attack and multi-hit" }, { es: "Según cómo tengas montadas las skills", en: "Depends on how your skills are set up" }],
            [{ es: "6", en: "6" }, { es: "Vida · Defensa · Bloqueo", en: "HP · Defence · Block" }, { es: "Para aguantar pegado y hacer de tanque de apoyo", en: "To stay glued in and off-tank" }],
          ],
        },
        {
          t: "aviso",
          parrafos: [
            {
              es: "**El error de subir el crítico a lo loco.** Es el stat que más llama, pero por delante van la puntería que pide el contenido y la velocidad de combate. Un crítico enorme con puntería corta falla golpes, y un golpe fallado vale cero por muy crítico que fuese.",
              en: "**The mistake of stacking crit blindly.** It is the flashiest stat, but the hit rating the content demands and combat speed both come first. Huge crit with short hit misses swings, and a missed swing is worth zero no matter how critical it was.",
            },
          ],
        },
      ],
    },

    // ── 3. Arcanas ──────────────────────────────────────────────
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
                es: "Dos niveles por skill activa. En arma y guarda también pueden salir, pero **no las cojas ahí**: ese hueco lo necesitas para potencia y velocidad.",
                en: "Two levels per active skill. They can also roll on weapon and guard, but **do not take them there**: that room is needed for power and speed.",
              },
            },
            {
              valor: "+4",
              titulo: { es: "Cartas de arcana", en: "Arcana cards" },
              texto: {
                es: "Los otros cuatro. Es la parte lenta, la que depende de la suerte y donde se atasca todo el mundo.",
                en: "The other four. This is the slow part, the one down to luck, and where everyone gets stuck.",
              },
            },
          ],
        },
        {
          t: "parrafo",
          texto: {
            es: "**Cada tipo de carta da unas skills concretas.** Pedirle a una brújula una skill que solo sale en pergamino es tirar el dinero:",
            en: "**Each card type only rolls certain skills.** Asking a compass for a skill that only appears on parchment is throwing money away:",
          },
        },
        {
          t: "tabla",
          cabeceras: [{ es: "Carta", en: "Card" }, { es: "Qué puede salir", en: "What it can roll" }],
          filas: [
            [
              { es: "**Cáliz** (성배)", en: "**Chalice** (성배)" },
              { es: "Todas — activas y pasivas. Por eso es la más golosa y la más traicionera: las pasivas se cuelan y te estropean la tirada", en: "All of them — actives and passives. That makes it the most tempting and the most treacherous: passives sneak in and ruin the roll" },
            ],
            [
              { es: "**Pergamino** (양피지)", en: "**Parchment** (양피지)" },
              { es: "Machaque descendente · Embate de perdición · Golpe afilado · Machaque en salto · Corte de tobillo · Atadura aérea", en: "Downward Smash · Doom Strike · Keen Strike · Leaping Smash · Ankle Cut · Aerial Bind" },
            ],
            [
              { es: "**Brújula** (나침반)", en: "**Compass** (나침반)" },
              { es: "Onda trituradora · Danza de filos · Embate cortante · Espada arrasadora · Embestida · Liberación de impacto", en: "Crushing Wave · Blade Dance · Severing Strike · Ravaging Sword · Charging Strike · Impact Release" },
            ],
            [
              { es: "**Campana y espejo** (종 · 거울)", en: "**Bell and mirror** (종 · 거울)" },
              { es: "Solo pasivas", en: "Passives only" },
            ],
          ],
        },
        {
          t: "parrafo",
          texto: {
            es: "**Y el grado de la carta marca su techo:** normal +2, rara +3, transmitida +4, única +5. Las normales y raras son de paso — no inviertas en ellas. **La transmitida es la primera que merece mimo**, porque ya te da de 2 a 4 niveles por skill.",
            en: "**And the card grade sets its ceiling:** common +2, rare +3, ancestral +4, unique +5. Commons and rares are stepping stones — do not invest in them. **The ancestral is the first one worth caring about**, since it already gives 2 to 4 levels per skill.",
          },
        },
        {
          t: "aviso",
          parrafos: [
            {
              es: "**El consejo que más tiempo ahorra:** tu primer cáliz único no lo subas más allá de nivel 2. Úsalo un tiempo y prepárate para tirarlo. El cáliz mezcla pasivas con activas, así que la probabilidad de que salga limpio es baja — y quemar recursos en el primero es el error clásico.",
              en: "**The tip that saves the most time:** do not push your first unique chalice past level 2. Use it for a while and be ready to bin it. The chalice mixes passives with actives, so the odds of a clean roll are low — and burning resources on the first one is the classic mistake.",
            },
            {
              es: "**Antes de gastar nada,** mira de dónde viene cada nivel: al pulsar una skill, la flecha que sale junto al número te enseña qué parte pone el Daevanion, qué parte el anillo y qué parte la carta. Así sabes exactamente cuál te falta y no compras dos veces lo mismo.",
              en: "**Before spending anything,** check where each level comes from: clicking a skill shows an arrow next to the number that breaks down what Daevanion, the ring and the card each contribute. That way you know exactly which one you are short on and never buy the same thing twice.",
            },
          ],
        },
      ],
    },

    // ── 4. La build (cambia con el modo) ────────────────────────
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
                orden: { es: "1.ª", en: "1st" },
                nombre: { es: "Danza de filos", en: "Blade Dance" },
                ko: "검기난무",
                icono: "https://aion2t.com/db-item-icons/ICON_TE_SKILL_034.webp",
                puntos: [
                  { es: "**Roba el 10%** del daño hecho", en: "**Drains 10%** of damage dealt" },
                  { es: "Al acertar, **baja 1 segundo** el tiempo de recarga de todas tus skills", en: "On hit, **cuts 1 second** off every skill cooldown" },
                  { es: "Golpes múltiples **garantizados** al acertar", en: "**Guaranteed** multi-hit on connect" },
                ],
              },
              {
                orden: { es: "2.ª", en: "2nd" },
                nombre: { es: "Machaque descendente", en: "Downward Smash" },
                ko: "내려찍기",
                icono: "https://aion2t.com/db-item-icons/ICON_GL_SKILL_017.webp",
                puntos: [
                  { es: "**Borra el tiempo de recarga**", en: "**Wipes the cooldown**" },
                  { es: "Roba el **20%** del daño", en: "Drains **20%** of damage" },
                  { es: "7% de probabilidad de activarse contra enemigos inmunes al control", en: "7% chance to trigger against crowd-control immune enemies" },
                ],
              },
              {
                orden: { es: "3.ª", en: "3rd" },
                nombre: { es: "Embate de perdición", en: "Doom Strike" },
                ko: "파멸의 맹타",
                icono: "https://aion2t.com/db-item-icons/ICON_GL_SKILL_010.webp",
                puntos: [
                  { es: "**+20% de velocidad** de skill", en: "**+20% skill speed**" },
                  { es: "**+12,5 m** de alcance", en: "**+12.5 m** range" },
                  { es: "Golpes múltiples que **ignoran bloqueo y evasión**", en: "Multi-hits that **ignore block and evasion**" },
                ],
              },
              {
                orden: { es: "4.ª", en: "4th" },
                nombre: { es: "Onda trituradora", en: "Crushing Wave" },
                ko: "분쇄 파동",
                icono: "https://aion2t.com/db-item-icons/ICON_GL_SKILL_005.webp",
                puntos: [
                  { es: "Roba el **15%** del daño", en: "Drains **15%** of damage" },
                  { es: "Al crítico, **reinicia su propia recarga**", en: "On crit, **resets its own cooldown**" },
                  { es: "Hasta **+20% de daño** cuantos más enemigos haya", en: "Up to **+20% damage** the more enemies there are" },
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
                sub: { es: "2 a 3 niveles por skill", en: "2 to 3 levels per skill" },
                ordenada: true,
                puntos: [
                  { es: "**Machaque descendente + Embate de perdición** + Golpe afilado", en: "**Downward Smash + Doom Strike** + Keen Strike" },
                  { es: "Machaque descendente + Embate de perdición", en: "Downward Smash + Doom Strike" },
                ],
                nota: { es: "Cuando tengas las dos primeras a 2-3 niveles, bloquea la carta y no la toques más.", en: "Once the first two sit at 2-3 levels, lock the card and leave it alone." },
              },
              {
                titulo: { es: "Brújula", en: "Compass" },
                sub: { es: "2 a 3 niveles por skill", en: "2 to 3 levels per skill" },
                ordenada: true,
                puntos: [
                  { es: "**Onda trituradora + Danza de filos** + Embate cortante", en: "**Crushing Wave + Blade Dance** + Severing Strike" },
                  { es: "Onda trituradora + Danza de filos", en: "Crushing Wave + Blade Dance" },
                ],
                nota: { es: "Mismo criterio: en cuanto las dos estén, cierra y a otra cosa.", en: "Same rule: once both are in, close it and move on." },
              },
              {
                titulo: { es: "Cáliz", en: "Chalice" },
                sub: { es: "La pieza cara", en: "The expensive one" },
                ordenada: true,
                puntos: [
                  { es: "**Danza de filos + Machaque descendente** + Embate de perdición + Onda trituradora", en: "**Blade Dance + Downward Smash** + Doom Strike + Crushing Wave" },
                  { es: "Danza de filos + Machaque descendente + Embate de perdición", en: "Blade Dance + Downward Smash + Doom Strike" },
                ],
                nota: { es: "Junta 15 cristales místicos y mete la que te falte.", en: "Save 15 mystic crystals and slot whichever one you are missing." },
              },
            ],
          },
        ],
        pvp: [
          {
            t: "skills",
            items: [
              {
                orden: { es: "Prioridad 0", en: "Priority 0" },
                nombre: { es: "Embate de perdición", en: "Doom Strike" },
                ko: "파멸의 맹타",
                icono: "https://aion2t.com/db-item-icons/ICON_GL_SKILL_010.webp",
                puntos: [
                  { es: "**+20% de velocidad** de skill", en: "**+20% skill speed**" },
                  { es: "**+12,5 m** de alcance — en PvP eso es alcanzar al que huye", en: "**+12.5 m** range — in PvP that means catching the runner" },
                  { es: "Ignora **bloqueo y evasión**: contra un tanque, esto es la diferencia", en: "Ignores **block and evasion**: against a tank, this is the difference" },
                ],
              },
              {
                orden: { es: "Prioridad 0", en: "Priority 0" },
                nombre: { es: "Onda trituradora", en: "Crushing Wave" },
                ko: "분쇄 파동",
                icono: "https://aion2t.com/db-item-icons/ICON_GL_SKILL_005.webp",
                puntos: [
                  { es: "**Atrae** al enemigo hacia ti", en: "**Pulls** the enemy toward you" },
                  { es: "Al crítico, **reinicia su recarga** — puedes encadenar otro tirón", en: "On crit, **resets its cooldown** — you can chain another pull" },
                  { es: "Roba el **15%** del daño", en: "Drains **15%** of damage" },
                ],
              },
              {
                orden: { es: "3.ª", en: "3rd" },
                nombre: { es: "Machaque descendente", en: "Downward Smash" },
                ko: "내려찍기",
                icono: "https://aion2t.com/db-item-icons/ICON_GL_SKILL_017.webp",
                puntos: [
                  { es: "**Se convierte en área** — aquí está la diferencia con PvE", en: "**Becomes an area attack** — this is what differs from PvE" },
                  { es: "Reinicia el tiempo de recarga", en: "Resets the cooldown" },
                  { es: "Roba el **20%** del daño", en: "Drains **20%** of damage" },
                ],
              },
              {
                orden: { es: "Última", en: "Last" },
                nombre: { es: "Espada arrasadora", en: "Ravaging Sword" },
                ko: "유린의 검",
                icono: "https://aion2t.com/db-item-icons/ICON_GL_SKILL_028.webp",
                puntos: [
                  { es: "**Dos ataques extra**", en: "**Two extra attacks**" },
                  { es: "Ignora bloqueo y evasión", en: "Ignores block and evasion" },
                  { es: "Roba el **30%** del daño — el robo de vida más alto que tienes", en: "Drains **30%** of damage — the highest lifesteal you have" },
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
                sub: { es: "2 a 3 niveles por skill", en: "2 to 3 levels per skill" },
                ordenada: true,
                puntos: [
                  { es: "**Machaque descendente + Embate de perdición** + Machaque en salto", en: "**Downward Smash + Doom Strike** + Leaping Smash" },
                  { es: "Machaque descendente + Embate de perdición", en: "Downward Smash + Doom Strike" },
                ],
                nota: { es: "Igual que en PvE, salvo la tercera: aquí entra el salto en lugar del golpe afilado.", en: "Same as PvE except the third: the leap replaces the keen strike here." },
              },
              {
                titulo: { es: "Brújula", en: "Compass" },
                sub: { es: "2 a 3 niveles por skill", en: "2 to 3 levels per skill" },
                ordenada: true,
                puntos: [
                  { es: "**Onda trituradora + Espada arrasadora** + cualquiera menos Danza de filos", en: "**Crushing Wave + Ravaging Sword** + anything but Blade Dance" },
                  { es: "Onda trituradora + Espada arrasadora", en: "Crushing Wave + Ravaging Sword" },
                ],
                nota: { es: "La Danza de filos manda en PvE y sobra aquí: contra jugadores no encadenas tanto.", en: "Blade Dance rules PvE and is surplus here: against players you do not chain as much." },
              },
              {
                titulo: { es: "Cáliz", en: "Chalice" },
                sub: { es: "La pieza cara", en: "The expensive one" },
                ordenada: true,
                puntos: [
                  { es: "**Onda trituradora + Embate de perdición** + Machaque descendente + Espada arrasadora", en: "**Crushing Wave + Doom Strike** + Downward Smash + Ravaging Sword" },
                  { es: "Onda trituradora + Embate de perdición + Machaque descendente", en: "Crushing Wave + Doom Strike + Downward Smash" },
                ],
                nota: { es: "Fíjate en el orden: en PvP manda la que atrae, no la que encadena.", en: "Note the order: in PvP the puller leads, not the chainer." },
              },
            ],
          },
        ],
      },
    },

    // ── 5. Orden de subida ──────────────────────────────────────
    {
      eyebrow: { es: "El orden", en: "The order" },
      titulo: { es: "En qué orden subirlas", en: "What to level first" },
      intro: [
        {
          es: "Repartir puntos entre muchas skills es el error que más frena. **Se completa una y se pasa a la siguiente** — y el orden cambia según el techo al que apuntes.",
          en: "Spreading points across many skills is the mistake that slows people down most. **Finish one, move to the next** — and the order changes depending on the ceiling you are aiming for.",
        },
      ],
      bloques: [
        {
          t: "tabla",
          primeraNum: true,
          cabeceras: [{ es: "Puesto", en: "Rank" }, { es: "Para llegar a 16", en: "To reach 16" }, { es: "Para llegar a 20", en: "To reach 20" }],
          filas: [
            [{ es: "1", en: "1" }, { es: "**Machaque descendente**", en: "**Downward Smash**" }, { es: "**Machaque descendente**", en: "**Downward Smash**" }],
            [{ es: "2", en: "2" }, { es: "Onda trituradora", en: "Crushing Wave" }, { es: "Embate de perdición", en: "Doom Strike" }],
            [{ es: "3", en: "3" }, { es: "Embate cortante", en: "Severing Strike" }, { es: "Embate cortante", en: "Severing Strike" }],
            [{ es: "4", en: "4" }, { es: "Embate de perdición", en: "Doom Strike" }, { es: "Onda trituradora", en: "Crushing Wave" }],
            [{ es: "5", en: "5" }, { es: "Golpe afilado o Danza de filos", en: "Keen Strike or Blade Dance" }, { es: "El resto de principales", en: "The rest of the mains" }],
          ],
        },
        {
          t: "parrafo",
          texto: {
            es: "**El Machaque descendente va primero siempre.** Es el centro de todo lo demás: cuando se activa, se usa antes que cualquier otra cosa. Si te lo pierdes por estar encadenando otra skill, has perdido la rotación.",
            en: "**Downward Smash always comes first.** It is the centre of everything else: when it lights up, it goes before anything else. Miss it because you were mid-chain and you have lost the rotation.",
          },
        },
        {
          t: "parrafo",
          texto: {
            es: "**La Onda trituradora es la que se mueve.** Sube al segundo puesto si haces mucho farmeo en campo o si ya tienes crítico alto —porque al crítico se reinicia sola—; si no, con 16 vas servido hasta tener las otras tres.",
            en: "**Crushing Wave is the flexible one.** Move it to second if you grind a lot in the open world or already run high crit —since it resets itself on crit—; otherwise 16 is plenty until the other three are done.",
          },
        },
      ],
    },

    // ── 6. Especializaciones ────────────────────────────────────
    {
      eyebrow: { es: "Especializaciones", en: "Specialties" },
      titulo: { es: "Lo que desbloquea cada skill", en: "What each skill unlocks" },
      intro: [
        {
          es: "Subir una skill no solo le sube el número: a **nivel 8, 12 y 16** cada una desbloquea efectos que le cambian el comportamiento. Pero **no te los llevas todos** — cada skill tiene **tres ranuras** de especialización, y la tercera está cerrada hasta el nivel 16. Eliges qué metes en cada una y lo que dejes fuera se queda apagado.",
          en: "Levelling a skill does more than raise its number: at **levels 8, 12 and 16** each one unlocks effects that change how it behaves. But **you do not get them all** — each skill has **three specialty slots**, and the third stays locked until level 16. You choose what goes in each one, and whatever you leave out stays dark.",
        },
        {
          es: "Los efectos y los niveles salen del volcado del cliente del juego, así que son exactos. La marca **✓** señala lo que recomienda esta guía; el porcentaje de la derecha es otra cosa: **cuántos de los 662 Gladiators medidos graban esa skill en el anillo**.",
          en: "The effects and levels come from the game client dump, so they are exact. The **✓** marks what this guide recommends; the percentage on the right is a different thing: **how many of the 662 measured Gladiators engrave that skill on their ring**.",
        },
      ],
      bloques: [
        {
          t: "especialidades",
          items: [
            {
              nombre: { es: "Machaque descendente", en: "Overhead Slam" },
              ko: "내려찍기",
              icono: "https://aion2t.com/db-item-icons/ICON_GL_SKILL_017.webp",
              anillo: 65.1,
              nota: { es: "La más grabada de todas. Su nivel 16 es de las cosas más fuertes que tiene la clase.", en: "The most engraved of them all. Its level 16 is one of the strongest things the class has." },
              opciones: [
                { nivel: 8, alternativa: true, recomendada: true, efecto: { es: "Roba un 0,7% de vida", en: "Absorbs 0.7% HP" } },
                { nivel: 8, alternativa: true, efecto: { es: "Pasa a golpear en área", en: "Changes to an AoE skill" } },
                { nivel: 8, alternativa: true, efecto: { es: "Añade la cadena [Golpe ascendente]", en: "Adds the [Upward Strike] chain skill" } },
                { nivel: 12, efecto: { es: "Crítico garantizado al acertar", en: "Guaranteed critical hit on hit" } },
                { nivel: 16, recomendada: true, efecto: { es: "**Borra el tiempo de recarga**", en: "**Removes the cooldown**" } },
              ],
            },
            {
              nombre: { es: "Embate de perdición", en: "Ruinous Blow" },
              ko: "파멸의 맹타",
              icono: "https://aion2t.com/db-item-icons/ICON_GL_SKILL_010.webp",
              anillo: 63.4,
              nota: { es: "Con la que entras al jefe. Los tres efectos de nivel 8 tiran hacia sitios distintos.", en: "The one you open on the boss with. Its three level-8 effects pull in different directions." },
              opciones: [
                { nivel: 8, alternativa: true, recomendada: true, efecto: { es: "+20% de velocidad de skill", en: "+20% skill speed" } },
                { nivel: 8, alternativa: true, recomendada: true, efecto: { es: "+12,5 m de alcance", en: "+12.5m range" } },
                { nivel: 8, alternativa: true, efecto: { es: "+30% de crítico de la skill", en: "+30% skill critical hit" } },
                { nivel: 12, efecto: { es: "Daño extra al acertar", en: "Extra damage on hit" } },
                { nivel: 16, recomendada: true, efecto: { es: "**Golpes múltiples que ignoran bloqueo y evasión**", en: "**Lands as Multi-Hit, ignoring block and evasion**" } },
              ],
            },
            {
              nombre: { es: "Embate cortante", en: "Rending Blow" },
              ko: "절단의 맹타",
              icono: "https://aion2t.com/db-item-icons/ICON_GL_SKILL_001.webp",
              anillo: 63.0,
              nota: { es: "El relleno que te sostiene el espíritu. Sus efectos van de aguantar, no de pegar.", en: "The filler that keeps your spirit up. Its effects are about holding on, not hitting." },
              opciones: [
                { nivel: 8, alternativa: true, efecto: { es: "−20% de espíritu consumido", en: "−20% MP consumed" } },
                { nivel: 8, alternativa: true, efecto: { es: "+200 de bloqueo mientras la usas", en: "+200 block while using it" } },
                { nivel: 8, alternativa: true, efecto: { es: "Se puede usar en movimiento", en: "Becomes usable while moving" } },
                { nivel: 12, efecto: { es: "Hasta +12% de daño cuantos menos enemigos haya", en: "Up to +12% damage the fewer targets you hit" } },
                { nivel: 16, efecto: { es: "Recupera 50 de espíritu al crítico", en: "Restores 50 MP on a critical hit" } },
              ],
            },
            {
              nombre: { es: "Onda trituradora", en: "Crushing Wave" },
              ko: "분쇄 파동",
              icono: "https://aion2t.com/db-item-icons/ICON_GL_SKILL_005.webp",
              anillo: 51.9,
              nota: { es: "**Su nivel 12 es la razón de toda la rotación de campo:** al crítico se reinicia y la vuelves a lanzar.", en: "**Its level 12 is why the whole open-world rotation works:** on a crit it resets and you throw it again." },
              opciones: [
                { nivel: 8, alternativa: true, recomendada: true, efecto: { es: "Roba un 2% de vida", en: "Absorbs 2% HP" } },
                { nivel: 8, alternativa: true, efecto: { es: "Recupera 50 de espíritu al crítico", en: "Restores 50 MP on a critical hit" } },
                { nivel: 8, alternativa: true, recomendada: true, efecto: { es: "Hasta +20% de daño cuantos más enemigos haya", en: "Up to +20% damage the more targets you hit" } },
                { nivel: 12, recomendada: true, efecto: { es: "**Reinicia su propia recarga al crítico**", en: "**Resets its own cooldown on a critical hit**" } },
                { nivel: 16, efecto: { es: "50% de probabilidad de atraer al enemigo", en: "50% chance to pull the enemy in" } },
              ],
            },
            {
              nombre: { es: "Golpe afilado", en: "Keen Strike" },
              ko: "예리한 일격",
              icono: "https://aion2t.com/db-item-icons/ICON_GL_SKILL_002.webp",
              anillo: 31.7,
              nota: { es: "**De esta sabemos lo que elige un jugador de cabeza**, porque publicó la captura: se queda con los golpes múltiples y con la recarga, y deja fuera el espíritu y el robo de vida.", en: "**For this one we know what a top player picks**, because he posted the screenshot: he keeps Multi-Hit and the cooldown, and leaves the MP and the lifesteal out." },
              opciones: [
                { nivel: 8, alternativa: true, efecto: { es: "+20% de espíritu recuperado", en: "+20% MP restored" } },
                { nivel: 8, alternativa: true, efecto: { es: "Roba un 1% de vida", en: "Absorbs 1% HP" } },
                { nivel: 8, alternativa: true, recomendada: true, efecto: { es: "+50% de golpes múltiples al acertar", en: "+50% Multi-Hit on hit" } },
                { nivel: 12, recomendada: true, efecto: { es: "**−1 s de recarga al Embate de perdición** al acertar", en: "**−1s Ruinous Blow cooldown** on hit" } },
                { nivel: 16, efecto: { es: "Añade la cadena [Golpe temerario]", en: "Adds the [Reckless Strike] chain skill" } },
              ],
            },
            {
              nombre: { es: "Danza de filos", en: "Sword Aura Rampage" },
              ko: "검기난무",
              icono: "https://aion2t.com/db-item-icons/ICON_TE_SKILL_034.webp",
              anillo: 31.1,
              nota: { es: "La primera de la build en PvE. Su nivel 16 le baja un segundo a **todas** tus recargas.", en: "First in the PvE build. Its level 16 takes a second off **every** cooldown you have." },
              opciones: [
                { nivel: 8, alternativa: true, recomendada: true, efecto: { es: "Roba un 5% de vida", en: "Absorbs 5% HP" } },
                { nivel: 8, alternativa: true, efecto: { es: "Recupera 120 de espíritu", en: "Restores 120 MP" } },
                { nivel: 8, alternativa: true, efecto: { es: "Se puede usar en movimiento", en: "Becomes usable while moving" } },
                { nivel: 12, recomendada: true, efecto: { es: "Golpes múltiples al acertar", en: "Multi-Hit on hit" } },
                { nivel: 16, recomendada: true, efecto: { es: "**−1 s a todas tus recargas** al acertar", en: "**−1s to all your cooldowns** on hit" } },
              ],
            },
            {
              nombre: { es: "Espada arrasadora", en: "Mocking Blade" },
              ko: "유린의 검",
              icono: "https://aion2t.com/db-item-icons/ICON_GL_SKILL_028.webp",
              nota: { es: "La de rematar en campo. Contra un enemigo inmune al control roba un 15% de vida, no un 4%.", en: "The finisher in the open world. Against a control-immune target it absorbs 15% HP, not 4%." },
              opciones: [
                { nivel: 8, alternativa: true, recomendada: true, efecto: { es: "Roba un 4% de vida — un **15%** si el objetivo es inmune al control", en: "Absorbs 4% HP — **15%** if the target has incapacitated immunity" } },
                { nivel: 8, alternativa: true, efecto: { es: "El golpe al suelo pasa a hacer daño en área", en: "The down strike becomes AoE damage" } },
                { nivel: 8, alternativa: true, efecto: { es: "Añade 2 golpes más", en: "Adds 2 more strikes" } },
                { nivel: 12, efecto: { es: "+1 s de derribo", en: "+1s knockdown duration" } },
                { nivel: 16, efecto: { es: "Golpes múltiples que ignoran bloqueo y evasión", en: "Lands as Multi-Hit, ignoring block and evasion" } },
              ],
            },
            {
              nombre: { es: "Grillete aéreo", en: "Aerial Snare" },
              ko: "공중 결박",
              icono: "https://aion2t.com/db-item-icons/ICON_GL_SKILL_015.webp",
              nota: { es: "**No está en la build de arriba, y en Corea dicen que debería.** Ver el aviso de abajo.", en: "**It is not in the build above, and in Korea they say it should be.** See the note below." },
              opciones: [
                { nivel: 8, alternativa: true, efecto: { es: "Golpes múltiples al acertar", en: "Multi-Hit on hit" } },
                { nivel: 8, alternativa: true, efecto: { es: "+25% de probabilidad de levantar por el aire", en: "+25% airborne chance" } },
                { nivel: 8, alternativa: true, efecto: { es: "+100% de daño contra enemigos inmunes al control", en: "+100% damage against control-immune targets" } },
                { nivel: 12, efecto: { es: "Añade la cadena [Caída forzada]", en: "Adds the [Forced Fall] chain skill" } },
                { nivel: 16, efecto: { es: "−50% de tiempo de recarga", en: "−50% cooldown" } },
              ],
            },
          ],
        },
        {
          t: "aviso",
          parrafos: [
            {
              es: "**Lo del Grillete aéreo viene del tablón coreano, no de una medición.** El jugador que publicó el montaje que lidera el medidor dice que la mete sí o sí: que a nivel 14 pega más que el Machaque descendente, que saca **cuatro veces más barra de groggy**, y que entre usarla y no usarla hay unos 50.000-100.000 de DPS. Es la build de una persona, no el porcentaje de 662 — pero es la única pista pública que hay sobre qué especializaciones elegir.",
              en: "**The Aerial Snare note comes from the Korean board, not from a measurement.** The player behind the setup that tops the meter says he always slots it: at level 14 it hits harder than Overhead Slam, builds **four times more groggy gauge**, and running it versus not is worth some 50,000-100,000 DPS. It is one person's build, not a percentage out of 662 — but it is the only public hint on which specialties to pick.",
            },
            {
              es: "**Nadie publica el porcentaje de adopción de las especializaciones.** Ni cielui ni la web oficial: se puede medir lo que la gente lleva puesto encima, pero no lo que ha elegido dentro de cada skill. Lo único de primera mano son las capturas que publican los propios jugadores de cabeza — de ahí sale lo del Golpe afilado. El resto, de momento, es probarlo en el muñeco.",
              en: "**Nobody publishes adoption rates for specialties.** Neither cielui nor the official site: what people wear can be measured, what they picked inside each skill cannot. The only first-hand material is the screenshots top players post themselves — that is where the Keen Strike pick comes from. The rest, for now, is testing it on the dummy.",
            },
          ],
        },
      ],
    },

    // ── 7. Pasivas y estigmas ───────────────────────────────────
    {
      eyebrow: { es: "Pasivas y estigmas", en: "Passives and stigmas" },
      titulo: { es: "Lo que no se ve pero se nota", en: "What you cannot see but do feel" },
      intro: [
        {
          es: "El orden de abajo no lo hemos decidido nosotros: es **el porcentaje de 662 Gladiators de élite que graba cada pasiva**, pieza por pieza. Y hay una sorpresa — la que más se lleva no es la que sube el daño plano.",
          en: "The order below is not our call: it is **the percentage of 662 top Gladiators who engrave each passive**, slot by slot. And there is a surprise — the most-used one is not the flat damage boost.",
        },
        {
          es: "Las pasivas no aparecen en la barra, pero son la mitad de tu daño. Y ojo con esto: **también se meten como grabados en el equipo** — por eso en la tabla de stats verás nombres de pasivas entre las opciones de casco, peto y guantes.",
          en: "Passives never show on your bar, but they are half your damage. And note this: **they also slot as engravings on gear** — which is why you will spot passive names among the helmet, chest and glove options in the stats table.",
        },
      ],
      bloques: [
        {
          t: "skills",
          items: [
            {
              orden: { es: "62,5%", en: "62.5%" },
              nombre: { es: "Contraataque veterano", en: "Veteran Counter" },
              ko: "노련한 반격",
              icono: "https://aion2t.com/db-item-icons/ICON_GL_SKILL_Passive_008.webp",
              puntos: [
                { es: "**La más grabada de la clase, y por goleada.** No baja del 60% en ninguna pieza.", en: "**The most engraved passive in the class, by a mile.** It never drops below 60% on any slot." },
                { es: "Al bloquear: **+5,4% de daño PvE** durante 20 segundos **para ti y para tu grupo**", en: "On block: **+5.4% PvE damage** for 20 seconds **for you and your party**" },
                { es: "+0,4% de daño por ataque frontal", en: "+0.4% front attack damage" },
                { es: "No se acumula con la Furia del Templar — si lleváis los dos, uno sobra", en: "Does not stack with a Templar's Fury — if you both run it, one is wasted" },
                { es: "Se desbloquea a nivel 21", en: "Unlocks at level 21" },
              ],
            },
            {
              orden: { es: "55,6%", en: "55.6%" },
              nombre: { es: "Preparación de ataque", en: "Attack Readiness" },
              ko: "공격 준비",
              icono: "https://aion2t.com/db-item-icons/ICON_GL_SKILL_Passive_005.webp",
              puntos: [
                { es: "**No tiene condición: está encendida siempre.** Eso la hace la más fácil de aprovechar.", en: "**No condition to meet: it is always on.** That makes it the easiest one to get value from." },
                { es: "+5,5% de daño PvE, +2% de defensa y +100 de precisión", en: "+5.5% PvE damage, +2% defence and +100 accuracy" },
                { es: "Se desbloquea a nivel 13", en: "Unlocks at level 13" },
              ],
            },
            {
              orden: { es: "54,6%", en: "54.6%" },
              nombre: { es: "Estallido de sed de sangre", en: "Bloodlust Burst" },
              ko: "살기 파열",
              icono: "https://aion2t.com/db-item-icons/ICON_GL_SKILL_Passive_010.webp",
              puntos: [
                { es: "**Premia pegar mucho, que es justo lo que hace un Gladiator.** Encaja con cancelar el básico.", en: "**It rewards hitting a lot, which is exactly what a Gladiator does.** It pairs with auto-cancelling." },
                { es: "Cada golpe acumula Amenaza; a las **5 acumulaciones estalla** en área contra 4 enemigos", en: "Each hit stacks Menace; at **5 stacks it bursts** in an area against 4 enemies" },
                { es: "El estallido te deja +5,5% de daño crítico durante 3 segundos", en: "The burst leaves you +5.5% critical damage for 3 seconds" },
                { es: "Se desbloquea a nivel 25", en: "Unlocks at level 25" },
              ],
            },
            {
              orden: { es: "50,9%", en: "50.9%" },
              nombre: { es: "Impacto certero", en: "Impact Hit" },
              ko: "충격 적중",
              icono: "https://aion2t.com/db-item-icons/ICON_GL_SKILL_Passive_006.webp",
              puntos: [
                { es: "+11,2% de probabilidad de impacto y +0,3% de doble golpe", en: "+11.2% Impact-type chance and +0.3% double chance" },
                { es: "**Es la cuarta y se nota:** en collar y pendiente sube al 64%, en pantalón y capa baja al 35%. Cuando hay que sacrificar una, cae esta.", en: "**It is the fourth and you can tell:** 64% on necklace and earring, 35% on pants and cape. When something has to go, this is what goes." },
                { es: "Se desbloquea a nivel 15", en: "Unlocks at level 15" },
              ],
            },
            {
              orden: { es: "20,2%", en: "20.2%" },
              nombre: { es: "Detectar debilidad", en: "Weak Point Detection" },
              ko: "약점 파악",
              icono: "https://aion2t.com/db-item-icons/ICON_GL_SKILL_Passive_004.webp",
              puntos: [
                { es: "**Esta no va en todas las piezas, y ahí está el truco.** La élite la graba en **pendiente (54%) y collar (50%)**, y casi nunca en pantalón (2%), capa (3%) o casco (5%).", en: "**This one does not go on every slot, and that is the trick.** Top players engrave it on **earring (54%) and necklace (50%)**, and almost never on pants (2%), cape (3%) or helmet (5%)." },
                { es: "+100 de crítico y +0,5% de perfección", en: "+100 critical hit and +0.5% perfect chance" },
                { es: "Se desbloquea a nivel 11 — la primera que tendrás", en: "Unlocks at level 11 — the first one you will get" },
              ],
            },
            {
              orden: { es: "2,6%", en: "2.6%" },
              nombre: { es: "Postura de supervivencia", en: "Survival Stance" },
              ko: "생존 자세",
              icono: "https://aion2t.com/db-item-icons/ICON_GL_SKILL_026.webp",
              puntos: [
                { es: "**Casi nadie la graba, y no es por despiste.** El hueco vale más con daño.", en: "**Almost nobody engraves it, and it is not an oversight.** The slot is worth more with damage on it." },
                { es: "+200 de vida, +7% de vida máxima y +5,5% de aguante en PvE", en: "+200 HP, +7% max HP and +5.5% PvE damage tolerance" },
                { es: "Tiene sentido si haces de tanque de apoyo o vas muy justo de vida en una mazmorra dura", en: "It makes sense if you off-tank or you are dying in a hard dungeon" },
              ],
            },
          ],
        },
        {
          t: "tabla",
          cabeceras: [
            { es: "Pieza", en: "Slot" },
            { es: "Contraataque", en: "Veteran C." },
            { es: "Preparación", en: "Attack R." },
            { es: "Sed de sangre", en: "Bloodlust" },
            { es: "Impacto", en: "Impact" },
            { es: "Detectar deb.", en: "Weak Point" },
          ],
          filas: [
            [{ es: "**Pendiente**", en: "**Earring**" }, { es: "65%", en: "65%" }, { es: "65%", en: "65%" }, { es: "64%", en: "64%" }, { es: "64%", en: "64%" }, { es: "**54%**", en: "**54%**" }],
            [{ es: "**Collar**", en: "**Necklace**" }, { es: "65%", en: "65%" }, { es: "64%", en: "64%" }, { es: "62%", en: "62%" }, { es: "62%", en: "62%" }, { es: "**50%**", en: "**50%**" }],
            [{ es: "Hombreras", en: "Shoulder" }, { es: "64%", en: "64%" }, { es: "62%", en: "62%" }, { es: "60%", en: "60%" }, { es: "59%", en: "59%" }, { es: "25%", en: "25%" }],
            [{ es: "Peto", en: "Torso" }, { es: "61%", en: "61%" }, { es: "59%", en: "59%" }, { es: "56%", en: "56%" }, { es: "57%", en: "57%" }, { es: "26%", en: "26%" }],
            [{ es: "Casco", en: "Helmet" }, { es: "62%", en: "62%" }, { es: "55%", en: "55%" }, { es: "55%", en: "55%" }, { es: "48%", en: "48%" }, { es: "5%", en: "5%" }],
            [{ es: "Guantes", en: "Gloves" }, { es: "62%", en: "62%" }, { es: "56%", en: "56%" }, { es: "54%", en: "54%" }, { es: "48%", en: "48%" }, { es: "8%", en: "8%" }],
            [{ es: "Botas", en: "Boots" }, { es: "63%", en: "63%" }, { es: "54%", en: "54%" }, { es: "50%", en: "50%" }, { es: "48%", en: "48%" }, { es: "8%", en: "8%" }],
            [{ es: "Pantalón", en: "Pants" }, { es: "60%", en: "60%" }, { es: "42%", en: "42%" }, { es: "44%", en: "44%" }, { es: "36%", en: "36%" }, { es: "2%", en: "2%" }],
            [{ es: "Capa", en: "Cape" }, { es: "61%", en: "61%" }, { es: "42%", en: "42%" }, { es: "46%", en: "46%" }, { es: "34%", en: "34%" }, { es: "3%", en: "3%" }],
          ],
        },
        {
          t: "parrafo",
          texto: {
            es: "**Detectar debilidad es la excepción que explica la tabla.** En collar y pendiente la lleva la mitad de la élite; en pantalón y capa, dos de cada cien. La lectura es simple: en los accesorios caben las cinco, y en la armadura hay que elegir — y ahí gana siempre el daño de las cuatro primeras.",
            en: "**Weak Point Detection is the exception that explains the table.** Half of the top players run it on necklace and earring; on pants and cape, two in a hundred. The reading is simple: accessories fit all five, armour makes you choose — and the damage of the first four always wins there.",
          },
        },
        {
          t: "parrafo",
          texto: {
            es: "**Los estigmas se cambian según lo que vayas a hacer.** Intentar cubrirlo todo con un solo montaje deja el daño y la supervivencia a medias:",
            en: "**Stigmas get swapped for what you are about to do.** Trying to cover everything with one setup leaves both damage and survival halfway:",
          },
        },
        {
          t: "tarjetas",
          columnas: 3,
          items: [
            {
              titulo: { es: "Jefe normal", en: "Standard boss" },
              sub: { es: "El montaje de todos los días", en: "The everyday setup" },
              puntos: [
                { es: "**Postura de carga**", en: "**Charge Stance**" },
                { es: "**Bendición de Zikel**", en: "**Zikel's Blessing**" },
                { es: "Bloqueo concentrado", en: "Focused Block" },
                { es: "Aguante o Armadura de ondas", en: "Grit or Wave Armour" },
              ],
            },
            {
              titulo: { es: "Mazmorra con groggy", en: "Dungeon with groggy" },
              sub: { es: "Cuando el jefe se queda aturdido", en: "When the boss gets stunned" },
              puntos: [
                { es: "**Postura de carga**", en: "**Charge Stance**" },
                { es: "**Bendición de Zikel**", en: "**Zikel's Blessing**" },
                { es: "Un estigma ofensivo de groggy", en: "An offensive groggy stigma" },
                { es: "Bloqueo concentrado o Aguante", en: "Focused Block or Grit" },
              ],
            },
            {
              titulo: { es: "Mazmorra dura", en: "Hard dungeon" },
              sub: { es: "Cuando el problema es sobrevivir", en: "When surviving is the problem" },
              puntos: [
                { es: "**Postura de carga**", en: "**Charge Stance**" },
                { es: "Bloqueo concentrado", en: "Focused Block" },
                { es: "Aguante", en: "Grit" },
                { es: "Armadura de ondas", en: "Wave Armour" },
              ],
            },
          ],
        },
        {
          t: "aviso",
          parrafos: [
            {
              es: "**Postura de carga es el estigma que va en los tres.** Mejora la rotación y la resistencia en combate: si vas a mejorar uno, ese.",
              en: "**Charge Stance is the stigma that appears in all three.** It improves rotation and staying power: if you are only going to upgrade one, upgrade that.",
            },
            {
              es: "**Bendición de Zikel no se pulsa en cuanto está lista.** Se guarda para justo antes de que el jefe entre en groggy o para cuando el grupo va a concentrar daño. Soltarla a destiempo es tirar la mitad de su valor.",
              en: "**Zikel's Blessing is not pressed the moment it is off cooldown.** Save it for right before the boss goes groggy, or for when the group is about to burst. Firing it early throws away half its value.",
            },
          ],
        },
      ],
    },

    // ── 8. La macro ─────────────────────────────────────────────
    {
      eyebrow: { es: "La macro", en: "The macro" },
      titulo: { es: "Cómo se juega de verdad al Gladiator", en: "How the Gladiator is actually played" },
      intro: [
        {
          es: "Aion 2 trae **una macro de habilidades dentro del juego**: metes skills en orden, le pones un retardo en milisegundos y salen con un solo botón. En Corea nadie juega al Gladiator sin ella, y su termómetro no es el DPS — es el **número de golpes por minuto**, lo que ellos llaman «tasu».",
          en: "Aion 2 ships **a skill macro inside the game**: you queue skills in order, set a delay in milliseconds and they fire off one button. In Korea nobody plays Gladiator without it, and their yardstick is not DPS — it is **hits per minute**, what they call «tasu».",
        },
        {
          es: "**98 golpes es el techo práctico.** Si te quedas en 78-86, el problema casi nunca es tu equipo: es la configuración o el ordenador.",
          en: "**98 hits is the practical ceiling.** If you are stuck at 78-86, the problem is almost never your gear: it is the setup or the computer.",
        },
      ],
      bloques: [
        {
          t: "tarjetas",
          columnas: 2,
          items: [
            {
              titulo: { es: "La del juego", en: "The in-game one" },
              sub: { es: "Menú de habilidades → Macro de habilidades", en: "Skills menu → Skill macro" },
              ordenada: true,
              puntos: [
                { es: "Tienes **tres macros** (pestañas 1, 2 y 3) y a cada una le metes las skills en orden", en: "You get **three macros** (tabs 1, 2 and 3) and you queue skills into each in order" },
                { es: "Cada macro lleva su **retardo en milisegundos**. En la captura de referencia: **10 ms**", en: "Each macro carries its own **delay in milliseconds**. In the reference screenshot: **10 ms**" },
                { es: "La combinación que publica la referencia es **Golpe afilado → Embate cortante**", en: "The combination the reference publishes is **Keen Strike → Rending Blow**" },
                { es: "Se dispara con el botón que le asignes en Ajustes → Teclas → Barra rápida", en: "It fires with whatever key you bind in Settings → Keys → Quickslots" },
              ],
              nota: { es: "Es una función del propio juego. Esta es la vía limpia.", en: "It is a feature of the game itself. This is the clean route." },
            },
            {
              titulo: { es: "La del ratón", en: "The mouse one" },
              sub: { es: "Software del ratón — Razer, Logitech…", en: "Mouse software — Razer, Logitech…" },
              ordenada: true,
              puntos: [
                { es: "Va en el **clic derecho**, y se mantiene pulsado", en: "It goes on **right click**, held down" },
                { es: "El orden que publica la referencia: **Golpe afilado** → Estallido de furia, Espada vampírica, Grillete aéreo, Machaque descendente → **Danza de filos**", en: "The order the reference publishes: **Keen Strike** → Rage Burst, Lifestealing Blade, Aerial Snare, Overhead Slam → **Sword Aura Rampage**" },
                { es: "Retardo de **1 ms**; si tu PC se atraganta, súbelo a 2 o más", en: "**1 ms** delay; if your PC chokes, raise it to 2 or more" },
                { es: "**Separa los buffs del Machaque descendente.** Juntos no cancela y pierdes golpes", en: "**Keep the buffs away from Overhead Slam.** Together it does not cancel and you lose hits" },
              ],
              nota: { es: "Ojo: esto es software de terceros automatizando el combate, no una función del juego. Lo usa media Corea a la vista de todos, pero el riesgo es tuyo.", en: "Careful: this is third-party software automating combat, not a game feature. Half of Korea uses it in the open, but the risk is yours." },
            },
          ],
        },
        { t: "subtitulo", texto: { es: "Cuánta velocidad de combate hace falta", en: "How much combat speed you need" } },
        {
          t: "parrafo",
          texto: {
            es: "Un jugador midió los golpes de un minuto bajando la velocidad de combate poco a poco, tres pasadas por cada valor. La conclusión es tajante: **por encima del 101% ya no ganas nada, y por debajo del 100% empiezas a perder de verdad.**",
            en: "A player counted a full minute of hits while stepping combat speed down, three runs per value. The conclusion is blunt: **above 101% you gain nothing, and below 100% you start losing for real.**",
          },
        },
        {
          t: "tabla",
          cabeceras: [
            { es: "Velocidad", en: "Speed" },
            { es: "Golpe ascendente", en: "Upward Strike" },
            { es: "Machaque desc.", en: "Overhead Slam" },
            { es: "Embate cortante", en: "Rending Blow" },
            { es: "Total", en: "Total" },
          ],
          filas: [
            [{ es: "111,6%", en: "111.6%" }, { es: "98", en: "98" }, { es: "197", en: "197" }, { es: "180", en: "180" }, { es: "1.015", en: "1,015" }],
            [{ es: "106,6%", en: "106.6%" }, { es: "98", en: "98" }, { es: "197", en: "197" }, { es: "181", en: "181" }, { es: "**1.016**", en: "**1,016**" }],
            [{ es: "**101,6%**", en: "**101.6%**" }, { es: "97", en: "97" }, { es: "194", en: "194" }, { es: "177", en: "177" }, { es: "**1.009**", en: "**1,009**" }],
            [{ es: "99,6%", en: "99.6%" }, { es: "95", en: "95" }, { es: "191", en: "191" }, { es: "173", en: "173" }, { es: "995", en: "995" }],
            [{ es: "97,6%", en: "97.6%" }, { es: "93", en: "93" }, { es: "188", en: "188" }, { es: "172", en: "172" }, { es: "983", en: "983" }],
            [{ es: "96,1%", en: "96.1%" }, { es: "92", en: "92" }, { es: "186", en: "186" }, { es: "169", en: "169" }, { es: "976", en: "976" }],
            [{ es: "94,6%", en: "94.6%" }, { es: "91", en: "91" }, { es: "183", en: "183" }, { es: "166", en: "166" }, { es: "965", en: "965" }],
            [{ es: "92,6%", en: "92.6%" }, { es: "88", en: "88" }, { es: "177", en: "177" }, { es: "161", en: "161" }, { es: "943", en: "943" }],
            [{ es: "90,9%", en: "90.9%" }, { es: "87", en: "87" }, { es: "176", en: "176" }, { es: "157", en: "157" }, { es: "934", en: "934" }],
            [{ es: "85,9%", en: "85.9%" }, { es: "84", en: "84" }, { es: "170", en: "170" }, { es: "154", en: "154" }, { es: "918", en: "918" }],
          ],
        },
        {
          t: "aviso",
          parrafos: [
            {
              es: "**De 101,6% a 111,6% ganas 6 golpes de mil.** Seis. Por eso la velocidad de combate está al 100% en todas las listas de stats y ahí se queda: pasado ese punto, cada punto que metas es un punto que le quitas al daño. Al revés sí duele — bajar al 90,9% te cuesta **75 golpes por minuto**.",
              en: "**From 101.6% to 111.6% you gain 6 hits out of a thousand.** Six. That is why combat speed sits at 100% on every stat list and stops there: past that point, every point you add is a point taken from damage. Downwards it does hurt — dropping to 90.9% costs you **75 hits per minute**.",
            },
          ],
        },
        { t: "subtitulo", texto: { es: "Lo que no va en la macro", en: "What does not go in the macro" } },
        {
          t: "tarjetas",
          columnas: 3,
          items: [
            {
              titulo: { es: "Los buffs y el bloqueo", en: "Buffs and blocking" },
              sub: { es: "A mano, mirando", en: "By hand, watching" },
              puntos: [
                { es: "La Bendición de Zikel y el bloqueo **se pulsan tú**, viendo lo que hace el jefe", en: "Zikel's Blessing and blocking are **pressed by you**, watching what the boss does" },
                { es: "Si los metes en la macro salen a destiempo y llegas al jefe con todo en recarga", en: "Put them in the macro and they fire early, so you reach the boss with everything on cooldown" },
                { es: "Para usar un buff, **suelta el clic derecho** primero", en: "To use a buff, **let go of right click** first" },
              ],
            },
            {
              titulo: { es: "El ataque básico", en: "The basic attack" },
              sub: { es: "No se pulsa", en: "You do not press it" },
              puntos: [
                { es: "Contra un jefe **no se usa**: solo contra bichos pequeños", en: "Against a boss you **do not use it**: only against small mobs" },
                { es: "Su sitio lo ocupa la cancelación, que es lo que sube el número de golpes", en: "Its place is taken by cancelling, which is what raises your hit count" },
              ],
            },
            {
              titulo: { es: "El Embate cortante suelto", en: "Rending Blow on its own key" },
              sub: { es: "El error que sube el muñeco", en: "The mistake that inflates the dummy" },
              puntos: [
                { es: "Sacarlo a su propia tecla **sube el número en el muñeco**", en: "Moving it to its own key **raises the dummy number**" },
                { es: "Pero contra un jefe con mecánicas **pierdes DPS**: a un jugador le subió **22 segundos** el tiempo de Atheron pesadilla", en: "But against a boss with mechanics **you lose DPS**: one player added **22 seconds** to his nightmare Atheron clear" },
                { es: "Déjalo dentro, encima del Machaque descendente", en: "Leave it inside, above Overhead Slam" },
              ],
            },
          ],
        },
        {
          t: "aviso",
          parrafos: [
            {
              es: "**Si no llegas a los golpes, mira el ordenador antes que el equipo.** El autor de la guía de referencia lo midió: con unos **100 FPS estables y sin tirones** salen 98 golpes con cualquier ratón, incluso con la velocidad de combate al 86%. En los comentarios hay gente con equipos de 900.000 de poder sacando 78 golpes — y uno que, solo arreglando la configuración, pasó de 86 a 96 y **ganó entre 200.000 y 300.000 de DPS**.",
              en: "**If you are not hitting the numbers, look at the computer before the gear.** The author of the reference guide measured it: with around **100 stable FPS and no stutter** you get 98 hits with any mouse, even at 86% combat speed. In the comments there are players with 900,000 power output sitting at 78 hits — and one who, just by fixing his setup, went from 86 to 96 and **gained 200,000-300,000 DPS**.",
            },
            {
              es: "**Y ojo con esto: el montaje del muñeco no es el de la mazmorra.** La referencia lleva dos árboles de habilidades y avisa de ello tres veces en su propio hilo: uno para hacer números en el muñeco y otro para entrar a mazmorra de verdad. Si copias el del muñeco y te vas a un jefe, vas a ir peor que antes.",
              en: "**And watch this: the dummy setup is not the dungeon setup.** The reference runs two skill trees and says so three times in his own thread: one to post numbers on the dummy and one to actually enter a dungeon. Copy the dummy one into a boss fight and you will do worse than before.",
            },
          ],
        },
      ],
    },

    // ── 9. Rotación ─────────────────────────────────────────────
    {
      eyebrow: { es: "Rotación", en: "Rotation" },
      titulo: { es: "El orden de los golpes", en: "The order of your swings" },
      intro: [
        {
          es: "No es una secuencia fija que se repite: es **una lista de prioridades** en la que vas encajando lo que tengas disponible. Y por encima de todo manda una regla — si el Machaque descendente se activa, va antes que nada.",
          en: "It is not a fixed loop you repeat: it is **a priority list** you slot available skills into. And one rule rules them all — if Downward Smash lights up, it goes before anything else.",
        },
      ],
      bloques: [
        {
          t: "rotacion",
          titulo: { es: "Apertura contra un jefe", en: "Boss opener" },
          cuando: { es: "Desde que entras hasta que la rotación se estabiliza", en: "From the pull until the rotation settles" },
          pasos: [
            { texto: { es: "Embate de perdición", en: "Doom Strike" }, nota: { es: "para entrar", en: "to close in" }, ko: "파멸의 맹타", icono: "https://aion2t.com/db-item-icons/ICON_GL_SKILL_010.webp" },
            { texto: { es: "Bendición de Zikel", en: "Zikel's Blessing" }, ko: "지켈의 축복", icono: "https://aion2t.com/db-item-icons/ICON_GL_SKILL_024.webp" },
            { texto: { es: "Onda trituradora", en: "Crushing Wave" }, ko: "분쇄 파동", icono: "https://aion2t.com/db-item-icons/ICON_GL_SKILL_005.webp" },
            { texto: { es: "Machaque descendente", en: "Downward Smash" }, nota: { es: "en cuanto se active", en: "the moment it lights up" }, clave: true, ko: "내려찍기", icono: "https://aion2t.com/db-item-icons/ICON_GL_SKILL_017.webp" },
            { texto: { es: "Embate cortante", en: "Severing Strike" }, ko: "절단의 맹타", icono: "https://aion2t.com/db-item-icons/ICON_GL_SKILL_001.webp" },
            { texto: { es: "Golpe afilado", en: "Keen Strike" }, nota: { es: "recupera espíritu", en: "recovers spirit" }, ko: "예리한 일격", icono: "https://aion2t.com/db-item-icons/ICON_GL_SKILL_002.webp" },
          ],
        },
        {
          t: "rotacion",
          titulo: { es: "Justo antes del groggy", en: "Right before the groggy" },
          cuando: { es: "Aquí es donde se gana o se pierde la mazmorra", en: "This is where the dungeon is won or lost" },
          pasos: [
            { texto: { es: "Comprueba tu buff activo", en: "Check your active buff" } },
            { texto: { es: "Bendición de Zikel", en: "Zikel's Blessing" }, ko: "지켈의 축복", icono: "https://aion2t.com/db-item-icons/ICON_GL_SKILL_024.webp" },
            { texto: { es: "Estigma de groggy", en: "Groggy stigma" } },
            { texto: { es: "Machaque descendente", en: "Downward Smash" }, clave: true, ko: "내려찍기", icono: "https://aion2t.com/db-item-icons/ICON_GL_SKILL_017.webp" },
            { texto: { es: "Onda trituradora", en: "Crushing Wave" }, ko: "분쇄 파동", icono: "https://aion2t.com/db-item-icons/ICON_GL_SKILL_005.webp" },
            { texto: { es: "Embate cortante", en: "Severing Strike" }, ko: "절단의 맹타", icono: "https://aion2t.com/db-item-icons/ICON_GL_SKILL_001.webp" },
            { texto: { es: "Danza de filos", en: "Blade Dance" }, ko: "검기난무", icono: "https://aion2t.com/db-item-icons/ICON_TE_SKILL_034.webp" },
          ],
        },
        {
          t: "rotacion",
          titulo: { es: "Farmeo de grupos en campo", en: "Open-world grinding" },
          cuando: { es: "Varios enemigos a la vez", en: "Several enemies at once" },
          pasos: [
            { texto: { es: "Onda trituradora", en: "Crushing Wave" }, clave: true, ko: "분쇄 파동", icono: "https://aion2t.com/db-item-icons/ICON_GL_SKILL_005.webp" },
            { texto: { es: "Golpe afilado", en: "Keen Strike" }, ko: "예리한 일격", icono: "https://aion2t.com/db-item-icons/ICON_GL_SKILL_002.webp" },
            { texto: { es: "¿Se reinició la Onda?", en: "Did the Wave reset?" }, nota: { es: "al crítico vuelve", en: "it returns on crit" } },
            { texto: { es: "Embate cortante", en: "Severing Strike" }, ko: "절단의 맹타", icono: "https://aion2t.com/db-item-icons/ICON_GL_SKILL_001.webp" },
            { texto: { es: "Espada arrasadora", en: "Ravaging Sword" }, nota: { es: "para rematar", en: "to finish" }, ko: "유린의 검", icono: "https://aion2t.com/db-item-icons/ICON_GL_SKILL_028.webp" },
          ],
        },
        {
          t: "aviso",
          parrafos: [
            {
              es: "**Si solo repites la Onda trituradora te quedas sin espíritu.** Por eso van el Golpe afilado y el Embate cortante intercalados: no son relleno, son los que te sostienen el recurso.",
              en: "**Spamming Crushing Wave alone drains your spirit.** That is why Keen Strike and Severing Strike sit in between: they are not filler, they are what keeps the resource up.",
            },
          ],
        },
        { t: "subtitulo", texto: { es: "Cancelar el ataque básico", en: "Cancelling the basic attack" } },
        {
          t: "parrafo",
          texto: {
            es: "El espadón tiene una animación lenta, y entre golpe y golpe se pierde tiempo muerto. La técnica consiste en **encadenar una skill justo cuando el ataque básico ya ha impactado**, para cortar la recuperación. No es aporrear la tecla.",
            en: "The greatsword has a slow animation and dead time creeps in between swings. The technique is **chaining a skill the instant the basic attack lands**, cutting the recovery. It is not mashing the key.",
          },
        },
        {
          t: "rotacion",
          titulo: { es: "Cómo se practica", en: "How to practise it" },
          cuando: { es: "En un muñeco de entrenamiento, sin prisa", en: "On a training dummy, no rush" },
          pasos: [
            { texto: { es: "Ataque básico", en: "Basic attack" }, nota: { es: "espera al impacto", en: "wait for the hit" } },
            { texto: { es: "Golpe afilado", en: "Keen Strike" }, ko: "예리한 일격", icono: "https://aion2t.com/db-item-icons/ICON_GL_SKILL_002.webp" },
            { texto: { es: "Ataque básico", en: "Basic attack" } },
            { texto: { es: "Embate cortante", en: "Severing Strike" }, ko: "절단의 맹타", icono: "https://aion2t.com/db-item-icons/ICON_GL_SKILL_001.webp" },
            { texto: { es: "Ataque básico", en: "Basic attack" } },
            { texto: { es: "Onda trituradora", en: "Crushing Wave" }, ko: "분쇄 파동", icono: "https://aion2t.com/db-item-icons/ICON_GL_SKILL_005.webp" },
          ],
        },
        {
          t: "parrafo",
          texto: {
            es: "Cuando cambies de equipo y te suba la velocidad de combate, **el ritmo cambia y hay que volver a cogerlo**. Y si estás empezando: aprende primero a esquivar los patrones del jefe y a no perderte el Machaque descendente. Esto viene después.",
            en: "When you swap gear and combat speed goes up, **the rhythm changes and you have to relearn it**. And if you are starting out: learn to dodge boss patterns and never miss Downward Smash first. This comes later.",
          },
        },
      ],
    },

    // ── 10. Errores ──────────────────────────────────────────────
    {
      eyebrow: { es: "Los tropiezos", en: "Common trips" },
      titulo: { es: "Errores que cuestan daño", en: "Mistakes that cost damage" },
      intro: [{ es: "Los siete que más se repiten, y qué hacer en su lugar:", en: "The seven most common ones, and what to do instead:" }],
      bloques: [
        {
          t: "tabla",
          cabeceras: [{ es: "El error", en: "The mistake" }, { es: "La solución", en: "The fix" }],
          filas: [
            [{ es: "Perderse la activación del Machaque descendente", en: "Missing the Downward Smash proc" }, { es: "En cuanto salte el aviso, va antes que cualquier otra skill", en: "The moment it lights up, it goes before any other skill" }],
            [{ es: "Pisar el buff del Embate de perdición con el Machaque en salto", en: "Overwriting the Doom Strike buff with Leaping Smash" }, { es: "Mira lo que queda del buff antes de usar el salto", en: "Check the remaining buff time before using the leap" }],
            [{ es: "Repetir solo la Onda trituradora hasta quedarse sin espíritu", en: "Spamming Crushing Wave until spirit runs dry" }, { es: "Intercala Golpe afilado y Embate cortante", en: "Weave in Keen Strike and Severing Strike" }],
            [{ es: "Subir solo opciones de ataque y quedarse corto de puntería", en: "Stacking only attack options and falling short on hit" }, { es: "Cubre primero la puntería que pide el contenido", en: "Cover the hit rating the content demands first" }],
            [{ es: "Intentar bloquear todos los ataques", en: "Trying to block every attack" }, { es: "Bloquea los golpes grandes, los de animación clara", en: "Block the big hits, the ones with clear animations" }],
            [{ es: "Aporrear la tecla creyendo que eso es cancelar el básico", en: "Mashing the key thinking that is auto-cancelling" }, { es: "Una pulsación por impacto, al ritmo del ataque", en: "One press per landed hit, on the attack's rhythm" }],
            [{ es: "Invertir de más en Danza de filos y otras de apoyo", en: "Over-investing in Blade Dance and other support skills" }, { es: "Primero las cuatro principales a 20", en: "Get the four mains to 20 first" }],
          ],
        },
      ],
    },

    // ── 11. Alas y mascota ───────────────────────────────────────
    {
      eyebrow: { es: "Alas y mascota", en: "Wings and pet" },
      titulo: { es: "Los dos huecos de fuera", en: "The two outside slots" },
      bloques: [
        {
          t: "tarjetas",
          columnas: 2,
          items: [
            {
              titulo: { es: "Alas", en: "Wings" },
              sub: { es: "Dato medido · sin discusión", en: "Measured data · no debate" },
              puntos: [
                { es: "**Alas de Talisra del vacío**", en: "**Void Talisra Wings**" },
                { es: "Son las recomendadas para **las ocho clases**, no solo para Gladiator", en: "They are the pick for **all eight classes**, not just Gladiator" },
                { es: "No hay decisión que tomar aquí: es el mismo par para todo el mundo", en: "There is no decision to make here: it is the same pair for everyone" },
              ],
            },
            {
              titulo: { es: "Mascota", en: "Pet" },
              sub: { es: "Lo que todavía no puedo confirmarte", en: "What I cannot confirm yet" },
              puntos: [
                { es: "La mascota da estadísticas y **se trabaja repartiendo entre dos opciones**", en: "The pet grants stats and **is tuned by splitting between two options**" },
                { es: "En la comunidad se discuten repartos entre **golpe fuerte** y **amplificación de daño**, y si en PvP conviene cambiarlos por **puntería**", en: "The community argues over splits between **heavy strike** and **damage amplification**, and whether PvP should swap them for **hit**" },
                { es: "No he encontrado una fuente medida que lo cierre, así que **aquí no te doy un número**", en: "I have not found a measured source that settles it, so **no number from me here**" },
              ],
            },
          ],
        },
        {
          t: "aviso",
          parrafos: [
            {
              es: "**Por qué la mascota se queda a medias.** De todo lo demás de esta guía hay datos: porcentajes de adopción de miles de jugadores, o guías de la comunidad con la mecánica explicada. De la mascota solo encontré discusiones sueltas en foros, sin números que se puedan verificar. Prefiero dejar el hueco marcado que rellenarlo a ojo.",
              en: "**Why the pet section stops short.** Everything else in this guide has data behind it: adoption rates from thousands of players, or community guides that explain the mechanic. For the pet I only found scattered forum arguments with no verifiable numbers. I would rather flag the gap than fill it by guesswork.",
            },
          ],
        },
      ],
    },

    // ── 12. Equipo ──────────────────────────────────────────────
    {
      eyebrow: { es: "Equipo", en: "Gear" },
      titulo: { es: "Lo que llevan puesto", en: "What they are wearing" },
      intro: [
        {
          es: "Las dos piezas más usadas en cada hueco, con el porcentaje de Gladiators de élite que las lleva:",
          en: "The two most-used pieces in each slot, with the percentage of top Gladiators running them:",
        },
      ],
      bloques: [
        {
          t: "tabla",
          cabeceras: [{ es: "Hueco", en: "Slot" }, { es: "Más usado", en: "Most used" }, { es: "%", en: "%" }, { es: "Alternativa", en: "Alternative" }],
          filas: [
            [{ es: "Arma", en: "Weapon" }, { es: "Hoja de exterminio de Rudra", en: "Rudra's Annihilation Blade" }, { es: "20,9", en: "20.9" }, { es: "Espadón brillante del Rey Dragón", en: "Shining Dragon King Greatsword" }],
            [{ es: "Secundaria", en: "Off-hand" }, { es: "Guarda del Rey Dragón", en: "Dragon King Guard" }, { es: "29,9", en: "29.9" }, { es: "Guarda brillante del Rey Dragón", en: "Shining Dragon King Guard" }],
            [{ es: "Armadura (las seis piezas)", en: "Armour (all six pieces)" }, { es: "Set del Vestigio erosionado", en: "Eroded Remnant set" }, { es: "40 – 53", en: "40 – 53" }, { es: "Set del Corazón de lava", en: "Lava Heart set" }],
            [{ es: "Brazalete", en: "Bracelet" }, { es: "Brazalete del Vestigio erosionado", en: "Eroded Remnant Bracelet" }, { es: "52,0", en: "52.0" }, { es: "Brazalete de Rudra", en: "Rudra's Bracelet" }],
            [{ es: "Broche", en: "Brooch" }, { es: "Broche de Kaldrix", en: "Kaldrix's Brooch" }, { es: "49,0", en: "49.0" }, { es: "Broche del Libertador", en: "Liberator's Brooch" }],
            [{ es: "Cinturón", en: "Belt" }, { es: "Cinturón de la nobleza", en: "Belt of Nobility" }, { es: "100", en: "100" }, { es: "— no hay debate", en: "— no debate" }],
            [{ es: "Amuleto", en: "Amulet" }, { es: "Amuleto de la revelación", en: "Amulet of Revelation" }, { es: "99,5", en: "99.5" }, { es: "— no hay debate", en: "— no debate" }],
            [{ es: "Colgante", en: "Pendant" }, { es: "Colgante dracónico", en: "Draconic Pendant" }, { es: "70,9", en: "70.9" }, { es: "", en: "" }],
            [{ es: "Runa", en: "Rune" }, { es: "Runa del choque", en: "Rune of Clashing" }, { es: "100", en: "100" }, { es: "— no hay debate", en: "— no debate" }],
            [{ es: "Alas", en: "Wings" }, { es: "Alas de Talisra del vacío", en: "Void Talisra Wings" }, { es: "—", en: "—" }, { es: "Las mismas para las ocho clases", en: "The same for all eight classes" }],
          ],
        },
        {
          t: "parrafo",
          texto: {
            es: "**El brazalete va aparte:** lleva grabados de los dioses, y hay cuatro que lleva prácticamente todo el mundo — Tiempo (velocidad de combate), Destrucción (ataque), Ilusión (menos recarga y penetración) y Sabiduría (menos consumo de espíritu). Justicia y Libertad son opcionales.",
            en: "**The bracelet is its own thing:** it carries the gods' engravings, and four of them are near-universal — Time (combat speed), Destruction (attack), Illusion (less cooldown and penetration) and Wisdom (less spirit drain). Justice and Freedom are optional.",
          },
        },
      ],
    },
  ],

  fuentes: [
    {
      es: "**De dónde sale todo esto.** Los porcentajes de equipo, stats y grabados vienen de una plataforma que mide el combate real del servidor coreano y agrega lo que llevan puesto 6.834 Gladiators; se actualiza a diario y estos datos son del 2 de septiembre. La prioridad de las pasivas y los grabados del anillo son de la misma plataforma, sobre **662 Gladiators de PvE**. El sistema de arcanas, las prioridades de skill, los estigmas y la rotación vienen de guías de la comunidad del juego, revisadas entre enero y agosto.",
      en: "**Where all this comes from.** The gear, stat and engraving percentages come from a platform that measures real combat on the Korean server and aggregates what 6,834 Gladiators have equipped; it updates daily and this snapshot is from 2 September. The passive priority and the ring engravings come from the same platform, over **662 PvE Gladiators**. The arcana system, skill priorities, stigmas and rotation come from community guides for the game, revised between January and August.",
    },
    {
      es: "**Las especializaciones salen del volcado del cliente del juego** (26 de agosto), que publica una base de datos extraída del propio juego: los efectos son exactos. Lo que NO existe en ninguna fuente pública es el porcentaje de gente que elige cada una — lo marcado con ✓ es lo que lleva la build de esta guía, y el añadido del Grillete aéreo es la build de un jugador del tablón coreano. Está señalado en su sitio.",
      en: "**The specialties come from the game client dump** (26 August), a database extracted from the game itself: the effects are exact. What does NOT exist in any public source is how many players pick each one — what is marked with ✓ is what this guide's build runs, and the Aerial Snare note is one player's build from the Korean board. It is flagged where it appears.",
    },
    {
      es: "**La macro y los golpes por minuto** salen del tablón coreano de la clase: la guía de configuración del 30 de agosto —la que tiene 346 respuestas—, su versión para la macro del propio juego, y la prueba de otro jugador que contó los golpes de un minuto a diez velocidades de combate distintas, tres pasadas por cada una. Son jugadores, no un laboratorio: los números son suyos y en su ordenador. La macro de ratón es software de terceros y no una función del juego; queda dicho donde aparece.",
      en: "**The macro and the hits per minute** come from the class's Korean board: the setup guide from 30 August —the one with 346 replies—, its in-game macro counterpart, and another player's test counting a minute of hits at ten different combat speeds, three runs each. These are players, not a lab: the numbers are theirs, on their machine. The mouse macro is third-party software and not a game feature; that is stated where it appears.",
    },
    {
      es: "**Lo que hay que tener en cuenta.** Es el servidor coreano, con un parche por delante del que llegará al global el 5 de octubre. Las mecánicas serán las mismas; los números y el meta pueden moverse. Y en PvP, más: el propio autor de la guía avisa de que el meta cambia constantemente, así que trátalo como punto de partida y no como ley.",
      en: "**What to keep in mind.** This is the Korean server, one patch ahead of what lands on global on 5 October. The mechanics will be the same; the numbers and the meta can shift. PvP even more so: the guide's own author warns the meta changes constantly, so treat it as a starting point and not as law.",
    },
  ],
};
