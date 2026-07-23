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
    select id from public.guides where game_id = v_game and slug = 'paladin-build-pvp-gvg');
  delete from public.guides where game_id = v_game and slug = 'paladin-build-pvp-gvg';

  insert into public.guides
    (game_id, slug, title, description, order_index, is_published, intro_title, intro, intro_images)
  values
    (v_game, 'paladin-build-pvp-gvg', 'Paladin: build para PvP y GvG', 'Build de Paladin para Ragnarok Origin Classic pensada para el Tyr Cup. Cubre el orden de los tres árboles de habilidades, el combo de combate, las cartas y mascotas recomendadas, y trucos concretos para PvP 5v5 y GvG.', 2, false, 'El híbrido que dominó la Gran Final', 'El Tyr Cup ya está en marcha, y con $1,000,000 en juego nadie quiere presentarse a un servidor de PvP o GvG con una build a medias. Si vas a subir Paladin, esta guía reúne en un solo sitio el orden de habilidades de tus tres árboles, el combo que decide una pelea, y el equipo de cartas y mascotas que completa el build.

Paladin es la definición de híbrido tanque/daño: acumula una cantidad de HP fuera de lo normal junto con ASPD y CRIT altos, pero eso no lo convierte en un simple muro. Su habilidad de daño principal, Sacrifice, calcula su potencia a partir de tu propia vida, así que cuanta más HP lleves encima, más duele cada golpe — aguanta la línea de batalla y, al mismo tiempo, la resuelve.

Y no es una sensación subjetiva de quienes la juegan: en la Season 1 del Tyr Cup, Paladin terminó siendo una de las clases con más presencia en los puestos altos de bajas de la Gran Final. El dato exacto lo tienes en el primer paso — y, a partir de ahí, toda la build explicada punto por punto.', array['https://www.roochub.com/icons/UI_Common_Profession_Icon_23.webp']::text[])
  returning id into v_guide;

  insert into public.guide_steps
    (guide_id, order_index, title, content, source_url, is_verified, images)
  values
    (v_guide, 1, 'Por qué Paladin', 'Antes de repartir un solo punto, mira el dato que justifica esta guía: en el leaderboard real de bajas de la Gran Final de la Season 1 del Tyr Cup, 4 de los 10 mejores puestos los ocupaba un Paladin, incluido el número 1 con 371 bajas.

La razón es que Paladin no es un tanque cualquiera. Acumula una cantidad de HP fuera de lo normal junto con ASPD y CRIT altos, pensado para plantarse en primera línea sin caer, pero su habilidad de daño principal, Sacrifice, calcula su potencia a partir de tu propia vida: cuanta más HP lleves encima, más pega cada golpe. Es la clase que aguanta la pelea y, al mismo tiempo, la resuelve.

Eso condiciona por completo el reparto de tus puntos de estadística. VIT va primero, sin discusión: además de HP y defensa planos, sube la reducción de daño de Shield Reflect (+1% por cada 10 puntos de VIT, hasta +10% adicional) y el multiplicador de Concentrate Pierce (+1% por cada 500 de tu Max HP). Después de VIT, reparte en STR, y deja AGI para el final.', 'https://www.roochub.com/classes/paladin', false, array[]::text[]),
    (v_guide, 2, 'Árbol Swordsman (1er trabajo)', 'El árbol de Swordsman es la base de todo el build: aquí sientas los cimientos de ataque físico antes de pasar a Crusader y, después, a Paladin. Este es el orden de prioridad que te recomendamos.

• Sword Mastery al máximo — +30 de PATK permanente. Es pasivo y no cuesta nada mantenerlo al día, así que no hay motivo para retrasarlo.
• Bash al máximo — tu primer golpe fuerte de verdad: inflige 350% + 200 de daño físico (PDMG) a un único objetivo y suma +15 de HIT, para no fallar contra rivales esquivos.
• Fatal Blow al máximo — añade un 25% de probabilidad de aturdir cada vez que conectas ese mismo Bash.
• Increase Recuperative Power — mejora tu regeneración de HP pasiva, algo que necesitas antes de acumular el HP masivo de las siguientes fases del build.
• Magnum Break (con unos pocos puntos alcanza) — inflige 250% + 100 de daño físico de elemento Fuego a hasta 10 objetivos a tu alrededor. No es prioridad, pero unos pocos puntos aquí rinden mucho en peleas de gremio donde el rival se amontona.
• Berserk (barato) — solo +10 de PATK, pero cuesta tan poco que no tiene sentido dejarlo fuera.

Provoke y Endure quedan para el final, si es que te sobran puntos: los dos rinden casi solo contra monstruos, y en combate contra jugadores apenas se notan.', 'https://www.roochub.com/classes/paladin', false, array['https://www.roochub.com/icons/UI_Icon_Skill_Swordman_kuangJi.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Swordman_NuBao.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Swordman_JianXiShuLianDu.webp']::text[]),
    (v_guide, 3, 'Árbol Crusader (2do trabajo)', 'Crusader es tu segundo trabajo, y aquí el build empieza a definirse de verdad. Sigue este orden.

• Faith al máximo — obligatorio, sin excepciones: suma +3,000 de Max HP permanentes y reduce un 30% el daño de elemento Holy que recibes. Es la base de toda tu supervivencia a partir de aquí.
• Demon Bane al máximo — +20 de PATK y +20 de PDEF permanentes, otro pasivo que no cuesta nada dejar al máximo.
• Spear Mastery al máximo — +40 de PATK, con otros +10 adicionales si vas montado.
• Holy Cross, pero solo hasta nivel 5 — no necesitas más: con nivel 5 te alcanza para desbloquear Grand Cross, así que no gastes puntos de más aquí.
• Grand Cross al máximo — tu AoE principal: daño mágico de elemento Holy calculado como (PATK + MATK) / 2 × 1200%, repartido entre hasta 10 objetivos a la vez.
• Riding (1 punto) — no te lo saltes solo porque parezca poca cosa: es un único punto y te da acceso a montura.

Si te sobran puntos después de todo esto, repártelos en Heal, para algo de auto-sostenimiento, y si aún tienes margen, en Providence o Auto Guard.', 'https://www.roochub.com/classes/paladin', false, array['https://www.roochub.com/icons/UI_Icon_Skill_Crusader_XinRen.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Crusader_ShengShiZiGongJi.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Crusader_ShengShiZiShenPan.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Swordman_MaoXiShuLianDu.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Acolyte_ZhiYuShu.webp']::text[]),
    (v_guide, 4, 'Árbol Paladin (Trans. 2nd) — el núcleo del build', 'Esta es la joya de la corona: tu tercera clase (Trans. 2nd), donde todo lo anterior se convierte en el build de Paladin que domina el Tyr Cup. Sigue el orden con disciplina — varias de estas habilidades dependen unas de otras para rendir al máximo.

• Fortitude al máximo — obligatorio: +15% de Max HP permanente y +12% de reducción de daño físico y mágico. Es el pilar de tu resistencia en esta fase del build.
• Spear Quicken al máximo — durante 120 segundos te da +45% de ASPD, +20 de CRIT y +20 de FLEE, y además desbloquea el acceso a Sacrifice y Concentrate Pierce. Actívalo SIEMPRE antes de entrar en la pelea, nunca a mitad de combate: para entonces ya perdiste la ventana en la que más rinde.
• Sacrifice al máximo — la habilidad con la que cierras la pelea. Convierte tus siguientes 5 ataques normales en golpes forzados que en PvP se calculan sobre un 7% de tu Max HP cada uno, a cambio de consumir alrededor de un 3.5% de tu propia Max HP por golpe, y ralentiza un 20% la velocidad de movimiento del rival golpeado durante 2 segundos.
• Devotion al máximo — redirige hacia ti el 130% del daño que iba a recibir un aliado, durante hasta 120 segundos (se corta si te alejas más de 11 metros de él). Actívalo sobre tu compañero más valioso ANTES de que empiecen a atacarlo, nunca después de que ya esté en apuros.
• Shield Reflect al máximo — refleja un 40% del daño cuerpo a cuerpo que recibes, reduce un 15% el daño cuerpo a cuerpo que te hacen, y suma +15% de reducción de daño físico y mágico, más otro +1% extra por cada 10 puntos de VIT que tengas, hasta +10% adicional.
• Concentrate Pierce al máximo — el golpe con el que abres la pelea, sin restarte ni un punto de tu propia vida como sí hace Sacrifice. Inflige 560% de daño físico, y ese multiplicador sube +1% por cada 500 de tu Max HP, hasta +600% extra.
• Sympathy al máximo — barato y muy rentable: hace que el aliado que lleva tu Devotion te transfiera el 90% de la amenaza que genera contra monstruos.
• Defending Aura (con unos pocos puntos alcanza) — reduce un 30% el daño a distancia y un 10% el daño mágico que recibes durante 120 segundos, pero a cambio resta un 20% de velocidad de movimiento y de ataque. Actívala solo cuando el equipo rival sea mayoritariamente de clases a distancia o mágicas.
• Gloria Domini (situacional) — 1400% de daño Holy con 2.4 segundos de retardo, que ralentiza un 40% al objetivo y lo inmoviliza 3 segundos al impactar. Resérvala para inmovilizar a alguien que intenta huir; no la gastes como daño suelto.
• Battle Chant (si te sobran puntos) — un buff aleatorio para todo el grupo. Solo tiene sentido una vez cubierto todo lo anterior.', 'https://www.roochub.com/classes/paladin', false, array['https://www.roochub.com/icons/UI_Icon_Skill_Paladin_JianYi.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Paladin_ChangMaoJiaSuShu.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Paladin_SheMingGongJi.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Paladin_XiSheng.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Paladin_FanSheDun.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Paladin_NingShenCiJi.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Paladin_LianMin.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Paladin_GuangZhiDun.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Paladin_ShenZhiWeiYa.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Paladin_ShengYin_Buff.webp']::text[]),
    (v_guide, 5, 'Tu combo principal', 'Tener los puntos bien repartidos no sirve de nada si no ejecutas el combo en el orden correcto. Esta es la secuencia que de verdad decide una pelea.

1. Activa Spear Quicken antes de entrar en la pelea — nunca a mitad de combate, porque toda la ventana de ASPD, CRIT y FLEE es la que hace funcionar el resto del combo.
2. Abre con Concentrate Pierce. Es tu daño de apertura y no te cuesta ni un punto de tu propia HP.
3. Remata con Sacrifice: gracias al ASPD que ya tienes activo por Spear Quicken, los 5 golpes de esta habilidad se encadenan casi sin pausa.
4. Cubre a tu compañero más importante con Devotion antes de que los rivales se le echen encima, no una vez que ya esté en problemas.
5. Elige tu defensa según lo que te esté golpeando: Shield Reflect contra cuerpo a cuerpo, Defending Aura contra ataques a distancia o mágicos — pero nunca las dos activas al mismo tiempo.', 'https://www.roochub.com/classes/paladin', false, array[]::text[]),
    (v_guide, 6, 'Equipo recomendado — cartas', 'Aquí tienes el equipo de cartas que completa el build. Por la convención de dos décadas que arrastra esta franquicia, cada carta suele caer del monstruo o jefe que comparte su nombre — tómalo como una referencia orientativa y no como un dato de drop confirmado por un parche concreto de ROOC.

• Eddga (Épica, ranura Off-Hand) — suma +10% al coste de SP y trae un efecto especial propio; en set con otra pieza, añade +3% de reducción de daño físico. Lo suelta el jefe o MVP que comparte su nombre.
• Angeling (Épica, Armadura) — +5% de Max HP y cambia el elemento de tu armadura a Holy; en set, suma otro +3% de Max HP. La deja caer el MVP Angeling.
• Osiris (rareza MVP, Accesorio) — funciona como un seguro de vida: si un golpe de habilidad te iba a matar, en su lugar te deja con 1 HP, te vuelve invulnerable durante 3 segundos y te devuelve un 70% de tu HP y SP de golpe (con 3 minutos de reutilización antes de poder repetirlo). Súmale el despertar completo y ganas otro +10% de reducción de daño físico y mágico, más +6% de Max HP. Es, con diferencia, la carta más difícil de conseguir de esta lista: solo la suelta el jefe de campo Osiris.
• Horn (Épica, Off-Hand) — reduce un 20% el daño base que recibes, y su despertar puede llevarte hasta +400 de defensa total al llegar al nivel 15. Al caer de un monstruo de campo corriente, es de las piezas más fáciles de conseguir de toda esta lista.
• Doppelganger (Épica, Arma) — +10% de ASPD, +5 de AGI, +5 de CRIT y +12% de daño crítico: justo lo que necesitas para acelerar tu combo de Sacrifice. La suelta el MVP Doppelganger.
• Drake (Épica, Arma) — suma +12% de daño físico y mágico, y si consigues el set completo, otro +3% de ataque de arma. La deja caer el MVP Drake.
• Fabre (Común, Arma) — solo +1 de VIT y +100 de Max HP, pero al ser un monstruo de campo muy temprano y accesible, funciona bien como relleno mientras subes de nivel.
• Baphomet Jr., como carta (Poco común, Prenda) — +1 de CRIT y +3 de AGI. Es un monstruo de campo de rareza intermedia, mucho más accesible que la carta del Baphomet original, que sí es MVP.', 'https://www.roochub.com/cards', false, array['https://www.roochub.com/icons/UI_MonsterCard_Huwang.webp', 'https://www.roochub.com/icons/UI_MonsterCard_Tianshiboli.webp', 'https://roocdb.com/cards/Esailisi.webp', 'https://roocdb.com/cards/Qiaoxingchong.webp', 'https://www.roochub.com/icons/UI_MonsterCard_Siling.webp', 'https://www.roochub.com/icons/UI_MonsterCard_Haidaozhiwang.webp', 'https://www.roochub.com/icons/UI_MonsterCard_Lvmianchong.webp', 'https://www.roochub.com/icons/UI_MonsterCard_Xiaobafengte.webp']::text[]),
    (v_guide, 7, 'Mascotas recomendadas', 'Dos mascotas completan el build, cada una con un rol distinto.

• Baphomet Jr. (rol DPS de área) — lleva Harvesting Scythe, una habilidad pasiva que le devuelve vida a ella y a su dueño cada vez que uno de sus golpes es crítico: un 3% de ese daño se convierte en curación, porcentaje que llega al 9% si le subes las 10 mejoras al máximo (2,430 fragmentos en total). Esos fragmentos se compran en la Pet Shop a cambio de Poring Coins, que se ganan cazando monstruos de tipo Mini y MVP.
• Sohee (rol de soporte) — es la pareja recomendada para Baphomet Jr. en un build que gira en torno a Sacrifice, precisamente porque su apoyo compensa el desgaste de vida que supone activar esa habilidad una y otra vez.', 'https://roocdb.com/en/pets', false, array['https://roocdb.com/pets/Pokemon_bafengte.webp', 'https://roocdb.com/pets/Pokemon_guinv.webp']::text[]),
    (v_guide, 8, 'Trucos para 5v5 (Dimension Drill)', 'Dimension Drill reúne varios minijuegos de 5v5, y Paladin tiene un truco concreto para cada uno.

• Blood and Gold — busca el momento en que los rivales se agrupan junto al Goblin King y suelta ahí tu Magnum Break para golpearlos a todos de una vez.
• Shapeshift Ops — cuando un compañero se disponga a recoger el orbe de transformación, cúbrelo con Devotion; ese es justo el instante en que el bando rival más se va a volcar en impedirlo.
• Cart Contest — con tu HP puedes ser uno de los 3 jugadores que llevan el carro sin caer por el camino, y si alguien te sale al paso cuerpo a cuerpo para frenarte, Shield Reflect se encarga de que lo pague.
• Team Deathmatch — activa Spear Quicken antes de que empiece la ronda, y espera a tener un objetivo marcado antes de soltar Sacrifice: úsalo con criterio, no contra el primer rival que aparezca delante.', 'https://www.roochub.com/classes/paladin', false, array[]::text[]),
    (v_guide, 9, 'Trucos para GvG (guerra de gremios)', 'La guerra de gremios premia decisiones distintas a las del 5v5. Estos son los trucos que marcan la diferencia.

• Cargar el Cuerno en Vigrid Avenge — esa mecánica te desangra sin parar mientras lo llevas, y casi ningún otro rol aguanta ese desgaste tan bien como tú gracias a tu HP descomunal; por eso el equipo debería dejarte a ti la carga mientras te hacen de escolta.
• Defender un Crystal Pillar en Vale of Clash — la combinación de Shield Reflect y Fortitude es lo que te permite quedarte clavado en el punto sin ceder terreno hasta que llegue el resto del equipo, y de paso Grand Cross se encarga de castigar a todo el que se acerque en grupo a intentar sacarte de ahí.
• Cambios de objetivo en Stellar Clash — en el instante en que tu equipo decide saltar a un nuevo objetivo, aprovecha el retardo de Gloria Domini para clavarla sobre el portador o el jugador clave del bando rival: la inmovilización que deja al impactar le corta cualquier intento de escapar.
• Devotion en un combate masivo — elige como objetivo al compañero que más daño esté aportando al combate, no al que más insista en pedir ayuda.', 'https://www.roochub.com/classes/paladin', false, array[]::text[]),
    (v_guide, 10, 'Errores que cuestan partidas', 'Incluso con el build perfecto sobre el papel, estos son los fallos que más partidas cuestan.

• Soltar Sacrifice sin haber activado antes Spear Quicken. El ASPD es lo que hace que esa ráfaga de golpes rinda; sin él, gastas la habilidad a medio gas.
• Elegir mal el blanco de Devotion: protegerlo sobre alguien que ya casi no participa en la pelea, cuando debería ir sobre el compañero que todavía está aportando daño o utilidad al equipo.
• Usar Gloria Domini como un golpe más de daño, en lugar de reservarla para cuando puedas inmovilizar a un rival que intenta escapar.
• No calcular tu propia HP restante después de activar Sacrifice: si justo después llega una ronda de daño en área, puedes quedarte corto de vida por haberte concentrado solo en la del rival.', 'https://www.roochub.com/classes/paladin', false, array[]::text[]);
end
$IMPERIUM$;
