"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type Rank, RANK_LABEL, RANK_BADGE, canPublish } from "@/lib/ranks";

type NavItem = { href: string; label: string; icon: string; exact: boolean; publishersOnly?: boolean };

const NAV: NavItem[] = [
  { href: "/admin", label: "Panel", icon: "▣", exact: true },
  { href: "/admin/proximos", label: "Próximos juegos", icon: "◆", exact: false, publishersOnly: true },
  { href: "/admin/horizonte", label: "MMORPG horizonte", icon: "✧", exact: false, publishersOnly: true },
  { href: "/admin/nosotros", label: "Nosotros", icon: "✦", exact: false, publishersOnly: true },
  { href: "/admin/miembros", label: "Miembros", icon: "◉", exact: false },
];

export function AdminSidebar({ rank }: { rank: Rank }) {
  const path = usePathname();

  function isActive(href: string, exact: boolean) {
    if (exact) return path === href;
    return path.startsWith(href);
  }

  // Filtra la navegación según el rango (Nosotros solo para admin/supremo).
  const items = NAV.filter((item) => !item.publishersOnly || canPublish(rank));

  return (
    <aside className="relative z-10 flex w-52 shrink-0 flex-col border-r border-white/10 bg-black/55 backdrop-blur-sm">
      {/* Logo */}
      <div className="border-b border-white/10 px-5 py-5">
        <div className="font-title text-sm font-extrabold tracking-[0.15em] text-glow-brand">
          ⬡ IMPERIUM
        </div>
        <div className="mt-0.5 font-hud text-[9px] tracking-[0.2em] text-white/35">ADMIN</div>
      </div>

      {/* Badge del rango actual */}
      <div className="border-b border-white/10 px-5 py-3">
        <span className="font-hud text-[8px] tracking-[0.2em] text-white/25">TU RANGO</span>
        <div className="mt-1.5">
          <span className={`inline-flex items-center rounded-md px-2 py-1 font-hud text-[10px] ring-1 ${RANK_BADGE[rank]}`}>
            {rank === "supremo" && <span className="mr-1">♛</span>}
            {RANK_LABEL[rank]}
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5">
        <p className="mb-2 px-2 font-hud text-[8px] tracking-[0.2em] text-white/25">MENÚ</p>
        <ul className="space-y-0.5">
          {items.map((item) => {
            const active = isActive(item.href, item.exact);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm transition-all ${
                    active
                      ? "border-l-2 border-accent bg-white/8 pl-2.5 font-medium text-accent"
                      : "text-white/50 hover:bg-white/5 hover:text-white/80"
                  }`}
                >
                  <span className="text-[11px]">{item.icon}</span>
                  <span className="font-hud">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-white/10 px-3 py-3">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm text-white/35 transition-all hover:bg-white/5 hover:text-white/70"
        >
          <span className="text-xs">←</span>
          <span className="font-hud text-[11px]">Ver sitio web</span>
        </Link>
      </div>
    </aside>
  );
}
