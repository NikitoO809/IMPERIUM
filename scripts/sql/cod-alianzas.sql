do $IMPERIUM$
declare
  v_game uuid;
  v_guide uuid;
begin
  select id into v_game from public.games where slug = 'call-of-dragons';
  if v_game is null then
    raise exception 'IMPERIUM: juego no encontrado: %', 'call-of-dragons';
  end if;

  -- Reemplazo idempotente. OJO: borra los pasos -> reinicia step_progress de esta guía.
  delete from public.guide_steps where guide_id in (
    select id from public.guides where game_id = v_game and slug = 'alianzas');
  delete from public.guides where game_id = v_game and slug = 'alianzas';

  insert into public.guides
    (game_id, slug, title, description, order_index, is_published, intro_title, intro, intro_images)
  values
    (v_game, 'alianzas', 'Guía de Alianzas', 'Estar en una alianza en Call of Dragons es lo más importante si quieres progresar y disfrutar del juego: donaciones, ayuda, tecnología, eventos de alianza y mucho más.

Call of Dragons es un juego de equipo. Si no estás en una alianza, te pierdes un montón de beneficios. En esta guía cubrimos todo lo que necesitas saber sobre las alianzas.', 4, false, null, null, array['https://callofdragonsguides.com/wp-content/uploads/2023/02/Call-of-Dragons-Alliance-Guide.jpg']::text[])
  returning id into v_guide;

  insert into public.guide_steps
    (guide_id, order_index, title, content, source_url, is_verified, images)
  values
    (v_guide, 1, '¿Crear o unirse a una alianza?', 'Muchos jugadores se preguntan si deberían crear una alianza o unirse a una ya existente. Si eres jugador free-to-play o no tienes mucho tiempo libre, lo mejor es unirte a una que ya exista, porque liderar una alianza consume mucho tiempo: hay que planificar el desarrollo, gestionar a los miembros, dirigir guerras, planear los edificios de alianza, hablar con otras alianzas y mucho más. Ser líder es una tarea difícil.

Si eres free-to-play y quieres liderar, lo tendrás complicado: te ignorarán y te atacarán constantemente los jugadores pay-to-win, y además te costará atraer miembros.

Así que lo mejor es unirse a una alianza existente; pero si te encantan los retos, adelante, crea la tuya.', 'https://callofdragonsguides.com/call-of-dragons-alliance-guide/', false, array[]::text[]),
    (v_guide, 2, 'Cómo crear una alianza en Call of Dragons', 'Para crear una alianza necesitas el Ayuntamiento a nivel 4 y 1500 gemas. Cuando cumplas los requisitos, ve a la pestaña de alianza (parte inferior derecha de la pantalla) y verás la opción de crear una alianza. Ahí elegirás el nombre, diseñarás el estandarte y definirás las reglas y la descripción. Después podrás empezar a atraer miembros.

Te recomendamos dejar la solicitud de ingreso como «Cualquiera puede unirse», porque necesitas tantos jugadores como puedas para empezar a construir los edificios de alianza.', 'https://callofdragonsguides.com/call-of-dragons-alliance-guide/', false, array[]::text[]),
    (v_guide, 3, 'Rangos de alianza', 'Cada alianza puede tener más de 150 jugadores y, sin rangos, sería imposible gestionarlos. Por eso cada alianza tiene cuatro rangos distintos más el líder.

Líder de alianza: puede gestionar todos los demás roles, eliminar la alianza y no puede ser expulsado. Lo único que le hace perder el liderazgo es no conectarse durante un periodo prolongado.

Oficiales de Rango 4: cada alianza puede tener 8 oficiales. Pueden gestionar a todos los jugadores y tienen acceso a casi todas las funciones. Pueden recibir títulos de alianza del líder.

Rangos 3, 2 y 1: son iguales entre sí, pero existen tres para que el líder y los oficiales gestionen mejor a los miembros. Normalmente los de Rango 1 son nuevos en la alianza.

Aquí tienes la lista de todos los rangos y sus privilegios:

Privilegio | R1 | R2 | R3 | R4 | Líder
Ayuda de alianza | X | X | X | X | X
Chat de alianza | X | X | X | X | X
Enviar correo de alianza |  | X | X | X | X
Abandonar alianza | X | X | X | X | 
Estado en línea (solo oficiales con título) |  |  |  | X | X
Ajustar rango de miembros |  |  |  | X | X
Invitaciones |  |  |  | X | X
Solicitudes de ingreso |  |  |  | X | X
Expulsar miembros |  |  |  | X | X
Construir / mejorar edificios de alianza |  |  |  | X | X
Marcador de alianza |  |  |  | X | X
Investigar tecnología de alianza |  |  |  | X | X
Reabastecer tienda de alianza |  |  |  | X | X
Ver posición de miembros |  |  |  | X | X
Activar autoataque de la torre de asedio |  |  |  | X | X
Invocar Behemoths |  |  |  | X | X
Asignar capitán de guarnición (solo oficiales con título) |  |  |  | X | X
Disolver legión de guarnición (solo oficiales con título) |  |  |  | X | X
Gestión de unión |  |  |  |  | X
Editar info de la alianza |  |  |  |  | X
Nombrar oficiales |  |  |  |  | X
Eliminar edificios de alianza |  |  |  |  | X
Disolver alianza |  |  |  |  | X
Iniciar preparación de batalla de Behemoth |  |  |  | X | X
Iniciar incursiones de Behemoth élite |  |  |  | X | X
Emitir decretos de alianza (solo oficiales con título) |  |  |  | X | X', 'https://callofdragonsguides.com/call-of-dragons-alliance-guide/', false, array['https://callofdragonsguides.com/wp-content/uploads/2023/02/Alliance-ranks.jpg']::text[]),
    (v_guide, 4, 'Cómo teletransportarte al territorio de la alianza', 'Para teletransportarte al territorio de la alianza necesitas objetos de reubicación, que consigues en varios sitios. Aleja la cámara del mapa, localiza el territorio de tu alianza y haz clic en el lugar al que quieras moverte; aparecerá la opción de reubicación. Hay otras formas de reubicar tu ciudad que explicamos en la guía de reubicación de Call of Dragons.', 'https://callofdragonsguides.com/call-of-dragons-alliance-guide/', false, array[]::text[]),
    (v_guide, 5, 'Territorio de la alianza', 'El territorio de la alianza da bonificaciones importantes que debes conocer. La más importante: cuando tu ciudad está dentro del territorio de tu alianza, los enemigos no pueden atacarla. Esto es clave sobre todo si eres nuevo, porque los jugadores fuertes buscan a los novatos para robarles recursos. Asegúrate siempre de estar en territorio de alianza y no tendrás que preocuparte por los ataques.

Otra cosa importante es la recolección en territorio de alianza. Cuando envías tropas a recolectar ahí, los enemigos no pueden atacarte, obtienes un 25% más de velocidad de recolección y parte de los recursos van al almacén de la alianza.

Así que únete a una alianza y teletranspórtate a su territorio lo antes posible.', 'https://callofdragonsguides.com/call-of-dragons-alliance-guide/', false, array[]::text[]),
    (v_guide, 6, 'Almacén de la alianza', 'El almacén es el lugar donde se guardan y producen los recursos de la alianza. Estos recursos se usan para construir edificios y torres, y para investigar. La cantidad de recursos que produce la alianza depende de cuántos recolecten sus miembros en el territorio, de cuántas torres y puntos de recursos tenga, de su tecnología, etc.

1. El territorio de la alianza produce recursos de alianza de forma continua, además de recursos individuales extra para todos los miembros.
2. Cuantos más tipos de terreno cubra el territorio de la alianza, mayor será su producción de recursos.
3. La Ayuda de alianza, las contribuciones a la Tecnología de alianza y la construcción de Edificios de alianza aumentan mucho los Puntos de alianza.
4. La Tecnología de alianza puede aumentar el límite de almacenamiento del Almacén.', 'https://callofdragonsguides.com/call-of-dragons-alliance-guide/', false, array['https://callofdragonsguides.com/wp-content/uploads/2023/02/Alliance-storehouse.jpg']::text[]),
    (v_guide, 7, 'Tecnología de la alianza', 'La tecnología de alianza es una de las cosas que más mejora y acelera tu progreso. Algunas tecnologías aceleran tu recolección, investigación y construcción; otras mejoran la fuerza de tus unidades para que luches mejor contra enemigos y fuertes Darkling.

Cada vez que donas recursos a la tecnología de alianza obtienes Puntos de Miembro, que puedes gastar en la tienda de alianza. Ten en cuenta que el límite es de 10.000 Puntos de Miembro, y no gastes gemas en tecnología de alianza.', 'https://callofdragonsguides.com/call-of-dragons-alliance-guide/', false, array['https://callofdragonsguides.com/wp-content/uploads/2023/02/Alliance-technology.jpg']::text[]),
    (v_guide, 8, 'Tienda de la alianza', 'La Tienda de alianza es un gran sitio para conseguir objetos que aceleran tu progreso o que necesitas en un momento concreto. Para comprar necesitas Puntos de Miembro y Méritos, que obtienes con varias actividades como donar a la tecnología de alianza, luchar, construir, etc.', 'https://callofdragonsguides.com/call-of-dragons-alliance-guide/', false, array['https://callofdragonsguides.com/wp-content/uploads/2023/02/Alliance-store-1.jpg']::text[]),
    (v_guide, 9, 'Ayuda de alianza', 'Es una de las mejores funciones de la alianza. Cada vez que pones algo a investigar o construir, los miembros pueden ayudarte. Cada ayuda reduce un 1% el tiempo de construcción o investigación. La cantidad total de ayuda que puedes recibir depende del nivel de tu Centro de alianza.

Por eso, mejora el Centro de alianza todo lo que puedas. Al principio el impacto será bajo, pero lo notarás muchísimo en el endgame, donde muchas investigaciones tardan más de 50 días.', 'https://callofdragonsguides.com/call-of-dragons-alliance-guide/', false, array['https://callofdragonsguides.com/wp-content/uploads/2023/02/Alliance-help-.jpg']::text[]),
    (v_guide, 10, 'Regalos de alianza', 'Los regalos de alianza son una función con la que cada miembro recibe un regalo gratis por distintas actividades de la alianza. Con ellos consigues objetos como recursos y aceleradores. Hay 3 tipos de regalos:

- Raro: todos reciben un regalo cuando alguien de la alianza compra un paquete de la tienda.
- Común: todos reciben un regalo cuando la alianza derrota fuertes Darkling, al ejército oscuro de Eliana, o saquea un cofre oscuro.
- Cofre de Bendición: es el mejor cofre, pero para abrirlo la alianza debe reunir cierto número de llaves. Las llaves salen de los cofres raros y comunes. Cuantos más miembros tenga la alianza, más llaves conseguirá.

Por eso recomendamos unirte a una alianza llena de jugadores activos, sobre todo pay-to-win. La cantidad de aceleradores que acumularás con el tiempo es brutal. Una de las mejores formas de conseguir muchos cofres es destruir fuertes Darkling: no hay límite de cuántos se pueden destruir.', 'https://callofdragonsguides.com/call-of-dragons-alliance-guide/', false, array[]::text[]),
    (v_guide, 11, 'Behemoths', 'Los Behemoths son criaturas de Call of Dragons repartidas por todo el mapa. Las alianzas pueden capturarlos y, al hacerlo, toda la alianza obtiene mejoras (buffs). Además, la alianza puede invocar al Behemoth que ha capturado para que la ayude a luchar contra los enemigos.

Hay muchos Behemoths distintos y cada uno tiene habilidades y estilo de juego únicos. Si quieres más información, mira nuestra sección de Behemoths de Call of Dragons: ahí encontrarás todo lo necesario para derrotarlos (ubicaciones, habilidades y mucho más).', 'https://callofdragonsguides.com/call-of-dragons-alliance-guide/', false, array['https://callofdragonsguides.com/wp-content/uploads/2023/02/Behemoths-call-of-dragons.jpg']::text[]),
    (v_guide, 12, 'Conclusión', 'La alianza juega un papel enorme en el progreso en Call of Dragons. Seas nuevo o veterano, tienes que estar en una alianza. Los beneficios son inmensos y no merece la pena jugar sin una. Únete cuanto antes y trata de entrar en una alianza top con muchos jugadores activos.', 'https://callofdragonsguides.com/call-of-dragons-alliance-guide/', false, array[]::text[]);
end
$IMPERIUM$;
