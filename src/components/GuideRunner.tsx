"use client";

// Guía interactiva: sidebar de pasos + panel de contenido activo + barra de progreso.
// Sin sesión → pasos marcados solo en memoria. Con sesión → guardado en step_progress.
import { useMemo, useState } from "react";
import Image from "next/image";
import type { Step } from "@/lib/games";
import { createClient } from "@/lib/supabase/client";
import { SUPABASE_CONFIGURED } from "@/lib/supabase/auth-config";
import { useUser } from "@/lib/use-user";
import { Panel, XpBar } from "@/components/hud";
import { RichText } from "@/components/RichText";
import { ImageZoom } from "@/components/ImageZoom";
import { LoginButton } from "@/components/auth/LoginButton";
import { DiscordIcon } from "@/components/icons";

export function GuideRunner({
  steps,
  initialCompletedIds,
}: {
  steps: Step[];
  initialCompletedIds: string[];
}) {
  const { user, loading } = useUser();
  const [done, setDone] = useState<Set<string>>(new Set(initialCompletedIds));
  const [saving, setSaving] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);

  const pct = useMemo(
    () => (steps.length ? Math.round((done.size / steps.length) * 100) : 0),
    [done, steps.length]
  );

  const activeStep = steps[activeIdx];

  async function toggle(id: string) {
    const wasDone = done.has(id);
    const nowDone = !wasDone;

    setDone((prev) => {
      const next = new Set(prev);
      if (nowDone) next.add(id);
      else next.delete(id);
      return next;
    });

    if (!user || !SUPABASE_CONFIGURED) return;

    setSaving(true);
    const supabase = createClient();
    const { error } = nowDone
      ? await supabase.from("step_progress").upsert(
          { user_id: user.id, step_id: id, completed: true, completed_at: new Date().toISOString() },
          { onConflict: "user_id,step_id" }
        )
      : await supabase.from("step_progress").delete().eq("user_id", user.id).eq("step_id", id);
    setSaving(false);

    if (error) {
      setDone((prev) => {
        const next = new Set(prev);
        if (nowDone) next.delete(id);
        else next.add(id);
        return next;
      });
    }
  }

  const showLoginHint = SUPABASE_CONFIGURED && !loading && !user;

  return (
    <div className="flex flex-col gap-4">
      {/* Aviso login */}
      {showLoginHint && (
        <Panel>
          <div className="panel-inner flex flex-col items-start gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-white/65">
              Puedes marcar pasos, pero{" "}
              <span className="text-white/90">inicia sesión para guardar tu avance.</span>
            </p>
            <LoginButton className="btn-hud flex shrink-0 items-center gap-2 bg-brand px-4 py-2 text-white">
              <DiscordIcon className="h-4 w-4" />
              <span className="hud-label text-[11px]">Entrar</span>
            </LoginButton>
          </div>
        </Panel>
      )}

      {/* Selector de pasos en móvil (scroll horizontal) */}
      <div className="flex gap-2 overflow-x-auto pb-1 lg:hidden">
        {steps.map((step, i) => {
          const checked = done.has(step.id);
          const isActive = i === activeIdx;
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => setActiveIdx(i)}
              className={`shrink-0 flex h-8 w-8 items-center justify-center rounded border text-[10px] font-title font-bold transition-all ${
                checked
                  ? "border-accent bg-accent text-black"
                  : isActive
                  ? "border-accent/60 bg-accent/10 text-accent"
                  : "border-white/20 text-white/40 hover:border-white/40"
              }`}
            >
              {checked ? (
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              ) : (
                String(i + 1).padStart(2, "0")
              )}
            </button>
          );
        })}
      </div>

      {/* Layout principal: sidebar + contenido */}
      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[240px_1fr]">

        {/* ── Sidebar ── */}
        <aside className="hidden lg:block lg:sticky lg:top-4">
          <Panel corners>
            <div className="panel-inner p-4">
              {/* Barra de progreso */}
              <div className="mb-5">
                <div className="mb-2 flex items-center justify-between">
                  <span className="hud-label text-[9px] text-white/40">
                    PROGRESO{saving && <span className="text-accent/50"> · guardando</span>}
                  </span>
                  <span className="font-title text-sm font-extrabold text-accent text-glow-accent">
                    {pct}%
                  </span>
                </div>
                <XpBar value={pct} />
                <p className="mt-1.5 text-[10px] text-white/30">
                  {done.size} de {steps.length} completados
                </p>
              </div>

              {/* Lista de pasos */}
              <nav className="space-y-0.5">
                {steps.map((step, i) => {
                  const checked = done.has(step.id);
                  const isActive = i === activeIdx;
                  return (
                    <button
                      key={step.id}
                      type="button"
                      onClick={() => setActiveIdx(i)}
                      className={`group w-full flex items-center gap-3 rounded px-2.5 py-2 text-left transition-all ${
                        isActive
                          ? "bg-accent/10 border border-accent/25"
                          : "border border-transparent hover:bg-white/5"
                      }`}
                    >
                      {/* Número o check */}
                      <span
                        className={`grid h-5 w-5 shrink-0 place-items-center rounded border text-[9px] font-title font-bold transition-all ${
                          checked
                            ? "border-accent bg-accent text-black"
                            : isActive
                            ? "border-accent/60 text-accent"
                            : "border-white/20 text-white/35 group-hover:border-white/35"
                        }`}
                      >
                        {checked ? (
                          <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 6 9 17l-5-5" />
                          </svg>
                        ) : (
                          String(i + 1).padStart(2, "0")
                        )}
                      </span>
                      <span
                        className={`text-[13px] leading-snug transition-colors ${
                          isActive
                            ? "text-white"
                            : checked
                            ? "text-white/35 line-through"
                            : "text-white/55 group-hover:text-white/80"
                        }`}
                      >
                        {step.title}
                      </span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </Panel>
        </aside>

        {/* ── Panel de contenido ── */}
        <div>
          {activeStep && (
            <Panel className={done.has(activeStep.id) ? "panel-accent" : ""}>
              <div className="panel-inner p-5 sm:p-7">

                {/* Cabecera del paso */}
                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="mb-1 flex items-center gap-2">
                      <span className="hud-label text-[9px] text-accent/60">
                        PASO {String(activeStep.orderIndex).padStart(2, "0")}
                      </span>
                      {activeStep.isVerified ? (
                        <span className="hud-label text-[8px] text-emerald-400/80">verificado</span>
                      ) : (
                        <span className="hud-label text-[8px] text-amber-400/60">sin verificar</span>
                      )}
                    </div>
                    <h2
                      className={`font-title text-xl font-bold leading-snug sm:text-2xl ${
                        done.has(activeStep.id) ? "line-through decoration-accent/50" : ""
                      }`}
                    >
                      {activeStep.title}
                    </h2>
                  </div>

                  {/* Botón marcar */}
                  <button
                    type="button"
                    onClick={() => toggle(activeStep.id)}
                    className={`shrink-0 flex items-center gap-2 self-start rounded border px-4 py-2 transition-all hud-label text-[10px] ${
                      done.has(activeStep.id)
                        ? "border-accent/40 bg-accent/10 text-accent"
                        : "btn-ghost border-white/20 text-white/55 hover:border-white/40 hover:text-white"
                    }`}
                  >
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    {done.has(activeStep.id) ? "COMPLETADO" : "MARCAR LISTO"}
                  </button>
                </div>

                {/* Texto del paso (listas, tablas y saltos de línea con formato HUD) */}
                <RichText content={activeStep.content} />

                {/* Imágenes — object-contain para que nunca se recorten; clic para ampliar */}
                {activeStep.images && activeStep.images.length > 0 && (
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {activeStep.images.map((src) => (
                      <ImageZoom
                        key={src}
                        src={src}
                        className="bevel relative flex min-h-[200px] w-full items-center justify-center overflow-hidden rounded border border-white/10 bg-black/30 p-2"
                      >
                        <Image
                          src={src}
                          alt=""
                          width={640}
                          height={420}
                          unoptimized
                          sizes="(max-width: 640px) 100vw, 50vw"
                          className="max-h-80 w-auto object-contain"
                        />
                      </ImageZoom>
                    ))}
                  </div>
                )}

                {/* Footer: navegación anterior / siguiente */}
                <div className="mt-6 flex items-center justify-between gap-4">
                  <span />

                  <div className="flex gap-2">
                    {activeIdx > 0 && (
                      <button
                        type="button"
                        onClick={() => setActiveIdx((n) => n - 1)}
                        className="btn-ghost hud-label px-3 py-1.5 text-[10px]"
                      >
                        ANTERIOR
                      </button>
                    )}
                    {activeIdx < steps.length - 1 && (
                      <button
                        type="button"
                        onClick={() => setActiveIdx((n) => n + 1)}
                        className="btn-hud hud-label px-3 py-1.5 text-[10px]"
                      >
                        SIGUIENTE
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </Panel>
          )}

          {pct === 100 && (
            <p className="mt-5 text-center font-title text-sm font-bold tracking-widest text-accent text-glow-accent">
              GUIA COMPLETADA
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
