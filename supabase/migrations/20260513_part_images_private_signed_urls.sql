-- Store only object paths in public.searches.image_url (not public URLs).
-- Existing rows: strip Supabase public object URL prefix when present.
UPDATE public.searches
SET image_url = regexp_replace(
  image_url,
  '^https?://[^/]+/storage/v1/object/public/part-images/',
  ''
)
WHERE image_url LIKE '%/storage/v1/object/public/part-images/%';

-- Private bucket: objects are not world-readable; app issues short-lived signed URLs.
UPDATE storage.buckets
SET public = false
WHERE id = 'part-images';
