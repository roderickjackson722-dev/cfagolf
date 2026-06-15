UPDATE public.free_resources
SET file_path = split_part(file_url, '/free-resources/', 2)
WHERE file_path IS NULL AND file_url LIKE '%/free-resources/%';