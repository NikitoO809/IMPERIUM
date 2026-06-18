-- Bucket público para VÍDEOS subidos (los logros también admiten enlaces de
-- YouTube, que no usan Storage). Límite 50 MB. Mismas políticas que "content":
-- lectura pública, el staff sube, el dueño o un admin edita/borra.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media', 'media', true, 52428800,
  array['video/mp4','video/webm','video/quicktime','video/ogg']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

create policy "media: lectura publica"
  on storage.objects for select
  using (bucket_id = 'media');

create policy "media: staff sube"
  on storage.objects for insert
  with check (bucket_id = 'media' and is_staff());

create policy "media: dueno o admin actualiza"
  on storage.objects for update
  using (bucket_id = 'media' and (owner = auth.uid() or is_admin()))
  with check (bucket_id = 'media');

create policy "media: dueno o admin borra"
  on storage.objects for delete
  using (bucket_id = 'media' and (owner = auth.uid() or is_admin()));
