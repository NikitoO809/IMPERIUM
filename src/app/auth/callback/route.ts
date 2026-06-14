// Discord redirige aquí tras el login. Intercambiamos el "code" por la sesión
// (que se guarda en cookies). El perfil se crea solo con un trigger en la BD.
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Algo falló: volvemos al inicio con un aviso
  return NextResponse.redirect(`${origin}/?auth_error=1`);
}
