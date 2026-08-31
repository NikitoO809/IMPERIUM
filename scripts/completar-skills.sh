#!/usr/bin/env bash
# Da varias pasadas al descargador hasta completar todas las clases.
# Cada pasada solo reintenta lo que falta, y entre pasadas espera para que
# el antibot del sitio se relaje.
cd "$(dirname "$0")/.." || exit 1

CLASES="templar assassin ranger sorcerer elementalist cleric chanter"
PASADAS=5

for pasada in $(seq 1 $PASADAS); do
  echo ""
  echo "════════ PASADA $pasada de $PASADAS ════════"
  completas=0
  for c in $CLASES; do
    f="scripts/data/skills-$c.json"
    if [ -f "$f" ]; then
      faltan=$(node -e "const s=require('./$f');console.log(s.filter(x=>!x.descripcion).length)")
      if [ "$faltan" = "0" ]; then
        echo "$c: completa"
        completas=$((completas + 1))
        continue
      fi
      echo "$c: faltan $faltan"
    fi
    node scripts/bajar-skills-aion2.mjs "$c" 2>&1 | tail -2
    sleep 45
  done
  if [ "$completas" = "7" ]; then
    echo ""
    echo "TODAS LAS CLASES COMPLETAS"
    break
  fi
  [ "$pasada" -lt "$PASADAS" ] && sleep 240
done

echo ""
echo "════════ ESTADO FINAL ════════"
for c in gladiator $CLASES; do
  f="scripts/data/skills-$c.json"
  [ -f "$f" ] && node -e "
const s=require('./$f');
const b=s.filter(x=>x.descripcion).length;
console.log('$c'.padEnd(14)+b+' / '+s.length+(b===s.length?'   completa':''));
"
done
