-- Storage policies for camper images uploads and public access
-- Ensure bucket exists (it already does per config), so we only add policies

-- Public read access to camper images
create policy "Public can read camper images"
  on storage.objects
  for select
  using (bucket_id = 'camper-images');

-- Allow authenticated users to upload images into their own folder (first path segment = auth.uid())
create policy "Users can upload their camper images"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'camper-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow authenticated users to update their own images
create policy "Users can update their camper images"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'camper-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow authenticated users to delete their own images
create policy "Users can delete their camper images"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'camper-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );