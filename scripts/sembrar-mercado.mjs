// Siembra ofertas de ejemplo en el foro del mercado.
//
//   node scripts/sembrar-mercado.mjs              → simula, no toca nada
//   node scripts/sembrar-mercado.mjs --aplicar    → las publica de verdad
//   node scripts/sembrar-mercado.mjs --borrar     → las quita todas
//
// Para qué: un mercado vacío no arranca. Nadie publica porque no hay nadie
// mirando, y nadie mira porque no hay nada publicado. Con el foro poblado se
// ve de un vistazo cómo funciona, se puede probar el buscador con resultados
// de verdad, y quien entre el día del lanzamiento no se encuentra un desierto.
//
// Las fichas salen EXACTAMENTE como las publica el bot con /vendo y /compro:
// mismo embed, mismos botones, mismas etiquetas. Así lo que se prueba es el
// mercado real, no una imitación.
//
// Van firmadas como ejemplo en las notas, para que nadie escriba a un nick que
// no existe. Con --sin-marca se quita esa línea.
//
// Los ids de lo creado quedan en scripts/data/mercado-sembrado.json, que es lo
// que permite deshacerlo con --borrar.
import { readFileSync, writeFileSync, existsSync } from "node:fs";

// ── Lee .env.local sin librerías ─────────────────────────────────
function loadEnv() {
  const env = {};
  let raw = "";
  try {
    raw = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
  } catch {
    return env;
  }
  for (const line of raw.split("\n")) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (match) env[match[1]] = match[2].trim().replace(/^["']|["']$/g, "");
  }
  return env;
}

const env = loadEnv();
const TOKEN = env.DISCORD_BOT_TOKEN;
const FORO = env.DISCORD_FORO_MERCADO;
const GUILD = env.DISCORD_GUILD_ID;

if (!TOKEN || !FORO || !GUILD) {
  console.error(
    "\n  Faltan datos en .env.local.\n" +
      "  Necesito DISCORD_BOT_TOKEN, DISCORD_FORO_MERCADO y DISCORD_GUILD_ID.\n"
  );
  process.exit(1);
}

const APLICAR = process.argv.includes("--aplicar");
const BORRAR = process.argv.includes("--borrar");
const SIN_MARCA = process.argv.includes("--sin-marca");

// Miguel (miguelcarmona / NikitoO). OJO: no es el dueño del servidor, así que
// no vale sacarlo de `owner_id`. Se puede cambiar con --autor <id>.
const AUTOR_POR_DEFECTO = "1041000695953903676";

function argumento(nombre) {
  const i = process.argv.indexOf(nombre);
  return i !== -1 ? process.argv[i + 1] : undefined;
}
const REGISTRO = new URL("../scripts/data/mercado-sembrado.json", import.meta.url);

const API = "https://discord.com/api/v10";
const H = { Authorization: `Bot ${TOKEN}`, "Content-Type": "application/json" };
const espera = (ms) => new Promise((r) => setTimeout(r, ms));

async function discord(ruta, metodo = "GET", cuerpo) {
  const res = await fetch(API + ruta, {
    method: metodo,
    headers: H,
    body: cuerpo ? JSON.stringify(cuerpo) : undefined,
  });
  // Discord frena si se le va la mano: esperar lo que pida y repetir.
  if (res.status === 429) {
    const { retry_after: reintentar = 1 } = await res.json();
    console.log(`    (Discord pide esperar ${reintentar}s)`);
    await espera((reintentar + 0.5) * 1000);
    return discord(ruta, metodo, cuerpo);
  }
  return res;
}

// ── Las quince ofertas ───────────────────────────────────────────
// Cosas del juego y nada más: kinah, objetos y servicios. Ni dinero real, ni
// cuentas, ni nada que choque con las normas del foro.
const OFERTAS = [
  // ── Se vende
  { tipo: "vendo", cat: "materiales", item: "Manastones de Ataque x30", cantidad: "30", precio: "1.500.000 kinah el lote", nick: "Kaelith", notas: "Del farmeo de esta semana. Suelto también de 10 en 10 si no quieres el lote entero." },
  { tipo: "vendo", cat: "materiales", item: "Fragmentos de Stigma x50", cantidad: "50", precio: "4.000.000 kinah", nick: "Sombra", notas: "Los tengo repetidos de subir el Daevanion. Acepto cambio por manastones." },
  { tipo: "vendo", cat: "equipo", item: "Set de placas nivel 30 completo", cantidad: "1", precio: "12.000.000 kinah", nick: "Murotempl", notas: "Cinco piezas. Lo suelto porque subí de nivel y ya no me sirve. Se lo puedo enseñar a quien quiera antes." },
  { tipo: "vendo", cat: "equipo", item: "Arco largo +5", cantidad: "1", precio: "8.500.000 kinah", nick: "Flechita", notas: "Subido a pulso, sin romperlo ni una vez. Negociable si te lo llevas hoy." },
  { tipo: "vendo", cat: "consumibles", item: "Pociones de vida grandes x99", cantidad: "99", precio: "900.000 kinah", nick: "Boticario", notas: "Las hago yo. Si necesitas más cantidad, dímelo y las preparo." },
  { tipo: "vendo", cat: "consumibles", item: "Comida de ataque x40", cantidad: "40", precio: "600.000 kinah", nick: "Boticario", notas: "Del mismo lote que las pociones. Precio cerrado si te llevas las dos cosas." },
  { tipo: "vendo", cat: "servicios", item: "Carry de mazmorra para subir de nivel", cantidad: "—", precio: "2.000.000 kinah la vuelta", nick: "Kaelith", notas: "Conmigo y dos más de la legión. Nos conectamos por las tardes, a partir de las 19:00." },
  { tipo: "vendo", cat: "servicios", item: "Crafteo de manastones (pones tú los materiales)", cantidad: "—", precio: "300.000 kinah por tanda", nick: "Yerbabuena", notas: "Tú traes el material y yo lo monto. Si sale fallido no te cobro la tanda." },
  { tipo: "vendo", cat: "otros", item: "Kinah por objetos: cambio lo que tengas", cantidad: "—", precio: "Según lo que traigas", nick: "Nikito", notas: "Ando juntando material de mejora. Enséñame lo que te sobre y te digo cuánto te doy." },

  // ── Se busca
  { tipo: "compro", cat: "materiales", item: "Manastones de Precisión", cantidad: "20", precio: "Pago 1.200.000 kinah", nick: "Sombra", notas: "Me faltan para terminar el set. Pago más si son de las buenas." },
  { tipo: "compro", cat: "equipo", item: "Daga de una mano nivel 25 o más", cantidad: "1", precio: "Hasta 6.000.000 kinah", nick: "Filovil", notas: "Lo que sea que pegue fuerte. Si está mejorada, hablamos del precio." },
  { tipo: "compro", cat: "equipo", item: "Escudo para Templar", cantidad: "1", precio: "Hasta 5.000.000 kinah", nick: "Murotempl", notas: "Estoy montando el personaje de tanque. Me corre prisa antes del fin de semana." },
  { tipo: "compro", cat: "consumibles", item: "Pociones de maná grandes", cantidad: "50", precio: "Pago 800.000 kinah", nick: "Chispas", notas: "Las gasto a puñados. Si eres de los que las craftea, avísame y te compro fijo cada semana." },
  { tipo: "compro", cat: "servicios", item: "Alguien que me suba las habilidades de Cleric", cantidad: "—", precio: "1.500.000 kinah", nick: "Curilla", notas: "Empiezo de cero y me lío con el reparto de PvE y PvP. Pago por que alguien me lo explique jugando." },
  { tipo: "compro", cat: "otros", item: "Compañeros para farmear por la mañana", cantidad: "—", precio: "Repartimos lo que salga", nick: "Madrugador", notas: "Juego de 8:00 a 11:00, que es cuando no hay nadie. Busco dos o tres para hacer grupo fijo." },
];

const NOMBRE_CATEGORIA = {
  equipo: "Equipo",
  materiales: "Materiales",
  consumibles: "Consumibles",
  servicios: "Servicios",
  otros: "Otros",
};

const MARCA = "\n\n*Ejemplo puesto por la organización para estrenar el mercado. Aion 2 abre el 5 de octubre.*";

// Mismo embed que src/lib/discord-mercado.ts. Si cambia allí, cambia aquí.
function embedOferta(o, autorId) {
  const vende = o.tipo === "vendo";
  return {
    title: `${vende ? "💰" : "🔎"} ${o.item}`,
    color: vende ? 0x3ba55d : 0x5865f2,
    description: (o.notas + (SIN_MARCA ? "" : MARCA)).slice(0, 900),
    fields: [
      { name: vende ? "Precio" : "Paga", value: o.precio, inline: true },
      { name: "Cantidad", value: o.cantidad || "1", inline: true },
      { name: "Categoría", value: NOMBRE_CATEGORIA[o.cat], inline: true },
      { name: "Nick en el juego", value: o.nick, inline: true },
      { name: vende ? "Vende" : "Busca", value: `<@${autorId}>`, inline: true },
    ],
    footer: {
      text: "Se cierra sola en 24 horas · Solo trato dentro del juego: nada de dinero real",
    },
  };
}

function botones(autorId) {
  return {
    type: 1,
    components: [
      { type: 2, style: 1, label: "Contactar", custom_id: `mercado:contactar:${autorId}`, emoji: { name: "💬" } },
      { type: 2, style: 2, label: "Ya está cerrada", custom_id: `mercado:cerrar:${autorId}`, emoji: { name: "✅" } },
      { type: 2, style: 4, label: "Reportar", custom_id: `mercado:reportar:${autorId}`, emoji: { name: "⚠️" } },
    ],
  };
}

// ── Deshacer ─────────────────────────────────────────────────────
async function borrar() {
  if (!existsSync(REGISTRO)) {
    console.log("\n  No hay registro de nada sembrado: scripts/data/mercado-sembrado.json no existe.\n");
    return;
  }
  const { temas = [] } = JSON.parse(readFileSync(REGISTRO, "utf8"));
  console.log(`\n  ${temas.length} temas sembrados en el registro.\n`);

  if (!APLICAR) {
    for (const t of temas) console.log(`    se borraría: ${t.titulo}`);
    console.log("\n  Esto es solo una simulación. Para borrarlos de verdad:\n");
    console.log("    node scripts/sembrar-mercado.mjs --borrar --aplicar\n");
    return;
  }

  let fuera = 0;
  for (const t of temas) {
    const res = await discord(`/channels/${t.id}`, "DELETE");
    if (res.ok || res.status === 404) {
      fuera++;
      console.log(`    borrado: ${t.titulo}`);
    } else {
      console.log(`    ⚠️ ${res.status} al borrar ${t.titulo}`);
    }
    await espera(400);
  }
  writeFileSync(REGISTRO, JSON.stringify({ temas: [] }, null, 2));
  console.log(`\n  ✅ ${fuera} de ${temas.length} borrados. El registro queda vacío.\n`);
}

// ── Sembrar ──────────────────────────────────────────────────────
async function sembrar() {
  // Quién figura como autor. Importa más de lo que parece: su id va dentro de
  // los botones, así que es el único que puede cerrarlas y republicarlas, y el
  // que recibe el aviso cuando alguien pulsa "Contactar".
  //
  // Antes esto salía del dueño del servidor, que NO es Miguel: las ofertas
  // habrían quedado a nombre de otra persona y con sus botones.
  const g = await (await discord(`/guilds/${GUILD}`)).json();
  const autorId = argumento("--autor") ?? AUTOR_POR_DEFECTO;

  // Publicar a nombre de alguien que no está en el servidor deja unas fichas
  // que nadie puede cerrar. Mejor enterarse ahora que después.
  const miembro = await discord(`/guilds/${GUILD}/members/${autorId}`);
  if (!miembro.ok) {
    console.error(`\n  El autor ${autorId} no está en el servidor (Discord dice ${miembro.status}).`);
    console.error("  Pásame otro con --autor <id>.\n");
    process.exit(1);
  }
  const quien = await miembro.json();

  const canal = await (await discord(`/channels/${FORO}`)).json();
  const tags = {};
  for (const t of canal.available_tags ?? []) tags[t.name.toLowerCase()] = t.id;

  const activos = await (await discord(`/guilds/${GUILD}/threads/active`)).json();
  const yaHay = (activos.threads ?? []).filter((t) => t.parent_id === FORO).length;

  console.log(`\n  Servidor: ${g.name}`);
  console.log(`  Foro:     ${canal.name}`);
  console.log(`  Autor:    ${quien.nick ?? quien.user.username} (${autorId})`);
  console.log(`  Ahora mismo hay ${yaHay} temas abiertos ahí.\n`);
  console.log(`  Se publicarían ${OFERTAS.length} ofertas:\n`);

  for (const o of OFERTAS) {
    const etiquetas = [o.tipo === "vendo" ? "Vendo" : "Compro", NOMBRE_CATEGORIA[o.cat]];
    const faltan = etiquetas.filter((e) => !tags[e.toLowerCase()]);
    const marca = o.tipo === "vendo" ? "💰" : "🔎";
    console.log(`    ${marca} [${o.tipo === "vendo" ? "Vendo" : "Compro"}] ${o.item}`);
    console.log(`        ${o.precio}  ·  ${NOMBRE_CATEGORIA[o.cat]}  ·  ${o.nick}` + (faltan.length ? `  ⚠️ sin etiqueta: ${faltan.join(", ")}` : ""));
  }

  if (!APLICAR) {
    console.log("\n  ─────────────────────────────────────────────────────");
    console.log("  Esto es SOLO UNA SIMULACIÓN. No se ha tocado Discord.");
    console.log("  ─────────────────────────────────────────────────────\n");
    console.log("  Si te parece bien, para publicarlas de verdad:\n");
    console.log("    node scripts/sembrar-mercado.mjs --aplicar\n");
    console.log("  Y para quitarlas todas después:\n");
    console.log("    node scripts/sembrar-mercado.mjs --borrar --aplicar\n");
    return;
  }

  console.log("\n  Publicando...\n");
  const creados = [];
  for (const o of OFERTAS) {
    const titulo = `[${o.tipo === "vendo" ? "Vendo" : "Compro"}] ${o.item}`.slice(0, 90);
    const etiquetas = [o.tipo === "vendo" ? "Vendo" : "Compro", NOMBRE_CATEGORIA[o.cat]]
      .map((n) => tags[n.toLowerCase()])
      .filter(Boolean);

    const res = await discord(`/channels/${FORO}/threads`, "POST", {
      name: titulo,
      auto_archive_duration: 1440,
      applied_tags: etiquetas,
      message: {
        embeds: [embedOferta(o, autorId)],
        components: [botones(autorId)],
        allowed_mentions: { parse: [] },
      },
    });

    if (!res.ok) {
      console.log(`    ⚠️ ${res.status} en "${o.item}": ${(await res.text()).slice(0, 160)}`);
    } else {
      const hilo = await res.json();
      creados.push({ id: hilo.id, titulo });
      console.log(`    ✅ ${titulo}`);
    }
    // Sin prisa: son quince temas seguidos y Discord se queja si se le insiste.
    await espera(900);
  }

  writeFileSync(REGISTRO, JSON.stringify({ temas: creados, cuando: new Date().toISOString() }, null, 2));
  console.log(`\n  ✅ ${creados.length} de ${OFERTAS.length} publicadas.`);
  console.log(`  Guardadas en scripts/data/mercado-sembrado.json para poder deshacerlo:\n`);
  console.log("    node scripts/sembrar-mercado.mjs --borrar --aplicar\n");
  console.log("  Ojo: caducan solas a las 24 horas, como cualquier oferta.\n");
}

await (BORRAR ? borrar() : sembrar());
