// Pasarela de juegos (home) — desfile HUD de portadas legendarias.
// Banda a todo el ancho, bucle infinito, se pausa al pasar el ratón.
// Decorativa: da ambiente "comunidad gamer"; no enlaza a guías.
"use client";

import Image from "next/image";

// Los mejores juegos de la historia (portadas en /public/pasarela).
// h = altura del panel en % del alto de la pasarela → forma la "cordillera".
type Game = { slug: string; name: string; year: number; genre: string; h: number };

const GAMES: Game[] = [
  { slug: "chrono-trigger", name: "Chrono Trigger", year: 1995, genre: "JRPG", h: 48 },
  { slug: "half-life2", name: "Half-Life 2", year: 2004, genre: "FPS", h: 57 },
  { slug: "portal2", name: "Portal 2", year: 2011, genre: "Puzzle", h: 50 },
  { slug: "skyrim", name: "Skyrim", year: 2011, genre: "RPG", h: 60 },
  { slug: "gtav", name: "GTA V", year: 2013, genre: "Mundo abierto", h: 54 },
  { slug: "tlou", name: "The Last of Us", year: 2013, genre: "Survival", h: 58 },
  { slug: "witcher3", name: "The Witcher 3", year: 2015, genre: "RPG", h: 62 },
  { slug: "mgsv", name: "Metal Gear Solid V", year: 2015, genre: "Sigilo", h: 49 },
  { slug: "dark-souls", name: "Dark Souls III", year: 2016, genre: "Souls", h: 59 },
  { slug: "doom", name: "DOOM", year: 2016, genre: "FPS", h: 52 },
  { slug: "hollow-knight", name: "Hollow Knight", year: 2017, genre: "Metroidvania", h: 47 },
  { slug: "rdr2", name: "Red Dead Redemption 2", year: 2018, genre: "Mundo abierto", h: 61 },
  { slug: "god-of-war", name: "God of War", year: 2018, genre: "Acción", h: 56 },
  { slug: "tetris", name: "Tetris Effect", year: 2018, genre: "Puzzle", h: 48 },
  { slug: "sekiro", name: "Sekiro", year: 2019, genre: "Acción", h: 57 },
  { slug: "disco-elysium", name: "Disco Elysium", year: 2019, genre: "RPG", h: 51 },
  { slug: "death-stranding", name: "Death Stranding", year: 2019, genre: "Aventura", h: 55 },
  { slug: "cyberpunk", name: "Cyberpunk 2077", year: 2020, genre: "RPG", h: 60 },
  { slug: "ff7", name: "Final Fantasy VII", year: 2020, genre: "JRPG", h: 53 },
  { slug: "hades", name: "Hades", year: 2020, genre: "Roguelike", h: 49 },
  { slug: "elden-ring", name: "Elden Ring", year: 2022, genre: "Souls", h: 62 },
  { slug: "baldurs-gate3", name: "Baldur's Gate 3", year: 2023, genre: "RPG", h: 58 },
  { slug: "resident-evil4", name: "Resident Evil 4", year: 2023, genre: "Terror", h: 54 },
  { slug: "cs2", name: "Counter-Strike 2", year: 2023, genre: "FPS", h: 50 },
];

function RunwayItem({ g }: { g: Game }) {
  const src = `/pasarela/${g.slug}.jpg`;
  return (
    <div className="rw-item" style={{ "--h": `${g.h}%` } as React.CSSProperties}>
      <div className="rw-prism">
        <Image
          src={src}
          alt={g.name}
          fill
          unoptimized
          className="rw-art"
          sizes="180px"
        />
        <span className="rw-brk rw-tr" />
        <span className="rw-brk rw-bl" />
        <div className="rw-cap">
          <div className="rw-cap-name">{g.name}</div>
          <div className="rw-cap-meta">
            <span className="rw-yr">{g.year}</span>
            <span className="rw-dot" />
            <span className="rw-gen">{g.genre}</span>
          </div>
        </div>
      </div>
      <div className="rw-reflect" aria-hidden>
        <Image src={src} alt="" fill unoptimized className="rw-art" sizes="180px" />
      </div>
    </div>
  );
}

export function GamesRunway() {
  // Duplicamos la lista para un bucle -50% sin costuras.
  const items = [...GAMES, ...GAMES];

  return (
    <section className="relative pb-24 pt-4" aria-label="Los juegos que hicieron historia">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <span className="eyebrow">Salón de la fama</span>
        <h2 className="font-display mt-4 text-3xl text-white sm:text-4xl">
          Los juegos que hicieron historia
        </h2>
        <p className="mt-4 max-w-[60ch] text-base leading-relaxed text-zinc-400">
          Dos décadas jugando. Estos son los títulos que nos marcaron. Pasa el ratón por
          encima para detener el desfile.
        </p>
      </div>

      <div className="rw-runway mt-10">
        <div className="rw-fade rw-fade-l" aria-hidden />
        <div className="rw-fade rw-fade-r" aria-hidden />
        <div className="rw-track">
          {items.map((g, i) => (
            <RunwayItem key={`${g.slug}-${i}`} g={g} />
          ))}
        </div>
        <div className="rw-floor" aria-hidden />
      </div>
    </section>
  );
}
