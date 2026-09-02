-- ============================================================================
-- Storage bucket for CMS media (images/icons/videos). Public bucket — these
-- are marketing assets meant to be served directly, not private files —
-- but only admins may upload/replace/delete.
-- ============================================================================

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "media bucket: public read" on storage.objects
  for select using (bucket_id = 'media');

create policy "media bucket: admins insert" on storage.objects
  for insert with check (bucket_id = 'media' and public.is_admin());

create policy "media bucket: admins update" on storage.objects
  for update using (bucket_id = 'media' and public.is_admin())
  with check (bucket_id = 'media' and public.is_admin());

create policy "media bucket: admins delete" on storage.objects
  for delete using (bucket_id = 'media' and public.is_admin());
