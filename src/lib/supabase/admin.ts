// Cliente de Supabase con CLAVE DE SERVICIO (service role).
//
// Salta la RLS por completo. Úsalo SOLO en route handlers / server actions y
// solo para lo que no puede ir con la sesión del usuario: leer la webhook_url
// de `discord_channels` y escribir en `announcements` (tablas con RLS activada
// y sin políticas, cerradas a cal y canto).
//
// Nunca lo importes desde un componente de cliente: "server-only" hace que el
// build falle si alguien lo intenta, en vez de filtrar la clave al navegador.
//
// La clave va en .env.local (SUPABASE_SERVICE_ROLE_KEY) y en las variables de
// entorno del deploy. NO lleva prefijo NEXT_PUBLIC — si lo llevara, acabaría
// en el bundle del navegador y cualquiera tendría acceso total a la base.
import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// ¿Está puesta la clave de servicio? Mismo criterio que SUPABASE_CONFIGURED:
// si falta, la funcionalidad se apaga con un mensaje claro en vez de reventar.
export const SERVICE_ROLE_CONFIGURED = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
);

export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      // No hay usuario detrás de este cliente: ni sesión ni refresco de token.
      auth: { persistSession: false, autoRefreshToken: false },
    }
  );
}
