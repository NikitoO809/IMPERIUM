// Lista curada de MMORPG próximos más esperados.
// Fuente de los datos: ranking "Highest Hyped" + fichas de
// https://www.mmorpg.com/games (extraído el 2026-06-14). Cada juego enlaza a
// su FICHA en mmorpg.com (infoUrl). NO es la página oficial de preregistro:
// cuando exista un enlace oficial, rellena `preRegisterUrl` y el botón pasará
// a "Preregistrarse". `hype` es la puntuación de expectación de la comunidad.
//
// Las imágenes son los logos oficiales que sirve mmorpg.com (PNG con
// transparencia, ~125px): se muestran centrados sin recorte (object-contain).
// La fecha de lanzamiento de la web es poco fiable (contradice el estado), por
// eso no se incluye: añade `releaseWindow` solo con un dato real y verificado.

export type PreRegisterGame = {
  key: string; // clave estable y única
  name: string;
  genre: string; // p.ej. "MMORPG", "MMO de acción", "ARPG"
  status: string; // estado del desarrollo: "En desarrollo", "Beta", ...
  hype?: number; // puntuación de expectación (mmorpg.com)
  platforms?: string[]; // p.ej. ["PC", "PS5"]
  developer?: string; // estudio
  publisher?: string; // editora
  releaseWindow?: string; // p.ej. "2026" (solo si es fiable)
  blurb: string; // una frase
  image: string | null; // logo (null → degradado con el nombre)
  infoUrl: string; // ficha del juego (mmorpg.com) — siempre presente
  website?: string; // web OFICIAL del juego (verificada). El botón "Ver juego"
  //                   la usa si existe; si no, cae a infoUrl (ficha).
  preRegisterUrl?: string; // enlace OFICIAL de preregistro, si existe
};

const MMORPG = "https://www.mmorpg.com";
const LOGO = "https://images.mmorpg.com/images/games/logos/32";

export const PREREGISTER_GAMES: PreRegisterGame[] = [
  {
    key: "chrono-odyssey",
    name: "Chrono Odyssey",
    genre: "MMO de acción",
    status: "En desarrollo",
    hype: 9.5,
    platforms: ["PC", "Consolas", "Móvil"],
    developer: "Kakao Games",
    blurb: "MMO de acción de mundo abierto. El más esperado según MMORPG.com.",
    image: `${LOGO}/1729_32.png?cb=DFC1F202AF68D2BDE5FD8780F3349200`,
    infoUrl: `${MMORPG}/chrono-odyssey`,
    website: "https://chronoodyssey.kakaogames.com/",
  },
  {
    key: "path-of-exile-2",
    name: "Path of Exile 2",
    genre: "ARPG",
    status: "En desarrollo",
    hype: 9.0,
    developer: "Grinding Gear Games",
    blurb: "ARPG de acción muy esperado por la comunidad.",
    image: `${LOGO}/1737_32.png?cb=8A49B519D5661DCDFE48688DD653859A`,
    infoUrl: `${MMORPG}/path-of-exile-2`,
    website: "https://pathofexile2.com/",
  },
  {
    key: "blue-protocol",
    name: "Blue Protocol",
    genre: "MMORPG",
    status: "En desarrollo",
    hype: 8.8,
    developer: "Bandai Namco",
    publisher: "Bandai Namco",
    blurb: "MMORPG de estética anime entre los más esperados del momento.",
    image: `${LOGO}/1630_32.png?cb=085EEBA2173A4143E3AE66F819395499`,
    infoUrl: `${MMORPG}/blue-protocol`,
  },
  {
    key: "fractured-veil",
    name: "Fractured Veil",
    genre: "MMO de acción",
    status: "En desarrollo",
    hype: 8.6,
    developer: "Paddle Creek Games",
    blurb: "MMO de acción y supervivencia en desarrollo.",
    image: `${LOGO}/1829_32.png?cb=044605B4C5C382FB447D4BAC9FED7F37`,
    infoUrl: `${MMORPG}/fractured-veil`,
  },
  {
    key: "palia",
    name: "Palia",
    genre: "MMO",
    status: "Beta",
    hype: 8.3,
    platforms: ["PC", "Switch"],
    developer: "Singularity 6",
    blurb: "MMO acogedor de vida y comunidad, en fase beta.",
    image: `${LOGO}/1769_32.png?cb=86598693DBD7EB68624A340C819042B9`,
    infoUrl: `${MMORPG}/palia`,
    website: "https://palia.com/",
  },
  {
    key: "throne-and-liberty",
    name: "Throne and Liberty",
    genre: "MMORPG",
    status: "Por confirmar",
    hype: 8.1,
    platforms: ["PC", "PS5"],
    developer: "NCSoft",
    publisher: "Amazon Games",
    blurb: "MMORPG de gran escala con combate dinámico.",
    image: `${LOGO}/1807_32.png?cb=EDF0ACD84E3FF7C3422EDA8C820144A4`,
    infoUrl: `${MMORPG}/throne-and-liberty`,
    website: "https://www.playthroneandliberty.com/",
  },
  {
    key: "archeage-chronicles",
    name: "ArcheAge Chronicles",
    genre: "MMO de acción",
    status: "En desarrollo",
    platforms: ["PC", "Xbox Series", "PS5"],
    developer: "XLGAMES",
    publisher: "Kakao Games",
    blurb: "Nueva entrega de la saga ArcheAge, en desarrollo.",
    image: `${LOGO}/1832_32.png?cb=CB21BBE62F47AA20D773667B53F9719B`,
    infoUrl: `${MMORPG}/archeage-chronicles`,
    website: "https://archeagechronicles.kakaogames.com/",
  },
  {
    key: "iron-and-magic",
    name: "Iron and Magic",
    genre: "MMORPG",
    status: "En desarrollo",
    developer: "DeHorizon",
    blurb: "MMORPG en desarrollo. Sigue sus novedades en la ficha.",
    image: `${LOGO}/1822_32.png?cb=1808639C1F97DA464B5D0D66B4BA0AF2`,
    infoUrl: `${MMORPG}/iron-and-magic`,
  },
  {
    key: "legacy-steel-and-sorcery",
    name: "Legacy: Steel & Sorcery",
    genre: "ARPG",
    status: "En desarrollo",
    developer: "Notorious Studios",
    blurb: "Acción PvPvE de extracción y fantasía, en desarrollo.",
    image: `${LOGO}/1814_32.png?cb=AEEB711BBE0CA79558CC676F788F134D`,
    infoUrl: `${MMORPG}/legacy-steel-and-sorcery`,
    website: "https://www.playlegacy.gg/",
  },
  {
    key: "the-hidden-ones",
    name: "The Hidden Ones",
    genre: "ARPG",
    status: "En desarrollo",
    developer: "Morefun Studios",
    publisher: "Tencent",
    blurb: "ARPG en desarrollo entre los más vigilados de la comunidad.",
    image: `${LOGO}/1907_32.png?cb=C465E230447ADF05797E3877778C9895`,
    infoUrl: `${MMORPG}/the-hidden-ones`,
    website: "https://morefunstudios.com/",
  },
];
