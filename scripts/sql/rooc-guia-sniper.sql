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
    select id from public.guides where game_id = v_game and slug = 'sniper-build');
  delete from public.guides where game_id = v_game and slug = 'sniper-build';

  insert into public.guides
    (game_id, slug, title, description, order_index, is_published, intro_title, intro, intro_images)
  values
    (v_game, 'sniper-build', 'Sniper: build para PvP y GvG', 'Build de Sniper para Ragnarok Origin Classic pensada para PvP y GvG: orden de los árboles Archer, Hunter y Sniper, el combo de daño a distancia, las cartas y la mascota recomendadas, y trucos concretos para 5v5 y guerra de gremios.', 12, false, 'El arquero que nunca deja acercarse al rival', 'Sniper es el DPS a distancia de la rama Archer → Hunter → Sniper: mientras clases como Paladin deciden la pelea plantándose en primera línea, tú la decides antes de que el rival llegue a tocarte. Vulture''s Eye te da un alcance de ataque muy por encima de cualquier clase cuerpo a cuerpo, y desde el momento en que aprendes Falconry Mastery llevas contigo un Falcon que ataca en paralelo a tus propios golpes — con Steel Crow y Blitz Beat, esos golpes de tu Falcon dejan de ser un extra menor y pasan a ser una segunda fuente de daño constante.

Eso condiciona toda la prioridad de stats: DEX primero, porque es tu daño base y tu precisión (HIT); después AGI, porque determina tu velocidad de ataque — cuánto tardas en encadenar golpes normales, en cargar Wind Dance, y con qué frecuencia dispara el proc pasivo de Blitz Beat; e INT en tercer lugar, porque entra directamente en la fórmula de daño de tu Falcon y te da algo de colchón de SP para mantener activas tus trampas y habilidades. STR, VIT y LUK quedan como relleno muy secundario.

Con esa base de stats, esta guía repasa el orden de tus tres árboles de habilidades, el combo que abre y cierra una pelea, el equipo de cartas y la mascota que mejor completan el build, y trucos concretos para 5v5 (Dimension Drill) y GvG.', array['https://www.roochub.com/icons/UI_Common_Profession_Icon_18.webp']::text[])
  returning id into v_guide;

  insert into public.guide_steps
    (guide_id, order_index, title, content, source_url, is_verified, images)
  values
    (v_guide, 1, 'Por qué Sniper', 'Sniper es el DPS a distancia de la rama Archer → Hunter → Sniper: mientras clases como Paladin deciden la pelea plantándose en primera línea, tú la decides antes de que el rival llegue a tocarte. Vulture''s Eye te da un alcance de ataque muy por encima de cualquier clase cuerpo a cuerpo, y desde el momento en que aprendes Falconry Mastery llevas contigo un Falcon que ataca en paralelo a tus propios golpes — con Steel Crow y Blitz Beat, esos golpes de tu Falcon dejan de ser un extra menor y pasan a ser una segunda fuente de daño constante.

Eso condiciona toda la prioridad de stats: DEX primero, porque es tu daño base y tu precisión (HIT); después AGI, porque determina tu velocidad de ataque — cuánto tardas en encadenar golpes normales, en cargar Wind Dance, y con qué frecuencia dispara el proc pasivo de Blitz Beat; e INT en tercer lugar, porque entra directamente en la fórmula de daño de tu Falcon y te da algo de colchón de SP para mantener activas tus trampas y habilidades. STR, VIT y LUK quedan como relleno muy secundario.

Con esa base de stats, esta guía repasa el orden de tus tres árboles de habilidades, el combo que abre y cierra una pelea, el equipo de cartas y la mascota que mejor completan el build, y trucos concretos para 5v5 (Dimension Drill) y GvG.', 'https://www.roochub.com/classes/sniper', false, array[]::text[]),
    (v_guide, 2, 'Árbol Archer (1er trabajo)', 'El árbol de Archer es donde se cimenta todo el build: aquí consigues tu alcance, tu precisión y tu primer golpe de daño de verdad antes de avanzar a Hunter y, después, a Sniper. Este es el orden de prioridad recomendado.

• Owl''s Eye al máximo — pasivo obligatorio: +10 de DEX y +15% de ASPD de forma permanente. No cuesta nada mantenerlo al día, así que no hay motivo para retrasarlo.
• Vulture''s Eye al máximo — pasivo que aumenta tu alcance de ataque de forma permanente: es la base de tu ventaja frente a cualquier clase cuerpo a cuerpo, la razón por la que puedes golpear antes de que te golpeen a ti.
• Double Strafe al máximo — tu golpe físico neutral principal contra un único objetivo: de 170% + 20 de daño en el nivel 1 a 350% + 200 en el nivel 10.
• Fetter Arrow (1 punto) — 150% de daño físico e inmoviliza al objetivo durante 3 segundos. Un solo punto y tienes con qué frenar a alguien que intenta huir.
• Arrow Shower (unos pocos puntos, o al máximo si te sobran) — daño físico neutral en área con empuje: de 120% + 10 en el nivel 1 a 300% + 100 en el nivel 10. Rinde mucho contra grupos, pero no es tu prioridad en un duelo 1v1.

Si te sobran puntos, Steady Focus (requiere Owl''s Eye Nv. 5) te da +10 de AGI y DEX durante 240 segundos — un extra situacional, no una prioridad temprana.', 'https://www.roochub.com/classes/sniper', false, array['https://www.roochub.com/icons/UI_Icon_Skill_Archer_EXiaoZhiYan.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Archer_ErLianShi.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Archer_CangYingZhiYan.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Archer_ChongFengJian.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Archer_JianYu.webp']::text[]),
    (v_guide, 3, 'Árbol Hunter (2do trabajo)', 'Hunter es tu segundo trabajo, y aquí es donde tu Falcon se convierte en una fuente de daño real en paralelo a tus propios golpes. Sigue este orden.

• Falconry Mastery (1 punto, obligatorio) — invoca a tu Falcon de forma permanente. Sin este único punto no hay Blitz Beat, ni Steel Crow, ni ninguna de las mejoras que Sniper añade más adelante sobre tu Falcon.
• Steel Crow al máximo — pasivo que escala de +20 de PDMG y 1000% de tu PATK en el nivel 1 hasta +200 de PDMG y 10000% de tu PATK en el nivel 10: es lo que convierte los golpes de tu Falcon en un daño que de verdad se nota.
• Blitz Beat al máximo — requiere Falconry Mastery Nv. 1. Ordena a tu Falcon golpear al objetivo con daño físico neutral calculado a partir del nivel de Steel Crow, tu DEX, tu INT, el PATK de Steel Crow y tu PATK base (este último bono de PATK base solo cuenta en PvE), y golpea hasta 10 objetivos alrededor del principal. Además, de forma pasiva, un 15% de tus ataques normales hacen que tu Falcon golpee automáticamente — probabilidad que sube un 1% adicional por cada 4 puntos de LUK que tengas.
• Wind Dance al máximo — se carga con tus propios ataques normales y con Double Strafe; al completarse, dispara un golpe físico neutral de 700% + 300 de daño contra el objetivo que elijas.
• Falcon Assault al máximo — requiere Blitz Beat Nv. 5. En su versión completa, ordena a tu Falcon infligir un 400% del daño de tu Blitz Beat a un único objetivo: tu mayor golpe de daño puro en esta fase del build.
• Beastbane (con unos pocos puntos alcanza) — pasivo de daño contra criaturas de tipo Bruto e Insecto, de +2% en el nivel 1 a +20% en el nivel 10. Es más una herramienta de PvE que de PvP, pero es barato.

El resto del árbol —Freezing Trap, Claymore Trap, Land Mine, Blast Mine, Flasher, Sandman Shock Trap, Skid Trap y Detecting— son las trampas clásicas de Hunter: control y utilidad pensados sobre todo para farmear y despejar zonas, no para el 1v1 o el GvG de este build. Repárteles solo los puntos que te sobren.', 'https://www.roochub.com/classes/sniper', false, array['https://www.roochub.com/icons/UI_Icon_Skill_Archer_XunYingShu.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Archer_GangZhiHui.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Archer_ShanDianChongJi.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Archer_JiFengLuanWu.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Archer_LieYingTuJi.webp']::text[]),
    (v_guide, 4, 'Árbol Sniper (Trans. 2nd) — el núcleo del build', 'Esta es la joya de la corona: tu tercera clase (Trans. 2nd), donde todo lo anterior se convierte en el build de Sniper. Sigue el orden con disciplina — varias de estas habilidades potencian directamente lo que ya tenías en Hunter.

• True Sight al máximo — tu buff de entrada a la pelea, durante 120 segundos: +10 a tus stats base, +20% de ataque de arma, +10 de CRIT, +20% de daño crítico y +20% de daño físico. Actívalo SIEMPRE antes de abrir el combate, igual que un Paladin activa Spear Quicken: a mitad de pelea ya perdiste la ventana en la que más rinde.
• Refined Double Strafing al máximo — pasivo: un 50% de probabilidad de disparar una flecha adicional cada vez que usas Double Strafe. En la práctica, la mitad de tus Double Strafe hacen casi el doble de daño.
• Burst Claw al máximo — pasivo: los golpes de tu Falcon pueden ser críticos, sumando un +25% de daño crítico (+40% en PvE), y el daño porcentual que aplica Steel Crow se incrementa otro 200%. Es lo que convierte a tu Falcon de acompañante pasivo a segunda fuente de burst.
• Sonic Blast al máximo — requiere Blitz Beat. Ordena a tu Falcon golpear y marcar al objetivo, infligiendo un 300% del daño de tu Blitz Beat a un único objetivo; además, de forma pasiva, cada 3 activaciones de Blitz Beat desencadenan un Sonic Blast automático sin que tengas que lanzarlo tú.
• Falcon Assault (se termina de mejorar aquí) — recuerda que en su versión completa llega al 400% del daño de tu Blitz Beat sobre un único objetivo; combinado con Sonic Blast y Burst Claw, tu Falcon deja de ser un acompañante y pasa a ser tu segunda línea de daño.
• Arrow Training al máximo — pasivo: tus flechas consumibles ganan de +6% a +10% de daño según el nivel, más un extra plano de PATK que va de +10 a +50.
• Advanced Detecting (1 punto) — pasivo: alarga la duración de Detecting a 60 segundos y suma un 30% de daño de habilidad extra contra objetivos bajo Sigilo. Muy rentable si el equipo rival lleva alguna clase con invisibilidad.
• Wind Walker (con unos pocos puntos alcanza) — da a tus aliados de grupo +60% de velocidad de movimiento durante 5 segundos, y a ti un +15% adicional durante 20 segundos, sin que tu propia velocidad de movimiento pueda bajar del 100%. Tu herramienta para replegarte o para alcanzar a alguien que huye.
• Disengage (1-3 puntos) — tu botón de escape: lanzas una bomba de humo y saltas hacia atrás, dejando una Freezing Trap en tu posición original para cualquiera que intente perseguirte.
• Freezing/Claymore/Land Mine/Blast Mine Research (si te sobran puntos) — los cuatro mejoran tus trampas de Hunter: Freezing Trap Research sube la ralentización posterior de 22% a 40%; Claymore Trap Research suma de +1% a +10% de daño y crea una zona ardiente que hace de 12% a 30% del daño de Claymore; Land Mine Research da de 23% a 35% de probabilidad de un golpe reforzado que hace de 62% a 87% más daño; Blast Mine Research crea una zona de viento que hace de 12% a 30% del daño de Blast Mine. Los cuatro brillan más farmeando que en PvP/GvG — déjalos para el final.

Heal Guard Trap queda como la última prioridad: es una trampa de curación para un aliado, útil pero secundaria en un build centrado en tu propio daño.', 'https://www.roochub.com/classes/sniper', false, array['https://www.roochub.com/icons/UI_Icon_Skill_Archer_JuShaMiaoZhun.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Archer_QiangHuaErLianShi.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Archer_BaoLieHui.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Archer_YinSuChongJi.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Archer_JianShiXiuLian.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Archer_GaoJieLieYing.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Archer_FengZhiBu.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Archer_WeiZhuangZhanShu.webp']::text[]),
    (v_guide, 5, 'Tu combo principal', 'Tener los puntos bien repartidos no sirve de nada si no ejecutas el combo en el orden correcto. Esta es la secuencia que de verdad decide una pelea.

1. Activa True Sight antes de entrar en la pelea — nunca a mitad de combate: toda la ventana de CRIT, daño físico y ataque de arma es la que hace funcionar el resto del combo.
2. Abre con Sonic Blast o Falcon Assault sobre tu objetivo. Ambas dependen de Blitz Beat y son tu mayor golpe de daño puro nada más entrar.
3. Encadena Double Strafe — con la flecha extra de Refined Double Strafing activándose la mitad de las veces — mientras tu Falcon sigue golpeando en paralelo gracias a Steel Crow y Burst Claw.
4. Si el objetivo intenta huir, usa Fetter Arrow para inmovilizarlo 3 segundos: tiempo de sobra para rematarlo tú o tu equipo.
5. Si eres tú quien necesita salir, Disengage (con su Freezing Trap de regalo) o el extra de velocidad de Wind Walker son tu vía de escape — nunca te quedes a intercambiar golpes con un cuerpo a cuerpo que ya te tiene encima.', 'https://www.roochub.com/classes/sniper', false, array[]::text[]),
    (v_guide, 6, 'Equipo recomendado — cartas', 'Aquí tienes el equipo de cartas que completa el build. Por la convención de dos décadas que arrastra esta franquicia, cada carta suele caer del monstruo o jefe que comparte su nombre — tómalo como una referencia orientativa y no como un dato de drop confirmado por un parche concreto de ROOC.

• Doppelganger (Épica, Arma) — +10% de ASPD, +5 de AGI, +5 de CRIT y +12% de daño crítico; en set, otro +2% de ASPD. Es el mayor acelerador de tu combo de autoataques y de tu proc de Blitz Beat que puedes meter en el arma. La suelta el MVP Doppelganger.
• Phreeoni (Épica, Arma) — +100 de HIT, y cada punto de HIT que tengas suma un 0,05% de daño físico adicional, hasta un máximo de 20%; en set, +3% de daño físico. Con Refined Double Strafing ya empujando tu HIT hacia arriba, esta carta convierte esa precisión extra en daño plano. La deja caer el MVP Phreeoni.
• Drake (Épica, Arma) — +12% de daño físico y mágico, y con el set completo, otro +3% de ataque de arma. Daño plano sin condiciones, siempre rinde. La suelta el MVP Drake.
• Gryphon (Rara, Arma) — +2 de FLEE y +7 de CRIT, con un 8% de probabilidad de que tus ataques físicos lancen automáticamente Bowling Bash Nv. 5 (se acumula con varias copias); en set, +3 de Resistencia a CRIT. Al ser un monstruo de campo, es mucho más accesible que las tres cartas de arma anteriores mientras las consigues.
• Horn (Rara, Mano secundaria) — reduce un 20% el daño físico que recibes. Con la HP baja que arrastra cualquier Sniper, esta es la pieza que más partidas te va a salvar. Cae de un monstruo de campo corriente, así que es de lo más fácil de conseguir de toda la lista.
• Baphomet Jr., como carta (Poco común, Prenda) — +1 de CRIT y +3 de AGI; en set, +5 de MATK de arma. Barata, accesible desde el principio, y encaja perfectamente con tu prioridad de stats.
• Wild Rose (Poco común, Calzado) — +2 de AGI y +5 de FLEE; en set, +5 de ATK de arma. Otra pieza económica que suma algo de evasión extra a una clase que, si la atrapan, no aguanta mucho.', 'https://www.roochub.com/cards', false, array['https://www.roochub.com/icons/UI_MonsterCard_Siling.webp', 'https://www.roochub.com/icons/UI_MonsterCard_Pilien.webp', 'https://www.roochub.com/icons/UI_MonsterCard_Haidaozhiwang.webp', 'https://www.roochub.com/icons/UI_MonsterCard_shijiushou.webp', 'https://www.roochub.com/icons/UI_MonsterCard_Qiaoxingchong.webp', 'https://www.roochub.com/icons/UI_MonsterCard_Xiaobafengte.webp', 'https://www.roochub.com/icons/UI_MonsterCard_Kuangbaoyemao.webp']::text[]),
    (v_guide, 7, 'Mascota recomendada', 'De las 9 mascotas disponibles en ROOC, la mayoría están pensadas para tanques o para daño mágico — no encajan con un DPS físico a distancia. Dos sí que tienen sentido para Sniper, cada una con un rol distinto.

• Dr. Owl (rol DPS de objetivo único) — su habilidad exclusiva, Gale Wind, dispara una flecha de viento que inflige un 800% de daño físico al objetivo y aumenta un 20% el daño físico que recibe; en el Tier 10 esos números suben a 1200% de daño y +30% de daño físico recibido. Es la mascota que más sentido temático y mecánico tiene para esta build: un pájaro que dispara flechas, cuyo efecto marca al objetivo para que todo tu daño físico —el tuyo y el de tu Falcon— le pegue más fuerte. Es tu pick principal.
• Sohee (rol de soporte) — su habilidad exclusiva, Lucid Dream, da a Sohee y a su dueño +10% de velocidad de ataque, +5% de velocidad de movimiento y 2% de robo de vida durante 8 segundos (a cambio de +3 segundos de reutilización de habilidades); en el Tier 10 llega a +30%/+12%/5%. La velocidad de movimiento extra es justo lo que necesitas para reposicionarte o kitear sin perder tu ventaja de rango, y el ASPD encima acelera tu ciclo de autoataques.

Si prefieres un segundo pet más ofensivo en vez del soporte de Sohee, Kitten Oracle es la alternativa más cercana: su Battle Blessing pega 800% de daño físico neutral a un objetivo y te da a TI +10% de ASPD, subiendo en el Tier 10 a 1200% de daño más +5% de daño crítico y +20% de probabilidad de crítico para el dueño — un pet que refuerza directamente tu propio crítico en vez de debilitar al rival.', 'https://roocdb.com/en/pets', false, array['https://roocdb.com/pets/Pokemon_maotouyingboshi.webp', 'https://roocdb.com/pets/Pokemon_guinv.webp', 'https://roocdb.com/pets/Pokemon_zhanbumao.webp']::text[]),
    (v_guide, 8, 'Trucos para 5v5 (Dimension Drill)', 'Dimension Drill reúne varios minijuegos de 5v5, y Sniper tiene un enfoque distinto al de un tanque en cada uno de ellos: tu ventaja siempre es la distancia, nunca el intercambio directo de golpes.

• Blood and Gold — mantente fuera del alcance del grupo que se amontona junto al Goblin King y golpéalos con Double Strafe y Arrow Shower desde fuera; guarda Sonic Blast y Falcon Assault para rematar a quien se separe del grupo con poca vida.
• Shapeshift Ops — en cuanto un rival recoja el orbe de transformación, márcalo con Sonic Blast y vacía tu Falcon Assault sobre él: tu rango te permite empezar a dañarlo antes de que cualquier cuerpo a cuerpo de tu equipo llegue a alcanzarlo.
• Cart Contest — usa Fetter Arrow sobre quien intente frenar cuerpo a cuerpo a tu portador del carro; 3 segundos de inmovilización bastan para que tu equipo lo aparte del camino.
• Team Deathmatch — activa True Sight antes de que empiece la ronda y elige como objetivo a quien ya esté aislado o con poca vida — con tu HP no te puedes permitir ser el primero en intercambiar golpes.', 'https://www.roochub.com/classes/sniper', false, array[]::text[]),
    (v_guide, 9, 'Trucos para GvG (guerra de gremios)', 'La guerra de gremios premia decisiones distintas a las del 5v5. Estos son los trucos que marcan la diferencia para Sniper.

• Cargar el Cuerno en Vigrid Avenge — no es tu trabajo: esa mecánica te desangra sin parar mientras lo llevas, y con tu HP no aguantas ese desgaste. Deja que un tanque como Paladin lo cargue y quédate a rango cubriéndolo, usando Fetter Arrow sobre cualquiera que se acerque a interceptarlo.
• Defender un Crystal Pillar en Vale of Clash — dispara desde fuera del grupo que se amontona sobre el punto; Arrow Shower rinde especialmente bien contra el amasijo de rivales apilados encima del pilar, y tu rango te permite empezar a golpear antes de que lleguen a tu posición.
• Cambios de objetivo en Stellar Clash — usa Sonic Blast para marcar al instante al nuevo objetivo en cuanto tu equipo decida saltar sobre él: la marca avisa a tu equipo de a quién enfocar, y tu propio Falcon Assault ya está haciendo daño desde el primer segundo.
• Norma general — tu HP es una fracción de la de un tanque. Nunca seas el primero en el frente: deja que tu línea se abra paso y entra tú desde atrás, a la distancia que te da Vulture''s Eye.', 'https://www.roochub.com/classes/sniper', false, array[]::text[]),
    (v_guide, 10, 'Errores que cuestan partidas', 'Incluso con el build perfecto sobre el papel, estos son los fallos que más partidas cuestan.

• Abrir el combate sin True Sight activo. Sin ese +20% de daño físico y ese CRIT extra, tu burst de apertura rinde muy por debajo de lo que debería.
• Dejar que un cuerpo a cuerpo te alcance en vez de mantener la distancia que te da Vulture''s Eye — una vez que te tienen encima, tu HP no te perdona el error.
• Gastar Fetter Arrow como daño suelto en lugar de guardarlo para inmovilizar a quien huye o amenaza a tu compañero más débil.
• Ignorar Disengage cuando ya te tienen acorralado. Con tu HP, intercambiar golpes con un melee en vez de escapar casi siempre termina en tu muerte, no en la suya.
• Repartir puntos en las trampas de Hunter (Freezing, Claymore, Land Mine, Blast Mine) pensando en PvP o GvG: son herramientas de farmeo, no el núcleo de este build.', 'https://www.roochub.com/classes/sniper', false, array[]::text[]);
end
$IMPERIUM$;
