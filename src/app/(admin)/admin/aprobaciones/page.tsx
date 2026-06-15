// Panel de admin — bandeja de aprobaciones. Solo el Supremo.
// Lista los cambios que admins/moderadores dejaron pendientes y permite
// aprobarlos (se aplican) o rechazarlos (se descartan).
import { requireSupremo, getPendingChanges } from "@/lib/admin";
import { HudLabel } from "@/components/hud";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { btnPrimary, btnDanger } from "@/components/admin/styles";
import { approveChange, rejectChange } from "../actions";

const fmt = new Intl.DateTimeFormat("es", { dateStyle: "medium", timeStyle: "short" });

export default async function AdminAprobacionesPage() {
  await requireSupremo();
  const pending = await getPendingChanges();

  return (
    <div className="flex h-full flex-col">

      {/* Barra superior */}
      <header className="border-b border-white/10 bg-black/30 px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <HudLabel>Revisión de cambios</HudLabel>
            <h1 className="mt-0.5 font-title text-xl font-extrabold tracking-wide text-glow-brand">
              Aprobaciones
            </h1>
          </div>
          <div className="text-center">
            <div className="font-title text-2xl font-extrabold" style={{ color: "#ffcf5a" }}>
              {pending.length}
            </div>
            <div className="font-hud text-[8px] tracking-widest text-white/35">PENDIENTES</div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-auto px-8 py-6">
        <p className="mb-4 text-xs text-white/40">
          Cambios que el equipo (admins y moderadores) dejó en espera. Nada se aplica a la web
          hasta que tú lo apruebes.
        </p>

        {pending.length === 0 ? (
          <div className="rounded-lg border border-white/10 bg-black/30 px-6 py-12 text-center">
            <div className="mb-2 text-2xl text-emerald-400/60">✓</div>
            <p className="font-hud text-sm text-white/50">No hay nada pendiente. Todo al día.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {pending.map((c) => (
              <div
                key={c.id}
                className="flex flex-wrap items-center gap-4 rounded-lg border border-white/10 bg-black/30 px-5 py-3.5"
              >
                <div className="min-w-0 flex-1">
                  <div className="font-hud text-sm text-white/85">{c.label}</div>
                  <div className="mt-0.5 font-hud text-[10px] text-white/35">
                    Pedido por{" "}
                    <span className="text-accent/70">{c.authorName ?? "alguien del equipo"}</span>
                    {" · "}
                    {fmt.format(new Date(c.createdAt))}
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <form action={approveChange}>
                    <input type="hidden" name="id" value={c.id} />
                    <button type="submit" className={btnPrimary}>
                      <span className="hud-label text-[10px]">✓ Aprobar</span>
                    </button>
                  </form>
                  <form action={rejectChange}>
                    <input type="hidden" name="id" value={c.id} />
                    <ConfirmButton
                      message="¿Rechazar este cambio? Se descartará y no se aplicará."
                      className={btnDanger}
                    >
                      <span className="hud-label text-[10px]">Rechazar</span>
                    </ConfirmButton>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
