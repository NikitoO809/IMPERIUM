-- Anuncios del panel → canal de Discord (vía webhook, sin bot).
--
-- Dos tablas:
--   discord_channels → los canales configurados. Guarda la URL SECRETA del
--                      webhook: nunca sale del servidor.
--   announcements    → cada anuncio redactado en el panel. Si llegó a
--                      publicarse guarda el id del mensaje de Discord, para
--                      poder EDITAR ese mensaje en vez de crear uno nuevo
--                      (mismo truco que discord_config.scoreboard_message_id).
--
-- SEGURIDAD: RLS activada y SIN políticas en ambas tablas. Nadie las lee ni
-- escribe con la sesión del usuario (ni anónimo ni logueado, ni siquiera el
-- Supremo). El único acceso es desde el servidor con la clave de servicio
-- (SUPABASE_SERVICE_ROLE_KEY), que salta la RLS por diseño. Es más estricto
-- que el resto del proyecto a propósito: webhook_url es una credencial —
-- quien la tenga puede escribir en el canal.

-- ── Canales configurados ─────────────────────────────────────────
create table if not exists public.discord_channels (
  id              uuid primary key default gen_random_uuid(),
  -- Clave estable con la que el panel pide un canal (ej. 'aion2', 'general').
  key             text not null unique,
  -- Nombre visible en el selector del panel (ej. 'Anuncios · Aion 2').
  label           text not null,
  -- URL del webhook de Discord. SECRETA: nunca se envía al navegador.
  webhook_url     text not null,
  -- Rol de Discord al que hacer ping cuando el admin marca la casilla.
  -- Es un id numérico en texto (ej. '1234567890123456789'). Opcional.
  default_role_id text,
  created_at      timestamptz not null default now()
);

-- ── Anuncios ─────────────────────────────────────────────────────
create table if not exists public.announcements (
  id                 uuid primary key default gen_random_uuid(),
  -- Canal destino. 'restrict': no dejamos borrar un canal que ya tiene
  -- anuncios publicados (perderíamos el historial y el message id).
  channel_id         uuid not null references public.discord_channels(id) on delete restrict,
  title              text not null,
  body               text,
  link_url           text,
  image_url          text,
  -- Color de la barra lateral del embed, en entero decimal (como lo pide
  -- Discord). Por defecto 15736350 = #F01E1E.
  color              int not null default 15736350,
  -- ¿Mencionar al rol del canal? Lo decide el admin con una casilla.
  ping_role          boolean not null default false,
  -- Id del mensaje que creó Discord. null = nunca se publicó.
  discord_message_id text,
  -- Momento en que se publicó. null = borrador o intento fallido
  -- (el registro se conserva para poder reintentar).
  published_at       timestamptz,
  -- Autor. 'set null' para no perder el anuncio si se borra la cuenta.
  created_by         uuid references auth.users(id) on delete set null,
  created_at         timestamptz not null default now()
);

-- Listado del panel: los más recientes primero, paginado.
create index if not exists announcements_created_at_idx
  on public.announcements (created_at desc);

-- Índice de cobertura de la clave foránea (mismo criterio que el resto del proyecto).
create index if not exists announcements_channel_id_idx
  on public.announcements (channel_id);

-- ── RLS: cerrado a cal y canto ───────────────────────────────────
alter table public.discord_channels enable row level security;
alter table public.announcements    enable row level security;
-- Sin políticas a propósito: sin una policy que la permita, RLS deniega toda
-- operación a anon y authenticated. Solo service_role (que salta RLS) entra.

-- Defensa en profundidad: además de la RLS, quitamos los permisos de tabla que
-- Supabase concede por defecto a anon/authenticated en el schema public. Así,
-- si algún día alguien añadiera una policy por error, seguiría sin haber
-- acceso desde el navegador. (service_role conserva los suyos.)
revoke all on public.discord_channels from anon, authenticated;
revoke all on public.announcements    from anon, authenticated;
