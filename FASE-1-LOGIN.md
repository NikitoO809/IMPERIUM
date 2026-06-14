# Fase 1 — Activar el login con Discord

El código ya está hecho. Solo faltan estos pasos (los haces TÚ, son tus cuentas).
Sigue el orden. Donde diga "copia", guarda el valor para el paso siguiente.

---

## 1) Proyecto de Supabase
1. Entra en https://supabase.com → tu proyecto de IMPERIUM (o crea uno nuevo).
2. Ve a **Project Settings → API**.
3. Copia **Project URL** y la clave **anon public**.

## 2) Crear la tabla de perfiles
1. En Supabase, abre **SQL Editor → New query**.
2. Abre el archivo `supabase/migrations/0001_profiles.sql` del proyecto, copia TODO y pégalo.
3. Pulsa **Run**. Debe decir "Success".

## 3) Activar Discord en Supabase
1. En Supabase: **Authentication → Providers → Discord** → actívalo (Enable).
2. Pega tu **Client ID** y **Client Secret** de Discord (los creaste en el portal).
3. Supabase te muestra una **Callback URL** del tipo:
   `https://TU-PROYECTO.supabase.co/auth/v1/callback` → **cópiala**.
4. Guarda (Save).

## 4) Configurar el redirect en Discord
1. Entra en https://discord.com/developers/applications → tu app → **OAuth2**.
2. En **Redirects**, añade la Callback URL que copiaste en el paso 3.
3. Guarda (Save Changes).

## 5) URLs permitidas en Supabase
En **Authentication → URL Configuration**:
- **Site URL:** `http://localhost:3003`
- **Redirect URLs:** añade `http://localhost:3003/auth/callback`

(Cuando subamos a Vercel, añadiremos también la URL pública.)

## 6) Pegar las claves en el proyecto
1. En la carpeta del proyecto, crea el archivo **`.env.local`** (copia de `.env.example`).
2. Rellena:
   ```
   NEXT_PUBLIC_SUPABASE_URL=  (Project URL del paso 1)
   NEXT_PUBLIC_SUPABASE_ANON_KEY=  (clave anon del paso 1)
   ```
   (Las de Discord NO hacen falta aquí; van dentro de Supabase.)

## 7) Reiniciar la app
- Para el servidor (Ctrl+C) y vuelve a arrancar: `npm run dev`
  (Next.js solo lee `.env.local` al arrancar.)

---

## Probar
1. Abre la web → pulsa **Entrar con Discord**.
2. Te lleva a Discord → autorizas → vuelves a la web ya logueado.
3. Arriba a la derecha verás tu **avatar y nombre**, y el botón **Salir**.
4. En Supabase → **Table Editor → profiles** debe aparecer tu fila (creada sola).

## Si algo falla
- "redirect_uri_mismatch" → revisa que la URL del paso 4 sea EXACTA a la del paso 3.
- Vuelve al inicio con `?auth_error=1` → revisa Client ID/Secret en Supabase.
- No pasa nada al pulsar → ¿pegaste las claves en `.env.local` y reiniciaste?
