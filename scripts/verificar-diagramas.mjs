// Verifica los DIAGRAMAS de las guías sin tener que mirarlos: los generadores de
// clase_*.py llevan los datos escritos a mano, así que se leen del propio código
// y se contrastan con el volcado del cliente.
//
// Hace falta porque el verificador de guías solo lee el texto de Discord, y los
// errores de las imágenes (que es donde estaban) no los ve nadie.
//
// Uso: node scripts/verificar-diagramas.mjs [clase]
import fs from 'node:fs'

const SOLO = process.argv[2]?.toLowerCase()
const GENERADOR = {
  templar: 'clase_templar.py', assassin: 'clase_assassin.py', ranger: 'clase_ranger.py',
  sorcerer: 'clase_sorcerer.py', elementalist: 'clase_spiritmaster.py',
  cleric: 'clase_cleric.py', chanter: 'clase_chanter.py',
}

const seg = (cd) => {
  const m = String(cd).match(/^(\d+(?:[.,]\d+)?)\s*(s|min)?$/)
  if (!m) return null
  return Number(m[1].replace(',', '.')) * (m[2] === 'min' ? 60 : 1)
}

let malos = 0, dudosos = 0, ok = 0
for (const [clase, fichero] of Object.entries(GENERADOR)) {
  if (SOLO && clase !== SOLO) continue
  const ruta = `scripts/guias/${fichero}`
  const datos = `scripts/data/skills-t-${clase}.json`
  if (!fs.existsSync(ruta) || !fs.existsSync(datos)) { console.log(`\n${clase}: falta ${ruta} o ${datos}`); continue }

  const src = fs.readFileSync(ruta, 'utf8')
  const skills = new Map()
  for (const k of JSON.parse(fs.readFileSync(datos, 'utf8'))) {
    const antes = skills.get(k.nombre)
    if (!antes || k.specialty.length > antes.specialty.length) skills.set(k.nombre, k)
  }

  console.log(`\n═══ ${clase} · ${fichero} ═══`)

  // 1. las tuplas ('Nombre', 'recarga', 'texto')
  for (const m of src.matchAll(/\(\s*'([^']{4,})',\s*'([^']*)',\s*'((?:[^']|\\')*)'\s*\)/g)) {
    const [, nombre, cd] = m
    const k = skills.get(nombre)
    if (!k) { console.log(`  ??  «${nombre}» no existe con ese nombre en los datos`); dudosos++; continue }
    const dice = seg(cd), real = seg(String(k.cooldown ?? '').replace('s', ''))
    if (/sin recarga/i.test(cd)) {
      if (k.cooldown) { console.log(`  !!  ${nombre}: pone «sin recarga» y tiene ${k.cooldown}`); malos++ }
      else ok++
      continue
    }
    if (dice == null || real == null) { ok++; continue }
    if (dice !== real) { console.log(`  !!  ${nombre}: el diagrama dice ${cd} y la recarga es ${k.cooldown}`); malos++ }
    else ok++
  }

  // 1b. las tuplas de mejoras: ('Nombre', 16, 'lo que hace')
  for (const m of src.matchAll(/\(\s*'([^']{4,})',\s*(\d+),\s*'((?:[^']|\\')*)'\s*\)/g)) {
    const [, nombre, nivel] = m
    const k = skills.get(nombre)
    if (!k) { console.log(`  ??  «${nombre}» no existe con ese nombre en los datos`); dudosos++; continue }
    if (!k.specialty.some((s) => s.nivel === Number(nivel))) {
      console.log(`  !!  ${nombre} nv.${nivel} no existe · tiene ${k.specialty.map((s) => s.nivel).join(', ')}`)
      malos++
    } else ok++
  }

  // 2. «mejora de nivel N» / «nivel N» junto a un nombre de habilidad
  for (const m of src.matchAll(/([A-Z][A-Za-z':\s]{3,30}?)\s+(?:tiene\s+)?(?:su\s+)?mejora de nivel (\d+)|([A-Z][A-Za-z':\s]{3,30}?)\s+(?:a\s+)?nivel (\d+)/g)) {
    const nombre = (m[1] ?? m[3] ?? '').trim()
    const nv = Number(m[2] ?? m[4])
    const k = skills.get(nombre)
    if (!k) continue
    if (!k.specialty.some((s) => s.nivel === nv)) {
      console.log(`  !!  ${nombre} nv.${nv} no existe · tiene ${k.specialty.map((s) => s.nivel).join(', ')}`)
      malos++
    } else ok++
  }

  // 3. Terminología que ya se dio por corregida y puede haber quedado aquí.
  //    No cuentan los nombres internos ('tipo': 'stigmas', 'x4-stigmas.png') ni
  //    hablar del árbol Stigma, que ahora sí es lo correcto.
  const interno = (linea) => /'tipo':|'archivo':|-stigmas\.png/.test(linea)
  const arbol = (linea) => /en Stigma|árbol Stigma|las? Stigma\b/.test(linea)
  for (const mal of [/\bstigmas?\b/gi, /\d+\s*puntos\b/gi, /questlog/gi]) {
    for (const m of src.matchAll(mal)) {
      const nLinea = src.slice(0, m.index).split('\n').length
      const linea = src.split('\n')[nLinea - 1] ?? ''
      if (interno(linea) || arbol(linea)) continue
      console.log(`  ~~  línea ${nLinea}: «${m[0]}» — revisar (¿mejora, no «stigma»? ¿nivel, no «puntos»?)`)
      dudosos++
    }
  }
}
console.log(`\n${malos} datos mal · ${dudosos} para mirar a mano · ${ok} comprobados y correctos`)
