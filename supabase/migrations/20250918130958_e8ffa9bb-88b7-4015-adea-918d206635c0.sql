create policy "Authenticated users can upload to camper-images"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'camper-images');