-- Inserta la sección "facciones" de Call of Dragons (traducida de cod.guide, sin verificar)
do $do$
declare
  v_game_id uuid;
  v_section_id uuid;
begin
  -- 1. Buscar el game_id de call-of-dragons
  select id into v_game_id from games where slug = $fac$call-of-dragons$fac$;
  if v_game_id is null then
    raise exception $fac$No se encontró el juego call-of-dragons$fac$;
  end if;

  -- 2. Borrar la sección facciones si ya existía (los section_blocks caen por ON DELETE CASCADE)
  delete from game_sections where game_id = v_game_id and slug = $fac$facciones$fac$;

  -- 3. Insertar la sección
  insert into game_sections (game_id, slug, title, intro_title, intro, intro_images, is_published)
  values (
    v_game_id,
    $fac$facciones$fac$,
    $fac$Facciones$fac$,
    $fac$Facciones de Call of Dragons$fac$,
    $fac$Guía de facciones: cuál elegir en cada fase del juego. Traducida de cod.guide — contenido sin verificar.$fac$,
    '{}'::text[],
    true
  )
  returning id into v_section_id;

  -- 4. Insertar cada bloque
  insert into section_blocks (section_id, order_index, title, content, images, source_url, is_verified) values
  (v_section_id, 0, $fac$Mejor facción para empezar$fac$, $fac$Una vez que llegas al nivel 10, puedes cambiar de facción con un objeto del juego.

Recomiendo elegir League of Order solo por el buff de velocidad de recolección general. También sugiero usar a Waldyr como tu héroe principal.

En las primeras fases, el combate no es para la mayoría de los jugadores, y muchos se centran solo en crecer. League of Order te da más oportunidades de hacerlo.

Si no quieres ir con League of Order, Springwardens también puede ser útil, ya que aporta velocidad de curación (5%).

Sin embargo, si te interesa el combate, Wilderburg puede no ser la mejor opción, ya que la ingeniería de destrucción no ayuda mucho porque no hay muchas guerras. Su ataque físico está bien, pero no hay mucho PvP.$fac$, array[$fac$https://cdn.cod.guide/wp-content/uploads/2023/02/waldyr.png$fac$]::text[], $fac$https://cod.guide/factions/$fac$, false),

  (v_section_id, 1, $fac$Héroes iniciales por facción$fac$, $fac$El héroe inicial de Springwardens es Gwanwyn, y obtendrás de ella los atributos de Marksman, Pacificación y Precisión. Es una gran elección para PvE.

El árbol de Marksman potencia sus habilidades de tiro con arco y la velocidad y el ataque de sus tropas. El árbol de pacificación le da ventaja contra darklings y criaturas oscuras. El árbol de precisión es mi favorito personal porque mejora sus ataques normales y contraataques, convirtiéndola en una formidable causante de daño a un solo objetivo.

Como héroe arquera, Gwanwyn puede repartir mucho daño, pero también es muy frágil y necesita protección de otras unidades. Es como un cañón de cristal: poderosa pero vulnerable.

El héroe inicial de League of Order es Waldyr, una gran elección para cualquier jugador.

Tiene acceso al árbol Magic, que le otorga poderosas unidades mágicas para ataques a larga distancia; al árbol PvP, para atacar a otros jugadores en el campo; y al árbol de Habilidades, que aumenta la efectividad de sus habilidades de furia.

En los combates que hemos visto hasta ahora, las unidades mágicas han sido las más exitosas. Por la forma en que funcionan las barricadas, pueden eliminar fácilmente a los enemigos cuerpo a cuerpo antes de que se acerquen lo suficiente. Sin embargo, la única desventaja es que son lentas, así que si te sobreextiendes con ellas, puedes ser rodeado fácilmente.

Wilderburg tiene a Bakhar como héroe inicial y es un héroe de Infantry/Garrison/Habilidades. No es la mejor opción para quienes buscan combate, pero vale la pena considerarlo por sus unidades únicas.

Bakhar no es un gran héroe inicial. No obtendrás muchos beneficios de un héroe de Garrison como él porque hay muchos jugadores que gastan mucho dinero en el juego y van a invertir en héroes mucho mejores que Bakhar. Lo más probable es que lo uses en campo abierto, pero también puedes usarlo para proteger tu ciudad.

Lee más: Tier List de Call of Dragons$fac$, array[$fac$https://cdn.cod.guide/wp-content/uploads/2023/02/gwanwyn.png$fac$, $fac$https://cdn.cod.guide/wp-content/uploads/2023/02/waldyr.png$fac$, $fac$https://cdn.cod.guide/wp-content/uploads/2023/02/bakhar.png$fac$]::text[], $fac$https://cod.guide/factions/$fac$, false),

  (v_section_id, 2, $fac$¿Cuál es la mejor facción en general?$fac$, $fac$League of Order es la mejor facción para empezar porque puedes conseguir a Waldyr y el mayor bono: velocidad de recolección general. Los Workhorses también te dan más capacidad para granjear mucho más rápido y mejor.

League of Order es excelente para cuentas de granjeo.

Pero, sinceramente, Springwardens también es genial porque vas a obtener más curación al día para luchar contra esos Behemoths. También obtienes mayor velocidad de marcha, además de a Gwanwyn, que es un gran héroe de pacificación que reparte un montón de daño.$fac$, array[$fac$https://cdn.cod.guide/wp-content/uploads/2023/02/wilderburg-faction-1024x576.png$fac$]::text[], $fac$https://cod.guide/factions/$fac$, false),

  (v_section_id, 3, $fac$Facción para la fase tardía$fac$, $fac$Pasando a la fase más tardía del juego, deberías centrarte en cuál es tu rol.

¡Las unidades especiales realmente cobran efecto en tu combate de campo abierto!

Cuando se trata de hacer rallies, puede ser un poco diferente en cómo lo enfocas en comparación con el campo abierto, porque en la mayoría de los casos se unirán a tu rally distintos tipos de unidad.

Debes averiguar tu rol antes de elegir la facción correcta: Cavalry, Infantry, Marksman, voladoras, o todas a la vez.

En la fase tardía, recomendaría mucho que te fijes en Wilderburg porque vas a hacer muchos combates, y el daño de ataque físico de la Legión ayuda significativamente.

Wilderburg será realmente bueno para quienes gastan dinero en el juego y lideran rallies y la defensa de Garrison, porque obtienes ese 3% extra de ataque físico que beneficiará a cualquier tipo de unidad.

Lo único que encuentro muy diferente es el daño de las unidades voladoras.

• Spring: Físico
• League of Order: Mágico
• Wilderburg: Físico con mayor HP y daño de habilidad

Ten en cuenta también que cada vez que haces rally de Cavalry, no importa siquiera si tu Springwarden tiene alcance, porque el rally es de combate cuerpo a cuerpo.

En general, diría que una facción de fase tardía muy buena sería Wilderburg. Le sigue Springwardens por el buff de curación y velocidad de marcha.

Cada vez que estés en grandes combates, sin duda verás barricadas frenándote, y tener un 5% extra puede permitirte evadir o cargar.

League of Order debería ser la tercera opción en las fases tardías del juego. Probablemente tendrás una cuenta de granjeo y te abastecerá de recursos cada semana con League of Order. La DEF mágica de la Legión no es muy útil de momento, ya que muchos de los combates a distancia hacen daño físico, así que no te vas a beneficiar mucho.$fac$, array[$fac$https://cdn.cod.guide/wp-content/uploads/2023/02/springwardens-1024x576.png$fac$]::text[], $fac$https://cod.guide/factions/$fac$, false),

  (v_section_id, 4, $fac$Springwardens$fac$, $fac$Los Springwardens son la facción de los elfos, con Gwanwyn como héroe inicial.

Esta facción tiene una amplia variedad de tipos de tropa, desde los Archers de medio alcance hasta los Longleaf Treants, que empuñan magia de largo alcance. La facción también tiene acceso al Work Elk, usado para recolectar recursos, y a los Elk Riders, una unidad de Cavalry con ataque cuerpo a cuerpo. El tipo de unidad especial de los Springwardens es el Forest Eagle, una unidad voladora con ataque cuerpo a cuerpo.

El bono de facción de los Springwardens aumenta la velocidad de marcha en un 5% y la velocidad de curación en un 10%, respectivamente. Este bono puede ser especialmente efectivo en batallas de campo abierto, ya que permite a los ejércitos moverse y recuperarse más rápido.$fac$, array[$fac$https://cdn.cod.guide/wp-content/uploads/2023/02/gwanwyn.png$fac$, $fac$https://cdn.cod.guide/wp-content/uploads/2023/01/league-of-order.png$fac$]::text[], $fac$https://cod.guide/factions/$fac$, false),

  (v_section_id, 5, $fac$League of Order$fac$, $fac$Esta es la facción de los humanos, con Waldyr como héroe inicial.

Compuesta por Vestals, Swordsmen, Ballistas, Workhorses y Knights, sus tipos de tropa ofrecen capacidades variadas. Las mágicas Vestals presumen de una impresionante distancia de ataque a largo alcance; los Swordsmen son unidades de Infantry con ataque cuerpo a cuerpo; las Ballistas son arqueros con ataque de medio alcance y los Workhorses son la unidad de recolección de recursos. La unidad de Cavalry Knight aporta un poderoso ataque cuerpo a cuerpo a la facción, y la unidad especial Celestial ofrece capacidad voladora además de un largo alcance de ataque.

Los bonos de League of Order refuerzan aún más la fuerza de la facción: +3% de Defensa Mágica de Legión y +10% de velocidad de recolección general.

Con las unidades mágicas siendo tan poderosas ahora mismo, ese bono defensivo es una gran ventaja. El bono del 10% de velocidad a la recolección también será de gran ayuda al construir, investigar tecnologías y entrenar tropas: estos recursos son esenciales durante las primeras fases del juego.$fac$, array[$fac$https://cdn.cod.guide/wp-content/uploads/2023/02/waldyr.png$fac$, $fac$https://cdn.cod.guide/wp-content/uploads/2023/01/wilderburg.png$fac$]::text[], $fac$https://cod.guide/factions/$fac$, false),

  (v_section_id, 6, $fac$Wilderburg$fac$, $fac$Wilderburg es la facción de los orcos, con Bakhar como héroe inicial.

Los numerosos tipos de unidad incluyen Axemen, infantería con ataque cuerpo a cuerpo; Spearmen, arqueros con ataque de medio alcance; magos Satyr, que lanzan ataques mágicos desde larga distancia; Workrhinos, robustas unidades de transporte usadas para recolectar recursos; y los poderosos Wolfriders, Cavalry con ataque cuerpo a cuerpo. Su unidad especial, los Wyvern Riders, son arqueros voladores con ataque de medio alcance.

Los bonos de facción de Wilderburg son +3% de Ataque Físico de Legión y +10% de Ingeniería de Destrucción. Esto los hace geniales para tomar y controlar territorio. La ingeniería de destrucción se puede usar al destruir estructuras de alianzas enemigas, como torres y fortalezas, mientras que el bono de ataque físico se aplica a todos los tipos de unidad, haciéndolos adaptables en cualquier situación.

Este blog está gestionado por la comunidad y para la comunidad. Si quieres contribuir con guías, consejos, estrategias o cualquier otra información de Call of Dragons, contáctanos y haz que la comunidad de CoD sea cada día mejor.$fac$, array[$fac$https://cdn.cod.guide/wp-content/uploads/2023/02/bakhar.png$fac$, $fac$https://cdn.cod.guide/wp-content/uploads/2023/01/call-of-dragons-logo.png$fac$]::text[], $fac$https://cod.guide/factions/$fac$, false);

  raise notice $fac$Sección facciones insertada con 7 bloques$fac$;
end
$do$;
