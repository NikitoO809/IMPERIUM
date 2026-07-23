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
    select id from public.guides where game_id = v_game and slug = 'stalker-build');
  delete from public.guides where game_id = v_game and slug = 'stalker-build';

  insert into public.guides
    (game_id, slug, title, description, order_index, is_published, intro_title, intro, intro_images)
  values
    (v_game, 'stalker-build', 'Stalker: build para PvP y GvG', 'Build de Stalker para Ragnarok Origin Classic pensada para el Tyr Cup. Cubre el orden de los tres árboles de habilidades, el combo cuerpo a cuerpo y a distancia, las cartas y la mascota recomendadas, y trucos concretos para PvP 5v5 y GvG.', 9, false, 'Daga, ballesta y un truco que nadie más tiene', 'El Tyr Cup ya está en marcha, y con $1,000,000 en juego nadie quiere presentarse a un servidor de PvP o GvG con una build a medias. Si vas a subir Stalker, esta guía reúne en un solo sitio el orden de habilidades de tus tres árboles, el combo que decide una pelea, y el equipo de cartas y la mascota que completan el build.

Stalker es la clase que no se casa con un solo estilo: comparte tronco Thief con Assassin Cross, pero al pasar por Rogue gana algo que ninguna otra salida de esa rama tiene — la posibilidad real de pelear cuerpo a cuerpo con daga (Backstab) o a distancia con ballesta (Piercing Shot), cambiando de una a otra con Weapon Swap según lo pida cada pelea. Y tiene un rasgo que no comparte con ninguna otra clase del juego: Copy, la habilidad que le permite robar directamente parte del kit de los monstruos que enfrenta, incluidos algunos Mini y MVP.

Eso condiciona el reparto de tus puntos de estadística. AGI va primero: sube tu velocidad de ataque y tu evasión, justo lo que necesitas para encadenar autoataques con Double Attack y activar Snatcher más veces por pelea. Después, STR — no es una estadística secundaria: Surprise Attack calcula parte de su daño directamente a partir de tu STR (+STR/10% golpeando por la espalda en melee, +STR/15% a distancia), así que cada punto se nota en el combo. LUK queda para el final, reforzando el crítico que ya te da Slyness de por sí.', array['https://www.roochub.com/icons/UI_Common_Profession_Icon_33.webp']::text[])
  returning id into v_guide;

  insert into public.guide_steps
    (guide_id, order_index, title, content, source_url, is_verified, images)
  values
    (v_guide, 1, 'Por qué Stalker', 'Antes de repartir un solo punto, conviene tener clara la identidad de esta clase: Stalker no te obliga a elegir entre pelear cuerpo a cuerpo o a distancia. Comparte tronco Thief con Assassin Cross, pero se desvía por Rogue hacia una versatilidad que ninguna otra salida de esa rama tiene — puedes abrir con Backstab a daga (440% + 350 de daño físico, con hasta +500% de multiplicador si golpeas por la espalda) o cambiar a ballesta con Weapon Swap y rematar con Piercing Shot (1000% + 220 de daño físico a distancia). Y tiene un sello que no comparte nadie más en el juego: Copy, la habilidad que le deja robar parte del kit directamente de los monstruos que enfrenta, incluidos algunos Mini y MVP.

Eso condiciona por completo el reparto de tus puntos de estadística. AGI va primero: sube tu ASPD y tu FLEE, lo que se traduce en más autoataques por segundo — y cada autoataque es una tirada más para el 55% de probabilidad de Double Attack y para el 10% de probabilidad de Snatcher de disparar gratis un Raiding Strike o Raiding Shot. Después reparte en STR: Surprise Attack calcula parte de su daño directamente a partir de tu STR (+STR/10% golpeando por la espalda en melee, +STR/15% a distancia), así que no es una estadística secundaria, se nota en cada golpe del combo. Deja LUK para el final — sigue sumando al crítico, pero Slyness ya te da +50 de CRIT plano sin gastar un solo punto propio.', 'https://www.roochub.com/classes/stalker', false, array[]::text[]),
    (v_guide, 2, 'Árbol Thief (1er trabajo)', 'El árbol de Thief es donde se sientan las bases de todo Stalker: aquí defines cómo golpeas y cómo esquivas antes de pasar a Rogue y, después, a Stalker. Este es el orden que te recomendamos.

• Double Attack al máximo — tu pasivo más importante desde el minuto uno: con daga o Crossbow Blade, cada autoataque tiene un 55% de probabilidad de infligir el doble de daño. Con ese porcentaje, no hay motivo para retrasarlo.
• Hiding al máximo — te oculta al instante sin penalización de velocidad de movimiento, consume 1 SP cada 17 segundos y dura 34 segundos por activación. Es tu herramienta para rodear al objetivo antes de abrir con Backstab por la espalda.
• Increase Dodge al máximo — +30 de FLEE permanentes y +5% de velocidad de movimiento. Barato, permanente, y sienta la base de supervivencia que necesitas siendo una clase sin el HP de un tanque.
• Envenom al máximo — un golpe de veneno cuyo daño se calcula como 40 × (tu Nivel Base - 10) + 50, con 60% de probabilidad de dejar al objetivo Envenenado durante 28 segundos. Buen daño pasivo adicional.
• Shield Dodge (unos pocos puntos) — +60 de FLEE y 10% de probabilidad de esquiva absoluta durante 5 segundos. No hace falta al máximo, pero unos puntos aquí salvan vidas en peleas largas.

Back Slide y Detoxify (1 punto cada uno) sirven como retirada rápida (+15% de velocidad de movimiento durante 10 segundos) y limpieza de veneno para el grupo cercano — baratos y útiles, no los saltes. Trick Control, en cambio, déjalo para el final y solo si te sobran puntos (requiere Double Attack Nv.5): inflige 300% + 500 de daño físico a hasta 10 monstruos cercanos, pero en PvP rara vez tienes 10 objetivos agrupados delante.', 'https://www.roochub.com/classes/stalker', false, array['https://www.roochub.com/icons/UI_Icon_Skill_Thief_ErDaoLianJi.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Thief_YinNi.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Thief_CanYing.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Thief_shidu.webp']::text[]),
    (v_guide, 3, 'Árbol Rogue (2do trabajo)', 'Rogue es tu segundo trabajo, y aquí es donde Stalker empieza a separarse de un simple ladrón con daga: gana la opción real de pelear también a distancia. Sigue este orden.

• Crossbow Blade Mastery al máximo — +30 de PATK mientras uses Crossbow Blade o daga. Pasivo, permanente, no hay razón para retrasarlo.
• Raiding Strike al máximo — tu golpe principal en postura cuerpo a cuerpo: 350% + 350 de daño físico neutral, con 100% de probabilidad de ganar 100 Eden Coins por golpe.
• Snatcher al máximo — pasivo que da a tus autoataques un 10% de probabilidad de disparar gratis un Raiding Strike (o Raiding Shot en postura a distancia), con solo 0,5 segundos de reutilización. Con el ASPD que ya te da tu prioridad de AGI, esto se activa muy seguido.
• Weapon Swap (1 punto, obligatorio) — no lo pases por alto solo porque cuesta un único punto: es la puerta a toda tu rama a distancia (Raiding Shot, Blinding Shot y, más adelante, Piercing Shot).
• Raiding Shot al máximo — la versión a distancia de Raiding Strike: 450% + 350 de daño físico neutral, también con 100% de probabilidad de ganar 100 Eden Coins.
• Sightless Mind al máximo — tu primer AoE de verdad: 400% de daño físico neutral a hasta 10 enemigos, que sube a 500% si lo lanzas desde Oculto, con 33% de probabilidad de Aturdir 2 segundos. Guárdalo para lanzarlo en sigilo siempre que puedas.

Blinding Shot al máximo cierra el árbol con un cono de 460% de daño a hasta 10 enemigos y 25% de probabilidad de Ceguera 2 segundos — buen filler de área en postura a distancia. Rampage (unos pocos puntos) suma +15% de daño contra enemigos que ya tengan un estado alterado encima, y con el Aturdimiento de Sightless Mind y la Ceguera de Blinding Shot se activa solo. Compulsory Discount, Remove Helmet, Remove Cloak y Stealthy quedan para el final si te sobran puntos: son utilidad situacional (descuentos, robo de equipo con solo 5% de probabilidad base, movilidad extra tras ocultarte), no daño directo.', 'https://www.roochub.com/classes/stalker', false, array['https://www.roochub.com/icons/UI_Icon_Skill_nuren_qiaoqugongji.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_nuren_qiangduo.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_nuren_nurenqiehuan2.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_nuren_siluesheji.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_nuren_qianji.webp']::text[]),
    (v_guide, 4, 'Árbol Stalker (Trans. 2nd) — el núcleo del build', 'Esta es la joya de la corona: tu tercera clase (Trans. 2nd), donde todo lo anterior se convierte en el build de Stalker completo. Sigue el orden con disciplina — varias de estas habilidades dependen unas de otras para rendir al máximo.

• Slyness al máximo — obligatorio: +50 de CRIT plano, más un extra según tu postura: +20% de daño crítico en melee, o +15% de daño físico a distancia (que sube +1% por cada miembro de tu grupo, hasta +20%). Es la base de todo el kit crítico de Stalker.
• Backstab al máximo — tu golpe de daga insignia: 440% + 350 de daño físico neutral, puede ser crítico y te da +10 de CRIT de regalo; si golpeas por la espalda, el multiplicador sube otro +500%. Tu botón de daño en postura cuerpo a cuerpo.
• Piercing Shot al máximo — el equivalente a distancia: 1000% + 220 de daño físico neutral a un enemigo, y además reduce un 15% la reducción de daño físico/mágico del objetivo durante 15 segundos. Tu botón de daño en postura a distancia.
• Surprise Attack al máximo — pasivo que suma daño de habilidad según tu STR: +STR/10% en melee atacando por la espalda, o +STR/15% a distancia. Encaja directo con la prioridad de stats de esta build.
• Shadow Seeker al máximo — entras en un estado especial de sombra durante 17 segundos en el que no te revelas aunque recibas ataques. Es tu herramienta para colocarte detrás del objetivo justo antes de abrir con Backstab.
• Graffiti Mastery (1 punto, obligatorio) — quita los efectos de control activos, te da 3 segundos de inmunidad a control, y deja además 1 marca de Graffiti aleatoria de regalo. Un único punto que te puede salvar de un combo de aturdimiento en pleno GvG.
• Graffiti (unos pocos puntos) — marca el terreno: cualquiera que entre en el área marcada recibe un 5% más de daño elemental durante 150 segundos, con hasta 2 marcas activas a la vez. Útil para zonas de paso obligado en GvG.

Copy (hasta Nv.3 si te sobra margen) copia parte de la habilidad del objetivo — Nv.1 contra monstruos normales, Nv.2 contra Mini, Nv.3 contra MVP. Es el sello más particular de la clase, pero en PvP puro rinde menos que cazando jefes, así que no lo priorices por encima del resto del kit. Counter Instinct (unos pocos puntos, según tu postura) da +60% de probabilidad de parry físico con daga o +60% de parry mágico con ballesta, ambas durante 5 segundos con solo 0,5 de reutilización — un comodín defensivo puntual. Remove Armor y Remove Weapon quedan para el final: utilidad situacional para robar equipo al rival, con solo 5% de probabilidad base.', 'https://www.roochub.com/classes/stalker', false, array['https://www.roochub.com/icons/UI_Icon_Skill_nuren_liumangtiantang.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_nuren_beici.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_nuren_chuantousheji.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_nuren_xiji.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_nuren_anyingzhuizhon.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Skill_Chaser_TuYa.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_nuren_tuya.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_nuren_chaoxi.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_nuren_bawanghunren.webp']::text[]),
    (v_guide, 5, 'Tu combo principal', 'Tener los puntos bien repartidos no sirve de nada si no ejecutas el combo en el orden correcto. Esta es la secuencia que de verdad decide una pelea.

1. Entra en Shadow Seeker (o Hiding, si aún no tienes Shadow Seeker) antes de acercarte — necesitas quedar oculto para rodear al objetivo sin que te vea venir.
2. Reposiciónate por la espalda del objetivo. Es el paso que más se salta la gente, y el que activa el +500% de multiplicador de Backstab y el bonus de STR de Surprise Attack.
3. Abre con Backstab por la espalda. Con Slyness ya sumando +50 de CRIT y +20% de daño crítico en melee, este primer golpe suele ser el más duro de todo el combo.
4. Si el objetivo sobrevive o se aleja, cambia de postura con Weapon Swap y remátalo con Piercing Shot: mantiene la presión a distancia y encima le reduce un 15% su reducción de daño físico/mágico durante 15 segundos.
5. Deja que Snatcher haga el resto entre medias — con el ASPD que te da tu prioridad de AGI, ese 10% de probabilidad por autoataque de disparar un Raiding Strike o Raiding Shot gratis se activa varias veces por pelea sin que tengas que pulsar nada.
6. Si te controlan, Graffiti Mastery es tu botón de pánico: un único punto invertido ahí te devuelve el control de la pelea al instante.

Si te enfrentas a varios objetivos agrupados, cambia el guion: abre con Sightless Mind desde Oculto para el salto a 500% de daño en área y el 33% de probabilidad de Aturdir a los 10 enemigos cercanos, y solo entonces entra a rematar con Backstab al que quede con menos vida.', 'https://www.roochub.com/classes/stalker', false, array[]::text[]),
    (v_guide, 6, 'Equipo recomendado — cartas', 'Aquí tienes el equipo de cartas que completa el build. Por la convención de dos décadas que arrastra esta franquicia, cada carta suele caer del monstruo o jefe que comparte su nombre — tómalo como una referencia orientativa y no como un dato de drop confirmado por un parche concreto de ROOC.

• Doppelganger (Épica, Arma) — +10% de ASPD, +5 de AGI, +5 de CRIT y +12% de daño de CRIT; en set, otro +2% de ASPD. La carta de arma que más alimenta tu combo: más ASPD significa más tiradas de Double Attack y de Snatcher por segundo.
• Phreeoni (Épica, Arma) — +100 de HIT, y cada punto de HIT suma un 0,05% de daño físico hasta un +20% adicional (tope que no sube aunque combines varias copias); en set, otro +3% de daño físico. Buena alternativa o segunda ranura de arma: el HIT extra también evita que falles contra objetivos con mucho FLEE.
• Kobold (Rara, Accesorio) — +4 de CRIT y +2 de STR, con set de +5 de MATK de arma. Encaja directo con la prioridad de stats de esta build.
• Baphomet Jr., como carta (Poco Común, Prenda) — +1 de CRIT y +3 de AGI, con set de +5 de MATK de arma. Barata y accesible, y todo lo que suma es justo lo que pide esta build.
• Wild Rose (Poco Común, Calzado) — +2 de AGI y +5 de FLEE, con set de +5 de ATK de arma. Siendo una clase sin el colchón de HP de un tanque, el FLEE extra ayuda a que no te alcancen mientras rodeas al objetivo.
• Horn (Rara, Mano secundaria) — reduce un 20% el daño físico que recibes, con set de +1% de resistencia contra criaturas pequeñas. De rareza intermedia y no una pieza de caza mayor, es de las opciones defensivas más accesibles de la lista.
• Thief Bug Female, como carta (Común, Arma) — +1 de AGI, +1 de FLEE y +5 de ATK de arma, con set de +20 de Max HP. Es de rareza Común, la más accesible del catálogo, y de paso comparte tronco Thief con tu propia clase — buen relleno mientras subes de nivel.', 'https://www.roochub.com/cards', false, array['https://www.roochub.com/icons/UI_MonsterCard_Siling.webp', 'https://www.roochub.com/icons/UI_MonsterCard_Pilien.webp', 'https://www.roochub.com/icons/UI_MonsterCard_Quanyao.webp', 'https://www.roochub.com/icons/UI_MonsterCard_Xiaobafengte.webp', 'https://www.roochub.com/icons/UI_MonsterCard_Kuangbaoyemao.webp', 'https://www.roochub.com/icons/UI_MonsterCard_Qiaoxingchong.webp', 'https://www.roochub.com/icons/UI_MonsterCard_Fuledaochong.webp']::text[]),
    (v_guide, 7, 'Mascota recomendada', 'De las 9 mascotas disponibles, Kitten Oracle (rol DPS de objetivo único) es la que mejor encaja con este build. Su habilidad exclusiva, Battle Blessing, golpea a tu objetivo con 800% de daño físico neutral y te da a ti un +10% de velocidad de ataque; si le subes las 10 mejoras al máximo (Tier 10, 2.430 fragmentos en total), ese golpe sube a 1200% de daño y el bonus para ti cambia a +5% de daño crítico y +20% de probabilidad de crítico. Es, literalmente, la mascota que más refuerza el crítico que ya persigue toda esta build.

Como alternativa, Dr. Owl (también DPS de objetivo único) cumple un papel parecido pero al revés: su Gale Wind golpea con 800% de daño físico de tipo Viento (hasta 1200% en Tier 10) y, en lugar de reforzarte a ti, aumenta un 20% el daño físico que recibe el objetivo golpeado (hasta 30% en Tier 10) — justo el tipo de debuff que amplifica tu propio Backstab o Piercing Shot sobre ese mismo blanco.

Los fragmentos de ambas se compran en la Pet Shop a cambio de Poring Coins, que se ganan cazando monstruos de tipo Mini y MVP.', 'https://roocdb.com/en/pets', false, array['https://roocdb.com/pets/Pokemon_zhanbumao.webp', 'https://roocdb.com/pets/Pokemon_maotouyingboshi.webp']::text[]),
    (v_guide, 8, 'Trucos para 5v5 (Dimension Drill)', 'Dimension Drill reúne varios minijuegos de 5v5, y Stalker tiene un ángulo concreto para cada uno gracias a su sigilo.

• Blood and Gold — mientras el resto se pelea por el Goblin King, usa Shadow Seeker para rodear la pelea sin que te vean venir y cae por la espalda sobre quien esté más ocupado atacando al jefe: con todos distraídos por el objetivo, es tu mejor ventana para un Backstab limpio.
• Shapeshift Ops — no compitas cuerpo a cuerpo por el orbe de transformación: usa tu sigilo para emboscar a quien ya lo recogió, antes de que llegue a ponerlo a salvo.
• Cart Contest — aquí tu rol no es llevar el carro tú (no tienes el HP de un tanque para aguantar el trayecto): emboscas a los portadores del carro rival con Backstab desde Oculto, que suele bastar para tirar a un portador squishy antes de que complete el recorrido.
• Team Deathmatch — evita las peleas de grupo abiertas, donde tu HP se queda corto. Usa Shadow Seeker para flanquear y abre siempre sobre el objetivo más aislado, nunca sobre el primero que veas.', 'https://www.roochub.com/classes/stalker', false, array[]::text[]),
    (v_guide, 9, 'Trucos para GvG (guerra de gremios)', 'La guerra de gremios premia decisiones distintas a las del 5v5. Estos son los trucos que marcan la diferencia para Stalker.

• Vigrid Avenge — cargar el Cuerno no es para ti (esa mecánica te desangra y no tienes el HP para aguantarlo); tu papel es escoltar al que sí lo carga, emboscando desde Oculto a cualquiera que intente interceptarlo.
• Vale of Clash — en vez de plantarte a defender un Crystal Pillar cuerpo a cuerpo, usa Graffiti sobre la ruta de acceso: quien pise la marca recibe un 5% más de daño elemental durante 150 segundos, mientras tú entras y sales rematando con Backstab o Piercing Shot en vez de quedarte parado recibiendo toda la presión.
• Stellar Clash — eres la clase ideal para abrir el cambio de objetivo: colócate en posición con Shadow Seeker antes de que tu equipo decida saltar, y abre tú el foco con un Backstab por la espalda o un Piercing Shot que además reste un 15% de reducción de daño físico/mágico al objetivo durante 15 segundos, dejándolo más blando para el resto del equipo.
• Combate masivo — no te metas en el centro del grupo rival: tu ventana de daño depende de rodear al objetivo sin que te vean, y eso solo funciona atacando desde los flancos.', 'https://www.roochub.com/classes/stalker', false, array[]::text[]),
    (v_guide, 10, 'Errores que cuestan partidas', 'Incluso con el build perfecto sobre el papel, estos son los fallos que más partidas cuestan.

• Abrir Backstab de frente en vez de por la espalda. Te dejas en la mesa el +500% de multiplicador y el bonus de STR de Surprise Attack — la diferencia entre un golpe que abre la pelea y uno que apenas rasguña.
• Quedarte en postura cuerpo a cuerpo cuando el objetivo se aleja o te iguala en daño, en vez de cambiar con Weapon Swap a Piercing Shot. Insistir en Backstab desde una mala posición gasta un tiempo que no tienes, siendo una clase sin el HP para sostener una pelea larga.
• Gastar Sightless Mind fuera de Oculto por impaciencia, perdiendo el salto de 400% a 500% de daño.
• Dejar Graffiti Mastery sin un solo punto invertido. Es tu única salida de control, y morir en un combo de aturdimiento por no haberlo aprendido es un error completamente evitable.
• Perseguir procs de Copy o jugar para el espectáculo en pleno PvP, en lugar de seguir el combo disciplinado — Copy brilla más contra monstruos y jefes que en una pelea de jugadores.', 'https://www.roochub.com/classes/stalker', false, array[]::text[]);
end
$IMPERIUM$;
