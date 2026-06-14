# IMPERIUM — Especificación para Claude Code

Este documento tiene dos usos:

1. **Guárdalo como `CLAUDE.md`** en la raíz de tu proyecto. Claude Code lo lee automáticamente en cada sesión y mantiene el rumbo.
2. **Usa los "Prompts por fase"** del final: cópialos y pégalos uno a uno en Claude Code, en orden. No le pidas todo de golpe.

---

## 1. Contexto del proyecto

IMPERIUM es una comunidad de Discord. Vamos a construir su sitio web. El sitio aloja **guías de juego interactivas** (la primera es Call of Dragons), con un sistema de **login**, un **panel de administración**, y una parte **social**: los usuarios que juegan al mismo juego pueden verse entre sí y ver el avance de cada uno.

La interfaz es **en español**. El diseño debe ser limpio y **funcionar bien en móvil** (la comunidad usará el sitio sobre todo desde el teléfono).

---

## 2. Stack técnico (no cambiar sin avisar)

- **Framework:** Next.js (App Router) con TypeScript.
- **Estilos:** Tailwind CSS.
- **Backend / base de datos / auth:** Supabase (Postgres + Auth + Realtime + Row Level Security).
- **Login:** únicamente con **Discord OAuth** a través de Supabase Auth. No construir registro con email/contraseña.
- **Hospedaje previsto:** Vercel (web) + Supabase (backend).

---

## 3. Reglas y restricciones (importantes)

- **Contenido de las guías NO inventado.** Claude Code construye la *estructura* (tablas, formularios, vistas), pero **no debe rellenar datos de Call of Dragons inventados**. El contenido real lo cargará el administrador desde fuentes verificadas. Usa solo datos de ejemplo claramente marcados como `[EJEMPLO — reemplazar]`.
- Cada paso de una guía tiene un campo de **fuente** (`source_url`) y un campo **verificado** (`is_verified`). Nada se muestra como contenido público si no está verificado.
- **Seguridad de credenciales:** todas las claves (Supabase, Discord) van en variables de entorno (`.env.local`). Nunca escribir claves en el código ni subirlas al repositorio. Incluir `.env.local` en `.gitignore` y crear un `.env.example` sin valores reales.
- **Privacidad:** cada usuario puede elegir si su progreso es visible u oculto para los demás (`progress_visible`). Respetarlo en las consultas.
- **Permisos en la base de datos:** usar Row Level Security (RLS) en Supabase. Un usuario solo puede editar su propio progreso; solo los admins pueden crear/editar juegos, guías y pasos.
- Código comentado en español cuando ayude, nombres de variables en inglés.

---

## 4. Modelo de datos

Crear estas tablas en Supabase (Postgres). Incluir migraciones SQL.

**profiles** (perfil del usuario, ligado a `auth.users`)
- `id` (uuid, PK, = auth.users.id)
- `discord_id` (text)
- `username` (text)
- `avatar_url` (text)
- `role` (text, valores: `user` | `admin`, por defecto `user`)
- `created_at` (timestamptz)

**games** (cada juego)
- `id` (uuid, PK)
- `slug` (text, único)
- `name` (text)
- `description` (text)
- `cover_image` (text)
- `is_published` (bool, por defecto false)
- `created_at` (timestamptz)

**guides** (una guía pertenece a un juego)
- `id` (uuid, PK)
- `game_id` (uuid, FK → games)
- `slug` (text)
- `title` (text)
- `description` (text)
- `order_index` (int)
- `is_published` (bool, por defecto false)
- `created_at` (timestamptz)

**guide_steps** (los pasos que el usuario va marcando)
- `id` (uuid, PK)
- `guide_id` (uuid, FK → guides)
- `order_index` (int)
- `title` (text)
- `content` (text)
- `source_url` (text)  ← fuente del dato
- `is_verified` (bool, por defecto false)
- `created_at` (timestamptz)

**game_memberships** (qué usuario juega a qué juego — base de la parte social)
- `id` (uuid, PK)
- `user_id` (uuid, FK → profiles)
- `game_id` (uuid, FK → games)
- `progress_visible` (bool, por defecto true)
- `joined_at` (timestamptz)
- restricción única: (`user_id`, `game_id`)

**step_progress** (avance de cada usuario en cada paso)
- `id` (uuid, PK)
- `user_id` (uuid, FK → profiles)
- `step_id` (uuid, FK → guide_steps)
- `completed` (bool, por defecto false)
- `completed_at` (timestamptz)
- restricción única: (`user_id`, `step_id`)

Relaciones: un juego → muchas guías → muchos pasos. El porcentaje de avance de un usuario en una guía = pasos completados / pasos totales de esa guía.

---

## 5. Funcionalidades

- **Login con Discord** y creación automática del `profile` la primera vez.
- **Lista de juegos** publicados; cada juego muestra sus guías.
- **Guía interactiva:** lista de pasos en orden, cada uno con casilla para marcar como completado. Se guarda al instante. Barra de progreso con el porcentaje.
- **Mi progreso:** vista donde el usuario ve su avance en cada guía.
- **Roster del juego:** lista de los demás usuarios que juegan al mismo juego, con su porcentaje de avance, actualizándose en tiempo real (Supabase Realtime sobre `step_progress`). Respetar `progress_visible`.
- **Panel de administración** (solo `role = admin`): crear y editar juegos, guías y pasos (incluyendo `source_url` y marcar `is_verified`), publicar/despublicar, y gestionar el rol de los usuarios.

---

## 6. Fases de construcción

No construir todo a la vez. Avanzar en este orden y no pasar de fase hasta que la anterior funcione:

- **Fase 0 — Setup:** proyecto Next.js + Tailwind + cliente de Supabase + variables de entorno + `.gitignore`.
- **Fase 1 — Auth:** login con Discord, creación del perfil, rutas protegidas, logout.
- **Fase 2 — Guías + progreso personal:** modelo de datos, vista de juego/guía, marcar pasos, barra de progreso.
- **Fase 3 — Roster + tiempo real:** unirse a un juego, ver a los demás jugadores y su avance en vivo, toggle de privacidad.
- **Fase 4 — Panel de admin:** CRUD de juegos/guías/pasos con campo de fuente y verificación, gestión de roles.

---

## 7. Qué NO hacer

- No inventar contenido real de Call of Dragons.
- No poner claves/secretos en el código.
- No crear login con contraseña (solo Discord).
- No saltarse las fases ni mezclar varias en un solo cambio gigante.
- No usar almacenamiento del navegador para datos importantes; usar la base de datos.

---

## 8. Prompts por fase (copiar y pegar en Claude Code, uno a uno)

> Antes de empezar, asegúrate de tener creado un proyecto en Supabase y una app en el portal de desarrolladores de Discord. Cuando una fase necesite esas claves, Claude Code te dirá qué variables poner en `.env.local` — tú las pegas, no él.

**Prompt Fase 0**
```
Lee CLAUDE.md. Inicia el proyecto de la Fase 0: crea una app Next.js con App Router y TypeScript, configura Tailwind CSS, instala el cliente de Supabase y deja preparado el archivo .env.example con las variables necesarias (sin valores). Configura .gitignore para no subir .env.local. No avances a otras fases todavía. Al terminar, dime exactamente qué variables debo poner en .env.local.
```

**Prompt Fase 1**
```
Fase 1 (Auth). Implementa el login con Discord usando Supabase Auth: botón de "Iniciar sesión con Discord", manejo del callback, creación automática del registro en la tabla profiles la primera vez (con discord_id, username, avatar_url y role = user), rutas protegidas para usuarios logueados, y un botón de cerrar sesión. Crea la migración SQL de la tabla profiles con su RLS. No toques las guías todavía.
```

**Prompt Fase 2**
```
Fase 2 (Guías + progreso). Crea las migraciones SQL de games, guides, guide_steps y step_progress con sus políticas RLS según CLAUDE.md. Construye: la lista de juegos publicados, la vista de una guía con sus pasos en orden, la posibilidad de marcar cada paso como completado (guardado inmediato) y una barra con el porcentaje de avance. Usa solo datos de ejemplo marcados como [EJEMPLO — reemplazar]; no inventes contenido real de Call of Dragons.
```

**Prompt Fase 3**
```
Fase 3 (Roster + tiempo real). Crea la tabla game_memberships con su RLS. Permite que un usuario se una a un juego. Añade una vista de "Roster" que liste a los demás usuarios del mismo juego con su porcentaje de avance, actualizándose en vivo con Supabase Realtime sobre step_progress. Respeta el campo progress_visible: si un usuario lo tiene en false, no se muestra su avance. Añade un toggle para que cada usuario cambie su visibilidad.
```

**Prompt Fase 4**
```
Fase 4 (Panel de admin). Crea un panel accesible solo para usuarios con role = admin. Debe permitir crear y editar juegos, guías y pasos (cada paso con sus campos source_url e is_verified), publicar/despublicar contenido, y cambiar el rol de otros usuarios. Asegura con RLS que solo los admins puedan escribir en games, guides y guide_steps. Recuerda: el contenido lo cargará el admin desde fuentes verificadas; no lo rellenes tú.
```

---

## 9. Después de construir: cargar la guía de Call of Dragons

Cuando el sitio funcione, el contenido de Call of Dragons se carga **desde el panel de admin**, paso a paso, con su fuente verificada en `source_url` y marcando `is_verified` solo cuando esté confirmado. No se genera "de memoria".
