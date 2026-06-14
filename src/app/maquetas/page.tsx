// Galería de maquetas — índice para comparar y elegir un diseño.
import Link from "next/link";

const CARDS = [
  {
    slug: "neon",
    n: "01",
    title: "Neón HUD",
    desc: "Interfaz de videojuego: paneles biselados y marcas de esquina. Fondo: foco de luz que sigue al cursor.",
    grad: "from-violet-600/40 to-cyan-500/20",
  },
  {
    slug: "constelacion",
    n: "02",
    title: "Constelación",
    desc: "Minimalista y técnico, mucho espacio negro. Fondo: red de partículas que reacciona al ratón.",
    grad: "from-cyan-500/30 to-blue-600/15",
  },
  {
    slug: "imperial",
    n: "03",
    title: "Imperial épico",
    desc: "Oro y tipografía con carácter, tono de imperio. Fondo: aurora cálida que persigue al cursor.",
    grad: "from-amber-500/40 to-red-600/20",
  },
  {
    slug: "retro",
    n: "04",
    title: "Retro / Synthwave",
    desc: "Estilo años 80, sol y neón. Fondo: rejilla 3D en perspectiva que se inclina con el ratón.",
    grad: "from-fuchsia-500/40 to-cyan-400/20",
  },
];

export default function MaquetasIndex() {
  return (
    <main className="relative min-h-screen bg-[#05060a] px-5 py-16">
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(50rem 30rem at 20% 0%, rgba(124,92,255,0.18), transparent 60%), radial-gradient(40rem 30rem at 90% 10%, rgba(34,224,255,0.12), transparent 60%)",
        }}
      />
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300/70">
          IMPERIUM · Maquetas
        </p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Elige un diseño
        </h1>
        <p className="mt-3 max-w-xl text-sm text-white/55">
          Cuatro direcciones distintas, cada una con un fondo interactivo.
          Ábrelas, mueve el ratón y dime cuál te gusta — esa la pulimos y la
          dejamos como la web definitiva.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {CARDS.map((c) => (
            <Link
              key={c.slug}
              href={`/maquetas/${c.slug}`}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition hover:-translate-y-1 hover:border-white/25"
            >
              <div
                className={`pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br ${c.grad} blur-2xl`}
              />
              <div className="relative">
                <span className="font-mono text-xs text-white/40">{c.n}</span>
                <h2 className="mt-1 text-xl font-bold text-white">{c.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-white/55">{c.desc}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan-300">
                  Ver maqueta
                  <span className="transition group-hover:translate-x-1">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>

        <Link
          href="/"
          className="mt-10 inline-block text-sm text-white/45 transition hover:text-white"
        >
          ← Volver a la web actual
        </Link>
      </div>
    </main>
  );
}
