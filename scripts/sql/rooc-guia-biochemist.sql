do $IMPERIUM$
declare
  v_game uuid;
  v_guide uuid;
begin
  select id into v_game from public.games where slug = 'ragnarok-origin-classic';
  if v_game is null then
    raise exception 'IMPERIUM: juego no encontrado: %', 'ragnarok-origin-classic';
  end if;

  -- Reemplazo idempotente. OJO: borra los pasos -> reinicia step_progress de esta guía.
  delete from public.guide_steps where guide_id in (
    select id from public.guides where game_id = v_game and slug = 'biochemist-build');
  delete from public.guides where game_id = v_game and slug = 'biochemist-build';

  insert into public.guides
    (game_id, slug, title, description, order_index, is_published, intro_title, intro, intro_images)
  values
    (v_game, 'biochemist-build', 'Biochemist: build para PvP y GvG', 'Build de Biochemist para Ragnarok Origin Classic pensada para el Tyr Cup. Cubre el orden de los tres árboles de habilidades, el combo de ácido, la carta y la mascota recomendadas, y trucos concretos para PvP 5v5 y GvG.', 11, false, 'El alquimista que castiga cuanto más tanque es el rival', 'El Tyr Cup sigue en marcha, y si tu plan es subir Biochemist para plantarte con garantías en PvP o GvG, esta guía reúne en un solo sitio el orden de tus tres árboles de habilidades, el combo que decide una pelea, y la carta y la mascota que completan el build.

Biochemist es la clase Forging/Hybrid que nace de Merchant y pasa por Alchemist: no es un tanque ni un mago puro, es un rematador. Su golpe de firma, Acid Demonstration, calcula el daño como 630% × tu PATK × (1 + VIT del objetivo/80) — sube a 700% en PvP — y además suma +1% más de multiplicador por cada punto de tu propia STR, hasta un tope de +200%. Dicho de otro modo: cuanto más tanque venga el rival, más le duele tu bomba de ácido — y tu propia STR es la que decide lo grande que es esa bomba.

Ya se le ha visto plantado en las rondas de ranking del Tyr Cup, encadenando ese combo de ácido contra objetivos que se creían a salvo por ir cargados de HP. A partir de aquí, la build explicada árbol por árbol, paso a paso.', array['https://www.roochub.com/icons/UI_Common_Profession_Icon_25.webp']::text[])
  returning id into v_guide;

  insert into public.guide_steps
    (guide_id, order_index, title, content, source_url, is_verified, images)
  values
    (v_guide, 1, 'Por qué Biochemist', 'Antes de repartir un solo punto, mira la fórmula que justifica esta guía: tu habilidad principal, Acid Demonstration, inflige 630% × tu PATK × (1 + VIT del objetivo/80) de daño físico Neutral — sube a 700% en PvP —, y cada punto de tu propia STR le suma otro 1% al multiplicador de la habilidad, hasta un máximo de +200%. No hay muchas clases donde tu propia estadística de ataque decida de forma tan directa el tamaño de tu golpe definitivo.

Biochemist es el tercer trabajo de la rama Merchant → Alchemist → Biochemist, una clase Forging/Hybrid pensada para rematar, no para aguantar en primera línea como Paladin. Y su ventaja no termina en Acid Demonstration: la pasiva Corrosion Research hace que ese mismo golpe (y también Acid Terror) inflija todavía más daño cuanto más VIT tenga el objetivo — +0,375% de daño de habilidad por cada punto de VIT rival, hasta +150% adicional —. Así que contra el tanque cargado de HP que en teoría debería darte miedo, tu ácido pega todavía más fuerte.

Eso condiciona el reparto de tus puntos de estadística: STR primero, porque alimenta directamente el multiplicador de Acid Demonstration y tu PATK en general; VIT después, para tener el colchón de HP que te permita sobrevivir mientras preparas el combo (a diferencia de Paladin, aquí tu propia VIT no te da daño extra, solo aguante); y DEX al final, para no fallar golpes y acortar tiempos de lanzamiento.', 'https://www.roochub.com/classes/biochemist', false, array[]::text[]),
    (v_guide, 2, 'Árbol Merchant (1er trabajo)', 'El árbol de Merchant es donde arrancas, y aunque a primera vista parezca solo el trabajo "económico" de la saga, aquí sientas la base de daño físico que vas a usar durante toda la partida. Este es el orden que te recomendamos.

• Crazy Uproar al máximo — 1 punto, +4 de STR de forma permanente. Es barato y esa STR alimenta directamente el multiplicador de tu futuro Acid Demonstration, así que no hay motivo para retrasarlo.
• Mammonite al máximo — tu golpe de relleno de toda la partida: 220% + 110 de daño físico (PDMG) Neutral por impacto, y no gasta ni un punto de SP — consume Eden Coins en su lugar, así que puedes spamearlo entre cooldowns sin miedo a quedarte corto de maná.
• Cart Clash al máximo — 200% de daño físico Neutral a un objetivo y hasta 10 enemigos en el trayecto, más 30% de Slow durante 3 segundos. Tu herramienta para peleas de grupo y para frenar a quien intente huir.
• Slamming Smash (unos pocos puntos) — 200% + 200 de daño físico Neutral a un único objetivo, y concede a tus propios ataques Ignore PDEF +10 durante 2 segundos. Un buen golpe de apertura antes de que llegue tu combo real.
• Cart Use (1 punto) — no te lo saltes: es el requisito para poder usar un Cart, y de ahí cuelga media rama de Merchant.
• Enlarge Weight Limit (unos pocos puntos) — +2000 de límite de peso y +50% de daño a Cart Revolution. No es prioridad para PvP, pero cuesta poco.

Discount, Overcharge, Cart Modification y Cart Revolution quedan para el final si te sobran puntos: son mejoras de economía y almacenamiento — útiles para tu bolsillo, pero no para ganar una pelea.', 'https://www.roochub.com/classes/biochemist', false, array['https://www.roochub.com/icons/UI_Icon_Skill_Merchant_JinQianGongJi.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Merchant_DaShengNaHan.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Merchant_ShouTuiCheChongZhuang.webp']::text[]),
    (v_guide, 3, 'Árbol Alchemist (2do trabajo)', 'Alchemist es tu segundo trabajo, y aquí es donde tu daño empieza a doler de verdad — además de donde desbloqueas el multiplicador que va a acompañar a tu futuro Acid Demonstration durante el resto del build.

• Learning Potion al máximo — +10% de daño de habilidad a Acid Terror, Demonstration y Acid Demonstration, más +20% de tu propia velocidad de movimiento (MSPD). Sube el daño de toda tu rotación de un solo golpe: es la prioridad número uno de este árbol.
• Acid Terror al máximo — tu primer golpe fuerte de verdad: 900% de daño físico (PDMG) Neutral a un objetivo señalado, con 15% de probabilidad de dañar su Armor y Cloak.
• Axe/Mace Mastery al máximo — +30 de PATK permanente mientras empuñes hacha o maza. Pasivo, barato, y no hay motivo para dejarlo a medias.
• Demonstration (unos pocos puntos) — 280% + 500 de daño físico de Fuego cada 0,5 segundos, durante 30 segundos, a hasta 10 enemigos. Tu herramienta para zonificar un punto de mapa en GvG.
• Marine Sphere (situacional) — lanza una esfera que detona 800% de daño mágico (MDMG) Neutral en área alrededor del objetivo. Una opción a distancia si necesitas alcance en vez de otro golpe físico.
• Bottle Grenade Enhancement (barato) — hace que tus Bottle Grenade inflijan -10% de reducción de daño físico/mágico al enemigo que las recibe. Rentable si ya llevas Bottle Grenade en tu rotación de objetos.

Chemistry Armor Protection, Chemistry Weapon Protection y Create Potion quedan para el final si te sobran puntos: protegen tu equipo de que te lo rompan o mejoran tu crafteo de pociones, pero no suben tu daño.', 'https://www.roochub.com/classes/biochemist', false, array['https://www.roochub.com/icons/UI_Icon_Skill_Alchemist_ZhiShiYaoShui.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Alchemist_QiangSuanGongJi.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Alchemist_FuChuiShiYongShuLianDong.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Alchemist_HuoYanPingTouZhi.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Alchemist_QiPaoChongZhaoHuan.webp']::text[]),
    (v_guide, 4, 'Árbol Biochemist (Trans. 2nd) — el núcleo del build', 'Esta es la joya de la corona: tu tercera clase (Trans. 2nd), donde todo lo anterior se convierte en el build de Biochemist que se ve en el Tyr Cup. Sigue el orden con disciplina — varias de estas habilidades solo rinden al máximo si activas las otras primero.

• Acid Demonstration al máximo — tu razón de ser: 630% × tu PATK × (1 + VIT del objetivo/80) de daño físico Neutral — 700% en PvP —, y cada punto de tu propia STR suma otro 1% al multiplicador, hasta +200%. Al impactar, deja además una zona de fuego de 2,5 metros de radio bajo el objetivo que inflige 380% de daño físico de Fuego por segundo durante 5 segundos, con 15% de probabilidad de destruir su Armor o Cloak.
• Advanced Axe/Mace Mastery al máximo — +20% de PATK/MATK mientras empuñes hacha o maza. Un multiplicador plano y permanente: obligatorio.
• Corrosion Research al máximo — hace que Acid Terror y Acid Demonstration inflijan más daño cuanto más VIT tenga el objetivo: +0,375% de daño de habilidad por cada punto de VIT rival, hasta +150% adicional. Es lo que convierte a los tanques cargados de HP en tu presa favorita.
• Cart Burst al máximo — +30% de MSPD, +20% de bonus a tu daño físico/mágico, y Ignore PDEF/MDEF +20%, durante 120 segundos. Actívalo SIEMPRE antes de entrar en la pelea, nunca a mitad de combate: es la ventana que hace rendir el resto del combo.
• Survival Food al máximo — cada 14 segundos ganas un efecto que elimina al instante todos los efectos de control activos y te da inmunidad a Control durante 6 segundos. Es lo que te permite completar el cast de Acid Demonstration sin que te lo corten con un aturdimiento.
• Unstable Research al máximo — tu Acid Demonstration fluctúa entre 90% y 130% de su valor base en cada impacto. Tenlo en cuenta antes de asumir que un golpe bajo es un error: es el rango normal de la habilidad.
• Bio Cannibalize (unos pocos puntos) — invoca un Plant Totem en la zona señalada, que restaura 5% del Max HP más 500 HP por segundo a los jugadores dentro del área, y les sube todas las estadísticas en 20 puntos y su Defense en 30%, durante 30 segundos. Tu botón de sustain para peleas de grupo.
• Hell''s Plant (unos pocos puntos) — parasita Hell''s Plant sobre un aliado durante 15 segundos, restaurándole 40% de tu MATK en HP cada segundo, mientras la propia planta inflige 1600% de daño mágico Neutral por segundo a hasta 10 enemigos en un radio de 3 metros. Cura y zonifica al mismo tiempo.
• Howling of Mandragora (situacional) — lanza Mandragora, infligiendo 700% de daño mágico Neutral cada 0,5 segundos durante 5 segundos a hasta 10 objetivos, con 30% de probabilidad de aplicar Scream. Otra herramienta de control de zona si te sobran puntos.
• Lab Accident (1 punto) — un accidente en el Cart Lab te lanza hacia el objetivo; la explosión inflige 600% de daño físico Neutral en área a hasta 10 objetivos y los derriba. Cuesta un único punto y te da un gap-closer con derribo incluido: no hay motivo para saltártelo.', 'https://www.roochub.com/classes/biochemist', false, array['https://www.roochub.com/icons/UI_Icon_Skill_Alchemist_QiangSuanHuoYanPingTouZhi.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Alchemist_GaoJieFuChuiShuLianDong.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Alchemist_FuZhuoYanJiu.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Alchemist_ShouTuiCheBaoFa.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Skill_Geneticist_ShiPin.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Alchemist_BuWenDingYaoJi.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Alchemist_ShengMingDiaoBo.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Skill_Geneticist_DiYuZhiWu.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Skill_Geneticist_ManTuoLuo.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Skill_Geneticist_ShiGu.webp']::text[]),
    (v_guide, 5, 'Tu combo principal', 'Tener los puntos bien repartidos no sirve de nada si no ejecutas el combo en el orden correcto. Esta es la secuencia que de verdad decide una pelea.

1. Activa Cart Burst antes de entrar en la pelea — nunca a mitad de combate: el +20% de daño y el Ignore PDEF/MDEF +20% son la ventana que hace funcionar todo lo demás.
2. Si el rival está lejos, ciérrale la distancia con Lab Accident: te lanza hacia el objetivo y de paso inflige 600% de daño físico Neutral en área con derribo.
3. Mientras esperas que Acid Demonstration esté listo, abre daño con Acid Terror (900% de daño físico Neutral, 15% de probabilidad de romper Armor o Cloak).
4. Remata con Acid Demonstration: con Cart Burst y tu STR ya sumando al multiplicador, es el golpe que decide la pelea — y de paso deja una zona de fuego activa los siguientes 5 segundos.
5. Si el objetivo escapa del área de fuego o necesitas rellenar el tiempo entre cooldowns, sigue pegando con Mammonite: no gasta SP, así que no tienes excusa para dejar de golpear.
6. En pelea de grupo, deja caer Bio Cannibalize o Hell''s Plant sobre tu equipo antes de que empiece a caer el foco, no cuando ya estén a mitad de vida.', 'https://www.roochub.com/classes/biochemist', false, array[]::text[]),
    (v_guide, 6, 'Equipo recomendado — cartas', 'Aquí tienes el equipo de cartas que completa el build. Igual que en el resto de guías de esta web, cada carta suele caer del monstruo o jefe que comparte su nombre — tómalo como referencia orientativa, no como un dato de drop confirmado por un parche concreto de ROOC.

• Drake (Épica, Arma) — Daño físico/mágico +12%, y en set +3% de ATK de arma. Sube directamente el daño de Acid Demonstration, Acid Terror y Mammonite: la carta de arma más rentable para este build.
• Doppelganger (Épica, Arma) — ASPD +10%, AGI +5, CRIT +5 y Daño de CRIT +12%, más +2% de ASPD en set. Acelera tu Mammonite de relleno y suma el crítico que le falta a un build sin grandes bonos de CRIT propios.
• Kobold (Rara, Accesorio) — CRIT +4 y STR +2, más +5 de MATK de arma en set. Esos 2 puntos de STR no son decorativos: alimentan directamente el multiplicador de Acid Demonstration.
• Orc Hero (Épica, Cabeza superior) — VIT +8, y cada 6 segundos elimina el Aturdimiento activo y da inmunidad durante 4 segundos, más +3% de daño físico en set. Protege justo la ventana de cast que necesitas para completar Acid Demonstration sin que te interrumpan.
• Angeling (Épica, Armadura) — HP máx. +5% y cambia el elemento de tu armadura a Sagrado, más +3% de HP máx. en set. El colchón de vida que te falta al no ser un tanque como Paladin.
• Eddga (Épica, Mano secundaria) — sube un 10% el coste de SP a cambio de un efecto especial propio, más +3% de reducción de daño físico en set. Con una rotación tan dependiente de SP como la tuya, el efecto especial compensa la subida de coste.
• Fabre (Común, Arma) — solo +1 de VIT y +100 de Max HP, más +2 de MATK de arma en set. Es una carta de monstruo de campo muy temprano y accesible: funciona bien como relleno mientras subes de nivel y todavía no tienes Drake o Doppelganger.', 'https://www.roochub.com/cards', false, array['https://www.roochub.com/icons/UI_MonsterCard_Haidaozhiwang.webp', 'https://www.roochub.com/icons/UI_MonsterCard_Siling.webp', 'https://www.roochub.com/icons/UI_MonsterCard_Quanyao.webp', 'https://www.roochub.com/icons/UI_MonsterCard_Shourenyingxiong.webp', 'https://www.roochub.com/icons/UI_MonsterCard_Tianshiboli.webp', 'https://www.roochub.com/icons/UI_MonsterCard_Huwang.webp', 'https://www.roochub.com/icons/UI_MonsterCard_Lvmianchong.webp']::text[]),
    (v_guide, 7, 'Mascota recomendada', 'De las mascotas ya traducidas para este juego, Kitten Oracle es la que mejor encaja con un Biochemist: su Battle Blessing golpea al objetivo con 800% de daño físico Neutral y da +10% de velocidad de ataque al dueño; en el Tier 10 el daño sube a 1200% y además suma +5% de daño crítico y +20% de probabilidad de crítico. Es daño físico Neutral sobre un único objetivo — el mismo tipo de daño y el mismo perfil de objetivo único que tu propio Acid Demonstration —, y el crítico extra del Tier 10 combina bien con las cartas Doppelganger y Kobold.

Si prefieres algo todavía más agresivo, Dr. Owl es la alternativa: su Gale Wind dispara una flecha de viento con 800% de daño físico y sube un 20% el daño físico que recibe el objetivo (1200% de daño y +30% en el Tier 10) — ese aumento del daño físico recibido amplifica directamente el golpe de Acid Demonstration que sueltas justo después.

Ninguna de las 9 mascotas de esta web tiene una habilidad de veneno o DoT propiamente dicha — y tampoco la tiene el kit real de Biochemist en esta versión del juego, cuyo daño es físico Neutral y de Fuego, no de tipo Poison —, así que no existe una mascota "temática de alquimista" perfecta. Pero por tipo de daño y por apuntar a un único objetivo, Kitten Oracle es la que mejor casa con este build.', 'https://roocdb.com/en/pets', false, array['https://roocdb.com/pets/Pokemon_zhanbumao.webp', 'https://roocdb.com/pets/Pokemon_maotouyingboshi.webp']::text[]),
    (v_guide, 8, 'Trucos para 5v5 (Dimension Drill)', 'Dimension Drill reúne varios minijuegos de 5v5, y Biochemist tiene un ángulo distinto en cada uno.

• Blood and Gold — cuando el grupo rival se amontone cerca del Goblin King, suelta ahí tu Acid Demonstration: la zona de fuego que deja detrás sigue haciendo daño a todo el que se quede parado encima.
• Shapeshift Ops — si un compañero va a recoger el orbe de transformación, cúbrelo con Hell''s Plant justo antes: la curación por segundo lo mantiene con vida durante el instante en que más atención rival va a recibir.
• Cart Contest — con Cart Burst activo (+30% de MSPD) puedes ser uno de los 3 jugadores que llevan el carro sin quedarte atrás, y si alguien te sale al paso, Lab Accident te lo quita de encima con el derribo.
• Team Deathmatch — activa Cart Burst antes de que empiece la ronda, abre con Acid Terror sobre el objetivo que marque tu equipo, y remata con Acid Demonstration en cuanto el cast esté listo: no lo sueltes contra el primer rival que se cruce.', 'https://www.roochub.com/classes/biochemist', false, array[]::text[]),
    (v_guide, 9, 'Trucos para GvG (guerra de gremios)', 'La guerra de gremios premia decisiones distintas a las del 5v5. Estos son los trucos que marcan la diferencia con Biochemist.

• Vigrid Avenge — no eres tú quien debería cargar el Cuerno: sin el HP masivo de un Paladin, ese desgaste constante te deja sin margen para rematar. Tu sitio está escoltando al portador, manteniendo su HP con Hell''s Plant y limpiando a quien se le acerque con Acid Terror.
• Vale of Clash — sobre un Crystal Pillar, Demonstration y Howling of Mandragora convierten el punto en un suelo que quema y hace daño mágico por segundo: úsalas para que al rival le salga caro amontonarse a intentar arrebatarte el punto.
• Stellar Clash — en el instante en que tu equipo decide cambiar de objetivo, tu Acid Demonstration es la herramienta perfecta para rematar ese cambio: apúntala al objetivo que marque tu equipo, no al que tengas más a mano.
• Peleas masivas — deja caer Bio Cannibalize sobre el punto donde tu equipo va a plantarse, no sobre ti mismo: el HP y las estadísticas que reparte rinden más repartidos entre varios que gastados en un solo jugador.', 'https://www.roochub.com/classes/biochemist', false, array[]::text[]),
    (v_guide, 10, 'Errores que cuestan partidas', 'Incluso con el build perfecto sobre el papel, estos son los fallos que más partidas cuestan.

• Soltar Acid Demonstration sin haber activado antes Cart Burst. Sin ese +20% de daño y el Ignore PDEF/MDEF, tu golpe de firma rinde muy por debajo de lo que promete la fórmula.
• Empezar el cast de Acid Demonstration sin haber gastado antes Survival Food o sin tener margen de inmunidad a Control: un aturdimiento a mitad de cast tira todo el combo a la basura.
• Repartir puntos en Discount, Overcharge o Create Potion antes de completar Acid Demonstration y Advanced Axe/Mace Mastery. Son mejoras de economía y crafteo: no suben tu daño ni un punto.
• Olvidar que Mammonite no gasta SP. Es tu relleno gratuito entre cooldowns — no tiene sentido quedarte quieto esperando a que se recargue Acid Terror cuando podrías estar pegando con Mammonite mientras tanto.', 'https://www.roochub.com/classes/biochemist', false, array[]::text[]);
end
$IMPERIUM$;
