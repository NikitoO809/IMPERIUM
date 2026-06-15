-- ============================================================
-- IMPERIUM · Cola de aprobación de cambios
-- Cuando un admin o moderador crea/edita/elimina/publica contenido, el
-- cambio NO se aplica: se guarda aquí como "pendiente". El Supremo lo revisa
-- en una bandeja y lo aprueba (se aplica) o lo rechaza (se descarta).
-- El Supremo aplica sus propios cambios directo (no pasan por aquí).
-- ============================================================

create table if not exists public.change_requests (
  id          uuid primary key default gen_random_uuid(),
  author_id   uuid not null references auth.users(id) on delete cascade,
  action_key  text not null,              -- identifica la operación (p.ej. "updateGame")
  payload     jsonb not null default '{}', -- datos del formulario para re-ejecutarla al aprobar
  label       text not null default '',    -- descripción legible para la bandeja
  status      text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at  timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewer_id uuid references auth.users(id)
);
create index if not exists change_requests_status_idx on public.change_requests (status, created_at);
create index if not exists change_requests_author_idx on public.change_requests (author_id);

alter table public.change_requests enable row level security;

-- Insertar: cualquier staff, solo en su propio nombre.
drop policy if exists "cr: staff crea las suyas" on public.change_requests;
create policy "cr: staff crea las suyas"
  on public.change_requests for insert to authenticated
  with check (public.is_staff() and author_id = auth.uid());

-- Ver: el Supremo ve todas; cada autor ve las suyas.
drop policy if exists "cr: supremo o autor leen" on public.change_requests;
create policy "cr: supremo o autor leen"
  on public.change_requests for select to authenticated
  using (public.is_supremo() or author_id = auth.uid());

-- Aprobar / rechazar: solo el Supremo.
drop policy if exists "cr: supremo revisa" on public.change_requests;
create policy "cr: supremo revisa"
  on public.change_requests for update to authenticated
  using (public.is_supremo()) with check (public.is_supremo());

drop policy if exists "cr: supremo borra" on public.change_requests;
create policy "cr: supremo borra"
  on public.change_requests for delete to authenticated
  using (public.is_supremo());
