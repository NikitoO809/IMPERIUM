# El mercado de Aion 2

Un foro donde la gente publica lo que vende o lo que busca **dentro del juego**,
con `/vendo` y `/compro`. Las fichas las escribe el bot: así todas tienen la
misma forma, se filtran por etiqueta y se cierran solas a las 24 horas.

Nada de dinero real: ni oro, ni cuentas, ni objetos por euros. Lo dice la guía
del canal y el pie de cada oferta.

## Ponerlo en marcha (una vez)

1. **Crear el foro.** Primero en seco, para ver qué va a hacer:

   ```
   npm run discord:mercado
   node scripts/crear-foro-mercado.mjs --aplicar
   ```

   Al terminar imprime el id del canal.

2. **Guardar el id** en `.env.local` y en Vercel:

   ```
   DISCORD_FORO_MERCADO=<el id que ha impreso>
   ```

3. **En Vercel, además:**
   - `DISCORD_GUILD_ID` — hasta ahora solo estaba en local; la limpieza diaria
     lo necesita para saber qué temas hay abiertos.
   - `CRON_SECRET` — cualquier cadena larga inventada. Es la llave de la tarea
     diaria: sin ella, `/api/discord/mercado-caducar` no responde a nadie.
   - `DISCORD_CANAL_REPORTES=1543667200295174294` — el canal privado
     `『🚨』reportes-mercado`, donde caen los avisos del botón ⚠️. Lo creó
     `scripts/crear-canal-reportes.mjs`. Sin esta variable, el botón se limita a
     decirle a quien lo pulsa que hable con un oficial.

4. **Registrar los comandos:** `npm run discord:comandos`

5. **Dárselos al rol.** Ajustes del servidor → Integraciones → IMPERIUM →
   Comandos → `/vendo` y `/compro` → permitir al rol `AION 2`. Salen con
   permisos de administrador por defecto justo para que no aparezcan de golpe a
   los 1.200 miembros.

## Cómo funciona por dentro

| Pieza | Dónde |
|---|---|
| Toda la lógica | `src/lib/discord-mercado.ts` |
| Los comandos entran por | `src/app/api/discord/interactions/route.ts` |
| La limpieza diaria | `src/app/api/discord/mercado-caducar/route.ts` + `vercel.json` |
| El canal se crea con | `scripts/crear-foro-mercado.mjs` |
| El canal de reportes | `scripts/crear-canal-reportes.mjs` |

**No hay base de datos**, igual que el resto del bot. El estado de una oferta es
su etiqueta en el foro: sin etiqueta está abierta, con `Cerrada` la cerró quien
la publicó, con `Caducada` se le pasó el tiempo. Quién la publicó viaja dentro
del `custom_id` de sus botones, que es lo único que Discord devuelve al pulsar.

Las etiquetas se buscan **por nombre**: si renombras una en Discord, deja de
aplicarse. Los nombres están en `discord-mercado.ts` y en el script del canal, y
tienen que coincidir letra por letra.

## Lo que todavía no hace

- **La caducidad depende de que el foro tenga movimiento.** La pasada diaria
  (`vercel.json`) es el suelo; lo que de verdad mantiene el foro al día es el
  barrido que va detrás de cada oferta nueva, con un tope de 10 por vez. Si el
  plan de Vercel admite crons más frecuentes, subir la frecuencia en
  `vercel.json` lo hace innecesario.
- **No hay límite de ofertas por persona.** Sin base de datos no se puede saber
  cuántas tiene abiertas alguien: los temas los publica el bot, así que Discord
  no lo distingue. Con la caducidad de 24 horas se aguanta; si alguien empieza a
  inundar el foro, hace falta la fase 2.
- **No hay reputación ni lista negra.** Es la fase 2, y sí necesita Supabase:
  guardar los tratos cerrados y quién quedó bien con quién.
