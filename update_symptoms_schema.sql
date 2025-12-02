-- Add bilingual name support to symptoms table
ALTER TABLE public.symptoms 
ADD COLUMN IF NOT EXISTS name_ar text,
ADD COLUMN IF NOT EXISTS name_en text;

-- Migrate existing data: copy 'name' to 'name_ar' (assuming current names are Arabic)
UPDATE public.symptoms 
SET name_ar = name 
WHERE name_ar IS NULL;

-- Optional: You might want to make name_ar NOT NULL after migration if you want to enforce it
-- ALTER TABLE public.symptoms ALTER COLUMN name_ar SET NOT NULL;
