"use client";

// Cabecera del sitio con logo, navegación y menú hamburguesa para móvil.
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Panel } from "@/components/hud";
import { DiscordIcon } from "@/components/icons";
import { LoginButton } from "@/components/auth/LoginButton";
import { useUser } from "@/lib/use-user";
import { useIsAdmin } from "@/lib/use-is-admin";

type NavItem = { href: string; label: string };

const DEFAULT_NAV: NavItem[] = [
  { href: "/", label: "Inicio" },
  { href: "/juegos", label: "Juegos" },
  { href: "/mi-progreso", label: "Mi progreso" },
  { href: "/comunidad", label: "Comunidad" },
];

const ADMIN_NAV: NavItem = { href: "/admin", label: "Admin" };

// ¿El enlace corresponde a la sección actual?
function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function SiteHeader({ nav = DEFAULT_NAV }: { nav?: NavItem[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useUser();
  const isAdmin = useIsAdmin();

  // Añade el enlace al panel solo si el usuario es admin.
  const items = isAdmin ? [...nav, ADMIN_NAV] : nav;

  return (
    <header className="sticky top-0 z-50 px-4 pt-4">
      <div className="mx-auto max-w-6xl">
        <Panel className="w-full">
          <div className="panel-inner flex items-center justify-between px-4 py-2.5">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
              <img
                src="/brand/dragon-trans.png"
                alt="Dragón de IMPERIUM"
                className="h-9 w-auto"
                style={{ filter: "drop-shadow(0 0 8px rgba(34,224,255,0.45))" }}
              />
              <span className="font-title text-base font-extrabold tracking-[0.15em] text-glow-accent">
                IMPERIUM
              </span>
            </Link>

            {/* Navegación escritorio */}
            <nav className="hidden items-center gap-6 md:flex">
              {items.map((i) => {
                const active = isActive(pathname, i.href);
                return (
                  <Link
                    key={i.href}
                    href={i.href}
                    aria-current={active ? "page" : undefined}
                    className={`hud-label text-[11px] transition ${active ? "text-accent" : "text-white/55 hover:text-accent"}`}
                  >
                    <span className="text-accent/60">{active ? "▸ " : ""}</span>
                    {i.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-3">
              {user ? (
                <div className="hidden items-center gap-2 sm:flex">
                  {user.avatar && (
                    <img src={user.avatar} alt="" className="h-8 w-8 rounded-full ring-1 ring-accent/40" />
                  )}
                  <span className="hud-label max-w-[110px] truncate text-[11px] text-white/70">{user.name}</span>
                  <form action="/auth/signout" method="post">
                    <button className="btn-hud bg-white/10 px-3 py-2 text-white">
                      <span className="hud-label text-[11px]">Salir</span>
                    </button>
                  </form>
                </div>
              ) : (
                <LoginButton className="btn-hud hidden items-center gap-2 bg-brand px-4 py-2 text-white sm:flex">
                  <DiscordIcon className="h-4 w-4" />
                  <span className="hud-label text-[11px]">Entrar</span>
                </LoginButton>
              )}

              {/* Botón hamburguesa (solo móvil) */}
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-label="Abrir menú"
                aria-expanded={open}
                className="grid h-9 w-9 place-items-center rounded-lg bg-white/5 ring-1 ring-white/10 md:hidden"
              >
                <span className="relative block h-4 w-5">
                  <span
                    className={`absolute left-0 block h-0.5 w-5 bg-accent transition-all ${open ? "top-1.5 rotate-45" : "top-0"}`}
                  />
                  <span
                    className={`absolute left-0 top-1.5 block h-0.5 w-5 bg-accent transition-all ${open ? "opacity-0" : "opacity-100"}`}
                  />
                  <span
                    className={`absolute left-0 block h-0.5 w-5 bg-accent transition-all ${open ? "top-1.5 -rotate-45" : "top-3"}`}
                  />
                </span>
              </button>
            </div>
          </div>
        </Panel>

        {/* Menú desplegable móvil */}
        {open && (
          <Panel className="mt-2 md:hidden">
            <div className="panel-inner flex flex-col gap-1 p-3">
              {items.map((i) => {
                const active = isActive(pathname, i.href);
                return (
                  <Link
                    key={i.href}
                    href={i.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={`hud-label rounded-lg px-3 py-3 text-xs transition hover:bg-white/5 ${active ? "bg-white/5 text-accent" : "text-white/70 hover:text-accent"}`}
                  >
                    <span className="text-accent/60">▸ </span>
                    {i.label}
                  </Link>
                );
              })}
              {user ? (
                <form action="/auth/signout" method="post" className="mt-2">
                  <button className="btn-hud flex w-full items-center justify-center gap-2 bg-white/10 px-4 py-3 text-white">
                    <span className="hud-label text-[11px]">Cerrar sesión · {user.name}</span>
                  </button>
                </form>
              ) : (
                <LoginButton className="btn-hud mt-2 flex w-full items-center justify-center gap-2 bg-brand px-4 py-3 text-white">
                  <DiscordIcon className="h-4 w-4" />
                  <span className="hud-label text-[11px]">Entrar con Discord</span>
                </LoginButton>
              )}
            </div>
          </Panel>
        )}
      </div>
    </header>
  );
}
