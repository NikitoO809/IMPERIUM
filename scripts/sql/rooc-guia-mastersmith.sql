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
    select id from public.guides where game_id = v_game and slug = 'mastersmith-build');
  delete from public.guides where game_id = v_game and slug = 'mastersmith-build';

  insert into public.guides
    (game_id, slug, title, description, order_index, is_published, intro_title, intro, intro_images)
  values
    (v_game, 'mastersmith-build', 'Mastersmith: build para PvP y GvG', 'Build de Mastersmith para Ragnarok Origin Classic centrada en el combo de carro y hacha: orden de los tres árboles de habilidades, la secuencia de combate, y el equipo de cartas y mascota recomendados para PvP y GvG.', 10, false, 'El forjador que carga su propio arsenal', 'Mastersmith es la clase Transcendente de la rama Merchant — Merchant → Blacksmith → Mastersmith —, con un rol oficial de Forging / Hybrid y STR, VIT y DEX como stats favorecidas. Si vienes de leer sobre clases de soporte o de daño mágico sostenido, olvídate de esa lógica: aquí casi todo el daño sale de un puñado de golpes que rondan o superan el 1000% de un solo tirón.

Todo gira en torno a dos herramientas: el carro, que desbloqueas en Merchant y que te da acceso a Cart Boost y High Speed Cart Ram (900% de daño físico neutral, con 50% de probabilidad de Aturdir); y el hacha, protagonista de Axe Boomerang (1050% de daño físico neutral a hasta 10 objetivos cercanos) y Axe Tornado (240% + 105 de daño de Fuego en área, hasta 480% + 160 en el centro). Sin Cart Boost activo ni siquiera puedes lanzar tu nuke principal, así que el orden en el que actives tus habilidades importa tanto como los puntos que repartas.

Esta guía te lleva árbol por árbol —Merchant, Blacksmith y el núcleo de Mastersmith—, con el combo exacto para ejecutar el burst, el equipo de cartas que lo completa, y una mascota que amplifica ese mismo daño físico. Cierra con trucos concretos para 5v5 (Dimension Drill) y GvG, y los errores que más partidas cuestan con esta clase.', array['https://www.roochub.com/icons/UI_Common_Profession_Icon_19.webp']::text[])
  returning id into v_guide;

  insert into public.guide_steps
    (guide_id, order_index, title, content, source_url, is_verified, images)
  values
    (v_guide, 1, 'Por qué Mastersmith', 'Mastersmith es la clase Transcendente de la rama Merchant — Merchant → Blacksmith → Mastersmith — y su rol oficial es Forging / Hybrid, con STR, VIT y DEX como stats favorecidas. A diferencia de un tanque puro o un mago de área, todo el kit de Mastersmith gira en torno a dos herramientas muy suyas: el carro y el hacha.

El patrón se repite en casi todas sus habilidades de daño: son porcentajes enormes sobre un único golpe o una explosión en área, no un DPS sostenido de ataques básicos. High Speed Cart Ram inflige 900% de daño físico neutral a un objetivo con un 50% de probabilidad de aturdirlo — pero solo puedes lanzarla si tienes activo el estado de Cart Boost. Axe Boomerang golpea al objetivo y a hasta 10 enemigos cercanos en 3 metros con un 1050% de daño físico neutral (1220% contra monstruos). Y si necesitas cubrir aún más área, Axe Tornado reparte 240% + 105 de daño de Fuego a tu alrededor, que sube a 480% + 160 en el centro de la zona.

Eso condiciona el reparto de puntos: STR primero, porque es la base de tu ATK y del daño físico plano sobre el que se calculan todos esos porcentajes; VIT después, porque te da el colchón de HP para plantarte en medio de una pelea de gremio mientras preparas el combo; y DEX al final, para el HIT y la velocidad de casteo que ayudan a que tu apertura no falle. El resto de esta guía te lleva árbol por árbol, desde Merchant hasta el núcleo de Mastersmith, hasta el combo exacto y el equipo que lo completa.', 'https://www.roochub.com/classes/mastersmith', false, array[]::text[]),
    (v_guide, 2, 'Árbol Merchant (1er trabajo)', 'El árbol de Merchant es donde nace el kit de Mastersmith: aquí desbloqueas el carro, tu herramienta de toda la vida, antes de pasar a Blacksmith y luego al propio Mastersmith. Este es el orden que te recomendamos.

• Crazy Uproar (1 punto) — permanente: STR +4. Un único punto, permanente, y STR es tu stat principal: no hay motivo para no tenerlo desde ya.
• Cart Use (1 punto) — desbloquea el uso del carro. Es la puerta de entrada a Cart Revolution, Cart Clash y, más adelante, a todo el árbol de Mastersmith: sin este punto no hay build.
• Mammonite al máximo — tu primer golpe fuerte: cada ataque consume Eden Coins e inflige 220% + 110 de daño físico neutral.
• Cart Revolution (1 punto, requiere Cart Use Lv1) — selecciona un objetivo y golpea también a hasta 10 enemigos cercanos con 100% de daño físico neutral. Tu primera herramienta de área.
• Cart Clash al máximo (requiere Cart Revolution Lv1) — 200% de daño físico neutral a un objetivo y hasta 10 enemigos más a lo largo del trayecto, con un 30% de Ralentización durante 3 segundos. Ralentizar a un grupo entero mientras les pegas es oro puro en GvG.
• Slamming Smash al máximo — 200% + 200 de daño físico neutral a un único objetivo, y tus propios ataques ganan Ignorar PDEF +10 durante 2 segundos. Un abridor de combate sólido antes de tener acceso a las herramientas grandes de Mastersmith.
• Enlarge Weight Limit (unos pocos puntos) — sube tu límite de peso permanentemente en 2.000, y de paso sube el daño de Cart Revolution un 50%. Merece la pena aunque sea solo por ese bonus de daño.

Discount y Overcharge quedan para el final si es que te sobran puntos: son beneficios de economía (descuento y sobreprecio de venta en la Kafra Shop), no rinden nada en combate. Cart Modification, que solo amplía el espacio de almacenamiento del carro, tampoco es prioridad.', 'https://www.roochub.com/classes/mastersmith', false, array['https://www.roochub.com/icons/UI_Icon_Skill_Merchant_DaShengNaHan.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Merchant_ShouTuiCheShiYong.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Merchant_JinQianGongJi.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Merchant_ShouTuiCheGongJi.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Merchant_ShouTuiCheChongZhuang.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Merchant_QuanLiHuiJi.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Merchant_FuZhongLiangShangSheng.webp']::text[]),
    (v_guide, 3, 'Árbol Blacksmith (2do trabajo)', 'Blacksmith es tu segundo trabajo, y aquí arrancan los buffs que sostienen todo el burst de Mastersmith. Sigue este orden — varios puntos son requisito para desbloquear el siguiente.

• Hilt Binding (1 punto) — permanente: STR +1, PATK +4, y cuando lanzas Adrenaline Rush, Power Thrust o Weapon Perfection, su duración sube un 10%. Cuesta un único punto y desbloquea Weaponry Research, así que tómalo ya.
• Weaponry Research al máximo (requiere Hilt Binding Lv1) — PATK +20 y HIT +30% permanentes. Pasivo puro, no hay motivo para retrasarlo.
• Hammer Fall al máximo — 70% de probabilidad de Aturdir a hasta 10 enemigos a tu alrededor. Tu control de masas más fiable para abrir una pelea de grupo.
• Adrenaline Rush al máximo (requiere Hammer Fall Lv2) — sube la ASPD de los aliados que lleven Hacha o Contundente: +20% si son de la rama Merchant, +15% el resto, durante 300 segundos.
• Weapon Perfection al menos a nivel 3 (requiere Weaponry Research Lv2 y Adrenaline Rush Lv2) — tu grupo ignora el tamaño de los monstruos y gana +100% de modificador de tamaño contra todos ellos, durante 300 segundos. No te saltes ese nivel 3: es lo que te pide más adelante Maximize Power.
• Power Thrust al máximo (requiere Adrenaline Rush Lv3) — el grupo gana +4% de PATK de arma y +10 de HIT; tú, como Blacksmith, sumas además +20% de bono de PATK de arma, durante 300 segundos.
• Maximize Power al máximo (requiere Power Thrust Lv2 y Weapon Perfection Lv3) — elimina el rango de variación de tu daño: cada ataque golpea siempre por el máximo, a cambio de drenarte 1 SP cada 5 segundos.

Skin Tempering queda para el final si te sobran puntos: +20% de resistencia a Fuego y +10% a Neutral. Es defensivo, pero no es la prioridad de este build.', 'https://www.roochub.com/classes/mastersmith', false, array['https://www.roochub.com/icons/UI_Icon_Skill_Merchant_WuQiBaoYou.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Merchant_WuQiYanJiu.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Merchant_DaDiZhiJi.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Merchant_SuDuJiFa.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Merchant_WuShiTiXingGongJi.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Merchant_XiongKan.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Merchant_WuQiZhiZuiDaHua.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Merchant_QiangHuaHuoShuXing.webp']::text[]),
    (v_guide, 4, 'Árbol Mastersmith (Trans. 2nd) — el núcleo del build', 'Esta es la joya de la corona: tu clase Transcendente, donde todo lo anterior se convierte en el kit de Mastersmith. Sigue el orden con disciplina — aquí varias habilidades dependen unas de otras para poder lanzarse siquiera.

• Impact Landing (1 punto) — te libera de cualquier control activo y te da Inmunidad a Control durante 2 segundos. Un único punto, y en PvP/GvG puede ser la diferencia entre completar tu combo o quedarte aturdido a mitad de camino.
• Cart Boost (1 punto) — el interruptor de todo el árbol: +50% de MSPD y +20% de Bono de Daño Físico durante 300 segundos, más una ventana reforzada de +30% de MSPD y +30% de Reducción de Daño Físico/Mágico durante 7 segundos. Sin Cart Boost activo no puedes ni lanzar High Speed Cart Ram.
• High Speed Cart Ram al máximo (requiere Cart Boost Lv1) — tu nuke de objetivo único: 900% de daño físico neutral con 50% de probabilidad de Aturdir. Consume 500 Eden Coins y solo se puede lanzar con Cart Boost activo.
• Axe Boomerang al máximo — tu nuke en área: 1050% de daño físico neutral (1220% contra monstruos) al objetivo y a hasta 10 unidades más en 3 metros a su alrededor. Al llegar a nivel 6, el alcance aumenta 2 metros.
• Maximum Over Thrust al máximo — +40% de ATK de equipo durante 180 segundos, a cambio de 800 Eden Coins. También desbloquea Axe Tornado.
• Axe Tornado al máximo (requiere Maximum Over Thrust Lv5) — gira sobre ti mismo e inflige 240% + 105 de daño de Fuego a hasta 10 enemigos cercanos, que sube a 480% + 160 si están en el centro del remolino.
• Battle Axe Shuriken al máximo (requiere Axe Boomerang Lv5) — +20% de Reducción de Daño Físico/Mágico permanente, +15% de daño extra para Axe Boomerang, y un 20% de probabilidad de que tus ataques normales disparen un eco de Axe Boomerang por 200% de daño físico neutral.
• A.A.S Turret al máximo — invoca una torreta que dura 37 segundos, ataca sola con 100% de daño físico neutral, y hereda el 75% de tu ATK y el 50% de tu HP.
• A.A.S Turret Upgrade al máximo (requiere A.A.S Turret Lv5) — te deja desplegar hasta 3 torretas a la vez, pero tiene una contrapartida real: con 2 torretas en el campo tu propio daño baja un 40%, y con las 3 a la vez baja un 50%. Antes de sacar la segunda o la tercera, piensa si de verdad compensa perder esa parte de tu daño.
• Overload Mode (requiere A.A.S Turret Lv10) — cambia tus torretas al modo Overload: +28% de ASPD durante 10 segundos.
• Strike Mode (requiere A.A.S Turret Lv10, situacional) — cambia tus torretas al modo Strike: sus ataques pasan a golpear en área con 250% de daño físico neutral, a cambio de reducir mucho su ASPD durante 10 segundos. Resérvalo para peleas de grupo donde te interesa más cubrir zona que golpear rápido.
• Melt Down (con unos pocos puntos alcanza) — 15% de probabilidad de romper el arma o la armadura de un jugador rival durante 60 segundos, con +1% adicional por cada 10 puntos de LUK (hasta +30%). Solo rinde de verdad si tu build invierte también en LUK.
• Front Slide (1 punto) — te desplaza rápido hacia delante y se detiene si hay un obstáculo cerca. Útil para reposicionarte entre habilidades.

Cart Max Load Value queda fuera de esta prioridad: solo aumenta la capacidad de tu carro (+2.000 más tu Nivel Base ×10), sin ningún efecto de combate — resérvale puntos solo si ya cubriste todo lo anterior.', 'https://www.roochub.com/classes/mastersmith', false, array['https://www.roochub.com/icons/UI_Icon_Skill_Mechanic_XuanFu.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Merchant_ShouTuiCheJiaSu.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Merchant_ShouTuiCheZhongJieJi.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Merchant_HuiXuanZhiRen.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Merchant_XiongKanZuiDaZhi.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Merchant_ZhanFuJuFeng.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Merchant_ZhanFuShouLiJian.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Merchant_AASTuJiPao.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Merchant_AASTuJiPaoQiangHua.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Merchant_ChaoZaiXingTai.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Merchant_QiangXiXingTai.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Merchant_YeManXiongKan.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Mechanic_QianCeHua.webp']::text[]),
    (v_guide, 5, 'Tu combo principal', 'Con los puntos bien repartidos, la secuencia con la que los ejecutas es lo que de verdad decide una pelea. Este es el combo.

1. Antes de entrar en la pelea, activa tus buffs largos en este orden: Adrenaline Rush, Weapon Perfection, Power Thrust y Maximum Over Thrust — todos duran entre 180 y 300 segundos, así que nunca los actives a mitad de combate.
2. En el instante en que te acercas al objetivo, activa Cart Boost: te da la ventana de +30% de MSPD y +30% de reducción de daño durante 7 segundos, y es el requisito para poder lanzar High Speed Cart Ram.
3. Abre con High Speed Cart Ram sobre tu objetivo prioritario — 900% de daño físico neutral con 50% de probabilidad de Aturdirlo. Si el aturdimiento conecta, el resto del combo va sobre un objetivo que no puede responder.
4. Sigue inmediatamente con Axe Boomerang para golpear a ese mismo objetivo y a todo lo que tenga alrededor en 3 metros.
5. Si el objetivo sigue en pie y ya tienes Maximum Over Thrust activo, remata con Axe Tornado para cubrir el área por completo.
6. Despliega tu A.A.S Turret en cuanto la pelea se alargue más de lo esperado — hereda un porcentaje de tu ATK, así que rinde más cuanto más buffado estés al invocarla.
7. Si te controlan a mitad de secuencia, usa Impact Landing para liberarte y seguir encadenando golpes.', 'https://www.roochub.com/classes/mastersmith', false, array[]::text[]),
    (v_guide, 6, 'Equipo recomendado — cartas', 'Aquí tienes el equipo de cartas que completa el build, elegido por cómo encaja con el perfil STR/VIT/DEX y el daño físico a porcentaje de Mastersmith.

• Skeleton Worker (Rara, Arma) — ATK de arma +20, MATK de arma +20, daño contra criaturas medianas +18%; en set, +1% de daño contra criaturas medianas. Tu opción de arma por defecto: sube tu ATK plano, la base sobre la que se calculan todos tus porcentajes de daño.
• Doppelganger (Épica, Arma) — ASPD +10%, AGI +5, CRIT +5, daño de CRIT +12%; en set, ASPD +2%. Alternativa de arma si prefieres velocidad y crítico en vez del ATK plano de Skeleton Worker.
• Phreeoni (Épica, Arma) — HIT +100, y cada punto de HIT que tengas suma un 0,05% de daño físico, hasta un máximo de +20%; en set, +3% de daño físico. Tercera opción de arma: rinde mejor cuanto más HIT acumules en el resto del equipo.
• Vagabond Wolf (Rara, Prenda) — STR +3, y con refinamiento +12 suma otro +3% de daño físico; en set, +12 de MATK de arma. Stat plano en tu prioridad número uno.
• Orc Hero (Épica, Cabeza superior) — VIT +8, y cada 6 segundos elimina el Aturdimiento activo y te da inmunidad a Aturdimiento durante 4 segundos; en set, +3% de daño físico. VIT es tu segunda prioridad, y la inmunidad a aturdimiento protege justo la ventana en la que preparas High Speed Cart Ram.
• Orc Lord (Épica, Armadura) — al recibir ataques físicos, refleja un 20% de ese daño (+0,2% adicional por cada punto de VIT, hasta 40%) a quien te golpeó, con 4 segundos de reutilización; en set, +3% de reducción de daño físico. Cuanta más VIT acumules para tu HP, más duele tu reflejo.
• Zerom (Común, Accesorio) — DEX +3, CRIT +2; en set, +5 de MATK de arma. Barata y fácil de conseguir, y suma tu tercera prioridad de stats.
• Horn (Rara, Mano secundaria) — reducción de daño físico +20%; en set, +1% de resistencia a criaturas pequeñas. Colchón defensivo para sobrevivir al instante en que te comprometes con Cart Boost y High Speed Cart Ram.', 'https://www.roochub.com/cards', false, array['https://www.roochub.com/icons/UI_MonsterCard_Xiehaikuanggong.webp', 'https://www.roochub.com/icons/UI_MonsterCard_Siling.webp', 'https://www.roochub.com/icons/UI_MonsterCard_Pilien.webp', 'https://www.roochub.com/icons/UI_MonsterCard_Liulangzhilang.webp', 'https://www.roochub.com/icons/UI_MonsterCard_Shourenyingxiong.webp', 'https://www.roochub.com/icons/UI_MonsterCard_Shourenqiuzhang.webp', 'https://www.roochub.com/icons/UI_MonsterCard_Jieluomi.webp', 'https://www.roochub.com/icons/UI_MonsterCard_Qiaoxingchong.webp']::text[]),
    (v_guide, 7, 'Mascota recomendada', 'De las 9 mascotas disponibles en el juego, la que mejor encaja con un nuker físico como Mastersmith es Dr. Owl (rol DPS de objetivo único). Su habilidad exclusiva, Gale Wind, dispara una flecha de viento con 800% de daño físico y aumenta un 20% el daño físico que recibe el objetivo golpeado; si le subes las 10 mejoras al máximo, el daño de la flecha sube a 1200% y el aumento de daño físico recibido llega a 30%. Ese último efecto es lo que importa de verdad: cualquier golpe físico tuyo que llegue después —un High Speed Cart Ram, un Axe Boomerang— se beneficia de que el objetivo esté marcado para recibir más daño.

Si prefieres un enfoque distinto, Kitten Oracle es la alternativa más cercana: en vez de debilitar al rival, te sube directamente a ti un +10% de ASPD (que en el Tier 10 también suma +5% de daño crítico y +20% de probabilidad de crítico), sobre un golpe propio de 800% de daño físico neutral que llega a 1200% en el Tier 10.', 'https://roocdb.com/en/pets', false, array['https://roocdb.com/pets/Pokemon_maotouyingboshi.webp']::text[]),
    (v_guide, 8, 'Trucos para 5v5 (Dimension Drill)', 'Dimension Drill reúne varios minijuegos de 5v5, y Mastersmith tiene una lectura propia para cada uno.

• Blood and Gold — cuando el equipo rival se agrupe junto al Goblin King, ese es el momento de soltar Axe Boomerang o Axe Tornado: ambas golpean en área y aprovechan que están todos juntos.
• Shapeshift Ops — no tienes forma de proteger directamente a quien recoge el orbe de transformación, así que tu aporte es despejar a los rivales que se acerquen: abre con High Speed Cart Ram sobre el que más amenace la recogida, aprovechando su 50% de probabilidad de Aturdir.
• Cart Contest — con Cart Boost activo llevas un +50% de MSPD extra, así que eres un buen candidato para cargar el carro tú mismo; si alguien intenta frenarte cuerpo a cuerpo, tu propio combo de daño lo castiga antes de que lo consiga.
• Team Deathmatch — activa tus buffs largos antes de que empiece la ronda, y guarda Cart Boost + High Speed Cart Ram para el primer objetivo aislado que veas, no para el primero que se cruce contigo.', 'https://www.roochub.com/classes/mastersmith', false, array[]::text[]),
    (v_guide, 9, 'Trucos para GvG (guerra de gremios)', 'La guerra de gremios recompensa otro tipo de decisiones. Estos son los ajustes que marcan la diferencia con Mastersmith.

• Cargar el Cuerno en Vigrid Avenge — no eres la mejor opción para portarlo tú mismo (para eso está un HP-tanque como Paladin), pero sí eres quien mejor puede despejar el camino: usa Axe Boomerang y Axe Tornado contra quien intente interceptar a tu portador.
• Defender un Crystal Pillar en Vale of Clash — despliega tu A.A.S Turret junto al pilar antes de que llegue el grupo rival: son 37 segundos de daño constante sin que tengas que quedarte plantado en primera línea, y Axe Tornado castiga a cualquiera que se amontone encima para intentar capturarlo.
• Cambios de objetivo en Stellar Clash — en el momento en que tu equipo marca un nuevo objetivo, activa Cart Boost y abre con High Speed Cart Ram: el 50% de probabilidad de Aturdir puede cortar en seco la huida del objetivo marcado.
• Melt Down contra el equipo rival — en un combate masivo prolongado, aprovecha para romper el arma o la armadura de quien más te esté golpeando; 60 segundos sin esa pieza de equipo pesan mucho en una guerra de gremios larga.', 'https://www.roochub.com/classes/mastersmith', false, array[]::text[]),
    (v_guide, 10, 'Errores que cuestan partidas', 'Incluso con el build perfecto sobre el papel, estos son los fallos que más partidas cuestan con Mastersmith.

• Intentar lanzar High Speed Cart Ram sin tener Cart Boost activo: la habilidad exige ese estado para poder ejecutarse, así que sin él, ni siquiera sale.
• Gastar Maximum Over Thrust (800 Eden Coins) y High Speed Cart Ram (500 Eden Coins) sin llevar cuenta de tu reserva de Eden Coins, y quedarte sin recursos justo cuando más los necesitas para rematar.
• Sacar una segunda o tercera A.A.S Turret sin recordar la penalización de A.A.S Turret Upgrade: -40% de tu propio daño con 2 torretas, -50% con las 3. En una pelea que necesitas ganar rápido, puede que te convenga más una sola torreta.
• Usar Strike Mode por costumbre en un 1v1, cuando lo que necesitabas era la velocidad de Overload Mode y no la cobertura en área.
• No usar Impact Landing a tiempo y perder toda la ventana de burst por quedar controlado antes de rematar con Axe Boomerang o Axe Tornado.', 'https://www.roochub.com/classes/mastersmith', false, array[]::text[]);
end
$IMPERIUM$;
