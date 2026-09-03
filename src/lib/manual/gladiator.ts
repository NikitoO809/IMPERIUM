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

    // ── 6. Pasivas y estigmas ───────────────────────────────────
    {
      eyebrow: { es: "Pasivas y estigmas", en: "Passives and stigmas" },
      titulo: { es: "Lo que no se ve pero se nota", en: "What you cannot see but do feel" },
      intro: [
        {
          es: "Las pasivas no aparecen en la barra, pero son la mitad de tu daño. Y ojo con esto: **también se meten como grabados en el equipo** — por eso en la tabla de stats verás nombres de pasivas entre las opciones de casco, peto y guantes.",
          en: "Passives never show on your bar, but they are half your damage. And note this: **they also slot as engravings on gear** — which is why you will spot passive names among the helmet, chest and glove options in the stats table.",
        },
      ],
      bloques: [
        {
          t: "tabla",
          primeraNum: true,
          cabeceras: [{ es: "#", en: "#" }, { es: "Pasiva", en: "Passive" }, { es: "Por qué", en: "Why" }],
          filas: [
            [{ es: "1", en: "1" }, { es: "**Preparación de ataque**", en: "**Attack Readiness**" }, { es: "Sube ataque y defensa a la vez: el escalón más barato de todos", en: "Raises attack and defence at once: the cheapest step of all" }],
            [{ es: "2", en: "2" }, { es: "**Detectar debilidad**", en: "**Weak Point Detection**" }, { es: "Crítico y perfección — estabiliza toda la rotación", en: "Crit and perfection — steadies the whole rotation" }],
            [{ es: "3", en: "3" }, { es: "Contraataque veterano", en: "Veteran Counter" }, { es: "Pico de daño tras bloquear. Súbela si usas Bloqueo concentrado", en: "Damage spike after a block. Level it if you run Focused Block" }],
            [{ es: "4", en: "4" }, { es: "Estallido de sed de sangre", en: "Bloodlust Burst" }, { es: "Daño por acumulación de golpes: encaja con cancelar el básico", en: "Damage from stacking hits: pairs with auto-cancelling" }],
            [{ es: "5", en: "5" }, { es: "Absorción de sangre · Postura de supervivencia", en: "Blood Absorption · Survival Stance" }, { es: "Para farmeo en grupo y cuando haces de tanque de apoyo", en: "For group grinding and when you off-tank" }],
          ],
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

    // ── 7. Rotación ─────────────────────────────────────────────
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

    // ── 8. Errores ──────────────────────────────────────────────
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

    // ── 9. Alas y mascota ───────────────────────────────────────
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

    // ── 10. Equipo ──────────────────────────────────────────────
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
      es: "**De dónde sale todo esto.** Los porcentajes de equipo, stats y grabados vienen de una plataforma que mide el combate real del servidor coreano y agrega lo que llevan puesto 6.834 Gladiators; se actualiza a diario y estos datos son del 2 de septiembre. El sistema de arcanas, las prioridades de skill, los estigmas y la rotación vienen de guías de la comunidad del juego, revisadas entre enero y agosto.",
      en: "**Where all this comes from.** The gear, stat and engraving percentages come from a platform that measures real combat on the Korean server and aggregates what 6,834 Gladiators have equipped; it updates daily and this snapshot is from 2 September. The arcana system, skill priorities, stigmas and rotation come from community guides for the game, revised between January and August.",
    },
    {
      es: "**Lo que hay que tener en cuenta.** Es el servidor coreano, con un parche por delante del que llegará al global el 5 de octubre. Las mecánicas serán las mismas; los números y el meta pueden moverse. Y en PvP, más: el propio autor de la guía avisa de que el meta cambia constantemente, así que trátalo como punto de partida y no como ley.",
      en: "**What to keep in mind.** This is the Korean server, one patch ahead of what lands on global on 5 October. The mechanics will be the same; the numbers and the meta can shift. PvP even more so: the guide's own author warns the meta changes constantly, so treat it as a starting point and not as law.",
    },
  ],
};
