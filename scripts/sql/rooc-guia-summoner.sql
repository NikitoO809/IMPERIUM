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
    select id from public.guides where game_id = v_game and slug = 'summoner-build');
  delete from public.guides where game_id = v_game and slug = 'summoner-build';

  insert into public.guides
    (game_id, slug, title, description, order_index, is_published, intro_title, intro, intro_images)
  values
    (v_game, 'summoner-build', 'Summoner: build para PvP y GvG', 'Build de Summoner, la clase Doram de Ragnarok Origin Classic. Cubre el orden de sus tres árboles de habilidades tras Doram Novice, el combo híbrido físico-mágico, las cartas y mascotas recomendadas, y trucos concretos para PvP 5v5 y GvG.', 15, false, 'La Doram que hace de todo', 'Summoner es la única clase del roster que no sale del árbol humano de Novice: es Doram, y por eso su camino tiene una etapa más que el resto de clases — Doram Novice → Apprentice → To-Be Summoner → Summoner — cuatro etapas en vez de las tres habituales. La ficha de la clase en ROOC Hub lo deja escrito tal cual: favours STR · AGI · VIT, así que ese es el reparto de estadísticas que vas a seguir en esta guía.

Lo que hace distinta a Summoner no es solo la raza: su kit final reúne 16 habilidades documentadas — empata con Professor como la clase con más habilidades de todo el roster —, y esas 16 no apuntan todas al mismo sitio. Tienes golpes físicos multi-hit (Bite, Scratch, Neko Power, Spirit Of Savage, Lunatic Carrot Beat), un nuke mágico de área que decide peleas por sí solo (Catnip Meteorite, hasta 1000% de daño mágico neutral en PvE, 500% en PvP), y un paquete de soporte de grupo completo: curación (Fresh Shrimp, Tuna Belly, Purring), buffs de ataque y velocidad (Bunch of Shrimp, Arclouse Dash, Chattering, Hiss) y control de área (Silvervine Root Twist, Catnip Powdering, Nyang Grass). Ninguna de sus tres estadísticas favorecidas es INT — aunque una habilidad de soporte puntual, Tuna Belly, sí escala aparte con tu INT.

No encontramos en la ficha de la clase ninguna mención a que Doram tenga restricciones de equipo, monturas o cartas distintas a las del resto de clases humanas, así que esta guía asume que el sistema de cartas y mascotas funciona igual que para cualquier otra clase — lo confirmamos de nuevo en sus pasos correspondientes.', array['https://www.roochub.com/icons/UI_Common_Profession_Icon_43.webp']::text[])
  returning id into v_guide;

  insert into public.guide_steps
    (guide_id, order_index, title, content, source_url, is_verified, images)
  values
    (v_guide, 1, 'Por qué Summoner', 'Summoner es la única clase del roster que no sale del árbol humano de Novice: es Doram, y por eso su camino tiene una etapa más que el resto de clases — Doram Novice → Apprentice → To-Be Summoner → Summoner — cuatro etapas en vez de las tres habituales. La ficha de la clase en ROOC Hub lo deja escrito tal cual: favours STR · AGI · VIT, así que ese es el reparto de estadísticas que vas a seguir.

Lo que hace distinta a Summoner no es solo la raza: su kit final reúne 16 habilidades documentadas — empata con Professor como la clase con más habilidades de todo el roster —, y esas 16 no apuntan todas al mismo sitio. Tienes golpes físicos multi-hit (Bite, Scratch, Neko Power, Spirit Of Savage, Lunatic Carrot Beat), un nuke mágico de área que decide peleas por sí solo (Catnip Meteorite, hasta 1000% de daño mágico neutral en PvE, 500% en PvP), y un paquete de soporte de grupo completo: curación (Fresh Shrimp, Tuna Belly, Purring), buffs de ataque y velocidad (Bunch of Shrimp, Arclouse Dash, Chattering, Hiss) y control de área (Silvervine Root Twist, Catnip Powdering, Nyang Grass). Ninguna de sus tres estadísticas favorecidas es INT — aunque una habilidad de soporte puntual, Tuna Belly, sí escala aparte con tu INT.

No encontramos en la ficha de la clase ninguna mención a que Doram tenga restricciones de equipo, monturas o cartas distintas a las del resto de clases humanas, así que esta guía asume que el sistema de cartas y mascotas funciona igual que para cualquier otra clase — lo confirmamos de nuevo en los pasos 6 y 7.', 'https://www.roochub.com/classes/summoner', false, array['https://www.roochub.com/icons/UI_Common_Profession_Icon_43.webp']::text[]),
    (v_guide, 2, 'Árbol Apprentice (1er trabajo)', 'El árbol de Apprentice es tu primer trabajo como Doram, con 40 puntos de habilidad para repartir. Este es el orden que te recomendamos.

• Bite al máximo (Nv.5) — tu primer golpe físico de verdad: escala del 245% al 350% de daño físico neutral a un único objetivo según el nivel, y desbloquea Scratch en cuanto llega a Nv.3.
• Scratch al máximo (Nv.10) — el golpe que de verdad vas a usar en combate: escala del 200% al 380% de daño físico neutral y además inflige Bleeding (sangrado).
• Soul Attack al máximo (Nv.10) — tu única habilidad mágica en esta etapa: 3 golpes que suman hasta un 675% de daño mágico total en su nivel máximo.
• Sprite Marble al máximo (Nv.10) — pasiva barata: +100 de Max HP y +20 de Max SP en su tope.
• Nine Lives al máximo (Nv.3) — otra pasiva barata: +5% de Max HP y +10 de FLEE en su nivel máximo.
• Stoop (unos pocos puntos) — reduce todo el daño que recibes un 10% durante 12 segundos en su nivel máximo (Nv.5); un cooldown de emergencia barato.
• Lope (1 punto, obligatorio) — un salto hacia delante para reposicionarte; cuesta un único punto, no hay motivo para saltártelo.

Hide se queda para el final si te sobran puntos — el Stealth que ofrece es situacional y no aporta nada al combo de daño.', 'https://www.roochub.com/classes/summoner', false, array['https://www.roochub.com/icons/UI_Icon_Skill_Doram_henyao.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Doram_zhuashang.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Doram_linghungongji.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Doram_linghunmozhu.webp']::text[]),
    (v_guide, 3, 'Árbol To-Be Summoner (2do trabajo)', 'To-Be Summoner es tu segundo trabajo, con otros 40 puntos de habilidad. Aquí empieza a definirse el Summoner híbrido: parte de tu daño mágico de área y buena parte de tu soporte de grupo nace en este árbol.

• Silvervine Stem Spear al máximo (Nv.10) — el nuke mágico de esta etapa: escala del 330% al 700% de daño mágico neutral a un objetivo, con 30% de probabilidad de infligir Bleeding, y salpica hasta a 10 enemigos cercanos.
• Silvervine Root Twist al máximo (Nv.10, requiere Silvervine Stem Spear Nv.5) — inmoviliza el área: 2% de tu Max HP en daño por segundo durante 20 segundos, con el Immobilize durando 2 segundos. Tu principal herramienta de control.
• Tuna Belly al máximo (Nv.5) — tu curación selectiva: recupera (Nivel Base + INT) × 1,2 × nivel de habilidad + (0,5 + nivel de habilidad/10) × MATK, con un output de 1000%+70 según la tabla de la habilidad en su nivel máximo. Es la única habilidad de todo el kit que depende de tu INT.
• Fresh Shrimp al máximo (Nv.10) — restaura un 5% de HP a todo el grupo cada 3 segundos durante 60 segundos en su nivel máximo. La base de tu sostenimiento en grupo.
• Picky Peck al máximo (Nv.10) — inflige 350% de daño físico neutral (380% en PvE); Picky dura 7 segundos y, al invocarse, golpea a los enemigos cercanos con 520% (570% en PvE).
• Scar of Tarou al máximo (Nv.10, requiere Picky Peck Nv.5) — 400% de daño físico neutral (440% en PvE) con 10% de probabilidad de Bleeding; al invocarse, Tarou golpea alrededor con 450% (490% en PvE).
• Arclouse Dash y Catnip Powdering (unos pocos puntos cada una) — +20 de AGI a todo el grupo durante 120 segundos la primera, y un área que reduce un 35% el MSPD y un 20% el PATK/MATK enemigo la segunda.
• Meow Gaze al máximo (Nv.3) — pasiva barata que sube tu PDMG y tu MDMG un 20% cada uno en su tope; con solo 3 puntos, rinde muchísimo.

Ocean Power, Power of Land, Tuna Party, Power of Life y Night Vision reparten lo que te sobre: son útiles pero ninguna es obligatoria para que el build funcione.', 'https://www.roochub.com/classes/summoner', false, array['https://www.roochub.com/icons/UI_Icon_Skill_Doram_mihoutaoyingqiang.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Doram_mihoutaogenjingchanrao.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Doram_weiyudurou.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Doram_huoxia.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Doram_xiaojizhuoji.webp']::text[]),
    (v_guide, 4, 'Árbol Summoner (Trans. 2nd) — el núcleo del build', 'Summoner (Trans. 2nd) es la joya de la corona: tu tercer trabajo Doram, con 40 puntos más y donde vive el grueso de las 16 habilidades documentadas de la clase. Sigue este orden — varias dependen unas de otras para desbloquearse.

• Catnip Meteorite al máximo (Nv.10) — tu nuke definitivo: 1000% de daño mágico neutral en PvE (500% en PvP) a los enemigos dentro de 5 metros, además de invocar 10 meteoros. La habilidad que más partidas decide de todo el kit.
• Spirit Of Savage al máximo (Nv.10) — te lanzas en dash hacia el objetivo; Savage dura 7 segundos e inflige 700% de daño físico neutral (935% en PvE) al objetivo, y al invocarse golpea alrededor con 1300% (1760% en PvE).
• Lunatic Carrot Beat al máximo (Nv.10, requiere Spirit Of Savage Nv.5) — golpea 9 veces a los enemigos en 5 metros, cada golpe con 450% de daño físico neutral (660% en PvE) y 30% de probabilidad de Stun; al invocarse, golpea alrededor con 1300% (1650% en PvE). Tu rematador físico, y depende de haber subido antes Spirit Of Savage.
• Neko Power al máximo (Nv.10) — golpea a los enemigos en 3 metros con hasta 400% de daño físico y 100% de probabilidad garantizada de infligir Fear (miedo). Tu mejor herramienta de control instantáneo.
• Chattering al máximo (Nv.10) — pasiva: sube tu bono de daño mágico y tu MSPD un punto por nivel, hasta +20% de MDMG y +10% de MSPD en su tope.
• Soul of Land y Soul of Life al máximo (Nv.10 cada una) — pasivas que refuerzan un 20% el daño de tus habilidades de invocación en su nivel máximo (la primera requiere Catnip Meteorite Nv.5; la segunda, Lunatic Carrot Beat Nv.5). Baratas de mantener y suman directo a tu daño de área.
• Tasty Shrimp Party al máximo (Nv.10, requiere Purring Nv.3) — de un solo cast lanza Fresh Shrimp Nv.10, Bunch of Shrimp Nv.5 y Arclouse Dash Nv.5 sobre tus aliados, y encima suma +10% de recuperación de SP durante 120 segundos. Tu botón de soporte más eficiente.
• Purring (Nv.3, requiere Grooming Nv.1) — cura a los aliados en 5 metros un 30% de su HP en su nivel máximo; solo existe para desbloquear Tasty Shrimp Party, pero cúrala igual.
• Grooming (1 punto, obligatorio) — elimina los efectos de control sobre ti y te da inmunidad a control durante 3 segundos. Un único punto y desbloquea toda la rama de soporte de esta etapa.
• Nyang Grass (unos pocos puntos) — crea un área donde la Reducción de daño físico y la Reducción de MATK del enemigo bajan un 20%, con el efecto persistiendo 30 segundos incluso si sale del área.
• Hiss (unos pocos puntos) — sube el MSPD un 10% y el FLEE en 20 puntos a los aliados cercanos durante 15 segundos.

Si te sobran puntos, repártelos en Meow Meow (comparte tu Chattering con el grupo), Life-saving Dried Fish (evita la muerte durante 3 segundos, cooldown fijo) y Power of Flock (hasta 3% de probabilidad de Fear en cada ataque). Ninguna es prioritaria, pero las tres son baratas y rinden bien de relleno.', 'https://www.roochub.com/classes/summoner', false, array['https://www.roochub.com/icons/UI_Icon_Skill_Doram_maoboheyunshi.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Doram_yezhuzhihun.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Doram_fengtuhuluobozhongji.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Doram_maomaoweiwu.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Doram_meiweihuoxiapaidui.webp', 'https://www.roochub.com/icons/UI_Icon_Skill_Doram_miaomiaobuxiu.webp']::text[]),
    (v_guide, 5, 'Tu combo principal', 'Tener los puntos bien repartidos no sirve de nada si no ejecutas el combo en el orden correcto. Esta es la secuencia que de verdad decide una pelea.

1. Antes de que empiece el choque, lanza Tasty Shrimp Party sobre tu grupo: de un solo cast cubres HP, PATK/MATK, AGI y +10% de recuperación de SP durante 120 segundos — no lo gastes antes de que haga falta, o se te agota antes del enfrentamiento real.
2. Marca el terreno con Catnip Powdering o Nyang Grass sobre la zona donde va a producirse el choque: ralentiza y debilita al rival antes de que lleguéis a intercambiar golpes.
3. Abre con Catnip Meteorite sobre el grupo enemigo agrupado: 1000% de daño mágico neutral en PvE (500% en PvP) a todo lo que esté dentro de 5 metros.
4. Encadena Spirit Of Savage para entrar al cuerpo a cuerpo (700%/935% en PvE) y sigue de inmediato con Lunatic Carrot Beat (9 golpes de 450%/660% en PvE cada uno) — en ese orden, porque Carrot Beat exige Spirit Of Savage Nv.5 para desbloquearse.
5. Usa Neko Power para asustar (Fear al 100%) a quien intente escapar o flanquearte, y reserva Grooming y Life-saving Dried Fish como tu red de seguridad si la pelea se alarga más de la cuenta.
6. Entre rondas, recupera con Tuna Belly o Purring — no esperes a estar casi muerto para lanzarlas.', 'https://www.roochub.com/classes/summoner', false, array[]::text[]),
    (v_guide, 6, 'Equipo recomendado — cartas', 'Aquí tienes el equipo de cartas que completa el build. No encontramos en la ficha de la clase ni en el sistema de cartas ninguna restricción de equipo específica para Doram, así que estas cartas funcionan igual que para cualquier otra clase: se insertan en los huecos de socket de tu arma, armadura, accesorios y el resto de piezas de equipo.

• Doppelganger (Épica, ranura Arma) — ASPD +10%, AGI +5, CRIT +5, daño de CRIT +12%; en set, +2% de ASPD adicional. Acelera el combo físico de Neko Power y Lunatic Carrot Beat.
• Drake (Épica, Arma, alternativa a Doppelganger) — daño físico y mágico +12%, con +3% de ATK de arma en set. Al pegar en las dos escuelas de daño a la vez, es la opción más genérica para un kit híbrido como el de Summoner.
• Dracula (Épica, Arma, otra alternativa) — +100 de MATK de arma y +15% de daño mágico, con la ventaja de que el tiempo de lanzamiento no se interrumpe al recibir daño — protege tu cast de Catnip Meteorite y Silvervine Stem Spear en medio de una pelea.
• Pharaoh (Épica, Cabeza superior) — Costo de SP -50% y daño mágico +8%. Con habilidades de entre 12 y 30 SP repartidas en tus tres árboles, probablemente la carta más rentable de toda la lista para Summoner.
• Orc Hero (Épica, Cabeza superior, alternativa a Pharaoh) — VIT +8 e inmunidad a Aturdimiento cada 6 segundos. Prioriza esta si te están interrumpiendo el combo con control antes que el gasto de SP.
• Angeling (Épica, Armadura) — HP máx. +5% y cambia el elemento de tu armadura a Sagrado. Supervivencia genérica para una clase que no es tanque.
• Horn (Rara, Mano secundaria / Off-Hand) — reduce un 20% el daño físico que recibes. Al caer de un monstruo de campo corriente, es de las piezas más accesibles de toda la lista.
• Kobold (Rara, Accesorio, opción barata) — CRIT +4, STR +2. Un empujón directo a tu STR mientras consigues equipo mejor.

No incluimos ninguna carta del estilo Osiris (el seguro de vida contra un golpe letal): Summoner ya lleva ese mismo tipo de red de seguridad integrada en el kit con Life-saving Dried Fish, así que no hace falta forzar una carta MVP cara solo para cubrir lo mismo.', 'https://www.roochub.com/cards', false, array['https://www.roochub.com/icons/UI_MonsterCard_Siling.webp', 'https://www.roochub.com/icons/UI_MonsterCard_Haidaozhiwang.webp', 'https://www.roochub.com/icons/UI_MonsterCard_Degulananjue.webp', 'https://www.roochub.com/icons/UI_MonsterCard_Falaowang.webp', 'https://www.roochub.com/icons/UI_MonsterCard_Shourenyingxiong.webp', 'https://www.roochub.com/icons/UI_MonsterCard_Tianshiboli.webp', 'https://www.roochub.com/icons/UI_MonsterCard_Qiaoxingchong.webp', 'https://www.roochub.com/icons/UI_MonsterCard_Quanyao.webp']::text[]),
    (v_guide, 7, 'Mascota recomendada', 'El sistema de mascotas es el mismo para todas las clases — se desbloquea en Nivel Base 22, sin restricción de raza — así que Summoner elige entre el mismo catálogo de 9 mascotas que el resto del roster. Dos encajan especialmente bien con este kit.

• Teacup Rabbit (Soporte, Bruto) — su Habilidad Exclusiva, Drinks on Me, devuelve SP al dueño cada vez que lanza una habilidad, además de rociar té causando 350% de daño mágico de agua a 6 enemigos frontales (sube a 550% en el Tier 10). Es la pareja obvia para un kit tan caro en SP como el de Summoner: entre los tres árboles reparte habilidades de 12 a 30 SP cada una, y varias hay que refrescarlas cada 120 segundos.
• Sohee (Soporte, Semihumano) — Lucid Dream da a Sohee y a su dueño +10% de velocidad de ataque, +5% de velocidad de movimiento y 2% de robo de vida durante 8 segundos, a cambio de +3 segundos de reutilización de habilidades (en el Tier 10 llega a +30%/+12%/5%). Esa penalización de cooldown apenas se nota en Summoner, porque tus rematadores físicos (Spirit Of Savage, Lunatic Carrot Beat) ya son habilidades de cooldown largo, no de spam.

Puedes llevar hasta 4 mascotas activas a la vez (más un hueco de Assist desde Nivel Base 55), así que nada te impide llevar ambas al mismo tiempo.', 'https://roocdb.com/en/pets', false, array['https://roocdb.com/pets/Pokemon_chabeitu.webp', 'https://roocdb.com/pets/Pokemon_guinv.webp']::text[]),
    (v_guide, 8, 'Trucos para 5v5 (Dimension Drill)', 'Dimension Drill reúne varios minijuegos de 5v5, y Summoner tiene un aporte distinto en cada uno.

• Blood and Gold — cuando el bando rival se agrupe junto al Goblin King, ese amontonamiento es el escenario perfecto para Catnip Meteorite: reparte hasta 1000% de daño mágico neutral entre todo lo que caiga dentro de los 5 metros.
• Shapeshift Ops — en el instante en que un compañero va a recoger el orbe de transformación es cuando el equipo rival más se va a volcar sobre él; cúbrelo con Tuna Party (bloquea daño igual al 8% de tu propia Max HP) o corta el paso de quien se acerque con Silvervine Root Twist.
• Cart Contest — suelta Catnip Powdering o Nyang Grass sobre el camino que va a recorrer el carro para frenar a los que intenten interceptarlo, y guarda Hiss para dar velocidad extra a tus portadores en la recta final.
• Team Deathmatch — abre la ronda con Neko Power sobre el grupo rival (Fear garantizado al 100%, sin depender de suerte) y remata al objetivo marcado con el combo Spirit Of Savage → Lunatic Carrot Beat.', 'https://www.roochub.com/classes/summoner', false, array[]::text[]),
    (v_guide, 9, 'Trucos para GvG (guerra de gremios)', 'La guerra de gremios premia decisiones distintas a las del 5v5. Estos son los trucos que marcan la diferencia con Summoner.

• Vigrid Avenge — cargar el Cuerno no es tu trabajo (para eso está la clase con más HP bruta del equipo); tu aporte real aquí es mantener con vida a quien sí lo cargue, con Fresh Shrimp y Tuna Party mientras avanza bajo fuego.
• Vale of Clash — antes de que el rival llegue en grupo al Crystal Pillar, dispara Catnip Meteorite sobre la zona de acceso y sella cualquier intento de huida con Silvervine Root Twist; entre las dos ganas el tiempo que el resto de tu equipo necesita para llegar a defender.
• Stellar Clash — en el momento exacto en que tu equipo decide saltar a un nuevo objetivo, el Fear al 100% de Neko Power o el Immobilize de Silvervine Root Twist son tu forma de asegurarte de que ese objetivo no se escapa antes de caer.
• Sincroniza tu soporte — no gastes Tasty Shrimp Party nada más empezar el asedio: sus 120 segundos de buffs y recuperación de SP rinden mucho más si los sincronizas con el momento en que de verdad se cruzan las líneas, no con el inicio de la ronda.', 'https://www.roochub.com/classes/summoner', false, array[]::text[]),
    (v_guide, 10, 'Errores que cuestan partidas', 'Incluso con el build perfecto sobre el papel, estos son los fallos que más partidas cuestan.

• Lanzar Lunatic Carrot Beat sin haber entrado antes con Spirit Of Savage. La habilidad exige Spirit Of Savage Nv.5 para desbloquearse — si rompes ese orden en combate, pierdes todo el follow-up del combo.
• Activar Tasty Shrimp Party demasiado pronto, antes de que el choque real empiece. Sus 120 segundos de buffs y de recuperación de SP se agotan antes de que sirvan de algo si los gastas como preparación temprana.
• Descuidar el SP. Con habilidades de entre 12 y 30 SP repartidas en tus tres árboles y varios buffs que hay que refrescar cada 120 segundos, quedarte seco a mitad de pelea te deja sin Catnip Meteorite ni Silvervine Stem Spear justo cuando más los necesitas.
• Lanzar Catnip Meteorite sin haber inmovilizado antes al objetivo. Invoca meteoros con un pequeño retardo, así que si el rival tiene margen para caminar fuera de los 5 metros de radio antes de que caigan, pierdes gran parte del daño.
• Olvidar Grooming y Life-saving Dried Fish como red de seguridad. Summoner pasa mucho tiempo con animaciones de lanzamiento activas y no tiene el HP de un tanque; no reservar estos dos botones de emergencia es la forma más común de morir a mitad de combo.', 'https://www.roochub.com/classes/summoner', false, array[]::text[]);
end
$IMPERIUM$;
