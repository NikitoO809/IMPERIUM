-- Reembolsa 1 al cupo diario del asistente del usuario actual (sin bajar de 0).
-- Se usa cuando la llamada a la IA falla sin entregar respuesta: no es justo que el
-- usuario pierda una de sus preguntas por un fallo del proveedor.
create or replace function public.assistant_refund()
returns void
language sql
security definer
set search_path to 'public'
as $$
  update public.assistant_usage
    set count = greatest(count - 1, 0)
    where user_id = auth.uid() and day = current_date;
$$;

-- Mismos permisos que assistant_try_consume: solo usuarios autenticados (nunca anon/public).
revoke execute on function public.assistant_refund() from public, anon;
grant execute on function public.assistant_refund() to authenticated;
