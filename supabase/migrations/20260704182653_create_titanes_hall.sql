-- Salón de los Titanes: club VIP/whales de la alianza (Call of Dragons).
-- Reemplaza la presentación de la Fama. Lectura pública de los publicados;
-- escritura solo admin (is_admin()). Aplicada por MCP (apply_migration).
create table if not exists public.titanes (
  id           uuid primary key default gen_random_uuid(),
  ign          text not null,                         -- nombre en el juego
  epiteto      text,                                  -- "El Rompemuros", etc.
  avatar_url   text,                                  -- opcional
  vip_level    int    not null default 0,
  power        bigint not null default 0,             -- poder total
  mythics      int    not null default 0,             -- héroes míticos
  castle_level int    not null default 0,
  tier         text   not null default 'oro'
               check (tier in ('diamante','rubi','oro')),
  is_founder   boolean not null default false,
  quote        text,                                  -- su frase / flex
  titan_since  date,
  sort_order   int,                                   -- override manual opcional
  is_published boolean not null default true,
  created_at   timestamptz not null default now()
);

-- Orden por defecto del salón: primero override manual, luego VIP y poder.
create index if not exists titanes_ranking_idx
  on public.titanes (sort_order nulls last, vip_level desc, power desc);

alter table public.titanes enable row level security;

-- Lectura: publicados para todos; los borradores solo el admin.
create policy "titanes_read"
  on public.titanes for select
  using (is_published or is_admin());

-- Escritura: solo admin (crear/editar/borrar).
create policy "titanes_write"
  on public.titanes for all
  using (is_admin())
  with check (is_admin());

-- Semilla de ejemplo (se puede borrar cuando se carguen los Titanes reales).
insert into public.titanes
  (ign, epiteto, vip_level, power, mythics, castle_level, tier, is_founder, quote)
values
  ('Emperor', 'El que nunca falla un cofre', 18, 92000000, 7, 30, 'diamante', true,
   'Ustedes ponen las tropas. Yo pongo el banco.'),
  ('Titan',   'El Coleccionista',            16, 78000000, 5, 30, 'rubi',     false, null),
  ('Kraken',  'El Inquebrantable',           15, 71000000, 4, 30, 'rubi',     false, null),
  ('Ghost',   'La Sombra Dorada',            13, 54000000, 3, 29, 'oro',      false, null),
  ('Valor',   'El Constante',                12, 49000000, 2, 28, 'oro',      false, null);
