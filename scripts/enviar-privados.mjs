// Reparte un anuncio por MENSAJE PRIVADO a los miembros de un rol.
//
// Esto se ejecuta en TU ORDENADOR, no en la web, y esa es toda la gracia:
// la web se corta al minuto, y Discord frena los envíos masivos hasta hacer
// que cada privado tarde varios segundos. Aquí no hay prisa ni límite.
//
// Además APUNTA a quién ya le escribió. Si se corta (se va la luz, cierras la
// ventana, lo que sea), lo vuelves a lanzar y sigue por donde iba: nadie
// recibe el mensaje dos veces.
//
//   npm run discord:privados -- --rol "AION 2" --mensaje scripts/data/anuncio.json
//   npm run discord:privados -- --rol "AION 2" --mensaje ... --de-verdad
//
// Sin --de-verdad hace un ENSAYO: dice a cuánta gente escribiría y no manda nada.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createInterface } from "node:readline/promises";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const API = "https://discord.com/api/v10";

// Ritmo de envío. Discord frena antes o después; cuando lo hace, dice cuánto
// hay que esperar y aquí se le hace caso sin rechistar.
const PAUSA_MS = 900;
const ESPERA_MAXIMA_MS = 120_000;

// ── Utilidades ───────────────────────────────────────────────────

function cargarEnv() {
  const env = {};
  try {
    for (const linea of readFileSync(join(RAIZ, ".env.local"), "utf8").split("\n")) {
      const m = linea.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m) env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
    }
  } catch {
    /* sin .env.local */
  }
  return env;
}

function argumentos() {
  const args = {};
  const lista = process.argv.slice(2);
  for (let i = 0; i < lista.length; i++) {
    if (!lista[i].startsWith("--")) continue;
    const clave = lista[i].slice(2);
    const valor = lista[i + 1] && !lista[i + 1].startsWith("--") ? lista[++i] : true;
    args[clave] = valor;
  }
  return args;
}

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

function reloj(segundos) {
  const m = Math.floor(segundos / 60);
  const s = Math.round(segundos % 60);
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

// ── Arranque ─────────────────────────────────────────────────────

const env = cargarEnv();
const TOKEN = env.DISCORD_BOT_TOKEN;
const GUILD = env.DISCORD_GUILD_ID;
const args = argumentos();

if (!TOKEN || !GUILD) {
  console.error("\n  Faltan DISCORD_BOT_TOKEN o DISCORD_GUILD_ID en .env.local\n");
  process.exit(1);
}
if (!args.rol || !args.mensaje) {
  console.error(
    "\n  Uso:\n" +
      '    npm run discord:privados -- --rol "AION 2" --mensaje scripts/data/anuncio.json\n\n' +
      "  Añade --de-verdad para enviar. Sin eso solo hace un ensayo.\n"
  );
  process.exit(1);
}

const CABECERAS = {
  Authorization: `Bot ${TOKEN}`,
  "User-Agent": "IMPERIUM (https://comunidad-imp.com, 1.0)",
  "Content-Type": "application/json",
};

async function api(ruta, opciones = {}) {
  return fetch(API + ruta, { ...opciones, headers: { ...CABECERAS, ...opciones.headers } });
}

// Llama a Discord respetando sus frenazos: si dice "espera X", se espera X.
async function conFreno(hacer) {
  for (let intento = 0; intento < 5; intento++) {
    const res = await hacer();
    if (res.status !== 429) return res;
    const datos = await res.clone().json().catch(() => ({}));
    const espera = Math.min((datos.retry_after ?? 5) * 1000 + 500, ESPERA_MAXIMA_MS);
    process.stdout.write(`\n  Discord pide esperar ${reloj(espera / 1000)}… `);
    await esperar(espera);
  }
  return hacer();
}

// ── Datos ────────────────────────────────────────────────────────

const anuncio = JSON.parse(readFileSync(join(RAIZ, args.mensaje), "utf8"));

const roles = await (await api(`/guilds/${GUILD}/roles`)).json();
const rol = roles.find((r) => r.name === args.rol || r.id === args.rol);
if (!rol) {
  console.error(`\n  No existe ningún rol llamado "${args.rol}".\n`);
  process.exit(1);
}

// Miembros del rol, en orden estable.
const destinatarios = [];
let after = "0";
for (;;) {
  const pagina = await (await api(`/guilds/${GUILD}/members?limit=1000&after=${after}`)).json();
  if (!Array.isArray(pagina) || pagina.length === 0) break;
  for (const m of pagina) {
    if (m.user?.id && !m.user.bot && m.roles?.includes(rol.id)) destinatarios.push(m.user.id);
  }
  after = pagina[pagina.length - 1].user.id;
  if (pagina.length < 1000) break;
}

// ── Memoria de a quién ya se le escribió ─────────────────────────
const CARPETA = join(RAIZ, "scripts", "data");
const REGISTRO = join(CARPETA, `privados-${rol.id}.json`);
if (!existsSync(CARPETA)) mkdirSync(CARPETA, { recursive: true });

let hechos = { entregados: [], cerrados: [], errores: [] };
if (existsSync(REGISTRO)) hechos = JSON.parse(readFileSync(REGISTRO, "utf8"));

const yaTratados = new Set([...hechos.entregados, ...hechos.cerrados, ...hechos.errores]);
const pendientes = destinatarios.filter((id) => !yaTratados.has(id));

console.log(`\n  Rol:          ${rol.name}`);
console.log(`  Miembros:     ${destinatarios.length}`);
if (yaTratados.size > 0) {
  console.log(`  Ya tratados:  ${yaTratados.size} (de un reparto anterior, no repiten)`);
}
console.log(`  Por enviar:   ${pendientes.length}`);
console.log(`  Tiempo aprox: ${reloj((pendientes.length * PAUSA_MS) / 1000)} (más los frenazos de Discord)\n`);

if (pendientes.length === 0) {
  console.log("  No queda nadie por recibirlo.\n");
  process.exit(0);
}

if (!args["de-verdad"]) {
  console.log("  ENSAYO: no se ha enviado nada. Añade --de-verdad para enviar.\n");
  process.exit(0);
}

// Última oportunidad de echarse atrás.
const rl = createInterface({ input: process.stdin, output: process.stdout });
const respuesta = await rl.question(`  ¿Enviar a ${pendientes.length} personas? (escribe SI) `);
rl.close();
if (respuesta.trim().toUpperCase() !== "SI") {
  console.log("\n  Cancelado. No se ha enviado nada.\n");
  process.exit(0);
}

// ── El mensaje ───────────────────────────────────────────────────

function construirMensaje() {
  const color = parseInt((anuncio.color ?? "#7c5cff").replace(/^#/, ""), 16);
  const cuerpo = {
    content: anuncio.title ? "" : anuncio.body,
    embeds: anuncio.title
      ? [
          {
            title: anuncio.title,
            description: anuncio.body || undefined,
            color: Number.isFinite(color) ? color : 0x7c5cff,
            url: anuncio.linkUrl || undefined,
            image: anuncio.imageUrl ? { url: anuncio.imageUrl } : undefined,
          },
        ]
      : [],
    allowed_mentions: { parse: [] },
  };
  if (anuncio.botonRol) {
    cuerpo.components = [
      {
        type: 1,
        components: [
          {
            type: 2,
            style: 1,
            label: anuncio.botonTexto || "Me apunto",
            custom_id: `apuntarse:${anuncio.botonRol}:${GUILD}`,
            emoji: { name: "✅" },
          },
        ],
      },
    ];
  }
  return cuerpo;
}

const MENSAJE = construirMensaje();

async function enviarA(userId) {
  const canal = await conFreno(() =>
    api("/users/@me/channels", { method: "POST", body: JSON.stringify({ recipient_id: userId }) })
  );
  if (canal.status === 403) return "cerrados";
  if (!canal.ok) return "errores";
  const { id } = await canal.json();
  if (!id) return "errores";

  const res = await conFreno(() =>
    api(`/channels/${id}/messages`, { method: "POST", body: JSON.stringify(MENSAJE) })
  );
  if (res.ok) return "entregados";
  return res.status === 403 ? "cerrados" : "errores";
}

// Guarda el avance en cada envío: si esto se corta, no se pierde nada.
function guardar() {
  writeFileSync(REGISTRO, JSON.stringify(hechos), "utf8");
}

process.on("SIGINT", () => {
  guardar();
  console.log("\n\n  Parado. El avance queda guardado: relanza el comando y sigue donde iba.\n");
  process.exit(0);
});

// ── Reparto ──────────────────────────────────────────────────────

const arranque = Date.now();
console.log("");

for (let i = 0; i < pendientes.length; i++) {
  const id = pendientes[i];
  const resultado = await enviarA(id);
  hechos[resultado].push(id);
  guardar();

  const hecho = i + 1;
  const ritmo = (Date.now() - arranque) / hecho / 1000;
  const queda = reloj(ritmo * (pendientes.length - hecho));
  process.stdout.write(
    `\r  ${hecho}/${pendientes.length} · ${hechos.entregados.length} entregados · ` +
      `${hechos.cerrados.length} con el privado cerrado · queda ${queda}     `
  );

  await esperar(PAUSA_MS);
}

console.log(`\n\n  Terminado en ${reloj((Date.now() - arranque) / 1000)}`);
console.log(`    Entregados:          ${hechos.entregados.length}`);
console.log(`    Con privados cerrados: ${hechos.cerrados.length}`);
console.log(`    Fallidos:            ${hechos.errores.length}`);
console.log(`\n  Registro guardado en ${REGISTRO}\n`);
