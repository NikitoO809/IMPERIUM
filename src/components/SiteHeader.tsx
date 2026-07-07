"use client";

// Cabecera del sitio: barra flotante neutra (glass), navegación y menú móvil.
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DiscordIcon, SearchIcon } from "@/components/icons";
import { openSearch } from "@/components/SearchPalette";
import { LoginButton } from "@/components/auth/LoginButton";
import { useUser } from "@/lib/use-user";
import { useIsAdmin } from "@/lib/use-is-admin";

type NavItem = { href: string; label: string };

const DEFAULT_NAV: NavItem[] = [
  { href: "/", label: "Inicio" },
  { href: "/juegos", label: "Guía" },
  { href: "/proximos", label: "Próximos" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/comunidad", label: "Comunidad" },
  { href: "/fama", label: "Fama" },
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
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/8 bg-zinc-950/60 px-4 py-2.5 backdrop-blur-xl">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/dragon-trans.png"
              alt="Dragón de IMPERIUM"
              className="tint-emblem h-8 w-auto"
            />
            <span className="font-display text-base font-semibold tracking-tight text-white">
              IMPERIUM
            </span>
          </Link>

          {/* Navegación escritorio */}
          <nav className="hidden items-center gap-7 md:flex">
            {items.map((i) => {
              const active = isActive(pathname, i.href);
              return (
                <Link
                  key={i.href}
                  href={i.href}
                  aria-current={active ? "page" : undefined}
                  className={`text-[13px] font-medium transition-colors ${active ? "text-gold" : "text-zinc-400 hover:text-white"}`}
                >
                  {i.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            {/* Buscador: mini-barra en escritorio, lupa en móvil (abre el panel Ctrl+K) */}
            <button
              type="button"
              onClick={openSearch}
              aria-label="Buscar"
              title="Buscar (Ctrl+K)"
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] text-zinc-400 transition-colors hover:border-white/24 hover:text-white lg:pl-3 lg:pr-2"
            >
              <span className="grid h-9 w-9 place-items-center lg:h-auto lg:w-auto lg:py-1.5">
                <SearchIcon className="h-4 w-4" />
              </span>
              <span className="hidden text-[13px] lg:inline">Buscar</span>
              <kbd className="hidden rounded border border-white/12 bg-white/5 px-1.5 py-0.5 font-hud text-[10px] text-zinc-500 lg:inline">
                Ctrl K
              </kbd>
            </button>

            {user ? (
              <div className="hidden items-center gap-2.5 sm:flex">
                <Link
                  href={`/u/${user.id}`}
                  title="Mi perfil"
                  className="group flex items-center gap-2.5"
                >
                  {user.avatar && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.avatar}
                      alt=""
                      className="h-8 w-8 rounded-full ring-1 ring-white/15 transition group-hover:ring-gold/50"
                    />
                  )}
                  <span className="max-w-[110px] truncate text-[13px] text-zinc-300 transition group-hover:text-white">
                    {user.name}
                  </span>
                </Link>
                <form action="/auth/signout" method="post">
                  <button className="rounded-full border border-white/12 px-3.5 py-1.5 text-[12px] font-medium text-zinc-300 transition-colors hover:border-white/24 hover:text-white">
                    Salir
                  </button>
                </form>
              </div>
            ) : (
              <LoginButton className="pill pill-primary hidden !py-2 !pl-4 !text-[13px] sm:inline-flex">
                <DiscordIcon className="h-4 w-4" />
                <span>Entrar</span>
              </LoginButton>
            )}

            {/* Botón hamburguesa (solo móvil) */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label="Abrir menú"
              aria-expanded={open}
              className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/[0.03] md:hidden"
            >
              <span className="relative block h-4 w-5">
                <span className={`absolute left-0 block h-0.5 w-5 bg-white transition-all ${open ? "top-1.5 rotate-45" : "top-0"}`} />
                <span className={`absolute left-0 top-1.5 block h-0.5 w-5 bg-white transition-all ${open ? "opacity-0" : "opacity-100"}`} />
                <span className={`absolute left-0 block h-0.5 w-5 bg-white transition-all ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
              </span>
            </button>
          </div>
        </div>

        {/* Menú desplegable móvil */}
        {open && (
          <div className="mt-2 rounded-2xl border border-white/8 bg-zinc-950/80 p-3 backdrop-blur-xl md:hidden">
            <div className="flex flex-col gap-1">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  openSearch();
                }}
                className="flex items-center gap-2.5 rounded-lg px-3 py-3 text-left text-sm font-medium text-zinc-300 transition-colors hover:bg-white/5 hover:text-white"
              >
                <SearchIcon className="h-4 w-4" />
                Buscar
              </button>
              {items.map((i) => {
                const active = isActive(pathname, i.href);
                return (
                  <Link
                    key={i.href}
                    href={i.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={`rounded-lg px-3 py-3 text-sm font-medium transition-colors ${active ? "bg-white/5 text-gold" : "text-zinc-300 hover:bg-white/5 hover:text-white"}`}
                  >
                    {i.label}
                  </Link>
                );
              })}
              {user ? (
                <>
                  <Link
                    href={`/u/${user.id}`}
                    onClick={() => setOpen(false)}
                    className="mt-1 rounded-lg px-3 py-3 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    Mi perfil
                  </Link>
                  <form action="/auth/signout" method="post" className="mt-1">
                    <button className="w-full rounded-full border border-white/12 px-4 py-3 text-sm font-medium text-zinc-300 hover:text-white">
                      Cerrar sesión · {user.name}
                    </button>
                  </form>
                </>
              ) : (
                <LoginButton className="pill pill-primary mt-2 w-full justify-center">
                  <DiscordIcon className="h-4 w-4" />
                  <span>Entrar con Discord</span>
                </LoginButton>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
