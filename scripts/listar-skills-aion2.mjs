// Saca la lista de habilidades (id, nombre, icono) de cada clase de Aion 2.
// Escribe scripts/data/lista-skills.json
import fs from 'node:fs'

const API = (process.env.FIRECRAWL_API_URL ?? 'https://api.firecrawl.dev').replace(/\/$/, '')
const CLAVE = process.env.FIRECRAWL_API_KEY
if (!CLAVE) { console.error('falta FIRECRAWL_API_KEY'); process.exit(1) }

const CLASES = ['templar', 'assassin', 'ranger', 'sorcerer', 'elementalist', 'cleric', 'chanter']
const BLOQUEADA = /security service to protect itself|Cloudflare Ray ID|Just a moment/i

async function render(url, proxy) {
  const r = await fetch(`${API}/v1/scrape`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${CLAVE}` },
    body: JSON.stringify({ url, formats: ['markdown'], onlyMainContent: true, waitFor: 5000, maxAge: 0, ...(proxy ? { proxy } : {}) }),
  })
  if (!r.ok) throw new Error(`${r.status}`)
  const md = (await r.json())?.data?.markdown ?? ''
  if (BLOQUEADA.test(md)) throw new Error('Cloudflare')
  return md
}

async function conReintento(url) {
  try { return await render(url) } catch (e) {
    if (!/Cloudflare|429|500/.test(e.message)) throw e
    for (const espera of [4000, 10000, 20000]) {
      await new Promise((r) => setTimeout(r, espera))
      try { return await render(url, 'stealth') } catch { /* sigue */ }
    }
    throw new Error('bloqueada tras varios intentos')
  }
}

// Las filas vienen como: [![Nombre](.../ICONO.webp)...  Nombre](.../db/skill/ID)
const FILA = /!\[([^\]]+)\]\([^)]*\/Skill\/([A-Za-z0-9_]+)\.webp\)[\s\S]*?\/db\/skill\/(\d+)\)/g

// se conserva lo ya sacado: solo se reintentan las clases que fallaron
const RUTA = 'scripts/data/lista-skills.json'
const salida = fs.existsSync(RUTA) ? JSON.parse(fs.readFileSync(RUTA, 'utf8')) : {}

for (const clase of CLASES) {
  if (salida[clase]?.length) { console.log(`${clase.padEnd(14)} ya la tenia (${salida[clase].length})`); continue }
  try {
    const md = await conReintento(`https://questlog.gg/aion-2/en/db/skills/${clase}`)
    const vistos = new Map()
    for (const m of md.matchAll(FILA)) {
      const [, nombre, icono, id] = m
      if (!vistos.has(id)) vistos.set(id, { id, nombre: nombre.trim(), icono })
    }
    salida[clase] = [...vistos.values()]
    console.log(`${clase.padEnd(14)} ${salida[clase].length} habilidades`)
  } catch (e) {
    console.log(`${clase.padEnd(14)} FALLO: ${e.message}`)
    salida[clase] = []
  }
  await new Promise((r) => setTimeout(r, 2000))
}

fs.mkdirSync('scripts/data', { recursive: true })
fs.writeFileSync('scripts/data/lista-skills.json', JSON.stringify(salida, null, 1), 'utf8')
const total = Object.values(salida).reduce((n, v) => n + v.length, 0)
console.log(`\ntotal ${total} habilidades -> scripts/data/lista-skills.json`)
