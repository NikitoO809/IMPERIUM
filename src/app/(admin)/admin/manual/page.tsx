// Manual de Atreia — índice privado.
//
// Solo el Supremo. Aunque alguien tenga el enlace, sin esa sesión no pasa de
// aquí: requireSupremo redirige antes de que se pinte nada.
import Image from "next/image";
import Link from "next/link";
import { requireSupremo } from "@/lib/admin";
import { GUIAS } from "@/lib/manual";
import { HudLabel } from "@/components/hud";

export const metadata = { title: "Manual de Atreia" };

export default async function ManualIndexPage() {
  await requireSupremo();

  return (
    <div className="flex h-full flex-col">
      <header className="relative overflow-hidden border-b border-white/10 bg-black/30 px-8 py-4">
        <Image
          src="/manual/aion2-portada.webp"
          alt=""
          fill
          sizes="100vw"
          priority
          className="pointer-events-none select-none object-cover object-[50%_35%] opacity-25"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0d0d14] via-[#0d0d14]/80 to-[#0d0d14]/30" />
        <div className="scanlines pointer-events-none absolute inset-0 opacity-25" />
        <div className="relative">
          <HudLabel>Privado</HudLabel>
          <h1 className="mt-0.5 font-title text-xl font-extrabold tracking-wide text-glow-brand">
            Manual de Atreia
          </h1>
        </div>
      </header>

      <div className="flex-1 overflow-auto px-8 py-6">
        <p className="mb-6 max-w-2xl text-sm text-white/40">
          Guías de Aion 2 con datos del servidor coreano. No están enlazadas desde ningún sitio
          público y solo se abren con tu sesión.
        </p>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {GUIAS.map((g) => (
            <Link
              key={g.slug}
              href={`/admin/manual/${g.slug}`}
              className="group overflow-hidden border border-white/10 bg-black/20 transition-colors hover:border-white/25"
              style={{ borderLeftWidth: 3, borderLeftColor: g.acento }}
            >
              {g.portada.arte && (
                <div className="relative h-32 overflow-hidden">
                  <Image
                    src={g.portada.arte}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                  <div className="absolute inset-0 mix-blend-color" style={{ background: `${g.acento}30` }} />
                  <div className="scanlines absolute inset-0 opacity-20" />
                </div>
              )}
              <div className="p-5">
                <div className="font-title text-lg font-extrabold tracking-wide">{g.nombre}</div>
                <p className="mt-2 text-sm leading-relaxed text-white/45">{g.resumen.es}</p>
                <div className="mt-4 font-hud text-[10px] tracking-[0.18em] text-white/30 group-hover:text-white/60">
                  ABRIR →
                </div>
              </div>
            </Link>
          ))}

          {/* Hueco de lo que viene */}
          <div className="border border-dashed border-white/10 text-white/25">
            <div className="flex h-32 items-center justify-center border-b border-dashed border-white/10 font-hud text-[10px] tracking-[0.2em]">
              SIN MONTAR
            </div>
            <div className="p-5">
              <div className="font-title text-lg font-extrabold tracking-wide">Templar</div>
              <p className="mt-2 text-sm leading-relaxed">La siguiente clase. Pendiente de montar.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
