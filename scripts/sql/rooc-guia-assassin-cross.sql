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
    select id from public.guides where game_id = v_game and slug = 'assassin-cross-build');
  delete from public.guides where game_id = v_game and slug = 'assassin-cross-build';

  insert into public.guides
    (game_id, slug, title, description, order_index, is_published, intro_title, intro, intro_images)
  values
    (v_game, 'assassin-cross-build', 'Assassin Cross: build para PvP y GvG', 'Build de Assassin Cross para Ragnarok Origin Classic pensada para el Tyr Cup. Cubre el orden de los tres árboles de habilidades (Thief, Assassin y Assassin Cross), el combo de veneno y crítico que decide una pelea, y las cartas y mascota recomendadas para PvP 5v5 y GvG.', 8, false, 'El filo que golpea antes de que el rival reaccione', 'El Tyr Cup sigue en marcha, y si tu plan es entrar como Assassin Cross conviene tener claro desde ya que esta clase no perdona errores de apertura: es pura build de cristal, pensada para golpear primero y decidir la pelea antes de que el rival tenga ocasión de responder. Esta guía reúne el orden de los tres árboles de habilidades —Thief, Assassin y Assassin Cross—, el combo exacto de veneno y crítico que hace el daño real, y el equipo de cartas y mascota que completa el build.

Assassin Cross reparte en AGI y STR para golpear rápido y fuerte, y en LUK para que esos críticos caigan más a menudo. Su daño se apoya en dos pilares que se retroalimentan: la vía crítica pura de Katar Mastery y Double Attack Mastery, que convierte cada golpe crítico en un golpe extra, y la vía de veneno de Poisonous Blade y Envenomed Blade, donde el segundo dobla su daño entero si el objetivo ya está envenenado. Todo el reparto de puntos de esta guía existe para que ambos pilares lleguen a tiempo a la vez.

A diferencia de Paladin, no hemos encontrado ningún dato de leaderboard o de la Gran Final del Tyr Cup específico para esta clase — si aparece más adelante, se puede sumar aquí. Lo que sí tienes, paso a paso a partir del primer punto, es el reparto de habilidades, el combo y el equipo completo.', array['https://www.roochub.com/icons/UI_Common_Profession_Icon_16.webp']::text[])
  returning id into v_guide;

  insert into public.guide_steps
    (guide_id, order_index, title, content, source_url, is_verified, images)
  values
    (v_guide, 1, 'Por qué Assassin Cross', 'Assassin Cross es la salida de daño crítico del árbol Thief, después de pasar por Assassin — la clase pensada para abrir el combate y decidirlo antes de que el rival reaccione. No hemos podido confirmar ningún dato de leaderboard o de la Gran Final del Tyr Cup específico para esta clase, así que esta guía se apoya en lo que sí está confirmado: su identidad de diseño. Reparte en AGI, STR y LUK — AGI y STR para golpear rápido y fuerte, LUK para que esos críticos caigan más a menudo — y es una clase de cristal que necesita entrar primero en la pelea, porque vive de rematar antes de que la rematen a ella.

Su kit se apoya en dos pilares que se retroalimentan entre sí: el filo crítico puro de Katar Mastery / Advanced Katar Mastery y Double Attack Mastery (que convierte tus propios críticos en golpes dobles), y el veneno de Deadly Poison, Poisonous Blade y Envenomed Blade, donde este último dobla su daño entero si el objetivo ya está envenenado. Todo el reparto de puntos que sigue está pensado para que esos dos pilares lleguen a tiempo a la vez: cuanto antes tengas ambos en marcha, antes puedes abrir con la ventaja que esta clase necesita para funcionar.', 'https://www.roochub.com/classes/assassin_cross', false, array[]::text[]),
    (v_guide, 2, 'Árbol Thief (1er trabajo)', 'El árbol de Thief es donde arrancas antes de convertirte en Assassin y, después, en Assassin Cross. Todavía no hay grandes golpes de daño — el objetivo es dejar bien puestas las bases de ataque, esquiva y movilidad para no tener que volver después. Este es el orden que recomendamos.

• Double Attack al máximo — tu primer multiplicador de daño real: 55% de probabilidad de duplicar el golpe con Dagger o Crossbow, y con Katar suma un +20% de Off-Hand. Es pasivo, se aplica a cada ataque básico, y no hay motivo para retrasarlo.
• Increase Dodge al máximo — +30 de FLEE permanentes y +5% de Bono de MSPD. Barato y siempre útil: una clase de cristal como esta necesita cada punto de esquiva que pueda conseguir.
• Trick Control al máximo (en cuanto tengas Double Attack Nv.5) — 300% + 500 de daño físico neutral a hasta 10 monstruos cercanos. No es tu prioridad número uno, pero rinde bien en cualquier pelea donde el rival se agrupe.
• Hiding, al menos hasta Nv.5 — entra en sigilo sin penalización de velocidad de movimiento, consumiendo 1 SP cada 17 segundos durante un máximo de 34 segundos. No la subestimes solo porque no hace daño: en el segundo trabajo necesitas Hiding Nv.5 para desbloquear Hiding Research, la pasiva que de verdad define tu apertura de combate.
• Shield Dodge (unos pocos puntos) — +60 de FLEE y 10% de probabilidad de esquiva absoluta durante 5 segundos.
• Back Slide (1 punto) — +15% de Bono de MSPD durante 10 segundos para reposicionarte o escapar. Cuesta un solo punto, no hay razón para saltártelo.

Envenom y Detoxify quedan para el final si te sobran puntos: Envenom depende de tu Base Level y queda superado en cuanto entras en el árbol de Assassin, y Detoxify solo rinde si tu equipo se enfrenta a mucho veneno enemigo.', 'https://www.roochub.com/classes/assassin_cross', false, array['https://www.roochub.com/icons/UI_Icon_Skill_Thief_ErDaoLianJi.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Thief_CanYing.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Thief_GuiZhaBaXi.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Thief_YinNi.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Thief_ShanBiHuDun.webp']::text[]),
    (v_guide, 3, 'Árbol Assassin (2do trabajo)', 'Assassin es tu segundo trabajo, y aquí empiezas a construir el filo crítico que define a Assassin Cross. Esta guía apuesta por Katar como arma principal — es la que más sinergiza con el árbol final —, así que el orden que sigue prioriza esa vía.

• Katar Mastery al máximo — +50 de PATK con Katar, y además te deja usar Grimtooth fuera de Hiding para entrar en sigilo (dentro de Hiding, Grimtooth crítica). Es la base de todo el daño que viene después.
• Sonic Blow al máximo — tu combo de 8 golpes: 900% + 500 de daño físico neutral (750% en PvP), con 30% de probabilidad de aturdir durante 2,5 segundos.
• Sonic Acceleration al máximo (con Sonic Blow Nv.5) — +28% de HIT y +20% de daño para Sonic Blow. No tiene sentido subir el combo anterior sin esto.
• Enchant Poison al máximo — impregna tu arma de Veneno durante 120 segundos, suma +24 de PATK y da un 7,5% de probabilidad de envenenar en cada golpe normal. Es la puerta de entrada a todo el subárbol de veneno que se vuelve crítico en Assassin Cross.
• Hiding Research, al menos hasta Nv.5 — mientras estás en sigilo, tus habilidades de daño suman un +30% de bono de daño físico extra (eso sí, rompen el sigilo al usarse). Es el motivo real por el que abrir el combate desde Hiding merece la pena.
• Grimtooth (unos pocos puntos, con Sonic Blow o Katar Mastery Nv.5) — 800% + 250 de daño físico a hasta 10 monstruos y reduce un 50% la velocidad de movimiento del rival durante 3 segundos. Ese slow es oro puro contra alguien que intenta huir.
• Back Slide Hiding (1 punto, con Hiding Research Nv.5) — esquiva el golpe, entra en sigilo 30 segundos y te vuelve invencible / no-objetable durante 0,8 segundos. Un solo punto que te puede salvar la vida.
• Venom Dust y Venom Splasher (si te sobran puntos) — daño de área envenenado adicional; útil, pero por detrás de todo lo anterior.

Dual Wield Mastery y la rama de Red Cut quedan fuera de esta build: pertenecen a la vía de doble daga, no a la de Katar que sigue esta guía.', 'https://www.roochub.com/classes/assassin_cross', false, array['https://www.roochub.com/icons/UI_Icon_Skill_Thief_QuanRenXiuLian.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Thief_YinSuTouZhi.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Thief_YinSuTouZhiJiaSu.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Thief_WuQiTuDu.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Thief_YinNiYanJiu.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Thief_WuYingZhiYa.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Thief_HouTuiHuiBiYinNi.webp']::text[]),
    (v_guide, 4, 'Árbol Assassin Cross (Trans. 2nd) — el núcleo del build', 'Aquí es donde todo el trabajo anterior se convierte en el Assassin Cross que abre una pelea y la cierra antes de que el rival pueda reaccionar. Sigue el orden con disciplina: varias de estas habilidades solo rinden al máximo si las combinas bien.

• Advanced Katar Mastery al máximo — obligatoria si vas de Katar: mejora tu maestría con el arma y, al llegar al nivel máximo, otorga +20% de PATK y +30% de PDMG al atacar. Es el pilar de todo tu daño físico en esta fase.
• Double Attack Mastery al máximo — con Katar, tus golpes críticos activan un Double Attack que llega a un 180% de daño; con Dagger, ese extra sale al 140%. Convierte cada crítico normal en un golpe adicional.
• Soul Breaker al máximo — tu golpe a distancia más pesado: 1.550% + (50 × tu INT) de daño físico neutral, y cada punto de INT suma otro 0,1% de daño. No es tu stat principal, pero cualquier INT que te llegue por equipo se nota aquí.
• Deadly Poison al máximo — sube el ataque de tu arma un 30% durante 200 segundos y da un 7,5% de probabilidad de envenenar en cada golpe normal durante 28 segundos. Actívala SIEMPRE antes de entrar en la pelea, nunca a mitad de combate.
• Poisonous Blade al máximo — 350% + 220 de daño de Veneno, con 100% de probabilidad de dejar Envenenado al objetivo y un 1% de su HP máxima como daño continuo por segundo. Es tu forma más fiable de aplicar el veneno que necesita el resto del combo.
• Envenomed Blade al máximo — dos golpes, uno de 100% y otro de 340% + 350 de daño físico; el primero envenena, y si el objetivo YA estaba envenenado, el daño se dobla entero. Por eso el orden con Poisonous Blade importa tanto.
• Meteor Assault (varios puntos) — 900% de daño físico neutral a todo lo que tengas alrededor, con 55% de probabilidad de Aturdir, Cegar o Sangrado. Tu mejor herramienta cuando el rival se agrupa en 5v5 o GvG.
• Cross Parry (1 punto, obligatorio) — entra en Postura Defensiva, elimina efectos de control, te da inmunidad durante 2 segundos y +10% de reducción de daño físico/mágico durante 5 segundos. Un solo punto que puede salvarte la apertura del combo.
• Find Weakness (si te sobran puntos) — suma un 20% de daño contra objetivos de tamaño Medium al tenerla al máximo. Situacional: solo la notas contra el tipo de objetivo correcto.
• Poison React (relleno final) — +20% de Resistencia a Veneno y +10% de Resistencia Neutral, y contraataca los golpes de tipo Veneno con 400% de daño de Veneno una vez cada 15 segundos. Rinde más contra otro Assassin Cross o contra mobs envenenados que en una pelea genérica.', 'https://www.roochub.com/classes/assassin_cross', false, array['https://www.roochub.com/icons/UI_Icon_Skill_Thief_GaoJieQuanRenXiuLian.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Thief_ErDaoLianJiJingTong.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Thief_XinLingZhenBo.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Thief_ZhiMingTuDu.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Thief_JuDuDuanDao.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Thief_DuRen.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Thief_HeiAnShunJian.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_GuillotineCross_WuQiGeDang.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Thief_RuoDianKanPo.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Thief_DuXingFanTan.webp']::text[]),
    (v_guide, 5, 'Tu combo principal', 'Con los puntos bien repartidos, esto es lo que decide una pelea, en el orden correcto.

1. Activa Deadly Poison antes de entrar en combate — el +30% de ataque de arma y la ventana de 200 segundos deben estar corriendo ya cuando aparezcas.
2. Si puedes, abre desde Hiding: gracias a Hiding Research, tu primera habilidad de daño sale con un +30% de bono adicional antes de romper el sigilo.
3. Aplica Poisonous Blade — deja Envenenado al objetivo con un 100% de probabilidad, sin depender de suerte.
4. Sigue de inmediato con Envenomed Blade: como el objetivo ya está envenenado, tu golpe de 340% + 350 se dobla entero.
5. Remata con Soul Breaker si el objetivo sigue en pie — 1.550% de daño físico neutral a distancia.
6. Si hay más de un rival cerca, cambia el remate por Meteor Assault para golpear a todos a la vez y arriesgarte a un Aturdido, Ceguera o Sangrado.
7. Guarda Cross Parry para el momento en que un control enemigo amenace con cortarte el combo antes de terminarlo — no la gastes de forma preventiva.', 'https://www.roochub.com/classes/assassin_cross', false, array[]::text[]),
    (v_guide, 6, 'Equipo recomendado — cartas', 'Aquí tienes el equipo de cartas que completa el build, elegido entre las cartas ya catalogadas de ROOC por su aporte directo a CRIT, ASPD y daño de burst — justo lo que pide este kit.

• Doppelganger (Épica, Arma) — ASPD +10%, AGI +5, CRIT +5 y daño de CRIT +12%; en set, +2% de ASPD adicional. Es la carta de arma con más ASPD y CRIT de toda la tabla, y encaja directo con Advanced Katar Mastery y Double Attack Mastery.
• Illusion Doppelganger (Legendaria, Arma) — misma familia que la anterior, pero con cifras menores según nuestros datos: ASPD +2%, AGI +2, CRIT +2, daño de CRIT +6%, set ASPD +1%. Compite por la misma ranura de Arma; con los números que tenemos confirmados, la versión Épica de arriba rinde más.
• Kobold (Rara, Accesorio) — CRIT +4, STR +2; en set, MATK de arma +5. Suma CRIT plano sin depender del tipo de enemigo, y el STR extra empuja tu daño físico base.
• Zerom (Común, Accesorio) — DEX +3, CRIT +2; en set, MATK de arma +5. De las cartas más accesibles de toda la lista, y aun así suma CRIT — buen relleno para tu segunda ranura de accesorio mientras consigues algo mejor.
• Baphomet Jr. (Poco Común, Prenda) — CRIT +1, AGI +3; en set, MATK de arma +5. El AGI alimenta directamente tu ASPD y tu FLEE, y es de las piezas más fáciles de conseguir de la lista.
• Wild Rose (Poco Común, Calzado) — AGI +2, FLEE +5; en set, ATK de arma +5. Otra pieza barata para reforzar el mismo combo de AGI y esquiva.
• Nightmare (Rara, Cabeza Superior) — AGI +3; cada 6 segundos, 1 segundo de inmunidad a Sueño y elimina el efecto de Sueño activo; en set, MATK de arma +12. El AGI ayuda al build, y la inmunidad periódica a Sueño evita que te dejen fuera de combate justo antes de abrir tu propio combo.', 'https://www.roochub.com/cards', false, array['https://www.roochub.com/icons/UI_MonsterCard_Siling.webp', 'https://www.roochub.com/icons/UI_MonsterCard_Quanyao.webp', 'https://www.roochub.com/icons/UI_MonsterCard_Jieluomi.webp', 'https://www.roochub.com/icons/UI_MonsterCard_Xiaobafengte.webp', 'https://www.roochub.com/icons/UI_MonsterCard_Kuangbaoyemao.webp', 'https://www.roochub.com/icons/UI_MonsterCard_Mengyan.webp']::text[]),
    (v_guide, 7, 'Mascota recomendada', 'De las mascotas ya catalogadas, la que mejor encaja con Assassin Cross es Kitten Oracle (rol DPS de objetivo único): su Habilidad Exclusiva, Battle Blessing, golpea al objetivo con 800% de daño físico neutral y da +10% de velocidad de ataque a su dueño; en el Tier 10 el daño sube a 1.200% y además suma +5% de daño crítico y +20% de probabilidad de crítico PARA TI — justo las dos estadísticas que más pide este build.

Si buscas una segunda opción para partidas largas, Sohee (rol de soporte) también encaja bien: su Lucid Dream da a ambos +10% de velocidad de ataque, +5% de velocidad de movimiento y 2% de robo de vida durante 8 segundos (a cambio de +3 segundos de reutilización), llegando a +30% / +12% / 5% en el Tier 10 — el ASPD extra alimenta directamente tu Double Attack Mastery, y el robo de vida ayuda a sostener a una clase que no tiene curación propia.', 'https://roocdb.com/en/pets', false, array['https://roocdb.com/pets/Pokemon_zhanbumao.webp', 'https://roocdb.com/pets/Pokemon_guinv.webp']::text[]),
    (v_guide, 8, 'Trucos para 5v5 (Dimension Drill)', 'Dimension Drill reúne varios minijuegos de 5v5, y Assassin Cross tiene una lectura distinta a la de una clase tanque en cada uno.

• Blood and Gold — usa Hiding para acercarte sin ser visto a la zona del Goblin King y aislar a un rival antes de que su equipo reaccione; abre con Poisonous Blade y remata con Envenomed Blade mientras siga solo.
• Shapeshift Ops — no eres quien debe cargar el orbe de transformación: mejor cúbrete en Hiding cerca de la ruta y usa Back Slide Hiding para escapar en cuanto ayudes a tu compañero a completarlo.
• Cart Contest — como no llevas la HP para cargar el carro tú mismo, tu trabajo es frenar al portador rival: Grimtooth reduce un 50% su velocidad de movimiento durante 3 segundos, tiempo de sobra para que tu equipo lo alcance.
• Team Deathmatch — activa Deadly Poison antes de que empiece la ronda, espera a que un rival quede aislado del resto y ábrelo con tu combo completo; nunca lo malgastes contra el primero que aparezca en grupo.', 'https://www.roochub.com/classes/assassin_cross', false, array[]::text[]),
    (v_guide, 9, 'Trucos para GvG (guerra de gremios)', 'La guerra de gremios te pide algo distinto a las escaramuzas de 5v5: aquí Assassin Cross rinde mejor como flanqueador que como línea del frente.

• Vigrid Avenge (el Cuerno) — al contrario que un tanque, no eres quien debería cargarlo: tu HP no aguanta el desgaste constante. Tu papel es usar Grimtooth o Meteor Assault para frenar o desestabilizar al portador rival mientras tu propio tanque carga el Cuerno.
• Vale of Clash (defender un Crystal Pillar) — en vez de plantarte en el punto, usa Hiding para rodear el frente de batalla y buscar a los objetivos de soporte o daño a distancia que sostienen el asedio rival desde atrás.
• Stellar Clash (cambios de objetivo) — en el instante en que tu equipo marca un nuevo objetivo, Soul Breaker te da el alcance para golpear primero y Grimtooth el slow para que no se escape mientras el resto del equipo llega.
• Peleas masivas en general — nunca abras tú primero contra un grupo completo: espera a que se disperse o a que tu equipo inicie, y entra tú a rematar al que quede más expuesto.', 'https://www.roochub.com/classes/assassin_cross', false, array[]::text[]),
    (v_guide, 10, 'Errores que cuestan partidas', 'Incluso con el build perfecto sobre el papel, estos son los fallos que más le cuestan a un Assassin Cross.

• Abrir el combo sin Deadly Poison activo. Sin ese veneno corriendo, Envenomed Blade pierde su condición de doble daño y te quedas con la mitad del combo.
• Lanzar Envenomed Blade antes que Poisonous Blade (o cualquier otra fuente de Veneno). El orden importa: primero envenenas, después rematas con el golpe que se dobla.
• Meterte a un combate grupal como si fueras la línea de frente. Eres una clase de cristal pensada para abrir contra un objetivo aislado, no para aguantar el foco de un equipo entero.
• Gastar Cross Parry de forma preventiva en vez de guardarlo para el control que de verdad te va a cortar el combo — es tu único punto de inmunidad, y solo tienes uno.
• Olvidar que Soul Breaker escala con tu INT. No es tu stat principal, pero descartar por completo cualquier pieza de equipo que sume algo de INT deja daño gratis sobre la mesa.', 'https://www.roochub.com/classes/assassin_cross', false, array[]::text[]);
end
$IMPERIUM$;
