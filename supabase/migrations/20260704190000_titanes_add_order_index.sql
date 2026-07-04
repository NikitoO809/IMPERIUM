-- Orden manual de los Titanes para el panel de admin (reutiliza el swapOrder
-- compartido, que opera sobre order_index). Backfill con el orden inicial
-- (sort_order → VIP → poder). Aplicada por MCP (apply_migration).
alter table public.titanes add column if not exists order_index int not null default 0;

with r as (
  select id, row_number() over (order by sort_order nulls last, vip_level desc, power desc) as rn
  from public.titanes
)
update public.titanes t set order_index = r.rn from r where t.id = r.id;

create index if not exists titanes_order_idx on public.titanes (order_index);
