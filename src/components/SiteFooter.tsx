// Pie de página compartido por toda la app.
import Link from "next/link";
import { ShieldIcon } from "@/components/icons";

export function SiteFooter() {
  return (
    <footer className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="flex flex-col items-center justify-between gap-3 border-t border-border pt-6 sm:flex-row">
        <Link href="/" className="flex items-center gap-2">
          <ShieldIcon className="h-4 w-4 text-accent" />
          <span className="font-title text-sm font-bold tracking-[0.15em] text-white/70">IMPERIUM</span>
        </Link>
        <div className="flex flex-col items-center gap-1 sm:items-end">
          <p className="hud-label text-[10px] text-white/35">
            Sistema: <span className="text-accent/70">Online</span> · v0.1 · Comunidad de Discord
          </p>
          <p className="hud-label text-[10px] text-white/35">
            Sitio creado por{" "}
            <a
              href="https://miguelflx.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-brand via-accent to-rank bg-clip-text font-title font-bold tracking-[0.15em] text-transparent text-glow-accent transition-all hover:brightness-125"
            >
              NikitoO
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
