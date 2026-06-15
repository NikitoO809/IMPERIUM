# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

IMPERIUM is the website for a Discord gaming community. It hosts interactive game guides (first game: Call of Dragons) with Discord login, per-game data sections (tier lists, codes, etc.), personal progress tracking, and a live community roster. The full product spec and build phases live in `IMPERIUM-claude-code.md` — read it before non-trivial feature work.

The user (Miguel) is a non-technical beginner on Windows. Explain in plain Spanish, step by step, recommend options, and ask before large or destructive changes. **The UI is Spanish; code comments are Spanish, identifiers are English.**

## Commands

```bash
npm install              # install deps
npm run dev              # dev server — uses --webpack ON PURPOSE (see below). Port 3000, falls back (often 3003)
npm run build            # production build (Turbopack — fine on Linux/Vercel)
npm run lint             # eslint
```

There are **no tests** configured. After code changes, verify by curling the running dev server (e.g. `curl -s -o /dev/null -w '%{http_code}' http://localhost:3003/<route>`) and grepping the dev log for `Syntax Error` / `⨯` — the dev server is usually already running in the background.

**Port note:** Port 3000 is often taken by another app (MellGas). IMPERIUM lands on **3003**. Always check with `curl http://localhost:3003/`.

### Critical: never remove `--webpack` from the `dev` script
Node 24 + Windows + Next 16's default Turbopack dev server is broken in this environment. The `dev` script is `next dev --webpack` and must stay that way. (`build` can use Turbopack — it runs on Linux/Vercel.)

## Architecture

Next.js 16 (App Router, `src/` dir), TypeScript, Tailwind v4, Supabase (Postgres + Auth + RLS), deployed on Vercel.

### Routing — route group `src/app/(app)/`
The real app lives in the `(app)` route group, which has a shared `layout.tsx` rendering the interactive background, `SiteHeader`, and `SiteFooter`. **Pages inside `(app)` must NOT render their own background/header/footer.** Structure:
- `/` home, `/juegos` (game list), `/nosotros` (sobre IMPERIUM: historia + administradores), `/comunidad`
- `/juegos/[slug]` — **game Hub**: a grid of 8 section panels defined in `GAME_SECTIONS` (`src/lib/demo-data.ts`)
- `/juegos/[slug]/{guias,heroes,war-pets,behemoths,artefactos,codigos,eventos,herramientas}` — `guias` and `heroes` have full content; generic sections render via `SectionContent` if DB has rows, else `SectionPlaceholder`
- `/juegos/[slug]/guias` — grid 2-col de tarjetas (`GuideListItem`), con `coverImage` = primera imagen de `intro_images`
- `/juegos/[slug]/guias/[guia]` — guía interactiva: sidebar de pasos + panel de contenido (`GuideRunner`)

`src/app/maquetas/*` are **design-reference mockups** (one per visual style, each with its own mouse-interactive background). They live OUTSIDE `(app)` and bring their own chrome. The chosen production style is "Neón HUD" (the `neon` mockup). Don't confuse these with real app pages.

`params` is a Promise in Next 16 — `const { slug } = await params;` in async server components.

### Design system (HUD / "inside a game")
All visual primitives are CSS in `src/app/globals.css` using `@theme` tokens + utility classes — **reuse these, don't reinvent**:
- `.panel` (+ `.panel-inner`, `.panel-accent`) — beveled panel with glowing border, via nested `clip-path`. Use the `Panel` component in `src/components/hud.tsx`.
- `.bevel`, `.corners` (corner brackets), `.hex`, `.xpbar`, `.btn-hud`, `.btn-ghost`, `.sweep`, `.lift`, `.rise`, `.scanlines`, `.text-glow-*`
- Fonts (in `layout.tsx`): Orbitron (`font-title`), Chakra Petch (`font-hud` / `.hud-label`), Inter (body). Palette: brand violet `#7c5cff`, accent cyan `#22e0ff`, rank amber `#ffcf5a`.
- Shared components: `hud.tsx` (`Panel`, `HudLabel`, `XpBar`), `icons.tsx` (hand-rolled SVGs), `backgrounds/` (client, mouse-interactive), `datos/HeroCards.tsx`.

### Auth (Supabase, Discord-only OAuth)
- `src/lib/supabase/client.ts` (browser) and `server.ts` (server components / route handlers) via `@supabase/ssr`.
- `src/middleware.ts` → `src/lib/supabase/middleware.ts` refreshes the session cookie each request.
- `src/app/auth/callback/route.ts` exchanges the OAuth code; `src/app/auth/signout/route.ts` signs out.
- `SUPABASE_CONFIGURED` (`auth-config.ts`) guards everything: **if `.env.local` keys are missing the site still runs, login just no-ops.** Keep new auth code behind this guard.
- `useUser()` (`src/lib/use-user.ts`) gives the current user in client components; `SiteHeader` and `LoginButton` use it.
- The `profiles` table is created automatically on first login by a Postgres trigger (`handle_new_user`) — do NOT create profiles from app code. RLS: anyone authenticated can read profiles (for the roster), each user edits only their own.

### Supabase access
Supabase is connected via the **hosted MCP server** (`.mcp.json`, OAuth — no secrets in the file). Use the `mcp__supabase__*` tools to inspect/modify the DB: `list_tables`, `apply_migration` (DDL), `execute_sql`, `get_advisors` (run after DDL — it catches missing RLS). SQL migrations are also saved in `supabase/migrations/`. The Supabase CLI is installed as a devDependency (`npx supabase`) but the MCP is the primary path. Project ref: `fihjqermiqhuubwepfcc`.

**Key tables:** `games` → `guides` (+ `intro_title`, `intro`, `intro_images text[]`) → `guide_steps` (+ `images text[]`, `source_url`, `is_verified`) → `step_progress`. Generic sections: `game_sections` + `section_blocks` (same shape as guide_steps). User data: `profiles` (auto-created by trigger). For bulk inserts use dollar-quoting `$tag$…$tag$` to safely embed accents and quotes.

**RLS summary:** guides only visible if `is_published = true` AND game is published — drafts require admin session. `step_progress` is user-owned. Admins identified by `is_admin()` function.

### Data & content
- `src/lib/demo-data.ts` — games → guides → steps (mirrors the real DB model: `source_url`, `is_verified`) + `GAME_SECTIONS`. **Not what the live site reads** when Supabase is configured — it's a fallback only.
- `src/lib/games.ts` — all Supabase queries: `fetchGameTree`, `getGuidesForGame`, `getGuide`. `GuideSummary.coverImage` = `guides.intro_images[0]` — always set this when scraping a guide or the card header will be empty. RLS hides unpublished guides from anon users; admins see everything when logged in.
- `src/lib/sections.ts` — `getSectionContent` / `getReadySections` for the generic section pages (`game_sections` + `section_blocks` tables). Type is `Block` (not `SectionBlock`).
- `src/lib/cod-heroes.ts` — Call of Dragons hero tier list + seasons; rendered by `HeroCards` with tier/class/best-role filters and a season selector.
- Content is **scraped from sources the user provides** (e.g. `cod.guide`) — never invent Call of Dragons facts. Scraping scripts live in `scripts/` (Python 3.12, `requests` + `beautifulsoup4` installed). Placeholder/unverified content is marked `[EJEMPLO — reemplazar]`. Each guide step keeps its `source_url`.
- Images are linked from origin (never downloaded unless hotlinking breaks). Add new external domains to `next.config.ts` `remotePatterns` and **restart dev server** — config changes don't hot-reload. Current allowed: `eog.gg`, `www.allclash.com`, `cdn.cod.guide`. Use `unoptimized` on `<Image>` for externally-hosted game assets (serves the original file, avoids Next.js recompression).
- **Image display rules:** `object-contain` + `bg-black/40` for icons/artifacts/portraits (never crop them). `object-cover` only for landscape hero-banner images (card headers, intro images). Card headers in Hub and guide list use `h-36`/`h-40` + `object-cover` + overlay (`bg-gradient-to-t from-black/80` + `bg-brand/25 mix-blend-color` + `scanlines opacity-20`) + zoom on hover (`group-hover:scale-105`).
- Hero portraits in `public/heroes/`, dragon logo at `public/brand/dragon-trans.png` (produced with ffmpeg, no ImageMagick).

### Hub section covers
`src/app/(app)/juegos/[slug]/page.tsx` has a `SECTION_COVERS` constant (`Record<gameSlug, Record<sectionSlug, imageUrl>>`) for card background images per game. When a new game is added, populate its entry here. Call of Dragons covers are all from `cdn.cod.guide`.

### Scraping workflow (skill `montar-guia`)
- **`guias` section** → inserts into `guides` + `guide_steps`. Must also set `guides.intro_images[0]` (card cover).
- **Other sections** (`artefactos`, `eventos`, `codigos`…) → inserts into `game_sections` + `section_blocks`.
- Use dollar-quoting with the standard tag `$IMPERIUM$…$IMPERIUM$` for bulk SQL to handle accents/quotes safely. Verify that no content string literally contains `$IMPERIUM$` before running.
- For large SQL (>200 lines), delegate execution to a subagent to avoid inflating main context.

### Special content formats in `section_blocks.content`
`SectionContent.tsx` detects magic prefixes and renders specially:
- `__TABLE__{json}` — generic HUD table (headers + rows as plain text)
- `__ARTIFACT_TABLE__{json}` — artifact table with artifact icon + hero portrait images; JSON shape: `{name, artifact_img, tier, types, hero_images[], hero_label, range, attributes}[]`
- `__BUILDS__{json}` — builds viewer; one block per tier. JSON shape: `{tier, label, coming_soon?, classes: [{class, class_es, icon?, builds: [{name, mode:"PvE"|"PvP", techniques:[{name,img}], enchants:[{name,img}], desc}]}]}`. Skill image URLs: `https://eog.gg/assets/sxs/skills/{kebab-slug}.webp`.

### Section-specific viewers
`src/app/(app)/juegos/[slug]/[seccion]/page.tsx` resolves a `render_type` (`rt`) and selects the renderer. Priority: `game_sections.render_type` column from the DB (if not `"generic"`), then slug-based fallback for `artefactos`/`behemoths`.

| `rt` value | Component | Page width |
|---|---|---|
| `artifact-table` | `ArtifactosViewer` | `max-w-6xl` |
| `tier-list` | `TierListViewer` | `max-w-6xl` |
| `behemoth` | `BehemothsViewer` | `max-w-5xl` |
| `builds` | `BuildsViewer` | `max-w-4xl` |
| `class-tier` | `ClassTierViewer` | `max-w-5xl` |
| `roadmap` | `RoadmapViewer` | `max-w-3xl` |
| `generic` | `SectionContent` | `max-w-3xl` |

`ArtifactosViewer` classifies blocks by `orderIndex`: 1 = descripción, 2 = tabla héroes, 3–52 = artefactos individuales, 53+ = guías. Tier is inferred from order range (4–21 Legendary, 22–36 Epic, 37–46 Elite, 47–52 Advanced).

`BuildsViewer` (`src/components/BuildsViewer.tsx`) is a client component. It reads all `__BUILDS__` blocks from the section, renders tier tabs, class tabs per tier, and an All/PvE/PvP mode filter. Tiers with `coming_soon: true` show a locked placeholder. Generated by `scripts/gen_sxs_builds_v2.py` → `scripts/sql/sxs_builds.sql`; always use the dollar-quoting tag `$IMPERIUM$` (the generator enforces this — never use a content string that contains `$IMPERIUM$`).

`ClassTierViewer` (`src/components/ClassTierViewer.tsx`) is a client component for the SxS Tier List. It reads blocks with magic prefixes: `__CTIER__{json}` (one per CLASS region T1–T5: `{tier,tierKey,region,subtitle,notes[],classes[]}` where each class has `grades` keyed by mode `PvE`/`Dragon & Chaos`/`PvP`/`4v4`, each `{grade,desc}`) and `__FTIER__{json}` (the FANTOMON view: `{context,intro,groups[],breakpoints[],plans[]}`). Renders CLASS/FANTOMON tabs, region sub-tabs, a class×mode matrix with color-coded grades, and a per-class detail panel. Pipeline: `scripts/scrapers/eog_sxs_tierlist.py` (Playwright extract, the page is a JS SPA) → `parse_sxs_tierlist.py` → translate → `scripts/gen_sxs_tierlist.py` → canonical JSON → `build_sql.py`.

## Product rules (from `IMPERIUM-claude-code.md`)
- Login is **Discord OAuth only** — no email/password.
- Don't publish unverified content; respect `is_verified` and per-user `progress_visible` (privacy).
- Enforce permissions with RLS: users edit only their own progress; only admins write games/guides/steps.
- Build in phases, don't skip: 0 setup ✅ · 1 auth ✅ · 2 guides+progress ✅ · 3 roster realtime ✅ · 4 admin panel ✅.
