// Panel de admin — miembros y rangos.
// Ver la lista: cualquier staff. Cambiar rangos: solo el Supremo.
import { requireStaff, getAdminUsers } from "@/lib/admin";
import { type Rank, RANK_LABEL, RANK_BADGE, ASSIGNABLE_RANKS, isSupremo } from "@/lib/ranks";
import { HudLabel } from "@/components/hud";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { inputCls } from "@/components/admin/styles";
import { setUserRole } from "../actions";

export default async function AdminMiembrosPage() {
  const { id: myId, rank: myRank } = await requireStaff();
  const users = await getAdminUsers();
  const supremo = isSupremo(myRank);

  return (
    <div className="flex h-full flex-col">

      {/* Barra superior */}
      <header className="border-b border-white/10 bg-black/30 px-8 py-4">
        <HudLabel>Administración</HudLabel>
        <h1 className="mt-0.5 font-title text-xl font-extrabold tracking-wide text-glow-brand">
          Miembros
        </h1>
      </header>

      <div className="flex-1 overflow-auto px-8 py-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-title text-xs font-bold tracking-[0.2em] text-white/50">
            TODOS LOS MIEMBROS ({users.length})
          </h2>
          {!supremo && (
            <span className="font-hud text-[10px] text-white/35">
              Solo el Supremo puede cambiar rangos
            </span>
          )}
        </div>

        <div className="overflow-hidden rounded-lg border border-white/10 bg-black/30">
          {users.length === 0 ? (
            <div className="px-6 py-8 text-center text-sm text-white/35">
              Todavía no hay miembros registrados.
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/8">
                  <th className="px-5 py-2.5 text-left font-hud text-[9px] tracking-widest text-white/30">MIEMBRO</th>
                  <th className="px-4 py-2.5 text-left font-hud text-[9px] tracking-widest text-white/30">RANGO</th>
                  {supremo && (
                    <th className="px-4 py-2.5 text-right font-hud text-[9px] tracking-widest text-white/30">CAMBIAR RANGO</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => {
                  const isSelf = u.id === myId;
                  const rank = u.role as Rank;
                  const targetIsSupremo = rank === "supremo";
                  return (
                    <tr
                      key={u.id}
                      className={`${i < users.length - 1 ? "border-b border-white/5" : ""} hover:bg-white/[0.02] transition-colors`}
                    >
                      {/* Miembro */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          {u.avatarUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={u.avatarUrl} alt="" className="h-7 w-7 rounded-full ring-1 ring-white/15" />
                          ) : (
                            <span className="grid h-7 w-7 place-items-center rounded-full bg-white/10 font-title text-[10px]">
                              {(u.username ?? "?").slice(0, 2).toUpperCase()}
                            </span>
                          )}
                          <div>
                            <span className="font-hud text-sm text-white/85">{u.username ?? "Jugador"}</span>
                            {isSelf && <span className="ml-2 font-hud text-[8px] text-accent/70">tú</span>}
                          </div>
                        </div>
                      </td>

                      {/* Rango actual (badge) */}
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center rounded-md px-2 py-1 font-hud text-[10px] ring-1 ${RANK_BADGE[rank] ?? RANK_BADGE.user}`}>
                          {rank === "supremo" && <span className="mr-1">♛</span>}
                          {RANK_LABEL[rank] ?? "Miembro"}
                        </span>
                      </td>

                      {/* Cambiar rango — solo el Supremo, y nunca sobre sí mismo ni sobre otro Supremo */}
                      {supremo && (
                        <td className="px-4 py-3.5">
                          {isSelf || targetIsSupremo ? (
                            <div className="text-right font-hud text-[10px] text-white/25">
                              {isSelf ? "—" : "Supremo"}
                            </div>
                          ) : (
                            <form action={setUserRole} className="flex items-center justify-end gap-2">
                              <input type="hidden" name="id" value={u.id} />
                              <select
                                name="role"
                                defaultValue={ASSIGNABLE_RANKS.includes(rank) ? rank : "user"}
                                className={`${inputCls} w-auto py-1.5 text-xs`}
                              >
                                {ASSIGNABLE_RANKS.map((r) => (
                                  <option key={r} value={r}>{RANK_LABEL[r]}</option>
                                ))}
                              </select>
                              <ConfirmButton
                                message={`¿Cambiar el rango de ${u.username ?? "este miembro"}?`}
                                className="btn-hud bg-brand px-3 py-1.5 text-white"
                              >
                                <span className="hud-label text-[9px]">Aplicar</span>
                              </ConfirmButton>
                            </form>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {supremo && (
          <p className="mt-3 font-hud text-[10px] leading-relaxed text-white/35">
            <span className="text-amber-300/70">♛ Supremo</span>: control total ·{" "}
            <span className="text-accent/70">Admin</span>: crea, edita y publica ·{" "}
            <span className="text-emerald-300/70">Moderador</span>: crea y edita (no publica) ·{" "}
            <span className="text-sky-300/70">Tester</span>: usa el asistente IA (sin panel) ·{" "}
            <span className="text-white/50">Miembro</span>: sin acceso al panel
          </p>
        )}
      </div>
    </div>
  );
}
