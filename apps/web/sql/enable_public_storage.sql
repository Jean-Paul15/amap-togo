-- Enable public read access on 'images' bucket
begin;
  -- Ensure the policy exists or is replaced
  drop policy if exists "Public Read Access" on storage.objects;
  
  create policy "Public Read Access"
  on storage.objects for select
  using ( bucket_id = 'images' );
commit;
