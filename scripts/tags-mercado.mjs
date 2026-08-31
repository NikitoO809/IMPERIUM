// Saca los ids de las etiquetas del foro del mercado.
//
//   npm run discord:tags
//
// Imprime la línea lista para pegar en .env.local y en Vercel. Con esos ids
// puestos, renombrar una etiqueta desde Discord ya no rompe el mercado: hasta
// ahora se buscaban por su nombre y, si no cuadraba, las ofertas salían sin
// etiquetar y nadie se enteraba.
//
// No cambia nada en Discord: solo lee.
import { readFileSync } from "node:fs";

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

if (!TOKEN || !FORO) {
  console.error(
    "\n  Faltan datos en .env.local.\n" +
      "  Necesito DISCORD_BOT_TOKEN y DISCORD_FORO_MERCADO.\n"
  );
  process.exit(1);
}

// Las que el código usa por su nombre. Si alguna no aparece en el foro, es que
// la han renombrado o borrado, y eso es justo lo que hay que ver aquí.
const ESPERADAS = [
  "Vendo",
  "Compro",
  "Cerrada",
  "Caducada",
  "Equipo",
  "Materiales",
  "Consumibles",
  "Servicios",
  "Otros",
];

const res = await fetch(`https://discord.com/api/v10/channels/${FORO}`, {
  headers: { Authorization: `Bot ${TOKEN}` },
});

if (!res.ok) {
  console.error(`\n  Discord ha contestado ${res.status}: ${await res.text()}\n`);
  process.exit(1);
}

const canal = await res.json();
const etiquetas = canal.available_tags ?? [];

console.log(`\n  Foro: ${canal.name}`);
console.log(`  Etiquetas encontradas: ${etiquetas.length}\n`);

for (const t of etiquetas) {
  console.log(`    ${t.name.padEnd(16)} ${t.id}`);
}

// ¿Está todo lo que el código espera?
const porNombre = new Map(etiquetas.map((t) => [t.name.toLowerCase(), t.id]));
const faltan = ESPERADAS.filter((n) => !porNombre.has(n.toLowerCase()));

if (faltan.length) {
  console.log(`\n  ⚠️  El código busca estas y NO están en el foro:\n`);
  for (const n of faltan) console.log(`    ${n}`);
  console.log(
    "\n  O las han renombrado, o se borraron. Mientras falten, las ofertas\n" +
      "  salen sin esa etiqueta. Créalas con el mismo nombre, o cambia el\n" +
      "  nombre en src/lib/discord-mercado.ts.\n"
  );
} else {
  console.log("\n  ✅ Están las nueve que usa el código.\n");
}

// La línea para pegar: solo las que el código busca, que son las que importan.
const pares = ESPERADAS.filter((n) => porNombre.has(n.toLowerCase())).map(
  (n) => `${n}=${porNombre.get(n.toLowerCase())}`
);

console.log("  Pega esto en .env.local y en Vercel:\n");
console.log(`DISCORD_MERCADO_TAGS=${pares.join(",")}\n`);
