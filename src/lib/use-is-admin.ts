"use client";

// Hook que indica si el usuario actual es STAFF (supremo/admin/moderador),
// para mostrar el enlace al panel solo a quien corresponde. El acceso real
// lo protege el servidor (requireStaff). Mantiene el nombre useIsAdmin por
// compatibilidad con quien ya lo importa.
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { SUPABASE_CONFIGURED } from "@/lib/supabase/auth-config";
import { isStaff, type Rank } from "@/lib/ranks";

export function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!SUPABASE_CONFIGURED) return;
    let active = true;
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .maybeSingle();
      if (active) setIsAdmin(isStaff((profile?.role ?? "user") as Rank));
    });
    return () => {
      active = false;
    };
  }, []);

  return isAdmin;
}
