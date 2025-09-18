-- Broaden insert policy to allow any authenticated user to upload into 'camper-images' bucket
create policy if not exists "Authenticated can upload to camper-images"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'camper-images');