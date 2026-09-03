// Publica una guía de varios mensajes en un foro de Discord, sin imágenes.
//
//   node scripts/publicar-post-foro.mjs scripts/data/mi-guia.json            (simula)
//   node scripts/publicar-post-foro.mjs scripts/data/mi-guia.json --aplicar
//
// El fichero es: { "foro", "titulo", "etiquetas": [...], "mensajes": [...] }
//
// Cada mensaje puede ser un texto suelto, o { "texto": "...", "imagen": "ruta" }
// si lleva una imagen debajo.
//
// El primer mensaje abre la publicación y los demás van detrás, en el mismo
// hilo. Se parte en varios porque Discord no deja pasar de 2000 caracteres por
// mensaje, y una guía entera nunca cabe en uno.
//
// Hermano de publicar-guia.mjs, que hace lo mismo pero exige una imagen por
// sección. Este sirve cuando solo hay texto.
import fs from "node:fs";

const [FICHERO] = process.argv.slice(2);
const APLICAR = process.argv.includes("--aplicar");

if (!FICHERO || FICHERO.startsWith("--")) {
  console.error("\n  uso: node scripts/publicar-post-foro.mjs <guia.json> [--aplicar]\n");
  process.exit(1);
}

const env = Object.fromEntries(
  fs
    .readFileSync(".env.local", "utf8")
    .split(/\r?\n/)
    .filter((l) => l.includes("=") && !l.startsWith("#"))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, "")];
    })
);
const H = {
  Authorization: "Bot " + env.DISCORD_BOT_TOKEN,
  "Content-Type": "application/json",
  "X-Audit-Log-Reason": "Guía publicada en el foro, pedida por Miguel",
};
const api = (r, o) => fetch(`https://discord.com/api/v10${r}`, { headers: H, ...o });

const LIMITE = 2000; // tope de caracteres por mensaje en Discord
const guia = JSON.parse(fs.readFileSync(FICHERO, "utf8"));

// Cada mensaje puede venir como texto suelto o como { texto, imagen }.
const partes = guia.mensajes.map((m) => (typeof m === "string" ? { texto: m } : m));

// Comprobar antes de tocar nada: un mensaje que se pase corta la guía a medias,
// y una imagen que falte deja el hilo publicado a trozos.
let malos = 0;
partes.forEach((m, i) => {
  if (m.texto.length > LIMITE) {
    console.error(`  el mensaje ${i + 1} tiene ${m.texto.length} caracteres (máximo ${LIMITE})`);
    malos++;
  }
  if (m.imagen && !fs.existsSync(m.imagen)) {
    console.error(`  no encuentro la imagen del mensaje ${i + 1}: ${m.imagen}`);
    malos++;
  }
});
if (guia.titulo.length > 100) {
  console.error(`  el título tiene ${guia.titulo.length} caracteres (máximo 100)`);
  malos++;
}
if (malos) process.exit(1);

const foro = await (await api(`/channels/${guia.foro}`)).json();
if (foro.type !== 15) {
  console.error(`\n  ${foro.name ?? guia.foro} no es un foro (tipo ${foro.type}).\n`);
  process.exit(1);
}
const tags = (guia.etiquetas ?? [])
  .map((n) => ({ nombre: n, id: foro.available_tags.find((t) => `${t.emoji_name ?? ""} ${t.name}`.trim() === n || t.name === n)?.id }))
  .filter((t) => {
    if (!t.id) console.error(`  aviso: la etiqueta "${t.nombre}" no existe en el foro, se ignora`);
    return t.id;
  });

console.log(`\n  foro     : ${foro.name}`);
console.log(`  título   : ${guia.titulo}`);
console.log(`  etiquetas: ${tags.map((t) => t.nombre).join(", ") || "(ninguna)"}`);
console.log(`  mensajes : ${partes.length}`);
partes.forEach((m, i) =>
  console.log(
    `      ${i + 1}. ${String(m.texto.length).padStart(4)} caracteres${m.imagen ? " + imagen" : "         "} — ${m.texto.slice(0, 48).replace(/\n/g, " ")}…`
  )
);

if (!APLICAR) {
  console.log("\n  (simulación: añade --aplicar)\n");
  process.exit(0);
}

// Con imagen hay que mandar el mensaje como formulario (multipart) en vez de
// como JSON: el JSON viaja dentro, en el campo payload_json.
const conImagen = (cuerpo, ruta) => {
  const form = new FormData();
  const nombre = ruta.split(/[\\/]/).pop();
  form.append("files[0]", new Blob([fs.readFileSync(ruta)]), nombre);
  form.append("payload_json", JSON.stringify(cuerpo));
  // Sin Content-Type a propósito: lo pone fetch con su separador.
  const { "Content-Type": _, ...cabeceras } = H;
  return { method: "POST", headers: cabeceras, body: form };
};

// Abrir la publicación con el primer mensaje.
const cuerpoInicial = {
  name: guia.titulo,
  applied_tags: tags.map((t) => t.id),
  message: { content: partes[0].texto, allowed_mentions: { parse: [] } },
};
const res = partes[0].imagen
  ? await fetch(`https://discord.com/api/v10/channels/${guia.foro}/threads`, conImagen(cuerpoInicial, partes[0].imagen))
  : await api(`/channels/${guia.foro}/threads`, { method: "POST", body: JSON.stringify(cuerpoInicial) });
if (!res.ok) {
  console.error(`\n  FALLO ${res.status} al abrir la publicación: ${(await res.text()).slice(0, 300)}\n`);
  process.exit(1);
}
const hilo = await res.json();
console.log(`\n  publicación abierta: ${hilo.name}  (id ${hilo.id})`);

// Y el resto, detrás.
for (let i = 1; i < partes.length; i++) {
  const cuerpo = { content: partes[i].texto, allowed_mentions: { parse: [] } };
  const r = partes[i].imagen
    ? await fetch(`https://discord.com/api/v10/channels/${hilo.id}/messages`, conImagen(cuerpo, partes[i].imagen))
    : await api(`/channels/${hilo.id}/messages`, { method: "POST", body: JSON.stringify(cuerpo) });
  console.log(
    r.ok
      ? `  mensaje ${i + 1} de ${partes.length} publicado${partes[i].imagen ? " (con imagen)" : ""}`
      : `  FALLO ${r.status} en el mensaje ${i + 1}: ${(await r.text()).slice(0, 200)}`
  );
  await new Promise((s) => setTimeout(s, 500));
}

console.log(`\n  listo: https://discord.com/channels/${env.DISCORD_GUILD_ID}/${hilo.id}`);
console.log(`  para borrarla, abre el hilo en Discord y elimínalo (o DELETE /channels/${hilo.id}).\n`);
