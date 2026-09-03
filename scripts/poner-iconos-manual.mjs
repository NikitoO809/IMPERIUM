// Rellena el campo `icono` de cada habilidad del Manual de Atreia.
//
// Cruza el nombre coreano que ya lleva cada skill (`ko`) con los mapas que
// genera scripts/iconos-aion2.mjs, y escribe la URL del icono al lado. Se
// escribe en el fichero de datos (y no en un mapa global que cargue el
// navegador) para que solo viajen los iconos que de verdad se usan.
//
// El coreano se compara sin espacios: la guia escribe 검기난무 y el volcado
// 검기 난무, y es la misma habilidad.
//
// Uso: node scripts/poner-iconos-manual.mjs            (todas las guias)
//      node scripts/poner-iconos-manual.mjs gladiator  (solo una)
import fs from 'node:fs'
import path from 'node:path'

const DIR_DATOS = 'scripts/data'
const DIR_MANUAL = 'src/lib/manual'

// ---- 1. un solo mapa con todas las clases, con la clave sin espacios
const limpio = (s) => s.replace(/\s+/g, '')
const mapa = new Map()
for (const f of fs.readdirSync(DIR_DATOS).filter((f) => /^iconos-.*\.json$/.test(f))) {
  const clase = f.replace(/^iconos-|\.json$/g, '')
  for (const [ko, v] of Object.entries(JSON.parse(fs.readFileSync(path.join(DIR_DATOS, f), 'utf8')))) {
    if (v.icono && !mapa.has(limpio(ko))) mapa.set(limpio(ko), { ...v, clase, ko })
  }
}
console.log(`${mapa.size} habilidades con icono en ${DIR_DATOS}\n`)

// ---- 2. reescribir cada guia
const soloEsta = process.argv[2]
const guias = fs
  .readdirSync(DIR_MANUAL)
  .filter((f) => f.endsWith('.ts') && !['index.ts', 'tipos.ts'].includes(f))
  .filter((f) => !soloEsta || f === `${soloEsta}.ts`)

for (const f of guias) {
  const ruta = path.join(DIR_MANUAL, f)
  let src = fs.readFileSync(ruta, 'utf8')
  let puestos = 0
  const faltan = new Set()

  const icono = (ko) => {
    const dato = mapa.get(limpio(ko))
    if (!dato) faltan.add(ko)
    else puestos++
    return dato?.icono
  }

  // El `ko` aparece de dos maneras, y se cubren las dos. Si ya habia icono, se
  // reescribe: asi el script se puede repasar cuando cambie el volcado.
  //
  // a) en su propia linea, en las fichas de habilidad
  src = src.replace(/ko: "([^"]+)",(\r?\n *)(?:icono: "[^"]*",\r?\n *)?/g, (todo, ko, sep) => {
    const url = icono(ko)
    return url ? `ko: "${ko}",${sep}icono: "${url}",${sep}` : todo
  })
  // b) dentro de un objeto de una linea, en los pasos de rotacion
  src = src.replace(/ko: "([^"]+)"(?:, icono: "[^"]*")? \}/g, (todo, ko) => {
    const url = icono(ko)
    return url ? `ko: "${ko}", icono: "${url}" }` : todo
  })

  fs.writeFileSync(ruta, src, 'utf8')
  console.log(`${f}: ${puestos} iconos${faltan.size ? `, sin icono: ${[...faltan].join(', ')}` : ''}`)
}
