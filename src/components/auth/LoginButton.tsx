"use client";

// Botón "Entrar con Discord". Inicia el login OAuth de Supabase.
import { createClient } from "@/lib/supabase/client";
import { SUPABASE_CONFIGURED } from "@/lib/supabase/auth-config";

export function LoginButton({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  async function login() {
    if (!SUPABASE_CONFIGURED) {
      alert(
        "El login aún no está activo: falta conectar Supabase y Discord.\n\nMiguel: pega las claves en .env.local y reinicia la app (ver la guía)."
      );
      return;
    }
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "discord",
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
  }

  return (
    <button type="button" onClick={login} className={className}>
      {children}
    </button>
  );
}
