// Manual de Atreia — Oficios (제작 · 정기추출).
//
// La curva de experiencia la midió la comunidad coreana y se actualizó tras el
// parche que amplió Profesional hasta 70. Los recuentos de recetas y los
// materiales de cada escalón salen de una base de datos extraída del cliente
// del juego: 820 recetas con cantidades exactas.
import type { Guia } from "./tipos";

export const oficios: Guia = {
  slug: "oficios",
  nombre: "Oficios",
  acento: "#7ad7f0",
  resumen: {
    es: "Los dos rangos, la misión de ascenso y una calculadora que dice cuántos crafteos te faltan.",
    en: "The two tiers, the promotion quest and a calculator that tells you how many crafts you have left.",
  },

  portada: {
    eyebrow: { es: "Aion 2 · Maestría", en: "Aion 2 · Mastery" },
    titulo: "Oficios de Atreia",
    lede: {
      es: "Cómo se sube de verdad un oficio: los dos rangos, la misión que te resetea la cuenta a cero, y **cuántos crafteos exactos** te separan de donde quieres llegar.",
      en: "How a profession actually levels: the two tiers, the quest that resets your counter to zero, and **exactly how many crafts** stand between you and where you want to be.",
    },
    arte: "/manual/aion2-oficios.webp",
  },

  secciones: [
    // ── 1. El ciclo ─────────────────────────────────────────────
    {
      eyebrow: { es: "El ciclo", en: "The cycle" },
      titulo: { es: "Cómo funciona la maestría", en: "How mastery works" },
      bloques: [
        {
          t: "fuentes",
          items: [
            {
              valor: "1 → 50",
              titulo: { es: "Iniciación", en: "Beginner" },
              texto: {
                es: "El aprendizaje. Barato, rápido y con recetas de andar por casa.",
                en: "The learning tier. Cheap, quick, and full of everyday recipes.",
              },
            },
            {
              valor: "★",
              titulo: { es: "Misión de ascenso", en: "Promotion quest" },
              texto: {
                es: "Aparece sola al tocar el 50. Al superarla, el contador vuelve a 1.",
                en: "It appears on its own when you hit 50. Clear it and the counter goes back to 1.",
              },
            },
            {
              valor: "1 → 70",
              titulo: { es: "Profesional", en: "Professional" },
              texto: {
                es: "Aquí está todo lo que importa. El tope subió de 50 a 70 en un parche.",
                en: "This is where everything that matters lives. A patch raised the cap from 50 to 70.",
              },
            },
          ],
        },
      ],
    },

    // ── 2. Los seis oficios ─────────────────────────────────────
    {
      eyebrow: { es: "Los seis caminos", en: "The six paths" },
      titulo: { es: "Qué oficios hay", en: "What professions exist" },
      intro: [
        {
          es: "Cinco de fabricación y uno de recolección, con **820 recetas** repartidas entre ellos. Un mismo personaje puede subirlos todos: no hay que elegir uno y renunciar al resto.",
          en: "Five crafting and one gathering, with **820 recipes** split between them. A single character can level all of them: you never have to pick one and give up the rest.",
        },
      ],
      bloques: [
        {
          t: "aviso",
          parrafos: [
            {
              es: "**La maestría no es del oficio: es de cada tipo de pieza.** Dentro de Herrería llevas por separado la maestría de espadón, la de espada larga, la de arco… Subir una no sube las otras, y cada receta te pide la suya. Es la trampa que hace pensar que vas más adelantado de lo que estás.",
              en: "**Mastery does not belong to the profession: it belongs to each item type.** Inside Blacksmithing you carry greatsword mastery, longsword mastery and bow mastery separately. Levelling one does not level the others, and every recipe asks for its own. It is the trap that makes you think you are further along than you are.",
            },
          ],
        },
        {
          t: "pestanas",
          items: [
            {
              titulo: { es: "Extracción de esencia", en: "Essence extraction" },
              bloques: [
                {
                  t: "parrafo",
                  texto: {
                    es: "**El oficio que alimenta a los otros cinco.** Se abre con **Alt + F**. Lo que casi nadie aprovecha: da experiencia de personaje **y** de oficio al mismo tiempo, así que recoger lo que pillas de camino durante la campaña no te roba ni un minuto de progresión. Cada nivel te entrega **puntos de habilidad** para repartir entre los seis recursos.",
                    en: "**The profession that feeds the other five.** Opens with **Alt + F**. What almost nobody exploits: it grants character **and** profession experience at the same time, so gathering what you pass during the campaign costs you nothing in progression. Every level hands you **skill points** to spread across the six resources.",
                  },
                },
                {
                  t: "parrafo",
                  texto: {
                    es: "**El ascenso:** al llegar a Iniciación 50 aparece sola una misión secundaria azul. Pide un **rubí brillante**, que no se recoge directamente: sale de recolectar rubíes normales, más o menos **uno cada 15 a 25**. Los rubíes crecen en lo alto de los acantilados, así que el vuelo te ahorra media tarde. Se entrega a **Korius** si eres Elyos, a **Aljir** si eres Asmodian.",
                    en: "**The promotion:** on reaching Beginner 50 a blue side quest appears by itself. It asks for a **shining ruby**, which cannot be gathered directly: it drops from harvesting normal rubies, roughly **one in every 15 to 25**. Rubies grow on top of cliffs, so flying saves you half an afternoon. Hand it to **Korius** as Elyos, **Aljir** as Asmodian.",
                  },
                },
                {
                  t: "tabla",
                  cabeceras: [{ es: "Dato", en: "Figure" }, { es: "Valor", en: "Value" }],
                  filas: [
                    [{ es: "Atajo", en: "Shortcut" }, { es: "Alt + F", en: "Alt + F" }],
                    [{ es: "Llegar a Iniciación 50", en: "Reaching Beginner 50" }, { es: "1 – 2 h", en: "1 – 2 h" }],
                    [{ es: "Rubíes por uno brillante", en: "Rubies per shining one" }, { es: "15 – 25", en: "15 – 25" }],
                    [{ es: "Recursos que se recogen", en: "Gatherable resources" }, { es: "6", en: "6" }],
                  ],
                },
                {
                  t: "parrafo",
                  texto: {
                    es: "**Orden para gastar los puntos:** Éter → Mineral → Hierbas → Madera → Gemas. Y dentro de cada uno: acierto, luego velocidad, luego material superior. El éter va primero porque **entra en las recetas de los cinco oficios**. Resetear el reparto es barato desde un parche reciente: no te agobies por equivocarte.",
                    en: "**Order to spend points:** Aether → Ore → Herbs → Wood → Gems. And within each one: success rate, then speed, then higher-grade materials. Aether comes first because **it appears in the recipes of all five professions**. Resetting the spread is cheap since a recent patch, so do not agonise over mistakes.",
                  },
                },
              ],
            },
            {
              titulo: { es: "Herrería", en: "Blacksmithing" },
              bloques: [
                {
                  t: "parrafo",
                  texto: {
                    es: "**188 recetas · armas.** Una maestría distinta por cada tipo de arma. Un espadón y una espada larga arrancan los dos con las mismas tres cosas —**3 lingotes de oricalco, 5 piedras de fundición y 2 de éter**— pero cuentan en contadores separados. Le interesa a **Gladiator, Templar, Ranger y Assassin**.",
                    en: "**188 recipes · weapons.** A separate mastery for each weapon type. A greatsword and a longsword both start with the same three things —**3 orichalcum ingots, 5 smelting stones and 2 aether**— but count on separate meters. It matters to **Gladiator, Templar, Ranger and Assassin**.",
                  },
                },
                {
                  t: "tabla",
                  primeraNum: true,
                  cabeceras: [{ es: "Maestría", en: "Mastery" }, { es: "Qué desbloquea", en: "What it unlocks" }],
                  filas: [
                    [{ es: "3", en: "3" }, { es: "De oricalco", en: "Orichalcum" }],
                    [{ es: "15", en: "15" }, { es: "De artesano", en: "Artisan's" }],
                    [{ es: "30", en: "30" }, { es: "De maestro", en: "Master's" }],
                    [{ es: "55", en: "55" }, { es: "Rey Dragón · 22 cuernos", en: "Dragon King · 22 horns" }],
                    [{ es: "70", en: "70" }, { es: "Rey Dragón Blanco · 29 cuernos", en: "White Dragon King · 29 horns" }],
                    [{ es: "85", en: "85" }, { es: "41 cuernos", en: "41 horns" }],
                    [{ es: "115", en: "115" }, { es: "74 cuernos", en: "74 horns" }],
                  ],
                },
                {
                  t: "parrafo",
                  texto: {
                    es: "Del escalón 55 en adelante ya no partes de materia prima: **metes el arma anterior dentro de la nueva**. Cada salto se come el arma que tenías.",
                    en: "From step 55 onwards you no longer start from raw materials: **you feed the previous weapon into the new one**. Every jump eats the weapon you had.",
                  },
                },
                {
                  t: "tabla",
                  cabeceras: [{ es: "Lo que fabricas", en: "What you craft" }, { es: "Experiencia", en: "Experience" }],
                  filas: [
                    [{ es: "Lingote de oricalco", en: "Orichalcum ingot" }, { es: "20", en: "20" }],
                    [{ es: "Guarda de oricalco", en: "Orichalcum guard" }, { es: "84", en: "84" }],
                    [{ es: "Guarda de artesano", en: "Artisan's guard" }, { es: "240", en: "240" }],
                    [{ es: "Guarda de maestro", en: "Master's guard" }, { es: "600", en: "600" }],
                    [{ es: "Cuerno refinado sólido", en: "Refined horn, solid" }, { es: "383", en: "383" }],
                    [{ es: "Cuerno refinado afilado", en: "Refined horn, sharp" }, { es: "439", en: "439" }],
                    [{ es: "Cuerno refinado robusto", en: "Refined horn, sturdy" }, { es: "618", en: "618" }],
                    [{ es: "Cuerno refinado preciso", en: "Refined horn, precise" }, { es: "868", en: "868" }],
                  ],
                },
              ],
            },
            {
              titulo: { es: "Armaduras", en: "Armour" },
              bloques: [
                {
                  t: "parrafo",
                  texto: {
                    es: "**220 recetas · el oficio más grande de los cinco.** Tiene más recetas que ninguno, y el motivo es simple: cada juego de armadura son seis piezas, y cada pieza lleva su propia maestría. Donde un herrero fabrica un arma, tú fabricas seis cosas.",
                    en: "**220 recipes · the biggest of the five.** It has more recipes than any other, and the reason is simple: every armour set is six pieces, and each piece carries its own mastery. Where a blacksmith makes one weapon, you make six things.",
                  },
                },
                {
                  t: "parrafo",
                  texto: {
                    es: "Eso lo convierte en el oficio más lento de completar, pero también en el que más veces te deja aprovechar la misma tanda de materiales. Tira de **mineral y éter**, igual que las armas, así que subir los dos a la vez aprovecha una sola ruta de recolección.",
                    en: "That makes it the slowest to complete, but also the one that squeezes the most out of a single batch of materials. It runs on **ore and aether**, same as weapons, so levelling both at once reuses one gathering route.",
                  },
                },
              ],
            },
            {
              titulo: { es: "Joyería", en: "Jewelcrafting" },
              bloques: [
                {
                  t: "parrafo",
                  texto: {
                    es: "**184 recetas · accesorios y bastones.** El oficio de los lanzadores. **Sorcerer, Spiritmaster y Chanter** lo quieren por sus bastones, y todo el mundo acaba queriéndolo por los accesorios: solo hay **92 accesorios** en todo el juego y salen de aquí.",
                    en: "**184 recipes · accessories and staves.** The casters' profession. **Sorcerer, Spiritmaster and Chanter** want it for their staves, and everyone ends up wanting it for accessories: there are only **92 accessories** in the whole game and they all come from here.",
                  },
                },
                {
                  t: "parrafo",
                  texto: {
                    es: "Tira de **madera y éter**. Si tu grupo se reparte los oficios, este es el que menos gente coge y el que más se echa en falta cuando hace falta un anillo.",
                    en: "It runs on **wood and aether**. If your group splits the professions, this is the one fewest people take and the one most missed when somebody needs a ring.",
                  },
                },
              ],
            },
            {
              titulo: { es: "Alquimia", en: "Alchemy" },
              bloques: [
                {
                  t: "parrafo",
                  texto: {
                    es: "**140 recetas · pociones y consumibles.** El oficio de **Cleric** por afinidad y el de todos por necesidad. Y aquí está la diferencia de fondo con los otros cuatro: **lo que fabricas se gasta**. Un arma la haces una vez; las pociones hay que reponerlas cada semana, las tuyas y las de tu legión.",
                    en: "**140 recipes · potions and consumables.** The **Cleric's** profession by affinity and everyone's by necessity. And here is the deep difference with the other four: **what you make gets used up**. A weapon is made once; potions must be restocked every week, yours and your legion's.",
                  },
                },
                {
                  t: "parrafo",
                  texto: {
                    es: "Por eso es el que antes se rentabiliza aunque sea el tercero por número de recetas. No compites con nadie: hay demanda constante. Tira de **hierbas y éter**.",
                    en: "That is why it pays off soonest despite being third by recipe count. You compete with nobody: demand never stops. It runs on **herbs and aether**.",
                  },
                },
              ],
            },
            {
              titulo: { es: "Cocina", en: "Cooking" },
              bloques: [
                {
                  t: "parrafo",
                  texto: {
                    es: "**88 recetas · el más pequeño de los cinco.** La mitad de recetas que Armaduras, y eso es justamente su ventaja: **es el único que se puede completar de verdad** sin que se te vaya la temporada. 64 comidas y 24 bebidas, y ya está.",
                    en: "**88 recipes · the smallest of the five.** Half the recipes of Armour, and that is exactly its advantage: **it is the only one you can genuinely finish** without burning a whole season. 64 dishes and 24 drinks, and that is that.",
                  },
                },
                {
                  t: "parrafo",
                  texto: {
                    es: "Como los materiales son los más baratos de los cinco, es el sitio donde practicar los combos sin arruinarte: aquí un fallo cuesta hierbas, no cuernos de dragón. El que todo el mundo deja para el final, hasta que la comida empieza a decidir peleas.",
                    en: "Since its materials are the cheapest of the five, it is where you practise combos without going broke: a failure here costs herbs, not dragon horns. The one everybody leaves for last, until food starts deciding fights.",
                  },
                },
              ],
            },
          ],
        },
      ],
    },

    // ── 3. El molde ─────────────────────────────────────────────
    {
      eyebrow: { es: "El molde", en: "The template" },
      titulo: { es: "Por qué todas las recetas se parecen", en: "Why every recipe looks alike" },
      intro: [
        {
          es: "Da igual el oficio: toda receta está montada sobre la misma plantilla de tres capas. Solo cambia una de ellas — y saberlo cambia cómo os repartís el trabajo en el gremio.",
          en: "Whatever the profession, every recipe is built on the same three-layer template. Only one layer changes — and knowing that changes how your legion splits the work.",
        },
      ],
      bloques: [
        {
          t: "fuentes",
          items: [
            {
              valor: "1",
              titulo: { es: "Lo que ya tenías", en: "What you already had" },
              texto: {
                es: "A partir de la maestría 55, la pieza nueva **se come la anterior**. Antes de eso, la materia prima del escalón.",
                en: "From mastery 55 on, the new piece **eats the previous one**. Before that, the raw material of the step.",
              },
            },
            {
              valor: "2",
              titulo: { es: "Lo que necesitan todos", en: "What everyone needs" },
              texto: {
                es: "**Piedra de fundición y éter**, del grado que toque. Entran en las recetas de los cinco oficios, sin excepción.",
                en: "**Smelting stone and aether**, at the matching grade. They appear in all five professions' recipes, without exception.",
              },
            },
            {
              valor: "3",
              titulo: { es: "Tu material", en: "Your material" },
              texto: {
                es: "La única casilla que distingue un oficio de otro: oricalco, cristal mágico, rubí, zafiro, cuerno de dragón, escama de dragón…",
                en: "The only slot that tells one profession from another: orichalcum, magic crystal, ruby, sapphire, dragon horn, dragon scale…",
              },
            },
          ],
        },
        {
          t: "parrafo",
          texto: {
            es: "Un **espadón** de Herrería y un **libro de hechizos** de Alquimia, escalón por escalón. Fíjate en que las cantidades no se parecen: **son las mismas**.",
            en: "A **greatsword** from Blacksmithing and a **spellbook** from Alchemy, step by step. Note that the quantities do not merely resemble each other: **they are identical**.",
          },
        },
        {
          t: "tabla",
          primeraNum: true,
          cabeceras: [
            { es: "Maestría", en: "Mastery" },
            { es: "Igual en los dos", en: "Same in both" },
            { es: "Herrería", en: "Blacksmithing" },
            { es: "Alquimia", en: "Alchemy" },
          ],
          filas: [
            [{ es: "3", en: "3" }, { es: "Fundición ×5 · Éter ×2", en: "Smelting ×5 · Aether ×2" }, { es: "Lingote ×3", en: "Ingot ×3" }, { es: "Cristal ×3", en: "Crystal ×3" }],
            [{ es: "15", en: "15" }, { es: "Artesano ×5 · Éter ×3", en: "Artisan ×5 · Aether ×3" }, { es: "Oricalco ×6", en: "Orichalcum ×6" }, { es: "Rubí ×6", en: "Ruby ×6" }],
            [{ es: "30", en: "30" }, { es: "Maestro ×5 · Éter ×4", en: "Master ×5 · Aether ×4" }, { es: "Oricalco ×8", en: "Orichalcum ×8" }, { es: "Rubí ×8", en: "Ruby ×8" }],
            [{ es: "55", en: "55" }, { es: "Suprema ×5 · Éter ×7", en: "Supreme ×5 · Aether ×7" }, { es: "Cuerno ×22", en: "Horn ×22" }, { es: "Escama ×22", en: "Scale ×22" }],
            [{ es: "70", en: "70" }, { es: "Suprema ×9 · Éter ×12", en: "Supreme ×9 · Aether ×12" }, { es: "Cuerno ×29", en: "Horn ×29" }, { es: "Escama ×29", en: "Scale ×29" }],
            [{ es: "115", en: "115" }, { es: "Suprema ×32 · Éter ×44", en: "Supreme ×32 · Aether ×44" }, { es: "Cuerno ×74", en: "Horn ×74" }, { es: "Escama ×74", en: "Scale ×74" }],
          ],
        },
        {
          t: "aviso",
          parrafos: [
            {
              es: "**Y baja hasta el arma concreta.** Dentro de Alquimia, un libro de hechizos pide rubí y un orbe pide zafiro. Misma piedra, mismo éter, misma cantidad — otra gema.",
              en: "**And it goes all the way down to the specific weapon.** Inside Alchemy, a spellbook wants ruby and an orb wants sapphire. Same stone, same aether, same amount — different gem.",
            },
            {
              es: "**Lo que hay que repartirse no son los oficios: son las rutas de recolección.** Quien vaya a mineral abastece armas y armaduras. Quien vaya a gemas abastece alquimia y joyería. Y el éter lo necesitáis todos, siempre — por eso es la moneda real del juego.",
              en: "**What you should divide up is not the professions: it is the gathering routes.** Whoever goes for ore supplies weapons and armour. Whoever goes for gems supplies alchemy and jewelcrafting. And everyone needs aether, always — which is why it is the game's real currency.",
            },
          ],
        },
      ],
    },

    // ── 4. La calculadora ───────────────────────────────────────
    {
      eyebrow: { es: "La herramienta", en: "The tool" },
      titulo: { es: "¿Cuánto me queda?", en: "How much is left?" },
      intro: [
        {
          es: "Dime dónde estás, adónde vas y qué estás fabricando. Con la curva de experiencia real del juego, te digo cuántas veces tienes que darle al botón.",
          en: "Tell me where you are, where you are going and what you are crafting. Using the game's real experience curve, I will tell you how many times you have to press the button.",
        },
      ],
      bloques: [{ t: "calculadora" }],
    },

    // ── 5. Las tres reglas ──────────────────────────────────────
    {
      eyebrow: { es: "Las tres reglas", en: "The three rules" },
      titulo: { es: "Cómo se reparte la experiencia", en: "How experience is handed out" },
      intro: [
        {
          es: "Tres números que cambian por completo la cuenta de arriba. El primero consuela, el segundo premia y el tercero es el que hace perder semanas a quien no lo sabe.",
          en: "Three numbers that completely change the maths above. The first consoles you, the second rewards you, and the third costs weeks to anyone who does not know it.",
        },
      ],
      bloques: [
        {
          t: "fuentes",
          items: [
            {
              valor: "30%",
              titulo: { es: "Si fallas, cobras igual", en: "Fail and you still get paid" },
              texto: {
                es: "Un intento fallido entrega el 30% de la experiencia que habría dado el acierto. La maestría sube aunque la pieza se rompa.",
                en: "A failed attempt hands over 30% of what a success would have given. Mastery rises even when the piece breaks.",
              },
            },
            {
              valor: "130%",
              titulo: { es: "El combo paga extra", en: "The combo pays extra" },
              texto: {
                es: "Si la pieza tiene combo y lo clavas, cobras un 30% de más. Una guarda de maestro pasa de 600 a 780 de una tacada.",
                en: "If the piece has a combo and you nail it, you collect 30% more. A master's guard jumps from 600 to 780 in one go.",
              },
            },
            {
              valor: "−53%",
              titulo: { es: "El botón de x10 te roba", en: "The x10 button robs you" },
              texto: {
                es: "Fabricar en lote da bastante menos de la mitad que fabricar de uno en uno. Mismo material, misma cantidad, la mitad de maestría.",
                en: "Batch crafting gives well under half of what one-by-one gives. Same materials, same quantity, half the mastery.",
              },
            },
          ],
        },
        {
          t: "tabla",
          cabeceras: [{ es: "Cómo lo haces", en: "How you do it" }, { es: "Experiencia", en: "Experience" }],
          filas: [
            [{ es: "Polvo de piedra espiritual ×3, **diez veces seguidas**", en: "Spirit stone dust ×3, **ten times in a row**" }, { es: "**240**", en: "**240**" }],
            [{ es: "Polvo de piedra espiritual ×30, **de una sola vez**", en: "Spirit stone dust ×30, **in a single batch**" }, { es: "112", en: "112" }],
            [{ es: "Lingote de oricalco ×1, **diez veces**", en: "Orichalcum ingot ×1, **ten times**" }, { es: "**200**", en: "**200**" }],
            [{ es: "Lingote de oricalco ×10, **de una vez**", en: "Orichalcum ingot ×10, **in one go**" }, { es: "112", en: "112" }],
          ],
        },
        {
          t: "parrafo",
          texto: {
            es: "Usa el x10 solo cuando ya no te importe la maestría y solo quieras el objeto.",
            en: "Use the x10 only when mastery no longer matters to you and you just want the item.",
          },
        },
      ],
    },

    // ── 6. La curva ─────────────────────────────────────────────
    {
      eyebrow: { es: "La curva", en: "The curve" },
      titulo: { es: "Experiencia acumulada por nivel", en: "Cumulative experience by level" },
      intro: [
        {
          es: "Los hitos de los dos rangos. Fíjate en el salto: llegar al final de Iniciación cuesta menos que subir un solo nivel en la parte alta de Profesional.",
          en: "The milestones of both tiers. Note the jump: finishing all of Beginner costs less than a single level high up in Professional.",
        },
      ],
      bloques: [
        {
          t: "tabla",
          primeraNum: true,
          cabeceras: [{ es: "Nivel", en: "Level" }, { es: "Iniciación", en: "Beginner" }, { es: "Profesional", en: "Professional" }],
          filas: [
            [{ es: "10", en: "10" }, { es: "334", en: "334" }, { es: "6.930", en: "6,930" }],
            [{ es: "20", en: "20" }, { es: "896", en: "896" }, { es: "16.612", en: "16,612" }],
            [{ es: "30", en: "30" }, { es: "2.319", en: "2,319" }, { es: "31.113", en: "31,113" }],
            [{ es: "40", en: "40" }, { es: "4.810", en: "4,810" }, { es: "53.155", en: "53,155" }],
            [{ es: "49", en: "49" }, { es: "**8.809**", en: "**8,809**" }, { es: "82.734", en: "82,734" }],
            [{ es: "60", en: "60" }, { es: "—", en: "—" }, { es: "145.796", en: "145,796" }],
            [{ es: "69", en: "69" }, { es: "—", en: "—" }, { es: "**228.283**", en: "**228,283**" }],
          ],
        },
        {
          t: "parrafo",
          texto: {
            es: "**Traducido a trabajo real:** ir de Profesional 50 a 70 en herrería son unos **236 crafteos con éxito** de cuerno de dragón refinado. Ese es el tamaño del salto que te espera.",
            en: "**Translated into real work:** going from Professional 50 to 70 in blacksmithing is about **236 successful crafts** of refined dragon horn. That is the size of the jump waiting for you.",
          },
        },
      ],
    },
  ],

  fuentes: [
    {
      es: "**De dónde salen estos números.** La curva de experiencia la midió la comunidad coreana del juego, que lleva meses con él en marcha, y se actualizó tras el parche que amplió el tope a Profesional 70. Los recuentos de recetas y los materiales de cada escalón vienen de una base de datos extraída del propio cliente del juego: **820 recetas** con sus cantidades exactas.",
      en: "**Where these numbers come from.** The experience curve was measured by the game's Korean community, months into live service, and updated after the patch that raised the cap to Professional 70. The recipe counts and per-step materials come from a database extracted from the game client itself: **820 recipes** with exact quantities.",
    },
    {
      es: "**Y lo que hay que comprobar.** Esto es del servidor de Corea. Para la versión global las mecánicas serán las mismas, pero los números concretos pueden bailar. En cuanto lo juguemos, se corrige lo que no cuadre.",
      en: "**And what still needs checking.** This is the Korean server. On global the mechanics will be the same, but the specific numbers may shift. As soon as we play it, whatever does not match gets corrected.",
    },
  ],
};
