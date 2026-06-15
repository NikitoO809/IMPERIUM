// Panel de admin — gestión de miembros y roles.
import { requireAdmin, getAdminUsers } from "@/lib/admin";
import { HudLabel } from "@/components/hud";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { setUserRole } from "../actions";

export default async function AdminMiembrosPage() {
  const adminId = await requireAdmin();
  const users = await getAdminUsers();

  return (
    <div className="flex h-full flex-col">

      {/* Barra superior */}
      <header className="border-b border-white/10 bg-black/30 px-8 py-4">
        <HudLabel>Administración</HudLabel>
        <h1 className="mt-0.5 font-title text-xl font-extrabold tracking-wide text-glow-brand">
          Miembros
        </h1>
      </header>

      {/* Contenido */}
      <div className="flex-1 overflow-auto px-8 py-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-title text-xs font-bold tracking-[0.2em] text-white/50">
            TODOS LOS MIEMBROS ({users.length})
          </h2>
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
                  <th className="px-5 py-2.5 text-left font-hud text-[9px] tracking-widest text-white/30">
                    MIEMBRO
                  </th>
                  <th className="px-4 py-2.5 text-left font-hud text-[9px] tracking-widest text-white/30">
                    ROL
                  </th>
                  <th className="px-4 py-2.5 text-right font-hud text-[9px] tracking-widest text-white/30">
                    ACCIONES
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => {
                  const isSelf = u.id === adminId;
                  const nextRole = u.role === "admin" ? "user" : "admin";
                  return (
                    <tr
                      key={u.id}
                      className={`${i < users.length - 1 ? "border-b border-white/5" : ""} hover:bg-white/[0.02] transition-colors`}
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          {u.avatarUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={u.avatarUrl}
                              alt=""
                              className="h-7 w-7 rounded-full ring-1 ring-white/15"
                            />
                          ) : (
                            <span className="grid h-7 w-7 place-items-center rounded-full bg-white/10 font-title text-[10px]">
                              {(u.username ?? "?").slice(0, 2).toUpperCase()}
                            </span>
                          )}
                          <div>
                            <span className="font-hud text-sm text-white/85">
                              {u.username ?? "Jugador"}
                            </span>
                            {isSelf && (
                              <span className="ml-2 font-hud text-[8px] text-accent/70">tú</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`font-hud text-[11px] ${
                            u.role === "admin" ? "text-accent" : "text-white/40"
                          }`}
                        >
                          {u.role === "admin" ? "● admin" : "○ miembro"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        {!isSelf && (
                          <form action={setUserRole}>
                            <input type="hidden" name="id" value={u.id} />
                            <input type="hidden" name="role" value={nextRole} />
                            <ConfirmButton
                              message={`¿Cambiar el rol de ${u.username ?? "este usuario"} a ${nextRole}?`}
                              className="btn-hud bg-white/8 px-2.5 py-1.5 text-white/60 hover:text-white"
                            >
                              <span className="hud-label text-[9px]">Hacer {nextRole}</span>
                            </ConfirmButton>
                          </form>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
