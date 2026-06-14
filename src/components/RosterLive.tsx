"use client";

// Roster del juego EN VIVO: lista de miembros y su avance, que se actualiza
// solo (Supabase Realtime) cuando alguien marca un paso o cambia su privacidad.
// Respeta progress_visible: si un miembro lo tiene en false, su avance sale
// como "Privado" (salvo para él mismo).
import { useCallback, useEffect, useRef, useState } from "react";
import type { RosterData, RosterMember } from "@/lib/games";
import { createClient } from "@/lib/supabase/client";
import { SUPABASE_CONFIGURED } from "@/lib/supabase/auth-config";
import { Panel, XpBar } from "@/components/hud";
import { UsersIcon, DiscordIcon } from "@/components/icons";
import { LoginButton } from "@/components/auth/LoginButton";

type MembershipRow = {
  user_id: string;
  progress_visible: boolean;
  joined_at: string;
  profiles: { username: string | null; avatar_url: string | null } | null;
};

// Ordena el roster: primero por avance (desc), luego por nombre.
function rankMembers(members: RosterMember[], totalSteps: number): RosterMember[] {
  return [...members].sort((a, b) => {
    const pa = totalSteps ? a.completedCount / totalSteps : 0;
    const pb = totalSteps ? b.completedCount / totalSteps : 0;
    if (pb !== pa) return pb - pa;
    return a.username.localeCompare(b.username);
  });
}

export function RosterLive({ initial }: { initial: RosterData }) {
  const { gameId, gameName, stepIds, totalSteps } = initial;
  const [members, setMembers] = useState<RosterMember[]>(initial.members);
  const [me, setMe] = useState(initial.me);
  const [busy, setBusy] = useState(false);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Relee miembros + avances desde Supabase y recalcula (misma lógica que el servidor).
  const refetch = useCallback(async () => {
    if (!SUPABASE_CONFIGURED) return;
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id ?? null;

    const { data: msData } = await supabase
      .from("game_memberships")
      .select("user_id, progress_visible, joined_at, profiles(username, avatar_url)")
      .eq("game_id", gameId)
      .order("joined_at");
    const memberships = (msData ?? []) as unknown as MembershipRow[];

    const counts = new Map<string, number>();
    if (userId && stepIds.length) {
      const { data: progData } = await supabase
        .from("step_progress")
        .select("user_id")
        .eq("completed", true)
        .in("step_id", stepIds);
      for (const r of progData ?? []) counts.set(r.user_id, (counts.get(r.user_id) ?? 0) + 1);
    }

    setMembers(
      memberships.map((m) => ({
        userId: m.user_id,
        username: m.profiles?.username || "Jugador",
        avatar: m.profiles?.avatar_url ?? null,
        progressVisible: m.progress_visible,
        completedCount: counts.get(m.user_id) ?? 0,
        isSelf: m.user_id === userId,
      }))
    );

    const mine = userId ? memberships.find((m) => m.user_id === userId) : undefined;
    setMe(
      userId
        ? { userId, isMember: Boolean(mine), progressVisible: mine?.progress_visible ?? true }
        : null
    );
  }, [gameId, stepIds]);

  // Suscripción Realtime: cualquier cambio en progreso o membresías → refrescar.
  useEffect(() => {
    if (!SUPABASE_CONFIGURED) return;
    const supabase = createClient();

    const trigger = () => {
      if (debounce.current) clearTimeout(debounce.current);
      debounce.current = setTimeout(refetch, 250);
    };

    const channel = supabase
      .channel(`roster-${gameId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "step_progress" }, trigger)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "game_memberships", filter: `game_id=eq.${gameId}` },
        trigger
      )
      .subscribe();

    return () => {
      if (debounce.current) clearTimeout(debounce.current);
      supabase.removeChannel(channel);
    };
  }, [gameId, refetch]);

  async function joinGame() {
    if (!me || busy) return;
    setBusy(true);
    const supabase = createClient();
    await supabase.from("game_memberships").insert({ user_id: me.userId, game_id: gameId, progress_visible: true });
    await refetch();
    setBusy(false);
  }

  async function toggleVisibility() {
    if (!me || !me.isMember || busy) return;
    setBusy(true);
    const next = !me.progressVisible;
    setMe({ ...me, progressVisible: next }); // optimista
    const supabase = createClient();
    const { error } = await supabase
      .from("game_memberships")
      .update({ progress_visible: next })
      .eq("user_id", me.userId)
      .eq("game_id", gameId);
    if (error) setMe({ ...me, progressVisible: !next });
    await refetch();
    setBusy(false);
  }

  // ── Sin sesión: invitar a entrar ───────────────────────────
  if (!me) {
    return (
      <Panel corners className="mt-8">
        <div className="panel-inner flex flex-col items-center gap-4 px-6 py-12 text-center">
          <UsersIcon className="h-8 w-8 text-accent" />
          <p className="max-w-sm text-sm text-white/65">
            Inicia sesión para ver a la comunidad de {gameName} y unirte al roster.
          </p>
          <LoginButton className="btn-hud flex items-center gap-2 bg-brand px-5 py-2.5 text-white">
            <DiscordIcon className="h-4 w-4" />
            <span className="hud-label text-[11px]">Entrar con Discord</span>
          </LoginButton>
        </div>
      </Panel>
    );
  }

  const ranked = rankMembers(members, totalSteps);
  const visibleForAvg = ranked.filter((m) => m.progressVisible || m.isSelf);
  const avg =
    visibleForAvg.length && totalSteps
      ? Math.round(
          (visibleForAvg.reduce((a, m) => a + m.completedCount, 0) / (visibleForAvg.length * totalSteps)) * 100
        )
      : 0;

  return (
    <div className="mt-8">
      {/* Unirse / privacidad */}
      {!me.isMember ? (
        <Panel corners className="mb-6">
          <div className="panel-inner flex flex-col items-start gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-white/70">
              Aún no estás en el roster de {gameName}.{" "}
              <span className="text-white/40">Únete para aparecer y compartir tu avance.</span>
            </p>
            <button
              type="button"
              onClick={joinGame}
              disabled={busy}
              className="btn-hud shrink-0 bg-brand px-5 py-2.5 text-white disabled:opacity-50"
            >
              <span className="hud-label text-[11px]">Unirme al juego</span>
            </button>
          </div>
        </Panel>
      ) : (
        <Panel className="mb-6">
          <div className="panel-inner flex items-center justify-between gap-4 p-4">
            <div>
              <p className="text-sm text-white/80">Mostrar mi avance a la comunidad</p>
              <p className="text-xs text-white/40">
                {me.progressVisible ? "Tu avance es visible para los demás." : "Tu avance está oculto (solo lo ves tú)."}
              </p>
            </div>
            <button
              type="button"
              onClick={toggleVisibility}
              disabled={busy}
              aria-pressed={me.progressVisible}
              className={`relative h-7 w-12 shrink-0 rounded-full transition disabled:opacity-50 ${
                me.progressVisible ? "bg-accent" : "bg-white/15"
              }`}
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-black transition-all ${
                  me.progressVisible ? "left-6" : "left-1"
                }`}
              />
            </button>
          </div>
        </Panel>
      )}

      {/* Resumen */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {[
          { n: String(ranked.length), l: "Jugadores" },
          { n: `${avg}%`, l: "Avance medio" },
          { n: "1", l: "Juego activo" },
        ].map((s) => (
          <Panel key={s.l} corners>
            <div className="panel-inner px-3 py-4 text-center">
              <div className="font-title text-2xl font-extrabold text-accent text-glow-accent">{s.n}</div>
              <div className="hud-label mt-1 text-[9px] text-white/45">{s.l}</div>
            </div>
          </Panel>
        ))}
      </div>

      {/* Clasificación */}
      <div className="mb-5 mt-10 flex items-center gap-3">
        <UsersIcon className="h-5 w-5 text-accent" />
        <h2 className="font-title text-lg font-extrabold tracking-[0.15em]">CLASIFICACIÓN</h2>
      </div>

      {ranked.length === 0 ? (
        <p className="text-sm text-white/40">Todavía no hay nadie en el roster. ¡Sé el primero en unirte!</p>
      ) : (
        <Panel>
          <div className="panel-inner p-4 sm:p-6">
            <ul className="space-y-2.5">
              {ranked.map((m, idx) => {
                const pos = idx + 1;
                const hidden = !m.progressVisible && !m.isSelf;
                const pct = totalSteps ? Math.round((m.completedCount / totalSteps) * 100) : 0;
                return (
                  <li
                    key={m.userId}
                    className={`flex items-center gap-4 px-3 py-3 bevel ${m.isSelf ? "bg-accent/10 ring-1 ring-accent/30" : "bg-white/[0.02]"}`}
                  >
                    <span className={`font-title text-lg font-extrabold ${pos === 1 ? "text-rank text-glow-accent" : "text-white/40"}`}>
                      {String(pos).padStart(2, "0")}
                    </span>
                    {m.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={m.avatar} alt="" className="hex h-9 w-9 shrink-0 object-cover" />
                    ) : (
                      <span className="hex grid h-9 w-9 shrink-0 place-items-center bg-gradient-to-br from-brand to-accent font-title text-xs font-bold text-black">
                        {m.username.slice(0, 2).toUpperCase()}
                      </span>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="truncate font-hud text-sm font-semibold text-white/85">
                          {m.username}
                          {m.isSelf && <span className="ml-2 hud-label text-[8px] text-accent/70">tú</span>}
                        </span>
                        {hidden ? (
                          <span className="hud-label text-[9px] text-white/35">Privado</span>
                        ) : (
                          <span className="hud-label text-[10px] text-accent/80">{pct}%</span>
                        )}
                      </div>
                      {hidden ? (
                        <div className="mt-1.5 h-1.5 rounded-full bg-white/5" />
                      ) : (
                        <XpBar value={pct} className="mt-1.5" />
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </Panel>
      )}
    </div>
  );
}
